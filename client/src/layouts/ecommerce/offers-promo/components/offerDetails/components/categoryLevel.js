import { Grid, InputLabel } from '@mui/material';
import React, { useEffect, useState } from 'react';
import SoftBox from '../../../../../../components/SoftBox';
import SoftInput from '../../../../../../components/SoftInput';
import SoftTypography from '../../../../../../components/SoftTypography';
import Spinner from '../../../../../../components/Spinner';
import { productIdByBarcode } from '../../../../Common/CommonFunction';

const DetailCategoryLevel = ({ data, loader }) => {
  const [offerData, setOfferData] = useState([]);
  useEffect(() => {
    if (
      data?.offerType === 'BUY_X_GET_DISCOUNT' ||
      data?.offerType === 'STEP_PROMOTIONS' ||
      data?.offerType === 'BUY_X_GET_DISCOUNT_ON_Y'
    ) {
      setOfferData(data?.offerDetailsEntityList);
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
      {data?.offerType === 'BUY_X_GET_DISCOUNT_ON_Y' ? (
        <>
          <SoftBox display="flex" gap="30px">
            <SoftTypography variant="h6" fontWeight="bold">
              Buy Category or Brand{' '}
              {/* {data?.mainOfferItemList?.length > 1 ? `(Total No: ${data?.offerDetailsEntityList?.length})` : null} */}
            </SoftTypography>
            {loader && <Spinner size={20} />}
          </SoftBox>
          <SoftBox
            style={{
              // marginTop: '20px',
              maxHeight: '500px',
              overflowY: data?.offerDetailsEntityList?.length > 5 ? 'scroll' : 'visible',
              overflowX: 'scroll',
            }}
          >
            {data && (
              <SoftBox mt={1} style={{ minWidth: '900px' }}>
                <Grid container spacing={1} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                  <Grid item xs={0.7} sm={0.7} md={0.7} mt="10px">
                    <SoftBox mb={1} display="flex">
                      <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767', marginLeft: '5px' }}>
                        S No.
                      </InputLabel>
                    </SoftBox>

                    <SoftBox display="flex" alignItems="center" gap="10px">
                      <SoftInput readOnly={true} value={1} />
                    </SoftBox>
                  </Grid>
                  <Grid item xs={2} sm={2} md={2} mt="10px">
                    <SoftBox mb={1} display="flex">
                      <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767', marginLeft: '5px' }}>
                        Main Category
                      </InputLabel>
                    </SoftBox>
                    <SoftBox style={{ cursor: 'pointer' }}>
                      <SoftInput value={data?.mainCategory || 'NA'} readOnly={true} />
                    </SoftBox>
                  </Grid>
                  <Grid item xs={2} sm={2} md={2} mt="10px">
                    <SoftBox mb={1} display="flex">
                      <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767', marginLeft: '5px' }}>
                        Category Level 1
                      </InputLabel>
                    </SoftBox>
                    <SoftInput readOnly={true} value={data?.level1Category || 'NA'} />
                  </Grid>
                  <Grid item xs={2} sm={2} md={2} mt="10px">
                    <SoftBox mb={1} display="flex">
                      <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767', marginLeft: '5px' }}>
                        Category Level 2
                      </InputLabel>
                    </SoftBox>
                    <SoftInput readOnly={true} value={data?.level2Category || 'NA'} />
                  </Grid>
                  <Grid item xs={2} sm={2} md={2} mt="10px">
                    <SoftBox mb={1} display="flex">
                      <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767', marginLeft: '5px' }}>
                        Brand Name
                      </InputLabel>
                    </SoftBox>
                    <SoftInput readOnly={true} value={data?.brands?.length > 0 ? data?.brands : 'NA'} />
                  </Grid>
                  <Grid item xs={1.5} sm={1.5} md={1.5} mt="10px">
                    <SoftBox mb={1} display="flex">
                      <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767', marginLeft: '5px' }}>
                        Quantity
                      </InputLabel>
                    </SoftBox>
                    <SoftInput readOnly={true} value={data?.buyQuantity} />
                  </Grid>
                </Grid>
              </SoftBox>
            )}
          </SoftBox>
          <SoftBox display="flex" gap="30px">
            <SoftTypography variant="h6" fontWeight="bold">
              Get Discount on Secondary Product{' '}
              {/* {data?.mainOfferItemList?.length > 1 ? `(Total No: ${data?.offerDetailsEntityList?.length})` : null} */}
            </SoftTypography>
            {loader && <Spinner size={20} />}
          </SoftBox>
          <SoftBox
            style={{
              // marginTop: '20px',
              maxHeight: '500px',
              overflowY: data?.offerDetailsEntityList?.length > 5 ? 'scroll' : 'visible',
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

                        <SoftInput readOnly={true} value={ele?.getQuantity} />
                      </Grid>
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
                    </Grid>
                  </SoftBox>
                );
              })}
          </SoftBox>
        </>
      ) : (
        <>
          <SoftBox display="flex" gap="30px">
            <SoftTypography variant="h6" fontWeight="bold">
              Buy Category or Brand{' '}
              {/* {data?.mainOfferItemList?.length > 1 ? `(Total No: ${data?.offerDetailsEntityList?.length})` : null} */}
            </SoftTypography>
            {loader && <Spinner size={20} />}
          </SoftBox>
          <SoftBox
            style={{
              // marginTop: '20px',
              maxHeight: '500px',
              overflowY: data?.offerDetailsEntityList?.length > 5 ? 'scroll' : 'visible',
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
                        xs={2}
                        sm={2}
                        md={2}
                        mt={index === 0 ? '10px' : '-1px'}
                        display={index !== 0 ? 'flex' : ''}
                      >
                        {index === 0 && (
                          <SoftBox mb={1} display="flex">
                            <InputLabel
                              sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767', marginLeft: '5px' }}
                            >
                              Main Category
                            </InputLabel>
                          </SoftBox>
                        )}
                        <SoftBox style={{ cursor: 'pointer' }}>
                          <SoftInput value={data?.mainCategory || 'NA'} readOnly={true} />
                        </SoftBox>
                      </Grid>
                      <Grid
                        item
                        xs={2}
                        sm={2}
                        md={2}
                        mt={index === 0 ? '10px' : '-1px'}
                        display={index !== 0 ? 'flex' : ''}
                      >
                        {index === 0 && (
                          <SoftBox mb={1} display="flex">
                            <InputLabel
                              sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767', marginLeft: '5px' }}
                            >
                              Category Level 1
                            </InputLabel>
                          </SoftBox>
                        )}
                        <SoftInput readOnly={true} value={data?.level1Category || 'NA'} />
                      </Grid>
                      <Grid
                        item
                        xs={2}
                        sm={2}
                        md={2}
                        mt={index === 0 ? '10px' : '-1px'}
                        display={index !== 0 ? 'flex' : ''}
                      >
                        {index === 0 && (
                          <SoftBox mb={1} display="flex">
                            <InputLabel
                              sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767', marginLeft: '5px' }}
                            >
                              Category Level 2
                            </InputLabel>
                          </SoftBox>
                        )}
                        <SoftInput readOnly={true} value={data?.level2Category || 'NA'} />
                      </Grid>
                      <Grid
                        item
                        xs={2}
                        sm={2}
                        md={2}
                        mt={index === 0 ? '10px' : '-1px'}
                        display={index !== 0 ? 'flex' : ''}
                      >
                        {index === 0 && (
                          <SoftBox mb={1} display="flex">
                            <InputLabel
                              sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767', marginLeft: '5px' }}
                            >
                              Brand Name
                            </InputLabel>
                          </SoftBox>
                        )}
                        <SoftInput readOnly={true} value={data?.brands?.length > 0 ? data?.brands : 'NA'} />
                      </Grid>
                      <Grid
                        item
                        xs={1.5}
                        sm={1.5}
                        md={1.5}
                        mt={index === 0 ? '10px' : '-1px'}
                        display={index !== 0 ? 'flex' : ''}
                      >
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
                      {data?.offerType !== 'BUY_X_GET_DISCOUNT_ON_Y' ? (
                        <Grid
                          item
                          xs={1.5}
                          sm={1.5}
                          md={1.5}
                          mt={index === 0 ? '10px' : '-1px'}
                          display={index !== 0 ? 'flex' : ''}
                        >
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
                      ) : null}
                    </Grid>
                  </SoftBox>
                );
              })}
          </SoftBox>
        </>
      )}
    </SoftBox>
  );
};

export default DetailCategoryLevel;
