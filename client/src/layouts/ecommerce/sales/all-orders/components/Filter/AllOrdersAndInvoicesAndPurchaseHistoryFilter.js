import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { Box, Chip } from '@mui/material';
import { ChipBoxHeading } from '../../../../Common/Filter Components/filterComponents';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { formatDateDDMMYYYY } from '../../../../Common/CommonFunction';
import { useLocation, useNavigate } from 'react-router-dom';
import Filter from '../../../../Common/Filter';
import React, { useState } from 'react';
import SoftBox from '../../../../../../components/SoftBox';
import SoftSelect from '../../../../../../components/SoftSelect';
import dayjs from 'dayjs';

//common filter for -
// "Sales Order > Invoices Page"
// &&
// "Marketplace > Purchase History"
// &&
// "Sales Order > Payment Received" - instead of order status, payment status filter in this page

export const AllOrdersAndInvoicesAndPurchaseHistoryFilter = ({
  page, // to apply condition depending on page
  setOnClear, // update the clear status when clear is clicked in filter
  filterObject, // payload
  orderType,
  newOrderType,
  setOrderType,
  mobileApp,
  allOrderList, //fn
}) => {
  // <--- filter states
  const navigate = useNavigate();
  const location = useLocation();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [orderStatus, setOrderStatus] = useState({}); // except payment received page
  const [paymentStatus, setPaymentStatus] = useState({});
  const [paymentMethod, setPaymentMethod] = useState({});
  const [paymentMode, setPaymentMode] = useState({});
  // --->

  if (orderType !== '') {
    if (orderType) {
      filterObject.orderType = orderType;
    } else {
      filterObject.orderType = localStorage.getItem('Order_Type') || null;
    }
  }

  if (page === 'payment_received') {
    if (paymentStatus !== undefined) {
      if (paymentStatus.value) {
        filterObject.paymentStatus = paymentStatus.value;
      }
    }
  } else {
    if (orderStatus !== undefined) {
      if (orderStatus.value) {
        filterObject.orderStatus = orderStatus.value;
      }
    }
  }

  if (paymentMethod !== undefined) {
    if (paymentMethod.value) {
      filterObject.paymentMethod = paymentMethod.value;
    }
  }

  if (paymentMode !== undefined) {
    if (paymentMode.value) {
      filterObject.paymentMode = paymentMode.value;
    }
  }

  if (startDate !== null) {
    filterObject.startDate = startDate;
  }

  if (endDate !== null) {
    filterObject.endDate = endDate;
  }

  // filters
  // to manage filters applied state for sales order filters
  const [filtersApplied, setFiltersApplied] = useState(0);
  const [filterState, setFilterState] = useState({
    orderType: 0,
    ...(page === 'payment_received' ? { paymentStatus: 0 } : { orderStatus: 0 }),
    paymentMethod: 0,
    paymentMode: 0,
    startDate: 0,
    endDate: 0,
  });

  // chipBoxes for filter
  const filterChipBoxes = (
    <>
      {/* order type  */}
      {filterState.orderType === 1 && (
        <Box className="singleChipDisplayBox">
          <ChipBoxHeading heading="Order Type" />
          <Box className="insideSingleChipDisplayBox">
            <Chip
              label={
                newOrderType === 'SALES_ORDER'
                  ? 'Sales OSALES_ORDERrder'
                  : newOrderType === 'POS_ORDER'
                  ? 'Pos Order'
                  : newOrderType === 'B2C_ORDER'
                  ? 'App Order'
                  : newOrderType === 'MARKETPLACE_ORDER' || newOrderType === null
                  ? 'Marketplace Order'
                  : 'All Orders'
              }
              onDelete={() => removeSelectedFilter('orderType')}
              deleteIcon={<CancelOutlinedIcon />}
              color="primary"
              variant="outlined"
            />
          </Box>
        </Box>
      )}

      {/* order status */}
      {filterState.orderStatus === 1 && (
        <Box className="singleChipDisplayBox">
          <ChipBoxHeading heading="Order Status" />
          <Box className="insideSingleChipDisplayBox">
            <Chip
              label={orderStatus.label}
              onDelete={() => removeSelectedFilter('orderStatus')}
              deleteIcon={<CancelOutlinedIcon />}
              color="primary"
              variant="outlined"
            />
          </Box>
        </Box>
      )}

      {/* Payment Method  */}
      {filterState.paymentMethod === 1 && (
        <Box className="singleChipDisplayBox">
          <ChipBoxHeading heading="Payment Method" />
          <Box className="insideSingleChipDisplayBox">
            <Chip
              label={paymentMethod.label}
              onDelete={() => removeSelectedFilter('paymentMethod')}
              deleteIcon={<CancelOutlinedIcon />}
              color="primary"
              variant="outlined"
            />
          </Box>
        </Box>
      )}

      {/* Payment Mode  */}
      {filterState.paymentMode === 1 && (
        <Box className="singleChipDisplayBox">
          <ChipBoxHeading heading="Payment Mode" />
          <Box className="insideSingleChipDisplayBox">
            <Chip
              label={paymentMode.label}
              onDelete={() => removeSelectedFilter('paymentMode')}
              deleteIcon={<CancelOutlinedIcon />}
              color="primary"
              variant="outlined"
            />
          </Box>
        </Box>
      )}

      {/* start date */}
      {filterState.startDate === 1 && (
        <Box className="singleChipDisplayBox">
          <ChipBoxHeading heading="Start Date" />
          <Box className="insideSingleChipDisplayBox">
            <Chip
              label={formatDateDDMMYYYY(startDate)}
              onDelete={() => removeSelectedFilter('startDate')}
              deleteIcon={<CancelOutlinedIcon />}
              color="primary"
              variant="outlined"
            />
          </Box>
        </Box>
      )}

      {/* end date */}
      {filterState.endDate === 1 && (
        <Box className="singleChipDisplayBox">
          <ChipBoxHeading heading="End Date" />
          <Box className="insideSingleChipDisplayBox">
            <Chip
              label={formatDateDDMMYYYY(endDate)}
              onDelete={() => removeSelectedFilter('endDate')}
              deleteIcon={<CancelOutlinedIcon />}
              color="primary"
              variant="outlined"
            />
          </Box>
        </Box>
      )}
    </>
  );

  // order type(all, sales, pos), order status, payment method, payment mode, start date, end date

  const getOrderTypeLabel = () => {
    return newOrderType === 'SALES_ORDER'
      ? 'Sales Order'
      : newOrderType === 'POS_ORDER'
      ? 'Pos Order'
      : newOrderType === 'B2C_ORDER'
      ? 'App Order'
      : 'All Orders';
  };

  // select order type selectbox
  const orderTypeSelect = (
    <>
      <SoftBox>
        <SoftSelect
          // placeholder={
          //   newOrderType === 'SALES_ORDER' ? 'Sales Order' : newOrderType === 'POS_ORDER' ? 'Pos Order' : 'All Orders'
          // }
          placeholder="Select Order Type"
          {...(orderType !== '' && filterState.orderType !== 0
            ? {
                value: {
                  value: newOrderType,
                  label:
                    page === 'purchase_history' && orderType === 'MARKETPLACE_ORDER'
                      ? 'Marketplace Order'
                      : getOrderTypeLabel(),
                },
              }
            : {
                value: {
                  value: '',
                  label: 'Select Order Type',
                },
              })}
          options={[
            { value: '', label: 'All Orders' },
            { value: 'SALES_ORDER', label: 'Sales Order' },
            { value: 'POS_ORDER', label: 'Pos Order' },
            { value: 'B2C_ORDER', label: 'App Order' },
            // if page === purchase_history , show below option as well
            page === 'purchase_history' ? { value: 'MARKETPLACE_ORDER', label: 'Marketplace Order' } : {},
          ]}
          onChange={(option, e) => handleOrderType(option)}
        />
      </SoftBox>
    </>
  );

  const paymentStatusSelect = (
    <>
      <SoftBox>
        <SoftSelect
          placeholder="Select Payment Status"
          {...(paymentStatus.label
            ? {
                value: {
                  value: paymentStatus.value,
                  label: paymentStatus.label,
                },
              }
            : {
                value: {
                  value: '',
                  label: 'Select Payment Status',
                },
              })}
          options={[
            { value: 'PAID', label: 'Paid' },
            { value: 'PAYMENT_PENDING', label: 'Payment Pending' },
            { value: 'PARTIALLY_PAID', label: 'Partially Paid' },
            { value: 'CANCELLED', label: 'Cancelled' },
          ]}
          onChange={(option, e) => handlePaymentStatus(option)}
        />
      </SoftBox>
    </>
  );

  const orderStatusSelect = (
    <>
      <SoftBox>
        <SoftSelect
          placeholder="Select Order Status"
          {...(orderStatus.label
            ? {
                value: {
                  value: orderStatus.value,
                  label: orderStatus.label,
                },
              }
            : {
                value: {
                  value: '',
                  label: 'Select Order Status',
                },
              })}
          options={[
            { value: 'PAID', label: 'Paid' },
            { value: 'PAYMENT_PENDING', label: 'Payment Pending' },
            { value: 'PARTIALLY_PAID', label: 'Partially Paid' },
            { value: 'CANCELLED', label: 'Cancelled' },
          ]}
          onChange={(option, e) => handleOrderStatus(option)}
        />
      </SoftBox>
    </>
  );

  const paymentMethodSelect = (
    <>
      <SoftBox>
        <SoftSelect
          placeholder="Select Payment Method"
          {...(paymentMethod.label
            ? {
                value: {
                  value: paymentMethod.value,
                  label: paymentMethod.label,
                },
              }
            : {
                value: {
                  value: '',
                  label: 'Select Payment Method',
                },
              })}
          options={[
            { value: 'UPI', label: 'UPI' },
            { value: 'CASH', label: 'Cash' },
            // { value: 'COD', label: 'Cash On Delivery' },
            // { value: 'CREDIT_CARD', label: 'Credit Card' },
            // { value: 'DEBIT_CARD', label: 'Debit Card' },
            // { value: 'PREPAID_CARD', label: 'Prepaid Card' },
            // { value: 'NET_BANKING', label: 'Net Banking' },
            // { value: 'EMI', label: 'EMI' },
            // { value: 'ONLINE', label: 'Online' },
            { value: 'CARD', label: 'Card' },
            { value: 'SPLIT', label: 'Split' },
            { value: 'WALLET', label: 'Wallet' },
            { value: 'OTHERS', label: 'Others' },
          ]}
          onChange={(option, e) => handlePaymentMethod(option)}
        />
      </SoftBox>
    </>
  );

  // ONLINE,OFFLINE,COD
  const paymentModeSelect = (
    <>
      <SoftBox>
        <SoftSelect
          placeholder="Select Payment Mode"
          {...(paymentMode.label
            ? {
                value: {
                  value: paymentMode.value,
                  label: paymentMode.label,
                },
              }
            : {
                value: {
                  value: '',
                  label: 'Select Payment Mode',
                },
              })}
          options={[
            { value: 'ONLINE', label: 'Online' },
            { value: 'OFFLINE', label: 'Offline' },
            { value: 'COD', label: 'Cash On Delivery' },
          ]}
          onChange={(option, e) => handlePaymentMode(option)}
        />
      </SoftBox>
    </>
  );

  // 2023-01-01
  const startDateSelect = (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          views={['year', 'month', 'day']}
          label="Select Start Date"
          value={startDate ? dayjs(startDate) : null}
          format="DD/MM/YYYY"
          onChange={(date) => {
            // handleStartDate(date.$d);
            handleStartDate(date);
          }}
          sx={{
            width: '100%',
            '& .MuiInputLabel-formControl': {
              fontSize: '14px',
              top: '-0.4rem',
              color: '#344767 !important',
              opacity: 0.8,
            },
          }}
        />
      </LocalizationProvider>
    </>
  );

  // 2023-01-01
  const endDateSelect = (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          views={['year', 'month', 'day']}
          label="Select End Date"
          value={endDate ? dayjs(endDate) : null}
          format="DD/MM/YYYY"
          onChange={(date) => {
            // handleStartDate(date.$d);
            handleEndDate(date);
          }}
          sx={{
            width: '100%',
            '& .MuiInputLabel-formControl': {
              fontSize: '14px',
              top: '-0.4rem',
              color: '#344767 !important',
              opacity: 0.8,
            },
          }}
        />
      </LocalizationProvider>
    </>
  );

  // functions
  // handle order type fn
  const handleOrderType = (event) => {
    const orderType = event.value;
    setOrderType(orderType);
    localStorage.setItem('Order_Type', orderType);

    if (event !== '') {
      if (filterState['orderType'] === 0) {
        setFiltersApplied((prev) => prev + 1);
        setFilterState({ ...filterState, orderType: 1 });
      }
    } else {
      setFiltersApplied((prev) => prev - 1);
      setFilterState({ ...filterState, orderType: 0 });
    }
  };

  // handle order status fn
  const handleOrderStatus = (option) => {
    setOrderStatus(option);
    if (option !== '') {
      if (filterState['orderStatus'] === 0) {
        setFiltersApplied((prev) => prev + 1);
        setFilterState({ ...filterState, orderStatus: 1 });
      }
    }
  };

  // handle payment status fn
  const handlePaymentStatus = (option) => {
    setPaymentStatus(option);
    if (option !== '') {
      if (filterState['paymentStatus'] === 0) {
        setFiltersApplied((prev) => prev + 1);
        setFilterState({ ...filterState, paymentStatus: 1 });
      }
    }
  };

  // handle payment method fn
  const handlePaymentMethod = (option) => {
    setPaymentMethod(option);
    if (option !== '') {
      if (filterState['paymentMethod'] === 0) {
        setFiltersApplied((prev) => prev + 1);
        setFilterState({ ...filterState, paymentMethod: 1 });
      }
    }
  };

  //handle payment mode fn
  const handlePaymentMode = (option) => {
    setPaymentMode(option);
    if (option !== '') {
      if (filterState['paymentMode'] === 0) {
        setFiltersApplied((prev) => prev + 1);
        setFilterState({ ...filterState, paymentMode: 1 });
      }
    }
  };

  // handle start date fn
  const handleStartDate = (date) => {
    if (date) {
      // Format the date as a string in the 'YYYY-MM-DD' format
      const formattedDate = dayjs(date).format('YYYY-MM-DD');
      setStartDate(formattedDate);

      if (filterState['startDate'] === 0) {
        setFiltersApplied((prev) => prev + 1);
        setFilterState({ ...filterState, startDate: 1 });
      }
    }
  };

  // handle end date fn
  const handleEndDate = (date) => {
    if (date) {
      // Format the date as a string in the 'YYYY-MM-DD' format
      const formattedDate = dayjs(date).format('YYYY-MM-DD');
      setEndDate(formattedDate);

      if (filterState['endDate'] === 0) {
        setFiltersApplied((prev) => prev + 1);
        setFilterState({ ...filterState, endDate: 1 });
      }
    }
  };

  // select boxes array to pass as prop to Filter component
  const selectBoxArray = [
    // mobileApp && orderTypeSelect,
    page === 'payment_received' ? paymentStatusSelect : orderStatusSelect, // except payment received page, show orderStatus instead of payment status
    paymentMethodSelect,
    paymentModeSelect,
    startDateSelect,
    endDateSelect,
  ];

  if (!mobileApp) {
    selectBoxArray.push(orderTypeSelect);
  }
  // fn to remove selected filter
  const removeSelectedFilter = (filterType) => {
    switch (filterType) {
      case 'orderType':
        setOrderType('');
        setFilterState({ ...filterState, orderType: 0 });
        setFiltersApplied((prev) => prev - 1);
        break;
      case 'orderStatus':
        setOrderStatus({});
        setFilterState({ ...filterState, orderStatus: 0 });
        setFiltersApplied((prev) => prev - 1);
        break;
      case 'paymentStatus':
        setOrderStatus({});
        setFilterState({ ...filterState, paymentStatus: 0 });
        setFiltersApplied((prev) => prev - 1);
        break;
      case 'paymentMethod':
        setPaymentMethod({});
        setFilterState({ ...filterState, paymentMethod: 0 });
        setFiltersApplied((prev) => prev - 1);
        break;
      case 'paymentMode':
        setPaymentMode({});
        setFilterState({ ...filterState, paymentMode: 0 });
        setFiltersApplied((prev) => prev - 1);
        break;
      case 'startDate':
        setStartDate(null);
        setFilterState({ ...filterState, startDate: 0 });
        setFiltersApplied((prev) => prev - 1);
        break;
      case 'endDate':
        setEndDate(null);
        setFilterState({ ...filterState, endDate: 0 });
        setFiltersApplied((prev) => prev - 1);
        break;
      default:
        return;
    }
  };

  // fn to apply sales order Filter
  const applyFilter = () => {
    allOrderList();
  };

  // fn to  clear the inventory filter
  const handleClearFilter = () => {
    if (mobileApp) {
      setOrderType('B2C_ORDER');
    } else if (page === 'purchase_history') {
      localStorage.setItem('Order_Type', 'MARKETPLACE_ORDER');
      setOrderType('MARKETPLACE_ORDER');
    } else {
      localStorage.removeItem('Order_Type');
      setOrderType('');
    }

    setOrderStatus({});
    setPaymentStatus({});
    setPaymentMethod({});
    setPaymentMode({});
    setStartDate(null);
    setEndDate(null);

    // reset filterState
    setFilterState({
      orderType: 0,
      ...(page === 'payment_received' ? { paymentStatus: 0 } : { orderStatus: 0 }),
      paymentMethod: 0,
      paymentMode: 0,
      startDate: 0,
      endDate: 0,
    });
    // reset filtersApplied
    setFiltersApplied(0);

    // set on clear to true
    setOnClear(true);
  };

  return (
    <>
      <Filter
        filtersApplied={filtersApplied}
        filterChipBoxes={filterChipBoxes}
        selectBoxArray={selectBoxArray}
        handleApplyFilter={applyFilter}
        handleClearFilter={handleClearFilter}
      />
    </>
  );
};
