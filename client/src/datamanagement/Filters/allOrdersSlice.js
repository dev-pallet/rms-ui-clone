import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  allOrdersSearchValue: '',
  allOrdersFilters: null,
  filtersAppliedCount: null,
  filterStateData: null,
  page: 0,
};

const allOrdersSlice = createSlice({
  name: 'allOrders',
  initialState,
  reducers: {
    setAllOrdersSearchValue: (state, action) => {
      state.allOrdersSearchValue = action.payload;
    },
    setAllOrdersFilters: (state, action) => {
      state.allOrdersFilters = action.payload;
    },
    setAllOrdersFiltersAppliedCount: (state, action) => {
      state.filtersAppliedCount = action.payload;
    },
    setAllOrdersFilterStateData: (state, action) => {
      state.filterStateData = action.payload;
    },
    setAllOrdersPage: (state, action) => {
      state.page = action.payload;
    },
  },
});

export const {
  setAllOrdersSearchValue,
  setAllOrdersFilters,
  setAllOrdersFiltersAppliedCount,
  setAllOrdersFilterStateData,
  setAllOrdersPage,
} = allOrdersSlice.actions;

export const getAllOrdersSearchValue = (state) => state.allOrders.allOrdersSearchValue;
export const getallOrdersFilters = (state) =>
  state.allOrders.allOrdersFilters;
export const getAllOrdersFiltersCount = (state) => state.allOrders.filtersAppliedCount;
export const getAllOrdersFilterStateData = (state) => state.allOrders.filterStateData;
export const getAllOrdersPage = (state) => state.allOrders.page;

export default allOrdersSlice.reducer;