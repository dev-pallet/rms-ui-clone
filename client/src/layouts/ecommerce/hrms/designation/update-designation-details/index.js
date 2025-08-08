import { Box, Grid, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import React, { useEffect, useState } from 'react';
import SoftBox from '../../../../../components/SoftBox';
import DashboardLayout from '../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../examples/Navbars/DashboardNavbar';
import AddDesignationDetails from './components/AddDesignationDetails';
import SoftButton from '../../../../../components/SoftButton';
import sideNavUpdate from '../../components/sidenavupdate';
import { useNavigate, useParams } from 'react-router-dom';
import SoftTypography from '../../../../../components/SoftTypography';
import { hrmsGetDesignation, hrmsUpdateDesignation } from '../../../../../config/Services';
import { useSnackbar } from '../../../../../hooks/SnackbarProvider';

function HrmsUpdateDesignationDetails() {
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  sideNavUpdate();
  const [designationName, setDesignationName] = useState('');
  const [open, setOpen] = useState(false);
  const [errorhandler, setErrorHandler] = useState('');
  const [vertical, setVertical] = useState('bottom');
  const [horizontal, setHorizontal] = useState('center');
  const [esClr, setesClr] = useState('');
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();
  const { id } = useParams();
  const [departmentName, setDepartmentName] = useState(null);

  useEffect(() => {
    hrmsGetDesignation(id).then((res) => {
      setDesignationName(res?.data?.data?.data?.designationName);
      setDepartmentName({ value: res?.data?.data?.data?.departmentId, label: res?.data?.data?.data?.departmentName });
    });
  }, []);

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

  const editDesignation = (event) => {
    event.preventDefault();

    const orgId = localStorage.getItem('orgId');
    const locId = localStorage.getItem('locId');
    const user_details = JSON.parse(localStorage.getItem('user_details'));
    const userId = user_details?.uidx;
    const userName = localStorage.getItem('user_name');
    const payload = {
      organizationId: orgId,
      locationId: locId,
      designationName: designationName,
      departmentId: departmentName?.value,
      updatedBy: userId,
      updatedByName: userName,
    };
    if (!validatePayload(payload)) {
      return;
    }
    hrmsUpdateDesignation(payload, id)
      .then((res) => {
        if (res?.status === 200 && res?.data?.data?.es == 0) {
          showSnackbar('Designation updated successfully', 'success');
          navigate('/hrms-designation');
        } else {
          showSnackbar(res?.data?.data?.message || 'Failed to update designation', 'error');
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
            Edit Details
          </SoftTypography>{' '}
        </SoftBox>
        <SoftBox className="main-product-description">
          <AddDesignationDetails
            designationName={designationName}
            setDesignationName={setDesignationName}
            departmentName={departmentName}
            setDepartmentName={setDepartmentName}
          />
        </SoftBox>
        <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
          <SoftBox className="form-button-customer" style={{ display: 'flex', gap: '12px' }}>
            <SoftButton className="vendor-second-btn" onClick={backToDesignationList}>
              Cancel
            </SoftButton>
            <SoftButton className="vendor-add-btn" onClick={editDesignation}>
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

export default HrmsUpdateDesignationDetails;
