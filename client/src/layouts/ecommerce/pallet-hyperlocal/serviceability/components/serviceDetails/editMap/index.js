import { Circle, GoogleApiWrapper, InfoWindow, Map, Marker } from 'google-maps-react';
import { getLocationArrayByRadius, getPlaceName, setGooglePlaceName } from '../../../../../../../datamanagement/serviceSlice';
import { useDispatch } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useSnackbar } from '../../../../../../../hooks/SnackbarProvider';

const GoogleMaps = (props) => {
  const [placeName, setPlaceName] = useState('');
  const [radiusKm, setRadiusKm] = useState(1);
  const [center, setCenter] = useState({ lat: 0, lng: 0 });
  const [showInfoWindow, setShowInfoWindow] = useState(false);
  const [autocompleteService, setAutocompleteService] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const suggestionListRef = useRef(null);
  const showSnackbar = useSnackbar();
  const dispatch = useDispatch();

  const googlePlaceName = useSelector(getPlaceName);
  const locationRadius = useSelector(getLocationArrayByRadius);


  

  useEffect(() => {
    const mapContainer = document.querySelector('.map-inner-container');
    mapContainer.classList.add('hide-pegman');
    const autoCompleteService = new props.google.maps.places.AutocompleteService();
    setAutocompleteService(autoCompleteService);
    document.addEventListener('click', closeSuggestions);
    // Set initial values based on props.serviceListDetailsData
    const lat = Number(props?.locationArrayByRadius?.latitude);
    const lng = Number(props?.locationArrayByRadius?.longitude);
    const radius = props?.locationArrayByRadius?.radius;
    setCenter({ lat, lng });
    setRadiusKm(radius);
    // Fetch address based on lat, lng
    const geocoder = new props.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK' && results.length > 0) {
        setPlaceName(results[0].formatted_address);
        dispatch(setGooglePlaceName(results[0].formatted_address));
      } else {
        showSnackbar('Error fetching address.');
      }
    });

    return () => {
      document.removeEventListener('click', closeSuggestions);
    };
  }, [props.google.maps.places.AutocompleteService, props.locationArrayByRadius]);

  const handleSuggestionClick = (suggestion) => {
    // Update the input field and map marker based on the selected suggestion
    setPlaceName(suggestion.description);
    const { google } = props;
    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ placeId: suggestion.place_id }, (results, status) => {
      if (status === 'OK' && results.length > 0) {
        const location = results[0].geometry.location;
        setCenter({ lat: location.lat(), lng: location.lng() });
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

  return (
    <div className="map-container">
      <div className="address-container-box">
        <h4 className="service_label_text_edit">Address :</h4>
        <h6 className='area_text_details_service'>{googlePlaceName}</h6>
        <ul className="suggestion-list" ref={suggestionListRef}>
          {suggestions.map((suggestion) => (
            <li key={suggestion.id} onClick={() => handleSuggestionClick(suggestion)}>
              {suggestion.description}
            </li>
          ))}
        </ul>
        <h4 className="service_label_text_editI">Radius :</h4>
        <div className="input-radius-wrapper-edit">
          <h6 className='radius_txt'>{locationRadius?.radius || 1}</h6>
          <h6 className="symbol-txt">km</h6>
        </div>
      </div>
      <div className="map-outer-container">
        <div className="map-inner-container">
          <Map
            google={props.google}
            initialCenter={center}
            zoom={2}
            options={{
              minZoom: 1,
              maxZoom: 5,
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
})(GoogleMaps);
