import ArchiveIcon from '@mui/icons-material/Archive';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';
import EditIcon from '@mui/icons-material/Edit';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import { Chip, CircularProgress, Grid, Modal, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { alpha, styled } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import GradientLineChart from 'examples/Charts/LineCharts/GradientLineChart';
import { debounce } from 'lodash';
import moment from 'moment';
import React, { useEffect, useMemo, useState } from 'react';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { useParams } from 'react-router-dom';
import SoftBox from '../../../../components/SoftBox';
import SoftButton from '../../../../components/SoftButton';
import SoftSelect from '../../../../components/SoftSelect';
import SoftTypography from '../../../../components/SoftTypography';
import {
  exportBillWiseReport,
  exportItemWisePurchaseData,
  exportPurchaseData,
  exportPurchaseReportsBigQuery,
  getAllBrands,
  getAllMainCategory,
  getAllUserOrgs,
  getAllVendors,
  getItemsInfo,
  getRetailnames_location,
  getWarehouseLocations,
  purchaseAvailabilityReport,
} from '../../../../config/Services';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import { useSnackbar } from '../../../../hooks/SnackbarProvider';
import { dateFormatter, formatWithUnderscores } from '../../Common/CommonFunction';
import Filter from '../../Common/Filter';
import { ChipBoxHeading } from '../../Common/Filter Components/filterComponents';
import { dataGridStyles } from '../../Common/NewDataGridStyle';
import Status from '../../Common/Status';
import downLoadLogo from '../components/assests/downloadLogo.png';
import Datepickerreport from './Datepickerreport';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { CheckCircle, Description, Person } from '@mui/icons-material';
import DateRangeSelector from '../DateRangeSelector';
import './NewReportsComponent.css';
import CreateNewReportModal from './CreateNewReportModal';
import SoftAsyncPaginate from '../../../../components/SoftSelect/SoftAsyncPaginate';
const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color: theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
      },
    },
  },
}));

const chipStyle = {
  height: 'auto',
  '& .MuiChip-label': {
    fontSize: '0.75rem !Important',
  },
};

