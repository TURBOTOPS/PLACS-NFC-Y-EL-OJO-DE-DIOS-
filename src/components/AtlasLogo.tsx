interface AtlasLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export default function AtlasLogo({ className = '', size = 'md', showSubtitle = true }: AtlasLogoProps) {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  const subSizes = {
    sm: 'text-[9px] tracking-[0.25em]',
    md: 'text-[11px] tracking-[0.28em]',
    lg: 'text-[13px] tracking-[0.32em]',
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Geometric A emblem matching the flyer */}
      <div className={`relative ${iconSizes[size]} shrink-0 flex items-center justify-center`}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_0_12px_rgba(0,163,255,0.6)]">
          {/* Left / Top White Prong */}
          <path
            d="M50 10L18 86H36L50 52L64 86H82L50 10Z"
            fill="url(#atlasWhiteGrad)"
          />
          {/* Inner Cyan Wing Bridge */}
          <path
            d="M36 68L50 36L64 68H48L42 84H28L36 68Z"
            fill="url(#atlasCyanGrad)"
          />
          {/* Dynamic lower blue accent */}
          <path
            d="M48 68L64 86H50L42 74L48 68Z"
            fill="#0055FF"
          />
          <defs>
            <linearGradient id="atlasCyanGrad" x1="28" y1="36" x2="64" y2="84" gradientUnits="userSpaceOnUse">
              <stop stopColor="#38BDF8" />
              <stop offset="0.5" stopColor="#00A3FF" />
              <stop offset="1" stopColor="#0066FF" />
            </linearGradient>
            <linearGradient id="atlasWhiteGrad" x1="18" y1="10" x2="82" y2="86" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFFFFF" />
              <stop offset="0.8" stopColor="#E2E8F0" />
              <stop offset="1" stopColor="#94A3B8" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Brand Wordmark */}
      <div className="flex flex-col justify-center leading-none">
        <span className={`font-display font-extrabold uppercase text-white tracking-wider ${textSizes[size]}`}>
          Atlas
        </span>
        {showSubtitle && (
          <span className={`font-sans font-semibold uppercase text-neutral-400 mt-1 ${subSizes[size]}`}>
            Automatizaciones
          </span>
        )}
      </div>
    </div>
  );
}
