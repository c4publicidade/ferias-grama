export function BeachWaves() {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none">
      {/* Multiple wave layers for realistic ocean effect */}
      <svg
        className="w-full"
        viewBox="0 0 1440 180"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        style={{ height: '180px' }}
      >
        {/* Wave layer 1 - Deepest (turquoise) */}
        <path
          d="M0,60 C240,100 480,40 720,70 C960,100 1200,50 1440,80 L1440,180 L0,180 Z"
          fill="#67E8F9"
          opacity="0.4"
        />
        
        {/* Wave layer 2 - Middle (lighter cyan) */}
        <path
          d="M0,90 C300,60 600,120 900,90 C1200,60 1350,110 1440,100 L1440,180 L0,180 Z"
          fill="#A5F3FC"
          opacity="0.5"
        />
        
        {/* Wave layer 3 - Foam (white-cyan) */}
        <path
          d="M0,120 C180,100 360,140 540,120 C720,100 900,145 1080,125 C1260,105 1350,135 1440,120 L1440,180 L0,180 Z"
          fill="#ECFEFF"
          opacity="0.8"
        />
        
        {/* Final white foam layer */}
        <path
          d="M0,145 C200,130 400,155 600,145 C800,135 1000,160 1200,148 C1320,140 1380,158 1440,145 L1440,180 L0,180 Z"
          fill="#FFFFFF"
          opacity="0.95"
        />
      </svg>
    </div>
  );
}