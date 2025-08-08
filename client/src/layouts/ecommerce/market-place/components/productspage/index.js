import './product-cat.css';
import { CartMarketplace } from './components/cart';
import { Drawer, FormControl, FormControlLabel, Grid, IconButton, Paper, Radio, RadioGroup } from '@mui/material';
import {
  addItemsToSalesCart,
  getAllManufacturer,
  getAllProducts,
  getCartDetails,
  getCategoryList,
  getItemsInfo,
} from '../../../../../config/Services';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import MuiAlert from '@mui/material/Alert';
import NavigateBeforeOutlinedIcon from '@mui/icons-material/NavigateBeforeOutlined';
import NavigateNextOutlinedIcon from '@mui/icons-material/NavigateNextOutlined';
import ProductItemCard from './components/ProductItemCard';
import React from 'react';
import SetInterval from '../../../setinterval';
import SlideCart from './components/SlideCart';
import Snackbar from '@mui/material/Snackbar';
import SoftBox from '../../../../../components/SoftBox';
import SoftInput from '../../../../../components/SoftInput';
import SoftSelect from '../../../../../components/SoftSelect';
import SoftTypography from '../../../../../components/SoftTypography';
import Spinner from '../../../../../components/Spinner';

const SingleProductMarket = () => {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState([]);
  const [loader, setLoader] = useState(false);
  const [catLoader, setCatLoader] = useState(false);
  const [addToCart, setAddToCart] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [page, setPage] = useState(1);
  const [priceValue, setPriceValue] = useState('DEFAULT');
  const [pageLoader, setPageLoader] = useState(false);
  const [optArray, setOptArray] = useState([]);
  const [tempTitle, setTempTitle] = useState('');
  const [brandOption, setBrandOption] = useState([]);
  const [subtotal, setSubtotal] = useState('');
  const [noProd, setNoProd] = useState(false);
  const [cartProducts, setCartProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [selectedItem, setSelectedItem] = useState(id);
  const boxRef = useRef();
  const [addItemThroughParticularCategoryItemLoader, setAddItemThroughParticularCategoryItemLoader] = useState(null);
  const navigate = useNavigate();
  const orgId = localStorage.getItem('orgId');
  const contextType = localStorage.getItem('contextType');
  const [opensnack, setOpensnack] = useState(false);
  const [timelinerror, setTimelineerror] = useState('');
  const [alertmessage, setAlertmessage] = useState('');
  const [openCart, SetOpenCart] = useState('');

  const handleopensnack = () => {
    setOpensnack(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
    } else if (event === 'closeBtn') {
      SetOpenCart(false);
      setOpensnack(false);

      return;
    }
    setOpensnack(false);
  };

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    getCategory();
  }, [selectedItem]);

  const getCategory = () => {
    setCatLoader(true);
    getCategoryList()
      .then((res) => {
        setCategory(res.data.data);
        setCatLoader(false);
      })
      .catch((err) => {
        setCatLoader(false);
      });
  };

  const handleScrollLeft = () => {
    const container = document.querySelector('.scrollable-container');
    container.scrollBy({
      left: -400,
      behavior: 'smooth',
    });
  };

  const handleScrollRight = () => {
    const container = document.querySelector('.scrollable-container');
    container.scrollBy({
      left: 400,
      behavior: 'smooth',
    });
  };

  const handleproductGo = (new_id) => {
    if (id !== new_id) {
      setProducts([]);
      setPage(1);
      setSelectedItem(new_id);

      navigate(`/market-place/${new_id}`);
      // window.location.reload();
    }
  };
  useEffect(() => {
    setLoader(true);
    getProducts();
    allBrand();
  }, [id]);

  const cartArr = [];
  cartProducts.map((item) => {
    cartArr.push(item.gtin);
  });
  useEffect(() => {
    setPageLoader(true);
    getProducts();
  }, [page]);

  const filterObject = {
    page: page,
    pageSize: '20',
    marketPlaceProducts: true,
    names: [],
    brand: [],
    gtin: [],
    companyName: [],
    mainCategory: [id],
    categoryLevel1: [],
    categoryLevel2: [],
    supportedStore: [locId],
    supportedWarehouse: [],
    sort: {
      mrpSortOption: priceValue,
      creationDateSortOption: 'DEFAULT',
    },
  };
  // if (contextType === 'RETAIL') {
  //   filterObject.supportedStore = ['TWINLEAVES',orgId];
  // } else if (contextType === 'WMS'){
  //   filterObject.supportedWarehouse = ['TWINLEAVES', orgId];
  // }

  const getProducts = () => {
    if (page) {
      setPageLoader(true);
    } else {
      setLoader(true);
    }

    if (totalPages.length === 0 || page <= totalPages) {
      getAllProducts(filterObject)
        .then((res) => {
          setTotalPages(res.data.data.totalPages);

          if (page === 1) {
            setProducts(res.data.data.products);
          } else {
            setProducts((prevProducts) => [...prevProducts, ...res.data.data.products]);
          }

          setLoader(false);
          setPageLoader(false);
        })
        .catch((e) => {
          setLoader(false);
        });
    } else {
      setLoader(false);
      setPageLoader(false);
    }
  };

  const locId = localStorage.getItem('locId');
  const cartID = localStorage.getItem('cartId-MP');
  const permissions = JSON.parse(localStorage.getItem('permissions'));

  const handleNewCart = (ele, index) => {
    console.log(ele);
    setAddItemThroughParticularCategoryItemLoader(index);
    addItemsToSalesCart(cartID, ele.gtin, locId)
      .then((res) => {
        setAddToCart(res.data.data.cartProducts);
        SetOpenCart(true);
        setAlertmessage('Product added to cart');
        setTimelineerror('success');
        SetInterval(handleopensnack());
        setAddItemThroughParticularCategoryItemLoader(null);
      })
      .catch((error) => {
        setAlertmessage('Product unavailable');
        setTimelineerror('error');
        SetInterval(handleopensnack());
        setAddItemThroughParticularCategoryItemLoader(null);
      });
  };

  const handleproductInfo = (gtin) => {
    navigate(`/market-place/products/details/${gtin}`);
  };
  useEffect(() => {
    searchProd();
  }, [tempTitle]);

  useEffect(() => {}, [products]);
  const searchProd = () => {
    const payload = {
      page: '1',
      pageSize: '10',
      names: [tempTitle],
      mainCategory: [id],
      supportedStore: [locId],
    };
    if (tempTitle?.length < 1) {
      getProducts();
    } else if (tempTitle?.length < 3) {
      setProducts((prevItems) => [...prevItems]);
    } else if (tempTitle?.length >= 3) {
      setLoader(true);
      getItemsInfo(payload).then((response) => {
        setLoader(false);
        if (response.data.data.products.length !== 0) {
          setProducts(response.data.data.products);
        }
      });
    }
  };

  const handleScroll = () => {
    const box = boxRef.current;

    if (box.scrollTop + box.clientHeight >= box.scrollHeight - 100) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    const box = boxRef.current;

    if (box) {
      box.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (box) {
        box.removeEventListener('scroll', handleScroll);
      }
    };
  }, [pageLoader]);

  const navigateToDetailsPage = (e, gtin) => {
    navigate(`/market-place/products/details/${gtin}`);
  };

  let assPerson,
    assRowPerson = [];

  const allBrand = () => {
    getAllManufacturer().then((res) => {
      assPerson = res.data.data;
      assRowPerson.push(
        assPerson?.map((row) => ({
          label: row.manufactureName,
          value: row.manufactureName,
        })),
      );
      setBrandOption(assRowPerson[0]);
    });
  };

  useEffect(() => {
    setLoader(true);
    getProducts();
  }, [priceValue]);

  const handlePrice = (e) => {
    setPriceValue(e.value);
  };

  useEffect(() => {
    // setLoader(true);
    getCartDetails(cartID)
      .then((res) => {
        setCartProducts(res.data.data.cartProducts);
        setSubtotal(res.data.data.billing.totalCartValue);
        // setLoader(false);
      })
      .catch((error) => {
        // setLoader(false);
      });
  }, [addToCart]);

  const handlePage = (event, value) => {
    setCurrentPage(value);
  };

  let prodImage =
    'https://media.istockphoto.com/id/589415708/photo/fresh-fruits-and-vegetables.jpg?s=1024x1024&w=is&k=20&c=mb1EBDCszi7HP1FxgCPNTh3N1IgV03_N4rCnO_AtStc=';

  if (id === 'Bakery, Cakes & Dairy') {
    prodImage = 'https://as2.ftcdn.net/v2/jpg/02/51/97/31/1000_F_251973116_FnzHmP9rWeOFczFHH4Bb2UfwP3Mi6kUC.jpg';
  } else if (id === 'Cleaning & Household') {
    prodImage =
      'https://nypost.com/wp-content/uploads/sites/2/2022/03/Best-House-Cleaning-Products-feature-image.jpg?resize=744,496&quality=75&strip=all';
  } else if (id === 'Kitchen, Garden & Pets') {
    prodImage = 'https://mydukaan.s3.amazonaws.com/124429/22f70a40-d18f-40df-bf0a-6fe376f84623/1614400102719.jpeg';
  } else if (id === 'Beauty & Hygiene') {
    prodImage =
      'https://media.istockphoto.com/id/1141698953/photo/spa-products-for-home-skin-care.jpg?b=1&s=170667a&w=0&k=20&c=JzqLCaVnKh237TY-4ldl8yfPNPh-u13oCBlPPGYcFDA=';
  } else if (id === 'Baby Care') {
    prodImage = 'http://reliefline.net/wp-content/uploads/2019/08/baby-care-kit-1.jpg';
  } else if (id === 'Gourmet & World Food') {
    prodImage = 'https://worldgourmet.co.in/wp-content/uploads/2020/10/dry-fruits-category-img.jpg';
  } else if (id === 'Foodgrains, Oil & Masala') {
    prodImage = 'https://freshocare.com/wp-content/uploads/2022/11/Untitled-design-6.png';
  } else if (id === 'Beverages') {
    prodImage = 'https://thumbs.dreamstime.com/b/cans-beverages-19492376.jpg';
  } else if (id === 'Snacks & Branded Foods') {
    prodImage = 'https://srikamatchiammansupermarket.files.wordpress.com/2020/10/81df9thwcbl._sl1500_.jpg?w=1024';
  } else if (id === 'Eggs, Meat & Fish') {
    prodImage =
      'https://thumbs.dreamstime.com/b/protein-sources-meat-fish-eggs-cheese-milk-nuts-greens-oil-beans-lentils-white-background-top-view-protein-sources-meat-119594285.jpg';
  }

  const [showCart, setShowCart] = useState(false);

  const handleCartClick = () => {
    setShowCart(!showCart);
  };

  const [favoriteStatus, setFavoriteStatus] = useState(Array(products.length).fill(false));

  const handleToggleFavorite = (index) => {
    const updatedFavoriteStatus = [...favoriteStatus];
    updatedFavoriteStatus[index] = !updatedFavoriteStatus[index];
    setFavoriteStatus(updatedFavoriteStatus);
  };

  localStorage.setItem('CartLength', cartProducts.length);
  return (
    <DashboardLayout>
      <DashboardNavbar
        addToCart={addToCart}
        Appsearch={
          <Box>
            <SoftInput
              placeholder="Search Items"
              onChange={(e) => setTempTitle(e.target.value)}
              autoFocus
              style={{ width: '16rem !important', marginInline: '35px !imporatant' }}
            />
          </Box>
        }
      />
      <Snackbar open={opensnack} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={timelinerror} sx={{ width: '100%' }}>
          {alertmessage}
        </Alert>
      </Snackbar>
      <Grid container justifyContent="space-between" alignItems="center">
        {/* <Grid item xs={6} md={6} xl={6}>
          <Box className="inputText">
            <SoftInput placeholder="Search Items" onChange={(e) => setTempTitle(e.target.value)} autoFocus />
          </Box>
        </Grid> */}

        <Grid item xs={3} md={3} xl={3} wrap="nowrap">
          {/* <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            sx={{ ...(open && { display: 'none' }) }}
          >
            <SoftTypography fontSize="16px">Filters</SoftTypography>
            <FilterAltIcon fontSize="16px" />
          </IconButton> */}
          {/* <SoftBox>
            <SoftSelect
              onChange={handlePrice}
              placeholder="Price"
              options={[
                { value: 'ASC', label: 'Low to High' },
                { value: 'DESC', label: 'High to Low' },
              ]}
            />
          </SoftBox> */}
        </Grid>
      </Grid>

      <Drawer
        sx={{
          width: 300,
          position: 'relative',
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 300,
          },
        }}
        variant="persistent"
        anchor="right"
        open={open}
      >
        <Box>
          <IconButton onClick={handleDrawerClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box padding={2} style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <FormControl>
            <SoftTypography>Price</SoftTypography>
            <RadioGroup onChange={handlePrice}>
              <FormControlLabel value="DEFAULT" control={<Radio />} label="ALL" />
              <FormControlLabel value="ASC" control={<Radio />} label="Low to High" />
              <FormControlLabel value="DESC" control={<Radio />} label="High to Low" />
            </RadioGroup>
          </FormControl>
          {/* 
          <Divider />

          <FormControl>
            <SoftTypography>Pack Size</SoftTypography>
            <RadioGroup sx={{ marginLeft: '20px' }}>
              <FormControlLabel value="100" control={<Radio />} label="100 gm" />
              <FormControlLabel value="200" control={<Radio />} label="200 gm " />
              <FormControlLabel value="400" control={<Radio />} label="400gm" />
              <FormControlLabel value="1000" control={<Radio />} label="1000gm" />
            </RadioGroup>
          </FormControl>

          <Divider />

          <FormControl>
            <SoftTypography>Brands</SoftTypography>
            <FormGroup sx={{ marginLeft: '20px' }}>
              {brandOption.map((ele, index) => {
                return <FormControlLabel value={ele.value} control={<Checkbox />} label={ele.value} />;
              })}
            </FormGroup>
          </FormControl> */}
        </Box>
      </Drawer>
      <Grid container className="container" style={{ display: 'flex' }}>
        <Grid item xs={12} md={showCart ? 8 : 12} className="leftContainer">
          <Grid item xs={12} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Grid item xs={6}>
              <SoftTypography style={{ marginLeft: '20px', fontSize: '1rem', fontWeight: 'bold' }}>
                Categories{' '}
              </SoftTypography>
            </Grid>
            <Grid item xs={3}>
              <SoftBox>
                <SoftSelect
                  onChange={handlePrice}
                  placeholder="Price"
                  options={[
                    { value: 'ASC', label: 'Low to High' },
                    { value: 'DESC', label: 'High to Low' },
                  ]}
                />
              </SoftBox>
            </Grid>
          </Grid>

          <div style={{ width: '100%', display: 'flex', marginTop: '10px' }}>
            {!catLoader ? (
              <>
                <NavigateBeforeOutlinedIcon onClick={handleScrollLeft} className="arrow-icon" fontSize="Large" />
                <Box className="scrollable-container">
                  {category.map(
                    (item, i) =>
                      item.categoryName !== 'All Category' && (
                        <Paper
                          elevation={12}
                          key={i}
                          className={
                            selectedItem === item.categoryName
                              ? 'activeCategory customerDivParticularCategory'
                              : 'customerDivParticularCategory'
                          }
                          onClick={() => {
                            handleproductGo(item.categoryName);
                          }}
                        >
                          <img src={item?.categoryImage} style={{ width: '25px', marginRight: '5px' }} />
                          {item.categoryName}
                        </Paper>
                      ),
                  )}
                </Box>
                <Box>
                  <NavigateNextOutlinedIcon onClick={handleScrollRight} className="arrow-icon" fontSize="Large" />
                </Box>
              </>
            ) : null}
          </div>
          <div>
            {loader ? (
              <Spinner />
            ) : (
              <>
                <div
                  ref={boxRef}
                  tabIndex="0"
                  id="mainHeader"
                  className="particularCategoryEachItemGridContainer"
                  onScroll={handleScroll}
                >
                  <Grid item xs={3}>
                    {/* <SoftBox>
            <SoftSelect
              onChange={handlePrice}
              placeholder="Price"
              options={[
                { value: 'ASC', label: 'Low to High' },
                { value: 'DESC', label: 'High to Low' },
              ]}
            />
          </SoftBox> */}
                  </Grid>
                  <motion.div
                    // style={{  top: 0, right: 0 }}
                    // initial={{ y: -10, opacity: 0 }}
                    // animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <SoftBox
                      variant="gradient"
                      style={{ height: '35px', top: '50vh', right: '0px', width: '65px', position: 'fixed' }}
                    >
                      <SlideCart
                        cartdetails={
                          <CartMarketplace
                            addToCart={addToCart}
                            cartProducts={cartProducts}
                            setCartProducts={setCartProducts}
                            subtotal={subtotal}
                            setSubtotal={setSubtotal}
                            setAlertmessage={setAlertmessage}
                            setTimelineerror={setTimelineerror}
                            handleopensnack={handleopensnack}
                            handleCloseSnackbar={handleCloseSnackbar}
                          />
                        }
                        openCart={openCart}
                      />
                    </SoftBox>
                  </motion.div>
                  {products.length > 0 ? (
                    <Grid container spacing={2}>
                      {products &&
                        products.map((ele, index) => {
                          const isFavorite = favoriteStatus[index];
                          return (
                            <ProductItemCard
                              ele={ele}
                              index={index}
                              key={index}
                              handleNewCart={handleNewCart}
                              prodImage={prodImage}
                            />
                          );
                        })}
                      <br />
                    </Grid>
                  ) : (
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                        height: '50vh',
                      }}
                    >
                      <p className="no-data-wrapper-text">NO RESULT FOUND</p>
                    </Box>
                  )}
                </div>

                {pageLoader && <Spinner />}
              </>
            )}
          </div>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
};
export default SingleProductMarket;
