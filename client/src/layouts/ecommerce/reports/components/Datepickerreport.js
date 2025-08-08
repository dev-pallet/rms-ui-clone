import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Box } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import React, { useEffect, useState } from 'react';
import SoftBox from '../../../../components/SoftBox';
import SoftButton from '../../../../components/SoftButton';
import dayjs from 'dayjs';

const DatepickerReport = ({ setFromdate, setTodate }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleButtonClick = () => {
    setShowDatePicker(true);
  };

  const handleStartDateChange = (date) => {
    if (date) {
      // Format the date as a string in the 'YYYY-MM-DD' format
      const formattedDate = dayjs(date).format('YYYY-MM-DD');
      setStartDate(formattedDate);
    }
    // console.log(event.target.value)
    // setStartDate(event.target.value)
    // setStartDate(start);
  };

  const handleEndDateChange = (date) => {
    if (date) {
      // Format the date as a string in the 'YYYY-MM-DD' format
      const formattedDate = dayjs(date).format('YYYY-MM-DD');
      setEndDate(formattedDate);
    }
    // setEndDate(event.target.value);
  };

  useEffect(() => {
    if (startDate?.length > 0 || endDate?.length > 0) {
      setFromdate(startDate);
      setTodate(endDate);
    }
  }, [startDate, endDate]);

  const desktopStyles = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'baseline',
  };

  const mobileStyles = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'baseline',
  };
  return (
    <Box sx={{ display: 'flex', columnGap: '10px', rowGap: '10px', flexWrap: 'wrap' }}>
      {!showDatePicker && (
        <SoftButton variant="solidWhiteBackground" onClick={handleButtonClick} size="small" >
          Select Date Range
        </SoftButton>
      )}

      {showDatePicker && (
        <>
          {/*start date select  */}
          <SoftBox>
            <SoftBox className="start-date">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  views={['year', 'month', 'day']}
                  label="Start Date"
                  value={startDate ? dayjs(startDate) : null}
                  onChange={(date) => handleStartDateChange(date)}
                  format="DD/MM/YYYY"
                  maxDate={dayjs()}
                  sx={{
                    width: '100%',
                    '& .MuiInputLabel-formControl': {
                      fontSize: '0.8rem',
                      top: '-0.4rem',
                      left: '-0.4rem',
                      color: startDate ? '#ffffff !important' : '#344767 !important',
                    },
                    '& .MuiInputLabel-formControl.Mui-focused': { left: '-0.4rem', color: '#ffffff !important' },
                  }}
                />
              </LocalizationProvider>
            </SoftBox>
          </SoftBox>

          {/* end date select  */}
          <SoftBox>
            <SoftBox className="end-date">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  views={['year', 'month', 'day']}
                  label="End Date"
                  value={endDate ? dayjs(endDate) : null}
                  onChange={(date) => handleEndDateChange(date)}
                  maxDate={dayjs()}
                  format="DD/MM/YYYY"
                  maxDate={dayjs()}
                  sx={{
                    width: '100%',
                    '& .MuiInputLabel-formControl': {
                      fontSize: '0.8rem',
                      top: '-0.4rem',
                      left: '-0.4rem',
                      color: endDate ? '#ffffff !important' : '#344767 !important',
                    },
                    '& .MuiInputLabel-formControl.Mui-focused': { left: '-0.4rem', color: '#ffffff !important' },
                  }}
                />
              </LocalizationProvider>
            </SoftBox>
          </SoftBox>
        </>
      )}

      {/* {showDatePicker && (
        <div style={window.innerWidth >= 768 ? desktopStyles : mobileStyles}>
          <div style={{ display: 'flex', flexDirection: 'column', margin: '3px' }}>
            <SoftTypography style={{ fontSize: '0.9rem' }}>From </SoftTypography>
            <TextField
              type="date"
              value={startDate}
              onChange={handleStartDateChange}
              InputLabelProps={{
                shrink: true,
              }}
              style={{
                backgroundColor: 'ghostwhite',
                border: '1px solid #ccc',
                borderRadius: '5px',
                padding: '5px',
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', margin: '3px' }}>
            <SoftTypography style={{ fontSize: '0.9rem', marginLeft: '10px' }}>To </SoftTypography>
            <TextField
              type="date"
              value={endDate}
              onChange={handleEndDateChange}
              InputLabelProps={{
                shrink: true,
              }}
              style={{
                backgroundColor: 'ghostwhite',
                border: '1px solid #ccc',
                borderRadius: '5px',
                padding: '5px',
              }}
            />
          </div>
        </div>
      )} */}
    </Box>
  );
};

export default DatepickerReport;
