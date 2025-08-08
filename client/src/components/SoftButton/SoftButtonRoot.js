/**
=========================================================
* Soft UI Dashboard PRO React - v4.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-pro-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

export default styled(Button)(({ theme, ownerState }) => {
  const { palette, functions, borders } = theme;
  const { color, variant, size, circular, iconOnly } = ownerState;

  const { white, dark, text, transparent, gradients } = palette;
  const { boxShadow, linearGradient, pxToRem, rgba } = functions;
  const { borderRadius } = borders;

  // styles for the button with variant="contained"
  const containedStyles = () => {
    // background color value
    const backgroundValue = palette[color] ? palette[color].main : white.main;

    // backgroundColor value when button is focused
    const focusedBackgroundValue = palette[color] ? palette[color].focus : white.focus;

    // boxShadow value
    const boxShadowValue = palette[color]
      ? boxShadow([0, 0], [0, 3.2], palette[color].main, 0.5)
      : boxShadow([0, 0], [0, 3.2], dark.main, 0.5);

    // color value
    let colorValue = white.main;

    if (color === 'white' || !palette[color]) {
      colorValue = text.main;
    } else if (color === 'light') {
      colorValue = gradients.dark.state;
    }

    // color value when button is focused
    let focusedColorValue = white.main;

    if (color === 'white') {
      focusedColorValue = text.main;
    } else if (color === 'primary' || color === 'error' || color === 'dark') {
      focusedColorValue = white.main;
    }

    return {
      background: backgroundValue,
      color: colorValue,

      '&:hover': {
        backgroundColor: backgroundValue,
      },

      '&:focus:not(:hover)': {
        backgroundColor: focusedBackgroundValue,
        boxShadow: boxShadowValue,
      },

      '&:disabled': {
        backgroundColor: backgroundValue,
        color: focusedColorValue,
      },
    };
  };

  // styles for the button with variant="outlined"
  const outliedStyles = () => {
    // background color value
    const backgroundValue = color === 'white' ? rgba(white.main, 0.1) : transparent.main;

    // color value
    const colorValue = palette[color] ? palette[color].main : white.main;

    // boxShadow value
    const boxShadowValue = palette[color]
      ? boxShadow([0, 0], [0, 3.2], palette[color].main, 0.5)
      : boxShadow([0, 0], [0, 3.2], white.main, 0.5);

    // border color value
    let borderColorValue = palette[color] ? palette[color].main : rgba(white.main, 0.75);

    if (color === 'white') {
      borderColorValue = rgba(white.main, 0.75);
    }

    return {
      background: backgroundValue,
      color: colorValue,
      borderColor: borderColorValue,

      '&:hover': {
        background: transparent.main,
        borderColor: colorValue,
      },

      '&:focus:not(:hover)': {
        background: transparent.main,
        boxShadow: boxShadowValue,
      },

      '&:active:not(:hover)': {
        backgroundColor: colorValue,
        color: white.main,
        opacity: 0.85,
      },

      '&:disabled': {
        color: colorValue,
        borderColor: colorValue,
      },
    };
  };

  // styles for the button with variant="gradient"
  const gradientStyles = () => {
    // background value
    const backgroundValue =
      color === 'white' || !gradients[color]
        ? white.main
        : linearGradient(gradients[color].main, gradients[color].state);

    // color value
    let colorValue = white.main;

    if (color === 'white') {
      colorValue = text.main;
    } else if (color === 'light') {
      colorValue = gradients.dark.state;
    }

    return {
      background: backgroundValue,
      color: colorValue,

      '&:focus:not(:hover)': {
        boxShadow: 'none',
      },

      '&:disabled': {
        background: backgroundValue,
        color: colorValue,
      },
    };
  };

  // styles for the button with variant="text"
  const textStyles = () => {
    // color value
    const colorValue = palette[color] ? palette[color].main : white.main;

    // color value when button is focused
    const focusedColorValue = palette[color] ? palette[color].focus : white.focus;

    return {
      color: colorValue,

      '&:hover': {
        color: focusedColorValue,
      },

      '&:focus:not(:hover)': {
        color: focusedColorValue,
      },
    };
  };

  // styles for the button with circular={true}
  const circularStyles = () => ({
    borderRadius: borderRadius.section,
  });

  // styles for the button with iconOnly={true}
  const iconOnlyStyles = () => {
    // width, height, minWidth and minHeight values
    let sizeValue = pxToRem(38);

    if (size === 'small') {
      sizeValue = pxToRem(25.4);
    } else if (size === 'large') {
      sizeValue = pxToRem(52);
    }

    // padding value
    let paddingValue = `${pxToRem(11)} ${pxToRem(11)} ${pxToRem(10)}`;

    if (size === 'small') {
      paddingValue = pxToRem(4.5);
    } else if (size === 'large') {
      paddingValue = pxToRem(16);
    }

    return {
      width: sizeValue,
      minWidth: sizeValue,
      height: sizeValue,
      minHeight: sizeValue,
      padding: paddingValue,

      '& .material-icons': {
        marginTop: 0,
      },

      '&:hover, &:focus, &:active': {
        transform: 'none',
      },
    };
  };

  // #ffffff text with #ffffff border(insideHeader),
  const insideHeaderStyles = () => ({
    color: '#ffffff',
    outline: "1.35px solid #ffffff",
    outlineOffset: "-0.5px",
  });

  // back button
  const backButtonStyle = () => ({
    color: '#344767',
    backgroundColor: '#F2F3F3',
    border: '1px solid lightgray',
    '&:hover': {
      backgroundColor: '#cccccc',
      // color:"#cccccc"
    },
  })

  // other variants 
  // solid button with #0562fb background
  const solidBlueBackgroundStyles = () =>({
    backgroundColor:"#0562fb",
    color:"#ffffff",
    '&:hover, &:focus, &:active': {
      backgroundColor:"#0562fb",
      color:"#ffffff",
    },  
  })

  // solid button with #ffffff background
  const solidWhiteBackgroundStyles = () => ({
    backgroundColor:"#ffffff",
    color: '#0562fb',
    '&:hover, &:focus, &:active': {
      backgroundColor:"#F2F3F3",
      color: '#0562fb',
    },   
  })

  return {
    ...(variant === 'contained' && containedStyles()),
    ...(variant === 'outlined' && outliedStyles()),
    ...(variant === 'gradient' && gradientStyles()),
    ...(variant === 'text' && textStyles()),
    ...(variant === 'insideHeader' && insideHeaderStyles()),
    // other variants
    // Back
    ...(variant === 'backButton' && backButtonStyle()), 
    // Edit
    // Log out
    // Delete
    // Cancel
    // Shop now
    // Save
    // Clear
    // Apply
    // Filter
    // Refresh

    //others 
    // solid button with #0562fb background, 
    ...(variant === 'solidBlueBackground' && solidBlueBackgroundStyles()),
    // solid buttton with #ffffff background
    ...(variant === 'solidWhiteBackground' && solidWhiteBackgroundStyles()),

    ...(circular && circularStyles()),
    ...(iconOnly && iconOnlyStyles()),
  };
});
