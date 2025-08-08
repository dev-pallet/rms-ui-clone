import { useEffect, useMemo, useState } from 'react';
import './button.css';
import { CircularProgress } from '@mui/material';
import { colorConstants } from '../../colors/colorConstant';

const CustomMobileButton = ({
  color,
  variant,
  iconOnLeft,
  iconOnRight,
  onClickFunction,
  rightIconFunction,
  leftIconFunction,
  loading,
  disable,
  title,
  justifyContent,
  ...restStyles
}) => {
  const [buttonStyles, setButtonStyles] = useState({});

  const variantStyle = useMemo(() => {
    if (disable || loading) {
      return {
        backgroundColor: colorConstants.button_P,
        color: colorConstants.surfaceWhite,
      };
    }

    const styles = {
      'blue-D': {
        backgroundColor: colorConstants.button_D,
        color: colorConstants.surfaceWhite,
      },
      'blue-H': {
        backgroundColor: colorConstants.blueB1,
        color: colorConstants.surfaceWhite,
      },
      'blue-P': {
        backgroundColor: colorConstants.blueB2,
        color: colorConstants.surfaceWhite,
      },
      'blue-S': {
        backgroundColor: colorConstants.surfaceWhite,
        color: colorConstants.button_D,
        borderWidth: 1,
        borderColor: colorConstants.button_D,
      },
      'yellow-solid': {
        backgroundColor: colorConstants.yellowSolid,
        color: colorConstants.surfaceG5,
      },
      'green-D': {
        backgroundColor: colorConstants.greenG0,
        color: colorConstants.surfaceWhite,
      },
      'green-H': {
        backgroundColor: colorConstants.greenG1,
        color: colorConstants.surfaceWhite,
      },
      'green-P': {
        backgroundColor: colorConstants.greenG2,
        color: colorConstants.surfaceWhite,
      },
      'green-S': {
        backgroundColor: colorConstants.surfaceWhite,
        color: colorConstants.greenG0,
        borderWidth: 1,
        borderColor: colorConstants.greenG0,
      },
      'black-D': {
        backgroundColor: colorConstants.surfaceBlack,
        color: colorConstants.surfaceWhite,
      },
      'black-H': {
        backgroundColor: colorConstants.surfaceG5,
        color: colorConstants.surfaceWhite,
      },
      'black-P': {
        backgroundColor: colorConstants.surfaceG3,
        color: colorConstants.surfaceWhite,
      },
      'black-S': {
        backgroundColor: colorConstants.surfaceWhite,
        color: colorConstants.surfaceBlack,
        boxShadow: `inset 0 0 0 1px ${colorConstants.surfaceBlack}`,
      },
      'white-D': {
        backgroundColor: colorConstants.surfaceWhite,
        color: colorConstants.surfaceG5,
      },
      'white-H': {
        backgroundColor: colorConstants.surfaceG0,
        color: colorConstants.surfaceWhite,
      },
      'white-P': {
        backgroundColor: colorConstants.surfaceG1,
        color: colorConstants.surfaceG5,
      },
      'white-S': {
        backgroundColor: colorConstants.surfaceWhite,
        color: colorConstants.surfaceG5,
        borderWidth: 1,
        borderColor: colorConstants.surfaceG5,
      },
      'orange-S': {
        backgroundColor: colorConstants.sandSolid,
        color: colorConstants.iconColorWhite,
      },
      transparent: {
        backgroundColor: 'transparent',
        color: colorConstants.surfaceG5,
      },
    };

    return (
      styles[variant] || {
        backgroundColor: colorConstants.button_D,
        color: colorConstants.surfaceWhite,
      }
    );
  }, [variant, disable, loading]);

  const activeClassName = () => {
    if (variant.includes('black')) {
      return 'mob-app-black';
    } else if (variant.includes('blue')) {
      return 'mob-app-blue';
    } else if (variant.includes('green')) {
      return 'mob-app-green';
    } else if (variant.includes('white')) {
      return 'mob-app-white';
    } else {
      return '';
    }
  };

  return (
    <button
      onClick={onClickFunction}
      className={`mob-app-button ${activeClassName()}`}
      style={{ ...variantStyle, ...restStyles }}
      disabled={disable || loading}
    >
      {loading ? (
        <div className="circular-progress-main-div-ros-app">
          <CircularProgress
            size={12}
            sx={{ color: variant === 'outlined' ? `${buttonStyles.outline} !important` : 'white !important' }}
          />
        </div>
      ) : (
        <div
          className="button-content-app"
          style={{
            justifyContent: justifyContent && justifyContent,
          }}
        >
          {iconOnLeft && (
            <div className="mobile-filter-right-icon" onClick={leftIconFunction}>
              {iconOnLeft}
            </div>
          )}
          {title && <span className="common-button-title">{title}</span>}
          {iconOnRight && (
            <div className="mobile-filter-right-icon" onClick={rightIconFunction}>
              {iconOnRight}
            </div>
          )}
        </div>
      )}
    </button>
  );
};

export default CustomMobileButton;
