import { Autocomplete, Grid, InputLabel, TextField } from '@mui/material';
import { getAllProductSuggestionV2, getInventoryBatchByGtin, getItemsInfo } from '../../../../../../../config/Services';
import { useDebounce } from 'usehooks-ts';
import { useSnackbar } from '../../../../../../../hooks/SnackbarProvider';
import CancelIcon from '@mui/icons-material/Cancel';
import GetOfferBatch from './getOfferBatch';
import React, { useEffect, useState } from 'react';
import SoftBox from '../../../../../../../components/SoftBox';
import SoftInput from '../../../../../../../components/SoftInput';
import SoftSelect from '../../../../../../../components/SoftSelect';
import SoftTypography from '../../../../../../../components/SoftTypography';
const OfferGETY = ({
  offerProductSelected,
  setOfferProductSelected,
  offerAutocompleteTitleOptions,
  setOfferAutocompleteTitleOptions,
  offerAutocompleteBarcodeOptions,
  setOfferAutocompleteBarcodeOptions,
  offerCurentProductName,
  setOfferCurentProductName,
  offerproductName,
  setOfferProductName,
  offerbarcodeNum,
  setOfferBarcodeNum,
  offermrp,
  setOfferMrp,
  offerdiscount,
  setOfferDiscount,
  offerdiscountType,
  setOfferDiscountType,
  offerquantity,
  setOfferQuantity,
  offersellingPrice,
  setOfferSellingPrice,
  offerbatchNum,
  setOfferBatchNum,
  offerType,
  allAvailableUnits,
  setAllAvailableUnits,
  count,
  setCount,
}) => {
  const showSnackbar = useSnackbar();
  const contextType = localStorage.getItem('contextType');
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const [openModal, setOpenModal] = useState(false);
  const [selectLoader, setSelectLoader] = useState(false);
  const [selectedRows, setSelectedRows] = useState(null);

  const debounceOfferProductName = useDebounce(offerCurentProductName, 700);

  useEffect(() => {
    if (debounceOfferProductName !== '' || debounceOfferProductName !== undefined) {
      const searchProduct = async () => {
        const searchText = debounceOfferProductName;
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
              if (response?.data?.data?.data?.data.length === 0) {
                setOfferAutocompleteBarcodeOptions([]);
                setOfferAutocompleteTitleOptions([]);
              } else {
                if (!isNumber) {
                  setOfferAutocompleteTitleOptions(response?.data?.data?.data?.data);
                } else {
                  setOfferAutocompleteBarcodeOptions(response?.data?.data?.data?.data);
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
  }, [debounceOfferProductName]);

  const handleOfferChangeIO = (e, index) => {
    setOfferCurentProductName(e.target.value);
  };

  const selectOfferProduct = (item) => {
    setOfferAutocompleteBarcodeOptions([]);
    setOfferAutocompleteTitleOptions([]);
    const updatedProductName = item?.name;
    setOfferProductName(updatedProductName);

    const updatedBarcodeNum = item?.variant?.barcodes[0];
    setOfferBarcodeNum(updatedBarcodeNum);

    setOfferProductSelected(true);
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
          }
        }
      })
      .catch((err) => {
        showSnackbar(err?.response?.data?.message, 'error');
      });
  };
  const handleOfferDelete = () => {
    setOfferAutocompleteBarcodeOptions([]);
    setOfferAutocompleteTitleOptions([]);
    setOfferProductName('');
    setOfferProductName('');
    setOfferMrp('');
    setOfferQuantity('');
    setOfferDiscount('');
    setOfferDiscountType({ value: '%', label: '%' });
    setOfferSellingPrice('');
    setOfferBatchNum('');
    setOfferProductSelected(false);
  };
  return (
    <SoftBox>
      <SoftBox display="flex" gap="30px" justifyContent="space-between">
        <SoftTypography variant="h6">
          Product Details (Get X or Y {offerType.label !== 'Buy X Get Y Free' ? 'Free' : ''})
        </SoftTypography>
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
                {offerProductSelected ? (
                  <TextField
                    value={offerbarcodeNum}
                    readOnly={true}
                    style={{
                      width: '100%',
                    }}
                  />
                ) : (
                  <Autocomplete
                    freeSolo
                    options={offerAutocompleteBarcodeOptions}
                    getOptionLabel={(option) => option?.variant?.barcodes?.[0] || ''}
                    onChange={(e, newValue) => {
                      selectOfferProduct(newValue);
                    }}
                    onInputChange={(e, newInputValue) => {
                      handleOfferChangeIO({ target: { value: newInputValue } });
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
                {offerProductSelected ? (
                  <TextField
                    value={offerproductName}
                    readOnly={true}
                    style={{
                      width: '100%',
                    }}
                  />
                ) : (
                  <Autocomplete
                    freeSolo
                    options={offerAutocompleteTitleOptions}
                    getOptionLabel={(option) => option.name}
                    onChange={(e, newValue) => {
                      selectOfferProduct(newValue);
                    }}
                    onInputChange={(e, newInputValue) => {
                      handleOfferChangeIO({ target: { value: newInputValue } });
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
              <SoftInput type="number" name="quantity" disabled value={offermrp} />
            </Grid>
            <Grid item xs={1} sm={1} md={1} mt={'10px'}>
              <SoftBox mb={1} display="flex">
                <InputLabel required sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                  Quantity
                </InputLabel>
              </SoftBox>
              <SoftInput
                type="number"
                name="quantity"
                value={offerquantity}
                onChange={(e) => setOfferQuantity(e.target.value)}
              />
            </Grid>
            <Grid item xs={1} sm={1} md={1} mt={'10px'}>
              <SoftBox mb={1} display="flex">
                <InputLabel sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                  S.P.
                </InputLabel>
              </SoftBox>
              <SoftInput disabled value={offersellingPrice} />
            </Grid>
            {offerType.label !== 'Buy X Get Y Free' && (
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
                    onChange={(e) => setOfferDiscount(e.target.value)}
                    value={offerdiscount}
                    type="number"
                  />
                  <SoftBox>
                    <SoftSelect
                      menuPortalTarget={document.body}
                      styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                      // className="boom-soft-select"
                      // isDisabled={isGen ? true : false}
                      value={offerdiscountType}
                      defaultValue={{ value: '%', label: '%' }}
                      onChange={(option) => setOfferDiscountType(option)}
                      options={[
                        { value: '%', label: '%' },
                        { value: 'Rs', label: 'Rs.' },
                        { value: 'Falt Price', label: 'Flat Price' },
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
              <SoftInput disabled value={offerbatchNum} />
            </Grid>
            <SoftBox mt={'49px'} width="20px" height="40px" style={{ cursor: 'pointer' }}>
              <CancelIcon onClick={() => handleOfferDelete()} fontSize="small" color="error" />
            </SoftBox>
          </Grid>
          {openModal && (
            <GetOfferBatch
              openModal={openModal}
              setOpenModal={setOpenModal}
              allAvailableUnits={allAvailableUnits}
              setAllAvailableUnits={setAllAvailableUnits}
              offerbatchNum={offerbatchNum}
              setOfferBatchNum={setOfferBatchNum}
              offersellingPrice={offersellingPrice}
              setOfferSellingPrice={setOfferSellingPrice}
              offermrp={offermrp}
              setOfferMrp={setOfferMrp}
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

export default OfferGETY;
