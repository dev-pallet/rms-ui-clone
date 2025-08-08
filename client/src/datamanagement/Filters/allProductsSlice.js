import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  allProductsSearchValue: '',
  allProductsFilters: null,
  filtersAppliedCount: null,
  filterStateData: null,
  page: 1,
};

const allProductsSlice = createSlice({
  name: 'allProducts',
  initialState,
  reducers: {
    setAllProductsSearchValue: (state, action) => {
      state.allProductsSearchValue = action.payload;
    },
    setAllProductsFilters: (state, action) => {
      state.allProductsFilters = action.payload;
    },
    setAllProductsFiltersAppliedCount: (state, action) => {
      state.filtersAppliedCount = action.payload;
    },
    setAllProductsFilterStateData: (state, action) => {
      state.filterStateData = action.payload;
    },
    setAllProductsPage: (state, action) => {
      state.page = action.payload;
    },
  },
});

export const {
  setAllProductsSearchValue,
  setAllProductsFilters,
  setAllProductsFiltersAppliedCount,
  setAllProductsFilterStateData,
  setAllProductsPage,
} = allProductsSlice.actions;

export const getAllProductsSearchValue = (state) => state.allProducts.allProductsSearchValue;
export const getAllProductsFilters = (state) => state.allProducts.allProductsFilters;
export const getAllProductsFiltersCount = (state) => state.allProducts.filtersAppliedCount;
export const getAllProductsFilterStateData = (state) => state.allProducts.filterStateData;
export const getAllProductsPage = (state) => state.allProducts.page;

export default allProductsSlice.reducer;
