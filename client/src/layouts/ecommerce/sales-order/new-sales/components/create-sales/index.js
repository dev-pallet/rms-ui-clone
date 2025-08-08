import { useNavigate, useParams } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react';

// Dashboard
import DashboardLayout from '../../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../../examples/Navbars/DashboardNavbar';

// MUI components
import {
  Box,
  CircularProgress,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Modal,
  TextField,
  TextareaAutosize,
  Typography,
} from '@mui/material';

// MUI ICONS
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import AddIcon from '@mui/icons-material/Add';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import PreviewIcon from '@mui/icons-material/Preview';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

// Common components
import { buttonStyles } from '../../../../Common/buttonColor';
import { format } from 'date-fns';
import { isSmallScreen } from '../../../../Common/CommonFunction';
import { useDebounce } from 'usehooks-ts';
import { useSnackbar } from '../../../../../../hooks/SnackbarProvider';
import { v4 as uuidv4 } from 'uuid';
import MobileDrawerCommon from '../../../../Common/MobileDrawer';
import MobileNavbar from '../../../../../../examples/Navbars/MobileNavbar/mobile-navbar-drawer';
import SalesBillingDetailRow from './components/billingDetail';
import SalesOrderProductList from './components/productList';
import SoftBox from '../../../../../../components/SoftBox';
import SoftButton from '../../../../../../components/SoftButton';
import SoftInput from '../../../../../../components/SoftInput';
import SoftSelect from '../../../../../../components/SoftSelect';
import SoftTypography from '../../../../../../components/SoftTypography';
import Spinner from '../../../../../../components/Spinner';
import dayjs from 'dayjs';
import getCustomerList, {
  adjustCartByOrderId,
  applyCoupon,
  applySOCreditCust,
  deleteSalesOrderCartId,
  editSalesOrder,
  fetchLoyality,
  getAvailableCreditCust,
  getCartDetails,
  getCustomerDetails,
  newSalesOrderCart,
  previewSalesOrder,
  removeLoyality,
  removeSOCoupon,
  removeSOCreditCust,
  salesOrderCreatePurchase,
  salesOrderUpdateCart,
  salesOrderUpdatePurchase,
  salesOrderWithPayment,
  staticCouponSingle,
} from '../../../../../../config/Services';
import SalesLoyalityModal from './components/loyalityModal';

