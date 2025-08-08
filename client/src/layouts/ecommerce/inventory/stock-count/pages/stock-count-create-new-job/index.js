import './index.css';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  Autocomplete,
  Button,
  Checkbox,
  CircularProgress,
  Grid,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  TextField,
} from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { useEffect, useMemo, useState } from 'react';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import CloseIcon from '@mui/icons-material/Close';

import { ProductsListModal } from './components/products-list-modal';
import {
  createNewStockCountJob,
  getAllOrgUsers,
  getAllRoles,
  getItemsByType,
  getProductGroupData,
  stockCountFileUpload,
  validateGtinsFromUploadedFile,
} from '../../../../../../config/Services';
import { textFormatter } from '../../../../Common/CommonFunction';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../../../../../hooks/SnackbarProvider';
import DashboardLayout from '../../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../../examples/Navbars/DashboardNavbar';
import SkeletonLoader from '../../../../sales-channels/ods/orderDisplay/components/SkeletonLoader';
import SoftBox from '../../../../../../components/SoftBox';
import SoftButton from '../../../../../../components/SoftButton';
import SoftInput from '../../../../../../components/SoftInput';
import SoftSelect from '../../../../../../components/SoftSelect';
import SoftTypography from '../../../../../../components/SoftTypography';
import dayjs from 'dayjs';
import { styled } from '@mui/styles';
import BarcodeModal from './components/invalid-barcode-list-modal';

