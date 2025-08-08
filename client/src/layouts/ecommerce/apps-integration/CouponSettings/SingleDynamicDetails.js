import { Box, Button, Grid, Menu, MenuItem, Tooltip, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import { useNavigate, useParams } from 'react-router-dom';
import SoftBox from '../../../../components/SoftBox';
import {
  dynamicCouponSingle,
  getCatLevel1ById,
  getCatLevel2ById,
  getMainCatById,
  getProductDetails,
  updateDynamicCouponStatus,
} from '../../../../config/Services';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import { useSnackbar } from '../../../../hooks/SnackbarProvider';
import { dateFormatter, productIdByBarcode } from '../../Common/CommonFunction';
import Status from '../../Common/Status';

const SingleDynamicDetails = () => {
  const { id } = useParams();
  const showSnackbar = useSnackbar();
  const navigate = useNavigate();

  const [couponDetails, setCouponDetails] = useState([]);
  const [loader, setLoader] = useState(false);
  const [rewProductName, setRewProductName] = useState('');
  const [redProductName, setRedProductName] = useState('');
  const [productNames, setProductNames] = useState({});
  const [mainCatNameRed, setMainCatNameRed] = useState('');
  const [mainCatNameRew, setMainCatNameRew] = useState('');
  const [lev1CatNameRed, setLev1CatNameRed] = useState('');
  const [lev1CatNameRew, setLev1CatNameRew] = useState('');
  const [lev2CatNameRed, setLev2CatNameRed] = useState('');
  const [lev2CatNameRew, setLev2CatNameRew] = useState('');

  const [anchorMarkupEl, setAnchorMarkupEl] = useState(null);
  const markUpOpen = Boolean(anchorMarkupEl);

  const getCouponDetails = () => {
    setLoader(true);
    dynamicCouponSingle(id)
      .then((res) => {
        setLoader(false);
        if (res?.data?.data?.es) {
          showSnackbar(res?.data?.data?.message || 'Some error occured', 'error');
          return;
        }
        const response = res?.data?.data?.dynamicCouponConfig;
        setCouponDetails(response);
      })
      .catch((err) => {
        setLoader(false);
        showSnackbar(err?.response?.data?.message || 'Some error occured', 'error');
      });
  };

  useEffect(() => {
    getCouponDetails();
  }, []);

  const getNameOfProduct = async (barcode) => {
    try {
      const res = await getProductDetails(barcode);
      const name = res?.data?.data?.name;
      return name;
    } catch (error) {
      showSnackbar('Cannot fetch details', 'error');
      return null;
    }
  };

  const fetchData = async () => {
    let name = '';
    await Promise.all(
      (couponDetails?.staticItemList ?? []).map(async (item) => {
        name = await getNameOfProduct(item.itemCode);
      }),
    );
    setRewProductName(name);
  };

  const fetchData1 = async () => {
    const names = {};
    await Promise.all(
      (couponDetails?.freebieItemRewardList ?? []).map(async (item) => {
        const name = await getNameOfProduct(item.itemCode);
        names[item.itemCode] = name;
      }),
    );
    setProductNames(names);
  };

  const fetchData2 = async () => {
    let name = '';
    await Promise.all(
      (couponDetails?.freebieItemConfigList ?? []).map(async (item) => {
        name = await getNameOfProduct(item.itemCode);
      }),
    );
    setRedProductName(name);
  };

  useEffect(() => {
    {
      couponDetails?.freebieItemRewardList &&
        couponDetails?.freebieItemRewardList.map((item) => {
          if (item.itemCode !== '') {
            fetchData1();
          }
        });
    }
    {
      couponDetails?.staticItemList &&
        couponDetails?.staticItemList.map((item) => {
          if (item.itemCode !== '') {
            fetchData();
          }
        });
    }
    {
      couponDetails?.freebieItemConfigList &&
        couponDetails?.freebieItemConfigList.map((item) => {
          if (item.itemCode !== '') {
            fetchData2();
          }
        });
    }
    getMainCatName();
    getLevel1CatName();
    getLevel2CatName();
  }, [couponDetails]);

  const getMainCatName = () => {
    const cat1 = couponDetails?.applicableMainCategory;
    const cat2 = couponDetails?.mainCategory;
    if (
      couponDetails.configType === 'CATEGORY' ||
      couponDetails.configType === 'BRAND' ||
      couponDetails.configType === 'MANUFACTURER' ||
      couponDetails?.rewardingCouponType === 'CATEGORY' ||
      couponDetails?.rewardingCouponType === 'BRAND' ||
      (couponDetails?.rewardingCouponType === 'MANUFACTURER' && cat1) ||
      cat2
    ) {
      getMainCatById(cat1).then((res) => {
        const catArr = res?.data?.data;
        setMainCatNameRed(catArr[0]?.categoryName);
      });
      getMainCatById(cat2).then((res) => {
        const catArr = res?.data?.data;
        setMainCatNameRew(catArr[0]?.categoryName);
      });
    }
  };

  const getLevel1CatName = () => {
    const cat1 = couponDetails?.applicableCategory1;
    const cat2 = couponDetails?.category1;
    if (
      couponDetails.configType === 'CATEGORY' ||
      couponDetails.configType === 'BRAND' ||
      couponDetails.configType === 'MANUFACTURER' ||
      couponDetails?.rewardingCouponType === 'CATEGORY' ||
      couponDetails?.rewardingCouponType === 'BRAND' ||
      couponDetails?.rewardingCouponType === 'MANUFACTURER'
    ) {
      getCatLevel1ById(cat1).then((res) => {
        const catArr = res?.data?.data;
        setLev1CatNameRed(catArr[0]?.categoryName);
      });
      getCatLevel1ById(cat2).then((res) => {
        const catArr = res?.data?.data;
        setLev1CatNameRew(catArr[0]?.categoryName);
      });
    }
  };

  const getLevel2CatName = () => {
    const cat1 = couponDetails?.applicableCategory2;
    const cat2 = couponDetails?.category2;
    if (
      couponDetails.configType === 'CATEGORY' ||
      couponDetails.configType === 'BRAND' ||
      couponDetails.configType === 'MANUFACTURER' ||
      couponDetails?.rewardingCouponType === 'CATEGORY' ||
      couponDetails?.rewardingCouponType === 'BRAND' ||
      couponDetails?.rewardingCouponType === 'MANUFACTURER'
    ) {
      getCatLevel2ById(cat1).then((res) => {
        const catArr = res?.data?.data;
        setLev2CatNameRed(catArr[0]?.categoryName);
      });
      getCatLevel2ById(cat2).then((res) => {
        const catArr = res?.data?.data;
        setLev2CatNameRew(catArr[0]?.categoryName);
      });
    }
  };

  const handleClick = (event) => {
    setAnchorMarkupEl(event.currentTarget);
  };

  const handleCloseOp = () => {
    setAnchorMarkupEl(null);
  };

  const OnUpdate = (status) => {
    const user_details = localStorage.getItem('user_details');
    const uidx = JSON.parse(user_details).uidx;
    const payload = {
      configId: couponDetails.configId,
      status: status,
      updatedBy: uidx,
    };
    updateDynamicCouponStatus(payload)
      .then((res) => {
        showSnackbar('Updated the status', 'success');
        getCouponDetails();
      })
      .catch((err) => {
        showSnackbar('Failed to Update the status', 'error');
      });
  };

  const originalDateString1 = couponDetails?.createdOn;
  const dateObject1 = new Date(originalDateString1);

  const originalDateString2 = couponDetails?.updatedOn;
  const dateObject2 = new Date(originalDateString2);

  const options = { day: 'numeric', month: 'short', year: 'numeric' };
  const createdOn = dateObject1.toLocaleDateString('en-US', options);

  const updatedOn = dateObject2.toLocaleDateString('en-US', options);
  const handleImageError = (event) => {
    event.target.src = 'https://i.imgur.com/dL4ScuP.png';
  };

  const handleProductNavigation = async (barcode) => {
    try {
      const productId = await productIdByBarcode(barcode);
      if (productId) {
        navigate(`/products/product/details/${productId}`);
      }
    } catch (error) {}
  };

  return (
    <div>
      <DashboardLayout>
        <DashboardNavbar prevLink={true} />
        <SoftBox className="coupons-details-header">
          <div className="details-main-header">
            <img
              src="https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_images/coupon_1041885.png"
              className="details-main-header-img"
              onError={handleImageError}
            />
            <div>
              <Typography className="details-main-header-typo">{couponDetails.offerName}</Typography>
              <Typography className="details-main-header-typo-2">Created On: {createdOn}</Typography>
              <Typography className="details-main-header-typo-2">Updated On: {updatedOn}</Typography>
            </div>
          </div>
          <div className="details-main-header">
            {couponDetails?.status && <Status label={couponDetails?.status} />}
            <Button
              id="basic-button"
              aria-controls={markUpOpen ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={markUpOpen ? 'true' : undefined}
              onClick={handleClick}
            >
              <MoreVertRoundedIcon sx={{ fontSize: '14px' }} />
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorMarkupEl}
              open={markUpOpen}
              onClose={handleCloseOp}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              <MenuItem>
                <Button
                  className="dynamic-coupon-button-Style"
                  style={{
                    backgroundColor: '#4caf50',
                  }}
                  onClick={() => {
                    handleCloseOp();
                    OnUpdate('ACTIVE');
                  }}
                >
                  Active
                </Button>
              </MenuItem>
              <MenuItem>
                <Button
                  className="dynamic-coupon-button-Style"
                  style={{
                    backgroundColor: '#7c86de',
                  }}
                  onClick={() => {
                    handleCloseOp();
                    OnUpdate('INACTIVE');
                  }}
                >
                  Inactive
                </Button>
              </MenuItem>
              <MenuItem>
                <Button
                  className="dynamic-coupon-button-Style"
                  style={{
                    backgroundColor: '#ff0000',
                  }}
                  onClick={() => {
                    handleCloseOp();
                    OnUpdate('DISABLED');
                  }}
                >
                  Delete
                </Button>
              </MenuItem>
            </Menu>
          </div>
        </SoftBox>
        <Box className="table-css-fix-box-scroll-vend" id="box-shadow-1">
          <div className="coupon-main-criteria-typo-box-1">
            <Typography className="single-journey-title-1">Coupon Issuance Conditions</Typography>
          </div>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <SoftBox>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={12} lg={12}>
                    <SoftBox className="coupon-reward-type-box">
                      <Typography className="single-journey-title-1">Coupon Type</Typography>
                      <Typography className="coupon-reward-type-typo">{couponDetails?.configType || 'NA'}</Typography>
                    </SoftBox>
                  </Grid>
                </Grid>
              </SoftBox>
              <SoftBox my={3}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={12} lg={12}>
                    <SoftBox className="coupon-reward-type-box-1">
                      <Typography className="single-journey-title-1">Coupon Type Details</Typography>
                      {couponDetails?.configType === 'PRODUCT' ? (
                        <>
                          {couponDetails?.freebieItemConfigList.map((item, i) => {
                            return (
                              <>
                                <div className="coupon-reward-flex-div">
                                  <Typography className="coupon-reward-type-typo">Product Name</Typography>

                                  <Typography className="coupon-reward-type-typo">{redProductName}</Typography>
                                </div>
                                <div className="coupon-reward-flex-div">
                                  <Typography className="coupon-reward-type-typo">Barcode</Typography>
                                  <Typography
                                    className="coupon-reward-type-typo"
                                    onClick={() => handleProductNavigation(item?.itemCode)}
                                  >
                                    <a>{item?.itemCode}</a>
                                  </Typography>
                                </div>
                                <div className="coupon-reward-flex-div">
                                  <Typography className="coupon-reward-type-typo">Quantity</Typography>
                                  <Typography className="coupon-reward-type-typo">{item?.quantity}</Typography>
                                </div>
                              </>
                            );
                          })}
                        </>
                      ) : couponDetails?.configType === 'CART_VALUE' ? (
                        <>
                          <div className="coupon-reward-flex-div">
                            <Typography className="coupon-reward-type-typo">Minimum Cart Value</Typography>
                            <Typography className="coupon-reward-type-typo">
                              ₹{couponDetails?.minOrderValue || 'NA'}
                            </Typography>
                          </div>
                        </>
                      ) : couponDetails?.configType === 'CATEGORY' ? (
                        <>
                          <div className="coupon-reward-flex-div">
                            <Typography className="coupon-reward-type-typo">Main Category</Typography>
                            <Typography className="coupon-reward-type-typo">{mainCatNameRed || 'NA'}</Typography>
                          </div>
                          <div className="coupon-reward-flex-div">
                            <Typography className="coupon-reward-type-typo">Category Level 1</Typography>
                            <Typography className="coupon-reward-type-typo">{lev1CatNameRed || 'NA'}</Typography>
                          </div>
                          <div className="coupon-reward-flex-div">
                            <Typography className="coupon-reward-type-typo">Category Level 2</Typography>
                            <Typography className="coupon-reward-type-typo">{lev2CatNameRed || 'NA'}</Typography>
                          </div>
                        </>
                      ) : couponDetails?.configType === 'BRAND' ? (
                        <>
                          <div className="coupon-reward-flex-div">
                            <Typography className="coupon-reward-type-typo">Main Category</Typography>
                            <Typography className="coupon-reward-type-typo">{mainCatNameRed || 'NA'}</Typography>
                          </div>
                          <div className="coupon-reward-flex-div">
                            <Typography className="coupon-reward-type-typo">Category Level 1</Typography>
                            <Typography className="coupon-reward-type-typo">{lev1CatNameRed || 'NA'}</Typography>
                          </div>
                          <div className="coupon-reward-flex-div">
                            <Typography className="coupon-reward-type-typo">Category Level 2</Typography>
                            <Typography className="coupon-reward-type-typo">{lev2CatNameRed || 'NA'}</Typography>
                          </div>
                          <div className="coupon-reward-flex-div">
                            <Typography className="coupon-reward-type-typo">Brand</Typography>
                            <Typography className="coupon-reward-type-typo">
                              {couponDetails?.applicableBrand || 'NA'}
                            </Typography>
                          </div>
                        </>
                      ) : couponDetails?.configType === 'MANUFACTURER' ? (
                        <>
                          <div className="coupon-reward-flex-div">
                            <Typography className="coupon-reward-type-typo">Main Category</Typography>
                            <Typography className="coupon-reward-type-typo">{mainCatNameRed || 'NA'}</Typography>
                          </div>
                          <div className="coupon-reward-flex-div">
                            <Typography className="coupon-reward-type-typo">Category Level 1</Typography>
                            <Typography className="coupon-reward-type-typo">{lev1CatNameRed || 'NA'}</Typography>
                          </div>
                          <div className="coupon-reward-flex-div">
                            <Typography className="coupon-reward-type-typo">Category Level 2</Typography>
                            <Typography className="coupon-reward-type-typo">{lev2CatNameRed || 'NA'}</Typography>
                          </div>
                          <div className="coupon-reward-flex-div">
                            <Typography className="coupon-reward-type-typo">Brand</Typography>
                            <Typography className="coupon-reward-type-typo">
                              {couponDetails?.applicableBrand || 'NA'}
                            </Typography>
                          </div>
                          <div className="coupon-reward-flex-div">
                            <Typography className="coupon-reward-type-typo">Manufacturer</Typography>
                            <Typography className="coupon-reward-type-typo">
                              {couponDetails?.applicableManufacturer || 'NA'}
                            </Typography>
                          </div>
                        </>
                      ) : null}
                    </SoftBox>
                  </Grid>
                </Grid>
              </SoftBox>
            </Grid>
            <Grid item xs={12} md={6} lg={8}>
              <SoftBox>
                <SoftBox className="coupon-reward-type-box">
                  <Grid container spacing={3}>
                    <Grid item xs={12} lg={4} md={4}>
                      <div className="terms-conditions-box">
                        <Typography className="single-journey-title-1">Minimum Cart Value</Typography>
                        <Typography className="coupon-reward-type-typo">
                          ₹{couponDetails?.minOrderValue || 'NA'}
                        </Typography>
                      </div>
                    </Grid>
                    <Grid item xs={12} lg={4} md={4}>
                      <div className="terms-conditions-box">
                        <Typography className="single-journey-title-1">Max Usage Per User</Typography>
                        <Typography className="coupon-reward-type-typo">
                          {couponDetails?.maxUsagePerUser || 'NA'}
                        </Typography>
                      </div>
                    </Grid>
                    <Grid item xs={12} lg={4} md={4}>
                      <div className="terms-conditions-box">
                        <Typography className="single-journey-title-1">Locations</Typography>
                        <Typography className="coupon-reward-type-typo">
                          {couponDetails?.applicableLocation || 'NA'}
                        </Typography>
                      </div>
                    </Grid>
                  </Grid>

                  <Grid container spacing={3} style={{ marginTop: '1px' }}>
                    <Grid item xs={12} lg={4} md={4}>
                      <div className="terms-conditions-box">
                        <Typography className="single-journey-title-1">Sales Channel</Typography>
                        <div className="terms-conditions-box-img-div">
                          {couponDetails && couponDetails?.channels && couponDetails?.channels.includes('POS') ? (
                            <div>
                              <Typography className="coupon-reward-type-typo">POS</Typography>
                            </div>
                          ) : null}
                          {couponDetails && couponDetails?.channels && couponDetails?.channels.includes('APP') ? (
                            <div>
                              <Typography className="coupon-reward-type-typo">APP</Typography>
                            </div>
                          ) : null}
                          {couponDetails && couponDetails?.channels && couponDetails?.channels.includes('RMS') ? (
                            <div>
                              <Typography className="coupon-reward-type-typo">RMS</Typography>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </Grid>
                    <Grid item xs={12} lg={4} md={4}>
                      <div className="terms-conditions-box">
                        <Typography className="single-journey-title-1">Notifications</Typography>
                        <div className="terms-conditions-box-img-div">
                          {couponDetails && couponDetails?.notify && couponDetails?.notify.includes('SMS') ? (
                            <div>
                              <Typography className="coupon-reward-type-typo">SMS</Typography>
                            </div>
                          ) : null}
                          {couponDetails && couponDetails?.notify && couponDetails?.notify.includes('WHATSAPP') ? (
                            <div>
                              <Typography className="coupon-reward-type-typo">Whatsapp</Typography>
                            </div>
                          ) : null}
                          {couponDetails && couponDetails?.notify && couponDetails?.notify.includes('EMAIL') ? (
                            <div>
                              <Typography className="coupon-reward-type-typo">Email</Typography>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </Grid>
                    <Grid item xs={12} lg={4} md={4}>
                      <div className="terms-conditions-box">
                        <Typography className="single-journey-title-1">Validity</Typography>
                        <Typography className="coupon-reward-type-typo">
                          {dateFormatter(couponDetails?.validFrom) || 'NA'}-
                          {dateFormatter(couponDetails?.validTo) || 'NA'}
                        </Typography>
                        <Typography className="coupon-reward-type-typo">
                          {couponDetails?.validTimeFrom || 'NA'}-{couponDetails?.validTimeTo || 'NA'}
                        </Typography>
                      </div>
                    </Grid>
                  </Grid>

                  <Grid container spacing={3} style={{ marginTop: '1px' }}>
                    <Grid item xs={12} lg={4} md={4}>
                      <div className="terms-conditions-box">
                        <Typography className="single-journey-title-1">Combine with coupons</Typography>
                        {couponDetails?.combined === true ? (
                          <div>
                            <Tooltip title="Yes">
                              <img
                                src="https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_images/check-mark_5290076.png"
                                className="terms-conditions-img-2"
                                onError={handleImageError}
                              />
                            </Tooltip>
                          </div>
                        ) : (
                          <div>
                            <Tooltip title="No">
                              <img
                                src="https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_images/close-button_11450177.png"
                                className="terms-conditions-img-2"
                                onError={handleImageError}
                              />
                            </Tooltip>
                          </div>
                        )}
                      </div>
                    </Grid>
                    <Grid item xs={12} lg={4} md={4}>
                      <div className="terms-conditions-box">
                        <Typography className="single-journey-title-1">Mobile Number/OTP</Typography>
                        <div className="terms-conditions-box-img-div">
                          {couponDetails?.mobileNoRequired === true ? (
                            <div>
                              <Tooltip title="Yes">
                                <img
                                  src="https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_images/check-mark_5290076.png"
                                  className="terms-conditions-img-2"
                                  onError={handleImageError}
                                />
                              </Tooltip>
                            </div>
                          ) : (
                            <div>
                              <Tooltip title="No">
                                <img
                                  src="https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_images/close-button_11450177.png"
                                  className="terms-conditions-img-2"
                                  onError={handleImageError}
                                />
                              </Tooltip>
                            </div>
                          )}
                          {couponDetails?.otpRedemption === true ? (
                            <div>
                              <Tooltip title="Yes">
                                <img
                                  src="https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_images/check-mark_5290076.png"
                                  className="terms-conditions-img-2"
                                  onError={handleImageError}
                                />
                              </Tooltip>
                            </div>
                          ) : (
                            <div>
                              <Tooltip title="No">
                                <img
                                  src="https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_images/close-button_11450177.png"
                                  className="terms-conditions-img-2"
                                  onError={handleImageError}
                                />
                              </Tooltip>
                            </div>
                          )}
                        </div>
                      </div>
                    </Grid>
                    <Grid item xs={12} lg={4} md={4}>
                      <div className="terms-conditions-box">
                        <Typography className="single-journey-title-1">Coupon Limit</Typography>
                        <Typography className="coupon-reward-type-typo">
                          {couponDetails?.generateCouponLimit || 'NA'}
                        </Typography>
                      </div>
                    </Grid>
                  </Grid>
                </SoftBox>
              </SoftBox>
            </Grid>
          </Grid>
          <SoftBox className="coupon-reward-type-box" my={3}>
            <Typography className="single-journey-title-1">Description</Typography>
            <Typography className="coupon-reward-type-typo">{couponDetails?.description || 'NA'}</Typography>

            <Typography className="single-journey-title-1">Terms and conditions</Typography>
            <Typography className="coupon-reward-type-typo">{couponDetails?.termsAndConditions || 'NA'}</Typography>
          </SoftBox>
        </Box>
        <Box className="table-css-fix-box-scroll-vend" id="box-shadow-1">
          <div className="coupon-main-criteria-typo-box">
            <Typography className="single-journey-title-1">Coupon Redeeming Conditions</Typography>
          </div>
          <SoftBox my={3}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4} lg={4}>
                <SoftBox className="coupon-reward-type-box">
                  <Typography className="single-journey-title-1">Coupon Type</Typography>
                  <Typography className="coupon-reward-type-typo">
                    {couponDetails?.rewardingCouponType || 'NA'}
                  </Typography>
                </SoftBox>
              </Grid>
              <Grid item xs={12} md={4} lg={4}>
                <SoftBox className="coupon-reward-type-box">
                  <Typography className="single-journey-title-1">Discount Type</Typography>
                  <Typography className="coupon-reward-type-typo">
                    {couponDetails?.rewardingDiscountType !== 'NONE' ? 'Discount' : ''}
                    {couponDetails?.freebieItemRewardList &&
                      couponDetails?.freebieItemRewardList.map((item) => {
                        return <>{item.itemCode !== '' ? ', Freebie' : ''}</>;
                      })}
                  </Typography>
                </SoftBox>
              </Grid>
              <Grid item xs={12} md={4} lg={4}>
                <SoftBox className="coupon-reward-type-box">
                  <Typography className="single-journey-title-1">Validity</Typography>
                  <Typography className="coupon-reward-type-typo">{couponDetails?.validDays || 'NA'} days</Typography>
                </SoftBox>
              </Grid>
            </Grid>
          </SoftBox>
          <SoftBox my={3}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4} lg={4}>
                <SoftBox className="coupon-reward-type-box-1">
                  <Typography className="single-journey-title-1">Coupon Type Details</Typography>
                  {couponDetails?.rewardingCouponType === 'PRODUCT' ? (
                    <>
                      {couponDetails?.staticItemList.map((item, i) => {
                        return (
                          <>
                            <div className="coupon-reward-flex-div">
                              <Typography className="coupon-reward-type-typo">Product Name</Typography>

                              <Typography className="coupon-reward-type-typo">{rewProductName}</Typography>
                            </div>
                            <div className="coupon-reward-flex-div">
                              <Typography className="coupon-reward-type-typo">Barcode</Typography>
                              <Typography
                                className="coupon-reward-type-typo"
                                onClick={() => handleProductNavigation(item?.itemCode)}
                              >
                                <a>{item?.itemCode}</a>
                              </Typography>
                            </div>
                            <div className="coupon-reward-flex-div">
                              <Typography className="coupon-reward-type-typo">Quantity</Typography>
                              <Typography className="coupon-reward-type-typo">{item?.quantity}</Typography>
                            </div>
                          </>
                        );
                      })}
                    </>
                  ) : couponDetails?.rewardingCouponType === 'CART_VALUE' ? (
                    <>
                      <div className="coupon-reward-flex-div">
                        <Typography className="coupon-reward-type-typo">Minimum Cart Value</Typography>
                        <Typography className="coupon-reward-type-typo">
                          ₹{couponDetails?.rewardingMinOrderValue || 'NA'}
                        </Typography>
                      </div>
                    </>
                  ) : couponDetails?.rewardingCouponType === 'CATEGORY' ? (
                    <>
                      <div className="coupon-reward-flex-div">
                        <Typography className="coupon-reward-type-typo">Main Category</Typography>
                        <Typography className="coupon-reward-type-typo">{mainCatNameRew || 'NA'}</Typography>
                      </div>
                      <div className="coupon-reward-flex-div">
                        <Typography className="coupon-reward-type-typo">Category Level 1</Typography>
                        <Typography className="coupon-reward-type-typo">{lev1CatNameRew || 'NA'}</Typography>
                      </div>
                      <div className="coupon-reward-flex-div">
                        <Typography className="coupon-reward-type-typo">Category Level 2</Typography>
                        <Typography className="coupon-reward-type-typo">{lev2CatNameRew || 'NA'}</Typography>
                      </div>
                    </>
                  ) : couponDetails?.rewardingCouponType === 'BRAND' ? (
                    <>
                      <div className="coupon-reward-flex-div">
                        <Typography className="coupon-reward-type-typo">Main Category</Typography>
                        <Typography className="coupon-reward-type-typo">{mainCatNameRew || 'NA'}</Typography>
                      </div>
                      <div className="coupon-reward-flex-div">
                        <Typography className="coupon-reward-type-typo">Category Level 1</Typography>
                        <Typography className="coupon-reward-type-typo">{lev1CatNameRew || 'NA'}</Typography>
                      </div>
                      <div className="coupon-reward-flex-div">
                        <Typography className="coupon-reward-type-typo">Category Level 2</Typography>
                        <Typography className="coupon-reward-type-typo">{lev2CatNameRew || 'NA'}</Typography>
                      </div>
                      <div className="coupon-reward-flex-div">
                        <Typography className="coupon-reward-type-typo">Brand</Typography>
                        <Typography className="coupon-reward-type-typo">{couponDetails?.brand || 'NA'}</Typography>
                      </div>
                    </>
                  ) : couponDetails?.rewardingCouponType === 'MANUFACTURER' ? (
                    <>
                      <div className="coupon-reward-flex-div">
                        <Typography className="coupon-reward-type-typo">Main Category</Typography>
                        <Typography className="coupon-reward-type-typo">{mainCatNameRew || 'NA'}</Typography>
                      </div>
                      <div className="coupon-reward-flex-div">
                        <Typography className="coupon-reward-type-typo">Category Level 1</Typography>
                        <Typography className="coupon-reward-type-typo">{lev1CatNameRew || 'NA'}</Typography>
                      </div>
                      <div className="coupon-reward-flex-div">
                        <Typography className="coupon-reward-type-typo">Category Level 2</Typography>
                        <Typography className="coupon-reward-type-typo">{lev2CatNameRew || 'NA'}</Typography>
                      </div>
                      <div className="coupon-reward-flex-div">
                        <Typography className="coupon-reward-type-typo">Brand</Typography>
                        <Typography className="coupon-reward-type-typo">{couponDetails?.brand || 'NA'}</Typography>
                      </div>
                      <div className="coupon-reward-flex-div">
                        <Typography className="coupon-reward-type-typo">Manufacturer</Typography>
                        <Typography className="coupon-reward-type-typo">
                          {couponDetails?.manufacturer || 'NA'}
                        </Typography>
                      </div>
                    </>
                  ) : (
                    'NA'
                  )}
                </SoftBox>
              </Grid>
              <Grid item xs={12} md={8} lg={8}>
                <SoftBox className="coupon-reward-type-box-1">
                  <Typography className="single-journey-title-1">Discount Details</Typography>
                  <Grid container spacing={3}>
                    {couponDetails?.rewardingDiscountType !== 'NONE' && (
                      <Grid item xs={12} md={6} lg={6}>
                        <>
                          <Typography className="single-journey-title-1">Discount</Typography>
                          <div className="coupon-reward-flex-div">
                            <Typography className="coupon-reward-type-typo">Discount Type</Typography>
                            <Typography className="coupon-reward-type-typo">
                              {couponDetails?.rewardingDiscountType || 'NA'}
                            </Typography>
                          </div>
                          <div className="coupon-reward-flex-div">
                            <Typography className="coupon-reward-type-typo">Discount Value</Typography>
                            <Typography className="coupon-reward-type-typo">
                              {couponDetails?.rewardingDiscountType === 'PERCENTAGE' ? '' : '₹'}{' '}
                              {couponDetails?.rewardingDiscountValue || 'NA'}{' '}
                              {couponDetails?.rewardingDiscountType === 'PERCENTAGE' ? '%' : ''}
                            </Typography>
                          </div>
                          {couponDetails?.rewardingDiscountType === 'PERCENTAGE' && (
                            <div className="coupon-reward-flex-div">
                              <Typography className="coupon-reward-type-typo">Discount Upto</Typography>
                              <Typography className="coupon-reward-type-typo">
                                ₹{couponDetails?.rewardingDiscountUpto || 'NA'}{' '}
                              </Typography>
                            </div>
                          )}
                        </>
                      </Grid>
                    )}
                    {couponDetails?.freebieItemRewardList && (
                      <Grid item xs={12} md={12} lg={6}>
                        {couponDetails?.freebieItemRewardList &&
                          couponDetails?.freebieItemRewardList.map((item, i) => {
                            return (
                              <>
                                <Typography className="single-journey-title-1">Freebie</Typography>
                                <div className="coupon-reward-flex-div">
                                  <Typography className="coupon-reward-type-typo">Product Name</Typography>
                                  <Typography className="coupon-reward-type-typo">
                                    {productNames[item.itemCode]}
                                  </Typography>
                                </div>
                                <div className="coupon-reward-flex-div">
                                  <Typography className="coupon-reward-type-typo">Barcode</Typography>
                                  <Typography
                                    className="coupon-reward-type-typo"
                                    onClick={() => handleProductNavigation(item?.itemCode)}
                                  >
                                    <a>{item?.itemCode}</a>
                                  </Typography>
                                </div>
                                <div className="coupon-reward-flex-div">
                                  <Typography className="coupon-reward-type-typo">Quantity</Typography>
                                  <Typography className="coupon-reward-type-typo">{item?.quantity}</Typography>
                                </div>
                                <div className="coupon-reward-flex-div">
                                  <Typography className="coupon-reward-type-typo">Discount Type</Typography>
                                  <Typography className="coupon-reward-type-typo">
                                    {item?.discountType || 'NA'}
                                  </Typography>
                                </div>
                                <div className="coupon-reward-flex-div">
                                  <Typography className="coupon-reward-type-typo">Discount Value</Typography>
                                  <Typography className="coupon-reward-type-typo">
                                    {item?.discountType === 'PERCANTAGE' ? '' : '₹'} {item?.discountValue || 'NA'}{' '}
                                    {item?.discountType === 'PERCANTAGE' ? '%' : ''}
                                  </Typography>
                                </div>
                                {item?.discountType === 'PERCANTAGE' && (
                                  <div className="coupon-reward-flex-div">
                                    <Typography className="coupon-reward-type-typo">Discount Upto</Typography>
                                    <Typography className="coupon-reward-type-typo">
                                      ₹{item?.discountUpto || 'NA'}{' '}
                                    </Typography>
                                  </div>
                                )}
                              </>
                            );
                          })}
                      </Grid>
                    )}
                  </Grid>
                </SoftBox>
              </Grid>
            </Grid>
          </SoftBox>
        </Box>
      </DashboardLayout>
    </div>
  );
};

export default SingleDynamicDetails;
