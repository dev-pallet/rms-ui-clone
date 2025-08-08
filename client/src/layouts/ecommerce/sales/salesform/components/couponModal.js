import { Box, Grid, Modal } from '@mui/material';
import { applyCoupon } from '../../../../../config/Services';
import { isSmallScreen } from '../../../Common/CommonFunction';
import { useSnackbar } from '../../../../../hooks/SnackbarProvider';
import CouponCard from './couponModalCard';
import Drawer from '@mui/material/Drawer';
import MobileDrawerCommon from '../../../Common/MobileDrawer';
import React, { useState } from 'react';
import SoftBox from '../../../../../components/SoftBox';
import SoftButton from '../../../../../components/SoftButton';
import SoftTypography from '../../../../../components/SoftTypography';

const SalesCouponModal = ({
  openCouponModal,
  setOpenCouponModal,
  allCouponList,
  cartId,
  couponData,
  setCouponData,
  cartDetails,
}) => {
  const showSnackbar = useSnackbar();
  const [loader, setLoader] = useState(false);
  const isMobileDevice = isSmallScreen();

  const handleClose = () => {
    setOpenCouponModal(false);
  };
  const handleApplyCoupon = (item) => {
    setLoader(true);
    const payload = {
      couponId: item?.couponId,
      couponCode: item?.couponCode,
      cartId: cartId,
    };
    applyCoupon(payload)
      .then((res) => {
        setLoader(false);
        setCouponData(couponData);
        cartDetails();
        handleClose();
        showSnackbar('Coupon Applied Successfully', 'success');
      })
      .catch((err) => {
        setLoader(false);
        showSnackbar(err?.response?.data?.message || 'Some error occured', 'error');
      });
  };

  const colorsArray = ['#0562fb', '#ff0000b5', 'skyblue', 'lightgreen'];

  return (
    <>
      {!isMobileDevice ? (
        <Modal
          open={openCouponModal}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          className="modal-pi-border"
        >
          <Box
            className="pi-box-inventory"
            sx={{
              position: 'absolute',
              top: '35%',
              left: '50%',
              width: '60vh',
              transform: 'translate(-50%, -50%)',
              bgcolor: 'background.paper',
              boxShadow: 24,
              overflow: 'auto',
              maxHeight: '80vh',
            }}
          >
            <Grid container spacing={1} p={1}>
              <Grid item xs={12} md={12}>
                <SoftBox mb={1} lineHeight={0}>
                  {allCouponList?.map((item) => {
                    return (
                      <SoftBox
                        mb={1}
                        lineHeight={0}
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        gap="20"
                        style={{ padding: '10px', borderRadius: '5px', boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px' }}
                      >
                        <SoftBox>
                          <img src={item?.image} alt="" style={{ width: '100px', height: '100px' }} />
                        </SoftBox>
                        <SoftBox display="flex" flexDirection="column" gap="20">
                          <SoftTypography fontSize="14px">
                            <b> Offer Name </b>: {item?.offerName}
                          </SoftTypography>
                          <SoftTypography fontSize="14px">
                            <b>Cuopon Code </b>: {item?.couponCode}
                          </SoftTypography>
                          <SoftTypography fontSize="14px">
                            <b>Minimum Order Value</b> : {item?.minOrderValue}
                          </SoftTypography>
                          <SoftTypography fontSize="14px">
                            <b> Discount Value </b>: {item?.discountValue}
                          </SoftTypography>
                          <SoftBox display="flex" justifyContent="space-between" alignItems="flex-end">
                            {couponData?.cartCouponId === item?.couponId ? (
                              <>
                                <SoftBox></SoftBox>
                                <SoftButton color="success" onClick={() => handleApplyCoupon(item)}>
                                  {' '}
                                  Applied
                                </SoftButton>
                              </>
                            ) : (
                              <>
                                <SoftBox></SoftBox>
                                <SoftButton color="info" onClick={() => handleApplyCoupon(item)} disabled={loader}>
                                  {' '}
                                  Apply
                                </SoftButton>
                              </>
                            )}
                          </SoftBox>
                        </SoftBox>
                        <Drawer />
                      </SoftBox>
                    );
                  })}
                </SoftBox>
              </Grid>
            </Grid>
          </Box>
        </Modal>
      ) : (
        <MobileDrawerCommon
          anchor="bottom"
          drawerOpen={openCouponModal}
          drawerClose={handleClose}
          paperProps={{
            maxWidth: 'none !important',
            height: 'auto  !important',
            maxHeight: '90%',
          }}
        >
          <SoftBox className="coupon-drawer-main-div">
            {allCouponList?.map((item) => {
              return (
                <CouponCard
                  data={item}
                  handleApplyCoupon={handleApplyCoupon}
                  color={colorsArray[Math.floor(Math.random() * 3 + 1)]}
                  couponData={couponData}
                />
              );
            })}
          </SoftBox>
        </MobileDrawerCommon>
      )}
    </>
  );
};

export default SalesCouponModal;
