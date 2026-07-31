import { setRequestLocale } from 'next-intl/server';
import { ShieldCheck, Trash2, Mail, Clock } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return {
    title: locale === 'tr' ? 'Hesap Silme Talebi | Oltapp' : 'Account Deletion Request | Oltapp',
    description:
      locale === 'tr'
        ? 'Oltapp hesabınızın ve ilişkili tüm verilerinizin silinmesini nasıl talep edeceğinizi öğrenin.'
        : 'Learn how to request deletion of your Oltapp account and all associated data.',
  };
}

export default async function AccountDeletionPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isTr = locale === 'tr';

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16 pt-6 px-4">
      <div className="bg-[#0F172A] text-white rounded-3xl p-8 sm:p-10 border border-slate-800 shadow-xl space-y-3">
        <div className="inline-flex items-center space-x-2 bg-rose-500/10 border border-rose-500/30 text-rose-400 px-3.5 py-1 rounded-full text-xs font-bold">
          <Trash2 className="w-4 h-4" />
          <span>{isTr ? 'Hesap ve Veri Silme' : 'Account & Data Deletion'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
          {isTr ? 'Hesap Silme Talebi' : 'Account Deletion Request'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
          {isTr
            ? 'Oltapp hesabınızı ve hesabınıza bağlı tüm kişisel verileri kalıcı olarak silmeyi talep edebilirsiniz.'
            : 'You can request permanent deletion of your Oltapp account and all personal data associated with it.'}
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm space-y-8 text-slate-700 text-sm leading-relaxed">
        <div className="space-y-3">
          <h2 className="text-lg font-extrabold text-[#0F172A] flex items-center space-x-2 border-b border-slate-100 pb-2">
            <Mail className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{isTr ? 'Nasıl Talep Edilir?' : 'How to Request Deletion'}</span>
          </h2>
          <p>
            {isTr
              ? 'Hesabınızın silinmesi için kayıtlı e-posta adresinizden aşağıdaki adrese "Hesap Silme Talebi" konulu bir e-posta göndermeniz yeterlidir:'
              : 'To delete your account, simply send an email with the subject "Account Deletion Request" from your registered email address to:'}
          </p>
          <a
            href="mailto:1317838@gmail.com?subject=Hesap%20Silme%20Talebi"
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-sm font-bold text-emerald-700 hover:bg-emerald-100 transition-colors"
          >
            <Mail className="w-4 h-4" />
            <span>1317838@gmail.com</span>
          </a>
          <p className="text-xs text-slate-500">
            {isTr
              ? 'Talebinizin doğrulanabilmesi için e-postayı Oltapp hesabınıza kayıtlı adresten göndermeniz gerekmektedir.'
              : 'The email must be sent from the address registered to your Oltapp account so we can verify the request.'}
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-extrabold text-[#0F172A] flex items-center space-x-2 border-b border-slate-100 pb-2">
            <Trash2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{isTr ? 'Hangi Veriler Silinir?' : 'What Data Is Deleted?'}</span>
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 font-medium text-slate-600">
            <li>{isTr ? 'Hesap bilgileri (e-posta, kullanıcı adı, profil fotoğrafı, şehir, biyografi)' : 'Account information (email, username, avatar, city, bio)'}</li>
            <li>{isTr ? 'Av günlükleri ve av fotoğrafları' : 'Catch logs and catch photos'}</li>
            <li>{isTr ? 'Topluluk gönderileri, yorumlar, hikayeler ve beğeniler' : 'Community posts, comments, stories and likes'}</li>
            <li>{isTr ? 'Takip ilişkileri ve bildirimler' : 'Follow relationships and notifications'}</li>
            <li>{isTr ? 'Eklediğiniz mera (konum) kayıtları' : 'Fishing spot (location) records you added'}</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-extrabold text-[#0F172A] flex items-center space-x-2 border-b border-slate-100 pb-2">
            <Clock className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{isTr ? 'Silme Süresi' : 'Deletion Timeline'}</span>
          </h2>
          <p>
            {isTr
              ? 'Talebiniz alındıktan sonra hesabınız ve tüm ilişkili verileriniz en geç 30 gün içinde kalıcı olarak silinir. Yasal yükümlülükler gerektirmedikçe hiçbir veri saklanmaz.'
              : 'After your request is received, your account and all associated data are permanently deleted within 30 days. No data is retained unless required by law.'}
          </p>
        </div>

        <div className="p-4 sm:p-5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start space-x-3 text-emerald-950 font-medium text-xs sm:text-sm">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            {isTr
              ? 'Silme işlemi geri alınamaz. İşlem tamamlandığında kayıtlı e-posta adresinize onay bildirimi gönderilir.'
              : 'Deletion is irreversible. A confirmation is sent to your registered email address once the process is complete.'}
          </div>
        </div>
      </div>
    </div>
  );
}
