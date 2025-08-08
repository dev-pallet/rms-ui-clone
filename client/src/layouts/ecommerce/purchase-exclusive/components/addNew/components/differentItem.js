import { Autocomplete, Button, Grid, InputLabel, TextField } from '@mui/material';
import { getItemsInfo } from '../../../../../../config/Services';
import { useDebounce } from 'usehooks-ts';
import CancelIcon from '@mui/icons-material/Cancel';
import React, { useEffect, useState } from 'react';
import SoftBox from '../../../../../../components/SoftBox';
import SoftInput from '../../../../../../components/SoftInput';

const DifferentItem = ({
  detailIndex,
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
  quantity,
  inwardedQuantity,
  setInwardedQuantity,
}) => {
  const [curentProductName, setCurentProductName] = useState('');
  const [selectedIndex, setSelectedIndex] = useState('');
  const debounceProductName = useDebounce(curentProductName, 500);
  const [prodName, setProdName] = useState('');
  const [barNum, setBarNum] = useState('');
  const [loader, setLoader] = useState(false);
  const [autocompleteTitleOptions, setAutocompleteTitleOptions] = useState([]);
  const [autocompleteBarcodeOptions, setAutocompleteBarcodeOptions] = useState([]);
  const [count, setCount] = useState(diffGetBarcodeNum[detailIndex]?.length || 1);
  const [fixedCount, setFixedCount] = useState(0);

  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const contextType = localStorage.getItem('contextType');
  const user_details = JSON.parse(localStorage.getItem('user_details'));
  const uidx = user_details.uidx;

  useEffect(() => {
    if (debounceProductName !== '' || debounceProductName !== undefined) {
      const searchProduct = async () => {
        const searchText = debounceProductName;
        const isNumber = !isNaN(+searchText);
        const payload = {
          page: 1,
          pageSize: '100',
          names: [searchText],
        };
        if (contextType === 'RETAIL') {
          payload.supportedStore = ['TWINLEAVES', orgId];
        } else if (contextType === 'WMS') {
          payload.supportedWarehouse = ['TWINLEAVES', orgId];
        } else if (contextType === 'VMS') {
          payload.marketPlaceSeller = ['TWINLEAVES', orgId];
        }
        if (searchText !== '') {
          if (isNumber) {
            payload.gtin = [searchText];
            payload.names = [];
            setBarNum(searchText);
          } else {
            payload.gtin = [];
            payload.names = [searchText];
            setProdName(searchText);
          }
        } else {
          payload.gtin = [];
          payload.names = [];
        }
        if (searchText.length >= 3) {
          setLoader(true);
          getItemsInfo(payload)
            .then(function (response) {
              setLoader(false);
              if (response?.data?.data?.products.length === 0) {
                if (!isNumber) {
                  const updatedProductName = [...diffGetProductName];
                  updatedProductName[detailIndex][selectedIndex] = searchText;
                  setDiffGetProductName(updatedProductName);
                } else {
                  const updatedBarcodeNum = [...diffGetBarcodeNum];
                  updatedBarcodeNum[detailIndex][selectedIndex] = searchText;
                  setDiffGetBarcodeNum(updatedBarcodeNum);
                }
              } else {
                if (!isNumber) {
                  setAutocompleteTitleOptions(response?.data?.data?.products);
                } else {
                  setAutocompleteBarcodeOptions(response?.data?.data?.products);
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

  const handleChangeIO = (e, index) => {
    setCurentProductName(e.target.value);
    setSelectedIndex(index);
  };

  const selectProduct = (item, rowIndex) => {
    setAutocompleteTitleOptions([]);
    setAutocompleteBarcodeOptions([]);
    const updatedProductName = JSON.parse(JSON.stringify(diffGetProductName));
    if (updatedProductName[detailIndex] === null || updatedProductName[detailIndex] === undefined) {
      updatedProductName[detailIndex] = [];
    }
    if (item && item.name) {
      updatedProductName[detailIndex][rowIndex] = item.name;
    }
    setDiffGetProductName(updatedProductName);

    const updatedBarcodeNum = JSON.parse(JSON.stringify(diffGetBarcodeNum));
    if (updatedBarcodeNum[detailIndex] === null || updatedBarcodeNum[detailIndex] === undefined) {
      updatedBarcodeNum[detailIndex] = [];
    }
    if (item && item.gtin) {
      updatedBarcodeNum[detailIndex][rowIndex] = item.gtin;
    }
    setDiffGetBarcodeNum(updatedBarcodeNum);
  };

  const handleInwardChange = (e, rowIndex) => {
    const updated = JSON.parse(JSON.stringify(inwardedQuantity));
    if (updated[detailIndex] === null || updated[detailIndex] === undefined) {
      updated[detailIndex] = [];
    }
    updated[detailIndex][rowIndex] = e.target.value;
    setInwardedQuantity(updated);
  };

  const handleDelete = (columnIndex) => {
    const updatedProductName = [...diffGetProductName];
    const updatedBarcodeNum = [...diffGetBarcodeNum];
    const updateInwardQuantity = [...inwardedQuantity];

    if (detailIndex >= 0 && detailIndex < updatedProductName.length) {
      if (columnIndex >= 0 && columnIndex < updatedProductName[detailIndex].length) {
        updatedProductName[detailIndex].splice(columnIndex, 1);
        updatedBarcodeNum[detailIndex].splice(columnIndex, 1);
        updateInwardQuantity[detailIndex].splice(columnIndex, 1);

        if (updatedProductName[detailIndex].length === 0) {
          updatedProductName.splice(detailIndex, 1);
          updatedBarcodeNum.splice(detailIndex, 1);
          updateInwardQuantity.splice(detailIndex, 1);
        }
      }
    }
    setDiffGetProductName(updatedProductName);
    setDiffGetBarcodeNum(updatedBarcodeNum);
    setInwardedQuantity(updateInwardQuantity);

    setAutocompleteTitleOptions([]);
    setAutocompleteBarcodeOptions([]);

    setCount((prev) => prev - 1);
    setFixedCount((prev) => prev - 1);
  };

  const handleAddmore = () => {
    setCount((prev) => prev + 1);
    const updatedDiffGetProductName = [...diffGetProductName];
    updatedDiffGetProductName[detailIndex][count] = [''];
    setDiffGetProductName(updatedDiffGetProductName);

    const updatedDiffGetBarcodeNum = [...diffGetBarcodeNum];
    updatedDiffGetBarcodeNum[detailIndex][count] = [''];
    setDiffGetBarcodeNum(updatedDiffGetBarcodeNum);

    const updatedInwardQuant = [...inwardedQuantity];
    updatedInwardQuant[detailIndex][count] = [''];
    setInwardedQuantity(updatedInwardQuant);
  };

  return (
    <Grid container spacing={1} p={1}>
      <Grid item xs={12} md={12}>
        <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
          <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>Buy</InputLabel>
        </SoftBox>
        <SoftBox display="flex" style={{ overflowX: 'auto' }} gap="5px">
          <SoftBox mt={1} style={{ minWidth: '500px' }}>
            <Grid container sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Grid item xs={3.5} sm={3.5} md={3.5} mt={'-1px'}>
                <SoftBox display="flex">
                  <InputLabel sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                    Barcode
                  </InputLabel>
                </SoftBox>
                <TextField
                  value={barcodeNum[detailIndex]}
                  readOnly={true}
                  style={{
                    width: '100%',
                  }}
                />
              </Grid>
              <Grid item xs={4.5} sm={4.5} md={4.5} mt={'-1px'}>
                <SoftBox display="flex">
                  <InputLabel sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                    Title
                  </InputLabel>
                </SoftBox>
                <SoftBox display="flex">
                  <TextField
                    value={productName[detailIndex]}
                    readOnly={true}
                    style={{
                      width: '100%',
                    }}
                  />
                </SoftBox>
              </Grid>
              <Grid item xs={2} sm={2} md={2} mt={'-1px'}>
                <SoftBox display="flex">
                  <InputLabel sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                    Quantity
                  </InputLabel>
                </SoftBox>
                <SoftInput value={quantity[detailIndex]} readOnly={true} type="number" />
              </Grid>
              <Grid item xs={0.7} sm={0.7} md={0.7} mt={5}>
                <SoftBox width="20px" height="40px" alignItems="center" gap="10px" style={{ width: '100%' }}>
                  <SoftBox width="20px" height="40px" style={{ cursor: 'pointer' }}></SoftBox>
                </SoftBox>
              </Grid>
            </Grid>
          </SoftBox>
        </SoftBox>
      </Grid>
      <Grid item xs={12} md={12}>
        <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
          <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
            Get (Add Free Product)
          </InputLabel>
        </SoftBox>
        <SoftBox style={{ overflowX: 'scroll' }} gap="5px">
          {Array.from({ length: count }, (_, i) => count - i - 1).map((_, rowIndex) => {
            return (
              <SoftBox mt={1} key={rowIndex} style={{ minWidth: '500px' }}>
                <Grid container spacing={1} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                  <Grid
                    item
                    xs={3.5}
                    sm={3.5}
                    md={3.5}
                    mt={rowIndex === 0 ? '10px' : '-1px'}
                    display={rowIndex !== 0 ? 'flex' : ''}
                  >
                    {rowIndex === 0 && (
                      <SoftBox display="flex">
                        <InputLabel
                          required
                          sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}
                        >
                          Barcode
                        </InputLabel>
                      </SoftBox>
                    )}
                    {diffGetBarcodeNum[detailIndex] !== undefined &&
                    diffGetBarcodeNum[detailIndex][rowIndex] &&
                    diffGetBarcodeNum[detailIndex][rowIndex][0] !== '' ? (
                        <TextField
                          value={diffGetBarcodeNum[detailIndex][rowIndex]}
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
                            selectProduct(newValue, rowIndex);
                          }}
                          onInputChange={(e, newInputValue) => {
                            handleChangeIO({ target: { value: newInputValue } }, rowIndex);
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
                  </Grid>
                  <Grid
                    item
                    xs={4.5}
                    sm={4.5}
                    md={4.5}
                    mt={rowIndex === 0 ? '10px' : '-1px'}
                    display={rowIndex !== 0 ? 'flex' : ''}
                  >
                    {rowIndex === 0 && (
                      <SoftBox display="flex">
                        <InputLabel
                          required
                          sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}
                        >
                          Title
                        </InputLabel>
                      </SoftBox>
                    )}
                    {diffGetProductName[detailIndex] !== undefined &&
                    diffGetProductName[detailIndex][rowIndex] &&
                    diffGetProductName[detailIndex][rowIndex][0] !== '' ? (
                        <SoftBox display="flex">
                          <TextField
                            value={diffGetProductName[detailIndex][rowIndex]}
                            readOnly={true}
                            style={{
                              width: '100%',
                            }}
                          />
                        </SoftBox>
                      ) : (
                        <Autocomplete
                          freeSolo
                          options={autocompleteTitleOptions}
                          getOptionLabel={(option) => option.name}
                          onChange={(e, newValue) => {
                            selectProduct(newValue, rowIndex);
                          }}
                          onInputChange={(e, newInputValue) => {
                            handleChangeIO({ target: { value: newInputValue } }, rowIndex);
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
                            />
                          )}
                        />
                      )}
                  </Grid>
                  <Grid item xs={2} sm={2} md={2} mt={rowIndex === 0 ? '10px' : '-1px'}>
                    {rowIndex === 0 && (
                      <SoftBox display="flex">
                        <InputLabel
                          required
                          sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}
                        >
                          Quantity
                        </InputLabel>
                      </SoftBox>
                    )}
                    <SoftInput
                      value={inwardedQuantity[detailIndex] !== undefined ? inwardedQuantity[detailIndex][rowIndex] : ''}
                      type="number"
                      onChange={(e) => {
                        handleInwardChange(e, rowIndex);
                      }}
                    />
                  </Grid>
                  <Grid item xs={0.7} sm={0.7} md={0.7} mt={rowIndex === 0 ? '35px' : '10px'}>
                    <SoftBox width="20px" height="40px" alignItems="center" gap="10px" style={{ width: '100%' }}>
                      <SoftBox width="20px" height="40px" style={{ cursor: 'pointer' }}>
                        <CancelIcon onClick={() => handleDelete(rowIndex)} fontSize="small" color="error" />
                      </SoftBox>
                    </SoftBox>
                  </Grid>
                </Grid>
              </SoftBox>
            );
          })}
        </SoftBox>
      </Grid>
      <Button onClick={handleAddmore} sx={{ marginLeft: '-10px', color: '#0562FB' }}>
        + Add more
      </Button>
    </Grid>
  );
};

export default DifferentItem;
