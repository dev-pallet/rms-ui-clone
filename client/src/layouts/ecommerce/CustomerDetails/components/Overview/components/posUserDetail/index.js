import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  getCustomerCouponList,
  getCustomerDetailsByPhone,
  getCustomerLoyaltySummary,
  getPosCustomerDetails,
} from '../../../../../../../config/Services';
import { useSnackbar } from '../../../../../../../hooks/SnackbarProvider';
import AdditionalDetails from '../../../../../Common/new-ui-common-components/additional-details';
import CustomerDetailsHeader from '../header';
import dayjs from 'dayjs';
import { useDispatch } from 'react-redux';
import { customerBaseData } from '../../../../../../../datamanagement/customerdataSlice';
import { formatNumber } from '../../../../../Common/CommonFunction';

const PosUserDetails = ({
  logo,
  orderSummary,
  customerOrderSummary, //additional details
  checkAppAndPosCustomer,
}) => {
  const dispatch = useDispatch();
  const orgId = localStorage.getItem('orgId');
  const locName = localStorage.getItem('locName');
  const locId = localStorage.getItem('locId');
  const query = new URLSearchParams(useLocation().search);
  const uidx = query.get('uidx');
  const showSnackbar = useSnackbar();
  const [couponSummary, setCouponSummary] = useState('');

  // pos customer details
  const [posCustomerDetails, setPosCustomerDetails] = useState('');
  const [loyaltySummary, setLoyaltySummary] = useState('');

  // user is both app and pos user
  const [appAndPosUser, setAppAndPosUser] = useState(false);

  // additional details
  const array = useMemo(
    () => [
      {
        tabName: `Total Sales ${appAndPosUser ? '(APP and POS Orders)' : ''}`,
        tabValue: 'totalSales',
        tabDescription: `from ${customerOrderSummary?.totalOrders ?? 'N/A'} paid orders`,
        tabIcon: '',
      },
      {
        tabName: 'Total Returns',
        tabValue: 'totalReturns',
        tabDescription: `from ${customerOrderSummary?.totalOrderReturns} returns`,
        tabIcon: '',
      },
      {
        tabName: 'Debit Notes',
        tabValue: 'debitNotes',
        tabDescription: 'open NA days',
        tabIcon: '',
      },
      {
        tabName: 'Credit Notes',
        tabValue: 'creditNotes',
        tabDescription: 'from NA returns',
        tabIcon: '',
      },
      {
        tabName: 'Wallet',
        tabValue: 'wallet',
        tabDescription: 'expires NA June',
        tabIcon: '',
      },
      {
        tabName: 'Loyalty Points',
        tabValue: 'loyaltyPoints',
        tabDescription: `from ${loyaltySummary?.totalPointsValue || 'N/A'} points`,
        tabIcon: '',
      },
      {
        tabName: 'Active Coupons',
        tabValue: 'activeCoupons',
        tabDescription: `expires ${couponSummary?.couponLatestExpiry || 'N/A'}`,
        tabIcon: '',
      },
    ],
    [customerOrderSummary, loyaltySummary, appAndPosUser, couponSummary],
  );

  const additionalDetails = useMemo(() => {
    // const time = convertMinutesToHoursAndMinutes(jobDetailsObj?.totalTimeTaken ?? 0);
    return {
      totalSales: `₹ ${formatNumber(customerOrderSummary?.grandTotal) ?? 'N/A'}`,
      totalReturns: `₹ ${formatNumber(customerOrderSummary?.orderReturns) ?? 'N/A'}`,
      debitNotes: 'N/A', // not implemented in backend
      creditNotes: 'N/A ', // not implemented in backend
      wallet: '₹ N/A', // only for b2c app customer, not for pos and b2b
      loyaltyPoints: `₹ ${loyaltySummary?.totalPoints || 'N/A'}`,
      activeCoupons: couponSummary?.availableCoupons ?? 'N/A',
    };
  }, [couponSummary, loyaltySummary]);

  // fetch pos customer details
  const fetchPosCustomerDetails = async () => {
    try {
      const response = await getPosCustomerDetails(uidx, orgId);

      if (response?.data?.status === 'ERROR' || response?.data?.es) {
        showSnackbar('Error fetching customer details', 'error');
        return;
      }

      setPosCustomerDetails({
        ...response?.data?.userModel,
        ...response?.data?.customerDto,
      });
      dispatch(customerBaseData({ ...response?.data?.userModel, ...response?.data?.customerDto }));

      // check if user exist in APP
      const posUserPhoneNo = response?.data?.userModel?.mobileNumber ?? '';
      const res = await getCustomerDetailsByPhone(posUserPhoneNo);
      if (res?.data?.es === 0) {
        if (res?.data?.customer) {
          setAppAndPosUser(true);
        }
      } else {
        setAppAndPosUser(false);
      }
    } catch (err) {
      showSnackbar('Error fetching customer details', 'error');
      return;
    }
  };

  // only to get total coupons count
  const fetchCustomerCoupons = async () => {
    const payload = {
      mobileNumber: posCustomerDetails.mobileNumber,
      organizationId: orgId,
      locationId: locId,
      page: 0,
      size: 1,
    };
    try {
      const response = await getCustomerCouponList(payload);
      if (response?.data?.status === 'ERROR' || response?.data?.data?.es) {
        showSnackbar('Coupons - ' + response?.data?.data?.message || 'Unable to fetch coupons', 'error');
        setCouponSummary(null);
        return;
      }
      setCouponSummary({
        availableCoupons: response?.data?.data?.numberOfRows ?? 'N/A',
        couponLatestExpiry:
          dayjs(response?.data?.data?.customerCouponDetailsDtoList?.[0]?.validTo).format('D MMM, YYYY') || 'N/A',
      });
    } catch (err) {
      setCouponSummary(null);
      showSnackbar('Error fetching coupon details', 'error');
    }
  };

  // loyalty summary for pos/app
  const fetchCustomerLoyaltySummary = async () => {
    try {
      const payload = {
        customerId: uidx,
        organizationId: orgId,
        locationId: locId,
      };
      const response = await getCustomerLoyaltySummary(payload);

      if (response?.data?.status === 'ERROR') {
        showSnackbar('Something went wrong', 'error');
        setLoyaltySummary('');
        return;
      }

      setLoyaltySummary(response?.data?.data);
    } catch (err) {
      showSnackbar('Something went wrong', 'error');
    }
  };

  useEffect(() => {
    if (posCustomerDetails?.mobileNumber) {
      fetchCustomerCoupons();
    }
  }, [posCustomerDetails]);

  useEffect(() => {
    fetchPosCustomerDetails();
    fetchCustomerLoyaltySummary();

    return () => {
      dispatch(customerBaseData([]));
    };
  }, []);

  return (
    <>
      <CustomerDetailsHeader
        logo={logo}
        displayName={`${posCustomerDetails?.firstName || ''} ${posCustomerDetails?.secondName || ''}`.trim() || 'N/A'}
        mobileNumber={posCustomerDetails?.mobileNumber || 'N/A'}
        locations={[locName]}
        channels={appAndPosUser ? ['Walk-In', 'App'] : ['Walk-In']}
        customerType={['POS']}
        outStandingPayables={orderSummary?.outStandingPayables ?? 'N/A'}
        dueDays={'N/A'}
        // onSendReminder={handleSendReminder}
        pendingDebitNote={'N/A'}
        unusedCredit={'N/A'}
      />
      {/* <-- additional  */}
      <AdditionalDetails additionalDetailsArray={array} additionalDetails={additionalDetails} />
    </>
  );
};

export default PosUserDetails;
