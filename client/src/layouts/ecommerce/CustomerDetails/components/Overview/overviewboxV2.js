import { AppBar, Card, Tab, Tabs } from '@mui/material';
import Grid from '@mui/material/Grid';
import SoftBox from 'components/SoftBox';
import SoftTypography from 'components/SoftTypography';
import Footer from 'examples/Footer';
import { BillingDetails } from 'layouts/ecommerce/CustomerDetails/components/Overview/components/billing-details/index';
import PlatformSettings from 'layouts/ecommerce/CustomerDetails/components/Overview/components/overview-platformsettings/index';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import breakpoints from '../../../../../assets/theme/base/breakpoints';
import {
  getCustomerOrdersSummary,
  getCustomerOrderSummaryV2,
  validateAppAndPosUser,
} from '../../../../../config/Services';
import { useSnackbar } from '../../../../../hooks/SnackbarProvider';
import { dateFormatter, formatNumber, isSmallScreen } from '../../../Common/CommonFunction';
import CustomerCoupons from '../Coupons';
import CustomerLoyalty from '../Loyalty';
import { Order } from '../Order/order';
import CustomerWallet from '../Wallet';
import AppUserDetails from './components/appUserDetail';
import B2BUserDetails from './components/b2bUserDetail';
import PosUserDetails from './components/posUserDetail';
import TaxInformation from './components/tax-information';
import './overview.css';

