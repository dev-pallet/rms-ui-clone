import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  audioDetails: [],
};

const audioRecorderData = createSlice({
  name: 'voiceRecord',
  initialState,
  reducers: {
    addAudioURL: (state, action) => {
      state.audioDetails.push(action.payload);
    },

    setAudioURL: (state, action) => {
      state.audioDetails = action.payload;
    },

    removeAudioUrl: (state, action) => {
      state.audioDetails.splice(action.payload, 1);
    },

    clearAllUrls: (state) => {
      state.audioDetails = [];
    },

    resetAudioState: () => initialState,
  },
});

export const { addAudioURL, setAudioURL, removeAudioUrl, clearAllUrls, resetAudioState } = audioRecorderData.actions;
export const getAudioURL = (state) => state.voiceRecord.audioDetails || [];
export default audioRecorderData.reducer;
