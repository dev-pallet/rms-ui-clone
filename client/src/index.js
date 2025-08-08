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

import { BrowserRouter } from 'react-router-dom';
import App from 'App';
import React from 'react';
//import ReactDOM from 'react-dom/client';
import { render } from 'react-dom';

// Soft UI Context Provider
import { SoftUIControllerProvider } from 'context';
import store from 'datamanagement/store';
import { Provider } from 'react-redux';
import { CookiesProvider } from 'react-cookie';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { SnackbarProvider } from './hooks/SnackbarProvider';

const queryClient = new QueryClient();

import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

// const root = ReactDOM.createRoot(document.getElementById('root'));

// root.render(
//   <BrowserRouter>
//     <SoftUIControllerProvider>
//       <App />
//     </SoftUIControllerProvider>
//   </BrowserRouter>,
// );

const container = document.getElementById('app');
render(
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <CookiesProvider>
        <BrowserRouter>
          <SoftUIControllerProvider>
            <SnackbarProvider>
              <App />
            </SnackbarProvider>
          </SoftUIControllerProvider>
        </BrowserRouter>
      </CookiesProvider>
    </Provider>
  </QueryClientProvider>,
  container,
);

if (process.env.NODE_ENV === 'development') {
  if (module['hot']) {
    module['hot'].accept();
  }
}
