import { Box, Grid, Modal } from '@mui/material';
import { buttonStyles } from '../../../../Common/buttonColor';
import { getAllOrdersListV2, salesPaymentRequest } from '../../../../../../config/Services';
import { useSnackbar } from '../../../../../../hooks/SnackbarProvider';
import FormField from '../../../../purchase-bills/components/FormField';
import React, { useState } from 'react';
import SoftBox from '../../../../../../components/SoftBox';
import SoftButton from '../../../../../../components/SoftButton';
import SoftSelect from '../../../../../../components/SoftSelect';
import SoftTypography from '../../../../../../components/SoftTypography';
import Spinner from '../../../../../../components/Spinner';

const InvoicePaymentModal = ({ openPaymentModal, handleClosePaymentModal, allOrderList }) => {
  const showSnackbar = useSnackbar();
  const locId = localStorage.getItem('locId');
  const [submitloader, setSubmitloader] = useState(false);
  const [verifyloader, setVerifyloader] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paidAmount, setPaidAmount] = useState(0);
  const [amountToPay, setAmountToPay] = useState('');

  const handleVerifyOrder = () => {
    setVerifyloader(true);
    const filterObject = {
      destinationLocationId: [locId],
      searchBox: orderId,
      page: 0,
      pageSize: 10,
    };
    getAllOrdersListV2(filterObject)
      .then((res) => {
        setVerifyloader(false);
        const response = res?.data?.data?.orderResponseList;
        if (response?.length === 1) {
          showSnackbar('Order Verified', 'success');
          if (response[0]?.baseOrderResponse?.paymentStatus === 'COMPLETED') {
            showSnackbar('Payment process has been completed', 'error');
            return;
          }
          setOrderId(response[0]?.baseOrderResponse?.orderId);
          setAmountToPay(response[0]?.orderBillingDetails?.grandTotal);
          setPaidAmount(response[0]?.orderBillingDetails?.grandTotal);
          setIsVerified(true);
        } else {
          showSnackbar('No Orders Found', 'error');
          setIsVerified(false);
        }
      })
      .catch((err) => {
        showSnackbar(err?.response?.data?.message || 'No Orders Found', 'error');
        setVerifyloader(false);
      });
  };

  const handlePayment = () => {
    if (paymentMethod === '') {
      showSnackbar('Select payment method', 'warning');
    } else if (paidAmount === 0) {
      showSnackbar('Enter amount', 'warning');
    } else {
      const payload = {
        referenceId: orderId,
        paymentMethod: paymentMethod,
        paymentMode: 'OFFLINE',
        amountPaid: paidAmount,
        paymentStatus: 'COMPLETED',
        paymentType: 'MANUAL',
      };
      setSubmitloader(true);
      salesPaymentRequest(payload)
        .then((res) => {
          setSubmitloader(false);
          showSnackbar(res?.data?.data?.message, 'success');
          allOrderList();
          handleClosePaymentModal();
        })
        .catch((err) => {
          setSubmitloader(false);
          showSnackbar(err?.response?.data?.message, 'error');
        });
    }
  };

  return (
    <Modal
      open={openPaymentModal}
      onClose={handleClosePaymentModal}
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
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          overflow: 'auto',
          maxHeight: '80vh',
        }}
      >
        <Grid container spacing={1} p={1}>
          <Grid item xs={12} md={12} xl={12} display="flex" gap="5px">
            <SoftBox>
              <FormField
                type="text"
                label="Order No."
                placeholder="eg:#1234"
                onChange={(e) => setOrderId(e.target.value)}
                value={orderId}
              />
            </SoftBox>

            <SoftBox className="verifed-box-bil">
              {verifyloader ? (
                <Spinner size={20} />
              ) : (
                <SoftButton
                  variant={buttonStyles.primaryVariant}
                  className="contained-softbutton"
                  onClick={handleVerifyOrder}
                  disabled={isVerified || orderId === '' ? true : false}
                >
                  Verify
                </SoftButton>
              )}
            </SoftBox>
          </Grid>
          {isVerified && (
            <Grid item xs={12} md={12}>
              <FormField type="number" label="Amount to be paid" value={amountToPay} disabled />
            </Grid>
          )}

          <Grid item xs={12} md={12}>
            <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
              <SoftTypography
                component="label"
                variant="caption"
                fontWeight="bold"
                textTransform="capitalize"
                fontSize="13px"
              >
                Payment Method
              </SoftTypography>
            </SoftBox>
            <SoftSelect
              options={[
                { value: 'CASH', label: 'Cash' },
                { value: 'CHEQUE', label: 'Cheque' },
                { value: 'BANK TRNASFER', label: 'Bank Transfer' },
                { value: 'CREDIT CARD', label: 'Credit card' },
                { value: 'DEBIT CARD', label: 'Debit card' },
              ]}
              onChange={(e) => setPaymentMethod(e.value)}
            />
          </Grid>

          <Grid item xs={12} md={12}>
            <FormField
              type="number"
              label="Amount"
              placeholder="Rs."
              value={paidAmount}
              onChange={(e) => setPaidAmount(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <SoftBox className="header-submit-box">
              <SoftButton className="vendor-second-btn" onClick={handleClosePaymentModal}>
                Cancel
              </SoftButton>
              {submitloader ? (
                <Spinner size={20} />
              ) : (
                <SoftButton className="vendor-add-btn" disabled={isVerified ? false : true} onClick={handlePayment}>
                  Save
                </SoftButton>
              )}
            </SoftBox>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default InvoicePaymentModal;
