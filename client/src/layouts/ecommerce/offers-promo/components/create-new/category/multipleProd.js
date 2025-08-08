import { Autocomplete, Button, Grid, InputLabel, TextField } from '@mui/material';
import { getInventoryBatchByGtin, getItemsInfo } from '../../../../../../config/Services';
import { useDebounce } from 'usehooks-ts';
import { useEffect, useRef, useState } from 'react';
import { useSnackbar } from '../../../../../../hooks/SnackbarProvider';
import AllBatchList from './batchList';
import CancelIcon from '@mui/icons-material/Cancel';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import SoftBox from '../../../../../../components/SoftBox';
import SoftInput from '../../../../../../components/SoftInput';
import SoftSelect from '../../../../../../components/SoftSelect';
import SoftTypography from '../../../../../../components/SoftTypography';

const MultipleProductCategory = ({
  count,
  setCount,
  productName,
  setProductName,
  barcodeNum,
  setBarcodeNum,
  mrp,
  setMrp,
  discount,
  setDiscount,
  discountType,
  setDiscountType,
  getQuantity,
  setGetQuantity,
  sellingPrice,
  setSellingPrice,
  batchNum,
  setBatchNum,
  allAvailableUnits,
  setAllAvailableUnits,
}) => {
  const showSnackbar = useSnackbar();
  const contextType = localStorage.getItem('contextType');
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const boxRef = useRef(null);
  const [openModal, setOpenModal] = useState(false);
  const [autocompleteTitleOptions, setAutocompleteTitleOptions] = useState([]);
  const [autocompleteBarcodeOptions, setAutocompleteBarcodeOptions] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [productSelected, setProductSelected] = useState(Array(count).fill(false));
  const [curentProductName, setCurentProductName] = useState('');
  const debounceProductName = useDebounce(curentProductName, 700);
  const [selectLoader, setSelectLoader] = useState(false);

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

  const discountArray = [
    { value: '%', label: '%' },
    { value: 'Rs', label: 'Rs' },
  ];

  const handleAddmore = () => {
    setCount((prev) => prev + 1);
    setBarcodeNum([...barcodeNum, '']);
    setProductName([...productName, '']);
    setMrp([...mrp, '']);
    setGetQuantity([...getQuantity, '']);
    setDiscount([...discount, '']);
    setDiscountType([...discountType, '']);
    setSellingPrice([...sellingPrice, '']);
    setBatchNum([...batchNum, '']);
    setAllAvailableUnits([...allAvailableUnits, '']);
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

    const updatedmrp = [...mrp];
    updatedmrp[index] = item?.mrp?.mrp;
    setMrp(updatedmrp);

    const updatedProductSelected = [...productSelected];
    updatedProductSelected[index] = true;
    setProductSelected(updatedProductSelected);

    handleInvertoryData(item?.gtin, index);
  };

  const handleInvertoryData = (gtin, index) => {
    getInventoryBatchByGtin(gtin, locId)
      .then((res) => {
        if (res?.data?.data?.es === 1) {
          showSnackbar(res?.data?.data?.message, 'error');
        } else if (res?.data?.data?.es === 0) {
          const response = res?.data?.data?.data;
          if (response?.length > 0) {
            setOpenModal(true);
            setAllAvailableUnits(response);
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

    const updatedmrp = [...mrp];
    updatedmrp.splice(index, 1);
    setMrp(updatedmrp);

    const updateQunatity = [...getQuantity];
    updateQunatity.splice(index, 1);
    setGetQuantity(updateQunatity);

    const updateSellingPrice = [...sellingPrice];
    updateSellingPrice.splice(index, 1);
    setSellingPrice(updateSellingPrice);

    const updatebatchNumber = [...batchNum];
    updatebatchNumber.splice(index, 1);
    setBatchNum(updatebatchNumber);

    const updatedDiscount = [...discount];
    updatedDiscount.splice(index, 1);
    setDiscount(updatedDiscount);

    const updatedDiscountType = [...discountType];
    updatedDiscountType.splice(index, 1);
    setDiscountType(updatedDiscountType);

    const updatedallAvailableUnits = [...allAvailableUnits];
    updatedallAvailableUnits.splice(index, 1);
    setAllAvailableUnits(updatedallAvailableUnits);

    const updatedProductSelected = [...productSelected];
    updatedProductSelected.splice(index, 1);
    setProductSelected(updatedProductSelected);

    setCount((prev) => prev - 1);
  };
  const handleChangeValues = (e, index) => {
    if (e.target.name === 'getQuantity') {
      const updatedQty = [...getQuantity];
      updatedQty[index] = e.target.value;
      setGetQuantity(updatedQty);
    } else if (e.target.name === 'sellingPrice') {
      const updatedsellingPrice = [...sellingPrice];
      updatedsellingPrice[index] = e.target.value;
      setSellingPrice(updatedsellingPrice);
    } else if (e.target.name === 'discount') {
      const updatedDiscount = [...discount];
      updatedDiscount[index] = e.target.value;
      setDiscount(updatedDiscount);
    }
  };

  const handelDiscount = (option, index) => {
    const update = [...discountType];
    update[index] = option.value;
    setDiscountType(update);
  };

  return (
    <SoftBox>
      <SoftBox display="flex" gap="30px" justifyContent="space-between">
        <SoftTypography variant="h6">
          Product Details (GET Y)
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
                    {isProductSelected || barcodeNum[reversedIndex] || reversedIndex !== 0 ? (
                      <TextField
                        value={barcodeNum[0]}
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
                    {isProductSelected || productName[reversedIndex] || reversedIndex !== 0 ? (
                      <TextField
                        value={productName[0]}
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
                <Grid item xs={1} sm={1} md={1} mt={reversedIndex === 0 ? '10px' : '-1px'}>
                  {reversedIndex === 0 && (
                    <SoftBox mb={1} display="flex">
                      <InputLabel
                        required
                        sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}
                      >
                        MRP
                      </InputLabel>
                    </SoftBox>
                  )}
                  <SoftInput type="number" name="mrp" disabled value={mrp[reversedIndex]} />
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
                    name="getQuantity"
                    value={getQuantity[reversedIndex]}
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
                        S.P.
                      </InputLabel>
                    </SoftBox>
                  )}
                  <SoftInput type="number" name="sellingPrice" value={sellingPrice[reversedIndex]} />
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
                  <SoftInput value={batchNum[reversedIndex]} />
                </Grid>
                <Grid item xs={2.5} sm={2.5} md={2.5} mt={reversedIndex === 0 ? '10px' : '-1px'}>
                  {reversedIndex === 0 && (
                    <SoftBox mb={1} display="flex">
                      <InputLabel
                        required
                        sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}
                      >
                        Discount
                      </InputLabel>
                    </SoftBox>
                  )}
                  <SoftBox className="boom-box">
                    <SoftInput
                      className="boom-input"
                      //   disabled={isGen ? true : false}
                      onChange={(e) => handleChangeValues(e, reversedIndex)}
                      value={discount[reversedIndex]}
                      type="number"
                      name="discount"
                    />
                    <SoftBox>
                      <SoftSelect
                        menuPortalTarget={document.body}
                        styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                        value={discountArray.find((option) => option.value === discountType[reversedIndex]) || ''}
                        defaultValue={{ value: '%', label: '%' }}
                        onChange={(option) => handelDiscount(option, reversedIndex)}
                        options={discountArray}
                      />
                    </SoftBox>
                  </SoftBox>
                </Grid>
                <SoftBox
                  mt={reversedIndex === 0 ? '49px' : '10px'}
                  width="20px"
                  height="40px"
                  style={{ cursor: 'pointer', marginLeft: '5px' }}
                >
                  {batchNum[reversedIndex] === '' ? (
                    <CreateOutlinedIcon fontSize="small" color="info" onClick={() => setOpenModal(true)} />
                  ) : (
                    ''
                  )}
                </SoftBox>
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
        {openModal && (
          <AllBatchList
            openModal={openModal}
            setOpenModal={setOpenModal}
            allAvailableUnits={allAvailableUnits}
            setAllAvailableUnits={setAllAvailableUnits}
            batchNum={batchNum}
            setBatchNum={setBatchNum}
            sellingPrice={sellingPrice}
            setSellingPrice={setSellingPrice}
            mrp={mrp}
            setMrp={setMrp}
            count={count}
            setCount={setCount}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            setSelectLoader={setSelectLoader}
            selectLoader={selectLoader}
          />
        )}
      </SoftBox>
    </SoftBox>
  );
};

export default MultipleProductCategory;
