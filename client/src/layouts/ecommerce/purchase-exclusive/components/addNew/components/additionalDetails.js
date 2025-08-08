import CancelIcon from '@mui/icons-material/Cancel';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import PercentIcon from '@mui/icons-material/Percent';
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  Modal,
  Radio,
  RadioGroup,
} from '@mui/material';
import { useEffect, useState } from 'react';
import SoftBox from '../../../../../../components/SoftBox';
import SoftInput from '../../../../../../components/SoftInput';
import SoftSelect from '../../../../../../components/SoftSelect';
import SoftTypography from '../../../../../../components/SoftTypography';
import { getInventoryDetails, getProductDetails } from '../../../../../../config/Services';
import DifferentItem from './differentItem';

const AdditionalDetails = ({
  openModal2,
  setOpenModal2,
  detailIndex,
  masterSellingPrice,
  setMasterSellingPrice,
  setSellingPrice,
  setExpDate,
  expDate,
  setQuantityRejected,
  quantityRejected,
  invoiceRefNo,
  invoiceValue,
  invoiceDate,
  vendorId,
  setDiffBuyQuantity,
  setDiffGetBarcodeNum,
  setDiffGetProductName,
  setDiffGetQuantity,
  diffBuyQuantity,
  diffGetBarcodeNum,
  diffGetProductName,
  diffGetQuantity,
  barcodeNum,
  productName,
  mrp,
  purchasePrice,
  sellingPrice,
  quantity,
  itemListArray,
  setOfferId,
  offerId,
  setOffers,
  offers,
  setOfferType,
  offerType,
  setOfferSubType,
  offerSubType,
  setOfferDetailsId,
  offerDetailsId,
  setInwardedQuantity,
  inwardedQuantity,
  setOfferDiscount,
  offerDiscount,
  setOfferDiscountType,
  offerDiscountType,
  count2,
  setCount2,
  fixedCount2,
  setFixedCount2,
  changedIGST,
  setChangedIGST,
  isChangedIGST,
  setIsChangedIGST,
  changedCGST,
  setChangedCGST,
  changedSGST,
  setChangedSGST,
  isChangedCGST,
  setIsChangedCGST,
  isChangedSGST,
  setIsChangedSGST,
  batchno,
  setItemCess,
  itemCess,
  setItemDiscount,
  itemDiscount,
  setItemDiscountType,
  itemDiscountType,
  handleBatchChange,
  previousPurchasePrice,
  setAddDraftProduct,
  getPreviousPurchsePrice,
}) => {
  const [offersAndPromotion, setOffersAndPromotion] = useState(false);
  const [addMoreChecked, setAddMoreChecked] = useState(true);
  const [valueChange, setValueChange] = useState(false);

  const handleOptionChange = (event) => {
    const update = [...offerSubType];
    update[detailIndex] = event.target.value;
    setOfferSubType(update);
  };

  const handleCloseModal = () => {
    setOpenModal2(false);
  };
  const locId = localStorage.getItem('locId');
  const [marginType, setMarginType] = useState('');
  const [sellingMargin, setSellingMargin] = useState('');
  const [igst, setIGST] = useState('');
  const [sgst, setSGST] = useState('');
  const [cgst, setCGST] = useState('');

  const handleBuyQuantityChange = (event) => {
    const update = [...diffBuyQuantity];
    update[detailIndex] = event.target.value;
    setDiffBuyQuantity(update);
  };

  const handleGetFreeQuantityChange = (event) => {
    const update = [...diffGetQuantity];
    update[detailIndex] = event.target.value;
    setDiffGetQuantity(update);
  };

  const handleCancel = () => {
    handleCloseModal();
  };

  useEffect(() => {
    if (
      !isNaN(mrp[detailIndex]) &&
      !isNaN(purchasePrice[detailIndex]) &&
      !isNaN(sellingPrice[detailIndex]) &&
      isFinite(mrp[detailIndex]) &&
      isFinite(purchasePrice[detailIndex]) &&
      isFinite(sellingPrice[detailIndex])
    ) {
      getInventoryDetails(locId, barcodeNum[detailIndex]).then((res) => {
        if (res.data.data.es === 0) {
          setMarginType(res?.data?.data?.data?.marginType);
          if (res?.data?.data?.data?.marginValue === null) {
            const marginValue = res?.data?.data?.data?.marginBasedOn;
            if (marginValue == 'mrp') {
              setSellingMargin(((mrp[detailIndex] - sellingPrice[detailIndex]) / mrp[detailIndex]) * 100);
            } else {
              setSellingMargin(
                ((sellingPrice[detailIndex] - purchasePrice[detailIndex]) / purchasePrice[detailIndex]) * 100,
              );
            }
          } else {
            setSellingMargin(res?.data?.data?.data?.marginValue);
          }
        }
      });
    }
  }, []);

  useEffect(() => {
    getPreviousPurchsePrice(barcodeNum[detailIndex], detailIndex);
  },[]);

  useEffect(() => {
    getProductDetails(barcodeNum[detailIndex])
      .then((res) => {
        setIGST(res?.data?.data?.igst);
        setSGST(res?.data?.data?.sgst);
        setCGST(res?.data?.data?.cgst);
      })
      .catch((err) => {});
  }, []);

  useEffect(() => {
    if (
      offerType[detailIndex] === 'FREE PRODUCTS' ||
      offerType[detailIndex] === 'OFFER ON MRP' ||
      offerType[detailIndex] === 'BUY X GET Y'
    ) {
      setOffersAndPromotion(true);
      const update = [...offers];
      update[detailIndex] = 'true';
      setOffers(update);
    } else {
      if (itemListArray[detailIndex] === undefined) {
        setOffersAndPromotion(false);
        const update = [...offers];
        update[detailIndex] = 'false';
        setOffers(update);
      } else if (itemListArray[detailIndex]?.offers !== null) {
        setOffersAndPromotion(true);
        const update = [...offers];
        update[detailIndex] = 'true';
        setOffers(update);
      } else if (itemListArray[detailIndex]?.offers === null) {
        setOffersAndPromotion(false);
        const update = [...offers];
        update[detailIndex] = 'false';
        setOffers(update);
      }
    }
  }, []);

  const optionArray = [
    { value: 'FREE PRODUCTS', label: 'FREE PRODUCTS' },
    { value: 'OFFER ON MRP', label: 'OFFER ON MRP' },
    { value: 'BUY X GET Y', label: 'BUY X GET Y' },
  ];

  const discountArray = [
    { value: '%', label: '%' },
    { value: 'Rs', label: 'Rs' },
  ];

  const discountItemArray = [
    { value: 'percentage', label: '%' },
    { value: 'rupee', label: 'Rs' },
  ];

  const cessArray = [
    { value: 0, label: '0 %' },
    { value: 1, label: '1 %' },
    { value: 3, label: '3 %' },
    { value: 5, label: '5 %' },
    { value: 12, label: '12 %' },
    { value: 15, label: '15 %' },
    { value: 17, label: '17 %' },
    { value: 21, label: '21 %' },
    { value: 22, label: '22 %' },
    { value: 36, label: '36 %' },
    { value: 60, label: '60 %' },
    { value: 61, label: '61 %' },
    { value: 65, label: '65 %' },
    { value: 71, label: '71 %' },
    { value: 72, label: '72 %' },
    { value: 89, label: '89 %' },
    { value: 96, label: '96 %' },
    { value: 142, label: '142 %' },
    { value: 160, label: '160 %' },
    { value: 204, label: '204 %' },
  ];

  const handlePromo = (e) => {
    setOffersAndPromotion(e.target.value === 'true');
    if (e.target.value === 'true') {
      const update = [...offers];
      update[detailIndex] = 'true';
      setOffers(update);
    } else if (e.target.value === 'false') {
      const update = [...offers];
      update[detailIndex] = 'false';
      setOffers(update);

      const updateOfferType = [...offerType];
      updateOfferType[detailIndex] = null;
      setOfferType(updateOfferType);
    }
  };

  const handleOffer = (option) => {
    const update = [...offerType];
    update[detailIndex] = option.value;
    setOfferType(update);

    if (
      option.value === 'BUY X GET Y' &&
      offerSubType[detailIndex] !== 'SAME ITEM' &&
      offerSubType[detailIndex] !== 'DIFFERENT ITEM'
    ) {
      const updateOfferType = [...offerSubType];
      updateOfferType[detailIndex] = 'SAME ITEM';
      setOfferSubType(updateOfferType);
    }
  };

  const handleInwardChange = (e) => {
    const updated = JSON.parse(JSON.stringify(inwardedQuantity));
    if (updated[detailIndex] === null || updated[detailIndex] === undefined) {
      updated[detailIndex] = [];
    }
    updated[detailIndex][0] = e.target.value;
    setInwardedQuantity(updated);

    const updatedProductName = JSON.parse(JSON.stringify(diffGetProductName));
    if (updatedProductName[detailIndex] === null || updatedProductName[detailIndex] === undefined) {
      updatedProductName[detailIndex] = [];
    }
    updatedProductName[detailIndex][0] = productName[detailIndex];
    setDiffGetProductName(updatedProductName);

    const updatedBarcodeNum = JSON.parse(JSON.stringify(diffGetBarcodeNum));
    if (updatedBarcodeNum[detailIndex] === null || updatedBarcodeNum[detailIndex] === undefined) {
      updatedBarcodeNum[detailIndex] = [];
    }
    updatedBarcodeNum[detailIndex][0] = barcodeNum[detailIndex];
    setDiffGetBarcodeNum(updatedBarcodeNum);
  };

  const handleOfferDiscount = (e) => {
    const update = [...offerDiscount];
    update[detailIndex] = e.target.value;
    setOfferDiscount(update);

    const value = e.target.value / 100;
    const amount = mrp[detailIndex] * value;
    let newMrp = mrp[detailIndex];

    if (offerDiscountType[detailIndex] === 'Rs') {
      newMrp = mrp[detailIndex] - e.target.value;
    } else if (offerDiscountType[detailIndex] === '%') {
      newMrp = mrp[detailIndex] - amount;
    }
    const updatedSellingPrice = [...sellingPrice];
    updatedSellingPrice[detailIndex] = newMrp;
    setSellingPrice(updatedSellingPrice);

    const updatedMasterSellingPrice = [...masterSellingPrice];
    updatedMasterSellingPrice[detailIndex] = 'manual';
    setMasterSellingPrice(updatedMasterSellingPrice);
  };

  const handelDiscount = (option) => {
    const update = [...offerDiscountType];
    update[detailIndex] = option.value;
    setOfferDiscountType(update);

    if (offerDiscount[detailIndex]) {
      const value = offerDiscount[detailIndex] / 100;
      const amount = mrp[detailIndex] * value;
      let newMrp = mrp[detailIndex];

      if (option.value === 'Rs') {
        newMrp = mrp[detailIndex] - offerDiscount[detailIndex];
      } else if (option.value === '%') {
        newMrp = mrp[detailIndex] - amount;
      }
      const updatedSellingPrice = [...sellingPrice];
      updatedSellingPrice[detailIndex] = newMrp;
      setSellingPrice(updatedSellingPrice);

      const updatedMasterSellingPrice = [...masterSellingPrice];
      updatedMasterSellingPrice[detailIndex] = 'manual';
      setMasterSellingPrice(updatedMasterSellingPrice);
    }
  };

  const handleCess = (option) => {
    const updatedCess = [...itemCess];
    updatedCess[detailIndex] = option.value;
    setItemCess(updatedCess);

    setTimeout(() => {
      setAddDraftProduct(true);
    }, 700);
  };

  const handleDiscountChange = (e) => {
    const inputValue = e.target.value;
    const regex = /^\d*\.?\d{0,2}$/; //upto 2 decimal places
    // If the input value matches the regular expression or it's an empty string,
    // update the state with the new value
    if (regex.test(inputValue) || inputValue === '') {
      const updatedDisc = [...itemDiscount];
      updatedDisc[detailIndex] = inputValue;
      setItemDiscount(updatedDisc);
      if(itemDiscountType[detailIndex] ==='rupee'|| itemDiscountType[detailIndex] ==='percentage'){
        setTimeout(() => {
          setAddDraftProduct(true);
        }, 700);
      }
    }
  };

  const handleChangeDiscType = (option) => {
    const updatedDiscType = [...itemDiscountType];
    updatedDiscType[detailIndex] = option.value;
    setItemDiscountType(updatedDiscType);
    setTimeout(() => {
      setAddDraftProduct(true);
    }, 700);
  };

  return (
    <Modal
      open={openModal2}
      onClose={handleCloseModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="modal-pi-border"
    >
      <Box
        className="pi-box-inventory"
        sx={{
          position: 'absolute',
          top: '35%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          width: '50vw',
          overflow: 'auto',
          maxHeight: '80vh',
        }}
      >
        <Box
          sx={{
            position: 'sticky',
            top: 0,
            backgroundColor: 'white',
            padding: '5px',
            marginRight: '10px',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <IconButton edge="end" color="inherit" onClick={handleCloseModal} aria-label="close">
            <CancelIcon color="error" />
          </IconButton>
        </Box>
        <Grid container spacing={1} p={1} mt={-9}>
          <Grid item xs={12} md={12} ml={0.5} mt={2} p={2} className="create-pi-card">
            <Grid container spacing={1} p={1}>
              <Grid item xs={12} md={6}>
                <SoftBox mb={1} ml={0.5} lineHeight={0} display="flex">
                  <InputLabel sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.9rem', color: '#344767' }}>
                    Batch No.
                  </InputLabel>
                </SoftBox>
                <SoftInput
                  type="text"
                  disabled={
                    vendorId === '' || invoiceRefNo === '' || invoiceValue === '' || invoiceDate === '' ? true : false
                  }
                  value={batchno[detailIndex]}
                  onChange={(e) => {
                    handleBatchChange(e, detailIndex);
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <SoftBox mb={1} ml={0.5} lineHeight={0} display="flex">
                  <InputLabel sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.9rem', color: '#344767' }}>
                    Expiry date
                  </InputLabel>
                </SoftBox>
                <SoftInput
                  type="date"
                  disabled={
                    vendorId === '' || invoiceRefNo === '' || invoiceValue === '' || invoiceDate === '' ? true : false
                  }
                  value={expDate[detailIndex]}
                  onChange={(e) => {
                    const updatedexpDate = [...expDate];
                    updatedexpDate[detailIndex] = e.target.value;
                    setExpDate(updatedexpDate);
                  }}
                />
              </Grid>
              {barcodeNum[detailIndex] && (
                <Grid item xs={12} md={6}>
                  <SoftBox mb={1} ml={0.5} lineHeight={0} display="flex">
                    <InputLabel sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.9rem', color: '#344767' }}>
                      Cess
                    </InputLabel>
                  </SoftBox>
                  <SoftSelect
                    className="boom-soft-select"
                    isDisabled={
                      vendorId === '' || invoiceRefNo === '' || invoiceValue === '' || invoiceDate === '' ? true : false
                    }
                    value={cessArray.find((option) => option.value === itemCess[detailIndex]) || ''}
                    onChange={(option) => {
                      handleCess(option);
                    }}
                    options={cessArray}
                  />
                </Grid>
              )}
              <Grid item xs={12} md={6}>
                <SoftBox mb={1} ml={0.5} lineHeight={0} display="flex">
                  <InputLabel sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.9rem', color: '#344767' }}>
                    Purchase Discount
                  </InputLabel>
                </SoftBox>
                <SoftBox className="boom-box">
                  <SoftInput
                    type="number"
                    disabled={
                      vendorId === '' || invoiceRefNo === '' || invoiceValue === '' || invoiceDate === '' ? true : false
                    }
                    value={itemDiscount[detailIndex]}
                    onChange={(e) => {
                      handleDiscountChange(e);
                    }}
                  />
                  <SoftBox className="boom-soft-box">
                    <SoftSelect
                      className="boom-soft-select"
                      isDisabled={
                        vendorId === '' || invoiceRefNo === '' || invoiceValue === '' || invoiceDate === ''
                          ? true
                          : false
                      }
                      value={discountItemArray?.find((option) => option.value === itemDiscountType[detailIndex]) || ''}
                      onChange={(option) => {
                        handleChangeDiscType(option);
                      }}
                      options={discountItemArray}
                    />
                  </SoftBox>
                </SoftBox>
              </Grid>
              {itemDiscountType[detailIndex] === 'percentage' && itemDiscount[detailIndex] > 100 && (
                <Grid item xs={12} md={12} mt={-0.5}>
                  <SoftBox mt="20px">
                    <SoftTypography fontSize="13px" style={{ color: 'red' }}>
                      <b>NOTE: </b>Discount should not be greater than 100 %
                    </SoftTypography>
                  </SoftBox>
                </Grid>
              )}

              <Grid item xs={12} md={12}>
                <Grid container direction="row" justifyContent="space-between" alignItems="center">
                  <Grid item xs={12} md={3.8} mt={-0.5}>
                    <SoftBox mb={1}>
                      <InputLabel
                        required
                        sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.9rem', color: '#344767' }}
                      >
                        Quantity Rejection
                      </InputLabel>
                    </SoftBox>
                    <SoftBox className="boom-box">
                      <SoftInput
                        type="number"
                        disabled={
                          vendorId === '' || invoiceRefNo === '' || invoiceValue === '' || invoiceDate === ''
                            ? true
                            : false
                        }
                        value={quantityRejected[detailIndex]}
                        onChange={(e) => {
                          const updatedQuantityRejected = [...quantityRejected];
                          updatedQuantityRejected[detailIndex] = e.target.value;
                          setQuantityRejected(updatedQuantityRejected);
                        }}
                      />
                      <SoftBox className="boom-soft-box">
                        <SoftSelect
                          className="boom-soft-select"
                          isDisabled={
                            vendorId === '' || invoiceRefNo === '' || invoiceValue === '' || invoiceDate === ''
                              ? true
                              : false
                          }
                          // value={spOption}
                          defaultValue={{ value: 'Wastage', label: 'Wastage' }}
                          // onChange={(option) => setSpOption(option)}
                          options={[
                            { value: 'Wastage', label: 'Wastage' },
                            { value: 'Return', label: 'Return' },
                          ]}
                        />
                      </SoftBox>
                    </SoftBox>
                  </Grid>
                  {barcodeNum[detailIndex] && (
                    <>
                      <Grid item xs={12} md={3.8}>
                        <SoftBox mb={1} ml={0.5} lineHeight={0} display="flex">
                          <InputLabel sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.9rem', color: '#344767' }}>
                            Previous P.P.
                          </InputLabel>
                        </SoftBox>
                        <SoftInput disabled value={Math.abs(Number(previousPurchasePrice[detailIndex]).toFixed(3))} />
                      </Grid>
                      <Grid item xs={12} md={3.8}>
                        <SoftBox mb={1} ml={0.5} lineHeight={0} display="flex">
                          <InputLabel sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.9rem', color: '#344767' }}>
                            Selling Margin
                          </InputLabel>
                        </SoftBox>
                        <SoftInput
                          type="number"
                          disabled
                          value={Math.abs(Number(sellingMargin).toFixed(3))}
                          icon={{
                            component: marginType === 'Rs' ? <CurrencyRupeeIcon /> : <PercentIcon />,
                            direction: 'right',
                          }}
                        />
                      </Grid>
                    </>
                  )}
                </Grid>
              </Grid>
              {barcodeNum[detailIndex] && (
                <>
                  <Grid item xs={12} md={12}>
                    <Grid container direction="row" justifyContent="space-between" alignItems="center">
                      <Grid item xs={12} md={3.8}>
                        <SoftBox mb={1} ml={0.5} lineHeight={0} display="flex">
                          <InputLabel sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.9rem', color: '#344767' }}>
                            IGST
                          </InputLabel>
                        </SoftBox>
                        <SoftInput
                          // value={igst}
                          disabled
                          type="number"
                          value={
                            isChangedIGST[detailIndex] === 'true' && isChangedIGST[detailIndex] !== ''
                              ? changedIGST[detailIndex]
                              : igst
                                ? Number(igst)
                                : ''
                          }
                          icon={{
                            component: '%',
                            direction: 'right',
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={3.8}>
                        <SoftBox mb={1} ml={0.5} lineHeight={0} display="flex">
                          <InputLabel sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.9rem', color: '#344767' }}>
                            CGST
                          </InputLabel>
                        </SoftBox>
                        <SoftInput
                          disabled
                          type="number"
                          value={
                            isChangedCGST[detailIndex] === 'true' && isChangedCGST[detailIndex] !== ''
                              ? changedCGST[detailIndex]
                              : cgst
                                ? Number(cgst)
                                : ''
                          }
                          icon={{
                            component: '%',
                            direction: 'right',
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={3.8}>
                        <SoftBox mb={1} ml={0.5} lineHeight={0} display="flex">
                          <InputLabel sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.9rem', color: '#344767' }}>
                            SGST
                          </InputLabel>
                        </SoftBox>
                        <SoftInput
                          disabled
                          type="number"
                          value={
                            isChangedSGST[detailIndex] === 'true' && isChangedSGST[detailIndex] !== ''
                              ? changedSGST[detailIndex]
                              : sgst
                                ? Number(sgst)
                                : ''
                          }
                          icon={{
                            component: '%',
                            direction: 'right',
                          }}
                        />
                      </Grid>
                      <SoftBox mt="20px">
                        <SoftTypography fontSize="16px" style={{ color: 'red' }}>
                          * The GST change is only applicable on this purchase. Selected product will still be sold at{' '}
                          <b>{igst}%</b>
                        </SoftTypography>
                      </SoftBox>
                    </Grid>
                  </Grid>
                </>
              )}
            </Grid>
          </Grid>

          {/* OFFERS & PROMO */}

          {barcodeNum[detailIndex] && (
            <Grid item xs={12} md={12} ml={0.5} mt={2} p={2} className="create-pi-card">
              <Grid item xs={12} md={6} ml={0.5} p={1}>
                <SoftBox mb={1} ml={0.5} lineHeight={0} display="flex">
                  <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#344767' }}>
                    Offers & Promotion
                  </InputLabel>
                </SoftBox>
                <SoftBox>
                  <RadioGroup
                    row
                    aria-labelledby="demo-radio-buttons-group-label"
                    name="offersAndPromotion"
                    value={offersAndPromotion}
                    onChange={(e) => {
                      setOffersAndPromotion(e.target.value === 'true');
                      handlePromo(e);
                    }}
                  >
                    <FormControlLabel
                      value="true"
                      control={<Radio size="small" />}
                      label={<span style={{ fontSize: '0.75rem' }}>Yes</span>}
                    />
                    <span style={{ marginRight: '20px' }}></span>
                    <FormControlLabel
                      value="false"
                      control={<Radio size="small" />}
                      label={<span style={{ fontSize: '0.75rem' }}>No</span>}
                    />
                  </RadioGroup>
                </SoftBox>
              </Grid>
              {offersAndPromotion ? (
                <>
                  <Grid item xs={12} md={6} ml={0.5} p={1}>
                    <SoftBox mb={1} ml={0.5} lineHeight={0} display="flex">
                      <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>Type</InputLabel>
                    </SoftBox>
                    <SoftSelect
                      value={optionArray.find((option) => option.value === offerType[detailIndex]) || ''}
                      onChange={(option) => handleOffer(option)}
                      options={optionArray}
                    />
                  </Grid>
                </>
              ) : null}

              {offersAndPromotion && offerType[detailIndex] === 'FREE PRODUCTS' ? (
                <Grid item xs={12} md={6} p={1}>
                  <SoftBox mb={1} ml={0.5} lineHeight={0} display="flex">
                    <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>Quantity</InputLabel>
                  </SoftBox>
                  <SoftInput
                    type="number"
                    disabled={
                      vendorId === '' || invoiceRefNo === '' || invoiceValue === '' || invoiceDate === '' ? true : false
                    }
                    value={inwardedQuantity[detailIndex] !== undefined ? inwardedQuantity[detailIndex][0] : ''}
                    onChange={(e) => {
                      handleInwardChange(e);
                    }}
                  />
                  <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px', gap: '1px' }}>
                    <Checkbox
                      checked
                      onChange={(e) => setAddMoreChecked(e.target.checked)}
                      name="addMore"
                      color="primary"
                    />
                    <SoftBox ml={2} lineHeight={0} display="flex">
                      <InputLabel sx={{ margin: 'auto', fontSize: '0.7rem', color: '#344767' }}>
                        Does not add to your purchase cost
                      </InputLabel>
                    </SoftBox>
                  </div>
                </Grid>
              ) : offersAndPromotion && offerType[detailIndex] === 'OFFER ON MRP' ? (
                <Grid item xs={12} md={6} mt={1} p={1}>
                  <SoftBox mt={1.3}>
                    <SoftBox mb={1}>
                      <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                        Offer Value
                      </InputLabel>
                    </SoftBox>
                    <SoftBox className="boom-box" mt={1}>
                      <SoftInput
                        className="boom-input"
                        disabled={
                          vendorId === '' || invoiceRefNo === '' || invoiceValue === '' || invoiceDate === ''
                            ? true
                            : false
                        }
                        value={offerDiscount[detailIndex]}
                        onChange={(e) => handleOfferDiscount(e)}
                        type="number"
                      />
                      <SoftBox className="boom-soft-box">
                        <SoftSelect
                          className="boom-soft-select"
                          isDisabled={
                            vendorId === '' || invoiceRefNo === '' || invoiceValue === '' || invoiceDate === ''
                              ? true
                              : false
                          }
                          value={discountArray.find((option) => option.value === offerDiscountType[detailIndex]) || ''}
                          onChange={(option) => handelDiscount(option)}
                          options={discountArray}
                        />
                      </SoftBox>
                    </SoftBox>
                  </SoftBox>
                </Grid>
              ) : offersAndPromotion && offerType[detailIndex] === 'BUY X GET Y' ? (
                <>
                  <Grid item xs={12} md={8} p={1}>
                    <SoftBox display="flex" justifyContent="space-evenly" gap="5px" alignItems="center">
                      <Grid container direction="row" justifyContent="space-evenly" alignItems="center">
                        <Grid>
                          <InputLabel sx={{ margin: 'auto', fontSize: '0.75rem', color: '#344767' }}>Buy</InputLabel>
                        </Grid>
                        <Grid>
                          <SoftBox width="70px">
                            <SoftInput
                              type="number"
                              value={diffBuyQuantity[detailIndex]}
                              onChange={handleBuyQuantityChange}
                            />
                          </SoftBox>
                        </Grid>
                        <Grid>
                          <InputLabel sx={{ margin: 'auto', fontSize: '0.75rem', color: '#344767' }}>Get</InputLabel>
                        </Grid>
                        <Grid>
                          <SoftBox width="70px">
                            <SoftInput
                              type="number"
                              value={
                                offerSubType[detailIndex] === 'DIFFERENT ITEM' &&
                                inwardedQuantity[detailIndex]?.length > 1
                                  ? inwardedQuantity[detailIndex]?.length
                                  : diffGetQuantity[detailIndex]
                              }
                              onChange={handleGetFreeQuantityChange}
                            />
                          </SoftBox>
                        </Grid>
                        <Grid>
                          <InputLabel sx={{ margin: 'auto', fontSize: '0.75rem', color: '#344767' }}>Free</InputLabel>
                        </Grid>
                      </Grid>
                    </SoftBox>
                  </Grid>

                  <Grid item xs={12} md={12} p={1}>
                    <SoftBox>
                      <FormControl component="fieldset" sx={{ marginLeft: '10px' }}>
                        <RadioGroup
                          row
                          aria-labelledby="demo-radio-buttons-group-label"
                          name="itemOption"
                          value={offerSubType[detailIndex] ? offerSubType[detailIndex] : 'SAME ITEM'}
                          onChange={handleOptionChange}
                        >
                          <FormControlLabel
                            value="SAME ITEM"
                            control={<Radio size="small" />}
                            label={<span style={{ fontSize: '0.75rem' }}>Same Item</span>}
                          />
                          <span style={{ marginRight: '20px' }}></span>
                          <FormControlLabel
                            value="DIFFERENT ITEM"
                            control={<Radio size="small" />}
                            label={<span style={{ fontSize: '0.75rem' }}>Different Item</span>}
                          />
                        </RadioGroup>
                      </FormControl>
                    </SoftBox>
                  </Grid>
                </>
              ) : null}

              {offersAndPromotion &&
              offerType[detailIndex] === 'BUY X GET Y' &&
              offerSubType[detailIndex] === 'SAME ITEM' ? (
                  <Grid container direction="row" alignItems="center" gap={2}>
                    <Grid>
                      <InputLabel sx={{ fontSize: '0.75rem', color: '#344767' }}>Free Product Quantity</InputLabel>
                    </Grid>
                    <Grid>
                      <SoftBox width="70px">
                        <SoftInput
                          type="number"
                          value={inwardedQuantity[detailIndex] !== undefined ? inwardedQuantity[detailIndex][0] : ''}
                          onChange={(e) => {
                            handleInwardChange(e);
                          }}
                        />
                      </SoftBox>
                    </Grid>
                  </Grid>
                ) : offersAndPromotion &&
                offerType[detailIndex] === 'BUY X GET Y' &&
                offerSubType[detailIndex] === 'DIFFERENT ITEM' ? (
                    <Grid item xs={12} md={12} p={1}>
                      <DifferentItem
                        detailIndex={detailIndex}
                        setDiffBuyQuantity={setDiffBuyQuantity}
                        setDiffGetBarcodeNum={setDiffGetBarcodeNum}
                        setDiffGetProductName={setDiffGetProductName}
                        setDiffGetQuantity={setDiffGetQuantity}
                        diffBuyQuantity={diffBuyQuantity}
                        diffGetBarcodeNum={diffGetBarcodeNum}
                        diffGetProductName={diffGetProductName}
                        diffGetQuantity={diffGetQuantity}
                        inwardedQuantity={inwardedQuantity}
                        setInwardedQuantity={setInwardedQuantity}
                        barcodeNum={barcodeNum}
                        productName={productName}
                        quantity={quantity}
                        count2={count2}
                        setCount2={setCount2}
                        fixedCount2={fixedCount2}
                        setFixedCount2={setFixedCount2}
                      />
                    </Grid>
                  ) : null}
            </Grid>
          )}
        </Grid>
      </Box>
    </Modal>
  );
};

export default AdditionalDetails;
