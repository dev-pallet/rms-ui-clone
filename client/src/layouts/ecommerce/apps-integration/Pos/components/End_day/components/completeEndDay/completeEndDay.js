import './completeEndDay.css';
import { Box, Button, Grid } from '@mui/material';
import { closeSession, getSessionDetailsForSession } from './../../../../../../../../config/Services';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import DashboardLayout from '../../../../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../../../../examples/Navbars/DashboardNavbar';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import SoapIcon from '@mui/icons-material/Soap';
import SoftSelect from '../../../../../../../../components/SoftSelect';
import Spinner from '../../../../../../../../components/Spinner';

export const Closing = () => {
  // const retailUserDetails = JSON.parse(localStorage.getItem("retailUserDetails"));
  // const firstName = retailUserDetails.firstName;
  // const secondName = retailUserDetails.secondName;
  const [open, setOpen] = useState(false);
  const diffAmount = '1000';
  const [changeValue, setChangeValue] = useState('');
  const dispatch = useDispatch();
  const [sessionSummary, setSessionSummary] = useState(null);
  const [comment, setComment] = useState('');
  const [commentI, setCommentI] = useState('');
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { sessionId, licenseId } = useParams();
  const locId = localStorage.getItem('locId');
  const uidx = JSON.parse(localStorage.getItem('user_details')).uidx;
  const [isLoading, setIsLoading] = useState(false);

  const reasonsArr = [
    { value: 'Incorrect change paid', label: 'Incorrect change paid' },
    {
      value: 'Overpaid to customer due to insufficient change',
      label: 'Overpaid to customer due to insufficient change',
    },
    { value: 'Customer insufficent funds', label: 'Customer insufficent funds' },
    { value: 'others', label: 'others' },
  ];

  const handleStart = () => {
    const payload = {
      sessionId: sessionId,
      updatedBy: uidx,
      closingBalance: changeValue,
      reason: comment.value,
    };
    setIsLoading(true);
    closeSession(payload)
      .then((response) => {
        setIsLoading(false);
        navigate('/sales_channels/pos/terminals');
      })
      .catch((err) => {
        setIsLoading(false);
      });
  };

  const handleCancel = () => {
    navigate('/sales_channels/pos/terminals');
  };

  useEffect(() => {
    getSessionDetailsForSession(locId, licenseId, sessionId).then((res) => {
      setSessionSummary(res?.data?.data?.sessionData?.sessionSalesData);
    });
  }, []);

  const handleValueChange = (e) => {
    if (e.target.value === 'others') {
      setCommentI(e.target.value);
    } else {
      setComment(e.value);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Box className="current-session-wrapper-box">
        <h4 className="heading-wrapper-text-I">End Session</h4>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12} xl={3}>
            <Box className="close-session-wrapper-container">
              <SoapIcon />
              <h4 className="close-session-head">Total Orders</h4>
              <h2 className="close-session-val"> {sessionSummary?.totalOrders || 0}</h2>
              <h4 className="close-session-head">Total orders value</h4>
              <h2 className="close-session-val">
                {'\u20b9'} {sessionSummary?.totalOrdersValue || 0}
              </h2>
            </Box>
          </Grid>

          <Grid item xs={12} md={12} xl={3}>
            <Box className="close-session-wrapper-container">
              <CreditScoreIcon />
              <h4 className="close-session-head">Credit Note</h4>
              <h2 className="close-session-val">{sessionSummary?.creditNoteOrders || 0}</h2>
              <h4 className="close-session-head">Credit note value</h4>
              <h2 className="close-session-val">
                {'\u20b9'} {sessionSummary?.creditNoteValue || 0}
              </h2>
            </Box>
          </Grid>

          <Grid item xs={12} md={12} xl={3}>
            <Box className="close-session-wrapper-container">
              <CurrencyExchangeIcon />
              <h4 className="close-session-head">Actual Orders</h4>
              <h2 className="close-session-val">{sessionSummary?.actualOrders || 0}</h2>
              <h4 className="close-session-head">Actual orders value</h4>
              <h2 className="close-session-val">
                {'\u20b9'} {sessionSummary?.actualOrderValue || 0}
              </h2>
            </Box>
          </Grid>

          <Grid item xs={12} md={12} xl={3}>
            <Box className="close-session-wrapper-container">
              <LocalAtmIcon />
              <h4 className="close-session-head">Session cash advance</h4>
              <h2 className="close-session-val">
                {'\u20b9'} {sessionSummary?.sessionCashAdvance || 0}
              </h2>
            </Box>
          </Grid>
        </Grid>

        <h3 className="heading-wrapper-text">Payment channels against actual orders</h3>
        <div className="actual-wrapper">
          <div className="actual-wrapper-inner-box">
            <h3 className="row-wrapper-text close-session-head">Cash</h3>
            <h2 className="row-wrapper-text close-session-val">
              {'\u20b9'} {sessionSummary?.cashOrdersValue || 0}
            </h2>
          </div>
          <div className="actual-wrapper-inner-box">
            <h3 className="row-wrapper-text close-session-head">UPI</h3>
            <h2 className="row-wrapper-text close-session-val">
              {'\u20b9'} {sessionSummary?.upiOrdersValue || 0}
            </h2>
          </div>
          <div className="actual-wrapper-inner-box">
            <h3 className="row-wrapper-text close-session-head">Cards</h3>
            <h2 className="row-wrapper-text close-session-val">
              {'\u20b9'} {sessionSummary?.cardOrdersValue || 0}
            </h2>
          </div>

          <div className="actual-wrapper-inner-box">
            <h3 className="row-wrapper-text close-session-head">Others</h3>
            <h2 className="row-wrapper-text close-session-val">
              {'\u20b9'} {sessionSummary?.otherOrdersValue || 0}
            </h2>
          </div>
        </div>

        <h3 className="heading-wrapper-text">Credit Note vs New order adjustment</h3>

        <Grid container spacing={0}>
          <Grid item xs={12} md={12} xl={6} className="total-sum-wrapper-box">
            <div className="total-sum-wrapper-box-inner">
              <h4 className="close-session-head">Total upi payment recieved</h4>
              <h3 className="row-wrapper-text close-session-val">
                {' '}
                {'\u20b9'} {sessionSummary?.upiOrdersValue || 0}
              </h3>
            </div>
            <div className="total-sum-wrapper-box-inner">
              <h4 className="close-session-head">Total card payment recieved</h4>
              <h3 className="row-wrapper-text close-session-val">
                {' '}
                {'\u20b9'} {sessionSummary?.cardOrdersValue || 0}
              </h3>
            </div>
            <div className="total-sum-wrapper-box-inner">
              <h4 className="close-session-head">Total</h4>
              <h3 className="row-wrapper-text close-session-val">
                {'\u20b9'} {sessionSummary?.cardOrdersValue + sessionSummary?.upiOrdersValue || 0}
              </h3>
            </div>
            <div className="total-sum-wrapper-box-inner">
              <h4 className="close-session-head">Difference against actual orders (Cash refunds)</h4>
              <h3 className="row-wrapper-text close-session-val">
                {'\u20b9'} {sessionSummary?.actualOrderValue || 0}
              </h3>
            </div>
          </Grid>
        </Grid>
        <h3 className="heading-wrapper-text">Cashier settlements</h3>

        <Grid container spacing={0}>
          <Grid item xs={12} md={12} xl={6} className="settlement-wrapper-container-main">
            <div className="settlement-wrapper-container">
              <h4 className="close-session-head">Session cash advance</h4>
              <h3 className="row-wrapper-text close-session-val">
                {'\u20b9'} {sessionSummary?.sessionCashAdvance || 0}
              </h3>
            </div>
            <div className="settlement-wrapper-container">
              <h4 className="close-session-head">
                Cash order value <b>-</b> credit note difference
              </h4>
              <h3 className="row-wrapper-text close-session-val">
                {'\u20b9'} {sessionSummary?.sessionCashAdvance || 0}
              </h3>
            </div>
            <div className="settlement-wrapper-container">
              <h4 className="close-session-head">Total cash</h4>
              <h3 className="row-wrapper-text close-session-val">
                {'\u20b9'} {sessionSummary?.sessionCashAdvance || 0}
              </h3>
            </div>
            <div className="settlement-wrapper-container">
              <h4 className="close-session-head">UPI</h4>
              <h3 className="row-wrapper-text close-session-val">
                {'\u20b9'} {sessionSummary?.upiOrdersValue || 0}
              </h3>
            </div>
            <div className="settlement-wrapper-container">
              <h4 className="close-session-head">Card</h4>
              <h3 className="row-wrapper-text close-session-val">
                {'\u20b9'} {sessionSummary?.cardOrdersValue || 0}
              </h3>
            </div>
            <div className="settlement-wrapper-container">
              <h4 className="close-session-head">Others</h4>
              <h3 className="row-wrapper-text close-session-val ">
                {'\u20b9'} {sessionSummary?.otherOrdersValue || 0}
              </h3>
            </div>
            <div className="settlement-wrapper-container">
              <h4 className="close-session-head">Total</h4>
              <h3 className="row-wrapper-text close-session-val">
                {'\u20b9'} {sessionSummary?.otherOrdersValue || 0}
              </h3>
            </div>
            <div className="settlement-wrapper-container">
              <h4 className="close-session-head">Cash in till</h4>
              {/* <input
                className="order-wrapper-inner-input-box"
                type="number"
                value={changeValue}
                onChange={(e) => setChangeValue(e.target.value)}
              /> */}
              <h3 className="row-wrapper-text close-session-val">
                {'\u20b9'} {sessionSummary?.cashHandOver || -0}
              </h3>
            </div>
            <div className="settlement-wrapper-container">
              <h4 className="close-session-head">Cash recieved</h4>
              <input
                className="order-wrapper-inner-input-box"
                type="number"
                value={changeValue}
                onChange={(e) => setChangeValue(e.target.value)}
              />
            </div>
            <div className="settlement-wrapper-container">
              <h4 className="close-session-head"> Discrepancy Amount</h4>
              <h3 className="row-wrapper-text close-session-val">
                {'\u20b9'} {!changeValue ? 0 : Number(sessionSummary?.cashHandOver) || 0 - Number(changeValue)}
              </h3>
            </div>
          </Grid>
        </Grid>
        {diffAmount === '0' ? null : <h3 className="heading-wrapper-text">Reason for amount discrepancy</h3>}
        {diffAmount === '0' ? null : (
          <Grid container spacing={0}>
            <Grid item xs={12} md={12} xl={6} className="order-wrapper-detail-box">
              <SoftSelect
                className="soft-closing-wrapper-select"
                options={reasonsArr}
                onChange={(e) => setComment(e?.value)}
              />
            </Grid>
            {comment === 'others' ? (
              <Grid item xs={12} md={12} xl={6} className="order-wrapper-detail-box">
                <h5>Comment</h5>
                <input
                  type="text"
                  className="order-wrapper-detail-box-input"
                  onChange={(e) => setCommentI(e.target.value)}
                />
              </Grid>
            ) : null}
          </Grid>
        )}

        <Box mt={2} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>
          <Button className="manager-validate-btn-cancel" onClick={handleCancel}>
            CANCEL
          </Button>
          <Button
            className={!changeValue ? 'manager-validate-btn-disable' : 'manager-validate-btn'}
            onClick={!changeValue ? '' : handleStart}
          >
            {isLoading ? <Spinner /> : 'PROCEED'}
          </Button>
        </Box>
      </Box>
    </DashboardLayout>
  );
};
