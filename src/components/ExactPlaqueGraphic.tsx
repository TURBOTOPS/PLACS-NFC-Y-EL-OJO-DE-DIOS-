interface ExactPlaqueGraphicProps {
  className?: string;
  interactive?: boolean;
  onTap?: () => void;
  isTapped?: boolean;
  showDimensions?: boolean;
}

export default function ExactPlaqueGraphic({
  className = '',
  interactive = false,
  onTap,
  isTapped = false,
  showDimensions = false,
}: ExactPlaqueGraphicProps) {
  return (
    <div
      onClick={interactive ? onTap : undefined}
      className={`relative select-none ${interactive ? 'cursor-pointer group' : ''} ${className}`}
    >
      <div className="relative mx-auto w-full max-w-[290px] sm:max-w-[320px]">
        {/* Dimension indicator: Height (14cm / 5.51inch) on the left */}
        {showDimensions && (
          <div className="absolute -left-12 top-0 bottom-6 flex flex-col items-center justify-between text-[11px] font-mono font-bold text-neutral-300 pointer-events-none select-none">
            <span className="text-cyan-400">▲</span>
            <div className="-rotate-90 whitespace-nowrap text-cyan-400 tracking-wider">
              14cm / 5.51inch
            </div>
            <span className="text-cyan-400">▼</span>
          </div>
        )}

        {/* Dimension indicator: Width (12cm / 4.72inch) at the bottom */}
        {showDimensions && (
          <div className="absolute -bottom-8 left-0 right-0 flex items-center justify-between text-[11px] font-mono font-bold text-neutral-300 pointer-events-none select-none">
            <span className="text-cyan-400">◄</span>
            <span className="text-cyan-400 tracking-wider">12cm / 4.72inch</span>
            <span className="text-cyan-400">►</span>
          </div>
        )}

        {/* 3D Acrylic L-Stand Foot (5cm / 1.97inch depth) */}
        <div className="relative">
          {/* Angled base / foot */}
          <div className="absolute -bottom-3 left-0 w-full h-8 bg-gradient-to-r from-neutral-900 via-neutral-950 to-black rounded-b-xl border-b-2 border-r border-l border-neutral-700/80 shadow-[0_25px_45px_rgba(0,0,0,0.9)] transform skew-x-2">
            {showDimensions && (
              <span className="absolute bottom-1 -left-12 text-[10px] font-mono text-cyan-400/80">
                5cm / 1.97"
              </span>
            )}
          </div>

          {/* Main Acrylic Body: Front Black Face with Crystal Clear Border Edge */}
          <div className="relative bg-black rounded-xl p-5 sm:p-6 border-2 border-neutral-600/90 shadow-[0_20px_40px_rgba(0,0,0,0.9),inset_0_2px_4px_rgba(255,255,255,0.2)] overflow-hidden">
            {/* Clear Transparent Acrylic Edge Simulation (visible white/glass bevel like in the photo) */}
            <div className="absolute inset-0 rounded-xl pointer-events-none border-l-[3px] border-t-[2px] border-white/35" />

            {/* Subtle specular reflection */}
            <div className="absolute -top-20 -left-20 w-80 h-96 bg-gradient-to-br from-white/12 via-white/2 to-transparent rotate-25 pointer-events-none" />

            {/* Top Text: "Review Us On" */}
            <div className="text-center mb-4 pt-1">
              <h4 className="text-lg sm:text-xl font-display font-bold text-white tracking-wide drop-shadow-sm">
                Review Us On
              </h4>
            </div>

            {/* Circular Google NFC Target */}
            <div className="relative mx-auto w-36 h-36 sm:w-40 sm:h-40 flex items-center justify-center mb-4">
              {/* Outer 4-Color Ring: Blue, Red, Yellow, Green */}
              <svg
                className="absolute inset-0 w-full h-full transform -rotate-45"
                viewBox="0 0 100 100"
              >
                {/* Blue Arc */}
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="5"
                  strokeDasharray="69 207"
                  strokeDashoffset="0"
                />
                {/* Red Arc */}
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  fill="none"
                  stroke="#EF4444"
                  strokeWidth="5"
                  strokeDasharray="69 207"
                  strokeDashoffset="-69"
                />
                {/* Yellow Arc */}
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="5"
                  strokeDasharray="69 207"
                  strokeDashoffset="-138"
                />
                {/* Green Arc */}
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="5"
                  strokeDasharray="69 207"
                  strokeDashoffset="-207"
                />
              </svg>

              {/* Inner Core */}
              <div className="w-[84%] h-[84%] bg-black rounded-full flex flex-col items-center justify-center p-2 text-center shadow-inner relative z-10">
                {/* Hand holding phone with "NFC" and waves (matching uploaded photo) */}
                <div className="relative mb-1 flex flex-col items-center">
                  {/* "NFC" text above phone */}
                  <span className="text-[9px] font-black tracking-widest text-white leading-none mb-0.5">
                    NFC
                  </span>
                  {/* Phone + Hand + Signal Icon */}
                  <div className="relative">
                    {/* Radio wave arcs to the left */}
                    <div className="absolute -left-2.5 top-0 flex flex-col gap-0.5 text-white">
                      <svg className="w-2.5 h-2.5" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.2">
                        <path d="M4 2a4 4 0 0 0 0 6" />
                        <path d="M2 1a6 6 0 0 0 0 8" />
                      </svg>
                    </div>

                    {/* Smartphone outline */}
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="6" y="2" width="12" height="20" rx="2" />
                      <line x1="10" y1="18" x2="14" y2="18" />
                    </svg>
                  </div>
                </div>

                {/* TAP HERE */}
                <div className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-white leading-none my-1">
                  TAP HERE
                </div>

                {/* Official Google Multicolored Logo */}
                <div className="text-base sm:text-lg font-bold font-sans tracking-tight leading-none mt-0.5">
                  <span className="text-[#4285F4]">G</span>
                  <span className="text-[#EA4335]">o</span>
                  <span className="text-[#FBBC05]">o</span>
                  <span className="text-[#4285F4]">g</span>
                  <span className="text-[#34A853]">l</span>
                  <span className="text-[#EA4335]">e</span>
                </div>
              </div>

              {/* Ping Ring on Tap */}
              {isTapped && (
                <div className="absolute inset-0 rounded-full border-2 border-cyan-400 animate-ping opacity-85 pointer-events-none" />
              )}
            </div>

            {/* 5 Bright Yellow Stars */}
            <div className="flex justify-center items-center gap-1.5 mb-3 text-[#F59E0B]">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className="w-5 h-5 fill-[#F59E0B] text-[#F59E0B] drop-shadow-[0_2px_4px_rgba(245,158,11,0.5)]"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              ))}
            </div>

            {/* Bottom 4-Color Stripe Bar: Red, Green, Blue, Yellow */}
            <div className="w-full max-w-[190px] mx-auto h-1.5 rounded-full overflow-hidden flex shadow-sm">
              <div className="h-full w-1/4 bg-[#EF4444]" />
              <div className="h-full w-1/4 bg-[#10B981]" />
              <div className="h-full w-1/4 bg-[#3B82F6]" />
              <div className="h-full w-1/4 bg-[#F59E0B]" />
            </div>

            {/* Bottom edge reflection */}
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>
        </div>
      </div>
    </div>
  );
}
