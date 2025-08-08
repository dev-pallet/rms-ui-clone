import './loyalitypoints.css';
import {
  Autocomplete,
  Card,
  FormControlLabel,
  Grid,
  InputLabel,
  Radio,
  RadioGroup,
  TextField,
  createFilterOptions,
} from '@mui/material';
import {
  createLoyaltyPoints,
  getLoyaltyCategories,
  searchLoyaltyManufacturer,
} from '../../../../config/Services';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import MuiAlert from '@mui/material/Alert';
import React, { useEffect, useRef, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import SoftBox from '../../../../components/SoftBox';
import SoftButton from '../../../../components/SoftButton';
import SoftInput from '../../../../components/SoftInput';
import SoftSelect from '../../../../components/SoftSelect';
import SoftTypography from '../../../../components/SoftTypography';
// import { error } from 'console';

const manuOp = [{}];

const brandOp = [{}];

const filter = createFilterOptions();

const LoyalityPointsform = () => {
  const [opensnack, setOpensnack] = useState(false);
  const [timelinerror, setTimelineerror] = useState('');
  const [alertmessage, setAlertmessage] = useState('');

  const [rewardMinPurchasePrice, setRewardMinPurchasePrice] = useState();
  const [rewardUptoAmount, setRewardUptoAmount] = useState();
  const [rewardUptoPoint, setRewardUptoPoint] = useState();
  const [rewardRateAmount, setRewardRateAmount] = useState();
  const [maxRewardEarningsPerDay, setMaxRewardEarningsPerDay] = useState();
  const [rewardRatePointValue, setRewardRatePointValue] = useState();
  const [expiryAfter, setExpiryAfter] = useState(180);
  const [redeemThresholdAmount, setRedeemThresholdAmount] = useState();
  const [redeemAmountUpto, setRedeemAmountUpto] = useState();
  const [redeemPointUpto, setRedeemPointUpto] = useState();
  const [redeemPercentage, setRedeemPercentage] = useState();
  const [rewardRatePoint, setRewardpoint] = useState();
  const [accesstoken, setAccesstoken] = useState();
  const [redeemableIfCouponApplied, setRedeemableIfCouponApplied] = useState(false);
  const [successReload, setSuccessReload] = useState(false);

  // adding lotyality points based on brand or manufacturer functionlaity
  const [loyalityPointTypeCurValue, setLoyalityPointTypeCurValue] = useState([]);
  const [loyaltyPointTypeOptions, setLoyaltyPointTypeOptions] = useState([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  // const [isInFocus, setIsInFocus] = useState(false);
  // const [newSearchedData,setNewSearchedData] = useState([])

  const [loyaltyCouponType, setLoyaltyCouponType] = useState({
    value: 'Manufacturer',
    label: 'Manufacturer',
  });
  const loyaltyTypeOptions = [
    { value: 'Category', label: 'Category' },
    { value: 'Manufacturer', label: 'Manufacturer' },
  ];

  //adding loyality points thorugh manufacuter or category type api calls

  useEffect(() => {
    setLoyalityPointTypeCurValue([]);
    let data = [];
    if (loyaltyCouponType.value === 'Category') {
      getLoyaltyCategories()
        .then((res) => {
          data = res?.data?.data?.map((category) => {
            return {
              label: category.categoryName,
              value: category.categoryName,
              points: {
                value: '1',
                label: '1X',
              },
            };
          });
          setLoyaltyPointTypeOptions(data);
        })
        .catch((error) => {});
    }
    // else {
    //   // getLoyaltyManufacturers(0, 20)
    //   //   .then((res) => {
    //   //     data = res?.data?.data?.map((manufacture) => {
    //   //       return {
    //   //         label: manufacture.manufactureName,
    //   //         value: manufacture.manufactureName,
    //   //         points: {
    //   //           value: '1',
    //   //           label: '1X',
    //   //         },
    //   //       };
    //   //     });
    //   //     setLoyaltyPointTypeOptions(data);
    //   //   })
    //   //   .catch((error) => {
    //   //   });
    // }
  }, [loyaltyCouponType]);

  //adding infinite scroll on manufature api

  // useEffect(() => {
  //   const list = document.querySelector('.MuiAutocomplete-listbox');
  //   if (list) {
  //     list.addEventListener('scroll', handleListScroll);
  //   }
  //   return () => {
  //     if (list) {
  //       list.removeEventListener('scroll', handleListScroll);
  //     }
  //   };
  // }, [isInFocus, isLoadingMore, page]);

  // const handleListScroll = (event) => {
  //   const list = event.target;
  //   if (list.scrollTop + list.clientHeight >= list.scrollHeight && !isLoadingMore) {
  //     // User has scrolled to the bottom, fetch more data
  //     fetchMoreData();
  //   }
  // };

  const [loader, setIsLoader] = useState(false);
  const autoCompleteRef = useRef(null);

  // const fetchMoreData = async () => {
  //   setIsLoadingMore(true);
  //   try {
  //     const list = document.querySelector('.MuiAutocomplete-listbox');
  //     if (list) {
  //       const scrollTopBeforeFetch = list.scrollTop;

  //       setIsLoader(true);
  //       const response = await getLoyaltyManufacturers(page, 40);
  //       const data = response?.data?.data.map((data) => {
  //         return {
  //           label: data.manufactureName,
  //           value: data.manufactureName,
  //           points: {
  //             value: '1',
  //             label: '1X',
  //           },
  //         };
  //       });
  //       setLoyaltyPointTypeOptions([...loyaltyPointTypeOptions, ...data]);
  //       setIsLoader(false);
  //       // The element exists, so you can safely access its properties
  //       list.scrollTop = scrollTopBeforeFetch;
  //       // Rest of your code...
  //     } else {
  //       // Handle the case where the element doesn't exist
  //       console.error("Element with class '.MuiAutocomplete-listbox' not found.");
  //     }
  //     setPage(page + 1);
  //   } catch (error) {
  //     console.error('Error fetching more data:', error);
  //   } finally {
  //     setIsLoadingMore(false);
  //   }
  // };

  //searhc manufature functionality

  const searchingManufature = (newValue) => {
    if (loyaltyCouponType.value !== 'Category') {
      setLoyaltyPointTypeOptions([]);
      searchLoyaltyManufacturer(newValue, 0, 1000)
        .then((response) => {
          const data = response?.data?.data?.map((dataValue) => {
            return {
              label: dataValue.manufactureName,
              value: dataValue.manufactureName,
              points: {
                label: '1X',
                value: '1',
              },
            };
          });

          const combinedData = [...loyalityPointTypeCurValue, ...data];

          const uniqueLabel = [];
          const uniqueArray = [];
          for (const item of combinedData) {
            if (!uniqueLabel.includes(item.label)) {
              uniqueLabel.push(item.label);
              uniqueArray.push(item);
            }
          }

          setLoyaltyPointTypeOptions([...uniqueArray]);
        })
        .catch((error) => {});
    }
  };

  // form validation (vamsi)
  const onvaliddate = (value) => {
    setExpiryAfter(value);
  };

  const onminpurchase = (value) => {
    setRewardMinPurchasePrice(value);
  };
  const onmaxrewardpoint = (value) => {
    setRewardUptoPoint(value);
  };
  const onmaxrewardperday = (value) => {
    setMaxRewardEarningsPerDay(value);
  };
  const onminredeem = (value) => {
    setRedeemThresholdAmount(value);
  };
  const onratepointvalue = (value) => {
    setRewardRatePointValue(value);
  };
  const onrewardrateamount = (value) => {
    setRewardRateAmount(value);
  };
  const onrewardratevalue = (value) => {
    setRewardpoint(value);
  };
  const onredeempercent = (value) => {
    setRedeemPercentage(value);
  };
  const onredeemamount = (value) => {
    setRedeemAmountUpto(value);
  };
  const oncombineboth = (value) => {
    setRedeemableIfCouponApplied(value);
  };

  const validatePayload = (payload) => {
    if (payload.rewardMinPurchasePrice === '') {
      setAlertmessage('Provide Proper Minimum transaction value');
      setTimelineerror('warning');
      setOpensnack(true);
      return false;
    }
    if (payload.rewardUptoPoint === '') {
      setAlertmessage('Provide Proper Maximum reward points');
      setTimelineerror('warning');
      setOpensnack(true);
      return false;
    }
    if (payload.rewardRateAmount === '') {
      setAlertmessage('Provide Proper Ruppes value for awarding points');
      setTimelineerror('warning');
      setOpensnack(true);
      return false;
    }
    if (payload.maxRewardEarningsPerDay === '') {
      setAlertmessage('Provide Proper Maximum Earnings Per Day');
      setTimelineerror('warning');
      setOpensnack(true);
      return false;
    }
    if (payload.rewardRatePointValue === '') {
      setAlertmessage('Provide Proper value of each point earned');
      setTimelineerror('warning');
      setOpensnack(true);
      return false;
    }
    if (payload.redeemThresholdAmount === '') {
      setAlertmessage('Provide Proper Minimum cart value to redeem points');
      setTimelineerror('warning');
      setOpensnack(true);
      return false;
    }
    if (payload.redeemAmountUpto === '') {
      setAlertmessage('Provide Proper Maximum amount redeemable per transaction');
      setTimelineerror('warning');
      setOpensnack(true);
      return false;
    }
    if (payload.redeemPointUpto === '') {
      setAlertmessage('Provide Proper Maximum points allowed to be redeem per transaction');
      setTimelineerror('warning');
      setOpensnack(true);
      return false;
    }
    if (payload.redeemPercentage === '') {
      setAlertmessage('Provide Proper Maximum amount redeemable value');
      setTimelineerror('warning');
      setOpensnack(true);
      return false;
    }
    return true;
  };

  const sourceOrgId = localStorage.getItem('orgId');
  const sourceLocationId = 'RLC_4';
  // localStorage.getItem('locId');
  const user_details = localStorage.getItem('user_details');
  const createdById = JSON.parse(user_details).uidx;
  const sourceType = localStorage.getItem('contextType');

  const at = localStorage.getItem('access_token');

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  const navigate = useNavigate();
  const onCancel = () => {
    navigate('/marketing/loyaltysettings');
  };
  const onsave = () => {
    // if (!sourceType || !sourceOrgId || !sourceLocationId || !createdById) {
    //   setAlertmessage('Fill Mandatory Details');
    //   setTimelineerror('success');
    //   setOpensnack(true);
    //   return;
    // }

    const numericFields = [
      rewardMinPurchasePrice,
      rewardUptoAmount,
      rewardUptoPoint,
      rewardRateAmount,
      maxRewardEarningsPerDay,
      rewardRatePointValue,
      redeemThresholdAmount,
      redeemAmountUpto,
      redeemPointUpto,
      redeemPercentage,
    ];
    for (const value of numericFields) {
      if (value <= 0) {
        setAlertmessage('Invalid numeric value');
        setTimelineerror('warning');
        setOpensnack(true);
        return;
      }
    }

    // const expiryDate = new Date(expiryDetail);
    // if (isNaN(expiryDate.getTime())) {
    //   setAlertmessage('Invalid expiry date');
    //   setTimelineerror('success');
    //   setOpensnack(true);
    //   return;
    // }

    if (redeemPercentage <= 0) {
      setAlertmessage('Invalid redeem percentage');
      setTimelineerror('warning');
      setOpensnack(true);
      return;
    }
    // [
    //   {
    //     manufacturerName: 'ORIGIN',
    //     incrementalValue: 2,
    //     minimumCartValue: 0,
    //   },
    // ]
    // "productCategory": "string",
    //   "incrementalValue": 0,
    //   "minimumCartValue": 0

    const manufacturerList =
      loyaltyCouponType.value === 'Manufacturer'
        ? loyalityPointTypeCurValue?.map((manufacture) => {
          return {
            manufacturerName: 'ORIGIN',
            incrementalValue: manufacture.points.value,
            minimumCartValue: 0,
          };
        })
        : [];

    const productCategoryList =
      loyaltyCouponType.value === 'Category'
        ? loyalityPointTypeCurValue?.map((category) => {
          return {
            productCategory: category.label,
            incrementalValue: category.points.value,
            minimumCartValue: 0,
          };
        })
        : [];

    const requestBody = {
      sourceType,
      sourceOrgId,
      sourceLocationId,
      rewardMinPurchasePrice: parseInt(rewardMinPurchasePrice),
      rewardUptoPoint: parseInt(rewardUptoPoint),
      rewardRatePoint,
      rewardRateAmount: parseInt(rewardRateAmount),
      rewardRatePointValue: parseFloat(rewardRatePointValue),
      maxRewardEarningsPerDay: parseInt(maxRewardEarningsPerDay),
      expiryAfter,
      redeemThresholdAmount: parseInt(redeemThresholdAmount),
      redeemAmountUpto: parseInt(redeemAmountUpto),
      redeemPercentage: parseFloat(redeemPercentage),
      redeemableIfCouponApplied,
      createdById,
      manufacturerList,
      productCategoryList,
    };

    createLoyaltyPoints(requestBody)
      .then((response) => {
        setAlertmessage(response.data.data.message);
        setTimelineerror('success');
        setOpensnack(true);
        if (response?.data?.status === 'SUCCESS') {
          setSuccessReload(true);
        }
      })
      .catch((error) => {
        console.error('error', error);
        setAlertmessage(error.response.data.message);
        setTimelineerror('warning');
        setOpensnack(true);
      });
  };

  // resseting the values===========

  useEffect(() => {
    setRedeemableIfCouponApplied();
    setLoyalityPointTypeCurValue([]);
  }, [successReload]);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpensnack(false);
  };

  const Currencyop = [
    { value: 'INR', label: 'INR' },
    { value: 'USD', label: 'USD' },
    { value: 'EUR', label: 'EUR' },
    { value: 'AUD', label: 'AUD' },
  ];
  const Validityop = [];

  for (let i = 1; i <= 100; i++) {
    Validityop.push({ value: i, label: i.toString() });
  }

  //===================================
  const handlePointChange = (index, value) => {
    setLoyalityPointTypeCurValue((prevValues) => {
      const updatedValues = [...prevValues];
      updatedValues[index].points.value = value.value;
      updatedValues[index].points.label = value.label;
      return updatedValues;
    });
  };

  // const searchManufactureres = (inputValue) => {
  //   const recentValue = inputValue[inputValue.length - 1].label;
  //   const isExisting = loyalityPointTypeCurValue.some((value) => value.label === recentValue);

  //   if (isExisting) {
  //     setAlertmessage('Manufacturer Already Added');
  //     setTimelineerror('warning');
  //     setOpensnack(true);
  //     setTimeout(() => {
  //       return;
  //     }, 200);
  //   }

  //   const payload = {
  //     companyName: [recentValue],
  //   };
  //   if (!isExisting) {
  //     getAllProducts(payload)
  //       .then((res) => {
  //         if (res?.data?.data?.products.length > 0) {
  //           const value = res?.data?.data?.products[0].company_detail?.name;
  //           setLoyalityPointTypeCurValue((prevState) => [
  //             ...prevState,
  //             {
  //               label: value,
  //               value: value,
  //               points: {
  //                 label: '1X',
  //                 value: '1',
  //               },
  //             },
  //           ]);
  //           setAlertmessage('Manufacturer Found');
  //           setTimelineerror('success');
  //           setOpensnack(true);
  //         } else {
  //           setAlertmessage('Manufacturer Not Found');
  //           setTimelineerror('warning');
  //           setOpensnack(true);
  //         }
  //       })
  //       .catch((error) => {
  //
  //       });
  //   }
  // };
  return (
    <DashboardLayout>
      <DashboardNavbar prevLink={true} />
      <Card style={{ padding: '20px', display: 'flex' }}>
        <SoftTypography variant="h5" m={0.5} mb={2}>
          Loyalty Points Configuration
        </SoftTypography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={6}>
            <SoftBox mb={1} ml={0.5} display="flex" flexDirection="column" gap={1} className="input-container">
              <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                Enter the loyalty points
              </InputLabel>
              <SoftInput
                value={rewardRatePoint}
                type="number"
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || (value >= 0 && value.indexOf('.') === -1)) {
                    onrewardratevalue(parseInt(e.target.value));
                  }
                }}
                onKeyPress={(e) => {
                  const charCode = e.which ? e.which : e.keyCode;
                  if (charCode === 46 || charCode === 45) {
                    e.preventDefault();
                  }
                }}
                style={{ maxHeight: '50px' }}
              />
            </SoftBox>
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <SoftBox mb={1} ml={0.5} display="flex" flexDirection="column" gap={1} className="input-container">
              <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                Enter the equivalent value
              </InputLabel>
              <SoftInput
                onWheel={(e) => e.target.blur()}
                value={rewardRateAmount}
                type="number"
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || (value >= 0 && value.indexOf('.') === -1)) {
                    onrewardrateamount(e.target.value);
                  }
                }}
                onKeyPress={(e) => {
                  const charCode = e.which ? e.which : e.keyCode;
                  if (charCode === 46 || charCode === 45) {
                    e.preventDefault();
                  }
                }}
                style={{ maxHeight: '50px' }}
              />
            </SoftBox>
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <SoftBox mb={1} ml={0.5} display="flex" flexDirection="column" gap={1} className="input-container">
              <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                Enter the value of each point earned
              </InputLabel>
              <SoftBox style={{ display: 'flex', marginTop: '0px' }}>
                <SoftBox style={{ width: '60px' }}>
                  <SoftSelect options={Currencyop} placeholder="INR" />
                </SoftBox>
                <SoftInput
                  onWheel={(e) => e.target.blur()}
                  value={rewardRatePointValue}
                  type="number"
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '' || (value >= 0 && value.indexOf('.') === -1)) {
                      onratepointvalue(e.target.value);
                    }
                  }}
                  onKeyPress={(e) => {
                    const charCode = e.which ? e.which : e.keyCode;
                    if (charCode === 46 || charCode === 45) {
                      e.preventDefault();
                    }
                  }}
                  style={{ maxHeight: '50px', marginLeft: '10px' }}
                />
              </SoftBox>
            </SoftBox>
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <SoftBox mb={1} ml={0.5} display="flex" flexDirection="column" gap={1} className="input-container">
              <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                Maximum reward points earnings per transaction
              </InputLabel>
              <SoftInput
                onWheel={(e) => e.target.blur()}
                value={rewardUptoPoint}
                type="number"
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || (value >= 0 && value.indexOf('.') === -1)) {
                    onmaxrewardpoint(e.target.value);
                  }
                }}
                onKeyPress={(e) => {
                  const charCode = e.which ? e.which : e.keyCode;
                  if (charCode === 46 || charCode === 45) {
                    e.preventDefault();
                  }
                }}
                style={{ maxHeight: '50px' }}
              />
            </SoftBox>
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
            <SoftBox mb={1} ml={0.5} display="flex" flexDirection="column" gap={1} className="input-container">
              <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                Maximum transactions eligible for rewards earnings per day
              </InputLabel>
              <SoftInput
                onWheel={(e) => e.target.blur()}
                value={maxRewardEarningsPerDay}
                type="number"
                required
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || (value >= 0 && value.indexOf('.') === -1)) {
                    onmaxrewardperday(value);
                  }
                }}
                onKeyPress={(e) => {
                  const charCode = e.which ? e.which : e.keyCode;
                  if (charCode === 46 || charCode === 45) {
                    e.preventDefault();
                  }
                }}
                style={{ maxHeight: '50px' }}
              />
            </SoftBox>
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <SoftBox mb={1} ml={0.5} display="flex" flexDirection="column" gap={1} className="input-container">
              <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                Minimum transaction value eligible for earning reward points
              </InputLabel>
              <SoftInput
                onWheel={(e) => e.target.blur()}
                value={rewardMinPurchasePrice}
                type="number"
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || (value >= 0 && value.indexOf('.') === -1)) {
                    onminpurchase(e.target.value);
                  }
                }}
                onKeyPress={(e) => {
                  const charCode = e.which ? e.which : e.keyCode;
                  if (charCode === 46 || charCode === 45) {
                    e.preventDefault();
                  }
                }}
                style={{ maxHeight: '50px' }}
              />
            </SoftBox>
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <SoftBox mb={1} ml={0.5} display="flex" flexDirection="column" gap={1} className="input-container">
              <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                Reward points validity from the date of issue
              </InputLabel>
              <SoftBox style={{ width: '100%' }}>
                <SoftSelect
                  options={Validityop}
                  style={{ width: '10px' }}
                  onChange={(e) => {
                    const value = e.value;
                    onvaliddate(value);
                  }}
                  placeholder="MONTHS"
                />
              </SoftBox>
            </SoftBox>
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <SoftBox mb={1} ml={0.5} display="flex" flexDirection="column" gap={1} className="input-container">
              <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                Minimum cart value to redeem points
              </InputLabel>
              <SoftInput
                onWheel={(e) => e.target.blur()}
                value={redeemThresholdAmount}
                type="number"
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || (value >= 0 && value.indexOf('.') === -1)) {
                    onminredeem(e.target.value);
                  }
                }}
                onKeyPress={(e) => {
                  const charCode = e.which ? e.which : e.keyCode;
                  if (charCode === 46 || charCode === 45) {
                    e.preventDefault();
                  }
                }}
                style={{ maxHeight: '50px' }}
              />
            </SoftBox>
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <SoftBox mb={1} ml={0.5} display="flex" flexDirection="column" gap={1} className="input-container">
              <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                Maximum points allowed to be redeem per transaction
              </InputLabel>
              <SoftInput
                onWheel={(e) => e.target.blur()}
                value={redeemPercentage}
                type="number"
                placeholder="5% of cart value"
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || (value >= 0 && value.indexOf('.') === -1)) {
                    onredeempercent(e.target.value);
                  }
                }}
                onKeyPress={(e) => {
                  const charCode = e.which ? e.which : e.keyCode;
                  if (charCode === 46 || charCode === 45) {
                    e.preventDefault();
                  }
                }}
                min={1}
                style={{ maxHeight: '50px' }}
              />
            </SoftBox>
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
            <SoftBox mb={1} ml={0.5} display="flex" flexDirection="column" gap={1} className="input-container">
              <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                Maximum amount redeemable per transaction
              </InputLabel>
              <SoftInput
                onWheel={(e) => e.target.blur()}
                value={redeemAmountUpto}
                type="number"
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || (value >= 0 && value.indexOf('.') === -1)) {
                    onredeemamount(e.target.value);
                  }
                }}
                onKeyPress={(e) => {
                  const charCode = e.which ? e.which : e.keyCode;
                  if (charCode === 46 || charCode === 45) {
                    e.preventDefault();
                  }
                }}
                style={{ maxHeight: '50px' }}
              />
            </SoftBox>
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
            <SoftBox mb={1} ml={0.5} display="flex" flexDirection="column" gap={1} className="input-container">
              <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                Loyalty type
              </InputLabel>
              <SoftBox style={{ width: '100%' }}>
                <SoftSelect
                  options={loyaltyTypeOptions}
                  value={loyaltyCouponType}
                  onChange={(e) => {
                    setLoyaltyCouponType(e);
                  }}
                />
              </SoftBox>
            </SoftBox>
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
            <SoftBox mb={1} ml={0.5} display="flex" flexDirection="column" gap={1} className="input-container">
              <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                {loyaltyCouponType.value === 'Category' ? 'Select Category:' : 'Select Manufacturers:'}
              </InputLabel>
              <SoftBox style={{ width: '100%' }}>
                <Autocomplete
                  ref={autoCompleteRef}
                  // onClose={() => setIsInFocus(false)}
                  onBlur={() => {
                    // setIsInFocus(false);
                    if (loyaltyCouponType.value !== 'Category') {
                      setLoyaltyPointTypeOptions([]);
                    }
                  }}
                  // onFocus={() => setIsInFocus(true)}
                  blurOnSelect
                  value={loyalityPointTypeCurValue}
                  multiple
                  options={loyaltyPointTypeOptions}
                  onChange={(event, newValue) => {
                    // if (loyaltyCouponType.value === 'Category') {
                    setLoyalityPointTypeCurValue(newValue);
                    // handleOutOfFocus();
                    // } else {
                    // if (newValue) {
                    // searchManufactureres(newValue);
                    // }
                    // searchingManufactures(newValue);
                    // }
                  }}
                  filterSelectedOptions
                  getOptionLabel={(option) => option.label}
                  renderInput={(params) => (
                    <TextField
                      onChange={(e) => searchingManufature(e.target.value)}
                      ref={autoCompleteRef}
                      {...params}
                      placeholder="Search"
                      // InputProps={{
                      //   ...params.InputProps,
                      //   endAdornment: (
                      //     <>
                      //       {loader ? <CircularProgress color="inherit" size={20} /> : null}
                      //       {params.InputProps.endAdornment}
                      //     </>
                      //   ),
                      // }}
                    />
                  )}
                />
              </SoftBox>
            </SoftBox>
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
            <SoftBox mb={1} ml={0.5} display="flex" flexDirection="column" gap={1} className="input-container">
              <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                Loyalty points can be redeemed with other coupons/ discounts.
              </InputLabel>
              <RadioGroup
                style={{
                  flexDirection: 'column',
                  marginLeft: '17px',
                  padding: '10 px',
                  justifyContent: 'space-between',
                }}
                onChange={(e) => oncombineboth(e.target.value)}
                value={redeemableIfCouponApplied}
              >
                <FormControlLabel value="true" control={<Radio />} label="Yes" />
                <FormControlLabel value="false" control={<Radio />} label="No" />
              </RadioGroup>
            </SoftBox>
          </Grid>

          <Grid container spacing={2} ml="-8px">
            <Grid item lg={12}>
              {loyalityPointTypeCurValue.length > 0 && (
                <SoftBox
                  sx={{
                    background: '#d3d3d345',
                    borderRadius: '10px',
                    width: '100%',
                    height: 'auto',
                    padding: '20px',
                  }}
                >
                  {loyalityPointTypeCurValue.length > 0 &&
                    loyalityPointTypeCurValue.map((point, index) => {
                      return (
                        <SoftBox
                          key={index + 1}
                          sx={{
                            width: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            marginBottom: '20px',
                            gap: '30px',
                          }}
                        >
                          <SoftTypography
                            variant="h6"
                            fontWeight="medium"
                            sx={{
                              minWidth: '200px',
                            }}
                          >
                            {point.label}
                          </SoftTypography>
                          <SoftSelect
                            value={point.points || ''}
                            options={[
                              { value: '1', label: '1X' },
                              { value: '2', label: '2X' },
                              { value: '3', label: '3X' },
                              { value: '4', label: '4X' },
                              { value: '5', label: '5X' },
                              { value: '6', label: '6X' },
                              { value: '7', label: '7X' },
                              { value: '8', label: '8X' },
                              { value: '9', label: '9X' },
                              { value: '10', label: '10X' },
                            ]}
                            onChange={(value) => handlePointChange(index, value)}
                            menuPortalTarget={document.body}
                          />
                        </SoftBox>
                      );
                    })}
                </SoftBox>
              )}
            </Grid>
          </Grid>
        </Grid>
        <SoftBox
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          <SoftButton
            variant="gradient"
            color="info"
            style={{ marginLeft: '20px', float: 'right', margin: '10px' }}
            onClick={onsave}
          >
            Save
          </SoftButton>
          <SoftButton
            variant="gradient"
            color="info"
            style={{ marginLeft: '20px', float: 'right', margin: '10px' }}
            onClick={onCancel}
          >
            Cancel
          </SoftButton>
        </SoftBox>
      </Card>
      <Snackbar open={opensnack} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={timelinerror} sx={{ width: '100%' }}>
          {alertmessage}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
};

export default LoyalityPointsform;
