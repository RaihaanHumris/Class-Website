import React from 'react';

/**
 * WaveDivider Component - Pemisah section estetis dengan SVG gelombang
 */
export default function WaveDivider({
  fill = '#FFFFFF',
  className = '',
  invert = false,
  height = 'h-10 md:h-16'
}) {
  return (
    <div
      className={`w-full overflow-hidden leading-none select-none pointer-events-none ${
        invert ? 'rotate-180' : ''
      } ${className}`}
      aria-hidden="true"
    >
      <svg
        className={`w-full ${height} block`}
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <path
          d="M0,0 C150,90 350,-40 500,40 C650,120 900,10 1200,40 L1200,120 L0,120 Z"
          fill={fill}
        />
      </svg>
    </div>
  );
}
