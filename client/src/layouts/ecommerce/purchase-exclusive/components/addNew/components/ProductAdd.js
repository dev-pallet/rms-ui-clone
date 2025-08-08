import { Autocomplete, Grid, TextField, Tooltip, tooltipClasses } from '@mui/material';
import {
  addGlobalProduct,
  addGlobalProductV2,
  deleteItemExpressPurchase,
  getItemsInfo,
  previPurchasePrice,
  purchaseRecommendation,
  spBasedONProductConfig,
  verifyBatch,
} from '../../../../../../config/Services';
import { useDebounce } from 'usehooks-ts';
import CancelIcon from '@mui/icons-material/Cancel';
import React, { useEffect, useRef, useState } from 'react';
import SoftBox from '../../../../../../components/SoftBox';
import SoftInput from '../../../../../../components/SoftInput';
import SoftTypography from '../../../../../../components/SoftTypography';
// sweetalert2 components
import '../add-po.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from '../../../../../../hooks/SnackbarProvider';
import AddIcon from '@mui/icons-material/Add';
import AdditionalDetails from './additionalDetails';
import CreateNewProduct from './createProd';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import SoftSelect from '../../../../../../components/SoftSelect';
import Swal from 'sweetalert2';
import styled from '@emotion/styled';

const ProductAdd = ({
  setBarcodeNum,
  setProductName,
  setExpDate,
  setBatchNo,
  setMrp,
  setPurchasePrice,
  setPreviousPurchasePrice,
  setQuantity,
  setSpecification,
  setEpoID,
  setMasterSellingPrice,
  masterSellingPrice,
  barcodeNum,
  productName,
  expDate,
  batchno,
  mrp,
  setItemCess,
  setItemDiscount,
  setItemDiscountType,
  itemCess,
  itemDiscount,
  itemDiscountType,
  setTotalPurchasePrice,
  setSellingPrice,
  totalPurchasePrice,
  sellingPrice,
  purchasePrice,
  previousPurchasePrice,
  quantity,
  setCount,
  setCount2,
  specification,
  epoID,
  count,
  count2,
  setFixedCount,
  setFixedCount2,
  fixedCount,
  fixedCount2,
  vendorId,
  handleAddProduct,
  itemLoader,
  setItemLoader,
  setAddLoader,
  itemListArray,
  setQuantityRejected,
  quantityRejected,
  invoiceRefNo,
  invoiceValue,
  invoiceDate,
  setDiffBuyQuantity,
  setDiffGetBarcodeNum,
  setDiffGetProductName,
  setDiffGetQuantity,
  diffBuyQuantity,
  diffGetBarcodeNum,
  diffGetProductName,
  diffGetQuantity,
  setMoreProdAdded,
  handleAddMoreProduct,
  assignedTo,
  flagColor,
  setFlagColor,
  recommendation,
  setRecommendation,
  salesCat,
  setSalesCat,
  inventCat,
  setInventCat,
  grossProfitCat,
  setGrossProfitCat,
  flagAvailableStk,
  setFlagAvailableStk,
  stkTurnOver,
  setStkTurnover,
  inclusiveTax,

  setOfferId,
  offerId,
  setOffers,
  offers,
  setOfferType,
  offerType,
  setOfferSubType,
  offerSubType,
  setOfferDetailsId,
  offerDetailsId,
  setInwardedQuantity,
  inwardedQuantity,
  setOfferDiscount,
  offerDiscount,
  setOfferDiscountType,
  offerDiscountType,
  changedIGST,
  setChangedIGST,
  isChangedIGST,
  setIsChangedIGST,
  changedCGST,
  setChangedCGST,
  changedSGST,
  setChangedSGST,
  isChangedCGST,
  setIsChangedCGST,
  isChangedSGST,
  setIsChangedSGST,
  cmsIGST,
  setCMSIgst,
  counterApiCalled,
  setApiCallCounter,
  totalRowsGRN,
  setTotalRowsGRN,
}) => {
  const [autocompleteTitleOptions, setAutocompleteTitleOptions] = useState([]);
  const [autocompleteBarcodeOptions, setAutocompleteBarcodeOptions] = useState([]);
  const [loader, setLoader] = useState(false);
  const [isBarcode, setIsBarcode] = useState(false);
  const [productPresent, setProductPresent] = useState(false);
  const [productPresentIndex, setProductPresentIndex] = useState(0);
  const [prodName, setProdName] = useState('');
  const [barNum, setBarNum] = useState('');
  const [addDraftProduct, setAddDraftProduct] = useState(false);
  const [gstChange, setGstChange] = useState(false);
  const [productSelected, setProductSelected] = useState(Array(count).fill(false));
  const quantityInputRef = useRef(null);

  const { jobId } = useParams();
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const contextType = localStorage.getItem('contextType');
  const epoNumber = localStorage.getItem('epoNumber');
  const user_details = JSON.parse(localStorage.getItem('user_details'));
  const uidx = user_details.uidx;
  const showSnackbar = useSnackbar();

  const [batchCheck, setBatchCheck] = useState('');
  const [batchChange, setBatchChange] = useState(false);
  const debouncedValue = useDebounce(batchCheck, 700);
  const [batchBarcodePairs, setBatchBarcodePairs] = useState([]);
  const [curentProductName, setCurentProductName] = useState('');
  const debounceProductName = useDebounce(curentProductName, 700);
  const [curentValueChange, setCurentValueChange] = useState('');
  const [curentValueChangeIndex, setCurentValueChangeIndex] = useState(0);
  const debounceValueChange = useDebounce(curentValueChange, 700);
  const [sellingPriceInputEnabled, setSellingPriceInputEnabled] = useState(Array(count).fill(true));
  const [openModal, setOpenModal] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);
  const [currIndex, setCurrIndex] = useState(0);
  const [detailIndex, setDetailIndex] = useState(0);
  const navigate = useNavigate();
  const boxRef = useRef(null);

  const handleAddmore = () => {
    setCount(count + 1);
    setBarcodeNum([...barcodeNum, '']);
    setProductName([...productName, '']);
    setBatchNo([...batchno, '']);
    setMrp([...mrp, '']);
    setItemCess([...itemCess, '']);
    setItemDiscount([...itemDiscount, '']);
    setItemDiscountType([...itemDiscountType, '']);
    setMasterSellingPrice([...masterSellingPrice, 'automatic']);
    setQuantityRejected([...quantityRejected, '']);
    setTotalPurchasePrice([...totalPurchasePrice, '']);
    setSellingPrice([...sellingPrice, '']);
    setPurchasePrice([...purchasePrice, '']);
    setPreviousPurchasePrice([...previousPurchasePrice, '']);
    setQuantity([...quantity, '']);
    setChangedIGST([...changedIGST, '']);
    setChangedCGST([...changedCGST, '']);
    setChangedSGST([...changedSGST, '']);
    setCMSIgst([...cmsIGST, '']);
    setIsChangedIGST([...isChangedIGST, 'false']);
    setIsChangedCGST([...isChangedCGST, '']);
    setIsChangedSGST([...isChangedSGST, '']);
    setFlagColor((prev) => [...prev, '']);
    setRecommendation((prev) => [...prev, '']);
    setSalesCat((prev) => [...prev, '']);
    setInventCat((prev) => [...prev, '']);
    setGrossProfitCat((prev) => [...prev, '']);
    setFlagAvailableStk((prev) => [...prev, '']);
    setStkTurnover((prev) => [...prev, '']);
    handleAddMoreProduct();
    setMoreProdAdded(true);
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

  const handleDelete = (index) => {
    const isValuePresent = itemListArray.some((item) => item.itemNo === barcodeNum[index]);
    let epoId = '';
    if (jobId) {
      epoId = jobId;
    } else {
      epoId = epoNumber;
    }
    const updatedBarcodeNum = [...barcodeNum];
    updatedBarcodeNum.splice(index, 1);
    setBarcodeNum(updatedBarcodeNum);

    const updatedProductName = [...productName];
    updatedProductName.splice(index, 1);
    setProductName(updatedProductName);

    const updatedBatchNos = [...batchno];
    updatedBatchNos.splice(index, 1);
    setBatchNo(updatedBatchNos);

    const updatedmrp = [...mrp];
    updatedmrp.splice(index, 1);
    setMrp(updatedmrp);

    const updatedCess = [...itemCess];
    updatedCess.splice(index, 1);
    setItemCess(updatedCess);

    const updatedDiscount = [...itemDiscount];
    updatedDiscount.splice(index, 1);
    setItemDiscount(updatedDiscount);

    const updatedDiscountType = [...itemDiscountType];
    updatedDiscountType.splice(index, 1);
    setItemDiscountType(updatedDiscountType);

    const updatedmasterSellingPrice = [...masterSellingPrice];
    updatedmasterSellingPrice.splice(index, 1);
    setMasterSellingPrice(updatedmasterSellingPrice);

    const updatedQuantityRejected = [...quantityRejected];
    updatedQuantityRejected.splice(index, 1);
    setQuantityRejected(updatedQuantityRejected);

    const updatetotalPurchasePrice = [...totalPurchasePrice];
    updatetotalPurchasePrice.splice(index, 1);
    setTotalPurchasePrice(updatetotalPurchasePrice);

    const updateSellingPrice = [...sellingPrice];
    updateSellingPrice.splice(index, 1);
    setSellingPrice(updateSellingPrice);

    const updatedEnabledArray = [...sellingPriceInputEnabled];
    updatedEnabledArray.splice(index, 1);
    setSellingPriceInputEnabled(updatedEnabledArray);

    const updatedpurchasePrices = [...purchasePrice];
    updatedpurchasePrices.splice(index, 1);
    setPurchasePrice(updatedpurchasePrices);

    const updatedprevPurchasePrices = [...previousPurchasePrice];
    updatedprevPurchasePrices.splice(index, 1);
    setPreviousPurchasePrice(updatedprevPurchasePrices);

    const updatedexpDate = [...expDate];
    updatedexpDate.splice(index, 1);
    setExpDate(updatedexpDate);

    const updatedCMSigst = [...cmsIGST];
    updatedCMSigst.splice(index, 1);
    setCMSIgst(updatedCMSigst);

    const updatedIGST = [...changedIGST];
    updatedIGST.splice(index, 1);
    setChangedIGST(updatedIGST);

    const updatedCGST = [...changedCGST];
    updatedCGST.splice(index, 1);
    setChangedCGST(updatedCGST);

    const updatedSGST = [...changedSGST];
    updatedSGST.splice(index, 1);
    setChangedSGST(updatedSGST);

    const updatedGST = [...isChangedIGST];
    updatedGST.splice(index, 1);
    setIsChangedIGST(updatedGST);

    const updatedisCGST = [...isChangedCGST];
    updatedisCGST.splice(index, 1);
    setIsChangedCGST(updatedisCGST);

    const updatedisSGST = [...isChangedSGST];
    updatedisSGST.splice(index, 1);
    setIsChangedSGST(updatedisSGST);

    const updatedquantity = [...quantity];
    updatedquantity.splice(index, 1);
    setQuantity(updatedquantity);

    const updatedFlag = [...flagColor];
    updatedFlag.splice(index, 1);
    setFlagColor(updatedFlag);

    const updatedRecommend = [...recommendation];
    updatedRecommend.splice(index, 1);
    setRecommendation(updatedRecommend);

    const updatedSalesCat = [...salesCat];
    updatedSalesCat.splice(index, 1);
    setSalesCat(updatedSalesCat);

    const updatedInventCat = [...inventCat];
    updatedInventCat.splice(index, 1);
    setInventCat(updatedInventCat);

    const updateGrossProfit = [...grossProfitCat];
    updateGrossProfit.splice(index, 1);
    setGrossProfitCat(updateGrossProfit);

    const updateflagStk = [...flagAvailableStk];
    updateflagStk.splice(index, 1);
    setFlagAvailableStk(updateflagStk);

    const updatestkTurnOver = [...stkTurnOver];
    updatestkTurnOver.splice(index, 1);
    setStkTurnover(updatestkTurnOver);

    const updatedProductSelected = [...productSelected];
    updatedProductSelected.splice(index, 1);
    setProductSelected(updatedProductSelected);

    setCount(count - 1);
    setFixedCount(fixedCount - 1);

    if (epoId && isValuePresent) {
      setItemLoader(true);
      const payload = {
        epoNumber: epoId,
        itemId: epoID[index],
      };
      const apiStartTime = Date.now();
      deleteItemExpressPurchase(payload)
        .then((res) => {
          setAddLoader(true);
          setItemLoader(false);
          setApiCallCounter((prev) => prev + 1);
          const apiEndTime = Date.now(); // Record the end time upon receiving the response
          const totalApiTime = apiEndTime - apiStartTime;
          counterApiCalled(epoId, totalApiTime);
          if (res?.data?.data?.es === 1) {
            showSnackbar(res?.data?.data?.message, 'error');
          } else {
            showSnackbar('Product Deleted', 'success');
          }
        })
        .catch((err) => {
          showSnackbar(err?.response?.data?.message, 'error');
          setItemLoader(false);
        });
    } else {
    }
  };

  function calculatePurchasePrice(purchasePrice, value) {
    const decimalVal = Number(value) / 100;
    const finalValue = Number(purchasePrice) * decimalVal;
    // const totalPurchasePrice = Number(purchasePrice) + finalValue;
    return Number(finalValue);
  }
  const focusQuantityInput = (index) => {
    const quantityInput = document.getElementById(`quantityInput-${index}`);
    if (quantityInput) {
      quantityInput.focus();
    }
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
            setIsBarcode(true);
            payload.names = [];
            setBarNum(searchText);
            setProdName('');
          } else {
            payload.gtin = [];
            setIsBarcode(false);
            payload.names = [searchText];
            setBarNum('');
            setProdName(searchText);
          }
        } else {
          payload.gtin = [];
          setIsBarcode(false);
          setBarNum('');
          setProdName('');
          payload.names = [];
        }
        if (searchText.length >= 3) {
          setLoader(true);
          setCurentProductName('');
          getItemsInfo(payload)
            .then(function (response) {
              setLoader(false);
              if (response?.data?.status === 'SUCCESS') {
                if (response?.data?.data?.products.length === 0) {
                  const newSwal = Swal.mixin({
                    customClass: {
                      // cancelButton: 'button button-error',
                      // confirmButton: 'button button-success',
                      cancelButton: 'logout-cancel-btn',
                      confirmButton: 'logout-success-btn',
                    },
                    buttonsStyling: false,
                  });

                  newSwal
                    .fire({
                      title: 'Product not found',
                      text: 'Do you want to create a new Product ?',
                      icon: 'info',
                      showCancelButton: true,
                      confirmButtonText: 'Confirm',
                      reverseButtons: true,
                    })
                    .then((result) => {
                      if (result.isConfirmed) {
                        setOpenModal(true);
                      }
                    });
                } else if (isNumber && response?.data?.data?.products.length === 1) {
                  selectProduct(response?.data?.data?.products[0], currIndex);
                } else {
                  if (!isNumber) {
                    const updated = [...productSelected];
                    updated[currIndex] = true;
                    setProductSelected(updated);
                    setAutocompleteTitleOptions(response?.data?.data?.products);
                  } else {
                    const updated = [...productSelected];

                    updated[currIndex] = false;
                    setProductSelected(updated);
                    setAutocompleteBarcodeOptions(response?.data?.data?.products);
                  }
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
    const val = e.target.value;
    if (val === '') {
      const updatedProductName = [...productName];
      updatedProductName[index] = '';
      setProductName(updatedProductName);

      const updatedProductSelected = [...productSelected];
      updatedProductSelected[index] = false;
      setProductSelected(updatedProductSelected);

      const updatedSpecification = [...specification];
      updatedSpecification[index] = '';
      setSpecification(updatedSpecification);

      const updatedBarcodeNum = [...barcodeNum];
      updatedBarcodeNum[index] = '';
      setBarcodeNum(updatedBarcodeNum);

      const updatedCMSIGST = [...cmsIGST];
      updatedCMSIGST[index] = 0;
      setCMSIgst(updatedCMSIGST);

      const updatedmrp = [...mrp];
      updatedmrp[index] = '';
      setMrp(updatedmrp);

      const updatedFlag = [...flagColor];
      updatedFlag[index] = 'NA';
      setFlagColor(updatedFlag);

      const updatedRecommend = [...recommendation];
      updatedRecommend[index] = 'NA';
      setRecommendation(updatedRecommend);

      const updatedSalesCat = [...salesCat];
      updatedSalesCat[index] = 'NA';
      setSalesCat(updatedSalesCat);

      const updatedInventCat = [...inventCat];
      updatedInventCat[index] = 'NA';
      setInventCat(updatedInventCat);

      const updateGrossProfit = [...grossProfitCat];
      updateGrossProfit[index] = 'NA';
      setGrossProfitCat(updateGrossProfit);

      const updateflagStk = [...flagAvailableStk];
      updateflagStk[index] = 'NA';
      setFlagAvailableStk(updateflagStk);

      const updatestkTurnOver = [...stkTurnOver];
      updatestkTurnOver[index] = 'NA';
      setStkTurnover(updatestkTurnOver);

      const updatedPreviousPP = [...previousPurchasePrice];
      updatedPreviousPP[index] = 0;
      setPreviousPurchasePrice(updatedPreviousPP);

      const updatedEnabledArray = [...sellingPriceInputEnabled];
      updatedEnabledArray[index] = false;
      setSellingPriceInputEnabled(updatedEnabledArray);

      const updatedMasterSellingPrice = [...masterSellingPrice];
      updatedMasterSellingPrice[index] = 'automatic';
      setMasterSellingPrice(updatedMasterSellingPrice);
    } else {
      setCurentProductName(e.target.value);
      setCurrIndex(index);
    }
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

  const handleCreateGlobalProd = (item) => {
    const globalPayload = {
      destinationStoreOrgId: orgId,
      destinationStoreId: locId,
      gtin: item?.gtin || '',
      updatedBy: uidx,
      updatedByName: user_name,
    };
    addGlobalProductV2(globalPayload)
      .then((res) => {})
      .catch((err) => {
        showSnackbar('Unable to create product', 'error');
      });
  };

  const handleFlagdata = async (itemCode, index) => {
    try {
      const payload = {
        gtin: itemCode,
        locationId: locId,
        orgId: orgId,
      };
      const res = await purchaseRecommendation(payload);
      const response = res?.data?.data;
      if (response?.es) {
        const updatedFlag = [...flagColor];
        updatedFlag[index] = 'NA';
        setFlagColor(updatedFlag);

        const updatedRecommend = [...recommendation];
        updatedRecommend[index] = 'NA';
        setRecommendation(updatedRecommend);

        const updatedSalesCat = [...salesCat];
        updatedSalesCat[index] = 'NA';
        setSalesCat(updatedSalesCat);

        const updatedInventCat = [...inventCat];
        updatedInventCat[index] = 'NA';
        setInventCat(updatedInventCat);

        const updateGrossProfit = [...grossProfitCat];
        updateGrossProfit[index] = 'NA';
        setGrossProfitCat(updateGrossProfit);

        const updateflagStk = [...flagAvailableStk];
        updateflagStk[index] = 'NA';
        setFlagAvailableStk(updateflagStk);

        const updatestkTurnOver = [...stkTurnOver];
        updatestkTurnOver[index] = 'NA';
        setStkTurnover(updatestkTurnOver);

        return;
      }
      const updatedFlag = [...flagColor];
      updatedFlag[index] = response?.productForecast?.flag || 'GREY';
      setFlagColor(updatedFlag);

      const updatedRecommend = [...recommendation];
      updatedRecommend[index] = response?.productForecast?.recommendation;
      setRecommendation(updatedRecommend);

      const updatedSalesCat = [...salesCat];
      updatedSalesCat[index] = response?.productForecast?.salesCat || 'NA';
      setSalesCat(updatedSalesCat);

      const updatedInventCat = [...inventCat];
      updatedInventCat[index] = response?.productForecast?.inventoryCat || 'NA';
      setInventCat(updatedInventCat);

      if (updatedInventCat[index] === 'D') {
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
              handleDelete(index);
            }
          });
      }

      const updateGrossProfit = [...grossProfitCat];
      updateGrossProfit[index] = response?.productForecast?.grossProfitCat || 'NA';
      setGrossProfitCat(updateGrossProfit);

      const updateflagStk = [...flagAvailableStk];
      updateflagStk[index] = response?.productForecast?.availableStock;
      setFlagAvailableStk(updateflagStk);

      const updatestkTurnOver = [...stkTurnOver];
      updatestkTurnOver[index] = response?.productForecast?.stockTurnover;
      setStkTurnover(updatestkTurnOver);
    } catch (err) {
      const updatedFlag = [...flagColor];
      updatedFlag[index] = 'NA';
      setFlagColor(updatedFlag);

      const updatedRecommend = [...recommendation];
      updatedRecommend[index] = 'NA';
      setRecommendation(updatedRecommend);

      const updatedSalesCat = [...salesCat];
      updatedSalesCat[index] = 'NA';
      setSalesCat(updatedSalesCat);

      const updatedInventCat = [...inventCat];
      updatedInventCat[index] = 'NA';
      setInventCat(updatedInventCat);

      const updateGrossProfit = [...grossProfitCat];
      updateGrossProfit[index] = 'NA';
      setGrossProfitCat(updateGrossProfit);

      const updateflagStk = [...flagAvailableStk];
      updateflagStk[index] = 'NA';
      setFlagAvailableStk(updateflagStk);

      const updatestkTurnOver = [...stkTurnOver];
      updatestkTurnOver[index] = 'NA';
      setStkTurnover(updatestkTurnOver);
    }
  };

  const getPreviousPurchsePrice = (gtin, index) => {
    previPurchasePrice(gtin, orgId)
      .then((res) => {
        const response = res?.data?.data;
        const updatedPreviousPP = [...previousPurchasePrice];
        updatedPreviousPP[index] = response?.previousPurchasePrice === 'NA' ? 0 : response?.previousPurchasePrice;
        setPreviousPurchasePrice(updatedPreviousPP);
      })
      .catch((err) => {
        const updatedPreviousPP = [...previousPurchasePrice];
        updatedPreviousPP[index] = 0;
        setPreviousPurchasePrice(updatedPreviousPP);
      });
  };

  const selectProduct = async (item, index) => {
    setCurentProductName('');
    setAutocompleteTitleOptions([]);
    setAutocompleteBarcodeOptions([]);
    if (item?.gtin !== undefined && item?.gtin !== '') {
      if (contextType === 'WMS' && !item?.productSource?.supportedWarehouses.includes(locId)) {
        handleCreateGlobalProd(item);
      } else if (contextType === 'RETAIL' && !item?.productSource?.supportedRetails.includes(locId)) {
        handleCreateGlobalProd(item);
      } else if (contextType === 'VMS' && !item?.productSource?.marketPlaceSellers.includes(locId)) {
        handleCreateGlobalProd(item);
      }
      setBarNum('');
      setProdName('');
      setProductPresentIndex(index);

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

      const updatedCMSIGST = [...cmsIGST];
      updatedCMSIGST[index] = Number(item?.igst);
      setCMSIgst(updatedCMSIGST);

      const updatedCess = [...itemCess];
      updatedCess[index] = Number(item?.cess);
      setItemCess(updatedCess);

      const updatedmrp = [...mrp];
      updatedmrp[index] = item?.mrp?.mrp;
      setMrp(updatedmrp);

      // const updatedProductSelected = [...productSelected];
      // updatedProductSelected[index] = true;
      // setProductSelected(updatedProductSelected);
      // await handleFlagdata(item?.gtin, index);

      focusQuantityInput(index);
      setCurentValueChangeIndex(index);
      setAddDraftProduct(true);
    } else {
      const updatedProductName = [...productName];
      updatedProductName[index] = '';
      setProductName(updatedProductName);

      const updatedProductSelected = [...productSelected];
      updatedProductSelected[index] = false;
      setProductSelected(updatedProductSelected);

      const updatedSpecification = [...specification];
      updatedSpecification[index] = '';
      setSpecification(updatedSpecification);

      const updatedBarcodeNum = [...barcodeNum];
      updatedBarcodeNum[index] = '';
      setBarcodeNum(updatedBarcodeNum);

      const updatedCMSIGST = [...cmsIGST];
      updatedCMSIGST[index] = 0;
      setCMSIgst(updatedCMSIGST);

      const updatedmrp = [...mrp];
      updatedmrp[index] = '';
      setMrp(updatedmrp);

      const updatedFlag = [...flagColor];
      updatedFlag[index] = 'NA';
      setFlagColor(updatedFlag);

      const updatedRecommend = [...recommendation];
      updatedRecommend[index] = 'NA';
      setRecommendation(updatedRecommend);

      const updatedSalesCat = [...salesCat];
      updatedSalesCat[index] = 'NA';
      setSalesCat(updatedSalesCat);

      const updatedInventCat = [...inventCat];
      updatedInventCat[index] = 'NA';
      setInventCat(updatedInventCat);

      const updateGrossProfit = [...grossProfitCat];
      updateGrossProfit[index] = 'NA';
      setGrossProfitCat(updateGrossProfit);

      const updateflagStk = [...flagAvailableStk];
      updateflagStk[index] = 'NA';
      setFlagAvailableStk(updateflagStk);

      const updatestkTurnOver = [...stkTurnOver];
      updatestkTurnOver[index] = 'NA';
      setStkTurnover(updatestkTurnOver);

      const updatedPreviousPP = [...previousPurchasePrice];
      updatedPreviousPP[index] = 0;
      setPreviousPurchasePrice(updatedPreviousPP);

      const updatedEnabledArray = [...sellingPriceInputEnabled];
      updatedEnabledArray[index] = false;
      setSellingPriceInputEnabled(updatedEnabledArray);

      const updatedMasterSellingPrice = [...masterSellingPrice];
      updatedMasterSellingPrice[index] = 'automatic';
      setMasterSellingPrice(updatedMasterSellingPrice);
    }
  };

  useEffect(() => {
    if (addDraftProduct) {
      handleAddEPO(curentValueChangeIndex);
    }
  }, [addDraftProduct]);

  const isRowFilled = (index) => {
    return (
      barcodeNum[index] !== undefined &&
      productName[index] !== undefined &&
      mrp[index] !== undefined &&
      totalPurchasePrice[index] !== undefined &&
      purchasePrice[index] !== undefined &&
      quantity[index] !== undefined &&
      quantity[index] > 0
    );
  };

  useEffect(() => {
    if (debouncedValue !== '') {
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
  }, [debouncedValue]);

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

      const updatedBatchNos = [...batchno];
      updatedBatchNos[index] = e.target.value;
      setBatchNo(updatedBatchNos);
    } else {
      showSnackbar('Enter product details', 'error');
    }
  };

  const handleChangeValues = (e, index) => {
    if (e.target.name === 'quantity') {
      const updatedQty = [...quantity];
      updatedQty[index] = e.target.value;
      setQuantity(updatedQty);

      const updatedPurchasePrice = [...purchasePrice];
      updatedPurchasePrice[index] =
        parseFloat(totalPurchasePrice[index] / e.target.value).toFixed(3) !== 'NaN' ||
        parseFloat(totalPurchasePrice[index] / e.target.value).toFixed(3) !== 'Infinity'
          ? parseFloat(totalPurchasePrice[index] / e.target.value).toFixed(3)
          : '';
      setPurchasePrice(updatedPurchasePrice);
    } else if (e.target.name === 'totalPurchase') {
      const updatedtotalPurchasePrice = [...totalPurchasePrice];
      updatedtotalPurchasePrice[index] = e.target.value;
      setTotalPurchasePrice(updatedtotalPurchasePrice);

      const updatedPurchasePrice = [...purchasePrice];
      updatedPurchasePrice[index] =
        parseFloat(e.target.value / quantity[index]).toFixed(3) !== 'NaN' &&
        parseFloat(e.target.value / quantity[index]).toFixed(3) !== 'Infinity'
          ? parseFloat(e.target.value / quantity[index]).toFixed(3)
          : '';
      setPurchasePrice(updatedPurchasePrice);
    } else if (e.target.name === 'mrp') {
      const updatedmrp = [...mrp];
      updatedmrp[index] = e.target.value;
      setMrp(updatedmrp);
    } else if (e.target.name === 'sellingPrice') {
      const updatedsellingPrice = [...sellingPrice];
      updatedsellingPrice[index] = e.target.value;
      if (updatedsellingPrice[index] <= 0 || updatedsellingPrice[index] !== '') {
        showSnackbar('Enter a valid selling price', 'error');
      }
      setSellingPrice(updatedsellingPrice);
    }

    setCurentValueChange(e.target.value);
    setCurentValueChangeIndex(index);
  };

  useEffect(() => {
    if (debounceValueChange) {
      if (isRowFilled(curentValueChangeIndex)) {
        if (epoID[curentValueChangeIndex] !== undefined) {
          updateItem(curentValueChangeIndex);
        } else {
          handleAddEPO(curentValueChangeIndex);
        }
      }
    }
  }, [debounceValueChange]);

  const updateItem = (index) => {
    let epoId = '';
    if (jobId) {
      epoId = jobId;
    } else {
      epoId = epoNumber;
    }
    if (epoId === null) {
      handleAddEPO(index);
    } else {
      const payload = {
        epoNumber: epoId,
        id: epoID[index],
        quantityOrdered: quantity[index] === 0 ? '' : quantity[index],
        unitPrice: mrp[index],
        purchasePrice: parseFloat(purchasePrice[index]).toFixed(3),
        batchNumber: batchno[index],
        expiryDate: expDate[index],
        statusUpdatedBy: uidx,
        quantityRejected: quantityRejected[index],
      };

      if (barcodeNum[index]) {
        spBasedONProductConfig(
          locId,
          barcodeNum[index],
          purchasePrice[index] !== '' && purchasePrice[index] !== undefined ? purchasePrice[index] : 0,
          mrp[index],
        )
          .then((res) => {
            if (res?.data?.data?.es === 0) {
              const updatedSellingPrice = [...sellingPrice];
              updatedSellingPrice[index] = res?.data?.data?.data;
              setSellingPrice(updatedSellingPrice);

              const updatedEnabledArray = [...sellingPriceInputEnabled];
              updatedEnabledArray[index] = true;
              setSellingPriceInputEnabled(updatedEnabledArray);

              const updatedMasterSellingPrice = [...masterSellingPrice];
              updatedMasterSellingPrice[index] = 'automatic';
              setMasterSellingPrice(updatedMasterSellingPrice);

              payload.sellingPrice = res?.data?.data?.data;
              payload.masterSellingPrice = 'automatic';
            } else if (res?.data?.data?.es === 1) {
              const updatedEnabledArray = [...sellingPriceInputEnabled];
              updatedEnabledArray[index] = false;
              setSellingPriceInputEnabled(updatedEnabledArray);

              const updatedMasterSellingPrice = [...masterSellingPrice];
              updatedMasterSellingPrice[index] = 'manual';
              setMasterSellingPrice(updatedMasterSellingPrice);

              payload.sellingPrice = '';
              payload.masterSellingPrice = 'manual';
            }
          })
          .catch((err) => {
            payload.sellingPrice = '';
            // showSnackbar(err?.response?.data?.message, 'error');
          });
      }
    }
  };

  const handleAddEPO = (index) => {
    setProductPresent(false);
    setAddDraftProduct(false);
    let epoId = '';
    if (jobId) {
      epoId = jobId;
    } else {
      epoId = epoNumber;
    }
    if (epoId) {
      const payload = {
        epoNumber: epoId,
        itemNo: barcodeNum[index],
        itemName: productName[index],
        specification: specification[index],
        quantityOrdered: Number(quantity[index]) === 0 ? '' : Number(quantity[index]),
        unitPrice: Number(mrp[index]),
        purchasePrice: Number(parseFloat(purchasePrice[index]).toFixed(3)) || 0,
        batchNumber: batchno[index],
        cess: itemCess[index] || null,
        discount: itemDiscount[index] || null,
        discountType: itemDiscountType[index] || null,
        expiryDate: expDate[index],
        quantityRejected: quantityRejected[index],
        masterSellingPrice: masterSellingPrice[index],
      };
      if (quantity[index] === null || quantity[index] === undefined) {
        payload.quantityOrdered = '';
        payload.purchasePrice = '';
      }
      const pp =
        inclusiveTax.value === 'false'
          ? purchasePrice[index] +
            calculatePurchasePrice(purchasePrice[index], changedIGST[index]) +
            calculatePurchasePrice(purchasePrice[index], itemCess[index]) -
            (itemDiscountType[index] === 'percentage'
              ? calculatePurchasePrice(purchasePrice[index], itemDiscount[index])
              : itemDiscount[index] || 0)
          : purchasePrice[index];

      if (barcodeNum[index]) {
        spBasedONProductConfig(
          locId,
          barcodeNum[index],
          purchasePrice[index] !== '' && purchasePrice[index] !== undefined ? Number(pp) : 0,
          mrp[index],
        )
          .then((res) => {
            if (res?.data?.data?.es === 0) {
              const updatedSellingPrice = [...sellingPrice];
              updatedSellingPrice[index] = res?.data?.data?.data;
              setSellingPrice(updatedSellingPrice);

              payload.sellingPrice = res?.data?.data?.data;
              const updatedEnabledArray = [...sellingPriceInputEnabled];
              updatedEnabledArray[index] = true;
              setSellingPriceInputEnabled(updatedEnabledArray);

              const updatedMasterSellingPrice = [...masterSellingPrice];
              updatedMasterSellingPrice[index] = 'automatic';
              payload.masterSellingPrice = 'automatic';
              setMasterSellingPrice(updatedMasterSellingPrice);
            } else if (res?.data?.data?.es === 1) {
              const updatedEnabledArray = [...sellingPriceInputEnabled];
              updatedEnabledArray[index] = false;
              setSellingPriceInputEnabled(updatedEnabledArray);

              const updatedMasterSellingPrice = [...masterSellingPrice];
              updatedMasterSellingPrice[index] = 'manual';
              setMasterSellingPrice(updatedMasterSellingPrice);
              payload.sellingPrice = '';
              payload.masterSellingPrice = 'manual';
            }
          })
          .catch((err) => {
            payload.sellingPrice = '';
            // showSnackbar(err?.response?.data?.message, 'error');
          });
      }
    } else if (masterSellingPrice[index] === 'manual') {
      handleAddProduct(sellingPrice[index]);
    } else if (masterSellingPrice[index] === 'automatic') {
      handleAddProduct('');
    } else {
      const pp =
        inclusiveTax.value === 'false'
          ? purchasePrice[index] +
            calculatePurchasePrice(purchasePrice[index], changedIGST[index]) +
            calculatePurchasePrice(purchasePrice[index], itemCess[index]) -
            (itemDiscountType[index] === 'percentage'
              ? calculatePurchasePrice(purchasePrice[index], itemDiscount[index])
              : itemDiscount[index] || 0)
          : purchasePrice[index];
      if (barcodeNum[index]) {
        spBasedONProductConfig(
          locId,
          barcodeNum[index],
          purchasePrice[index] !== '' && purchasePrice[index] !== undefined ? Number(pp) : 0,
          mrp[index],
        )
          .then((res) => {
            if (res?.data?.data?.es === 0) {
              const updatedSellingPrice = [...sellingPrice];
              updatedSellingPrice[index] = res?.data?.data?.data;
              setSellingPrice(updatedSellingPrice);

              const updatedEnabledArray = [...sellingPriceInputEnabled];
              updatedEnabledArray[index] = true;
              setSellingPriceInputEnabled(updatedEnabledArray);

              const updatedMasterSellingPrice = [...masterSellingPrice];
              updatedMasterSellingPrice[index] = 'automatic';
              setMasterSellingPrice(updatedMasterSellingPrice);

              handleAddProduct(res?.data?.data?.data);
            } else if (res?.data?.data?.es === 1) {
              const updatedEnabledArray = [...sellingPriceInputEnabled];
              updatedEnabledArray[index] = false;
              setSellingPriceInputEnabled(updatedEnabledArray);

              const updatedMasterSellingPrice = [...masterSellingPrice];
              updatedMasterSellingPrice[index] = 'manual';
              setMasterSellingPrice(updatedMasterSellingPrice);

              handleAddProduct('');
            }
          })
          .catch((err) => {
            // showSnackbar(err?.response?.data?.message, 'error');
            handleAddProduct('');
          });
      }
    }
  };

  const handleMoreDetails = (index) => {
    setOpenModal2(true);
    setDetailIndex(index);
    setCurentValueChangeIndex(index);
  };

  const handleIGSTChange = (e, index) => {
    const updatedIGST = [...changedIGST];
    updatedIGST[index] = e.value;
    setChangedIGST(updatedIGST);

    const updatedGST = [...isChangedIGST];
    updatedGST[index] = 'true';
    setIsChangedIGST(updatedGST);

    const updatedCGST = [...changedCGST];
    updatedCGST[index] = e.value / 2;
    setChangedCGST(updatedCGST);

    const updatedcGST = [...isChangedCGST];
    updatedcGST[index] = 'true';
    setIsChangedCGST(updatedcGST);

    const updatedSGST = [...changedSGST];
    updatedSGST[index] = e.value / 2;
    setChangedSGST(updatedSGST);

    const updatedsGST = [...isChangedSGST];
    updatedsGST[index] = 'true';
    setIsChangedSGST(updatedsGST);

    setCurentValueChangeIndex(index);
    setAddDraftProduct(true);
  };

  let counter = 0;
  let totalCounter = 0;

  const totalRows = () => {
    itemListArray?.forEach((item) => {
      if (item?.purchasePrice !== 0) {
        totalCounter++;
      }
    });
    return totalCounter;
  };

  useEffect(() => {
    const total = totalRows();
    setTotalRowsGRN(total);
  }, [itemListArray]);

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

  const gstArray = [
    { value: 0, label: '0' },
    { value: 5, label: '5' },
    { value: 12, label: '12' },
    { value: 18, label: '18' },
    { value: 28, label: '28' },
  ];

  return (
    <div>
      <SoftBox>
        <SoftBox display="flex" gap="30px" alignItems="center" mb={2}>
          {/* <SoftTypography variant="h6">
            Enter items you wish to purchase <b>{count > 1 && `(Total items added: ${totalRows()})`} </b>
          </SoftTypography>
          {itemLoader && <Spinner size={20} />} */}

          {/* <SoftButton className="vendor-second-btn" width="50px">
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
              <div>Browse</div>
              <DriveFolderUploadIcon />
            </div>s
          </SoftButton> */}
        </SoftBox>
        {/* {count > 0 && (
          <SoftBox className="heading-product-boxes">
            <SoftBox mt={-3} style={{ minWidth: '900px' }}>
              <Grid container spacing={1} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Grid item xs={0.7} sm={0.7} md={0.7} mt={'10px'}>
                  <SoftBox display="flex" alignItems="center">
                    <InputLabel className="all-input-label">S No.</InputLabel>
                  </SoftBox>
                </Grid>
                <Grid item xs={2} sm={2} md={2} mt={'10px'}>
                  <SoftBox display="flex" alignItems="center">
                    <InputLabel required className="all-input-label">
                      Barcode
                    </InputLabel>
                  </SoftBox>
                </Grid>
                <Grid item xs={2} sm={2} md={2} mt={'10px'}>
                  <SoftBox display="flex" alignItems="center">
                    <InputLabel required className="all-input-label">
                      Product Title
                    </InputLabel>
                  </SoftBox>
                </Grid>
                <Grid item xs={0.8} sm={0.8} md={0.8} mt={'10px'}>
                  <SoftBox display="flex" alignItems="center">
                    <InputLabel required className="all-input-label">
                      Qty
                    </InputLabel>
                  </SoftBox>
                </Grid>
                <Grid item xs={1} sm={1} md={1} mt={'10px'} ml={0.5}>
                  <SoftBox display="flex" alignItems="center">
                    <InputLabel required className="all-input-label">
                      Total PP
                    </InputLabel>
                  </SoftBox>
                </Grid>
                <Grid item xs={1} sm={1} md={1} mt={'10px'}>
                  <SoftBox display="flex" alignItems="center">
                    <InputLabel required className="all-input-label">
                      Price / unit
                    </InputLabel>
                  </SoftBox>
                </Grid>
                <Grid item xs={0.8} sm={0.8} md={0.8} mt={'10px'}>
                  <SoftBox display="flex" alignItems="center">
                    <InputLabel required className="all-input-label">
                      MRP
                    </InputLabel>
                  </SoftBox>
                </Grid>
                <Grid item xs={0.8} sm={0.8} md={0.8} mt={'10px'}>
                  <SoftBox display="flex" alignItems="center">
                    <InputLabel required className="all-input-label">
                      S Price
                    </InputLabel>
                  </SoftBox>
                </Grid>
                <Grid item xs={1} sm={1} md={1} mt={'10px'}>
                  <SoftBox display="flex" alignItems="center">
                    <InputLabel className="all-input-label">P Margin</InputLabel>
                  </SoftBox>
                </Grid>
                <Grid item xs={0.8} sm={0.8} md={0.8} mt={'10px'} ml={0.3}>
                  <SoftBox display="flex" alignItems="center">
                    <InputLabel className="all-input-label">GST (%)</InputLabel>
                  </SoftBox>
                </Grid>
                <SoftBox
                  mt={'5px'}
                  width="20px"
                  height="40px"
                  style={{ cursor: 'pointer', marginLeft: '15px' }}
                ></SoftBox>
                <SoftBox mt={'5px'} width="20px" height="40px" style={{ cursor: 'pointer' }}></SoftBox>
              </Grid>
            </SoftBox>
          </SoftBox>
        )} */}
        <SoftBox
          ref={boxRef}
          className="item-product-boxes"
          style={{
            overflowY: count > 11 ? 'scroll' : 'visible',
          }}
        >
          {Array.from({ length: count }, (_, i) => count - i - 1).map((_, reversedIndex) => {
            // const reversedIndex = count - reversedIndex - 1;
            const isProductSelected = productSelected[reversedIndex];
            const isAdded = epoID[reversedIndex] === undefined;
            const newPurchseprice =
              purchasePrice[reversedIndex] >= 0 && purchasePrice[reversedIndex] !== ''
                ? Math.round(purchasePrice[reversedIndex] * 1000) / 1000
                : '';
            const isGreater = newPurchseprice > mrp[reversedIndex];
            if (
              itemListArray[reversedIndex]?.purchasePrice !== 0 ||
              itemListArray[reversedIndex]?.purchasePrice === '0.000'
            ) {
              counter++;
            }
            const purchaseMargin =
              mrp[reversedIndex] !== undefined &&
              mrp[reversedIndex] !== '' &&
              purchasePrice[reversedIndex] !== undefined &&
              purchasePrice[reversedIndex] !== '' &&
              !isNaN(mrp[reversedIndex]) &&
              !isNaN(purchasePrice[reversedIndex]) &&
              isFinite(mrp[reversedIndex]) &&
              isFinite(purchasePrice[reversedIndex])
                ? Math.abs(
                    (((mrp[reversedIndex] - purchasePrice[reversedIndex]) / mrp[reversedIndex]) * 100).toFixed(1),
                  )
                : '';

            const gstValue =
              isChangedIGST[reversedIndex] === 'true' && isChangedIGST[reversedIndex] !== ''
                ? parseFloat(changedIGST[reversedIndex])
                : cmsIGST[reversedIndex] !== undefined && cmsIGST[reversedIndex] !== ''
                ? parseFloat(cmsIGST[reversedIndex]) || 0
                : 0;
            const newSellingPrice =
              sellingPrice[reversedIndex] !== 'NaN' &&
              sellingPrice[reversedIndex] !== undefined &&
              sellingPrice[reversedIndex] !== ''
                ? sellingPrice[reversedIndex]
                : '';

            return (
              <SoftBox key={reversedIndex} style={{ minWidth: '900px' }}>
                <Grid container spacing={1} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                  <Grid item xs={0.7} sm={0.7} md={0.7} ml={'15px'} mt={reversedIndex === 0 ? '10px' : '10px'}>
                    {
                      itemListArray[reversedIndex]?.purchasePrice === 0 ||
                      itemListArray[reversedIndex]?.purchasePrice === '0.000' ? (
                        <SoftBox className="product-input-label" ml={1.5}>
                          <Tooltip title={'FREE PRODUCTS'}>
                            <LocalOfferIcon color="success" />
                          </Tooltip>
                        </SoftBox>
                      ) : isAdded ? (
                        // flagColor[reversedIndex] === 'NA' || flagColor[reversedIndex] === '' || flagColor === '' ? (
                        <Tooltip title="Product is not saved, please enter a valid product or enter all the required values">
                          <SoftBox className="product-input-label product-aligning" style={{ cursor: 'pointer' }}>
                            <SoftInput type="number" readOnly={true} value={counter} className="product-not-added" />
                          </SoftBox>
                        </Tooltip>
                      ) : (
                        // ) : (
                        //   <Badge
                        //     badgeContent={
                        //       <FlagTooltips
                        //         placement="bottom-start"
                        //         title={
                        //           <div className="tooltip-flag-recommend">
                        //             <div className="tooltip-flag-heading-name">
                        //               <SoftTypography fontSize="14px" fontWeight="bold">
                        //                 Recommendation:
                        //               </SoftTypography>
                        //               <SoftTypography fontSize="14px" fontWeight="bold">
                        //                 Available Stock:
                        //               </SoftTypography>
                        //               <SoftTypography fontSize="14px" fontWeight="bold">
                        //                 Stock Turnover:
                        //               </SoftTypography>
                        //               <SoftTypography
                        //                 fontSize="14px"
                        //                 fontWeight="bold"
                        //                 mt={inventCat[reversedIndex] === 'D' ? '' : 1}
                        //               >
                        //                 Inventory:
                        //               </SoftTypography>
                        //               <SoftTypography fontSize="14px" fontWeight="bold" mt={1}>
                        //                 Sales:
                        //               </SoftTypography>
                        //               <SoftTypography fontSize="14px" fontWeight="bold" mt={1}>
                        //                 Gross Profit:
                        //               </SoftTypography>
                        //             </div>
                        //             <div className="tooltip-flag-heading-name">
                        //               <SoftTypography fontSize="14px">
                        //                 {recommendation[reversedIndex] || 'NA'}
                        //               </SoftTypography>
                        //               <SoftTypography fontSize="14px">
                        //                 {flagAvailableStk[reversedIndex] || '0'}
                        //               </SoftTypography>
                        //               <SoftTypography fontSize="14px">{stkTurnOver[reversedIndex] || '0'}</SoftTypography>
                        //               <div className={inventCat[reversedIndex] === 'D' ? 'tooltip-flag-cat-data' : ''}>
                        //                 {inventCat[reversedIndex] === 'D' ? (
                        //                   <span style={{ color: 'red', fontSize: '14px', fontWeight: 'bold' }}>
                        //                     Dead Stock
                        //                   </span>
                        //                 ) : (
                        //                   <>
                        //                     <Chip
                        //                       color={categoryColour(inventCat[reversedIndex])}
                        //                       label={inventCat[reversedIndex] || 'NA'}
                        //                     />
                        //                     {inventCat[reversedIndex] !== 'NA' && (
                        //                       <Chip
                        //                         color={categoryColour(inventCat[reversedIndex])}
                        //                         label={getTagDescription('INVENTORY', inventCat[reversedIndex]) || 'NA'}
                        //                       />
                        //                     )}
                        //                   </>
                        //                 )}
                        //               </div>
                        //               <div className="tooltip-flag-cat-data">
                        //                 <Chip
                        //                   color={categoryColour(salesCat[reversedIndex])}
                        //                   label={salesCat[reversedIndex] || 'NA'}
                        //                 />
                        //                 {salesCat[reversedIndex] !== 'NA' && (
                        //                   <Chip
                        //                     color={categoryColour(salesCat[reversedIndex])}
                        //                     label={getTagDescription('SALES', salesCat[reversedIndex]) || 'NA'}
                        //                   />
                        //                 )}
                        //               </div>
                        //               <div className="tooltip-flag-cat-data">
                        //                 <Chip
                        //                   color={categoryColour(grossProfitCat[reversedIndex])}
                        //                   label={grossProfitCat[reversedIndex] || 'NA'}
                        //                 />
                        //                 {grossProfitCat[reversedIndex] !== 'NA' && (
                        //                   <Chip
                        //                     color={categoryColour(grossProfitCat[reversedIndex])}
                        //                     label={getTagDescription('PROFIT', grossProfitCat[reversedIndex]) || 'NA'}
                        //                   />
                        //                 )}
                        //               </div>
                        //             </div>
                        //           </div>
                        //         }
                        //       >
                        //         <FlagIcon fontSize="small" style={{ color: '#fff', cursor: 'pointer' }} />
                        //       </FlagTooltips>
                        //     }
                        //     color={categoryColour(flagColor[reversedIndex])}
                        //     anchorOrigin={{
                        //       vertical: 'top',
                        //       horizontal: 'left',
                        //     }}
                        //   >
                        //     <Tooltip title="Product is not saved, please enter a valid product or enter all the required values">
                        //       <SoftBox className="product-input-label product-aligning" style={{ cursor: 'pointer' }}>
                        //         <SoftInput type="number" readOnly={true} value={counter} className="product-not-added" />
                        //       </SoftBox>
                        //     </Tooltip>
                        //   </Badge>
                        // )
                        // flagColor[reversedIndex] === 'NA' || flagColor[reversedIndex] === '' || flagColor === '' ? (
                        <SoftBox className="product-input-label product-aligning" style={{ maxWidth: '49.91px' }}>
                          <SoftInput type="number" readOnly={true} value={counter} />
                        </SoftBox>
                      )
                      // ) : (
                      //   <Badge
                      //     badgeContent={
                      //       <FlagTooltips
                      //         placement="bottom-start"
                      //         title={
                      //           <div className="tooltip-flag-recommend">
                      //             <div className="tooltip-flag-heading-name">
                      //               <SoftTypography fontSize="14px" fontWeight="bold">
                      //                 Recommendation:
                      //               </SoftTypography>
                      //               <SoftTypography fontSize="14px" fontWeight="bold">
                      //                 Available Stock:
                      //               </SoftTypography>
                      //               <SoftTypography fontSize="14px" fontWeight="bold">
                      //                 Stock Turnover:
                      //               </SoftTypography>
                      //               <SoftTypography
                      //                 fontSize="14px"
                      //                 fontWeight="bold"
                      //                 mt={inventCat[reversedIndex] === 'D' ? '' : 1}
                      //               >
                      //                 Inventory:
                      //               </SoftTypography>
                      //               <SoftTypography fontSize="14px" fontWeight="bold" mt={1}>
                      //                 Sales:
                      //               </SoftTypography>
                      //               <SoftTypography fontSize="14px" fontWeight="bold" mt={1}>
                      //                 Gross Profit:
                      //               </SoftTypography>
                      //             </div>
                      //             <div className="tooltip-flag-heading-name">
                      //               <SoftTypography fontSize="14px">
                      //                 {recommendation[reversedIndex] || 'NA'}
                      //               </SoftTypography>
                      //               <SoftTypography fontSize="14px">
                      //                 {flagAvailableStk[reversedIndex] || '0'}
                      //               </SoftTypography>
                      //               <SoftTypography fontSize="14px">{stkTurnOver[reversedIndex] || '0'}</SoftTypography>
                      //               <div className={inventCat[reversedIndex] === 'D' ? 'tooltip-flag-cat-data' : ''}>
                      //                 {inventCat[reversedIndex] === 'D' ? (
                      //                   <span style={{ color: 'red', fontSize: '14px', fontWeight: 'bold' }}>
                      //                     Dead Stock
                      //                   </span>
                      //                 ) : (
                      //                   <>
                      //                     <Chip
                      //                       color={categoryColour(inventCat[reversedIndex])}
                      //                       label={inventCat[reversedIndex] || 'NA'}
                      //                     />
                      //                     {inventCat[reversedIndex] !== 'NA' && (
                      //                       <Chip
                      //                         color={categoryColour(inventCat[reversedIndex])}
                      //                         label={getTagDescription('INVENTORY', inventCat[reversedIndex]) || 'NA'}
                      //                       />
                      //                     )}
                      //                   </>
                      //                 )}
                      //               </div>
                      //               <div className="tooltip-flag-cat-data">
                      //                 <Chip
                      //                   color={categoryColour(salesCat[reversedIndex])}
                      //                   label={salesCat[reversedIndex] || 'NA'}
                      //                 />
                      //                 {salesCat[reversedIndex] !== 'NA' && (
                      //                   <Chip
                      //                     color={categoryColour(salesCat[reversedIndex])}
                      //                     label={getTagDescription('SALES', salesCat[reversedIndex]) || 'NA'}
                      //                   />
                      //                 )}
                      //               </div>
                      //               <div className="tooltip-flag-cat-data">
                      //                 <Chip
                      //                   color={categoryColour(grossProfitCat[reversedIndex])}
                      //                   label={grossProfitCat[reversedIndex] || 'NA'}
                      //                 />
                      //                 {grossProfitCat[reversedIndex] !== 'NA' && (
                      //                   <Chip
                      //                     color={categoryColour(grossProfitCat[reversedIndex])}
                      //                     label={getTagDescription('PROFIT', grossProfitCat[reversedIndex]) || 'NA'}
                      //                   />
                      //                 )}
                      //               </div>
                      //             </div>
                      //           </div>
                      //         }
                      //       >
                      //         <FlagIcon fontSize="small" style={{ color: '#fff', cursor: 'pointer' }} />
                      //       </FlagTooltips>
                      //     }
                      //     color={categoryColour(flagColor[reversedIndex])}
                      //     anchorOrigin={{
                      //       vertical: 'top',
                      //       horizontal: 'left',
                      //     }}
                      //   >
                      //     <SoftBox className="product-input-label product-aligning" style={{ maxWidth: '49.91px' }}>
                      //       <SoftInput type="number" readOnly={true} value={counter} />
                      //     </SoftBox>
                      //   </Badge>
                      // )
                    }
                  </Grid>
                  <Grid
                    item
                    xs={2}
                    sm={2}
                    md={2}
                    mt={reversedIndex === 0 ? '10px' : '10px'}
                    display={reversedIndex !== 0 ? 'flex' : ''}
                  >
                    <SoftBox className="product-input-label" style={{ width: '100%' }}>
                      {isProductSelected ? (
                        <TextField
                          value={barcodeNum[reversedIndex]}
                          readOnly={true}
                          style={{ width: '100%' }}
                          onClick={() => {
                            barcodeNum[reversedIndex]
                              ? navigate(`/products/all-products/details/${barcodeNum[reversedIndex]}`)
                              : null;
                          }}
                        />
                      ) : quantity[reversedIndex] !== '' && barcodeNum[reversedIndex] ? (
                        <TextField
                          value={barcodeNum[reversedIndex]}
                          readOnly={true}
                          style={{ width: '100%' }}
                          onClick={() => {
                            barcodeNum[reversedIndex]
                              ? navigate(`/products/all-products/details/${barcodeNum[reversedIndex]}`)
                              : null;
                          }}
                        />
                      ) : (
                        <Autocomplete
                          freeSolo
                          disabled={
                            vendorId === '' ||
                            invoiceRefNo === '' ||
                            invoiceValue === '' ||
                            invoiceDate === '' ||
                            assignedTo?.length < 1
                              ? true
                              : false
                          }
                          options={autocompleteBarcodeOptions}
                          getOptionLabel={(option) => option.gtin}
                          onChange={(e, newValue) => {
                            selectProduct(newValue, reversedIndex);
                          }}
                          onInputChange={(e, newInputValue) => {
                            handleChangeIO({ target: { value: newInputValue } }, reversedIndex);
                          }}
                          style={{ width: '100%' }}
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
                              style={{ width: '100%' }}
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
                    mt={reversedIndex === 0 ? '10px' : '10px'}
                    display={reversedIndex !== 0 ? 'flex' : ''}
                  >
                    <SoftBox className="product-input-label" style={{ width: '100%' }}>
                      {quantity[reversedIndex] !== '' ? (
                        <TextField
                          value={productName[reversedIndex]}
                          readOnly={true}
                          style={{
                            width: '100%',
                          }}
                        />
                      ) : !isProductSelected && productName[reversedIndex] ? (
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
                          disabled={
                            vendorId === '' ||
                            invoiceRefNo === '' ||
                            invoiceValue === '' ||
                            invoiceDate === '' ||
                            assignedTo?.length < 1
                              ? true
                              : false
                          }
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
                              inputProps={{
                                ...params.inputProps,
                                onKeyDown: (e) => {
                                  if (e.key === 'Enter') {
                                    e.stopPropagation();
                                  }
                                },
                              }}
                              type="text"
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

                  <Grid item xs={0.8} sm={0.8} md={0.8} mt={reversedIndex === 0 ? '10px' : '10px'}>
                    <SoftInput
                      // ref={quantityInputRef}
                      id={`quantityInput-${reversedIndex}`}
                      type="number"
                      name="quantity"
                      disabled={
                        vendorId === '' ||
                        invoiceRefNo === '' ||
                        invoiceValue === '' ||
                        invoiceDate === '' ||
                        assignedTo?.length < 1
                          ? true
                          : false
                      }
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
                    mt={reversedIndex === 0 ? '10px' : '10px'}
                    display={reversedIndex !== 0 ? 'flex' : ''}
                  >
                    <SoftBox className="product-input-label">
                      <SoftInput
                        type="number"
                        name="totalPurchase"
                        disabled={
                          vendorId === '' ||
                          invoiceRefNo === '' ||
                          invoiceValue === '' ||
                          invoiceDate === '' ||
                          assignedTo?.length < 1
                            ? true
                            : false
                        }
                        value={
                          totalPurchasePrice[reversedIndex] >= 0 && totalPurchasePrice[reversedIndex] !== ''
                            ? Math.round(totalPurchasePrice[reversedIndex] * 1000) / 1000
                            : ''
                        }
                        onChange={(e) => {
                          handleChangeValues(e, reversedIndex);
                        }}
                      />
                    </SoftBox>
                  </Grid>
                  <Grid
                    item
                    xs={1}
                    sm={1}
                    md={1}
                    mt={reversedIndex === 0 ? '10px' : '10px'}
                    display={reversedIndex !== 0 ? 'flex' : ''}
                  >
                    {isGreater ? (
                      <Tooltip title="Price/unit is greater than MRP">
                        <SoftBox className="product-input-label">
                          <SoftInput disabled value={newPurchseprice} className="product-not-added" />
                        </SoftBox>
                      </Tooltip>
                    ) : (
                      <SoftBox className="product-input-label">
                        <SoftInput disabled value={newPurchseprice} />
                      </SoftBox>
                    )}
                  </Grid>
                  <Grid
                    item
                    xs={0.8}
                    sm={0.8}
                    md={0.8}
                    mt={reversedIndex === 0 ? '10px' : '10px'}
                    display={reversedIndex !== 0 ? 'flex' : ''}
                  >
                    <SoftBox className="product-input-label">
                      <SoftInput
                        type="number"
                        name="mrp"
                        disabled={
                          vendorId === '' ||
                          invoiceRefNo === '' ||
                          invoiceValue === '' ||
                          invoiceDate === '' ||
                          assignedTo?.length < 1
                            ? true
                            : false
                        }
                        value={mrp[reversedIndex]}
                        onChange={(e) => {
                          handleChangeValues(e, reversedIndex);
                        }}
                      />
                    </SoftBox>
                  </Grid>

                  <Grid
                    item
                    xs={0.8}
                    sm={0.8}
                    md={0.8}
                    mt={reversedIndex === 0 ? '10px' : '10px'}
                    display={reversedIndex !== 0 ? 'flex' : ''}
                  >
                    <Tooltip title={newSellingPrice}>
                      <SoftBox className="product-input-label">
                        <SoftInput
                          type="number"
                          name="sellingPrice"
                          style={{ cursor: 'pointer' }}
                          disabled={masterSellingPrice[reversedIndex] === 'manual' ? false : true}
                          value={newSellingPrice}
                          onKeyDown={(e) => {
                            if (e.key === '-') {
                              showSnackbar('Enter a valid  selling price', 'error');
                              e.preventDefault();
                            }
                          }}
                          onChange={(e) => {
                            if (masterSellingPrice[reversedIndex] === 'manual') {
                              handleChangeValues(e, reversedIndex);
                            }
                          }}
                        />
                      </SoftBox>
                    </Tooltip>
                  </Grid>

                  <Grid
                    item
                    xs={1}
                    sm={1}
                    md={1}
                    mt={reversedIndex === 0 ? '10px' : '10px'}
                    display={reversedIndex !== 0 ? 'flex' : ''}
                  >
                    <SoftBox className="product-input-label">
                      <SoftInput disabled value={!isNaN(purchaseMargin) ? purchaseMargin : ''} />
                    </SoftBox>
                  </Grid>
                  <Grid
                    item
                    xs={1}
                    sm={1}
                    md={1}
                    mt={reversedIndex === 0 ? '10px' : '10px'}
                    display={reversedIndex !== 0 ? 'flex' : ''}
                  >
                    <SoftBox className="product-input-label">
                      {/* <SoftInput
                        type="number"
                        onChange={(e) => handleIGSTChange(e, reversedIndex)}
                        disabled={
                          vendorId === '' ||
                          invoiceRefNo === '' ||
                          invoiceValue === '' ||
                          invoiceDate === '' ||
                          assignedTo?.length < 1
                            ? true
                            : false
                        }
                        value={gstValue}
                      /> */}
                      <SoftSelect
                        menuPortalTarget={document.body}
                        styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                        className="boom-soft-select"
                        isDisabled={
                          vendorId === '' ||
                          invoiceRefNo === '' ||
                          invoiceValue === '' ||
                          invoiceDate === '' ||
                          assignedTo?.length < 1
                            ? true
                            : false
                        }
                        value={gstArray.find((option) => option.value === gstValue) || '0'}
                        onChange={(e) => handleIGSTChange(e, reversedIndex)}
                        options={gstArray}
                      />
                    </SoftBox>
                  </Grid>
                  <div
                    key={reversedIndex}
                    onKeyDown={(e) => {
                      if (e.key === 'q') {
                        handleMoreDetails(reversedIndex);
                      }
                    }}
                  >
                    <SoftBox
                      mt={reversedIndex === 0 ? '10px' : '10px'}
                      width="20px"
                      height="40px"
                      style={{ cursor: 'pointer', marginLeft: '5px' }}
                      onClick={() => handleMoreDetails(reversedIndex)}
                      tabIndex={0}
                    >
                      <AddIcon fontSize="small" color="info" />
                    </SoftBox>
                  </div>
                  <SoftBox
                    mt={reversedIndex === 0 ? '10px' : '10px'}
                    width="20px"
                    height="40px"
                    style={{ cursor: 'pointer' }}
                  >
                    <CancelIcon onClick={() => handleDelete(reversedIndex)} fontSize="small" color="error" />
                  </SoftBox>

                  {/* OFFERS & PROMO */}
                  {(offerType[reversedIndex] === 'FREE PRODUCTS' || offerType[reversedIndex] === 'BUY X GET Y') &&
                    Array.from(
                      { length: inwardedQuantity[reversedIndex]?.length },
                      (_, i) => diffGetBarcodeNum[reversedIndex]?.length - i - 1,
                    ).map((_, index) => {
                      if (inwardedQuantity[reversedIndex]?.flat(Infinity)[index] !== '') {
                        return (
                          <SoftBox mt={1} key={index} style={{ minWidth: '900px' }}>
                            <Grid
                              container
                              spacing={1}
                              ml={0.5}
                              sx={{ justifyContent: 'space-between', alignItems: 'center' }}
                            >
                              <Grid item xs={0.7} sm={0.7} md={0.7} display={reversedIndex !== 0 ? 'flex' : ''}>
                                <SoftBox className="product-input-label" ml={3}>
                                  <Tooltip title={offerType[reversedIndex]}>
                                    <LocalOfferIcon color="success" />
                                  </Tooltip>
                                </SoftBox>
                              </Grid>
                              <Grid item xs={2} sm={2} md={2} ml={0.8}>
                                <SoftBox className="product-input-label" style={{ width: '100%' }}>
                                  <TextField
                                    value={
                                      offerType[reversedIndex] === 'BUY X GET Y'
                                        ? diffGetBarcodeNum[reversedIndex] &&
                                          diffGetBarcodeNum[reversedIndex]?.flat(Infinity)[index]
                                        : barcodeNum[reversedIndex]
                                    }
                                    readOnly={true}
                                    style={{
                                      width: '100%',
                                    }}
                                  />
                                </SoftBox>
                              </Grid>
                              <Grid item xs={2} sm={2} md={2}>
                                <SoftBox className="product-input-label" style={{ width: '100%' }}>
                                  <TextField
                                    value={
                                      offerType[reversedIndex] === 'BUY X GET Y'
                                        ? diffGetProductName[reversedIndex] &&
                                          diffGetProductName[reversedIndex]?.flat(Infinity)[index]
                                        : productName[reversedIndex]
                                    }
                                    readOnly={true}
                                    style={{
                                      width: '100%',
                                    }}
                                  />
                                </SoftBox>
                              </Grid>
                              <Grid item xs={0.8} sm={0.8} md={0.8}>
                                <SoftInput
                                  disabled
                                  value={
                                    offerType[reversedIndex] === 'BUY X GET Y' ||
                                    offerType[reversedIndex] === 'FREE PRODUCTS'
                                      ? inwardedQuantity[reversedIndex] &&
                                        inwardedQuantity[reversedIndex]?.flat(Infinity)[index]
                                      : diffGetQuantity[reversedIndex]
                                  }
                                />
                              </Grid>
                              <Grid item xs={1} sm={1} md={1}>
                                <SoftInput disabled value={0} />
                              </Grid>
                              <Grid item xs={1.2} sm={1.2} md={1.2} ml={-0.8}>
                                <SoftInput disabled value={0} />
                              </Grid>
                              <Grid item xs={0.8} sm={0.8} md={0.8}>
                                <SoftInput disabled value={0} />
                              </Grid>
                              <Grid item xs={0.8} sm={0.8} md={0.8}>
                                <SoftInput disabled value={0} />
                              </Grid>
                              <Grid item xs={1} sm={1} md={1}>
                                <SoftInput disabled value={0} />
                              </Grid>
                              <Grid item xs={0.8} sm={0.8} md={0.8}>
                                <SoftInput disabled value={0} />
                              </Grid>
                              <SoftBox
                                mt={reversedIndex === 0 ? '15px' : '15px'}
                                width="20px"
                                height="40px"
                                style={{ cursor: 'pointer', marginLeft: '15px' }}
                              ></SoftBox>
                              <SoftBox
                                mt={reversedIndex === 0 ? '15px' : '15px'}
                                width="20px"
                                height="40px"
                                style={{ cursor: 'pointer' }}
                              ></SoftBox>
                            </Grid>
                          </SoftBox>
                        );
                      }
                      return null;
                    })}
                </Grid>
              </SoftBox>
            );
          })}
        </SoftBox>
        {/* )} */}
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
        {vendorId === '' || invoiceRefNo === '' || invoiceValue === '' || invoiceDate === '' ? (
          <SoftTypography fontSize="small" style={{ color: 'red' }}>
            {' '}
            Enter all the mandatory fields{' '}
          </SoftTypography>
        ) : null}
        {openModal && (
          <CreateNewProduct
            openModal={openModal}
            setOpenModal={setOpenModal}
            prodName={prodName}
            barNum={barNum}
            selectProduct={selectProduct}
            currIndex={currIndex}
            quantity={quantity}
            purchasePrice={purchasePrice}
            totalPurchasePrice={totalPurchasePrice}
            sellingPrice={sellingPrice}
            setQuantity={setQuantity}
            setPurchasePrice={setPurchasePrice}
            setTotalPurchasePrice={setTotalPurchasePrice}
            setSellingPrice={setSellingPrice}
          />
        )}

        {openModal2 && (
          <AdditionalDetails
            openModal2={openModal2}
            setOpenModal2={setOpenModal2}
            detailIndex={detailIndex}
            masterSellingPrice={masterSellingPrice}
            setMasterSellingPrice={setMasterSellingPrice}
            sellingPrice={sellingPrice}
            setSellingPrice={setSellingPrice}
            setExpDate={setExpDate}
            expDate={expDate}
            quantityRejected={quantityRejected}
            setQuantityRejected={setQuantityRejected}
            invoiceRefNo={invoiceRefNo}
            invoiceValue={invoiceValue}
            invoiceDate={invoiceDate}
            vendorId={vendorId}
            setDiffBuyQuantity={setDiffBuyQuantity}
            setDiffGetBarcodeNum={setDiffGetBarcodeNum}
            setDiffGetProductName={setDiffGetProductName}
            setDiffGetQuantity={setDiffGetQuantity}
            diffBuyQuantity={diffBuyQuantity}
            diffGetBarcodeNum={diffGetBarcodeNum}
            diffGetProductName={diffGetProductName}
            diffGetQuantity={diffGetQuantity}
            barcodeNum={barcodeNum}
            productName={productName}
            mrp={mrp}
            purchasePrice={purchasePrice}
            quantity={quantity}
            itemListArray={itemListArray}
            setOfferId={setOfferId}
            offerId={offerId}
            setOffers={setOffers}
            offers={offers}
            setOfferType={setOfferType}
            offerType={offerType}
            setOfferSubType={setOfferSubType}
            offerSubType={offerSubType}
            setOfferDetailsId={setOfferDetailsId}
            offerDetailsId={offerDetailsId}
            setInwardedQuantity={setInwardedQuantity}
            inwardedQuantity={inwardedQuantity}
            setOfferDiscount={setOfferDiscount}
            offerDiscount={offerDiscount}
            setOfferDiscountType={setOfferDiscountType}
            offerDiscountType={offerDiscountType}
            count2={count2}
            setCount2={setCount2}
            fixedCount2={fixedCount2}
            setFixedCount2={setFixedCount2}
            changedIGST={changedIGST}
            setChangedIGST={setChangedIGST}
            changedCGST={changedCGST}
            setChangedCGST={setChangedCGST}
            changedSGST={changedSGST}
            setChangedSGST={setChangedSGST}
            isChangedIGST={isChangedIGST}
            setIsChangedIGST={setIsChangedIGST}
            isChangedCGST={isChangedCGST}
            setIsChangedCGST={setIsChangedCGST}
            isChangedSGST={isChangedSGST}
            setIsChangedSGST={setIsChangedSGST}
            batchno={batchno}
            setItemCess={setItemCess}
            itemCess={itemCess}
            setItemDiscount={setItemDiscount}
            itemDiscount={itemDiscount}
            setItemDiscountType={setItemDiscountType}
            itemDiscountType={itemDiscountType}
            handleBatchChange={handleBatchChange}
            previousPurchasePrice={previousPurchasePrice}
            setAddDraftProduct={setAddDraftProduct}
            getPreviousPurchsePrice={getPreviousPurchsePrice}
          />
        )}
      </SoftBox>
    </div>
  );
};

export default ProductAdd;
