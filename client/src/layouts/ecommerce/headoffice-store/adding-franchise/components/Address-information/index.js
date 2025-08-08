import { city } from '../../../../softselect-Data/city';
import { country } from '../../../../softselect-Data/country';
import { state } from '../../../../softselect-Data/state';
import React, { memo, useEffect, useState } from 'react';
import SoftBox from '../../../../../../components/SoftBox';
import SoftInput from '../../../../../../components/SoftInput';
import SoftSelect from '../../../../../../components/SoftSelect';
import SoftTypography from '../../../../../../components/SoftTypography';

const FranchiseAddressInformation = memo(({addressInformation, setAddressInformation}) => {
  const [countryValue, setCountryValue] = useState({ label: 'India', value: 'India' });
  const [addressOne, setAddressOne] = useState('');
  const [addressTwo, setAddressTwo] = useState('');
  const [pincode, setPincode] = useState('');
  const [stateValue, setStateValue] = useState();
  const [cityValue, setCityValue] = useState();
  const [cities, setCities] = useState([]);

  const handleCities = (option) => {
    setCityValue({
      label: option.label,
      value: option.label,
    });
  };
  const handleStates = (option) => {
    const filteredCities = city.filter((city) => city.value === option.value);
    setCities(filteredCities);
    setStateValue({
      label: option.label,
      value: option.label,
    });
  };

  const handleCountry = (option) => {
    setCountryValue({
      label: option.label,
      value: option.label,
    });
  };

  useEffect(() => {
    setAddressInformation({
      addressOne: addressOne,
      addressTwo: addressTwo,
      city: cityValue?.label,
      state: stateValue?.label,
      country: countryValue.label,
      pincode: pincode,
    });
  }, [addressOne, addressTwo, cityValue?.label, stateValue?.label, countryValue.label, pincode]);

  return (
    <SoftBox className="details-item-wrrapper">
      <SoftTypography className="information-heading-ho">Address Information</SoftTypography>
      <SoftTypography className="soft-input-heading-ho">Address 1</SoftTypography>
      <SoftInput placeholder="Type Here..." onChange={(e) => setAddressOne(e.target.value)} />
      <SoftTypography className="soft-input-heading-ho">Address 2</SoftTypography>
      <SoftInput placeholder="Type Here..." onChange={(e) => setAddressTwo(e.target.value)} />
      <SoftTypography className="soft-input-heading-ho">Country</SoftTypography>
      <SoftSelect
        value={countryValue}
        options={country}
        placeholder="Select Country..."
        onChange={(option) => handleCountry(option)}
      />
      <SoftTypography className="soft-input-heading-ho">State</SoftTypography>
      <SoftSelect
        {...(stateValue && {
          label: stateValue,
          value: stateValue,
        })}
        // value={stateValue}
        options={state}
        placeholder="Select State..."
        onChange={(option) => handleStates(option)}
      />
      <SoftTypography className="soft-input-heading-ho">City</SoftTypography>
      <SoftSelect
        {...(cityValue && {
          label: cityValue,
          value: cityValue,
        })}
        // value={cityValue}
        options={cities}
        onChange={(option) => handleCities(option)}
        placeholder="Select City..."
      />
      <SoftTypography className="soft-input-heading-ho">Pin Code</SoftTypography>
      <SoftInput placeholder="Type Here..." onChange={(e) => setPincode(e.target.value)} />
    </SoftBox>
  );
});

export default FranchiseAddressInformation;
