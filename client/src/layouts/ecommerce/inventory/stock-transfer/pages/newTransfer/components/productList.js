import { Autocomplete, Grid, IconButton, TextField, Tooltip } from '@mui/material';
import { getAllProductsV2New, getInventoryBatchByGtin, getItemsInfo } from '../../../../../../../config/Services';
import { isSmallScreen, productIdByBarcode } from '../../../../../Common/CommonFunction';
import { useDebounce } from 'usehooks-ts';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../../../../../../hooks/SnackbarProvider';
import CancelIcon from '@mui/icons-material/Cancel';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import ListAllBatch from './allBatch';
import React, { useEffect, useRef, useState } from 'react';
import SoftBox from '../../../../../../../components/SoftBox';
import SoftInput from '../../../../../../../components/SoftInput';
import SoftTypography from '../../../../../../../components/SoftTypography';
import Spinner from '../../../../../../../components/Spinner';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import BatchesInfo from './BatchesInfo';
import '../newTransfer.css'
import { InfoOutlined } from '@mui/icons-material';
import CommonIcon from '../../../../../Common/mobile-new-ui-components/common-icon-comp';

const TransferItemList = ({
  setArrayCount,
  arrayCount,
  setCount,
  count,
  setFixedCount,
  fixedCount,
  setStnID,
  stnID,
  setBarcodeNum,
  barcodeNum,
  setProductName,
  productName,
  setMrp,
  mrp,
  setAvailabelUnits,
  availabelUnits,
  setTransferUnits,
  transferUnits,
  setPurchasePrice,
  purchasePrice,
  setBatchNumber,
  batchNumber,
  setTotalPurchasePrice,
  totalPurchasePrice,
  setOriginSelect,
  originSelect,
  setDestiSelect,
  destiSelect,
  setProductBatch,
  productBatch,
  allAvailableUnits,
  setAllAvailableUnits,
  setSellingPrice,
  sellingPrice,
  handleAddProduct,
  handleRemoveProduct,
  setAllItemList,
  allItemList,
  removeProdLoader,
  uniqueIndex,
  setUniqueIndex,
}) => {
  const boxRef = useRef(null);
  const navigate = useNavigate();
  const isMobileDevice = isSmallScreen();
  const showSnackbar = useSnackbar();
  const [productSelected, setProductSelected] = useState(Array(count).fill(false));
  const [autocompleteTitleOptions, setAutocompleteTitleOptions] = useState([]);
  const [autocompleteBarcodeOptions, setAutocompleteBarcodeOptions] = useState([]);
  const [curentProductName, setCurentProductName] = useState('');
  const debounceProductName = useDebounce(curentProductName, 700);
  const [currIndex, setCurrIndex] = useState(0);
  const [selectLoader, setSelectLoader] = useState(false);

  const [quantChange, setQuantChange] = useState('');
  const debouncedValue = useDebounce(quantChange, 700);
  const [quantBarcodePairs, setQuantBarcodePairs] = useState([]);
  // const [allAvailableUnits, setAllAvailableUnits] = useState([]);
  const [detailIndex, setDetailedIndex] = useState('');
  const [currGtin, setCurrGtin] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [remove, setRemove] = useState(false);
  const [batchLoader, setBatchLoader] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState([]);

  const contextType = localStorage.getItem('contextType');
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');

  useEffect(() => {
    if (debounceProductName !== '' || debounceProductName !== undefined) {
      const searchProduct = async () => {
        const searchText = debounceProductName;
        const isNumber = !isNaN(+searchText);
        const payload = {
            page: 1,
            pageSize: 50,
            // names: [],
            mergedProductShow: false,
            // barcode: [],
            productStatus: ['CREATED'],
            sortByPrice: 'DEFAULT',
            sortByCreatedAt: 'DESC',
            showBundles: false,
            storeLocations: [locId],
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
            payload.barcode = [searchText];
            payload.query = '';
          } else {
            payload.barcode = [];
            payload.query = searchText
          }
        } else {
          payload.barcode = [];
          payload.query = '';
        }
        if (searchText.length >= 3) {
          await getAllProductsV2New(payload)
            .then(function (response) {
              if (response?.data?.data?.data?.data?.length === 0) {
                setAutocompleteTitleOptions([]);
                setAutocompleteBarcodeOptions([]);
              } else if (response?.data?.data?.data?.data?.length === 1) {
                selectProduct(response?.data?.data?.data?.data?.[0], currIndex);
              } else {
                if (!isNumber) {
                  setAutocompleteTitleOptions(response?.data?.data?.data?.data);
                } else {
                  setAutocompleteBarcodeOptions(response?.data?.data?.data?.data);
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
    if (debouncedValue !== '' || remove) {
      // enterQuantity();
      if (remove) {
        handleRemoveProduct();
      } else {
        handleAddProduct();
      }
    }
  }, [debouncedValue, remove]);

  useEffect(() => {
    if (barcodeNum) {
      const uniqueIndices = [];

      const seenValues = new Map(); // Map to store seen values and their indices

      barcodeNum.forEach((value, index) => {
        // Check if the value is seen before
        if (!seenValues.has(value)) {
          seenValues.set(value, index); // Store the value and its index
          uniqueIndices.push(index); // Push the index to the uniqueIndices array
        }
      });
      setUniqueIndex(uniqueIndices);
    }
  }, [barcodeNum]);

  const handleAddmore = () => {
    setCount(count + 1);
    setArrayCount(arrayCount + 1);
    setStnID([...stnID, '']);
    setBarcodeNum([...barcodeNum, '']);
    setProductName([...productName, '']);
    setMrp([...mrp, '']);
    setAvailabelUnits([...availabelUnits, '']);
    setPurchasePrice([...purchasePrice, '']);
    setSellingPrice([...sellingPrice, '']);
    setBatchNumber([...batchNumber, '']);
    setTotalPurchasePrice([...totalPurchasePrice, '']);
    setTransferUnits([...transferUnits, '']);
    setAllAvailableUnits([...allAvailableUnits, '']);
    setUniqueIndex([...uniqueIndex, '']);
    // setItemAmountWithTax([...itemAmountWithTax, '']);

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

  const handleDelete = (index) => {
    // const isValuePresent = orderedItems.some((item) => item.gtin === barcodeNum[index]);
    const updatedStnID = [...stnID];
    updatedStnID.splice(index, 1);
    setStnID(updatedStnID);

    const updatedBarcodeNum = [...barcodeNum];
    updatedBarcodeNum.splice(index, 1);
    setBarcodeNum(updatedBarcodeNum);

    const updatedProductName = [...productName];
    updatedProductName.splice(index, 1);
    setProductName(updatedProductName);

    const updatedmrp = [...mrp];
    updatedmrp.splice(index, 1);
    setMrp(updatedmrp);

    const updatedAvailabelUnits = [...availabelUnits];
    updatedAvailabelUnits.splice(index, 1);
    setAvailabelUnits(updatedAvailabelUnits);

    const updatedtransferUnits = [...transferUnits];
    updatedtransferUnits.splice(index, 1);
    setTransferUnits(updatedtransferUnits);

    const updatePurchasePrice = [...purchasePrice];
    updatePurchasePrice.splice(index, 1);
    setPurchasePrice(updatePurchasePrice);

    const updateSellingPrice = [...sellingPrice];
    updateSellingPrice.splice(index, 1);
    setSellingPrice(updateSellingPrice);

    const updatebatchNumber = [...batchNumber];
    updatebatchNumber.splice(index, 1);
    setBatchNumber(updatebatchNumber);

    const updatedTotalPurchasePrice = [...totalPurchasePrice];
    updatedTotalPurchasePrice.splice(index, 1);
    setTotalPurchasePrice(updatedTotalPurchasePrice);

    const updatetotalUnit = [...allAvailableUnits];
    updatetotalUnit.splice(index, 1);
    setAllAvailableUnits(updatetotalUnit);

    // const updatedWithTaxAmount = [...itemAmountWithTax];
    // updatedWithTaxAmount.splice(index, 1);
    // setItemAmountWithTax(updatedWithTaxAmount);

    const updatedProductSelected = [...productSelected];
    updatedProductSelected.splice(index, 1);
    setProductSelected(updatedProductSelected);

    setArrayCount((prev) => prev - 1);
    setCount((prev) => prev - 1);
    setFixedCount((prev) => prev - 1);

    if (batchNumber[index] !== '' && batchNumber[index]) {
      setRemove(true);
    }
  };

  const enterQuantity = async (gtin, index) => {
    try {
      const res = await getInventoryBatchByGtin(gtin, locId);
      const response = res?.data?.data;
      if (response?.es) {
        showSnackbar(response?.message, 'error');
        return;
      }
      if (response?.data?.length >= 1) {
        setBatchLoader(true);
        setOpenModal(true);
        setDetailedIndex(index);
        setCurrGtin(gtin);
        const updatedUnits = [...availabelUnits];
        updatedUnits[index] = response?.data;
        setAllAvailableUnits(updatedUnits);
      } else if (response?.data?.length === 0) {
        setOpenModal(false);
        setBatchLoader(false);
        showSnackbar('Cannot add product with 0 Batch', 'error');
      }
    } catch (err) {
      setBatchLoader(false);
      setOpenModal(false);
      showSnackbar(err?.response?.data?.message, 'error');
    }
  };

  const handleMoreDetails = (gtin, index) => {
    // setOpenModal(true);
    // setDetailedIndex(index);
    // setCurrGtin(gtin);
    enterQuantity(gtin, index);
  };

  const handleChangeIO = (e, index) => {
    setCurentProductName(e.target.value);
    setCurrIndex(index);
  };

  const selectProduct = (item, index) => {
    setCurentProductName('');
    setAutocompleteTitleOptions([]);
    setAutocompleteBarcodeOptions([]);
    // const isValuePresent = orderedItems.some((data) => data?.gtin === item?.gtin);
    // if (!isValuePresent && item) {
    const updatedProductName = [...productName];
    updatedProductName[index] = item?.name;
    setProductName(updatedProductName);

    //   const updatedSpecification = [...specification];
    //   updatedSpecification[index] =
    //     item?.weights_and_measures?.net_weight + ' ' + item?.weights_and_measures?.measurement_unit;
    //   setSpecification(updatedSpecification);

    const updatedBarcodeNum = [...barcodeNum];
    updatedBarcodeNum[index] = item?.gtin;
    setBarcodeNum(updatedBarcodeNum);

    // const updatedmrp = [...mrp];
    // updatedmrp[index] = item?.mrp?.mrp;
    // setMrp(updatedmrp);

    //   const updatedTax = [...itemTax];
    //   updatedTax[index] = item?.igst;
    //   setItemTax(updatedTax);

    const updatedProductSelected = [...productSelected];
    updatedProductSelected[index] = true;
    setProductSelected(updatedProductSelected);

    // handleInvertoryData(item?.gtin, index);
    enterQuantity(item?.variants?.[0]?.barcodes?.[0], index);
    // } else {
    //   showSnackbar('Product already present', 'error');
    // }
  };

  const handleInvertoryData = (gtin, index) => {
    getInventoryBatchByGtin(gtin, locId)
      .then((res) => {
        if (res?.data?.data?.es === 1) {
          showSnackbar(res?.data?.data?.message, 'error');
        } else if (res?.data?.data?.es === 0) {
          const response = res?.data?.data?.data;
          if (response?.length === 1) {
            const updatedmrp = [...mrp];
            updatedmrp[count - 1] = response[0]?.mrp;
            setMrp(updatedmrp);

            const updatedAvailabelUnits = [...availabelUnits];
            updatedAvailabelUnits[count - 1] = response[0]?.availableUnits;
            setAvailabelUnits(updatedAvailabelUnits);

            const updatePurchasePrice = [...purchasePrice];
            updatePurchasePrice[count - 1] = response[0]?.purchasePrice;
            setPurchasePrice(updatePurchasePrice);

            const updateSellingPrice = [...sellingPrice];
            updateSellingPrice[count - 1] = response[0]?.sellingPrice;
            setSellingPrice(updateSellingPrice);

            const updatebatchNumber = [...batchNumber];
            updatebatchNumber[count - 1] = response[0]?.batchNo;
            setBatchNumber(updatebatchNumber);
          }
        }
      })
      .catch((err) => {
        showSnackbar(err?.response?.data?.message, 'error');
      });
  };

  const handleTransferUnit = (e, index) => {
    const currentBarcode = barcodeNum[index];
    if (
      currentBarcode !== undefined &&
      currentBarcode !== '' &&
      availabelUnits[index] !== undefined &&
      availabelUnits[index] !== ''
    ) {
      setQuantChange(e.target.value);

      const updatedQuantBarcodePairs = [];
      updatedQuantBarcodePairs[index] = {
        qty: e.target.value,
        gtin: currentBarcode.toString(),
      };
      setQuantBarcodePairs(updatedQuantBarcodePairs);
      setDetailedIndex(index);
      setCurrGtin(currentBarcode);

      const updatedTransferUnit = [...transferUnits];
      updatedTransferUnit[index] = e.target.value;
      setTransferUnits(updatedTransferUnit);

      const updateTotalPurchasePrice = [...totalPurchasePrice];
      updateTotalPurchasePrice[index] = purchasePrice[index] * e.target.value;
      setTotalPurchasePrice(updateTotalPurchasePrice);
    }
  };

  let counter = 0;
  const checkIfExistsBefore = (arr, index) => arr.slice(0, index).includes(arr[index]);

  const handleProductNavigation = async (barcode) => {
    try {
      const productId = await productIdByBarcode(barcode);
      if (productId) {
        navigate(`/products/product/details/${productId}`);
      }
    } catch (error) {}
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const [openModalBatchData, setOpenModalBatchData] = useState(false);

  const handleOpenModalBatchData = (event) => {
    setOpenModalBatchData(true);
    setAnchorEl(event.currentTarget);
  };

  const handleCloseModalBatchData = () => {
    setOpenModalBatchData(false);
    setAnchorEl(null);
  };

  const hasMoreThanOneMatchingItem = (list, key, value) => {
    return list?.filter((el) => el?.[key] === value)?.length > 1;
  };  

  const sumFieldByCondition = (list, key, value, fieldToSum) => {
    return list
      ?.filter((el) => el?.[key] === value)
      ?.reduce((total, el) => total + (Number(el?.[fieldToSum]) || 0), 0);
  };

  const getFormattedTotalPurchasePriceSum = (
    list,
    matchField,
    matchValue,
    sumField,
    fallbackValue
  ) => {
    const result = sumFieldByCondition?.(list, matchField, matchValue, sumField);
    if (result == null) return fallbackValue;
  
    const formatted = Math.abs(result)?.toFixed(3);
    return parseFloat(formatted) === 0 ? '' : formatted;
  };
  

  return (
    <div>
      <SoftBox>
        <SoftBox display="flex" gap="30px" justifyContent="flex-start">
          {/* <SoftTypography variant="h6">
            Enter items you wish to purchase
            {uniqueIndex?.length > 1 && ` (Total Item: ${uniqueIndex?.length})`}
          </SoftTypography> */}
          {removeProdLoader && <Spinner size={20} />}
        </SoftBox>
        {!removeProdLoader && (
          <>
            <SoftTypography fontSize="16px" fontWeight="bold" mb={1}>
              Add products to transfer
              {uniqueIndex?.length > 1 && ` (Total Item: ${uniqueIndex?.length})`}
            </SoftTypography>
            <SoftBox
              ref={boxRef}
              style={{
                // marginTop: '20px',
                maxHeight: '500px',
                overflowY: uniqueIndex?.length > 11 ? 'scroll' : 'visible',
                overflowX: 'scroll',
                paddingTop: isMobileDevice ? '10px' : '',
                borderTop: isMobileDevice ? '1px solid gainsboro' : '',
                borderBottom: isMobileDevice ? '1px solid gainsboro' : '',
              }}
            >
              <SoftBox style={{ minWidth: '950px' }}>
                <Grid container spacing={1} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                  <Grid fontSize="12px" item xs={0.5} sm={0.5} md={0.7}>
                    S No.
                  </Grid>
                  <Grid fontSize="12px" item xs={1.6} sm={1.6} md={1.6} textAlign="center">
                    Barcode
                  </Grid>
                  <Grid fontSize="12px" item xs={1.8} sm={1.8} md={1.7} textAlign="center">
                    Product Title
                  </Grid>
                  <Grid fontSize="12px" item xs={0.6} sm={0.6} md={0.5} textAlign="right">
                    MRP
                  </Grid>
                  <Grid fontSize="12px" item xs={1.1} sm={1.1} md={1.1} textAlign="right">
                    Available Qty
                  </Grid>
                  <Grid fontSize="12px" item xs={1.1} sm={1.1} md={1.1}>
                    Transfer Units
                  </Grid>
                  <Grid fontSize="12px" item xs={1.2} sm={1.2} md={1.2}>
                    Purchase Price
                  </Grid>
                  <Grid fontSize="12px" item xs={0.8} sm={0.8} md={0.8}>
                    Total PP
                  </Grid>
                  <Grid fontSize="12px" item xs={1.2} sm={1.2} md={1.2}>
                    Batch No
                  </Grid>
                  <SoftBox></SoftBox>
                  <SoftBox></SoftBox>
                </Grid>
              </SoftBox>
              {Array.from({ length: count }, (_, i) => count - i - 1).map((_, reversedIndex) => {
                const isProductSelected = productSelected[reversedIndex];
                // if(reversedIndex === 0 || allAvailableUnits[reversedIndex]?.length > 0 ){
                if (!checkIfExistsBefore(barcodeNum, reversedIndex)) {
                  counter++;
                }
                return (
                  <SoftBox mt={1} key={reversedIndex} style={{ minWidth: '950px' }}>
                    <Grid container spacing={1} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                      {(barcodeNum.length === 0 || !checkIfExistsBefore(barcodeNum, reversedIndex)) && (
                        <>
                          <Grid item xs={0.7} sm={0.7} md={0.7} display={reversedIndex !== 0 ? 'flex' : ''}>
                            <SoftBox display="flex" alignItems="center" gap="10px">
                              <SoftInput readOnly={true} value={counter} />
                            </SoftBox>
                          </Grid>
                          <Grid item xs={1.8} sm={1.8} md={1.8} display={reversedIndex !== 0 ? 'flex' : ''}>
                            <SoftBox display="flex" alignItems="center" gap="10px" style={{ width: '100%' }}>
                              {isProductSelected || barcodeNum[reversedIndex] ? (
                                <TextField
                                  value={barcodeNum[reversedIndex]}
                                  readOnly={true}
                                  style={{
                                    width: '100%',
                                  }}
                                  onClick={() => {
                                    barcodeNum[reversedIndex]
                                      ? handleProductNavigation(barcodeNum[reversedIndex])
                                      : null;
                                    localStorage.removeItem('newStockTransfer');
                                  }}
                                />
                              ) : (
                                <Autocomplete
                                  freeSolo
                                  disabled={originSelect && destiSelect ? false : true}
                                  options={autocompleteBarcodeOptions}
                                  getOptionLabel={(option) => option.gtin}
                                  onChange={(e, newValue) => {
                                    selectProduct(newValue, reversedIndex);
                                  }}
                                  onInputChange={(e, newInputValue) => {
                                    handleChangeIO({ target: { value: newInputValue } }, reversedIndex);
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
                            // mt={reversedIndex === 0 ? '10px' : '-1px'}
                            display={reversedIndex !== 0 ? 'flex' : ''}
                          >
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
                                  disabled={originSelect && destiSelect ? false : true}
                                  options={autocompleteTitleOptions}
                                  getOptionLabel={(option) => option.name}
                                  onChange={(e, newValue) => {
                                    selectProduct(newValue, reversedIndex);
                                  }}
                                  onInputChange={(e, newInputValue) => {
                                    handleChangeIO({ target: { value: newInputValue } }, reversedIndex);
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
                          <Grid item xs={0.8} sm={0.8} md={0.8}>
                            <SoftInput type="number" name="quantity" disabled value={mrp[reversedIndex]} />
                          </Grid>
                          <Grid item xs={1.2} sm={1.2} md={1.2}>
                            <SoftInput
                              type="number"
                              name="quantity"
                              disabled
                              value={
                                sumFieldByCondition(
                                  allItemList,
                                  'itemNo',
                                  barcodeNum[reversedIndex],
                                  'quantityAvailable',
                                ) || availabelUnits[reversedIndex]
                              }
                            />
                          </Grid>
                          <Grid item xs={1.2} sm={1.2} md={1.3}>
                            <SoftInput
                              type="number"
                              name="quantity"
                              disabled
                              // disabled={originSelect && destiSelect && purchasePrice[reversedIndex] ? false : true}
                              value={
                                sumFieldByCondition(
                                  allItemList,
                                  'itemNo',
                                  barcodeNum[reversedIndex],
                                  'quantityTransfer',
                                ) || transferUnits[reversedIndex]
                              }
                              onChange={(e) => handleTransferUnit(e, reversedIndex)}
                            />
                          </Grid>
                          <Grid item xs={1.3} sm={1.3} md={1.3}>
                            <SoftInput type="number" name="quantity" disabled value={purchasePrice[reversedIndex]} />
                          </Grid>
                          <Grid item xs={1} sm={1} md={1}>
                            <Tooltip
                              title={
                                getFormattedTotalPurchasePriceSum(
                                  allItemList, 'itemNo', barcodeNum[reversedIndex], 'finalPrice'
                                )
                              }
                              placement="top-start"
                            >
                              <div>
                                <SoftInput
                                  type="number"
                                  name="quantity"
                                  disabled
                                  value={
                                    // totalPurchasePrice[reversedIndex] || totalPurchasePrice[reversedIndex] === 0
                                    //   ? Math.abs(Number(totalPurchasePrice[reversedIndex]).toFixed(3))
                                    //   : ''
                                    getFormattedTotalPurchasePriceSum(
                                      allItemList, 'itemNo', barcodeNum[reversedIndex], 'finalPrice'
                                    )
                                  }
                                />
                              </div>
                            </Tooltip>
                          </Grid>
                          <Grid item xs={1.2} sm={1.2} md={1.2}>
                            <div
                              className="content-left"
                              style={{ position: 'relative' }}
                              onClick={(e) => {
                                if (hasMoreThanOneMatchingItem(allItemList, 'itemNo', barcodeNum[reversedIndex])) {
                                  handleOpenModalBatchData(e);
                                  setSelectedProduct(barcodeNum[reversedIndex]);
                                }
                              }}
                            >
                              <Tooltip
                                title={
                                  batchNumber[reversedIndex] &&
                                  !hasMoreThanOneMatchingItem(allItemList, 'itemNo', barcodeNum[reversedIndex])
                                    ? `${batchNumber[reversedIndex]}`
                                    : ''
                                }
                                placement="top-start"
                              >
                                <div>
                                  <SoftInput
                                    type="text"
                                    disabled
                                    value={
                                      hasMoreThanOneMatchingItem(allItemList, 'itemNo', barcodeNum[reversedIndex])
                                        ? allItemList?.filter((el) => el?.itemNo === barcodeNum[reversedIndex])
                                            ?.length + ' Batches'
                                        : batchNumber[reversedIndex]
                                    }
                                  />
                                </div>
                              </Tooltip>
                              <div
                                className="batchNo-highlight"
                                style={{
                                  visibility: hasMoreThanOneMatchingItem(
                                    allItemList,
                                    'itemNo',
                                    barcodeNum[reversedIndex],
                                  )
                                    ? 'visible'
                                    : 'hidden',
                                  position: 'absolute',
                                  right: '10px',
                                }}
                              >
                                {!openModalBatchData ? <ExpandMoreIcon /> : <ExpandLessIcon />}
                              </div>
                            </div>
                          </Grid>
                          <SoftBox width="20px" style={{ cursor: 'pointer', paddingLeft: '10px', marginRight: '15px' }}>
                            {batchNumber[reversedIndex] ? (
                              <CreateOutlinedIcon
                                fontSize="small"
                                color="info"
                                onClick={() => handleMoreDetails(barcodeNum[reversedIndex], reversedIndex)}
                              />
                            ) : (
                              ''
                            )}
                          </SoftBox>
                          <SoftBox
                            mt={reversedIndex === 0 ? '12px' : '10px'}
                            width="20px"
                            height="40px"
                            style={{ cursor: 'pointer' }}
                          >
                            <CancelIcon onClick={() => handleDelete(reversedIndex)} fontSize="small" color="error" />
                          </SoftBox>
                        </>
                      )}
                    </Grid>
                  </SoftBox>
                );
              })}
              {openModal && (
                <ListAllBatch
                  openModal={openModal}
                  setOpenModal={setOpenModal}
                  batchLoader={batchLoader}
                  setBatchLoader={setBatchLoader}
                  allAvailableUnits={allAvailableUnits}
                  detailIndex={detailIndex}
                  currGtin={currGtin}
                  productName={productName}
                  setProductName={setProductName}
                  barcodeNum={barcodeNum}
                  setBarcodeNum={setBarcodeNum}
                  mrp={mrp}
                  setMrp={setMrp}
                  availabelUnits={availabelUnits}
                  setAvailabelUnits={setAvailabelUnits}
                  batchNumber={batchNumber}
                  setBatchNumber={setBatchNumber}
                  sellingPrice={sellingPrice}
                  setSellingPrice={setSellingPrice}
                  transferUnits={transferUnits}
                  setTransferUnits={setTransferUnits}
                  totalPurchasePrice={totalPurchasePrice}
                  setTotalPurchasePrice={setTotalPurchasePrice}
                  purchasePrice={purchasePrice}
                  setPurchasePrice={setPurchasePrice}
                  setProductBatch={setProductBatch}
                  productBatch={productBatch}
                  handleAddProduct={handleAddProduct}
                  handleRemoveProduct={handleRemoveProduct}
                  setCount={setCount}
                  count={count}
                  setAllItemList={setAllItemList}
                  allItemList={allItemList}
                  setSelectLoader={setSelectLoader}
                  selectLoader={selectLoader}
                />
              )}
            </SoftBox>
          </>
        )}
        <BatchesInfo
          {...{
            anchorEl,
            openModalBatchData,
            handleCloseModalBatchData,
          }}
          allItemList={allItemList?.filter((el) => el?.itemNo === selectedProduct)}
        />
        <SoftTypography
          className="add-more-text"
          onClick={handleAddmore}
          component="label"
          variant="caption"
          fontWeight="bold"
        >
          + Add More
        </SoftTypography>
        <SoftTypography fontSize="small" style={{ color: 'red' }}>
          {' '}
          Enter all the mandatory fields{' '}
        </SoftTypography>
      </SoftBox>
    </div>
  );
};

export default TransferItemList;
