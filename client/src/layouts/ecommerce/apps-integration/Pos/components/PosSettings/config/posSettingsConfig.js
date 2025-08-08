export const initialFormState = {
  storeConfigId: '',
  idleTimeout: false,
  idleTimeoutValue: '',
  offlinePos: false,
  offlinePosLicenses: [],
  maxOfflineTime: '',
  dayClose: false,
  autoDayStart: false,
  reprintReceipt: false,
  reprintReceiptAuth: 'DISABLED',
  cartDeletion: false,
  cartDeletionAuth: 'DISABLED',
  salesReturns: false,
  salesReturnsAuth: 'DISABLED',
  loyalty: true,
  loyaltyOtp: 'ENABLED',
  loyaltyAuth: 'DISABLED',
  delivery: false,
  deliveryLicenses: [],
  secondaryScreen: false,
  secondaryScreenLicenses: [],
  offlinePayments: false,
  offlinePaymentsLicenses: [],
  roundOff: false,
  fifoGeneral: false,
  fifoWeighing: false,
  syncHoldOrders: false,
  cashPayment: false,
  sellPriceEdit: false,
  mrpEdit: false,
  batchEdit: false,
  stockEdit: false,
  negativeInventory: true,
  negativeInventoryAuth: 'DISABLED',
  negativeInventoryConsume: 'DISABLED',
  negativeInventoryStockCount: 'DISABLED',
  holdCartRules: false,
  dayEndStockEntries: false,
  multipleBatchExpiry: false,
  expiredItemIndicator: false,
  splitPayments: true,
  sodexo: false,
  sodexoLicenses: [],
  dualDisplay: false,
  dualDisplayLicenses: [],
  sellBelowPurchasePrice: false,
  orgLogo: false,
  showFssai: true,
  cartSequence: false,
  showGst: true,
  totalSavings: true,
  footerText: false,
  handheldPrinters: false,
  handheldPrintersLicenses: [],
  maxHoldCart: false,
  holdCartVisibility:false,
  roundOffCeilValue:0.49,
  roundOffFloorValue:0.50,
  creditPayment:false
};

export const authOptions = [
  { value: 'ENABLED', label: 'With manager authentication' },
  { value: 'DISABLED', label: 'Without manager authentication' },
];

export const otpOptions = [
  { value: 'ENABLED', label: 'With OTP validation' },
  { value: 'DISABLED', label: 'Without OTP validation' },
];

export const negativeInventoryOptions = [
  { value: 'ENABLED', label: 'Consume in future inward' },
  { value: 'DISABLED', label: 'Do not consume in future inward' },
];

