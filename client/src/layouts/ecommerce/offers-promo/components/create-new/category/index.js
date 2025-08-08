import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  InputLabel,
  TextField,
  TextareaAutosize,
} from '@mui/material';
import {
  createOfferAndPromo,
  getAllBrands,
  getAllLevel1Category,
  getAllLevel2Category,
  getAllMainCategory,
} from '../../../../../../config/Services';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../../../../../hooks/SnackbarProvider';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import CancelIcon from '@mui/icons-material/Cancel';
import DashboardLayout from '../../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../../examples/Navbars/DashboardNavbar';
import MultipleProductCategory from './multipleProd';
import React, { useEffect, useState } from 'react';
import SoftBox from '../../../../../../components/SoftBox';
import SoftButton from '../../../../../../components/SoftButton';
import SoftInput from '../../../../../../components/SoftInput';
import SoftSelect from '../../../../../../components/SoftSelect';
import SoftTypography from '../../../../../../components/SoftTypography';
import Spinner from '../../../../../../components/Spinner';
import StepCategoryPromotion from './stepPromo';

const CategoryCreateOffer = () => {
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
  const [offerType, setOfferType] = useState({ value: 'BUY X GET DISCOUNT', label: 'Buy X Category Get Discount' });

  const [count, setCount] = useState(1);
  const [mainCate, setMainCate] = useState('');
  const [catLevel1, setCatLevel1] = useState('');
  const [catLevel2, setCatLevel2] = useState('');
  const [brandName, setBrandName] = useState('');
  const [discount, setDiscount] = useState('');
  const [quantity, setQuantity] = useState('');
  const [discountType, setDiscountType] = useState('');
  const [mainCatOption, setMainCatOption] = useState([]);
  const [catLevel1Option, setCatLevel1Option] = useState([]);
  const [catLevel2Option, setCatLevel2Option] = useState([]);
  const [brandOption, setBrandOption] = useState([]);

  // const [count, setCount] = useState(1);
  const [productName, setProductName] = useState('');
  const [barcodeNum, setBarcodeNum] = useState('');
  const [mrp, setMrp] = useState('');
  // const [discount, setDiscount] = useState('');
  // const [discountType, setDiscountType] = useState('');
  const [getQuantity, setGetQuantity] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [batchNum, setBatchNum] = useState('');
  const [allAvailableUnits, setAllAvailableUnits] = useState([]);

  const [selectedLabels, setSelectedLabels] = useState([]);
  const [validFrom, setValidFrom] = useState('');
  const [validUpto, setValidUpto] = useState('');
  const [timeFrom, setTimeFrom] = useState('');
  const [timeUpto, setTimeUpto] = useState('');
  const currentDate = new Date();
  const formattedCurrentDate = currentDate.toISOString().slice(0, 10);

  useEffect(() => {
    handleMainCategory();
    handleBrand();
  }, []);

  const handleOfferType = (option) => {
    setOfferType(option);
    setCatLevel1Option([]);
    setCatLevel2Option([]);
    setCount(1);
    setMainCate('');
    setCatLevel1('');
    setCatLevel2('');
    setBrandName('');
    setDiscount('');
    setQuantity('');
    setDiscountType('');
    setProductName('');
    setMrp('');
    setGetQuantity('');
    setSellingPrice('');
    setBatchNum('');
  };

  const handleBrand = () => {
    const payload = {
      page: 1,
      pageSize: 20,
      sourceId: [orgId],
      sourceLocationId: [locId],
    };
    getAllBrands(payload)
      .then((res) => {
        const response = res?.data?.data?.results;
        if (response.length > 0) {
          const arr = [];
          arr.push(
            response.map((e) => ({
              value: e?.brandId,
              label: e?.brandName,
            })),
          );
          setBrandOption(arr[0]);
        }
      })
      .catch((err) => {
        showSnackbar(err?.response?.data?.message || 'Some error occured', 'error');
      });
  };
  const handleMainCategory = () => {
    const payload = {
      page: 1,
      pageSize: 100,
    };
    getAllMainCategory(payload)
      .then((res) => {
        const response = res?.data?.data?.results;
        if (response.length > 0) {
          const arr = [];
          arr.push(
            response.map((e) => ({
              value: e?.mainCategoryId,
              label: e?.categoryName,
            })),
          );
          setMainCatOption(arr[0]);
        }
      })
      .catch((err) => {
        showSnackbar(err?.response?.data?.message || 'Some error occured', 'error');
      });
  };

  const handleCatLevel1 = (e) => {
    setMainCate(e.label);
    const payload = {
      page: 1,
      pageSize: 100,
      mainCategoryId: [e.value],
    };
    getAllLevel1Category(payload)
      .then((res) => {
        const response = res?.data?.data?.results;
        if (response.length > 0) {
          const arr = [];
          arr.push(
            response.map((e) => ({
              value: e?.level1Id,
              label: e?.categoryName,
            })),
          );
          setCatLevel1Option(arr[0]);
          setCatLevel2Option([]);
        }
      })
      .catch((err) => {
        showSnackbar(err?.response?.data?.message || 'Some error occured', 'error');
      });
  };
  const handleCatLevel2 = (e) => {
    setCatLevel1(e.label);
    const payload = {
      page: 1,
      pageSize: 100,
      level1Id: [e.value],
    };
    getAllLevel2Category(payload)
      .then((res) => {
        const response = res?.data?.data?.results;
        if (response.length > 0) {
          const arr = [];
          arr.push(
            response.map((e) => ({
              value: e?.level2Id,
              label: e?.categoryName,
            })),
          );
          setCatLevel2Option(arr[0]);
        }
      })
      .catch((err) => {
        showSnackbar(err?.response?.data?.message || 'Some error occured', 'error');
      });
  };

  const handleDelete = () => {
    setDiscount('');
    setDiscountType('');
    setCatLevel1Option([]);
    setCatLevel2Option([]);
    setMainCate('');
    setCatLevel2('');
    setCatLevel1('');
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
      mainGtin: null,
      mainGtinBatchNo: null,
      mainItemName: null,
      offerName: offerName,
      offerType: offerType.value,
      offerSubType: null,
      createdBy: uidx,
      createdByName: user_name,
      modifiedBy: uidx,
      modifiedByName: user_name,
      withBatch: false,
      creator: !isHeadOffice ? 'HO' : 'LOC', //(HO/ ORG/ LOC)
      applicable: !isHeadOffice ? 'HO' : 'ORG/LOC', //  HO_ORG_LOC("HO/ORG/LOC"), HO_ORG("HO/ORG"),ORG_LOC("ORG/LOC"),HO("HO"),ALL("ALL");
      validFrom: formatDateTime(new Date(validFrom)),
      validUpto: formatDateTime(new Date(validUpto)),
      timeFrom: timeFrom || '',
      timeUpto: timeUpto || '',
      creationType: 'Offers',
      offerStatus: formattedCurrentDate === validFrom ? 'ACTIVE' : 'INACTIVE',
      channels: selectedLabels,
      mainOfferItemList: [],
    };
    if (offerType.label === 'Buy X Category Get Discount') {
      (payload.mainCategory = mainCate ? mainCate : null),
        (payload.level1Category = catLevel1 ? catLevel1 : null),
        (payload.level2Category = catLevel2 ? catLevel2 : null),
        (payload.brands = brandName ? [brandName] : null),
        (payload.offerDetailsEntityList = [
          {
            gtin: null,
            batchNo: null,
            itemName: null,
            buyQuantity: quantity[0],
            offerDiscount: discount,
            discountType: discountType?.value,
            getQuantity: null,
            flatPrice: null,
          },
        ]);
    }
    if (offerType.label === 'Step Promotions') {
      const itemArrayList = Array.from({ length: count }).map((_, index) => ({
        gtin: null,
        batchNo: null,
        itemName: null,
        buyQuantity: quantity[index],
        offerDiscount: discount[index],
        discountType: discountType[index],
        getQuantity: null,
        flatPrice: null,
      }));
      payload.offerDetailsEntityList = itemArrayList;
      payload.mainCategory = mainCate ? mainCate[0] : null;
      payload.level1Category = catLevel1[0] === '' ? null : catLevel1[0];
      payload.level2Category = catLevel2[0] === '' ? null : catLevel2[0];
      payload.brands = brandName[0] === '' ? null : [brandName[0]];
      payload.buyQuantity = null;
    }
    if (offerType.label === 'Buy X Category Get Discount on Y Product') {
      const itemArrayList = Array.from({ length: count }).map((_, index) => ({
        gtin: barcodeNum[0],
        batchNo: batchNum[index],
        itemName: productName[0],
        buyQuantity: quantity[0],
        offerDiscount: discount[index],
        discountType: discountType[index],
        getQuantity: getQuantity[index],
        flatPrice: null,
      }));
      payload.offerDetailsEntityList = itemArrayList;
      (payload.mainCategory = mainCate ? mainCate : null),
        (payload.level1Category = catLevel1 ? catLevel1 : null),
        (payload.level2Category = catLevel2 ? catLevel2 : null),
        (payload.brands = brandName ? [brandName] : null),
        (payload.buyQuantity = quantity[0]);
    }
    if (offerName === '') {
      showSnackbar('Enter offer name', 'warning');
    } else if (!mainCate) {
      if (!brandName) {
        showSnackbar('Select category or brand', 'warning');
      }
    } else if (discount === '') {
      showSnackbar('Enter discount', 'warning');
    } else if (Array.isArray(discount) && discount.includes('')) {
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
                  Create Offers By Category
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
                      { value: 'BUY X GET DISCOUNT', label: 'Buy X Category Get Discount' },
                      { value: 'STEP PROMOTIONS', label: 'Step Promotions' },
                      { value: 'BUY X GET DISCOUNT ON Y', label: 'Buy X Category Get Discount on Y Product' },
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
                <StepCategoryPromotion
                  count={count}
                  setCount={setCount}
                  mainCate={mainCate}
                  setMainCate={setMainCate}
                  catLevel1={catLevel1}
                  setCatLevel1={setCatLevel1}
                  catLevel2={catLevel2}
                  setCatLevel2={setCatLevel2}
                  discount={discount}
                  setDiscount={setDiscount}
                  discountType={discountType}
                  quantity={quantity}
                  setQuantity={setQuantity}
                  setDiscountType={setDiscountType}
                  mainCatOption={mainCatOption}
                  setMainCatOption={setMainCatOption}
                  brandOption={brandOption}
                  setBrandOption={setBrandOption}
                  catLevel1Option={catLevel1Option}
                  setCatLevel1Option={setCatLevel1Option}
                  catLevel2Option={catLevel2Option}
                  setCatLevel2Option={setCatLevel2Option}
                  brandName={brandName}
                  setBrandName={setBrandName}
                />
              ) : (
                <SoftBox>
                  <SoftBox display="flex" gap="30px" justifyContent="space-between">
                    <SoftTypography variant="h6">Category Details (Buy X)</SoftTypography>
                  </SoftBox>
                  <SoftBox
                    style={{
                      maxHeight: '500px',
                      overflowX: 'scroll',
                    }}
                  >
                    <SoftBox mt={1} style={{ minWidth: '900px' }}>
                      <Grid container spacing={1} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                        <Grid item xs={0.7} sm={0.7} md={0.7} mt={'10px'}>
                          <SoftBox mb={1} display="flex">
                            <InputLabel
                              sx={{ marginLeft: '5px', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}
                            >
                              S No.
                            </InputLabel>
                          </SoftBox>
                          <SoftBox display="flex" alignItems="center" gap="10px">
                            <SoftInput readOnly={true} value={1} />
                          </SoftBox>
                        </Grid>
                        <Grid item xs={2} sm={2} md={2} mt={'10px'}>
                          <SoftBox mb={1} display="flex">
                            <InputLabel
                              required
                              sx={{ marginLeft: '5px', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}
                            >
                              Select Main Category
                            </InputLabel>
                          </SoftBox>
                          <SoftBox display="flex" alignItems="center" gap="10px">
                            {mainCate ? (
                              <TextField
                                value={mainCate}
                                readOnly={true}
                                style={{
                                  width: '100%',
                                }}
                              />
                            ) : (
                              <SoftSelect
                                menuPortalTarget={document.body}
                                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                                options={mainCatOption}
                                onChange={(e) => handleCatLevel1(e)}
                              />
                            )}
                          </SoftBox>
                        </Grid>
                        <Grid item xs={2} sm={2} md={2} mt={'10px'}>
                          <SoftBox mb={1} display="flex">
                            <InputLabel
                              sx={{ marginLeft: '5px', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}
                            >
                              Select Category Level 1
                            </InputLabel>
                          </SoftBox>
                          <SoftBox display="flex" alignItems="center" gap="10px">
                            {catLevel1 ? (
                              <TextField
                                value={catLevel1}
                                readOnly={true}
                                style={{
                                  width: '100%',
                                }}
                              />
                            ) : (
                              <SoftSelect
                                menuPortalTarget={document.body}
                                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                                options={catLevel1Option}
                                // value={catLevel1}
                                onChange={(e) => handleCatLevel2(e)}
                              />
                            )}
                          </SoftBox>
                        </Grid>
                        <Grid item xs={2} sm={2} md={2} mt={'10px'}>
                          <SoftBox mb={1} display="flex">
                            <InputLabel
                              sx={{ marginLeft: '5px', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}
                            >
                              Select Category Level 2
                            </InputLabel>
                          </SoftBox>
                          <SoftBox display="flex" alignItems="center" gap="10px">
                            {catLevel2 ? (
                              <TextField
                                value={catLevel2}
                                readOnly={true}
                                style={{
                                  width: '100%',
                                }}
                              />
                            ) : (
                              <SoftSelect
                                menuPortalTarget={document.body}
                                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                                options={catLevel2Option}
                                // value={catLevel2}
                                onChange={(e) => setCatLevel2(e.label)}
                              />
                            )}
                          </SoftBox>
                        </Grid>
                        <Grid item xs={2} sm={2} md={2} mt={'10px'}>
                          <SoftBox mb={1} display="flex">
                            <InputLabel
                              required
                              sx={{ marginLeft: '5px', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}
                            >
                              Brand Name
                            </InputLabel>
                          </SoftBox>
                          <SoftBox display="flex" alignItems="center" gap="10px">
                            {brandName ? (
                              <TextField
                                value={brandName}
                                readOnly={true}
                                style={{
                                  width: '100%',
                                }}
                              />
                            ) : (
                              <SoftSelect
                                menuPortalTarget={document.body}
                                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                                options={brandOption}
                                onChange={(e) => setBrandName(e.label)}
                              />
                            )}
                          </SoftBox>
                        </Grid>
                        <Grid item xs={1} sm={1} md={1} mt={'10px'}>
                          <SoftBox mb={1} display="flex">
                            <InputLabel
                              sx={{ marginLeft: '5px', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}
                            >
                              Quantity
                            </InputLabel>
                          </SoftBox>
                          <SoftBox display="flex" alignItems="center" gap="10px">
                            <SoftInput
                              type="number"
                              name="quantity"
                              value={quantity}
                              onChange={(e) => setQuantity(e.target.value)}
                            />
                          </SoftBox>
                        </Grid>
                        {offerType.label === 'Buy X Category Get Discount' && (
                          <Grid item xs={2} sm={2} md={2} mt={'10px'}>
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
                                onChange={(e) => setDiscount(e.target.value)}
                                value={discount}
                                type="number"
                              />
                              <SoftBox>
                                <SoftSelect
                                  menuPortalTarget={document.body}
                                  styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                                  // className="boom-soft-select"
                                  // isDisabled={isGen ? true : false}
                                  value={discountType}
                                  defaultValue={{ value: '%', label: '%' }}
                                  onChange={(option) => setDiscountType(option)}
                                  options={[
                                    { value: '%', label: '%' },
                                    { value: 'Rs', label: 'Rs.' },
                                  ]}
                                />
                              </SoftBox>
                            </SoftBox>
                          </Grid>
                        )}
                        <SoftBox mt={'49px'} width="20px" height="40px" style={{ cursor: 'pointer' }}>
                          <CancelIcon onClick={() => handleDelete()} fontSize="small" color="error" />
                        </SoftBox>
                      </Grid>
                    </SoftBox>
                  </SoftBox>
                </SoftBox>
              )}
            </SoftBox>
            {/* GET */}
            {offerType.label === 'Buy X Category Get Discount on Y Product' && (
              <SoftBox p={3} className="add-customer-other-details-box" mt={2}>
                <MultipleProductCategory
                  count={count}
                  setCount={setCount}
                  productName={productName}
                  setProductName={setProductName}
                  barcodeNum={barcodeNum}
                  setBarcodeNum={setBarcodeNum}
                  mrp={mrp}
                  setMrp={setMrp}
                  getQuantity={getQuantity}
                  setGetQuantity={setGetQuantity}
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
              </SoftBox>
            )}
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

export default CategoryCreateOffer;
