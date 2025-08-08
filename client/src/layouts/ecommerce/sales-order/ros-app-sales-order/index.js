import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import CommonMobileTabs from '../../Common/mobile-new-ui-components/Common-mobile-tabs';
import PurchaseAdditionalDetails from '../../purchase/ros-app-purchase/components/purchase-additional-details';
import MobileSearchBar from '../../Common/mobile-new-ui-components/mobile-searchbar';
import MobileFilterComponent from '../../Common/mobile-new-ui-components/mobile-filter';
import SalesPaymentComponent from '../payments';
import SalesOrderReturns from '../returns';
import AllSalesorders from '../new-sales';
import Customer from '../../customer';
import { useDebounce } from 'usehooks-ts';

const RosAppSalesOrder = () => {
  const navigate = useNavigate();
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const customerType = JSON.parse(localStorage.getItem('customerType'));
  const [searchParams, setSearchParams] = useSearchParams();
  const [customer, setCustomer] = useState(searchParams.get('customer'));
  const [activeSalesTab, setActiveSalesTab] = useState(searchParams.get('value'));
  const [searchValue, setSearchValue] = useState(searchParams.get('productId') || '');
  const [customerSearchValue, setCustomerSearchValue] = useState(searchParams.get('search') || '');
  const debouncedSearchValue = useDebounce(customerSearchValue, 300); // Adjust the delay as needed
  const [paymentSummary, setPaymentSummary] = useState({});
  const [mainSelecetedFilter, setMainSelectedFilter] = useState('');
  const [selectedSubFilters, setSelectedSubFilters] = useState({});
  const [applyFilter, setApplyFilter] = useState(false);
  const [isFilterOpened, setIsFilterOpened] = useState(false);

  const salesTabs = useMemo(
    () => [
      {
        tabName: 'All Orders',
        tabValue: 'order',
        active: activeSalesTab === 'order' ? true : false,
      },
      {
        tabName: 'Payments',
        tabValue: 'payment',
        active: activeSalesTab === 'payment' ? true : false,
      },
      {
        tabName: 'Returns',
        tabValue: 'return',
        active: activeSalesTab === 'return' ? true : false,
      },
      {
        tabName: 'Customers',
        tabValue: 'customers',
        active: activeSalesTab === 'customers' ? true : false,
      }
    ],
    [activeSalesTab],
  );

  const additionalDetailsArray = useMemo(
    () =>
      activeSalesTab === 'payment'
        ? [
            {
              title: `Total sales`,
              value: `₹${paymentSummary?.totalSales ?? '0'}`,
              description: (
                <span className="additional-tab-description-mob">From {paymentSummary?.totalOrders ?? '0'} order</span>
              ),
            },
            {
              title: `Payment received`,
              value: `₹${paymentSummary?.totalPayments ?? '0'}`,
              description: (
                <span className="additional-tab-description-mob">
                  From {paymentSummary?.totalOrdersFromPayments ?? '0'} order
                </span>
              ),
            },
            {
              title: `Outstanding`,
              value: `₹${paymentSummary?.totalOutStandings ?? '0'}`,
              description: (
                <span className="additional-tab-description-mob">
                  From {paymentSummary?.totalOrdersFromOutStandings ?? '0'} order
                </span>
              ),
            },
            {
              title: `Cash`,
              value: `₹${paymentSummary?.cashValue ?? '0'}`,
              description: (
                <span className="additional-tab-description-mob">From {paymentSummary?.cashOrders ?? '0'} order</span>
              ),
            },
            {
              title: `Digital`,
              value: `₹${paymentSummary?.digitalValue ?? '0'}`,
              description: (
                <span className="additional-tab-description-mob">
                  From {paymentSummary?.digitalOrders ?? '0'} order
                </span>
              ),
            },
            {
              title: `Others`,
              value: `₹${paymentSummary?.othersValue ?? '0'}`,
              description: (
                <span className="additional-tab-description-mob">From {paymentSummary?.others ?? '0'} order</span>
              ),
            },
          ]
        : null,
    [activeSalesTab, paymentSummary],
  );

  const commonFilterState = [
    { filterLabel: 'Payment method', filterValue: 'payMethod' },
    { filterLabel: 'Payment mode', filterValue: 'payMode' },
    { filterLabel: 'Start Date', filterValue: 'startDate' },
    { filterLabel: 'End Date', filterValue: 'endDate' },
  ];

  const filters = useMemo(() => {
    switch (activeSalesTab) {
      case 'order':
        return [{ filterLabel: 'Order status', filterValue: 'orderStatus' }, ...commonFilterState];
      case 'payment':
        return [{ filterLabel: 'Payment status', filterValue: 'payStatus' }, ...commonFilterState];
      case 'return':
        return [...commonFilterState];
      default:
        return null;
    }
  }, [activeSalesTab]);

  const commonFilters = {
    payMethod: [
      { value: 'UPI', label: 'UPI' },
      { value: 'CASH', label: 'Cash' },
      { value: 'COD', label: 'Cash On Delivery' },
      { value: 'CREDIT_CARD', label: 'Credit Card' },
      { value: 'DEBIT_CARD', label: 'Debit Card' },
      { value: 'PREPAID_CARD', label: 'Prepaid Card' },
      { value: 'NET_BANKING', label: 'Net Banking' },
      { value: 'EMI', label: 'EMI' },
      { value: 'ONLINE', label: 'Online' },
      { value: 'CARD', label: 'Card' },
      { value: 'SPLIT', label: 'Split' },
      { value: 'WALLET', label: 'Wallet' },
      { value: 'OTHERS', label: 'Others' },
    ],
    payMode: [
      { value: 'ONLINE', label: 'Online' },
      { value: 'OFFLINE', label: 'Offline' },
      { value: 'COD', label: 'Cash On Delivery' },
    ],
    startDate: [{ value: 'custom', label: 'Custom' }],
    endDate: [{ value: 'custom', label: 'Custom' }],
  };

  const filterOptions = useMemo(() => {
    switch (activeSalesTab) {
      case 'order':
        return {
          orderStatus: [
            { value: 'PAID', label: 'Paid' },
            { value: 'PAYMENT_PENDING', label: 'Payment Pending' },
            { value: 'PARTIALLY_PAID', label: 'Partially Paid' },
            { value: 'CANCELLED', label: 'Cancelled' },
          ],
          ...commonFilters,
        };
      case 'payment':
        return {
          payStatus: [
            { value: 'PAID', label: 'Paid' },
            { value: 'PAYMENT_PENDING', label: 'Payment Pending' },
            { value: 'PARTIALLY_PAID', label: 'Partially Paid' },
            { value: 'CANCELLED', label: 'Cancelled' },
          ],
          ...commonFilters,
        };
      case 'return':
        return {
          ...commonFilters,
        };
      default:
        return null;
    }
  }, [activeSalesTab]);

  const tabChangeHandler = (tabValue) => {
    if(tabValue === 'customers'){
      searchParams.set('customer', 'app');
    }else{
      searchParams.delete('customer');
    }
    setActiveSalesTab(tabValue);
    searchParams.set('value', tabValue);
    setSearchParams(searchParams);
    setMainSelectedFilter('');
    setSelectedSubFilters({});
  };

  const onSearchFunction = (e) => {
    setSearchValue(e.target.value);
    if (e.target.value === '') {
      searchParams.delete('productId');
      setSearchParams(searchParams);
    } else {
      searchParams.set('productId', e.target.value);
      setSearchParams(searchParams);
    }
  };

  const onCustomerSearchFunction = (e) => {
    setCustomerSearchValue(e.target.value);
    if (e.target.value === '') {
      searchParams.delete('search');
      setSearchParams(searchParams);
    } else {
      searchParams.set('search', e.target.value);
      setSearchParams(searchParams);
    }
  }

  const titleHandler = useCallback(() => {
    let title =
      activeSalesTab === 'order'
        ? 'Order'
        : activeSalesTab === 'payment'
        ? 'Payment'
        : activeSalesTab === 'return'
        ? 'Return'
        : activeSalesTab === 'customers'
        ? 'Customers'
        : 'NA';

    return title;
  }, [activeSalesTab]);

  const filter_CreateHandler = useCallback(() => {
    let title =
      activeSalesTab === 'order'
        ? {
            filter: true,
            create: false,
          }
        : activeSalesTab === 'payment'
        ? {
            filter: false,
            create: false,
          }
        : activeSalesTab === 'return'
        ? {
            filter: false,
            create: false,
          }
        : 'NA';

    return title;
  }, [activeSalesTab]);

  const createButtonFunction = useCallback(() => {
    let navigation = '/upcoming-feature';
    // activeSalesTab === 'order'
    //   ? '/sales/all-order/new'
    //   : activeSalesTab === 'grn'
    //   ? '/sales/new-payment'
    //   : activeSalesTab === 'return'
    //   ? '/sales/return/add'
    //   : null;

    navigate(navigation);
  }, [activeSalesTab]);

  const getSearchPlaceholder = () => {
    return activeSalesTab === 'order'
      ? 'Order'
      : activeSalesTab === 'payment'
      ? 'Payment'
      : activeSalesTab === 'return'
      ? 'Return'
      : activeSalesTab === 'customers'
      ? 'by name or phone number'
      : null;
  };

  useEffect(() => {
    if(customer){
      searchParams.delete('customer');
      setSearchParams(searchParams);      
    }
  },[customer]);

  return (
    <div className="ros-purchase-app-parent-container">
      <div className="purchase-tabs-main-div">
        <CommonMobileTabs tabs={salesTabs} onTabChange={tabChangeHandler} />
      </div>
      <div>
        <PurchaseAdditionalDetails additionalDetailsArray={additionalDetailsArray} />
      </div>
      {(activeSalesTab === 'order' || activeSalesTab === 'customers') && (
        <div>
          <MobileSearchBar
            placeholder={`Search ${getSearchPlaceholder()}`}
            onChangeFunction={activeSalesTab === 'order' ? onSearchFunction : onCustomerSearchFunction}
            value={activeSalesTab === 'order' ? searchValue : customerSearchValue}
          />
        </div>
      )}
      <div className={activeSalesTab === 'customers' ? 'customersPage' : ''}>
        <MobileFilterComponent
          filters={filters}
          filterOptions={filterOptions}
          createButtonTitle={titleHandler()}
          createButtonFunction={createButtonFunction}
          mainSelecetedFilter={mainSelecetedFilter}
          setMainSelectedFilter={setMainSelectedFilter}
          selectedSubFilters={selectedSubFilters}
          setSelectedSubFilters={setSelectedSubFilters}
          applyFilter={applyFilter}
          setApplyFilter={setApplyFilter}
          isFilterOpened={isFilterOpened}
          setIsFilterOpened={setIsFilterOpened}
          filterCreateExist={filter_CreateHandler}
        />
      </div>
      <div className="ros-app-purchase-component-main-div">
        {activeSalesTab === 'order' && (
          <AllSalesorders
            selectedSubFilters={selectedSubFilters}
            isFilterApplied={applyFilter}
            mobileSearchedValue={activeSalesTab === 'order' && searchValue}
            setSearchValue={setSearchValue}
          />
        )}
        {activeSalesTab === 'payment' && (
          <SalesPaymentComponent
            selectedSubFilters={selectedSubFilters}
            applyFilter={applyFilter}
            mobileSearchedValue={activeSalesTab === 'payment' && searchValue}
            setPaymentSummary={setPaymentSummary}
          />
        )}
        {activeSalesTab === 'return' && (
          <SalesOrderReturns
            selectedSubFilters={selectedSubFilters}
            applyFilter={applyFilter}
            mobileSearchedValue={activeSalesTab === 'return' && searchValue}
            setPaymentSummary={setPaymentSummary}
          />
        )}
        {(['customers'].includes(activeSalesTab) ||
          (['b2b', 'pos', 'app'].includes(customer) && ['order', 'payment', 'return'].includes(activeSalesTab))) && (
          <Customer mobileSearchedValue={debouncedSearchValue} setSearchValueProp={setCustomerSearchValue} />
        )}
      </div>
    </div>
  );
};

export default RosAppSalesOrder;
