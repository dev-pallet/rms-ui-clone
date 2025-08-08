import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../examples/Navbars/DashboardNavbar';
import sideNavUpdate from '../../components/sidenavupdate';
import SoftBox from '../../../../../components/SoftBox';
import HolidayDetails from './components/HolidayDetails';
import { Box, Grid } from '@mui/material';
import SoftTypography from '../../../../../components/SoftTypography';
import SoftButton from '../../../../../components/SoftButton';
import { useSnackbar } from '../../../../../hooks/SnackbarProvider';
import { hrmsGetHolidayDetail, hrmsUpdateHoliday } from '../../../../../config/Services';
import { useNavigate, useParams } from 'react-router-dom';

function HrmsUpdateHoliday() {
  sideNavUpdate();
  const [holidayName, setHolidayName] = useState('');
  const [holidayDate, setHolidayDate] = useState('');
  const [holidayType, setHolidayType] = useState({});
  const [countryVal, setCountryVal] = useState(null);
  const [leaveYearStartDate, setLeaveYearStartDate] = useState('');
  const [leaveYearEndDate, setLeaveYearEndDate] = useState('');

  const { id } = useParams();
  const showSnackbar = useSnackbar();
  const navigate = useNavigate();

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };
  const checkType = (val) => {
    switch (val) {
      case 'GENERAL_HOLIDAY':
        return 'General Holiday';
      case 'OPTIONAL_HOLIDAY':
        return 'Optional Holiday';
      default:
        return;
    }
  };

  const getHolidays = () => {
    showSnackbar('Holiday data is loading...', 'info', '', '', '', '', '', true);

    hrmsGetHolidayDetail(id).then((res) => {
      const holidayTypeLabel = checkType(res?.data?.data?.data?.holidayType);

      if (res?.status == 200 && res?.data?.data?.es == 0) {
        setHolidayName(res?.data?.data?.data?.holidayName);
        setHolidayDate(res?.data?.data?.data?.holidayDate);
        setHolidayType({ label: holidayTypeLabel, value: res?.data?.data?.data?.holidayType });
        setCountryVal({ label: res?.data?.data?.data?.country, value: res?.data?.data?.data?.country });
        setLeaveYearStartDate(res?.data?.data?.data?.leaveYearStart);
        setLeaveYearEndDate(res?.data?.data?.data?.leaveYearEnd);

        showSnackbar('Holiday details loaded successfully', 'success');
      } else {
        showSnackbar('Something went wrong', 'error');
      }
    });
  };
  useEffect(() => {
    getHolidays();
  }, []);

  const validatePayload = (payload) => {
    if (payload?.holidayName === '') {
      setErrorHandler('Holiday Name is required');
      setesClr('warning');
      setOpen(true);
      return false;
    }

    if (payload?.leaveStartYear === '') {
      setErrorHandler('Please Provide Leave Start Year');
      setesClr('warning');
      setOpen(true);
      return false;
    }

    return true;
  };

  const updateHolidayDetails = (event) => {
    event.preventDefault();

    const orgId = localStorage.getItem('orgId');
    const locId = localStorage.getItem('locId');
    const fullName = localStorage.getItem('user_name');
    const user_details = localStorage.getItem('user_details');
    const createdById = user_details && JSON.parse(user_details)?.uidx;

    const payload = {
      organizationId: orgId,
      locationId: locId,
      updatedBy: createdById,
      updatedByName: fullName,
      holidayName: holidayName,
      holidayDate: holidayDate,
      leaveYearStart: leaveYearStartDate,
      leaveYearEnd: leaveYearEndDate,
      holidayType: holidayType?.value,
      country: countryVal?.value,
    };
    if (!validatePayload(payload)) {
      return;
    }

    hrmsUpdateHoliday(payload, id)
      .then((res) => {
        if (res?.status === 200 && res?.data?.data?.es == 0) {
          showSnackbar('Holiday details updated successfully', 'success');
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
          <SoftButton className="vendor-add-btn" onClick={updateHolidayDetails}>
            Save
          </SoftButton>
        </SoftBox>
      </Grid>
    </DashboardLayout>
  );
}

export default HrmsUpdateHoliday;
