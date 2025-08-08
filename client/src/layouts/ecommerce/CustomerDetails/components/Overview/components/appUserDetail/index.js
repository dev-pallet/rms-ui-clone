import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import {
  checkAppUserExistAsPos,
  getCustomerCouponList,
  getCustomerDetailsByPhone,
  getCustomerLoyaltySummary,
  getCustomerWalletAmount,
  validateAppAndPosUser,
} from '../../../../../../../config/Services';
import { customerBaseData } from '../../../../../../../datamanagement/customerdataSlice';
import { useSnackbar } from '../../../../../../../hooks/SnackbarProvider';
import AdditionalDetails from '../../../../../Common/new-ui-common-components/additional-details';
import CustomerDetailsHeader from '../header';
import dayjs from 'dayjs';
import { dateFormatter, formatNumber } from '../../../../../Common/CommonFunction';

const AppUserDetails = ({
  logo,
  orderSummary,
  customerOrderSummary, // additional details
  checkAppAndPosCustomer,
}) => {
  // there is no loyalty for b2c app and b2b
  const locId = localStorage.getItem('locId');
  const orgId = localStorage.getItem('orgId');
  const dispatch = useDispatch();
  const showSnackbar = useSnackbar();
  const query = new URLSearchParams(useLocation().search);
  const phoneNumber = query.get('phoneNumber');
  const [addressList1, setAddressList1] = useState('');
  const [couponSummary, setCouponSummary] = useState('');

  const [loyaltySummary, setLoyaltySummary] = useState('');

  //   const customerData = useSelector(customerBaseData);
  const custData = useSelector((state) => state.customerBaseDetails);
  const customerData = custData.customerBaseDetails[0];

  // wallet summary
  const [walletSummary, setWalletSummary] = useState('');

  // user is both app and pos user
  const [appAndPosUser, setAppAndPosUser] = useState(false);

  // additional details
  const array = useMemo(
    () => [
      {
        tabName: `Total Sales ${appAndPosUser ? '(APP and POS Orders)' : ''}`,
        tabValue: 'totalSales',
        //   tabDescription: `of ${jobDetailsObj?.productAssigned ?? 0} products`,
        tabDescription: `from ${customerOrderSummary?.totalOrders ?? 'N/A'} paid orders`,
        tabIcon: '',
      },
      {
        tabName: 'Total Returns',
        tabValue: 'totalReturns',
        //   tabDescription: `of ${jobDetailsObj?.totalCounted ?? 0} products`,
        tabDescription: `from ${customerOrderSummary?.totalOrderReturns ?? 'N/A'} returns`,
        tabIcon: '',
      },
      {
        tabName: 'Debit Notes',
        tabValue: 'debitNotes',
        //   tabDescription: `of ${jobDetailsObj?.productAssigned ?? 0} products`,
        tabDescription: 'open N/A days',
        tabIcon: '',
      },
      {
        tabName: 'Credit Notes',
        tabValue: 'creditNotes',
        tabDescription: 'from N/A returns',
        tabIcon: '',
      },
      {
        tabName: 'Promo Wallet',
        tabValue: 'promoWallet',
        //   tabDescription: `from ${jobDetailsObj?.productWithVarianceCount ?? 0} products`,
        tabDescription: `expires ${walletSummary?.promoExpiry || 'N/A'}`,
        tabIcon: '',
      },
      {
        tabName: 'User Wallet',
        tabValue: 'wallet',
        //   tabDescription: `from ${jobDetailsObj?.productWithVarianceCount ?? 0} products`,
        tabDescription: ``,
        tabIcon: '',
      },
      {
        tabName: 'Loyalty Points',
        tabValue: 'loyaltyPoints',
        //   tabDescription: `from ${jobDetailsObj?.productWithVarianceCount ?? 0} products`,
        tabDescription: `from ${loyaltySummary?.totalPointsValue || 'N/A'} points`,
        tabIcon: '',
      },
      {
        tabName: 'Active Coupons',
        tabValue: 'activeCoupons',
        //   tabDescription: `from ${jobDetailsObj?.productWithVarianceCount ?? 0} products`,
        tabDescription: `expires ${couponSummary?.couponLatestExpiry || 'N/A'}`,
        tabIcon: '',
      },
    ],
    [customerOrderSummary, loyaltySummary, appAndPosUser, walletSummary],
  );

  const additionalDetails = useMemo(() => {
    // const time = convertMinutesToHoursAndMinutes(jobDetailsObj?.totalTimeTaken ?? 0);
    return {
      totalSales: `₹ ${formatNumber(customerOrderSummary?.grandTotal) ?? 'N/A'}`,
      totalReturns: `₹ ${formatNumber(customerOrderSummary?.orderReturns) ?? 'N/A'}`,
      debitNotes: 'N/A', // not implemented in backend
      creditNotes: 'N/A ', // not implemented in backend
      promoWallet: `₹ ${walletSummary?.promoWalletAmount ?? 'N/A'}`, // only for b2c app customer, not for pos and b2b
      wallet: `₹ ${walletSummary?.defaultAmount ?? 'N/A'}`, // only for b2c app customer, not for pos and b2b
      loyaltyPoints: `₹ ${loyaltySummary?.totalPoints || 'N/A'}`,
      activeCoupons: couponSummary?.availableCoupons ?? 'N/A',
    };
  }, [customerOrderSummary, couponSummary, loyaltySummary, walletSummary]);

  //   fetch customer details by phone number
  const fetchAppCustomerDetails = async () => {
    try {
      const response = await getCustomerDetailsByPhone(phoneNumber);
      if (response?.data?.es) {
        showSnackbar('Error fetching customer details', 'error');
        return;
      }
      dispatch(customerBaseData(response?.data?.customer));
      setAddressList1(response?.data?.customer?.addresses);

      const customerId = response?.data?.customer?.id;
      // fetch wallet amount balance
      const res = await getCustomerWalletAmount(customerId);
      if (res?.data?.es === 0) {
        setWalletSummary({
          promoWalletAmount: res?.data?.promoWalletAmount ?? 'N/A',
          defaultAmount: res?.data?.defaultAmount ?? 'N/A',
          promoExpiry: res?.data?.promoExpiry ? dateFormatter(res?.data?.promoExpiry) : 'N/A',
        });
      } else {
        setWalletSummary('');
      }

      // fetch loyalty summary
      const payload = {
        customerId: customerId,
        organizationId: orgId,
      };
      const loyaltyResponse = await getCustomerLoyaltySummary(payload);
      if (loyaltyResponse?.data?.status !== 'ERROR') {
        setLoyaltySummary(response?.data?.data);
      } else {
        showSnackbar('Error fetching loyalty summary', 'error');
        setLoyaltySummary('');
      }

      // Check if the user exists in POS
      const userUidx = response?.data?.customer?.uidx;
      const validateAppAndPosUserPayload = {
        uidx: userUidx,
        locationId: locId,
        organizationId: orgId,
      };
      const validateAppAndPosUserResponse = await validateAppAndPosUser(validateAppAndPosUserPayload);
      if (validateAppAndPosUserResponse?.data?.es) {
        // showSnackbar('Error validating current user for pos','error');
        setAppAndPosUser(false);
      } else {
        setAppAndPosUser(true);
      }
    } catch (err) {
      showSnackbar('Error fetching loyalty summary','error');
    }
  };

  // only to get total coupons count
  const fetchCustomerCoupons = async () => {
    const payload = {
      mobileNumber: phoneNumber,
      organizationId: orgId,
      page: 0,
      size: 1,
    };

    try {
      const response = await getCustomerCouponList(payload);
      if (response?.data?.status === 'ERROR' || response?.data?.data?.es) {
        showSnackbar('Coupons - ' + response?.data?.data?.message || 'Something went wrong', 'error');
        setCouponSummary(null);
        return;
      }
      setCouponSummary({
        availableCoupons: response?.data?.data?.numberOfRows ?? 'N/A',
        couponLatestExpiry:
          dayjs(response?.data?.data?.customerCouponDetailsDtoList?.[0]?.validTo).format('Do MMM, YYYY') || 'N/A',
      });
    } catch (err) {
      setCouponSummary(null);
      showSnackbar('Something went wrong','error');
    }
  };

  useEffect(() => {
    fetchAppCustomerDetails();
    fetchCustomerCoupons();

    return () => {
      dispatch(customerBaseData([]));
    };
  }, []);

  return (
    <>
      <CustomerDetailsHeader
        logo={logo}
        displayName={customerData?.name || 'N/A'}
        mobileNumber={customerData?.phoneNumber || 'N/A'}
        locations={customerData?.addresses || []}
        channels={appAndPosUser ? ['POS', 'App'] : ['App']}
        customerType={appAndPosUser ? ['POS', 'B2C'] : ['B2C']}
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

export default AppUserDetails;
