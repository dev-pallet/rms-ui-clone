import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  title: {
    header: localStorage.getItem('orgName') + ' Loyalty',
    subheader: localStorage.getItem('locName'),
  },
  points: {
    pointsGiven: '1',
    amountSpend: '100',
    pointsBrand: 'Points',
    pointsValue: '',
    validity: '',
    date: '',
  },
  reward: {
    minReqPoints: '100',
    generalAmountSpend: {
      rewardType: '',
      freeItem: 'nil',
      percentageDis: '',
      maxAmountPercent: '',
    },
    brandBased: {},
    catgories_sku: {},
    customer_type: '',
  },
  terms: {
    num_trans_per_day: '',
    minPurchaseReq: '',
    max_reward_per_transaction: '',
    clubbed: false,
    otp_validation: false,
    blacklistEnabled: false,
    blackListingOrderThresholdPerDay: '',
    blackListingOrderThresholdPerMonth: '',
    blackListingOrderValueThresholdPerDay: '',
    blackListingOrderValueThresholdPerMonth: '',
  },
  bonusPoints: '',
  loyaltyComunication: {},
  multipleOrderAlerts: {},
};

const loyaltySlice = createSlice({
  name: 'loyaltyProgram',
  initialState,
  reducers: {
    setTitle: (state, action) => {
      state.title = { ...state.title, ...action.payload };
    },
    setPoints: (state, action) => {
      state.points = { ...state.points, ...action.payload };
    },
    setRewards: (state, action) => {
      state.reward = { ...state?.reward, ...action.payload };
    },
    setTerms: (state, action) => {
      state.terms = { ...state?.terms, ...action.payload };
    },
    setBonusPoints: (state, action) => {
      state.bonusPoints = [...state?.bonusPoints, ...action.payload];
    },
    setLoyaltyCommunication: (state, action) => {
      state.loyaltyComunication = [...state?.loyaltyComunication, ...action.payload];
    },
    setMultipleOrderAlert: (state, action) => {
      state.multipleOrderAlerts = [...state?.multipleOrderAlerts, ...action.payload];
    },
  },
});

export const {
  setTitle,
  setPoints,
  setRewards,
  setTerms,
  setBonusPoints,
  setLoyaltyCommunication,
  setMultipleOrderAlert,
} = loyaltySlice.actions;
export const getLoyaltyTitle = (state) => state.loyaltyProgram.title;
export const getLoyaltyPoints = (state) => state.loyaltyProgram.points;
export const getLoyaltyReward = (state) => state.loyaltyProgram.reward;
export const getLoyaltyTerms = (state) => state.loyaltyProgram.terms;
export const getLoyaltyBonusPoints = (state) => state.loyaltyProgram.bonusPoints;
export const getLoyaltyComunication = (state) => state.loyaltyProgram.loyaltyComunication;
export const getMultipleOrderAlerts = (state) => state.loyaltyProgram.multipleOrderAlerts;

export default loyaltySlice.reducer;
