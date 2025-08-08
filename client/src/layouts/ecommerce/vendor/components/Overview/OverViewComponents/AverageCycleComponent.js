import * as React from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import SoftTypography from '../../../../../../components/SoftTypography';
import Stack from '@mui/material/Stack';
import Step from '@mui/material/Step';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 8,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: 'linear-gradient( 136deg, rgb(108,166,247) 0%, rgb(129,129,239) 50%, rgb(107,107,205) 100%)',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: 'linear-gradient( 136deg, rgb(108,166,247) 0%, rgb(129,129,239) 50%, rgb(107,107,205) 100%)',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
    borderRadius: 1,
  },
}));

const ColorlibStepIconRoot = styled('div')(({ theme, ownerState }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
  zIndex: 1,
  color: '#fff',
  width: 12,
  height: 12,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: '3px',
  ...(ownerState.active && {
    backgroundImage: 'linear-gradient( 136deg, rgb(33,113,242) 0%, rgb(64,64,233) 50%, rgb(35,35,135) 100%)',
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  }),
  ...(ownerState.completed && {
    backgroundImage: 'linear-gradient( 136deg, rgb(33,113,242) 0%, rgb(64,64,233) 50%, rgb(35,35,135) 100%)',
  }),
  '& .ColorlibStepIcon-completedIcon': {
    color: '#784af4',
    zIndex: 1,
    fontSize: 12,
  },
}));

function ColorlibStepIcon(props) {
  const { active, completed, className } = props;

  const icons = {
    // 1: <SettingsIcon />,
    // 2: <GroupAddIcon />,
    // 3: <VideoLabelIcon />,
  };

  return (
    <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

ColorlibStepIcon.propTypes = {
  /**
   * Whether this step is active.
   * @default false
   */
  active: PropTypes.bool,
  className: PropTypes.string,
  /**
   * Mark the step as completed. Is passed to child components.
   * @default false
   */
  completed: PropTypes.bool,
  /**
   * The label displayed in the step icon.
   */
  icon: PropTypes.node,
};

const steps = ['Order Placement', 'Confirmation', 'Delivery', 'Payment'];
const purchaseReturnSteps = ['Return request', 'Confirmation', 'Material pickup', 'Closed'];

export default function AverageCycleComponent({ vendorOverViewData }) {
  const renderCell = (label) => {
    switch (label) {
      case 'Order Placement':
        return Math.round(vendorOverViewData?.poConfirmationDays || 0);
      case 'Return request':
        return Math.round(vendorOverViewData?.returnConfirmationDays || 0);
      case 'Confirmation':
        return Math.round(vendorOverViewData?.returnMaterialPickUpDays || 0);
      case 'Material pickup':
        return Math.round(vendorOverViewData?.returnClosed || 0);
      default:
        return 'NA';
    }
  };

  return (
    <>
      <div style={{ padding: '15px' }}>
        <SoftTypography fontWeight="bold" fontSize="0.875rem">
          Average procurment cycle (in days)
        </SoftTypography>
      </div>

      <Stack sx={{ width: '100%', marginTop: '15px' }} spacing={4}>
        <Stepper alternativeLabel activeStep={3} connector={<ColorlibConnector />}>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel StepIconComponent={ColorlibStepIcon} style={{ fontSize: '12px !important' }}>
                <SoftTypography fontSize="0.8rem">{label}</SoftTypography>
                {index < 3 && (
                  <div className="vendorSteperCycleValue">
                    <SoftTypography variant="button" fontSize="small" fontWeight="bold">
                      {renderCell(label, index)}
                    </SoftTypography>
                  </div>
                )}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Stack>

      <div style={{ padding: '15px' }}>
        <SoftTypography fontWeight="bold" fontSize="0.875rem">
          Average purchase return cycle (in days)
        </SoftTypography>
      </div>
      <Stack sx={{ width: '100%', marginTop: '15px' }} spacing={4}>
        <Stepper alternativeLabel activeStep={3} connector={<ColorlibConnector />}>
          {purchaseReturnSteps.map((label, index) => (
            <Step key={label}>
              <StepLabel StepIconComponent={ColorlibStepIcon}>
                <SoftTypography fontSize="0.8rem">{label}</SoftTypography>
                {index < 3 && (
                  <div className="vendorSteperCycleValue">
                    <SoftTypography variant="button" fontSize="medium" fontWeight="bold">
                      {renderCell(label, index)}
                    </SoftTypography>
                  </div>
                )}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Stack>
    </>
  );
}
