import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  stockCountSearchValue: '',
  stockCountFilters: null,
  filtersAppliedCount: null,
  filterStateData: null,
  page: 0,
  usersList: [],
  usersUidxList: []
};

const stockCountSlice = createSlice({
  name: 'stockCount',
  initialState,
  reducers: {
    setStockCountSearchValue: (state, action) => {
      state.stockCountSearchValue = action.payload;
    },
    setStockCountFilters: (state, action) => {
      state.stockCountFilters = action.payload;
    },
    setStockCountFiltersAppliedCount: (state, action) => {
      state.filtersAppliedCount = action.payload;
    },
    setStockCountFilterStateData: (state, action) => {
      state.filterStateData = action.payload;
    },
    setStockCountPage: (state, action) => {
      state.page = action.payload;
    },
    setStockCountUsersList: (state, action) => {
        state.usersList = action.payload
    },
    setStockCountUsersUidxList: (state, action) =>{
        state.usersUidxList = action.payload;
    }
  },
});

export const {
  setStockCountSearchValue,
  setStockCountFilters, 
  setStockCountFiltersAppliedCount,
  setStockCountFilterStateData, 
  setStockCountPage,
  setStockCountUsersList,
  setStockCountUsersUidxList
} = stockCountSlice.actions;

export const getStockCountSearchValue = (state) => state.stockCount.stockCountSearchValue;
export const getStockCountFilters = (state) => state.stockCount.stockCountFilters;
export const getStockCountFiltersCount = (state) => state.stockCount.filtersAppliedCount;
export const getStockCountFiltersStateData = (state) => state.stockCount.filterStateData;
export const getStockCountPage = (state) => state.stockCount.page;
export const getStockCountUsersList = (state) => state.stockCount.usersList;
export const getStockCountUsersUidxList = (state) => state.stockCount.usersUidxList;

export default stockCountSlice.reducer;
