import './index.css';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import {
  Box,
  CircularProgress,
  Divider,
  Grid,
  Modal,
  Stack,
  TextareaAutosize,
  Tooltip,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { buttonStyles } from '../../../Common/buttonColor';
import { format } from 'date-fns';
import { isSmallScreen, productIdByBarcode } from '../../../Common/CommonFunction';
import { statesCode } from '../../../Common/stateFunction';
import { useDebounce } from 'usehooks-ts';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from '../../../../../hooks/SnackbarProvider';
import { v4 as uuidv4 } from 'uuid';
import CloseIcon from '@mui/icons-material/Close';
import DashboardLayout from '../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../examples/Navbars/DashboardNavbar';
import EditIcon from '@mui/icons-material/Edit';
import MobileDrawerCommon from '../../../Common/MobileDrawer';
import MobileNavbar from '../../../../../examples/Navbars/MobileNavbar/mobile-navbar-drawer';
import PreviewIcon from '@mui/icons-material/Preview';
import React, { useEffect, useRef, useState } from 'react';
import SalesBillingDetailRow from '../../../sales-order/new-sales/components/create-sales/components/billingDetail';
import SoftBox from '../../../../../components/SoftBox';
import SoftButton from '../../../../../components/SoftButton';
import SoftInput from '../../../../../components/SoftInput';
import SoftSelect from '../../../../../components/SoftSelect';
import SoftTypography from '../../../../../components/SoftTypography';
import Spinner from '../../../../../components/Spinner';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';
import getCustomerList, {
  additionalInfoPiDetails,
  calculationPurchase,
  editPurchaseIndent,
  getAllVendorDetails,
  getAllVendorSegrgation,
  getAllVendors,
  getBranchAllAdresses,
  getCustomerDetails,
  getPurchaseIndentDetails,
  getVendorAddressForPI,
  getvendorName,
  piToPOConversion,
  previewpurchaseOrder,
  removeVendorfromPIItem,
  saveVendorForPI,
  updatePurchaseorder,
  updatestatuspurchaseorder,
} from '../../../../../config/Services';
import PurchaseOrderMobileCreation from './po-mobile-screen/index';
import SoftAsyncPaginate from '../../../../../components/SoftSelect/SoftAsyncPaginate';

const CreatePurchaseOrder = () => {
  const isMobileDevice = isSmallScreen();
  const showSnackbar = useSnackbar();
  const navigate = useNavigate();
  const orgId = localStorage.getItem('orgId');
  const contextType = localStorage.getItem('contextType');
  const locId = localStorage.getItem('locId');
  const val = localStorage.getItem('user_details');
  const object = JSON.parse(val);
  const { piNum, vendorId } = useParams();
  const [piNumber, poNumber] = piNum.includes('PI')
    ? [piNum, undefined]
    : piNum.includes('PO')
    ? [undefined, piNum]
    : [undefined, undefined];

  const [rowData, setRowData] = useState([]);
  const [previewLoader, setPreviewLoader] = useState(false);
  const [customerId, setCustomerId] = useState(null);
  const [loader, setLoader] = useState(false);
  const [valChange, setValuechange] = useState('');
  const debounceValue = useDebounce(valChange, 700);
  const [billValueChange, setBillValChange] = useState('');
  const debounceBill = useDebounce(billValueChange, 700);
  const [vendorList, setVendorList] = useState([]);
  const [vendorid, setVendorid] = useState('');
  const [vendorName, setVendorName] = useState('');
  const [vendorGST, setVendorGST] = useState('');
  const [vendorPAN, setVendorPAN] = useState('');
  const [viewAddress, setViewAddress] = useState(false);
  const [vendoraddress, setVendoraddress] = useState({});
  const [vendorType, setVendorType] = useState('');
  const [vendorListaddress, setVendorListaddress] = useState([]);
  const [billaddress, setBilladdress] = useState({});
  const [deliveryAddress, setDeliveryAddress] = useState({});
  const [allListAddress, setAllListAddress] = useState([]);
  const [tableRowscustomer, setTableRowscustomer] = useState([]);
  const [custGST, setCustGST] = useState('');
  const [custPAN, setCustPAN] = useState('');
  const [isFixed, setIsFixed] = useState(false);
  const softBoxRef = useRef(null);
  const mobileItemsRef = useRef(null);
  const [comment, setComment] = useState('');
  const [additionalChargeList, setAdditionalChargeList] = useState([]);
  const [isCreditApplied, setIsCreditApplied] = useState(false);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [labourCharge, setLabourCharge] = useState(0);
  const [overAllIgst, setOverAllIgst] = useState(0);
  const [overAllIgstValue, setOverAllIgstValue] = useState(0);
  const [overAllCgst, setOverAllCgst] = useState(0);
  const [overAllCgstValue, setOverAllCgstValue] = useState(0);
  const [overAllSgst, setOverAllSgst] = useState(0);
  const [overAllSgstValue, setOverAllSgstValue] = useState(0);
  const [overAllCess, setOverAllCess] = useState(0);
  const [overAllCessValue, setOverAllCessValue] = useState(0);
  const [taxableValue, setTaxableValue] = useState(0);
  const [totalValue, setTotalValue] = useState(0);
  const [purchaseTerms, setPurchaseTerms] = useState('');
  const [returnAndReplacement, setReturnReplacemnt] = useState('');
  const [allData, setAllData] = useState({});
  const [saveLoader, setSaveLoader] = useState(false);
  const [submitLoader, setSubmitLoader] = useState(false);
  const [vendorCreditNote, setvendorCreditNote] = useState('');
  const [vendorCreditNoteUsed, setvendorCreditNoteUSed] = useState(0);
  const [vendorDebitNote, setvendorDebitNote] = useState('');
  const [vendorReturns, setvendorReturns] = useState('');
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState('');
  const [toggle, setToggle] = useState('org');
  const [defaultAddressIds, setDefaultAddressIds] = useState(null);
  const [isSelectAllChecked, setIsSelectAllChecked] = useState(false);
  const [isSelectAllDisabled, setIsSelectAllDisabled] = useState(false);
  const [searchVendorName, setSearchVendorName] = useState(null);
  const debounceVendorSearch = useDebounce(searchVendorName, 700);
  const [searchedListVendor, setSearchListVendor] = useState([]);
  const [openVendorModal, setOpenVendorModal] = useState(false);
  const [openBillModal, setOpenBillModal] = useState(false);
  const [openShipModal, setOpenShipModal] = useState(false);
  const [searchCustName, setSearchCustName] = useState(null);
  const [searchedListCust, setSearchListCust] = useState([]);
  const [showVendorNotify, setShowVendorNotify] = useState(null);
  // useEffect(() => {
  //   if (rowData?.length > 2 && isMobileDevice) {
  //     // Scroll to the bottom of the div
  //     mobileItemsRef.current.scrollTo({
  //       top: mobileItemsRef.current.scrollHeight,
  //       behavior: 'smooth', // You can change this to 'auto' for instant scrolling
  //     });
  //   }
  // }, [rowData]);

  useEffect(() => {
    if (piNumber) {
      setLoader(true);
      getPIVendorData();
    } else {
      setLoader(true);
      getPoDetail();
    }
  }, []);

  useEffect(() => {
    if (debounceVendorSearch) {
      handleVendorSearch(debounceVendorSearch);
    }
  }, [debounceVendorSearch]);
  useEffect(() => {
    if (piNumber) {
      const allApproved = rowData?.every(
        (item) => item?.isApproved === 'Y' || item?.quantityLeft === 0 || item?.quantityLeft === '0',
      );
      const allQuantityZero = rowData?.every((item) => item?.quantityLeft === 0 || item?.quantityLeft === '0');

      setIsSelectAllChecked(allApproved && !allQuantityZero);
      setIsSelectAllDisabled(allQuantityZero);
    }
  }, [rowData]);

  const billingItems = [
    { label: 'Taxable value', value: taxableValue || 0 },
    {
      label: 'Available Credit',
      isCheckbox: true,
      checked: isCreditApplied,
      value: isCreditApplied ? vendorCreditNoteUsed : vendorCreditNote || 0,
      isDisabled: Number(vendorCreditNote <= 0) ? true : false,
      //handleCreditApplied
      onChange: (e) => handleVendorCredit(e.target.value),
    },
    { label: 'IGST', value: overAllIgstValue || 0 },
    { label: 'CGST', value: overAllCgstValue || 0 },
    { label: 'SGST', value: overAllSgstValue || 0 },
    { label: 'Cess', value: overAllCessValue || 0 },
    {
      label: 'Delivery Charges',
      value: deliveryCharge,
      isInput: true,
      onChange: (e) => {
        setDeliveryCharge(e.target.value);
        setValuechange(e.target.value === '' ? 0 : e.target.value);
      },
    },
    {
      label: 'Labour Charges',
      value: labourCharge,
      isInput: true,
      onChange: (e) => {
        setLabourCharge(e.target.value);
        setValuechange(e.target.value === '' ? 0 : e.target.value);
      },
    },
    { label: 'Total', value: totalValue || 0, isBold: true },
  ].filter(Boolean);

  const getPIVendorData = () => {
    getPurchaseIndentDetails(piNumber)
      .then((res) => {
        if (res?.data?.status === 'SUCCESS') {
          const response = res?.data?.data;
          setAllData(response);
          setExpectedDeliveryDate(response?.expectedDeliveryDate);
        }
      })
      .catch((err) => {
        setLoader(false);
      });
    getAllVendorSegrgation(piNumber)
      .then((res) => {
        if (res?.data?.status === 'SUCCESS') {
          const response = res?.data?.data;
          const updateQuantityAccepted = (items) => {
            return items?.map((item) => ({
              ...item,
              // quantityAccepted: item?.quantityAccepted === 0 ? item?.quantityOrdered : item.quantityAccepted,
            }));
          };
          let otherItems = [];
          if (vendorId === undefined) {
            otherItems = Object.entries(response)
              ?.filter(([key]) => key === '' || key === '0') // Filter out items with an empty string key
              .map(([vendorId, items]) => updateQuantityAccepted(items))
              .flat();
            setRowData(otherItems);
            setLoader(false);
          } else {
            otherItems = Object.entries(response)
              ?.filter(([key]) => key === vendorId) // Filter out items with an empty string key
              .map(([vendorId, items]) => updateQuantityAccepted(items))
              .flat();
            setRowData(otherItems);
            setValuechange(uuidv4());
            getVendorAddressForPI(vendorId, piNumber)
              .then((vendorRes) => {
                setLoader(false);
                if (vendorRes?.data?.status === 'ERROR') {
                  vendorDetails(vendorId, false);
                  setIsAddressPresent(false);
                  return;
                }
                const vendorData = vendorRes?.data?.data?.addresses?.find((ele) => ele?.addressType === 'VENDOR');
                const billData = vendorRes?.data?.data?.addresses?.find((ele) => ele?.addressType === 'BILLING');
                const deliveryData = vendorRes?.data?.data?.addresses?.find((ele) => ele?.addressType === 'DELIVERY');
                setViewAddress(true);
                setVendoraddress({
                  addressId: vendorData?.addressId,
                  addressLine1: vendorData?.line1,
                  addressLine2: vendorData?.line2,
                  country: vendorData?.country,
                  state: vendorData?.state,
                  city: vendorData?.city,
                  pinCode: vendorData?.pinCode,
                  phoneNumber: vendorData?.mobileNumber,
                });
                if (vendorRes?.data?.data?.addresses?.some((ele) => ele?.customerId)) {
                  setCustomerId(billData?.customerId);
                  setToggle('cus');
                  allCustomerList();
                  handlecustomerDetails(billData?.customerId, true);
                } else {
                  setToggle('org');
                  orgAddress(true);
                }
                setBilladdress({
                  id: billData?.addressId,
                  addressLine1: billData?.line1,
                  addressLine2: billData?.line2,
                  country: billData?.country,
                  state: billData?.state,
                  city: billData?.city,
                  pincode: billData?.pinCode,
                  mobileNumber: billData?.mobileNumber,
                  name: billData?.name,
                });
                setDeliveryAddress({
                  id: deliveryData?.addressId,
                  addressLine1: deliveryData?.line1,
                  addressLine2: deliveryData?.line2,
                  country: deliveryData?.country,
                  state: deliveryData?.state,
                  city: deliveryData?.city,
                  pincode: deliveryData?.pinCode,
                  mobileNumber: deliveryData?.mobileNumber,
                  name: deliveryData?.name,
                });
                // setDefaultAddressIds(vendorRes?.data?.data);
                vendorDetails(vendorId, true);
              })
              .catch((err) => {
                setDefaultAddressIds(null);
                vendorDetails(vendorId, false);
                setLoader(false);
              });
          }
        } else {
          setLoader(false);
        }
      })
      .catch((err) => {
        showSnackbar(err?.response?.data?.message || 'Some error occured', 'error');
        setLoader(false);
      });
  };

  const getPoDetail = () => {
    getvendorName(poNumber)
      .then((res) => {
        if (res?.data?.status === 'ERROR') {
          showSnackbar('Some error occured', 'error');
          setLoader(false);
          return;
        }
        const response = res?.data?.data;
        setAllData(response);
        setExpectedDeliveryDate(response?.expectedDeliveryDate);
        setOverAllIgst(response?.igst);
        setOverAllCgst(response?.cgst);
        setOverAllSgst(response?.sgst);
        setOverAllCess(response?.cess);
        setOverAllIgstValue(response?.igstValue);
        setOverAllCgstValue(response?.cgstValue);
        setOverAllSgstValue(response?.sgstValue);
        setOverAllCessValue(response?.cessValue);
        setTaxableValue(response?.taxableValue);
        setTotalValue(response?.grossAmount);
        setPurchaseTerms(response?.paymentMode);
        vendorDetails(response?.vendorId, false, response?.vendorAddressId);
        setIsCreditApplied(response?.creditUsed === 'Y' ? true : false);
        setvendorCreditNote(response?.availableCredit);
        setvendorCreditNoteUSed(response?.creditAmountUsed);
        setComment(response?.comments);
        setAdditionalChargeList(response?.additionalChargeList);
        if (response?.additionalChargeList) {
          const delCharge = response?.additionalChargeList?.find((ele) => ele?.description === 'Delivery Charge');
          const labCharge = response?.additionalChargeList?.find((ele) => ele?.description === 'Labour Charge');
          setDeliveryCharge(delCharge?.amount);
          setLabourCharge(labCharge?.amount);
        }
        const updatedRow = response?.purchaseOrderItems?.map((e) => {
          return {
            ...e,
            id: e?.id,
            itemCode: e?.itemNo,
            itemName: e?.itemName,
            spec: e?.specification,
            finalPrice: e?.unitPrice,
            hsnCode: e?.hsn,
            gst: e?.igst || 0,
            cess: e?.cess || 0,
            previousPurchasePrice: e?.purchasePrice,
            quantityAccepted: e?.quantityOrdered,
            quantityOrdered: e?.quantityOrdered,
            quantityLeft: e?.quantityLeft,
            discount: e?.discount,
            discountType: e?.discountType,
            amount: e?.finalPrice,
          };
        });
        setRowData(updatedRow);
        setLoader(false);

        setToggle(response?.typeOfAddress);
        if (response?.customerId) {
          setCustomerId(response?.customerId);
          setToggle('cus');
          allCustomerList();
          handlecustomerDetails(response?.customerId, false, response?.destinationAddressId, response?.sourceAddressId);
        } else {
          setToggle('org');
          orgAddress(false, response?.destinationAddressId, response?.sourceAddressId);
        }
      })
      .catch((err) => {
        showSnackbar(err?.response?.data?.message || 'Something went wrong!', 'error');
        setLoader(false);
      });
  };

  const listVendors = () => {
    const payload = {
      page: 1,
      pageSize: 100,
      filterVendor: {},
    };
    getAllVendors(payload, orgId)
      .then((res) => {
        const allVendorsList = res?.data?.data?.vendors?.map((item) => {
          return {
            value: item?.vendorId,
            label: item?.vendorName,
          };
        });
        setVendorList(allVendorsList);
      })
      .catch((err) => {
        showSnackbar('Error in fetching vendors', 'error');
      });
  };

  const loadVendorNameOption = async (searchQuery, loadedOptions, { page }) => {
    const paylaod = {
      page: page,
      pageSize: 10,
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
        const data = res?.data?.data?.vendors;
        const allVendorsList = data?.map((item) => {
          return {
            value: item?.vendorId,
            label: item?.vendorName,
          };
        });
        setVendorList(allVendorsList);
        return {
          options: allVendorsList || [],
          hasMore: data?.length >= 10, // If there are 50 items, assume more data is available
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

  const handleVendor = (option) => {
    vendorDetails(option?.value, false);
  };

  function formatString(str) {
    return str
      .toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char?.toUpperCase());
  }

  const vendorDetails = (id, isPresent, addressId) => {
    setViewAddress(true);
    const payload = {
      vendorId: [id],
    };
    getAllVendorDetails(payload)
      .then((res) => {
        if (res?.data?.data?.es) {
          showSnackbar(res?.data?.data?.message, 'error');
          return;
        }
        const response = res?.data?.data?.object[0];
        setSearchVendorName('');
        const returns = response?.vendorReturn?.some((ele) => ele?.flag === true);
        setReturnReplacemnt(returns ? 'YES' : 'NO');
        if (response?.purchaseTerms) {
          const purchaseTerm = [];
          response?.purchaseTerms
            ?.filter((ele) => ele?.flag === true)
            ?.map((ele) => {
              purchaseTerm.push(formatString(ele?.paymentOption));
            });
          setPurchaseTerms(purchaseTerm?.join(', '));
        }

        const address = addressId
          ? response?.addressList?.find((item) => item?.addressId == addressId)
          : response?.addressList?.find((item) => item?.addressType === 'default');
        if (!isPresent) {
          setVendoraddress(address ? address : response?.addressList[0]);
        }
        setVendorType(response?.vendorType);
        setVendorListaddress(response?.addressList);
        setVendorid(response?.vendorId);
        setVendorName(response?.displayName);
        setVendorGST(response?.gst);
        setVendorPAN(response?.pan);
        setvendorCreditNote(response?.availableCredits);
        additionalPiDetails(id);
      })
      .catch((err) => {});
    if (!isPresent) {
      orgAddress();
    }
  };

  const additionalPiDetails = (vendorId) => {
    additionalInfoPiDetails(vendorId).then((res) => {
      if (res?.data?.data?.es === 0) {
        setvendorDebitNote(res?.data?.data?.debitNote);
      }
    });
  };

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

  const handleInputValueChange = (value, fieldName, index) => {
    // if (fieldName === 'quantityAccepted' && piNumber && value > rowData[index]?.quantityLeft) {
    //   showSnackbar('The quantity cannot be greater than the quantity left', 'error');
    //   return;
    // }

    const updatedValue = [...rowData];
    updatedValue[index][fieldName] = value;
    setRowData(updatedValue);
    setValuechange(value);
  };

  useEffect(() => {
    if (debounceValue !== '') {
      billCalculation();
      setValuechange('');
    }
  }, [debounceValue, isCreditApplied, vendorCreditNoteUsed]);

  useEffect(() => {
    if (debounceBill !== '') {
      if (piNumber) {
        editPayload.purchaseIndentItems = puchaseItemList();
        editPIforPO();
      } else {
        editPOData();
      }
      setBillValChange('');
    }
  }, [debounceBill]);

  const billCalculation = () => {
    if (!vendoraddress) {
      showSnackbar('Add vendor address', 'error');
      return;
    }
    if (!billaddress) {
      showSnackbar('Add billing address', 'error');
      return;
    }
    const billItem = rowData
      ?.filter((ele) => ele?.isApproved !== 'N')
      ?.map((ele) => ({
        itemNo: ele?.itemCode,
        quantityOrdered: Number(
          ele?.quantityAccepted === 0 || ele?.quantityAccepted === null ? ele?.quantityLeft : ele?.quantityAccepted,
        ),
        purchasePrice: Number(ele?.previousPurchasePrice),
        unitPrice: Number(ele?.finalPrice),
      }));
    setBillValChange(debounceValue);
    if (billItem?.length === 0) {
      setValuechange('');
      return;
    }
    setValuechange('');
    const payload = {
      sourceLocationId: +statesCode(vendoraddress?.state),
      destinationLocationId: +statesCode(billaddress?.state),
      otherDiscount: isCreditApplied ? Number(vendorCreditNoteUsed) : 0,
      otherDiscountType: isCreditApplied ? 'Rupee' : 'NA',
      storeId: locId,
      items: billItem,
      storeId: locId,
      additionalChargeList: updateChargeList(
        additionalChargeList,
        Number(deliveryCharge),
        Number(labourCharge),
        poNumber,
      ),
    };
    calculationPurchase(payload)
      .then((res) => {
        if (res?.data?.status === 'ERROR') {
          return;
        }
        setTaxableValue(res?.data?.data?.grossAmountWithoutTax);
        setTotalValue(res?.data?.data?.grossAmount);
        setOverAllIgst(response?.igst);
        setOverAllCgst(res?.data?.data?.cgst);
        setOverAllSgst(res?.data?.data?.sgst);
        setOverAllCess(res?.data?.data?.cess);
        setOverAllIgstValue(res?.data?.data?.igstAmount);
        setOverAllCgstValue(res?.data?.data?.cgstAmount);
        setOverAllSgstValue(res?.data?.data?.sgstAmount);
        setOverAllCessValue(res?.data?.data?.cessValue);
        const response = res?.data?.data?.itemPriceDataModels;
        const updatedRowData = rowData?.map((item) => {
          const additionalItem = response?.find((addItem) => addItem?.itemCode === item?.itemCode);
          if (additionalItem) {
            return {
              ...item,
              amount: additionalItem?.finalPrice,
              gst: additionalItem?.gstValue,
              hsnCode: additionalItem?.hsn,
            };
          }
          return item;
        });
        setRowData(updatedRowData);
        setValuechange('');
      })
      .catch((err) => {
        setValuechange('');
        showSnackbar(err?.response?.data?.message);
      });
  };

  const handleDelete = (item, index) => {
    if (item?.isApproved === 'Y' && !piNumber) {
      editPOData();
    } else if (piNumber) {
      const updateRow = [...rowData];
      updateRow.splice(index, 1);
      setRowData(updateRow);
      removeVendorfromPIItem(piNumber, item?.itemCode)
        .then((res) => {})
        .catch((err) => {});
    }
  };

  const handleChangeVendorAdd = (item) => {
    setVendoraddress(item);
    setOpenVendorModal(false);
  };

  const handleChageBillAddress = (item) => {
    setBilladdress(item);
    setOpenBillModal(false);
  };

  const handleChageShipAddress = (item) => {
    setDeliveryAddress(item);
    setOpenShipModal(false);
  };

  const handleorgAdd = (value) => {
    if (value === 'org') {
      orgAddress();
      setCustomerId(null);
    } else {
      allCustomerList();
    }
    setToggle(value);
  };

  const orgAddress = (isPresent, delievryId, billID) => {
    getBranchAllAdresses(locId)
      .then((res) => {
        const response = res?.data?.data;
        if (res?.data?.data?.message === 'ADDRESS_NOT_FOUND') {
          return;
        }
        const addresses = response?.addresses || [];
        const defaultAddress = addresses?.find((item) => item?.defaultAddress === true);
        const defaultBilling = billID
          ? addresses?.find((item) => item?.id == billID)
          : addresses?.find((item) => item?.defaultBilling === true);
        const defaultShipping = delievryId
          ? addresses?.find((item) => item?.id == delievryId)
          : addresses?.find((item) => item?.defaultShipping === true);

        setAllListAddress(addresses);
        if (!isPresent) {
          if (billID && delievryId) {
            setBilladdress(defaultBilling);
            setDeliveryAddress(defaultShipping);

            return;
          }
          if (defaultBilling && !defaultShipping) {
            setBilladdress(defaultBilling);
            setDeliveryAddress(defaultBilling);
          } else if (defaultShipping && !defaultBilling) {
            setBilladdress(defaultShipping);
            setDeliveryAddress(defaultShipping);
          } else if (!defaultBilling && !defaultShipping) {
            setBilladdress(addresses[0]);
            setDeliveryAddress(addresses[0]);
          } else if (defaultAddress) {
            setBilladdress(defaultAddress);
            setDeliveryAddress(defaultAddress);
          } else {
            setBilladdress(defaultBilling);
            setDeliveryAddress(defaultShipping);
          }
        }
      })
      .catch((err) => {});
  };

  const allCustomerList = () => {
    const payload = {
      pageNumber: 0,
      pageSize: 50,
      partnerId: orgId,
      partnerType: 'RETAIL',
    };
    getCustomerList(payload)
      .then((res) => {
        if (res?.data?.status === 'ERROR') {
          showSnackbar('Some error occured', 'error');
          return;
        }
        if (res?.data?.data?.es === 0) {
          let dataArrcustomer,
            dataRowcustomer = [];
          dataArrcustomer = res?.data?.data?.retails;
          dataRowcustomer.push(
            dataArrcustomer?.reverse().map((row) => ({
              value: row.retailId,
              label: row.displayName,
            })),
          );
          setTableRowscustomer(dataRowcustomer[0]);
        }
      })
      .catch((err) => {
        showSnackbar(err?.response?.data?.message || 'Some error occured', 'error');
      });
  };

  const handlecustomerDetails = (value, isPresent, delievryId, billID) => {
    setCustomerId(value);
    getCustomerDetails(value)
      .then((res) => {
        if (res?.data?.data?.es) {
          showSnackbar('No address found', 'error');
          return;
        }
        const response = res?.data?.data?.retail;
        setSearchCustName('');
        setCustGST(response?.gstNumber);
        setCustPAN(response?.panNumber);
        const addresses = response?.addresses || [];
        const defaultAddress = addresses?.find((item) => item?.defaultAddress === true);
        const defaultBilling = billID
          ? addresses?.find((item) => item?.id == billID)
          : addresses?.find((item) => item?.defaultBilling === true);
        const defaultShipping = delievryId
          ? addresses?.find((item) => item?.id == delievryId)
          : addresses?.find((item) => item?.defaultShipping === true);
        setAllListAddress(addresses);
        if (!isPresent) {
          if (billID && delievryId) {
            setBilladdress(defaultBilling);
            setDeliveryAddress(defaultShipping);

            return;
          }
          if (defaultAddress) {
            setBilladdress(defaultAddress);
            setDeliveryAddress(defaultAddress);
          } else {
            if (defaultBilling && !defaultShipping) {
              setBilladdress(defaultBilling);
              setDeliveryAddress(defaultBilling);
            } else if (defaultShipping && !defaultBilling) {
              setBilladdress(defaultShipping);
              setDeliveryAddress(defaultShipping);
            } else if (!defaultBilling && !defaultShipping) {
              setBilladdress(addresses[0]);
              setDeliveryAddress(addresses[0]);
            } else {
              setBilladdress(defaultBilling);
              setDeliveryAddress(defaultShipping);
            }
          }
        }
      })
      .catch((err) => {
        showSnackbar(err?.response?.data?.message || 'Some error occured', 'error');
      });
  };

  const handleSelectAll = (value) => {
    const updatedData = rowData?.map((item) => ({
      ...item,
      isApproved: item?.quantityLeft !== 0 && item?.quantityLeft !== '0' ? (value ? 'Y' : 'N') : item?.isApproved,
    }));
    setRowData(updatedData);
    if (!value) {
      setTaxableValue(0);
      setTotalValue(0);
      setOverAllIgst(0);
      setOverAllCgst(0);
      setOverAllSgst(0);
      setOverAllCess(0);
      setOverAllIgstValue(0);
      setOverAllCgstValue(0);
      setOverAllSgstValue(0);
      setOverAllCessValue(0);
    }
    setValuechange(uuidv4());
  };

  const poItemList = () => {
    const itemList = rowData
      ?.map((row, index) => {
        const {
          quantityAccepted,
          amount,
          updatedOn,
          previousPurchasePrice,
          spec,
          itemCode,
          quantityLeft,
          gst,
          ...rest
        } = row;
        return {
          ...rest,
          itemNo: row?.itemCode,
          itemName: row?.itemName,
          specification: row?.spec,
          poordered: row?.quantityAccepted,
          quantityOrdered: row?.quantityAccepted,
          purchasePrice: row?.previousPurchasePrice,
          unitPrice: row?.finalPrice,
          discount: row?.discount,
          discountType: row?.discountType,
          finalPrice: row?.amount,
          id: row?.id || null,
          igst: piNumber ? row?.igst : row?.gst || 0,
          hsn: row?.hsnCode,
          // quantityLeft: 879,
        };
      })
      .filter(
        (item) =>
          item?.itemNo !== '' &&
          item?.itemName !== '' &&
          item?.itemNo !== null &&
          item?.itemName !== null &&
          item?.itemNo !== undefined &&
          item?.itemName !== undefined,
      );
    if (itemList?.length > 0) {
      return itemList;
    }
    return [];
  };

  const puchaseItemList = () => {
    const itemList = rowData
      ?.map((row, index) => ({
        ...row,
        quantityAccepted:
          row?.isApproved === 'Y' && row?.quantityAccepted === 0 ? row?.quantityLeft : row?.quantityAccepted,
        previousPurchasePrice: row?.previousPurchasePrice,
        unitPrice: row?.finalPrice,
        preferredVendor: vendorName,
        vendorId: row?.isApproved === 'Y' ? vendorid : row?.vendorId || '',
        amount: row?.amount,
        hsnCode: row?.hsnCode,
        isApproved: row?.isApproved,
        igst: row?.igst || 0,
        cgst: row?.cgst || 0,
        sgst: row?.sgst || 0,
        cess: row?.cess || 0,
        previousPurchasePrice: row?.previousPurchasePrice === '' ? 0 : row?.previousPurchasePrice,
        finalPrice: row?.finalPrice === '' ? 0 : row?.finalPrice,
      }))
      .filter(
        (item) =>
          item?.itemCode !== '' &&
          item?.itemName !== '' &&
          item?.itemCode !== null &&
          item?.itemName !== null &&
          item?.itemCode !== undefined &&
          item?.itemName !== undefined,
      );
    if (itemList?.length > 0) {
      return itemList;
    }
    return [];
  };

  const simplifieDestdAddresses = {
    addressLine1: deliveryAddress?.addressLine1,
    addressLine2: deliveryAddress?.addressLine2,
    country: deliveryAddress?.country,
    state: deliveryAddress?.state,
    city: deliveryAddress?.city,
    pincode: deliveryAddress?.pincode,
  };
  const simplifiedSourceAddresses = {
    addressLine1: billaddress?.addressLine1,
    addressLine2: billaddress?.addressLine2,
    country: billaddress?.country,
    state: billaddress?.state,
    city: billaddress?.city,
    pincode: billaddress?.pincode,
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

  function updateChargeList(existingCharges, deliveryCharge, labourCharge, poNumber) {
    const updatedCharges = existingCharges?.map((charge) => {
      if (charge?.description === 'Delivery Charge' && deliveryCharge !== null && deliveryCharge !== undefined) {
        return { ...charge, amount: Number(deliveryCharge) };
      }
      if (charge?.description === 'Labour Charge' && labourCharge !== null && labourCharge !== undefined) {
        return { ...charge, amount: Number(labourCharge) };
      }
      return charge;
    });

    if (
      deliveryCharge !== null &&
      deliveryCharge !== undefined &&
      !updatedCharges?.some((charge) => charge?.description === 'Delivery Charge')
    ) {
      updatedCharges.push({
        description: 'Delivery Charge',
        amount: Number(deliveryCharge),
        poNumber: poNumber,
      });
    }

    if (
      labourCharge !== null &&
      labourCharge !== undefined &&
      !updatedCharges?.some((charge) => charge?.description === 'Labour Charge')
    ) {
      updatedCharges.push({
        description: 'Labour Charge',
        amount: Number(labourCharge),
        poNumber: poNumber,
      });
    }

    return updatedCharges;
  }

  const updatePayload = {
    ...allData,
    expectedDeliveryDate: expectedDeliveryDate,
    destinationAddressId: deliveryAddress?.id,
    destinationLocationId: vendorid,
    destinationLocationName: deliveryAddress?.name,
    destinationLocationAddress: Object.values(simplifieDestdAddresses).join(' '),
    destinationLocationPinCode: deliveryAddress?.pincode,
    destinationStateCode: +statesCode(deliveryAddress?.state),
    destinationType: 'vendor',
    wareHouseId: 'string',
    sourceAddressId: billaddress?.id,
    sourceLocationId: locId,
    sourceLocationName: billaddress?.name,
    sourceLocationAddress: Object.values(simplifiedSourceAddresses).join(' '),
    sourceLocationPinCode: billaddress?.pincode,
    sourceStateCode: +statesCode(billaddress?.state),
    sourceType: contextType.toLowerCase(),
    creditUsed: isCreditApplied ? 'Y' : 'N',
    creditAmountUsed: isCreditApplied ? Number(vendorCreditNoteUsed) : 0,
    availableCredit: Number(vendorCreditNote),
    comments: comment,
    orderedBy: allData?.orderedBy,
    grossAmount: undefined,
    cess: undefined,
    cgst: undefined,
    sgst: undefined,
    igst: undefined,
    cgstValue: undefined,
    sgstValue: undefined,
    igstValue: undefined,
    taxableValue: undefined,
    typeOfAddress: customerId ? 'cus' : 'org',
    vendorAddressId: vendoraddress?.addressId,
    vendorLocationName: vendoraddress?.name,
    vendorLocationAddress: Object.values(simplifiedVendorAddresses).join(' '),
    vendorLocationPinCode: vendoraddress?.pinCode,
    vendorType: vendorType,
    vendorStateCode: +statesCode(vendoraddress?.state),
    poNumber: poNumber,
    customerId: customerId || null,
    additionalChargeList: updateChargeList(
      additionalChargeList,
      Number(deliveryCharge),
      Number(labourCharge),
      poNumber,
    ),
    notifyVendor: false,
  };

  const editPOData = async () => {
    if (!vendoraddress) {
      setSaveLoader(false);
      showSnackbar('Add vendor address', 'error');
      return;
    }
    if (!billaddress) {
      showSnackbar('Add billing address', 'error');
      setSaveLoader(false);
      return;
    }
    if (!deliveryAddress) {
      showSnackbar('Add delivery address', 'error');
      setSaveLoader(false);
      return;
    }
    try {
      updatePayload.purchaseOrderItems = poItemList();
      const res = await updatePurchaseorder(updatePayload);
      if (res?.data?.status === 'ERROR') {
        showSnackbar(res?.data?.message || 'Some error occured', 'error');
        return;
      }
      if (res?.data?.data?.es) {
        showSnackbar(res?.data?.data?.message || 'Some error occured', 'error');
        return;
      }
    } catch (err) {
      showSnackbar(err?.response?.data?.message, 'error');
      setSaveLoader(false);
      return;
    }
  };

  const editPayload = {
    ...allData,
    purchaseIndentNo: piNumber,
    purchaseIndentItems: puchaseItemList(),
    status: null,
    additionalChargeList: updateAdditionalChargeList(Number(deliveryCharge), Number(labourCharge), poNumber),
  };

  const handleSaveExistPO = async () => {
    if (!vendoraddress) {
      setSaveLoader(false);
      showSnackbar('Add vendor address', 'error');
      return;
    }
    if (!billaddress) {
      setSaveLoader(false);
      showSnackbar('Add billing address', 'error');
      return;
    }
    if (!deliveryAddress) {
      setSaveLoader(false);
      showSnackbar('Add delivery address', 'error');
      return;
    }
    if (expectedDeliveryDate === '') {
      setSaveLoader(false);
      showSnackbar('Enter expected delivery date', 'error');
      return;
    }
    const newSwal = Swal.mixin({
      customClass: {
        cancelButton: 'logout-cancel-btn',
        confirmButton: 'logout-success-btn',
        denyButton: 'logout-deny-btn',
      },
      buttonsStyling: false,
    });

    const result = await newSwal.fire({
      text: 'Do you want to send notification to vendor now or later?',
      icon: 'info',
      showCancelButton: true,
      reverseButtons: true,
      confirmButtonText: 'Now',
      cancelButtonText: 'Later',
      allowOutsideClick: false,
    });
    let notifyVendor = false;
    if (result?.isConfirmed) {
      notifyVendor = true;
    }
    setSaveLoader(true);
    // await editPOData(notifyVendor);
    try {
      updatePayload.purchaseOrderItems = poItemList();
      updatePayload.notifyVendor = notifyVendor;
      const res = await updatePurchaseorder(updatePayload);
      if (res?.data?.status === 'ERROR') {
        showSnackbar(res?.data?.message || 'Some error occured', 'error');
        setSaveLoader(false);
        return;
      }
      if (res?.data?.data?.es) {
        showSnackbar(res?.data?.data?.message || 'Some error occured', 'error');
        setSaveLoader(false);
        return;
      }
      if (isMobileDevice) {
        navigate('/purchase/ros-app-purchase?value=purchaseOrder');
        setSaveLoader(false);
      } else {
        navigate('/purchase/purchase-orders');
        setSaveLoader(false);
      }
      setSaveLoader(false);
    } catch (err) {
      showSnackbar(err?.response?.data?.message, 'error');
      setSaveLoader(false);
      return;
    }
  };

  const editPIforPO = async () => {
    try {
      const res = await editPurchaseIndent(editPayload);
      if (res?.data?.status === 'SUCCESS') {
        const response = res?.data?.data;
      }
    } catch (err) {
      showSnackbar(err?.response?.data?.message, 'error');
      setSaveLoader(false);
      return;
    }
    //  finally {
    //   setSaveLoader(false);
    // }
  };

  function updateAdditionalChargeList(deliveryCharge, labourCharge, poNumber) {
    const additionalChargeList = [];

    const charges = [
      { description: 'Delivery Charge', amount: Number(deliveryCharge) },
      { description: 'Labour Charge', amount: Number(labourCharge) },
    ];

    charges?.forEach((charge) => {
      if (charge?.amount) {
        additionalChargeList.push({ ...charge, poNumber });
      }
    });

    return additionalChargeList;
  }

  const piToPO = async (notifyVendor) => {
    if (!vendoraddress) {
      setSaveLoader(false);
      showSnackbar('Add vendor address', 'error');
      return;
    }
    if (!billaddress) {
      showSnackbar('Add billing address', 'error');
      setSaveLoader(false);
      return;
    }
    if (!deliveryAddress) {
      showSnackbar('Add delivery address', 'error');
      setSaveLoader(false);
      return;
    }
    const transformedArray = [
      {
        id: null,
        poNumber: null,
        assignedUidx: allData?.approvedBy,
        assignedName: allData?.approverName,
      },
    ];
    const itemData = rowData
      ?.filter((ele) => ele?.isApproved !== 'N')
      ?.map((row) => {
        return {
          itemNo: row?.itemCode,
          itemName: row?.itemName,
          specification: row?.spec,
          quantityLeft: row?.quantityLeft,
          previousPurchasePrice: row?.previousPurchasePrice,
          poordered: row?.quantityAccepted === 0 ? row?.quantityLeft : row?.quantityAccepted,
          quantityOrdered: row?.quantityAccepted === 0 ? row?.quantityLeft : row?.quantityAccepted,
          preferredVendor: vendorName,
          rate: row?.amount,
          tax: row?.gst,
          unitPrice: row?.finalPrice,
          disabled: false,
          purchasePrice: row?.previousPurchasePrice,
          piNumber: piNumber,
          salesPerWeek: row?.salesPerWeek,
          availableStock: row?.availableStock,
        };
      });
    const payload = {
      poNumber: null,
      piNumber: piNumber,
      epoNumber: null,
      expectedDeliveryDate: expectedDeliveryDate,
      destinationLocationId: vendorid,
      destinationLocationName: deliveryAddress?.name,
      destinationLocationAddress: Object.values(simplifieDestdAddresses).join(' '),
      destinationLocationPinCode: deliveryAddress?.pincode,
      destinationType: 'vendor',
      wareHouseId: 'string',
      sourceLocationId: locId,
      sourceLocationName: billaddress?.name,
      sourceLocationAddress: Object.values(simplifiedSourceAddresses).join(' '),
      sourceLocationPinCode: billaddress?.pincode,
      sourceType: contextType.toLowerCase(),
      orderedBy: object?.uidx,
      // grossAmount: totalValue,
      // cgst: overAllCgst,
      // sgst: overAllSgst,
      // igst: overAllCess,
      currency: 'INR',
      tenantId: '1',
      shippingMethod: '',
      shippingTerms: '',
      creditUsed: isCreditApplied ? 'Y' : 'N',
      creditAmountUsed: isCreditApplied ? Number(vendorCreditNoteUsed) : 0,
      availableCredit: Number(vendorCreditNote),
      vendorId: vendorid,
      vendorName: vendorName,
      comments: comment,
      orgId: orgId,
      paymentTerms: purchaseTerms,
      // cgstValue: overAllCgstValue,
      // sgstValue: overAllSgstValue,
      // igstValue: overAllIgstValue,
      // taxableValue: taxableValue,
      discountValue: 0,
      roundedOff: 0,
      sourceStateCode: +statesCode(billaddress?.state),
      destinationStateCode: +statesCode(deliveryAddress?.state),
      vendorStateCode: +statesCode(vendoraddress?.state),
      vendorLocationName: vendoraddress?.name,
      vendorLocationAddress: Object.values(simplifiedVendorAddresses).join(' '),
      vendorLocationPinCode: vendoraddress?.pinCode,
      vendorType: vendorType,
      gstIncluded: true,
      discount: 0,
      discountType: 'NA',
      discountedBasePrice: 0,
      otherDiscount: 0,
      otherDiscountType: 'string',
      otherDiscountValue: 0,
      totalDiscountValue: 0,
      vendorGstin: vendorGST,
      vendorPan: vendorPAN,
      assignedToList: transformedArray,
      purchaseOrderItems: itemData,
      additionalChargeList: updateAdditionalChargeList(Number(deliveryCharge), Number(labourCharge), poNumber),
      poItemsWithOfferList: [],
      destinationAddressId: deliveryAddress?.id,
      sourceAddressId: billaddress?.id,
      vendorAddressId: vendoraddress?.addressId,
      typeOfAddress: customerId ? 'cus' : 'org',
      customerId: customerId || null,
      returnAndReplacement: returnAndReplacement ? 'Yes' : 'No',
      notifyVendor: notifyVendor,
    };
    try {
      const res = await piToPOConversion(payload);
      if (res?.data?.status === 'ERROR') {
        setSaveLoader(false);
        showSnackbar(res?.data?.message, 'error');
        return;
      }
      const response = res?.data?.data;
      const updateStatusPayload = {
        poNumber: response?.id,
        poStatus: 'ACCEPTED',
        comments: 'string',
        poEvents: 'ACCEPT',
        updatedByUser: object?.uidx,
      };

      try {
        const updateRes = await updatestatuspurchaseorder(updateStatusPayload);
        if (updateRes?.data?.status === 'ERROR') {
          showSnackbar(updateRes?.data?.message, 'error');
          setSaveLoader(false);
          return;
        }
      } catch (err) {
        setSaveLoader(false);
        showSnackbar(err?.response?.data?.message, 'error');
      }

      const updatedItemData = rowData?.map((row, index) => {
        const newPoNumber = row?.poNumber ? row.poNumber.split(',') : [];

        if (response?.id) {
          newPoNumber.push(response?.id);
        }
        const newPoNumberString = newPoNumber?.length > 0 ? newPoNumber?.join(',') : null;
        return {
          ...row,
          quantityLeft:
            row?.isApproved === 'Y'
              ? row?.quantityAccepted === 0
                ? 0
                : row?.quantityLeft - row?.quantityAccepted
              : row?.quantityLeft,
          quantityAccepted: row?.isApproved === 'Y' ? 0 : row?.quantityAccepted,
          isApproved: 'N',
          amount: row?.isApproved === 'Y' ? 0 : row?.amount,
          poNumber: row?.isApproved === 'Y' ? newPoNumberString : row?.poNumber,
        };
      });
      editPayload.purchaseIndentItems = updatedItemData;
      await editPIforPO();
      if (isMobileDevice) {
        navigate('/purchase/ros-app-purchase?value=purchaseOrder');
      } else {
        navigate('/purchase/purchase-orders');
      }
    } catch (err) {
      setSaveLoader(false);
      showSnackbar(err?.response?.data?.message || 'Some error occured', 'error');
    }
  };

  const hadleCreatNewPO = async () => {
    if (expectedDeliveryDate === '') {
      setSaveLoader(false);
      showSnackbar('Enter expected delivery date', 'error');
      return;
    }
    if (!rowData?.some((ele) => ele?.isApproved === 'Y')) {
      setSaveLoader(false);
      showSnackbar('Select a product to create a PO', 'error');
      return;
    }
    if (totalValue < 0) {
      showSnackbar('Total is less than 0. Please enter the correct data', 'error');
      setSaveLoader(false);
      return;
    }
    const payload = {
      piNumber: piNumber,
      vendorId: vendorid,
      addresses: [
        {
          addressId: vendoraddress?.addressId,
          customerId: null,
          addressType: 'VENDOR',
          line1: vendoraddress?.addressLine1,
          line2: vendoraddress?.addressLine2,
          pinCode: vendoraddress?.pinCode,
          city: vendoraddress?.city,
          state: vendoraddress?.state,
          country: vendoraddress?.country,
          mobileNumber: vendoraddress?.phoneNo,
          name: vendoraddress?.name || '',
        },
        {
          addressId: deliveryAddress?.id?.toString(),
          customerId: toggle === 'cus' ? customerId : null,
          addressType: 'DELIVERY',
          line1: deliveryAddress?.addressLine1,
          line2: deliveryAddress?.addressLine2,
          pinCode: deliveryAddress?.pincode,
          city: deliveryAddress?.city,
          state: deliveryAddress?.state,
          country: deliveryAddress?.country,
          mobileNumber: deliveryAddress?.mobileNumber,
          name: deliveryAddress?.name,
        },
        {
          addressId: billaddress?.id?.toString(),
          customerId: toggle === 'cus' ? customerId : null,
          addressType: 'BILLING',
          line1: billaddress?.addressLine1,
          line2: billaddress?.addressLine2,
          pinCode: billaddress?.pincode,
          city: billaddress?.city,
          state: billaddress?.state,
          country: billaddress?.country,
          mobileNumber: billaddress?.mobileNumber,
          name: billaddress?.name,
        },
      ],
    };

    if (isMobileDevice) {
      setShowVendorNotify(payload);
    } else {
      await handleAskVendorNotifyWeb(payload);
    }
  };

  const handleAskVendorNotifyWeb = async (payload) => {
    let notifyVendor = false;
    const newSwal = Swal.mixin({
      customClass: {
        cancelButton: 'logout-cancel-btn',
        confirmButton: 'logout-success-btn',
        denyButton: 'logout-deny-btn',
      },
      buttonsStyling: false,
    });
    const result = newSwal.fire({
      text: 'Do you want to send notification to vendor now or later?',
      icon: 'info',
      showCancelButton: true,
      reverseButtons: true,
      confirmButtonText: 'Now',
      cancelButtonText: 'Later',
      allowOutsideClick: false,
    });
    if (result?.isConfirmed) {
      notifyVendor = true;
    }
    setSaveLoader(true);
    try {
      const res = await saveVendorForPI(payload);
      if (res?.data?.status === 'ERROR') {
        showSnackbar(res?.data?.message || 'Some error occurred', 'error');
        setSaveLoader(false);
        return;
      }
      await piToPO(notifyVendor);
    } catch (err) {
      showSnackbar(err?.response?.data?.message, 'error');
      setSaveLoader(false);
    }
  };

  const handleAskVendorNotifyMobile = async (value) => {
    let notifyVendor = false;
    let payload = showVendorNotify;
    if (value) {
      notifyVendor = true;
    }
    setSaveLoader(true);
    try {
      const res = await saveVendorForPI(payload);
      if (res?.data?.status === 'ERROR') {
        showSnackbar(res?.data?.message || 'Some error occurred', 'error');
        setSaveLoader(false);
        setShowVendorNotify(null);
        return;
      }
      await piToPO(notifyVendor);
    } catch (err) {
      showSnackbar(err?.response?.data?.message, 'error');
      setSaveLoader(false);
      setShowVendorNotify(null);
    }
  };

  const handleEmailTemplate = (e) => {
    if (!vendoraddress) {
      showSnackbar('Add vendor address', 'error');
      return;
    }
    if (!billaddress) {
      showSnackbar('Add billing address', 'error');
      return;
    }
    if (!deliveryAddress) {
      showSnackbar('Add delivery address', 'error');
      return;
    }
    e.stopPropagation();
    const transformedArray = [
      {
        id: null,
        poNumber: null,
        assignedUidx: allData?.approvedBy,
        assignedName: allData?.approverName,
      },
    ];
    const itemData = rowData
      ?.filter((ele) => ele?.isApproved !== 'N')
      ?.map((row) => {
        return {
          itemNo: row?.itemCode,
          itemName: row?.itemName,
          specification: row?.spec,
          quantityLeft: row?.quantityLeft,
          previousPurchasePrice: row?.previousPurchasePrice,
          poordered: row?.quantityAccepted === 0 ? row?.quantityLeft : row?.quantityAccepted,
          quantityOrdered: row?.quantityAccepted === 0 ? row?.quantityLeft : row?.quantityAccepted,
          preferredVendor: vendorName,
          rate: row?.amount,
          tax: row?.gst,
          unitPrice: row?.finalPrice,
          disabled: false,
          purchasePrice: row?.previousPurchasePrice,
          piNumber: piNumber,
          salesPerWeek: row?.salesPerWeek,
          availableStock: row?.availableStock,
        };
      });
    const payload = {
      poNumber: null,
      piNumber: piNumber,
      epoNumber: null,
      expectedDeliveryDate: expectedDeliveryDate,
      destinationLocationId: vendorid,
      destinationLocationName: deliveryAddress?.name,
      destinationLocationAddress: Object.values(simplifieDestdAddresses).join(' '),
      destinationLocationPinCode: deliveryAddress?.pincode,
      destinationType: 'vendor',
      wareHouseId: 'string',
      sourceLocationId: locId,
      sourceLocationName: billaddress?.name,
      sourceLocationAddress: Object.values(simplifiedSourceAddresses).join(' '),
      sourceLocationPinCode: billaddress?.pincode,
      sourceType: contextType.toLowerCase(),
      orderedBy: object?.uidx,
      grossAmount: totalValue,
      cgst: overAllCgst,
      sgst: overAllSgst,
      igst: overAllCess,
      currency: 'INR',
      tenantId: '1',
      shippingMethod: '',
      shippingTerms: '',
      creditUsed: isCreditApplied ? 'Y' : 'N',
      creditAmountUsed: isCreditApplied ? Number(vendorCreditNoteUsed) : 0,
      availableCredit: Number(vendorCreditNote),
      vendorId: vendorid,
      vendorName: vendorName,
      comments: comment,
      orgId: orgId,
      paymentTerms: purchaseTerms,
      cgstValue: overAllCgstValue,
      sgstValue: overAllSgstValue,
      igstValue: overAllIgstValue,
      taxableValue: taxableValue,
      discountValue: 0,
      roundedOff: 0,
      sourceStateCode: +statesCode(billaddress?.state),
      destinationStateCode: +statesCode(deliveryAddress?.state),
      vendorStateCode: +statesCode(vendoraddress?.state),
      vendorLocationName: vendoraddress?.name,
      vendorLocationAddress: Object.values(simplifiedVendorAddresses).join(' '),
      vendorLocationPinCode: vendoraddress?.pinCode,
      vendorType: vendorType,
      gstIncluded: true,
      discount: 0,
      discountType: 'NA',
      discountedBasePrice: 0,
      otherDiscount: 0,
      otherDiscountType: 'string',
      otherDiscountValue: 0,
      totalDiscountValue: 0,
      vendorGstin: vendorGST,
      vendorPan: vendorPAN,
      assignedToList: transformedArray,
      purchaseOrderItems: itemData,
      additionalChargeList: updateAdditionalChargeList(Number(deliveryCharge), Number(labourCharge), poNumber),
      poItemsWithOfferList: [],
      destinationAddressId: deliveryAddress?.id,
      sourceAddressId: billaddress?.id,
      vendorAddressId: vendoraddress?.addressId,
      typeOfAddress: customerId ? 'cus' : 'org',
      customerId: customerId || null,
      returnAndReplacement: returnAndReplacement ? 'Yes' : 'No',
    };
    if (itemData?.length === 0) {
      showSnackbar('Select Products', 'error');
    } else {
      setLoader(true);
      setPreviewLoader(true);
      updatePayload.purchaseOrderItems = poItemList();
      previewpurchaseOrder(piNumber ? payload : updatePayload)
        .then((res) => {
          if (res?.data?.sattus === 'ERROR') {
            showSnackbar(res?.data?.message, 'error');
            return;
          }
          const blob = new Blob([res.data], { type: 'application/pdf' });
          const objectUrl = URL.createObjectURL(blob);
          window.open(objectUrl);
          setPreviewLoader(false);
          setLoader(false);
        })
        .catch((err) => {
          showSnackbar(err?.response?.data?.message || 'Some error occured', 'error');
          setPreviewLoader(false);
          setLoader(false);
        });
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleVendorCheck = (value) => {
    if (value === false) {
      setvendorCreditNoteUSed('0');
      setValuechange('0');
    }
    setIsCreditApplied(value);
  };

  const handleVendorCredit = (value) => {
    if (Number(value) > Number(vendorCreditNote)) {
      showSnackbar('Insuffiecient credit note entered', 'error');
      return;
    }
    setvendorCreditNoteUSed(value);
    setValuechange(value);
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

  // useEffect(() => {
  //   if (rowData?.length > 0) {
  //     const totalEstimate = calCulateTotalEstimate(taxableValue, overAllCgst, overAllSgst, overAllCess);
  //     if (totalEstimate < 0) {
  //       showSnackbar('Total is less than 0. Please enter the correct data', 'error');
  //     }
  //     setTotalValue(totalEstimate);
  //   }
  // }, [isCreditApplied, vendorCreditNoteUsed, deliveryCharge, labourCharge]);

  const handleProductNavigation = async (barcode) => {
    try {
      const productId = await productIdByBarcode(barcode);
      if (productId) {
        navigate(`/products/product/details/${productId}`);
      }
    } catch (error) {}
  };

  const handleVendorSearch = (value) => {
    let payload = {
      page: 0,
      pageSize: 100,
      filterVendor: {
        searchText: value,
      },
    };
    getAllVendors(payload, orgId)
      .then((res) => {
        if (res?.data?.data?.vendors?.length > 0 && res?.data?.status === 'SUCCESS') {
          const allVendorsList = res?.data?.data?.vendors?.map((item) => {
            return {
              value: item?.vendorId,
              label: item?.vendorName,
            };
          });
          setSearchListVendor(allVendorsList);
        } else {
          showSnackbar(`No vendor found for ${debounceVendorSearch} `, 'error');
        }
      })
      .catch((err) => {
        showSnackbar(`No vendor found for ${debounceVendorSearch} `, 'error');
      });
  };

  const handleCustomerSearch = (value) => {
    setSearchCustName(value);
    if (value === '') {
      setSearchListCust([]);
    } else {
      const custList = tableRowscustomer?.filter((item) => item?.label?.toLowerCase()?.includes(value?.toLowerCase()));
      setSearchListCust(custList);
    }
  };
  return (
    <DashboardLayout isMobileDevice={isMobileDevice}>
      {!isMobileDevice && <DashboardNavbar prevLink={true} />}

      {isMobileDevice ? (
        <PurchaseOrderMobileCreation
          piNumber={piNumber}
          poNumber={poNumber}
          toggle={toggle}
          handleorgAdd={handleorgAdd}
          expectedDeliveryDate={expectedDeliveryDate}
          setExpectedDeliveryDate={setExpectedDeliveryDate}
          vendorName={vendorName}
          vendoraddress={vendoraddress}
          billaddress={billaddress}
          deliveryAddress={deliveryAddress}
          rowData={rowData}
          setRowData={setRowData}
          isSelectAllChecked={isSelectAllChecked}
          isSelectAllDisabled={isSelectAllDisabled}
          handleSelectAll={handleSelectAll}
          vendorid={vendorid}
          setValuechange={setValuechange}
          allData={allData}
          handleProductNavigation={handleProductNavigation}
          handleInputValueChange={handleInputValueChange}
          handleDelete={handleDelete}
          handleCancel={handleCancel}
          hadleCreatNewPO={hadleCreatNewPO}
          handleSaveExistPO={handleSaveExistPO}
          saveLoader={saveLoader}
          taxableValue={taxableValue}
          overAllCgstValue={overAllCgstValue}
          overAllSgstValue={overAllSgstValue}
          overAllCessValue={overAllCessValue}
          deliveryCharge={deliveryCharge}
          setDeliveryCharge={setDeliveryCharge}
          labourCharge={labourCharge}
          setLabourCharge={setLabourCharge}
          handleVendorCredit={handleVendorCredit}
          isCreditApplied={isCreditApplied}
          vendorCreditNoteUsed={vendorCreditNoteUsed}
          vendorCreditNote={vendorCreditNote}
          totalValue={totalValue}
          setIsCredit={handleVendorCheck}
          searchedListVendor={searchedListVendor}
          searchVendorName={searchVendorName}
          setSearchVendorName={setSearchVendorName}
          handleVendor={handleVendor}
          openVendorModal={openVendorModal}
          setOpenVendorModal={setOpenVendorModal}
          vendorListaddress={vendorListaddress}
          handleChangeVendorAdd={handleChangeVendorAdd}
          openBillModal={openBillModal}
          setOpenBillModal={setOpenBillModal}
          allListAddress={allListAddress}
          handleChageBillAddress={handleChageBillAddress}
          openShipModal={openShipModal}
          setOpenShipModal={setOpenShipModal}
          handleChageShipAddress={handleChageShipAddress}
          handleCustomerSearch={handleCustomerSearch}
          searchedListCust={searchedListCust}
          searchCustName={searchCustName}
          handlecustomerDetails={handlecustomerDetails}
          vendorId={vendorId}
          loader={loader}
          handleAskVendorNotifyMobile={handleAskVendorNotifyMobile}
          showVendorNotify={showVendorNotify}
          setShowVendorNotify={setShowVendorNotify}
        />
      ) : (
        <Box className="main-box-pi-pre" sx={{ paddingBottom: '10px !important' }}>
          <SoftBox p={3}>
            <SoftBox>
              <Box
                display="flex"
                width="100%"
                alignItems="center"
                justifyContent="space-between"
                // mr={1}
                sx={{ position: 'relative' }}
              >
                <SoftTypography variant="h6" fontWeight="bold">
                  Indent Number {piNumber} - Convert to PO{' '}
                </SoftTypography>

                {loader && <Spinner size={20} />}
                <SoftBox
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: '10px',
                    right: '10px !important',
                    bottom: '-62px !important',
                  }}
                >
                  <SoftButton
                    variant={buttonStyles.primaryVariant}
                    disabled={previewLoader}
                    onClick={handleEmailTemplate}
                    className="vendor-second-btn picancel-btn"
                    //   onClick={handleEmailTemplate}
                  >
                    Preview
                  </SoftButton>
                </SoftBox>
              </Box>
            </SoftBox>
          </SoftBox>
          <SoftBox p={3} className="create-pi-card">
            {!vendorId && piNumber ? (
              <Grid container spacing={3}>
                <Grid item xs={12} md={4} xl={4}>
                  <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                    <SoftTypography
                      component="label"
                      variant="caption"
                      fontWeight="bold"
                      textTransform="capitalize"
                      fontSize="13px"
                    >
                      Select Vendor
                    </SoftTypography>
                  </SoftBox>
                  <SoftAsyncPaginate
                    key="name-select"
                    className="select-box-category"
                    placeholder="Select vendor..."
                    // value={vendorNameOption?.find((ele) => ele?.value === vendorId) || ''}
                    loadOptions={loadVendorNameOption}
                    additional={{
                      page: 1,
                    }}
                    isClearable
                    size="medium"
                    onChange={handleVendor}
                    menuPortalTarget={document.body}
                  />
                  {/* <SoftSelect options={vendorList} onChange={handleVendor} onFocus={listVendors} /> */}
                </Grid>
              </Grid>
            ) : null}
            {viewAddress && (
              <Grid container spacing={3} mt={vendorid ? 0 : 2}>
                <Grid item xs={12} md={4} xl={4}>
                  <div>
                    <span className="po-address-title" style={{ marginLeft: '10px' }}>
                      Vendor details
                    </span>
                  </div>
                  <div
                    className="component-bg-br-sh-p"
                    style={{ marginTop: `${toggle === 'cus' && '15px'}`, maxHeight: '230px', overflowY: 'scroll' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      {/* <span className="po-address-title">Vendor details</span> */}
                      <EditIcon
                        color="info"
                        onClick={() => setOpenVendorModal(true)}
                        style={{ cursor: 'pointer', fontSize: '14px' }}
                      />
                    </div>
                    <div className="address-main-container" style={{ width: '90%', marginTop: '-10px' }}>
                      <div className="address-line-container">
                        <span className="po-address-font">Vendor Name: {vendorName}</span>
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
                      <div className="address-line-container">
                        <span className="po-address-font">GST: {vendorGST}</span>
                      </div>
                      <div className="address-line-container">
                        <span className="po-address-font">PAN: {vendorPAN}</span>
                      </div>
                    </div>
                  </div>
                  <Modal
                    aria-labelledby="unstyled-modal-title"
                    aria-describedby="unstyled-modal-description"
                    open={openVendorModal}
                    onClose={() => {
                      setOpenVendorModal(false);
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
                        overflow: 'auto',
                        maxHeight: '80vh',
                      }}
                    >
                      <Typography id="modal-modal-title" variant="h6" fontWeight="bold" component="h2">
                        Select Vendor Address
                      </Typography>
                      <hr />
                      <SoftBox>
                        {vendorListaddress?.map((e) => {
                          return (
                            <SoftBox key={e?.addressId} onClick={() => handleChangeVendorAdd(e)}>
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
                                  checked={vendoraddress?.addressId === e?.addressId}
                                  onChange={() => handleChangeVendorAdd(e)}
                                  value={e?.addressId}
                                />
                                <div>
                                  <SoftTypography className="add-pi-font-size">{e?.addressLine1}</SoftTypography>
                                  <SoftTypography className="add-pi-font-size">{e?.addressLine2}</SoftTypography>
                                  <SoftTypography className="add-pi-font-size">{e.state}</SoftTypography>
                                  <SoftTypography className="add-pi-font-size">
                                    {e.city} {e.pinCode}
                                  </SoftTypography>
                                  <SoftTypography className="add-pi-font-size">{e.country}</SoftTypography>
                                </div>
                              </div>

                              <hr />
                            </SoftBox>
                          );
                        })}
                      </SoftBox>
                    </Box>
                  </Modal>
                </Grid>
                <Grid item xs={12} md={8} xl={8}>
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        padding: '10px',
                        gap: '20px',
                        marginTop: '-10px',
                      }}
                    >
                      {/* <span className="po-address-title">Purchase billing address</span> */}
                      <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '5px' }}>
                        <input
                          type="radio"
                          name="billing-address"
                          value="org"
                          onChange={() => handleorgAdd('org')}
                          checked={toggle === 'org'}
                          style={{ cursor: 'pointer' }}
                        />
                        <SoftTypography mr={1} fontSize="13px" fontWeight="medium">
                          Organisation
                        </SoftTypography>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '5px' }}>
                        <input
                          type="radio"
                          name="billing-address"
                          value="cus"
                          onChange={() => handleorgAdd('cus')}
                          checked={toggle === 'cus'}
                          style={{ cursor: 'pointer' }}
                        />
                        <SoftTypography mr={1} fontSize="13px" fontWeight="medium">
                          Customer
                        </SoftTypography>
                        {toggle === 'cus' && (
                          <SoftSelect
                            options={tableRowscustomer}
                            value={tableRowscustomer?.find((ele) => ele?.value == customerId || '')}
                            onChange={(e) => {
                              handlecustomerDetails(e.value);
                            }}
                          />
                        )}
                      </div>
                    </div>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6} xl={6}>
                        <div className="component-bg-br-sh-p" style={{ maxHeight: '230px', overflowY: 'scroll' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span className="po-address-title">Purchase billing address</span>
                            <EditIcon
                              color="info"
                              onClick={() => setOpenBillModal(true)}
                              style={{ cursor: 'pointer', fontSize: '14px' }}
                            />
                          </div>
                          <div className="address-main-container" style={{ width: '90%' }}>
                            <div className="address-line-container">
                              <span className="po-address-font">Store Name: {billaddress?.name}</span>
                            </div>
                            <div className="address-line-container">
                              <span className="po-address-font">{billaddress?.addressLine1}</span>
                            </div>
                            <div className="address-line-container">
                              <span className="po-address-font">{billaddress?.addressLine2}</span>
                            </div>
                            <div className="address-line-container">
                              <span className="po-address-font">{billaddress?.city}</span>
                            </div>
                            <div className="address-line-container">
                              <span className="po-address-font">{billaddress?.state}</span>
                            </div>
                            <div className="address-line-container">
                              <span className="po-address-font"> {billaddress?.pincode}</span>
                            </div>
                            <div className="address-line-container">
                              <span className="po-address-font">{billaddress?.country}</span>
                            </div>
                            {toggle === 'cus' && (
                              <>
                                <div className="address-line-container">
                                  <span className="po-address-font">GST: {custGST}</span>
                                </div>
                                <div className="address-line-container">
                                  <span className="po-address-font">PAN: {custPAN}</span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
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
                              // p: 4,
                              overflow: 'auto',
                              maxHeight: '80vh',
                            }}
                          >
                            <Typography id="modal-modal-title" variant="h6" fontWeight="bold" component="h2">
                              Select billing address
                            </Typography>
                            <hr />
                            <SoftBox>
                              {allListAddress?.map((e) => {
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
                                        checked={billaddress?.id == e?.id}
                                        onChange={() => handleChageBillAddress(e)}
                                        value={e?.id}
                                      />
                                      <div>
                                        <SoftTypography className="add-pi-font-size">{e?.name}</SoftTypography>
                                        <SoftTypography className="add-pi-font-size">{e?.addressLine1}</SoftTypography>
                                        <SoftTypography className="add-pi-font-size">{e?.addressLine2}</SoftTypography>
                                        <SoftTypography className="add-pi-font-size">{e.state}</SoftTypography>
                                        <SoftTypography className="add-pi-font-size">
                                          {e.city} {e.pinCode}
                                        </SoftTypography>
                                        <SoftTypography className="add-pi-font-size">{e.country}</SoftTypography>
                                      </div>
                                    </div>

                                    <hr />
                                  </SoftBox>
                                );
                              })}
                            </SoftBox>
                          </Box>
                        </Modal>
                      </Grid>
                      <Grid item xs={12} md={6} xl={6}>
                        <div>{/* <span className="po-address-title">Purchase delivery address</span> */}</div>
                        <div className="component-bg-br-sh-p" style={{ maxHeight: '230px', overflowY: 'scroll' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span className="po-address-title">Purchase delivery address</span>
                            <EditIcon
                              color="info"
                              onClick={() => setOpenShipModal(true)}
                              style={{ cursor: 'pointer', fontSize: '14px' }}
                            />
                          </div>
                          <div className="address-main-container" style={{ width: '90%' }}>
                            <div className="address-line-container">
                              <span className="po-address-font">Store Name: {deliveryAddress?.name}</span>
                            </div>
                            <div className="address-line-container">
                              <span className="po-address-font">{deliveryAddress?.addressLine1}</span>
                            </div>
                            <div className="address-line-container">
                              <span className="po-address-font">{deliveryAddress?.addressLine2}</span>
                            </div>
                            <div className="address-line-container">
                              <span className="po-address-font">{deliveryAddress?.city}</span>
                            </div>
                            <div className="address-line-container">
                              <span className="po-address-font">{deliveryAddress?.state}</span>
                            </div>
                            <div className="address-line-container">
                              <span className="po-address-font"> {deliveryAddress?.pincode}</span>
                            </div>
                            <div className="address-line-container">
                              <span className="po-address-font">{deliveryAddress?.country}</span>
                            </div>
                            {toggle === 'cus' && (
                              <>
                                <div className="address-line-container">
                                  <span className="po-address-font">GST: {custGST}</span>
                                </div>
                                <div className="address-line-container">
                                  <span className="po-address-font">PAN: {custPAN}</span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
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
                              overflow: 'auto',
                              maxHeight: '80vh',
                            }}
                          >
                            <Typography id="modal-modal-title" variant="h6" fontWeight="bold" component="h2">
                              Select delivery address
                            </Typography>
                            <hr />
                            <SoftBox>
                              {allListAddress?.map((e) => {
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
                                        checked={deliveryAddress?.id == e?.id}
                                        onChange={() => handleChageShipAddress(e)}
                                        value={e?.id}
                                      />
                                      <div>
                                        <SoftTypography className="add-pi-font-size">{e?.name}</SoftTypography>
                                        <SoftTypography className="add-pi-font-size">{e?.addressLine1}</SoftTypography>
                                        <SoftTypography className="add-pi-font-size">{e?.addressLine2}</SoftTypography>
                                        <SoftTypography className="add-pi-font-size">{e.state}</SoftTypography>
                                        <SoftTypography className="add-pi-font-size">
                                          {e.city} {e.pinCode}
                                        </SoftTypography>
                                        <SoftTypography className="add-pi-font-size">{e.country}</SoftTypography>
                                      </div>
                                    </div>

                                    <hr />
                                  </SoftBox>
                                );
                              })}
                            </SoftBox>
                          </Box>
                        </Modal>
                      </Grid>
                    </Grid>
                  </div>
                </Grid>
              </Grid>
            )}
            {vendorid && (
              <>
                <Grid
                  container
                  spacing={2}
                  p={2}
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-start"
                >
                  <Grid item xs={12} sm={3} md={3} lg={3}>
                    <div className="vendor-data-headings">Expected delivery date</div>
                    <SoftBox>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          {...(expectedDeliveryDate && {
                            value: expectedDeliveryDate ? dayjs(expectedDeliveryDate) : '',
                          })}
                          disablePast
                          views={['year', 'month', 'day']}
                          format="DD-MM-YYYY"
                          onChange={(date) => setExpectedDeliveryDate(format(date.$d, 'yyyy-MM-dd'))}
                          sx={{
                            width: '100% !important',
                          }}
                          className="po-mob-datepicker"
                        />
                      </LocalizationProvider>
                    </SoftBox>
                  </Grid>
                </Grid>
                <Grid container spacing={2} p={2} direction="row" justifyContent="flex-start" alignItems="flex-start">
                  <Grid item xs={12} sm={2.5} md={2.5} lg={2.5}>
                    <Tooltip title={purchaseTerms || 'NA'}>
                      <div className="vendor-data-headings">Purchase terms</div>
                      <div className="vendor-data-names" style={{ marginLeft: '-3px' }}>
                        {purchaseTerms || 'NA'}
                      </div>
                    </Tooltip>
                  </Grid>
                  <Grid item xs={12} sm={3} md={3} lg={3}>
                    <div className="vendor-data-headings">Returns & replacement</div>
                    <div className="vendor-data-names">{returnAndReplacement ? 'Yes' : 'No'}</div>
                  </Grid>
                  <Grid item xs={12} sm={2.5} md={2.5} lg={2.5}>
                    <div className="vendor-data-headings">Open debit notes</div>
                    <div className="vendor-data-names">{`₹ ${vendorDebitNote || 0}`}</div>
                  </Grid>
                  <Grid item xs={12} sm={2.5} md={2.5} lg={2.5}>
                    <div className="vendor-data-headings">Available credits</div>
                    <div className="vendor-data-names">{`₹ ${vendorCreditNote || 0}`}</div>
                  </Grid>
                  <Grid item xs={12} sm={2} md={2} lg={2}>
                    <div className="vendor-data-headings">Open Returns</div>
                    <div className="vendor-data-names">{`₹ ${vendorReturns || 0}`}</div>
                  </Grid>
                </Grid>
              </>
            )}
          </SoftBox>
          <SoftBox>
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
                <SoftBox display="flex" gap="30px" justifyContent="flex-start">
                  <SoftTypography variant="h6">Items</SoftTypography>
                  {/* {!isMobileDevice && listDisplay && <Spinner size={20} />} */}
                </SoftBox>
                <SoftBox style={{ overflowX: 'scroll', overflowY: 'hidden' }}>
                  <div
                    style={{
                      overflowX: 'scroll',
                      minWidth: '1055px !important',
                    }}
                  >
                    <div>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr>
                            {piNumber && (
                              <th className="po-item-table-header po-item-number-box">
                                <input
                                  type="checkbox"
                                  checked={isSelectAllChecked}
                                  disabled={isSelectAllDisabled}
                                  onClick={(e) => handleSelectAll(e.target.checked)}
                                />
                              </th>
                            )}
                            <th className="po-item-table-header po-item-number-box">S.No</th>
                            <th className="po-item-table-header po-item-gtin-box">Barcode</th>
                            <th className="po-item-table-header po-item-name-box">Title</th>
                            <th className="po-item-table-header po-item-hsn-box">UOM</th>
                            <th className="po-item-table-header po-item-hsn-box">MRP</th>
                            <th className="po-item-table-header po-item-hsn-box">HSN/ SAC</th>
                            <th className="po-item-table-header po-item-hsn-box">GST</th>
                            <th className="po-item-table-header po-item-hsn-box">CESS</th>
                            <th className="po-item-table-header po-item-discount-box">Rate</th>
                            <th className="po-item-table-header po-item-discount-box">Qty</th>
                            {/* <th className="po-item-table-header po-item-discount-box">Discount</th> */}
                            <th className="po-item-table-header po-item-amount-box">Amount</th>
                            {allData?.piType !== 'VENDOR_SPECIFIC' && piNumber && (
                              <th className="po-item-table-header">Action</th>
                            )}
                          </tr>
                        </thead>
                        <tbody style={{ marginTop: '5px' }}>
                          {rowData?.map((row, index) => {
                            const price =
                              row?.previousPurchasePrice &&
                              row?.previousPurchasePrice !== '0' &&
                              row?.previousPurchasePrice !== 0
                                ? parseFloat(row?.previousPurchasePrice)
                                : 0;
                            const amount = row?.quantityOrdered * price;
                            const isGreater = Number(row?.previousPurchasePrice) > Number(row?.finalPrice);
                            const isZero = Number(row?.previousPurchasePrice) === 0;
                            const isLeftQuantZero = row?.quantityLeft === 0 || row?.quantityLeft === '0';
                            return (
                              <tr>
                                {piNumber &&
                                  (isLeftQuantZero ? (
                                    <Tooltip title="0 quantity left, cannot create PO for this item">
                                      <td className="gold-text po-item-table-body">
                                        <input
                                          type="checkbox"
                                          checked={row?.isApproved === 'Y'}
                                          disabled={isLeftQuantZero ? true : false}
                                          onChange={(e) => {
                                            const updatedData = [...rowData];
                                            updatedData[index]['isApproved'] = e.target.checked ? 'Y' : 'N';
                                            setRowData(updatedData);
                                            setValuechange(uuidv4());
                                          }}
                                        />
                                      </td>
                                    </Tooltip>
                                  ) : (
                                    <td className="gold-text po-item-table-body">
                                      <input
                                        type="checkbox"
                                        checked={row?.isApproved === 'Y'}
                                        disabled={vendorid ? false : true}
                                        onChange={(e) => {
                                          const updatedData = [...rowData];
                                          updatedData[index]['isApproved'] = e.target.checked ? 'Y' : 'N';
                                          setRowData(updatedData);
                                          setValuechange(uuidv4());
                                        }}
                                      />
                                    </td>
                                  ))}
                                {/* S.No */}
                                <td className="gold-text po-item-table-body">{index + 1}</td>
                                {/* Barcode */}
                                <td
                                  className="gold-text po-item-table-body"
                                  onClick={() => handleProductNavigation(row?.itemCode)}
                                >
                                  {row?.itemCode}{' '}
                                </td>
                                {/* Title */}
                                <td className="gold-text po-item-table-body">{row?.itemName}</td>
                                {/* UOM */}
                                <td className="gold-text po-item-table-body">{row?.spec}</td>
                                {/* MRP */}
                                <td className="gold-text po-item-table-body">{row?.finalPrice || 0}</td>
                                {/* HSN */}
                                <td className="gold-text po-item-table-body">{row?.hsnCode}</td>
                                {/* GST */}
                                <td className="gold-text po-item-table-body">
                                  {piNumber ? row?.igst || 0 : row?.gst || 0}
                                </td>
                                {/* CESS */}
                                <td className="gold-text po-item-table-body">{row?.cess || 0}</td>
                                {/* Rate */}
                                <td className="po-item-table-body">
                                  {isGreater ? (
                                    <Tooltip title="Rate is greater than MRP">
                                      <SoftBox className="small-input-varient">
                                        <SoftInput
                                          type="number"
                                          className="product-not-added product-aligning"
                                          disabled={row?.isApproved === 'N' ? true : false}
                                          value={price || 0}
                                          onChange={(e) =>
                                            handleInputValueChange(e.target.value, 'previousPurchasePrice', index)
                                          }
                                        />
                                      </SoftBox>
                                    </Tooltip>
                                  ) : isZero ? (
                                    <Tooltip title="Rate is 0">
                                      <SoftBox className="small-input-varient">
                                        <SoftInput
                                          type="number"
                                          className="product-not-added product-aligning"
                                          disabled={row?.isApproved === 'N' ? true : false}
                                          value={price || 0}
                                          onChange={(e) =>
                                            handleInputValueChange(e.target.value, 'previousPurchasePrice', index)
                                          }
                                        />
                                      </SoftBox>
                                    </Tooltip>
                                  ) : (
                                    <SoftBox className="small-input-varient">
                                      <SoftInput
                                        type="number"
                                        className="product-aligning"
                                        disabled={row?.isApproved === 'N' ? true : false}
                                        value={price || 0}
                                        onChange={(e) =>
                                          handleInputValueChange(e.target.value, 'previousPurchasePrice', index)
                                        }
                                      />
                                    </SoftBox>
                                  )}
                                </td>
                                {/* Qty */}
                                <td className="po-item-table-body">
                                  <SoftBox className="small-input-varient">
                                    <SoftInput
                                      type="number"
                                      className="product-aligning"
                                      disabled={row?.isApproved === 'N' || row?.quantityLeft === 0 ? true : false}
                                      value={
                                        row?.quantityLeft === 0
                                          ? row?.quantityLeft
                                          : row?.quantityAccepted === 0 || row?.quantityAccepted === null
                                          ? row?.quantityLeft
                                          : row?.quantityAccepted
                                      }
                                      onChange={(e) =>
                                        handleInputValueChange(e.target.value, 'quantityAccepted', index)
                                      }
                                    />
                                  </SoftBox>
                                </td>
                                {/* Discount */}
                                {/* <td className="po-item-table-body">
                                  <SoftBox className="small-input-varient">
                                    <SoftInput
                                      type="number"
                                      className="product-aligning"
                                      onChange={(e) => handleInputValueChange(e.target.value, 'discount', index)}
                                    />
                                  </SoftBox>
                                </td> */}
                                {/* Amount */}
                                <td className="po-item-table-body">
                                  <SoftBox className="small-input-varient">
                                    <SoftInput
                                      type="number"
                                      className="product-aligning"
                                      disabled
                                      // onChange={(e) => handleInputValueChange(e.target.value, 'amount', index)}
                                      value={row?.amount}
                                    />
                                  </SoftBox>
                                </td>
                                {/* Action */}
                                {allData?.piType !== 'VENDOR_SPECIFIC' && piNumber && (
                                  <td className="po-item-table-body">
                                    <SoftBox onClick={() => handleDelete(row, index)}>
                                      <CloseIcon sx={{ cusrsor: 'pointer' }} />
                                    </SoftBox>
                                  </td>
                                )}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </SoftBox>
              </div>
            </SoftBox>
          </SoftBox>

          <SoftBox p={3} className={`create-pi-card}`}>
            <Grid container spacing={3} justifyContent="space-between">
              <Grid item xs={12} md={6} xl={6} sx={{ marginTop: '-30px' }}>
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
                    className={`add-pi-textarea`}
                  />
                </SoftBox>
              </Grid>
              <SalesBillingDetailRow billingItems={billingItems} setIsCredit={handleVendorCheck} />

              <Grid item xs={12} md={6} xl={6}></Grid>
              <Grid item xs={12} md={6} xl={6}>
                <SoftBox className="add-po-btns" style={{ gap: '10px' }}>
                  <SoftButton
                    variant={buttonStyles.secondaryVariant}
                    className="outlined-softbutton"
                    onClick={handleCancel}
                  >
                    Cancel
                  </SoftButton>
                  <SoftButton
                    variant={buttonStyles.primaryVariant}
                    className="contained-softbutton vendor-add-btn"
                    onClick={piNumber ? hadleCreatNewPO : handleSaveExistPO}
                    disabled={saveLoader ? true : false}
                  >
                    {saveLoader ? <CircularProgress size={20} /> : <>Save</>}
                  </SoftButton>
                </SoftBox>
              </Grid>
            </Grid>
          </SoftBox>
        </Box>
      )}
    </DashboardLayout>
  );
};

export default CreatePurchaseOrder;
