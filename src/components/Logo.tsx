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
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1e3a8a" />
        </linearGradient>
      </defs>

      {/* Rounded square background */}
      <rect width="40" height="40" rx="8" fill="url(#logoGrad)" />

      {/* Ascending bar chart bars - crisper and bolder */}
      <rect x="9" y="24" width="4" height="2" rx="1" fill="white" opacity="0.6" />
      <rect x="9" y="21" width="4" height="5" rx="1" fill="white" opacity="0.7" />

      <rect x="17" y="24" width="4" height="2" rx="1" fill="white" opacity="0.8" />
      <rect x="17" y="17" width="4" height="9" rx="1" fill="white" opacity="0.85" />

      <rect x="25" y="24" width="4" height="2" rx="1" fill="white" />
      <rect x="25" y="10" width="4" height="16" rx="1" fill="white" />

      {/* Upward arrow accent - bolder and more prominent */}
      <path
        d="M26.5 9 L28 6.5 L29.5 9"
        stroke="white"
        strokeWidth="2"
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
