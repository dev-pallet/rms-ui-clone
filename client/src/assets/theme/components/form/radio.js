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

// Soft UI Dashboard PRO React base styles
import borders from 'assets/theme/base/borders';
import colors from 'assets/theme/base/colors';

// Soft UI Dashboard PRO React helper functions
import pxToRem from 'assets/theme/functions/pxToRem';
import linearGradient from 'assets/theme/functions/linearGradient';

const { borderWidth, borderColor } = borders;
const { transparent, gradients, info } = colors;

const radio = {
  styleOverrides: {
    root: {
      color: '#367df3 !important',
      '&$checked': {
        color: '#367df3 !important',
      },
    },
    checked: {},
  },
};

export default radio;
