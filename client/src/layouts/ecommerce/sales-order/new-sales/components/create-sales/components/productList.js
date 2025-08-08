import {
  Autocomplete,
  Box,
  Checkbox,
  Divider,
  Drawer,
  Grid,
  InputLabel,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  addProductToCart,
  editCartQuantitySellingPrice,
  getAllProductSuggestionV2,
  getInventoryDetails,
  getItemsInfo,
  removeCartProductByID,
  removeSupplementaryProducts,
  vendorSkuDetails,
} from '../../../../../../../config/Services';
import { buttonStyles } from '../../../../../Common/buttonColor';
import { emit } from 'react-native-react-bridge/lib/web';
import { isSmallScreen, productIdByBarcode } from '../../../../../Common/CommonFunction';
import { useDebounce } from 'usehooks-ts';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../../../../../../hooks/SnackbarProvider';
import { v4 as uuidv4 } from 'uuid';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import CancelIcon from '@mui/icons-material/Cancel';
import CloseIcon from '@mui/icons-material/Close';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import React, { createRef, useEffect, useRef, useState } from 'react';
import SalesAdditionalCharges from './additionalCharges';
import SalesAdditionalOffer from './additionalOffer';
import SalesOrdeBatchSelection from './batchSelection';
import SoftBox from '../../../../../../../components/SoftBox';
import SoftButton from '../../../../../../../components/SoftButton';
import SoftInput from '../../../../../../../components/SoftInput';
import SoftSelect from '../../../../../../../components/SoftSelect';
import SoftTypography from '../../../../../../../components/SoftTypography';
import Spinner from '../../../../../../../components/Spinner';

