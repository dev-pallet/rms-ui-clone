import { ThemeProvider } from '@emotion/react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  Chip,
  CircularProgress,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Modal,
  Tooltip,
  createTheme,
} from '@mui/material';
import { amber } from '@mui/material/colors';
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useMemo, useState } from 'react';
import './index.css';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';

import FilterListIcon from '@mui/icons-material/FilterList';
import { format, parseISO } from 'date-fns';
import dayjs from 'dayjs';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useDebounce } from 'usehooks-ts';
import HorizontalTimeline from '../../../../../../components/HorizontalTimeline/HorizontalTimeline';
import SoftBox from '../../../../../../components/SoftBox';
import SoftButton from '../../../../../../components/SoftButton';
import SoftSelect from '../../../../../../components/SoftSelect';
import SoftTypography from '../../../../../../components/SoftTypography';
import Spinner from '../../../../../../components/Spinner';
import {
  closeSessionForOpenJob,
  downloadStockReports,
  exportStockSessionReport,
  getAllOrgUsers,
  getAllRoles,
  getSessionAndItemRelatedData,
  getSessionItemsList,
  getStockCountJobDetails,
  handleRecountStock,
  stockAdjustment,
  updatejobSession,
} from '../../../../../../config/Services';
import DashboardLayout from '../../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../../examples/Navbars/DashboardNavbar';
import { useSnackbar } from '../../../../../../hooks/SnackbarProvider';
import { CopyToClipBoard, isSmallScreen, productIdByBarcode, textFormatter } from '../../../../Common/CommonFunction';
import Status from '../../../../Common/Status';
import { buttonStyles } from '../../../../Common/buttonColor';
import AdditionalDetails from '../../../../Common/new-ui-common-components/additional-details';
import CommentComponent from '../../../../Common/new-ui-common-components/comment-component';
import SoftInput from '../../../../../../components/SoftInput';
import CustomMobileButton from '../../../../Common/mobile-new-ui-components/button';
import MobileSearchBar from '../../../../Common/mobile-new-ui-components/mobile-searchbar';
import MobileFilterComponent from '../../../../Common/mobile-new-ui-components/mobile-filter';
import CommonStatus from '../../../../Common/mobile-new-ui-components/status';
import { getBatchesItemsLinkedWithSessions } from '../../../../../../config/Services';
import ProductCard from './mobile/productCard';
import ViewMore from '../../../../Common/mobile-new-ui-components/view-more';
import MobileDrawerCommon from '../../../../Common/MobileDrawer';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: 'white',
  borderRadius: '10px',
  width: '50%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  maxHeight: '90vh',
  overflow: 'auto',
};

const reasonList = [
  { value: 'STOCK ADDITION', label: 'Stock Addition' },
  { value: 'STOCK REDUCTION', label: 'Stock Reduction' },
  { value: 'WASTAGE', label: 'Wastage' },
  { value: 'SHRINKAGE', label: 'Shrinkage' },
  { value: 'THEFT', label: 'Theft' },
  { value: 'STORE USE', label: 'Store use' },
  { value: 'DAMAGED', label: 'Damaged' },
  { value: 'EXPIRED', label: 'Expired' },
  { value: 'PRODUCT NOT FOUND', label: 'Product not found' },
  { value: 'OTHERS', label: 'Others' },
];

const newSwal = Swal.mixin({
  customClass: {
    cancelButton: 'button button-error',
  },
});

