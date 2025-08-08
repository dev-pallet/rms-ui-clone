import CancelIcon from '@mui/icons-material/Cancel';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import PercentIcon from '@mui/icons-material/Percent';
import {
  Autocomplete,
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
  TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useDebounce } from 'usehooks-ts';
import SoftBox from '../../../../../../components/SoftBox';
import SoftInput from '../../../../../../components/SoftInput';
import SoftSelect from '../../../../../../components/SoftSelect';
import SoftTypography from '../../../../../../components/SoftTypography';
import {
  getInventoryDetails,
  getItemsInfo,
  getProductDetails,
  previPurchasePrice,
  verifyBatch,
} from '../../../../../../config/Services';
import { useSnackbar } from '../../../../../../hooks/SnackbarProvider';
import { buttonStyles } from '../../../../Common/buttonColor';
import SoftButton from '../../../../../../components/SoftButton';

const GRNAdditionalDetail = ({
  openAdditionModal,
  handleCloseAddModal,
  rowData,
  setRowData,
  index,
  handleInputChange,
  handleAddEXPOProduct,
  setInputIndex,
  setItemChanged,
  setValueChange,
  openFullScreen,
  isItemChanged,
}) => {
  const showSnackbar = useSnackbar();
  const locId = localStorage.getItem('locId');
  const orgId = localStorage.getItem('orgId');
  const [marginType, setMarginType] = useState('');
  const [sellingMargin, setSellingMargin] = useState('');
  const [igst, setIGST] = useState('');
  const [sgst, setSGST] = useState('');
  const [cgst, setCGST] = useState('');
  const [batchCheck, setBatchCheck] = useState('');
  const debouncedValue = useDebounce(batchCheck, 700);
  const [batchBarcodePairs, setBatchBarcodePairs] = useState([]);
  const [addMoreChecked, setAddMoreChecked] = useState(true);
  const [curentProductName, setCurentProductName] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(null);
  const debounceProductName = useDebounce(curentProductName, 500);
  const [autocompleteTitleOptions, setAutocompleteTitleOptions] = useState([]);
  const [autocompleteBarcodeOptions, setAutocompleteBarcodeOptions] = useState([]);

  useEffect(() => {
    if (
      !isNaN(rowData[index]?.mrp) &&
      !isNaN(rowData[index]?.purchasePrice) &&
      !isNaN(rowData[index]?.sellingPrice) &&
      isFinite(rowData[index]?.mrp) &&
      isFinite(rowData[index]?.purchasePrice) &&
      isFinite(rowData[index]?.sellingPrice)
    ) {
      getInventoryDetails(locId, rowData[index]?.itemNo).then((res) => {
        if (res.data.data.es === 0) {
          setMarginType(res?.data?.data?.data?.marginType);
          if (res?.data?.data?.data?.marginValue === null) {
            const marginValue = res?.data?.data?.data?.marginBasedOn;
            if (marginValue == 'mrp') {
              setSellingMargin(((rowData[index]?.mrp - rowData[index]?.sellingPrice) / rowData[index]?.mrp) * 100);
            } else {
              setSellingMargin(
                ((rowData[index]?.sellingPrice - rowData[index]?.purchasePrice) / rowData[index]?.purchasePrice) * 100,
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
    getProductDetails(rowData[index]?.itemNo)
      .then((res) => {
        setIGST(res?.data?.data?.igst);
        setSGST(res?.data?.data?.sgst);
        setCGST(res?.data?.data?.cgst);
      })
      .catch((err) => {});

    getPreviousPurchsePrice(rowData[index]?.itemNo);
  }, []);

  useEffect(() => {
    if (debouncedValue !== '') {
      const verifyBatches = async () => {
        const lastBatchPair = batchBarcodePairs[batchBarcodePairs.length - 1];
        if (lastBatchPair) {
          const { batchNumber, barcode, indexValue } = lastBatchPair;
          try {
            const res = await verifyBatch(locId, barcode, batchNumber);
            if (res?.data?.data?.object?.available === true) {
              showSnackbar('Batch already present, add different batch', 'error');
              const updatedBatchNos = [...rowData];
              updatedBatchNos[index]['batchNumber'] = '';
              setRowData(updatedBatchNos);
            }
          } catch (err) {}
        }
      };

      verifyBatches();
    }
  }, [debouncedValue]);

  useEffect(() => {
    if (debounceProductName !== '' || debounceProductName !== undefined) {
      const searchProduct = async () => {
        const searchText = debounceProductName;
        const isNumber = !isNaN(+searchText);
        const payload = {
          page: 1,
          pageSize: '100',
          names: [searchText],
          supportedStore: [locId],
        };
        if (searchText !== '') {
          if (isNumber) {
            payload.gtin = [searchText];
            payload.names = [];
          } else {
            payload.gtin = [];
            payload.names = [searchText];
          }
        } else {
          payload.gtin = [];
          payload.names = [];
        }
        if (searchText.length >= 3) {
          getItemsInfo(payload)
            .then(function (response) {
              if (response?.data?.status === 'SUCCESS') {
                if (response?.data?.data?.products.length === 0) {
                  const updatedData = [...rowData];
                  if (updatedData[index]?.offers?.offerDetailsList) {
                    !isNumber
                      ? (updatedData[index].offers.offerDetailsList[selectedIndex].itemName = searchText)
                      : (updatedData[index].offers.offerDetailsList[selectedIndex].gtin = searchText);
                    setRowData(updatedData);
                  }
                  setSelectedIndex(null);
                } else if (isNumber && response?.data?.data?.products.length === 1) {
                  selectProduct(response?.data?.data?.products[0], selectedIndex);
                } else {
                  if (!isNumber) {
                    setAutocompleteTitleOptions(response?.data?.data?.products);
                  } else {
                    setAutocompleteBarcodeOptions(response?.data?.data?.products);
                  }
                }
              }
            })
            .catch((err) => {});
        } else if (searchText === '0') {
        }
      };
      searchProduct();
    }
  }, [debounceProductName]);

  const getPreviousPurchsePrice = (gtin) => {
    previPurchasePrice(gtin, orgId)
      .then((res) => {
        const response = res?.data?.data;
        const updatedPreviousPP = [...rowData];
        updatedPreviousPP[index]['previousPurchasePrice'] =
          response?.previousPurchasePrice === 'NA' ? 0 : response?.previousPurchasePrice;
        setRowData(updatedPreviousPP);
      })
      .catch((err) => {
        const updatedPreviousPP = [...rowData];
        updatedPreviousPP[index]['previousPurchasePrice'] = 0;
        setRowData(updatedPreviousPP);
      });
  };

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

  const discountArray = [
    { value: '%', label: '%' },
    { value: 'Rs', label: 'Rs' },
  ];

  const discountItemArray = [
    { value: 'percentage', label: '%' },
    { value: 'rupee', label: 'Rs' },
  ];

  const optionArray = [
    { value: 'FREE_PRODUCTS', label: 'FREE PRODUCTS' },
    { value: 'OFFER_ON_MRP', label: 'OFFER ON MRP' },
    { value: 'BUY_X_GET_Y', label: 'BUY X GET Y' },
  ];

  const handleBatchChange = (e, index) => {
    const currentBarcode = rowData[index]?.itemNo;
    if (currentBarcode !== undefined && currentBarcode !== '') {
      setBatchCheck(e.target.value);

      const updatedBatchBarcodePairs = [];
      updatedBatchBarcodePairs[index] = {
        batchNumber: e.target.value,
        barcode: currentBarcode.toString(),
        indexValue: index,
      };
      setBatchBarcodePairs(updatedBatchBarcodePairs);

      const updatedBatchNos = [...rowData];
      updatedBatchNos[index]['batchNumber'] = e.target.value;
      setRowData(updatedBatchNos);
      setItemChanged(true);
    } else {
      showSnackbar('Enter product details', 'error');
    }
  };

  const handleCess = (option) => {
    const updatedCess = [...rowData];
    updatedCess[index]['cess'] = option.value;
    setRowData(updatedCess);

    setInputIndex(index);
    setItemChanged(true);
    setValueChange(option.value);
    // setTimeout(() => {
    //   handleAddEXPOProduct();
    // }, 1000);
  };

  const handleDiscountChange = (e) => {
    const inputValue = e.target.value;
    const regex = /^\d*\.?\d{0,2}$/; //upto 2 decimal places
    // If the input value matches the regular expression or it's an empty string,
    // update the state with the new value
    if (regex.test(inputValue) || inputValue === '') {
      const updatedDisc = [...rowData];
      updatedDisc[index]['discount'] = inputValue;
      setRowData(updatedDisc);
      setItemChanged(true);
      if (rowData[index]?.discountType === 'rupee' || rowData[index]?.discountType === 'percentage') {
        // setTimeout(() => {
        //   handleAddEXPOProduct();
        // }, 1000);
        setInputIndex(index);
        setValueChange(inputValue);
      }
    }
  };

  const handleChangeDiscType = (option) => {
    const updatedDiscType = [...rowData];
    updatedDiscType[index]['discountType'] = option.value;
    setRowData(updatedDiscType);
    setItemChanged(true);
    // setTimeout(() => {
    //   handleAddEXPOProduct();
    // }, 1000);
    setInputIndex(index);
    setValueChange(option.value);
  };

  const handleOfferType = (index, value) => {
    const updatedData = [...rowData];
    updatedData[index].offers.offerType = value;
    updatedData[index].offers.offerName = value;
    updatedData[index].offers.offerSubType = value === 'BUY_X_GET_Y' ? 'SAME ITEM' : null;
    updatedData[index].offers.offerDetailsList = [];
    const newOfferDetails = {
      offerDetailsId: null,
      offerId: rowData[index]?.offerId || null,
      gtin: '',
      batchNo: null,
      getQuantity: value === 'BUY_X_GET_Y' ? 1 : null,
      inwardedQuantity: null,
      offerDiscount: null,
      itemName: '',
      discountType: null,
    };
    updatedData[index].offers.offerDetailsList.push(newOfferDetails);
    setRowData(updatedData);
  };

  const handleOfferChange = (index, fieldName, value, offerType) => {
    const updatedData = [...rowData];
    if (updatedData[index]?.offers?.offerDetailsList) {
      const offerDetails = updatedData[index].offers.offerDetailsList[0];
      offerDetails.offerId = rowData[index]?.offerId || null;
      offerDetails.offerDetailsId = offerDetails?.offerDetailsId || null;
      offerDetails.batchNo = null;
      offerDetails.itemName = rowData[index]?.itemName;
      offerDetails.gtin = rowData[index]?.itemNo;
      offerDetails[fieldName] = value;

      if (offerType === 'OFFER_ON_MRP' && fieldName === 'offerDiscount') {
        offerDetails.inwardedQuantity = null;
        offerDetails.offerDiscount = rowData[index]?.offers?.offerDetailsList[0]?.offerDiscount || null;
        offerDetails.discountType = rowData[index]?.offers?.offerDetailsList[0]?.discountType || null;
        const newValue = value / 100;
        let newMrp = rowData[index]?.mrp;
        const amount = newMrp * newValue;
        if (offerDetails.discountType === 'Rs') {
          newMrp = newMrp - value;
        } else if (offerDetails.discountType === '%') {
          newMrp = newMrp - amount;
        }
        updatedData[index]['sellingPrice'] = newMrp;
        updatedData[index]['masterSellingPrice'] = 'manual';
      } else if (offerType === 'OFFER_ON_MRP' && fieldName === 'discountType') {
        offerDetails.inwardedQuantity = null;
        offerDetails.offerDiscount = rowData[index]?.offers?.offerDetailsList[0]?.offerDiscount || null;
        offerDetails.discountType = rowData[index]?.offers?.offerDetailsList[0]?.discountType || null;
        if (offerDetails?.offerDiscount) {
          const newValue = offerDetails?.offerDiscount / 100;
          let newMrp = rowData[index]?.mrp;
          const amount = newMrp * newValue;

          if (value === 'Rs') {
            newMrp = newMrp - offerDetails?.offerDiscount;
          } else if (value === '%') {
            newMrp = newMrp - amount;
          }
          updatedData[index]['sellingPrice'] = newMrp;
          updatedData[index]['masterSellingPrice'] = 'manual';
        }
      } else {
        offerDetails.offerDiscount = null;
        offerDetails.discountType = null;
      }
      setRowData(updatedData);
      setItemChanged(true);
    }
  };

  const handlSameBuyQuant = (index, value) => {
    const updatedData = [...rowData];
    if (updatedData[index]?.offers) {
      updatedData[index].offers.buyQuantity = value;
      setRowData(updatedData);
      setItemChanged(true);
    }
  };

  const handleOptionChange = (index, value) => {
    const updatedData = [...rowData];
    if (updatedData[index]?.offers) {
      updatedData[index].offers.offerSubType = value;
      setRowData(updatedData);
      setItemChanged(true);
    }
  };

  const handleAddRow = () => {
    const updatedData = [...rowData];
    const newOfferDetails = {
      offerDetailsId: null,
      offerId: rowData[index]?.offerId || null,
      gtin: '',
      batchNo: null,
      getQuantity: rowData[index]?.offers?.offerDetailsList[0]?.getQuantity || 1,
      inwardedQuantity: null,
      offerDiscount: null,
      itemName: '',
      discountType: null,
    };
    updatedData[index].offers.offerDetailsList.push(newOfferDetails);
    setRowData(updatedData);
  };

  const handleChangeIO = (e, newIndex) => {
    setCurentProductName(e.target.value);
    setSelectedIndex(newIndex);
  };

  const selectProduct = (item, newIndex) => {
    setCurentProductName('');
    setAutocompleteTitleOptions([]);
    setAutocompleteBarcodeOptions([]);
    const updatedData = [...rowData];
    if (updatedData[index]?.offers?.offerDetailsList) {
      updatedData[index].offers.offerDetailsList[newIndex].itemName = item?.name;
      updatedData[index].offers.offerDetailsList[newIndex].gtin = item?.gtin;
      setRowData(updatedData);
    }
    setSelectedIndex(null);
  };

  const handleInputDiffQuant = (newIndex, value) => {
    const updatedData = [...rowData];
    if (updatedData[index]?.offers?.offerDetailsList) {
      updatedData[index].offers.offerDetailsList[newIndex].offerDetailsId =
        updatedData[index]?.offers?.offerDetailsList[newIndex]?.offerDetailsId || null;
      updatedData[index].offers.offerDetailsList[newIndex].inwardedQuantity = value;
      setRowData(updatedData);
      setItemChanged(true);
    }
  };
  const handleDltItem = (newIndex) => {
    const updatedRowData = [...rowData];
    updatedRowData[index].offers.offerDetailsList.splice(newIndex, 1);
    setRowData(updatedRowData);
  };

  const handleSave = () => {
    if (isItemChanged) {
      handleAddEXPOProduct();
    }
    handleCloseAddModal();
  };
  return (
    <Modal
      open={openAdditionModal}
      onClose={handleCloseAddModal}
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
          <IconButton edge="end" color="inherit" onClick={handleCloseAddModal} aria-label="close">
            <CancelIcon color="error" />
          </IconButton>
        </Box>
        <Grid container spacing={1} p={1} mt={-9}>
          <Grid item xs={12} md={12} ml={0.5} mt={2} p={2} className="create-pi-card">
            <Grid container spacing={1} p={1}>
              {!openFullScreen && (
                <>
                  <Grid item xs={12} md={6}>
                    <SoftBox mb={1} ml={0.5} lineHeight={0} display="flex">
                      <InputLabel sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.9rem', color: '#344767' }}>
                        Batch No.
                      </InputLabel>
                    </SoftBox>
                    <SoftInput
                      type="text"
                      value={rowData[index]?.batchNumber}
                      onChange={(e) => {
                        handleBatchChange(e, index);
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
                      value={rowData[index]?.expiryDate}
                      onChange={(e) => {
                        handleInputChange(index, 'expiryDate', e.target.value);
                      }}
                    />
                  </Grid>
                </>
              )}
              {rowData[index]?.itemNo && (
                <Grid item xs={12} md={6}>
                  <SoftBox mb={1} ml={0.5} lineHeight={0} display="flex">
                    <InputLabel sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.9rem', color: '#344767' }}>
                      Cess
                    </InputLabel>
                  </SoftBox>
                  <SoftSelect
                    className="boom-soft-select"
                    value={cessArray.find((option) => option.value == rowData[index]?.cess) || ''}
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
                    value={rowData[index]?.discount}
                    onChange={(e) => {
                      handleDiscountChange(e);
                    }}
                  />
                  <SoftBox className="boom-soft-box">
                    <SoftSelect
                      className="boom-soft-select"
                      value={discountItemArray?.find((option) => option.value === rowData[index]?.discountType) || ''}
                      onChange={(option) => {
                        handleChangeDiscType(option);
                      }}
                      options={discountItemArray}
                    />
                  </SoftBox>
                </SoftBox>
              </Grid>
              {rowData[index]?.discountType === 'percentage' && rowData[index]?.discount > 100 && (
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
                        value={rowData[index]?.quantityRejected}
                        onChange={(e) => {
                          handleInputChange(index, 'quantityRejected', e.target.value);
                        }}
                      />
                      <SoftBox className="boom-soft-box">
                        <SoftSelect
                          className="boom-soft-select"
                          value={rowData[index]?.reason || ''}
                          defaultValue={{ value: 'Wastage', label: 'Wastage' }}
                          onChange={(option) => handleInputChange(index, 'reason', option.value)}
                          options={[
                            { value: 'Wastage', label: 'Wastage' },
                            { value: 'Return', label: 'Return' },
                          ]}
                        />
                      </SoftBox>
                    </SoftBox>
                  </Grid>
                  {rowData[index]?.itemNo && (
                    <>
                      <Grid item xs={12} md={3.8}>
                        <SoftBox mb={1} ml={0.5} lineHeight={0} display="flex">
                          <InputLabel sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.9rem', color: '#344767' }}>
                            Previous P.P.
                          </InputLabel>
                        </SoftBox>
                        <SoftInput
                          disabled
                          value={Math.abs(Number(rowData[index]?.previousPurchasePrice).toFixed(3))}
                        />
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
              {rowData[index]?.itemNo && (
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
                          value={igst}
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
                          value={cgst}
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
                          value={sgst}
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
                  value={rowData[index]?.offerPresent === 'true' ? true : false}
                  onChange={(e) => {
                    handleInputChange(index, 'offerPresent', e.target.value);
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
            {rowData[index]?.offerPresent === 'true' ? (
              <Grid item xs={12} md={6} ml={0.5} p={1}>
                <SoftBox mb={1} ml={0.5} lineHeight={0} display="flex">
                  <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>Type</InputLabel>
                </SoftBox>
                <SoftSelect
                  value={optionArray.find((option) => option.value === rowData[index]?.offers?.offerType) || ''}
                  onChange={(option) => handleOfferType(index, option.value)}
                  options={optionArray}
                />
              </Grid>
            ) : null}
            {rowData[index]?.offers?.offerType === 'FREE_PRODUCTS' ? (
              <Grid item xs={12} md={6} p={1}>
                <SoftBox mb={1} ml={0.5} lineHeight={0} display="flex">
                  <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>Quantity</InputLabel>
                </SoftBox>
                <SoftInput
                  type="number"
                  value={
                    rowData[index]?.offers?.offerDetailsList
                      ? rowData[index]?.offers?.offerDetailsList[0]?.inwardedQuantity
                      : ''
                  }
                  onChange={(e) => handleOfferChange(index, 'inwardedQuantity', e.target.value, 'FREE_PRODUCTS')}
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
            ) : rowData[index]?.offers?.offerType === 'OFFER_ON_MRP' ? (
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
                      value={
                        rowData[index]?.offers?.offerDetailsList
                          ? rowData[index]?.offers?.offerDetailsList[0]?.offerDiscount
                          : ''
                      }
                      onChange={(e) => handleOfferChange(index, 'offerDiscount', e.target.value, 'OFFER_ON_MRP')}
                      type="number"
                    />
                    <SoftBox className="boom-soft-box">
                      <SoftSelect
                        className="boom-soft-select"
                        value={discountArray.find((option) =>
                          option.value === rowData[index]?.offers?.offerDetailsList
                            ? rowData[index]?.offers?.offerDetailsList[0]?.discountType
                            : '',
                        )}
                        onChange={(option) => handleOfferChange(index, 'discountType', option.value, 'OFFER_ON_MRP')}
                        options={discountArray}
                      />
                    </SoftBox>
                  </SoftBox>
                </SoftBox>
              </Grid>
            ) : rowData[index]?.offers?.offerType === 'BUY_X_GET_Y' ? (
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
                            value={rowData[index]?.offers ? rowData[index]?.offers?.buyQuantity : ''}
                            onChange={(e) => handlSameBuyQuant(index, e.target.value)}
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
                              rowData[index]?.offers?.offerDetailsList
                                ? rowData[index]?.offers?.offerDetailsList[0]?.getQuantity
                                : ''
                            }
                            onChange={(e) => handleOfferChange(index, 'getQuantity', e.target.value, 'BUY_X_GET_Y')}
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
                        value={rowData[index]?.offers ? rowData[index]?.offers?.offerSubType : 'SAME ITEM'}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
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

            {rowData[index]?.offers?.offerSubType === 'SAME ITEM' ? (
              <Grid container direction="row" alignItems="center" gap={2}>
                <Grid>
                  <InputLabel sx={{ fontSize: '0.75rem', color: '#344767' }}>Free Product Quantity</InputLabel>
                </Grid>
                <Grid>
                  <SoftBox width="70px">
                    <SoftInput
                      type="number"
                      value={
                        rowData[index]?.offers?.offerDetailsList
                          ? rowData[index]?.offers?.offerDetailsList[0]?.inwardedQuantity
                          : ''
                      }
                      onChange={(e) => handleOfferChange(index, 'inwardedQuantity', e.target.value, 'BUY_X_GET_Y')}
                    />
                  </SoftBox>
                </Grid>
              </Grid>
            ) : rowData[index]?.offers?.offerSubType === 'DIFFERENT ITEM' ? (
              <Grid container direction="row" alignItems="center" gap={2}>
                <Grid item xs={12} md={12}>
                  <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                    <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>Buy</InputLabel>
                  </SoftBox>
                  <SoftBox display="flex" style={{ overflowX: 'auto' }} gap="5px">
                    <SoftBox mt={1} style={{ width: '100%' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr>
                            <th className="express-grn-barcode-column">Barcode</th>
                            <th className="express-grn-barcode-column">Title</th>
                            <th className="express-grn-barcode-column">Quantity</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="express-grn-rows">
                              <SoftBox className="express-grn-product-box">{rowData[index]?.itemNo}</SoftBox>
                            </td>
                            <td className="express-grn-rows">
                              <SoftBox className="express-grn-product-box">{rowData[index]?.itemName}</SoftBox>
                            </td>
                            <td className="express-grn-rows">
                              <SoftBox className="express-grn-product-box">{rowData[index]?.quantityOrdered}</SoftBox>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </SoftBox>
                  </SoftBox>
                </Grid>
                <Grid item xs={12} md={12}>
                  <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                    <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                      Get (Add Free Product)
                    </InputLabel>
                  </SoftBox>
                  <SoftBox display="flex" style={{ overflowX: 'auto' }} gap="5px">
                    <SoftBox mt={1} style={{ width: '100%' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr>
                            <th className="express-grn-barcode-column">Barcode</th>
                            <th className="express-grn-barcode-column">Title</th>
                            <th className="express-grn-barcode-column">Quantity</th>
                            <th className="express-grn-barcode-column">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rowData[index]?.offers?.offerDetailsList?.map((row, index) => {
                            return (
                              <tr key={row.itemId}>
                                <td className="express-grn-rows">
                                  <SoftBox className="express-grn-product-box">
                                    {row.gtin !== '' ? (
                                      <TextField value={row.gtin} readOnly={true} style={{ width: '100%' }} />
                                    ) : (
                                      <Autocomplete
                                        freeSolo
                                        options={autocompleteBarcodeOptions}
                                        getOptionLabel={(option) => option.gtin}
                                        onChange={(e, newValue) => {
                                          selectProduct(newValue, index);
                                        }}
                                        onInputChange={(e, newInputValue) => {
                                          handleChangeIO({ target: { value: newInputValue } }, index);
                                        }}
                                        style={{ width: '100%' }}
                                        renderInput={(params) => (
                                          <TextField
                                            {...params}
                                            inputProps={{
                                              ...params.inputProps,
                                              onKeyDown: (e) => {
                                                if (e.key === 'Enter') {
                                                  e.stopPropagation();
                                                }
                                              },
                                            }}
                                            type="number"
                                            style={{ width: '100%' }}
                                          />
                                        )}
                                      />
                                    )}
                                  </SoftBox>
                                </td>
                                <td className="express-grn-rows">
                                  <SoftBox className="express-grn-product-box">
                                    {row.itemName !== '' ? (
                                      <TextField value={row.itemName} readOnly={true} style={{ width: '100%' }} />
                                    ) : (
                                      <Autocomplete
                                        freeSolo
                                        options={autocompleteTitleOptions}
                                        getOptionLabel={(option) => option.name}
                                        onChange={(e, newValue) => {
                                          selectProduct(newValue, index);
                                        }}
                                        onInputChange={(e, newInputValue) => {
                                          handleChangeIO({ target: { value: newInputValue } }, index);
                                        }}
                                        style={{ width: '100%' }}
                                        renderInput={(params) => (
                                          <TextField
                                            {...params}
                                            inputProps={{
                                              ...params.inputProps,
                                              onKeyDown: (e) => {
                                                if (e.key === 'Enter') {
                                                  e.stopPropagation();
                                                }
                                              },
                                            }}
                                            style={{ width: '100%' }}
                                          />
                                        )}
                                      />
                                    )}
                                  </SoftBox>
                                </td>
                                <td className="express-grn-rows">
                                  <SoftInput
                                    value={row.inwardedQuantity || ''}
                                    onChange={(e) => handleInputDiffQuant(index, e.target.value)}
                                  />
                                </td>
                                <td className="express-grn-rows">
                                  <CancelIcon
                                    color="error"
                                    style={{ cursor: 'pointer', fontSize: '20px' }}
                                    onClick={() => handleDltItem(index)}
                                  />
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </SoftBox>
                  </SoftBox>
                  <SoftTypography
                    className="add-more-text"
                    component="label"
                    variant="caption"
                    fontWeight="bold"
                    onClick={handleAddRow}
                    style={{ cursor: 'pointer' }}
                  >
                    + Add More Items
                  </SoftTypography>
                </Grid>
              </Grid>
            ) : null}
          </Grid>
        </Grid>

        <SoftBox display="flex" justifyContent="flex-end" alignItems="center" gap="20px" marginTop="5px">
          {/* <SoftButton
                variant={buttonStyles.secondaryVariant}
                className="outlined-softbutton"
                onClick={handleCloseProdModal}
              >
                Cancel
              </SoftButton> */}
          <SoftButton
            variant={buttonStyles.primaryVariant}
            className="contained-softbutton vendor-add-btn"
            onClick={handleSave}
          >
            Save
          </SoftButton>
        </SoftBox>
      </Box>
    </Modal>
  );
};

export default GRNAdditionalDetail;
