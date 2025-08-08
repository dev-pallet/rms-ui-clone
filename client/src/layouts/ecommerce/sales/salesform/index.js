import './salesfrom.css';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Autocomplete, Box, Checkbox, CircularProgress, Modal, TextField, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { format } from 'date-fns';
import { useDebounce } from 'usehooks-ts';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../../../hooks/SnackbarProvider';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import CouponModal from '../all-orders/components/Coupon';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FormField from 'layouts/ecommerce/product/all-products/components/edit-product/components/FormField/index';
import Grid from '@mui/material/Grid';
import React, { useEffect, useState } from 'react';
import SoftBox from 'components/SoftBox';
import SoftButton from 'components/SoftButton';
import SoftInput from 'components/SoftInput';
import SoftSelect from 'components/SoftSelect';
import SoftTypography from 'components/SoftTypography';
import Spinner from '../../../../components/Spinner';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import getCustomerList, {
  addToSalesCartwithSellingPrice,
  createOrderwithPayment,
  editCartQuantity,
  flushCartProd,
  getAllOrgUsers,
  getCartDetails,
  getCustomerDetails,
  getItemsInfo,
  getLatestInwarded,
  newSalesOrderCart,
  removeCartProduct,
  updateCartData,
  viewSalesPreviewpdf,
} from '../../../../config/Services';

