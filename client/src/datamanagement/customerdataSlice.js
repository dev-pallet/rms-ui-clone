import { createSlice } from '@reduxjs/toolkit'

export const customerdataSlice = createSlice({
  name: 'customerlist',
  initialState: {
    customerData: [],
    allCustomers: [],
    customerBaseDetails: [],
    vendorBaseDetails: [], 
    customerAcces:false,

    
  },
  reducers: {
    customerListData: (state, action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
          state.customerData.push({ ...action.payload});
    },
    allCustomersData: (state, action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
          state.allCustomers.push({ ...action.payload});
    },
    customerBaseData:  (state, action) => {
      // state.customerBaseDetails.push({ ...action.payload});
      state.customerBaseDetails = [{...action.payload}]
        // state.customerBaseDetails = action.payload
    },
    vendorBaseData: (state, action) => {
     state.vendorBaseDetails = [{ ...action.payload}];
        // state.vendorBaseDetails = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { customerListData, allCustomersData, customerBaseData, vendorBaseData } = customerdataSlice.actions
export default customerdataSlice.reducer