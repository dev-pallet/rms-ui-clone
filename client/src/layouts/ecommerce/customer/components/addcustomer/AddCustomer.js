import './AddCustomer.css';
import * as React from 'react';
import { addRetail, preApprovedCouponCustomers, uploadRetailLogo } from 'config/Services';
import { city as citys } from 'layouts/ecommerce/softselect-Data/city';
import { country } from 'layouts/ecommerce/softselect-Data/country';
import { green } from '@mui/material/colors';
import { indPanVerification, panVerification, verifyBank, verifyOnlyGst } from '../../../../../config/Services';
import { placeofsupply } from 'layouts/ecommerce/customer/data/placeofsupply';
import { state as states } from 'layouts/ecommerce/softselect-Data/state';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import DefaultLogo from '../../../../../assets/images/default-profile-logo.jpg';
import EditIcon from '@mui/icons-material/Edit';
import Grid from '@mui/material/Grid';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import SoftAvatar from 'components/SoftAvatar';
import SoftBox from 'components/SoftBox';
import SoftButton from 'components/SoftButton';
import SoftInput from 'components/SoftInput';
import SoftSelect from 'components/SoftSelect';
import SoftTypography from 'components/SoftTypography';
import Stack from '@mui/material/Stack';
import Verified from '@mui/icons-material/Verified';

import { AsyncPaginate } from 'react-select-async-paginate';
import validator from 'validator';

