import React from 'react';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const DescriptionTooltip = ({ title, children, ...props }) => {
  const StyledTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} placement="right" />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.background.paper,
      color: '#001F3F !important',
      maxWidth: 'none',
      fontSize: theme.typography.pxToRem(12),
      border: `1px solid ${theme.palette.divider}`,
      boxShadow: '3px 3px 6px rgba(0, 0, 0, 0.1)',
      fontWeight: 600,
    },
    [`& .${tooltipClasses.arrow}`]: {
      color: theme.palette.background.paper,
    },
  }));

  return (
    <StyledTooltip title={title} arrow {...props}>
      {children}
    </StyledTooltip>
  );
};

export default DescriptionTooltip;
