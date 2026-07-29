type OltaAppLogoProps = {
  className?: string;
  title?: string;
  /** Use round launcher variant when a circular crop looks better */
  round?: boolean;
};

/**
 * Same artwork as the Android launcher icon (ic_launcher.png).
 * Source: android/app/src/main/res/mipmap-xxxhdpi/
 */
export default function OltaAppLogo({
  className = 'w-10 h-10',
  title = 'Oltapp',
  round = false
}: OltaAppLogoProps) {
  const src = round ? '/olta-app-icon-round.png' : '/olta-app-icon.png';

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={title}
      width={192}
      height={192}
      draggable={false}
      className={`object-contain select-none ${className}`}
    />
  );
}
