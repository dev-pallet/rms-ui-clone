import { useState, useEffect } from 'react';
import DashboardLayout from '../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../examples/Navbars/DashboardNavbar';
import SoftBox from '../../../../../components/SoftBox';
import Box from '@mui/material/Box';
import SoftButton from '../../../../../components/SoftButton';
import SoftInput from '../../../../../components/SoftInput';
import SoftTypography from '../../../../../components/SoftTypography';
import './index.css';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import moment from 'moment';
import { TextareaAutosize } from '@mui/material';
import { contactSalesSupport } from '../../../../../config/Services';

import { useSnackbar } from '../../../../../hooks/SnackbarProvider';

const ContactSales = () => {
  const showSnackbar = useSnackbar();
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    contactNumber: '',
    email: '',
    description: '',
  });

  const orgId = localStorage.getItem('orgId');

  const handleFormData = (e) => {
    const key = e.target.name;
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const verifyPayload = (data) => {
    if (!data.name.length) {
      showSnackbar('Name is required', 'warning');
      return false;
    }
    if (!data.contactNumber.length) {
      showSnackbar('Contact Number is required', 'warning');
      return false;
    }
    if (!data.email.length) {
      showSnackbar('Email is required', 'warning');
      return false;
    }
    return true;
  };

  const handleDate = (date) => {
    let time = moment.utc(date).format('YYYY-MM-DD HH:mm:ss');
    let stillUtc = moment.utc(time).toDate();
    const start = moment(stillUtc).local().format('YYYY-MM-DD');
    // console.log('startDate', start);
    setDate(start);
  };
  const convertTime = (time) => {
    let date = moment.utc(time).format('YYYY-MM-DD HH:mm:ss');
    let stillUtc = moment.utc(date).toDate();
    return moment(stillUtc).local().format('HH:mm');
  };

  const handleSubmit = async () => {
    const payload = {
      retailId: orgId,
      name: formData.name,
      contactNumber: formData.contactNumber,
      email: formData.email,
      description: formData.description,
      date: date,
      time: time,
    };
    // console.log('formData', payload);

    if (!verifyPayload(payload)) {
      return;
    }

    try {
      const response = await contactSalesSupport(payload);
      // console.log('resContactSales', response);
    } catch (e) {
      console.log('error', error);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      {/* <div>ContactSales</div> */}
      <SoftBox
        className="contact-sales-form"
        sx={{
          border: '1px solid #343767',
        }}
      >
        <Box className="form-captions">
          <SoftTypography className="form-header">Request a call back</SoftTypography>
        </Box>
        <Box className="form-captions">
          <SoftTypography className="form-header2">
            Thank you for considering our product for your <br />
            enterprise needs.
          </SoftTypography>
          <SoftTypography className="form-header2">
            <Box className="form-captions">
              <SoftTypography className="form-header2">
                Please fill up the form and we contact you shortly to <br />
                discuss your specific requirements.
              </SoftTypography>
            </Box>
          </SoftTypography>
        </Box>

        <Box className="name flex">
          <SoftTypography variant="caption" className="form-label">
            Name
          </SoftTypography>
          <SoftInput type="text" name="name" placeholder="Enter your name" onChange={handleFormData} />
        </Box>
        <Box className="contact-number flex">
          <SoftTypography variant="caption" className="form-label">
            Contact Number
          </SoftTypography>
          <SoftInput
            type="number"
            name="contactNumber"
            placeholder="Enter your phone number"
            onChange={handleFormData}
          />
        </Box>
        <Box className="flex">
          <SoftTypography variant="caption" className="form-label">
            Email
          </SoftTypography>
          <SoftInput type="text" name="email" placeholder="Enter your email" onChange={handleFormData} />
        </Box>
        <Box className="flex">
          <SoftTypography variant="caption" className="form-label">
            Date
          </SoftTypography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              views={['year', 'month', 'day']}
              className="date-labels"
              // label="Date"
              value={date}
              onChange={(data) => {
                handleDate(data.$d);
              }}
              sx={{
                width: '100%',
                '& .MuiInputLabel-formControl': {
                  fontSize: '0.8rem',
                  top: '-0.4rem',
                  color: '#344767',
                },
              }}
              popperPlacement="right-end"
            />
          </LocalizationProvider>
        </Box>
        <Box className="flex">
          <SoftTypography variant="caption" className="form-label">
            Time
          </SoftTypography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker
              className="date-labels"
              value={time}
              onChange={(newValue) => setTime(convertTime(newValue.$d))}
            />
          </LocalizationProvider>
        </Box>
        <Box className="flex">
          <TextareaAutosize
            onChange={handleFormData}
            name="description"
            aria-label="minimum height"
            minRows={3}
            placeholder="Briefly describe your requirements..."
            className="textarea"
          />
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginTop: '0.5rem',
          }}
        >
          <SoftButton onClick={handleSubmit} className="request-submit-btn">
            Submit
          </SoftButton>
        </Box>
      </SoftBox>
    </DashboardLayout>
  );
};

export default ContactSales;