export const configMap = {
  IDLE_TIMEOUT: {
    formKey: 'idleTimeout',
    settings: {
      idleTimeOut: {
        formKey: 'idleTimeoutValue',
        transform: (value) => value / (60 * 1000),
        reverse: (value) => value * 60 * 1000,
      },
    },
  },
  OFFLINE_POS: {
    formKey: 'offlinePos',
    licenses: 'offlinePosLicenses',
    settings: {
      maxOfflineTime: {
        formKey: 'maxOfflineTime',
        transform: (value) => value / (60 * 1000),
        reverse: (value) => value * 60 * 1000,
      },
    },
  },
  REPRINT_RECEIPT: {
    formKey: 'reprintReceipt',
    settings: {
      managerAuth: 'reprintReceiptAuth',
    },
  },
  CART_DELETION: {
    formKey: 'cartDeletion',
    settings: {
      managerAuth: 'cartDeletionAuth',
    },
  },
  SALES_RETURNS: {
    formKey: 'salesReturns',
    settings: {
      managerAuth: 'salesReturnsAuth',
    },
  },
  LOYALTY: {
    formKey: 'loyalty',
    settings: {
      otpEnabled: 'loyaltyOtp',
      managerAuth: 'loyaltyAuth',
    },
  },
  DELIVERY: {
    formKey: 'delivery',
    licenses: 'deliveryLicenses',
  },
  SECONDARY_SCREEN: {
    formKey: 'secondaryScreen',
    licenses: 'secondaryScreenLicenses',
  },
  OFFLINE_PAYMENTS: {
    formKey: 'offlinePayments',
    licenses: 'offlinePaymentsLicenses',
  },
  NEGATIVE_INVENTORY: {
    formKey: 'negativeInventory',
    settings: {
      managerAuth: 'negativeInventoryAuth',
      futureInward: 'negativeInventoryConsume',
      stockCountJob: 'negativeInventoryStockCount',
    },
  },
  SODEXO: {
    formKey: 'sodexo',
    licenses: 'sodexoLicenses',
  },
  DUAL_DISPLAY: {
    formKey: 'dualDisplay',
    licenses: 'dualDisplayLicenses',
  },
  HANDHELD_PRINTERS: {
    formKey: 'handheldPrinters',
    licenses: 'handheldPrintersLicenses',
  },
  // Simple toggles without additional settings
  DAY_CLOSE: {
    formKey: 'dayClose',
  },
  AUTO_DAY_START: {
    formKey: 'autoDayStart',
  },
  ROUND_OFF: {
    formKey: 'roundOff',
    settings: {
      roundOffCeil: 'roundOffCeilValue',
      roundOffFloor: 'roundOffFloorValue'
    }
  },
  FIFO_GENERAL: {
    formKey: 'fifoGeneral',
  },
  FIFO_WEIGHING: {
    formKey: 'fifoWeighing',
  },
  SYNC_HOLD_ORDERS: {
    formKey: 'syncHoldOrders',
  },
  CASH_PAYMENT: {
    formKey: 'cashPayment',
  },
  SELL_PRICE_EDIT: {
    formKey: 'sellPriceEdit',
  },
  MRP_EDIT: {
    formKey: 'mrpEdit',
  },
  BATCH_EDIT: {
    formKey: 'batchEdit',
  },
  STOCK_EDIT: {
    formKey: 'stockEdit',
  },
  HOLD_CART_RULES: {
    formKey: 'holdCartRules',
  },
  DAY_END_STOCK: {
    formKey: 'dayEndStockEntries',
  },
  MULTIPLE_BATCH_EXPIRY: {
    formKey: 'multipleBatchExpiry',
  },
  EXPIRED_ITEM_INDICATOR: {
    formKey: 'expiredItemIndicator',
  },
  SPLIT_PAYMENTS: {
    formKey: 'splitPayments',
  },
  SELL_BELOW_PURCHASE: {
    formKey: 'sellBelowPurchasePrice',
  },
  ORG_LOGO: {
    formKey: 'orgLogo',
  },
  SHOW_FSSAI: {
    formKey: 'showFssai',
  },
  CART_SEQUENCE: {
    formKey: 'cartSequence',
  },
  SHOW_GST: {
    formKey: 'showGst',
  },
  TOTAL_SAVINGS: {
    formKey: 'totalSavings',
  },
  FOOTER_TEXT: {
    formKey: 'footerText',
  },
  MAX_HOLD_CART: {
    formKey: 'maxHoldCart',
  },
  HOLD_CART_VISIBLE: {
    formKey: 'holdCartVisibility',
  },
  ALLOW_CREDIT_PAYMENT: {
    formKey: 'creditPayment',
  },
};

export const transformFormToApi = (formData) => {
  const locId = localStorage.getItem('locId');
  const orgId = localStorage.getItem('orgId');
  const { firstName, secondName, uidx } = JSON.parse(localStorage.getItem('user_details')) || {};
  const userName = `${firstName} ${secondName}`;

  const configurationDetails = Object.entries(configMap).map(([key, config]) => ({
    key,
    flag: formData[config?.formKey], 
    terminalIds:
      config?.licenses && formData[config?.licenses]?.length
        ? formData[config?.licenses].map((license) => ({
            licenseId: license?.value,
            licenseName: license?.label,
          }))
        : null,
    storeConfigSettings: {
      ...Object.entries(config?.settings || {}).reduce(
        (acc, [apiKey, setting]) => ({
          ...acc,
          [apiKey]: setting?.reverse ? setting?.reverse(formData[setting?.formKey]) : formData[setting],
        }),
        {},
      ),
    },
  }));

  return {
    ...(formData?.storeConfigId && { storeConfigId: formData?.storeConfigId }), // update existing config
    ...(!formData?.storeConfigId && { createdBy: uidx, createdByName: userName, orgId, locId }), // create new config
    updatedBy: uidx,
    updatedByName: userName,
    configurationDetails,
  };
};

export const transformApiToForm = (apiData) => {
  const formData = { ...initialFormState };

  apiData.configurationDetails?.forEach((config) => {
    const mapping = configMap[config?.key];
    if (!mapping) return;

    // Set feature enabled if flag is true
    formData[mapping?.formKey] = config?.flag || false;

    // Handle licenses
    if (mapping?.licenses && config?.terminalIds) {
      formData[mapping?.licenses] = config?.terminalIds.map((license) => ({
        value: license?.licenseId,
        label: license?.licenseName,
      }));
    }

    Object.entries(config?.storeConfigSettings || {}).forEach(([apiKey, value]) => {
      const setting = mapping?.settings?.[apiKey];
      if (setting) {
        const formKey = setting?.formKey || setting;
        formData[formKey] = setting?.transform ? setting?.transform(value) : value;
      }
    });
  });
  formData.storeConfigId = apiData.storeConfigId;

  return formData;
};
