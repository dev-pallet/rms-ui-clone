import { configureStore } from '@reduxjs/toolkit';
import customerdataReducer from './customerdataSlice';
import recommendedAppSlice from './recommendedAppSlice';
import serviceSlice from './serviceSlice';
import loyaltySlice from './loyaltyProgramSlice';
import stockTakingSlice from './stockTakingSlice';
import allOrdersSlice from './Filters/allOrdersSlice';
import allProductsSlice from './Filters/allProductsSlice';
import vendorPayloadSlice from './vendorPayloadSlice';
import stockCountSlice from './Filters/stockCountSlice';
import productDetailsSlice from './productDetailsSlice';
import commonFilterSlice from './Filters/commonFilterSlice';
import notificationSlice from './Filters/notificationSlice';
import voiceRecordSlice from './Filters/voiceRecordSlice';

export default configureStore({
  reducer: {
    customerlist: customerdataReducer,
    allCustomers: customerdataReducer,
    customerBaseDetails: customerdataReducer,
    vendorBaseDetails: customerdataReducer,
    recommendedApps: recommendedAppSlice,
    service: serviceSlice,
    loyaltyProgram: loyaltySlice,
    stockTaking: stockTakingSlice,
    allOrders: allOrdersSlice,
    allProducts: allProductsSlice,
    vendorPayload: vendorPayloadSlice,
    stockCount: stockCountSlice,
    productDetails: productDetailsSlice,
    filter: commonFilterSlice,
    notification: notificationSlice,
    voiceRecord: voiceRecordSlice,
  },
});