const Salesform = () => {
  const [selectedFiles, setSelectedFiles] = useState();
  const showSnackbar = useSnackbar();

  const [paymentMethod, setPaymentMethod] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [retailID, setRetailID] = useState('');
  const [reference, setReference] = useState('');
  const [salesOrderDate, setSalesOrderDate] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('');
  const [salesPerson, setSalesPerson] = useState('');
  const [shipmentDate, setShipmentDate] = useState('');
  const [retailOrgID, setRetailOrgID] = useState('');
  const [retailLocID, setRetailLocID] = useState('');
  const [valueStored, setValueStored] = useState(false);
  const [customerSelected, setCustomerSelected] = useState(false);
  const [quantChange, setQuantChange] = useState(false);
  const [gtinQuant, setGtinQuant] = useState('');
  const [quantityChange, setQuantityChange] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const debouncedValue = useDebounce(quantityChange, 500);

  const [noteTxt, setNoteTxt] = useState('');
  const [prodName, setProdName] = useState('');
  const [editQuantityChange, setEditQuantityChange] = useState('');
  const [loader, setLoader] = useState(false);
  const [editProd, setEditProd] = useState(false);
  const [cartLoader, setCartLoader] = useState(false);
  const [saveLoader, setSaveLoader] = useState(false);
  const [curItemIndex, setcurItemIndex] = useState(0);
  const [inputlist, setInputlist] = useState([
    {
      prodOptions: [],
      gtin: '',
      rate: '',
      igst: '',
      cgst: '',
      sgst: '',
      name: '',
      discount: '',
      quantity: '1',
      specification: '',
      itemLabel: 'Item name',
      quantityLabel: 'Quantity',
      rateLabel: 'Selling Price',
      discountLabel: 'Discount',
      specificationLabel: 'Specification',
      taxLabel: 'Tax',
      amountLabel: 'Amount',
    },
  ]);

  const currentDate = new Date().toISOString().split('T')[0];

  const navigate = useNavigate();
  const [updateCart, setUpdatedCart] = useState(false);

  const [discount, setDiscount] = useState('');
  const [productIds, setProductIds] = useState([]);
  const [view, setView] = useState(false);
  const [custBillingAddress, setCustBillingAddress] = useState([]);
  const [allCustAddress, setAllCustAddress] = useState([]);
  const [custShippingAddress, setCustShippingAddress] = useState([]);
  const [storedBillingAddress, setStoredBillingAddress] = useState({});
  const [storedShippingAddress, setStoredShippingAddress] = useState({});

  const [gtinNo, setGTIN] = useState('');
  const [alldata, setAllData] = useState({});
  const [billingData, setBillingData] = useState({});
  const [options, setOptions] = useState([]);
  const [orderedItems, setOrderedItems] = useState([]);
  const [inclusiveTax, setInclusiveTax] = useState(false);
  const [autoCompleteDetailsRowIndex, setAutoCompleteDetailsRowIndex] = useState([]);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handlePopper = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopper = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const popperId = open ? 'simple-popover' : undefined;

  const handleUploadFile = (event) => {
    setSelectedFiles(event.target.files[0]);
  };

  useEffect(() => {}, [inputlist]);

  const handleClick = () => {
    setInputlist([
      ...inputlist,
      {
        prodOptions: [],
        itemCode: '',
        rate: '',
        tax: '',
        amt: '',
        name: '',
        quantity: '',
        specification: '',
        itemLabel: 'Item name',
        quantityLabel: 'Quantity',
        rateLabel: 'Selling Price',
        discountLabel: 'Discount',
        specificationLabel: 'Specification',
        taxLabel: 'Tax',
        amountLabel: 'Amount',
      },
    ]);
    setcurItemIndex(curItemIndex + 1);
    if (editProd) {
      handleRemove(curItemIndex - 1);
      handleRemove(curItemIndex - 1);
      setInputlist([]);
      setInputlist([
        {
          prodOptions: [],
          itemCode: '',
          rate: '',
          tax: '',
          amt: '',
          name: '',
          quantity: '',
          specification: '',
          itemLabel: 'Item name',
          quantityLabel: 'Quantity',
          rateLabel: 'Selling Price',
          discountLabel: 'Discount',
          specificationLabel: 'Specification',
          taxLabel: 'Tax',
          amountLabel: 'Amount',
        },
      ]);
      setcurItemIndex(curItemIndex + 1);
      setEditProd(false);
    }
  };

  const handleRemove = (item, index) => {
    const newList = [...inputlist.filter((e, i) => i !== index)];
    setInputlist(newList);
    const newSelectAuto = [];
    for (let i = 0; i < newList.length; i++) {
      if (newList[i].name.length) {
        newSelectAuto.push(i);
      }
    }
    setAutoCompleteDetailsRowIndex(newSelectAuto);
    const list1 = [...productIds];
    list1.splice(index, 1);
    setProductIds(list1);
    setcurItemIndex(curItemIndex - 1);
    setEditProd(false);
    if (inputlist.length == []) {
      handleClick();
    }
  };

  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const contextType = localStorage.getItem('contextType');
  const sourceApp = localStorage.getItem('sourceApp');
  const cartId = localStorage.getItem('cartId-SO');
  const userName = localStorage.getItem('user_name');
  const user_details = JSON.parse(localStorage.getItem('user_details'));
  const uidx = user_details.uidx;
  const mobileNumber = user_details.mobileNumber;

  useEffect(() => {
    customerList();
    handleSalesPerson();
  }, []);

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
            assuser = response.data.data.retails;
            assRow.push(
              assuser?.map((row) => ({
                value: row.retailId,
                label: row.displayName,
              })),
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
      setView(false);
    } else {
      setCustomerName(e.label);
      setView(true);
    }
    const retailId = e.value;
    setRetailID(retailId);
    const custName = e.label;
    customerDetails(retailId);
  };

  const customerDetails = (retailId) => {
    getCustomerDetails(retailId)
      .then(function (response) {
        setRetailLocID(response.data.data.retail.retailId);
        setCustomerName(response.data.data.retail?.customerName);
        setRetailOrgID(response.data.data.retail.warehouseIds[0]);
        for (let i = 0; i < response.data.data.retail.addresses.length; i++) {
          if (response.data.data.retail.addresses[i].defaultBilling === true) {
            setCustBillingAddress([response.data.data.retail.addresses[i]]);
          }
          if (response.data.data.retail.addresses[i].defaultShipping === true) {
            setCustShippingAddress([response.data.data.retail.addresses[i]]);
          }
        }
        if (response.data.data.retail.addresses.length > 0) {
          setAllCustAddress(response.data.data.retail.addresses);
        }
        setLoader(false);
        setCustomerSelected(true);
        setValueStored(true);
      })
      .catch((err) => {
        setLoader(false);
      });
  };

  const [open1, setOpen1] = React.useState(false);
  const handleOpen1 = () => setOpen1(true);
  const handleClose1 = () => setOpen1(false);

  const [open2, setOpen2] = React.useState(false);
  const handleOpen2 = () => setOpen2(true);
  const handleClose2 = () => setOpen2(false);

  const handleSelectBillingAddress = (e, index) => {
    handleClose1();
    setUpdatedCart(true);
    setCustBillingAddress([allCustAddress[index]]);
  };
  const handleSelectShippingAddress = (e, index) => {
    handleClose2();
    setUpdatedCart(true);
    setCustShippingAddress([allCustAddress[index]]);
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
          phoneNo: '',
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
          phoneNo: '',
          addressLine1: custShippingAddress[0]?.addressLine1,
          addressLine2: custShippingAddress[0]?.addressLine2,
          type: custShippingAddress[0]?.entityType,
          addressType: custShippingAddress[0]?.addressType,
          updatedBy: uidx,
          updatedOn: '',
        },
      },
    };
    updateCartData(payload, cartId)
      .then((res) => {
        setUpdatedCart(false);
        showSnackbar('Address Updated', 'success');
      })
      .catch((err) => {
        setUpdatedCart(false);
        showSnackbar('Unable to Update Address', 'error');
      });
  };
  useEffect(() => {
    if (valueStored) {
      newSalesCart();
    } else if (cartId) {
      cartDetails();
    }
  }, [view, valueStored]);

  let retryCartcount = 0;
  const cartDetails = () => {
    getCartDetails(cartId)
      .then((res) => {
        if (res?.data?.data?.code === 'ECONNRESET') {
          if (retryCartcount < 3) {
            cartDetails();
            retryCartcount++;
          } else {
            showSnackbar('Some Error Occured, Try after some time', 'error');
            setLoader(false);
          }
        } else {
          setView(true);
          setCustomerName(res?.data?.data?.userName);
          setBillingData(res?.data?.data?.billing);
          setStoredBillingAddress(res?.data?.data?.billingAddress);
          setStoredShippingAddress(res?.data?.data?.shippingAddress);
          setOrderedItems(res?.data?.data?.cartProducts);
          setLoader(false);
        }
      })
      .catch((error) => {
        setLoader(false);
        if (err?.response?.status === '429') {
          cartDetails();
        } else {
          showSnackbar('Error in Cart Details', 'error');
          setTimeout(() => {
            setLoader(false);
          }, 100);
        }
      });
  };

  const newSalesCart = () => {
    setLoader(true);
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
      orderType: 'SALES_ORDER',
      comments: '',
      address: {
        billingAddress: {
          addressId: custBillingAddress[0]?.id,
          country: custBillingAddress[0]?.country,
          state: custBillingAddress[0]?.state,
          city: custBillingAddress[0]?.city,
          pinCode: custBillingAddress[0]?.pincode,
          phoneNo: 'string',
          addressLine1: custBillingAddress[0]?.addressLine1,
          addressLine2: custBillingAddress[0]?.addressLine2,
          type: custBillingAddress[0]?.entityType,
          addressType: custBillingAddress[0]?.addressType,
          updatedBy: 'string',
          updatedOn: '',
        },
        shippingAddress: {
          addressId: custShippingAddress[0]?.id,
          country: custShippingAddress[0]?.country,
          state: custShippingAddress[0]?.state,
          city: custShippingAddress[0]?.city,
          pinCode: custShippingAddress[0]?.pincode,
          phoneNo: 'string',
          addressLine1: custShippingAddress[0]?.addressLine1,
          addressLine2: custShippingAddress[0]?.addressLine2,
          type: custShippingAddress[0]?.entityType,
          addressType: custShippingAddress[0]?.addressType,
          updatedBy: 'string',
          updatedOn: '',
        },
      },
    };

    newSalesOrderCart(payload)
      .then(function (response) {
        localStorage.setItem('cartId-SO', response.data.data.cartId);
        setCustomerName(response.data.data.userName);
        setAllData(response.data.data);
        setBillingData(response.data.data.billing);
        if (response.data.data.cartProducts !== null) {
          setOrderedItems(response.data.data.cartProducts);
        }
        setLoader(false);
        setValueStored(false);
      })
      .catch((err) => {
        setValueStored(false);
        setLoader(false);
      });
  };

  const [salesOption, setSalesOption] = useState([]);

  let assPerson,
    assRowPerson = [];

  const selectProduct = (item, index) => {
    setCartLoader(true);
    const payload = {
      locationId: locId,
      gtins: [item.gtin],
    };
    getLatestInwarded(payload)
      .then((res) => {
        if (res.data.data.es === 0) {
          const sellingPrice = res.data.data.data[0].sellingPrice;
          const updatedInputList = [...inputlist];

          updatedInputList[index].rate = sellingPrice;
          updatedInputList[index].gtin = item.gtin;
          updatedInputList[index].igst = item.igst;
          updatedInputList[index].cgst = item.cgst;
          updatedInputList[index].sgst = item.sgst;
          updatedInputList[index].name = item.name;
          updatedInputList[index].specification =
            item.weights_and_measures.net_weight +
            ' ' +
            (item.weights_and_measures.measurement_unit === 'Kilograms'
              ? 'Kg'
              : item.weights_and_measures.measurement_unit);
          updatedInputList[index].prodOptions = [];

          setInputlist(updatedInputList);

          if (item.gtin !== '') {
            const updatedProductIds = [...productIds];
            updatedProductIds.push(item.gtin);
            setProductIds(updatedProductIds);
            setGTIN(updatedProductIds[index]);

            addToSalesCartwithSellingPrice(cartId, item.gtin, locId, sellingPrice)
              .then(function (response) {
                setBillingData(response.data.data.billing);
                setOrderedItems(response.data.data.cartProducts);
                showSnackbar('Product added', 'success');
              })
              .catch((error) => {
                showSnackbar('Product unavailable', 'error');
              });
            setCartLoader(false);
          } else {
            setCartLoader(false);
          }

          setAutoCompleteDetailsRowIndex((prev) => [...prev, index]);
        } else if (res.data.data.es === 1) {
          showSnackbar(res.data.data.message, 'error');
          setCartLoader(false);
        } else {
          setCartLoader(false);
        }
      })
      .catch((err) => {
        if (err.response.data.message) {
          showSnackbar(err.response.data.message, 'error');
        } else {
          showSnackbar('Some error occured', 'error');
        }
        setCartLoader(false);
      });
  };

  useEffect(() => {}, [gtinNo, alldata]);

  useEffect(() => {}, [orderedItems]);

  const handleQuantityChange = (e, index) => {
    setQuantChange(true);
    setQuantityChange(e.target.value);
    const updatedInputList = [...inputlist];
    updatedInputList[index].quantity = e.target.value;
    setInputlist(updatedInputList);
  };

  useEffect(() => {
    if (quantChange) {
      cartQuantityChange();
    }
  }, [debouncedValue]);

  const cartQuantityChange = () => {
    setCartLoader(true);
    const payload = {
      gtin: gtinQuant,
      qty: debouncedValue,
      sellingPrice: sellingPrice,
    };
    editCartQuantity(payload, cartId, locId)
      .then((res) => {
        setCartLoader(false);
        setAllData(res?.data?.data);
        setBillingData(res?.data?.data?.billing);
        setOrderedItems(res?.data?.data?.cartProducts);
        showSnackbar('Quantity Changed', 'success');
        if (editProd) {
          handleClick();
        }
        // setLoader(false);
      })
      .catch((error) => {
        if (error.response.data.message === 'Error : Quantity should be greater than O.') {
          showSnackbar('Quantity should be greater than O', 'warning');
        }
        setCartLoader(false);
      });
  };

  const handleChangeIO = (e, index) => {
    if (customerName === '') {
      showSnackbar('Select a Customer', 'warning');
    } else {
      const searchText = e.target.value;
      const isNumber = !isNaN(+searchText);
      const payload = {
        page: 1,
        pageSize: '100',
        supportedStore: [locId],
      };
      // if (contextType === 'RETAIL') {
      //   payload.supportedStore = ['TWINLEAVES', orgId];
      // } else if (contextType === 'WMS') {
      //   payload.supportedWarehouse = ['TWINLEAVES', orgId];
      // } else if (contextType === 'VMS') {
      //   payload.marketPlaceSeller = ['TWINLEAVES', orgId];
      // }
      if (isNumber) {
        payload.gtin = [searchText];
      } else {
        payload.names = [searchText];
      }

      if (searchText.length >= 3) {
        setLoader(true);
        getItemsInfo(payload)
          .then(function (response) {
            setLoader(false);
            const updatedInputList = [...inputlist];
            updatedInputList[index].prodOptions = response.data.data.products;
            setInputlist(updatedInputList);
          })
          .catch((err) => {});
      } else if (searchText === '0') {
        const updatedInputList = [...inputlist];
        updatedInputList[index].prodOptions = [];
        setInputlist(updatedInputList);
      }
    }
  };

  const salePersons = salesPerson.toString();
  const previewItems = orderedItems.map((item) => ({
    itemNo: item.gtin,
    productName: item.productName,
    mrp: item.sellingPrice,
    productId: item.cartProductId,
    igst: item.igst,
  }));

  const handlePreview = () => {
    setLoader(true);
    // var allPayload = JSON.parse(localStorage.getItem('allPayload') || "[]");
    const payload = {
      // ...alldata,
      // billId: alldata.billing.cartBillingId,
      userId: uidx,
      subTotal: billingData.subtotal,
      // sourceId: alldata.sourceId,
      // createdDate: alldata.createdDate,
      // createdBy: alldata.createdBy,
      // updatedDate: alldata.updatedBy,
      // updatedBy: alldata.updatedDate,
      // totalDiscount: discountPrice,
      // orderStatus: alldata.cartStatus,
      // loyaltyPoints: alldata.billing.loyaltyPoints,
      customerName: customerName,
      referenceId: reference,
      // salesOrderDate: salesOrderDate,
      // ShipmentDate: shipmentDate,
      paymentTerms: paymentTerms,
      deliveryMethod: deliveryMethod,
      salesPerson: salePersons,
      igst: billingData.igst,
      cgst: billingData.cgst,
      sgst: billingData.sgst,
      grandTotal: billingData?.totalCartValue,
      // itemNo: gtinNo,
      // sourceType: alldata.sourceType,
      // sourceApp: alldata.sourceApp,
      // orderItemList: alldata.cartProducts,
      orderItemPreviews: previewItems,
    };

    viewSalesPreviewpdf(payload)
      .then((res) => {
        const blob = new Blob([res.data], { type: 'application/pdf' });
        const objectUrl = URL.createObjectURL(blob);
        window.open(objectUrl);
        setLoader(false);
      })
      .catch((e) => {
        setLoader(false);
      });
  };

  const handleCancel = () => {
    setSaveLoader(true);
    flushCartProd(cartId)
      .then((res) => {
        navigate('/sales/all-orders');
        setSaveLoader(false);
      })
      .catch((err) => {
        setSaveLoader(false);
        if (err.response.data.message === 'Error :: Product list is empty for this cart.') {
          navigate('/sales/all-orders');
        } else if (err.response.data.message === 'Error :: There is no cart found for this Id.') {
          navigate('/sales/all-orders');
        }
      });
  };

  const handleSubmit = () => {
    setSaveLoader(true);
    if (orderedItems.length > 0) {
      if (paymentMethod !== '') {
        createOrderwithPayment(cartId, paymentMethod)
          .then(function (response) {
            if (response?.data?.data?.es === 1) {
              showSnackbar(response?.data?.data?.message, 'error');
            } else if (response.data.data.message === 'Success') {
              localStorage.removeItem('cartId-SO');
              navigate(`/order-placed/${response.data.data.orderResponseModel.orderId}`);
            }
            setSaveLoader(false);
          })
          .catch((e) => {
            setSaveLoader(false);
            showSnackbar('Unable to create Sales order', 'error');
          });
      } else {
        setSaveLoader(false);
        showSnackbar('Select Payment Method', 'warning');
      }
    } else {
      showSnackbar('Add products', 'warning');
    }
  };

  const handleDelete = (gtin) => {
    setCartLoader(true);
    removeCartProduct(cartId, gtin)
      .then((res) => {
        setCartLoader(false);
        // setEditProd(true);
        setAllData(res.data.data);
        if (res.data.data.cartProducts !== null) {
          setOrderedItems(res.data.data.cartProducts);
        }
        showSnackbar('Deleted ', 'success');
      })
      .catch((err) => {
        setCartLoader(false);
        if (err.response.data.message) {
          showSnackbar(err.response.data.message, 'error');
        } else {
          showSnackbar('Unable to Delete', 'error');
        }
      });
  };

  const orderImage =
    'https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80';

  return (
    <DashboardLayout>
      <DashboardNavbar prevLink={true} />

      <SoftBox className="sales-details-box">
        {loader && <Spinner />}
        <Box display="flex" width="100%" justifyContent="flex-end">
          <Box></Box>
          <SoftButton onClick={handlePreview} className="vendor-add-btn">
            Preview
          </SoftButton>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} xl={12}>
            <Grid item xs={12} sm={8}>
              <SoftBox ml={0.5} lineHeight={0} display="inline-block">
                <SoftTypography component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                  Customer Name
                </SoftTypography>
              </SoftBox>
              <Modal
                open={open1}
                onClose={handleClose1}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
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
                  <SoftTypography fontSize="16px" fontWeight="bold">
                    Select Biling Address
                  </SoftTypography>
                  {allCustAddress.map((e, index) => {
                    return (
                      <>
                        <Accordion>
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                          >
                            <SoftTypography sx={{ fontSize: '16px', fontWeight: 'bold' }}> {e?.name}</SoftTypography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <SoftTypography sx={{ fontSize: '16px' }}>
                              {e?.addressLine1} {e?.addressLine2} {e.city} {e.state} {e.country} {e.pincode}
                            </SoftTypography>
                            <Typography
                              color="#27c5ea"
                              sx={{ textAlign: 'right', fontSize: '14px', cursor: 'pointer' }}
                              onClick={(e) => handleSelectBillingAddress(e, index)}
                            >
                              Select
                            </Typography>
                          </AccordionDetails>
                        </Accordion>
                      </>
                    );
                  })}
                </Box>
              </Modal>
              <Modal
                open={open2}
                onClose={handleClose2}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
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
                  <SoftTypography fontSize="16px" fontWeight="bold">
                    Select Biling Address
                  </SoftTypography>
                  {allCustAddress.map((e, index) => {
                    return (
                      <>
                        <Accordion>
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                          >
                            <SoftTypography sx={{ fontSize: '16px', fontWeight: 'bold' }}>{e?.name}</SoftTypography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <SoftTypography sx={{ fontSize: '16px' }}>
                              {e?.addressLine1} {e?.addressLine2} {e.city} {e.state} {e.country} {e.pincode}
                            </SoftTypography>
                            <Typography
                              color="#27c5ea"
                              sx={{ textAlign: 'right', fontSize: '14px', cursor: 'pointer' }}
                              onClick={(e) => handleSelectShippingAddress(e, index)}
                            >
                              Select
                            </Typography>
                          </AccordionDetails>
                        </Accordion>
                      </>
                    );
                  })}
                </Box>
              </Modal>
              <SoftSelect
                style={{ maxHeight: '50px' }}
                required
                defaultValue={{ value: '', label: 'Select Customer Name' }}
                onChange={handleDetailCust}
                options={options}
              />
              {view ? (
                <Grid item xs={12} md={12} xl={12} ml="-15px">
                  <SoftTypography
                    component="label"
                    variant="caption"
                    fontWeight="bold"
                    textTransform="capitalize"
                    fontSize="14px"
                    ml="20px"
                  >
                    {customerName}
                  </SoftTypography>
                  <Grid itms xs display="flex" flexDirection="row" justifyContent="space-between" gap="20px">
                    {customerSelected ? (
                      <SoftBox className="flex-box-address" width="40% !important">
                        <Grid item xs>
                          <SoftBox
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            className="vendor-top-text"
                            p={2}
                          >
                            <SoftTypography fontSize="14px" fontWeight="bold" mr={2}>
                              Billing Address
                            </SoftTypography>
                            <SoftTypography fontSize="12px" mr={2} color="info" onClick={handleOpen1}>
                              Change
                            </SoftTypography>
                          </SoftBox>
                          {custBillingAddress.map((e) => {
                            return (
                              <>
                                <SoftBox className="vendor-cross-box" p={2} mt="-20px" key={e.id}>
                                  <SoftTypography
                                    className="add-pi-font-size"
                                    sx={{ fontWeight: 'bold', fontSize: '14px' }}
                                  >
                                    {e.name}
                                  </SoftTypography>
                                  <SoftTypography className="add-pi-font-size">
                                    {e.addressLine1} {e.addressLine2}
                                  </SoftTypography>
                                  <SoftTypography className="add-pi-font-size">
                                    {e.city} {e.state}{' '}
                                  </SoftTypography>
                                  <SoftTypography className="add-pi-font-size">
                                    {e.country} {e.pincode}
                                  </SoftTypography>
                                  <SoftTypography className="add-pi-font-size">{e.phoneNo}</SoftTypography>
                                </SoftBox>
                              </>
                            );
                          })}
                        </Grid>
                      </SoftBox>
                    ) : (
                      <SoftBox className="flex-box-address" width="40% !important">
                        <Grid item xs>
                          <SoftBox
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            className="vendor-top-text"
                            p={2}
                          >
                            <SoftTypography fontSize="14px" fontWeight="bold" mr={2}>
                              Billing Address
                            </SoftTypography>
                          </SoftBox>
                          <SoftBox className="vendor-cross-box" p={2} mt="-20px" key={storedBillingAddress.addressId}>
                            <SoftTypography className="add-pi-font-size">
                              {storedBillingAddress.addressLine1} {storedBillingAddress.addressLine2}
                            </SoftTypography>
                            <SoftTypography className="add-pi-font-size">
                              {storedBillingAddress.city} {storedBillingAddress.state}
                            </SoftTypography>
                            <SoftTypography className="add-pi-font-size">
                              {storedBillingAddress.country} {storedBillingAddress.pincode}
                            </SoftTypography>
                            <SoftTypography className="add-pi-font-size">{storedBillingAddress.phoneNo}</SoftTypography>
                          </SoftBox>
                        </Grid>
                      </SoftBox>
                    )}
                    {customerSelected ? (
                      <SoftBox className="flex-box-address" width="40% !important">
                        <Grid item xs>
                          <SoftBox
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            className="vendor-top-text"
                            p={2}
                          >
                            <SoftTypography fontSize="14px" fontWeight="bold" mr={2}>
                              {' '}
                              Shipping Address
                            </SoftTypography>
                            <SoftTypography fontSize="11px" color="info" onClick={handleOpen2}>
                              {' '}
                              Change{' '}
                            </SoftTypography>
                          </SoftBox>
                          {custShippingAddress.map((e) => {
                            return (
                              <>
                                <SoftBox className="vendor-cross-box" p={2} mt="-20px" key={e.id}>
                                  <SoftTypography
                                    className="add-pi-font-size"
                                    sx={{ fontWeight: 'bold', fontSize: '14px' }}
                                  >
                                    {e.name}
                                  </SoftTypography>
                                  <SoftTypography className="add-pi-font-size">
                                    {e.addressLine1} {e.addressLine2}
                                  </SoftTypography>
                                  <SoftTypography className="add-pi-font-size">
                                    {e.city} {e.state}{' '}
                                  </SoftTypography>
                                  <SoftTypography className="add-pi-font-size">
                                    {e.country} {e.pincode}
                                  </SoftTypography>
                                  <SoftTypography className="add-pi-font-size">{e.phoneNo}</SoftTypography>
                                </SoftBox>
                              </>
                            );
                          })}
                        </Grid>
                      </SoftBox>
                    ) : (
                      <SoftBox className="flex-box-address" width="40% !important">
                        <Grid item xs>
                          <SoftBox
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            className="vendor-top-text"
                            p={2}
                          >
                            <SoftTypography fontSize="14px" fontWeight="bold" mr={2}>
                              Shipping Address
                            </SoftTypography>
                          </SoftBox>
                          <SoftBox className="vendor-cross-box" p={2} mt="-20px" key={storedShippingAddress.addressId}>
                            <SoftTypography className="add-pi-font-size">
                              {storedShippingAddress.addressLine1} {storedShippingAddress.addressLine2}
                            </SoftTypography>
                            <SoftTypography className="add-pi-font-size">
                              {storedShippingAddress.city} {storedShippingAddress.state}
                            </SoftTypography>
                            <SoftTypography className="add-pi-font-size">
                              {storedShippingAddress.country} {storedShippingAddress.pincode}
                            </SoftTypography>
                            <SoftTypography className="add-pi-font-size">
                              {storedShippingAddress.phoneNo}
                            </SoftTypography>
                          </SoftBox>
                        </Grid>
                      </SoftBox>
                    )}
                  </Grid>
                </Grid>
              ) : null}
            </Grid>
          </Grid>

          <Grid item xs={12} md={3} xl={3}>
            <FormField type="text" label="Reference" defaultValue="" onChange={(e) => setReference(e.target.value)} />
          </Grid>
        </Grid>
        <Grid container spacing={3} mt={1}>
          <Grid item xs={12} md={4} xl={4}>
            <SoftTypography fontSize="13px" fontWeight="bold">
              Sales Order Date
            </SoftTypography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                disablePast
                views={['year', 'month', 'day']}
                format="DD-MM-YYYY"
                onChange={(date) => {
                  setSalesOrderDate(format(date.$d, 'yyyy-MM-dd'));
                }}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} md={4} xl={4}>
            <SoftTypography fontSize="13px" fontWeight="bold">
              Shipment date
            </SoftTypography>
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
          </Grid>
        </Grid>
        <Grid container spacing={3} my={1}>
          <Grid item xs={12} md={4} xl={4}>
            <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
              <SoftTypography component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                Payment terms
              </SoftTypography>
            </SoftBox>
            <SoftSelect
              defaultValue={{ value: 'pay', label: 'Net 60' }}
              onChange={(e) => setPaymentTerms(e.value)}
              options={[
                { value: 'pay1', label: 'Net 30' },
                { value: 'pay2', label: 'Due end of the month' },
                { value: 'pay3', label: 'Net 45' },
                { value: 'pay4', label: 'Net 15' },
                { value: 'pay5', label: 'Net 60' },
              ]}
            />
          </Grid>
          <Grid item xs={12} md={4} xl={4}>
            <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
              <SoftTypography component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                Delivery Method
              </SoftTypography>
            </SoftBox>
            <SoftSelect
              defaultValue={{ value: '', label: 'Select' }}
              onChange={(e) => setDeliveryMethod(e.value)}
              options={[
                { value: 'pay1', label: 'Company Transport' },
                { value: 'pay2', label: 'Own Transport' },
                { value: 'pay3', label: 'Third Party' },
              ]}
            />
          </Grid>
          <Grid item xs={12} md={4} xl={4}>
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
      </SoftBox>

      {cartLoader && <Spinner />}
      <SoftBox className="sales-details-scroll-table-box">
        <SoftBox className="infinite-input-box-s" p="10px" border="none !important">
          {/* <Grid  sx={{ flexGrow: 1 }} mb="10px" container>
            
            <Grid item xs={4} lg={4} xl={4}  >
              
              <SoftBox fontSize="16px" fontWeight="bold" style={{minWidth:"400px"}}>
                Item details
              </SoftBox>
            </Grid>
            
            <Grid item xs>
              <SoftBox fontSize="16px" fontWeight="bold" style={{marginLeft:"-40px"}}>
                Quantity
              </SoftBox>
            </Grid>
            <Grid item xs>
              <SoftBox fontSize="16px" fontWeight="bold" style={{marginLeft:"-50px"}}>
                Rate
              </SoftBox>
            </Grid>
            <Grid item xs>
              <SoftBox fontSize="16px" fontWeight="bold" style={{marginLeft:"-60px"}}>
                Discount
              </SoftBox>
            </Grid>
            <Grid item xs>
              <SoftBox fontSize="16px" fontWeight="bold" style={{marginLeft:"-40px",marginRight:"20px"}}>
              Specification
              </SoftBox>
            </Grid>
            <Grid item xs>
              <SoftBox fontSize="16px" fontWeight="bold" style={{marginLeft:"25px"}}>
                Tax
              </SoftBox>
            </Grid>
            <Grid item xs>
              <SoftBox fontSize="16px" fontWeight="bold" style={{marginLeft:"-10px"}}>
                Amount
              </SoftBox>
            </Grid>
          </Grid> */}

          {inputlist.length ? null : (
            <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '0.2rem' }}>
              <div style={{ marginRight: '10px', marginBottom: '0.2rem', width: '30%' }}>
                <SoftTypography
                  component="label"
                  variant="caption"
                  fontWeight="bold"
                  textTransform="capitalize"
                  fontSize="13px"
                >
                  Item name
                  <br />
                </SoftTypography>
              </div>
              <div style={{ marginLeft: '10px', marginBottom: '0.2rem', width: '20%' }}>
                <SoftTypography
                  component="label"
                  variant="caption"
                  fontWeight="bold"
                  textTransform="capitalize"
                  fontSize="13px"
                >
                  Quantity
                </SoftTypography>
              </div>
              <div style={{ marginLeft: '10px', marginBottom: '0.2rem', width: '20%', textAlign: 'center' }}>
                <SoftTypography
                  component="label"
                  variant="caption"
                  fontWeight="bold"
                  textTransform="capitalize"
                  fontSize="13px"
                >
                  Selling Price
                </SoftTypography>
              </div>
              <div style={{ marginLeft: '10px', marginBottom: '0.2rem', width: '20%', textAlign: 'center' }}>
                <SoftTypography
                  component="label"
                  variant="caption"
                  fontWeight="bold"
                  textTransform="capitalize"
                  fontSize="13px"
                >
                  Discount
                </SoftTypography>
              </div>
              <div style={{ marginLeft: '10px', marginBottom: '0.2rem', width: '20%', textAlign: 'center' }}>
                <SoftTypography
                  component="label"
                  variant="caption"
                  fontWeight="bold"
                  textTransform="capitalize"
                  fontSize="13px"
                >
                  Specification
                </SoftTypography>
              </div>
              <div style={{ marginLeft: '10px', marginBottom: '0.2rem', width: '10%', textAlign: 'center' }}>
                <SoftTypography
                  component="label"
                  variant="caption"
                  fontWeight="bold"
                  textTransform="capitalize"
                  fontSize="13px"
                >
                  Tax
                </SoftTypography>
              </div>
              <div style={{ marginLeft: '10px', marginBottom: '0.2rem', width: '20%', textAlign: 'center' }}>
                <SoftTypography
                  component="label"
                  variant="caption"
                  fontWeight="bold"
                  textTransform="capitalize"
                  fontSize="13px"
                >
                  Amount
                </SoftTypography>
              </div>
            </div>
          )}

          {inputlist.map((x, i) => {
            return (
              <Grid container spacing={3} style={{ marginBottom: '0.2rem', flexWrap: 'none' }}>
                <Grid item xs={3}>
                  <SoftTypography
                    component="label"
                    variant="caption"
                    fontWeight="bold"
                    textTransform="capitalize"
                    fontSize="13px"
                    style={{ display: i == 0 ? '' : 'none' }}
                  >
                    {x.itemLabel}
                    <br />
                  </SoftTypography>
                  {editProd ? (
                    <SoftBox className="edit-search-inpt" style={{ width: 'auto' }}>
                      <SoftTypography fontSize="16px" style={{ width: '150px !important', marginLeft: '20px' }}>
                        {prodName}
                      </SoftTypography>
                    </SoftBox>
                  ) : autoCompleteDetailsRowIndex.includes(i) && x?.name.length ? (
                    <TextField
                      value={x?.name}
                      readOnly={true}
                      style={{
                        width: 'auto',
                        marginLeft: '-4px',
                        // height:'40px'
                      }}
                    />
                  ) : (
                    <Autocomplete
                      className="search-input"
                      options={x.prodOptions}
                      getOptionLabel={(option) => option.name}
                      onChange={(e, v) => selectProduct(v, i)}
                      style={{
                        width: 'auto',
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          onChange={(e) => handleChangeIO(e, i)}
                          variant="outlined"
                          name="itemCode"
                          style={{
                            width: 'auto',
                            marginLeft: '-4px',
                          }}
                        />
                      )}
                    />
                  )}
                </Grid>
                {/* <Grid item xs textAlign="center">
                  <SoftTypography className="soft-spec-box" type="number" fontSize="16px" fontWeight="normal" style={{height:"40px"}}>
                    {x.rate}
                  </SoftTypography>
                </Grid> */}
                <Grid item xs>
                  <SoftTypography
                    component="label"
                    variant="caption"
                    fontWeight="bold"
                    textTransform="capitalize"
                    fontSize="13px"
                    style={{ display: i == 0 ? '' : 'none' }}
                  >
                    {x.quantityLabel}
                  </SoftTypography>
                  {i === 0 ? <br /> : null}
                  {editProd ? (
                    <TextField
                      className="soft-spec-box"
                      sx={{ maxWidth: '80px !important' }}
                      type="number"
                      onChange={(e) => {
                        handleQuantityChange(e, i);
                        setGtinQuant(x.gtin);
                        setSellingPrice(x.sellingPrice);
                      }}
                      defaultValue={editQuantityChange}
                    />
                  ) : autoCompleteDetailsRowIndex.includes(i) && x?.name.length ? (
                    <TextField
                      value={x?.quantity}
                      type="number"
                      sx={{ maxWidth: '80px !important' }}
                      className="soft-spec-box"
                      defaultValue="1"
                      onChange={(e) => {
                        handleQuantityChange(e, i);
                        setGtinQuant(x.gtin);
                        setSellingPrice(x.sellingPrice);
                      }}
                    />
                  ) : (
                    <TextField
                      className="soft-spec-box"
                      sx={{ maxWidth: '80px !important' }}
                      type="number"
                      onChange={(e) => {
                        handleQuantityChange(e, i);
                        setGtinQuant(x.gtin);
                        setSellingPrice(x.sellingPrice);
                      }}
                      defaultValue="1"
                    />
                  )}
                </Grid>
                <Grid item xs={1.5} textAlign="center">
                  <SoftTypography
                    component="label"
                    variant="caption"
                    fontWeight="bold"
                    textTransform="capitalize"
                    fontSize="13px"
                    style={{ display: i == 0 ? '' : 'none' }}
                  >
                    {x.rateLabel}
                  </SoftTypography>
                  <SoftTypography
                    className="soft-spec-box"
                    type="number"
                    fontSize="16px"
                    fontWeight="normal"
                    style={{ height: '40px', minWidth: '30px' }}
                  >
                    {x.rate}
                  </SoftTypography>
                </Grid>
                <Grid item xs textAlign="center">
                  {/* <SoftTypography className="soft-spec-box" type="number" fontSize="16px" fontWeight="normal" style={{height:"40px"}}>
                    {x.discount}
                  </SoftTypography> */}
                  <SoftBox>
                    <SoftTypography
                      component="label"
                      variant="caption"
                      fontWeight="bold"
                      textTransform="capitalize"
                      fontSize="13px"
                      style={{ display: i == 0 ? '' : 'none' }}
                    >
                      {x.discountLabel}
                    </SoftTypography>
                    <SoftBox className={`boom-box ${i === 0 ? 'mobilemargin' : ''}`}>
                      <SoftInput className="boom-input" type="text" style={{ minWidth: '40px' }} />
                      <SoftBox className="boom-soft-box">
                        <SoftSelect
                          menuPortalTarget={document.body}
                          className="boom-soft-select "
                          defaultValue={{ value: 'Rs', label: 'Rs' }}
                          options={[
                            { value: 'Rs', label: 'Rs' },
                            { value: '%', label: '%' },
                          ]}
                        />
                      </SoftBox>
                    </SoftBox>
                  </SoftBox>
                </Grid>

                <Grid item xs textAlign="center">
                  <SoftTypography
                    component="label"
                    variant="caption"
                    fontWeight="bold"
                    textTransform="capitalize"
                    fontSize="13px"
                    style={{ display: i == 0 ? '' : 'none' }}
                  >
                    {x.specificationLabel}
                  </SoftTypography>
                  <SoftTypography
                    className="soft-spec-box"
                    type="number"
                    fontSize="16px"
                    fontWeight="normal"
                    style={{ height: '40px' }}
                  >
                    {x.specification}
                  </SoftTypography>
                </Grid>
                <Grid item xs textAlign="center">
                  <SoftTypography
                    component="label"
                    variant="caption"
                    fontWeight="bold"
                    textTransform="capitalize"
                    fontSize="13px"
                    style={{ display: i == 0 ? '' : 'none' }}
                  >
                    {x.taxLabel}
                  </SoftTypography>
                  <SoftTypography className="soft-spec-box" type="number" fontSize="16px" fontWeight="normal">
                    {x.igst}
                  </SoftTypography>
                </Grid>
                <Grid item xs textAlign="center">
                  <SoftTypography
                    component="label"
                    variant="caption"
                    fontWeight="bold"
                    textTransform="capitalize"
                    fontSize="13px"
                    style={{ display: i == 0 ? '' : 'none' }}
                  >
                    {x.amountLabel}
                  </SoftTypography>
                  <SoftTypography
                    className="soft-spec-box"
                    type="number"
                    fontSize="16px"
                    fontWeight="normal"
                    style={{ height: '40px' }}
                  >
                    {x?.rate === '' ? '0' : x?.rate * x?.quantity}
                  </SoftTypography>
                </Grid>

                <SoftBox
                  className="close-icons"
                  mt={i === 0 ? '65px' : '35px'}
                  ml={i === 0 ? '13px' : '15px'}
                  width="30px"
                  style={{ cursor: 'pointer' }}
                >
                  <CloseIcon
                    onClick={() => {
                      handleRemove(x, i);
                      if (x?.rate !== '') {
                        handleDelete(x.gtin);
                      }
                    }}
                  />
                </SoftBox>
              </Grid>
            );
          })}

          <Button
            onClick={handleClick}
            className="add-button"
            style={{ textTransform: 'none', left: '0px', paddingLeft: '0px' }}
          >
            + Add More Items
          </Button>
        </SoftBox>
        {orderedItems.length > 0 ? (
          <SoftBox>
            <table className="tablesize">
              <thead>
                <tr className="table-tr">
                  <th className="th-text">Item</th>
                  <th className="th-text">MRP</th>
                  <th className="th-text">Selling Price</th>
                  <th className="th-text">Quantity</th>
                  <th className="th-text">Amount</th>
                  <th className="th-text">Edit</th>
                  <th className="th-text">Delete</th>
                </tr>
              </thead>
              <tbody style={{ height: '75px' }}>
                {orderedItems.map((item) => (
                  <tr key={item.gtin}>
                    <td className="small-table-text" style={{ alignItems: 'center' }}>
                      {item.productName}
                    </td>
                    <td className="small-table-text">Rs. {item.mrp}</td>
                    <td className="small-table-text">Rs. {item.sellingPrice}</td>
                    <td className="small-table-text">{item.quantity}</td>
                    <td className="small-table-text">Rs. {inclusiveTax ? item.subTotal : item.subTotalWithoutTax}</td>
                    <td
                      className="small-table-text"
                      onClick={() => {
                        setInputlist([
                          {
                            gtin: item.gtin,
                            rate: item.sellingPrice,
                            igst: item.igst,
                            name: item.productName,
                            quantity: item.quantity,
                            itemLabel: 'Item name',
                            quantityLabel: 'Quantity',
                            rateLabel: 'Selling Price',
                            discountLabel: 'Discount',
                            specificationLabel: 'Specification',
                            taxLabel: 'Tax',
                            amountLabel: 'Amount',
                          },
                        ]);
                        setEditProd(true);
                        setProdName(item.productName);
                        setEditQuantityChange(item.quantity);
                      }}
                    >
                      Edit
                    </td>
                    <td
                      className="small-table-text"
                      onClick={() => {
                        handleDelete(item.gtin);
                      }}
                    >
                      Delete
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </SoftBox>
        ) : null}

        {orderedItems.length > 0 ? (
          <SoftBox display="flex" mt={1} alignItems="center">
            <Checkbox checkbox={inclusiveTax} onClick={() => setInclusiveTax(!inclusiveTax)} />
            <SoftTypography component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
              *Inclusive of tax
            </SoftTypography>
          </SoftBox>
        ) : null}
      </SoftBox>

      <SoftBox className="sales-details-comment-box">
        <Grid container spacing={5} m="auto" width="100%">
          <Grid item xs={12} md={6} xl={5} mr={4}>
            <SoftBox className="textarea-box-o" mt={2}>
              <SoftBox className="attach-btn-cust">
                <SoftTypography fontSize="12px" fontWeight="bold">
                  {' '}
                  Customer Notes{' '}
                </SoftTypography>
              </SoftBox>
              <SoftBox>
                <TextareaAutosize
                  aria-label="minimum height"
                  minRows={3}
                  placeholder="Will be displayed on Sales order"
                  className="add-pi-textarea-i"
                  border="1px solid rgb(211,211,211)"
                  value={noteTxt}
                  onChange={(e) => setNoteTxt(e.target.value)}
                />
              </SoftBox>
            </SoftBox>
          </Grid>

          <Grid item xs={12} md={5} xl={4}></Grid>

          <Grid
            item
            xs={12}
            md={5}
            xl={5}
            sx={{ mr: { xl: '80px', lg: '100px', md: '40px', s: '40px', xs: '40px' } }}
            mt="20px"
          >
            <SoftBox className="add-po-bill-details-box" mb={2}>
              <SoftBox display="flex" justifyContent="space-between" p={3}>
                <SoftTypography fontSize="15px" fontWeight="bold">
                  Loyality Points
                </SoftTypography>
                <SoftTypography fontSize="14px" fontWeight="normal" mb="10px">
                  Redeem{' '}
                </SoftTypography>
              </SoftBox>
            </SoftBox>
            <SoftBox className="add-po-bill-details-box">
              <SoftBox display="flex" justifyContent="space-between" p={3}>
                <SoftBox>
                  <SoftTypography fontSize="15px" fontWeight="bold">
                    50% OFF up to ₹120
                  </SoftTypography>
                  <SoftTypography fontSize="14px" fontWeight="normal">
                    Code: DIWALI50
                  </SoftTypography>
                </SoftBox>
                <SoftBox>
                  <SoftTypography fontSize="15px" fontWeight="normal" p="10 !important">
                    Apply
                  </SoftTypography>
                  <SoftTypography fontSize="15px" fontWeight="normal">
                    Remove
                  </SoftTypography>
                </SoftBox>
              </SoftBox>
              <hr />
              <Typography textAlign="center" width="40%" m="auto">
                <CouponModal />
              </Typography>
            </SoftBox>
          </Grid>

          <Grid item xs={12} md={5} xl={5} sx={{ mr: { xl: '70px', lg: '60px', md: '40px', s: '40px', xs: '40px' } }}>
            <SoftBox className="add-po-bill-details-box">
              <SoftBox display="flex" justifyContent="space-between" p={3}>
                <SoftBox gap={5}>
                  <SoftTypography fontSize="15px" fontWeight="normal">
                    Discount
                  </SoftTypography>
                  <SoftTypography fontSize="15px" fontWeight="normal">
                    Shipping Charges
                  </SoftTypography>
                  <SoftTypography fontSize="15px" fontWeight="normal">
                    Coupon Applied
                  </SoftTypography>
                  <SoftTypography fontSize="15px" fontWeight="normal">
                    CGST
                  </SoftTypography>
                  <SoftTypography fontSize="15px" fontWeight="normal">
                    SGST
                  </SoftTypography>
                  <SoftTypography fontSize="15px" fontWeight="normal">
                    IGST
                  </SoftTypography>
                  <SoftTypography fontSize="15px" fontWeight="normal">
                    Sub Total
                  </SoftTypography>
                </SoftBox>
                {billingData == null ? (
                  <SoftBox width="30%">
                    <SoftTypography fontSize="15px" fontWeight="normal" className="inpt-box-price">
                      0.00
                    </SoftTypography>
                    <SoftTypography fontSize="15px" fontWeight="normal" className="inpt-box-price">
                      0.00
                    </SoftTypography>
                    <SoftTypography fontSize="15px" fontWeight="normal" className="inpt-box-price">
                      0.00
                    </SoftTypography>
                    <SoftTypography fontSize="15px" fontWeight="normal" className="inpt-box-price">
                      0.00
                    </SoftTypography>
                    <SoftTypography fontSize="15px" fontWeight="normal" className="inpt-box-price">
                      0.00
                    </SoftTypography>
                  </SoftBox>
                ) : (
                  <SoftBox width="30%">
                    {billingData == '' ? (
                      <SoftTypography fontSize="15px" fontWeight="normal" className="inpt-box-price">
                        0.00
                      </SoftTypography>
                    ) : (
                      <SoftTypography fontSize="15px" fontWeight="normal" className="inpt-box-price">
                        {billingData.discount || '0.00'}
                      </SoftTypography>
                    )}
                    <SoftTypography fontSize="15px" fontWeight="normal" className="inpt-box-price">
                      0.00
                    </SoftTypography>
                    <SoftTypography fontSize="15px" fontWeight="normal" className="inpt-box-price">
                      0.00
                    </SoftTypography>
                    {billingData == '' ? (
                      <SoftTypography fontSize="15px" fontWeight="normal" className="inpt-box-price">
                        0.00
                      </SoftTypography>
                    ) : (
                      <SoftTypography fontSize="15px" fontWeight="normal" className="inpt-box-price">
                        {billingData.cgst || '0.00'}
                      </SoftTypography>
                    )}
                    {billingData == '' ? (
                      <SoftTypography fontSize="15px" fontWeight="normal" className="inpt-box-price">
                        0.00
                      </SoftTypography>
                    ) : (
                      <SoftTypography fontSize="15px" fontWeight="normal" className="inpt-box-price">
                        {billingData.sgst || '0.00'}
                      </SoftTypography>
                    )}
                    {billingData == '' ? (
                      <SoftTypography fontSize="15px" fontWeight="normal" className="inpt-box-price">
                        0.00
                      </SoftTypography>
                    ) : (
                      <SoftTypography fontSize="15px" fontWeight="normal" className="inpt-box-price">
                        {billingData.igst || '0.00'}
                      </SoftTypography>
                    )}
                    {billingData == '' ? (
                      <SoftTypography fontSize="15px" fontWeight="normal" className="inpt-box-price">
                        0.00
                      </SoftTypography>
                    ) : (
                      <SoftTypography fontSize="15px" fontWeight="normal" className="inpt-box-price">
                        {billingData.subtotal || '0.00'}
                      </SoftTypography>
                    )}
                  </SoftBox>
                )}
              </SoftBox>
              <hr />
              <SoftBox display="flex" p={3} justifyContent="space-between">
                <SoftBox>
                  <SoftTypography fontSize="16px" fontWeight="bold">
                    Total
                  </SoftTypography>
                </SoftBox>
                <SoftBox width="30%">
                  {billingData == '' ? (
                    <SoftTypography fontSize="14px" fontWeight="normal" className="inpt-box-price">
                      0.00
                    </SoftTypography>
                  ) : (
                    <SoftTypography fontSize="14px" fontWeight="normal" className="inpt-box-price">
                      {billingData?.totalCartValue || '0.00'}
                    </SoftTypography>
                  )}
                </SoftBox>
              </SoftBox>
            </SoftBox>
          </Grid>

          <Grid item xs={12} md={6} xl={6}></Grid>
          <Grid item xs={12} md={5} xl={3} alignSelf="end">
            <SoftSelect
              defaultValue={{ value: '', label: 'Payment Method' }}
              onChange={(e) => setPaymentMethod(e.value)}
              options={[
                { value: 'COD', label: 'CASH ON DELIVERY' },
                { value: 'ONLINE', label: 'ONLINE' },
              ]}
            />
          </Grid>
          <Grid item xs={12} md={6} xl={6}></Grid>

          <Grid item xs={12} md={5} xl={5} ml="-30px">
            <SoftBox className="sales-details-save-box">
              {saveLoader ? (
                <SoftButton disabled>Cancel</SoftButton>
              ) : (
                <SoftButton onClick={handleCancel} className="vendor-second-btn">
                  Cancel
                </SoftButton>
              )}
              {saveLoader ? (
                <SoftButton color="info" variant="gradient">
                  <CircularProgress
                    size={24}
                    sx={{
                      color: '#fff',
                    }}
                  />
                </SoftButton>
              ) : (
                <SoftButton className="vendor-add-btn" onClick={handleSubmit}>
                  Save
                </SoftButton>
              )}
            </SoftBox>
          </Grid>
        </Grid>
      </SoftBox>
    </DashboardLayout>
  );
};

export default Salesform;
