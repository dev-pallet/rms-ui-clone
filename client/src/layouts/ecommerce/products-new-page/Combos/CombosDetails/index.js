import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../examples/Navbars/DashboardNavbar';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from '../../../../../hooks/SnackbarProvider';
import { getProductDetailsRestaurant } from '../../../../../config/Services';
import SoftBox from '../../../../../components/SoftBox';
import { Grid, Typography } from '@mui/material';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Status from '../../../Common/Status';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Spinner from '../../../../../components/Spinner';
import ProductImages from '../../../product/all-products/components/product-details/components/ProductImages';
import ComboBasicDetails from './components/ComboBasicDetails';
import ComboSalesSync from './components/ComboSalesSyn';
import ComboInformation from './components/ComboInformation';

const CombosDetailsPage = () => {
  const navigate = useNavigate();
  const location1 = useLocation();
  const showSnackBar = useSnackbar();

  const permissions = JSON.parse(localStorage.getItem('permissions'));
  const locId = localStorage.getItem('locId');
  const orgId = localStorage.getItem('orgId');
  const uidx = JSON.parse(localStorage.getItem('user_details')).uidx;
  const userName = localStorage.getItem('user_name');

  const [productDetails, setProductDetails] = useState({});
  const [loader, setLoader] = useState(false);
  const { id } = useParams();

  const editProductForm = () => {
    navigate(`/products/all-combos/edit/${id}`);
  };

  async function getProduct() {
    setLoader(true);
    let locIdData;
    if (location1.pathname === `/products/product/details/${id}`) {
      locIdData = locId.toLowerCase();
    }

    await getProductDetailsRestaurant(id, locIdData).then(function (responseTxt) {
      if (!responseTxt?.data) {
        navigate('/products/all-combos');
        return;
      }
      setLoader(false);
      setProductDetails(responseTxt?.data?.data?.data);
      sessionStorage.setItem('tableData', JSON.stringify(responseTxt?.data?.data));
    });
  }

  useEffect(() => {
    getProduct();
  }, []);

  const [images, setImages] = useState([]);

  useEffect(() => {
    setImages([]);
    setImages(productDetails?.imageUrls || []);
  }, [productDetails]);

  return (
    <DashboardLayout>
      <DashboardNavbar prevLink={true} />
      <SoftBox className="products-new-wrapper">
        <div className="products-new-details-top-nav-bar">
          <Typography className="products-new-details-category-typo">
            {productDetails?.appCategories?.categoryLevel1}
            {productDetails?.appCategories?.categoryLevel2.length !== 0 && (
              <KeyboardArrowRightIcon className="left-icon-fruits" />
            )}
            {productDetails?.appCategories?.categoryLevel2}
          </Typography>
          <div className="products-new-details-top-right-bar">
            <Status label={productDetails?.isActive ? 'ACTIVE' : 'INACTIVE'} />
            <ModeEditIcon
              sx={{
                display:
                  permissions?.RETAIL_Products?.WRITE ||
                  permissions?.WMS_Products?.WRITE ||
                  permissions?.VMS_Products?.WRITE
                    ? 'block'
                    : 'none',
                float: 'right',
                cursor: 'pointer',
              }}
              onClick={() => editProductForm()}
            ></ModeEditIcon>
            <MoreVertIcon
              sx={{
                display:
                  permissions?.RETAIL_Products?.WRITE ||
                  permissions?.WMS_Products?.WRITE ||
                  permissions?.VMS_Products?.WRITE
                    ? 'block'
                    : 'none',
                float: 'right',
                cursor: 'pointer',
              }}
              //   onClick={handleClick}
            ></MoreVertIcon>
          </div>
        </div>

        <SoftBox style={{ marginTop: '10px' }}>
          <Grid container spacing={2}>
            <Grid item lg={3} md={3} xs={12} sm={12}>
              {loader ? <Spinner /> : <ProductImages Imgs={images} />}
            </Grid>
            <Grid item lg={9} md={7} sm={12} xs={12}>
              <ComboBasicDetails productDetails={productDetails} />
            </Grid>
          </Grid>
        </SoftBox>

        <SoftBox style={{ marginTop: '40px' }}>
          <ComboInformation productDetails={productDetails} />
        </SoftBox>

        <SoftBox style={{ marginTop: '40px' }}>
          <ComboSalesSync productDetails={productDetails} />
        </SoftBox>
      </SoftBox>
    </DashboardLayout>
  );
};

export default CombosDetailsPage;
