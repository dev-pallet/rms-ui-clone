import '../product-cat.css';
import { Grid, TextField } from '@mui/material';
import {
  editCartQuantity,
  getCartDetails,
  removeCartProduct,
} from '../../../../../../config/Services';
import { useDebounce } from 'usehooks-ts';
import { useNavigate } from 'react-router-dom';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import React, { useEffect, useState } from 'react';
import Spinner from '../../../../../../components/Spinner';

export const CartMarketplace = ({
  setCartProducts,
  setSubtotal,
  addToCart,
  subtotal,
  cartProducts,
  setAlertmessage,
  setTimelineerror,
  handleopensnack,
  handleCloseSnackbar
}) => {
  const cartId = localStorage.getItem('cartId-MP');
  const locId = localStorage.getItem('locId');
  const [updated, setUpdated] = useState(false);
  const [quantityChange, setQuantityChange] = useState('');
  const [gtinQuant, setGtinQuant] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const debouncedValue = useDebounce(quantityChange, 500);
  const navigate = useNavigate();
  const [cartFound, setCartFound] = useState(false);
  const [loader, setLoader] = useState(false);

  const handleQuantityChange = (e) => {
    setQuantityChange(e);
  };

  useEffect(() => {
    if (cartFound) {
      setLoader(true);
      editQuantity();
    }
  }, [debouncedValue]);

  useEffect(() => {
    setLoader(true);
    getCartDetails(cartId)
      .then((res) => {
        setCartProducts(res.data.data.cartProducts);
        setSubtotal(res.data.data.billing.totalCartValue);
        setCartFound(true);
        setLoader(false);
      })
      .catch((error) => {});
  }, [updated, addToCart]);

  const editQuantity = () => {
    setLoader(true);
    const payload = {
      gtin: gtinQuant,
      qty: debouncedValue,
      sellingPrice: sellingPrice,
    };
    editCartQuantity(payload, cartId, locId)
      .then((res) => {
        setCartProducts(res.data.data.cartProducts);
        setLoader(false);
        setSubtotal(res.data.data.billing.totalCartValue);
        setUpdated(true);
        setAlertmessage('Quantity updated');
        setTimelineerror('success');
        setTimeout(() => {
          handleopensnack();
        }, 100);
      })
      .catch((error) => {
        setLoader(false);
        if (error.response.data.message === 'Error : Quantity should be greater than O.') {
          setAlertmessage('Quantity should be greater than O or Delete the product');
          setTimelineerror('warning');
          setTimeout(() => {
            handleopensnack();
          }, 100);
        }
      });
  };

  const deleteProduct = (gtin) => {
    setLoader(true);
    removeCartProduct(cartId, gtin)
      .then((res) => {
        setCartProducts(res.data.data.cartProducts);
        setSubtotal(res.data.data.billing.totalCartValue);
        setAlertmessage('Product removed from cart');
        setTimelineerror('success');
        setTimeout(() => {
          handleopensnack();
        }, 100);
        setLoader(false);
      })
      .catch((err) => {
        setLoader(false);
        setAlertmessage(err.response.data.message);
        setTimelineerror('error');
        setTimeout(() => {
          handleopensnack();
        }, 100);
      });
  };

  const handleCart = () => {
    navigate('/cart');
  };
  const handleIncrement = (e) => {
    handleQuantityChange(e + 1);
  };

  const handleDecrement = (e) => {
    if (quantityChange > 1) {
      handleQuantityChange(e - 1);
    }
  };

  return (
    <Grid item md={12} xs={12} mt={5} className="rightContainer">
      <div className="addCustomericons" style={{display:'flex', justifyContent:'space-between'}}>
        <div className="number-container" >
          <div className="number">Cart Details</div>{' '}
        </div>
        <div className='deleteCartIcons' onClick={() => handleCloseSnackbar('closeBtn')}><CancelOutlinedIcon color="danger"/></div>

      </div>
      <div className="emptyCartContainer">
        {loader ? (
          <Spinner />
        ) : cartProducts?.length > 0 ? (
          cartProducts.map((ele, index) => {
            return (
              <div className="cartItemConatiner">
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '130px',
                    gap: '5px',
                  }}
                  key={index}
                >
                  <div
                    className="itemname"
                    style={{
                      maxHeight: '40px',
                      overflowY: 'auto',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '14px',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {ele.productName}
                    </span>
                    
                  </div>
                  {/* <div> */}
                  <span
                    style={{
                      fontSize: '11px',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      marginLeft:'5px',
                      color:'#948e8e'
                    }}
                  >
                    {ele.quantity} x {ele.sellingPrice}
                  </span>
                  {/* </div> */}

                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' , alignItems:'center'}}>
                  <button
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '4px',
                      backgroundColor: 'white',
                      border: 'none',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight:'2px'
                    }}
                    onClick={() => {
                      handleDecrement(ele.quantity);
                      setGtinQuant(ele.gtin);
                      setSellingPrice(ele.sellingPrice);
                    }}
                  >
                    -
                  </button>

                  <TextField
                    className="cartItemQuantity"
                    style={{height: '37px !important'}}
                    type="number"
                    defaultValue={ele.quantity}
                    onChange={(e) => {
                      const newQuantity = parseInt(e.target.value);
                      if (!isNaN(newQuantity)) {
                        handleQuantityChange(newQuantity);
                      }
                      setGtinQuant(ele.gtin);
                      setSellingPrice(ele.sellingPrice);
                    }}
                  />
                  <button
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '4px',
                      backgroundColor: 'white',
                      border: 'none',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginLeft:'2px'

                    }}
                    onClick={() => {
                      handleIncrement(ele.quantity);
                      setGtinQuant(ele.gtin);
                      setSellingPrice(ele.sellingPrice);
                    }}
                  >
                    +
                  </button>
                </div>
                <span className="eachCartItemPrice">₹{ele.sellingPrice}</span>

                <div className="deleteCartIcons" onClick={() => deleteProduct(ele.gtin)}>
                  <DeleteOutlineIcon sx={{ fontSize: '16px !important' }} />
                </div>
              </div>
            );
          })
        ) : (
          <>
            <div className="noItemCart">
              <h3 className="emptyCartText">Empty Cart, Add Products to proceed</h3>
              {/* <img src={"https://dev-pos.palletnow.co/dist/44cce0c023534af0cbef9bbacebe74f4.gif"} width="350px" height="170px" alt={"barcode"} /> */}
            </div>
          </>
        )}
      </div>

      <div className="paymentDetails">
        <div className="totalpaymentBox">
          <p>Total</p>
          <p> ₹{subtotal}</p>
        </div>

        <button className="checkoutBtn" onClick={handleCart}>
          PROCEED
        </button>
      </div>
    </Grid>
  );
};
