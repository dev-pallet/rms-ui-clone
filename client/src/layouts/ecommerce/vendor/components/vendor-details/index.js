import styled from '@emotion/styled';
import EditIcon from '@mui/icons-material/Edit';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Verified from '@mui/icons-material/Verified';
import { Checkbox, InputLabel, Radio, RadioGroup } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import Card from '@mui/material/Card';
import CircularProgress from '@mui/material/CircularProgress';
import { green } from '@mui/material/colors';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Snackbar from '@mui/material/Snackbar';
import SoftBox from 'components/SoftBox';
import SoftButton from 'components/SoftButton';
import SoftInput from 'components/SoftInput';
import SoftSelect from 'components/SoftSelect';
import SoftTypography from 'components/SoftTypography';
import Spinner from 'components/Spinner/index';
import { city as citys } from 'layouts/ecommerce/softselect-Data/city';
import { country } from 'layouts/ecommerce/softselect-Data/country';
import { state as states } from 'layouts/ecommerce/softselect-Data/state';
import { placeofsupply } from 'layouts/ecommerce/vendor/components/vendor-details/data/placeofsupply';
import moment from 'moment';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  autoSaveVendorDetails,
  getVendorDetails,
  getVendorDraftDetails,
  indPanVerification,
  panVerification,
  vendorGstVerification,
  verifyBank,
  verifyOnlyGst,
} from '../../../../../config/Services';
import {
  getVendorDraftCode,
  getVendorIsDraft,
  setIsDraft,
  setVendorAutoSaveTime,
  setVendorDraftCode,
  setVendorOverviewPayload,
} from '../../../../../datamanagement/vendorPayloadSlice';
import { useSnackbar } from '../../../../../hooks/SnackbarProvider';
import './vendor-details.css';

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

