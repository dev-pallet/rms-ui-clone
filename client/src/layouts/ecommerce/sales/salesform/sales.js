import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  Grid,
  InputLabel,
  Modal,
  TextareaAutosize,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { buttonStyles } from '../../Common/buttonColor';
import { isSmallScreen } from '../../Common/CommonFunction';
import { useDebounce } from 'usehooks-ts';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../../../hooks/SnackbarProvider';
import AdditionalSalesFile from './components/additionalFile';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ItemListData from './components/itemList';
import MobileDrawerCommon from '../../Common/MobileDrawer';
import MobileNavbar from '../../../../examples/Navbars/MobileNavbar/mobile-navbar-drawer';
import PreviewIcon from '@mui/icons-material/Preview';
import React, { useEffect, useRef, useState } from 'react';
import SalesCouponModal from './components/couponModal';
import SalesLoyalityModal from './components/loyalityModal';
import SoftBox from '../../../../components/SoftBox';
import SoftButton from '../../../../components/SoftButton';
import SoftSelect from '../../../../components/SoftSelect';
import SoftTypography from '../../../../components/SoftTypography';
import Spinner from '../../../../components/Spinner';
import getCustomerList, {
  deleteSalesOrderCartId,
  editSalesOrder,
  fetchLoyality,
  filterVendorSKUData,
  getAllOrgUsers,
  getCartDetails,
  getCustomerDetails,
  newSalesOrderCart,
  preApprovedCouponCustomers,
  previewSalesOrder,
  removeCoupon,
  removeLoyality,
  salesOrderWithPayment,
  updateCartData,
} from '../../../../config/Services';

