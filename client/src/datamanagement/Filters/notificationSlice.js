import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  unReadNotification: 0,
  unReadNotificationsList: [], 
  lastFetched: null, 
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setUnReadNotification: (state, action) => {
      state.unReadNotification = action.payload;
    },
    setUnReadNotificationsList: (state, action) => {
      state.unReadNotificationsList = action.payload;
    },
    setLastFetched: (state, action) => {
      state.lastFetched = action.payload;
    },
  },
});

export const { setUnReadNotification, setUnReadNotificationsList, setLastFetched } = notificationSlice.actions;

export const getAllUnreadNotification = (state) => state.notification.unReadNotification;
export const getUnreadNotificationsList = (state) => state.notification.unReadNotificationsList;
export const getLastFetched = (state) => state.notification.lastFetched;

export default notificationSlice.reducer;
