import React from 'react';

/**
 * Functional Badge/Chip - Kapsul pill bernuansa Beranda
 */
export default function Badge({
  children,
  variant = 'mist',
  size = 'md',
  className = '',
  icon: Icon
}) {
  const sizeStyles = {
    sm: 'px-2.5 py-0.5 text-[11px]',
    md: 'px-3 py-1 text-xs',
    lg: 'px-3.5 py-1.5 text-sm'
  };

  const variantStyles = {
    navy: 'bg-[#03045E] text-white',
    ocean: 'bg-[#0077B6] text-white font-semibold shadow-xs',
    cyan: 'bg-[#00B4D8] text-[#03045E] font-bold',
    sky: 'bg-[#90E0EF] text-[#03045E] font-semibold',
    mist: 'bg-[#CAF0F8] text-[#03045E] font-semibold border border-[#90E0EF]/60',
    outline: 'border border-slate-200 text-slate-700 bg-white'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${
        sizeStyles[size] || sizeStyles.md
      } ${variantStyles[variant] || variantStyles.mist} ${className}`}
    >
      {Icon && <Icon className="w-3 h-3 flex-shrink-0" aria-hidden="true" />}
      <span>{children}</span>
    </span>
  );
}
