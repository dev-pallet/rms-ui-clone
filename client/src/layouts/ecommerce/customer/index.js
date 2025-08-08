import './customer.css';
import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { getAllUserDetailsPos, getCustomerList, getPosCustomerList } from 'config/Services';
import { useEffect, useState } from 'react';
import { useMediaQuery, useTheme } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import SoftBox from 'components/SoftBox';
import SoftButton from 'components/SoftButton';
import SoftSelect from 'components/SoftSelect';
import Spinner from 'components/Spinner/index';
import moment from 'moment';

import { ClearSoftInput, dateFormatter, isSmallScreen, noDatagif, textFormatter } from '../Common/CommonFunction';
import { useSnackbar } from '../../../hooks/SnackbarProvider';
import { getAppCustomers, getCustomerDetails, getCustomerListV2, getPosCustomerListV2 } from '../../../config/Services';
import PosCustomerFilter from './components/posCustomerFilter';
import SoftInput from '../../../components/SoftInput';
import { useDebounce } from 'usehooks-ts';
import AppCustomerListingMobile from './components/listing-mobile/app';
import ViewMore from '../Common/mobile-new-ui-components/view-more';
import MobileSearchBar from '../Common/mobile-new-ui-components/mobile-searchbar';
import { CustomerHeader } from './components/customerCommon';
import B2BCustomerListingMobile from './components/listing-mobile/b2b';
import PosCustomerListingMobile from './components/listing-mobile/pos';
import MobileFilterComponent from '../Common/mobile-new-ui-components/mobile-filter';
import SoftTypography from '../../../components/SoftTypography';
import dayjs from 'dayjs';
import NoDataFoundMob from '../Common/mobile-new-ui-components/no-data-found';

