import AttachFileIcon from '@mui/icons-material/AttachFile';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Box, Grid, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import SoftBox from '../../../../../components/SoftBox';
import SoftButton from '../../../../../components/SoftButton';
import SoftInput from '../../../../../components/SoftInput';
import { getCustomerDetails, getOrgNameLogo, whatsappBusinessCatalogDetails } from '../../../../../config/Services';
import PageLayout from '../../../../../examples/LayoutContainers/PageLayout';
import BusinessMobilePreview from './BusinessMobilePreview';

const WorkFlowPreview = () => {
  const [currentTime, setCurrentTime] = useState('');
  const [showAddress, setShowAddress] = useState(false);
  const [addressMsg, setAddressMsg] = useState(false);
  const [address, setAddress] = useState({
    name: '',
    number: '',
    pincode: '',
    address: '',
    landmark: '',
    flat: '',
    floor: '',
    tower: '',
    building: '',
    city: '',
    state: '',
  });
  const [catalogShow, setCatalogShow] = useState(false);
  const [newLogo, setNewLogo] = useState(null);
  const [datState, setDatState] = useState(false);
  const [data, setData] = useState({});
  const [placeOrder, setPlaceOrder] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [totalCartPrice, setTotalCartPrice] = useState();
  const [previewCart, setPreviewCart] = useState(false);
  const [welcomeTemplate, setWelcomeTemplate] = useState();
  const [addressTemplate, setAddressTemplate] = useState();
  const [catalogTemplate, setCatalogTemplate] = useState();
  const [paymentTemplate, setPaymentTemplate] = useState();
  const [servTemplate, setServTemplate] = useState();
  const [mobileText, setMobileText] = useState('');
  const [hiText, setHiText] = useState(false);
  const [paymentConfirm, setPaymentConfirm] = useState(false);

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

  const generateLogo = (brandName) => {
    const firstLetter = brandName ? brandName.charAt(0).toUpperCase() : '';

    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');

    // Make the canvas transparent
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Change the font family and size here
    const fontFamily = 'Arial'; // Replace with your desired font family
    const fontSize = 86;
    const font = `bold ${fontSize}px ${fontFamily}, sans-serif`;

    ctx.font = font;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Set the color of the text
    ctx.fillStyle = '#ffffff'; // Replace with your desired text color

    // Calculate the coordinates to center the text in the canvas
    const x = canvas.width / 2;
    const y = canvas.height / 2;

    // Draw the first letter at the center of the canvas
    ctx.fillText(firstLetter, x, y);

    // Convert canvas content to an image URL (data URI)
    const logoDataURL = canvas.toDataURL();
    return logoDataURL;
  };

  useEffect(() => {
    if (contextType === 'WMS') {
      getOrgNameLogo(orgId).then((response) => {
        setData(response?.data?.data);
        // localStorage.setItem('data', JSON.stringify(response?.data?.data));
        if (response?.data?.data?.logoUrl === null) {
          const generatedLogo = generateLogo(response?.data?.data?.organisationName);
          setNewLogo(generatedLogo);
        }
        setDatState(true);
      });
    } else if (contextType === 'RETAIL') {
      getCustomerDetails(orgId).then((response) => {
        setData(response?.data?.data?.retail);
        // localStorage.setItem('data', JSON.stringify(response?.data?.data?.retail));
        if (response?.data?.data?.retail?.logo === null) {
          const generatedLogo = generateLogo(response?.data?.data?.retail?.displayName);
          setNewLogo(generatedLogo);
        }
      });
    }
    // else if (contextType === 'VMS') {
    //   getCustomerDetails(orgId).then((response) => {
    //     setData(response.data.data.retail);
    //   });

    // }
  }, [datState]);

  const orgName = localStorage.getItem('orgName');
  const orgId = localStorage.getItem('orgId');
  const contextType = localStorage.getItem('contextType');

  const catalogProducts = [
    {
      id: 1,
      image: 'https://storage.googleapis.com/twinleaves_bucket/FrontEnd/Pallet_images/coco-bar-1.jpg',
      title: 'Mamaearth soft coco bathing bar',
      desc: "Introducing Mamaearth's range of baby products. This is the bathing soap with coconut oil and turmeric. It has mild and gentle formula free from toxins, which is gentle on your baby's skin and turmeric has healing properties which are not harmful for the baby.",
      price: 14.0,
    },
    {
      id: 2,
      image: 'https://storage.googleapis.com/twinleaves_bucket/FrontEnd/Pallet_images/51YVvIbrhQL._SL1000_.jpg',
      title: 'Britannia Gobbles Cake pineapple plunge',
      desc: 'Britannia Pineapple Cake has soft and delicious cake slices with the goodness of pineapple, milk and eggs. With the best all-natural ingredients, each bite gives mouth-watering flavour. Britannia Cakes have soft spongy and fluffy slices that deliciously melts in your mouth.',
      price: 5.0,
    },
    {
      id: 3,
      image: 'https://storage.googleapis.com/twinleaves_bucket/FrontEnd/Pallet_images/61B8Hqpw2%2BL._SL1500_.jpg',
      title: 'Britannia Goodday Butter Cookies',
      desc: "India's original cookie, Britannia Good Day has been a popular favourite since 1986. These crunchy, buttery cookies are abundantly loaded with delectable ingredients - from cashews, almonds and pistachios to chocolatey delights. Make every day special with the wholesome Britannia Good Day cookies!",
      price: 15.0,
    },
    {
      id: 4,
      image:
        'https://storage.googleapis.com/twinleaves_bucket/FrontEnd/Pallet_images/189220_5-act-ii-instant-popcorn-classic-salted-hot-fresh-delicious.jpg',
      title: 'Act 2 popcorn Classic Salted',
      desc: 'Made with 100 % whole grain, enjoy a bag of delicious Act II Classic Salted Popcorn. Pop a bag of the Act II Classic Salted Popcorn for a healthy and flavorful snack on movie night or when you want a tasty treat. Popping Corn, Edible Vegetable Oil And Iodized Salt. Store in a cool and dry place.',
      price: 8.0,
    },
    {
      id: 5,
      image:
        'https://storage.googleapis.com/twinleaves_bucket/FrontEnd/Pallet_images/413587-2_10-lizol-disinfectant-surface-floor-cleaner-liquid-floral-kills-999-germs.jpg',
      title: 'Lizol Disinfectant surface cleaner Floral',
      desc: 'Give your home 10x better cleaning and germ kill than phenyl & detergents with this specially formulated Lizol Surface Cleaner that now comes in a floral fragrance. Proven to kill 99.9% germs* and viruses˄ like H1N1 & RSV. *As per standard testing protocol.',
      price: 20.0,
    },
    {
      id: 6,
      image:
        'https://storage.googleapis.com/twinleaves_bucket/FrontEnd/Pallet_images/40026357-2_11-britannia-good-day-butter-cookies.jpg',
      title: 'Britannia Goodday Butter Cookies',
      desc: "India's original cookie, Britannia Good Day has been a popular favourite since 1986. These crunchy, buttery cookies are abundantly loaded with delectable ingredients - from cashews, almonds and pistachios to chocolatey delights. Make every day special with the wholesome Britannia Good Day cookies!",
      price: 5.0,
    },
    {
      id: 7,
      image:
        'https://storage.googleapis.com/twinleaves_bucket/FrontEnd/Pallet_images/40145969-2_8-the-laughing-cow-creamy-cheese-triangles.jpg',
      title: 'Britannia Processed Cheese Spread',
      desc: "Britannia The Laughing Cow Cheese Spread- Classic is a creamy cheese spread made with the goodness of cow's milk. Give your foods fresh cheesy finish with Britannia processed cheese spread. Britannia The Laughing Cow Cheese spread has a strong and delicious flavour and its spongy nature makes it easily spreadable.",
      price: 12.0,
    },
    {
      id: 8,
      image:
        'https://storage.googleapis.com/twinleaves_bucket/FrontEnd/Pallet_images/40200297_3-zed-black-agarbatti-zb-3-in-1.jpg',
      title: 'Zed Black Premium Incense Sticks',
      desc: 'Used for everyday purpose, Zed Black sticks are known for their longevity and fantastic aroma. Create a soothing and stress busting aura with these fragrance sticks that are bang for the buck. The fragrance of incense sticks changes our emotions, perception, and moods. Incense sticks can energize, relax, and harmonize.',
      price: 10.0,
    },
    {
      id: 9,
      image:
        'https://storage.googleapis.com/twinleaves_bucket/FrontEnd/Pallet_images/40291115-2_1-britannia-winkin-cow-thick-milkshake-chocolicious-rich-in-calcium.jpg',
      title: 'Britannia Winkin cow Thick Shake Chocolate',
      desc: 'Chocolate flavour released inside this thick milkshake to make every drop of it irresistibly delicious. Pure cow milk makes it a great source of calcium and protein. Pour these flavoured milkshakes in a glass with some ice cubes to give your taste buds a sensational experience.',
      price: 6.0,
    },
    {
      id: 10,
      image:
        'https://storage.googleapis.com/twinleaves_bucket/FrontEnd/Pallet_images/40300920-2_1-yardley-london-daily-wear-perfume-gold-exotic-fragrance.jpg',
      title: 'Yardly London Perfume Gold',
      desc: 'Winners settle for nothing less than Gold. Presenting this timeless fragrance from Yardley London which opens with a richness of mint & rosemary, is interlaced with a vibrant heart of rose & geranium, and is meticulously rounded off with sandalwood, musk, and patchouli base. It is bound to enhance your winning spirit!',
      price: 600.0,
    },
    {
      id: 11,
      image:
        'https://storage.googleapis.com/twinleaves_bucket/FrontEnd/Pallet_images/100012352_10-britannia-nutrichoice-sugar-free-cream-cracker.jpg',
      title: 'Britannia Nutri Choice Sugar free Cracker',
      desc: 'Introducing Britannia NutriChoice Sugar-Free Cream Crackers, the perfect healthy biscuits! Completely sugar-free and made with zero trans fat and no added colors. Enjoy them as a light, crispy accompaniment to your daily tea or pair them with soup, green tea, or cheese.',
      price: 6.0,
    },
    {
      id: 12,
      image:
        'https://storage.googleapis.com/twinleaves_bucket/FrontEnd/Pallet_images/100012372-2_13-britannia-little-hearts-classic-sugar-sprinkled-heart-shaped-biscuits.jpg',
      title: 'Britannia Little Hearts Classic Biscuits',
      desc: 'Britannia Little Hearts Biscuits are little heart-shaped biscuits with a crumbly texture and a sugary centre. The sugar sprinkled goodness gives you mouth-watering flavours and a delicious aftertaste.',
      price: 4.0,
    },
  ];

  const getWelcomedetails = () => {
    const orgId = localStorage.getItem('orgId');
    const locId = localStorage.getItem('locId');
    const catalogId = localStorage.getItem('catalogId');
    const type = 'WELCOME';
    try {
      whatsappBusinessCatalogDetails(orgId, catalogId, type).then((res) => {
        setWelcomeTemplate(res?.data?.data);
      });
    } catch (error) {
      showSnackbar('No template details found', 'error');
    }
  };

  const getCatalogDetails = () => {
    const orgId = localStorage.getItem('orgId');
    const locId = localStorage.getItem('locId');
    const catalogId = localStorage.getItem('catalogId');
    const type = 'CATALOG';
    try {
      whatsappBusinessCatalogDetails(orgId, catalogId, type).then((res) => {
        setCatalogTemplate(res?.data?.data);
      });
    } catch (error) {
      showSnackbar('No template details found', 'error');
    }
  };

  const getPaymentDetails = () => {
    const orgId = localStorage.getItem('orgId');
    const locId = localStorage.getItem('locId');
    const catalogId = localStorage.getItem('catalogId');
    const type = 'PAYMENT';
    try {
      whatsappBusinessCatalogDetails(orgId, catalogId, type).then((res) => {
        setPaymentTemplate(res?.data?.data);
      });
    } catch (error) {
      showSnackbar('No template details found', 'error');
    }
  };

  const getServiceabilityDetails = () => {
    const orgId = localStorage.getItem('orgId');
    const locId = localStorage.getItem('locId');
    const catalogId = localStorage.getItem('catalogId');
    const type = 'NON-SERVICEABLE';
    try {
      whatsappBusinessCatalogDetails(orgId, catalogId, type).then((res) => {
        setServTemplate(res?.data?.data);
      });
    } catch (error) {
      showSnackbar('No template details found', 'error');
    }
  };

  const getAddressDetails = () => {
    const orgId = localStorage.getItem('orgId');
    const locId = localStorage.getItem('locId');
    const catalogId = localStorage.getItem('catalogId');
    const type = 'ADDRESS';
    try {
      whatsappBusinessCatalogDetails(orgId, catalogId, type).then((res) => {
        setAddressTemplate(res?.data?.data);
      });
    } catch (error) {
      showSnackbar('No template details found', 'error');
    }
  };

  useEffect(() => {
    getCatalogDetails();
    getAddressDetails();
    getPaymentDetails();
    getServiceabilityDetails();
    getWelcomedetails();
  }, []);

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
      <PageLayout>
        <div style={{ padding: '20px' }}>
          <Typography style={{ marginTop: '30px' }}>Whatsapp Business Preview</Typography>
          <Box
            className="table-css-fix-box-scroll-vend"
            style={{
              boxShadow: 'rgba(37, 37, 37, 0.126) 0px 5px 50px',
              position: 'relative',
              padding: '20px',
              marginTop: '10px',
            }}
          >
            <Grid container spacing={2}>
              <Grid item lg={8} sm={12} md={12}>
                <div style={{ border: '1px solid #e3e3e3' }}>
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
                  <SoftBox className="wb-message-preview" style={{ height: '50vh', overflowY: 'auto' }}>
                    <SoftBox className="message-preview-inner" style={{ width: '265px', margin: '5px' }}>
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
                      <SoftBox className="message-preview-inner" style={{ width: '265px', margin: '5px' }}>
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
                        <SoftBox className="message-preview-inner" style={{ width: '265px', margin: '5px' }}>
                          <div className="message-preview-top-box">
                            <div className="message-preview-top-img">
                              <img
                                src="https://storage.googleapis.com/twinleaves_bucket/FrontEnd/Pallet_images/coco-bar-1.jpg"
                                alt=""
                                style={{ width: '250%', height: '80px' }}
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
                                View Twinleaves's Catalog on Whatsapp
                              </Typography>

                              <Typography
                                style={{
                                  fontSize: '0.6rem',
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
                              margin: '10px 0px',
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
                              <FormatListBulletedIcon sx={{ color: '#0562FB', fontSize: '14px' }} />
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
                          <SoftBox className="message-preview-inner" style={{ width: '265px', margin: '5px' }}>
                            <div className="message-preview-top-box">
                              <div className="message-preview-top-img">
                                <img
                                  src="https://storage.googleapis.com/twinleaves_bucket/FrontEnd/Pallet_images/coco-bar-1.jpg"
                                  alt=""
                                  style={{ width: '250%', height: '80px' }}
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
                                // margin: '10px 0px',
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
                                    // margin: '10px 0px',
                                    color: '#0562FB',
                                  }}
                                >
                                  View Sent Cart
                                </Typography>
                              </div>
                            </SoftBox>
                          </SoftBox>
                        </div>
                        <SoftBox className="message-preview-inner" style={{ width: '265px', margin: '5px' }}>
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
                          <SoftBox onClick={() => setPaymentConfirm(true)}>
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
                          <SoftBox className="message-preview-inner" style={{ width: '265px', margin: '5px' }}>
                            <Typography
                              style={{
                                fontSize: '0.9rem',
                                lineHeight: '1.5',
                                textAlign: 'left',
                                margin: '10px 0px',
                                fontWeight: '200',
                              }}
                            >
                              Confirm
                            </Typography>

                            <p className="message-preview-time">{currentTime}</p>
                          </SoftBox>
                        </div>
                        <SoftBox className="message-preview-inner" style={{ width: '265px', margin: '5px' }}>
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
                  <SoftBox style={{ border: '1px solid #e3e3e3', borderRadius: '5px', padding: '5px' }}>
                    <SoftInput
                      placeholder="Write a message..."
                      style={{ border: 'none', marginBottom: '5px' }}
                      onChange={(e) => setMobileText(e.target.value)}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '5px', alignItems: 'center' }}>
                      <AttachFileIcon />
                      <SoftButton className="vendor-add-btn" onClick={() => setHiText(true)}>
                        Send
                      </SoftButton>
                    </div>
                  </SoftBox>
                </div>
              </Grid>
              <Grid item lg={4} sm={12} md={12}>
                <BusinessMobilePreview
                  setShowAddress={setShowAddress}
                  showAddress={showAddress}
                  addressMsg={addressMsg}
                  setAddressMsg={setAddressMsg}
                  address={address}
                  setAddress={setAddress}
                  catalogShow={catalogShow}
                  setCatalogShow={setCatalogShow}
                  catalogProducts={catalogProducts}
                  data={data}
                  newLogo={newLogo}
                  placeOrder={placeOrder}
                  setPlaceOrder={setPlaceOrder}
                  cartItems={cartItems}
                  setCartItems={setCartItems}
                  totalCartPrice={totalCartPrice}
                  setTotalCartPrice={setTotalCartPrice}
                  previewCart={previewCart}
                  setPreviewCart={setPreviewCart}
                  addressTemplate={addressTemplate}
                  welcomeTemplate={welcomeTemplate}
                  mobileText={mobileText}
                  setMobile={setMobileText}
                  hiText={hiText}
                  setHiText={setHiText}
                  paymentTemplate={paymentTemplate}
                  catalogTemplate={catalogTemplate}
                  setPaymentConfirm={setPaymentConfirm}
                  paymentConfirm={paymentConfirm}
                />
              </Grid>
            </Grid>
          </Box>
        </div>
      </PageLayout>
    </div>
  );
};

export default WorkFlowPreview;
