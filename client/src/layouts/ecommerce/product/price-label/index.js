import './product-label.css';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Checkbox, Chip, Grid, List, ListItem, ListItemText } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  getCategoriesBulkPriceEdit,
  getInventoryBatchByGtinWithMrpAndExpiryDate,
  getLatestInwarded,
  getManufacturerBulkPriceEdit,
  postinventorytabledata,
  productLabelTableData,
} from '../../../../config/Services';
import { green } from '@mui/material/colors';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Modal from '@mui/material/Modal';
import PrintIcon from '@mui/icons-material/Print';
import SoftBox from 'components/SoftBox';
import SoftButton from 'components/SoftButton';
import SoftInput from 'components/SoftInput';
import SoftSelect from 'components/SoftSelect';
import SoftTypography from 'components/SoftTypography';
import Spinner from 'components/Spinner/index';
import TextField from '@mui/material/TextField';
import Verified from '@mui/icons-material/Verified';

import * as React from 'react';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { ChipBoxHeading } from '../../Common/Filter Components/filterComponents';
import {
  ClearSoftInput,
  CopyToClipBoard,
  formatDateDDMMYYYY,
  noDatagif,
  textFormatter,
  updatingPageNumber,
} from '../../Common/CommonFunction';
import { buttonStyles } from '../../Common/buttonColor';
import { format } from 'date-fns';
import { setPageNumber, useSoftUIController } from '../../../../context';
import { useSnackbar } from '../../../../hooks/SnackbarProvider';
import Clear from '@mui/icons-material/Clear';
import Filter from '../../Common/Filter';
import UpgradePlan from '../../../../UpgardePlan';
import dayjs from 'dayjs';
import handlePrint from './testLabel';
// import  from '../../../../UpgardePlan';

