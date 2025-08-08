import AddIcon from '@mui/icons-material/Add';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloseIcon from '@mui/icons-material/Close';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import SendIcon from '@mui/icons-material/Send';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import SoftBox from '../../../../../components/SoftBox';
import SoftButton from '../../../../../components/SoftButton';
import SoftInput from '../../../../../components/SoftInput';
import './whatsappCommerce.css';

import RemoveIcon from '@mui/icons-material/Remove';

const BusinessMobilePreview = ({
  setShowAddress,
  showAddress,
  addressMsg,
  setAddressMsg,
  address,
  setAddress,
  catalogShow,
  setCatalogShow,
  catalogProducts,
  data,
  newLogo,
  placeOrder,
  setPlaceOrder,
  cartItems,
  setCartItems,
  totalCartPrice,
  setTotalCartPrice,
  previewCart,
  setPreviewCart,
  addressTemplate,
  welcomeTemplate,
  mobileText,
  setMobileText,
  hiText,
  setHiText,
  paymentTemplate,
  catalogTemplate,
  setPaymentConfirm,
  paymentConfirm,
}) => {
  const [currentTime, setCurrentTime] = useState('');
  const [singleProductDisplay, setSingleProductDisplay] = useState(false);
  const [toShowProduct, setToShowProduct] = useState();
  const [openCart, setOpenCart] = useState(false);

  const handleAddToCart = (item) => {
    const existingItemIndex = cartItems.findIndex((cartItem) => cartItem.id === item.id);

    if (existingItemIndex !== -1) {
      // If the item is already in the cart, update the quantity
      const updatedCartItems = [...cartItems];
      updatedCartItems[existingItemIndex].quantity += 1;
      setCartItems(updatedCartItems);
    } else {
      // If the item is not in the cart, add it with quantity 1
      setCartItems((prevCartItems) => [...prevCartItems, { ...item, quantity: 1 }]);
    }
  };

  const handleDeleteItem = (itemId) => {
    // Find the index of the item in the cart
    const itemIndexToDelete = cartItems.findIndex((cartItem) => cartItem.id === itemId.id);

    // If the item is found in the cart and has a quantity greater than 1, decrement the quantity
    if (itemIndexToDelete !== -1 && cartItems[itemIndexToDelete].quantity > 1) {
      const updatedCartItems = [...cartItems];
      updatedCartItems[itemIndexToDelete].quantity -= 1;
      setCartItems(updatedCartItems);
    } else if (itemIndexToDelete !== -1) {
      // If the item is found in the cart and has a quantity of 1, remove it from the cart
      const updatedCartItems = [...cartItems];
      updatedCartItems.splice(itemIndexToDelete, 1);
      setCartItems(updatedCartItems);
    }
  };

  const calculateTotalPrice = () => {
    return cartItems.reduce((total, cartItem) => {
      return total + cartItem.price;
    }, 0);
  };

  useEffect(() => {
    const totalPrice = calculateTotalPrice();
    setTotalCartPrice(totalPrice);
  }, [cartItems]);

  const handleSendAddress = () => {
    setShowAddress(false);
    setAddressMsg(true);
  };

  useEffect(() => {
    // Function to update the current time every second

    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0'); // Get hours and pad with leading zero if necessary
      const minutes = now.getMinutes().toString().padStart(2, '0'); // Get minutes and pad with leading zero if necessary
      setCurrentTime(`${hours}:${minutes}`);
    };

    // Update the time immediately and then every second
    updateTime();
    const intervalId = setInterval(updateTime, 1000);

    // Clean up the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []);

  const orgName = localStorage.getItem('orgName');

  const handleSingleProduct = (item) => {
    setSingleProductDisplay(true);
    setCatalogShow(false);
    const product = catalogProducts.filter((product) => product.id === item);

    setToShowProduct(product);
  };

  const handlePlaceOrder = () => {
    setPlaceOrder(true);
    setShowAddress(false);
    setCatalogShow(false);
    setOpenCart(false);
  };

  const StyledTextComponent = ({ bodyText }) => {
    // Split bodyText by \\n
    const parts = bodyText.split(/\\n|\n/);

    return (
      <div>
        {parts.map((part, index) => (
          // Render each part with a line break
          <React.Fragment key={index}>
            {index !== 0 && <br />} {/* Add a line break except for the first part */}
            <span>{part}</span>
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div>
      <SoftBox className="whatsapp-business-mobile-preview-mobile">
        {!showAddress && !catalogShow && !singleProductDisplay && !openCart && !previewCart && (
          <>
            <SoftBox
              style={{
                background: '#007D6A',
                display: 'flex',
                borderBottom: '1px solid #e3e3e3',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <img
                src={data?.logo === null ? newLogo : data?.logo}
                alt=""
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  marginBottom: '10px',
                  marginLeft: '20px',
                  marginTop: '10px',
                }}
              />
              <Typography
                style={{
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  lineHeight: '1.5',
                  color: '#fff',
                  textAlign: 'left',
                  marginTop: '5px',
                }}
              >
                {orgName}
              </Typography>
            </SoftBox>
            <SoftBox style={{ height: '54vh', overflowY: 'auto' }}>
              <SoftBox className="message-preview-inner" style={{ width: '200px', margin: '5px' }}>
                <Typography
                  style={{
                    fontSize: '0.9rem',
                    lineHeight: '1.5',
                    textAlign: 'left',
                    margin: '10px 0px',
                    fontWeight: '200',
                  }}
                >
                  {welcomeTemplate?.bodyText ? (
                    <StyledTextComponent bodyText={welcomeTemplate?.bodyText} />
                  ) : (
                    <StyledTextComponent
                      bodyText={
                        "Hello Grocery-goers! Welcome to Twinleaves virtual shopping experience.😀\n\nNow you can order your favourite groceries from the WhatsApp.\nHow to Shop:\n1. Browse our catalog\n2. Add items you need\n3. Provide your address and confirm\n\nHurry, your order is placed. Sit back and relax! We'll deliver your order at your preferred time.\n\nTo start shopping, simply reply with 'Hi' to view our catalog and add your favourite grocery to purchase.\n\nHappy Shopping!"
                      }
                    />
                  )}
                </Typography>

                <p className="message-preview-time">{currentTime}</p>
              </SoftBox>
              {hiText && (
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <SoftBox
                    className="message-preview-inner"
                    style={{ width: '200px', margin: '5px', background: '#E2FFC9!important' }}
                  >
                    <Typography
                      style={{
                        fontSize: '0.9rem',
                        lineHeight: '1.5',
                        textAlign: 'left',
                        margin: '10px 0px',
                        fontWeight: '200',
                      }}
                    >
                      {mobileText}
                    </Typography>

                    <p className="message-preview-time">{currentTime}</p>
                  </SoftBox>
                </div>
              )}
              {hiText && (
                <SoftBox className="message-preview-inner" style={{ width: '200px', margin: '5px' }}>
                  <Typography
                    style={{
                      fontSize: '0.9rem',
                      lineHeight: '1.5',
                      textAlign: 'left',
                      // margin: '10px 0px',
                      fontWeight: '200',
                    }}
                  >
                    {addressTemplate?.bodyText ? (
                      <StyledTextComponent bodyText={addressTemplate?.bodyText} />
                    ) : (
                      'To check whether we can deliver to your home or not. Please provide your address below. 👇'
                    )}
                  </Typography>

                  <p className="message-preview-time">{currentTime}</p>
                  <SoftBox style={{ cursor: 'pointer' }} onClick={() => setShowAddress(true)}>
                    <hr />
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: '10px',
                        gap: '10px',
                      }}
                    >
                      <Typography
                        style={{
                          fontWeight: '200',
                          fontSize: '0.9rem',
                          lineHeight: '1.5',
                          textAlign: 'left',
                          // margin: '10px 0px',
                          color: '#0562FB',
                        }}
                      >
                        Provide Address
                      </Typography>
                    </div>
                  </SoftBox>
                </SoftBox>
              )}
              {addressMsg && (
                <>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <SoftBox
                      className="message-preview-inner"
                      style={{ width: '200px', margin: '5px', background: '#E2FFC9!important' }}
                    >
                      <Typography
                        style={{
                          fontSize: '0.9rem',
                          lineHeight: '1.5',
                          textAlign: 'left',
                          fontWeight: '200',
                        }}
                      >
                        {address.name}
                      </Typography>
                      <Typography
                        style={{
                          fontSize: '0.9rem',
                          lineHeight: '1.5',
                          textAlign: 'left',
                          fontWeight: '200',
                        }}
                      >
                        {address.number}
                      </Typography>
                      <Typography
                        style={{
                          fontSize: '0.9rem',
                          lineHeight: '1.5',
                          textAlign: 'left',
                          fontWeight: '200',
                        }}
                      >
                        {address.pincode}, {address.address}, {address.landmark}, {address.flat}, {address.floor},{' '}
                        {address.tower}, {address.building}, {address.city}, {address.state}
                      </Typography>
                      <p className="message-preview-time">{currentTime}</p>
                    </SoftBox>
                  </div>
                  <SoftBox className="message-preview-inner" style={{ width: '200px', margin: '5px' }}>
                    <div className="message-preview-top-box" style={{ width: '185px' }}>
                      <div className="message-preview-top-img">
                        <img
                          src="https://storage.googleapis.com/twinleaves_bucket/FrontEnd/Pallet_images/coco-bar-1.jpg"
                          alt=""
                          style={{ width: '57px', height: '80px' }}
                        />
                      </div>
                      <div>
                        <Typography
                          style={{
                            fontSize: '0.7rem',
                            lineHeight: '1.5',
                            textAlign: 'left',
                            marginTop: '10px',
                            fontWeight: '200',
                          }}
                        >
                          View Twinleaves's Catalog on Whatsapp
                        </Typography>

                        <Typography
                          style={{
                            fontSize: '0.5rem',
                            lineHeight: '1.5',
                            textAlign: 'left',
                            fontWeight: '200',
                          }}
                        >
                          Browse pictures and details of their offerings
                        </Typography>
                      </div>
                    </div>

                    <Typography
                      style={{
                        fontSize: '0.9rem',
                        lineHeight: '1.5',
                        textAlign: 'left',
                        // margin: '10px 0px',
                        fontWeight: '200',
                      }}
                    >
                      {catalogTemplate?.bodyText ? (
                        <StyledTextComponent bodyText={catalogTemplate.bodyText} />
                      ) : (
                        <StyledTextComponent
                          bodyText={
                            "Explore our fresh and diverse range of high-quality groceries. We've got everything you need to stock up your kitchen:\n*Our Categories:*\n🥦 Farm-fresh produce\n🥚 Dairy & Eggs\n🍚 Pantry Staples\n🥯 Snacks & Beverages\n🍞 Bakery items\nand much more...\nShop now and fill the cart with your favourites!"
                          }
                        />
                      )}
                    </Typography>

                    <p className="message-preview-time">{currentTime}</p>
                    <SoftBox onClick={() => setCatalogShow(true)}>
                      <hr />
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          // marginTop: '10px',
                          gap: '10px',
                          cursor: 'pointer',
                        }}
                      >
                        <FormatListBulletedIcon sx={{ color: '#0562fb', fontSize: '14px' }} />
                        <Typography
                          style={{
                            fontWeight: '200',
                            fontSize: '0.9rem',
                            lineHeight: '1.5',
                            textAlign: 'left',
                            // margin: '10px 0px',
                            color: '#0562FB',
                          }}
                        >
                          View Catalogue
                        </Typography>
                      </div>
                    </SoftBox>
                  </SoftBox>
                </>
              )}

              {placeOrder && (
                <>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <SoftBox className="message-preview-inner" style={{ width: '200px', margin: '5px' }}>
                      <div className="message-preview-top-box" style={{ width: '185px' }}>
                        <div className="message-preview-top-img">
                          <img
                            src="https://storage.googleapis.com/twinleaves_bucket/FrontEnd/Pallet_images/coco-bar-1.jpg"
                            alt=""
                            style={{ width: '57px', height: '80px' }}
                          />
                        </div>
                        <div>
                          <Typography
                            style={{
                              fontSize: '0.8rem',
                              lineHeight: '1.5',
                              textAlign: 'left',
                              marginTop: '10px',
                              fontWeight: '200',
                            }}
                          >
                            <ShoppingCartIcon /> {cartItems.length} items
                          </Typography>

                          <Typography
                            style={{
                              fontSize: '0.6rem',
                              lineHeight: '1.5',
                              textAlign: 'left',
                              fontWeight: '200',
                            }}
                          >
                            US${totalCartPrice} (estimated total)
                          </Typography>
                        </div>
                      </div>
                      <Typography
                        style={{
                          fontSize: '0.9rem',
                          lineHeight: '1.5',
                          textAlign: 'left',
                          margin: '10px 0px',
                          fontWeight: '200',
                        }}
                      >
                        You can see your cart here.
                      </Typography>
                      <p className="message-preview-time">{currentTime}</p>
                      <SoftBox onClick={() => setPreviewCart(true)}>
                        <hr />
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: '10px',
                            gap: '10px',
                            cursor: 'pointer',
                          }}
                        >
                          <Typography
                            style={{
                              fontWeight: '200',
                              fontSize: '0.9rem',
                              lineHeight: '1.5',
                              textAlign: 'left',
                              margin: '10px 0px',
                              color: '#0562FB',
                            }}
                          >
                            View Sent Cart
                          </Typography>
                        </div>
                      </SoftBox>
                    </SoftBox>
                  </div>
                  <SoftBox className="message-preview-inner" style={{ width: '200px', margin: '5px' }}>
                    <Typography
                      style={{
                        fontSize: '0.9rem',
                        lineHeight: '1.5',
                        textAlign: 'left',
                        // margin: '10px 0px',
                        fontWeight: '200',
                      }}
                    >
                      {paymentTemplate?.bodyText ? (
                        <StyledTextComponent bodyText={paymentTemplate?.bodyText} />
                      ) : (
                        'Hey thanks for purchasing. Since we are accepting COD only, you need to confirm this order before we start processing.'
                      )}
                    </Typography>

                    <p className="message-preview-time">{currentTime}</p>
                    <SoftBox style={{ cursor: 'pointer' }} onClick={() => setPaymentConfirm(true)}>
                      <hr />
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          // marginTop: '10px',
                          gap: '10px',
                        }}
                      >
                        <Typography
                          style={{
                            fontWeight: '200',
                            fontSize: '0.9rem',
                            lineHeight: '1.5',
                            textAlign: 'left',
                            // margin: '10px 0px',
                            color: '#0562FB',
                          }}
                        >
                          {paymentTemplate?.buttonText ? paymentTemplate?.buttonText : 'Confirm'}
                        </Typography>
                      </div>
                    </SoftBox>
                  </SoftBox>
                </>
              )}
              {paymentConfirm && (
                <>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <SoftBox
                      className="message-preview-inner"
                      style={{ width: '200px', margin: '5px', background: '#E2FFC9!important' }}
                    >
                      <Typography
                        style={{
                          fontSize: '0.9rem',
                          lineHeight: '1.5',
                          textAlign: 'left',
                          // margin: '10px 0px',
                          fontWeight: '200',
                        }}
                      >
                        Confirm
                      </Typography>

                      <p className="message-preview-time">{currentTime}</p>
                    </SoftBox>
                  </div>
                  <SoftBox
                    className="message-preview-inner"
                    style={{ width: '200px', margin: '5px', background: '#E2FFC9!important' }}
                  >
                    <Typography
                      style={{
                        fontSize: '0.9rem',
                        lineHeight: '1.5',
                        textAlign: 'left',
                        // margin: '10px 0px',
                        fontWeight: '200',
                      }}
                    >
                      Great News!🥳 We've recieved your order XYZ of Rs. 123. Sit back and relax!
                    </Typography>

                    <p className="message-preview-time">{currentTime}</p>
                  </SoftBox>
                </>
              )}
            </SoftBox>
            <SoftBox
              style={{
                border: '1px solid #e3e3e3',
                borderRadius: '5px',
                padding: '5px',
                display: 'flex',
                background: '#FFF',
              }}
            >
              <SoftInput
                placeholder="Write a message..."
                style={{ border: 'none', marginBottom: '5px' }}
                onChange={(e) => setMobileText(e.target.value)}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '5px', alignItems: 'center' }}>
                <AttachFileIcon />
                <SendIcon onClick={() => setHiText(true)} />
              </div>
            </SoftBox>
          </>
        )}
        {showAddress && (
          <>
            <SoftBox
              style={{
                background: '#fff',
                display: 'flex',
                borderBottom: '1px solid #e3e3e3',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 2px',
              }}
            >
              <KeyboardBackspaceIcon sx={{ cursor: 'pointer' }} onClick={() => setShowAddress(false)} />
              <Typography
                style={{
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  lineHeight: '1.5',
                  color: '#1a1f36',
                  textAlign: 'left',
                  marginTop: '5px',
                }}
              >
                Provide Address
              </Typography>
            </SoftBox>
            <SoftBox style={{ height: '57vh', overflowY: 'auto', background: '#fff', padding: '5px' }}>
              <Typography
                style={{
                  fontWeight: '200',
                  fontSize: '0.8rem',
                  lineHeight: '1.5',
                  color: '#1a1f36',
                  textAlign: 'left',
                  marginTop: '5px',
                  marginBottom: '10px',
                }}
              >
                Contact Details
              </Typography>
              <SoftBox>
                <Typography
                  style={{
                    fontWeight: '200',
                    fontSize: '0.7rem',
                    lineHeight: '1.5',
                    color: '#1a1f36',
                    textAlign: 'left',
                    marginTop: '5px',
                  }}
                >
                  Name
                </Typography>
                <SoftInput onChange={(e) => setAddress({ ...address, name: e.target.value })} />
              </SoftBox>
              <SoftBox>
                <Typography
                  style={{
                    fontWeight: '200',
                    fontSize: '0.7rem',
                    lineHeight: '1.5',
                    color: '#1a1f36',
                    textAlign: 'left',
                    marginTop: '5px',
                  }}
                >
                  Phone Number
                </Typography>
                <SoftInput onChange={(e) => setAddress({ ...address, number: e.target.value })} />
              </SoftBox>
              <Typography
                style={{
                  fontWeight: '200',
                  fontSize: '0.8rem',
                  lineHeight: '1.5',
                  color: '#1a1f36',
                  textAlign: 'left',
                  marginTop: '5px',
                  marginBottom: '10px',
                }}
              >
                Address Details
              </Typography>
              <SoftBox>
                <Typography
                  style={{
                    fontWeight: '200',
                    fontSize: '0.7rem',
                    lineHeight: '1.5',
                    color: '#1a1f36',
                    textAlign: 'left',
                    marginTop: '5px',
                  }}
                >
                  Pincode
                </Typography>
                <SoftInput onChange={(e) => setAddress({ ...address, pincode: e.target.value })} />
              </SoftBox>
              <SoftBox>
                <Typography
                  style={{
                    fontWeight: '200',
                    fontSize: '0.7rem',
                    lineHeight: '1.5',
                    color: '#1a1f36',
                    textAlign: 'left',
                    marginTop: '5px',
                  }}
                >
                  Address
                </Typography>
                <SoftInput onChange={(e) => setAddress({ ...address, address: e.target.value })} />
              </SoftBox>
              <SoftBox>
                <Typography
                  style={{
                    fontWeight: '200',
                    fontSize: '0.7rem',
                    lineHeight: '1.5',
                    color: '#1a1f36',
                    textAlign: 'left',
                    marginTop: '5px',
                  }}
                >
                  Landmark/Area
                </Typography>
                <SoftInput onChange={(e) => setAddress({ ...address, landmark: e.target.value })} />
              </SoftBox>
              <SoftBox>
                <Typography
                  style={{
                    fontWeight: '200',
                    fontSize: '0.7rem',
                    lineHeight: '1.5',
                    color: '#1a1f36',
                    textAlign: 'left',
                    marginTop: '5px',
                  }}
                >
                  Flat/ House Number (Optional)
                </Typography>
                <SoftInput onChange={(e) => setAddress({ ...address, flat: e.target.value })} />
              </SoftBox>
              <SoftBox>
                <Typography
                  style={{
                    fontWeight: '200',
                    fontSize: '0.7rem',
                    lineHeight: '1.5',
                    color: '#1a1f36',
                    textAlign: 'left',
                    marginTop: '5px',
                  }}
                >
                  Floor Number (Optional)
                </Typography>
                <SoftInput onChange={(e) => setAddress({ ...address, floor: e.target.value })} />
              </SoftBox>
              <SoftBox>
                <Typography
                  style={{
                    fontWeight: '200',
                    fontSize: '0.7rem',
                    lineHeight: '1.5',
                    color: '#1a1f36',
                    textAlign: 'left',
                    marginTop: '5px',
                  }}
                >
                  Tower Number (Optional)
                </Typography>
                <SoftInput onChange={(e) => setAddress({ ...address, tower: e.target.value })} />
              </SoftBox>
              <SoftBox>
                <Typography
                  style={{
                    fontWeight: '200',
                    fontSize: '0.7rem',
                    lineHeight: '1.5',
                    color: '#1a1f36',
                    textAlign: 'left',
                    marginTop: '5px',
                  }}
                >
                  Building /Apartment Name (Optional)
                </Typography>
                <SoftInput onChange={(e) => setAddress({ ...address, building: e.target.value })} />
              </SoftBox>
              <SoftBox>
                <Typography
                  style={{
                    fontWeight: '200',
                    fontSize: '0.7rem',
                    lineHeight: '1.5',
                    color: '#1a1f36',
                    textAlign: 'left',
                    marginTop: '5px',
                  }}
                >
                  City
                </Typography>
                <SoftInput onChange={(e) => setAddress({ ...address, city: e.target.value })} />
              </SoftBox>
              <SoftBox>
                <Typography
                  style={{
                    fontWeight: '200',
                    fontSize: '0.7rem',
                    lineHeight: '1.5',
                    color: '#1a1f36',
                    textAlign: 'left',
                    marginTop: '5px',
                  }}
                >
                  State
                </Typography>
                <SoftInput onChange={(e) => setAddress({ ...address, state: e.target.value })} />
              </SoftBox>
            </SoftBox>
            <SoftBox
              style={{
                border: '1px solid #e3e3e3',
                borderRadius: '5px',
                padding: '5px',
                display: 'flex',
                background: '#FFF',
                justifyContent: 'center',
              }}
            >
              <SoftButton className="vendor-add-btn" onClick={handleSendAddress}>
                Send Address
              </SoftButton>
            </SoftBox>
          </>
        )}
        {catalogShow && (
          <>
            <SoftBox
              style={{
                background: '#fff',
                display: 'flex',
                borderBottom: '1px solid #e3e3e3',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 2px',
              }}
            >
              <KeyboardBackspaceIcon sx={{ cursor: 'pointer' }} onClick={() => setCatalogShow(false)} />
              <Typography
                style={{
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  lineHeight: '1.5',
                  color: '#1a1f36',
                  textAlign: 'left',
                  marginTop: '5px',
                }}
              >
                Catalogue
              </Typography>
            </SoftBox>
            <SoftBox
              style={{
                height: cartItems.length !== 0 ? '57vh' : '66vh',
                overflowY: 'auto',
                background: '#fff',
                padding: '5px',
              }}
            >
              <SoftBox
                // className="catalogue-background-img"
                style={{
                  height: '30%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundImage: data?.logo === null ? `url(${newLogo})` : `url(${data?.logo})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                  position: 'relative',
                }}
              >
                <div className="blur">
                  <Typography
                    style={{
                      fontWeight: '600',
                      fontSize: '1rem',
                      lineHeight: '1.5',
                      color: '#1a1f36',
                      textAlign: 'center',
                    }}
                  >
                    {orgName}
                  </Typography>
                  <Typography
                    style={{
                      fontWeight: '200',
                      fontSize: '0.8rem',
                      lineHeight: '1.5',
                      color: '#1a1f36',
                      textAlign: 'center',
                    }}
                  >
                    Retail chain offering vast selection of fresh produce fruits and vegetables, pantry staples,
                    gourmets, world foods..
                  </Typography>
                </div>
              </SoftBox>
              <SoftBox style={{ marginTop: '5px' }}>
                {catalogProducts.map((item) => {
                  const cartItem = cartItems.find((cartItem) => cartItem.id === item.id) || { quantity: 0 };
                  return (
                    <div
                      style={{
                        display: 'flex',
                        gap: '10px',
                        cursor: 'pointer',
                        marginTop: '10px',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <div className="catalog-product-preview-image-box" onClick={() => handleSingleProduct(item.id)}>
                        <img src={item.image} style={{ width: '40px', height: '40px' }} />
                      </div>
                      <div onClick={() => handleSingleProduct(item.id)}>
                        <Typography
                          style={{
                            fontWeight: '600',
                            fontSize: '0.8rem',
                            lineHeight: '1.5',
                            color: '#1a1f36',
                            textAlign: 'left',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            width: '100%',
                            height: '20px',
                          }}
                        >
                          {item.title}
                        </Typography>
                        <Typography
                          style={{
                            fontWeight: '200',
                            fontSize: '0.7rem',
                            lineHeight: '1.5',
                            color: '#1a1f36',
                            textAlign: 'left',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            width: '100%',
                            height: '20px',
                          }}
                        >
                          {item.desc}
                        </Typography>
                        <Typography
                          style={{
                            fontWeight: '200',
                            fontSize: '0.7rem',
                            lineHeight: '1.5',
                            color: '#1a1f36',
                            textAlign: 'left',
                          }}
                        >
                          US${item.price}
                        </Typography>
                      </div>
                      <div>
                        {cartItem.quantity > 0 ? (
                          <div
                            style={{
                              padding: '5px',
                              borderRadius: '5px',
                              background: '#E3E4E6',
                              display: 'flex',
                              alignItems: 'center',
                            }}
                          >
                            <AddIcon sx={{ fontSize: '15px' }} onClick={() => handleAddToCart(item)} />
                            {cartItem.quantity}
                            <RemoveIcon sx={{ fontSize: '15px' }} onClick={() => handleDeleteItem(item)} />
                          </div>
                        ) : (
                          <div
                            style={{ padding: '5px', borderRadius: '5px', background: '#E3E4E6' }}
                            onClick={() => handleAddToCart(item)}
                          >
                            <AddIcon />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </SoftBox>
            </SoftBox>
            {cartItems.length !== 0 && (
              <SoftBox
                style={{
                  border: '1px solid #e3e3e3',
                  borderRadius: '5px',
                  padding: '5px',
                  display: 'flex',
                  background: '#FFF',
                  justifyContent: 'center',
                }}
              >
                <SoftButton
                  className="vendor-add-btn"
                  onClick={() => {
                    setOpenCart(true), setCatalogShow(false);
                  }}
                >
                  View Cart {cartItems.length}
                </SoftButton>
              </SoftBox>
            )}
          </>
        )}
        {singleProductDisplay && (
          <>
            <SoftBox
              style={{
                background: '#fff',
                display: 'flex',
                borderBottom: '1px solid #e3e3e3',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 2px',
              }}
            >
              <KeyboardBackspaceIcon
                sx={{ cursor: 'pointer' }}
                onClick={() => {
                  setSingleProductDisplay(false), setCatalogShow(true);
                }}
              />
            </SoftBox>
            <SoftBox style={{ height: '59vh', overflowY: 'auto', background: '#fff', padding: '5px' }}>
              {toShowProduct.map((item) => {
                return (
                  <div>
                    <div style={{ width: '100%', height: '30vh' }}>
                      <img src={item.image} style={{ width: '100%', height: '30vh' }} />
                    </div>
                    <Typography
                      style={{
                        fontWeight: '600',
                        fontSize: '1rem',
                        lineHeight: '1.5',
                        color: '#1a1f36',
                        textAlign: 'left',
                        marginTop: '10px',
                      }}
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      style={{
                        fontWeight: '200',
                        fontSize: '1rem',
                        lineHeight: '1.5',
                        color: '#1a1f36',
                        textAlign: 'left',
                        marginTop: '10px',
                      }}
                    >
                      US${item.price}
                    </Typography>
                    <Typography
                      style={{
                        fontWeight: '200',
                        fontSize: '0.9rem',
                        lineHeight: '1.5',
                        color: '#1a1f36',
                        textAlign: 'left',
                        marginTop: '20px',
                      }}
                    >
                      {item.desc}
                    </Typography>
                    <Typography
                      style={{
                        fontWeight: '200',
                        fontSize: '0.9rem',
                        lineHeight: '1.5',
                        color: '#1a1f36',
                        textAlign: 'left',
                        marginTop: '10px',
                      }}
                    >
                      <a href={'https://www.twinleaves.co/'}>https://www.twinleaves.co/</a>
                    </Typography>
                  </div>
                );
              })}
            </SoftBox>
            <SoftBox
              style={{
                border: '1px solid #e3e3e3',
                borderRadius: '5px',
                padding: '5px',
                display: 'flex',
                background: '#FFF',
                justifyContent: 'center',
              }}
            >
              <SoftButton className="vendor-add-btn">Add to cart</SoftButton>
            </SoftBox>
          </>
        )}
        {openCart && (
          <>
            <SoftBox
              style={{
                background: '#fff',
                display: 'flex',
                borderBottom: '1px solid #e3e3e3',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 2px',
              }}
            >
              <CloseIcon sx={{ cursor: 'pointer' }} onClick={() => setOpenCart(false)} />
              <Typography
                style={{
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  lineHeight: '1.5',
                  color: '#1a1f36',
                  textAlign: 'left',
                  marginTop: '5px',
                }}
              >
                Your Cart
              </Typography>
            </SoftBox>
            <SoftBox style={{ height: '39vh', overflowY: 'auto', background: '#fff', padding: '5px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography
                  style={{
                    fontWeight: '600',
                    fontSize: '0.8rem',
                    lineHeight: '1.5',
                    color: '#1a1f36',
                    textAlign: 'left',
                    marginTop: '5px',
                  }}
                >
                  {cartItems.length} items
                </Typography>
                <SoftButton
                  className="vendor-second-btn"
                  onClick={() => {
                    setCatalogShow(true), setOpenCart(false);
                  }}
                >
                  Add More
                </SoftButton>
              </div>
              {cartItems.map((item) => {
                const cartItem = cartItems.find((cartItem) => cartItem.id === item.id) || { quantity: 0 };
                return (
                  <div
                    style={{
                      display: 'flex',
                      gap: '10px',
                      cursor: 'pointer',
                      marginTop: '10px',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <div className="catalog-product-preview-image-box">
                      <img src={item.image} style={{ width: '40px', height: '40px' }} />
                    </div>
                    <div>
                      <Typography
                        style={{
                          fontWeight: '600',
                          fontSize: '0.8rem',
                          lineHeight: '1.5',
                          color: '#1a1f36',
                          textAlign: 'left',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          width: '80%',
                          height: '20px',
                        }}
                      >
                        {item.title}
                      </Typography>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', gap: '5px' }}>
                          {/* <div
                            style={{ padding: '5px', borderRadius: '5px', background: '#E3E4E6' }}
                            onClick={(item) => handleAddToCart(item)}
                          >
                            <IoIosAdd />
                          </div> */}
                          <Typography
                            style={{
                              fontWeight: '200',
                              fontSize: '0.8rem',
                              lineHeight: '1.5',
                              color: '#1a1f36',
                              textAlign: 'left',
                            }}
                          >
                            Quantity: {item.quantity}
                          </Typography>
                          {/* <div
                            style={{ padding: '5px', borderRadius: '5px', background: '#E3E4E6' }}
                            onClick={(item) => handleDeleteItem(item)}
                          >
                            <FaMinus />
                          </div> */}
                        </div>
                        <Typography
                          style={{
                            fontWeight: '200',
                            fontSize: '0.8rem',
                            lineHeight: '1.5',
                            color: '#1a1f36',
                            textAlign: 'left',
                          }}
                        >
                          US${item.price}
                        </Typography>
                      </div>
                    </div>
                  </div>
                );
              })}
            </SoftBox>
            <SoftBox
              style={{
                border: '1px solid #e3e3e3',
                borderRadius: '5px',
                padding: '5px',
                display: 'flex',
                background: '#FFF',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography
                  style={{
                    fontWeight: '600',
                    fontSize: '0.8rem',
                    lineHeight: '1.5',
                    color: '#1a1f36',
                    textAlign: 'left',
                    marginTop: '5px',
                  }}
                >
                  Subtotal
                </Typography>
                <Typography
                  style={{
                    fontWeight: '200',
                    fontSize: '0.8rem',
                    lineHeight: '1.5',
                    color: '#1a1f36',
                    textAlign: 'left',
                    marginTop: '5px',
                  }}
                >
                  US${totalCartPrice}
                </Typography>
              </div>
              <Typography
                style={{
                  fontWeight: '200',
                  fontSize: '0.7rem',
                  lineHeight: '1.5',
                  color: '#1a1f36',
                  textAlign: 'left',
                  marginTop: '5px',
                  marginBottom: '10px',
                }}
              >
                By continuing, you agree to share your cart, profile name and phone number with the business so it can
                confirm your order and total price, including any tax, fees and discounts.
              </Typography>
              <SoftButton className="vendor-add-btn" onClick={handlePlaceOrder}>
                Place Order
              </SoftButton>
            </SoftBox>
          </>
        )}
        {previewCart && (
          <>
            <SoftBox
              style={{
                background: '#fff',
                display: 'flex',
                borderBottom: '1px solid #e3e3e3',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 2px',
              }}
            >
              <CloseIcon sx={{ cursor: 'pointer' }} onClick={() => setPreviewCart(false)} />
              <Typography
                style={{
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  lineHeight: '1.5',
                  color: '#1a1f36',
                  textAlign: 'left',
                  marginTop: '5px',
                }}
              >
                Your sent Cart
              </Typography>
            </SoftBox>
            <SoftBox style={{ height: '66vh', overflowY: 'auto', background: '#fff', padding: '5px' }}>
              <div>
                <Typography
                  style={{
                    fontWeight: '600',
                    fontSize: '0.8rem',
                    lineHeight: '1.5',
                    color: '#1a1f36',
                    textAlign: 'left',
                    marginTop: '5px',
                  }}
                >
                  {cartItems.length} items
                </Typography>
                <Typography
                  style={{
                    fontWeight: '200',
                    fontSize: '0.7rem',
                    lineHeight: '1.5',
                    color: '#1a1f36',
                    textAlign: 'left',
                    marginTop: '5px',
                  }}
                >
                  US${totalCartPrice} (estimated)
                </Typography>
              </div>
              {cartItems.map((item) => {
                const cartItem = cartItems.find((cartItem) => cartItem.id === item.id) || { quantity: 0 };
                return (
                  <div
                    style={{
                      display: 'flex',
                      gap: '10px',
                      cursor: 'pointer',
                      marginTop: '10px',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <div className="catalog-product-preview-image-box">
                      <img src={item.image} style={{ width: '40px', height: '40px' }} />
                    </div>
                    <div>
                      <Typography
                        style={{
                          fontWeight: '600',
                          fontSize: '0.8rem',
                          lineHeight: '1.5',
                          color: '#1a1f36',
                          textAlign: 'left',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          width: '80%',
                          height: '20px',
                        }}
                      >
                        {item.title}
                      </Typography>
                      <Typography
                        style={{
                          fontWeight: '200',
                          fontSize: '0.7rem',
                          lineHeight: '1.5',
                          color: '#1a1f36',
                          textAlign: 'left',
                          marginTop: '5px',
                        }}
                      >
                        US${item.price}. Quantity {item.quantity}
                      </Typography>
                    </div>
                  </div>
                );
              })}
            </SoftBox>
          </>
        )}
      </SoftBox>
    </div>
  );
};

export default BusinessMobilePreview;