export const VendorDetails = ({ handleTab, vendorLogo }) => {
  const dispatch = useDispatch();
  const vendorDraftCode = useSelector(getVendorDraftCode) || localStorage.getItem('vendorDraftCode');
  const isDraft = useSelector(getVendorIsDraft);

  const { editVendorId } = useParams();
  const showSnackbar = useSnackbar();
  const { vendorType } = useParams();
  const [loader, setLoader] = useState(false);
  const [inputlist, setInputlist] = useState([{}]);
  const [gst, setGst] = useState('');
  const [pan, setPan] = useState('');
  const [vendorName, setVendorName] = useState('');
  const [address, setAddress] = useState('');
  const [website, setWebsite] = useState('');
  const [contactName, setContactName] = useState('');
  const [phNo, setPhNo] = useState('');
  const [email, setEmail] = useState('');
  const [bankData, setBankData] = useState({});
  const [branchName, setBranchName] = useState('');
  const [verify, setVerify] = useState(false);
  const [accNo, setAccNo] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [accName, setAccName] = useState('');
  const [cntry, setCntry] = useState({
    label: 'India',
    value: 'India',
  });
  const [state, setState] = useState({});
  const [city, setCity] = useState({});
  const [cities, setCities] = useState([]);
  const [adrsData, setAdrsData] = useState('');
  const [adrs1, setAdrs1] = useState('');
  const [adrs2, setAdrs2] = useState('');
  const [pncde, setPncde] = useState('');
  const [stat, setStat] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [open, setOpen] = useState(false);
  const [vertical, setVertical] = useState('bottom');
  const [horizontal, setHorizontal] = useState('right');
  const [errorhandler, setErrorHandler] = useState('');
  const [loadingbnk, setLoadingbnk] = useState(false);
  const [successbnk, setSuccessbnk] = useState(false);
  const [esClr, setesClr] = useState('');
  const [gstCheck, setGstCheck] = useState(false);
  const [loadingGst, setLoadingGst] = useState(false);
  const [successGst, setSuccessGst] = useState(false);
  const [gstStatus, setGstStatus] = useState('Inactive');
  const [editBankDetails, setEditBankDetails] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [saveLoader, setSaveLoader] = useState(false);

  const [panGstVerification, setPanGstVerification] = useState({ label: 'PAN', value: 'PAN' });
  const [enableExchange, setEnableExchange] = useState(false);
  const [vendorPreferenceData, setVendorPreferenceData] = useState({});
  const [kycData, setkycData] = useState({});
  const [panVal, setPanVal] = useState('');
  const [gstVal, setGstVal] = useState('');
  const [panAltVal, setPanAltVal] = useState('');
  const [gstAltVal, setGstAltVal] = useState('');
  const [panLoader, setPanLoader] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [gstLoader, setGstLoader] = useState(false);
  const [configData, setConfigData] = useState({});
  const [bankTransferChecked, setBankTransferChecked] = useState(false);

  const navigate = useNavigate();

  const [selectedPayoutMethod, setSelectedPayoutMethod] = useState('Domestic');
  const handlePayoutChange = (event) => {
    setSelectedPayoutMethod(event.target.value);
  };
  const currencies = [
    {
      value: 'India',
      label: 'INR',
    },
    {
      value: 'British Indian Ocean Territory',
      label: 'USD',
    },
    {
      value: 'Australia',
      label: 'EUR',
    },
    {
      value: 'England',
      label: 'GBP',
    },
  ];

  const custOptions = [
    { label: 'Select', value: '---' },
    { label: 'Manufacturers', value: 'MANUFACTURER' },
    { label: 'Wholesalers', value: 'WHOLESALER' },
    { label: 'Retailers', value: 'RETAILER' },
    { label: 'Distributor', value: 'DISTRIBUTOR' },
    { label: 'Individual', value: 'INDIVIDUAL' },
  ];
  const defaultSelected = custOptions.find((opt) => !!opt.value);
  const [custType, setCustType] = useState(defaultSelected);
  const gstOptions = [
    { value: 'rbr', label: 'Registered Business - Regular' },
    { value: 'rbc', label: 'Registered Business - Composition' },
    { value: 'urb', label: 'Unregistered Business' },
    { value: 'ovs', label: 'Overseas' },
    { value: 'sez', label: 'Special Economic Zone' },
  ];
  const gstSelected = gstOptions.find((opt) => !!opt.value);
  const [gstTreatment, setGstTreatment] = useState(gstSelected);

  const supplySelected = placeofsupply.find((opt) => !!opt.value);
  const [placeSupply, setPlaceSupply] = useState(supplySelected);
  const curSelected = currencies.find((opt) => !!opt.value);
  const [currencyVal, setCurrencyVal] = useState(curSelected);

  const taxOptions = [
    { value: 'taxable', label: 'Taxable' },
    { value: 'tax exempt', label: 'Tax Exempt' },
  ];
  const taxSelected = taxOptions.find((opt) => !!opt.value);
  const [taxPreference, setTaxPreference] = useState(taxSelected);

  const paymentOptions = [
    { value: 'Due end of Month', label: 'Due end of Month' },
    { value: 'Net 45', label: 'Net 45' },
    { value: 'Due on receipt', label: 'Due on receipt' },
    { value: 'Due on receipt1', label: 'Due on receipt' },
    { value: 'Due on receipt2', label: 'Due on receipt' },
  ];
  const paySelected = paymentOptions.find((opt) => !!opt.value);
  const [payTerms, setPayTerms] = useState(paySelected);
  const priceOptions = [
    { value: 'Price Slab 1', label: 'Price Slab 1' },
    { value: 'Price Slab 2', label: 'Price Slab 2' },
    { value: 'Price Slab 3', label: 'Price Slab 3' },
    { value: 'Price Slab 4', label: 'Price Slab 4' },
    { value: 'Price Slab 5', label: 'Price Slab 5' },
  ];
  const priceSelected = priceOptions.find((opt) => !!opt.value);
  const [priceSlab, setPriceSlab] = useState(priceSelected);
  const warehouseOptions = [
    { value: 'Evernest Komarapalayam', label: 'Evernest Komarapalayam' },
    { value: 'Evernest Salem', label: 'Evernest Salem' },
    { value: 'Evernest Erode', label: 'Evernest Erode' },
    { value: 'Evernest Avinashi', label: 'Evernest Avinashi' },
    { value: 'Evernest Chennai', label: 'Evernest Chennai' },
  ];
  const warehouseSelected = warehouseOptions.find((opt) => !!opt.value);
  const [warehouseVal, setWarehouseVal] = useState(warehouseSelected);
  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const list = [...inputlist];
    list[index][name] = value;
    list[index]['whatsapp'] = '';
    if (index == 0) {
      list[index]['type'] = 'PRIMARY';
    }
    list[index]['type'] = 'PRIMARY';
    setInputlist(list);
  };

  const handleVendorType = (option) => {
    if (success && option.label === 'Individual') {
      setSuccess(false);
      setPan('');
      setVendorName('');
      setGst('');
      setAdrs1('');
      setAdrs2('');
      setState('');
      setCity('');
      setPncde('');
    } else if (success && option.label !== 'Individual') {
      setSuccess(false);
      setPan('');
      setVendorName('');
      setGst('');
      setGstStatus('Inactive');
    }
    setCustType(option);
  };

  const handleRemove = (index) => {
    const list = [...inputlist];
    list.splice(index, 1);
    setInputlist(list);
  };
  const handleRow = (a) => {
    setInputlist([...inputlist, { contactName: '', phoneNo: '', email: '', whatsapp: '' }]);
  };

  const [selectedImages, setSelectedImages] = useState('');
  const [prev, setPrev] = useState('');

  const onSelectFile = (event) => {
    const selectedFiles = event.target.files;
    const selectedFilesArray = Array.from(selectedFiles);
    const imagesArray = selectedFilesArray.map((file) => {
      return URL.createObjectURL(file);
    });
    setSelectedImages(imagesArray[0]);
    setPrev(imagesArray[0]);
    // FOR BUG IN CHROME
    event.target.value = '';
  };

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const handleBack = () => {
    setSelectedImages(prev);
  };

  const handleState = (option) => {
    setState({
      label: option.label,
      value: option.label,
    });

    const citiesInState = citys?.filter((cit) => cit.value == option.value);
    setCities(citiesInState || []);
  };

  const orgId = localStorage.getItem('orgId');

  const user_name = localStorage.getItem('user_name');
  const locId = localStorage.getItem('locId');
  const user_details = localStorage.getItem('user_details');
  const uidx = JSON.parse(user_details).uidx;

  const contextType = localStorage.getItem('contextType');

  const validatePayload = (payload) => {
    if (payload.vendorType === '---') {
      setErrorHandler('Please select Vendor Type');
      setesClr('warning');
      setOpen(true);
      return false;
    }
    if (placeSupply.label == '---') {
      setErrorHandler('Please select Business Location');
      setesClr('warning');
      setOpen(true);
      return false;
    }
    if (payload.vendorName == '') {
      setErrorHandler('Please enter Business (or) Vendor Name');
      setesClr('warning');
      setOpen(true);
      return false;
    }
    if (payload.displayName == '') {
      setErrorHandler('Please enter Display Name');
      setesClr('warning');
      setOpen(true);
      return false;
    }
    if (payload.vendorAddress.addressLine1 === '') {
      setErrorHandler('Please enter Address Line 1');
      setesClr('warning');
      setOpen(true);
      return false;
    }
    if (payload.vendorAddress.addressLine2 === '') {
      setErrorHandler('Please enter Address Line 2');
      setesClr('warning');
      setOpen(true);
      return false;
    }
    if (payload.vendorAddress.state === undefined) {
      setErrorHandler('Please select Sate');
      setesClr('warning');
      setOpen(true);
      return false;
    }
    if (payload.vendorAddress.city === undefined) {
      setErrorHandler('Please select City');
      setesClr('warning');
      setOpen(true);
      return false;
    }
    if (payload.vendorAddress.pinCode === '' || payload.vendorAddress.pinCode.length !== 6) {
      setErrorHandler('Please enter PinCode and it should be of 6 digits');
      setesClr('warning');
      setOpen(true);
      return false;
    }

    if (inputlist[0].contactName === undefined) {
      setErrorHandler('Please enter your Contact Name');
      setesClr('warning');
      setOpen(true);
      return false;
    }
    if (inputlist[0].phoneNo == undefined || inputlist[0].phoneNo.length !== 10) {
      setErrorHandler('Please enter your Phone Number and it should be of 10 digits');
      setesClr('warning');
      setOpen(true);
      return false;
    }

    // if (payload.onboardKyc.pan.length && panGstVerification.value == 'PAN') {
    //   setErrorHandler('PAN Verification is left please verify');
    //   setesClr('warning');
    //   setOpen(true);
    //   return false;
    // }

    if (payload.vendorPreference.supplyPlace === '---') {
      setErrorHandler('Please enter your Place of Supply');
      setesClr('warning');
      setOpen(true);
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (editVendorId) {
      handleVendorEdit();
      return;
    }
    const payload = {
      vendorName: vendorName,
      displayName: displayName,
      address: adrs1 + adrs2,
      website: website,
      vendorType: custType.value,
      vendorLogo: '',
      tenantId: orgId,
      orgId: orgId,
      locationId: locId,
      // createdBy: user_name,
      createdBy: uidx,
      // updatedBy: user_name,
      contacts: inputlist,
      bank: {
        payoutOptions: [
          {
            payoutOption: 'DOMESTIC',
            flag: selectedPayoutMethod === 'Domestic',
          },
          {
            payoutOption: 'INTERNATIONAL',
            flag: selectedPayoutMethod === 'International',
          },
        ],
        bankName: branchName,
        bankAccountNo: accNo || '',
        accountHolderName: accName,
        ifscCode: ifsc,
        type: 'PRIMARY',
      },
      vendorAddress: {
        country: cntry.label,
        state: state.label,
        city: city.label,
        pinCode: pncde,
        addressLine1: adrs1,
        addressLine2: adrs2,
        phoneNo: inputlist[0].phoneNo,
        addressType: 'default',
        type: 'PRIMARY',
      },
      onboardKyc: {
        pan: panVal.length ? panVal : panAltVal,
        isValidPan: stat,
        // gst: gst.length == 0 ? null : gstVal,
        gst: gstVal.length ? gstVal : gstAltVal,
        isValidGst: gst.length == 0 ? null : gstStatus,
        createdBy: user_name,
        tenantId: orgId,
      },
      vendorPreference: {
        gstTreatment: gstTreatment.label,
        taxPreference: taxPreference.label,
        currency: currencyVal.label,
        supplyPlace: placeSupply.label,
        enableConversionRate: enableExchange,
      },
      vendorPartnerType: contextType,
    };

    if (!validatePayload(payload)) {
      return;
    }
    setSaveLoader(true);
    dispatch(setVendorOverviewPayload(payload));
    const autoSavePayload = {
      // id: 0,
      // code: 'string',

      config: { ...(configData || {}), vendorOverview: payload },
      createdBy: uidx,
      createdByName: user_name,
    };
    if (vendorDraftCode) {
      autoSavePayload.code = vendorDraftCode;
    }
    autoSaveVendorDetails(autoSavePayload)
      .then((res) => {
        localStorage.setItem('vendorDraftCode', res?.data?.data?.object?.code);
        if (res?.data?.data?.object?.code) {
          dispatch(setVendorDraftCode(res?.data?.data?.object?.code || ''));
        }

        handleTab(1);
      })

      .catch(() => {});
    // addVendor(payload)
    //   .then(function (response) {
    //     setSaveLoader(false);
    //     let vendId = '';
    //     if (vendorLogo !== null) {
    //       vendId = response.data.data.vendorId;
    //       const formData = new FormData();
    //       formData.append('file', vendorLogo);
    //       uploadVendorLogo(vendId, formData)
    //         .then((result) => {})
    //         .catch((err) => {});
    //     }
    //     localStorage.setItem('vendorId', response.data.data.vendorId);
    //     localStorage.setItem('vendorName', response.data.data.vendorName);
    //     setLoader(false);
    //     handleTab(1);
    //   })
    //   .catch((err) => {
    //     setErrorHandler(err.response.data.message);
    //     setesClr('error');
    //     setOpen(true);
    //     setLoader(false);
    //     setSaveLoader(false);
    //   });
  };

  const businessPanVerification = () => {
    const payload = {
      pan: panVal,
      stateCode: placeSupply.value,
    };
    // if (!loading) {
    setSuccess(false);
    setLoading(true);
    panVerification(payload)
      .then((response) => {
        // setSuccess(true);
        // setLoading(false);
        // setesClr('success');
        // setErrorHandler('Pan is successfully verified');
        // setOpen(true);
        setGstAltVal(response.data.data[0].gstin);
        setVendorName(response.data.data[0].data.lgnm);
        setDisplayName(response.data.data[0].data.tradeNam);
        setState({
          label: response.data.data[0].data.pradr.addr.stcd,
          value: response.data.data[0].data.pradr.addr.stcd,
        });
        setCity({
          label: response.data.data[0].data.pradr.addr.loc,
          value: response.data.data[0].data.pradr.addr.loc,
        });
        setAdrs1(response.data.data[0].data.pradr.addr.bnm + ',' + response.data.data[0].data.pradr.addr.bno);
        setAdrs2(response.data.data[0].data.pradr.addr.st + ',' + response.data.data[0].data.pradr.addr.flno);
        setPncde(response.data.data[0].data.pradr.addr.pncd);
        setStat(response.data.data[0].data.sts);
        setGstStatus(response.data.data[0].data.sts);
      })
      .catch((err) => {
        setLoading(false);
        setesClr('error');
        if (pan.length < 10) {
          setErrorHandler('Pan or business location is wrong');
        } else {
          setErrorHandler(
            'Invalid Pan details. Please select the correct location and enter valid pan number or selected vendor type might be wrong',
          );
        }
        setOpen(true);
      });
    // }
  };

  const individualPanVerification = async () => {
    const payload = {
      panNo: panVal,
      consent: 'Y',
      reason: 'kyc',
    };
    try {
      setPanLoader(true);
      const response = await indPanVerification(payload);
      if (response.data.data.status === 'INVALID') {
        setesClr('error');
        setErrorHandler('PAN is invalid. Please provide your valid PAN');
      } else {
        setSuccess(true);
        setLoading(false);
        setesClr('success');
        setVendorName(response.data.data.fullName);
        setStat(response.data.data.status);
        setIsVerified(true);
        setPanLoader(false);
        setErrorHandler('Pan is successfully verified');
        setOpen(true);
      }
    } catch (err) {
      setPanLoader(false);
    }
  };

  const backToVendors = () => {
    navigate('/purchase/vendors');
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const bankAccVerification = () => {
    const payload = {
      ifsc: ifsc,
      accountNo: accNo,
      name: '',
      mobileNo: '',
    };
    if (!loadingbnk) {
      setSuccessbnk(false);
      setLoadingbnk(true);
      verifyBank(payload)
        .then((response) => {
          if (response.data.data.account_exists) {
            setesClr('success');
            setSuccessbnk(true);
            setLoadingbnk(false);
            setOpen(true);
            setEditBankDetails(true);
            setErrorHandler('Bank account is successfully verified');
            setVerify(true);
            setAccName(response.data.data.name_at_bank);
          } else {
            setOpen(true);
            setEditBankDetails(false);
            setAccName('');
            setErrorHandler(response.data.data.message + ' ' + ' Or please enter correct account number');
            setSuccessbnk(false);
            setLoadingbnk(false);
            setesClr('error');
            setVerify(false);
          }
        })
        .catch((err) => {
          setOpen(true);
          setErrorHandler('Invalid Details or Something went wrong.Try after some time');
          setSuccessbnk(false);
          setLoadingbnk(false);
          setesClr('error');
        });
    }
  };

  useEffect(() => {
    if (pan.length == 0) {
      setSuccess(false);
    }
  }, [pan]);

  useEffect(() => {
    if (accNo.length == 0 || ifsc.length == 0) {
      setSuccessbnk(false);
    }
  }, [ifsc, accNo]);

  const handlePanEdit = () => {
    setSuccess(false);
  };
  const handleGstEdit = () => {
    setSuccessGst(false);
  };

  const onlyGstVerification = () => {
    if (!loadingGst) {
      setLoadingGst(true);
      setSuccessGst(false);
      verifyOnlyGst(gst)
        .then((response) => {
          if (vendorName !== response.data.data.tradeNam || response.data.data.lgnm) {
            setesClr('error');
            setErrorHandler('Cannot verify GSTIN.Please Enter correct GSTIN');
            setGst('');
            setSuccessGst(false);
            setLoadingGst(false);
            setOpen(true);
            return;
          }
          setLoadingGst(false);
          setSuccessGst(true);
          setVendorName(response.data.data.tradeNam);

          setState({
            label: response.data.data.pradr.addr.stcd,
            value: response.data.data.pradr.addr.stcd,
          });
          setCity({
            label: response.data.data.pradr.addr.loc,
            value: response.data.data.pradr.addr.loc,
          });
          setAdrs1(response.data.data.pradr.addr.bnm + ',' + response.data.data.pradr.addr.bno);
          setAdrs2(response.data.data.pradr.addr.st + ',' + response.data.data.pradr.addr.flno);
          setPncde(response.data.data.pradr.addr.pncd);
          setStat(response.data.data.sts);
          setesClr('success');
          setErrorHandler('Your GSTIN is successfully verified');
          setOpen(true);
        })
        .catch((err) => {
          setesClr('error');
          setErrorHandler('Invalid Pan');
          setOpen(true);
        });
    }
  };

  useEffect(() => {
    const tabChangeFromSku = localStorage.getItem('add-vendor-product-portfolio');
    if (tabChangeFromSku) {
      handleTab(1);
    }
  }, []);

  const verifyPanPayload = (data) => {
    if (data == '') {
      showSnackbar('Please enter your pan no. for verification', 'warning');
      return false;
    }
    return true;
  };

  const verifyGstPayload = (data) => {
    if (data == '') {
      showSnackbar('Please enter your gst no. for verification', 'warning');
      return false;
    }
    return true;
  };

  const handlePanVal = (e) => {
    // console.log(e.target.value);
    setPanVal(e.target.value);
  };

  const handleGstVal = (e) => {
    // console.log(e.target.value);
    setGstVal(e.target.value);
  };

  const handlePanAltValue = (e) => {
    // console.log(e.target.value);
    setPanAltVal(e.target.value);
  };

  const handleGstAltValue = (e) => {
    // console.log(e.target.value);
    setGstAltVal(e.target.value);
  };

  const handlePanVerification = async () => {
    // console.log('panVal', panVal);
    // console.log('gstAltVal', gstAltVal);
    if (!verifyPanPayload(panVal)) {
      return;
    }

    // const payload = {
    //   documentType: 'PAN',
    //   value: panVal,
    // };
    const payload = {
      pan: panVal,
      stateCode: placeSupply.value,
    };

    try {
      setPanLoader(true);
      // const response = await vendorPanVerification(payload);
      const response = await panVerification(payload);
      // console.log('panResponse', response);
      setGstAltVal(response?.data?.data[0]?.gstin);
      setVendorName(response?.data?.data[0]?.data?.lgnm);
      setDisplayName(response?.data?.data[0]?.data?.tradeNam);
      setAdrs1(response.data.data[0].data.pradr.addr.bnm + ',' + response.data.data[0].data.pradr.addr.bno);
      setAdrs2(response.data.data[0].data.pradr.addr.st + ',' + response.data.data[0].data.pradr.addr.flno);
      setState({
        label: response?.data?.data[0]?.data?.pradr?.addr?.stcd,
        value: response?.data?.data[0]?.data?.pradr?.addr?.stcd,
      });
      setCity({
        label: response?.data?.data[0]?.data?.pradr?.addr?.loc,
        value: response?.data?.data[0]?.data?.pradr?.addr?.loc,
      });
      setPncde(response.data.data[0].data.pradr.addr.pncd);
      setStat(response.data.data[0].data.sts);
      setIsVerified(true);
      setPanLoader(false);
      // console.log('panRes', response);
      // const result = response?.data?.data;
      // setVendorName(result?.vendorName);
    } catch (err) {
      setPanLoader(false);
    }
  };

  const handleGstVerification = async () => {
    // console.log('gstVal', gstVal);
    // console.log('panAltVal', panAltVal);
    if (!verifyGstPayload(gstVal)) {
      return;
    }

    const payload = {
      documentType: 'GST',
      value: gstVal,
    };

    try {
      setGstLoader(true);
      const response = await vendorGstVerification(payload);
      setIsVerified(true);
      setGstLoader(false);
      // console.log('gstRes', response);
      const result = response?.data?.data;
      const addressData = result?.address;

      setVendorName(result?.vendorName);
      setState({
        label: addressData?.state,
        value: addressData?.state,
      });
      setCity({
        label: addressData?.city,
        value: addressData?.city,
      });
      setAdrs1(addressData?.addressLine1);
      setAdrs2(addressData?.addressLine2);
      setPncde(addressData?.pinCode);
    } catch (err) {
      setGstLoader(false);
    }
  };

  useEffect(() => {
    if (panGstVerification.value == 'PAN') {
      setGstVal('');
      setPanAltVal('');
      setIsVerified(false);

      setVendorName('');
      setState('');
      setCity('');
      setAdrs1('');
      setAdrs2('');
      setPncde('');
    }
    if (panGstVerification.value == 'GST') {
      setPanVal('');
      setGstAltVal('');
      setIsVerified(false);
      setVendorName('');
    }
  }, [panGstVerification]);

  // fetching and edit vendor from draft details
  useEffect(() => {
    let fetchDraft = false;
    if (location.pathname === '/purchase/add-vendor') {
      fetchDraft = vendorDraftCode;
    } else {
      fetchDraft = vendorDraftCode && isDraft;
    }
    getVendorDraftDetails(vendorDraftCode)
      .then((res) => {
        setConfigData(res?.data?.data?.object?.config || {});
        const timeStamp = res?.data?.data?.object?.updated || res?.data?.data?.object?.created;
        const givenMoment = moment.utc(timeStamp);
        dispatch(setVendorAutoSaveTime(givenMoment.toISOString()));
        const vendorData = res?.data?.data?.object?.config?.vendorOverview;
        if (fetchDraft && vendorData) {
          if (location.pathname === '/purchase/add-vendor') {
            setCustType({ value: vendorData?.vendorType, label: vendorData?.vendorType });
            setPlaceSupply({
              value: vendorData?.vendorPreference?.supplyPlace,
              label: vendorData?.vendorPreference?.supplyPlace,
            });
            const panDetails = vendorData?.onboardKyc?.pan;
            const gstDetails = vendorData?.onboardKyc?.gst;
            setPanVal(panDetails || '');
            setGstVal(gstDetails || '');
            setPanGstVerification({ value: panDetails ? 'PAN' : 'GST', label: panDetails ? 'PAN' : 'GST' });
            setDisplayName(vendorData?.displayName || '');
            setVendorName(vendorData?.vendorName || '');
            setAdrs1(vendorData?.vendorAddress?.addressLine1 || '');
            setAdrs2(vendorData?.vendorAddress?.addressLine2 || '');
            setState({ value: vendorData?.vendorAddress?.state || '', label: vendorData?.vendorAddress?.state || '' });
            setCntry({
              value: vendorData?.vendorAddress?.country || '',
              label: vendorData?.vendorAddress?.country || '',
            });
            setCity({ value: vendorData?.vendorAddress?.city || '', label: vendorData?.vendorAddress?.city || '' });
            setPncde(vendorData?.vendorAddress?.pinCode ? vendorData.vendorAddress.pinCode : '');
            setWebsite(vendorData?.website || '');
            const contacts = vendorData?.contacts?.map((item) => ({
              item,
            }));
            setInputlist(vendorData?.contacts || []);
            setVendorPreferenceData(vendorData?.vendorPreference || {});
            setGstTreatment({
              value: vendorData?.vendorPreference?.gstTreatment || '',
              label: vendorData?.vendorPreference?.gstTreatment || '',
            });
            setCurrencyVal({
              value: vendorData?.vendorPreference?.currency || '',
              label: vendorData?.vendorPreference?.currency || '',
            });
            setTaxPreference({
              value: vendorData?.vendorPreference?.taxPreference || '',
              label: vendorData?.vendorPreference?.taxPreference || '',
            });
            setEnableExchange(vendorData?.vendorPreference?.enableConversionRate);
            // setBankData(vendorData?.banks[0] || {});
            setBranchName(vendorData?.bank?.bankName || '');
            setAccNo(vendorData?.bank?.bankAccountNo || '');
            if (vendorData?.bank?.bankAccountNo) {
              setBankTransferChecked(true);
            }
            setIfsc(vendorData?.bank?.ifscCode || '');
          } else {
            setCustType({ value: vendorData?.vendor?.vendorType, label: vendorData?.vendor?.vendorType });
            setPlaceSupply({
              value: vendorData?.vendorPreference?.supplyPlace,
              label: vendorData?.vendorPreference?.supplyPlace,
            });
            const panDetails = vendorData?.vendorOnboardKyc?.pan;
            const gstDetails = vendorData?.vendorOnboardKyc?.gst;
            setPanVal(panDetails || '');
            setGstVal(gstDetails || '');
            setPanGstVerification({ value: panDetails ? 'PAN' : 'GST', label: panDetails ? 'PAN' : 'GST' });
            setDisplayName(vendorData?.displayName || '');
            setVendorName(vendorData?.vendor?.vendorName || '');
            setAdrs1(vendorData?.address?.addressLine1 || '');
            setAdrs2(vendorData?.address?.addressLine2 || '');
            setState({ value: vendorData?.address?.state || '', label: vendorData?.address?.state || '' });
            setCntry({
              value: vendorData?.address?.country || '',
              label: vendorData?.address?.country || '',
            });
            setCity({ value: vendorData?.address?.city || '', label: vendorData?.address?.city || '' });
            setPncde(vendorData?.address?.pinCode ? vendorData.address.pinCode : '');
            setWebsite(vendorData?.vendor?.website || '');
            const contacts = vendorData?.contacts?.map((item) => ({
              item,
            }));
            setInputlist(vendorData?.contact || []);
            setVendorPreferenceData(vendorData?.vendorPreference || {});
            setGstTreatment({
              value: vendorData?.vendorPreference?.gstTreatment || '',
              label: vendorData?.vendorPreference?.gstTreatment || '',
            });
            setCurrencyVal({
              value: vendorData?.vendorPreference?.currency || '',
              label: vendorData?.vendorPreference?.currency || '',
            });
            setTaxPreference({
              value: vendorData?.vendorPreference?.taxPreference || '',
              label: vendorData?.vendorPreference?.taxPreference || '',
            });
            setEnableExchange(vendorData?.vendorPreference?.enableConversionRate);
            // setBankData(vendorData?.banks[0] || {});
            setBranchName(vendorData?.bankDetails?.bankName || '');
            setAccNo(vendorData?.bankDetails?.bankAccountNo || '');
            if (vendorData?.bankDetails?.bankAccountNo) {
              setBankTransferChecked(true);
            }
            setIfsc(vendorData?.bankDetails?.ifscCode || '');
          }
        }
      })
      .catch(() => {});
  }, []);

  // fethcing and editing vendor
  useEffect(() => {
    const fetchEdit = editVendorId && !isDraft;
    if (fetchEdit) {
      getVendorDetails(orgId, editVendorId)
        .then((res) => {
          const vendorData = res?.data?.data;
          // console.log(vendorData);
          setCustType({ value: vendorData?.vendorType, label: vendorData?.vendorType });
          setPlaceSupply({
            value: vendorData?.vendorPreference?.supplyPlace,
            label: vendorData?.vendorPreference?.supplyPlace,
          });
          setkycData(vendorData?.kycDetails || {});
          const panDetails = vendorData?.kycDetails?.pan;
          const gstDetails = vendorData?.kycDetails?.gst;
          setPanVal(panDetails || '');
          setGstVal(gstDetails || '');
          setPanGstVerification({ value: panDetails ? 'PAN' : 'GST', label: panDetails ? 'PAN' : 'GST' });
          setDisplayName(vendorData?.displayName || '');
          setVendorName(vendorData?.vendorName || '');
          setAdrsData(vendorData?.addressList?.[0] || '');
          setAdrs1(vendorData?.addressList[0]?.addressLine1 || '');
          setAdrs2(vendorData?.addressList[0]?.addressLine2 || '');
          setState({ value: vendorData?.addressList[0]?.state || '', label: vendorData?.addressList[0]?.state || '' });
          setCntry({
            value: vendorData?.addressList[0]?.country || '',
            label: vendorData?.addressList[0]?.country || '',
          });
          setCity({ value: vendorData?.addressList[0]?.city || '', label: vendorData?.addressList[0]?.city || '' });
          setPncde(vendorData?.addressList[0]?.pinCode ? vendorData.addressList[0].pinCode : '');
          setWebsite(vendorData?.website || '');
          const contacts = vendorData?.contacts?.map((item) => ({
            item,
          }));
          setInputlist(vendorData?.contacts || []);
          setVendorPreferenceData(vendorData?.vendorPreference || {});
          setGstTreatment({
            value: vendorData?.vendorPreference?.gstTreatment || '',
            label: vendorData?.vendorPreference?.gstTreatment || '',
          });
          setCurrencyVal({
            value: vendorData?.vendorPreference?.currency || '',
            label: vendorData?.vendorPreference?.currency || '',
          });
          setTaxPreference({
            value: vendorData?.vendorPreference?.taxPreference || '',
            label: vendorData?.vendorPreference?.taxPreference || '',
          });
          setEnableExchange(vendorData?.vendorPreference?.enableConversionRate);
          setBankData(vendorData?.banks[0] || {});
          setBranchName(vendorData?.banks[0]?.bankName || '');
          setAccNo(vendorData?.banks[0]?.bankAccountNo || '');
          setIfsc(vendorData?.banks[0]?.ifscCode || '');
        })
        .catch(() => {});
    }
  }, [editVendorId]);

  const handleVendorEdit = () => {
    if (editVendorId) {
      const payload = {
        vendor: {
          vendorId: editVendorId,
          tenantId: orgId,
          vendorName: vendorName,
          displayName: displayName,
          // status: 'string',
          // address: 'string',
          website: website || '',
          vendorType: custType?.value || '',
          // vendorLogo: 'string',
          orgId: orgId,
          locationId: locId,
        },
        address: {
          addressId: adrsData?.addressId || '',
          country: cntry?.label || '',
          state: state?.label || '',
          city: city?.label || '',
          phoneNo: adrsData?.phoneNo || '',
          pinCode: pncde || '',
          addressLine1: adrs1 || '',
          addressLine2: adrs2 || '',
          type: adrsData?.type || '',
          addressType: adrsData?.addressType || '',
        },
        contact: inputlist,
        bankDetails: {
          bankRefId: bankData?.bankRefId || '',
          bankName: bankData?.bankName || '',
          bankAccountNo: accNo || '',
          accountHolderName: bankData?.accountHolderName || '',
          ifscCode: ifsc,
          type: bankData?.type || '',
        },
        vendorPreference: {
          preferenceId: vendorPreferenceData?.preferenceId || '',
          gstTreatment: gstTreatment?.value || '',
          taxPreference: taxPreference?.label || '',
          currency: currencyVal?.label || '',
          supplyPlace: placeSupply?.label || '',
          vendorId: editVendorId,
          enableConversionRate: enableExchange,
        },
        vendorOnboardKyc: {
          onboardKycId: kycData?.onboardKycId,
          vendorId: editVendorId || '',
          pan: panVal || '',
          isValidPan: kycData?.isValidPan || '',
          gst: gstVal || '',
          isValidGst: kycData?.isValidGst || '',
          // createdBy: 'string',
          tenantId: kycData?.tenantId || '',
        },
      };
      const autoSavePayload = {
        // id: 0,
        // code: 'string',

        config: { ...(configData || {}), vendorOverview: payload },
        createdBy: uidx,
        createdByName: user_name,
      };
      if (vendorDraftCode) {
        autoSavePayload.code = vendorDraftCode;
      }
      autoSaveVendorDetails(autoSavePayload)
        .then((res) => {
          localStorage.setItem('vendorDraftCode', res?.data?.data?.object?.code);
          if (res?.data?.data?.object?.code) {
            dispatch(setVendorDraftCode(res?.data?.data?.object?.code || ''));
            dispatch(setIsDraft(true));
          }

          handleTab(1);
        })

        .catch(() => {});
      // updateVendorBasicDetails(payload).then((res) => {
      //   // console.log(res?.data?.data);
      // }).catch(() => {

      // });
    }
  };
  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
  return (
    <SoftBox>
      {loader && <Spinner />}
      {!loader && (
        <Grid container spacing={2}>
          {/*---------------------------- new vendor ui -------------------- */}
          <Grid item xs={12}>
            <Card mb={3} className=" addbrand-Box" style={{ marginInline: '5px' }}>
              <Grid container spacing={1.5}>
                <Grid item xs={12} md={5}>
                  <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                    <SoftTypography
                      component="label"
                      variant="caption"
                      fontWeight="bold"
                      textTransform="capitalize"
                      fontSize="13px"
                    >
                      Vendor Type
                    </SoftTypography>
                  </SoftBox>
                  <SoftSelect
                    size="small"
                    menuPortalTarget={document.body}
                    id="status"
                    value={custType}
                    onChange={handleVendorType}
                    options={custOptions}
                  />
                </Grid>

                <Grid item xs={12} md={5}>
                  <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                    <SoftTypography
                      component="label"
                      variant="caption"
                      fontWeight="bold"
                      textTransform="capitalize"
                      fontSize="13px"
                    >
                      {vendorType === 'ho' ? 'Servicable Location' : 'Primary Business Location'}
                    </SoftTypography>
                  </SoftBox>
                  <SoftSelect
                    size="small"
                    menuPortalTarget={document.body}
                    id="status"
                    required={true}
                    value={placeSupply}
                    onChange={(option) => setPlaceSupply(option)}
                    options={placeofsupply}
                  />
                </Grid>

                <Grid item xs={12} md={5}>
                  <SoftBox className="pan-gst-verification">
                    <SoftTypography variant="caption" fontWeight="bold" fontSize="12px">
                      Tax Identification
                    </SoftTypography>

                    <SoftSelect
                      size="small"
                      menuPortalTarget={document.body}
                      id="status"
                      value={panGstVerification}
                      options={[
                        { label: 'PAN', value: 'PAN' },
                        { label: 'GST', value: 'GST' },
                      ]}
                      onChange={(option) => setPanGstVerification(option)}
                    />
                  </SoftBox>
                </Grid>
                <Grid item xs={12} md={7}>
                  <SoftBox className="pan-gst-verification">
                    <SoftTypography
                      variant="caption"
                      fontWeight="bold"
                      fontSize="12px"
                      style={{ marginTop: '15px' }}
                    ></SoftTypography>
                    {panGstVerification.value == 'PAN' ? (
                      <>
                        <SoftBox className="pan-verification">
                          <SoftInput
                            size="small"
                            className="pan-input"
                            placeholder="e.g.: Enter your PAN no."
                            value={panVal}
                            onChange={handlePanVal}
                            disabled={panLoader || isVerified ? true : false}
                          />
                          {panLoader ? (
                            <Spinner />
                          ) : (
                            <SoftButton
                              size="small"
                              variant="outlined"
                              color="info"
                              disabled={isVerified ? true : false}
                              onClick={
                                custType.label == 'Individual' ? individualPanVerification : handlePanVerification
                              }
                              className="smallBtnStyle"
                            >
                              {isVerified ? 'Verified' : 'Verify'}
                            </SoftButton>
                          )}
                        </SoftBox>
                        {/* <SoftBox className="gst-input-box">
                      <SoftInput
                        placeholder="e.g.: Enter your GST no."
                        value={gstAltVal}
                        onChange={handleGstAltValue}
                      />
                    </SoftBox> */}
                      </>
                    ) : panGstVerification.value == 'GST' ? (
                      <>
                        <SoftBox className="gst-verification">
                          <SoftInput
                            size="small"
                            variant="outlined"
                            className="gst-input"
                            placeholder="e.g.: Enter your GST no."
                            value={gstVal}
                            onChange={handleGstVal}
                            disabled={gstLoader || isVerified ? true : false}
                          />
                          {gstLoader ? (
                            <Spinner />
                          ) : (
                            <SoftButton
                              size="small"
                              variant="outlined"
                              color="info"
                              disabled={isVerified ? true : false}
                              onClick={handleGstVerification}
                              className="smallBtnStyle"
                            >
                              {isVerified ? 'Verified' : 'Verify'}
                            </SoftButton>
                          )}
                        </SoftBox>
                        {/* <SoftBox className="pan-input-box">
                      <SoftInput
                        placeholder="e.g.: Enter your PAN no."
                        value={panAltVal}
                        onChange={handlePanAltValue}
                      />
                    </SoftBox> */}
                      </>
                    ) : null}{' '}
                  </SoftBox>
                </Grid>
                <Grid item xs={12} md={5}>
                  <SoftBox>
                    <SoftTypography variant="caption" fontWeight="bold">
                      Business (or) Vendor Name
                      <SoftInput
                        size="small"
                        type="text"
                        value={vendorName}
                        onChange={(e) => setVendorName(e.target.value)}
                        // readOnly={true}
                      ></SoftInput>
                    </SoftTypography>
                  </SoftBox>
                </Grid>
                <Grid item xs={12} md={5}>
                  <SoftBox>
                    <SoftTypography variant="caption" fontWeight="bold" fontSize="12px">
                      Display Name
                      <SoftInput
                        size="small"
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                      ></SoftInput>
                    </SoftTypography>
                  </SoftBox>
                </Grid>
                <Grid item xs={12} style={{ marginBottom: '-20px' }}>
                  <SoftTypography variant="caption" fontWeight="bold" fontSize="12px">
                    Address
                  </SoftTypography>
                </Grid>
                <Grid item xs={12} md={5}>
                  <SoftBox>
                    <SoftTypography variant="caption" fontWeight="bold">
                      Address Line 1
                      <SoftInput
                        size="small"
                        type="text"
                        value={adrs1}
                        onChange={(e) => setAdrs1(e.target.value)}
                      ></SoftInput>
                    </SoftTypography>
                  </SoftBox>
                </Grid>
                <Grid item xs={12} md={5}>
                  <SoftBox>
                    <SoftTypography variant="caption" fontWeight="bold">
                      Address Line 2
                      <SoftInput
                        size="small"
                        type="text"
                        value={adrs2}
                        onChange={(e) => setAdrs2(e.target.value)}
                      ></SoftInput>
                    </SoftTypography>
                  </SoftBox>
                </Grid>
                <Grid item xs={12} md={5}>
                  <SoftBox>
                    <SoftTypography variant="caption" fontWeight="bold">
                      Country
                      {/* <SoftInput
                    type="text"
                    value={cntry}
                    onChange={(e) => setCntry(e.target.value)}
                  ></SoftInput> */}
                      <SoftSelect
                        size="small"
                        value={cntry}
                        options={country}
                        onChange={(option) =>
                          setCntry({
                            label: option.label,
                            value: option.label,
                          })
                        }
                      />
                    </SoftTypography>
                  </SoftBox>
                </Grid>
                <Grid item xs={12} md={3.5}>
                  <SoftBox>
                    <SoftTypography variant="caption" fontWeight="bold">
                      State
                      {/* <SoftInput
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                  ></SoftInput> */}
                      <SoftSelect
                        size="small"
                        value={state}
                        options={states}
                        onChange={(option) => handleState(option)}
                      />
                    </SoftTypography>
                  </SoftBox>
                </Grid>
                <Grid item xs={12} md={3.5}>
                  <SoftBox>
                    <SoftTypography variant="caption" fontWeight="bold">
                      City
                      {/* <SoftInput
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  ></SoftInput> */}
                      <SoftSelect
                        size="small"
                        value={city}
                        options={cities || []}
                        onChange={(option) =>
                          setCity({
                            label: option.label,
                            value: option.label,
                          })
                        }
                      />
                    </SoftTypography>
                  </SoftBox>
                </Grid>
                <Grid item xs={12} md={5}>
                  <SoftBox>
                    <SoftTypography variant="caption" fontWeight="bold">
                      Pincode
                      <SoftInput
                        size="small"
                        type="number"
                        value={pncde}
                        onChange={(e) => setPncde(e.target.value)}
                      ></SoftInput>
                    </SoftTypography>
                  </SoftBox>
                </Grid>
                <Grid item xs={12} md={5}>
                  <SoftBox>
                    <SoftTypography variant="caption" fontWeight="bold" fontSize="12px">
                      Website
                      <SoftInput
                        size="small"
                        type="text"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                      ></SoftInput>
                    </SoftTypography>
                  </SoftBox>
                </Grid>
              </Grid>
            </Card>
          </Grid>

          {/*---------------------- contact info ---------------------*/}
          <Grid container spacing={3}>
            <Grid item xs={12} lg={12}>
              <Card sx={{ height: '100%' }} className="box-white-background">
                <SoftBox p={3}>
                  <SoftTypography variant="h6" fontWeight="bold" fontSize="13px">
                    Vendor Contact <InfoOutlinedIcon sx={{ marginLeft: '5px', fontSize: '16px', color: '#0562fb' }} />
                  </SoftTypography>

                  <SoftBox style={{ marginTop: '16px' }}>
                    <SoftBox className="contact-list-div-box">
                      {inputlist?.map((x, i) => {
                        const isLastIndex = i === inputlist.length - 1;
                        return (
                          <Grid
                            key={i}
                            container
                            spacing={3}
                            className={!isLastIndex ? 'grido-box' : ''}
                            alignItems="center"
                          >
                            <Grid
                              item
                              xs={3}
                              md={2.6}
                              my={'0px'}
                              py={'5px !important'}
                              display="flex"
                              flexDirection="column"
                            >
                              {i === 0 && (
                                <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                                  Contact <span className="span_name">Name</span>
                                </InputLabel>
                              )}
                              <SoftInput
                                size="small"
                                type="text"
                                value={inputlist[i]?.contactName || null}
                                onChange={(e) => handleChange(i, e)}
                                name="contactName"
                              ></SoftInput>
                            </Grid>
                            <Grid
                              item
                              xs={3}
                              md={2.6}
                              my={'0px'}
                              py={'5px !important'}
                              display="flex"
                              flexDirection="column"
                            >
                              {i === 0 && (
                                <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                                  Email
                                </InputLabel>
                              )}
                              <SoftInput
                                size="small"
                                type="email"
                                value={inputlist[i]?.email || null}
                                onChange={(e) => handleChange(i, e)}
                                name="email"
                              ></SoftInput>
                            </Grid>
                            <Grid item xs={3} md={1.5} my={'0px'} py={'5px !important'}>
                              <div style={{ marginTop: i === 0 && '20px' }}>
                                <SoftSelect size="small"></SoftSelect>
                              </div>
                            </Grid>
                            <Grid
                              item
                              xs={3}
                              md={2.6}
                              my={'0px'}
                              py={'5px !important'}
                              display="flex"
                              flexDirection="column"
                            >
                              {i === 0 && (
                                <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                                  Contact Number
                                </InputLabel>
                              )}
                              <SoftInput
                                size="small"
                                type="number"
                                value={inputlist[i]?.phoneNo || null}
                                onChange={(e) => handleChange(i, e)}
                                name="phoneNo"
                              ></SoftInput>
                            </Grid>

                            <Grid
                              item
                              xs={3}
                              md={1.5}
                              lg={1.5}
                              my={2}
                              py={'0px !important'}
                              className="remove"
                              onClick={() => handleRemove(i)}
                              sx={{ color: 'red', cursor: 'pointer' }}
                            >
                              <HighlightOffIcon className="add-customer-add-more" />
                            </Grid>
                            {/* <Grid item xs={3} md={1.2} my={'0px'} py={'5px !important'}>
                              <SoftButton
                                size="small"
                                variant="outlined"
                                color="info"
                                style={{ marginTop: i === 0 && '20px' }}
                              >
                                Verify
                              </SoftButton>
                            </Grid> */}
                          </Grid>
                        );
                      })}
                      <SoftBox>
                        <SoftTypography
                          // className="adds add-more-text"
                          className="add-more-text"
                          component="label"
                          variant="caption"
                          fontWeight="bold"
                          onClick={() => handleRow()}
                        >
                          + Add More
                        </SoftTypography>
                      </SoftBox>{' '}
                    </SoftBox>
                  </SoftBox>
                </SoftBox>
              </Card>
            </Grid>
          </Grid>
          {vendorType === 'ho' && (
            <Grid container spacing={2}>
              <Grid item xs={12} md={12} lg={12} mt={3} sx={{ marginLeft: '1.5rem' }}>
                <SoftBox p={3} className="add-customer-other-details-box">
                  <SoftBox>
                    <SoftTypography variant="h6" fontWeight="bold" fontSize="13px" mb={1}>
                      Servicable Area{' '}
                    </SoftTypography>
                  </SoftBox>
                  <SoftSelect
                    size="small"
                    required={true}
                    isMulti={true}
                    // value={placeSupply}
                    // onChange={(option) => setPlaceSupply(option)}
                    options={placeofsupply}
                  />
                </SoftBox>
              </Grid>
            </Grid>
          )}
          {/* ---------------------------------Tax Information ----------------------- */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={12} lg={12} mt={3} sx={{ marginLeft: '1.5rem' }}>
              <SoftBox p={3} className="add-customer-other-details-box addbrand-Box">
                <SoftBox>
                  <SoftTypography variant="h6" fontWeight="bold" fontSize="13px">
                    Tax Information
                  </SoftTypography>
                </SoftBox>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={3.2}>
                    <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                      <SoftTypography
                        component="label"
                        variant="caption"
                        fontWeight="bold"
                        textTransform="capitalize"
                        fontSize="12px"
                      >
                        GST Treatment
                      </SoftTypography>
                    </SoftBox>
                    <SoftSelect
                      size="small"
                      value={gstTreatment}
                      onChange={(option) => setGstTreatment(option)}
                      options={gstOptions}
                    />
                  </Grid>
                  <Grid item xs={12} md={3.2}>
                    <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                      <SoftTypography
                        component="label"
                        variant="caption"
                        fontWeight="bold"
                        textTransform="capitalize"
                        fontSize="12px"
                      >
                        Place of supply
                      </SoftTypography>
                    </SoftBox>
                    <SoftSelect
                      size="small"
                      value={placeSupply}
                      onChange={(option) => setPlaceSupply(option)}
                      options={placeofsupply}
                    />
                  </Grid>
                  <Grid item xs={12} md={3.2}>
                    <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                      <SoftTypography
                        component="label"
                        variant="caption"
                        fontWeight="bold"
                        textTransform="capitalize"
                        fontSize="12px"
                      >
                        Tax preference
                      </SoftTypography>
                    </SoftBox>
                    <SoftSelect
                      size="small"
                      defaultValue={{ value: '', label: '' }}
                      options={taxOptions}
                      value={taxPreference}
                      onChange={(option) => setTaxPreference(option)}
                    />
                  </Grid>
                  <Grid item xs={12} md={2.4}>
                    <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                      <SoftTypography
                        component="label"
                        variant="caption"
                        fontWeight="bold"
                        textTransform="capitalize"
                        fontSize="12px"
                      >
                        Billing Currency
                      </SoftTypography>
                    </SoftBox>
                    <SoftSelect
                      size="small"
                      defaultValue={{ value: 'India', label: 'INR' }}
                      options={currencies}
                      value={currencyVal}
                      onChange={(option) => setCurrencyVal(option)}
                    />
                  </Grid>
                  <Grid item xs={12} display="flex" alignItems="center">
                    <Checkbox checked={enableExchange} onChange={(e) => setEnableExchange(!enableExchange)} />
                    <SoftTypography fontSize="0.8rem">
                      Enable conversion rates for purchase made in foreign currency{' '}
                      <InfoOutlinedIcon sx={{ marginLeft: '5px', fontSize: '16px', color: '#0562fb' }} />{' '}
                    </SoftTypography>
                  </Grid>
                </Grid>
              </SoftBox>
            </Grid>
            <Grid item xs={12} sx={{ marginLeft: '1.5rem' }}>
              <Card className="add-vendor-other-details addbrand-Box">
                <SoftBox>
                  <SoftTypography variant="h6" fontWeight="bold" fontSize="13px">
                    Payout Information{' '}
                    <InfoOutlinedIcon sx={{ marginLeft: '5px', fontSize: '16px', color: '#0562fb' }} />
                  </SoftTypography>
                </SoftBox>
                <div style={{ display: 'flex', alignItems: 'center', gap: '60px', marginTop: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Checkbox
                      checked={bankTransferChecked}
                      onChange={() => setBankTransferChecked(event.target.checked)}
                    />

                    <InputLabel
                      sx={{
                        fontWeight: '600 !important',
                        fontSize: '0.875rem',
                        color: '#344767',
                        margin: '5px 5px 5px 3px',
                      }}
                    >
                      Bank Transfer
                    </InputLabel>
                  </div>
                  {bankTransferChecked && (
                    <>
                      <div>
                        <RadioGroup
                          name="use-radio-group"
                          value={selectedPayoutMethod}
                          onChange={handlePayoutChange}
                          row
                          style={{ gap: '15px' }}
                        >
                          <FormControlLabel value="Domestic" label="Domestic" control={<Radio />} />
                          <FormControlLabel value="International" label="International" control={<Radio />} />
                        </RadioGroup>
                      </div>
                    </>
                  )}
                </div>
                {bankTransferChecked && (
                  <Grid container spacing={2} mt={0.5}>
                    <Grid item xs={12} md={4}>
                      <SoftBox className="AddVendorInp5">
                        <SoftTypography variant="label" fontWeight="bold" fontSize="12px">
                          Bank name
                          <SoftInput
                            size="small"
                            type="text"
                            value={accName}
                            onChange={(e) => setAccName(e.target.value)}
                          ></SoftInput>
                        </SoftTypography>
                      </SoftBox>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <SoftBox className="AddVendorInp5">
                        <SoftTypography variant="label" fontWeight="bold" fontSize="12px">
                          Bank Account Number
                          {successbnk && editBankDetails ? (
                            <Verified
                              style={{ color: green[500] }}
                              sx={{ position: 'relative', top: '2px', left: '2px' }}
                            />
                          ) : null}
                          <SoftInput
                            size="small"
                            type="number"
                            value={accNo}
                            readOnly={editBankDetails ? true : false}
                            onChange={(e) => setAccNo(e.target.value)}
                          ></SoftInput>
                        </SoftTypography>
                      </SoftBox>
                    </Grid>
                    <Grid item xs={12} md={4} alignItems="center">
                      <SoftBox
                        className="AddVendorInp5"
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <SoftTypography fontWeight="bold" fontSize="12px" flex="0.8">
                          SWIFT / IFSC
                          {successbnk && editBankDetails ? (
                            <Verified
                              style={{ color: green[500] }}
                              sx={{ position: 'relative', top: '2px', left: '2px' }}
                            />
                          ) : null}
                          <SoftInput
                            size="small"
                            type="text"
                            value={ifsc}
                            readOnly={editBankDetails ? true : false}
                            onChange={(e) => setIfsc(e.target.value)}
                          ></SoftInput>
                        </SoftTypography>
                        {/* <button className="add-customer-pan-verify-i" onClick={() => bankAccVerification()}>Verify</button> */}
                        {editBankDetails ? (
                          <>
                            <SoftBox mt={5} className="edit-icon-business-pan">
                              <EditIcon
                                onClick={() => {
                                  setEditBankDetails(false), setAccName('');
                                }}
                              />
                            </SoftBox>
                          </>
                        ) : (
                          <SoftBox sx={{ position: 'relative' }}>
                            <SoftButton
                              size="small"
                              variant="outlined"
                              style={{ marginTop: '20px' }}
                              color="info"
                              // sx={buttonSx}
                              disabled={loadingbnk}
                              onClick={() => bankAccVerification()}
                              className="smallBtnStyle"
                              // className={
                              //   // successbnk ?
                              //   // 'add-customer-pan-verify-i-scs'
                              //   // :
                              //   'add-customer-pan-verify-i'
                              // }
                            >
                              {/* {successbnk ? 'Verified' : 'Verify'} */}
                              Verify
                            </SoftButton>
                            {loadingbnk && (
                              <CircularProgress
                                size={24}
                                // sx={{
                                //   color: green[500],
                                //   position: 'absolute',
                                //   top: '50%',
                                //   left: '50%',
                                //   marginTop: '-12px',
                                //   marginLeft: '-12px',
                                // }}
                                className="add-customer-progress-2"
                              />
                            )}
                          </SoftBox>
                        )}
                      </SoftBox>
                    </Grid>
                  </Grid>
                )}
              </Card>
            </Grid>

            <Grid item xs={12} sx={{ marginLeft: '1.5rem' }}>
              <Card className="add-vendor-other-details addbrand-Box">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Checkbox
                  // checked={promotionCheckBoxValues?.ADJUST_ON_PURCHASE}
                  // onChange={(e) =>
                  //   setPromotionCheckBoxValues((prevState) => ({ ...prevState, ADJUST_ON_PURCHASE: e.target.checked }))
                  // }
                  />

                  <SoftTypography variant="h6" fontWeight="bold" fontSize="13px">
                    Pallet merch access{' '}
                    <InfoOutlinedIcon sx={{ marginLeft: '5px', fontSize: '16px', color: '#0562fb' }} />
                  </SoftTypography>
                </div>
                <br />
              </Card>
            </Grid>
            <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
              <SoftBox className="form-button-customer-vendor">
                <SoftButton className="vendor-second-btn" onClick={backToVendors}>
                  Cancel
                </SoftButton>
                {saveLoader ? (
                  <Spinner />
                ) : (
                  <SoftButton className="vendor-add-btn" onClick={handleSubmit}>
                    Next
                  </SoftButton>
                )}
              </SoftBox>
            </Grid>
          </Grid>
        </Grid>
      )}
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical, horizontal: 'left' }}
      >
        <Alert onClose={handleCloseAlert} severity={esClr} sx={{ width: '100%' }}>
          {errorhandler}
        </Alert>
      </Snackbar>
    </SoftBox>
  );
};
