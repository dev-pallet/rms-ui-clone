import './item-listing.css';
import {
  Autocomplete,
  Badge,
  Box,
  Chip,
  Drawer,
  Grid,
  InputLabel,
  TextField,
  Tooltip,
  tooltipClasses,
} from '@mui/material';
import { buttonStyles } from '../../../../Common/buttonColor';
import {
  getAllProductSuggestionV2,
  getAllVendors,
  getAvailableStock,
  getInventoryDetails,
  getItemsInfo,
  getPIExisting,
  previPurchasePrice,
  purchaseRecommendation,
  vendorSkuDetails,
} from '../../../../../../config/Services';
import { isSmallScreen, productIdByBarcode } from '../../../../Common/CommonFunction';
import { useDebounce } from 'usehooks-ts';
import { useSnackbar } from '../../../../../../hooks/SnackbarProvider';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import CancelIcon from '@mui/icons-material/Cancel';
import FlagIcon from '@mui/icons-material/Flag';
import ProductMobCard from '../product-mob-card';
import React, { useEffect, useRef, useState } from 'react';
import SoftBox from '../../../../../../components/SoftBox';
import SoftButton from '../../../../../../components/SoftButton';
import SoftInput from '../../../../../../components/SoftInput';
import SoftTypography from '../../../../../../components/SoftTypography';
import Spinner from '../../../../../../components/Spinner';
import styled from '@emotion/styled';
// import BarcodeScannerComponent from 'react-qr-barcode-scanner';
import { emit, useNativeMessage } from 'react-native-react-bridge/lib/web';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import InfoIcon from '@mui/icons-material/Info';
import Swal from 'sweetalert2';

