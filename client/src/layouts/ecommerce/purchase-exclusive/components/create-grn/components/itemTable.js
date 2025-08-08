import { TextField } from '@mui/material';
import {
  addGlobalProduct,
  addGlobalProductV2,
  addProductInventory,
  getAllProductSuggestionV2,
  getInventoryDetails,
  getItemsInfo,
  spBasedONProductConfig,
} from '../../../../../../config/Services';
import { useDebounce } from 'usehooks-ts';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../../../../../hooks/SnackbarProvider';
import { v4 as uuidv4 } from 'uuid';
import AddIcon from '@mui/icons-material/Add';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import CancelIcon from '@mui/icons-material/Cancel';
import CreateNewDraftProduct from './createDraftProd';
import DeleteIcon from '@mui/icons-material/Delete';
import GRNAdditionalDetail from './additionalDetail';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import SoftBox from '../../../../../../components/SoftBox';
import SoftInput from '../../../../../../components/SoftInput';
import SoftSelect from '../../../../../../components/SoftSelect';
import SoftTypography from '../../../../../../components/SoftTypography';
import Swal from 'sweetalert2';
import Tooltip from '@mui/material/Tooltip';
import GRNSearchAndFilterComponent from './searchAndFilter';
import GRNFullScreenProduct from './fullScreenGRN';
import { preventArrowKeyChange, productIdByBarcode } from '../../../../Common/CommonFunction';
import Spinner from '../../../../../../components/Spinner';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import GRNDocumentAIModal from '../document-Ai-modal';

const filter = createFilterOptions();

