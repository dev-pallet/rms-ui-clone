import './all-product-card.css';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Chip,
  CircularProgress,
  Divider,
  Drawer,
  Grid,
  IconButton,
  List,
  ListItem,
  Popover,
  Stack,
  Typography,
} from '@mui/material';
import { addProductInventory, getInventoryDetails, verifyBatch } from '../../../../../../config/Services';
import { useDebounce } from 'usehooks-ts';
import { useSnackbar } from '../../../../../../hooks/SnackbarProvider';
import { useSoftUIController } from '../../../../../../context';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import BatchDetails from '../batchDetails-info-card';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import React, { useEffect, useState } from 'react';
import SaveIcon from '@mui/icons-material/Save';
import SoftBox from '../../../../../../components/SoftBox';
import SoftButton from '../../../../../../components/SoftButton';
import SoftDatePicker from '../../../../../../components/SoftDatePicker';
import SoftInput from '../../../../../../components/SoftInput';
import SoftTypography from '../../../../../../components/SoftTypography';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import moment from 'moment';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const AllProductCard = ({
  product,
  index,
  navigateToDetailsPage,
  isSearching,
  searchedResultLength,
  scanned,
  barcodeNumber,
}) => {
  const noImage =
    'https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg';

  const [batchDetailsLoader, setBatchDetailsLoader] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const locId = localStorage.getItem('locId');
  const showSnackbar = useSnackbar();
  const [isBatchEditing, setIsBatchEditing] = useState(false);
  const [allInventoryData, setAllInventoryData] = useState();
  const [backupData, setBackupData] = useState();
  const [updateLoader, setUpdateLoader] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [addBatch, setAddBatch] = useState(false);
  const [batchNumber, setBatchNumber] = useState('');
  const [batchCheck, setBatchCheck] = useState(false);
  const [addBatchDetails, setAddBatchDetails] = useState({
    quantity: null,
    availableUnits: null,
    mrp: null,
    sellingPrice: null,
    purchasePrice: null,
    expiryDate: null,
  });
  const [edditingBatch, setEdditingBatch] = useState(false);
  const [verifyingBatch, setVerifyingBatch] = useState();
  const [batchAlreadyPresent, setBatchAlreadyPresent] = useState();
  const [savingBatchDetailsLoader, setSavingBatchDetailsLoader] = useState(false);
  const [productAnalysis, setProductAnalysis] = useState();
  const [controller, dispatch] = useSoftUIController();
  const { allProductsFilter } = controller;
  const barcode = allProductsFilter?.barcodeNumber?.[0] ? allProductsFilter?.barcodeNumber?.[0] : product?.gtin;

  const fetchingBatchDetails = () => {
    setBatchDetailsLoader(true);
    getInventoryDetails(locId, barcodeNumber[0])
      .then((res) => {
        if (res?.data?.data?.es === 1) {
          setBatchDetailsLoader(false);
        } else {
          const analysisData = {
            inventoryAnalysis: res?.data?.data?.data?.inventoryAnalysis,
            salesAnalysis: res?.data?.data?.data?.salesAnalysis,
            profitAnalysis: res?.data?.data?.data?.salesProfitAnalysis,
          };
          setProductAnalysis(analysisData);
          setAllInventoryData(res?.data?.data?.data);
          setBackupData(res?.data?.data?.data);
          setBatchDetailsLoader(false);
        }
      })
      .catch((err) => {
        showSnackbar(err, 'error');
        setBatchDetailsLoader(false);
      });
  };

  const updatingBatchDetails = () => {
    if (!isChanged) {
      showSnackbar('Update Details or cancel updation', 'error');
      return;
    }
    setUpdateLoader(true);
    const adjustedPayload = {
      ...allInventoryData,
    };
    const foundItem = allInventoryData?.multipleBatchCreations?.find((item) => item?.expiryDate === '');
    const zeroValueMrp = allInventoryData?.multipleBatchCreations?.find((item) => item?.mrp === '');
    const zeroValueAQty = allInventoryData?.multipleBatchCreations?.find((item) => item?.availableUnits === '');
    if (foundItem) {
      showSnackbar('Please provide proper expiry date');
      setUpdateLoader(false);
      return;
    } else if (zeroValueMrp) {
      showSnackbar('Mrp field cannot be empty');
      setUpdateLoader(false);
      return;
    } else if (zeroValueAQty) {
      showSnackbar('Available Quanity field cannot be empty');
      setUpdateLoader(false);
      return;
    }
    addProductInventory(adjustedPayload)
      .then((res) => {
        showSnackbar('Batch Adjusted Successfully', 'success');
        setAllInventoryData(adjustedPayload);
        setBackupData(adjustedPayload);
        setIsChanged(false);
        setUpdateLoader(false);
        setIsBatchEditing(false);
      })
      .catch((error) => {
        showSnackbar(error, 'error');
      });
  };

  const cancelBatchDetailsUpdation = () => {
    setAllInventoryData(backupData);
    setIsBatchEditing(false);
  };

  const editingFullBatchHandler = (batchId) => {
    setAddBatch(true);
    setEdditingBatch(true);
    setBatchCheck(true);

    setAddBatchDetails((prev) => {
      const updateBatches = allInventoryData?.multipleBatchCreations?.find((item) => item?.batchId === batchId);
      // console.log({updateBatches});
      setBatchNumber(updateBatches?.batchId);
      setAddBatchDetails((prev) => ({
        quantity: updateBatches?.quantity,
        availableUnits: updateBatches?.availableUnits,
        mrp: updateBatches?.mrp,
        sellingPrice: updateBatches?.sellingPrice,
        purchasePrice: updateBatches?.purchasePrice,
        expiryDate: updateBatches?.expiryDate,
      }));
    });
  };

  useEffect(() => {
    if (searchedResultLength === 1) {
      fetchingBatchDetails();
    }
  }, [searchedResultLength, barcodeNumber]);

  const debouncedValue = useDebounce(batchNumber, 500);

  const batchChange = () => {
    setBatchCheck(false);
    setBatchAlreadyPresent(false);
    setVerifyingBatch(true);
    verifyBatch(locId, barcodeNumber, debouncedValue)
      .then((res) => {
        if (res?.data?.data?.object?.available === true) {
          showSnackbar('Batch Already Present');
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

  const batchDetailsHandler = (e) => {
    const name = e?.target?.name;
    const value = e?.target?.value;
    setAddBatchDetails((prev) => ({
      ...prev,
      [e.target === undefined ? 'expiryDate' : name]:
        e.target === undefined ? (e.length === 0 ? null : moment(e?.[0]).format('YYYY-MM-DD')) : value,
    }));
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
    setAddBatch(true);
  };

  const handleBatchClose = () => {
    setAddBatch(false);
  };

  const handleSaveAddBatch = () => {
    if (batchCheck) {
      const validDetails = batchValidator();
      if (!validDetails) {
        return;
      }
      setSavingBatchDetailsLoader(true);
      let newBatches = allInventoryData?.multipleBatchCreations;
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
        ...allInventoryData,
        multipleBatchCreations: newBatches,
      };

      setBatchDetailsLoader(true);
      addProductInventory(createPayload)
        .then((res) => {
          showSnackbar('Batch Added Successfully', 'success');
          setAllInventoryData(createPayload);
          setBackupData(createPayload);
          setSavingBatchDetailsLoader(false);
          setAddBatch(false);
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

  const batchValidator = () => {
    if (addBatchDetails.quantity === null || addBatchDetails.quantity === '') {
      showSnackbar('Please Provide Proper Quantity', 'error');
      return false;
    } else if (addBatchDetails.availableUnits === null || addBatchDetails.availableUnits === '') {
      showSnackbar('Please Provide Available Quantity', 'error');
      return false;
    } else if (addBatchDetails.mrp === null || addBatchDetails.mrp === '') {
      showSnackbar('Please Provide Proper MRP', 'error');
      return false;
    } else if (addBatchDetails.sellingPrice === null || addBatchDetails.sellingPrice === '') {
      showSnackbar('Please Provide Selling Price', 'error');
      return false;
    } else if (addBatchDetails.purchasePrice === null || addBatchDetails.purchasePrice === '') {
      showSnackbar('Please Provide Purchase Price', 'error');
      return false;
    }

    return true;
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

  const categoryColour = (data) => {
    switch (data) {
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

  const analysisMapping = [
    { analysisTypeName: 'Inventory', analysisTypeValue: 'inventoryAnalysis', analysisType: 'INVENTORY' },
    { analysisTypeName: 'Sales', analysisTypeValue: 'salesAnalysis', analysisType: 'SALES' },
    { analysisTypeName: 'Profit', analysisTypeValue: 'profitAnalysis', analysisType: 'PROFIT' },
    // {analysisTypeName: 'Batch Health',analysisTypeValue: ''},
  ];

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'variant-popover' : undefined;

  return (
    <SoftBox className="prdt-wrapper">
      <SoftBox className="po-box-shadow product-card-main-wrapper">
        <SoftBox
          className="all-prdt-main-wrapper"
          // onClick={() => navigateToDetailsPage(product?.gtin)}
          key={index + 1}
        >
          <SoftBox className="all-prdt-info-wrapper">
            <SoftBox className="all-prdt-img-div" onClick={() => navigateToDetailsPage(product?.gtin)}>
              <img src={product?.image || noImage} className="all-prdt-img" />
            </SoftBox>
            <SoftBox className="all-prdt-info-div">
              <Stack>
                <Typography fontSize="16px" fontWeight={700}>
                  {product?.product}
                </Typography>
                <div style={{ display: 'flex' }}>
                  <Typography fontSize="12px">Barcode: {product?.variants?.[0]?.barcodes?.[0] || 'NA'}</Typography>

                  {/* Show dropdown if there are more variants */}
                  {product?.variants?.length > 1 && (
                    <>
                      <IconButton aria-describedby={id} onClick={handleClick} style={{ marginTop: '-10px' }}>
                        <ArrowDropDownIcon />
                      </IconButton>

                      {/* Popover to display additional variant barcodes */}
                      <Popover
                        id={id}
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'left',
                        }}
                      >
                        <List>
                          {product?.variants?.slice(1).map((variant, variantIndex) => (
                            <ListItem key={variant.variantId}>
                              <List>
                                {variant?.barcodes?.map((barcode, index) => (
                                  <Typography fontSize="12px" key={index}>
                                    {barcode}
                                  </Typography>
                                ))}
                              </List>
                            </ListItem>
                          ))}
                        </List>
                      </Popover>
                    </>
                  )}
                </div>
              </Stack>
              <Divider sx={{ margin: '5px !important' }} />
              <Stack
                direction="row"
                alignItems="flex-start"
                justifyContent="space-between"
                onClick={() => navigateToDetailsPage(product?.gtin)}
              >
                {/* {searchedResultLength === '1' && ( */}
                {/* <> */}
                <Stack alignItems="flex-start">
                  <Typography fontSize="12px">MRP</Typography>
                  <Typography fontSize="14px" fontWeight={700}>
                    {product?.mrp}
                  </Typography>
                </Stack>
                <Stack alignItems="center">
                  <Typography fontSize="12px">SP</Typography>
                  <Typography fontSize="14px" fontWeight={700}>
                    {product?.salePrice}
                  </Typography>
                </Stack>
                {/* </> */}
                {/* )} */}
                {/* {(searchedResultLength !== '1') && (
                  <Stack alignItems="flex-start">
                    <Typography fontSize="12px">Manufacturer</Typography>
                    <Typography fontSize="14px" fontWeight={700}>
                      {product?.manufacturer}
                    </Typography>
                  </Stack>
                )} */}
                <Stack alignItems="flex-end">
                  <Typography fontSize="12px">Brand</Typography>
                  <Typography fontSize="14px" fontWeight={700}>
                    {product?.brand}
                  </Typography>
                </Stack>
              </Stack>
              {/* {searchedResultLength !== '1' && <Divider sx={{ margin: '5px !important' }} />} */}
              {/* {searchedResultLength !== '1' && (
                <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
                  <Stack alignItems="flex-start">
                    <Typography fontSize="12px">MRP</Typography>
                    <Typography fontSize="14px" fontWeight={700}>
                      {product?.mrp}
                    </Typography>
                  </Stack>
                  <Stack alignItems="flex-end">
                    <Typography fontSize="12px">SP</Typography>
                    <Typography fontSize="14px" fontWeight={700}>
                      {product?.salePrice}
                    </Typography>
                  </Stack>
                </Stack>
               )} */}
            </SoftBox>
          </SoftBox>
          {searchedResultLength === 1 && (
            <SoftBox className="all-prdt-analysis-wrapper">
              {analysisMapping?.map((type) => {
                const analysisValue = getTagDescription(type?.analysisType, productAnalysis?.[type?.analysisTypeValue]);
                const valueColor = categoryColour(productAnalysis?.[type?.analysisTypeValue]);
                return (
                  <SoftBox className="analysis-type-main">
                    <Grid container>
                      <Grid item lg={3} md={3} sm={3} xs={3}>
                        <Typography className="analysis-type-typo">{type?.analysisTypeName}</Typography>
                      </Grid>
                      <Grid item lg={2} md={2} sm={2} xs={2}>
                        <Chip label={productAnalysis?.[type?.analysisTypeValue] || 'NA'} color={valueColor} />
                      </Grid>
                      <Grid item lg={7} md={7} sm={7} xs={7}>
                        <Chip label={analysisValue || 'NA'} color={valueColor} sx={{ width: '100%' }} />
                      </Grid>
                    </Grid>
                  </SoftBox>
                );
              })}
            </SoftBox>
          )}
          {/* <p>jabwjkdbhf</p> */}
        </SoftBox>
        {searchedResultLength === 1 && <UnfoldMoreIcon className="down-arrow-icon-batch-details" />}
      </SoftBox>
      {searchedResultLength === 1 && (
        <Accordion
          expanded={searchedResultLength === 1}
          className="batch-details-accordion po-box-shadow"
          // onChange={(e, expanded) => {
          //   if (expanded) {
          //     setIsExpanded(true);
          //     fetchingBatchDetails();
          //   } else {
          //     setIsExpanded(false);
          //   }
          // }}
        >
          <AccordionSummary
            aria-controls="panel1-content"
            id="panel1-header"
            className="batch-details-accordionSummary"
          >
            <Typography fontSize="12px" fontWeight={700}>
              {'Batch Details'}
            </Typography>
            {isBatchEditing ? (
              <SoftBox className="save-edit-icon-div">
                <CancelIcon sx={{ color: 'red' }} onClick={cancelBatchDetailsUpdation} />
                <SaveIcon onClick={updatingBatchDetails} sx={{ color: 'green' }} />
              </SoftBox>
            ) : (
              <EditIcon onClick={() => setIsBatchEditing(true)} sx={{ color: '#0562fb' }} />
            )}
          </AccordionSummary>
          <AccordionDetails className="accordion-details">
            <BatchDetails
              loader={batchDetailsLoader}
              isEditing={isBatchEditing}
              allInventoryData={allInventoryData}
              setAllInventoryData={setAllInventoryData}
              setIsBatchEditing={setIsBatchEditing}
              isBatchEditing={isBatchEditing}
              setIsChanged={setIsChanged}
              editingFullBatchHandler={editingFullBatchHandler}
              // updateLoader={updateLoader}
            />
            {updateLoader && (
              <SoftBox className="batch-details-update-loader-div">
                <CircularProgress sx={{ color: '#0562fb !important' }} />
              </SoftBox>
            )}
            <SoftButton
              color="info"
              variant="text"
              sx={{ float: 'right', margin: '5px 0 5px 0' }}
              onClick={addingBatchDrawer}
            >
              + Add New Batch
            </SoftButton>
          </AccordionDetails>
        </Accordion>
      )}
      <Drawer
        anchor="right"
        open={addBatch}
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
              <SoftTypography className="input-label-add-batch">Avalaible Units</SoftTypography>
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
          <SoftButton color="info" variant="outlined" onClick={() => setAddBatch(false)}>
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
    </SoftBox>
  );
};

export default AllProductCard;
