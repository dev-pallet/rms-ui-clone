import './add-po.css';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  CircularProgress,
  Grid,
  InputLabel,
  Modal,
  TextareaAutosize,
  Typography,
} from '@mui/material';
import { buttonStyles } from '../../../Common/buttonColor';
import { useDebounce } from 'usehooks-ts';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from '../../../../../hooks/SnackbarProvider';
import Checkbox from '@mui/material/Checkbox';
import DashboardLayout from '../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../examples/Navbars/DashboardNavbar';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FormControlLabel from '@mui/material/FormControlLabel';
import ProductAdd from './components/ProductAdd';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import SoftBox from '../../../../../components/SoftBox';
import SoftButton from '../../../../../components/SoftButton';
import SoftInput from '../../../../../components/SoftInput';
import SoftSelect from '../../../../../components/SoftSelect';
import SoftTypography from '../../../../../components/SoftTypography';
import Spinner from '../../../../../components/Spinner';
import getCustomerList, {
  createExpressPurchase,
  deleteExpressPurchase,
  expressGrnCreateMetric,
  getAllOrgUsers,
  getAllPurchaseIndent,
  getAllVendors,
  getBranchAllAdresses,
  getCustomerDetails,
  getProductDetails,
  getPurchaseIndentDetails,
  getVendorDetails,
  getVendorVendorCredit,
  itemDetailsExpressPurchase,
  previPurchasePrice,
  purchaseRecommendation,
  spBasedONProductConfig,
  startExpressPurchaseEvent,
} from '../../../../../config/Services';

