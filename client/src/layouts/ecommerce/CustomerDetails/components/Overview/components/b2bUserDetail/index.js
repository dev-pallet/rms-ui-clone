import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { getCustomerDetails } from '../../../../../../../config/Services';
import { customerBaseData } from '../../../../../../../datamanagement/customerdataSlice';
import AdditionalDetails from '../../../../../Common/new-ui-common-components/additional-details';
import CustomerDetailsHeader from '../header';
import { useSnackbar } from '../../../../../../../hooks/SnackbarProvider';
import { formatNumber } from '../../../../../Common/CommonFunction';

const B2BUserDetails = ({
  logo,
  orderSummary,
  customerOrderSummary, // additional details
}) => {
  // loyalty, wallet and coupons not required for b2b
  // there is no loyalty for b2c app and b2b

  const showSnackbar = useSnackbar();
  const dispatch = useDispatch();
  const query = new URLSearchParams(useLocation().search);
  const retailId = query.get('retailId');
  const [addressList1, setAddressList1] = useState('');
  //   const customerData = useSelector(customerBaseData);
  const custData = useSelector((state) => state.customerBaseDetails);
  const customerData = custData.customerBaseDetails[0];

  // additional details
  const array = useMemo(
    () => [
      {
        tabName: 'Total Sales',
        tabValue: 'totalSales',
        tabDescription: `from ${customerOrderSummary?.totalOrders ?? 'N/A'} paid orders`,
        tabIcon: '',
      },
      {
        tabName: 'Total Returns',
        tabValue: 'totalReturns',
        tabDescription: `from ${customerOrderSummary?.totalOrderReturns ?? 'N/A'} returns`,
        tabIcon: '',
      },
      {
        tabName: 'Debit Notes',
        tabValue: 'debitNotes',
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
        tabName: 'Wallet',
        tabValue: 'wallet',
        tabDescription: 'expires N/A',
        tabIcon: '',
      },
      {
        tabName: 'Loyalty Points',
        tabValue: 'loyaltyPoints',
        tabDescription: `from N/A points`,
        tabIcon: '',
      },
      {
        tabName: 'Active Coupons',
        tabValue: 'activeCoupons',
        tabDescription: 'expires N/A',
        tabIcon: '',
      },
    ],
    [customerOrderSummary],
  );

  const additionalDetails = useMemo(() => {
    // const time = convertMinutesToHoursAndMinutes(jobDetailsObj?.totalTimeTaken ?? 0);
    return {
      totalSales: `₹ ${formatNumber(customerOrderSummary?.grandTotal) ?? 'N/A'}`,
      totalReturns: `₹ ${formatNumber(customerOrderSummary?.orderReturns) ?? 'N/A'}`,
      debitNotes: 'N/A', // not implemented in backend
      creditNotes: 'N/A ', // not implemented in backend
      wallet: '₹ N/A', // only for b2c app customer, not for pos and b2b
      loyaltyPoints: `₹ N/A`,
      activeCoupons: 'N/A',
    };
  }, [customerOrderSummary]);

  // fetch b2b customer details
  const fetchCustomerDetails = async (retailId) => {
    try {
      const responseTxt = await getCustomerDetails(retailId);
      dispatch(customerBaseData(responseTxt?.data?.data?.retail));
      setAddressList1(responseTxt?.data?.data?.retail?.addresses);
    } catch (error) {
      showSnackbar('Error fetching customer details:', 'error');
      dispatch(customerBaseData([]));
    }
  };

  useEffect(() => {
    fetchCustomerDetails(retailId);

    return () => {
      dispatch(customerBaseData([]));
    };
  }, [retailId]);

  return (
    <>
      <CustomerDetailsHeader
        logo={logo}
        displayName={customerData?.displayName || 'N/A'}
        mobileNumber={customerData?.contacts?.[0]?.phoneNo || 'N/A'}
        locations={customerData?.addresses}
        channels={[]}
        customerType={['B2B']}
        outStandingPayables={formatNumber(orderSummary?.outStandingPayables) ?? 'N/A'}
        dueDays={customerData?.dueDays || 'N/A'}
        // onSendReminder={handleSendReminder}
        pendingDebitNote={'N/A'}
        unusedCredit={'N/A'}
        customer={'B2B'}
      />
      {/* <-- additional  */}
      <AdditionalDetails additionalDetailsArray={array} additionalDetails={additionalDetails} />
    </>
  );
};

export default B2BUserDetails;
