import { CircularProgress } from '@mui/material';
import React from 'react';

/**
 * A custom button component that provides a flexible and customizable button that can be used in a variety of contexts.
 *
 * @param {Object} props - The props for the component.
 * @param {React.ReactNode} props.children - The content to be displayed inside the button.
 * @param {string} [props.variant="primary"] - The button variant, which can be either "primary" or "secondary".
 * @param {string} [props.color="#2954A5"] - The color of the button. This can be any valid CSS color value.
 * @param {string} [props.size] - The size of the button, which can be either "small", "medium", "large", or undefined.
 * @param {boolean} [props.disabled=false] - A boolean value that determines whether the button is disabled.
 * @param {boolean} [props.loading=false] - A boolean value that determines whether the button is in a loading state.
 * @param {Object} [props.rest] - Any additional props to be passed to the button element.
 * @returns {React.ReactNode} The `StyledButton` component.
 */

const StyledButton = ({
  children,
  variant = 'primary',
  color = 'var(--blue)',
  size,
  disabled = false,
  loading = false,
  style,
  ...rest
}) => {
  const buttonStyle = {
    backgroundColor: variant === 'primary' ? color : 'transparent',
    border: variant === 'primary' ? '1px solid transparent' : `1px solid ${color}`,
    color: variant === 'primary' ? 'white' : color,
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled || loading ? '0.5' : '1',
    height: size === 'small' ? '2rem' : size === 'medium' ? '2.5rem' : size === 'large' ? '3rem' : '2.8rem',
    borderRadius: '8px',
    textTransform: 'uppercase',
    gap: '2px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    // minHeight: "2.8rem",
    fontWeight: 'bold',
    fontSize: '12px',
    padding: '0.5rem 1rem',
    '&:hover': {
      // backgroundColor: "black",
      color: 'red',
    },
  };
  return (
    <button
      style={{
        ...buttonStyle,
        ...style,
      }}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <CircularProgress
          color="success"
          sx={{ color: variant === 'primary' ? '#fff' : color, display: 'flex' }}
          size={23}
        />
      ) : (
        children
      )}
    </button>
  );
};

export default StyledButton;
