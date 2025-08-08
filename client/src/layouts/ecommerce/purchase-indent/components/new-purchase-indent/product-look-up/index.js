import './index.css';
import {
  Box,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Menu,
  Modal,
  Tooltip,
  styled,
  tooltipClasses,
} from '@mui/material';
import {
  getAllBrands,
  getAllVendorSpecificProducts,
  searchProductsVendorSpecific,
  getAllMainCategory,
  getAllLevel1Category,
  getAllLevel2Category,
} from '../../../../../../config/Services';
import { isSmallScreen, noDatagif } from '../../../../Common/CommonFunction';
import { useCopyToClipboard, useDebounce, useMediaQuery } from 'usehooks-ts';
import { useSnackbar } from '../../../../../../hooks/SnackbarProvider';
import { v4 as uuidv4 } from 'uuid';
import CancelIcon from '@mui/icons-material/Cancel';
import OutlinedFlagRoundedIcon from '@mui/icons-material/OutlinedFlagRounded';
import React, { useEffect, useMemo, useState } from 'react';
import SoftBox from '../../../../../../components/SoftBox';
import SoftButton from '../../../../../../components/SoftButton';
import SoftInput from '../../../../../../components/SoftInput';
import SoftTypography from '../../../../../../components/SoftTypography';
import Spinner from '../../../../../../components/Spinner';
import CloseRoundedIcon from '@mui/icons-material/Close';
import FilterProductLookUp from './Filter-by-brand';

const styles = {
  Icon: {
    color: '#367df3',
    fill: '#367df3',
    fontSize: '12px',
    top: '213px',
    left: '759px',
    width: '12px',
    height: '12px',
  },
};

const IconComponent = () => (
  <svg style={styles.Icon} viewBox="0 0 512 512">
    <path d="M0 224C0 188.7 28.65 160 64 160H128V288C128 341 170.1 384 224 384H352V448C352 483.3 323.3 512 288 512H64C28.65 512 0 483.3 0 448V224zM224 352C188.7 352 160 323.3 160 288V64C160 28.65 188.7 0 224 0H448C483.3 0 512 28.65 512 64V288C512 323.3 483.3 352 448 352H224z"></path>
  </svg>
);

