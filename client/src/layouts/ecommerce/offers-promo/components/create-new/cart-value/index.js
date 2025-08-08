import { Box, Checkbox, FormControlLabel, FormGroup, Grid, InputLabel, TextareaAutosize } from '@mui/material';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import CartValueCategory from './category';
import CartValueItem from './itemValue';
import DashboardLayout from '../../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../../examples/Navbars/DashboardNavbar';
import React, { useState } from 'react';
import SoftBox from '../../../../../../components/SoftBox';
import SoftButton from '../../../../../../components/SoftButton';
import SoftInput from '../../../../../../components/SoftInput';
import SoftSelect from '../../../../../../components/SoftSelect';
import SoftTypography from '../../../../../../components/SoftTypography';

const CartValueCreateOffer = () => {
  const [offerName, setOfferName] = useState('');
  const [offerType, setOfferType] = useState({ value: 'Cart Level Discount', label: 'Cart Level Discount' });

  const [count, setCount] = useState(1);
  const [mainCate, setMainCate] = useState('');
  const [catLevel1, setCatLevel1] = useState('');
  const [catLevel2, setCatLevel2] = useState('');

  const [itemCount, setItemCount] = useState(1);
  const [productName, setProductName] = useState('');
  const [barcodeNum, setBarcodeNum] = useState('');
  const [quantity, setQuantity] = useState('');
  const [batchNum, setBatchNum] = useState('');

  return (
    <DashboardLayout>
      <DashboardNavbar prevLink={true}/>
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12} lg={12} mt={3}>
            <SoftBox p={3} className="add-customer-other-details-box">
              <SoftBox>
                <SoftTypography variant="h6" fontWeight="bold">
                  Create Offers By Cart Value
                </SoftTypography>
              </SoftBox>
              <Grid container spacing={3} mt={1} direction="row" justifyContent="space-between">
                <Grid item xs={12} md={3} lg={3}>
                  <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                    <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                      Offer Type
                    </InputLabel>
                  </SoftBox>

                  <SoftSelect
                    onChange={(option) => setOfferType(option)}
                    value={offerType}
                    options={[
                      { value: 'Cart Level Discount', label: 'Cart Level Discount' },
                      { value: 'Freebie Offers', label: 'Freebie Offers' },
                      { value: 'Category Based', label: 'Category Based' },
                    ]}
                  />
                </Grid>
                <Grid item xs={12} md={3} lg={3}>
                  <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                    <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                      Offer Name
                    </InputLabel>
                  </SoftBox>
                  <SoftInput type="text" onChange={(e) => setOfferName(e.target.value)} />
                </Grid>
                <Grid item xs={12} md={3} lg={3}>
                  <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                    <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                      Minimum Cart Value
                    </InputLabel>
                  </SoftBox>
                  <SoftInput type="number" onChange={(e) => setOfferName(e.target.value)} />
                </Grid>
                <Grid item xs={12} md={3} lg={3} mt={'10px'}>
                  <SoftBox mb={1} display="flex">
                    <InputLabel
                      required
                      sx={{ marginLeft: '5px', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}
                    >
                      Discount
                    </InputLabel>
                  </SoftBox>
                  <SoftBox className="boom-box">
                    <SoftInput
                      className="boom-input"
                      //   disabled={isGen ? true : false}
                      //   value={units}
                      // onChange={(e) => setGetDiscount(e.target.value)}
                      // value={getdiscount}
                      type="number"
                    />
                    <SoftBox>
                      <SoftSelect
                        menuPortalTarget={document.body}
                        styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                        // className="boom-soft-select"
                        // isDisabled={isGen ? true : false}
                        defaultValue={{ value: '%', label: '%' }}
                        // value={getdiscountType}
                        // onChange={(option) => setGetDiscountType(option)}
                        options={[
                          { value: '%', label: '%' },
                          { value: 'Rs', label: 'Rs.' },
                          { value: 'Falt Price', label: 'Flat Price' },
                        ]}
                      />
                    </SoftBox>
                  </SoftBox>
                </Grid>
              </Grid>
            </SoftBox>
            {offerType.label === 'Freebie Offers' ? (
              <SoftBox p={3} className="add-customer-other-details-box" mt={2}>
                <CartValueItem
                  itemCount={itemCount}
                  setItemCount={setItemCount}
                  productName={productName}
                  setProductName={setProductName}
                  barcodeNum={barcodeNum}
                  setBarcodeNum={setBarcodeNum}
                  quantity={quantity}
                  setQuantity={setQuantity}
                  batchNum={batchNum}
                  setBatchNum={setBatchNum}
                />
              </SoftBox>
            ) : null}
            {offerType.label === 'Category Based' ? (
              <SoftBox p={3} className="add-customer-other-details-box" mt={2}>
                <CartValueCategory
                  count={count}
                  setCount={setCount}
                  mainCate={mainCate}
                  setMainCate={setMainCate}
                  catLevel1={catLevel1}
                  setCatLevel1={setCatLevel1}
                  catLevel2={catLevel2}
                  setCatLevel2={setCatLevel2}
                />
              </SoftBox>
            ) : null}
            <SoftBox p={3} className="add-customer-other-details-box" mt={2}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={12} lg={12}>
                  <SoftBox display="flex" gap="30px" justifyContent="space-between">
                    <SoftTypography variant="h6">Schedule Offer</SoftTypography>
                  </SoftBox>
                </Grid>
                <Grid item xs={12} md={3} lg={3}>
                  <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                    <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                      Valid From
                    </InputLabel>
                  </SoftBox>
                  <SoftInput
                    type="date"
                    icon={{
                      component: <CalendarMonthOutlinedIcon />,
                      direction: 'right',
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={3} lg={3}>
                  <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                    <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                      Valid Upto
                    </InputLabel>
                  </SoftBox>
                  <SoftInput
                    type="date"
                    icon={{
                      component: <CalendarMonthOutlinedIcon />,
                      direction: 'right',
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={3} lg={3}>
                  <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                    <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                      Time From
                    </InputLabel>
                  </SoftBox>
                  <SoftInput type="time" />
                </Grid>
                <Grid item xs={12} md={3} lg={3}>
                  <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                    <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                      Time Upto
                    </InputLabel>
                  </SoftBox>
                  <SoftInput type="time" />
                </Grid>
              </Grid>

              <Grid container spacing={3} mt={1}>
                <Grid item xs={12} md={12} lg={12}>
                  <SoftBox display="flex" gap="30px" justifyContent="space-between">
                    <SoftTypography variant="h6">Select Channel</SoftTypography>
                  </SoftBox>
                </Grid>
                <Grid item xs={12} md={12} lg={12} mt={-1} ml={1}>
                  <FormGroup row>
                    <FormControlLabel control={<Checkbox />} label="RMS" />
                    <FormControlLabel control={<Checkbox />} label="POS" />
                    <FormControlLabel control={<Checkbox />} label="APP" />
                  </FormGroup>
                </Grid>
                <Grid item xs={12} md={4} xl={4} sx={{ marginTop: '-30px' }}>
                  <SoftBox className="textarea-box">
                    <SoftTypography fontSize="15px" fontWeight="bold">
                      Terms and Conditions (if any)
                    </SoftTypography>
                  </SoftBox>
                  <SoftBox style={{ marginTop: '10px' }}>
                    <TextareaAutosize
                      // defaultValue={comment}
                      // onChange={(e) => setComment(e.target.value)}
                      aria-label="minimum height"
                      minRows={3}
                      placeholder="Will be displayed on purchased order"
                      className="add-pi-textarea"
                    />
                  </SoftBox>
                </Grid>
              </Grid>
              <SoftBox mt={2} display="flex" justifyContent="flex-end" gap="20px">
                <SoftButton
                  className="vendor-second-btn"
                  //   onClick={handleCloseModal3}
                >
                  Cancel
                </SoftButton>
                <SoftButton
                  className="vendor-add-btn"
                  //   onClick={handleSubmit}
                  //   disabled={submitLoader ? true : false}
                >
                  {/* {submitLoader ? <Spinner size={20} /> : <>Submit</>} */}
                  Publish
                </SoftButton>
              </SoftBox>
            </SoftBox>
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  );
};

export default CartValueCreateOffer;
