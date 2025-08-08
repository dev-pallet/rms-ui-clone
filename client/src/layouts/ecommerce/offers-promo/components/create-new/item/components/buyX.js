import { Autocomplete, Grid, InputLabel, TextField } from '@mui/material';
import { getAllProductSuggestionV2, getInventoryBatchByGtin, getItemsInfo } from '../../../../../../../config/Services';
import { useDebounce } from 'usehooks-ts';
import { useSnackbar } from '../../../../../../../hooks/SnackbarProvider';
import CancelIcon from '@mui/icons-material/Cancel';
import ListAllBatchOffer from './allBatchList';
import React, { useEffect, useState } from 'react';
import SoftBox from '../../../../../../../components/SoftBox';
import SoftInput from '../../../../../../../components/SoftInput';
import SoftSelect from '../../../../../../../components/SoftSelect';
import SoftTypography from '../../../../../../../components/SoftTypography';

const OfferBUYX = ({
  productSelected,
  setProductSelected,
  autocompleteTitleOptions,
  setAutocompleteTitleOptions,
  autocompleteBarcodeOptions,
  setAutocompleteBarcodeOptions,
  curentProductName,
  setCurentProductName,
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
  quantity,
  setQuantity,
  sellingPrice,
  setSellingPrice,
  batchNum,
  setBatchNum,
  offerType,
  allAvailableUnits,
  setAllAvailableUnits,
  count,
  setCount,
}) => {
  const showSnackbar = useSnackbar();
  const debounceProductName = useDebounce(curentProductName, 700);
  const contextType = localStorage.getItem('contextType');
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const [openModal, setOpenModal] = useState(false);
  const [selectLoader, setSelectLoader] = useState(false);
  const [selectedRows, setSelectedRows] = useState(null);

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
          flattenResponse: true,
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
          //   payload.gtin = [searchText];
          //   payload.names = [];
          // } else {
          //   payload.gtin = [];
          //   payload.names = [searchText];
          // }
          payload.query = searchText;
        } else {
          payload.barcodes = [];
          payload.query = '';
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

  const handleChangeIO = (e, index) => {
    setCurentProductName(e.target.value);
  };

  const selectProduct = (item) => {
    setAutocompleteTitleOptions([]);
    setAutocompleteBarcodeOptions([]);
    const updatedProductName = item?.name;
    setProductName(updatedProductName);

    const updatedBarcodeNum = item?.variant?.barcodes[0];
    setBarcodeNum(updatedBarcodeNum);

    setProductSelected(true);

    handleInvertoryData(item?.variant?.barcodes[0]);
  };

  const handleInvertoryData = (gtin) => {
    getInventoryBatchByGtin(gtin, locId)
      .then((res) => {
        if (res?.data?.data?.es === 1) {
          showSnackbar(res?.data?.data?.message, 'error');
        } else if (res?.data?.data?.es === 0) {
          const response = res?.data?.data?.data;
          if (response?.length > 0) {
            setOpenModal(true);
            setAllAvailableUnits(response);

            // const updatedmrp = response[0]?.mrp;
            // setMrp(updatedmrp);

            // const updateSellingPrice = response[0]?.sellingPrice;
            // setSellingPrice(updateSellingPrice);

            // const updatebatchNumber = response[0]?.batchNo;
            // setBatchNum(updatebatchNumber);
          }
        }
      })
      .catch((err) => {
        showSnackbar(err?.response?.data?.message, 'error');
      });
  };

  const handleDelete = () => {
    setAutocompleteTitleOptions([]);
    setAutocompleteBarcodeOptions([]);
    setProductName('');
    setBarcodeNum('');
    setMrp('');
    setQuantity('');
    setDiscount('');
    setDiscountType({ value: '%', label: '%' });
    setSellingPrice('');
    setBatchNum('');
    setProductSelected(false);
  };
  return (
    <SoftBox>
      <SoftBox display="flex" gap="30px" justifyContent="space-between">
        <SoftTypography variant="h6">Product Details (Buy X)</SoftTypography>
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
                <InputLabel sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                  S No.
                </InputLabel>
              </SoftBox>
              <SoftBox display="flex" alignItems="center" gap="10px">
                <SoftInput readOnly={true} value={1} />
              </SoftBox>
            </Grid>
            <Grid item xs={2} sm={2} md={2} mt={'10px'}>
              <SoftBox mb={1} display="flex">
                <InputLabel required sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                  Barcode
                </InputLabel>
              </SoftBox>
              <SoftBox display="flex" alignItems="center" gap="10px" style={{ width: '100%' }}>
                {productSelected ? (
                  <TextField
                    value={barcodeNum}
                    readOnly={true}
                    style={{
                      width: '100%',
                    }}
                  />
                ) : (
                  <Autocomplete
                    freeSolo
                    options={autocompleteBarcodeOptions}
                    getOptionLabel={(option) => option?.variant?.barcodes?.[0] || ''}
                    onChange={(e, newValue) => {
                      selectProduct(newValue);
                    }}
                    onInputChange={(e, newInputValue) => {
                      handleChangeIO({ target: { value: newInputValue } });
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
            <Grid item xs={2} sm={2} md={2} mt={'10px'}>
              <SoftBox mb={1} display="flex">
                <InputLabel required sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                  Product Title
                </InputLabel>
              </SoftBox>
              <SoftBox display="flex" alignItems="center" gap="10px" style={{ width: '100%' }}>
                {productSelected ? (
                  <TextField
                    value={productName}
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
                      selectProduct(newValue);
                    }}
                    onInputChange={(e, newInputValue) => {
                      handleChangeIO({ target: { value: newInputValue } });
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
            <Grid item xs={1} sm={1} md={1} mt={'10px'}>
              <SoftBox mb={1} display="flex">
                <InputLabel sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                  MRP
                </InputLabel>
              </SoftBox>
              <SoftInput disabled value={mrp} />
            </Grid>
            {offerType.label === 'Offer on MRP' ? null : (
              <Grid item xs={1} sm={1} md={1} mt={'10px'}>
                <SoftBox mb={1} display="flex">
                  <InputLabel
                    required
                    sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}
                  >
                    Quantity
                  </InputLabel>
                </SoftBox>
                <SoftInput
                  type="number"
                  name="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </Grid>
            )}
            <Grid item xs={1} sm={1} md={1} mt={'10px'}>
              <SoftBox mb={1} display="flex">
                <InputLabel sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                  S.P.
                </InputLabel>
              </SoftBox>
              <SoftInput disabled value={sellingPrice} />
            </Grid>
            {offerType.label === 'Buy X Get Y Free' || offerType.label === 'Buy X Get Discount on Y' ? null : (
              <Grid item xs={2.5} sm={2.5} md={2.5} mt={'10px'}>
                <SoftBox mb={1} display="flex">
                  <InputLabel
                    required
                    sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}
                  >
                    Discount
                  </InputLabel>
                </SoftBox>
                <SoftBox className="boom-box">
                  <SoftInput
                    className="boom-input"
                    //   disabled={isGen ? true : false}
                    //   value={units}
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
                        { value: 'Flat Price', label: 'Flat Price' },
                      ]}
                    />
                  </SoftBox>
                </SoftBox>
              </Grid>
            )}

            <Grid item xs={1} sm={1} md={1} mt={'10px'}>
              <SoftBox mb={1} display="flex">
                <InputLabel sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                  Batch No.
                </InputLabel>
              </SoftBox>
              <SoftInput disabled name="quantity" value={batchNum} />
            </Grid>
            <SoftBox mt={'49px'} width="20px" height="40px" style={{ cursor: 'pointer' }}>
              <CancelIcon onClick={() => handleDelete()} fontSize="small" color="error" />
            </SoftBox>
          </Grid>
          {openModal && (
            <ListAllBatchOffer
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
    </SoftBox>
  );
};

export default OfferBUYX;
