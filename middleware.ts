import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { updateSession } from './lib/supabase/middleware';
import { NextRequest } from 'next/server';

const handleI18nRouting = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  // First handle i18n routing
  const response = handleI18nRouting(request);
  
  // Then update supabase session and check auth
  return await updateSession(request, response);
}

export const config = {
  matcher: ['/', '/(tr|en)/:path*', '/((?!_next|_vercel|.*\\..*).*)']
};
