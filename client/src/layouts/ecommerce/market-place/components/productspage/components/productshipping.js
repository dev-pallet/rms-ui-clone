import { Grid, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import SoftBox from 'components/SoftBox';
import SoftTypography from 'components/SoftTypography';
// import "./cartpage.css";
import {
  CreateNewSalesCart,
  checkServiceability,
  editCartQuantity,
  getBranchAllAdresses,
  getCartDetails,
  purchaseorderwarehousedetails,
  removeCartProduct,
  updateCartData,
} from '../../../../../../config/Services';
import React, { useEffect, useState } from 'react';

import { useDebounce } from 'usehooks-ts';
import { useNavigate } from 'react-router-dom';
import MuiAlert from '@mui/material/Alert';
import SetInterval from '../../../../setinterval';
import Snackbar from '@mui/material/Snackbar';

const Productshipping = ({handlePincode , setOpenDialog}) => {
  const [loader, setLoader] = useState(false);
  const [billingData, setBillingData] = useState('');
  const [data, setData] = useState([]);
  const [noCartId, setNoCartId] = useState(false);
  const [checkoutLoader, setCheckoutLoader] = useState(false);
  const [cartFound, setCartFound] = useState(false);
  const [quantityChange, setQuantityChange] = useState('');
  const [gtinQuant, setGtinQuant] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [salesOption, setSalesOption] = useState([]);
  const [addressChanged, setAddressChanged] = useState(false);
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

  useEffect(() => {
    {shippingAddress?.pincode && handlePincode(shippingAddress?.pincode);}

    
  }, [shippingAddress]);

  

  useEffect(() => {
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
      orderType:'MARKETPLACE_ORDER',
    };
    if(localStorage.getItem('cartId-MP') === null){
      CreateNewSalesCart(payload).then(function (response) {
        localStorage.setItem('cartId-MP', response.data.data.cartId);
        setLoader(false);
        setCartFound(true);
      })
        .catch((err) => {
          setLoader(false);
        });
    }

    
  }, [!cartFound]);


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
      orderType:'MARKETPLACE_ORDER',
    };

    if (localStorage.getItem('cartId-MP') === null) {
      CreateNewSalesCart(payload)
        .then(function (response) {
          localStorage.setItem('cartId-MP', response.data.data.cartId);
          setLoader(false);
          setCartFound(true);
        })
        .catch((err) => {
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
        } else {
          setData(res.data.data.cartProducts);
          setBillingData(res.data.data.billing);
          setBillingAddress(res.data.data.billingAddress);
          setShippingAddress(res.data.data.shippingAddress);
          {res.data.data.shippingAddress?.pincode && handlePincode(res.data.data.shippingAddress?.pincode);}

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
          setShippingAddress(res.data.data.warehouseOrgLocAddressDetail);
          {res.data.data.warehouseOrgLocAddressDetail?.pincode && handlePincode(res.data.data.warehouseOrgLocAddressDetail?.pincode);}

        }
        setSalesOption(orgLocAddressDetailList);
      });
    } else if (contextType === 'RETAIL') {
      getBranchAllAdresses(locId).then((res) => {
        orgLocAddressDetailList = res.data.data.addresses;
        setBillingAddress(orgLocAddressDetailList[0]);
        setShippingAddress(orgLocAddressDetailList[0]);
        {orgLocAddressDetailList[0]?.pincode && handlePincode(orgLocAddressDetailList[0]?.pincode);}
        setSalesOption(orgLocAddressDetailList);
      });
    }
  };


  const handleShippingAddress = (e) => {
    handlePincode(e?.pincode);
    const newValue = e?.pincode;
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
        setShippingAddress(changeAdress);
        {changeAdress?.pincode && handlePincode(changeAdress?.pincode);}

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
  }, [addressChanged]);

  const updateCartInfo = () => {
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
          country: changeBillingAddress?.country,
          state: changeBillingAddress?.state,
          city: changeBillingAddress?.city,
          pinCode: changeBillingAddress?.pincode,
          phoneNo: 'string',
          addressLine1: changeBillingAddress?.addressLine1,
          addressLine2: changeBillingAddress?.addressLine2,
          type: 'string',
          addressType: changeBillingAddress?.addressType,
          updatedBy: uidx,
          updatedOn: '',
        },
        shippingAddress: {
          addressId: 'string',
          country: changeshippingAddress?.country,
          state: changeshippingAddress?.state,
          city: changeshippingAddress?.city,
          pinCode: changeshippingAddress?.pincode,
          phoneNo: 'string',
          addressLine1: changeshippingAddress?.addressLine1,
          addressLine2: changeshippingAddress?.addressLine2,
          type: 'string',
          addressType: changeshippingAddress?.addressType,
          updatedBy: uidx,
          updatedOn: '',
        },
      },
    };
    updateCartData(payload, cartId)
      .then((res) => {
        setBillingAddress(res.data.data.billingAddress);
        setShippingAddress(res.data.data.shippingAddress);
        {res.data.data.shippingAddress?.pincode && handlePincode(res.data.data.shippingAddress?.pincode);}

        setAddressChanged(false);
        setAlertmessage('Address Updated');
        setTimelineerror('success');
        setTimeout(() => {
          handleopensnack();
        }, 100);
      })
      .catch((err) => {
        setAddressChanged(false);
        setAlertmessage('Unable to Update Address');
        setTimelineerror('error');
        setTimeout(() => {
          handleopensnack();
        }, 100);
      });
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
        setData(res.data.data.cartProducts);
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
      setData(res.data.data.cartProducts);
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
    <>
      <Snackbar open={opensnack} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={timelinerror} sx={{ width: '100%' }}>
          {alertmessage}
        </Alert>
      </Snackbar>

      {data.length !== 0 ?  <Grid container  mt={1} >
        <Grid item    fullWidth
          maxWidth="xs">
          <SoftBox>
            <SoftBox className="add-address">
              <Typography id="modal-modal-title" variant="h6" fontWeight="bold" component="h2">
                    Selected Address
              </Typography>
                  
            </SoftBox>

            {shippingAddress === null ? null : (
              <Box className="cart-header-box-div-1">
                <SoftTypography className="dafault-address-1">
                  {shippingAddress.addressLine1} {shippingAddress.addressLine2} {shippingAddress.city}{' '}
                  {shippingAddress.state} {shippingAddress.pincode} {shippingAddress.country}  {shippingAddress.pinCode}
                </SoftTypography>
              </Box>
            )}

            {/* <Box display="flex" flexDirection="row" justifyContent="space-between">
              <SoftTypography onClick={handleClick4} sx={{ fontSize: '0.6em', color: 'rgb(0,100,254)' }}>
                Change the Address
              </SoftTypography>
            </Box> */}


         
          </SoftBox>

          <hr />
          <SoftBox
            style={{marginTop:'100px'}}
             
            open={open4}
            onClose={() => {
              setOpen4(false);
            }}
          >
            <Box
              
              sx={{
              
                 
                // p: 4,
                overflow: 'auto',
                maxHeight: '80vh',
              }}
            >
              <Box position="sticky" top="0" backgroundColor="#fff" >
                <Typography id="modal-modal-title" variant="h6" fontWeight="bold" component="h2">
                    Change Shipping Address
                </Typography>
                <SoftTypography
                  sx={{ fontSize: '0.68em', color: 'rgb(0,100,254)', cursor: 'pointer' }}
                  onClick={() => {
                    navigate('/setting/location');
                  }}
                >
                    Add Address
                </SoftTypography>
              </Box>
              <SoftBox>
                {salesOption.map((e) => {
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
                })}
              </SoftBox>
            </Box>
          </SoftBox>
        </Grid>
      </Grid> : null}
     
    </>
  );
};

export default Productshipping;
