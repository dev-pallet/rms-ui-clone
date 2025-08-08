import { Grid, InputLabel } from '@mui/material';
import React, { useEffect, useState } from 'react';
import SoftBox from '../../../../../../components/SoftBox';
import SoftInput from '../../../../../../components/SoftInput';
import SoftTypography from '../../../../../../components/SoftTypography';
import Spinner from '../../../../../../components/Spinner';
import { productIdByBarcode } from '../../../../Common/CommonFunction';

const DetailIemLevel = ({ data, loader }) => {
  const [offerData, setOfferData] = useState([]);
  const [mainData, setMainData] = useState([]);
  useEffect(() => {
    if (
      data?.offerType === 'OFFER_ON_MRP' ||
      data?.offerType === 'STEP_PROMOTIONS' ||
      data?.offerType === 'BUY_X_GET_DISCOUNT'
    ) {
      setMainData(data?.offerDetailsEntityList);
    }
    if (
      data?.offerType === 'BUY_X_GET_DISCOUNT_ON_Y' ||
      data?.offerType === 'COMBO_OFFER_DISCOUNT' ||
      data?.offerType === 'BUY_X_GET_Y'
    ) {
      setMainData(data?.offerDetailsEntityList);
      setOfferData(data?.mainOfferItemList);
    }
  }, [data]);

  const handleProductNavigation = async (barcode) => {
    try {
      const productId = await productIdByBarcode(barcode);
      if (productId) {
        navigate(`/products/product/details/${productId}`);
      }
    } catch (error) {}
  };

  return (
    <SoftBox p={3} className="add-customer-other-details-box" mt={2}>
      {offerData &&
        (data?.offerType === 'BUY_X_GET_DISCOUNT_ON_Y' ||
          data?.offerType === 'COMBO_OFFER_DISCOUNT' ||
          data?.offerType === 'BUY_X_GET_Y') && (
          <>
            <SoftBox display="flex" gap="30px">
              <SoftTypography variant="h6" fontWeight="bold">
                Buy Product{' '}
                {/* {data?.mainOfferItemList?.length > 1 ? `(Total No: ${data?.offerDetailsEntityList?.length})` : null} */}
              </SoftTypography>
              {loader && <Spinner size={20} />}
            </SoftBox>
            <SoftBox
              style={{
                // marginTop: '20px',
                maxHeight: '500px',
                overflowY: data?.mainOfferItemList?.length > 5 ? 'scroll' : 'visible',
                overflowX: 'scroll',
              }}
            >
              {data &&
                offerData?.map((ele, index) => {
                  return (
                    <SoftBox mt={1} key={ele} style={{ minWidth: '900px' }}>
                      <Grid container spacing={1} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                        <Grid
                          item
                          xs={0.7}
                          sm={0.7}
                          md={0.7}
                          mt={index === 0 ? '10px' : '-1px'}
                          display={index !== 0 ? 'flex' : ''}
                        >
                          {index === 0 && (
                            <SoftBox mb={1} display="flex">
                              <InputLabel
                                sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767', marginLeft: '5px' }}
                              >
                                S No.
                              </InputLabel>
                            </SoftBox>
                          )}
                          <SoftBox display="flex" alignItems="center" gap="10px">
                            <SoftInput readOnly={true} value={index + 1} />
                          </SoftBox>
                        </Grid>
                        <Grid
                          item
                          xs={3}
                          sm={3}
                          md={3}
                          mt={index === 0 ? '10px' : '-1px'}
                          display={index !== 0 ? 'flex' : ''}
                        >
                          {index === 0 && (
                            <SoftBox mb={1} display="flex">
                              <InputLabel
                                sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767', marginLeft: '5px' }}
                              >
                                Barcode
                              </InputLabel>
                            </SoftBox>
                          )}
                          <SoftBox style={{ cursor: 'pointer', width: '100%' }}>
                            <SoftInput
                              value={ele?.mainGtin}
                              readOnly={true}
                              onClick={() => {
                                ele?.mainGtin ? handleProductNavigation(ele?.mainGtin) : null;
                              }}
                            />
                          </SoftBox>
                        </Grid>
                        <Grid
                          item
                          xs={3}
                          sm={3}
                          md={3}
                          mt={index === 0 ? '10px' : '-1px'}
                          display={index !== 0 ? 'flex' : ''}
                        >
                          {index === 0 && (
                            <SoftBox mb={1} display="flex">
                              <InputLabel
                                sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767', marginLeft: '5px' }}
                              >
                                Product Title
                              </InputLabel>
                            </SoftBox>
                          )}
                          <SoftInput readOnly={true} value={ele?.mainItemName} />
                        </Grid>
                        <Grid item xs={1.5} sm={1.5} md={1.5} mt={index === 0 ? '10px' : '-1px'}>
                          {index === 0 && (
                            <SoftBox mb={1} display="flex">
                              <InputLabel
                                sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767', marginLeft: '5px' }}
                              >
                                Batch No.
                              </InputLabel>
                            </SoftBox>
                          )}

                          <SoftInput readOnly={true} value={ele?.mainGtinBatch} />
                        </Grid>
                        <Grid item xs={1.5} sm={1.5} md={1.5} mt={index === 0 ? '10px' : '-1px'}>
                          {index === 0 && (
                            <SoftBox mb={1} display="flex">
                              <InputLabel
                                sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767', marginLeft: '5px' }}
                              >
                                Quantity
                              </InputLabel>
                            </SoftBox>
                          )}

                          <SoftInput readOnly={true} value={ele?.buyQuantity} />
                        </Grid>
                      </Grid>
                    </SoftBox>
                  );
                })}
            </SoftBox>
          </>
        )}
      <SoftBox display="flex" gap="30px">
        <SoftTypography variant="h6" fontWeight="bold">
          {data?.offerType === 'BUY_X_GET_DISCOUNT_ON_Y' ||
          data?.offerType === 'COMBO_OFFER_DISCOUNT' ||
          data?.offerType === 'BUY_X_GET_Y'
            ? 'Get'
            : 'Buy'}{' '}
          {data?.offerType === 'COMBO_OFFER_DISCOUNT' ? 'Discount of: ' : 'Product'}
          {/* {data?.mainOfferItemList?.length > 1 ? `(Total No: ${data?.offerDetailsEntityList?.length})` : null} */}
        </SoftTypography>
        {loader && <Spinner size={20} />}
      </SoftBox>
      {data?.offerType === 'COMBO_OFFER_DISCOUNT' ? (
        <SoftBox width="20%">
          <SoftInput
            readOnly={true}
            value={
              mainData[0]?.discountType === 'Flat Price'
                ? `${mainData[0]?.offerDiscount || mainData[0]?.flatPrice || 'NA'} ${mainData[0]?.discountType}`
                : mainData[0]?.offerDiscount || mainData[0]?.flatPrice || 'NA'
            }
            icon={{
              component: mainData[0]?.discountType !== 'Flat Price' ? mainData[0]?.discountType : '',
              direction: 'right',
            }}
          />
        </SoftBox>
      ) : (
        <SoftBox
          style={{
            // marginTop: '20px',
            maxHeight: '500px',
            overflowY: data?.offerDetailsEntityList?.length > 5 ? 'scroll' : 'visible',
            overflowX: 'scroll',
          }}
        >
          {data &&
            mainData?.map((ele, index) => {
              return (
                <SoftBox mt={1} key={ele} style={{ minWidth: '900px' }}>
                  <Grid container spacing={1} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <Grid
                      item
                      xs={0.7}
                      sm={0.7}
                      md={0.7}
                      mt={index === 0 ? '10px' : '-1px'}
                      display={index !== 0 ? 'flex' : ''}
                    >
                      {index === 0 && (
                        <SoftBox mb={1} display="flex">
                          <InputLabel
                            sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767', marginLeft: '5px' }}
                          >
                            S No.
                          </InputLabel>
                        </SoftBox>
                      )}
                      <SoftBox display="flex" alignItems="center" gap="10px">
                        <SoftInput readOnly={true} value={index + 1} />
                      </SoftBox>
                    </Grid>
                    <Grid
                      item
                      xs={3}
                      sm={3}
                      md={3}
                      mt={index === 0 ? '10px' : '-1px'}
                      display={index !== 0 ? 'flex' : ''}
                    >
                      {index === 0 && (
                        <SoftBox mb={1} display="flex">
                          <InputLabel
                            sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767', marginLeft: '5px' }}
                          >
                            Barcode
                          </InputLabel>
                        </SoftBox>
                      )}
                      <SoftBox style={{ cursor: 'pointer', width: '100%' }}>
                        <SoftInput
                          value={ele?.gtin}
                          readOnly={true}
                          onClick={() => {
                            ele?.gtin ? handleProductNavigation(ele?.gtin) : null;
                          }}
                        />
                      </SoftBox>
                    </Grid>
                    <Grid
                      item
                      xs={3}
                      sm={3}
                      md={3}
                      mt={index === 0 ? '10px' : '-1px'}
                      display={index !== 0 ? 'flex' : ''}
                    >
                      {index === 0 && (
                        <SoftBox mb={1} display="flex">
                          <InputLabel
                            sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767', marginLeft: '5px' }}
                          >
                            Product Title
                          </InputLabel>
                        </SoftBox>
                      )}
                      <SoftInput readOnly={true} value={ele?.itemName} />
                    </Grid>
                    <Grid item xs={1.5} sm={1.5} md={1.5} mt={index === 0 ? '10px' : '-1px'}>
                      {index === 0 && (
                        <SoftBox mb={1} display="flex">
                          <InputLabel
                            sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767', marginLeft: '5px' }}
                          >
                            Batch No.
                          </InputLabel>
                        </SoftBox>
                      )}

                      <SoftInput readOnly={true} value={ele?.batchNo} />
                    </Grid>
                    {data?.offerType === 'OFFER_ON_MRP' ? null : (
                      <Grid item xs={1.5} sm={1.5} md={1.5} mt={index === 0 ? '10px' : '-1px'}>
                        {index === 0 && (
                          <SoftBox mb={1} display="flex">
                            <InputLabel
                              sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767', marginLeft: '5px' }}
                            >
                              Quantity
                            </InputLabel>
                          </SoftBox>
                        )}

                        <SoftInput
                          readOnly={true}
                          value={
                            data?.offerType === 'BUY_X_GET_Y' || data?.offerType === 'BUY_X_GET_DISCOUNT_ON_Y'
                              ? ele?.getQuantity
                              : ele?.buyQuantity
                          }
                        />
                      </Grid>
                    )}
                    {data?.offerType === 'BUY_X_GET_Y' ? null : (
                      <Grid item xs={1.5} sm={1.5} md={1.5} mt={index === 0 ? '10px' : '-1px'}>
                        {index === 0 && (
                          <SoftBox mb={1} display="flex">
                            <InputLabel
                              sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767', marginLeft: '5px' }}
                            >
                              Discount
                            </InputLabel>
                          </SoftBox>
                        )}

                        <SoftInput
                          readOnly={true}
                          value={`${ele?.offerDiscount || ele?.flatPrice || 'NA'} ${ele?.discountType}`}
                        />
                      </Grid>
                    )}
                  </Grid>
                </SoftBox>
              );
            })}
        </SoftBox>
      )}
    </SoftBox>
  );
};

export default DetailIemLevel;
