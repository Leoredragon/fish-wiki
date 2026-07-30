export function getMembershipMonths(createdAt?: string | null): number {
  if (!createdAt) return 0;
  const start = new Date(createdAt).getTime();
  if (Number.isNaN(start)) return 0;
  const months = Math.floor((Date.now() - start) / (1000 * 60 * 60 * 24 * 30.44));
  return Math.max(0, months);
}

export function formatMembershipLabel(createdAt: string | null | undefined, isTr: boolean): string {
  if (!createdAt) return isTr ? 'Yeni üye' : 'New member';
  const months = getMembershipMonths(createdAt);
  if (months < 1) return isTr ? 'Bu ay katıldı' : 'Joined this month';
  if (months < 12) return isTr ? `${months} aydır üye` : `Member for ${months} mo`;
  const years = Math.floor(months / 12);
  const rem = months % 12;
  if (rem === 0) return isTr ? `${years} yıldır üye` : `Member for ${years}y`;
  return isTr ? `${years}y ${rem}ay üye` : `Member ${years}y ${rem}mo`;
}

/** Transparent activity badge — not a verification claim */
export function getActivityBadge(catchCount: number, isTr: boolean): string {
  if (catchCount >= 25) return isTr ? 'Aktif avcı' : 'Active angler';
  if (catchCount >= 10) return isTr ? 'Düzenli kayıt' : 'Regular logger';
  if (catchCount >= 3) return isTr ? 'Kayıt açıyor' : 'Getting started';
  return isTr ? 'Yeni avcı' : 'New angler';
}
