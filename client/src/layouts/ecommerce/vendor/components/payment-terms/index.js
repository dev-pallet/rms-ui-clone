import styled from '@emotion/styled';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { Autocomplete, Chip, FormControlLabel, Grid, InputLabel, Radio, RadioGroup, TextField } from '@mui/material';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import SoftBox from 'components/SoftBox';
import SoftButton from 'components/SoftButton';
import SoftInput from 'components/SoftInput';
import SoftTypography from 'components/SoftTypography';
import { saveVendorPurchaseTerm } from 'config/Services';
import { GoogleApiWrapper } from 'google-maps-react';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import SoftSelect from '../../../../../components/SoftSelect';
import MultiSelect from '../../../../../components/SoftSelect/MultiSelect';
import {
  autoSaveVendorDetails,
  fetchOrganisations,
  getBranchAllAdresses,
  getVendorDraftDetails,
  vendorDeliveryFullFillmentById,
  vendorPaymentTermstById,
  vendorReturnAndReplacementById,
} from '../../../../../config/Services';
import {
  // getVendorDeliveryPayload,
  getVendorDraftCode,
  getVendorIsTermsDraft,
  setIsTermsDraft,
  // getVendorReturnsPayload,
  // getVendorTermsPayload,
  setVendorAutoSaveTime,
} from '../../../../../datamanagement/vendorPayloadSlice';
import { useSnackbar } from '../../../../../hooks/SnackbarProvider';
import { textFormatter } from '../../../Common/CommonFunction';
import AddvendorApiCall from '../addvendor/AddvendorApiCall';
import './payment-terms.css';

const StyledFormControlLabel = styled((props) => <FormControlLabel {...props} />)(({ theme, checked }) => ({
  '.MuiFormControlLabel-label': checked && {
    color: theme.palette.primary.main,
  },
}));

// function MyFormControlLabel(props) {
//   const radioGroup = useRadioGroup();

//   let checked = false;

//   if (radioGroup) {
//     checked = radioGroup.value === props.value;
//   }

