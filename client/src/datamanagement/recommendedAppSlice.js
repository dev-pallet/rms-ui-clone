import { createSlice } from '@reduxjs/toolkit';
const initialState = {
  appsList: [],
  installedApps: [],
  combinedNames: [],
};
const recommendedSlice = createSlice({
  name: 'recommendedApps',
  initialState,
  reducers: {
    setRecommendedApps: (state, action) => {
      state.appsList = action.payload;
    },
    setInstalledApps: (state, action) => {
      state.installedApps = action.payload;
    },
    setCombinedName: (state, action) => {
      state.combinedNames = [...state?.combinedNames,...action.payload];
    },
  },
});
export const { setRecommendedApps, setInstalledApps, setCombinedName } = recommendedSlice.actions;
export const getRecommendedApps = (state) => state.recommendedApps.appsList;
export const getInstalledApps = (state) => state.recommendedApps.installedApps;
export const getCombinedName = (state) => state.recommendedApps.combinedNames;
export default recommendedSlice.reducer;
