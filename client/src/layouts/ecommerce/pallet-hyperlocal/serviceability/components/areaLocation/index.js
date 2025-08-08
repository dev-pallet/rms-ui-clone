import './index.css';
import { Box, FormControlLabel, Grid, InputLabel, Radio, RadioGroup, Tooltip } from '@mui/material';
import { GoogleApiWrapper } from 'google-maps-react';
import {
  getAreaName,
  getLocationArray,
  getLocationArrayByRadius,
  getRegionId,
  setAddLocationByRadius,
  setAreaName,
  setLocationSuggestions,
  setSelectedOptionRegion,
} from '../../../../../../datamanagement/serviceSlice';
import { setAddLocation } from '../../../../../../datamanagement/serviceSlice';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import CancelIcon from '@mui/icons-material/Cancel';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import MapContainerLocation from '../mapDesign/index';
import React, { useEffect, useRef, useState } from 'react';
import SoftBox from '../../../../../../components/SoftBox';
import SoftInput from '../../../../../../components/SoftInput';
import SoftTypography from '../../../../../../components/SoftTypography';

const AreaLocation = () => {
  const [selectedOption, setSelectedOption] = useState('byPincode');
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const areaName = useSelector(getAreaName);
  const locationArrayData = useSelector(getLocationArray);
  const locationArrayDataRadius = useSelector(getLocationArrayByRadius);
  const suggestionListRefs = useRef([]);
  const autoCompleteService = useRef(new google.maps.places.AutocompleteService());
  const dispatch = useDispatch();
  const [locationArrayByRadius, setLocationArrayByRadius] = useState([{ areaName: '', center: '', radius: '' }]);
  const regionId = useSelector(getRegionId);

  const updateLocationArrayByRadius = (newLocation) => {
    setLocationArrayByRadius([newLocation]);
  };

  // to toggle between the radio button
  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
    dispatch(setSelectedOptionRegion(event.target.value));
  };

  useEffect(() => {
    suggestionListRefs.current = Array(locationArrayData.length)
      .fill(0)
      .map(() => React.createRef());
  }, [locationArrayData.length]);

  // to handle google api by pincode
  const handlePincodeChange = async (event, index) => {
    const { value } = event.target;
    const results = await new Promise((resolve) => {
      autoCompleteService.current.getPlacePredictions({ input: value }, (results, status) => {
        resolve(status === 'OK' ? results : []);
      });
    });

    const updatedLocationArray = locationArrayData.map((location, i) =>
      i === index
        ? {
          ...location,
          pinCode: value,
          suggestions: results,
        }
        : location,
    );

    dispatch(setLocationSuggestions(results));
    dispatch(setAddLocation(updatedLocationArray));
  };

  // to get the suggestion list for entered pincode
  const handleSuggestionClick = (suggestion, index) => {
    const updatedLocationArray = [...locationArrayData];
    updatedLocationArray[index] = {
      ...updatedLocationArray[index],
      pinCode: suggestion.structured_formatting.main_text,
      areaName: suggestion.description,
      suggestions: [],
    };
    dispatch(setAddLocation(updatedLocationArray));
  };

  // to delete the column of option by pincode
  const handleDelete = (index) => {
    const updatedLocationArray = [...locationArrayData];
    updatedLocationArray.splice(index, 1);
    dispatch(setAddLocation(updatedLocationArray));
  };

  const handleAreaNameChange = (e) => {
    const name = e.target.value;
    dispatch(setAreaName(name));
  };

  const handleAddMore = () => {
    dispatch(
      setAddLocation([
        ...locationArrayData,
        {
          pinCode: '',
          areaName: '',
          sourceId: orgId,
          sourceLocationId: locId,
          standardHours: '0',
          orgId: orgId,
          sourceType: 'RETAIL',
          tatId: null,
          regionId: regionId,
        },
      ]),
    );
  };


  useEffect(() => {
    if (selectedOption === 'byPincode') {
      dispatch(setAddLocationByRadius([]));
    } else if (selectedOption === 'byRadiusInKMS') {
      dispatch(setAddLocation([{ pinCode: '', areaName: '' }]));
    }
  }, [selectedOption]);

  return (
    <Box>
      <SoftBox className="vendors-filter-div">
        <Grid container p={2}>
          <Grid item md={11.7} sm={5} xs={12} ml={-0.5}>
            <InputLabel
              sx={{
                fontWeight: 'bold',
                fontSize: '14px',
                color: '#344767',
                marginBottom: '2rem',
              }}
            >
              Add a single destination to manage this region's shipping, delivery, and pickup options
            </InputLabel>
            <SoftBox mb={1} display="flex" gap={1}>
              <InputLabel
                required
                sx={{
                  fontWeight: 'bold',
                  fontSize: '12px',
                  color: '#344767',
                }}
              >
                Area Name
              </InputLabel>
              <Tooltip
                placement="bottom-end"
                title="Customers will see this area name under ‘delivery options’ in the cart and at checkout."
              >
                <InfoOutlinedIcon fontSize="small" color={'info'} />
              </Tooltip>
            </SoftBox>
            <SoftBox display="flex" alignItems="center" gap="10px">
              <SoftInput type="text" onChange={handleAreaNameChange} value={areaName} />
            </SoftBox>
          </Grid>
          <Grid item md={12} sm={12} xs={12} mt={2} ml={-0.5}>
            <InputLabel required sx={{ fontWeight: 'bold', fontSize: '14px', color: '#344767' }}>
              Add delivery range
            </InputLabel>
          </Grid>
          <Grid item md={12} sm={12} xs={12} mt={2} ml={0.5}>
            <RadioGroup
              row
              aria-labelledby="demo-radio-buttons-group-label"
              name="range"
              value={selectedOption}
              onChange={handleOptionChange}
            >
              <FormControlLabel
                value="byPincode"
                control={<Radio size="small" />}
                label={<span style={{ fontSize: '0.75rem' }}>By Pincode</span>}
              />
              <span style={{ marginRight: '20px' }}></span>
              <FormControlLabel
                value="byRadiusInKMS"
                control={<Radio size="small" />}
                label={<span style={{ fontSize: '0.75rem' }}>By radius in Kms</span>}
              />
            </RadioGroup>
          </Grid>
          <Grid item md={12} sm={12} xs={12} mt={3}>
            {selectedOption === 'byPincode' ? (
              <>
                <SoftBox
                  style={{
                    overflowY: locationArrayData.length > 3 ? 'scroll' : 'visible',
                    overflowX: 'scroll',
                  }}
                >
                  {locationArrayData?.map((location, index) => (
                    <div key={index} className="pincode-suggestion-wrapper">
                      <div className="pincode-suggestion-input">
                        <InputLabel className="input-label-text">Pincode</InputLabel>
                        <SoftInput
                          value={location.pinCode}
                          type="number"
                          onChange={(event) => handlePincodeChange(event, index)}
                        />
                      </div>
                      <div className="pincode-suggestion-input">
                        <InputLabel className="input-label-text">Area Name</InputLabel>
                        <SoftInput
                          value={location.areaName}
                          type="text"
                          onChange={(event) => handleAreaNameChange(event, index)}
                        />
                      </div>
                      <CancelIcon className="cancel-cursor" onClick={() => handleDelete(index)} />
                      <ul className="suggestion-list-area-pincode-wrapper" ref={suggestionListRefs.current[index]}>
                        {location?.suggestions?.map((suggestion) => (
                          <li key={suggestion?.id} onClick={() => handleSuggestionClick(suggestion, index)}>
                            {suggestion?.description}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </SoftBox>
                <Box className="service-add-more-btn-wrapper">
                  <SoftTypography onClick={handleAddMore} className="add-more-text" component="label" variant="caption" fontWeight="bold">+ Add More</SoftTypography>
                </Box>
              </>
            ) : selectedOption === 'byRadiusInKMS' ? (
              <Grid item xs={12} md={12} xl={12}>
                <SoftBox className="radius-map">
                  <MapContainerLocation
                    updateLocationArrayByRadius={updateLocationArrayByRadius}
                    locationArrayDataRadius={locationArrayDataRadius}
                  />
                </SoftBox>
              </Grid>
            ) : null}
          </Grid>
        </Grid>
      </SoftBox>
    </Box>
  );
};

export default GoogleApiWrapper({
  apiKey: 'AIzaSyCXOTKejeUZ-bBgOaoGuhUIGqIRjTRc6Qo',
})(AreaLocation);
