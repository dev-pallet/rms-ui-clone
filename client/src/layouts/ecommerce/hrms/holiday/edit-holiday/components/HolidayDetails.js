import { Box, Card, Grid, InputLabel } from '@mui/material';
import React, { useEffect, useState } from 'react';
import SoftBox from '../../../../../../components/SoftBox';
import SoftInput from '../../../../../../components/SoftInput';
import SoftSelect from '../../../../../../components/SoftSelect';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { country } from '../../../../softselect-Data/country';

function HolidayDetails({
  holidayName,
  setHolidayName,
  holidayDate,
  setHolidayDate,
  holidayType,
  setHolidayType,
  countryVal,
  setCountryVal,
  leaveYearEndDate,
  leaveYearStartDate,
  setLeaveYearStartDate,
  setLeaveYearEndDate,
}) {
  const [countryOptions, setCountryOptions] = useState(() =>
    country.map((el) => {
      return { label: el.label, value: el.label };
    }),
  );
  const inputLabelStyle = { fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' };

  const handleInputChange = (e) => {
    setHolidayName(e.target.value);
  };
  const handleDateChange = (date) => {
    const formattedDate = date ? dayjs(date).format('YYYY-MM-DD') : '';
    setHolidayDate(formattedDate);
  };

  const handleHolidayTypeChange = (selectedOption) => {
    setHolidayType({
      value: selectedOption?.value,
      label: selectedOption?.label,
    });
  };

  const handleCountryChange = (selectedOption) => {
    setCountryVal({
      value: selectedOption?.value,
      label: selectedOption?.label,
    });
  };

  const handleLeaveStartDate = (date) => {
    const formattedStartDate = date ? dayjs(date).format('YYYY-MM-DD') : '';
    setLeaveYearStartDate(formattedStartDate);

    if (date) {
      const isValidDate = dayjs(date).isValid();

      if (isValidDate) {
        const year = dayjs(date).year();
        const isLeapYear = new Date(year, 1, 29).getDate() === 29;
        const daysToAdd = isLeapYear ? 366 : 365;
        const calculatedEndDate = dayjs(date).add(daysToAdd, 'days').format('YYYY-MM-DD');
        setLeaveYearEndDate(calculatedEndDate);
      } else {
        setLeaveYearEndDate('');
      }
    } else {
      setLeaveYearEndDate('');
    }
  };

  const handleLeaveEndDate = (date) => {
    const formattedDate = date ? dayjs(date).format('YYYY-MM-DD') : '';
    setLeaveYearEndDate(formattedDate);
  };

  const holidayFields = [
    { id: 'holidayName', label: 'Holiday Name', type: 'input', onChange: handleInputChange, value: holidayName },
    {
      id: 'leaveYearStartDate',
      label: 'Leave Year Start Year',
      type: 'date',
      onChange: handleLeaveStartDate,
      value: leaveYearStartDate ? dayjs(leaveYearStartDate) : null,
    },
    {
      id: 'leaveYearEndDate',
      label: 'Leave Year End Year',
      type: 'date',
      onChange: handleLeaveEndDate,
      value: leaveYearEndDate ? dayjs(leaveYearEndDate) : null,
    },
    {
      id: 'holidayDate',
      label: 'Holiday Date',
      type: 'date',
      onChange: handleDateChange,
      value: holidayDate ? dayjs(holidayDate) : null,
    },
    {
      id: 'holidayType',
      label: 'Holiday Type',
      type: 'select',
      onChange: handleHolidayTypeChange,
      value: holidayType,
      options: [
        { value: ' GENERAL_HOLIDAY', label: 'General Holiday' },
        { value: 'OPTIONAL_HOLIDAY', label: 'Optional Holiday' },
      ],
    },
    {
      id: 'country',
      label: 'Country',
      type: 'select',
      onChange: handleCountryChange,
      value: countryVal,
      options: countryOptions,
    },
  ];
  return (
    <Card sx={{ padding: '15px', overflow: 'visible' }}>
      <SoftBox sx={{ flexGrow: 1, marginLeft: '20px' }}>
        <Grid container mt={1} spacing={2} direction="row" justifyContent="space-between" alignItems="center">
          {holidayFields?.map((el, index) => (
            <Grid item xs={12} md={12} lg={12} key={index}>
              <InputLabel required sx={inputLabelStyle}>
                {el?.label}
              </InputLabel>

              {el?.type == 'input' && <SoftInput onChange={el?.onChange} value={el?.value} />}

              {el?.type === 'date' && (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    format="YYYY/MM/DD"
                    onChange={el?.onChange}
                    value={el?.value}
                    disabled={el?.id == 'leaveYearEndDate'}
                    className="custom-date-picker-md"
                  />
                </LocalizationProvider>
              )}

              {el?.type === 'select' && (
                <SoftSelect
                  placeholder="Select"
                  size="small"
                  options={el?.options}
                  value={el?.value}
                  onChange={el?.onChange}
                />
              )}
            </Grid>
          ))}
        </Grid>
      </SoftBox>
    </Card>
  );
}

export default HolidayDetails;
