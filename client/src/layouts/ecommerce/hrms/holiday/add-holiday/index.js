import React, { useState } from 'react';
import DashboardLayout from '../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../examples/Navbars/DashboardNavbar';
import sideNavUpdate from '../../components/sidenavupdate';
import SoftBox from '../../../../../components/SoftBox';
import HolidayDetails from './components/HolidayDetails';
import { Box, Grid } from '@mui/material';
import SoftTypography from '../../../../../components/SoftTypography';
import SoftButton from '../../../../../components/SoftButton';
import { useSnackbar } from '../../../../../hooks/SnackbarProvider';
import { hrmsCreateHoliday } from '../../../../../config/Services';
import { useNavigate } from 'react-router-dom';

function HrmsAddHoliday() {
  sideNavUpdate();
  const [holidayName, setHolidayName] = useState('');
  const [holidayDate, setHolidayDate] = useState('');
  const [holidayType, setHolidayType] = useState({});
  const [countryVal, setCountryVal] = useState(null);
  const [leaveYearStartDate, setLeaveYearStartDate] = useState('');
  const [leaveYearEndDate, setLeaveYearEndDate] = useState('');

  const showSnackbar = useSnackbar();
  const navigate = useNavigate();

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const validatePayload = (payload) => {
    if (payload.holidayName === '') {
      setErrorHandler('Holiday Name is required');
      setesClr('warning');
      setOpen(true);
      return false;
    }
    if (payload.leaveStartYear === '') {
      setErrorHandler('Please Provide Leave Start Year');
      setesClr('warning');
      setOpen(true);
      return false;
    }

    return true;
  };

  const createNewHoliday = (event) => {
    event.preventDefault();

    const orgId = localStorage.getItem('orgId');
    const locId = localStorage.getItem('locId');
    const fullName = localStorage.getItem('user_name');
    const user_details = localStorage.getItem('user_details');
    const createdById = user_details && JSON.parse(user_details).uidx;

    const payload = {
      organizationId: orgId,
      locationId: locId,
      createdBy: createdById,
      createdByName: fullName,
      holidayName: holidayName,
      holidayDate: holidayDate,
      leaveYearStart: leaveYearStartDate,
      leaveYearEnd: leaveYearEndDate,
      holidayType: holidayType?.value,
      country: countryVal.value,
    };

    if (!validatePayload(payload)) {
      return;
    }

    hrmsCreateHoliday(payload)
      .then((res) => {
        if (res?.status === 200 && res?.data?.data?.es == 0) {
          showSnackbar('Holiday added successfully', 'success');
          navigate('/hrms-holiday');
        } else {
          showSnackbar(`${res?.data?.data?.message}`, 'warning');
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

  const backToHolidayList = () => {
    navigate('/hrms-holiday');
  };

  return (
    <DashboardLayout>
      <DashboardNavbar prevLink={true} />
      <Box p={1}>
        <SoftBox p={1} className="common-display-flex">
          <SoftTypography fontWeight="bold" fontSize="1.1rem">
            Add new holiday
          </SoftTypography>{' '}
        </SoftBox>
        <SoftBox className="main-product-description mtop">
          <HolidayDetails
            holidayName={holidayName}
            setHolidayName={setHolidayName}
            holidayDate={holidayDate}
            setHolidayDate={setHolidayDate}
            holidayType={holidayType}
            setHolidayType={setHolidayType}
            countryVal={countryVal}
            setCountryVal={setCountryVal}
            leaveYearEndDate={leaveYearEndDate}
            leaveYearStartDate={leaveYearStartDate}
            setLeaveYearStartDate={setLeaveYearStartDate}
            setLeaveYearEndDate={setLeaveYearEndDate}
          />
        </SoftBox>
      </Box>
      <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
        <SoftBox className="form-button-customer" style={{ display: 'flex', gap: '12px' }}>
          <SoftButton className="vendor-second-btn" onClick={backToHolidayList}>
            Cancel
          </SoftButton>
          <SoftButton className="vendor-add-btn" onClick={createNewHoliday}>
            Save
          </SoftButton>
        </SoftBox>
      </Grid>
    </DashboardLayout>
  );
}

export default HrmsAddHoliday;
