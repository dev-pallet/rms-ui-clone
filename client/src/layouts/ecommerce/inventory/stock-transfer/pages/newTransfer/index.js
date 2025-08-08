import './newTransfer.css';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Checkbox,
  Divider,
  Grid,
  IconButton,
  Modal,
  TextareaAutosize,
  Tooltip,
  Typography,
} from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { buttonStyles } from '../../../../Common/buttonColor';
import {
  calculationPurchase,
  createStockTransfer,
  deleteStockTransfer,
  detailsStockTransfer,
  getBranchAllAdresses,
  getRetailUserLocationDetails,
  uploadEwayBill,
} from '../../../../../../config/Services';
import { isSmallScreen, textFormatter } from '../../../../Common/CommonFunction';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from '../../../../../../hooks/SnackbarProvider';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloseIcon from '@mui/icons-material/Close';
import DashboardLayout from '../../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../../examples/Navbars/DashboardNavbar';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import MobileNavbar from '../../../../../../examples/Navbars/MobileNavbar/mobile-navbar-drawer';
import SoftBox from '../../../../../../components/SoftBox';
import SoftButton from '../../../../../../components/SoftButton';
import SoftInput from '../../../../../../components/SoftInput';
import SoftSelect from '../../../../../../components/SoftSelect';
import SoftTypography from '../../../../../../components/SoftTypography';
import Spinner from '../../../../../../components/Spinner';
import Swal from 'sweetalert2';
import TransferItemList from './components/productList';
import dayjs from 'dayjs';
import stateCodes from './components/stateCodes';
import { useDebounce } from 'usehooks-ts';

