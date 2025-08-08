import { Box, TextField, Typography, List, ListItem, ListItemText, InputAdornment, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search'; // Importing Search Icon
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../examples/Navbars/DashboardNavbar';
import { useEffect, useState } from 'react';
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react';
import './market.css'; // Importing the CSS file
import SoftButton from '../../../components/SoftButton';
import { Grid } from '../product/all-products/components/add-product/components/ProductImage/Grid';
import SoftInput from '../../../components/SoftInput';
import { addDeliveryAddress, updateDeliveryAddress } from '../../../config/Services';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../../hooks/SnackbarProvider';

const TextFieldComponent = ({ placeholder, value, onChange, readOnly, label }) => (
  <SoftInput
    variant="outlined"
    className="search-custom-bar"
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    InputProps={{ readOnly }}
    label={label} // Conditionally make read-only
  />
);

const DeliveryAddress = (props) => {
  const [position, setPosition] = useState({ lat: 20.5937, lng: 78.9629 }); //default lat long for India
  const [addressDetails, setAddressDetails] = useState({
    name: '',
    mobile: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
  });
  const [searchAddress, setSearchAddress] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const showSnackbar = useSnackbar();
  const navigate = useNavigate();
  const locId = localStorage.getItem('locId');
  const user_details = localStorage.getItem('user_details');
  const uidx = JSON.parse(user_details).uidx;
  const location = useLocation();
  const address = location.state?.address;

  const isEditPresent = location.pathname.includes('/edit');

  useEffect(() => {
    let isMounted = true; // Track if the component is mounted

    const fetchCurrentLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            if (isMounted) {
              // Only update state if still mounted
              setPosition({ lat: latitude, lng: longitude });
              fetchAddressFromLatLng(latitude, longitude);
            }
          },
          () => {
            console.error('Geolocation permission denied');
          },
        );
      } else {
        console.error('Geolocation not supported by this browser.');
      }
    };

    if (!address) {
      fetchCurrentLocation();
    }

    return () => {
      isMounted = false; // Cleanup function to set isMounted to false
    };
  }, []);

  const fetchAddressFromLatLng = (lat, lng) => {
    const geocoder = new props.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const place = results[0];
        setAddressDetails((prevState) => ({
          id: prevState?.id,
          name: prevState?.name,
          mobile: prevState?.mobile,
          address1: place?.formatted_address,
          address2: '',
          city: place?.address_components?.find((component) => component?.types?.includes('locality'))?.long_name || '',
          state:
            place?.address_components?.find((component) => component?.types?.includes('administrative_area_level_1'))
              ?.long_name || '',
          postalCode:
            place?.address_components?.find((component) => component?.types?.includes('postal_code'))?.long_name || '',
          country:
            place?.address_components?.find((component) => component?.types?.includes('country'))?.long_name || '',
        }));
      }
    });
  };

  const handleMapDrag = (mapProps, map) => {
    const center = map.getCenter();
    const lat = center.lat();
    const lng = center.lng();
    setPosition({ lat, lng });
    fetchAddressFromLatLng(lat, lng);
  };

  const handleMarkerDragEnd = (coord) => {
    const { latLng } = coord;
    const lat = latLng.lat();
    const lng = latLng.lng();
    setPosition({ lat, lng });
    fetchAddressFromLatLng(lat, lng);
  };

  const handleSearchInput = (event) => {
    const value = event.target.value;
    setSearchAddress(value);

    if (!value) {
      setSuggestions([]);
      return;
    }

    const autocompleteService = new window.google.maps.places.AutocompleteService();
    autocompleteService.getPlacePredictions({ input: value }, (predictions, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
        setSuggestions(predictions);
      } else {
        setSuggestions([]);
      }
    });
  };

  const handleSuggestionClick = (suggestion) => {
    const placeService = new window.google.maps.places.PlacesService(document.createElement('div'));
    placeService.getDetails({ placeId: suggestion.place_id }, (place, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        const location = place.geometry.location;
        const lat = location.lat();
        const lng = location.lng();
        setPosition({ lat, lng });
        fetchAddressFromLatLng(lat, lng);
        setSearchAddress(place.formatted_address);
        setSuggestions([]);
      }
    });
  };

  const validatePayload = (payload) => {
    for (const [key, value] of Object.entries(payload)) {
      if (key === 'addressLine1' || key === 'addressLine2') {
        continue;
      }
      if (value === undefined || value === null || value === '') {
        showSnackbar(`Field "${key}" cannot be empty.`, 'error');
        return false;
      }
    }
    return true;
  };

  const handleSave = () => {
    const payload = {
      entityId: locId,
      entityType: 'BRANCH',
      addressLine1: addressDetails?.address1,
      addressLine2: addressDetails?.address2,
      country: addressDetails?.country,
      state: addressDetails?.state,
      city: addressDetails?.city,
      pincode: addressDetails?.postalCode,
      defaultShipping: true,
      defaultBilling: true,
      defaultAddress: true,
      createdBy: uidx,
      name: addressDetails?.name,
      mobileNumber: addressDetails?.mobile,
      latitude: position?.lat,
      longitude: position?.lng,
    };
    if (!validatePayload(payload)) {
      return;
    }

    addDeliveryAddress(payload)
      .then(() => {
        showSnackbar('Address successfully added', 'success');
        navigate('/market-place/products');
      })
      .catch((err) => {
        showSnackbar(err.message || err.response.data.message, 'error');
      });
  };

  const handleUpdate = () => {
    const payload = {
      entityId: locId,
      entityType: 'BRANCH',
      addressId: addressDetails?.id,
      addressLine1: addressDetails?.address1,
      addressLine2: addressDetails?.address2,
      country: addressDetails?.country,
      state: addressDetails?.state,
      city: addressDetails?.city,
      pincode: addressDetails?.postalCode,
      defaultShipping: true,
      defaultBilling: true,
      defaultAddress: true,
      updatedBy: uidx,
      name: addressDetails?.name,
      mobileNumber: addressDetails?.mobile,
      latitude: position?.lat,
      longitude: position?.lng,
    };
    if (!validatePayload(payload)) {
      return;
    }
    updateDeliveryAddress(payload)
      .then(() => {
        showSnackbar('Address successfully updated', 'success');
        navigate('/market-place/products');
      })
      .catch((err) => {
        showSnackbar(err?.message || err?.response?.data?.message, 'error');
      });
  };

  const handleCancel = () => {
    setAddressDetails({
      name: '',
      mobile: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      country: '',
      postalCode: '',
    });
    setPosition({ lat: 20.5937, lng: 78.9629 }); //setting the map to default position India
  };

  const addressFields = [
    {
      label: 'Name',
      value: addressDetails?.name,
      onChange: (e) => setAddressDetails({ ...addressDetails, name: e.target.value }),
      readOnly: false,
    },
    {
      label: 'Mobile Number',
      value: addressDetails?.mobile,
      onChange: (e) => setAddressDetails({ ...addressDetails, mobile: e.target.value }),
      readOnly: false,
    },
    {
      label: 'Address Line 1',
      value: addressDetails?.address1,
      onChange: (e) => setAddressDetails({ ...addressDetails, address1: e.target.value }),
      readOnly: false,
    },
    {
      label: 'Address Line 2',
      value: addressDetails?.address2,
      onChange: (e) => setAddressDetails({ ...addressDetails, address2: e.target.value }),
      readOnly: false,
    },
    { label: 'City', value: addressDetails?.city, readOnly: true },
    { label: 'State', value: addressDetails?.state, readOnly: true },
    { label: 'Postal Code', value: addressDetails?.postalCode, readOnly: true },
    { label: 'Latitude', value: position?.lat, readOnly: true },
    { label: 'Longitude', value: position?.lng, readOnly: true },
  ];

  useEffect(() => {
    if (!address) return;
    setPosition({ lat: address?.latitude, lng: address?.longitude });
    setAddressDetails({
      id: address?.id,
      name: address?.name,
      mobile: address?.mobileNumber,
      address1: address?.addressLine1,
      address2: address?.addressLine2,
      city: address?.city,
      state: address?.state,
      country: address?.country,
      postalCode: address?.pincode,
    });
  }, [address]);
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Typography variant="h3">Add your address here...</Typography>
      <Box className="delivery-address-container">
        <TextField
          variant="outlined"
          fullWidth
          value={searchAddress}
          onChange={handleSearchInput}
          className="search-bar"
          placeholder="Search for location"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <List className="suggestions-list">
          {suggestions.map((suggestion) => (
            <ListItem button key={suggestion?.place_id} onClick={() => handleSuggestionClick(suggestion)}>
              <ListItemText className="list-item-text" primary={suggestion?.description} />
            </ListItem>
          ))}
        </List>
      </Box>
      <Box className="map-container">
        <Map
          className="address-map-cont"
          google={props.google}
          zoom={10}
          initialCenter={position}
          center={position}
          onDragend={handleMapDrag}
        >
          <Marker position={position} draggable onDragend={(t, map, coord) => handleMarkerDragEnd(coord)} />
        </Map>
      </Box>
      <div className="address-details-form">
        <Typography variant="h6">Address Details</Typography>
        {addressFields.map((field, index) => (
          <TextFieldComponent
            key={index}
            placeholder={field.label}
            value={field.value}
            onChange={field.onChange}
            readOnly={field.readOnly}
          />
        ))}
      </div>
      <div className="map-address-button">
        <SoftButton variant="outlined" color="error" onClick={handleCancel}>
          Cancel
        </SoftButton>
        <SoftButton variant="gradient" color="info" onClick={isEditPresent ? handleUpdate : handleSave}>
          Save
        </SoftButton>
      </div>
    </DashboardLayout>
  );
};

export const WrappedDeliveryAddress = GoogleApiWrapper({
  apiKey: 'AIzaSyCXOTKejeUZ-bBgOaoGuhUIGqIRjTRc6Qo',
  libraries: ['places'], // Load Places library for Autocomplete
})(DeliveryAddress);
