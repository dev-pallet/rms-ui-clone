import { Autocomplete, Card, createFilterOptions, Grid, InputLabel, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import SoftBox from '../../../../../../components/SoftBox';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import SoftInput from '../../../../../../components/SoftInput';
import '../../../hrms.css';
import dayjs from 'dayjs';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

function PersonalDetails({
  dob,
  setDob,
  gender,
  setGender,
  maritalStatus,
  setMaritalStatus,
  officialPhoneNo,
  setOfficialPhoneNo,
  personalPhoneNo,
  setPersonalPhoneNo,
  emergencyPhoneNumber,
  setEmergencyPhoneNumber,
  officialCountryCode,
  setOfficialCountryCode,
  personalCountryCode,
  setPersonalCountryCode,
  emergencyCountryCode,
  setEmergencyCountryCode,
  visaExpiryDate,
  setVisaExpiryDate,
  email,
  setEmail,
  nationality,
  setNationality,
  bloodGroup,
  setBloodGroup,
  emergencyContactName,
  setEmergencyContactName,
  emergencyContactRelation,
  setEmergencyContactRelation,
  passportNumber,
  setPassportNumber,
  employmentVisa,
  setEmploymentVisa,
}) {
  const [officialfullPhoneNumber, setOfficialFullPhoneNumber] = useState('');
  const [personalfullPhoneNumber, setPersonalFullPhoneNumber] = useState('');
  const [emergencyfullPhoneNumber, setEmergencyFullPhoneNumber] = useState('');

  useEffect(() => {
    setOfficialFullPhoneNumber(officialCountryCode + officialPhoneNo);
    setPersonalFullPhoneNumber(personalCountryCode + personalPhoneNo);
    setEmergencyFullPhoneNumber(emergencyCountryCode + emergencyPhoneNumber);
  }, [
    officialPhoneNo,
    officialCountryCode,
    personalCountryCode,
    personalPhoneNo,
    emergencyPhoneNumber,
    emergencyCountryCode,
  ]);

  const inputLabelStyle = { fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' };
  const filter = createFilterOptions();

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    switch (name) {
      case 'email':
        setEmail(value);
        break;
      case 'nationality':
        setNationality(value);
        break;
      case 'bloodGroup':
        setBloodGroup(value);
        break;
      case 'emergencyContactName':
        setEmergencyContactName(value);
        break;
      case 'emergencyContactRelation':
        setEmergencyContactRelation(value);
        break;
      case 'passportNumber':
        setPassportNumber(value);
        break;
      case 'employmentVisa':
        setEmploymentVisa(value);
        break;
      default:
        break;
    }
  };

  const handleDobChange = (date) => {
    const formattedDate = date ? dayjs(date).format('YYYY-MM-DD') : '';
    setDob(formattedDate);
  };

  const handleVisaExpiryChange = (date) => {
    const formattedDate = date ? dayjs(date).format('YYYY-MM-DD') : '';
    setVisaExpiryDate(formattedDate);
  };

  const handleSelectChange = (id, val) => {
    if (id === 'gender') {
      setGender({ label: val, value: val });
    } else if (id === 'maritalStatus') {
      setMaritalStatus({ label: val, value: val });
    }
  };

  const handlePhoneChange = (value, countryData, id) => {
    let dialCode;
    let numberWithoutCode;
    switch (id) {
      case 'officialPhoneInput':
        setOfficialFullPhoneNumber(value);
        dialCode = countryData?.dialCode;
        numberWithoutCode = value?.slice(dialCode?.length);
        setOfficialCountryCode(dialCode);
        setOfficialPhoneNo(numberWithoutCode);

        break;
      case 'personalPhoneInput':
        setPersonalFullPhoneNumber(value);
        dialCode = countryData?.dialCode;
        numberWithoutCode = value?.slice(dialCode?.length);
        setPersonalCountryCode(dialCode);
        setPersonalPhoneNo(numberWithoutCode);

        break;
      case 'emergencyPhoneInput':
        setEmergencyFullPhoneNumber(value);
        dialCode = countryData?.dialCode;
        numberWithoutCode = value?.slice(dialCode?.length);
        setEmergencyCountryCode(dialCode);
        setEmergencyPhoneNumber(numberWithoutCode);

        break;
      default:
        break;
    }
  };

  const personalInfo = [
    {
      id: 'dob',
      label: 'Date of Birth',
      onChange: handleDobChange,
      value: dob ? dayjs(dob) : null,
      type: 'datePicker',
    },
    {
      id: 'gender',
      label: 'Gender',
      onChange: (e, value) => handleSelectChange('gender', value ? value?.value : ''),
      value: gender,
      type: 'select',
      options: [
        { value: 'Male', label: 'Male' },
        { value: 'Female', label: 'Female' },
      ],
    },
    {
      id: 'officialPhoneInput',
      label: 'Official Phone Number',
      value: officialfullPhoneNumber,
      type: 'officialPhoneInput',
    },
    {
      id: 'personalPhoneInput',
      label: 'Personal Phone Number',
      value: personalfullPhoneNumber,
      type: 'personalPhoneInput',
    },
    {
      id: 'email',
      label: 'Email',
      onChange: handleInputChange,
      value: email,
      type: 'input',
    },
    {
      id: 'nationality',
      label: 'Nationality',
      onChange: handleInputChange,
      value: nationality,
      type: 'input',
    },
    {
      id: 'bloodGroup',
      label: 'Blood Group',
      onChange: handleInputChange,
      value: bloodGroup,
      type: 'input',
    },
    {
      id: 'emergencyPhoneInput',
      label: 'Emergency Phone Number',
      value: emergencyfullPhoneNumber,
      type: 'emergencyPhoneInput',
    },
    {
      id: 'emergencyContactName',
      label: 'Emergency Contact Name',
      onChange: handleInputChange,
      value: emergencyContactName,
      type: 'input',
    },
    {
      id: 'emergencyContactRelation',
      label: 'Emergency Contact Relation',
      onChange: handleInputChange,
      value: emergencyContactRelation,
      type: 'input',
    },
    {
      id: 'maritalStatus',
      label: 'Marital Status',
      onChange: (e, value) => handleSelectChange('maritalStatus', value ? value.value : ''),
      value: maritalStatus,
      type: 'select',
      options: [
        { value: 'Single', label: 'Single' },
        { value: 'Married', label: 'Married' },
      ],
    },
    {
      id: 'passportNumber',
      label: 'Passport Number',
      onChange: handleInputChange,
      value: passportNumber,
      type: 'input',
    },
    {
      id: 'employmentVisa',
      label: 'Employment Visa',
      onChange: handleInputChange,
      value: employmentVisa,
      type: 'input',
    },
    {
      id: 'visaExpiry',
      label: 'Visa Expiry',
      onChange: handleVisaExpiryChange,
      value: visaExpiryDate ? dayjs(visaExpiryDate) : null,
      type: 'datePicker',
    },
  ];

  return (
    <Card sx={{ padding: '15px', overflow: 'visible' }}>
      <SoftBox sx={{ flexGrow: 1, marginLeft: '20px' }}>
        <InputLabel style={{ fontWeight: 'bold' }}>Personal Details</InputLabel>

        <Grid mt={1} container spacing={2}>
          {personalInfo?.map((field, index) => (
            <Grid item xs={12} md={12} lg={12} key={index}>
              <SoftBox>
                <InputLabel sx={inputLabelStyle} required={field?.id == 'email' ? true : false}>
                  {field?.label}
                </InputLabel>
                {field.type == 'input' && (
                  <SoftInput
                    onChange={field?.onChange}
                    className="select-box-category"
                    size="small"
                    value={field?.value || ''}
                    name={field?.id}
                  />
                )}
                {field?.type == 'officialPhoneInput' && (
                  <PhoneInput
                    className="react-custom-phone-input"
                    country={'in'}
                    value={officialfullPhoneNumber || ''}
                    onChange={(value, countryCode) => handlePhoneChange(value, countryCode, field.id)}
                  />
                )}
                {field?.type == 'personalPhoneInput' && (
                  <PhoneInput
                    className="react-custom-phone-input"
                    country={'in'}
                    value={personalfullPhoneNumber || ''}
                    onChange={(value, countryCode) => handlePhoneChange(value, countryCode, field.id)}
                  />
                )}
                {field?.type == 'emergencyPhoneInput' && (
                  <PhoneInput
                    className="react-custom-phone-input"
                    country={'in'}
                    value={emergencyfullPhoneNumber || ''}
                    onChange={(value, countryCode) => handlePhoneChange(value, countryCode, field.id)}
                  />
                )}
                {field?.type == 'datePicker' && (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      format="YYYY/MM/DD"
                      className="custom-date-picker-md"
                      value={field?.value ? dayjs(field?.value) : null}
                      onChange={field?.onChange}
                    />
                  </LocalizationProvider>
                )}

                {field?.type == 'select' && (
                  <Autocomplete
                    options={field?.options}
                    placeholder="Select"
                    value={field?.value}
                    getOptionLabel={(option) => option?.label || ''}
                    renderInput={(params) => (
                      <TextField {...params} placeholder="Select" variant="outlined" fullWidth />
                    )}
                    onChange={field.onChange}
                    isOptionEqualToValue={(option, value) => option?.value === value?.value}
                    filterOptions={(options, params) => {
                      const filtered = filter(options, params);
                      const { inputValue } = params;
                      if (inputValue === '') {
                        return options;
                      }

                      return filtered;
                    }}
                  />
                )}
              </SoftBox>
            </Grid>
          ))}
        </Grid>
      </SoftBox>
    </Card>
  );
}

export default PersonalDetails;
