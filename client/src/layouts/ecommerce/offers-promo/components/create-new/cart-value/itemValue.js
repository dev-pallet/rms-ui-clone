import { Autocomplete, Button, Grid, InputLabel, TextField } from '@mui/material';
import { getAllProductSuggestionV2, getItemsInfo } from '../../../../../../config/Services';
import { useDebounce } from 'usehooks-ts';
import { useSnackbar } from '../../../../../../hooks/SnackbarProvider';
import CancelIcon from '@mui/icons-material/Cancel';
import React, { useEffect, useRef, useState } from 'react';
import SoftBox from '../../../../../../components/SoftBox';
import SoftInput from '../../../../../../components/SoftInput';
import SoftTypography from '../../../../../../components/SoftTypography';

const CartValueItem = ({
  itemCount,
  setItemCount,
  productName,
  setProductName,
  barcodeNum,
  setBarcodeNum,
  quantity,
  setQuantity,
  batchNum,
  setBatchNum,
}) => {
  const showSnackbar = useSnackbar();
  const contextType = localStorage.getItem('contextType');
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const boxRef = useRef(null);
  const [autocompleteTitleOptions, setAutocompleteTitleOptions] = useState([]);
  const [autocompleteBarcodeOptions, setAutocompleteBarcodeOptions] = useState([]);
  const [productSelected, setProductSelected] = useState(Array(itemCount).fill(false));
  const [curentProductName, setCurentProductName] = useState('');
  const debounceProductName = useDebounce(curentProductName, 700);

  useEffect(() => {
    if (debounceProductName !== '' || debounceProductName !== undefined) {
      const searchProduct = async () => {
        const searchText = debounceProductName;
        const isNumber = !isNaN(+searchText);
        const payload = {
          page: 1,
          pageSize: '100',
          query: searchText,
          productStatuses: ['CREATED'],
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
          // if (isNumber) {
          //   payload.barcode = [searchText];
          //   payload.query = "";
          // } else {
          //   payload.barcode = [];
          //   payload.names = searchText;
          // }
          payload.query = searchText
        } else {
          payload.gtin = [];
          payload.names = [];
        }
        if (searchText.length >= 3) {
          getAllProductSuggestionV2(payload)
            .then(function (response) {
              if (response?.data?.data?.data?.data?.length === 0) {
                setAutocompleteTitleOptions([]);
                setAutocompleteBarcodeOptions([]);
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
  const handleAddmore = () => {
    setItemCount((prev) => prev + 1);
    setBarcodeNum([...barcodeNum, '']);
    setProductName([...productName, '']);
    setQuantity([...quantity, '']);
    setBatchNum([...batchNum, '']);
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

    const updatedProductName = [...productName];
    updatedProductName[index] = item?.name;
    setProductName(updatedProductName);

    const updatedBarcodeNum = [...barcodeNum];
    updatedBarcodeNum[index] = item?.gtin;
    setBarcodeNum(updatedBarcodeNum);

    const updatedProductSelected = [...productSelected];
    updatedProductSelected[index] = true;
    setProductSelected(updatedProductSelected);

    //   handleSellingPrice(item?.gtin, index);
  };

  const handleDelete = (index) => {
    const updatedBarcodeNum = [...barcodeNum];
    updatedBarcodeNum.splice(index, 1);
    setBarcodeNum(updatedBarcodeNum);

    const updatedProductName = [...productName];
    updatedProductName.splice(index, 1);
    setProductName(updatedProductName);

    const updateQunatity = [...quantity];
    updateQunatity.splice(index, 1);
    setQuantity(updateQunatity);

    const updatebatchNumber = [...batchNum];
    updatebatchNumber.splice(index, 1);
    setBatchNum(updatebatchNumber);

    const updatedProductSelected = [...productSelected];
    updatedProductSelected.splice(index, 1);
    setProductSelected(updatedProductSelected);

    setItemCount((prev) => prev - 1);
  };

  const handleChangeValues = (e, index) => {
    if (e.target.name === 'quantity') {
      const updatedQty = [...quantity];
      updatedQty[index] = e.target.value;
      setQuantity(updatedQty);
    }
  };

  return (
    <SoftBox>
      <SoftBox display="flex" gap="30px" justifyContent="space-between">
        <SoftTypography variant="h6">
          Product Details (GET X or Y)
          {itemCount > 1 && ` (Total Item: ${itemCount})`}
        </SoftTypography>
      </SoftBox>
      <SoftBox
        ref={boxRef}
        style={{
          //   marginTop: '20px',
          maxHeight: '500px',
          overflowY: itemCount > 11 ? 'scroll' : 'visible',
          overflowX: 'scroll',
        }}
      >
        {Array.from({ length: itemCount }, (_, i) => itemCount - i - 1).map((_, reversedIndex) => {
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
                  xs={3}
                  sm={3}
                  md={3}
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
                  xs={3}
                  sm={3}
                  md={3}
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
                <Grid item xs={2} sm={2} md={2} mt={reversedIndex === 0 ? '10px' : '-1px'}>
                  {reversedIndex === 0 && (
                    <SoftBox mb={2} display="flex">
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
                    onChange={(e) => handleChangeValues(e, reversedIndex)}
                  />
                </Grid>
                <Grid item xs={2} sm={2} md={2} mt={reversedIndex === 0 ? '10px' : '-1px'}>
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
                  <SoftInput type="number" name="batchNum" value={batchNum[reversedIndex]} />
                </Grid>
                <SoftBox
                  mt={reversedIndex === 0 ? '49px' : '10px'}
                  width="20px"
                  height="40px"
                  style={{ cursor: 'pointer' }}
                >
                  <CancelIcon onClick={() => handleDelete(reversedIndex)} fontSize="small" color="error" />
                </SoftBox>
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

export default CartValueItem;
