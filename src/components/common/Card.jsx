import React from 'react';

/**
 * Card Component - Desain lembut, modern, konsisten dengan gaya Beranda Stitch
 */
export default function Card({
  children,
  variant = 'default',
  className = '',
  onClick,
  as: Component = 'div',
  ...rest
}) {
  const baseStyles = 'relative rounded-[24px] transition-all duration-200';

  const variantStyles = {
    // Putih bersih dengan border halus & shadow lembut khas Beranda
    default:
      'bg-white border border-slate-100 p-6 shadow-[0_8px_24px_rgba(3,4,94,0.06)]',
    
    // Stacked/Border beraksen hover
    stacked:
      'bg-white border border-slate-100 hover:border-[#0077B6]/40 p-6 shadow-[0_8px_24px_rgba(3,4,94,0.06)] hover:shadow-[0_12px_28px_rgba(3,4,94,0.12)]',

    // Varian Sorotan Navy
    navy:
      'bg-[#03045E] text-white p-6 border border-white/10 shadow-[0_8px_24px_rgba(3,4,94,0.14)]',

    // Varian Mist Lembut Khas Beranda
    mist:
      'bg-[#CAF0F8]/50 border border-[#90E0EF]/60 text-[#03045E] p-6 shadow-[0_8px_24px_rgba(3,4,94,0.04)]',

    // Varian Garis Aksen Ocean
    highlight:
      'bg-white border-l-4 border-l-[#0077B6] border-y border-r border-slate-100 p-6 shadow-[0_8px_24px_rgba(3,4,94,0.06)]'
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
