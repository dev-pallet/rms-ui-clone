import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../examples/Navbars/DashboardNavbar';
import sideNavUpdate from '../../components/sidenavupdate';
import { Box, Grid, Snackbar } from '@mui/material';
import SoftBox from '../../../../../components/SoftBox';
import SoftTypography from '../../../../../components/SoftTypography';
import AddDepartmentDetails from './components/AddDepartmentDetails';
import SoftButton from '../../../../../components/SoftButton';
import { useNavigate, useParams } from 'react-router-dom';
import { hrmsGetDepartment, hrmsUpdateDepartment } from '../../../../../config/Services';
import { useSnackbar } from '../../../../../hooks/SnackbarProvider';

function AddDepartmemnt() {
  sideNavUpdate();
  const [departmentName, setDepartmentName] = useState('');
  const [departmentLead, setDepartmentLead] = useState(null);

  const navigate = useNavigate();
  const showSnackbar = useSnackbar();
  const { id } = useParams();

  const backToDepartmentList = () => {
    navigate('/hrms-department');
  };

  useEffect(() => {
    hrmsGetDepartment(id).then((res) => {
      setDepartmentName(res?.data?.data?.data?.departmentName || '');
      setDepartmentLead({
        value: res?.data?.data?.data?.departmentLeadId || '',
        label: res?.data?.data?.data?.departmentLeadName || '',
      });
    });
  }, []);
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

  const updateDepartmentDetails = (event) => {
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
      updatedBy: userId,
      updatedByName: userName,
    };

    if (!validatePayload(payload)) {
      return;
    }

    hrmsUpdateDepartment(payload, id)
      .then((res) => {
        if (res?.status === 200 && res?.data?.data?.es == 0) {
          showSnackbar('Department details updated successfully', 'success');
          navigate('/hrms-department');
        } else {
          showSnackbar(res?.data?.data?.message || 'Failed to update Department Details', 'error');
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

    navigate;
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
            <SoftButton className="vendor-add-btn" onClick={updateDepartmentDetails}>
              Save
            </SoftButton>
          </SoftBox>
        </Grid>
      </Box>
    </DashboardLayout>
  );
}

export default AddDepartmemnt;
