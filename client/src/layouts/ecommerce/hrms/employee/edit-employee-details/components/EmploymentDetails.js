import React, { useState } from 'react';
import { Card, Grid, InputLabel } from '@mui/material';
import SoftBox from '../../../../../../components/SoftBox';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import Checkbox from '@mui/material/Checkbox';
import SoftInput from '../../../../../../components/SoftInput';

function EmploymentDetails({ _, index, setEmployerDetails, employerDetails, id }) {
  const inputLabelStyle = { fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' };

  const handleDateChange = (name, date) => {
    const formattedDate = date ? dayjs(date).format('YYYY-MM-DD') : '';
    setEmployerDetails((prevDetails) => {
      const updatedDetails = [...prevDetails];
      const index = updatedDetails.findIndex((el) => el.employerDetailsId === id);
      if (index !== -1) {
        updatedDetails[index] = { ...updatedDetails[index], [name]: formattedDate };
      }
      return updatedDetails;
    });
  };

  const handleCheckBoxChange = (e) => {
    setEmployerDetails((prev) => {
      const updatedDetails = [...prev];
      const indexVal = updatedDetails?.findIndex((el) => {
        return el.employerDetailsId == id;
      });
      if (indexVal !== -1) {
        updatedDetails[indexVal] = { ...updatedDetails[indexVal], verificationStatus: e.target.checked };
      }
      return updatedDetails;
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (!name || value === undefined) return;

    setEmployerDetails((prevDetails) => {
      const updatedDetails = [...prevDetails];
      const indexVal = updatedDetails.findIndex((el) => {
        return el.employerDetailsId == id;
      });
      if (indexVal !== -1) {
        updatedDetails[indexVal] = { ...updatedDetails[indexVal], [name]: value };
      }
      return updatedDetails;
    });
  };

  const employmentDetails = [
    {
      id: 'employerName',
      label: 'Employer',
      onChange: handleInputChange,
      value: employerDetails[index]?.employerName,
      type: 'input',
    },
    {
      label: 'Start Date',
      type: 'date',
      onChange: (date) => handleDateChange('startDate', date),
      value: employerDetails[index]?.startDate ? dayjs(employerDetails[index].startDate) : null,
    },
    {
      label: 'End Date',
      type: 'date',
      onChange: (date) => handleDateChange('endDate', date),
      value: employerDetails[index]?.endDate ? dayjs(employerDetails[index].endDate) : null,
    },
    {
      id: 'yearsOfExperience',
      label: 'Years of Experience',
      onChange: handleInputChange,
      value: employerDetails[index]?.yearsOfExperience,
      type: 'input',
    },
    {
      id: `verificationStatus_${index}`,
      label: 'Verified',
      onChange: handleCheckBoxChange,
      value: employerDetails[index]?.verificationStatus,
      type: 'checkbox',
    },
  ];

  return (
    <Card sx={{ padding: '15px', overflow: 'visible', marginTop: '20px' }}>
      <SoftBox sx={{ flexGrow: 1, marginLeft: '20px' }}>
        <Grid mt={1} container spacing={2}>
          {employmentDetails?.map((field, idx) => (
            <Grid item xs={12} md={12} lg={12} key={idx}>
              <SoftBox
                sx={{
                  display: field?.type === 'checkbox' ? 'flex' : '',
                  gap: field?.type === 'checkbox' ? '5px' : '',
                  alignItems: 'center',
                }}
              >
                <InputLabel sx={inputLabelStyle}>{field?.label}</InputLabel>

                {field?.type === 'input' && (
                  <SoftInput
                    name={field?.id}
                    onChange={field?.onChange}
                    value={field?.value}
                    className="select-box-category"
                    size="small"
                  />
                )}
                {field?.type === 'date' && (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      format="YYYY/MM/DD"
                      onChange={field?.onChange}
                      value={field?.value}
                      className="custom-date-picker-md"
                    />
                  </LocalizationProvider>
                )}
                {field?.type === 'checkbox' && (
                  <Checkbox size="small" onChange={field?.onChange} checked={field?.value} />
                )}
              </SoftBox>
            </Grid>
          ))}
        </Grid>
      </SoftBox>
    </Card>
  );
}

function EmploymentDetailsWrapper({ employerDetails, setEmployerDetails }) {
  return (
    <div>
      {employerDetails?.length &&
        employerDetails?.map((detail, index) => (
          <EmploymentDetails
            key={detail?.employerDetailsId}
            index={index}
            setEmployerDetails={setEmployerDetails}
            employerDetails={employerDetails}
            id={detail?.employerDetailsId}
          />
        ))}
    </div>
  );
}

export default EmploymentDetailsWrapper;
