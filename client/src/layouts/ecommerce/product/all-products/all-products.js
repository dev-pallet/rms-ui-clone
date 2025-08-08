import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import SoftBox from 'components/SoftBox';
import SoftButton from 'components/SoftButton';
import SoftInput from 'components/SoftInput';
import Spinner from 'components/Spinner/index';
// import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import './all-products.css';
import {
  Badge,
  Box,
  CircularProgress,
  Container,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Popover,
  Switch,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import {
  ClearSoftInput,
  CopyToClipBoard,
  CopyToClipBoardValue,
  isSmallScreen,
  textFormatter,
  updatingPageNumber,
} from '../../Common/CommonFunction';
import { getAllProductsV2, getAllProductsV2New } from '../../../../config/Services';
import { setAllProductsFilter, setPageNumber, useSoftUIController } from '../../../../context';
import AddIcon from '@mui/icons-material/Add';
import ExcelDownloadButton from './components/weighing-scale/downloadWeighing';
import Stack from '@mui/material/Stack';
import MobileNavbar from '../../../../examples/Navbars/MobileNavbar/mobile-navbar-drawer';
import { emit, useNativeMessage } from 'react-native-react-bridge/lib/web';
import AllProductCard from './components/all-product-card/all-product-card';
import NoDataFound from '../../Common/No-Data-Found';
import { AllProductsPageFilter } from './components/filters/AllProductsFilter';
import {
  getAllProductsFilters,
  getAllProductsFiltersCount,
  getAllProductsPage,
  getAllProductsSearchValue,
  setAllProductsFilters,
  setAllProductsFiltersAppliedCount,
  setAllProductsFilterStateData,
  setAllProductsPage,
  setAllProductsSearchValue,
} from '../../../../datamanagement/Filters/allProductsSlice';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import BottomNavbar from '../../../../examples/Navbars/BottomNavbarMob';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import NoDataFoundMob from '../../Common/mobile-new-ui-components/no-data-found';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import ProductDataCard from './productDataCard';
import { useDebounce } from 'usehooks-ts';
import Status from '../../Common/Status';
import ViewMore from '../../Common/mobile-new-ui-components/view-more';
import ComingSoon from '../../Common/ComingSoon';

export const AllProducts = ({
  handleOpenAddProduct,
  isBundle = false,
  searchName,
  filters,
  isFilterApplied,
  setTotalProducts,
  setIsFilterApplied,
  setIsFilterOpened,
  setSearchName,
  mToggleItemCode,
}) => {
  const isMobileDevice = isSmallScreen();

  const contextType = localStorage.getItem('contextType');
  //getting previous filters
  const [controller, dispatch] = useSoftUIController();
  const { allProductsFilter } = controller;
  const { pageNumber } = controller;
  const { miniSidenav } = controller;

  // persist values from redux
  const dispatch2 = useDispatch();
  const persistedPage = useSelector(getAllProductsPage);
  const persistedFilters = useSelector(getAllProductsFilters);
  const persistedFiltersAppliedCount = useSelector(getAllProductsFiltersCount);
  const persistedSearchValue = useSelector(getAllProductsSearchValue);

  const [searchProductName, setSearchProductName] = useState([]);
  const [scannedProductGtin, setScannedProductGtin] = useState(allProductsFilter?.scannedProductGtin || '');
  const [barcodeNumber, setBarcodeNumber] = useState([]);
  const [clearFilter, setClearFilter] = useState(false);
  const location = useLocation();
  const isScannedFromBottomNavbar = location?.state?.scanned;
  const gtinFromBottomNavbar = location?.state?.gtin;
  const overrideNavigateNull = location?.state?.overrideNavigateNull;
  const [searchResultLength, setSearchResultLength] = useState();
  const [scanner, setScanner] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [isFilterCleared, setIsFilterCleared] = useState(false);
  const [isSearchValue, setIsSearchValue] = useState(false);
  const [webSearchName, setWebSearchName] = useState(allProductsFilter?.webSearchName || '');
  const [isMounted, setIsMounted] = useState(false); // State to track if component has mounted
  const [showViewMore, setShowViewMore] = useState(true);
  const [toggleItemCode, setToggleItemCode] = useState(false);
  const retailType = localStorage.getItem('retailType');

  const debouncedProdSearch = useDebounce(searchName, 300);
  useEffect(() => {
    if (debouncedProdSearch !== null && isMounted) {
      handleSearchFliter(debouncedProdSearch);
      setInfintiePageNo(2);
    }
  }, [debouncedProdSearch]);

  useEffect(() => {
    if (isFilterApplied && isMobileDevice) {
      let payload = {
        appCategories: {
          categoryLevel1: filters?.category1 ? [filters?.category1[0]?.label] : [],
          categoryLevel2: filters?.category2 ? [filters?.category2[0]?.label] : [],
          categoryLevel3: filters?.category3 ? [filters?.category3[0]?.label] : [],
        },
        productStatus: filters?.status ? [filters?.status[0]?.value] : [],
        preferredVendors: filters?.vendor ? [filters?.vendor[0]?.value] : [],
        manufacturers: filters?.manufacturer ? [filters?.manufacturer[0]?.value] : [],
        sortByPrice: filters?.price ? filters?.price[0]?.value : 'DEFAULT',
      };
      if (filters?.scale && filters?.scale[0]?.value === 'weighingScale') {
        payload.needsWeighingScaleIntegration = [true];
      }

      // dispatch(
      //   setAllProductsFilters({
      //     // ...persistedFilters,
      //     // selectedMainCategory: selectedMainCategory,
      //     // selectedCategoryLevel1: selectedCategoryLevel1,
      //     // selectedCategoryLevel2: selectedCategoryLevel2,
      //     sortByPrice: filters?.price[0] || 'DEFAULT',
      //     // productStatus: filters?.status[0] || [],
      //     // scale: filters?.scale[0] || [],
      //     // selectedVendor: filters?.vendor[0] || '',
      //     // selectedManufacturer: filters?.manufacturer[0] || '',
      //   }),
      // );
      // dispatch(setAllProductsFiltersAppliedCount(Object.keys(filters)?.length));
      // dispatch(setAllProductsFilterStateData(filters));

      applyFilter(payload);
    }
  }, [isFilterApplied, infinitePageNo]);
  const theme = useTheme();
  const noDataImage =
    'https://stores.blackberrys.com/VendorpageTheme/Enterprise/EThemeForBlackberrys/images/product-not-found.jpg';

  const userRoles = JSON.parse(localStorage.getItem('user_roles'));
  const permissions = JSON.parse(localStorage.getItem('permissions'));
  const [commonFilterData, setCommonFilterData] = useState({
    productName: [],
    barcodeNumber: [],
    gtin: '',
  });

  useEffect(() => {
    let isMounted = true;
    // Ensure the component is still mounted before performing state updates
    if (isMounted) {
      const updatedPageNumbers = updatingPageNumber(
        'products',
        'allProducts',
        pageNumber?.products?.allProducts,
        pageNumber,
      );
      if (pageNumber?.products?.allProducts) {
        setPageNumber(dispatch, updatedPageNumbers);
      }
    }

    // Cleanup function: set isMounted to false when the component unmounts
    return () => {
      isMounted = false;
    };
  }, []);

  const scale = persistedFilters?.scale?.value ? persistedFilters.scale.value : '';

  useEffect(() => {
    allProductsFilter?.barcodeNumber?.length || allProductsFilter?.productName?.length
      ? setWebSearchName(allProductsFilter?.barcodeNumber?.[0] || allProductsFilter?.productName?.[0])
      : setWebSearchName('');

    allProductsFilter?.barcodeNumber?.length
      ? setBarcodeNumber(allProductsFilter?.barcodeNumber)
      : setBarcodeNumber([]);
    allProductsFilter?.productName?.length
      ? setSearchProductName(allProductsFilter?.productName)
      : setSearchProductName([]);
  }, [allProductsFilter]);

  const navigate = useNavigate();
  const handleProduct = () => {
    if (contextType === 'VMS') {
      navigate('/products/all-products/add-seller-products');
    } else {
      navigate('/products/all-products/add-products');
    }
  };

  const handleBundle = (type) => {
    navigate(`/products/all-bundle-products/add-products/${type}`);
  };

  const handleRestaurantCreateProduct = () => {
    navigate('/products/all-products/restaurant/add-products');
  };

  const [pageState, setPageState] = useState({
    loader: false,
    datRows: [],
    page: persistedPage,
    pageSize: 10,
  });
  let orgId = localStorage.getItem('orgId');
  let locId = localStorage.getItem('locId');
  let lowerCaseLocId = locId.toLocaleLowerCase();
  let sourceType = localStorage.getItem('contextType');

  const initialFilterValues = {
    searchProductName: [],
    barcodeNumber: [],
    mainCatSelected: [],
    priceVal: 'DEFAULT',
    priceLabel: '',
    scale: '',
    scaleLabel: '',
    productStatus: [],
    productStatusLabel: '',
  };

  const [inputValue, setInputValue] = useState(persistedSearchValue);
  const debouncedSearchValue = useDebounce(inputValue, 300); // Adjust the delay as needed

  const handleSearchFliter = (value) => {
    // if any filter is applied, remove the applied filters then search
    if (persistedFiltersAppliedCount !== 0) {
      dispatch2(setAllProductsPage(1));
      setIsSearchValue(true);
    }
    setScanned(false);
    const input = value;
    const productSearchPayload = {
      page: 1,
      pageSize: pageState?.pageSize,
      names: [],
      brands: [],
      // barcode: barcodeNumber,
      barcode: [],
      manufacturers: [],
      query: '',
      appCategories: {
        categoryLevel1: persistedFilters?.selectedMainCategory?.label
          ? [persistedFilters?.selectedMainCategory?.label]
          : [],
        categoryLevel2: persistedFilters?.selectedCategoryLevel1?.label
          ? [persistedFilters?.selectedCategoryLevel1?.label]
          : [],
        categoryLevel3: persistedFilters?.selectedCategoryLevel2.label
          ? [persistedFilters?.selectedCategoryLevel2?.label]
          : [],
      },
      productStatus: persistedFilters?.productStatus?.value ? [persistedFilters?.productStatus?.value] : [],
      preferredVendors: persistedFilters?.selectedVendor.value ? [persistedFilters?.selectedVendor.value] : [],
      mergedProductShow: false,
      sortByPrice: 'DEFAULT',
      // sortByCreatedAt: 'DESC',
      storeLocations: [locId],
      pageSize: '10',
      showBundles: isBundle,
      showOnlyDeActivated: persistedFilters?.productStatus?.value === 'IN_ACTIVE' ? true : undefined,
    };
    if (filters?.scale && filters?.scale[0]?.value === 'weighingScale') {
      productSearchPayload.needsWeighingScaleIntegration = [true];
    }
    if (contextType === 'RETAIL') {
      productSearchPayload.storeLocations = [locId];
    } else if (contextType === 'WMS') {
      productSearchPayload.supportedWarehouse = [locId];
    } else if (contextType === 'VMS') {
      productSearchPayload.marketPlaceSeller = [locId];
    }
    if (scale === 'weighingScale') {
      productSearchPayload.needsWeighingScaleIntegration = [true];
    }
    if (input !== '') {
      if (toggleItemCode || mToggleItemCode) {
        setBarcodeNumber([]);
        setSearchProductName([]);
        const payload = {
          ...productSearchPayload,
          storeItemReferences: [input],
        };
        fetchingAllProducts(payload);
        return;
      }
      const isNumber = !isNaN(+input);
      // if (isNumber) {
      //   setBarcodeNumber([input]);
      //   setWebSearchName(input);
      //   setSearchProductName([]);
      //   setPageState({ loader: false, datRows: [], total: 0, page: 1, pageSize: 10 });
      //   const payload = {
      //     ...productSearchPayload,
      //     barcode: [value],
      //   };
      //   fetchingAllProducts(payload);
      // } else {
      //   setBarcodeNumber([]);
      //   setWebSearchName(input);
      //   setSearchProductName([input]);
      //   setPageState({ loader: false, datRows: [], total: 0, page: 1, pageSize: 10 });
      //   const payload = {
      //     ...productSearchPayload,
      //     // names: [value],
      //     query: input || '',
      //   };
      //   fetchingAllProducts(payload);
      // }
      setBarcodeNumber(isNumber ? [input] : []);
      setWebSearchName(input);
      setSearchProductName(isNumber ? [] : [input]);
      setPageState({
        loader: false,
        datRows: [],
        total: 0,
        page: 1,
        pageSize: 10,
      });

      // Build API payload
      const payload = {
        ...productSearchPayload,
        query: input || '',
      };

      // Call API
      fetchingAllProducts(payload);
    } else {
      setBarcodeNumber([]);
      setSearchProductName([]);
      const payload = {
        ...productSearchPayload,
        barcode: [],
        query: '',
        sortByCreatedAt: 'DESC',
      };
      fetchingAllProducts(payload);
      setAllProductsFilter(dispatch, {});
      setPageState({ loader: false, datRows: [], total: 0, page: 1, pageSize: 10 });
    }
  };

  // clear products search input fn
  const handleClearProductSearch = (apply_filter) => {
    dispatch2(setAllProductsPage(1));
    setBarcodeNumber([]);
    setWebSearchName('');
    setSearchProductName([]);
    setInputValue('');

    if (apply_filter === true) {
      return;
    }

    handleSearchFliter('');
  };

  const handleClearFilter = () => {
    // if search value exist remove it then apply filter
    if (searchProductName?.length !== 0 || barcodeNumber?.length !== 0) {
      const clear_filter = true;
      handleClearProductSearch(clear_filter);
    }
    dispatch2(setAllProductsPage(1));

    setPageState({ loader: false, datRows: [], total: 0, page: 1, pageSize: 10 });

    const payload = {
      page: 1,
      names: [],
      query: '',
      brands: [],
      barcode: [],
      manufacturers: [],
      appCategories: {
        categoryLevel1: [],
        categoryLevel2: [],
        categoryLevel3: [],
      },
      productStatus: [],
      preferredVendors: [],
      mergedProductShow: false,
      sortByPrice: 'DEFAULT',
      sortByCreatedAt: 'DESC',
      storeLocations: [locId],
      pageSize: 10,
      showBundles: isBundle,
    };
    if (contextType === 'RETAIL') {
      payload.storeLocations = [locId];
    } else if (contextType === 'WMS') {
      payload.supportedWarehouse = [locId];
    } else if (contextType === 'VMS') {
      payload.marketPlaceSeller = [locId];
    }
    if (scale === 'weighingScale') {
      payload.needsWeighingScaleIntegration = [];
    }
    setIsFilterCleared(true);
    fetchingAllProducts(payload);
  };

  //updating common filter state
  useEffect(() => {
    setCommonFilterData((prev) => ({
      ...prev,
      productName: [...searchProductName],
      barcodeNumber: [...barcodeNumber],
    }));
  }, [searchProductName]);
  const filterObject = {
    page: pageState?.page,
    pageSize: pageState?.pageSize,
    names: [],
    mergedProductShow: false,
    query: persistedSearchValue
      ? isNaN(Number(persistedSearchValue))
        ? persistedSearchValue
        : ''
      : allProductsFilter?.productName?.[0]
      ? allProductsFilter?.productName?.[0]
      : searchProductName[0],
    query: allProductsFilter?.productName?.[0] ? allProductsFilter?.productName?.[0] : searchProductName[0],
    brands: [],
    // barcode: allProductsFilter?.barcodeNumber?.[0] ? [allProductsFilter?.barcodeNumber?.[0]] : barcodeNumber,
    barcode: [],
    manufacturers: [],
    appCategories: {
      categoryLevel1: persistedFilters?.selectedMainCategory.label
        ? [persistedFilters?.selectedMainCategory.label]
        : [],
      categoryLevel2: persistedFilters?.selectedCategoryLevel1.label
        ? [persistedFilters?.selectedCategoryLevel1.label]
        : [],
      categoryLevel3: persistedFilters?.selectedCategoryLevel2.label
        ? [persistedFilters?.selectedCategoryLevel2.label]
        : [],
    },
    productStatus: persistedFilters?.productStatus.value ? [persistedFilters?.productStatus.value] : [],
    preferredVendors: persistedFilters?.selectedVendor.value ? [persistedFilters?.selectedVendor.value] : [],
    manufacturers: persistedFilters?.selectedManufacturer.label ? [persistedFilters?.selectedManufacturer.label] : [], //this is manufacturer name
    sortByPrice: persistedFilters?.sortByPrice.value ? persistedFilters?.sortByPrice.value : 'DEFAULT',
    sortByCreatedAt: 'DESC',
    showBundles: isBundle,
    showOnlyDeActivated: persistedFilters?.productStatus?.value === 'IN_ACTIVE' ? true : undefined,
  };
  if (contextType === 'RETAIL') {
    filterObject.storeLocations = [locId];
  } else if (contextType === 'WMS') {
    filterObject.supportedWarehouse = [locId];
  } else if (contextType === 'VMS') {
    filterObject.marketPlaceSeller = [locId];
  }
  if (persistedFilters?.allProductsFilter?.scale === 'weighingScale' || scale === 'weighingScale') {
    filterObject.needsWeighingScaleIntegration = [true];
  }

  if (isBundle) {
    filterObject.showBundles = true;
  }

  const CopyTooltip = ({ params }) => {
    return (
      <Tooltip title={<CopyToClipBoard params={params} />} arrow placement="top">
        <span>{params.value}</span>
      </Tooltip>
    );
  };

  const [openDropdowns, setOpenDropdowns] = useState({});
  const toggleDropdown = (rowId) => {
    setOpenDropdowns((prevState) => ({
      ...prevState,
      [rowId]: !prevState[rowId],
    }));
  };

  const popoverAnchorRefs = useRef({});

  const columns = [
    {
      field: 'productId',
      headerName: 'ID',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      flex: 1,
      minWidth: 70,
      cellClassName: 'datagrid-rows',
      align: 'center',
      // renderCell: (params) => {
      //   return <CopyToClipBoard params={params} />;
      // },
      renderCell: (params) => {
        return <CopyTooltip params={params} />;
      },
    },
    {
      field: 'image',
      headerName: 'Image',
      minWidth: 100,
      flex: 0.75,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      renderCell: (params) => {
        return <img src={params.value} className="all-product-image" width="60px" height="60px" />;
      },
    },
    {
      field: 'product',
      headerName: 'Product Name',
      minWidth: 230,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
    },

    {
      field: 'variants',
      headerName: 'Barcode',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      flex: 1,
      minWidth: 150,
      cellClassName: 'datagrid-rows',
      align: 'left',
      renderCell: (params) => {
        const variants = params?.row?.variants || [];
        const barcodes = variants?.flatMap((variant) => variant?.barcodes || []);
        const firstBarcode = barcodes?.length > 0 ? barcodes?.[0] : 'NA';
        const isBundle = params?.row?.isBundle;
        const bundleBarcode = params?.row?.bundleBarcode;

        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Typography style={{ fontSize: '12px' }}>{isBundle ? bundleBarcode : firstBarcode}</Typography>
              <CopyToClipBoardValue params={isBundle ? bundleBarcode : firstBarcode} width="1.2em" height="1.2em" />
            </div>
          </div>
        );
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 50,
      flex: 1,
      cellClassName: 'datagrid-rows',
      align: 'left',
      renderCell: (cellValues) => {
        return <div>{cellValues.value !== '' && <Status label={cellValues.value} />}</div>;
      },
    },
    {
      field: 'brand',
      headerName: 'Brand',
      minWidth: 80,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'mrp',
      headerName: 'MRP',
      minWidth: 50,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'salePrice',
      headerName: 'Sale Price',
      minWidth: 50,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    // {
    //   field: 'isBundle',
    //   headerName: '',
    //   headerClassName: 'datagrid-columns',
    //   headerAlign: 'left',
    //   minWidth: 0,
    //   flex: 1,
    //   cellClassName: 'datagrid-rows',
    //   align: 'left',
    // },
    {
      field: 'manufacturer',
      headerName: 'Manufacturer',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      flex: 1,
      minWidth: 150,
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'completeVariants',
      headerName: '',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      flex: 1,
      minWidth: 50,
      cellClassName: 'datagrid-rows',
      align: 'left',
      renderCell: (params) => {
        const rowId = params?.id;
        const variants = params?.row?.completeVariants || [];
        const hasMultipleVariants = variants?.length > 1;

        return (
          <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            {hasMultipleVariants && (
              <>
                <Badge badgeContent={variants?.length} color="primary">
                  <IconButton
                    ref={(el) => {
                      if (el) popoverAnchorRefs.current[rowId] = el;
                    }}
                    onClick={() => toggleDropdown(rowId)}
                    size="small"
                  >
                    {openDropdowns[rowId] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                </Badge>
                <Popover
                  open={Boolean(openDropdowns[rowId])}
                  anchorEl={popoverAnchorRefs.current[rowId]}
                  onClose={() => toggleDropdown(rowId)}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  // transformOrigin={{
                  //   vertical: 'center',
                  //   horizontal: 'left',
                  // }}
                  PaperProps={{
                    style: {
                      backgroundColor: '#ffffff',
                      boxShadow: '0px 8px 16px rgba(0,0,0,0.1)',
                      border: '1px solid #B5B4B4',
                      width: miniSidenav ? 'calc(100% - 150px)' : 'calc(100% - 310px)',
                      marginTop: '12px',
                    },
                  }}
                >
                  <div style={{ padding: miniSidenav ? '10px 30px' : '10px' }}>
                    <div style={{ display: 'table', width: '100%' }}>
                      {variants?.map((item, index) => (
                        <div
                          key={index}
                          style={{
                            display: 'flex',
                            borderBottom: index !== variants?.length - 1 ? '1px solid #e0e0e0' : 'none',
                            padding: '5px 0px',
                            alignItems: 'center',
                          }}
                        >
                          <div
                            style={{
                              display: 'table-cell',
                              minWidth: '70px',
                              maxWidth: '70px',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            <Typography style={{ fontSize: '12px' }}>{params?.row?.productId}</Typography>
                          </div>
                          <div style={{ display: 'table-cell', minWidth: '90px', maxWidth: '90px' }}>
                            <img
                              src={item?.images?.front ? item?.images?.front : d_img}
                              className="all-product-image"
                              width="40px"
                              height="40px"
                            />
                          </div>
                          <div
                            style={{
                              display: 'table-cell',
                              minWidth: '230px',
                              maxWidth: '230px',
                              width: '220px',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            <Tooltip title={item?.name}>
                              <Typography style={{ fontSize: '12px' }}>{item?.name}</Typography>
                            </Tooltip>
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              minWidth: '130px',
                              maxWidth: '130px',
                              justifyContent: 'center',
                              alignItems: 'baseline',
                              gap: '2px',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              marginLeft: miniSidenav ? '30px' : '15px',
                            }}
                          >
                            <Typography style={{ fontSize: '12px' }}>{item?.barcodes[0]}</Typography>
                            <CopyToClipBoardValue params={item?.barcodes[0]} width="0.7em" height="0.7em" />
                          </div>
                          <div
                            style={{
                              display: 'table-cell',
                              minWidth: '70px',
                              maxWidth: '70px',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            <Status label={item?.isActive ? 'ACTIVE' : 'INACTIVE'} />
                          </div>
                          <div
                            style={{
                              display: 'table-cell',
                              minWidth: '80px',
                              maxWidth: '80px',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              marginLeft: miniSidenav ? '30px' : '15px',
                            }}
                          >
                            <Typography style={{ fontSize: '12px' }}>{params?.row?.brand}</Typography>
                          </div>
                          <div
                            style={{
                              display: 'table-cell',
                              minWidth: '50px',
                              maxWidth: '50px',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              marginLeft: miniSidenav ? '30px' : '10px',
                            }}
                          >
                            <Typography style={{ fontSize: '12px' }}>
                              {item?.inventorySync?.mrp
                                ? `₹ ${item?.inventorySync?.mrp}`
                                : item?.mrpData[0]?.mrp
                                ? `₹ ${item?.mrpData[0]?.mrp}`
                                : 'NA'}
                            </Typography>
                          </div>
                          <div
                            style={{
                              display: 'table-cell',
                              minWidth: '50px',
                              maxWidth: '50px',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              marginLeft: miniSidenav ? '30px' : '5px',
                            }}
                          >
                            <Typography style={{ fontSize: '12px' }}>
                              {item?.inventorySync?.sellingPrice ? `₹ ${item?.inventorySync?.sellingPrice}` : 'NA'}
                            </Typography>
                          </div>
                          <div
                            style={{
                              display: 'table-cell',
                              minWidth: '150px',
                              maxWidth: '150px',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              marginLeft: miniSidenav ? '30px' : '5px',
                            }}
                          >
                            <Typography style={{ fontSize: '12px' }}>{params?.row?.manufacturer}</Typography>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Popover>
              </>
            )}
          </div>
        );
      },
    },
  ];

  let dataArr,
    dataRes,
    dataRow = [];
  const d_img = 'https://i.imgur.com/dL4ScuP.png';

  const fetchingAllProducts = (payload, isAppliedFilter) => {
    if (isAppliedFilter === true) {
      setPageState((old) => ({ ...old, loader: true, page: 1 }));
    } else {
      setPageState((old) => ({ ...old, loader: true }));
    }
    setClearFilter(false);
    const filterObj = payload ? payload : filterObject;
    if(isMobileDevice){
      if(filterObj?.barcode?.length){
        filterObj.query = filterObj?.barcode[0];
        filterObj.barcode = [];
      }
    }

    const fetchImages = (row) => {
      if (row?.isBundle) {
        return (
          row?.imageUrls?.front || row?.imageUrls?.back || row?.imageUrls?.top_left || row?.imageUrls?.right || d_img
        );
      } else {
        return (
          row?.variants[0]?.images?.front?.trim() ||
          row?.variants[0]?.images?.back?.trim() ||
          row?.variants[0]?.images?.top_left?.trim() ||
          row?.variants[0]?.images?.top_right?.trim() ||
          d_img
        );
      }
    };
    if (isMobileDevice && location?.pathname?.includes('/products/ros-app-products')) {
      setIsFilterApplied(false);
      setIsFilterOpened(false);
    }
    getAllProductsV2New(filterObj)
      .then(function (responseTxt) {
        dataRes = responseTxt?.data?.data?.data;
        dataArr = responseTxt?.data?.data?.data?.data || [];
        setTotalPage(dataRes?.totalPages);
        if (isMobileDevice) {
          setTotalProducts(dataRes?.totalRecords);
        }
        setSearchResultLength(dataArr?.length);
        dataRow.push(
          dataArr?.map((row, index) => {
            return {
              id: index + 1,
              image: fetchImages(row),
              product: row?.name,
              barcode: row?.variants?.[0]?.barcodes,
              variants: row?.variants,
              completeVariants: row?.variants,
              brand: row?.companyDetail?.brand || 'NA',
              mrp: row?.variants?.[0]?.inventorySync?.mrp
                ? `₹ ${row?.variants?.[0]?.inventorySync?.mrp}`
                : row?.variants?.[0]?.mrpData?.[0]?.mrp
                ? `₹ ${row?.variants?.[0]?.mrpData?.[0]?.mrp}`
                : 'NA',
              salePrice: row?.variants?.[0]?.inventorySync?.sellingPrice
                ? `₹ ${row?.variants?.[0]?.inventorySync?.sellingPrice}`
                : 'NA',
              status: row?.isActive ? 'ACTIVE' : 'INACTIVE',
              isBundle: row?.isBundle,
              bundleBarcode: row?.bundleBarcode,
              manufacturer:
                row?.companyDetail?.name || row?.companyDetail?.manufacturer || row?.companyDetail?.manufacturerName,
              productId: row?.id,
              availableQty:
                row?.variants?.reduce((total, variant) => {
                  return total + variant?.inventorySync?.availableQuantity;
                }, 0) || '0',
              // languages: row?.product?.language?.nativeLanguages,
            };
          }),
        );
        if (dataRes?.currentPage === dataRes?.totalPages) {
          setShowViewMore(false);
        } else {
          if (!showViewMore) {
            setShowViewMore(true);
          }
        }
        if (scale === 'weighingScale') {
          setPageState((old) => ({
            ...old,
            loader: false,
            datRows: dataRow[0] || [],
            total: dataRes?.totalRecords || 0,
            // pageSize: parseInt(dataArr?.currentPageResults) || 10,
          }));
        } else {
          setPageState((old) => ({
            ...old,
            loader: false,
            datRows: dataRow[0] || [],
            total: dataRes?.totalRecords || 0,
          }));
        }
        setIsApplied(false);
        setIsFilterCleared(false);
      })
      .catch((err) => {
        setPageState((old) => ({ ...old, loader: false }));
      });
  };

  const navigateToDetailsPage = (id, isBundle) => {
    // Filter context updation
    const filterData = {
      ...commonFilterData,
      scanned: scanned && true,
      searchName: searchName ? searchName : webSearchName,
      scannedProductGtin: scanned && scannedProductGtin,
      ...(scanned && { barcodeNumber: [scannedProductGtin] }),
      ...(scanned && { productName: [] }),
    };

    setAllProductsFilter(dispatch, filterData);

    // Datagrid page number context updation
    const contextPageNumber = {
      ...pageNumber,
      products: {
        ...pageNumber?.products,
        allProducts: pageState?.page,
      },
    };
    setPageNumber(dispatch, contextPageNumber);

    // Navigate to different routes based on `isBundle`
    if (isBundle) {
      navigate(`/products/bundle-product/details/${id}`);
    } else {
      navigate(`/products/product/details/${id}`);
    }
  };

  // apply filter function
  const applyFilter = (filterPayload) => {
    // if search value exist remove it then apply filter
    if (searchProductName?.length !== 0 || barcodeNumber?.length !== 0) {
      const apply_filter = true;
      handleClearProductSearch(apply_filter);
    }
    dispatch2(setAllProductsPage(1));
    const payload = {
      page: 1,
      pageSize: pageState?.pageSize,
      names: [],
      query: '',
      brands: [],
      barcode: [],
      manufacturers: [],
      showBundles: false,
      ...filterPayload,
    };
    if (contextType === 'RETAIL') {
      payload.storeLocations = [locId];
    } else if (contextType === 'WMS') {
      payload.supportedWarehouse = [locId];
    } else if (contextType === 'VMS') {
      payload.marketPlaceSeller = [locId];
    }
    const isAppliedFilter = true;
    setIsApplied(true);
    if (isMobileDevice && searchName) {
      setSearchName('');
    }
    fetchingAllProducts(payload, isAppliedFilter);
  };

  const [infiniteLoader, setInfiniteLoader] = useState(false);
  const [infinitePageNo, setInfintiePageNo] = useState(2);
  const [noData, setNoData] = useState(false);
  const [totalPages, setTotalPage] = useState();
  const [openScannerDrawer, setOpenScannerDrawer] = useState(false);
  const [scanned, setScanned] = useState(allProductsFilter?.scanned || false);

  //main products function
  useEffect(() => {
    if (location?.state === null || !location?.state?.hasOwnProperty('gtin')) {
      if (isApplied === false && isFilterCleared === false) {
        if (isSearchValue === true && persistedFiltersAppliedCount !== 0 && !isMobileDevice) {
          setIsSearchValue(false);
          return;
        }
        fetchingAllProducts(filterObject);
      }
    }
  }, [pageState?.page, location.pathname]);

  //infinte scroll
  const fetchMoreData = async (payload, isAppliedFilter) => {
    const filterObjectFetchMoreData = {
      ...(isAppliedFilter ? payload : filterObject),
      page: infinitePageNo,
      pageSize: 10,
    };
    if (isMobileDevice) {
      if (filterObjectFetchMoreData?.barcode?.length) {
        filterObjectFetchMoreData.query = filterObjectFetchMoreData?.barcode[0];
        filterObjectFetchMoreData.barcode = [];
      }
    }
    getAllProductsV2New(filterObjectFetchMoreData)
      .then(function (responseTxt) {
        dataArr = responseTxt?.data?.data?.data?.data;
        setInfiniteLoader(false);
        setTotalProducts(responseTxt?.data?.data?.data?.totalRecords);
        dataRow.push(
          dataArr?.map((row, index) => {
            return {
              id: index,
              image:
                row?.variants[0]?.images?.front?.trim() ||
                row?.variants[0]?.images?.back?.trim() ||
                row?.variants[0]?.images?.top_left?.trim() ||
                row?.variants[0]?.images?.top_right?.trim() ||
                d_img,
              product: row?.name,
              barcode: row?.variants[0]?.barcodes || 'NA',
              variants: row?.variants,
              brand: row?.companyDetail?.brand || 'NA',
              mrp: row?.variants[0]?.inventorySync?.mrp
                ? `₹ ${row?.variants[0]?.inventorySync?.mrp}`
                : row?.variants[0]?.mrpData[0]?.mrp
                ? `₹ ${row?.variants[0]?.mrpData[0]?.mrp}`
                : 'NA',
              salePrice: row?.inventoryData?.sellingPrice || 'NA',
              status: row?.isActive ? 'ACTIVE' : 'INACTIVE',
              isBundle: row?.isBundle,
              bundleBarcode: row?.bundleBarcode,
              manufacturer:
                row?.companyDetail?.name || row?.companyDetail?.manufacturer || row?.companyDetail?.manufacturerName,
              productId: row?.id,
              availableQty:
                row?.variants.reduce((total, variant) => {
                  return total + variant.inventorySync.availableQuantity;
                }, 0) || '0',
            };
          }),
        );

        if (responseTxt?.data?.data?.data?.currentPage === responseTxt?.data?.data?.data?.totalPages) {
          setShowViewMore(false);
        } else {
          if (!showViewMore) {
            setShowViewMore(true);
          }
        }
        if (scale === 'weighingScale') {
          setPageState((old) => ({
            ...old,
            loader: false,
            datRows: [...old.datRows, ...dataRow[0]],
            total: dataArr?.totalRecords || 0,
            pageSize: parseInt(dataArr?.currentPageResults) || 10,
          }));
        } else {
          setPageState((old) => ({
            ...old,
            loader: false,
            datRows: [...old.datRows, ...dataRow[0]],
            total: dataArr?.totalRecords || 0,
          }));
        }
      })
      .catch((err) => {
        // setPageState((old) => ({ ...old, loader: false }));
      });
  };

  const handleScroll = () => {
    if (
      document.documentElement.scrollTop + window.innerHeight + 1 >= document.documentElement.scrollHeight &&
      infinitePageNo <= totalPages
    ) {
      if (infinitePageNo === totalPages - 1) {
        setNoData(true);
      }
      setInfiniteLoader(true);
      setInfintiePageNo(infinitePageNo + 1);
      if (isMobileDevice) {
        fetchMoreData();
      }
    }
  };

  // useEffect(() => {
  //   window.addEventListener('scroll', handleScroll);
  //   return () => {
  //     window.removeEventListener('scroll', handleScroll);
  //   };
  // }, [infinitePageNo, totalPages]);

  //mobile functions =============================================
  //opening scanner
  const openScanner = () => {
    // setOpenScannerDrawer(true);
    // setScanner(true);
    emit({ type: 'scanner' });
    // setShowCamera(true);
  };

  const searchedProductClearHandler = () => {
    setScanned(false);
    setScannedProductGtin('');
    const payload = {
      page: 1,
      names: [],
      query: '',
      brands: [],
      barcode: [],
      manufacturers: [],
      appCategories: {
        categoryLevel1: [],
        categoryLevel2: [],
        categoryLevel3: [],
      },
      mergedProductShow: false,
      productStatus: [],
      preferredVendors: [],
      sortByPrice: 'DEFAULT',
      sortByCreatedAt: 'DESC',
      storeLocations: [locId],
      pageSize: '10',
      showBundles: false,
    };
    fetchingAllProducts(payload);
    //setting the filter data as empty object, to clear everything when clear button is clicked
    setAllProductsFilter(dispatch, {});
    setSearchProductName([]);
    setBarcodeNumber([]);
  };

  useNativeMessage((message) => {
    const data = JSON.parse(message?.data);
    if (message?.type === 'gtin') {
      const payload = {
        ...filterObject,
        // barcode: [data?.gtin],
        barcode: [],
        names: [],
        query: data?.gtin,
      };
      fetchingAllProducts(payload);
      setScannedProductGtin(data?.gtin);
      setScanner(false);
      const contextData = {
        ...commonFilterData,
        barcodeNumber: [data?.gtin],
      };
      setAllProductsFilter(dispatch, contextData);
    }
  });

  //functionality when scanned through bottom navbar

  useEffect(() => {
    if (!isMobileDevice) return;
    if (location?.state?.gtin && isMobileDevice && isScannedFromBottomNavbar) {
      setScanned(true);
      setScannedProductGtin(location?.state?.gtin);
      const payload = {
        ...filterObject,
        // barcode: [gtinFromBottomNavbar],
        query: gtinFromBottomNavbar,
      };
      fetchingAllProducts(payload);
    }
  }, [location, isMobileDevice]);

  const isHidden = useMemo(() => {
    const currentPath = location?.pathname;
    return currentPath !== '/products/all-products' && currentPath !== '/products/all-bundle-products';
  }, [location?.pathname]);

  const handleNextListingPage = () => {
    setInfiniteLoader(true);
    setInfintiePageNo(infinitePageNo + 1);
    if (!isFilterApplied) {
      fetchMoreData();
    }
  };

  useEffect(() => {
    if (isMounted) {
      handleSearchFliter(inputValue);
      dispatch2(setAllProductsSearchValue(inputValue));
    } else {
      setIsMounted(true);
    }
  }, [debouncedSearchValue]);

  return isBundle ? (
    <ComingSoon />
  ) : (
    <DashboardLayout isHidden={isHidden}>
      {!isMobileDevice ? (
        <>
          {!isHidden && <DashboardNavbar />}

          <Box
            className="search-bar-filter-and-table-container"
            style={{
              position: 'relative',
            }}
          >
            <SoftBox className="header-bulk-price-edit all-products-filter-wrapper search-bar-filter-container">
              <Grid container spacing={2} className="all-products-filter">
                {!clearFilter && (
                  <>
                    <Grid item lg={5.5} md={5.5} sm={6} xs={12}>
                      <SoftBox className="all-products-filter-product" sx={{ position: 'relative' }}>
                        <SoftInput
                          className="all-products-filter-soft-input-box"
                          placeholder={
                            !toggleItemCode ? 'Search Products By Name Or Gtin' : 'Search Products By Short Code'
                          }
                          value={inputValue}
                          icon={{ component: 'search', direction: 'left' }}
                          onChange={(e) => {
                            setInputValue(e.target.value);
                          }}
                        />
                        {(searchProductName?.length !== 0 || barcodeNumber?.length !== 0) && (
                          <ClearSoftInput clearInput={handleClearProductSearch} />
                        )}
                      </SoftBox>
                    </Grid>
                    <Grid item lg={3} md={3} sm={3} xs={3}>
                      <div className="content-left toggle-search">
                        <Switch
                          color="secondary"
                          value={toggleItemCode}
                          onClick={() => setToggleItemCode(!toggleItemCode)}
                        />
                        <Typography style={{ fontSize: '14px', color: 'white' }}>Short Code</Typography>
                      </div>
                    </Grid>

                    <Grid item lg={3.5} md={3.5} sm={3} xs={12} justifyContent={'right'}>
                      <Box
                        className="all-products-header-new-btn"
                        display={'flex'}
                        alignItems={'center'}
                        justifyContent={'right'}
                      >
                        {scale === 'weighingScale' && pageState?.datRows?.length > 0 ? (
                          <ExcelDownloadButton data={pageState?.datRows} />
                        ) : null}
                        {!isHidden ? (
                          <>
                            <SoftButton
                              sx={{
                                display:
                                  permissions?.RETAIL_Products?.WRITE ||
                                  permissions?.WMS_Products?.WRITE ||
                                  permissions?.VMS_Products?.WRITE ||
                                  permissions?.HO_Products?.WRITE
                                    ? 'block'
                                    : 'none',
                              }}
                              variant="solidWhiteBackground"
                              onClick={() =>
                                retailType === 'RESTAURANT'
                                  ? handleRestaurantCreateProduct()
                                  : location.pathname === '/products/all-products'
                                  ? handleProduct()
                                  : handleBundle('bundle')
                              }
                            >
                              + New
                            </SoftButton>
                          </>
                        ) : (
                          <SoftButton
                            sx={{
                              display:
                                permissions?.RETAIL_Products?.WRITE ||
                                permissions?.WMS_Products?.WRITE ||
                                permissions?.VMS_Products?.WRITE ||
                                permissions?.HO_Products?.WRITE
                                  ? 'block'
                                  : 'none',
                            }}
                            variant="solidWhiteBackground"
                            onClick={() => navigate('/purchase/vendors/products/add-products')}
                          >
                            + New
                          </SoftButton>
                        )}

                        {/* filter */}
                        {!isMobileDevice && !isBundle && (
                          <AllProductsPageFilter
                            applyFilter={applyFilter}
                            clearFilter={handleClearFilter}
                            isSearchValue={isSearchValue}
                          />
                        )}
                      </Box>
                    </Grid>
                  </>
                )}
              </Grid>
            </SoftBox>

            {pageState?.loader && (
              <Box
                sx={{
                  height: '70vh',
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Spinner />
              </Box>
            )}
            {!pageState?.loader && (
              <SoftBox py={0} px={0}>
                <SoftBox style={{ height: 525, width: '100%' }} className="dat-grid-table-box">
                  <DataGrid
                    sx={{ cursor: 'pointer', borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px' }}
                    columns={columns}
                    rows={pageState?.datRows}
                    getRowId={(row) => row.id}
                    rowCount={parseInt(pageState?.total)}
                    loading={pageState?.loader}
                    pagination
                    page={pageState?.page - 1}
                    pageSize={pageState?.pageSize}
                    paginationMode="server"
                    onPageChange={(newPage) => {
                      setPageState((old) => ({ ...old, page: newPage + 1 }));
                      dispatch2(setAllProductsPage(newPage + 1));
                    }}
                    onCellClick={(rows) => {
                      if (rows.field !== 'variants' && rows.field !== 'completeVariants') {
                        const isBundle = rows.row['isBundle'];
                        const productId = rows.row['productId'];

                        navigateToDetailsPage(productId, isBundle);
                      }
                    }}
                    hideScrollbar={true}
                    components={{
                      NoRowsOverlay: () => (
                        <Stack height="100%" alignItems="center" justifyContent="center">
                          Add products to display here
                        </Stack>
                      ),
                      NoResultsOverlay: () => (
                        <Stack height="100%" alignItems="center" justifyContent="center">
                          Add products to display here
                        </Stack>
                      ),
                    }}
                    className="data-grid-table-boxo"
                  />
                </SoftBox>
              </SoftBox>
            )}
          </Box>
        </>
      ) : (
        <>
          <div
            className="pi-listing-card-main-div"
            style={{ width: '100%', height: 'auto', paddingBottom: '10px !important' }}
          >
            {pageState?.loader || infiniteLoader?.loader ? (
              <div className="circular-progress-div">
                <CircularProgress sx={{ color: '#0562fb !important' }} />
              </div>
            ) : pageState?.datRows?.length ? (
              <div className="pi-listing-card-main-div">
                {pageState?.datRows?.map((row) => (
                  <ProductDataCard key={row.productId} data={row} navigateToDetailsPage={navigateToDetailsPage} />
                ))}
                {showViewMore && <ViewMore loading={infiniteLoader} handleNextFunction={handleNextListingPage} />}
              </div>
            ) : (
              <NoDataFoundMob />
            )}
          </div>
          {/* <SoftBox className="new-search-header po-box-shadow">
            <MobileNavbar
              title={'All Products'}
              prevLink={!!location?.state?.isInventory && true}
              overrideNavigateNull={overrideNavigateNull}
            />
            <SoftBox
              className="po-btn-main-div"
              sx={{
                height: 'auto',
                width: '80%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
              }}
            >
              <SoftBox className="new-po-search-button-div">
                <OutlinedInput
                  placeholder="Search Products..."
                  className="search-input-po"
                  sx={{
                    borderRadius: '100vw 100vw 100vw 100vw !important',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 0px 10px 15px !important',
                    border: '0px !important',
                  }}
                  value={scanned ? '' : searchName}
                  onChange={(e) => handleSearchFliter(e)}
                  endAdornment={
                    <InputAdornment position="end">
                      <SoftButton className="all-product-scan" onClick={openScanner}>
                        <Typography fontSize="12px" fontWeight={500}>
                          Scan
                        </Typography>
                      </SoftButton>
                    </InputAdornment>
                  }
                  aria-describedby="outlined-weight-helper-text"
                  inputProps={{
                    'aria-label': 'weight',
                  }}
                />
              </SoftBox>
              <SoftBox>
                <SoftButton className="new-po-add-button" onClick={handleProduct}>
                  <AddIcon />
                </SoftButton>
              </SoftBox>
            </SoftBox>
          </SoftBox>
          <SoftBox sx={{ paddingBottom: '10px' }}>
            {scanned && (
              <SoftBox className="searched-product-main-div">
                <Typography className="searched-product-gtin-name">{`Searched Barcode: ${scannedProductGtin}`}</Typography>
                <SoftButton
                  color="info"
                  variant="contained"
                  onClick={searchedProductClearHandler}
                  className="clear-btn-all-prdt"
                >
                  Clear
                </SoftButton>
              </SoftBox>
            )}
            {!pageState?.loader ? (
              pageState?.datRows?.map((product, index) => (
                <AllProductCard
                  isSearching={!!barcodeNumber?.length || !!searchProductName?.length}
                  product={product}
                  index={index}
                  navigateToDetailsPage={() => navigateToDetailsPage(product.productId)}
                  searchedResultLength={searchResultLength}
                  scanned={scanned}
                  barcodeNumber={barcodeNumber}
                />
              ))
            ) : (
              <SoftBox
                sx={{ height: '75vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <CircularProgress sx={{ color: '#0562FB !important' }} />
              </SoftBox>
            )}
            {!pageState?.loader && !pageState?.datRows?.length && <NoDataFound message={'No Products Found'} />}
            <Box
              className="infinite-loader"
              sx={{
                visibility: infiniteLoader ? 'visible' : 'hidden',
                display: noData ? 'none' : 'flex',
              }}
            >
              <CircularProgress size={30} color="info" />
            </Box>
          </SoftBox> */}
        </>
      )}
      {/* {isMobileDevice && <BottomNavbar />} */}
    </DashboardLayout>
  );
};