export const CreateNewJob = () => {
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const user = JSON.parse(localStorage.getItem('user_details'));
  const showSnackbar = useSnackbar();

  // <--- states
  const [jobTitle, setJobTitle] = useState('');
  const [jobType, setJobType] = useState({});
  const [frequency, setFrequency] = useState({});
  const [targettedProducts, setTargettedProducts] = useState(null);
  const [productGroup, setProductGroup] = useState({});
  const [saveLoader, setSaveLoader] = useState(false);

  // users list
  const [usersList, setUsersList] = useState([]);
  const [secondaryUsersList, setSecondaryUsersList] = useState([]);
  // counter/ assignee
  const [primaryAssignee, setPrimaryAssignee] = useState([]);
  const [primaryAssigneeArr, setPrimaryAssigneeArr] = useState([]);
  // secondary counter/ assignee
  const [secondaryAssignee, setSecondaryAssignee] = useState([]);
  const [secondaryAssigneeArr, setSecondaryAssigneeArr] = useState([]);

  // primary
  const [startDate, setStartDate] = useState('');
  const [inwardStartDate, setInwardStartDate] = useState('');
  const [productsPerCounter, setProductsPerCounter] = useState('');
  const [cycleStartTime, setCycleStartTime] = useState('');
  const [estimatedEffortToComplete, setEstimatedEffortToComplete] = useState('');

  // secondary
  const [secondaryStartDate, setSecondaryStartDate] = useState('');
  const [secondaryProductsPerCounter, setSecondaryProductsPerCounter] = useState('');
  const [secondaryCycleStartTime, setSecondaryCycleStartTime] = useState('');
  const [secondaryEstimatedEffortToComplete, setSecondaryEstimatedEffortToComplete] = useState('');

  // checkboxes
  const [completionAlertCheckbox, setCompletionAlertCheckbox] = useState(false);
  const [excludeOutOfStockProductsCheckbox, setOutOfStockProductCheckbox] = useState(false);
  const [excludeOutOfStockBatchesCheckbox, setOutOfStockBatchesCheckbox] = useState(false);
  const [secondaryCountCheckbox, setSecondaryCountCheckBox] = useState(false);

  // selected products
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [outOfstockProductsGtin, setOutOfstockProductsGtin] = useState([]);
  const [selectedProductBeforeSave, setSelectedProductBeforeSave] = useState([]);
  // const [isOpenedOnce, setIsOpenedOnce] = useState(false);
  const [allSelected, setAllSelected] = useState(false);
  const [modalStatus, setModalStatus] = useState(false);
  const [productSearchValue, setProductSearchValue] = useState(null);

  //   main category
  const [mainCategoryList, setMainCategoryList] = useState([]);
  const [selectedMainCategory, setSelectedMainCategory] = useState({});
  const [totalProductsFound, setTotalProductsFound] = useState(0);

  // manufacturer
  const [brandsList, setBrandsList] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState({});

  // products list
  const [tableRows, setTableRows] = useState([]);
  const [pageState, setPageState] = useState({
    loading: false,
    datRows: [],
    totalResults: 0,
    totalPages: 0,
    page: 1,
    pageSize: 200,
  });

  //filter functionlaity
  const [counterInputValue, setCounterInputValue] = useState('');

  const handleCounterInputChange = (event) => {
    if (event.type !== 'keydown' || event.type !== 'keypress' || event.type !== 'keyup') {
      return;
    }
    setCounterInputValue(event.target.value);
  };

  const filteredOptions = useMemo(() => {
    if (counterInputValue === '') {
      return usersList;
    }
    if (counterInputValue !== 0) {
      return usersList.filter((option) => {
        return option?.label?.toLowerCase()?.includes(counterInputValue?.toLowerCase());
      });
    }
  });

  //loader
  const [productGroupLoader, setProductGroupLoader] = useState(false);
  const [productGroupItemLoader, setProductGroupItemLoader] = useState(false);

  const navigate = useNavigate();

  let formData = {
    title: jobTitle,
    locationId: locId,
    jobType: jobType?.value,
    frequency:
      jobType?.value === 'ONETIME' || jobType?.value === 'OPEN' || jobType?.value === 'CUSTOM'
        ? 'NONE'
        : jobType?.value === 'CYCLE'
        ? frequency?.value
        : '',
    productFilter: {
      fieldName: productGroup?.value === 'CATEGORY' ? 'CATEGORY' : productGroup?.value === 'BRAND' ? 'BRAND' : '',
      fieldValue:
        productGroup?.value === 'CATEGORY'
          ? selectedMainCategory?.value || ''
          : productGroup?.value === 'BRAND'
          ? selectedBrand?.value || ''
          : '',
    },
    // checkboxes - send alert, exclude out of stock products
    sendAlert: completionAlertCheckbox,
    excludeOutOfStock: excludeOutOfStockProductsCheckbox,
    excludeOutOfStockBatches: excludeOutOfStockBatchesCheckbox,
    inwardStartDate: inwardStartDate,
    // primary counter data
    startDate: startDate,
    startTime: cycleStartTime,
    productsPerCounter: productsPerCounter !== '' ? Number(productsPerCounter) : 0,
    estimatedTime: estimatedEffortToComplete !== '' ? Number(estimatedEffortToComplete) : 0,
    // counter/primary assignee
    // value: row?.firstName,
    // name: row?.firstName + ' ' + row?.secondName,
    // uidx: row?.uidx,
    // primaryAssignees: [
    //   {
    //     uidx: primaryAssignee.uidx || '',
    //     assigneeName: primaryAssignee.name || '',
    //   },
    // ],
    primaryAssignees: primaryAssigneeArr?.length !== 0 ? primaryAssigneeArr : primaryAssignee,
    // checkbox - enable secondary counter
    enableSecondaryCounter: secondaryCountCheckbox,
    // secondary counter data
    secondaryStartDate: secondaryStartDate,
    secondaryStartTime: secondaryCycleStartTime,
    secondaryProductsPerCounter: secondaryProductsPerCounter !== '' ? Number(secondaryProductsPerCounter) : 0,
    secondaryEstimatedTime: secondaryEstimatedEffortToComplete !== '' ? Number(secondaryEstimatedEffortToComplete) : 0,
    // counter 2/ secondary assigneee
    // secondaryAssignees: [
    //   {
    //     uidx: '',
    //     assigneeName: '',
    //   },
    // ],
    secondaryAssignees: secondaryAssigneeArr?.length !== 0 ? secondaryAssigneeArr : secondaryAssignee,
    // productIds-array of objects, store the selected products with key id
    productIds: selectedProducts?.length === tableRows?.length ? [] : selectedProducts?.map((row) => row?.gtin),

    createdBy: user?.uidx,
    createdByName: user?.firstName + ' ' + user?.secondName,
    organizationId: orgId,
    targetProduct: Number(targettedProducts),
  };

  // end of states --->
  //   get main category lists

  //product group data
  const getProductGroupDataFunction = (productGroupType) => {
    setTableRows([]);
    setProductGroupLoader(true);
    setProductGroup(productGroupType);
    getProductGroupData(locId, productGroupType.value)
      .then((res) => {
        if (res?.data?.data?.es > 0 || res?.data?.code === 'ECONNRESET') {
          setMainCategoryList([]);
          setBrandsList([]);
          setProductGroupLoader(false);
          showSnackbar(res?.data?.data?.message || res?.data?.message || 'Some Error Occured', 'error');
          return;
        }
        const list = res?.data?.data?.datas
          ?.filter((item) => {
            if (item !== null || item !== '') {
              return item;
            }
          })
          .map((item) => {
            const sentenceCaseItem = item?.charAt(0).toUpperCase() + item?.slice(1).toLowerCase();
            return {
              value: item,
              label: sentenceCaseItem,
            };
          });
        if (productGroupType.value === 'CATEGORY') {
          setMainCategoryList(list);
        } else if (productGroupType.value === 'BRAND') {
          setBrandsList(list);
        } else if (productGroupType.value === 'LAYOUT') {
          // set layout list
        } else {
          setMainCategoryList([]);
          setBrandsList([]);
        }
        setProductGroupLoader(false);
      })
      .catch((err) => {
        showSnackbar(err?.response?.data?.message || 'Some error occurred while fetching product group data', 'error');
        setMainCategoryList([]);
        setBrandsList([]);
        setProductGroupLoader(false);
      });
  };
  const itemThroughProductGroup = (item, exculdeOutStock, newCall, excludeOutOfStockBatch, startDateOfInward) => {
    setProductGroupItemLoader(true);
    const payload = {
      type: productGroup?.value,
      locationId: locId,
      values: item?.value,
      excludeOutOfStock: exculdeOutStock || excludeOutOfStockProductsCheckbox,
      excludeOutOfStockBatches: excludeOutOfStockBatch || excludeOutOfStockBatchesCheckbox,
      inwardStartDate:
        startDateOfInward === null || startDateOfInward === undefined ? inwardStartDate : startDateOfInward,
      text: productSearchValue,
    };
    getItemsByType(payload)
      .then((res) => {
        let dataArr = [];
        if (res?.data?.status === 'ERROR') {
          showSnackbar('Some Error Occured', 'error');
          setTableRows([]);
          setSelectedProducts([]);
          setPageState((prev) => ({ ...prev, loading: false, totalResults: dataArr?.length }));
          setProductGroupItemLoader(false);
          return;
        }
        if (res?.data?.data?.es > 0) {
          // setTableRows((prev) => [...prev]); // clear the table rows
          setTableRows([]);
          setSelectedProducts([]);
          showSnackbar(res?.data?.data?.message || res?.data?.message || 'Some Error Occured', 'error');
          setPageState((prev) => ({ ...prev, loading: false, totalResults: dataArr?.length }));
          setProductGroupItemLoader(false);
          return;
        }
        dataArr = res?.data?.data?.productDtos;
        setPageState((prev) => ({
          ...prev,
          // totalPages: dataArr ? dataArr?.totalPages : 0,
          totalResults: res?.data?.data?.totalProducts,
        }));

        // dataRow.push(
        const newRows = dataArr?.map((row, index) => {
          return {
            id: index,
            product: textFormatter(row?.itemName),
            gtin: row?.gtin || 'NA',
            mrp: row?.mrp || 'NA',
            // category: textFormatter(row?.product?.main_category) || 'NA',
            // manufacturer: textFormatter(row?.product?.company_detail?.name),
            brand: textFormatter(row?.brand) || 'NA',
            availableUnits: row?.availableUnits || 'NA',
            weightUOM: row?.weightUOM || 'NA',
          };
        });

        const selectingProducts = newRows?.map((row) => {
          return {
            gtin: row?.gtin,
            isOutOfStock: row?.availableUnits === 'NA' || row?.availableUnits === 0 ? true : false,
          };
        });

        if ((newCall === true || selectedProducts?.length === tableRows?.length) && !modalStatus) {
          setSelectedProducts(selectingProducts);
          setSelectedProductBeforeSave(selectingProducts);
          setOutOfstockProductsGtin(selectingProducts);
        } else if (!allSelected && !modalStatus) {
          if (excludeOutOfStockProductsCheckbox || excludeOutOfStockBatchesCheckbox || inwardStartDate) {
            const newSelectedProducts = selectedProducts?.filter((row) => row?.isOutOfStock === false);
            setOutOfstockProductsGtin(selectedProducts);
            setSelectedProducts(newSelectedProducts);
            setSelectedProductBeforeSave(newSelectedProducts);
          } else {
            setSelectedProducts(outOfstockProductsGtin);
            setSelectedProductBeforeSave(outOfstockProductsGtin);
          }
        }
        setTableRows(newRows);
        setPageState((prev) => ({ ...prev, loading: false }));
        showSnackbar(`${res?.data?.data?.totalProducts} products found`, 'success');
        setProductGroupItemLoader(false);
      })
      .catch((err) => {
        setSelectedProducts([]);
        setTableRows([]);
        setProductGroupItemLoader(false);
        setPageState((prev) => ({ ...prev, totalPages: 0, totalResults: 0 }));
        showSnackbar(err?.response?.data?.message || 'Something went wrong while fetching products', 'error');
        setProductGroupItemLoader(false);
      });
  };

  const handleJobTypeChange = (option) => {
    if (option?.value === 'OPEN') {
      itemThroughProductGroup();
    }
    setJobType(option);
    setProductGroup({});
    setSelectedMainCategory({});
    setSelectedBrand({});
    setTargettedProducts(null);
  };

  const selectDeselectProducts = () => {
    if (selectedProducts.length === tableRows?.length) {
      setSelectedProducts([]);
      setAllSelected(false);
    } else {
      const updatedSelectedProducts = tableRows?.map((row) => ({
        gtin: row?.gtin,
        isOutOfStock: row?.availableUnits === 'NA' || row?.availableUnits === 0 ? true : false,
      }));
      setSelectedProducts(updatedSelectedProducts);
      setAllSelected(true);
    }
  };

  useEffect(() => {
    if (productGroup?.value && (selectedBrand?.value || selectedMainCategory?.value)) {
      if (excludeOutOfStockProductsCheckbox) {
        itemThroughProductGroup(productGroup?.value === 'CATEGORY' ? selectedMainCategory : selectedBrand, true);
      } else {
        itemThroughProductGroup(productGroup?.value === 'CATEGORY' ? selectedMainCategory : selectedBrand, null);
      }
    }
  }, [excludeOutOfStockProductsCheckbox]);

  useEffect(() => {
    if (productGroup?.value && (selectedBrand?.value || selectedMainCategory?.value)) {
      if (excludeOutOfStockBatchesCheckbox) {
        itemThroughProductGroup(
          productGroup?.value === 'CATEGORY' ? selectedMainCategory : selectedBrand,
          null,
          false,
          true,
        );
      } else {
        itemThroughProductGroup(
          productGroup?.value === 'CATEGORY' ? selectedMainCategory : selectedBrand,
          null,
          false,
          false,
        );
      }
    } else if (jobType?.value === 'OPEN') {
      if (excludeOutOfStockBatchesCheckbox) {
        itemThroughProductGroup(null, null, false, true);
      } else {
        itemThroughProductGroup(null, null, false, false);
      }
    }
  }, [excludeOutOfStockBatchesCheckbox]);

  // const get all users list fn
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
                  name: textFormatter(row?.firstName + ' ' + row?.secondName),
                  uidx: row?.uidx,
                };
              });

              // name, assignee type - (primary, secondary), uidx
              setUsersList(newDataRows);
            })
            .catch((err) => {
              showSnackbar(err?.response?.data?.message || 'Some error occurred', 'error');
            });
        })
        .catch((err) => {
          showSnackbar(err?.response?.data?.message || 'Some error occurred', 'error');
        });
    }
  };

  // counter 1/ primary
  const handlePrimaryCounter = (option) => {
    option = option.map((el) => ({ ...el, assigneeName: el.label }));
    if (primaryAssignee?.length !== 0) {
      const updatedPrimaryAssignee = option?.map((assignee) => {
        const { name, label, value, ...rest } = assignee;
        return rest;
      });
      setPrimaryAssigneeArr(updatedPrimaryAssignee);
    }
    setPrimaryAssignee(option);
  };

  // counter 2/ secondary
  const handleSecondaryCounter = (option) => {
    option = option.map((el) => ({ ...el, assigneeName: el.label }));
    if (secondaryAssignee?.length !== 0) {
      const updatedSecondaryAssignee = option.map((assignee) => {
        const { name, label, value, ...rest } = assignee;
        return rest;
      });
      setSecondaryAssigneeArr(updatedSecondaryAssignee);
    }
    setSecondaryAssignee(option);
  };

  // console.log('formdata', formData);

  const handleSaveJobValidation = (jobType) => {
    if (jobType === undefined) {
      showSnackbar('Please select job type', 'error');
      return false;
    } else if (jobType === 'OPEN') {
      if (jobTitle === '' || jobTitle === undefined) {
        showSnackbar('Job Title is required', 'error');
        return false;
      } else if (targettedProducts === undefined || targettedProducts === null) {
        showSnackbar('Targetted Products is required', 'error');
        return false;
      } else if (primaryAssignee?.length === 0) {
        showSnackbar('Counter Assignee is required', 'error');
        return false;
      } else if (startDate === '') {
        showSnackbar('Start Date is required', 'error');
        return false;
      }
    } else if (jobType === 'ONETIME' || jobType === 'CYCLE') {
      if (jobType === 'CYCLE' && (frequency?.value === undefined || frequency?.value === '')) {
        showSnackbar('Frequency value is required', 'error');
        return false;
      }
      if (jobTitle === '' || jobTitle === undefined) {
        showSnackbar('Job Title is required', 'error');
        return false;
      } else if (productGroup?.value === undefined) {
        showSnackbar('Product Group is required', 'error');
        return false;
      } else if (
        productGroup?.value === 'CATEGORY' &&
        (selectedMainCategory?.label === undefined || selectedMainCategory?.label === '')
      ) {
        showSnackbar('Category is required', 'error');
        return false;
      } else if (
        productGroup?.value === 'BRAND' &&
        (selectedBrand?.label === undefined || selectedBrand?.label === '')
      ) {
        showSnackbar('Brand is required', 'error');
        return false;
      } else if (primaryAssignee?.length === 0) {
        showSnackbar('Counter Assignee is required', 'error');
        return false;
      } else if (startDate === '') {
        showSnackbar('Start Date is required', 'error');
        return false;
      } else if (cycleStartTime === '') {
        showSnackbar('Cycle Start Time is required', 'error');
        return false;
      }
    }

    return true;
  };

  const handleSubmitFormData = async () => {
    try {
      // job title, jobtype, product group, counter, start date, cycle start time,
      const isValid = handleSaveJobValidation(jobType?.value);
      if (!isValid) {
        return;
      }
      setSaveLoader(true);

      let response ='';
      if (jobType?.value === 'CUSTOM') {
        // check for the uploaded file
        if (uploadedFileResponse === null || !uploadedFileResponse?.fileUrl) {
          showSnackbar('Something wrong with the uploaded file', 'error');
          return;
        }
        const payload = {
          title: formData?.title,
          locationId: formData?.locationId,
          organizationId: formData?.organizationId,
          excludeOutOfStock: formData?.excludeOutOfStock,
          excludeOutOfStockBatches: formData?.excludeOutOfStockBatches,
          fileUrl: uploadedFileResponse?.fileUrl || '',
          inwardStartDate: formData?.inwardStartDate,
          jobType: formData?.jobType,
          frequency: 'NONE',
          sendAlert: formData?.sendAlert,
          startDate: formData?.startDate,
          startTime: formData?.startTime,
          productsPerCounter: formData?.productsPerCounter,
          estimatedTime: formData?.estimatedTime,
          primaryAssignees: formData?.primaryAssignees,
          createdBy: formData?.createdBy,
          createdByName: formData?.createdByName,
          productIds: formData?.productIds,
        };

        response = await validateGtinsFromUploadedFile(payload);
      } else if (jobType?.value === 'ONETIME') {
        formData = {
          ...formData,
          exhaustiveProductCount: pageState?.totalResults, // Only added when jobType is ONETIME
        };
      }
      response = await createNewStockCountJob(formData);

      if (response?.data?.data.es === 0) {
        localStorage.setItem('jobCreationStatus', response?.data?.data?.message);
        showSnackbar('Job Created Successfully', 'success');
        navigate('/inventory/stock-count');
      } else {
        showSnackbar(response?.data?.data?.message, 'error');
      }
    } catch (err) {
      console.log(err);
      showSnackbar(err?.response?.data?.message || 'Something went wrong while creating job', 'error');
    } finally {
      setSaveLoader(false);
    }
  };

  // end of functions --->

  // <--- useeffects
  useEffect(() => {
    getAllUsers();
  }, []);

  useEffect(() => {
    if (productSearchValue !== null) {
      itemThroughProductGroup(productGroup?.value === 'CATEGORY' ? selectedMainCategory : selectedBrand, null);
    }
  }, [productSearchValue]);

  // file upload for stock count
  const [fileUploadLoader, setFileUploadLoader] = useState(false);
  const [uploadedFileResponse,setUploadedFileResponse] = useState(null);

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });
    
  const [selectedFile, setSelectedFile] = useState(null);
  const [isFileSelected, setIsFileSelected] = useState(false);

  const handleIconClick = (e) => {
    document.getElementById('file-input').click();
  };

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    setSelectedFile(uploadedFile);
    setIsFileSelected(true);
    if (uploadedFile?.length === 0) {
      setSelectedFile(null);
      setIsFileSelected(false);
      // showSnackbar('No files selected', 'error');
      return;
    }
  };

  const handleFileRemove = () => {
    setIsFileSelected(false);
  };

  const uploadFileStockCount = async() => {
    try {
      if(fileUploadLoader){
        return;
      }
      setFileUploadLoader(true);

      const filePayload = new Blob([selectedFile], { type: 'text/csv' });
      const formData = new FormData();
      formData.append('file', filePayload);

      const response = await stockCountFileUpload(locId, formData);
      if(response?.data?.data?.es){
        showSnackbar('Something went wrong', 'error');
        setUploadedFileResponse(null);
        setFileUploadLoader(false);
        return;
      }

      setUploadedFileResponse({
        fileUrl: response?.data?.data?.fileUrl,
        invalidGtins: response?.data?.data?.invalidGtins
      })
      setFileUploadLoader(false);
    }catch(err){
      showSnackbar('Something went wrong', 'error');
      setUploadedFileResponse(null);
      setFileUploadLoader(false);
    }
  }

  useEffect(() => {
    if(isFileSelected){
      setTimeout(() => {
        uploadFileStockCount();
      }, 300);
    }
  },[isFileSelected, selectedFile]);

  //<-- modal form invalid barcodes 
  const [isModalOpen, setModalOpen] = useState(false);
  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);
  // -->

  const renderDisplayProductsFound = () => {
    if (jobType?.value === 'OPEN') {
      return `${pageState?.totalResults} products`;
    }
  
    if (jobType?.value !== 'CUSTOM' && productGroup?.label) {
      const selectedProductCount = selectedProducts?.length || 0;
      return `${pageState?.totalResults} products found, ${selectedProductCount} selected`;
    }
  
    if (!fileUploadLoader && selectedFile) {
      const invalidBarcodesCount = uploadedFileResponse?.invalidGtins?.length ?? 0;
      return `${invalidBarcodesCount} invalid barcodes found`;
    }
  
    return '';
  };

  const handleDownloadCustomTemplate = () => {
    // sample file upload template 
    const fileUrl = 'https://storage.googleapis.com/twinleaves_stage_public/Sample_template.csv'; 
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileUrl.split('/').pop(); // Extracts the file name from URL
    link.click();
    link.remove();
  };
  
  return (
    <DashboardLayout>
      <DashboardNavbar prevLink={true} />
      <SoftBox className="container-card">
        <Grid container spacing={1} justifyContent="flex-start" columnGap="30px">
          <Grid item xs={12} sm={12} md={4} xl={4}>
            <InputLabel required sx={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '8px' }}>
              Job Title
            </InputLabel>
            <SoftInput placeholder="Enter Job Title" onChange={({ target }) => setJobTitle(target.value)} />
          </Grid>
          {jobType?.value === 'CYCLE' && <Grid item xs={12} sm={12} md={4} xl={4}></Grid>}
          <Grid item xs={12} sm={12} md={4} xl={4}>
            <InputLabel required sx={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '8px' }}>
              Job Type
            </InputLabel>
            <SoftSelect
              className="soft-select-white-bg"
              placeholder="Select Job Type"
              options={[
                { value: 'OPEN', label: 'Open' },
                { value: 'ONETIME', label: 'One Time' },
                // { value: 'CYCLE', label: 'Cycle' },
                { value: 'CUSTOM', label: 'Custom' },
              ]}
              onChange={(option) => handleJobTypeChange(option)}
            />
          </Grid>

          {jobType?.value !== undefined && (
            <>
              {jobType?.value === 'ONETIME' || jobType?.value === 'OPEN' || jobType?.value === 'CUSTOM' ? null : (
                <>
                  <Grid item xs={12} sm={12} md={4} xl={4}>
                    <InputLabel required sx={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '8px' }}>
                      Frequency
                    </InputLabel>
                    <SoftSelect
                      className="soft-select-white-bg"
                      placeholder="Select Frequency"
                      // isDisabled={true}
                      options={[
                        { value: 'DAILY', label: 'Daily' },
                        { value: 'WEEKLY', label: 'Weekly' },
                        { value: 'MONTHLY', label: 'Monthly' },
                        { value: 'YEARLY', label: 'Yearly' },
                      ]}
                      onChange={(option) => setFrequency(option)}
                    />
                  </Grid>
                </>
              )}
              {jobType?.value === 'OPEN' && (
                <>
                  <Grid item xs={12} sm={12} md={4} xl={4}>
                    <InputLabel required sx={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '8px' }}>
                      Targetted Products (Per Counter)
                    </InputLabel>
                    <SoftInput
                      className="soft-select-white-bg"
                      placeholder="Select Frequency"
                      // isDisabled={true}
                      type="number"
                      onChange={(e) => setTargettedProducts(e.target.value)}
                    />
                  </Grid>
                </>
              )}
              {/* <-- file upload */}
              {jobType?.value === 'CUSTOM' && (
                <>
                  <Grid item xs={12} sm={12} md={4} xl={4}>
                    <InputLabel required sx={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '8px' }}>
                      Upload CSV File (Ex - <span className='stock-count-file-template' onClick={handleDownloadCustomTemplate}>Template</span>)
                    </InputLabel>
                    {isFileSelected ? (
                      <SoftBox style={{ display: 'flex', gap: '5px', alignItems: 'center', cursor: 'pointer' }}>
                        <SoftButton
                          component="label"
                          // role={undefined}
                          className="contained-softbutton"
                          tabIndex={-1}
                          startIcon={<CloudUploadIcon />}
                        >
                          Replace File
                          <VisuallyHiddenInput type="file" id="file-input" accept=".csv" onChange={handleFileChange} />
                        </SoftButton>
                        <IconButton size="small" onClick={handleFileRemove}>
                          <CloseIcon />
                        </IconButton>
                      </SoftBox>
                    ) : (
                      <SoftButton
                        component="label"
                        // role={undefined}
                        className="contained-softbutton"
                        tabIndex={-1}
                        startIcon={<CloudUploadIcon />}
                      >
                        Upload File
                        <VisuallyHiddenInput type="file" id="file-input" accept=".csv" onChange={handleFileChange} />
                      </SoftButton>
                    )}
                  </Grid>
                </>
              )}
              {/* --> */}
            </>
          )}
          {(jobType?.value === 'ONETIME' || jobType?.value === 'CYCLE') && (
            <Grid item xs={12} sm={12} md={4} xl={4}>
              <InputLabel required sx={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '8px' }}>
                Product Group
              </InputLabel>
              <SoftSelect
                className="soft-select-white-bg"
                placeholder="Select Product Group"
                {...(productGroup.label
                  ? {
                      value: {
                        value: productGroup?.value,
                        label: productGroup.label,
                      },
                    }
                  : {
                      value: {
                        value: '',
                        label: 'Select Product Group',
                      },
                    })}
                options={[
                  { value: 'BRAND', label: 'Brand' },
                  { value: 'LAYOUT', label: 'Layout' },
                  { value: 'CATEGORY', label: 'Category' },
                ]}
                onChange={(option) => getProductGroupDataFunction(option)}
              />
            </Grid>
          )}
          {/* show only when product group is selected  */}
          {productGroup?.value !== undefined || jobType?.value === 'OPEN' ? (
            <>
              {productGroup?.value === 'BRAND' ? (
                !productGroupLoader ? (
                  <Grid item xs={12} sm={12} md={4} xl={4}>
                    <InputLabel required sx={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '8px' }}>
                      Brand
                    </InputLabel>
                    <SoftSelect
                      className="soft-select-white-bg"
                      placeholder="Select Brand"
                      name="brand"
                      {...(selectedBrand?.label
                        ? {
                            value: {
                              value: selectedBrand?.value,
                              label: selectedBrand?.label,
                            },
                          }
                        : {
                            value: {
                              value: '',
                              label: 'Select Brand',
                            },
                          })}
                      options={brandsList}
                      onChange={(option, e) => {
                        // console.log(option);
                        setTableRows([]);
                        setSelectedProducts([]);
                        setSelectedBrand(option);
                        // setIsOpenedOnce(false);
                        itemThroughProductGroup(option, null, true);
                      }}
                    />
                  </Grid>
                ) : (
                  <Grid item xs={12} sm={12} md={4} xl={4} className="skeleton-loader-productGroup">
                    <SkeletonLoader type="single-item" />
                  </Grid>
                )
              ) : productGroup?.value === 'LAYOUT' ? (
                <Grid item xs={12} sm={12} md={4} xl={4}>
                  <SoftTypography fontSize="14px" fontWeight="bold" mb={1}>
                    Layout
                  </SoftTypography>
                  <SoftSelect className="soft-select-white-bg" placeholder="Select Layout" />
                </Grid>
              ) : (
                productGroup?.value === 'CATEGORY' &&
                (!productGroupLoader ? (
                  <Grid item xs={12} sm={12} md={4} xl={4}>
                    <InputLabel required sx={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '8px' }}>
                      Category
                    </InputLabel>
                    <SoftSelect
                      className="soft-select-white-bg"
                      placeholder="Select Category"
                      name="category"
                      {...(selectedMainCategory?.label
                        ? {
                            value: {
                              value: selectedMainCategory?.value,
                              label: selectedMainCategory?.label,
                            },
                          }
                        : {
                            value: {
                              value: '',
                              label: 'Select Category',
                            },
                          })}
                      options={mainCategoryList}
                      onChange={(option, e) => {
                        setTableRows([]);
                        setSelectedProducts([]);
                        setSelectedMainCategory(option);
                        // setIsOpenedOnce(false);
                        itemThroughProductGroup(option, null, true);
                      }}
                    />
                  </Grid>
                ) : (
                  <Grid item xs={12} sm={12} md={4} xl={4} className="skeleton-loader-productGroup">
                    <SkeletonLoader type="single-item" />
                  </Grid>
                ))
              )}
              {excludeOutOfStockBatchesCheckbox && (
                <Grid item xs={12} sm={12} md={3} xl={3}>
                  <InputLabel sx={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '8px' }}>
                    Inward Start Date
                  </InputLabel>
                  <SoftInput
                    type="date"
                    placeholder="Select"
                    onChange={({ target }) => {
                      setInwardStartDate(target.value);
                      itemThroughProductGroup(
                        productGroup?.value === 'CATEGORY' ? selectedMainCategory : selectedBrand,
                        null,
                        false,
                        false,
                        target?.value,
                      );
                    }}
                  />
                  {/* <InputLabel  sx={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '8px' }}> */}
                </Grid>
              )}
            </>
          ) : (
            <Grid item xs={12} sm={12} md={4} xl={4}></Grid>
          )}

          <Grid item xs={12} sm={12} md={12} xl={12}>
            <div className="exclude-main-container">
              {jobType?.value !== 'OPEN' && (
                <SoftTypography
                  fontSize="14px"
                  mb={1}
                  mt={1}
                  className="cursorPointer"
                  onClick={() => {
                    setOutOfStockProductCheckbox(!excludeOutOfStockProductsCheckbox);
                  }}
                >
                  <Checkbox className="checkbox-css" checked={excludeOutOfStockProductsCheckbox} /> Exclude out-of-stock
                  products
                </SoftTypography>
              )}

              <SoftTypography
                fontSize="14px"
                mb={1}
                mt={1}
                className="cursorPointer"
                onClick={() => {
                  setOutOfStockBatchesCheckbox(!excludeOutOfStockBatchesCheckbox);
                  if (excludeOutOfStockBatchesCheckbox) {
                    setInwardStartDate('');
                  }
                }}
              >
                <Checkbox
                  className="checkbox-css"
                  checked={excludeOutOfStockBatchesCheckbox}
                  // onChange={() => setOutOfStockProductCheckbox(!excludeOutOfStockProductsCheckbox)}
                />{' '}
                Exclude out-of-stock batches
              </SoftTypography>
            </div>
          </Grid>
          <Grid item xs={12} sm={12} md={12} xl={12}>
            <div className="product-search-result-div">
              <div className="exclude-ostk">
                <div className="product-search-result-div">
                  <SoftTypography
                    color="primary"
                    fontSize="14px"
                    className="cursorPointer"
                    onClick={() => {
                      if(jobType?.value === 'CUSTOM'){
                        handleOpenModal();
                        return;
                      }
                      if (jobType?.value === 'OPEN') {
                        return;
                      }
                      setModalStatus(!modalStatus);
                      if (selectedProducts?.length === tableRows?.length) {
                        setAllSelected(true);
                      } else {
                        setAllSelected(false);
                      }
                    }}
                  >
                    {renderDisplayProductsFound()}
                  </SoftTypography>
                  {(productGroupItemLoader || fileUploadLoader) && (
                    <CircularProgress size={18} sx={{ color: '#0562fb !important', marginTop: '10px' }} />
                  )}
                </div>
              </div>
            </div>
          </Grid>
          <Grid item xs={12} sm={12} md={4} xl={4}>
            <InputLabel required sx={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '8px' }}>
              Counter
            </InputLabel>
            <Autocomplete
              id="multiple-limit-tags1"
              disableCloseOnSelect // Prevent the dropdown from closing when an option is selected
              // value={selectedBrandList}
              value={primaryAssignee}
              options={filteredOptions}
              getOptionLabel={(option) => option.label || ''}
              onChange={(e, v) => handlePrimaryCounter(v)}
              style={{ width: '100%' }}
              multiple
              onInputChange={handleCounterInputChange}
              limitTags={0}
              ListboxComponent={({ children, ...props }) => <List {...props}>{children}</List>}
              isOptionEqualToValue={(option, value) => option.uidx === value.uidx} // Add this line
              renderOption={(props, option, { selected }) => (
                <ListItem {...props} key={option.uidx}>
                  <Checkbox checked={selected} />
                  <ListItemText
                    primary={textFormatter(option.label)}
                    primaryTypographyProps={{ fontSize: '14px !important' }}
                  />
                </ListItem>
              )}
              renderTags={() => null} // hides the selected option
              renderInput={(params) => {
                return (
                  <TextField
                    className="limit-tag"
                    {...params}
                    // value={searchProduct}
                    // onChange={(e) => handleChangeBrands(e)}
                    placeholder={
                      primaryAssignee?.length === 0
                        ? 'Select Assignee'
                        : (primaryAssignee?.length === 1 && `${primaryAssignee?.length} assignee selected`) ||
                          `${primaryAssignee?.length} assignees selected`
                    }
                    variant="outlined"
                    fullWidth
                  />
                );
              }}
            />
          </Grid>
          {/* <Grid item xs={12} sm={12} md={4} xl={4}></Grid> */}
          <Grid item xs={12} sm={12} md={4} xl={4}>
            <InputLabel required sx={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '8px' }}>
              Start Date
            </InputLabel>
            <SoftInput type="date" placeholder="Select" onChange={({ target }) => setStartDate(target.value)} />
          </Grid>
          {/* <Grid item xs={12} sm={12} md={4} xl={4}>
            <SoftTypography fontSize="14px" fontWeight="bold" mb={1}>
              Products Per Counter
            </SoftTypography>
            <SoftInput
              placeholder="Enter product count per counter"
              value={productsPerCounter}
              onChange={({ target }) => setProductsPerCounter(target.value)}
            />
          </Grid> */}
          <Grid item xs={12} sm={12} md={4} xl={4}>
            <InputLabel required sx={{ fontWeight: 'bold', fontSize: '14px', marginBottom: '8px' }}>
              Cycle Start Time
            </InputLabel>
            <SoftBox>
              <LocalizationProvider dateAdapter={AdapterDayjs} pt={2}>
                <DemoContainer
                  components={['TimePicker']}
                  sx={{
                    paddingTop: '0',
                  }}
                >
                  <TimePicker
                    label="Select Start Time"
                    sx={{
                      width: '100%',
                      '& .MuiInputLabel-formControl': {
                        fontSize: '14px',
                        top: '-0.4rem',
                        color: '#344767 !important',
                        opacity: 0.8,
                      },
                      '& .MuiInputBase-formControl': {
                        paddingRight: '12px !important',
                        justifyContent: 'space-between',
                      },
                      //   '& .MuiOutlinedInput-root':{
                      //     padding:0
                      //   }
                    }}
                    // value={value}
                    onChange={(newValue) => {
                      const formattedTime = dayjs(newValue).format('hh:mm:ss');
                      setCycleStartTime(formattedTime);
                    }}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </SoftBox>
          </Grid>
          <Grid item xs={12} sm={12} md={4} xl={4}>
            <SoftTypography fontSize="14px" fontWeight="bold" mb={1}>
              Estimated Effort To Complete (minutes)
            </SoftTypography>
            <SoftBox>
              <SoftInput
                type="number"
                placeholder="Enter in minutes"
                onChange={({ target }) => setEstimatedEffortToComplete(target?.value)}
              />
            </SoftBox>
          </Grid>
        </Grid>
        <br />
        <SoftBox className="stock-taking-buttons">
          <SoftButton
            variant="outlined"
            className="outlined-softbutton"
            onClick={() => navigate('/inventory/stock-count')}
          >
            CANCEL
          </SoftButton>
          <SoftButton
            varinat="contained"
            className="contained-softbutton"
            onClick={handleSubmitFormData}
            disabled={saveLoader}
          >
            {/* {isCreatingStockSchedule ? <CircularProgress size={20} color="inherit" /> : 'SAVE'} */}
            SAVE
          </SoftButton>
        </SoftBox>
      </SoftBox>
      {/* prducts list modal  */}
      {tableRows?.length !== 0 && (
        <ProductsListModal
          selectedProductBeforeSave={selectedProductBeforeSave}
          setSelectedProductBeforeSave={setSelectedProductBeforeSave}
          selectDeselectProducts={selectDeselectProducts}
          setAllSelected={setAllSelected}
          allSelected={allSelected}
          modalStatus={modalStatus}
          tableRows={tableRows}
          totalPages={pageState.totalPages}
          totalResults={pageState.totalResults}
          pageState={pageState}
          selectedProducts={selectedProducts}
          setSelectedProducts={setSelectedProducts}
          setPageState={setPageState}
          setModalStatus={setModalStatus}
          setProductSearchValue={setProductSearchValue}
          productSearchValue={productSearchValue}
          productGroupItemLoader={productGroupItemLoader}
        />
      )}
      {/* to dislay invalid barcodes  */}
      {uploadedFileResponse?.invalidGtins && (
        <BarcodeModal open={isModalOpen} onClose={handleCloseModal} barcodes={uploadedFileResponse?.invalidGtins} />
      )}
      <br />
    </DashboardLayout>
  );
};