export const StockCountDetails = () => {
  const navigate = useNavigate();
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const [expandedIndex, setExpandedIndex] = useState(null);
  const showSnackbar = useSnackbar();
  const isMobileDevice = isSmallScreen();
  const { jobId, sessionId } = useParams();
  const locName = localStorage.getItem('locName');
  const primary = amber;
  const user_details = JSON.parse(localStorage.getItem('user_details'));
  const createdByName = user_details.firstName + ' ' + user_details.secondName;
  const createdUidx = user_details.uidx;
  const chipColor = createTheme({
    palette: {
      secondary: {
        main: '#ffc107',
      },
    },
  });

  //location state
  const location = useLocation();
  const { state } = location;
  const { jobType } = state;

  const [isDownloading, setIsDownloading] = useState(false);
  const [statusDisabled, setStatusDisabled] = useState(false);
  const [varianceDisabled, setVarianceDisabled] = useState(false);
  const [usersList, setUsersList] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [assigneeType, setAssigneeType] = useState('');
  const [openReassign, setOpenReassign] = useState(false);
  const handleOpenReassign = () => setOpenReassign(true);
  const handleCloseReassign = () => {
    setSelectedUser('');
    setAssigneeType('');
    setOpenReassign(false);
  };
  const [handleRecountLoader, setHandleRecountLoader] = useState(false);
  const [handleApproveLoader, setHandleApproveLoader] = useState(false);
  const [isBulkUpdate, setIsBulkUpdate] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [showViewMore, setShowViewMore] = useState(true);
  const [initialLoader, setInitialLoader] = useState(false);
  const [infinityScrollLoader, setInfinityScrollLoader] = useState(false);
  const [batchesPageNumber, setBatchesPageNumber] = useState(0);
  const [showViewMoreBatches, setShowViewMoreBatches] = useState(true);
  const [batchesLoader, setBatchesLoader] = useState(false);
  const [isClickedApprove, setClickedApprove] = useState(false);

  const handleBatchOpenReassign = () => {
    if (selectedJobIds.length === 0) {
      showSnackbar('Please select atleast one product', 'warning');
      return;
    }
    setOpenReassign(true);
  };
  // job details response object
  const [jobDetailsObj, setJobDetailsObj] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [fetchSessionLoader, setFetchSessionLoader] = useState(false);

  //search debouncing
  const [productSearch, setProductSearch] = useState(null);
  const debouncedSearchValue = useDebounce(productSearch, 500);

  // for stock adjustment
  const [stockAdjustObj, setStockAdjustObj] = useState({});
  const [selectedStockAdjustProductSessionId, setSelectedStockAdjustProductSessionId] = useState('');
  // to display in the adjust popup screen
  const [sessionAndItemRelatedData, setSessionAndItemRelatedData] = useState({});
  const [disableRecount, setDisableRecount] = useState(false);
  const [selectedJobIds, setSelectedJobIds] = useState([]);
  const [jobItemsPayload, setJobItemsPayload] = useState({
    pageNumber: 0,
    pageSize: 25,
    sessionId: sessionId,
  });
  const [totalSessionItems, setTotalSessionItems] = useState(0);
  const [filterValues, setFilterValues] = useState([]);
  const [varianceSort, setVarianceSort] = useState('');
  const [sortType, setSortingType] = useState('');
  const [anchorElOptions, setAnchorElOptions] = useState(null);
  const [showBatchTimline, setShowBatchTimeline] = useState({
    open: false,
    index: 0,
  });
  const [loader, setLoader] = useState(false);
  const openOptions = Boolean(anchorElOptions);
  const handleClickOptions = (event) => {
    setAnchorElOptions(event.currentTarget);
  };
  const handleCloseOptions = () => {
    setAnchorElOptions(null);
  };

  useEffect(() => {
    if (debouncedSearchValue !== null) {
      if (jobItemsPayload?.pageNumber === 0) {
        fetchSessionProducts();
      } else {
        setJobItemsPayload((prev) => ({ ...prev, pageNumber: 0 }));
      }
    }
  }, [debouncedSearchValue]);

  //filter state

  const [openFilter, setOpenFilter] = useState(false);
  const filterOpen = Boolean(openFilter);

  const handleOpenFilter = (e) => {
    setOpenFilter(e.currentTarget);
  };

  const handleCloseFilter = () => {
    setOpenFilter(null);
  };

  const handleCheckboxChange = (event, productSessionId) => {
    if (event.target.checked) {
      setSelectedJobIds((prev) => [...prev, productSessionId]);
    } else {
      setSelectedJobIds((prev) => prev.filter((gtin) => gtin !== productSessionId));
    }
  };
  const assigneeNames = jobDetailsObj?.assignees?.map((el) => el.assigneeName).join('\n') || 'NA';

  // <--- menu
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event, row) => {
    setVarianceDisabled(row?.variance);
    setStatusDisabled(row?.status !== 'APPROVAL_PENDING');
    setSelectedStockAdjustProductSessionId(row?.productSessionId);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  // --->

  const timelineStatusObject = (statusName, userName, date, time) => {
    switch (statusName) {
      case 'STOCK_CYCLE_CREATED':
        return {
          name: 'Stock cycle created',
          iconColor: '#0562fb',
          icon: <AddCircleOutlineIcon />,
          userDesc: `Created by ${userName}`,
          dateTime: `${date} ${time}`,
        };
      default:
        return {
          name: 'Name Not Found',
          iconColor: '#0562fb',
          icon: '',
          userDesc: 'Unknown User',
          dateTime: 'Unknown Date',
        };
    }
  };

  const timelineData = [
    {
      ...timelineStatusObject(
        'STOCK_CYCLE_CREATED',
        jobDetailsObj?.timeline?.created || createdByName,
        dayjs(jobDetailsObj.created).format('MMMM D, YYYY, h:mm A') || 'NA',
        dayjs(jobDetailsObj.created).format(' h:mm A') || 'NA',
      ),
    },
  ];

  const columns = [
    {
      field: 'title',
      headerName: 'Title',
      minWidth: 180,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'barcode',
      headerName: 'Barcode',
      minWidth: 130,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      renderCell: (params) => <CopyToClipBoard params={params} />,
    },
    {
      field: 'status',
      headerName: 'Status',
      minWidth: 150,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      renderCell: (params) => <Status label={params?.value} />,
    },

    {
      field: 'expectedQuantity',
      headerName: 'Expected Quantity',
      minWidth: 100,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'primaryCount',
      headerName: 'Primary Count',
      minWidth: 100,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'variancePercent',
      headerName: 'Variance',
      minWidth: 100,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      renderCell: (params) => <span>{params?.value}%</span>,
    },
    {
      field: 'counter',
      headerName: 'Counter',
      minWidth: 100,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      renderCell: (params) => (
        <Tooltip title={params?.value} placement="top">
          <IconButton>
            <AccountCircleIcon color="primary" sx={{ width: '1em', height: '1em' }} />
          </IconButton>
        </Tooltip>
      ),
    },
    {
      field: 'menu',
      headerName: '',
      minWidth: 100,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      renderCell: (params) => {
        return (
          <SoftBox>
            <SoftButton
              id="basic-button"
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={(e) => handleClick(e, params?.row)}
              className="stock-count-details-menu"
            >
              {/*     <MoreVertRoundedIcon sx={{ fontSize: '14px' }} /> */}
              <MoreHorizIcon color="primary" sx={{ width: '1.5em', height: '1.5em' }} />
            </SoftButton>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              <MenuItem
                disabled={statusDisabled || varianceDisabled}
                onClick={() => {
                  handleUpdateJobSession('COMPLETED');
                  handleClose();
                }}
              >
                Approve
              </MenuItem>
              <MenuItem
                disabled={statusDisabled || handleRecountLoader}
                onClick={() => {
                  handleRecount();
                }}
              >
                {handleRecountLoader ? <CircularProgress size={18} sx={{ color: '#0562fb !important' }} /> : 'Recount'}
              </MenuItem>
              <MenuItem disabled={statusDisabled} onClick={handleOpenModalStockAdjustment}>
                Adjust
              </MenuItem>
              <MenuItem onClick={handleStockAdjustmentView}>View</MenuItem>
            </Menu>
          </SoftBox>
        );
      },
    },
  ];

  const array = [
    ...(jobType !== 'OPEN'
      ? [
          {
            tabName: 'Products Assigned',
            tabValue: 'productsAssigned',
            tabDescription: `out of ${jobDetailsObj?.totalProducts ?? 0}`,
            tabIcon: '',
          },
        ]
      : [
          {
            tabName: 'Target Products',
            tabValue: 'targetProduct',
            tabDescription: '',
            tabIcon: '',
          },
        ]),
    {
      tabName: 'Count',
      tabValue: 'count',
      tabDescription: `of ${jobDetailsObj?.productAssigned ?? 0} products`,
      tabIcon: '',
    },
    {
      tabName: 'Effort',
      tabValue: 'effort',
      tabDescription: `of ${jobDetailsObj?.totalCounted ?? 0} products`,
      tabIcon: '',
    },
    {
      tabName: 'Reviewed',
      tabValue: 'reviewed',
      tabDescription: `of ${jobDetailsObj?.productAssigned ?? 0} products`,
      tabIcon: '',
    },
    {
      tabName: 'Variance in quantity',
      tabValue: 'varianceInQuantity',
      tabDescription: (
        <div className="variance-item-container">
          <span>
            {jobDetailsObj?.deficitProductCount ?? 0} products
            <ArrowDownwardIcon style={{ color: 'red' }} />
          </span>
          <span>
            {jobDetailsObj?.excessProductCount ?? 0} products
            <ArrowUpwardIcon style={{ color: 'green' }} />
          </span>
        </div>
      ),
      tabIcon: '',
    },
    {
      tabName: 'Variance in value',
      tabValue: 'varianceInValue',
      tabDescription: `from ${jobDetailsObj?.productWithVarianceCount ?? 0} products`,
      tabIcon: '',
    },
  ];

  //change for time conversion
  function convertMinutesToHoursAndMinutes(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return { hours: hours, minutes: minutes };
  }
  //change for time conversion

  const additionalDetails = useMemo(() => {
    const time = convertMinutesToHoursAndMinutes(jobDetailsObj?.totalTimeTaken ?? 0);
    return {
      productsAssigned: jobDetailsObj?.productAssigned ?? 0,
      targetProduct: jobDetailsObj?.targetProduct ?? 0,
      count: jobDetailsObj?.totalCounted ?? 0,
      effort: time?.hours + 'h ' + time?.minutes + 'm' ?? 'NA',
      reviewed: jobDetailsObj?.totalReviewed ?? 0,
      // varianceInQuantity: '-3%',
      varianceInQuantity: (
        <div className="variance-item-container">
          <span>
            ({jobDetailsObj?.deficitVariancePercent ?? 0}%)
            <ArrowDownwardIcon style={{ color: 'red' }} />
          </span>
          <span>
            {jobDetailsObj?.excessVariancePercent ?? 0}%<ArrowUpwardIcon style={{ color: 'green' }} />
          </span>
        </div>
      ),
      varianceInValue: `₹ ${Math.round(jobDetailsObj?.varianceValue) ?? 0}`,
    };
  }, [jobDetailsObj]);

  const [openModalStockAdjustment, setOpenModalStockAdjustment] = useState(false);
  const [modalSaveLoader, setModalSaveLoader] = useState(false);

  const handleOpenModalStockAdjustment = () => {
    getDataAdjustPopup();
    setOpenModalStockAdjustment(true);
  };

  const [isViewing, setIsViewing] = useState(false);
  const handleStockAdjustmentView = () => {
    setIsViewing(true);
    getDataAdjustPopup();
    setOpenModalStockAdjustment(true);
  };

  const handleCloseModalInventoryAdjustment = () => {
    // setStockAdjustObj({
    //   sessionId: '',
    //   adjustedQuantity: 0,
    //   reason: '',
    // });
    setStockAdjustObj({});
    setOpenModalStockAdjustment(false);
    setIsViewing(false);
    toggleHorizontalTimeline(null);
    handleClose();
  };

  const handleReportExport = async (downloadType) => {
    setIsDownloading(true);
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const payload = { exportType: 'excel', generatedByName: createdByName, generatedBy: createdUidx };
      if (downloadType === 'session') {
        payload.sessionId = sessionId;
      } else {
        payload.jobId = jobId;
      }

      const response = await exportStockSessionReport(payload);
      showSnackbar('Report Exported Successfully, check after some time', 'success');
    } catch (err) {
      console.log(err);
      showSnackbar(err?.response?.data?.message || 'Some error occurred', 'error');
    } finally {
      setIsDownloading(false);
      setAnchorElOptions(null);
      handleMobileDrawerClose();
    }
  };
  const handleReportDownload = async (downloadType) => {
    setIsDownloading(true);
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const payload = {};
      if (downloadType === 'session') {
        payload.sessionId = sessionId;
      } else {
        payload.jobId = jobId;
      }

      const response = await downloadStockReports(payload);
      if (response?.data?.data?.es > 0) {
        showSnackbar(response?.data?.data?.message || 'Some error occurred', 'error');
        return;
      }
      const link = document.createElement('a');
      link.href = response?.data?.data?.url;
      link.download = response?.data?.data?.url;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      showSnackbar(err?.response?.data?.message || 'Some error occurred', 'error');
    } finally {
      setIsDownloading(false);
      setAnchorElOptions(null);
      handleMobileDrawerClose();
    }
  };

  const handleDownloadProductsList = () => {
    const fileUrl = jobDetailsObj?.fileUrl; // Replace with your actual response variable
    if (!fileUrl) {
      alert('File URL is missing!');
      return;
    }
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = fileUrl;
    // Set the file name or use the name from the URL
    link.download = fileUrl.split('/').pop(); // Extracts the file name from URL
    // Programmatically click the link to trigger the download
    link.click();
    // Clean up by removing the link element
    link.remove();
  };
  

  const getAllUsers = () => {
    const payload = {
      orgId: orgId,
      contextId: locId,
    };
    let dataArr = [];

    if (!locId) {
      showSnackbar(`No location found for ${orgId}`, 'error');
    } else {
      getAllOrgUsers(payload)
        .then((response) => {
          dataArr = response.data.data;
          getAllRoles(localStorage.getItem('contextType'))
            .then((res) => {
              // const allRoles = res.data.data;
              const newDataRows = dataArr?.map((row) => {
                return {
                  label: textFormatter(row?.firstName + ' ' + row?.secondName),
                  value: row?.firstName,
                  name: row?.firstName + ' ' + row?.secondName,
                  uidx: row?.uidx,
                };
              });

              // name, assignee type - (primary, secondary), uidx
              setUsersList(newDataRows);
            })
            .catch((err) => {
              console.log(err);
              showSnackbar(err?.response?.data?.message || 'Some error occurred', 'error');
            });
        })
        .catch((err) => {
          console.log(err);
          showSnackbar(err?.response?.data?.message || 'Some error occurred', 'error');
        });
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  function getCurrentDateFormatted() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = today.getFullYear();

    return `${year}-${month}-${day}`;
  }

  const fetchSessionProducts = async () => {
    setFetchSessionLoader(true);
    if (debouncedSearchValue !== null) {
      jobItemsPayload.textSearch = debouncedSearchValue;
    }
    if(isMobileDevice){jobItemsPayload?.pageNumber === 0 && setInitialLoader(true)}
    try {
      const itemsResponse = await getSessionItemsList(jobItemsPayload);
      if (itemsResponse?.data?.data?.es > 0 || itemsResponse?.data?.status === 'ERROR') {
        setTotalSessionItems([]);
        setTableData([]);
        setFetchSessionLoader(false);
        setShowViewMore(false);
        setInitialLoader(false);
        if (jobType !== 'OPEN') {
          showSnackbar(itemsResponse?.data?.data?.message || 'Some error occurred', 'error');
        }
        setIsFilterOpened(false);
        setApplyFilter(false);
        return;
      }

      const showViewMoreButton = (jobItemsPayload?.pageNumber + 1) * itemsResponse?.data?.data?.pageSize < itemsResponse?.data?.data?.total;
      if (!showViewMoreButton) {
        setShowViewMore(false);
        setInitialLoader(false);
      }

      const rows = itemsResponse?.data?.data?.session?.products?.map((item) => {
        return {
          id: item?.itemJobId || 'NA',
          title: item?.itemName || 'NA',
          barcode: item?.gtin || 'NA',
          expectedQuantity: item?.totalImsQuantity ?? 0,
          primaryCount: item?.userCount || 0,
          variancePercent: item?.totalImsQuantity ? item?.variancePercent : 'N/A',
          isVariance: item?.isVariance,
          status: item?.status || 'NA',
          ...(isMobileDevice ? { isChecked: false } : {}),
          ...item,
        };
      });
      setTotalSessionItems(itemsResponse?.data?.data?.total);
      if(isMobileDevice){
        if(productSearch || jobItemsPayload.pageNumber === 0){
          setTableData(rows);
        }else{
          setTableData((prev) => ([...prev, ...rows])); 
        }
        setIsFilterOpened(false);
        setApplyFilter(false);
      }else{
        setTableData(rows);
      }
      setFetchSessionLoader(false);
      handleCloseFilter();
      setInfinityScrollLoader(false);
      setInitialLoader(false);
    } catch (error) {
      setTotalSessionItems([]);
      setTableData([]);
      setFetchSessionLoader(false);
      setInitialLoader(false);
      if (jobType !== 'OPEN') {
        showSnackbar(itemsResponse?.data?.data?.message || 'Some error occurred', 'error');
      }
      setInfinityScrollLoader(false);
      setIsFilterOpened(false);
      setApplyFilter(false);
    }
  };
  //filter functionality

  const handleFilter = () => {
    const statusesFilter = filterValues.map((item) => item.value);
    const varinanceFilter = varianceSort?.value || '';

    setJobItemsPayload((prev) => ({ ...prev, statuses: statusesFilter, sortOrder: varinanceFilter, sort: sortType }));
  };

  const handleClearFilter = () => {
    if (filterValues.length === 0) {
      showSnackbar('No status selected', 'error');
      return;
    }
    setFilterValues([]);
    setJobItemsPayload((prev) => {
      const { statuses, ...rest } = prev;
      return rest;
    });
  };
  const getJobDetails = async () => {
    try {
      setLoader(true);
      const currentDate = getCurrentDateFormatted();

      const response = await getStockCountJobDetails(jobId, currentDate, sessionId);

      if (response?.data?.data?.es === 0) {
        setJobDetailsObj(response?.data?.data?.job);
        setLoader(false);
        // add in table data
      } else {
        showSnackbar(response?.data?.data?.message || 'Some error occurred', 'error');
        setLoader(false);
      }
    } catch (err) {
      console.log(err);
      setLoader(false);
    }
  };

  // data to display on the the adjust stock popup
  const getDataAdjustPopup = async (pageNumber) => {
    try {
      if(batchesLoader){
        return;
      }
      setBatchesLoader(true);
      // const response = await getSessionAndItemRelatedData(psid ? psid : selectedStockAdjustProductSessionId);
      // change productSession to session
      const payload = {
        productSessionId: selectedStockAdjustProductSessionId,
        pageNumber: pageNumber || 0,
        pageSize: 10,
      };

      setBatchesPageNumber(pageNumber ?? 0);

      const response = await getBatchesItemsLinkedWithSessions(payload);
      if (response?.data?.data?.es) {
        showSnackbar(response?.data?.data?.message, 'error');
        setBatchesLoader(false);
        return;
      }
      const approvalTime = response?.data?.data?.session?.approvalTime ?? 'NA';
      const mutatedData = {
        ...response?.data?.data?.session,
        batches: response?.data?.data?.session?.batches.map((item) => {
          return {
            ...item,
            // adjustedQuantity: '',
            adjustedQuantity: +((item?.userQuantity ?? 0) - (item?.imsQuantity ?? 0)).toFixed(2),
            reason: '',
            timelineData: [
              {
                timestamp: format(parseISO(item?.created), 'dd MMM, hh:mm a'),
                title: 'Quantity when job created',
                value: item?.imsQuantity,
                events: [
                  { type: 'inwarded', value: item?.inwardBefore },
                  { type: 'sold', value: item?.salesBefore },
                  { type: 'transfer', value: item?.stockTransferBefore },
                  { type: 'adjusted', value: item?.adjustmentBefore },
                ],
              },
              {
                timestamp: format(parseISO(item?.submitTime || item?.created), 'dd MMM, hh:mm a'),
                title: 'Count value',
                value: item?.userQuantity,
                events: [
                  { type: 'inwarded', value: item?.inwardAfter },
                  { type: 'sold', value: item?.salesAfter },
                  { type: 'transfer', value: item?.stockTransferAfter },
                  { type: 'adjusted', value: item?.adjustmentAfter },
                ],
              },
              {
                timestamp: approvalTime === 'NA' ? '-' : format(parseISO(approvalTime), 'dd MMM, hh:mm a'),
                title: 'Updated expected quantity',
                value: item?.updatedAvailableQuantity || '0',
                events: [],
              },
            ],
            status: item?.status,
            showTimeline: false,
          };
        }),
      };

      // view or hide view more button for fetching batches
      const showViewMoreButton =
      (payload.pageNumber + 1) * response?.data?.data?.pageSize < response?.data?.data?.total;
      setShowViewMoreBatches(showViewMoreButton);

      if(pageNumber){
        setSessionAndItemRelatedData((prev)=>({...prev, batches:[...prev.batches, ...mutatedData.batches]}));
      }else{
        setSessionAndItemRelatedData(mutatedData);
      }
      setStockAdjustObj({});
      setBatchesLoader(false);
    } catch (err) {
      console.log(err);
      setBatchesLoader(false);
    }
  };

  const handleChangeAdjustInventory = (e, batchSessionId, name) => {
    const value =
      name === 'reason'
        ? {
            value: e.value,
            label: e.label,
          }
        : e.target.value;
    setSessionAndItemRelatedData((prev) => ({
      ...prev,
      batches: prev.batches.map((item) => {
        if (item.batchSessionId === batchSessionId) {
          return { ...item, [name]: value };
        }
        return item;
      }),
    }));
  };
  
  const handleUpdateAdjustInventory = async () => {
    for (const item of sessionAndItemRelatedData?.batches || []) {
      if (item?.variance) {
        if (!item?.adjustedQuantity) {
          showSnackbar('Please enter the adjusted quantity', 'warning');
          return;
        }
        if (!item?.reason?.value) {
          showSnackbar('Please select the reason', 'warning');
          return;
        }
      }
    }
    try {
      if(isClickedApprove){
        return;
      }
      setClickedApprove(true);

      const payload = {
        productSessionId: selectedStockAdjustProductSessionId,
        batches: sessionAndItemRelatedData?.batches.map((item) => ({
          batchSessionId: item?.batchSessionId,
          adjustmentValue: Number(item?.adjustedQuantity),
          reason: item?.reason?.label || '',
        })),
        updatedBy: createdUidx,
        updatedByName: createdByName,
      };
      const response = await stockAdjustment(payload);
      if (response?.data?.data?.es === 0) {
        showSnackbar('Success', 'success');
        fetchSessionProducts();
        handleCloseModalInventoryAdjustment();
        toggleHorizontalTimeline(null);
        setClickedApprove(false);
        return;
      }

      showSnackbar(response?.data?.data?.message || 'Some error occurred', 'error');
      setClickedApprove(false);
    } catch (err) {
      console.log(err);
      setClickedApprove(false);
    }
  };

  const handleUpdateJobSession = async (actionType) => {
    // action type will be APPROVE, REASSIGN, RECOUNT,
    try {
      const type = actionType !== 'REASSIGN' ? 'STATUS' : 'REASSIGN';
      const payload = {
        productSessionIds: [selectedStockAdjustProductSessionId],
        actionType: type,
        value: actionType,
        updatedBy: createdUidx,
        updatedByName: createdByName,
      };
      if (actionType === 'REASSIGN') {
        payload.reassignedUidx = selectedUser?.uidx;
        payload.reassignedName = selectedUser?.name;
        payload.reassigneeType = assigneeType?.value;
      }
      const response = await updatejobSession(payload);
      if (response?.data?.data?.es) {
        showSnackbar(response?.data?.data?.message, 'error');
        return;
      }

      showSnackbar(response?.data?.data?.message, 'success');
      setSelectedJobIds([]);
      refetchData();
      handleCloseReassign();
    } catch (err) {
      console.log(err);
    }
  };

  // for approving or re-assigning multiple job items,
  const handleBulkUpdateJobSession = async (actionType, disableBulkApprove) => {
    // action type will be - APPROVE, REASSIGN
    if (selectedJobIds.length === 0) {
      showSnackbar('Please select atleast one product', 'warning');
      return;
    }
    if (actionType === 'COMPLETED' && disableBulkApprove) {
      showSnackbar(
        'Products cannot be approved due to variance or being in the Created state or Completed State',
        'error',
      );
      return;
    }
    if (selectedJobIds.length > 1) {
      setIsBulkUpdate(true);
    }
    setHandleApproveLoader(true);
    try {
      const type = actionType !== 'REASSIGN' ? 'STATUS' : 'REASSIGN';
      const payload = {
        productSessionIds: selectedJobIds,
        actionType: type,
        value: actionType,
        updatedBy: createdUidx,
        updatedByName: createdByName,
      };
      if (actionType === 'REASSIGN') {
        payload.reassignedUidx = selectedUser?.uidx;
        payload.reassignedName = selectedUser?.name;
        payload.reassigneeType = assigneeType?.value;
      }

      const response = await updatejobSession(payload);

      if (response?.data?.data?.es) {
        showSnackbar(response?.data?.data?.message, 'error');
        return;
      }
      setHandleApproveLoader(false);
      showSnackbar(response?.data?.data?.message, 'success');
      if (selectedJobIds.length > 1) {
        setIsBulkUpdate(false);
      }
      setSelectedJobIds([]);
      refetchData();
      handleCloseReassign();
    } catch (err) {
      showSnackbar('Something went wrong', 'error');
    }
  };

  useEffect(() => {
    getJobDetails();
  }, []);

  useEffect(() => {
    fetchSessionProducts();
  }, [jobItemsPayload?.pageNumber, jobItemsPayload?.statuses, jobItemsPayload?.sort]);

  const selectedCount = useMemo(() => selectedJobIds?.length, [selectedJobIds]);

  const handleReassignCounter = async () => {
    if (!selectedUser) {
      showSnackbar('Please select a user', 'warning');
      return;
    }
    if (!assigneeType) {
      showSnackbar('Please select assignee type', 'warning');
      return;
    }
    if (selectedJobIds.length) {
      handleBulkUpdateJobSession('REASSIGN');
      return;
    } else {
      handleUpdateJobSession('REASSIGN');
    }
  };
  
  //handle recount function
  const handleRecount = async ({productSessionId}) => {
    if(productSessionId === undefined){
    if (selectedJobIds?.length === 0) {
      showSnackbar('Please select atleast one product', 'warning');
      return;
    }
    if (selectedJobIds?.length > 1) {
      setIsBulkUpdate(true);
    }
    if (disableRecount) {
      return showSnackbar('Recount is not required for COMPLETED or CREATED items', 'error');
    }
  }
    setHandleRecountLoader(true);
    const recountPayload = {
      productSessionIds: productSessionId ? [productSessionId] : selectedJobIds, // psid(product session id for single recount)
      updatedBy: createdUidx,
      updatedByName: createdByName,
    };
    try {
      const response = await handleRecountStock(recountPayload);
      if (response?.data?.data?.es > 0) {
        showSnackbar(response?.data?.data?.message || 'Something Went Wrong', 'success');
        return;
      }
      if (selectedJobIds?.length === 1) { // || productSessionId !== undefined
        handleClose();
      }
      if(productSessionId){
        setTableData([]);
        setJobItemsPayload((prev) => ({...prev, pageNumber: 0}))
      }
      setSelectedJobIds([]);
      fetchSessionProducts();
      getJobDetails();
      setHandleRecountLoader(false);
      setIsBulkUpdate(false);

      showSnackbar(response?.data?.data?.message, 'success');
    } catch (err) {
      setHandleRecountLoader(false);
      showSnackbar(err?.response?.data?.message || 'Some error occurred', 'error');
    }
  };

  const statuses = useMemo(
    () => [
      { value: 'CREATED', label: 'Created' },
      { value: 'INPROGRESS', label: 'Inprogress' },
      { value: 'APPROVAL_PENDING', label: 'Approval pending' },
      { value: 'COMPLETED', label: 'Completed' },
    ],
    [],
  );

  const varianceOptions = useMemo(
    () => [
      { value: 'ASCENDING', label: 'Ascending', type: 'VARIANCE' },
      { value: 'DESCENDING', label: 'Descending', type: 'VARIANCE' },
    ],
    [],
  );

  const isCycleJob = useMemo(() => jobDetailsObj?.jobType === 'CYCLE', [jobDetailsObj?.jobType]);
  const isOpenJob = useMemo(() => jobDetailsObj?.jobType === 'OPEN', [jobDetailsObj?.jobType]);
  const isCustomJob = useMemo(() => jobDetailsObj?.jobType === 'CUSTOM', [jobDetailsObj?.jobType])

  const refetchData = () => {
    getJobDetails();
    fetchSessionProducts();
  };

  const [disableBulkApprove, setDisableBulkApprove] = useState(false);
  const jobStatusCheck = (newSelection) => {
    const selectedObjects = tableData.filter((obj) => newSelection.includes(obj.productSessionId));
    const isApprovalPending = selectedObjects.some((item) => {
      return !(item?.variance === false && item?.status === 'APPROVAL_PENDING');
    });
    const disableRecount = selectedObjects?.some((item) => {
      return item?.status === 'COMPLETED' || item?.status === 'CREATED';
    });
    setDisableRecount(disableRecount);
    setDisableBulkApprove(isApprovalPending);
  };

  const handleProductSearch = (value) => {
    setTableData([]);
    setProductSearch(value);
  };

  const toggleHorizontalTimeline = (index) => {
    const mutatedBatchesToggle = {
      ...sessionAndItemRelatedData,
      batches: sessionAndItemRelatedData?.batches.map((item, i) => {
        return {
          ...item,
          showTimeline: i === index ? !item.showTimeline : false,
        };
      }),
    };
    setSessionAndItemRelatedData(mutatedBatchesToggle);
  };

  const closeSession = async () => {
    try {
      const payload = {
        updatedBy: jobDetailsObj?.updatedBy,
        updatedByName: jobDetailsObj?.updatedByName,
        sessionId: sessionId,
      };
      const response = await closeSessionForOpenJob(payload);

      if (response?.data?.data?.es) {
        showSnackbar(textFormatter(response?.data?.data?.message) || 'Something went wrong', 'error');
      } else {
        refetchData();
      }
    } catch (err) {
      showSnackbar('Something went wrong', 'error');
    }
  };

  const handleCloseSession = async () => {
    const result = await newSwal.fire({
      title: 'Close Session?',
      text: 'Are you sure you want to close the Session.',
      icon: 'warning',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      showCancelButton: true,
      showLoaderOnConfirm: true,
    });

    if (result.isConfirmed) {
      if(isMobileDevice){
        handleMobileDrawerClose();
      }
      await closeSession();
    }
  };

  const handleProductNavigation = async (barcode) => {
    try {
      if(isFetching) return;

      setIsFetching(true);
      const productId = await productIdByBarcode(barcode);
      if (productId) {
        navigate(`/products/product/details/${productId}`);
      }else{
        showSnackbar('Product Not Found', 'error')
      }

      setIsFetching(false);
    } catch (error) {
      showSnackbar('Something Went Wrong', 'error');
      setIsFetching(false);
    }
  };  

  const handlePageChange = (newPage) => {
    setInfinityScrollLoader(true);

    setJobItemsPayload({
      ...jobItemsPayload,
      pageNumber: newPage,
    });
  }

  // filters for mobile
  const [isFilterOpened, setIsFilterOpened] = useState(false);
  const [mainSelecetedFilter, setMainSelectedFilter] = useState('');
  const [selectedSubFilters, setSelectedSubFilters] = useState({});
  const [applyFilter, setApplyFilter] = useState(false);

  const filters = useMemo(() => [
    { filterLabel: 'Status', filterValue: 'status' },
    { filterLabel: 'Variance', filterValue: 'variance' },
  ],[]);

  const filterOptions = useMemo(() => ({
    status: statuses,
    variance: varianceOptions,
  }), [])

  const filter_CreateHandler = () => {
    let title = { 
      filter: true,
      create: false,
    };
    return title;
  };    

  const [selectAll, setSelectAll] = useState(false);

  // Toggle Select All
  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setTableData(prevTableData =>
      prevTableData.map(item => ({ ...item, isChecked: !selectAll }))
    );

    setSelectedJobIds(!selectAll 
      ? tableData.map(item => item?.productSessionId) // Add all productSessionId values when selecting all
      : [] // Clear jobId when deselecting all
    );
  };

  // Toggle single selection
  const handleSingleSelect = (product) => {
    setSelectAll(false); // Deselect "Select All" if any single item is selected
    setTableData(prevTableData =>
      prevTableData.map(item => ({
        ...item,
        isChecked: item?.barcode === product?.barcode ? !item?.isChecked : item?.isChecked,
      }))
    );

    if(product?.isChecked){
      const filteredJobIds = selectedJobIds?.filter(el=>el !== product?.productSessionId);
      setSelectedJobIds(filteredJobIds);
    }else{
      setSelectedJobIds(prev=>[...prev, product?.productSessionId]);
    }
  };

  useEffect(() => {
    jobStatusCheck(selectedJobIds)
  },[selectedJobIds])

  useEffect(() => {
    if (isMobileDevice && Object.keys(selectedSubFilters)?.length) {
      setFilterValues(selectedSubFilters?.['status'] || []);
      setVarianceSort(selectedSubFilters?.['variance']?.[0] || '');
      setSortingType(selectedSubFilters?.['variance']?.[0]?.type || '');
    }else{
      setFilterValues([]);
      setVarianceSort('');
      setSortingType('');
    }
  }, [mainSelecetedFilter, selectedSubFilters])  

  useEffect(() => {
    if(applyFilter){
      if(mainSelecetedFilter){
        handleFilter();
      }else{
        handleClearFilter();
      }
    }
  },[applyFilter])

  const [isMobileDrawerOpened, setMobileDrawerOpen] = useState(false);
  const handleMobileDrawerClose = () => {
    setMobileDrawerOpen(false);
  }

  // <-- for download report drawer mobile 
  const [variant, setVariant] = useState(null);
  const buttons = [
    {
      condition: isOpenJob && jobDetailsObj?.sessionData?.[0].status !== 'COMPLETED',
      title: 'Close Session',
      onClick: handleCloseSession,
      icon: <PowerSettingsNewIcon fontSize="small" />,
    },
    {
      condition: isCustomJob,
      title: 'Products List',
      onClick: handleDownloadProductsList,
      icon: <FileDownloadIcon fontSize="small" />,
    },
    {
      title: 'Generate Session Report',
      onClick: () => handleReportExport('session'),
      icon: <FileDownloadIcon fontSize="small" />,
    },
    {
      title: 'Generate Job Report',
      onClick: () => handleReportExport('job'),
      icon: <FileDownloadIcon fontSize="small" />,
    },
    {
      title: 'Download Session Report',
      onClick: () => handleReportDownload('session'),
      icon: <FileDownloadIcon fontSize="small" />,
    },
    {
      title: 'Download Job Report',
      onClick: () => handleReportDownload('job'),
      icon: <FileDownloadIcon fontSize="small" />,
    },
  ];  
  // -->

  // this is only for New Mobile Screen ROS_APP_UI
  if (isMobileDevice) {
    return (
      <div className="purchase-details-main-div purchase-details-all-flex">
        <div className="stack-row-center-between width-100 purchase-action-button-tools">
          <div className="stack-row-center-between action-btn-purchase-ros-app">
            <CommonStatus status={jobDetailsObj?.sessionData?.[0]?.status} />
          </div>
          <div>
            <IconButton onClick={() => setMobileDrawerOpen((prev) => !prev)}>
              <MoreHorizIcon />
            </IconButton>
          </div>
        </div>
        <div className="stack-row-center-between width-100">
          <div className="flex-colum-align-start">
            <span className="purchase-id-title">Stock Count-{jobDetailsObj?.title || ' NA'}</span>
          </div>
        </div>
        <AdditionalDetails additionalDetailsArray={array} additionalDetails={additionalDetails} />

        {/* Basic detail section start here*/}
        <div className="stock-count-details-main">
          <span className="purch-det-heading-title pinsights-title">Basic Detail</span>

          <hr className="horizontal-line-app-ros" />

          <div className="listing-card-bg-secondary">
            <div className="stack-row-center-between width-100">
              <div className="flex-colum-align-start">
                <span className="bill-card-label">Job type</span>
                <span className="bill-card-value">{jobDetailsObj?.jobType || 'NA'}</span>
              </div>
              <div className="flex-colum-align-end">
                <span className="bill-card-label">Total product</span>
                <span className="bill-card-value">{jobDetailsObj?.productAssigned || 'NA'}</span>
              </div>
            </div>
            <div className="stack-row-center-between width-100">
              <div className="flex-colum-align-start">
                <span className="bill-card-label">Frequency</span>
                <span className="bill-card-value">{jobDetailsObj?.frequency || 'NA'}</span>
              </div>
              <div className="flex-colum-align-end">
                <span className="bill-card-label">Product group</span>
                <span className="bill-card-value">{jobDetailsObj?.productFilter?.fieldName || 'NA'}</span>
              </div>
            </div>
            <div className="stack-row-center-between width-100">
              <div className="flex-colum-align-start">
                <span className="bill-card-label">Group Value</span>
                <span className="bill-card-value">{jobDetailsObj?.productFilter?.fieldValue || 'NA'}</span>
              </div>
              <div className="flex-colum-align-end">
                <span className="bill-card-label">Estimated Effort (minutes)</span>
                <span className="bill-card-value">{jobDetailsObj?.estimatedTime ?? 'NA'} mins</span>
              </div>
            </div>
            <div className="stack-row-center-between width-100">
              <div className="flex-colum-align-start">
                <span className="bill-card-label">Created Date</span>
                <span className="bill-card-value">
                  {jobDetailsObj?.created ? jobDetailsObj?.created?.split('T')[0] : 'NA'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* stock count detail section start here*/}
        <div className="stock-count-detail-outerbox">
          <span className="purchase-id-title">Stock count detail</span>
          <MobileSearchBar
            value={productSearch}
            placeholder={'Search products'}
            isScannerSearchbar={false}
            onChangeFunction={({ target }) => handleProductSearch(target.value)}
          />
          <div className="stack-row-center-between w-100">
            <MobileFilterComponent
              filters={filters}
              filterOptions={filterOptions}
              createButtonTitle={'Session Item Lists'}
              // createButtonFunction={createButtonFunction}
              mainSelecetedFilter={mainSelecetedFilter}
              setMainSelectedFilter={setMainSelectedFilter}
              selectedSubFilters={selectedSubFilters}
              setSelectedSubFilters={setSelectedSubFilters}
              applyFilter={applyFilter}
              setApplyFilter={setApplyFilter}
              isFilterOpened={isFilterOpened}
              setIsFilterOpened={setIsFilterOpened}
              filterCreateExist={filter_CreateHandler()}
            />
          </div>
          <div className="stack-row-center-between w-100">
            <div className="stack-row-center-between action-btn-purchase-ros-app">
              <CustomMobileButton
                loading={handleApproveLoader}
                title="Approve"
                variant="green-D"
                onClickFunction={() => handleBulkUpdateJobSession('COMPLETED', disableBulkApprove)}
              />
              <CustomMobileButton
                loading={handleRecountLoader && isBulkUpdate}
                title="Recount"
                variant="black-P"
                onClickFunction={handleRecount}
              />
            </div>
            <div>
              <Checkbox
                icon={<RadioButtonUncheckedIcon fontSize="1rem" />}
                checkedIcon={<RadioButtonCheckedIcon fontSize="1rem" />}
                className="stock-count-details-checkbox"
                sx={{ paddingRight: '12px' }}
                checked={selectAll}
                // checked={batchesData?.productNotFound}
                onChange={handleSelectAll}
              />
            </div>
          </div>
          <hr className="horizontal-line-app-ros" />

          {initialLoader && (
            <div className="content-center w-100">
              <CircularProgress size={20} sx={{ color: '#0562fb !important' }} />
            </div>
          )}

          {tableData?.map((product, index) => (
            <ProductCard
              product={product}
              key={product.productSessionId}
              createdUidx={createdUidx}
              createdByName={createdByName}
              fetchSessionProducts={fetchSessionProducts}
              handleSingleSelect={handleSingleSelect}
              handleRecount={handleRecount}
              handleRecountLoader={handleRecountLoader}
              handleProductNavigation={handleProductNavigation}
            />
          ))}

          {showViewMore && (jobItemsPayload?.pageNumber + 1) * jobItemsPayload.pageSize < totalSessionItems ? (
            <ViewMore
              loading={infinityScrollLoader}
              handleNextFunction={() => handlePageChange(jobItemsPayload.pageNumber + 1)}
            />
          ) : null}
        </div>

        {/* mobile drawer  */}
        <MobileDrawerCommon
          anchor="bottom"
          className="filter-values-main-div"
          drawerOpen={isMobileDrawerOpened}
          drawerClose={handleMobileDrawerClose}
        >
          <div className="select-options-parent-div">
            <div className="select-options-main-div">
              {buttons?.map((btn, index) =>
                btn?.condition === false ? null : (
                  <div key={index} className="select-option-div">
                    <CustomMobileButton
                      // disable={variant === index && isDownloading}
                      onClickFunction={() => {
                        if (!isDownloading) {
                          btn?.onClick();
                          setVariant(index);
                        }
                      }}
                      variant={variant === index ? 'black-P' : 'transparent'}
                      title={btn.title}
                      width="100%"
                      iconOnLeft={btn.icon}
                    />
                  </div>
                ),
              )}
            </div>
          </div>
        </MobileDrawerCommon>
      </div>
    );
  }

  return (
    <DashboardLayout>
      {!isMobileDevice && <DashboardNavbar prevLink={true} />}
      {/* 1 */}
      <SoftBox className="container-card">
        <SoftBox className="stock-count-header-container">
          {/* left  */}
          <SoftBox sx={{ width: !isMobileDevice ? '70%' : '100%' }}>
            <SoftTypography fontWeight="bold">
              Stock Count - {jobDetailsObj?.title}
              <span style={{ marginLeft: '10px', marginRight: '20px', display: 'inline-block' }}>
                <ThemeProvider theme={chipColor}>
                  <Chip //main category
                    label={jobDetailsObj?.sessionData?.[0]?.status || 'NA'}
                    color={'secondary'}
                    variant="outlined"
                  />
                </ThemeProvider>
              </span>
            </SoftTypography>
            <SoftTypography fontSize="14px" fontWeight="bold">
              Location
            </SoftTypography>
            <SoftTypography fontSize="14px">{jobDetailsObj?.locationName || locName}</SoftTypography>
            {/* bottom  */}
            <SoftBox className="content-left" mt={3} gap="30px" sx={{ alignItems: 'flex-start !important' }}>
              <SoftBox>
                <SoftTypography fontSize="14px" fontWeight="bold">
                  Job Type
                </SoftTypography>
                <br />
                <SoftTypography fontSize="14px">{jobDetailsObj?.jobType || 'NA'}</SoftTypography>
              </SoftBox>
              <SoftBox>
                <SoftTypography fontSize="14px" fontWeight="bold">
                  Frequency
                </SoftTypography>
                <br />
                <SoftTypography fontSize="14px">{jobDetailsObj?.frequency || 'NA'}</SoftTypography>
              </SoftBox>
              <SoftBox>
                <SoftTypography fontSize="14px" fontWeight="bold">
                  Product Group
                </SoftTypography>
                <br />
                <SoftTypography fontSize="14px">{jobDetailsObj?.productFilter?.fieldName || 'NA'}</SoftTypography>
              </SoftBox>
              <SoftBox>
                <SoftTypography fontSize="14px" fontWeight="bold">
                  Group Value
                </SoftTypography>
                <br />
                <SoftTypography fontSize="14px">{jobDetailsObj?.productFilter?.fieldValue || 'NA'}</SoftTypography>
              </SoftBox>
              <SoftBox>
                <SoftTypography fontSize="14px" fontWeight="bold">
                  Estimated Effort (minutes)
                </SoftTypography>
                <br />
                <SoftTypography fontSize="14px">{jobDetailsObj?.estimatedTime ?? 'NA'} mins</SoftTypography>
              </SoftBox>
              <SoftBox>
                <SoftTypography fontSize="14px" fontWeight="bold">
                  Counter
                </SoftTypography>
                <SoftTypography fontSize="14px" sx={{ marginTop: '15px' }}>
                  <Tooltip title={assigneeNames}>
                    <IconButton>
                      <AccountCircleIcon color="primary" sx={{ width: '1.5em', height: '1.5em' }} />
                    </IconButton>
                  </Tooltip>
                </SoftTypography>
              </SoftBox>
            </SoftBox>
          </SoftBox>
          {/* right  */}
          <SoftBox sx={{ width: !isMobileDevice ? '30%' : '100%' }}>
            <SoftBox className="content-space-between">
              <div className="cycle-count-container">
                {isCycleJob && (
                  <>
                    <SoftTypography fontSize="16px" fontWeight="bold">
                      Stock Cycle Count
                    </SoftTypography>
                    <SoftTypography fontWeight="bold">{jobDetailsObj?.totalCount ?? 'NA'}</SoftTypography>
                  </>
                )}
              </div>
              <IconButton
                id="basic-button"
                aria-controls={openOptions ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={openOptions ? 'true' : undefined}
                onClick={handleClickOptions}
                className="stock-count-details-options"
              >
                <MoreHorizIcon color="primary" />
              </IconButton>
              <Menu
                id="basic-menu"
                anchorEl={anchorElOptions}
                open={openOptions}
                onClose={handleCloseOptions}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
              >
                {isOpenJob && jobDetailsObj?.sessionData?.[0].status !== 'COMPLETED' && (
                  <MenuItem onClick={() => handleCloseSession()} style={{ display: 'flex' }}>
                    <ListItemIcon>
                      <PowerSettingsNewIcon fontSize="small" />
                    </ListItemIcon>
                    <div>Close Session</div>
                  </MenuItem>
                )}
                {isCustomJob && (
                  <MenuItem onClick={() => handleDownloadProductsList()} style={{ display: 'flex' }}>
                    <ListItemIcon>
                      <FileDownloadIcon fontSize="small" />
                    </ListItemIcon>
                    <div>Products List</div>
                  </MenuItem>
                )}
                <MenuItem
                  disabled={isDownloading}
                  onClick={() => handleReportExport('session')}
                  style={{ display: 'flex' }}
                >
                  <ListItemIcon>
                    <FileDownloadIcon fontSize="small" />
                  </ListItemIcon>
                  <div>Generate Session Report</div>
                </MenuItem>
                <MenuItem
                  disabled={isDownloading}
                  onClick={() => handleReportExport('job')}
                  style={{ display: 'flex' }}
                >
                  <ListItemIcon>
                    <FileDownloadIcon fontSize="small" />
                  </ListItemIcon>
                  <div>Generate Job Report</div>
                </MenuItem>
                <MenuItem
                  disabled={isDownloading}
                  onClick={() => handleReportDownload('session')}
                  style={{ display: 'flex' }}
                >
                  <ListItemIcon>
                    <FileDownloadIcon fontSize="small" />
                  </ListItemIcon>
                  <div>Download Session Report</div>
                </MenuItem>
                <MenuItem
                  disabled={isDownloading}
                  onClick={() => handleReportDownload('job')}
                  style={{ display: 'flex' }}
                >
                  <ListItemIcon>
                    <FileDownloadIcon fontSize="small" />
                  </ListItemIcon>
                  <div>Download Job Report</div>
                </MenuItem>
              </Menu>
            </SoftBox>
            <SoftBox className="content-left">
              <SoftTypography fontSize="14px" sx={{ width: '50%' }}>
                Created On
              </SoftTypography>
              <SoftTypography fontSize="14px" sx={{ width: '50%' }}>
                {dayjs(jobDetailsObj?.created).format('MMMM D, YYYY, h:mm A') || 'NA'}
              </SoftTypography>
            </SoftBox>
            <SoftBox className="content-left">
              <SoftTypography fontSize="14px" sx={{ width: '50%' }}>
                Created By
              </SoftTypography>
              <SoftTypography fontSize="14px" sx={{ width: '50%' }}>
                {jobDetailsObj?.createdByName || createdByName}
              </SoftTypography>
            </SoftBox>
            <SoftBox className="content-left">
              <SoftTypography fontSize="14px" sx={{ width: '50%' }}>
                Last Updated
              </SoftTypography>
              <SoftTypography fontSize="14px" sx={{ width: '50%' }}>
                {dayjs(jobDetailsObj?.updated).format('MMMM D, YYYY, h:mm A') || 'NA'}
              </SoftTypography>
            </SoftBox>
            {jobType === 'OPEN' && (
              <SoftBox className="content-left">
                <SoftTypography fontSize="14px" sx={{ width: '50%' }}>
                  Inward Start Date
                </SoftTypography>
                <SoftTypography fontSize="14px" sx={{ width: '50%' }}>
                  {jobDetailsObj?.inwardStartDate || 'NA'}
                </SoftTypography>
              </SoftBox>
            )}
            {isCycleJob && (
              <>
                <SoftBox className="content-left">
                  <SoftTypography fontSize="14px" sx={{ width: '50%' }}>
                    Total Count
                  </SoftTypography>
                  <SoftTypography fontSize="14px" sx={{ width: '50%' }}>
                    {jobDetailsObj?.totalCount ?? 'NA'}
                  </SoftTypography>
                </SoftBox>
                <SoftBox className="content-left">
                  <SoftTypography fontSize="14px" sx={{ width: '50%' }}>
                    Successful Counts
                  </SoftTypography>
                  <SoftTypography fontSize="14px" sx={{ width: '50%' }}>
                    {jobDetailsObj?.successfulCount ?? 'NA'}
                  </SoftTypography>
                </SoftBox>
                <SoftBox className="content-left">
                  <SoftTypography fontSize="14px" sx={{ width: '50%' }}>
                    Successful Reviews
                  </SoftTypography>
                  <SoftTypography fontSize="14px" sx={{ width: '50%' }}>
                    {jobDetailsObj?.successfulReviews ?? 'NA'}
                  </SoftTypography>
                </SoftBox>
                <SoftBox className="content-left">
                  <SoftTypography fontSize="14px" sx={{ width: '50%' }}>
                    Missed Counts
                  </SoftTypography>
                  <SoftTypography fontSize="14px" sx={{ width: '50%' }}>
                    {jobDetailsObj?.missedCount ?? 'NA'}
                  </SoftTypography>
                </SoftBox>
              </>
            )}
          </SoftBox>
        </SoftBox>
      </SoftBox>

      {/* 2 */}
      <SoftBox sx={{ height: loader ? '80px' : 'auto' }} className={loader ? 'content-center' : ''}>
        {loader ? (
          <CircularProgress size={20} sx={{ color: '#0562fb !important' }} />
        ) : (
          <AdditionalDetails additionalDetailsArray={array} additionalDetails={additionalDetails} />
        )}
      </SoftBox>

      <SoftBox sx={{ marginTop: '20px' }} className="content-space-between-align-top">
        <SoftBox sx={{ width: '100%', flex: '1' }}>
          {/* stock count details  */}
          <SoftBox className="content-space-between" mb={1}>
            <SoftTypography fontSize="14px" fontWeight="bold">
              Stock Count Details
            </SoftTypography>
            <SoftBox className="stock-count-product-details-tools">
              <SoftBox>
                <input
                  type="text"
                  placeholder="Search Product..."
                  className="stock-count-product-search"
                  onChange={(e) => handleProductSearch(e.target.value)}
                />
              </SoftBox>
              <IconButton aria-label="refresh" onClick={refetchData}>
                <RefreshIcon style={{ color: 'var(--blue)' }} />
              </IconButton>
              <ThemeProvider theme={chipColor}>
                <Chip
                  label={
                    <div className="recount-loader">
                      {handleRecountLoader && isBulkUpdate ? (
                        <CircularProgress size={20} sx={{ color: '#0562fb !important' }} />
                      ) : (
                        <span> Recount</span>
                      )}
                    </div>
                  }
                  color={'secondary'}
                  variant="outlined"
                  sx={{ marginRight: '10px' }}
                  onClick={handleRecount}
                  disabled={handleRecountLoader}
                />
                <Chip
                  label={
                    <div className="recount-loader">
                      {handleApproveLoader ? (
                        <CircularProgress size={20} sx={{ color: '#0562fb !important' }} />
                      ) : (
                        <span>Approve</span>
                      )}
                    </div>
                  }
                  color={'primary'}
                  variant="outlined"
                  onClick={() => handleBulkUpdateJobSession('COMPLETED', disableBulkApprove)}
                />
                <IconButton onClick={(e) => handleOpenFilter(e)}>
                  <FilterListIcon />
                </IconButton>
              </ThemeProvider>
            </SoftBox>
          </SoftBox>
          <SoftBox>
            <SoftBox sx={{ height: 400, width: '100%' }}>
              <DataGrid
                columns={columns}
                rows={tableData}
                loading={fetchSessionLoader}
                pageSize={jobItemsPayload?.pageSize || 25}
                rowsPerPageOptions={[]}
                getRowId={(row) => row.productSessionId}
                pagination
                hideFooterPagination={fetchSessionLoader}
                onCellClick={({ row, field }) => {
                  if (field === 'menu' || field === 'checkbox' || field === 'barcode' || field === '__check__') {
                    return;
                  }
                  // window.open(`${window.location.origin}/products/all-products/details/${row.gtin}`, '_blank');
                  handleProductNavigation(row?.gtin);
                }}
                onPageChange={(newPage) => {
                  setJobItemsPayload({
                    ...jobItemsPayload,
                    pageNumber: newPage,
                  });
                  // handlePageChange(newPage)
                }}
                rowCount={totalSessionItems}
                paginationMode="server"
                sx={{
                  '& .MuiDataGrid-row:hover': {
                    cursor: 'pointer',
                  },
                }}
                checkboxSelection
                disableSelectionOnClick
                onSelectionModelChange={(newSelection) => {
                  jobStatusCheck(newSelection);
                  setSelectedJobIds(newSelection);
                }}
                selectionModel={selectedJobIds}
                components={{
                  LoadingOverlay: function DataGridCircularProgress(props) {
                    return (
                      <div className="datagrid-internal-circular-progress">
                        <CircularProgress size={40} sx={{ color: '#0562fb !important' }} {...props} />
                      </div>
                    );
                  },
                }}
              />
            </SoftBox>
          </SoftBox>
          {/* comments  */}
          <CommentComponent />
        </SoftBox>
      </SoftBox>
      <br />
      {/* modal  */}
      <Modal
        // sx={{width:'60%'}}
        open={openModalStockAdjustment}
        onClose={handleCloseModalInventoryAdjustment}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <SoftBox
          initial={{ y: 100, x: 0 }}
          animate={{ y: 0, x: 0 }}
          transition={{
            type: 'linear',
          }}
          style={{
            padding: '20px',
            maxHeight: '90vh',
            overflow: 'auto',
          }}
          className="stock-adjustment-modal-div"
        >
          <SoftTypography fontSize="14px" fontWeight="bold">
            Stock Adjustment
          </SoftTypography>
          <SoftBox className="content-left" flexWrap="wrap" gap="20px" mt={2} mb={2}>
            <SoftBox>
              <SoftTypography fontSize="14px">Expected Quantity</SoftTypography>
              <SoftTypography className="stock-adjust-quantity" fontSize="14px">
                {sessionAndItemRelatedData?.totalImsQuantity ?? 'NA'}
              </SoftTypography>
            </SoftBox>
            <SoftBox>
              <SoftTypography fontSize="14px">Primary Count</SoftTypography>
              <SoftTypography className="stock-adjust-quantity" fontSize="14px">
                {sessionAndItemRelatedData?.userCount ?? '0'}
              </SoftTypography>
            </SoftBox>
            <SoftBox>
              <SoftTypography fontSize="14px">Variance in Quantity</SoftTypography>
              <SoftTypography className="stock-adjust-quantity" fontSize="14px">
                {sessionAndItemRelatedData?.varianceQuantity ?? 'NA'}
              </SoftTypography>
            </SoftBox>
            <SoftBox>
              <SoftTypography fontSize="14px">Variance in Value</SoftTypography>
              <SoftTypography className="stock-adjust-quantity" fontSize="14px">
                ₹{Math.round(sessionAndItemRelatedData?.varianceValue) ?? 'NA'}
              </SoftTypography>
            </SoftBox>
          </SoftBox>

          {sessionAndItemRelatedData?.batches?.map((item, index) => {
            const variance =
              item?.stockInHand !== null && item?.stockInHand !== undefined && item?.stockInHand !== 'NA'
                ? +((item?.stockInHand ?? 0) - (item?.updatedAvailableQuantity ?? 0)).toFixed(2)
                : 'NA';
            return (
              <Accordion key={index} className="stock-count-accordion">
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                  <SoftTypography className="heading">
                    Batch <span style={{ color: 'var(--blue)', fontWeight: 'bold' }}>{item?.batchNumber || 'N/A'}</span>
                  </SoftTypography>
                </AccordionSummary>
                <AccordionDetails>
                  <div className="stock-batch-accordion-item">
                    <div>
                      <SoftTypography fontSize="14px">Inventory Location</SoftTypography>
                      <SoftTypography fontSize="14px" color="primary" className="stock-adjust-batch-quantity">
                        {item?.layoutName || 'NA'}
                      </SoftTypography>
                    </div>
                    <div>
                      <SoftTypography fontSize="14px">Expected Count</SoftTypography>
                      <SoftTypography fontSize="14px" className="stock-adjust-batch-quantity">
                        {item?.imsQuantity || '0'}
                      </SoftTypography>
                    </div>
                    <div>
                      <SoftTypography fontSize="14px">Primary Count</SoftTypography>
                      <SoftTypography fontSize="14px" className="stock-adjust-batch-quantity">
                        {item?.userQuantity ?? 'NA'}
                      </SoftTypography>
                    </div>
                    <div>
                      <SoftTypography fontSize="14px">Variance in Quantity</SoftTypography>
                      <SoftTypography fontSize="14px" className="stock-adjust-batch-quantity">
                        {/* {item?.status === 'CREATED' ? 0 : variance} {item?.unitOfMeasurement ?? ''} */}
                        {item?.varianceCount} {item?.unitOfMeasurement ?? ''}
                      </SoftTypography>
                    </div>
                    <div>
                      <SoftTypography fontSize="14px">Stock In Hand</SoftTypography>
                      <SoftTypography fontSize="14px" color="primary" className="stock-adjust-batch-quantity">
                        {item?.unitOfMeasurement !== 'kg'
                          ? item?.stockInHand ?? 'NA'
                          : item?.stockInHand?.toFixed(2) ?? 'NA'}{' '}
                        {/* {+((+item?.imsQuantity ?? 0) + +item?.adjustedQuantity).toFixed(2)}{' '} */}
                        {item?.unitOfMeasurement || 'NA'}
                      </SoftTypography>
                    </div>
                  </div>
                  <div>
                    <button className="horizontal-timeline-opener" onClick={() => toggleHorizontalTimeline(index)}>
                      {item?.showTimeline ? 'Hide Timeline' : 'Show Timeline'}
                    </button>
                  </div>
                  {item?.showTimeline && (
                    <div>
                      <HorizontalTimeline data={item?.timelineData} status={item?.status} />
                    </div>
                  )}
                  <SoftBox display="flex" alignItems="center" gap={3} justifyContent="space-between">
                    <SoftBox flex="1">
                      {!isViewing && (
                        <>
                          <SoftTypography fontSize="14px" bold>
                            Adjustment Value
                          </SoftTypography>
                          <SoftInput
                            value={item.adjustedQuantity}
                            type="number"
                            placeholder="Enter Quantity"
                            name="adjustedQuantity"
                            onChange={(e) => handleChangeAdjustInventory(e, item?.batchSessionId, 'adjustedQuantity')}
                            disabled={!item?.variance}
                          />
                        </>
                      )}
                    </SoftBox>
                    <SoftBox flex="1">
                      {!isViewing && (
                        <>
                          <SoftTypography fontSize="14px" bold>
                            Adjustment Reason
                          </SoftTypography>
                          <SoftSelect
                            placeholder="Select Reason"
                            value={item.reason}
                            name="reason"
                            onChange={(e) => handleChangeAdjustInventory(e, item?.batchSessionId, 'reason')}
                            options={reasonList}
                            isDisabled={!item?.variance}
                            classNamePrefix={item?.variance ? 'stock-soft-select' : 'stock-soft-select-disabled'}
                          />
                        </>
                      )}
                    </SoftBox>
                  </SoftBox>
                </AccordionDetails>
              </Accordion>
            );
          })}
          {showViewMoreBatches && (
            <ViewMore loading={batchesLoader} handleNextFunction={() => getDataAdjustPopup(batchesPageNumber + 1)} />
          )}
          <br />
          <SoftBox sx={{ marginBottom: '10px !important' }}>
            <SoftBox className="header-submit-box-i">
              <SoftButton
                onClick={handleCloseModalInventoryAdjustment}
                variant={buttonStyles.secondaryVariant}
                className="outlined-softbutton"
              >
                Cancel 
              </SoftButton>
              {modalSaveLoader ? (
                <Spinner />
              ) : (
                !isViewing && (
                  <SoftButton
                    variant={buttonStyles.primaryVariant}
                    className="vendor-add-btn contained-softbutton"
                    disabled={isClickedApprove}
                    onClick={handleUpdateAdjustInventory}
                  >
                    Approve
                  </SoftButton>
                )
              )}
            </SoftBox>
          </SoftBox>
        </SoftBox>
      </Modal>
      <Modal
        open={openReassign}
        onClose={handleCloseReassign}
        aria-labelledby="reassign-modal"
        aria-describedby="reassign-modal"
      >
        <SoftBox sx={modalStyle}>
          <SoftTypography fontSize="14px" fontWeight="bold" mb={2}>
            Re-assign counter{' '}
            {!!selectedCount && <span style={{ color: '#0562fb' }}>({`${selectedCount} selected`})</span>}
          </SoftTypography>
          <div>
            <SoftTypography fontSize="14px">Counter</SoftTypography>
            <SoftSelect
              placeholder="Select Counter"
              value={selectedUser}
              name="assignee"
              onChange={(e) => setSelectedUser(e)}
              options={usersList}
              menuPortalTarget={document.body}
              classNamePrefix="soft-select"
            />
          </div>
          <div>
            <SoftTypography fontSize="14px" mt={1}>
              Assignee Type
            </SoftTypography>
            <SoftSelect
              placeholder="Select Type"
              value={assigneeType}
              name="assigneeType"
              onChange={(e) => setAssigneeType(e)}
              options={[
                {
                  label: 'Primary',
                  value: 'PRIMARY',
                },
                {
                  label: 'Secondary',
                  value: 'SECONDARY',
                },
              ]}
              menuPortalTarget={document.body}
              classNamePrefix="soft-select"
            />
          </div>
          <div className="reassign-buttons">
            <SoftButton
              variant={buttonStyles.secondaryVariant}
              onClick={handleCloseReassign}
              className="outlined-softbutton"
            >
              CANCEL
            </SoftButton>
            <SoftButton
              variant={buttonStyles.primaryVariant}
              className="contained-softbutton"
              onClick={handleReassignCounter}
            >
              RE-ASSIGN
            </SoftButton>
          </div>
        </SoftBox>
      </Modal>
      <Menu
        id="filter-menu"
        anchorEl={openFilter}
        open={filterOpen}
        onClose={handleCloseFilter}
        MenuListProps={{
          'aria-labelledby': 'filter-menu',
        }}
        sx={{ height: 'auto', width: '400px !important', marginRight: '40px' }}
      >
        <div className="laptop-filter-stock-taking">
          <SoftTypography fontSize="14px" sx={{ marginBottom: '8px' }}>
            Select Status
          </SoftTypography>
          <SoftSelect
            value={filterValues}
            options={statuses}
            isMulti
            menuPortalTarget={document.body}
            menuPlacement="top"
            classNamePrefix="soft-select"
            onChange={(e) => setFilterValues(e)}
          />
          <SoftTypography fontSize="14px" sx={{ marginBottom: '8px', marginTop: '10px' }}>
            Sort by Variance
          </SoftTypography>
          <SoftSelect
            value={varianceSort}
            options={varianceOptions}
            menuPortalTarget={document.body}
            menuPlacement="top"
            classNamePrefix="soft-select"
            onChange={(e) => {
              setVarianceSort(e);
              setSortingType(e?.type);
            }}
          />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '10px',
              width: '100%',
              marginTop: '10px',
            }}
          >
            <SoftButton variant="outlined" color="info" onClick={handleClearFilter}>
              Clear
            </SoftButton>
            <SoftButton variant="contained" color="info" onClick={handleFilter}>
              Apply
            </SoftButton>
          </div>
        </div>
      </Menu>
    </DashboardLayout>
  );
};