const CreateNewSalesOrder = () => {
  const { id } = useParams();
  const boxRef = useRef(null);
  const navigate = useNavigate();
  const isMobileDevice = isSmallScreen();
  const showSnackbar = useSnackbar();
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const contextType = localStorage.getItem('contextType');
  const sourceApp = localStorage.getItem('sourceApp');
  const [cartId, setCartId] = useState(id ? id : localStorage.getItem('cartId-SO'));
  const salesOrderId = localStorage.getItem('sales_OrderId');
  const [orderId, setOrderId] = useState(localStorage.getItem('sales_OrderId') || '');
  const userName = localStorage.getItem('user_name');
  const user_details = JSON.parse(localStorage.getItem('user_details'));
  const uidx = user_details.uidx;
  const mobileNumber = user_details.mobileNumber;
  const [loader, setLoader] = useState(false);
  const [rowData, setRowData] = useState([
    {
      itemId: uuidv4(),
      id: '',
      itemCode: '',
      itemName: '',
      spec: '',
      mrp: 0,
      purchasePrice: '',
      sellingPrice: 0,
      quantityOrdered: '',
      hsnCode: '',
      cess: '',
      igst: 0,
      cgst: 0,
      sgst: 0,
      cess: 0,
      amountWithTax: '',
      amountWithoutTax: '',
      batches: [],
      discountPrice: 0,
      vendorId: '',
      discountType: 'RUPEES',
    },
  ]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [previewLoader, setPreviewLoader] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState('');
  const [saveLoader, setSaveLoader] = useState('');
  const [customerOptions, setCutomerOptions] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState();
  const [billingAddress, setBillingAddress] = useState({});
  const [shippingAddress, setShippingAddress] = useState({});
  const [allAddresses, setAllAddresses] = useState([]);
  const [custGST, setCustGST] = useState();
  const [custPAN, setCustPAN] = useState();
  // COUPON
  const [couponCode, setCouponCode] = useState();
  const [couponId, setCouponId] = useState();
  const [couponLoader, setCouponLoader] = useState(false);
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  // LOYALTY
  const [loyalityMessage, setLoyalityMessage] = useState('');
  const [loyalityData, setLoyalityData] = useState('');
  const [loyalityApplied, setLoyalityApplied] = useState(false);
  const [loyaltyLoader, setLoyaltyLoader] = useState(false);
  const [openLoyalityModal, setOpenLoyalityModal] = useState(false);

  const [openBillModal, setOpenBillModal] = useState(false);
  const [openShipModal, setOpenShipModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isFileSelected, setIsFileSelected] = useState(false);
  const [inclusiveTax, setInclusiveTax] = useState('true');
  const [isLinkIncluded, setIsLinkIncluded] = useState(false);
  const [linkValue, setLinkValue] = useState('');
  const [mobileItemAddModal, setMobileItemAddModal] = useState(false);
  const [customerCreditNote, setCustomerCreditNote] = useState(0);
  const [customerCreditNoteUsed, setCustomerCreditNoteUSed] = useState(0);
  const [isCreditApplied, setIsCreditApplied] = useState(false);
  const [customerSelected, setCustomerSelected] = useState(false);
  const debounceCustomer = useDebounce(customerSelected, 300);
  const [productSelected, setProductSelected] = useState([true]);
  const [billingData, setBillingData] = useState({});
  const [deleteItemLoader, setDeleteItemLoader] = useState(false);
  const [paymentMode, setPaymentMode] = useState('OFFLINE');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [cartStatus, setCartStatus] = useState('');
  const [updateCart, setUpdateCart] = useState('');
  const debounceUpdateCart = useDebounce(updateCart, 300);
  const [comment, setComment] = useState('');
  const [openDltModal, setOpenDltModal] = useState(false);
  const [openSaveModal, setOpenSaveModal] = useState(false);
  const [isExtraField, setIsExtraField] = useState(false);
  const [additionalExpense, setAdditionalExpense] = useState(0);
  const [additionalList, setAdditionalList] = useState([
    {
      chargeId: null,
      cartId: cartId,
      description: '',
      unitPrice: 0,
      quantity: 1,
      tax: 0,
      taxType: '%',
      amount: 0,
    },
  ]);
  const [purchaseInfo, setPurchaseInfo] = useState({
    isPresent: false,
    cartId: cartId,
    poNumber: '',
    poValue: 0,
    poDate: '',
    shipment: '',
    paymentDueDate: '',
    shipmentDate: '',
    taxDetails: inclusiveTax,
    paymentLink: '',
    poFileLink: '',
    createdBy: uidx,
    createdByName: userName,
  });
  const [customerCredit, setCustomerCredit] = useState({});
  const [purchseDebounce, setPurchseDebounce] = useState('');
  const debouncePurchase = useDebounce(purchseDebounce, 300);

  const shippingOption = [
    { value: 'Company Transport', label: 'Company Transport' },
    { value: 'Own Transport', label: 'Own Transport' },
    { value: 'Third Party', label: 'Third Party' },
  ];

  useEffect(() => {
    if (debouncePurchase !== '') {
      setPurchseDebounce('');
      if (purchaseInfo.isPresent) {
        updatePurchaseInfo();
      } else {
        createPurchseInfo();
      }
    }
  }, [debouncePurchase]);

  useEffect(() => {
    if (billingData) {
      setBillingItems([
        { label: 'Subtotal', value: billingData?.subtotal || 0 },
        { label: 'Discount', value: billingData?.totalDiscountValue || 0 },
        {
          label: 'Available Credit',
          isCheckbox: true,
          checked: isCreditApplied,
          value: isCreditApplied ? customerCreditNoteUsed : customerCreditNote || 0,
          isDisabled: Number(customerCreditNote <= 0) ? true : false,
          // onChange: (e) => handleCustomerCredit(e.target.value),
        },
        {
          label: 'Coupon',
          isCheckbox: true,
          checked: couponCode && isCouponApplied,
          value: couponCode ?? 'NA',
          isDisabled: !cartId || !couponCode || couponLoader,
          isInput: false,
          // onChange: (e) => handleCouponChange(e.target.value),
        },
        {
          label: 'Loyalty',
          isCheckbox: true,
          checked: loyalityApplied ? true : false,
          value: loyalityApplied ? 'Redeemed' : 'NA',
          isDisabled: !cartId || loyaltyLoader,
          isInput: false,
          // onChange: (e) => handleCouponChange(e.target.value),
        },
        // { label: 'Total taxable value', value: billingData?.subtotal || 0 },
        { label: 'IGST', value: billingData?.igst || 0 },
        { label: 'CGST', value: billingData?.cgst || 0 },
        { label: 'SGST', value: billingData?.sgst || 0 },
        { label: 'Cess', value: billingData?.totalCessAmount || 0 },
        { label: 'Total', value: billingData?.totalCartValue || 0, isBold: true },
        // {
        //   label: 'Round off',
        //   value: billingData?.roundOff || 0,
        //   isInput: true,
        //   onChange: (e) => {
        //     const value = e.target.value;
        //     setBillingData((prev) => ({
        //       ...prev,
        //       roundOff: value === '' ? 0 : Number(value),
        //     }));
        //   },
        // },
        { label: 'Additional expense', value: additionalExpense || 0 },
      ]);
    }
  }, [
    billingData,
    customerCreditNote,
    isCreditApplied,
    customerCreditNoteUsed,
    additionalExpense,
    couponCode,
    isCouponApplied,
    couponLoader,
    loyaltyLoader,
  ]);

  const openMenu = Boolean(anchorEl);

  const handleCloseDltModal = () => setOpenDltModal(false);
  const handleCloseSaveModal = () => setOpenSaveModal(false);
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const paymentModeOption = [
    { value: 'OFFLINE', label: 'Cash on Delivery ' },
    // { value: 'ONLINE', label: 'Online' },
  ];

  const offlinePayment = [
    { value: 'CASH', label: 'Cash' },
    // { value: 'CHEQUE', label: 'Cheque' },
    // { value: 'BANK TRNASFER', label: 'Bank Transfer' },
    // { value: 'CREDIT_CARD', label: 'Credit card' },
    // { value: 'DEBIT_CARD', label: 'Debit card' },
    // { value: 'OTHERS', label: 'OTHERS' },
  ];

  const onlinePayment = [{ value: 'ONLINE', label: 'Online' }];

  const [billingItems, setBillingItems] = useState([
    { label: 'Subtotal', value: billingData?.subtotal || 0 },
    { label: 'Discount', value: billingData?.totalDiscountValue || 0 },
    {
      label: 'Available Credit',
      isCheckbox: true,
      checked: isCreditApplied,
      value: isCreditApplied ? customerCreditNoteUsed : customerCreditNote || 0,
      isDisabled: Number(customerCreditNote <= 0) ? true : false,
      onChange: (e) => handleCustomerCredit(e.target.value),
    },
    {
      label: 'Coupon',
      isCheckbox: true,
      checked: couponCode && isCouponApplied,
      value: couponCode ?? 'NA',
      isDisabled: !cartId || !couponCode || couponLoader,
      isInput: false,
      onChange: (e) => handleCouponChange(e.target.value),
    },
    {
      label: 'Loyalty',
      isCheckbox: true,
      checked: loyalityApplied,
      value: loyalityApplied ? 'Redeemed' : 'NA',
      isDisabled: !cartId || loyaltyLoader,
      isInput: false,
      onChange: (e) => handleLoyality(e.target.value),
    },
    // { label: 'Total taxable value', value: billingData?.subtotal || 0 },
    { label: 'IGST', value: billingData?.igst || 0 },
    { label: 'CGST', value: billingData?.cgst || 0 },
    { label: 'SGST', value: billingData?.sgst || 0 },
    { label: 'Cess', value: billingData?.totalCessAmount || 0 },
    { label: 'Total', value: billingData?.totalCartValue || 0, isBold: true },
    // {
    //   label: 'Round off',
    //   value: billingData?.roundOff || 0,
    //   isInput: true,
    //   onChange: (e) => {
    //     const value = e.target.value;
    //     setBillingData((prev) => ({
    //       ...prev,
    //       roundOff: value === '' ? 0 : Number(value),
    //     }));
    //   },
    // },
    { label: 'Additional expense', value: additionalExpense || 0 },
  ]);

  useEffect(() => {
    if (cartId) {
      cartDetails();
    }
    customerList();
  }, []);

  useEffect(() => {
    if (debounceUpdateCart != '') {
      handleUpdateCart();
      setUpdateCart('');
    }
  }, [debounceUpdateCart]);

  useEffect(() => {
    if (debounceCustomer) {
      if (salesOrderId && !cartId) {
        localStorage.removeItem('salesOrderId');
        createNewOrder();
      } else if (!salesOrderId && !cartId) {
        // If neither salesOrderId nor cartId is present
        createNewOrder();
      }
    }
    setCustomerSelected(false);
  }, [debounceCustomer]);

  const customerList = () => {
    const payload = {
      pageNumber: 0,
      pageSize: 50,
      partnerId: orgId,
      partnerType: contextType === 'WMS' ? 'WAREHOUSE' : contextType,
    };
    getCustomerList(payload)
      .then((res) => {
        if (res?.data?.status === 'ERROR') {
          showSnackbar(res?.data?.message, 'error');
          return;
        }
        if (res?.data?.data?.es) {
          showSnackbar(res?.data?.data?.message, 'error');
          return;
        }
        const response = res?.data?.data?.retails;
        let assuser,
          assRow = [];
        assuser = response;
        assRow.push(
          assuser
            ?.map((row) => ({
              value: row?.retailId,
              label: row?.displayName,
            }))
            .sort((a, b) => a.label.localeCompare(b.label)),
        );
        setCutomerOptions(assRow[0]);
      })
      .catch((err) => {
        showSnackbar(err?.response?.data?.message || 'Some errr occured', 'error');
      });
  };

  const handleCustomerSelect = (option) => {
    if (option.value === selectedCustomer?.value && cartId) {
      return;
    }
    if (cartId && option.value !== selectedCustomer?.value) {
      localStorage.removeItem('cartId-SO');
      setCartId('');
    }
    setSelectedCustomer(option);
    customerDetails(option?.value);
  };

  const customerDetails = (id, billId, shipId) => {
    setLoader(true);
    getCustomerDetails(id)
      .then((res) => {
        if (res?.data?.es) {
          showSnackbar(res?.data?.message, 'error');
          setLoader(false);
          return;
        }
        const response = res?.data?.data?.retail;
        setAllAddresses(response?.addresses);
        setCustGST(response?.gstNumber);
        setCustPAN(response?.panNumber);
        if (response?.preAssignedCouponCode && response?.preAssignedCouponCode !== '') {
          setCouponCode(response?.preAssignedCouponCode);
        } else {
          setIsCouponApplied(false);
          setCouponCode();
          setCouponId();
        }
        const addresses = response?.addresses || [];
        const defaultAddress = addresses?.find((item) => item?.defaultAddress === true);

        const defaultBilling = billId
          ? addresses?.find((item) => item?.id == billId)
          : addresses?.find((item) => item?.defaultBilling === true);

        const defaultShipping = shipId
          ? addresses?.find((item) => item?.id == shipId)
          : addresses?.find((item) => item?.defaultShipping === true);

        if (defaultAddress && !billId && !shipId) {
          setBillingAddress(defaultAddress);
          setShippingAddress(defaultAddress);
        } else {
          if (defaultBilling && !defaultShipping) {
            setBillingAddress(defaultBilling);
            setShippingAddress(defaultBilling);
          } else if (defaultShipping && !defaultBilling) {
            setBillingAddress(defaultShipping);
            setShippingAddress(defaultShipping);
          } else if (!defaultBilling && !defaultShipping) {
            setBillingAddress(addresses[0]);
            setShippingAddress(addresses[0]);
          } else {
            setBillingAddress(defaultBilling);
            setShippingAddress(defaultShipping);
          }
        }
        setCustomerSelected(true);
        if (!orderId && !cartId) {
          setRowData([
            {
              itemId: uuidv4(),
              id: '',
              itemCode: '',
              itemName: '',
              spec: '',
              mrp: 0,
              purchasePrice: '',
              sellingPrice: 0,
              quantityOrdered: '',
              hsnCode: '',
              cess: '',
              igst: 0,
              cgst: 0,
              sgst: 0,
              cess: 0,
              amountWithTax: '',
              amountWithoutTax: '',
              batches: [],
              discountPrice: 0,
              discountType: 'RUPEES',
              vendorId: '',
            },
          ]);
          setProductSelected(Array(rowData?.length).fill(true));
        } else {
          setLoader(false);
        }
        setProductSelected([]);
        handleAvailableCredits(id);
      })
      .catch((err) => {
        showSnackbar(err?.response?.data?.message || 'Some errr occured', 'error');
      });
  };

  const handleAvailableCredits = (id) => {
    getAvailableCreditCust(locId, id)
      .then((res) => {
        if (res?.data?.status === 'SUCCESS' && res?.data?.data?.es === 0) {
          setCustomerCredit(res?.data?.data);
          setCustomerCreditNote(res?.data?.data?.creditAmount);
        }
      })
      .catch((err) => {
        // console.error('err', err);
      });
  };

  const handleChageBillAddress = (item) => {
    setBillingAddress(item);
    setOpenBillModal(false);
    setUpdateCart(uuidv4());
  };

  const handleChageShipAddress = (item) => {
    setShippingAddress(item);
    setOpenShipModal(false);
    setUpdateCart(uuidv4());
  };

  const handleUpdateCart = () => {
    if (!cartId) {
      return;
    }
    const payload = {
      userName: selectedCustomer?.label,
      userId: selectedCustomer?.value,
      mobileNo: mobileNumber,
      enableWhatsapp: true,
      updatedBy: userName,
      locationId: locId,
      sourceId: selectedCustomer?.value,
      loggedInUser: uidx,
      sourceLocationId: selectedCustomer?.value,
      sourceType: 'RETAIL',
      sourceApp: sourceApp,
      destinationId: orgId,
      destinationLocationId: locId,
      destinationType: contextType,
      comments: comment,
      address: {
        billingAddress: {
          addressId: billingAddress?.id,
          country: billingAddress?.country,
          state: billingAddress?.state,
          city: billingAddress?.city,
          pinCode: billingAddress?.pincode,
          phoneNo: billingAddress?.mobileNumber,
          addressLine1: billingAddress?.addressLine1,
          addressLine2: billingAddress?.addressLine2,
          type: billingAddress?.entityType,
          addressType: billingAddress?.addressType,
          updatedBy: uidx,
          updatedOn: '',
          // gstIn: custGST || null,
          // panNumber: custPAN || null,
        },
        shippingAddress: {
          addressId: shippingAddress?.id,
          country: shippingAddress?.country,
          state: shippingAddress?.state,
          city: shippingAddress?.city,
          pinCode: shippingAddress?.pincode,
          phoneNo: shippingAddress?.mobileNumber,
          addressLine1: shippingAddress?.addressLine1,
          addressLine2: shippingAddress?.addressLine2,
          type: shippingAddress?.entityType,
          addressType: shippingAddress?.addressType,
          updatedBy: uidx,
          updatedOn: '',
          // gstIn: custGST || null,
          // panNumber: custPAN || null,
        },
      },
    };
    salesOrderUpdateCart(payload, cartId)
      .then((res) => {
        if (res?.data?.message === 'ERROR') {
          showSnackbar(res?.data?.message, 'error');
          return;
        }
      })
      .catch((err) => {
        showSnackbar(err?.response?.data?.message, 'error');
      });
  };

  const handlePurchaseData = (value, fieldName) => {
    if (fieldName === 'remove') {
      setPurchaseInfo((prevInfo) => ({
        ...prevInfo,
        ['cartId']: cartId,
        ['poFileLink']: '',
      }));
    } else {
      setPurchaseInfo((prevInfo) => ({
        ...prevInfo,
        ['cartId']: cartId,
        [fieldName]: value,
      }));
    }
    if (cartId) {
      setPurchseDebounce(uuidv4());
    }
  };

  const createPurchseInfo = () => {
    const isValidUrl = (url) => {
      try {
        new URL(url);
        return true;
      } catch (e) {
        return false;
      }
    };
    if (purchaseInfo.paymentLink !== '' && !isValidUrl(purchaseInfo.paymentLink)) {
      showSnackbar('Enter a valid URL', 'error');
      return;
    }
    salesOrderCreatePurchase(purchaseInfo)
      .then((res) => {
        setPurchaseInfo((prevInfo) => ({
          ...prevInfo,
          ['isPresent']: true,
        }));
        if (res?.data?.status === 'SUCCESS' && res?.data?.data?.es === 0) {
          setBillingData(res?.data?.data?.data?.billing);
        }
      })
      .catch((err) => {
        showSnackbar(err?.response?.data?.message, 'error');
      });
  };

  const updatePurchaseInfo = () => {
    const isValidUrl = (url) => {
      try {
        new URL(url);
        return true;
      } catch (e) {
        return false;
      }
    };
    if (purchaseInfo.paymentLink !== '' && !isValidUrl(purchaseInfo.paymentLink)) {
      showSnackbar('Enter a valid URL', 'error');
      return;
    }
    salesOrderUpdatePurchase(purchaseInfo)
      .then((res) => {
        setPurchaseInfo((prevInfo) => ({
          ...prevInfo,
          ['isPresent']: true,
        }));
        if (res?.data?.status === 'SUCCESS' && res?.data?.data?.es === 0) {
          setBillingData(res?.data?.data?.data?.billing);
        }
      })
      .catch((err) => {
        showSnackbar(err?.response?.data?.message, 'error');
      });
  };

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    const fileUrl = URL.createObjectURL(uploadedFile);
    if (fileUrl) {
      setIsFileSelected(true);
      handlePurchaseData(fileUrl, 'poFileLink');
    }
  };

  const handleIconClick = () => {
    document.getElementById('file-input').click();
  };

  const handleFileRemove = () => {
    setIsFileSelected(false);
    handlePurchaseData('', 'remove');
  };

  const handleViewFile = () => {
    if (purchaseInfo?.poFileLink !== '') {
      const fileUrl = purchaseInfo?.poFileLink;
      window.open(fileUrl, '_blank');
    }
  };

  const handleGSTChange = (option) => {
    setInclusiveTax(option);
    handlePurchaseData(option, 'taxDetails');
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

  const handlePreview = () => {
    setPreviewLoader(true);
    const itemListArray = rowData?.map((item) => {
      const itemList = {
        gtin: item?.itemCode,
        productName: item?.itemName,
        mrp: item?.mrp,
        sellingPrice: item?.sellingPrice,
        quantity: item?.quantityOrdered || 1,
        subTotal: item?.amountWithoutTax,
        igst: item?.igst,
        cgst: item?.cgst,
        sgst: item?.sgst,
        hsnCode: item?.hsnCode,
      };
      return itemList;
    });
    const previewPayload = {
      addressModel: {
        billingAddress: {
          billingAddressId: billingAddress?.billingAddressId,
          addressId: billingAddress?.addressId,
          country: billingAddress?.country,
          state: billingAddress?.state,
          city: billingAddress?.city,
          pinCode: billingAddress?.pinCode,
          phoneNo: billingAddress?.phoneNo,
          longitude: billingAddress?.longitude,
          latitude: billingAddress?.latitude,
          addressLine1: billingAddress?.addressLine1,
          addressLine2: billingAddress?.addressLine2,
          type: billingAddress?.type,
          addressType: billingAddress?.addressType,
          updatedBy: billingAddress?.updatedBy,
          updatedOn: billingAddress?.updatedOn,
        },
        shippingAddress: {
          billingAddressId: shippingAddress?.shippingAddressId,
          addressId: shippingAddress?.addressId,
          country: shippingAddress?.country,
          state: shippingAddress?.state,
          city: shippingAddress?.city,
          pinCode: shippingAddress?.pinCode,
          phoneNo: shippingAddress?.phoneNo,
          longitude: shippingAddress?.longitude,
          latitude: shippingAddress?.latitude,
          addressLine1: shippingAddress?.addressLine1,
          addressLine2: shippingAddress?.addressLine2,
          type: shippingAddress?.type,
          addressType: shippingAddress?.addressType,
          updatedBy: shippingAddress?.updatedBy,
          updatedOn: shippingAddress?.updatedOn,
        },
      },
      orderType: 'SALES_ORDER',
      numberOfItems: itemListArray?.length,
      orderItemList: itemListArray,
      subTotal: billingData?.subtotal,
      gst: billingData?.igst,
      grandTotal: billingData?.totalCartValue,
    };
    previewSalesOrder(previewPayload)
      .then((res) => {
        setPreviewLoader(false);
        if (res?.data?.status === 'ERROR') {
          showSnackbar(res?.data?.message || 'Some error occured');
          return;
        }
        const blob = new Blob([res.data], { type: 'application/pdf' });
        const objectUrl = URL.createObjectURL(blob);
        window.open(objectUrl);
      })
      .catch((err) => {
        setPreviewLoader(false);
      });
  };

  const handleDeleteCart = () => {
    setDeleteLoader(true);
    deleteSalesOrderCartId(cartId)
      .then((res) => {
        navigate('/sales/all-orders');
        setDeleteLoader(false);
        localStorage.removeItem('cartId-SO');
        handleCloseDltModal();
      })
      .catch((err) => {
        setDeleteLoader(false);
        if (err?.response?.data?.message === 'Error :: Product list is empty for this cart.') {
          navigate('/sales/all-orders');
        } else if (err?.response?.data?.message === 'Error :: There is no cart found for this Id.') {
          navigate('/sales/all-orders');
        }
        showSnackbar(err?.response?.data?.message, 'error');
      });
  };

  const handleSaveOrder = () => {
    if (rowData?.length === 0) {
      showSnackbar('Add products', 'error');
      return;
    }

    setSaveLoader(true);
    const payload = {
      sessionId: orgId,
      licenseId: 'string',
      cartId: cartId,
      paymentMode: paymentMode,
      // paymentMethod: paymentMethod,
      paymentMethod: 'CASH',
      inventoryCheck: 'NO',
      amount: billingData?.totalCartValue,
    };
    if (orderId && cartId) {
      payload.orderId = orderId;
      editSalesOrder(payload)
        .then((res) => {
          if (res?.data?.status === 'ERROR') {
            showSnackbar(res?.data?.message, 'error');
            setSaveLoader(false);
            return;
          }
          if (res?.data?.data?.es) {
            showSnackbar(res?.data?.data?.message, 'error');
            setSaveLoader(false);
            return;
          }
          localStorage.removeItem('cartId-SO');
          localStorage.removeItem('sales_OrderId');
          navigate(`/order-placed/${res?.data?.data?.orderResponseModel?.orderId}`);

          setSaveLoader(false);
        })
        .catch((e) => {
          setSaveLoader(false);
          showSnackbar('Unable to create Sales order', 'error');
        });
    } else {
      salesOrderWithPayment(payload)
        .then(function (res) {
          if (res?.data?.status === 'ERROR') {
            showSnackbar(res?.data?.message, 'error');
            setSaveLoader(false);
            return;
          }
          if (res?.data?.data?.es) {
            showSnackbar(res?.data?.data?.message, 'error');
            return;
          }
          localStorage.removeItem('cartId-SO');
          navigate(`/order-placed/${res?.data?.data?.orderResponseModel?.orderId}`);

          setSaveLoader(false);
        })
        .catch((e) => {
          setSaveLoader(false);
          showSnackbar('Unable to create Sales order', 'error');
        });
    }
  };

  const handleCustomerCredit = (value) => {
    if (Number(value) > Number(customerCreditNote)) {
      showSnackbar('Insuffiecient credit note entered', 'error');
      return;
    }
    setCustomerCreditNoteUSed(value);
    applyCredit(value);
    // setBillChange(value === '' ? 0 : value);
  };

  const handleCouponChange = (value) => {
    setIsCouponApplied(value);
    if (value) {
      getCouponDetails(couponCode, value);
    } else {
      handleRemoveCoupon();
    }
  };

  const getCouponDetails = (code) => {
    setCouponLoader(true);
    let couponHasId = couponId || '';
    if (couponHasId !== '') {
      handleApplyCoupon(couponHasId, code);
    } else {
      staticCouponSingle(code)
        .then((res) => {
          if (res?.data?.status === 'ERROR') {
            setIsCouponApplied(false);
            setCouponLoader(false);
            showSnackbar(res?.data?.message, 'error');
            return;
          }
          couponHasId = res?.data?.data?.coupon?.couponId;
          setCouponId(couponHasId);
          handleApplyCoupon(couponHasId, code);
        })
        .catch((err) => {
          setIsCouponApplied(false);
          showSnackbar(err?.response?.data?.message, 'error');
        });
    }
  };

  const handleApplyCoupon = (id, code) => {
    const payload = {
      couponId: id,
      couponCode: code,
      cartId: cartId,
    };
    applyCoupon(payload)
      .then((res) => {
        setCouponLoader(false);
        if (res?.data?.status === 'ERROR') {
          setIsCouponApplied(false);
          showSnackbar(res?.data?.message, 'error');
          return;
        }
        if (res?.data?.data?.es > 0) {
          showSnackbar(res?.data?.data?.message, 'error');
          return;
        }
        const response = res?.data?.data;
        setBillingData(response?.billing);
        showSnackbar('Coupon applied', 'success');
      })
      .catch((err) => {
        setCouponLoader(false);
        setIsCouponApplied(false);
        showSnackbar(err?.response?.data?.message || 'Some error occured', 'error');
      });
  };

  const handleRemoveCoupon = () => {
    setCouponLoader(true);
    removeSOCoupon(cartId)
      .then((res) => {
        setCouponLoader(false);
        if (res?.data?.status === 'ERROR') {
          showSnackbar(res?.data?.message, 'error');
          return;
        }
        if (res?.data?.data?.es > 0) {
          showSnackbar(res?.data?.data?.message, 'error');
          return;
        }
        const response = res?.data?.data?.data;
        setBillingData(response?.billing);
        showSnackbar('Coupon removed', 'success');
      })
      .catch((err) => {
        setCouponLoader(false);
        showSnackbar(err?.response?.data?.message, 'error');
      });
  };

  const handleLoyality = (value) => {
    if (value) {
      handleLoyaltyRedeem(selectedCustomer?.value, billingData);
      setOpenLoyalityModal(true);
    } else {
      handleRemoveLoyality();
    }
  };

  const handleLoyaltyRedeem = (userId, billing) => {
    setLoyaltyLoader(true);
    const payload = {
      sourceOrgId: orgId,
      cartValue: billing?.totalCartValue,
      customerType: 'RETAIL',
      customerId: userId,
      couponApplied: isCouponApplied,
      platformSupportType: 'B2B',
    };
    fetchLoyality(payload)
      .then((res) => {
        setLoyaltyLoader(false);
        if (res?.data?.status === 'ERROR') {
          showSnackbar(res?.data?.message, 'error');
          return;
        }
        const response = res?.data?.data;
        setLoyalityMessage(response?.message);
        if (response?.status === false) {
          setLoyalityData(response);
          // redeemable is false then don't call redeem api
        } else if (response?.status === true) {
          // setLoyalityMessage(response?.message);
          setLoyalityData(response);
        }
      })
      .catch((err) => {
        setLoyaltyLoader(false);
        showSnackbar(err?.response?.data?.message, 'error');
      });
  };

  const handleClose = () => {
    setOpenLoyalityModal(false);
    if (!loyalityApplied) {
      setLoyalityData('');
      setLoyalityMessage('');
    }
  };

  const handleRemoveLoyality = () => {
    setLoyaltyLoader(true);
    removeLoyality(cartId)
      .then((res) => {
        cartDetails();
        showSnackbar('Loyality Removed', 'success');
        setLoyaltyLoader(false);
      })
      .catch((err) => {
        setLoyaltyLoader(false);
        showSnackbar(err?.response?.data?.message || 'Some error occured', 'error');
      });
  };

  const handleCreditApplied = (value) => {
    setIsCreditApplied(value);
    if (!value && customerCreditNoteUsed > 0) {
      setCustomerCreditNoteUSed(0);
      removeSOCreditCust(cartId)
        .then((res) => {
          if (res?.data?.status === 'SUCCESS' && res?.data?.data?.es === 0) {
            const response = res?.data?.data?.data;
            setBillingData(response?.billing);
          }
        })
        .catch((err) => {
          showSnackbar(err?.response?.data?.message, 'error');
        });
    }
  };

  const applyCredit = (amount) => {
    const payload = {
      cartId: cartId,
      credit: amount,
      updatedBy: uidx,
    };
    applySOCreditCust(payload)
      .then((res) => {
        if (res?.data?.status === 'SUCCESS' && res?.data?.data?.es === 0) {
          const response = res?.data?.data?.data;
          setBillingData(response?.billing);
        }
      })
      .catch((err) => {
        showSnackbar(err?.response?.data?.message, 'error');
      });
  };

  const createNewOrder = () => {
    const payload = {
      userName: selectedCustomer?.label,
      userId: selectedCustomer?.value,
      mobileNo: mobileNumber,
      enableWhatsapp: true,
      createdBy: userName,
      locationId: locId,
      orderType: 'SALES_ORDER',
      sourceId: selectedCustomer?.value,
      // "licenceId": "string",
      // "sessionId": "string",
      loggedInUser: uidx,
      sourceLocationId: selectedCustomer?.value,
      sourceType: 'RETAIL',
      sourceApp: sourceApp,
      destinationId: orgId,
      destinationLocationId: locId,
      destinationType: contextType,
      comments: comment,
      address: {
        billingAddress: {
          addressId: billingAddress?.id,
          country: billingAddress?.country,
          state: billingAddress?.state,
          city: billingAddress?.city,
          pinCode: billingAddress?.pincode,
          phoneNo: billingAddress?.mobileNumber,
          addressLine1: billingAddress?.addressLine1,
          addressLine2: billingAddress?.addressLine2,
          type: billingAddress?.entityType,
          addressType: billingAddress?.addressType,
          updatedBy: uidx,
          updatedOn: '',
          // gstIn: custGST || null,
          // panNumber: custPAN || null,
        },
        shippingAddress: {
          addressId: shippingAddress?.id,
          country: shippingAddress?.country,
          state: shippingAddress?.state,
          city: shippingAddress?.city,
          pinCode: shippingAddress?.pincode,
          phoneNo: shippingAddress?.mobileNumber,
          addressLine1: shippingAddress?.addressLine1,
          addressLine2: shippingAddress?.addressLine2,
          type: shippingAddress?.entityType,
          addressType: shippingAddress?.addressType,
          updatedBy: uidx,
          updatedOn: '',
          // gstIn: custGST || null,
          // panNumber: custPAN || null,
        },
      },
    };
    newSalesOrderCart(payload)
      .then((res) => {
        if (res?.data?.status === 'ERROR') {
          showSnackbar(res?.data?.message, 'error');
          setLoader(false);
          return;
        }
        if (res?.data?.data?.es > 0) {
          showSnackbar(res?.data?.data?.message, 'error');
          setLoader(false);
          return;
        }
        const response = res?.data?.data?.data;
        setCartStatus(response?.cartStatus);
        if (response?.cartCoupon) {
          setIsCouponApplied(true);
        }
        if (
          response?.loyaltyPoints !== null &&
          response?.loyaltyPoints !== undefined &&
          response?.loyaltyPoints !== ''
        ) {
          setLoyalityApplied(true);
        } else {
          setLoyalityApplied(false);
        }
        localStorage.setItem('cartId-SO', response?.cartId);
        setCartId(response?.cartId);
        if (response?.credit > 0) {
          setIsCreditApplied(true);
          setCustomerCreditNoteUSed(response?.credit);
        }
        if (response?.poInfo) {
          if (response?.poInfo?.poFileLink !== '') {
            setIsFileSelected(true);
          }
          setInclusiveTax(response?.poInfo?.taxDetails);
          setIsLinkIncluded(response?.poInfo?.paymentLink === '' ? false : true);
          setPurchaseInfo({
            isPresent: true,
            cartId: cartId,
            poNumber: response?.poInfo?.poNumber,
            poValue: response?.poInfo?.poValue,
            poDate: response?.poInfo?.poDate,
            shipment: response?.poInfo?.shipment,
            paymentDueDate: response?.poInfo?.paymentDueDate,
            shipmentDate: response?.poInfo?.shipmentDate,
            taxDetails: response?.poInfo?.taxDetails,
            paymentLink: response?.poInfo?.paymentLink,
            poFileLink: response?.poInfo?.poFileLink,
            createdBy: response?.poInfo?.createdBy,
            createdByName: response?.poInfo?.createdByName,
          });
        } else {
          setIsFileSelected(false);
          setInclusiveTax('true');
          setPurchaseInfo({
            isPresent: false,
            cartId: cartId,
            poNumber: '',
            poValue: 0,
            poDate: '',
            shipment: '',
            paymentDueDate: '',
            shipmentDate: '',
            taxDetails: inclusiveTax,
            paymentLink: '',
            poFileLink: '',
            createdBy: uidx,
            createdByName: userName,
          });
        }
        if (response?.supplementaryProducts?.length > 0) {
          setIsExtraField(true);
          const chargeList = response?.supplementaryProducts?.map((item) => ({
            chargeId: item?.supplementaryProductId,
            cartId: cartId,
            description: item?.productName,
            unitPrice: item?.price ?? 0,
            quantity: item?.quantity ?? 1,
            tax: item?.tax ?? 0,
            taxType: item?.taxType,
            amount: item?.subTotal ?? 0,
          }));
          updateBillingData(chargeList);
          setAdditionalList(chargeList);
        } else {
          setIsExtraField(false);
          setAdditionalList([
            {
              chargeId: null,
              cartId: cartId,
              description: '',
              unitPrice: 0,
              quantity: 1,
              tax: 0,
              taxType: '%',
              amount: 0,
            },
          ]);
          setAdditionalExpense(0);
        }
        if (response?.cartProducts?.length > 0) {
          const cartResponse = response?.cartProducts?.sort(
            (a, b) => new Date(a?.createdDate) - new Date(b?.createdDate),
          );
          const updatedRow = cartResponse?.map((e) => {
            return {
              itemId: uuidv4(),
              id: e?.cartProductId || '',
              itemCode: e?.gtin,
              itemName: e?.productName,
              quantityOrdered: e?.quantity || '',
              purchasePrice: e?.purchasePrice || 0,
              mrp: e?.mrp || 0,
              sellingPrice: e?.sellingPrice || 0,
              hsnCode: e?.hsnCode || '',
              igst: e?.igst || 0,
              cgst: e?.cgst || 0,
              sgst: e?.sgst || 0,
              spec: e?.weightsAndMeasures
                ? e?.weightsAndMeasures?.net_weight + ' ' + e?.weightsAndMeasures?.measurement_unit
                : '',
              amountWithTax: e?.subTotal || 0,
              amountWithoutTax: e?.subTotalWithoutTax || 0,
              cess: e?.cess || 0,
              batchNo: e?.batchNo,
              batches: e?.batches,
              discountPrice: e?.discountPrice || 0,
              discountType: e?.discountType || 'RUPEES',
              purchasePrice: e?.purchasePrice || 0,
              vendorId: e?.vendorId ?? '',
            };
          });
          setRowData(updatedRow);
          setProductSelected(Array(updatedRow?.length).fill(false));
        } else {
          setRowData([
            {
              itemId: uuidv4(),
              id: '',
              itemCode: '',
              itemName: '',
              spec: '',
              mrp: 0,
              purchasePrice: '',
              sellingPrice: 0,
              quantityOrdered: '',
              hsnCode: '',
              cess: '',
              igst: 0,
              cgst: 0,
              sgst: 0,
              cess: 0,
              amountWithTax: '',
              amountWithoutTax: '',
              batches: [],
              discountPrice: 0,
              discountType: 'RUPEES',
              vendorId: '',
            },
          ]);
          setProductSelected(Array(rowData?.length).fill(true));
        }

        setBillingData(response?.billing);
        setLoader(false);
      })
      .catch((err) => {
        setLoader(false);
        showSnackbar(err?.response?.data?.message || 'Some erro occured', 'error');
      });
  };

  function updateBillingData(data) {
    const totalExpense = data?.reduce((acc, item) => acc + Number(item?.amount || 0), 0);
    setAdditionalExpense(totalExpense);
  }

  const cartDetails = async () => {
    try {
      setLoader(true);

      let res;
      if (orderId) {
        res = await adjustCartByOrderId(cartId, orderId);
      } else {
        res = await getCartDetails(cartId);
      }
      const responseData = res?.data;
      if (responseData?.status === 'ERROR') {
        showSnackbar(responseData?.message, 'error');
        setLoader(false);
        return;
      }

      if (responseData?.data?.es > 0) {
        localStorage.removeItem('cartId-SO');
        showSnackbar(responseData?.data?.message, 'error');
        setLoader(false);
        return;
      }
      const response = responseData?.data?.data;
      const cartProducts = response?.cartProducts?.sort((a, b) => new Date(a?.createdDate) - new Date(b?.createdDate));
      setCartId(response?.cartId);
      setOrderId(response?.orderId);
      setComment(response?.comments);
      localStorage.setItem('cartId-SO', response?.cartId);
      localStorage.removeItem('sales_OrderId');
      setBillingData(response?.billing);
      setCartStatus(response?.cartStatus);
      customerDetails(response?.userId, response?.billingAddress?.addressId, response?.shippingAddress?.addressId);
      setSelectedCustomer({ value: response?.userId, label: response?.userName });
      if (response?.cartCoupon) {
        setIsCouponApplied(true);
      }
      if (response?.loyaltyPoints !== null && response?.loyaltyPoints !== undefined && response?.loyaltyPoints !== '') {
        setLoyalityApplied(true);
      } else {
        setLoyalityApplied(false);
      }
      if (response?.credit > 0) {
        setIsCreditApplied(true);
        setCustomerCreditNoteUSed(response?.credit);
      }
      if (response?.poInfo) {
        if (response?.poInfo?.poFileLink !== '') {
          setIsFileSelected(true);
        }
        setInclusiveTax(response?.poInfo?.taxDetails);
        setIsLinkIncluded(response?.poInfo?.paymentLink === '' ? false : true);
        setPurchaseInfo({
          isPresent: true,
          cartId: cartId,
          poNumber: response?.poInfo?.poNumber,
          poValue: response?.poInfo?.poValue,
          poDate: response?.poInfo?.poDate,
          shipment: response?.poInfo?.shipment,
          paymentDueDate: response?.poInfo?.paymentDueDate,
          shipmentDate: response?.poInfo?.shipmentDate,
          taxDetails: response?.poInfo?.taxDetails,
          paymentLink: response?.poInfo?.paymentLink,
          poFileLink: response?.poInfo?.poFileLink,
          createdBy: response?.poInfo?.createdBy,
          createdByName: response?.poInfo?.createdByName,
        });
      } else {
        setIsFileSelected(false);
        setInclusiveTax('true');
        setPurchaseInfo({
          isPresent: false,
          cartId: cartId,
          poNumber: '',
          poValue: 0,
          poDate: '',
          shipment: '',
          paymentDueDate: '',
          shipmentDate: '',
          taxDetails: inclusiveTax,
          paymentLink: '',
          poFileLink: '',
          createdBy: uidx,
          createdByName: userName,
        });
      }
      if (response?.supplementaryProducts?.length > 0) {
        setIsExtraField(true);
        const chargeList = response?.supplementaryProducts?.map((item) => ({
          chargeId: item?.supplementaryProductId,
          cartId: cartId,
          description: item?.productName,
          unitPrice: item?.price ?? 0,
          quantity: item?.quantity ?? 1,
          tax: item?.tax ?? 0,
          taxType: item?.taxType,
          amount: item?.subTotal ?? 0,
        }));
        setAdditionalList(chargeList);
        updateBillingData(chargeList);
      } else {
        setIsExtraField(false);
        setAdditionalList([
          {
            chargeId: null,
            cartId: cartId,
            description: '',
            unitPrice: 0,
            quantity: 1,
            tax: 0,
            taxType: '%',
            amount: 0,
          },
        ]);
        setAdditionalExpense(0);
      }
      if (cartProducts?.length > 0) {
        const updatedRow = cartProducts.map((e) => ({
          itemId: uuidv4(),
          id: e?.cartProductId || '',
          itemCode: e?.gtin,
          itemName: e?.productName,
          quantityOrdered: e?.quantity || '',
          purchasePrice: e?.purchasePrice || 0,
          mrp: e?.mrp || 0,
          sellingPrice: e?.sellingPrice || 0,
          hsnCode: e?.hsnCode || '',
          igst: e?.igst || 0,
          cgst: e?.cgst || 0,
          sgst: e?.sgst || 0,
          amountWithTax: e?.subTotal || 0,
          amountWithoutTax: e?.subTotalWithoutTax || 0,
          cess: e?.cess || 0,
          spec: e?.weightsAndMeasures
            ? `${e?.weightsAndMeasures?.net_weight} ${e?.weightsAndMeasures?.measurement_unit}`
            : '',
          batchNo: e?.batchNo,
          discountPrice: e?.discountPrice || 0,
          discountType: e?.discountType || 'RUPEES',
          purchasePrice: e?.purchasePrice || 0, // Duplicate property, can be removed
          vendorId: e?.vendorId ?? '',
          batches: e?.batches || [],
        }));
        setRowData(updatedRow);
        setProductSelected(Array(updatedRow?.length).fill(false));
      } else {
        setRowData([
          {
            itemId: uuidv4(),
            id: '',
            itemCode: '',
            itemName: '',
            spec: '',
            mrp: 0,
            purchasePrice: '',
            sellingPrice: 0,
            quantityOrdered: '',
            hsnCode: '',
            cess: '',
            igst: 0,
            cgst: 0,
            sgst: 0,
            cess: 0,
            amountWithTax: '',
            amountWithoutTax: '',
            batches: [],
            discountPrice: 0,
            discountType: 'RUPEES',
            vendorId: '',
          },
        ]);
      }
      setProductSelected(Array(rowData?.length).fill(true));
      setLoader(false);
    } catch (err) {
      setLoader(false);
      showSnackbar(err?.response?.data?.message || 'Some error occurred', 'error');
    }
  };
  const handleSaveBtn = () => {
    if (paymentMode === '') {
      showSnackbar('Select payment mode', 'error');
      return;
    }
    setOpenSaveModal(true);
  };

  return (
    <DashboardLayout isMobileDevice={isMobileDevice}>
      {!isMobileDevice && <DashboardNavbar prevLink={true} />}
      <Box
        sx={{
          height: isMobileDevice ? 'calc(100dvh - 24px)' : '100%',
          width: '100%',
          display: isMobileDevice && 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box mt={!isMobileDevice && 2} pb={isMobileDevice ? 0.5 : 3} sx={{ width: '100%' }}>
          {!isMobileDevice && (
            <SoftBox p={3} display="flex" justifyContent="space-between" alignItems="center">
              <SoftTypography fontSize="24px" fontWeight="bold">
                New order
              </SoftTypography>
              {rowData?.length > 0 && (
                <div>
                  <MoreHorizRoundedIcon fontSize="large" className="copy-icon menu-icon" onClick={handleMenu} />
                </div>
              )}
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={openMenu}
                onClose={handleMenuClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
              >
                {[
                  previewLoader ? (
                    <Spinner size={20} key="preview-spinner" />
                  ) : (
                    <MenuItem onClick={handlePreview} key="preview-menu-item">
                      Preview
                    </MenuItem>
                  ),
                  cartId &&
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
          )}
          <SoftBox
            className={`${isMobileDevice ? 'create-pi-card-mobile po-box-shadow sales-main-div' : 'create-pi-card'}`}
            p={3}
            md={3}
          >
            {isMobileDevice && (
              <>
                <SoftBox className="create-pi-header">
                  <SoftBox sx={{ width: '100%', padding: '10px 15px 10px 15px' }}>
                    <MobileNavbar title={'New Order'} prevLink={true} />
                  </SoftBox>
                  <SoftBox
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      gap: '10px',
                    }}
                    className={`${isMobileDevice && 'main-pi-btn-position'}`}
                  >
                    {rowData?.length > 0 && (
                      <SoftButton
                        variant={buttonStyles.primaryVariant}
                        className={`vendor-add-btn ${
                          isMobileDevice ? 'preview-mob-btn preview-color pi-preview-btn' : 'contained-softbutton'
                        }`}
                      >
                        {previewLoader ? (
                          <CircularProgress
                            sx={{ color: 'white', height: '15px !important', width: '15px !important' }}
                          />
                        ) : (
                          <>
                            <PreviewIcon onClick={handlePreview} />
                            <Typography fontSize={'12px'} onClick={handlePreview}>
                              Preview
                            </Typography>
                          </>
                        )}
                        {cartId &&
                          (deleteLoader ? (
                            <CircularProgress
                              sx={{ color: 'white', height: '15px !important', width: '15px !important' }}
                            />
                          ) : (
                            <>
                              <DeleteIcon onClick={() => setOpenDltModal(true)} />
                              <Typography fontSize={'12px'} onClick={() => setOpenDltModal(true)}>
                                Delete
                              </Typography>
                            </>
                          ))}
                      </SoftButton>
                    )}
                  </SoftBox>
                </SoftBox>
              </>
            )}
            <Box display="flex" width="100%" justifyContent="flex-end">
              <Grid container spacing={3} mt={-2}>
                <Grid item xs={12} md={12} xl={12}>
                  <SoftBox display="flex" justifyContent="space-between" alignItems="center">
                    <SoftTypography fontSize="15px" fontWeight="bold" sx={{ marginLeft: '10px' }}>
                      {!isMobileDevice ? null : (
                        <>
                          {cartId ? (
                            <Typography fontSize="12px" sx={{ color: 'green' }}>
                              Sales order details
                              <CheckCircleIcon
                                sx={{
                                  color: 'green !important',
                                  height: 15,
                                  width: 15,
                                  marginTop: '-2px',
                                  marginLeft: '5px',
                                }}
                              />
                            </Typography>
                          ) : (
                            <Typography fontSize="12px" sx={{ color: '#0562FB' }}>
                              Fill Purchase Indent Details
                            </Typography>
                          )}
                        </>
                      )}
                    </SoftTypography>
                    {/* {isMobileDevice && <Spinner size={20} />} */}
                  </SoftBox>
                </Grid>
              </Grid>
            </Box>
            <div style={{ padding: isMobileDevice ? '10px' : '0px' }}>
              <Grid container spacing={1} justifyContent="space-between">
                <Grid item xs={12} md={3.5} xl={3.5}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <SoftTypography fontWeight="bold" fontSize="13px">
                      Choose customer <span style={{ color: 'red' }}>*</span>
                    </SoftTypography>
                    {loader && <Spinner size={20} />}
                  </div>
                  <SoftSelect
                    placeholder="Select"
                    value={customerOptions?.find((ele) => ele?.value === selectedCustomer?.value) || ''}
                    onChange={(option) => handleCustomerSelect(option)}
                    options={customerOptions}
                  />
                </Grid>

                {/* CREDIT SCORE */}
                <Grid item xs={12} md={3.5} xl={3.5}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <div>
                      <div className="vendor-data-names">Available credits</div>
                      <div className="vendor-data-names">
                        <b>{`₹ ${customerCredit?.creditAmount ?? 0} from ${
                          customerCredit?.creditsFromReturns ?? 0
                        } returns`}</b>
                      </div>
                      {/* <div className="vendor-data-names">{`from ${0 || 0} returns`}</div> */}
                    </div>
                    <div>
                      <div className="vendor-data-names">Outstanding receivables</div>
                      <div className="vendor-data-names">
                        <b>{`₹ ${customerCredit?.outStandingReceivable ?? 0}`}</b>{' '}
                        <span style={{ color: '#ff3b30' }}>
                          {customerCredit?.outStandingReceivableFromOrders ?? 0} days overdue{' '}
                        </span>
                      </div>
                      {/* <div className="vendor-data-names" style={{ color: '#ff3b30' }}>{`${0 || 0} days overdue`}</div> */}
                    </div>
                  </div>
                </Grid>
              </Grid>

              {/* PO VALIDATION */}
              <Grid container spacing={1} mt={1}>
                <Grid item xs={12} md={5.8} xl={5.8}>
                  <SoftTypography fontWeight="bold" fontSize="13px" sx={{}}>
                    Purchase order number{' '}
                  </SoftTypography>
                  <SoftBox style={{ display: 'flex', gap: '5px', justifyContent: 'flex start', alignItems: 'center' }}>
                    <SoftBox style={{ width: '60%' }}>
                      <SoftInput
                        placeholder="Ex: PO1234"
                        value={purchaseInfo.poNumber || ''}
                        onChange={(e) => handlePurchaseData(e.target.value, 'poNumber')}
                      />
                    </SoftBox>
                    {isFileSelected ? (
                      <SoftBox style={{ display: 'flex', gap: '5px', alignItems: 'center', cursor: 'pointer' }}>
                        <InsertDriveFileIcon color="info" onClick={handleIconClick} />
                        <span style={{ fontSize: '12px', color: '#ff9500' }} onClick={handleIconClick}>
                          {' '}
                          Replace file{' '}
                        </span>
                        <input
                          id="file-input"
                          type="file"
                          accept=".jpg,.jpeg,.png,.gif,.pdf,.xls,.xlsx,.doc,.docx"
                          style={{ display: 'none' }}
                          onChange={handleFileChange}
                        />
                        <IconButton size="small" onClick={handleFileRemove}>
                          <CloseIcon />
                        </IconButton>
                        <IconButton size="small" onClick={handleViewFile}>
                          <RemoveRedEyeIcon color="info" />
                        </IconButton>
                      </SoftBox>
                    ) : (
                      <SoftBox
                        style={{ display: 'flex', gap: '5px', alignItems: 'center', cursor: 'pointer' }}
                        onClick={handleIconClick}
                      >
                        <AttachFileIcon color="info" />
                        <span style={{ fontSize: '12px' }}> Choose a file </span>
                        <input
                          id="file-input"
                          type="file"
                          accept=".jpg,.jpeg,.png,.gif,.pdf,.xls,.xlsx,.doc,.docx"
                          style={{ display: 'none' }}
                          onChange={handleFileChange}
                        />
                      </SoftBox>
                    )}
                  </SoftBox>
                </Grid>
              </Grid>

              {/* ADDRESS DATA */}
              {allAddresses?.length > 0 && (
                <Grid container spacing={3} mt={1}>
                  <Grid item xs={12} md={3.5} xl={3.5}>
                    <span className="po-address-title" style={{ marginLeft: '10px' }}>
                      Select billing details
                    </span>
                    <div className="component-bg-br-sh-p" style={{ maxHeight: '230px', overflowY: 'scroll' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span className="po-address-font">
                          <b>Store Name:</b> {billingAddress?.name}
                        </span>
                        <EditIcon
                          color="info"
                          onClick={() => setOpenBillModal(true)}
                          style={{ cursor: 'pointer', fontSize: '14px' }}
                        />
                      </div>
                      <div className="address-main-container" style={{ width: '90%' }}>
                        {/* <div className="address-line-container">
                                <span className="po-address-font">Store Name: {billingAddress?.name}</span>
                            </div> */}
                        <div className="address-line-container">
                          <span className="po-address-font">{billingAddress?.addressLine1}</span>
                        </div>
                        <div className="address-line-container">
                          <span className="po-address-font">{billingAddress?.addressLine2}</span>
                        </div>
                        <div className="address-line-container">
                          <span className="po-address-font">{billingAddress?.city}</span>
                        </div>
                        <div className="address-line-container">
                          <span className="po-address-font">{billingAddress?.state}</span>
                        </div>
                        <div className="address-line-container">
                          <span className="po-address-font"> {billingAddress?.pincode}</span>
                        </div>
                        <div className="address-line-container">
                          <span className="po-address-font">{billingAddress?.country}</span>
                        </div>
                        <div className="address-line-container">
                          <span className="po-address-font">
                            <b>GST:</b> {custGST}
                          </span>
                        </div>
                        <div className="address-line-container">
                          <span className="po-address-font">
                            <b>PAN:</b> {custPAN}
                          </span>
                        </div>
                      </div>
                    </div>
                    {!isMobileDevice ? (
                      <Modal
                        aria-labelledby="unstyled-modal-title"
                        aria-describedby="unstyled-modal-description"
                        open={openBillModal}
                        onClose={() => {
                          setOpenBillModal(false);
                        }}
                      >
                        <Box
                          className="pi-box-inventory"
                          sx={{
                            position: 'absolute',
                            top: '40%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            bgcolor: 'background.paper',
                            boxShadow: 24,
                            // p: 3.5,
                            overflow: 'auto',
                            maxHeight: '80vh',
                          }}
                        >
                          <Typography id="modal-modal-title" variant="h6" fontWeight="bold" component="h2">
                            Select billing address
                          </Typography>
                          <hr />
                          <SoftBox>
                            {allAddresses?.map((e) => {
                              return (
                                <SoftBox key={e?.id} onClick={() => handleChageBillAddress(e)}>
                                  <div
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'flex-start',
                                      alignItems: 'flex-start',
                                      gap: '5px',
                                    }}
                                  >
                                    <input
                                      type="radio"
                                      checked={billingAddress?.id == e?.id}
                                      onChange={() => handleChageBillAddress(e)}
                                      value={e?.id}
                                    />
                                    <div>
                                      <SoftTypography className="add-pi-font-size">{e?.name}</SoftTypography>
                                      <SoftTypography className="add-pi-font-size">{e?.addressLine1}</SoftTypography>
                                      <SoftTypography className="add-pi-font-size">{e?.addressLine2}</SoftTypography>
                                      <SoftTypography className="add-pi-font-size">{e?.state}</SoftTypography>
                                      <SoftTypography className="add-pi-font-size">
                                        {e?.city} {e?.pinCode}
                                      </SoftTypography>
                                      <SoftTypography className="add-pi-font-size">{e?.country}</SoftTypography>
                                    </div>
                                  </div>

                                  <hr />
                                </SoftBox>
                              );
                            })}
                          </SoftBox>
                        </Box>
                      </Modal>
                    ) : (
                      <MobileDrawerCommon
                        anchor="bottom"
                        drawerOpen={openBillModal}
                        drawerClose={() => setOpenBillModal(false)}
                        paperProps={{
                          height: 'auto',
                          width: '100%',
                        }}
                      >
                        <SoftBox className="loyalty-drawer-main-div ">
                          <Typography
                            id="modal-modal-title"
                            fontSize="16px"
                            fontWeight={700}
                            sx={{ textAlign: 'center' }}
                            m={2}
                          >
                            Select billing address
                          </Typography>
                          <SoftBox m={1} p={1} className="address-bg-div po-box-shadow">
                            {allAddresses?.map((e) => {
                              return (
                                <SoftBox key={e?.id} onClick={() => handleChageBillAddress(e)}>
                                  <div
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'flex-start',
                                      alignItems: 'flex-start',
                                      gap: '5px',
                                    }}
                                  >
                                    <input
                                      type="radio"
                                      checked={billingAddress?.id == e?.id}
                                      onChange={() => handleChageBillAddress(e)}
                                      value={e?.id}
                                    />
                                    <div>
                                      <SoftTypography className="add-pi-font-size">{e?.name}</SoftTypography>
                                      <SoftTypography className="add-pi-font-size">{e?.addressLine1}</SoftTypography>
                                      <SoftTypography className="add-pi-font-size">{e?.addressLine2}</SoftTypography>
                                      <SoftTypography className="add-pi-font-size">{e?.state}</SoftTypography>
                                      <SoftTypography className="add-pi-font-size">
                                        {e?.city} {e?.pinCode}
                                      </SoftTypography>
                                      <SoftTypography className="add-pi-font-size">{e?.country}</SoftTypography>
                                    </div>
                                  </div>

                                  <hr />
                                </SoftBox>
                              );
                            })}
                          </SoftBox>
                        </SoftBox>
                      </MobileDrawerCommon>
                    )}
                  </Grid>

                  <Grid item xs={12} md={3.5} xl={3.5}>
                    <span className="po-address-title" style={{ marginLeft: '10px' }}>
                      Select shipping details
                    </span>
                    <div className="component-bg-br-sh-p" style={{ maxHeight: '230px', overflowY: 'scroll' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div className="address-line-container">
                          <span className="po-address-font">
                            <b>Store Name:</b> {shippingAddress?.name}
                          </span>
                        </div>
                        <EditIcon
                          color="info"
                          onClick={() => setOpenShipModal(true)}
                          style={{ cursor: 'pointer', fontSize: '14px' }}
                        />
                      </div>
                      <div className="address-main-container" style={{ width: '90%' }}>
                        {/* <div className="address-line-container">
                                <span className="po-address-font">Store Name: {shippingAddress?.name}</span>
                            </div> */}
                        <div className="address-line-container">
                          <span className="po-address-font">{shippingAddress?.addressLine1}</span>
                        </div>
                        <div className="address-line-container">
                          <span className="po-address-font">{shippingAddress?.addressLine2}</span>
                        </div>
                        <div className="address-line-container">
                          <span className="po-address-font">{shippingAddress?.city}</span>
                        </div>
                        <div className="address-line-container">
                          <span className="po-address-font">{shippingAddress?.state}</span>
                        </div>
                        <div className="address-line-container">
                          <span className="po-address-font"> {shippingAddress?.pincode}</span>
                        </div>
                        <div className="address-line-container">
                          <span className="po-address-font">{shippingAddress?.country}</span>
                        </div>
                        <div className="address-line-container">
                          <span className="po-address-font">
                            <b>GST:</b> {custGST}
                          </span>
                        </div>
                        <div className="address-line-container">
                          <span className="po-address-font">
                            <b>PAN:</b> {custPAN}
                          </span>
                        </div>
                      </div>
                    </div>
                    {!isMobileDevice ? (
                      <Modal
                        aria-labelledby="unstyled-modal-title"
                        aria-describedby="unstyled-modal-description"
                        open={openShipModal}
                        onClose={() => {
                          setOpenShipModal(false);
                        }}
                      >
                        <Box
                          className="pi-box-inventory"
                          sx={{
                            position: 'absolute',
                            top: '40%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            bgcolor: 'background.paper',
                            boxShadow: 24,
                            // p: 3.5,
                            overflow: 'auto',
                            maxHeight: '80vh',
                          }}
                        >
                          <Typography id="modal-modal-title" variant="h6" fontWeight="bold" component="h2">
                            Select shipping address
                          </Typography>
                          <hr />
                          <SoftBox>
                            {allAddresses?.map((e) => {
                              return (
                                <SoftBox key={e?.id} onClick={() => handleChageShipAddress(e)}>
                                  <div
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'flex-start',
                                      alignItems: 'flex-start',
                                      gap: '5px',
                                    }}
                                  >
                                    <input
                                      type="radio"
                                      checked={shippingAddress?.id == e?.id}
                                      onChange={() => handleChageShipAddress(e)}
                                      value={e?.id}
                                    />
                                    <div>
                                      <SoftTypography className="add-pi-font-size">{e?.name}</SoftTypography>
                                      <SoftTypography className="add-pi-font-size">{e?.addressLine1}</SoftTypography>
                                      <SoftTypography className="add-pi-font-size">{e?.addressLine2}</SoftTypography>
                                      <SoftTypography className="add-pi-font-size">{e?.state}</SoftTypography>
                                      <SoftTypography className="add-pi-font-size">
                                        {e?.city} {e?.pinCode}
                                      </SoftTypography>
                                      <SoftTypography className="add-pi-font-size">{e?.country}</SoftTypography>
                                    </div>
                                  </div>

                                  <hr />
                                </SoftBox>
                              );
                            })}
                          </SoftBox>
                        </Box>
                      </Modal>
                    ) : (
                      <MobileDrawerCommon
                        anchor="bottom"
                        drawerOpen={openShipModal}
                        drawerClose={() => setOpenShipModal(false)}
                        paperProps={{
                          height: 'auto',
                          width: '100%',
                        }}
                      >
                        <SoftBox className="loyalty-drawer-main-div ">
                          <Typography
                            id="modal-modal-title"
                            fontSize="16px"
                            fontWeight={700}
                            sx={{ textAlign: 'center' }}
                            m={2}
                          >
                            Select shipping address
                          </Typography>
                          <SoftBox m={1} p={1} className="address-bg-div po-box-shadow">
                            {allAddresses?.map((e) => {
                              return (
                                <SoftBox key={e?.id} onClick={() => handleChageShipAddress(e)}>
                                  <div
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'flex-start',
                                      alignItems: 'flex-start',
                                      gap: '5px',
                                    }}
                                  >
                                    <input
                                      type="radio"
                                      checked={shippingAddress?.id == e?.id}
                                      onChange={() => handleChageShipAddress(e)}
                                      value={e?.id}
                                    />
                                    <div>
                                      <SoftTypography className="add-pi-font-size">{e?.name}</SoftTypography>
                                      <SoftTypography className="add-pi-font-size">{e?.addressLine1}</SoftTypography>
                                      <SoftTypography className="add-pi-font-size">{e?.addressLine2}</SoftTypography>
                                      <SoftTypography className="add-pi-font-size">{e?.state}</SoftTypography>
                                      <SoftTypography className="add-pi-font-size">
                                        {e?.city} {e?.pinCode}
                                      </SoftTypography>
                                      <SoftTypography className="add-pi-font-size">{e?.country}</SoftTypography>
                                    </div>
                                  </div>

                                  <hr />
                                </SoftBox>
                              );
                            })}
                          </SoftBox>
                        </SoftBox>
                      </MobileDrawerCommon>
                    )}
                  </Grid>
                </Grid>
              )}

              {/* OTHER DETAILS */}
              <Grid container spacing={3} mt={1}>
                <Grid item xs={12} sm={3} md={3} xl={3}>
                  <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                    <SoftTypography fontWeight="bold" fontSize="13px">
                      Purchase order value
                    </SoftTypography>
                  </SoftBox>
                  <SoftInput
                    type="number"
                    value={purchaseInfo.poValue || ''}
                    onChange={(e) => handlePurchaseData(e.target.value, 'poValue')}
                  />
                </Grid>
                <Grid item xs={12} sm={3} md={3} xl={3}>
                  <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                    <SoftTypography fontWeight="bold" fontSize="13px">
                      Purchase order date
                    </SoftTypography>
                  </SoftBox>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      value={dayjs(purchaseInfo?.poDate)}
                      // disablePast
                      views={['year', 'month', 'day']}
                      format="DD-MM-YYYY"
                      onChange={(date) => handlePurchaseData(format(date.$d, 'yyyy-MM-dd'), 'poDate')}
                      sx={{ width: '100% !important' }}
                      className="date-picker-newpi-ui"
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} sm={3} md={3} xl={3}>
                  <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                    <SoftTypography fontWeight="bold" fontSize="13px">
                      Shipment
                    </SoftTypography>
                  </SoftBox>
                  <SoftSelect
                    value={shippingOption.find((option) => option.value === purchaseInfo.shipment) || ''}
                    onChange={(option) => handlePurchaseData(option.value, 'shipment')}
                    options={shippingOption}
                  />
                </Grid>
                <Grid item xs={12} sm={3} md={3} xl={3}>
                  <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                    <SoftTypography fontWeight="bold" fontSize="13px">
                      Payment due date
                    </SoftTypography>
                  </SoftBox>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      value={dayjs(purchaseInfo?.paymentDueDate)}
                      disablePast
                      views={['year', 'month', 'day']}
                      format="DD-MM-YYYY"
                      onChange={(date) => handlePurchaseData(format(date.$d, 'yyyy-MM-dd'), 'paymentDueDate')}
                      sx={{ width: '100% !important' }}
                      className="date-picker-newpi-ui"
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} sm={3} md={3} xl={3}>
                  <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                    <SoftTypography fontWeight="bold" fontSize="13px">
                      Payment mode
                    </SoftTypography>
                  </SoftBox>
                  <SoftSelect
                    onChange={(e) => setPaymentMode(e.value)}
                    value={paymentModeOption.find((option) => option.value == paymentMode) || ''}
                    options={paymentModeOption}
                  />
                </Grid>
                <Grid item xs={12} sm={3} md={3} xl={3}>
                  <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                    <SoftTypography fontWeight="bold" fontSize="13px">
                      Shipment date
                    </SoftTypography>
                  </SoftBox>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      value={dayjs(purchaseInfo?.shipmentDate)}
                      disablePast
                      views={['year', 'month', 'day']}
                      format="DD-MM-YYYY"
                      onChange={(date) => handlePurchaseData(format(date.$d, 'yyyy-MM-dd'), 'shipmentDate')}
                      sx={{ width: '100% !important' }}
                      className="date-picker-newpi-ui"
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} sm={3} md={3} xl={3}>
                  <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                    <SoftTypography fontWeight="bold" fontSize="13px">
                      Payment link
                    </SoftTypography>
                  </SoftBox>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      //   padding: '10px',
                      gap: '10px',
                      marginTop: isLinkIncluded ? '0px' : '10px',
                      alignItems: 'center',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isLinkIncluded}
                      onChange={(e) => setIsLinkIncluded(e.target.checked)}
                    />
                    {isLinkIncluded ? (
                      <>
                        <SoftInput
                          placeholder="Enter payment link"
                          value={purchaseInfo.paymentLink || ''}
                          onChange={(e) => handlePurchaseData(e.target.value, 'paymentLink')}
                        />
                      </>
                    ) : (
                      <>
                        <SoftTypography fontSize="13px" fontWeight="medium">
                          Include link
                        </SoftTypography>
                      </>
                    )}
                  </div>
                </Grid>
                <Grid item xs={12} sm={3} md={3} xl={3}>
                  <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                    <SoftTypography fontWeight="bold" fontSize="13px">
                      Tax details
                    </SoftTypography>
                  </SoftBox>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      //   padding: '10px',
                      gap: '10px',
                      marginTop: '10px',
                      alignItems: 'center',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        gap: '5px',
                      }}
                    >
                      <input
                        type="radio"
                        name="gstOption"
                        value="true"
                        checked={inclusiveTax === 'true'}
                        onChange={(e) => handleGSTChange(e.target.value)}
                        style={{ cursor: 'pointer' }}
                      />
                      <SoftTypography mr={1} fontSize="13px" fontWeight="medium">
                        Inclusive
                      </SoftTypography>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        gap: '5px',
                      }}
                    >
                      <input
                        type="radio"
                        name="gstOption"
                        value="false"
                        checked={inclusiveTax === 'false'}
                        onChange={(e) => handleGSTChange(e.target.value)}
                        style={{ cursor: 'pointer' }}
                      />
                      <SoftTypography mr={1} fontSize="13px" fontWeight="medium">
                        Exclusive
                      </SoftTypography>
                    </div>
                  </div>
                </Grid>
              </Grid>
            </div>
          </SoftBox>

          {/* TABLE HEADER */}
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
                <SoftBox display="flex" gap="30px" justifyContent={'flex-start'}>
                  <SoftTypography variant="h6">
                    Add products {rowData?.length > 1 && `(Total Items: ${rowData?.length})`}{' '}
                  </SoftTypography>
                  {deleteItemLoader && <Spinner size={20} />}
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
                              <th className="express-grn-columns">Rate</th>
                              <th className="express-grn-columns">Quantity</th>
                              <th className="express-grn-columns">GST</th>
                              <th className="express-grn-columns">CESS</th>
                              <th className="express-grn-columns">Amount</th>
                              {/* <th className="express-grn-vendor-column">Vendor</th> */}
                              <th className="express-grn-columns">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="express-grn-rows">
                                <SoftBox
                                  className="grn-body-row-boxes-1"
                                  width="100%"
                                  height="40px"
                                  style={{
                                    cursor: 'pointer',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    gap: '10px',
                                  }}
                                >
                                  <InfoOutlinedIcon color="info" style={{ cursor: 'pointer', fontSize: '20px' }} />
                                  <CancelIcon color="error" style={{ cursor: 'pointer', fontSize: '20px' }} />
                                </SoftBox>
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
                                  <SoftInput value="Rate" readOnly={true} />
                                </SoftBox>
                              </td>
                              <td className="express-grn-rows">
                                <SoftBox className="grn-body-row-boxes-1">
                                  <SoftInput value="Quantity" readOnly={true} />
                                </SoftBox>
                              </td>
                              <td className="express-grn-rows">
                                <SoftBox className="grn-body-row-boxes-1">
                                  <SoftSelect />
                                </SoftBox>
                              </td>
                              <td className="express-grn-rows">
                                <SoftBox className="grn-body-row-boxes-1">
                                  <SoftSelect />
                                </SoftBox>
                              </td>
                              <td className="express-grn-rows">
                                <SoftBox className="grn-body-row-boxes-1">
                                  <SoftInput value="Quantity" readOnly={true} />
                                </SoftBox>
                              </td>
                              {/* <td className="express-grn-rows">
                                  <SoftBox className="express-grn-product-box">
                                    <SoftSelect />
                                  </SoftBox>
                                </td> */}
                              <td className="express-grn-rows">
                                <SoftBox
                                  className="grn-body-row-boxes-1"
                                  width="100%"
                                  height="40px"
                                  style={{
                                    cursor: 'pointer',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    gap: '10px',
                                  }}
                                >
                                  <AddIcon color="info" style={{ cursor: 'pointer', fontSize: '20px' }} />
                                  <InfoOutlinedIcon color="info" style={{ cursor: 'pointer', fontSize: '20px' }} />
                                  <CancelIcon color="error" style={{ cursor: 'pointer', fontSize: '20px' }} />
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
          {/* ITEM LISTING */}
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
            <SalesOrderProductList
              rowData={rowData}
              setRowData={setRowData}
              boxRef={boxRef}
              selectedCustomer={selectedCustomer}
              mobileItemAddModal={mobileItemAddModal}
              setMobileItemAddModal={setMobileItemAddModal}
              inclusiveTax={inclusiveTax}
              productSelected={productSelected}
              setProductSelected={setProductSelected}
              cartId={cartId}
              setBillingData={setBillingData}
              deleteLoader={deleteItemLoader}
              setDeleteLoader={setDeleteItemLoader}
              isExtraField={isExtraField}
              setIsExtraField={setIsExtraField}
              additionalList={additionalList}
              setAdditionalList={setAdditionalList}
              billingItems={billingItems}
              setBillingItems={setBillingItems}
              updateBillingData={updateBillingData}
            />
          </SoftBox>
          {/* COMMENT & BILL */}
          <SoftBox p={isMobileDevice ? 2 : 3} className={`create-pi-card ${isMobileDevice && 'po-box-shadow'}`}>
            <Grid container spacing={isMobileDevice ? 1 : 3} justifyContent="space-between">
              <Grid item xs={12} md={6} xl={6} sx={{ marginTop: '-30px' }}>
                <SoftBox className="textarea-box">
                  <SoftTypography fontSize="15px" fontWeight="bold">
                    Add comments
                  </SoftTypography>
                </SoftBox>
                <SoftBox style={{ marginTop: '10px' }}>
                  <TextareaAutosize
                    defaultValue={comment}
                    onChange={(e) => {
                      setComment(e.target.value), setUpdateCart(uuidv4());
                    }}
                    minRows={5}
                    // placeholder="Notes / Memo"
                    className={`add-pi-textarea ${isMobileDevice && 'mobile-textarea-newpi'}`}
                  />
                </SoftBox>
              </Grid>
              <SalesBillingDetailRow
                billingItems={billingItems}
                setIsCredit={handleCreditApplied}
                handleCouponChange={handleCouponChange}
                handleLoyality={handleLoyality}
              />
              <Grid item xs={12} md={6} xl={6}></Grid>
              {!isMobileDevice && (
                <Grid item xs={12} md={6} xl={6}>
                  <SoftBox className="add-po-btns" style={{ gap: '10px' }}>
                    <SoftButton
                      variant={buttonStyles.secondaryVariant}
                      className="outlined-softbutton"
                      onClick={() => {
                        navigate('/sales/all-orders');
                        localStorage.removeItem('cartId-SO');
                        localStorage.removeItem('sales_OrderId');
                      }}
                    >
                      Cancel
                    </SoftButton>
                    <SoftButton
                      variant={buttonStyles.primaryVariant}
                      className="contained-softbutton vendor-add-btn"
                      onClick={handleSaveOrder}
                      disabled={!cartId || saveLoader ? true : false}
                    >
                      {saveLoader ? <CircularProgress size={20} /> : <>Save</>}
                    </SoftButton>
                  </SoftBox>
                </Grid>
              )}
            </Grid>
          </SoftBox>

          {openLoyalityModal && (
            <SalesLoyalityModal
              openLoyalityModal={openLoyalityModal}
              handleClose={handleClose}
              loyalityMessage={loyalityMessage}
              loyalityData={loyalityData}
              cartId={cartId}
              cartDetails={cartDetails}
              loyaltyLoader={loyaltyLoader}
            />
          )}
        </Box>
        {isMobileDevice && (
          <SoftBox
            className="add-po-btns"
            sx={{ gap: '10px', marginRight: '0px !important', paddingBottom: '10px', alignItems: 'unset' }}
          >
            <SoftButton
              variant={buttonStyles.secondaryVariant}
              className="outlined-softbutton"
              onClick={() => {
                navigate('/sales/all-orders');
                localStorage.removeItem('cartId-SO');
                localStorage.removeItem('sales_OrderId');
              }}
            >
              Cancel
            </SoftButton>
            <SoftButton
              variant={buttonStyles.primaryVariant}
              className="contained-softbutton vendor-add-btn"
              onClick={handleSaveOrder}
              disabled={!cartId || saveLoader ? true : false}
            >
              {saveLoader ? <CircularProgress size={20} /> : <>Save</>}
            </SoftButton>
          </SoftBox>
        )}
        {!isMobileDevice ? (
          <>
            <Modal
              open={openDltModal}
              onClose={handleCloseDltModal}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box className="pi-approve-menu">
                <SoftTypography id="modal-modal-title" variant="h6" component="h2">
                  Are you sure you want to delete the order ?
                </SoftTypography>
                <SoftBox className="pi-approve-btns-div" style={{ gap: '10px' }}>
                  <SoftButton className="vendor-second-btn" onClick={handleCloseDltModal}>
                    Cancel
                  </SoftButton>
                  <SoftButton
                    className="vendor-add-btn"
                    onClick={handleDeleteCart}
                    disabled={deleteLoader ? true : false}
                  >
                    {deleteLoader ? <CircularProgress size={20} /> : <>Delete</>}
                  </SoftButton>
                </SoftBox>
              </Box>
            </Modal>
            =
          </>
        ) : (
          <>
            <MobileDrawerCommon
              anchor="bottom"
              paperProps={{ height: 'auto  !important', maxHeight: '90%' }}
              drawerOpen={openDltModal}
              drawerClose={() => setOpenDltModal(false)}
              overflowHidden={true}
            >
              <Box className="pi-approve-menu-1-mobile">
                <SoftTypography id="modal-modal-title" className="reject-title-new-pi" variant="h6" component="h2">
                  Are you sure you want to delete the order ?{' '}
                </SoftTypography>
                <SoftBox className="pi-approve-btns-div-mob" style={{ gap: '10px' }}>
                  <SoftButton className="vendor-second-btn picancel-btn" onClick={() => setOpenDltModal(false)}>
                    Cancel
                  </SoftButton>
                  <SoftButton
                    className="vendor-add-btn picancel-btn"
                    onClick={handleDeleteCart}
                    disabled={deleteLoader ? true : false}
                  >
                    {deleteLoader ? <CircularProgress size={20} /> : <>Delete</>}
                  </SoftButton>
                </SoftBox>
              </Box>
            </MobileDrawerCommon>
          </>
        )}
      </Box>
    </DashboardLayout>
  );
};

export default CreateNewSalesOrder;
