import React, { useState } from 'react';
import { Box, Card, Grid, InputLabel } from '@mui/material';
import SoftBox from '../../../../../../components/SoftBox';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import Checkbox from '@mui/material/Checkbox';
import SoftInput from '../../../../../../components/SoftInput';
import SoftButton from '../../../../../../components/SoftButton';
import { v4 as uuidv4 } from 'uuid';

function EmploymentDetails({ _, index, onRemove, setEmployerDetails, employerDetails, canRemove, id }) {
  const inputLabelStyle = { fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' };

  const handleDateChange = (name, date) => {
    const formattedDate = date ? dayjs(date).format('YYYY-MM-DD') : '';
    setEmployerDetails((prevDetails) => {
      const updatedDetails = [...prevDetails];
      const index = updatedDetails.findIndex((el) => el.id === id);
      if (index !== -1) {
        updatedDetails[index] = { ...updatedDetails[index], [name]: formattedDate };
      }
      return updatedDetails;
    });
  };

  const handleCheckBoxChange = (e) => {
    setEmployerDetails((prev) => {
      const updatedDetails = [...prev];
      const index = updatedDetails.findIndex((el) => el.id == id);
      if (index !== -1) {
        updatedDetails[index] = { ...updatedDetails[index], verified: e.target.checked };
      }
      return updatedDetails;
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (!name || value === undefined) return;

    setEmployerDetails((prevDetails) => {
      const updatedDetails = [...prevDetails];
      const index = updatedDetails.findIndex((el) => el.id === id);
      if (index !== -1) {
        updatedDetails[index] = { ...updatedDetails[index], [name]: value };
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
      value: employerDetails[index]?.startDate,
    },
    {
      label: 'End Date',
      type: 'date',
      onChange: (date) => handleDateChange('endDate', date),
      value: employerDetails[index]?.endDate,
    },
    {
      id: 'yoe',
      label: 'Years of Experience',
      onChange: handleInputChange,
      value: employerDetails[index]?.yoe,
      type: 'input',
    },
    {
      id: `verificationStatus_${index}`,
      label: 'Verified',
      onChange: handleCheckBoxChange,
      value: employerDetails[index]?.verified,
      type: 'checkbox',
    },
  ];

  return (
    <Card sx={{ padding: '15px', overflow: 'visible', marginTop: '20px' }}>
      <SoftBox sx={{ flexGrow: 1, marginLeft: '20px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <InputLabel style={{ fontWeight: 'bold' }}>Work Information #{index + 1}</InputLabel>
          {canRemove && (
            <SoftButton
              onClick={onRemove}
              sx={{ marginTop: '10px', backgroundColor: '#FF0000 !important', color: '#FFF' }}
            >
              Remove
            </SoftButton>
          )}
        </Box>

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
                {field?.type === 'checkbox' && <Checkbox size="small" onChange={field?.onChange} value={field?.value} />}
              </SoftBox>
            </Grid>
          ))}
        </Grid>
      </SoftBox>
    </Card>
  );
}

function EmploymentDetailsWrapper({ employerDetails, setEmployerDetails }) {
  const handleAddMore = () => {
    setEmployerDetails((prev) => [
      ...prev,
      { id: uuidv4(), employerName: '', startDate: '', endDate: '', verified: false },
    ]);
  };

  const handleRemove = (idToRemove) => {
    setEmployerDetails(employerDetails.filter((detail) => detail.id !== idToRemove));
  };

  return (
    <div>
      {employerDetails.map((detail, index) => (
        <EmploymentDetails
          key={detail.id}
          index={index}
          onRemove={() => handleRemove(detail.id)}
          setEmployerDetails={setEmployerDetails}
          employerDetails={employerDetails}
          canRemove={index !== 0}
          id={detail.id}
        />
      ))}
      <SoftButton
        onClick={handleAddMore}
        sx={{
          padding: '10px 20px',
          margin: '10px 0 0 10px',
          backgroundColor: '#007AFF !important',
          color: '#FFF',
          borderRadius: '20px',
          boxShadow: '0px 4px 6px rgba(0, 122, 255, 0.4)',
          '&:hover': {
            backgroundColor: '#005BBB',
          },
        }}
      >
        Add More
      </SoftButton>
    </div>
  );
}

export default EmploymentDetailsWrapper;
