import React, { useEffect } from 'react';
import { CheckCircleIcon, ExclamationCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import CommonIcon from '../common-icon-comp';
import './custom-alert.css';
import CustomMobileButton from '../button';

const CustomAlertRosMobile = ({
  message,
  subMessage,
  onClose,
  primaryButtonProps,
  secondaryButtonProps,
  position = 'top',
  onPrimaryClick,
  onSecondaryClick,
  severity = 'info'
}) => {

  const backgroundColor = {
    success: '#E8FFD8',
    error: '#FFE9E9',
    warning: '#FFF5B2',
    info: '#D9F2FF'
  }[severity] || '#FFE9E9';

  const icon = {
    success: <CheckCircleIcon />,
    error: <ExclamationCircleIcon />,
    warning: <ExclamationTriangleIcon />,
    info: <InformationCircleIcon />
  }[severity] || <InformationCircleIcon />

  const severityIconColor = {
    success: '#0B742C',
    error: '#E90000',
    warning: '#FEE00E',
    info: '#0860E6'
  }[severity] || '#2196F3';

  useEffect(() => {
    if (!primaryButtonProps && !secondaryButtonProps) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [onClose, primaryButtonProps, secondaryButtonProps]);

  return (
    <div className={`custom-alert-mobile-ros ${position}`} style={{ backgroundColor }}>
      <div className="icon-container-mobile-ros">
        <CommonIcon icon={icon} iconColor={severityIconColor} width='1.5rem' />
      </div>
      <div className="custom-alert-content-mobile-ros">

        <div className="notification-mobile-ros">
          <span className="message-mobile-ros">{message}</span>
          <span className="subMessage-mobile-ros">{subMessage}</span>

          <div className="button-group-mobile-ros">
            {primaryButtonProps && (
              <CustomMobileButton
                variant='black-H'
                {...primaryButtonProps}
                onClickFunction={onPrimaryClick}
              />
            )}
            {secondaryButtonProps && (
              <CustomMobileButton
                variant="black-S"
                {...secondaryButtonProps}
                onClickFunction={onSecondaryClick}
              />
            )}
          </div>
        </div>
      </div>
      <button className="close-button-mobile-ros" onClick={onClose}>
        <CommonIcon icon={<XCircleIcon />} width='1.5rem' />
      </button>
    </div>
  );
};

export default CustomAlertRosMobile;