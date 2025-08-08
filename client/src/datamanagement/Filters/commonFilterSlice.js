import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  searchValue: '',
  filters: null,
  filterStateData: null,
  page: 0,
  pageTitle:''
};

const stockCountSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setSearchValueFilter: (state, action) => {
      state.searchValue = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
    setFilterStateData: (state, action) => {
      state.filterStateData = action.payload;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setPageTitle: (state, action) => {
      state.pageTitle = action.payload;
    },
    resetCommonReduxState: (state) => {
      state.searchValue = '';
      state.filters = null;
      state.filterStateData = null;
      state.page = 0;
      state.pageTitle = '';
    }
  },
});

export const { setSearchValueFilter, setFilters, setFilterStateData, setPage, setPageTitle, resetCommonReduxState } =
  stockCountSlice.actions;

export const getSearchValue = (state) => state.filter.searchValue;
export const getFilters = (state) => state.filter.filters;
export const getFiltersStateData = (state) => state.filter.filterStateData;
export const getPage = (state) => state.filter.page;
export const getPageTitle = (state) => state.filter.pageTitle;

export default stockCountSlice.reducer;
