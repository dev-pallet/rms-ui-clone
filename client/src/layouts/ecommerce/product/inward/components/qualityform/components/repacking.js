import {
  Autocomplete,
  Box,
  Card,
  CardContent,
  Grid,
  InputAdornment,
  InputLabel,
  Modal,
  TextField,
} from '@mui/material';
import { buttonStyles } from '../../../../../Common/buttonColor';
import { getInventoryBatchByGtin, getItemsInfo, repackingProduct } from '../../../../../../../config/Services';
import { useDebounce } from 'usehooks-ts';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../../../../../../hooks/SnackbarProvider';
import CancelIcon from '@mui/icons-material/Cancel';
import FinishedProduct from './secondaryProd';
import React, { useEffect, useState } from 'react';
import SoftBox from '../../../../../../../components/SoftBox';
import SoftButton from '../../../../../../../components/SoftButton';
import SoftInput from '../../../../../../../components/SoftInput';
import SoftSelect from '../../../../../../../components/SoftSelect';
import SoftTypography from '../../../../../../../components/SoftTypography';
import Spinner from '../../../../../../../components/Spinner';

const RepackingInward = () => {
  const showSnackbar = useSnackbar();
  const navigate = useNavigate();
  const contextType = localStorage.getItem('contextType');
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const userName = localStorage.getItem('user_name');
  const user_details = JSON.parse(localStorage.getItem('user_details'));
  const uidx = user_details.uidx;

  const [productSelected, setProductSelected] = useState(false);
  const [autocompleteTitleOptions, setAutocompleteTitleOptions] = useState([]);
  const [autocompleteBarcodeOptions, setAutocompleteBarcodeOptions] = useState([]);
  const [curentProductName, setCurentProductName] = useState('');
  const debounceProductName = useDebounce(curentProductName, 700);
  const [primaryProductName, setPrimaryProductName] = useState('');
  const [primaryBarcodeNum, setPrimaryBarcodeNum] = useState('');
  const [primaryNetWeight, setPrimaryNetWeight] = useState('');
  const [primaryNetUnit, setPrimaryNetUnit] = useState('');
  const [availableUnits, setavailableUnits] = useState('');
  const [quantityConsumed, setQuantityConsumed] = useState('');
  const [primaryPurchasePrice, setPrimaryPurchasePrice] = useState('');
  const [primaryBatchNum, setPrimaryBatchNum] = useState('');
  const [isWastage, setIsWastage] = useState(false);
  const [wastageQuant, setWastageQuant] = useState('');
  const debounceQuantChange = useDebounce(wastageQuant, 700);
  const [wastageReason, setWastageReason] = useState('');

  const [submitLoader, setSubmitLoader] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [allAvailableUnits, setAllAvailableUnits] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);

  const [count, setCount] = useState(1);
  const [productName, setProductName] = useState('');
  const [barcodeNum, setBarcodeNum] = useState('');
  const [netWeight, setNetWeight] = useState('');
  const [measurementUnit, setMeasurementUnit] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [mrp, setMrp] = useState('');
  const [quantity, setQuantity] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [batchNum, setBatchNum] = useState('');
  const [netQuantity, setNetQuantity] = useState('');
  const [batchPresent, setBatchPresent] = useState(Array(count).fill(false));
  const [averageQuantity, setAverageQuantity] = useState('');
  const [morethanAvailable, setMorethanAvailable] = useState(false);

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleClose = () => {
    navigate('/inventory/inward');
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

  const handleChangeIO = (e, index) => {
    setCurentProductName(e.target.value);
  };

  const handleInvertoryData = (gtin) => {
    getInventoryBatchByGtin(gtin, locId)
      .then((res) => {
        if (res?.data?.data?.es === 1) {
          showSnackbar(res?.data?.data?.message, 'error');
        } else if (res?.data?.data?.es === 0) {
          const response = res?.data?.data?.data;
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

  const handleDelete = () => {
    setAutocompleteTitleOptions([]);
    setAutocompleteBarcodeOptions([]);
    setPrimaryProductName('');
    setPrimaryBarcodeNum('');
    setavailableUnits('');
    setPrimaryNetWeight('');
    setPrimaryNetUnit('');
    setPrimaryPurchasePrice('');
    setPrimaryBatchNum('');
    setQuantityConsumed('');
    setavailableUnits([]);
    setProductSelected(false);
    setSelectedRow(null);
  };

  const selectProduct = (item) => {
    setAutocompleteTitleOptions([]);
    setAutocompleteBarcodeOptions([]);
    if (barcodeNum.length > 0 && barcodeNum.includes(item?.gtin)) {
      setProductSelected(false);
      showSnackbar('Primary goods cannot be same as Finished goods', 'error');
    } else {
      const updatedProductName = item?.name;
      setPrimaryProductName(updatedProductName);

      const updatedBarcodeNum = item?.gtin;
      setPrimaryBarcodeNum(updatedBarcodeNum);

      const updateUOM = item?.weights_and_measures?.net_weight;
      setPrimaryNetWeight(updateUOM);
      const updatenetUnit = item?.weights_and_measures?.measurement_unit;
      setPrimaryNetUnit(updatenetUnit);

      setProductSelected(true);

      if (item?.gtin) {
        handleInvertoryData(item?.gtin);
      }
    }
  };

  const handleCheckboxChange = (item, index) => {
    setSelectedRow(index);

    const updatedProductName = item?.itemName;
    setPrimaryProductName(updatedProductName);

    const updatedBarcodeNum = item?.gtin;
    setPrimaryBarcodeNum(updatedBarcodeNum);

    const updatedAvailabelUnits = item?.availableUnits;
    setavailableUnits(updatedAvailabelUnits);

    const updatePurchasePrice = item?.purchasePrice;
    setPrimaryPurchasePrice(updatePurchasePrice);

    const updatebatchNumber = item?.batchNo;
    setPrimaryBatchNum(updatebatchNumber);
  };

  const handleWastage = (e) => {
    if (e.target.checked === false) {
      setWastageQuant('');
      setWastageReason('');
    }
    setIsWastage(e.target.checked ? true : false);
  };

  useEffect(() => {
    if (debounceQuantChange && netQuantity.length > 0) {
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
    }
  }, [debounceQuantChange]);

  const handleWastageQuant = (e) => {
    setWastageQuant(e.target.value);
    setMorethanAvailable(false);
  };

  const itemArrayList = Array.from({ length: count }).map((_, index) => ({
    secondaryProductGtin: barcodeNum[index],
    secondaryProductItemName: productName[index],
    quantityCreated: quantity[index],
    specification: netWeight[index],
    unitOfMeasurement: measurementUnit[index],
    sellingPrice: sellingPrice[index],
    purchasePrice: purchasePrice[index],
    mrp: mrp[index],
    batchNo: batchNum[index] || null,
  }));

  const handleSubmit = () => {
    const payload = {
      locationId: locId,
      orgId: orgId,
      primaryGtin: primaryBarcodeNum,
      totalQuantityConsumed: quantityConsumed,
      wastage: wastageQuant ? Number(wastageQuant) / Number(primaryNetWeight) : 0,
      reason: wastageReason.value || null,
      createdBy: uidx,
      createdByName: userName,
      batchNo: primaryBatchNum,
      secondaryProductDetailsList: itemArrayList,
    };
    if (batchPresent.includes(true)) {
      showSnackbar('Batch already present, remove or add new', 'warning');
    } else if (morethanAvailable) {
      showSnackbar('Quantity Consumed should not be greater than available quantity', 'warning');
    } else {
      setSubmitLoader(true);
      repackingProduct(payload)
        .then((res) => {
          setSubmitLoader(false);
          if (res?.data?.data?.es) {
            showSnackbar(res?.data?.data?.message, 'error');
            return;
          }
          localStorage.setItem(
            'tabControlForInwardPutaway',
            JSON.stringify({
              tab1: false,
              tab2: false,
              tab3: false,
              tab4: true,
            }),
          );
          navigate('/inventory/inward');
        })
        .catch((err) => {
          setSubmitLoader(false);
          showSnackbar(err?.response?.data?.message, 'error');
        });
    }
  };

  return (
    <Grid item xs={12} sm={12}>
      <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
        <SoftTypography fontSize="13px" fontWeight="bold" textTransform="capitalize" p={'0'}>
          Repacking
        </SoftTypography>
      </SoftBox>
      <SoftBox>
        <SoftTypography variant="h6">Primary Goods</SoftTypography>
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
                  <InputLabel
                    required
                    sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}
                  >
                    Barcode
                  </InputLabel>
                </SoftBox>
                <SoftBox display="flex" alignItems="center" gap="10px" style={{ width: '100%' }}>
                  {productSelected ? (
                    <TextField
                      value={primaryBarcodeNum}
                      readOnly={true}
                      style={{
                        width: '100%',
                      }}
                    />
                  ) : (
                    <Autocomplete
                      freeSolo
                      clearIcon={null}
                      options={autocompleteBarcodeOptions}
                      getOptionLabel={(option) => option.gtin}
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
                  <InputLabel
                    required
                    sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}
                  >
                    Product Title
                  </InputLabel>
                </SoftBox>
                <SoftBox display="flex" alignItems="center" gap="10px" style={{ width: '100%' }}>
                  {productSelected ? (
                    <TextField
                      value={primaryProductName}
                      readOnly={true}
                      style={{
                        width: '100%',
                      }}
                    />
                  ) : (
                    <Autocomplete
                      freeSolo
                      clearIcon={null}
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
              <Grid item xs={1.5} sm={1.5} md={1.5} mt={'10px'}>
                <SoftBox mb={1} display="flex">
                  <InputLabel
                    required
                    sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}
                  >
                    UOM
                  </InputLabel>
                </SoftBox>
                <SoftInput value={primaryNetWeight ? primaryNetWeight + ' ' + primaryNetUnit : ''} disabled />
              </Grid>
              <Grid item xs={1.5} sm={1.5} md={1.5} mt={'10px'}>
                <SoftBox mb={1} display="flex">
                  <InputLabel
                    required
                    sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}
                  >
                    Available Quantity
                  </InputLabel>
                </SoftBox>
                <SoftInput type="number" name="quantity" value={availableUnits} disabled />
              </Grid>
              <Grid item xs={1.5} sm={1.5} md={1.5} mt={'10px'}>
                <SoftBox mb={1} display="flex">
                  <InputLabel
                    required
                    sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}
                  >
                    P.P.
                  </InputLabel>
                </SoftBox>
                <SoftInput disabled value={primaryPurchasePrice} />
              </Grid>
              <Grid item xs={1.5} sm={1.5} md={1.5} mt={'10px'}>
                <SoftBox mb={1} display="flex">
                  <InputLabel
                    required
                    sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}
                  >
                    Quantity Consumed
                  </InputLabel>
                </SoftBox>
                <SoftInput disabled value={quantityConsumed} />
              </Grid>
              <Grid item xs={1} sm={1} md={1} mt={'10px'}>
                <SoftBox mb={1} display="flex">
                  <InputLabel
                    required
                    sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}
                  >
                    Batch No.
                  </InputLabel>
                </SoftBox>
                <SoftInput disabled name="quantity" value={primaryBatchNum} />
              </Grid>
              <SoftBox mt={'49px'} width="20px" height="40px" style={{ cursor: 'pointer' }}>
                <CancelIcon onClick={() => handleDelete()} fontSize="small" color="error" />
              </SoftBox>
            </Grid>
            <Grid item xs={4} sm={4} mt={2}>
              <SoftBox className="hja-box">
                <input
                  className="info-prod-check"
                  type="checkbox"
                  // disabled={isBar}
                  checked={isWastage}
                  onChange={(e) => {
                    handleWastage(e);
                  }}
                />
                <span className="span-text-info">Wastage </span>
              </SoftBox>
              {isWastage ? (
                <SoftBox className="boom-box" marginTop="20px" sx={{ gap: '20px', border: 'none !important' }}>
                  <SoftBox>
                    <SoftTypography className="span-text-info" sx={{ marginBottom: '10px' }}>
                      Wastage Value (kg)
                    </SoftTypography>
                    <SoftInput
                      style={{ width: '30%' }}
                      type="number"
                      placeholder="kg"
                      value={wastageQuant}
                      onChange={(e) => {
                        handleWastageQuant(e);
                      }}
                    />
                  </SoftBox>
                  <SoftBox>
                    <SoftTypography className="span-text-info" sx={{ marginBottom: '10px' }}>
                      Wastage Reason
                    </SoftTypography>
                    <SoftSelect
                      style={{ border: 'none', width: '60%' }}
                      menuPortalTarget={document.body}
                      styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                      //   value={wastageReason}
                      defaultValue={{ value: 'Wastage', label: 'Wastage' }}
                      onChange={(option) => setWastageReason(option)}
                      options={[
                        { value: 'WASTAGE', label: 'Wastage' },
                        { value: 'SHRINKAGE', label: 'Shrinkage' },
                        { value: 'THEFT', label: 'Theft' },
                        { value: 'STORE USE', label: 'Store use' },
                        { value: 'DAMAGED', label: 'Damaged' },
                        { value: 'EXPIRED', label: 'Expired' },
                        { value: 'INWARD', label: 'Inward' },
                        { value: 'OTHERS', label: 'Others' },
                      ]}
                    />
                  </SoftBox>
                </SoftBox>
              ) : null}
            </Grid>
          </SoftBox>
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
                      <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                          <SoftBox mb={1} ml={-2} lineHeight={0} display="flex" gap="10px">
                            <input
                              type="radio"
                              checked={selectedRow === index}
                              onChange={() => handleCheckboxChange(item, index)}
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
      </SoftBox>
      <FinishedProduct
        setQuantityConsumed={setQuantityConsumed}
        quantityConsumed={quantityConsumed}
        isWastage={isWastage}
        wastageQuant={wastageQuant}
        count={count}
        setCount={setCount}
        productName={productName}
        setProductName={setProductName}
        barcodeNum={barcodeNum}
        setBarcodeNum={setBarcodeNum}
        netWeight={netWeight}
        setNetWeight={setNetWeight}
        measurementUnit={measurementUnit}
        setMeasurementUnit={setMeasurementUnit}
        purchasePrice={purchasePrice}
        setPurchasePrice={setPurchasePrice}
        mrp={mrp}
        setMrp={setMrp}
        quantity={quantity}
        setQuantity={setQuantity}
        sellingPrice={sellingPrice}
        setSellingPrice={setSellingPrice}
        batchNum={batchNum}
        setBatchNum={setBatchNum}
        netQuantity={netQuantity}
        setNetQuantity={setNetQuantity}
        availableUnits={availableUnits}
        setMorethanAvailable={setMorethanAvailable}
        primaryBarcodeNum={primaryBarcodeNum}
        primaryBatchNum={primaryBatchNum}
        primaryNetWeight={primaryNetWeight}
        setBatchPresent={setBatchPresent}
        batchPresent={batchPresent}
      />

      <SoftBox className="grad-info-btn action-btn-inward-detail" sx={{ marginTop: '10px' }}>
        <SoftBox className="sm-width cancel-inward-btn-div">
          <SoftButton onClick={handleClose} variant={buttonStyles.secondaryVariant} className="outlined-softbutton">
            Cancel
          </SoftButton>
          {submitLoader ? (
            <Spinner />
          ) : (
            <SoftButton
              variant={buttonStyles.primaryVariant}
              className="contained-softbutton saver-wrapper save-inward"
              onClick={handleSubmit}
            >
              Save
            </SoftButton>
          )}
        </SoftBox>
      </SoftBox>
    </Grid>
  );
};

export default RepackingInward;
