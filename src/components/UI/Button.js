import React from 'react';
import './Button.css';

const Button = ({
  children,
  onClick,
  type = 'primary',
  htmlType = 'submit',
  variant = 'solid',
  className = '',
  disabled = false,
  style
}) => {
  const buttonClass = `btn btn-${type} btn-${variant} ${className}`;

  return (
    <button
      className={buttonClass}
      onClick={onClick}
      disabled={disabled}
      type={htmlType}
      style={style}
    >
      {children}
    </button>
  );
};

export default Button;
