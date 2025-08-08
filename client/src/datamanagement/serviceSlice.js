import { createSlice } from '@reduxjs/toolkit';
const initialState = {
  areaName: '',
  locationArray: [{ pinCode: '', areaName: '' }],
  locationArrayByRadius: [],
  instantDeliverySlots: [
    { instantDeliveryStartTime: '', instantDeliveryEndTime: '', instantDeliveryOrderCapacity: '', packingTime: '' , surgeFee:'', platformFee:'', convenienceFee:''},
  ],
  deliverySlots: [],
  pickupName: '',
  pickupAddress: '',
  pickupInstructions: '',
  selectOption: { value: 'FREE_SHIPPING', label: 'Free Shipping' },
  rateArray: [{ min: 0, max: 0, rate: 0 }],
  weightArray: [{ min: 0, max: 0, rate: 0 }],
  distanceArray: [{ min: 0, max: 0, rate: 0 }],
  priceArray: [{ min: 0, max: 0, rate: 0 }],
  checkbox: false,
  deliveryCost: '',
  cutoffTime: '',
  sameDeliveryYear: false,
  pickUpCheckBox: false,
  locationSuggestions: [],
  googlePlaceName: '',
  regionId: '',
  shippingId: '',
  instantDeliveryId: '',
  selectedOptionRegion: 'byPincode',
  deliveryCheckbox: false,
  transformedData: [],
};

const serviceReducer = createSlice({
  name: 'service',
  initialState,
  reducers: {
    setAreaName: (state, action) => {
      state.areaName = action.payload;
    },
    setAddLocation: (state, action) => {
      state.locationArray = action.payload;
    },
    setLocationSuggestions: (state, action) => {
      state.locationSuggestions = action.payload;
    },
    setAddLocationByRadius: (state, action) => {
      state.locationArrayByRadius = { ...action.payload };
    },
    setInstantDelivery: (state, action) => {
      state.instantDeliverySlots = action.payload;
    },
    setDeliverySlots: (state, action) => {
      state.deliverySlots = action.payload;
    },
    setPickupName: (state, action) => {
      state.pickupName = action.payload;
    },
    setPickupAddress: (state, action) => {
      state.pickupAddress = action.payload;
    },
    setpickupInstruction: (state, action) => {
      state.pickupInstructions = action.payload;
    },
    setSelectOption: (state, action) => {
      state.selectOption = action.payload;
    },
    setRateByWeight: (state, action) => {
      state.weightArray = action.payload;
    },
    setRateByDistance: (state, action) => {
      state.distanceArray = action.payload;
    },
    setRateByPrice: (state, action) => {
      state.priceArray = action.payload;
    },
    setRateArray: (state, action) => {
      state.rateArray = action.payload;
    },
    addRateArray: (state, action) => {
      state.rateArray.push(action.payload);
    },
    deleteWeightArray: (state, action) => {
      state.weightArray.splice(action.payload, 1);
    },

    deleteDistanceArray: (state, action) => {
      state.distanceArray.splice(action.payload, 1);
    },

    deletePriceArray: (state, action) => {
      state.priceArray.splice(action.payload, 1);
    },
    addWeightArray: (state, action) => {
      state.weightArray.push(action.payload);
    },
    addDistanceArray: (state, action) => {
      state.distanceArray.push(action.payload);
    },
    addPriceArray: (state, action) => {
      state.priceArray.push(action.payload);
    },
    setCheckboxState: (state, action) => {
      state.checkbox = action.payload;
    },
    setDeliveryCost: (state, action) => {
      state.deliveryCost = action.payload;
    },
    setcutOffTime: (state, action) => {
      state.cutoffTime = action.payload;
    },
    setSameDeliveryYear: (state, action) => {
      state.sameDeliveryYear = action.payload;
    },
    setpickUpCheckBox: (state, action) => {
      state.pickUpCheckBox = action.payload;
    },
    setGooglePlaceName: (state, action) => {
      state.googlePlaceName = action.payload;
    },
    setRegionId: (state, action) => {
      state.regionId = action.payload;
    },
    setShippingId: (state, action) => {
      state.shippingId = action.payload;
    },
    setInstantDeliveryId: (state, action) => {
      state.instantDeliveryId = action.payload;
    },
    setSelectedOptionRegion: (state, action) => {
      state.selectedOptionRegion = action.payload;
    },
    setDeliveryCheckbox: (state, action) => {
      state.deliveryCheckbox = action.payload;
    },
    setTransformedData: (state, action) => {
      state.transformedData = action.payload;
    },
  },
});
export const {
  setAreaName,
  setAddLocation,
  setAddLocationByRadius,
  setInstantDelivery,
  setDeliverySlots,
  setPickupName,
  setPickupAddress,
  setpickupInstruction,
  setShippingCharges,
  setSelectOption,
  setRateByWeight,
  setRateByDistance,
  setRateByPrice,
  deleteWeightArray,
  deleteDistanceArray,
  deletePriceArray,
  addWeightArray,
  addDistanceArray,
  addPriceArray,
  setCheckboxState,
  setDeliveryCost,
  setRateArray,
  addRateArray,
  setcutOffTime,
  setSameDeliveryYear,
  setpickUpCheckBox,
  setLocationSuggestions,
  setGooglePlaceName,
  setRegionId,
  setShippingId,
  setInstantDeliveryId,
  setSelectedOptionRegion,
  setDeliveryCheckbox,
  setTransformedData,
} = serviceReducer.actions;

export const getAreaName = (state) => state.service.areaName;
export const getLocationArray = (state) => state.service.locationArray;
export const getLocationArrayByRadius = (state) => state.service.locationArrayByRadius;
export const getInstantDelivery = (state) => state.service.instantDeliverySlots;
export const getDeliverySlots = (state) => state.service.deliverySlots;
export const getPickupName = (state) => state.service.pickupName;
export const getPickupAddress = (state) => state.service.pickupAddress;
export const getPickupInstruction = (state) => state.service.pickupInstructions;
export const getSelectOption = (state) => state.service.selectOption;
export const getWeightArray = (state) => state.service.weightArray;
export const getDistanceArray = (state) => state.service.distanceArray;
export const getPriceArray = (state) => state.service.priceArray;
export const getCheckboxState = (state) => state.service.checkbox;
export const getDeliveryCost = (state) => state.service.deliveryCost;
export const getRateArray = (state) => state.service.rateArray;
export const getCutoffTime = (state) => state.service.cutoffTime;
export const getSameDeliveryYear = (state) => state.service.sameDeliveryYear;
export const getPickUpCheckBox = (state) => state.service.pickUpCheckBox;
export const getLocationSuggestions = (state) => state.service.locationSuggestions;
export const getPlaceName = (state) => state.service.googlePlaceName;
export const getRegionId = (state) => state.service.regionId;
export const getShippingId = (state) => state.service.shippingId;
export const getInstantDeliveryId = (state) => state.service.instantDeliveryId;
export const getSelectedOptionRegion = (state) => state.service.selectedOptionRegion;
export const getDeliveryCheckbox = (state) => state.service.deliveryCheckbox;
export const getTransformedData = (state) => state.service.transformedData;

export default serviceReducer.reducer;