//   return <StyledFormControlLabel checked={checked} {...props} />;
// }
const PaymentTerms = ({ handleTab, google }) => {
  const vendorDraftCode = useSelector(getVendorDraftCode) || localStorage.getItem('vendorDraftCode');
  const dispatch = useDispatch();
  const isTermsDraft = useSelector(getVendorIsTermsDraft);

  const showSnackBar = useSnackbar();
  const { editVendorId } = useParams();
  const autocompleteRef = useRef(null);
  const orgId = localStorage?.getItem('orgId');
  const locId = localStorage?.getItem('locId');
  const user_details = localStorage.getItem('user_details');
  const createdById = JSON.parse(user_details).uidx;
  const userName = localStorage.getItem('user_name');
  const vendorId = localStorage.getItem('vendorId');
  const { vendorType } = useParams();
  const navigate = useNavigate();
  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
  const [creditDays, setCreditDays] = useState('');
  const [creditLimit, setCreditLimit] = useState('');
  const [payment, setPayment] = useState([]);
  const [purchaseTerms, setPurchaseTerms] = useState([]);
  const [purchaseData, setPurchaseData] = useState({});
  const [vendorReturnObj, setVendorReturnObj] = useState({});
  const [addMoreCount, setAddMoreCount] = useState({ frontendMargin: 1, backendMargin: 1 });

  const initialPaymentOptions = [
    { value: 'BANK_TRANSFER', label: 'Bank transfers', inputValue: '', enabled: false },
    { value: 'CREDIT_OR_DEBIT_CARD', label: 'Credit / Debit / Upi', inputValue: '', enabled: false },
    { value: 'CHEQUE', label: 'Cheque', inputValue: '', enabled: false },
    { value: 'CASH_DEPOSITS', label: 'Cash deposits', inputValue: '', enabled: false },
  ];
  const [paymentOptions, setPaymentOptions] = useState(initialPaymentOptions);
  const [optionSelected, setSelected] = useState(null);
  const [selectedPaymentTerms, setSelectedPaymentTerms] = useState({});
  const [selectedPayoutFrequency, setSelectedPayoutFrequency] = useState({ value: 'DAILY', label: 'Daily' });
  const [onSaleDeliveryDays, setOnSaleDeliveryDays] = useState([]);
  const [onSaleDeliveryDate, setOnSaleDeliveryDate] = useState();
  const [returnCheckBoxValue, setReturnCheckBoxValue] = useState({
    RETURN_ON_EXPIRY: false,
    RETURN_ON_DAMAGE: false,
    RETURN_ON_DEAD_STOCK: false,
  });
  const [subCategoryCheckBoxValue, setSubCategoryCheckBoxValue] = useState({
    PRODUCT_REPLACEMENT: false,
    REPLACEMENT_ON_OTHER_PRODUCT: false,
    MONEY_REFUNDS: false,
    CREDIT_NOTE: false,
  });
  // const [subCategoryCheckBoxValue, setSubCategoryCheckBoxValue] = useState({
  //   RETURN_ON_EXPIRY: {
  //     PRODUCT_REPLACEMENT: false,
  //     REPLACEMENT_ON_OTHER_PRODUCT: false,
  //     MONEY_REFUNDS: false,
  //     CREDIT_NOTE: false,
  //   },
  //   RETURN_ON_DAMAGE: {
  //     PRODUCT_REPLACEMENT: false,
  //     REPLACEMENT_ON_OTHER_PRODUCT: false,
  //     MONEY_REFUNDS: false,
  //     CREDIT_NOTE: false,
  //   },
  //   RETURN_ON_DEAD_STOCK: {
  //     PRODUCT_REPLACEMENT: false,
  //     REPLACEMENT_ON_OTHER_PRODUCT: false,
  //     MONEY_REFUNDS: false,
  //     CREDIT_NOTE: false,
  //   },
  // });

  const [deliveryFullFillment, setDeliveryFullFillment] = useState([]);
  const [selectedReturnOptions, setSelectedReturnOptions] = useState([]);
  const [centralizedDeliveryFullFillment, setCentralizedDeliveryFullFillment] = useState([]);
  const [servicableAreas, setServicableAreas] = useState([]);
  const [searchServicableArea, setSearchServicableArea] = useState('');
  const [servicableOptions, setServicableOptions] = useState([]);
  const [shipmentMethods, setShipmentMethods] = useState({});
  const [centralizedShipmentMethods, setCentralizedShipmentMethods] = useState([]);
  const [displayStoreOptions, setDisplayStoreOptions] = useState([]);
  const [centralizedStore, setCentralizedStore] = useState([]);
  const [purchaseMethod, setPurchaseMethod] = useState('CENTRALIZED');
  const [deliveryMethod, setDeliveryMethod] = useState('CENTRALIZED_STORE');
  const [deliveryAddress, setDeliveryAddress] = useState({});
  const [deliveryStores, setDeliveryStores] = useState({});
  const [deliveryScheduleCentralized, setDeliveryScheduleCentralized] = useState(false);
  const frequencyDays = ['NONE', 'SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  const [centralizedStoreCount, setCentralizedStoreCount] = useState(1);
  const [storeLocationCount, setStoreLocationCount] = useState(1);
  const [vendorDeliveryId, setVendorDeliveryId] = useState('');
  const [configData, setConfigData] = useState({});
  const [deliveryAddressOp, setDeliveryAddressOp] = useState([]);
  // const vendorDeliveryPayload = useSelector(getVendorDeliveryPayload);
  // const vendorTermsPayload = useSelector(getVendorTermsPayload);
  // const vendorReturnsPayload = useSelector(getVendorReturnsPayload);

  const handlePurchaseMethodChange = (event) => {
    setPurchaseMethod(event.target.value);
  };
  const handleDeliveryMethodChange = (event) => {
    setDeliveryMethod(event.target.value);
  };

  const handleOptionChange = (selected) => {
    setSelected(selected);
  };
  const deleteEntry = (index) => {
    const updatedFullFillment = deliveryFullFillment?.filter((_, i) => i !== index);
    setDeliveryFullFillment(updatedFullFillment);
    setStoreLocationCount(storeLocationCount - 1);
  };
  const deleteEntryCentralized = (index) => {
    const updatedFullFillment = centralizedDeliveryFullFillment?.filter((_, i) => i !== index);
    setCentralizedDeliveryFullFillment(updatedFullFillment);
    setCentralizedStoreCount(centralizedStoreCount - 1);
  };
  const [inputlist, setInputlist] = useState([
    {
      prodOptions: [],
      productName: '',
      quantity: '',
      unit: '',
      productPrice: '',
      gst: '',
      discount: '',
      vendorProductPrice: '',
      gtin: '',
      images: '',
    },
  ]);
  const [autoCompleteDetailsRowIndex, setAutoCompleteDetailsRowIndex] = useState([]);
  const initialPurchaseOptions = [
    {
      label: 'Block purchase when credit limit exceeds',
      value: 'BLOCK_PURCHASE_WHEN_CREDIT_LIMIT_EXCEEDS',
      enabled: false,
    },
    {
      label: 'Block purchase when outstanding exceeds credit days',
      value: 'BLOCK_PURCHASE_WHEN_OUTSTANDING_EXCEEDS_CREDIT_DAYS',
      enabled: false,
    },
  ];
  const [purchaseOptions, setPurchaseOptions] = useState(initialPurchaseOptions);

  useEffect(() => {
    fetchOrganisations()
      .then((res) => {
        const retailData = res?.data?.data?.retails;
        const matchedRetail = retailData?.find((retail) => retail?.retailId === orgId);
        const branches = matchedRetail?.branches?.map((item) => ({ value: item?.branchId, label: item?.displayName }));
        setDisplayStoreOptions(branches || []);
      })
      .catch(() => {});
    getBranchAllAdresses(locId)
      .then((res) => {
        const addresses = res.data.data.addresses;
        const mixedAddresses = addresses?.map((address) => ({
          value: `${address?.addressLine1} ${address?.addressLine2}`,
          label: `${address?.addressLine1} ${address?.addressLine2}`,
        }));

        setDeliveryAddressOp(mixedAddresses || []);
      })
      .catch(() => {});
  }, []);

  // fetching vendor details and editing
  useEffect(() => {
    if (editVendorId && !isTermsDraft) {
      vendorDeliveryFullFillmentById(editVendorId)
        .then((res) => {
          const vendorDeliveryData = res?.data?.data?.object;
          setDeliveryScheduleCentralized(true);
          const deliveryOptions = vendorDeliveryData?.deliveryOptions;
          const centralizedOptions = vendorDeliveryData?.centralizedOptions;
          setStoreLocationCount(deliveryOptions?.length || 1);
          setCentralizedStoreCount(centralizedOptions?.length || 1);
          setVendorDeliveryId(vendorDeliveryData?.vendorDeliveryId);
          const servicableData = vendorDeliveryData?.serviceableAreas?.split('|') || [];
          setServicableAreas(servicableData?.map((item) => ({ value: item, label: item })));

          const purchaseMethodData = vendorDeliveryData?.purchaseMethods
            .filter((item) => item.flag)
            .map((item) => item.day);
          const deliveryLocData = vendorDeliveryData?.deliveryLocation
            .filter((item) => item.flag)
            .map((item) => item.deliveryLocation);
          setPurchaseMethod(...(purchaseMethodData || ''));
          setDeliveryMethod(...(deliveryLocData || ''));
          const deliveryDays = [];
          const centralizedDeliveryDays = [];
          const orderRequestData = [];
          const centralizedOrderRequestData = [];
          const deliveryFrequencyData = [];
          const centralizedDeliveryFrequency = [];
          const deliveryStoresData = [];
          const centralizedDeliveryStores = [];
          const deliveryLocationData = [];
          const deliveryDateData = [];
          const centralizedDeliveryDateData = [];
          const orderRequestDate = [];
          const centralizedOrderRequestDate = [];
          deliveryOptions?.map((item, index) => {
            const filteredData = item?.deliveryDays.filter((item) => item.flag).map((item) => item.day);
            const filteredOrderData = item?.orderRequest.filter((item) => item.flag).map((item) => item.day);
            deliveryDays[index] = filteredData?.map((item) => ({ value: item, label: item }));
            orderRequestData[index] = filteredOrderData?.map((item) => ({ value: item, label: item }));
            deliveryFrequencyData[index] = item?.deliveryFrequency;
            deliveryStoresData[index] = item?.deliveryStores;
            deliveryLocationData[index] = item?.deliveryAddress;
            deliveryDateData[index] = item?.deliveryDays?.map((item) => item?.date).join(', ') || '';
            orderRequestDate[index] = item?.orderRequest?.map((item) => item?.date).join(', ') || '';
          });
          deliveryDays?.map((item, index) => {
            setDeliveryFullFillment((prevState) => {
              const newState = [...prevState];
              newState[index] = { ...newState[index], deliveryDays: item };
              newState[index] = { ...newState[index], deliveryDate: deliveryDateData[index] };
              newState[index] = { ...newState[index], orderRequestDate: orderRequestDate[index] };
              newState[index] = { ...newState[index], deliveryFrequency: deliveryFrequencyData[index] || '' };
              newState[index] = { ...newState[index], deliveryStores: deliveryStoresData[index] || '' };
              newState[index] = { ...newState[index], deliveryAddress: deliveryLocationData[index] || '' };
              return newState;
            });
          });
          orderRequestData?.map((item, index) => {
            setDeliveryFullFillment((prevState) => {
              const newState = [...prevState];
              newState[index] = { ...newState[index], orderRequestDays: item };
              return newState;
            });
          });
          centralizedOptions?.map((item, index) => {
            const filteredData = item?.centralizedDeliveryDays.filter((item) => item.flag).map((item) => item.day);
            centralizedDeliveryDays[index] = filteredData?.map((item) => ({ value: item, label: item }));
            const filteredOrderData = item?.centralizedOrderRequest.filter((item) => item.flag).map((item) => item.day);
            centralizedOrderRequestData[index] = filteredOrderData?.map((item) => ({ value: item, label: item }));
            centralizedDeliveryFrequency[index] = item?.centralizedDeliveryFrequency;
            centralizedDeliveryStores[index] = item?.centralizedStores;
            centralizedDeliveryDateData[index] = item?.centralizedDeliveryDays?.map((item) => item?.date).join(', ');
            centralizedOrderRequestDate[index] = item?.centralizedOrderRequest?.map((item) => item?.date).join(', ');
          });
          centralizedDeliveryDays?.map((item, index) => {
            setCentralizedDeliveryFullFillment((prevState) => {
              const newState = [...prevState];
              newState[index] = { ...newState[index], centralizedDeliveryDays: item };
              newState[index] = {
                ...newState[index],
                centralizedDeliveryFrequency: centralizedDeliveryFrequency[index] || '',
              };
              newState[index] = {
                ...newState[index],
                centralizedDeliveryStores: centralizedDeliveryStores[index] || '',
              };
              newState[index] = {
                ...newState[index],
                centralizedDeliveryDate: centralizedDeliveryDateData[index] || '',
              };
              newState[index] = {
                ...newState[index],
                centralizedOrderRequestDate: centralizedOrderRequestDate[index] || '',
              };
              return newState;
            });
          });
          centralizedOrderRequestData?.map((item, index) => {
            setCentralizedDeliveryFullFillment((prevState) => {
              const newState = [...prevState];
              newState[index] = { ...newState[index], centralizedOrderRequest: item };
              return newState;
            });
          });
        })
        .catch(() => {});

      vendorPaymentTermstById(editVendorId)
        .then((res) => {
          const purchaseData = res?.data?.data?.object;
          const paymentOptions = purchaseData?.paymentOptions?.filter((item) => item?.flag);
          const purchaseTerms = purchaseData?.purchaseTerms?.filter((item) => item?.flag);
          setPurchaseTerms(purchaseTerms?.map((item) => item?.paymentOption) || []);

          setPurchaseData(purchaseData);
          setSelectedPaymentTerms({
            value: purchaseData?.paymentTerms || '',
            label: textFormatter(purchaseData?.paymentTerms || ''),
          });
          const vendorPuchase = purchaseData?.vendorPurchase?.[0];
          setSelectedPayoutFrequency({
            value: vendorPuchase?.payoutFrequency || '',
            label: textFormatter(vendorPuchase?.payoutFrequency || ''),
          });
          setCreditDays(purchaseData?.creditDays || '');
          setCreditLimit(purchaseData?.creditLimit || '');
          const updatedPaymentOptions = initialPaymentOptions.map((option) => {
            const match = paymentOptions.find((apiOption) => apiOption.paymentOption === option.value);
            return match ? { ...option, enabled: match.flag } : option;
          });
          const updatedPurchaseOptions = initialPurchaseOptions.map((option) => {
            const match = purchaseTerms.find((apiOption) => apiOption.paymentOption === option.value);
            return match ? { ...option, enabled: match.flag } : option;
          });

          setPaymentOptions(updatedPaymentOptions || []);
          setPurchaseOptions(updatedPurchaseOptions);
        })
        .catch(() => {});

      vendorReturnAndReplacementById(editVendorId).then((res) => {
        const vendorReturnsPayload = res?.data?.data?.object;
        setVendorReturnObj(vendorReturnsPayload || {});
        const filteredVendorReturns = vendorReturnsPayload?.vendorReturn?.filter((vr) => vr.flag);
        const formatedVendorReturns = filteredVendorReturns.map((vr) => ({
          value: vr.vendorReturn || '',
          label: textFormatter(vr?.vendorReturn || ''),
        }));
        setSelectedReturnOptions(formatedVendorReturns || []);
        const updatedSubCategoryCheckBoxValue = { ...subCategoryCheckBoxValue };

        filteredVendorReturns?.forEach((vr) => {
          vr?.subCategory?.forEach((sub) => {
            if (updatedSubCategoryCheckBoxValue?.hasOwnProperty(sub?.vendorReturn)) {
              updatedSubCategoryCheckBoxValue[sub.vendorReturn] = sub?.flag;
            }
          });
        });

        // Update the state with the new values
        setSubCategoryCheckBoxValue(updatedSubCategoryCheckBoxValue);
      });
    }
  }, [editVendorId]);

  // fetching and edit vendor from draft details
  useEffect(() => {
    getVendorDraftDetails(vendorDraftCode)
      .then((res) => {
        const vendorConfigData = res?.data?.data?.object?.config;
        const vendorDeliveryData = vendorConfigData?.vendorDeliveryPayload;
        const vendorReturnsPayload = vendorConfigData?.vendorReturnsPayload;
        const purchaseData = vendorConfigData?.vendorTermsPayload;
        const timeStamp = res?.data?.data?.object?.updated || res?.data?.data?.object?.created;
        const givenMoment = moment.utc(timeStamp);
        dispatch(setVendorAutoSaveTime(givenMoment.toISOString()));
        setConfigData(vendorConfigData || {});
        let fetchDraft = false;
        if (location.pathname === '/purchase/add-vendor') {
          fetchDraft = vendorDraftCode;
        } else {
          fetchDraft = vendorDraftCode && isTermsDraft;
        }
        // setting delivery fullfilment values
        if (fetchDraft && vendorDeliveryData) {
          setShipmentMethods({
            value: vendorDeliveryData?.shipmentMethods,
            label: textFormatter(vendorDeliveryData?.shipmentMethods || ''),
          });
          const deliveryOptions = vendorDeliveryData?.deliveryOptions;
          const centralizedOptions = vendorDeliveryData?.centralizedOptions;
          setStoreLocationCount(deliveryOptions?.length || 1);
          setCentralizedStoreCount(centralizedOptions?.length || 1);
          setVendorDeliveryId(vendorDeliveryData?.vendorDeliveryId);
          const servicableData = vendorDeliveryData?.serviceableAreas?.split('|') || [];
          setServicableAreas(servicableData?.map((item) => ({ value: item, label: item })));

          const purchaseMethodData = vendorDeliveryData?.purchaseMethods
            .filter((item) => item.flag)
            .map((item) => item.day);
          const deliveryLocData = vendorDeliveryData?.deliveryLocation
            .filter((item) => item.flag)
            .map((item) => item.deliveryLocation);
          setPurchaseMethod(...(purchaseMethodData || ''));
          setDeliveryMethod(...(deliveryLocData || ''));
          const deliveryDays = [];
          const centralizedDeliveryDays = [];
          const orderRequestData = [];
          const centralizedOrderRequestData = [];
          const deliveryFrequencyData = [];
          const centralizedDeliveryFrequency = [];
          const deliveryStoresData = [];
          const centralizedDeliveryStores = [];
          const deliveryLocationData = [];
          const deliveryDateData = [];
          const centralizedDeliveryDateData = [];
          const orderRequestDate = [];
          const centralizedOrderRequestDate = [];
          deliveryOptions?.map((item, index) => {
            const filteredData = item?.deliveryDays.filter((item) => item.flag).map((item) => item.day);
            const filteredOrderData = item?.orderRequest.filter((item) => item.flag).map((item) => item.day);
            deliveryDays[index] = filteredData?.map((item) => ({ value: item, label: item }));
            orderRequestData[index] = filteredOrderData?.map((item) => ({ value: item, label: item }));
            deliveryFrequencyData[index] = item?.deliveryFrequency;
            deliveryStoresData[index] = item?.deliveryStores;
            deliveryLocationData[index] = item?.deliveryAddress;
            deliveryDateData[index] = item?.deliveryDays?.map((item) => item?.date).join(', ') || '';
            orderRequestDate[index] = item?.orderRequest?.map((item) => item?.date).join(', ') || '';
          });
          deliveryDays?.map((item, index) => {
            setDeliveryFullFillment((prevState) => {
              const newState = [...prevState];
              newState[index] = { ...newState[index], deliveryDays: item };
              newState[index] = { ...newState[index], deliveryDate: deliveryDateData[index] };
              newState[index] = { ...newState[index], orderRequestDate: orderRequestDate[index] };
              newState[index] = { ...newState[index], deliveryFrequency: deliveryFrequencyData[index] || '' };
              newState[index] = { ...newState[index], deliveryStores: deliveryStoresData[index] || '' };
              newState[index] = { ...newState[index], deliveryAddress: deliveryLocationData[index] || '' };
              return newState;
            });
          });
          orderRequestData?.map((item, index) => {
            setDeliveryFullFillment((prevState) => {
              const newState = [...prevState];
              newState[index] = { ...newState[index], orderRequestDays: item };
              return newState;
            });
          });
          centralizedOptions?.map((item, index) => {
            const filteredData = item?.centralizedDeliveryDays.filter((item) => item.flag).map((item) => item.day);
            centralizedDeliveryDays[index] = filteredData?.map((item) => ({ value: item, label: item }));
            const filteredOrderData = item?.centralizedOrderRequest.filter((item) => item.flag).map((item) => item.day);
            centralizedOrderRequestData[index] = filteredOrderData?.map((item) => ({ value: item, label: item }));
            centralizedDeliveryFrequency[index] = item?.centralizedDeliveryFrequency;
            centralizedDeliveryStores[index] = item?.centralizedStores;
          });
          centralizedDeliveryDays?.map((item, index) => {
            setCentralizedDeliveryFullFillment((prevState) => {
              const newState = [...prevState];
              newState[index] = { ...newState[index], centralizedDeliveryDays: item };
              newState[index] = {
                ...newState[index],
                centralizedDeliveryFrequency: centralizedDeliveryFrequency[index] || '',
              };
              newState[index] = {
                ...newState[index],
                centralizedDeliveryStores: centralizedDeliveryStores[index] || '',
              };
              return newState;
            });
            newState[index] = {
              ...newState[index],
              centralizedDeliveryDate: centralizedDeliveryDateData[index] || '',
            };
            newState[index] = {
              ...newState[index],
              centralizedOrderRequestDate: centralizedOrderRequestDate[index] || '',
            };
          });
          centralizedOrderRequestData?.map((item, index) => {
            setCentralizedDeliveryFullFillment((prevState) => {
              const newState = [...prevState];
              newState[index] = { ...newState[index], centralizedOrderRequest: item };
              return newState;
            });
          });
        }

        // setting data for  purchase terms
        if (fetchDraft && purchaseData) {
          const paymentOptions = purchaseData?.paymentOptions?.filter((item) => item?.flag);
          const purchaseTerms = purchaseData?.purchaseTerms?.filter((item) => item?.flag);
          setPurchaseTerms(purchaseTerms?.map((item) => item?.paymentOption) || []);

          setPurchaseData(purchaseData);
          setSelectedPaymentTerms({
            value: purchaseData?.paymentTerms || '',
            label: textFormatter(purchaseData?.paymentTerms || ''),
          });
          const vendorPuchase = purchaseData?.vendorPurchase?.[0];
          setSelectedPayoutFrequency({
            value: vendorPuchase?.payoutFrequency || '',
            label: textFormatter(vendorPuchase?.payoutFrequency || ''),
          });
          setCreditDays(purchaseData?.creditDays || '');
          setCreditLimit(purchaseData?.creditLimit || '');
          const updatedPaymentOptions = initialPaymentOptions.map((option) => {
            const match = paymentOptions.find((apiOption) => apiOption.paymentOption === option.value);
            return match ? { ...option, enabled: match.flag } : option;
          });
          // const updatedPurchaseptions = initialPurchaseOptions.map((option) => {
          //   const match = purchaseOptions.find((apiOption) => apiOption.paymentOption === option.value);
          //   return match ? { ...option, enabled: match.flag } : option;
          // });
          const updatedPurchaseOptions = initialPurchaseOptions.map((option) => {
            const match = purchaseTerms.find((apiOption) => {
              return apiOption.paymentOption === option.value;
            });
            return match ? { ...option, enabled: true } : option;
          });
          setPaymentOptions(updatedPaymentOptions || []);
          setPurchaseOptions(updatedPurchaseOptions || []);
        }

        // setting data for returns
        if (fetchDraft && vendorReturnsPayload) {
          const filteredVendorReturns = vendorReturnsPayload?.vendorReturn?.filter((vr) => vr.flag);
          const formatedVendorReturns = filteredVendorReturns.map((vr) => ({
            value: vr.vendorReturn || '',
            label: textFormatter(vr?.vendorReturn || ''),
          }));
          setSelectedReturnOptions(formatedVendorReturns || []);
          const updatedSubCategoryCheckBoxValue = { ...subCategoryCheckBoxValue };

          filteredVendorReturns?.forEach((vr) => {
            vr?.subCategory?.forEach((sub) => {
              if (updatedSubCategoryCheckBoxValue?.hasOwnProperty(sub?.vendorReturn)) {
                updatedSubCategoryCheckBoxValue[sub.vendorReturn] = sub?.flag;
              }
            });
          });

          // Update the state with the new values
          setSubCategoryCheckBoxValue(updatedSubCategoryCheckBoxValue);
        }
      })
      .catch(() => {});
  }, []);

  const updateDeliveryFrequency = (index, value) => {
    setCentralizedDeliveryFullFillment((prevState) => {
      const newState = [...prevState];
      newState[index] = { ...newState[index], centralizedDeliveryFrequency: value };
      return newState;
    });
  };
  const updateOrderRequestDays = (index, value) => {
    setCentralizedDeliveryFullFillment((prevState) => {
      const newState = [...prevState];
      newState[index] = { ...newState[index], centralizedOrderRequest: value };
      return newState;
    });
  };
  const updateDeliveryDays = (index, value) => {
    setCentralizedDeliveryFullFillment((prevState) => {
      const newState = [...prevState];
      newState[index] = { ...newState[index], centralizedDeliveryDays: value };
      return newState;
    });
  };
  const handlePayments = (event) => {
    const { value, checked } = event.target;
    setPaymentOptions((prevState) =>
      prevState.map((option) => (option.value === value ? { ...option, enabled: checked } : option)),
    );
    const chkLabel = event.target.value;
    if (checked) {
      if (!payment.includes(chkLabel)) {
        setPayment([...payment, chkLabel]);
      }
    } else {
      if (payment.includes(chkLabel)) {
        setPayment(payment.filter((term) => term !== chkLabel));
      }
    }
  };

  const handlePurchase = (event, isChecked) => {
    const { value, checked } = event.target;
    setPurchaseOptions((prevState) =>
      prevState.map((option) => (option.value === value ? { ...option, enabled: checked } : option)),
    );
    const chklabel = event.target.value;
    if (isChecked) {
      if (!purchaseTerms?.includes(chklabel)) {
        setPurchaseTerms([...purchaseTerms, chklabel]);
      }
    } else {
      if (purchaseTerms.includes(chklabel)) {
        setPurchaseTerms(purchaseTerms?.filter((term) => term !== chklabel));
      }
    }
  };

  const submitHandler = () => {
    const payload = {
      creditLimit: creditLimit,
      creditDays: creditDays,
      purchaseOptions: payment,
      purchaseTerms: purchaseTerms,
    };

    const vendorId = localStorage.getItem('vendorId');
    saveVendorPurchaseTerm(vendorId, payload).then(function (response) {});
    navigate('/purchase/vendors');
  };

  const backToVendorlist = () => {
    navigate('/purchase/vendors');
  };

  const handleSubCatergoryChange = (name) => (event) => {
    const { checked } = event.target;
    setSubCategoryCheckBoxValue((prevValues) => ({
      ...prevValues,
      [name]: checked,
    }));
  };

  const getVendorDelivery = () => {
    const deliveryDaysData = deliveryFullFillment?.map((item) => item?.deliveryDays?.map((day) => day.value));
    const orderRequestDayData = deliveryFullFillment?.map((item) => item?.orderRequestDays?.map((day) => day.value));
    const centralizedDeliveryData = centralizedDeliveryFullFillment?.map((item) =>
      item?.centralizedDeliveryDays?.map((day) => day.value),
    );

    const centralizedOrderRequestData = centralizedDeliveryFullFillment?.map((item) =>
      item?.centralizedOrderRequest?.map((day) => day.value),
    );

    const vendorIdData = editVendorId ? editVendorId : vendorId;
    const newPayload = {
      vendorId: vendorIdData || '',
      serviceableAreas: servicableAreas?.map((option) => option?.value).join(' | '),

      deliveryOptions: deliveryFullFillment?.map((item, index) => {
        if (!item) {
          return null;
        }
        let deliveryDays;
        let orderRequest;

        if (item?.deliveryFrequency === 'MONTHLY' || item?.deliveryFrequency === 'ON_DEMAND') {
          deliveryDays = ['NONE']?.map((day) => ({ day: day, date: item?.deliveryDate, flag: 'true' }));
          orderRequest = ['NONE']?.map((day) => ({ day: day, date: item?.orderRequestDate, flag: 'true' }));
        } else {
          deliveryDays = frequencyDays?.map((day) => ({
            day: day,
            flag: deliveryDaysData[index]?.includes(day) || false,
          }));

          orderRequest = frequencyDays?.map((day) => ({
            day: day,
            flag: orderRequestDayData[index]?.includes(day) || false,
          }));
        }

        return {
          deliveryDays,
          orderRequest,
          deliveryFrequency: item?.deliveryFrequency || null,
          deliveryStores: item?.deliveryStores || null,
          deliveryAddress: item?.deliveryAddress || null,
        };
      }),
      purchaseMethods: [
        {
          day: 'CENTRALIZED',
          flag: purchaseMethod === 'CENTRALIZED',
        },
        {
          day: 'BY_STORES',
          flag: purchaseMethod === 'BY_STORES',
        },
        {
          day: 'BOTH',
          flag: purchaseMethod === 'BOTH',
        },
      ],
      deliveryLocation: [
        {
          deliveryLocation: 'CENTRALIZED_STORE',
          flag: deliveryMethod === 'CENTRALIZED_STORE',
        },
        {
          deliveryLocation: 'STORE_LOCATION',
          flag: deliveryMethod === 'STORE_LOCATION',
        },
      ],
      shipmentMethods: shipmentMethods?.value || '',
      enableDeliveryScheduleCentralized: deliveryScheduleCentralized,

      centralizedOptions: centralizedDeliveryFullFillment.map((item, index) => {
        if (!item) {
          return null;
        }
        const centralizedDeliveryDays = frequencyDays?.map((day) => ({
          day: day,
          flag: centralizedDeliveryData[index]?.includes(day) || false,
        }));

        const centralizedOrderRequest = frequencyDays?.map((day) => ({
          day: day,
          flag: centralizedOrderRequestData[index]?.includes(day) || false,
        }));

        return {
          centralizedDeliveryDays,
          centralizedOrderRequest,
          centralizedDeliveryFrequency: item?.centralizedDeliveryFrequency,
          centralizedStores: '',
        };
      }),
      centralizedShipmentMethods: centralizedShipmentMethods?.length > 0 ? centralizedShipmentMethods : '',
      createdBy: createdById,
      createdByName: userName,
    };
    if (editVendorId) {
      newPayload.vendorDeliveryId = vendorDeliveryId || '';
    }
    return newPayload;
    // dispatch(setVendorDeliveryPayload(newPayload));
    // if (editVendorId) {
    //   (newPayload.vendorDeliveryId = vendorDeliveryId || ''),
    //     vendorDeliveryFullFillmentEdit(newPayload)
    //       .then((res) => {
    //         // console.log(res?.data?.data);
    //       })
    //       .catch(() => {});
    // } else {
    //   createVendorDelivery(newPayload)
    //     .then((res) => {
    //       if (res?.data?.data?.es === 1) {
    //         showSnackBar(res?.data?.data?.message, 'error');
    //       }
    //     })
    //     .catch(() => {});
    // }
  };

  const getVendorReturns = () => {
    const vendorReturnType = ['RETURN_ON_EXPIRY', 'RETURN_ON_DAMAGE', 'RETURN_ON_DEAD_STOCK'];
    const subCategoryType = ['PRODUCT_REPLACEMENT', 'REPLACEMENT_ON_OTHER_PRODUCT', 'MONEY_REFUNDS', 'CREDIT_NOTE'];

    const vendorReturnData = vendorReturnType?.map((returnitem) => ({
      vendorReturn: returnitem,
      subCategory: subCategoryType?.map((item) => ({
        vendorReturn: item,
        flag: subCategoryCheckBoxValue?.[item],
      })),
      flag: selectedReturnOptions?.some((option) => option.value === returnitem),
    }));
    // -----------------------------------------------------------------
    const vendorIdData = editVendorId ? editVendorId : vendorId;

    const payload = {
      // vendorReturnId: 'string',
      vendorId: vendorIdData,
      vendorReturn: vendorReturnData,
      createdBy: createdById,
      createdByName: userName,
    };
    if (editVendorId) {
      payload.vendorReturnId = vendorReturnObj?.vendorReturnId;
    }
    // dispatch(setVendorReturnsPayload(payload));
    return payload;

    //   createVendorReturns(payload)
    //     .then((res) => {
    //       if (res?.data?.data?.es === 1) {
    //         showSnackBar(res?.data?.data?.message, 'error');
    //       }
    //       handleTab(3);
    //     })
    //     .catch(() => {});
    // } else {
    // }
  };

  const getPaymentTerms = () => {
    const vendorIdData = editVendorId ? editVendorId : vendorId;

    const payload = {
      vendorId: vendorIdData,
      paymentTerms: selectedPaymentTerms?.value || '',
      vendorPurchase: [
        {
          payoutFrequency: selectedPayoutFrequency?.value || null,
          deliveryFrequency: selectedPayoutFrequency?.value === 'WEEKLY',
          date: onSaleDeliveryDate,
          deliveryDays: onSaleDeliveryDays?.map((item) => item?.value) || [],
        },
      ],
      paymentOptions: paymentOptions?.map((item) => ({
        paymentOption: item?.value,
        notes: item?.inputValue || '',
        flag: item?.enabled,
      })),

      creditLimit: creditLimit,
      creditDays: creditDays,
      purchaseTerms: purchaseOptions?.map((item) => ({ paymentOption: item?.value, notes: '', flag: item?.enabled })),
      createdBy: createdById,
      createdByName: userName,
    };
    // dispatch(setVendorTermsPayload(payload));
    if (editVendorId) {
      payload.vendorPurchaseId = purchaseData?.vendorPurchaseId || '';
    }
    return payload;

    // if (editVendorId) {
    //   (payload.vendorPurchaseId = purchaseData?.vendorPurchaseId || ''),
    //     updateVendorPaymentTerms(payload)
    //       .then((res) => {
    //         if (res?.data?.data?.es === 1) {
    //           showSnackBar(res?.data?.data?.message, 'error');
    //         }
    //       })
    //       .catch(() => {});
    // } else {
    //   createVendorPaymentTerms(payload)
    //     .then((res) => {
    //       if (res?.data?.data?.es === 1) {
    //         showSnackBar(res?.data?.data?.message, 'error');
    //       }
    //     })
    //     .catch(() => {});
    // }
  };

  const handleAutoSaveDetails = (autoSavePayload) => {
    autoSaveVendorDetails(autoSavePayload)
      .then((res) => {
        dispatch(setIsTermsDraft(true));

        if (location.pathname !== '/purchase/add-vendor') {
          handleTab(3);
        }
      })

      .catch(() => {});
  };
  const handleCreateTermsNext = async () => {
    try {
      const autoSavePayload = {
        // id: 0,
        // code: 'string',
        config: {
          ...(configData || {}),
          // vendorTermsPayload: vendorPayloads?.terms,
          // vendorReturnsPayload: vendorPayloads?.returns,
          // vendorDeliveryPayload: vendorPayloads?.delivery,
        },
        createdBy: createdById,
        createdByName: userName,
      };
      if (vendorDraftCode) {
        autoSavePayload.code = vendorDraftCode;
      }

      autoSavePayload.config.vendorTermsPayload = await getPaymentTerms();
      autoSavePayload.config.vendorReturnsPayload = await getVendorReturns();
      autoSavePayload.config.vendorDeliveryPayload = await getVendorDelivery();

      handleAutoSaveDetails(autoSavePayload);
    } catch (error) {
      console.log(error);
      showSnackBar('Some error occured', 'error');
    }
  };

  useEffect(() => {
    if (deliveryMethod === 'STORE_LOCATION') {
      setDeliveryScheduleCentralized(false);
      setStoreLocationCount(1);
    } else {
      setStoreLocationCount(1);
    }
    if (purchaseMethod === 'BOTH') {
      setDeliveryScheduleCentralized(true);
      setCentralizedStoreCount(1);
    } else if (purchaseMethod === 'CENTRALIZED') {
      setDeliveryScheduleCentralized(false);
      setCentralizedStoreCount(1);
    }
  }, [deliveryMethod, purchaseMethod]);

  useEffect(() => {
    if (!google || !searchServicableArea) {
      return;
    }

    const autocompleteService = new google.maps.places.AutocompleteService();

    autocompleteService.getPlacePredictions(
      {
        input: searchServicableArea,
        types: ['geocode'],
      },
      (predictions, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
          const locationOptions = predictions?.map((item) => ({
            value: item?.description,
            label: `📌 ${item?.description}`,
          }));
          setServicableOptions(locationOptions || []);
        } else {
          console.error('Prediction request failed with status:', status);
        }
      },
    );
  }, [google, searchServicableArea]);

  const handleChange = () => {
    // onChange(inputRef.current.value);
  };

  const handleInputChange = (value, index) => {
    setPaymentOptions((prevState) => {
      const updatedOptions = [...prevState];
      updatedOptions[index].inputValue = value;
      return updatedOptions;
    });
  };

  const handleDeleteChip = (itemToDelete) => {
    setServicableAreas((prevAreas) => prevAreas.filter((item) => item.value !== itemToDelete.value));
  };
  return (
    <SoftBox>
      <Card className="addbrand-Box">
        <SoftTypography variant="label" className="label-heading">
          Product Fullfillment
          <Grid container spacing={2} mt={0.1}>
            <Grid item xs={12}>
              <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767', margin: '5px 5px 5px 3px' }}>
                Servicable areas
              </InputLabel>
              <div style={{ width: '350px' }}>
                <Autocomplete
                  size="small"
                  multiple
                  sx={{
                    '& .MuiAutocomplete-tag': {
                      display: 'none',
                    },
                  }}
                  options={servicableOptions || []}
                  onChange={(event, newValue) => {
                    setServicableAreas(newValue);
                  }}
                  value={servicableAreas}
                  getOptionLabel={(option) => option?.label || ''}
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Search servicable area"
                      onChange={(e) => setSearchServicableArea(e?.target?.value)}
                    />
                  )}
                />
              </div>
              {servicableAreas?.map((item, index) => (
                // <p>{item?.value || ''}</p>
                <Chip label={item?.value || ''} style={{ margin: '3px' }} onDelete={() => handleDeleteChip(item)} />
              ))}
            </Grid>
            <Grid item xs={12} md={5}>
              <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767', margin: '5px 5px 5px 3px' }}>
                Purchase methods
              </InputLabel>
              <div style={{ marginLeft: '10px' }}>
                <RadioGroup
                  name="purchase-method"
                  value={purchaseMethod}
                  onChange={handlePurchaseMethodChange}
                  row
                  style={{ gap: '15px' }}
                >
                  <FormControlLabel value="CENTRALIZED" label="Centralized" control={<Radio />} />
                  <FormControlLabel value="BY_STORES" label="By stores" control={<Radio />} />
                  <FormControlLabel value="BOTH" label="Both" control={<Radio />} />
                </RadioGroup>
              </div>
            </Grid>
            <Grid item xs={12} md={6}>
              <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767', margin: '5px 5px 5px 3px' }}>
                Shipment methods
              </InputLabel>
              <div style={{ width: '350px' }}>
                <SoftSelect
                  value={shipmentMethods}
                  size="small"
                  options={[
                    { value: 'BY_VENDOR', label: 'By vendor' },
                    { value: 'OWN_SHIPMENT', label: 'Own Shipment' },
                  ]}
                  onChange={(e) => setShipmentMethods(e)}
                ></SoftSelect>
              </div>
            </Grid>

            {/* delivery methods */}
            {purchaseMethod !== 'BY_STORES' ? (
              <>
                <Grid item xs={12}>
                  <InputLabel
                    sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767', margin: '5px 5px 5px 3px' }}
                  >
                    Delivery
                  </InputLabel>
                  <div style={{ marginLeft: '10px' }}>
                    <RadioGroup
                      name="deliveryMethods"
                      defaultValue="CENTRALIZED"
                      value={deliveryMethod}
                      onChange={handleDeliveryMethodChange}
                      row
                      style={{ gap: '15px' }}
                    >
                      <FormControlLabel value="CENTRALIZED_STORE" label="Centralized location" control={<Radio />} />
                      <FormControlLabel value="STORE_LOCATION" label="Store location" control={<Radio />} />
                    </RadioGroup>
                  </div>
                </Grid>
                {Array.from({ length: storeLocationCount }).map((_, index) => (
                  <>
                    {deliveryMethod === 'STORE_LOCATION' ? (
                      <Grid item xs={12} md={4}>
                        {index === 0 && (
                          <InputLabel
                            sx={{
                              fontWeight: 'bold',
                              fontSize: '0.75rem',
                              color: '#344767',
                              margin: '5px 5px 5px 3px',
                            }}
                          >
                            Select stores
                          </InputLabel>
                        )}
                        <SoftSelect
                          size="small"
                          value={{
                            value: deliveryFullFillment[index]?.deliveryStores || '',
                            label: deliveryFullFillment[index]?.deliveryStores || 'Select  stores',
                          }}
                          options={displayStoreOptions || []}
                          placeholder="Select stores"
                          onChange={(e) =>
                            setDeliveryFullFillment((prevState) => {
                              const newState = [...prevState];
                              newState[index] = { ...newState[index], deliveryStores: e?.label };
                              return newState;
                            })
                          }
                        ></SoftSelect>
                      </Grid>
                    ) : (
                      <Grid item xs={12} md={4}>
                        {index === 0 && (
                          <InputLabel
                            sx={{
                              fontWeight: 'bold',
                              fontSize: '0.75rem',
                              color: '#344767',
                              margin: '5px 5px 5px 3px',
                            }}
                          >
                            Delivery Address
                          </InputLabel>
                        )}
                        <SoftSelect
                          value={{
                            value: deliveryFullFillment[index]?.deliveryAddress || '',
                            label: deliveryFullFillment[index]?.deliveryAddress || 'Select  Address',
                          }}
                          options={deliveryAddressOp || []}
                          size="small"
                          onChange={(e) =>
                            setDeliveryFullFillment((prevState) => {
                              const newState = [...prevState];
                              newState[index] = { ...newState[index], deliveryAddress: e?.label };
                              return newState;
                            })
                          }
                          placeholder="Select address"
                        ></SoftSelect>
                      </Grid>
                    )}
                    <Grid item xs={12} md={2}>
                      {index === 0 && (
                        <InputLabel
                          sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767', margin: '5px 5px 5px 3px' }}
                        >
                          Delivery Frequency
                        </InputLabel>
                      )}
                      <SoftSelect
                        size="small"
                        value={{
                          value: deliveryFullFillment[index]?.deliveryFrequency || '',
                          label: deliveryFullFillment[index]?.deliveryFrequency || 'select  Frequency',
                        }}
                        menuPortalTarget={document.body}
                        id="status"
                        placeholder="select  Frequency"
                        options={[
                          { value: 'DAILY', label: 'Daily' },
                          { value: 'WEEKLY', label: 'Weekly' },
                          { value: 'FORTNIGHT', label: 'Fortnight' },
                          { value: 'MONTHLY', label: 'Monthly' },
                          { value: 'ON_DEMAND', label: 'On Demand' },
                        ]}
                        onChange={(e) =>
                          setDeliveryFullFillment((prevState) => {
                            const newState = [...prevState];
                            newState[index] = { ...newState[index], deliveryFrequency: e?.value };
                            return newState;
                          })
                        }
                      ></SoftSelect>
                    </Grid>
                    {deliveryFullFillment[index]?.deliveryFrequency !== 'DAILY' &&
                    deliveryFullFillment[index]?.deliveryFrequency !== 'ON_DEMAND' ? (
                      <>
                        <Grid item xs={12} md={3}>
                          {index === 0 && (
                            <InputLabel
                              sx={{
                                fontWeight: 'bold',
                                fontSize: '0.75rem',
                                color: '#344767',
                                margin: '5px 5px 5px 3px',
                              }}
                            >
                              Order Request Day(s)
                            </InputLabel>
                          )}
                          {deliveryFullFillment[index]?.deliveryFrequency === 'MONTHLY' ? (
                            <SoftInput
                              value={deliveryFullFillment[index]?.orderRequestDate || ''}
                              type="date"
                              size="small"
                              onChange={(e) => {
                                setDeliveryFullFillment((prevState) => {
                                  const newState = [...prevState];
                                  newState[index] = { ...newState[index], orderRequestDate: e?.target?.value };
                                  return newState;
                                });
                              }}
                            ></SoftInput>
                          ) : (
                            <SoftSelect
                              size="small"
                              isMulti
                              value={deliveryFullFillment[index]?.orderRequestDays || []}
                              menuPortalTarget={document.body}
                              id="status"
                              options={[
                                { value: 'NONE', label: 'none' },
                                { value: 'SUNDAY', label: 'Sunday' },
                                { value: 'MONDAY', label: 'Monday' },
                                { value: 'TUESDAY', label: 'Tuesday' },
                                { value: 'WEDNESDAY', label: 'Wednesday' },
                                { value: 'THURSDAY', label: 'Thursday' },
                                { value: 'FRIDAY', label: 'Friday' },
                                { value: 'SATURDAY', label: 'Saturday' },
                              ]}
                              onChange={(e) => {
                                setDeliveryFullFillment((prevState) => {
                                  const newState = [...prevState];
                                  newState[index] = { ...newState[index], orderRequestDays: e };
                                  return newState;
                                });
                              }}
                            ></SoftSelect>
                          )}
                        </Grid>
                        <Grid item xs={12} md={3} display="flex">
                          <div>
                            {index === 0 && (
                              <InputLabel
                                sx={{
                                  fontWeight: 'bold',
                                  fontSize: '0.75rem',
                                  color: '#344767',
                                  margin: '5px 5px 5px 3px',
                                }}
                              >
                                Delivery day(s)
                              </InputLabel>
                            )}
                            {deliveryFullFillment[index]?.deliveryFrequency === 'MONTHLY' ? (
                              <div>
                                <SoftInput
                                  value={deliveryFullFillment[index]?.deliveryDate || ''}
                                  type="date"
                                  size="small"
                                  className="inputStyle"
                                  onChange={(e) =>
                                    setDeliveryFullFillment((prevState) => {
                                      const newState = [...prevState];
                                      newState[index] = { ...newState[index], deliveryDate: e?.target?.value };
                                      return newState;
                                    })
                                  }
                                ></SoftInput>
                              </div>
                            ) : (
                              <SoftSelect
                                className="inputStyle"
                                size="small"
                                isMulti
                                menuPortalTarget={document.body}
                                id="status"
                                value={deliveryFullFillment[index]?.deliveryDays || []}
                                options={[
                                  { value: 'NONE', label: 'none' },
                                  { value: 'SUNDAY', label: 'Sunday' },
                                  { value: 'MONDAY', label: 'Monday' },
                                  { value: 'TUESDAY', label: 'Tuesday' },
                                  { value: 'WEDNESDAY', label: 'Wednesday' },
                                  { value: 'THURSDAY', label: 'Thursday' },
                                  { value: 'FRIDAY', label: 'Friday' },
                                  { value: 'SATURDAY', label: 'Saturday' },
                                ]}
                                onChange={(e) =>
                                  setDeliveryFullFillment((prevState) => {
                                    const newState = [...prevState];
                                    newState[index] = { ...newState[index], deliveryDays: e };
                                    return newState;
                                  })
                                }
                              ></SoftSelect>
                            )}
                          </div>
                          <div>
                            <CloseIcon
                              onClick={() => deleteEntry(index)}
                              sx={{
                                margin: '30px 0px 0px 10px',
                                marginTop: index === 0 ? '35px' : '0px',
                                color: 'red',
                              }}
                            />
                          </div>
                        </Grid>
                      </>
                    ) : (
                      <>
                        <Grid item xs={12} md={3}></Grid>
                        <Grid item xs={12} md={3}></Grid>
                      </>
                    )}
                  </>
                ))}
                <SoftBox style={{ margin: '5px 0px 5px 15px' }}>
                  <SoftTypography
                    className="add-more-text"
                    variant="caption"
                    fontWeight="bold"
                    onClick={() => setStoreLocationCount(storeLocationCount + 1)}
                  >
                    + Add More
                  </SoftTypography>
                </SoftBox>{' '}
                {/* add centralized delivery check box */}
                {(deliveryMethod !== 'STORE_LOCATION' || purchaseMethod === 'BOTH') && (
                  <>
                    {' '}
                    <Grid item xs={12} display="flex" margin="20px 0px 10px 0px" alignItems="center" gap="10px">
                      <Checkbox
                        checked={deliveryScheduleCentralized}
                        checkedIcon={<CheckBoxOutlinedIcon />}
                        onChange={() => setDeliveryScheduleCentralized(!deliveryScheduleCentralized)}
                      />
                      <SoftTypography fontSize="0.8rem" variant="caption">
                        Add delivery schedule for stores from centralized location
                      </SoftTypography>
                    </Grid>
                  </>
                )}
                {deliveryScheduleCentralized && (
                  <>
                    {/* <Grid item xs={12}>
                      <InputLabel
                        sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767', margin: '5px 5px 5px 3px' }}
                      >
                        Shipment methods
                      </InputLabel>
                      <div style={{ width: '350px' }}>
                        <SoftSelect
                          size="small"
                          options={[
                            { value: 'BY_VENDOR', label: 'By vendor' },
                            { value: 'OWN_SHIPMENT', label: 'Own Shipment' },
                          ]}
                          onChange={(e) => setCentralizedShipmentMethods(e)}
                        ></SoftSelect>
                      </div>
                    </Grid> */}
                    {Array.from({ length: centralizedStoreCount }).map((_, index) => (
                      <>
                        <Grid item xs={12} md={4}>
                          {index === 0 && (
                            <InputLabel
                              sx={{
                                fontWeight: 'bold',
                                fontSize: '0.75rem',
                                color: '#344767',
                                margin: '5px 5px 5px 3px',
                              }}
                            >
                              Select stores
                            </InputLabel>
                          )}
                          <SoftSelect
                            size="small"
                            options={displayStoreOptions || []}
                            value={{
                              value: centralizedDeliveryFullFillment[index]?.centralizedDeliveryStores || '',
                              label:
                                centralizedDeliveryFullFillment[index]?.centralizedDeliveryStores || 'select  store',
                            }}
                            onChange={(e) =>
                              setCentralizedDeliveryFullFillment((prevState) => {
                                const newState = [...prevState];
                                newState[index] = { ...newState[index], centralizedDeliveryStores: e?.label };
                                return newState;
                              })
                            }
                            placeholder="Select stores"
                          ></SoftSelect>
                        </Grid>
                        <Grid item xs={12} md={2}>
                          {index === 0 && (
                            <InputLabel
                              sx={{
                                fontWeight: 'bold',
                                fontSize: '0.75rem',
                                color: '#344767',
                                margin: '5px 5px 5px 3px',
                              }}
                            >
                              Delivery Frequency
                            </InputLabel>
                          )}
                          <SoftSelect
                            value={{
                              value: centralizedDeliveryFullFillment[index]?.centralizedDeliveryFrequency || '',
                              label:
                                centralizedDeliveryFullFillment[index]?.centralizedDeliveryFrequency ||
                                'select  Frequency',
                            }}
                            size="small"
                            menuPortalTarget={document.body}
                            id="status"
                            placeholder="Select  Frequency"
                            options={[
                              { value: 'DAILY', label: 'Daily' },
                              { value: 'WEEKLY', label: 'Weekly' },
                              { value: 'FORTNIGHT', label: 'Fortnight' },
                              { value: 'MONTHLY', label: 'Monthly' },
                              { value: 'ON_DEMAND', label: 'On Demand' },
                            ]}
                            onChange={(e) => updateDeliveryFrequency(index, e.value)}
                          ></SoftSelect>
                        </Grid>
                        {centralizedDeliveryFullFillment[index]?.centralizedDeliveryFrequency !== 'DAILY' &&
                        centralizedDeliveryFullFillment[index]?.centralizedDeliveryFrequency !== 'ON_DEMAND' ? (
                          <>
                            <Grid item xs={12} md={3}>
                              {index === 0 && (
                                <InputLabel
                                  sx={{
                                    fontWeight: 'bold',
                                    fontSize: '0.75rem',
                                    color: '#344767',
                                    margin: '5px 5px 5px 3px',
                                  }}
                                >
                                  Order Request Day(s)
                                </InputLabel>
                              )}
                              {centralizedDeliveryFullFillment[index]?.centralizedDeliveryFrequency === 'MONTHLY' ? (
                                <SoftInput
                                  value={centralizedDeliveryFullFillment[index]?.centralizedOrderRequestDate || ''}
                                  type="date"
                                  size="small"
                                  onChange={(e) => {
                                    setCentralizedDeliveryFullFillment((prevState) => {
                                      const newState = [...prevState];
                                      newState[index] = {
                                        ...newState[index],
                                        centralizedOrderRequestDate: e?.target?.value,
                                      };
                                      return newState;
                                    });
                                  }}
                                ></SoftInput>
                              ) : (
                                <SoftSelect
                                  value={centralizedDeliveryFullFillment[index]?.centralizedOrderRequest || []}
                                  size="small"
                                  isMulti
                                  placeholder="Select order request day"
                                  menuPortalTarget={document.body}
                                  id="status"
                                  options={[
                                    { value: 'NONE', label: 'none' },
                                    { value: 'SUNDAY', label: 'Sunday' },
                                    { value: 'MONDAY', label: 'Monday' },
                                    { value: 'TUESDAY', label: 'Tuesday' },
                                    { value: 'WEDNESDAY', label: 'Wednesday' },
                                    { value: 'THURSDAY', label: 'Thursday' },
                                    { value: 'FRIDAY', label: 'Friday' },
                                    { value: 'SATURDAY', label: 'Saturday' },
                                  ]}
                                  onChange={(e) => updateOrderRequestDays(index, e)}
                                ></SoftSelect>
                              )}
                            </Grid>
                            <Grid item xs={12} md={3} display="flex">
                              <div>
                                {index === 0 && (
                                  <InputLabel
                                    sx={{
                                      fontWeight: 'bold',
                                      fontSize: '0.75rem',
                                      color: '#344767',
                                      margin: '5px 5px 5px 3px',
                                    }}
                                  >
                                    Delivery day(s)
                                  </InputLabel>
                                )}
                                {centralizedDeliveryFullFillment[index]?.centralizedDeliveryFrequency === 'MONTHLY' ? (
                                  <SoftInput
                                    type="date"
                                    size="small"
                                    value={centralizedDeliveryFullFillment[index]?.centralizedDeliveryDate || ''}
                                    onChange={(e) => {
                                      setCentralizedDeliveryFullFillment((prevState) => {
                                        const newState = [...prevState];
                                        newState[index] = {
                                          ...newState[index],
                                          centralizedDeliveryDate: e?.target?.value,
                                        };
                                        return newState;
                                      });
                                    }}
                                  ></SoftInput>
                                ) : (
                                  <SoftSelect
                                    size="small"
                                    className="inputStyle"
                                    value={centralizedDeliveryFullFillment[index]?.centralizedDeliveryDays || []}
                                    isMulti
                                    placeholder="Select delivery days"
                                    menuPortalTarget={document.body}
                                    id="status"
                                    options={[
                                      { value: 'NONE', label: 'none' },
                                      { value: 'SUNDAY', label: 'Sunday' },
                                      { value: 'MONDAY', label: 'Monday' },
                                      { value: 'TUESDAY', label: 'Tuesday' },
                                      { value: 'WEDNESDAY', label: 'Wednesday' },
                                      { value: 'THURSDAY', label: 'Thursday' },
                                      { value: 'FRIDAY', label: 'Friday' },
                                      { value: 'SATURDAY', label: 'Saturday' },
                                    ]}
                                    onChange={(e) => updateDeliveryDays(index, e)}
                                  ></SoftSelect>
                                )}
                              </div>
                              <div>
                                <CloseIcon
                                  onClick={() => deleteEntryCentralized(index)}
                                  sx={{
                                    margin: '30px 0px 0px 10px',
                                    marginTop: index === 0 ? '35px' : '0px',
                                    color: 'red',
                                  }}
                                />
                              </div>
                            </Grid>
                          </>
                        ) : (
                          <>
                            <Grid item xs={12} md={3}></Grid>
                            <Grid item xs={12} md={3}></Grid>
                          </>
                        )}
                      </>
                    ))}
                    <SoftBox style={{ margin: '5px 0px 5px 15px' }}>
                      <SoftTypography
                        className="add-more-text"
                        variant="caption"
                        fontWeight="bold"
                        onClick={() => setCentralizedStoreCount(centralizedStoreCount + 1)}
                      >
                        + Add More
                      </SoftTypography>
                    </SoftBox>{' '}
                  </>
                )}
              </>
            ) : (
              <>
                {' '}
                {Array.from({ length: storeLocationCount }).map((_, index) => (
                  <>
                    {deliveryMethod === 'STORE_LOCATION' ? (
                      <Grid item xs={12} md={4}>
                        {index === 0 && (
                          <InputLabel
                            sx={{
                              fontWeight: 'bold',
                              fontSize: '0.75rem',
                              color: '#344767',
                              margin: '5px 5px 5px 3px',
                            }}
                          >
                            Select stores
                          </InputLabel>
                        )}
                        <SoftSelect
                          size="small"
                          value={{
                            value: deliveryFullFillment[index]?.deliveryStores || '',
                            label: deliveryFullFillment[index]?.deliveryStores || 'Select  stores',
                          }}
                          options={displayStoreOptions || []}
                          placeholder="Select stores"
                          onChange={(e) =>
                            setDeliveryFullFillment((prevState) => {
                              const newState = [...prevState];
                              newState[index] = { ...newState[index], deliveryStores: e?.label };
                              return newState;
                            })
                          }
                        ></SoftSelect>
                      </Grid>
                    ) : (
                      <Grid item xs={12} md={4}>
                        {index === 0 && (
                          <InputLabel
                            sx={{
                              fontWeight: 'bold',
                              fontSize: '0.75rem',
                              color: '#344767',
                              margin: '5px 5px 5px 3px',
                            }}
                          >
                            Delivery Address
                          </InputLabel>
                        )}
                        <SoftSelect
                          value={{
                            value: deliveryFullFillment[index]?.deliveryAddress || '',
                            label: deliveryFullFillment[index]?.deliveryAddress || 'Select  Address',
                          }}
                          options={deliveryAddressOp || []}
                          size="small"
                          onChange={(e) =>
                            setDeliveryFullFillment((prevState) => {
                              const newState = [...prevState];
                              newState[index] = { ...newState[index], deliveryAddress: e?.label };
                              return newState;
                            })
                          }
                          placeholder="Select address"
                        ></SoftSelect>
                      </Grid>
                    )}
                    <Grid item xs={12} md={2}>
                      {index === 0 && (
                        <InputLabel
                          sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767', margin: '5px 5px 5px 3px' }}
                        >
                          Delivery Frequency
                        </InputLabel>
                      )}
                      <SoftSelect
                        size="small"
                        value={{
                          value: deliveryFullFillment[index]?.deliveryFrequency || '',
                          label: deliveryFullFillment[index]?.deliveryFrequency || 'select  Frequency',
                        }}
                        menuPortalTarget={document.body}
                        id="status"
                        placeholder="select  Frequency"
                        options={[
                          { value: 'DAILY', label: 'Daily' },
                          { value: 'WEEKLY', label: 'Weekly' },
                          { value: 'FORTNIGHT', label: 'Fortnight' },
                          { value: 'MONTHLY', label: 'Monthly' },
                          { value: 'ON_DEMAND', label: 'On Demand' },
                        ]}
                        onChange={(e) =>
                          setDeliveryFullFillment((prevState) => {
                            const newState = [...prevState];
                            newState[index] = { ...newState[index], deliveryFrequency: e?.value };
                            return newState;
                          })
                        }
                      ></SoftSelect>
                    </Grid>
                    {deliveryFullFillment[index]?.deliveryFrequency !== 'DAILY' &&
                    deliveryFullFillment[index]?.deliveryFrequency !== 'ON_DEMAND' ? (
                      <>
                        <Grid item xs={12} md={3}>
                          {index === 0 && (
                            <InputLabel
                              sx={{
                                fontWeight: 'bold',
                                fontSize: '0.75rem',
                                color: '#344767',
                                margin: '5px 5px 5px 3px',
                              }}
                            >
                              Order Request Day(s)
                            </InputLabel>
                          )}
                          {deliveryFullFillment[index]?.deliveryFrequency === 'MONTHLY' ? (
                            <SoftInput
                              value={deliveryFullFillment[index]?.orderRequestDate || ''}
                              type="date"
                              size="small"
                              onChange={(e) => {
                                setDeliveryFullFillment((prevState) => {
                                  const newState = [...prevState];
                                  newState[index] = { ...newState[index], orderRequestDate: e?.target?.value };
                                  return newState;
                                });
                              }}
                            ></SoftInput>
                          ) : (
                            <SoftSelect
                              size="small"
                              isMulti
                              value={deliveryFullFillment[index]?.orderRequestDays || []}
                              menuPortalTarget={document.body}
                              id="status"
                              options={[
                                { value: 'NONE', label: 'none' },
                                { value: 'SUNDAY', label: 'Sunday' },
                                { value: 'MONDAY', label: 'Monday' },
                                { value: 'TUESDAY', label: 'Tuesday' },
                                { value: 'WEDNESDAY', label: 'Wednesday' },
                                { value: 'THURSDAY', label: 'Thursday' },
                                { value: 'FRIDAY', label: 'Friday' },
                                { value: 'SATURDAY', label: 'Saturday' },
                              ]}
                              onChange={(e) => {
                                setDeliveryFullFillment((prevState) => {
                                  const newState = [...prevState];
                                  newState[index] = { ...newState[index], orderRequestDays: e };
                                  return newState;
                                });
                              }}
                            ></SoftSelect>
                          )}
                        </Grid>
                        <Grid item xs={12} md={3} display="flex">
                          <div>
                            {index === 0 && (
                              <InputLabel
                                sx={{
                                  fontWeight: 'bold',
                                  fontSize: '0.75rem',
                                  color: '#344767',
                                  margin: '5px 5px 5px 3px',
                                }}
                              >
                                Delivery day(s)
                              </InputLabel>
                            )}
                            {deliveryFullFillment[index]?.deliveryFrequency === 'MONTHLY' ? (
                              <div>
                                <SoftInput
                                  value={deliveryFullFillment[index]?.deliveryDate || ''}
                                  type="date"
                                  size="small"
                                  className="inputStyle"
                                  onChange={(e) =>
                                    setDeliveryFullFillment((prevState) => {
                                      const newState = [...prevState];
                                      newState[index] = { ...newState[index], deliveryDate: e?.target?.value };
                                      return newState;
                                    })
                                  }
                                ></SoftInput>
                              </div>
                            ) : (
                              <SoftSelect
                                className="inputStyle"
                                size="small"
                                isMulti
                                menuPortalTarget={document.body}
                                id="status"
                                value={deliveryFullFillment[index]?.deliveryDays || []}
                                options={[
                                  { value: 'NONE', label: 'none' },
                                  { value: 'SUNDAY', label: 'Sunday' },
                                  { value: 'MONDAY', label: 'Monday' },
                                  { value: 'TUESDAY', label: 'Tuesday' },
                                  { value: 'WEDNESDAY', label: 'Wednesday' },
                                  { value: 'THURSDAY', label: 'Thursday' },
                                  { value: 'FRIDAY', label: 'Friday' },
                                  { value: 'SATURDAY', label: 'Saturday' },
                                ]}
                                onChange={(e) =>
                                  setDeliveryFullFillment((prevState) => {
                                    const newState = [...prevState];
                                    newState[index] = { ...newState[index], deliveryDays: e };
                                    return newState;
                                  })
                                }
                              ></SoftSelect>
                            )}
                          </div>
                          <div>
                            <CloseIcon
                              onClick={() => deleteEntry(index)}
                              sx={{
                                margin: '30px 0px 0px 10px',
                                marginTop: index === 0 ? '35px' : '0px',
                                color: 'red',
                              }}
                            />
                          </div>
                        </Grid>
                      </>
                    ) : (
                      <>
                        <Grid item xs={12} md={3}></Grid>
                        <Grid item xs={12} md={3}></Grid>
                      </>
                    )}
                  </>
                ))}
                <SoftBox style={{ margin: '5px 0px 5px 15px' }}>
                  <SoftTypography
                    className="add-more-text"
                    variant="caption"
                    fontWeight="bold"
                    onClick={() => setStoreLocationCount(storeLocationCount + 1)}
                  >
                    + Add More
                  </SoftTypography>
                </SoftBox>{' '}
              </>
            )}
          </Grid>
        </SoftTypography>
        <br />
      </Card>
      <Card className="addbrand-Box" style={{ zIndex: '0px !important' }}>
        {/* <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}> */}
        <SoftTypography variant="label" className="label-heading">
          Payment terms
        </SoftTypography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <SoftSelect
              size="small"
              menuPortalTarget={document.body}
              // id="status"
              value={selectedPaymentTerms || ''}
              options={[
                { value: 'CREDIT_DAYS', label: 'Credit Days' },
                { value: 'CASH_AND_CARRY', label: 'Cash & Carry' },
                { value: 'ON_SALE', label: 'On Sale' },
                { value: 'BILL_TO_BILL', label: 'Bill to Bill' },
              ]}
              onChange={(e) => setSelectedPaymentTerms(e)}
            ></SoftSelect>
          </Grid>
        </Grid>

        {/* </div> */}
        <Grid container spacing={2}>
          {selectedPaymentTerms?.value === 'CREDIT_DAYS' && (
            <>
              <Grid item xs={12} md={6}>
                <InputLabel
                  sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767', margin: '5px 5px 5px 3px' }}
                >
                  Credit limit{' '}
                </InputLabel>

                <SoftInput
                  size="small"
                  type="text"
                  value={creditLimit}
                  onChange={(e) => setCreditLimit(e.target.value)}
                ></SoftInput>
              </Grid>
              <Grid item xs={12} md={6}>
                <InputLabel
                  sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767', margin: '5px 5px 5px 3px' }}
                >
                  Credit days{' '}
                </InputLabel>
                <SoftInput
                  size="small"
                  type="text"
                  value={creditDays}
                  onChange={(e) => setCreditDays(e.target.value)}
                ></SoftInput>
              </Grid>
            </>
          )}

          {selectedPaymentTerms?.value === 'ON_SALE' && (
            <>
              <Grid item xs={12} md={6} p={3} mt={1}>
                <InputLabel
                  sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767', margin: '5px 5px 5px 3px' }}
                >
                  Payout Frequency
                </InputLabel>
                <SoftBox>
                  <SoftSelect
                    size="small"
                    menuPortalTarget={document.body}
                    id="status"
                    value={selectedPayoutFrequency}
                    placeholder="select payout Frequency"
                    options={[
                      { value: 'DAILY', label: 'Daily' },
                      { value: 'WEEKLY', label: 'Weekly' },
                      { value: 'MONTHLY', label: 'Monthly' },
                      { value: 'ONDEMAND', label: 'On Demand' },
                    ]}
                    onChange={(e) => setSelectedPayoutFrequency(e)}
                  ></SoftSelect>
                </SoftBox>
              </Grid>
              {selectedPayoutFrequency?.value === 'WEEKLY' && (
                <Grid item xs={12} md={6} p={3} mt={1}>
                  <InputLabel
                    sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767', margin: '5px 5px 5px 3px' }}
                  >
                    Select Days
                  </InputLabel>
                  <SoftBox>
                    <SoftSelect
                      size="small"
                      menuPortalTarget={document.body}
                      onChange={(e) => setOnSaleDeliveryDays(e)}
                      isMulti
                      id="status"
                      options={[
                        { value: 'NONE', label: 'none' },
                        { value: 'SUNDAY', label: 'Sunday' },
                        { value: 'MONDAY', label: 'Monday' },
                        { value: 'TUESDAY', label: 'Tuesday' },
                        { value: 'WEDNESDAY', label: 'Wednesday' },
                        { value: 'THURSDAY', label: 'Thursday' },
                        { value: 'FRIDAY', label: 'Friday' },
                        { value: 'SATURDAY', label: 'Saturday' },
                      ]}
                    ></SoftSelect>
                  </SoftBox>
                </Grid>
              )}
              {selectedPayoutFrequency?.value === 'MONTHLY' && (
                <Grid item xs={12} md={6} p={3} mt={1}>
                  <InputLabel
                    sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767', margin: '5px 5px 5px 3px' }}
                  >
                    Select Date
                  </InputLabel>
                  <SoftBox>
                    <SoftInput
                      value={onSaleDeliveryDate}
                      type="date"
                      size="small"
                      onChange={(e) => setOnSaleDeliveryDate(e?.target?.value)}
                    ></SoftInput>
                  </SoftBox>
                </Grid>
              )}
              {(selectedPayoutFrequency?.value === 'DAILY' || selectedPayoutFrequency?.value === 'ONDEMAND') && (
                <Grid item md={6}></Grid>
              )}
            </>
          )}

          <Grid item xs={12} md={6} p={3} mt={1}>
            <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.875rem', color: '#344767', margin: '5px 5px 5px 3px' }}>
              Payment options
            </InputLabel>
            {paymentOptions?.map((element, i) => (
              <>
                <SoftBox display="flex" alignItems="center" gap="10px" key={i} style={{ margin: '5px 0px 0px 8px' }}>
                  <Checkbox key={i} checked={element?.enabled} onChange={handlePayments} value={element?.value} />
                  <SoftTypography className="add-customer-portal-access">{element.label} </SoftTypography>
                </SoftBox>
                {element?.label === 'Bank transfers' && element.value && element.enabled && (
                  <div style={{ marginLeft: '40px' }}>
                    <SoftButton color="info" variant="outlined" className="smallBtnStyle">
                      Connect Bank
                    </SoftButton>
                  </div>
                )}
                {element?.label === 'Credit / Debit / Upi' && element.value && element.enabled && (
                  <div style={{ marginLeft: '40px' }}>
                    <SoftInput
                      placeholder="Vendor custom payment gateway link"
                      size="small"
                      value={element?.inputValue}
                      onChange={(e) => handleInputChange(e.target.value, i)}
                    />
                  </div>
                )}
                {element?.label === 'Cheque' && element?.value && element?.enabled && (
                  <div style={{ marginLeft: '40px' }}>
                    <SoftInput
                      placeholder="Cheque in favour of (enter name)"
                      size="small"
                      value={element.inputValue}
                      onChange={(e) => handleInputChange(e.target.value, i)}
                    />
                  </div>
                )}
                {element?.label === 'Cash deposits' && element?.value && element?.enabled && (
                  <div style={{ marginLeft: '40px' }}>
                    <SoftInput
                      placeholder="Cash limits"
                      size="small"
                      value={element.inputValue}
                      onChange={(e) => handleInputChange(e.target.value, i)}
                    />
                  </div>
                )}
              </>
            ))}
          </Grid>
          {selectedPaymentTerms?.value === 'CREDIT_DAYS' && (
            <Grid item xs={12} md={6} p={3} mt={1}>
              <InputLabel
                sx={{ fontWeight: 'bold', fontSize: '0.875rem', color: '#344767', margin: '5px 5px 5px 3px' }}
              >
                Purchase terms
              </InputLabel>
              {purchaseOptions?.map((element, i) => (
                <SoftBox display="flex" gap="10px" key={i} style={{ margin: '5px 0px 0px 8px' }}>
                  <Checkbox key={i} checked={element?.enabled} value={element.value} onChange={handlePurchase} />
                  <SoftTypography className="add-customer-portal-access">{element.label}</SoftTypography>
                </SoftBox>
              ))}
            </Grid>
          )}
        </Grid>
      </Card>

      {/* ----------------------- Return and replacemnts-------------------- */}

      <Card className="addbrand-Box">
        <SoftTypography variant="label" className="label-heading">
          Returns and Replacement
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12} md={5}>
              <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767', margin: '0px 5px 5px 3px' }}>
                Return Type
              </InputLabel>

              <MultiSelect
                key="example_id"
                options={[
                  { value: 'RETURN_ON_EXPIRY', label: 'Return on expiry' },
                  { value: 'RETURN_ON_DAMAGE', label: 'Return on damage' },
                  { value: 'RETURN_ON_DEAD_STOCK', label: 'Return on deadstock' },
                ]}
                value={selectedReturnOptions}
                onChange={(e) => setSelectedReturnOptions(e)}
                isSelectAll={true}
                menuPlacement={'bottom'}
                menuPortalTarget={document.body}
                placeholder="Select return type"
                size="small"
              />
            </Grid>

            <Grid item xs={12}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '30px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Checkbox
                    checked={subCategoryCheckBoxValue?.PRODUCT_REPLACEMENT}
                    onChange={handleSubCatergoryChange('PRODUCT_REPLACEMENT')}
                  />
                  <InputLabel className="inputLabelTextStyle">Product Replacement</InputLabel>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Checkbox
                    checked={subCategoryCheckBoxValue?.REPLACEMENT_ON_OTHER_PRODUCT}
                    onChange={handleSubCatergoryChange('REPLACEMENT_ON_OTHER_PRODUCT')}
                  />
                  <InputLabel className="inputLabelTextStyle">Replacement on other product</InputLabel>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Checkbox
                    checked={subCategoryCheckBoxValue?.CREDIT_NOTE}
                    onChange={handleSubCatergoryChange('CREDIT_NOTE')}
                  />
                  <InputLabel className="inputLabelTextStyle">Credit note</InputLabel>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Checkbox
                    checked={subCategoryCheckBoxValue?.MONEY_REFUNDS}
                    onChange={handleSubCatergoryChange('MONEY_REFUNDS')}
                  />
                  <InputLabel className="inputLabelTextStyle">Money back / refunds</InputLabel>
                </div>
              </div>
            </Grid>
          </Grid>
        </SoftTypography>
      </Card>
      <AddvendorApiCall handleApiCall={handleCreateTermsNext} />
      {/* <SoftBox className="form-button-customer-vendor">
        <SoftButton className="vendor-second-btn" onClick={backToVendorlist}>
          Cancel
        </SoftButton>
        <SoftButton className="vendor-add-btn" onClick={handleCreateTermsNext}>
          Next
        </SoftButton>
      </SoftBox> */}
      <br />
    </SoftBox>
  );
};

export default GoogleApiWrapper({
  apiKey: 'AIzaSyCXOTKejeUZ-bBgOaoGuhUIGqIRjTRc6Qo',
})(PaymentTerms);