const reportAvailabilityColumns = [
  {
    field: 'reqId',
    headerName: 'Req ID',
    minWidth: 80,
    headerClassName: 'datagrid-columns',
    headerAlign: 'left',
    cellClassName: 'datagrid-rows',
    flex: 1,
  },
  {
    field: 'createdOn',
    headerName: 'Created On',
    minWidth: 100,
    headerClassName: 'datagrid-columns',
    headerAlign: 'left',
    cellClassName: 'datagrid-rows',
    flex: 1,
  },
  {
    field: 'userCreated',
    headerName: 'Created By',
    minWidth: 150,
    headerClassName: 'datagrid-columns',
    headerAlign: 'left',
    cellClassName: 'datagrid-rows',
    flex: 1,
    renderCell: (params) => {
      const firstLetter = params.value ? params.value.charAt(0).toUpperCase() : '';
      const isPallet = params.value === 'Pallet';
      return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              backgroundColor: isPallet ? 'transparent' : 'cornflowerblue',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '8px',
              fontSize: '10px',
              color: '#fff',
            }}
          >
            {isPallet ? (
              <img
                src="https://storage.googleapis.com/twinleaves_bucket/FrontEnd/Pallet_images/Youtube%20Channel%20Logo%20(1).png"
                alt="Pallet"
                style={{ width: '18px', height: '18px' }}
              />
            ) : (
              firstLetter
            )}
          </div>
          {params.value}
        </div>
      );
    },
  },
  {
    field: 'reportStartDate',
    headerName: 'Start Date',
    minWidth: 80,
    headerClassName: 'datagrid-columns',
    headerAlign: 'left',
    cellClassName: 'datagrid-rows',
    flex: 1,
  },
  {
    field: 'reportEndDate',
    headerName: 'End Date',
    minWidth: 120,
    headerClassName: 'datagrid-columns',
    headerAlign: 'left',
    cellClassName: 'datagrid-rows',
    flex: 1,
  },
  {
    field: 'status',
    headerName: 'Status',
    minWidth: 150,
    headerClassName: 'datagrid-columns',
    headerAlign: 'left',
    cellClassName: 'datagrid-rows',
    flex: 1,
    renderCell: (params) => {
      if (params?.row?.status === 'COMPLETED') {
        return <Chip label={params?.row?.status || '---'} color="success" sx={chipStyle} />;
      } else if (params?.row?.status === 'IN_PROGRESS') {
        return <Chip label="IN_PROGRESS" color="warning" sx={chipStyle} />;
      }
    },
  },
  {
    field: 'docUrl',
    headerName: 'Download',
    minWidth: 150,
    headerClassName: 'datagrid-columns',
    headerAlign: 'center',
    cellClassName: 'datagrid-rows',
    flex: 1,
    renderCell: (params) => {
      if (params?.row?.status === 'COMPLETED') {
        return (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
            <img
              src={downLoadLogo}
              alt="Download"
              style={{ cursor: 'pointer', width: '24px', height: '24px' }}
              onClick={() => window.location.assign(params?.row?.docUrl)}
            />
          </div>
        );
      }
    },
  },
];
const Generalreports = () => {
  const user_details = localStorage.getItem('user_details');
  const uidx = JSON.parse(user_details).uidx;
  let userName = localStorage.getItem('user_name');
  const showSnackBar = useSnackbar();
  const [tabledata, SetTabledata] = useState([]);
  const [fromdate, setFromdate] = useState('');
  const [todate, setTodate] = useState('');
  const [status, setStatus] = useState(null);
  const [retail, setRetail] = useState([]);
  const [warehousdata, setWarehouseData] = useState();
  const [Vmsdata, setVmsData] = useState();
  const [locationname, setLocationame] = useState(null);
  const [outputArray, setoutputArray] = useState(null);
  const [vendorid, setVendorid] = useState(null);
  const [brandId, setBrandId] = useState(null);
  const [categoryId, setCategoryId] = useState(null);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [initialMount, setInitialMount] = useState(true);
  const { reportId } = useParams();
  const [loader, setLoader] = useState(false);
  const [page, setPage] = useState(0);
  const [reportAvailabilityData, setReportAvailabilityData] = useState([]);
  const [totalAvailabilityCount, setTotalAvailabilityCount] = useState(0);
  const [itemNo, setSelectedItemNo] = useState();
  const [itemOptions, setItemOptions] = useState([]);
  const [itemSearch, setItemSearch] = useState('');
  const [brandOptions, setBrandOptions] = useState([]);
  const [open, setOpen] = useState(false);
  const [showDateRangeSelector, setShowDateRangeSelector] = useState(false);

  function formatDateWithMoment(dateString) {
    return moment(dateString).format('YYYY-MM-DD');
  }

  const handleDateSelect = (selectedDates) => {
    handleButtonClick();
    const startDate = formatDateWithMoment(selectedDates?.startDate);
    const endDate = formatDateWithMoment(selectedDates?.endDate);
    setFromdate(startDate || '');
    setTodate(endDate || '');
  };

  // useMemo(() => {
  //   const currentDate = new Date();
  //   const currentMonth = currentDate.getMonth();
  //   if (currentMonth) {
  //     const fiveMonthsAgo = moment(currentDate).subtract(5, 'months').format('YYYY-MM-DD');
  //     const oneMonthAhead = moment(currentDate).add(0, 'months').format('YYYY-MM-DD');

  //     setFromdate(fiveMonthsAgo);
  //     setTodate(oneMonthAhead);
  //   } else {
  //     setFromdate(moment(currentDate).format('YYYY-MM-DD'));
  //     setTodate(moment(currentDate).format('YYYY-MM-DD'));
  //   }
  // }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setVendorid(null);
    setCategoryId(null);
    setBrandId(null);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');

  const fetchProducts = debounce(async (searchText) => {
    const isNumber = !isNaN(+itemSearch);
    const payload = {
      page: 1,
      pageSize: '10',
      // names: [itemSearch],
      productStatuses: ['CREATED'],
      supportedStore: [locId],
    };

    if (itemSearch !== '') {
      if (isNumber) {
        payload.gtin = [itemSearch];
        payload.names = [];
      } else {
        payload.gtin = [];
        payload.names = [itemSearch];
      }
    } else {
      payload.gtin = [];
      payload.names = [];
    }

    if (itemSearch.length >= 3) {
      try {
        const response = await getItemsInfo(payload);
        if (response?.data?.data?.code === 'ECONNRESET') {
          if (retryCount < 3) {
            fetchProducts(searchText);
            retryCount++;
          } else {
            console.error('Some Error Occurred, Try again');
          }
        } else if (response?.data?.status === 'SUCCESS') {
          const products = response?.data?.data?.products || [];
          const options = products?.map((item) => ({
            value: item?.gtin,
            label: `(${item?.name}) ${item.gtin}`,
          }));
          setItemOptions(options);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }
  }, 300);

  useEffect(() => {
    fetchProducts(itemSearch);

    // Cleanup function to cancel debounce on unmount
    return () => {
      fetchProducts.cancel();
    };
  }, [itemSearch]);

  useEffect(() => {
    fetchReportData();
  }, []);

  const handleVendorVsImsData = async () => {
    const payload = {
      exportFormat: 'excel',
      excelReportType: 'VENDOR_WISE_PURCHASE_IMS_ITEM_REPORT',
      sourceOrgId: orgId,
      sourceLocId: locId,
    };
    try {
      const response = await exportItemWisePurchaseData(payload);
      const newblob = await response.blob();
      setLoader(false);
      const headers = response.headers;
      const link = document.createElement('a');
      link.href = URL.createObjectURL(newblob);
      link.download = `VendorvsImsData.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setLoader(false);
    }
  };

  const handleButtonClick = () => {
    setShowDateRangeSelector(!showDateRangeSelector);
  };

  const onExport = async (e) => {
    setLoader(true);
    handleExportBigQueryReports(formatWithUnderscores(reportId));
  };

  const handleExportBigQueryReports = (reportValue) => {
    const payload = {
      from: reportValue !== 'PURCHASE_FORECASTING_REPORT' ? fromdate : null,
      to: reportValue !== 'PURCHASE_FORECASTING_REPORT' ? todate : null,
      sourceOrgId: orgId,
      sourceLocId: locId,
      purchaseWithReturnEnum: reportValue,
      requestedByName: userName,
      requestedByUidx: uidx,
    };
    if (!fromdate && !todate) {
      setLoader(false);
      showSnackBar('Select date range to export', 'error');
      return;
    }
    if (
      reportValue === 'BILLS_BY_VENDOR_REPORT' ||
      reportValue === 'PURCHASE_GST_REPORT_BY_VENDOR' ||
      reportValue === 'VENDOR_TRANSACTION_DETAIL_REPORT'
    ) {
      if (vendorid?.value) {
        payload.vendorId = [vendorid?.value || ''];
      } else {
        setLoader(false);
        showSnackBar('Select Vendor to generate report', 'error');
        return;
      }
    } else if (
      reportValue === 'VENDOR_WISE_PURCHASE_REPORT' ||
      reportValue === 'VENDOR_WISE_GRN_REPORT' ||
      reportValue === 'VENDOR_ITEMS_LIST' ||
      reportValue === 'UNPAID_VENDOR_REPORT' ||
      reportValue === 'VENDOR_PAYMENT_SUMMARY'
    ) {
      if (vendorid?.value) {
        payload.vendorId = [vendorid?.value];
      } else {
        payload.vendorId = [];
      }
    } else if (reportValue === 'PURCHASE_BY_BRAND') {
      if (brandId?.label) {
        payload.brand = brandId?.label;
      } else {
        setLoader(false);
        showSnackBar('Select Brand to generate report', 'error');
        return;
      }
    } else if (reportValue === 'PURCHASE_BY_CATEGORY') {
      if (categoryId?.label) {
        payload.category = categoryId?.label;
      } else {
        setLoader(false);
        showSnackBar('Select Category to generate report', 'error');
        return;
      }
    } else if (reportValue === 'CATEGORY_WISE_PURCHASE_REPORT') {
      if (categoryId?.label) {
        payload.category = categoryId?.label;
      }
      if (brandId?.label) {
        payload.brand = brandId?.label;
      }
    }

    exportPurchaseReportsBigQuery(payload)
      .then((res) => {
        const docUrl = res?.data?.data?.docUrl;

        if (docUrl) {
          window.open(docUrl, '_blank');
        } else {
          showSnackBar('Report is being generated', 'success');
        }
        setLoader(false);
        handleClose();
      })
      .catch((err) => {
        setLoader(false);
        handleClose();
      })
      .finally(() => {
        setFromdate();
        setTodate();
        setLoader(false);
      });
  };

  const onSave = () => {
    window.print();
  };

  let branchArr;
  const newArray = retail
    ?.map((e) => {
      const orgId = localStorage.getItem('orgId');
      if (e.retailId === orgId) {
        branchArr = e.branches.map((branch) => {
          return {
            label: branch.name,
            value: branch.branchId,
          };
        });
        return branchArr;
      }
    })
    ?.filter(Boolean);

  const currMonth = new Date().getMonth() + 1;
  const currentDate = new Date();
  const year = currentDate.getFullYear();

  const startDate = `${year}-${currMonth.toString().padStart(2, '0')}-01`;
  const lastDay = new Date(year, currMonth, 0).getDate();
  const endDate = `${year}-${currMonth.toString().padStart(2, '0')}-${lastDay.toString().padStart(2, '0')}`;

  const [lastSixmonths, setLastSixMonths] = useState([]);
  const [salesValues, setSalesValues] = useState([]);

  const loadVendorOptions = async (searchQuery, loadedOptions, { page }) => {
    const filterObject = {
      page: page,
      pageSize: 50,
      filterVendor: {
        searchText: searchQuery || null,
      },
    };
    try {
      const res = await getAllVendors(filterObject, orgId);
      const data = res?.data?.data?.vendors || [];
      const options = data?.map((item) => ({
        label: item?.vendorName,
        value: item?.vendorId,
      }));

      return {
        options,
        hasMore: data?.length >= 50,
        additional: { page: page + 1 },
      };
    } catch (error) {
      showSnackBar('Error fetching Vendors', 'error');
      return {
        options: [],
        hasMore: false,
      };
    }
  };

  const vendorsSelect = (
    <SoftAsyncPaginate
      placeholder="Select Vendor"
      menuPortalTarget={document.body}
      size="small"
      id="vendors"
      loadOptions={loadVendorOptions}
      additional={{
        page: 1,
      }}
      isClearable
      classNamePrefix="soft-select"
      onChange={(option) => {
        setVendorid(option);
      }}
    />
  );

  const loadBrandOptions = async (searchQuery, loadedOptions, { page }) => {
    const payload = {
      page: page,
      pageSize: 10, // Adjust as necessary
      sourceId: [orgId],
      sourceLocationId: [locId],
      brandName: [searchQuery] || [], // If searchQuery exists, use it
      active: [true],
    };

    try {
      const res = await getAllBrands(payload);
      if (res?.data?.status === 'ERROR') {
        showSnackBar(res?.data?.message, 'error');
        return {
          options: [],
          hasMore: false,
        };
      } else {
        const data = res?.data?.data?.results || [];
        const options = data?.map((item) => ({
          label: item?.brandName,
          value: item?.brandId,
        }));
        return {
          options,
          hasMore: data?.length >= 10, // Check if there's more data to load
          additional: {
            page: page + 1, // Increment the page for the next fetch
          },
        };
      }
    } catch (error) {
      showSnackBar('Error while fetching brands', 'error');
      return {
        options: [],
        hasMore: false,
      };
    }
  };

  const brandSelect = (
    <>
      <SoftAsyncPaginate
        className="select-box-category"
        placeholder="Select brand..."
        loadOptions={loadBrandOptions}
        additional={{
          page: 1,
        }}
        isClearable
        size="small"
        classNamePrefix="soft-select"
        menuPortalTarget={document.body}
        onChange={(option) => {
          setBrandId(option);
          if (filterState['brand'] === 0) {
            setFiltersApplied((prev) => prev + 1);
            setFilterState({ ...filterState, brand: 1 });
          }
        }}
      />
    </>
  );
  const loadMainCategoryOptions = async (searchQuery, loadedOptions, { page }) => {
    const payload = {
      page: page,
      pageSize: 50,
      type: ['APP'],
      sourceId: [orgId],
      sourceLocationId: [locId],
      active: [true],
    };

    try {
      const res = await getAllMainCategory(payload);
      if (res?.data?.status === 'ERROR') {
        showSnackBar(res?.data?.message, 'error');
        return {
          options: [],
          hasMore: false,
        };
      } else {
        const data = res?.data?.data?.results || [];
        const options = data?.map((item) => ({
          label: item?.categoryName,
          value: item?.mainCategoryId,
        }));
        return {
          options,
          hasMore: data?.length >= 50,
          additional: {
            page: page + 1,
          },
        };
      }
    } catch (error) {
      showSnackBar('Error while fetching main categories', 'error');
      return {
        options: [],
        hasMore: false,
      };
    }
  };
  const categorySelect = useMemo(
    () => (
      <SoftAsyncPaginate
        key={categoryId?.value}
        size="small"
        className="select-box-category"
        placeholder="Select category..."
        loadOptions={loadMainCategoryOptions}
        additional={{
          page: 1,
        }}
        isClearable
        onChange={(option) => {
          setCategoryId(option);
          // if (filterState['category'] === 0) {
          //   setFiltersApplied((prev) => prev + 1);
          //   setFilterState({ ...filterState, category: 1 });
          // }
        }}
        menuPortalTarget={document.body}
        classNamePrefix="soft-select"
      />
    ),
    [categoryId],
  );

  const itemSelect = (
    <>
      <SoftSelect
        placeholder="Select Item"
        id="Item"
        options={itemOptions || []}
        onChange={(e) => setSelectedItemNo(e)}
        onInputChange={(inputValue, event) => {
          if (event.action === 'input-change') {
            setItemSearch(inputValue);
          } else if (event.action === 'menu-close') {
            setItemSearch('');
          }
        }}
      ></SoftSelect>
    </>
  );
  const vendorfilter = [
    'purchaseGstReportByVendor',
    'BillsByVendorReport',
    'VendorTransactionDetailReport',
    'VendorWisePurchaseReport',
    'VendorWiseGrnReport',
    'VendorItemsList',
    'VendorPaymentSummary',
    'UnpaidVendorReport',
    'UnpaidVendorDailyReport',
  ];

  const selectBoxArray = useMemo(() => {
    const array = [];

    if (vendorfilter?.includes(reportId)) {
      array.push(vendorsSelect);
    }
    if (reportId === 'PurchaseByCategory' || reportId === 'CategoryWisePurchaseReport') {
      array.push(categorySelect);
    }
    if (reportId === 'PurchaseByBrand' || reportId === 'CategoryWisePurchaseReport') {
      array.push(brandSelect);
    }
    return array.filter(Boolean);
  }, [reportId]);

  // filter modal states
  const [filtersApplied, setFiltersApplied] = useState(0);
  const [filterState, setFilterState] = useState({
    vendor: 0,
    item: 0,
    status: 0,
    location: 0,
  });
  // end of filter modal states

  // filter box
  const [anchorEl2, setAnchorEl2] = useState(null);
  const open3 = Boolean(anchorEl2);
  const handleClickFilter = (event) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleCloseFilter = () => {
    setAnchorEl2(null);
  };
  // end of filter box

  // apply filter function
  const applyPurchaseFilter = () => {
    // set setIsApplied to true
    setIsApplied(true);

    // close filter modal box after 300ms
    setTimeout(() => {
      handleCloseFilter();
    }, 300);
  };

  const filterChipBoxes = (
    <>
      {/* vendors  */}
      {vendorid !== null && (
        <Box className="singleChipDisplayBox">
          <ChipBoxHeading heading="Vendor" />
          <Box className="insideSingleChipDisplayBox">
            <Chip
              label={vendorid?.label}
              onDelete={() => removeSelectedFilter('vendor')}
              deleteIcon={<CancelOutlinedIcon />}
              color="primary"
              variant="outlined"
            />
          </Box>
        </Box>
      )}

      {/* status  */}
      {status !== null && (
        <Box className="singleChipDisplayBox">
          <ChipBoxHeading heading="Status" />
          <Box className="insideSingleChipDisplayBox">
            <Chip
              label={status?.label}
              onDelete={() => removeSelectedFilter('status')}
              deleteIcon={<CancelOutlinedIcon />}
              color="primary"
              variant="outlined"
            />
          </Box>
        </Box>
      )}

      {/* location  */}
      {locationname !== null && (
        <Box className="singleChipDisplayBox">
          <ChipBoxHeading heading="Location" />
          <Box className="insideSingleChipDisplayBox">
            <Chip
              label={locationname?.label}
              onDelete={() => removeSelectedFilter('location')}
              deleteIcon={<CancelOutlinedIcon />}
              color="primary"
              variant="outlined"
            />
          </Box>
        </Box>
      )}
    </>
  );

  // remove selected filter function
  const removeSelectedFilter = (filterType) => {
    switch (filterType) {
      case 'vendor':
        setFiltersApplied((prev) => prev - 1);
        setVendorid(null);
        setFilterState({ ...filterState, vendor: 0 });
        break;
      // case 'item':
      //   setFiltersApplied((prev) => prev - 1);
      //   setSelectedSessionId();
      //   setFilterState({ ...filterState, session: 0 });
      //   break;
      case 'status':
        setFiltersApplied((prev) => prev - 1);
        setStatus(null);
        setFilterState({ ...filterState, status: 0 });
        break;
      case 'location':
        setFiltersApplied((prev) => prev - 1);
        setStatus(null);
        setFilterState({ ...filterState, location: 0 });
        break;
      default:
        return;
    }
  };

  // state to check wheather clear in filter box is clicked or not
  const [isClear, setIsClear] = useState(false);
  // state to check wheather apply is clicked or not
  const [isApplied, setIsApplied] = useState(false);

  // to clear the filter
  const handleClear = () => {
    setVendorid(null);
    setStatus(null);
    setLocationame(null);

    // reset the filterState
    setFilterState({ vendor: 0, item: 0, status: 0, location: 0 });
    // reset filters applied to 0
    setFiltersApplied(0);
    // set setIsClear to true
    setIsClear(true);
  };

  // run this useeffect when clear is clicked in filter and setIsClear set to true
  useEffect(() => {
    if (isClear) {
      applyPurchaseFilter();
      setIsClear(false);
    }
  }, [isClear]);

  const fetchBrandOptions = () => {
    if (reportId === 'PurchaseByBrand' || reportId === 'CategoryWisePurchaseReport') {
      const payload = {
        // sourceLocationId: [locId],
        // sourceId: [orgId],
      };
      getAllBrands(payload)
        .then((res) => {
          const results = res?.data?.data?.results || [];
          const data = results?.map((item) => ({
            value: item?.brandId,
            label: item?.brandName,
          }));
          setBrandOptions(data || []);
        })
        .catch(() => {});
    }
  };

  const fetchCategoryOptions = () => {
    if (reportId === 'PurchaseByCategory' || reportId === 'CategoryWisePurchaseReport') {
      const payload = {
        page: 1,
        pageSize: 50,
        // sourceLocationId: [locId],
        // sourceId: [orgId],
        // type: ['APP'],
      };
      getAllMainCategory(payload)
        .then((res) => {
          const results = res?.data?.data?.results || [];
          const data = results?.map((item) => ({
            value: item?.mainCategoryId,
            label: item?.categoryName,
          }));
          setCategoryOptions(data || []);
        })
        .catch(() => {});
    }
  };
  useEffect(() => {
    fetchBrandOptions();
    fetchCategoryOptions();
  }, []);

  const handleTextSpace = (text) => {
    return text
      ?.replace(/([A-Z])/g, ' $1')
      .trim()
      .replace(/^\w/, (c) => c.toUpperCase());
  };

  // fetch report availability

  const fetchReportData = () => {
    const newPayload = {
      documentName: formatWithUnderscores(reportId) || null,
      locId: locId,
      orgId: orgId,
      page: page,
      size: 10,
    };
    purchaseAvailabilityReport(newPayload)
      .then((res) => {
        if (res?.data?.data?.es === 0) {
          const reportList = res?.data?.data?.reportList || [];
          setTotalAvailabilityCount(res?.data?.data?.totalResults || 0);
          setReportAvailabilityData(reportList);
        } else {
          showSnackBar('Something went wrong', 'error');
        }
      })
      .catch((err) => {
        showSnackBar('Something went wrong', 'error');
      });
  };

  useEffect(() => {
    if (!loader) {
      fetchReportData();
    }

    const intervalId = setInterval(() => {
      fetchReportData();
    }, 30000);

    return () => clearInterval(intervalId);
  }, [loader, page]);

  const renderFilter =
    reportId === 'PurchaseByCategory' ||
    reportId === 'PurchaseByBrand' ||
    reportId === 'purchaseGstReportByVendor' ||
    reportId === 'BillsByVendorReport';
  return (
    <DashboardLayout>
      <DashboardNavbar prevLink={true} />

      {open && (
        <CreateNewReportModal
          open={open}
          handleClose={handleClose}
          selectBoxArray={selectBoxArray}
          loader={loader}
          setFromdate={setFromdate}
          setTodate={setTodate}
          onExport={onExport}
          // renderDateRange={renderDateRange}
        />
      )}
      <Container fixed sx={{ paddingLeft: '0 !important', paddingRight: '0 !important', paddingBottom: '15px ' }}>
        <div className="reportHeader">
          <SoftTypography variant="h6" color="white">
            {' '}
            <strong> {reportId?.length > 0 ? handleTextSpace(reportId) : 'Purchase over time'} </strong>
          </SoftTypography>
          <SoftButton size="small" onClick={handleOpen}>
            + Create new report
          </SoftButton>
        </div>
        <p style={{ fontSize: '0.7rem', margin: '5px 3px', color: 'dimgray', display: 'flex', alignItems: 'center' }}>
          <InfoOutlinedIcon style={{ marginRight: '8px', color: 'info' }} /> Data will be fetched every 30 seconds
        </p>
        {/* 
        <SoftBox style={{ display: 'flex', gap: '15px', padding: '15px' }}>
          <div>
            {loader ? (
              <SoftButton color="info">
                <CircularProgress className="circular-progress-dashboard" />
              </SoftButton>
            ) : (
              <SoftButton color="info" onClick={onExport}>
                <CloudDownloadOutlinedIcon style={{ marginRight: '10px' }} />
                Export
              </SoftButton>
            )}
          </div>
        </SoftBox> */}

        {reportId !== 'purchaseOverTime' && reportId !== 'purchaseByVendor' && (
          <Box>
            <Box style={{ height: 525, width: '100%' }} className="dat-grid-table-box">
              <DataGrid
                sx={{
                  ...dataGridStyles.header,
                  borderRadius: '20px',
                }}
                rows={reportAvailabilityData || []}
                columns={reportAvailabilityColumns}
                pageSize={10}
                page={page}
                pagination
                disableSelectionOnClick
                getRowId={(row) => row.reqId}
                className="data-grid-table-boxo"
                paginationMode="server"
                rowCount={totalAvailabilityCount || 0}
                onPageChange={(newPage) => setPage(newPage)}
              />
            </Box>
          </Box>
        )}
      </Container>
    </DashboardLayout>
  );
};

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  minWidth: '60vw !important',
  maxHeight: '90vh',
  bgcolor: 'background.paper',
  border: '1px solid lightgray',
  boxShadow: 24,
  // p: 4,
  borderRadius: 2,
  overflow: 'hidden',
};
export default Generalreports;
