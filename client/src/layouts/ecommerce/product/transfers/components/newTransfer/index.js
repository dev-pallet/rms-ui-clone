import './newTransfer.css';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Divider,
  Grid,
  InputLabel,
  Modal,
  TextareaAutosize,
  Typography,
} from '@mui/material';
import { buttonStyles } from '../../../../Common/buttonColor';
import {
  calculationPurchase,
  createStockTransfer,
  detailsStockTransfer,
  getBranchAllAdresses,
  getRetailUserLocationDetails,
} from '../../../../../../config/Services';
import { isSmallScreen } from '../../../../Common/CommonFunction';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../../../../../hooks/SnackbarProvider';
import DashboardLayout from '../../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../../examples/Navbars/DashboardNavbar';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MobileNavbar from '../../../../../../examples/Navbars/MobileNavbar/mobile-navbar-drawer';
import SoftBox from '../../../../../../components/SoftBox';
import SoftButton from '../../../../../../components/SoftButton';
import SoftInput from '../../../../../../components/SoftInput';
import SoftSelect from '../../../../../../components/SoftSelect';
import SoftTypography from '../../../../../../components/SoftTypography';
import Spinner from '../../../../../../components/Spinner';
import TransferItemList from './components/productList';

export const NewTransfer = () => {
  const orgName = localStorage.getItem('orgName');
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const userName = localStorage.getItem('user_name');
  const navigate = useNavigate();
  const isMobileDevice = isSmallScreen();
  const user_details = JSON.parse(localStorage.getItem('user_details'));
  const uidx = user_details.uidx;
  const [isAccordionExpanded, setIsAccordionExpanded] = useState(true);
  const [allbranches, setAllbranches] = useState({ value: '', label: '' });
  const showSnackbar = useSnackbar();
  const [submitLoader, setSubmitLoader] = useState(false);
  const [originSelect, setOriginSelect] = useState(false);
  const [originSelectID, setOriginSelectID] = useState('');
  const [originAddress, setOriginAddress] = useState([]);
  const [destiSelect, setDestiSelect] = useState(false);
  const [destiSelectID, setDestiSelectID] = useState('');
  const [destiSelectName, setDestiSelectName] = useState('');
  const [destiAddress, setDestiAddress] = useState([]);
  const [allOriginAddresse, setAllOriginAddresses] = useState([]);
  const [allDestiAddresse, setAllDestiAddresses] = useState([]);
  const [paymentMode, setPaymentMode] = useState({ value: 'Cash', label: 'Cash' });
  const [paymentTerms, setPaymentTerms] = useState('');
  const [shipmentMethod, setShipmentMethod] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [comment, setComment] = useState('');
  const [billingData, setBillingData] = useState({});
  const [grossAmount, setGrossAmount] = useState('');
  const [subTotal, setSubTotal] = useState('');
  const [igstValue, setIgstValue] = useState('');
  const [sgstValue, setSgstValue] = useState('');
  const [cgstValue, setCgstValue] = useState('');

  const [arrayCount, setArrayCount] = useState(1);
  const [count, setCount] = useState(1);
  const [fixedCount, setFixedCount] = useState(0);
  const [stnID, setStnID] = useState('');
  const [barcodeNum, setBarcodeNum] = useState('');
  const [productName, setProductName] = useState('');
  const [mrp, setMrp] = useState('');
  const [availabelUnits, setAvailabelUnits] = useState('');
  const [transferUnits, setTransferUnits] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [batchNumber, setBatchNumber] = useState('');
  const [totalPurchasePrice, setTotalPurchasePrice] = useState('');
  const [productBatch, setProductBatch] = useState('');
  const [allAvailableUnits, setAllAvailableUnits] = useState([]);
  const [allItemList, setAllItemList] = useState([]);
  const [originDisplayName, setOriginDisplayName] = useState('');
  const [dataLoader, setDataLoader] = useState(false);
  const [pageMount, setPageMount] = useState(true);
  const [removeProdLoader, setRemoveProdLoader] = useState(false);

  const stnNumber = localStorage.getItem('stnNumber');
  const extractItemListProperty = (response, property) =>
    response?.map((item) => (item?.[property] !== null && item?.[property] !== undefined ? item?.[property] : ''));

  const shippingOption = [
    { value: 'pay1', label: 'Company Transport' },
    { value: 'pay2', label: 'Own Transport' },
    { value: 'pay3', label: 'Third Party' },
  ];

  let branchArr,
    allBranches = [];

  useEffect(() => {
    if (!localStorage.getItem('stnNumber')) {
      listAllLocation();
    }
  }, []);

  const listAllLocation = (id) => {
    getRetailUserLocationDetails(orgId)
      .then((res) => {
        branchArr = res?.data?.data?.branches;
        const filteredBranches = branchArr?.filter((row) => row?.branchId === locId);
        const otherBranches = branchArr?.filter((row) => row?.branchId !== locId);
        allBranches.push(
          otherBranches?.map((row) => ({
            value: row?.branchId,
            label: row?.displayName,
          })),
        );
        setOriginDisplayName(filteredBranches[0]?.displayName);
        handleOriginLoc(filteredBranches[0]);
        setAllbranches(allBranches[0]);

        if (localStorage.getItem('stnNumber')) {
          const destSelect = allBranches[0].filter((row) => row?.value === id);
          setDestiSelectName(destSelect[0]?.label);
          setDestiSelectID(destSelect[0]?.value);
        }
      })
      .catch((err) => {
        showSnackbar(err?.response?.data?.message, 'error');
      });
  };

  const branchAllAddress = (id) => {
    getBranchAllAdresses(id)
      .then((res) => {
        if (res?.data?.data?.es === 1) {
          showSnackbar(res?.data?.data?.message, 'error');
        } else if (res?.data?.data?.es === 0) {
          const address = res?.data?.data?.addresses;
          setAllDestiAddresses(address);
          let arr = [];
          for (let i = 0; i < address?.length; i++) {
            if (address[i].defaultShipping === true) {
              setDestiAddress([address[i]]);
              arr = [address[i]];
            }
          }
          if (arr?.length === 0) {
            setDestiAddress([address[0]]);
          }
        }
      })
      .catch((err) => {
        showSnackbar(err?.response?.data?.message, 'error');
      });
  };

  useEffect(() => {
    if (localStorage.getItem('stnNumber') && pageMount) {
      getStnDetails(localStorage.getItem('stnNumber'));
    }
  }, []);

  const getStnDetails = (id) => {
    setDataLoader(true);
    setPageMount(false);
    detailsStockTransfer(id)
      .then((res) => {
        const response = res?.data?.data;
        if (response?.es) {
          setDataLoader(false);
          setRemoveProdLoader(false);
          return;
        }
        listAllLocation(response?.stockTransfer?.destinationLocationId);
        branchAllAddress(response?.stockTransfer?.destinationLocationId);
        setDeliveryDate(response?.stockTransfer?.deliveryDate);
        setShipmentMethod(response?.stockTransfer?.shippingMethod);
        setComment(response?.stockTransfer?.comments);
        setGrossAmount(response?.stockTransfer?.grossAmount);
        setSubTotal(response?.stockTransfer?.taxableValue);
        setIgstValue(response?.stockTransfer?.igstValue);
        setSgstValue(response?.stockTransfer?.sgstValue);
        setCgstValue(response?.stockTransfer?.cgstValue);
        const itemList = response?.stockTransfer?.stockTransferItemList;
        setAllItemList(itemList);
        setCount(itemList?.length + 1);
        setDestiSelect(true);
        setBarcodeNum(extractItemListProperty(itemList, 'itemNo', ''));
        setProductName(extractItemListProperty(itemList, 'itemName', ''));
        setMrp(extractItemListProperty(itemList, 'unitPrice', ''));
        setAvailabelUnits(extractItemListProperty(itemList, 'quantityAvailable', ''));
        setPurchasePrice(extractItemListProperty(itemList, 'purchasePrice', ''));
        setSellingPrice(extractItemListProperty(itemList, 'sellingPrice', ''));
        setBatchNumber(extractItemListProperty(itemList, 'batchNumber', ''));
        setTransferUnits(extractItemListProperty(itemList, 'quantityTransfer', ''));
        setStnID(extractItemListProperty(itemList, 'id', ''));
        setTotalPurchasePrice(
          itemList?.map((item) =>
            item?.quantityTransfer !== null &&
            item?.quantityTransfer !== undefined &&
            item?.purchasePrice !== null &&
            item?.purchasePrice !== undefined &&
            item?.purchasePrice !== '' &&
            item?.quantityTransfer !== ''
              ? item?.purchasePrice * item?.quantityTransfer
              : '',
          ),
        );
        // batchNumber.forEach((batch) => {
        //   const matchedItem = itemList.find((item) => item.batchNumber === batch);
        //   if (matchedItem) {
        //     idsForBatchNumbers.push(matchedItem.id);
        //   }
        // });
        // setStnID(idsForBatchNumbers);
        setDataLoader(false);
        setRemoveProdLoader(false);
      })
      .catch((err) => {
        setDataLoader(false);
        setRemoveProdLoader(false);
        showSnackbar(err?.response?.data?.message || 'Some error occured', 'error');
      });
  };

  const handleOriginLoc = (e) => {
    // setOriginSelectID(e.value);
    setOriginSelectID(e.branchId);
    // if (e.value == destiSelectID) {
    if (e.branchId == destiSelectID) {
      showSnackbar('Origin and Destination must differ', 'error');
    } else {
      setOriginSelect(true);
      // getBranchAllAdresses(e.value)
      getBranchAllAdresses(e.branchId)
        .then((res) => {
          if (res?.data?.data?.es === 1) {
            showSnackbar(res?.data?.data?.message, 'error');
          } else if (res?.data?.data?.es === 0) {
            const address = res?.data?.data?.addresses;
            setAllOriginAddresses(address);
            let arr = [];
            for (let i = 0; i < address?.length; i++) {
              if (address[i].defaultBilling === true) {
                setOriginAddress([address[i]]);
                arr = [address[i]];
              }
            }
            if (arr?.length === 0) {
              setOriginAddress([address[0]]);
            }
          }
        })
        .catch((err) => {
          showSnackbar(err?.response?.data?.message, 'error');
        });
    }
  };

  const [selectedOriginAdd, setSelectedOriginAdd] = useState(null);
  const [openOrigin, setOpenOrign] = useState(false);
  const handleOpenOrign = () => setOpenOrign(true);
  const handleCloseOrign = () => setOpenOrign(false);

  const [selectedDestiAdd, setSelectedDestiAdd] = useState(null);
  const [openDesti, setOpenDesti] = useState(false);
  const handleOpenDesti = () => setOpenDesti(true);
  const handleCloseDesti = () => setOpenDesti(false);

  const handleDestinationLoc = (e) => {
    setDestiSelectID(e.value);
    setDestiSelectName(e.label);
    if (originSelectID == e.value) {
      showSnackbar('Origin and Destination must differ', 'error');
    } else {
      setDestiSelect(true);
      branchAllAddress(e.value);
    }
  };

  const handleSelectOriginAddress = (e, index) => {
    handleCloseOrign();
    setSelectedOriginAdd(e);
    setOriginAddress([allOriginAddresse[index]]);
  };

  const handleSelectDestiAddress = (e, index) => {
    handleCloseDesti();
    setSelectedDestiAdd(e);
    setDestiAddress([allDestiAddresse[index]]);
  };

  const simplifiedAddresses1 = {
    name: originAddress[0]?.name,
    addressLine1: originAddress[0]?.addressLine1,
    addressLine2: originAddress[0]?.addressLine2,
    country: originAddress[0]?.country,
    state: originAddress[0]?.state,
    city: originAddress[0]?.city,
    pincode: originAddress[0]?.pincode,
    mobileNumber: originAddress[0]?.mobileNumber,
  };
  const simplifiedAddresses2 = {
    name: destiAddress[0]?.name,
    addressLine1: destiAddress[0]?.addressLine1,
    addressLine2: destiAddress[0]?.addressLine2,
    country: destiAddress[0]?.country,
    state: destiAddress[0]?.state,
    city: destiAddress[0]?.city,
    pincode: destiAddress[0]?.pincode,
    mobileNumber: destiAddress[0]?.mobileNumber,
  };

  const itemArrayList = Array.from({ length: count }).map((_, index) => ({
    stnNumber: stnID[index] ? stnNumber : null,
    id: stnID[index] || null,
    itemNo: barcodeNum[index],
    quantityTransfer: Number(transferUnits[index]),
    quantityAvailable: availabelUnits[index] ? Number(availabelUnits[index]) : 0,
    batchNumber: batchNumber[index],
    purchasePrice: purchasePrice[index],
    sellingPrice: sellingPrice[index],
    unitPrice: mrp[index],
    // expiryDate: expDate[index],
    // sellingPrice: sellingPrice[index],
    // quantityRejected: quantityRejected[index],
    // comments: masterSellingPrice[index],
  }));

  const payload = {
    deliveryDate: deliveryDate,
    destinationLocationId: destiSelectID,
    destinationType: 'RMS',
    destinationLocationName: destiAddress[0]?.name,
    destinationLocationAddress: Object.values(simplifiedAddresses2).join(' '),
    destinationLocationPinCode: destiAddress[0]?.pincode,

    sourceOrgId: orgId,
    sourceLocationId: originSelectID,
    sourceType: 'RMS',
    sourceLocationName: originAddress[0]?.pincode,
    sourceLocationAddress: Object.values(simplifiedAddresses1).join(' '),
    sourceLocationPinCode: originAddress[0]?.pincode,

    paymentMode: null,
    paymentTerms: null,
    createdBy: uidx,
    userCreated: userName,
    shippingMethod: shipmentMethod,
    shippingTerms: 'string',
    comments: comment,
    // stockTransferItemList: itemArrayList,
  };

  const handleAddProduct = () => {
    payload.destinationStateCode = +statesCode(destiAddress[0]?.state);
    payload.sourceStateCod = +statesCode(originAddress[0]?.state);
    const filteredItemList = itemArrayList.filter((item) =>
      Object.values(item).every((value) => value !== undefined && value !== ''),
    );
    payload.stockTransferItemList = filteredItemList;
    if (stnNumber) {
      payload.stnNumber = stnNumber;
    }
    createStockTransfer(payload)
      .then((res) => {
        if (res?.data?.data?.es === 1) {
          showSnackbar(res?.data?.data?.message, 'error');
        } else if (res?.data?.data?.es === 0) {
          localStorage.setItem('stnNumber', res?.data?.data?.stnNumber);
          if (res?.data?.data?.stnNumber) {
            detailsStockTransfer(res?.data?.data?.stnNumber)
              .then((res) => {
                const response = res?.data?.data;
                if (response?.es) {
                  return;
                }
                setGrossAmount(response?.stockTransfer?.grossAmount);
                setSubTotal(response?.stockTransfer?.taxableValue);
                setIgstValue(response?.stockTransfer?.igstValue);
                setSgstValue(response?.stockTransfer?.sgstValue);
                setCgstValue(response?.stockTransfer?.cgstValue);
                const itemList = response?.stockTransfer?.stockTransferItemList;
                setAllItemList(itemList);
                setStnID(extractItemListProperty(itemList, 'id', ''));
              })
              .catch((err) => {});
          }
        }
      })
      .catch((err) => {
        showSnackbar(err?.response?.data?.message, 'error');
      });
  };
  const handleRemoveProduct = () => {
    setRemoveProdLoader(true);
    payload.destinationStateCode = +statesCode(destiAddress[0]?.state);
    payload.sourceStateCod = +statesCode(originAddress[0]?.state);
    const filteredItemList = itemArrayList?.filter((item) =>
      Object.values(item).every((value) => value !== undefined && value !== ''),
    );
    payload.stockTransferItemList = filteredItemList;
    if (stnNumber) {
      payload.stnNumber = stnNumber;
    }
    createStockTransfer(payload)
      .then((res) => {
        if (res?.data?.data?.es === 1) {
          showSnackbar(res?.data?.data?.message, 'error');
        } else if (res?.data?.data?.es === 0) {
          if (res?.data?.data?.stnNumber) {
            getStnDetails(res?.data?.data?.stnNumber);
          }
        }
      })
      .catch((err) => {
        showSnackbar(err?.response?.data?.message, 'error');
      });
  };

  const handleCancel = () => {
    localStorage.removeItem('stnNumber');
    navigate('/products/transfers');
  };
  const handleSubmit = () => {
    if (!originSelect) {
      showSnackbar('Select Origin', 'error');
    } else if (!destiSelect) {
      showSnackbar('Select Destination', 'error');
    } else {
      setSubmitLoader(true);
      payload.destinationStateCode = +statesCode(destiAddress[0]?.state);
      payload.sourceStateCod = +statesCode(originAddress[0]?.state);
      const filteredItemList = itemArrayList.filter((item) =>
        Object.values(item).every((value) => value !== undefined && value !== ''),
      );
      payload.stockTransferItemList = filteredItemList;
      if (stnNumber) {
        payload.stnNumber = stnNumber;
      }
      createStockTransfer(payload)
        .then((res) => {
          setSubmitLoader(false);
          if (res?.data?.data?.es === 1) {
            showSnackbar(res?.data?.data?.message, 'error');
          } else if (res?.data?.data?.es === 0) {
            localStorage.removeItem('stnNumber');
            navigate('/inventory/transfers');
          }
        })
        .catch((err) => {
          setSubmitLoader(false);
          showSnackbar(err?.response?.data?.message, 'error');
        });
    }
  };

  const billItemlist = Array.from({ length: count }).map((_, index) => ({
    itemNo: barcodeNum[index],
    quantityOrdered: Number(transferUnits[index]),
    purchasePrice: purchasePrice[index],
  }));
  const billingCalculation = () => {
    const payload = {
      destinationLocationId: destiSelectID,
      sourceLocationId: originSelectID,
      discount: 0,
      discountType: 'NA',
      cess: 0,
      storeId: locId,
    };
    const filteredItemList = billItemlist.filter((item) =>
      Object.values(item).every((value) => value !== undefined && value !== ''),
    );
    payload.items = filteredItemList;
    calculationPurchase(payload)
      .then((res) => {
        setBillingData(res?.data?.data);
      })
      .catch((err) => {
        showSnackbar(err?.response?.data?.message, 'error');
      });
  };

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

  const [isFixed, setIsFixed] = useState(false);
  const softBoxRef = useRef(null);

  const [uniqueIndex, setUniqueIndex] = useState([]);

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
      {!isMobileDevice && <DashboardNavbar prevLink={true} />}
      <Box className="main-box-pi-pre">
        <SoftBox p={3} className={`${isMobileDevice ? 'transfer-accordion-details po-box-shadow' : 'create-pi-card'}`}>
          {isMobileDevice && (
            <>
              <SoftBox className="create-pi-header">
                <SoftBox sx={{ width: '100%', padding: '15px 20px 15px 15px' }}>
                  <MobileNavbar title={'Create Stock Transfer'} />
                </SoftBox>
              </SoftBox>
            </>
          )}
          <Accordion expanded={isAccordionExpanded} className={`${isMobileDevice && 'transfer-accordion-main-div'}`}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              onClick={() => setIsAccordionExpanded(!isAccordionExpanded)}
            >
              {!isMobileDevice ? (
                <Box display="flex" width="100%" justifyContent="flex-end">
                  <Grid container spacing={3} mt={-2}>
                    <Grid item xs={8} md={6} xl={4}>
                      <SoftBox
                        mb={1}
                        ml={0.5}
                        lineHeight={0}
                        display="flex"
                        justifyContent="flex-start"
                        gap="20px"
                        alignItems="center"
                      >
                        <SoftTypography
                          component="label"
                          variant="caption"
                          fontWeight="bold"
                          textTransform="capitalize"
                          fontSize="13px"
                        >
                          Stock Transfer Details
                        </SoftTypography>
                        {dataLoader && <Spinner size={30} />}
                      </SoftBox>
                    </Grid>
                  </Grid>
                </Box>
              ) : (
                <Typography fontSize="12px" sx={{ color: '#0562FB' }} className="accordion-fill-details-sales">
                  Fill Transfer Details
                  {/* {customerName && (
                  <CheckCircleIcon sx={{ color: 'green !important', height: 15, width: 15, marginTop: '-2px' }} />
                )} */}
                </Typography>
              )}
              <AccordionDetails></AccordionDetails>
            </AccordionSummary>
            {isMobileDevice && <Divider sx={{ margin: '5px !important', width: '100% !important' }} />}
            <Grid container spacing={3} sx={{ padding: '10px' }}>
              <Grid item xs={12} md={12} xl={12} sx={{ textAlign: isMobileDevice && 'center' }}>
                <SoftBox
                  mb={1}
                  ml={0.5}
                  lineHeight={0}
                  display="inline-block"
                  sx={{ textAlign: isMobileDevice && 'center' }}
                >
                  <SoftTypography component="label" variant="caption" textTransform="capitalize" fontSize="16px">
                    Organization Name:{isMobileDevice && <br />} <b>{orgName}</b>
                  </SoftTypography>
                </SoftBox>
              </Grid>
            </Grid>
            {isMobileDevice && <Divider sx={{ margin: '5px !important', width: '100% !important' }} />}
            <Grid
              container
              spacing={isMobileDevice ? 1 : 3}
              mt={-2}
              justifyContent="space-between"
              sx={{ padding: '10px' }}
            >
              <Grid item xs={12} sm={12} md={4} xl={4} mr={isMobileDevice ? 0 : 3}>
                <SoftBox display="flex" flexDirection="column" gap="20px">
                  <div>
                    <SoftTypography
                      component="label"
                      variant="caption"
                      fontWeight="bold"
                      textTransform="capitalize"
                      fontSize="13px"
                    >
                      Origin
                      <span style={{ color: 'red', marginLeft: '5px', fontSize: '17px' }}> *</span>
                    </SoftTypography>
                    <SoftInput disabled value={originDisplayName} />
                    {/* <SoftSelect options={allbranches} onChange={(e) => handleOriginLoc(e)} /> */}
                  </div>
                  <div>
                    {originSelect && (
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <SoftTypography fontSize="12px" fontWeight="bold" mr={2}>
                            Origin Address
                          </SoftTypography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <SoftBox>
                            {originAddress.map((e) => {
                              return (
                                <>
                                  <SoftBox className="vendor-cross-box" key={e.id} width="100%">
                                    <SoftTypography
                                      className="add-pi-font-size"
                                      sx={{ fontWeight: 'bold', fontSize: '14px' }}
                                    >
                                      {e.name}
                                    </SoftTypography>
                                    <SoftTypography className="add-pi-font-size">{e.addressLine1}</SoftTypography>
                                    <SoftTypography className="add-pi-font-size">{e.addressLine2}</SoftTypography>
                                    <SoftTypography className="add-pi-font-size">
                                      {e.city} {e.state}{' '}
                                    </SoftTypography>
                                    <SoftTypography className="add-pi-font-size">
                                      {e.pincode} {e.country}
                                    </SoftTypography>
                                    <SoftTypography className="add-pi-font-size">{e.mobileNumber}</SoftTypography>
                                    <SoftTypography
                                      onClick={handleOpenOrign}
                                      fontSize="12px"
                                      color="info"
                                      style={{ cursor: 'pointer' }}
                                    >
                                      Change the Address
                                    </SoftTypography>
                                  </SoftBox>
                                </>
                              );
                            })}
                            <Modal
                              aria-labelledby="unstyled-modal-title"
                              aria-describedby="unstyled-modal-description"
                              open={openOrigin}
                              onClose={handleCloseOrign}
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
                                  Select Origin Address
                                </Typography>
                                <SoftBox>
                                  {allOriginAddresse.map((e, index) => {
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
                                              checked={selectedOriginAdd === e}
                                              onChange={() => handleSelectOriginAddress(e, index)}
                                            />
                                            <div>
                                              <SoftTypography className="add-pi-font-size">{e?.name}</SoftTypography>
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
                                                {e?.country} {e?.pinCode}
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
                        </AccordionDetails>
                      </Accordion>
                    )}
                  </div>
                </SoftBox>
              </Grid>
              {isMobileDevice && (
                <Divider sx={{ margin: '5px !important', width: '100% !important', marginTop: '30px !important' }} />
              )}
              <Grid item xs={12} sm={12} md={4} xl={4} mr={isMobileDevice ? 0 : 3}>
                <SoftBox display="flex" flexDirection="column" gap="20px">
                  <div>
                    <SoftTypography
                      component="label"
                      variant="caption"
                      fontWeight="bold"
                      textTransform="capitalize"
                      fontSize="13px"
                    >
                      Destination
                      <span style={{ color: 'red', marginLeft: '5px', fontSize: '17px' }}> *</span>
                    </SoftTypography>
                    <SoftSelect
                      {...(destiSelectName && {
                        value: {
                          value: '',
                          label: destiSelectName,
                        },
                      })}
                      placeholder="Select Destination"
                      options={allbranches}
                      onChange={(e) => handleDestinationLoc(e)}
                    />
                  </div>
                  <div>
                    {destiSelect && (
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <SoftTypography fontSize="12px" fontWeight="bold" mr={2}>
                            Destination Address
                          </SoftTypography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <SoftBox>
                            {destiAddress.map((e) => {
                              return (
                                <>
                                  <SoftBox className="vendor-cross-box" key={e.id} width="100%">
                                    <SoftTypography
                                      className="add-pi-font-size"
                                      sx={{ fontWeight: 'bold', fontSize: '14px' }}
                                    >
                                      {e.name}
                                    </SoftTypography>
                                    <SoftTypography className="add-pi-font-size">{e.addressLine1}</SoftTypography>
                                    <SoftTypography className="add-pi-font-size">{e.addressLine2}</SoftTypography>
                                    <SoftTypography className="add-pi-font-size">
                                      {e.city} {e.state}{' '}
                                    </SoftTypography>
                                    <SoftTypography className="add-pi-font-size">
                                      {e.pincode} {e.country}
                                    </SoftTypography>
                                    <SoftTypography className="add-pi-font-size">{e.mobileNumber}</SoftTypography>
                                    <SoftTypography
                                      onClick={handleOpenDesti}
                                      fontSize="12px"
                                      color="info"
                                      style={{ cursor: 'pointer' }}
                                    >
                                      Change the Address
                                    </SoftTypography>
                                  </SoftBox>
                                </>
                              );
                            })}
                          </SoftBox>
                          <Modal
                            aria-labelledby="unstyled-modal-title"
                            aria-describedby="unstyled-modal-description"
                            open={openDesti}
                            onClose={handleCloseOrign}
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
                                Select Origin Address
                              </Typography>
                              <SoftBox>
                                {allDestiAddresse.map((e, index) => {
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
                                            checked={selectedDestiAdd === e}
                                            onChange={() => handleSelectDestiAddress(e, index)}
                                          />
                                          <div>
                                            <SoftTypography className="add-pi-font-size">{e?.name}</SoftTypography>
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
                                              {e?.country} {e?.pinCode}
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
                        </AccordionDetails>
                      </Accordion>
                    )}
                  </div>
                </SoftBox>
              </Grid>
            </Grid>
            {isMobileDevice && (
              <Divider
                sx={{ margin: '5px !important', width: '100% !important', marginTop: destiSelect && '30px !important' }}
              />
            )}

            <Grid container spacing={3} mt={-2} justifyContent="space-between" sx={{ padding: '10px' }}>
              {/* <Grid item xs={12} sm={12} md={3} xl={3}>
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
                  onChange={(option) => setPaymentMode(option)}
                  options={[
                    { value: 'Cash', label: 'Cash' },
                    { value: 'Bank transfers', label: 'Bank transfers' },
                    { value: 'Card/ UPI/ Netbanking', label: 'Card/ UPI/ Netbanking' },
                    { value: 'Cheque', label: 'Cheque' },
                  ]}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={3} xl={3}>
                <SoftTypography
                  component="label"
                  variant="caption"
                  fontWeight="bold"
                  textTransform="capitalize"
                  fontSize="13px"
                >
                  Payment Due Date
                </SoftTypography>
                <SoftInput type="date" value={paymentTerms} onChange={(e) => setPaymentTerms(e.target.value)} />
              </Grid> */}
              <Grid item xs={12} sm={12} md={4} xl={4}>
                <SoftTypography
                  component="label"
                  variant="caption"
                  fontWeight="bold"
                  textTransform="capitalize"
                  fontSize="13px"
                >
                  Shipping Method
                </SoftTypography>
                <SoftSelect
                  value={shippingOption.find((option) => option.value === shipmentMethod) || ''}
                  onChange={(option) => setShipmentMethod(option.value)}
                  options={shippingOption}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={4} xl={4} mr={isMobileDevice ? 0 : 3}>
                <SoftTypography
                  component="label"
                  variant="caption"
                  fontWeight="bold"
                  textTransform="capitalize"
                  fontSize="13px"
                >
                  Delivery Date
                </SoftTypography>
                <SoftInput type="date" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} />
              </Grid>
            </Grid>
          </Accordion>
        </SoftBox>

        {!isMobileDevice && (
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
            <SoftBox display="flex" gap="30px" justifyContent="space-between">
              <SoftTypography variant="h6">
                Enter items you wish to purchase
                {uniqueIndex?.length > 1 && ` (Total Item: ${uniqueIndex?.length})`}
              </SoftTypography>
            </SoftBox>
            <Grid container mt={1} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Grid item xs={0.7} sm={0.7} md={0.7} ml={2}>
                <SoftBox mb={1} display="flex" sx={{ flexWrap: 'no-wrap' }}>
                  <InputLabel sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                    S No.
                  </InputLabel>
                </SoftBox>
              </Grid>

              <Grid item xs={0.7} sm={0.7} md={0.7} ml={2} sx={{ display: 'flex', flexWrap: 'no-wrap' }}>
                <SoftBox mb={1}>
                  <InputLabel
                    required
                    sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}
                  >
                    Barcode
                  </InputLabel>
                </SoftBox>
              </Grid>

              <Grid
                item
                xs={0.7}
                sm={0.7}
                md={0.7}
                ml={2}
                sx={{ display: 'flex', flexWrap: 'no-wrap', paddingLeft: '30px' }}
              >
                <SoftBox mb={1}>
                  <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                    Product Title
                  </InputLabel>
                </SoftBox>
              </Grid>

              <Grid
                item
                xs={0.7}
                sm={0.7}
                md={0.7}
                ml={2}
                sx={{ display: 'flex', flexWrap: 'no-wrap', paddingLeft: '70px' }}
              >
                <SoftBox mb={1}>
                  <InputLabel
                    required
                    sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}
                  >
                    MRP
                  </InputLabel>
                </SoftBox>
              </Grid>

              <Grid item xs={0.7} sm={0.7} md={0.7} ml={2} sx={{ display: 'flex', flexWrap: 'no-wrap' }}>
                <SoftBox mb={1}>
                  <InputLabel
                    required
                    sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}
                  >
                    Available Qty
                  </InputLabel>
                </SoftBox>
              </Grid>

              <Grid item xs={0.7} sm={0.7} md={0.7} ml={2} sx={{ display: 'flex', flexWrap: 'no-wrap' }}>
                <SoftBox mb={1}>
                  <InputLabel
                    required
                    sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}
                  >
                    Transfer Units
                  </InputLabel>
                </SoftBox>
              </Grid>

              <Grid
                item
                xs={0.7}
                sm={0.7}
                md={0.7}
                ml={2}
                sx={{ display: 'flex', flexWrap: 'no-wrap', paddingLeft: '20px' }}
              >
                <SoftBox mb={1}>
                  <InputLabel
                    required
                    sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}
                  >
                    Purchase Price
                  </InputLabel>
                </SoftBox>
              </Grid>

              <Grid
                item
                xs={0.7}
                sm={0.7}
                md={0.7}
                ml={2}
                sx={{ display: 'flex', flexWrap: 'no-wrap', paddingLeft: '20px' }}
              >
                <SoftBox mb={1}>
                  <InputLabel
                    required
                    sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}
                  >
                    Total PP
                  </InputLabel>
                </SoftBox>
              </Grid>

              <Grid
                item
                xs={0.7}
                sm={0.7}
                md={0.7}
                ml={2}
                sx={{ display: 'flex', flexWrap: 'no-wrap', marginRight: '75px' }}
              >
                <SoftBox mb={1}>
                  <InputLabel
                    required
                    sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}
                  >
                    Batch No
                  </InputLabel>
                </SoftBox>
              </Grid>
            </Grid>
          </SoftBox>
        )}

        <SoftBox p={3} className={`create-pi-card ${isMobileDevice && 'po-box-shadow'}`}>
          <TransferItemList
            setArrayCount={setArrayCount}
            arrayCount={arrayCount}
            setCount={setCount}
            count={count}
            setFixedCount={setFixedCount}
            fixedCount={fixedCount}
            setStnID={setStnID}
            stnID={stnID}
            setBarcodeNum={setBarcodeNum}
            barcodeNum={barcodeNum}
            setProductName={setProductName}
            productName={productName}
            setMrp={setMrp}
            mrp={mrp}
            setAvailabelUnits={setAvailabelUnits}
            availabelUnits={availabelUnits}
            setTransferUnits={setTransferUnits}
            transferUnits={transferUnits}
            setPurchasePrice={setPurchasePrice}
            purchasePrice={purchasePrice}
            setSellingPrice={setSellingPrice}
            sellingPrice={sellingPrice}
            setBatchNumber={setBatchNumber}
            batchNumber={batchNumber}
            setTotalPurchasePrice={setTotalPurchasePrice}
            totalPurchasePrice={totalPurchasePrice}
            setOriginSelect={setOriginSelect}
            originSelect={originSelect}
            setDestiSelect={setDestiSelect}
            destiSelect={destiSelect}
            setProductBatch={setProductBatch}
            productBatch={productBatch}
            allAvailableUnits={allAvailableUnits}
            setAllAvailableUnits={setAllAvailableUnits}
            handleAddProduct={handleAddProduct}
            handleRemoveProduct={handleRemoveProduct}
            setAllItemList={setAllItemList}
            allItemList={allItemList}
            removeProdLoader={removeProdLoader}
            uniqueIndex={uniqueIndex}
            setUniqueIndex={setUniqueIndex}
          />
        </SoftBox>

        <SoftBox p={3} className={`create-pi-card ${isMobileDevice && 'po-box-shadow'}`}>
          <Grid container spacing={3} justifyContent="space-between">
            <Grid item xs={12} md={4} xl={4} sx={{ marginTop: '-30px' }}>
              <SoftBox className="textarea-box">
                <SoftTypography fontSize="15px" fontWeight="bold">
                  {' '}
                  Notes
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
                  style={{
                    padding: '10px',
                  }}
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
              <SoftBox className={`${isMobileDevice ? '' : 'add-po-bill-details-box'}`}>
                <SoftBox display="flex" justifyContent="space-between" p={isMobileDevice ? 1 : 3}>
                  <SoftBox style={{ width: '50%' }}>
                    {+statesCode(originAddress[0]?.state) === +statesCode(destiAddress[0]?.state) ? (
                      <>
                        <SoftTypography fontSize="0.78rem" fontWeight="bold" p="2px">
                          CGST
                        </SoftTypography>
                        <SoftTypography fontSize="0.78rem" fontWeight="bold" p="2px">
                          SGST
                        </SoftTypography>
                      </>
                    ) : (
                      <SoftTypography fontSize="0.78rem" fontWeight="bold" p="2px">
                        IGST
                      </SoftTypography>
                    )}
                    <SoftTypography fontSize="0.78rem" fontWeight="bold" p="2px">
                      Sub Total
                    </SoftTypography>
                    {!isMobileDevice && (
                      <SoftTypography fontSize="18px" fontWeight="bold">
                        Total
                      </SoftTypography>
                    )}
                  </SoftBox>
                  <SoftBox style={{ width: '40%' }}>
                    {+statesCode(originAddress[0]?.state) === +statesCode(destiAddress[0]?.state) ? (
                      <>
                        <SoftTypography
                          fontSize="0.78rem"
                          fontWeight="bold"
                          p="2px"
                          className="sales-billing-mobile-typo"
                        >
                          {cgstValue || '0'}
                        </SoftTypography>
                        <SoftTypography
                          fontSize="0.78rem"
                          fontWeight="bold"
                          p="2px"
                          className="sales-billing-mobile-typo"
                        >
                          {sgstValue || '0'}
                        </SoftTypography>
                      </>
                    ) : (
                      <SoftTypography
                        fontSize="0.78rem"
                        fontWeight="bold"
                        p="2px"
                        className="sales-billing-mobile-typo"
                      >
                        {igstValue || '0'}
                      </SoftTypography>
                    )}
                    <SoftTypography fontSize="0.78rem" fontWeight="bold" p="2px" className="sales-billing-mobile-typo">
                      {subTotal || '0'}
                    </SoftTypography>
                    {!isMobileDevice && (
                      <SoftTypography
                        fontSize="18px"
                        fontWeight="bold"
                        // style={totalStyle}
                        className="sales-billing-mobile-typo"
                      >
                        {grossAmount || '0'}
                      </SoftTypography>
                    )}
                  </SoftBox>
                </SoftBox>
                {isMobileDevice && <Divider sx={{ margin: '5px !important', width: '100% !important' }} />}
                {isMobileDevice && (
                  <SoftBox className="billing-total-transfers">
                    <SoftBox style={{ width: '50%' }}>
                      <SoftTypography fontSize="18px" fontWeight="bold">
                        Total
                      </SoftTypography>
                    </SoftBox>
                    <SoftBox style={{ width: '50%' }}>
                      <SoftTypography
                        fontSize="18px"
                        fontWeight="bold"
                        // style={totalStyle}
                        className="sales-billing-mobile-typo"
                      >
                        {grossAmount || '0'}
                      </SoftTypography>
                    </SoftBox>
                  </SoftBox>
                )}
              </SoftBox>
            </Grid>
            <Grid item xs={12} md={6} xl={6}></Grid>
            <Grid item xs={12} md={6} xl={6}>
              <SoftBox className="add-po-btns" style={{ gap: '10px' }}>
                {/* {cartId ? ( */}
                {/* <SoftButton
                  color="error"
                  //   onClick={() => setOpenModal4(true)}
                >
                  Delete
                </SoftButton> */}
                {/* ) : ( */}
                <SoftButton className="vendor-second-btn" onClick={() => handleCancel()}>
                  Cancel{' '}
                </SoftButton>
                {/* )} */}

                <SoftButton
                  variant={buttonStyles.primaryVariant}
                  className="contained-softbutton"
                  onClick={handleSubmit}
                  disabled={submitLoader ? true : false}
                >
                  Submit
                </SoftButton>
              </SoftBox>
            </Grid>
          </Grid>
        </SoftBox>
      </Box>
    </DashboardLayout>
  );
};
