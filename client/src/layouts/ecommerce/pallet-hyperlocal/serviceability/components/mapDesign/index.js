import './index.css';
import { Circle, GoogleApiWrapper, InfoWindow, Map, Marker } from 'google-maps-react';
import {
  getLocationArrayByRadius,
  getPlaceName,
  getRegionId,
  setAddLocationByRadius,
  setGooglePlaceName,
} from '../../../../../../datamanagement/serviceSlice';
import { getServiceDataListDetails } from '../../../../../../config/Services';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import { useSnackbar } from '../../../../../../hooks/SnackbarProvider';
import SoftInput from '../../../../../../components/SoftInput';

const MapContainerLocation = (props) => {
  const [placeName, setPlaceName] = useState('');
  const [radiusKm, setRadiusKm] = useState(locationArrayDataRadius?.radius);
  const locationArrayDataRadius = useSelector(getLocationArrayByRadius);
  const [center, setCenter] = useState({ lat: 0, lng: 0 });
  const [showInfoWindow, setShowInfoWindow] = useState(false);
  const [autocompleteService, setAutocompleteService] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const suggestionListRef = useRef(null);
  const mapRef = useRef(null);
  const showSnackbar = useSnackbar();
  const dispatch = useDispatch();

  const googlePlaceName = useSelector(getPlaceName);
  const id = useSelector(getRegionId);

  useEffect(() => {
    const mapContainer = document.querySelector('.map-inner-container');
    mapContainer.classList.add('hide-pegman');
    const autoCompleteService = new props.google.maps.places.AutocompleteService();
    setAutocompleteService(autoCompleteService);
    document.addEventListener('click', closeSuggestions);
    return () => {
      document.removeEventListener('click', closeSuggestions);
    };
  }, [props.google.maps.places.AutocompleteService]);

  const creatSlots = () => {
    getServiceDataListDetails(id).then((res) => {
      dispatch(setAddLocationByRadius(res?.data?.data));
      setRadiusKm(res?.data?.data?.radius);
      setCenter({ lat: res?.data?.data?.latitude, lng: res?.data?.data?.longitude });
    });
  };

  useEffect(() => {
    creatSlots();
  }, []);

  const handlePlaceNameChange = (event) => {
    const inputText = event.target.value;
    setPlaceName(inputText);

    dispatch(setGooglePlaceName(inputText));

    // Fetch autocomplete suggestions based on user input for places names
    if (autocompleteService) {
      autocompleteService.getPlacePredictions({ input: inputText }, (results, status) => {
        if (status === 'OK') {
          setSuggestions(results);
        } else {
          setSuggestions([]);
        }
      });
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const { google } = props;
    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ placeId: suggestion.place_id }, (results, status) => {
      if (status === 'OK' && results.length > 0) {
        const location = results[0].geometry.location;
        setPlaceName(suggestion.description);
        dispatch(setGooglePlaceName(suggestion.description));
        setCenter({ lat: location.lat(), lng: location.lng() });
        const map = mapRef.current;
        if (map) {
          map.panTo({ lat: location.lat(), lng: location.lng() });
          map.setZoom(12); // Adjust the zoom level as needed
        }
      } else {
        showSnackbar('Place not found.');
      }
    });

    setSuggestions([]);
  };

  const closeSuggestions = (event) => {
    // Close the suggestion list when clicking outside of it
    if (suggestionListRef.current && !suggestionListRef.current.contains(event.target)) {
      setSuggestions([]);
    }
  };

  // Function to update the location in the parent
  const updateParentLocationArray = () => {
    const newLocation = {
      areaName: placeName,
      latitude: center.lat,
      longitude: center.lng,
      radius: radiusKm,
    };
    dispatch(setAddLocationByRadius(newLocation));
    props.updateLocationArrayByRadius(newLocation);
  };

  const handleRadiusChange = (event) => {
    const newRadius = parseFloat(event.target.value);
    setRadiusKm(newRadius);
  };

  useEffect(() => {
    updateParentLocationArray();
  }, [radiusKm,center]);

  return (
    <div className="map-container">
      <div className="address-container-boxI">
        <h4 className="address-txt">Address</h4>
        <SoftInput
          type="text"
          placeholder="Enter Place Name"
          value={googlePlaceName ? googlePlaceName : null}
          onChange={handlePlaceNameChange}
          className="SoftInput"
        />
        <ul className="suggestion-list" ref={suggestionListRef}>
          {suggestions.map((suggestion) => (
            <li key={suggestion.id} onClick={() => handleSuggestionClick(suggestion)}>
              {suggestion.description}
            </li>
          ))}
        </ul>
        <h4 className="address-txt">Radius</h4>
        <div className="input-radius-wrapper">
          <input
            type="number"
            value={radiusKm}
            onChange={handleRadiusChange}
            className="map-input-wrapper-radius"
          />
          <h5 className="symbol-txt">km</h5>
        </div>
      </div>
      <div className="map-outer-container">
        <div className="map-inner-container" ref={mapRef}>
          <Map
            google={props.google}
            initialCenter={center}
            center={center} // Add this line to specify the center prop
            zoom={12} // Adjust the zoom level as needed
            options={{
              minZoom: 1,
              maxZoom: 18,
            }}
          >
            <Circle center={center} radius={radiusKm * 1000} />
            <Marker position={center} onClick={() => setShowInfoWindow(true)} />
            <InfoWindow
              visible={showInfoWindow}
              position={center}
              onClose={() => setShowInfoWindow(false)}
            ></InfoWindow>
          </Map>
        </div>
      </div>
    </div>
  );
};

export default GoogleApiWrapper({
  apiKey: 'AIzaSyCXOTKejeUZ-bBgOaoGuhUIGqIRjTRc6Qo',
})(MapContainerLocation);
