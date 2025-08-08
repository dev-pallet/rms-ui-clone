import { Card, Checkbox, Grid, InputLabel, FormControlLabel } from '@mui/material';
import React, { useEffect, useState } from 'react';
import SoftBox from '../../../../../../components/SoftBox';
import SoftSelect from '../../../../../../components/SoftSelect';
import SoftInput from '../../../../../../components/SoftInput';
import { state } from '../../../../softselect-Data/state';
import { city } from '../../../../softselect-Data/city';

function IncorporatedAddress({
  presentAddressLineOne,
  setPresentAddressLineOne,
  presentAddressLineTwo,
  setPresentAddressLineTwo,
  presentSelectedState,
  setPresentSelectedState,
  presentSelectedCity,
  setPresentSelectedCity,
  presentPinCode,
  setPresentPinCode,
  permanentAddressLineOne,
  setPermanentAddressLineOne,
  permanentAddressLineTwo,
  setPermanentAddressLineTwo,
  permanentSelectedState,
  setPermanentSelectedState,
  permanentSelectedCity,
  setPermanentSelectedCity,
  permanentPinCode,
  setPermanentPinCode,
}) {
  const inputLabelStyle = { fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' };

  const [countryOptions, setCountryOptions] = useState([{ label: 'India', value: 'India' }]);
  const [presentStateOptions, setPresentStateOptions] = useState(() =>
    state?.map((el) => ({ label: el?.label, value: el?.value })),
  );
  const [permanentStateOptions, setPermanentStateOptions] = useState(() =>
    state?.map((el) => ({ label: el?.label, value: el?.value })),
  );
  const [persentCityOptions, setPresentCityOptions] = useState([]);
  const [permanenCityOptions, setPermanentCityOptions] = useState([]);

  const [sameAsAbove, setSameAsAbove] = useState(false);

  const handlePresentStateChange = (selectedOption) => {
    setPresentSelectedState({
      value: selectedOption?.value,
      label: selectedOption?.label,
    });
    setPresentSelectedCity([]);
    const allCities = city?.filter((el) => {
      return el?.value == selectedOption?.value;
    });

    setPresentCityOptions(() =>
      allCities?.map((el) => {
        return { label: el?.label, value: el?.label };
      }),
    );
  };

  const handlePresentCityChange = (selectedOption) => {
    setPresentSelectedCity({
      value: selectedOption?.value,
      label: selectedOption?.label,
    });
  };

  const handlePermanentStateChange = (selectedOption) => {
    setPermanentSelectedState({
      value: selectedOption?.value,
      label: selectedOption?.label,
    });
    setPermanentSelectedCity([]);
    const allCities = city?.filter((el) => {
      return el?.value == selectedOption?.value;
    });

    setPermanentCityOptions(() =>
      allCities?.map((el) => {
        return { label: el?.label, value: el?.label };
      }),
    );
  };

  const handlePermanentCityChange = (selectedOption) => {
    setPermanentSelectedCity({
      value: selectedOption?.value,
      label: selectedOption?.label,
    });
  };

  const handlePresentAddressDetails = (e) => {
    const { value, name } = e.target;
    switch (name) {
      case 'presentLine1':
        setPresentAddressLineOne(value);
        break;
      case 'presentLine2':
        setPresentAddressLineTwo(value);
        break;
      case 'presentPinCode':
        setPresentPinCode(value);
        break;
      default:
        break;
    }
  };

  const handlePermanentAddressChange = (e) => {
    const { value, name } = e.target;
    switch (name) {
      case 'permanentLine1':
        setPermanentAddressLineOne(value);
        break;
      case 'permanentLine2':
        setPermanentAddressLineTwo(value);
        break;
      case 'permanentPinCode':
        setPermanentPinCode(value);
        break;
      default:
        break;
    }
  };

  const handleCheckboxChange = (event) => {
    const isChecked = event.target.checked;
    setSameAsAbove(isChecked);

    if (isChecked) {
      setPermanentAddressLineOne(presentAddressLineOne);
      setPermanentAddressLineTwo(presentAddressLineTwo);
      setPermanentSelectedState(presentSelectedState);
      setPermanentSelectedCity(presentSelectedCity);
      setPermanentPinCode(presentPinCode);
    } else {
      setPermanentAddressLineOne(permanentAddressLineOne);
      setPermanentAddressLineTwo(permanentAddressLineTwo);
      setPermanentSelectedState(permanentSelectedState);
      setPermanentSelectedCity(permanentSelectedCity);
      setPermanentPinCode(permanentPinCode);
    }
  };

  const presentAddress = [
    {
      id: 'presentLine1',
      label: 'Line 1',
      type: 'input',
      onChange: handlePresentAddressDetails,
      value: presentAddressLineOne,
    },
    {
      id: 'presentLine2',
      label: 'Line 2',
      type: 'input',
      onChange: handlePresentAddressDetails,
      value: presentAddressLineTwo,
    },
    {
      label: 'Country',
      type: 'select',
      options: countryOptions,
      value: { label: 'India', value: 'India' },
      onChange: '',
    },
    {
      id: 'presentPinCode',
      label: 'Pincode',
      type: 'input',
      value: presentPinCode,

      onChange: handlePresentAddressDetails,
    },
    {
      label: 'State',
      type: 'select',
      options: presentStateOptions,
      value: presentSelectedState,
      onChange: handlePresentStateChange,
    },
    {
      label: 'City',
      type: 'select',
      options: persentCityOptions,
      value: presentSelectedCity,
      onChange: handlePresentCityChange,
    },
  ];

  const permanentAddress = [
    {
      id: 'permanentLine1',
      label: 'Line 1',
      type: 'input',
      onChange: handlePermanentAddressChange,
      value: permanentAddressLineOne,
    },
    {
      id: 'permanentLine2',
      label: 'Line 2',
      type: 'input',
      onChange: handlePermanentAddressChange,
      value: permanentAddressLineTwo,
    },
    {
      label: 'Country',
      type: 'select',
      options: countryOptions,
      value: { label: 'India', value: 'India' },
      onChange: '',
    },
    {
      id: 'permanentPinCode',
      label: 'Pincode',
      type: 'input',
      value: permanentPinCode,
      onChange: handlePermanentAddressChange,
    },
    {
      label: 'State',
      type: 'select',
      options: permanentStateOptions,
      value: permanentSelectedState,
      onChange: handlePermanentStateChange,
    },
    {
      label: 'City',
      type: 'select',
      options: permanenCityOptions,
      value: permanentSelectedCity,
      onChange: handlePermanentCityChange,
    },
  ];

  return (
    <Card sx={{ padding: '15px', overflow: 'visible' }}>
      <SoftBox sx={{ flexGrow: 1, marginLeft: '20px' }}>
        <InputLabel style={{ fontWeight: 'bold' }}>Present Address</InputLabel>
        <Grid container mt={1} spacing={2} direction="row" justifyContent="space-between" alignItems="center">
          {presentAddress?.map((field, index) => (
            <Grid item xs={12} md={12} lg={12} key={index}>
              <SoftBox>
                <InputLabel sx={inputLabelStyle}>{field?.label}</InputLabel>
                {field?.type === 'input' ? (
                  <SoftBox>
                    <SoftInput
                      name={field?.id}
                      onChange={field?.onChange}
                      value={field?.value}
                      className="select-box-category"
                      size="small"
                    />
                  </SoftBox>
                ) : (
                  <SoftSelect
                    placeholder="Select"
                    size="small"
                    options={field?.options}
                    value={field?.value}
                    onChange={field?.onChange}
                  />
                )}
              </SoftBox>
            </Grid>
          ))}
        </Grid>

        <SoftBox sx={{ display: 'flex', gap: '50px', marginTop: '25px', alignItems: 'center' }}>
          <InputLabel style={{ fontWeight: 'bold' }}>Permanent Address</InputLabel>
          <FormControlLabel control={<Checkbox onChange={handleCheckboxChange} />} label="Same As Above" />
        </SoftBox>

        <Grid container mt={1} spacing={2} direction="row" justifyContent="space-between" alignItems="center">
          {permanentAddress?.map((field, index) => (
            <Grid item xs={12} md={12} lg={12} key={index}>
              <SoftBox>
                <InputLabel sx={inputLabelStyle}>{field?.label}</InputLabel>

                {field?.type === 'input' ? (
                  <SoftBox sx={{ position: 'relative' }}>
                    <SoftInput
                      disabled={sameAsAbove}
                      name={field?.id}
                      onChange={field?.onChange}
                      value={field?.value}
                      className="select-box-category"
                      size="small"
                    />
                  </SoftBox>
                ) : (
                  <SoftSelect
                    placeholder="Select"
                    size="small"
                    options={field?.options}
                    value={field?.value}
                    onChange={field?.onChange}
                    isDisabled={sameAsAbove}
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

export default IncorporatedAddress;
