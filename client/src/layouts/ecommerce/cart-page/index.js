import './cartpage.css';
import { Card, Grid, Modal, Typography } from '@mui/material';
import {
  CreateNewSalesCart,
  checkServiceability,
  createOrderwithPayment,
  editCartQuantity,
  getBranchAllAdresses,
  getCartDetails,
  getsalesorderdetailsvalue,
  purchaseorderwarehousedetails,
  removeCartProduct,
  updateCartData,
} from '../../../config/Services';
import { useDebounce } from 'usehooks-ts';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import ClearIcon from '@mui/icons-material/Clear';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import MuiAlert from '@mui/material/Alert';
import React, { useEffect, useState } from 'react';
import SetInterval from '../setinterval';
import Snackbar from '@mui/material/Snackbar';
import SoftBox from 'components/SoftBox';
import SoftButton from '../../../components/SoftButton';
import SoftSelect from '../../../components/SoftSelect';
import SoftTypography from 'components/SoftTypography';
import Spinner from '../../../components/Spinner';
import emptyCartImg from './img/emptyCartImg.png';

export const CartPage = () => {
  const [loader, setLoader] = useState(false);
  const [billingData, setBillingData] = useState('');
  const [data, setData] = useState([]);
  const [noCartId, setNoCartId] = useState(false);
  const [checkoutLoader, setCheckoutLoader] = useState(false);
  const [cartFound, setCartFound] = useState(false);
  const [quantityChange, setQuantityChange] = useState('');
  const [gtinQuant, setGtinQuant] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [salesOption, setSalesOption] = useState([]);
  const [addressChanged, setAddressChanged] = useState(true);
  const [billingAddress, setBillingAddress] = useState({});
  const [changeBillingAddress, setChangeBillingAddress] = useState({});
  const [shippingAddress, setShippingAddress] = useState({});
  const [changeshippingAddress, setChangeShippingAddress] = useState({});
  const debouncedValue = useDebounce(quantityChange, 500);
  const navigate = useNavigate();
  const [opensnack, setOpensnack] = useState(false);
  const [timelinerror, setTimelineerror] = useState('');
  const [alertmessage, setAlertmessage] = useState('');

  const handleopensnack = () => {
    setOpensnack(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpensnack(false);
  };

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  const [open3, setOpen3] = useState(false);
  const [open4, setOpen4] = useState(false);

  const handleClick3 = (event) => {
    // setAnchorEl1(event.currentTarget);
    setOpen3((previousOpen1) => !previousOpen1);
  };

  const handleClick4 = (event) => {
    // setAnchorEl2(event.currentTarget);
    setOpen4((previousOpen2) => !previousOpen2);
  };

  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const userName = localStorage.getItem('user_name');
  const user_details = JSON.parse(localStorage.getItem('user_details'));
  const uidx = user_details.uidx;
  const mobileNumber = user_details.mobileNumber;
  const cartId = localStorage.getItem('cartId-MP');
  const contextType = localStorage.getItem('contextType');
  const sourceApp = localStorage.getItem('sourceApp');

  useEffect(() => {
    newSalesCart();
    if (cartId) {
      cartDetails();
    }
  }, [cartFound]);

  const newSalesCart = () => {
    setLoader(true);
    const payload = {
      userName: userName,
      userId: uidx,
      mobileNo: mobileNumber,
      createdBy: userName,
      locationId: locId,
      sourceId: orgId,
      loggedInUser: uidx,
      sourceLocationId: locId,
      sourceType: contextType,
      sourceApp: sourceApp,
      destinationId: 'PALLET_ORG',
      destinationLocationId: 'PALLET_LOC',
      destinationType: contextType,
      comments: '',
      orderType: 'MARKETPLACE_ORDER',
    };

    if (localStorage.getItem('cartId-MP') === null) {
      CreateNewSalesCart(payload)
        .then(function (response) {
          localStorage.setItem('cartId-MP', response.data.data.cartId);
          setLoader(false);
          setCartFound(true);
        })
        .catch((err) => {
          setNoCartId(true);

          setLoader(false);
        });
    }
  };

  const cartDetails = () => {
    setLoader(true);
    getCartDetails(cartId)
      .then((res) => {
        if (res.data.data.cartProducts.length == 0) {
          setNoCartId(true);
          localStorage.setItem('CartLength', 0);
        } else {
          setData(res?.data?.data?.cartProducts);
          localStorage.setItem('CartLength', res?.data?.data?.cartProducts.length);

          setBillingData(res?.data?.data?.billing);
          setBillingAddress(res?.data?.data?.billingAddress);

          if (res?.data?.data?.shippingAddress && res?.data?.data?.shippingAddress.addressLine1 !== null) {
            setShippingAddress(res?.data?.data?.shippingAddress);
          }
          if (res.data.data.billingAddress == null) {
            setChangeBillingAddress(null);
          }
          if (res.data.data.shippingAddress == null) {
            setChangeShippingAddress(null);
          }
          setCartFound(true);
          savedLocations();
        }
        setLoader(false);
      })
      .catch((error) => {
        setAlertmessage('Some error occured');
        setTimelineerror('error');
        setTimeout(() => {
          handleopensnack();
        }, 100);
        if (!cartId) {
          setNoCartId(true);
        }
        setLoader(false);
      });
  };

  let orgLocAddressDetailList = [];

  const savedLocations = () => {
    if (contextType === 'WMS') {
      purchaseorderwarehousedetails(orgId).then((res) => {
        orgLocAddressDetailList = res.data.data.warehouseOrgLocAddressDetailList;
        if (billingAddress == null) {
          setBillingAddress(res.data.data.warehouseOrgLocAddressDetail);
        }
        if (shippingAddress == null) {
          if (
            res.data.data.warehouseOrgLocAddressDetail &&
            res.data.data.warehouseOrgLocAddressDetail.addressLine1 !== null
          ) {
            setShippingAddress(res.data.data.warehouseOrgLocAddressDetail);
          }
        }
        setSalesOption(orgLocAddressDetailList);
      });
    } else if (contextType === 'RETAIL') {
      getBranchAllAdresses(locId).then((res) => {
        orgLocAddressDetailList = res.data.data.addresses;
        setBillingAddress(orgLocAddressDetailList[0]);
        if (orgLocAddressDetailList[0] && orgLocAddressDetailList[0].addressLine1 !== null) {
          setShippingAddress(orgLocAddressDetailList[0]);
        }
        setSalesOption(orgLocAddressDetailList);
      });
    }
  };

  const handleBillingAddress = (e) => {
    const newValue = e.pincode;
    // checkServiceability(newValue)
    //     .then((res) => {
    //     if(res.data.data.message === 'PINCODE_NOT_SERVICEABLE'){
    //         setAlertmessage('Pincode not serviceable, add another Pincode');
    //         setTimelineerror('error');
    //         SetInterval(handleopensnack());
    //     }
    //     else{
    //         setAlertmessage('Pincode serviceable');
    //         setTimelineerror('success');
    //         SetInterval(handleopensnack());
    //         // setServiceability(true);

    //     }
    // })
    const changeAdress = {
      addressLine1: e.addressLine1,
      addressLine2: e.addressLine2,
      addressType: e.addressType,
      city: e.city,
      state: e.state,
      pincode: e.pincode,
      country: e.country,
    };
    setBillingAddress(changeAdress);
    setChangeBillingAddress(changeAdress);
    setAddressChanged(true);
    setOpen3(false);
  };
  const handleShippingAddress = (e) => {
    const newValue = e.pincode;
    checkServiceability(newValue).then((res) => {
      if (res.data.data.message === 'PINCODE_NOT_SERVICEABLE') {
        setAlertmessage('Pincode not serviceable, add another Pincode');
        setTimelineerror('error');
        SetInterval(handleopensnack());
      } else {
        setAlertmessage('Pincode serviceable');
        setTimelineerror('success');
        SetInterval(handleopensnack());
        const changeAdress = {
          addressLine1: e.addressLine1,
          addressLine2: e.addressLine2,
          addressType: e.addressType,
          city: e.city,
          state: e.state,
          pincode: e.pincode,
          country: e.country,
        };
        if (changeAdress && changeAdress.addressLine1 !== null) {
          setShippingAddress(changeAdress);
        }
        setChangeShippingAddress(changeAdress);
        setAddressChanged(true);
      }
    });
    setOpen4(false);
  };
  useEffect(() => {
    if (addressChanged) {
      updateCartInfo();
    }
  }, [shippingAddress, addressChanged]);

  const updateCartInfo = () => {
    if (shippingAddress?.addressLine1 === undefined) {
      return;
    }
    const payload = {
      userName: userName,
      userId: uidx,
      mobileNo: mobileNumber,
      createdBy: userName,
      locationId: locId,
      sourceId: orgId,
      loggedInUser: uidx,
      sourceLocationId: locId,
      sourceType: contextType,
      sourceApp: sourceApp,
      destinationId: 'PALLET_ORG',
      destinationLocationId: 'PALLET_LOC',
      destinationType: contextType,
      comments: '',
      address: {
        billingAddress: {
          addressId: 'string',
          country: billingAddress?.country,
          state: billingAddress?.state,
          city: billingAddress?.city,
          pinCode: billingAddress?.pincode,
          phoneNo: 'string',
          addressLine1: billingAddress?.addressLine1,
          addressLine2: billingAddress?.addressLine2,
          type: 'string',
          addressType: billingAddress?.addressType,
          updatedBy: uidx,
          updatedOn: '',
        },
        shippingAddress: {
          addressId: 'string',
          country: shippingAddress?.country,
          state: shippingAddress?.state,
          city: shippingAddress?.city,
          pinCode: shippingAddress?.pincode,
          phoneNo: 'string',
          addressLine1: shippingAddress?.addressLine1,
          addressLine2: shippingAddress?.addressLine2,
          type: 'string',
          addressType: shippingAddress?.addressType,
          updatedBy: uidx,
          updatedOn: '',
        },
      },
    };
    let Alertmessagecart;
    if (data.length === 0) {
      Alertmessagecart = null;
    } else {
      Alertmessagecart = 'Address Updated';
    }

    if (cartId) {
      updateCartData(payload, cartId)
        .then((res) => {
          setBillingAddress(res.data.data.billingAddress);

          if (res.data.data.shippingAddress && res.data.data.shippingAddress.addressLine1 !== null) {
            setShippingAddress(res.data.data.shippingAddress);
          }
          setAddressChanged(false);
          {
            Alertmessagecart ? setAlertmessage(Alertmessagecart) : null;
          }
          {
            Alertmessagecart ? setTimelineerror('success') : null;
          }
          setTimeout(() => {
            {
              Alertmessagecart ? handleopensnack() : null;
            }
          }, 100);
        })
        .catch((err) => {
          setAddressChanged(false);
          {
            noCartId ? null : setAlertmessage('Unable to Update Address');
          }
          setTimelineerror('error');
          setTimeout(() => {
            handleopensnack();
          }, 100);
        });
    }
  };

  const handleQuantityChange = (e) => {
    setQuantityChange(e.target.value);
  };

  useEffect(() => {
    if (cartFound) {
      setLoader(true);
      editQuantity();
    }
  }, [debouncedValue]);

  const editQuantity = () => {
    const payload = {
      gtin: gtinQuant,
      qty: debouncedValue,
      sellingPrice: sellingPrice,
    };
    editCartQuantity(payload, cartId, locId)
      .then((res) => {
        setAlertmessage('Quantity updated');
        setTimelineerror('success');
        setTimeout(() => {
          handleopensnack();
        }, 100);
        setData(res?.data?.data?.cartProducts);
        localStorage.setItem('CartLength', res?.data?.data?.cartProducts.length);

        setBillingData(res.data.data.billing);
        setLoader(false);
      })
      .catch((error) => {
        if (error.response.data.message === 'Error : Quantity should be greater than O.') {
          setAlertmessage('Quantity should be greater than O or Delete the product');
          setTimelineerror('warning');
          setTimeout(() => {
            handleopensnack();
          }, 100);
        }
        setLoader(false);
      });
  };

  const navigateToProducts = () => {
    navigate('/market-place/products');
    setNoCartId(true);
  };
  const handleCheckout = () => {
    // updateCartInfo();
    if (shippingAddress.pincode === '') {
      setAlertmessage('Select Shipping Address');
      setTimelineerror('warning');
      setTimeout(() => {
        setCheckoutLoader(false);
        handleopensnack();
      }, 100);
    }
    // else if(changeshippingAddress === null){
    //     setAlertmessage('Select Shipping Address');
    //     setTimelineerror('warning');
    //     setTimeout(()=> {
    //         setCheckoutLoader(false);
    //         handleopensnack();
    //     }, 100)
    // }
    // else if (paymentMethod === 'ONLINE') {
    //     navigate("/order/online_payment")

    //   }
    else {
      if (paymentMethod === '') {
        setAlertmessage('Select Payment Method');
        setTimelineerror('warning');
        setTimeout(() => {
          setCheckoutLoader(false);
          handleopensnack();
        }, 100);
      } else {
        setCheckoutLoader(true);
        createOrderwithPayment(cartId, paymentMethod)
          .then((res) => {
            if (paymentMethod === 'ONLINE') {
              const paymentLink = res?.data?.data?.orderResponseModel?.paymentLink;
              localStorage.removeItem('cartId-MP');

              {
                paymentLink && (window.location.href = paymentLink);
              }
              // window.location.href =  paymentLink  && paymentLink;
              // navigate(`/order-placed/${res.data.data.orderResponseModel.orderId}`);
              getsalesorderdetailsvalue(res?.data?.data?.orderResponseModel?.orderId)
                .then((res) => {})
                .catch((error) => {});
            } else if (paymentMethod === 'CHEQUE') {
            } else if (res.data.data.message === 'Success') {
              localStorage.removeItem('cartId-MP');
              navigate(`/order-placed/${res.data.data.orderResponseModel.orderId}`);
            }
            // localStorage.removeItem("cartId-MP")
            setAlertmessage('Order has been proccessed');
            setTimelineerror('success');
            setTimeout(() => {
              handleopensnack();
              setCheckoutLoader(false);
            }, 100);
          })
          .catch((error) => {
            if (paymentMethod === 'CHEQUE') {
              setAlertmessage('CHEQUE currently not available');
              setTimelineerror('error');
              setTimeout(() => {
                setCheckoutLoader(false);
                handleopensnack();
              }, 100);
            } else {
              setAlertmessage(error?.message);
              setTimelineerror('error');
              setTimeout(() => {
                setCheckoutLoader(false);
                handleopensnack();
              }, 100);
            }
          });
      }
    }
  };

  const handleproductInfo = (gtin) => {
    navigate(`/market-place/products/details/${gtin}`);
  };

  const deleteProduct = (gtin) => {
    setLoader(true);
    removeCartProduct(cartId, gtin).then((res) => {
      setLoader(false);
      if (res.data.data.cartProducts.length == 0) {
        setNoCartId(true);
      }
      setData(res?.data?.data?.cartProducts);
      localStorage.setItem('CartLength', res?.data?.data?.cartProducts.length);

      setBillingData(res.data.data.billing);
      setAlertmessage('Product removed from cart');
      setTimelineerror('success');
      setTimeout(() => {
        handleopensnack();
      }, 100);
    });
  };

  const prodImage =
    'https://empire-s3-production.bobvila.com/slides/39825/original/Grocery-Items-With-the-Biggest-Pandemic-Price-Increase.jpg?1603734235';

  return (
    <DashboardLayout>
      <DashboardNavbar prevLink={true} />
      <Snackbar open={opensnack} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={timelinerror} sx={{ width: '100%' }}>
          {alertmessage}
        </Alert>
      </Snackbar>
      {loader ? (
        <Spinner />
      ) : noCartId ? (
        <SoftBox className="no-data">
          <Typography fontWeight="bold" mb={0}>
            Your Cart is Empty !
          </Typography>
          <img className="no-prod-cart" src={emptyCartImg} alt="" width={'100%'} />
          <SoftButton color="info" onClick={navigateToProducts}>
            {' '}
            Shop Now{' '}
          </SoftButton>
        </SoftBox>
      ) : (
        <Grid container spacing={2} mt={1} gap="40px" style={{ background: '#f2f3f5', height: '80vh' }}>
          {/* Ist box */}

          <Grid item xs={12} md={10} xl={7.5}>
            <Card style={{ padding: '20px', background: '#fff', border: '1px solid #eeedf5' }}>
              <Box className="billing-address">
                <Box display="flex" gap={1}>
                  <Box
                    className="navigate-wrapper-product-box"
                    onClick={() => {
                      navigate(-1);
                    }}
                  >
                    <KeyboardBackspaceIcon className="paymentPageBackBtn" />
                  </Box>
                  <SoftTypography sx={{ fontSize: '0.em' }}>
                    <b>Order Summary</b>
                  </SoftTypography>
                </Box>
                <SoftTypography sx={{ fontSize: '0.8em' }}>{billingData.quantity} Items</SoftTypography>
              </Box>

              <SoftBox className="billing-detail">
                <Grid container justifyContent="space-between" spacing={2}>
                  <Grid item xs={12} md={6} xl={6}>
                    <Card
                      style={{
                        border: '1px solid #ccc',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                        padding: '10px',
                      }}
                    >
                      <SoftBox className="add-address">
                        <SoftTypography sx={{ fontSize: '0.7em' }}>
                          <b>Billing Address </b>
                        </SoftTypography>
                      </SoftBox>
                      {billingAddress === null ? null : (
                        <Box className="cart-header-box-div-1">
                          <SoftTypography className="dafault-address-1">
                            {billingAddress.addressLine1} {billingAddress.addressLine2} {billingAddress.city}{' '}
                            {billingAddress.state} {billingAddress.pincode} {billingAddress.country}
                          </SoftTypography>
                        </Box>
                      )}
                      <Box display="flex" flexDirection="row" justifyContent="space-between">
                        <SoftTypography onClick={handleClick3} sx={{ fontSize: '0.6em', color: 'rgb(0,100,254)' }}>
                          Change the Address
                        </SoftTypography>
                      </Box>
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
                            // p: 4,
                            overflow: 'auto',
                            maxHeight: '80vh',
                          }} 
                        >
                          <Box position="sticky" top="0" backgroundColor="#fff" padding={2}>
                            <Typography id="modal-modal-title" variant="h6" fontWeight="bold" component="h2">
                              Select Billing Address
                            </Typography>
                            <SoftTypography
                              sx={{ fontSize: '0.6em', color: 'rgb(0,100,254)', cursor: 'pointer' }}
                              onClick={() => {
                                navigate('/setting-location');
                              }}
                            >
                              Add Address
                            </SoftTypography>
                          </Box>
                          <SoftBox>
                            {salesOption.length > 0
                              ? salesOption.map((e) => {
                                return (
                                  <SoftBox key={e.id} onClick={() => handleBillingAddress(e)}>
                                    <SoftTypography className="add-pi-font-size">{e.addressLine1}</SoftTypography>
                                    <SoftTypography className="add-pi-font-size">{e.addressLine2}</SoftTypography>
                                    <SoftTypography className="add-pi-font-size">{e.state}</SoftTypography>
                                    <SoftTypography className="add-pi-font-size">
                                      {e.city} {e.pincode}
                                    </SoftTypography>
                                    <SoftTypography className="add-pi-font-size">{e.country}</SoftTypography>
                                    <SoftTypography className="add-pi-font-size">{e.pincode}</SoftTypography>

                                    <hr />
                                  </SoftBox>
                                );
                              })
                              : null}
                          </SoftBox>
                        </Box>
                      </Modal>
                    </Card>
                  </Grid>

                  <Grid item xs={12} md={6} xl={6}>
                    <Card
                      style={{
                        border: '1px solid #ccc',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                        padding: '10px',
                      }}
                    >
                      <SoftBox className="add-address">
                        <SoftTypography sx={{ fontSize: '0.7em' }}>
                          <b>Shipping Address </b>
                        </SoftTypography>
                      </SoftBox>

                      {shippingAddress === null ? null : (
                        <Box className="cart-header-box-div-1">
                          <SoftTypography className="dafault-address-1">
                            {shippingAddress.addressLine1} {shippingAddress.addressLine2} {shippingAddress.city}{' '}
                            {shippingAddress.state} {shippingAddress.pincode} {shippingAddress.country}
                          </SoftTypography>
                        </Box>
                      )}
                      <Box display="flex" flexDirection="row" justifyContent="space-between">
                        <SoftTypography onClick={handleClick4} sx={{ fontSize: '0.6em', color: 'rgb(0,100,254)' }}>
                          Change the Address
                        </SoftTypography>
                      </Box>
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
                            // p: 4,
                            overflow: 'auto',
                            maxHeight: '80vh',
                          }}
                        >
                          <Box position="sticky" top="0" backgroundColor="#fff" padding={2}>
                            <Typography id="modal-modal-title" variant="h6" fontWeight="bold" component="h2">
                              Select Shipping Address
                            </Typography>
                            <SoftTypography
                              sx={{ fontSize: '0.6em', color: 'rgb(0,100,254)', cursor: 'pointer' }}
                              onClick={() => {
                                navigate('/setting-location');
                              }}
                            >
                              Add Address
                            </SoftTypography>
                          </Box>
                          <SoftBox>
                            {salesOption.length > 0
                              ? salesOption.map((e) => {
                                return (
                                  <SoftBox key={e.id} onClick={() => handleShippingAddress(e)}>
                                    <SoftTypography className="add-pi-font-size">{e.addressLine1}</SoftTypography>
                                    <SoftTypography className="add-pi-font-size">{e.addressLine2}</SoftTypography>
                                    <SoftTypography className="add-pi-font-size">{e.state}</SoftTypography>
                                    <SoftTypography className="add-pi-font-size">
                                      {e.city} {e.pincode}
                                    </SoftTypography>
                                    <SoftTypography className="add-pi-font-size">{e.country}</SoftTypography>
                                    <SoftTypography className="add-pi-font-size">{e.pincode}</SoftTypography>

                                    <hr />
                                  </SoftBox>
                                );
                              })
                              : null}
                          </SoftBox>
                        </Box>
                      </Modal>
                    </Card>
                  </Grid>
                </Grid>
              </SoftBox>

              {/* original cart */}
              <div className="paymentCartContainer">
                <table className="payment-table">
                  <thead className="payment-table-head">
                    <tr>
                      <th>Name</th>
                      <th>MRP</th>
                      <th>Inventory Status</th>
                      <th>Quatity</th>
                      <th style={{ padding: '10px' }}>Remove</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item) => (
                      <tr key={item.cartProductId} className="payment-table-row">
                        <td style={{ cursor: 'pointer' }} onClick={() => handleproductInfo(item.gtin)}>
                          {item.productName}
                        </td>
                        {item?.sellingPrice < item?.mrp ? (
                          <>
                            <td>
                              <span className="price-tag-text-I">₹{item.mrp}</span>
                              <span className="price-tag-text-II">₹{item.sellingPrice}</span>
                              <span className="price-tag-text-III">₹{item.mrp - item.sellingPrice} off</span>
                            </td>
                          </>
                        ) : (
                          <td>
                            <span className="price-tag-text-II">₹{item.mrp}</span>
                          </td>
                        )}
                        <td style={{ color: '#3b9d3b' }}>{item.inventoryStatus}</td>
                        <td>
                          <input
                            className="payment-quant-input"
                            type="number"
                            defaultValue={item.quantity}
                            onChange={(e) => {
                              handleQuantityChange(e);
                              setGtinQuant(item.gtin);
                              setSellingPrice(item.sellingPrice);
                            }}
                          />
                        </td>
                        <td style={{ color: 'red', cursor: 'pointer' }} onClick={() => deleteProduct(item.gtin)}>
                          <ClearIcon />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </Grid>
          {/* 2nd Box */}
          <Grid item xs={12} md={7.5} xl={4}>
            <Card style={{ padding: '20px', background: '#fff', border: '1px solid #eeedf5' }}>
              <Box className="billing-address">
                <SoftTypography sx={{ fontSize: '0.em' }}>
                  <b>Payment Details</b>
                </SoftTypography>
              </Box>

              <Grid
                item
                xs={12}
                md={12}
                xl={12}
                p={1}
                className="nd-box"
                boxShadow="rgba(99, 99, 99, 0.3) 4px 6px 8px 0px"
                borderRadius="5px"
              >
                <Box display="flex" flexDirection="column" width="100%" gap={1}>
                  <Box display="flex" justifyContent="space-between">
                    <Box width="60% !important" fontSize="16px">
                      MRP
                    </Box>
                    <Box width="40% !important" fontSize="16px">
                      ₹{billingData.subtotal}
                    </Box>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Box width="60% !important" fontSize="16px">
                      Tax
                    </Box>
                    <Box width="40% !important" fontSize="16px">
                      ₹{billingData.igst}
                    </Box>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Box width="60% !important" fontSize="16px">
                      Discount
                    </Box>
                    <Box width="40% !important" fontSize="16px">
                      ₹{billingData.discount}
                    </Box>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Box width="60% !important" fontSize="16px">
                      Coupons
                    </Box>
                    <Box width="40% !important" fontSize="16px">
                      {billingData.appliedCoupon}
                    </Box>
                  </Box>
                  <Box display="flex" justifyContent="space-between">
                    <Box width="60% !important" fontSize="16px">
                      Delivery Fee
                    </Box>
                    <Box width="40% !important" fontSize="16px">
                      ₹{billingData.deliveryCharges}
                    </Box>
                  </Box>
                </Box>
                {billingData.appliedOffer > 0 ? (
                  <SoftTypography className="you-text">
                    You will save ₹{billingData.appliedOffer}on this order
                  </SoftTypography>
                ) : null}
              </Grid>
              <Box className="total-cart-box nd-box">
                <Box width="60% !important" className="total-enter-text">
                  TOTAL
                </Box>
                <Box width="40% !important" className="total-enter-text">
                  ₹{billingData.totalCartValue}
                </Box>
              </Box>

              <Box className="checkout-btn nd-box" marginTop={2}>
                <SoftSelect
                  sx={{ width: '50%' }}
                  defaultValue={{ value: '', label: 'Payment Method' }}
                  onChange={(e) => setPaymentMethod(e.value)}
                  menuPortalTarget={document.body}
                  options={[
                    { value: 'COD', label: 'COD' },
                    { value: 'CHEQUE', label: 'CHEQUE' },
                    { value: 'ONLINE', label: 'ONLINE' },
                  ]}
                />
                {checkoutLoader ? (
                  <Spinner />
                ) : (
                  <SoftButton color="info" variant="gradient" onClick={handleCheckout}>
                    CHECKOUT
                  </SoftButton>
                )}

                {/* {checkoutLoader && <Spinner />} */}
              </Box>
            </Card>
          </Grid>
        </Grid>
      )}
    </DashboardLayout>
  );
};

export default CartPage;
