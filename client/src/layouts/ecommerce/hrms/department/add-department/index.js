import React, { useState } from 'react';
import DashboardLayout from '../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../examples/Navbars/DashboardNavbar';
import sideNavUpdate from '../../components/sidenavupdate';
import { Box, Grid, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import SoftBox from '../../../../../components/SoftBox';
import SoftTypography from '../../../../../components/SoftTypography';
import AddDepartmentDetails from './components/AddDepartmentDetails';
import SoftButton from '../../../../../components/SoftButton';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../../../../hooks/SnackbarProvider';
import { hrmsCreateDepartment } from '../../../../../config/Services';

function AddDepartmemnt() {
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  sideNavUpdate();
  const [departmentName, setDepartmentName] = useState('');
  const [departmentLead, setDepartmentLead] = useState(null);
  const [open, setOpen] = useState(false);
  const [errorhandler, setErrorHandler] = useState('');
  const [vertical, setVertical] = useState('bottom');
  const [horizontal, setHorizontal] = useState('center');
  const [esClr, setesClr] = useState('');
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();

  const validatePayload = (payload) => {
    if (payload.departmentName === '') {
      setErrorHandler('Please write Department name');
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

  const createNewDepartment = (event) => {
    event.preventDefault();
    const orgId = localStorage.getItem('orgId');
    const locId = localStorage.getItem('locId');
    const user_details = JSON.parse(localStorage.getItem('user_details'));
    const userId = user_details?.uidx;
    const userName = localStorage.getItem('user_name');
    const payload = {
      organizationId: orgId,
      locationId: locId,
      departmentName: departmentName,
      departmentLead: departmentLead?.value,
      createdBy: userId,
      createdByName: userName,
    };

    if (!validatePayload(payload)) {
      return;
    }

    hrmsCreateDepartment(payload)
      .then((res) => {
        if (res?.status == 200 && res?.data?.data?.es == 0) {
          showSnackbar('Department added successfully', 'success');
          navigate('/hrms-department');
        } else {
          showSnackbar(res?.data?.data?.message || 'Failed to add Department', 'error');
        }
      })
      .catch((err) => {
        if (err?.response) {
          showSnackbar(err?.response?.data?.message || 'Server error occurred', 'error');
        } else if (err?.request) {
          showSnackbar('No response from server. Please check your connection.', 'error');
        } else {
          showSnackbar(err?.message || 'An unknown error occurred', 'error');
        }
      });
  };

  const backToDepartmentList = () => {
    navigate('/hrms-department');
  };
  return (
    <DashboardLayout>
      <DashboardNavbar prevLink={true} />
      <Box p={1}>
        <SoftBox p={1} className="common-display-flex">
          <SoftTypography fontWeight="bold" fontSize="1.1rem">
            Add Department
          </SoftTypography>{' '}
        </SoftBox>

        <SoftBox>
          <AddDepartmentDetails
            departmentName={departmentName}
            setDepartmentName={setDepartmentName}
            departmentLead={departmentLead}
            setDepartmentLead={setDepartmentLead}
          />
        </SoftBox>

        <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
          <SoftBox className="form-button-customer" style={{ display: 'flex', gap: '12px' }}>
            <SoftButton className="vendor-second-btn" onClick={backToDepartmentList}>
              Cancel
            </SoftButton>
            <SoftButton className="vendor-add-btn" onClick={createNewDepartment}>
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

export default AddDepartmemnt;
