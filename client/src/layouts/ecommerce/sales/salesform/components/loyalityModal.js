import { Box, Grid, Modal } from '@mui/material';
import { isSmallScreen } from '../../../Common/CommonFunction';
import { redeemLoyality } from '../../../../../config/Services';
import { useSnackbar } from '../../../../../hooks/SnackbarProvider';
import MobileDrawerCommon from '../../../Common/MobileDrawer';
import React, { useEffect, useState } from 'react';
import SoftBox from '../../../../../components/SoftBox';
import SoftButton from '../../../../../components/SoftButton';
import SoftTypography from '../../../../../components/SoftTypography';

const SalesLoyalityModal = ({
  openLoyalityModal,
  setOpenLoyalityModal,
  loyalityMessage,
  loyalityData,
  cartId,
  cartDetails,
}) => {
  const showSnackbar = useSnackbar();
  const [message, setMessage] = useState('');
  const [data, setData] = useState('');
  const isMobileDevice = isSmallScreen();

  useEffect(() => {
    setMessage(loyalityMessage);
    setData(loyalityData);
  }, [loyalityData, loyalityMessage]);

  const handleClose = () => {
    setOpenLoyalityModal(false);
  };

  const handleRedeem = () => {
    const payload = {
      currencyCode: data?.data?.currencyCode,
      redeemablePoint: data?.data?.redeemablePoint,
      redeemablePointValue: data?.data?.redeemablePointValue,
      totalAvailablePoint: data?.data?.totalAvailablePoint,
      availablePointValue: data?.data?.availablePointValue,
    };
    redeemLoyality(cartId, payload)
      .then((res) => {
        handleClose();
        cartDetails();
        showSnackbar('Loyality Redeemed', 'success');
      })
      .catch((err) => {
        showSnackbar(err?.response?.data?.message || 'Some error occured', 'error');
      });
  };

  return (
    <>
      {!isMobileDevice ? (
        <Modal
          open={openLoyalityModal}
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
                  <SoftBox mb={1} lineHeight={0} display="flex" flexDirection="column" gap="20">
                    {data?.data === null ? (
                      <SoftTypography color="error" fontSize="16px">
                        {message}
                      </SoftTypography>
                    ) : (
                      <>
                        <SoftTypography fontSize="14px">
                          <b>Currency Code </b>: {data?.data?.currencyCode}
                        </SoftTypography>
                        <SoftTypography fontSize="14px">
                          <b> Redeemable Point </b>: {data?.data?.redeemablePoint}
                        </SoftTypography>
                        <SoftTypography fontSize="14px">
                          <b>Redeemable Point Value</b> : {data?.data?.redeemablePointValue}
                        </SoftTypography>
                        <SoftTypography fontSize="14px">
                          <b> Total Available Point </b>: {data?.data?.totalAvailablePoint}
                        </SoftTypography>
                        <SoftTypography color="error" fontSize="16px">
                          {data?.data?.notRedeemableReason}
                        </SoftTypography>
                      </>
                    )}
                    <SoftBox
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      style={{ marginTop: '10px' }}
                    >
                      <SoftButton onClick={handleClose}> Cancel</SoftButton>
                      <SoftButton
                        disabled={data?.data?.redeemable ? false : true}
                        color={data?.data?.redeemable ? 'success' : 'info'}
                        onClick={handleRedeem}
                      >
                        {' '}
                        Redeem
                      </SoftButton>
                    </SoftBox>
                  </SoftBox>
                </SoftBox>
              </Grid>
            </Grid>
          </Box>
        </Modal>
      ) : (
        <MobileDrawerCommon
          anchor="bottom"
          drawerOpen={openLoyalityModal}
          drawerClose={handleClose}
          paperProps={{
            maxWidth: 'none !important',
            height: 'auto  !important',
            width: '100%  !important',
            margin: '0px',
            borderRadius: '10px 10px 0 0 !important',
            /* overflow: hidden, */
            backgroundColor: 'transparent !important',
            backdropFilter: 'none !important',
            boxShadow: 'none !important',
            maxHeight: '90%',
          }}
        >
          <SoftBox className="loyalty-drawer-main-div">
            <SoftBox mb={1} lineHeight={0} display="flex" flexDirection="column" gap="20" p={1}>
              {data?.data === null ? (
                <SoftTypography color="error" fontSize="16px" className="sales-loyalty-message">
                  {message}
                </SoftTypography>
              ) : (
                <>
                  <SoftTypography fontSize="14px">
                    <b>Currency Code </b>: {data?.data?.currencyCode}
                  </SoftTypography>
                  <SoftTypography fontSize="14px">
                    <b> Redeemable Point </b>: {data?.data?.redeemablePoint}
                  </SoftTypography>
                  <SoftTypography fontSize="14px">
                    <b>Redeemable Point Value</b> : {data?.data?.redeemablePointValue}
                  </SoftTypography>
                  <SoftTypography fontSize="14px">
                    <b> Total Available Point </b>: {data?.data?.totalAvailablePoint}
                  </SoftTypography>
                  <SoftTypography color="error" fontSize="16px" sx={{ whiteSpace: 'normal' }}>
                    {data?.data?.notRedeemableReason}
                  </SoftTypography>
                </>
              )}
              <SoftBox
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                gap="10px"
                style={{ marginTop: '10px' }}
              >
                <SoftButton onClick={handleClose} sx={{ flex: '1' }}>
                  {' '}
                  Cancel
                </SoftButton>
                <SoftButton
                  disabled={data?.data?.redeemable ? false : true}
                  color={data?.data?.redeemable ? 'success' : 'info'}
                  onClick={handleRedeem}
                  sx={{ flex: '1' }}
                >
                  {' '}
                  Redeem
                </SoftButton>
              </SoftBox>
            </SoftBox>
          </SoftBox>
        </MobileDrawerCommon>
      )}
    </>
  );
};

export default SalesLoyalityModal;