const POExclusive = () => {
  const [isAccordionExpanded, setIsAccordionExpanded] = useState(true);
  const [vendorIsAccordionExpanded, setVendorIsAccordionExpanded] = useState(false);
  const [orgIsAccordionExpanded, setOrgIsAccordionExpanded] = useState(false);
  const [toggle, setToggle] = useState('org');
  const [loader, setLoader] = useState(false);
  const [dataRows, setTablevendorRows] = useState([]);
  const [gstRows, setGSTRows] = useState([]);
  const [mainItem, setMainItem] = useState('');
  const [subMainItem, setSubMainItem] = useState({ value: 'Select', label: 'Select' });
  const [view, setView] = useState(false);
  const [itemLoader, setItemLoader] = useState(false);
  const [addLoader, setAddLoader] = useState(false);
  const [saveLoader, setSaveLoader] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState(false);
  const [submitLoader, setSumbitLoader] = useState(false);
  const [verifyLoader, setVerifyLoader] = useState(false);
  const [comment, setComment] = useState('');
  const [piNum, setPiNum] = useState('');
  const [piSelected, setPiSelected] = useState(false);
  const [invoiceRefNo, setInvoiceRefNo] = useState('');
  const [invoiceValue, setInvoiceValue] = useState();
  const [invoiceDate, setInvoiceDate] = useState('');
  const [paymentDue, setPaymentDue] = useState('');
  const [vendorCredit, setVendorCredit] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [saveGeneric, setSaveGeneric] = useState(false);
  const debouncedInvoiceValue = useDebounce(invoiceValue, 500);
  const [shouldCallAllVendorList, setShouldCallAllVendorList] = useState(true);
  const [assignUserrow, setassignUser] = useState([]);
  const { jobId } = useParams();
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const contextType = localStorage.getItem('contextType');
  const user_details = JSON.parse(localStorage.getItem('user_details'));
  const uidx = user_details.uidx;
  const epoNumber = localStorage.getItem('epoNumber');
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();

  const filterObject = {
    page: 0,
    pageSize: 0,
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

  let assuser,
    assRow = [];

  // useEffect(() => {
  //   if(!localStorage.getItem('epoNumber')){
  //     allOrgUserList();
  //   }
  // }, []);

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

  let dataArrvendor,
    dataRow = [];
  // useEffect(() => {
  //   if(!localStorage.getItem('epoNumber')){
  //     setLoader(false);
  //     allVendorList();
  //   }
  // }, []);

  let retryCount = 0;
  const allVendorList = () => {
    getAllVendors(filterObject, orgId)
      .then(function (result) {
        if (result.data.data.code === 'ECONNRESET') {
          if (retryCount < 3) {
            allVendorList();
            retryCount++;
          } else {
            showSnackbar('Some Error Occured, Try after some time', 'error');
            setLoader(false);
          }
        } else {
          dataArrvendor = result.data.data;
          dataRow.push(
            dataArrvendor?.vendors
              ?.map((row) => ({
                value: row.vendorId,
                label: row.vendorName,
                gst: row.gstNumber,
                selectBy: 'Name',
              }))
              .sort((a, b) => a.label.localeCompare(b.label)),
          );
          setTablevendorRows(dataRow[0]);
          const gstRow = dataArrvendor?.vendors
            ?.filter((row) => row.gstNumber !== null && row.gstNumber !== '')
            .map((row) => ({
              value: row.vendorId,
              label: row.gstNumber,
              name: row.vendorName,
              selectBy: 'GST',
            }));

          setGSTRows(gstRow || []);
        }
      })
      .catch((err) => {
        if (err.response.status === '429') {
          allVendorList();
        } else {
          showSnackbar(err?.response?.data?.message, 'error');
          setLoader(false);
        }
      });
  };

  useEffect(() => {
    if (vendorIsAccordionExpanded) {
      vendorSelected(vendorId);
    }
  }, [vendorIsAccordionExpanded]);

  useEffect(() => {
    if (orgIsAccordionExpanded) {
      orgAddressData();
    }
  }, [orgIsAccordionExpanded]);

  const [anchorEl1, setAnchorEl1] = useState(null);
  const [anchorEl2, setAnchorEl2] = useState(null);
  const [open1, setOpen1] = useState(false);

  const handleClick1 = (event) => {
    setAnchorEl1(event.currentTarget);
    setOpen1((previousOpen1) => !previousOpen1);
  };

  const [open2, setOpen2] = useState(false);
  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
    setOpen2((previousOpen2) => !previousOpen2);
  };

  const [open3, setOpen3] = useState(false);

  const handleClick3 = (event) => {
    // setAnchorEl1(event.currentTarget);
    setOpen3((previousOpen1) => !previousOpen1);
  };

  const [open4, setOpen4] = useState(false);
  const handleClick4 = (event) => {
    // setAnchorEl2(event.currentTarget);
    setOpen4((previousOpen2) => !previousOpen2);
  };

  const [open5, setOpen5] = useState(false);
  const handleClick5 = (event) => {
    // setAnchorEl2(event.currentTarget);
    setOpen5((previousOpen2) => !previousOpen2);
  };

  const [vendoraddress, setVendoraddress] = useState({});
  const [vendorListaddress, setVendorListaddress] = useState([]);
  const [noBillingAddress, setNoBillingAddress] = useState(false);
  const [billingaddress, setBillingaddress] = useState({});
  const [billingaddress1, setBillingaddress1] = useState({});
  const [allbillingaddress, setAllBillingaddress] = useState([]);
  const [allbillingaddress1, setAllBillingaddress1] = useState([]);
  const [vendorId, setVendorId] = useState('');
  const [newVendorId, setNewVendorId] = useState('');
  const [vendorName, setVendorName] = useState('');
  const [vendorGST, setVendorGST] = useState('');
  const [vendorPAN, setVendorPAN] = useState('');
  const [vendorDisplayName, setVendorDisplayName] = useState('');
  const [newVendorName, setNewVendorDisplayName] = useState('');
  const [vendorType, setVendorType] = useState('');
  const [paymentMode, setPaymenMode] = useState({ value: 'Cash', label: 'Cash' });
  const [discountType, setDiscountType] = useState({ value: '%', label: '%' });
  const [discount, setDiscount] = useState(0);
  const [totalDiscountValue, setTotalDiscountValue] = useState(0);
  const [discountChange, setDiscountChange] = useState(false);
  const debouncedValue = useDebounce(discount, 700);
  const [cess, setCess] = useState(0);
  const [igst, setigst] = useState(0);
  const [sgst, setsgst] = useState(0);
  const [cgst, setcgst] = useState(0);
  const [subTotal, setsubTotal] = useState(0);
  const [total, settotal] = useState(0);
  const [roundOff, setRoundOff] = useState(0);
  const [itemListArray, setItemListArray] = useState([]);
  const itemCount = useMemo(() => itemListArray?.length, [itemListArray]);

  const [barcodeNum, setBarcodeNum] = useState('');
  const [productName, setProductName] = useState('');
  const [expDate, setExpDate] = useState('');
  const [batchno, setBatchNo] = useState('');
  const [mrp, setMrp] = useState('');
  const [quantityRejected, setQuantityRejected] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [previousPurchasePrice, setPreviousPurchasePrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [totalPurchasePrice, setTotalPurchasePrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [specification, setSpecification] = useState('');
  const [epoID, setEpoID] = useState('');
  const [masterSellingPrice, setMasterSellingPrice] = useState('');
  const [listDisplay, setListDisplay] = useState(true);
  const [moreProdAdded, setMoreProdAdded] = useState(false);
  const [inclusiveTax, setInclusiveTax] = useState({ value: 'false', label: 'GST Exclusive' });
  const [inclusiveChange, setInclusiveChange] = useState(false);
  const [cmsIGST, setCMSIgst] = useState('');
  const [flagColor, setFlagColor] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [salesCat, setSalesCat] = useState('');
  const [inventCat, setInventCat] = useState('');
  const [grossProfitCat, setGrossProfitCat] = useState('');
  const [flagAvailableStk, setFlagAvailableStk] = useState('');
  const [stkTurnOver, setStkTurnover] = useState('');
  const [itemCess, setItemCess] = useState('');
  const [itemDiscount, setItemDiscount] = useState('');
  const [itemDiscountType, setItemDiscountType] = useState('');

  // OFFERS & PROMOS
  const [offerId, setOfferId] = useState('');
  const [offers, setOffers] = useState('');
  const [offerType, setOfferType] = useState('');
  const [diffBuyQuantity, setDiffBuyQuantity] = useState('');
  const [offerSubType, setOfferSubType] = useState('');
  const [offerDetailsId, setOfferDetailsId] = useState([['']]);
  const [diffGetBarcodeNum, setDiffGetBarcodeNum] = useState([['']]);
  const [diffGetQuantity, setDiffGetQuantity] = useState('');
  const [inwardedQuantity, setInwardedQuantity] = useState([['']]);
  const [offerDiscount, setOfferDiscount] = useState('');
  const [offerDiscountType, setOfferDiscountType] = useState('');
  const [diffGetProductName, setDiffGetProductName] = useState([['']]);
  const [changedIGST, setChangedIGST] = useState('');
  const [changedCGST, setChangedCGST] = useState('');
  const [changedSGST, setChangedSGST] = useState('');
  const [isChangedIGST, setIsChangedIGST] = useState('false');
  const [isChangedCGST, setIsChangedCGST] = useState('false');
  const [isChangedSGST, setIsChangedSGST] = useState('false');

  const [count, setCount] = useState(0);
  const [fixedCount, setFixedCount] = useState(0);

  const [count2, setCount2] = useState(1);
  const [fixedCount2, setFixedCount2] = useState(0);

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
    setCount(itemCount);
  }, [itemCount]);

  const updateGrnMetrics = (epoId) => {
    const metrics = localStorage.getItem('grnMetrics');
    const localGrnMetrics = metrics ? JSON.parse(metrics) : null;
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
      if (metricIndex !== -1) {
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

  const extractItemListProperty = (response, property, other) =>
    response?.map((item) => (item?.[property] !== null && item?.[property] !== undefined ? item?.[property] : other));

  const extractOfferListProperty = (response, property, other) =>
    response?.map((item) =>
      item?.offers?.[property] !== null && item?.offers?.[property] !== undefined ? item?.offers?.[property] : other,
    );

  const extractOfferDetailListProperty = (response, nestedProperty, other) =>
    response?.map((item) =>
      item?.offers?.offerDetailsList?.map((offer) =>
        offer?.[nestedProperty] !== null && offer?.[nestedProperty] !== undefined ? [offer?.[nestedProperty]] : other,
      ),
    );

  useEffect(() => {
    if (listDisplay || addLoader) {
      if (jobId) {
        listAllDraftExpressPurchase(jobId);
      } else if (epoNumber) {
        listAllDraftExpressPurchase(epoNumber);
      } else {
        // allOrgUserList();
        // allVendorList();
        // allCustomerList();
      }
    }
  }, [listDisplay, addLoader]);

  useEffect(() => {
    return () => {
      if (!saveGeneric) {
        unMountingComponent();
      }
    };
  }, []);

  const unMountingComponent = () => {
    const metrics = localStorage.getItem('grnMetrics');
    const localGrnMetrics = metrics ? JSON.parse(metrics) : null;
    const epoId = jobId ? jobId : epoNumber;
    const currentTime = new Date();
    const timeFormat = `${currentTime.getHours()}:${
      currentTime.getMinutes() < 10 ? '0' : ''
    }${currentTime.getMinutes()}`;
    const metricIndex = localGrnMetrics?.findIndex((metric) => metric?.id === epoId);
    if (metricIndex !== -1) {
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

  const counterApiCalled = (epoId, totalApiTime) => {
    const metrics = localStorage.getItem('grnMetrics');
    const localGrnMetrics = metrics ? JSON.parse(metrics) : null;
    const currentTime = new Date();
    const timeFormat = `${currentTime.getHours()}:${
      currentTime.getMinutes() < 10 ? '0' : ''
    }${currentTime.getMinutes()}`;
    const metricIndex = localGrnMetrics?.findIndex((metric) => metric?.id === epoId);
    if (metricIndex !== -1) {
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
    const localGrnMetrics = metrics ? JSON.parse(metrics) : null;
    const currentTime = new Date();
    const timeFormat = `${currentTime.getHours()}:${
      currentTime.getMinutes() < 10 ? '0' : ''
    }${currentTime.getMinutes()}`;
    const metricIndex = localGrnMetrics?.findIndex((metric) => metric?.id === epoId);
    if (metricIndex !== -1) {
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

  const handleFlagdata = async (itemCode) => {
    const payload = {
      gtin: itemCode,
      locationId: locId,
      orgId: orgId,
    };
    try {
      const res = await purchaseRecommendation(payload);
      if (res?.data?.data === 'SUCCESS') {
        const response = res?.data?.data;
        if (response?.es) {
          setFlagColor((prev) => [...prev, 'NA']);
          setRecommendation((prev) => [...prev, 'NA']);
          setSalesCat((prev) => [...prev, 'NA']);
          setInventCat((prev) => [...prev, 'NA']);
          setGrossProfitCat((prev) => [...prev, 'NA']);
          setStkTurnover((prev) => [...prev, 'NA']);
          setFlagAvailableStk((prev) => [...prev, 'NA']);

          return;
        }
        setFlagColor((prev) => [...prev, response?.productForecast?.flag || 'GREY']);
        setRecommendation((prev) => [...prev, response?.productForecast?.recommendation]);
        setSalesCat((prev) => [...prev, response?.productForecast?.salesCat || 'NA']);
        setInventCat((prev) => [...prev, response?.productForecast?.inventoryCat || 'NA']);
        setGrossProfitCat((prev) => [...prev, response?.productForecast?.grossProfitCat || 'NA']);
        setStkTurnover((prev) => [...prev, response?.productForecast?.stockTurnover]);
        setFlagAvailableStk((prev) => [...prev, response?.productForecast?.availableStock]);
      } else {
        setFlagColor((prev) => [...prev, 'NA']);
        setRecommendation((prev) => [...prev, 'NA']);
        setSalesCat((prev) => [...prev, 'NA']);
        setInventCat((prev) => [...prev, 'NA']);
        setGrossProfitCat((prev) => [...prev, 'NA']);
        setStkTurnover((prev) => [...prev, 'NA']);
        setFlagAvailableStk((prev) => [...prev, 'NA']);
      }
    } catch (err) {
      setFlagColor((prev) => [...prev, 'NA']);
      setRecommendation((prev) => [...prev, 'NA']);
      setSalesCat((prev) => [...prev, 'NA']);
      setInventCat((prev) => [...prev, 'NA']);
      setGrossProfitCat((prev) => [...prev, 'NA']);
      setStkTurnover((prev) => [...prev, 'NA']);
      setFlagAvailableStk((prev) => [...prev, 'NA']);
    }
  };

  const getPreviousPurchsePrice = async (gtin) => {
    try {
      const res = await previPurchasePrice(gtin, orgId);
      const response = res?.data?.data;
      setPreviousPurchasePrice((prev) => [
        ...prev,
        response?.previousPurchasePrice === 'NA' ? 0 : response?.previousPurchasePrice,
      ]);
    } catch (err) {
      setPreviousPurchasePrice((prev) => [...prev, 0]);
    }
  };

  const listAllDraftExpressPurchase = async (epoNumber) => {
    if (!addLoader) {
      updateGrnMetrics(epoNumber);
    }
    setItemLoader(true);
    setListDisplay(false);
    // itemDetailsExpressPurchase(epoNumber)
    try {
      const res = await itemDetailsExpressPurchase(epoNumber);
      if (res?.data?.data?.es === 1) {
        showSnackbar(res?.data?.data?.message, 'error');
        setItemLoader(false);
      } else {
        const response = res?.data?.data?.expressPurchaseOrder;
        setFixedCount(response?.itemList?.length);
        setCount(response?.itemList?.length);
        setItemListArray(response?.itemList);
        setPaymenMode({
          value: response?.paymentMode,
          label: response?.paymentMode,
        });
        setInclusiveTax(
          response?.gstIncluded === true
            ? { value: 'true', label: 'GST Inclusive' }
            : { value: 'false', label: 'GST Exclusive' },
        );
        setVendorGST(response?.vendorGstin || '');
        setVendorPAN(response?.vendorPan || '');
        setVendorId(response?.vendorId || '');
        setVendorDisplayName(response?.vendorName || '');
        setCess(response?.cess);
        setComment(response?.comments);
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
        setsubTotal(response?.taxableValue);
        settotal(response?.grossAmount);
        setRoundOff(response?.roundedOff);
        setView(true);

        setBarcodeNum(extractItemListProperty(response?.itemList, 'itemNo', ''));
        setProductName(extractItemListProperty(response?.itemList, 'itemName', ''));
        setBatchNo(extractItemListProperty(response?.itemList, 'batchNumber', ''));
        setMrp(extractItemListProperty(response?.itemList, 'unitPrice', ''));
        setItemCess(extractItemListProperty(response?.itemList, 'cess', ''));
        setItemDiscount(extractItemListProperty(response?.itemList, 'discount', ''));
        setItemDiscountType(extractItemListProperty(response?.itemList, 'discountType', ''));
        setQuantityRejected(extractItemListProperty(response?.itemList, 'quantityRejected', ''));
        setChangedIGST(extractItemListProperty(response?.itemList, 'gst', ''));
        setChangedCGST(extractItemListProperty(response?.itemList, 'cgst', ''));
        setChangedSGST(extractItemListProperty(response?.itemList, 'sgst', ''));
        if (response?.gstIncluded === true) {
          setPurchasePrice(extractItemListProperty(response?.itemList, 'purchasePrice', ''));
          setTotalPurchasePrice(
            response?.itemList?.map((item) =>
              item?.quantityOrdered !== null &&
              item?.quantityOrdered !== undefined &&
              item?.purchasePrice !== null &&
              item?.purchasePrice !== undefined &&
              item?.purchasePrice !== '' &&
              item?.quantityOrdered !== ''
                ? item?.finalPrice
                : '',
            ),
          );
        } else if (response?.gstIncluded === false) {
          setPurchasePrice(extractItemListProperty(response?.itemList, 'exclusiveTaxPP', ''));
          setTotalPurchasePrice(
            response?.itemList?.map((item) =>
              item?.quantityOrdered !== null &&
              item?.quantityOrdered !== undefined &&
              item?.purchasePrice !== null &&
              item?.purchasePrice !== undefined &&
              item?.purchasePrice !== '' &&
              item?.quantityOrdered !== ''
                ? item?.taxableValue
                : '',
            ),
          );
        }
        setQuantity(extractItemListProperty(response?.itemList, 'quantityOrdered', ''));
        setSellingPrice(extractItemListProperty(response?.itemList, 'sellingPrice', ''));
        setSpecification(extractItemListProperty(response?.itemList, 'specification', ''));
        setEpoID(extractItemListProperty(response?.itemList, 'id', ''));
        setExpDate(extractItemListProperty(response?.itemList, 'expiryDate', ''));
        setMasterSellingPrice(extractItemListProperty(response?.itemList, 'masterSellingPrice', ''));
        setOfferId(extractItemListProperty(response?.itemList, 'offerId', null));
        setCMSIgst(extractItemListProperty(response?.itemList, 'gst', null));

        setDiffBuyQuantity(extractOfferListProperty(response?.itemList, 'buyQuantity', 1));
        setOfferType(extractOfferListProperty(response?.itemList, 'offerType', ''));
        setOfferSubType(extractOfferListProperty(response?.itemList, 'offerSubType', ''));
        setDiffGetQuantity(extractOfferListProperty(response?.itemList, 'offerDetailsList[0]?.getQuantity ', 1));
        setOfferDiscount(extractOfferListProperty(response?.itemList, 'offerDetailsList[0]?.offerDiscount ', null));
        setOfferDiscountType(extractOfferListProperty(response?.itemList, 'offerDetailsList[0]?.discountType ', null));

        setOfferDetailsId(extractOfferDetailListProperty(response?.itemList, 'offerDetailsId', null));
        setDiffGetBarcodeNum(extractOfferDetailListProperty(response?.itemList, 'gtin', null));
        setInwardedQuantity(extractOfferDetailListProperty(response?.itemList, 'inwardedQuantity', null));
        setDiffGetProductName(extractOfferDetailListProperty(response?.itemList, 'itemName', null));

        setOffers(
          response?.itemList?.map((item) =>
            item?.offers !== null && item?.offers !== undefined && item?.offerId !== undefined ? 'true' : 'false',
          ),
        );

        setIsChangedIGST(response?.itemList?.map((item) => (item?.igst !== null ? 'true' : 'false')));
        setIsChangedCGST(response?.itemList?.map((item) => (item?.cgst !== null ? 'true' : 'false')));
        setIsChangedSGST(response?.itemList?.map((item) => (item?.sgst !== null ? 'true' : 'false')));

        // setFlagColor(extractItemListProperty(response?.itemList, 'flagColor', ''));
        // setRecommendation(extractItemListProperty(response?.itemList, 'flagRecommendation', ''));
        // setFlagAvailableStk(extractItemListProperty(response?.itemList, 'availableStock', ''));
        // setStkTurnover(extractItemListProperty(response?.itemList, 'stockTurnover', ''));
        // setInventCat(extractItemListProperty(response?.itemList, 'inventoryData', ''));
        // setSalesCat(extractItemListProperty(response?.itemList, 'salesData', ''));
        // setGrossProfitCat(extractItemListProperty(response?.itemList, 'grossProfitData', ''));
        // setPreviousPurchasePrice(extractItemListProperty(response?.itemList, 'previousPurchasePrice', ''));
        setItemLoader(false);
        setAddLoader(false);

        // allOrgUserList();
        // allVendorList();
        // vendorSelected(response?.vendorId);
        if (response?.expressPOAssignedToList?.length > 0) {
          assignUserDetails(response?.expressPOAssignedToList);
        }
        // for (const item of response?.itemList) {
        //   await getPreviousPurchsePrice(item?.itemNo); // Await here to wait for the previous price to be fetched
        // }

        // for (const item of response?.itemList) {
        //   await handleFlagdata(item?.itemNo); // Await here to wait for the previous price to be fetched
        // }
      }
    } catch (err) {
      setItemLoader(false);
      showSnackbar(err?.response?.data?.message, 'error');
    }
  };
  const handlMainItem = (e) => {
    setMainItem(e.value);
    setSubMainItem({ value: 'Select', label: 'Select' });
    allVendorList();
  };

  const [assignedToLabel, setAssignedToLabel] = useState([]);
  const [assignedTo, setAssignedTo] = useState([]);
  const handleAssignTo = (e) => {
    const epoId = jobId ? jobId : epoNumber;

    const assignUser = [];
    const assignUserLabel = [];

    e.forEach((item) => {
      assignUser.push({
        assignedName: item.label,
        assignedUidx: item.value,
        epoNumber: epoId || null,
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

  const handleBillingAddress = (e) => {
    setLoader(true);
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
  };

  const vendorSelected = (vendorid) => {
    getVendorDetails(orgId, vendorid)
      .then((res) => {
        setVendoraddress(res?.data?.data?.addressList[0]);
        setVendorListaddress(res?.data?.data?.addressList);
        setVendorId(res?.data?.data?.vendorId);
        // setVendorName(res?.data?.data?.vendorName);
        setVendorName(res?.data?.data?.displayName);

        setVendorGST(res?.data?.data?.kycDetails?.gst);
        setVendorPAN(res?.data?.data?.kycDetails?.pan);
        setVendorDisplayName(res?.data?.data?.displayName);
        setVendorType(res?.data?.data?.vendorType);
        setLoader(false);
        getVendorVendorCredit(res?.data?.data?.vendorId)
          .then((res) => {
            setVendorCredit(res?.data?.data?.availableCredits);
          })
          .catch((err) => {});
      })
      .catch((err) => {
        if (err?.response?.data?.message) {
          showSnackbar(err?.response?.data?.message, 'error');
        } else {
          showSnackbar('Some error occured', 'error');
        }
        setLoader(false);
      });
  };

  const orgAddressData = () => {
    if (contextType === 'RETAIL') {
      getBranchAllAdresses(locId)
        .then((res) => {
          if (res?.data?.data?.message === 'ADDRESS_NOT_FOUND') {
            showSnackbar(res?.data?.data?.message, 'error');
            setLoader(false);
            setNoBillingAddress(true);
          } else {
            setBillingaddress(res.data.data.addresses[0]);
            setBillingaddress1(res.data.data.addresses[0]);
            setAllBillingaddress(res.data.data.addresses);
            setAllBillingaddress1(res.data.data.addresses);
            setLoader(false);
          }
        })
        .catch((err) => {
          setLoader(false);
          showSnackbar(err?.response?.data?.message, 'error');
          setLoader(false);
        });
      allCustomerList();
    }
  };

  const [test1, setTest1] = useState([]);
  const [selectedCustShip, setSelectedCustShip] = useState(null);
  const handleToggle1 = (payload) => {
    setSelectedCustShip(payload);
    setBillingaddress({
      addressLine1: payload.addressLine1,
      addressLine2: payload.addressLine2,
      state: payload.state,
      city: payload.city,
      pincode: payload.pincode,
      country: payload.country,
    });
    const select = allbillingaddress.filter((e) => e.id === payload);
    setTest1(select);
    setOpen1(false);
    setOpen4(false);
  };

  const [test2, setTest2] = useState([]);
  const [selectedCustBill, setSelectedCustBill] = useState(null);

  const handleToggle2 = (payload) => {
    setSelectedCustBill(payload);
    setBillingaddress1({
      addressLine1: payload.addressLine1,
      addressLine2: payload.addressLine2,
      state: payload.state,
      city: payload.city,
      pincode: payload.pincode,
      country: payload.country,
    });
    const select = allbillingaddress1.filter((e) => e.id === payload);
    setTest2(select);
    setOpen2(false);
    setOpen3(false);
  };

  const [selectedVendorAdd, setSelectedVendorAdd] = useState(null);
  const handleChangeVendorAdd = (payload) => {
    setSelectedVendorAdd(payload);
    setVendoraddress({
      addressLine1: payload.addressLine1,
      addressLine2: payload.addressLine2,
      state: payload.state,
      city: payload.city,
      pinCode: payload.pinCode,
      country: payload.country,
      phoneNo: payload.phoneNo,
      addressType: payload.addressType,
    });
    setOpen5(false);
  };

  const [showcus, setShowcus] = useState(true);
  const handleAddress = (e) => {
    setBillingaddress('');
    setBillingaddress1('');
    const val = e.target.value;
    if (val === 'org') {
      orgAddressData();
    }
    setToggle(val);
    setShowcus(true);
  };
  const handleAddress1 = (e) => {
    setBillingaddress('');
    setBillingaddress1('');
    const val = e.target.value;
    setToggle(val);
    if (toggle === 'cus') {
      setShowcus(true);
    } else {
      setShowcus(false);
    }
  };

  const [openVendorModal, setOpenVendorModal] = useState(false);
  const handleCloseVendorModal = () => setOpenVendorModal(false);

  const [openGstModal, setOpenGstModal] = useState(false);
  const handleCloseGstModal = () => setOpenGstModal(false);

  const [openModal3, setOpenModal3] = useState(false);
  const handleCloseModal3 = () => setOpenModal3(false);

  const handleDelete = () => {
    setOpenModal3(true);
  };

  const handleEditGST = () => {
    setInclusiveTax(
      inclusiveTax.value === 'false'
        ? { value: 'true', label: 'GST Inclusive' }
        : { value: 'false', label: 'GST Exclusive' },
    );
    setInclusiveChange(true);
  };
  const [reason, setDeleteReason] = useState('');

  const handleDeleteEXPO = () => {
    setDeleteLoader(true);
    handleCloseModal3();
    const payload = {
      userId: uidx,
      reason: reason,
    };
    if (jobId) {
      payload.epoNumber = jobId;
    } else if (epoNumber) {
      payload.epoNumber = epoNumber;
    }

    deleteExpressPurchase(payload)
      .then((res) => {
        if (res?.data?.data?.es === 1) {
          showSnackbar(res?.data?.data?.message, 'error');
        } else {
          const epoId = jobId ? jobId : epoNumber;
          const metrics = localStorage.getItem('grnMetrics');
          const localGrnMetrics = metrics ? JSON.parse(metrics) : null;
          const updatedMetrics = localGrnMetrics?.filter((metric) => metric?.id !== epoId);
          setGrnMetrics(updatedMetrics);
          localStorage.setItem('grnMetrics', JSON.stringify(updatedMetrics));
          showSnackbar('Deleted', 'success');
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

  const [dataRowscustomer, setTableRowscustomer] = useState([]);
  // useEffect(() => {
  //   if(!localStorage.getItem('epoNumber')){
  //     setLoader(true);
  //     allCustomerList();
  //   }
  // }, []);

  let dataArrcustomer,
    dataRowcustomer = [];

  let retryCountCust = 0;
  const allCustomerList = () => {
    let partnerType = '';
    if (contextType === 'RETAIL') {
      partnerType = 'RETAIL';
    } else if (contextType === 'WMS') {
      partnerType = 'WAREHOUSE';
    }
    const payload = {
      pageNumber: 0,
      pageSize: 50,
      partnerId: orgId,
      partnerType: partnerType,
    };
    getCustomerList(payload)
      .then(function (responseTxt) {
        if (responseTxt.data.data.code === 'ECONNRESET') {
          if (retryCountCust < 3) {
            allCustomerList();
            retryCountCust++;
          } else {
            showSnackbar('Some error occured, try after aome time', 'error');
            setLoader(false);
          }
        }
        if (responseTxt.data.data.es === 0) {
          dataArrcustomer = responseTxt.data.data.retails;
          dataRowcustomer.push(
            dataArrcustomer?.reverse().map((row) => ({
              value: row.retailId,
              label: row.displayName,
            })),
          );
          setTableRowscustomer(dataRowcustomer[0]);
        }
        setLoader(false);
      })
      .catch((err) => {
        setLoader(false);
        if (err?.response?.status === '429') {
          allCustomerList();
        }
      });
  };

  const [customeraddress, setCustomeraddress] = useState([]);
  const handlecustomerDetails = (e) => {
    const cusId = e.target.options[e.target.selectedIndex].value;
    getCustomerDetails(cusId)
      .then((res) => {
        setCustomeraddress(res.data.data.retail.addresses);
        setBillingaddress1(res.data.data.retail.addresses[0]);
        setBillingaddress(res.data.data.retail.addresses[0]);
      })
      .catch((err) => {
        setLoader(false);
      });
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-based, so we add 1
    const year = date.getFullYear();

    return `${year}-${month}-${day}`;
  }

  const handleSellingPrice = (itemCode, finalPrice) => {
    spBasedONProductConfig(locId, itemCode, 0, finalPrice)
      .then((res) => {
        if (res?.data?.data?.es === 0) {
          setSellingPrice((prev) => [...prev, res?.data?.data?.data]);
          setMasterSellingPrice((prev) => [...prev, 'automatic']);
        } else if (res?.data?.data?.es === 1) {
          setSellingPrice((prev) => [...prev, '']);
          setMasterSellingPrice((prev) => [...prev, 'manual']);
        }
      })
      .catch((err) => {
        setSellingPrice((prev) => [...prev, '']);
        setMasterSellingPrice((prev) => [...prev, 'manual']);
      });
  };

  const productGST = (itemCode) => {
    getProductDetails(itemCode)
      .then((res) => {
        setCMSIgst((prev) => [...prev, res?.data?.data?.igst]);
        setChangedIGST((prev) => [...prev, res?.data?.data?.igst]);
        setChangedCGST((prev) => [...prev, res?.data?.data?.igst / 2]);
        setChangedSGST((prev) => [...prev, res?.data?.data?.igst / 2]);
        setIsChangedIGST((prev) => [
          ...prev,
          res?.data?.data?.igst !== null || res?.data?.data?.igst !== '' ? 'true' : 'false',
        ]);
        setIsChangedCGST((prev) => [
          ...prev,
          res?.data?.data?.igst !== null || res?.data?.data?.igst !== '' ? 'true' : 'false',
        ]);
        setIsChangedSGST((prev) => [
          ...prev,
          res?.data?.data?.igst !== null || res?.data?.data?.igst !== '' ? 'true' : 'false',
        ]);
      })
      .catch((err) => {
        setCMSIgst((prev) => [...prev, '']);
        setChangedIGST((prev) => [...prev, '']);
        setChangedCGST((prev) => [...prev, '']);
        setChangedSGST((prev) => [...prev, '']);
        setIsChangedIGST((prev) => [...prev, 'false']);
        setIsChangedCGST((prev) => [...prev, 'false']);
        setIsChangedSGST((prev) => [...prev, 'false']);
      });
  };

  const handleVerify = () => {
    setVerifyLoader(true);
    setItemLoader(true);
    // setItemLoader(true);
    const filterObject = {
      orgId: [orgId],
      sourceId: [locId],
      purchaseIndentNo: [piNum],
      deliveryLocation: [],
      requestedOn: '',
      expectedDeliveryDate: '',
      shippingMethod: [],
      costCenter: [],
      status: ['APPROVED'],
      assignedTo: [],
      assignedBy: [],
      createdBy: [],
      user: 'testuser',
    };
    getAllPurchaseIndent(filterObject)
      .then((res) => {
        const response = res?.data?.data?.purchaseIndentRequestList;
        if (response?.length > 0) {
          getPurchaseIndentDetails(response[0]?.purchaseIndentNo)
            .then((dataRes) => {
              setPiSelected(true);
              const itemRes = dataRes?.data?.data;
              setFixedCount((prev) => prev + itemRes?.purchaseIndentItems?.length);
              setCount((prev) => prev + itemRes?.purchaseIndentItems?.length);
              setBarcodeNum((prev) => [
                ...prev,
                ...extractItemListProperty(itemRes?.purchaseIndentItems, 'itemCode', ''),
              ]);
              setProductName((prev) => [
                ...prev,
                ...extractItemListProperty(itemRes?.purchaseIndentItems, 'itemName', ''),
              ]);
              setMrp((prev) => [...prev, ...extractItemListProperty(itemRes?.purchaseIndentItems, 'finalPrice', '')]);
              setSpecification((prev) => [
                ...prev,
                ...extractItemListProperty(itemRes?.purchaseIndentItems, 'spec', ''),
              ]);
              itemRes?.purchaseIndentItems?.forEach((item) => {
                handleSellingPrice(item.itemCode, item.finalPrice);
              });
              itemRes?.purchaseIndentItems?.forEach((item) => {
                productGST(item.itemCode);
              });
              setNewVendorId(itemRes?.purchaseIndentItems[0]?.vendorId);
              setNewVendorDisplayName(itemRes?.purchaseIndentItems[0]?.preferredVendor);

              if (vendorId) {
                if (itemRes?.purchaseIndentItems[0]?.vendorId !== vendorId) {
                  setOpenVendorModal(true);
                }
              } else {
                if (itemRes?.purchaseIndentItems[0]?.vendorId !== '') {
                  vendorSelected(itemRes?.purchaseIndentItems[0]?.vendorId);
                } else {
                  showSnackbar('Please select a vendor', 'warning');
                }
              }
              setView(true);
              setItemLoader(false);
            })
            .catch((err) => {
              setItemLoader(false);
            });
        } else {
          setItemLoader(false);
          showSnackbar('No such approved PI found', 'error');
        }

        setVerifyLoader(false);
        setItemLoader(false);
      })
      .catch((err) => {
        setItemLoader(false);
        setVerifyLoader(false);
        showSnackbar(err?.response?.data?.message, 'error');
      });
  };

  const isMatch = invoiceValue == total;
  const totalStyle = isMatch ? {} : { color: 'red' };

  const statesCode = (state) => {
    if (state) {
      const normalizedState = state.toLowerCase().replace(/\s/g, '');
      switch (normalizedState) {
        case 'andamanandnicobarislands':
          return '35';
        case 'andhrapradesh':
          return '37';
        case 'arunachalpradesh':
          return '12';
        case 'assam':
          return '18';
        case 'bihar':
          return '10';
        case 'chandigarh':
          return '04';
        case 'chhattisgarh':
          return '22';
        case 'dadraandnagarhaveli':
        case 'damananddiu': // Combine these two cases since they share the same code
          return '26';
        case 'delhi':
          return '07';
        case 'goa':
          return '30';
        case 'gujarat':
          return '24';
        case 'haryana':
          return '06';
        case 'himachalpradesh':
          return '02';
        case 'jammuandkashmir':
          return '01';
        case 'jharkhand':
          return '20';
        case 'karnataka':
          return '29';
        case 'kerala':
          return '32';
        case 'ladakh':
          return '38';
        case 'lakshadweep':
          return '31';
        case 'madhyapradesh':
          return '23';
        case 'maharashtra':
          return '27';
        case 'manipur':
          return '14';
        case 'meghalaya':
          return '17';
        case 'mizoram':
          return '15';
        case 'nagaland':
          return '13';
        case 'odisha':
          return '21';
        case 'puducherry':
          return '34';
        case 'punjab':
          return '03';
        case 'rajasthan':
          return '08';
        case 'sikkim':
          return '11';
        case 'tamilnadu':
          return '33'; // Note the change to lowercase here
        case 'telangana':
          return '36';
        case 'tripura':
          return '36'; // Note the change to lowercase here
        case 'uttarpradesh':
          return '09'; // Note the change to lowercase here
        case 'uttarakhand':
          return '05';
        case 'westbengal':
          return '19'; // Note the change to lowercase here
        default:
          return '';
      }
    } else {
      return '';
    }
  };

  const simplifiedAddresses1 = {
    addressLine1: billingaddress?.addressLine1,
    addressLine2: billingaddress?.addressLine2,
    country: billingaddress?.country,
    state: billingaddress?.state,
    city: billingaddress?.city,
    pincode: billingaddress?.pincode,
    mobileNumber: billingaddress?.mobileNumber,
  };
  const simplifiedAddresses2 = {
    addressLine1: billingaddress1?.addressLine1,
    addressLine2: billingaddress1?.addressLine2,
    country: billingaddress1?.country,
    state: billingaddress1?.state,
    city: billingaddress1?.city,
    pincode: billingaddress1?.pincode,
    mobileNumber: billingaddress1?.mobileNumber,
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

  const itemArrayList = Array.from({ length: count }).map((_, index) => {
    const epoId = jobId ? jobId : epoNumber;
    const item = {
      epoNumber: epoId || null,
      id: epoID[index] || null,
      itemNo: barcodeNum[index],
      specification: specification[index],
      quantityOrdered: quantity[index] ? Number(quantity[index]) : 0,
      unitPrice: Number(mrp[index]),
      purchasePrice: Number(parseFloat(purchasePrice[index]).toFixed(3)) || 0,
      exclusiveTaxPP: inclusiveTax.value === 'false' ? Number(parseFloat(purchasePrice[index]).toFixed(3)) || 0 : null,
      batchNumber: batchno[index],
      cess: itemCess[index] || null,
      discount: itemDiscount[index] || null,
      discountType: itemDiscountType[index] || null,
      expiryDate: expDate[index],
      sellingPrice: sellingPrice[index],
      quantityRejected: quantityRejected[index],
      masterSellingPrice: masterSellingPrice[index],
      offerId: offerId[index] || null,
      offers: null,
      igst: isChangedIGST[index] === 'true' && changedIGST[index] !== '' ? Number(changedIGST[index]) : null,
      sgst: isChangedSGST[index] === 'true' && changedSGST[index] !== '' ? Number(changedSGST[index]) : null,
      cgst: isChangedCGST[index] === 'true' && changedCGST[index] !== '' ? Number(changedCGST[index]) : null,
      // flagColor: flagColor[index] || '',
      // flagRecommendation: recommendation[index] || '',
      // availableStock: flagAvailableStk[index] || '',
      // stockTurnover: stkTurnOver[index] || '',
      // inventoryData: inventCat[index] || '',
      // salesData: salesCat[index] || '',
      // grossProfitData: grossProfitCat[index] || '',
      previousPurchasePrice: previousPurchasePrice[index] || '',
    };

    if (
      offerType[index] === 'BUY X GET Y' ||
      offerType[index] === 'OFFER ON MRP' ||
      offerType[index] === 'FREE PRODUCTS'
    ) {
      item.offers = {
        offerId: offerId[index] || null,
        locationId: locId,
        orgId: orgId,
        mainGtin: barcodeNum[index],
        buyQuantity: offerType[index] === 'BUY X GET Y' ? diffBuyQuantity[index] : 1,
        offerName: offerType[index],
        offerType: offerType[index],
        offerSubType: offerType[index] === 'BUY X GET Y' ? offerSubType[index] : null,
        ...(offerId[index] ? { modifiedBy: uidx } : { createdBy: uidx }),
      };

      if (offerType[index] === 'BUY X GET Y' && offerSubType[index] === 'DIFFERENT ITEM') {
        item.offers.offerDetailsList = Array.from({ length: inwardedQuantity[index]?.length })
          .map((_, i) => {
            const currentInwardedQuantity = inwardedQuantity[index]?.flat(Infinity)[i];
            if (currentInwardedQuantity === '' || currentInwardedQuantity === null) {
              return;
            }

            return {
              offerDetailsId: (offerDetailsId[index] && offerDetailsId[index].flat(Infinity)[i]) || null,
              offerId: offerId[index] || null,
              gtin: diffGetBarcodeNum[index] && diffGetBarcodeNum[index].flat(Infinity)[i],
              batchNo: null,
              getQuantity: inwardedQuantity[index]?.length > 1 ? 1 : diffGetQuantity[index],
              inwardedQuantity: currentInwardedQuantity,
              offerDiscount: null,
              discountType: null,
              itemName: diffGetProductName[index] && diffGetProductName[index].flat(Infinity)[i],
            };
          })
          .filter(Boolean);
      } else {
        item.offers.offerDetailsList = [
          {
            offerDetailsId: (offerDetailsId[index] && offerDetailsId[index].flat(Infinity)[0]) || null,
            offerId: offerId[index] || null,
            gtin:
              offerType[index] === 'BUY X GET Y'
                ? diffGetBarcodeNum[index] && diffGetBarcodeNum[index].flat(Infinity)[0]
                : barcodeNum[index],
            batchNo: null,
            getQuantity: offerType[index] === 'BUY X GET Y' ? diffGetQuantity[index] : null,
            inwardedQuantity:
              offerType[index] === 'OFFER ON MRP'
                ? null
                : inwardedQuantity[index] && inwardedQuantity[index].flat(Infinity)[0],
            offerDiscount: offerType[index] === 'OFFER ON MRP' ? offerDiscount[index] : null,
            discountType: offerType[index] === 'OFFER ON MRP' ? offerDiscountType[index] : null,
            itemName:
              offerType[index] === 'BUY X GET Y'
                ? diffGetProductName[index] && diffGetProductName[index].flat(Infinity)[0]
                : productName[index],
          },
        ];
      }
    }

    return item;
  });

  function checkDataValidity(data) {
    for (const obj of data) {
      if (isNaN(obj.unitPrice) || isNaN(obj.purchasePrice)) {
        return false;
      }
    }
    return true;
  }
  const payload = {
    destinationLocationId: vendorId,
    destinationType: 'vendor',
    destinationLocationName: billingaddress?.addressLine1,
    destinationLocationAddress: Object.values(simplifiedAddresses1).join(' '),
    destinationLocationPinCode: billingaddress?.pincode,
    destinationStateCode: +statesCode(billingaddress?.state),
    sourceOrgId: orgId,
    sourceLocationId: locId,
    sourceType: contextType.toLowerCase(),
    sourceLocationName: billingaddress1?.addressLine1,
    sourceLocationAddress: Object.values(simplifiedAddresses2).join(' '),
    sourceLocationPinCode: billingaddress1?.pincode,
    sourceStateCode: +statesCode(billingaddress1?.state),
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
    otherDiscount: discount,
    otherDiscountType: discountType?.value === '%' ? 'percentage' : discountType?.value === 'Rs' ? 'rupee' : 'NA',
    cess: cess,
    roundedOff: roundOff,
    userCreated: localStorage.getItem('user_name'),
    itemList: itemArrayList,
    expressPOAssignedToList: assignedTo,
    gstIncluded: inclusiveTax.value === 'true' ? true : false,
  };

  const handleAddProduct = (sellPrice) => {
    // setAddLoader(true);
    // setItemLoader(true);
    if (!localStorage.getItem('epoNumber')) {
      payload.itemList[0].sellingPrice = sellPrice;
      const apiStartTime = Date.now();
      createExpressPurchase(payload)
        .then((res) => {
          if (res?.data?.data?.es === 1) {
            showSnackbar(res?.data?.data?.message, 'error');
            setItemLoader(false);
            setAddLoader(false);
          } else {
            localStorage.setItem('epoNumber', res?.data?.data?.epoNumber);
            updateGrnMetrics(res?.data?.data?.epoNumber);
            setApiCallCounter((prev) => prev + 1);
            const apiEndTime = Date.now(); // Record the end time upon receiving the response
            const totalApiTime = apiEndTime - apiStartTime;
            counterApiCalled(res?.data?.data?.epoNumber, totalApiTime);
          }
          setAddLoader(false);
          setItemLoader(false);
        })
        .catch((err) => {
          setAddLoader(false);
          setItemLoader(false);
          showSnackbar(err?.response?.data?.message, 'error');
        });
    }
  };

  const handleAddMoreProduct = async () => {
    try {
      const epoId = jobId ? jobId : epoNumber;

      const hasEmptyItemNo = itemArrayList.some((item) => item.itemNo === '');
      if (epoId !== null && !hasEmptyItemNo) {
        payload.epoNumber = epoId;
        const apiStartTime = Date.now();
        const res = await createExpressPurchase(payload);
        const apiEndTime = Date.now(); // Record the end time upon receiving the response
        const totalApiTime = apiEndTime - apiStartTime;
        setApiCallCounter((prev) => prev + 1);
        counterApiCalled(epoId, totalApiTime);
        if (res?.data?.data?.es === 1) {
          setMoreProdAdded(false);
          showSnackbar(res?.data?.data?.message, 'error');
        } else {
          setMoreProdAdded(false);
          const itemRes = await itemDetailsExpressPurchase(epoId);
          if (itemRes?.data?.data?.es === 1) {
            showSnackbar(itemRes?.data?.data?.message, 'error');
            setItemLoader(false);
          } else {
            const response = itemRes?.data?.data?.expressPurchaseOrder;
            setDiscount(response?.otherDiscount);
            setTotalDiscountValue(response?.totalDiscountValue);
            setDiscountType({
              value:
                    response?.otherDiscountType === 'percentage'
                      ? '%'
                      : response?.otherDiscountType === 'rupee'
                        ? 'Rs'
                        : 'NA',
              label:
                    response?.otherDiscountType === 'percentage'
                      ? '%'
                      : response?.otherDiscountType === 'rupee'
                        ? 'Rs'
                        : 'NA',
            });
            setcgst(response?.cgstValue);
            setigst(response?.igstValue);
            setsgst(response?.sgstValue);
            setsubTotal(response?.taxableValue);
            settotal(response?.grossAmount);
            setRoundOff(response?.roundedOff);
            setItemListArray(response?.itemList);

            setEpoID(extractItemListProperty(response?.itemList, 'id', ''));
            setOfferId(extractItemListProperty(response?.itemList, 'offerId', null));
            setChangedIGST(extractItemListProperty(response?.itemList, 'gst', ''));
            setChangedCGST(extractItemListProperty(response?.itemList, 'cgst', ''));
            setChangedSGST(extractItemListProperty(response?.itemList, 'sgst', ''));
            setCMSIgst(extractItemListProperty(response?.itemList, 'gst', ''));
            setInclusiveTax(
              response?.gstIncluded === true
                ? { value: 'true', label: 'GST Inclusive' }
                : { value: 'false', label: 'GST Exclusive' },
            );
            setOffers(
              response?.itemList?.map((item) =>
                item?.offers !== null && item?.offers !== undefined && item?.offerId !== undefined
                  ? 'true'
                  : 'false',
              ),
            );
            setIsChangedIGST(response?.itemList?.map((item) => (item?.igst !== null ? 'true' : 'false')));
            setIsChangedCGST(response?.itemList?.map((item) => (item?.cgst !== null ? 'true' : 'false')));
            setIsChangedSGST(response?.itemList?.map((item) => (item?.sgst !== null ? 'true' : 'false')));
            setDiffBuyQuantity(extractOfferListProperty(response?.itemList, 'buyQuantity', 1));
            setOfferType(extractOfferListProperty(response?.itemList, 'offerType', ''));
            setOfferSubType(extractOfferListProperty(response?.itemList, 'offerSubType', ''));
            setOfferDetailsId(extractOfferDetailListProperty(response?.itemList, 'offerDetailsId', null));
            setDiffGetBarcodeNum(extractOfferDetailListProperty(response?.itemList, 'gtin', null));
            setDiffGetQuantity(
              extractOfferListProperty(response?.itemList, 'offerDetailsList[0]?.getQuantity ', 1),
            );
            setInwardedQuantity(extractOfferDetailListProperty(response?.itemList, 'inwardedQuantity', null));
            setOfferDiscount(
              extractOfferListProperty(response?.itemList, 'offerDetailsList[0]?.offerDiscount ', null),
            );
            setOfferDiscountType(
              extractOfferListProperty(response?.itemList, 'offerDetailsList[0]?.discountType ', null),
            );
            setDiffGetBarcodeNum(extractOfferDetailListProperty(response?.itemList, 'gtin', null));
          }
          setItemLoader(false);
          setAddLoader(false);
            
        }
      }
    } catch (error) {
      // Handle any errors
      setAddLoader(false);
      showSnackbar(error.message, 'error');
    }
  };

  const calculateTotal = () => {
    if (!isChecked) {
      settotal(Number(total) - Number(vendorCredit));
    } else {
      settotal(Number(total) + Number(vendorCredit));
    }
  };

  const assignUserDetails = (inputArray) => {
    // const promises = inputArray?.map((item) =>
    //   getUserFromUidx(item?.assignedUidx)
    //     .then((response) => ({
    //       ...item,
    //       userName: response?.data?.data?.firstName + ' ' + response?.data?.data?.secondName,
    //     }))
    //     .catch((error) => {
    //       return item;
    //     }),
    // );

    // return Promise.all(promises)
    //   .then((resultArray) => {
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
    // })
    // .catch((error) => {
    //   // console.log('err', error);
    //   // showSnackbar('Error processing assigned to:', 'error');
    // });
  };

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked); // Toggle the checkbox state
    calculateTotal(); // Recalculate the total
  };

  const handleDiscountChange = (e) => {
    const inputValue = e.target.value;
    const regex = /^\d*\.?\d{0,2}$/;

    // If the input value matches the regular expression or it's an empty string,
    // update the state with the new value
    if (regex.test(inputValue) || inputValue === '') {
      setDiscount(inputValue);
      // setValue(inputValue);
      if (discountType.value !== 'NA') {
        setDiscountChange(true);
        payload.otherDiscount = inputValue;
        // setTimeout(() => {
        //   billingChange();
        // }, 1000);
      }
    }
  };

  useEffect(() => {
    if (discountChange && debouncedValue) {
      billingChange();
    }
  }, [debouncedValue]);

  const handleDiscountType = (option) => {
    setDiscountType(option);
    if (discount !== 0) {
      payload.otherDiscountType = option?.value === '%' ? 'percentage' : option?.value === 'Rs' ? 'rupee' : 'NA';
      billingChange();
    }
  };

  const billingChange = () => {
    setDiscountChange(false);
    setInclusiveChange(false);
    let epoId = '';
    if (jobId) {
      epoId = jobId;
      payload.epoNumber = jobId;
    } else {
      epoId = epoNumber;
      payload.epoNumber = epoNumber;
    }
    const apiStartTime = Date.now();
    createExpressPurchase(payload)
      .then((res) => {
        const apiEndTime = Date.now(); // Record the end time upon receiving the response
        const totalApiTime = apiEndTime - apiStartTime;
        setApiCallCounter((prev) => prev + 1);
        counterApiCalled(epoId, totalApiTime);
        if (res?.data?.data?.es === 1) {
          showSnackbar(res?.data?.data?.message, 'error');
        } else {
          itemDetailsExpressPurchase(epoId)
            .then((res) => {
              if (res?.data?.data?.es === 1) {
                showSnackbar(res?.data?.data?.message, 'error');
              } else {
                const response = res?.data?.data?.expressPurchaseOrder;
                setCess(response?.cess);
                setComment(response?.comments);
                setInvoiceDate(response?.invoiceDate);
                setInvoiceRefNo(response?.invoiceRefNo);
                setInvoiceValue(response?.invoiceValue);
                setPaymentDue(response?.paymentTerms);
                setDiscount(response?.otherDiscount);
                setTotalDiscountValue(response?.totalDiscountValue);
                setDiscountType({
                  value:
                    response?.otherDiscountType === 'percentage'
                      ? '%'
                      : response?.otherDiscountType === 'rupee'
                        ? 'Rs'
                        : 'NA',
                  label:
                    response?.otherDiscountType === 'percentage'
                      ? '%'
                      : response?.otherDiscountType === 'rupee'
                        ? 'Rs'
                        : 'NA',
                });
                setcgst(response?.cgstValue);
                setsgst(response?.sgstValue);
                setigst(response?.igstValue);
                setsubTotal(response?.taxableValue);
                settotal(response?.grossAmount);
                setRoundOff(response?.roundedOff);
              }
            })
            .catch((err) => {});
        }
      })
      .catch((err) => {
        setMoreProdAdded(false);
        showSnackbar(err?.response?.data?.message, 'error');
      });
  };

  const handleGSTChange = (option) => {
    let epoId = '';
    if (jobId) {
      epoId = jobId;
    } else {
      epoId = epoNumber;
    }
    if (epoId) {
      setOpenGstModal(true);
    } else {
      setInclusiveTax(option);
      setInclusiveChange(true);
    }
  };

  useEffect(() => {
    let epoId = '';
    if (jobId) {
      epoId = jobId;
    } else {
      epoId = epoNumber;
    }
    if (epoId !== null && inclusiveChange) {
      billingChange();
    }
  }, [inclusiveChange]);

  const handleSave = () => {
    const hasDiscountGreaterThan100 = itemArrayList?.some((item) => {
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
    } else if (!checkDataValidity(itemArrayList)) {
      showSnackbar('Please fill all required fields', 'error');
    } else if (hasDiscountGreaterThan100) {
      showSnackbar('Item discount should not be more than 100 %', 'error');
      return;
    } else {
      setSaveLoader(true);
      if (jobId) {
        payload.epoNumber = jobId;
      } else if (epoNumber) {
        payload.epoNumber = epoNumber;
      }
      const apiStartTime = Date.now();
      createExpressPurchase(payload)
        .then((res) => {
          const apiEndTime = Date.now(); // Record the end time upon receiving the response
          const totalApiTime = apiEndTime - apiStartTime;
          const endTime = formattedTime;
          setApiCallCounter((prev) => prev + 1);
          if (res?.data?.data?.es === 1) {
            setSaveLoader(false);
            showSnackbar(res?.data?.data?.message, 'error');
            counterApiCalled(jobId ? jobId : epoNumber, totalApiTime);
          } else {
            localStorage.removeItem('epoNumber');
            navigate('/purchase/express-grn');
            saveGrnMetric(jobId ? jobId : epoNumber, totalApiTime);
          }
        })
        .catch((err) => {
          setSaveLoader(false);
          setMoreProdAdded(false);
          showSnackbar(err?.response?.data?.message, 'error');
        });
    }
  };
  const handleCreateMetric = (itemCount) => {
    const epoId = jobId ? jobId : epoNumber;
    const metrics = localStorage.getItem('grnMetrics');
    const localGrnMetrics = metrics ? JSON.parse(metrics) : null;
    let totalTime = '';
    let averageSkuDuration = '';
    let totalSkuCount = '';
    const metricIndex = localGrnMetrics?.findIndex((metric) => metric?.id === epoId);
    if (metricIndex !== -1) {
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

  const handleSubmit = () => {
    const hasDiscountGreaterThan100 = itemArrayList?.some((item) => {
      const discount = parseFloat(item?.discount);
      const discountType = item?.discountType;

      if (discountType === 'percentage' && !isNaN(discount) && discount > 100) {
        return true;
      }

      return false;
    });

    const hasEmptyItemNo = itemArrayList?.some((item) => item?.itemNo === '');
    if (!jobId && !epoNumber) {
      showSnackbar('Select Product', 'warning');
    } else if (assignedTo?.length < 1) {
      showSnackbar('Select Assigned To', 'warning');
    } else if (
      Number(invoiceValue) != Number(total) &&
      Number(invoiceValue) !== Number(total) - Number(roundOff) &&
      Number(invoiceValue) !== Number(total) + Number(roundOff)
    ) {
      showSnackbar('Invoice value is not equal to Total amount', 'warning');
    } else if (discount !== 0 && discountType.value === 'NA') {
      showSnackbar('Select Discount Type', 'warning');
    } else if (hasEmptyItemNo) {
      showSnackbar('Remove empty products', 'warning');
    } else if (hasDiscountGreaterThan100) {
      showSnackbar('Item discount should not be more than 100 %', 'error');
    } else {
      setSumbitLoader(true);
      if (jobId) {
        payload.epoNumber = jobId;
      } else if (epoNumber) {
        payload.epoNumber = epoNumber;
      }
      const apiStartTime = Date.now();
      createExpressPurchase(payload)
        .then((res) => {
          const apiEndTime = Date.now(); // Record the end time upon receiving the response
          const totalApiTime = apiEndTime - apiStartTime;
          setApiCallCounter((prev) => prev + 1);
          if (res?.data?.data?.es === 1) {
            setSumbitLoader(false);
            showSnackbar(res?.data?.data?.message, 'error');
            counterApiCalled(jobId ? jobId : epoNumber, totalApiTime);
          } else {
            saveGrnMetric(jobId ? jobId : epoNumber, totalApiTime);
            itemDetailsExpressPurchase(jobId ? jobId : epoNumber)
              .then((res) => {
                if (res?.data?.data?.es === 1) {
                  showSnackbar(res?.data?.data?.message, 'error');
                } else {
                  const response = res?.data?.data?.expressPurchaseOrder?.itemList;
                  handleCreateMetric(response?.length);

                  const payload1 = {
                    requestedBy: uidx,
                    reqSourceType: contextType,
                  };
                  if (jobId) {
                    payload1.epoNumber = jobId;
                  } else if (epoNumber) {
                    payload1.epoNumber = epoNumber;
                  }
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
              .catch((err) => {});
          }
        })
        .catch((err) => {
          setSumbitLoader(false);
          showSnackbar(err?.response?.data?.message, 'error');
        });
    }
  };

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

  return (
    <DashboardLayout>
      <DashboardNavbar prevLink={true} />

      <Box className="main-box-pi-pre">
        <SoftBox p={3} className="create-pi-card">
          {/* {loader && <Spinner />} */}
          <Accordion expanded={isAccordionExpanded}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              onClick={() => setIsAccordionExpanded(!isAccordionExpanded)}
            >
              <Box display="flex" width="100%" justifyContent="flex-end">
                {/* {loader && <Spinner />} */}

                <Grid container spacing={3} mt={-2}>
                  <Grid item xs={8} md={6} xl={4}>
                    <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                      <SoftTypography
                        component="label"
                        variant="caption"
                        fontWeight="bold"
                        textTransform="capitalize"
                        fontSize="13px"
                      >
                        Express GRN details
                      </SoftTypography>
                    </SoftBox>
                  </Grid>
                </Grid>
                {/* <Grid item xs={8} md={6} xl={4}>
                  <SoftButton
                    className="vendor-second-btn"
                    // onClick={handleEmailTemplate}
                    style={{ marginLeft: '10px' }}
                  >
                    Attachment <DriveFolderUploadIcon sx={{ marginLeft: '20px' }} />
                  </SoftButton>
                </Grid> */}
              </Box>
              <AccordionDetails></AccordionDetails>
            </AccordionSummary>

            <Grid container spacing={3} mt={-2} sx={{ padding: '10px' }}>
              <Grid item xs={6} md={3} xl={3} mr={3}>
                <SoftTypography
                  component="label"
                  variant="caption"
                  // fontWeight="bold"
                  textTransform="capitalize"
                  fontSize="13px"
                >
                  Select Vendor By
                  <span style={{ color: 'red', marginLeft: '5px', fontSize: '17px' }}> *</span>
                </SoftTypography>
                <SoftSelect
                  options={[
                    { value: 'Name', label: 'Name' },
                    { value: 'GST', label: 'GST' },
                  ]}
                  onChange={(e) => handlMainItem(e)}
                />
              </Grid>
              {mainItem && (
                <Grid item xs={6} md={6} xl={6}>
                  <SoftTypography
                    component="label"
                    variant="caption"
                    // fontWeight="bold"
                    textTransform="capitalize"
                    fontSize="13px"
                  >
                    Search by {mainItem}
                    <span style={{ color: 'red', marginLeft: '5px', fontSize: '17px' }}> *</span>
                  </SoftTypography>
                  {mainItem === 'Name' ? (
                    <SoftSelect value={subMainItem} options={dataRows} onChange={handleBillingAddress} />
                  ) : mainItem === 'GST' ? (
                    <SoftSelect value={subMainItem} options={gstRows} onChange={handleBillingAddress} />
                  ) : null}
                </Grid>
              )}
              <Grid item xs={12} md={12} xl={12}>
                <Grid container spacing={3}>
                  <Grid item xs={8} md={4} xl={3}>
                    <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                      <SoftTypography
                        component="label"
                        variant="caption"
                        fontWeight="bold"
                        textTransform="capitalize"
                        fontSize="13px"
                      >
                        PI number
                      </SoftTypography>
                      <SoftBox display="flex">
                        <SoftInput disabled={piSelected ? true : false} onChange={(e) => setPiNum(e.target.value)} />
                        <SoftButton
                          className="vendor-add-btn"
                          onClick={handleVerify}
                          disabled={piNum === '' || piSelected ? true : false}
                          style={{ marginLeft: '10px' }}
                        >
                          {verifyLoader ? <CircularProgress size={20} /> : <>Import</>}
                        </SoftButton>
                      </SoftBox>
                    </SoftBox>
                  </Grid>
                </Grid>
              </Grid>
              {view && (
                <>
                  {vendorDisplayName && (
                    <Grid item xs={12} md={12} xl={12}>
                      <SoftBox display="flex" flexDirection="column" alignItems="flex-start" gap="10px">
                        <SoftTypography component="label" variant="caption" textTransform="capitalize" fontSize="13px">
                          Vendor Name: <span style={{ fontWeight: 'bold' }}>{vendorDisplayName}</span>
                        </SoftTypography>
                        <SoftTypography component="label" variant="caption" textTransform="capitalize" fontSize="13px">
                          PAN: <span style={{ fontWeight: 'bold' }}>{vendorPAN}</span>
                        </SoftTypography>
                        <SoftTypography component="label" variant="caption" textTransform="capitalize" fontSize="13px">
                          GST: <span style={{ fontWeight: 'bold' }}>{vendorGST}</span>
                        </SoftTypography>
                      </SoftBox>
                    </Grid>
                  )}
                  <Grid item xs={12} md={12} xl={12}>
                    <Grid container spacing={3} justifyContent="space-between">
                      {view ? (
                        <>
                          <Grid item xs={8} md={6} xl={4}>
                            <Accordion>
                              <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                onClick={() => setVendorIsAccordionExpanded(!vendorIsAccordionExpanded)}
                              >
                                {/* <SoftBox
                              display="flex"
                              justifyContent="flex-start"
                              alignItems="center"
                              className="vendor-top-text"
                            > */}
                                <SoftTypography fontSize="12px" fontWeight="bold" mr={2}>
                                  Vendor Address
                                </SoftTypography>
                                {/* </SoftBox> */}
                              </AccordionSummary>
                              <AccordionDetails>
                                <Grid item xs={12} md={6} xl={6}>
                                  <SoftBox
                                    display="flex"
                                    justifyContent="flex-start"
                                    alignItems="center"
                                    className="vendor-top-text"
                                  >
                                    <SoftTypography fontSize="12px" mr={2} mb={1}>
                                      Current Address
                                    </SoftTypography>
                                  </SoftBox>
                                  {vendoraddress && (
                                    <SoftBox className="vendor-cross-box">
                                      <SoftTypography className="add-pi-font-size">
                                        {vendoraddress?.addressLine1}
                                      </SoftTypography>
                                      <SoftTypography className="add-pi-font-size">
                                        {vendoraddress?.addressLine2}
                                      </SoftTypography>
                                      <SoftTypography className="add-pi-font-size">
                                        {vendoraddress?.city} {vendoraddress?.state}
                                      </SoftTypography>
                                      <SoftTypography className="add-pi-font-size">
                                        {vendoraddress?.pinCode} {vendoraddress?.country}
                                      </SoftTypography>
                                      <SoftTypography className="add-pi-font-size">
                                        {vendoraddress?.phoneNo}
                                      </SoftTypography>
                                      <SoftTypography
                                        onClick={handleClick5}
                                        fontSize="12px"
                                        color="info"
                                        style={{ cursor: 'pointer' }}
                                      >
                                        Change the Address
                                      </SoftTypography>
                                    </SoftBox>
                                  )}
                                  <Modal
                                    aria-labelledby="unstyled-modal-title"
                                    aria-describedby="unstyled-modal-description"
                                    open={open5}
                                    onClose={() => {
                                      setOpen5(false);
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
                                        width: '50vh',
                                        overflow: 'auto',
                                        maxHeight: '80vh',
                                      }}
                                    >
                                      <Typography id="modal-modal-title" variant="h6" fontWeight="bold" component="h2">
                                        Select Vendor Address
                                      </Typography>
                                      <SoftBox>
                                        {vendorListaddress.map((e) => {
                                          return (
                                            <SoftBox
                                              key={e.id}
                                              // onClick={() => handleChangeVendorAdd(e)}
                                              style={{ cursor: 'pointer', marginTop: '10px' }}
                                            >
                                              <label key={e.id} className="add-pi-font-size">
                                                <div style={{ display: 'flex', alignItems: 'start', gap: '10px' }}>
                                                  <input
                                                    type="radio"
                                                    name="vendorAddress"
                                                    value={e.id}
                                                    checked={selectedVendorAdd === e}
                                                    onChange={() => handleChangeVendorAdd(e)}
                                                  />
                                                  <div>
                                                    <SoftTypography className="add-pi-font-size">
                                                      {e?.addressLine1}
                                                    </SoftTypography>
                                                    <SoftTypography className="add-pi-font-size">
                                                      {e?.addressLine2}
                                                    </SoftTypography>
                                                    <SoftTypography className="add-pi-font-size">
                                                      {e?.city} {e?.state}
                                                    </SoftTypography>
                                                    <SoftTypography className="add-pi-font-size">
                                                      {e?.pinCode} {e?.country}
                                                    </SoftTypography>
                                                    <SoftTypography className="add-pi-font-size">
                                                      {e?.phoneNo}
                                                    </SoftTypography>
                                                  </div>
                                                </div>
                                                <hr />
                                              </label>
                                            </SoftBox>
                                          );
                                        })}
                                      </SoftBox>
                                    </Box>
                                  </Modal>
                                </Grid>
                              </AccordionDetails>
                            </Accordion>
                          </Grid>
                        </>
                      ) : null}
                      {view ? (
                        <Grid item xs={8} md={6} xl={7}>
                          <Accordion>
                            <AccordionSummary
                              expandIcon={<ExpandMoreIcon />}
                              onClick={() => {
                                setOrgIsAccordionExpanded(!orgIsAccordionExpanded);
                              }}
                            >
                              <SoftTypography fontSize="12px" fontWeight="bold" mr={2}>
                                Organization/ Customer Address
                              </SoftTypography>
                            </AccordionSummary>
                            <AccordionDetails>
                              <SoftBox mb={2} mt={-2} className="cus-div-box-po">
                                <Box display="flex" justifyContent="space-between" width="100%">
                                  <SoftBox display="flex" alignItems="center" mr={2} width="40%">
                                    <SoftTypography mr={1} fontSize="13px" fontWeight="medium">
                                      Organisation
                                    </SoftTypography>
                                    <input
                                      type="radio"
                                      name="billing-address"
                                      value="org"
                                      onChange={handleAddress}
                                      checked={toggle === 'org'}
                                    />
                                  </SoftBox>
                                  <Box display="flex" gap={1}>
                                    <SoftBox display="flex" alignItems="center" style={{ marginRight: '50px' }}>
                                      <SoftTypography mr={1} fontSize="13px" fontWeight="medium">
                                        {' '}
                                        Customer
                                      </SoftTypography>
                                      <input
                                        type="radio"
                                        name="billing-address"
                                        value="cus"
                                        onChange={handleAddress1}
                                        checked={toggle === 'cus'}
                                      />
                                    </SoftBox>
                                    {toggle == 'cus' ? (
                                      <select
                                        placeholder=""
                                        className="po-select"
                                        onChange={(e) => {
                                          handlecustomerDetails(e);
                                        }}
                                      >
                                        <option key={''} value={''}>
                                          Select Customer
                                        </option>
                                        {dataRowscustomer.map((option) => (
                                          <option key={option.value} value={option.value} className="optionclass">
                                            {option.label}
                                          </option>
                                        ))}
                                      </select>
                                    ) : null}
                                  </Box>
                                </Box>
                              </SoftBox>
                              {toggle == 'cus' ? (
                                <SoftBox mt={-2} display="flex" justifyContent="space-between">
                                  <SoftBox>
                                    {billingaddress1 && !showcus ? (
                                      <SoftBox mt={1.5}>
                                        <SoftTypography fontSize="13px" fontWeight="bold" mr={2}>
                                          Billing Address:
                                        </SoftTypography>
                                        <SoftTypography className="add-pi-font-size">
                                          {billingaddress1?.addressLine1}
                                        </SoftTypography>
                                        <SoftTypography className="add-pi-font-size">
                                          {billingaddress1?.addressLine2}
                                        </SoftTypography>
                                        <SoftTypography className="add-pi-font-size">
                                          {billingaddress1?.city} {billingaddress1?.state}
                                        </SoftTypography>
                                        <SoftTypography className="add-pi-font-size">
                                          {billingaddress1?.pincode} {billingaddress1?.country}
                                        </SoftTypography>
                                        <SoftTypography className="add-pi-font-size">
                                          {billingaddress1?.mobileNumber}
                                        </SoftTypography>
                                        <SoftTypography
                                          onClick={handleClick3}
                                          fontSize="12px"
                                          color="info"
                                          style={{ cursor: 'pointer' }}
                                        >
                                          Change the Address
                                        </SoftTypography>
                                      </SoftBox>
                                    ) : null}
                                    <Modal
                                      aria-labelledby="unstyled-modal-title"
                                      aria-describedby="unstyled-modal-description"
                                      open={open3}
                                      onClose={() => {
                                        setOpen3(false);
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
                                          width: '50vh',
                                          overflow: 'auto',
                                          maxHeight: '80vh',
                                        }}
                                      >
                                        <Typography
                                          id="modal-modal-title"
                                          variant="h6"
                                          fontWeight="bold"
                                          component="h2"
                                        >
                                          Select Billing Address
                                        </Typography>

                                        <SoftBox>
                                          {customeraddress.map((e) => {
                                            return (
                                              <SoftBox
                                                key={e.id}
                                                // onClick={() => handleToggle2(e)}
                                                style={{ cursor: 'pointer', marginTop: '10px' }}
                                              >
                                                <label key={e.id} className="add-pi-font-size">
                                                  <div style={{ display: 'flex', alignItems: 'start', gap: '10px' }}>
                                                    <input
                                                      type="radio"
                                                      name="vendorAddress"
                                                      value={e.id}
                                                      checked={selectedCustBill === e}
                                                      onChange={() => handleToggle2(e)}
                                                    />
                                                    <div>
                                                      <SoftTypography className="add-pi-font-size">
                                                        {e?.addressLine1}
                                                      </SoftTypography>
                                                      <SoftTypography className="add-pi-font-size">
                                                        {e?.addressLine2}
                                                      </SoftTypography>
                                                      <SoftTypography className="add-pi-font-size">
                                                        {e?.city} {e?.state}
                                                      </SoftTypography>
                                                      <SoftTypography className="add-pi-font-size">
                                                        {e?.pincode} {e?.country}
                                                      </SoftTypography>
                                                      <SoftTypography className="add-pi-font-size">
                                                        {e?.mobileNumber}
                                                      </SoftTypography>
                                                    </div>
                                                  </div>
                                                  <hr />
                                                </label>
                                              </SoftBox>
                                            );
                                          })}
                                        </SoftBox>
                                      </Box>
                                    </Modal>
                                  </SoftBox>
                                  <SoftBox>
                                    {billingaddress && !showcus ? (
                                      <SoftBox mt={1.5}>
                                        <SoftTypography fontSize="13px" fontWeight="bold" mr={2}>
                                          Shipping Address:
                                        </SoftTypography>
                                        <SoftTypography className="add-pi-font-size">
                                          {billingaddress?.addressLine1}
                                        </SoftTypography>
                                        <SoftTypography className="add-pi-font-size">
                                          {billingaddress?.addressLine2}
                                        </SoftTypography>
                                        <SoftTypography className="add-pi-font-size">
                                          {billingaddress?.city} {billingaddress?.state}
                                        </SoftTypography>
                                        <SoftTypography className="add-pi-font-size">
                                          {billingaddress?.pincode} {billingaddress?.country}
                                        </SoftTypography>
                                        <SoftTypography className="add-pi-font-size">
                                          {billingaddress?.mobileNumber}
                                        </SoftTypography>
                                        <SoftTypography
                                          onClick={handleClick4}
                                          fontSize="12px"
                                          color="info"
                                          style={{ cursor: 'pointer' }}
                                        >
                                          Change the Address
                                        </SoftTypography>
                                      </SoftBox>
                                    ) : null}
                                    <Modal
                                      aria-labelledby="unstyled-modal-title"
                                      aria-describedby="unstyled-modal-description"
                                      open={open4}
                                      onClose={() => {
                                        setOpen4(false);
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
                                          width: '50vh',
                                          overflow: 'auto',
                                          maxHeight: '80vh',
                                        }}
                                      >
                                        <Typography
                                          id="modal-modal-title"
                                          variant="h6"
                                          fontWeight="bold"
                                          component="h2"
                                        >
                                          Select Shipping Address
                                        </Typography>
                                        <SoftBox>
                                          {customeraddress.map((e) => {
                                            return (
                                              <SoftBox
                                                key={e.id}
                                                // onClick={() => handleToggle1(e)}
                                                style={{ cursor: 'pointer', marginTop: '10px' }}
                                              >
                                                <label key={e.id} className="add-pi-font-size">
                                                  <div style={{ display: 'flex', alignItems: 'start', gap: '10px' }}>
                                                    <input
                                                      type="radio"
                                                      name="vendorAddress"
                                                      value={e.id}
                                                      checked={selectedCustShip === e}
                                                      onChange={() => handleToggle1(e)}
                                                    />
                                                    <div>
                                                      <SoftTypography className="add-pi-font-size">
                                                        {e?.addressLine1}
                                                      </SoftTypography>
                                                      <SoftTypography className="add-pi-font-size">
                                                        {e?.addressLine2}
                                                      </SoftTypography>
                                                      <SoftTypography className="add-pi-font-size">
                                                        {e?.city} {e?.state}
                                                      </SoftTypography>
                                                      <SoftTypography className="add-pi-font-size">
                                                        {e?.pincode} {e?.country}
                                                      </SoftTypography>
                                                      <SoftTypography className="add-pi-font-size">
                                                        {e?.mobileNumber}
                                                      </SoftTypography>
                                                    </div>
                                                  </div>
                                                  <hr />
                                                </label>
                                              </SoftBox>
                                            );
                                          })}
                                        </SoftBox>
                                      </Box>
                                    </Modal>
                                  </SoftBox>
                                </SoftBox>
                              ) : null}
                              <SoftBox mt={-2} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <SoftBox>
                                  {toggle == 'org' ? (
                                    <SoftBox>
                                      {test2.length === 0 ? (
                                        <SoftBox mt={1.5}>
                                          <SoftTypography fontSize="13px" fontWeight="bold" mr={2}>
                                            Billing Address:
                                          </SoftTypography>
                                          <SoftTypography className="add-pi-font-size">
                                            {billingaddress1?.addressLine1}
                                          </SoftTypography>
                                          <SoftTypography className="add-pi-font-size">
                                            {billingaddress1?.addressLine2}
                                          </SoftTypography>
                                          <SoftTypography className="add-pi-font-size">
                                            {billingaddress1?.city} {billingaddress1?.state}
                                          </SoftTypography>
                                          <SoftTypography className="add-pi-font-size">
                                            {billingaddress1?.pincode} {billingaddress1?.country}
                                          </SoftTypography>
                                          <SoftTypography className="add-pi-font-size">
                                            {billingaddress1?.mobileNumber}
                                          </SoftTypography>
                                        </SoftBox>
                                      ) : (
                                        <SoftBox mt={1.5}>
                                          <SoftTypography className="add-pi-font-size">
                                            {billingaddress1?.addressLine1}
                                          </SoftTypography>
                                          <SoftTypography className="add-pi-font-size">
                                            {billingaddress1?.addressLine2}
                                          </SoftTypography>
                                          <SoftTypography className="add-pi-font-size">
                                            {billingaddress1?.city} {billingaddress1?.state}
                                          </SoftTypography>
                                          <SoftTypography className="add-pi-font-size">
                                            {billingaddress1?.pincode} {billingaddress1?.country}
                                          </SoftTypography>
                                          <SoftTypography className="add-pi-font-size">
                                            {billingaddress1?.mobileNumber}
                                          </SoftTypography>
                                        </SoftBox>
                                      )}
                                      <SoftTypography
                                        onClick={handleClick2}
                                        fontSize="12px"
                                        color="info"
                                        style={{ cursor: 'pointer' }}
                                      >
                                        Change the Address
                                      </SoftTypography>
                                      <Modal
                                        aria-labelledby="unstyled-modal-title"
                                        aria-describedby="unstyled-modal-description"
                                        open={open2}
                                        onClose={() => {
                                          setOpen2(false);
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
                                            width: '50vh',
                                            overflow: 'auto',
                                            maxHeight: '80vh',
                                          }}
                                        >
                                          <Typography
                                            id="modal-modal-title"
                                            variant="h6"
                                            fontWeight="bold"
                                            component="h2"
                                          >
                                            Select Billing Address
                                          </Typography>
                                          <SoftBox>
                                            {allbillingaddress.map((e) => {
                                              return (
                                                <SoftBox
                                                  key={e.id}
                                                  // onClick={() => handleToggle2(e)}
                                                  style={{ cursor: 'pointer', marginTop: '10px' }}
                                                >
                                                  <label key={e.id} className="add-pi-font-size">
                                                    <div style={{ display: 'flex', alignItems: 'start', gap: '10px' }}>
                                                      <input
                                                        type="radio"
                                                        name="vendorAddress"
                                                        value={e.id}
                                                        checked={selectedCustBill === e}
                                                        onChange={() => handleToggle2(e)}
                                                      />
                                                      <div>
                                                        <SoftTypography className="add-pi-font-size">
                                                          {e?.addressLine1}
                                                        </SoftTypography>
                                                        <SoftTypography className="add-pi-font-size">
                                                          {e?.addressLine2}
                                                        </SoftTypography>
                                                        <SoftTypography className="add-pi-font-size">
                                                          {e?.city} {e?.state}
                                                        </SoftTypography>
                                                        <SoftTypography className="add-pi-font-size">
                                                          {e?.pincode} {e?.country}
                                                        </SoftTypography>
                                                        <SoftTypography className="add-pi-font-size">
                                                          {e?.mobileNumber}
                                                        </SoftTypography>
                                                      </div>
                                                    </div>
                                                    <hr />
                                                  </label>
                                                </SoftBox>
                                              );
                                            })}
                                          </SoftBox>
                                        </Box>
                                      </Modal>
                                    </SoftBox>
                                  ) : null}
                                </SoftBox>
                                <SoftBox>
                                  {toggle == 'org' ? (
                                    <SoftBox>
                                      {test1.length === 0 ? (
                                        <SoftBox mt={1.5}>
                                          <SoftTypography fontSize="13px" fontWeight="bold" mr={2}>
                                            Shipping Address:
                                          </SoftTypography>
                                          <SoftTypography className="add-pi-font-size">
                                            {billingaddress?.addressLine1}
                                          </SoftTypography>
                                          <SoftTypography className="add-pi-font-size">
                                            {billingaddress?.addressLine2}
                                          </SoftTypography>
                                          <SoftTypography className="add-pi-font-size">
                                            {billingaddress?.city} {billingaddress?.state}
                                          </SoftTypography>
                                          <SoftTypography className="add-pi-font-size">
                                            {billingaddress?.pincode} {billingaddress?.country}
                                          </SoftTypography>
                                          <SoftTypography className="add-pi-font-size">
                                            {billingaddress?.mobileNumber}
                                          </SoftTypography>
                                        </SoftBox>
                                      ) : (
                                        <SoftBox mt={1.5}>
                                          <SoftTypography className="add-pi-font-size">
                                            {billingaddress?.addressLine1}
                                          </SoftTypography>
                                          <SoftTypography className="add-pi-font-size">
                                            {billingaddress?.addressLine2}
                                          </SoftTypography>
                                          <SoftTypography className="add-pi-font-size">
                                            {billingaddress?.city} {billingaddress?.state}
                                          </SoftTypography>
                                          <SoftTypography className="add-pi-font-size">
                                            {billingaddress?.pincode} {billingaddress?.country}
                                          </SoftTypography>
                                          <SoftTypography className="add-pi-font-size">
                                            {billingaddress?.mobileNumber}
                                          </SoftTypography>
                                        </SoftBox>
                                      )}
                                      <SoftTypography
                                        onClick={handleClick1}
                                        fontSize="12px"
                                        color="info"
                                        style={{ cursor: 'pointer', marginTop: '10px' }}
                                      >
                                        Change the Address
                                      </SoftTypography>
                                      <Modal
                                        aria-labelledby="unstyled-modal-title"
                                        aria-describedby="unstyled-modal-description"
                                        open={open1}
                                        onClose={() => {
                                          setOpen1(false);
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
                                            width: '50vh',
                                            overflow: 'auto',
                                            maxHeight: '80vh',
                                          }}
                                        >
                                          <Typography
                                            id="modal-modal-title"
                                            variant="h6"
                                            fontWeight="bold"
                                            component="h2"
                                          >
                                            Select Shipping Address
                                          </Typography>
                                          <SoftBox>
                                            {allbillingaddress.map((e) => {
                                              return (
                                                <SoftBox
                                                  key={e.id}
                                                  // onClick={() => handleToggle1(e)}
                                                  style={{ cursor: 'pointer', marginTop: '10px' }}
                                                >
                                                  <label key={e.id} className="add-pi-font-size">
                                                    <div style={{ display: 'flex', alignItems: 'start', gap: '10px' }}>
                                                      <input
                                                        type="radio"
                                                        name="vendorAddress"
                                                        value={e.id}
                                                        checked={selectedCustShip === e}
                                                        onChange={() => handleToggle1(e)}
                                                      />
                                                      <div>
                                                        <SoftTypography className="add-pi-font-size">
                                                          {e?.addressLine1}
                                                        </SoftTypography>
                                                        <SoftTypography className="add-pi-font-size">
                                                          {e?.addressLine2}
                                                        </SoftTypography>
                                                        <SoftTypography className="add-pi-font-size">
                                                          {e?.city} {e?.state}
                                                        </SoftTypography>
                                                        <SoftTypography className="add-pi-font-size">
                                                          {e?.pincode} {e?.country}
                                                        </SoftTypography>
                                                        <SoftTypography className="add-pi-font-size">
                                                          {e?.mobileNumber}
                                                        </SoftTypography>
                                                      </div>
                                                    </div>
                                                    <hr />
                                                  </label>
                                                </SoftBox>
                                              );
                                            })}
                                          </SoftBox>
                                        </Box>
                                      </Modal>
                                    </SoftBox>
                                  ) : null}
                                </SoftBox>
                              </SoftBox>
                            </AccordionDetails>
                          </Accordion>
                        </Grid>
                      ) : null}
                    </Grid>
                  </Grid>

                  <Grid item xs={12} md={12} xl={12}>
                    <Grid container spacing={3} justifyContent="space-between">
                      <Grid item xs={8} md={3} xl={2}>
                        <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                          <SoftTypography
                            component="label"
                            variant="caption"
                            fontWeight="bold"
                            textTransform="capitalize"
                            fontSize="13px"
                          >
                            Invoice Number
                            <span style={{ color: 'red', marginLeft: '5px', fontSize: '17px' }}> *</span>
                          </SoftTypography>
                        </SoftBox>
                        <SoftInput value={invoiceRefNo} onChange={(e) => setInvoiceRefNo(e.target.value)} />
                      </Grid>
                      <Grid item xs={8} md={3} xl={2}>
                        <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                          <SoftTypography
                            component="label"
                            variant="caption"
                            fontWeight="bold"
                            textTransform="capitalize"
                            fontSize="13px"
                          >
                            Invoice Date
                            <span style={{ color: 'red', marginLeft: '5px', fontSize: '17px' }}> *</span>
                          </SoftTypography>
                        </SoftBox>
                        <SoftInput type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} />
                      </Grid>
                      <Grid item xs={8} md={3} xl={2}>
                        <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                          <SoftTypography
                            component="label"
                            variant="caption"
                            fontWeight="bold"
                            textTransform="capitalize"
                            fontSize="13px"
                          >
                            Invoice Value
                            <span style={{ color: 'red', marginLeft: '5px', fontSize: '17px' }}> *</span>
                          </SoftTypography>
                        </SoftBox>
                        <SoftInput
                          type="number"
                          value={invoiceValue}
                          onChange={(e) => setInvoiceValue(e.target.value)}
                        />
                      </Grid>

                      <Grid item xs={8} md={3} xl={2}>
                        <SoftTypography
                          component="label"
                          variant="caption"
                          fontWeight="bold"
                          textTransform="capitalize"
                          fontSize="13px"
                        >
                          Payment Due Date
                        </SoftTypography>
                        <SoftInput type="date" value={paymentDue} onChange={(e) => setPaymentDue(e.target.value)} />
                      </Grid>
                      <Grid item xs={8} md={3} xl={2}>
                        <SoftTypography
                          component="label"
                          variant="caption"
                          fontWeight="bold"
                          textTransform="capitalize"
                          fontSize="13px"
                        >
                          Payment Mode
                        </SoftTypography>
                        <SoftSelect
                          value={paymentMode}
                          defaultValue={{ value: 'Cash', label: 'Cash' }}
                          onChange={(option) => setPaymenMode(option)}
                          options={[
                            { value: 'Cash', label: 'Cash' },
                            { value: 'Bank transfers', label: 'Bank transfers' },
                            { value: 'Card/ UPI/ Netbanking', label: 'Card/ UPI/ Netbanking' },
                            { value: 'Cheque', label: 'Cheque' },
                          ]}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} md={12} xl={12}>
                    <Grid container spacing={3} justifyContent="space-between">
                      <Grid item xs={8} md={4} xl={4}>
                        <SoftTypography
                          component="label"
                          variant="caption"
                          fontWeight="bold"
                          textTransform="capitalize"
                          fontSize="13px"
                        >
                          GST Option
                        </SoftTypography>
                        <SoftSelect
                          value={inclusiveTax}
                          defaultValue={{ value: 'false', label: 'GST Exclusive' }}
                          onChange={(option) => handleGSTChange(option)}
                          options={[
                            { value: 'false', label: 'GST Exclusive' },
                            { value: 'true', label: 'GST Inclusive' },
                          ]}
                        />
                      </Grid>
                      <Grid item xs={8} md={6} xl={7}>
                        <SoftTypography
                          component="label"
                          variant="caption"
                          fontWeight="bold"
                          textTransform="capitalize"
                          fontSize="13px"
                        >
                          Approved by
                          <span style={{ color: 'red', marginLeft: '5px', fontSize: '17px' }}> *</span>
                        </SoftTypography>
                        <SoftSelect
                          value={assignedToLabel}
                          required
                          onChange={(e) => handleAssignTo(e)}
                          options={assignUserrow}
                          isMulti
                          onFocus={() => allOrgUserList()}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </>
              )}
            </Grid>
          </Accordion>
        </SoftBox>

        <SoftBox
          p={3}
          className="create-pi-card"
          ref={softBoxRef}
          style={{
            position: isFixed ? 'sticky' : 'static',
            top: isFixed ? 0 : 'auto',
            width: isFixed ? '100%' : '100%',
            zIndex: isFixed ? 1100 : 'auto',
          }}
        >
          <SoftBox display="flex" gap="30px" alignItems="center" mb={2}>
            <SoftTypography variant="h6">
              Enter items you wish to purchase <b>{count > 1 && `(Total items added: ${totalRowsGRN})`} </b>
            </SoftTypography>
            {itemLoader && <Spinner size={20} />}
          </SoftBox>
          {count > 0 && (
            <SoftBox className="heading-product-boxes">
              <SoftBox mt={-3} style={{ minWidth: '900px' }}>
                <Grid container spacing={1} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                  <Grid item xs={0.7} sm={0.7} md={0.7} mt={'10px'}>
                    <SoftBox display="flex" alignItems="center">
                      <InputLabel className="all-input-label">S No.</InputLabel>
                    </SoftBox>
                  </Grid>
                  <Grid item xs={2} sm={2} md={2} mt={'10px'}>
                    <SoftBox display="flex" alignItems="center">
                      <InputLabel required className="all-input-label">
                        Barcode
                      </InputLabel>
                    </SoftBox>
                  </Grid>
                  <Grid item xs={2} sm={2} md={2} mt={'10px'}>
                    <SoftBox display="flex" alignItems="center">
                      <InputLabel required className="all-input-label">
                        Product Title
                      </InputLabel>
                    </SoftBox>
                  </Grid>
                  <Grid item xs={0.8} sm={0.8} md={0.8} mt={'10px'}>
                    <SoftBox display="flex" alignItems="center">
                      <InputLabel required className="all-input-label">
                        Qty
                      </InputLabel>
                    </SoftBox>
                  </Grid>
                  <Grid item xs={1} sm={1} md={1} mt={'10px'} ml={0.5}>
                    <SoftBox display="flex" alignItems="center">
                      <InputLabel required className="all-input-label">
                        Total PP
                      </InputLabel>
                    </SoftBox>
                  </Grid>
                  <Grid item xs={1} sm={1} md={1} mt={'10px'}>
                    <SoftBox display="flex" alignItems="center">
                      <InputLabel required className="all-input-label">
                        Price / unit
                      </InputLabel>
                    </SoftBox>
                  </Grid>
                  <Grid item xs={0.8} sm={0.8} md={0.8} mt={'10px'}>
                    <SoftBox display="flex" alignItems="center">
                      <InputLabel required className="all-input-label">
                        MRP
                      </InputLabel>
                    </SoftBox>
                  </Grid>
                  <Grid item xs={0.8} sm={0.8} md={0.8} mt={'10px'}>
                    <SoftBox display="flex" alignItems="center">
                      <InputLabel required className="all-input-label">
                        S Price
                      </InputLabel>
                    </SoftBox>
                  </Grid>
                  <Grid item xs={1} sm={1} md={1} mt={'10px'}>
                    <SoftBox display="flex" alignItems="center">
                      <InputLabel className="all-input-label">P Margin</InputLabel>
                    </SoftBox>
                  </Grid>
                  <Grid item xs={0.8} sm={0.8} md={0.8} mt={'10px'} ml={0.3}>
                    <SoftBox display="flex" alignItems="center">
                      <InputLabel className="all-input-label">GST (%)</InputLabel>
                    </SoftBox>
                  </Grid>
                  <SoftBox
                    mt={'5px'}
                    width="20px"
                    height="40px"
                    style={{ cursor: 'pointer', marginLeft: '15px' }}
                  ></SoftBox>
                  <SoftBox mt={'5px'} width="20px" height="40px" style={{ cursor: 'pointer' }}></SoftBox>
                </Grid>
              </SoftBox>
            </SoftBox>
          )}
        </SoftBox>

        <SoftBox p={3} className="create-pi-card">
          <ProductAdd
            setBarcodeNum={setBarcodeNum}
            setProductName={setProductName}
            setExpDate={setExpDate}
            setBatchNo={setBatchNo}
            setMrp={setMrp}
            setItemCess={setItemCess}
            setItemDiscount={setItemDiscount}
            setItemDiscountType={setItemDiscountType}
            setQuantityRejected={setQuantityRejected}
            quantityRejected={quantityRejected}
            setPurchasePrice={setPurchasePrice}
            setPreviousPurchasePrice={setPreviousPurchasePrice}
            setTotalPurchasePrice={setTotalPurchasePrice}
            setSellingPrice={setSellingPrice}
            setQuantity={setQuantity}
            setSpecification={setSpecification}
            setEpoID={setEpoID}
            setMasterSellingPrice={setMasterSellingPrice}
            barcodeNum={barcodeNum}
            productName={productName}
            expDate={expDate}
            batchno={batchno}
            mrp={mrp}
            itemCess={itemCess}
            itemDiscount={itemDiscount}
            itemDiscountType={itemDiscountType}
            purchasePrice={purchasePrice}
            previousPurchasePrice={previousPurchasePrice}
            totalPurchasePrice={totalPurchasePrice}
            sellingPrice={sellingPrice}
            quantity={quantity}
            specification={specification}
            epoID={epoID}
            masterSellingPrice={masterSellingPrice}
            setCount={setCount}
            setCount2={setCount2}
            count={count}
            count2={count2}
            setFixedCount={setFixedCount}
            setFixedCount2={setFixedCount2}
            fixedCount={fixedCount}
            fixedCount2={fixedCount2}
            vendorId={vendorId}
            handleAddProduct={handleAddProduct}
            itemLoader={itemLoader}
            setItemLoader={setItemLoader}
            setAddLoader={setAddLoader}
            setMoreProdAdded={setMoreProdAdded}
            itemListArray={itemListArray}
            invoiceRefNo={invoiceRefNo}
            invoiceValue={invoiceValue}
            invoiceDate={invoiceDate}
            setDiffBuyQuantity={setDiffBuyQuantity}
            setDiffGetBarcodeNum={setDiffGetBarcodeNum}
            setDiffGetProductName={setDiffGetProductName}
            setDiffGetQuantity={setDiffGetQuantity}
            diffBuyQuantity={diffBuyQuantity}
            diffGetBarcodeNum={diffGetBarcodeNum}
            diffGetProductName={diffGetProductName}
            diffGetQuantity={diffGetQuantity}
            handleAddMoreProduct={handleAddMoreProduct}
            setOfferId={setOfferId}
            offerId={offerId}
            setOffers={setOffers}
            offers={offers}
            setOfferType={setOfferType}
            offerType={offerType}
            setOfferSubType={setOfferSubType}
            offerSubType={offerSubType}
            setOfferDetailsId={setOfferDetailsId}
            offerDetailsId={offerDetailsId}
            setInwardedQuantity={setInwardedQuantity}
            inwardedQuantity={inwardedQuantity}
            setOfferDiscount={setOfferDiscount}
            offerDiscount={offerDiscount}
            setOfferDiscountType={setOfferDiscountType}
            offerDiscountType={offerDiscountType}
            assignedTo={assignedToLabel}
            changedIGST={changedIGST}
            setChangedIGST={setChangedIGST}
            changedCGST={changedCGST}
            setChangedCGST={setChangedCGST}
            changedSGST={changedSGST}
            setChangedSGST={setChangedSGST}
            isChangedIGST={isChangedIGST}
            setIsChangedIGST={setIsChangedIGST}
            isChangedCGST={isChangedCGST}
            setIsChangedCGST={setIsChangedCGST}
            isChangedSGST={isChangedSGST}
            setIsChangedSGST={setIsChangedSGST}
            cmsIGST={cmsIGST}
            setCMSIgst={setCMSIgst}
            flagColor={flagColor}
            setFlagColor={setFlagColor}
            recommendation={recommendation}
            setRecommendation={setRecommendation}
            salesCat={salesCat}
            setSalesCat={setSalesCat}
            inventCat={inventCat}
            setInventCat={setInventCat}
            grossProfitCat={grossProfitCat}
            setGrossProfitCat={setGrossProfitCat}
            flagAvailableStk={flagAvailableStk}
            setFlagAvailableStk={setFlagAvailableStk}
            stkTurnOver={stkTurnOver}
            setStkTurnover={setStkTurnover}
            counterApiCalled={counterApiCalled}
            setApiCallCounter={setApiCallCounter}
            inclusiveTax={inclusiveTax}
            totalRowsGRN={totalRowsGRN}
            setTotalRowsGRN={setTotalRowsGRN}
          />
        </SoftBox>

        <SoftBox p={3} className="create-pi-card">
          <Grid container spacing={3} justifyContent="space-between">
            <Grid item xs={12} md={4} xl={4} sx={{ marginTop: '-30px' }}>
              <SoftBox className="textarea-box">
                <SoftTypography fontSize="15px" fontWeight="bold">
                  {' '}
                  Purchase Notes
                </SoftTypography>
              </SoftBox>
              <SoftBox style={{ marginTop: '10px' }}>
                <TextareaAutosize
                  defaultValue={comment}
                  onChange={(e) => setComment(e.target.value)}
                  aria-label="minimum height"
                  minRows={3}
                  placeholder="Will be displayed on purchased order"
                  className="add-pi-textarea"
                />
              </SoftBox>
            </Grid>
            <Grid item xs={12} md={6} xl={5} sx={{ marginTop: '-30px' }}>
              <SoftBox className="textarea-box" style={{ marginBottom: '10px', marginLeft: '5px' }}>
                <SoftTypography fontSize="15px" fontWeight="bold">
                  {' '}
                  Billing Details (in ₹ )
                </SoftTypography>
              </SoftBox>
              <SoftBox className="add-po-bill-details-box">
                <SoftBox display="flex" justifyContent="space-between" p={3}>
                  <SoftBox style={{ width: '50%' }}>
                    <SoftTypography
                      fontSize="0.78rem"
                      fontWeight="bold"
                      p="2px"
                      style={{ marginBottom: '10px', marginTop: '10px' }}
                      alignItems="center"
                    >
                      Discount
                    </SoftTypography>

                    <SoftTypography
                      fontSize="0.78rem"
                      fontWeight="bold"
                      p="2px"
                      style={{ marginTop: '10px' }}
                      alignItems="center"
                    >
                      CESS
                    </SoftTypography>
                    <SoftTypography fontSize="0.78rem" fontWeight="bold">
                      <FormControlLabel control={<Checkbox />} label="Vendor Credit" onChange={handleCheckboxChange} />
                    </SoftTypography>
                    {/* {+statesCode(billingaddress1?.state) === +statesCode(vendoraddress?.state) ? (
                      <> */}
                    <SoftTypography fontSize="0.78rem" fontWeight="bold" p="2px">
                      Total Discount Value
                    </SoftTypography>
                    <SoftTypography fontSize="0.78rem" fontWeight="bold" p="2px">
                      CGST
                    </SoftTypography>
                    <SoftTypography fontSize="0.78rem" fontWeight="bold" p="2px">
                      SGST
                    </SoftTypography>
                    {/* </>
                    ) : ( */}
                    <SoftTypography fontSize="0.78rem" fontWeight="bold" p="2px">
                      IGST
                    </SoftTypography>
                    {/* )} */}
                    <SoftTypography fontSize="0.78rem" fontWeight="bold" p="2px">
                      Sub Total
                    </SoftTypography>
                    <SoftTypography fontSize="18px" fontWeight="bold">
                      Total
                    </SoftTypography>
                    <SoftTypography
                      fontSize="0.78rem"
                      fontWeight="bold"
                      p="2px"
                      style={{ marginBottom: '15px', marginTop: '10px' }}
                      alignItems="center"
                    >
                      Round Off
                    </SoftTypography>
                  </SoftBox>
                  <SoftBox style={{ width: '40%' }}>
                    <SoftBox className="dis-count-box-1">
                      <SoftBox className="boom-box" style={{ border: 'none' }}>
                        <SoftInput
                          className="boom-input"
                          disabled={itemListArray?.length === 0}
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
                    <SoftBox style={{ marginTop: '5px', marginBottom: '5px' }}>
                      <SoftBox>
                        <SoftTypography fontSize="0.78rem" fontWeight="bold" p="2px">
                          {cess || 0}
                        </SoftTypography>

                        {/* <SoftInput
                          className="boom-input"
                          value={cess}
                          onChange={(e) => setCess(e.target.value)}
                          type="number"
                        /> */}
                        {/* <SoftSelect
                          placeholder="select cess"
                          options={[
                            { value: 0, label: '0  %' },
                            { value: 5, label: '5  %' },
                            { value: 12, label: '12 %' },
                            { value: 18, label: '18 %' },
                            { value: 28, label: '28 %' },
                          ]}
                          value={{ value: cess, label: cess }}
                          onChange={(e) => setCess(e?.value)}
                        ></SoftSelect> */}
                      </SoftBox>
                    </SoftBox>

                    <SoftBox fontSize="0.78rem" fontWeight="bold" p="2px">
                      {vendorCredit || 0}
                    </SoftBox>
                    {/* {+statesCode(billingaddress1?.state) === +statesCode(vendoraddress?.state) ? (
                      <> */}
                    <SoftTypography fontSize="0.78rem" fontWeight="bold" p="2px">
                      {totalDiscountValue || 0}
                    </SoftTypography>
                    <SoftTypography fontSize="0.78rem" fontWeight="bold" p="2px">
                      {cgst || 0}
                    </SoftTypography>
                    <SoftTypography fontSize="0.78rem" fontWeight="bold" p="2px">
                      {sgst || 0}
                    </SoftTypography>
                    {/* </>
                     ) : ( */}
                    <SoftTypography fontSize="0.78rem" fontWeight="bold" p="2px">
                      {igst || 0}
                    </SoftTypography>
                    {/* )} */}
                    <SoftTypography fontSize="0.78rem" fontWeight="bold" p="2px">
                      {subTotal}
                    </SoftTypography>
                    <SoftTypography fontSize="18px" fontWeight="bold" style={totalStyle}>
                      {total !== null ? total : '0'}
                    </SoftTypography>
                    <SoftBox className="dis-count-box-1" style={{ marginTop: '5px', marginBottom: '5px' }}>
                      <SoftBox className="boom-box" style={{ border: 'none' }}>
                        <SoftInput
                          className="boom-input"
                          value={roundOff}
                          onChange={(e) => setRoundOff(e.target.value)}
                          type="number"
                        />
                      </SoftBox>
                    </SoftBox>
                  </SoftBox>
                </SoftBox>
              </SoftBox>
            </Grid>
            <Grid item xs={12} md={6} xl={6}></Grid>
            <Grid item xs={12} md={6} xl={6}>
              <SoftBox className="add-po-btns" style={{ gap: '10px' }}>
                {jobId || epoNumber ? (
                  <SoftButton color="error" onClick={handleDelete}>
                    Delete
                  </SoftButton>
                ) : (
                  <SoftButton
                    variant={buttonStyles.secondaryVariant}
                    className="outlined-softbutton"
                    onClick={() => navigate('/purchase/express-grn')}
                  >
                    Cancel{' '}
                  </SoftButton>
                )}

                <SoftButton
                  variant={buttonStyles.primaryVariant}
                  className="contained-softbutton vendor-add-btn"
                  onClick={handleSave}
                  disabled={saveLoader ? true : false}
                >
                  {saveLoader ? <CircularProgress size={20} /> : <>Save</>}
                </SoftButton>
                <SoftButton color="success" onClick={handleSubmit} disabled={submitLoader ? true : false}>
                  {submitLoader ? <CircularProgress size={20} /> : <>Submit</>}
                </SoftButton>
              </SoftBox>
            </Grid>
          </Grid>
          <Modal
            open={openModal3}
            onClose={handleCloseModal3}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box className="pi-approve-menu-1">
              <SoftTypography id="modal-modal-title" variant="h6" component="h2">
                Are you sure you want to delete this.
              </SoftTypography>
              <SoftSelect
                onChange={(e) => setDeleteReason(e.value)}
                options={[
                  { value: 'Dummy PO', label: 'Dummy PO' },
                  { value: 'Wrong data', label: 'Wrong data' },
                  { value: 'No longer required', label: 'No longer required' },
                  { value: 'Others', label: 'Others' },
                ]}
              />
              <SoftBox className="pi-approve-btns-div" style={{ gap: '10px' }}>
                <SoftButton
                  variant={buttonStyles.secondaryVariant}
                  className="outlined-softbutton"
                  onClick={handleCloseModal3}
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
            open={openVendorModal}
            onClose={handleCloseVendorModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box className="pi-approve-menu-1">
              <SoftTypography id="modal-modal-title" variant="h6" component="h2">
                This purchase is already associated with a vendor <b>{vendorDisplayName} </b>. Do you want to import
                from vendor <b>{newVendorName}</b>?
              </SoftTypography>
              <SoftBox className="pi-approve-btns-div" style={{ gap: '10px' }}>
                <SoftButton
                  variant={buttonStyles.secondaryVariant}
                  className="outlined-softbutton"
                  onClick={handleCloseVendorModal}
                >
                  Cancel
                </SoftButton>
                <SoftButton
                  className="vendor-add-btn"
                  onClick={() => {
                    vendorSelected(newVendorId), handleCloseVendorModal();
                  }}
                >
                  Confirm
                </SoftButton>
              </SoftBox>
            </Box>
          </Modal>
          <Modal
            open={openGstModal}
            onClose={handleCloseVendorModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box className="pi-approve-menu-1">
              <SoftTypography id="modal-modal-title" variant="h6" component="h2">
                Changing GST option will change total billing details. Are you sure, you want to change to{' '}
                <b>{inclusiveTax.label === 'GST Exclusive' ? 'GST Inclusive' : 'GST Exclusive'} </b>?
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
        </SoftBox>
      </Box>
    </DashboardLayout>
  );
};

export default POExclusive;
