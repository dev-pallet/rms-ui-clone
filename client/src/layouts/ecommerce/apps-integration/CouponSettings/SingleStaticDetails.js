import { Box, Button, Grid, Menu, MenuItem, Tooltip, Typography } from '@mui/material';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import { dateFormatter, productIdByBarcode } from '../../Common/CommonFunction';
import {
  getCatLevel1ById,
  getCatLevel2ById,
  getMainCatById,
  getProductDetails,
  staticCouponSingle,
  updateCouponStatus,
} from '../../../../config/Services';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from '../../../../hooks/SnackbarProvider';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import React, { useEffect, useState } from 'react';
import SoftBox from '../../../../components/SoftBox';
import Status from '../../Common/Status';

const SingleStaticDetails = () => {
  const { id } = useParams();
  const showSnackbar = useSnackbar();
  const navigate = useNavigate();

  const [couponDetails, setCouponDetails] = useState([]);
  const [loader, setLoader] = useState(false);
  const [productNames, setProductNames] = useState({});
  const [name, setName] = useState('');
  const [mainCat, setMainCat] = useState('');
  const [catLevel1, setCatLevel1] = useState('');
  const [catLevel2, setCatLevel2] = useState('');

  const [anchorMarkupEl, setAnchorMarkupEl] = useState(null);
  const markUpOpen = Boolean(anchorMarkupEl);

  const getCouponDetails = () => {
    setLoader(true);
    staticCouponSingle(id)
      .then((res) => {
        setLoader(false);
        if (res?.data?.data?.es) {
          showSnackbar(res?.data?.data?.message || 'Some error occured', 'error');
          return;
        }
        const response = res?.data?.data?.coupon;
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
      couponId: id,
      couponStatus: status,
      updatedBy: uidx,
    };
    updateCouponStatus(payload)
      .then((res) => {
        showSnackbar('Updated the status', 'success');
        getCouponDetails();
      })
      .catch((err) => {
        showSnackbar('Failed to Update the status', 'error');
      });
  };

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

  const fetchData1 = async () => {
    const names = {};
    await Promise.all(
      (couponDetails?.freebieItemList ?? []).map(async (item) => {
        const name = await getNameOfProduct(item.itemCode);
        names[item.itemCode] = name;
      }),
    );
    setProductNames(names);
  };

  const fetchData2 = async () => {
    let name = '';
    await Promise.all(
      (couponDetails?.couponItemList ?? []).map(async (item) => {
        name = await getNameOfProduct(item.itemCode);
      }),
    );
    setName(name);
  };

  useEffect(() => {
    {
      couponDetails?.freebieItemList &&
        couponDetails?.freebieItemList.map((item) => {
          if (item.itemCode !== '') {
            fetchData1();
          }
        });
    }
    {
      couponDetails?.couponItemList &&
        couponDetails?.couponItemList.map((item) => {
          if (item.itemCode !== '') {
            fetchData2();
          }
        });
    }
    if (couponDetails?.applicableProductType?.length !== 0) {
      getMainCatName();
    }
    if (couponDetails?.applicableCategory1?.length !== 0) {
      getLevel1CatName();
    }
    if (couponDetails?.applicableCategory2?.length !== 0) {
      getLevel2CatName();
    }
  }, [couponDetails]);

  const getMainCatName = () => {
    const cat1 = couponDetails?.applicableProductType;
    if (cat1) {
      getMainCatById(cat1).then((res) => {
        const catArr = res?.data?.data;
        setMainCat(catArr[0]?.categoryName);
      });
    }
  };

  const getLevel1CatName = () => {
    const cat1 = couponDetails?.applicableCategory1;
    if (cat1) {
      getCatLevel1ById(cat1).then((res) => {
        const catArr = res?.data?.data;
        setCatLevel1(catArr[0]?.categoryName);
      });
    }
  };

  const getLevel2CatName = () => {
    const cat1 = couponDetails?.applicableCategory2;
    if (cat1) {
      getCatLevel2ById(cat1).then((res) => {
        const catArr = res?.data?.data;
        setCatLevel2(catArr[0]?.categoryName);
      });
    }
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
            <Typography className="single-journey-title-1">Coupon Redeeming Conditions</Typography>
          </div>
          <SoftBox my={3}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4} lg={4}>
                <SoftBox className="coupon-reward-type-box">
                  <Typography className="single-journey-title-1">Coupon Type</Typography>
                  <Typography className="coupon-reward-type-typo">{couponDetails?.couponType || 'NA'}</Typography>
                </SoftBox>
              </Grid>
              <Grid item xs={12} md={4} lg={4}>
                <SoftBox className="coupon-reward-type-box">
                  <Typography className="single-journey-title-1">Discount Type</Typography>
                  <Typography className="coupon-reward-type-typo">
                    {couponDetails?.discountType !== 'NONE' ? 'Discount' : ''}
                    {couponDetails?.freebieItemList &&
                      couponDetails?.freebieItemList.map((item) => {
                        return <>{item.itemCode !== '' ? ', Freebie' : ''}</>;
                      })}
                  </Typography>
                </SoftBox>
              </Grid>
              <Grid item xs={12} md={4} lg={4}>
                <SoftBox className="coupon-reward-type-box">
                  <Typography className="single-journey-title-1">Coupon Code</Typography>
                  <Typography className="coupon-reward-type-typo">{couponDetails?.couponCode || 'NA'}</Typography>
                </SoftBox>
              </Grid>
            </Grid>
          </SoftBox>
          <SoftBox my={3}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4} lg={4}>
                <SoftBox className="coupon-reward-type-box-1">
                  <Typography className="single-journey-title-1">Coupon Type Details</Typography>
                  {couponDetails?.couponItemList && couponDetails?.couponItemList[0]?.itemCode !== '' ? (
                    <>
                      {couponDetails?.couponItemList.map((item, i) => {
                        return (
                          <>
                            <div className="coupon-reward-flex-div">
                              <Typography className="coupon-reward-type-typo">Product Name</Typography>

                              <Typography className="coupon-reward-type-typo">{name}</Typography>
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
                  ) : couponDetails?.couponType === 'CART_VALUE' ? (
                    <>
                      <div className="coupon-reward-flex-div">
                        <Typography className="coupon-reward-type-typo">Minimum Cart Value</Typography>
                        <Typography className="coupon-reward-type-typo">
                          ₹{couponDetails?.minOrderValue || 'NA'}
                        </Typography>
                      </div>
                    </>
                  ) : couponDetails?.applicableProductType && couponDetails?.applicableProductType.length !== 0 ? (
                    <>
                      <div className="coupon-reward-flex-div">
                        <Typography className="coupon-reward-type-typo">Main Category</Typography>
                        <Typography className="coupon-reward-type-typo">{mainCat || 'NA'}</Typography>
                      </div>
                      <div className="coupon-reward-flex-div">
                        <Typography className="coupon-reward-type-typo">Category Level 1</Typography>
                        <Typography className="coupon-reward-type-typo">{catLevel1 || 'NA'}</Typography>
                      </div>
                      <div className="coupon-reward-flex-div">
                        <Typography className="coupon-reward-type-typo">Category Level 2</Typography>
                        <Typography className="coupon-reward-type-typo">{catLevel2 || 'NA'}</Typography>
                      </div>
                    </>
                  ) : couponDetails?.applicableBrand && couponDetails?.applicableBrand.length !== 0 ? (
                    <>
                      <div className="coupon-reward-flex-div">
                        <Typography className="coupon-reward-type-typo">Main Category</Typography>
                        <Typography className="coupon-reward-type-typo">{mainCat || 'NA'}</Typography>
                      </div>
                      <div className="coupon-reward-flex-div">
                        <Typography className="coupon-reward-type-typo">Category Level 1</Typography>
                        <Typography className="coupon-reward-type-typo">{catLevel1 || 'NA'}</Typography>
                      </div>
                      <div className="coupon-reward-flex-div">
                        <Typography className="coupon-reward-type-typo">Category Level 2</Typography>
                        <Typography className="coupon-reward-type-typo">{catLevel2 || 'NA'}</Typography>
                      </div>
                      <div className="coupon-reward-flex-div">
                        <Typography className="coupon-reward-type-typo">Brand</Typography>
                        <Typography className="coupon-reward-type-typo">
                          {couponDetails?.applicableBrand || 'NA'}
                        </Typography>
                      </div>
                    </>
                  ) : couponDetails?.applicableManufacturer && couponDetails?.applicableManufacturer.length !== 0 ? (
                    <>
                      <div className="coupon-reward-flex-div">
                        <Typography className="coupon-reward-type-typo">Main Category</Typography>
                        <Typography className="coupon-reward-type-typo">{mainCat || 'NA'}</Typography>
                      </div>
                      <div className="coupon-reward-flex-div">
                        <Typography className="coupon-reward-type-typo">Category Level 1</Typography>
                        <Typography className="coupon-reward-type-typo">{catLevel1 || 'NA'}</Typography>
                      </div>
                      <div className="coupon-reward-flex-div">
                        <Typography className="coupon-reward-type-typo">Category Level 2</Typography>
                        <Typography className="coupon-reward-type-typo">{catLevel2 || 'NA'}</Typography>
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
                  ) : (
                    'NA'
                  )}
                </SoftBox>
              </Grid>
              <Grid item xs={12} md={8} lg={8}>
                <SoftBox className="coupon-reward-type-box-1">
                  <Typography className="single-journey-title-1">Discount Details</Typography>
                  <Grid container spacing={3}>
                    {couponDetails?.discountType !== 'NONE' && (
                      <Grid item xs={12} md={6} lg={6}>
                        <>
                          <Typography className="single-journey-title-1">Discount</Typography>
                          <div className="coupon-reward-flex-div">
                            <Typography className="coupon-reward-type-typo">Discount Type</Typography>
                            <Typography className="coupon-reward-type-typo">
                              {couponDetails?.discountType || 'NA'}
                            </Typography>
                          </div>
                          <div className="coupon-reward-flex-div">
                            <Typography className="coupon-reward-type-typo">Discount Value</Typography>
                            <Typography className="coupon-reward-type-typo">
                              {couponDetails?.discountType === 'PERCENTAGE' ? '' : '₹'}{' '}
                              {couponDetails?.discountValue || 'NA'}{' '}
                              {couponDetails?.discountType === 'PERCENTAGE' ? '%' : ''}
                            </Typography>
                          </div>
                          {couponDetails?.discountType === 'PERCENTAGE' && (
                            <div className="coupon-reward-flex-div">
                              <Typography className="coupon-reward-type-typo">Discount Upto</Typography>
                              <Typography className="coupon-reward-type-typo">
                                ₹{couponDetails?.discountUpto || 'NA'}{' '}
                              </Typography>
                            </div>
                          )}
                        </>
                      </Grid>
                    )}
                    {couponDetails?.freebieItemList && (
                      <Grid item xs={12} md={12} lg={6}>
                        {couponDetails?.freebieItemList &&
                          couponDetails?.freebieItemList.map((item, i) => {
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
          <SoftBox my={3}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4} lg={4}>
                <SoftBox className="coupon-reward-type-box">
                  <Typography className="single-journey-title-1">Terms and conditions</Typography>
                  <Typography className="coupon-reward-type-typo">
                    {couponDetails?.termsAndConditions || 'NA'}
                  </Typography>
                </SoftBox>
              </Grid>
              <Grid item xs={12} md={8} lg={8}>
                <SoftBox className="coupon-reward-type-box">
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={4} lg={4}>
                      <div className="terms-conditions-box">
                        <Typography className="single-journey-title-1">Minimum Cart Value</Typography>
                        <Typography className="coupon-reward-type-typo">
                          ₹{couponDetails?.minOrderValue || 'NA'}
                        </Typography>
                      </div>
                    </Grid>
                    <Grid item xs={12} md={4} lg={4}>
                      <div className="terms-conditions-box">
                        <Typography className="single-journey-title-1">Max Usage Per User</Typography>
                        <Typography className="coupon-reward-type-typo">
                          {couponDetails?.maxUsagePerUser || 'NA'}
                        </Typography>
                      </div>
                    </Grid>
                    <Grid item xs={12} md={4} lg={4}>
                      <div className="terms-conditions-box">
                        <Typography className="single-journey-title-1">Locations</Typography>
                        <Typography className="coupon-reward-type-typo">
                          {couponDetails?.applicableLocation || 'NA'}
                        </Typography>
                      </div>
                    </Grid>
                  </Grid>

                  <Grid container spacing={3} mt={1}>
                    <Grid item xs={12} md={4} lg={4}>
                      <div className="terms-conditions-box">
                        <Typography className="single-journey-title-1">Maximum Budget</Typography>
                        <Typography className="coupon-reward-type-typo">₹{couponDetails?.budget || 'NA'}</Typography>
                      </div>
                    </Grid>
                    <Grid item xs={12} md={4} lg={4}>
                      <div className="terms-conditions-box">
                        <Typography className="single-journey-title-1">Total Coupons</Typography>
                        <Typography className="coupon-reward-type-typo">
                          ₹{couponDetails?.maxTotalUsage || 'NA'}
                        </Typography>
                      </div>
                    </Grid>
                    <Grid item xs={12} md={4} lg={4}>
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

                  <Grid container spacing={3} mt={1}>
                    <Grid item xs={12} md={6} lg={6}>
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
                    <Grid item xs={12} md={6} lg={6}>
                      <div className="terms-conditions-box">
                        <Typography className="single-journey-title-1">Sales Channel</Typography>
                        <Typography className="coupon-reward-type-typo"></Typography>
                      </div>
                    </Grid>
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

export default SingleStaticDetails;
