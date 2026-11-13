import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Button Component - Desain pill/kapsul modern selaras Beranda
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  to,
  href,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  icon: Icon,
  iconPosition = 'left',
  ...rest
}) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00B4D8] focus-visible:ring-offset-2 min-h-[44px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const sizeStyles = {
    sm: 'px-4 py-1.5 text-xs gap-1.5',
    md: 'px-5 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5',
  };

  const variantStyles = {
    primary:
      'bg-[#0077B6] hover:bg-[#03045E] text-white font-bold shadow-md hover:shadow-lg',
    secondary:
      'bg-[#CAF0F8] hover:bg-[#90E0EF] text-[#03045E] font-bold border border-[#90E0EF]/60 shadow-xs',
    outline:
      'border border-slate-300 bg-white text-[#03045E] hover:border-[#0077B6] hover:text-[#0077B6] shadow-xs',
    navy:
      'bg-[#03045E] hover:bg-[#0077B6] text-white font-bold shadow-md',
    link:
      'p-0 min-h-0 text-[#0077B6] hover:text-[#03045E] hover:underline font-bold bg-transparent rounded-none'
  };

  const combinedClasses = `${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${
    variantStyles[variant] || variantStyles.primary
  } ${className}`;

  const content = (
    <>
      {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 flex-shrink-0" aria-hidden="true" />}
      <span>{children}</span>
      {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 flex-shrink-0" aria-hidden="true" />}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={combinedClasses} {...rest}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={combinedClasses} target="_blank" rel="noopener noreferrer" {...rest}>
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={combinedClasses}
      {...rest}
    >
      {content}
    </button>
  );
}
