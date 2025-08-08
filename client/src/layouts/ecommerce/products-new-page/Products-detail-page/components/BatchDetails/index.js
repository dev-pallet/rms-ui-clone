import React, { useEffect, useState } from 'react';
import SoftBox from '../../../../../../components/SoftBox';
import {
  Button,
  CircularProgress,
  Dialog,
  Drawer,
  Grid,
  IconButton,
  InputLabel,
  Slide,
  Typography,
} from '@mui/material';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import CircleRoundedIcon from '@mui/icons-material/CircleRounded';
import { isSmallScreen, withinSevenDaysChecker } from '../../../../Common/CommonFunction';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import BatchPODetail from '../../../../product/all-products/components/product-details/poDetail';
import { DataGrid } from '@mui/x-data-grid';
import SouthIcon from '@mui/icons-material/South';
import NorthIcon from '@mui/icons-material/North';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { addProductInventory, avgStockRatio, verifyBatch } from '../../../../../../config/Services';
import moment from 'moment';
import SoftTypography from '../../../../../../components/SoftTypography';
import { useDebounce } from 'usehooks-ts';
import { useSnackbar } from '../../../../../../hooks/SnackbarProvider';
import SoftInput from '../../../../../../components/SoftInput';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import SoftButton from '../../../../../../components/SoftButton';
import SoftDatePicker from '../../../../../../components/SoftDatePicker';
import { dataGridStyles } from '../../../../Common/NewDataGridStyle';
import EditIcon from '@mui/icons-material/Edit';
import BatchDetailsDialog from './BatchDetailsDailog';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ProductBatchDetails = ({
  pricingDetail,
  gtin,
  selectedVariantBarcode,
  inventoryData,
  productDetails,
  setReloadBatchDetails,
  reloadBatchDetails,
  selectedVariant,
  setAvgStockTurnover,
  setExpectedStockOut,
}) => {
  const [openPOModal, setOpenPOModal] = useState(false);
  const [selectedPONum, setSelectedPONum] = useState('');
  const [selectedReqType, setSelectedReqType] = useState('');
  const [stockRatio, setStockRatio] = useState({});
  const [saveLoader, setSaveLoader] = useState(false);

  const [pageState2, setPageState2] = useState({
    loader: false,
    datRows: [],
    total: 0,
    page: 1,
    totalPages: 0,
    pageSize: 10,
  });

  const [openEditBatch, setOpenEditBatch] = useState(false);

  const [edditingBatch, setEdditingBatch] = useState(false);
  const [verifyingBatch, setVerifyingBatch] = useState();
  const [batchAlreadyPresent, setBatchAlreadyPresent] = useState();
  const [batchNumber, setBatchNumber] = useState('');
  const [batchCheck, setBatchCheck] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState();
  const [savingBatchDetailsLoader, setSavingBatchDetailsLoader] = useState(false);
  const [addBatchDetails, setAddBatchDetails] = useState({
    quantity: null,
    availableUnits: null,
    mrp: null,
    sellingPrice: null,
    purchasePrice: null,
    expiryDate: null,
  });
  const [batchDetails, setBatchDetails] = useState([
    {
      id: 0,
      batchId: '',
      quantity: '',
      availableUnits: '',
      mrp: '',
      sellingPrice: '',
      purchasePrice: '',
      expiryDateApi: '',
      isNew: true,
    },
  ]);
  const batchDetailsHandler = (e) => {
    const name = e?.target?.name;
    const value = e?.target?.value;
    setAddBatchDetails((prev) => ({
      ...prev,
      [e.target === undefined ? 'expiryDate' : name]:
        e.target === undefined ? (e.length === 0 ? null : moment(e?.[0]).format('YYYY-MM-DD')) : value,
    }));
  };

  //   local storage
  const permissions = JSON.parse(localStorage.getItem('permissions'));
  const locId = localStorage.getItem('locId');
  const orgId = localStorage.getItem('orgId');
  const userDetails = localStorage.getItem('user_details');
  const userInfo = userDetails ? JSON.parse(userDetails) : {};
  const userName = localStorage.getItem('user_name');

  const currMonth = new Date().getMonth() + 1;
  const currentDate = new Date();
  const year = currentDate.getFullYear();

  const HtmlTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)(
    ({ theme }) => ({
      [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#f5f5f9',
        color: 'rgba(0, 0, 0, 0.87)',
        maxWidth: 'none',
        fontSize: theme.typography.pxToRem(12),
        border: '1px solid #dadde9',
        boxShadow: ' 3px 3px 6px rgba(0, 0, 0, 0.1)',
        backgroundColor: 'gold !important',
        fontWeight: '600',
      },
    }),
  );

  const LightTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)(
    ({ theme }) => ({
      [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: theme.palette.common.white,
        color: 'rgba(0, 0, 0, 0.87)',
        boxShadow: theme.shadows[1],
        fontSize: 11,
      },
    }),
  );

  const handlePODetail = (requestNumber, requestNumberType) => {
    setOpenPOModal(true);
    setSelectedPONum(requestNumber);
    setSelectedReqType(requestNumberType);
  };

  const stockPayload = {
    pageNo: pageState2.page,
    pageSize: pageState2.pageSize,
    locationId: locId,
    gtin: gtin,
    startDate: new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), currentDate.getDate())
      .toISOString()
      .split('T')[0],
    endDate: currentDate.toISOString().split('T')[0],
  };

  let stockArr,
    stockRow = [];

  useEffect(() => {
    setPageState2((old) => ({ ...old, loader: true }));
    let stockRes;
    avgStockRatio(stockPayload)
      .then((res) => {
        if (res?.data?.data?.es === 1) {
          setAvgStockTurnover('NA'); // Set the calculated average for daysTakenToSold
          setExpectedStockOut('NA');
          setStockRatio([]);
        }
        stockRes = res?.data?.data?.data;
        let stockArr = res?.data?.data?.data?.data;
        stockArr.sort((a, b) => new Date(b.inwardedOn) - new Date(a.inwardedOn));

        let totalDaysTaken = 0; // To accumulate daysTakenToSold
        let validDaysTakenCount = 0;

        let totalEstimatedDays = 0;
        let validEstimatedDaysCount = 0;

        const stockRow = stockArr?.map((row, index) => {
          const daysTakenToSold = row?.daysTakenToSold ? row?.daysTakenToSold : 0;
          const estimatedDays = row?.estimatedDays ? row?.estimatedDays : 0;

          if (row?.daysTakenToSold !== null && row?.daysTakenToSold !== '-----') {
            totalDaysTaken += row?.daysTakenToSold;
            validDaysTakenCount++;
          }

          if (row?.estimatedDays !== null && row?.estimatedDays !== '-----') {
            totalEstimatedDays += row?.estimatedDays;
            validEstimatedDaysCount++;
          }

          return {
            id: index,
            batchId: row?.batchNo ? row?.batchNo : '-----',
            daysTakenToSold: daysTakenToSold,
            stockTurnover: row?.availableUnits !== 0 ? row?.estimatedDays + ' days' : daysTakenToSold + ' days',
            estimatedDays: estimatedDays,
          };
        });

        const avgDaysTakenToSold =
          validDaysTakenCount > 0 ? `${(totalDaysTaken / validDaysTakenCount).toFixed(0)} days` : '0';
        const avgEstimatedDays =
          validEstimatedDaysCount > 0 ? `${(totalEstimatedDays / validEstimatedDaysCount).toFixed(0)} days` : '0';

        setStockRatio(stockRow);
        setAvgStockTurnover(avgDaysTakenToSold); // Set the calculated average for daysTakenToSold
        setExpectedStockOut(avgEstimatedDays); // Set the calculated average for estimatedDays

        setPageState2((old) => ({
          ...old,
          loader: false,
          datRows: stockRow || [],
          page: stockRes?.pageNumber || 1,
          total: stockRes?.totalResult || 0,
          totalPages: stockRes?.totalResult || 1,
        }));
      })
      .catch((err) => {
        setPageState2((old) => ({ ...old, loader: false }));
        // Handle errors here if necessary
      });
  }, [pageState2.page, gtin, reloadBatchDetails]);

  const renderBatchCell = (params) => {
    const {
      row: { id, offerId, offerName, freebie, purchasePrice: pp, requestNumber, requestNumberType, expiryDateApi },
      value,
    } = params;

    const isFirstRow = id === 0;
    const showLabel = !(typeof offerName === 'string' && offerName.includes('Free Product') && !freebie);
    const isAboutToExpired = withinSevenDaysChecker(expiryDateApi);
    const iconColor = isAboutToExpired <= 0 ? 'error' : isAboutToExpired <= 7 ? 'warning' : 'success';

    const renderOfferIcon = () => (
      <HtmlTooltip title={offerName || 'Free Product'} arrow={false} placement="right">
        <LocalOfferIcon
          ml={1}
          color="success"
          sx={{ fontSize: '18px !important', marginLeft: offerName ? '0' : '8px !important' }}
        />
      </HtmlTooltip>
    );

    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ marginRight: '15px' }}>
          <CircleRoundedIcon
            color={iconColor}
            sx={{ width: '10px !important', height: '10px !important', top: '-5px' }}
          />
        </div>
        {isFirstRow && (
          <div style={{ marginLeft: '-12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <LightTooltip title="Latest Batch">
              <KeyboardDoubleArrowRightIcon color="info" fontSize="small" />
            </LightTooltip>
          </div>
        )}
        <div
          style={{
            marginLeft: requestNumber ? (isFirstRow ? '-2px' : '-7px') : '15px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '5px',
          }}
        >
          {requestNumber && (
            <InfoOutlinedIcon
              color="info"
              fontSize="small"
              onClick={() => handlePODetail(requestNumber, requestNumberType)}
            />
          )}
          {value}
        </div>
        {offerId !== null && showLabel ? (
          <HtmlTooltip title={offerName} arrow={false} placement="right">
            <LocalOfferIcon
              color="success"
              sx={{
                fontSize: '18px !important',
                marginLeft: '8px !important',
              }}
            />
          </HtmlTooltip>
        ) : pp === 0 ? (
          <HtmlTooltip title={'Free Product'} arrow={false} placement="right">
            <LocalOfferIcon
              ml={1}
              color="success"
              sx={{
                fontSize: '18px !important',
                marginLeft: '8px !important',
              }}
            />
          </HtmlTooltip>
        ) : (
          <></>
        )}
      </div>
    );
  };

  const renderSellingPriceCell = (params) => {
    const {
      row: { downArrow, upArrow },
      value,
    } = params;

    const renderArrowIcon = (Icon, title) => (
      <div style={{ marginLeft: '-5px' }}>
        <LightTooltip title={title}>
          <Icon color="success" fontSize="small" />
        </LightTooltip>
      </div>
    );

    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {downArrow === 'false' && upArrow === 'true' && (
          <>
            {renderArrowIcon(NorthIcon, 'Selling Price based on Purchase Price marked up')}
            <div style={{ marginLeft: '5px' }}>{value}</div>
          </>
        )}
        {downArrow === 'true' && upArrow === 'false' && (
          <>
            {renderArrowIcon(SouthIcon, 'Selling Price based on MRP marked down')}
            <div style={{ marginLeft: '5px' }}>{value}</div>
          </>
        )}
        {downArrow === 'false' && upArrow === 'false' && (
          <>
            <SoftBox width="20px" height="20px"></SoftBox>
            <div>{value}</div>
          </>
        )}
      </div>
    );
  };

  const columns = [
    {
      field: 'inwardedOn',
      headerName: 'Inward Date',
      minWidth: 60,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'batchId',
      headerName: 'Batch No',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      flex: 1,
      minWidth: 150,
      cellClassName: 'datagrid-rows',
      align: 'left',
      renderCell: renderBatchCell,
    },
    {
      field: 'quantity',
      headerName: 'Qty Purchased',
      minWidth: 80,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'purchasePrice',
      headerName: 'Pp',
      minWidth: 30,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'purchaseMargin',
      headerName: 'Purchase Margin',
      minWidth: 50,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'mrp',
      headerName: 'MRP',
      minWidth: 30,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'sellingPrice',
      headerName: 'Sale Price',
      minWidth: 50,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
      renderCell: renderSellingPriceCell,
    },
    {
      field: 'availableUnits',
      headerName: 'Available Qty',
      minWidth: 50,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
      renderCell: (params) => {
        const { availableUnits, negativeConsumption } = params?.row;

        const displayValue = negativeConsumption ? `${availableUnits} (-${negativeConsumption})` : availableUnits;

        return negativeConsumption ? (
          <Tooltip title={'Negative consumption'}>
            <span>{displayValue}</span>
          </Tooltip>
        ) : (
          <span>{displayValue}</span>
        );
      },
    },
    {
      field: 'expiryDate',
      headerName: 'Expiry',
      minWidth: 80,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'stockTurnover',
      headerName: 'Stock Turnover',
      minWidth: 50,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'edit',
      headerName: '',
      minWidth: 100,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
      renderCell: (params) => {
        return (
          <div
            style={{
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              width: '100%',
              textAlign: 'center',
            }}
            onClick={() => {
              handleOpenNew();
              setIsEditable(true);
              setSelectedIndex(params?.row?.batchId);
            }}
          >
            <div>
              <ModeEditIcon style={{ fontSize: 'larger' }} />
            </div>
          </div>
        );
      },
    },
  ];
  let mergedData = [];

  if (Array.isArray(stockRatio) && stockRatio.length > 0) {
    // Create a mapping of stockRatio by batchId for easy lookup
    const stockRatioMap = stockRatio.reduce((acc, item) => {
      acc[item.batchId] = item;
      return acc;
    }, {});

    // Merge stockRatio data into pricingDetail
    mergedData = pricingDetail.map((detail) => {
      const stockData = stockRatioMap[detail.batchId];
      return stockData ? { ...detail, ...stockData } : detail;
    });

    // Add stockRatio data that doesn't have a corresponding entry in pricingDetail
    stockRatio.forEach((item) => {
      if (!pricingDetail.some((detail) => detail.batchId === item.batchId)) {
        mergedData.push(item);
      }
    });
  } else if (Array.isArray(pricingDetail) && pricingDetail.length > 0) {
    // If stockRatio is not an array or empty, just use pricingDetail
    mergedData = [...pricingDetail];
  }

  // const [batchCheck, setBatchCheck] = useState('');
  // const [batchChange, setBatchChange] = useState(false);
  const debouncedValue = useDebounce(batchNumber, 500);

  const [batchDetailsLoader, setBatchDetailsLoader] = useState(false);

  const [count, setCount] = useState(1);
  const [fixedCount, setFixedCount] = useState(pricingDetail.length);

  const showSnackbar = useSnackbar();
  const [backupData, setBackupData] = useState();

  const batchChange = () => {
    setBatchCheck(false);
    setBatchAlreadyPresent(false);
    setVerifyingBatch(true);
    verifyBatch(locId, gtin, debouncedValue)
      .then((res) => {
        if (res?.data?.data?.object?.available === true) {
          showSnackbar('Batch Already Present', 'success');
          setVerifyingBatch(false);
          setBatchAlreadyPresent(true);
          setBatchCheck(false);
        } else {
          showSnackbar('Success', 'success');
          setVerifyingBatch(false);
          setBatchCheck(true);
        }
      })
      .catch((err) => {
        showSnackbar(err?.response?.data?.message, 'error');
      });
  };

  useEffect(() => {
    if (batchNumber && !edditingBatch) {
      batchChange();
    }
  }, [debouncedValue]);

  // const handleInputChange = (e, index) => {
  //   setBatchChange(true);
  //   setBatchPresent(false);
  //   setBatchCheck(e.target.value);
  //   const updatedBatchNos = [...batchno];
  //   updatedBatchNos[index] = e.target.value;
  //   setBatchNo(updatedBatchNos);
  // };

  // const handleDelete = (index) => {
  //   const updatedBatchNos = [...batchno];
  //   updatedBatchNos.splice(index, 1);
  //   setBatchNo(updatedBatchNos);

  //   const updatedinventoryId = [...inventoryId];
  //   updatedinventoryId.splice(index, 1);
  //   setInventoryId(updatedinventoryId);

  //   const updatedAvailableUnits = [...availableUnits];
  //   updatedAvailableUnits.splice(index, 1);
  //   setAvailableUnits(updatedAvailableUnits);

  //   const updatedmrp = [...mrp];
  //   updatedmrp.splice(index, 1);
  //   setMrp(updatedmrp);

  //   const updatedSalePrices = [...salePrice];
  //   updatedSalePrices.splice(index, 1);
  //   setSalePrice(updatedSalePrices);

  //   const updatedpurchasePrices = [...purchasePrice];
  //   updatedpurchasePrices.splice(index, 1);
  //   setPurchasePrice(updatedpurchasePrices);

  //   const updatedexpDate = [...expDate];
  //   updatedexpDate.splice(index, 1);
  //   setExpDate(updatedexpDate);

  //   const updatedquantity = [...quantity];
  //   updatedquantity.splice(index, 1);
  //   setQuantity(updatedquantity);

  //   SetCount(count - 1);
  // };

  const isMobileDevice = isSmallScreen();
  const [openDrawer, setOpenDrawer] = useState(false);

  const handleOpenNew = () => {
    if (isMobileDevice) {
      setOpenDrawer(true);
      return;
    }
    setOpenEditBatch(true);
  };

  const handleBatchClose = () => {
    setOpenDrawer(false);
  };

  const batchValidator = () => {
    const fields = [
      { value: addBatchDetails.quantity, message: 'Please Provide Proper Quantity' },
      { value: addBatchDetails.availableUnits, message: 'Please Provide Available Quantity' },
      { value: addBatchDetails.mrp, message: 'Please Provide Proper MRP' },
      { value: addBatchDetails.sellingPrice, message: 'Please Provide Selling Price' },
      { value: addBatchDetails.purchasePrice, message: 'Please Provide Purchase Price' },
    ];

    for (const field of fields) {
      if (field.value === null || field.value === '') {
        showSnackbar(field.message, 'error');
        return false;
      }
    }

    return true;
  };

  const addingBatchDrawer = () => {
    setEdditingBatch(false);
    setBatchNumber('');
    setAddBatchDetails({
      quantity: null,
      availableUnits: null,
      mrp: null,
      sellingPrice: null,
      purchasePrice: null,
      expiryDate: null,
    });
    setOpenEditBatch(true);
  };

  const resetFormFields = () => {
    setBatchNumber('');
    setAddBatchDetails({
      quantity: '',
      availableUnits: '',
      mrp: '',
      sellingPrice: '',
      purchasePrice: '',
      expiryDate: null,
    });
  };

  const handleSaveAddBatch = () => {
    if (batchCheck) {
      const validDetails = batchValidator();
      if (!validDetails) {
        return;
      }
      setSavingBatchDetailsLoader(true);
      let newBatches = inventoryData?.multipleBatchCreations || [];
      if (edditingBatch) {
        newBatches = newBatches?.map((item) => {
          if (item?.batchId === batchNumber) {
            return {
              ...item,
              batchId: batchNumber,
              expiryDate: addBatchDetails?.expiryDate,
              mrp: addBatchDetails?.mrp,
              quantity: addBatchDetails?.quantity,
              sellingPrice: addBatchDetails?.sellingPrice,
              availableUnits: addBatchDetails?.availableUnits,
              purchasePrice: addBatchDetails?.purchasePrice,
            };
          }

          return item;
        });
      } else {
        newBatches.unshift({
          batchId: batchNumber,
          expiryDate: addBatchDetails?.expiryDate,
          mrp: addBatchDetails?.mrp,
          quantity: addBatchDetails?.quantity,
          sellingPrice: addBatchDetails?.sellingPrice,
          availableUnits: addBatchDetails?.availableUnits,
          purchasePrice: addBatchDetails?.purchasePrice,
        });
      }

      const createPayload = {
        multipleBatchCreations: newBatches,
        productId: productDetails?.id,
        locationId: locId,
        createdBy: userName,
        sourceId: orgId,
        gtin: gtin,
        orgId: orgId,
        locationType: 'RETAIL',
        itemName: selectedVariant?.name,
        category: productDetails?.appCategories?.categoryLevel1?.[0],
        brand: productDetails?.companyDetail?.brand,
        subCategory: productDetails?.appCategories?.categoryLevel2?.[0],
        multipleBatchCreations: newBatches,
        packagingType: selectedVariant?.needsWeighingScaleIntegration ? 'weighingScale' : 'standard',
        sellingUnit: selectedVariant?.weightUnit,
        skuid: gtin,
        marginValue: inventoryData?.marginValue,
        marginType: inventoryData?.marginType,
        marginBasedOn: inventoryData?.marginBasedOn,
      };

      setBatchDetailsLoader(true);
      addProductInventory(createPayload)
        .then((res) => {
          showSnackbar('Batch Added Successfully', 'success');
          // setAllInventoryData(createPayload);
          setBackupData(createPayload);
          setSavingBatchDetailsLoader(false);
          // setAddBatch(false);
          resetFormFields();
          setTimeout(() => {
            setBatchDetailsLoader(false);
          }, 500);
        })
        .catch((error) => {
          showSnackbar(error, 'error');
        });
    } else {
      showSnackbar('Batch Number is not verified', 'error');
      return;
    }
  };

  const handleMultipleBatchCreate = (newBatchData) => {
    const mandatoryFields = ['batchNo', 'quantity', 'mrp', 'sellingPrice', 'purchasePrice', 'expiry'];

    const isMissingFields = newBatchData?.some((detail) =>
      mandatoryFields?.some((field) => !detail?.[field] && detail?.[field] !== 0),
    );

    if (isMissingFields) {
      showSnackbar('Fill all required details', 'error');
      return;
    }

    const updatedBatchDetails = newBatchData?.map((detail) => ({
      quantity: detail?.quantity,
      expiryDate: detail?.expiry,
      purchasePrice: detail?.purchasePrice,
      sellingPrice: detail?.sellingPrice,
      mrp: detail?.mrp,
      batchId: detail?.batchNo?.replace(/\s+/g, ''),
      inventoryId: detail?.inventoryId,
      availableUnits: detail?.availableUnits,
    }));

    setSaveLoader(true);
    const payload = {
      productId: productDetails?.id,
      locationId: locId,
      createdBy: userName,
      sourceId: orgId,
      gtin: gtin,
      orgId: orgId,
      locationType: 'RETAIL',
      itemName: selectedVariant?.name,
      category: productDetails?.appCategories?.categoryLevel1?.[0],
      brand: productDetails?.companyDetail?.brand,
      subCategory: productDetails?.appCategories?.categoryLevel2?.[0],
      multipleBatchCreations: updatedBatchDetails,
      packagingType: selectedVariant?.needsWeighingScaleIntegration ? 'weighingScale' : 'standard',
      sellingUnit: selectedVariant?.weightUnit,
      skuid: gtin,
      marginValue: inventoryData?.marginValue,
      marginType: inventoryData?.marginType,
      marginBasedOn: inventoryData?.marginBasedOn,
    };

    addProductInventory(payload)
      .then((res) => {
        setSaveLoader(false);
        if (res?.data?.data?.es === 1) {
          showSnackbar(res?.data?.data?.message, 'error');
          return;
        }
        showSnackbar('Batch Added Successfully', 'success');
        setOpenEditBatch(false);
        setReloadBatchDetails(!reloadBatchDetails);
      })
      .catch(() => {
        setSaveLoader(false);
        showSnackbar('Some error occured', 'error');
      });
  };

  useEffect(() => {
    if (pricingDetail?.length > 0) {
      setBatchDetails(pricingDetail);
    } else {
      setBatchDetails([
        {
          id: 0,
          batchId: '',
          quantity: '',
          availableUnits: '',
          mrp: '',
          sellingPrice: '',
          purchasePrice: '',
          expiryDateApi: '',
          isNew: true,
        },
      ]);
    }
  }, [pricingDetail]);

  const handleInputChange = (index, field, value, isExisting = true) => {
    try {
      const updatedDetails = [...batchDetails];

      updatedDetails[index][field] = value;
      setBatchDetails(updatedDetails);
    } catch (err) {
      console.error('Error in handleInputChange:', err);
    }
  };

  const handleAddMore = () => {
    setBatchDetails([
      ...batchDetails,
      {
        batchId: '',
        quantity: '',
        availableUnits: '',
        mrp: '',
        sellingPrice: '',
        purchasePrice: '',
        expiryDateApi: '',
        isNew: true,
      },
    ]);
  };

  const handleDelete = (index) => {
    const updatedDetails = batchDetails.filter((_, i) => i !== index);
    setBatchDetails(updatedDetails);
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const month = `0${d.getMonth() + 1}`.slice(-2);
    const day = `0${d.getDate()}`.slice(-2);
    return `${d.getFullYear()}-${month}-${day}`;
  };

  return (
    <div>
      <SoftBox>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography className="products-new-details-pack-typo"> Batch Details </Typography>
          <div className="products-new-department-right-bar">
            {/* <button
              onClick={() => {
                handleOpenNew();
                setIsEditable(true);
              }}
              style={{ marginRight: '10px' }}
            >
              <ModeEditIcon />
            </button> */}
            <button
              onClick={() => {
                handleOpenNew();
                setIsEditable(false);
              }}
            >
              + New
            </button>
          </div>
        </div>

        <SoftBox mb={2} mt={2}>
          <DataGrid
            sx={{ ...dataGridStyles.header, borderRadius: '24px', cursor: 'pointer' }}
            columns={columns}
            rows={mergedData}
            pagination
            pageSize={5}
            disableHover
            autoHeight
            disableSelectionOnClick
            getRowId={(row) => row.batchId}
          />

          {openPOModal && (
            <BatchPODetail
              openPOModal={openPOModal}
              setOpenPOModal={setOpenPOModal}
              setSelectedPONum={setSelectedPONum}
              selectedPONum={selectedPONum}
              setSelectedReqType={setSelectedReqType}
              selectedReqType={selectedReqType}
            />
          )}
        </SoftBox>
      </SoftBox>

      {/* create edit batch popup */}
      <BatchDetailsDialog
        openEditBatch={openEditBatch}
        setOpenEditBatch={setOpenEditBatch}
        batchDetails={batchDetails}
        handleInputChange={handleInputChange}
        handleDelete={handleDelete}
        handleAddMore={handleAddMore}
        handleMultipleBatchCreate={handleMultipleBatchCreate}
        formatDate={formatDate}
        saveLoader={saveLoader}
        setSaveLoader={setSaveLoader}
        isEditable={isEditable}
        selectedIndex={selectedIndex}
        setSelectedIndex={setSelectedIndex}
        reloadBatchDetails={reloadBatchDetails}
        setReloadBatchDetails={setReloadBatchDetails}
      />

      <Drawer
        anchor="right"
        open={openDrawer}
        PaperProps={{
          sx: {
            width: '100%',
            height: '100dvh',
            backgroundColor: 'white !important',
            borderRadius: '0px !important',
            margin: '0px !important',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
          },
        }}
      >
        <SoftBox className="main-back-drawer-div">
          <ArrowBackIosNewIcon onClick={handleBatchClose} />
          <SoftBox className="add-batch-main-div">
            <SoftBox className="add-batch-drawer-label-input">
              <SoftBox className="batch-label">
                <SoftTypography className="input-label-add-batch">Batch Number</SoftTypography>
                {!edditingBatch && batchNumber !== '' ? (
                  verifyingBatch ? (
                    <p className="verifyingBatch">Verifying Batch..</p>
                  ) : batchCheck ? (
                    <p className="verifiedBatch">Batch Verified</p>
                  ) : (
                    batchAlreadyPresent && <p className="alreadyPresent">Batch Already Present</p>
                  )
                ) : null}
              </SoftBox>
              <SoftInput
                disabled={edditingBatch}
                value={batchNumber}
                placeholder="Add Batch Number"
                onChange={(e) => setBatchNumber(e.target.value)}
              />
            </SoftBox>
            <SoftBox className="add-batch-drawer-label-input">
              <SoftTypography className="input-label-add-batch">Quantity</SoftTypography>
              <SoftInput
                value={addBatchDetails?.quantity}
                name="quantity"
                placeholder="Add Quantity"
                type="number"
                onChange={batchDetailsHandler}
              />
            </SoftBox>
            <SoftBox className="add-batch-drawer-label-input">
              <SoftTypography className="input-label-add-batch">Available Units</SoftTypography>
              <SoftInput
                name="availableUnits"
                placeholder="Add Available Units"
                type="number"
                value={addBatchDetails?.availableUnits}
                onChange={batchDetailsHandler}
              />
            </SoftBox>
            <SoftBox className="add-batch-drawer-label-input">
              <SoftTypography className="input-label-add-batch">Mrp </SoftTypography>
              <SoftInput
                value={addBatchDetails?.mrp}
                name="mrp"
                placeholder="Add Mrp"
                type="number"
                onChange={batchDetailsHandler}
              />
            </SoftBox>
            <SoftBox className="add-batch-drawer-label-input">
              <SoftTypography className="input-label-add-batch">Selling Price </SoftTypography>
              <SoftInput
                name="sellingPrice"
                placeholder="Add Selling Price"
                type="number"
                value={addBatchDetails?.sellingPrice}
                onChange={batchDetailsHandler}
              />
            </SoftBox>
            <SoftBox className="add-batch-drawer-label-input">
              <SoftTypography className="input-label-add-batch">Purchase Price</SoftTypography>
              <SoftInput
                name="purchasePrice"
                placeholder="Add Purchase Price"
                type="number"
                value={addBatchDetails?.purchasePrice}
                onChange={batchDetailsHandler}
              />
            </SoftBox>
            <SoftBox className="add-batch-drawer-label-input">
              <SoftTypography className="input-label-add-batch">Expiry Date</SoftTypography>
              <SoftDatePicker
                value={addBatchDetails?.expiryDate}
                name="expiryDate"
                placeholder="Add Expiry Date"
                onChange={batchDetailsHandler}
              />
            </SoftBox>
          </SoftBox>
        </SoftBox>
        <SoftBox className="cancel-save-add-batch-btns">
          <SoftButton color="info" variant="outlined" onClick={() => setOpenDrawer(false)}>
            Cancel
          </SoftButton>
          <SoftButton color="info" variant="contained" onClick={handleSaveAddBatch}>
            {savingBatchDetailsLoader ? (
              <CircularProgress
                sx={{ color: 'white !important', height: '15px !important', width: '15px !important' }}
              />
            ) : (
              'Save'
            )}
          </SoftButton>
        </SoftBox>
      </Drawer>
    </div>
  );
};

export default ProductBatchDetails;
