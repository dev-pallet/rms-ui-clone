import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  InputLabel,
  TextareaAutosize,
} from '@mui/material';
import { createOfferAndPromo } from '../../../../../../config/Services';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../../../../../hooks/SnackbarProvider';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import ComboOfferProducts from './components/comboOfferBatch';
import DashboardLayout from '../../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../../examples/Navbars/DashboardNavbar';
import OfferBUYX from './components/buyX';
import OfferGETY from './components/getY';
import React, { useState } from 'react';
import SoftBox from '../../../../../../components/SoftBox';
import SoftButton from '../../../../../../components/SoftButton';
import SoftInput from '../../../../../../components/SoftInput';
import SoftSelect from '../../../../../../components/SoftSelect';
import SoftTypography from '../../../../../../components/SoftTypography';
import Spinner from '../../../../../../components/Spinner';
import StepItemPromotion from './components/stepPromotion';

const ItemCreateOffer = () => {
  const showSnackbar = useSnackbar();
  const navigate = useNavigate();
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const isHeadOffice = localStorage.getItem('isHeadOffice');
  const user_name = localStorage.getItem('user_name');
  const user_details = JSON.parse(localStorage.getItem('user_details'));
  const uidx = user_details.uidx;
  const [submitLoader, setSubmitLoader] = useState(false);
  const [offerName, setOfferName] = useState('');
  const [offerType, setOfferType] = useState({ value: 'OFFER_ON_MRP', label: 'Offer on MRP' });
  const [count, setCount] = useState(1);
  const [productSelected, setProductSelected] = useState(false);
  const [autocompleteTitleOptions, setAutocompleteTitleOptions] = useState([]);
  const [autocompleteBarcodeOptions, setAutocompleteBarcodeOptions] = useState([]);
  const [curentProductName, setCurentProductName] = useState('');
  const [productName, setProductName] = useState('');
  const [barcodeNum, setBarcodeNum] = useState('');
  const [mrp, setMrp] = useState('');
  const [discount, setDiscount] = useState('');
  const [discountType, setDiscountType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [batchNum, setBatchNum] = useState('');

  const [allAvailableUnits, setAllAvailableUnits] = useState([]);
  const [offerProductSelected, setOfferProductSelected] = useState(false);
  const [offerAutocompleteTitleOptions, setOfferAutocompleteTitleOptions] = useState([]);
  const [offerAutocompleteBarcodeOptions, setOfferAutocompleteBarcodeOptions] = useState([]);
  const [offerCurentProductName, setOfferCurentProductName] = useState('');
  const [offerproductName, setOfferProductName] = useState('');
  const [offerbarcodeNum, setOfferBarcodeNum] = useState('');
  const [offermrp, setOfferMrp] = useState('');
  const [offerdiscount, setOfferDiscount] = useState('');
  const [offerdiscountType, setOfferDiscountType] = useState('');
  const [offerquantity, setOfferQuantity] = useState('');
  const [offersellingPrice, setOfferSellingPrice] = useState('');
  const [offerbatchNum, setOfferBatchNum] = useState('');

  const [selectedLabels, setSelectedLabels] = useState([]);
  const [validFrom, setValidFrom] = useState('');
  const [validUpto, setValidUpto] = useState('');
  const [timeFrom, setTimeFrom] = useState('');
  const [timeUpto, setTimeUpto] = useState('');
  const currentDate = new Date();
  const formattedCurrentDate = currentDate.toISOString().slice(0, 10);

  const handleOfferType = (option) => {
    setOfferType(option);
    setCount(1);
    setProductName('');
    setBarcodeNum('');
    setMrp('');
    setDiscount('');
    setDiscountType('');
    setQuantity('');
    setSellingPrice('');
    setBatchNum('');
    setAllAvailableUnits('');
    setOfferProductSelected(false);
    setOfferAutocompleteTitleOptions([]);
    setOfferAutocompleteBarcodeOptions([]);
    setOfferCurentProductName('');
    setOfferProductName('');
    setOfferBarcodeNum('');
    setOfferMrp('');
    setOfferDiscount('');
    setOfferDiscountType('');
    setOfferQuantity('');
    setOfferSellingPrice('');
    setOfferBatchNum('');
    setProductSelected(false);
  };

  const handleCheckboxChange = (label) => (event) => {
    if (event.target.checked) {
      setSelectedLabels((prevLabels) => [...prevLabels, label]);
    } else {
      setSelectedLabels((prevLabels) => prevLabels.filter((prevLabel) => prevLabel !== label));
    }
  };

  function formatDateTime(dateObject) {
    // Get the current time
    const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false });

    // Format the date
    const year = dateObject.getFullYear();
    const month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
    const day = dateObject.getDate().toString().padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    // Combine date and time
    const dateTimeString = `${formattedDate}T${currentTime}`;

    return dateTimeString;
  }

  const handleSubmit = () => {
    const payload = {
      locationId: locId,
      orgId: orgId,
      hoId: null,
      mainGtin: barcodeNum,
      mainGtinBatchNo: batchNum,
      mainItemName: productName,
      offerName: offerName,
      offerType: offerType.value,
      offerSubType: null,
      createdBy: uidx,
      createdByName: user_name,
      modifiedBy: uidx,
      modifiedByName: user_name,
      withBatch: true,
      creator: !isHeadOffice ? 'HO' : 'LOC', //(HO/ ORG/ LOC)
      applicable: !isHeadOffice ? 'HO' : 'ORG/LOC', //  HO_ORG_LOC("HO/ORG/LOC"), HO_ORG("HO/ORG"),ORG_LOC("ORG/LOC"),HO("HO"),ALL("ALL");
      mainCategory: null,
      level1Category: null,
      level2Category: null,
      validFrom: formatDateTime(new Date(validFrom)),
      validUpto: formatDateTime(new Date(validUpto)),
      timeFrom: timeFrom || '',
      timeUpto: timeUpto || '',
      creationType: 'Offers',
      brands: null,
      offerStatus: formattedCurrentDate === validFrom ? 'ACTIVE' : 'INACTIVE',
      channels: selectedLabels,
    };
    if (offerType.label === 'Offer on MRP' || offerType.label === 'Buy X Get Discount') {
      payload.mainOfferItemList = [
        {
          mainGtin: barcodeNum,
          mainGtinBatch: batchNum ? batchNum[0] : null,
          mainItemName: productName,
          buyQuantity: quantity,
        },
      ];
      payload.offerDetailsEntityList = [
        {
          gtin: barcodeNum,
          batchNo: batchNum ? batchNum[0] : null,
          itemName: productName,
          buyQuantity:  offerType.label === 'Offer on MRP' ? 1 : quantity,
          offerDiscount: discountType?.value === 'Flat Price' ? null : discount,
          discountType: discountType?.value,
          getQuantity: offerType.label === 'Offer on MRP' ? 1 : null,
          flatPrice: discountType.value === 'Flat Price' ? discount : null,
        },
      ];
      payload.mainGtinBatchNo = batchNum ? batchNum[0] : null;
      payload.buyQuantity = quantity;
    } else if (offerType.label === 'Buy X Get Discount on Y') {
      payload.mainOfferItemList = [
        {
          mainGtin: barcodeNum,
          mainGtinBatch: batchNum ? batchNum[0] : null,
          mainItemName: productName,
          buyQuantity: quantity,
        },
      ];
      payload.offerDetailsEntityList = [
        {
          gtin: offerbarcodeNum,
          batchNo: offerbatchNum ? offerbatchNum[0] : null,
          itemName: offerproductName,
          buyQuantity: quantity,
          offerDiscount: offerdiscountType?.value === 'Flat Price' ? null : offerdiscount,
          discountType: offerdiscountType?.value,
          getQuantity: offerquantity,
          flatPrice: offerdiscountType.value === 'Flat Price' ? offerdiscount : null,
        },
      ];
      payload.buyQuantity = quantity;
      payload.mainGtinBatchNo = batchNum ? batchNum[0] : null;
    } else if (offerType.label === 'Buy X Get Y Free') {
      payload.mainOfferItemList = [
        {
          mainGtin: barcodeNum,
          mainGtinBatch: batchNum ? batchNum[0] : null,
          mainItemName: productName,
          buyQuantity: quantity,
        },
      ];
      payload.offerDetailsEntityList = [
        {
          gtin: offerbarcodeNum,
          batchNo: offerbatchNum ? offerbatchNum[0] : null,
          itemName: offerproductName,
          buyQuantity: quantity,
          offerDiscount: null,
          discountType: null,
          getQuantity: offerquantity,
          flatPrice: null,
        },
      ];

      payload.buyQuantity = quantity;
      payload.mainGtinBatchNo = batchNum ? batchNum[0] : null;
      if (barcodeNum === offerbarcodeNum) {
        payload.offerSubType = 'SAME_ITEM';
      } else {
        payload.offerSubType = 'DIFFERENT_ITEM';
      }
    } else if (offerType.label === 'Combo Offer Discount') {
      const itemArrayList = Array.from({ length: count }).map((_, index) => ({
        mainGtin: barcodeNum[index],
        mainGtinBatch: batchNum[index] === '' ? null : batchNum[index],
        mainItemName: productName[index],
        buyQuantity: quantity[index],
      }));
      payload.mainOfferItemList = itemArrayList;
      payload.offerDetailsEntityList = [
        {
          gtin: null,
          batchNo: null,
          itemName: null,
          buyQuantity: null,
          offerDiscount: discountType?.value === 'Flat Price' ? null : discount,
          discountType: discountType?.value,
          getQuantity: null,
          flatPrice: discountType.value === 'Flat Price' ? discount : null,
        },
      ];
      payload.mainGtin = null;
      payload.mainGtinBatchNo = null;
      payload.mainItemName = null;
      payload.buyQuantity = null;
    } else if (offerType.label === 'Step Promotions') {
      const itemArrayList = Array.from({ length: count }).map((_, index) => ({
        mainGtin: barcodeNum[0],
        mainGtinBatch: batchNum[index] === '' ? null : batchNum[index],
        mainItemName: productName[0],
        buyQuantity: quantity[index],
      }));
      payload.mainOfferItemList = itemArrayList;
      const itemArrayList1 = Array.from({ length: count }).map((_, index) => ({
        gtin: barcodeNum[0],
        batchNo: batchNum[index] === '' ? null : batchNum[index],
        itemName: productName[0],
        buyQuantity: quantity[index],
        offerDiscount: discountType === 'Flat Price' ? null : discount[index],
        discountType: discountType[index],
        getQuantity: null,
        flatPrice: discountType[index] === 'Flat Price' ? discount[index] : null,
      }));
      payload.offerDetailsEntityList = itemArrayList1;
      payload.mainGtin = null;
      payload.mainGtinBatchNo = null;
      payload.mainItemName = null;
      payload.buyQuantity = null;
    }
    if (offerName === '') {
      showSnackbar('Enter offer name', 'warning');
    } else if (barcodeNum === '' || productName === '') {
      showSnackbar('Enter product details', 'warning');
    } else if (
      (offerType.label === 'Buy X Get Discount on Y' || offerType.label === 'Buy X Get Y Free') &&
      (offerbarcodeNum === '' || offerproductName === '' || offerquantity === '')
    ) {
      showSnackbar('Enter product details', 'warning');
    } else if (
      offerType.label === 'Step Promotions' &&
      (quantity.includes('') || discount.includes('') || discountType.includes(''))
    ) {
      showSnackbar('Enter product details', 'warning');
    } else if (
      offerType.label === 'Combo Offer Discount' &&
      (barcodeNum.includes('') || productName.includes('') || quantity.includes(''))
    ) {
      showSnackbar('Enter product details', 'warning');
    } else if (
      offerType.label !== 'Offer on MRP' &&
      offerType.label !== 'Buy X Get Discount on Y' &&
      offerType.label !== 'Buy X Get Y Free' &&
      discount === ''
    ) {
      showSnackbar('Enter discount', 'warning');
    } else if (offerType.label === 'Buy X Get Discount on Y' && offerdiscount === '') {
      showSnackbar('Enter discount', 'warning');
    } else if (validFrom === '') {
      showSnackbar('Enter valid from', 'warning');
    } else if (validUpto === '') {
      showSnackbar('Enter valid upto', 'warning');
    } else if (selectedLabels?.length === 0) {
      showSnackbar('Select sales channel', 'warning');
    } else {
      setSubmitLoader(true);
      createOfferAndPromo(payload)
        .then((res) => {
          setSubmitLoader(false);
          if (res?.data?.data?.es) {
            showSnackbar(res?.data?.data?.message, 'error');
            return;
          }
          navigate('/marketting/offers-promotions');
        })
        .catch((err) => {
          showSnackbar(err?.response?.data?.message, 'error');
          setSubmitLoader(false);
        });
    }
  };
  return (
    <DashboardLayout>
      <DashboardNavbar prevLink={true} />
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12} lg={12} mt={3}>
            <SoftBox p={3} className="add-customer-other-details-box">
              <SoftBox>
                <SoftTypography variant="h6" fontWeight="bold">
                  Create Offers By Item
                </SoftTypography>
              </SoftBox>
              <Grid container spacing={3} mt={1} direction="row" justifyContent="space-between">
                <Grid item xs={12} md={4} lg={4}>
                  <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                    <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                      Offer Type
                    </InputLabel>
                  </SoftBox>

                  <SoftSelect
                    onChange={(option) => handleOfferType(option)}
                    value={offerType}
                    options={[
                      { value: 'OFFER_ON_MRP', label: 'Offer on MRP' },
                      { value: 'BUY_X_GET_DISCOUNT', label: 'Buy X Get Discount' },
                      { value: 'STEP_PROMOTIONS', label: 'Step Promotions' },
                      { value: 'BUY_X_GET_DISCOUNT ON Y', label: 'Buy X Get Discount on Y' },
                      { value: 'COMBO_OFFER_DISCOUNT', label: 'Combo Offer Discount' },
                      { value: 'BUY_X_GET_Y', label: 'Buy X Get Y Free' },
                    ]}
                  />
                </Grid>
                <Grid item xs={12} md={4} lg={4}>
                  <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                    <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                      Offer Name
                    </InputLabel>
                  </SoftBox>
                  <SoftInput type="text" onChange={(e) => setOfferName(e.target.value)} />
                </Grid>
              </Grid>
            </SoftBox>
            {/* BUY */}
            <SoftBox p={3} className="add-customer-other-details-box" mt={2}>
              {offerType.label === 'Step Promotions' ? (
                <StepItemPromotion
                  count={count}
                  setCount={setCount}
                  productName={productName}
                  setProductName={setProductName}
                  barcodeNum={barcodeNum}
                  setBarcodeNum={setBarcodeNum}
                  mrp={mrp}
                  setMrp={setMrp}
                  discount={discount}
                  setDiscount={setDiscount}
                  discountType={discountType}
                  setDiscountType={setDiscountType}
                  quantity={quantity}
                  setQuantity={setQuantity}
                  sellingPrice={sellingPrice}
                  setSellingPrice={setSellingPrice}
                  batchNum={batchNum}
                  setBatchNum={setBatchNum}
                  allAvailableUnits={allAvailableUnits}
                  setAllAvailableUnits={setAllAvailableUnits}
                />
              ) : offerType.label === 'Combo Offer Discount' ? (
                <ComboOfferProducts
                  count={count}
                  setCount={setCount}
                  productName={productName}
                  setProductName={setProductName}
                  barcodeNum={barcodeNum}
                  setBarcodeNum={setBarcodeNum}
                  mrp={mrp}
                  setMrp={setMrp}
                  discount={discount}
                  setDiscount={setDiscount}
                  discountType={discountType}
                  setDiscountType={setDiscountType}
                  quantity={quantity}
                  setQuantity={setQuantity}
                  sellingPrice={sellingPrice}
                  setSellingPrice={setSellingPrice}
                  batchNum={batchNum}
                  setBatchNum={setBatchNum}
                  allAvailableUnits={allAvailableUnits}
                  setAllAvailableUnits={setAllAvailableUnits}
                />
              ) : (
                <OfferBUYX
                  productSelected={productSelected}
                  setProductSelected={setProductSelected}
                  autocompleteTitleOptions={autocompleteTitleOptions}
                  setAutocompleteTitleOptions={setAutocompleteTitleOptions}
                  autocompleteBarcodeOptions={autocompleteBarcodeOptions}
                  setAutocompleteBarcodeOptions={setAutocompleteBarcodeOptions}
                  curentProductName={curentProductName}
                  setCurentProductName={setCurentProductName}
                  productName={productName}
                  setProductName={setProductName}
                  barcodeNum={barcodeNum}
                  setBarcodeNum={setBarcodeNum}
                  mrp={mrp}
                  setMrp={setMrp}
                  discount={discount}
                  setDiscount={setDiscount}
                  discountType={discountType}
                  setDiscountType={setDiscountType}
                  quantity={quantity}
                  setQuantity={setQuantity}
                  sellingPrice={sellingPrice}
                  setSellingPrice={setSellingPrice}
                  batchNum={batchNum}
                  setBatchNum={setBatchNum}
                  offerType={offerType}
                  allAvailableUnits={allAvailableUnits}
                  setAllAvailableUnits={setAllAvailableUnits}
                  count={count}
                  setCount={setCount}
                />
              )}
            </SoftBox>
            {/* GET */}

            {offerType.label === 'Buy X Get Discount on Y' || offerType.label === 'Buy X Get Y Free' ? (
              <SoftBox p={3} className="add-customer-other-details-box" mt={2}>
                <OfferGETY
                  offerProductSelected={offerProductSelected}
                  setOfferProductSelected={setOfferProductSelected}
                  offerAutocompleteTitleOptions={offerAutocompleteTitleOptions}
                  setOfferAutocompleteTitleOptions={setOfferAutocompleteTitleOptions}
                  offerAutocompleteBarcodeOptions={offerAutocompleteBarcodeOptions}
                  setOfferAutocompleteBarcodeOptions={setOfferAutocompleteBarcodeOptions}
                  offerCurentProductName={offerCurentProductName}
                  setOfferCurentProductName={setOfferCurentProductName}
                  offerproductName={offerproductName}
                  setOfferProductName={setOfferProductName}
                  offerbarcodeNum={offerbarcodeNum}
                  setOfferBarcodeNum={setOfferBarcodeNum}
                  offermrp={offermrp}
                  setOfferMrp={setOfferMrp}
                  offerdiscount={offerdiscount}
                  setOfferDiscount={setOfferDiscount}
                  offerdiscountType={offerdiscountType}
                  setOfferDiscountType={setOfferDiscountType}
                  offerquantity={offerquantity}
                  setOfferQuantity={setOfferQuantity}
                  offersellingPrice={offersellingPrice}
                  setOfferSellingPrice={setOfferSellingPrice}
                  offerbatchNum={offerbatchNum}
                  setOfferBatchNum={setOfferBatchNum}
                  offerType={offerType}
                  allAvailableUnits={allAvailableUnits}
                  setAllAvailableUnits={setAllAvailableUnits}
                  count={count}
                  setCount={setCount}
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
                    onChange={(e) => setValidFrom(e.target.value)}
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
                    onChange={(e) => setValidUpto(e.target.value)}
                    icon={{
                      component: <CalendarMonthOutlinedIcon />,
                      direction: 'right',
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={3} lg={3}>
                  <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                    <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                      Time From
                    </InputLabel>
                  </SoftBox>
                  <SoftInput type="time" onChange={(e) => setTimeFrom(e.target.value)} />
                </Grid>
                <Grid item xs={12} md={3} lg={3}>
                  <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                    <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                      Time Upto
                    </InputLabel>
                  </SoftBox>
                  <SoftInput type="time" onChange={(e) => setTimeUpto(e.target.value)} />
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
                    <FormControlLabel control={<Checkbox onChange={handleCheckboxChange('RMS')} />} label="RMS" />
                    <FormControlLabel control={<Checkbox onChange={handleCheckboxChange('POS')} />} label="POS" />
                    <FormControlLabel control={<Checkbox onChange={handleCheckboxChange('APP')} />} label="APP" />
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
                <SoftButton className="vendor-second-btn" onClick={() => navigate('/marketting/offers-promotions')}>
                  Cancel
                </SoftButton>
                <SoftButton className="vendor-add-btn" onClick={handleSubmit} disabled={submitLoader ? true : false}>
                  {submitLoader ? <Spinner size={20} /> : <>Publish</>}
                </SoftButton>
              </SoftBox>
            </SoftBox>
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  );
};

export default ItemCreateOffer;
