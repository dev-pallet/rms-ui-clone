import './create-grn.css';
import {
  Box,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  Modal,
  Popover,
  TextField,
  TextareaAutosize,
  Typography,
} from '@mui/material';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import DashboardLayout from '../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../examples/Navbars/DashboardNavbar';
import './create-grn.css';
import SoftBox from '../../../../../components/SoftBox';
import { useState, useEffect, useRef, createRef, useMemo } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SoftTypography from '../../../../../components/SoftTypography';
import GrnItemTable from './components/itemTable';
import { buttonStyles } from '../../../Common/buttonColor';
import {
  createExpressPurchase,
  createV2ExpressPurchase,
  deleteExpressPurchase,
  deleteItemExpressPurchase,
  documentAISuggestion,
  expressGrnCreateMetric,
  getAllOrgUsers,
  getDetailsByDocumentAI,
  itemDetailsExpressPurchase,
  startExpressPurchaseEvent,
  uploadGRNInvoiceBill,
} from '../../../../../config/Services.js';
import { statesCode } from '../../../Common/stateFunction';
import { useDebounce } from 'usehooks-ts';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from '../../../../../hooks/SnackbarProvider';
import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import CloseRoundedIcon from '@mui/icons-material/Close';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import { useSoftUIController } from '../../../../../context';
import FilterGRNComponent from './Filter-GRN/filterComponent';
import { v4 as uuidv4 } from 'uuid';
import OtherGRNDetails from './components/otherDetails';
import SoftButton from '../../../../../components/SoftButton';
import SoftInput from '../../../../../components/SoftInput';
import SoftSelect from '../../../../../components/SoftSelect';
import Spinner from '../../../../../components/Spinner';
import KeyboardCommandKeyIcon from '@mui/icons-material/KeyboardCommandKey';
import { styled } from '@mui/styles';
import GRNDocumentAIModal from './document-Ai-modal';