const GrnItemTable = ({
  itemListArray,
  itemLoader,
  setItemLoader,
  vendorId,
  invoiceRefNo,
  invoiceValue,
  invoiceDate,
  assignedTo,
  grnPayload,
  handleAddProduct,
  handleAddEXPOProduct,
  rowData,
  setRowData,
  isItemChanged,
  setItemChanged,
  handleDltItem,
  inclusiveTax,
  totalRowsGRN,
  setTotalRowsGRN,
  tableRef,
  additionalList,
  setAdditionalList,
  isExtraField,
  setIsExtraField,
  productSelected,
  setProductSelected,
  titleSelected,
  setTitleSelected,
  searchItem,
  setSearchItem,
  filteredData,
  rowRefs,
  openFullScreen,
  toggleFullScreen,
  filters,
  filterValues,
  handleFilterChange,
  applyFilters,
  handleRemoveFilter,
  debounceItemsearch,
  searchItemLoader,
  setSearchItemLoader,
  removeSearchItemLoader,
  setRemoveSearchItemLoader,
  handleleRemoveSearch,
  total,
  totalStyle,
}) => {
  const epoNumber = localStorage.getItem('epoNumber');
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();
  const firstRowRef = useRef();
  const rowSelectRef = useRef([]);
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const contextType = localStorage.getItem('contextType');
  const user_details = JSON.parse(localStorage.getItem('user_details'));
  const uidx = user_details.uidx;
  const user_name = localStorage.getItem('userName');
  const [autocompleteTitleOptions, setAutocompleteTitleOptions] = useState([]);
  const [autocompleteBarcodeOptions, setAutocompleteBarcodeOptions] = useState([]);
  const [productNotFound, setProductNotFound] = useState({ index: 0, value: false });
  const [curentProductName, setCurentProductName] = useState('');
  const debounceProductName = useDebounce(curentProductName, 700);
  const [currIndex, setCurrIndex] = useState(0);
  const [prodName, setProdName] = useState('');
  const [barNum, setBarNum] = useState('');
  const [addIndex, setAddIndex] = useState(0);
  const [openAdditionModal, setOpenAdditionModal] = useState(false);
  const [inputIndex, setInputIndex] = useState('');
  const [valueChange, setValueChange] = useState('');
  const debounceInputIndex = useDebounce(valueChange, 700);
  const [openProdModal, setOpenProductModal] = useState(false);
  const [focusedRowIndex, setFocusedRowIndex] = useState(null);
  const [focusedBarcodeIndex, setFocusedBarcodeIndex] = useState(null);
  const [focusedTitleIndex, setFocusedTitleIndex] = useState(null);
  const expoItems = localStorage.getItem('expoItems') === 'true' ? true : false;
  const handleCloseProdModal = () => {
    setOpenProductModal(false);
  };

  const desciptionOption = [
    { value: 'Labour charges', label: 'Labour charges' },
    { value: 'Transport charges', label: 'Transport charges' },
  ];

  const filteredOptions = desciptionOption?.filter((option) => {
    return !additionalList?.some((item) => item?.description === option?.value);
  });

  useEffect(() => {
    if (itemListArray?.length > 0) {
      const updatedRow = itemListArray?.map((e) => {
        return {
          itemId: uuidv4(),
          id: e?.id || '',
          epoNumber: epoNumber || null,
          itemNo: e?.itemNo,
          itemName: e?.itemName,
          quantityOrdered: e?.quantityOrdered || 0,
          totalPP: inclusiveTax === 'true' ? e?.finalPrice : e?.taxableValue,
          purchasePrice: inclusiveTax === 'true' ? e?.purchasePrice : e?.exclusiveTaxPP,
          mrp: e?.unitPrice || 0,
          sellingPrice: e?.sellingPrice || 0,
          gst: e?.gst || 0,
          purchaseMargin:
            e?.unitPrice !== undefined &&
            e?.unitPrice !== '' &&
            e?.unitPrice !== '0' &&
            e?.unitPrice !== 0 &&
            e?.purchasePrice !== undefined &&
            e?.purchasePrice !== '' &&
            !isNaN(e?.unitPrice) &&
            !isNaN(e?.purchasePrice) &&
            isFinite(e?.unitPrice) &&
            isFinite(e?.purchasePrice)
              ? Math.abs((((e?.unitPrice - e?.purchasePrice) / e?.unitPrice) * 100).toFixed(1))
              : '0',
          specification: e?.specification || 0,
          masterSellingPrice: e?.masterSellingPrice || 'manual',
          offerPresent: e?.offers ? 'true' : 'false',
          offers: e?.offers || null,
          offerId: e?.offerId || '',
          batchNumber: e?.batchNumber || '',
          expiryDate: e?.expiryDate || '',
          cess: e?.cess || '',
          discount: e?.discount || '',
          discountType: e?.discountType || '',
        };
      });
      setRowData(updatedRow);
      setProductSelected(Array(updatedRow.length).fill(false));
      setTitleSelected(Array(updatedRow.length).fill(false));
    } else {
      setProductSelected(Array(rowData.length).fill(false));
      setTitleSelected(Array(rowData.length).fill(false));
    }
  }, [itemListArray]);

  useEffect(() => {
    if (debounceInputIndex !== '') {
      setValueChange('');
      setInputIndex('');
      handleSellingPrice(inputIndex);
    }
  }, [debounceInputIndex]);

  const handleChangeIO = (e, index) => {
    const value = e.target.value;
    if (value === '') {
      setFocusedTitleIndex(index);
      setFocusedBarcodeIndex(index);
      setProductNotFound({ index: index, value: false });
    } else {
      setCurentProductName(e.target.value);
      setCurrIndex(index);
      setFocusedTitleIndex(index);
      setFocusedBarcodeIndex(index);
    }
  };

  useEffect(() => {
    if (debounceProductName === '' || debounceProductName === undefined) return;

    const searchProduct = async () => {
      const searchText = debounceProductName;
      const isNumber = !isNaN(+searchText);

      const payload = {
        page: 1,
        pageSize: '10',
        query: searchText,
        // query: isNumber ? '' : searchText,
        // barcode: [],
        // storeLocationId: locId.toLocaleLowerCase(),
        storeLocations: [locId],
      };

      // Handle product name/barcode states
      if (isNumber) {
        setBarNum(searchText);
        setProdName('');
      } else {
        setBarNum('');
        setProdName(searchText);
      }

      // Proceed only if searchText length is 3 or more
      // if (searchText?.length < 3) return;

      try {
        const res = await getAllProductSuggestionV2(payload);
        if (res?.data?.status === 'ERROR') {
          showSnackbar(res?.data?.message, 'error');
          setCurentProductName('');
          return;
        }

        if (res?.data?.data?.es >= 1) {
          showSnackbar(res?.data?.data?.message, 'error');
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
        if (res?.data?.status === 'SUCCESS') {
          if (extractedVariants?.length === 0) {
            // handleSearchProductGlobally(isNumber, searchText);
            setCurentProductName('');
            setProductNotFound({
              index: currIndex,
              value: true,
            });
          } else {
            setProductNotFound({ index: currIndex, value: false });
            setFocusedBarcodeIndex(null);
            setFocusedTitleIndex(null);
            handleProductResponse(extractedVariants, isNumber);
            setCurentProductName('');
          }
        }
      } catch (err) {
        showSnackbar(err?.response?.data?.message, 'error');
        setCurentProductName('');
        setProductNotFound({ index: currIndex, value: false });
        setFocusedBarcodeIndex(null);
        setFocusedTitleIndex(null);
      }
    };

    searchProduct();
  }, [debounceProductName]);

  //Handle global product

  const handleSearchProductGlobally = async (isNumber, searchText) => {
    const payload = {
      page: 1,
      pageSize: '10',
      query: isNumber ? '' : searchText,
      barcode: isNumber ? [searchText] : [],
    };

    const globalRes = await getAllProductSuggestionV2(payload);
    const response = globalRes?.data?.data?.data?.data || [];
    const extractedVariants = response?.flatMap((product) =>
      product?.variants?.map((variant) => ({
        ...variant,
        gtin: variant?.barcodes[0] || null,
        productSource: product?.storeSpecificData,
        igst: product?.taxReference?.taxRate,
        cess: product?.taxReference?.metaData?.cess,
        weights_and_measures: {
          net_weight: variant?.weightsAndMeasures
            ? variant?.weightsAndMeasures?.find((ele) => ele.type === 'PRIMARY')?.grossWeight ||
              variant?.weightsAndMeasures[0]?.grossWeight
            : '',
          measurement_unit: variant?.weightsAndMeasures
            ? variant?.weightsAndMeasures?.find((ele) => ele.type === 'PRIMARY')?.measurementUnit ||
              variant?.weightsAndMeasures[0]?.measurementUnit
            : '',
        },
      })),
    );

    setCurentProductName('');
    if (extractedVariants?.length > 0) {
      setProductNotFound({ index: currIndex, value: false });
      handleProductResponse(extractedVariants, isNumber);
      setFocusedBarcodeIndex(null);
      setFocusedTitleIndex(null);
      return;
    }
    setProductNotFound({
      index: currIndex,
      value: true,
    });
  };
  // Handle Product Not Found
  const handleProductNotFound = async () => {
    // const newSwal = Swal.mixin({
    //   customClass: {
    //     cancelButton: 'logout-cancel-btn',
    //     confirmButton: 'logout-success-btn',
    //   },
    //   buttonsStyling: false,
    // });

    // newSwal
    //   .fire({
    //     title: 'Product not found',
    //     text: 'Do you want to create a new Product?',
    //     icon: 'info',
    //     showCancelButton: true,
    //     confirmButtonText: 'Confirm',
    //     reverseButtons: true,
    //   })
    //   .then((result) => {
    //     if (result.isConfirmed) {
    //       setOpenProductModal(true);
    //       updateSelection(true, false);
    //       setCurentProductName('');
    //     }
    //   });
    setOpenProductModal(true);
    updateSelection(true, false);
    setCurentProductName('');
    setFocusedBarcodeIndex(null);
    setFocusedTitleIndex(null);
    setProductNotFound({
      index: currIndex,
      value: false,
    });
  };

  // Handle Product Response
  const handleProductResponse = (response, isNumber) => {
    if (isNumber && response.length === 1) {
      selectProduct(response[0], currIndex);
      updateSelection(!isNumber, isNumber);
    } else {
      if (!isNumber) {
        setAutocompleteTitleOptions(response);
      } else {
        setAutocompleteBarcodeOptions(response);
      }
      updateSelection(!isNumber, isNumber);
    }
  };

  // Update title/product selection
  const updateSelection = (isTitleSelected, isProductSelected) => {
    setTitleSelected((prevState) => {
      const newState = [...prevState];
      newState[currIndex] = isTitleSelected;
      return newState;
    });

    setProductSelected((prevState) => {
      const newState = [...prevState];
      newState[currIndex] = isProductSelected;
      return newState;
    });
  };

  const selectProduct = async (item, index) => {
    setCurentProductName('');
    setAutocompleteTitleOptions([]);
    setAutocompleteBarcodeOptions([]);
    let result = true;
    if (item?.gtin !== undefined && item?.gtin !== '') {
      if (contextType === 'RETAIL' && item?.productSource?.storeLocationId !== locId) {
        result = await handleCreateGlobalProd(item, index);
        // return;
      }
      if (!result) {
        return;
      }
      const updatedProductName = [...rowData];
      updatedProductName[index]['itemName'] = item?.name;
      updatedProductName[index]['itemNo'] = item?.gtin;
      updatedProductName[index]['specification'] =
        item?.weights_and_measures?.net_weight + ' ' + item?.weights_and_measures?.measurement_unit;
      updatedProductName[index]['gst'] = Number(item?.igst);
      updatedProductName[index]['cessValue'] = Number(item?.cess);
      // updatedProductName[index]['mrp'] = item?.mrpData[0]?.mrp ?? 0;
      setRowData(updatedProductName);

      if (!epoNumber) {
        setTimeout(() => {
          handleAddProduct('');
        }, 1000);
      }
      focusQuantityInput(index);
      // handleSellingPrice(index);
      handleMrp(item?.gtin, index);
      setItemChanged(true);
    } else {
      const updatedProductName = [...rowData];
      updatedProductName[index]['itemName'] = '';
      updatedProductName[index]['itemNo'] = '';
      updatedProductName[index]['specification'] = '';
      updatedProductName[index]['gst'] = 0;
      updatedProductName[index]['cessValue'] = 0;
      updatedProductName[index]['mrp'] = 0;
      updatedProductName[index]['sellingPrice'] = 0;
      updatedProductName[index]['puchasePrice'] = 0;
      updatedProductName[index]['quantityOrdered'] = 0;
      updatedProductName[index]['totalPP'] = 0;
      setRowData(updatedProductName);

      setProductSelected((prevState) => {
        const newState = [...prevState];
        newState[index] = undefined;
        return newState;
      });

      setTitleSelected((prevState) => {
        const newState = [...prevState];
        newState[index] = undefined;
        return newState;
      });
    }
  };

  useEffect(() => {
    if (
      (vendorId !== '' ||
        invoiceRefNo !== '' ||
        invoiceValue !== '' ||
        invoiceDate !== '' ||
        assignedTo?.length >= 1) &&
      epoNumber === 'undefined'
    ) {
      firstRowRef.current?.focus();
    }
  }, [vendorId, invoiceRefNo, invoiceValue, invoiceDate, assignedTo, epoNumber]);

  // focusing on a specific row start
  const focusDefaultRow = (index) => {
    const selectedRow = document.getElementById(`selectedRow-${index}`);
    if (selectedRow) {
      selectedRow.focus();
      setFocusedRowIndex(index);
    }
  };

  useEffect(() => {
    let numberCombination = ''; // Variable to store the current number combination
    let debounceTimer; // Timer for debounce

    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && openAdditionModal) {
        handleCloseAddModal();
      }
      if (event.altKey) {
        // Reset number combination when Alt is pressed
        if (event.key === 'Alt') {
          numberCombination = '';
          return;
        }
        if (event.key?.toLowerCase() === 'm') {
          handleAddRow();
        }
        if (event.key?.toLowerCase() === 'n' && (focusedBarcodeIndex || focusedTitleIndex)) {
          handleProductNotFound(focusedBarcodeIndex || focusedTitleIndex);
        }
        // If a number key is pressed while Alt is active, append it to the combination
        if (event.key >= '0' && event.key <= '9') {
          numberCombination += event.key;
          clearTimeout(debounceTimer);

          // Set a new debounce timer
          debounceTimer = setTimeout(() => {
            if (numberCombination) {
              const index = parseInt(numberCombination) - 1; // Converting to zero-based index
              if (index >= 0 && index < rowData?.length) {
                focusDefaultRow(index);
              } else {
                showSnackbar(`No product found for S.No:- ${numberCombination}`, 'error');
              }
              numberCombination = '';
            }
          }, 500);
        }
        if (event.key?.toLowerCase() === 'a') {
          setTimeout(() => {
            // Use setState with a callback to get the latest focusedRowIndex
            setFocusedRowIndex((prevIndex) => {
              if (prevIndex !== null) {
                handleAdditional(prevIndex);
              }
              return prevIndex; // Return the current state to avoid resetting it
            });
          }, 700);
        }
        if (event.key?.toLowerCase() === 'r') {
          setTimeout(() => {
            // Use setState with a callback to get the latest focusedRowIndex
            setFocusedRowIndex((prevIndex) => {
              if (prevIndex !== null) {
                handleDltItem(rowData[prevIndex - 1], prevIndex - 1);
              }
              return prevIndex; // Return the current state to avoid resetting it
            });
          }, 700);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [rowData, focusedBarcodeIndex, focusedTitleIndex]);
  // focusing on a specific row end

  useEffect(() => {
    // Only scroll if either index is in focus
    if (focusedBarcodeIndex === currIndex || focusedTitleIndex === currIndex) {
      if (debounceProductName || productNotFound?.value) {
        const targetScrollPosition = 10050;

        if (tableRef.current) {
          const scrollStep = (targetScrollPosition - tableRef.current.scrollTop) / 20;
          let currentScrollPosition = tableRef.current.scrollTop;

          const animateScroll = () => {
            if (Math.abs(currentScrollPosition - targetScrollPosition) <= Math.abs(scrollStep)) {
              tableRef.current.scrollTop = targetScrollPosition;
            } else {
              tableRef.current.scrollTop += scrollStep;
              currentScrollPosition += scrollStep;
              requestAnimationFrame(animateScroll);
            }
          };

          animateScroll();
        }
      }
    }
  }, [focusedBarcodeIndex, focusedTitleIndex, debounceProductName, productNotFound]);

  function calculatePP(purchasePrice, gst, cess, disc, discType) {
    const price = Number(purchasePrice) || 0;
    const discount = discType === 'percentage' ? (Number(disc) / 100) * price : Number(disc);
    const gstValue = (Number(gst) / 100) * price;
    const cessValue = (Number(cess) / 100) * price;
    const finalValue = price + gstValue + cessValue - discount;

    return finalValue || 0;
  }

  const focusQuantityInput = (index) => {
    const quantityInput = document.getElementById(`quantityInput-${index}`);
    if (quantityInput) {
      quantityInput.focus();
    }
  };

  const handleMrp = async (gtin, index) => {
    const updatedData = [...rowData];
    try {
      const res = await getInventoryDetails(locId, gtin);
      let newMRp = 0;
      if (res?.data?.data?.es) {
        updatedData[index]['mrp'] = 0;
      } else {
        const response = res?.data?.data?.data?.multipleBatchCreations;
        if (response?.length > 0) {
          newMRp = response[0]?.mrp;
        }
        updatedData[index]['mrp'] = newMRp;
      }
      setRowData(updatedData);
      handleSellingPrice(index, newMRp);
    } catch (error) {
      updatedData[index]['mrp'] = 0;
      setRowData(updatedData);
      handleSellingPrice(index, 0);
    }
  };

  const handleSellingPrice = (index, newMrp) => {
    setInputIndex('');
    const newPP =
      inclusiveTax === 'false'
        ? calculatePP(
            rowData[index]?.purchasePrice || 0,
            rowData[index]?.gst || 0,
            rowData[index]?.cess || 0,
            rowData[index]?.discount || 0,
            rowData[index]?.discountType || '',
          )
        : rowData[index]?.purchasePrice;
    spBasedONProductConfig(
      locId,
      rowData[index]?.itemNo,
      rowData[index]?.purchasePrice !== '' && rowData[index]?.purchasePrice !== undefined ? Number(newPP) : 0,
      newMrp ? newMrp : rowData[index]?.mrp || 0,
    )
      .then((res) => {
        if (res?.data?.data?.es === 0) {
          const updatedData = [...rowData];
          updatedData[index]['sellingPrice'] = res?.data?.data?.data;
          updatedData[index]['masterSellingPrice'] = 'automatic';
          setRowData(updatedData);
        } else if (res?.data?.data?.es === 1) {
          const updatedData = [...rowData];
          updatedData[index]['masterSellingPrice'] = 'manual';
          setRowData(updatedData);
        }
      })
      .catch(() => {
        const updatedData = [...rowData];
        updatedData[index]['sellingPrice'] = '';
        setRowData(updatedData);
      });
  };

  const handleAddRow = () => {
    setSearchItem('');
    setCurentProductName('');
    setFocusedBarcodeIndex(null);
    setFocusedTitleIndex(null);
    const newRowData = [
      ...rowData,
      {
        epoNumber: epoNumber || null,
        itemId: uuidv4(),
        id: '',
        itemNo: '',
        itemName: '',
        quantityOrdered: '',
        totalPP: '',
        purchasePrice: '',
        mrp: 0,
        sellingPrice: 0,
        gst: 0,
        purchaseMargin: 0,
        specification: '',
        masterSellingPrice: 'automatic',
        offerPresent: 'false',
        offers: null,
        offerId: '',
        batchNumber: '',
        expiryDate: '',
        cess: '',
        discount: '',
        discountType: '',
      },
    ];
    setRowData(newRowData);
    counter++;
    const targetScrollPosition = 10050;

    if (tableRef.current) {
      const scrollStep = (targetScrollPosition - tableRef.current.scrollTop) / 20;
      let currentScrollPosition = tableRef.current.scrollTop;

      const animateScroll = () => {
        if (Math.abs(currentScrollPosition - targetScrollPosition) <= Math.abs(scrollStep)) {
          tableRef.current.scrollTop = targetScrollPosition;
        } else {
          tableRef.current.scrollTop += scrollStep;
          currentScrollPosition += scrollStep;
          requestAnimationFrame(animateScroll);
        }
      };

      animateScroll();
    }

    if (!epoNumber) {
      handleAddProduct('', newRowData);
      return;
    }
    if (isItemChanged || expoItems) {
      handleAddEXPOProduct(newRowData);
    }
    localStorage.setItem('expoItems', false);
  };

  useEffect(() => {
    handleAddRow();
  }, [expoItems]);

  const handleInputChange = (index, fieldName, value) => {
    if (fieldName === 'quantityOrdered') {
      const updatedData = [...rowData];
      updatedData[index][fieldName] = value;
      updatedData[index]['purchasePrice'] =
        parseFloat(rowData[index]?.totalPP / value).toFixed(3) !== 'NaN' ||
        parseFloat(rowData[index]?.totalPP / value).toFixed(3) !== 'Infinity'
          ? parseFloat(rowData[index]?.totalPP / value).toFixed(3)
          : '';
      setRowData(updatedData);
      setInputIndex(index);
      setValueChange(value);
    } else if (fieldName === 'totalPP') {
      const updatedData = [...rowData];
      updatedData[index][fieldName] = value;
      updatedData[index]['purchasePrice'] =
        parseFloat(value / rowData[index]?.quantityOrdered).toFixed(3) !== 'NaN' ||
        parseFloat(value / rowData[index]?.quantityOrdered).toFixed(3) !== 'Infinity'
          ? parseFloat(value / rowData[index]?.quantityOrdered).toFixed(3)
          : '';
      setRowData(updatedData);
      setInputIndex(index);
      setValueChange(value);
    } else if (fieldName === 'sellingPrice') {
      const updatedData = [...rowData];
      updatedData[index][fieldName] = value;
      updatedData[index]['masterSellingPrice'] = 'manual';
      setRowData(updatedData);
      if (value <= 0 || value === '') {
        showSnackbar('Enter a valid selling price', 'error');
      }

      setInputIndex(index);
      // setValueChange(value);
    } else if (fieldName === 'gst') {
      const updatedData = [...rowData];
      updatedData[index]['gst'] = value;
      setRowData(updatedData);

      setInputIndex(index);
      setValueChange(value);
    } else if (fieldName === 'mrp') {
      const updatedRowData = [...rowData];
      updatedRowData[index]['mrp'] = value;
      setRowData(updatedRowData);
      setInputIndex(index);
      setValueChange(value);
    } else if (fieldName === 'offerPresent') {
      const updatedRowData = [...rowData];
      updatedRowData[index][fieldName] = value;
      if (value === 'true') {
        const newObj = {
          buyQuantity: 1,
          createdBy: uidx,
          locationId: locId,
          mainGtin: rowData[index]?.itemNo,
          offerId: rowData[index]?.offerId || null,
          orgId: orgId,
          offerName: '',
          offerSubType: null,
          offerType: '',
        };
        updatedRowData[index]['offers'] = newObj;
      } else {
        updatedRowData[index]['offers'] = null;
        updatedRowData[index]['offerType'] = null;
        updatedRowData[index]['offerName'] = null;
        updatedRowData[index]['offerId'] = null;
      }
      setRowData(updatedRowData);
    } else {
      const updatedRowData = [...rowData];
      updatedRowData[index][fieldName] = value;
      setRowData(updatedRowData);
    }
    setItemChanged(true);
  };

  const handleAdditional = (index) => {
    // if (
    //   vendorId === '' || invoiceRefNo === '' || invoiceValue === '' || invoiceDate === '' || assignedTo?.length < 1
    //     ? true
    //     : false
    // ) {
    //   return;
    // }
    setAddIndex(index);
    setOpenAdditionModal(true);
  };

  const handleCloseAddModal = () => {
    setOpenAdditionModal(false);
    setAddIndex(0);
  };

  const handleCreateGlobalProd = async (item, index) => {
    try {
      const globalPayload = {
        destinationStoreOrgId: orgId,
        destinationStoreId: locId,
        gtin: item?.gtin || '',
        updatedBy: uidx,
        updatedByName: user_name,
      };

      // Call addGlobalProduct and wait for its completion
      const globalRes = await addGlobalProductV2(globalPayload);
      if (globalRes?.data?.status === 'ERROR') {
        showSnackbar(globalRes?.data?.message, 'error');
        return false;
      }
      if (globalRes?.data?.data?.es >= 1) {
        showSnackbar(globalRes?.data?.data?.message, 'error');
        return false;
      }
      const gtinPayload = {
        page: 1,
        pageSize: '10',
        // barcode: [item?.gtin],
        query: item?.gtin,
        // storeLocationId: locId.toLocaleLowerCase(),
        storeLocations: [locId],
      };

      const itemRes = await getAllProductSuggestionV2(gtinPayload);
      if (itemRes?.data?.data?.data?.data?.length > 0) {
        const response = itemRes?.data?.data?.data?.data[0];
        const { variants, weightsAndMeasures, ...responseWithoutVariants } = response || {};
        const productFound = {
          ...responseWithoutVariants,
          ...variants?.find((ele) => ele?.barcodes[0] === item?.gtin),
        };
        const extractedVariants = {
          ...productFound,
          gtin: productFound?.barcodes[0] || null,
          productSource: productFound?.storeSpecificData,
          igst: productFound?.taxReference?.taxRate,
          cess: productFound?.taxReference?.metaData?.cess,
          weights_and_measures: {
            net_weight: productFound?.weightsAndMeasures
              ? productFound?.weightsAndMeasures?.find((ele) => ele?.type === 'PRIMARY')?.grossWeight ||
                productFound?.weightsAndMeasures[0]?.grossWeight
              : '',
            measurement_unit: productFound?.weightsAndMeasures
              ? productFound?.weightsAndMeasures?.find((ele) => ele?.type === 'PRIMARY')?.measurementUnit ||
                productFound?.weightsAndMeasures[0]?.measurementUnit
              : '',
          },
        };
        const payloaddata = {
          productId: item?.gtin,
          locationId: locId,
          unitType: extractedVariants?.weights_and_measures?.measurement_unit,
          continueSelling: 'Y',
          threshHold: 99999,
          overSold: 0,
          createdBy: user_name,
          sourceId: locId,
          sourceName: null,
          category: extractedVariants?.appCategories?.categoryLevel1,
          subCategory: extractedVariants?.appCategories?.categoryLevel1,
          openingStock: 0,
          specification: extractedVariants?.weights_and_measures?.measurement_unit,
          reorderPoint: '',
          gtin: item?.gtin,
          status: null,
          orgId: orgId,
          reorderQuantity: 0,
          reorderQuantityType: 'each',
          comparePrice: 'N',
          minimumOrderQuantity: ' ',
          minimumOrderQuantityUnit: 'each',
          brand: extractedVariants?.companyDetail?.brand,
          locationType: contextType,
          itemName: extractedVariants?.name,
          multipleBatchCreations: [],
          skuid: item?.gtin,
          marginValue: null,
          openingStock: 0,
          marginType: '%',
          marginBasedOn: 'MRP',
        };

        if (extractedVariants?.needsWeighingScaleIntegration) {
          payloaddata.sellingUnit = extractedVariants?.sellingUnit;
          payloaddata.packagingType = 'weighingScale';
        } else {
          payloaddata.packagingType = 'standard';
        }

        const invenRes = await addProductInventory(payloaddata);
        // if (invenRes?.data?.data?.es === 0) {
        //   selectProduct(response, index);
        // }
        return true;
      }
      return true;
    } catch (error) {
      showSnackbar('Unable to create product', 'error');
      return true;
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

  let counter = 0;
  let totalCounter = 0;

  const totalRows = () => {
    rowData?.forEach((item) => {
      if (item?.purchasePrice !== 0) {
        totalCounter++;
      }
    });
    return totalCounter;
  };
  const countNonNullIds = rowData?.filter(
    (item) => item.id !== null && item.id !== '' && item.purchasePrice !== 0,
  ).length;

  useEffect(() => {
    const total = totalRows();
    setTotalRowsGRN(total);
  }, [rowData]);

  const handleAdditionalChargeList = () => {
    const newRowData = [
      ...additionalList,
      {
        chargeId: null,
        epoNumber: epoNumber,
        description: '',
        unitPrice: 0,
        quantity: 0,
        tax: 0,
        taxValue: 0,
        amount: 0,
        poNumber: null,
      },
    ];
    setAdditionalList(newRowData);
  };

  const handleAddtionalDlt = (index) => {
    const updateDetails = [...additionalList];
    updateDetails.splice(index, 1);
    setAdditionalList(updateDetails);
  };

  const handleAdditonalInput = (index, fieldName, value) => {
    const updateDetails = [...additionalList];
    updateDetails[index][fieldName] = value;
    setAdditionalList(updateDetails);
  };

  const handleProductNavigation = async (barcode) => {
    try {
      const productId = await productIdByBarcode(barcode);
      if (productId) {
        return `/products/product/details/${productId}`;
      }
    } catch (error) {
      return null;
    }
  };

  const handleNavigate = async (gtin) => {
    try {
      const url = await handleProductNavigation(gtin);
      if (url) {
        window.open(url, '_blank');
      }
    } catch (error) {}
  };

  return (
    <div>
      {/* <div>
        <SoftTypography variant="h6">
          Enter items you wish to purchase <b>{countNonNullIds > 1 && `(Total items added: ${countNonNullIds})`} </b>
        </SoftTypography>
        {itemLoader && <Spinner size={20} />}
      </div> */}
      {openFullScreen ? (
        <GRNFullScreenProduct
          rowData={rowData}
          setRowData={setRowData}
          setItemChanged={setItemChanged}
          openFullScreen={openFullScreen}
          toggleFullScreen={toggleFullScreen}
          tableRef={tableRef}
          vendorId={vendorId}
          invoiceRefNo={invoiceRefNo}
          invoiceValue={invoiceValue}
          invoiceDate={invoiceDate}
          assignedTo={assignedTo}
          productSelected={productSelected}
          titleSelected={titleSelected}
          setFocusedRowIndex={setFocusedRowIndex}
          counter={counter}
          handleNavigate={handleNavigate}
          autocompleteBarcodeOptions={autocompleteBarcodeOptions}
          autocompleteTitleOptions={autocompleteTitleOptions}
          selectProduct={selectProduct}
          handleChangeIO={handleChangeIO}
          handleInputChange={handleInputChange}
          handleAdditional={handleAdditional}
          handleDltItem={handleDltItem}
          gstArray={gstArray}
          filters={filters}
          filterValues={filterValues}
          handleFilterChange={handleFilterChange}
          applyFilters={applyFilters}
          handleRemoveFilter={handleRemoveFilter}
          debounceItemsearch={debounceItemsearch}
          filteredData={filteredData}
          totalRowsGRN={totalRowsGRN}
          itemLoader={itemLoader}
          searchItemLoader={searchItemLoader}
          setSearchItemLoader={setSearchItemLoader}
          removeSearchItemLoader={removeSearchItemLoader}
          searchItem={searchItem}
          setSearchItem={setSearchItem}
          setRemoveSearchItemLoader={setRemoveSearchItemLoader}
          handleleRemoveSearch={handleleRemoveSearch}
          handleAddRow={handleAddRow}
          total={total}
          totalStyle={totalStyle}
          handleAddEXPOProduct={handleAddEXPOProduct}
          isItemChanged={isItemChanged}
          firstRowRef={firstRowRef}
          epoNumber={epoNumber}
          focusedBarcodeIndex={focusedBarcodeIndex}
          focusedTitleIndex={focusedTitleIndex}
          debounceProductName={debounceProductName}
          productNotFound={productNotFound}
          handleProductNotFound={handleProductNotFound}
        />
      ) : filteredData?.length > 0 ? (
        <GRNSearchAndFilterComponent
          tableRef={tableRef}
          rowData={rowData}
          counter={counter}
          handleInputChange={handleInputChange}
          handleAdditional={handleAdditional}
          handleDltItem={handleDltItem}
          filteredData={filteredData}
          gstArray={gstArray}
          openFullScreen={openFullScreen}
          vendorId={vendorId}
          invoiceRefNo={invoiceRefNo}
          invoiceValue={invoiceValue}
          invoiceDate={invoiceDate}
          assignedTo={assignedTo}
          setFocusedRowIndex={setFocusedRowIndex}
          handleNavigate={handleNavigate}
        />
      ) : (
        !itemLoader &&
        rowData?.length > 0 && (
          <SoftBox
            style={{ height: rowData?.length > 10 ? '500px' : 'auto', overflowX: 'scroll', overflowY: 'hidden' }}
          >
            <div
              ref={tableRef}
              style={{
                overflowX: 'scroll',
                overflowY: 'scroll',
                minWidth: '1047px',
                maxHeight: rowData?.length > 10 ? '500px' : 'auto',
                marginTop: '-13px',
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

                    {epoNumber ? (
                      <th className="express-grn-columns grn-background-color"></th>
                    ) : (
                      !vendorId ||
                      !invoiceRefNo ||
                      !invoiceValue ||
                      !invoiceDate ||
                      (!(assignedTo?.length > 0) ? null : (
                        <th className="express-grn-columns grn-background-color"></th>
                      ))
                    )}
                  </tr>
                </thead>
                <tbody id="table-body">
                  {rowData?.map((row, index) => {
                    const isBarcodeSelected = productSelected[index];
                    const isTitleSelect = titleSelected[index];
                    const purchaseMargin =
                      row?.mrp !== undefined &&
                      row?.mrp !== '' &&
                      row?.mrp !== 0 &&
                      row?.purchasePrice !== 0 &&
                      row?.purchasePrice !== undefined &&
                      row?.purchasePrice !== '' &&
                      !isNaN(row?.mrp) &&
                      !isNaN(row?.purchasePrice) &&
                      isFinite(row?.mrp) &&
                      isFinite(row?.purchasePrice)
                        ? Math.abs((((row?.mrp - row?.purchasePrice) / row?.mrp) * 100).toFixed(1))
                        : 0;

                    const isProductSaved = row?.id === '';
                    const newPurchseprice =
                      row?.purchasePrice >= 0 && row?.purchasePrice !== ''
                        ? Math.round(Number(row?.purchasePrice) * 1000) / 1000
                        : '';
                    const isGreater = newPurchseprice > Number(row?.mrp);
                    if (
                      row?.purchasePrice !== 0 ||
                      row?.purchasePrice === '0.000' ||
                      row?.purchasePrice === '' ||
                      row?.purchasePrice === 'NaN'
                    ) {
                      counter++;
                    }
                    const newSellingPrice =
                      row?.sellingPrice !== 'NaN' && row?.sellingPrice !== undefined && row?.sellingPrice !== ''
                        ? row?.sellingPrice
                        : '';
                    const additionalRows = [];
                    if (row?.offers && row?.offers?.offerType !== 'OFFER ON MRP' && row?.offers?.offerDetailsList) {
                      row?.offers?.offerDetailsList?.forEach((offer, idx) => {
                        if (offer?.inwardedQuantity !== null && offer?.inwardedQuantity !== undefined) {
                          additionalRows.push(
                            <tr key={`${row?.itemId}-additional-${idx}`}>
                              <td className="express-grn-rows">
                                <Tooltip title={row?.offerType || 'FREE PRODUCTS'}>
                                  <SoftBox className="express-grn-offer-icon">
                                    <LocalOfferIcon color="success" />
                                  </SoftBox>
                                </Tooltip>
                              </td>

                              <td className="express-grn-rows">
                                <SoftBox className="express-grn-product-box">
                                  <TextField value={offer?.gtin} readOnly={true} style={{ width: '100%' }} />
                                </SoftBox>
                              </td>
                              <td className="express-grn-rows">
                                <SoftBox className="express-grn-product-box">
                                  <TextField value={offer?.itemName} readOnly={true} style={{ width: '100%' }} />
                                </SoftBox>
                              </td>
                              <td className="express-grn-rows">
                                <SoftInput
                                  value={offer?.inwardedQuantity}
                                  disabled
                                  className="product-aligning"
                                  type="number"
                                />
                              </td>
                              <td className="express-grn-rows">
                                <SoftInput value={0} disabled className="product-aligning" type="number" />
                              </td>
                              <td className="express-grn-rows">
                                <SoftInput value={0} disabled className="product-aligning" type="number" />
                              </td>
                              <td className="express-grn-rows">
                                <SoftInput value={0} disabled className="product-aligning" type="number" />
                              </td>
                              <td className="express-grn-rows">
                                <SoftInput value={0} disabled className="product-aligning" type="number" />
                              </td>
                              <td className="express-grn-rows">
                                <SoftInput value={0} disabled className="product-aligning" type="number" />
                              </td>
                              <td className="express-grn-rows">
                                <SoftInput value={0} disabled />
                              </td>
                              <td className="express-grn-rows"> </td>
                              {/* Add other columns if needed */}
                            </tr>,
                          );
                        }
                      });
                    }

                    let completedRow = ['itemNo', 'batchNumber', 'expiryDate', 'id', 'itemName'].every(
                      (key) => row[key] !== '',
                    );
                    let notEditable =
                      vendorId === '' ||
                      invoiceRefNo === '' ||
                      invoiceValue === '' ||
                      invoiceDate === '' ||
                      assignedTo?.length < 1
                        ? true
                        : false;
                    return (
                      <>
                        <tr
                          key={row?.itemId}
                          // ref={(el) => (rowSelectRef.current[index] = el)} // Store the ref for each row
                          // tabIndex="-1"
                        >
                          <td className="express-grn-rows">
                            <span
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                fontSize: '0.85rem',
                              }}
                            >
                              <span
                                style={{
                                  whiteSpace: 'nowrap',
                                  maxWidth: '200px',
                                  overflow: 'hidden',
                                  cursor: 'pointer',
                                  marginTop: '0.75rem',
                                }}
                              ></span>
                              {row?.itemNo !== '' &&
                              (row?.offerType ||
                                row?.purchasePrice === 0 ||
                                row?.purchasePrice === '0.000' ||
                                row?.purchasePrice === '' ||
                                row?.purchasePrice === 'NaN') ? (
                                <Tooltip title={row?.offerType || 'FREE PRODUCTS'}>
                                  <SoftBox className="express-grn-offer-icon">
                                    <LocalOfferIcon color="success" />
                                  </SoftBox>
                                </Tooltip>
                              ) : isProductSaved ? (
                                <Tooltip title="Product is not saved, please enter a valid product or enter all the required values">
                                  <SoftBox className="grn-body-row-boxes">
                                    <SoftInput
                                      id={`selectedRow-${index}`}
                                      value={counter}
                                      readOnly={true}
                                      type="number"
                                      className="product-not-added product-aligning"
                                      onFocus={() => setFocusedRowIndex(index)}
                                    />
                                  </SoftBox>
                                </Tooltip>
                              ) : completedRow ? (
                                <Tooltip title={'Product data completed'}>
                                  <SoftBox className="grn-body-row-boxes">
                                    <SoftInput
                                      id={`selectedRow-${index}`}
                                      value={counter}
                                      readOnly={true}
                                      type="number"
                                      className="product-aligning"
                                      sx={{
                                        '&.MuiInputBase-root': {
                                          backgroundColor: 'green !important',
                                          color: '#fff !important',
                                        },
                                      }}
                                      onFocus={() => setFocusedRowIndex(index)}
                                    />
                                  </SoftBox>
                                </Tooltip>
                              ) : (
                                <SoftBox className="grn-body-row-boxes">
                                  <SoftInput
                                    id={`selectedRow-${index}`}
                                    value={counter}
                                    readOnly={true}
                                    type="number"
                                    className="product-aligning"
                                    onFocus={() => setFocusedRowIndex(index)}
                                  />
                                </SoftBox>
                              )}
                            </span>
                          </td>
                          <td className="express-grn-rows">
                            <SoftBox className="express-grn-product-box">
                              {isBarcodeSelected === false && row?.itemNo !== '' ? (
                                <TextField
                                  value={row?.itemNo}
                                  readOnly={true}
                                  style={{ width: '100%' }}
                                  onClick={() => {
                                    row.itemNo ? handleNavigate(row.itemNo) : null;
                                  }}
                                />
                              ) : row?.id !== '' && row?.itemNo !== '' ? (
                                <TextField
                                  value={row.itemNo}
                                  readOnly={true}
                                  style={{ width: '100%' }}
                                  onClick={() => {
                                    row.itemNo ? handleNavigate(row.itemNo) : null;
                                  }}
                                />
                              ) : (
                                <Autocomplete
                                  disabled={notEditable}
                                  freeSolo
                                  options={autocompleteBarcodeOptions}
                                  getOptionLabel={(option) => option.gtin}
                                  onChange={(e, newValue) => {
                                    selectProduct(newValue, index);
                                  }}
                                  onInputChange={(e, newInputValue) => {
                                    handleChangeIO({ target: { value: newInputValue } }, index);
                                  }}
                                  style={{ width: '100%' }}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      inputRef={firstRowRef}
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
                                      onFocus={() => setFocusedBarcodeIndex(index)}
                                    />
                                  )}
                                />
                              )}
                            </SoftBox>
                          </td>
                          <td className="express-grn-rows">
                            <SoftBox className="express-grn-product-box">
                              {isTitleSelect === true && row?.itemName !== '' ? (
                                <TextField
                                  value={row.itemName}
                                  readOnly={true}
                                  style={{ width: '100%' }}
                                  onFocus={() => setFocusedRowIndex(index)}
                                />
                              ) : row.id !== '' ? (
                                <TextField
                                  value={row.itemName}
                                  readOnly={true}
                                  style={{ width: '100%' }}
                                  onFocus={() => setFocusedRowIndex(index)}
                                />
                              ) : isBarcodeSelected === true && row.itemName !== '' ? (
                                <TextField value={row.itemName} readOnly={true} style={{ width: '100%' }} />
                              ) : (
                                <Autocomplete
                                  disabled={notEditable}
                                  freeSolo
                                  options={autocompleteTitleOptions}
                                  getOptionLabel={(option) => option.name}
                                  onChange={(e, newValue) => {
                                    selectProduct(newValue, index);
                                  }}
                                  onInputChange={(e, newInputValue) => {
                                    handleChangeIO({ target: { value: newInputValue } }, index);
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
                                      style={{ width: '100%' }}
                                      onFocus={() => setFocusedTitleIndex(index)}
                                    />
                                  )}
                                />
                              )}
                            </SoftBox>
                          </td>
                          <td className="express-grn-rows">
                            <SoftBox className="grn-body-row-boxes-1">
                              <SoftInput
                                id={`quantityInput-${index}`}
                                value={row.quantityOrdered}
                                type="number"
                                onChange={(e) => handleInputChange(index, 'quantityOrdered', e.target.value)}
                                className="product-aligning"
                                disabled={notEditable}
                                onFocus={() => setFocusedRowIndex(index)}
                                onKeyDown={preventArrowKeyChange}
                              />
                            </SoftBox>
                          </td>
                          <td className="express-grn-rows">
                            <SoftBox className="grn-body-row-boxes-1">
                              <SoftInput
                                value={row.totalPP}
                                type="number"
                                onChange={(e) => handleInputChange(index, 'totalPP', e.target.value)}
                                className="product-aligning"
                                disabled={notEditable}
                                onFocus={() => setFocusedRowIndex(index)}
                                onKeyDown={preventArrowKeyChange}
                              />
                            </SoftBox>
                          </td>
                          <td className="express-grn-rows">
                            {isGreater ? (
                              <Tooltip title="Price/unit is greater than MRP">
                                <SoftBox className="grn-body-row-boxes-1">
                                  <SoftInput
                                    type="number"
                                    value={newPurchseprice || 0}
                                    disabled
                                    className="product-not-added product-aligning"
                                    onFocus={() => setFocusedRowIndex(index)}
                                    onKeyDown={preventArrowKeyChange}
                                  />
                                </SoftBox>
                              </Tooltip>
                            ) : (
                              <SoftBox className="grn-body-row-boxes-1">
                                <SoftInput
                                  type="number"
                                  className="product-aligning"
                                  value={newPurchseprice || 0}
                                  disabled
                                  onFocus={() => setFocusedRowIndex(index)}
                                  onKeyDown={preventArrowKeyChange}
                                />
                              </SoftBox>
                            )}
                          </td>
                          <td className="express-grn-rows">
                            <SoftBox className="grn-body-row-boxes-1">
                              <SoftInput
                                value={row.mrp}
                                type="number"
                                onChange={(e) => handleInputChange(index, 'mrp', e.target.value)}
                                className="product-aligning"
                                disabled={notEditable}
                                onFocus={() => setFocusedRowIndex(index)}
                                onKeyDown={preventArrowKeyChange}
                              />
                            </SoftBox>
                          </td>
                          <td className="express-grn-rows">
                            <SoftBox className="grn-body-row-boxes-1">
                              {newSellingPrice < newPurchseprice && row?.masterSellingPrice === 'manual' ? (
                                <Tooltip title="S Price is less than the Purchase Price">
                                  <SoftInput
                                    type="number"
                                    className="product-aligning product-not-added"
                                    disabled={row?.masterSellingPrice === 'manual' && !notEditable ? false : true}
                                    value={newSellingPrice}
                                    onKeyDown={(e) => {
                                      if (e.key === '-') {
                                        showSnackbar('Enter a valid  selling price', 'error');
                                        e.preventDefault();
                                      }
                                      preventArrowKeyChange(e);
                                    }}
                                    onChange={(e) => handleInputChange(index, 'sellingPrice', e.target.value)}
                                    onFocus={() => setFocusedRowIndex(index)}
                                  />
                                </Tooltip>
                              ) : (
                                <SoftInput
                                  type="number"
                                  className="product-aligning"
                                  disabled={row?.masterSellingPrice === 'manual' && !notEditable ? false : true}
                                  value={newSellingPrice}
                                  onKeyDown={(e) => {
                                    if (e.key === '-') {
                                      showSnackbar('Enter a valid  selling price', 'error');
                                      e.preventDefault();
                                    }
                                    preventArrowKeyChange(e);
                                  }}
                                  onChange={(e) => handleInputChange(index, 'sellingPrice', e.target.value)}
                                  onFocus={() => setFocusedRowIndex(index)}
                                />
                              )}
                            </SoftBox>
                          </td>
                          <td className="express-grn-rows">
                            <SoftBox className="grn-body-row-boxes-1">
                              <SoftInput
                                value={purchaseMargin}
                                className="product-aligning"
                                type="number"
                                disabled
                                onFocus={() => setFocusedRowIndex(index)}
                                onKeyDown={preventArrowKeyChange}
                              />
                            </SoftBox>
                          </td>
                          <td className="express-grn-rows">
                            <SoftBox className="grn-body-row-boxes-1">
                              <SoftSelect
                                menuPortalTarget={document.body}
                                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                                value={gstArray.find((option) => option.value == row?.gst) || 0}
                                onChange={(e) => handleInputChange(index, 'gst', e.value)}
                                options={gstArray}
                                isDisabled={notEditable}
                                onFocus={() => setFocusedRowIndex(index)}
                              />
                            </SoftBox>
                          </td>
                          {epoNumber ? (
                            <td className="express-grn-rows">
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                }}
                              >
                                <div key={index}>
                                  <AddIcon
                                    color="info"
                                    style={{ cursor: 'pointer', fontSize: '20px' }}
                                    onClick={() => handleAdditional(index)}
                                  />
                                </div>

                                <CancelIcon
                                  color="error"
                                  style={{ cursor: 'pointer', fontSize: '20px' }}
                                  onClick={() => handleDltItem(row, index)}
                                />
                              </div>
                            </td>
                          ) : (
                            !vendorId ||
                            !invoiceRefNo ||
                            !invoiceValue ||
                            !invoiceDate ||
                            (!(assignedTo?.length > 0) ? null : (
                              <td className="express-grn-rows">
                                <div
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                  }}
                                >
                                  <div key={index}>
                                    <AddIcon
                                      color="info"
                                      style={{ cursor: 'pointer', fontSize: '20px' }}
                                      onClick={() => handleAdditional(index)}
                                    />
                                  </div>

                                  <CancelIcon
                                    color="error"
                                    style={{ cursor: 'pointer', fontSize: '20px' }}
                                    onClick={() => handleDltItem(row, index)}
                                  />
                                </div>
                              </td>
                            ))
                          )}
                        </tr>
                        {(focusedBarcodeIndex === index || focusedTitleIndex === index) &&
                          (debounceProductName?.length > 3 ? (
                            <tr className="loading-row">
                              <td colSpan={11}>
                                <div className="debounceProduct_loader_box">
                                  <div>
                                    Searching <span style={{ fontWeight: 'bold' }}> {debounceProductName}</span>
                                  </div>
                                  <Spinner size="20px" />
                                </div>
                              </td>
                            </tr>
                          ) : productNotFound?.index === index && productNotFound?.value ? (
                            <tr className="loading-row">
                              <td colSpan={11}>
                                <div className="debounceProduct_loader_box">
                                  <div>Product not found</div>
                                  <AddCircleOutlineOutlinedIcon
                                    fontSize="20px"
                                    color="info"
                                    onClick={() => handleProductNotFound(focusedBarcodeIndex || focusedTitleIndex)}
                                  />
                                </div>
                              </td>
                            </tr>
                          ) : null)}
                        {additionalRows}
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </SoftBox>
        )
      )}

      {!vendorId || !invoiceRefNo || !invoiceValue || !invoiceDate || !(assignedTo?.length > 0) ? (
        <SoftTypography fontSize="small" style={{ color: 'red' }}>
          {' '}
          Enter all the mandatory fields{' '}
        </SoftTypography>
      ) : (
        <SoftTypography
          className="add-more-text"
          component="label"
          variant="caption"
          fontWeight="bold"
          onClick={handleAddRow}
          style={{ cursor: 'pointer' }}
        >
          + Add More Items
        </SoftTypography>
      )}
      {epoNumber && (
        <>
          {/* <SoftBox display="flex" mt={1} mb={1} alignItems="center">
            <Checkbox checked={isExtraField} onClick={() => setIsExtraField(!isExtraField)} />
            <SoftTypography component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
              + Add extra details
            </SoftTypography>
          </SoftBox> */}
          {isExtraField && (
            <SoftBox mt={1}>
              <SoftBox display="flex" gap="30px" justifyContent="space-between">
                <SoftTypography variant="h6">Select additonal details</SoftTypography>
              </SoftBox>
              <table>
                <thead>
                  <tr>
                    <th className="additional-details-header">S.No</th>
                    <th className="additional-details-header">Description</th>
                    <th className="additional-details-header">Unit Price</th>
                    <th className="additional-details-header">Quantity</th>
                    <th className="additional-details-header">Tax</th>
                    <th className="additional-details-header">Amount</th>
                    <th className="additional-details-header">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {additionalList?.map((item, index) => {
                    return (
                      <tr>
                        <td className="express-grn-rows">
                          <SoftBox>
                            <SoftInput value={index + 1} type="number" className="product-aligning" />
                          </SoftBox>
                        </td>
                        <td className="express-grn-rows">
                          <SoftBox>
                            {/* <SoftSelect
                              menuPortalTarget={document.body}
                              styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                              value={desciptionOption.find((option) => option.value === item?.description) || ''}
                              options={filteredOptions}
                              onChange={(option) => handleAdditonalInput(index, 'description', option.value)}
                            /> */}
                            <Autocomplete
                              value={item?.description}
                              onChange={(event, newValue) => {
                                if (newValue && newValue.inputValue) {
                                  handleAdditonalInput(index, 'description', newValue.inputValue);
                                } else {
                                  handleAdditonalInput(index, 'description', newValue);
                                }
                              }}
                              options={filteredOptions.map((option) => option.value)}
                              filterOptions={(options, params) => {
                                const filtered = filter(options, params);

                                const { inputValue } = params;
                                const isExisting = options?.some((option) => inputValue === option.label);
                                if (inputValue !== '' && !isExisting) {
                                  filtered.unshift({
                                    inputValue,
                                    label: `Add "${inputValue}"`,
                                  });
                                }

                                return filtered;
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  placeholder="Enter product description"
                                  style={{ width: '100%' }}
                                  fullWidth
                                />
                              )}
                              freeSolo
                            />
                          </SoftBox>
                        </td>
                        <td className="express-grn-rows">
                          <SoftBox>
                            <SoftInput
                              value={item?.unitPrice}
                              type="number"
                              className="product-aligning"
                              onChange={(e) => handleAdditonalInput(index, 'unitPrice', e.target.value)}
                              onKeyDown={preventArrowKeyChange}
                            />
                          </SoftBox>
                        </td>
                        <td className="express-grn-rows">
                          <SoftBox>
                            <SoftInput
                              value={item?.quantity}
                              type="number"
                              className="product-aligning"
                              onChange={(e) => handleAdditonalInput(index, 'quantity', e.target.value)}
                              onKeyDown={preventArrowKeyChange}
                            />
                          </SoftBox>
                        </td>
                        <td className="express-grn-rows">
                          <SoftBox>
                            <SoftInput
                              value={item?.tax}
                              type="number"
                              className="product-aligning"
                              onChange={(e) => handleAdditonalInput(index, 'tax', e.target.value)}
                              onKeyDown={preventArrowKeyChange}
                            />
                          </SoftBox>
                        </td>
                        <td className="express-grn-rows">
                          <SoftBox>
                            <SoftInput
                              value={item?.amount}
                              type="number"
                              className="product-aligning"
                              onChange={(e) => handleAdditonalInput(index, 'amount', e.target.value)}
                              onKeyDown={preventArrowKeyChange}
                            />
                          </SoftBox>
                        </td>
                        <td className="express-grn-rows">
                          <SoftBox>
                            <DeleteIcon
                              // color="error"
                              style={{ cursor: 'pointer', fontSize: '20px' }}
                              onClick={() => handleAddtionalDlt(index)}
                            />
                          </SoftBox>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filteredOptions?.length > 0 && (
                <SoftTypography
                  className="add-more-text"
                  onClick={handleAdditionalChargeList}
                  component="label"
                  variant="caption"
                  fontWeight="bold"
                >
                  + Add More Details
                </SoftTypography>
              )}
            </SoftBox>
          )}
        </>
      )}
      {openAdditionModal && (
        <GRNAdditionalDetail
          openAdditionModal={openAdditionModal}
          index={addIndex}
          handleCloseAddModal={handleCloseAddModal}
          rowData={rowData}
          setRowData={setRowData}
          handleInputChange={handleInputChange}
          handleAddEXPOProduct={handleAddEXPOProduct}
          setInputIndex={setInputIndex}
          setValueChange={setValueChange}
          setItemChanged={setItemChanged}
          openFullScreen={openFullScreen}
          isItemChanged={isItemChanged}
        />
      )}
      {openProdModal && (
        <CreateNewDraftProduct
          openModal={openProdModal}
          handleCloseModal={handleCloseProdModal}
          rowData={rowData}
          setRowData={setRowData}
          prodName={prodName}
          barNum={barNum}
          selectProduct={selectProduct}
          currIndex={currIndex}
        />
      )}
      <GRNDocumentAIModal rowData={rowData} setRowData={setRowData} handleAddRow={handleAddRow} />
    </div>
  );
};

export default GrnItemTable;
