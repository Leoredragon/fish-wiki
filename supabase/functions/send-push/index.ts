// send-push: FCM v1 push sender triggered by the notifications table webhook.
// Auth: custom x-push-secret header (stored in Supabase Vault), NOT JWT.
import { createClient } from 'npm:@supabase/supabase-js@2';

const admin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

let cachedToken: { token: string; exp: number } | null = null;

function b64url(data: Uint8Array | string): string {
  const bytes = typeof data === 'string' ? new TextEncoder().encode(data) : data;
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function getAccessToken(sa: { client_email: string; private_key: string }): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  if (cachedToken && cachedToken.exp > now + 60) return cachedToken.token;

  const header = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claims = b64url(
    JSON.stringify({
      iss: sa.client_email,
      scope: 'https://www.googleapis.com/auth/firebase.messaging',
      aud: 'https://oauth2.googleapis.com/token',
      iat: now,
      exp: now + 3600,
    })
  );
  const unsigned = `${header}.${claims}`;

  const pem = sa.private_key.replace(/-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----|\s/g, '');
  const keyBytes = Uint8Array.from(atob(pem), (c) => c.charCodeAt(0));
  const key = await crypto.subtle.importKey(
    'pkcs8',
    keyBytes,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = new Uint8Array(await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(unsigned)));
  const jwt = `${unsigned}.${b64url(sig)}`;

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=${encodeURIComponent('urn:ietf:params:oauth:grant-type:jwt-bearer')}&assertion=${jwt}`,
  });
  const json = await res.json();
  if (!json.access_token) throw new Error('FCM token exchange failed: ' + JSON.stringify(json));
  cachedToken = { token: json.access_token, exp: now + 3500 };
  return json.access_token;
}

function buildMessage(record: Record<string, unknown>): { title: string; body: string } {
  const actor = (record.actor_name as string) || 'Bir balıkçı';
  switch (record.type) {
    case 'like':
      return { title: 'Yeni tebrik! 🎣', body: `${actor} avını tebrik etti.` };
    case 'comment':
      return { title: 'Yeni yorum 💬', body: `${actor} avına yorum yaptı.` };
    case 'follow':
      return { title: 'Yeni takipçi 🐟', body: `${actor} seni takip etmeye başladı.` };
    default:
      return { title: 'Olta App', body: `${actor} ile ilgili yeni bir bildirimin var.` };
  }
}

Deno.serve(async (req: Request) => {
  try {
    // Custom webhook authentication via shared secret from Vault
    const provided = req.headers.get('x-push-secret') || '';
    const { data: expected } = await admin.rpc('get_push_webhook_secret');
    if (!expected || provided !== expected) {
      return new Response('unauthorized', { status: 401 });
    }

    const { record } = await req.json();
    if (!record?.user_id) return new Response('missing record', { status: 400 });

    const { data: tokens } = await admin.from('push_tokens').select('token').eq('user_id', record.user_id);
    if (!tokens || tokens.length === 0) {
      return new Response(JSON.stringify({ sent: 0, reason: 'no tokens' }), { status: 200 });
    }

    const { data: saRaw } = await admin.rpc('get_firebase_service_account');
    if (!saRaw) {
      return new Response(JSON.stringify({ sent: 0, reason: 'service account not configured' }), { status: 200 });
    }
    const sa = JSON.parse(saRaw);

    const { title, body } = buildMessage(record);
    const accessToken = await getAccessToken(sa);

    let sent = 0;
    await Promise.all(
      tokens.map(async ({ token }: { token: string }) => {
        const res = await fetch(`https://fcm.googleapis.com/v1/projects/${sa.project_id}/messages:send`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: {
              token,
              notification: { title, body },
              android: {
                priority: 'high',
                notification: { icon: 'ic_notification', color: '#10B981', channel_id: 'social' },
              },
              data: {
                type: String(record.type || ''),
                catch_id: String(record.catch_id || ''),
              },
            },
          }),
        });
        if (res.ok) {
          sent += 1;
        } else {
          const errText = await res.text();
          // Remove dead device tokens so we stop retrying them
          if (errText.includes('UNREGISTERED') || errText.includes('NOT_FOUND')) {
            await admin.from('push_tokens').delete().eq('token', token);
          }
          console.error('FCM send failed:', res.status, errText.slice(0, 300));
        }
      })
    );

    return new Response(JSON.stringify({ sent }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('send-push error:', e);
    return new Response('error: ' + (e as Error).message, { status: 500 });
  }
});
