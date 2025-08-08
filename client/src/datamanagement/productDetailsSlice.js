import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  productDetails: {},
  clearedDetails: {},
};

const productDetailsData = createSlice({
  name: 'productDetails',
  initialState,
  reducers: {
    setProductDetails: (state, action) => {
      state.productDetails = action.payload;
    },
    clearProductDetails: (state) => {
      state.productDetails = {}; 
    },
  },
});

export const { setProductDetails, clearProductDetails } = productDetailsData.actions;
export const getProductDetails = (state) => state.productDetails.productDetails;
export const getClearedDetails = (state) => state.productDetails.clearedDetails;

export default productDetailsData.reducer;