export const AddCustomer = () => {
  const [loader, setLoader] = useState(false);
  const [gst, setGst] = useState('');
  const [pan, setPan] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [address, setAddress] = useState('');
  const [website, setWebsite] = useState('');
  const [contactName, setContactName] = useState('');
  const [phNo, setPhNo] = useState('');
  const [email, setEmail] = useState('');
  const [retailLogo, setRetailLogo] = useState(null);
  const [selectedImages, setSelectedImages] = useState(null);
  const [prev, setPrev] = useState('');
  const [contactList, setContactList] = useState([
    {
      contactName: '',
      phoneNo: '',
      email: '',
      contactType: {
        value: '',
        label: 'Select',
      },
    },
  ]);
  let retId;
  //
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [open, setOpen] = useState(false);
  const [vendorName, setVendorName] = useState('');
  const [addressName, setAddressName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [adrs1, setAdrs1] = useState('');
  const [adrs2, setAdrs2] = useState('');
  const [cntry, setCntry] = useState({
    label: 'India',
    value: 'India',
  });
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [cities, setCities] = useState('');
  const [pncde, setPncde] = useState('');
  const [accNo, setAccNo] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [loadingbnk, setLoadingbnk] = useState(false);
  const [loadingGst, setLoadingGst] = useState(false);
  const [successGst, setSuccessGst] = useState(false);
  const [successbnk, setSuccessbnk] = useState(false);
  const [stat, setStat] = useState('');
  const [errorhandler, setErrorHandler] = useState('');
  const [vertical, setVertical] = useState('bottom');
  const [horizontal, setHorizontal] = useState('right');
  const [esClr, setesClr] = useState('');
  const [gstCheck, setGstCheck] = useState(false);
  const [verify, setVerify] = useState(false);
  const [accName, setAccName] = useState('');
  const [editPan, setEditPan] = useState(false);
  const [editBankDetails, setEditBankDetails] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);

  const [preApprovedDiscount, setPreApprovedDiscount] = useState({
    value: '',
    label: 'Select Coupons',
  });

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
    { value: 'Due on receipt1', label: 'Due on receipt 1' },
    { value: 'Due on receipt2', label: 'Due on receipt 2' },
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
  const [custAccess, setCustAccess] = useState([]);
  const custAccessList = [
    { label: 'Warehouse Management System', value: 'Warehouse Management System' },
    { label: 'Store Management System', value: 'Store Management System' },
    { label: 'POS', value: 'POS' },
    { label: 'Pallet App', value: 'Pallet App' },
  ];

  const handleCustomerType = (option) => {
    if (success && option.label === 'Individual') {
      setSuccess(false);
      setLoadingGst(false);
      setPan('');
      setCustomerName('');
      setGst('');
      setAdrs1('');
      setAdrs2('');
      setState('');
      setCity('');
      setPncde('');
    } else if (success && option.label !== 'Individual') {
      setSuccess(false);
      setPan('');
      setCustomerName('');
      setGst('');
    }
    setCustType(option);
  };

  const handleChange = (index, e) => {
    const user_details = localStorage.getItem('user_details');
    const uidx = JSON.parse(user_details).uidx;
    const { name, value } = e.target;
    if (name === 'phoneNo') {
      if (value?.length > 10) {
        return; // Don't proceed further if the length of value exceeds 10
      }
    }
    const list = [...contactList];
    list[index][name] = value;
    list[index]['priority'] = 'string';
    list[index]['entityId'] = 'string';
    list[index]['entityType'] = 'RETAIL';
    list[index]['createdBy'] = uidx;
    setContactList(list);
  };

  const handleContactType = (option, index) => {
    const list = [...contactList];
    list[index]['contactType'] = option;
    setContactList(list);
  };

  const handleRemove = (index) => {
    const list = [...contactList];
    list.splice(index, 1);
    setContactList(list);
  };

  const handleCheckbox = (event, isChecked, value) => {
    const chklabel = event.target.value;
    if (isChecked) {
      setCustAccess([...custAccess, chklabel]);
    }
  };

  const handleRow = () => {
    setContactList([
      ...contactList,
      {
        contactName: '',
        phoneNo: '',
        email: '',
        contactType: {
          value: '',
          label: 'Select',
        },
      },
    ]);
  };

  useEffect(() => {
    const contactListData = contactList.map((item) => ({
      ...item,
      contactType: item.contactType.value,
    }));
  }, [contactList]);

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const orgId = localStorage.getItem('orgId');

  const navigate = useNavigate();

  const handleState = (option) => {
    setState({
      label: option.label,
      value: option.label,
    });

    const citiesInState = citys.filter((city) => city.value == option.value);
    setCities(citiesInState);
  };

  const validatePayload = (payload) => {
    if (payload.retailType == '---') {
      setErrorHandler('Please select Customer Type');
      setesClr('warning');
      setOpen(true);
      return false;
    }
    if (payload.supplyTo == '---') {
      setErrorHandler('Please select Business Location');
      setesClr('warning');
      setOpen(true);
      return false;
    }
    if (payload.name === '') {
      setErrorHandler('Please enter Business (or) Customer Name');
      setesClr('warning');
      setOpen(true);
      return false;
    }
    if (payload.displayName === '') {
      setErrorHandler('Please enter Display Name');
      setesClr('warning');
      setOpen(true);
      return false;
    }
    if (addressName === '') {
      setErrorHandler('Please enter Address Name');
      setesClr('warning');
      setOpen(true);
      return false;
    }
    if (mobileNumber === '' || mobileNumber.length !== 10) {
      setErrorHandler('Please enter mobile number for address and it should be of 10 digit');
      setesClr('warning');
      setOpen(true);
      return false;
    }
    if (adrs1 === '') {
      setErrorHandler('Please enter Address Line 1');
      setesClr('warning');
      setOpen(true);
      return false;
    }
    if (adrs2 === '') {
      setErrorHandler('Please enter Address Line 2');
      setesClr('warning');
      setOpen(true);
      return false;
    }
    if (state === '') {
      setErrorHandler('Please select State');
      setesClr('warning');
      setOpen(true);
      return false;
    }
    if (city === '') {
      setErrorHandler('Please select City');
      setesClr('warning');
      setOpen(true);
      return false;
    }
    if (pncde === '' || pncde.length !== 6) {
      setErrorHandler('Please enter PinCode and it should be of 6 digits');
      setesClr('warning');
      setOpen(true);
      return false;
    }

    if (contactList[0].contactName.length === 0) {
      setErrorHandler('Please enter your contact name');
      setesClr('warning');
      setOpen(true);
      return false;
    }
    if (contactList[0].phoneNo.length === 0 || contactList[0].phoneNo.length !== 10) {
      setErrorHandler('Please enter your contact phone number and it should be of 10 digits');
      setesClr('warning');
      setOpen(true);
      return false;
    }
    // if (contactList[0].email.length === 0 || !validator.isEmail(contactList[0].email)) {
    //   setErrorHandler('Please verify your email or provide a valid email address');
    //   setesClr('warning');
    //   setOpen(true);
    //   return false;
    // }
    if (contactList[0].contactType.value === '') {
      setErrorHandler('Please enter your contact type');
      setesClr('warning');
      setOpen(true);
      return false;
    }

    return true;
  };

  const contextType = localStorage.getItem('contextType');

  const createNewCustomer = (event) => {
    event.preventDefault();

    const user_details = localStorage.getItem('user_details');
    const uidx = JSON.parse(user_details).uidx;

    const contactListData = contactList.map((item) => ({
      ...item,
      contactType: item.contactType.value,
    }));

    const payload = {
      logoUrl: null,
      website: website,
      retailType: custType.label.toUpperCase(),
      source: contextType,
      displayName: displayName,
      panNumber: pan,
      businessType: custType.label,
      name: customerName,
      createdBy: uidx,
      updatedBy: uidx,
      customerName: customerName,
      gstTreatment: gstTreatment.label,
      supplyTo: placeSupply.label,
      taxPreference: taxPreference.label,
      currency: currencyVal.label,
      paymentTerms: payTerms.label,
      priceSlab: priceSlab.label,
      preAssignedCouponCode: preApprovedDiscount.value,
      accessPortal: custAccess.toString(),
      partnerDetails: [
        {
          partnerId: orgId,
          partnerType: contextType === 'WMS' ? 'WAREHOUSE' : 'RETAIL',
          partner: {},
        },
      ],
      contacts: contactListData,
      addresses: [
        {
          entityId: null,
          entityType: 'RETAIL',
          addressLine1: adrs1,
          addressLine2: adrs2,
          country: cntry.label,
          state: state.label,
          city: city.label,
          pincode: pncde,
          createdBy: uidx,
          defaultShipping: 'true',
          defaultBilling: 'true',
          defaultAddress: 'true',
          createdBy: uidx,
          name: addressName,
          mobileNumber: mobileNumber,
        },
      ],
      kycRequest: {
        entityType: 'RETAIL',
        entityId: null,
        documents: [
          {
            documentType: 'BANK_DETAILS',
            documentUrl: null,
            bankAccountNumber: accNo,
            ifscCode: ifsc,
            accountHolderName: accName,
            gstNumber: null,
          },
        ],
        createdBy: uidx,
      },
      createdAt: new Date().toISOString(),
      modifiedBy: null,
      modifiedAt: new Date().toISOString(),
      warehouseId: orgId,
      kycVerified: true,
    };

    if (!validatePayload(payload)) {
      return;
    }

    const formData = new FormData();
    formData.append('file', retailLogo);

    const logoUrl = '';
    const uploadRetailLogoHandlerAndAddRetail = async (formData) => {
      if (retailLogo !== null) {
        try {
          setLoading(true);
          const responseLogo = await uploadRetailLogo(formData);
          const customerLogo = responseLogo.data.data.fileUrl;
          const responseAddRetail = await addRetail({ ...payload, logoUrl: customerLogo });
          setLoading(false);
          navigate('/customer');
        } catch (err) {
          setLoading(false);
          setSuccess(false);
        }
      }
      if (retailLogo == null) {
        setLoading(true);
        addRetail({ ...payload, logoUrl: logoUrl })
          .then(function (response) {
            setLoading(false);
            navigate('/customer');
          })
          .catch((err) => {
            setLoading(false);
            setSuccess(false);
          });
      }
    };
    if (!loading) {
      setLoading(true);
      uploadRetailLogoHandlerAndAddRetail(formData);
    }
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };
  const businessPanVerification = () => {
    const payload = {
      pan: pan,
      stateCode: placeSupply.value,
    };
    if (!loadingGst || !loading) {
      setSuccessGst(false);
      setLoadingGst(true);
      setSuccess(false);
      setLoading(true);
      panVerification(payload)
        .then((response) => {
          setSuccess(true);
          setLoading(false);
          setesClr('success');
          setErrorHandler('Pan is successfully verified');
          setOpen(true);
          setEditPan(true);
          setGst(response.data.data[0].gstin);
          setCustomerName(response.data.data[0].data.lgnm);
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
        })
        .catch((err) => {
          setLoadingGst(false);
          setesClr('error');
          setLoading(false);
          if (pan.length < 10) {
            setErrorHandler('Pan or business location is wrong');
          } else {
            setErrorHandler(
              'Invalid Pan details. Please select the correct location and enter valid pan number or selected vendor type might be wrong',
            );
          }
          setOpen(true);
        });
    }
  };

  // /
  const individualPanVerification = () => {
    const payload = {
      panNo: pan,
      consent: 'Y',
      reason: 'kyc',
    };
    if (!loading) {
      setSuccess(false);
      setLoading(true);
      indPanVerification(payload)
        .then((response) => {
          setSuccess(true);
          setLoading(false);
          setesClr('success');
          setCustomerName(response.data.data.fullName);
          setErrorHandler('Pan is successfully verified');
          setOpen(true);
          setStat(response.data.data.status);
        })
        .catch((err) => {
          setLoading(false);
          setesClr('error');
          if (pan.length < 10) {
            setErrorHandler('Pan is wrong');
          } else {
            setErrorHandler(
              'Invalid Pan details. Please enter valid pan number or selected vendor type might be wrong',
            );
          }
          setOpen(true);
        });
    }
  };

  const bankAccVerification = () => {
    const payload = {
      ifsc: ifsc,
      accountNo: accNo,
      name: '',
      mobileNo: '',
    };
    if (!loadingbnk) {
      setVerify(true);
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
            setAccName(response.data.data.name_at_bank);
          } else {
            setOpen(true);
            setEditBankDetails(false);
            setErrorHandler(response.data.data.message + ' ' + ' Or please enter correct account number');
            setSuccessbnk(false);
            setLoadingbnk(false);
            setesClr('error');
          }
        })
        .catch((err) => {
          setOpen(true);
          setErrorHandler('Something went wrong. Try after some time');
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
          if (customerName !== response.data.data.tradeNam || response.data.data.lgnm) {
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
          setCustomerName(response.data.data.tradeNam);
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
          setSuccessGst(false);
          setLoadingGst(false);
          setesClr('error');
          setErrorHandler('Invalid Pan');
          setOpen(true);
        });
    }
  };

  const onSelectFile = (event) => {
    const file = event.target.files[0];
    setRetailLogo(file);

    const selectedFiles = event.target.files;
    const selectedFilesArray = Array.from(selectedFiles);
    const imagesArray = selectedFilesArray.map((file) => {
      return URL.createObjectURL(file);
    });
    setSelectedImages(imagesArray[0]);
    // setPrev(imagesArray[0]);
    event.target.value = '';
  };

  useEffect(() => {}, [retailLogo]);

  const handleBack = () => {
    setSelectedImages(prev);
  };

  const backToCustomers = () => {
    navigate('/customer');
  };

  // const handleRemove=(payload)=>{
  //   if(newRow.length>1){
  //     setNewRow([...newRow.filter((e)=>e.id!==payload)])
  //   }

  // }

  const customStylesAsyncPaginate = {
    control: (provided, state) => ({
      ...provided,
      borderRadius: '0.4rem',
      height: '40px',
      fontSize: '0.875rem',
      // boxShadow: state.isFocused ? '0 0 0 2px #3699FF' : null,
    }),
    option: (provided, state) => ({
      ...provided,
      // backgroundColor: state.isFocused ? '#3699FF' : null,
      color: '#344767',
      fontSize: '0.875rem',
    }),
  };

  const loadOptions = async (search, loadOptions = [], { page }) => {
    const pageNum = page.toString();
    // let scrollList = true;
    const payload = {
      preApprovedOrgId: orgId,
      preApproved: true,
      userType: 'ORG',
    };

    const response = await preApprovedCouponCustomers(pageNum, payload);

    const result = response.data.data;

    // if (result.currentPage == result.totalPages) {
    //   scrollList = false;
    // } else {
    //   scrollList = true;
    // }

    const coupons = result.coupon;
    const couponsData = coupons.map((item) => {
      if (item.discountType == 'PERCENTAGE') {
        return {
          value: item.couponId,
          label: item.discountValue + ' %' + ' discount',
        };
      }
      if (item.discountType == 'FLAT_OFF') {
        return {
          value: item.couponId,
          label: item.discountValue + ' RS' + ' discount',
        };
      }
    });

    // const at = localStorage.getItem('access_token');
    // const user = localStorage.getItem('user_name');

    // const response = await fetch(
    //   `https://coupon-service-kxyaws5ixa-uc.a.run.app/coupon/api/v1/display/coupon?pageNo=${pageNum}&limit=5`,
    //   {
    //     method: 'POST',
    //     body: JSON.stringify(payload),
    //     headers: {
    //       'Content-Type': 'application/json',
    //       USER: user,
    //       USER_ROLE: 'CLIENT',
    //       at: at,
    //     },
    //   },
    // );
    // const json = await response.json();
    // if (json.currentPage == json.totalPages) {
    //   scrollList = false;
    // } else {
    //   scrollList = true;
    // }
    // const coupons = json.coupon;
    // const couponsData = coupons.map((item) => {
    //   if (item.discountType == 'PERCENTAGE') {
    //     return {
    //       value: item.discountValue + ' %' + ' discount',
    //       label: item.discountValue + ' %' + ' discount',
    //     };
    //   }
    //   if (item.discountType == 'FLAT_OFF') {
    //     return {
    //       value: item.discountValue + ' flat_off' + ' discount',
    //       label: item.discountValue + ' flat_off' + ' discount',
    //     };
    //   }
    // });

    return {
      options: couponsData,
      additional: {
        page: page + 1,
      },
      hasMore: result.currentPage !== result.totalPages && coupons.length ? true : false,
    };
  };

  const handleDiscount = (option) => {
    setPreApprovedDiscount(option);
  };

  const handleCheckboxChange = (event) => {
    setIsCheckboxChecked(event.target.checked);
  };

  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
  return (
    <DashboardLayout>
      <DashboardNavbar prevLink={true} />
      {/* <SoftBox className="add-customer-head">Add New Customer</SoftBox> */}
      <SoftBox
        className="bg-u"
        display="flex"
        justifyContent="flex-start"
        position="relative"
        // minHeight="6.7rem"
        borderRadius="xl"
        sx={{
          backgroundImage: `url(${'https://i.postimg.cc/hvjSRvvW/pngtree-simple-light-blue-background-image-396574.jpg'})`,
        }}
      />
      <Card
        sx={{
          backdropFilter: 'saturate(200%) blur(30px)',
          backgroundColor: ({ functions: { rgba }, palette: { white } }) => rgba(white.main, 0.8),
          boxShadow: ({ boxShadows: { navbarBoxShadow } }) => navbarBoxShadow,
          position: 'relative',
          mt: -8,
          mx: 3,
          p: 3,
        }}
      >
        <Grid alignItems="center" container>
          <label variant="body2">
            <Badge color="secondary" className="pencil-icon" badgeContent={<ModeEditIcon sx={{ fontSize: '5px' }} />} />
            <input
              type="file"
              name="images"
              onChange={onSelectFile}
              multiple
              accept="image/png ,image/jpeg, image/webp"
            />
          </label>
          <SoftAvatar
            src={selectedImages === null ? DefaultLogo : selectedImages}
            alt=""
            variant="rounded"
            size="xl"
            shadow="sm"
          ></SoftAvatar>
        </Grid>
      </Card>

      {/* {loading ? (
        <Spinner />
      ) 
      : ( */}
      {/* {loader && <Spinner />} */}
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} xl={6}>
            <SoftBox mb={3} p={3} className="add-customer-bottom-main">
              <SoftBox mb={1.5} ml={0.5} lineHeight={0} display="inline-block">
                <SoftTypography
                  component="label"
                  variant="caption"
                  fontWeight="bold"
                  textTransform="capitalize"
                  fontSize="13px"
                >
                  Customer Type
                </SoftTypography>
              </SoftBox>
              <SoftSelect value={custType} onChange={handleCustomerType} options={custOptions} />
              <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                <SoftTypography
                  component="label"
                  variant="caption"
                  fontWeight="bold"
                  textTransform="capitalize"
                  fontSize="13px"
                >
                  Business Location
                </SoftTypography>
              </SoftBox>
              <SoftSelect
                required={true}
                value={placeSupply}
                onChange={(option) => setPlaceSupply(option)}
                options={placeofsupply}
              />
              {custType.label === 'Individual' ? (
                <SoftBox display="flex" alignItems="center" justifyContent="space-between" className="ola-box">
                  <SoftBox>
                    <SoftBox display="flex" alignItems="center" justifyContent="flex-start" mb={2}>
                      <SoftTypography variant="caption" fontWeight="bold" fontSize="12px">
                        Indivdual PAN
                      </SoftTypography>
                      {success ? <Verified style={{ color: green[500] }} /> : null}
                    </SoftBox>

                    <SoftInput
                      type="text"
                      readOnly={success ? true : false}
                      value={pan}
                      onChange={(e) => setPan(e.target.value)}
                      className={success ? 'pointer-icon' : 'nopointer-icon'}
                    ></SoftInput>
                  </SoftBox>
                  {/* <button className="add-customer-pan-verify-i"onClick={()=>individualPanVerification()}>{success?Verify:Verified}</button> */}
                  {success ? (
                    <SoftBox mt={5}>
                      <EditIcon onClick={() => handlePanEdit()} />
                    </SoftBox>
                  ) : (
                    <SoftBox sx={{ position: 'relative' }}>
                      <SoftButton
                        variant="contained"
                        disabled={loading || pan.length < 10 || pan.length > 10 ? true : false}
                        onClick={() => individualPanVerification()}
                        className={success ? 'add-customer-pan-verify-i-scs' : 'add-customer-pan-verify-i'}
                      >
                        Verify
                      </SoftButton>
                      {loading && <CircularProgress size={24} className="add-customer-progress-2" />}
                    </SoftBox>
                  )}
                </SoftBox>
              ) : (
                <SoftBox display="flex" alignItems="center" justifyContent="space-between" className="ola-box">
                  <SoftBox>
                    <SoftTypography variant="caption" fontWeight="bold" fontSize="12px">
                      Business PAN
                    </SoftTypography>
                    {success && editPan ? (
                      <Verified style={{ color: green[500] }} sx={{ position: 'relative', top: '5px', left: '2px' }} />
                    ) : null}
                    <SoftInput
                      required={true}
                      type="text"
                      readOnly={editPan ? true : false}
                      value={pan}
                      onChange={(e) => setPan(e.target.value)}
                    ></SoftInput>
                  </SoftBox>
                  {/* <button className="add-customer-pan-verify-i" onClick={()=>businessPanVerification()}>Verify</button> */}
                  {editPan ? (
                    <>
                      <SoftBox mt={5} className="edit-icon-business-pan">
                        <EditIcon onClick={() => setEditPan(false)} />
                      </SoftBox>
                    </>
                  ) : (
                    <SoftBox sx={{ position: 'relative' }}>
                      <SoftButton
                        variant="contained"
                        // sx={buttonSx}
                        disabled={loading || pan.length < 10 || pan.length > 10 ? true : false}
                        onClick={() => businessPanVerification()}
                        className={
                          // success ?
                          // 'add-customer-pan-verify-i-scs'
                          // :
                          'add-customer-pan-verify-i'
                        }
                      >
                        {/* {success ? 'Verified' : 'Verify'} */}
                        Verify
                      </SoftButton>
                      {loading && <CircularProgress size={24} className="add-customer-progress-2" />}
                    </SoftBox>
                  )}
                </SoftBox>
              )}

              {custType.label == 'Individual' ? (
                <SoftBox className="ola-box">
                  <SoftBox>
                    <SoftBox display="flex" justifyContent="flex-start" alignItems="center" mt={2}>
                      <input type="checkbox" onChange={(e) => setGstCheck(e.target.checked)} />
                      <SoftTypography variant="p" fontSize="14px" fontWeight="bold" marginLeft="5px">
                        Include your GSTIN
                      </SoftTypography>
                    </SoftBox>
                  </SoftBox>
                  {gstCheck ? (
                    <SoftBox display="flex" alignItems="center" justifyContent="space-between">
                      <SoftBox>
                        <SoftBox display="flex" alignItems="center" justifyContent="flex-start" mb={2}>
                          <SoftTypography variant="caption" fontWeight="bold" fontSize="12px">
                            GSTIN
                          </SoftTypography>
                          {successGst ? <Verified style={{ color: green[500] }} /> : null}
                        </SoftBox>
                        <SoftInput
                          type="text"
                          readOnly={successGst ? true : false}
                          value={gst}
                          onChange={(e) => setGst(e.target.value)}
                          className={success ? 'pointer-icon' : 'nopointer-icon'}
                        ></SoftInput>
                      </SoftBox>

                      {successGst ? (
                        <SoftBox mt={5}>
                          <EditIcon onClick={() => handleGstEdit()} />
                        </SoftBox>
                      ) : (
                        <SoftBox sx={{ position: 'relative' }}>
                          <SoftButton
                            variant="contained"
                            disabled={loadingGst || gst.length < 15 || gst.length > 15 ? true : false}
                            onClick={() => onlyGstVerification()}
                            className={successGst ? 'add-customer-pan-verify-i-scs' : 'add-customer-pan-verify-i'}
                          >
                            Verify
                          </SoftButton>
                          {loadingGst && <CircularProgress size={24} className="add-customer-progress-2" />}
                        </SoftBox>
                      )}
                    </SoftBox>
                  ) : null}
                </SoftBox>
              ) : (
                <SoftBox>
                  <SoftBox display="flex" alignItems="center" justifyContent="flex-start" mt={1.8} mb={1.2}>
                    <SoftTypography variant="caption" fontWeight="bold" fontSize="12px">
                      GSTIN {success ? '-' : ''}{' '}
                    </SoftTypography>
                    {success ? (
                      <Stack direction="row" spacing={1}>
                        <Chip label={stat} size="small" />
                      </Stack>
                    ) : null}
                  </SoftBox>

                  <SoftInput type="text" value={gst} onChange={(e) => setGst(e.target.value)}></SoftInput>
                </SoftBox>
              )}
              <SoftBox>
                <SoftTypography variant="caption" fontWeight="bold">
                  Business (or) Customer Name
                  <SoftInput
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  ></SoftInput>
                </SoftTypography>
              </SoftBox>
              <SoftBox>
                <SoftTypography variant="caption" fontWeight="bold" fontSize="12px">
                  Display Name
                  <SoftInput
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                  ></SoftInput>
                </SoftTypography>
              </SoftBox>
              <SoftBox>
                <SoftTypography variant="caption" fontWeight="bold" fontSize="12px">
                  Website
                  <SoftInput type="text" value={website} onChange={(e) => setWebsite(e.target.value)}></SoftInput>
                </SoftTypography>
              </SoftBox>
            </SoftBox>
          </Grid>

          {/*  */}

          <Grid item xs={12} md={6} xl={6}>
            <SoftBox className="add-customer-bottom-main">
              <SoftBox>
                <SoftTypography variant="caption" fontWeight="bold">
                  Address Name
                  <SoftInput
                    type="text"
                    value={addressName}
                    onChange={(e) => setAddressName(e.target.value)}
                  ></SoftInput>
                </SoftTypography>
              </SoftBox>
              <SoftBox>
                <SoftTypography variant="caption" fontWeight="bold">
                  Mobile Number
                  <SoftInput
                    type="number"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                  ></SoftInput>
                </SoftTypography>
              </SoftBox>
              <SoftBox>
                <SoftTypography variant="caption" fontWeight="bold">
                  Address Line 1
                  <SoftInput type="text" value={adrs1} onChange={(e) => setAdrs1(e.target.value)}></SoftInput>
                </SoftTypography>
              </SoftBox>
              <SoftBox>
                <SoftTypography variant="caption" fontWeight="bold">
                  Address Line 2
                  <SoftInput type="text" value={adrs2} onChange={(e) => setAdrs2(e.target.value)}></SoftInput>
                </SoftTypography>
              </SoftBox>
              <SoftBox>
                <SoftTypography variant="caption" fontWeight="bold">
                  Country
                  {/* <SoftInput type="text" value={cntry} onChange={(e) => setCntry(e.target.value)}></SoftInput> */}
                  <SoftSelect
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
              <SoftBox>
                <SoftTypography variant="caption" fontWeight="bold">
                  State
                  {/* <SoftInput type="text" value={state} onChange={(e) => setState(e.target.value)}></SoftInput> */}
                  <SoftSelect value={state} options={states} onChange={(option) => handleState(option)} />
                </SoftTypography>
              </SoftBox>
              <SoftBox>
                <SoftTypography variant="caption" fontWeight="bold">
                  City
                  {/* <SoftInput type="text" value={city} onChange={(e) => setCity(e.target.value)}></SoftInput> */}
                  <SoftSelect
                    value={city}
                    options={cities}
                    onChange={(option) =>
                      setCity({
                        label: option.label,
                        value: option.label,
                      })
                    }
                  />
                </SoftTypography>
              </SoftBox>
              <SoftBox>
                <SoftTypography variant="caption" fontWeight="bold">
                  Pincode
                  <SoftInput type="text" value={pncde} onChange={(e) => setPncde(e.target.value)}></SoftInput>
                </SoftTypography>
              </SoftBox>
            </SoftBox>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12} lg={12}>
            <Card sx={{ height: '100%', marginTop: '1rem' }}>
              <SoftBox p={3}>
                <SoftTypography variant="h6" fontWeight="bold" fontSize="13px">
                  Customer Contact
                </SoftTypography>

                <SoftBox mt={2}>
                  <Grid container spacing={3}>
                    <Grid item xs={2.2} md={2.4} lg={2.4}>
                      <SoftTypography variant="caption" fontWeight="bold">
                        Contact Name
                      </SoftTypography>
                    </Grid>
                    <Grid item xs={2.2} md={2.4} lg={2.4}>
                      <SoftTypography variant="caption" fontWeight="bold">
                        Phone Number
                      </SoftTypography>
                    </Grid>
                    <Grid item xs={2.2} md={2.4} lg={2.4}>
                      <SoftTypography variant="caption" fontWeight="bold">
                        Email
                      </SoftTypography>
                    </Grid>
                    <Grid item xs={2.2} md={2.4} lg={2.4}>
                      <SoftTypography variant="caption" fontWeight="bold">
                        Contact Type
                      </SoftTypography>
                    </Grid>
                  </Grid>
                  <SoftBox>
                    {contactList.map((x, i) => {
                      return (
                        <Grid key={i} container spacing={3}>
                          <Grid item xs={2.4} md={2.4} lg={2.4} my={1}>
                            <SoftInput
                              type="text"
                              value={x.contactName}
                              onChange={(e) => handleChange(i, e)}
                              name="contactName"
                            ></SoftInput>
                          </Grid>
                          <Grid item xs={2.4} md={2.4} lg={2.4} my={1}>
                            <SoftInput
                              type="number"
                              value={x.phoneNo}
                              onChange={(e) => handleChange(i, e)}
                              name="phoneNo"
                            ></SoftInput>
                          </Grid>
                          <Grid item xs={2.4} md={2.4} lg={2.4} my={1}>
                            <SoftInput
                              type="text"
                              value={x.email}
                              onChange={(e) => handleChange(i, e)}
                              name="email"
                            ></SoftInput>
                          </Grid>
                          <Grid item xs={2.4} md={2.4} lg={2.4} my={1}>
                            <SoftBox>
                              <SoftSelect
                                name="contactType"
                                value={x.contactType}
                                options={[
                                  {
                                    value: 'SUPPORT',
                                    label: 'SUPPORT',
                                  },
                                  {
                                    value: 'DEFAULT',
                                    label: 'DEFAULT',
                                  },
                                  {
                                    value: 'OTHER',
                                    label: 'OTHER',
                                  },
                                ]}
                                onChange={(option) => handleContactType(option, i)}
                                menuPortalTarget={document.body}
                              />
                            </SoftBox>
                          </Grid>
                          <Grid
                            item
                            xs={2.4}
                            md={1.5}
                            lg={1.5}
                            my={1}
                            onClick={() => handleRemove(i)}
                            style={{ cursor: 'pointer', color: 'red' }}
                          >
                            <HighlightOffIcon className="add-customer-add-more" />
                          </Grid>
                        </Grid>
                      );
                    })}
                  </SoftBox>

                  <SoftTypography
                    className="add-more-text"
                    component="label"
                    variant="caption"
                    fontWeight="bold"
                    onClick={() => handleRow()}
                    // sx={{ fontSize: '12px', color: '#0562FB', cursor: 'pointer' }}
                  >
                    + Add more
                  </SoftTypography>
                </SoftBox>
              </SoftBox>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12} md={12} lg={12} mt={3}>
            <SoftBox p={3} className="add-customer-other-details-box">
              <SoftBox>
                <SoftTypography variant="h6" fontWeight="bold" fontSize="13px">
                  Other Information
                </SoftTypography>
              </SoftBox>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6} lg={6}>
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
                    value={gstTreatment}
                    onChange={(option) => setGstTreatment(option)}
                    options={gstOptions}
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
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
                    value={placeSupply}
                    onChange={(option) => setPlaceSupply(option)}
                    options={placeofsupply}
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
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
                    defaultValue={{ value: '', label: '' }}
                    options={taxOptions}
                    value={taxPreference}
                    onChange={(option) => setTaxPreference(option)}
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                  <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                    <SoftTypography
                      component="label"
                      variant="caption"
                      fontWeight="bold"
                      textTransform="capitalize"
                      fontSize="12px"
                    >
                      Currency
                    </SoftTypography>
                  </SoftBox>
                  <SoftSelect
                    defaultValue={{ value: 'India', label: 'INR' }}
                    options={currencies}
                    value={currencyVal}
                    onChange={(option) => setCurrencyVal(option)}
                  />
                </Grid>

                <Grid item xs={12} md={6} lg={6}>
                  <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                    <SoftTypography
                      component="label"
                      variant="caption"
                      fontWeight="bold"
                      textTransform="capitalize"
                      fontSize="12px"
                    >
                      Payment terms
                    </SoftTypography>
                  </SoftBox>
                  <SoftSelect
                    defaultValue={{ value: '', label: '' }}
                    options={paymentOptions}
                    value={payTerms}
                    onChange={(option) => setPayTerms(option)}
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                  <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                    <SoftTypography
                      component="label"
                      variant="caption"
                      fontWeight="bold"
                      textTransform="capitalize"
                      fontSize="12px"
                    >
                      Price slab
                    </SoftTypography>
                  </SoftBox>
                  <SoftSelect
                    defaultValue={{ value: '', label: '' }}
                    options={priceOptions}
                    value={priceSlab}
                    onChange={(option) => setPriceSlab(option)}
                  />
                </Grid>

                <Grid item xs={12} md={6} lg={6}>
                  <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                    <SoftTypography
                      component="label"
                      variant="caption"
                      fontWeight="bold"
                      textTransform="capitalize"
                      fontSize="12px"
                      sx={{ marginBottom: '1rem' }}
                    >
                      Assign Coupons
                    </SoftTypography>
                  </SoftBox>
                  <SoftBox>
                    <AsyncPaginate
                      className="async-select"
                      value={preApprovedDiscount}
                      onChange={handleDiscount}
                      loadOptions={loadOptions}
                      additional={{
                        page: 1,
                      }}
                      styles={customStylesAsyncPaginate}
                    />
                  </SoftBox>
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                  <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                    <SoftTypography
                      component="label"
                      variant="caption"
                      fontWeight="bold"
                      textTransform="capitalize"
                      fontSize="12px"
                      sx={{ marginBottom: '1rem' }}
                    >
                      Assign Loyalty
                    </SoftTypography>
                  </SoftBox>
                  <SoftBox className="content-left">
                    <input
                      type="checkbox"
                      id="schedule1"
                      name="schedule1"
                      value=""
                      checked={isCheckboxChecked}
                      onChange={handleCheckboxChange}
                    />
                    <label
                      htmlFor="schedule1"
                      style={{
                        fontWeight: '200',
                        fontSize: '0.8rem',
                        lineHeight: '1.5',
                        color: '#4b524d',
                        textAlign: 'left',
                        margin: '10px 0px',
                      }}
                    >
                      {' '}
                      Customer eligible for loyalty
                    </label>
                  </SoftBox>
                </Grid>

                <Grid item xs={12} md={6} lg={6}>
                  <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block"></SoftBox>
                </Grid>
              </Grid>
              {/* <Grid item xs={12} md={6} lg={6}>
                <SoftBox p={3} className="assign-warehouse">
                  <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                    <SoftTypography
                      component="label"
                      variant="caption"
                      fontWeight="bold"
                      textTransform="capitalize"
                      fontSize="12px"
                    >
                      Assign warehouse
                    </SoftTypography>
                  </SoftBox>
                  <SoftSelect
                    defaultValue={{ value: '', label: '' }}
                    options={warehouseOptions}
                    value={warehouseVal}
                    onChange={(option) => setWarehouseVal(option)}
                  />
                </SoftBox>
              </Grid> */}
            </SoftBox>
          </Grid>

          <Grid item xs={12} md={6} xl={6}>
            <Card className="add-vendor-other-details">
              <SoftBox className="AddVendorInp5">
                <SoftTypography variant="label" fontWeight="bold" fontSize="12px">
                  Bank account number
                  {successbnk && editBankDetails ? (
                    <Verified style={{ color: green[500] }} sx={{ position: 'relative', top: '2px', left: '2px' }} />
                  ) : null}
                  <SoftInput
                    type="number"
                    value={accNo}
                    readOnly={editBankDetails ? true : false}
                    onChange={(e) => setAccNo(e.target.value)}
                  ></SoftInput>
                </SoftTypography>
              </SoftBox>
              <SoftBox className="AddVendorInp5" display="flex" justifyContent="space-between" alignItems="center">
                <SoftTypography fontWeight="bold" fontSize="12px" flex="0.5">
                  IFSC
                  {successbnk && editBankDetails ? (
                    <Verified style={{ color: green[500] }} sx={{ position: 'relative', top: '2px', left: '2px' }} />
                  ) : null}
                  <SoftInput
                    type="text"
                    value={ifsc}
                    readOnly={editBankDetails ? true : false}
                    onChange={(e) => setIfsc(e.target.value)}
                  ></SoftInput>
                </SoftTypography>
                {/* <button className="add-customer-pan-verify-i" onClick={() => bankAccVerification()}>Verify</button> */}
                {/* {editBankDetails ? ():(

                 )} */}
                {editBankDetails ? (
                  <>
                    <SoftBox mt={5} className="edit-icon-business-pan">
                      <EditIcon onClick={() => setEditBankDetails(false)} />
                    </SoftBox>
                  </>
                ) : (
                  <SoftBox sx={{ position: 'relative' }}>
                    <SoftButton
                      variant="contained"
                      // sx={buttonSx}
                      disabled={loadingbnk}
                      onClick={() => bankAccVerification()}
                      className={
                        // successbnk ?
                        // 'add-customer-pan-verify-i-scs'
                        // :
                        'add-customer-pan-verify-i'
                      }
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
            </Card>
          </Grid>
          {verify && editBankDetails ? (
            <Grid item xs={12} md={6} xl={6}>
              <Card className="add-vendor-other-details1" style={{ marginLeft: '24px' }}>
                <SoftBox className="AddVendorInp5">
                  <SoftTypography variant="label" fontWeight="bold" fontSize="12px">
                    Bank Holder Name
                    <SoftInput type="text" value={accName} onChange={(e) => setAccName(e.target.value)}></SoftInput>
                  </SoftTypography>
                </SoftBox>
              </Card>
            </Grid>
          ) : null}
          <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
            <SoftBox className="form-button-customer" style={{ display: 'flex', gap: '12px' }}>
              <SoftButton className="vendor-second-btn" onClick={backToCustomers}>
                Cancel
              </SoftButton>
              <SoftButton className="vendor-add-btn" onClick={createNewCustomer}>
                Save
              </SoftButton>
            </SoftBox>
          </Grid>
        </Grid>
      </Box>
      {/*  )} */}
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
    </DashboardLayout>
  );
};
