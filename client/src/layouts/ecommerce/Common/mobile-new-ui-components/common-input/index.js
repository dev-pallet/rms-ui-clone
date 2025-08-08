import React, { useEffect, useMemo, useRef } from 'react';
import './input.css';

const CustomMobileInput = ({
  type = 'text',
  value,
  onChange,
  disabled = false,
  placeholder = '',
  className = '',
  onFocus,
  onBlur,
  inputStyles = {},
  error,
  ...props
}) => {
  const inputClassNames = useMemo(() => {
    let classes = `common-mob-input ${className}`;
    if (error) {
      classes += ' mob-input-error';
    }
    return classes;
  }, [className, error]);

  const inputRef = useRef(null);

  const handleWheel = (e) => {
    if (type === 'number' && !disabled) {
      e.preventDefault();
    }
  };

  useEffect(() => {
    const inputElement = inputRef.current;

    if (inputElement) {
      inputElement.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (inputElement) {
        inputElement.removeEventListener('wheel', handleWheel);
      }
    };
  }, [type, disabled]);

  return (
    <input
      ref={inputRef}
      type={type}
      value={value}
      onChange={onChange}
      readOnly={disabled}
      placeholder={placeholder}
      className={inputClassNames}
      style={inputStyles}
      onFocus={onFocus}
      onBlur={onBlur}
      {...props}
    />
  );
};

export default CustomMobileInput;
