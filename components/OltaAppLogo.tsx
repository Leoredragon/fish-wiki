type OltaAppLogoProps = {
  className?: string;
  title?: string;
};

/** Matches Android launcher foreground (ic_launcher_foreground.xml) */
export default function OltaAppLogo({
  className = 'w-10 h-10',
  title = 'Oltapp'
}: OltaAppLogoProps) {
  return (
    <svg
      viewBox="0 0 108 108"
      role="img"
      aria-label={title}
      className={className}
    >
      <title>{title}</title>
      <path
        fill="#10B981"
        d="M30,30 h48 a12,12 0 0 1 12,12 v36 a12,12 0 0 1 -12,12 h-48 a12,12 0 0 1 -12,-12 v-36 a12,12 0 0 1 12,-12 z"
      />
      <path
        fill="#0F172A"
        d="M34,54 C40,42 52,38 64,42 C72,45 78,50 82,54 C78,58 72,63 64,66 C52,70 40,66 34,54 Z"
      />
      <path fill="#0F172A" d="M34,54 L24,46 L24,62 Z" />
      <circle cx="70" cy="50.05" r="2.5" fill="#F8FAFC" />
    </svg>
  );
}
