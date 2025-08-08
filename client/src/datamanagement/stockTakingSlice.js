import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cycleModal: false,
  showBatchContents: false,
  reportItem: {},
  selectedBatch: {},
};

const stockTakingSlice = createSlice({
  name: 'stockTaking',
  initialState,
  reducers: {
    setCycleModal: (state, action) => {
      state.cycleModal = action.payload;
    },
    setBatchContents: (state, action) => {
      state.showBatchContents = action.payload;
    },
    setReportItem: (state, action) => {
      state.reportItem = action.payload;
    },
    setSelectedBatch: (state, action) => {
      state.selectedBatch = action.payload;
    },
    resetBatchState: (state) => {
      state.reportItem = initialState.reportItem;
      state.selectedBatch = initialState.selectedBatch;
    },
  },
});

export const { setCycleModal, setBatchContents, setReportItem, setSelectedBatch, resetBatchState } =
  stockTakingSlice.actions;
export const getCycleModal = (state) => state.stockTaking.cycleModal;
export const getBatchContents = (state) => state.stockTaking.showBatchContents;
export const getReportItem = (state) => state.stockTaking.reportItem;
export const getSelectedBatch = (state) => state.stockTaking.selectedBatch;

export default stockTakingSlice.reducer;
