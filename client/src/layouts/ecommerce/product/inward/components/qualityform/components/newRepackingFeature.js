import DashboardLayout from '../../../../../../../examples/LayoutContainers/DashboardLayout';
import { isSmallScreen } from '../../../../../Common/CommonFunction';
import { useSnackbar } from '../../../../../../../hooks/SnackbarProvider';
import DashboardNavbar from '../../../../../../../examples/Navbars/DashboardNavbar';
import Spinner from '../../../../../../../components/Spinner';
import SoftBox from '../../../../../../../components/SoftBox';
import { useEffect, useState } from 'react';
import { Autocomplete, Card, Grid, InputLabel, TextField, Tooltip } from '@mui/material';
import SoftTypography from '../../../../../../../components/SoftTypography';
import SoftSelect from '../../../../../../../components/SoftSelect';
import SoftInput from '../../../../../../../components/SoftInput';
import CancelIcon from '@mui/icons-material/Cancel';
import { useDebounce } from 'usehooks-ts';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import { buttonStyles } from '../../../../../Common/buttonColor';
import SoftButton from '../../../../../../../components/SoftButton';
import { useNavigate } from 'react-router-dom';
import {
  createRepacking,
  getAllProductSuggestionV2,
  getInventoryBatchByGtin,
} from '../../../../../../../config/Services';
import RepakingBatchListingModal from './batchListingModal';

