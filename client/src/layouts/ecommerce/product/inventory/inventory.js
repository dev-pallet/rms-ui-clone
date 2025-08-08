import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import {
  Button,
  Card,
  Chip,
  CircularProgress,
  Divider,
  Drawer,
  FormControlLabel,
  FormGroup,
  Radio,
  Stack,
  Tab,
  Tabs,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Modal from '@mui/material/Modal';
import Snackbar from '@mui/material/Snackbar';
import { DataGrid } from '@mui/x-data-grid';
import SoftAvatar from 'components/SoftAvatar';
import SoftBox from 'components/SoftBox';
import SoftButton from 'components/SoftButton';
import SoftInput from 'components/SoftInput';
import SoftSelect from 'components/SoftSelect';
import SoftTypography from 'components/SoftTypography';
import Spinner from 'components/Spinner/index';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import BarcodeScannerComponent from 'react-qr-barcode-scanner';
import {
  exportAnalysisPdf,
  // getInventoryListMobile,
  exportInventoryAdjustmentData,
  exportInventoryDataV2,
  getInventoryBatchByGtin,
  getinventorygtindata,
  getInventoryListInitial,
  getInventoryListMobile,
  getStorageDataListNextLevel,
  getStorageHierarchy,
  getSubStorageDataLists,
  getTopLevelStorageDataLists,
  getTotalQuantityOrderedForGtins,
  postAdjustInventoryBatch,
  postinventoryadjusmenttabledata,
} from '../../../../config/Services';
import './data/inventory.css';
// import 'react-date-range/dist/styles.css';
// import 'react-date-range/dist/theme/default.css';
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';
import EditIcon from '@mui/icons-material/Edit';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import BeatLoader from 'react-spinners/BeatLoader';
import { v4 as uuidv4 } from 'uuid';
import {
  ClearSoftInput,
  CopyToClipBoard,
  dateFormatter,
  decimalPointFormatter,
  productIdByBarcode,
  textFormatter,
} from '../../Common/CommonFunction';
import './inventory.css';
// import BarcodeBorder from '../../../../assets/images/barcode-border.png';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SouthIcon from '@mui/icons-material/South';
import dayjs from 'dayjs';
import ImgUpload from '../../../../assets/images/upload-image.png';
import MobileNavbar from '../../../../examples/Navbars/MobileNavbar/mobile-navbar-drawer';
import { useSnackbar } from '../../../../hooks/SnackbarProvider';
import { buttonStyles } from '../../Common/buttonColor';
import Filter from '../../Common/Filter';
import { ChipBoxHeading } from '../../Common/Filter Components/filterComponents';
import CommonSearchBar from '../../Common/MobileSearchBar';
import InvMobCard from './components/inventory-mobile-card/inv-mob-card';

import { useDebounce } from 'usehooks-ts';
import breakpoints from '../../../../assets/theme/base/breakpoints';
import BottomNavbar from '../../../../examples/Navbars/BottomNavbarMob';
import InventoryAnalysis from './inventory-categorization/tabs/InventoryAnalysis';
import ProfitAnalysis from './inventory-categorization/tabs/ProfitAnalysis';
import SalesAnalysis from './inventory-categorization/tabs/SalesAnalysis';

export const Inventory = ({ showExport }) => {
  const navigate = useNavigate();
  const [openmodelLocation, setOpenmodelLocation] = useState(false);
  const [inventoryData, setInventoryData] = useState([]);
  const [locationData, setLocationData] = useState(null);
  const [invtable, setInvtable] = useState([]);
  const [anchorElAction, setAnchorElAction] = useState(null);
  const [barcodeData, setBarcodeData] = useState('Not Found');
  const [gtinTableData, setGTinTableData] = useState([]);
  const [exportData, setExport] = useState('');
  const [exportLoader, setExportLoader] = useState(false);
  // to toggle storage location hierarchy
  const [showLocationHierarchy, setShowLocationHierarchy] = useState(false);
  const [storageHierarchyArr, setStorageHierarchyArr] = useState([]);

  const openAction = Boolean(anchorElAction);
  //  loader
  const [loader, setLoader] = useState(false);
  // let inventoryTab = JSON.parse(localStorage.getItem("inventoryTab"));
  // if(!inventoryTab){
  //   inventoryTab = { tab1: true};
  //   localStorage.setItem("inventoryTab",JSON.stringify({'tab1':true}));
  // }
  // const [tabs, setTabs] = useState({
  //   tab1: inventoryTab['tab1']!== undefined ? true :false ,
  //   tab2: inventoryTab['tab2']===undefined ? false : true,
  //   tab3: inventoryTab['tab3']===undefined ? false : true
  // });
  const [tabs, setTabs] = useState({
    tab1: showExport ? false : true,
    tab2: false,
    tab3: showExport ? true : false,
  });

  const userRoles = JSON.parse(localStorage.getItem('user_roles'));
  // const superAdmin = userRoles?.find((item) => item == 'SUPER_ADMIN' || item == 'RETAIL_ADMIN');

  const permissions = JSON.parse(localStorage.getItem('permissions'));

  //snackbar
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [opensnack, setOpensnack] = useState(false);
  const [timelinerror, setTimelineerror] = useState('');
  const [alertmessage, setAlertmessage] = useState('');
  const [verifyLoader, setVerifyLoader] = useState(false);
  const [gtin, setGtin] = useState('');
  const [batchIds, setBatchIds] = useState('');
  const [availableQuantities, setAvailableQuantities] = useState('');
  const [quantity, setQuantity] = useState('');
  const [showAvailableQuantities, setShowAvailableQuantities] = useState(false);
  const [reason, setReason] = useState({
    value: '',
    label: 'Reason',
  });
  const [adjustmentType, setAdjustmentType] = useState('');
  const [reasonModel, setReasonModel] = useState('');
  const [image, setImage] = useState('');
  const [imageName, setImageName] = useState('');
  const [previewImg, setPreviewImg] = useState(null);
  const [batchNo, setBatchNo] = useState('');

  const [searchProduct, setSearchProduct] = useState('');
  const [debounceSearchProduct, setDebouncedSearchProduct] = useState('');
  const [prodOptions, setProdOptions] = useState([]);

  const [searchValAdjustInventory, setSearchValAdjustInventory] = useState('');
  const [debouncedSearchAdjustInventory, setDebouncedSearchAdjustInventory] = useState('');
  const [debouncedSearchInventory, setDebouncedSearchInventory] = useState('');
  const [searchValInventory, setSearchValInventory] = useState('');
  // abc analysis search
  const [searchValAnalysis, setSearchValAnalysis] = useState('');

  // inventory adjustmen state

  // codes for filter by storage name
  const [storageDataLists, setStorageDataLists] = useState([]);
  const [currentSelectedStorageData, setCurrentSelectedStorageData] = useState('');
  // storageHierarchy will store storage names in an array to display in chips
  const [storageHierarchy, setStorageHierarchy] = useState([]);
  const [noFurtherStorageData, setNoFurtherStorageData] = useState(false);
  // array to store total sub storage names inside currentselected storage name, store in this only when apply is clicked and the sub storage data exists
  const [subStorageDataBarcodesList, setSubStorageDataBarcodesList] = useState([]);
  const [subStorageDataBarcodesListArr, setSubStorageDataBarcodesListArr] = useState([]);
  // to manage filters applied state for inventory filters
  const [filtersAppliedInventory, setFiltersAppliedInventory] = useState(0);
  const [filterStateInventory, setFilterStateInventory] = useState({
    status: 0,
    storageName: 0,
  });
  // inventory adjustmen state

  const debouncedSearchValAnalysis = useDebounce(searchValAnalysis, 300); // Adjust the delay as needed

  const handleSearchAnalysis = (e) => {
    const val = e.target.value;
    if (val?.length === 0) {
      setSearchValAnalysis('');
    } else {
      // inventoryTableDataOnSearch(e.target.value)
      setSearchValAnalysis(e.target.value);
    }
  };

  // clear abc analysis search input fn
  const handleClearAnalysis = () => {
    setSearchValAnalysis('');
  };

  const [pageStateInventoryOnSearch, setPageStateInventoryOnSearch] = useState({
    loader: false,
    datRows: [],
    total: 0,
    page: 1,
    pageSize: 10,
  });

  const [pageStateInventory, setPageStateInventory] = useState({
    loader: false,
    datRows: [],
    total: 0,
    page: 1,
    pageSize: 10,
  });

  const [pageState, setPageState] = useState({
    loader: false,
    datRows1: [],
    total: 0,
    page: 1,
    pageSize: 10,
  });

  const [pageStateOnSearch, setPageStateOnSearch] = useState({
    loader: false,
    datRows1: [],
    total: 0,
    page: 1,
    pageSize: 10,
  });

  const [totalInventoryResult, setTotalInventoryResult] = useState('');
  const [totalInventoryAdjustmentResult, setTotalInventoryAdjustmentResult] = useState('');

  const [status, setStatus] = useState({
    value: false,
    label: 'Stock Status',
  });
  //mobile inventory adjust states
  const [invProductInfo, setInvProductInfo] = useState({
    name: '',
    gtin: '',
  });

  const showSnackbar = useSnackbar();

  useEffect(() => {
    if (invProductInfo?.gtin) {
      setLocationData(() => {
        return {};
      });
      setGtin(() => {
        return invProductInfo.gtin;
      });
    }
  }, [invProductInfo]);

  useEffect(() => {
    if (gtin) {
      handleVerifyGtin();
    }
  }, [gtin]);

  const [mobileDrawerInvAdjust, setMobileDrawerInvAdjust] = useState(false);
  const [mobileDrawerLocation, setMobileDrawerLocation] = useState(false);

  const handleCloseMobileInvAdjustDrawer = () => {
    setMobileDrawerInvAdjust(false);
    setGtin('');
    setAvailableQuantities('');
    setQuantity('');
    setBatchIds('');
    setImage('');
    setImageName('');
    setPreviewImg(null);
    setReasonModel('');
    setLocationData(null);
  };

  const handleCloseLocation = () => {
    setMobileDrawerLocation(false);
  };
  //scanner
  const [scannedText, setScannedText] = useState('');
  const [scanning, setScanning] = useState(true);
  const [openScanner, setOpenScanner] = useState(false);
  const qrRef = useRef(null);

  //date filter
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [modalSaveLoader, setModalSaveLoader] = useState(false);
  const [saved, setSaved] = useState(false);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleDateInputClick = () => {
    setShowDatePicker(!showDatePicker);
  };

  const handleDateRangeSelection = (ranges) => {
    setDateRange(ranges.selection);
    const startDt = formatDate(ranges.selection['startDate']);
    const endDt = formatDate(ranges.selection['endDate']);
    setStartDate(startDt);
    setEndDate(endDt);
  };

  const handleClearDateRange = () => {
    setDateRange({
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    });
  };
  const handleopensnack = () => {
    setOpensnack(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpensnack(false);
  };

  const handleClose4 = () => {
    setOpenmodelLocation(false);
    setInvtable([]);
    setShowLocationHierarchy(false);
    setStorageHierarchyArr([]);
  };

  const columnsGtin = [
    {
      field: 'storageId',
      headerName: 'Storage ID',
      minWidth: 150,
      flex: 1,
      // flex: 0.75,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'storageName',
      headerName: 'Storage Name',
      minWidth: 120,
      flex: 1,
      // flex: 0.75,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'batchNo',
      headerName: 'Batch ID',
      minWidth: 120,
      flex: 1,
      // flex: 0.75,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'availableUnits',
      headerName: 'Quantity',
      minWidth: 100,
      flex: 1,
      // flex: 0.75,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'weightUOM',
      headerName: 'UOM',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 80,
      flex: 1,
      // flex: 0.75,
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'showStorageLocation',
      headerName: '',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 100,
      flex: 1,
      // flex: 0.75,
      cellClassName: 'datagrid-rows',
      align: 'left',
      renderCell: (params) => {
        if (!params.row.storageId.includes('---') && params.row.storageId !== '') {
          return (
            <button
              className="contained-softbutton"
              style={{
                padding: '5px 10px',
                border: 'none',
                fontWeight: 'bold',
                borderRadius: '10px',
                cursor: 'pointer',
              }}
              onClick={() => {
                const storageBarcodeId = params.row.storageId;
                if (!storageBarcodeId.includes('---') && storageBarcodeId !== '') {
                  // setSelectedStorageBarcodeId(row.row.storageId);
                  // set the setShowLocationHierarchy to true
                  // setShowLocationHierarchy(!showLocationHierarchy);
                  getStorageLocationHierarchy(storageBarcodeId);
                }
              }}
            >
              location
            </button>
          );
        }
      },
    },
  ];

  const handleLocation = (e) => {
    setOpenmodelLocation(true);
    const findInventoryGtindata = inventoryData?.find(
      (item) => item.itemName.toUpperCase() === locationData.product.toUpperCase(),
    );
    const gtin = findInventoryGtindata?.gtin;
    getinventorygtindata(gtin)
      .then((res) => {
        const result = res?.data?.data?.object;
        const tableDataGtin = result?.map((row) => ({
          storageId: row?.storageId == null ? '---' : row?.storageId,
          storageName: row?.storageName == null ? '---' : row?.storageName,
          batchNo: row?.batchNo || 'NA',
          availableUnits: row?.availableUnits ?? 'NA',
          weightUOM: row?.weightUOM || 'NA',
        }));

        setGTinTableData(tableDataGtin);
        setInvtable(res?.data?.data?.object);
      })
      .catch((err) => {});
    setAnchorElAction(null);
  };

  //mobile product location function
  const handleMobileLocation = (gtin) => {
    setMobileDrawerLocation(true);
    getinventorygtindata(gtin).then((res) => {
      const result = res?.data?.data?.object;
      const tableDataGtin = result?.map((row) => ({
        storageId: row?.storageId == null ? '---' : row?.storageId,
        storageName: row?.storageName == null ? '---' : row?.storageName,
        batchNo: row?.batchNo || 'NA',
        availableUnits: row?.availableUnits ?? 'NA',
        weightUOM: row?.weightUOM || 'NA',
      }));

      setGTinTableData(tableDataGtin);
      setInvtable(res?.data?.data?.object);
    });
  };

  const handleOpenPo = (e, params) => {
    e.stopPropagation();
    navigate(`/purchase/purchase-orders/details/${params?.value[1]}`);
  };

  const columns = [
    // Barcode  Product  Brand.  Incoming  Open PO  Available units  Active batches
    {
      field: 'product',
      headerName: 'Product',
      minWidth: 180,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'gtin',
      headerName: 'Barcode',
      minWidth: 150,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      renderCell: (params) => {
        return <CopyToClipBoard params={params} />;
      },
    },
    // {
    //   field: 'whensoldout',
    //   headerName: 'When sold out',
    //   headerClassName: 'datagrid-columns',
    //   headerAlign: '',
    //   width: 180,
    //   cellClassName: 'datagrid-rows',
    //   align: '',
    // },
    {
      field: 'brand',
      headerName: 'Brand',
      minWidth: 250,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'vendor',
      headerName: 'Vendor ID',
      minWidth: 100,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'available',
      headerName: 'Available Units',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 100,
      flex: 1,
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'incoming',
      headerName: 'Incoming',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 80,
      flex: 1,
      cellClassName: 'datagrid-rows',
      align: 'left',
      disableClickEventBubbling: true,
      renderCell: (params) => {
        if (params.value[0] == 0) {
          return (
            <SoftBox>
              <p
                style={{ cursor: 'pointer', color: '#67748e' }}
                // onClick={(e) => handleOpenPo(e, params)}
              >
                {params.value[0]}
              </p>
            </SoftBox>
          );
        } else {
          return (
            <SoftBox onClick={(e) => handleOpenPo(e, params)}>
              {/* <a href={`/purchase/purchase-orders/details/${params.value[1]}`} style={{ textDecoration: 'none' }}> */}
              <p style={{ cursor: 'pointer', color: '#67748e' }}>{params?.value[0]}</p>
              {/* </a> */}
            </SoftBox>
          );
        }
      },
    },
    {
      field: 'openPo',
      headerName: 'Open PO',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 80,
      flex: 1,
      cellClassName: 'datagrid-rows',
      align: 'left',
      disableClickEventBubbling: true,
      renderCell: (params) => {
        if (params.value[0] == 0) {
          return (
            <SoftBox>
              <p
                style={{ cursor: 'pointer', color: '#67748e' }}
                // onClick={(e) => handleOpenPo(e, params)}
              >
                {params.value[0]}
              </p>
            </SoftBox>
          );
        } else {
          return (
            <SoftBox onClick={(e) => handleOpenPo(e, params)}>
              {/* <a href={`/purchase/purchase-orders/details/${params.value[1]}`} style={{ textDecoration: 'none' }}> */}
              <p style={{ cursor: 'pointer', color: '#67748e' }}>{params?.value[0]}</p>
              {/* </a> */}
            </SoftBox>
          );
        }
      },
    },
    // {
    //   field: 'activeBatches',
    //   headerName: 'Active Batches',
    //   minWidth: 100,
    //   flex: 1,
    //   headerClassName: 'datagrid-columns',
    //   headerAlign: 'left',
    //   cellClassName: 'datagrid-rows',
    //   align: 'left',
    // },
    {
      field: 'action-button',
      headerName: '',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 30,
      flex: 1,
      cellClassName: 'datagrid-rows',
      align: 'center',
      disableClickEventBubbling: true,
      renderCell: (params) => {
        return (
          <SoftBox style={{ cursor: 'pointer' }}>
            <SoftBox
              className="moreicons-dot-box"
              id="basic-button"
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={(e) => actionButtonClick(e, params.row)}
            >
              <MoreHorizIcon className="moreicons-dot" />
            </SoftBox>
            <Menu
              id="basic-menu"
              anchorEl={anchorElAction}
              open={openAction}
              onClose={handleCloseAction}
              slotProps={{
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(-10px -10px -10px red)',
                  mt: 1.5,
                  '& .MuiAvatar-root': {
                    width: 20,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  '&:before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,

                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              {/* <MenuItem onClick={handleCloseAction}>Active</MenuItem>
              <MenuItem onClick={handleCloseAction}>In Active</MenuItem>
              <MenuItem onClick={handleCloseAction}>Bookmarked</MenuItem> */}
              {/* <MenuItem onClick={handleCloseAction}>Delete</MenuItem> */}
              <MenuItem
                sx={{
                  display:
                    permissions?.RETAIL_Products?.WRITE ||
                    permissions?.WMS_Products?.WRITE ||
                    permissions?.VMS_Products?.WRITE
                      ? 'block'
                      : 'none',
                }}
                onClick={handleOpenInventoryAdjustment}
              >
                Adjust Inventory
              </MenuItem>
              <MenuItem onClick={handleLocation}>Location</MenuItem>
            </Menu>
          </SoftBox>
        );
      },
    },
  ];

  const actionButtonClick = (event, row) => {
    event.stopPropagation();
    setLocationData(row);
    setAnchorElAction(event.currentTarget);
  };
  const handleCloseAction = () => {
    setAnchorElAction(null);
    setLocationData(null);
  };

  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const user_details = localStorage.getItem('user_details');
  const { uidx, firstName, secondName } = JSON.parse(user_details);

  const filterObject = {
    pageNumber: debouncedSearchInventory?.length ? 0 : pageStateInventory.page,
    pageSize: 10,
    // productId: [],
    categoryList: [],
    locationId: locId,
    // itemCode: [],
    // itemName: [],
    brandList: [],
    gtinList: [],
    storageIds: [],
    vendorIds: [],
    orgId: orgId,
    outOfStock: status.value,
    searchBox: debouncedSearchInventory.trim(),
    // skuid: [],
  };

  const intitalDataFetchInventoryPayload = {
    pageNumber: pageStateInventory.page,
    pageSize: pageStateInventory.pageSize,
    locationId: locId,
    orgId: orgId,
  };
  const filterObjectOnSearch = {
    pageNumber: pageStateInventoryOnSearch.page,
    pageSize: 10,
    // productId: [],
    categoryList: [],
    locationId: locId,
    // itemCode: [],
    // itemName: [],
    brandList: [],
    gtinList: [],
    storageIds: [],
    vendorIds: [],
    orgId: orgId,
    outOfStock: status.value,
    searchBox: debouncedSearchInventory.trim(),
    // skuid: [],
  };

  const [datRows, setTableRows] = useState([]);
  let dataArr,
    dataRow = [];

  const handleOnCellClickForInventory = (params) => {};

  let dataArrOnSearch,
    dataRowOnSearch = [];

  useEffect(() => {
    if (debouncedSearchInventory) {
      inventoryTableDataOnSearch();
    }
  }, [debouncedSearchInventory, pageStateInventoryOnSearch.page, pageStateInventoryOnSearch.pageSize]);

  const inventoryTableDataOnSearch = async () => {
    if (!isMobile) {
      setPageStateInventoryOnSearch((old) => ({ ...old, loader: true }));
      let dataForEachGtins = [];
      let tot = '';

      try {
        const res = await getInventoryListMobile(filterObjectOnSearch);

        dataArrOnSearch = res?.data?.data?.data?.data;

        tot = res?.data?.data?.data?.totalResult;
        const inventoryData = res?.data?.data?.data?.data;

        setInventoryData(inventoryData);

        const gtinInventoryData = inventoryData?.map((item) => item?.gtin);

        const payloadGtinInventory = {
          sourceLocationId: locId,
          gtinNoList: gtinInventoryData,
        };
        setTotalInventoryResult(tot);

        dataRowOnSearch?.push(
          dataArrOnSearch?.map((row, index) => ({
            gtin: row?.gtin || 'NA',
            product: row?.itemName ? textFormatter(row?.itemName) : 'NA',
            brand: row?.brand ? textFormatter(row?.brand) : 'NA',
            incoming: '---',
            openPo: '---',
            available: row?.totalAvailableUnits ?? 'NA',
            activeBatches: row?.activeBatches || 'NA',
            status: row?.status || 'NA',
            id: uuidv4(),
            vendor: row?.vendorId ? textFormatter(row?.vendorId) : 'NA',
          })),
        );

        setPageStateInventoryOnSearch((old) => ({
          ...old,
          loader: false,
          datRows: dataRowOnSearch[0] || [],
          total: tot || 0,
        }));

        showSnackbar('Success Inventory list', 'success');
        setLoader(false);
        setInitialLoader(false);

        const resp = await getTotalQuantityOrderedForGtins(payloadGtinInventory);

        dataForEachGtins = resp?.data?.data?.poItemQuantityOrderedList;

        const updateDataRows = [...dataRowOnSearch[0]]?.map((row, index) => ({
          ...row,
          incoming: dataForEachGtins[index]['purchaseOrderList']?.length
            ? [
                dataForEachGtins[index]?.totalQuantityOrdered,
                dataForEachGtins[index]['purchaseOrderList'][0]['poNumber'],
              ]
            : [dataForEachGtins[index]?.totalQuantityOrdered, null],
          openPo: dataForEachGtins[index]['purchaseOrderList']?.length
            ? [dataForEachGtins[index]?.totalNoOfPo, dataForEachGtins[index]['purchaseOrderList'][0]['poNumber']]
            : [dataForEachGtins[index]?.totalNoOfPo, null],
        }));
        setPageStateInventoryOnSearch((old) => ({
          ...old,
          loader: false,
          datRows: updateDataRows || [],
          total: tot || 0,
        }));
      } catch (err) {
        showSnackbar('Something went wrong', 'error');
        setLoader(false);
        setInitialLoader(false);
      }
    }
  };

  const inventoryTableData = async () => {
    if (!isMobile) {
      setPageStateInventory((old) => ({ ...old, loader: true }));

      let dataForEachGtins = [];
      let tot = '';

      try {
        const res = await getInventoryListInitial(intitalDataFetchInventoryPayload);
        dataArr = res?.data?.data?.data?.data;
        tot = res?.data?.data?.data?.totalResult;
        const inventoryData = res?.data?.data?.data?.data;

        setInventoryData(inventoryData);

        const gtinInventoryData = inventoryData?.map((item) => item.gtin);

        const payloadGtinInventory = {
          sourceLocationId: locId,
          gtinNoList: gtinInventoryData,
        };

        setTotalInventoryResult(tot);

        dataRow.push(
          dataArr?.map((row, index) => ({
            gtin: row?.gtin,
            product: textFormatter(row?.itemName),
            brand: textFormatter(row?.brand),
            vendor: row?.vendorId ? textFormatter(row?.vendorId) : 'NA',
            incoming: '---',
            openPo: '---',
            available: decimalPointFormatter(row?.totalAvailableUnits),
            activeBatches: row?.activeBatches || 'NA',
            status: row?.status,
            id: uuidv4(),
          })),
        );

        setPageStateInventory((old) => ({
          ...old,
          loader: false,
          datRows: dataRow[0] || [],
          total: tot || 0,
        }));

        showSnackbar('Success Inventory list', 'success');
        setLoader(false);
        setInitialLoader(false);

        const resp = await getTotalQuantityOrderedForGtins(payloadGtinInventory);

        dataForEachGtins = resp?.data?.data?.poItemQuantityOrderedList;

        const updatedDataRows = [...dataRow[0]].map((row, index) => ({
          ...row,
          incoming: dataForEachGtins[index]['purchaseOrderList']?.length
            ? [
                dataForEachGtins[index].totalQuantityOrdered,
                dataForEachGtins[index]['purchaseOrderList'][0]['poNumber'],
              ]
            : [dataForEachGtins[index].totalQuantityOrdered, null],
          openPo: dataForEachGtins[index]['purchaseOrderList']?.length
            ? [dataForEachGtins[index].totalNoOfPo, dataForEachGtins[index]['purchaseOrderList'][0]['poNumber']]
            : [dataForEachGtins[index].totalNoOfPo, null],
        }));

        setPageStateInventory((old) => ({
          ...old,
          loader: false,
          datRows: updatedDataRows || [],
          total: tot || 0,
        }));
      } catch (err) {
        showSnackbar(err.response.data.message, 'error');
        setLoader(false);
        setInitialLoader(false);
      }
    }
  };

  const filterObjectInventoryV2 = {
    pageNumber: pageStateInventory.page,
    pageSize: pageStateInventory.pageSize,
    locationId: locId,
    orgId: orgId,
    // pageNumber: debouncedSearchInventory.length ? 0 : pageStateInventory.page,
    brandList: [],
    storageIds: subStorageDataBarcodesListArr,
    outOfStock: status.value,
    // skuid: [],
  };
  const inventoryTableDataV2 = async () => {
    if (!isMobile) {
      setPageStateInventory((old) => ({ ...old, loader: true }));
      getInventoryListMobile(filterObjectInventoryV2)
        .then(async (res) => {
          // let unique = [];
          let dataForEachGtins = [];
          let tot = '';

          dataArr = res?.data?.data?.data?.data;
          // console.log(res.data.data.data.data)

          tot = res?.data?.data?.data?.totalResult;
          const inventoryData = res?.data?.data?.data?.data;
          setInventoryData(inventoryData);
          const gtinInventoryData = inventoryData?.map((item) => item?.gtin);

          const payloadGtinInventory = {
            sourceLocationId: locId,
            gtinNoList: gtinInventoryData,
          };
          setTotalInventoryResult(tot);
          const resp = await getTotalQuantityOrderedForGtins(payloadGtinInventory);
          dataForEachGtins = resp?.data?.data?.poItemQuantityOrderedList;

          let rows = [];
          try {
            rows = dataArr?.map((row, index) => {
              const matchingData = dataForEachGtins?.find((item) => item?.gtinNo === row?.gtin);

              return {
                gtin: row?.gtin || 'NA',
                product: row?.itemName ? textFormatter(row?.itemName) : 'NA',
                brand: row?.brand ? textFormatter(row?.brand) : 'NA',
                vendor: row?.vendorId ? textFormatter(row?.vendorId) : 'NA',
                incoming: matchingData?.['purchaseOrderList']?.length
                  ? [matchingData?.totalQuantityOrdered, matchingData?.['purchaseOrderList'][0]['poNumber']]
                  : // : [matchingData?.totalQuantityOrdered, null],
                    ['NA'],
                openPo: matchingData?.['purchaseOrderList']?.length
                  ? [matchingData?.totalNoOfPo, matchingData?.['purchaseOrderList'][0]['poNumber']]
                  : // : [matchingData?.totalNoOfPo, null],
                    ['NA'],
                available: row?.totalAvailableUnits ?? 'NA',
                activeBatches: row?.activeBatches || 'NA',
                status: row?.status || 'NA',
                id: index,
              };
            });
          } catch (err) {
            console.error('Error while mapping data:', err);
          }

          setPageStateInventory((old) => ({
            ...old,
            loader: false,
            datRows: rows || [],
            total: tot || 0,
          }));
          showSnackbar('Success Inventory List', 'success');
          setLoader(false);
          setInitialLoader(false);
        })
        .catch((err) => {
          showSnackbar('Something went wrong', 'error');
          setPageStateInventory((prev) => ({ ...prev, loader: false }));
          setLoader(false);
          setInitialLoader(false);
        });
    }
  };
  useEffect(() => {
    if (tabs.tab1 === true && !showExport && isFilterApplied === false) {
      // inventoryTableData();
      inventoryTableDataV2();
      getTopLevelStorageData();
    }
    setIsFilterApplied(false);
  }, [
    tabs.tab1,
    // status,
    pageStateInventory.page,
    pageStateInventory.pageSize,
    saved,
  ]);

  useEffect(() => {
    if (tabs.tab1 === true) {
      // inventoryTableDataOnSearch();
    }
  }, [
    debouncedSearchInventory,
    // status,
    saved,
  ]);

  // useEffect(() => {
  //   if (tabs.tab2 === true) {
  //     inventoryAdjustmentTableDataOnSearch();
  //   }
  // }, [
  //   debouncedSearchAdjustInventory,
  //   pageStateOnSearch.page,
  //   pageStateOnSearch.pageSize,
  //   // reason,
  //   tabs.tab1,
  //   tabs.tab2,
  //   // startDate,
  //   // endDate,
  //   saved,
  // ]);

  const handleStartDate = (date) => {
    if (date) {
      // Format the date as a string in the 'YYYY-MM-DD' format
      const formattedDate = dayjs(date).format('YYYY-MM-DD');
      setStartDate(formattedDate);
    }

    if (filterState['startDate'] === 0) {
      setFiltersApplied((prev) => prev + 1);
      setFilterState({ ...filterState, startDate: 1 });
    }

    // let time = moment.utc(date).format('YYYY-MM-DD HH:mm:ss');
    // let stillUtc = moment.utc(time).toDate();
    // const start = moment(stillUtc).local().format('YYYY-MM-DD');
    // setStartDate(start);
  };

  const handleEndDate = (date) => {
    if (date) {
      // Format the date as a string in the 'YYYY-MM-DD' format
      const formattedDate = dayjs(date).format('YYYY-MM-DD');
      setEndDate(formattedDate);
    }
    if (filterState['endDate'] === 0) {
      setFiltersApplied((prev) => prev + 1);
      setFilterState({ ...filterState, endDate: 1 });
    }

    // let time = moment.utc(date).format('YYYY-MM-DD HH:mm:ss');
    // let stillUtc = moment.utc(time).toDate();
    // const end = moment(stillUtc).local().format('YYYY-MM-DD');
    // setEndDate(end);
  };

  // Invertory Adjustment

  const columns1 = [
    // {
    //   field: 'image',
    //   headerName: 'Image',
    //   minWidth: 80,
    //   // flex: 0.75,
    //   headerClassName: 'datagrid-columns',
    //   headerAlign: 'left',
    //   cellClassName: 'datagrid-rows',
    //   align: 'left',
    //   renderCell: (params) => {
    //     return <img src={params.value} width="40px" height="40px" />;
    //   },
    // },
    // {
    //   field: 'date',
    //   headerName: 'Date',
    //   minWidth: 100,
    //   headerClassName: 'datagrid-columns',
    //   headerAlign: 'left',
    //   cellClassName: 'datagrid-rows',
    //   align: 'left',
    // },
    {
      field: 'itemName',
      headerName: 'Product Name',
      minWidth: 150,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      flex: 1,
    },
    {
      field: 'gtin',
      headerName: 'Barcode',
      minWidth: 150,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      flex: 1,
      renderCell: (params) => {
        return <CopyToClipBoard params={params} />;
      },
    },
    {
      field: 'batchid',
      headerName: 'Batch ID',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 150,
      cellClassName: 'datagrid-rows',
      align: 'left',
      flex: 1,
    },
    // inwaredQuantity
    // {
    //   field: 'quantity',
    //   headerName: 'Quantity',
    //   headerClassName: 'datagrid-columns',
    //   headerAlign: 'left',
    //   minWidth: 100,
    //   cellClassName: 'datagrid-rows',
    //   align: 'left',
    // },
    {
      field: 'available_quantity',
      headerName: 'Available Quantity',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 150,
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'adjusted_quantity',
      headerName: 'Adjusted Quantity',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 150,
      cellClassName: 'datagrid-rows',
      align: 'left',
      flex: 1,
    },
    {
      field: 'remaining_quantity',
      headerName: 'Remaining Quantity',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 150,
      cellClassName: 'datagrid-rows',
      align: 'left',
      flex: 1,
    },
    {
      field: 'reason',
      headerName: 'Reason',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 150,
      cellClassName: 'datagrid-rows',
      align: 'left',
      flex: 1,
    },
    {
      field: 'date',
      headerName: 'Last Modified',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 200,
      cellClassName: 'datagrid-rows',
      align: 'left',
      flex: 1,
    },
  ];

  const filterObject1 = {
    pageNumber: debouncedSearchAdjustInventory?.length ? 1 : pageState.page,
    pageSize: 10,
    productId: [],
    locationId: [locId],
    itemName: [],
    reason: reason?.value?.length ? [reason.value.toLowerCase()] : [],
    gtin: [],
    orgId: [orgId],
    searchBox: debouncedSearchAdjustInventory.trim(),
    created_By: '',
    startDate: startDate,
    endDate: endDate,
    skuid: [],
  };

  const filterObject1OnSearch = {
    pageNumber: pageStateOnSearch.page,
    pageSize: 10,
    productId: [],
    locationId: [locId],
    itemName: [],
    reason: reason?.value?.length ? [reason.value.toLowerCase()] : [],
    gtin: [],
    orgId: [orgId],
    searchBox: debouncedSearchAdjustInventory.trim(),
    created_By: '',
    startDate: startDate,
    endDate: endDate,
    skuid: [],
  };

  let dataArrAdjustOnSearch,
    dataRowAdjustOnSearch = [];
  useEffect(() => {
    if (debouncedSearchAdjustInventory) {
      inventoryAdjustmentTableDataOnSearch();
    }
  }, [debouncedSearchAdjustInventory]);
  const inventoryAdjustmentTableDataOnSearch = async () => {
    setPageStateOnSearch((old) => ({ ...old, loader: true }));
    postinventoryadjusmenttabledata(filterObject1OnSearch)
      .then((res) => {
        if (!res?.data?.data?.inventoryAdjustmentLogsList?.length) {
          showSnackbar('No Data Found', 'error');
          setPageState((old) => ({
            ...old,
            loader: false,
            datRows1: [],
            total: 0,
          }));
          return;
        }
        showSnackbar('Success Inventory Adjustment list', 'success');
        setPageState((old) => ({ ...old, loader: false }));
        dataArrAdjustOnSearch = res?.data?.data;
        dataRowAdjustOnSearch?.push(
          dataArrAdjustOnSearch?.inventoryAdjustmentLogsList?.map((row) => ({
            image: row?.imgURL == 'No image' || row?.imgURL == '-' ? 'https://i.imgur.com/dL4ScuP.png' : row?.imgURL,
            date: row?.createdOn ? dateFormatter(row?.createdOn) : 'NA',
            gtin: row?.gtin ? row?.gtin : 'NA',
            itemName: row?.itemName ? textFormatter(row?.itemName) : 'NA',
            batchid: row?.batchNo ? row?.batchNo : 'NA',
            quantity: row?.actualQuantityUnits ?? 'NA',
            actualQuantityUnits: row?.actualQuantityUnits ?? 'NA',
            // adjusted_quantity: row.reason == 'inward' ? row.actualQuantityUnits : row.changedQuantityUnits,
            adjusted_quantity: row?.adjustedQuantity ?? 'NA',
            // available_quantity: row.changedQuantityUnits ? row.changedQuantityUnits : '-----',
            available_quantity: row?.actualQuantityUnits ?? 'NA',
            remaining_quantity: row?.changedQuantityUnits ?? 'NA',
            changedQuantityUnits: row?.changedQuantityUnits ?? 'NA',
            reason: row?.reason ? textFormatter(row?.reason) : 'NA',
            inventory_adjustment_id: row?.inventory_adjustment_id || 'NA',
            adjustedQuantity: row?.adjustedQuantity > 0 ? row?.adjustedQuantity?.adjustedQuantity : 'NOT ADJUSTED',
          })),
        );
        //
        setPageStateOnSearch((old) => ({
          ...old,
          loader: false,
          datRows1: dataRowAdjustOnSearch[0] || [],
          total: dataArrAdjustOnSearch.totalResults || 0,
        }));

        setTotalInventoryAdjustmentResult(res?.data?.data?.totalResults);
        // }
        setLoader(false);
      })
      .catch((err) => {
        showSnackbar('NO Data Found', 'error');
        setPageState((old) => ({ ...old, loader: false }));
      });
  };

  const [datRows1, setTableRows1] = useState([]);
  let dataArr1,
    dataRow1 = [];

  // for export inventory
  const [totalPageResult, setTotalPageResult] = useState(0);
  const [isFilterApplied, setIsFilterApplied] = useState(false);

  useEffect(() => {
    if (tabs.tab2 === true && isFilterApplied === false) {
      setPageState((old) => ({ ...old, loader: true }));
      postinventoryadjusmenttabledata(filterObject1)
        .then((res) => {
          if (!res.data.data.inventoryAdjustmentLogsList?.length) {
            showSnackbar('No Data Found', 'error');
            setPageState((old) => ({ ...old, loader: false, datRows1: [], total: 0 }));
            return;
          }
          showSnackbar('Success Inventory Adjustment list', 'success');

          dataArr1 = res?.data?.data;
          dataRow1.push(
            dataArr1?.inventoryAdjustmentLogsList?.map((row) => ({
              image: row?.imgURL == 'No image' || row?.imgURL == '-' ? 'https://i.imgur.com/dL4ScuP.png' : row?.imgURL,
              date: row?.createdOn ? dateFormatter(row?.createdOn) : 'NA',
              gtin: row?.gtin ? row?.gtin : 'NA',
              itemName: row?.itemName ? textFormatter(row?.itemName) : 'NA',
              batchid: row?.batchNo ? row?.batchNo : 'NA',
              quantity: row?.actualQuantityUnits ?? 'NA',
              // adjusted_quantity: row.reason == 'inward' ? row.actualQuantityUnits : row.changedQuantityUnits,
              adjusted_quantity: row?.adjustedQuantity ?? 'NA',
              actualQuantityUnits: row?.actualQuantityUnits ?? 'NA',
              // available_quantity: row.changedQuantityUnits ? row.changedQuantityUnits : '-----',
              available_quantity: row?.actualQuantityUnits ?? 'NA',
              remaining_quantity: row?.changedQuantityUnits ?? 'NA',
              changedQuantityUnits: row?.changedQuantityUnits ?? 'NA',
              reason: row?.reason ? textFormatter(row?.reason) : 'NA',
              inventory_adjustment_id: row?.inventory_adjustment_id || 'NA',
            })),
          );
          //
          setPageState((old) => ({
            ...old,
            loader: false,
            datRows1: dataRow1[0] || [],
            total: dataArr1?.totalResults || 0,
          }));
          // if (debouncedSearchAdjustInventory.length) {
          //   setTotalInventoryAdjustmentResult(res.data.data.inventoryAdjustmentLogsList.length);
          // } else {
          setTotalInventoryAdjustmentResult(res?.data?.data?.totalResults);
          // }

          // setTableRows1(dataRow1[0]);
          setLoader(false);
        })
        .catch((err) => {
          // setAlertmessage(err.response.data.message);
          showSnackbar('NO Data Found', 'error');
          setPageState((old) => ({ ...old, loader: false }));
        });
    }
    setIsFilterApplied(false);
  }, [
    pageState.page,
    pageState.pageSize,
    // reason,
    tabs.tab1,
    tabs.tab2,
    // startDate,
    // endDate,
    saved,
  ]);

  const [selectedImages, setSelectedImages] = useState([]);

  const [openModelInventoryAdjustment, setOpenModelInventoryAdjustment] = useState(false);

  const handleOpenInventoryAdjustment = () => {
    setOpenModelInventoryAdjustment(true);
    //
    if (locationData !== null) {
      setGtin(locationData?.gtin);
      setAnchorElAction(null);
      getInventoryBatchByGtin(locationData?.gtin, locId)
        .then((res) => {
          const batchIds = res?.data?.data?.data;
          const totBatchIds = batchIds?.map((item) => ({
            value: item?.availableUnits,
            label: item?.batchNo,
          }));
          setBatchIds(totBatchIds);
          showSnackbar('GTIN Verified Successfully', 'success');
        })
        .catch((err) => {
          showSnackbar('Cannot Verify GTIN', 'error');
          setOpenModelInventoryAdjustment(false);
          setLocationData(null);
          setGtin('');
        });
    }
  };

  const handleCloseModelInventoryAdjustment = () => {
    setOpenModelInventoryAdjustment(false);
    setGtin('');
    setAvailableQuantities('');
    setQuantity('');
    setBatchIds('');
    setImage('');
    setImageName('');
    setPreviewImg(null);
    setReasonModel('');
    setLocationData(null);
    // reset the suggest box data inside inventory adjustment search
    setProdOptions([]);
  };
  //

  const [anchorElExport, setAnchorElExport] = useState(null);
  const openExport = Boolean(anchorElExport);
  const handleClickExport = (event) => {
    event.stopPropagation();
    setAnchorElExport(event.currentTarget);
  };
  const handleCloseExport = () => {
    setAnchorElExport(null);
  };

  const [open2, setOpen2] = useState(false);

  const handleExport = async (exportData) => {
    setOpen2(true);

    if (tabs.tab2) {
      const exportPayload = {
        pageNumber: 0,
        pageSize: totalInventoryAdjustmentResult,
        productId: [],
        category: [],
        locationId: [locId],
        itemName: [],
        reason: [],
        gtin: [],
        org_id: [orgId],
        searchBox: debouncedSearchAdjustInventory.trim(),
        created_By: '',
        startDate: '',
        endDate: '',
        export: exportData,
      };

      //
      //
      try {
        setExportLoader(true);
        const response = await exportInventoryAdjustmentData(exportPayload);
        const newblob = await response.blob();
        const link = document.createElement('a');
        link.href = URL.createObjectURL(newblob);
        link.download = `Inventory_Adjustment.${exportData}`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        setExportLoader(false);
        setAnchorElExport(null);
      } catch (err) {}
    } else {
      const username = localStorage.getItem('user_name');
      const exportPayloadInventory = {
        // pageNumber: 0,
        // pageSize: totalInventoryResult,
        // productId: [],
        // category: [],
        // locationId: [locId],
        // itemCode: [],
        // itemName: [],
        // brand: [],
        // storageId: [],
        // gtin: [],
        // orgId: [orgId],
        // outOfStock: '',
        // searchBox: debouncedSearchInventory.trim(),
        // export: exportData,

        // {
        //   "pageNumber": 1,
        //   "pageSize": 100,
        //   "locationId": "RLC_46",
        //   "orgId": "RET_45",
        //   "outOfStock": false,
        //   "exportType": "pdf",
        //   "exportBy": "ark"
        // }

        pageNumber: 1,
        pageSize: totalPageResult,
        locationId: locId,
        orgId: orgId,
        searchBox: debouncedSearchInventory.trim(),
        outOfStock: false,
        gtinList: [],
        categoryList: [],
        brandList: [],
        storageIds: [],
        vendorIds: [],
        exportType: exportData,
        exportBy: username,
        // {
        //   "pageNumber": 1,
        //   "pageSize": 100,
        //   "locationId": "RLC_46",
        //   "orgId": "RET_45",
        //   "outOfStock": false,
        //   "exportType": "pdf",
        //   "exportBy": "ark"
        // }
      };

      try {
        setExportLoader(true);
        const response = await exportInventoryDataV2(exportPayloadInventory);
        const newblob = await response.blob();
        const link = document.createElement('a');
        link.href = URL.createObjectURL(newblob);
        link.download = `Inventory.${exportData}`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        setExportLoader(false);
        setAnchorElExport(null);
      } catch (err) {}
    }
  };

  const handleClose2 = () => setOpen2(false);

  const handleTabClick = (tab) => {
    const current = { [tab]: true };
    // localStorage.setItem('inventoryTab',JSON.stringify(current));

    setTabs((prev) => ({ ...prev, [tab]: true }));
    Object.keys(tabs)
      .filter((key) => key !== tab)
      .forEach((key) => {
        setTabs((prev) => ({ ...prev, [key]: false }));
      });
    setShowDatePicker(false);
  };

  const handleVerifyGtin = () => {
    setVerifyLoader(true);
    getInventoryBatchByGtin(gtin, locId)
      .then((res) => {
        const batchIds = res?.data?.data?.data;
        const totBatchIds = batchIds?.map((item) => ({
          value: item?.availableUnits,
          label: item?.batchNo,
        }));
        setBatchIds(totBatchIds);
        showSnackbar('GTIN Verified Successfully', 'success');
        setVerifyLoader(false);
      })
      .catch((err) => {
        showSnackbar('Cannot Verify GTIN', 'error');
        setVerifyLoader(false);
      });
  };

  const handleBatchIds = (option) => {
    setAvailableQuantities(option?.value);
    setBatchNo(option?.label);
    setShowAvailableQuantities(true);
  };

  const handleQuantity = (e) => {
    const qty = e.target.value;
    setQuantity(qty);
  };

  const handleReason = (option) => {
    setReason(option);

    if (filterState['reason'] === 0) {
      setFiltersApplied((prev) => prev + 1);
      setFilterState({ ...filterState, reason: 1 });
    }
  };

  const handleReasonModel = (option) => {
    setReasonModel(option?.value);
  };

  const handleImageUpload = (event) => {
    const imageFile = event.target.files[0];
    setImage(imageFile);
    setImageName(imageFile.name);
    const imageUrl = URL.createObjectURL(imageFile);
    setPreviewImg(imageUrl);
  };

  const handleSave = () => {
    const payload = {
      locationId: locId,
      batchNo: batchNo,
      createdBy: uidx,
      createdByName: firstName + ' ' + secondName,
      adjustmentType: adjustmentType,
      // createdOn: new Date().toISOString(),
      reason: reasonModel,
      changedStorageLocation: 'string',
      changedStorageLocationId: 'string',
      changedSellingPrice: 0,
      gtin: gtin,
      quantityCases: 0,
      quantityUnits: quantity,
      skuid: 'string',
    };

    const formData = new FormData();
    formData.append('fileName', imageName);
    formData.append(
      'adjustInventoryQuantityModel',
      new Blob([JSON.stringify(payload)], {
        type: 'application/json',
      }),
    );
    formData.append('multipartFile', image);

    //
    setModalSaveLoader(true);
    postAdjustInventoryBatch(formData)
      .then((res) => {
        const result = res.data.data.object;
        // const { createdOn, gtin, itemName, batchNo, actualQuantityUnits, changedQuantityUnits, reason } = result;
        // const newDataRow = {
        //   date: createdOn,
        //   gtin: gtin,
        //   itemName: itemName,
        //   batchId: batchNo,
        //   actualQuantityUnits: actualQuantityUnits,
        //   changedQuantityUnits: changedQuantityUnits,
        //   reason: reason,
        // };
        // setTableRows1([...datRows1, newDataRow]);

        setGtin('');
        setAvailableQuantities('');
        setQuantity('');
        setBatchIds('');
        setImage('');
        setImageName('');
        setPreviewImg(null);
        setReasonModel('');
        setLocationData(null);
        setModalSaveLoader(false);
        showSnackbar('Inventory Adjustment successfull', 'success');
        setSaved(!saved);
        setOpenModelInventoryAdjustment(false);
        setMobileDrawerInvAdjust(false);
        // window.location.reload()
      })
      .catch((err) => {
        showSnackbar('Cannot Adjust Inventory', 'error');
        setModalSaveLoader(false);
      });
  };

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearchInventory(searchValInventory), 1000);
    return () => {
      clearTimeout(timeout);
    };
  }, [searchValInventory]);

  const handleSearchInventory = (e) => {
    const val = e.target.value;
    if (val?.length === 0) {
      setSearchValInventory('');
    } else {
      // inventoryTableDataOnSearch(e.target.value)
      setSearchValInventory(e.target.value);
    }
  };

  // clear inventory search input fn
  const handleClearInventorySearch = () => {
    setSearchValInventory('');
  };

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearchAdjustInventory(searchValAdjustInventory), 1000);
    return () => {
      clearTimeout(timeout);
    };
  }, [searchValAdjustInventory]);

  const handleSearchAdjustInventory = (e) => {
    const val = e.target.value;
    if (val?.length == 0) {
      setSearchValAdjustInventory('');
    } else {
      setSearchValAdjustInventory(e.target.value);
      // inventoryAdjustmentTableDataOnSearch(e.target.value)
    }
  };

  // clear inventory search input fn
  const handleClearAdjustInventorySearch = () => {
    setSearchValAdjustInventory('');
  };

  const handleStatus = (option) => {
    setStatus(option);
    // check if filterstateinventory status is 0, if 0 set it to 1

    if (option !== '') {
      if (filterStateInventory['status'] === 0) {
        setFiltersAppliedInventory((prev) => prev + 1);
        setFilterStateInventory({ ...filterStateInventory, status: 1 });
      }
    } else {
      setFiltersAppliedInventory((prev) => prev - 1);
      setFilterStateInventory({ ...filterState, status: 0 });
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearchProduct(searchProduct), 1000);
    return () => {
      clearTimeout(timeout);
    };
  }, [searchProduct]);

  const handleAutoComplete = (item) => {
    if (item) {
      setGtin(item.value);
    } else {
      // run this when clear icon is clicked
      setGtin('');
      setProdOptions([]);
      setAvailableQuantities('');
      setQuantity('');
      setBatchIds('');
      setImage('');
      setImageName('');
      setPreviewImg(null);
      setReasonModel('');
      setBatchNo('');
    }
  };

  const handleChange = (e) => {
    const searchText = e.target.value;
    setSearchProduct(searchText);
  };

  useEffect(() => {
    if (debounceSearchProduct?.length) {
      const filterObject = {
        // pageNumber: 1,
        // pageSize: 10,
        // productId: [],
        // category: [],
        // locationId: [locId],
        // itemCode: [],
        // itemName: [],
        // brand: [],
        // storageId: [],
        // gtin: [],
        // orgId: [],
        // outOfStock: 'A',
        // searchBox: debounceSearchProduct.trim(),
        // // searchBox: searchProduct,
        // skuid: [],

        pageNumber: debouncedSearchInventory?.length ? 0 : pageStateInventory.page,
        pageSize: 10,
        // productId: [],
        categoryList: [],
        locationId: locId,
        // itemCode: [],
        // itemName: [],
        brandList: [],
        storageId: [],
        gtinList: [],
        storageIds: [],
        vendorIds: [],
        orgId: orgId,
        outOfStock: status.value,
        // searchBox: debouncedSearchInventory.trim(),
        searchBox: searchProduct,
        // skuid: [],
      };

      getInventoryListMobile(filterObject)
        .then((res) => {
          // const result = res.data?.data?.inventoryCumulativeDataList.map((item) => ({
          //   value: item?.gtin,
          //   label: `${item.gtin}  (${item.itemName})`,
          // }));

          const result = res?.data?.data?.data?.data?.map((item) => ({
            value: item?.gtin,
            label: `${item.gtin}  (${item.itemName})`,
          }));

          setProdOptions(result);
        })
        .catch((err) => {});
    }
    if (searchProduct?.length == 0) {
      // if (searchProduct.length == 0 && prodOptions.length == 0) {
      //   setSearchProduct("");
      // }
      setProdOptions([]);
    }
    // setProdOptions([]);
  }, [debounceSearchProduct]);
  // useEffect(() => {
  //   if (scanning === true) {
  //     if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
  //       console.error('getUserMedia is not supported');
  //       return;
  //     }

  //     const constraints = {
  //       video: {
  //         facingMode: 'environment',
  //       },
  //     };

  //     navigator.mediaDevices
  //       .getUserMedia(constraints)
  //       .then(() => {
  //
  //       })
  //       .catch((error) => {
  //         console.error('Permission to access the camera is denied', error);
  //       });
  //   }
  // }, [scanning]);

  // const handleScan = (result) => {
  //   if (result) {
  //     const { data } = result;
  //     setScannedText(data);
  //     setScanning(false);
  //     setOpenScanner(false);
  //   }
  // };

  // const handleError = (err) => {
  //   console.error(err);
  //   setOpenScanner(false);
  // };

  const handleStartScanning = () => {
    setScanning(true);
    setOpenScanner(true);
  };

  const handleCancelScanning = () => {
    setScanning(false);
    setOpenScanner(false);
  };

  const handleBarcodeScan = (err, result) => {
    if (result) {
      setBarcodeData(result.text);
      setGtin(result.text);
      setScanning(false);
      setOpenScanner(false);
    }
  };

  // state to check wheather clear in filter box is clicked or not
  const [isClear, setIsClear] = useState(false);
  const handleClear = () => {
    if (tabs.tab1) {
      setStatus({
        value: 'A',
        label: 'Stock Status',
      });
      setSearchValInventory('');
    } else {
      setReason({
        value: '',
        label: 'Reason',
      });
      setSearchValAdjustInventory('');
      setStartDate(null);
      setEndDate(null);
    }
    // reset the filterState
    setFilterState({ reason: 0, startDate: 0, endDate: 0 });
    // reset filters applied to 0
    setFiltersApplied(0);
    // set setIsClear to true
    setIsClear(true);
  };

  // run this useeffect when clear is clicked in filter and setIsClear set to true
  useEffect(() => {
    if (isClear) {
      applyInventoryAdjustmentFilter();
      setIsClear(false);
    }
  }, [isClear]);

  useEffect(() => {
    if (barcodeData !== 'Not Found') {
      handleVerifyGtin();
    }
  }, [barcodeData]);

  const handleProductNavigation = async (barcode) => {
    try {
      const productId = await productIdByBarcode(barcode);
      if (productId) {
        navigate(`/products/product/details/${productId}`);
      }
    } catch (error) {}
  };

  const handleCellClickInventory = (rows) => {
    const productId = rows?.row?.gtin;

    // prevent redirecting to details page when the barcode/gtin column is clicked as it contains copy barcode option
    if (rows.field !== 'gtin') {
      handleProductNavigation(productId);
    }
  };

  const handleAnalysisExport = async () => {
    const payload = {
      locationId: locId,
      orgId: orgId,
      // "searchBox": "string",
      exportType: 'csv',
      exportedBy: 'Krishna Vamsi',
    };
    if (tabValue === 0) {
      payload.inventoryAnalysis = currentSelectedCategory;
    } else if (tabValue === 1) {
      payload.salesAnalysis = currentSelectedCategory;
    } else if (tabValue === 2) {
      payload.salesProfitAnalysis = currentSelectedCategory;
    }

    try {
      const response = await exportAnalysisPdf(payload);
      const newblob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(newblob);
      link.download = 'inventoryAnalysis.csv';
      document.body.appendChild(link);
      link.click();
      link.remove();
      // setExportLoader(false);
      // setAnchorElExport(null);
    } catch (err) {}
  };

  //mobile responsiveness
  const isMobile = useMediaQuery('(max-width: 567px)');

  const [infnitePageNumber, setInfinitePageNumber] = useState(2);
  const [inventoryDataMobile, setInventoryDataMobile] = useState([]);
  const [totalPages, setTotalPages] = useState();
  const [infiniteLoader, setInfiniteLoader] = useState(false);
  const [noData, setNoData] = useState(false);
  const [searchedValue, setSearchedValue] = useState('');
  const [initialLoader, setInitialLoader] = useState(false);

  useEffect(() => {
    if (isMobile) {
      const payload = {
        pageNumber: 1,
        pageSize: 10,
        locationId: locId,
        orgId: orgId,
        searchBox: searchedValue,
      };
      let dataArr = [];
      setInitialLoader(true);
      getInventoryListMobile(payload).then(async (res) => {
        setTotalPageResult(res?.data?.data?.data?.totalResult);
        setTotalPages(res?.data?.data?.data?.totalPage);
        const gtinList = res?.data?.data?.data?.data?.map((item) => item?.gtin);
        const payloadGtinInventory = {
          sourceLocationId: locId,
          gtinNoList: gtinList,
        };
        const restProductDetails = await getTotalQuantityOrderedForGtins(payloadGtinInventory);

        dataArr = res?.data?.data?.data?.data;
        const dataForEachGtins = restProductDetails?.data?.data?.poItemQuantityOrderedList;

        let newInventoryData = [];

        try {
          newInventoryData = dataArr?.map((row, index) => {
            const matchingData = dataForEachGtins?.find((item) => item?.gtinNo === row?.gtin);
            return {
              gtin: row?.gtin || 'NA',
              product: row.itemName ? textFormatter(row.itemName) : 'NA',
              incoming: matchingData?.['purchaseOrderList']?.length
                ? [matchingData?.totalQuantityOrdered, matchingData?.['purchaseOrderList'][0]['poNumber']]
                : // : [dataForEachGtins[index].totalQuantityOrdered, null],
                  ['NA'],
              openPo: matchingData?.['purchaseOrderList']?.length
                ? [matchingData?.totalNoOfPo, matchingData?.['purchaseOrderList'][0]['poNumber']]
                : // : [dataForEachGtins[index].totalNoOfPo, null],
                  ['NA'],
              available: row?.totalAvailableUnits ?? 'NA',
              latestAdjustedBatchDate: row?.latestAdjustedBatchDate || 'NA',
              // activeBatches: row?.activeBatches || 'NA',
              status: row?.totalAvailableUnits === 0 ? 'OUT OF STOCK' : 'AVAILABLE',
              id: uuidv4(),
              batchId: row?.numberOfBatches > 1 ? 'MULTIPLE' : 'SINGLE',
              // whensoldout: 'Continue Selling',
            };
          });
        } catch (err) {
          console.error('Error while mapping data:', err);
        }

        const sortedNewInventoryData = newInventoryData?.sort((a, b) => {
          if (a?.latestAdjustedBatchDate === null) {
            return 1;
          }
          if (b?.latestAdjustedBatchDate === null) {
            return -1;
          }

          return b?.latestAdjustedBatchDate.localeCompare(a?.latestAdjustedBatchDate);
        });
        setInventoryDataMobile(sortedNewInventoryData);
        setInitialLoader(false);
      });
    }
  }, [searchedValue]);

  //infinte laoding fetching daata function ===============
  const fetchMoreData = () => {
    const payload = {
      pageNumber: infnitePageNumber,
      pageSize: 10,
      locationId: locId,
      orgId: orgId,
    };
    let dataArr = [];
    setInfiniteLoader(true);
    getInventoryListMobile(payload).then(async (res) => {
      setTotalPages(res?.data?.data?.data?.totalPage);
      const gtinList = res?.data?.data?.data?.data.map((item) => item.gtin);
      const payloadGtinInventory = {
        sourceLocationId: locId,
        gtinNoList: gtinList,
      };
      const restProductDetails = await getTotalQuantityOrderedForGtins(payloadGtinInventory);

      dataArr = res?.data?.data?.data?.data;
      const dataForEachGtins = restProductDetails?.data?.data?.poItemQuantityOrderedList;

      let newInventoryData = [];
      try {
        newInventoryData = dataArr?.map((row, index) => {
          const matchingData = dataForEachGtins?.find((item) => item?.gtinNo === row?.gtin);
          return {
            gtin: row?.gtin || 'NA',
            product: row?.itemName ? textFormatter(row?.itemName) : 'NA',
            incoming: matchingData?.['purchaseOrderList']?.length
              ? [matchingData?.totalQuantityOrdered, matchingData?.['purchaseOrderList'][0]['poNumber']]
              : // : [matchingData?.totalQuantityOrdered, null],
                ['NA'],
            openPo: matchingData?.['purchaseOrderList']?.length
              ? [matchingData?.totalNoOfPo, matchingData?.['purchaseOrderList'][0]['poNumber']]
              : // : [matchingData?.totalNoOfPo, null],
                ['NA'],
            available: row?.totalAvailableUnits ?? 'NA',
            latestAdjustedBatchDate: row?.latestAdjustedBatchDate || 'NA',
            // activeBatches: row?.activeBatches || 'NA',
            status: row?.totalAvailableUnits === 0 ? 'OUT OF STOCK' : 'AVAILABLE',
            id: uuidv4(),
            batchId: row?.numberOfBatches > 1 ? 'MULTIPLE' : 'SINGLE',
            // whensoldout: 'Continue Selling',
          };
        });

        const sortedNewInventoryData = newInventoryData?.sort((a, b) => {
          if (a?.latestAdjustedBatchDate === null || b?.latestAdjustedBatchDate === null) {
            return 1;
          }

          return b?.latestAdjustedBatchDate.localeCompare(a?.latestAdjustedBatchDate);
        });
        setInventoryDataMobile((prev) => [...prev, ...sortedNewInventoryData]);
      } catch (err) {
        console.error('Error while mapping data:', err);
      }
      setInfiniteLoader(false);
    });
  };

  //scroll event triggers fetchMOreData, when user reaches at the end
  const handleScroll = () => {
    if (
      document.documentElement.scrollTop + window.innerHeight + 1 >= document.documentElement.scrollHeight &&
      infnitePageNumber <= totalPages
    ) {
      if (infnitePageNumber === totalPages) {
        setNoData(true);
      }
      setInfinitePageNumber(infnitePageNumber + 1);
      fetchMoreData();
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [infnitePageNumber, totalPages]);

  // filter codes for inventory adjustment --->

  const reasonSelect = (
    <>
      <SoftSelect
        sx={{
          width: '100%',
        }}
        placeholder="Reason"
        value={reason}
        options={[
          { value: 'WASTAGE', label: 'Wastage' },
          { value: 'SHRINKAGE', label: 'Shrinkage' },
          { value: 'THEFT', label: 'Theft' },
          { value: 'STORE USE', label: 'Store use' },
          { value: 'DAMAGED', label: 'Damaged' },
          { value: 'EXPIRED', label: 'Expired' },
          { value: 'RETURNS NOT SALEABLE', label: 'Returns not saleable' },
          // { value: 'ITEM BROKEN', label: 'Item broken' },
          // { value: 'USED PRODUCTS', label: 'Used products' },
          // { value: 'ITEM MISSING', label: 'Item missing' },
          // { value: 'ITEM USED', label: 'Item used' },
          { value: 'PRODUCT SIZE IS LARGE', label: 'Product size is large' },
          { value: 'PRODUCT SIZE IS SMALL', label: 'Product size is small' },
          { value: 'INWARD', label: 'Inward' },
          { value: 'OTHERS', label: 'Others' },
        ]}
        onChange={(option) => handleReason(option)}
      />
    </>
  );

  const startDateSelect = (
    <>
      {/* <SoftBox className="start-date"> */}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          views={['year', 'month', 'day']}
          label="Start Date"
          value={startDate ? dayjs(startDate) : null}
          format="DD/MM/YYYY"
          onChange={(date) => {
            // handleStartDate(date.$d);
            handleStartDate(date);
          }}
          sx={{
            width: '100%',
            '& .MuiInputLabel-formControl': {
              fontSize: '0.8rem',
              top: '-0.4rem',
              color: '#344767 !important',
            },
          }}
        />
      </LocalizationProvider>
      {/* </SoftBox> */}
    </>
  );

  const endDateSelect = (
    <>
      {/* <SoftBox> */}
      {/* <SoftBox className="end-date"> */}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          views={['year', 'month', 'day']}
          label="End Date"
          value={endDate ? dayjs(endDate) : null}
          format="DD/MM/YYYY"
          onChange={(date) => {
            // handleEndDate(date.$d);
            handleEndDate(date);
          }}
          sx={{
            width: '100%',
            '& .MuiInputLabel-formControl': {
              fontSize: '0.8rem',
              top: '-0.4rem',
              color: '#344767 !important',
            },
          }}
        />
      </LocalizationProvider>
      {/* </SoftBox> */}
      {/* </SoftBox> */}
    </>
  );

  // select boxes array for inventory adjustment
  const selectBoxArrayInvAdjust = [reasonSelect, startDateSelect, endDateSelect];

  // filter chipbox inventory adjustment
  const filterChipBoxesInvAdjust = (
    <>
      {/* reason  */}
      {reason?.value !== '' && (
        <Box className="singleChipDisplayBox">
          <ChipBoxHeading heading="Reason" />
          <Box className="insideSingleChipDisplayBox">
            <Chip
              label={reason.value}
              onDelete={() => removeSelectedFilterInvAdjust('reason')}
              deleteIcon={<CancelOutlinedIcon />}
              color="primary"
              variant="outlined"
            />
          </Box>
        </Box>
      )}

      {/* start date  */}
      {startDate !== null && (
        <Box className="singleChipDisplayBox">
          <ChipBoxHeading heading="Start Date" />
          <Box className="insideSingleChipDisplayBox">
            <Chip
              label={dayjs(startDate).format('DD-MM-YYYY')}
              onDelete={() => removeSelectedFilterInvAdjust('startDate')}
              deleteIcon={<CancelOutlinedIcon />}
              color="primary"
              variant="outlined"
            />
          </Box>
        </Box>
      )}

      {/* end date  */}
      {endDate !== null && (
        <Box className="singleChipDisplayBox">
          <ChipBoxHeading heading="End Date" />
          <Box className="insideSingleChipDisplayBox">
            <Chip
              label={dayjs(endDate).format('DD-MM-YYYY')}
              onDelete={() => removeSelectedFilterInvAdjust('endDate')}
              deleteIcon={<CancelOutlinedIcon />}
              color="primary"
              variant="outlined"
            />
          </Box>
        </Box>
      )}
    </>
  );

  // filter modal states for inventory adjustment
  const [filtersApplied, setFiltersApplied] = useState(0);
  const [filterState, setFilterState] = useState({
    reason: 0,
    startDate: 0,
    endDate: 0,
  });
  // end of filter modal states

  // apply inventory adjustment filter function
  const applyInventoryAdjustmentFilter = () => {
    if (tabs.tab2 === true) {
      setPageState((old) => ({ ...old, loader: true, page: 1 }));
      // set the page number to 1
      if (!isClear) {
        setIsFilterApplied(true);
      }
      filterObject1.pageNumber = 1;
      postinventoryadjusmenttabledata(filterObject1)
        .then((res) => {
          if (!res?.data?.data?.inventoryAdjustmentLogsList?.length) {
            showSnackbar('NO Data Found', 'error');
            setPageState((old) => ({ ...old, loader: false, datRows1: [], total: 0 }));
            return;
          }
          showSnackbar('Success Inventory Adjustment list', 'success');

          dataArr1 = res?.data?.data;
          dataRow1.push(
            dataArr1?.inventoryAdjustmentLogsList?.map((row) => ({
              image: row?.imgURL == 'No image' || row?.imgURL == '-' ? 'https://i.imgur.com/dL4ScuP.png' : row?.imgURL,
              date: row?.createdOn || 'NA',
              gtin: row?.gtin || 'NA',
              itemName: row?.itemName ? textFormatter(row?.itemName) : 'NA',
              batchid: row?.batchNo ? row?.batchNo : 'NA',
              quantity: row?.actualQuantityUnits ?? 'NA',
              // adjusted_quantity: row.reason == 'inward' ? row.actualQuantityUnits : row.changedQuantityUnits,
              adjusted_quantity: row?.adjustedQuantity ?? 'NA',
              actualQuantityUnits: row?.actualQuantityUnits ?? 'NA',
              // available_quantity: row.changedQuantityUnits !== null ? row.changedQuantityUnits : 'NA',
              available_quantity: row?.actualQuantityUnits ?? 'NA',
              remaining_quantity: row?.changedQuantityUnits ?? 'NA',
              changedQuantityUnits: row?.changedQuantityUnits ?? 'NA',
              reason: row?.reason ? textFormatter(row?.reason) : 'NA',
              inventory_adjustment_id: row?.inventory_adjustment_id || 'NA',
            })),
          );
          //
          setPageState((old) => ({
            ...old,
            loader: false,
            datRows1: dataRow1[0] || [],
            page: 1,
            total: dataArr1?.totalResults || 0,
          }));
          // if (debouncedSearchAdjustInventory.length) {
          //   setTotalInventoryAdjustmentResult(res.data.data.inventoryAdjustmentLogsList.length);
          // } else {
          setTotalInventoryAdjustmentResult(res?.data?.data?.totalResults);
          // }

          // setTableRows1(dataRow1[0]);
          setLoader(false);
        })
        .catch((err) => {
          // setAlertmessage(err.response.data.message);
          showSnackbar('NO Data Found', 'error');
          setPageState((old) => ({ ...old, pageNumber: 1, loader: false }));
        });
    }
    // if (tabs.tab2 === true) {
    //   inventoryAdjustmentTableDataOnSearch();
    // }

    // close filter modal box after 300ms
    setTimeout(() => {
      // handleClose2();
    }, 300);
  };

  // remove selected inventory adjustment filter function
  const removeSelectedFilterInvAdjust = (filterType) => {
    switch (filterType) {
      case 'reason':
        setFiltersApplied((prev) => prev - 1);
        setReason({
          value: '',
          label: 'Reason',
        });
        setFilterState({ ...filterState, reason: 0 });
        break;
      case 'startDate':
        setFiltersApplied((prev) => prev - 1);
        setStartDate(null);
        setFilterState({ ...filterState, startDate: 0 });
        break;
      case 'endDate':
        setFiltersApplied((prev) => prev - 1);
        setEndDate(null);
        setFilterState({ ...filterState, endDate: 0 });
        break;
      default:
        return;
    }
  };

  // <----- filter codes for inventory adjustment

  const handleStorageName = (option) => {
    setCurrentSelectedStorageData(option);
    if (option !== '') {
      if (filterStateInventory['storageName'] === 0) {
        setFiltersAppliedInventory((prev) => prev + 1);
        setFilterStateInventory({ ...filterStateInventory, storageName: 1 });
      }
    } else {
      setFiltersAppliedInventory((prev) => prev - 1);
      setFilterStateInventory({ ...filterState, storageName: 0 });
    }
  };

  // statusSelect for tabs.tab1
  const statusSelect = (
    <>
      {tabs.tab1 ? (
        // <Grid item md={3} xs={12} sx={{ paddingTop: '0 !important' }}>
        <SoftBox
          sx={{
            width: '100%',
          }}
        >
          <SoftSelect
            className="all-products-filter-soft-select-box"
            placeholder="Stock Status"
            value={status}
            options={[
              { value: false, label: 'ALL' },
              // { value: 'Y', label: ' Available' },
              // { value: true, label: 'Expired' },
              { value: true, label: 'Out of stock' },
            ]}
            onChange={(option) => handleStatus(option)}
            // menuPortalTarget={document.body}
          />
        </SoftBox>
      ) : // </Grid>
      null}
    </>
  );

  // select box for storage name
  const storageNameSelect = (
    <>
      <Box className="all-products-filter-product">
        <SoftSelect
          className="all-products-filter-soft-select-box"
          placeholder="Storage Name"
          name="storage"
          options={noFurtherStorageData === false ? storageDataLists : [currentSelectedStorageData]}
          {...(currentSelectedStorageData !== ''
            ? {
                value: {
                  value: currentSelectedStorageData?.value,
                  label: currentSelectedStorageData?.label,
                  barcodeId: currentSelectedStorageData?.barcodeId,
                },
              }
            : {
                value: {
                  value: '',
                  label: 'Select Storage Name',
                },
              })}
          onChange={(option, e) => {
            handleStorageName(option);
          }}
        />
      </Box>
    </>
  );

  // chipBoxes for inventory filter
  const filterChipBoxes = (
    <>
      {storageHierarchy?.length !== 0 && (
        <Box className="singleChipDisplayBox">
          <ChipBoxHeading heading="Storage Name" />
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              // gap: '10px',
              paddingLeft: '0 !important',
            }}
          >
            {storageHierarchy?.length !== 0 &&
              storageHierarchy.map((storage, index) => (
                <Box key={index} className="content-center" sx={{ paddingLeft: '0 !important' }}>
                  {index === 0 ? (
                    <Box className="insideSingleChipDisplayBox" sx={{ paddingLeft: '0 !important' }}>
                      <Chip
                        label={storage?.label}
                        onDelete={() => removeSelectedInventoryFilter(storage, index)}
                        deleteIcon={<CancelOutlinedIcon />}
                        color="primary"
                        variant="outlined"
                      />
                    </Box>
                  ) : (
                    <>
                      <Box className="insideSingleChipDisplayBox" sx={{ paddingLeft: '0 !important' }}>
                        <Chip label={storage?.label} color="primary" variant="outlined" />
                      </Box>
                    </>
                  )}

                  {storageHierarchy[index + 1] && (
                    <Box className="content-center" sx={{ paddingLeft: '0 !important' }}>
                      <ChevronRightIcon sx={{ fontSize: '20px' }} />
                    </Box>
                  )}
                </Box>
              ))}
          </Box>
        </Box>
      )}

      {/* status  */}
      {filterStateInventory?.status === 1 && (
        <Box className="singleChipDisplayBox">
          <ChipBoxHeading heading="Status" />
          <Box className="insideSingleChipDisplayBox">
            <Chip
              label={status?.value === true ? 'Out Of Stock' : 'All'}
              onDelete={() => removeSelectedInventoryFilter('status')}
              deleteIcon={<CancelOutlinedIcon />}
              color="primary"
              variant="outlined"
            />
          </Box>
        </Box>
      )}
    </>
  );

  // functions here
  const getTopLevelStorageData = () => {
    if (!isMobile) {
      getTopLevelStorageDataLists(orgId, locId)
        .then((res) => {
          // working
          if (res?.data?.data?.object !== null) {
            const storageNameList = res?.data?.data?.object;
            const totalTopLevelStorageNameList = storageNameList?.map((item) => ({
              value: item.storageId,
              label: item.storageName,
              barcodeId: item.barcodeId,
            }));
            setStorageDataLists(totalTopLevelStorageNameList);
          } else {
            return;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const getNextLevelStorageData = (storageId) => {
    getStorageDataListNextLevel(storageId)
      .then((res) => {
        const responseMsg = res?.data?.data?.message;
        if (responseMsg === 'No data found') {
          // when no next level data exist and apply is clicked, set this to false
          // console.log('no next level data present');

          if (noFurtherStorageData === false) {
            setStorageHierarchy([...storageHierarchy, currentSelectedStorageData]);
          } else {
            // if(storageHierarchy.length){
            const copyOfStorageHierarchy = [...storageHierarchy];
            copyOfStorageHierarchy[copyOfStorageHierarchy?.length - 1] = currentSelectedStorageData;
            setStorageHierarchy(copyOfStorageHierarchy);
            // }
          }
          setNoFurtherStorageData(true);
          return;
        } else {
          const storageDataLists = res?.data?.data?.object;
          const totalNextLevelStorageDataList = storageDataLists?.map((item) => ({
            value: item?.storageId,
            label: item?.storageName,
            barcodeId: item?.barcodeId,
          }));
          setStorageDataLists(totalNextLevelStorageDataList);

          // add currentselected to hierarchy
          // first check if there is any storageData with same storageId/value or barcodeId
          // let duplicateStorageDataExist=storageHierarchy.map(storage=>storage.barcodeId===currentSelectedStorageData.barcodeId);
          // if no duplicateStorageDataExist exectue this
          // if(duplicateStorageDataExist.length===0){
          setStorageHierarchy([...storageHierarchy, currentSelectedStorageData]);
          // }
        }
      })
      .catch((err) => console.log(err));
  };

  // function to get all lists of sub storage data barcodes
  const getSubStorageLists = () => {
    getSubStorageDataLists(currentSelectedStorageData?.value)
      .then((res) => {
        // console.log('all children storage data inside current Selected Storage Name', res.data.data.object);
        const responseMsg = res?.data?.data?.message;
        // // console.log('next', res.data.data);
        // console.log('nd',res.data.data)
        if (responseMsg === 'No data found') {
          // when no Storage Data present inside and apply is clicked, set this to false
          // console.log('no Storage Data present inside');
          setNoFurtherStorageData(true);
          return;
        } else {
          const data = res?.data?.data?.object;
          // console.log('child storage data lists', data);
          const totalBarcodeIds = res?.data?.data?.object?.map((item) => String(item?.barcodeId));
          // console.log('total barcodes', totalBarcodeIds);
          // console.log('cssd', currentSelectedStorageData);

          // set totalBarcodeIds inside setSubStorageDataBarcodesList
          // setSubStorageDataBarcodesList([...subStorageDataBarcodesList, totalBarcodeIds]);
          setSubStorageDataBarcodesList(totalBarcodeIds);
        }
      })
      .catch((err) => console.log(err));
  };

  // fn to apply inventory filter
  const applyFilterInventory = async () => {
    if (!isMobile) {
      let storageIds = [];
      // when no next level data present, i.e noFurtherStorageData === false, call getInventoryData api
      if (noFurtherStorageData === true && currentSelectedStorageData !== '') {
        // in the storageIds set the barcode of currentSelected Storage Name
        storageIds.push(String(currentSelectedStorageData?.barcodeId));
      } else {
        if (currentSelectedStorageData !== '') {
          const flattendArray = subStorageDataBarcodesList
            .concat([String(currentSelectedStorageData?.barcodeId)])
            .flat();
          storageIds = flattendArray;
        }
      }
      setSubStorageDataBarcodesListArr(storageIds);
      filterObjectInventoryV2.storageIds = storageIds;

      // setIsFilterApplied(true);
      if (pageStateInventory.page === 1) {
        inventoryTableDataV2();
      } else {
        setPageStateInventory((old) => ({ ...old, page: 1, loader: true }));
      }

      // setPageStateInventory((old) => ({ ...old, page: 1, loader: true }));
      // intitalDataFetchInventoryPayload.pageNumber=1;
      // intitalDataFetchInventoryPayload.storageIds=storageIds;
      // inventoryTableData();

      // const filterObject = {
      //   pageNumber : 1,
      //   pageSize: 10,
      //   locationId: locId,
      //   brandList: [],
      //   storageIds: storageIds,
      //   orgId: orgId,
      //   outOfStock: status.value,
      // };

      // setPageStateInventory((old) => ({ ...old, page: 1, loader: true }));
      // getInventoryListMobile(filterObjectInventoryV2)
      //   .then(async (res) => {
      //     // let unique = [];
      //     let dataForEachGtins = [];
      //     let tot = '';

      //     dataArr = res.data.data.data.data;
      //     // console.log(res.data.data.data.data)

      //     tot = res.data.data.data.totalResult;
      //     const inventoryData = res.data.data.data.data;
      //     setInventoryData(inventoryData);

      //     const gtinInventoryData = inventoryData.map((item) => item.gtin);

      //     const payloadGtinInventory = {
      //       sourceLocationId: locId,
      //       gtinNoList: gtinInventoryData,
      //     };
      //     setTotalInventoryResult(tot);
      //     const resp = await getTotalQuantityOrderedForGtins(payloadGtinInventory);

      //     dataForEachGtins = resp.data.data.poItemQuantityOrderedList;
      //     dataRow.push(
      //       dataArr?.map((row, index) => ({
      //         gtin: row.gtin,
      //         product: textFormatter(row.itemName),
      //         brand: textFormatter(row.brand),
      //         vendor: row.vendorId ? textFormatter(row.vendorId) : 'NA',
      //         incoming: dataForEachGtins[index]['purchaseOrderList'].length
      //           ? [
      //               dataForEachGtins[index].totalQuantityOrdered,
      //               dataForEachGtins[index]['purchaseOrderList'][0]['poNumber'],
      //             ]
      //           : [dataForEachGtins[index].totalQuantityOrdered, null],
      //         openPo: dataForEachGtins[index]['purchaseOrderList'].length
      //           ? [dataForEachGtins[index].totalNoOfPo, dataForEachGtins[index]['purchaseOrderList'][0]['poNumber']]
      //           : [dataForEachGtins[index].totalNoOfPo, null],
      //         available: row.totalAvailableUnits,
      //         activeBatches: row?.activeBatches || 'NA',
      //         status: row.status,
      //         id: uuidv4(),
      //         // whensoldout: 'Continue Selling',
      //       })),
      //     );

      //     setPageStateInventory((old) => ({
      //       ...old,
      //       loader: false,
      //       page: 1,
      //       datRows: dataRow[0] || [],
      //       total: tot || 0,
      //     }));
      //     showSnackbar('Success Inventory List', 'success');
      //     setLoader(false);
      //   })
      //   .catch((err) => {
      //     showSnackbar(err.response.data.message, 'error');
      //     setLoader(false);
      //   });
    }
  };

  const removeSelectedInventoryFilter = (filterType) => {
    if (filterType.value) {
      // if storageId matches to the first element of storageNameState then run if condition
      if (filterType.value === storageHierarchy[0].value) {
        setFilterStateInventory({ ...filterStateInventory, storageName: 0 });
        // set storageHierarchy = []
        setStorageHierarchy([]);
        // set currentSelectedStorageData = ""
        setCurrentSelectedStorageData('');
        // reset subStorageDataBarcodesList = []
        setSubStorageDataBarcodesList([]);
        // set storageName inside filterStateInventory = 0
        setFilterStateInventory({ ...filterStateInventory, storageName: 0 });
        // update the filters applied inventory
        setFiltersAppliedInventory((prev) => prev - 1);

        // call getStorageDataLists fn to get all the top level storage data list
        getTopLevelStorageData();
        if (noFurtherStorageData === true) {
          setNoFurtherStorageData(false);
        }
      } else {
        // set currentSelectedStorageData to storageHierarchy prev value if present
        // if(storageHierarchyIndex!==0){
        //   setCurrentSelectedStorageData(storageHierarchy[storageHierarchyIndex-1]);
        // }
        // remove the selected storage data from storageHierarchy
        const updatedStorageHierarchy = storageHierarchy?.filter((storage) => storage.value !== filterType.value);
        setStorageHierarchy(updatedStorageHierarchy);
      }
    } else {
      switch (filterType) {
        case 'status':
          setStatus({
            value: false,
            label: 'Stock Status',
          });
          setFilterStateInventory({ ...filterStateInventory, status: 0 });
          setFiltersAppliedInventory((prev) => prev - 1);
          break;
        default:
          return;
      }
    }
  };

  // fn to  clear the inventory filter
  const handleClearInventory = () => {
    // reset current selected storage name
    setCurrentSelectedStorageData('');
    // reset the storage hierarchy = []
    setStorageHierarchy([]);
    // reset the subStorageDataBarcodesList = []
    setSubStorageDataBarcodesList([]);
    // set
    // reset noFurtherStorageData to false
    setNoFurtherStorageData(false);
    // reset setFilterStateInventory
    setFilterStateInventory({
      storageName: 0,
      status: 0,
    });
    // reset filtersAppliedInventory
    setFiltersAppliedInventory(0);
    // reset subStorageDataBarcodesList = []
    setSubStorageDataBarcodesList([]);
    // reset subStorageDataBarcodesListArr
    setSubStorageDataBarcodesListArr([]);

    // reset out of stock status to false
    setStatus({
      value: false,
      label: 'Stock Status',
    });

    setIsFilterApplied(true);

    // reset intitalDataFetchInventoryPayload page=1
    setPageStateInventory({
      loader: false,
      datRows: [],
      total: 0,
      page: 1,
      pageSize: 10,
    });

    // reset the filterObjectInventoryV2
    filterObjectInventoryV2.pageNumber = 1;
    filterObjectInventoryV2.storageIds = [];
    filterObjectInventoryV2.brandList = [];
    filterObjectInventoryV2.outOfStock = false;

    // fetch the top most storage data names
    getTopLevelStorageData();
    // fetch the inventoryTableDataV2
    inventoryTableDataV2();
  };

  // select boxes array to pass as prop to Filter component
  const selectBoxArray = [statusSelect, storageNameSelect];

  // useEffects here
  // useEffect(() => {
  //   getTopLevelStorageData();
  // }, [tabs.tab1]);

  // to call next level storage name api
  useEffect(() => {
    if (currentSelectedStorageData !== '') {
      getNextLevelStorageData(currentSelectedStorageData?.value);

      // also get all childrens storage name lists of inventory inside current SelectedStorageName
      getSubStorageLists();
    }
  }, [currentSelectedStorageData]);

  // codes for location hierarchy
  const getStorageLocationHierarchy = (storageBarcodeId) => {
    getStorageHierarchy(storageBarcodeId)
      .then((res) => {
        const obj = res?.data?.data?.object;
        if (obj?.includes('-->')) {
          const arr = obj?.split('-->');
          // update the storageHierarchyarr
          setStorageHierarchyArr(arr);
          // set showStoragehierarchy to true
          setShowLocationHierarchy(!showLocationHierarchy);
        } else {
          // update the storageHierarchyarr
          setStorageHierarchyArr([...storageHierarchyArr, obj]);
          // set showStoragehierarchy to true
          setShowLocationHierarchy(!showLocationHierarchy);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // when setShowLocation
  useEffect(() => {
    if (!showLocationHierarchy) {
      // reset setStorageHierarchyArr
      setStorageHierarchyArr([]);
    }
  }, [showLocationHierarchy, openmodelLocation]);

  const [tabsOrientation, setTabsOrientation] = useState('horizontal');
  // analysis tabs for inventory, sales and profit
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
    // console.log('tab value', newValue)
    setTabValue(newValue);
  };

  // inventory categorization - abc analysis
  //state for current category selected for inventory categorization
  const [currentSelectedCategory, setCurrentSelectedCategory] = useState('A');
  const [selectedCategory, setSelectedCategory] = useState({
    categoryAll: false,
    categoryA: true,
    categoryB: false,
    categoryC: false,
  });
  // to store product count for ABC Analysis page
  const [totalProductCount, setTotalProductCount] = useState(0);

  const abcTooltips = {
    0: {
      A: 'Highest Consumption',
      B: 'Average Consumption',
      C: 'Lowest Consumption',
    },
    1: {
      A: 'Fast Movement',
      B: 'Average Movement',
      C: 'Low Movement',
    },
    2: {
      A: 'Highest Value',
      B: 'Average Value',
      C: 'Lowest Value',
    },
  };

  const categoryColors = {
    A: 'success',
    B: 'warning',
    C: 'error',
  };

  // fn to handle current category selected
  const handleCategorySelection = (category) => {
    setSelectedCategory((prevState) => {
      return Object.keys(prevState).reduce((acc, key) => {
        acc[key] = key === category ? true : false;
        return acc;
      }, {});
    });
    setCurrentSelectedCategory(category === 'categoryAll' ? null : category.charAt(category?.length - 1));
  };

  return (
    <DashboardLayout>
      {!isMobile && <DashboardNavbar />}

      <Snackbar open={opensnack} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={timelinerror} sx={{ width: '100%' }}>
          {alertmessage}
        </Alert>
      </Snackbar>

      <SoftBox
        // className="softbox-box-shadow range"
        className={`${!isMobile ? 'search-bar-filter-and-table-container' : 'new-header-inventory'}`}
      >
        <Box
          className={!isMobile && 'search-bar-filter-container'}
          sx={{
            padding: !isMobile && `15px 15px ${tabs.tab3 ? '15px' : '0'} 15px !important`,
            // bgcolor: !isMobile && 'var(--search-bar-filter-container-bg)',
            borderTopLeftRadius: '10px',
            borderTopRightRadius: '10px',
          }}
        >
          <Box
            className="tab-contents-export-adjust"
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '10px',
              marginBottom: isMobile ? '' : '16px',
            }}
          >
            {!isMobile && (
              <>
                <Box className="tabs new-tabs">
                  {!showExport && (
                    <>
                      <SoftTypography
                        className={tabs.tab1 ? 'filter-div-tag' : 'filter-div-paid'}
                        varient="h6"
                        // onClick={() => changesTab(true, false)}
                        onClick={() => handleTabClick('tab1')}
                        sx={{ borderBottomColor: 'rgb(0,100,254)', cursor: 'pointer', color: '#ffffff' }}
                      >
                        Inventory
                      </SoftTypography>
                      <SoftTypography
                        className={tabs.tab2 ? 'filter-div-tag mange' : 'filter-div-paid'}
                        varient="h6"
                        // onClick={() => changesTab(false, true)}
                        onClick={() => handleTabClick('tab2')}
                        sx={{ borderBottomColor: '#ffffff', marginLeft: '2rem', cursor: 'pointer', color: '#ffffff' }}
                      >
                        Inventory Adjustment
                      </SoftTypography>
                    </>
                  )}

                  {/* inventoy categorization - abc analysis */}
                  <SoftTypography
                    className={tabs.tab3 ? 'filter-div-tag mange' : 'filter-div-paid'}
                    varient="h6"
                    // onClick={() => changesTab(false, true)}
                    onClick={() => handleTabClick('tab3')}
                    sx={{
                      borderBottomColor: '#ffffff',
                      marginLeft: showExport ? '' : '2rem',
                      cursor: 'pointer',
                      color: '#ffffff',
                    }}
                  >
                    ABC Analysis
                  </SoftTypography>
                </Box>
                {showExport && (
                  <SoftButton onClick={handleAnalysisExport}>
                    <CloudDownloadOutlinedIcon sx={{ marginRight: '10px' }} />
                    Export
                  </SoftButton>
                )}
              </>
            )}
            {isMobile && (
              <SoftBox sx={{ height: '100px', padding: '16px 16px 0px', width: '100%' }}>
                <SoftBox sx={{ height: '40px !important', position: 'relative' }}>
                  {/* <MobileNavbar title={'Inventory Adjustment'} isMobileDevice={isMobile} /> */}
                  <CommonSearchBar
                    searchFunction={(e) => setSearchedValue(e.target.value)}
                    // handleNewBtnFunction={handleNew}
                    placeholder="Search Products..."
                    handleNewRequired={false}
                  />
                </SoftBox>
              </SoftBox>
            )}

            {/* {!isMobile && (
              <Box className="tab-headers-btn">
                {tabs.tab2 ? (
                  <SoftButton
                    className="purchase-main-btn-i vendor-add-btn inventory-btn"
                    // variant="gradient"
                    variant="insideHeader"
                    // color="info"
                    sx={{
                      marginRight: '1rem',
                      display:
                        permissions?.RETAIL_Products?.WRITE ||
                        permissions?.WMS_Products?.WRITE ||
                        permissions?.VMS_Products?.WRITE
                          ? 'block'
                          : 'none',
                    }}
                    onClick={handleOpenInventoryAdjustment}
                  >
                    <EditIcon
                      sx={{
                        position: 'relative',
                        right: '0.5rem',
                      }}
                    />
                    Inventory
                  </SoftButton>
                ) : null}
                {exportLoader ? (
                  <BeatLoader color="rgb(0,100,254)" size={15} />
                ) : (
                  <>
                    {!isMobile && (
                      <SoftBox>
                        <SoftButton
                          // onClick={() => handleExport('pdf')}
                          variant="insideHeader"
                          id="basic-button"
                          aria-controls={openExport ? 'basic-menu' : undefined}
                          aria-haspopup="true"
                          aria-expanded={openExport ? 'true' : undefined}
                          onClick={handleClickExport}
                          className="vendor-add-btn"
                        >
                          <FileDownloadIcon
                            sx={{
                              position: 'relative',
                              right: '0.5rem',
                            }}
                          />
                          Export
                        </SoftButton>
                        <Menu
                          id="basic-menu"
                          anchorEl={anchorElExport}
                          open={openExport}
                          onClose={handleCloseExport}
                          MenuListProps={{
                            'aria-labelledby': 'basic-button',
                          }}
                          className="menu"
                          getContentAnchorEl={null}
                          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                          PaperProps={{
                            style: {
                              marginTop: '0',
                              width: '8.2rem',
                            },
                          }}
                        >
                          <MenuItem onClick={() => handleExport('pdf')} className="listOptions">
                            PDF
                          </MenuItem>
                          <MenuItem className="listOptions" onClick={() => handleExport('csv')}>
                            CSV
                          </MenuItem>
                        </Menu>
                      </SoftBox>
                    )}
                  </>
                )}
              </Box>
            )} */}
          </Box>
          {/* search box  */}
          {!isMobile && (
            <>
              <Box sx={{ padding: tabs.tab3 ? '15px 0px 0px' : '15px' }}>
                <Grid container spacing={2} justifyContent={'space-between'} alignItems={'center'}>
                  {!tabs.tab3 && (
                    <Grid item lg={5.5} md={5.5} sm={6} xs={12} paddingLeft={'0 !important'}>
                      <SoftBox sx={{ position: 'relative' }}>
                        <SoftInput
                          placeholder=" Search by product"
                          // className="stoc"
                          value={tabs.tab1 ? searchValInventory : searchValAdjustInventory}
                          onChange={tabs.tab1 ? handleSearchInventory : handleSearchAdjustInventory}
                          icon={{ component: 'search', direction: 'left' }}
                        />
                        {tabs.tab1 && searchValInventory !== '' && (
                          <ClearSoftInput clearInput={handleClearInventorySearch} />
                        )}
                        {tabs.tab2 && searchValAdjustInventory !== '' && (
                          <ClearSoftInput clearInput={handleClearAdjustInventorySearch} />
                        )}
                      </SoftBox>
                    </Grid>
                  )}

                  {/* {tabs.tab1 ? (
                  <Grid item md={3} xs={12} sx={{ paddingTop: '0 !important' }}>
                    <SoftBox sx={{ marginLeft: '10px', marginRight: '10px' }}>
                      <SoftSelect
                        insideHeader={true}
                        placeholder="Status"
                        value={status}
                        options={[
                          { value: 'A', label: 'ALL' },
                          { value: 'Y', label: ' Available' },
                          { value: 'N', label: 'Out of stock' },
                        ]}
                        onChange={(option) => handleStatus(option)}
                        menuPortalTarget={document.body}
                      />
                    </SoftBox>
                  </Grid>
                ) : null} */}

                  {tabs.tab1 ? (
                    <>
                      {exportLoader ? (
                        <BeatLoader color="white" size={15} />
                      ) : (
                        <>
                          <Grid
                            item
                            lg={6.5}
                            md={3.5}
                            sm={6}
                            xs={12}
                            sx={{ paddingTop: '0 !important' }}
                            justifyContent={'right'}
                          >
                            <SoftBox sx={{ display: 'flex', alignItems: 'center', justifyContent: 'right' }}>
                              {/* filter  */}
                              <Filter
                                filtersApplied={filtersAppliedInventory}
                                filterChipBoxes={filterChipBoxes}
                                selectBoxArray={selectBoxArray}
                                handleApplyFilter={applyFilterInventory}
                                handleClearFilter={handleClearInventory}
                              />
                            </SoftBox>
                          </Grid>
                        </>
                      )}
                    </>
                  ) : (
                    <SoftBox></SoftBox>
                  )}

                  <Grid
                    item
                    lg={6.5}
                    md={6.5}
                    sm={6}
                    xs={12}
                    sx={{
                      display: 'flex',
                      justifyContent: 'right',
                      columnGap: '10px',
                      alignItems: 'center',
                      paddingTop: '0 !important',
                    }}
                  >
                    <Box className="tab-headers-btn">
                      {tabs.tab2 ? (
                        <SoftButton
                          className="purchase-main-btn-i inventory-btn"
                          // variant="gradient"
                          // variant="insideHeader"
                          variant="solidWhiteBackground"
                          // color="info"
                          sx={{
                            marginRight: '1rem',
                            display:
                              permissions?.RETAIL_Products?.WRITE ||
                              permissions?.WMS_Products?.WRITE ||
                              permissions?.VMS_Products?.WRITE
                                ? 'block'
                                : 'none',
                          }}
                          onClick={handleOpenInventoryAdjustment}
                        >
                          <EditIcon
                            sx={{
                              position: 'relative',
                              right: '0.5rem',
                            }}
                          />
                          Inventory
                        </SoftButton>
                      ) : null}
                    </Box>

                    {/* filter box  */}
                    {tabs.tab2 && (
                      <Filter
                        filtersApplied={filtersApplied}
                        filterChipBoxes={filterChipBoxesInvAdjust}
                        selectBoxArray={selectBoxArrayInvAdjust}
                        handleApplyFilter={applyInventoryAdjustmentFilter}
                        handleClearFilter={handleClear}
                      />
                    )}
                    {/* end of filter box  */}
                  </Grid>

                  {/* {tabs.tab2 ? (
              <>
                <Grid item md={2} xs={12}>

                </Grid>
              </>
            ) : null} */}
                  {/* {tabs.tab2 && !isMobile ? (
              <Grid item md={2} xs={12}>
             
              </Grid>
            ) : null} */}
                  {/* {tabs.tab2 ? (
              <Grid item md={2} xs={12}>

              </Grid>
            ) : null} */}

                  {/* {!isMobile && (
              <Grid item md={2} xs={12} sx={{ textAlign: tabs.tab2 && 'right' }}>
                <SoftButton
                  sx={{
                    marginLeft: '10px',
                    marginBottom: '15px',
                  }}
                  onClick={handleClear}
                  style={showDatePicker ? { display: 'none' } : null}
                  className="vendor-second-btn"
                >
                  Clear
                </SoftButton>
              </Grid>
            )} */}

                  {/* Calendar filter */}

                  {/* {tabs.tab2 ? (
            <SoftBox
              className={showDatePicker ? 'active-date-input-containers' : 'date-input-containers'}
              sx={{ position: 'relative' }}
            >
              <SoftInput
                placeholder=" Select Date Range"
                className="stoc"
                onClick={handleDateInputClick}
                value={`${dateRange.startDate.toLocaleDateString()} - ${dateRange.endDate.toLocaleDateString()}`}
              />
              <CalendarMonthIcon
                color="info"
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '16px',
                  cursor: 'pointer',
                }}
                onClick={handleDateInputClick}
              />

              <Box>
                {showDatePicker && (
                  <DateRangePicker
                    showSelectionPreview={false}
                    ranges={[dateRange]}
                    onChange={handleDateRangeSelection}
                    onClose={() => setShowDatePicker(false)}
                  />
                )}
              </Box>
            </SoftBox>
          ) : null} */}
                </Grid>
                {/* categories tabs here */}
                {tabs.tab3 && (
                  <>
                    <Box className="content-space-between">
                      <Grid container className="" justifyContent={'space-between'}>
                        <Grid item xs={12} md={5.5} lg={3.5}>
                          <Card
                            sx={{
                              backdropFilter: 'saturate(200%) blur(30px)',
                              backgroundColor: ({ functions: { rgba }, palette: { white } }) => rgba(white.main, 0.8),
                              boxShadow: ({ boxShadows: { navbarBoxShadow } }) => navbarBoxShadow,
                              padding: '0 !important',
                              borderRadius: '0.5rem',
                              // width: "400px"
                            }}
                          >
                            <Tabs
                              orientation={tabsOrientation}
                              value={tabValue}
                              onChange={handleSetTabValue}
                              sx={{ background: 'transparent' }}
                              className="tabs-box"
                              style={{ marginLeft: '0px', padding: '0' }}
                            >
                              <Tab sx={{ padding: '7px 0px', fontSize: '14px' }} label="Inventory" />
                              <Tab sx={{ padding: '7px 0px', fontSize: '14px' }} label="Sales" />
                              <Tab sx={{ padding: '7px 0px', fontSize: '14px' }} label="Profit" />
                            </Tabs>
                          </Card>
                        </Grid>
                        {/* search and filter  */}
                        <Grid item lg={5.5} md={5.5} sm={6} xs={12} paddingLeft={'0 !important'}>
                          <SoftBox
                            // sx={{ marginTop: '5px' }}
                            // className="content-space-between"
                            className="content-center-right"
                          >
                            <SoftBox sx={{ width: '95%', position: 'relative' }}>
                              <SoftInput
                                placeholder=" Search"
                                value={searchValAnalysis}
                                onChange={handleSearchAnalysis}
                                icon={{ component: 'search', direction: 'left' }}
                              />
                              {searchValAnalysis !== '' && <ClearSoftInput clearInput={handleClearAnalysis} />}
                            </SoftBox>
                            {/* <SoftBox>
                            <Filter />
                          </SoftBox> */}
                          </SoftBox>
                        </Grid>
                      </Grid>

                      {/* </SoftBox> */}
                    </Box>
                  </>
                )}
              </Box>
            </>
          )}

          {/* export and filter for inventory categorization  */}
          {/* {tabs.tab3 && 
            <SoftBox className="content-center-right">
              <SoftBox>
                <SoftButton
                  variant="solidWhiteBackground"              
                > 
                  Export
                </SoftButton> 

                <Filter />
              </SoftBox>
            </SoftBox>
          } */}
        </Box>
        {tabs.tab3 && (
          <>
            <SoftBox
              className="content-space-between"
              sx={{ padding: '10px 15px', backgroundColor: '#f7f7ff !important' }}
            >
              <SoftBox className="content-left">
                <SoftTypography sx={{ fontSize: '14px', color: '#000000', marginRight: '10px' }}>
                  Category:{' '}
                </SoftTypography>
                <FormGroup sx={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
                  {/* <Tooltip title="All">
                        <FormControlLabel 
                          control={
                            <Radio 
                              checked={selectedCategory.categoryAll ? true : false}  
                            />
                          } 
                          sx={{ '& .MuiFormControlLabel-label': { color: '#ffffff' }}} 
                          label="All" 
                          onClick={()=>handleCategorySelection("categoryAll")}
                        />
                      </Tooltip> */}
                  <Tooltip title={abcTooltips[tabValue].A}>
                    <FormControlLabel
                      control={
                        <Radio
                          checked={selectedCategory.categoryA ? true : false}
                          sx={{ border: !selectedCategory.categoryA && '2px solid gray' }}
                        />
                      }
                      sx={{ '& .MuiFormControlLabel-label': { color: '#000000' } }}
                      label="A"
                      onClick={() => handleCategorySelection('categoryA')}
                    />
                  </Tooltip>
                  <Tooltip title={abcTooltips[tabValue].B}>
                    <FormControlLabel
                      control={
                        <Radio
                          checked={selectedCategory.categoryB ? true : false}
                          sx={{ border: !selectedCategory.categoryB && '2px solid gray' }}
                        />
                      }
                      sx={{ '& .MuiFormControlLabel-label': { color: '#000000' } }}
                      label="B"
                      onClick={() => handleCategorySelection('categoryB')}
                    />
                  </Tooltip>
                  <Tooltip title={abcTooltips[tabValue].C}>
                    <FormControlLabel
                      control={
                        <Radio
                          checked={selectedCategory.categoryC ? true : false}
                          sx={{ border: !selectedCategory.categoryC && '2px solid gray' }}
                        />
                      }
                      sx={{ '& .MuiFormControlLabel-label': { color: '#000000' } }}
                      label="C"
                      onClick={() => handleCategorySelection('categoryC')}
                    />
                  </Tooltip>
                </FormGroup>
              </SoftBox>
              {/* total results  */}
              <SoftTypography sx={{ fontSize: '14px', fontWeight: 'bold' }}>
                <Chip
                  color={
                    (selectedCategory.categoryA && categoryColors['A']) ||
                    (selectedCategory.categoryB && categoryColors['B']) ||
                    (selectedCategory.categoryC && categoryColors['C'])
                  }
                  label={
                    (selectedCategory.categoryA && abcTooltips[tabValue]['A']) ||
                    (selectedCategory.categoryB && abcTooltips[tabValue]['B']) ||
                    (selectedCategory.categoryC && abcTooltips[tabValue]['C'])
                  }
                  // variant="outlined"
                  sx={{ marginRight: '10px' }}
                />
                Total Results: {totalProductCount}
              </SoftTypography>
            </SoftBox>
            {/* <Grid container className="content-space-between">
                  <Grid item lg={5.5} md={5.5} sm={6} xs={12} paddingLeft={'0 !important'}>
                    <SoftBox
                      // sx={{ marginTop: '5px' }}
                    >
                      <SoftInput
                        placeholder=" Search"
                        // className="stoc"
                        value={tabs.tab1 ? searchValInventory : searchValAdjustInventory}
                        onChange={tabs.tab1 ? handleSearchInventory : handleSearchAdjustInventory}
                        icon={{ component: 'search', direction: 'left' }}
                      />
                    </SoftBox>
                  </Grid>
                  <Grid>
                    <Filter />
                  </Grid>
                </Grid> */}
          </>
        )}

        <Modal
          open={openmodelLocation}
          onClose={handleClose4}
          aria-labelledby="parent-modal-title"
          aria-describedby="parent-modal-description"
        >
          <Box
            sx={{
              width: '60vw',
              height: '70vh',
              backgroundColor: '#fff',
              alignItems: 'center',
              justifyContent: 'center',
              margin: 'auto',
              marginTop: '6rem',
              borderRadius: '1rem',
              overflow: 'auto',
              position: 'relative',
            }}
          >
            <Box sx={{ position: 'relative', padding: '15px' }}>
              <Box>
                <SoftBox display="flex" alignItem="center">
                  <SoftTypography variant="h6" fontWeight="bold">
                    Brand:
                  </SoftTypography>
                  <SoftTypography variant="h6">
                    {invtable?.length ? textFormatter(invtable[0]?.brand) : null}
                  </SoftTypography>
                </SoftBox>

                <SoftBox display="flex" alignItem="center" gap="10px">
                  <SoftTypography variant="h6" fontWeight="bold">
                    GTIN:
                  </SoftTypography>
                  <SoftTypography variant="h6">{invtable?.length ? invtable[0]?.gtin : null}</SoftTypography>
                </SoftBox>

                <SoftBox width="100%" position="relative" display="flex" alignItem="center" gap="10px">
                  <SoftTypography variant="h6" fontWeight="bold">
                    Item-Name:
                  </SoftTypography>
                  <SoftTypography variant="h6">
                    {invtable?.length ? textFormatter(invtable[0].itemName) : null}
                  </SoftTypography>
                  {showLocationHierarchy && (
                    <SoftBox style={{ position: 'absolute', right: 0 }}>
                      <SoftButton color="info" onClick={() => setShowLocationHierarchy(!showLocationHierarchy)}>
                        Show Table
                      </SoftButton>
                    </SoftBox>
                  )}
                </SoftBox>
              </Box>
            </Box>
            <SoftBox p="1rem">
              {/* <SoftBox display="flex" alignItem="center" px="1rem">
                <SoftTypography>SKU:</SoftTypography>
                <SoftTypography>{invtable.length ? invtable[0].skuid : null}</SoftTypography>
              </SoftBox> */}

              {/* <SoftBox display="flex" alignItem="center" gap="10px" px="1rem">
                  <SoftTypography>Available Units</SoftTypography>
                  <SoftTypography>{invtable.length ?invtable[0].availableUnits:null}</SoftTypography>
                </SoftBox> */}
              {/* <table className="loc-inventory">
                <thead>
                  <tr style={{ width: '100%' }}>
                    <th className="th-value">StorageID</th>
                    <th className="th-value">StorageName</th>
                    <th className="th-value">Batch Id</th>
                    <th className="th-value">Quantity</th>
                    <th className="th-value">UOM</th>
                  </tr>
                </thead>
                <tbody>
                  {invtable.length
                    ? invtable.map((item) => (
                        <tr>
                          <td className="th-value">{item.storageId}</td>
                          <td className="th-value">{item.storageName}</td>
                          <td className="th-value">{item.batchNo}</td>
                          <td className="th-value">{item.availableUnits}</td>
                          <td className="th-value">{item.weightUOM}</td>
                        </tr>
                      ))
                    : null}
                </tbody>
              </table> */}
              <div
                style={{
                  height: '20rem',
                  width: '100%',
                  // paddingTop: '30px',
                  // padding: '15px',
                }}
              >
                {/* {loader && <Spinner />}
              {!loader && ( */}
                {/* when show location is clicked remove table and display location hierarchy */}

                {!showLocationHierarchy ? (
                  <DataGrid
                    rows={gtinTableData}
                    // onCellClick={(row) => {
                    //   const storageBarcodeId = row.row.storageId;
                    //   if (!storageBarcodeId.includes('---') && storageBarcodeId !== '') {
                    //     // setSelectedStorageBarcodeId(row.row.storageId);
                    //     // set the setShowLocationHierarchy to true
                    //     // setShowLocationHierarchy(!showLocationHierarchy);
                    //     getStorageLocationHierarchy(storageBarcodeId);
                    //   }
                    // }}
                    columns={columnsGtin}
                    rowsPerPageOptions={[10]}
                    getRowId={(row) => row.batchNo}
                    pagination
                  />
                ) : (
                  <>
                    <SoftBox
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        gap: '5px',
                        alignItems: 'center',
                        textAlign: 'center',
                        padding: '20px 0',
                        overflow: 'scroll',
                      }}
                    >
                      <Typography variant="h5" fontWeight="bold">
                        Storage Location Hierarchy
                      </Typography>
                      <br />
                      {storageHierarchyArr?.length !== 0 &&
                        storageHierarchyArr?.map((storage, index) => (
                          <>
                            <SoftTypography
                              variant="h6"
                              className={index === 0 ? 'storage-name-card-main' : 'storage-name-card'}
                            >
                              {storage}
                            </SoftTypography>
                            {storageHierarchyArr?.length > 0 && index !== storageHierarchyArr?.length - 1 && (
                              <Box className="content-center">
                                <SouthIcon sx={{ fontSize: '18px' }} />
                              </Box>
                            )}
                          </>
                        ))}
                    </SoftBox>
                  </>
                )}

                {/* )} */}
              </div>
            </SoftBox>
          </Box>
        </Modal>

        {/*  */}
        <Modal
          // sx={{width:'60%'}}
          open={openModelInventoryAdjustment}
          onClose={handleCloseModelInventoryAdjustment}
          aria-labelledby="parent-modal-title"
          aria-describedby="parent-modal-description"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            initial={{ y: 100, x: 0 }}
            animate={{ y: 0, x: 0 }}
            transition={{
              type: 'linear',
            }}
            style={{
              // position: 'absolute',
              // top: '50%',
              // left: '50%',
              // transform: 'translate(-50%, -50%)',
              padding: '20px',
              // width: '100%',
              // height: '100%',
              // height:"50rem",
              overflow: 'auto',
            }}
            className="batch-box-inventory-i"
            id="inventory-adjustment-modal-id"
          >
            <SoftBox
              container
              sx={{
                height: '100%',
                width: '100%',
                display: 'flex',
                alignItem: 'center',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <SoftBox sx={{ width: '100%', height: 'auto' }}>
                <SoftTypography
                  component="label"
                  variant="caption"
                  fontWeight="bold"
                  textTransform="capitalize"
                  style={{ marginTop: '0.8rem' }}
                >
                  {/* GTIN */}
                  PRODUCT CODE
                </SoftTypography>
                <SoftBox className="form-flex-inward-box">
                  {/* <SoftInput
                  type="text"
                  placeholder="Enter Barcode Eg : 8906065850940"
                  value={gtin}
                  readOnly={locationData !== null ? true : false}
                  onChange={(e) => setGtin(e.target.value)}
                /> */}
                  {locationData == null ? (
                    <Autocomplete
                      // disableClearable
                      options={prodOptions}
                      getOptionLabel={(option) => option.label}
                      onChange={(e, v) => handleAutoComplete(v)}
                      // isOptionEqualToValue={(option, value) => option.value === value.value}
                      className="product-code-autocomplete"
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          // value={searchProduct}
                          onChange={(e) => handleChange(e)}
                          placeholder="Enter Barcode Eg : 8906065850940"
                          variant="outlined"
                          fullWidth
                        />
                      )}
                    />
                  ) : (
                    <SoftInput
                      type="text"
                      placeholder="Enter Barcode Eg : 8906065850940"
                      value={gtin}
                      readOnly={true}
                      // onChange={(e) => setGtin(e.target.value)}
                    />
                  )}

                  {locationData == null && verifyLoader ? (
                    <Spinner />
                  ) : !verifyLoader && locationData == null ? (
                    <>
                      <SoftBox id="verify-desktop" className="wrapper-btn-box-inward-I">
                        <SoftButton
                          variant={buttonStyles.primaryVariant}
                          className="vefir-bnt contained-softbutton"
                          onClick={handleVerifyGtin}
                        >
                          Verify
                        </SoftButton>
                      </SoftBox>
                      <SoftBox id="verify-mobile">
                        <SoftButton
                          color="info"
                          className="vendor-add-btn inv-scan"
                          onClick={handleStartScanning}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                          }}
                        >
                          <QrCodeScannerIcon
                            // fontSize="large"
                            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                          />
                          Scan
                        </SoftButton>
                      </SoftBox>
                    </>
                  ) : null}
                </SoftBox>

                {/* <SoftTypography component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                {barcodeData}
              </SoftTypography> */}

                <SoftTypography component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                  Batch Ids
                </SoftTypography>
                <SoftSelect placeholder="Eg: BT001" options={batchIds} onChange={(option) => handleBatchIds(option)} />

                {showAvailableQuantities ? (
                  <>
                    <SoftTypography component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                      Available Quantities
                    </SoftTypography>
                    <SoftInput type="text" value={availableQuantities} readOnly={true} />
                  </>
                ) : null}
                <SoftTypography component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                  Adjustment Type
                </SoftTypography>
                <SoftSelect
                  type="text"
                  placeholder="Select Type..."
                  options={[
                    // { label: 'Add', value: 'ADD' },
                    { label: 'Reduce', value: 'SUBTRACT' },
                  ]}
                  onChange={(option) => setAdjustmentType(option.value)}
                />
                <SoftTypography component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                  Adjustment Quantity
                </SoftTypography>
                <SoftInput type="text" placeholder="Eg: 20" value={quantity} onChange={handleQuantity} />

                <SoftBox mt={2} mb={1} lineHeight={0} display="inline-block">
                  <SoftTypography component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                    Reason
                  </SoftTypography>
                </SoftBox>
                <SoftBox item xs={12} sm={12}>
                  <SoftSelect
                    placeholder="Reason"
                    options={[
                      // { value: 'STOCK ADDITION', label: 'Stock Addition' },
                      { value: 'STOCK REDUCTION', label: 'Stock Reduction' },
                      { value: 'WASTAGE', label: 'Wastage' },
                      { value: 'SHRINKAGE', label: 'Shrinkage' },
                      { value: 'THEFT', label: 'Theft' },
                      { value: 'STORE USE', label: 'Store use' },
                      { value: 'DAMAGED', label: 'Damaged' },
                      { value: 'EXPIRED', label: 'Expired' },
                      { value: 'RETURNS NOT SALEABLE', label: 'Returns not saleable' },
                      // { value: 'ITEM BROKEN', label: 'Item broken' },
                      // { value: 'USED PRODUCTS', label: 'Used products' },
                      // { value: 'ITEM MISSING', label: 'Item missing' },
                      // { value: 'ITEM USED', label: 'Item used' },
                      // { value: 'PRODUCT SIZE IS LARGE', label: 'Product size is large' },
                      // { value: 'PRODUCT SIZE IS SMALL', label: 'Product size is small' },
                      // { value: 'INWARD', label: 'Inward' },
                      { value: 'OTHERS', label: 'Others' },
                    ]}
                    onChange={(option) => handleReasonModel(option)}
                    // menuPortalTarget={document.body}
                  />
                </SoftBox>

                {showAvailableQuantities && (
                  <>
                    <SoftTypography component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                      Stocks In Hand
                    </SoftTypography>
                    <SoftInput
                      disabled
                      type="text"
                      value={availableQuantities ? availableQuantities - quantity : ''}
                      onChange={handleQuantity}
                    />
                  </>
                )}

                {/* <SoftBox mt={2} mb={1} ml={2} lineHeight={0} display="inline-block">
                  <SoftTypography component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                    Account
                  </SoftTypography>
                </SoftBox>
                <SoftBox item xs={12} sm={12}>
                  <SoftSelect
                    defaultValue={{ value: 'Acc', label: 'Rent expense' }}
                    options={[
                      { value: 'acc1', label: 'Repairs' },
                      { value: 'acc2', label: 'Travel expense' },
                      { value: 'acc3', label: 'Discount' },
                      { value: 'acc4', label: 'General Income' },
                      { value: 'acc5', label: 'Interest Income' },
                    ]}
                  />
                </SoftBox> */}
                <SoftBox item xs={12} sm={12} mt={5}>
                  <SoftBox className="multiple-box multiple-box-new">
                    <label variant="body2" className="body-label body-label-new">
                      {/* <br /> */}
                      <FileUploadIcon className="upload-icon" />
                      Browse Image
                      <input
                        type="file"
                        name="images"
                        multiple
                        accept="image/png , image/jpeg, image/webp"
                        onChange={handleImageUpload}
                      />
                    </label>
                  </SoftBox>

                  <br />

                  <input type="file" multiple />
                  {previewImg !== null ? (
                    <Box
                      className="upload=image-preview"
                      style={{
                        height: '5rem',
                        width: '5rem',
                        position: 'relative',
                      }}
                    >
                      <SoftAvatar src={previewImg} alt="" variant="rounded" size="xl" shadow="sm" />
                    </Box>
                  ) : null}
                  {/* {selectedImages.length > 0 &&
                    (selectedImages.length > 10 ? (
                      <p className="error">
                        You can't upload more than 10 images! <br />
                        <span>
                          please delete <b> {selectedImages.length - 10} </b> of them{' '}
                        </span>
                      </p>
                    ) : (
                      ''
                    ))}

                  <div className="images-box">
                    {selectedImages &&
                      selectedImages.map((image, index) => {
                        return (
                          <div key={image} className="image">
                            <img src={image} height="200" alt="" className="uil" />
                            <button onClick={() => deleteHandler(image)} className="del-btn">
                              <DeleteOutlineIcon />
                            </button>
                          </div>
                        );
                      })}
                  </div>*/}
                </SoftBox>

                {previewImg !== null ? (
                  <Box
                    className="upload=image-preview"
                    style={{
                      height: '5rem',
                      width: '5rem',
                      position: 'relative',
                    }}
                  >
                    <SoftAvatar src={previewImg} alt="" variant="rounded" size="xl" shadow="sm" />
                  </Box>
                ) : null}

                <SoftBox sx={{ marginBottom: '10px !important' }}>
                  <SoftBox className="header-submit-box-i">
                    <SoftButton
                      onClick={handleCloseModelInventoryAdjustment}
                      variant={buttonStyles.secondaryVariant}
                      className="outlined-softbutton"
                    >
                      Cancel
                    </SoftButton>
                    {modalSaveLoader ? (
                      <Spinner />
                    ) : (
                      <SoftButton
                        // variant="gradient"
                        onClick={handleSave}
                        variant={buttonStyles.primaryVariant}
                        className="vendor-add-btn contained-softbutton"
                      >
                        Save
                      </SoftButton>
                    )}
                  </SoftBox>
                </SoftBox>
              </SoftBox>
            </SoftBox>
          </div>
        </Modal>

        <Modal
          open={openScanner}
          // open={true}
          onClose={() => setOpenScanner(false)}
          aria-labelledby="parent-modal-title"
          aria-describedby="parent-modal-description"
        >
          <motion.div
            initial={{ y: 100, x: 0 }}
            animate={{ y: 0, x: 0 }}
            transition={{
              type: 'linear',
            }}
            style={{
              position: 'relative',
              transform: 'translate(-50%, -50%)',
              p: 4,
              width: '100%',
              margin: 'auto',
              // height: '100%',
              // width: '100%',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'center',
              paddingTop: '40px',
              // marginTop: '40px'
            }}
            className="batch-box-inventory-i"
            id="qr-reader-id"
          >
            {scanning && (
              <>
                <BarcodeScannerComponent
                  width="70%"
                  height="50%"
                  onUpdate={(err, result) => handleBarcodeScan(err, result)}
                />
              </>
            )}

            <Box
              sx={{ display: 'flex', justifyContent: 'center', position: 'absolute', bottom: '20px', width: '100%' }}
            >
              <SoftButton
                variant={buttonStyles.primaryVariant}
                className="contained-softbutton"
                onClick={handleCancelScanning}
              >
                cancel scanning
              </SoftButton>
            </Box>
          </motion.div>
        </Modal>

        {/* form end  */}
        {/* </SoftBox> */}

        {/*<--- inventory categorization(ABC Analysis tabs - inventory, sales, salesProfit) */}
        {tabs.tab3 && tabValue === 0 && (
          <InventoryAnalysis
            locationId={locId}
            orgId={orgId}
            tabValue={tabValue}
            debouncedSearchValAnalysis={debouncedSearchValAnalysis}
            selectedCategory={selectedCategory}
            currentSelectedCategory={currentSelectedCategory}
            setTotalProductCount={setTotalProductCount}
            handleCellClickInventory={handleCellClickInventory}
          />
        )}
        {tabs.tab3 && tabValue === 1 && (
          <SalesAnalysis
            locationId={locId}
            orgId={orgId}
            tabValue={tabValue}
            debouncedSearchValAnalysis={debouncedSearchValAnalysis}
            selectedCategory={selectedCategory}
            currentSelectedCategory={currentSelectedCategory}
            setTotalProductCount={setTotalProductCount}
            handleCellClickInventory={handleCellClickInventory}
          />
        )}
        {tabs.tab3 && tabValue === 2 && (
          <ProfitAnalysis
            locationId={locId}
            orgId={orgId}
            tabValue={tabValue}
            debouncedSearchValAnalysis={debouncedSearchValAnalysis}
            selectedCategory={selectedCategory}
            currentSelectedCategory={currentSelectedCategory}
            setTotalProductCount={setTotalProductCount}
            handleCellClickInventory={handleCellClickInventory}
          />
        )}
        {/* inventory categorization(ABC Analysis tabs - inventory, sales, salesProfit) --->*/}

        {tabs.tab1 && !isMobile ? (
          <SoftBox
          //  py= {1}
          >
            {/* <Grid> */}
            {pageStateInventory.loader && (
              <Box
                sx={{
                  height: '37rem',
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Spinner />
              </Box>
            )}
            {!pageStateInventory.loader && (
              <SoftBox>
                <div
                  style={{
                    height: 480,
                    // height: 525,
                    //  width: '99%'
                  }}
                >
                  {debouncedSearchInventory?.length ? (
                    <DataGrid
                      rows={pageStateInventoryOnSearch?.datRows}
                      columns={columns}
                      rowCount={parseInt(pageStateInventoryOnSearch.total)}
                      loading={pageStateInventoryOnSearch?.loader}
                      pagination
                      page={pageStateInventoryOnSearch?.page - 1}
                      pageSize={pageStateInventory?.pageSize}
                      paginationMode="server"
                      onPageChange={(newPage) => {
                        setPageStateInventoryOnSearch((old) => ({ ...old, page: newPage + 1 }));
                      }}
                      onPageSizeChange={(newPageSize) =>
                        setPageStateInventoryOnSearch((old) => ({ ...old, pageSize: newPageSize }))
                      }
                      // getRowId={(row) => row?.gtin}
                      getRowId={(row) => row?.id}
                      onCellClick={(rows) => handleCellClickInventory(rows)}
                      // disableSelectionOnClick
                      disableColumnMenu //hides the filter in table header, which is coming default from mui
                      // hides the sort icon in table header
                      sx={{
                        '.MuiDataGrid-iconButtonContainer': {
                          display: 'none',
                        },
                        borderBottomLeftRadius: '10px',
                        borderBottomRightRadius: '10px',
                      }}
                    />
                  ) : (
                    <DataGrid
                      rows={pageStateInventory?.datRows}
                      columns={columns}
                      rowCount={parseInt(pageStateInventory.total)}
                      loading={pageStateInventory?.loader}
                      pagination
                      page={pageStateInventory?.page - 1}
                      pageSize={pageStateInventory?.pageSize}
                      paginationMode="server"
                      onPageChange={(newPage) => {
                        setPageStateInventory((old) => ({ ...old, page: newPage + 1 }));
                      }}
                      onPageSizeChange={(newPageSize) =>
                        setPageStateInventory((old) => ({ ...old, pageSize: newPageSize }))
                      }
                      // getRowId={(row) => row?.gtin}
                      getRowId={(row) => row?.id}
                      onCellClick={(rows) => handleCellClickInventory(rows)}
                      // disableSelectionOnClick
                      disableColumnMenu //hides the filter in table header, which is coming default from mui
                      // hides the sort icon in table header
                      sx={{
                        '.MuiDataGrid-iconButtonContainer': {
                          display: 'none',
                        },
                        borderBottomLeftRadius: '10px',
                        borderBottomRightRadius: '10px',
                      }}
                    />
                  )}
                </div>
              </SoftBox>
            )}

            {/* </Grid>  */}
          </SoftBox>
        ) : null}

        {/* data invertory 1 */}
        {tabs.tab2 && !isMobile ? (
          <SoftBox className={showDatePicker ? 'inventory-data-grid-table' : null}>
            {pageState.loader && (
              <Box
                sx={{
                  height: '37rem',
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Spinner />
              </Box>
            )}
            {!pageState.loader && (
              <div
                style={{
                  // height: 525,
                  height: 480,
                  // width: '99%',
                }}
              >
                {debouncedSearchAdjustInventory?.length ? (
                  <DataGrid
                    rows={pageStateOnSearch.datRows1}
                    columns={columns1}
                    rowCount={parseInt(pageStateOnSearch.total)}
                    loading={pageStateOnSearch.loader}
                    pagination
                    page={pageStateOnSearch.page - 1}
                    pageSize={pageStateOnSearch.pageSize}
                    paginationMode="server"
                    onPageChange={(newPage) => {
                      setPageStateOnSearch((old) => ({ ...old, page: newPage + 1 }));
                    }}
                    onPageSizeChange={(newPageSize) =>
                      setPageStateOnSearch((old) => ({ ...old, pageSize: newPageSize }))
                    }
                    getRowId={(row) => row?.inventory_adjustment_id}
                    disableSelectionOnClick
                    disableColumnMenu //hides the filter in table header, which is coming default from mui
                    // hides the sort icon in table header
                    sx={{
                      '.MuiDataGrid-iconButtonContainer': {
                        display: 'none',
                      },
                      borderBottomLeftRadius: '10px',
                      borderBottomRightRadius: '10px',
                    }}
                  />
                ) : (
                  <DataGrid
                    rows={pageState.datRows1}
                    columns={columns1}
                    rowCount={parseInt(pageState.total)}
                    loading={pageState.loader}
                    pagination
                    page={pageState.page - 1}
                    pageSize={pageState.pageSize}
                    paginationMode="server"
                    onPageChange={(newPage) => {
                      setPageState((old) => ({ ...old, page: newPage + 1 }));
                    }}
                    onPageSizeChange={(newPageSize) => setPageState((old) => ({ ...old, pageSize: newPageSize }))}
                    getRowId={(row) => row.inventory_adjustment_id}
                    disableSelectionOnClick
                    disableColumnMenu //hides the filter in table header, which is coming default from mui
                    // hides the sort icon in table header
                    sx={{
                      cursor: 'pointer',
                      '.MuiDataGrid-iconButtonContainer': {
                        display: 'none',
                      },
                      borderBottomLeftRadius: '10px',
                      borderBottomRightRadius: '10px',
                    }}
                  />
                )}
              </div>
            )}
          </SoftBox>
        ) : null}
      </SoftBox>
      {tabs.tab1 && isMobile ? (
        <>
          <SoftBox
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: '10px',
              marginTop: '10px',
              padding: '0px 16px !important',
            }}
          >
            {initialLoader && inventoryDataMobile?.length === 0 ? (
              <CircularProgress size={30} color="info" />
            ) : inventoryDataMobile?.length ? (
              inventoryDataMobile?.map((product, index) => (
                <InvMobCard
                  tab1={tabs.tab1}
                  setOpenModelInventoryAdjustment={setOpenModelInventoryAdjustment}
                  productData={product}
                  setInvProductInfo={setInvProductInfo}
                  setMobileDrawerInvAdjust={setMobileDrawerInvAdjust}
                  setMobileDrawerLocation={handleMobileLocation}
                  key={index}
                />
              ))
            ) : (
              <SoftBox className="no-data-found">
                <SoftTypography fontSize="14px">No Data Found</SoftTypography>
              </SoftBox>
            )}
            {!initialLoader && (
              <Box
                sx={{
                  visibility: infiniteLoader ? 'visible' : 'hidden',
                  display: noData ? 'none' : 'block',
                  padding: '5px',
                  height: '50px',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CircularProgress size={30} color="info" />
              </Box>
            )}
          </SoftBox>
        </>
      ) : null}
      {tabs.tab2 && isMobile ? (
        <>
          <SoftBox
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: '10px',
              marginTop: '10px',
              padding: '0px 16px !important',
            }}
          >
            {inventoryDataMobile?.map((product) => (
              <InvMobCard tab1={tabs.tab1} productData={product} />
            ))}
            <Box
              className="infinite-loader"
              sx={{
                visibility: infiniteLoader ? 'visible' : 'hidden',
                // display: noData ? 'none' : 'block',
              }}
            >
              <Spinner />
            </Box>
          </SoftBox>
        </>
      ) : null}
      {/* mobile inv prod adjust drawer */}
      <Drawer
        anchor="right"
        open={mobileDrawerInvAdjust}
        onClose={handleCloseMobileInvAdjustDrawer}
        className="mobile-inv-adju-drawer"
      >
        <SoftBox
          sx={{
            width: '100%',
            height: '50px',
          }}
        >
          <button onClick={handleCloseMobileInvAdjustDrawer} className="mobile-drawer-back-btn">
            <ArrowBackIosNewIcon />
          </button>
        </SoftBox>
        <div
          initial={{ y: 100, x: 0 }}
          animate={{ y: 0, x: 0 }}
          transition={{
            type: 'linear',
          }}
          style={{
            // position: 'absolute',
            // top: '50%',
            // left: '50%',
            // transform: 'translate(-50%, -50%)',
            padding: '20px',
            // width: '100%',
            // height: '100%',
            // height:"50rem",
            overflow: 'auto',
          }}
          className="batch-box-inventory-i"
          id="inventory-adjustment-modal-id"
        >
          <SoftBox
            container
            sx={{
              height: '100%',
              width: '100%',
              display: 'flex',
              alignItem: 'center',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <SoftBox sx={{ width: '100%', height: 'auto' }}>
              <SoftTypography
                component="label"
                variant="caption"
                fontWeight="bold"
                textTransform="capitalize"
                style={{ marginTop: '0.8rem' }}
              >
                {/* GTIN */}
                PRODUCT CODE
              </SoftTypography>
              <SoftBox className="form-flex-inward-box">
                {/* <SoftInput
                  type="text"
                  placeholder="Enter Barcode Eg : 8906065850940"
                  value={gtin}
                  readOnly={locationData !== null ? true : false}
                  onChange={(e) => setGtin(e.target.value)}
                /> */}
                {locationData == null ? (
                  <Autocomplete
                    options={prodOptions}
                    getOptionLabel={(option) => option.label}
                    onChange={(e, v) => handleAutoComplete(v)}
                    // isOptionEqualToValue={(option, value) => option.value === value.value}
                    className="product-code-autocomplete"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        // value={searchProduct}
                        onChange={(e) => handleChange(e)}
                        placeholder="Enter Barcode Eg : 8906065850940"
                        variant="outlined"
                        fullWidth
                      />
                    )}
                  />
                ) : (
                  <SoftInput
                    type="text"
                    placeholder="Enter Barcode Eg : 8906065850940"
                    value={gtin}
                    readOnly={true}
                    // onChange={(e) => setGtin(e.target.value)}
                  />
                )}

                {locationData == null && verifyLoader ? (
                  <Spinner />
                ) : !verifyLoader && locationData == null ? (
                  <>
                    <SoftBox id="verify-desktop" className="wrapper-btn-box-inward-I">
                      <Button
                        variant={buttonStyles.primaryVariant}
                        className="vefir-bnt contained-softbutton"
                        onClick={handleVerifyGtin}
                      >
                        Verify
                      </Button>
                    </SoftBox>
                    <SoftBox id="verify-mobile">
                      <SoftButton
                        color="info"
                        variant={buttonStyles.primaryVariant}
                        className="vendor-add-btn inv-scan contained-softbutton"
                        onClick={handleStartScanning}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '10px',
                        }}
                      >
                        <QrCodeScannerIcon
                          // fontSize="large"
                          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                        />
                        Scan
                      </SoftButton>
                    </SoftBox>
                  </>
                ) : null}
              </SoftBox>

              {/* <SoftTypography component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                {barcodeData}
              </SoftTypography> */}

              <SoftTypography component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                Batch Ids
              </SoftTypography>
              <SoftSelect placeholder="Eg: BT001" options={batchIds} onChange={(option) => handleBatchIds(option)} />

              {showAvailableQuantities ? (
                <>
                  <SoftTypography component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                    Available Quantities
                  </SoftTypography>
                  <SoftInput type="text" value={availableQuantities} readOnly={true} />
                </>
              ) : null}
              <SoftTypography component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                Adjustment Type
              </SoftTypography>
              <SoftSelect
                type="text"
                placeholder="Select Type..."
                options={[
                  // { label: 'Add', value: 'ADD' },
                  { label: 'Reduce', value: 'SUBTRACT' },
                ]}
                onChange={(option) => setAdjustmentType(option.value)}
              />
              <SoftTypography component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                Adjustment Quantity
              </SoftTypography>
              <SoftInput type="text" placeholder="Eg: 20" value={quantity} onChange={handleQuantity} />

              <SoftBox mt={2} mb={1} lineHeight={0} display="inline-block">
                <SoftTypography component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                  Reason
                </SoftTypography>
              </SoftBox>
              <SoftBox item xs={12} sm={12}>
                <SoftSelect
                  placeholder="Reason"
                  options={[
                    // { value: 'STOCK ADDITION', label: 'Stock Addition' },
                    { value: 'STOCK REDUCTION', label: 'Stock Reduction' },
                    { value: 'WASTAGE', label: 'Wastage' },
                    { value: 'SHRINKAGE', label: 'Shrinkage' },
                    { value: 'THEFT', label: 'Theft' },
                    { value: 'STORE USE', label: 'Store use' },
                    { value: 'DAMAGED', label: 'Damaged' },
                    { value: 'EXPIRED', label: 'Expired' },
                    { value: 'RETURNS NOT SALEABLE', label: 'Returns not saleable' },
                    // { value: 'ITEM BROKEN', label: 'Item broken' },
                    // { value: 'USED PRODUCTS', label: 'Used products' },
                    // { value: 'ITEM MISSING', label: 'Item missing' },
                    // { value: 'ITEM USED', label: 'Item used' },
                    // { value: 'PRODUCT SIZE IS LARGE', label: 'Product size is large' },
                    // { value: 'PRODUCT SIZE IS SMALL', label: 'Product size is small' },
                    // { value: 'INWARD', label: 'Inward' },
                    { value: 'OTHERS', label: 'Others' },
                  ]}
                  onChange={(option) => handleReasonModel(option)}
                  // menuPortalTarget={document.body}
                />
              </SoftBox>

              {showAvailableQuantities && (
                <>
                  <SoftTypography component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                    Stocks In Hand
                  </SoftTypography>
                  <SoftInput
                    disabled
                    type="text"
                    value={availableQuantities ? availableQuantities - quantity : ''}
                    onChange={handleQuantity}
                  />
                </>
              )}

              {/* <SoftBox mt={2} mb={1} ml={2} lineHeight={0} display="inline-block">
                  <SoftTypography component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                    Account
                  </SoftTypography>
                </SoftBox>
                <SoftBox item xs={12} sm={12}>
                  <SoftSelect
                    defaultValue={{ value: 'Acc', label: 'Rent expense' }}
                    options={[
                      { value: 'acc1', label: 'Repairs' },
                      { value: 'acc2', label: 'Travel expense' },
                      { value: 'acc3', label: 'Discount' },
                      { value: 'acc4', label: 'General Income' },
                      { value: 'acc5', label: 'Interest Income' },
                    ]}
                  />
                </SoftBox> */}
              <SoftBox item xs={12} sm={12} mt={5}>
                <SoftBox className="multiple-box multiple-box-new">
                  <label variant="body2" className="body-label body-label-new">
                    <img src={ImgUpload} alt="" className="img-upload-svg" />
                    {/* <br /> */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '5px' }}>
                      <FileUploadIcon className="upload-icon" />
                      Browse Image
                      <input
                        type="file"
                        name="images"
                        multiple
                        accept="image/png , image/jpeg, image/webp"
                        onChange={handleImageUpload}
                      />
                    </div>
                  </label>
                </SoftBox>

                <br />

                <input type="file" multiple />
                {previewImg !== null ? (
                  <Box
                    className="upload=image-preview"
                    style={{
                      height: '5rem',
                      width: '5rem',
                      position: 'relative',
                    }}
                  >
                    <SoftAvatar src={previewImg} alt="" variant="rounded" size="xl" shadow="sm" />
                  </Box>
                ) : null}
                {/* {selectedImages.length > 0 &&
                    (selectedImages.length > 10 ? (
                      <p className="error">
                        You can't upload more than 10 images! <br />
                        <span>
                          please delete <b> {selectedImages.length - 10} </b> of them{' '}
                        </span>
                      </p>
                    ) : (
                      ''
                    ))}

                  <div className="images-box">
                    {selectedImages &&
                      selectedImages.map((image, index) => {
                        return (
                          <div key={image} className="image">
                            <img src={image} height="200" alt="" className="uil" />
                            <button onClick={() => deleteHandler(image)} className="del-btn">
                              <DeleteOutlineIcon />
                            </button>
                          </div>
                        );
                      })}
                  </div>*/}
              </SoftBox>
            </SoftBox>
            <SoftBox sx={{ width: '100%', height: 'auto' }}>
              {/* <SoftBox> */}
              <SoftBox className="header-submit-box-i">
                {/* <SoftButton onClick={handleCloseModelInventoryAdjustment} className="vendor-second-btn">
                    cancel
                  </SoftButton> */}
                {modalSaveLoader ? (
                  <Spinner />
                ) : (
                  <SoftButton
                    // variant="gradient"
                    variant={buttonStyles.primaryVariant}
                    className="vendor-add-btn contained-softbutton"
                    onClick={handleSave}
                  >
                    Save
                  </SoftButton>
                )}
              </SoftBox>
              {/* </SoftBox> */}
            </SoftBox>
          </SoftBox>
        </div>
      </Drawer>
      <Drawer
        anchor="right"
        open={mobileDrawerLocation}
        // onClose={handleCloseMobileInvAdjustDrawer}
        className="mobile-inv-adju-drawer"
      >
        <SoftBox
          sx={{
            width: '100%',
            height: '50px',
          }}
        >
          <button onClick={handleCloseLocation} className="mobile-drawer-back-btn">
            <ArrowBackIosNewIcon />
          </button>
        </SoftBox>
        <Box
          sx={{
            width: '100%',
            height: '100%',
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'center',
            margin: 'auto',
            borderRadius: '1rem',
            overflow: 'auto',
            padding: '10px',
          }}
        >
          <SoftBox>
            <SoftBox display="flex" alignItem="center" px="1rem">
              <SoftTypography fontSize="16px" fontWeight={'bold'}>
                Brand:
              </SoftTypography>
              <SoftTypography fontSize="16px">
                {invtable?.length ? textFormatter(invtable[0]?.brand) : null}
              </SoftTypography>
            </SoftBox>

            <SoftBox display="flex" alignItem="center" gap="10px" px="1rem">
              <SoftTypography fontSize="16px" fontWeight={'bold'}>
                GTIN:
              </SoftTypography>
              <SoftTypography fontSize="16px">{invtable?.length ? invtable[0]?.gtin : null}</SoftTypography>
            </SoftBox>

            <SoftBox display="flex" alignItem="center" gap="10px" px="1rem">
              <SoftTypography fontSize="16px" fontWeight={'bold'}>
                Item-Name:
              </SoftTypography>
              <SoftTypography fontSize="16px">
                {invtable?.length ? textFormatter(invtable[0]?.itemName) : null}
              </SoftTypography>
            </SoftBox>
            <div
              style={{
                height: '20rem',
                width: '100%',
                marginTop: '1rem',
                paddingLeft: '0.8rem',
                paddingRight: '0.8rem',
              }}
            >
              {/* {loader && <Spinner />}
              {!loader && ( */}
              {isMobile && (
                <SoftTypography fontSize="16px" fontWeight={'bold'}>
                  Location Details:
                </SoftTypography>
              )}
              {!isMobile ? (
                <DataGrid
                  rows={gtinTableData}
                  columns={columnsGtin}
                  rowsPerPageOptions={[10]}
                  getRowId={(row) => row.batchNo}
                  pagination
                />
              ) : (
                <Box className="location-rows-main-div">
                  {gtinTableData?.map((data) => {
                    return (
                      <Stack className="location-stack-card po-box-shadow">
                        <Stack flexDirection={'row'} justifyContent={'space-between'} alignItems={'flex-start'}>
                          <Typography fontSize="14px" fontWeight={700}>
                            {data?.batchNo}
                          </Typography>
                          <Typography fontSize="14px" fontWeight={700}>
                            {data?.availableUnits}
                          </Typography>
                        </Stack>
                        <Divider sx={{ margin: '5px !important', width: '100%' }} />
                        <Stack flexDirection={'row'} justifyContent={'space-between'} alignItems={'flex-start'}>
                          <Stack alignItems={'flex-start'}>
                            <Typography fontSize="12px">Storage ID</Typography>
                            <Typography fontSize="14px" fontWeight={700}>
                              {data?.storageId}
                            </Typography>
                          </Stack>
                          <Stack alignItems={'flex-end'}>
                            <Typography fontSize="12px">Storage Name</Typography>
                            <Typography fontSize="14px" fontWeight={700}>
                              {data?.storageName}
                            </Typography>
                          </Stack>
                        </Stack>
                        <Divider sx={{ margin: '5px !important', width: '100%' }} />
                        <Stack flexDirection={'row'} justifyContent={'space-between'} alignItems={'flex-start'}>
                          <Stack alignItems={'flex-start'}>
                            <Typography fontSize="12px">UOM</Typography>
                            <Typography fontSize="14px" fontWeight={700}>
                              {data?.weightUOM}
                            </Typography>
                          </Stack>
                          <button
                            className="contained-softbutton"
                            style={{
                              padding: '5px 5px',
                              border: 'none',
                              fontWeight: 'bold',
                              borderRadius: '10px',
                              cursor: 'pointer',
                              fontSize: '12px',
                            }}
                            onClick={() => {
                              const storageBarcodeId = data?.storageId;
                              if (!storageBarcodeId.includes('---') && storageBarcodeId !== '') {
                                // setSelectedStorageBarcodeId(row.row.storageId);
                                // set the setShowLocationHierarchy to true
                                // setShowLocationHierarchy(!showLocationHierarchy);
                                getStorageLocationHierarchy(storageBarcodeId);
                              }
                            }}
                          >
                            location
                          </button>
                        </Stack>
                      </Stack>
                    );
                  })}
                </Box>
              )}
              {/* )} */}
            </div>
          </SoftBox>
        </Box>
      </Drawer>
    </DashboardLayout>
  );
};
