const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  type = 'button',
  disabled = false,
  fullWidth = false,
  className = '',
  ...props
}) => {
  const baseClasses = 'font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variantStyles = {
    primary: {
      backgroundColor: '#004C8C',
      color: 'white',
      border: 'none'
    },
    secondary: {
      backgroundColor: 'white',
      color: '#004C8C',
      border: '2px solid #004C8C'
    },
    success: {
      backgroundColor: '#28A745',
      color: 'white',
      border: 'none'
    },
    danger: {
      backgroundColor: '#DC3545',
      color: 'white',
      border: 'none'
    },
    ghost: {
      backgroundColor: 'transparent',
      color: '#004C8C',
      border: 'none'
    }
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  const widthClasses = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${sizeClasses[size]} ${disabledClasses} ${widthClasses} ${className}`}
      style={variantStyles[variant]}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
