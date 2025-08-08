import './bulk-price-edit.css';
import { DataGrid } from '@mui/x-data-grid';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import EditIcon from '@mui/icons-material/Edit';
import Modal from '@mui/material/Modal';
import React, { useEffect, useState,useRef } from 'react';
import Slide from '@mui/material/Slide';
import SoftBox from 'components/SoftBox';
import SoftButton from 'components/SoftButton';
import SoftInput from 'components/SoftInput';
import SoftSelect from 'components/SoftSelect';
import SoftTypography from 'components/SoftTypography';
import TextField from '@mui/material/TextField';

import {
  CustomAffectingCount,
  createCustomPriceEdit,
  createMarkDownPriceEdit,
  createMarkUpPriceEdit,
  customProductFilter,
  getAllVendors,
  getBulkPriceEdit,
  getCategoriesBulkPriceEdit,
  getManufacturerBulkPriceEdit,
  getMasterPriceDetails,
  markUDownAffectingCount,
  markUDownListAffectingCount,
  markUpAffectingCount,
  markUpListAffectingCount,
  markdownApplyLater,
  markupApplyLater,
  postBulkPriceEdit,
  postinventorytabledata,
} from '../../../../config/Services';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Spinner from '../../../../components/Spinner';
import moment from 'moment';

import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import {
  Checkbox,
  Chip,
  Divider,
  FormControlLabel,
  Grid,
  List,
  ListItem,
  ListItemText,
  Radio,
  RadioGroup,
} from '@mui/material';
import { ChipBoxHeading } from '../../Common/Filter Components/filterComponents';
import { ClearSoftInput, CopyToClipBoard, isSmallScreen, noDatagif, textFormatter } from '../../Common/CommonFunction';
import { buttonStyles } from '../../Common/buttonColor';
import { useDebounce } from 'usehooks-ts';
import Filter from '../../Common/Filter';
import FormField from '../../apps-integration/Pos/components/formfield';
import MasterPriceEditDetails from './MasterPriceEditDetails';
import MobileNavbar from '../../../../examples/Navbars/MobileNavbar/mobile-navbar-drawer';
import ScanAndAddProduct from './ScanAndAddProduct';
import UpgradePlan from '../../../../UpgardePlan';


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const BulkPriceEdit = () => {
  const featureSettings = JSON.parse(localStorage.getItem('featureSettings'));
  const isMarkUpMounted = useRef(false);
  const isMarkDownMounted = useRef(false);
  const isCustomLogMounted = useRef(false);
  const [dataRows, setTableRows] = useState([]);
  const [openModalBulk, setOpenModalBulk] = useState(false);
  const [selectedCategoryOptions, setSelectedCategoryOptions] = useState([]);
  const [selectedCategoryOptionsList, setSelectedCategoryOptionsList] = useState([]);
  const [customCategory, setCustomCategory] = useState();
  const [selectedManufacturerOptions, setSelectedManufacturerOptions] = useState([]);
  const [productBy, setProductBy] = useState(null);
  const [category, setCategory] = useState(false);
  const [manufacturer, setManufacturer] = useState(false);
  const [tabs, setTabs] = useState({
    tab1: true,
    tab2: false,
  });
  const [product, setProduct] = useState(false);
  const [searchProduct, setSearchProduct] = useState('');
  const [debounceSearchProduct, setDebouncedSearchProduct] = useState('');
  const [prodOptions, setProdOptions] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [markStatus, setMarkStatus] = useState('Mark Up');
  const [salePriceOption, setSalePriceOption] = useState(null);
  const [salePrice, setSalePrice] = useState(null);
  const [categoriesList, setCategoriesList] = useState([]);
  const [manufacturersList, setManufacturersList] = useState([]);
  const [loader, setLoader] = useState(false);
  const [bulkPriceData, setBulkPriceData] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [openModalFilter, setOpenModalFilter] = useState(false);
  const [masterPriceEdit, setMasterPriceEdit] = useState('');
  const [filtProduct, setFilterProductBy] = useState({
    value: '',
    label: 'Filter Product By',
  });
  const [editByList, setEditedByList] = useState([]);
  const [editedBy, setEditedBy] = useState({
    value: '',
    label: 'Filter Edited By',
  });
  const [open, setOpen] = useState(false);
  const [masteropen, setMasterOpen] = useState(false);
  const [markupMarginValues, setMarkupMarginValues] = useState('');
  const [searchProductData, setSearchProductData] = useState('');
  const [opensnack, setOpensnack] = useState(false);
  const [timelinerror, setTimelineerror] = useState('');
  const [alertmessage, setAlertmessage] = useState('');
  const [errorComing, setErrorComing] = useState(false);
  const [noOfFields, setNoOfFileds] = useState(1);
  const [customRows, setCustomRowData] = useState([]);
  const [noOfMarkupFields, setNoOfMarkupfields] = useState(1);
  const [rowValues, setRowValues] = useState(Array.from({ length: noOfMarkupFields }, () => ''));
  const [markupAffectedCountData, setMarkupAffectedCountData] = useState();
  const [markdownAffectedCountData, setMarkdownAffectedCountData] = useState();
  const [showMasterDetails, setShowMasterDetails] = useState(false);
  const [showCustomLogs, setCustomLogs] = useState(false);
  const [customlogCalled , setCustomLogCalled] = useState(false);
  const [pageState, setPageState] = useState({
    loader: false,
    dataRows: [],
    total: 0,
    page: 1,
    pageSize: 10,
  });
  const [masterLogPagination, setMasterLogPagination] = useState({
    markUp: { page: 1 , totalResult : null},
    markDown: { page: 1  , totalResult : null}
  });  
  const [selectedBrand, setselectedBrand] = useState();
  const [packagingType, setPackagingType] = useState();
  const [markValue, setmarkValue] = useState();
  const [minMargin, setMinMargin] = useState();
  const [maxMargin, setMaxMargin] = useState();
  const [marginValues, setMarginValues] = useState();
  const [outputArray, setOutputArray] = useState([]);
  const [vendorid, setVendorid] = useState(null);
  const [customlogRows, setCustomlogRows] = useState([]);
  const [paginationState, setPaginationState] = useState({
    page: 1,
    pageSize: 10,
  });
  const [selectionModel, setSelectionModel] = useState([]);
  const [totalPages, setTotalPages] = useState();
  const [affectedMarkupCount, setAffectedMarkupCount] = useState();
  const [formData, setFormData] = useState([]);
  const [customMargin, setCustomMargin] = useState();
  const [customStatus, setCustomStatus] = useState();
  const [selectedOptions, setSelectedOptions] = useState({});
  const [showSpinner, setShowSpinner] = useState(false);
  const [selectedRowsData, setSelectedRowsData] = useState([]);
  const barcodes = selectedRowsData?.map((item) => item.barcode);
  const [showFilter, setShowFilter] = useState(false);
  const [customSaveReload, setCustomSaveReload] = useState(false);
 const [scanBarCode , setScanBarCode] = useState([])
 const [markUplogs, setMarkuplogs] = useState([]);
 const [markDownlogs, setMarkDownLogs] = useState([]);
 const [markDownpg , setMarkDownpg] = useState(0);
 const [reloadTable, setReloadTable] = useState(false);
 const [customLogPagination, setCustomLogPagination] = useState({
  page: 1,
  pageSize: 10,
  totalResult: 0,
});
  useEffect(() => {
    const initialSelectedOptions = {};
    if (markStatus === 'Mark Up') {
      for (let i = 0; i < noOfMarkupFields; i++) {
        initialSelectedOptions[i] = 'applyNow';
      }
    } else {
      for (let i = 0; i < noOfFields; i++) {
        initialSelectedOptions[i] = 'applyNow';
      }
    }

    setSelectedOptions(initialSelectedOptions);
  }, [noOfMarkupFields, noOfFields]);

  useEffect(() => {
    setSelectedRowsData([]);
    setSelectionModel([]);
  }, [customRows]);

  const handleOptionChange = (event, index) => {
    setSelectedOptions({
      ...selectedOptions,
      [index]: event.target.value,
    });
  };

  const debouncedSearchProductData = useDebounce(searchProductData, 300);

  useEffect(() => {
    const categoryValues = customCategory?.map((category) => category.value);
    const payload = {
      pageNumber: paginationState.page - 1,
      pageSize: paginationState.pageSize,
      locationId: locId,
      orgId: orgId,
      categories: categoryValues,
      searchBox: searchProductData,
    };
    const filterPayload = {
      pageNumber: paginationState.page - 1,
      pageSize: paginationState.pageSize,
      locationId: locId,
      orgId: orgId,
      minMargin: minMargin,
      maxMargin: maxMargin,
      packagingType: packagingType?.value,
      searchBox: searchProductData,
    };
    if (markValue) {
      filterPayload.marginBasedOn = markValue?.value === 'MARK DOWN' ? 'mrp' : 'pp';
    }
    if (selectedBrand) {
      filterPayload.brands = [selectedBrand?.value];
    }
    if (vendorid) {
      filterPayload.vendors = [vendorid];
    }
    if (categoryValues) {
      filterPayload.categories = categoryValues;
    }

    if (showCustomLogs) {

    customProductFilter(filterPayload)
      .then((res) => {
        const filterData = res.data.data.data.data?.map((item, index) => {
          return {
            id: index,
            barcode: item?.gtin || '',
            title: item ? textFormatter(item.itemName) : '',
            mrp: item?.mrp || 0,
            sellingprice: item?.sellingPrice || 0,
            margin: (item?.mrp || 0) - (item?.sellingPrice || 0),
          };
        });
        setTotalPages(res?.data?.data?.data?.totalResult);

        setCustomRowData(filterData || []);
      })
      .catch((err) => {});
    }
  }, [
    paginationState,
    vendorid,
    debouncedSearchProductData,
    customSaveReload,
    showCustomLogs
  ]);

  const fetchMarkUpLogs = () => {
    const marginType1 = 'MARK UP';
    getMasterPriceDetails(locId, marginType1 , masterLogPagination?.markUp?.page || 0)
      .then((res) => {
        if (res?.data?.data?.data.totalResult >= 0) {
          setMasterLogPagination((prev) => ({
            ...prev,
            markUp: { ...prev.markUp, totalResult: res?.data?.data?.data.totalResult || 0 }
          }));
          setMasterPriceEdit('MASTER');
          const formattedRows = res?.data?.data?.data?.data?.map((item) => ({
            MPLID: item?.mplId,
            ModifiedOn: item?.modifiedOn
              ? new Date(item?.modifiedOn).toLocaleString('en-US', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                })
              : 'NA',
            Categories: textFormatter(item?.categories?.join(' , ')),
            Margin: `${item?.margin}`,
            AffectedCount: item?.affectedCount,
            edit: item?.labelInUse,
            delete: '',
            editbtn: '',
          }));
          setMarkuplogs(formattedRows || []);
        }
      })
      .catch((err) => {});
   }

   const fetchMarkDownLogs = () => {
    const marginType2 = 'MARK DOWN';
    getMasterPriceDetails(locId, marginType2 , masterLogPagination?.markDown?.page || 0)
    .then((res) => {
      if (res?.data?.data?.data.totalResult >= 0) {
        setMasterLogPagination((prev) => ({
          ...prev,
          markDown: { ...prev.markDown, totalResult: res?.data?.data?.data.totalResult || 0 }
        }));
        setMasterPriceEdit('MASTER');
        setMarkDownpg(res?.data?.data?.data?.totalResult);
        let formattedRows = res?.data?.data?.data?.data?.map((item) => ({
          MPLID: item.mplId,
          ModifiedOn: item.modifiedOn
            ? new Date(item.modifiedOn).toLocaleString('en-US', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })
            : 'NA',
          minMargin: item.minMargin,
          maxMargin: item.maxMargin,
          Margin: `${item.margin}`,
          AffectedCount: item.affectedCount,
          purchaseMargin: item.purchaseMargin ? item.purchaseMargin : 'NA',
          markDownMargin: item.markDownMargin ? item.markDownMargin : 'NA',
          affectedProducts: '',
          UnderLabelRange: '',
          edit: item.labelInUse,
          delete: '',
          editbtn: '',
        }));

        setMarkDownLogs(formattedRows || []);
      }
    })
    .catch((err) => {});
   }
  useEffect(() => {
    fetchMarkUpLogs()
    fetchMarkDownLogs()
    setShowMasterDetails(!showMasterDetails);
  }, [reloadTable]);

  useEffect(() => {
    if (isMarkUpMounted.current) {
      fetchMarkUpLogs(masterLogPagination.markUp.page);
    } else {
      isMarkUpMounted.current = true;
    }
  }, [masterLogPagination.markUp.page]);

  useEffect(() => {
    if (isMarkDownMounted.current) {
      fetchMarkDownLogs(masterLogPagination.markDown.page);
    } else {
      isMarkDownMounted.current = true;
    }
  }, [masterLogPagination.markDown.page]);
  

  useEffect(() => {
    const filterObject = {
      page: 0,
      pageSize: 20,
      filterVendor: {
        searchText: '',
        startDate: '',
        endDate: '',
        locations: [],
        type: [],
        productName: [],
        status: [],
        productGTIN: [],
      },
    };
    getAllVendors(filterObject, orgId).then(function (result) {
      const vendorsArr = result?.data?.data?.vendors?.map((item) => ({
        value: item.vendorId,
        label: item.vendorName,
      }));
      setOutputArray(vendorsArr);
    });
  }, []);

  const customColumns = [
    {
      field: 'barcode',
      headerName: 'Barcode',
      minWidth: 150,
      // width: 180,
      editable: true,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      align: 'left',
      headerAlign: 'left',
      flex: 1,
      renderCell: (params) => {
        return <CopyToClipBoard params={params} />;
      },
    },
    {
      field: 'title',
      headerName: 'Title',
      minWidth: 200,
      editable: true,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      align: 'left',
      headerAlign: 'left',
      flex: 1,
    },
    {
      field: 'mrp',
      headerName: 'MRP',
      type: 'number',
      width: 110,
      editable: true,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      align: 'left',
      headerAlign: 'left',
      flex: 1,
    },
    {
      field: 'sellingprice',
      headerName: 'Selling Price',
      type: 'number',
      width: 140,
      editable: true,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      align: 'left',
      headerAlign: 'left',
      flex: 1,
    },
    {
      field: 'margin',
      headerName: 'Margin',
      type: 'number',
      width: 110,
      editable: true,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      align: 'left',
      headerAlign: 'left',
      flex: 1,
    },
  ];

  const [totalBulkData, setTotalBulkData] = useState('');

  const locId = localStorage.getItem('locId');
  const orgId = localStorage.getItem('orgId');
  const userDetails = JSON.parse(localStorage.getItem('user_details'));
  const user = localStorage.getItem('user_name');
  const user_details = localStorage.getItem('user_details');
  const createdById = JSON.parse(user_details).uidx;
  const userName = userDetails.firstName + ' ' + userDetails.secondName;

  const userRoles = JSON.parse(localStorage.getItem('user_roles'));
  // const superAdmin = userRoles?.find((item) => item == 'SUPER_ADMIN' || item == 'RETAIL_ADMIN');

  const permissions = JSON.parse(localStorage.getItem('permissions'));

  //snackbar
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const handleopensnack = () => {
    setOpensnack(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpensnack(false);
  };

  const handleCloseModalFilter = () => {
    setOpenModalFilter(false);
  };

  const handleClickOpen = () => {
    if (barcodes?.length > 0 || scanBarCode?.length > 0) {
      setOpen(true);
    } else {
      setAlertmessage('Select product to edit');
      setTimelineerror('error');
      setOpensnack(true);
    }
  };

  const handleMasterOpen = () => {
    setMasterOpen(true);
    if (markStatus === 'Mark Up') {
      getMarkupListAffectingCount();
    } else if (markStatus === 'Mark Down') {
      getMarkDowListAffectingCount();
    }
  };

  const handleClose = () => {
    setOpen(false);
    SetErrmsg('');
  };

  const masterClose = () => {
    setShowSpinner(false);
    setMasterOpen(false);
    setMarkupAffectedCountData([]);
    setMarkdownAffectedCountData([]);
  };

  const [errMsg, SetErrmsg] = useState(false);
  const ShowErrMsg = () => {
    getCustomAffectingCount();
  };
  const handleConfirm = () => {
    saveCustomPriceEdit();
    SetErrmsg('');
  };
  const convertUTCDateToLocalDate = (dat) => {
    const date = moment.utc(dat).format('YYYY-MM-DD HH:mm:ss');
    const stillUtc = moment.utc(date).toDate();
    return moment(stillUtc).local().format('L, LT');
  };

  const getAllCategories = () => {
    getCategoriesBulkPriceEdit(locId)
      .then((res) => {
        const category = res.data.data.data;
        const categoryList = category.map((item) => {
          return {
            value: item,
            label: item,
          };
        });
        setCategoriesList(categoryList);
      })
      .catch((err) => {});
  };

  useEffect(() => {
    handleMarginvalues(marginValues?.value || '');
  }, [marginValues]);

  useEffect(() => {
    getAllCategories();
  }, []);

const fetchCustomLogs = () => { 
  const marginType3 = 'CUSTOM';
  getMasterPriceDetails(locId, marginType3 , customLogPagination?.page)
  .then((res) => {
    setCustomLogPagination((prev) => ({
      ...prev,
      totalResult: res?.data?.data?.data?.totalResult || 0,
    }));    const formattedRows = res?.data?.data?.data?.data?.map((item) => ({
      mplId: item.mplId,
      modifiedOn: item.modifiedOn
        ? new Date(item.modifiedOn).toLocaleString('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          })
        : 'NA',
      marginBasedOn: item.marginBasedOn,
      margin: item.margin,
      gtins: item.gtins.join(', '),
      affectedCount: item.affectedCount,
      previousMargin: item.previousMargin ? item.previousMargin : 'NA',
      updatedMargin: item.updatedMargin ? item.updatedMargin : 'NA',
    }));
    setCustomlogRows(formattedRows || []);
  })
  .catch((err) => {});
}

useEffect(() => {
  if (isCustomLogMounted.current) {
    fetchCustomLogs()
  } else {
    isCustomLogMounted.current = true;
  }
}, [customLogPagination?.page])


const handlePageChange = (params) => {
  setCustomLogPagination((prev) => ({
    ...prev,
    page: params + 1,
  }));
};



  const getAllManufacturers = () => {
    getManufacturerBulkPriceEdit(locId)
      .then((res) => {
        const manufacturer = res.data.data.data;
        const manufacturerList = manufacturer.map((item) => {
          return {
            value: item,
            label: textFormatter(item),
          };
        });
        setManufacturersList(manufacturerList);
      })
      .catch((err) => {});
  };

  const columns = [
    {
      field: 'date',
      headerName: 'Date',
      minWidth: 180,
      flex: 0.75,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'criteria',
      headerName: 'Criteria',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 180,
      flex: 0.75,
      cellClassName: 'datagrid-rows',
      align: 'left',
      renderCell: (params) => {
        return (
          <Box
            className="criteria-col"
            style={{
              overflowX: 'scroll',
              display: 'flex',
              // marginTop: '1rem',
            }}
          >
            {params.value.map((item, index, arr) => {
              if (index + 1 == arr.length) {
                return <span style={{ marginRight: '0.5rem' }}>{item}</span>;
              } else {
                return <span style={{ marginRight: '0.5rem' }}>{item + ','}</span>;
              }
            })}
          </Box>
        );
      },
    },
    {
      field: 'previousMargin',
      headerName: 'Previous Margin',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 180,
      flex: 0.75,
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'newMargin',
      headerName: 'New Margin',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 180,
      flex: 0.75,
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'updatedQuantity',
      headerName: 'Affected Inventory',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 180,
      flex: 0.75,
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
  ];

  const customLogColumns = [
    {
      field: 'mplId',
      headerName: 'Pricing ID',
      minWidth: 180,
      flex: 0.75,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    // {
    //   field: 'previousMargin',
    //   headerName: 'Previous Margin',
    //   minWidth: 180,
    //   flex: 0.75,
    //   headerClassName: 'datagrid-columns',
    //   headerAlign: 'left',
    //   cellClassName: 'datagrid-rows',
    //   align: 'left',
    // },
    {
      field: 'margin',
      headerName: 'Updated Margin',
      minWidth: 180,
      flex: 0.75,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'affectedCount',
      headerName: 'Products',
      minWidth: 180,
      flex: 0.75,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    // {
    //   field: 'margin',
    //   headerName: 'margin',
    //   minWidth: 180,
    //   flex: 0.75,
    //   headerClassName: 'datagrid-columns',
    //   headerAlign: 'left',
    //   cellClassName: 'datagrid-rows',
    //   align: 'left',
    // },
    // {
    //   field: 'gtins',
    //   headerName: 'gtins',
    //   minWidth: 180,
    //   flex: 0.75,
    //   headerClassName: 'datagrid-columns',
    //   headerAlign: 'left',
    //   cellClassName: 'datagrid-rows',
    //   align: 'left',
    // },
    {
      field: 'modifiedOn',
      headerName: 'Last Modified',
      minWidth: 180,
      flex: 0.75,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
  ];

  const filterObject = {
    pageNumber: pageState.page,
    pageSize: 10,
    locationId: [locId],
    editedBy: !editedBy.value.length ? [] : [editedBy.value],
    criteriaType: !filtProduct.value.length ? [] : [filtProduct.value],
    startDate: startDate,
    endDate: endDate,
  };

  const fetchBulkPriceEditData = () => {
    setLoader(true);
    getBulkPriceEdit(filterObject)
      .then((res) => {
        if (res.data.data.es == 1) {
          setAlertmessage(res.data.data.message);
          setTimelineerror('error');
          setOpensnack(true);
          setLoader(false);
          setErrorComing(true);
          setLoader(false);
          return;
        }
        const dataArr = res.data.data;
        const bulkPriceEditData = res.data.data.data;
        const tableData = bulkPriceEditData.map((row) => ({
          date: convertUTCDateToLocalDate(row.editDate),
          criteria: JSON.parse(row.bulkPriceEditCriteria),
          // previousMargin: parseInt(row.previousMargin).toFixed(2).toString() + row.marginType,
          previousMargin: row.previousMargin + row.marginType,
          newMargin: parseInt(row.newMargin).toFixed(2).toString() + row.marginType,
          updatedQuantity: row.updatedQuantity,
          bulkPriceEditId: row.bulkPriceEditId,
        }));
        // setTableRows(tableData);
        setPageState((old) => ({
          ...old,
          loader: false,
          dataRows: tableData || [],
          total: dataArr.totalResults || 0,
        }));
        setTotalBulkData(dataArr.totalResults);
        setLoader(false);
      })
      .catch((err) => {
        setAlertmessage('NO Data Found');
        setTimelineerror('error');
        handleopensnack();
        setLoader(false);
      });
  };

  const handleEditedBy = (option) => {
    //
    setEditedBy(option);
  };

  const handleCloseModalBulk = () => {
    setOpenModalBulk(false);
    setCategory(false);
    setManufacturer(false);
    setProduct(false);
    setSelectedProducts([]);
  };

  const handleSelectCategory = (selectedOptions, index) => {
    const updatedSelectedOptionsList = [...selectedCategoryOptionsList];
    updatedSelectedOptionsList[index] = selectedOptions;
    setSelectedCategoryOptionsList(updatedSelectedOptionsList);
  };

  const handleSelectManufacturer = (selectedOptions) => {
    setSelectedManufacturerOptions(selectedOptions);
  };

  const handleProductBy = (option) => {
    if (option.value == 'category') {
      setCategory(true);
      setProductBy(option.value);
      setManufacturer(false);
      setProduct(false);
      getAllCategories();
      setSelectedManufacturerOptions([]);
    }
    if (option.value == 'manufacturer') {
      setManufacturer(true);
      setProductBy(option.value);
      setCategory(false);
      setProduct(false);
      getAllManufacturers();
      setSelectedCategoryOptions([]);
    }
    if (option.value == 'product') {
      setProductBy(option.value);
      setProduct(true);
      setCategory(false);
      setManufacturer(false);
      setSelectedManufacturerOptions([]);
      setSelectedCategoryOptions([]);
    }
  };

  const handleSalePriceOption = (option) => {
    setSalePriceOption(option.value);
  };

  const handleSalePriceVal = (e) => {
    const val = e.target.value;
    setSalePrice(val);
  };

  const verifyPayload = (payload) => {
    if (productBy == null) {
      setTimelineerror('warning');
      setAlertmessage('Please select Product by option');
      setOpensnack(true);
      return false;
    }

    if (productBy == 'category' && payload.category == undefined) {
      setTimelineerror('warning');
      setAlertmessage('Please select category option');
      setOpensnack(true);
      return false;
    }

    if (productBy == 'manufacturer' && payload.brand == undefined) {
      setTimelineerror('warning');
      setAlertmessage('Please select manufacturer option');
      setOpensnack(true);
      return false;
    }

    if (salePriceOption == null) {
      setTimelineerror('warning');
      setAlertmessage('Please select sale price option');
      setOpensnack(true);
      return false;
    }
    if (salePrice == null) {
      setTimelineerror('warning');
      setAlertmessage('Please enter sale price value');
      setOpensnack(true);
      return false;
    }

    return true;
  };

  const handleTabClick = (tab) => {
    setTabs((prev) => ({ ...prev, [tab]: true }));
    Object.keys(tabs)
      .filter((key) => key !== tab)
      .forEach((key) => {
        setTabs((prev) => ({ ...prev, [key]: false }));
      });
    if (tab === 'tab1') {
      setMasterPriceEdit('MASTER');
    } else {
      setMasterPriceEdit('CUSTOM');
      if (showCustomLogs) {
        fetchCustomLogs();
      }
    }
    // setShowDatePicker(false);
  };
  const handleSave = () => {
    let selectedCategories = '';
    let selectedManufacturers = '';

    let selectedProd = '';

    if (selectedCategoryOptions.length) {
      selectedCategories = [];
      for (let i = 0; i < selectedCategoryOptions.length; i++) {
        selectedCategories.push(selectedCategoryOptions[i].value);
      }
    }

    if (selectedManufacturerOptions.length) {
      selectedManufacturers = [];
      for (let i = 0; i < selectedManufacturerOptions.length; i++) {
        selectedManufacturers.push(selectedManufacturerOptions[i].value);
      }
    }

    if (selectedProducts.length) {
      const selected = [...selectedProducts].map((item) => item.value);
      selectedProd = [...new Set(selected)];
    }

    let payload = '';

    if (productBy == 'product') {
      payload = {
        category: [...selectedCategories],
        brand: [...selectedManufacturers],
        locationId: locId,
        editedBy: userName,
        marginType: salePriceOption,
        marginValue: salePrice,
        criteriaType: productBy,
        gtin: selectedProducts.length ? selectedProd : [],
      };
    } else {
      payload = {
        category: [...selectedCategories],
        brand: [...selectedManufacturers],
        locationId: locId,
        editedBy: userName,
        marginType: salePriceOption,
        marginValue: salePrice,
        criteriaType: productBy,
      };
    }

    // const payload = {
    //   category: [...selectedCategories],
    //   brand: [...selectedManufacturers],
    //   locationId: locId,
    //   editedBy: userName,
    //   marginType: salePriceOption,
    //   marginValue: salePrice,
    //   criteriaType: productBy,
    //   gtin: selectedProducts.length ? selectedProd : [],
    // };

    if (payload.brand.length == 0) {
      delete payload.brand;
    }

    if (payload.category.length == 0) {
      delete payload.category;
    }

    if (!verifyPayload(payload)) {
      return;
    }

    setLoader(true);
    postBulkPriceEdit(payload)
      .then((res) => {
        setSelectedManufacturerOptions([]);
        setSelectedCategoryOptions([]);
        setSelectedProducts([]);
        setProdOptions([]);
        setSalePriceOption(null);
        setProductBy(null);
        setSalePrice(null);
        setLoader(false);
        setAlertmessage(res.data.data.message);
        setTimelineerror('success');
        setOpensnack(true);
        setOpenModalBulk(false);
        setBulkPriceData(!bulkPriceData);
      })
      .catch((err) => {
        setLoader(false);
      });
  };

  const filterProductBy = (option) => {
    setFilterProductBy(option);
  };

  // useEffect(() => {
  //   fetchBulkPriceEditData();
  // }, [bulkPriceData, filtProduct, editedBy, pageState.page, pageState.pageSize]);

  // useEffect(() => {
  //   if (startDate !== null && endDate !== null) {
  //     fetchBulkPriceEditData();
  //   }
  // }, [startDate, endDate]);

  useEffect(() => {}, [startDate, endDate, filtProduct]);

  const handleClear = () => {
    setFilterProductBy({
      value: '',
      label: 'Filter Product By',
    });
    setEditedBy({
      value: '',
      label: 'Filter Edited By',
    });
    setStartDate(null);
    setEndDate(null);
  };
  const popperSx = {
    '& .MuiPaper-root': {
      backgroundColor: 'rgba(120, 120, 120, 0.2)',
    },
  };

  const handleAutoComplete = (prod) => {
    //
    setSelectedProducts([...selectedProducts, ...prod]);
  };

  const handleChange = (e) => {
    const searchText = e.target.value;
    //
    setSearchProduct(searchText);
    //
    // const filterObject = {
    //   pageNumber: 1,
    //   pageSize: 100,
    //   productId: [],
    //   category: [],
    //   locationId: [locId],
    //   itemCode: [],
    //   itemName: [],
    //   brand: [],
    //   storageId: [],
    //   gtin: [],
    //   orgId: [],
    //   availability: 'A',
    //   // searchBox: debounceSearchProduct.trim(),
    //   searchBox: searchText,
    //   skuid: [],
    // };

    // postinventorytabledata(filterObject)
    //   .then((res) => {
    //
    //     const result = res.data?.data?.inventoryCumulativeDataList.map((item) => ({
    //       value: item?.gtin,
    //       label: item?.itemName,
    //     }));
    //     setProdOptions(result);
    //   })
    //   .catch((err) => {
    //
    //   });
    // }
    //
  };

  // clear products search input fn
  const handleClearSearchProductData = () => {
    setSearchProductData('');
  };

  const handleProductOptions = (selectedOptions) => {};

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearchProduct(searchProduct), 1000);
    return () => {
      clearTimeout(timeout);
    };
  }, [searchProduct]);

  // useEffect(() => {
  //
  // }, [debounceSearchProduct]);

  useEffect(() => {
    if (debounceSearchProduct.length) {
      const filterObject = {
        pageNumber: 1,
        pageSize: 10,
        productId: [],
        category: [],
        locationId: [locId],
        itemCode: [],
        itemName: [],
        brand: [],
        storageId: [],
        gtin: [],
        orgId: [],
        availability: 'A',
        searchBox: debounceSearchProduct.trim(),
        // searchBox: searchProduct,
        skuid: [],
      };

      postinventorytabledata(filterObject)
        .then((res) => {
          const result = res.data?.data?.inventoryCumulativeDataList.map((item) => ({
            value: item?.gtin,
            label: `${item.itemName}   (${item.gtin})`,
            // label:item?.itemName
          }));
          // const result = res.data?.data?.inventoryCumulativeDataList;
          setProdOptions(result);
        })
        .catch((err) => {});
    }
    if (searchProduct.length == 0) {
      if (searchProduct.length == 0 && prodOptions.length == 0) {
        setSelectedProducts([]);
      }
    }
    setProdOptions([]);
  }, [debounceSearchProduct]);
  const onMasterChange = (e) => {
    if (masterPriceEdit === 'MASTER') {
      setShowMasterDetails(!showMasterDetails);
    } else if (masterPriceEdit === 'CUSTOM') {
      setCustomLogs(!showCustomLogs);
      
    }
    setMasterPriceEdit(e);
  };
  // useEffect(() => {
  //
  // }, [prodOptions]);

  useEffect(() => {
    getAllManufacturers();
  }, []);

  const handleMarginvalues = (e) => {
    const [min, max] = e?.split(' - ');
    setMaxMargin(max);
    setMinMargin(min);
  };
  const HandleAddmore = () => {
    setNoOfFileds(noOfFields + 1);
  };
  const HandleAddmoreMarkup = () => {
    setNoOfMarkupfields(noOfMarkupFields + 1);
  };

  const handleDeleteRow = (index) => {
    if (markStatus === 'Mark Up') {
      if (index >= 0) {
        const updatedSelectedCategoryOptionsList = [...selectedCategoryOptionsList];
        updatedSelectedCategoryOptionsList.splice(index, 1);
        const updatedRowValues = [...rowValues];
        updatedRowValues.splice(index, 1);
        setNoOfMarkupfields(noOfMarkupFields - 1);
        setSelectedCategoryOptionsList(updatedSelectedCategoryOptionsList);
        setRowValues(updatedRowValues);
      }
    } else if (markStatus === 'Mark Down') {
      setNoOfFileds(noOfFields - 1);
      formData.splice(index, 1);
    }
  };

  const handleInputChange = (value, index) => {
    setRowValues((prevRowValues) => {
      const newRowValues = [...prevRowValues];
      newRowValues[index] = value;
      return newRowValues;
    });
  };

  const getMarkupListAffectingCount = () => {
    const payloaddata = Array.from({ length: noOfMarkupFields }, (_, index) => {
      const selectedCategories = selectedCategoryOptionsList[index] || [];

      return selectedCategories?.map((category) => ({
        category: category.value,
        margin: rowValues[index],
      }));
    });

    const payload = payloaddata.map((subarray, index) => ({
      locationId: locId,
      orgId: orgId,
      marginType: '%',
      marginBasedOn: 'pp',
      margin: rowValues[index],
      createdBy: createdById,
      createdByName: user,
      labelInUse: true,
      categories: subarray.map((item) => item.category),
    }));

    markUpListAffectingCount(payload)
      .then((res) => {
        const categoryData = res.data.data.data.map((item) => ({
          category: item.categories.join(' '),
          totalProducts: item.totalProducts,
          totalBatches: item.totalBatches,
        }));
        setMarkupAffectedCountData(categoryData);
      })
      .catch((err) => {});
  };

  const getMarkDowListAffectingCount = () => {
    const payload = formData.map((data) => ({
      locationId: locId,
      orgId: orgId,
      margin: data.updatedMargin,
      minMargin: data.MarginFrom,
      maxMargin: data.MarginTo,
      marginType: '%',
      marginBasedOn: 'mrp',
      createdBy: createdById,
      createdByName: user,
      labelInUse: true,
    }));
    markUDownListAffectingCount(payload)
      .then((res) => {
        const transformedData = res.data.data.data.map((item) => ({
          totalProducts: item.totalProducts,
          totalBatches: item.totalBatches,
          margin: item.margin,
          minMargin: item.minMargin,
          maxMargin: item.maxMargin,
        }));
        setMarkdownAffectedCountData(transformedData);
      })
      .catch((err) => {});
  };

  const getCustomAffectingCount = () => {
    const payload = {
      locationId: locId,
      orgId: orgId,
      // marginType: '%',
      // marginBasedOn: customStatus === 'MARKUP' ? 'pp' : 'mrp',
      // createdBy: createdById,
      // createdByName: user,
      gtins: scanBarCode?.length > 0 ? scanBarCode : barcodes,
    };
    CustomAffectingCount(payload)
      .then((res) => {
        SetErrmsg(
          `There will be ${res?.data?.data?.data?.totalProducts || 'NA'} Products of ${
            res?.data?.data?.data?.totalBatches || 'NA'
          } Batches Affected`,
        );
      })
      .catch((err) => {});
  };

  const gettMarkupAffectCount = () => {
    const payload = {
      locationId: locId,
      orgId: orgId,
      margin: markupMarginValues,
      marginType: '%',
      marginBasedOn: 'pp',
      createdBy: createdById,
      createdByName: user,
      labelInUse: true,
      labelType: 'MARKUP',
      // "modifiedBy": "string",
      categories: [selectedCategoryOptions?.value],
    };

    markUpAffectingCount(payload)
      .then((res) => {
        setAffectedMarkupCount(res?.data?.data?.data);
      })
      .catch((err) => {});
  };

  const getMarkDownAffectCount = () => {
    const payload = {
      locationId: locId,
      orgId: orgId,
      margin: updatedMargin,
      minMargin: MarginFrom,
      maxMargin: MarginTo,
      marginType: '%',
      marginBasedOn: 'mrp',
      createdBy: createdById,
      createdByName: user,
      labelInUse: true,
      labelType: 'MARKDOWN',

      // "modifiedBy": "string",
      // "categories": [
      //   "string"
      // ],
    };
    markUDownAffectingCount(payload)
      .then((res) => {
        setAffectedMarkupCount(res?.data?.data?.data);
      })
      .catch((err) => {});
  };

  const saveCustomPriceEdit = () => {
    const payload = {
      locationId: locId,
      orgId: orgId,
      marginType: '%',
      marginBasedOn: customStatus === 'MARKUP' ? 'pp' : 'mrp',
      margin: customMargin,
      // createdBy: createdById,
      // createdByName: user,
      gtins: scanBarCode?.length > 0 ? scanBarCode : barcodes,
    };
    createCustomPriceEdit(payload)
      .then((res) => {
        setOpen(false);
        setCustomSaveReload(!customSaveReload);
      })
      .catch((err) => {});
    setOpen(false);
  };

  const saveMarkDownPriceEdit = () => {
    setShowSpinner(true);

    const payload = formData
      .map((data, index) => {
        if (selectedOptions[index] === 'applyNow') {
          return {
            locationId: locId,
            orgId: orgId,
            margin: data.updatedMargin,
            minMargin: data.MarginFrom,
            maxMargin: data.MarginTo,
            marginType: '%',
            marginBasedOn: 'mrp',
            createdBy: createdById,
            createdByName: user,
            labelInUse: true,
          };
        } else {
          return null;
        }
      })
      .filter((item) => item !== null);
    if (payload && payload.length > 0) {
      createMarkDownPriceEdit(payload)
        .then((res) => {
          onMasterChange('MASTER');
          masterClose();
          setFormData([]);
          setNoOfFileds(1);
          setShowSpinner(false);
        })
        .catch((err) => {});
    }
  };

  const saveMarkUpPriceEdit = () => {
    setShowSpinner(true);
    const payloaddata = Array.from({ length: noOfMarkupFields }, (_, index) => {
      // selectedOptions

      if (selectedOptions[index] === 'applyNow') {
        var selectedCategories = selectedCategoryOptionsList[index];
      } else {
        var selectedCategories = [];
      }

      return selectedCategories.map((category) => ({
        category: category.value,
        margin: rowValues[index],
      }));
    });

    const payload = payloaddata
      .map((subarray, index) => {
        if (subarray.length === 0) {
          return null;
        }

        return {
          locationId: locId,
          orgId: orgId,
          marginType: '%',
          marginBasedOn: 'pp',
          margin: rowValues[index],
          createdBy: createdById,
          createdByName: user,
          labelInUse: true,
          categories: subarray?.map((item) => item?.category),
        };
      })
      .filter(Boolean);
    if (payload && payload.length > 0) {
      createMarkUpPriceEdit(payload)
        .then((res) => {
          onMasterChange('MASTER');
          masterClose();
          setSelectedCategoryOptionsList([]);
          setRowValues([]);
          setNoOfMarkupfields(1);
          setShowSpinner(false);
        })
        .catch((err) => {});
    }
  };

  const saveMarkupApplyLater = () => {
    setShowSpinner(true);
    const payloaddata = Array.from({ length: noOfMarkupFields }, (_, index) => {
      // selectedOptions

      if (selectedOptions[index] === 'applyLater') {
        var selectedCategories = selectedCategoryOptionsList[index];
      } else {
        var selectedCategories = [];
      }

      return selectedCategories?.map((category) => ({
        category: category.value,
        margin: rowValues[index],
      }));
    });

    const payload = payloaddata
      .map((subarray, index) => {
        if (subarray.length === 0) {
          return null;
        }

        return {
          locationId: locId,
          orgId: orgId,
          marginType: '%',
          marginBasedOn: 'pp',
          margin: rowValues[index],
          createdBy: createdById,
          createdByName: user,
          categories: subarray.map((item) => item.category),
        };
      })
      .filter(Boolean);

    if (payload && payload.length > 0) {
      markupApplyLater(payload)
        .then((res) => {
          onMasterChange('MASTER');
          setSelectedCategoryOptionsList([]);
          setRowValues([]);
          setNoOfMarkupfields(1);
          setShowSpinner(false);
          masterClose();
        })
        .catch((err) => {});
    }
  };
  const saveMarkdownApplyLater = () => {
    setShowSpinner(true);

    const payload = formData
      .map((data, index) => {
        if (selectedOptions[index] === 'applyLater') {
          return {
            locationId: locId,
            orgId: orgId,
            margin: data.updatedMargin,
            minMargin: data.MarginFrom,
            maxMargin: data.MarginTo,
            marginType: '%',
            marginBasedOn: 'mrp',
            createdBy: createdById,
            createdByName: user,
            labelInUse: false,
          };
        } else {
          return null;
        }
      })
      .filter((item) => item !== null);
    if (payload && payload.length > 0) {
      markdownApplyLater(payload)
        .then((res) => {
          onMasterChange('MASTER');
          masterClose();
          setFormData([]);
          setNoOfFileds(1);
          setShowSpinner(false);
        })
        .catch((err) => {});
    }
  };

  const callingCreateMarkup = () => {
    saveMarkUpPriceEdit();
    saveMarkupApplyLater();
  };

  const callingCreateMarkDown = () => {
    saveMarkDownPriceEdit();
    saveMarkdownApplyLater();
  };
  const percentageRanges = [];

  for (let i = 0; i <= 95; i += 5) {
    const value = `${i} - ${i + 5}`;
    const label = `${i} - ${i + 5} %`;
    percentageRanges.push({ value, label });
  }

  const handleMarginFromChange = (e, index) => {
    const updatedFormData = [...formData];
    if (!updatedFormData[index]) {
      updatedFormData[index] = {};
    }
    const newMarginFrom = e.target.value;
    if (hasOverlap(newMarginFrom, updatedFormData, index)) {
      updatedFormData[index].MarginFrom = newMarginFrom;
      setFormData(updatedFormData);
      setAlertmessage('Overlap detected for MarginFrom');
      setTimelineerror('error');
      setOpensnack(true);
    } else {
      updatedFormData[index].MarginFrom = newMarginFrom;
      setFormData(updatedFormData);
    }
  };

  const handleMarginToChange = (e, index) => {
    const updatedFormData = [...formData];
    if (!updatedFormData[index]) {
      updatedFormData[index] = {};
    }
    const newMarginTo = e.target.value;
    if (newMarginTo >= updatedFormData[index].MarginFrom) {
      if (hasOverlap(newMarginTo, updatedFormData, index)) {
        updatedFormData[index].MarginTo = newMarginTo;
        setFormData(updatedFormData);
        setAlertmessage('Overlap detected for MarginTo');
        setTimelineerror('error');
        setOpensnack(true);
      } else {
        updatedFormData[index].MarginTo = newMarginTo;
        setFormData(updatedFormData);
      }
    } else {
      updatedFormData[index].MarginTo = newMarginTo;
      setFormData(updatedFormData);
      setAlertmessage('MarginTo must be greater than or equal to MarginFrom');
      setTimelineerror('error');
      setOpensnack(true);
    }
  };

  const hasOverlap = (value, data, currentIndex) => {
    const newValue = parseFloat(value);
    for (let i = 0; i < data.length; i++) {
      if (i !== currentIndex) {
        const existingRange = {
          MarginFrom: parseFloat(data[i].MarginFrom),
          MarginTo: parseFloat(data[i].MarginTo),
        };

        if (newValue >= existingRange.MarginFrom && newValue <= existingRange.MarginTo) {
          return true;
        }
      }
    }
    return false;
  };

  const isMobileDevice = isSmallScreen();

  // filters code for custom price edit

  // to manage filters applied state for custom price edit filters
  const [filtersAppliedCustomPriceEdit, setFiltersAppliedCustomPriceEdit] = useState(0);
  const [filterStateCustomPriceEdit, setFilterStateCustomPriceEdit] = useState({
    marginType: 0,
    margin: 0,
    category: 0,
    productStatus: 0,
    brand: 0,
  });
  //to check if clear button is clicked on filter
  const [isClearClicked, setIsClearClicked] = useState(false);

  // Margin Type, Margin, Category, Product, Brand
  const marginTypeSelect = (
    <>
      <SoftSelect
        // menuPortalTarget={document.body}
        id="status"
        placeholder="Select Margin Type"
        options={[
          { value: 'MARK UP', label: 'MARKUP' },
          { value: 'MARK DOWN', label: 'MARKDOWN' },
        ]}
        value={markValue || ''}
        onChange={(option) => {
          setmarkValue(option);
          if (filterStateCustomPriceEdit['marginType'] === 0) {
            setFiltersAppliedCustomPriceEdit((prev) => prev + 1);
            setFilterStateCustomPriceEdit({ ...filterStateCustomPriceEdit, marginType: 1 });
          }
        }}
      ></SoftSelect>
    </>
  );

  const marginSelect = (
    <>
      <SoftSelect
        // menuPortalTarget={document.body}
        placeholder="Select Margin"
        id="status"
        options={percentageRanges}
        value={marginValues || ''}
        onChange={(option) => {
          setMarginValues(option);
          if (filterStateCustomPriceEdit['margin'] === 0) {
            setFiltersAppliedCustomPriceEdit((prev) => prev + 1);
            setFilterStateCustomPriceEdit({ ...filterStateCustomPriceEdit, margin: 1 });
          }
        }}
      ></SoftSelect>
    </>
  );

  const categorySelect = (
    <>
      <Box>
        {/* <SoftSelect
        sx={{width:"100%"}}
        // menuPortalTarget={document.body}
        placeholder="Select Categories"
        options={categoriesList}
        value={customCategory || ''}
        isMulti={true}
        onChange={(e) => {
          setCustomCategory(e);
          if (filterStateCustomPriceEdit['category'] === 0) {
            setFiltersAppliedCustomPriceEdit((prev) => prev + 1);
            setFilterStateCustomPriceEdit({ ...filterStateCustomPriceEdit, category: 1 });
          }
        }}
      /> */}
        <Autocomplete
          // id="size-small-standard"
          id="multiple-limit-tags"
          // size="small"
          disableCloseOnSelect
          value={customCategory}
          options={categoriesList}
          getOptionLabel={(option) => option.label || ''}
          onChange={(e, v) => {
            setCustomCategory(v);
            if (filterStateCustomPriceEdit['category'] === 0) {
              setFiltersAppliedCustomPriceEdit((prev) => prev + 1);
              setFilterStateCustomPriceEdit({ ...filterStateCustomPriceEdit, category: 1 });
            }
          }}
          multiple
          limitTags={0}
          ListboxComponent={({ children, ...props }) => <List {...props}>{children}</List>}
          renderOption={(props, option, { selected }) => (
            <ListItem {...props}>
              <Checkbox checked={selected} />
              <ListItemText
                primary={textFormatter(option.label)}
                primaryTypographyProps={{ fontSize: '14px !important' }}
              />
            </ListItem>
          )}
          renderTags={() => null} // hides the selected option
          renderInput={(params) => (
            <TextField
              className="limit-tag"
              {...params}
              // placeholder="Select Categories"
              placeholder={
                customCategory === undefined || customCategory.length === 0
                  ? 'Select Categories'
                  : (customCategory.length === 1 && `${customCategory.length} category selected`) ||
                    `${customCategory.length} categories selected`
              }
              variant="outlined"
            />
          )}
        />
      </Box>
    </>
  );

  const productSelect = (
    <>
      <SoftSelect
        // menuPortalTarget={document.body}
        placeholder="Select Product Status"
        id="status"
        value={packagingType || ''}
        options={[
          { value: 'standard', label: 'Standard' },
          { value: 'weighingScale', label: 'Weighing Scale' },
        ]}
        onChange={(option) => {
          setPackagingType(option);
          if (filterStateCustomPriceEdit['productStatus'] === 0) {
            setFiltersAppliedCustomPriceEdit((prev) => prev + 1);
            setFilterStateCustomPriceEdit({ ...filterStateCustomPriceEdit, productStatus: 1 });
          }
        }}
      ></SoftSelect>
    </>
  );

  const brandSelect = (
    <>
      <SoftSelect
        // menuPortalTarget={document.body}
        placeholder="Select Brand"
        id="status"
        options={manufacturersList}
        value={selectedBrand || ''}
        onChange={(option) => {
          setselectedBrand(option);
          if (filterStateCustomPriceEdit['brand'] === 0) {
            setFiltersAppliedCustomPriceEdit((prev) => prev + 1);
            setFilterStateCustomPriceEdit({ ...filterStateCustomPriceEdit, brand: 1 });
          }
        }}
      ></SoftSelect>
    </>
  );

  // chipBoxes
  const filterChipBoxes = (
    <>
      {/* marginType  */}
      {filterStateCustomPriceEdit.marginType === 1 && (
        <Box className="singleChipDisplayBox">
          <ChipBoxHeading heading="Margin Type" />
          <Box className="insideSingleChipDisplayBox">
            <Chip
              label={markValue.label}
              onDelete={() => removeSelectedCustomPriceEditFilter('marginType')}
              deleteIcon={<CancelOutlinedIcon />}
              color="primary"
              variant="outlined"
            />
          </Box>
        </Box>
      )}

      {/* margin  */}
      {filterStateCustomPriceEdit.margin === 1 && (
        <Box className="singleChipDisplayBox">
          <ChipBoxHeading heading="Margin" />
          <Box className="insideSingleChipDisplayBox">
            <Chip
              label={marginValues.label}
              onDelete={() => removeSelectedCustomPriceEditFilter('margin')}
              deleteIcon={<CancelOutlinedIcon />}
              color="primary"
              variant="outlined"
            />
          </Box>
        </Box>
      )}

      {/* product status  */}
      {filterStateCustomPriceEdit.productStatus === 1 && (
        <Box className="singleChipDisplayBox">
          <ChipBoxHeading heading="Category" />
          <Box className="insideSingleChipDisplayBox">
            <Chip
              label={packagingType.label}
              onDelete={() => removeSelectedCustomPriceEditFilter('productStatus')}
              deleteIcon={<CancelOutlinedIcon />}
              color="primary"
              variant="outlined"
            />
          </Box>
        </Box>
      )}

      {/* brand  */}
      {filterStateCustomPriceEdit.brand === 1 && (
        <Box className="singleChipDisplayBox">
          <ChipBoxHeading heading="Brand" />
          <Box className="insideSingleChipDisplayBox">
            <Chip
              label={selectedBrand.label}
              onDelete={() => removeSelectedCustomPriceEditFilter('brand')}
              deleteIcon={<CancelOutlinedIcon />}
              color="primary"
              variant="outlined"
            />
          </Box>
        </Box>
      )}
    </>
  );

  // filter functions
  const removeSelectedCustomPriceEditFilter = (filterType) => {
    switch (filterType) {
      case 'marginType':
        setFiltersAppliedCustomPriceEdit((prev) => prev - 1);
        setFilterStateCustomPriceEdit({ ...filterStateCustomPriceEdit, marginType: 0 });
        setmarkValue();
        break;
      case 'margin':
        setFiltersAppliedCustomPriceEdit((prev) => prev - 1);
        setFilterStateCustomPriceEdit({ ...filterStateCustomPriceEdit, margin: 0 });
        setMarginValues();
        break;
      case 'category':
        setFiltersAppliedCustomPriceEdit((prev) => prev - 1);
        setFilterStateCustomPriceEdit({ ...filterStateCustomPriceEdit, category: 0 });
        setCustomCategory();
        break;
      case 'productStatus':
        setFiltersAppliedCustomPriceEdit((prev) => prev - 1);
        setFilterStateCustomPriceEdit({ ...filterStateCustomPriceEdit, productStatus: 0 });
        setPackagingType();
        break;
      case 'brand':
        setFiltersAppliedCustomPriceEdit((prev) => prev - 1);
        setFilterStateCustomPriceEdit({ ...filterStateCustomPriceEdit, brand: 0 });
        setselectedBrand();
        break;
      default:
        return;
    }
  };

  // clear custom price edit filter
  const handleClearCustomPriceEditFilter = () => {
    setselectedBrand();
    setPackagingType();
    setCustomCategory([]);
    setMaxMargin('');
    setMinMargin('');
    setMarginValues();
    setmarkValue();
    setSearchProductData();
    //reset the setFiltersAppliedCustomPriceEdit = 0
    setFiltersAppliedCustomPriceEdit(0);
    // reset setFilterStateCustomPriceEdit
    setFilterStateCustomPriceEdit({
      marginType: 0,
      margin: 0,
      category: 0,
      productStatus: 0,
      brand: 0,
    });

    //set the isClearClicked to true
    setIsClearClicked(true);
  };

  //run this function when apply button on filter is clicked
  const applyCustomPriceEditFilter = () => {
    const categoryValues = customCategory?.map((category) => category.value);
    const filterPayload = {
      pageNumber: paginationState.page - 1,
      pageSize: paginationState.pageSize,
      locationId: locId,
      orgId: orgId,
      minMargin: minMargin,
      maxMargin: maxMargin,
      packagingType: packagingType?.value,
    };
    if (markValue) {
      filterPayload.marginBasedOn = markValue?.value === 'MARK DOWN' ? 'mrp' : 'pp';
    }
    if (selectedBrand) {
      filterPayload.brands = [selectedBrand?.value];
    }
    if (vendorid) {
      filterPayload.vendors = [vendorid];
    }
    if (categoryValues) {
      filterPayload.categories = categoryValues;
    }

    customProductFilter(filterPayload)
      .then((res) => {
        const filterData = res.data.data.data.data?.map((item, index) => {
          return {
            id: index,
            barcode: item?.gtin || '',
            title: item ? textFormatter(item.itemName) : '',
            mrp: item?.mrp || 0,
            sellingprice: item?.sellingPrice || 0,
            margin: (item?.mrp || 0) - (item?.sellingPrice || 0),
          };
        });
        setTotalPages(res?.data?.data?.data?.totalResult);

        setCustomRowData(filterData || []);
      })
      .catch((err) => {});
  };

  // select boxes array to pass as prop to Filter component
  const selectBoxArray = [categorySelect, marginTypeSelect, marginSelect, productSelect, brandSelect];

  useEffect(() => {
    if (customCategory === undefined || customCategory.length === 0) {
      // clear setfilter
      if (filterStateCustomPriceEdit['category'] !== 0) {
        setFiltersAppliedCustomPriceEdit((prev) => prev - 1);
        setFilterStateCustomPriceEdit({ ...filterStateCustomPriceEdit, category: 0 });
      }
    }
  }, [customCategory]);

  // to run when clear button in filter is clicked
  useEffect(() => {
    if (isClearClicked) {
      applyCustomPriceEditFilter();
      setIsClearClicked(false);
    }
  }, [isClearClicked]);

  return (
    <DashboardLayout>
      {!isMobileDevice && <DashboardNavbar />}
      {isMobileDevice && (
        <SoftBox className="navbar-main-div-mob-bg po-box-shadow nav-pos-mob">
          <MobileNavbar title={'Bulk Price Edit'} />
        </SoftBox>
      )}
      <Snackbar open={opensnack} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={timelinerror} sx={{ width: '100%' }}>
          {alertmessage}
        </Alert>
      </Snackbar>

      <Box
        // className="table-css-fix-box-scroll-vend"
        className="search-bar-filter-and-table-container"
        sx={{
          // boxShadow: 'rgba(37, 37, 37, 0.126) 0px 5px 50px',
          position: 'relative',
          marginBottom: '20px !important',
        }}
      >
        <SoftBox
          className="search-bar-filter-container"
          style={{
            marginBottom: tabs.tab1 && '15px',
          }}
        >
          <Box className="tabs" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <SoftBox style={{ display: 'flex' }}>
              <SoftTypography
                className={tabs.tab1 ? 'filter-div-tag' : 'filter-div-paid'}
                varient="h6"
                // onClick={() => changesTab(true, false)}
                onClick={() => handleTabClick('tab1')}
                sx={{ color: '#ffffff', borderBottomColor: 'rgb(0,100,254)', cursor: 'pointer' }}
              >
                Master Details
              </SoftTypography>
              <SoftTypography
                className={tabs.tab2 ? 'filter-div-tag mange' : 'filter-div-paid'}
                varient="h6"
                // onClick={() => changesTab(false, true)}
                onClick={() => {
                  handleTabClick('tab2');
                  fetchCustomLogs();
                }}
                sx={{
                  color: '#ffffff',
                  borderBottomColor: 'rgb(0,100,254)',
                  marginLeft: '2rem',
                  width: '100px',
                  cursor: 'pointer',
                }}
              >
                Custom Log
              </SoftTypography>
            </SoftBox>

            <SoftBox className="content-center">
              <SoftButton
                variant="insideHeader"
                color="white"
                style={{
                  marginInline: '5px',
                  //  marginBottom: '10px'
                }}
                onClick={() => {
                  onMasterChange('MASTER');
                  handleTabClick('tab1');
                }}
              >
                {' '}
                <EditIcon style={{ marginRight: '1rem' }} /> Master
              </SoftButton>

              <SoftButton
                variant="solidWhiteBackground"
                color="white"
                style={{
                  marginInline: '5px',
                  //  marginBottom: '10px'
                }}
                onClick={() => {
                  onMasterChange('CUSTOM');
                  handleTabClick('tab2');
                }}
              >
                {' '}
                + Custom
              </SoftButton>
            </SoftBox>
          </Box>

          {masterPriceEdit === 'CUSTOM' && showCustomLogs && (
            <Box sx={{ padding: '15px 15px 0px' }}>
              <Grid container spacing={2}>
                <Grid item lg={6.5} md={5.5} sm={6} xs={12} paddingLeft={'0 !important'}>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <SoftBox sx={{ position: 'relative', minWidth: '300px !important' }}>
                      {/* <SoftTypography htmlFor="status" style={{ fontSize: '0.8rem' }}>
                        Search Product
                      </SoftTypography> */}
                      <SoftInput
                        placeholder="Enter gtin"
                        icon={{ component: 'search', direction: 'left' }}
                        // value={searchProductData || ''}
                        value={searchProductData}
                        onChange={(e) => setSearchProductData(e.target.value)}
                      />
                      {searchProductData !== '' && <ClearSoftInput clearInput={handleClearSearchProductData} />}
                    </SoftBox>
                    <div>
                      <ScanAndAddProduct setScanBarCode={setScanBarCode} handleClickOpen={handleClickOpen} />{' '}
                    </div>
                  </div>
                </Grid>
                <Grid item lg={5.5} md={3.5} sm={6} xs={12}>
                  {/* filter  */}
                  <SoftBox style={{ display: 'flex', justifyContent: 'right' }}>
                    <Filter
                      filterChipBoxes={filterChipBoxes}
                      filtersApplied={filtersAppliedCustomPriceEdit}
                      selectBoxArray={selectBoxArray}
                      handleApplyFilter={applyCustomPriceEditFilter}
                      handleClearFilter={handleClearCustomPriceEditFilter}
                    />
                  </SoftBox>
                </Grid>
              </Grid>
            </Box>
          )}
        </SoftBox>
        {/* {masterPriceEdit === 'CUSTOM' && showCustomLogs && ()} */}
        {/* custom log */}
        {tabs.tab2 && (
          <SoftBox>
            {/* <Box className="header-bulk-price-edit">
              <Box className="filter">
                <Grid container spacing={2}>
                  <Grid item lg={2.5} md={4} sm={6} xs={12}>
                    <Box>
                      <SoftSelect
                        placeholder="Filter Product By"
                        value={filtProduct}
                        options={[
                          { value: 'category', label: 'Category' },
                          { value: 'manufacturer', label: 'Manufacturer' },
                          { value: 'product', label: 'Product' },
                        ]}
                        onChange={(option) => filterProductBy(option)}
                        menuPortalTarget={document.body}
                      />
                    </Box>
                  </Grid>
                  <Grid item lg={2.5} md={4} sm={6} xs={12}>
                    <Box>
                      <SoftSelect
                        placeholder="Filter Edited By"
                        value={editedBy}
                        options={editByList}
                        onChange={(option) => handleEditedBy(option)}
                        menuPortalTarget={document.body}
                      />
                    </Box>
                  </Grid>
                  <Grid item lg={2.5} md={4} sm={6} xs={12}>
                    <Box>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          views={['year', 'month', 'day']}
                          label="Start Date"
                          value={startDate}
                          onChange={(date) => {
                            setStartDate(date.$d.toISOString());
                          }}
                          sx={{
                            width: '100%',
                            '& .MuiInputLabel-formControl': {
                              fontSize: '0.8rem',
                              top: '-0.4rem',
                              color: '#344767',
                            },
                          }}
                        />
                      </LocalizationProvider>
                    </Box>
                  </Grid>
                  <Grid item lg={2.5} md={4} sm={6} xs={12}>
                    <Box>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          views={['year', 'month', 'day']}
                          label="End Date"
                          value={endDate}
                          onChange={(date) => {
                            setEndDate(date.$d.toISOString());
                          }}
                          sx={{
                            width: '100%',
                            '& .MuiInputLabel-formControl': {
                              fontSize: '0.8rem',
                              top: '-0.4rem',
                              color: '#344767',
                            },
                          }}
                        />
                      </LocalizationProvider>
                    </Box>
                  </Grid>
                  <Grid item letterSpacing={2}>
                    <Box>
                      <SoftButton onClick={handleClear} className="vendor-second-btn">
                        Clear
                      </SoftButton>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
              <Box
                className="header-new-btn"
                sx={{
                  display:
                    permissions?.RETAIL_Products?.WRITE ||
                    permissions?.WMS_Products?.WRITE ||
                    permissions?.VMS_Products?.WRITE
                      ? 'block'
                      : 'none',
                }}
              >
                <SoftButton
                  color="info"
                  // variant="gradient"
                  onClick={() => setOpenModalBulk(true)}
                  className="vendor-add-btn bpe-btn"
                  style={{ marginTop: '13px !important' }}
                >
                  + New
                </SoftButton>
               
              </Box>
            </Box> */}
            {/* <SoftButton
                  color="info"
                  style={{ marginInline: '5px', marginTop: '13px' }}
                  onClick={() => onMasterChange('CUSTOM')}
                >
                  {' '}
                  + Custom
                </SoftButton> */}
            {masterPriceEdit === 'CUSTOM' && showCustomLogs && (
              <SoftBox style={{ padding: '0px 20px' }}>
                <SoftBox style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <SoftTypography style={{ fontSize: '1.1rem', margin: '15px 0px' }}>Custom Price Edit</SoftTypography>
                  <SoftBox style={{ maxHeight: '40px !important' }}>
                    <SoftButton onClick={handleClickOpen} color="info" style={{ height: '40px !important' }}>
                      Edit
                    </SoftButton>
                  </SoftBox>
                </SoftBox>

                <Box sx={{ width: '100%' }}>
                  <div
                    style={{
                      height: featureSettings !== null && featureSettings['BULK_PRICE_EDIT'] == 'FALSE' ? 525 : null,
                      width: '100%',
                      position: 'relative',
                    }}
                  >
                    {featureSettings !== null && featureSettings['BULK_PRICE_EDIT'] == 'FALSE' ? <UpgradePlan /> : null}
                    <DataGrid
                      rows={customRows}
                      columns={customColumns}
                      getRowId={(row) => row?.id}
                      paginationMode="server"
                      pagination={true}
                      onPageChange={(newPage) => {
                        setPaginationState((old) => ({ ...old, page: newPage + 1 }));
                      }}
                      checkboxSelection
                      pageSize={paginationState.pageSize}
                      page={paginationState.page - 1}
                      rowsPerPageOptions={[]}
                      // totalPages={totalPages}
                      rowCount={parseInt(totalPages || 0)}
                      autoHeight
                      selectionModel={selectionModel}
                      onSelectionModelChange={(newSelection) => {
                        setSelectionModel(newSelection);
                        const selectedData = customRows.filter((row) => newSelection.includes(row.id));
                        setSelectedRowsData(selectedData);
                      }}
                    />
                  </div>
                </Box>

                <div>
                  <Dialog
                    open={open}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={handleClose}
                    aria-describedby="alert-dialog-slide-description"
                    PaperProps={{ style: { overflowY: 'visible' } }}
                    sx={{
                      '& .MuiDialog-container': {
                        '& .MuiPaper-root': {
                          width: '100%',
                          maxWidth: '450px',
                          minHeight: '250px',
                        },
                      },
                    }}
                  >
                    <DialogTitle>
                      {' '}
                      <SoftTypography style={{ fontsize: '0.9rem' }}>Custom Edit Price</SoftTypography>{' '}
                    </DialogTitle>
                    <DialogContent
                      sx={{
                        zIndex: 100,
                      }}
                    >
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {/* <SoftTypography htmlFor="status" style={{ fontSize: '0.8rem' }}>
                Vendor:
              </SoftTypography> */}
                        <SoftSelect
                          // menuPortalTarget={document.body}
                          id="status"
                          options={[
                            { value: 'MARKUP', label: 'MARKUP' },
                            { value: 'MARKDOWN', label: 'MARKDOWN' },
                          ]}
                          onChange={(option) => setCustomStatus(option.value)}
                        ></SoftSelect>
                      </div>
                      <FormField
                        autoFocus
                        margin="dense"
                        label="Margin"
                        type="text"
                        // value={name}
                        icon={{
                          component: '%',
                          direction: 'right',
                        }}
                        onChange={(e) => setCustomMargin(e.target.value)}
                        maxWidth="sm"
                        fullWidth
                        required
                        // style={{ marginBottom: '35px' }}
                      />
                      {errMsg && (
                        <center>
                          <SoftBox
                            style={{ backgroundColor: '#f5f5f5', margin: '15px', borderRadius: '8px', padding: '10px' }}
                          >
                            <SoftTypography style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>
                              {errMsg}{' '}
                            </SoftTypography>
                          </SoftBox>
                        </center>
                      )}
                    </DialogContent>
                    <DialogActions style={{ zIndex: 70 }}>
                      <SoftButton
                        variant={buttonStyles.secondaryVariant}
                        className="outlined-softbutton"
                        onClick={handleClose}
                      >
                        Cancel
                      </SoftButton>
                      {errMsg ? (
                        <SoftButton
                          variant={buttonStyles.primaryVariant}
                          className="contained-softbutton"
                          onClick={handleConfirm}
                        >
                          Confirm
                        </SoftButton>
                      ) : (
                        <SoftButton
                          variant={buttonStyles.primaryVariant}
                          className="contained-softbutton"
                          onClick={ShowErrMsg}
                        >
                          Save
                        </SoftButton>
                      )}
                    </DialogActions>
                  </Dialog>
                </div>
              </SoftBox>
            )}

            {tabs.tab1 && <Divider sx={{ margin: 0, marginBottom: '10px' }} />}
            <Box
              sx={
                {
                  // marginTop: '2rem',
                }
              }
            >
              {errorComing ? (
                <SoftBox className="No-data-text-box">
                  <SoftBox className="src-imgg-data">
                    <img className="src-dummy-img" src={noDatagif} />
                  </SoftBox>

                  <h3 className="no-data-text-I">NO DATA FOUND</h3>
                </SoftBox>
              ) : (
                <div style={{ height: !loader && !showCustomLogs ? '525px' : '100px', width: '100%' }}>
                  {featureSettings !== null && featureSettings['BULK_PRICE_EDIT'] == 'FALSE' ? <UpgradePlan /> : null}
                  {loader && (
                    <Box
                      sx={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Spinner />
                    </Box>
                  )}
                  {!loader && !showCustomLogs && (
                    // <DataGrid
                    //   rows={customlogRows}
                    //   columns={customLogColumns}
                    //   initialState={{
                    //     pagination: {
                    //       paginationModel: {
                    //         pageSize: 10,
                    //       },
                    //     },
                    //   }}
                    //   getRowId={(row) => row.mplId}
                    //   pageSizeOptions={[]}
                    //   // checkboxSelection
                    //   disableRowSelectionOnClick
                    //   hideFooterPagination
                    // />
                    <DataGrid
                    rows={customlogRows}
                    columns={customLogColumns}
                    paginationMode="server"
                    pageSize={customLogPagination?.pageSize || 0}
                    page={customLogPagination.page - 1} 
                    rowCount={parseInt(customLogPagination?.totalResult || 0)}
                    onPageChange={handlePageChange}
                   // loading={loading}
                    getRowId={(row) => row.mplId}
                    disableRowSelectionOnClick
                  />
                  )}
                </div>
              )}
            </Box>
            <Modal
              open={openModalBulk}
              onClose={handleCloseModalBulk}
              aria-labelledby="parent-modal-title"
              aria-describedby="parent-modal-description"
            >
              <Box
                sx={{
                  width: '40vw',
                  height: '70vh',
                  backgroundColor: '#fff',
                  margin: 'auto',
                  marginTop: '6rem',
                  borderRadius: '1rem',
                  padding: '2rem',
                  boxSizing: 'border-box',
                  position: 'relative',
                }}
                className="modal-box-bulk"
              >
                <Box className="product-by">
                  <SoftTypography
                    component="label"
                    variant="h6"
                    fontWeight="light"
                    textTransform="capitalize"
                    style={{ marginTop: '0.8rem' }}
                  >
                    Bulk Price Edit By
                  </SoftTypography>

                  <SoftSelect
                    label="Select Product By"
                    options={[
                      { value: 'category', label: 'Category' },
                      { value: 'manufacturer', label: 'Manufacturer' },
                      { value: 'product', label: 'Product' },
                    ]}
                    onChange={(option) => handleProductBy(option)}
                  />
                </Box>

                {category ? (
                  <Box className="category">
                    <SoftTypography
                      component="label"
                      variant="h6"
                      fontWeight="light"
                      textTransform="capitalize"
                      style={{ marginTop: '0.8rem' }}
                    >
                      Category
                    </SoftTypography>
                    <SoftSelect
                      placeholder="Select Categories"
                      options={categoriesList}
                      isMulti={true}
                      onChange={handleSelectCategory}
                    />
                  </Box>
                ) : null}

                {manufacturer ? (
                  <Box className="manufacturers">
                    <SoftTypography
                      component="label"
                      variant="h6"
                      fontWeight="light"
                      textTransform="capitalize"
                      style={{ marginTop: '0.8rem' }}
                    >
                      Manufacturer
                    </SoftTypography>
                    <SoftSelect
                      placeholder="Select Manufacturers"
                      options={manufacturersList}
                      isMulti={true}
                      onChange={handleSelectManufacturer}
                    />
                  </Box>
                ) : null}

                {product ? (
                  <Box className="product">
                    <SoftTypography
                      component="label"
                      variant="h6"
                      fontWeight="light"
                      textTransform="capitalize"
                      style={{ marginTop: '0.8rem' }}
                    >
                      Product
                    </SoftTypography>
                    <Autocomplete
                      multiple
                      options={prodOptions}
                      getOptionLabel={(option) => option.label}
                      onChange={(e, v) => handleAutoComplete(v)}
                      // isOptionEqualToValue={(option, value) => option.value === value.value}
                      style={{ width: '100%' }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          // value={searchProduct}
                          onChange={(e) => handleChange(e)}
                          placeholder="Search Product"
                          variant="outlined"
                          fullWidth
                        />
                      )}
                    />
                  </Box>
                ) : null}

                <Box className="sale-price">
                  <SoftTypography
                    component="label"
                    variant="h6"
                    fontWeight="light"
                    textTransform="capitalize"
                    style={{ marginTop: '0.8rem' }}
                  >
                    Margin
                  </SoftTypography>
                  <Box>
                    <SoftBox className="boom-box">
                      <SoftBox className="boom-soft-box">
                        <SoftSelect
                          className="boom-soft-select"
                          options={[
                            { value: '%', label: '%' },
                            { value: 'Rs', label: 'Rs' },
                          ]}
                          onChange={(option) => handleSalePriceOption(option)}
                        />
                      </SoftBox>
                      <SoftInput className="boom-input" type="number" onChange={handleSalePriceVal} />
                    </SoftBox>
                  </Box>
                </Box>

                <Box className="cancel-save-btn">
                  <SoftButton
                    sx={{
                      marginRight: '0.8rem',
                    }}
                    onClick={handleCloseModalBulk}
                    variant={buttonStyles.secondaryVariant}
                    className="outlined-softbutton"
                  >
                    cancel
                  </SoftButton>
                  {loader ? (
                    <Spinner />
                  ) : (
                    <SoftButton
                      //  variant="gradient"
                      color="info"
                      onClick={handleSave}
                      variant={buttonStyles.primaryVariant}
                      className="vendor-add-btn contained-softbutton"
                    >
                      save
                    </SoftButton>
                  )}
                </Box>
              </Box>
            </Modal>
            <Modal
              open={openModalFilter}
              onClose={handleCloseModalFilter}
              aria-labelledby="parent-modal-title"
              aria-describedby="parent-modal-description"
            >
              <Box
                sx={{
                  width: '40vw',
                  height: '70vh',
                  backgroundColor: '#fff',
                  margin: 'auto',
                  marginTop: '6rem',
                  borderRadius: '1rem',
                  padding: '2rem',
                  boxSizing: 'border-box',
                  position: 'relative',
                }}
                className="modal-box-filter"
              ></Box>
            </Modal>
          </SoftBox>
        )}
        {masterPriceEdit === '' && (
          <>
            <center style={{ height: '50vh', marginTop: '100px' }}>
              <SoftTypography style={{ fontSize: '1.3rem' }}>
                Hey , there is no master price edit <br />
                <SoftButton
                  variant={buttonStyles.primaryVariant}
                  className="contained-softbutton"
                  onClick={() => onMasterChange('MASTER')}
                  style={{ marginTop: '8px' }}
                >
                  {' '}
                  Create
                </SoftButton>{' '}
              </SoftTypography>
            </center>
          </>
        )}

        {/* master tab to show details */}
        {tabs.tab1 && masterPriceEdit === 'MASTER' && showMasterDetails && (
          <MasterPriceEditDetails onMasterChange={onMasterChange} markDownlogs={markDownlogs} markUplogs={markUplogs} markDownpg={markDownpg} reloadTable={reloadTable} setReloadTable={setReloadTable} masterLogPagination={masterLogPagination} setMasterLogPagination={setMasterLogPagination} />
        )}

        {/* master tab */}
        {tabs.tab1 && masterPriceEdit === 'MASTER' && !showMasterDetails && (
          <SoftBox style={{ padding: '20px' }}>
            <SoftTypography style={{ fontSize: '1.2rem', marginLeft: '15px' }}>Pricing Master</SoftTypography>
            <Divider sx={{ margin: 0, marginBottom: '10px' }} />

            <Box style={{ marginBottom: '10px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', width: '250px', marginLeft: '15px' }}>
                <SoftTypography htmlFor="status" style={{ fontSize: '0.8rem' }}></SoftTypography>
                <SoftSelect
                  placeholder="Select Mark Up/Down"
                  menuPortalTarget={document.body}
                  value={markStatus}
                  id="status"
                  options={[
                    { value: 'MARKUP', label: 'Mark Up' },
                    { value: 'MARKDOWN', label: 'Mark Down' },
                  ]}
                  onChange={(option) => setMarkStatus(option.label)}
                ></SoftSelect>
              </div>
            </Box>
            <br />
            {markStatus && (
              <>
                <SoftTypography
                  style={{ fontSize: '1rem', marginLeft: '15px', fontWeight: '400', marginBottom: '15px' }}
                >
                  {markStatus} Based on {markStatus === 'Mark Up' && 'Purchase Price'}{' '}
                  {markStatus === 'Mark Down' && 'MRP'}
                </SoftTypography>{' '}
              </>
            )}

            {/* <SoftTypography style={{ fontSize: '1rem', marginLeft: '15px', marginTop: '15px' }}>
              Purchase Margin
            </SoftTypography> */}
            {markStatus === 'Mark Up' && (
              <>
                {Array.from({ length: noOfMarkupFields }).map((_, index) => (
                  <Grid
                    container
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      gap: '10px',
                      marginTop: '8px',
                      marginLeft: '5px',
                      backgroundColor: 'ghostwhite',
                      borderRadius: '8px',
                      padding: '10px',
                    }}
                    key={index}
                  >
                    <Grid
                      item
                      md={6}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        minWidth: '225px',
                        // maxWidth: '600px',
                        // width:"100%",
                        marginLeft: '15px',
                      }}
                    >
                      {index === 0 ? (
                        <SoftTypography
                          htmlFor={`status-${index}`}
                          style={{ fontSize: '0.8rem', marginBottom: '4px', fontWeight: 'bold' }}
                        >
                          Category
                        </SoftTypography>
                      ) : (
                        <SoftTypography
                          htmlFor={`status-${index}`}
                          style={{ fontSize: '0.8rem', marginTop: '7px' }}
                        ></SoftTypography>
                      )}

                      {/* <SoftSelect
                        menuPortalTarget={document.body}
                        placeholder="Select Categories"
                        options={categoriesList}
                        value={selectedCategoryOptionsList[index]}
                        isMulti={true}
                        onChange={(selectedOptions) => handleSelectCategory(selectedOptions, index)}
                      /> */}

                      <Autocomplete
                        multiple
                        options={categoriesList}
                        onChange={(selectedOptions, newvalue) => handleSelectCategory(newvalue, index)}
                        value={selectedCategoryOptionsList[index]}
                        getOptionLabel={(option) => option.label}
                        filterSelectedOptions
                        renderInput={(params) => <TextField {...params} placeholder="Select Categories" />}
                      />
                    </Grid>{' '}
                    <Grid item style={{ display: 'flex', flexDirection: 'column', marginLeft: '1rem' }}>
                      <FormField
                        margin="dense"
                        label={index === 0 ? `${markStatus} value` : ''}
                        type="number"
                        icon={{
                          component: '%',
                          direction: 'right',
                        }}
                        placeholder="Mark Up Value"
                        value={rowValues[index]}
                        onChange={(e) => handleInputChange(e.target.value, index)}
                        maxWidth="sm"
                        fullWidth
                        style={{ maxWidth: '200px' }}
                        required
                      />
                    </Grid>
                    <SoftBox
                      style={{ marginTop: '20px', marginInline: '30px', marginLeft: 'auto' }}
                      onClick={() => handleDeleteRow(index)}
                    >
                      <SoftTypography style={{ cursor: 'pointer', fontSize: '0.9rem', color: 'red' }}>
                        {' '}
                        X{' '}
                      </SoftTypography>
                    </SoftBox>
                  </Grid>
                ))}

                <SoftBox style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <SoftTypography
                    className="add-more-text"
                    onClick={HandleAddmoreMarkup}
                    component="label"
                    variant="caption"
                    fontWeight="bold"
                    sx={{ marginLeft: '15px' }}
                  >
                    + Add More
                  </SoftTypography>

                  <SoftButton
                    variant={buttonStyles.primaryVariant}
                    className="contained-softbutton"
                    onClick={handleMasterOpen}
                    style={{ marginTop: '30px' }}
                  >
                    Next
                  </SoftButton>
                </SoftBox>
              </>
            )}

            {markStatus === 'Mark Down' && (
              <>
                {Array.from({ length: noOfFields }).map((_, index) => (
                  <SoftBox
                    key={index}
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      gap: '10px',
                      marginTop: '8px',
                      marginLeft: '5px',
                      backgroundColor: 'ghostwhite',
                      borderRadius: '8px',
                      padding: '10px',
                    }}
                  >
                    <SoftBox style={{ display: 'flex', flexDirection: 'column' }}>
                      <FormField
                        autoFocus
                        margin="dense"
                        label={index === 0 && 'Purchase Margin (From)'}
                        placeholder="Purchase Margin (From)"
                        type="number"
                        value={formData[index]?.MarginFrom || ''}
                        onChange={(e) => handleMarginFromChange(e, index)}
                        icon={{
                          component: '%',
                          direction: 'right',
                        }}
                        maxWidth="sm"
                        fullWidth
                        style={{ maxWidth: '200px' }}
                        required
                      />
                    </SoftBox>

                    <SoftTypography style={{ fontSize: '0.9rem', marginTop: '17px' }}>TO</SoftTypography>
                    <SoftBox style={{ display: 'flex', flexDirection: 'column' }}>
                      <FormField
                        margin="dense"
                        label={index === 0 && 'Purchase Margin (To)'}
                        placeholder="Purchase Margin (To)"
                        type="number"
                        value={formData[index]?.MarginTo || ''}
                        onChange={(e) => handleMarginToChange(e, index)}
                        icon={{
                          component: '%',
                          direction: 'right',
                        }}
                        maxWidth="sm"
                        style={{ maxWidth: '200px' }}
                        fullWidth
                        required
                      />
                    </SoftBox>

                    <SoftTypography style={{ fontSize: '0.9rem', marginTop: '17px' }}>IS</SoftTypography>
                    <SoftBox style={{ display: 'flex', flexDirection: 'column' }}>
                      <FormField
                        margin="dense"
                        label={index === 0 && `${markStatus} value`}
                        placeholder="Mark Down value"
                        type="number"
                        value={formData[index]?.updatedMargin || ''}
                        onChange={(e) => {
                          const updatedFormData = [...formData];
                          if (!updatedFormData[index]) {
                            updatedFormData[index] = {};
                          }
                          updatedFormData[index].updatedMargin = e.target.value;
                          setFormData(updatedFormData);
                        }}
                        icon={{
                          component: '%',
                          direction: 'right',
                        }}
                        maxWidth="sm"
                        fullWidth
                        style={{ maxWidth: '200px' }}
                        required
                      />
                    </SoftBox>
                    <SoftBox style={{ marginTop: '20px', marginLeft: '20px' }} onClick={() => handleDeleteRow(index)}>
                      <SoftTypography style={{ cursor: 'pointer', fontSize: '0.9rem', color: 'red' }}>
                        {' '}
                        X{' '}
                      </SoftTypography>
                    </SoftBox>
                  </SoftBox>
                ))}
                <SoftBox style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <SoftTypography
                    className="add-more-text"
                    onClick={HandleAddmore}
                    component="label"
                    variant="caption"
                    fontWeight="bold"
                    sx={{ marginLeft: '15px' }}
                  >
                    + Add More
                  </SoftTypography>

                  <SoftButton
                    variant={buttonStyles.primaryVariant}
                    className="contained-softbutton"
                    onClick={handleMasterOpen}
                    style={{ marginTop: '30px' }}
                  >
                    Next
                  </SoftButton>
                </SoftBox>
              </>
            )}

            <div>
              <Dialog
                open={masteropen}
                TransitionComponent={Transition}
                keepMounted
                onClose={masterClose}
                aria-describedby="alert-dialog-slide-description"
                PaperProps={{ style: { overflowY: 'visible' } }}
                sx={{
                  '& .MuiDialog-container': {
                    '& .MuiPaper-root': {
                      width: '100%',
                      maxWidth: '450px',
                      minHeight: '250px',
                    },
                  },
                }}
              >
                <DialogTitle>
                  {' '}
                  <SoftTypography style={{ fontSize: '0.91rem !important' }}>Master Price Edit</SoftTypography>{' '}
                </DialogTitle>
                <DialogContent
                  sx={{
                    zIndex: 100,
                  }}
                >
                  <center>
                    {markdownAffectedCountData?.map((categoryData, index) => (
                      <SoftBox
                        style={{
                          backgroundColor: 'white',
                          border: '1px solid #ccc',
                          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                          padding: '5px',
                          margin: '15px',
                          borderRadius: '8px',
                        }}
                      >
                        {' '}
                        <SoftTypography key={index} style={{ fontSize: '0.9rem' }}>
                          There will be {categoryData?.totalProducts} Products and {categoryData?.totalBatches} Batches
                          for Margin: {categoryData?.minMargin}-{categoryData?.maxMargin},
                          <br />
                          with Updated Margin: {categoryData?.margin}
                        </SoftTypography>
                        <center>
                          <RadioGroup
                            value={selectedOptions[index] || 'applyNow'}
                            onChange={(event) => handleOptionChange(event, index)}
                            row
                            style={{ display: 'flex', justifyContent: 'space-around' }}
                          >
                            <FormControlLabel value="applyNow" control={<Radio color="primary" />} label="Apply now" />
                            <FormControlLabel
                              value="applyLater"
                              control={<Radio color="primary" />}
                              label="Apply later"
                            />
                          </RadioGroup>
                        </center>
                      </SoftBox>
                    ))}
                    {(!markupAffectedCountData || markupAffectedCountData?.length === 0) &&
                      markStatus === 'Mark Up' && (
                        <SoftTypography
                          style={{
                            fontSize: '1rem',
                            backgroundColor: '#f0f0f0',
                            padding: '10px',
                            borderRadius: '5px',
                            boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.3)',
                            color: '#333',
                            textAlign: 'left',
                          }}
                        >
                          Fill All Required Fields
                        </SoftTypography>
                      )}
                    {(!markdownAffectedCountData || markdownAffectedCountData?.length === 0) &&
                      markStatus === 'Mark Down' && (
                        <SoftTypography
                          style={{
                            fontSize: '1rem',
                            backgroundColor: '#f0f0f0',
                            padding: '10px',
                            borderRadius: '5px',
                            boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.3)',
                            color: '#333',
                            textAlign: 'left',
                          }}
                        >
                          Fill All Required Fields
                        </SoftTypography>
                      )}
                    {markupAffectedCountData?.map((categoryData, index) => (
                      <SoftBox
                        style={{
                          backgroundColor: 'white',
                          border: '1px solid #ccc',
                          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                          padding: '5px',
                          margin: '15px',
                          borderRadius: '8px',
                        }}
                      >
                        <SoftTypography key={index} style={{ fontSize: '0.9rem' }}>
                          There will be {categoryData.totalProducts} products of {categoryData.totalBatches} Batches
                          Affected,
                          <br />
                          Confirm to Proceed for category:{' '}
                          <span
                            style={{
                              fontWeight: 'bold',
                              color: '#242625',
                              padding: '5px 10px',
                              borderRadius: '5px',
                            }}
                          >
                            {categoryData.category}
                          </span>
                        </SoftTypography>
                        <center>
                          <RadioGroup
                            value={selectedOptions[index] || 'applyNow'}
                            onChange={(event) => handleOptionChange(event, index)}
                            row
                            style={{ display: 'flex', justifyContent: 'space-around' }}
                          >
                            <FormControlLabel value="applyNow" control={<Radio color="primary" />} label="Apply now" />
                            <FormControlLabel
                              value="applyLater"
                              control={<Radio color="primary" />}
                              label="Apply later"
                            />
                          </RadioGroup>
                        </center>
                      </SoftBox>
                    ))}
                  </center>
                </DialogContent>
                <DialogActions style={{ zIndex: 70 }}>
                  <SoftButton
                    variant={buttonStyles.secondaryVariant}
                    className="outlined-softbutton"
                    onClick={masterClose}
                  >
                    Cancel
                  </SoftButton>
                  {showSpinner ? (
                    <Spinner size={'1.3rem'} />
                  ) : (
                    <SoftButton
                      variant={buttonStyles.primaryVariant}
                      className="contained-softbutton"
                      disabled={
                        markStatus === 'Mark Up'
                          ? !markupAffectedCountData || markupAffectedCountData?.length === 0
                          : !markdownAffectedCountData || markdownAffectedCountData?.length === 0
                      }
                      onClick={markStatus === 'Mark Up' ? callingCreateMarkup : callingCreateMarkDown}
                      // onClick={gettMarkupAffectCount}
                    >
                      Confirm
                    </SoftButton>
                  )}
                </DialogActions>
              </Dialog>
            </div>
          </SoftBox>
        )}

        <Divider sx={{ margin: 0, marginBottom: '10px' }} />

        {/* custom Render */}
        {/* {masterPriceEdit === 'CUSTOM' && (
          <SoftBox style={{ padding: '20px' }}>
<SoftBox style={{display:"flex", justifyContent:"space-between"}}>
<SoftTypography style={{ fontSize: '1.1rem', margin: '15px' }}>Custom</SoftTypography>

<SoftButton onClick={handleClickOpen} color="info" style={{float:"right" }}>
              Edit
            </SoftButton>
</SoftBox>
        
         
            <Box style={{ marginBottom: '10px', display: 'flex', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', flexDirection: 'column', width: '180px', marginLeft: '15px' }}>
                <SoftTypography htmlFor="status" style={{ fontSize: '0.8rem' }}>
                  Margin
                </SoftTypography>
                <SoftSelect
                  menuPortalTarget={document.body}
                  id="status"
                  options={[
                    { value: 'MARKUP', label: 'MARKUP' },
                    { value: 'MARKDOWN', label: 'MARKDOWN' },
                  ]}
                  onChange={(option) => setStatus(option.value)}
                ></SoftSelect>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', width: '180px', marginLeft: '15px' }}>
                <SoftTypography htmlFor="status" style={{ fontSize: '0.8rem' }}>
                  Category
                </SoftTypography>
                <SoftSelect
                  menuPortalTarget={document.body}
                  id="status"
                  options={categoriesList}
                  onChange={(option) => setStatus(option.value)}
                ></SoftSelect>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', width: '180px', marginLeft: '15px' }}>
                <SoftTypography htmlFor="status" style={{ fontSize: '0.8rem' }}>
                  Vendor
                </SoftTypography>
                <SoftSelect
                  menuPortalTarget={document.body}
                  id="status"
                  options={[
                    { value: 'MARKUP', label: 'MARKUP' },
                    { value: 'MARKDOWN', label: 'MARKDOWN' },
                  ]}
                  onChange={(option) => setStatus(option.value)}
                ></SoftSelect>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', width: '180px', marginLeft: '15px' }}>
                <SoftTypography htmlFor="status" style={{ fontSize: '0.8rem' }}>
                  Product
                </SoftTypography>
                <SoftSelect
                  menuPortalTarget={document.body}
                  id="status"
                  options={[
                    { value: 'MARKUP', label: 'MARKUP' },
                    { value: 'MARKDOWN', label: 'MARKDOWN' },
                  ]}
                  onChange={(option) => setStatus(option.value)}
                ></SoftSelect>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', width: '180px', marginLeft: '15px' }}>
                <SoftTypography htmlFor="status" style={{ fontSize: '0.8rem' }}>
                  Brand
                </SoftTypography>
                <SoftSelect
                  menuPortalTarget={document.body}
                  id="status"
                  options={[
                    { value: 'MARKUP', label: 'MARKUP' },
                    { value: 'MARKDOWN', label: 'MARKDOWN' },
                  ]}
                  onChange={(option) => setStatus(option.value)}
                ></SoftSelect>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', width: '180px', marginLeft: '15px' }}>
              <SoftTypography htmlFor="status" style={{ fontSize: '0.8rem' }}>
                Vendor:
              </SoftTypography>
              <SoftSelect
                menuPortalTarget={document.body}
                id="status"
                options={[
                  { value: 'MARKUP', label: 'MARKUP' },
                  { value: 'MARKDOWN', label: 'MARKDOWN' },
                ]}
                onChange={(option) => setStatus(option.value)}
              ></SoftSelect>
            </div>
            </Box>
          
            <Box sx={{ height: 400, width: '100%' }}>
              <DataGrid
                rows={Customrows}
                columns={customColumns}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 5,
                    },
                  },
                }}
                pageSizeOptions={[5]}
                checkboxSelection
                disableRowSelectionOnClick
                getRowId={(row) => row.barcode}
                className="data-grid-table-boxo"
              />
            </Box>
            <div>
              <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
                PaperProps={{ style: { overflowY: 'visible' } }}
                sx={{
                  '& .MuiDialog-container': {
                    '& .MuiPaper-root': {
                      width: '100%',
                      maxWidth: '450px',
                      minHeight: '250px',
                    },
                  },
                }}
              >
                <DialogTitle>
                  {' '}
                  <SoftTypography style={{ fontsize: '1rem' }}>Edit Price</SoftTypography>{' '}
                </DialogTitle>
                <DialogContent
                  sx={{
                    zIndex: 100,
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <SoftTypography htmlFor="status" style={{ fontSize: '0.8rem' }}>
                Vendor:
              </SoftTypography>
                    <SoftSelect
                      menuPortalTarget={document.body}
                      id="status"
                      options={[
                        { value: 'MARKUP', label: 'MARKUP' },
                        { value: 'MARKDOWN', label: 'MARKDOWN' },
                      ]}
                      onChange={(option) => setStatus(option.value)}
                    ></SoftSelect>
                  </div>
                  <FormField
                    autoFocus
                    margin="dense"
                    label="To"
                    type="text"
                    value={name}
                    onChange={(e) => Setname(e.target.value)}

                    maxWidth="sm"
                    fullWidth
                    required
                    style={{ marginBottom: '35px' }}
                  />
                  {errMsg && <center><SoftTypography style={{fontSize:"0.9rem" , color:"red" }}>There will be 97 products Affected , Confirm to Proceed</SoftTypography></center>
}
                </DialogContent>
                <DialogActions style={{ zIndex: 70 }}>
                  <Button onClick={handleClose}>Cancel</Button>
                  {errMsg ? <Button onClick={handleConfirm} >Confirm</Button> :<Button onClick={ShowErrMsg} >Save</Button> }

                </DialogActions>
              </Dialog>
            </div>
          </SoftBox>
        )} */}
      </Box>
    </DashboardLayout>
  );
};

export default BulkPriceEdit;
