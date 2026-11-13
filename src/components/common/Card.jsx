import React from 'react';

/**
 * Card Component - Bersih, terstruktur, tanpa elevasi dekoratif berlebihan
 */
export default function Card({
  children,
  variant = 'default',
  className = '',
  onClick,
  as: Component = 'div',
  ...rest
}) {
  const baseStyles = 'relative rounded-xl transition-colors duration-150';

  const variantStyles = {
    // Putih bersih dengan border netral
    default:
      'bg-white border border-slate-200/90 p-5 md:p-6',
    
    // Stacked/Border beraksen
    stacked:
      'bg-white border border-slate-200 hover:border-[#0077B6]/50 p-5 md:p-6',

    // Varian Sorotan Navy
    navy:
      'bg-[#03045E] text-white p-5 md:p-6 border border-[#0077B6]/30',

    // Varian Mist Lembut
    mist:
      'bg-[#CAF0F8]/50 border border-[#90E0EF] text-[#03045E] p-5 md:p-6',

    // Varian Garis Aksen Ocean
    highlight:
      'bg-white border-l-4 border-l-[#0077B6] border-y border-r border-slate-200 p-5 md:p-6'
  };

  return (
    <Component
      className={`${baseStyles} ${variantStyles[variant] || variantStyles.default} ${className}`}
      onClick={onClick}
      {...rest}
    >
      {children}
    </Component>
  );
}