const PIProductLookUP = ({
  handleVendorProduct,
  rowData,
  setRowData,
  vendorId,
  vendorDisplayName,
  editDraftPI,
  createNewPI,
  boxRef,
  setItemChanged,
  setIsCreateAPIResponse,
  isCreateAPIResponse,
  setListDisplay,
}) => {
  const noImage =
    'https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg';
  const isMobileDevice = isSmallScreen();
  const is1143px = useMediaQuery('(min-width:1143px)');
  const showSnackbar = useSnackbar();
  const is360px = useMediaQuery('(max-width: 360px)');
  const locId = localStorage.getItem('locId');
  const orgId = localStorage.getItem('orgId');
  const piNum = localStorage.getItem('piNum');
  const [errorMessage, setErrorMessage] = useState('');
  const [loader, setLoader] = useState(false);
  const [pageLoader, setPageLoader] = useState(false);
  const [currPage, setCurrPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [vendorProducts, setVendorProducts] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [copiedText, setCopiedText] = useCopyToClipboard();
  const [tooltipText, setTooltipText] = useState();
  const [addVendorProd, setAddVendorProd] = useState('');
  const debounceAddVendorProd = useDebounce(addVendorProd, 300);
  const [quantities, setQuantities] = useState({});
  const debouncedQuantities = useDebounce(quantities, 700);
  const [searchText, setSearchText] = useState('');
  const debounceSearch = useDebounce(searchText, 700);
  const [filterValues, setFilterValues] = useState({});
  const [brandList, setBrandList] = useState([]);
  const [mainCatOption, setMainCatOption] = useState([]);
  const [catLevel1Option, setCatLevel1Option] = useState([]);
  const [catLevel2Option, setCatLevel2Option] = useState([]);
  const open = Boolean(anchorEl);

  const handleCopy = (text) => {
    setTooltipText(text);
    setCopiedText(text);
    setTimeout(() => {
      setTooltipText();
    }, 1000);
  };

  // useEffect(() => {
  //   listOfAllBrands();
  //   listMainCategory();
  // }, []);

  useEffect(() => {
    if (debounceSearch !== '') {
      searchVendorProd(debounceSearch);
    }
  }, [debounceSearch]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handlePageChange = (event, value) => {
    setCurrPage(value);
  };

  const listOfAllBrands = () => {
    const payload = {
      sourceId: [orgId],
      sourceLocationId: [locId],
    };
    getAllBrands(payload)
      .then((res) => {
        if (res?.data?.status === 'ERROR') {
          showSnackbar(res?.data?.message, 'error');
          return;
        }
        const data = res?.data?.data?.results;
        if (data.length > 0) {
          const brandArr = [];
          brandArr.push(
            data
              ?.map((e) => ({ value: e.brandId, label: e.brandName }))
              ?.sort((a, b) => a.label.localeCompare(b.label)),
          );
          setBrandList(brandArr[0]);
        }
      })
      .catch((err) => {});
  };

  const listMainCategory = () => {
    let payload = {
      sourceId: [orgId],
      sourceLocationId: [locId],
    };
    getAllMainCategory(payload)
      .then((res) => {
        const response = res?.data?.data?.results;
        if (response?.length > 0) {
          const arr = [];
          arr.push(
            response?.map((e) => ({
              value: e?.mainCategoryId,
              label: e?.categoryName,
            })),
          );
          setMainCatOption(arr[0]);
          setCatLevel1Option([]);
          setCatLevel2Option([]);
        }
      })
      .catch((err) => {});
  };
  const listCatLevel1 = (value) => {
    let payload = {
      sourceId: [orgId],
      sourceLocationId: [locId],
      mainCategoryId: [value],
    };
    getAllLevel1Category(payload)
      .then((res) => {
        const response = res?.data?.data?.results;
        if (response.length > 0) {
          const arr = [];
          arr.push(
            response.map((e) => ({
              value: e?.level1Id,
              label: e?.categoryName,
            })),
          );
          setCatLevel1Option(arr[0]);
          setCatLevel2Option([]);
        }
      })
      .catch((err) => {});
  };
  const listCatLevel2 = (value) => {
    let payload = {
      sourceId: [orgId],
      sourceLocationId: [locId],
      level1Id: [value],
    };
    getAllLevel2Category(payload)
      .then((res) => {
        const response = res?.data?.data?.results;
        if (response.length > 0) {
          const arr = [];
          arr.push(
            response.map((e) => ({
              value: e?.level2Id,
              label: e?.categoryName,
            })),
          );
          setCatLevel2Option(arr[0]);
        }
      })
      .catch((err) => {});
  };

  const filters = useMemo(
    () => [
      {
        type: 'select',
        placeholder: 'Select by brand',
        options: brandList || [],
        key: 'brand',
        label: 'Brand',
        toShow: true,
      },
      {
        type: 'select',
        placeholder: 'Select category',
        options: mainCatOption || [],
        key: 'category',
        label: 'Category',
        toShow: catLevel1Option?.length > 0 ? false : true,
      },
      {
        type: 'select',
        placeholder: 'Select category Level 1',
        options: catLevel1Option || [],
        key: 'category-level-1',
        label: 'Category Level 1',
        toShow: catLevel1Option?.length > 0 && catLevel2Option?.length === 0 ? true : false,
      },
      {
        type: 'select',
        placeholder: 'Select category Level 2',
        options: catLevel2Option || [],
        key: 'category-level-2',
        label: 'Category Level 2',
        toShow: catLevel2Option?.length > 0 ? true : false,
      },
    ],
    [brandList, mainCatOption, catLevel1Option, catLevel2Option],
  );

  const handleViewMore = () => {
    if (totalPages <= currPage) {
      return;
    }
    setPageLoader(true);
    setCurrPage((prev) => prev + 1);
  };

  const filterObject = {
    pageSize: 7,
    locationId: locId,
    orgId: orgId,
    vendorId: vendorId,
  };

  useEffect(() => {
    if (currPage == 1) {
      setLoader(true);
    }
    if (debounceSearch !== '') {
      searchVendorProd();
    } else {
      vendorSpecificProducts();
    }
  }, [currPage]);

  useEffect(() => {
    if (Object.keys(debouncedQuantities)?.length !== 0) {
      const existingProductIndex = rowData?.findIndex((item) => item?.itemCode === debouncedQuantities?.product?.gtin);
      const newProduct = {
        itemId: uuidv4(),
        id: null,
        itemCode: debouncedQuantities?.product?.gtin,
        itemName: debouncedQuantities?.product?.name,
        finalPrice: debouncedQuantities?.product?.mrp,
        hsnCode: debouncedQuantities?.product?.hsnCode || '',
        igst: debouncedQuantities?.product?.igst || 0,
        cgst: debouncedQuantities?.product?.cgst || 0,
        sgst: debouncedQuantities?.product?.sgst || 0,
        cess: debouncedQuantities?.product?.cess || 0,
        spec: debouncedQuantities?.product?.net_weight + ' ' + debouncedQuantities?.product?.measurement_unit,
        previousPurchasePrice:
          debouncedQuantities?.product?.purchasePrice === 'NA' ? 0 : debouncedQuantities?.product?.purchasePrice,
        previousQuantityOrdered: debouncedQuantities?.product?.quantityOrdered,
        availableStock: debouncedQuantities?.product?.availableStock,
        quantityOrdered: debouncedQuantities?.quantity,
        preferredVendor: vendorDisplayName,
        vendorId: vendorId,
        purchaseRecommendationFlag: debouncedQuantities?.product?.flag || '',
        purchaseFlagReason: debouncedQuantities?.product?.recommendation || '',
        salesFlag: debouncedQuantities?.product?.salesCat || '',
        inventoryFlag: debouncedQuantities?.product?.inventCat || '',
        profitFlag: debouncedQuantities?.product?.grossProfitCat || '',
      };
      if (existingProductIndex !== -1) {
        const updatedRowData = [...rowData];
        updatedRowData[existingProductIndex].quantityOrdered = debouncedQuantities?.quantity;
        setRowData(updatedRowData);
        showSnackbar('Product updated', 'success');
        setIsCreateAPIResponse(false);
        setAddVendorProd(debouncedQuantities?.quantity);
      } else {
        setRowData([...rowData, newProduct]);
        showSnackbar('Product added', 'success');
        setIsCreateAPIResponse(false);
        setAddVendorProd(debouncedQuantities?.quantity);
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
      }
    }
  }, [debouncedQuantities]);

  useEffect(() => {
    if (debounceAddVendorProd !== '') {
      if (piNum && isMobileDevice) {
        setItemChanged(true);
        editDraftPI();
      } else if (!piNum) {
        setListDisplay(false);
        createNewPI();
      }
      setAddVendorProd('');
    }
  }, [debounceAddVendorProd]);

  // const calculatePurchaseMargin = (mrp, pp) => {
  //   const mrpNumber = parseFloat(mrp);
  //   const ppNumber = parseFloat(pp);
  //   if (isNaN(mrpNumber) || isNaN(ppNumber) || mrpNumber === 0) {
  //     return 0;
  //   }
  //   const margin = ((mrpNumber - ppNumber) / mrpNumber) * 100;
  //   return decimalPointFormatter(margin);
  // };

  const vendorSpecificProducts = () => {
    filterObject.pageNo = currPage - 1;
    getAllVendorSpecificProducts(filterObject)
      .then((res) => {
        if (res?.data?.status === 'ERROR') {
          setLoader(false);
          setPageLoader(false);
          setErrorMessage(res?.data?.message);
          showSnackbar(res?.data?.message || 'Sorry! Something went wrong', 'error');
          return;
        }
        if (res?.data?.data?.es) {
          setLoader(false);
          setPageLoader(false);
          setErrorMessage(res?.data?.data?.message);
          showSnackbar(res?.data?.data?.message || 'Sorry! Something went wrong', 'error');
          return;
        }
        const response = res?.data?.data?.object;
        const productArray = response
          // ?.filter((ele) => ele?.product !== null || ele?.availability !== null)
          ?.map((ele) => {
            const imageUrlData =
              ele?.product !== null && Object.values(ele?.product?.images).filter((url) => url !== null && url !== '');
            const imageUrl = imageUrlData.length ? imageUrlData[0] : noImage;
            return {
              imageUrl: imageUrl,
              name: ele?.productName,
              gtin: ele?.gtin,
              value: ele?.gtin,
              net_weight: ele?.product?.weights_and_measures?.net_weight || 'NA',
              measurement_unit: ele?.product?.weights_and_measures?.measurement_unit || '',
              hsnCode: ele?.product?.hs_code || 'NA',
              igst: ele?.product?.igst || 0,
              cgst: ele?.product?.cgst || 0,
              sgst: ele?.product?.sgst || 0,
              cess: ele?.product?.cess || 0,
              mrp:
                ele?.whProductsCapsWithMultipleBatch?.multipleBatchCreations[0]?.mrp ||
                ele?.product?.mrp?.mrp ||
                ele?.availability?.mrp ||
                0,
              recommendation: ele?.productForeCastModel?.recommendation || 'NA',
              flag: ele?.productForeCastModel?.flag || 'NA',
              inventCat: ele?.productForeCastModel?.inventoryCat || 'NA',
              salesCat: ele?.productForeCastModel?.salesCat || 'NA',
              grossProfitCat: ele?.productForeCastModel?.grossProfitCat || 'NA',
              purchaseMargin: `${ele?.purchaseMargin ?? '0'}%`,
              purchasePrice: ele?.previousPurchaseResponse?.previousPurchasePrice ?? 'NA',
              availableStock: Number(ele?.availability?.availableUnits) || 0,
              salesPerWeek: ele?.salesPerWeek || 'NA',
              replacement: 'NA',
              stockTurnOver: ele?.productForeCastModel?.stockTurnover || 0,
            };
          })
          ?.sort((a, b) => a?.availableStock - b?.availableStock);
        setVendorProducts((prev) => [...prev, ...productArray]);
        setTotalPages(res?.data?.data?.totalPages || 0);
        if (productArray?.length > 4) {
          setLoader(false);
          setPageLoader(false);
        } else if (totalPages > currPage) {
          setCurrPage((prev) => prev + 1);
        } else {
          setLoader(false);
          setPageLoader(false);
        }
      })
      .catch((err) => {
        setLoader(false);
        setPageLoader(false);
        setErrorMessage(err?.response?.data?.message);
        showSnackbar(err?.response?.data?.message || 'Some error occured', 'error');
      });
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

  const getTagDescription = (type, result) => {
    if (type === 'INVENTORY') {
      switch (result) {
        case 'A':
          return 'Highest Consumption';
        case 'B':
          return 'Average Consumption';
        case 'C':
          return 'Lowest Consumption';
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

  const handleQuantityChange = (quantity, product) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      quantity,
      product,
    }));
    setIsCreateAPIResponse(true);
    setItemChanged(true);
  };

  const handleSearchFliter = (value) => {
    setCurrPage(1);
    setSearchText(value);
    setTotalPages(0);
    setVendorProducts([]);
  };

  const handleClearInput = () => {
    setCurrPage(1);
    setSearchText('');
    setTotalPages(0);
    setVendorProducts([]);
    setLoader(true);
    setTimeout(() => {
      vendorSpecificProducts();
    }, 300);
  };

  let searchPayload = {
    pageSize: 7,
    locationId: locId,
    orgId: orgId,
    vendorId: vendorId,
  };

  const searchVendorProd = () => {
    if (currPage === 1) {
      setLoader(true);
    }
    searchPayload.pageNo = currPage - 1;
    const isNumber = !isNaN(+debounceSearch);
    if (isNumber) {
      searchPayload.gtin = debounceSearch;
      searchPayload.title = null;
    } else {
      searchPayload.gtin = null;
      searchPayload.title = debounceSearch;
    }
    searchProductsVendorSpecific(searchPayload)
      .then((res) => {
        if (res?.data?.status === 'ERROR') {
          setLoader(false);
          setPageLoader(false);
          setErrorMessage(res?.data?.message);
          showSnackbar(res?.data?.message || 'Sorry! Something went wrong', 'error');
          return;
        }
        if (res?.data?.data?.es) {
          setLoader(false);
          setPageLoader(false);
          setErrorMessage(res?.data?.data?.message);
          showSnackbar(res?.data?.data?.message || 'Sorry! Something went wrong', 'error');
          return;
        }
        const response = res?.data?.data?.object;
        const productArray = response
          // ?.filter((ele) => ele?.product !== null || ele?.availability !== null)
          ?.map((ele) => {
            const imageUrlData =
              ele?.product !== null && Object.values(ele?.product?.images).filter((url) => url !== null && url !== '');
            const imageUrl = imageUrlData.length ? imageUrlData[0] : noImage;
            return {
              imageUrl: imageUrl,
              name: ele?.productName,
              gtin: ele?.gtin,
              value: ele?.gtin,
              net_weight: ele?.product?.weights_and_measures?.net_weight || 'NA',
              measurement_unit: ele?.product?.weights_and_measures?.measurement_unit || '',
              hsnCode: ele?.product?.hs_code || 'NA',
              igst: ele?.product?.igst || 0,
              cgst: ele?.product?.cgst || 0,
              sgst: ele?.product?.sgst || 0,
              cess: ele?.product?.cess || 0,
              mrp:
                ele?.whProductsCapsWithMultipleBatch?.multipleBatchCreations[0]?.mrp ||
                ele?.product?.mrp?.mrp ||
                ele?.availability?.mrp ||
                0,
              recommendation: ele?.productForeCastModel?.recommendation || 'NA',
              flag: ele?.productForeCastModel?.flag || 'NA',
              inventCat: ele?.productForeCastModel?.inventoryCat || 'NA',
              salesCat: ele?.productForeCastModel?.salesCat || 'NA',
              grossProfitCat: ele?.productForeCastModel?.grossProfitCat || 'NA',
              purchaseMargin: `${ele?.purchaseMargin ?? '0'}%`,
              purchasePrice: ele?.previousPurchaseResponse?.previousPurchasePrice ?? 'NA',
              availableStock: Number(ele?.availability?.availableUnits) || 0,
              salesPerWeek: ele?.salesPerWeek || 'NA',
              replacement: 'NA',
              stockTurnOver: ele?.productForeCastModel?.stockTurnover || 0,
            };
          })
          ?.sort((a, b) => a?.availableStock - b?.availableStock);
        setVendorProducts((prev) => [...prev, ...productArray]);
        setTotalPages(res?.data?.data?.totalPages || 0);
        if (productArray?.length > 4) {
          setLoader(false);
          setPageLoader(false);
        } else if (totalPages > currPage) {
          setCurrPage((prev) => prev + 1);
        } else {
          setLoader(false);
          setPageLoader(false);
        }
      })
      .catch((err) => {
        setLoader(false);
        setPageLoader(false);
        setErrorMessage(err?.response?.data?.message);
        showSnackbar(err?.response?.data?.message || 'Some error occured', 'error');
      });
  };

  const handleFilterChange = (key, e, label, inputType) => {
    if (!e) {
      // If 'e' is null or undefined, it means the filter is being removed
      setFilterValues((prevValues) => {
        const newValues = { ...prevValues };
        delete newValues[key];
        return newValues;
      });
    } else {
      setFilterValues((prevValues) => ({
        ...prevValues,
        [key]: {
          value: e.value,
          label: e.label,
          itemLabel: label,
        },
      }));
      if (key === 'category') {
        listCatLevel1(e.value);
      } else if (key === 'category-level-1') {
        listCatLevel2(e.value);
      }
    }
  };

  const applyFilters = () => {
    if (!filterValues) return;
  };

  const handleRemoveFilter = (key) => {
    if (key) {
      const updatedFilters = { ...filterValues };
      delete updatedFilters[key];
      handleFilterChange(updatedFilters);
      if (key === 'category') {
        setCatLevel1Option([]);
        setCatLevel2Option([]);
        delete updatedFilters['category-level-1'];
        delete updatedFilters['category-level-2'];
      } else if (key === 'category-level-1') {
        setCatLevel1Option([]);
        setCatLevel2Option([]);
        delete updatedFilters['category-level-2'];
      } else if (key === 'category-level-2') {
        setCatLevel2Option([]);
      }
      setFilterValues(updatedFilters);
    } else {
      setFilterValues({});
      setCatLevel1Option([]);
      setCatLevel2Option([]);
    }
    if (debounceSearch !== '') {
      setSearchText(debounceSearch);
    }
  };

  const CustomTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)(
    ({ theme }) => ({
      [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#f5f5f9',
        color: 'rgba(0, 0, 0, 0.87)',
        maxWidth: 360,
        fontSize: theme.typography.pxToRem(12),
        border: '1px solid #dadde9',
      },
    }),
  );

  return (
    <Modal
      open={true}
      onClose={handleVendorProduct}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="modal-pi-border"
      sx={{ padding: isMobileDevice ? '0px !important' : '20px !important' }}
    >
      <Box
        className={!isMobileDevice ? 'pi-vendor-box' : 'vendor-mob-modal-box'}
        sx={{
          position: !isMobileDevice && 'absolute',
          top: '-67px',
          left: '-67px',
          bottom: '-67px',
          right: '-67px',
          // transform: !isMobileDevice && 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          width: isMobileDevice ? '100%' : '95vw',
          overflow: 'hidden',
          height: isMobileDevice ? '100%' : '95vh',
          marginTop: !isMobileDevice && '',
        }}
      >
        <SoftBox className="vendor-prod-modal">
          <SoftBox className="vendor-prod-modal-fix-heading">
            {/* SEARCH bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
              <div className="pi-product-list-align">
                <SoftTypography fontSize="20px" fontWeight="bold" sx={{ color: '#030303' }}>
                  Product list for {vendorDisplayName}
                </SoftTypography>
              </div>
              <div
                style={{
                  width: isMobileDevice ? '100%' : '40%',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  justifyContent: 'flex-end',
                }}
              >
                <SoftBox>
                  <SoftInput
                    className="filter-add-list-cont-bill-search"
                    placeholder="Search by barcode or title"
                    value={searchText || ''}
                    icon={{ component: 'search', direction: 'right' }}
                    onChange={(e) => handleSearchFliter(e.target.value)}
                    disabled={loader}
                  />
                  {searchText?.length !== 0 && (
                    <SoftBox
                      sx={{
                        position: 'absolute',
                        top: '3px',
                        // right: '90px',
                        right: '50px',
                        color: 'gray',
                        cursor: 'pointer',
                        zIndex: 10,
                      }}
                    >
                      <CloseRoundedIcon onClick={handleClearInput} />
                    </SoftBox>
                  )}
                </SoftBox>
                {/* <div>
                  <FilterProductLookUp
                    filter={filters}
                    values={filterValues}
                    onChange={handleFilterChange}
                    applyFilters={applyFilters}
                    handleRemoveFilter={handleRemoveFilter}
                  />
                </div> */}
              </div>
              <IconButton edge="end" color="inherit" onClick={handleVendorProduct} aria-label="close">
                <CancelIcon color="error" />
              </IconButton>
            </div>
            <div className="pi-product-list-align"></div>
          </SoftBox>
          {/* If no product present NO PRODUCT FOUND FOR THIS VENDOR */}
          {!loader && vendorProducts?.length === 0 && (
            <div style={{ height: '90vh' }}>
              <SoftBox className="No-data-text-box">
                <SoftBox className="src-imgg-data">
                  <img className="src-dummy-img" src={noDatagif} />
                </SoftBox>
                {errorMessage !== '' ? (
                  <h3 className="no-data-text-I"> {errorMessage}</h3>
                ) : (
                  <h3 className="no-data-text-I">
                    {' '}
                    NO PRODUCTS FOUND FOR <b>{vendorDisplayName}</b>
                  </h3>
                )}
              </SoftBox>
            </div>
          )}
          {loader && (
            <div style={{ height: '90vh' }}>
              <SoftBox className="No-data-text-box">
                <SoftBox className="src-imgg-data">
                  <Spinner size={40} />
                </SoftBox>
              </SoftBox>
            </div>
          )}

          {!loader && vendorProducts?.length > 0 && (
            <SoftBox className="vendor-product" sx={{ height: '80vh', overflowY: 'scroll' }}>
              {vendorProducts?.map((ele, index) => {
                const isQuantPresent = rowData?.find((item) => item?.itemCode === ele?.gtin);
                const quantityData = ele?.gtin === quantities?.product?.gtin;
                const quantity = quantityData ? quantities?.quantity : '';
                const name = ele?.name || '';
                const truncatedName = name?.length > 40 ? name?.slice(0, 40) + '...' : name;
                return (
                  <SoftBox
                    className={isMobileDevice ? 'vendor-prod-mobile-container' : 'vendor-prod-mobile-container-1'}
                  >
                    <SoftBox
                      className={isMobileDevice ? 'additional-detail-container' : 'additional-detail-container-1'}
                    >
                      <SoftBox className="vendor-prod-main-box">
                        <SoftBox className={isMobileDevice ? 'vendor-prod-img' : 'vendor-prod-img-1'}>
                          <img src={ele?.imageUrl} className={'all-vendor-prdt-img-1'} />
                        </SoftBox>
                        <SoftBox className="vendor-prod-seconday">
                          <SoftBox>
                            <SoftBox display="flex" flexDirection="column">
                              <SoftBox className="vendor-prod-title-box">
                                {isMobileDevice ? (
                                  <SoftTypography className="vendor-prod-title">{ele?.name}</SoftTypography>
                                ) : (
                                  <CustomTooltip title={ele?.name}>
                                    <SoftTypography className="vendor-prod-title">{truncatedName}</SoftTypography>
                                  </CustomTooltip>
                                )}
                                <SoftTypography fontSize="14px" textAlign="start">
                                  ({ele?.gtin}){' '}
                                </SoftTypography>
                                <Tooltip title={tooltipText && 'Copied'} placement="top-start">
                                  <SoftBox
                                    onClick={() => {
                                      handleCopy(ele?.gtin);
                                    }}
                                    sx={{ cursor: 'pointer' }}
                                  >
                                    <SoftBox>
                                      <IconComponent />
                                    </SoftBox>
                                  </SoftBox>
                                </Tooltip>
                              </SoftBox>
                              <SoftBox
                                display="flex"
                                justifyContent="space-between"
                                flexDirection={isMobileDevice && 'column'}
                              >
                                <SoftBox
                                  display="flex"
                                  flexDirection={isMobileDevice ? 'column' : 'row'}
                                  justifyContent="flex-start"
                                  alignItems={isMobileDevice ? 'flex-start' : 'center'}
                                  gap={isMobileDevice ? '5px' : '20px'}
                                  mt={1}
                                  mb={1}
                                >
                                  <SoftTypography fontSize={'12px'}>
                                    {ele?.net_weight + ' ' + ele?.measurement_unit}{' '}
                                  </SoftTypography>
                                  <SoftTypography fontSize={'12px'}>
                                    MRP: ₹ {ele?.mrp === 0 ? '0' : ele?.mrp || 'NA'}
                                  </SoftTypography>
                                  <SoftBox className="other-vendor-prod-item-listing-1">
                                    {ele?.flag === 'NA' ||
                                    ele?.flag === '' ||
                                    ele?.flag === '' ||
                                    isMobileDevice ? null : (
                                      <FlagTooltips
                                        placement="bottom-start"
                                        title={
                                          <div className="tooltip-flag-recommend">
                                            <div className="tooltip-flag-heading-name">
                                              <SoftTypography
                                                fontSize="14px"
                                                fontWeight="bold"
                                                mt={ele?.inventCat === 'D' ? '' : 1}
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
                                              <div className={ele?.inventCat === 'D' ? 'tooltip-flag-cat-data' : ''}>
                                                {ele?.inventCat === 'D' ? (
                                                  <span style={{ color: 'red', fontSize: '14px', fontWeight: 'bold' }}>
                                                    Dead Stock
                                                  </span>
                                                ) : (
                                                  <>
                                                    <Chip
                                                      color={categoryColour(ele?.inventCat)}
                                                      label={ele?.inventCat || 'NA'}
                                                    />
                                                    {ele?.inventCat !== 'NA' && (
                                                      <Chip
                                                        color={categoryColour(ele?.inventCat)}
                                                        label={getTagDescription('INVENTORY', ele?.inventCat) || 'NA'}
                                                      />
                                                    )}
                                                  </>
                                                )}
                                              </div>
                                              <div className="tooltip-flag-cat-data">
                                                <Chip
                                                  color={categoryColour(ele?.salesCat)}
                                                  label={ele?.salesCat || 'NA'}
                                                />
                                                {ele?.salesCat !== 'NA' && (
                                                  <Chip
                                                    color={categoryColour(ele?.salesCat)}
                                                    label={getTagDescription('SALES', ele?.salesCat) || 'NA'}
                                                  />
                                                )}
                                              </div>
                                              <div className="tooltip-flag-cat-data">
                                                <Chip
                                                  color={categoryColour(ele?.grossProfitCat)}
                                                  label={ele?.grossProfitCat || 'NA'}
                                                />
                                                {ele?.grossProfitCat !== 'NA' && (
                                                  <Chip
                                                    color={categoryColour(ele?.grossProfitCat)}
                                                    label={getTagDescription('PROFIT', ele?.grossProfitCat) || 'NA'}
                                                  />
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        }
                                      >
                                        {/* <Chip
                                          color={categoryColour(ele?.flag)}
                                          label={ */}
                                        <OutlinedFlagRoundedIcon
                                          fontSize="small"
                                          style={{ color: `${categoryColour(ele?.flag)}`, cursor: 'pointer' }}
                                        />
                                        {/* }
                                        /> */}
                                      </FlagTooltips>
                                    )}
                                    {isMobileDevice && (
                                      <>
                                        <Box className="flag-icon-newpi-vendor-products" onClick={handleClick}>
                                          {/* <Chip
                                            color={categoryColour(ele?.flag)}
                                            label={ */}
                                          <OutlinedFlagRoundedIcon
                                            fontSize="small"
                                            style={{ color: `${categoryColour(ele?.flag)}`, cursor: 'pointer' }}
                                            //   />
                                            // }
                                          />
                                        </Box>
                                        <Menu
                                          id="basic-menu"
                                          anchorEl={anchorEl}
                                          open={open}
                                          onClose={handleClose}
                                          MenuListProps={{
                                            'aria-labelledby': 'basic-button',
                                          }}
                                        >
                                          <div className="tooltip-flag-recommend">
                                            <div className="tooltip-flag-heading-name">
                                              <SoftTypography
                                                fontSize="14px"
                                                fontWeight="bold"
                                                mt={ele?.inventCat === 'D' ? '' : 1}
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
                                              <div className={ele?.inventCat === 'D' ? 'tooltip-flag-cat-data' : ''}>
                                                {ele?.inventCat === 'D' ? (
                                                  <span style={{ color: 'red', fontSize: '14px', fontWeight: 'bold' }}>
                                                    Dead Stock
                                                  </span>
                                                ) : (
                                                  <>
                                                    <Chip
                                                      color={categoryColour(ele?.inventCat)}
                                                      label={ele?.inventCat || 'NA'}
                                                    />
                                                    {ele?.inventCat !== 'NA' && (
                                                      <Chip
                                                        color={categoryColour(ele?.inventCat)}
                                                        label={getTagDescription('INVENTORY', ele?.inventCat) || 'NA'}
                                                      />
                                                    )}
                                                  </>
                                                )}
                                              </div>
                                              <div className="tooltip-flag-cat-data">
                                                <Chip
                                                  color={categoryColour(ele?.salesCat)}
                                                  label={ele?.salesCat || 'NA'}
                                                />
                                                {ele?.salesCat !== 'NA' && (
                                                  <Chip
                                                    color={categoryColour(ele?.salesCat)}
                                                    label={getTagDescription('SALES', ele?.salesCat) || 'NA'}
                                                  />
                                                )}
                                              </div>
                                              <div className="tooltip-flag-cat-data">
                                                <Chip
                                                  color={categoryColour(ele?.grossProfitCat)}
                                                  label={ele?.grossProfitCat || 'NA'}
                                                />
                                                {ele?.grossProfitCat !== 'NA' && (
                                                  <Chip
                                                    color={categoryColour(ele?.grossProfitCat)}
                                                    label={getTagDescription('PROFIT', ele?.grossProfitCat) || 'NA'}
                                                  />
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        </Menu>
                                      </>
                                    )}
                                  </SoftBox>
                                  <SoftTypography fontSize={'12px'} sx={{ marginLeft: !isMobileDevice && '-10px' }}>
                                    {ele?.recommendation}
                                  </SoftTypography>
                                </SoftBox>
                                <SoftBox className="other-vendor-prod-item-listing-2">
                                  {!isMobileDevice && (
                                    <SoftTypography fontSize="12px" fontWeight="bold">
                                      Quantity
                                    </SoftTypography>
                                  )}
                                  <SoftBox
                                    className={`vendor-prod-inpt-box ${isMobileDevice && 'pi-vendorprod-qty-flex'}`}
                                    sx={{ border: 'none !important' }}
                                  >
                                    {isMobileDevice && (
                                      <SoftTypography fontSize="12px" textAlign="start">
                                        Current stock:
                                        <strong className="additional-item-value">{ele?.availableStock || 0}</strong>
                                      </SoftTypography>
                                    )}
                                    <SoftInput
                                      type="number"
                                      sx={{
                                        width: '120px !important',
                                      }}
                                      disabled={isCreateAPIResponse ? true : false}
                                      value={
                                        quantity ? quantity : isQuantPresent ? isQuantPresent?.quantityOrdered : ''
                                      }
                                      onChange={(e) => handleQuantityChange(e.target.value, ele)}
                                      inputProps={{ min: 0 }}
                                    />
                                  </SoftBox>
                                </SoftBox>
                              </SoftBox>
                            </SoftBox>
                          </SoftBox>
                        </SoftBox>
                      </SoftBox>
                      {!isMobileDevice && (
                        <SoftBox className="other-vendor-prod-listing-1">
                          <Grid
                            container
                            spacing={1}
                            mb={2}
                            ml={8}
                            direction="row"
                            justifyContent="flex-start"
                            alignItems="center"
                            sx={{ width: is1143px ? '70%' : '100%' }}
                          >
                            <Grid item lg={2} md={2} sm={2} xs={2}>
                              <SoftBox className="other-vendor-prod-item-listing">
                                <SoftTypography className="product-vendor-look-up">Purchase margin</SoftTypography>
                                <SoftTypography fontSize="12px">
                                  {ele?.purchaseMargin === 'NA' ? 0 : ele?.purchaseMargin}
                                </SoftTypography>
                              </SoftBox>
                            </Grid>
                            <Grid item lg={2.4} md={2.4} sm={2.4} xs={2.4}>
                              <SoftBox className="other-vendor-prod-item-listing">
                                <SoftTypography className="product-vendor-look-up">
                                  Average sales per week
                                </SoftTypography>
                                <SoftTypography fontSize="12px">
                                  {ele?.salesPerWeek === 'NA' ? 0 : ele?.salesPerWeek}
                                </SoftTypography>
                              </SoftBox>
                            </Grid>
                            <Grid item lg={2.8} md={2.8} sm={2.8} xs={2.8}>
                              <SoftBox className="other-vendor-prod-item-listing">
                                <SoftTypography className="product-vendor-look-up">
                                  Stock turnover per batch
                                </SoftTypography>
                                <SoftTypography fontSize="12px">{ele?.stockTurnOver}</SoftTypography>
                              </SoftBox>
                            </Grid>
                            <Grid item lg={2.4} md={2.4} sm={2.4} xs={2.4}>
                              <SoftBox className="other-vendor-prod-item-listing">
                                <SoftTypography className="product-vendor-look-up">Current stock</SoftTypography>
                                <SoftTypography fontSize="12px">{ele?.availableStock || 0}</SoftTypography>
                              </SoftBox>
                            </Grid>
                            <Grid item lg={2.4} md={2.4} sm={2.4} xs={2.4}>
                              <SoftBox className="other-vendor-prod-item-listing">
                                <SoftTypography className="product-vendor-look-up">Incoming replacement</SoftTypography>
                                <SoftTypography fontSize="12px">{ele?.replacement || 0}</SoftTypography>
                              </SoftBox>
                            </Grid>
                          </Grid>
                        </SoftBox>
                      )}
                    </SoftBox>
                    <Divider sx={{ margin: '5px !important' }} />
                    {isMobileDevice && (
                      <Grid container className="other-vendor-prod-listing-1">
                        <Grid
                          item
                          lg={is360px ? 12 : 6}
                          md={is360px ? 12 : 6}
                          sm={12}
                          xs={12}
                          className="other-vendor-prod-item-listing"
                        >
                          <Box className="additional-details-item-mobile">
                            <SoftTypography fontSize="12px" textAlign="end">
                              Purchace margin:{' '}
                              <strong className="additional-item-value">
                                {ele?.purchaseMargin === 'NA' ? 0 : ele?.purchaseMargin} %
                              </strong>
                            </SoftTypography>
                          </Box>
                        </Grid>
                        <Grid
                          item
                          lg={is360px ? 12 : 6}
                          md={is360px ? 12 : 6}
                          sm={12}
                          xs={12}
                          className="other-vendor-prod-item-listing"
                          sx={{ alignItems: 'center', marginTop: '10px' }}
                        >
                          <Box className="additional-details-item-mobile">
                            <SoftTypography fontSize="12px" textAlign="center">
                              Average sales per week:
                              <strong className="additional-item-value">
                                {' '}
                                {ele?.salesPerWeek === 'NA' ? 0 : ele?.salesPerWeek}
                              </strong>
                            </SoftTypography>
                          </Box>
                        </Grid>
                        <Grid item lg={12} md={12} sm={12} xs={12} className="other-vendor-prod-item-listing">
                          <Box className="additional-details-item-mobile">
                            <SoftTypography fontSize="12px" textAlign="start">
                              Stock turnover per btch:{' '}
                              <strong className="additional-item-value">
                                {ele?.stockTurnOver === 'NA' ? 0 : ele?.stockTurnOver}
                              </strong>
                            </SoftTypography>
                          </Box>
                        </Grid>
                        <Grid
                          item
                          lg={is360px ? 12 : 6}
                          md={is360px ? 12 : 6}
                          sm={12}
                          xs={12}
                          className="other-vendor-prod-item-listing"
                        >
                          <Box className="additional-details-item-mobile">
                            <SoftTypography fontSize="12px" textAlign="end">
                              Incoming replacement:{' '}
                              <strong className="additional-item-value">{ele?.replacement}</strong>
                            </SoftTypography>
                          </Box>
                        </Grid>
                      </Grid>
                    )}
                  </SoftBox>
                );
              })}
            </SoftBox>
          )}
          {/* {pageLoader && <Spinner size={20}/>} */}
          {/* Give View more btn */}
          {totalPages > 1 && (
            <SoftBox
              className="pagination-container"
              // sx={{ marginTop: !isMobileDevice ? (loader ? '55px' : '30px') : '0px' }}
            >
              {/* <Pagination
                count={totalPages}
                size={isMobileDevice ? 'small' : 'medium'}
                color="primary"
                page={currPage}
                onChange={handlePageChange}
                shape="rounded"
                disabled={loader}
                sx={{
                  width: '110%',
                  alignItems: 'center',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  flexWrap: 'wrap',
                }}
              /> */}
              <SoftBox
                sx={{
                  width: '110%',
                  alignItems: 'center',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  flexWrap: 'wrap',
                }}
              >
                <SoftButton
                  className="vendor-add-btn picancel-btn"
                  onClick={handleViewMore}
                  disabled={loader || pageLoader || totalPages <= currPage ? true : false}
                >
                  {pageLoader ? <CircularProgress size={20} /> : <>View More</>}
                </SoftButton>
              </SoftBox>
            </SoftBox>
          )}
        </SoftBox>
      </Box>
    </Modal>
  );
};

export default PIProductLookUP;
