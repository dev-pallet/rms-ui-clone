import { Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import SoftBox from '../../../../../../components/SoftBox';
import SoftTypography from '../../../../../../components/SoftTypography';

const ProductItemCard = ({ ele, handleNewCart, index ,prodImage}) => {

  // console.log(ele.productSource.marketPlaceSellers)
  // console.log(ele.gtin)

  // useEffect(() => {
  //   getPurchaceprice(ele?.productSource?.marketPlaceSellers[0], ele?.gtin).then((res) => {
  //    console.log('Vedor SP=>',res?.data)
  //   });
  // }, [ele]);
 
  const navigate = useNavigate();
  const locId = localStorage.getItem('locId');
  const cartID = localStorage.getItem('cartId-MP');
  const [addItemThroughParticularCategoryItemLoader, setAddItemThroughParticularCategoryItemLoader] = useState(null);

  const permissions = JSON.parse(localStorage.getItem('permissions'));

  const handleproductInfo = (gtin) => {
    navigate(`/market-place/products/details/${gtin}`);
  };

  const kannadaLanguage = ele?.language?.nativeLanguages?.find(lang => lang.language === 'Kannada');
  const checkSellingPrice = (ele) => {};
  return (
    <Grid item key={ele?.gtin} xs={12} sm={6} md={4} lg={3} xl={3} spacing={2} className="particularCategoryEachItem" >
      <SoftBox style={{ marginLeft: '-16px' , maxheight:'300px !important'}}>
        <div
          className="discounted-card"
          style={{
            position: 'absolute',
            marginInline: '15px',
            marginTop: '15px',
            right: '-15px',
            backgroundColor: '#f74848',
            borderTopLeftRadius: '5px',
            borderBottomLeftRadius: '5px',
            height: '25px',
            width: '50px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: '0.75rem', color: 'white' }}>15% Off</span>
        </div>
        <div
          className="discounted-card"
          style={{
            position: 'absolute',
            marginInline: '15px',
            marginTop: '15px',

            borderRadius: '5px',
            height: '25px',
            width: '25px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            border: '1px solid #8e9490',
          }}
        >
          <span style={{ fontSize: '1rem', color: 'white' }}>
            {ele?.food_type !== null ? (
              <span style={{ fontSize: '1.8rem', color: 'green' }}>&#8226;</span>
            ) : (
              <span style={{ fontSize: '1.8rem', color: 'red' }}>&#8226;</span>
            )}
          </span>
        </div>
       
        {ele?.brand ?  <div
          className="discounted-card"
          style={{
            position: 'absolute',
            marginInline: '15px',
            marginTop: '140px',
            left: '-15px',
            // backgroundColor: '#fcfcfc',
            paddingInline:'5px',
            borderTopRightRadius:'5px',
            borderBottomRightRadius:'5px',
            height: '25px',
            width: '70px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <SoftTypography
            style={{
              fontSize: '0.7rem',
              paddingLeft: '7px',
              paddingRight: '7px',
              marginTop: '-10px',
              overflow: 'hidden',
              opacity:'0.55',
              textTransform: 'capitalize',
              color:'#796994'
            }}
            className="particularElementName"
            onClick={() => handleproductInfo(ele?.gtin)}
          >
            {ele?.brand}
          </SoftTypography>
        </div> : null}
       

        <img
          className="particularCategoryEachItemImg"
          src={
            ele.images == null
              ? prodImage
              : ele.images.top_left !== null && ele.images.top_left !== 'string'
                ? ele.images.top_left
                : ele.images.back !== null && ele.images.back !== 'string'
                  ? ele.images.back
                  : ele.images.bottom !== null && ele.images.bottom !== 'string'
                    ? ele.images.bottom
                    : ele.images.front !== null && ele.images.front !== 'string'
                      ? ele.images.front
                      : ele.images.left !== null && ele.images.left !== 'string'
                        ? ele.images.left
                        : ele.images.right !== null && ele.images.right !== 'string'
                          ? ele.images.right
                          : ele.images.top_right !== null && ele.images.top_right !== 'string'
                            ? ele.images.top_right
                            : ele.images.top !== null && ele.images.top !== 'string'
                              ? ele.images.top
                              : null
          }
          alt=""
          onClick={() => handleproductInfo(ele?.gtin)}
        />
      </SoftBox>

     
      <SoftBox
        style={{
          display: 'flex',
          marginLeft: '-15px',
          paddingLeft: '17px',
          marginTop:'-25px',
          flexDirection:'column',
        }}
      >
        
        <SoftTypography
          style={{
            fontSize: '0.9rem',
            paddingLeft: '7px',
            paddingRight: '7px',
            minHeight: '5.5vh',
            textTransform: 'capitalize',
            fontWeight: 'bold',
            color: '#170b26',
            display: 'inline-block',
            maxWidth: '100px !important',
            wordWrap: 'break-word',
            flexWrap: 'wrap',
          }}
          className="particularElementName"
          onClick={() => handleproductInfo(ele?.gtin)}
        >
          {ele?.name.split('-')[0].trim()} {' / '}
          {kannadaLanguage && kannadaLanguage.name}
          {/* {ele?.language && " / "} */}
          {/* {ele?.language} */}
        </SoftTypography>

       
      </SoftBox>
      <span className="weight-wrapper-box"  style={{marginTop:'-7px',marginLeft:'7px',marginBottom:'8px !important'}}>
        <p>{ele?.weights_and_measures?.gross_weight}</p>
        <p>{ele?.weights_and_measures?.measurement_unit}</p> 
      </span>

      {/* <SoftTypography
        style={{
          fontSize: '0.7rem',
          paddingLeft: '7px',
          paddingRight: '7px',
          marginTop: '-10px',
          overflow: 'hidden',
      
          textTransform: 'capitalize',
        }}
        className="particularElementName"
        onClick={() => handleproductInfo(ele.gtin)}
      >
        {ele.brand}
      </SoftTypography> */}

      <SoftTypography
        style={{
          fontSize: '0.78rem',
          paddingLeft: '7px',
          paddingRight: '7px',
          marginTop: '-5px',
          overflow: 'hidden',
          marginBottom: '5px',
          textTransform: 'capitalize',
        }}
        className="particularElementName"
        onClick={() => handleproductInfo(ele.gtin)}
      >
        min order {ele?.minimum_order_quantity} {ele?.minimum_order_quantity_unit}
      </SoftTypography>
      {permissions?.RETAIL_Products?.WRITE || permissions?.WMS_Products?.WRITE || permissions?.VMS_Products?.WRITE ? (
        <div
          style={{
            display: 'flex',
            flex: 1,
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '1rem',
            paddingLeft: '7px',
            paddingRight: '7px',
          }}
        >
          <div style={{ flex: 0.7, display: 'flex', alignItems: 'center' }}>
            <p style={{ fontWeight: 'bold' }}>₹{ele.mrp.mrp}</p>
            <p
              style={{
                textDecoration: 'line-through',
                color: '#999',
                marginInline: '10px',
                fontSize: '0.85rem',
              }}
            >
              ₹650
            </p>
          </div>
          {addItemThroughParticularCategoryItemLoader === index ? (
            <CircularProgress color="success" sx={{ color: '#5271ff' }} size={25} />
          ) : (
            <button
              style={{
                cursor: 'pointer',
                backgroundColor: '#0868FE',
                color: '#fff',
                border: 'solid 1px #5271ff',
                fontWeight: 'bold',
                fontSize: '0.8rem',
                borderRadius: '8px',
                width: '50px',
                height: '30px',
                marginTop:'-10px'
              }}
              onClick={() => handleNewCart(ele, index)}
            >
              Add
            </button>
          )}
        </div>
      ) : null}
    </Grid>
  );
};

export default ProductItemCard;