const NewSalesForm = () => {
  const showSnackbar = useSnackbar();
  const navigate = useNavigate();
  const [isAccordionExpanded, setIsAccordionExpanded] = useState(true);
  const [loader, setLoader] = useState(false);
  const [cartLoader, setCartLoader] = useState(false);
  const [mobileSalesProductLoader, setMobileSalesProductLoder] = useState(false);
  const [submitLoader, setSumbitLoader] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState(false);
  const [previewLoader, setPreviewLoader] = useState(false);
  const [valueStored, setValueStored] = useState('false');
  const debounceCreateSales = useDebounce(valueStored, 700);
  const [updateCart, setUpdatedCart] = useState(false);
  const [options, setOptions] = useState([]);
  const [salesOption, setSalesOption] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [customerDisplayName, setCustomerDisplayName] = useState('');
  const [cartData, setCartData] = useState({});
  const [retailID, setRetailID] = useState('');
  const [retailLocID, setRetailLocID] = useState('');
  const [retailOrgID, setRetailOrgID] = useState('');
  const [view, setView] = useState(false);
  const [customerSelected, setCustomerSelected] = useState(false);
  const [custBillingAddress, setCustBillingAddress] = useState([]);
  const [allCustAddress, setAllCustAddress] = useState([]);
  const [custShippingAddress, setCustShippingAddress] = useState([]);
  const [storedBillingAddress, setStoredBillingAddress] = useState({});
  const [storedShippingAddress, setStoredShippingAddress] = useState({});
  const [alldata, setAllData] = useState({});
  const [billingData, setBillingData] = useState({});
  const [couponData, setCouponData] = useState({});
  const [loyalityValue, setLoyalityValue] = useState('');
  const [orderedItems, setOrderedItems] = useState([]);
  const [reference, setReference] = useState('');
  const [salesOrderDate, setSalesOrderDate] = useState('');
  const [shipmentDate, setShipmentDate] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('');
  const [salesPerson, setSalesPerson] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentMode, setPaymentMode] = useState('');

  const [shipCheck, setShipCheck] = useState(false);
  const [labourCheck, setLabourCheck] = useState(false);

  const handleShipCheck = (e) => {
    setShipCheck(e.target.checked);
  };

  const handleLabourCheck = (e) => {
    setLabourCheck(e.target.checked);
  };

  const offlinePayment = [
    { value: 'CASH', label: 'Cash' },
    // { value: 'CHEQUE', label: 'Cheque' },
    // { value: 'BANK TRNASFER', label: 'Bank Transfer' },
    // { value: 'CREDIT_CARD', label: 'Credit card' },
    // { value: 'DEBIT_CARD', label: 'Debit card' },
    // { value: 'OTHERS', label: 'OTHERS' },
  ];

  const onlinePayment = [{ value: 'ONLINE', label: 'Online' }];

  const locId = localStorage.getItem('locId');
  const orgId = localStorage.getItem('orgId');
  const contextType = localStorage.getItem('contextType');
  const sourceApp = localStorage.getItem('sourceApp');
  const cartId = localStorage.getItem('cartId-SO');
  const userName = localStorage.getItem('user_name');
  const user_details = JSON.parse(localStorage.getItem('user_details'));
  const uidx = user_details.uidx;
  const mobileNumber = user_details.mobileNumber;

  const isMediumOrLargeScreen = useMediaQuery((theme) => theme.breakpoints.up('md') || theme.breakpoints.up('xl'));

  const [count, setCount] = useState(0);
  const [fixedCount, setFixedCount] = useState(0);
  const [barcodeNum, setBarcodeNum] = useState('');
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [specification, setSpecification] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [cartProductId, setcartProductId] = useState('');
  const [batchNum, setBatchNum] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [itemDiscount, setItemDiscount] = useState('');
  const [itemDiscountType, setItemDiscountType] = useState('');
  const [itemCess, setItemCess] = useState('');

  const [itemMrp, setItemMrp] = useState('');
  const [itemTax, setItemTax] = useState('');
  const [itemAmount, setItemAmount] = useState('');
  const [itemAmountWithTax, setItemAmountWithTax] = useState('');
  const [couponPresent, setCouponPresent] = useState(false);
  const [couponApplied, setCouponApplied] = useState(false);
  const [allCouponList, setAllCouponList] = useState([]);
  const [loyalityMessage, setLoyalityMessage] = useState('');
  const [loyalityData, setLoyalityData] = useState('');
  const [loyalityApplied, setLoyalityApplied] = useState(false);
  const [openLoyalityModal, setOpenLoyalityModal] = useState(false);
  const [openCouponModal, setOpenCouponModal] = useState(false);
  const [cartStatus, setCartStatus] = useState('');

  const [additionalCount, setAdditionalCount] = useState(1);
  const [unitPrice, setUnitPrice] = useState('');
  const [description, setDesciption] = useState('');
  const [additionQuant, setAdditionQuant] = useState('');
  const [additionTax, setAdditionTax] = useState('');
  const [additionAmount, setAdditionAmount] = useState('');
  const [billingGST, setBillingGST] = useState(null);
  const [billingPAN, setBillingPAN] = useState(null);

  const [open1, setOpen1] = React.useState(false);
  const handleOpen1 = () => setOpen1(true);
  const handleClose1 = () => setOpen1(false);

  const [open2, setOpen2] = React.useState(false);
  const handleOpen2 = () => setOpen2(true);
  const handleClose2 = () => setOpen2(false);

  const [openModal3, setOpenModal3] = useState(false);
  const handleCloseModal3 = () => setOpenModal3(false);

  const [openModal4, setOpenModal4] = useState(false);
  const handleCloseModal4 = () => setOpenModal4(false);

  const [openAdditonalModal, setOpenAdditionalModal] = useState(false);

  const [selectedBillAdd, setSelectedBillAdd] = useState(null);
  const handleSelectBillingAddress = (e, index) => {
    handleClose1();
    setSelectedBillAdd(e);
    setUpdatedCart(true);
    setCustBillingAddress([allCustAddress[index]]);
  };

  const [selectedShipAdd, setSelectedShipAdd] = useState(null);
  const handleSelectShippingAddress = (e, index) => {
    handleClose2();
    setSelectedShipAdd(true);
    setUpdatedCart(true);
    setCustShippingAddress([allCustAddress[index]]);
  };

  useEffect(() => {
    customerList();
    handleSalesPerson();
    couponsData();
    getOrgGstPan();
  }, []);

  const getOrgGstPan = () => {
    getCustomerDetails(orgId)
      .then((res) => {
        const response = res?.data?.data?.retail;
        setBillingGST(response?.gstNumber);
        setBillingPAN(response?.panNumber);
      })
      .catch((err) => {
        showSnackbar(err?.response?.data?.message || 'Some error occured', 'error');
      });
  };
  let assuser,
    assRow = [];
  let retryCount = 0;
  const customerList = () => {
    setLoader(true);
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
      .then(function (response) {
        if (response.data.data.code === 'ECONNRESET') {
          if (retryCount < 3) {
            customerList();
            retryCount++;
          } else {
            showSnackbar('Some error occured', 'error');
            setLoader(false);
          }
        } else {
          if (response.data.data.message === 'RETAIL_NOT_FOUND') {
            showSnackbar(response?.data?.data?.message, 'error');
            setTimeout(() => {
              setLoader(false);
            }, 100);
          } else {
            assuser = response?.data?.data?.retails;
            assRow.push(
              assuser?.map((row) => ({
                value: row.retailId,
                label: row.displayName,
              })).sort((a, b) => a.label.localeCompare(b.label)),
            );

            setOptions(assRow[0]);
            setLoader(false);
          }
        }
      })
      .catch((e) => {
        if (e.response.status === '429') {
          customerList();
        } else {
          showSnackbar('Error in Customer List', 'error');
          setTimeout(() => {
            setLoader(false);
          }, 100);
        }
      });
  };

  const couponsData = () => {
    const pageNo = 0;
    const payload = {
      applicableProductType: [],
      applicableBrand: [],
      applicableLocation: [],
      couponCode: [],
      orgId: orgId,
      orgLocId: locId,
      userType: 'ORG',
      channel: 'RMS',
    };
    preApprovedCouponCustomers(pageNo, payload)
      .then((res) => {
        if (res?.data?.data?.coupon?.length > 0) {
          setCouponPresent(true);
          setAllCouponList(res?.data?.data?.coupon);
        } else {
          setCouponPresent(false);
        }
      })
      .catch((err) => {
        setCouponPresent(false);
      });
  };

  const handleCoupon = () => {
    setOpenCouponModal(true);
  };
  const handleLoyality = () => {
    loyalityRedeem(retailID, billingData);
    setOpenLoyalityModal(true);
  };
  let assPerson,
    assRowPerson = [];

  let retryCountSalesPerson = 0;
  const handleSalesPerson = () => {
    setLoader(true);
    const payload = {
      orgId: orgId,
      contextId: locId,
    };
    getAllOrgUsers(payload)
      .then((res) => {
        if (res?.data?.data?.code === 'ECONNRESET') {
          if (retryCountSalesPerson < 3) {
            handleSalesPerson();
            retryCountSalesPerson++;
          } else {
            showSnackbar('Some Error Occured, Try after some time', 'error');
            setLoader(false);
          }
        } else {
          assPerson = res?.data?.data;
          assRowPerson.push(
            assPerson?.map((row) => ({
              label: [row?.firstName + ' ' + row?.secondName],
              value: [row?.firstName + ' ' + row?.secondName],
            })),
          );
          setSalesOption(assRowPerson[0]);
          setLoader(false);
        }
      })
      .catch((err) => {
        if (err.response.status === '429') {
          handleSalesPerson();
        } else {
          showSnackbar('Error in Sales Person List', 'error');
          setTimeout(() => {
            setLoader(false);
          }, 100);
        }
      });
  };

  const handleDetailCust = (e) => {
    setLoader(true);
    if (e.value == 'nil') {
      setCustomerName(e.label);
      setCustomerDisplayName(e.label);
      setView(false);
    } else {
      setCustomerName(e.label);
      setCustomerDisplayName(e.label);
      setView(true);
    }
    const retailId = e.value;
    setRetailID(retailId);
    const custName = e.label;

    if (retailID !== e.value) {
      localStorage.removeItem('cartId-SO');
      localStorage.removeItem('sales_OrderId');
      setCartLoader(true);
      customerDetails(retailId);
    }
  };

  const customerDetails = (retailId) => {
    setCount(0);
    setBarcodeNum('');
    setProductName('');
    setItemMrp('');
    setSpecification('');
    setQuantity('');
    setSellingPrice('');
    setPurchasePrice('');
    setBatchNum('');
    setcartProductId('');
    setItemTax('');
    setItemAmount('');
    setItemAmountWithTax('');

    getCustomerDetails(retailId)
      .then(function (res) {
        const response = res?.data?.data?.retail;
        setRetailLocID(response?.retailId);
        setRetailID(response?.retailId);
        setCustomerName(response?.customerName);
        setCustomerDisplayName(response?.displayName);
        setRetailOrgID(response?.warehouseIds[0]);
        for (let i = 0; i < response?.addresses.length; i++) {
          if (response?.addresses[i].defaultBilling === true) {
            setCustBillingAddress([response?.addresses[i]]);
          }
          if (response?.addresses[i].defaultShipping === true) {
            setCustShippingAddress([response?.addresses[i]]);
          }
        }
        if (response?.addresses.length > 0) {
          setAllCustAddress(response?.addresses);
        }
        setLoader(false);
        setCustomerSelected(true);
        setValueStored('true');

        if(!localStorage.getItem('cartId-SO')){
          const payload = {
            createdBy: userName,
            userId: response?.retailId,
            mobileNo: mobileNumber,
            userName: response?.customerName,
            locationId: locId,
            sourceId: response?.retailId,
            sourceLocationId: response?.retailId,
            loggedInUser: uidx,
            destinationId: orgId,
            destinationLocationId: locId,
            sourceType: 'RETAIL',
            sourceApp: sourceApp,
            destinationType: contextType,
            orderType: 'SALES_ORDER',
            comments: '',
            address: {
              billingAddress: {
                addressId: response?.addresses[0]?.id,
                country: response?.addresses[0]?.country,
                state: response?.addresses[0]?.state,
                city: response?.addresses[0]?.city,
                pinCode: response?.addresses[0]?.pincode,
                phoneNo: response?.addresses[0]?.mobileNumber,
                addressLine1: response?.addresses[0]?.addressLine1,
                addressLine2: response?.addresses[0]?.addressLine2,
                type: response?.addresses[0]?.entityType,
                addressType: response?.addresses[0]?.addressType,
                updatedBy: uidx,
                updatedOn: '',
                gstIn: billingGST || null, // organ
                panNumber: billingPAN || null,
              },
              shippingAddress: {
                addressId: response?.addresses[0]?.id,
                country: response?.addresses[0]?.country,
                state: response?.addresses[0]?.state,
                city: response?.addresses[0]?.city,
                pinCode: response?.addresses[0]?.pincode,
                phoneNo: response?.addresses[0]?.mobileNumber,
                addressLine1: response?.addresses[0]?.addressLine1,
                addressLine2: response?.addresses[0]?.addressLine2,
                type: response?.addresses[0]?.entityType,
                addressType: response?.addresses[0]?.addressType,
                updatedBy: uidx,
                updatedOn: '',
                gstIn: response?.gstNumber || null, // customers else null
                panNumber: response?.panNumber || null,
              },
            },
          };
  
          newSalesOrderCart(payload)
            .then(function (response) {
              localStorage.setItem('cartId-SO', response?.data?.data?.cartId);
              setCustomerName(response?.data?.data?.userName);
              setAllData(response?.data?.data);
              setBillingData(response?.data?.data?.billing);
              setCouponData(response?.data?.data?.cartCoupon);
              setCouponData(res?.data?.data?.cartCoupon);
              setCartStatus(res?.data?.data?.cartStatus);
              setLoyalityValue(res?.data?.data?.loyaltyPointsValue);
              if (res?.data?.data?.cartCoupon !== null) {
                setCouponApplied(true);
              } else {
                setCouponApplied(false);
              }
              if (
                res?.data?.data?.loyaltyPoints !== null &&
                res?.data?.data?.loyaltyPoints !== undefined &&
                res?.data?.data?.loyaltyPoints !== ''
              ) {
                setLoyalityApplied(true);
              } else {
                setLoyalityApplied(false);
              }
              const prodResponse = response?.data?.data?.cartProducts;
              if (prodResponse !== null && prodResponse.length > 0) {
                setOrderedItems(response?.data?.data?.cartProducts);
                loyalityRedeem(response?.data?.data?.userId, response?.data?.data?.billing);
                getAllSpecification(
                  extractItemListProperty(response, 'gtin'),
                  prodResponse,
                  response?.data?.data?.billing,
                );
              } else if (prodResponse.length === 0) {
                setCount(0);
                setFixedCount(0);
              }
              setLoader(false);
              setValueStored('false');
            })
            .catch((err) => {
              setValueStored('false');
              setLoader(false);
              setCartLoader(false);
            });
        }
      })
      .catch((err) => {
        setLoader(false);
        setCartLoader(false);
      });
  };

  useEffect(() => {
    if (localStorage.getItem('cartId-SO')) {
      cartDetails();
    }
  }, [localStorage.getItem('cartId-SO')]);

  const extractItemListProperty = (response, property) =>
    response?.map((item) => (item?.[property] !== null && item?.[property] !== undefined ? item?.[property] : ''));

  let retryCartcount = 0;
  const cartDetails = () => {
    
    setMobileSalesProductLoder(true);
    getCartDetails(localStorage.getItem('cartId-SO'))
      .then((res) => {
        if (res?.data?.data?.code === 'ECONNRESET') {
          setCartLoader(false);
          setMobileSalesProductLoder(false);
          if (retryCartcount < 3) {
            cartDetails();
            retryCartcount++;
          } else {
            showSnackbar('Some Error Occured, Try after some time', 'error');
            localStorage.removeItem('cartId-SO');
            localStorage.removeItem('sales_OrderId');
          }
        } else {
          setView(true);
          setCartData(res?.data?.data);
          setCustomerName(res?.data?.data?.userName);
          setStoredBillingAddress(res?.data?.data?.billingAddress);
          setStoredShippingAddress(res?.data?.data?.shippingAddress);
          setCouponData(res?.data?.data?.cartCoupon);
          setLoyalityValue(res?.data?.data?.loyaltyPointsValue);
          setCartStatus(res?.data?.data?.cartStatus);
          if (res?.data?.data?.cartCoupon !== null) {
            setCouponApplied(true);
          } else {
            setCouponApplied(false);
          }
          if (
            res?.data?.data?.loyaltyPoints !== null &&
            res?.data?.data?.loyaltyPoints !== undefined &&
            res?.data?.data?.loyaltyPoints !== ''
          ) {
            setLoyalityApplied(true);
          } else {
            setLoyalityApplied(false);
          }
          customerDetails(res?.data?.data?.userId);
          loyalityRedeem(res?.data?.data?.userId, res?.data?.data?.billing);
          const response = res?.data?.data?.cartProducts;
          const orderedItems = response?.sort((a, b) => new Date(a.createdDate) - new Date(b.createdDate));
          setOrderedItems(orderedItems);
          getAllSpecification(extractItemListProperty(orderedItems, 'gtin'), orderedItems, res?.data?.data?.billing);

          getCustomerDetails(res?.data?.data?.userId)
            .then(function (response) {
              if (response?.data?.data?.retail?.addresses?.length > 0) {
                setAllCustAddress(response?.data?.data?.retail?.addresses);
              }
            })
            .catch((err) => {
              setLoader(false);
            });

          setLoader(false);
        }
      })
      .catch((err) => {
        setCartLoader(false);
        setMobileSalesProductLoder(false);
        if (err?.response?.status === '429') {
          cartDetails();
        } else {
          showSnackbar(err?.response?.data?.message || 'Some error occured', 'error');
          localStorage.removeItem('cartId-SO');
          localStorage.removeItem('sales_OrderId');
        }
      });
  };

  const loyalityRedeem = (userId, billing) => {
    const payload = {
      sourceOrgId: orgId,
      cartValue: billing?.totalCartValue,
      customerType: 'RETAIL',
      customerId: userId,
      couponApplied: couponApplied,
      platformSupportType: 'B2B',
    };
    fetchLoyality(payload)
      .then((res) => {
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
      .catch((err) => {});
  };

  const handleRemoveCoupon = () => {
    removeCoupon(localStorage.getItem('cartId-SO'))
      .then((res) => {
        cartDetails();
        showSnackbar('Coupon Removed', 'success');
      })
      .catch((err) => {
        showSnackbar(err?.response?.data?.message || 'Some error occured', 'error');
      });
  };

  const handleRemoveLoyality = () => {
    removeLoyality(localStorage.getItem('cartId-SO'))
      .then((res) => {
        cartDetails();
        showSnackbar('Loyality Removed', 'success');
      })
      .catch((err) => {
        showSnackbar(err?.response?.data?.message || 'Some error occured', 'error');
      });
  };

  const getAllSpecification = (item, cartProd, billing) => {
    const payload = {
      page: 1,
      pageSize: '100',
      gtin: item,
      names: [],
    };
    if (contextType === 'RETAIL') {
      payload.supportedStore = ['TWINLEAVES', orgId];
    } else if (contextType === 'VMS') {
      payload.marketPlaceSeller = ['TWINLEAVES', orgId];
    }
    filterVendorSKUData(payload)
      .then((response) => {
        setCartLoader(false);
        setMobileSalesProductLoder(false);
        const arrayOfObjects = response?.data?.data?.products;
        if (arrayOfObjects.length > 0) {
          const netWeightMap = new Map();
          arrayOfObjects.forEach((item) => {
            const {
              gtin,
              weights_and_measures: { net_weight, measurement_unit },
            } = item;
            netWeightMap.set(gtin, `${net_weight} ${measurement_unit}`);
          });

          const cartProdWithNetWeight = cartProd.map((product) => {
            const { gtin } = product;
            const net_weight_measurement_unit = netWeightMap.get(gtin);
            return { ...product, net_weight_measurement_unit };
          });
          const netWeightsArray = cartProdWithNetWeight.map((item) => item.net_weight_measurement_unit);
          setSpecification(netWeightsArray);
        } else {
          setSpecification('');
        }
      })
      .catch((err) => {
        setSpecification('');
        setCartLoader(false);
        setMobileSalesProductLoder(false);
      });

    if (cartProd?.length > 0) {
      setCount(cartProd?.length);
      setFixedCount(cartProd?.length);
    } else {
      setCount(0);
      setFixedCount(0);
    }
    setBillingData(billing);
    setBarcodeNum(extractItemListProperty(cartProd, 'gtin'));
    setProductName(extractItemListProperty(cartProd, 'productName'));
    setItemMrp(extractItemListProperty(cartProd, 'mrp'));
    setSellingPrice(extractItemListProperty(cartProd, 'sellingPrice'));
    setPurchasePrice(extractItemListProperty(cartProd, 'purchasePrice'));
    setBatchNum(extractItemListProperty(cartProd, 'batchNo'));
    setcartProductId(extractItemListProperty(cartProd, 'cartProductId'));
    setItemTax(extractItemListProperty(cartProd, 'igst'));
    setItemAmount(extractItemListProperty(cartProd, 'subTotalWithoutTax'));
    setItemAmountWithTax(extractItemListProperty(cartProd, 'subTotal'));
    setQuantity(extractItemListProperty(cartProd, 'quantity'));
  };
  useEffect(() => {
    if (updateCart) {
      updateCartInfo();
    }
  }, [updateCart]);

  const updateCartInfo = () => {
    const payload = {
      createdBy: userName,
      userId: retailID,
      mobileNo: mobileNumber,
      userName: customerName,
      locationId: locId,
      sourceId: retailOrgID,
      loggedInUser: uidx,
      sourceLocationId: retailLocID,
      sourceType: 'RETAIL',
      sourceApp: sourceApp,
      destinationId: orgId,
      destinationLocationId: locId,
      destinationType: contextType,
      comments: '',
      address: {
        billingAddress: {
          addressId: custBillingAddress[0]?.id,
          country: custBillingAddress[0]?.country,
          state: custBillingAddress[0]?.state,
          city: custBillingAddress[0]?.city,
          pinCode: custBillingAddress[0]?.pincode,
          phoneNo: custBillingAddress[0]?.mobileNumber,
          addressLine1: custBillingAddress[0]?.addressLine1,
          addressLine2: custBillingAddress[0]?.addressLine2,
          type: custBillingAddress[0]?.entityType,
          addressType: custBillingAddress[0]?.addressType,
          updatedBy: uidx,
          updatedOn: '',
        },
        shippingAddress: {
          addressId: custShippingAddress[0]?.id,
          country: custShippingAddress[0]?.country,
          state: custShippingAddress[0]?.state,
          city: custShippingAddress[0]?.city,
          pinCode: custShippingAddress[0]?.pincode,
          phoneNo: custShippingAddress[0]?.mobileNumber,
          addressLine1: custShippingAddress[0]?.addressLine1,
          addressLine2: custShippingAddress[0]?.addressLine2,
          type: custShippingAddress[0]?.entityType,
          addressType: custShippingAddress[0]?.addressType,
          updatedBy: uidx,
          updatedOn: '',
        },
      },
    };
    updateCartData(payload, localStorage.getItem('cartId-SO'))
      .then((res) => {
        setUpdatedCart(false);
        showSnackbar('Address Updated', 'success');
      })
      .catch((err) => {
        setUpdatedCart(false);
        showSnackbar('Unable to Update Address', 'error');
      });
  };

  const handleDelete = () => {
    setDeleteLoader(true);
    setMobileSalesProductLoder(true);
    deleteSalesOrderCartId(localStorage.getItem('cartId-SO'))
      .then((res) => {
        navigate('/sales/all-orders');
        setDeleteLoader(false);
        setMobileSalesProductLoder(false);
        localStorage.removeItem('cartId-SO');
        handleCloseModal4();
      })
      .catch((err) => {
        setDeleteLoader(false);
        setMobileSalesProductLoder(false);
        if (err?.response?.data?.message === 'Error :: Product list is empty for this cart.') {
          navigate('/sales/all-orders');
        } else if (err?.response?.data?.message === 'Error :: There is no cart found for this Id.') {
          navigate('/sales/all-orders');
        }
      });
  };

  const handleSubmit = () => {
    if (orderedItems.length > 0) {
      setSumbitLoader(true);
      const payload = {
        sessionId: orgId,
        licenseId: 'string',
        cartId: localStorage.getItem('cartId-SO'),
        paymentMode: paymentMode,
        paymentMethod: paymentMethod,
        inventoryCheck: 'NO',
        amount: billingData?.totalCartValue,
      };
      if (paymentMode !== '' && paymentMethod !== '') {
        if (cartStatus === 'SALES_ORDER_CREATED') {
          payload.orderId = localStorage.getItem('sales_OrderId');
          editSalesOrder(payload)
            .then((response) => {
              if (response?.data?.data?.es === 1) {
                showSnackbar(response?.data?.data?.message, 'error');
              } else if (response?.data?.data?.message === 'Success') {
                localStorage.removeItem('cartId-SO');
                localStorage.removeItem('sales_OrderId');
                navigate(`/order-placed/${response?.data?.data?.orderResponseModel?.orderId}`);
              }
              setSumbitLoader(false);
            })
            .catch((e) => {
              setSumbitLoader(false);
              showSnackbar('Unable to create Sales order', 'error');
            });
        } else {
          salesOrderWithPayment(payload)
            .then(function (response) {
              if (response?.data?.data?.es === 1) {
                showSnackbar(response?.data?.data?.message, 'error');
              } else if (response?.data?.data?.message === 'Success') {
                localStorage.removeItem('cartId-SO');
                navigate(`/order-placed/${response?.data?.data?.orderResponseModel?.orderId}`);
              }
              setSumbitLoader(false);
            })
            .catch((e) => {
              setSumbitLoader(false);
              showSnackbar('Unable to create Sales order', 'error');
            });
        }
      } else {
        setSumbitLoader(false);
        showSnackbar('Enter all the fields', 'warning');
      }
    } else {
      showSnackbar('Add products', 'warning');
    }
  };

  const handlePreview = () => {
    setPreviewLoader(true);
    const itemListArray = cartData?.cartProducts?.map((item) => {
      const itemList = {
        gtin: item?.gtin,
        productName: item?.productName,
        mrp: item?.mrp,
        sellingPrice: item?.sellingPrice,
        quantity: item?.sellingPrice,
        subTotal: item?.subTotal,
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
          billingAddressId: cartData?.billingAddress?.billingAddressId,
          addressId: cartData?.billingAddress?.addressId,
          country: cartData?.billingAddress?.country,
          state: cartData?.billingAddress?.state,
          city: cartData?.billingAddress?.city,
          pinCode: cartData?.billingAddress?.pinCode,
          phoneNo: cartData?.billingAddress?.phoneNo,
          longitude: cartData?.billingAddress?.longitude,
          latitude: cartData?.billingAddress?.latitude,
          addressLine1: cartData?.billingAddress?.addressLine1,
          addressLine2: cartData?.billingAddress?.addressLine2,
          type: cartData?.billingAddress?.type,
          addressType: cartData?.billingAddress?.addressType,
          updatedBy: cartData?.billingAddress?.updatedBy,
          updatedOn: cartData?.billingAddress?.updatedOn,
        },
        shippingAddress: {
          billingAddressId: cartData?.shippingAddress?.shippingAddressId,
          addressId: cartData?.shippingAddress?.addressId,
          country: cartData?.shippingAddress?.country,
          state: cartData?.shippingAddress?.state,
          city: cartData?.shippingAddress?.city,
          pinCode: cartData?.shippingAddress?.pinCode,
          phoneNo: cartData?.shippingAddress?.phoneNo,
          longitude: cartData?.shippingAddress?.longitude,
          latitude: cartData?.shippingAddress?.latitude,
          addressLine1: cartData?.shippingAddress?.addressLine1,
          addressLine2: cartData?.shippingAddress?.addressLine2,
          type: cartData?.shippingAddress?.type,
          addressType: cartData?.shippingAddress?.addressType,
          updatedBy: cartData?.shippingAddress?.updatedBy,
          updatedOn: cartData?.shippingAddress?.updatedOn,
        },
      },
      orderType: cartData?.orderType,
      numberOfItems: cartData?.cartProducts?.length,
      orderItemList: itemListArray,
      subTotal: cartData?.billing?.subtotal,
      gst: cartData?.billing?.igst,
      grandTotal: cartData?.billing?.totalCartValue,
    };
    previewSalesOrder(previewPayload)
      .then((res) => {
        setPreviewLoader(false);
        const blob = new Blob([res.data], { type: 'application/pdf' });
        const objectUrl = URL.createObjectURL(blob);
        window.open(objectUrl);
      })
      .catch((err) => {
        setPreviewLoader(false);
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

  useEffect(() => {
    const handleScroll = () => {
      const softBoxTop = softBoxRef.current.getBoundingClientRect().top;
      setIsFixed(softBoxTop <= 40);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isMobileDevice = isSmallScreen();
  return (
    <DashboardLayout>
      {!isMobileDevice && <DashboardNavbar prevLink={true} />}
      {/* {isMobileDevice && (
        <SoftBox className="navbar-main-div-mob-bg po-box-shadow nav-pos-mob">
          <MobileNavbar title={'Create Sales Order'} />
        </SoftBox>
      )} */}
      <Box className="main-box-pi-pre" mt={!isMobileDevice && 2} pb={isMobileDevice && 0.5}>
        <SoftBox
          className={`${isMobileDevice ? 'create-pi-card-mobile po-box-shadow sales-main-div' : 'create-pi-card'}`}
          p={3}
          md={3}
        >
          {isMobileDevice && (
            <>
              <SoftBox className="create-pi-header">
                <SoftBox sx={{ width: '100%', padding: '10px 20px 15px 15px' }}>
                  <MobileNavbar title={'Create Sales Order'} prevLink={true} />
                </SoftBox>
                <SoftBox
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: '10px',
                  }}
                  className={`${isMobileDevice && 'main-pi-btn-position'}`}
                >
                  {/* <SoftButton
                      // onClick={onClearHandler}
                      className={`main-close-icon ${isMobileDevice && 'preview-mob-btn clear-btn-pi'}`}
                    >
                      <DeleteForeverIcon
                        sx={{
                          height: '20px',
                          width: '20px',
                        }}
                      />
                    </SoftButton> */}
                  <SoftButton
                    variant={buttonStyles.primaryVariant}
                    className={`vendor-add-btn ${
                      isMobileDevice ? 'preview-mob-btn preview-color' : 'contained-softbutton'
                    }`}
                    onClick={handlePreview}
                  >
                    {isMobileDevice && previewLoader ? (
                      <CircularProgress size={20} sx={{ color: 'white !important' }} />
                    ) : (
                      <PreviewIcon />
                    )}
                  </SoftButton>
                </SoftBox>
              </SoftBox>
            </>
          )}
          <Accordion
            expanded={isAccordionExpanded}
            sx={{
              backgroundColor: 'transparent !important',
              background: 'transparent !important',
              border: 'none',
              boxShadow: isMobileDevice && 'none',
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              onClick={() => setIsAccordionExpanded(!isAccordionExpanded)}
              sx={{ padding: isMobileDevice ? ' 0 10px 0 16px' : '0 20px 0 20px' }}
            >
              {!isMobileDevice ? (
                <>
                  {' '}
                  <Box display="flex" width="100%" justifyContent="flex-end">
                    <Grid container spacing={3} mt={-2}>
                      <Grid item xs={12} md={12} xl={12}>
                        <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                          <SoftTypography fontSize="15px" fontWeight="bold">
                            Sales Order Details
                          </SoftTypography>
                        </SoftBox>
                      </Grid>
                    </Grid>
                  </Box>
                  <AccordionDetails></AccordionDetails>{' '}
                </>
              ) : (
                <Typography
                  fontSize="12px"
                  sx={{ color: customerName ? 'green' : '#0562FB' }}
                  className="accordion-fill-details-sales"
                >
                  Fill Sales Order Details
                  {customerName && (
                    <CheckCircleIcon sx={{ color: 'green !important', height: 15, width: 15, marginTop: '-2px' }} />
                  )}
                </Typography>
              )}
            </AccordionSummary>

            <Grid container spacing={isMobileDevice ? 1 : 3} sx={{ padding: '10px', marginTop: '-15px' }}>
              {!isMobileDevice && (
                <Grid item xs={12} md={12} xl={12}>
                  <SoftBox ml={0.5} lineHeight={0} display="flex" justifyContent="space-between" alignItems="center">
                    <SoftTypography
                      component="label"
                      variant="caption"
                      fontWeight="bold"
                      textTransform="capitalize"
                      fontSize="13px"
                    >
                      Select Customer
                    </SoftTypography>
                    <SoftButton
                      color="info"
                      disabled={localStorage.getItem('cartId-SO') ? false : true}
                      onClick={handlePreview}
                    >
                      {previewLoader ? <Spinner size={20} /> : <>Preview</>}
                    </SoftButton>
                  </SoftBox>
                </Grid>
              )}
              <Grid item xs={12} md={6} xl={4} mt={-2}>
                <SoftSelect
                  {...(customerDisplayName && {
                    value: {
                      value: '',
                      label: customerDisplayName,
                    },
                  })}
                  placeholder="Select Customer Name"
                  isDisabled={cartLoader ? true : false}
                  sx={{ marginTop: '-10px', width: isMobileDevice && '100%' }}
                  onChange={handleDetailCust}
                  options={options}
                />
              </Grid>
              {isMobileDevice && view && (
                <Divider
                  sx={{
                    margin: '1.5rem 0 0.5rem 0 !important',
                    width: '100% !important',
                  }}
                />
              )}
              {view && (
                <>
                  <Grid item xs={12} md={12} xl={12} sx={{ textAlign: isMobileDevice && 'center' }}>
                    <SoftTypography
                      component="label"
                      variant="caption"
                      fontWeight="bold"
                      textTransform="capitalize"
                      fontSize="13px"
                    >
                      {customerName}
                    </SoftTypography>
                  </Grid>
                  <Grid item xs={12} md={12} xl={12}>
                    <Grid container spacing={3} justifyContent="space-between">
                      <Grid item xs={12} md={6} xl={4}>
                        <Accordion>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <SoftTypography fontSize="12px" fontWeight="bold" mr={2}>
                              Billing Address
                            </SoftTypography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Grid item xs={12} md={6} xl={6}>
                              {customerSelected ? (
                                <SoftBox>
                                  {custBillingAddress.map((e) => {
                                    return (
                                      <>
                                        <SoftBox className="vendor-cross-box" key={e.id}>
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
                                            onClick={handleOpen1}
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
                              ) : (
                                <SoftBox>
                                  <SoftBox
                                    className="vendor-cross-box"
                                    p={2}
                                    mt="-20px"
                                    key={storedBillingAddress.addressId}
                                  >
                                    <SoftTypography className="add-pi-font-size">
                                      {storedBillingAddress.addressLine1} {storedBillingAddress.addressLine2}
                                    </SoftTypography>
                                    <SoftTypography className="add-pi-font-size">
                                      {storedBillingAddress.city} {storedBillingAddress.state}
                                    </SoftTypography>
                                    <SoftTypography className="add-pi-font-size">
                                      {storedBillingAddress.country} {storedBillingAddress.pincode}
                                    </SoftTypography>
                                    <SoftTypography className="add-pi-font-size">
                                      {storedBillingAddress.mobileNumber}
                                    </SoftTypography>
                                    <SoftTypography
                                      onClick={handleOpen1}
                                      fontSize="12px"
                                      color="info"
                                      style={{ cursor: 'pointer' }}
                                    >
                                      Change the Address
                                    </SoftTypography>
                                  </SoftBox>
                                </SoftBox>
                              )}
                              {!isMobileDevice && (
                                <Modal
                                  aria-labelledby="unstyled-modal-title"
                                  aria-describedby="unstyled-modal-description"
                                  open={open1}
                                  onClose={handleClose1}
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
                                      Select Biling Address
                                    </Typography>
                                    <SoftBox>
                                      {allCustAddress.map((e, index) => {
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
                                                  checked={selectedBillAdd === e}
                                                  onChange={() => handleSelectBillingAddress(e, index)}
                                                />
                                                <div>
                                                  <SoftTypography className="add-pi-font-size">
                                                    {e?.name}
                                                  </SoftTypography>
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
                              )}
                              {isMobileDevice && (
                                <MobileDrawerCommon
                                  anchor="bottom"
                                  drawerOpen={open1}
                                  // drawerOpen={true}
                                  drawerClose={() => handleClose1()}
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
                                      Select Biling Address
                                    </Typography>
                                    <SoftBox m={1} p={1} className="address-bg-div po-box-shadow">
                                      {allCustAddress.map((e, index) => {
                                        return (
                                          <SoftBox
                                            key={e.id}
                                            // onClick={() => handleChangeVendorAdd(e)}
                                            sx={{ cursor: 'pointer', marginTop: '10px' }}
                                          >
                                            <label key={e.id} className="add-pi-font-size">
                                              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                                <input
                                                  type="radio"
                                                  name="vendorAddress"
                                                  value={e.id}
                                                  checked={selectedBillAdd === e}
                                                  onChange={() => handleSelectBillingAddress(e, index)}
                                                  className="address-select-radio-button"
                                                />
                                                <div>
                                                  <SoftTypography className="address-name">{e?.name}</SoftTypography>
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
                                            </label>
                                          </SoftBox>
                                        );
                                      })}
                                    </SoftBox>
                                  </SoftBox>
                                </MobileDrawerCommon>
                              )}
                            </Grid>
                          </AccordionDetails>
                        </Accordion>
                      </Grid>
                      <Grid item xs={12} md={6} xl={4}>
                        <Accordion>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <SoftTypography fontSize="12px" fontWeight="bold" mr={2}>
                              Shipping Address
                            </SoftTypography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Grid item xs={12} md={6} xl={6}>
                              {customerSelected ? (
                                <SoftBox>
                                  {custShippingAddress.map((e) => {
                                    return (
                                      <>
                                        <SoftBox className="vendor-cross-box" key={e.id}>
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
                                            onClick={handleOpen2}
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
                              ) : (
                                <SoftBox>
                                  <SoftBox
                                    className="vendor-cross-box"
                                    p={2}
                                    mt="-20px"
                                    key={storedShippingAddress.addressId}
                                  >
                                    <SoftTypography className="add-pi-font-size">
                                      {storedShippingAddress.addressLine1}
                                    </SoftTypography>
                                    <SoftTypography className="add-pi-font-size">
                                      {storedShippingAddress.addressLine2}
                                    </SoftTypography>
                                    <SoftTypography className="add-pi-font-size">
                                      {storedShippingAddress.city} {storedShippingAddress.state}
                                    </SoftTypography>
                                    <SoftTypography className="add-pi-font-size">
                                      {storedShippingAddress.country} {storedShippingAddress.pincode}
                                    </SoftTypography>
                                    <SoftTypography className="add-pi-font-size">
                                      {storedShippingAddress.mobileNumber}
                                    </SoftTypography>
                                    <SoftTypography
                                      onClick={handleOpen2}
                                      fontSize="12px"
                                      color="info"
                                      style={{ cursor: 'pointer' }}
                                    >
                                      Change the Address
                                    </SoftTypography>
                                  </SoftBox>
                                </SoftBox>
                              )}
                              {!isMobileDevice && (
                                <Modal
                                  aria-labelledby="unstyled-modal-title"
                                  aria-describedby="unstyled-modal-description"
                                  open={open2}
                                  onClose={handleClose2}
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
                                      Select Shipping Address
                                    </Typography>
                                    <SoftBox>
                                      {allCustAddress.map((e, index) => {
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
                                                  checked={selectedShipAdd === e}
                                                  onChange={() => handleSelectShippingAddress(e, index)}
                                                />
                                                <div>
                                                  <SoftTypography className="add-pi-font-size">
                                                    {e?.name}
                                                  </SoftTypography>
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
                              )}
                              {isMobileDevice && (
                                <MobileDrawerCommon
                                  anchor="bottom"
                                  drawerOpen={open2}
                                  // drawerOpen={true}
                                  drawerClose={() => handleClose2()}
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
                                      Select Shipping Address
                                    </Typography>
                                    <SoftBox m={1} p={1} className="address-bg-div po-box-shadow">
                                      {custShippingAddress.map((e, index) => {
                                        return (
                                          <SoftBox
                                            key={e.id}
                                            // onClick={() => handleChangeVendorAdd(e)}
                                            sx={{ cursor: 'pointer', marginTop: '10px' }}
                                          >
                                            <label key={e.id} className="add-pi-font-size">
                                              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                                <input
                                                  type="radio"
                                                  name="vendorAddress"
                                                  value={e.id}
                                                  checked={selectedShipAdd === e}
                                                  onChange={() => handleSelectShippingAddress(e, index)}
                                                  className="address-select-radio-button"
                                                />
                                                <div>
                                                  <SoftTypography className="address-name">{e?.name}</SoftTypography>
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
                                            </label>
                                          </SoftBox>
                                        );
                                      })}
                                    </SoftBox>
                                  </SoftBox>
                                </MobileDrawerCommon>
                              )}
                            </Grid>
                          </AccordionDetails>
                        </Accordion>
                      </Grid>
                    </Grid>
                  </Grid>
                </>
              )}
              {/* <Grid item xs={12} md={12} xl={12}>
                <Grid container spacing={1} justifyContent="space-between">
                  <Grid item xs={8} md={3} xl={4}>
                    <SoftBox mb={1} lineHeight={0} display="inline-block">
                      <SoftTypography
                        component="label"
                        variant="caption"
                        fontWeight="bold"
                        textTransform="capitalize"
                        fontSize="13px"
                      >
                        Refrence Number
                        <span style={{ color: 'red', marginLeft: '5px', fontSize: '17px' }}> *</span>
                      </SoftTypography>
                    </SoftBox>
                    <SoftInput value={reference} onChange={(e) => setReference(e.target.value)} />
                  </Grid>
                  <Grid item xs={8} md={3} xl={3}>
                    <SoftBox mb={1} lineHeight={0} display="inline-block">
                      <SoftTypography
                        component="label"
                        variant="caption"
                        fontWeight="bold"
                        textTransform="capitalize"
                        fontSize="13px"
                      >
                        Shipment date
                        <span style={{ color: 'red', marginLeft: '5px', fontSize: '17px' }}> *</span>
                      </SoftTypography>
                    </SoftBox>
                    <SoftBox>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          disablePast
                          views={['year', 'month', 'day']}
                          format="DD-MM-YYYY"
                          onChange={(date) => {
                            setShipmentDate(format(date.$d, 'yyyy-MM-dd'));
                          }}
                        />
                      </LocalizationProvider>
                    </SoftBox>
                  </Grid>
                  <Grid item xs={8} md={3} xl={3}>
                    <SoftBox mb={1} lineHeight={0} display="inline-block">
                      <SoftTypography
                        component="label"
                        variant="caption"
                        fontWeight="bold"
                        textTransform="capitalize"
                        fontSize="13px"
                      >
                        Delivery Method
                      </SoftTypography>
                    </SoftBox>
                    <SoftSelect
                      defaultValue={{ value: 'pay1', label: 'Company Transport' }}
                      onChange={(e) => setDeliveryMethod(e.value)}
                      options={[
                        { value: 'pay1', label: 'Company Transport' },
                        { value: 'pay2', label: 'Own Transport' },
                        { value: 'pay3', label: 'Third Party' },
                      ]}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} md={12} xl={12}>
                <Grid container spacing={3} justifyContent="space-between">
                  <Grid item xs={12} md={3} xl={4}>
                    <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                      <SoftTypography component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                        Salesperson
                      </SoftTypography>
                    </SoftBox>
                    <SoftSelect
                      required
                      defaultValue={{ value: '', label: 'Select' }}
                      onChange={(e) => setSalesPerson(e.value)}
                      options={salesOption}
                    />
                  </Grid>
                </Grid>
              </Grid> */}
            </Grid>
          </Accordion>
        </SoftBox>

        <SoftBox
          p={isMobileDevice ? 1.9 : 3}
          className={`create-pi-card ${isMobileDevice && 'po-box-shadow'}`}
          ref={softBoxRef}
          style={{
            position: isFixed ? 'sticky' : 'static',
            top: isFixed ? 0 : 'auto',
            width: isFixed ? '100%' : '100%',
            zIndex: isFixed ? 1100 : 'auto',
          }}
        >
          <SoftBox display="flex" gap="30px" justifyContent={isMobileDevice ? 'space-between' : 'flex-start'}>
            <SoftTypography variant="h6">
              {isMobileDevice ? 'Enter Items' : 'Enter items you wish to purchase'}
              {count > 1 && ` (Total Item: ${count})`}
            </SoftTypography>
            {deleteLoader && !isMobileDevice && <Spinner size={20} />}
            {cartLoader && !isMobileDevice && <Spinner size={20} />}
          </SoftBox>
          <Grid container mt={1} sx={{ justifyContent: 'space-between', alignItems: 'center', overflowX: 'scroll' }}>
            <Grid item xs={0.7} sm={0.7} md={0.7} ml={2}>
              <SoftBox mb={1} display="flex" sx={{flexWrap: 'no-wrap'}}>
                <InputLabel sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                    S No.
                </InputLabel>
              </SoftBox>
            </Grid>

            <Grid item xs={0.7} sm={0.7} md={0.7} ml={2} sx={{display: 'flex', flexWrap: 'no-wrap'}}>
              <SoftBox mb={1}>
                <InputLabel required sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                    Barcode
                </InputLabel>
              </SoftBox>
            </Grid>

            <Grid item xs={0.7} sm={0.7} md={0.7} ml={2} sx={{display: 'flex', flexWrap: 'no-wrap', paddingLeft: '50px'}}>
              <SoftBox mb={1} >
                <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                    Product Title
                </InputLabel>
              </SoftBox>
            </Grid>

            <Grid item xs={0.7} sm={0.7} md={0.7} ml={2} sx={{display: 'flex', flexWrap: 'no-wrap', paddingLeft: '120px'}}>
              <SoftBox mb={1}>
                <InputLabel required sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                  MRP
                </InputLabel>
              </SoftBox>
            </Grid>

            <Grid item xs={0.7} sm={0.7} md={0.7} ml={2} sx={{display: 'flex', flexWrap: 'no-wrap', paddingLeft: '30px'}}>
              <SoftBox mb={1}>
                <InputLabel required sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                  Specification
                </InputLabel>
              </SoftBox>
            </Grid>

            <Grid item xs={0.7} sm={0.7} md={0.7} ml={2} sx={{display: 'flex', flexWrap: 'no-wrap', paddingLeft: '60px'}}>
              <SoftBox mb={1}>
                <InputLabel required sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                  Qty
                </InputLabel>
              </SoftBox>
            </Grid>

            <Grid item xs={0.7} sm={0.7} md={0.7} ml={2} sx={{display: 'flex', flexWrap: 'no-wrap', paddingLeft: '40px'}}>
              <SoftBox mb={1}>
                <InputLabel required sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                  S.Price
                </InputLabel>
              </SoftBox>
            </Grid>

            <Grid item xs={0.7} sm={0.7} md={0.7} ml={2} sx={{display: 'flex', flexWrap: 'no-wrap', paddingLeft: '30px'}}>
              <SoftBox mb={1}>
                <InputLabel required sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                  P.Price
                </InputLabel>
              </SoftBox>
            </Grid>

            <Grid item xs={0.7} sm={0.7} md={0.7} ml={2} sx={{display: 'flex', flexWrap: 'no-wrap', paddingLeft: '20px'}}>
              <SoftBox mb={1}>
                <InputLabel required sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                  Tax
                </InputLabel>
              </SoftBox>
            </Grid>

            <Grid item xs={0.7} sm={0.7} md={0.7} ml={2} sx={{display: 'flex', flexWrap: 'no-wrap', marginRight: '30px'}}>
              <SoftBox mb={1}>
                <InputLabel required sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                  Amount
                </InputLabel>
              </SoftBox>
            </Grid>

          </Grid>
        </SoftBox>

        <SoftBox p={isMobileDevice ? 1.9 : 3} className={`create-pi-card ${isMobileDevice && 'po-box-shadow'}`}>
          <ItemListData
            setCount={setCount}
            count={count}
            setFixedCount={setFixedCount}
            fixedCount={fixedCount}
            setBarcodeNum={setBarcodeNum}
            barcodeNum={barcodeNum}
            setProductName={setProductName}
            productName={productName}
            setQuantity={setQuantity}
            quantity={quantity}
            setSpecification={setSpecification}
            specification={specification}
            setItemMrp={setItemMrp}
            itemMrp={itemMrp}
            setSellingPrice={setSellingPrice}
            sellingPrice={sellingPrice}
            setPurchasePrice={setPurchasePrice}
            purchasePrice={purchasePrice}
            setcartProductId={setcartProductId}
            cartProductId={cartProductId}
            setItemTax={setItemTax}
            itemTax={itemTax}
            setItemAmount={setItemAmount}
            itemAmount={itemAmount}
            setItemAmountWithTax={setItemAmountWithTax}
            itemAmountWithTax={itemAmountWithTax}
            setBillingData={setBillingData}
            setOrderedItems={setOrderedItems}
            orderedItems={orderedItems}
            extractItemListProperty={extractItemListProperty}
            cartLoader={cartLoader}
            setCartData={setCartData}
            customerName={customerName}
            mobileSalesProductLoader={mobileSalesProductLoader}
            batchNum={batchNum}
            setBatchNum={setBatchNum}
            expiryDate={expiryDate}
            setExpiryDate={setExpiryDate}
            itemDiscount={itemDiscount}
            setItemDiscount={setItemDiscount}
            itemDiscountType={itemDiscountType}
            setItemDiscountType={setItemDiscountType}
            itemCess={itemCess}
            setItemCess={setItemCess}
          />
          {/* <SoftButton
            style={{ marginTop: '10px' }}
            color="info"
            disabled={cartId ? false : true}
            onClick={handleAdditional}
          >
            + Addtional Details
          </SoftButton> */}
          <SoftBox display="flex" mt={1} mb={1} alignItems="center">
            <Checkbox checkbox={openAdditonalModal} onClick={() => setOpenAdditionalModal(!openAdditonalModal)} />
            <SoftTypography component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
              + Add extra details
            </SoftTypography>
          </SoftBox>
          {openAdditonalModal && (
            <AdditionalSalesFile
              shipCheck={shipCheck}
              setShipCheck={setShipCheck}
              labourCheck={labourCheck}
              setLabourCheck={setLabourCheck}
              count={additionalCount}
              setCount={setAdditionalCount}
              unitPrice={unitPrice}
              setUnitPrice={setUnitPrice}
              description={description}
              setDesciption={setDesciption}
              additionQuant={additionQuant}
              setAdditionQuant={setAdditionQuant}
              additionTax={additionTax}
              setAdditionTax={setAdditionTax}
              additionAmount={additionAmount}
              setAdditionAmount={setAdditionAmount}
            />
          )}
        </SoftBox>
        <SoftBox p={3} className={`create-pi-card ${isMobileDevice && 'po-box-shadow'}`} mb={2}>
          <Grid container spacing={3} justifyContent="space-between">
            <Grid item xs={12} md={4} xl={4} sx={{ marginTop: '-30px' }}>
              <SoftBox className="textarea-box">
                <SoftTypography fontSize="15px" fontWeight="bold">
                  {' '}
                  Customer Notes
                </SoftTypography>
              </SoftBox>
              <SoftBox style={{ marginTop: '10px' }}>
                <TextareaAutosize
                  //   defaultValue={comment}
                  //   onChange={(e) => setComment(e.target.value)}
                  aria-label="minimum height"
                  minRows={3}
                  placeholder="Will be displayed on sales order"
                  className="add-pi-textarea mobile-text-aria-sales"
                />
              </SoftBox>
              {openLoyalityModal && (
                <SalesLoyalityModal
                  openLoyalityModal={openLoyalityModal}
                  setOpenLoyalityModal={setOpenLoyalityModal}
                  loyalityMessage={loyalityMessage}
                  loyalityData={loyalityData}
                  cartId={cartId}
                  cartDetails={cartDetails}
                />
              )}
              {openCouponModal && (
                <SalesCouponModal
                  openCouponModal={openCouponModal}
                  setOpenCouponModal={setOpenCouponModal}
                  allCouponList={allCouponList}
                  cartId={cartId}
                  couponData={couponData}
                  setCouponData={setCouponData}
                  cartDetails={cartDetails}
                />
              )}
              <SoftBox
                className={` ${
                  isMobileDevice ? 'po-box-shadow sales-mobile-loyalty-points' : 'add-po-bill-details-box'
                }`}
                style={{
                  padding: '15px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
                }}
              >
                <SoftBox>
                  <SoftBox display="flex" justifyContent="space-between" alignItems="center" p={1}>
                    <SoftTypography fontSize="15px" fontWeight="bold">
                      Credit Note
                    </SoftTypography>

                    <Button
                      color="info"
                      sx={{ backgroundColor: isMobileDevice && 'white !important' }}
                      // onClick={handleLoyality}
                    >
                      Apply
                    </Button>
                  </SoftBox>
                  <SoftBox display="flex" justifyContent="space-between" alignItems="center" p={1}>
                    <SoftTypography fontSize="15px" fontWeight="bold">
                      Loyality Points
                    </SoftTypography>
                    {loyalityApplied ? (
                      <SoftBox mt={1} width="20px" height="40px" style={{ cursor: 'pointer' }}>
                        <CancelIcon onClick={() => handleRemoveLoyality()} fontSize="small" color="error" />
                      </SoftBox>
                    ) : (
                      <Button
                        color="info"
                        sx={{ backgroundColor: isMobileDevice && 'white !important' }}
                        onClick={handleLoyality}
                      >
                        Apply
                      </Button>
                    )}
                  </SoftBox>

                  <SoftBox display="flex" justifyContent="space-between" alignItems="center" p={1}>
                    <SoftTypography fontSize="15px" fontWeight="bold">
                      Coupons
                    </SoftTypography>
                    {couponData ? (
                      <SoftBox display="flex" gap="10px" mt={1}>
                        <SoftBox width="20px" height="40px" sx={{ cursor: 'pointer' }}>
                          <EditOutlinedIcon
                            onClick={handleCoupon}
                            fontSize="small"
                            color="info"
                            sx={{ color: isMobileDevice && 'white !important' }}
                          />
                        </SoftBox>
                        <SoftBox width="20px" height="40px" style={{ cursor: 'pointer' }}>
                          <CancelIcon onClick={() => handleRemoveCoupon()} fontSize="small" color="error" />
                        </SoftBox>
                      </SoftBox>
                    ) : (
                      <Button
                        color="info"
                        sx={{ backgroundColor: isMobileDevice && 'white !important' }}
                        disabled={couponPresent ? false : true}
                        onClick={handleCoupon}
                      >
                        Apply
                      </Button>
                    )}
                  </SoftBox>
                </SoftBox>
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
                <SoftBox display="flex" justifyContent="space-between" p={isMobileDevice ? 0.5 : 3}>
                  <SoftBox style={{ width: '50%' }}>
                    {/* <SoftTypography
                      fontSize="0.78rem"
                      fontWeight="bold"
                      p="2px"
                      style={{ marginBottom: '10px', marginTop: '10px' }}
                      alignItems="center"
                    >
                      Discount
                    </SoftTypography> */}
                    <SoftTypography fontSize="0.78rem" fontWeight="bold" p="2px" className="billing-details-key">
                      Discount
                    </SoftTypography>
                    <SoftTypography fontSize="0.78rem" fontWeight="bold" p="2px" className="billing-details-key">
                      Credit Note
                    </SoftTypography>
                    <SoftTypography fontSize="0.78rem" fontWeight="bold" p="2px" className="billing-details-key">
                      Loyalty Points
                    </SoftTypography>
                    <SoftTypography fontSize="0.78rem" fontWeight="bold" p="2px" className="billing-details-key">
                      Coupons
                    </SoftTypography>
                    {+statesCode(custBillingAddress[0]?.state) === +statesCode(custShippingAddress[0]?.state) ? (
                      <>
                        <SoftTypography fontSize="0.78rem" fontWeight="bold" p="2px" className="billing-details-key">
                          CGST
                        </SoftTypography>
                        <SoftTypography fontSize="0.78rem" fontWeight="bold" p="2px" className="billing-details-key">
                          SGST
                        </SoftTypography>
                      </>
                    ) : (
                      <SoftTypography fontSize="0.78rem" fontWeight="bold" p="2px" className="billing-details-key">
                        IGST
                      </SoftTypography>
                    )}
                    <SoftTypography fontSize="0.78rem" fontWeight="bold" p="2px" className="billing-details-key">
                      Sub Total
                    </SoftTypography>
                    {openAdditonalModal && (labourCheck || shipCheck) ? null : (
                      <>
                        {isMobileDevice && <Divider sx={{ margin: '8px !important', width: '185% !important' }} />}
                        <SoftTypography fontSize="18px" fontWeight="bold" className="billing-details-key">
                          Total
                        </SoftTypography>
                      </>
                    )}
                  </SoftBox>
                  <SoftBox style={{ width: '40%' }}>
                    {/* <SoftBox className="dis-count-box-1" marginBottom="5px">
                      <SoftBox className="boom-box" style={{ border: 'none' }}>
                        <SoftInput
                          className="boom-input"
                          //   disabled={itemListArray?.length === 0}
                          //   value={discount}
                          onChange={(e) => {
                            handleDiscountChange(e);
                          }}
                          type="number"
                        />
                        <SoftBox className="boom-soft-box">
                          <SoftSelect
                            className="boom-soft-select"
                            // value={discountType}
                            defaultValue={{ value: '%', label: '%' }}
                            // onChange={(option) => handleDiscountType(option)}
                            options={[
                              { value: '%', label: '%' },
                              { value: 'Rs', label: 'Rs' },
                            ]}
                          />
                        </SoftBox>
                      </SoftBox>
                    </SoftBox> */}
                    <SoftTypography fontSize="0.78rem" fontWeight="bold" p="2px" className="sales-billing-mobile-typo">
                      {/* {billingData?.discount || 0} */}
                      {0}
                    </SoftTypography>
                    <SoftTypography fontSize="0.78rem" fontWeight="bold" p="2px" className="sales-billing-mobile-typo">
                      {0}
                    </SoftTypography>
                    <SoftTypography fontSize="0.78rem" fontWeight="bold" p="2px" className="sales-billing-mobile-typo">
                      {loyalityValue || 0}
                    </SoftTypography>
                    <SoftTypography fontSize="0.78rem" fontWeight="bold" p="2px" className="sales-billing-mobile-typo">
                      {billingData?.appliedCoupon || 0}
                    </SoftTypography>
                    {+statesCode(custBillingAddress[0]?.state) === +statesCode(custShippingAddress[0]?.state) ? (
                      <>
                        <SoftTypography
                          fontSize="0.78rem"
                          fontWeight="bold"
                          p="2px"
                          className="sales-billing-mobile-typo"
                        >
                          {billingData?.cgst || 0}
                        </SoftTypography>
                        <SoftTypography
                          fontSize="0.78rem"
                          fontWeight="bold"
                          p="2px"
                          className="sales-billing-mobile-typo"
                        >
                          {billingData?.sgst || 0}
                        </SoftTypography>
                      </>
                    ) : (
                      <SoftTypography
                        fontSize="0.78rem"
                        fontWeight="bold"
                        p="2px"
                        className="sales-billing-mobile-typo"
                      >
                        {billingData?.igst || 0}
                      </SoftTypography>
                    )}
                    <SoftTypography fontSize="0.78rem" fontWeight="bold" p="2px" className="sales-billing-mobile-typo">
                      {billingData?.subtotal || 0}
                    </SoftTypography>
                    {openAdditonalModal && (labourCheck || shipCheck) ? null : (
                      <SoftTypography
                        fontSize="18px"
                        fontWeight="bold"
                        className="sales-billing-mobile-typo"
                        sx={{ marginTop: isMobileDevice && '16px !important' }}
                      >
                        {billingData?.totalCartValue || '0.00'}
                      </SoftTypography>
                    )}
                  </SoftBox>
                </SoftBox>
              </SoftBox>
            </Grid>
            <Grid item xs={12} md={6} xl={6}></Grid>
            {openAdditonalModal && (labourCheck || shipCheck) && (
              <>
                <Grid item xs={12} md={6} xl={5} sx={{ marginTop: '-30px' }}>
                  <SoftBox className="textarea-box" style={{ marginBottom: '10px', marginLeft: '5px' }}>
                    <SoftTypography fontSize="15px" fontWeight="bold">
                      {' '}
                      Additional Details (in ₹ )
                    </SoftTypography>
                  </SoftBox>
                  <SoftBox className={`${isMobileDevice ? '' : 'add-po-bill-details-box'}`}>
                    <SoftBox display="flex" justifyContent="space-between" p={isMobileDevice ? 0.5 : 3}>
                      <SoftBox style={{ width: '50%' }}>
                        {labourCheck && (
                          <SoftTypography fontSize="0.78rem" fontWeight="bold" p="2px" className="billing-details-key">
                            Labour Charge
                          </SoftTypography>
                        )}
                        {shipCheck && (
                          <SoftTypography fontSize="0.78rem" fontWeight="bold" p="2px" className="billing-details-key">
                            Delivery Charge
                          </SoftTypography>
                        )}
                      </SoftBox>
                      <SoftBox style={{ width: '40%' }}>
                        {labourCheck && (
                          <SoftTypography
                            fontSize="0.78rem"
                            fontWeight="bold"
                            p="2px"
                            className="sales-billing-mobile-typo"
                          >
                            {0}
                          </SoftTypography>
                        )}
                        {shipCheck && (
                          <SoftTypography
                            fontSize="0.78rem"
                            fontWeight="bold"
                            p="2px"
                            className="sales-billing-mobile-typo"
                          >
                            {0}
                          </SoftTypography>
                        )}
                      </SoftBox>
                    </SoftBox>
                  </SoftBox>
                  <SoftBox display="flex" justifyContent="space-between" padding="20px">
                    <SoftTypography fontSize="18px" fontWeight="bold" className="billing-details-key">
                      Grand Total
                    </SoftTypography>
                    <SoftTypography
                      fontSize="18px"
                      fontWeight="bold"
                      className="sales-billing-mobile-typo"
                      sx={{ marginTop: isMobileDevice && '16px !important' }}
                    >
                      {billingData?.totalCartValue || '0.00'}
                    </SoftTypography>
                  </SoftBox>
                </Grid>
                <Grid item xs={12} md={6} xl={6}></Grid>
              </>
            )}
            <Grid item xs={12} md={6} xl={6}>
              <SoftBox className="add-po-btns" style={{ gap: '10px' }}>
                {cartId ? (
                  <SoftButton
                    // color="error"
                    variant={buttonStyles.outlinedColor}
                    className="outlined-softbutton"
                    onClick={() => setOpenModal4(true)}
                  >
                    Delete
                  </SoftButton>
                ) : (
                  <SoftButton
                    // className="vendor-second-btn"
                    variant={buttonStyles.outlinedColor}
                    className="outlined-softbutton"
                    onClick={() => navigate('/sales/all-orders')}
                  >
                    Cancel{' '}
                  </SoftButton>
                )}

                <SoftButton
                  // color="success"
                  variant="solidBlueBackground"
                  onClick={() => {
                    setOpenModal3(true);
                  }}
                  disabled={submitLoader ? true : false}
                >
                  Submit
                </SoftButton>
              </SoftBox>
              <Modal
                open={openModal3}
                onClose={handleCloseModal3}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box className="pi-approve-menu-1">
                  <SoftTypography id="modal-modal-title" variant="h6" component="h2">
                    Please select payment mode
                  </SoftTypography>
                  <SoftSelect
                    onChange={(e) => setPaymentMode(e.value)}
                    options={[
                      { value: 'OFFLINE', label: 'Cash on Delivery ' },
                      // { value: 'ONLINE', label: 'Online' },
                    ]}
                  />
                  <br />
                  {paymentMode !== '' && (
                    <>
                      <SoftTypography id="modal-modal-title" variant="h6" component="h2">
                        Please select payment method
                      </SoftTypography>
                      <SoftSelect
                        onChange={(e) => setPaymentMethod(e.value)}
                        options={paymentMode === 'OFFLINE' ? offlinePayment : onlinePayment}
                      />
                      <br />
                    </>
                  )}
                  <SoftBox className="pi-approve-btns-div" style={{ gap: '10px' }}>
                    <SoftButton className="vendor-second-btn" onClick={handleCloseModal3}>
                      Cancel
                    </SoftButton>
                    <SoftButton
                      className="vendor-add-btn"
                      onClick={handleSubmit}
                      disabled={submitLoader ? true : false}
                    >
                      {submitLoader ? <Spinner size={20} /> : <>Submit</>}
                    </SoftButton>
                  </SoftBox>
                </Box>
              </Modal>
              <Modal
                open={openModal4}
                onClose={handleCloseModal4}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box className="pi-approve-menu-1">
                  <SoftTypography id="modal-modal-title" variant="h6" component="h2">
                    Are you sure you want to delete the order ?
                  </SoftTypography>
                  <SoftBox className="pi-approve-btns-div" style={{ gap: '10px' }}>
                    <SoftButton className="vendor-second-btn" onClick={handleCloseModal4}>
                      Cancel
                    </SoftButton>
                    <SoftButton
                      className="vendor-add-btn"
                      onClick={handleDelete}
                      disabled={deleteLoader ? true : false}
                    >
                      {deleteLoader ? <Spinner size={20} /> : <>Delete</>}
                    </SoftButton>
                  </SoftBox>
                </Box>
              </Modal>
            </Grid>
          </Grid>
        </SoftBox>
      </Box>
    </DashboardLayout>
  );
};

export default NewSalesForm;
