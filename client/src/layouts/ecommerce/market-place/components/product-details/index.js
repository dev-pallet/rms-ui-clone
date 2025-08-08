import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import SoftBox from 'components/SoftBox';
import SoftTypography from 'components/SoftTypography';

// Soft UI Dashboard PRO React example components
import { useParams } from 'react-router-dom';
import DashboardLayout from '../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../examples/Navbars/DashboardNavbar';

// ProductPage page components
import { ProductInfo } from './components/ProdInfo/prodInfo';
import React, { useEffect, useState } from 'react';


// Data

// style
import '../../../product/all-products/components/product-details/product-detailspage.css';
import { getCartDetails, getInventoryDetails } from '../../../../../config/Services';
import { getProductDetails } from 'config/Services';
import ProductImageMP from './components/ProdImage';
import Spinner from '../../../../../components/Spinner';

export const MarketProdDetails = () => {

  const { gtin } = useParams();
  const [datRows, setTableRows] = useState({});
  const [loader, setLoader] = useState(false);
  const [gotoCart, setGotoCart] = useState(false);
  const [cartProducts, setCartProducts] = useState([]);
  const [cartQuant, setCartQuant] = useState('');
  const [priceInfo, setPriceInfo] = useState({});
  
  const locId = localStorage.getItem('locId');
  let dataArr,
    dataRow = [];

  useEffect(() => {
    prodDetails();
    if(cartId){
      CartDetail();
    }
  }, []);
  
  useEffect(() => {
    if(cartProducts.some(e => e.gtin === gtin)){
      setGotoCart(true);
    }
    for(let i = 0; i < cartProducts.length; i++) {
      if (cartProducts[i].gtin == gtin) {
        setCartQuant(cartProducts[i].quantity);
        break;
      }
    }
  }, [cartProducts]);

  const prodDetails = () => {
    setLoader(true);
    getProductDetails(gtin)
      .then(function (res) {
        dataArr = res.data?.data;
        // setPriceInfo(res?.data?.data?.mrp);
        setTableRows(dataArr);
        setLoader(false);
      })
      .catch((error) => {
      });
    getInventoryDetails(locId, gtin)
      .then((res) => {
        setPriceInfo(res?.data?.data);
        setLoader(false);
      })
      .catch((err) => {
        setErrorHandler(err.response.data.message);
        setClrMsg('error');
        setOpen(true);
        setLoader(false);
      });
  };

  const cartId = localStorage.getItem('cartId-MP');

  const CartDetail = () => {
    getCartDetails(cartId).then((res)=>{
      setCartProducts(res.data.data.cartProducts);
      setLoader(false);
    })
      .catch((error)=>{
        setLoader(false);
      });
  };

  
  return (
    <DashboardLayout>
      <DashboardNavbar />
      
      <SoftBox py={3}>
        <Card sx={{ overflow: 'visible' }}>
          <SoftBox p={3} display="flex" flexDirection="column">
            <SoftBox mb={3} sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <SoftTypography variant="h5" fontWeight="medium">
             
              </SoftTypography>
            </SoftBox>

            <Grid container spacing={3}>
              <Grid item xs={12} lg={6} xl={5}>
                {loader ? <Spinner /> : <ProductImageMP Imgs={datRows?.images} />}
              </Grid>
              <Grid item xs={12} lg={5} sx={{ mx: 'auto' }}>
                <ProductInfo datRows={datRows} price={priceInfo} gtin={gtin} gotoCart={gotoCart} cartQuant={cartQuant}/>
              </Grid>
            </Grid>
            
          </SoftBox>
        </Card>
      </SoftBox>
    </DashboardLayout>
  );
};
