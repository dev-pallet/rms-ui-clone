import React, { createContext, useContext, useState, forwardRef } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { isSmallScreen } from '../layouts/ecommerce/Common/CommonFunction';
import CustomAlertRosMobile from '../layouts/ecommerce/Common/mobile-new-ui-components/custom-alert/index.js';

const SnackbarContext = createContext();

export function useSnackbar() {
  return useContext(SnackbarContext);
}

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export function SnackbarProvider({ children }) {
  const isMobileDevice = isSmallScreen();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState(''); 
  const [severity, setSeverity] = useState('info');
  const [subMessage, setSubMessage] = useState('');
  const [primaryButtonProps, setPrimaryButtonProps] = useState(null);
  const [secondaryButtonProps, setSecondaryButtonProps] = useState(null);
  const [onPrimaryClick, setOnPrimaryClick] = useState(null);
  const [onSecondaryClick, setOnSecondaryClick] = useState(null);
  const [vertical, horizontal] = isMobileDevice ? ['top', 'center'] : ['bottom', 'center'];
  const [persistent, setPersistent] = useState(false);


  const handleClose = (event, reason) => {
    if (reason === 'clickaway' || persistent) {
      return;
    }
    setOpen(false);
  };

  const showSnackbar = ( message = '', severity = 'info',subMessage = '', primaryButtonProps = null, secondaryButtonProps = null,  onPrimaryClick = null, onSecondaryClick = null,persistent = false ) => {
    setOpen(true);
    setSeverity(severity);
    setPersistent(persistent);

    if (isMobileDevice) {
      setMessage(message); 
      setSubMessage(subMessage);
      setPrimaryButtonProps(primaryButtonProps);
      setSecondaryButtonProps(secondaryButtonProps);
      setOnPrimaryClick(() => onPrimaryClick || handleClose);
      setOnSecondaryClick(() => onSecondaryClick || handleClose);
    } else {
      setMessage(message);
    }
  };

  return (
    <SnackbarContext.Provider value={showSnackbar}>
      {children}
      {!isMobileDevice && (
        <Snackbar
          open={open}
            autoHideDuration={persistent ? null : 3000} 
          onClose={handleClose}
          anchorOrigin={{ vertical, horizontal }}
        >
          <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
            {message}
          </Alert>
        </Snackbar>
      )}
      {isMobileDevice && open && (
        <CustomAlertRosMobile
          message={message}
          subMessage={subMessage}
          onClose={handleClose}
          primaryButtonProps={primaryButtonProps}
          secondaryButtonProps={secondaryButtonProps}
          onPrimaryClick={onPrimaryClick || handleClose}
          onSecondaryClick={onSecondaryClick || handleClose}
          severity={severity}
        />
      )}
    </SnackbarContext.Provider>
  );
}
