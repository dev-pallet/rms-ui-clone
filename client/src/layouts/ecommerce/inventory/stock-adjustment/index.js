import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import EditIcon from '@mui/icons-material/Edit';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import SouthIcon from '@mui/icons-material/South';
import { Button, Chip, CircularProgress, Divider, Drawer, Stack, Typography, useMediaQuery } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { DataGrid } from '@mui/x-data-grid';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import SoftAvatar from 'components/SoftAvatar';
import SoftBox from 'components/SoftBox';
import SoftButton from 'components/SoftButton';
import SoftInput from 'components/SoftInput';
import SoftSelect from 'components/SoftSelect';
import SoftTypography from 'components/SoftTypography';
import Spinner from 'components/Spinner/index';
import dayjs from 'dayjs';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import BarcodeScannerComponent from 'react-qr-barcode-scanner';
import { useLocation, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import ImgUpload from '../../../../assets/images/upload-image.png';
import {
  exportAnalysisPdf,
  // getInventoryListMobile,
  getInventoryBatchByGtin,
  getInventoryListInitial,
  getInventoryListMobile,
  getStorageDataListNextLevel,
  getStorageHierarchy,
  getSubStorageDataLists,
  getTopLevelStorageDataLists,
  getTotalQuantityOrderedForGtins,
  getinventorygtindata,
  postAdjustInventoryBatch,
  postinventoryadjusmenttabledata,
} from '../../../../config/Services';
import MobileNavbar from '../../../../examples/Navbars/MobileNavbar/mobile-navbar-drawer';
import { useSnackbar } from '../../../../hooks/SnackbarProvider';
import { buttonStyles } from '../../Common/buttonColor';
import {
  dateFormatter,
  decimalPointFormatter,
  isSmallScreen,
  productIdByBarcode,
  textFormatter,
} from '../../Common/CommonFunction';
import { ChipBoxHeading } from '../../Common/Filter Components/filterComponents';
import CommonSearchBar from '../../Common/MobileSearchBar';
import InvMobCard from './components/inventory-mobile-card/inv-mob-card';
import './inventory.css';

import { useDebounce } from 'usehooks-ts';
import BottomNavbar from '../../../../examples/Navbars/BottomNavbarMob';
import { StockAdjustmentLogs } from './components/adjustment-logs';
import MobileSearchBar from '../../Common/mobile-new-ui-components/mobile-searchbar';
import CustomMobileButton from '../../Common/mobile-new-ui-components/button';
import ViewMore from '../../Common/mobile-new-ui-components/view-more';
import { XCircleIcon } from '@heroicons/react/24/solid';

export const StockAdjustment = ({ showExport }) => {
  const isMobileDevice = isSmallScreen();
  const location = useLocation();
  const [tabName, setTabName] = useState(localStorage.getItem('stockAdjustmentMobileTab') || 'logs');
  const handleTabName = (tabName) => {
    setTabName(tabName);
    localStorage.setItem('stockAdjustmentMobileTab', tabName);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isMobileDevice === false && tabName === 'adjustment') {
        localStorage.removeItem('stockAdjustmentMobileTab');
        handleTabName('logs');
      }
    }, 2000);

    return () => clearTimeout(timer); // Cleanup the timeout if the component unmounts
  }, [isMobileDevice, tabName]);

  const [refreshInventoryAdjustmentPage, setRefreshInventoryAdjustmentPage] = useState(false);

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

  const [showViewMore, setShowViewMore] = useState(true);

  const openAction = Boolean(anchorElAction);
  //  loader
  const [loader, setLoader] = useState(false);

  const [tabs, setTabs] = useState({
    tab1: showExport ? false : true,
    tab2: false,
    tab3: showExport ? true : false,
  });

  const userRoles = JSON.parse(localStorage.getItem('user_roles'));
  // const superAdmin = userRoles?.find((item) => item == 'SUPER_ADMIN' || item == 'RETAIL_ADMIN');

  const permissions = JSON.parse(localStorage.getItem('permissions'));

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
  // inventory adjustment state
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
        if (!params?.row?.storageId?.includes('---') && params?.row?.storageId !== '') {
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
                const storageBarcodeId = params?.row?.storageId;
                if (!storageBarcodeId?.includes('---') && storageBarcodeId !== '') {
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
      (item) => item?.itemName?.toUpperCase() === locationData?.product?.toUpperCase(),
    );
    const gtin = findInventoryGtindata?.gtin;
    getinventorygtindata(gtin)
      .then((res) => {
        const result = res?.data?.data?.object;
        const tableDataGtin = result?.map((row) => ({
          storageId: row?.storageId || 'NA',
          storageName: row?.storageName || 'NA',
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
        storageId: row?.storageId || 'NA',
        storageName: row?.storageName || 'NA',
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

  const intitalDataFetchInventoryPayload = {
    pageNumber: pageStateInventory?.page,
    pageSize: pageStateInventory?.pageSize,
    locationId: locId,
    orgId: orgId,
  };
  const filterObjectOnSearch = {
    pageNumber: pageStateInventoryOnSearch?.page,
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
    outOfStock: status?.value,
    searchBox: debouncedSearchInventory?.trim(),
    // skuid: [],
  };

  let dataArr,
    dataRow = [];

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

        dataRowOnSearch.push(
          dataArrOnSearch?.map((row, index) => ({
            gtin: row?.gtin || 'NA',
            product: row?.itemName ? textFormatter(row?.itemName) : 'NA',
            brand: row?.brand ? textFormatter(row.brand) : 'NA',
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

        // showSnackbar('Success Inventory list', 'success');
        setLoader(false);

        const resp = await getTotalQuantityOrderedForGtins(payloadGtinInventory);

        dataForEachGtins = resp?.data?.data?.poItemQuantityOrderedList;

        const updateDataRows = [...dataRowOnSearch[0]].map((row, index) => ({
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

        const gtinInventoryData = inventoryData?.map((item) => item?.gtin);

        const payloadGtinInventory = {
          sourceLocationId: locId,
          gtinNoList: gtinInventoryData,
        };

        setTotalInventoryResult(tot);

        dataRow.push(
          dataArr?.map((row, index) => ({
            gtin: row?.gtin || 'NA',
            product: row?.itemName ? textFormatter(row?.itemName) : 'NA',
            brand: row?.brand ? textFormatter(row?.brand) : 'NA',
            vendor: row?.vendorId ? textFormatter(row?.vendorId) : 'NA',
            incoming: '---',
            openPo: '---',
            available: row?.totalAvailableUnits ? decimalPointFormatter(row?.totalAvailableUnits) : 'NA',
            activeBatches: row?.activeBatches || 'NA',
            status: row?.status || 'NA',
            id: uuidv4(),
          })),
        );

        setPageStateInventory((old) => ({
          ...old,
          loader: false,
          datRows: dataRow[0] || [],
          total: tot || 0,
        }));

        // showSnackbar('Success Inventory list', 'success');
        setLoader(false);

        const resp = await getTotalQuantityOrderedForGtins(payloadGtinInventory);

        dataForEachGtins = resp?.data?.data?.poItemQuantityOrderedList;

        const updatedDataRows = [...dataRow[0]].map((row, index) => ({
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

        setPageStateInventory((old) => ({
          ...old,
          loader: false,
          datRows: updatedDataRows || [],
          total: tot || 0,
        }));
      } catch (err) {
        showSnackbar('Something went wrong', 'error');
        setLoader(false);
      }
    }
  };

  const filterObjectInventoryV2 = {
    pageNumber: pageStateInventory?.page,
    pageSize: pageStateInventory?.pageSize,
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
          setLoader(false);
        })
        .catch((err) => {
          showSnackbar('Something went wrong', 'error');
          setPageStateInventory((prev) => ({ ...prev, loader: false }));
          setLoader(false);
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
  };

  const filterObject1 = {
    pageNumber: debouncedSearchAdjustInventory?.length ? 1 : pageState?.page,
    pageSize: 10,
    productId: [],
    locationId: [locId],
    itemName: [],
    reason: reason?.value?.length ? [reason?.value?.toLowerCase()] : [],
    gtin: [],
    orgId: [orgId],
    searchBox: debouncedSearchAdjustInventory?.trim(),
    created_By: '',
    startDate: startDate,
    endDate: endDate,
    skuid: [],
  };

  const filterObject1OnSearch = {
    pageNumber: pageStateOnSearch?.page,
    pageSize: 10,
    productId: [],
    locationId: [locId],
    itemName: [],
    reason: reason?.value?.length ? [reason?.value?.toLowerCase()] : [],
    gtin: [],
    orgId: [orgId],
    searchBox: debouncedSearchAdjustInventory?.trim(),
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
        // showSnackbar('Success Inventory Adjustment list', 'success');
        setPageState((old) => ({ ...old, loader: false }));
        dataArrAdjustOnSearch = res?.data?.data;
        dataRowAdjustOnSearch.push(
          dataArrAdjustOnSearch?.inventoryAdjustmentLogsList?.map((row) => ({
            image: row?.imgURL == 'No image' || row?.imgURL == '-' ? 'https://i.imgur.com/dL4ScuP.png' : row?.imgURL,
            date: row?.createdOn ? dateFormatter(row?.createdOn) : 'NA',
            gtin: row?.gtin || 'NA',
            itemName: row?.itemName || 'NA',
            batchid: row?.batchNo || 'NA',
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
          if (!res?.data?.data?.inventoryAdjustmentLogsList?.length) {
            showSnackbar('No Data Found', 'error');
            setPageState((old) => ({ ...old, loader: false, datRows1: [], total: 0 }));
            return;
          }
          // showSnackbar('Success Inventory Adjustment list', 'success');

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
            total: dataArr1.totalResults || 0,
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
          showSnackbar('No Data Found', 'error');
          setPageState((old) => ({ ...old, loader: false }));
        });
    }
    setIsFilterApplied(false);
  }, [pageState.page, pageState.pageSize, tabs.tab1, tabs.tab2, saved]);

  const [openModelInventoryAdjustment, setOpenModelInventoryAdjustment] = useState(false);

  const handleOpenInventoryAdjustment = () => {
    setOpenModelInventoryAdjustment(true);
    //
    if (locationData !== null) {
      setGtin(locationData.gtin);
      setAnchorElAction(null);
      getInventoryBatchByGtin(locationData.gtin, locId)
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
        setRefreshInventoryAdjustmentPage(true);
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
        pageNumber: debouncedSearchInventory?.length ? 0 : pageStateInventory?.page,
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
        outOfStock: status?.value,
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
            label: `${item?.gtin}  (${item?.itemName})`,
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
      setBarcodeData(result?.text);
      setGtin(result?.text);
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
    const productId = rows.row.gtin;

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
  const debouncedSearchValue = useDebounce(searchedValue, 300); // Adjust the delay as needed
  const [initialLoader, setInitialLoader] = useState(false);

  useEffect(() => {
    if (isMobileDevice && tabName === 'adjustment') {
      const payload = {
        pageNumber: 1,
        pageSize: 10,
        locationId: locId,
        orgId: orgId,
        searchBox: searchedValue,
      };
      let dataArr = [];
      setInitialLoader(true);
      getInventoryListMobile(payload)
        .then(async (res) => {
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

          const showViewMoreButton =
          (payload.pageNumber + 1) * payload?.pageSize < res?.data?.data?.data?.totalResult;
          setShowViewMore(showViewMoreButton);

          let newInventoryData = [];
          try {
            newInventoryData = dataArr?.map((row, index) => {
              const matchingData = dataForEachGtins?.find((item) => item?.gtinNo === row?.gtin);
              return {
                gtin: row?.gtin || 'NA',
                product: row?.itemName ? textFormatter(row?.itemName) : 'NA',
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
                status: row?.totalAvailableUnits === 0 ? 'OUT_OF_STOCK' : 'AVAILABLE',
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
        })
        .catch((error) => {
          showSnackbar('Something went wrong', 'error');
        })
        .finally(() => {
          setInitialLoader(false);
        });
    }
  }, [debouncedSearchValue, tabName, location, isMobileDevice]);

  //infinte laoding fetching data function ===============
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
      const gtinList = res?.data?.data?.data?.data?.map((item) => item?.gtin);
      const payloadGtinInventory = {
        sourceLocationId: locId,
        gtinNoList: gtinList,
      };
      const restProductDetails = await getTotalQuantityOrderedForGtins(payloadGtinInventory);

      dataArr = res?.data?.data?.data?.data;
      const dataForEachGtins = restProductDetails?.data?.data?.poItemQuantityOrderedList;

      const showViewMoreButton =
      (payload.pageNumber + 1) * payload?.pageSize < res?.data?.data?.data?.totalResult;
      setShowViewMore(showViewMoreButton);
      
      let newInventoryData = [];
      try {
        newInventoryData = dataArr?.map((row, index) => {
          const matchingData = dataForEachGtins?.find((item) => item?.gtinNo === row?.gtin);
          return {
            gtin: row?.gtin || 'NA',
            product: row?.itemName ? textFormatter(row.itemName) : 'NA',
            incoming: matchingData?.['purchaseOrderList']?.length
              ? [matchingData?.totalQuantityOrdered, matchingData?.['purchaseOrderList'][0]['poNumber']]
              : // : [matchingData?.totalQuantityOrdered, null],
                ['NA'],
            openPo: matchingData?.['purchaseOrderList']?.length
              ? [matchingData?.totalNoOfPo, matchingData?.['purchaseOrderList'][0]['poNumber']]
              : // : [dataForEachGtins[index]?.totalNoOfPo, null],
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
      {reason.value !== '' && (
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
            showSnackbar('No Data Found', 'error');
            setPageState((old) => ({ ...old, loader: false, datRows1: [], total: 0 }));
            return;
          }
          // showSnackbar('Success Inventory Adjustment list', 'success');

          dataArr1 = res?.data?.data;
          dataRow1.push(
            dataArr1?.inventoryAdjustmentLogsList?.map((row) => ({
              image: row?.imgURL == 'No image' || row?.imgURL == '-' ? 'https://i.imgur.com/dL4ScuP.png' : row?.imgURL,
              date: row?.createdOn || 'NA',
              gtin: row?.gtin || 'NA',
              itemName: row?.itemName ? textFormatter(row?.itemName) : 'NA',
              batchid: row?.batchNo || 'NA',
              quantity: row?.actualQuantityUnits || 'NA',
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
              storageHierarchy?.map((storage, index) => (
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
                      <KeyboardArrowRightIcon sx={{ fontSize: '20px' }} />
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
              value: item?.storageId,
              label: item?.storageName,
              barcodeId: item?.barcodeId,
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
      if (pageStateInventory?.page === 1) {
        inventoryTableDataV2();
      } else {
        setPageStateInventory((old) => ({ ...old, page: 1, loader: true }));
      }
    }
  };

  const removeSelectedInventoryFilter = (filterType) => {
    if (filterType?.value) {
      // if storageId matches to the first element of storageNameState then run if condition
      if (filterType?.value === storageHierarchy[0]?.value) {
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
        const updatedStorageHierarchy = storageHierarchy?.filter((storage) => storage?.value !== filterType?.value);
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

  // clear search input fn
  const handleClearSearchInput = () => {
    setSearchedValue('');
  };

  return (
    <>
      <DashboardLayout>
        {/* {!isMobile && <DashboardNavbar />} */}

        {/* <Snackbar open={opensnack} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={timelinerror} sx={{ width: '100%' }}>
          {alertmessage}
        </Alert>
      </Snackbar> */}

        {tabName === 'logs' && (
          <StockAdjustmentLogs
            refreshInventoryAdjustmentPage={refreshInventoryAdjustmentPage}
            setRefreshInventoryAdjustmentPage={setRefreshInventoryAdjustmentPage}
            tabName={tabName}
            handleTabName={handleTabName}
            editInventoryAdjustment={
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
            }
          />
        )}

        {tabName === 'adjustment' && (
          <SoftBox
            // className="softbox-box-shadow range"
            className={`${!isMobile ? 'search-bar-filter-and-table-container' : null}`}
          >
            <Box
              className={!isMobile && 'search-bar-filter-container'}
              sx={{
                padding: !isMobile && '15px 15px 0 15px !important',
                // bgcolor: !isMobile && 'var(--search-bar-filter-container-bg)',
                borderTopLeftRadius: '10px',
                borderTopRightRadius: '10px',
              }}
            >
              <Box
              // className="tab-contents-export-adjust"
              // sx={{
              //   display: 'flex',
              //   flexWrap: 'wrap',
              //   alignItems: 'center',
              //   gap: '10px',
              // }}
              >
                {/* {!isMobile && (
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
                </Box>
                {showExport && (
                  <SoftButton onClick={handleAnalysisExport}>
                    <CloudDownloadOutlinedIcon sx={{ marginRight: '10px' }} />
                    Export
                  </SoftButton>
                )}
              </>
            )} */}
                {isMobile && (
                  <SoftBox>
                    <SoftBox sx={{ position: 'relative', margin: '10px 0px' }}>
                      {/* <CommonSearchBar
                        searchFunction={(e) => setSearchedValue(e.target.value)}
                        // handleNewBtnFunction={handleNew}
                        placeholder="Search Products..."
                        handleNewRequired={false}
                        searchValue={searchedValue}
                        handleClearSearchInput={handleClearSearchInput}
                      /> */}
                      <MobileSearchBar
                        value={searchedValue}
                        placeholder={'Search...'}
                        isScannerSearchbar={false}
                        onChangeFunction={(e) => setSearchedValue(e.target.value)}
                      />
                    </SoftBox>
                  </SoftBox>
                )}
              </Box>
              {/* search box  */}
              {!isMobile && (
                <>
                  <Box sx={{ padding: tabs.tab3 ? '15px 0px 0px' : '15px' }}>
                    <Grid container spacing={2} justifyContent={'space-between'} alignItems={'center'}>
                      {/* inventory tab 1 filter  */}
                      {tabs.tab1 ? (
                        <>
                          {/* {exportLoader ? (
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
                      )} */}
                        </>
                      ) : (
                        <SoftBox></SoftBox>
                      )}

                      {/* edit inventory adjustment icon and filter  */}
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
                        {/* {tabs.tab2 && (
                      <Filter
                        filtersApplied={filtersApplied}
                        filterChipBoxes={filterChipBoxesInvAdjust}
                        selectBoxArray={selectBoxArrayInvAdjust}
                        handleApplyFilter={applyInventoryAdjustmentFilter}
                        handleClearFilter={handleClear}
                      />
                    )} */}
                        {/* end of filter box  */}
                      </Grid>
                    </Grid>
                  </Box>
                </>
              )}
            </Box>

            {/* show location modal upon clicking on location inside inventory tab1 row menu  */}
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
                        {invtable?.length ? textFormatter(invtable[0]?.itemName) : null}
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
                  <div
                    style={{
                      height: '20rem',
                      width: '100%',
                    }}
                  >
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
                        getRowId={(row) => row?.batchNo}
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
                  </div>
                </SoftBox>
              </Box>
            </Modal>

            {/* form end  */}
            {/* </SoftBox> */}
            {/* datagrid inventory 1 */}

            {/* datagrid inventory 2 */}
          </SoftBox>
        )}

        {/* mobile screen scanner  */}
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

        {/* inventory adjustment modal */}
        <Modal
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
              padding: '20px',
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
                      getOptionLabel={(option) => option?.label}
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
                          <QrCodeScannerIcon sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} />
                          Scan
                        </SoftButton>
                      </SoftBox>
                    </>
                  ) : null}
                </SoftBox>

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
                  onChange={(option) => setAdjustmentType(option?.value)}
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

        {tabName === 'adjustment' && isMobile ? (
          <SoftBox className="ros-app-purchase-component-main-div">
            <div className="listing-order-name-main">
              <CustomMobileButton
                variant={tabName === 'logs' ? 'black-D' : 'black-S'}
                title={'Logs'}
                onClickFunction={() => handleTabName('logs')}
                flex={1}
                justifyContent={'center'}
              >
                Logs
              </CustomMobileButton>
              <CustomMobileButton
                variant={tabName === 'adjustment' ? 'black-D' : 'black-S'}
                title={'Adjustment'}
                onClickFunction={() => handleTabName('adjustment')}
                flex={1}
                justifyContent={'center'}
              >
                Adjustment
              </CustomMobileButton>
            </div>
            <SoftBox className="pi-listing-card-main-div">
              {initialLoader ? (
                <div className="content-center">
                  <CircularProgress size={30} color="info" />
                </div>
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
                <SoftBox className="no-data-found" height="100px !important">
                  <SoftTypography fontSize="14px">No Data Found</SoftTypography>
                </SoftBox>
              )}

              {showViewMore && (
                <ViewMore
                  loading={infiniteLoader}
                  handleNextFunction={() => {
                    setInfinitePageNumber(infnitePageNumber + 1);
                    fetchMoreData();
                  }}
                />
              )}
            </SoftBox>
          </SoftBox>
        ) : null}
        {/* {tabs.tab2 && isMobile ? (
        <>
          <SoftBox
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: '10px',
              marginTop: '10px',
            }}
          >
            {inventoryDataMobile.map((product) => (
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
      ) : null} */}

        {/* mobile inv prod adjust drawer */}
        <Drawer
          anchor="right"
          open={mobileDrawerInvAdjust}
          onClose={handleCloseMobileInvAdjustDrawer}
          className="mobile-inv-adju-drawer"
        >
          <SoftBox className="content-right">
            <button onClick={handleCloseMobileInvAdjustDrawer} className="mobile-drawer-back-btn">
              <XCircleIcon />
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

                <SoftBox item xs={12} sm={12} mt={5}>
                  <SoftBox className="multiple-box multiple-box-new">
                    <label variant="body2" className="body-label body-label-new">
                      <img src={ImgUpload} alt="" className="img-upload-svg" />
                      {/* <br /> */}
                      <div
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '5px' }}
                      >
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
          <SoftBox className="content-right">
            <button onClick={handleCloseLocation} className="mobile-drawer-back-btn">
              <XCircleIcon />
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
                    getRowId={(row) => row?.batchNo}
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
                                if (!storageBarcodeId?.includes('---') && storageBarcodeId !== '') {
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
    </>
  );
};