const PurchaseItemListing = ({
  itemListArray,
  rowData,
  setRowData,
  handleVendorProduct,
  vendorId,
  vendorDisplayName,
  setEstimatedCost,
  setTotalEstimate,
  setOverAllCess,
  setOverAllCgst,
  setOverAllSgst,
  calCulateTotalEstimate,
  vendorCreditNoteUsed,
  isCreditApplied,
  deliveryCharge,
  labourCharge,
  // calculateMultiplicationAndAddition,
  handleDelete,
  handleExistingPI,
  handleItemDelete,
  mobileItemAddModal,
  setMobileItemAddModal,
  vendorNameOption,
  allVendorList,
  isVendorSelected,
  approvedTo,
  warehouseLocName,
  assignedTo,
  expectedDate,
  createNewPI,
  editDraftPI,
  setListDisplay,
  isItemChanged,
  setItemChanged,
  listDisplay,
  isClearedLoader,
  boxRef,
  // receiveFunction
  // handleFlagdata,
}) => {
  const showSnackbar = useSnackbar();
  const [autocompleteTitleOptions, setAutocompleteTitleOptions] = useState([]);
  const [autocompleteBarcodeOptions, setAutocompleteBarcodeOptions] = useState([]);
  const [curentProductName, setCurentProductName] = useState('');
  const debounceProductName = useDebounce(curentProductName, 700);
  const isMobileDevice = isSmallScreen();
  const [productAddKey, setProductAddKey] = useState(0);
  const [productAddLoader, setProductAddLoader] = useState(false);
  const [piScanner, setPiScanner] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanningLoader, setIsScanningLoader] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState();
  const [currIndex, setCurrIndex] = useState(0);
  const [quantChange, setQuantChange] = useState('');
  const debounceQuant = useDebounce(quantChange, 700);

  const [productSelected, setProductSelected] = useState([]);
  const piNum = localStorage.getItem('piNum');
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const contextType = localStorage.getItem('contextType');
  const epoNumber = localStorage.getItem('epoNumber');
  const user_details = JSON.parse(localStorage.getItem('user_details'));
  const uidx = user_details.uidx;
  const mobileItemsRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (rowData?.length > 2 && isMobileDevice) {
      // Scroll to the bottom of the div
      mobileItemsRef.current.scrollTo({
        top: mobileItemsRef.current.scrollHeight,
        behavior: 'smooth', // You can change this to 'auto' for instant scrolling
      });
    }
  }, [rowData]);

  useEffect(() => {
    const updatedRow = itemListArray?.map((e) => {
      return {
        itemId: uuidv4(),
        id: e?.id || '',
        itemCode: e?.itemCode,
        itemName: e?.itemName,
        preferredVendor: e?.preferredVendor || '',
        previousPurchasePrice: e?.previousPurchasePrice || '',
        vendorId: e?.vendorId || '',
        spec: e?.spec || '',
        finalPrice: e?.finalPrice || '',
        quantityOrdered: e?.quantityOrdered || '',
        purchaseRecommendationFlag: e?.purchaseRecommendationFlag || '',
        purchaseFlagReason: e?.purchaseFlagReason || '',
        salesFlag: e?.salesFlag || '',
        inventoryFlag: e?.inventoryFlag || '',
        profitFlag: e?.profitFlag || '',
        previousQuantityOrdered: e?.previousQuantityOrdered || '',
        availableStock: e?.availableStock || '',
        purchaseMargin: e?.purchaseMargin || '',
        salesPerWeek: e?.salesPerWeek || '',
        cess: e?.cess || 0,
        igst: e?.igst || 0,
        cgst: e?.cgst || 0,
        sgst: e?.sgst || 0,
        hsnCode: e?.hsnCode || '',
      };
    });
    setRowData(updatedRow);
    setProductSelected(Array(updatedRow.length).fill(false));
  }, [itemListArray]);

  useEffect(() => {
    if (debounceProductName !== '' && debounceProductName !== undefined) {
      const searchProduct = async () => {
        const searchText = debounceProductName;
        const isNumber = !isNaN(+searchText);
        const payload = {
          page: 1,
          pageSize: '10',
          // storeLocationId: locId?.toLocaleLowerCase(),
          storeLocations: [locId],
          barcode: [],
          query: '',
        };
        if (searchText !== '') {
          payload.query = searchText;
          // if (isNumber) {
          //   payload.barcode = [searchText];
          // } else {
          //   payload.query = searchText;
          // }
        }
        getAllProductSuggestionV2(payload)
          .then(function (res) {
            if (res?.data?.status === 'SUCCESS') {
              const response = res?.data?.data?.data?.data;
              const extractedVariants = response?.flatMap((product) =>
                product?.variants?.map((variant) => {
                  const primaryWeight = variant?.weightsAndMeasures?.find((ele) => ele?.type === 'PRIMARY');
                  const fallbackWeight = variant?.weightsAndMeasures?.[0];

                  return {
                    ...variant,
                    itemCode: variant?.barcodes?.[0] || null,
                    gtin: variant?.barcodes?.[0] || null,
                    itemName: variant?.name || 'NA',
                    name: variant?.name,
                    productSource: variant?.storeSpecificData,
                    igst: variant?.taxReference?.taxRate || 0,
                    cess: variant?.taxReference?.metaData?.cess || 0,
                    sgst: variant?.taxReference?.metaData?.sgst || 0,
                    cgst: variant?.taxReference?.metaData?.cgst || 0,
                    hsnCode: variant?.taxReference?.metaData?.hsnCode,
                    purchaseMargin: variant?.purchaseSync?.purchaseMargin || 0,
                    spec: `${primaryWeight?.grossWeight || fallbackWeight?.grossWeight || ''}${
                      primaryWeight?.measurementUnit || fallbackWeight?.measurementUnit
                        ? ' ' + (primaryWeight?.measurementUnit || fallbackWeight?.measurementUnit)
                        : ''
                    }`,
                    availableStock: variant?.inventorySync?.availableQuantity || 0,
                  };
                }),
              );

              if (isNumber && extractedVariants?.length === 1) {
                selectProduct(extractedVariants?.[0], currIndex);
              } else if (extractedVariants?.length > 1) {
                if (!isNumber) {
                  setAutocompleteTitleOptions(extractedVariants);
                } else {
                  setAutocompleteBarcodeOptions(extractedVariants);
                }
              }
              setProductSelected((prevState) => {
                const newState = [...prevState];
                newState[currIndex] = isNumber;
                return newState;
              });
            }
          })
          .catch((err) => {
            showSnackbar(err?.response?.data?.message, 'error');
          });
      };
      searchProduct();
    }
  }, [debounceProductName]);

  const sumOfarray = (array) => {
    const sum = array.reduce((acc, currentValue) => {
      const numValue = isNaN(currentValue) ? parseFloat(currentValue) : Number(currentValue);
      return acc + numValue;
    }, 0);
    return sum;
  };

  useEffect(() => {
    if (debounceQuant !== '') {
      if (piNum) {
        editDraftPI();
      } else {
        setListDisplay(false);
        createNewPI();
      }
      setQuantChange('');
    }
  }, [debounceQuant]);

  const handleAddmore = () => {
    if (approvedTo.uidx === '' || assignedTo?.length === 0 || warehouseLocName === '' || expectedDate === '') {
      showSnackbar('Enter all the required fields', 'error');
      return;
    }
    const newRowData = [
      ...rowData,
      {
        itemId: uuidv4(),
        id: '',
        itemCode: '',
        itemName: '',
        preferredVendor: '',
        previousPurchasePrice: '',
        vendorId: '',
        spec: '',
        finalPrice: '',
        quantityOrdered: '',
        purchaseRecommendationFlag: '',
        purchaseFlagReason: '',
        salesFlag: '',
        inventoryFlag: '',
        profitFlag: '',
        previousQuantityOrdered: '',
        availableStock: '',
        purchaseMargin: '',
        salesPerWeek: '',
        cess: 0,
        igst: 0,
        cgst: 0,
        sgst: 0,
      },
    ];
    setRowData(newRowData);
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
    setMobileItemAddModal(true);
    if (isItemChanged) {
      editDraftPI(newRowData);
    }
  };

  const handleChangeIO = (e, index) => {
    // e.preventDefault();
    setCurentProductName(e.target.value);
    setCurrIndex(index);
  };

  const handleMrp = async (gtin, index) => {
    const updatedData = [...rowData];
    try {
      const res = await getInventoryDetails(locId, gtin);
      let newMRp = 0;
      if (res?.data?.data?.es) {
        updatedData[index]['finalPrice'] = 0;
      } else {
        const response = res?.data?.data?.data?.multipleBatchCreations;
        if (response?.length > 0) {
          newMRp = response[0]?.mrp;
        }
        updatedData[index]['finalPrice'] = newMRp;
      }
      setRowData(updatedData);
    } catch (error) {
      updatedData[index]['finalPrice'] = 0;
      setRowData(updatedData);
    }
  };

  const handleFlagdata = (itemCode, index) => {
    const payload = {
      gtin: itemCode,
      locationId: locId,
      orgId: orgId,
    };
    purchaseRecommendation(payload)
      .then((res) => {
        if (res?.data?.status === 'SUCCESS') {
          const response = res?.data?.data;
          if (response?.es) {
            const updateData = [...rowData];
            updateData[index]['purchaseRecommendationFlag'] = 'NA';
            updateData[index]['purchaseFlagReason'] = 'NA';
            updateData[index]['salesFlag'] = 'NA';
            updateData[index]['inventoryFlag'] = 'NA';
            updateData[index]['profitFlag'] = 'NA';
            setRowData(updateData);

            setFlagDataLoader(false);
            return;
          }

          const updateData = [...rowData];
          updateData[index]['purchaseRecommendationFlag'] = response?.productForecast?.flag || 'GREY';
          updateData[index]['purchaseFlagReason'] = response?.productForecast?.recommendation;
          updateData[index]['salesFlag'] = response?.productForecast?.salesCat || 'NA';
          updateData[index]['inventoryFlag'] = response?.productForecast?.inventoryCat || 'NA';
          updateData[index]['profitFlag'] = response?.productForecast?.grossProfitCat || 'NA';
          setRowData(updateData);

          if (updateData[index]['inventoryFlag'] === 'D') {
            // OPEN ALERT
            const newSwal = Swal.mixin({
              buttonsStyling: false,
            });
            newSwal
              .fire({
                title: 'This product is a dead stock, do you still want to buy this product?',
                icon: 'warning',
                confirmButtonText: 'Confirm',
                showCancelButton: true,
                reverseButtons: true,
                customClass: {
                  title: 'custom-swal-title',
                  cancelButton: 'logout-cancel-btn',
                  confirmButton: 'logout-success-btn',
                },
              })
              .then((result) => {
                if (!result.isConfirmed) {
                  if (isMobileDevice) {
                    handleDelete(index, true);
                  } else {
                    handleDelete(index);
                  }
                }
              });
          }

          setFlagDataLoader(false);
        } else {
          const updateData = [...rowData];
          updateData[index]['purchaseRecommendationFlag'] = 'NA';
          updateData[index]['purchaseFlagReason'] = 'NA';
          updateData[index]['salesFlag'] = 'NA';
          updateData[index]['inventoryFlag'] = 'NA';
          updateData[index]['profitFlag'] = 'NA';
          setRowData(updateData);

          setFlagDataLoader(false);
        }
      })
      .catch((err) => {
        // const updateData = [...rowData];
        // updateData[index]['purchaseRecommendationFlag'] = 'NA';
        // updateData[index]['purchaseFlagReason'] = 'NA';
        // updateData[index]['salesFlag'] = 'NA';
        // updateData[index]['inventoryFlag'] = 'NA';
        // updateData[index]['profitFlag'] = 'NA';
        // setRowData(updateData);

        setFlagDataLoader(false);
      });
  };

  const focusQuantityInput = (index) => {
    const quantityInput = document.getElementById(`quantityInput-${index}`);
    if (quantityInput) {
      quantityInput.focus();
    }
  };

  const selectProduct = (item, index, editing) => {
    if (item === null) {
      setProductSelected((prevState) => {
        const newState = [...prevState];
        newState[index] = undefined;
        return newState;
      });
      const updatedRow = [...rowData];
      updatedRow[index]['preferredVendor'] = '';
      updatedRow[index]['vendorId'] = '';
      updatedRow[index]['itemName'] = '';
      updatedRow[index]['itemCode'] = '';
      updatedRow[index]['finalPrice'] = '';
      updatedRow[index]['spec'] = '';
      updatedRow[index]['previousPurchasePrice'] = 0;
      updatedRow[index]['previousQuantityOrdered'] = 0;
      updatedRow[index]['availableStock'] = 0;
      updatedRow[index]['quantityOrdered'] = 0;
      updatedRow[index]['purchaseRecommendationFlag'] = '';
      updatedRow[index]['purchaseFlagReason'] = '';
      updatedRow[index]['inventoryFlag'] = '';
      updatedRow[index]['salesFlag'] = '';
      updatedRow[index]['profitFlag'] = '';
      updatedRow[index]['hsnCode'] = '';
      updatedRow[index]['igst'] = 0;
      updatedRow[index]['cgst'] = 0;
      updatedRow[index]['sgst'] = 0;
      updatedRow[index]['cess'] = 0;
      setRowData(updatedRow);
      return;
    }
    setCurentProductName('');
    // setMobileItemAddModal(true)
    setProductAddLoader(true);
    setFlagDataLoader(true);
    setAutocompleteTitleOptions([]);
    setAutocompleteBarcodeOptions([]);

    if (item?.gtin !== undefined && item?.gtin !== '') {
      const updatedRow = [...rowData];
      if (!editing && rowData?.find((ele) => ele?.itemCode === item?.gtin)) {
        showSnackbar('Product is already added', 'error');
        setIsScanningLoader(false);
        setIsScanning(false);
        setProductAddLoader(false);
        return;
      } else if (isVendorSelected) {
        updatedRow[index]['preferredVendor'] = vendorDisplayName;
        updatedRow[index]['vendorId'] = vendorId;
      } else {
        productWithVendor(item?.gtin, index);
      }
      updatedRow[index]['itemName'] = item?.name;
      updatedRow[index]['itemCode'] = item?.gtin;
      updatedRow[index]['igst'] = item?.igst || 0;
      updatedRow[index]['cgst'] = item?.cgst || 0;
      updatedRow[index]['sgst'] = item?.sgst || 0;
      updatedRow[index]['cess'] = item?.cess || 0;
      updatedRow[index]['hsnCode'] = item?.hs_code || '';
      // updatedRow[index]['finalPrice'] = item?.mrp?.mrp;
      // const prodWeight = item?.weights_and_measures?.net_weight || '';
      // const prodUnit = item?.weights_and_measures?.measurement_unit || '';
      updatedRow[index]['spec'] = item?.spec;

      handleExistingPI(item?.gtin, index);
      handleFlagdata(item?.gtin, index);
      handleMrp(item?.gtin, index);
      if (editing) {
        updatedRow[index]['quantityOrdered'] = item?.quantityOrdered;
        updatedRow[index]['salesPerWeek'] = item?.salesPerWeek;
        updatedRow[index]['purchaseMargin'] = item?.purchaseMargin;
        updatedRow[index]['preferredVendor'] = item?.preferredVendor;
        updatedRow[index]['vendorId'] = item?.vendorId;
      }
      setRowData(updatedRow);

      getPreviousPurchsePrice(item?.gtin, index);
      productAvailableStock(item?.gtin, index);
      setProductAddKey(productAddKey + 1);
      setIsScanningLoader(false);
      setIsScanning(false);
      setProductAddLoader(false);
      setMobileItemAddModal(true);
      focusQuantityInput(index);
      if (!piNum) {
        createNewPI();
      }
    } else {
      setProductSelected((prevState) => {
        const newState = [...prevState];
        newState[index] = undefined;
        return newState;
      });
      const updatedRow = [...rowData];
      updatedRow[index]['preferredVendor'] = '';
      updatedRow[index]['vendorId'] = '';
      updatedRow[index]['itemName'] = '';
      updatedRow[index]['itemCode'] = '';
      updatedRow[index]['finalPrice'] = '';
      updatedRow[index]['spec'] = '';
      updatedRow[index]['previousPurchasePrice'] = 0;
      updatedRow[index]['purchaseMargin'] = 0;
      updatedRow[index]['salesPerweek'] = 0;
      updatedRow[index]['availableStock'] = 0;
      updatedRow[index]['quantityOrdered'] = 0;
      updatedRow[index]['purchaseRecommendationFlag'] = '';
      updatedRow[index]['purchaseFlagReason'] = '';
      updatedRow[index]['inventoryFlag'] = '';
      updatedRow[index]['salesFlag'] = '';
      updatedRow[index]['profitFlag'] = '';
      updatedRow[index]['hsnCode'] = '';
      updatedRow[index]['igst'] = 0;
      updatedRow[index]['cgst'] = 0;
      updatedRow[index]['sgst'] = 0;
      updatedRow[index]['cess'] = 0;
      setRowData(updatedRow);
    }
  };

  //Scanner functionality

  useNativeMessage((message) => {
    const data = JSON.parse(message?.data);
    if (message?.type === 'gtin') {
      handleBarcodeScan(null, { text: data?.gtin });
    }
  });

  const handleBarcodeScan = (err, result) => {
    if (result) {
      setIsScanningLoader(true);
      setIsScanning(true);
      setCurentProductName(result.text);
      setPiScanner(false);
    }
  };

  const getPreviousPurchsePrice = (gtin, index) => {
    previPurchasePrice(gtin, orgId)
      .then((res) => {
        const response = res?.data?.data;
        const updateRow = [...rowData];
        updateRow[index]['previousPurchasePrice'] =
          response?.previousPurchasePrice === 'NA' ? 0 : response?.previousPurchasePrice;
        updateRow[index]['previousQuantityOrdered'] = response?.quantityOrdered;
        setRowData(updateRow);
      })
      .catch((err) => {
        // const updateRow = [...rowData];
        // updateRow[index]['previousPurchasePrice'] = 0;
        // updateRow[index]['previousQuantityOrdered'] = 0;
        // setRowData(updateRow);

        showSnackbar(err?.response?.data?.message || 'Some error occured', 'error');
      });
  };

  const [flagDataLoader, setFlagDataLoader] = useState(false);

  const productAvailableStock = (gtin, index) => {
    getAvailableStock(locId, gtin)
      .then((res) => {
        const response = res?.data?.data;
        if (response?.es) {
          const updateRow = [...rowData];
          updateRow[index]['availableStock'] = 0;
          setRowData(updateRow);

          return;
        }

        const updateRow = [...rowData];
        updateRow[index]['availableStock'] = response?.data?.availableUnits;
        setRowData(updateRow);
      })
      .catch((err) => {
        showSnackbar(err?.response?.data?.message || 'Some error occured', 'error');
      });
  };

  const productWithVendor = async (gtin, index) => {
    const payload = { gtin: [gtin] };

    try {
      const res = await vendorSkuDetails(payload);
      const response = res?.data?.data;
      const updatedData = [...rowData];

      if (response?.status && response?.object?.length > 0) {
        const vendorPayload = {
          page: 1,
          pageSize: 50,
          filterVendor: {
            searchText: response.object[0].vendorId || '',
            startDate: '',
            endDate: '',
            locations: [],
            type: [],
            productName: [],
            productGTIN: [],
          },
        };

        try {
          const vendorRes = await getAllVendors(vendorPayload, orgId);
          if (vendorRes?.data?.status === 'ERROR') {
            throw new Error('Vendor data retrieval failed');
          }
          const vendors = vendorRes?.data?.data?.vendors || [];
          const selectedVendor = vendors?.find((v) => v?.vendorId == response?.object[0]?.vendorId) || {};
          updatedData[index] = {
            ...updatedData[index],
            vendorId: selectedVendor.vendorId || '',
            preferredVendor: selectedVendor.vendorName || '',
          };
        } catch {
          updatedData[index] = { ...updatedData[index], vendorId: '', preferredVendor: '' };
        }
      } else {
        updatedData[index] = { ...updatedData[index], vendorId: '', preferredVendor: '' };
      }
      setRowData(updatedData);
    } catch {
      setRowData((prevData) => {
        const updatedData = [...prevData];
        updatedData[index] = { ...updatedData[index], vendorId: '', preferredVendor: '' };
        return updatedData;
      });
    }
  };

  const handleChangeValues = (e, index) => {
    const updateRow = [...rowData];
    updateRow[index]['quantityOrdered'] = e.target.value;
    setRowData(updateRow);

    setQuantChange(e.target.value);
  };

  const FlagTooltips = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)(
    ({ theme }) => ({
      [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#fff',
        color: 'rgba(0, 0, 0, 0.87)',
        maxWidth: 750,
        fontSize: theme.typography.pxToRem(12),
        boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
        padding: '10px',
        border: '2px dotted rgb(158, 156, 156)',
      },
    }),
  );

  const categoryColour = (data) => {
    switch (data) {
      case 'GREEN':
        return 'success';
      case 'ORANGE':
        return 'warning';
      case 'RED':
        return 'error';
      case 'GREY':
        return 'secondary';
      case 'A':
        return 'success';
      case 'B':
        return 'warning';
      case 'C':
        return 'error';
      default:
        return 'info';
    }
  };

  const getTagDescription = (type, result) => {
    if (type === 'INVENTORY') {
      switch (result) {
        case 'A':
          return 'Highest Consumption';
        case 'B':
          return 'Average Consumption';
        case 'C':
          return 'Lowest Consumption';
        case 'D':
          return 'Dead Stock';
        default:
          return '';
      }
    } else if (type === 'SALES') {
      switch (result) {
        case 'A':
          return 'Fast Movement';
        case 'B':
          return 'Average Movement';
        case 'C':
          return 'Low Movement';
        default:
          return '';
      }
    } else if (type === 'PROFIT') {
      switch (result) {
        case 'A':
          return 'Highest Value';
        case 'B':
          return 'Average Value';
        case 'C':
          return 'Lowest Value';
        default:
          return '';
      }
    }
  };

  const handleVendorSelect = (e, index) => {
    if (isMobileDevice) {
      const vendorLabel = vendorNameOption?.filter((item) => {
        if (item.value === e.target.value) {
          return item;
        }
      });
      const updateData = [...rowData];
      updateData[index]['preferredVendor'] = vendorLabel[0]?.label;
      updateData[index]['vendorId'] = e.target.value;
      setRowData(updateData);

      if (rowData[index]?.quantityOrdered !== '' && rowData[index]?.quantityOrdered !== undefined) {
        setQuantChange(e.target.value);
      }
    } else {
      const updateData = [...rowData];
      updateData[index]['preferredVendor'] = e.label;
      updateData[index]['vendorId'] = e.value;
      setRowData(updateData);
      if (rowData[index]?.quantityOrdered !== '' && rowData[index]?.quantityOrdered !== undefined) {
        setItemChanged(true);
      }
    }
  };

  useEffect(() => {
    if (rowData[0]?.vendorId !== '' && mobileItemAddModal && isMobileDevice) {
      const vendorPayload = {
        page: 1,
        pageSize: 50,
        filterVendor: {
          searchText: rowData[0]?.vendorId?.[0] || '',
          startDate: '',
          endDate: '',
          locations: [],
          type: [],
          productName: [],
          productGTIN: [],
        },
      };

      try {
        const vendorRes = getAllVendors(vendorPayload, orgId);
        if (vendorRes?.data?.status === 'ERROR') {
          throw new Error('Vendor data retrieval failed');
        }
        const vendors = vendorRes?.data?.data?.vendors || [];
        // const vendorName = vendorNameOption?.filter((item) => item.value === rowData[0]?.vendorId)?.[0]?.label;
        const vendorName = vendors?.filter((v) => v?.vendorId == rowData[0]?.vendorId)?.[0]?.label;
        const options = document.getElementById('vendor') !== null && document.getElementById('vendor')?.options;
        for (let i = 0; i < options.length; i++) {
          if (options[i].text === vendorName) {
            options[i].selected = true;
            break;
          }
        }
      } catch {
        updatedData[index] = { ...updatedData[index], vendorId: '', preferredVendor: '' };
      }
    }
  }, [rowData, mobileItemAddModal]);

  const handleProductNavigation = async (barcode) => {
    try {
      const productId = await productIdByBarcode(barcode);
      if (productId) {
        navigate(`/products/product/details/${productId}`);
      }
    } catch (error) {}
  };

  return (
    <>
      <div>
        <SoftBox
          className={`${isMobileDevice && 'create-pi-card po-box-shadow'}`}
          sx={{
            padding: isMobileDevice && '24px !important',
            marginBottom: isMobileDevice && '10px !important',
            height: !isMobileDevice && rowData?.length > 10 ? '550px' : 'auto',
            overflowX: !isMobileDevice && 'scroll',
            overflowY: !isMobileDevice && 'hidden',
          }}
        >
          {!isMobileDevice && rowData?.length > 0 && (
            <div
              ref={boxRef}
              style={{
                overflowY: 'scroll',
                overflowX: 'scroll',
                // marginLeft: '-5px',
                minWidth: '1047px',
                maxHeight: rowData?.length > 10 ? '550px' : 'auto',
              }}
            >
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th className="express-grn-columns grn-background-color"></th>
                    <th className="express-grn-barcode-column grn-background-color"></th>
                    <th className="express-grn-barcode-column grn-background-color"></th>
                    <th className="express-grn-columns grn-background-color"></th>
                    <th className="express-grn-columns grn-background-color"></th>
                    <th className="express-grn-columns grn-background-color"></th>
                    <th className="express-grn-columns grn-background-color"></th>
                    <th className="express-grn-columns grn-background-color"></th>
                    <th className="express-grn-columns grn-background-color"></th>
                    {/* <th className="express-grn-vendor-column grn-background-color"></th> */}
                    <th className="express-grn-columns grn-background-color"></th>
                  </tr>
                </thead>
                <tbody>
                  {rowData?.map((row, index) => {
                    const isBarcodeSelected = productSelected[index];
                    const selectedVendor =
                      vendorNameOption?.length > 0
                        ? vendorNameOption?.find((option) => option?.value === row?.vendorId)
                        : {
                            value: row?.vendorId,
                            label: row?.preferredVendor === '' ? 'Select' : row?.preferredVendor,
                          };
                    const newPurchaseMargin =
                      row?.purchaseMargin !== undefined
                        ? row?.purchaseMargin === ''
                          ? '0'
                          : row?.purchaseMargin || 0
                        : '0';
                    return (
                      <tr key={row?.itemId} style={{ minWidth: '960px' }}>
                        {/* S.No */}
                        <td className="express-grn-rows">
                          {row?.purchaseRecommendationFlag === 'NA' ||
                          row?.purchaseRecommendationFlag === '' ||
                          row?.purchaseRecommendationFlag === '' ? (
                            <SoftBox className="product-input-label product-aligning">
                              <SoftInput type="number" readOnly={true} value={index + 1} />
                            </SoftBox>
                          ) : (
                            <Badge
                              badgeContent={
                                <FlagTooltips
                                  placement="bottom-start"
                                  title={
                                    <div className="tooltip-flag-recommend">
                                      <div className="tooltip-flag-heading-name">
                                        <SoftTypography fontSize="14px" fontWeight="bold">
                                          Recommendation:
                                        </SoftTypography>
                                        <SoftTypography
                                          fontSize="14px"
                                          fontWeight="bold"
                                          mt={row?.inventoryFlag === 'D' ? '' : 1}
                                        >
                                          Inventory:
                                        </SoftTypography>
                                        <SoftTypography fontSize="14px" fontWeight="bold" mt={1}>
                                          Sales:
                                        </SoftTypography>
                                        <SoftTypography fontSize="14px" fontWeight="bold" mt={1}>
                                          Gross Profit:
                                        </SoftTypography>
                                      </div>
                                      <div className="tooltip-flag-heading-name">
                                        <SoftTypography fontSize="14px">
                                          {row?.purchaseFlagReason || 'NA'}
                                        </SoftTypography>
                                        <div className={row?.inventoryFlag === 'D' ? 'tooltip-flag-cat-data' : ''}>
                                          {row?.inventoryFlag === 'D' ? (
                                            <span style={{ color: 'red', fontSize: '14px', fontWeight: 'bold' }}>
                                              Dead Stock
                                            </span>
                                          ) : (
                                            <>
                                              <Chip
                                                color={categoryColour(row?.inventoryFlag)}
                                                label={row?.inventoryFlag || 'NA'}
                                              />
                                              {row?.inventoryFlag !== 'NA' && (
                                                <Chip
                                                  color={categoryColour(row?.inventoryFlag)}
                                                  label={getTagDescription('INVENTORY', row?.inventoryFlag) || 'NA'}
                                                />
                                              )}
                                            </>
                                          )}
                                        </div>
                                        <div className="tooltip-flag-cat-data">
                                          <Chip color={categoryColour(row?.salesFlag)} label={row?.salesFlag || 'NA'} />
                                          {row?.salesFlag !== 'NA' && (
                                            <Chip
                                              color={categoryColour(row?.salesFlag)}
                                              label={getTagDescription('SALES', row?.salesFlag) || 'NA'}
                                            />
                                          )}
                                        </div>
                                        <div className="tooltip-flag-cat-data">
                                          <Chip
                                            color={categoryColour(row?.profitFlag)}
                                            label={row?.profitFlag || 'NA'}
                                          />
                                          {row?.profitFlag !== 'NA' && (
                                            <Chip
                                              color={categoryColour(row?.profitFlag)}
                                              label={getTagDescription('PROFIT', row?.profitFlag) || 'NA'}
                                            />
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  }
                                >
                                  <FlagIcon
                                    fontSize="small"
                                    style={{ color: '#fff', cursor: 'pointer', marginLeft: '25px' }}
                                  />
                                </FlagTooltips>
                              }
                              color={categoryColour(row?.purchaseRecommendationFlag || 'NA')}
                              anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                              }}
                            >
                              <SoftBox className="product-input-label product-aligning" style={{ maxWidth: '49.91px' }}>
                                <SoftInput type="number" readOnly={true} value={index + 1} />
                              </SoftBox>
                            </Badge>
                          )}
                        </td>

                        {/* Barcode */}
                        <td className="express-grn-rows">
                          <SoftBox className="product-input-label" style={{ width: '100%' }}>
                            {isBarcodeSelected === false ? (
                              <TextField
                                value={row?.itemCode}
                                readOnly={true}
                                style={{
                                  width: '100%',
                                }}
                                onClick={() => {
                                  row?.itemCode ? handleProductNavigation(row?.itemCode) : null;
                                }}
                              />
                            ) : row?.id !== '' && row?.itemCode !== '' ? (
                              <TextField
                                value={row?.itemCode}
                                readOnly={true}
                                style={{ width: '100%' }}
                                onClick={() => {
                                  row?.itemCode ? handleProductNavigation(row?.itemCode) : null;
                                }}
                              />
                            ) : (
                              <Autocomplete
                                freeSolo
                                // disabled
                                options={autocompleteBarcodeOptions}
                                getOptionLabel={(option) => option.gtin}
                                onChange={(e, newValue) => {
                                  selectProduct(newValue, index);
                                }}
                                onInputChange={(e, newInputValue) => {
                                  handleChangeIO({ target: { value: newInputValue } }, index);
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
                        </td>

                        {/* Title */}
                        <td className="express-grn-rows">
                          <SoftBox className="product-input-label" style={{ width: '100%' }}>
                            {row.id !== '' ? (
                              <TextField value={row.itemName} readOnly={true} style={{ width: '100%' }} />
                            ) : isBarcodeSelected === true && row.itemName !== '' ? (
                              <TextField value={row.itemName} readOnly={true} style={{ width: '100%' }} />
                            ) : (
                              <Autocomplete
                                freeSolo
                                // disabled
                                options={autocompleteTitleOptions}
                                getOptionLabel={(option) => option.name}
                                onChange={(e, newValue) => {
                                  selectProduct(newValue, index);
                                }}
                                onInputChange={(e, newInputValue) => {
                                  handleChangeIO({ target: { value: newInputValue } }, index);
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
                        </td>
                        {/* Specification */}
                        <td className="express-grn-rows">
                          <Tooltip title={row?.spec ? row?.spec : ''}>
                            <div>
                              <SoftInput disabled value={row?.spec ? row?.spec : ''} />
                            </div>
                          </Tooltip>
                        </td>

                        {/* MRP */}
                        <td className="express-grn-rows">
                          <SoftInput
                            type="number"
                            disabled
                            className="product-aligning"
                            value={row?.finalPrice ? row?.finalPrice : '0'}
                          />
                        </td>

                        {/* P Margin */}
                        <td className="express-grn-rows">
                          {Number(newPurchaseMargin) < 0 ? (
                            <Tooltip title="Purchase margin should not be less than 0">
                              <div>
                                <SoftInput
                                  disabled
                                  type="number"
                                  className="product-not-added product-aligning"
                                  value={newPurchaseMargin}
                                />
                              </div>
                            </Tooltip>
                          ) : (
                            <SoftInput disabled type="number" className="product-aligning" value={newPurchaseMargin} />
                          )}
                        </td>

                        {/*  Available Stock */}
                        <td className="express-grn-rows">
                          <SoftInput
                            disabled
                            type="number"
                            className="product-aligning"
                            value={
                              row?.availableStock !== undefined
                                ? row?.availableStock === ''
                                  ? '0'
                                  : row?.availableStock || 0
                                : '0'
                            }
                          />
                        </td>

                        {/* Sales per week */}
                        <td className="express-grn-rows">
                          <SoftInput
                            disabled
                            type="number"
                            className="product-aligning"
                            value={row?.salesPerWeek ? (row?.salesPerWeek !== 'NA' ? row?.salesPerWeek : 0) : '0'}
                          />
                        </td>

                        {/* Qty */}
                        <td className="express-grn-rows">
                          <SoftInput
                            type="number"
                            name="quantity"
                            id={`quantityInput-${index}`}
                            className="product-aligning"
                            disabled={row?.itemCode !== '' && row?.itemCode ? false : true}
                            value={
                              row?.quantityOrdered ? (row?.quantityOrdered !== 'NA' ? row?.quantityOrdered : 0) : ''
                            }
                            onChange={(e) => {
                              setItemChanged(true);
                              const updateRow = [...rowData];
                              updateRow[index]['quantityOrdered'] = e.target.value;
                              setRowData(updateRow);
                            }}
                          />
                        </td>

                        {/* Vendor */}
                        {/* <td className="express-grn-rows">
                        <SoftBox className="express-grn-product-box" style={{ width: '100%' }}>
                          <SoftSelect
                            menuPortalTarget={document.body}
                            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                            style={{ width: '100%' }}
                            value={selectedVendor || ''}
                            isDisabled={row?.itemCode === '' || isVendorSelected ? true : false}
                            onChange={(e) => handleVendorSelect(e, index)}
                            options={vendorNameOption}
                            onFocus={vendorNameOption.length === 0 ? () => allVendorList() : undefined}
                          />
                        </SoftBox>
                      </td> */}

                        {/* Delete */}
                        <td className="express-grn-rows">
                          <SoftBox
                            // mt={index === 0 ? '49px' : '10px'}
                            width="100%"
                            height="40px"
                            style={{
                              cursor: 'pointer',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                            disabled={listDisplay ? true : false}
                          >
                            <CancelIcon onClick={() => handleItemDelete(index)} fontSize="small" color="error" />
                          </SoftBox>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </SoftBox>

        {!isMobileDevice && (
          <>
            <SoftTypography
              className="add-more-text"
              component="label"
              variant="caption"
              fontWeight="bold"
              onClick={handleAddmore}
              // sx={{ marginLeft: '-10px', color: '#0562FB' }}
            >
              + Add More
            </SoftTypography>
            {approvedTo.uidx === '' || assignedTo?.length === 0 || warehouseLocName === '' || expectedDate === '' ? (
              <SoftTypography fontSize="small" style={{ color: 'red' }}>
                {' '}
                Enter all the mandatory fields{' '}
              </SoftTypography>
            ) : null}
          </>
        )}
      </div>

      {isMobileDevice && (
        // <SoftBox className="prdt-card-main-container">
        <SoftBox
          ref={mobileItemsRef}
          className="mob-card-newpi-container"
          sx={{ overflowY: rowData?.length <= 2 ? 'unset' : 'scroll' }}
        >
          {rowData?.map((row, index) => {
            return (
              <ProductMobCard
                key={index}
                index={index}
                rowData={rowData}
                barcodeNumber={row?.itemCode}
                productName={row?.itemName}
                specification={row?.spec}
                availableStock={row?.availableStock}
                purchaseMargin={row?.purchaseMargin}
                salesPerWeek={row?.salesPerWeek}
                mrp={row?.finalPrice}
                quantityOrdered={row?.quantityOrdered}
                preferredVendor={row?.preferredVendor}
                vendorId={row?.vendorId}
                handleDelete={handleDelete}
                mobileItemAddModal={mobileItemAddModal}
                setMobileItemAddModal={setMobileItemAddModal}
                selectProduct={selectProduct}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                setEditingIndex={setEditingIndex}
              />
            );
          })}
          {rowData?.length === 0 && (
            <SoftBox className="no-product-found-container" sx={{ overflowY: 'unset' }}>
              <SoftTypography fontSize="15px" fontWeight="bold">
                No Product Added
              </SoftTypography>
            </SoftBox>
          )}
        </SoftBox>
        // </SoftBox>
      )}
      {/* <Drawer
        anchor="left"
        open={piScanner}
        onClose={() => setPiScanner(false)}
        PaperProps={{
          sx: {
            height: '100%',
            width: '100%',
          },
        }}
      >
        <BarcodeScannerComponent
          width="100%"
          height="100%"
          onUpdate={(err, result) => handleBarcodeScan(err, result)}
        />
      </Drawer> */}
    </>
  );
};

export default PurchaseItemListing;