const ProductLabel = () => {
  const [controller, dispatch] = useSoftUIController();
  const { pageNumber } = controller;
  const navigate = useNavigate();
  const featureSettings = JSON.parse(localStorage.getItem('featureSettings'));

  // const [dummy, setDummy] = useState([
  //   {
  //     gtin: '004432',
  //     isChecked: false,
  //     itemName: 'MRGOLD GROUNDNUT OIL BULK',
  //     mrp: 1900,
  //     sellingPrice: 1493.55,
  //     weightUOM: 'gms',
  //   },
  //   {
  //     gtin: '004432',
  //     isChecked: false,
  //     itemName: 'MRGOLD GROUNDNUT OIL BULK',
  //     mrp: 1900,
  //     sellingPrice: 1493.55,
  //     weightUOM: 'gms',
  //   },
  //   {
  //     gtin: '004430',
  //     isChecked: false,
  //     itemName: 'MRGOLD GROUNDNUT OIL BULK',
  //     mrp: 1900,
  //     sellingPrice: 1493.55,
  //     weightUOM: 'gms',
  //   },
  //   {
  //     gtin: '004463',
  //     isChecked: false,
  //     itemName: 'MRGOLD GROUNDNUT OIL BULK',
  //     mrp: 1900,
  //     sellingPrice: 1493.55,
  //     weightUOM: 'gms',
  //   },
  //   {
  //     gtin: '004733',
  //     isChecked: false,
  //     itemName: 'MRGOLD GROUNDNUT OIL BULK',
  //     mrp: 1900,
  //     sellingPrice: 1493.55,
  //     weightUOM: 'gms',
  //   },
  // ]);

  //
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');

  const [selectedCategoryOptions, setSelectedCategoryOptions] = useState([]);
  const [selectedCategoryList, setSelectedCategoryList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);

  const [brandsList, setBrandsList] = useState([]);
  const [selectedBrandOptions, setSelectedBrandOptions] = useState([]);
  const [selectedBrandList, setSelectedBrandList] = useState([]);

  //updating the pageNumber for datagrid

  useEffect(() => {
    let isMounted = true;

    const updatedPageNumber = updatingPageNumber(
      'products',
      'productLabel',
      pageNumber.products.productLabel,
      pageNumber,
    );
    if (isMounted) {
      if (pageNumber.products.productLabel) {
        setPageNumber(dispatch, updatedPageNumber);
      }
    }

    return () => {
      isMounted = false;
    };
  }, []);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [selectionModel, setSelectionModel] = useState([]);

  const [print, setPrint] = useState(null);
  const [selectedList, setSelectedList] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openBulkModal, setOpenBulkModal] = useState(false);
  const [printType, setPrintType] = useState({
    value: '40x20',
    label: '40x20',
  });

  const [customPrintModal, setCustomPrintModal] = useState(false);
  const [indivPrintModal, setIndivPrintModal] = useState(false);
  const [printQuantity, setPrintQuantity] = useState('');

  const [prodOptions, setProdOptions] = useState([]);
  const [gtin, setGtin] = useState('');
  const [gtinNum, setGtinNum] = useState(null);
  const [batchIds, setBatchIds] = useState('');
  const [totalBatches, setTotalBaches] = useState('');
  const [batchNo, setBatchNo] = useState('');
  const [verified, setVerified] = useState(false);
  const [loader, setLoader] = useState(false);

  const [totalBatchesData, setTotalBatchesData] = useState([]);
  const [customBatchData, setCustomBatchData] = useState('');
  const [customBatchDataIndex, setCustomBatchDataIndex] = useState('');
  const [customBatchDataMulti, setCustomBatchDataMulti] = useState([]);
  const [customPrintQty, setCustomPrintQty] = useState('');
  const [filteredBatchesData, setFilteredBatchesData] = useState('');
  const [customPrintLabelData, setCustomPrintLabelData] = useState([]);
  const [bulkPrintLabelData, setBulkPrintLabelData] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState([]);
  const [selectedIndRowData, setSelectedIndRowData] = useState([]);

  const [searchProduct, setSearchProduct] = useState('');
  const [debounceSearchProduct, setDebouncedSearchProduct] = useState('');

  const [opensnack, setOpensnack] = useState(false);
  const [timelinerror, setTimelineerror] = useState('');
  const [alertmessage, setAlertmessage] = useState('');
  const [verifyLoader, setVerifyLoader] = useState(false);

  const [tableData, setTableData] = useState([]);
  const [notFound, setNotFound] = useState(false);
  const [debouncedSearchInventory, setDebouncedSearchInventory] = useState('');
  const [searchValInventory, setSearchValInventory] = useState('');

  const showSnackbar = useSnackbar();

  const [pageStateOnSearch, setPageStateOnSearch] = useState({
    loader: false,
    datRows: [],
    total: 0,
    page: 1,
    pageSize: 10,
  });

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

  const getAllBrands = () => {
    getManufacturerBulkPriceEdit(locId)
      .then((res) => {
        const manufacturer = res.data.data.data;
        const manufacturerList = manufacturer.map((item) => {
          return {
            value: item,
            label: item,
          };
        });
        setBrandsList(manufacturerList);
      })
      .catch((err) => {});
  };

  const inventoryTableData = async ({ pageNumber }) => {
    let filterObject = '';

    if (startDate !== null && endDate !== null) {
      filterObject = {
        pageNumber: pageNumber,
        pageSize: pageStateOnSearch?.pageSize,
        locationId: locId,
        orgId: orgId,
        gtins: [],
        categories: selectedCategoryOptions,
        brands: selectedBrandOptions,
        startDate: startDate,
        endDate: endDate,
        searchBox: debouncedSearchInventory?.trim(),
      };
    } else {
      filterObject = {
        pageNumber: pageNumber,
        pageSize: pageStateOnSearch?.pageSize,
        locationId: locId,
        orgId: orgId,
        gtins: [],
        categories: selectedCategoryOptions,
        brands: selectedBrandOptions,
        searchBox: debouncedSearchInventory?.trim(),
      };
    }

    setLoader(true);
    productLabelTableData(filterObject)
      .then(async (res) => {
        if (res.data?.data?.es == 0) {
          const result = res.data?.data?.data?.inventoryEntityList;
          if (result.length == 0) {
            setNotFound(true);
            setTableData([]);
            setLoader(false);
          } else {
            const data = result.map((row) => {
              return {
                ...row,
                gtin: row.gtin,
                itemName: textFormatter(row.itemName),
                weightUOM: row.weightUOM == null ? '---' : row.weightUOM,
                batchId: row.batchNo === null ? 'NA' : row.batchNo,
                mrp: row.mrp == null ? '---' : row.mrp,
                sellingPrice: row.sellingPrice == null ? '---' : row.sellingPrice,
                id: row.gtin,
              };
            });
            setTableData(data);
            showSnackbar(res.data.data.message, 'success');
            setPageStateOnSearch((prev) => ({
              ...prev,
              page: res?.data?.data?.data?.pageNumber,
              total: res?.data?.data?.data?.totalResult,
            }));
            // setAlertmessage(res.data.data.message);
            // setTimelineerror('success');
            // handleopensnack();
            setLoader(false);
          }
        }
        if (res.data?.data?.es == 1) {
          showSnackbar(res.data.data.message, 'error');
          // setAlertmessage(res.data.data.message);
          // setTimelineerror('error');
          // handleopensnack();
          setNotFound(true);
          setTableData([]);
          setLoader(false);
        }
      })
      .catch((err) => {
        setNotFound(true);
        setLoader(false);
      });
  };

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearchInventory(searchValInventory), 1000);
    return () => {
      clearTimeout(timeout);
    };
  }, [searchValInventory]);

  useEffect(() => {
    inventoryTableData({ pageNumber: 1 });
  }, [
    debouncedSearchInventory,
    //  selectedCategoryOptions, selectedBrandOptions, startDate, endDate
  ]);

  useEffect(() => {
    getAllCategories();
    getAllBrands();
  }, []);

  // useEffect(() => {
  //   console.log('customIndex', customBatchDataIndex);
  //   console.log('customBatchData', customBatchData);
  // }, [customBatchDataIndex]);

  const handleSearchInventory = (e) => {
    const val = e.target.value;
    // console.log('searchInventory', val);
    if (val.length === 0) {
      setSearchValInventory('');
    } else {
      setSearchValInventory(e.target.value);
    }
  };

  // clear search input fn
  const handleClearProductSearch = () => {
    setSearchValInventory('');
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

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const handleStartDate = (date) => {
    // let time = moment.utc(date).format('YYYY-MM-DD HH:mm:ss');
    // let stillUtc = moment.utc(time).toDate();
    // const start = moment(stillUtc).local().format('YYYY-MM-DD');
    setStartDate(format(date.$d, 'yyyy-MM-dd'));

    if (filterState['startDate'] === 0) {
      setFiltersApplied((prev) => prev + 1);
      setFilterState({ ...filterState, startDate: 1 });
    }
  };

  const handleEndDate = (date) => {
    // let time = moment.utc(date).format('YYYY-MM-DD HH:mm:ss');
    // let stillUtc = moment.utc(time).toDate();
    // const end = moment(stillUtc).local().format('YYYY-MM-DD');

    setEndDate(format(date.$d, 'yyyy-MM-dd'));

    if (filterState['endDate'] === 0) {
      setFiltersApplied((prev) => prev + 1);
      setFilterState({ ...filterState, endDate: 1 });
    }
  };

  const columns = [
    {
      field: 'itemName',
      headerName: 'Product',
      minWidth: 250,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'gtin',
      headerName: 'Barcode',
      minWidth: 150,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'left',
      renderCell: (params) => {
        return <CopyToClipBoard params={params} />;
      },
    },
    {
      field: 'weightUOM',
      headerName: 'Unit of measurement',
      minWidth: 150,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'batchId',
      headerName: 'Batch',
      minWidth: 100,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'mrp',
      headerName: 'MRP',
      minWidth: 80,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'left',
    },

    {
      field: 'sellingPrice',
      headerName: 'Sale Price',
      minWidth: 80,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'print',
      headerName: 'Print',
      minWidth: 80,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'left',
      renderCell: (params) => {
        // console.log('params', params);

        return (
          <SoftBox className="print-label">
            <PrintIcon
              color="info"
              fontSize="medium"
              onClick={(event) => {
                event.stopPropagation();
                handleRowPrintData(params.row);
                // setSelectedRowData(params.row);
                // setPrint(true);
                setIndivPrintModal(true);
                setPrintQuantity(1);
              }}
              sx={{
                color: '#0562FB',
              }}
            />
          </SoftBox>
        );
      },
    },
  ];

  const handleRowItemOnCheckboxSelection = (ids) => {
    setOpenModal(false);
    handleCellClickToVerifyGtin(null);
    handleCloseModel();
    setSelectedList(ids);
  };

  // useEffect(() => {
  //   console.log('selectedRowData', selectedRowData);
  // }, [selectedRowData]);

  // useEffect(() => {
  //   console.log('selectedList', selectedList);
  // }, [selectedList]);

  const handleVerifyGtinFromRow = (gtin) => {
    setVerifyLoader(true);
    getInventoryBatchByGtinWithMrpAndExpiryDate(gtin, locId)
      .then((res) => {
        setVerifyLoader(false);
        const result = res.data.data.data;
        const totBatchesData = result.map((item) => ({
          // itemName: item[0].itemName,
          // weightUOM: item[0].weightUOM,
          // mrp: item[0].mrp,
          // sellingPrice: item[0].sellingPrice,
          // gtin: item[0].gtin,
          // -------
          // ...item[0],
          ...item,
          isChecked: false,
        }));
        setTotalBatchesData(totBatchesData);
        // setAlertmessage('GTIN Verified Successfully');
        // setTimelineerror('success');
        // handleopensnack();
        setVerifyLoader(false);
        setVerified(true);
      })
      .catch((err) => {
        showSnackbar('Cannot verify gtin', 'error');
        // setAlertmessage('Cannot Verify GTIN');
        // setTimelineerror('error');
        // handleopensnack();
        setVerifyLoader(false);
      });
  };

  const handleVerifyGtin = () => {
    setVerifyLoader(true);
    getInventoryBatchByGtinWithMrpAndExpiryDate(gtin, locId)
      .then((res) => {
        setVerifyLoader(false);
        const result = res.data.data.data;
        const totBatchesData = result.map((item) => ({
          // itemName: item[0].itemName,
          // weightUOM: item[0].weightUOM,
          // mrp: item[0].mrp,
          // sellingPrice: item[0].sellingPrice,
          // gtin: item[0].gtin,
          // -------
          // ...item[0],
          ...item,
          isChecked: false,
        }));
        setTotalBatchesData(totBatchesData);
        setProdOptions([]);
        showSnackbar('GTIN Verified Successfully', 'success');
        // setAlertmessage('GTIN Verified Successfully');
        // setTimelineerror('success');
        // handleopensnack();
        setVerifyLoader(false);
        setVerified(true);
      })
      .catch((err) => {
        showSnackbar('Cannot Verify GTIN', 'error');
        // setAlertmessage('Cannot Verify GTIN');
        // setTimelineerror('error');
        // handleopensnack();
        setVerifyLoader(false);
      });
    // getInventoryBatchByGtin(gtin, locId)
    //   .then((res) => {
    //     console.log('gtinVerify', res);
    //     const batchIds = res.data.data.data;
    //     const totBatchIds = batchIds.map((item) => ({
    //       value: item.batchNo,
    //       label: item.batchNo,
    //     }));
    //     setBatchIds(totBatchIds);
    //     setTotalBaches(batchIds);
    //     setAlertmessage('GTIN Verified Successfully');
    //     setTimelineerror('success');
    //     handleopensnack();
    //     setVerifyLoader(false);
    //     setVerified(true);
    //   })
    //   .catch((err) => {
    //     setAlertmessage('Cannot Verify GTIN');
    //     setTimelineerror('error');
    //     handleopensnack();
    //     setVerifyLoader(false);
    //   });
  };

  const handleAutoCompleteCategories = (item) => {
    // console.log('selectedCategoryList', item);
    const selectedCategories = item?.map((el) => el.value);
    setSelectedCategoryOptions(selectedCategories);
    setSelectedCategoryList(item);

    if (item.length !== 0) {
      if (filterState['categories'] === 0) {
        setFiltersApplied((prev) => prev + 1);
        setFilterState({ ...filterState, categories: 1 });
      }
    } else {
      if (filterState['categories'] !== 0) {
        setFiltersApplied((prev) => prev - 1);
        setFilterState({ ...filterState, categories: 0 });
      }
    }
  };

  const handleChangeCategories = (e) => {
    const searchCategory = e.target.value;
  };

  const handleAutoCompleteBrands = (item) => {
    // console.log('selectedBrandsList', item);
    const selectedBrands = item.map((el) => el.value);
    setSelectedBrandOptions(selectedBrands);
    setSelectedBrandList(item);

    if (item.length !== 0) {
      if (filterState['brands'] === 0) {
        setFiltersApplied((prev) => prev + 1);
        setFilterState({ ...filterState, brands: 1 });
      }
    } else {
      if (filterState['brands'] !== 0) {
        setFiltersApplied((prev) => prev - 1);
        setFilterState({ ...filterState, brands: 0 });
      }
    }
  };

  useEffect(() => {}, [selectedCategoryOptions, selectedBrandOptions]);

  useEffect(() => {}, [selectedCategoryList, selectedBrandList]);

  const handleChangeBrands = (e) => {
    const searchBrand = e.target.value;
  };

  const handleAutoComplete = (item) => {
    if (item === null) {
      setGtin('');
      setGtinNum(null);
      setVerified(false);
      setTotalBatchesData([]);
      setProdOptions([]);
      return;
    }
    // if (gtin.length && gtin !== item.value) {
    //   setGtin('');
    //   setGtinNum(null);
    //   setVerified(false);
    //   setTotalBatchesData([]);
    //   setProdOptions([]);
    //   setGtin(item.value);
    //   return;
    // }
    setGtin(item.value);
  };
  const handleChange = (e) => {
    const searchText = e.target.value;
    if (searchText === '') {
      setGtin('');
      setGtinNum(null);
      setVerified(false);
      setTotalBatchesData([]);
      setProdOptions([]);
      return;
    }
    setSearchProduct(searchText);
  };

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearchProduct(searchProduct), 1000);
    return () => {
      clearTimeout(timeout);
    };
  }, [searchProduct]);

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
            label: `${item.gtin}  (${item.itemName})`,
          }));
          setProdOptions(result);
        })
        .catch((err) => {
          console.log('error', err);
          setProdOptions(result);
        });
    }
    if (searchProduct.length == 0) {
      setProdOptions([]);
    }
    // setProdOptions([]);
  }, [debounceSearchProduct]);

  // const handleBatchIds = (option) => {
  //   // setBatchNo(option.label);
  //   console.log('batchNo.', option.label);

  //   const batch = option.label;
  //   const findBatchNoData = totalBatches.find((data) => data.batchNo === batch);
  //   console.log('findBatchNoData', findBatchNoData);
  //   const customPrintData = {
  //     itemName: findBatchNoData.itemName,
  //     weightUOM: findBatchNoData.weightUOM,
  //     mrp: findBatchNoData.mrp,
  //     sellingPrice: findBatchNoData.sellingPrice,
  //     gtin: findBatchNoData.gtin,
  //   };
  //   setCustomPrintLabelData([...customPrintLabelData, customPrintData]);
  // };

  const handleCloseModel = () => {
    setGtin('');
    setBatchIds('');
    setTotalBaches('');
    setBatchNo('');
    setCustomPrintLabelData([]);
    setSearchProduct('');
    setVerified(false);
    setVerifyLoader(false);
    setOpenModal(false);
    setTotalBatchesData([]);
    setGtinNum(null);
    setCustomPrintQty('');
    setCustomBatchDataMulti([]);
    setCustomBatchData('');
    setCustomBatchDataIndex('');
  };

  const handleCloseBulkModel = () => {
    setOpenBulkModal(false);
    setPrintType({
      value: '40x20',
      label: '40x20',
    });
    setBulkPrintLabelData([]);
  };
  const handleCloseCustomPrintModel = () => {
    setCustomPrintModal(false);
    setPrintType({
      value: '40x20',
      label: '40x20',
    });
    setFilteredBatchesData([]);
  };

  const handleCloseIndivPrintModel = () => {
    setPrintType({
      value: '40x20',
      label: '40x20',
    });
    setSelectedRowData([]);
    setSelectedIndRowData([]);
    setIndivPrintModal(false);
    setPrintQuantity('');
  };

  const handleBulkPrint = () => {
    if (selectedList.length == 0) {
      showSnackbar('Please select atleast one product to print', 'warning');
      // setAlertmessage('Please select atlease one product to print');
      // setTimelineerror('warning');
      // handleopensnack();
      return;
    } else {
      const payload = {
        locationId: locId,
        gtins: selectedList,
      };
      getLatestInwarded(payload)
        .then((res) => {
          const bulkData = res.data.data.data.map((item) => ({
            // itemName: item.itemName,
            // weightUOM: item.weightUOM,
            // mrp: item.mrp,
            // sellingPrice: item.sellingPrice,
            // gtin: item.gtin,
            ...item,
          }));
          setBulkPrintLabelData(bulkData);
        })
        .then(() => setPrint(true))
        .catch((err) => {
          console.error('error', err);
        });
      setOpenBulkModal(true);
    }
  };

  const handleCustomPrint = () => {
    // console.log('customPrintLabelData', customPrintLabelData);
    // if (totalBatchesData.every((item) => item.isChecked == false)) {
    //   setAlertmessage('Please select atleast one data to print');
    //   setTimelineerror('warning');
    //   handleopensnack();
    //   return;
    // } else {
    //   const filteredData = totalBatchesData.filter((item) => item.isChecked == true);
    //   setFilteredBatchesData(filteredData);
    //   // setOpenModal(false);
    //   // setPrint(true);
    //   setCustomPrintModal(true);
    // }
    if (customBatchDataMulti.length == 0) {
      showSnackbar('Please select atleast one data to print', 'warning');
      // setAlertmessage('Please select atleast one data to print');
      // setTimelineerror('warning');
      // handleopensnack();
      return;
    }

    if (customPrintQty == '') {
      showSnackbar('Please enter at least 1 or more than 1 print quantity', 'warning');
      // setAlertmessage('Please enter at least 1 or more than 1 print quantity');
      // setTimelineerror('warning');
      // handleopensnack();
      return;
    }

    setCustomPrintModal(true);
  };

  const handleRadioChange = (e, data, index) => {
    setCustomBatchDataIndex(index);
    setCustomBatchData(data);
    setCustomBatchDataMulti([data]);
    setCustomPrintQty(1);
    // console.log('totBatches', totalBatchesData);
    // const newData = [...totalBatchesData];
    // newData[index]['isChecked'] = e.target.checked;
    // setTotalBatchesData(newData);
  };

  const handleCellClickToVerifyGtin = (rows) => {
    if (rows == null) {
      return;
    }
    if (rows !== null && !selectedList.length) {
      const gtinNo = rows.row['gtin'];
      setGtinNum(gtinNo);
      // console.log(gtinNo);
      handleVerifyGtinFromRow(gtinNo);
      setOpenModal(true);
    }
  };

  // useEffect(() => {
  //   console.log('totalBatches', totalBatchesData);
  // }, [totalBatchesData]);

  useEffect(() => {
    if (localStorage.getItem('printData') !== null) {
    }
  }, []);

  const handlePrintType = (option) => {
    setPrintType(option);
  };

  const handleModalBulkPrint = () => {
    if (printType.length == 0) {
      showSnackbar('Please select the print type', 'warning');
      // setAlertmessage('Please select the print type');
      // setTimelineerror('warning');
      // handleopensnack();
      return;
    } else {
      // console.log('modalBulkPrint', bulkPrintLabelData);
      // console.log('printType', printType);
      handlePrint(bulkPrintLabelData, printType.value);
      handleCloseBulkModel();
    }
    setSelectedList([]);
  };

  const handleModalCustomPrint = () => {
    if (printType.length == 0) {
      showSnackbar('Please select the print type', 'warning');
      // setAlertmessage('Please select the print type');
      // setTimelineerror('warning');
      // handleopensnack();
      return;
    } else {
      // console.log('customPrint', customBatchDataMulti);
      // console.log('printType', printType);
      handlePrint(customBatchDataMulti, printType.value);
      handleCloseCustomPrintModel();
    }
  };

  const handleModalIndivPrint = () => {
    if (printType.length == 0) {
      showSnackbar('Please select the print type', 'warning');
      // setAlertmessage('Please select the print type');
      // setTimelineerror('warning');
      // handleopensnack();
      return;
    } else if (printQuantity == '') {
      showSnackbar('Please enter at least 1 or more than 1 print quantity', 'warning');
      // setAlertmessage('Please enter at least 1 or more than 1 print quantity');
      // setTimelineerror('warning');
      // handleopensnack();
      return;
    } else {
      // console.log('customPrintIndiv', selectedRowData);
      // console.log('printType', printType);
      handlePrint(selectedRowData, printType.value);
      handleCloseIndivPrintModel();
    }
  };

  const handlePrintQty = (e) => {
    const value = e.target.value;
    setPrintQuantity(value);

    if (value >= 1) {
      const newRowDataPrintCount = [];
      for (let i = 0; i < value; i++) {
        newRowDataPrintCount.push(...selectedIndRowData);
      }
      // console.log('newRowDataPrintCount', newRowDataPrintCount);
      setSelectedRowData(newRowDataPrintCount);
    }
    if (value == '') {
      // setPrintQuantity(1);
      const newRowDataPrintCount = [];
      newRowDataPrintCount.push(...selectedIndRowData);
      // console.log('newRowDataPrintCount', newRowDataPrintCount);
      setSelectedRowData(newRowDataPrintCount);
    }
  };

  const handleCustomPrintQty = (e, item) => {
    const value = e.target.value;

    if (value == 0) {
      setCustomPrintQty('');
      showSnackbar('zero or negative values are not allowed Or provide atleast 1 print quantity', 'warning');
      // setAlertmessage('zero or negative values are not allowed Or provide atleast 1 print quantity');
      // setTimelineerror('warning');
      // handleopensnack();
      return;
    }

    if (value == 0) {
      showSnackbar('zero or negative values are not allowed Or provide atleast 1 print quantity', 'warning');
      setCustomPrintQty('');
      // setAlertmessage('zero or negative values are not allowed Or provide atleast 1 print quantity');
      // setTimelineerror('warning');
      // handleopensnack();
      return;
    }
    if (value >= 1) {
      // console.log('value', value);
      const newRowDataPrintCount = [];
      for (let i = 0; i < value; i++) {
        newRowDataPrintCount.push(customBatchData);
      }
      // console.log('newRowDataPrintCount', newRowDataPrintCount);
      setCustomBatchDataMulti(newRowDataPrintCount);
    }
    if (value == '') {
      // setCustomPrintQty(1);
      const newRowDataPrintCount = [];
      newRowDataPrintCount.push(customBatchData);
      // console.log('newRowDataPrintCount', newRowDataPrintCount);
      setCustomBatchDataMulti(newRowDataPrintCount);
    }
    setCustomPrintQty(value);
  };

  // useEffect(() => {
  //   console.log('customBatchDataMulti', customBatchDataMulti);
  // }, [customBatchDataMulti]);

  const handleRowPrintData = (data) => {
    setSelectedRowData([...selectedRowData, data]);
    setSelectedIndRowData([...selectedIndRowData, data]);
  };

  const handleNegativeVal = (event) => {
    // console.log('eve', event);
    if (event.code == 'Minus') {
      showSnackbar('Negative values are not allowed', 'warning');
      // setAlertmessage('Negative values are not allowed');
      // setTimelineerror('warning');
      // handleopensnack();
      event.preventDefault();
    }
  };

  // const handleSelectCategory = (selectedOptions) => {
  //   setSelectedCategoryOptions(selectedOptions);
  // };

  // const handleSelectBrand = (selectedOptions) => {
  //   setSelectedBrandOptions(selectedOptions);
  // };

  // state to check wheather clear in filter box is clicked or not
  const [isClear, setIsClear] = useState(false);

  const handleClear = () => {
    setSearchValInventory('');
    setDebouncedSearchInventory('');
    setSelectedBrandOptions([]);
    setSelectedBrandList([]);
    setSelectedCategoryOptions([]);
    setSelectedCategoryList([]);
    setStartDate(null);
    setEndDate(null);
    // reset the filterState
    setFilterState({ categories: 0, brands: 0, startDate: 0, endDate: 0 });
    // reset filters applied to 0
    setFiltersApplied(0);
    // set setIsClear to true
    setIsClear(true);
  };

  // run this useeffect when clear is clicked in filter and setIsClear set to true
  useEffect(() => {
    if (isClear) {
      inventoryTableData({ pageNumber: 1 });
      setIsClear(false);
    }
  }, [isClear]);

  // filters
  // select categories
  // select brands
  // satrt date
  // end date

  // categories select
  const categorySelect = (
    <>
      {/* <SoftBox className=""> */}
      {/* <SoftSelect
                  menuPortalTarget={document.body}
                  placeholder="Select Categories"
                  options={categoriesList}
                  isMulti={true}
                  autosize={true}
                  onChange={handleSelectCategory}
                /> */}
      <Autocomplete
        id="multiple-limit-tags"
        disableCloseOnSelect // Prevent the dropdown from closing when an option is selected
        value={selectedCategoryList}
        options={categoriesList}
        getOptionLabel={(option) => textFormatter(option.label) || ''}
        onChange={(e, v) => handleAutoCompleteCategories(v)}
        sx={{
          width: '100%',
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
            // value={searchProduct}
            onChange={(e) => handleChangeCategories(e)}
            placeholder={
              selectedCategoryList.length === 0
                ? 'Select Categories'
                : (selectedCategoryList.length === 1 && `${selectedCategoryList.length} category selected`) ||
                  `${selectedCategoryList.length} categories selected`
            }
            variant="outlined"
            fullWidth
          />
        )}
      />
      {/* </SoftBox> */}
    </>
  );

  // brand select
  const brandSelect = (
    <>
      {/* <SoftBox className="brand-filter"> */}
      {/* <SoftSelect
                  menuPortalTarget={document.body}
                  placeholder="Select Brands"
                  options={brandsList}
                  isMulti={true}
                  autosize={true}
                  onChange={handleSelectBrand}
                /> */}
      <Autocomplete
        id="multiple-limit-tags1"
        disableCloseOnSelect // Prevent the dropdown from closing when an option is selected
        value={selectedBrandList}
        options={brandsList}
        getOptionLabel={(option) => textFormatter(option.label) || ''}
        onChange={(e, v) => handleAutoCompleteBrands(v)}
        style={{ width: '100%' }}
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
            // value={searchProduct}
            onChange={(e) => handleChangeBrands(e)}
            placeholder={
              selectedBrandList.length === 0
                ? 'Select Brands'
                : (selectedBrandList.length === 1 && `${selectedBrandList.length} brand selected`) ||
                  `${selectedBrandList.length} brands selected`
            }
            variant="outlined"
            fullWidth
          />
        )}
      />
      {/* </SoftBox> */}
    </>
  );

  // start date select
  const startdateSelect = (
    <>
      {/* <SoftBox className="start-date" sx={{ marginTop: '0' }}> */}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          views={['year', 'month', 'day']}
          format="DD-MM-YYYY"
          label="Start Date"
          value={startDate ? dayjs(startDate) : null}
          onChange={(date) => {
            // handleStartDate(date.$d);
            handleStartDate(date);
          }}
          sx={{
            width: '100%',
            '& .MuiInputLabel-formControl': {
              fontSize: '0.8rem',
              top: '-0.4rem',
              color: '#344767',
              opacity: 0.6,
            },
          }}
        />
      </LocalizationProvider>
      {/* </SoftBox> */}
    </>
  );

  // end date select
  const endDateSelect = (
    <>
      {/* <SoftBox className="end-date" sx={{ marginTop: '0' }}> */}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          views={['year', 'month', 'day']}
          label="End Date"
          format="DD-MM-YYYY"
          value={endDate ? dayjs(endDate) : null}
          onChange={(date) => {
            // handleEndDate(date.$d);
            handleEndDate(date);
          }}
          sx={{
            width: '100%',
            '& .MuiInputLabel-formControl': {
              fontSize: '0.8rem',
              top: '-0.4rem',
              color: '#344767',
              opacity: 0.6,
            },
          }}
        />
      </LocalizationProvider>
      {/* </SoftBox> */}
    </>
  );

  // filter states
  const [filtersApplied, setFiltersApplied] = useState(0);
  const [filterState, setFilterState] = useState({
    categories: 0,
    brands: 0,
    startDate: 0,
    endDate: 0,
  });
  // end of filter states

  // filter box
  const [anchorEl, setAnchorEl] = useState(null);
  const open2 = Boolean(anchorEl);
  const handleClickFilter = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseFilter = () => {
    setAnchorEl(null);
  };
  // end of filter box

  // apply filter function
  const applyFilter = () => {
    inventoryTableData({ pageNumber: 1 });
  };

  // remove selected filter function
  const removeSelectedFilter = (filterType) => {
    switch (filterType) {
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

  // selectBoxArray
  const selectBoxArray = [categorySelect, brandSelect, startdateSelect, endDateSelect];

  // filterchipboxes
  const filterChipBoxes = (
    <>
      {/* start date  */}
      {startDate !== null && (
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
      {/* end date  */}
      {endDate !== null && (
        <Box className="singleChipDisplayBox">
          <ChipBoxHeading heading="End Date" />
          <Box className="insideSingleChipDisplayBox">
            <Chip
              label={endDate}
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

  return (
    <>
      <DashboardLayout>
        <DashboardNavbar />
        <Snackbar open={opensnack} autoHideDuration={3000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity={timelinerror} sx={{ width: '100%' }}>
            {alertmessage}
          </Alert>
        </Snackbar>
        <SoftBox
          // className="price-label"
          className="search-bar-filter-and-table-container"
          style={{
            // boxShadow: 'rgba(37, 37, 37, 0.126) 0px 5px 50px',
            position: 'relative',
          }}
        >
          <Box
            className="search-bar-filter-container"
            // restrict-filters
            sx={
              featureSettings !== null && featureSettings['PRODUCT_LABEL'] == 'FALSE'
                ? {
                    opacity: '0.3',
                    pointerEvents: 'none',
                  }
                : null
            }
          >
            {/* <Box className="price-label-top"> */}
            <SoftBox className="price-label-filters">
              <Grid container spacing={2}>
                <Grid item lg={5.5} md={5.5} sm={6} xs={12}>
                  <SoftBox className="price-label-search" sx={{ position: 'relative' }}>
                    <SoftInput
                      value={searchValInventory}
                      placeholder="Search By Barcode"
                      icon={{ component: 'search', direction: 'left' }}
                      onChange={handleSearchInventory}
                    />
                    {searchValInventory !== '' && <ClearSoftInput clearInput={handleClearProductSearch} />}
                  </SoftBox>
                </Grid>

                <Grid item lg={6.5} md={6.5} sm={6} xs={12}>
                  <SoftBox
                    sx={{
                      // marginTop: '1rem',
                      // marginBottom: '1rem',
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                      // marginLeft: '1rem',
                    }}
                  >
                    <SoftButton
                      // className="purchase-main-btn-i"
                      variant="insideHeader"
                      id="bulk-print-btn"
                      // variant="gradient"
                      // color="info"
                      onClick={() => {
                        // setPrint(true);
                        handleBulkPrint();
                      }}
                    >
                      <PrintIcon
                        sx={{
                          position: 'relative',
                          right: '0.5rem',
                        }}
                      />
                      Bulk Print
                    </SoftButton>
                    <SoftButton
                      className="purchase-main-btn-i"
                      // variant="insideHeader"
                      variant="solidWhiteBackground"
                      // color="info"
                      onClick={() => setOpenModal(true)}
                      sx={{ marginLeft: '1rem' }}
                    >
                      <PrintIcon
                        sx={{
                          position: 'relative',
                          right: '0.5rem',
                        }}
                      />
                      Custom Print
                    </SoftButton>

                    {/* filter box  */}
                    {/* new  */}
                    <Filter
                      selectBoxArray={selectBoxArray}
                      filtersApplied={filtersApplied}
                      filterChipBoxes={filterChipBoxes}
                      handleApplyFilter={applyFilter}
                      handleClearFilter={handleClear}
                    />
                  </SoftBox>
                </Grid>

                {/* <Grid item>
                    <SoftBox className="category-filter">                
                      <Autocomplete
                        id="multiple-limit-tags"
                        value={selectedCategoryList}
                        options={categoriesList}
                        getOptionLabel={(option) => option.label}
                        onChange={(e, v) => handleAutoCompleteCategories(v)}
                        sx={{
                          width: '100%',
                        }}
                        multiple
                        limitTags={2}
                        renderInput={(params) => (
                          <TextField
                            className="limit-tag"
                            {...params}
                            // value={searchProduct}
                            onChange={(e) => handleChangeCategories(e)}
                            placeholder="Select Categories"
                            variant="outlined"
                            fullWidth
                            // style={{

                            // }}
                          />
                        )}
                      />
                    </SoftBox>
                  </Grid> */}

                {/* <Grid item>
                    <SoftBox className="clear-btn-product-filter">
                      <SoftButton onClick={handleClear} className="vendor-second-btn">
                        Clear
                      </SoftButton>
                    </SoftBox>
                  </Grid> */}
              </Grid>
            </SoftBox>
            {/* <SoftBox
              sx={{
                display: 'flex',
                gap: '1rem',
                marginRight: '1rem',
              }}
            >
              <SoftButton
                className="purchase-main-btn-i"
                id="bulk-print-btn"
                // variant="gradient"
                color="info"
                sx={{
                  // marginRight: '1rem',
                  // padding: '1rem',
                  marginTop: '1rem',
                  height: '2rem',
                }}
                onClick={() => {
                  // setPrint(true);
                  handleBulkPrint();
                }}
              >
                <PrintIcon
                  sx={{
                    position: 'relative',
                    right: '0.5rem',
                  }}
                />
                Bulk Print
              </SoftButton>
              <SoftButton
                className="purchase-main-btn-i"
                // variant="gradient"
                color="info"
                sx={{
                  marginTop: '1rem',
                  height: '2rem',
                }}
                onClick={() => setOpenModal(true)}
              >
                <PrintIcon
                  sx={{
                    position: 'relative',
                    right: '0.5rem',
                  }}
                />
                Custom Print
              </SoftButton>
            </SoftBox> */}
            {/* </Box> */}
          </Box>
          <Box
            className="price-label-table"
            sx={
              {
                // marginTop: '1rem',
              }
            }
          >
            {tableData.length == 0 && notFound ? (
              <SoftBox className="No-data-text-box">
                <SoftBox className="src-imgg-data">
                  <img className="src-dummy-img" src={noDatagif} />
                </SoftBox>
                <h3 className="no-data-text-I">NO DATA FOUND</h3>
              </SoftBox>
            ) : (
              <div
                style={{
                  height: featureSettings !== null && featureSettings['PRODUCT_LABEL'] == 'FALSE' ? 525 : 525,
                  width: '100%',
                  position: 'relative',
                }}
              >
                {featureSettings !== null && featureSettings['PRODUCT_LABEL'] == 'FALSE' ? <UpgradePlan /> : null}

                {loader && (
                  <Box
                    sx={{
                      height: '100%',
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Spinner />
                  </Box>
                )}
                {!loader && (
                  <DataGrid
                    rows={tableData}
                    columns={columns}
                    page={pageStateOnSearch?.page - 1}
                    pageSize={pageStateOnSearch?.pageSize}
                    rowsPerPageOptions={[100]}
                    checkboxSelection
                    disableSelectionOnClick
                    pagination
                    paginationMode="server"
                    rowCount={pageStateOnSearch?.total}
                    // onCellClick={(rows) =>
                    //   console.log(rows.row)
                    //   setSelectedRowData(rows.row)
                    // }
                    keepNonExistentRowsSelected
                    onCellClick={(rows) => {
                      // prevent modal to open when the barcode/gtin column is clicked as it contains copy barcode option
                      if (rows.field !== 'gtin') {
                        handleCellClickToVerifyGtin(rows);
                      }
                    }}
                    getRowId={(row) => row.gtin}
                    onSelectionModelChange={(ids) => handleRowItemOnCheckboxSelection(ids)}
                    selectionModel={selectedList}
                    sx={{ borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px' }}
                    onPageChange={(newPage) => {
                      inventoryTableData({ pageNumber: newPage + 1 });
                    }}
                  />
                )}
              </div>
            )}
          </Box>
        </SoftBox>
      </DashboardLayout>
      <Modal
        open={openModal}
        onClose={handleCloseModel}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box
          // sx={{
          //   position: 'absolute',
          //   top: '50%',
          //   left: '50%',
          //   transform: 'translate(-50%, -50%)',
          //   p: 4,
          //   width: '50%',
          //   height: '90%',
          //   margin: 'auto',
          //   overflow: 'auto',
          // }}
          sx={{
            width: '60vw',
            height: '80vh',
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'center',
            margin: 'auto',
            marginTop: '6rem',
            borderRadius: '1rem',
            overflow: 'auto',
            padding: '2rem',
            position: 'relative',
          }}
          // className="batch-box-inventory-i"
          // id="inventory-adjustment-modal"
          className="custom-print-modal"
        >
          <SoftBox className="product-code">
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
              {gtinNum !== null ? (
                <SoftInput value={gtinNum} readOnly={true} />
              ) : (
                <Autocomplete
                  clearIcon={<Clear fontSize="small" onClick={() => setSearchProduct('')} />}
                  options={prodOptions || []}
                  // getOptionLabel={(option) => option.label}
                  onChange={(e, v) => handleAutoComplete(v)}
                  style={{ width: '100%' }}
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
              )}
              {verifyLoader ? (
                <Spinner />
              ) : !verifyLoader && verified ? (
                <Verified style={{ color: green[500] }} sx={{ position: 'relative', left: '2px' }} />
              ) : (
                <SoftBox className="wrapper-btn-box-inward-I">
                  <SoftButton
                    className="vefir-bnt"
                    onClick={handleVerifyGtin}
                    disabled={searchProduct === '' ? true : false}
                  >
                    Verify
                  </SoftButton>
                </SoftBox>
              )}
            </SoftBox>
          </SoftBox>

          {/* <SoftBox className="batch-ids">
            <SoftTypography component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
              Batch Ids
            </SoftTypography>
            <SoftSelect
              isDisabled={!batchIds.length ? true : false}
              placeholder="Eg: BT001"
              options={batchIds}
              onChange={(option) => handleBatchIds(option)}
            />
          </SoftBox> */}
          <SoftBox className="print-label-data">
            {totalBatchesData.length
              ? totalBatchesData.map((item, index) => (
                  <SoftBox
                    sx={{
                      display: 'flex',
                      // flexDirection: 'column',
                      marginTop: '2rem',
                      gap: '1rem',
                      width: '100%',
                      boxShadow: 'rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px',
                      borderRadius: '1rem',
                      padding: '1rem',
                    }}
                    key={item.gtin + index}
                  >
                    <input
                      // type="checkbox"
                      // checked={item.isChecked}
                      type="radio"
                      aria-labelledby="demo-controlled-radio-buttons-group"
                      name="radio-buttons-group"
                      onChange={(e) => handleRadioChange(e, item, index)}
                      style={{
                        cursor: 'pointer',
                      }}
                    />
                    <SoftBox className="batch-data">
                      <SoftTypography
                        component="label"
                        variant="caption"
                        fontWeight="bold"
                        textTransform="capitalize"
                        style={{ marginTop: '1rem' }}
                      >
                        Title : {item.itemName}
                      </SoftTypography>
                      <SoftTypography
                        component="label"
                        variant="caption"
                        fontWeight="bold"
                        textTransform="capitalize"
                        style={{ marginTop: '0.8rem', color: '#00000073' }}
                      >
                        UOM : {item.weightUOM}
                      </SoftTypography>
                      <SoftTypography
                        component="label"
                        variant="caption"
                        fontWeight="bold"
                        textTransform="capitalize"
                        style={{ marginTop: '0.8rem', color: '#00000073' }}
                      >
                        MRP : ₹{item.mrp}
                      </SoftTypography>
                      <SoftTypography
                        component="label"
                        variant="caption"
                        fontWeight="bold"
                        textTransform="capitalize"
                        style={{ marginTop: '0.8rem', color: '#00000073' }}
                      >
                        SP : ₹{item.sellingPrice}
                      </SoftTypography>
                      <SoftTypography
                        component="label"
                        variant="caption"
                        fontWeight="bold"
                        textTransform="capitalize"
                        style={{ marginTop: '0.8rem', color: '#00000073' }}
                      >
                        Expiration Date : {item.expirationDate}
                      </SoftTypography>
                      <SoftTypography
                        component="label"
                        variant="caption"
                        fontWeight="bold"
                        textTransform="capitalize"
                        style={{ marginTop: '0.8rem', color: '#00000073' }}
                      >
                        Barcode : {item.gtin}
                      </SoftTypography>
                      <SoftTypography
                        component="label"
                        variant="caption"
                        fontWeight="bold"
                        textTransform="capitalize"
                        style={{ marginTop: '0.8rem', color: '#00000073' }}
                      >
                        Batch ID : {item.batchNo}
                      </SoftTypography>
                      {customBatchData.gtin == item.gtin && customBatchDataIndex == index ? (
                        <Box
                          sx={{
                            marginTop: '0.8rem',
                          }}
                        >
                          <SoftTypography
                            component="label"
                            variant="caption"
                            fontWeight="bold"
                            textTransform="capitalize"
                            style={{ marginTop: '0.8rem', color: '#00000073' }}
                          >
                            Print Quantity
                          </SoftTypography>
                          <SoftInput
                            value={customPrintQty}
                            inputProps={{ min: 1 }}
                            type="number"
                            min="1"
                            placeholder="Enter Print Quantity e.g. 1,5,10"
                            onChange={(e) => handleCustomPrintQty(e, item)}
                            sx={{
                              width: '5rem',
                            }}
                            onKeyPress={(e) => handleNegativeVal(e)}
                          />
                        </Box>
                      ) : null}

                      {/* {item.isChecked ? (
                        <Box
                          sx={{
                            marginTop: '0.8rem',
                          }}
                        >
                          <SoftInput
                            inputProps={{ min: 1 }}
                            type="number"
                            min="1"
                            placeholder="Enter Print Quantity e.g. 1,5,10"
                            onChange={(e) => handleCustomPrintQty(e, item)}
                          />
                        </Box>
                      ) : null} */}
                    </SoftBox>
                  </SoftBox>
                ))
              : null}
          </SoftBox>
          <SoftBox
            className="cancel-print"
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '1rem',
              marginTop: '1rem',
            }}
          >
            <SoftButton
              variant={buttonStyles.secondaryVariant}
              className="outlined-softbutton"
              onClick={handleCloseModel}
            >
              Cancel
            </SoftButton>
            <SoftButton
              disabled={!totalBatchesData.length ? true : false}
              // variant="gradient"
              // variant={buttonStyles.primaryVariant}
              // className="contained-softbutton"
              className="print-btn"
              onClick={handleCustomPrint}
            >
              Print
            </SoftButton>
          </SoftBox>
        </Box>
      </Modal>

      <Modal
        open={openBulkModal}
        onClose={handleCloseBulkModel}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box
          sx={{
            width: '60vw',
            height: '50vh',
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'center',
            margin: 'auto',
            marginTop: '6rem',
            borderRadius: '1rem',
            overflow: 'auto',
            padding: '2rem',
            position: 'relative',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.8rem',
            }}
          >
            <SoftTypography
              component="label"
              variant="caption"
              fontWeight="bold"
              textTransform="capitalize"
              style={{ marginTop: '0.8rem', color: '#00000073' }}
            >
              Label print type
            </SoftTypography>
            <SoftSelect
              value={printType}
              placeholder="Select print type"
              options={[
                {
                  value: '40x20',
                  label: '40x20',
                },
                {
                  value: '40x20x3',
                  label: '40x20x3',
                },
                {
                  value: '40x20x3zebra',
                  label: '40x20x3zebra',
                },
                {
                  value: '40x20x3godex',
                  label: '40x20x3godex',
                },
                {
                  value: '40x20_nfs',
                  label: 'Not For Sale (40x20)',
                },
                {
                  value: '100x50',
                  label: '100x50',
                },

                {
                  value: '80x35',
                  label: '80x35',
                },
                {
                  value: '50x40',
                  label: '50x40',
                },

                {
                  value: '50x50',
                  label: '50x50',
                },
                {
                  value: '40x25',
                  label: '40x25',
                },
                {
                  value: '50x25',
                  label: '50x25',
                },
              ]}
              onChange={(option) => handlePrintType(option)}
            />
            <SoftBox
              className="cancel-print"
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '1rem',
                marginTop: '1rem',
              }}
            >
              <SoftButton
                variant={buttonStyles.secondaryVariant}
                className="outlined-softbutton"
                onClick={handleCloseBulkModel}
              >
                Cancel
              </SoftButton>
              <SoftButton
                //  variant="gradient"
                variant={buttonStyles.primaryVariant}
                className="contained-softbutton"
                onClick={handleModalBulkPrint}
              >
                Bulk Print
              </SoftButton>
            </SoftBox>
          </Box>
        </Box>
      </Modal>
      <Modal
        open={customPrintModal}
        onClose={handleCloseCustomPrintModel}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box
          sx={{
            width: '60vw',
            height: '50vh',
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'center',
            margin: 'auto',
            marginTop: '6rem',
            borderRadius: '1rem',
            overflow: 'auto',
            padding: '2rem',
            position: 'relative',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.8rem',
            }}
          >
            <SoftTypography
              component="label"
              variant="caption"
              fontWeight="bold"
              textTransform="capitalize"
              style={{ marginTop: '0.8rem', color: '#00000073' }}
            >
              Label print type
            </SoftTypography>
            <SoftSelect
              value={printType}
              placeholder="Select print type"
              options={[
                {
                  value: '40x20',
                  label: '40x20',
                },
                {
                  value: '40x20x3',
                  label: '40x20x3',
                },
                {
                  value: '40x20x3zebra',
                  label: '40x20x3zebra',
                },
                 {
                  value: '40x20x3godex',
                  label: '40x20x3godex',
                },
                {
                  value: '40x20_nfs',
                  label: 'Not For Sale (40x20)',
                },
                {
                  value: '100x50',
                  label: '100x50',
                },
                {
                  value: '80x35',
                  label: '80x35',
                },
                {
                  value: '50x40',
                  label: '50x40',
                },
                {
                  value: '50x50',
                  label: '50x50',
                },
                {
                  value: '40x25',
                  label: '40x25',
                },
                {
                  value: '50x25',
                  label: '50x25',
                },
              ]}
              onChange={(option) => handlePrintType(option)}
            />
            <SoftBox
              classNatBome="cancel-print"
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '1rem',
                marginTop: '1rem',
              }}
            >
              <SoftButton
                onClick={handleCloseCustomPrintModel}
                variant={buttonStyles.secondaryVariant}
                className="outlined-softbutton"
              >
                Cancel
              </SoftButton>
              <SoftButton
                variant={buttonStyles.primaryVariant}
                className="contained-softbutton"
                onClick={handleModalCustomPrint}
              >
                Custom Print
              </SoftButton>
            </SoftBox>
          </Box>
        </Box>
      </Modal>
      <Modal
        open={indivPrintModal}
        onClose={handleCloseIndivPrintModel}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box
          sx={{
            width: '60vw',
            height: '50vh',
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'center',
            margin: 'auto',
            marginTop: '6rem',
            borderRadius: '1rem',
            overflow: 'auto',
            padding: '2rem',
            position: 'relative',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.8rem',
            }}
          >
            <SoftTypography
              component="label"
              variant="caption"
              fontWeight="bold"
              textTransform="capitalize"
              style={{ marginTop: '0.8rem', color: '#00000073' }}
            >
              Label print type
            </SoftTypography>
            <SoftSelect
              value={printType}
              placeholder="Select print type"
              options={[
                {
                  value: '40x20',
                  label: '40x20',
                },
                {
                  value: '40x20x3',
                  label: '40x20x3',
                },
                {
                  value: '40x20x3zebra',
                  label: '40x20x3zebra',
                },
                 {
                  value: '40x20x3godex',
                  label: '40x20x3godex',
                },
                {
                  value: '40x20_nfs',
                  label: 'Not For Sale (40x20)',
                },
                {
                  value: '100x50',
                  label: '100x50',
                },
                {
                  value: '80x35',
                  label: '80x35',
                },
                {
                  value: '50x40',
                  label: '50x40',
                },
                {
                  value: '50x50',
                  label: '50x50',
                },

                {
                  value: '40x25',
                  label: '40x25',
                },
                {
                  value: '50x25',
                  label: '50x25',
                },
              ]}
              onChange={(option) => handlePrintType(option)}
            />

            <Box
              sx={{
                // marginTop: '0.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.8rem',
              }}
            >
              <SoftTypography
                component="label"
                variant="caption"
                fontWeight="bold"
                textTransform="capitalize"
                style={{ marginTop: '0.8rem', color: '#00000073' }}
              >
                Print Quantity
              </SoftTypography>
              <SoftInput
                value={printQuantity}
                inputProps={{ min: 1 }}
                type="number"
                min="1"
                placeholder="Enter Print Quantity e.g. 1,5,10"
                onChange={handlePrintQty}
                onKeyPress={(e) => handleNegativeVal(e)}
              />
            </Box>
            <SoftBox
              className="cancel-print"
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '1rem',
                marginTop: '1rem',
              }}
            >
              <SoftButton
                onClick={handleCloseIndivPrintModel}
                variant={buttonStyles.secondaryVariant}
                className="outlined-softbutton"
              >
                Cancel
              </SoftButton>
              <SoftButton
                // variant={buttonStyles.primaryVariant}
                className="print-btn"
                // className="contained-softbutton"
                onClick={handleModalIndivPrint}
              >
                Print
              </SoftButton>
            </SoftBox>
          </Box>
        </Box>
      </Modal>

      {/* <Print
        selectedRowData={selectedRowData}
        setSelectedRowData={setSelectedRowData}
        bulkPrintLabelData={bulkPrintLabelData}
        setBulkPrintLabelData={setBulkPrintLabelData}
        filteredBatchesData={filteredBatchesData}
        setFilteredBatchesData={setFilteredBatchesData}
        print={print}
        style={{ display: 'none' }}
        setPrint={setPrint}
      />  */}
    </>
  );
};

export default ProductLabel;