const InventoryNewRepacking = () => {
  const showSnackbar = useSnackbar();
  const navigate = useNavigate();
  const locId = localStorage.getItem('locId');
  const orgId = localStorage.getItem('orgId');
  const userDetails = JSON.parse(localStorage.getItem('user_details'));
  const [primaryProductSelected, setPrimaryProductSelected] = useState(true);
  const [secondaryProductSelected, setSecondaryProductSelected] = useState(true);
  const [autocompleteTitleOptions, setAutocompleteTitleOptions] = useState([]);
  const [autocompleteBarcodeOptions, setAutocompleteBarcodeOptions] = useState([]);
  const [curentProductName, setCurentProductName] = useState('');
  const debounceProductName = useDebounce(curentProductName, 700);
  const [isWastage, setIsWastage] = useState(false);
  const [wastageQuant, setWastageQuant] = useState('');
  const debounceQuantChange = useDebounce(wastageQuant, 700);
  const [wastageReason, setWastageReason] = useState(null);
  const [submitLoader, setSubmitLoader] = useState(false);
  const [isPrimary, setIsPrimary] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [allAvailableUnits, setAllAvailableUnits] = useState([]);
  const [changeinQtyConsumed, setChangeInQtyConsumed] = useState(0);
  const debounceChangeInQtyConsumed = useDebounce(changeinQtyConsumed, 700);

  const weightUnits = ['Kilograms', 'Kg', 'Kgs', 'Litres', 'ltr', 'ltrs'];

  const [primaryGoods, setPrimaryGoods] = useState({
    gtin: null,
    name: null,
    spec: '',
    netWeight: '',
    measurementUnit: '',
    totalAvlQty: 0,
    totalPurchasePrice: 0,
    totalProductionQty: 0,
    batches: [],
    totalQuantityConsumed: 0,
  });

  const [finishedGoods, setFinishedGoods] = useState({
    gtin: null,
    batchNumber: '',
    expiryDate: '',
    // expiryDate: '2025-01-07T10:36:54.612Z',
    availableUnits: 0,
    uom: '',
    netWeight: '',
    measurementUnit: '',
    mrp: 0,
    purchasePrice: 0,
    sellingPrice: 0,
    productName: null,
    category: '',
    subCategory: '',
    level2Category: '',
    brand: '',
    quantityConsumed: 0,
  });

  useEffect(() => {
    if (debounceProductName !== '' || debounceProductName !== undefined) {
      searchProduct();
    }
  }, [debounceProductName]);

  // useEffect(() => {
  //   if (debounceQuantChange) {
  //     let sum = finishedGoods?.quantityConsumed;
  //     if (isWastage) {
  //       sum = Number(sum) / Number(primaryGoods?.netWeight);
  //       const finalValue = sum + Number(wastageQuant) / Number(primaryGoods?.netWeight);
  //       setPrimaryGoods((prev) => ({
  //         ...prev,
  //         totalQuantityConsumed: finalValue,
  //       }));
  //     } else {
  //       sum = Number(sum);
  //       const finalValue = sum / Number(primaryGoods?.netWeight);
  //       setPrimaryGoods((prev) => ({
  //         ...prev,
  //         totalQuantityConsumed: finalValue,
  //       }));
  //     }
  //   }
  // }, [debounceQuantChange]);

  useEffect(() => {
    if (debounceChangeInQtyConsumed) {
      setPrimaryGoods((prev) => ({
        ...prev,
        totalQuantityConsumed: debounceChangeInQtyConsumed,
      }));
      setChangeInQtyConsumed(0);
    }
  }, [debounceChangeInQtyConsumed]);
  const searchProduct = async () => {
    const searchText = debounceProductName;
    const isNumber = !isNaN(+searchText);
    const payload = {
      page: 1,
      pageSize: '10',
      query: searchText,
      barcode: [],
      // storeLocationId: locId.toLocaleLowerCase(),
      storeLocations: [locId],
    };
    try {
      const res = await getAllProductSuggestionV2(payload);
      if (res?.data?.status === 'ERROR' || res?.data?.data?.es >= 1) {
        showSnackbar(res?.data?.message || res?.data?.data?.message, 'error');
        setCurentProductName('');
        return;
      }
      const response = res?.data?.data?.data?.data || [];
      const extractedVariants = response?.flatMap((product) =>
        product?.variants?.map((variant) => ({
          ...variant,
          gtin: variant?.barcodes[0] || null,
          productSource: product?.storeSpecificData,
          igst: product?.taxReference?.taxRate,
          cess: product?.taxReference?.metaData?.cess,
          category: product?.appCategories?.categoryLevel1,
          subCategory: product?.appCategories?.categoryLevel2,
          level2Category: product?.appCategories?.categoryLevel3,
          brand: product?.companyDetail?.brand || '',
          weights_and_measures: {
            net_weight: variant?.weightsAndMeasures
              ? variant?.weightsAndMeasures?.find((ele) => ele?.type === 'PRIMARY')?.grossWeight ||
                variant?.weightsAndMeasures[0]?.grossWeight
              : '',
            measurement_unit: variant?.weightsAndMeasures
              ? variant?.weightsAndMeasures?.find((ele) => ele?.type === 'PRIMARY')?.measurementUnit ||
                variant?.weightsAndMeasures[0]?.measurementUnit
              : '',
          },
        })),
      );
      if (isNumber && extractedVariants?.length === 1) {
        selectProduct(extractedVariants[0], isPrimary, isNumber);
      } else {
        if (!isNumber) {
          setAutocompleteTitleOptions(extractedVariants);
        } else {
          setAutocompleteBarcodeOptions(extractedVariants);
        }
        setCurentProductName('');
      }
    } catch (error) {
      showSnackbar(error?.response?.data?.message || error?.message, 'error');
    }
  };

  const handleRemove = (key) => {
    if (key) {
      setPrimaryGoods({
        gtin: null,
        name: null,
        spec: '',
        totalAvlQty: 0,
        totalPurchasePrice: 0,
        totalProductionQty: 0,
        batches: [],
        totalQuantityConsumed: 0,
      });
      setPrimaryProductSelected(true);
      setAllAvailableUnits([]);
    } else {
      setFinishedGoods({
        gtin: null,
        batchNumber: '',
        expiryDate: '',
        // expiryDate: '2025-01-07T10:36:54.612Z',
        availableUnits: 0,
        uom: '',
        netWeight: '',
        measurementUnit: '',
        mrp: 0,
        purchasePrice: 0,
        sellingPrice: 0,
        productName: null,
        category: '',
        subCategory: '',
        level2Category: '',
        brand: '',
        quantityConsumed: 0,
      });
      setPrimaryGoods({
        ...primaryGoods,
        totalQuantityConsumed: 0,
      });
      setSecondaryProductSelected(true);
    }
  };

  const selectProduct = (item, key, isNumber) => {
    if (key) {
      if (!item) {
        setPrimaryGoods({
          gtin: null,
          name: null,
          spec: '',
          totalAvlQty: 0,
          totalPurchasePrice: 0,
          totalProductionQty: 0,
          batches: [],
          totalQuantityConsumed: 0,
        });
        setPrimaryProductSelected(true);
      } else {
        if (item?.gtin === finishedGoods?.gtin) {
          showSnackbar('Finished goods cannot be same as Primary goods', 'error');
        } else {
          setPrimaryProductSelected(isNumber ? true : autocompleteBarcodeOptions?.length > 0 ? true : false);
          handleInvertoryData(item);
        }
      }
    } else {
      if (!item) {
        setFinishedGoods({
          gtin: null,
          batchNumber: '',
          expiryDate: '',
          // expiryDate: '2025-01-07T10:36:54.612Z',
          availableUnits: 0,
          uom: '',
          netWeight: '',
          measurementUnit: '',
          mrp: 0,
          purchasePrice: 0,
          sellingPrice: 0,
          productName: null,
          category: '',
          subCategory: '',
          level2Category: '',
          brand: '',
          quantityConsumed: 0,
        });
        setPrimaryGoods({
          ...primaryGoods,
          totalQuantityConsumed: 0,
        });
        setSecondaryProductSelected(true);
      } else {
        if (item?.gtin === primaryGoods?.gtin) {
          showSnackbar('Finished goods cannot be same as Primary goods', 'error');
        } else {
          setSecondaryProductSelected(isNumber ? true : autocompleteBarcodeOptions?.length > 0 ? true : false);
          calculateConvertedQuantity(item);
        }
      }
    }
    setAutocompleteBarcodeOptions([]);
    setAutocompleteTitleOptions([]);
    setCurentProductName('');
    setIsPrimary(false);
  };

  const handleChangeIO = (e, key) => {
    if (e.target.value === '') {
      handleRemove(key);
      return;
    }
    setCurentProductName(e.target.value);
    if (key) {
      setIsPrimary(true);
    } else {
      setIsPrimary(false);
    }
  };

  const handleInvertoryData = (item) => {
    getInventoryBatchByGtin(item?.gtin, locId)
      .then((res) => {
        if (res?.data?.data?.es === 1) {
          showSnackbar(res?.data?.data?.message, 'error');
        } else if (res?.data?.data?.es === 0) {
          const response = res?.data?.data?.data;
          if (response?.length > 0) {
            setPrimaryGoods({
              ...primaryGoods,
              gtin: item?.gtin,
              name: item?.name,
              spec: item?.weights_and_measures?.net_weight + ' ' + item?.weights_and_measures?.measurement_unit,
              measurementUnit: item?.weights_and_measures?.measurement_unit,
              netWeight: item?.weights_and_measures?.net_weight,
              totalPurchasePrice: item?.inventorySync?.purchasePrice || 0,
            });
            setAllAvailableUnits(response);
            setOpenModal(true);
          }
        }
      })
      .catch((err) => {
        showSnackbar(err?.response?.data?.message, 'error');
      });
  };

  const convertToBaseUnit = (value, unit) => {
    if (weightUnits.includes(unit)) {
      return value * 1000; // Convert to grams/milliliters
    }
    return value;
  };

  const calculateResult = (fgQty, fgWeight, fgUnit, pgWeight, pgUnit, wastage, wastageUnit) => {
    // Convert weights to grams/milliliters
    const convertedFgWeight = convertToBaseUnit(fgWeight, fgUnit);
    const convertedPgWeight = convertToBaseUnit(pgWeight, pgUnit);
    const convertedWastage = convertToBaseUnit(wastage, wastageUnit);

    // Apply the formula
    const fgCalculatedWeight = (fgQty * convertedFgWeight) / convertedPgWeight;
    const wastageCalculatedWeight = convertedWastage / convertedPgWeight;

    const result = fgCalculatedWeight + wastageCalculatedWeight;

    return result.toFixed(3);
  };

  const checkForQuantityAllowed = (value, key) => {
    const convertedFgWeight = convertToBaseUnit(finishedGoods?.netWeight, finishedGoods?.measurementUnit);
    const fgTotalQtyAllowed =
      Number(key === 'fg' ? value : finishedGoods?.quantityConsumed) * Number(convertedFgWeight);
    const convertedPgWeight = convertToBaseUnit(primaryGoods?.netWeight, primaryGoods?.measurementUnit);
    const pgTotalQtyAllowed = Number(primaryGoods?.totalAvlQty) * Number(convertedPgWeight);
    const convertedWastage = convertToBaseUnit(key === 'wastage' ? value : Number(wastageQuant), 'Kilograms');
    const cumulativeQty = fgTotalQtyAllowed + convertedWastage;
    if (cumulativeQty > pgTotalQtyAllowed) {
      return true;
    }
    return false;
  };

  const handleWastage = (e) => {
    if (e.target.checked === false) {
      setPrimaryGoods((prev) => ({
        ...prev,
        totalQuantityConsumed: Number(primaryGoods?.totalQuantityConsumed) - Number(wastageQuant),
      }));
      setWastageQuant('');
      setWastageReason('');
    }
    setIsWastage(e.target.checked ? true : false);
  };

  const handleWastageQuant = (e) => {
    const value = Number(e.target.value);
    if (checkForQuantityAllowed(value, 'wastage')) {
      showSnackbar('Converted Quantity cannot be greater than available quantity', 'error');
      return;
    }
    const result = calculateResult(
      finishedGoods?.quantityConsumed,
      finishedGoods?.netWeight,
      finishedGoods?.measurementUnit,
      primaryGoods?.netWeight,
      primaryGoods?.measurementUnit,
      value,
      'Kilograms',
    );
    setWastageQuant(value);
    if (!wastageReason) {
      setWastageReason({ value: 'WASTAGE', label: 'Wastage' });
    }
    setChangeInQtyConsumed(result);
  };

  const handleClose = () => {
    navigate('/inventory/inward');
  };

  const handleChangeValues = (value, fieldName) => {
    if (fieldName === 'quantityConsumed' && checkForQuantityAllowed(value, 'fg')) {
      showSnackbar('Converted Quantity cannot be greater than available quantity', 'error');
      return;
    }
    if (fieldName === 'expiryDate') {
      setFinishedGoods({
        ...finishedGoods,
        [fieldName]: value,
      });
    } else {
      setFinishedGoods({
        ...finishedGoods,
        [fieldName]: value,
      });
    }
    if (fieldName === 'quantityConsumed') {
      const result = calculateResult(
        Number(value),
        finishedGoods?.netWeight,
        finishedGoods?.measurementUnit,
        primaryGoods?.netWeight,
        primaryGoods?.measurementUnit,
        wastageQuant,
        'Kilograms',
      );
      setChangeInQtyConsumed(result);
    }
  };

  const calculateConvertedQuantity = (item) => {
    let convertedPGWt = primaryGoods?.netWeight;
    let convertedFGWt = item?.weights_and_measures?.net_weight;

    if (weightUnits.includes(primaryGoods?.measurementUnit)) {
      convertedPGWt = primaryGoods?.netWeight * 1000;
    }

    if (weightUnits.includes(item?.weights_and_measures?.measurement_unit)) {
      convertedFGWt = item?.weights_and_measures?.net_weight * 1000;
    }

    const multipliedData = primaryGoods?.totalPurchasePrice * convertedFGWt;
    const dividedData = multipliedData / convertedPGWt;

    setFinishedGoods({
      ...finishedGoods,
      gtin: item?.gtin,
      availableUnits: 0,
      uom: item?.weights_and_measures?.net_weight + ' ' + item?.weights_and_measures?.measurement_unit,
      netWeight: item?.weights_and_measures?.net_weight,
      measurementUnit: item?.weights_and_measures?.measurement_unit,
      productName: item?.name,
      category: item?.category,
      subCategory: item?.subCategory,
      level2Category: item?.level2Category,
      brand: item?.brand,
      purchasePrice: dividedData.toFixed(3),
    });
  };

  const handleSubmit = async () => {
    if (primaryGoods?.gtin === null) {
      showSnackbar('Please select primary goods', 'error');
      return;
    } else if (primaryGoods?.batches?.length === 0) {
      showSnackbar('Please select batch for primary goods', 'error');
      return;
    } else if (finishedGoods?.gtin === null) {
      showSnackbar('Please select finished goods', 'error');
      return;
    } else if (
      primaryGoods?.batches?.some(
        (i) => i?.quantityConsumed === 0 || i?.quantityConsumed === '' || i?.quantityConsumed === null,
      )
    ) {
      showSnackbar('Please enter quantity consumed for all selected batches', 'error');
      return;
    } else if (
      finishedGoods?.quantityConsumed === 0 ||
      finishedGoods?.quantityConsumed === '' ||
      finishedGoods?.quantityConsumed === null
    ) {
      showSnackbar('Please enter quantity consumed for finished goods', 'error');
      return;
    }
    if (Number(primaryGoods?.totalQuantityConsumed) !== Number(primaryGoods?.totalProductionQty)) {
      showSnackbar('Converted quantity should be same as Production quantity', 'error');
      return;
    }
    let formateExpiryDate = finishedGoods?.expiryDate;
    if (finishedGoods?.expiryDate) {
      const now = new Date();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      const currentSeconds = now.getSeconds();
      const currentMilliseconds = now.getMilliseconds();

      // Create a new Date object by combining the selected date and current time
      const combinedDateTime = new Date(
        `${finishedGoods?.expiryDate}T${String(currentHours).padStart(2, '0')}:${String(currentMinutes).padStart(
          2,
          '0',
        )}:${String(currentSeconds).padStart(2, '0')}.${String(currentMilliseconds).padStart(3, '0')}`,
      );
      formateExpiryDate = combinedDateTime.toISOString();

      // Convert to ISO string
    }

    const convertedPgWeight = convertToBaseUnit(primaryGoods?.netWeight, primaryGoods?.measurementUnit);
    const convertedWastage = convertToBaseUnit(wastageQuant, 'Kilograms');
    const totalWastage = Number(convertedWastage) / Number(convertedPgWeight);
    let payload = {
      rawMaterials: [
        {
          gtin: primaryGoods?.gtin,
          batches: primaryGoods?.batches?.map((item) => {
            return {
              quantityConsumed: item?.quantityConsumed,
              batchNumber: item?.batchNumber,
            };
          }),
          totalQuantityConsumed: primaryGoods?.totalQuantityConsumed,
          wastage: wastageQuant ? totalWastage.toFixed(3) : 0,
          wastageReason: wastageReason?.value || 'NA',
        },
      ],
      finishedGood: {
        gtin: finishedGoods?.gtin,
        batchNumber: finishedGoods?.batchNumber,
        expiryDate: formateExpiryDate,
        availableUnits: finishedGoods?.availableUnits,
        uom: finishedGoods?.uom,
        mrp: Number(finishedGoods?.mrp),
        purchasePrice: finishedGoods?.purchasePrice,
        sellingPrice: Number(finishedGoods?.sellingPrice),
        productName: finishedGoods?.productName,
        category: finishedGoods?.category[0],
        subCategory: finishedGoods?.subCategory[0],
        level2Category: finishedGoods?.level2Category[0],
        brand: finishedGoods?.brand,
        producedQuantity: finishedGoods?.quantityConsumed,
        availableUnits: Number(finishedGoods?.quantityConsumed),
      },
      locationId: locId,
      organizationId: orgId,
      createdBy: userDetails?.uidx,
      createdByName: userDetails?.firstName + ' ' + userDetails?.secondName,
    };
    setSubmitLoader(true);
    try {
      const res = await createRepacking(payload);
      setSubmitLoader(false);
      if (res?.data?.status === 'SUCCESS' && res?.data?.data?.es === 0) {
        navigate('/inventory/repacking?page=1');
        return;
      }
      showSnackbar(res?.data?.message || res?.data?.data?.message, 'error');
    } catch (error) {
      setSubmitLoader(false);
      showSnackbar(error?.response?.data?.message || error?.message, 'error');
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar prevLink={true} />
      <SoftBox
        sx={{
          display: 'flex',
          flexDirection: 'column',
          // justifyContent: 'space-between'
          position: 'relative',
        }}
      >
        <Card sx={{ overflow: 'visible' }}>
          <SoftBox p={3}>
            <SoftBox mt={1}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={12}>
                  <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                    <SoftTypography fontSize="20px" fontWeight="bold" textTransform="capitalize" p={'0'}>
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
                          <Grid item xs={2} sm={2} md={2} mt={'10px'}>
                            <SoftBox mb={1} display="flex">
                              <InputLabel required className="repacking-header-title">
                                Barcode
                              </InputLabel>
                            </SoftBox>
                            <SoftBox display="flex" alignItems="center" gap="10px" style={{ width: '100%' }}>
                              {!primaryProductSelected ? (
                                <TextField
                                  value={primaryGoods?.gtin}
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
                                    selectProduct(newValue, true);
                                  }}
                                  onInputChange={(e, newInputValue) => {
                                    handleChangeIO({ target: { value: newInputValue } }, true);
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
                              <InputLabel required className="repacking-header-title">
                                Product Title
                              </InputLabel>
                            </SoftBox>
                            <SoftBox display="flex" alignItems="center" gap="10px" style={{ width: '100%' }}>
                              {primaryGoods?.name && primaryProductSelected ? (
                                <TextField
                                  value={primaryGoods?.name}
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
                                    selectProduct(newValue, true);
                                  }}
                                  onInputChange={(e, newInputValue) => {
                                    handleChangeIO({ target: { value: newInputValue } }, true);
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
                              <InputLabel required className="repacking-header-title">
                                UOM
                              </InputLabel>
                            </SoftBox>
                            <SoftInput value={primaryGoods?.spec} disabled />
                          </Grid>
                          <Grid item xs={1.5} sm={1.5} md={1.5} mt={'10px'}>
                            <SoftBox mb={1} display="flex">
                              <InputLabel required className="repacking-header-title">
                                Available Quantity
                              </InputLabel>
                            </SoftBox>
                            <SoftInput type="number" name="quantity" value={primaryGoods?.totalAvlQty} disabled />
                          </Grid>
                          <Grid item xs={1.2} sm={1.2} md={1.2} mt={'10px'}>
                            <SoftBox mb={1} display="flex">
                              <InputLabel required className="repacking-header-title">
                                P.P.
                              </InputLabel>
                            </SoftBox>
                            <SoftInput disabled value={primaryGoods?.totalPurchasePrice} />
                          </Grid>
                          <Grid item xs={1.2} sm={1.2} md={1.2} mt={'10px'}>
                            <SoftBox mb={1} display="flex">
                              <InputLabel required className="repacking-header-title">
                                Production Qty
                              </InputLabel>
                            </SoftBox>
                            <SoftInput disabled name="quantity" value={primaryGoods?.totalProductionQty} />
                          </Grid>
                          <Grid item xs={1.5} sm={1.5} md={1.5} mt={'10px'}>
                            <SoftBox mb={1} display="flex">
                              <InputLabel required className="repacking-header-title">
                                Converted Quantity
                              </InputLabel>
                            </SoftBox>
                            <SoftInput disabled value={primaryGoods?.totalQuantityConsumed} />
                          </Grid>
                          {allAvailableUnits?.length > 0 && (
                            <Grid item xs={0.2} sm={0.2} md={0.2} mt={'35px'}>
                              <SoftBox display="flex" justifyContent="center" onClick={() => setOpenModal(true)}>
                                <Tooltip title="Batch listing/ selection">
                                  <MoreVertOutlinedIcon fontSize="small" color="info" />
                                </Tooltip>
                              </SoftBox>
                            </Grid>
                          )}
                          <Grid item xs={6} sm={6} mt={2}>
                            <SoftBox className="hja-box">
                              <input
                                className="info-prod-check"
                                type="checkbox"
                                disabled={primaryGoods?.batches?.length === 0}
                                checked={isWastage}
                                onChange={(e) => {
                                  handleWastage(e);
                                }}
                              />
                              <span className="span-text-info">Wastage </span>
                            </SoftBox>
                            {isWastage ? (
                              <SoftBox
                                className="boom-box"
                                marginTop="20px"
                                sx={{ gap: '20px', border: 'none !important' }}
                              >
                                <SoftBox>
                                  <SoftTypography className="span-text-info" sx={{ marginBottom: '10px' }}>
                                    Wastage Value (kg/ltr)
                                  </SoftTypography>
                                  <SoftInput
                                    style={{ width: '30%' }}
                                    type="number"
                                    placeholder="kg/ltr"
                                    value={wastageQuant || ''}
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
                                    value={wastageReason}
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
                        </Grid>
                      </SoftBox>
                    </SoftBox>
                  </SoftBox>
                  <SoftBox>
                    <SoftTypography variant="h6">Finished Goods</SoftTypography>

                    {primaryGoods?.batches?.length === 0 && (
                      <span style={{ color: 'red', fontSize: '13px' }}> Please select batch for primary product</span>
                    )}
                    <SoftBox
                      style={{
                        maxHeight: '500px',
                        overflowX: 'scroll',
                      }}
                    >
                      <SoftBox mt={1} style={{ minWidth: '900px' }}>
                        <Grid container spacing={1} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                          <Grid item xs={2} sm={2} md={2} mt={'10px'}>
                            <SoftBox mb={1} display="flex">
                              <InputLabel required className="repacking-header-title">
                                Barcode
                              </InputLabel>
                            </SoftBox>
                            <SoftBox display="flex" alignItems="center" gap="10px" style={{ width: '100%' }}>
                              {!secondaryProductSelected ? (
                                <TextField
                                  value={finishedGoods?.gtin}
                                  readOnly={true}
                                  style={{
                                    width: '100%',
                                  }}
                                />
                              ) : (
                                <Autocomplete
                                  freeSolo
                                  options={autocompleteBarcodeOptions}
                                  disabled={primaryGoods?.batches?.length === 0}
                                  getOptionLabel={(option) => option.gtin}
                                  onChange={(e, newValue) => {
                                    selectProduct(newValue, false);
                                  }}
                                  onInputChange={(e, newInputValue) => {
                                    handleChangeIO({ target: { value: newInputValue } }, false);
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
                              <InputLabel required className="repacking-header-title">
                                Product Title
                              </InputLabel>
                            </SoftBox>
                            <SoftBox display="flex" alignItems="center" gap="10px" style={{ width: '100%' }}>
                              {finishedGoods?.productName && secondaryProductSelected ? (
                                <TextField
                                  value={finishedGoods?.productName}
                                  readOnly={true}
                                  style={{
                                    width: '100%',
                                  }}
                                />
                              ) : (
                                <Autocomplete
                                  freeSolo
                                  options={autocompleteTitleOptions}
                                  disabled={primaryGoods?.batches?.length === 0}
                                  getOptionLabel={(option) => option.name}
                                  onChange={(e, newValue) => {
                                    selectProduct(newValue, false);
                                  }}
                                  onInputChange={(e, newInputValue) => {
                                    handleChangeIO({ target: { value: newInputValue } }, false);
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
                              <InputLabel required className="repacking-header-title">
                                UOM
                              </InputLabel>
                            </SoftBox>
                            <SoftInput value={finishedGoods?.uom} disabled />
                          </Grid>
                          <Grid item xs={1} sm={1} md={1} mt={'10px'}>
                            <SoftBox mb={1} display="flex">
                              <InputLabel className="repacking-header-title">P.P.</InputLabel>
                            </SoftBox>
                            <SoftInput
                              value={finishedGoods?.purchasePrice}
                              type="number"
                              disabled={primaryGoods?.batches?.length === 0}
                              onChange={(e) => handleChangeValues(e.target.value, 'purchasePrice')}
                            />
                          </Grid>
                          <Grid item xs={1} sm={1} md={1} mt={'10px'}>
                            <SoftBox mb={1} display="flex">
                              <InputLabel className="repacking-header-title">MRP</InputLabel>
                            </SoftBox>
                            <SoftInput
                              value={finishedGoods?.mrp}
                              disabled={primaryGoods?.batches?.length === 0}
                              type="number"
                              onChange={(e) => handleChangeValues(e.target.value, 'mrp')}
                            />
                          </Grid>
                          <Grid item xs={1} sm={1} md={1} mt={'10px'}>
                            <SoftBox mb={1} display="flex">
                              <InputLabel className="repacking-header-title">S.P.</InputLabel>
                            </SoftBox>
                            <SoftInput
                              value={finishedGoods?.sellingPrice}
                              disabled={primaryGoods?.batches?.length === 0}
                              type="number"
                              onChange={(e) => handleChangeValues(e.target.value, 'sellingPrice')}
                            />
                          </Grid>
                          <Grid item xs={1} sm={1} md={1} mt={'10px'}>
                            <SoftBox mb={1} display="flex">
                              <InputLabel required className="repacking-header-title">
                                Quantity
                              </InputLabel>
                            </SoftBox>
                            <SoftInput
                              value={finishedGoods?.quantityConsumed}
                              disabled={primaryGoods?.batches?.length === 0}
                              type="number"
                              onChange={(e) => handleChangeValues(e.target.value, 'quantityConsumed')}
                            />
                          </Grid>
                          <Grid item xs={1} sm={1} md={1} mt={'10px'}>
                            <SoftBox mb={1} display="flex">
                              <InputLabel className="repacking-header-title">Batch No.</InputLabel>
                            </SoftBox>
                            <SoftInput
                              value={finishedGoods?.batchNumber}
                              disabled={primaryGoods?.batches?.length === 0}
                              type="text"
                              onChange={(e) => handleChangeValues(e.target.value, 'batchNumber')}
                            />
                          </Grid>
                          <Grid item xs={1.5} sm={1.5} md={1.5} mt={'10px'}>
                            <SoftBox mb={1} display="flex">
                              <InputLabel className="repacking-header-title">Expiry Date</InputLabel>
                            </SoftBox>
                            <SoftInput
                              type="date"
                              value={finishedGoods?.expiryDate}
                              disabled={primaryGoods?.batches?.length === 0}
                              onChange={(e) => handleChangeValues(e.target.value, 'expiryDate')}
                            />
                          </Grid>
                        </Grid>
                      </SoftBox>
                    </SoftBox>
                  </SoftBox>
                  <SoftBox className="grad-info-btn action-btn-inward-detail" sx={{ marginTop: '10px' }}>
                    <SoftBox className="sm-width cancel-inward-btn-div">
                      <SoftButton
                        onClick={handleClose}
                        variant={buttonStyles.secondaryVariant}
                        className="outlined-softbutton"
                      >
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
              </Grid>
            </SoftBox>
          </SoftBox>
        </Card>
      </SoftBox>
      {openModal && (
        <RepakingBatchListingModal
          openModal={openModal}
          setOpenModal={setOpenModal}
          allAvailableUnits={allAvailableUnits}
          primaryGoods={primaryGoods}
          setPrimaryGoods={setPrimaryGoods}
        />
      )}
    </DashboardLayout>
  );
};

export default InventoryNewRepacking;
