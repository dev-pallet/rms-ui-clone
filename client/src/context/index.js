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

/**
  This file is used for controlling the global states of the components,
  you can customize the states for the different components here.
*/

import React, { createContext, useContext, useMemo, useReducer } from 'react';

// prop-types is a library for typechecking of props
import PropTypes from 'prop-types';

// The Soft UI Dashboard PRO React main context
const SoftUI = createContext();

// Setting custom name for the context which is visible on react dev tools
SoftUI.displayName = 'SoftUIContext';

// Soft UI Dashboard PRO React reducer
function reducer(state, action) {
  switch (action.type) {
    case 'MINI_SIDENAV': {
      return { ...state, miniSidenav: action.value };
    }
    case 'TRANSPARENT_SIDENAV': {
      return { ...state, transparentSidenav: action.value };
    }
    case 'SIDENAV_COLOR': {
      return { ...state, sidenavColor: action.value };
    }
    case 'TRANSPARENT_NAVBAR': {
      return { ...state, transparentNavbar: action.value };
    }
    case 'FIXED_NAVBAR': {
      return { ...state, fixedNavbar: action.value };
    }
    case 'OPEN_CONFIGURATOR': {
      return { ...state, openConfigurator: action.value };
    }
    case 'DIRECTION': {
      return { ...state, direction: action.value };
    }
    case 'LAYOUT': {
      return { ...state, layout: action.value };
    }
    case 'PI_ITEM_LIST': {
      return { ...state, itemList: action.value };
    }
    case 'ALL_PRODUCTS_FILTER': {
      return { ...state, allProductsFilter: action.value };
    }
    case 'PAGE_NUMBER': {
      return { ...state, pageNumber: action.value };
    }
    case 'LICENSE_LIST': {
      return { ...state, licenses: action.value };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

// Soft UI Dashboard PRO React context provider
function SoftUIControllerProvider({ children }) {
  const initialState = {
    miniSidenav: false,
    transparentSidenav: true,
    sidenavColor: 'info',
    transparentNavbar: true,
    fixedNavbar: true,
    openConfigurator: false,
    direction: 'ltr',
    layout: 'dashboard',
    itemList: {
      purchaseIndentDetails: {
        warehouseName: {},
        assignedTo: [],
        approvedTo: {},
        shippingMethod: {},
        shippingTerm: {},
        startDate: '',
        endDate: '',
        noteTxt: '',
      },
      imputListIndexArray: [],
      data: [
        {
          prodOptions: [],
          itemCode: '',
          itemName: '',
          spec: '',
          quantityOrdered: '',
          finalPrice: '',
          unit: '',
          previousPurchasePrice: '',
          preferredVendor: '',
          preferredVendorId: '',
          barcodeLabel: 'Barcode',
          itemlabel: 'Item Name',
          speclabel: 'Specification',
          quantilabel: 'Quantity',
          pricelabel: 'Previous Price',
          vendorlabel: 'Preferred Vendor',
          key: null,
        },
      ],
    },
    allProductsFilter: {},
    pageNumber: {
      products: {
        allProducts: 1,
        productLabel: 1,
      },
      customer: {
        main: 1,
        customerOrder: 1,
      },
    },
    licenses: [],
  };

  const [controller, dispatch] = useReducer(reducer, initialState);

  const value = useMemo(() => [controller, dispatch], [controller, dispatch]);

  return <SoftUI.Provider value={value}>{children}</SoftUI.Provider>;
}

// Soft UI Dashboard PRO React custom hook for using context
function useSoftUIController() {
  const context = useContext(SoftUI);
  if (!context) {
    throw new Error('useSoftUIController should be used inside the SoftUIControllerProvider.');
  }

  return context;
}

// Typechecking props for the SoftUIControllerProvider
SoftUIControllerProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Context module functions
const setMiniSidenav = (dispatch, value) => dispatch({ type: 'MINI_SIDENAV', value });
const setTransparentSidenav = (dispatch, value) => dispatch({ type: 'TRANSPARENT_SIDENAV', value });
const setSidenavColor = (dispatch, value) => dispatch({ type: 'SIDENAV_COLOR', value });
const setTransparentNavbar = (dispatch, value) => dispatch({ type: 'TRANSPARENT_NAVBAR', value });
const setFixedNavbar = (dispatch, value) => dispatch({ type: 'FIXED_NAVBAR', value });
const setOpenConfigurator = (dispatch, value) => dispatch({ type: 'OPEN_CONFIGURATOR', value });
const setDirection = (dispatch, value) => dispatch({ type: 'DIRECTION', value });
const setLayout = (dispatch, value) => dispatch({ type: 'LAYOUT', value });
const setPIItemList = (dispatch, value) => dispatch({ type: 'PI_ITEM_LIST', value });
const setAllProductsFilter = (dispatch, value) => dispatch({ type: 'ALL_PRODUCTS_FILTER', value });
const setPageNumber = (dispatch, value) => dispatch({ type: 'PAGE_NUMBER', value });
const setLicenses = (dispatch, value) => dispatch({ type: 'LICENSE_LIST', value });

export {
  SoftUIControllerProvider,
  useSoftUIController,
  setMiniSidenav,
  setTransparentSidenav,
  setSidenavColor,
  setTransparentNavbar,
  setFixedNavbar,
  setOpenConfigurator,
  setDirection,
  setLayout,
  setPIItemList,
  setAllProductsFilter,
  setPageNumber,
  setLicenses,
};
