import React from 'react';

/**
 * Functional Badge/Chip - Label status fungsional dengan kontras terverifikasi
 */
export default function Badge({
  children,
  variant = 'mist',
  size = 'md',
  className = '',
  icon: Icon
}) {
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[11px]',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm'
  };

  const variantStyles = {
    navy: 'bg-[#03045E] text-white',
    ocean: 'bg-[#0077B6] text-white font-medium',
    cyan: 'bg-[#00B4D8] text-[#03045E] font-semibold',
    sky: 'bg-[#90E0EF] text-[#03045E] font-medium',
    mist: 'bg-[#CAF0F8] text-[#03045E] font-medium',
    outline: 'border border-slate-300 text-slate-700 bg-white'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded font-medium ${
        sizeStyles[size] || sizeStyles.md
      } ${variantStyles[variant] || variantStyles.mist} ${className}`}
    >
      {Icon && <Icon className="w-3 h-3 flex-shrink-0" aria-hidden="true" />}
      <span>{children}</span>
    </span>
  );
}
