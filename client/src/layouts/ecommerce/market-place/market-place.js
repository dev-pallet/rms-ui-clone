import '@splidejs/react-splide/css';
// Components
import './market.css';
import {
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  CreateNewSalesCart,
  addItemsToSalesCart,
  categoryFilter,
  checkServiceability,
  deleteDeliveryAddress,
  getAlldeliveryAddress,
  getCategoryList,
  getItemsInfo,
  previewBanner,
  tagFilterdata,
} from '../../../config/Services';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import { buttonStyles } from '../Common/buttonColor';
import { dateFormatter, textFormatter } from '../Common/CommonFunction';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import BrandMarketPlace from './brand-marketPlace';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import DisplayTags from './DisplayTags';
import MuiAlert from '@mui/material/Alert';
import Productshipping from './components/productspage/components/productshipping';
import React, { useEffect, useRef, useState } from 'react';
import SetInterval from '../setinterval';
import Snackbar from '@mui/material/Snackbar';
import SoftBox from '../../../components/SoftBox';
import SoftButton from '../../../components/SoftButton';
import SoftTypography from '../../../components/SoftTypography';
import TextField from '@mui/material/TextField';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Spinner from '../../../components/Spinner';

export const MarketPlace = () => {
  const theme = useTheme();
  const isMD = useMediaQuery('(max-width:950px)');
  const isSM = useMediaQuery('(max-width:550px)');
  const location = useLocation();

  const [category, setCategory] = useState([]);
  const [loader, setLoader] = useState(false);
  const storedpincode = localStorage.getItem('Pincode');
  const [serviceability, setServiceability] = useState(!!storedpincode);
  const [tempTitle, setTempTitle] = useState('');
  const [optionsArray, setOptionsArray] = useState([]);
  const [optArray, setOptArray] = useState([]);
  const [valuegitn, setValuegitn] = useState();
  const [opensnack, setOpensnack] = useState(false);
  const [timelinerror, setTimelineerror] = useState('');
  const [alertmessage, setAlertmessage] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [maxScrollRight, setMaxScrollRight] = useState(0);
  const [currentIndexb, setCurrentIndexb] = useState(0);
  const [maxScrollRightb, setMaxScrollRightb] = useState(0);
  const [editGtin, setEditGtin] = useState('');
  const [tagName, setTagName] = useState('');
  const [createdCategory, setCreatedCategory] = useState({});
  const [filteredCategory, setFilteredCateory] = useState([]);
  const [openDialog, setOpenDialog] = useState(storedpincode ? false : true);
  const [Pincode, setPincode] = useState('');
  const [prevBanner, setPrevBanner] = useState([]);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [delLoader, setDelLoader] = useState(false);

  const handleCloseDialog = () => {
    setOpenDialog(false);
    // document.body.style.overflow = 'auto';
  };

  // useEffect(() => {
  //   if (location.pathname.includes('/products') || location.pathname.includes('/market-place')) {
  //     document.body.style.overflow = 'auto';
  //   }
  // }, [location.pathname]);

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

  // useEffect(() => {
  //   if (containerRef.current) {
  //     const containerWidth = containerRef.current.clientWidth;
  //     const scrollWidth = containerRef.current.scrollWidth;
  //     const maxScrollRightValue = scrollWidth - containerWidth;
  //     setCurrentIndex(containerRef.current.scrollLeft);
  //     setMaxScrollRight(maxScrollRightValue);
  //   }
  // }, []);
  // useEffect(() => {
  //   if (containerRefb.current) {
  //     const containerWidth = containerRefb.current.clientWidth;
  //     const scrollWidth = containerRefb.current.scrollWidth;
  //     const maxScrollRightValue = scrollWidth - containerWidth;
  //     setCurrentIndexb(containerRef.current.scrollLeft);
  //     setMaxScrollRightb(maxScrollRightValue);
  //   }
  // }, []);

  const containerRef = useRef(null);
  const containerRefb = useRef(null);

  const handleScrollLeft = () => {
    containerRef.current.scrollBy({ left: -350, behavior: 'smooth' });
    setCurrentIndex((prevIndex) => prevIndex - 350);
  };

  const handleScrollLeftb = () => {
    containerRefb.current.scrollBy({ left: -350, behavior: 'smooth' });
    setCurrentIndexb((prevIndex) => prevIndex - 350);
  };

  const handleScrollRight = () => {
    containerRef.current.scrollBy({ left: 350, behavior: 'smooth' });
    setCurrentIndex((prevIndex) => prevIndex + 350);
  };
  const handleScrollRightb = () => {
    containerRefb.current.scrollBy({ left: 350, behavior: 'smooth' });
    setCurrentIndexb((prevIndex) => prevIndex + 350);
  };

  // const getCategory = () => {
  //   setLoader(true);
  //   getCategoryList()
  //     .then((res) => {
  //       setCategory(res.data.data);
  //       setLoader(false);
  //     })
  //     .catch((err) => {
  //       setLoader(false);
  //     });
  // };

  const getCategory = () => {
    getCategoryList()
      .then((res) => {
        const d_img = 'https://i.imgur.com/dL4ScuP.png';

        const category = res.data.data;
        const categoryOptions = category?.map((item) => {
          return {
            id: item?.mainCategoryId,
            value: item?.categoryName,
            label: item?.categoryName,
            image: item?.categoryImage || d_img,
          };
        });
        setCategory(categoryOptions);
      })
      .catch((err) => {});
  };
  useEffect(() => {
    const payload = {
      page: 1,
      pageSize: 10,
      sourceId: [orgId],
      sourceLocationId: [locId],

      sort: {
        creationDateSortOption: 'DESC',
        tagPriority: 'DESC',
      },
    };
    categoryFilter(payload)
      .then((res) => {
        setCreatedCategory(res?.data?.data?.data?.data[0]);
        // navigate('/pallet-hyperlocal/customize/categories/preview');
      })
      .catch((err) => {});
  }, []);

  useEffect(() => {
    if (createdCategory || category) {
      const filteredCategory = category?.filter((categoryItem) => {
        const matchingCreatedCategory = createdCategory?.categoryData?.find((createdCategoryItem) => {
          return createdCategoryItem.categoryId === categoryItem.id;
        });

        return matchingCreatedCategory !== undefined;
      });
      setFilteredCateory(filteredCategory);
    }
  }, [createdCategory, category]);
  useEffect(() => {
    getCategory();
    if (!cartID) {
      newSalesCart();
    }
  }, []);

  // useEffect(() => {
  //   const savedpincode = localStorage.getItem('pincode')
  //   setPincode(savedpincode)
  //   if (savedpincode.length === 6) {
  //     setOpenDialog(false);
  //     handlePincode(savedpincode)

  //   }

  // }, []);

  const [isAPIInProgress, setIsAPIInProgress] = useState(false);

  const handlePincode = (e) => {
    const pincode = e;
    const newValue = storedpincode ? storedpincode : e;

    if (newValue?.length === 6) {
      checkServiceability(newValue).then((res) => {
        if (res.data.data.message === 'PINCODE_NOT_SERVICEABLE') {
          setAlertmessage('Pincode not serviceable, add another Pincode');
          setTimelineerror('error');
          SetInterval(handleopensnack());
          setOpenDialog(true);
        } else {
          setAlertmessage('Pincode serviceable');
          setTimelineerror('success');
          SetInterval(handleopensnack());
          setServiceability(true);
          handleCloseDialog();
          localStorage.setItem('Pincode', e);
        }
      });
    }
  };

  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const contextType = localStorage.getItem('contextType');
  const userName = localStorage.getItem('user_name');
  const user_details = JSON.parse(localStorage.getItem('user_details'));
  const uidx = user_details.uidx;
  const mobileNumber = user_details.mobileNumber;
  const cartID = localStorage.getItem('cartId-MP');
  const sourceApp = localStorage.getItem('sourceApp');
  const [tagRowData, settagRowData] = useState([]);

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
        })
        .catch((err) => {
          setLoader(false);
        });
    }
  };

  useEffect(() => {
    const options = [];
    optionsArray?.map((ele) => {
      options?.push({ label: ele.name, gtin: ele.gtin });
    });
    setOptArray(options);
  }, [optionsArray]);

  useEffect(() => {
    if (tempTitle?.length >= 1 && !serviceability) {
      setAlertmessage('Enter serviceable pincode');

      setTimelineerror('error');
      SetInterval(handleopensnack());
    }
    if (tempTitle?.length > 2) {
      if (serviceability) {
        const payload = {
          page: '1',
          pageSize: '20',
          marketPlaceProducts: true,
          names: [tempTitle],
          supportedStore: [locId],
        };
        getItemsInfo(payload).then((response) => {
          setOptionsArray(response.data.data.products);
        });
      } else {
        setAlertmessage('Enter serviceable pincode');
        setTimelineerror('error');
        SetInterval(handleopensnack());
      }
    }
  }, [tempTitle]);

  const navigate = useNavigate();
  const handleproductGo = (id) => {
    if (serviceability) {
      navigate(`/market-place/${id}`);
    } else {
      setAlertmessage('Enter serviceable pincode');
      setOpenDialog(true);

      setTimelineerror('error');
      SetInterval(handleopensnack());
    }
  };

  const navigateToDetailsPage = (e, gtin) => {
    if (gtin) {
      navigate(`/market-place/products/details/${gtin}`);
    }
  };
  const gradientStyle = {
    background: 'linear-gradient(45deg, #E57373, #64B5F6, #81C784)',
    borderRadius: '15px',
    padding: '20px',
    height: '160px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  };

  useEffect(() => {
    const payload = {
      page: '1',
      pageSize: '10',

      orgIds: [orgId],
      locationIds: [locId],

      sort: {
        creationDateSortOption: 'DESC',
        tagPriority: 'DEFAULT',
      },
    };
    tagFilterdata(payload)
      .then((res) => {
        const data = res.data?.data.data.data?.map((e, i) => ({
          id: e?.tagId,
          TagName: textFormatter(e?.tagName),
          Tags: e?.tags[0]?.split('_')?.pop(),
          gtins: e?.gtins,
          Createdat: e?.createdAt ? dateFormatter(e?.createdAt) : 'NA',
          Status: e?.status || 'ACTIVE',
          buttons: '',
        }));
        settagRowData(data);
      })
      .catch((err) => {});
  }, []);
  // making the other iamages as grayscale, when hovered from brands

  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };
  const brands = [
    'https://i.ibb.co/bNr6pDJ/Twinleaves-no-background.png',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2nu6hy93FEDwYnsCt8Ye2wB_5NmEAyrN_Hg&usqp=CAU',
    'https://static.vecteezy.com/system/resources/previews/019/766/248/original/amul-logo-amul-icon-transparent-logo-free-png.png',
    'https://d1yjjnpx0p53s8.cloudfront.net/styles/logo-thumbnail/s3/062019/himalaya_herbals.png?P.86odC.wbrZoNpuja.FNIzc7XNKugBB&itok=xo-AOKV3',
    'https://images.squarespace-cdn.com/content/v1/570b9bd42fe131a6e20717c2/1591275138853-EFP3ZZM0X6G7IIQXONUE/Tata+Sampann_Packaging_Elephant+Design+6.jpg',
    'https://bisonmart.in/wp-content/uploads/2022/10/71uRt13ppFL._SX569_.jpg',
  ];

  const dealsOftheDayImages = [
    'https://mir-s3-cdn-cf.behance.net/project_modules/hd/e6668037544943.5744302e7769f.jpg',
    'https://www.tatanutrikorner.com/cdn/shop/products/WhatsAppImage2022-05-18at3.40.59PM.jpg?v=1652869185',
    'https://www.adgully.com/img/800/202112/adgully-2021-12-23t134216-125.png.jpg',
  ];

  const [popularProductLeftIconVisibility, setPopularProductLeftIconVisibility] = useState(false);

  //  function to be executed when popular product carousel is scrolled
  const handleScroll = () => {
    const scrollPosition = containerRef.current.scrollLeft;

    if (scrollPosition > 0) {
      setPopularProductLeftIconVisibility(true);
    } else {
      setPopularProductLeftIconVisibility(false);
    }
  };

  const handleNewCart = (ele, index) => {
    console.log(ele);
    addItemsToSalesCart(cartID, ele.gtin, locId)
      .then((res) => {
        console.log(res.data.data.cartProducts);
      })
      .catch((error) => {});
  };

  useEffect(() => {
    const payload = {
      page: 1,
      pageSize: 10,
      // "bannerId": [
      //   "string"
      // ],
      // "bannerName": [
      //   "string"
      // ],
      // "type": [
      //   "string"
      // ],
      sourceId: [orgId],
      sourceLocationId: [locId],
      // "createdBy": [
      //   "string"
      // ],
      listedOn: ['RMS'],
      sort: {
        creationDateSortOption: 'DEFAULT',
        tagPriority: 'DEFAULT',
      },
    };
    previewBanner(payload)
      .then((res) => {
        setPrevBanner(res?.data?.data?.data?.data);
      })
      .catch((err) => {});

    getAlldeliveryAddress(locId)
      .then((res) => {
        setDeliveryAddress(res?.data?.data?.addresses);
      })
      .catch((err) => {
        console.log({ err });
      });
  }, []);

  const handleNavigate = (address) => {
    navigate('/market-place/products/edit/address', { state: { address } });
  };

  const deleteAddress = (id) => {
    setDelLoader(true);
    const payload = {
      addressId: id,
      updatedBy: uidx,
    };
    deleteDeliveryAddress(payload)
      .then((res) => {
        getAlldeliveryAddress(locId)
          .then((res) => {
            setDelLoader(false);
            setDeliveryAddress(res?.data?.data?.addresses);
          })
          .catch((err) => {
            console.log({ err });
          });
      })
      .cathc((err) => {
        console.log(err);
      });
  };
  return (
    <DashboardLayout>
      <DashboardNavbar
        Appsearch={
          <Grid item xs={12} md={4} xl={6} className="banner-box-I">
            <Autocomplete
              // className="search-input"
              disablePortal
              options={optArray}
              getOptionLabel={(option) => {
                if (typeof option === 'string') {
                  return option;
                }
                if (option.inputValue) {
                  return option.inputValue;
                }
                return option.label;
              }}
              onChange={(e, value) => {
                navigateToDetailsPage(e, value.gtin);
              }}
              style={{ width: 250, borderRadius: '10px !important' }}
              freeSolo
              renderInput={(params) => (
                <TextField
                  {...params}
                  onChange={(e) => setTempTitle(e.target.value)}
                  placeholder="Search Products..."
                  style={{ width: '100%', borderRadius: '10px' }}
                  fullWidth
                  variant="outlined"
                  name="itemCode"
                />
              )}
            />
          </Grid>
        }
      />
      <Snackbar open={opensnack} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={timelinerror} sx={{ width: '100%' }}>
          {alertmessage}
        </Alert>
      </Snackbar>
      <Grid className="banner-box">
        <Grid container justifyContent="space-between">
          <Dialog
            open={openDialog}
            //  onClose={handleCloseDialog}
            //          fullWidth
            maxWidth="xs"
          >
            <DialogTitle>Enter Shipping Pincode:</DialogTitle>
            <DialogContent>
              <Grid item xs={12} md={12} xl={12} className="banner-box-I">
                <TextField
                  type="number"
                  placeholder="Enter Pincode"
                  sx={{ width: 275 }}
                  onChange={(e) => handlePincode(e?.target?.value)}
                />
                <Productshipping handlePincode={handlePincode} setOpenDialog={setOpenDialog} />
              </Grid>
            </DialogContent>
            <DialogActions>
              <SoftButton
                variant={buttonStyles.outlinedColor}
                className="outlined-softbutton"
                onClick={handleCloseDialog}
              >
                Close
              </SoftButton>
            </DialogActions>
          </Dialog>
        </Grid>
      </Grid>

      {/* {tagRowData?.map((item , index) => (
  <DisplayTags newSalesCart={newSalesCart} key={index} editGtin={item?.gtins} tagName={item?.TagName} />
))} */}

      {/* carousel */}
      {prevBanner?.length > 0 && (
        <Grid container spacing={2} style={{ marginTop: '20px' }}>
          <Splide
            style={{ width: '100%' }}
            options={{
              padding: '7rem',
              type: 'loop',
              perPage: 1,
              perMove: 1,
              interval: 2500,
              autoplay: true,
              pagination: false,
            }}
            aria-label="My Favorite Images"
          >
            {prevBanner[0]?.bannerImage?.map((item, index) => (
              <SplideSlide style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <img
                  style={{ width: '95%', maxHeight: '250px', borderRadius: '20px', objectFit: 'contain' }}
                  src={item?.image}
                  alt={`Image ${index + 1}`}
                />
              </SplideSlide>
            ))}
          </Splide>
        </Grid>
      )}

      {/* <Grid container spacing={2} style={{ marginTop: '20px' }}>
        <Splide
          style={{ width: '100%' }}
          options={{
            padding: '7rem',
            type: 'loop',
            perPage: 1,
            perMove: 1,
            interval: 2500,
            autoplay: true,
            pagination: false,
          }}
          aria-label="My Favorite Images"
        >
          <SplideSlide style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img
              style={{ width: '95%', borderRadius: '20px', objectFit: 'contain' }}
              src="https://i.ibb.co/s3309WH/image-5.png"
              alt=""
            />
          </SplideSlide>
          <SplideSlide style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img
              style={{ width: '95%', borderRadius: '20px', objectFit: 'contain' }}
              src="https://i.ibb.co/3zPnYmS/image-1.png"
              alt=""
            />
          </SplideSlide>
          <SplideSlide style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img
              style={{ width: '95%', borderRadius: '20px', objectFit: 'contain' }}
              src="https://i.ibb.co/HgjnHGC/image-3.png"
              alt=""
            />
          </SplideSlide>
        </Splide>
      </Grid> */}
      {tagRowData[0] && (
        <DisplayTags newSalesCart={newSalesCart} editGtin={tagRowData[0]?.gtins} tagName={tagRowData[0]?.TagName} />
      )}
      <Card style={{ marginTop: '30px', marginBottom: '30px' }}>
        {deliveryAddress?.length > 0 ? (
          <>
            <div>
              <SoftButton
                sx={{ float: 'right', margin: '1rem' }}
                color="info"
                onClick={() => navigate('/market-place/products/add/address')}
              >
                Add Address
              </SoftButton>
            </div>
            <Typography variant="h4" className="delivery-address-head">
              Available Address
            </Typography>
            <div>
              {delLoader ? (
                <Box p={2}>
                  <Spinner />
                </Box>
              ) : (
                <>
                  {deliveryAddress.map((e) => (
                    <Card key={e?.lattitude} className="delivery-address-card">
                      <Box sx={{ marginLeft: 'auto' }}>
                        <EditIcon className="delivery-edit-icon" onClick={() => handleNavigate(e)} />
                        <DeleteIcon className="delivery-delete-icon" onClick={() => deleteAddress(e?.id)} />
                      </Box>{' '}
                      {/* Add a unique key if available */}
                      <Typography variant="body1" sx={{ fontSize: '0.9rem' }}>
                        {e?.name}
                      </Typography>
                      <Typography variant="body1" sx={{ fontSize: '0.9rem' }}>
                        {e?.mobileNumber}
                      </Typography>
                      <Typography variant="body1" sx={{ fontSize: '0.9rem' }}>
                        {e?.addressLine1}
                      </Typography>
                      <Typography variant="body1" sx={{ fontSize: '0.9rem' }}>
                        {e?.addressLine2}
                      </Typography>
                      <Typography variant="body1" sx={{ fontSize: '0.9rem' }}>
                        {e.city}, {e?.state}, {e?.country}
                      </Typography>
                      <Typography variant="body1" sx={{ fontSize: '0.9rem' }}>
                        {e?.pincode}
                      </Typography>
                      <Typography variant="body1" sx={{ fontSize: '0.9rem' }}>
                        Latitude : {e?.latitude}
                      </Typography>
                      <Typography variant="body1" sx={{ fontSize: '0.9rem' }}>
                        Longitude : {e?.longitude}
                      </Typography>
                    </Card>
                  ))}
                </>
              )}
            </div>
          </>
        ) : (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '150px',
              textAlign: 'center',
            }}
          >
            <SoftBox>
              <SoftTypography>No Address Found</SoftTypography>
              <SoftButton color="info" onClick={() => navigate('/market-place/products/add/address')}>
                Add Address
              </SoftButton>
            </SoftBox>
          </div>
        )}
      </Card>

      <Card style={{ marginTop: '30px', marginBottom: '30px' }}>
        <Box p={2} className="category-box-az">
          <SoftTypography className="category-text">Shop By Category</SoftTypography>
        </Box>
        {/* {loader && <Spinner />} */}
        {filteredCategory?.length > 0 ? (
          <div container spacing={0} className="category-grid-box" style={{ marginTop: '10px' }}>
            {filteredCategory?.map(
              (e) =>
                e.label !== 'All Category' && (
                  <motion.div
                    initial={{ opacity: 0, y: 0, scale: 0.95 }}
                    whileHover={{ y: -5 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.2 }}
                    key={e.id}
                  >
                    <Grid item xs={2}>
                      {/* <Card
                    className="category-card"
                    onClick={() => handleproductGo(e.categoryName)}
                    style={{ border: '20px !important' }}
                  > */}
                      <div className="category-image-container" onClick={() => handleproductGo(e?.label)}>
                        <img className="category-img" src={e?.image} alt="err" />
                      </div>

                      {/* </Card> */}
                      <div>
                        <h3 className="category-title">{e?.label}</h3>
                      </div>
                    </Grid>
                  </motion.div>
                ),
            )}

            {/* <Grid item xs={2}>

            <div className="category-image-container">
              <img
                className="category-img"
                style={{ width: '100px', height: '100px', margin: '17px' }}
                src="https://www.nicepng.com/png/detail/75-755101_paper-bag-yellow-vector-icon-yellow-shopping-bag.png"
                alt=""
              />
            </div>

            <div>
              <h3 className="category-title"> </h3>
            </div>
          </Grid> */}
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '150px',
              textAlign: 'center',
            }}
          >
            <SoftBox>
              <SoftTypography>No Categories found</SoftTypography>
              <SoftButton color="info" onClick={() => navigate('/pallet-hyperlocal/customize/categories/preview')}>
                Add Category
              </SoftButton>
            </SoftBox>
          </div>
        )}
      </Card>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card style={{ height: '150px' }}>
            <img style={{ height: '100%', objectFit: 'fill' }} src="https://i.ibb.co/D5szTgN/image-2.png" alt="" />
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card style={{ height: '150px' }}>
            <img style={{ height: '100%', objectFit: 'fill' }} src="https://i.ibb.co/Q8Gdpqk/image-4.png" alt="" />
          </Card>
        </Grid>
      </Grid>

      {tagRowData[1] && (
        <DisplayTags newSalesCart={newSalesCart} editGtin={tagRowData[1]?.gtins} tagName={tagRowData[1]?.TagName} />
      )}

      {tagRowData[2] && (
        <DisplayTags newSalesCart={newSalesCart} editGtin={tagRowData[2]?.gtins} tagName={tagRowData[2]?.TagName} />
      )}

      {tagRowData[3] && (
        <DisplayTags newSalesCart={newSalesCart} editGtin={tagRowData[3]?.gtins} tagName={tagRowData[3]?.TagName} />
      )}

      <BrandMarketPlace />

      <Grid container spacing={3}>
        {/* carousel */}

        {prevBanner[1] && (
          <Grid item xs={12}>
            <Splide
              style={{ width: '100%' }}
              options={{
                padding: '2rem',
                type: 'loop',
                perPage: 1,
                perMove: 1,
                interval: 3000,
                autoplay: true,
                arrows: false,
                // pagination: false,
              }}
              aria-label="My Favorite Images"
            >
              {prevBanner[1]?.bannerImage?.map((item, index) => (
                <SplideSlide style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <img
                    style={{ height: '200px', width: '70vw', borderRadius: '20px' }}
                    src={item?.image}
                    alt={`Image ${index + 1}`}
                  />
                </SplideSlide>
              ))}
              {/* <SplideSlide style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <img
                style={{ height: '200px', width: '70vw', borderRadius: '20px' }}
                src="https://i.ibb.co/C61Lk90/Turquoise-Simple-Modern-Linkedin-Banner.png"
                alt=""
              />
            </SplideSlide>
            <SplideSlide style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <img
                style={{ height: '200px', width: '70vw', borderRadius: '20px' }}
                src="https://i.ibb.co/MRWxCG2/Shot-1.jpg"
                alt=""
              />
            </SplideSlide> */}
            </Splide>
          </Grid>
        )}
      </Grid>

      {/* <Box p={2} className="category-box-az">
        <SoftTypography className="category-text" >Most Popular</SoftTypography>
      </Box>
      {loader && <Spinner />} */}
    </DashboardLayout>
  );
};
