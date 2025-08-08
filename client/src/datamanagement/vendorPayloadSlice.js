import { createSlice } from '@reduxjs/toolkit';
const initialState = {
  isDraft: false,
  isBrandDraft: false,
  isTermsDraft: false,
  vendorDraftCode: '',
  vendorAutoSaveTime: '',
  vendorOverviewPayload: {},
  vendorBrandPayload: [],
  vendorTermsPayload: {},
  vendorDeliveryPayload: {},
  vendorReturnsPayload: {},
  vendorLegalPayload: {},
};
const vendorPayload = createSlice({
  name: 'vendorPayloads',
  initialState,
  reducers: {
    setVendorOverviewPayload: (state, action) => {
      state.vendorOverviewPayload = action.payload;
    },
    setVendorBrandPayload: (state, action) => {
      state.vendorBrandPayload = action.payload;
    },
    setVendorTermsPayload: (state, action) => {
      state.vendorTermsPayload = action.payload;
    },
    setVendorDeliveryPayload: (state, action) => {
      state.vendorDeliveryPayload = action.payload;
    },
    setVendorReturnsPayload: (state, action) => {
      state.vendorReturnsPayload = action.payload;
    },
    setVendorLegalPayload: (state, action) => {
      state.vendorLegalPayload = action.payload;
    },
    setVendorDraftCode: (state, action) => {
      state.vendorDraftCode = action.payload;
    },
    setVendorAutoSaveTime: (state, action) => {
      state.vendorAutoSaveTime = action.payload || '';
    },
    setIsDraft: (state, action) => {
      state.isDraft = action.payload || '';
    },
    setIsBrandsDraft: (state, action) => {
      state.isBrandDraft = action.payload || '';
    },
    setIsTermsDraft: (state, action) => {
      state.isTermsDraft = action.payload || '';
    },
    resetVendorPayload: (state) => {
      return initialState;
    },
  },
});
export const {
  setVendorOverviewPayload,
  setVendorBrandPayload,
  setVendorTermsPayload,
  setVendorLegalPayload,
  setVendorDraftCode,
  setVendorDeliveryPayload,
  setVendorReturnsPayload,
  setVendorAutoSaveTime,
  setIsDraft,
  setIsBrandsDraft,
  setIsTermsDraft,
  resetVendorPayload,
} = vendorPayload.actions;
export const getVendorOverviewPayload = (state) => state.vendorPayload.vendorOverviewPayload;
export const getVendorBrandPayload = (state) => state.vendorPayload.vendorBrandPayload;
export const getVendorTermsPayload = (state) => state.vendorPayload.vendorTermsPayload;
export const getVendorDeliveryPayload = (state) => state.vendorPayload.vendorDeliveryPayload;
export const getVendorReturnsPayload = (state) => state.vendorPayload.vendorReturnsPayload;
export const getVendorLegalPayload = (state) => state.vendorPayload.vendorLegalPayload;
export const getVendorDraftCode = (state) => state.vendorPayload.vendorDraftCode;
export const getVendorAutoSaveTme = (state) => state.vendorPayload.vendorAutoSaveTime;
export const getVendorIsDraft = (state) => state.vendorPayload.isDraft;
export const getVendorIsBrandDraft = (state) => state.vendorPayload.isBrandDraft; 
export const getVendorIsTermsDraft = (state) => state.vendorPayload.isTermsDraft;
export default vendorPayload.reducer;
