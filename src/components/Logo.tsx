export function LogoIcon({ size = 28, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Speech bubble body */}
      <rect x="2" y="3" width="28" height="21" rx="5" fill="#1e3a8a" />
      {/* Speech bubble tail */}
      <path d="M8 24L13 28.5L18 24" fill="#1e3a8a" />
      {/* Star */}
      <path
        d="M16 7.5L18.1 12.1L23 12.7L19.5 16L20.3 20.8L16 18.5L11.7 20.8L12.5 16L9 12.7L13.9 12.1L16 7.5Z"
        fill="white"
      />
      {/* Subtle sparkle accent */}
      <circle cx="25" cy="7" r="1.5" fill="#60a5fa" opacity="0.8" />
      <circle cx="27" cy="5" r="0.8" fill="#93c5fd" opacity="0.6" />
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
