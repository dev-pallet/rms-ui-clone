import CancelIcon from '@mui/icons-material/Cancel';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import {
  Box,
  CircularProgress,
  ClickAwayListener,
  Grid,
  Menu,
  MenuItem,
  Modal,
  TextareaAutosize,
  TextField,
  Tooltip,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { format } from 'date-fns';
import dayjs from 'dayjs';
import { useEffect, useMemo, useRef, useState } from 'react';
import { emit, useNativeMessage } from 'react-native-react-bridge/lib/web';
import { useNavigate, useParams } from 'react-router-dom';
import { components } from 'react-select';
import Swal from 'sweetalert2';
import { useDebounce } from 'usehooks-ts';
import { v4 as uuidv4 } from 'uuid';
import SoftBox from '../../../../../components/SoftBox';
import SoftButton from '../../../../../components/SoftButton';
import SoftInput from '../../../../../components/SoftInput';
import SoftSelect from '../../../../../components/SoftSelect';
import SoftTypography from '../../../../../components/SoftTypography';
import Spinner from '../../../../../components/Spinner';
import {
  additionalInfoPiDetails,
  createPurchaseIndent,
  editPurchaseIndent,
  getAllOrgUsers,
  getAllProducts,
  getAllProductSuggestionV2,
  getAllVendorDetails,
  getAllVendors,
  getAvailableStock,
  getInventoryDetails,
  getPIExisting,
  getPurchaseIndentDetails,
  getRetailUserLocationDetails,
  getUserFromUidx,
  pidelete,
  previewpurchaseIndent,
  previPurchasePrice,
  purchaseRecommendation,
  removePIAssignedTo,
  removePIItem,
  searchProductsVendorSpecific,
  submitPurchaseIndent,
  vendorSkuDetails,
} from '../../../../../config/Services';
import DashboardLayout from '../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../examples/Navbars/DashboardNavbar';
import { useSnackbar } from '../../../../../hooks/SnackbarProvider';
import { buttonStyles } from '../../../Common/buttonColor';
import { decimalPointFormatter, getNextDateWithFlagTrue, isSmallScreen } from '../../../Common/CommonFunction';
import CustomMobileButton from '../../../Common/mobile-new-ui-components/button';
import MobileSearchBar from '../../../Common/mobile-new-ui-components/mobile-searchbar';
import BillingListMobile from '../../../Common/mobile-new-ui-components/MobileBilling';
import MultiTypeInput from '../../../Common/mobile-new-ui-components/multi-type-input';
import MobileDrawerCommon from '../../../Common/MobileDrawer';
import SalesBillingDetailRow from '../../../sales-order/new-sales/components/create-sales/components/billingDetail';
import './index.css';
import CreatePiCard from './mobile-pi-create-components/create-pi-quantity-card';
import PurchaseItemListing from './product-component/item-listing';
import PIProductLookUP from './product-look-up';
import VendorCardDetailsMob from './vendor-detail-mobile-card';
import CommonAccordion from '../../../Common/mobile-new-ui-components/common-accordion';
import ViewMore from '../../../Common/mobile-new-ui-components/view-more';
import SoftAsyncPaginate from '../../../../../components/SoftSelect/SoftAsyncPaginate';

const NewPurchaseIndent = () => {
  const isMobileDevice = isSmallScreen();
  const showSnackbar = useSnackbar();
  const navigate = useNavigate();
  const boxRef = useRef(null);
  const { piNumber } = useParams();
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const contextType = localStorage.getItem('contextType');
  const user_name = localStorage.getItem('user_name');
  const user_details = JSON.parse(localStorage.getItem('user_details'));
  const uidx = user_details.uidx;
  const [isAccordionExpanded, setIsAccordionExpanded] = useState(true);
  const [isCreateAPIResponse, setIsCreateAPIResponse] = useState(false);
  const [vendorNameOption, setVendorNameOption] = useState([]);
  const [vendorGSTOption, setVendorGSTOption] = useState([]);
  const [mainItem, setMainItem] = useState('');
  const [subMainItem, setSubMainItem] = useState({ value: 'Select', label: 'Select' });
  const [view, setView] = useState(false);
  const [vendorId, setVendorId] = useState('');
  const [vendorName, setVendorName] = useState('');
  const [vendorGST, setVendorGST] = useState('');
  const [vendorPAN, setVendorPAN] = useState('');
  const [vendorDisplayName, setVendorDisplayName] = useState('');
  const [vendorType, setVendorType] = useState('');
  const [vendoraddress, setVendoraddress] = useState({});
  const [expectedDate, setExpectedDate] = useState('');
  const [purchaseTerms, setPurchaseTerms] = useState('');
  const [purchaseMethod, setPurchaseMethod] = useState('');
  const [returnAndReplacement, setReturnReplacemnt] = useState('');
  const [shippingMethod, setshippingMethod] = useState('');
  const [warehouseLocName, setWarehouseLocName] = useState('');
  const [assignedToLabel, setAssignedToLabel] = useState([]);
  const [assignLoader, setAssignLoader] = useState(false);
  const [assignedTo, setAssignedTo] = useState([]);
  const [approvedTo, setApprovedTo] = useState({
    uidx: '',
    name: '',
    value: '',
    label: '',
  });
  const [isVendorSelected, setIsVendorSelected] = useState(false);
  const piNum = piNumber ? piNumber : localStorage.getItem('piNum');
  const [listDisplay, setListDisplay] = useState(piNum ? true : false);
  const [openDltModal, setOpenDltModal] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');
  const [dltLoader, setDltLoader] = useState('');
  // const debounceItemRemove = useDebounce(itemRemoved, 700);

  //   Item List useState's
  const [itemListArray, setItemListArray] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [listAllProduct, setListAllProduct] = useState([]);
  const [isItemChanged, setItemChanged] = useState(false);
  const [estimatedcost, setEstimatedCost] = useState('');
  const [totalEstimate, setTotalEstimate] = useState(0);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [labourCharge, setLabourCharge] = useState(0);
  const [overAllCgst, setOverAllCgst] = useState(0);
  const [overAllSgst, setOverAllSgst] = useState(0);
  const [overAllCess, setOverAllCess] = useState(0);
  const [comment, setComment] = useState('');
  const [saveLoader, setSaveLoader] = useState(false);
  const [submitLoader, setSubmitLoader] = useState(false);
  const [previewLoader, setPreviewLoader] = useState(false);
  const [listVendorProd, setlistVendorProd] = useState(false);
  const [piDetailsFilled, setPiDetailsFilled] = useState(false);
  const [mobileItemAddModal, setMobileItemAddModal] = useState(false);
  const [vendorCreditNote, setvendorCreditNote] = useState('');
  const [vendorCreditNoteUsed, setvendorCreditNoteUSed] = useState(0);
  const [vendorDebitNote, setvendorDebitNote] = useState('');
  const [vendorReturns, setvendorReturns] = useState('');
  const [vendorOutstandingBalance, setvendorOutstandingBalance] = useState('');
  const [isClearedLoader, setIsClearedLoader] = useState(false);
  const [isCreditApplied, setIsCreditApplied] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [billChange, setBillChange] = useState('');
  const debounceBill = useDebounce(billChange, 700);

  //new ui mobile states ============================================
  const [basicDetails, setBasicDetails] = useState({
    store: null,
    approvedBy: null,
    assignedTo: [],
    expectedDeliveryDate: null,
  });
  const [mainSelectedInput, setMainSelectedInput] = useState();
  const [selectedInputDataLoader, setSelectedInputDataLoader] = useState(false);
  const [vendorSearchMobile, setVendorSearchMobile] = useState('');
  const [vendorSearchLoader, setVendorSearchLoader] = useState(false);
  const debounceVendorSearch = useDebounce(vendorSearchMobile, 500);
  const [showVendor, setShowVendor] = useState(false);
  const [vendorBusinessInfo, setVendorBusinessInfo] = useState();
  const [productSearchLoader, setProductSearchLoader] = useState(false);
  const [selectedVendorId, setSelectedVendorId] = useState('');
  const [productSearchValue, setProductSearchValue] = useState('');
  const debouncedProductSearch = useDebounce(productSearchValue, 500);
  const [productSearchResults, setProductSearchResults] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [addedProductsInPi, setAddedProductsInPi] = useState([]);
  const [showVendorListing, setShowVendorListing] = useState(false);
  const [productQuantities, setProductQuantities] = useState(null);
  const [isAlreadyAdded, setIsAlreadyAdded] = useState(false);
  const debounceProductQty = useDebounce(productQuantities, 700);
  const [payloadPiItems, setPayloadPiItems] = useState([]);
  const [vendorProductList, setVendorProductList] = useState([]);
  const [totalVendorProducts, setTotalVendorProducts] = useState(0);
  const [vendorViewMoreLoader, setVendorViewMoreLoader] = useState(false);
  const [viewMorePageNo, setViewMorePageNo] = useState(0);

  const vendorSearchRef = useRef();
  const productSearchRef = useRef();
  const parentScrollDiv = useRef();

  useEffect(() => {
    if (debounceVendorSearch !== '') {
      allVendorList(vendorSearchMobile);
    }
  }, [debounceVendorSearch]);

  const handleBasicDetails = (name, value, setSelectedDrawer) => {
    setBasicDetails((prev) => {
      const currentValue = prev[name];

      // Checking if the value already exists in the state
      const valueExists = Array.isArray(currentValue)
        ? currentValue.some((item) => item.value === value.value)
        : currentValue === value;

      if (valueExists) {
        // If the value exists, handling removal based on the field name
        if (name === 'assignedTo') {
          const filteredItem = currentValue.filter((item) => item.value !== value.value);
          return { ...prev, [name]: filteredItem };
        } else {
          return { ...prev, [name]: null };
        }
      } else {
        // If the value does not exist, handling addition based on the field name
        if (name === 'assignedTo') {
          return { ...prev, [name]: [...(currentValue || []), value] };
        } else {
          return { ...prev, [name]: value };
        }
      }
    });

    if (name !== 'assignedTo' && name !== 'expectedDeliveryDate') {
      setSelectedDrawer(false);
    }
  };

  useEffect(() => {
    if (debounceProductQty !== null) {
      if (!piNum) {
        createNewPI();
      } else {
        editDraftPI();
      }
    }
  }, [debounceProductQty]);

  useEffect(() => {
    if (debounceBill !== '' && piNum) {
      editDraftPI();
      setBillChange('');
    }
  }, [debounceBill]);

  const handleBasicDetailsValidation = () => {
    if (!basicDetails?.store?.value) {
      showSnackbar('Select Store');
      return false;
    } else if (!basicDetails?.approvedBy?.value) {
      showSnackbar('Select Approved by');
      return false;
    } else if (!basicDetails?.assignedTo?.length === 0) {
      showSnackbar('Select at least one assignee');
      return false;
    } else if (!basicDetails?.expectedDeliveryDate?.value) {
      showSnackbar('Select expected delivery date');
      return false;
    } else {
      return true;
    }
  };

  const open = Boolean(anchorEl);
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (expectedDate && assignedTo.length > 0 && approvedTo.uidx && warehouseLocName) {
      setPiDetailsFilled(true);
    }
  }, [expectedDate, assignedTo, approvedTo, warehouseLocName]);

  const billingItems = [
    { label: 'Estimated value', value: estimatedcost || 0 },
    view && {
      label: 'Available Credit',
      isCheckbox: true,
      checked: isCreditApplied,
      value: isCreditApplied ? vendorCreditNoteUsed : vendorCreditNote || 0,
      isDisabled: Number(vendorCreditNote <= 0) ? true : false,
      //handleCreditApplied
      onChange: (e) => handleVendorCredit(e.target.value),
    },
    // { label: 'IGST', value: billingData?.igst || 0 },
    { label: 'CGST', value: overAllCgst || 0 },
    { label: 'SGST', value: overAllSgst || 0 },
    { label: 'Cess', value: overAllCess || 0 },
    {
      label: 'Delivery Charges',
      value: deliveryCharge,
      isInput: true,
      onChange: (e) => {
        setDeliveryCharge(e.target.value);
        setBillChange(e.target.value === '' ? 0 : e.target.value);
      },
    },
    {
      label: 'Labour Charges',
      value: labourCharge,
      isInput: true,
      onChange: (e) => {
        setLabourCharge(e.target.value);
        setBillChange(e.target.value === '' ? 0 : e.target.value);
      },
    },
    { label: 'Expected Total', value: totalEstimate || 0, isBold: true },
    view && { label: 'Open debit note', value: vendorDebitNote || 0 },
    view && { label: 'Open returns', value: vendorReturns || 0 },
  ].filter(Boolean);

  const handleVendorProduct = () => {
    if (approvedTo.uidx === '' || assignedTo?.length === 0 || warehouseLocName === '' || expectedDate === '') {
      showSnackbar('Enter all the required fields', 'error');
      return;
    }
    setlistVendorProd((previousOpen2) => !previousOpen2);
  };

  const filterObject = {
    page: 1,
    pageSize: 50,
    filterVendor: {
      searchText: '',
      startDate: '',
      endDate: '',
      locations: [],
      type: [],
      productName: [],
      productGTIN: [],
    },
  };

  let dataArrvendor,
    dataRow = [];

  useEffect(() => {
    allVendorList();
    if (!piNum) {
      listAllLocation();
    }
  }, []);

  useEffect(() => {
    if (listDisplay && piNum) {
      listDraftPiDetails(piNum);
    }
  }, [piNum]);

  const allVendorList = (searchedTextMob) => {
    // if (debounceVendorSearch === null) {
    //   return;
    // }
    setVendorSearchLoader(true);

    if (vendorGSTOption?.length > 0 && !isMobileDevice) {
      return;
    }
    let prevFilterObject = {
      ...filterObject,
    };
    if (isMobileDevice) {
      prevFilterObject.filterVendor.searchText = searchedTextMob || '';
    }
    getAllVendors(filterObject, orgId)
      .then(function (result) {
        if (result?.data?.status === 'ERROR') {
          showSnackbar(result?.data?.message, 'error');
          setVendorSearchLoader(false);
          return;
        } else if (result?.data?.data?.vendors?.length === 0) {
          showSnackbar(`No Vendor Found`, 'error');
          setShowVendorListing(false);
          setVendorNameOption([]);
          setVendorSearchLoader(false);
          return;
        }

        dataArrvendor = result?.data?.data;
        dataRow.push(
          dataArrvendor?.vendors
            ?.map((row) => ({
              value: row?.vendorId,
              label: row?.vendorName,
              gst: row?.gstNumber,
              selectBy: 'Name',
            }))
            .sort((a, b) => a.label.localeCompare(b.label)),
        );
        setVendorNameOption(dataRow[0]);
        if (isMobileDevice && vendorSearchMobile) setShowVendorListing(true);
        setVendorSearchLoader(false);
        const gstRow = dataArrvendor?.vendors
          ?.filter((row) => row?.gstNumber !== null && row?.gstNumber !== '')
          .map((row) => ({
            value: row?.vendorId,
            label: row?.gstNumber,
            name: row?.vendorName,
            selectBy: 'GST',
          }));

        setVendorGSTOption(gstRow || []);
      })
      .catch((err) => {
        showSnackbar(err?.response?.data?.message, 'error');
        setVendorSearchLoader(false);
      });
  };

  const loadVendorNameOption = async (searchQuery, loadedOptions, { page }) => {
    const paylaod = {
      page: page,
      pageSize: 50,
      filterVendor: {
        searchText: searchQuery || '',
        startDate: '',
        endDate: '',
        locations: [],
        type: [],
        productName: [],
        productGTIN: [],
      },
    };

    try {
      const res = await getAllVendors(paylaod, orgId);
      if (res?.data?.status === 'ERROR') {
        showSnackbar(res?.data?.message, 'error');
        return {
          options: [],
          hasMore: false,
        };
      } else {
        dataArrvendor = res?.data?.data;
        const data = res?.data?.data?.vendors || [];
        dataRow.push(
          dataArrvendor?.vendors?.map((row) => ({
            value: row?.vendorId,
            label: row?.vendorName,
            gst: row?.gstNumber,
            selectBy: 'Name',
          })),
        );
        setVendorNameOption(dataRow[0] || []);
        return {
          options: dataRow[0],
          hasMore: data?.length >= 50, // If there are 50 items, assume more data is available
          additional: {
            page: page + 1, // Increment page number
          },
        };
      }
    } catch (error) {
      showSnackbar('Error while fetching data', 'error');
      return {
        options: [],
        hasMore: false,
      };
    }
  };

  const loadVendorGSTOption = async (searchQuery, loadedOptions, { page }) => {
    const paylaod = {
      page: page,
      pageSize: 50,
      filterVendor: {
        searchText: searchQuery || '',
        startDate: '',
        endDate: '',
        locations: [],
        type: [],
        productName: [],
        productGTIN: [],
      },
    };

    try {
      const res = await getAllVendors(paylaod, orgId);
      if (res?.data?.status === 'ERROR') {
        showSnackbar(res?.data?.message, 'error');
        return {
          options: [],
          hasMore: false,
        };
      } else {
        dataArrvendor = res?.data?.data;
        const data = res?.data?.data?.vendors || [];
        dataRow.push(
          dataArrvendor?.vendors?.map((row) => ({
            value: row?.vendorId,
            label: row?.vendorName,
            gst: row?.gstNumber,
            selectBy: 'Name',
          })),
        );
        const gstRow = data
          ?.filter((row) => row?.gstNumber !== null && row?.gstNumber !== '')
          .map((row) => ({
            value: row?.vendorId,
            label: row?.gstNumber,
            name: row?.vendorName,
            selectBy: 'GST',
          }));

        setVendorGSTOption(gstRow || []);
        return {
          options: gstRow || [],
          hasMore: data?.length >= 50, // If there are 50 items, assume more data is available
          additional: {
            page: page + 1, // Increment page number
          },
        };
      }
    } catch (error) {
      showSnackbar('Error while fetching data', 'error');
      return {
        options: [],
        hasMore: false,
      };
    }
  };

  const [assignUserrow, setassignUser] = useState([]);
  let assuser,
    assRow = [];
  const getAllUser = () => {
    setSelectedInputDataLoader(true);
    const payload = {
      orgId: orgId,
      contextId: locId,
    };

    getAllOrgUsers(payload)
      .then((res) => {
        if (res?.data?.status === 'ERROR') {
          setSelectedInputDataLoader(false);
          return;
        }
        assuser = res?.data?.data;
        assRow.push(
          assuser?.map((row) => ({
            value: row?.uidx,
            label: row?.firstName + ' ' + row?.secondName,
          })),
        );
        setassignUser(assRow[0]);
        setSelectedInputDataLoader(false);
      })
      .catch((err) => {
        setSelectedInputDataLoader(false);
      });
  };
  const [locRows, setLocTableRows] = useState([]);
  let locaArr,
    locationRow = [];

  const listAllLocation = () => {
    if (contextType === 'RETAIL') {
      setSelectedInputDataLoader(true);

      getRetailUserLocationDetails(orgId).then((res) => {
        locaArr = res?.data?.data;
        if (locaArr.es) {
          return;
        }
        locationRow.push(
          locaArr?.branches?.map((row) => ({
            value: row?.branchId,
            label: row?.displayName,
          })),
        );
        setLocTableRows(locationRow[0]);
        setSelectedInputDataLoader(false);

        if (!piNum) {
          const foundID = locationRow[0]?.find((ele) => ele?.value === locId);
          if (locationRow[0]?.find((ele) => ele?.value === locId)) {
            setWarehouseLocName(foundID);
          }
        }
      });
    }
  };

  const handleAssignTo = (e) => {
    const assignUser = [];
    const assignUserLabel = [];

    e.forEach((item) => {
      assignUser.push({
        uidx: item.value,
        name: item.label,
        piNumber: piNum || null,
        id: null,
      });

      assignUserLabel.push({
        value: item.value,
        label: item.label,
      });
    });

    if (assignedTo?.length > 0) {
      const removedItems = assignedTo?.filter(
        (prevItem) => !assignUserLabel?.some((item) => item?.value === prevItem?.uidx),
      );
      if (removedItems.length > 0 && piNum) {
        const payload = {
          uidx: removedItems[0]?.uidx,
          piNumber: piNum,
        };
        setAssignLoader(true);
        removePIAssignedTo(payload)
          .then((res) => {
            setAssignLoader(false);
          })
          .catch((err) => {
            setAssignLoader(false);
            if (err?.response?.data?.message === 'Cant delete Assignee') {
              return;
            }
            showSnackbar(err?.response?.data?.message || 'Some error occured', 'error');
          });
      }
    }
    setAssignedTo(assignUser);
    setAssignedToLabel(assignUserLabel);
  };

  const handlMainItem = (e) => {
    if (piNum && (vendorId || !isVendorSelected)) {
      const newSwal = Swal.mixin({
        customClass: {
          cancelButton: 'logout-cancel-btn',
          confirmButton: 'logout-success-btn',
        },
        buttonsStyling: false,
      });

      newSwal
        .fire({
          text: 'Following items have been previously purchased with a different vendor. Are you sure to updated Vendor?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Confirm',
          reverseButtons: true,
        })
        .then((result) => {
          if (result.isConfirmed) {
            setMainItem(e.value);
            setSubMainItem({ value: 'Select', label: 'Select' });
            allVendorList();
          }
        });
    } else {
      setMainItem(e.value);
      setSubMainItem({ value: 'Select', label: 'Select' });
      if (e.value === 'Name' && vendorGSTOption?.length > 0) {
        loadVendorNameOption('', [], { page: 1 }); // Force reload for Name
      } else if (e.value === 'GST' && vendorNameOption?.length > 0) {
        loadVendorGSTOption('', [], { page: 1 }); // Force reload for GST
      }

      allVendorList();
    }
  };

  const additionalPiDetails = async (vendorId) => {
    additionalInfoPiDetails(vendorId).then((res) => {
      if (res?.data?.data?.es === 0) {
        setvendorReturns(res?.data?.data?.returnAmount);
        setvendorDebitNote(res?.data?.data?.debitNote);
        setvendorOutstandingBalance(res?.data?.data?.outstandingAmount);
        setVendorBusinessInfo((prev) => ({
          ...prev,
          vendorReturn: res?.data?.data?.returnAmount,
          vendorDebitNote: res?.data?.data?.debitNote,
          vendorOutstandingBalance: res?.data?.data?.outstandingAmount,
        }));
      }
    });
  };

  const handleBillingAddress = (e) => {
    localStorage.removeItem('vendorProdPage');
    localStorage.removeItem('vendorProdTotalPage');
    if (e.value == 'nil') {
      setView(false);
    } else {
      setView(true);
    }
    const vendorid = e.value;
    let vendorname = '';
    if (e.selectBy === 'Name') {
      vendorname = e.label;
    } else if (e.selectBy === 'GST') {
      vendorname = e.name;
    }
    setSubMainItem({ value: e.label, label: e.label });
    vendorSelected(vendorid);
    setVendorDisplayName(vendorname);
    additionalPiDetails(vendorid);
  };

  function formatString(str) {
    return str
      .toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  function joinObjectExcludeValues(obj, excludeKeys) {
    return Object.entries(obj)
      .filter(([key]) => !excludeKeys.includes(key)) // Exclude the specified keys
      .map(([, value]) => value) // Extract the values
      .join(', '); // Join them with a space
  }

  const vendorSelected = async (vendorid, isVendorPresent) => {
    const payload = {
      vendorId: [vendorid],
    };
    getAllVendorDetails(payload)
      .then((res) => {
        if (res?.data?.data?.es) {
          showSnackbar(res?.data?.data?.message, 'error');
          return;
        }
        const response = res?.data?.data?.object[0];
        const returns = response?.vendorReturn?.some((ele) => ele?.flag === true);
        setReturnReplacemnt(returns ? 'YES' : 'NO');
        let mobilePurchaseTerm;
        if (response?.purchaseTerms) {
          const purchaseTerm = [];
          response?.purchaseTerms
            ?.filter((ele) => ele?.flag === true)
            ?.map((ele) => {
              purchaseTerm.push(formatString(ele?.paymentOption));
            });
          mobilePurchaseTerm = purchaseTerm;
          setPurchaseTerms(purchaseTerm?.join(', '));
        }
        let mobilePurchaseMethod;
        if (response?.purchaseMethods) {
          const purchaseMethod = [];
          response?.purchaseMethods
            ?.filter((ele) => ele?.flag === true)
            ?.map((ele) => {
              purchaseMethod.push(formatString(ele?.day));
            });
          mobilePurchaseMethod = purchaseMethod;
          setPurchaseMethod(purchaseMethod?.join(', ') || 'NA');
        }
        if (response?.deliveryOptions?.length > 0) {
          const schedule = response?.deliveryOptions[0]?.deliveryDays?.filter((ele) => ele?.day !== 'NONE');
          if (schedule?.length > 0) {
            const newDate = getNextDateWithFlagTrue(schedule);
            setExpectedDate(newDate);
          }
        }
        setvendorCreditNote(response?.availableCredits);
        const address = response?.addressList?.find((item) => item?.addressType === 'default');
        setVendoraddress(address ? address : response?.addressList[0]);
        setVendorId(response?.vendorId);
        // setPreferredVendorId(response?.vendorId);
        // setVendorName(response?.vendorName);
        setVendorName(response?.displayName);
        // setPreferredVendor(response?.displayName);
        setVendorGST(response?.gst);
        setVendorPAN(response?.pan);
        setVendorDisplayName(response?.displayName);
        setVendorType(response?.vendorType);
        if (isVendorPresent && isMobileDevice) {
          setVendorBusinessInfo((prev) => ({
            ...prev,
            vendorName: response?.displayName || 'NA',
            vendorId: response?.vendorId || 'NA',
            gst: response?.gst || 'NA',
            vendorPan: response?.pan || 'NA',
            address: address
              ? joinObjectExcludeValues(address, ['phoneNo', 'addressType', 'addressId', 'type'])
              : response?.addressList?.[0],
            availableCredits: response?.availableCredits || 'NA',
            returnAndReplacement: returns ? 'Yes' : 'NO',
            purchaseTerms: mobilePurchaseTerm || ['NA'],
            purchaseMethod: mobilePurchaseMethod || ['NA'],
          }));
          setSelectedVendorId(response?.vendorId);
        }
        setIsVendorSelected(true);
      })
      .catch((err) => {
        setIsVendorSelected(false);
        showSnackbar(err?.response?.data?.message || 'Some error occured', 'error');
      });
  };

  const assignUserDetails = (inputArray) => {
    setAssignedToLabel(
      inputArray?.map((item) => ({
        value: item?.uidx,
        label: item?.name,
      })),
    );
    setAssignedTo(
      inputArray?.map((item) => ({
        name: item?.name,
        uidx: item?.uidx,
        piNumber: item?.piNum,
        id: item?.id,
      })),
    );
    if (isMobileDevice) {
      setBasicDetails((prev) => ({
        ...prev,
        assignedTo: inputArray?.map((item) => ({
          name: item?.name,
          label: item?.name,
          value: item?.uidx,
          piNumber: item?.piNum,
          id: item?.id,
        })),
      }));
    }
  };

  const getUserData = (id) => {
    getUserFromUidx(id)
      .then((res) => {
        const response = res?.data?.data;
        setApprovedTo((prev) => ({
          ...prev,
          uidx: response?.uidx,
          name: response?.firstName + ' ' + response?.secondName,
          value: response?.firstName + ' ' + response?.secondName,
          label: response?.firstName + ' ' + response?.secondName,
        }));
        if (isMobileDevice) {
          setBasicDetails((prev) => ({
            ...prev,
            approvedBy: {
              uidx: response?.uidx,
              name: response?.firstName + ' ' + response?.secondName,
              value: response?.firstName + ' ' + response?.secondName,
              label: response?.firstName + ' ' + response?.secondName,
            },
          }));
        }
      })
      .catch((err) => {});
  };

  const listDraftPiDetails = async (id) => {
    try {
      const res = await getPurchaseIndentDetails(id);
      if (res?.data?.status === 'SUCCESS') {
        const response = res?.data?.data;
        if (response?.status !== 'DRAFT' && response?.status !== 'CREATED' && response?.status === null) {
          setListDisplay(false);
          localStorage.removeItem('piNum');
          navigate('/purchase/purchase-indent/create-purchase-indent');
          return;
        }
        if (listDisplay) {
          localStorage.setItem('piNum', piNum);
          setWarehouseLocName({ value: response?.sourceId, label: response?.deliveryLocation });
          setExpectedDate(response?.expectedDeliveryDate);
          setshippingMethod(response?.shippingMethod);
          setComment(response?.comment);
          setItemListArray(response?.purchaseIndentItems);
          setAddedProductsInPi(response?.purchaseIndentItems);
          setPayloadPiItems(response?.purchaseIndentItems);
          if (isMobileDevice) {
            setBasicDetails((prev) => ({
              ...prev,
              store: { value: response?.sourceId, label: response?.deliveryLocation },
              expectedDeliveryDate: { label: response?.expectedDeliveryDate, value: response?.expectedDeliveryDate },
            }));
          }
          setListDisplay(false);
          if (response?.piType === 'VENDOR_SPECIFIC') {
            setVendorGST(response?.vendorGst);
            setVendorPAN(response?.vendorPan);
            setVendorDisplayName(response?.preferredVendor);
            setVendorId(response?.vendorId);
            setvendorReturns(response?.vendorReturns);
            setvendorCreditNote(response?.vendorCreditNote);
            setvendorDebitNote(response?.vendorDebitNote);
            setvendorOutstandingBalance(response?.vendorOutstandingBalance);
            setIsCreditApplied(Number(response?.availableCredits) > 0);
            setvendorCreditNoteUSed(Number(response?.availableCredits));
            if (isMobileDevice) {
              setVendorBusinessInfo((prev) => ({
                ...prev,
                vendorName: response?.preferredVendor,
                vendorId: response?.vendorId,
                gst: response?.vendorGst,
                vendorPan: response?.vendorPan,
                vendorReturn: response?.vendorReturns,
                vendorOutstandingBalance: response?.vendorOutstandingBalance,
                vendorDebitNote: response?.vendorDebitNote,
                // address: '',
                availableCredits: response?.availableCredits,
                returnAndReplacement: response?.returnAndReplacement,
                purchaseTerms: [response?.purchaseTerms],
                purchaseMethod: [response?.purchaseMethod],
              }));
              setShowVendor(true);
              setSelectedVendorId(response?.vendorId);
              fetchingVendorProducts(response?.vendorId, null, true, undefined, true);
            }
            vendorSelected(response?.vendorId, true);
            setIsVendorSelected(true);
            setReturnReplacemnt(response?.returnAndReplacement);
            setPurchaseMethod(response?.purchaseMethod);
            setPurchaseTerms(response?.purchaseTerms);
            // additionalPiDetails(response?.vendorId);
            setView(true);
          }
          setDeliveryCharge(response?.deliveryCharges);
          setLabourCharge(response?.labourCharges);
          setEstimatedCost(response?.estimatedValue);
          setTotalEstimate(response?.estimatedTotal);
          setOverAllCess(response?.cess);
          setOverAllCgst(response?.cgst);
          setOverAllSgst(response?.sgst);
          if (response?.assignedTo?.length > 0) {
            assignUserDetails(response?.assignedTo);
          }
          if (response?.approvedBy) {
            getUserData(response?.approvedBy);
          }
          allVendorList();
        }
      } else {
        setListDisplay(false);
      }
    } catch (err) {
      if (err?.response?.data?.message === 'No such Purchase indent') {
        setListDisplay(false);
        localStorage.removeItem('piNum');
        navigate('/purchase/purchase-indent/create-purchase-indent');
        return;
      }
      setListDisplay(false);
      localStorage.removeItem('piNum');
      navigate('/purchase/purchase-indent/create-purchase-indent');
      showSnackbar(err?.response?.data?.message || 'Some error occured', 'error');
    }
  };

  const [renderKey, setRenderKey] = useState(0);

  const puchaseItemList = (mobilePayloadItems) => {
    if (!isMobileDevice) {
      const itemList = rowData
        ?.map((row, index) => ({
          itemCode: row?.itemCode,
          itemName: row?.itemName,
          spec: row?.spec,
          quantityOrdered: Number(row?.quantityOrdered) || 0,
          quantityLeft: Number(row?.quantityOrdered) || 0,
          quantityAccepted: 0,
          previousPurchasePrice: row?.previousPurchasePrice === '' ? 0 : Number(row?.previousPurchasePrice) || 0,
          finalPrice: row?.finalPrice === '' ? 0 : Number(row?.finalPrice) || 0,
          preferredVendor: isVendorSelected ? vendorDisplayName : row?.preferredVendor || '',
          vendorId: isVendorSelected ? vendorId : row?.vendorId || '',
          purchaseRecommendationFlag: row?.purchaseRecommendationFlag || '',
          purchaseFlagReason: row?.purchaseFlagReason || '',
          inventoryFlag: row?.inventoryFlag || '',
          salesFlag: row?.salesFlag || '',
          profitFlag: row?.profitFlag || '',
          id: row?.id || null,
          isApproved: 'N',
          hsnCode: row?.hsnCode,
          igst: Number(row?.igst) || 0,
          cess: Number(row?.cess) || 0,
          cgst: Number(row?.cgst) || 0,
          sgst: Number(row?.sgst) || 0,
          purchaseMargin: row?.purchaseMargin || 0,
          salesPerWeek: row?.salesPerWeek || 0,
          availableStock: row?.availableStock || 0,
        }))
        .filter(
          (item) =>
            item.itemCode !== '' &&
            item.itemName !== '' &&
            item.itemCode !== null &&
            item.itemName !== null &&
            item.itemCode !== undefined &&
            item.itemName !== undefined,
        );
      if (itemList?.length > 0) {
        return itemList;
      }
      return [];
    } else {
      if (isVendorSelected) {
        const updatedItems = mobilePayloadItems?.map((item) => ({
          ...item,
          vendorId: vendorBusinessInfo?.vendorId || '',
          preferredVendor: vendorBusinessInfo?.vendorName || '',
        }));
        return updatedItems;
      } else {
        return mobilePayloadItems;
      }
    }
  };

  const handleEmailTemplate = () => {
    setPreviewLoader(true);
    const purchaseItemListFiltered = puchaseItemList();
    const payload = {
      orgId: orgId,
      sourceId: warehouseLocName?.value || locId,
      sourceType: contextType,
      destinationId: warehouseLocName?.value || locId,
      destinationType: contextType,
      tenantId: '1',
      deliveryLocation: warehouseLocName.label,
      expectedDeliveryDate: expectedDate,
      // requestedOn: startDate,
      // shippingTerms: shippingTerm,
      shippingMethod: shippingMethod,
      assignedTo: assignedTo,
      approvedby: approvedTo,
      createdby: uidx,
      purchaseIndentItems: purchaseItemListFiltered,
      comment: comment,
      preferredVendor: vendorDisplayName,
      vendorId: vendorId,
    };

    previewpurchaseIndent(payload)
      .then((res) => {
        const blob = new Blob([res.data], { type: 'application/pdf' });
        const objectUrl = URL.createObjectURL(blob);
        window.open(objectUrl);
        setPreviewLoader(false);
      })
      .catch((err) => {
        showSnackbar(err?.response?.data?.message || 'Some error occured', 'error');
        setPreviewLoader(false);
      });
  };

  const handleDeletePI = () => {
    setDltLoader(true);
    const payload = {
      piNumber: piNum,
      reason: deleteReason.value,
    };
    pidelete(payload)
      .then((res) => {
        setDltLoader(false);
        if (res?.data?.data?.message == 'deleted successfully') {
          if (!isMobileDevice) {
            navigate('/purchase/purchase-indent');
          } else {
            navigate('/purchase/ros-app-purchase?value=purchaseIndent');
          }
          localStorage.removeItem('piNum');
        } else {
          setOpenDltModal(false);
          showSnackbar(res?.data?.data?.message, 'error');
        }
      })
      .catch((err) => {
        setDltLoader(false);
        setOpenDltModal(false);
        showSnackbar(err?.response?.data?.message, 'error');
      });
  };

  const handleSubmit = async () => {
    try {
      setSubmitLoader(true);
      await editDraftPI(undefined, undefined, undefined, true);
      const payload = {
        piNumber: piNum,
        piStatus: 'CREATED',
        comments: 'string',
        updatedByUser: user_name,
      };
      const res = await submitPurchaseIndent(payload);
      setSubmitLoader(false);
      if (res?.data?.status === 'SUCCESS') {
        if (!isMobileDevice) {
          navigate('/purchase/purchase-indent');
        } else {
          navigate('/purchase/ros-app-purchase?value=purchaseIndent');
        }
        localStorage.removeItem('piNum');
      } else {
        showSnackbar(res?.data?.message || 'Some error occured', 'error');
      }
    } catch (err) {
      setSubmitLoader(false);
      if (err?.response?.data?.message === 'Error occurred while submitting purchase indent: Already Submited') {
        navigate('/purchase/purchase-indent');
        localStorage.removeItem('piNum');
        return;
      }
      showSnackbar(err?.response?.data?.message || 'Some error occured', 'error');
    }
  };

  const handleItemDelete = async (index) => {
    if (listDisplay) {
      return;
    }
    if (rowData[index]?.id === '' || rowData[index]?.id === null) {
      const updatedRowData = [...rowData];
      updatedRowData.splice(index, 1);
      setRowData(updatedRowData);
      return;
    }
    const payload = {
      itemIds: [rowData[index]?.id],
    };
    setListDisplay(true);
    try {
      await removePIItem(payload);
      const res = await getPurchaseIndentDetails(piNum);

      if (res?.data?.status === 'SUCCESS') {
        const response = res?.data?.data;
        setItemListArray(response?.purchaseIndentItems);
        setBillChange('changed');
      } else {
        showSnackbar(res?.data?.message || 'Some error occurred', 'error');
      }
      setListDisplay(false);
    } catch (err) {
      setListDisplay(false);
      showSnackbar(err?.response?.data?.message || 'Some error occurred', 'error');
    } finally {
      setListDisplay(false);
    }
  };

  const handleDelete = (index, isCleared, itemId) => {
    if (listDisplay) {
      return;
    }
    setIsClearedLoader(true);
    if (rowData[index]?.id === '' || rowData[index]?.id === null) {
      if (isCleared) {
        const updatedRowData = [...rowData];
        updatedRowData.splice(index, 1);
        updatedRowData.push({
          itemId: uuidv4(),
          id: '',
          itemCode: '',
          itemName: '',
          preferredVendor: '',
          previousPurchasePrice: '',
          vendorId: '',
          spec: '',
          finalPrice: '',
          quantityOrdered: '',
          purchaseRecommendationFlag: '',
          purchaseFlagReason: '',
          salesFlag: '',
          inventoryFlag: '',
          profitFlag: '',
          previousQuantityOrdered: '',
          availableStock: '',
          purchaseMargin: '',
          salesPerWeek: '',
          cess: 0,
          igst: 0,
          cgst: 0,
          sgst: 0,
          hsnCode: '',
        });
        setRowData(updatedRowData);
        setIsClearedLoader(false);
        return;
      } else {
        const updatedRowData = [...rowData];
        updatedRowData.splice(index, 1);
        setRowData(updatedRowData);
        setIsClearedLoader(false);
        return;
      }
    }
    const payload = {
      itemIds: isMobileDevice ? [itemId] : [rowData[index]?.id],
    };
    removePIItem(payload)
      .then((res) => {
        setListDisplay(true);
        // setItemRemoved(true);
        getPurchaseIndentDetails(piNum)
          .then((res) => {
            if (res?.data?.status === 'SUCCESS') {
              const response = res?.data?.data;
              if (isCleared === true) {
                const newRowData = [
                  ...response?.purchaseIndentItems,
                  {
                    itemId: uuidv4(),
                    id: '',
                    itemCode: '',
                    itemName: '',
                    preferredVendor: '',
                    previousPurchasePrice: '',
                    vendorId: '',
                    spec: '',
                    finalPrice: '',
                    quantityOrdered: '',
                    purchaseRecommendationFlag: '',
                    purchaseFlagReason: '',
                    salesFlag: '',
                    inventoryFlag: '',
                    profitFlag: '',
                    previousQuantityOrdered: '',
                    availableStock: '',
                    purchaseMargin: '',
                    salesPerWeek: '',
                    cess: 0,
                    igst: 0,
                    cgst: 0,
                    sgst: 0,
                    hsnCode: '',
                  },
                ];
                setRowData(newRowData);
              } else {
                setRowData(response?.purchaseIndentItems);
                setAddedProductsInPi(response?.purchaseIndentItems);
              }
              setListDisplay(false);
              setIsClearedLoader(false);
              setProductQuantities(uuidv4());
              return;
            }
            setListDisplay(false);
            setIsClearedLoader(false);
          })
          .catch((err) => {
            setListDisplay(false);
            setIsClearedLoader(false);
          });

        if (isCleared === true) {
          const updatedRowData = [...rowData];
          updatedRowData.splice(index, 1);
          updatedRowData.push({
            itemId: uuidv4(),
            id: '',
            itemCode: '',
            itemName: '',
            preferredVendor: '',
            previousPurchasePrice: '',
            vendorId: '',
            spec: '',
            finalPrice: '',
            quantityOrdered: '',
            purchaseRecommendationFlag: '',
            purchaseFlagReason: '',
            salesFlag: '',
            inventoryFlag: '',
            profitFlag: '',
            previousQuantityOrdered: '',
            availableStock: '',
            purchaseMargin: '',
            salesPerWeek: '',
            cess: 0,
            igst: 0,
            cgst: 0,
            sgst: 0,
            hsnCode: '',
          });
          setRowData(updatedRowData);
          setIsClearedLoader(false);
        } else {
          const updatedRowData = [...rowData];
          updatedRowData.splice(index, 1);
          setRowData(updatedRowData);
          setIsClearedLoader(false);
        }
      })
      .catch((err) => {
        setIsClearedLoader(false);
      });
    // if (!isMobileDevice) {
    //   setCount((prev) => prev - 1);
    // }
  };

  const ValueContainer = ({ children, ...props }) => {
    let [values, input] = children;
    let childrenComponent;
    if (values?.length > 1) {
      childrenComponent = children?.map((child, index) => {
        const childValue = index === 0 ? [...child] : { ...child };
        let newChildValues;
        if (index === 0) {
          newChildValues = childValue?.reverse().splice(0, 1);
        }
        if (childValue?.length) {
          return [...newChildValues];
        }
        return null;
        // return { ...childValue };
      });
    }
    if (Array.isArray(values)) {
      const { length } = values;
      values = `+${length - 1} Selected`;
    }
    return (
      <components.ValueContainer {...props}>
        {children[0]?.length > 1 ? (
          <>
            {childrenComponent}
            {values}
          </>
        ) : (
          children
        )}
      </components.ValueContainer>
    );
  };

  const [isFixed, setIsFixed] = useState(false);
  const softBoxRef = useRef(null);

  useEffect(() => {
    if (!isMobileDevice) {
      const handleScroll = () => {
        const softBoxTop = softBoxRef?.current?.getBoundingClientRect().top;
        setIsFixed(softBoxTop <= 40);
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const handleCreditApplied = (value) => {
    setIsCreditApplied(value);
    if (!value && vendorCreditNoteUsed > 0) {
      setvendorCreditNoteUSed(0);
      setBillChange(vendorCreditNoteUsed);
    }
  };

  const handleVendorCredit = (value) => {
    if (Number(value) > Number(vendorCreditNote)) {
      showSnackbar('Insuffiecient credit note entered', 'error');
      return;
    }
    setvendorCreditNoteUSed(value);
    setBillChange(value === '' ? 0 : value);
  };

  const editDraftPI = (newRowData, item, updatedData, isSubmit) => {
    if (isMobileDevice) {
      setProductSearchLoader(true);
    }
    return new Promise((resolve, reject) => {
      if (piNum) {
        const editPayload = {
          orgId: orgId,
          tenantId: '1',
          sourceId: warehouseLocName?.value || locId,
          sourceType: contextType,
          destinationId: warehouseLocName?.value || locId,
          destinationType: contextType,
          deliveryLocation: isMobileDevice ? basicDetails?.store?.label || '' : warehouseLocName.label || '',
          expectedDeliveryDate: isMobileDevice ? basicDetails?.expectedDeliveryDate?.value || '' : expectedDate || '',
          shippingMethod: shippingMethod,
          createdBy: uidx,
          updatedBy: user_name,
          statusUpdatedBy: user_name,
          purchaseIndentItems: puchaseItemList(payloadPiItems),
          assignedTo: !isMobileDevice
            ? assignedTo
            : basicDetails?.assignedTo?.map((item) => ({
                uidx: item?.value,
                name: item?.label,
                piNumber: item?.piNumber || null,
                id: item?.id || null,
              })),
          approvedBy: approvedTo.uidx || basicDetails?.approvedBy?.value || '',
          approverName: approvedTo.name || basicDetails?.approvedBy?.label || '',
          piType: isVendorSelected ? 'VENDOR_SPECIFIC' : 'OPEN_TO_VENDOR',
          preferredVendor: vendorDisplayName || vendorBusinessInfo?.vendorName || '',
          vendorId: vendorId || vendorBusinessInfo?.vendorId || '',
          purchaseIndentNo: piNum,
          vendorGst: vendorGST || vendorBusinessInfo?.gst || '',
          vendorPan: vendorPAN || vendorBusinessInfo?.vendorPan || '',
          deliveryCharges: Number(deliveryCharge) || 0,
          vendorCreditNote: vendorCreditNote || vendorBusinessInfo?.availableCredits || '',
          vendorDebitNote: vendorDebitNote || vendorBusinessInfo?.vendorDebitNote,
          vendorReturns: vendorReturns || vendorBusinessInfo?.vendorReturn || '',
          labourCharges: Number(labourCharge) || 0,
          estimatedValue: decimalPointFormatter(Number(estimatedcost)),
          estimatedTotal: decimalPointFormatter(Number(totalEstimate)),
          returnAndReplacement: returnAndReplacement || vendorBusinessInfo?.returnAndReplacement,
          purchaseTerms: purchaseTerms || '',
          purchaseMethod: purchaseMethod || '',
          availableCredits: isCreditApplied ? Number(vendorCreditNoteUsed) : 0,
          cess: Number(overAllCess) || 0,
          cgst: Number(overAllCgst) || 0,
          sgst: Number(overAllSgst) || 0,
          status: 'DRAFT',
        };
        if (totalEstimate < 0) {
          showSnackbar('Expected total is less than 0. Please enter the correct data', 'error');
          return;
        }
        editPurchaseIndent(editPayload)
          .then((res) => {
            if (res?.data?.status === 'SUCCESS') {
              localStorage.setItem('piNum', res?.data?.data?.purchaseIndentNo);
              if (saveLoader || submitLoader) {
                setSaveLoader(false);
                setSubmitLoader(false);
                resolve();
                return;
              } else {
                const response = res?.data?.data;
                setEstimatedCost(response?.estimatedValue);
                setTotalEstimate(response?.estimatedTotal);
                setOverAllCess(response?.cess);
                setOverAllCgst(response?.cgst);
                setOverAllSgst(response?.sgst);
                if (!isMobileDevice) {
                  const updatedRowData = newRowData
                    ? newRowData?.map((row, index) => {
                        if (index < response?.purchaseIndentItems?.length) {
                          if (row.id === '' || row.id === null) {
                            return {
                              ...row,
                              id: response?.purchaseIndentItems[index]?.id,
                              purchaseMargin: response?.purchaseIndentItems[index]?.purchaseMargin,
                              salesPerWeek: response?.purchaseIndentItems[index]?.salesPerWeek,
                            };
                          }
                        }
                        return row;
                      })
                    : rowData?.map((row, index) => {
                        if (index < response?.purchaseIndentItems?.length) {
                          if (row.id === '' || row.id === null) {
                            return {
                              ...row,
                              id: response?.purchaseIndentItems[index]?.id,
                              purchaseMargin: response?.purchaseIndentItems[index]?.purchaseMargin,
                              salesPerWeek: response?.purchaseIndentItems[index]?.salesPerWeek,
                            };
                          }
                        }
                        return row;
                      });
                  setRowData(updatedRowData);
                } else {
                  addingProductInPiAfterEdit(item, updatedData, response, undefined, isSubmit);
                }
                setItemChanged(false);
                resolve();
              }
            } else {
              showSnackbar(res?.data?.status, 'error');
              setSaveLoader(false);
              setSubmitLoader(false);
            }
          })
          .catch((err) => {
            setSaveLoader(false);
            setSubmitLoader(false);
            showSnackbar(err?.response?.data?.message || 'Some error occured', 'error');
            reject(err);
          })
          .finally(() => {
            setSaveLoader(false);
            setProductSearchLoader(false);
            setIsCreateAPIResponse(false);
          });
      }
    });
  };

  const updateRowData = (data, responseData) => {
    return data?.map((row, index) => {
      if (index < responseData?.length && (row.id === '' || row.id === null)) {
        return {
          ...row,
          id: responseData[index]?.id,
          purchaseMargin: responseData[index]?.purchaseMargin,
          salesPerWeek: responseData[index]?.salesPerWeek,
        };
      }
      return row;
    });
  };

  const createNewPI = () => {
    if (isMobileDevice) setProductSearchLoader(true);
    const purchaseItemListFiltered = puchaseItemList(payloadPiItems);
    const payload = {
      orgId: orgId,
      sourceId: warehouseLocName?.value || locId,
      sourceType: contextType,
      destinationId: warehouseLocName?.value || locId,
      destinationType: contextType,
      tenantId: '1',
      deliveryLocation: warehouseLocName.label || basicDetails?.store?.label,
      expectedDeliveryDate: expectedDate || basicDetails?.expectedDeliveryDate?.value,
      // requestedOn: startDate,
      // shippingTerms: shippingTerm,
      shippingMethod: shippingMethod,
      assignedTo: !isMobileDevice
        ? assignedTo
        : basicDetails?.assignedTo?.map((item) => ({
            uidx: item?.value,
            name: item?.label,
            piNumber: item?.piNumber || null,
            id: item?.id || null,
          })),
      approvedBy: approvedTo.uidx || basicDetails?.approvedBy?.value,
      approverName: approvedTo.name || basicDetails?.approvedBy?.label,
      createdBy: uidx,
      createdByUser: user_name,
      purchaseIndentItems: purchaseItemListFiltered,
      comment: comment,
      piType: isVendorSelected || vendorBusinessInfo?.vendorId ? 'VENDOR_SPECIFIC' : 'OPEN_TO_VENDOR',
      preferredVendor: vendorDisplayName || vendorBusinessInfo?.vendorName || '',
      vendorId: vendorId || vendorBusinessInfo?.vendorId || '',
      vendorGst: vendorGST || vendorBusinessInfo?.gst || '',
      vendorPan: vendorPAN || vendorBusinessInfo?.vendorPan || '',
      deliveryCharges: Number(deliveryCharge) || 0,
      vendorCreditNote: Number(vendorCreditNote) || Number(vendorBusinessInfo?.availableCredits) || 0,
      vendorDebitNote: Number(vendorDebitNote) || Number(vendorBusinessInfo?.vendorDebitNote) || 0,
      vendorReturns: vendorReturns || Number(vendorBusinessInfo?.vendorReturn) || 0,
      labourCharges: Number(labourCharge) || 0,
      estimatedValue: Number(estimatedcost) || 0,
      estimatedTotal: Number(totalEstimate) || 0,
      returnAndReplacement: returnAndReplacement || vendorBusinessInfo?.returnAndReplacement || '',
      purchaseTerms: purchaseMethod || '',
      purchaseMethod: purchaseMethod || '',
      availableCredits: isCreditApplied ? vendorCreditNoteUsed : 0,
      cess: Number(overAllCess),
      cgst: Number(overAllCgst),
      sgst: Number(overAllSgst),

      // status: 'string',
    };
    createPurchaseIndent(payload)
      .then(function (res) {
        if (res?.data?.status === 'SUCCESS') {
          const response = res?.data?.data;
          localStorage.setItem('piNum', response?.purchaseIndentNo);
          // listDraftPiDetails(response?.purchaseIndentNo);
          if (response?.purchaseIndentItems && response?.purchaseIndentItems.length > 0) {
            if (!isMobileDevice) {
              const updatedRowData = updateRowData(rowData, response?.purchaseIndentItems);
              setRowData(updatedRowData);
            } else {
              setAddedProductsInPi(response?.purchaseIndentItems);
              setSelectedProduct([]);
              setProductSearchLoader(false);
            }
          }
        } else {
          if (isMobileDevice) {
            showSnackbar(res?.data?.message, 'error');
          }
        }
        setSaveLoader(false);
        setIsCreateAPIResponse(false);
      })
      .catch((err) => {
        setIsCreateAPIResponse(false);
        showSnackbar(err?.response?.data?.message || 'Some Error Occured', 'error');
      })
      .finally(() => {
        setSaveLoader(false);
        setIsCreateAPIResponse(false);
      });
  };

  const calCulateTotalEstimate = (estimatedcost, cgst, sgst, cess) => {
    const taxValue =
      Number(estimatedcost || 0) +
      Number(cgst || 0) +
      Number(sgst || 0) +
      Number(cess || 0) +
      Number(deliveryCharge || 0) +
      Number(labourCharge || 0);
    const isCreditApply = isCreditApplied ? taxValue - Number(vendorCreditNoteUsed || 0) : taxValue;
    return isCreditApply;
  };

  const basicDetailsArray = useMemo(
    () => [
      {
        itemLabel: 'Select Stores',
        itemValue: 'store',
        inputType: 'select',
        selectOptions: locRows,
      },
      {
        itemLabel: 'Approved By',
        itemValue: 'approvedBy',
        inputType: 'select',
        selectOptions: assignUserrow,
      },
      {
        itemLabel: 'Assigned To',
        itemValue: 'assignedTo',
        inputType: 'multi-select',
        selectOptions: assignUserrow,
      },
      { itemLabel: 'Expected Delivery Date', itemValue: 'expectedDeliveryDate', inputType: 'date' },
    ],
    [assignUserrow, locRows],
  );

  useEffect(() => {
    if ((mainSelectedInput === 'assignedTo' || mainSelectedInput === 'approvedBy') && assignUserrow?.length === 0) {
      getAllUser();
    } else if (mainSelectedInput === 'store' && locRows?.length === 0) {
      listAllLocation();
    }
  }, [mainSelectedInput]);

  const handleVendorSearchMobile = (e) => {
    // if (showVendor) return showSnackbar('Remove current vendor', 'error');
    if (e.target.value === '') {
      setShowVendorListing(false);
    } else {
      setShowVendorListing(true);
    }
    setVendorSearchMobile(e.target.value);
  };

  const selectVendor = async (vendorId) => {
    setProductSearchLoader(true);
    setShowVendorListing(false);
    setShowVendor(true);
    setVendorSearchMobile('');
    setSelectedVendorId(vendorId);
    await vendorSelected(vendorId, true);
    await additionalPiDetails(vendorId);
    await fetchingVendorProducts(vendorId, undefined, undefined, undefined, true);
    setView(true);
    setProductSearchLoader(false);
  };

  const deselectVendor = () => {
    setSelectedVendorId('');
    setVendorBusinessInfo();
    setView(false);
    setVendorProductList([]);
    setViewMorePageNo(0);
    setShowVendor(false);
    setIsVendorSelected(false);
    setVendorGST('');
    setVendorPAN('');
    setVendorDisplayName('');
    setVendorId('');
    setvendorReturns('');
    setvendorCreditNote('');
    setvendorDebitNote('');
    setvendorOutstandingBalance('');
    setIsCreditApplied(false);
    setvendorCreditNoteUSed(0);
    setReturnReplacemnt('');
    setPurchaseMethod('');
    setPurchaseTerms('');
  };

  const fetchingVendorProducts = async (vendorId, searchedText, isDraftApiCall, pageNo, vendorSelect) => {
    if (!vendorId && isDraftApiCall && !searchedText)
      return showSnackbar('Vendor Id not found, select vendor again', 'error');
    // if (!isDraftApiCall) {
    //   if (!handleBasicDetailsValidation()) {
    //     return;
    //   }
    // }
    let payload = {
      pageNo: pageNo || viewMorePageNo || 0,
      pageSize: 5,
      locationId: locId,
      orgId: orgId,
      vendorId: vendorId,
    };
    if (pageNo > 0) {
      setVendorViewMoreLoader(true);
    }
    if (searchedText) {
      payload.pageNo = 0;
      if (!isNaN(searchedText) && searchedText.trim() !== '' && searchedText) {
        payload.gtin = searchedText;
        payload.title = null;
      } else {
        payload.title = searchedText;
        payload.gtin = null;
      }
    }
    try {
      const response = await searchProductsVendorSpecific(payload);
      if (
        (response?.data?.status === 'ERROR' || response?.data?.data?.es > 0) &&
        !searchedText
        // (pageNo === 0 || viewMorePageNo === 0)
      ) {
        showSnackbar(
          response?.data?.message ||
            response?.data?.data?.message ||
            'Something went wrong while fetching vendor products',
          'error',
        );
        setProductSearchLoader(false);
        if (pageNo > 0) {
          setVendorViewMoreLoader(false);
        } else {
          setVendorProductList([]);
        }
        return;
      }
      if (searchedText) return response;
      else {
        if (pageNo > 0 || viewMorePageNo > 0) {
          setViewMorePageNo(pageNo);
          setVendorProductList((prev) => [...prev, ...response?.data?.data?.object]);
        } else {
          setVendorProductList(response?.data?.data?.object);
          if (vendorSelect) setTotalVendorProducts(response?.data?.data?.totalResults);
        }
        setVendorViewMoreLoader(false);
        // setSelectedProduct(response?.data?.data?.object);
      }
    } catch (error) {
      if (pageNo > 0) {
        setVendorViewMoreLoader(false);
      }
      setProductSearchLoader(false);
    }
  };

  const fetchingCmsProducts = async (searchedText) => {
    let payload = {
      page: 1,
      pageSize: 10,
      // storeLocationId: locId?.toLocaleLowerCase(),
      storeLocations: [locId],
      barcode: [],
      query: '',
    };

    if (searchedText) {
      payload.query = searchedText;
      // if (!isNaN(searchedText) && searchedText.trim() !== '' && searchedText) {
      //   payload.barcode = [searchedText];
      // } else {
      //   payload.query = searchedText;
      // }
    }
    try {
      const response = await getAllProductSuggestionV2(payload);
      if (response?.data?.status === 'ERROR') {
        showSnackbar(response?.data?.message, 'error');
        setProductSearchLoader(false);
        return null;
      }
      return response;
    } catch (error) {
      setProductSearchLoader(false);
    }
  };

  const searchMobileProducts = async (searchedText, isScanned) => {
    if (searchedText === '') {
      setProductSearchResults([]);
      return;
    }

    setProductSearchLoader(true);
    setSelectedProduct([]);
    try {
      let vendorProductSearchRespone;
      if (showVendor) {
        vendorProductSearchRespone = await fetchingVendorProducts(selectedVendorId, searchedText);
      }
      let productResponse;
      if (
        vendorProductSearchRespone?.data?.data?.object?.length === 0 ||
        vendorProductSearchRespone?.data?.data?.es > 0 ||
        vendorProductSearchRespone === undefined
      ) {
        productResponse = await fetchingCmsProducts(searchedText);
      }
      if (productResponse === null) {
        setProductSearchLoader(false);
        return;
      } else if (
        productResponse?.data?.data?.data?.data?.length === 0 ||
        vendorProductSearchRespone?.data?.data?.object?.length === 0
      ) {
        setProductSearchLoader(false);
        return showSnackbar('No Data Found', 'error');
      }
      const searchProductVariantResults = productResponse?.data?.data?.data?.data?.flatMap((item) =>
        item?.variants?.map((variant) => ({
          ...variant,
          taxReference: item?.taxReference,
        })),
      );
      setProductSearchResults(vendorProductSearchRespone?.data?.data?.object || searchProductVariantResults);
      if (isScanned) {
        const selectingVariant = productResponse?.data?.data?.data?.data?.[0]?.variants?.find(
          (item) => item?.barcodes?.[0] === searchedText,
        );
        selectingProducts(vendorProductSearchRespone?.data?.data?.object?.[0] || selectingVariant);
      }
      setProductSearchLoader(false);
    } catch (error) {
      console.log({ error });
    }
  };

  const settingProductSearchValue = (e) => {
    const isValid = handleBasicDetailsValidation();
    if (!isValid) return;
    setProductSearchValue(e.target.value);
  };

  useEffect(() => {
    if (debouncedProductSearch !== null) {
      searchMobileProducts(productSearchValue);
    }
  }, [debouncedProductSearch]);

  const productWithVendor = async (gtin) => {
    const payload = {
      gtin: [gtin],
    };

    try {
      const response = await vendorSkuDetails(payload);
      if (response?.data?.data?.status && response?.data?.data?.object?.length > 0) {
        const vendorPayload = {
          page: 1,
          pageSize: 50,
          filterVendor: {
            searchText: response?.data?.data?.object[0]?.vendorId || '',
            startDate: '',
            endDate: '',
            locations: [],
            type: [],
            productName: [],
            productGTIN: [],
          },
        };
        const vendorRes = await getAllVendors(vendorPayload, orgId);
        const vendors = vendorRes?.data?.data?.vendors || [];
        const newObj = vendors?.find((v) => v?.vendorId == response?.data?.data?.object[0]?.vendorId) || {};
        setSelectedProduct((prevState) => {
          const productData = prevState?.[0] || {};
          return [
            {
              ...productData,
              vendorId: newObj?.vendorId || '',
              preferredVendor: newObj?.vendorName || '',
            },
          ];
        });
      }
    } catch (error) {
      setSelectedProduct((prevState) => {
        const productData = prevState?.[0] || {};
        return [
          {
            ...productData,
            vendorId: '',
            preferredVendor: '',
          },
        ];
      });
      // return null;
    }
  };

  const handleExistingPI = (gtin, index, item) => {
    setProductSearchLoader(true);
    getPIExisting(gtin, orgId, locId)
      .then((res) => {
        if (res?.data?.data?.es > 0) {
          const newSwal = Swal.mixin({
            buttonsStyling: false,
          });
          newSwal
            .fire({
              title: `${res?.data?.data?.message}. Do you still want to add it in this PI ?`,
              icon: 'warning',
              confirmButtonText: 'Confirm',
              showCancelButton: true,
              reverseButtons: true,
              customClass: {
                title: 'custom-swal-title',
                cancelButton: 'logout-cancel-btn',
                confirmButton: 'logout-success-btn',
              },
            })
            .then((result) => {
              if (!result.isConfirmed) {
                if (!isMobileDevice) {
                  handleDelete(index);
                } else {
                  setProductSearchResults([]);
                  setSelectedProduct([]);
                  setProductSearchLoader(false);
                }
              } else {
                if (isMobileDevice) {
                  fetchingAndSettingProductData(item);
                }
              }
            });
        } else {
          fetchingAndSettingProductData(item);
        }
      })
      .catch((err) => {
        fetchingAndSettingProductData(item);
        // showSnackbar(err?.response?.data?.message, 'error');
      });
  };

  const handleFlagdata = async (itemCode) => {
    const payload = {
      gtin: itemCode,
      locationId: locId,
      orgId: orgId,
    };

    try {
      const response = await purchaseRecommendation(payload);

      if (response?.data?.data?.es === 0) {
        if (response?.data?.data?.productForecast.inventoryCat === 'D') {
          // OPEN ALERT
          const newSwal = Swal.mixin({
            buttonsStyling: false,
          });
          newSwal
            .fire({
              title: 'This product is a dead stock, do you still want to buy this product?',
              icon: 'warning',
              confirmButtonText: 'Confirm',
              showCancelButton: true,
              reverseButtons: true,
              customClass: {
                title: 'custom-swal-title',
                cancelButton: 'logout-cancel-btn',
                confirmButton: 'logout-success-btn',
              },
            })
            .then((result) => {
              if (!result.isConfirmed) {
                if (isMobileDevice) {
                  setSelectedProduct([]);
                  setProductSearchResults([]);
                }
              }
            });
        }
        setSelectedProduct((prevState) => {
          const productData = prevState?.[0] || {};
          return [
            {
              ...productData,
              productForeCastModel: response?.data?.data?.productForecast,
            },
          ];
        });
      }
    } catch (error) {
      // return null;
    }
  };

  const handleMrp = async (gtin) => {
    try {
      const res = await getInventoryDetails(locId, gtin);
      let newMRp = 0;
      if (res?.data?.data?.es) {
        return null;
      } else {
        const response = res?.data?.data?.data?.multipleBatchCreations;
        if (response?.length > 0) {
          setSelectedProduct((prevState) => {
            const productData = prevState?.[0] || {};
            return [
              {
                ...productData,
                finalPrice: response[0]?.mrp,
              },
            ];
          });
        }
      }
    } catch (error) {
      // return null;
    }
  };

  const productAvailableStock = async (gtin) => {
    try {
      const response = await getAvailableStock(locId, gtin);
      if (response?.data?.data?.es > 0) {
        // return null;
      } else {
        setSelectedProduct((prevState) => {
          const productData = prevState?.[0] || {};
          return [
            {
              ...productData,
              availableStock: response?.data?.data?.data?.availableUnits,
            },
          ];
        });
      }
    } catch (error) {
      // return null;
    }
  };
  const getPreviousPurchsePrice = async (gtin) => {
    try {
      const response = await previPurchasePrice(gtin, orgId);
      if (response?.data?.status === 'SUCCESS') {
        setSelectedProduct((prevState) => {
          const productData = prevState?.[0] || {};
          return [
            {
              ...productData,
              previousPurchasePrice: response?.data?.data?.previousPurchasePrice,
            },
          ];
        });
      }
    } catch (error) {}
  };

  const selectingProducts = async (item) => {
    if (addedProductsInPi?.find((ele) => ele?.itemCode === (item?.gtin || item?.barcodes?.[0]))) {
      showSnackbar('Product already added', 'error');
      return;
    }
    handleExistingPI(item?.gtin || item?.barcodes?.[0], null, item);
    setProductSearchValue('');
  };

  const fetchingAndSettingProductData = (item) => {
    if (item?.hasOwnProperty('name')) {
      setSelectedProduct([item]);
      setProductSearchResults([]);
      productWithVendor(item?.gtin || item?.barcodes?.[0]).then((res) => res);
      handleFlagdata(item?.gtin || item?.barcodes?.[0]).then((res) => res);
      handleMrp(item?.gtin || item?.barcodes?.[0]).then((res) => res);
      getPreviousPurchsePrice(item?.gtin || item?.barcodes?.[0]).then((res) => res);
      productAvailableStock(item?.gtin || item?.barcodes?.[0]).then((res) => res);
      setProductSearchLoader(false);
    } else {
      setProductSearchResults([]);
      setSelectedProduct((prev) => [...prev, item]);
      setProductSearchLoader(false);
    }
  };

  const addProductsForPi = (item, value) => {
    const spec = item?.hasOwnProperty('spec')
      ? item?.spec
      : item?.product
      ? (item?.product?.weights_and_measures?.net_weight || ' ') +
        ' ' +
        (item?.product?.weights_and_measures?.measurement_unit || '')
      : '';

    const updatedData = {
      itemCode: item?.gtin || item?.itemCode || item?.barcodes?.[0],
      itemName: item?.productName || item?.name || item?.itemName || '',
      spec: spec,
      quantityOrdered: Number(value) || 0,
      quantityLeft: Number(value) || 0,
      quantityAccepted: 0,
      previousPurchasePrice:
        Number(item?.previousPurchaseResponse?.previousPurchasePrice) || Number(item?.previousPurchasePrice) || 0,
      finalPrice:
        Number(item?.finalPrice) ||
        item?.whProductsCapsWithMultipleBatch?.multipleBatchCreations[0]?.mrp ||
        item?.product?.mrp?.mrp ||
        item?.availability?.mrp ||
        0,
      preferredVendor: vendorBusinessInfo?.vendorName || item?.preferredVendor || '',
      vendorId: vendorBusinessInfo?.vendorId || item?.vendorId || '',
      purchaseRecommendationFlag: item?.productForeCastModel?.flag || '',
      purchaseFlagReason: item?.productForeCastModel?.recommendation || '',
      inventoryFlag: item?.productForeCastModel?.inventoryCat || '',
      salesFlag: item?.productForeCastModel?.salesCat || '',
      profitFlag: item?.productForeCastModel?.grossProfitCat || '',
      id: null,
      isApproved: 'N',
      hsnCode: item?.product?.hs_code || item?.hs_code || item?.taxReference?.metaData?.hsnCode || '',
      igst: Number(item?.product?.igst) || Number(item?.product?.igst) || item?.taxReference?.taxRate || 0,
      cgst: Number(item?.product?.cgst) || Number(item?.product?.cgst) || item?.taxReference?.metaData?.cgst || 0,
      sgst: Number(item?.product?.sgst) || Number(item?.product?.sgst) || item?.taxReference?.metaData?.sgst || 0,
      cess: Number(item?.product?.cess) || Number(item?.product?.cess) || item?.taxReference?.metaData?.cess || 0,
      purchaseMargin: item?.purchaseMargin || item?.purchaseSync?.purchaseMargin || 0,
      salesPerWeek: item?.salesPerWeek || 0,
      availableStock:
        item?.availability?.availableUnits || item?.availableStock || item?.inventorySync?.availableQuantity || 0,
    };

    addingProductInPiAfterEdit(item, updatedData, null, 'payload');

    setProductQuantities(uuidv4());
  };

  const addingProductInPiAfterEdit = (item, updatedData, response, type, isSubmit) => {
    const updateItemFields = (item) => ({
      ...item,
      quantityOrdered: Number(updatedData?.quantityOrdered),
      quantityLeft: Number(updatedData?.quantityLeft),
      id: response && (item.id === '' || item.id === null) ? response.purchaseIndentItems[index]?.id : item.id,
      purchaseMargin:
        response && (item.id === '' || item.id === null)
          ? response.purchaseIndentItems[index]?.purchaseMargin
          : item.purchaseMargin,
      salesPerWeek:
        response && (item.id === '' || item.id === null)
          ? response.purchaseIndentItems[index]?.salesPerWeek
          : item.salesPerWeek,
    });

    const isExisting = (prev) =>
      prev.find((prevItem) => prevItem?.itemName === item?.productName || prevItem?.itemName === item?.name);

    if (type === 'payload') {
      const existingItem = isExisting(addedProductsInPi);
      const newData = addedProductsInPi.map((prevItem) =>
        existingItem && prevItem?.itemName === existingItem?.itemName ? updateItemFields(prevItem) : prevItem,
      );

      if (!existingItem) {
        const newUpdatedData = updateItemFields({
          ...updatedData,
          id: updatedData?.id,
          purchaseMargin: updatedData?.purchaseMargin,
          salesPerWeek: updatedData?.salesPerWeek,
        });
        newData.unshift(newUpdatedData);
      }
      setPayloadPiItems(newData);
    } else {
      if (!item && !isAlreadyAdded) {
        setAddedProductsInPi(response?.purchaseIndentItems);
      } else {
        setAddedProductsInPi(response?.purchaseIndentItems);
      }
      if (!isSubmit) showSnackbar('Product Data Updated', 'success');
      setSelectedProduct([]);
      setPayloadPiItems(response?.purchaseIndentItems);
    }
    setProductSearchLoader(false);
  };

  const alreadyAddedItemsHandler = (data, value, _, isAddedProduct) => {
    const updatedPiItems = addedProductsInPi?.map((item) => {
      if (item?.itemName === data?.itemName) {
        return {
          ...item,
          quantityOrdered: Number(value),
          quantityLeft: Number(value),
        };
      } else {
        return item;
      }
    });
    setAddedProductsInPi(updatedPiItems);
    setIsAlreadyAdded(true);
    setPayloadPiItems(updatedPiItems);
    setProductQuantities(uuidv4());
  };

  const billingList = useMemo(
    () =>
      [
        {
          label: 'Expected value',
          value: `₹ ${estimatedcost || 0}`,
          isInput: false,
        },
        view && {
          label: 'Available credit',
          isCheckbox: true,
          checked: isCreditApplied,
          value: isCreditApplied ? vendorCreditNoteUsed : vendorCreditNote || '',
          isDisabled: Number(vendorCreditNote <= 0) ? true : false,
          //handleCreditApplied
          onChange: (e) => handleVendorCredit(e.target.value),
        },
        {
          label: 'CGST',
          value: `₹ ${overAllCgst || 0}`,
        },
        {
          label: 'SGST',
          value: `₹ ${overAllSgst || 0}`,
        },
        {
          label: 'Cess',
          value: `₹ ${overAllCess || 0}`,
        },
        view && { label: 'Open debit note', value: `₹ ${vendorDebitNote || 0}` },
        view && { label: 'Open returns', value: `₹${vendorReturns || 0}` },
        {
          label: 'Delivery charges ',
          value: deliveryCharge,
          isInput: true,
          onChange: (e) => {
            setDeliveryCharge(e.target.value);
            setBillChange(e.target.value === '' ? 0 : e.target.value);
          },
        },
        {
          label: 'Labour charges',
          value: labourCharge,
          isInput: true,
          onChange: (e) => {
            setLabourCharge(e.target.value);
            setBillChange(e.target.value === '' ? 0 : e.target.value);
          },
        },
        { label: 'Estimated total', value: `₹ ${totalEstimate || 0}`, isBold: true },
      ].filter(Boolean),
    [
      estimatedcost,
      isCreditApplied,
      vendorCreditNoteUsed,
      vendorCreditNote,
      overAllCgst,
      overAllSgst,
      overAllCess,
      deliveryCharge,
      labourCharge,
      totalEstimate,
      vendorDebitNote,
      vendorReturns,
      view,
    ],
  );

  const deletingProducts = (isAddedProduct, data) => {
    if (!isAddedProduct) {
      const updatedData = selectedProduct?.filter(
        (item) => item?.itemName !== data?.itemName || item?.productName !== data?.productName,
      );
      setSelectedProduct(updatedData);
    } else {
      const updatedData = addedProductsInPi?.filter((item) => item?.itemName !== data?.itemName);
      setAddedProductsInPi(updatedData);
      setPayloadPiItems(updatedData);
      handleDelete(null, null, data?.id);
    }
  };

  const openScannerHandler = () => {
    emit({ type: 'scanner' });
  };

  useNativeMessage((message) => {
    const data = JSON.parse(message?.data);
    if (message?.type === 'gtin') {
      searchMobileProducts(data?.gtin, true);
    }
  });

  const vendorOnFocusChangeFunction = () => {
    if (vendorSearchMobile === '') {
      setShowVendorListing(false);
    } else {
      setShowVendorListing(true);
    }
    if (vendorSearchRef.current) {
      const offsetTop = vendorSearchRef.current.getBoundingClientRect().top + window.pageYOffset;
      const margin = 10; // 10px margin from the top
      window.scrollTo({
        top: offsetTop - margin,
        behavior: 'smooth',
      });
    }
  };

  const handleProductSearchFocusFunction = () => {
    if (productSearchRef.current) {
      const offsetTop = productSearchRef.current.getBoundingClientRect().top + window.pageYOffset;
      const margin = 10; // 10px margin from the top
      window.scrollTo({
        top: offsetTop - margin,
        behavior: 'smooth',
      });
    }
  };

  const handleVendorProductsAccordionChange = () => {
    if (vendorProductList?.length === 0) {
      showSnackbar('No vendor products found', 'error');
      return false;
    }

    if (!handleBasicDetailsValidation()) {
      return false;
    }

    return true;
  };

  return (
    <DashboardLayout
      isMobileDevice={isMobileDevice}
      // style={{
      //   overflowY: locked ? 'hidden' : 'scroll',
      // }}
    >
      {!isMobileDevice && <DashboardNavbar prevLink={true} />}
      {!isMobileDevice ? (
        <Box
          sx={{
            height: '100%',
            width: '100%',
          }}
        >
          <Box mt={!isMobileDevice && 2} pb={isMobileDevice ? 0.5 : 3}>
            {!isMobileDevice && (
              <SoftBox p={3} display="flex" justifyContent="space-between" alignItems="center">
                <SoftTypography fontSize="24px" fontWeight="bold">
                  New purchase indent
                </SoftTypography>
                {rowData?.length > 0 && (
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
                    previewLoader ? (
                      <Spinner size={20} key="preview-spinner" />
                    ) : (
                      <MenuItem onClick={handleEmailTemplate} key="preview-menu-item">
                        Preview
                      </MenuItem>
                    ),
                    piNum &&
                      (dltLoader ? (
                        <Spinner size={20} key="delete-spinner" />
                      ) : (
                        <MenuItem onClick={() => setOpenDltModal(true)} key="delete-menu-item">
                          Delete
                        </MenuItem>
                      )),
                  ]}
                </Menu>
              </SoftBox>
            )}
            <SoftBox
              className={`${isMobileDevice ? 'create-pi-card-mobile po-box-shadow sales-main-div' : 'create-pi-card'}`}
              p={3}
            >
              <Grid
                container
                spacing={3}
                sx={{ padding: isMobileDevice ? '15px' : '10px' }}
                justifyContent="flex-start"
                mr={3}
              >
                <Grid item xs={12} md={4} xl={4}>
                  <SoftTypography
                    component="label"
                    variant="caption"
                    fontWeight="bold"
                    textTransform="capitalize"
                    fontSize="13px"
                  >
                    Search Vendor By
                  </SoftTypography>
                  <SoftSelect
                    options={[
                      { value: 'Name', label: 'Name' },
                      { value: 'GST', label: 'GST' },
                    ]}
                    onChange={(e) => handlMainItem(e)}
                  />
                  {/* )} */}
                </Grid>
                {vendorId && !mainItem ? (
                  <Grid item xs={12} md={4} xl={4}>
                    <SoftTypography
                      component="label"
                      variant="caption"
                      fontWeight="bold"
                      textTransform="capitalize"
                      fontSize="13px"
                    >
                      Search vendor
                    </SoftTypography>
                    <SoftSelect
                      value={vendorNameOption?.find((ele) => ele?.value === vendorId) || ''}
                      options={vendorNameOption}
                      onChange={handleBillingAddress}
                      // onFocus={vendorNameOption?.length === 0 && allVendorList()}
                    />
                  </Grid>
                ) : (
                  mainItem && (
                    <Grid item xs={12} md={4} xl={4}>
                      <SoftTypography
                        component="label"
                        variant="caption"
                        fontWeight="bold"
                        textTransform="capitalize"
                        fontSize="13px"
                      >
                        Search by {mainItem}
                      </SoftTypography>
                      {mainItem === 'Name' ? (
                        <SoftAsyncPaginate
                          key="name-select"
                          className="select-box-category"
                          placeholder="Select vendor..."
                          value={vendorNameOption?.find((ele) => ele?.value === vendorId) || ''}
                          loadOptions={loadVendorNameOption}
                          additional={{
                            page: 1,
                          }}
                          isClearable
                          size="medium"
                          onChange={handleBillingAddress}
                          menuPortalTarget={document.body}
                        />
                      ) : mainItem === 'GST' ? (
                        <SoftAsyncPaginate
                          key="gst-select"
                          className="select-box-category"
                          placeholder="Select vendor..."
                          value={vendorGSTOption?.find((ele) => ele?.value === vendorId) || ''}
                          loadOptions={loadVendorGSTOption}
                          additional={{
                            page: 1,
                          }}
                          isClearable
                          size="medium"
                          onChange={handleBillingAddress}
                          menuPortalTarget={document.body}
                        />
                      ) : null}

                      {/* {mainItem === 'Name' ? (
                        <SoftSelect
                          value={vendorNameOption?.find((ele) => ele?.value === vendorId) || ''}
                          options={vendorNameOption}
                          onChange={handleBillingAddress}
                        />
                      ) : mainItem === 'GST' ? (
                        <SoftSelect
                          value={vendorNameOption?.find((ele) => ele?.value === vendorId) || ''}
                          options={vendorGSTOption}
                          onChange={handleBillingAddress}
                        />
                      ) : null} */}
                    </Grid>
                  )
                )}
              </Grid>
              <Grid
                container
                spacing={3}
                // justifyContent="space-between"
                sx={{ padding: isMobileDevice ? '15px' : '10px' }}
                mr={3}
              >
                <Grid item xs={12} md={4} xl={4}>
                  <SoftTypography fontSize="13px" fontWeight="bold">
                    Select Stores
                    <span style={{ color: 'red', marginLeft: '5px', fontSize: '17px' }}> *</span>
                  </SoftTypography>
                  <SoftSelect
                    placeholder="Location"
                    key={renderKey}
                    value={warehouseLocName ? warehouseLocName : locRows?.find((ele) => ele?.value === locId) || ''}
                    required
                    onChange={(e) => setWarehouseLocName(e)}
                    options={locRows}
                    onFocus={() => locRows?.length === 0 && listAllLocation()}
                  />
                </Grid>
                <Grid item xs={12} md={4} xl={4}>
                  <SoftTypography fontSize="13px" fontWeight="bold">
                    Approved By <span style={{ color: 'red', marginLeft: '5px', fontSize: '17px' }}> *</span>
                  </SoftTypography>
                  <SoftSelect
                    placeholder="Select"
                    key={renderKey}
                    required
                    {...(approvedTo && {
                      value: {
                        value: approvedTo?.value,
                        label: approvedTo?.label,
                      },
                    })}
                    onChange={(e) => {
                      setApprovedTo((prev) => ({
                        ...prev,
                        uidx: e.value,
                        name: e.label,
                        value: e.label,
                        label: e.label,
                      }));
                    }}
                    options={assignUserrow}
                    onFocus={() => assignUserrow?.length <= 0 && getAllUser()}
                  />
                </Grid>
                <Grid item xs={12} md={4} xl={4}>
                  <SoftTypography fontSize="13px" fontWeight="bold">
                    Assigned To
                    <span style={{ color: 'red', marginLeft: '5px', fontSize: '17px' }}> *</span>
                  </SoftTypography>
                  <SoftSelect
                    // key={renderKey}
                    // {...(assignedTo.length > 0 && {
                    // })}
                    placeholder="Select"
                    components={{ ValueContainer }}
                    hideSelectedOptions={false}
                    value={assignedToLabel}
                    options={assignUserrow}
                    isMulti
                    required
                    isDisabled={assignLoader ? true : false}
                    onChange={(e) => handleAssignTo(e)}
                    onFocus={() => assignUserrow?.length <= 0 && getAllUser()}
                  />
                </Grid>
              </Grid>
              {vendorId ? (
                <Grid
                  container
                  spacing={3}
                  direction="row"
                  alignItems="flex-start"
                  sx={{ padding: isMobileDevice ? '15px' : '10px' }}
                  mt={0.2}
                  mr={3}
                >
                  <Grid item xs={12} md={4} xl={4}>
                    <div style={{ marginLeft: '10px', marginTop: '-10px' }}>
                      <span className="po-address-title">Vendor address</span>
                    </div>
                    <div
                      className="component-bg-br-sh-p"
                      style={{ maxHeight: '230px', overflowY: 'scroll', marginTop: '10px' }}
                    >
                      <div className="address-main-container" style={{ width: '90%', marginTop: '-10px' }}>
                        <div className="address-line-container">
                          <span
                            className="po-address-font"
                            style={{
                              lineHeight: '1.5',
                            }}
                          >
                            <b>Vendor Name:</b> {vendorDisplayName}
                          </span>
                        </div>
                        <div className="address-line-container">
                          <span className="po-address-font">
                            <b>GST:</b> {vendorGST}
                          </span>
                        </div>
                        <div className="address-line-container">
                          <span className="po-address-font">
                            <b>PAN:</b> {vendorPAN}
                          </span>
                        </div>
                        <div className="address-line-container">
                          <span className="po-address-font">{vendoraddress?.addressLine1}</span>
                        </div>
                        <div className="address-line-container">
                          <span className="po-address-font">{vendoraddress?.addressLine2}</span>
                        </div>
                        <div className="address-line-container">
                          <span className="po-address-font">{vendoraddress?.city}</span>
                        </div>
                        <div className="address-line-container">
                          <span className="po-address-font">{vendoraddress?.state}</span>
                        </div>
                        <div className="address-line-container">
                          <span className="po-address-font"> {vendoraddress?.pinCode}</span>
                        </div>
                        <div className="address-line-container">
                          <span className="po-address-font">{vendoraddress?.country}</span>
                        </div>
                      </div>
                    </div>
                  </Grid>
                  <Grid item xs={12} md={8} xl={8}>
                    <Grid container spacing={3} direction="row" justifyContent="flex-start">
                      <Grid item xs={12} md={4} lg={4}>
                        <div className="po-address-title">
                          Expected Delivery Date{' '}
                          <span style={{ color: 'red', marginLeft: '5px', fontSize: '17px' }}> *</span>
                        </div>
                        <div className="vendor-data-names">
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              key={renderKey}
                              {...(expectedDate && {
                                value: dayjs(expectedDate),
                              })}
                              disablePast
                              views={['year', 'month', 'day']}
                              format="DD-MM-YYYY"
                              onChange={(date) => setExpectedDate(format(date.$d, 'yyyy-MM-dd'))}
                              sx={{ width: '100% !important' }}
                              className="date-picker-newpi-ui"
                            />
                          </LocalizationProvider>
                        </div>
                      </Grid>
                      <Grid item xs={12} md={4} lg={4} mt={0.8}>
                        <Tooltip title={purchaseTerms || 'NA'}>
                          <div className="po-address-title">Purchase Terms</div>
                          <div className="vendor-data-names">{purchaseTerms || 'NA'}</div>
                        </Tooltip>
                      </Grid>
                      <Grid item xs={12} md={4} lg={4} mt={0.8}>
                        <div className="po-address-title">Purchase Method</div>
                        <div className="vendor-data-names">{purchaseMethod || 'NA'}</div>
                      </Grid>
                      <Grid item xs={12} md={12} lg={12}>
                        <div className="po-address-title">Returns & replacement</div>
                        <div className="vendor-data-names">{returnAndReplacement ? 'Yes' : 'No'}</div>
                      </Grid>
                      <Grid item xs={12} md={4} lg={4}>
                        <div className="po-address-title">Open debit note</div>
                        <div className="vendor-data-names"> {`₹ ${vendorDebitNote || 0}`}</div>
                      </Grid>
                      <Grid item xs={12} md={4} xl={4}>
                        <div className="po-address-title">Available credits</div>
                        <div className="vendor-data-names">{`₹ ${vendorCreditNote || 0}`}</div>
                      </Grid>
                      <Grid item xs={12} md={4} lg={4}>
                        <div className="po-address-title">Open returns</div>
                        <div className="vendor-data-names">{`₹ ${vendorReturns || 0}`}</div>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              ) : (
                <Grid container spacing={3} sx={{ padding: isMobileDevice ? '15px' : '10px' }} mr={3}>
                  <Grid item xs={12} md={4} lg={4}>
                    <div className="po-address-title">
                      Expected Delivery Date{' '}
                      <span style={{ color: 'red', marginLeft: '5px', fontSize: '17px' }}> *</span>
                    </div>
                    <div className="vendor-data-names">
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          key={renderKey}
                          {...(expectedDate && {
                            value: dayjs(expectedDate),
                          })}
                          disablePast
                          views={['year', 'month', 'day']}
                          format="DD-MM-YYYY"
                          onChange={(date) => setExpectedDate(format(date.$d, 'yyyy-MM-dd'))}
                          sx={{ width: '100% !important' }}
                          className="date-picker-newpi-ui"
                        />
                      </LocalizationProvider>
                    </div>
                  </Grid>
                </Grid>
              )}

              {/* </Accordion> */}
            </SoftBox>
            {!isMobileDevice && (
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
                  <SoftBox display="flex" gap="30px" justifyContent={vendorId ? 'space-between' : 'flex-start'}>
                    <SoftTypography variant="h6">
                      Add products to your indent {rowData?.length > 1 && `(Total Items: ${rowData?.length})`}{' '}
                    </SoftTypography>
                    {!isMobileDevice && listDisplay && <Spinner size={20} />}

                    {vendorId && (
                      <SoftButton
                        style={{ marginTop: '-10px' }}
                        variant={buttonStyles.secondaryVariant}
                        className="outlined-softbutton"
                        onClick={handleVendorProduct}
                      >
                        Product Lookup
                      </SoftButton>
                    )}
                  </SoftBox>
                  {rowData?.length > 0 && (
                    <SoftBox style={{ overflowX: 'scroll', overflowY: 'hidden', maxHeight: '65px' }}>
                      <div
                        style={{
                          overflowX: 'scroll',
                          minWidth: '1055px',
                        }}
                      >
                        <div>
                          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                              <tr>
                                <th className="express-grn-columns">S.No</th>
                                <th className="express-grn-barcode-column">Barcode</th>
                                <th className="express-grn-barcode-column">Title</th>
                                <th className="express-grn-columns">UOM</th>
                                <th className="express-grn-columns">MRP</th>
                                <th className="express-grn-columns">P Margin</th>
                                <th className="express-grn-columns">Aval Stk</th>
                                <th className="express-grn-columns">Sales/week</th>
                                <th className="express-grn-columns">Qty</th>
                                {/* <th className="express-grn-vendor-column">Vendor</th> */}
                                <th className="express-grn-columns">Action</th>
                              </tr>
                            </thead>
                            <tbody>
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
                                    <SoftInput value="MRP" readOnly={true} />
                                  </SoftBox>
                                </td>
                                <td className="express-grn-rows">
                                  <SoftBox className="grn-body-row-boxes-1">
                                    <SoftInput value="Specif" readOnly={true} />
                                  </SoftBox>
                                </td>
                                <td className="express-grn-rows">
                                  <SoftBox className="grn-body-row-boxes-1">
                                    <SoftInput value="Qty Ordered" readOnly={true} />
                                  </SoftBox>
                                </td>
                                <td className="express-grn-rows">
                                  <SoftBox className="grn-body-row-boxes-1">
                                    <SoftInput value="Prev PP" readOnly={true} />
                                  </SoftBox>
                                </td>
                                <td className="express-grn-rows">
                                  <SoftBox className="grn-body-row-boxes-1">
                                    <SoftInput value="Aval Stock" readOnly={true} />
                                  </SoftBox>
                                </td>
                                <td className="express-grn-rows">
                                  <SoftBox className="grn-body-row-boxes-1">
                                    <SoftInput value="Qty" readOnly={true} />
                                  </SoftBox>
                                </td>
                                {/* <td className="express-grn-rows">
                                <SoftBox className="express-grn-product-box">
                                  <SoftSelect />
                                </SoftBox>
                              </td> */}
                                <td className="express-grn-rows">
                                  <SoftBox className="grn-body-row-boxes-1">
                                    <div
                                      style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                      }}
                                    >
                                      <CancelIcon color="error" style={{ cursor: 'pointer', fontSize: '20px' }} />
                                    </div>
                                  </SoftBox>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </SoftBox>
                  )}
                </div>
              </SoftBox>
            )}
            <SoftBox
              p={3}
              className={`${isMobileDevice ? '' : 'create-pi-card'}`}
              sx={{
                marginBottom: isMobileDevice ? 'unset !important' : '30px !important',
                padding: isMobileDevice ? '0px !important' : '24px !important',
                // boxShadow: 'none !important',
                // marginTop: !isMobileDevice && '-65px !important',
              }}
            >
              <PurchaseItemListing
                handleExistingPI={handleExistingPI}
                itemListArray={itemListArray}
                rowData={rowData}
                setRowData={setRowData}
                handleVendorProduct={handleVendorProduct}
                vendorId={vendorId}
                vendorDisplayName={vendorDisplayName}
                // calculateMultiplicationAndAddition={calculateMultiplicationAndAddition}
                setEstimatedCost={setEstimatedCost}
                setTotalEstimate={setTotalEstimate}
                calCulateTotalEstimate={calCulateTotalEstimate}
                vendorCreditNoteUsed={vendorCreditNoteUsed}
                isCreditApplied={isCreditApplied}
                deliveryCharge={deliveryCharge}
                labourCharge={labourCharge}
                handleDelete={handleDelete}
                handleItemDelete={handleItemDelete}
                mobileItemAddModal={mobileItemAddModal}
                setMobileItemAddModal={setMobileItemAddModal}
                listDisplay={listDisplay}
                vendorNameOption={vendorNameOption}
                allVendorList={allVendorList}
                isVendorSelected={isVendorSelected}
                approvedTo={approvedTo}
                warehouseLocName={warehouseLocName}
                assignedTo={assignedTo}
                expectedDate={expectedDate}
                createNewPI={createNewPI}
                editDraftPI={editDraftPI}
                setListDisplay={setListDisplay}
                isClearedLoader={isClearedLoader}
                isItemChanged={isItemChanged}
                setItemChanged={setItemChanged}
                boxRef={boxRef}
                setOverAllCess={setOverAllCess}
                setOverAllCgst={setOverAllCgst}
                setOverAllSgst={setOverAllSgst}
                // receiveFunction={receiveFunction}
              />
            </SoftBox>

            <SoftBox p={isMobileDevice ? 2 : 3} className={`create-pi-card ${isMobileDevice && 'po-box-shadow'}`}>
              <Grid container spacing={isMobileDevice ? 1 : 3} justifyContent="space-between">
                <Grid item xs={12} md={6} xl={6} sx={{ marginTop: '-50px' }}>
                  <SoftBox className="textarea-box">
                    <SoftTypography fontSize="15px" fontWeight="bold">
                      Add comments
                    </SoftTypography>
                  </SoftBox>
                  <SoftBox style={{ marginTop: '10px' }}>
                    <TextareaAutosize
                      defaultValue={comment}
                      onChange={(e) => setComment(e.target.value)}
                      aria-label="minimum height"
                      minRows={3}
                      placeholder="Notes / Memo"
                      className={`add-pi-textarea new-text-area ${isMobileDevice && 'mobile-textarea-newpi'} `}
                    />
                  </SoftBox>
                </Grid>
                <SalesBillingDetailRow billingItems={billingItems} setIsCredit={handleCreditApplied} />
                <Grid item xs={12} md={6} xl={6}></Grid>
                {!isMobileDevice && (
                  <Grid item xs={12} md={6} xl={6}>
                    <SoftBox className="add-po-btns" style={{ gap: '10px' }}>
                      <SoftButton
                        variant={buttonStyles.secondaryVariant}
                        className="outlined-softbutton"
                        onClick={() => {
                          navigate('/purchase/purchase-indent');
                          localStorage.removeItem('piNum');
                        }}
                      >
                        Cancel
                      </SoftButton>
                      {/* <SoftButton
                      variant={buttonStyles.primaryVariant}
                      className="contained-softbutton vendor-add-btn"
                      onClick={handleSave}
                      disabled={!piNum || saveLoader ? true : false}
                    >
                      {saveLoader ? <CircularProgress size={20} /> : <>Save</>}
                    </SoftButton> */}
                      <SoftButton
                        variant={buttonStyles.primaryVariant}
                        className="contained-softbutton vendor-add-btn"
                        onClick={handleSubmit}
                        disabled={!piNum || submitLoader ? true : false}
                      >
                        {submitLoader ? <CircularProgress size={20} /> : <>Save</>}
                      </SoftButton>
                    </SoftBox>
                  </Grid>
                )}
              </Grid>
            </SoftBox>
            {listVendorProd && (
              <PIProductLookUP
                handleVendorProduct={handleVendorProduct}
                rowData={rowData}
                setRowData={setRowData}
                vendorId={vendorId}
                vendorDisplayName={vendorDisplayName}
                editDraftPI={editDraftPI}
                createNewPI={createNewPI}
                boxRef={boxRef}
                setItemChanged={setItemChanged}
                setIsCreateAPIResponse={setIsCreateAPIResponse}
                isCreateAPIResponse={isCreateAPIResponse}
                setListDisplay={setListDisplay}
                isVendorSelected={isVendorSelected}
                listAllProduct={listAllProduct}
                setListAllProduct={setListAllProduct}
                showVendor={showVendor}
              />
            )}
          </Box>
        </Box>
      ) : (
        <div
          // className="main-padding-wrapper"
          style={{
            height: '100dvh',
          }}
          ref={parentScrollDiv}
        >
          <div
            className="mobile-pi-create-main-div main-padding-wrapper"
            style={{
              height: addedProductsInPi?.length > 3 ? 'auto' : showVendor ? `calc(100% + 720px)` : `calc(100% + 440px)`,
              // border: '5px solid black',
            }}
          >
            <div className="basic-details-main-div">
              <span className="input-info-heading-ros-app">Basic details</span>
              <hr className="horizontal-line-app-ros" />
              {basicDetailsArray?.map((item) => (
                <MultiTypeInput
                  inputLabel={item?.itemLabel}
                  value={basicDetails?.[item?.itemValue]}
                  inputType={item?.inputType}
                  inputValue={item?.itemValue}
                  placeholder={item?.itemLabel}
                  selectOptions={item?.selectOptions}
                  onChangeFunction={handleBasicDetails}
                  setMainSelectedInput={setMainSelectedInput}
                  loading={selectedInputDataLoader}
                  disablePast={true}
                />
              ))}
            </div>

            <div className="basic-details-main-div" ref={vendorSearchRef}>
              <div className="stack-row-center-between width-100">
                <span className="input-secondary-info">Creating PI by vendor? Add here (Optional)</span>
                {vendorSearchLoader && <CircularProgress size={18} sx={{ color: '#0562fb !important' }} />}
              </div>
              <MobileSearchBar
                placeholder="Search Vendors"
                variant={'bg-white'}
                onChangeFunction={handleVendorSearchMobile}
                onFocusFunction={vendorOnFocusChangeFunction}
                value={vendorSearchMobile}
                // onBlurFunction={() => setShowVendorListing(false)}
              />
              {showVendorListing && (
                <div
                  className="searching-parent-div"
                  style={{
                    height: vendorNameOption?.length > 5 ? '180px' : 'auto',
                  }}
                >
                  {vendorNameOption?.map((vendor) => (
                    <div className="search-result-label-div" onClick={() => selectVendor(vendor?.value)}>
                      <span className="search-label-ros-app">{vendor?.label}</span>
                    </div>
                  ))}
                </div>
              )}
              {vendorBusinessInfo?.vendorId && (
                <div>
                  <VendorCardDetailsMob data={vendorBusinessInfo} deselectVendor={deselectVendor} />
                </div>
              )}
            </div>
            <div className="basic-details-main-div" ref={productSearchRef}>
              <div className="width-100 stack-row-center-between">
                <span className="input-info-heading-ros-app">Product Selection</span>
                {productSearchLoader && <CircularProgress size={18} sx={{ color: '#0562fb !important' }} />}
              </div>
              <hr className="horizontal-line-app-ros" />
              <MobileSearchBar
                isScannerSearchbar={true}
                placeholder="Search products"
                variant={'bg-white'}
                onChangeFunction={settingProductSearchValue}
                onFocusFunction={handleProductSearchFocusFunction}
                value={productSearchValue}
                scannerButtonFunction={openScannerHandler}
              />
              {productSearchResults?.length > 0 && (
                <div
                  className="searching-parent-div width-100"
                  style={{
                    height: productSearchResults?.length > 5 ? '180px' : 'auto',
                  }}
                >
                  {productSearchResults?.map((item) => (
                    <div className="width-100 search-result-label-div" onClick={() => selectingProducts(item)}>
                      <span className="search-label-ros-app">{item?.productName || item?.name}</span>
                    </div>
                  ))}
                </div>
              )}
              {selectedProduct?.length > 0 && (
                <div
                  className="create-pi-card-parent-div"
                  style={{
                    height: selectedProduct?.length > 3 ? '550px' : 'auto',
                  }}
                >
                  {selectedProduct?.map((item) => {
                    const primaryWeight = item?.weightsAndMeasures?.find((ele) => ele?.type === 'PRIMARY');
                    const fallbackWeight = item?.weightsAndMeasures?.[0];
                    const newItem = item?.hasOwnProperty('barcodes')
                      ? {
                          itemCode: item?.barcodes?.[0],
                          itemName: item?.name || 'NA',
                          spec:
                            (primaryWeight?.grossWeight || fallbackWeight?.grossWeight || '') +
                              ' ' +
                              (primaryWeight?.measurementUnit || fallbackWeight?.measurementUnit
                                ? primaryWeight?.measurementUnit || fallbackWeight?.measurementUnit
                                : '') || '',
                          finalPrice: Number(item?.finalPrice) || 0,
                          purchaseRecommendationFlag: item?.productForeCastModel?.flag || '',
                          purchaseFlagReason: item?.productForeCastModel?.recommendation || '',
                          inventoryFlag: item?.productForeCastModel?.inventoryCat || '',
                          salesFlag: item?.productForeCastModel?.salesCat || '',
                          profitFlag: item?.productForeCastModel?.grossProfitCat || '',
                          salesPerWeek: item?.salesPerWeek || 0,
                          availableStock: item?.inventorySync?.availableQuantity || 0,
                          vendorId: item?.vendorId || '',
                          preferredVendor: item?.preferredVendor || '',
                        }
                      : item;

                    return (
                      <CreatePiCard data={newItem} addProductsForPi={addProductsForPi} loading={productSearchLoader} />
                    );
                  })}
                </div>
              )}
              {addedProductsInPi?.length > 0 && (
                <>
                  <span className="added-products-pi-create">Added Products ({addedProductsInPi?.length})</span>
                  <div
                    className="create-pi-card-parent-div"
                    style={{
                      height: addedProductsInPi?.length > 3 ? '300px' : 'auto',
                    }}
                  >
                    {addedProductsInPi?.map((item) => {
                      return (
                        <CreatePiCard
                          data={item}
                          addProductsForPi={alreadyAddedItemsHandler}
                          deletingProducts={deletingProducts}
                          isAddedProduct={true}
                          loading={productSearchLoader}
                        />
                      );
                    })}
                  </div>
                </>
              )}
            </div>
            {vendorBusinessInfo?.vendorId && (
              <CommonAccordion
                customFunction={handleVendorProductsAccordionChange}
                title={`${totalVendorProducts || 0} Vendor Products`}
                backgroundColor={'blue-P'}
              >
                <div
                  className="basic-details-main-div vendor-product-list-ros-app"
                  style={{
                    height: 'auto',
                  }}
                >
                  {vendorProductList?.map((item) => (
                    <CreatePiCard data={item} addProductsForPi={addProductsForPi} />
                  ))}
                  {/* {vendorProductList?.length > 5 && ( */}
                  <ViewMore
                    loading={vendorViewMoreLoader}
                    handleNextFunction={() =>
                      fetchingVendorProducts(vendorBusinessInfo?.vendorId, null, true, viewMorePageNo + 1)
                    }
                  />
                  {/* )} */}
                </div>
              </CommonAccordion>
            )}
            {addedProductsInPi?.length > 0 && (
              <div className="width-100 billing-info-mobile-pi-create">
                <div className="mob-vendor-address">
                  <BillingListMobile billingList={billingList} setIsCredit={handleCreditApplied} />
                </div>
                {/* <CommentComponent /> */}
                <div className="action-button-mobile">
                  <CustomMobileButton
                    padding="0.75rem"
                    variant={'black-D'}
                    title={'Save'}
                    justifyContent={'center'}
                    onClickFunction={handleSubmit}
                    loading={submitLoader}
                    disable={!piNum}
                  />
                  <CustomMobileButton
                    padding="0.75rem"
                    variant={'black-S'}
                    title={'Discard PI'}
                    justifyContent={'center'}
                    onClickFunction={handleDeletePI}
                    loading={dltLoader}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {!isMobileDevice ? (
        <Modal
          open={openDltModal}
          onClose={() => setOpenDltModal(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box className="pi-approve-menu">
            <SoftTypography id="modal-modal-title" variant="h6" component="h2">
              Are you sure you want to delete this.
            </SoftTypography>

            <SoftBox className="pi-approve-btns-div" style={{ gap: '10px' }}>
              <SoftButton className="vendor-second-btn" onClick={() => setOpenDltModal(false)}>
                Cancel
              </SoftButton>
              <SoftButton className="vendor-add-btn" onClick={handleDeletePI} disabled={dltLoader ? true : false}>
                {dltLoader ? <CircularProgress size={20} /> : <>Save</>}
              </SoftButton>
            </SoftBox>
          </Box>
        </Modal>
      ) : (
        <MobileDrawerCommon
          anchor="bottom"
          paperProps={{ height: 'auto  !important', maxHeight: '90%' }}
          drawerOpen={openDltModal}
          drawerClose={() => setOpenDltModal(false)}
          overflowHidden={true}
        >
          <Box className="pi-approve-menu-1-mobile">
            <SoftTypography id="modal-modal-title" className="reject-title-new-pi" variant="h6" component="h2">
              Are you sure you want to delete this ?{' '}
            </SoftTypography>
            <SoftBox className="pi-approve-btns-div-mob" style={{ gap: '10px' }}>
              <SoftButton className="vendor-second-btn picancel-btn" onClick={() => setOpenDltModal(false)}>
                Cancel
              </SoftButton>
              <SoftButton
                className="vendor-add-btn picancel-btn"
                onClick={handleDeletePI}
                disabled={dltLoader ? true : false}
              >
                {dltLoader ? <CircularProgress size={20} /> : <>Save</>}
              </SoftButton>
            </SoftBox>
          </Box>
        </MobileDrawerCommon>
      )}
    </DashboardLayout>
  );
};

export default NewPurchaseIndent;
