import { Autocomplete, Box, Button, Card, CardContent, Grid, InputLabel, Modal, TextField } from '@mui/material';
import { getInventoryBatchByGtin, getItemsInfo, verifyBatch } from '../../../../../../../config/Services';
import { useDebounce } from 'usehooks-ts';
import { useSnackbar } from '../../../../../../../hooks/SnackbarProvider';
import CancelIcon from '@mui/icons-material/Cancel';
import React, { useEffect, useRef, useState } from 'react';
import SoftBox from '../../../../../../../components/SoftBox';
import SoftInput from '../../../../../../../components/SoftInput';
import SoftTypography from '../../../../../../../components/SoftTypography';

const FinishedProduct = ({
  setQuantityConsumed,
  quantityConsumed,
  isWastage,
  wastageQuant,
  count,
  setCount,
  productName,
  setProductName,
  barcodeNum,
  setBarcodeNum,
  netWeight,
  setNetWeight,
  measurementUnit,
  setMeasurementUnit,
  purchasePrice,
  setPurchasePrice,
  mrp,
  setMrp,
  quantity,
  setQuantity,
  sellingPrice,
  setSellingPrice,
  batchNum,
  setBatchNum,
  netQuantity,
  setNetQuantity,
  availableUnits,
  setMorethanAvailable,
  primaryBarcodeNum,
  primaryBatchNum,
  primaryNetWeight,
  setBatchPresent,
  batchPresent,
}) => {
  const showSnackbar = useSnackbar();
  const contextType = localStorage.getItem('contextType');
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const boxRef = useRef(null);
  //   const [count, setCount] = useState(1);
  //   const [productName, setProductName] = useState('');
  //   const [barcodeNum, setBarcodeNum] = useState('');
  //   const [netWeight, setNetWeight] = useState('');
  //   const [measurementUnit, setMeasurementUnit] = useState('');
  //   const [purchasePrice, setPurchasePrice] = useState('');
  //   const [mrp, setMrp] = useState('');
  //   const [quantity, setQuantity] = useState('');
  //   const [sellingPrice, setSellingPrice] = useState('');
  //   const [batchNum, setBatchNum] = useState('');
  //   const [netQuantity, setNetQuantity] = useState('');
  const [averageQuantity, setAverageQuantity] = useState('');

  const [autocompleteTitleOptions, setAutocompleteTitleOptions] = useState([]);
  const [autocompleteBarcodeOptions, setAutocompleteBarcodeOptions] = useState([]);
  const [productSelected, setProductSelected] = useState(Array(count).fill(false));
  const [curentProductName, setCurentProductName] = useState('');
  const debounceProductName = useDebounce(curentProductName, 700);
  const [currentIndex, setCurrentIndex] = useState('');
  const [currentGtin, setCurrentGtin] = useState('');
  const [batchChange, setBatchChange] = useState('');
  const debounceBatchChange = useDebounce(batchChange, 700);

  const [openModal, setOpenModal] = useState(false);
  const [allAvailableUnits, setAllAvailableUnits] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [quantChange, setQuantChange] = useState('');

  const debounceQuantChange = useDebounce(quantChange, 700);

  const handleCloseModal = () => {
    setOpenModal(false);
  };
  useEffect(() => {
    if (debounceProductName !== '' || debounceProductName !== undefined) {
      const searchProduct = async () => {
        const searchText = debounceProductName;
        const isNumber = !isNaN(+searchText);
        const payload = {
          page: 1,
          pageSize: '100',
          names: [searchText],
          productStatuses: ['CREATED'],
          supportedStore: [locId],
        };
        // if (contextType === 'RETAIL') {
        //   payload.supportedStore = ['TWINLEAVES', orgId];
        // } else if (contextType === 'WMS') {
        //   payload.supportedWarehouse = ['TWINLEAVES', orgId];
        // } else if (contextType === 'VMS') {
        //   payload.marketPlaceSeller = ['TWINLEAVES', orgId];
        // }
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
              if (response?.data?.data?.products.length === 0) {
                setAutocompleteTitleOptions([]);
                setAutocompleteBarcodeOptions([]);
              } else {
                if (!isNumber) {
                  setAutocompleteTitleOptions(response?.data?.data?.products);
                } else {
                  setAutocompleteBarcodeOptions(response?.data?.data?.products);
                }
              }
            })
            .catch((err) => {
              showSnackbar(err?.response?.data?.message, 'error');
            });
        } else if (searchText === '0') {
        }
      };
      searchProduct();
    }
  }, [debounceProductName]);

  useEffect(() => {
    if (debounceQuantChange) {
      let sum = netQuantity.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
      if (isWastage) {
        sum = Number(sum) / Number(primaryNetWeight);
        setQuantityConsumed(sum + Number(wastageQuant) / Number(primaryNetWeight));
      } else {
        sum = Number(sum);
        setQuantityConsumed(sum / Number(primaryNetWeight));
      }

      if (sum > Number(availableUnits) * Number(primaryNetWeight)) {
        showSnackbar('Quantity Consumed should not be greater than available quantity', 'warning');
        setMorethanAvailable(true);
      }
      setQuantChange(false);
    }
  }, [debounceQuantChange]);

  useEffect(() => {
    if (debounceBatchChange !== '') {
      verifyBatch(locId, currentGtin, debounceBatchChange)
        .then((res) => {
          if (res?.data?.data?.object?.available === true) {
            const updatedBatchPresent = [...batchPresent];
            updatedBatchPresent[currentIndex] = true;
            setBatchPresent(updatedBatchPresent);

            showSnackbar('Batch already present, add another batch', 'error');
          } else {
            const updatedBatchPresent = [...batchPresent];
            updatedBatchPresent[currentIndex] = false;
            setBatchPresent(updatedBatchPresent);
          }
        })
        .catch((err) => {
          showSnackbar(err?.response?.data?.message || 'Some error occured', 'error');
        });
    }
  }, [debounceBatchChange]);
  const handleAddmore = () => {
    setCount((prev) => prev + 1);
    setBarcodeNum([...barcodeNum, '']);
    setProductName([...productName, '']);
    setNetWeight([...netWeight, '']);
    setMeasurementUnit([...measurementUnit, '']);
    setNetQuantity([...netQuantity, '']);
    setPurchasePrice([...purchasePrice, '']);
    setMrp([...mrp, '']);
    setQuantity([...quantity, '']);
    setSellingPrice([...sellingPrice, '']);
    setBatchNum([...batchNum, '']);
    setBatchPresent([...batchPresent, false]);
    setProductSelected([...productSelected, false]);
    setAutocompleteTitleOptions([]);
    setAutocompleteBarcodeOptions([]);
    const targetScrollPosition = 10050;

    if (boxRef.current) {
      const scrollStep = (targetScrollPosition - boxRef.current.scrollTop) / 20;
      let currentScrollPosition = boxRef.current.scrollTop;

      const animateScroll = () => {
        if (Math.abs(currentScrollPosition - targetScrollPosition) <= Math.abs(scrollStep)) {
          boxRef.current.scrollTop = targetScrollPosition;
        } else {
          boxRef.current.scrollTop += scrollStep;
          currentScrollPosition += scrollStep;
          requestAnimationFrame(animateScroll);
        }
      };

      animateScroll();
    }
  };
  const handleChangeIO = (e, index) => {
    setCurentProductName(e.target.value);
  };

  const selectProduct = (item, index) => {
    setAutocompleteTitleOptions([]);
    setAutocompleteBarcodeOptions([]);

    if (item?.gtin === primaryBarcodeNum) {
      showSnackbar('Finished goods cannot be same as Primary goods', 'error');
    } else {
      const updatedProductName = [...productName];
      updatedProductName[index] = item?.name;
      setProductName(updatedProductName);

      const updatedBarcodeNum = [...barcodeNum];
      updatedBarcodeNum[index] = item?.gtin;
      setBarcodeNum(updatedBarcodeNum);

      const updatedNetWeight = [...netWeight];
      updatedNetWeight[index] = item?.weights_and_measures?.net_weight;
      setNetWeight(updatedNetWeight);

      const updatedUOM = [...measurementUnit];
      updatedUOM[index] = item?.weights_and_measures?.measurement_unit;
      setMeasurementUnit(updatedUOM);

      // const updatedmrp = [...mrp];
      // updatedmrp[index] = item?.mrp?.mrp;
      // setMrp(updatedmrp);

      const updatedProductSelected = [...productSelected];
      updatedProductSelected[index] = true;
      setProductSelected(updatedProductSelected);

      if (item?.gtin) {
        handleInvertoryData(item?.gtin, index);
      }
    }
  };

  const handleInvertoryData = (gtin, index) => {
    getInventoryBatchByGtin(gtin, locId)
      .then((res) => {
        if (res?.data?.data?.es === 1) {
          showSnackbar(res?.data?.data?.message, 'error');
        } else if (res?.data?.data?.es === 0) {
          const response = res?.data?.data?.data;
          setSelectedRow(null);
          if (response?.length > 0) {
            setAllAvailableUnits(response);
            setOpenModal(true);
          }
        }
      })
      .catch((err) => {
        showSnackbar(err?.response?.data?.message, 'error');
      });
  };
  const handleDelete = (index) => {
    const updatedBarcodeNum = [...barcodeNum];
    updatedBarcodeNum.splice(index, 1);
    setBarcodeNum(updatedBarcodeNum);

    const updatedProductName = [...productName];
    updatedProductName.splice(index, 1);
    setProductName(updatedProductName);

    const updatedNetWeight = [...netWeight];
    updatedNetWeight.splice(index, 1);
    setNetWeight(updatedNetWeight);

    const updatedUOM = [...measurementUnit];
    updatedUOM.splice(index, 1);
    setMeasurementUnit(updatedUOM);

    const updatedPurchasePrice = [...purchasePrice];
    updatedPurchasePrice.splice(index, 1);
    setPurchasePrice(updatedPurchasePrice);

    const updatedmrp = [...mrp];
    updatedmrp.splice(index, 1);
    setMrp(updatedmrp);

    const updateQunatity = [...quantity];
    updateQunatity.splice(index, 1);
    setQuantity(updateQunatity);

    const updateSellingPrice = [...sellingPrice];
    updateSellingPrice.splice(index, 1);
    setSellingPrice(updateSellingPrice);

    const updatebatchNumber = [...batchNum];
    updatebatchNumber.splice(index, 1);
    setBatchNum(updatebatchNumber);

    const updatebatchPresent = [...batchPresent];
    updatebatchPresent.splice(index, 1);
    setBatchPresent(updatebatchPresent);

    const updatedProductSelected = [...productSelected];
    updatedProductSelected.splice(index, 1);
    setProductSelected(updatedProductSelected);

    setCount((prev) => prev - 1);
  };

  const handleChangeValues = (e, index) => {
    if (e.target.name === 'quantity') {
      const updatedQty = [...quantity];
      updatedQty[index] = e.target.value;
      setQuantity(updatedQty);

      setMorethanAvailable(false);
      const updatedNetQuantity = [...netQuantity];
      if (measurementUnit[index] === 'Grams' || measurementUnit[index] === 'Millilitres') {
        updatedNetQuantity[index] = (netWeight[index] / 1000) * e.target.value;
        setNetQuantity(updatedNetQuantity);
      } else {
        updatedNetQuantity[index] = netWeight[index] * e.target.value;
        setNetQuantity(updatedNetQuantity);
      }

      setQuantChange(true);
    } else if (e.target.name === 'sellingPrice') {
      const updatedsellingPrice = [...sellingPrice];
      updatedsellingPrice[index] = e.target.value;
      setSellingPrice(updatedsellingPrice);
    } else if (e.target.name === 'mrp') {
      const updatedMrp = [...mrp];
      updatedMrp[index] = e.target.value;
      setMrp(updatedMrp);
    } else if (e.target.name === 'purchasePrice') {
      const updatedPurchasePrice = [...purchasePrice];
      updatedPurchasePrice[index] = e.target.value;
      setPurchasePrice(updatedPurchasePrice);
    } else if (e.target.name === 'batchNum') {
      const updatedBatchNum = [...batchNum];
      updatedBatchNum[index] = e.target.value;
      setBatchNum(updatedBatchNum);

      setBatchChange(e.target.value);
      setCurrentGtin(barcodeNum[index]);
      setCurrentIndex(index);
    }
  };

  const handleCheckboxChange = (item, index, reversedIndex) => {
    setSelectedRow(index);

    const updatebatchNumber = [...batchNum];
    updatebatchNumber[reversedIndex] = item?.batchNo;
    setBatchNum(updatebatchNumber);

    const updateMRP = [...mrp];
    updateMRP[reversedIndex] = item?.mrp;
    setMrp(updateMRP);

    const updateSellingPrice = [...sellingPrice];
    updateSellingPrice[reversedIndex] = item?.sellingPrice;
    setSellingPrice(updateSellingPrice);

    const updatePurchasePrice = [...purchasePrice];
    updatePurchasePrice[reversedIndex] = item?.purchasePrice;
    setPurchasePrice(updatePurchasePrice);

    const updateBatchPresent = [...batchPresent];
    updateBatchPresent[reversedIndex] = false;
    setBatchPresent(updateBatchPresent);
  };

  return (
    <SoftBox>
      <SoftBox display="flex" gap="30px" justifyContent="space-between">
        <SoftTypography variant="h6">
          Finished Goods
          {count > 1 && ` (Total Item: ${count})`}
        </SoftTypography>
      </SoftBox>
      <SoftBox
        ref={boxRef}
        style={{
          marginTop: '20px',
          maxHeight: '500px',
          overflowY: count > 11 ? 'scroll' : 'visible',
          overflowX: 'scroll',
        }}
      >
        {Array.from({ length: count }, (_, i) => count - i - 1).map((_, reversedIndex) => {
          const isProductSelected = productSelected[reversedIndex];
          return (
            <SoftBox mt={1} style={{ minWidth: '900px' }}>
              <Grid container spacing={1} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Grid
                  item
                  xs={0.7}
                  sm={0.7}
                  md={0.7}
                  mt={reversedIndex === 0 ? '10px' : '-1px'}
                  display={reversedIndex !== 0 ? 'flex' : ''}
                >
                  {reversedIndex === 0 && (
                    <SoftBox mb={1} display="flex">
                      <InputLabel sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                        S No.
                      </InputLabel>
                    </SoftBox>
                  )}
                  <SoftBox display="flex" alignItems="center" gap="10px">
                    <SoftInput readOnly={true} value={reversedIndex + 1} />
                  </SoftBox>
                </Grid>
                <Grid
                  item
                  xs={2}
                  sm={2}
                  md={2}
                  mt={reversedIndex === 0 ? '10px' : '-1px'}
                  display={reversedIndex !== 0 ? 'flex' : ''}
                >
                  {reversedIndex === 0 && (
                    <SoftBox mb={1} display="flex">
                      <InputLabel
                        required
                        sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}
                      >
                        Barcode
                      </InputLabel>
                    </SoftBox>
                  )}
                  <SoftBox display="flex" alignItems="center" gap="10px" style={{ width: '100%' }}>
                    {isProductSelected || barcodeNum[reversedIndex] ? (
                      <TextField
                        value={barcodeNum[reversedIndex]}
                        readOnly={true}
                        style={{
                          width: '100%',
                        }}
                      />
                    ) : (
                      <Autocomplete
                        freeSolo
                        clearIcon={null}
                        disabled={primaryBatchNum === ''}
                        options={autocompleteBarcodeOptions}
                        getOptionLabel={(option) => option.gtin}
                        onChange={(e, newValue) => {
                          selectProduct(newValue, reversedIndex);
                        }}
                        onInputChange={(e, newInputValue) => {
                          handleChangeIO({ target: { value: newInputValue }, reversedIndex });
                        }}
                        style={{
                          width: '100%',
                        }}
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
                            style={{
                              width: '100%',
                            }}
                          />
                        )}
                      />
                    )}
                  </SoftBox>
                </Grid>
                <Grid
                  item
                  xs={2}
                  sm={2}
                  md={2}
                  mt={reversedIndex === 0 ? '10px' : '-1px'}
                  display={reversedIndex !== 0 ? 'flex' : ''}
                >
                  {reversedIndex === 0 && (
                    <SoftBox mb={1} display="flex">
                      <InputLabel
                        required
                        sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}
                      >
                        Product Title
                      </InputLabel>
                    </SoftBox>
                  )}
                  <SoftBox display="flex" alignItems="center" gap="10px" style={{ width: '100%' }}>
                    {isProductSelected || productName[reversedIndex] ? (
                      <TextField
                        value={productName[reversedIndex]}
                        readOnly={true}
                        style={{
                          width: '100%',
                        }}
                      />
                    ) : (
                      <Autocomplete
                        freeSolo
                        clearIcon={null}
                        disabled={primaryBatchNum === ''}
                        options={autocompleteTitleOptions}
                        getOptionLabel={(option) => option.name}
                        onChange={(e, newValue) => {
                          selectProduct(newValue, reversedIndex);
                        }}
                        onInputChange={(e, newInputValue) => {
                          handleChangeIO({ target: { value: newInputValue }, reversedIndex });
                        }}
                        style={{
                          width: '100%',
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            style={{
                              width: '100%',
                            }}
                            // Other TextField props
                          />
                        )}
                      />
                    )}
                  </SoftBox>
                </Grid>
                <Grid item xs={1} sm={1} md={1} mt={reversedIndex === 0 ? '10px' : '-1px'}>
                  {reversedIndex === 0 && (
                    <SoftBox mb={1} display="flex">
                      <InputLabel
                        required
                        sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}
                      >
                        UOM
                      </InputLabel>
                    </SoftBox>
                  )}
                  <SoftInput
                    value={
                      netWeight[reversedIndex] ? netWeight[reversedIndex] + ' ' + measurementUnit[reversedIndex] : ' '
                    }
                  />
                </Grid>
                <Grid item xs={1} sm={1} md={1} mt={reversedIndex === 0 ? '10px' : '-1px'}>
                  {reversedIndex === 0 && (
                    <SoftBox mb={1} display="flex">
                      <InputLabel                        
                        sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}
                      >
                        P.P.
                      </InputLabel>
                    </SoftBox>
                  )}
                  <SoftInput
                    type="number"
                    name="purchasePrice"
                    value={purchasePrice[reversedIndex]}
                    disabled={primaryBatchNum === ''}
                    onChange={(e) => handleChangeValues(e, reversedIndex)}
                  />
                </Grid>
                <Grid item xs={1} sm={1} md={1} mt={reversedIndex === 0 ? '10px' : '-1px'}>
                  {reversedIndex === 0 && (
                    <SoftBox mb={1} display="flex">
                      <InputLabel                        
                        sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}
                      >
                        MRP
                      </InputLabel>
                    </SoftBox>
                  )}
                  <SoftInput
                    type="number"
                    name="mrp"
                    value={mrp[reversedIndex]}
                    disabled={primaryBatchNum === ''}
                    onChange={(e) => handleChangeValues(e, reversedIndex)}
                  />
                </Grid>
                <Grid item xs={1} sm={1} md={1} mt={reversedIndex === 0 ? '10px' : '-1px'}>
                  {reversedIndex === 0 && (
                    <SoftBox mb={1} display="flex">
                      <InputLabel                        
                        sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}
                      >
                        S.P.
                      </InputLabel>
                    </SoftBox>
                  )}
                  <SoftInput
                    type="number"
                    name="sellingPrice"
                    value={sellingPrice[reversedIndex]}
                    disabled={primaryBatchNum === ''}
                    onChange={(e) => handleChangeValues(e, reversedIndex)}
                  />
                </Grid>
                <Grid item xs={1} sm={1} md={1} mt={reversedIndex === 0 ? '10px' : '-1px'}>
                  {reversedIndex === 0 && (
                    <SoftBox mb={1} display="flex">
                      <InputLabel
                        required
                        sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}
                      >
                        Quantity
                      </InputLabel>
                    </SoftBox>
                  )}
                  <SoftInput
                    type="number"
                    name="quantity"
                    value={quantity[reversedIndex]}
                    disabled={primaryBatchNum === ''}
                    onChange={(e) => handleChangeValues(e, reversedIndex)}
                  />
                </Grid>

                <Grid item xs={1} sm={1} md={1} mt={reversedIndex === 0 ? '10px' : '-1px'}>
                  {reversedIndex === 0 && (
                    <SoftBox mb={1} display="flex">
                      <InputLabel
                        required
                        sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}
                      >
                        Batch No.
                      </InputLabel>
                    </SoftBox>
                  )}
                  <SoftInput
                    type="text"
                    name="batchNum"
                    value={batchNum[reversedIndex]}
                    disabled={primaryBatchNum === ''}
                    onChange={(e) => handleChangeValues(e, reversedIndex)}
                  />
                </Grid>
                <SoftBox
                  mt={reversedIndex === 0 ? '49px' : '10px'}
                  width="20px"
                  height="40px"
                  style={{ cursor: 'pointer' }}
                >
                  <CancelIcon onClick={() => handleDelete(reversedIndex)} fontSize="small" color="error" />
                </SoftBox>
                <Modal
                  open={openModal}
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
                      width: '60vh',
                      transform: 'translate(-50%, -50%)',
                      bgcolor: 'background.paper',
                      boxShadow: 24,
                      overflow: 'auto',
                      maxHeight: '80vh',
                    }}
                  >
                    <Grid container spacing={1} p={1}>
                      <Grid item xs={12} md={12}>
                        <SoftTypography fontSize="16px" fontWeight="bold">
                          Select Batch
                        </SoftTypography>
                      </Grid>

                      {allAvailableUnits?.map((item, index) => {
                        return (
                          <Grid item xs={12} md={12}>
                            <Card sx={{ width: '100%' }}>
                              <CardContent
                                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                              >
                                <div>
                                  <SoftBox mb={1} ml={-2} lineHeight={0} display="flex" gap="10px">
                                    <input
                                      type="radio"
                                      checked={selectedRow === index}
                                      onChange={() => handleCheckboxChange(item, index, reversedIndex)}
                                    />
                                    <SoftTypography fontSize="12px">
                                      <b>Batch No:</b> {item?.batchNo}
                                    </SoftTypography>
                                  </SoftBox>
                                  <SoftBox mb={1} ml={0.5} lineHeight={0}>
                                    <SoftTypography fontSize="12px">
                                      <b>Available Qty :</b> {item?.availableUnits}
                                    </SoftTypography>
                                  </SoftBox>
                                  <SoftBox mb={1} ml={0.5} lineHeight={0}>
                                    <SoftTypography fontSize="12px">
                                      <b>MRP :</b> {item?.mrp}
                                    </SoftTypography>
                                  </SoftBox>
                                  <SoftBox mb={1} ml={0.5} lineHeight={0}>
                                    <SoftTypography fontSize="12px">
                                      <b>Selling Price :</b> {item?.sellingPrice}
                                    </SoftTypography>
                                  </SoftBox>
                                  <SoftBox mb={1} ml={0.5} lineHeight={0}>
                                    <SoftTypography fontSize="12px">
                                      <b>Purchase Price :</b> {item?.purchasePrice}
                                    </SoftTypography>
                                  </SoftBox>
                                  <SoftBox mb={1} ml={0.5} lineHeight={0}>
                                    <SoftTypography fontSize="12px">
                                      <b>Inwarded On :</b> {item?.inwardedOn}
                                    </SoftTypography>
                                  </SoftBox>
                                </div>
                              </CardContent>
                            </Card>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Box>
                </Modal>
              </Grid>
            </SoftBox>
          );
        })}
        <Button sx={{ marginLeft: '-10px', color: '#0562FB' }} onClick={handleAddmore}>
          + Add more
        </Button>
      </SoftBox>
    </SoftBox>
  );
};

export default FinishedProduct;
