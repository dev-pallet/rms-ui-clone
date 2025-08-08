import { Button, Card, Grid, Typography } from '@mui/material';
import { addItemsToSalesCart, filterVendorSKUData } from '../../../config/Services';
import { useSnackbar } from '../../../hooks/SnackbarProvider';
import NavigateBeforeOutlinedIcon from '@mui/icons-material/NavigateBeforeOutlined';
import NavigateNextOutlinedIcon from '@mui/icons-material/NavigateNextOutlined';
import React, { useEffect, useRef, useState } from 'react';
import SoftButton from '../../../components/SoftButton';
import SoftTypography from '../../../components/SoftTypography';

const DisplayTags = ({
  editGtin,
  tagName,
  newSalesCart,
  mobileView,
  selectionView,
  contentTypeId,
  setContentTypeId,
  tagId,
}) => {
  const showSnackbar = useSnackbar();

  const [popularProductLeftIconVisibility, setPopularProductLeftIconVisibility] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const cartID = localStorage.getItem('cartId-MP');
  const locId = localStorage.getItem('locId');

  const [maxScrollRight, setMaxScrollRight] = useState(0);

  const containerRef = useRef(null);
  const handleScroll = () => {
    const scrollPosition = containerRef.current.scrollLeft;

    if (scrollPosition > 0) {
      setPopularProductLeftIconVisibility(true);
    } else {
      setPopularProductLeftIconVisibility(false);
    }
  };
  const handleScrollLeft = () => {
    containerRef.current.scrollBy({ left: -350, behavior: 'smooth' });
    setCurrentIndex((prevIndex) => prevIndex - 350);
  };
  const handleScrollRight = () => {
    containerRef.current.scrollBy({ left: 350, behavior: 'smooth' });
    setCurrentIndex((prevIndex) => prevIndex + 350);
  };
  const [inputlist, setInputlist] = useState([
    {
      prodOptions: [],
      productName: '',
      quantity: '',
      unit: '',
      productPrice: '',
      gst: '',
      discount: '',
      vendorProductPrice: '',
      gtin: '',
      images: '',
    },
  ]);

  const [editProductData, setEditProductData] = useState([]);
  useEffect(() => {
    if (editGtin?.length) {
        const payload = {
          page: '1',
          pageSize: '10',
          gtin: editGtin || [],
          sort: {
            mrpSortOption: 'DEFAULT',
            popular: 'DEFAULT',
            creationDateSortOption: 'DEFAULT',
          },
          supportedStore : [locId]
        };
      filterVendorSKUData(payload)
        .then((res) => {
          const d_img = 'https://i.imgur.com/dL4ScuP.png';
          const data = res?.data?.data?.products;
          const length = res?.data?.data?.products?.length || 0;
          setEditProductData(data);
          setInputlist(
            data?.map((item) => {
              return {
                prodOptions: [],
                productName: item?.name,
                quantity: '',
                unit: '',
                productPrice: '',
                gst: '',
                discount: '',
                vendorProductPrice: '',
                gtin: item?.gtin,
                images:
                  item?.images?.front ||
                  item?.images?.back ||
                  item?.images?.top_left ||
                  item?.images?.top_right ||
                  d_img,
              };
            }),
          );
        })
        .catch((err) => {});
    }
  }, [editGtin]);

  const handleNewCart = (ele, index) => {
    addItemsToSalesCart(cartID, ele.gtin, locId)
      .then((res) => {
        showSnackbar('Product added to cart', 'success');
      })
      .catch((error) => {
        if (error?.response?.data?.message === 'Error :: Please provide correct Cart id.') {
          showSnackbar('Cart Not Found', 'error');
          newSalesCart();
        }
        showSnackbar('Some error occured', 'error');
      });
  };

  return (
    <Card className={mobileView ? null : 'tagDisplay_Margin'}>
      <Grid item xs={12}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            margin: selectionView ? '10px 15px 10px 0px' : '0px',
          }}
        >
          <SoftTypography
            className={mobileView ? 'categoryMobile-text' : 'category-text'}
            style={{ marginBottom: '15px' }}
          >
            {tagName}
          </SoftTypography>
          {selectionView ? (
            <div>
              <SoftButton color="secondary" onClick={() => setContentTypeId([{ type: 'TAGS', idOfData: tagId, priority: '' }])}>
                select
              </SoftButton>
            </div>
          ) : null}
        </div>
      </Grid>

      <div style={{ display: 'flex', marginLeft: '10px' }}>
        <>
          {popularProductLeftIconVisibility && (
            <NavigateBeforeOutlinedIcon onClick={handleScrollLeft} className="arrow-icon2" fontSize="large" />
          )}
        </>
        <div
          style={{ overflowX: 'auto', maxWidth: '100%' }}
          className="productcontainer"
          ref={containerRef}
          onScroll={handleScroll}
        >
          <Grid container spacing={3} style={{ flexWrap: 'nowrap' }}>
            {inputlist?.map((product, index) => (
              <Grid item xs={12} sm={6} md={4} lg={6} key={index}>
                <Card className={mobileView ? 'productCardMobile_style' : 'productCard_style'}>
                  <img style={{ height: '60%', objectFit: 'contain' }} src={product?.images} alt="img" />

                  <Typography
                    variant="h6"
                    className="productCard_fontStyle"
                    style={{ fontSize: mobileView ? '0.6rem' : '0.9rem', height: mobileView ? '22px' : 'none' }}
                  >
                    {product?.productName}
                  </Typography>
                  {mobileView ? (
                    <Button style={{ left: '10px', backgroundColor: '#c2f2c8', fontSize: '0.5rem', padding: '0px' }}>
                      {/* <IoMdAdd color="green"/> */}
                      Add
                    </Button>
                  ) : (
                    <SoftButton className="vendor-add-btn productCard_Btn_Style" onClick={() => handleNewCart(product)}>
                      {' '}
                      Add
                    </SoftButton>
                  )}
                </Card>
              </Grid>
            ))}
          </Grid>
        </div>
        <>
          {currentIndex < maxScrollRight && (
            <NavigateNextOutlinedIcon onClick={handleScrollRight} className="arrow-icon2" fontSize="large" />
          )}
        </>
      </div>
    </Card>
  );
};

export default DisplayTags;