export const NewTransfer2 = () => {
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
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
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
  // const [pageMount, setPageMount] = useState(true);
  const [removeProdLoader, setRemoveProdLoader] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isFileSelected, setIsFileSelected] = useState(false);
  const [ewayBillNumber, setEwayBillNumber] = useState('');
  const [roundOff, setRoundOff] = useState(0);
  const [isCheckedDeliveryCharge, setIsCheckDeliveryCharge] = useState(false);
  const [isCheckedLabourCharge, setIsCheckLabourCharge] = useState(false);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const debouncedDeliveryCharge = useDebounce(deliveryCharge, 300); // Adjust the delay as needed
  const [labourCharge, setLabourCharge] = useState(0);
  const debouncedLabourCharge = useDebounce(labourCharge, 300); // Adjust the delay as needed
  const [additionalExpense, setAdditionalExpense] = useState(false);
  // const newStockTransfer = localStorage.getItem('newStockTransfer');
  const params = useParams();

  // const stnNumber = localStorage.getItem('stnNumber');
  const [stnNumber, setStnNumber] = useState('');
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
    // if (!localStorage.getItem('stnNumber')) {
    //   listAllLocation();
    // }
    if (!params?.stn) {
      listAllLocation();
    }else{
      setStnNumber(params?.stn)
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

        // if (localStorage.getItem('stnNumber')) {
        if (params?.stn) {
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

  // useEffect(() => {
  //   if (localStorage.getItem('stnNumber') && pageMount && !newStockTransfer) {
  //     getStnDetails(localStorage.getItem('stnNumber'));
  //   }
  // }, []);

  useEffect(() => {
    if (params?.stn) {
      getStnDetails(params?.stn);
    }  
  },[]);

  const getStnDetails = (id) => {
    setDataLoader(true);
    // setPageMount(false);
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
        setGrossAmount(response?.stockTransfer?.grossAmount ? Number(response?.stockTransfer?.grossAmount) : 0);
        setSubTotal(response?.stockTransfer?.taxableValue);
        setIgstValue(response?.stockTransfer?.igstValue);
        setSgstValue(response?.stockTransfer?.sgstValue);
        setCgstValue(response?.stockTransfer?.cgstValue);
        setDeliveryCharge(response?.stockTransfer?.deliveryCharge);
        setLabourCharge(response?.stockTransfer?.laborCharge);
        if(response?.stockTransfer?.deliveryCharge !== 0){
          setIsCheckDeliveryCharge(true);
        }
        if(response?.stockTransfer?.laborCharge !== 0){
          setIsCheckLabourCharge(true);
        }

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
    // destinationLocationName: destiAddress[0]?.name,
    destinationLocationName: destiSelectName,
    destinationLocationAddress: Object.values(simplifiedAddresses2).join(' '),
    destinationLocationPinCode: destiAddress[0]?.pincode,

    sourceOrgId: orgId,
    sourceLocationId: originSelectID,
    sourceType: 'RMS',
    // sourceLocationName: originAddress[0]?.pincode,
    // sourceLocationName: originAddress[0]?.name,
    sourceLocationName: originDisplayName,
    sourceLocationAddress: Object.values(simplifiedAddresses1).join(' '),
    sourceLocationPinCode: originAddress[0]?.pincode,

    paymentMode: null,
    paymentTerms: null,
    createdBy: uidx,
    userCreated: userName,
    shippingMethod: shipmentMethod,
    shippingTerms: 'string',
    comments: comment,

    pickUpDate: pickupDate,
    pickupTime: pickupTime || null,
    deliveryDate: deliveryDate,
    deliveryTime: deliveryTime || null,
    deliveryCharge: isCheckedDeliveryCharge ? Number(debouncedDeliveryCharge ?? 0) : 0,
    ewayBillNo: ewayBillNumber,
    roundedOff: roundOff,
    laborCharge: isCheckedLabourCharge ? Number(debouncedLabourCharge ?? 0) : 0,
    // stockTransferItemList: itemArrayList,
  };

  const handleAddProduct = () => {
    payload.destinationStateCode = +statesCode(destiAddress[0]?.state);
    payload.sourceStateCode = +statesCode(originAddress[0]?.state);
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
          // localStorage.setItem('stnNumber', res?.data?.data?.stnNumber);
          if (res?.data?.data?.stnNumber) {
            setStnNumber(res?.data?.data?.stnNumber);
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
    payload.sourceStateCode = +statesCode(originAddress[0]?.state);
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
    // localStorage.removeItem('stnNumber');
    navigate('/inventory/stock-transfer');
  };
  const handleSubmit = async () => {
    if (!originSelect) {
      showSnackbar('Select Origin', 'error');
    } else if (!destiSelect) {
      showSnackbar('Select Destination', 'error');
    } else {
      setSubmitLoader(true);
      payload.destinationStateCode = +statesCode(destiAddress[0]?.state);
      payload.sourceStateCode = +statesCode(originAddress[0]?.state);
      const filteredItemList = itemArrayList.filter((item) =>
        Object.values(item).every((value) => value !== undefined && value !== ''),
      );
      payload.stockTransferItemList = filteredItemList;
      payload.isSubmitted = true;
      if (stnNumber) {
        payload.stnNumber = stnNumber;
      }
      // upload eway bill
      if (selectedFile !== null) {
        handleUploadEwayBill();
      }

      await createStockTransfer(payload)
        .then((res) => {
          setSubmitLoader(false);
          if (res?.data?.data?.es === 1) {
            showSnackbar(res?.data?.data?.message, 'error');
          } else if (res?.data?.data?.es === 0) {
            // localStorage.removeItem('stnNumber');
            navigate('/inventory/stock-transfer');
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
      return stateCodes[normalizedState] || '';
    } else {
      return '';
    }
  };

  // eway bill add file
  const handleIconClick = (e) => {
    if (!stnNumber) {
      e.preventDefault();
      e.stopPropagation();
      showSnackbar('please add a product first', 'warning');
    } else {
      document.getElementById('file-input').click();
    }
  };

  const handleFileRemove = () => {
    setIsFileSelected(false);
  };

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    setSelectedFile(uploadedFile);
    setIsFileSelected(true);
    if (!stnNumber) {
      return;
    }
    if (uploadedFile?.length === 0) {
      setSelectedFile(null);
      setIsFileSelected(false);
      showSnackbar('No files selected', 'error');
      return;
    }
  };

  const handleUploadEwayBill = async () => {
    const formData = new FormData();
    formData.append('image', selectedFile);

    await uploadEwayBill(stnNumber, formData)
      .then((res) => {
        if (res?.data?.data?.es) {
          showSnackbar(res?.data?.data?.message || 'Some error occured', 'error');
          // setIsFileSelected(false);
          return;
        }
        setIsFileSelected(true);
        showSnackbar('File uploaded successfully', 'success');
      })
      .catch((err) => {
        setIsFileSelected(false);
        showSnackbar(err?.response?.data?.message || 'Some error occured', 'error');
      });
  };

  const validateDate = (date) => {
    // Get the current date at the start of the day
    const today = dayjs().startOf('day');
    // Parse the selected date
    const selectedDay = dayjs(date);

    // Compare the dates
    if (selectedDay.isBefore(today)) {
      showSnackbar('Past Date Not Allowed', 'warning');
      return false;
    }

    return true;
  };

  // <-- menu
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event, row) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  // -->

  // <-- delete modal
  const handleDelete = () => {
    const newSwal = Swal.mixin({
      // customClass: {
      //   confirmButton: 'button button-success',
      //   cancelButton: 'button button-error',
      // },
      buttonsStyling: false,
    });

    newSwal
      .fire({
        title: 'Are you sure you want to delete?',
        icon: 'info',
        icon: '',
        showCancelButton: true,
        reverseButtons: true,
        confirmButtonText: 'Delete',
        customClass: {
          title: 'custom-swal-title',
          cancelButton: 'logout-cancel-btn',
          confirmButton: 'logout-success-btn confirm-btn', // Added custom class for title
        },
      })
      .then((result) => {
        if (result.isConfirmed) {
          const payload = {
            stnNumber: stnNumber,
            userId: uidx,
            userName: userName,
            reason: '',
            locId: locId,
          };

          deleteStockTransfer(payload)
            .then((res) => {
              showSnackbar('Stock Tranfer deleted successfully', 'success');
              // localStorage.removeItem('stnNumber');
              navigate('/inventory/stock-transfer');
            })
            .catch((err) => showSnackbar('Failed to delete', 'error'));
        }
      });
  };
  // -->

  const [isFixed, setIsFixed] = useState(false);
  const softBoxRef = useRef(null);

  const [uniqueIndex, setUniqueIndex] = useState([]);

  useEffect(() => {
    const handleScroll = () => {
      if (softBoxRef.current) {
        const softBoxTop = softBoxRef.current.getBoundingClientRect().top;
        setIsFixed(softBoxTop <= 40);
      }
    };
  
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  

  useEffect(() => {
    if (additionalExpense) {
      handleAddProduct();
      setAdditionalExpense(false); // Reset the flag
    }
  }, [debouncedDeliveryCharge, debouncedLabourCharge]);

  return (
    <DashboardLayout>
      {!isMobileDevice && <DashboardNavbar prevLink={true} />}
      {!isMobileDevice && (
        <SoftBox className="content-space-between">
          <SoftTypography fontSize="18px" fontWeight="bold" sx={{ padding: '24px 0px' }}>
            New Stock Transfer
          </SoftTypography>
          {params?.stn && (
            <SoftBox>
              <Tooltip title="Delete">
                <IconButton>
                  <DeleteIcon fontSize="medium" onClick={handleDelete} />
                </IconButton>
              </Tooltip>
            </SoftBox>
          )}
        </SoftBox>
      )}
      <Box className="main-box-pi-pre" sx={{padding: isMobileDevice ? "16px" : ''}}>
        <SoftBox className={`create-pi-card ${!isMobileDevice ? 'po-box-shadow create-pi-card-desktop' : 'create-pi-card-mobile'}`}>
          {isMobileDevice && stnNumber && (
            <SoftBox className="content-right">
              <Tooltip title="Delete">
                <IconButton>
                  <DeleteIcon fontSize="medium" onClick={handleDelete} />
                </IconButton>
              </Tooltip>
            </SoftBox>
          )}
          <Accordion
            expanded={isAccordionExpanded}
            className={`${isMobileDevice && 'transfer-accordion-main-div'}`}
            sx={{ boxShadow: 'none !important' }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              onClick={() => setIsAccordionExpanded(!isAccordionExpanded)}
            >
              {!isMobileDevice ? (
                <Box display="flex" width="100%" justifyContent="flex-end">
                  <Grid container spacing={2} mt={-2}>
                    <Grid item xs={8} md={6} xl={4} sx={{ paddingLeft: '0 !important' }}>
                      <SoftBox
                        mb={1}
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
                          fontSize="16px"
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
            <Grid container spacing={3}>
              <Grid item xs={12} md={12} xl={12} sx={{ textAlign: isMobileDevice && 'center' }}>
                <SoftBox
                  mb={1}
                  ml={0.5}
                  lineHeight={0}
                  display="inline-block"
                  sx={{ textAlign: isMobileDevice && 'center' }}
                >
                  <SoftTypography component="label" variant="caption" textTransform="capitalize" fontSize="16px">
                    Organization Name:{isMobileDevice && <br />} <b>{textFormatter(orgName)}</b>
                  </SoftTypography>
                </SoftBox>
              </Grid>
            </Grid>
            {isMobileDevice && <Divider sx={{ margin: '5px !important', width: '100% !important' }} />}
            <Grid container spacing={isMobileDevice ? 1 : 3} mt={-2} justifyContent="flex-start" columnGap="30px">
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
                            {originAddress?.map((e) => {
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
                            {destiAddress?.map((e) => {
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
                                {allDestiAddresse?.map((e, index) => {
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

            <Grid container spacing={3} mt={-2} justifyContent="flex-start" columnGap="30px">
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
              <Grid item xs={12} sm={12} md={4} xl={4} mr={isMobileDevice ? 0 : 3}>
                <SoftTypography
                  component="label"
                  variant="caption"
                  fontWeight="bold"
                  textTransform="capitalize"
                  fontSize="13px"
                  mt={2}
                >
                  Pickup Date & Time
                </SoftTypography>
                <SoftInput
                  type="date"
                  value={pickupDate}
                  onChange={(e) => {
                    const date = e.target.value;
                    if (validateDate(date)) {
                      setPickupDate(date);
                    } else {
                      return;
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={4} xl={4} mr={isMobileDevice ? 0 : 3}>
                <SoftTypography
                  component="label"
                  variant="caption"
                  fontWeight="bold"
                  textTransform="capitalize"
                  fontSize="13px"
                  mt={2}
                >
                  Estimated Delivery Date & Time
                </SoftTypography>
                <SoftInput
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => {
                    const date = e.target.value;
                    if (validateDate(date)) {
                      setDeliveryDate(date);
                    } else {
                      return;
                    }
                  }}
                />
              </Grid>

              {/* estimated pickup time  */}
              <Grid item xs={12} sm={12} md={4} xl={4} mr={isMobileDevice ? 0 : 3}>
                <SoftBox>
                  <LocalizationProvider dateAdapter={AdapterDayjs} pt={2}>
                    <DemoContainer components={['TimePicker']} sx={{ paddingTop: 0 }}>
                      <TimePicker
                        label="Select Pickup Time"
                        className="time_picker"
                        sx={{
                          width: '100%',
                          '& .MuiInputLabel-formControl': {
                            fontSize: '14px',
                            top: '-0.4rem',
                            color: '#344767 !important',
                            opacity: 0.8,
                          },
                        }}
                        onChange={(newValue) => {
                          const formattedTime = dayjs(newValue).format('hh:mm:ss');
                          setPickupTime(formattedTime);
                        }}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </SoftBox>
              </Grid>

              {/* estimated delivery time  */}
              <Grid item xs={12} sm={12} md={4} xl={4} mr={isMobileDevice ? 0 : 3}>
                <SoftBox>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['TimePicker']} sx={{ paddingTop: 0 }}>
                      <TimePicker
                        label="Select Delivery Time"
                        className="time_picker"
                        sx={{
                          width: '100%',
                          '& .MuiInputLabel-formControl': {
                            fontSize: '14px',
                            top: '-0.4rem',
                            color: '#344767 !important',
                            opacity: 0.8,
                          },
                          '& .MuiStack-root': {
                            paddingTop: '16px',
                          },
                        }}
                        onChange={(newValue) => {
                          const formattedTime = dayjs(newValue).format('hh:mm:ss');
                          setDeliveryTime(formattedTime);
                        }}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </SoftBox>
              </Grid>
              <Grid item xs={12} sm={12} md={4} xl={4} mr={isMobileDevice ? 0 : 3}>
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
                  E-way bill
                </SoftTypography>
                <SoftBox
                  style={{
                    display: 'flex',
                    gap: '5px',
                    justifyContent: 'flex start',
                    alignItems: 'center',
                    opacity: !stnNumber ? 0.6 : 1,
                  }}
                >
                  <SoftBox style={{ width: '60%' }}>
                    <SoftInput
                      placeholder="e-way bill number"
                      value={ewayBillNumber}
                      onChange={(e) => setEwayBillNumber(e.target.value)}
                      disabled={!stnNumber}
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
          </Accordion>
        </SoftBox>

        <SoftBox className={`create-pi-card ${!isMobileDevice ? 'po-box-shadow create-pi-card-desktop' : 'create-pi-card-mobile'}`}>
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

        <SoftBox className={`create-pi-card ${!isMobileDevice ? 'po-box-shadow create-pi-card-desktop' : 'create-pi-card-mobile'}`}>
          <Grid container spacing={3} justifyContent="space-between">
            {/* left  */}
            <Grid item xs={12} md={5} lg={5} xl={5} sx={{ marginTop: '-30px' }}>
              <SoftBox className="textarea-box">
                <SoftTypography fontSize="15px" fontWeight="bold">
                  Add Comments
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
                    fontSize: '14px',
                    height: '130px !important',
                    width: '100%'
                  }}
                />
              </SoftBox>
            </Grid>
            {/* right  */}
            <Grid item xs={12} md={5} lg={5} xl={5} sx={{ marginTop: '-30px' }}>
              <SoftBox className="textarea-box" style={{ marginBottom: '10px', marginLeft: '5px' }}>
                <SoftTypography fontSize="15px" fontWeight="bold">
                  Billing Details (in ₹ )
                </SoftTypography>
              </SoftBox>

              <SoftBox className="billing_details_box">
                <SoftBox display="flex" justifyContent="space-between">
                  <SoftTypography fontSize="0.78rem" p="2px" width="40%">
                    Taxable Value
                  </SoftTypography>
                  <SoftTypography width="50%" fontSize="0.78rem" p="2px" className="sales-billing-mobile-typo">
                    {subTotal || '0'}
                  </SoftTypography>
                </SoftBox>
                {+statesCode(originAddress[0]?.state) === +statesCode(destiAddress[0]?.state) && (
                  <SoftBox display="flex" justifyContent="space-between">
                    <SoftTypography fontSize="0.78rem" p="2px" width="40%">
                      CGST
                    </SoftTypography>
                    <SoftTypography width="50%" fontSize="0.78rem" p="2px" className="sales-billing-mobile-typo">
                      {cgstValue || '0'}
                    </SoftTypography>
                  </SoftBox>
                )}
                {+statesCode(originAddress[0]?.state) === +statesCode(destiAddress[0]?.state) ? (
                  <SoftBox display="flex" justifyContent="space-between">
                    <SoftTypography fontSize="0.78rem" p="2px" width="40%">
                      SGST
                    </SoftTypography>
                    <SoftTypography width="50%" fontSize="0.78rem" p="2px" className="sales-billing-mobile-typo">
                      {sgstValue || '0'}
                    </SoftTypography>
                  </SoftBox>
                ) : (
                  <SoftBox display="flex" justifyContent="space-between">
                    <SoftTypography fontSize="0.78rem" p="2px" width="40%">
                      IGST
                    </SoftTypography>
                    <SoftTypography width="50%" fontSize="0.78rem" p="2px" className="sales-billing-mobile-typo">
                      {igstValue || '0'}
                    </SoftTypography>
                  </SoftBox>
                )}
                <SoftBox display="flex" justifyContent="space-between">
                  <SoftTypography fontSize="0.78rem" p="2px" width="40%">
                    CESS
                  </SoftTypography>
                  <SoftTypography width="50%" fontSize="0.78rem" p="2px" className="sales-billing-mobile-typo">
                    {'0' || 'NA'}
                  </SoftTypography>
                </SoftBox>
                {isCheckedDeliveryCharge &&
                  <SoftBox display="flex" justifyContent="space-between">
                    <SoftTypography fontSize="0.78rem" p="2px" width="40%">
                      Delivery Charge
                    </SoftTypography>
                    <SoftTypography width="50%" fontSize="0.78rem" p="2px" className="sales-billing-mobile-typo">
                      {deliveryCharge ?? 'NA'}
                    </SoftTypography>
                  </SoftBox>
                }
                {isCheckedLabourCharge &&
                  <SoftBox display="flex" justifyContent="space-between">
                    <SoftTypography fontSize="0.78rem" p="2px" width="40%">
                      Labour Charge
                    </SoftTypography>
                    <SoftTypography width="50%" fontSize="0.78rem" p="2px" className="sales-billing-mobile-typo">
                      {labourCharge ?? 'NA'}
                    </SoftTypography>
                  </SoftBox>
                }
                <SoftBox display="flex" justifyContent="space-between" marginTop="10px" marginBottom="10px">
                  <SoftTypography fontSize="18px" fontWeight="bold" p="2px" width="40%">
                    Total
                  </SoftTypography>
                  <SoftTypography
                    width="50%"
                    fontSize="18px"
                    fontWeight="bold"
                    p="2px"
                    className="sales-billing-mobile-typo"
                    borderTop="1px solid gainsboro"
                    borderBottom="1px solid gainsboro"
                  >
                    {/* {grossAmount + deliveryCharge + labourCharge || '0'} */}
                    {grossAmount || '0'}
                  </SoftTypography>
                </SoftBox>
                <SoftBox display="flex" justifyContent="space-between" alignItems="center">
                  <SoftTypography fontSize="0.78rem" p="2px" width="40%">
                    Round Off
                  </SoftTypography>
                  <SoftTypography width="50%" fontSize="0.78rem" p="2px" className="sales-billing-mobile-typo">
                    <SoftInput onChange={({ target }) => setRoundOff(target.value)} type="number" />
                  </SoftTypography>
                </SoftBox>
                <SoftBox display="flex" justifyContent="left" alignItems="center" mt="5px" mb="5px">
                  <SoftTypography p="2px" fontSize="15px" fontWeight="bold">
                    Additional Expense
                  </SoftTypography>
                </SoftBox>
                <SoftBox display="flex" justifyContent="space-between" alignItems="center" mb="5px">
                  <SoftTypography fontSize="0.78rem" p="2px">
                    <Checkbox
                      checked={isCheckedDeliveryCharge}
                      onChange={(e) => {
                        setDeliveryCharge(0);
                        setIsCheckDeliveryCharge(e.target.checked);
                        setAdditionalExpense(true);
                      }}
                      inputProps={{ 'aria-label': 'controlled' }}
                    />
                    Delivery Charge
                  </SoftTypography>
                  <SoftTypography width="50%" fontSize="0.78rem" p="2px" className="sales-billing-mobile-typo">
                    <SoftInput
                      disabled={!isCheckedDeliveryCharge}
                      value={(!isCheckedDeliveryCharge || deliveryCharge === 0) ? "" : deliveryCharge}
                      // onChange={({ target }) => setDeliveryCharge(Number(target.value))}
                      onChange={({target})=> {
                          setDeliveryCharge(Number(target.value));
                          setAdditionalExpense(true);
                        }
                      }
                      type="number"
                    />
                  </SoftTypography>
                </SoftBox>
                <SoftBox display="flex" justifyContent="space-between" alignItems="center">
                  <SoftTypography fontSize="0.78rem" p="2px">
                    <Checkbox
                      checked={isCheckedLabourCharge}
                      onChange={(e) => {
                        setLabourCharge(0);
                        setIsCheckLabourCharge(e.target.checked);
                        setAdditionalExpense(true);
                      }}
                      inputProps={{ 'aria-label': 'controlled' }}
                    />
                    Labour Charge
                  </SoftTypography>
                  <SoftTypography width="50%" fontSize="0.78rem" p="2px" className="sales-billing-mobile-typo">
                    <SoftInput
                      disabled={!isCheckedLabourCharge}
                      value={(!isCheckedLabourCharge || labourCharge === 0) ? "" : labourCharge}
                      // onChange={({ target }) => setLabourCharge(Number(target.value))}
                      onChange={({target}) => {
                          setLabourCharge(Number(target.value))
                          setAdditionalExpense(true);
                        }
                      }
                      type="number"
                    />
                  </SoftTypography>
                </SoftBox>
              </SoftBox>
            </Grid>
            {/* submit  */}
            <Grid item xs={12} md={12} xl={12} sx={{ paddingTop: '0 !important' }}>
              <SoftBox className="add-po-btns" style={{ gap: '10px' }}>
                <SoftButton className="vendor-second-btn" onClick={() => handleCancel()}>
                  Cancel
                </SoftButton>
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
        <br />
      </Box>
    </DashboardLayout>
  );
};