const Customer = ({ mobileSearchedValue, setSearchValueProp }) => {
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(0);
  const isMobileDevice = isSmallScreen();

  const initialStartDate = '2023-01-01';
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [resetDateFilter, setResetDateFilter] = useState(false);
  const [odsScreenExist, setOdsScreenExist] = useState(false);

  const [viewMoreLoader, setViewMoreLoader] = useState(false);
  const [showViewMore, setShowViewMore] = useState(true);

  // Update page based on the URL when component mounts
  useEffect(() => {
    if (!isMobileDevice) {
      const pageQueryParam = searchParams.get('page');
      if (pageQueryParam && pageQueryParam !== page) {
        // Only update pageState if the pageQueryParam is different from the current state
        setPage(Number(pageQueryParam));
      } else if (!pageQueryParam) {
        // If there's no page param in the URL, set it to 0
        const updatedSearchParams = new URLSearchParams(searchParams);
        updatedSearchParams.set('page', 0); // Always set page=0 in the URL
        setSearchParams(updatedSearchParams);
      }
    }
  }, [searchParams, page]);

  const handlePageNumber = (pageNo) => {
    setPage(pageNo);

    if (!isMobileDevice) {
      // Create a new instance of searchParams to modify both values
      const updatedSearchParams = new URLSearchParams(searchParams);

      // Always add the page parameter, even if it's 0
      updatedSearchParams.set('page', pageNo);

      // Update the URL with parameters
      setSearchParams(updatedSearchParams);
    }
  };

  //material ui media query
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [customerType, setCustomerType] = useState(() => {
    // Check if 'customertype' exists in the URL search params
    const searchParamCustomerType = searchParams.get('customer');
    if (searchParamCustomerType) {
      return {
        value:
          searchParamCustomerType === 'app' ? '' : searchParamCustomerType === 'b2b' ? 'org' : searchParamCustomerType,
        label:
          searchParamCustomerType === 'b2b'
            ? 'B2B Customers'
            : searchParamCustomerType === 'pos'
            ? 'POS Customers'
            : 'App Customers',
      };
    }

    // If not in search params, fallback to localStorage
    const localStorageCustomerType = JSON.parse(localStorage.getItem('customerType'));
    if (localStorageCustomerType) {
      return localStorageCustomerType;
    }

    // Default fallback
    return {
      value: 'org',
      label: 'B2B Customers',
    };
  });
  const [posList, setPosList] = useState(false);
  const [posTableRows, setPosTableRows] = useState([]);

  const [pageStatePos, setPageStatePos] = useState({
    loader: false,
    datRows: [],
    total: 0,
    page: 1,
    pageSize: 10,
  });

  const [pageState, setPageState] = useState({
    loader: false,
    datRows: [],
    total: 0,
    page: 1,
    pageSize: 10,
  });

  const [pageStateApp, setPageStateApp] = useState({
    loader: false,
    dataRows: [],
    total: 0,
    page: 0,
    pageSize: 10,
  });

  const contextType = localStorage.getItem('contextType');
  const locId = localStorage.getItem('locId');

  const [searchValue, setSearchValue] = useState(mobileSearchedValue || '');
  const debouncedSearchValue = useDebounce(searchValue, 300); // Adjust the delay as needed

  const columns = isMobile
    ? [
        {
          field: 'name',
          headerName: 'Customer Name',
          minWidth: 180,
          flex: 0.75,
          headerClassName: 'datagrid-columns',
          headerAlign: 'center',
          cellClassName: 'datagrid-rows',
          align: 'center',
        },
        {
          field: 'contact',
          headerName: 'Contact Number',
          minWidth: 150,
          flex: 0.75,
          headerClassName: 'datagrid-columns',
          headerAlign: 'center',
          cellClassName: 'datagrid-rows',
          align: 'center',
        },
        {
          field: 'customer_type',
          headerName: 'Customer Type',
          minWidth: 150,
          flex: 0.75,
          headerClassName: 'datagrid-columns',
          headerAlign: 'center',
          cellClassName: 'datagrid-rows',
          align: 'center',
        },
      ]
    : [
        {
          field: 'name',
          headerName: 'Customer Name',
          minWidth: 150,
          flex: 0.75,
          headerClassName: 'datagrid-columns',
          headerAlign: 'left',
          cellClassName: 'datagrid-rows',
          align: 'left',
        },
        {
          field: 'companyName',
          headerName: 'Company Name',
          minWidth: 180,
          flex: 0.75,
          headerClassName: 'datagrid-columns',
          headerAlign: 'left',
          cellClassName: 'datagrid-rows',
          align: 'left',
        },
        {
          field: 'contact',
          headerName: 'Mobile Number',
          minWidth: 100,
          flex: 0.75,
          headerClassName: 'datagrid-columns',
          headerAlign: 'left',
          cellClassName: 'datagrid-rows',
          align: 'left',
        },
        {
          field: 'gstin',
          headerName: 'GSTIN',
          minWidth: 100,
          flex: 0.75,
          headerClassName: 'datagrid-columns',
          headerAlign: 'left',
          cellClassName: 'datagrid-rows',
          align: 'left',
        },
        {
          field: 'updated',
          headerName: 'Last Modified',
          minWidth: 180,
          flex: 0.75,
          headerClassName: 'datagrid-columns',
          headerAlign: 'left',
          cellClassName: 'datagrid-rows',
          align: 'left',
        },
        // {
        //   field: 'customer_id',
        //   headerName: 'Customer Id',
        //   minWidth: 100,
        //   flex: 0.75,
        //   headerClassName: 'datagrid-columns',
        //   headerAlign: 'left',
        //   cellClassName: 'datagrid-rows',
        //   align: 'left',
        // },
        // {
        //   field: 'customer_type',
        //   headerName: 'Customer Type',
        //   minWidth: 100,
        //   flex: 0.75,
        //   headerClassName: 'datagrid-columns',
        //   headerAlign: 'left',
        //   cellClassName: 'datagrid-rows',
        //   align: 'left',
        // },
        // {
        //   field: 'created_at',
        //   headerName: 'Created At',
        //   headerClassName: 'datagrid-columns',
        //   headerAlign: 'left',
        //   minWidth: 150,
        //   flex: 0.75,
        //   cellClassName: 'datagrid-rows',
        //   align: 'left',
        // },
        // {
        //   field: 'email',
        //   headerName: 'Email',
        //   headerClassName: 'datagrid-columns',
        //   headerAlign: 'left',
        //   minWidth: 150,
        //   flex: 0.75,
        //   cellClassName: 'datagrid-rows',
        //   align: 'left',
        // },
      ];

  const orgId = localStorage.getItem('orgId');

  const [loader, setLoader] = useState(false);
  let dataArr,
    dataRow = [];

  const handleCustomer = () => {
    navigate('/customer/addcustomer');
  };

  const navigateToDetailsPage = (rows) => {
    const { customer_id: retailId, contact: phoneNumber, uidx: uidx, customerId: customerId } = rows.row;
    if (retailId) {
      navigate(`/customer/details?retailId=${retailId}`);
    } else if (uidx) {
      navigate(`/customer/details?uidx=${uidx}`);
    } else if (phoneNumber) {
      navigate(`/customer/details?phoneNumber=${phoneNumber}&customerId=${customerId}`);
    }
  };

  //snackbar

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const [opensnack, setOpensnack] = useState(false);
  const [timelinerror, setTimelineerror] = useState('');
  const [alertmessage, setAlertmessage] = useState('');
  const [errorComing, setErrorComing] = useState(false);

  const handleopensnack = () => {
    setOpensnack(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpensnack(false);
  };

  const convertUTCDateToLocalDate = (dat) => {
    const date = moment.utc(dat).format('YYYY-MM-DD HH:mm:ss');
    const stillUtc = moment.utc(date).toDate();

    let formattedDate = moment(stillUtc).local().format('L, LT').split(',');
    formattedDate[0] = dateFormatter(formattedDate[0]);
    formattedDate = formattedDate.join(',');

    return formattedDate;
  };

  const fetchCustomerList = (isFilterApplied) => {
    let partnerType = '';
    if (contextType === 'RETAIL') {
      partnerType = 'RETAIL';
    } else if (contextType === 'WMS') {
      partnerType = 'WAREHOUSE';
    }
    const payload = {
      pageNumber: page,
      pageSize: pageState.pageSize,
      partnerId: orgId,
      partnerType: partnerType,
      searchParameter: searchValue,
      startDate: startDate == null ? initialStartDate : startDate,
      endDate: endDate !== null ? endDate : '',
    };
    setLoader(true);
    getCustomerListV2(payload)
      .then(function (responseTxt) {
        setErrorComing(false);
        setPosList(false);
        if(responseTxt?.data?.status === 'ERROR' || responseTxt?.data?.data?.es){
          showSnackbar(textFormatter(responseTxt?.data?.data?.message) || 'Something went wrong', 'error');
          setLoader(false);
          setViewMoreLoader(false);
          setErrorComing(true);
          return;
        }
        if (responseTxt?.data?.data?.retails) {
          dataArr = responseTxt?.data?.data?.retails?.content;
          const count = responseTxt?.data?.data?.count;
          const pageSize = responseTxt?.data?.data?.pageSize;

          const showViewMoreButton =
            (payload?.pageNumber + 1) * pageState?.pageSize < responseTxt?.data?.data?.retails?.totalElements;
          setShowViewMore(showViewMoreButton);

          const formattedData = dataArr?.map((row, index) => ({
            id: index,
            name: row?.displayName ? textFormatter(row?.displayName) : 'N/A',
            companyName: textFormatter(row?.name) || 'N/A',
            contact: row?.phoneNumber || 'N/A',
            customer_id: row?.retailId ? row?.retailId : 'N/A',
            customer_type: row?.retailType ? textFormatter(row?.retailType) : 'N/A',
            created_by: row?.createdBy ? convertUTCDateToLocalDate(row?.createdBy) : 'N/A',
            created_at: row?.created ? convertUTCDateToLocalDate(row?.created) : 'N/A',
            email: row?.email || 'N/A',
            updated: row?.updated ? dateFormatter(row?.updated) : 'NA',
            gstin: row?.gstNumber || 'N/A',
          }));
          if (formattedData?.length > 0) {
            if (isMobileDevice) {
              if (debouncedSearchValue !== '' || isFilterApplied) {
                setPageState((prev) => ({ ...prev, datRows: formattedData }));
              } else {
                setPageState((prev) => ({ ...prev, datRows: [...prev.datRows, ...formattedData] }));
              }
            } else {
              setPageState((prev) => ({ ...prev, datRows: formattedData }));
            }
          } else {
            setPageState((prev) => ({ ...prev, datRows: [] }));
            setErrorComing(true);
          }

          setPageState((old) => ({
            ...old,
            loader: false,
            total: responseTxt?.data?.data?.retails?.totalElements,
          }));
        }

        setLoader(false);
        setViewMoreLoader(false);
      })
      .catch((err) => {
        showSnackbar('Something went wrong', 'error');
        setLoader(false);
        setErrorComing(true);
        setPosList(false);
        setPageState((prev) => ({ ...prev, datRows: [], total: 0, page: 0 }));
        setShowViewMore(false);
        setViewMoreLoader(false);
      });
  };

  const gstOptions = [
    { value: 'rbr', label: 'Registered Business - Regular' },
    { value: 'rbc', label: 'Registered Business - Composition' },
    { value: 'urb', label: 'Unregistered Business' },
    { value: 'ovs', label: 'Overseas' },
    { value: 'sez', label: 'Special Economic Zone' },
  ];
  const gstSelected = gstOptions.find((opt) => !!opt.value);
  const [gstTreatment, setGstTreatment] = useState(gstSelected);

  const columnsPos = [
    {
      field: 'name',
      headerName: 'Customer Name',
      minWidth: 180,
      flex: 0.75,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'contact',
      headerName: 'Contact Number',
      minWidth: 180,
      flex: 0.75,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'email',
      headerName: 'Email',
      minWidth: 180,
      flex: 0.75,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'created_at',
      headerName: 'Created At',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 150,
      flex: 0.75,
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
  ];

  const fetchPosCustomerList = (isFilterApplied) => {
    const payload = {
      pageNumber: page,
      pageSize: pageStatePos.pageSize,
      retailId: orgId,
      locationId: locId,
      startDate: startDate == null ? initialStartDate : startDate,
      endDate: endDate !== null ? endDate : '',
      search: searchValue,
    };

    setLoader(true);
    getPosCustomerListV2(payload)
      .then(async (response) => {
        setLoader(false);
        setErrorComing(false);
        setPosList(true);

        if(response?.data?.data?.es || response?.data?.status === 'ERROR'){
          showSnackbar(textFormatter(response?.data?.data?.message || 'Something went wrong'), 'error');
          setErrorComing(true);
          setViewMoreLoader(false);
          setShowViewMore(false);
          return;
        }

        const customerList = response?.data?.data?.customers;
        const uidxList = response?.data?.data?.customers?.map((item) => item?.uidx);
        // console.log('uidxList', uidxList);
        const uidxDetails = {
          uidx: uidxList,
        };
        const posUserDetails = await getAllUserDetailsPos(uidxDetails);
        const posUserList = posUserDetails?.data?.data;
        const showViewMoreButton = (payload?.pageNumber + 1) * pageState?.pageSize < response?.data?.data?.count;
        setShowViewMore(showViewMoreButton);

        const posTableData = customerList?.map((row, index) => ({
          id: index,
          created_at: row?.created ? dateFormatter(row?.created) : 'N/A',
          contact: row?.mobileNumber || 'N/A',
          email: posUserList?.[index]?.['email'] ? posUserList?.[index]?.['email'] : 'N/A',
          name: row?.name ? textFormatter(row?.name) : 'N/A',
          uidx: row?.uidx || 'N/A',
        }));

        setViewMoreLoader(false);

        if (posTableData?.length > 0) {
          if (isMobileDevice) {
            // setPageStatePos((prev) => ({ ...prev, datRows: [...prev.datRows, ...posTableData] }));
            if (debouncedSearchValue !== '' || isFilterApplied) {
              setPageStatePos((prev) => ({ ...prev, datRows: posTableData }));
            } else {
              setPageStatePos((prev) => ({ ...prev, datRows: [...prev.datRows, ...posTableData] }));
            }
          } else {
            setPageStatePos((prev) => ({ ...prev, datRows: posTableData }));
          }
        } else {
          setPageStatePos((prev) => ({ ...prev, datRows: [] }));
          setErrorComing(true);
        }

        setPageStatePos((old) => ({
          ...old,
          loader: false,
          total: response?.data?.data?.count,
        }));
      })
      .catch((err) => {
        showSnackbar('Something went wrong', 'error');
        setLoader(false);
        setErrorComing(true);
        setPageStatePos((prev) => ({ ...prev, total: 0, datRows: [], page: 0 }));
        setShowViewMore(false);
        setViewMoreLoader(false);
      });
  };

  const fetchAppCustomerList = async ({ pageNo, isFilterApplied }) => {
    try {
      setLoader(true);
      setErrorComing(false);
      const payload = {
        organizationId: orgId,
        pageNumber: pageNo,
        pageSize: 10,
        search: debouncedSearchValue,
        startDate: startDate || '',
        endDate: endDate || '',
      };

      setPageStateApp((old) => ({ ...old, page: pageNo }));
      const response = await getAppCustomers(payload);
      if (response?.data?.es) {
        setPageStateApp((prev) => ({ ...prev, total: 0, dataRows: [], page: 0 }));
        showSnackbar(textFormatter(response?.data?.message) || 'Something went wrong', 'error');
        setErrorComing(true);
        setLoader(false);
        setShowViewMore(false);
        setViewMoreLoader(false);
        return;
      }

      const showViewMoreButton = (payload.pageNumber + 1) * pageState?.pageSize < response?.data?.totalRows;
      setShowViewMore(showViewMoreButton);

      const appCustomersData = response?.data?.customers?.map((row, index) => ({
        id: index,
        created_at: row?.created ? dateFormatter(row?.created) : 'N/A',
        contact: row?.phoneNumber || 'N/A',
        email: row?.emailId || 'N/A',
        name: row?.name ? textFormatter(row?.name) : 'N/A',
        customerId: row?.id || 'N/A',
      }));
      setLoader(false);
      setViewMoreLoader(false);

      if (appCustomersData?.length > 0) {
        if (isMobileDevice) {
          if (debouncedSearchValue !== '' || isFilterApplied) {
            setPageStateApp((prev) => ({ ...prev, dataRows: appCustomersData }));
          } else {
            setPageStateApp((prev) => ({ ...prev, dataRows: [...prev.dataRows, ...appCustomersData] }));
          }
        } else {
          setPageStateApp((prev) => ({ ...prev, dataRows: appCustomersData }));
        }
      } else {
        setPageStateApp((prev) => ({ ...prev, dataRows: [] }));
        setErrorComing(true);
      }

      setPageStateApp((prev) => ({ ...prev, total: response?.data?.totalRows }));
    } catch (err) {
      setLoader(false);
      setPageStateApp((prev) => ({ ...prev, total: 0, dataRows: [], page: 0 }));
      showSnackbar('Something went wrong', 'error');
      setShowViewMore(false);
      setViewMoreLoader(false);
    }
  };

  const applyDateFilter = () => {
    const isFilterApplied = true;
    if (page === 0) {
      if (customerType?.value === 'pos') {
        fetchPosCustomerList(isFilterApplied);
      } else if (customerType?.value === 'org') {
        fetchCustomerList(isFilterApplied);
      } else {
        fetchAppCustomerList({ pageNo: 0, isFilterApplied: isFilterApplied });
      }
    } else {
      handlePageNumber(0);
    }
    setResetDateFilter(false);
  };

  const resetSearchParams = () => {
    if (!isMobileDevice) {
      handlePageNumber(0);
      const updatedSearchParams = new URLSearchParams(searchParams);
      updatedSearchParams.delete('startDate');
      updatedSearchParams.delete('endDate');
      updatedSearchParams.set('page', 0);
      setSearchParams(updatedSearchParams);
    } else {
      handlePageNumber(0);
    }
  };

  const handleCustomerType = (option) => {
    // reset all rows
    setPageState((prev) => ({ ...prev, datRows: [], total: 0, page: 0 })); // b2b
    setPageStatePos((prev) => ({ ...prev, total: 0, datRows: [], page: 0 })); // pos
    setPageStateApp((prev) => ({ ...prev, total: 0, dataRows: [], page: 0 })); // app

    localStorage.setItem('customerType', JSON.stringify(option));
    setCustomerType(option);
    setStartDate(null);
    setEndDate(null);
    // remove the date params if any
    resetSearchParams();
  };

  //   functions
  const handleSearchValue = (e) => {
    let value;
    if (!isMobileDevice) {
      value = e?.target?.value;
    } else {
      value = e;
    }
    resetSearchParams();

    // reset all rows
    setPageStateApp((prev) => ({ ...prev, dataRows: [], total: 0, page: 0 }));
    setPageState((prev) => ({ ...prev, datRows: [], total: 0, page: 0 })); // b2b
    setPageStatePos((prev) => ({ ...prev, total: 0, datRows: [], page: 0 })); // pos
    setSearchValue(value);
    // setSearchValueProp(value); // reset in ros-app-sales component
  };

  // clear search input fn
  const handleClearSearchInput = () => {
    resetSearchParams();
    setPageStateApp((prev) => ({ ...prev, dataRows: [] }));
    setSearchValue('');
  };

  const fetchMore = () => {
    setViewMoreLoader(true);
    handlePageNumber(page + 1);
    // fetchAppCustomerList({ pageNo: pageState?.page + 1 });
  };

  const Loader = ({ loader }) => {
    return (
      loader && (
        <SoftBox
          sx={{
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Spinner />
        </SoftBox>
      )
    );
  };

  useEffect(() => {
    if (customerType.value === 'pos') {
      fetchPosCustomerList();
    } else if (customerType.value === 'org') {
      fetchCustomerList();
    } else {
      fetchAppCustomerList({ pageNo: page });
    }
  }, [customerType, page, debouncedSearchValue]);

  useEffect(() => {
    if (resetDateFilter) {
      applyDateFilter();
    }
  }, [resetDateFilter]);

  // Sync local `searchValue` with `mobileSearchedValue` from ros-app-sales component
  useEffect(() => {
    if (isMobileDevice && mobileSearchedValue !== searchValue) {
      // setSearchValue(mobileSearchedValue);
      handleSearchValue(mobileSearchedValue);
    }
  }, [mobileSearchedValue]);

  useEffect(() => {
    const retailId = localStorage.getItem('clientName');
    if(retailId){
      const getRetailInfo = async () => {
        try {
          const response = await getCustomerDetails(retailId);
          if (response?.data?.status === 'ERROR' || response?.data?.data?.es) {
            showSnackbar('Something went wrong', 'error');
            return;
          }
          setOdsScreenExist(response?.data?.data?.retail?.odsScreen);
        } catch (err) {
          showSnackbar('Something went wrong', 'error');
        }
      };
      getRetailInfo();
    }
  }, []);

  return (
    <DashboardLayout>
      {!isMobileDevice && <DashboardNavbar />}

      <Snackbar open={opensnack} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={timelinerror} sx={{ width: '100%' }}>
          {alertmessage}
        </Alert>
      </Snackbar>
      {!isMobileDevice ? (
        <>
          <SoftBox className="content-left" sx={{ marginBottom: '10px' }}>
            <SoftTypography
              className={`stock-balance-tabs ${customerType?.value === 'org' && 'active-tab'}`}
              onClick={() => handleCustomerType({ value: 'org', label: 'B2B Customers' })}
            >
              B2B Customers
            </SoftTypography>
            <SoftTypography
              className={`stock-balance-tabs ${customerType?.value === 'pos' && 'active-tab'}`}
              onClick={() => handleCustomerType({ value: 'pos', label: 'POS Customers' })}
            >
              POS Customers
            </SoftTypography>
            <SoftTypography
              className={`stock-balance-tabs ${customerType?.value === '' && 'active-tab'}`}
              onClick={() => handleCustomerType({ value: '', label: 'App Customers' })}
            >
              App Customers
            </SoftTypography>
          </SoftBox>
          <SoftBox className="search-bar-filter-and-table-container">
            <SoftBox style={{ overflowX: 'auto' }}>
              <SoftBox
                className="search-bar-filter-container"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <SoftBox sx={{ position: 'relative', width: '400px' }}>
                  {
                    <>
                      <SoftInput
                        placeholder="Search by name or phone number"
                        value={searchValue}
                        icon={{ component: 'search', direction: 'left' }}
                        onChange={handleSearchValue}
                      />
                      {searchValue !== '' && <ClearSoftInput clearInput={handleClearSearchInput} />}
                    </>
                  }
                </SoftBox>

                {
                  <Box sx={{ display: 'flex', columnGap: '10px' }}>
                    <>
                    {customerType?.value === 'org' ? (
                        <SoftBox className="new-btn-customer">
                          <SoftButton variant="solidWhiteBackground" onClick={() => handleCustomer()}>
                            <AddIcon />
                            New
                          </SoftButton>
                        </SoftBox>
                      ) : null}

                      <PosCustomerFilter
                        start_date={startDate}
                        set_start_date={setStartDate}
                        end_date={endDate}
                        set_end_date={setEndDate}
                        applyDateFilter={applyDateFilter}
                        resetDateFilter={resetDateFilter}
                        setResetDateFilter={setResetDateFilter}
                        searchParams={searchParams}
                        setSearchParams={setSearchParams}
                        isMobileDevice={isMobileDevice}
                        customerType={customerType}
                      />
                    </>
                  </Box>
                }
              </SoftBox>
            </SoftBox>

            <SoftBox>
              {errorComing ? (
                <SoftBox className="No-data-text-box">
                  <SoftBox className="src-imgg-data">
                    <img className="src-dummy-img" src={noDatagif} />
                  </SoftBox>

                  <h3 className="no-data-text-I">NO DATA FOUND</h3>
                </SoftBox>
              ) : customerType?.value === 'org' ? (
                <div
                  style={{
                    height: 525,
                  }}
                >
                  <Loader loader={loader} />
                  {!loader && (
                    <DataGrid
                      rows={pageState?.datRows || []}
                      columns={columns}
                      // rowsPerPageOptions={[10]}
                      rowCount={parseInt(pageState?.total)}
                      loading={pageState?.loader}
                      pagination
                      page={page}
                      pageSize={pageState?.pageSize}
                      paginationMode="server"
                      onPageChange={(newPage) => {
                        // setPageState((old) => ({ ...old, page: newPage + 1 }));
                        handlePageNumber(newPage);
                      }}
                      onPageSizeChange={(newPageSize) => setPageState((old) => ({ ...old, pageSize: newPageSize }))}
                      getRowId={(row) => row?.id}
                      onCellClick={(rows) => navigateToDetailsPage(rows)}
                    />
                  )}
                </div>
              ) : (
                <div
                  style={{
                    height: 525,
                  }}
                >
                  <Loader loader={loader} />
                  {!loader && customerType?.value === 'pos' ? (
                    <>
                      <DataGrid
                        rows={pageStatePos?.datRows || []}
                        columns={columnsPos}
                        // rowsPerPageOptions={[10]}
                        rowCount={parseInt(pageStatePos?.total)}
                        loading={pageStatePos?.loader}
                        pagination
                        page={page}
                        pageSize={pageStatePos?.pageSize}
                        paginationMode="server"
                        onPageChange={(newPage) => {
                          // setPageStatePos((old) => ({ ...old, page: newPage + 1 }));
                          handlePageNumber(newPage);
                        }}
                        onPageSizeChange={(newPageSize) =>
                          setPageStatePos((old) => ({ ...old, pageSize: newPageSize }))
                        }
                        getRowId={(row) => row?.id}
                        onCellClick={(rows) => navigateToDetailsPage(rows)}
                        disableSelectionOnClick
                      />
                    </>
                  ) : (
                    // for app customers
                    <>
                      {!loader && (
                        <DataGrid
                          rows={pageStateApp?.dataRows || []}
                          columns={columnsPos}
                          // rowsPerPageOptions={[10]}
                          rowCount={pageStateApp?.total}
                          loading={pageStateApp?.loader}
                          pagination
                          page={page}
                          pageSize={pageStateApp?.pageSize}
                          paginationMode="server"
                          onPageChange={(newPage) => {
                            // setPageStateApp((old) => ({ ...old, page: newPage + 1 }));
                            handlePageNumber(newPage);
                          }}
                          onPageSizeChange={(newPageSize) =>
                            setPageStateApp((old) => ({ ...old, pageSize: newPageSize }))
                          }
                          getRowId={(row) => row?.id}
                          onCellClick={(rows) => navigateToDetailsPage(rows)}
                        />
                      )}
                    </>
                  )}
                </div>
              )}
            </SoftBox>
          </SoftBox>
        </>
      ) : (
        <>
          <SoftBox>
            {
              <div>
                <PosCustomerFilter
                  start_date={startDate}
                  set_start_date={setStartDate}
                  end_date={endDate}
                  set_end_date={setEndDate}
                  applyDateFilter={applyDateFilter}
                  resetDateFilter={resetDateFilter}
                  setResetDateFilter={setResetDateFilter}
                  searchParams={searchParams}
                  setSearchParams={setSearchParams}
                  isMobileDevice={isMobileDevice}
                  loader={loader}
                  customerType={customerType}
                />
              </div>
            }
          </SoftBox>
          <SoftBox>
            <SoftBox className="pi-listing-card-main-div" sx={{ marginTop: '10px' }}>
              <CustomerHeader
                selected={customerType?.value}
                handleCustomerType={handleCustomerType}
                handleSearchValue={handleSearchValue}
                searchValue={searchValue}
                handleClearSearchInput={handleClearSearchInput}
                isMobileDevice={isMobileDevice}
              />

              <Loader loader={loader} />
              {errorComing ? 
                  <NoDataFoundMob />
                :
                <>
              {customerType?.value === 'org' &&
                pageState?.datRows?.map((customerData, index) => (
                  <B2BCustomerListingMobile
                    key={index}
                    data={customerData}
                    navigateToDetailsPage={navigateToDetailsPage}
                  />
                ))}

              {customerType?.value === 'pos' &&
                pageStatePos?.datRows?.map((customerData, index) => (
                  <PosCustomerListingMobile
                    key={index}
                    data={customerData}
                    navigateToDetailsPage={navigateToDetailsPage}
                  />
                ))}

              {customerType?.value === '' &&
                pageStateApp?.dataRows?.map((customerData, index) => (
                  <AppCustomerListingMobile
                    key={index}
                    data={customerData}
                    navigateToDetailsPage={navigateToDetailsPage}
                  />
                ))}

              {showViewMore && <ViewMore loading={viewMoreLoader} handleNextFunction={fetchMore} />}
              </>
            }
            </SoftBox>
          </SoftBox>
        </>
      )}
    </DashboardLayout>
  );
};

export default Customer;
