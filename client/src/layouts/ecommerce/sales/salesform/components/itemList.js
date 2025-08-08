import { Autocomplete, Checkbox, Drawer, Grid, InputLabel, TextField } from '@mui/material';
import {
  addProductToCart,
  editCartQuantity,
  editCartQuantitySellingPrice,
  getItemsInfo,
  getLatestInwarded,
  removeCartProduct,
  verifyBatch,
} from '../../../../../config/Services';
import { buttonStyles } from '../../../Common/buttonColor';
import { isSmallScreen, productIdByBarcode } from '../../../Common/CommonFunction';
import { useDebounce } from 'usehooks-ts';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../../../../hooks/SnackbarProvider';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import CancelIcon from '@mui/icons-material/Cancel';
import React, { useEffect, useRef, useState } from 'react';
import SalesOrderOpenOtherModal from './otherDetail';
import SalesOrderProductCard from './productCardSalesOrder';
import SoftBox from '../../../../../components/SoftBox';
import SoftButton from '../../../../../components/SoftButton';
import SoftInput from '../../../../../components/SoftInput';
import SoftTypography from '../../../../../components/SoftTypography';
import Spinner from '../../../../../components/Spinner';

const ItemListData = ({
  setCount,
  count,
  setFixedCount,
  fixedCount,
  setBarcodeNum,
  barcodeNum,
  setProductName,
  productName,
  setQuantity,
  quantity,
  setSpecification,
  specification,
  setItemMrp,
  itemMrp,
  setSellingPrice,
  sellingPrice,
  setPurchasePrice,
  purchasePrice,
  setcartProductId,
  cartProductId,
  setItemTax,
  itemTax,
  setItemAmount,
  itemAmount,
  setItemAmountWithTax,
  itemAmountWithTax,
  setBillingData,
  setOrderedItems,
  orderedItems,
  extractItemListProperty,
  cartLoader,
  setCartData,
  customerName,
  mobileSalesProductLoader,
  batchNum,
  setBatchNum,
  expiryDate,
  setExpiryDate,
  itemDiscount,
  setItemDiscount,
  itemCess,
  setItemCess,
  itemDiscountType,
  setItemDiscountType,
}) => {
  const isMobileDevice = isSmallScreen();
  const showSnackbar = useSnackbar();
  const cartId = localStorage.getItem('cartId-SO');
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const contextType = localStorage.getItem('contextType');
  const boxRef = useRef(null);
  const navigate = useNavigate();

  const [productSelected, setProductSelected] = useState(Array(count).fill(false));
  const [autocompleteTitleOptions, setAutocompleteTitleOptions] = useState([]);
  const [autocompleteBarcodeOptions, setAutocompleteBarcodeOptions] = useState([]);
  const [curentProductName, setCurentProductName] = useState('');
  const debounceProductName = useDebounce(curentProductName, 700);
  const [currIndex, setCurrIndex] = useState(0);
  const [prodName, setProdName] = useState('');
  const [barNum, setBarNum] = useState('');
  const [quantChange, setQuantChange] = useState('');
  const debouncedValue = useDebounce(quantChange, 700);
  const [quantBarcodePairs, setQuantBarcodePairs] = useState([]);
  const [inclusiveTax, setInclusiveTax] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState(false);

  const [addItemsDrawer, setAddItemsDrawer] = useState(false);
  const [salesProductDetails, setSalesProductDetails] = useState();
  const [salesProductMapping, setSalesProductMapping] = useState([]);
  const [salesProductAddLoder, setSalesProductAddLoder] = useState(false);
  const [newSellingPrice, setNewSellingPrice] = useState();
  const [amounts, setAmounts] = useState([]);
  const [openOtherModal, setOpenOtherModal] = useState(false);
  const [detailIndex, setDetailIndex] = useState(0);
  const [batchCheck, setBatchCheck] = useState('');
  const [batchChange, setBatchChange] = useState(false);
  const debouncedBatchValue = useDebounce(batchCheck, 700);
  const [batchBarcodePairs, setBatchBarcodePairs] = useState([]);

  const handleMoreDetails = (index) => {
    setOpenOtherModal(true);
    setDetailIndex(index);
  };

  const addItemsDrawerOpenHandler = () => {
    if (customerName === '') {
      showSnackbar('Select Customer Name', 'error');
      return;
    }
    setAddItemsDrawer(true);
  };

  const addItemsDrawerCloseHandler = () => {
    if (salesProductDetails !== undefined) {
      setAutocompleteTitleOptions([]);
      setAutocompleteBarcodeOptions([]);
      if (salesProductDetails?.gtin !== undefined) {
        removeCartProduct(localStorage.getItem('cartId-SO'), salesProductDetails?.gtin?.gtin)
          .then((res) => {
            const orderedItems = res?.data?.data?.cartProducts?.sort(
              (a, b) => new Date(a.createdDate) - new Date(b.createdDate),
            );
            setOrderedItems(orderedItems);
            setCartData(res?.data?.data);
          })
          .catch((error) => {
            setOrderedItems([]);
            showSnackbar(error.message, 'warning');
            return;
          });
      }
      setSalesProductDetails();
    }
    setAddItemsDrawer(false);
  };

  const [saveAndCancelDisable, setSaveAndCancelDisable] = useState(true);
  useEffect(() => {
    if (salesProductDetails !== undefined) {
      setSaveAndCancelDisable(false);
    }
  }, [salesProductDetails]);

  const addItemsDrawerSaveHandler = () => {
    setCount(count + 1);
    setAutocompleteTitleOptions([]);
    setAutocompleteBarcodeOptions([]);
    setProductName((prev) => [...prev, salesProductDetails?.productName?.name]);
    setSpecification((prev) => [...prev, salesProductDetails?.specification]);
    setBarcodeNum((prev) => [...prev, salesProductDetails?.gtin?.gtin]);
    setItemMrp((prev) => [...prev, salesProductDetails?.mrp]);
    setItemTax((prev) => [...prev, salesProductDetails?.tax]);
    setSellingPrice((prev) => [...prev, salesProductDetails?.sellingPrice]);
    setPurchasePrice((prev) => [...prev, salesProductDetails?.purchasePrice]);
    setcartProductId((prev) => [...prev, salesProductDetails?.cartProductId]);
    setItemAmount(salesProductDetails?.amount[1]);
    setItemAmountWithTax(salesProductDetails?.amount[0]);
    setSalesProductMapping((prev) => [
      {
        gtin: salesProductDetails?.gtin?.gtin,
        productName: salesProductDetails?.productName?.name,
        specification: salesProductDetails?.specification,
        quantity: Number(salesProductDetails?.quantity),
        mrp: salesProductDetails?.mrp,
        tax: salesProductDetails?.tax,
        amountWithoutTax: salesProductDetails?.amount[0][salesProductDetails?.amount[0].length - 1],
        amountWithTax: salesProductDetails?.amount[1][salesProductDetails?.amount[1].length - 1],
        sellingPrice: salesProductDetails?.sellingPrice,
      },
      ...prev,
    ]);

    setQuantBarcodePairs((prev) => [
      ...prev,
      {
        qty: salesProductDetails?.quantity,
        gtin: salesProductDetails?.gtin?.toString(),
        sp: salesProductDetails?.sellingPrice,
      },
    ]);
    setQuantity((prev) => [...prev, Number(salesProductDetails?.quantity)]);

    setAddItemsDrawer(false);
    setSalesProductDetails();
  };

  useEffect(() => {
    if (orderedItems.length > 0 && !addItemsDrawer) {
      const salesProducts = orderedItems?.map((item) => {
        //for showing the value of name drawer when editing
        item.name = item.productName;
        return {
          gtin: item?.gtin,
          productName: item?.productName,
          specification: '',
          quantity: item?.quantity,
          mrp: item?.mrp,
          tax: item?.igst,
          amountWithoutTax: item?.subTotalWithoutTax,
          amountWithTax: item?.subTotal,
          sellingPrice: item?.sellingPrice,
        };
      });
      setSalesProductMapping(salesProducts);
    }
  }, [orderedItems]);

  const productSelectHandler = async (item, index) => {
    setSalesProductAddLoder(true);
    setAutocompleteTitleOptions([item]);
    setAutocompleteBarcodeOptions([]);
    const isValuePresent = orderedItems.some((prdt) => prdt.gtin === item?.gtin);
    if (isValuePresent) {
      setSalesProductAddLoder(false);
      showSnackbar('Product Already Present', 'error');
      return;
    } else if (!isValuePresent && item) {
      const sp = await handleSellingPrice(item?.gtin);
      if (sp !== undefined) {
        const amounts = await handleAddtoCart(item?.gtin, sp);
        setSalesProductDetails((prev) => ({
          ...prev,
          gtin: item,
          productName: item,
          specification:
            item?.weights_and_measures?.net_weight + ' ' + item?.weights_and_measures?.measurement_unit || 'NA',
          mrp: item?.mrp?.mrp,
          tax: item?.igst,
          amount: amounts || [],
          sellingPrice: sp,
          quantity: 1,
        }));
        setSalesProductAddLoder(false);
      } else {
        setSalesProductAddLoder(false);
        return;
      }
    }
    setSalesProductAddLoder(false);
  };

  const quantityHandlerMobile = async (e) => {
    setSalesProductDetails((prev) => ({
      ...prev,
      quantity: e.target.value === '' ? 1 : e.target.value,
    }));
    try {
      const payload = {
        qty: e.target.value === '' ? 1 : e.target.value,
        gtin: salesProductDetails?.gtin?.gtin,
        sellingPrice: salesProductDetails?.sellingPrice,
      };
      const res = await editCartQuantity(payload, localStorage.getItem('cartId-SO'), locId);
      setBillingData(res?.data?.data?.billing);
      setCartData(res?.data?.data);
      const orderedItems = res?.data?.data?.cartProducts?.sort(
        (a, b) => new Date(a.createdDate) - new Date(b.createdDate),
      );
      const requiredProduct = orderedItems?.map((prdt) => {
        if (prdt.gtin === salesProductDetails?.gtin?.gtin) {
          prdt.quantity = Number(e.target.value);
        }
        return prdt;
      });

      setOrderedItems(requiredProduct);
      const response = res?.data?.data?.cartProducts?.sort((a, b) => new Date(a.createdDate) - new Date(b.createdDate));
      const amount = [
        extractItemListProperty(response, 'subTotalWithoutTax'),
        extractItemListProperty(response, 'subTotal'),
      ];
      setSalesProductDetails((prev) => ({
        ...prev,
        amount: amount,
      }));
    } catch (err) {
      showSnackbar(err?.response?.data?.message, 'error');
    }
  };

  const handleChangeIO = (e, index) => {
    if (e.target.value === '') {
      return;
    }
    setCurentProductName(e.target.value);
    setCurrIndex(index);
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
        };
        if (contextType === 'RETAIL') {
          payload.supportedStore = [locId];
        } else if (contextType === 'WMS') {
          payload.supportedWarehouse = [locId];
        } else if (contextType === 'VMS') {
          payload.marketPlaceSeller = [locId];
        }
        if (searchText !== '') {
          if (isNumber) {
            payload.gtin = [searchText];
            payload.names = [];
            setBarNum(searchText);
            setProdName('');
          } else {
            payload.gtin = [];
            payload.names = [searchText];
            setBarNum('');
            setProdName(searchText);
          }
        } else {
          payload.gtin = [];
          setBarNum('');
          setProdName('');
          payload.names = [];
        }
        if (searchText.length >= 3) {
          getItemsInfo(payload)
            .then(function (response) {
              if (response?.data?.data?.products.length === 0) {
                // const newSwal = Swal.mixin({
                //   customClass: {
                //     confirmButton: 'button button-success',
                //     cancelButton: 'button button-error',
                //   },
                //   buttonsStyling: false,
                // });

                // newSwal
                //   .fire({
                //     title: 'Product not found',
                //     text: 'Do you want to create a new Product ?',
                //     icon: 'info',
                //     showCancelButton: true,
                //     confirmButtonText: 'Confirm',
                //   })
                //   .then((result) => {
                //     if (result.isConfirmed) {
                //       setOpenModal(true);
                //     }
                //   });
                setAutocompleteTitleOptions([]);
                setAutocompleteBarcodeOptions([]);
              } else if (response?.data?.data?.products.length === 1) {
                selectProduct(response?.data?.data?.products[0], currIndex);
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

  useEffect(() => {
    if (debouncedBatchValue !== '') {
      const verifyBatches = async () => {
        const lastBatchPair = batchBarcodePairs[batchBarcodePairs.length - 1];
        if (lastBatchPair) {
          const { batchNumber, barcode, indexValue } = lastBatchPair;
          try {
            const res = await verifyBatch(locId, barcode, batchNumber);
            if (res?.data?.data?.object?.available === true) {
              showSnackbar('Batch already present, add different batch', 'error');
            } else {
              showSnackbar(res?.data?.data?.message, 'success');
              // updateItem(indexValue);
            }
          } catch (err) {
            showSnackbar(err?.response?.data?.message, 'error');
          }
        }

        setBatchChange(false);
      };

      verifyBatches();
    }
  }, [debouncedBatchValue]);

  const handleBatchChange = (e, index) => {
    const currentBarcode = barcodeNum[index];
    if (
      currentBarcode !== undefined &&
      currentBarcode !== '' &&
      quantity[index] !== undefined &&
      quantity[index] !== ''
    ) {
      setBatchChange(true);
      setBatchCheck(e.target.value);

      const updatedBatchBarcodePairs = [];
      updatedBatchBarcodePairs[index] = {
        batchNumber: e.target.value,
        barcode: currentBarcode.toString(),
        indexValue: index,
      };
      setBatchBarcodePairs(updatedBatchBarcodePairs);

      const updatedBatchNos = [...batchNum];
      updatedBatchNos[index] = e.target.value;
      setBatchNum(updatedBatchNos);
    } else {
      showSnackbar('Enter product details', 'error');
    }
  };

  const selectProduct = (item, index) => {
    setCurentProductName('');
    setAutocompleteTitleOptions([]);
    setAutocompleteBarcodeOptions([]);
    const isValuePresent = orderedItems.some((data) => data?.gtin === item?.gtin);
    setBarNum('');
    setProdName('');
    if (!isValuePresent && item) {
      const updatedProductName = [...productName];
      updatedProductName[index] = item?.name;
      setProductName(updatedProductName);

      const updatedSpecification = [...specification];
      updatedSpecification[index] =
        item?.weights_and_measures?.net_weight + ' ' + item?.weights_and_measures?.measurement_unit;
      setSpecification(updatedSpecification);

      const updatedBarcodeNum = [...barcodeNum];
      updatedBarcodeNum[index] = item?.gtin;
      setBarcodeNum(updatedBarcodeNum);

      const updateCess = [...itemCess];
      updateCess[index] = item?.cess;
      setItemCess(updateCess);

      const updatedTax = [...itemTax];
      updatedTax[index] = item?.igst;
      setItemTax(updatedTax);

      const updatedProductSelected = [...productSelected];
      updatedProductSelected[index] = true;
      setProductSelected(updatedProductSelected);

      handleSellingPrice(item?.gtin, index);
    } else {
      showSnackbar('Product already present', 'error');
    }
  };

  const handleAddmore = () => {
    setCount(count + 1);
    setBarcodeNum([...barcodeNum, '']);
    setProductName([...productName, '']);
    setItemMrp([...itemMrp, '']);
    setSpecification([...specification, '']);
    setQuantity([...quantity, '']);
    setSellingPrice([...sellingPrice, '']);
    setPurchasePrice([...purchasePrice, '']);
    setcartProductId([...cartProductId, '']);
    setItemCess([...itemCess, '']);
    setExpiryDate([...expiryDate, '']);
    setBatchNum([...batchNum, '']);
    setItemDiscount([...itemDiscount, '']);
    setItemDiscountType([...itemDiscountType, '']);
    setItemTax([...itemTax, '']);
    setItemAmount([...itemAmount, '']);
    setItemAmountWithTax([...itemAmountWithTax, '']);

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

  const handleDeleteMobile = (index) => {
    const isValuePresent = salesProductMapping.some((item) => item.gtin !== salesProductMapping[index].gtin);
    const updatedArrayOfProducts = salesProductMapping.filter((item) => item.gtin !== salesProductMapping[index].gtin);
    if (localStorage.getItem('cartId-SO') && isValuePresent) {
      setDeleteLoader(true);
      removeCartProduct(localStorage.getItem('cartId-SO'), salesProductMapping[index].gtin)
        .then((res) => {
          const orderedItems = res?.data?.data?.cartProducts?.sort(
            (a, b) => new Date(a.createdDate) - new Date(b.createdDate),
          );
          if (orderedItems !== null) {
            setSalesProductMapping(updatedArrayOfProducts);
            setOrderedItems(orderedItems);
            setCartData(res?.data?.data);
          }
          setDeleteLoader(false);
          showSnackbar('Removed ', 'success');
        })
        .catch((err) => {
          setDeleteLoader(false);
          if (err?.response?.data?.message) {
            showSnackbar(err.response.data.message, 'error');
          } else {
            showSnackbar('Unable to Delete', 'error');
          }
        });
    }
  };

  const handleDelete = (index) => {
    const isValuePresent = orderedItems.some((item) => item.gtin === barcodeNum[index]);

    const updatedBarcodeNum = [...barcodeNum];
    updatedBarcodeNum.splice(index, 1);
    setBarcodeNum(updatedBarcodeNum);

    const updatedProductName = [...productName];
    updatedProductName.splice(index, 1);
    setProductName(updatedProductName);

    const updatedmrp = [...itemMrp];
    updatedmrp.splice(index, 1);
    setItemMrp(updatedmrp);

    const updatedSpecification = [...specification];
    updatedSpecification.splice(index, 1);
    setSpecification(updatedSpecification);

    const updatedquantity = [...quantity];
    updatedquantity.splice(index, 1);
    setQuantity(updatedquantity);

    const updateSellingPrice = [...sellingPrice];
    updateSellingPrice.splice(index, 1);
    setSellingPrice(updateSellingPrice);

    const updatePurchasePrice = [...purchasePrice];
    updatePurchasePrice.splice(index, 1);
    setPurchasePrice(updatePurchasePrice);

    const updatecartProductId = [...cartProductId];
    updatecartProductId.splice(index, 1);
    setcartProductId(updatecartProductId);

    const updateCess = [...itemCess];
    updateCess.splice(index, 1);
    setItemCess(updateCess);

    const updateBatch = [...batchNum];
    updateBatch.splice(index, 1);
    setBatchNum(updateBatch);

    const updateExp = [...expiryDate];
    updateExp.splice(index, 1);
    setExpiryDate(updateExp);

    const updateDiscount = [...itemDiscount];
    updateDiscount.splice(index, 1);
    setItemDiscount(updateDiscount);

    const updateDiscountType = [...itemDiscountType];
    updateDiscountType.splice(index, 1);
    setItemDiscountType(updateDiscountType);

    const updatedTax = [...itemTax];
    updatedTax.splice(index, 1);
    setItemTax(updatedTax);

    const updatedAmount = [...itemAmount];
    updatedAmount.splice(index, 1);
    setItemAmount(updatedAmount);

    const updatedWithTaxAmount = [...itemAmountWithTax];
    updatedWithTaxAmount.splice(index, 1);
    setItemAmountWithTax(updatedWithTaxAmount);

    const updatedProductSelected = [...productSelected];
    updatedProductSelected.splice(index, 1);
    setProductSelected(updatedProductSelected);

    setCount((prev) => prev - 1);
    setFixedCount((prev) => prev - 1);

    if (localStorage.getItem('cartId-SO') && isValuePresent) {
      setDeleteLoader(true);
      removeCartProduct(localStorage.getItem('cartId-SO'), barcodeNum[index])
        .then((res) => {
          setDeleteLoader(false);
          const orderedItems = res?.data?.data?.cartProducts?.sort(
            (a, b) => new Date(a.createdDate) - new Date(b.createdDate),
          );
          if (orderedItems !== null) {
            setOrderedItems(orderedItems);
            setCartData(res?.data?.data);
          }
          showSnackbar('Removed', 'success');
        })
        .catch((err) => {
          setDeleteLoader(false);
          if (err?.response?.data?.message) {
            showSnackbar(err.response.data.message, 'error');
          } else {
            showSnackbar('Unable to Delete', 'error');
          }
        });
    }
  };

  const handleSellingPrice = async (gtin, index) => {
    const payload = {
      locationId: locId,
      gtins: [gtin],
    };
    let sellingPrice = '';
    try {
      const res = await getLatestInwarded(payload);
      // .then((res) => {
      if (res?.data?.data?.es === 0) {
        const newSP = res?.data?.data?.data[0]?.sellingPrice;
        const newPP = res?.data?.data?.data[0]?.purchasePrice;
        const newMRP = res?.data?.data?.data[0]?.mrp;
        const newBatch = res?.data?.data?.data[0]?.batchNo;
        if (newSP !== 'NaN' && newSP !== NaN) {
          if (!isMobileDevice) {
            const updateSellingPrice = [...sellingPrice];
            updateSellingPrice[index] = newSP;
            setSellingPrice(updateSellingPrice);

            const updateMRP = [...itemMrp];
            updateMRP[index] = newMRP;
            setItemMrp(updateMRP);

            const updatePP = [...purchasePrice];
            updatePP[index] = newPP;
            setPurchasePrice(updatePP);

            const updatedBatchNos = [...batchNum];
            updatedBatchNos[index] = newBatch;
            setBatchNum(updatedBatchNos);

            handleAddtoCart(gtin, newSP, newMRP, newPP, newBatch);
          } else {
            setNewSellingPrice(newSP);
            sellingPrice = newSP;
            return sellingPrice;
          }
        } else {
          showSnackbar('Selling Price not present', 'error');
          setSalesProductAddLoder(false);
        }
      } else if (res?.data?.data?.es === 1) {
        showSnackbar(res?.data?.data?.message, 'error');
        setSalesProductAddLoder(false);
      }
      // })
      // .catch((err) => {
    } catch (err) {
      showSnackbar(err?.response?.data?.message, 'error');
      setSalesProductAddLoder(false);
    }
    // });
  };

  const handleAddtoCart = async (gtin, sellingPrice, itemMrp, purchasePrice, itemBatch) => {
    try {
      const payload = {
        cartId: localStorage.getItem('cartId-SO'),
        sellingPrice: sellingPrice,
        gtin: gtin,
        locationId: locId,
        mrp: itemMrp,
        batchNo: itemBatch,
        purchasePrice: purchasePrice,
        inventoryChecks: 'NO',
        // "sellingUnit": "string",
        // "quantityBySpecs": "string",
        // "sellingIGst": 0,
        // "sellingSGst": 0,
        // "sellingCGst": 0,
        // "purchaseIGst": 0,
        // "purchaseSGst": 0,
        // "purchaseCGst": 0,
        // "purchaseCESS": 0,
        // "sellingCESS": 0,
        // "isOfferAvailable": true
      };
      // const res = await addToSalesCartwithSellingPrice(cartId, gtin, locId, sellingPrice);
      const res = await addProductToCart(payload);
      // .then((res) => {
      let amounts;
      setBillingData(res?.data?.data?.billing);
      const response = res?.data?.data?.cartProducts?.sort((a, b) => new Date(a.createdDate) - new Date(b.createdDate));
      setCartData(res?.data?.data);
      setOrderedItems(response);
      if (barcodeNum !== '' && barcodeNum.includes(gtin)) {
        const newIndex = barcodeNum.findIndex((item) => item === gtin);
        const cartIndex = response?.findIndex((item) => item.gtin === gtin);
        const cartProdId = [...cartProductId];
        cartProdId[newIndex] = response[cartIndex]?.cartProductId;
        setcartProductId(cartProdId);
      } else {
        setcartProductId(extractItemListProperty(response, 'cartProductId'));
      }
      if (!isMobileDevice) {
        setItemAmount(extractItemListProperty(response, 'subTotalWithoutTax'));
        setItemAmountWithTax(extractItemListProperty(response, 'subTotal'));
      } else {
        setAmounts([
          extractItemListProperty(response, 'subTotalWithoutTax'),
          extractItemListProperty(response, 'subTotal'),
        ]);
        amounts = [
          extractItemListProperty(response, 'subTotalWithoutTax'),
          extractItemListProperty(response, 'subTotal'),
        ];
        return amounts;
      }
    } catch (err) {
      showSnackbar(err?.response?.data?.message, 'error');
      setSalesProductAddLoder(false);
    }
  };

  useEffect(() => {
    if (debouncedValue !== '') {
      const enterQuantity = async () => {
        const lastQuantPair = quantBarcodePairs[quantBarcodePairs.length - 1];
        if (lastQuantPair) {
          const { qty, gtin, sp, productId } = lastQuantPair;
          try {
            const payload = {
              // qty: qty,
              // gtin: gtin,
              // sellingPrice: sp,

              cartId: localStorage.getItem('cartId-SO'),
              cartProductId: productId,
              sellingPrice: Number(sp),
              gtin: gtin,
              quantity: Number(qty),
              inventoryChecks: 'NO',
            };
            const res = await editCartQuantitySellingPrice(payload);
            setBillingData(res?.data?.data?.billing);
            setCartData(res?.data?.data);
            const orderedItems = res?.data?.data?.cartProducts?.sort(
              (a, b) => new Date(a.createdDate) - new Date(b.createdDate),
            );
            setOrderedItems(orderedItems);
            const response = orderedItems;

            if (barcodeNum.includes(gtin)) {
              if (barcodeNum.length > 1) {
                const newIndex = barcodeNum.findIndex((item) => item === gtin);
                const resIndex = response.findIndex((item) => item.gtin === gtin);
                const cartProdId = [...cartProductId];
                cartProdId[newIndex] = response[resIndex]?.cartProductId;
                setcartProductId(cartProdId);

                const updateItemAmount = [...itemAmount];
                updateItemAmount[newIndex] = response[resIndex]?.subTotalWithoutTax;
                setItemAmount(updateItemAmount);

                const updateitemAmountWithTax = [...itemAmountWithTax];
                updateitemAmountWithTax[newIndex] = response[resIndex]?.subTotal;
                setItemAmountWithTax(updateitemAmountWithTax);
              } else {
                setcartProductId(extractItemListProperty(response, 'cartProductId'));
                setItemAmount(extractItemListProperty(response, 'subTotalWithoutTax'));
                setItemAmountWithTax(extractItemListProperty(response, 'subTotal'));
              }
            } else {
              setcartProductId(extractItemListProperty(response, 'cartProductId'));
              setItemAmount(extractItemListProperty(response, 'subTotalWithoutTax'));
              setItemAmountWithTax(extractItemListProperty(response, 'subTotal'));
            }
          } catch (err) {
            showSnackbar(err?.response?.data?.message, 'error');
          }
        }
      };

      enterQuantity();
    }
  }, [debouncedValue]);

  const handleChangeValues = (e, index) => {
    const currentBarcode = barcodeNum[index];
    const currCartProductId = cartProductId[index];
    const sp = sellingPrice[index];
    const qty = quantity[index];
    if (
      currentBarcode !== undefined &&
      currentBarcode !== '' &&
      sp !== undefined &&
      sp !== '' &&
      currCartProductId !== undefined &&
      currCartProductId !== ''
    ) {
      setQuantChange(e.target.value);
      const updatedQuantBarcodePairs = [];

      if (e.target.name === 'quantity') {
        const updatedQuant = [...quantity];
        updatedQuant[index] = e.target.value;
        setQuantity(updatedQuant);

        updatedQuantBarcodePairs[index] = {
          qty: e.target.value,
          gtin: currentBarcode.toString(),
          sp: sp,
          productId: currCartProductId,
        };
      } else if (e.target.name === 'sellingPrice') {
        const updatedSellingPrice = [...sellingPrice];
        updatedSellingPrice[index] = e.target.value;
        setSellingPrice(updatedSellingPrice);
        updatedQuantBarcodePairs[index] = {
          qty: qty,
          gtin: currentBarcode.toString(),
          sp: e.target.value,
          productId: currCartProductId,
        };
      }
      setQuantBarcodePairs(updatedQuantBarcodePairs);
    } else {
      // showSnackbar('Enter product details', 'error');
    }
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
    <div>
      <SoftBox>
        <SoftBox display="flex" gap="30px" justifyContent={isMobileDevice ? 'space-between' : 'flex-start'}>
          {/* <SoftTypography variant="h6">
            {isMobileDevice ? 'Enter Items' : 'Enter items you wish to purchase'}
            {count > 1 && ` (Total Item: ${count})`}
          </SoftTypography>
          {deleteLoader && !isMobileDevice && <Spinner size={20} />}
          {cartLoader && !isMobileDevice && <Spinner size={20} />} */}
          {isMobileDevice && (
            <SoftButton variant="text" color="info" onClick={addItemsDrawerOpenHandler}>
              + Add Items
            </SoftButton>
          )}
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
          {!isMobileDevice &&
            Array.from({ length: count }, (_, i) => count - i - 1).map((_, reversedIndex) => {
              const isProductSelected = productSelected[reversedIndex];
              return (
                <SoftBox mt={1} key={reversedIndex} style={{ minWidth: !isMobileDevice ? '900px' : '100%' }}>
                  <Grid container spacing={1} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <Grid
                      item
                      xs={0.7}
                      sm={0.7}
                      md={0.7}
                      // mt={reversedIndex === 0 ? '10px' : '-1px'}
                      display={reversedIndex !== 0 ? 'flex' : ''}
                    >
                      {/* {reversedIndex === 0 && (
                        <SoftBox mb={1} display="flex">
                          <InputLabel
                            sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}
                          >
                            S No.
                          </InputLabel>
                        </SoftBox>
                      )} */}
                      <SoftBox display="flex" alignItems="center" gap="10px">
                        <SoftInput readOnly={true} value={reversedIndex + 1} />
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
                      {/* {reversedIndex === 0 && (
                        <SoftBox mb={1} display="flex">
                          <InputLabel
                            required
                            sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}
                          >
                            Barcode
                          </InputLabel>
                        </SoftBox>
                      )} */}
                      <SoftBox display="flex" alignItems="center" gap="10px" style={{ width: '100%' }}>
                        {isProductSelected || barcodeNum[reversedIndex] ? (
                          <TextField
                            value={barcodeNum[reversedIndex]}
                            readOnly={true}
                            style={{
                              width: '100%',
                            }}
                            onClick={() => {
                              barcodeNum[reversedIndex] ? handleProductNavigation(barcodeNum[reversedIndex]) : null;
                            }}
                          />
                        ) : (
                          <Autocomplete
                            freeSolo
                            disabled={localStorage.getItem('cartId-SO') ? false : true}
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
                      {/* {reversedIndex === 0 && (
                        <SoftBox mb={1} display="flex">
                          <InputLabel
                            required
                            sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}
                          >
                            Product Title
                          </InputLabel>
                        </SoftBox>
                      )} */}
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
                            disabled={localStorage.getItem('cartId-SO') ? false : true}
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
                    <Grid
                      item
                      xs={0.8}
                      sm={0.8}
                      md={0.8}
                      // mt={reversedIndex === 0 ? '10px' : '-1px'}
                    >
                      {/* {reversedIndex === 0 && (
                        <SoftBox mb={1} display="flex">
                          <InputLabel
                            required
                            sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}
                          >
                            MRP
                          </InputLabel>
                        </SoftBox>
                      )} */}

                      <SoftInput type="number" name="quantity" disabled value={itemMrp[reversedIndex]} />
                    </Grid>
                    <Grid
                      item
                      xs={1.3}
                      sm={1.3}
                      md={1.3}
                      // mt={reversedIndex === 0 ? '10px' : '-1px'}
                    >
                      {/* {reversedIndex === 0 && (
                        <SoftBox mb={1} display="flex">
                          <InputLabel
                            required
                            sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}
                          >
                            Specification
                          </InputLabel>
                        </SoftBox>
                      )} */}

                      <SoftInput type="text" disabled value={specification[reversedIndex] || ''} />
                    </Grid>
                    <Grid
                      item
                      xs={0.8}
                      sm={0.8}
                      md={0.8}
                      // mt={reversedIndex === 0 ? '10px' : '-1px'}
                    >
                      {/* {reversedIndex === 0 && (
                        <SoftBox mb={1} display="flex">
                          <InputLabel
                            required
                            sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}
                          >
                            Qty
                          </InputLabel>
                        </SoftBox>
                      )} */}

                      <SoftInput
                        type="number"
                        name="quantity"
                        disabled={localStorage.getItem('cartId-SO') ? false : true}
                        value={quantity[reversedIndex]}
                        onChange={(e) => {
                          handleChangeValues(e, reversedIndex);
                        }}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={1}
                      sm={1}
                      md={1}
                      // mt={reversedIndex === 0 ? '10px' : '-1px'}
                    >
                      {/* {reversedIndex === 0 && (
                        <SoftBox mb={1} display="flex">
                          <InputLabel
                            required
                            sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}
                          >
                            S.Price
                          </InputLabel>
                        </SoftBox>
                      )} */}

                      <SoftInput
                        type="number"
                        value={sellingPrice[reversedIndex]}
                        name="sellingPrice"
                        disabled={localStorage.getItem('cartId-SO') ? false : true}
                        onChange={(e) => {
                          handleChangeValues(e, reversedIndex);
                        }}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={0.8}
                      sm={0.8}
                      md={0.8}
                      // mt={reversedIndex === 0 ? '10px' : '-1px'}
                    >
                      {/* {reversedIndex === 0 && (
                        <SoftBox mb={1} display="flex">
                          <InputLabel
                            required
                            sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}
                          >
                            P.Price
                          </InputLabel>
                        </SoftBox>
                      )} */}

                      <SoftInput type="number" value={purchasePrice[reversedIndex]} disabled />
                    </Grid>
                    <Grid
                      item
                      xs={0.8}
                      sm={0.8}
                      md={0.8}
                      // mt={reversedIndex === 0 ? '10px' : '-1px'}
                    >
                      {/* {reversedIndex === 0 && (
                        <SoftBox mb={1} display="flex">
                          <InputLabel
                            required
                            sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}
                          >
                            Tax
                          </InputLabel>
                        </SoftBox>
                      )} */}

                      <SoftInput type="number" disabled value={itemTax[reversedIndex]} />
                    </Grid>
                    <Grid
                      item
                      xs={1}
                      sm={1}
                      md={1}
                      // mt={reversedIndex === 0 ? '10px' : '-1px'}
                    >
                      {/* {reversedIndex === 0 && (
                        <SoftBox mb={1} display="flex">
                          <InputLabel
                            required
                            sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}
                          >
                            Amount
                          </InputLabel>
                        </SoftBox>
                      )} */}

                      <SoftInput
                        type="number"
                        disabled
                        value={inclusiveTax ? itemAmountWithTax[reversedIndex] : itemAmount[reversedIndex]}
                      />
                    </Grid>
                    {/* <SoftBox
                      mt={reversedIndex === 0 ? '49px' : '10px'}
                      width="20px"
                      height="40px"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleMoreDetails(reversedIndex)}
                    >
                      <AddIcon fontSize="small" color="info" />
                    </SoftBox> */}
                    <SoftBox
                      // mt={reversedIndex === 0 ? '49px' : '10px'}
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
          {openOtherModal && (
            <SalesOrderOpenOtherModal
              openOtherModal={openOtherModal}
              setOpenOtherModal={setOpenOtherModal}
              detailIndex={detailIndex}
              batchNum={batchNum}
              setBatchNum={setBatchNum}
              expiryDate={expiryDate}
              setExpiryDate={setExpiryDate}
              itemDiscount={itemDiscount}
              setItemDiscount={setItemDiscount}
              itemCess={itemCess}
              setItemCess={setItemCess}
              cartId={cartId}
              itemDiscountType={itemDiscountType}
              setItemDiscountType={setItemDiscountType}
              handleBatchChange={handleBatchChange}
            />
          )}
          {isMobileDevice &&
            (mobileSalesProductLoader ? (
              <Spinner size={30} />
            ) : (
              <SoftBox sx={{ width: '100% !important' }}>
                {salesProductMapping?.length > 0 ? (
                  salesProductMapping.map((product, index) => (
                    <SalesOrderProductCard
                      data={product}
                      inclusiveTax={inclusiveTax}
                      handleDelete={handleDeleteMobile}
                      index={index}
                      deleteLoader={deleteLoader}
                    />
                  ))
                ) : (
                  <SoftTypography fontSize="14px">No Products Added</SoftTypography>
                )}
              </SoftBox>
            ))}
        </SoftBox>
        {!isMobileDevice && (
          <SoftTypography
            className="add-more-text"
            // sx={{ marginLeft: '-10px', color: '#0562FB' }}
            onClick={handleAddmore}
            component="label"
            variant="caption"
            fontWeight="bold"
          >
            + Add More
          </SoftTypography>
        )}
        {localStorage.getItem('cartId-SO') ? (
          <SoftBox display="flex" mt={1} alignItems="center">
            <Checkbox checked={inclusiveTax} onClick={() => setInclusiveTax(!inclusiveTax)} />
            <SoftTypography component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
              *Inclusive of tax
            </SoftTypography>
          </SoftBox>
        ) : (
          <SoftTypography fontSize="small" style={{ color: 'red' }}>
            {' '}
            Enter all the mandatory fields{' '}
          </SoftTypography>
        )}
      </SoftBox>
      <Drawer
        anchor="right"
        open={addItemsDrawer}
        onClose={addItemsDrawerCloseHandler}
        className="sales-order-drawer"
        PaperProps={{
          sx: {
            width: '100% !important',
            height: '100vh',
            height: '100dvh',
            margin: '0px !important',
            borderRadius: '0px !important',
            overflowY: 'scroll',
            backgroundColor: 'white !important',
          },
        }}
      >
        {salesProductAddLoder && (
          <SoftBox className="circular-progress-modal">
            <Spinner />
          </SoftBox>
        )}
        <SoftButton onClick={addItemsDrawerCloseHandler} className="back-icon-button">
          <ArrowBackIosNewIcon className="back-icon-navbar" />
        </SoftButton>
        <SoftBox className="sales-add-items-box">
          <Grid container spacing={1}>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <SoftBox mb={1} className="drawer-sales-input">
                <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                  Barcode
                </InputLabel>
                <Autocomplete
                  value={salesProductDetails?.gtin || null}
                  // freeSolo
                  disabled={!localStorage.getItem('cartId-SO')}
                  options={autocompleteBarcodeOptions}
                  getOptionLabel={(option) => option.gtin}
                  placeholder="Type Gtin..."
                  onChange={(e, newValue) => {
                    productSelectHandler(newValue, 0);
                  }}
                  onInputChange={(e, newInputValue) => {
                    handleChangeIO({ target: { value: newInputValue } }, 0);
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
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <SoftBox mb={1} className="drawer-sales-input">
                <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                  Product Title
                </InputLabel>
                <Autocomplete
                  // freeSolo
                  value={salesProductDetails?.productName || null}
                  disabled={!localStorage.getItem('cartId-SO')}
                  options={autocompleteTitleOptions}
                  getOptionLabel={(option) => {
                    if (option === null) {
                      return '';
                    } else {
                      return option.name;
                    }
                  }}
                  onChange={(e, newValue) => {
                    productSelectHandler(newValue, 0);
                  }}
                  onInputChange={(e, newInputValue) => {
                    handleChangeIO({ target: { value: newInputValue } }, 0);
                  }}
                  style={{
                    width: '100%',
                  }}
                  renderInput={(params) => (
                    <TextField
                      // value={salesProductDetails?.productName}
                      {...params}
                      inputProps={{
                        ...params.inputProps,
                        onKeyDown: (e) => {
                          if (e.key === 'Enter') {
                            e.stopPropagation();
                          }
                        },
                      }}
                      style={{
                        width: '100%',
                      }}
                      // Other TextField props
                    />
                  )}
                />
              </SoftBox>
            </Grid>
            <Grid item lg={6} md={6} sm={6} xs={6}>
              <SoftBox mb={1} className="drawer-sales-input">
                <SoftBox display="flex">
                  <InputLabel
                    required
                    sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}
                  >
                    MRP
                  </InputLabel>
                </SoftBox>
                <SoftInput
                  type="number"
                  name="quantity"
                  disabled
                  {...(salesProductDetails?.mrp && { value: salesProductDetails?.mrp })}
                />
              </SoftBox>
            </Grid>
            <Grid item lg={6} md={6} sm={4} xs={6}>
              <SoftBox mb={1} className="drawer-sales-input">
                <SoftBox display="flex">
                  <InputLabel
                    required
                    sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}
                  >
                    Specification
                  </InputLabel>
                </SoftBox>
                <SoftInput
                  type="text"
                  disabled
                  {...(salesProductDetails?.specification && { value: salesProductDetails?.specification })}
                />
              </SoftBox>
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <SoftBox mb={1} className="drawer-sales-input">
                <SoftBox display="flex">
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
                  disabled={!localStorage.getItem('cartId-SO')}
                  value={salesProductDetails?.quantity}
                  onChange={quantityHandlerMobile}
                />
              </SoftBox>
            </Grid>
            <Grid item lg={6} md={6} sm={6} xs={6}>
              <SoftBox mb={1} className="drawer-sales-input">
                <SoftBox display="flex">
                  <InputLabel
                    required
                    sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}
                  >
                    S.Price
                  </InputLabel>
                </SoftBox>
                <SoftInput
                  type="number"
                  disabled
                  {...(salesProductDetails?.sellingPrice && { value: salesProductDetails?.sellingPrice })}
                />
              </SoftBox>
            </Grid>
            <Grid item lg={6} md={6} sm={6} xs={6}>
              <SoftBox mb={1} className="drawer-sales-input">
                <SoftBox display="flex">
                  <InputLabel
                    required
                    sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}
                  >
                    Tax
                  </InputLabel>
                </SoftBox>
                <SoftInput
                  type="number"
                  disabled
                  {...(salesProductDetails?.tax && { value: salesProductDetails?.tax })}
                />
              </SoftBox>
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <SoftBox mb={1} className="drawer-sales-input">
                <SoftBox display="flex">
                  <InputLabel
                    required
                    sx={{ margin: 'auto', fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}
                  >
                    Amount
                  </InputLabel>
                </SoftBox>
                <SoftInput
                  type="number"
                  disabled
                  value={
                    (salesProductDetails &&
                      (!inclusiveTax
                        ? salesProductDetails?.amount[0][salesProductDetails?.amount[0].length - 1]
                        : salesProductDetails?.amount[1][salesProductDetails?.amount[1].length - 1])) ||
                    'NA'
                  }
                />
              </SoftBox>
            </Grid>
          </Grid>
          <SoftBox className="drawer-buttons">
            <SoftButton
              variant={buttonStyles.outlinedColor}
              className="outlined-softbutton"
              onClick={addItemsDrawerCloseHandler}
            >
              Cancel
            </SoftButton>
            <SoftButton
              variant={buttonStyles.primaryVariant}
              className="contained-softbutton"
              onClick={addItemsDrawerSaveHandler}
              disabled={saveAndCancelDisable}
            >
              Save
            </SoftButton>
          </SoftBox>
        </SoftBox>
      </Drawer>
    </div>
  );
};

export default ItemListData;
