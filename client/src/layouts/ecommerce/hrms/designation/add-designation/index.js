import { Box, Grid, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import React, {  useState } from 'react';
import SoftBox from '../../../../../components/SoftBox';
import DashboardLayout from '../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../examples/Navbars/DashboardNavbar';
import AddDesignationDetails from './components/AddDesignationDetails';
import SoftButton from '../../../../../components/SoftButton';
import sideNavUpdate from '../../components/sidenavupdate';
import { useNavigate } from 'react-router-dom';
import SoftTypography from '../../../../../components/SoftTypography';
import { hrmsCreateDesignations } from '../../../../../config/Services';
import { useSnackbar } from '../../../../../hooks/SnackbarProvider';

function HrmsAddDesignation() {
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  sideNavUpdate();
  const [designationName, setDesignationName] = useState('');
  const [departmentDetails, setDepartmentDetails] = useState(null);
  const [open, setOpen] = useState(false);
  const [errorhandler, setErrorHandler] = useState('');
  const [vertical, setVertical] = useState('bottom');
  const [horizontal, setHorizontal] = useState('center');
  const [esClr, setesClr] = useState('');
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();

  const backToDesignationList = () => {
    navigate('/hrms-designation');
  };

  const validatePayload = (payload) => {
    if (payload.designationName === '') {
      setErrorHandler('Please enter Designation Name');
      setesClr('warning');
      setOpen(true);
      return false;
    }
    return true;
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const createNewDesignation = (event) => {
    event.preventDefault();
    const orgId = localStorage.getItem('orgId');
    const locId = localStorage.getItem('locId');
    const user_details = JSON.parse(localStorage.getItem('user_details'));
    const userId = user_details?.uidx;
    const userName = localStorage.getItem('user_name');
    const payload = {
      organizationId: orgId,
      locationId: locId,
      departmentId: departmentDetails?.value,
      designationName: designationName,
      createdBy: userId,
      createdByName: userName,
    };
    if (!validatePayload(payload)) {
      return;
    }
    hrmsCreateDesignations(payload)
      .then((res) => {
        if (res?.status == 200 && res?.data?.data?.es == 0) {
          showSnackbar('Designation added successfully', 'success');
          navigate('/hrms-designation');
        } else {
          showSnackbar(res?.data?.data?.message || 'Failed to add Designation', 'error');
        }
      })
      .catch((err) => {
        if (err?.response) {
          showSnackbar(err?.response.data?.message || 'Server error occurred', 'error');
        } else if (err?.request) {
          showSnackbar('No response from server. Please check your connection.', 'error');
        } else {
          showSnackbar(err?.message || 'An unknown error occurred', 'error');
        }
      });
  };

  return (
    <DashboardLayout>
      <DashboardNavbar prevLink={true} />
      <Box p={1}>
        <SoftBox p={1} className="common-display-flex">
          <SoftTypography fontWeight="bold" fontSize="1.1rem">
            Add Designation
          </SoftTypography>{' '}
        </SoftBox>

        <SoftBox className="main-product-description">
          <AddDesignationDetails
            designationName={designationName}
            setDesignationName={setDesignationName}
            departmentDetails={departmentDetails}
            setDepartmentDetails={setDepartmentDetails}
          />
        </SoftBox>
        <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
          <SoftBox className="form-button-customer" style={{ display: 'flex', gap: '12px' }}>
            <SoftButton className="vendor-second-btn" onClick={backToDesignationList}>
              Cancel
            </SoftButton>
            <SoftButton className="vendor-add-btn" onClick={createNewDesignation}>
              Save
            </SoftButton>
          </SoftBox>
        </Grid>
      </Box>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleCloseAlert} anchorOrigin={{ vertical, horizontal }}>
        <Alert onClose={handleCloseAlert} severity={esClr} sx={{ width: '100%' }}>
          {errorhandler}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
}

export default HrmsAddDesignation;
