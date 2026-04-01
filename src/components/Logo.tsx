export function LogoIcon({ size = 28, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="logoGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#1e3a8a" />
        </linearGradient>
      </defs>

      {/* Rounded square background */}
      <rect width="40" height="40" rx="10" fill="url(#logoGrad)" />

      {/* Speech bubble shape — subtle fill */}
      <path
        d="M7 10 Q7 7 10 7 H30 Q33 7 33 10 V23 Q33 26 30 26 H21 L16 31 L15 26 H10 Q7 26 7 23 Z"
        fill="white"
        opacity="0.12"
      />

      {/* Three ascending bar chart bars */}
      <rect x="10" y="22" width="5" height="2" rx="1" fill="white" opacity="0.5" />
      <rect x="10" y="19" width="5" height="5" rx="1" fill="white" opacity="0.5" />

      <rect x="18" y="22" width="5" height="2" rx="1" fill="white" opacity="0.75" />
      <rect x="18" y="16" width="5" height="8" rx="1" fill="white" opacity="0.75" />

      <rect x="26" y="22" width="5" height="2" rx="1" fill="white" />
      <rect x="26" y="11" width="5" height="13" rx="1" fill="white" />

      {/* Upward tick / arrow accent above tallest bar */}
      <path
        d="M27 10 L28.5 8 L30 10"
        stroke="#93c5fd"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Logo({ size = 28, textSize = 'text-base' }: { size?: number; textSize?: string }) {
  return (
    <div className="flex items-center gap-2">
      <LogoIcon size={size} />
      <span className={`${textSize} font-bold text-slate-900`}>ReviewInzight</span>
    </div>
  )
}