const SalesOrderProductList = ({
  rowData,
  setRowData,
  boxRef,
  selectedCustomer,
  mobileItemAddModal,
  setMobileItemAddModal,
  inclusiveTax,
  productSelected,
  setProductSelected,
  cartId,
  setBillingData,
  deleteLoader,
  setDeleteLoader,
  additionalList,
  setAdditionalList,
  isExtraField,
  setIsExtraField,
  billingItems,
  setBillingItems,
  updateBillingData,
}) => {
  const isMobileDevice = isSmallScreen();
  const mobileItemsRef = useRef(null);
  const showSnackbar = useSnackbar();
  const navigate = useNavigate();
  const locId = localStorage.getItem('locId');
  const orgId = localStorage.getItem('orgId');
  const contextType = localStorage.getItem('contextType');
  const [autocompleteTitleOptions, setAutocompleteTitleOptions] = useState([]);
  const [autocompleteBarcodeOptions, setAutocompleteBarcodeOptions] = useState([]);
  const [curentProductName, setCurentProductName] = useState('');
  const debounceProductName = useDebounce(curentProductName, 700);
  const [productAddLoader, setProductAddLoader] = useState(false);
  const [productAddKey, setProductAddKey] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [piScanner, setPiScanner] = useState(false);
  const [scanningLoader, setIsScanningLoader] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState();
  const [currIndex, setCurrIndex] = useState(0);
  const [inwardedData, setInwardedData] = useState([]);
  const [quantChangeIndex, setQuantChangeIndex] = useState('');
  const [quantChange, setQuantChange] = useState('');
  const debounceQuant = useDebounce(quantChange, 700);
  const [addingToCart, setAddingToCart] = useState('');
  const debounceAddtoCart = useDebounce(addingToCart, 300);
  const [currItem, setCurrItem] = useState('');
  const [batchLoader, setBatchLoader] = useState({});
  const [duplicateProduct, setDuplicateProduct] = useState('');
  const duplicateRefs = useRef([]);
  duplicateRefs.current = rowData?.map((_, i) => duplicateRefs?.current[i] ?? createRef());
  const [openBatchModal, setOpenBatchModal] = useState(false);
  const [openAdditonalModal, setOpenAddtionalModal] = useState(false);
  const handleBatchModal = () => {
    setOpenBatchModal(false);
  };
  const handleAdditionalModal = () => {
    setOpenAddtionalModal(false);
  };

  useEffect(() => {
    if (rowData?.length > 1 && isMobileDevice) {
      // Scroll to the bottom of the div
      mobileItemsRef?.current?.scrollTo({
        top: mobileItemsRef?.current?.scrollHeight,
        behavior: 'smooth', // You can change this to 'auto' for instant scrolling
      });
    }
  }, [rowData]);

  useEffect(() => {
    if (debounceProductName !== '' && debounceProductName !== undefined) {
      const searchProduct = async () => {
        const searchText = debounceProductName;
        const isNumber = !isNaN(+searchText);
        const payload = {
          page: 1,
          pageSize: '10',
          // storeLocationId: locId.toLocaleLowerCase(),
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
                if (isScanning) {
                  selectProduct(extractedVariants?.[0], rowData?.length - 1);
                } else {
                  selectProduct(extractedVariants?.[0], currIndex);
                }
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

  const selectProduct = (item, index, editing) => {
    setAutocompleteTitleOptions([]);
    setAutocompleteBarcodeOptions([]);
    setCurentProductName('');
    const updatedRow = [...rowData];
    if (item?.gtin !== undefined && item?.gtin !== '') {
      if (rowData?.some((ele) => ele?.itemCode === item?.gtin)) {
        showSnackbar('Item already present, please update the item', 'error');
        setDuplicateProduct(item?.gtin);
        const rowIndex = rowData?.findIndex((row) => row?.itemCode === item?.gtin);
        if (rowIndex !== -1 && duplicateRefs?.current[rowIndex]?.current) {
          duplicateRefs?.current[rowIndex]?.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        setTimeout(() => {
          setDuplicateProduct('');
        }, 10000);
        return;
      }

      updatedRow[index]['itemName'] = item?.name;
      updatedRow[index]['itemCode'] = item?.gtin;
      updatedRow[index]['igst'] = item?.igst || 0;
      updatedRow[index]['cgst'] = item?.cgst || 0;
      updatedRow[index]['sgst'] = item?.sgst || 0;
      updatedRow[index]['cess'] = item?.cess || 0;
      updatedRow[index]['hsnCode'] = item?.hs_code || '';
      const prodWeight = item?.weights_and_measures?.net_weight || '';
      const prodUnit = item?.weights_and_measures?.measurement_unit || '';
      updatedRow[index]['spec'] = item?.spec;
      setBatchLoader((prevState) => ({ ...prevState, [index]: true }));

      handleVendorProduct(item?.gtin, index);
      getInventoryDetails(locId, [item?.gtin])
        .then((res) => {
          if (
            res?.data?.status === 'ERROR' ||
            res?.data?.data?.es ||
            res?.data?.data?.data?.multipleBatchCreations?.length <= 0
          ) {
            setRowData(updatedRow);
            setBatchLoader((prevState) => ({ ...prevState, [index]: false }));
            setAddingToCart(index + 1);
            return;
          }
          const response = res?.data?.data?.data?.multipleBatchCreations;
          // if (updatedRow[index]?.batches?.length === 0) {
          //   updatedRow[index]['batches'] = [
          //     {
          //       batchNo: response[0]?.batchId,
          //       purchasePrice: response[0]?.purchasePrice ?? 0,
          //       mrp: response[0]?.mrp ?? 0,
          //       sellingPrice: response[0]?.sellingPrice ?? 0,
          //       quantity: 1,
          //       expiryDate: response[0]?.expiryDate ? new Date(response[0]?.expiryDate).toISOString() : null,
          //     },
          //   ];
          //   setAddingToCart(index);
          // }
          updatedRow[index]['mrp'] = response[0]?.mrp || 0;
          updatedRow[index]['sellingPrice'] = response[0]?.sellingPrice || 0;
          updatedRow[index]['purchasePrice'] = response[0]?.purchasePrice || 0;
          setRowData(updatedRow);
          setBatchLoader((prevState) => ({ ...prevState, [index]: false }));
          setAddingToCart(index + 1);
        })
        .catch((err) => {
          setRowData(updatedRow);
          setBatchLoader((prevState) => ({ ...prevState, [index]: false }));
          setAddingToCart(index + 1);
        });
    } else {
      setProductSelected((prevState) => {
        const newState = [...prevState];
        newState[index] = undefined;
        return newState;
      });
      updatedRow[index]['itemName'] = '';
      updatedRow[index]['itemCode'] = '';
      updatedRow[index]['mrp'] = 0;
      updatedRow[index]['spec'] = '';
      updatedRow[index]['purchasePrice'] = 0;
      updatedRow[index]['sellingPrice'] = 0;
      updatedRow[index]['purchaseMargin'] = 0;
      updatedRow[index]['quantityOrdered'] = '';
      updatedRow[index]['batches'] = [];
      updatedRow[index]['hsnCode'] = '';
      updatedRow[index]['igst'] = 0;
      updatedRow[index]['cgst'] = 0;
      updatedRow[index]['sgst'] = 0;
      updatedRow[index]['cess'] = 0;
      updatedRow[index]['discountPrice'] = 0;
      updatedRow[index]['discountType'] = 'RUPEES';
      updatedRow[index][inclusiveTax === 'true' ? 'amountWithTax' : 'amountWithoutTax'] = 0;
      setRowData(updatedRow);
    }
  };

  const handleChangeIO = (e, index) => {
    setCurentProductName(e.target.value);
    setCurrIndex(index);
    if (e.target.value == '') {
      setProductSelected((prevState) => {
        const newState = [...prevState];
        newState[index] = undefined;
        return newState;
      });
    }
  };

  const handleVendorProduct = (gtin, index) => {
    const payload = {
      gtin: [gtin],
      locationId: [locId],
    };
    const updatedRow = [...rowData];
    vendorSkuDetails(payload)
      .then((res) => {
        if (res?.data?.status === 'SUCCESS' && res?.data?.data?.object?.length > 0) {
          updatedRow[index]['vendorId'] = res?.data?.data?.object[0]?.vendorId ?? '';
        } else {
          updatedRow[index]['vendorId'] = '';
        }
        setRowData(updatedRow);
      })
      .catch((err) => {
        updatedRow[index]['vendorId'] = '';
        setRowData(updatedRow);
      });
  };

  useEffect(() => {
    if (debounceAddtoCart != '' && cartId) {
      handleAddtoCart(debounceAddtoCart - 1);
      setAddingToCart('');
    }
  }, [debounceAddtoCart]);

  useEffect(() => {
    if (debounceQuant != '') {
      editSalesOrder(quantChangeIndex - 1);
      setQuantChange('');
      setQuantChangeIndex('');
    }
  }, [debounceQuant]);

  const handleAddtoCart = async (index) => {
    try {
      const payload = {
        cartId: cartId,
        sellingPrice: Number(rowData[index]?.sellingPrice) || 0,
        gtin: rowData[index]?.itemCode,
        locationId: locId,
        mrp: Number(rowData[index]?.mrp) || 0,
        batches: rowData[index]?.batches || [],
        purchasePrice: rowData[index]?.batches[0]?.purchasePrice ?? Number(rowData[index]?.purchasePrice) ?? 0,
        inventoryChecks: 'NO',
        batches: rowData[index]?.batches,
        vendorId: rowData[index]?.vendorId ?? '',
      };
      const res = await addProductToCart(payload);
      setBillingData(res?.data?.data?.billing);
      const response = res?.data?.data?.cartProducts?.sort(
        (a, b) => new Date(a?.createdDate) - new Date(b?.createdDate),
      );
      if (response?.length > 0) {
        const updatedRowData = rowData?.map((row, index) => {
          if (index < response?.length) {
            if (row?.id === '') {
              return {
                ...row,
                id: response[index]?.cartProductId,
                amountWithTax: response[index]?.subTotal,
                amountWithoutTax: response[index]?.subTotalWithoutTax,
                // discountPrice: response[index]?.discountPrice,
              };
            }
          }
          return row;
        });
        setRowData(updatedRowData);
      }
    } catch (err) {
      showSnackbar(err?.response?.data?.message, 'error');
    }
  };

  const handleAddmore = () => {
    if (!selectedCustomer) {
      showSnackbar('Please select customer', 'error');
      return;
    }
    const newRowData = [
      ...rowData,
      {
        itemId: uuidv4(),
        id: '',
        itemCode: '',
        itemName: '',
        spec: '',
        mrp: 0,
        purchasePrice: '',
        sellingPrice: 0,
        quantityOrdered: '',
        hsnCode: '',
        cess: '',
        igst: 0,
        cgst: 0,
        sgst: 0,
        cess: 0,
        amountWithTax: '',
        amountWithoutTax: '',
        batches: [],
        discountPrice: 0,
        discountType: 'RUPEES',
        vendorId: '',
      },
    ];
    setRowData(newRowData);
    setProductSelected((prev) => [...prev, true]);
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
  };

  const handleItemDelete = async (index) => {
    if (!cartId) {
      return;
    }
    if (rowData[index]?.id === '' || rowData[index]?.id === null) {
      const updatedRowData = [...rowData];
      updatedRowData.splice(index, 1);
      setRowData(updatedRowData);

      const updateProductSelected = [...productSelected];
      updateProductSelected.splice(index, 1);
      setProductSelected(updateProductSelected);
      return;
    }
    if (cartId && rowData[index]?.id) {
      try {
        setDeleteLoader(true);
        const res = await removeCartProductByID(cartId, rowData[index]?.id);
        if (res?.data?.status === 'ERROR') {
          showSnackbar(res?.data?.message, 'error');
          setDeleteLoader(false);
          return;
        }
        if (res?.data?.data?.es) {
          showSnackbar(res?.data?.data?.message, 'error');
          setDeleteLoader(false);
          return;
        }
        const response = res?.data?.data?.data;
        setBillingData(response?.billing);
        if (response?.cartProducts?.length > 0) {
          const cartResponse = response?.cartProducts?.sort(
            (a, b) => new Date(a?.createdDate) - new Date(b?.createdDate),
          );
          const updatedRow = cartResponse?.map((e) => {
            return {
              itemId: uuidv4(),
              id: e?.cartProductId || '',
              itemCode: e?.gtin,
              itemName: e?.productName,
              quantityOrdered: e?.quantity ?? 1,
              purchasePrice: e?.purchasePrice || 0,
              mrp: e?.mrp ?? 0,
              sellingPrice: e?.sellingPrice ?? 0,
              igst: e?.igst || 0,
              cgst: e?.cgst || 0,
              sgst: e?.sgst || 0,
              hsnCode: e?.hsnCode || '',
              spec: e?.weightsAndMeasures
                ? e?.weightsAndMeasures?.net_weight + ' ' + e?.weightsAndMeasures?.measurement_unit
                : '',
              amountWithTax: e?.subTotal || 0,
              amountWithoutTax: e?.subTotalWithoutTax || 0,
              cess: e?.cess || 0,
              batches: e?.batches,
              discountPrice: e?.discountPrice,
              discountType: e?.discountType,
              purchasePrice: e?.purchasePrice || 0,
              vendorId: e?.vendorId || null,
            };
          });
          setRowData(updatedRow);
          setProductSelected(Array(updatedRow?.length).fill(false));
        } else {
          setRowData([
            {
              itemId: uuidv4(),
              id: '',
              itemCode: '',
              itemName: '',
              spec: '',
              mrp: 0,
              purchasePrice: '',
              sellingPrice: 0,
              quantityOrdered: '',
              hsnCode: '',
              cess: '',
              igst: 0,
              cgst: 0,
              sgst: 0,
              cess: 0,
              amountWithTax: '',
              amountWithoutTax: '',
              batches: [],
              discountPrice: 0,
              discountType: 'RUPEES',
              vendorId: '',
            },
          ]);
        }
        setDeleteLoader(false);
      } catch (err) {
        setDeleteLoader(false);
        showSnackbar(err?.response?.data?.message, 'error');
      }
    }
  };

  const gstArray = [
    { value: 0, label: '0' },
    { value: 3, label: '3' },
    { value: 5, label: '5' },
    { value: 12, label: '12' },
    { value: 18, label: '18' },
    { value: 28, label: '28' },
  ];

  const cessArray = [
    { value: 0, label: '0' },
    { value: 1, label: '1' },
    { value: 3, label: '3' },
    { value: 5, label: '5' },
    { value: 12, label: '12' },
    { value: 15, label: '15' },
    { value: 17, label: '17' },
    { value: 21, label: '21' },
    { value: 22, label: '22' },
    { value: 36, label: '36' },
    { value: 60, label: '60' },
    { value: 61, label: '61' },
    { value: 65, label: '65' },
    { value: 71, label: '71' },
    { value: 72, label: '72' },
    { value: 89, label: '89' },
    { value: 96, label: '96' },
    { value: 142, label: '142' },
    { value: 160, label: '160' },
    { value: 204, label: '204' },
  ];

  const handleInputChange = (index, fieldName, value) => {
    if (value < 0 || value === 'e') {
      return;
    }
    const updatedData = [...rowData];
    if (fieldName === 'quantityOrdered' && rowData[index]?.batches?.length > 0 && !openBatchModal) {
      updatedData[index]['batches'] = [];
    }
    updatedData[index][fieldName] = value;
    setRowData(updatedData);
    setQuantChange(uuidv4());
    setQuantChangeIndex(index + 1);
  };

  const handleExtraFields = () => {
    setIsExtraField(!isExtraField);
    additionalList?.length > 0 &&
      additionalList?.forEach((charge) => {
        if (!charge?.chargeId) {
          return;
        }
        removeSupplementaryProducts(cartId, charge?.chargeId)
          .then((res) => {
            if (res?.data?.status === 'SUCCESS' && res?.data?.data?.es === 0) {
              const response = res?.data?.data?.data;
              setBillingData(response?.billing);
            }
          })
          .catch((err) => {
            // showSnackbar(err?.response?.data?.message, 'error');
          });
      });
    setAdditionalList([
      {
        chargeId: null,
        cartId: cartId,
        description: '',
        unitPrice: 0,
        quantity: 1,
        tax: 0,
        taxType: '%',
        amount: 0,
      },
    ]);
  };

  const editSalesOrder = async (index) => {
    const qty = Number(rowData[index]?.quantityOrdered);
    if (rowData[index]?.id === '') {
      return;
    }
    try {
      const payload = {
        cartId: cartId,
        cartProductId: rowData[index]?.id,
        sellingPrice: Number(rowData[index]?.sellingPrice),
        gtin: rowData[index]?.itemCode,
        mrp: Number(rowData[index]?.mrp) || 0,
        quantity: qty || 1,
        inventoryChecks: 'NO',
        batches: rowData[index]?.batches || [],
        discountPrice: rowData[index]?.discountPrice || 0,
        discountType: rowData[index]?.discountType || 'RUPEES',
        igst: rowData[index]?.igst || 0,
        cess: rowData[index]?.cess || 0,
        vendorId: rowData[index]?.vendorId ?? '',
        purchasePrice: rowData[index]?.batches[0]?.purchasePrice ?? 0,
      };
      const res = await editCartQuantitySellingPrice(payload);
      if (res?.data?.status === 'ERROR') {
        showSnackbar(res?.data?.message, 'error');
        return;
      }
      setBillingData(res?.data?.data?.billing);
      const response = res?.data?.data?.cartProducts?.sort(
        (a, b) => new Date(a?.createdDate) - new Date(b?.createdDate),
      );
      if (response?.length > 0) {
        const updatedRowData = rowData?.map((row, index) => {
          if (row?.id !== '') {
            return {
              ...row,
              amountWithTax: response[index]?.subTotal,
              amountWithoutTax: response[index]?.subTotalWithoutTax,
              // discountPrice: response[index]?.discountPrice,
            };
          }
          return row;
        });
        setRowData(updatedRowData);
      }
    } catch (err) {
      showSnackbar(err?.response?.data?.message, 'error');
    }
  };

  const handleAdditional = (index) => {
    if (cartId) {
      setCurrIndex(index);
      setTimeout(() => {
        setOpenAddtionalModal(true);
      }, 700);
    }
  };

  const handleBatchData = (item, index) => {
    if (!cartId) {
      return;
    }
    setBatchLoader((prevState) => ({ ...prevState, [index]: true }));
    getInventoryDetails(locId, [item?.itemCode])
      .then((res) => {
        if (res?.data?.status === 'ERROR') {
          setAddingToCart(index + 1);
          showSnackbar('No batch found', 'error');
          setBatchLoader((prevState) => ({ ...prevState, [index]: false }));
          return;
        }
        if (res?.data?.data?.es) {
          setAddingToCart(index + 1);
          showSnackbar(res?.data?.data?.message, 'error');
          setBatchLoader((prevState) => ({ ...prevState, [index]: false }));
          return;
        }
        const response = res?.data?.data?.data?.multipleBatchCreations;
        if (response?.length <= 0) {
          setAddingToCart(index + 1);
          showSnackbar('No batch found', 'error');
          setBatchLoader((prevState) => ({ ...prevState, [index]: false }));
          return;
        }

        setInwardedData(response);
        setCurrIndex(index);
        setCurrItem(item);
        setTimeout(() => {
          setOpenBatchModal(true);
          setBatchLoader((prevState) => ({ ...prevState, [index]: false }));
        }, 700);
      })
      .catch((err) => {
        setBatchLoader((prevState) => ({ ...prevState, [index]: false }));
        showSnackbar(err?.response?.data?.message, 'error');
      });
  };

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
          {!isMobileDevice && !deleteLoader && rowData?.length > 0 && (
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
                    <th className="express-grn-columns grn-background-color"></th>
                    <th className="express-grn-columns grn-background-color"></th>
                  </tr>
                </thead>
                <tbody>
                  {rowData?.map((row, index) => {
                    const isBarcodeSelected = productSelected[index];
                    const isHighlighted = row?.itemCode === duplicateProduct && duplicateProduct !== '';
                    return (
                      <tr key={row?.itemId} style={{ minWidth: '960px' }} ref={duplicateRefs?.current[index]}>
                        {/* S.No */}
                        <td className="express-grn-rows" style={{ width: '70px' }}>
                          <SoftInput type="number" className="product-aligning" readOnly={true} value={index + 1} />
                        </td>

                        {/* Barcode */}
                        <td className={`express-grn-rows ${isHighlighted && 'highlighted-row'}`}>
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
                                disabled={cartId ? false : true}
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
                        <td className={`express-grn-rows ${isHighlighted && 'highlighted-row'}`}>
                          <SoftBox className="product-input-label" style={{ width: '100%' }}>
                            {row?.id !== '' ? (
                              <TextField value={row?.itemName} readOnly={true} style={{ width: '100%' }} />
                            ) : isBarcodeSelected === true && row.itemName !== '' ? (
                              <TextField value={row?.itemName} readOnly={true} style={{ width: '100%' }} />
                            ) : (
                              <Autocomplete
                                freeSolo
                                disabled={cartId ? false : true}
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
                            disabled={cartId ? false : true}
                            className="product-aligning"
                            value={row?.mrp >= 0 ? row?.mrp : row?.batches?.length > 0 ? row?.batches[0]?.mrp : ''}
                            onChange={(e) => handleInputChange(index, 'mrp', e.target.value)}
                          />
                        </td>

                        {/* Rate */}
                        <td className="express-grn-rows">
                          <SoftInput
                            type="number"
                            className="product-aligning"
                            disabled={cartId ? false : true}
                            value={
                              row?.sellingPrice >= 0
                                ? row?.sellingPrice
                                : row?.batches?.length > 0
                                ? row?.batches[0]?.sellingPrice
                                : ''
                            }
                            // value={row?.sellingPrice ?? ''}
                            onChange={(e) => handleInputChange(index, 'sellingPrice', e.target.value)}
                          />
                        </td>

                        {/*  Quanity */}
                        <td className="express-grn-rows">
                          <SoftInput
                            type="number"
                            className="product-aligning"
                            disabled={cartId ? false : true}
                            value={row?.quantityOrdered ?? ''}
                            onChange={(e) => handleInputChange(index, 'quantityOrdered', e.target.value)}
                          />
                        </td>

                        {/* GST */}
                        <td className="express-grn-rows">
                          <SoftSelect
                            isDisabled={cartId ? false : true}
                            menuPortalTarget={document.body}
                            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                            value={
                              gstArray.find((option) => option.value == row?.igst) ||
                              gstArray.find((option) => option.value == '0')
                            }
                            onChange={(e) => handleInputChange(index, 'igst', e.value)}
                            options={gstArray}
                          />
                        </td>

                        {/* Cess */}
                        <td className="express-grn-rows">
                          <SoftSelect
                            menuPortalTarget={document.body}
                            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                            value={
                              cessArray.find((option) => option.value == row?.cess) ||
                              cessArray.find((option) => option.value == '0')
                            }
                            onChange={(e) => handleInputChange(index, 'cess', e.value)}
                            options={cessArray}
                          />
                        </td>

                        {/* Amount */}
                        <td className="express-grn-rows">
                          <SoftInput
                            isDisabled={cartId ? false : true}
                            type="number"
                            disabled
                            className="product-aligning"
                            value={(inclusiveTax === 'true' ? row?.amountWithTax : row?.amountWithoutTax) || 0}
                          />
                        </td>

                        {/* Delete */}
                        <td className="express-grn-rows">
                          <SoftBox
                            // mt={index === 0 ? '49px' : '10px'}
                            width="100%"
                            height="40px"
                            style={{
                              cursor: 'pointer',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              gap: '10px',
                            }}
                            // disabled={listDisplay ? true : false}
                          >
                            <Tooltip title="Aditional details">
                              <AddIcon
                                color="info"
                                style={{ cursor: 'pointer', fontSize: '20px' }}
                                onClick={() => handleAdditional(index)}
                              />
                            </Tooltip>
                            {batchLoader[index] ? (
                              <Spinner size={20} />
                            ) : (
                              <Tooltip title="Batch details">
                                <InfoOutlinedIcon
                                  color="info"
                                  style={{ cursor: 'pointer', fontSize: '20px' }}
                                  onClick={() => handleBatchData(row, index)}
                                />
                              </Tooltip>
                            )}
                            <Tooltip title="Delete item from cart">
                              <CancelIcon
                                color="error"
                                style={{ cursor: 'pointer', fontSize: '20px' }}
                                onClick={() => handleItemDelete(index)}
                              />
                            </Tooltip>
                          </SoftBox>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          {isMobileDevice && (
            <>
              <SoftTypography
                sx={{
                  textAlign: 'center !important',
                  marginBottom: '10px',
                  fontSize: '0.8rem !important',
                }}
              >
                Add products {`(Total Items: ${rowData?.length})`}
              </SoftTypography>
              {deleteLoader && <Spinner size={20} />}
              <SoftBox className="newpi-addItems-container">
                <SoftButton
                  className="newpi-addItems outlined-softbutton"
                  variant={buttonStyles.secondaryVariant}
                  sx={{ flex: '1', padding: '0px !important' }}
                  onClick={handleAddmore}
                >
                  + Add
                </SoftButton>
              </SoftBox>
              <Drawer
                open={mobileItemAddModal}
                // onClose={() => setMobileItemAddModal(false)}
                anchor="right"
                // aria-labelledby="parent-modal-title"
                // aria-describedby="parent-modal-description"
                className="mobile-drawer-pi-add-items"
                sx={{
                  padding: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                PaperProps={{
                  sx: {
                    backgroundColor: 'white !important',
                    paddingBottom: '20px',
                  },
                }}
              >
                <SoftBox
                  className="modal-content-main-div"
                  sx={{
                    width: '100%',
                    height: '100%',
                    margin: '0px',
                    padding: '20px',
                    background: 'white',
                    // overflowX: 'scroll'
                    // position: 'relative'
                  }}
                >
                  <SoftBox className="mobile-close-icon">
                    <SoftBox
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        height: '35px',
                        width: '35px',
                        padding: '5px',
                      }}
                      //   disabled={listDisplay ? true : false}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isEditing) {
                          setIsEditing(false);
                        } else {
                          handleItemDelete(rowData?.length - 1);
                        }
                        setMobileItemAddModal(false);
                      }}
                    >
                      <ArrowBackIosNewIcon />
                    </SoftBox>
                    {(productAddLoader || scanningLoader) && (
                      <SoftBox className="circular-progress-modal">
                        <Spinner />
                      </SoftBox>
                    )}
                    <Grid container spacing={1}>
                      <Grid item lg={9} md={9} sm={9} xs={9}>
                        <Box>
                          <SoftBox mb={1} mt={1} display="flex">
                            <InputLabel
                              required
                              sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}
                            >
                              Barcode
                            </InputLabel>
                          </SoftBox>
                          <SoftBox className="product-input-label" style={{ width: '100%' }}>
                            <Autocomplete
                              key={productAddKey}
                              freeSolo
                              disabled={isEditing && !cartId ? true : false}
                              {...(rowData && {
                                value: rowData[isEditing ? editingIndex : rowData?.length - 1]?.itemCode,
                              })}
                              options={autocompleteBarcodeOptions}
                              getOptionLabel={(option) => {
                                if (typeof option === 'object') {
                                  return option.gtin;
                                }
                                return option;
                              }}
                              onChange={(e, newValue) => {
                                selectProduct(newValue, rowData?.length - 1);
                              }}
                              onInputChange={(e, newInputValue) => {
                                handleChangeIO({ target: { value: newInputValue } }, rowData?.length - 1);
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
                            {/* )} */}
                          </SoftBox>
                        </Box>
                      </Grid>
                      <Grid item lg={3} md={3} sm={3} xs={3} className="new-pi-barcode-scan">
                        <SoftButton
                          color="info"
                          variant="contained"
                          disabled={isEditing ? true : false}
                          sx={{ width: '100%' }}
                          onClick={() => {
                            setPiScanner(true);
                            emit({ type: 'scanner' });
                          }}
                        >
                          SCAN
                        </SoftButton>
                      </Grid>
                      <Grid item lg={12} md={12} sm={12} xs={12}>
                        <Box>
                          <SoftBox mb={1} mt={1} display="flex">
                            <InputLabel
                              required
                              sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}
                            >
                              Product Title
                            </InputLabel>
                          </SoftBox>
                          <SoftBox className="product-input-label" style={{ width: '100%' }}>
                            <Autocomplete
                              key={productAddKey}
                              freeSolo
                              {...(rowData && {
                                value: rowData[isEditing ? editingIndex : rowData?.length - 1]?.itemName,
                              })}
                              disabled={isEditing ? true : false}
                              options={autocompleteTitleOptions}
                              getOptionLabel={(option) => {
                                if (typeof option === 'object') {
                                  return option.name;
                                }
                                return option;
                              }}
                              onChange={(e, newValue) => {
                                selectProduct(newValue, rowData?.length - 1);
                              }}
                              onInputChange={(e, newInputValue) => {
                                handleChangeIO({ target: { value: newInputValue } }, rowData?.length - 1);
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
                            {/* )} */}
                          </SoftBox>
                        </Box>
                      </Grid>
                      <Grid item lg={4} md={4} sm={4} xs={4}>
                        <Box>
                          <SoftBox mb={1} mt={1} display="flex">
                            <InputLabel
                              // required
                              sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}
                            >
                              Specification
                            </InputLabel>
                          </SoftBox>
                          <SoftInput
                            key={productAddKey}
                            // type="number"
                            disabled
                            value={
                              rowData[isEditing ? editingIndex : rowData?.length - 1]?.spec
                                ? rowData[isEditing ? editingIndex : rowData?.length - 1]?.spec
                                : ''
                            }
                          />
                        </Box>
                      </Grid>
                      <Grid item lg={4} md={4} sm={4} xs={4}>
                        <Box>
                          <SoftBox mb={1} mt={1} display="flex">
                            <InputLabel
                              // required
                              sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}
                            >
                              MRP
                            </InputLabel>
                          </SoftBox>
                          <SoftInput
                            key={productAddKey}
                            type="number"
                            value={
                              rowData[isEditing ? editingIndex : rowData?.length - 1]?.mrp === 0
                                ? 0
                                : rowData[isEditing ? editingIndex : rowData?.length - 1]?.mrp
                                ? rowData[isEditing ? editingIndex : rowData?.length - 1]?.mrp
                                : ''
                            }
                            onChange={(e) => {
                              handleInputChange(isEditing ? editingIndex : rowData?.length - 1, 'mrp', e.target.value);
                            }}
                          />
                        </Box>
                      </Grid>

                      <Grid item lg={4} md={4} sm={4} xs={4}>
                        <Box>
                          <SoftBox mb={1} mt={1} display="flex">
                            <InputLabel
                              // required
                              sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}
                            >
                              Rate
                            </InputLabel>
                          </SoftBox>
                          <SoftInput
                            key={productAddKey}
                            type="number"
                            value={
                              rowData[isEditing ? editingIndex : rowData?.length - 1]?.sellingPrice
                                ? rowData[isEditing ? editingIndex : rowData?.length - 1]?.sellingPrice
                                : 0
                            }
                            onChange={(e) => {
                              handleInputChange(
                                isEditing ? editingIndex : rowData?.length - 1,
                                'sellingPrice',
                                e.target.value,
                              );
                            }}
                          />
                        </Box>
                      </Grid>
                      <Grid item lg={4} md={4} sm={4} xs={4}>
                        <Box>
                          <SoftBox mb={1} mt={1} display="flex">
                            <InputLabel
                              // required
                              sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}
                            >
                              GST
                            </InputLabel>
                          </SoftBox>
                          <SoftSelect
                            // menuPortalTarget={document.body}
                            // styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                            key={productAddKey}
                            value={gstArray.find(
                              (option) => option.value == rowData[isEditing ? editingIndex : rowData?.length - 1]?.igst,
                            )}
                            onChange={(e) =>
                              handleInputChange(isEditing ? editingIndex : rowData?.length - 1, 'igst', e.value)
                            }
                            options={gstArray}
                          />
                        </Box>
                      </Grid>
                      <Grid item lg={4} md={4} sm={4} xs={4}>
                        <Box>
                          <SoftBox mb={1} mt={1} display="flex">
                            <InputLabel
                              // required
                              sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}
                            >
                              Cess
                            </InputLabel>
                          </SoftBox>
                          <SoftSelect
                            // menuPortalTarget={document.body}
                            // styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                            key={productAddKey}
                            value={cessArray.find(
                              (option) => option.value == rowData[isEditing ? editingIndex : rowData?.length - 1]?.cess,
                            )}
                            onChange={(e) =>
                              handleInputChange(isEditing ? editingIndex : rowData?.length - 1, 'igst', e.value)
                            }
                            options={cessArray}
                          />
                        </Box>
                      </Grid>
                      <Grid item lg={4} md={4} sm={4} xs={4}>
                        <Box>
                          <SoftBox mb={1} mt={1} display="flex">
                            <InputLabel
                              // required
                              sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}
                            >
                              Amount
                            </InputLabel>
                          </SoftBox>
                          <SoftInput
                            key={productAddKey}
                            type="number"
                            disabled
                            value={
                              (inclusiveTax === 'true'
                                ? rowData[isEditing ? editingIndex : rowData?.length - 1]?.amountWithTax
                                : rowData[isEditing ? editingIndex : rowData?.length - 1]?.amountWithoutTax) || ''
                            }
                          />
                        </Box>
                      </Grid>
                      <Grid item lg={12} md={12} sm={12} xs={12}>
                        <Box>
                          <SoftBox mb={1} mt={1} display="flex">
                            <InputLabel
                              // required
                              sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}
                            >
                              Quantity
                            </InputLabel>
                          </SoftBox>
                          <SoftInput
                            type="number"
                            value={
                              rowData[isEditing ? editingIndex : rowData?.length - 1]?.quantityOrdered
                                ? rowData[isEditing ? editingIndex : rowData?.length - 1]?.quantityOrdered
                                : ''
                            }
                            onChange={(e) => {
                              handleInputChange(
                                isEditing ? editingIndex : rowData?.length - 1,
                                'quantityOrdered',
                                e.target.value,
                              );
                            }}
                          />
                        </Box>
                      </Grid>
                    </Grid>

                    {/* </SoftBox> */}

                    <SoftBox
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        gap: '15px',
                        marginTop: '10px',
                      }}
                    >
                      <SoftButton
                        variant={buttonStyles.secondaryVariant}
                        className="outlined-softbutton"
                        sx={{
                          width: '50px',
                        }}
                        // disabled={listDisplay ? true : false}
                        onClick={(e) => {
                          e.stopPropagation();
                          setMobileItemAddModal(false);
                          handleItemDelete(rowData?.length - 1, true);
                          if (isEditing) {
                            setIsEditing(false);
                          }
                        }}
                      >
                        Clear
                      </SoftButton>
                      <SoftButton
                        variant={buttonStyles.primaryVariant}
                        className="contained-softbutton vendor-add-btn"
                        // onClick={() => mobileAddHandler()}
                        sx={{ width: '40px' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setMobileItemAddModal(false);
                          // if (!isEditing) {
                          //   // setCount(count + 1);
                          //   handleAddmore();
                          // } else {
                          //   setIsEditing(false);
                          // }
                        }}
                      >
                        ADD
                      </SoftButton>
                    </SoftBox>
                  </SoftBox>
                  {/* {isLoading && (
              <SoftBox className="circular-progress-modal">
                <Spinner />
              </SoftBox>
            )} */}
                  {/* </SoftBox> */}
                </SoftBox>
              </Drawer>
            </>
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
            {!cartId ? (
              <SoftTypography fontSize="small" style={{ color: 'red' }}>
                {' '}
                Enter all the mandatory fields{' '}
              </SoftTypography>
            ) : null}
            {cartId && rowData?.length > 0 && (
              <>
                <SoftBox display="flex" mt={1} mb={1} alignItems="center">
                  <Checkbox checked={isExtraField} onClick={handleExtraFields} />
                  <SoftTypography component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                    + Add extra details
                  </SoftTypography>
                </SoftBox>
                {isExtraField && (
                  <SalesAdditionalCharges
                    additionalList={additionalList}
                    setAdditionalList={setAdditionalList}
                    cartId={cartId}
                    billingItems={billingItems}
                    setBillingItems={setBillingItems}
                    setBillingData={setBillingData}
                    updateBillingData={updateBillingData}
                  />
                )}
              </>
            )}
          </>
        )}
      </div>
      {openBatchModal && (
        <SalesOrdeBatchSelection
          rowData={rowData}
          setRowData={setRowData}
          currIndex={currIndex}
          currItem={currItem}
          openBatchModal={openBatchModal}
          handleBatchModal={handleBatchModal}
          inwardedData={inwardedData}
          addingToCart={addingToCart}
          setAddingToCart={setAddingToCart}
          productSelected={productSelected}
          setProductSelected={setProductSelected}
          handleItemDelete={handleItemDelete}
          deleteLoader={deleteLoader}
          handleInputChange={handleInputChange}
          editSalesOrder={editSalesOrder}
        />
      )}
      {openAdditonalModal && (
        <SalesAdditionalOffer
          rowData={rowData}
          setRowData={setRowData}
          currIndex={currIndex}
          openAdditonalModal={openAdditonalModal}
          handleAdditionalModal={handleAdditionalModal}
          handleInputChange={handleInputChange}
        />
      )}
      {isMobileDevice && !deleteLoader && (
        <SoftBox
          ref={mobileItemsRef}
          className="mob-card-newpi-container"
          sx={{ overflowY: rowData?.length <= 1 ? 'unset' : 'scroll' }}
        >
          {rowData?.map((row, index) => {
            return (
              <SoftBox
                key={index}
                className="product-mob-card-main-conatiner po-box-shadow"
                sx={{ marginRight: rowData?.length <= 1 ? 'unset' : '10px' }}
              >
                <Stack direction={'row'} className="parent-stack">
                  <Stack alignItems={'flex-start'}>
                    <Typography fontSize="14px" fontWeight={700}>
                      {row?.itemName}
                    </Typography>
                    <Typography fontSize="12px">{row?.itemCode}</Typography>
                  </Stack>
                  <CloseIcon
                    sx={{ cursor: 'pointer' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleItemDelete(index);
                    }}
                    fontSize="small"
                    color="error"
                  />
                </Stack>
                <Divider sx={{ margin: '5px !important' }} />

                <Stack direction={'row'} className="parent-stack">
                  <Stack alignItems={'flex-start'}>
                    <Typography className="product-mob-picard-label">Specs</Typography>
                    <Typography className="product-mob-picard-value">{row?.spec}</Typography>
                  </Stack>
                  <Stack alignItems={'flex-end'}>
                    <Typography className="product-mob-picard-label">MRP</Typography>
                    <SoftBox style={{ width: '80px' }}>
                      <SoftInput
                        type="number"
                        className="product-aligning"
                        value={row?.mrp || 0}
                        onChange={(e) => handleInputChange(e.target.value, 'mrp', index)}
                      />
                    </SoftBox>
                  </Stack>
                </Stack>
                <Divider sx={{ margin: '5px !important' }} />
                <Stack direction={'row'} className="parent-stack">
                  <Stack alignItems={'flex-start'}>
                    <Typography className="product-mob-picard-label">GST</Typography>
                    <SoftBox style={{ width: '80px' }}>
                      <SoftSelect
                        menuPortalTarget={document.body}
                        styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                        value={gstArray.find((option) => option.value == row?.igst)}
                        onChange={(e) => handleInputChange(index, 'igst', e.value)}
                        options={gstArray}
                      />
                    </SoftBox>
                  </Stack>
                  <Stack alignItems={'flex-end'}>
                    <Typography className="product-mob-picard-label">CESS</Typography>
                    <SoftBox style={{ width: '80px' }}>
                      <SoftSelect
                        menuPortalTarget={document.body}
                        styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                        value={cessArray.find((option) => option.value == row?.cess)}
                        onChange={(e) => handleInputChange(index, 'cess', e.value)}
                        options={cessArray}
                      />
                    </SoftBox>
                    <Typography className="product-mob-picard-value">{row?.cess || 0}</Typography>
                  </Stack>
                </Stack>
                <Divider sx={{ margin: '5px !important' }} />
                <Stack direction={'row'} className="parent-stack">
                  <Stack alignItems={'flex-start'}>
                    <Typography className="product-mob-picard-label">Rate</Typography>
                    <SoftBox style={{ width: '80px' }}>
                      <SoftInput
                        type="number"
                        className="product-aligning"
                        // disabled={row?.isApproved === 'N' ? true : false}
                        value={row?.sellingPrice || 0}
                        onChange={(e) => handleInputChange(e.target.value, 'sellingPrice', index)}
                      />
                    </SoftBox>
                  </Stack>
                  <Stack alignItems={'center'}>
                    <Typography className="product-mob-picard-label">Quantity</Typography>
                    <SoftBox style={{ width: '80px' }}>
                      <SoftInput
                        type="number"
                        className="product-aligning"
                        value={row?.quantityOrdered ? row?.quantityOrdered : ''}
                        onChange={(e) => {
                          handleInputChange(index, 'quantityOrdered', e.target.value);
                        }}
                      />
                    </SoftBox>
                  </Stack>
                  <Stack alignItems={'flex-end'}>
                    <Typography className="product-mob-picard-label">Amount</Typography>
                    <SoftBox style={{ width: '80px' }}>
                      <SoftInput
                        type="number"
                        className="product-aligning"
                        value={(inclusiveTax === 'true' ? row?.amountWithTax : row?.amountWithoutTax) || 0}
                        disabled
                        onChange={(e) =>
                          handleInputChange(
                            index,
                            inclusiveTax === 'true' ? 'amountWithTax' : 'amountWithoutTax',
                            e.target.value,
                          )
                        }
                      />
                    </SoftBox>
                  </Stack>
                </Stack>
              </SoftBox>
            );
          })}
        </SoftBox>
      )}
    </>
  );
};

export default SalesOrderProductList;