export const Overview = ({ logo }) => {
  const locId = localStorage.getItem('locId');
  const orgId = localStorage.getItem('orgId');
  const isMobileDevice = isSmallScreen();

  const query = new URLSearchParams(useLocation().search);
  const retailId = query.get('retailId');
  const uidx = query.get('uidx');
  const phoneNumber = query.get('phoneNumber');
  const customerId = query.get('customerId');
  const showSnackbar = useSnackbar();
  const isPhoneNumber = Number(phoneNumber); // b2c app customer

  const [updateDetails, setUpdateDetails] = useState(null);
  const [orderSummary, setOrderSummary] = useState([]);
  //   const customerData = useSelector(customerBaseData);
  const custData = useSelector((state) => state?.customerBaseDetails);
  //
  const customerData = custData?.customerBaseDetails[0];
  //   additional details
  const [customerOrderSummary, setCustomerOrderSummary] = useState('');

  //   tabs
  const [status, setStatus] = useState({
    tab1: true,
    tab2: false,
    tab3: false,
    tab4: false,
    tab5: false,
  });
  const [tabsOrientation, setTabsOrientation] = useState('horizontal');
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    // A function that sets the orientation state of the tabs.
    function handleTabsOrientation() {
      return window.innerWidth < breakpoints.values.sm
        ? setTabsOrientation('vertical')
        : setTabsOrientation('horizontal');
    }

    /** 
   The event listener that's calling the handleTabsOrientation function when resizing the window.
  */
    window.addEventListener('resize', handleTabsOrientation);

    // Call the handleTabsOrientation function to set the state with the initial value.
    handleTabsOrientation();

    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleTabsOrientation);
  }, [tabsOrientation]);

  const handleSetTabValue = (event, newValue) => {
    setTabValue(newValue);
    if (newValue == 0) {
      setStatus({
        tab1: true,
        tab2: false,
        tab3: false,
        tab4: false,
        tab5: false,
      });
    } else if (newValue == 1) {
      setStatus({
        tab1: false,
        tab2: true,
        tab3: false,
        tab4: false,
        tab5: false,
      });
    } else if (newValue == 2) {
      setStatus({
        tab1: false,
        tab2: false,
        tab3: true,
        tab4: false,
        tab5: false,
      });
    } else if (newValue == 3) {
      setStatus({
        tab1: false,
        tab2: false,
        tab3: false,
        tab4: true,
        tab5: false,
      });
    } else if (newValue == 4) {
      setStatus({
        tab1: false,
        tab2: false,
        tab3: false,
        tab4: false,
        tab5: true,
      });
    }
  };

  // fetch order summary of a customer
  const fetchCustomerOrdersSummary = async () => {
    try {
      // customerKey - uidx(pos) || customerId(for app customer) || retailId(b2b customers)
      let payload = {
        customerId: '',
      };
      if (retailId) {
        payload.customerId = retailId;
        payload.organizationId = orgId;
      } else if (uidx) {
        payload.customerId = uidx;
        payload.locationId = locId;
        payload.organizationId = orgId;
      } else if (phoneNumber) {
        payload.customerId = customerId;
        payload.organizationId = orgId;
      } else {
        return;
      }

      const response = await getCustomerOrderSummaryV2(payload);

      if (response?.data?.data?.es) {
        showSnackbar(response?.data?.data?.message, 'error');
        return;
      }

      setCustomerOrderSummary(response?.data?.data);
    } catch (err) {
      setCustomerOrderSummary('');
      showSnackbar('Something went wrong', 'error');
    }
  };

  //   fetch outstanding balance of a customer
  const fetchOutstandingBalance = async () => {
    try {
      let sourceId = '';
      if (retailId) {
        sourceId = retailId;
      } else if (uidx) {
        sourceId = uidx;
      } else if (phoneNumber) {
        sourceId = customerId;
      } else {
        return;
      }

      const payload = {
        sourceId: sourceId,
      };

      const response = await getCustomerOrdersSummary(payload, sourceId);

      if (response?.data?.status === 'ERROR') {
        showSnackbar('Order Summary - ' + response?.data?.message || 'Something went wrong', 'error');
        setOrderSummary('');
        return;
      }

      const ordSummary = response?.data?.data;
      setOrderSummary(ordSummary);
    } catch (error) {
      showSnackbar('Order Summary - ' + error?.message || 'Something went wrong', 'error');
    }
  };

  const checkAppAndPosCustomer = async (userUidx) => {
    try {
      const payload = {
        uidx: userUidx,
        locationId: locId,
        organizationId: orgId,
      };
      const response = await validateAppAndPosUser(payload);
      if (response?.data?.es) {
        showSnackbar(response?.data?.message, 'error');
        return null;
      }

      return true;
    } catch (err) {
      showSnackbar('Something went wrong', 'error');
      return null;
    }
  };

  const cardData = useMemo(
    () => [
      {
        title: 'Lifetime Value',
        value: (data) => `₹ ${formatNumber(data?.grandTotal) ?? 'N/A'}`,
        subText: (data) => `from ${data?.totalOrders ?? 'N/A'} orders`,
      },
      {
        title: 'Total Discounts',
        value: (data) => `₹ ${data?.totalDiscounts ?? 'N/A'}`,
        subText: (data) => `from ${data?.totalOrders ?? 'N/A'} orders`,
      },
      {
        title: (uidx) => `Customer Ranking ${uidx ? '(Location Wise)' : '(Organization Wise)'}`,
        value: (data) => `${data?.customerRank ?? 'N/A'} / ${data?.totalCustomers ?? 'N/A'}`,
        subText: () => 'based on sales value',
      },
      {
        title: 'Average Cart Value',
        value: (data) => `₹ ${formatNumber(data?.averageCartValue) ?? 'N/A'}`,
        subText: (data) => `from ${data?.totalOrders ?? 'N/A'} orders`,
      },
      {
        title: 'Last Sale',
        value: (data) => `₹ ${formatNumber(data?.customerLastSaleValue) ?? 'N/A'}`,
        subText: (data) => (data?.createdDate ? dateFormatter(data?.createdDate) : 'N/A'),
      },
    ],
    [customerOrderSummary, uidx],
  );

  const SummaryCards = ({ customerOrderSummary, isMobileDevice, uidx }) => {
    const headingClass = isMobileDevice ? 'm-vendorCardHeading' : 'vendorCardHeading';
    const valueClass = isMobileDevice ? 'm-vendorCardValue' : 'vendorCardValue';
    const countClass = isMobileDevice ? 'm-vendorCardCount' : 'vendorCardCount';

    return (
      <Grid container spacing={2} style={{ padding: '10px 15px 0px 20px' }}>
        {cardData.map((card, idx) => (
          <Grid item xs={12} md={4} key={idx}>
            <Card className="vendorCardContainer">
              <SoftTypography className={headingClass}>
                {typeof card.title === 'function' ? card.title(uidx) : card.title}
              </SoftTypography>

              <SoftTypography className={valueClass}>{card.value(customerOrderSummary)}</SoftTypography>

              <SoftTypography className={countClass}>{card.subText(customerOrderSummary)}</SoftTypography>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };  

  //   will be common for b2b, pos and app
  useEffect(() => {
    fetchCustomerOrdersSummary();
    fetchOutstandingBalance();
  }, [retailId, uidx, phoneNumber]);

  return (
    <SoftBox sx={{ width: '100%' }}>
      {retailId && (
        <B2BUserDetails logo={logo} customerOrderSummary={customerOrderSummary} orderSummary={orderSummary} />
      )}
      {uidx && (
        <PosUserDetails
          logo={logo}
          customerOrderSummary={customerOrderSummary}
          orderSummary={orderSummary}
          checkAppAndPosCustomer={checkAppAndPosCustomer}
        />
      )}
      {phoneNumber && (
        <AppUserDetails
          logo={logo}
          customerOrderSummary={customerOrderSummary}
          orderSummary={orderSummary}
          checkAppAndPosCustomer={checkAppAndPosCustomer}
        />
      )}

      <SoftBox mt={5} mb={3}>
        <Grid container spacing={1}>
          <Grid item xs={12} md={12} xl={3}>
            {
              <PlatformSettings
                retailId={retailId}
                setUpdateDetails={setUpdateDetails}
                updateDetails={updateDetails}
                isAppUser={phoneNumber && true}
                isPosUser={uidx && true}
              />
            }
            {/* Tax Information - only for b2b */}
            {retailId && (
              <SoftBox mt={2}>
                <TaxInformation
                  billingCurrency={customerData?.currency}
                  gstNumber={customerData?.gstNumber}
                  panNumber={customerData?.panNumber}
                  gstTreatment={customerData?.gstTreatment}
                  taxPreferance={customerData?.taxPreference}
                />
              </SoftBox>
            )}
            {/* for pos, it is not required */}
            {!uidx && (
              <SoftBox mt={2}>
                <BillingDetails setUpdateDetails={setUpdateDetails} updateDetails={updateDetails} />
              </SoftBox>
            )}
          </Grid>

          <Grid item xs={12} md={12} xl={9} className="overview-other-details">
            {/* tabs - overview, orders, loyalty, wallet, coupons */}

            <SoftBox sx={{ margin: !isMobileDevice ? '15px 10px 10px 10px' : '10px 0 0' }}>
              <AppBar
                position="static"
                sx={{
                  '& .MuiTabs-root .MuiTabs-vertical': {
                    padding: '0 !important',
                  },
                }}
              >
                <Tabs
                  orientation={tabsOrientation}
                  value={tabValue}
                  onChange={handleSetTabValue}
                  TabIndicatorProps={{ sx: { display: 'none' } }}
                  sx={{
                    background: 'transparent',
                    '& .MuiTabs-flexContainer': {
                      flexWrap: 'wrap',
                      gap: !isMobileDevice ? '5px' : '1px',
                      rowGap: isMobileDevice ? '10px' : '',
                      marginBottom: '20px',
                      flexDirection: !isMobileDevice ? '' : 'row',
                    },
                  }}
                >
                  <Tab label="Overview" className={tabValue === 0 ? 'overviewBtnStyle' : 'defaultvendorTabstyle'} />
                  <Tab label="Order" className={tabValue === 1 ? 'overviewBtnStyle' : 'defaultvendorTabstyle'} />

                  <Tab label="Loyalty" className={tabValue === 2 ? 'overviewBtnStyle' : 'defaultvendorTabstyle'} />

                  <Tab label="Wallet" className={tabValue === 3 ? 'overviewBtnStyle' : 'defaultvendorTabstyle'} />
                  <Tab label="Coupons" className={tabValue === 4 ? 'overviewBtnStyle' : 'defaultvendorTabstyle'} />
                </Tabs>
              </AppBar>
              {status.tab2 ? <Order customerId={phoneNumber ? customerId : uidx} /> : null}
              {/* loyalty, coupons and wallet for b2c - check using isPhoneNumber*/}
              {/* loyalty, coupons for pos user - check using uidx */}
              {/* Loyalty */}
              {status.tab3 && (
                <CustomerLoyalty
                  customerId={isPhoneNumber ? customerData?.id : null}
                  uidx={uidx}
                  orgId={orgId}
                  locId={locId}
                  retailId={retailId}
                />
              )}
              {/* Wallet */}
              {status.tab4 && isPhoneNumber ? <CustomerWallet customerId={customerData?.id} /> : null}
              {/* Coupons */}
              {status.tab5 && (isPhoneNumber || uidx) && (
                <CustomerCoupons appUserMobileNumber={customerData?.phoneNumber} orgId={orgId} locId={locId} />
              )}
            </SoftBox>

            {/* summary details */}
            {status.tab1 && (
              <>
                <SummaryCards customerOrderSummary={customerOrderSummary} isMobileDevice={isMobileDevice} uidx={uidx} />
              </>
            )}
          </Grid>
        </Grid>
      </SoftBox>
      <Footer />
    </SoftBox>
  );
};