const CreateExpressGRN = () => {
  const [controller, dispatch] = useSoftUIController();
  const { miniSidenav } = controller;
  const showSnackbar = useSnackbar();
  const navigate = useNavigate();
  const tableRef = useRef(null);
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const contextType = localStorage.getItem('contextType');
  const user_details = JSON.parse(localStorage.getItem('user_details'));
  const uidx = user_details.uidx;
  const userName = localStorage.getItem('user_name');
  const { id } = useParams();
  const epoNumber = id ? id : localStorage.getItem('epoNumber');
  const [isAccordionExpanded, setIsAccordionExpanded] = useState(true);
  const [itemLoader, setItemLoader] = useState(epoNumber ? true : false);
  const [itemListArray, setItemListArray] = useState([]);
  const [rowData, setRowData] = useState([
    // {
    //   epoNumber: null,
    //   itemId: uuidv4(),
    //   id: '',
    //   itemNo: '',
    //   itemName: '',
    //   quantityOrdered: '',
    //   totalPP: '',
    //   purchasePrice: '',
    //   mrp: 0,
    //   sellingPrice: 0,
    //   gst: 0,
    //   purchaseMargin: 0,
    //   specification: '',
    //   masterSellingPrice: 'automatic',
    //   offerPresent: 'false',
    //   offers: null,
    //   offerId: '',
    //   batchNumber: '',
    //   expiryDate: '',
    //   cess: '',
    //   discount: '',
    //   discountType: '',
    // },
  ]);
  const [openFullScreen, setOpenFullScreen] = useState(false);
  const [discountType, setDiscountType] = useState({ value: '%', label: '%' });
  const [discount, setDiscount] = useState(0);
  const [totalDiscountValue, setTotalDiscountValue] = useState(0);
  const [totalAdditionalCharge, setTotalAdditionalCharge] = useState(0);
  const [discountChange, setDiscountChange] = useState(false);
  const debouncedValue = useDebounce(discount, 700);
  const [cess, setCess] = useState(0);
  const [igst, setigst] = useState(0);
  const [sgst, setsgst] = useState(0);
  const [cgst, setcgst] = useState(0);
  const [subTotal, setsubTotal] = useState(0);
  const [total, settotal] = useState(0);
  const [roundOff, setRoundOff] = useState(0);
  const [vendorCredit, setVendorCredit] = useState('');
  const [creditUsed, setCreditUsed] = useState();
  const [isCredit, setIsCredit] = useState('');
  const debounceCredit = useDebounce(isCredit, 700);
  const [isChecked, setIsChecked] = useState(false);
  const [invoiceRefNo, setInvoiceRefNo] = useState('');
  const [invoiceValue, setInvoiceValue] = useState();
  const [invoiceDate, setInvoiceDate] = useState('');
  const [paymentDue, setPaymentDue] = useState('');
  const [vendorId, setVendorId] = useState('');
  const [vendorGST, setVendorGST] = useState('');
  const [vendorPAN, setVendorPAN] = useState('');
  const [vendorDisplayName, setVendorDisplayName] = useState('');
  const [vendorType, setVendorType] = useState('');
  const [paymentMode, setPaymenMode] = useState({ value: 'Cash', label: 'Cash' });
  const [purchaseNumber, setPurchaseNumber] = useState(epoNumber ? '' : localStorage.getItem('poNumber') || '');
  const [purchaseSelected, setPurchaseSelected] = useState(false);
  const [comment, setComment] = useState('');
  const [view, setView] = useState(false);
  const [vendorAddID, setVendorAddId] = useState('');
  const [noAddressFound, setNoAddressFound] = useState(true);
  const [billAddID, setBillAddId] = useState('');
  const [deliveryAddID, setDeliveryAddId] = useState('');
  const [inclusiveTax, setInclusiveTax] = useState('false');
  const [inclusiveChange, setInclusiveChange] = useState(false);
  const [vendoraddress, setVendoraddress] = useState({});
  const [billingaddress, setBillingaddress] = useState({});
  const [billingaddress1, setBillingaddress1] = useState({});
  const [noBillingAddress, setNoBillingAddress] = useState(false);
  const [billaddress, setBilladdress] = useState({});
  const [deliveryAddress, setDeliveryAddress] = useState({});
  const [allListAddress, setAllListAddress] = useState([]);
  const [customerId, setCustomerId] = useState(null);
  const [toggle, setToggle] = useState('org');
  const [isExtraField, setIsExtraField] = useState(false);
  const [productSelected, setProductSelected] = useState([]);
  const [titleSelected, setTitleSelected] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isFileSelected, setIsFileSelected] = useState(false);
  const [fileDocId, setFileDocId] = useState(null);
  const [additionalList, setAdditionalList] = useState([]);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [labourCharge, setLabourCharge] = useState(0);
  const [isItemChanged, setItemChanged] = useState(false);
  const [assignUserrow, setassignUser] = useState([]);
  const [assignedToLabel, setAssignedToLabel] = useState([]);
  const [assignedTo, setAssignedTo] = useState([]);
  const [saveLoader, setSaveLoader] = useState(false);
  const [reason, setDeleteReason] = useState('');
  const [deleteLoader, setDeleteLoader] = useState(false);
  const [submitLoader, setSumbitLoader] = useState(false);
  const [saveGeneric, setSaveGeneric] = useState(false);
  const [openDltModal, setOpenDltModal] = useState(false);
  const handleCloseDltModal = () => setOpenDltModal(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchItemLoader, setSearchItemLoader] = useState(false);
  const [removeSearchItemLoader, setRemoveSearchItemLoader] = useState(false);
  const [searchItem, setSearchItem] = useState('');
  const debounceItemsearch = useDebounce(searchItem, 300);
  const rowRefs = useRef([]);
  rowRefs.current = rowData.map((_, i) => rowRefs.current[i] ?? createRef());
  const [filteredData, setFilteredData] = useState([]);
  const [filterValues, setFilterValues] = useState({});
  const open = Boolean(anchorEl);
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };


  const CustomWidthTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))({
    [`& .${tooltipClasses.tooltip}`]: {
      maxWidth: 500,
      backgroundColor: 'white',
      color: 'black',
      padding: 10,
      boxShadow: '0px 3px 8px rgba(0, 0, 0, 0.24)',
    },
    [`& .${tooltipClasses.arrow}`]: {
      color: 'white',
    },
  });

  const ShortcutItem = ({ shortcut, description }) => (
    <div style={{ display: 'flex', gap: '5px', width: '100%' }}>
      <div style={{ minWidth: '95px', textAlign: 'left' }}>
        <span className="key-shortcut-btn">{shortcut}</span>
      </div>
      <span style={{ flex: 1, textAlign: 'left' }}>{description}</span>
    </div>
  );

  const [openGstModal, setOpenGstModal] = useState(false);
  const handleCloseGstModal = () => setOpenGstModal(false);
  const [grnMetrics, setGrnMetrics] = useState([]);
  const [apiCallCounter, setApiCallCounter] = useState(0);
  const currentTime = new Date();
  const formattedTime = `${currentTime.getHours()}:${
    currentTime.getMinutes() < 10 ? '0' : ''
  }${currentTime.getMinutes()}`;

  useEffect(() => {
    const metrics = localStorage.getItem('grnMetrics');
    if (metrics === 'undefined' || metrics === undefined) {
      localStorage.removeItem('grnMetrics');
    }
  }, []);

  useEffect(() => {
    if (epoNumber) {
      if (id) {
        localStorage.setItem('epoNumber', id);
      }
      getGrnDetails();
    }
  }, []);

  useEffect(() => {
    return () => {
      if (!saveGeneric) {
        unMountingComponent();
      }
    };
  }, []);

  useEffect(() => {
    if (debounceItemsearch !== '' && rowData?.length > 0) {
      const isEmpty = (obj) => Object.keys(obj).length === 0;
      if (!isEmpty(filterValues)) {
        applyFilters();
      } else {
        const isNumber = !isNaN(+debounceItemsearch);
        let counter = 1;

        const filtered = rowData
          ?.map((row, index) => {
            return {
              ...row,
              itemIndex:
                row?.purchasePrice !== 0 || row?.purchasePrice === '0.000' || row.purchasePrice === ''
                  ? counter++
                  : counter,
            };
          })
          ?.filter((row) =>
            isNumber
              ? row?.itemNo.includes(debounceItemsearch)
              : row?.itemName.toLowerCase().includes(debounceItemsearch.toLowerCase()),
          );
        if (filtered?.length === 0) {
          showSnackbar(`No items found for ${debounceItemsearch}`, 'error');
        }
        setFilteredData(filtered);
      }
    } else {
      const isEmpty = (obj) => Object.keys(obj).length === 0;
      if (!isEmpty(filterValues)) {
        applyFilters();
      } else {
        setFilteredData([]);
      }
    }
    setSearchItemLoader(false);
    setRemoveSearchItemLoader(false);
  }, [debounceItemsearch, rowData, handleRemoveFilter]);

  const isItemChangedRef = useRef(isItemChanged);

  useEffect(() => {
    // Update ref whenever isItemChanged changes
    isItemChangedRef.current = isItemChanged;
  }, [isItemChanged]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key.toLowerCase() === 's' && e.altKey) {
        e.preventDefault();
        handleSubmit();
      }
      if (e.key.toLowerCase() === 'c' && e.altKey) {
        e.preventDefault();
        handleCancel();
      }
      if (e.key.toLowerCase() === 'q' && e.altKey) {
        e.preventDefault();
        handleSave();
      }
      if (e.key.toLowerCase() === 'w' && e.altKey) {
        e.preventDefault();
        setOpenDltModal(true);
      }
      if (e.key.toLowerCase() === 's' && e.shiftKey) {
        e.preventDefault();
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
          searchInput.focus();
        }
      }
      if (e.key.toLowerCase() === 'f' && e.shiftKey) {
        e.preventDefault();
        toggleFullScreen(!openFullScreen);
      }
      if (e.key.toLowerCase() === 'd' && e.shiftKey) {
        e.preventDefault();
        if (isItemChangedRef.current) {
          handleAddEXPOProduct();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Cleanup function to remove event listener
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [rowData, invoiceRefNo, invoiceDate, invoiceValue, vendorId, assignedTo, openFullScreen]);

  const getGrnDetails = async () => {
    try {
      const res = await itemDetailsExpressPurchase(epoNumber);
      if (res?.data?.status === 'ERROR') {
        showSnackbar('Sorry! Something went wrong', 'error');
        setItemLoader(false);
        return;
      }
      if (res?.data?.data?.es === 1) {
        showSnackbar(res?.data?.data?.message, 'error');
        setItemLoader(false);
        return;
      }
      const response = res?.data?.data?.expressPurchaseOrder;
      if (response?.status !== 'DRAFT' && response?.status !== 'PENDING_APPROVAL') {
        localStorage.removeItem('epoNumber');
        navigate('/purchase/express-grn/create-express-grn');
        setItemLoader(false);
        return;
      }
      setPaymenMode({
        value: response?.paymentMode,
        label: response?.paymentMode,
      });
      setIsFileSelected(response?.docId ? true : false);
      setFileDocId(response?.docId);
      setInclusiveTax(response?.gstIncluded === true ? 'true' : 'false');
      setItemListArray(response?.itemList);
      setAdditionalList(response?.additionalChargeList);
      if (response?.additionalChargeList) {
        const delCharge = response?.additionalChargeList?.find((ele) => ele?.description === 'Delivery Charge');
        const labCharge = response?.additionalChargeList?.find((ele) => ele?.description === 'Labour Charge');
        setDeliveryCharge(delCharge?.amount);
        setLabourCharge(labCharge?.amount);
      }
      if (response?.poNumber) {
        setPurchaseNumber(response?.poNumber);
        setPurchaseSelected(response?.poNumber ? true : false);
      } else {
        const isPiNumber = response?.itemList[0]?.piNumber !== null;
        if (isPiNumber) {
          setPurchaseNumber(response?.itemList[0]?.piNumber);
          setPurchaseSelected(true);
        }
      }
      setVendorId(response?.vendorId || '');
      setCess(response?.cess);
      setIsChecked(response?.creditUsed === 'Y' ? true : false);
      setCreditUsed(response?.creditAmountUsed);
      setVendorCredit(response?.availableCredit);
      setComment(response?.comments);
      if (response?.typeOfAddress) {
        setCustomerId(response?.customerId);
        setToggle(response?.typeOfAddress);
        setVendorAddId(response?.vendorAddressId);
        setBillAddId(response?.sourceAddressId);
        setDeliveryAddId(response?.destinationAddressId);
        setNoAddressFound(false);
      } else {
        setToggle('org');
        setNoAddressFound(true);
      }
      setCustomerId(response?.customerId);
      setInvoiceDate(response?.invoiceDate);
      setInvoiceRefNo(response?.invoiceRefNo);
      setInvoiceValue(response?.invoiceValue);
      setPaymentDue(response?.paymentTerms);
      setDiscount(response?.otherDiscount);
      setTotalDiscountValue(response?.totalDiscountValue);
      setDiscountType({
        value:
          response?.otherDiscountType === 'percentage' ? '%' : response?.otherDiscountType === 'rupee' ? 'Rs' : 'NA',
        label:
          response?.otherDiscountType === 'percentage' ? '%' : response?.otherDiscountType === 'rupee' ? 'Rs' : 'NA',
      });
      setigst(response?.igstValue);
      setsgst(response?.sgstValue);
      setcgst(response?.cgstValue);
      setCess(response?.cess);
      setTotalAdditionalCharge(response?.totalAdditionalCharge);
      setsubTotal(response?.taxableValue);
      settotal(response?.grossAmount);
      localStorage.setItem('TotalGrnValue', total ? total : 0);
      setRoundOff(response?.roundedOff);
      setView(true);
      setItemLoader(false);
      if (response?.expressPOAssignedToList?.length > 0) {
        assignUserDetails(response?.expressPOAssignedToList);
      }
    } catch (err) {
      setItemLoader(false);
      showSnackbar(err?.response?.data?.message || 'Some error occured', 'error');
    }
  };

  const assignUserDetails = (inputArray) => {
    setAssignedToLabel(
      inputArray?.map((item) => ({
        value: item?.assignedUidx,
        label: item?.assignedName,
      })),
    );
    setAssignedTo(
      inputArray?.map((item) => ({
        assignedName: item?.assignedName,
        assignedUidx: item?.assignedUidx,
        epoNumber: item?.epoNumber,
        id: item?.id,
      })),
    );
  };

  const unMountingComponent = () => {
    const metrics = localStorage.getItem('grnMetrics');
    const localGrnMetrics = metrics && metrics !== 'undefined' ? JSON.parse(metrics) : null;
    const currentTime = new Date();
    const timeFormat = `${currentTime.getHours()}:${
      currentTime.getMinutes() < 10 ? '0' : ''
    }${currentTime.getMinutes()}`;
    const metricIndex = localGrnMetrics?.findIndex((metric) => metric?.id === epoNumber);
    if (metricIndex && metricIndex !== -1) {
      const updatedMetrics = localGrnMetrics?.map((metric, index) => {
        if (index === metricIndex) {
          const endTime = timeFormat;
          let totalTime = calculateTotalTime(metric?.startTime, endTime);
          if (metric?.totalTime !== '' && metric?.totalTime !== undefined && metric?.totalTime !== NaN) {
            totalTime += metric?.totalTime;
          }
          return {
            ...metric,
            endTime,
            totalTime,
          };
        }
        return metric;
      });
      setGrnMetrics(updatedMetrics);
      localStorage.setItem('grnMetrics', JSON.stringify(updatedMetrics));
    }
  };

  const updateGrnMetrics = (epoId) => {
    const metrics = localStorage.getItem('grnMetrics');
    const localGrnMetrics = metrics && metrics !== 'undefined' ? JSON.parse(metrics) : null;
    if (!localGrnMetrics || localGrnMetrics.length === 0) {
      const newMetric = {
        id: epoId,
        startTime: formattedTime,
        endTime: '',
        totalTime: '',
        apiCall: apiCallCounter,
        totalItemTime: '',
      };
      setGrnMetrics([newMetric]);
      localStorage.setItem('grnMetrics', JSON.stringify([newMetric]));
    } else {
      const metricIndex = localGrnMetrics?.findIndex((metric) => metric?.id === epoId);
      if (metricIndex && metricIndex !== -1) {
        const updatedMetrics = localGrnMetrics?.map((metric, index) => {
          if (index === metricIndex) {
            const endTime = formattedTime;
            const startTime = formattedTime;
            const startTime1 = metric?.startTime;
            let totalTime = calculateTotalTime(startTime1, endTime);
            let apiCall = apiCallCounter;
            if (metric?.totalTime !== '' && metric?.totalTime !== undefined && metric?.totalTime !== NaN) {
              totalTime += metric?.totalTime;
            }
            if (metric?.apiCall) {
              apiCall += metric?.apiCall;
              setApiCallCounter(metric?.apiCall);
            }
            return {
              ...metric,
              startTime,
              endTime,
              totalTime,
              apiCall,
            };
          }
          return metric;
        });
        setGrnMetrics(updatedMetrics);
        localStorage.setItem('grnMetrics', JSON.stringify(updatedMetrics));
      } else {
        const newMetric = {
          id: epoId,
          startTime: formattedTime,
          endTime: '',
          totalTime: '',
          apiCall: apiCallCounter,
          totalItemTime: '',
        };
        const updatedMetrics = [...localGrnMetrics, newMetric];
        setGrnMetrics(updatedMetrics);
        localStorage.setItem('grnMetrics', JSON.stringify(updatedMetrics));
      }
    }
  };

  const counterApiCalled = (epoId, totalApiTime) => {
    const metrics = localStorage.getItem('grnMetrics');
    const localGrnMetrics = metrics && metrics !== 'undefined' ? JSON.parse(metrics) : null;
    const currentTime = new Date();
    const timeFormat = `${currentTime.getHours()}:${
      currentTime.getMinutes() < 10 ? '0' : ''
    }${currentTime.getMinutes()}`;
    const metricIndex = localGrnMetrics?.findIndex((metric) => metric?.id === epoId);
    if (metricIndex && metricIndex !== -1) {
      const updatedMetrics = localGrnMetrics?.map((metric, index) => {
        if (index === metricIndex) {
          const endTime = timeFormat;
          const startTime = timeFormat;
          const apiCall = apiCallCounter + 1;
          let totalTime = calculateTotalTime(metric?.startTime, endTime);
          let totalItemTime = totalApiTime;
          if (metric?.totalItemTime !== '' && metric?.totalItemTime !== undefined && metric?.totalItemTime !== NaN) {
            totalItemTime += metric?.totalItemTime;
          }
          if (metric?.totalTime !== '' && metric?.totalTime !== undefined && metric?.totalTime !== NaN) {
            totalTime += metric?.totalTime;
          }
          return {
            ...metric,
            startTime,
            endTime,
            totalTime,
            apiCall,
            totalItemTime,
          };
        }
        return metric;
      });
      setGrnMetrics(updatedMetrics);
      localStorage.setItem('grnMetrics', JSON.stringify(updatedMetrics));
    }
  };

  const saveGrnMetric = (epoId, totalApiTime) => {
    setSaveGeneric(true);
    const metrics = localStorage.getItem('grnMetrics');
    const localGrnMetrics = metrics && metrics !== 'undefined' ? JSON.parse(metrics) : null;
    const currentTime = new Date();
    const timeFormat = `${currentTime.getHours()}:${
      currentTime.getMinutes() < 10 ? '0' : ''
    }${currentTime.getMinutes()}`;
    const metricIndex = localGrnMetrics?.findIndex((metric) => metric?.id === epoId);
    if (metricIndex && metricIndex !== -1) {
      const updatedMetrics = localGrnMetrics?.map((metric, index) => {
        if (index === metricIndex) {
          const apiCall = apiCallCounter + 1;
          let totalItemTime = totalApiTime;
          const endTime = timeFormat;
          let totalTime = calculateTotalTime(metric?.startTime, endTime);
          if (metric?.totalItemTime !== '' && metric?.totalItemTime !== undefined && metric?.totalItemTime !== NaN) {
            totalItemTime += metric?.totalItemTime;
          }
          if (metric?.totalTime !== '' && metric?.totalTime !== undefined && metric?.totalTime !== NaN) {
            totalTime += metric?.totalTime;
          }
          return {
            ...metric,
            endTime,
            totalTime,
            apiCall,
            totalItemTime,
          };
        }
        return metric;
      });
      setGrnMetrics(updatedMetrics);
      localStorage.setItem('grnMetrics', JSON.stringify(updatedMetrics));
    } else {
      setSaveGeneric(false);
    }
  };

  const calculateTotalTime = (startTime, endTime) => {
    // Extract hours and minutes from startTime and endTime
    const [startHours, startMinutes] = startTime?.split(':')?.map(Number);
    const [endHours, endMinutes] = endTime?.split(':')?.map(Number);

    // Convert the times to milliseconds
    const startMs = (startHours * 60 + startMinutes) * 60 * 1000;
    const endMs = (endHours * 60 + endMinutes) * 60 * 1000;

    // Calculate the difference in milliseconds
    let totalTime = endMs - startMs;

    // Ensure totalTime is positive
    if (totalTime < 0) {
      totalTime += 24 * 60 * 60 * 1000; // Add 24 hours in milliseconds
    }

    return totalTime;
  };

  useEffect(() => {
    if (discountChange && debouncedValue) {
      billingChange();
    }
  }, [debouncedValue]);

  useEffect(() => {
    if (epoNumber && inclusiveChange) {
      billingChange();
    }
  }, [inclusiveChange]);

  useEffect(() => {
    if (epoNumber && debounceCredit !== '') {
      billingChange();
      setIsCredit('');
    }
  }, [debounceCredit]);

  let assuser,
    assRow = [];
  const allOrgUserList = () => {
    const payload = {
      orgId: orgId,
      contextId: locId,
    };
    getAllOrgUsers(payload).then((res) => {
      assuser = res.data.data;
      assRow.push(
        assuser
          ?.map((row) => ({
            value: row.uidx,
            label: row.firstName + ' ' + row.secondName,
          }))
          .sort((a, b) => a.label.localeCompare(b.label)),
      );
      setassignUser(assRow[0]);
    });
  };

  const handleAssignTo = (e) => {
    const assignUser = [];
    const assignUserLabel = [];

    e.forEach((item) => {
      assignUser.push({
        assignedName: item.label,
        assignedUidx: item.value,
        epoNumber: epoNumber || null,
        id: null,
      });

      assignUserLabel.push({
        value: item.value,
        label: item.label,
      });
    });
    setAssignedTo(assignUser);
    setAssignedToLabel(assignUserLabel);
  };

  const handleEditGST = () => {
    setInclusiveTax(inclusiveTax === 'false' ? 'true' : 'false');
    setInclusiveChange(true);
  };

  const handleGSTChange = (option) => {
    if (epoNumber) {
      setOpenGstModal(true);
    } else {
      setInclusiveTax(option);
      setInclusiveChange(true);
    }
  };

  const handleCheckboxChange = (value) => {
    if (value === false) {
      setCreditUsed('0');
      setIsCredit('change');
    }
    setIsChecked(!isChecked);
  };

  const handleVendorCredit = (value) => {
    if (Number(value) > Number(vendorCredit)) {
      showSnackbar('Insuffiecient credit note entered', 'error');
      return;
    }
    setCreditUsed(value);
    setIsCredit(value);
    // if (!isChecked) {
    //   settotal(Number(total) - Number(value));
    // } else {
    //   settotal(Number(total) + Number(value));
    // }
  };

  const handleDiscountChange = (e) => {
    const inputValue = e.target.value;
    const regex = /^\d*\.?\d{0,2}$/;
    if (regex.test(inputValue) || inputValue === '') {
      setDiscount(inputValue);
      if (discountType.value !== 'NA') {
        setDiscountChange(true);
        grnPayload.otherDiscount = inputValue;
      }
    }
  };

  const handleDiscountType = (option) => {
    setDiscountType(option);
    if (discount !== 0) {
      grnPayload.otherDiscountType = option?.value === '%' ? 'percentage' : option?.value === 'Rs' ? 'rupee' : 'NA';
      billingChange();
    }
  };

  const uploadBill = (docId) => {
    if (fileDocId) {
      return;
    }
    if (selectedFile && isFileSelected && docId === null && epoNumber) {
      const formData = new FormData();
      formData.append('image', selectedFile);
      uploadGRNInvoiceBill(epoNumber, formData)
        .then((res) => {
          if (res?.data?.data?.es) {
            showSnackbar(res?.data?.data?.message || 'Some error occured', 'error');
            return;
          }
          showSnackbar('File uploaded successfully', 'success');
          setFileDocId(res?.data?.data?.docId);
        })
        .catch((err) => {
          setIsFileSelected(false);
          showSnackbar(err?.response?.data?.message || 'Some error occured', 'error');
        });
    }
  };

  const billingChange = () => {
    setDiscountChange(false);
    setInclusiveChange(false);
    grnPayload.epoNumber = epoNumber;
    grnPayload.itemList = itemData();
    const apiStartTime = Date.now();
    if (grnPayload.itemList?.length === 0) {
      return;
    }
    createV2ExpressPurchase(grnPayload)
      .then((res) => {
        const apiEndTime = Date.now(); // Record the end time upon receiving the response
        const totalApiTime = apiEndTime - apiStartTime;
        setApiCallCounter((prev) => prev + 1);
        counterApiCalled(epoNumber, totalApiTime);
        if (res?.data?.data?.es === 1) {
          showSnackbar(res?.data?.data?.message, 'error');
          return;
        }
        const response = res?.data?.data?.data;
        uploadBill(response?.docId);
        setDiscount(response?.otherDiscount);
        setTotalDiscountValue(response?.totalDiscountValue);
        setDiscountType({
          value:
            response?.otherDiscountType === 'percentage' ? '%' : response?.otherDiscountType === 'rupee' ? 'Rs' : 'NA',
          label:
            response?.otherDiscountType === 'percentage' ? '%' : response?.otherDiscountType === 'rupee' ? 'Rs' : 'NA',
        });
        setCess(response?.cess ? response?.cess : cess);
        setcgst(response?.cgstValue);
        setsgst(response?.sgstValue);
        setigst(response?.igstValue);
        setsubTotal(response?.taxableValue);
        settotal(response?.grossAmount);
        setRoundOff(response?.roundedOff);
      })
      .catch((err) => {
        showSnackbar(err?.response?.data?.message, 'error');
      });
  };

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    setSelectedFile(uploadedFile);
    setIsFileSelected(true);
    if (!epoNumber) {
      return;
    }
    if (uploadedFile?.length === 0) {
      setSelectedFile(null);
      setIsFileSelected(false);
      showSnackbar('No files selected', 'error');
      return;
    }
    const formData = new FormData();
    formData.append('image', uploadedFile);
    uploadGRNInvoiceBill(epoNumber, formData)
      .then((res) => {
        if (res?.data?.data?.es) {
          showSnackbar(res?.data?.data?.message || 'Some error occured', 'error');
          // setIsFileSelected(false);
          return;
        }
        setIsFileSelected(true);
        setFileDocId(res?.data?.data?.docId);
        showSnackbar('File uploaded successfully', 'success');
      })
      .catch((err) => {
        setIsFileSelected(false);
        showSnackbar(err?.response?.data?.message || 'Some error occured', 'error');
      });
  };
  const documentAIInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isDocumentAIModalOpen, setIsDocumentAIModalOpen] = useState(false);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [uploadedDocumentId, setUploadedDocumentId] = useState('');

  // To open the modal
  const openDocumentAIModal = () => {
    setIsModalLoading(true);
    setIsDocumentAIModalOpen(true);
    showSnackbar('Loading the document modal please wait', 'info');
  };

  const [documentAIItems, setDocumentAIItems] = useState([]);
  const [documentJobDetails, setDocumentJobDetails] = useState({});
  const handleDocumentAIChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setUploadStatus('Uploading and processing document...');

    try {
      const requestData = {
        sourceLocationId: locId,
        // sourceLocationId: 'RLC_404',
        destinationLocationName: deliveryAddress?.city,
        destinationLocationAddress: Object.values(simplifieDestdAddresses).join(' '),
        destinationLocationPinCode: deliveryAddress?.pincode,
        destinationStateCode: +statesCode(deliveryAddress?.state),
        sourceOrgId: orgId,
        sourceType: contextType.toLowerCase(),
        sourceLocationName: billaddress?.city,
        sourceLocationAddress: Object.values(simplifiedSourceAddresses).join(' '),
        sourceLocationPinCode: billaddress?.pincode,
        sourceStateCode: +statesCode(billaddress?.state),
        vendorLocationAddress: vendoraddress?.addressId,
        vendorPan: vendorPAN,
        vendorStateCode: +statesCode(vendoraddress?.state),
        vendorType: vendorType,
      };

      const fileBlob = new Blob([file], { type: file.type });

      const formData = new FormData();
      formData.append('file', fileBlob, file.name);
      formData.append('request', JSON.stringify(requestData));

      const response = await getDetailsByDocumentAI(formData, uidx);
      setDocumentJobDetails(response?.data?.data?.documentJob);
      setUploadedDocumentId(response?.data?.data?.documentJob?.documentId);
      const itemNames = response?.data?.data?.documentJob?.documentJobItems;
      setDocumentAIItems(itemNames);

      if (response?.data?.data?.es === 0 || response?.data?.status === 'SUCCESS') {
        setUploadStatus('Document processed successfully!');
        setUploadedFile(file); // <-- store uploaded file for view
      } else {
        showSnackbar(response?.data?.data?.message || response?.data?.message || 'Something went wrong', 'error');
      }
    } catch (error) {
      setUploadStatus('Error processing document. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const simplifieDestdAddresses = {
    addressLine1: deliveryAddress?.addressLine1,
    addressLine2: deliveryAddress?.addressLine2,
    country: deliveryAddress?.country,
    state: deliveryAddress?.state,
    city: deliveryAddress?.city,
    pincode: deliveryAddress?.pincode,
    mobileNumber: deliveryAddress?.mobileNumber,
  };
  const simplifiedSourceAddresses = {
    addressLine1: billaddress?.addressLine1,
    addressLine2: billaddress?.addressLine2,
    country: billaddress?.country,
    state: billaddress?.state,
    city: billaddress?.city,
    pincode: billaddress?.pincode,
    mobileNumber: billaddress?.mobileNumber,
  };
  const simplifiedVendorAddresses = {
    addressLine1: vendoraddress?.addressLine1,
    addressLine2: vendoraddress?.addressLine2,
    country: vendoraddress?.country,
    state: vendoraddress?.state,
    city: vendoraddress?.city,
    pinCode: vendoraddress?.pinCode,
    addressType: vendoraddress?.addressType,
  };

  const itemData = () => {
    const itemArrayList = rowData
      ?.map((row, index) => {
        const item = {
          epoNumber: epoNumber || null,
          id: row?.id || null,
          itemNo: row?.itemNo,
          itemName: row?.itemName,
          specification: row?.specification,
          quantityOrdered: row?.quantityOrdered ? Number(row?.quantityOrdered) : 0,
          unitPrice: Number(row?.mrp),
          purchasePrice: Number(parseFloat(row?.purchasePrice).toFixed(3)) || 0,
          exclusiveTaxPP: inclusiveTax === 'false' ? Number(parseFloat(row?.purchasePrice).toFixed(3)) || 0 : null,
          batchNumber: row?.batchNumber,
          cess: row?.cess || 0,
          discount: row?.discount || null,
          discountType: row?.discountType || null,
          expiryDate: row?.expiryDate,
          sellingPrice: row?.sellingPrice || 0,
          quantityRejected: row?.quantityRejected || 0,
          masterSellingPrice: row?.masterSellingPrice || 'automatic',
          offerId: row?.offers ? row?.offers.offerId : null,
          offers: row?.offers || null,
          igst: row?.gst ? Number(row?.gst) : 0,
          sgst: row?.gst ? Number(row?.gst) / 2 : 0,
          cgst: row?.gst ? Number(row?.gst) / 2 : 0,
          previousPurchasePrice: row?.previousPurchasePrice || '',
          piNumber: purchaseNumber?.includes('PI') ? purchaseNumber : null,
        };

        const offerData = row?.offers;
        const offerDetailData = row?.offers?.offerDetailsList;
        if (offerData) {
          if (offerData?.offerType === 'BUY_X_GET_Y' && offerData?.offerSubType === 'DIFFERENT ITEM') {
            if (offerDetailData?.length === 1) {
              if (offerDetailData[0]?.gtin === '' || offerDetailData[0]?.itemName === '') {
                item.offers = null;
              }
            } else {
              item.offers = {
                ...offerData,
                offerDetailsList: offerDetailData?.filter((detail) => detail?.gtin !== '' && detail?.itemName !== ''),
              };
            }
          } else {
            const hasEmptyItem = offerDetailData?.some((detail) => !detail?.gtin || !detail?.itemName);
            if (hasEmptyItem) {
              item.offers = null;
            } else {
              item.offers = offerData;
            }
          }
        }
        return item;
      })
      .filter((item) => item?.itemNo !== '' && item.itemCode !== null);
    if (itemArrayList?.length > 0) {
      return itemArrayList;
    }
    return [];
  };

  function checkDataValidity(data) {
    for (const obj of data) {
      if (isNaN(obj.unitPrice) || isNaN(obj.purchasePrice)) {
        return false;
      }
    }
    return true;
  }

  function updateChargeList(existingCharges, deliveryCharge, labourCharge, epoNumber) {
    let updatedCharges = existingCharges?.map((charge) => {
      if (charge.description === 'Delivery Charge' && deliveryCharge !== null && deliveryCharge !== undefined) {
        return { ...charge, amount: Number(deliveryCharge) };
      }
      if (charge.description === 'Labour Charge' && labourCharge !== null && labourCharge !== undefined) {
        return { ...charge, amount: Number(labourCharge) };
      }
      return charge;
    });

    if (
      deliveryCharge !== null &&
      deliveryCharge !== undefined &&
      !updatedCharges?.some((charge) => charge.description === 'Delivery Charge')
    ) {
      updatedCharges.push({
        description: 'Delivery Charge',
        amount: Number(deliveryCharge),
        epoNumber: epoNumber,
      });
    }

    if (
      labourCharge !== null &&
      labourCharge !== undefined &&
      !updatedCharges?.some((charge) => charge.description === 'Labour Charge')
    ) {
      updatedCharges.push({
        description: 'Labour Charge',
        amount: Number(labourCharge),
        epoNumber: epoNumber,
      });
    }

    updatedCharges = updatedCharges?.filter((charge) => charge?.amount > 0);
    return updatedCharges;
  }

  const grnPayload = {
    destinationLocationId: vendorId,
    destinationType: 'vendor',
    destinationLocationName: deliveryAddress?.city,
    destinationLocationAddress: Object.values(simplifieDestdAddresses).join(' '),
    destinationLocationPinCode: deliveryAddress?.pincode,
    destinationStateCode: +statesCode(deliveryAddress?.state),
    sourceOrgId: orgId,
    sourceLocationId: locId,
    sourceType: contextType.toLowerCase(),
    sourceLocationName: billaddress?.city,
    sourceLocationAddress: Object.values(simplifiedSourceAddresses).join(' '),
    sourceLocationPinCode: billaddress?.pincode,
    sourceStateCode: +statesCode(billaddress?.state),
    vendorId: vendorId,
    vendorName: vendorDisplayName,
    vendorGstin: vendorGST,
    vendorPan: vendorPAN,
    vendorType: vendorType,
    vendorLocationName: vendoraddress?.addressType,
    vendorLocationAddress: Object.values(simplifiedVendorAddresses).join(' '),
    vendorLocationPinCode: vendoraddress?.pinCode,
    vendorStateCode: +statesCode(vendoraddress?.state),
    currency: 'INR',
    paymentMode: paymentMode.value,
    paymentTerms: paymentDue,
    createdBy: uidx,
    invoiceRefNo: invoiceRefNo,
    invoiceValue: invoiceValue,
    invoiceDate: invoiceDate,
    shippingMethod: 'Vendor Transport',
    shippingTerms: 'Freight On Delivery',
    comments: comment,
    creditUsed: isChecked ? 'Y' : 'N',
    creditAmountUsed: isChecked ? Number(creditUsed) : 0,
    availableCredit: vendorCredit,
    otherDiscount: discount,
    otherDiscountType: discountType?.value === '%' ? 'percentage' : discountType?.value === 'Rs' ? 'rupee' : 'NA',
    cess: cess,
    roundedOff: roundOff,
    userCreated: localStorage.getItem('user_name'),
    // itemList: itemData(),
    expressPOAssignedToList: assignedTo,
    gstIncluded: inclusiveTax === 'true' ? true : false,
    // additionalChargeList: isExtraField ? additionalList?.filter((detail) => detail?.description !== '') : [],
    additionalChargeList: updateChargeList(additionalList, Number(deliveryCharge), Number(labourCharge), epoNumber),
    poNumber: purchaseNumber?.includes('PO') ? purchaseNumber : null,
    destinationAddressId: deliveryAddress?.id,
    sourceAddressId: billaddress?.id,
    typeOfAddress: customerId ? 'cus' : 'org',
    vendorAddressId: vendoraddress?.addressId,
    customerId: customerId || null,
    // docId: !isFileSelected && null,
  };

  const handleSequenceDocumentAI = async () => {
    try {
      // Get processed items from rowData that have the required fields
      const selectSuggestionRequests =
        rowData
          ?.filter((row) => row?.suggestedItemId) // Only include items with both required fields
          ?.map((row) => ({
            documentItemId: row?.id || '',
            suggestedItemId: row?.suggestedItemId || '',
          })) || [];

      const payload = {
        documentId: uploadedDocumentId,
        selectSuggestionRequests,
      };
      const response = await documentAISuggestion(payload);

      return response;
    } catch (error) {
      throw error;
    }
  };

  const handleAddProduct = (sp, newRowData) => {
    grnPayload.itemList = itemData();
    if (grnPayload.itemList?.length === 0) {
      return;
    }
    if (grnPayload.itemList?.length > 0) {
      grnPayload.itemList[0].sellingPrice = sp;
    }
    const apiStartTime = Date.now();
    if (grnPayload.itemList?.length === 0) {
      return;
    }
    createV2ExpressPurchase(grnPayload)
      .then((res) => {
        if (res?.data?.data?.es === 1) {
          showSnackbar(res?.data?.data?.message, 'error');
          return;
        }
        localStorage.setItem('epoNumber', res?.data?.data?.data?.epoNumber);
        updateGrnMetrics(res?.data?.data?.data?.epoNumber);
        setApiCallCounter((prev) => prev + 1);
        const apiEndTime = Date.now(); // Record the end time upon receiving the response
        const totalApiTime = apiEndTime - apiStartTime;
        counterApiCalled(res?.data?.data?.data?.epoNumber, totalApiTime);
        const response = res?.data?.data?.data;
        if (purchaseNumber && !epoNumber) {
          if (response?.itemList && response?.itemList?.length > 0) {
            const updatedRowData = newRowData
              ? newRowData?.map((row, index) => {
                  if (index < response?.itemList?.length) {
                    if (row?.id === '' && row?.offerId === '') {
                      return {
                        ...row,
                        id: response?.itemList[index]?.id,
                        quantityOrdered: rowData[index]?.quantityOrdered ? rowData[index]?.quantityOrdered : 0,
                        totalPP: rowData[index]?.totalPP ? rowData[index]?.totalPP : 0,
                      };
                    }
                  }
                  return row;
                })
              : rowData?.map((row, index) => {
                  if (index < response?.itemList?.length) {
                    if (row?.id === '' && row?.offerId === '') {
                      return {
                        ...row,
                        id: response?.itemList[index]?.id,
                        offerId: response?.itemList[index]?.offerId,
                        quantityOrdered: rowData[index]?.quantityOrdered ? rowData[index]?.quantityOrdered : 0,
                        totalPP: rowData[index]?.totalPP ? rowData[index]?.totalPP : 0,
                        unitPrice: rowData[index]?.unitPrice || '',
                      };
                    }
                  }
                  return row;
                });
            setRowData(updatedRowData);
          }
          localStorage.removeItem('poNumber');
        } else {
          if (rowData && rowData.length > 0) {
            rowData[0].id = response?.itemList?.id || null;
            rowData[0].offerId = response?.itemList?.offerId || null;
          }
        }
        uploadBill(res?.data?.data?.data?.docId);
        setTotalDiscountValue(response?.totalDiscountValue);
        setDiscountType({
          value:
            response?.otherDiscountType === 'percentage' ? '%' : response?.otherDiscountType === 'rupee' ? 'Rs' : 'NA',
          label:
            response?.otherDiscountType === 'percentage' ? '%' : response?.otherDiscountType === 'rupee' ? 'Rs' : 'NA',
        });
        setCess(response?.cess ? response?.cess : cess);
        setcgst(response?.cgstValue);
        setigst(response?.igstValue);
        setsgst(response?.sgstValue);
        setsubTotal(response?.taxableValue);
        settotal(response?.grossAmount);
        setRoundOff(response?.roundedOff);
      })
      .catch((err) => {
        showSnackbar(err?.response?.data?.message, 'error');
      });
  };

  const handleAddEXPOProduct = async (newRowData) => {
    try {
      if (epoNumber !== null) {
        grnPayload.epoNumber = epoNumber;
        grnPayload.itemList = itemData();
        if (grnPayload.itemList?.length === 0) {
          return;
        }
        const apiStartTime = Date.now();
        const res = await createV2ExpressPurchase(grnPayload);
        const apiEndTime = Date.now(); // Record the end time upon receiving the response
        const totalApiTime = apiEndTime - apiStartTime;
        setApiCallCounter((prev) => prev + 1);
        counterApiCalled(epoNumber, totalApiTime);
        if (res?.data?.data?.es === 1) {
          showSnackbar(res?.data?.data?.message, 'error');
          return;
        }
        const response = res?.data?.data?.data;
        uploadBill(response?.docId);
        setDiscount(response?.otherDiscount);
        setTotalDiscountValue(response?.totalDiscountValue);
        setDiscountType({
          value:
            response?.otherDiscountType === 'percentage' ? '%' : response?.otherDiscountType === 'rupee' ? 'Rs' : 'NA',
          label:
            response?.otherDiscountType === 'percentage' ? '%' : response?.otherDiscountType === 'rupee' ? 'Rs' : 'NA',
        });
        setCess(response?.cess ? response?.cess : cess);
        setcgst(response?.cgstValue);
        setigst(response?.igstValue);
        setsgst(response?.sgstValue);
        setsubTotal(response?.taxableValue);
        settotal(response?.grossAmount);
        setRoundOff(response?.roundedOff);
        if (response?.itemList && response?.itemList.length > 0) {
          const updatedRowData = newRowData
            ? newRowData?.map((row, index) => {
                if (index < response?.itemList?.length) {
                  if (row.id === '' && row.offerId === '') {
                    return {
                      ...row,
                      id: response?.itemList[index]?.id,
                      offerId: response?.itemList[index]?.offerId,
                      quantityOrdered: rowData[index]?.quantityOrdered ? rowData[index]?.quantityOrdered : 0,
                      totalPP: rowData[index]?.totalPP ? rowData[index]?.totalPP : 0,
                    };
                  }
                }
                return row;
              })
            : rowData?.map((row, index) => {
                if (index < response?.itemList?.length) {
                  if (row?.id === '' && row?.offerId === '') {
                    return {
                      ...row,
                      id: response?.itemList[index]?.id,
                      offerId: response?.itemList[index]?.offerId,
                      quantityOrdered: rowData[index]?.quantityOrdered ? rowData[index]?.quantityOrdered : 0,
                      totalPP: rowData[index]?.totalPP ? rowData[index]?.totalPP : 0,
                      unitPrice: rowData[index]?.unitPrice || '',
                    };
                  }
                }
                return row;
              });
          setRowData(updatedRowData);
        }
        setItemChanged(false);
      }
    } catch (err) {
      setItemChanged(false);
      showSnackbar(err?.response?.data?.message || err?.message, 'error');
    }
  };

  const handleDltItem = async (row, index) => {
    if (!row && !index) {
      return;
    }
    try {
      const updatedRowData = [...rowData];
      updatedRowData.splice(index, 1);
      setRowData(updatedRowData);
      if (row.id && row.id !== '') {
        setItemLoader(true);
        const payload = {
          epoNumber: epoNumber,
          itemId: row.id,
        };
        const apiStartTime = Date.now();
        const res = await deleteItemExpressPurchase(payload);
        setApiCallCounter((prev) => prev + 1);
        const apiEndTime = Date.now(); // Record the end time upon receiving the response
        const totalApiTime = apiEndTime - apiStartTime;
        counterApiCalled(epoNumber, totalApiTime);
        if (res?.data?.data?.es) {
          showSnackbar(res?.data?.data?.message, 'error');
          return;
        }
        const ietmRes = await itemDetailsExpressPurchase(epoNumber);
        if (ietmRes?.data?.data?.es) {
          showSnackbar(ietmRes?.data?.data?.message, 'error');
          setItemLoader(false);
          return;
        }
        const response = ietmRes?.data?.data?.expressPurchaseOrder;
        setDiscount(response?.otherDiscount);
        setTotalDiscountValue(response?.totalDiscountValue);
        setDiscountType({
          value:
            response?.otherDiscountType === 'percentage' ? '%' : response?.otherDiscountType === 'rupee' ? 'Rs' : 'NA',
          label:
            response?.otherDiscountType === 'percentage' ? '%' : response?.otherDiscountType === 'rupee' ? 'Rs' : 'NA',
        });
        setCess(response?.cess ? response?.cess : cess);
        setcgst(response?.cgstValue);
        setigst(response?.igstValue);
        setsgst(response?.sgstValue);
        setsubTotal(response?.taxableValue);
        settotal(response?.grossAmount);
        setRoundOff(response?.roundedOff);
        setItemListArray(response?.itemList);
        // setRowData(response?.itemList);
        showSnackbar('Item Deleted', 'success');
        setItemLoader(false);
      }
    } catch (err) {
      showSnackbar(err?.response?.data?.message, 'error');
      setItemLoader(false);
    }
  };

  const handleCreateMetric = (itemCount) => {
    const metrics = localStorage.getItem('grnMetrics');
    const localGrnMetrics = metrics && metrics !== 'undefined' ? JSON.parse(metrics) : null;
    let totalTime = '';
    let averageSkuDuration = '';
    let totalSkuCount = '';
    const metricIndex = localGrnMetrics?.findIndex((metric) => metric?.id === epoNumber);
    if (metricIndex && metricIndex !== -1) {
      totalTime = localGrnMetrics[metricIndex]?.totalTime;
      totalSkuCount = Number(itemCount);
      averageSkuDuration = Number(localGrnMetrics[metricIndex]?.totalItemTime) / Number(itemCount);
    }
    const metricPayload = {
      uidx: uidx,
      role: '',
      totalTime: totalTime,
      averageSkuDuration: averageSkuDuration,
      totalSkuCount: totalSkuCount,
      organizationId: orgId,
      locationId: locId,
    };
    expressGrnCreateMetric(metricPayload)
      .then((res) => {})
      .catch((err) => {
        showSnackbar(err?.response?.data?.message || 'Some error occured', 'error');
      });
  };

  const handleSave = () => {
    if (grnPayload.vendorId == '') {
      return;
    }
    const hasDiscountGreaterThan100 = rowData?.some((item) => {
      const discount = parseFloat(item?.discount);
      const discountType = item?.discountType;

      if (discountType === 'percentage' && !isNaN(discount) && discount > 100) {
        return true;
      }

      return false;
    });
    if (noBillingAddress) {
      showSnackbar('Add address', 'error');
    } else if (!checkDataValidity(itemData())) {
      showSnackbar('Please fill in all required fields', 'error');
    } else if (hasDiscountGreaterThan100) {
      showSnackbar('Item discount should not be more than 100 %', 'error');
      return;
    } else {
      setSaveLoader(true);
      grnPayload.epoNumber = epoNumber;
      grnPayload.itemList = itemData();
      const apiStartTime = Date.now();
      createExpressPurchase(grnPayload)
        .then((res) => {
          const apiEndTime = Date.now(); // Record the end time upon receiving the response
          const totalApiTime = apiEndTime - apiStartTime;
          const endTime = formattedTime;
          setApiCallCounter((prev) => prev + 1);
          if (res?.data?.data?.es === 1) {
            setSaveLoader(false);
            showSnackbar(res?.data?.data?.message, 'error');
            counterApiCalled(epoNumber, totalApiTime);
          } else {
            uploadBill(res?.data?.data?.docId);
            localStorage.removeItem('epoNumber');
            navigate('/purchase/express-grn');
            saveGrnMetric(epoNumber, totalApiTime);
          }
        })
        .catch((err) => {
          setSaveLoader(false);
          showSnackbar(err?.response?.data?.message, 'error');
        });
    }
  };

  const handleSubmit = () => {
    const hasDiscountGreaterThan100 = rowData?.some((item) => {
      const discount = parseFloat(item?.discount);
      const discountType = item?.discountType;

      if (discountType === 'percentage' && !isNaN(discount) && discount > 100) {
        return true;
      }

      return false;
    });
    if (vendorId == '') {
      showSnackbar('Select Vendor', 'error');
    } else if (noBillingAddress) {
      showSnackbar('Add address', 'error');
    } else if (
      !invoiceRefNo ||
      !invoiceDate ||
      !invoiceValue ||
      (Array.isArray(assignedTo) && assignedTo?.length === 0)
    ) {
      showSnackbar('Enter all the required fields', 'warning');
    } else if (!epoNumber) {
      showSnackbar('Select Product', 'warning');
    } else if (!checkDataValidity(itemData())) {
      showSnackbar('Please fill all required fields', 'error');
    } else if (hasDiscountGreaterThan100) {
      showSnackbar('Item discount should not be more than 100 %', 'error');
      return;
    } else if (
      Number(invoiceValue) != Number(total) &&
      Number(invoiceValue) !== Number(total) - Number(roundOff) &&
      Number(invoiceValue) !== Number(total) + Number(roundOff)
    ) {
      showSnackbar('Invoice value is not equal to Total amount', 'warning');
    } else if (discount !== 0 && discountType.value === 'NA') {
      showSnackbar('Select Discount Type', 'warning');
    } else if (hasDiscountGreaterThan100) {
      showSnackbar('Item discount should not be more than 100 %', 'error');
    } else {
      setSumbitLoader(true);
      grnPayload.epoNumber = epoNumber;
      grnPayload.itemList = itemData();
      const apiStartTime = Date.now();
      createV2ExpressPurchase(grnPayload)
        .then((res) => {
          if (res?.data?.status === 'ERROR') {
            setSumbitLoader(false);
            showSnackbar(res?.data?.message, 'error');
            return;
          }
          const apiEndTime = Date.now(); // Record the end time upon receiving the response
          const totalApiTime = apiEndTime - apiStartTime;
          setApiCallCounter((prev) => prev + 1);
          if (res?.data?.data?.es === 1) {
            setSumbitLoader(false);
            showSnackbar(res?.data?.data?.message, 'error');
            counterApiCalled(epoNumber, totalApiTime);
          } else {
            saveGrnMetric(epoNumber, totalApiTime);
            uploadBill(res?.data?.data?.data?.docId);
            const response = res?.data?.data?.data?.itemList;
            handleCreateMetric(response?.length);

            const payload1 = {
              requestedBy: uidx,
              reqSourceType: contextType,
              epoNumber: epoNumber,
            };
            startExpressPurchaseEvent(payload1)
              .then((res) => {
                setSumbitLoader(false);
                localStorage.removeItem('epoNumber');
                navigate('/purchase/express-grn');
              })
              .catch((err) => {
                setSumbitLoader(false);
                showSnackbar(err?.response?.data?.message, 'error');
              });
          }
        })
        .catch((err) => {
          setSumbitLoader(false);
          showSnackbar(err?.response?.data?.message, 'error');
        });
    }
  };

  const handleCancel = () => {
    navigate('/purchase/express-grn');
    localStorage.removeItem('epoNumber');
  };
  const handleDelete = () => {
    setOpenDltModal(true);
  };

  const handleDeleteEXPO = () => {
    setDeleteLoader(true);
    const payload = {
      epoNumber: epoNumber,
      userId: uidx,
      reason: reason,
    };
    deleteExpressPurchase(payload)
      .then((res) => {
        if (res?.data?.data?.es === 1) {
          showSnackbar(res?.data?.data?.message, 'error');
        } else {
          const metrics = localStorage.getItem('grnMetrics');
          const localGrnMetrics = metrics && metrics !== 'undefined' ? JSON.parse(metrics) : null;
          const updatedMetrics = localGrnMetrics?.filter((metric) => metric?.id !== epoNumber);
          setGrnMetrics(updatedMetrics);
          localStorage.setItem('grnMetrics', JSON.stringify(updatedMetrics));
          localStorage.removeItem('epoNumber');
          navigate('/purchase/express-grn');
        }
        setDeleteLoader(false);
      })
      .catch((err) => {
        setDeleteLoader(false);
        showSnackbar(err?.response?.data?.message, 'error');
      });
  };

  const isMatch = invoiceValue == total;
  const totalStyle = isMatch ? {} : { color: 'red' };

  const [isFixed, setIsFixed] = useState(false);
  const softBoxRef = useRef(null);
  const [totalRowsGRN, setTotalRowsGRN] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const softBoxTop = softBoxRef.current.getBoundingClientRect().top;
      setIsFixed(softBoxTop <= 40);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCompleteProduct = () => {};

  const filters = useMemo(
    () => [
      {
        type: 'select',
        placeholder: 'Select item state',
        options: [
          { value: 'complete', label: 'Complete' },
          { value: 'incomplete', label: 'Incomplete' },
          { value: 'spLess', label: 'S.P. less than MRP' },
          { value: 'mrpGreater', label: 'Price/unit is greater than MRP' },
        ],
        key: 'itemState',
        label: 'Item State',
      },
      {
        type: 'select',
        options: [
          { value: 'FREE_PRODUCTS', label: 'FREE PRODUCTS' },
          { value: 'OFFER_ON_MRP', label: 'OFFER ON MRP' },
          { value: 'BUY_X_GET_Y', label: 'BUY X GET Y' },
        ],
        key: 'status',
        placeholder: 'Select Offer Type',
        label: 'Offer Type',
      },
    ],
    [],
  );

  const handleleRemoveSearch = () => {
    setSearchItem('');
    setRemoveSearchItemLoader(true);
  };

  const handleFilterChange = (key, e, label, inputType) => {
    if (!e) {
      // If 'e' is null or undefined, it means the filter is being removed
      setFilterValues((prevValues) => {
        const newValues = { ...prevValues };
        delete newValues[key];
        return newValues;
      });
    } else {
      setFilterValues((prevValues) => ({
        ...prevValues,
        [key]: {
          value: e.value,
          label: e.label,
          itemLabel: label,
        },
      }));
    }
  };

  const applyFilters = () => {
    if (!filterValues) return;

    const isRowComplete = (row) =>
      row.itemNo !== '' && row.batchNumber !== '' && row.expiryDate !== '' && row.id !== '' && row.itemName !== '';

    const newSellingPrice = (row) =>
      row?.sellingPrice !== 'NaN' && row?.sellingPrice !== undefined && row?.sellingPrice !== ''
        ? row?.sellingPrice
        : '';

    const newPurchasePrice = (row) =>
      row?.purchasePrice >= 0 && row?.purchasePrice !== '' ? Math.round(row?.purchasePrice * 1000) / 1000 : '';

    const sellingPriceLess = (row) => {
      const sellingPrice = Number(newSellingPrice(row));
      const purchasePrice = Number(newPurchasePrice(row));
      return sellingPrice < purchasePrice && row?.masterSellingPrice === 'manual';
    };

    const isGreater = (row) => Number(newPurchasePrice(row)) > Number(row?.mrp);

    // Apply search filtering and dynamic filters
    let counter = 1;
    const filteredData = rowData
      ?.map((row, index) => {
        return {
          ...row,
          itemIndex:
            row?.purchasePrice !== 0 || row?.purchasePrice === '0.000' || row.purchasePrice === ''
              ? counter++
              : counter,
        };
      })
      ?.filter((row) => {
        // Apply search filtering
        if (debounceItemsearch !== '') {
          const isNumber = !isNaN(+debounceItemsearch);
          if (
            (isNumber && !row?.itemNo.includes(debounceItemsearch)) ||
            (!isNumber && !row?.itemName.toLowerCase()?.includes(debounceItemsearch.toLowerCase()))
          ) {
            return false;
          }
        }

        // Apply dynamic filters
        for (const [filterName, filterData] of Object.entries(filterValues)) {
          if (filterName === 'itemState') {
            switch (filterData.value) {
              case 'complete':
                if (!isRowComplete(row)) return false;
                break;
              case 'incomplete':
                if (isRowComplete(row)) return false;
                break;
              case 'spLess':
                if (!sellingPriceLess(row)) return false;
                break;
              case 'mrpGreater':
                if (!isGreater(row)) return false;
                break;
              default:
                break;
            }
          } else if (filterName === 'status') {
            if (
              filterData.value &&
              (row.offerPresent !== 'true' || !row?.offers || row?.offers?.offerType !== filterData.value)
            ) {
              return false;
            }
          }
        }

        return true;
      });

    if (filteredData?.length === 0) {
      showSnackbar('No data found', 'error');
    } else {
      setFilteredData(filteredData);
    }
  };

  const handleRemoveFilter = (key) => {
    if (key) {
      const updatedFilters = { ...filterValues };
      delete updatedFilters[key];
      setFilterValues(updatedFilters);
      handleFilterChange(updatedFilters);
    } else {
      setFilterValues({});
      setFilteredData([]);
    }
    if (debounceItemsearch !== '') {
      setSearchItem(debounceItemsearch);
    }
  };

  const toggleFullScreen = (isFullScreen) => {
    setOpenFullScreen(isFullScreen);
    // if (isFullScreen) {
    // document.body.style.overflow = 'hidden';
    // } else {
    // document.body.style.overflow = 'auto';
    // }
    // setMiniSidenav(dispatch, isFullScreen);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar prevLink={true} />
      <Box className="main-box-pi-pre">
        <SoftBox mb={1} ml={0.5} p={3} display="flex" justifyContent="space-between" alignItems="center">
          <SoftTypography fontWeight="bold" fontSize="24px">
            New inward
          </SoftTypography>
          {/* {rowData?.length >= 1 && rowData[0]?.itemNo != '' && (
            <div>
              <MoreHorizRoundedIcon fontSize="large" className="copy-icon menu-icon" onClick={handleMenu} />
            </div>
          )} */}
          {epoNumber && (
            <div>
              <MoreHorizRoundedIcon fontSize="large" className="copy-icon menu-icon" onClick={handleMenu} />
            </div>
          )}

          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            {[
              saveLoader ? (
                <Spinner size={20} key="preview-spinner" />
              ) : (
                <MenuItem onClick={handleSave} key="preview-menu-item">
                  Save as draft
                </MenuItem>
              ),
              epoNumber &&
                (deleteLoader ? (
                  <Spinner size={20} key="delete-spinner" />
                ) : (
                  <MenuItem onClick={() => setOpenDltModal(true)} key="delete-menu-item">
                    Delete
                  </MenuItem>
                )),
            ]}
          </Menu>
        </SoftBox>
        <SoftBox p={3} className="create-pi-card">
          {/* <Accordion expanded={isAccordionExpanded}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              onClick={() => setIsAccordionExpanded(!isAccordionExpanded)}
            > */}
          {/* <AccordionDetails></AccordionDetails>
            </AccordionSummary> */}

          <OtherGRNDetails
            setVendorDisplayName={setVendorDisplayName}
            vendorId={vendorId}
            setVendorId={setVendorId}
            vendorGST={vendorGST}
            setVendorGST={setVendorGST}
            vendorPAN={vendorPAN}
            setVendorPAN={setVendorPAN}
            setVendorType={setVendorType}
            documentAIInputRef={documentAIInputRef}
            setVendorCredit={setVendorCredit}
            vendorCredit={vendorCredit}
            vendorDisplayName={vendorDisplayName}
            view={view}
            setView={setView}
            purchaseNumber={purchaseNumber}
            setPurchaseNumber={setPurchaseNumber}
            purchaseSelected={purchaseSelected}
            setPurchaseSelected={setPurchaseSelected}
            invoiceRefNo={invoiceRefNo}
            setInvoiceRefNo={setInvoiceRefNo}
            invoiceDate={invoiceDate}
            setInvoiceDate={setInvoiceDate}
            invoiceValue={invoiceValue}
            setInvoiceValue={setInvoiceValue}
            paymentDue={paymentDue}
            setPaymentDue={setPaymentDue}
            paymentMode={paymentMode}
            setPaymenMode={setPaymenMode}
            inclusiveTax={inclusiveTax}
            handleGSTChange={handleGSTChange}
            assignedToLabel={assignedToLabel}
            handleAssignTo={handleAssignTo}
            assignUserrow={assignUserrow}
            allOrgUserList={allOrgUserList}
            vendoraddress={vendoraddress}
            setVendoraddress={setVendoraddress}
            isModalLoading={isModalLoading}
            setIsModalLoading={setIsModalLoading}
            setIsUploading={setIsUploading}
            openDocumentAIModal={openDocumentAIModal}
            setUploadStatus={setUploadStatus}
            isUploading={isUploading}
            uploadStatus={uploadStatus}
            uploadedFile={uploadedFile}
            setUploadedFile={setUploadedFile}
            billingaddress={billingaddress}
            setBillingaddress={setBillingaddress}
            billingaddress1={billingaddress1}
            setBillingaddress1={setBillingaddress1}
            setNoBillingAddress={setNoBillingAddress}
            billaddress={billaddress}
            setBilladdress={setBilladdress}
            deliveryAddress={deliveryAddress}
            setDeliveryAddress={setDeliveryAddress}
            allListAddress={allListAddress}
            setAllListAddress={setAllListAddress}
            customerId={customerId}
            setCustomerId={setCustomerId}
            toggle={toggle}
            setToggle={setToggle}
            vendorAddID={vendorAddID}
            setVendorAddId={setVendorAddId}
            noAddressFound={noAddressFound}
            setNoAddressFound={setNoAddressFound}
            billAddID={billAddID}
            setBillAddId={setBillAddId}
            deliveryAddID={deliveryAddID}
            setDeliveryAddId={setDeliveryAddId}
            setItemLoader={setItemLoader}
            setRowData={setRowData}
            rowData={rowData}
            tableRef={tableRef}
            setAssignedToLabel={setAssignedToLabel}
            assignedTo={assignedTo}
            setAssignedTo={setAssignedTo}
            productSelected={productSelected}
            setProductSelected={setProductSelected}
            titleSelected={titleSelected}
            setTitleSelected={setTitleSelected}
            isFileSelected={isFileSelected}
            setIsFileSelected={setIsFileSelected}
            handleFileChange={handleFileChange}
            handleDocumentAIChange={handleDocumentAIChange}
            fileDocId={fileDocId}
            handleAddProduct={handleAddProduct}
            handleAddEXPOProduct={handleAddEXPOProduct}
            setAdditionalList={setAdditionalList}
            setDeliveryCharge={setDeliveryCharge}
            setLabourCharge={setLabourCharge}
            setIsExtraField={setIsExtraField}
          />
          {/* </Accordion> */}
        </SoftBox>
        {/* {isFixed && ( */}
        <SoftBox
          className="create-pi-card"
          ref={softBoxRef}
          style={{
            // height: '150px',
            padding: '20px 20px 10px 20px',
            position: isFixed ? 'sticky' : 'static',
            top: isFixed ? 0 : 'auto',
            zIndex: isFixed ? 1100 : 'auto',
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '30px' }}>
              <SoftTypography variant="h6">
                {debounceItemsearch !== '' && filteredData?.length > 0 ? (
                  <>
                    Found results for: "<span style={{ fontWeight: 'bold' }}>{debounceItemsearch}</span>"
                  </>
                ) : (
                  `Enter items you wish to purchase `
                )}
                <b>{rowData?.length > 1 && ` (Total items added: ${totalRowsGRN})`} </b>
              </SoftTypography>
              {itemLoader && <Spinner size={20} />}
              {searchItemLoader && (
                <div style={{ display: 'flex', gap: '5px' }}>
                  <SoftTypography fontSize="13px">...Searching </SoftTypography>

                  <Spinner size={20} />
                </div>
              )}
              {removeSearchItemLoader && filteredData?.length > 0 && (
                <div style={{ display: 'flex', gap: '5px' }}>
                  <SoftTypography fontSize="13px">...Removing </SoftTypography>

                  <Spinner size={20} />
                </div>
              )}

              <div
                style={{
                  width: '40%',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  justifyContent: 'flex-end',
                }}
              >
                {rowData?.length > 1 && (
                  <>
                    <SoftInput
                      id="searchInput"
                      className="filter-add-list-cont-bill-search"
                      placeholder="Search by barcode or title"
                      value={searchItem}
                      onChange={(e) => {
                        setSearchItem(e.target.value);
                        if (e.target.value === '' && filteredData?.length > 0) {
                          setRemoveSearchItemLoader(true);
                        } else {
                          setSearchItemLoader(true);
                        }
                      }}
                      icon={{
                        component: 'search',
                        direction: 'right',
                      }}
                    />
                    {searchItem?.length !== 0 && (
                      <SoftBox
                        sx={{
                          position: 'absolute',
                          top: '3px',
                          right: '110px',
                          color: 'gray',
                          cursor: 'pointer',
                          zIndex: 10,
                        }}
                      >
                        <CloseRoundedIcon onClick={handleleRemoveSearch} />
                      </SoftBox>
                    )}

                    <div>
                      <FilterGRNComponent
                        filter={filters}
                        values={filterValues}
                        onChange={handleFilterChange}
                        applyFilters={applyFilters}
                        handleRemoveFilter={handleRemoveFilter}
                      />
                    </div>
                  </>
                )}
                <div>
                  {openFullScreen ? (
                    <CloseFullscreenIcon
                      color="info"
                      sx={{ cursor: 'pointer' }}
                      onClick={() => toggleFullScreen(false)}
                    />
                  ) : (
                    <OpenInFullIcon color="info" sx={{ cursor: 'pointer' }} onClick={() => toggleFullScreen(true)} />
                  )}
                </div>
              </div>
            </div>
            {rowData?.length > 0 && (
              <SoftBox style={{ overflowX: 'scroll', overflowY: 'hidden', maxHeight: '65px' }}>
                <div
                  style={{
                    overflowX: 'scroll',
                    minWidth: '1047px',
                  }}
                >
                  <div>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr>
                          <th className="express-grn-columns">S.No</th>
                          <th className="express-grn-barcode-column">Barcode</th>
                          <th className="express-grn-barcode-column">Title</th>
                          <th className="express-grn-columns">Qty</th>
                          <th className="express-grn-columns">Total PP</th>
                          <th className="express-grn-columns">Price/ unit</th>
                          <th className="express-grn-columns">MRP</th>
                          <th className="express-grn-columns">S Price</th>
                          <th className="express-grn-columns">P Margin</th>
                          <th className="express-grn-columns">GST</th>
                          {epoNumber ? (
                            <th className="express-grn-columns">Action</th>
                          ) : (
                            !vendorId ||
                            !invoiceRefNo ||
                            !invoiceValue ||
                            !invoiceDate ||
                            (!(assignedTo?.length > 0) ? null : <th className="express-grn-columns">Action</th>)
                          )}
                        </tr>
                      </thead>
                      <tbody style={{ visibility: 'hidden' }}>
                        <tr>
                          <td className="express-grn-rows">
                            <span
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                fontSize: '0.85rem',
                              }}
                            >
                              <span
                                style={{
                                  whiteSpace: 'nowrap',
                                  maxWidth: '200px',
                                  overflow: 'hidden',
                                  cursor: 'pointer',
                                  marginTop: '0.75rem',
                                }}
                              ></span>
                              <SoftBox className="grn-body-row-boxes">
                                <SoftInput value="S.No" readOnly={true} />
                              </SoftBox>
                            </span>
                          </td>
                          <td className="express-grn-rows">
                            <SoftBox className="express-grn-product-box">
                              <TextField value="Barcode" readOnly={true} style={{ width: '100%' }} />
                            </SoftBox>
                          </td>
                          <td className="express-grn-rows">
                            <SoftBox className="express-grn-product-box">
                              <TextField value="Title" readOnly={true} style={{ width: '100%' }} />
                            </SoftBox>
                          </td>
                          <td className="express-grn-rows">
                            <SoftBox className="grn-body-row-boxes-1">
                              <SoftInput value="Qty" readOnly={true} />
                            </SoftBox>
                          </td>
                          <td className="express-grn-rows">
                            <SoftBox className="grn-body-row-boxes-1">
                              <SoftInput value="Total PP" readOnly={true} />
                            </SoftBox>
                          </td>
                          <td className="express-grn-rows">
                            <SoftBox className="grn-body-row-boxes-1">
                              <SoftInput value="Price/unit" readOnly={true} />
                            </SoftBox>
                          </td>
                          <td className="express-grn-rows">
                            <SoftBox className="grn-body-row-boxes-1">
                              <SoftInput value="MRP" readOnly={true} />
                            </SoftBox>
                          </td>
                          <td className="express-grn-rows">
                            <SoftBox className="grn-body-row-boxes-1">
                              <SoftInput value="S Price" readOnly={true} />
                            </SoftBox>
                          </td>
                          <td className="express-grn-rows">
                            <SoftBox className="grn-body-row-boxes-1">
                              <SoftInput value="P Margin" readOnly={true} />
                            </SoftBox>
                          </td>
                          <td className="express-grn-rows">
                            <SoftBox className="grn-body-row-boxes-1">
                              <SoftSelect />
                            </SoftBox>
                          </td>
                          {epoNumber ? (
                            <td className="express-grn-rows">
                              <SoftBox className="grn-body-row-boxes-1">
                                <div
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                  }}
                                >
                                  <AddIcon color="info" style={{ cursor: 'pointer', fontSize: '20px' }} />
                                  <CancelIcon color="error" style={{ cursor: 'pointer', fontSize: '20px' }} />
                                </div>
                              </SoftBox>
                            </td>
                          ) : (
                            !vendorId ||
                            !invoiceRefNo ||
                            !invoiceValue ||
                            !invoiceDate ||
                            (!(assignedTo?.length > 0) ? null : (
                              <td className="express-grn-rows">
                                <SoftBox className="grn-body-row-boxes-1">
                                  <div
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                    }}
                                  >
                                    <AddIcon color="info" style={{ cursor: 'pointer', fontSize: '20px' }} />
                                    <CancelIcon color="error" style={{ cursor: 'pointer', fontSize: '20px' }} />
                                  </div>
                                </SoftBox>
                              </td>
                            ))
                          )}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </SoftBox>
            )}
          </div>
        </SoftBox>
        {/* )} */}
        <SoftBox p={2} className="create-pi-card">
          <GrnItemTable
            itemListArray={itemListArray}
            itemLoader={itemLoader}
            setItemLoader={setItemLoader}
            vendorId={vendorId}
            invoiceRefNo={invoiceRefNo}
            invoiceValue={invoiceValue}
            invoiceDate={invoiceDate}
            assignedTo={assignedTo}
            grnPayload={grnPayload}
            handleAddProduct={handleAddProduct}
            handleAddEXPOProduct={handleAddEXPOProduct}
            rowData={rowData}
            setRowData={setRowData}
            setItemChanged={setItemChanged}
            isItemChanged={isItemChanged}
            handleDltItem={handleDltItem}
            inclusiveTax={inclusiveTax}
            totalRowsGRN={totalRowsGRN}
            setTotalRowsGRN={setTotalRowsGRN}
            tableRef={tableRef}
            additionalList={additionalList}
            setAdditionalList={setAdditionalList}
            isExtraField={isExtraField}
            setIsExtraField={setIsExtraField}
            productSelected={productSelected}
            setProductSelected={setProductSelected}
            titleSelected={titleSelected}
            setTitleSelected={setTitleSelected}
            debounceItemsearch={debounceItemsearch}
            searchItem={searchItem}
            setSearchItem={setSearchItem}
            filteredData={filteredData}
            rowRefs={rowRefs}
            openFullScreen={openFullScreen}
            toggleFullScreen={toggleFullScreen}
            filters={filters}
            filterValues={filterValues}
            handleFilterChange={handleFilterChange}
            applyFilters={applyFilters}
            handleRemoveFilter={handleRemoveFilter}
            searchItemLoader={searchItemLoader}
            setSearchItemLoader={setSearchItemLoader}
            removeSearchItemLoader={removeSearchItemLoader}
            setRemoveSearchItemLoader={setRemoveSearchItemLoader}
            handleleRemoveSearch={handleleRemoveSearch}
            total={total}
            totalStyle={totalStyle}
          />
          {isModalLoading && (
            <GRNDocumentAIModal
              documentJobDetails={documentJobDetails}
              setDocumentJobDetails={setDocumentJobDetails}
              handleSequenceDocumentAI={handleSequenceDocumentAI}
              documentAIItems={documentAIItems}
              setDocumentAIItems={setDocumentAIItems}
              isOpen={isDocumentAIModalOpen}
              onClose={() => setIsDocumentAIModalOpen(false)}
              rowData={rowData}
              isModalLoading={isModalLoading}
              setIsModalLoading={setIsModalLoading}
              setRowData={setRowData}
            />
          )}
        </SoftBox>
        <SoftBox p={3} className="create-pi-card">
          <Grid container spacing={3} justifyContent="space-between">
            <Grid item xs={12} md={6} xl={6} sx={{ marginTop: '-30px' }}>
              <SoftBox className="textarea-box">
                <SoftTypography fontSize="15px" fontWeight="bold">
                  {' '}
                  Add comments
                </SoftTypography>
              </SoftBox>
              <SoftBox style={{ marginTop: '10px' }}>
                <TextareaAutosize
                  defaultValue={comment}
                  onChange={(e) => setComment(e.target.value)}
                  aria-label="minimum height"
                  minRows={3}
                  placeholder="Will be displayed on purchased order"
                  className="add-pi-textarea new-text-area"
                />
              </SoftBox>
            </Grid>
            <Grid item xs={12} md={5} xl={5} sx={{ marginTop: '-30px' }}>
              {/* <SoftBox className="textarea-box" style={{ marginBottom: '10px', marginLeft: '5px' }}>
                <SoftTypography fontSize="15px" fontWeight="bold">
                  {' '}
                  Billing Details (in ₹ )
                </SoftTypography>
              </SoftBox> */}
              <SoftBox className="add-po-bill-details-box" p={3} sx={{ border: 'none !important' }}>
                <SoftBox className="sales-billing-data">
                  <SoftTypography fontSize={'0.78rem'} textAlign="end" style={{ width: '50%' }}>
                    Discount
                  </SoftTypography>
                  <SoftBox className="dis-count-box-1" style={{ width: '40%', marginBottom: '5px' }}>
                    <SoftBox className="boom-box">
                      <SoftInput
                        className="boom-input"
                        disabled={epoNumber ? false : true}
                        value={discount}
                        onChange={(e) => {
                          handleDiscountChange(e);
                        }}
                        type="number"
                      />
                      <SoftBox className="boom-soft-box">
                        <SoftSelect
                          className="boom-soft-select"
                          value={discountType}
                          defaultValue={{ value: '%', label: '%' }}
                          onChange={(option) => handleDiscountType(option)}
                          options={[
                            { value: '%', label: '%' },
                            { value: 'Rs', label: 'Rs' },
                          ]}
                        />
                      </SoftBox>
                    </SoftBox>
                  </SoftBox>
                </SoftBox>
                <SoftBox className="sales-billing-data">
                  <SoftBox
                    style={{
                      width: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      gap: '5px',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      disabled={Number(vendorCredit <= 0) ? true : false}
                      onChange={(e) => handleCheckboxChange(e.target.checked)}
                    />
                    <SoftTypography fontSize={'0.78rem'} textAlign="end">
                      Vendor Credit
                    </SoftTypography>
                  </SoftBox>
                  {isChecked ? (
                    <SoftBox style={{ width: '40%', marginBottom: '5px' }}>
                      <SoftInput
                        type="number"
                        value={creditUsed}
                        onChange={(e) => handleVendorCredit(e.target.value)}
                      />
                    </SoftBox>
                  ) : (
                    <SoftTypography fontSize={'0.78rem'}>{`${vendorCredit || 0} `}</SoftTypography>
                  )}
                </SoftBox>
                <SoftBox className="sales-billing-data">
                  <SoftTypography fontSize={'0.78rem'} textAlign="end" style={{ width: '50%' }}>
                    Cess
                  </SoftTypography>
                  <SoftTypography fontSize={'0.78rem'}>{`${cess || 0}`}</SoftTypography>
                </SoftBox>
                <SoftBox className="sales-billing-data">
                  <SoftTypography fontSize={'0.78rem'} textAlign="end" style={{ width: '50%' }}>
                    Total Discount Value
                  </SoftTypography>
                  <SoftTypography fontSize={'0.78rem'}>{`${totalDiscountValue || 0}`}</SoftTypography>
                </SoftBox>
                <SoftBox className="sales-billing-data">
                  <SoftTypography fontSize={'0.78rem'} textAlign="end" style={{ width: '50%' }}>
                    CGST
                  </SoftTypography>
                  <SoftTypography fontSize={'0.78rem'}>{`${cgst || 0}`}</SoftTypography>
                </SoftBox>
                <SoftBox className="sales-billing-data">
                  <SoftTypography fontSize={'0.78rem'} textAlign="end" style={{ width: '50%' }}>
                    SGST
                  </SoftTypography>
                  <SoftTypography fontSize={'0.78rem'}>{`${sgst || 0}`}</SoftTypography>
                </SoftBox>
                <SoftBox className="sales-billing-data">
                  <SoftTypography fontSize={'0.78rem'} textAlign="end" style={{ width: '50%' }}>
                    IGST
                  </SoftTypography>
                  <SoftTypography fontSize={'0.78rem'}>{`${igst || 0}`}</SoftTypography>
                </SoftBox>
                <SoftBox className="sales-billing-data">
                  <SoftTypography fontSize={'0.78rem'} textAlign="end" style={{ width: '50%' }}>
                    Sub Total
                  </SoftTypography>
                  <SoftTypography fontSize={'0.78rem'}>{`${subTotal || 0}`}</SoftTypography>
                </SoftBox>
                <SoftBox className="sales-billing-data">
                  <SoftTypography fontSize={'1rem'} textAlign="end" fontWeight="bold" style={{ width: '50%' }}>
                    Total
                  </SoftTypography>
                  <SoftBox
                    style={{
                      borderTop: '1px solid #dedede',
                      borderBottom: '1px solid #dedede',
                      width: '40%',
                      padding: '5px',
                    }}
                  >
                    <SoftTypography fontSize={'1rem'} fontWeight="bold" style={totalStyle}>
                      {total !== null ? total : '0'}
                    </SoftTypography>
                  </SoftBox>
                </SoftBox>
                <SoftBox className="sales-billing-data" style={{ marginTop: '10px' }}>
                  <SoftTypography fontSize={'0.78rem'} textAlign="end" style={{ width: '50%' }}>
                    Round Off
                  </SoftTypography>
                  <SoftBox className="dis-count-box-1" style={{ width: '40%', marginBottom: '5px' }}>
                    <SoftInput
                      className="boom-input"
                      value={roundOff}
                      onChange={(e) => setRoundOff(e.target.value)}
                      type="number"
                    />
                  </SoftBox>
                </SoftBox>
                <SoftBox className="sales-billing-data" style={{ marginTop: '10px' }}>
                  <SoftTypography fontSize={'0.78rem'} textAlign="end" style={{ width: '50%' }}>
                    Delivery charge
                  </SoftTypography>
                  <SoftBox className="dis-count-box-1" style={{ width: '40%', marginBottom: '5px' }}>
                    <SoftInput
                      className="boom-input"
                      value={deliveryCharge}
                      onChange={(e) => {
                        setDeliveryCharge(e.target.value);
                        setIsCredit(e.target.value);
                      }}
                      type="number"
                    />
                  </SoftBox>
                </SoftBox>
                <SoftBox className="sales-billing-data" style={{ marginTop: '10px' }}>
                  <SoftTypography fontSize={'0.78rem'} textAlign="end" style={{ width: '50%' }}>
                    Labour charge
                  </SoftTypography>
                  <SoftBox className="dis-count-box-1" style={{ width: '40%', marginBottom: '5px' }}>
                    <SoftInput
                      className="boom-input"
                      value={labourCharge}
                      onChange={(e) => {
                        setLabourCharge(e.target.value);
                        setIsCredit(e.target.value);
                      }}
                      type="number"
                    />
                  </SoftBox>
                </SoftBox>
              </SoftBox>
            </Grid>
            <Grid item xs={12} md={4} xl={4}></Grid>
            <Grid item xs={12} md={6} xl={6}>
              <SoftBox className="add-po-btns" style={{ gap: '10px' }}>
                <SoftButton
                  variant={buttonStyles.secondaryVariant}
                  className="outlined-softbutton"
                  onClick={handleCancel}
                >
                  Cancel{' '}
                </SoftButton>

                {/* <SoftButton
                  variant={buttonStyles.primaryVariant}
                  className="contained-softbutton vendor-add-btn"
                  onClick={handleSave}
                  disabled={saveLoader ? true : false}
                >
                  {saveLoader ? <CircularProgress size={20} /> : <>Save</>}
                </SoftButton> */}
                <SoftButton
                  variant={buttonStyles.primaryVariant}
                  className="contained-softbutton vendor-add-btn"
                  onClick={() => {
                    handleSubmit();
                    handleSequenceDocumentAI();
                  }}
                  disabled={submitLoader ? true : false}
                >
                  {submitLoader ? <CircularProgress size={20} /> : <>Save</>}
                </SoftButton>
              </SoftBox>
              <Modal
                open={openDltModal}
                onClose={handleCloseDltModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box className="pi-approve-menu">
                  <SoftTypography id="modal-modal-title" variant="h6" component="h2">
                    Are you sure you want to delete this.
                  </SoftTypography>
                  <SoftSelect
                    onChange={(e) => setDeleteReason(e.value)}
                    options={[
                      { value: 'Dummy GRN', label: 'Dummy GRN' },
                      { value: 'Wrong data', label: 'Wrong data' },
                      { value: 'No longer required', label: 'No longer required' },
                      { value: 'Others', label: 'Others' },
                    ]}
                  />
                  <SoftBox className="pi-approve-btns-div" style={{ gap: '10px' }}>
                    <SoftButton
                      variant={buttonStyles.secondaryVariant}
                      className="outlined-softbutton"
                      onClick={handleCloseDltModal}
                    >
                      Cancel
                    </SoftButton>
                    <SoftButton className="vendor-add-btn" onClick={handleDeleteEXPO}>
                      {deleteLoader ? <CircularProgress size={20} /> : <>Delete</>}
                    </SoftButton>
                  </SoftBox>
                </Box>
              </Modal>
              <Modal
                open={openGstModal}
                onClose={handleCloseGstModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box className="pi-approve-menu">
                  <SoftTypography id="modal-modal-title" variant="h6" component="h2">
                    Changing GST option will change total billing details. Are you sure, you want to change to{' '}
                    <b>{inclusiveTax === 'false' ? 'GST Inclusive' : 'GST Exclusive'} </b>?
                  </SoftTypography>
                  <SoftBox className="pi-approve-btns-div" style={{ gap: '10px' }}>
                    <SoftButton
                      variant={buttonStyles.secondaryVariant}
                      className="outlined-softbutton"
                      onClick={handleCloseGstModal}
                    >
                      Cancel
                    </SoftButton>
                    <SoftButton
                      className="vendor-add-btn"
                      onClick={() => {
                        handleEditGST(), handleCloseGstModal();
                      }}
                    >
                      Confirm
                    </SoftButton>
                  </SoftBox>
                </Box>
              </Modal>
            </Grid>
          </Grid>
        </SoftBox>
        <CustomWidthTooltip
          title={
            <div className="shortcut-container">
              <ShortcutItem shortcut="Esc" description="Close additional details pop-up" />
              <ShortcutItem shortcut="Alt + S.No." description="Go to specific serial number" />
              <ShortcutItem shortcut="Alt + M" description="Click on add more" />
              <ShortcutItem shortcut="Alt + A" description="Open + for focused S.No." />
              <ShortcutItem shortcut="Alt + R" description="Remove item for focused S.No." />
              <ShortcutItem shortcut="Alt + S" description="Save GRN" />
              <ShortcutItem shortcut="Alt + C" description="Cancel" />
              <ShortcutItem shortcut="Alt + N" description="Open create product pop-up for focused S.No." />
              <ShortcutItem shortcut="Alt + W" description="Delete a GRN" />
              <ShortcutItem shortcut="Alt + Q" description="Save draft product" />
              <ShortcutItem shortcut="Shift + F" description="Enter fullscreen for product" />
              <ShortcutItem shortcut="Shift + W" description="Open search vendor by" />
              <ShortcutItem shortcut="Shift + D" description="Save item data" />
              <ShortcutItem shortcut="Shift + S" description="Search in grn items" />
              <ShortcutItem shortcut="Shift + F / Esc" description="Exit product fullscreen" />
            </div>
          }
          arrow
          placement="top-start"
        >
          <Box
            className="shortCutKeys-icon"
            onClick={(e) => e.stopPropagation()} // Prevents tooltip from closing on click
          >
            <KeyboardCommandKeyIcon color={'white'} />
          </Box>
        </CustomWidthTooltip>
      </Box>
    </DashboardLayout>
  );
};

export default CreateExpressGRN;
