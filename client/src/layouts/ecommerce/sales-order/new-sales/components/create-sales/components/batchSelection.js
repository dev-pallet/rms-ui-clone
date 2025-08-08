import { Box, Card, CardContent, Grid, Modal } from '@mui/material';
import { formatDateDDMMYYYY } from '../../../../../Common/CommonFunction';
import { useSnackbar } from '../../../../../../../hooks/SnackbarProvider';
import { v4 as uuidv4 } from 'uuid';
import CancelIcon from '@mui/icons-material/Cancel';
import React, { useEffect, useState } from 'react';
import SoftBox from '../../../../../../../components/SoftBox';
import SoftInput from '../../../../../../../components/SoftInput';
import SoftTypography from '../../../../../../../components/SoftTypography';
import Spinner from '../../../../../../../components/Spinner';

const SalesOrdeBatchSelection = ({
  rowData,
  setRowData,
  openBatchModal,
  handleBatchModal,
  currIndex,
  currItem,
  inwardedData,
  addingToCart,
  setAddingToCart,
  productSelected,
  setProductSelected,
  handleItemDelete,
  deleteLoader,
  handleInputChange,
}) => {
  const showSnackbar = useSnackbar();
  const locId = localStorage.getItem('locId');
  const [loader, setLoader] = useState(true);
  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    if (inwardedData?.length > 0) {
      const newSelectedRows = Array(inwardedData?.length)?.fill(false);

      inwardedData?.forEach((item, index) => {
        const batchMatch = currItem?.batches?.some((batch) => batch?.batchNo === item?.batchId);
        if (batchMatch) {
          newSelectedRows[index] = true;
        }
      });

      setSelectedRows(newSelectedRows);
      setData(inwardedData);
      setLoader(false);
    } else {
      setLoader(false);
    }
  }, [inwardedData, currItem.batches]);

  function convertToISOFormat(dateString) {
    const date = new Date(dateString);
    return date.toISOString();
  }

  const handleCheckboxChange = (value, item, index) => {
    const updateRowData = [...rowData];
    const itemIndex = updateRowData?.findIndex((row) => row?.itemCode === (currItem?.gtin || currItem?.itemCode));
    if (value) {
      if (itemIndex !== -1) {
        // GTIN exists, add the batch to the existing item
        const existingItem = updateRowData[itemIndex];
        const batchExists = existingItem?.batches?.find((batch) => batch?.batchNo === item?.batchId);
        if (!batchExists) {
          existingItem.batches.push({
            batchNo: item?.batchId,
            purchasePrice: item?.purchasePrice ?? 0,
            mrp: item?.mrp ?? 0,
            sellingPrice: item?.sellingPrice ?? 0,
            quantity: '',
            expiryDate: item?.expiryDate ? convertToISOFormat(item?.expiryDate) : null,
          });
        }
        if (existingItem?.id === '') {
          setAddingToCart(currIndex + 1);
        }
      } else {
        // GTIN does not exist, add a new item with the batch
        const newRow = {
          itemId: uuidv4(),
          id: '',
          itemCode: currItem?.gtin,
          itemName: currItem?.name,
          spec: currItem?.weights_and_measures
            ? currItem?.weights_and_measures?.net_weight + ' ' + currItem?.weights_and_measures?.measurement_unit
            : '',
          hsnCode: currItem?.hs_code || 0,
          igst: currItem?.igst || 0,
          cgst: currItem?.cgst || 0,
          sgst: currItem?.sgst || 0,
          cess: currItem?.cess || 0,
          batches: [
            {
              batchNo: item?.batchId,
              purchasePrice: item?.purchasePrice ?? 0,
              mrp: item?.mrp ?? 0,
              sellingPrice: item?.sellingPrice ?? 0,
              quantity: '',
              expiryDate: formatDateDDMMYYYY(item?.expiryDate) || null,
            },
          ],
        };
        updateRowData.push(newRow);
        if (!newRow?.id === '') {
          setAddingToCart(currIndex + 1);
        }
      }

      const newSelectedRows = [...selectedRows];
      newSelectedRows[index] = true;
      setSelectedRows(newSelectedRows);
    } else {
      if (itemIndex !== -1) {
        const existingItem = updateRowData[itemIndex];
        existingItem.batches = existingItem?.batches?.filter((batch) => batch?.batchNo !== item?.batchId);

        // if (existingItem?.batches?.length === 0) {
        //   handleItemDelete(currIndex);
        //   return;
        // }
      }
      const newSelectedRows = [...selectedRows];
      newSelectedRows[index] = false;
      setSelectedRows(newSelectedRows);
      const totalQty = updateRowData[currIndex]?.batches?.reduce((acc, item) => acc + Number(item?.quantity || 0), 0);
      handleInputChange(itemIndex, 'quantityOrdered', totalQty ? totalQty : 1);
    }

    setRowData(updateRowData);
  };

  const handleChange = (value, item, index) => {
    const updateRowData = [...rowData];
    const itemIndex = updateRowData?.findIndex((row) => row?.itemCode === (currItem?.gtin || currItem?.itemCode));
    if (itemIndex !== -1) {
      const existingItem = updateRowData[itemIndex];
      const batchIndex = existingItem?.batches?.findIndex((batch) => batch?.batchNo === item?.batchId);

      if (batchIndex !== -1) {
        existingItem.batches[batchIndex].quantity = parseFloat(value);
        handleInputChange(itemIndex, 'quantityOrdered', 0);
      }
    }
    if (updateRowData[currIndex]?.batches?.length > 0) {
      const totalQty = updateRowData[currIndex]?.batches?.reduce((acc, item) => acc + Number(item?.quantity || 0), 0);
      updateRowData[currIndex]['quantityOrdered'] = totalQty ? totalQty : 1;
    }
    setRowData(updateRowData);
  };

  return (
    <Modal
      open={openBatchModal}
      onClose={handleBatchModal}
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
            <SoftBox display="flex" justifyContent="space-between">
              <SoftTypography fontSize="16px" fontWeight="bold">
                Select batch for {rowData[currIndex]?.itemCode}
              </SoftTypography>
              <CancelIcon color="error" cursor="pointer" onClick={handleBatchModal} />
            </SoftBox>
          </Grid>
          {loader ? (
            <Box className="centerspinner" style={{ height: 445, width: '100%' }}>
              <Spinner />
            </Box>
          ) : (
            data?.map((item, index) => {
              const isBrcode = rowData?.find((ele) => ele?.itemCode === item?.itemCode);
              const batch = rowData[currIndex]?.batches?.find((batch) => batch?.batchNo === item?.batchId);
              return (
                <Grid item xs={12} md={12} key={item?.inventoryId}>
                  <Card sx={{ width: '100%' }}>
                    <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <SoftBox mb={1} ml={-2} lineHeight={0} display="flex" gap="10px">
                          <input
                            style={{ cursor: 'pointer' }}
                            disabled={addingToCart !== '' || deleteLoader ? true : false}
                            type="checkbox"
                            checked={selectedRows[index] || false}
                            onChange={(e) => handleCheckboxChange(e.target.checked, item, index)}
                          />
                          <SoftTypography fontSize="12px">
                            <b>Batch No:</b> {item?.batchId}
                          </SoftTypography>
                        </SoftBox>
                        <SoftBox mb={1} ml={0.5} lineHeight={0}>
                          <SoftTypography fontSize="12px">
                            <b>Available qty :</b> {item?.availableUnits}
                          </SoftTypography>
                        </SoftBox>
                        <SoftBox mb={1} ml={0.5} lineHeight={0}>
                          <SoftTypography fontSize="12px">
                            <b>MRP :</b> {item?.mrp}
                          </SoftTypography>
                        </SoftBox>
                        <SoftBox mb={1} ml={0.5} lineHeight={0}>
                          <SoftTypography fontSize="12px">
                            <b>Selling price :</b> {item?.sellingPrice}
                          </SoftTypography>
                        </SoftBox>
                        <SoftBox mb={1} ml={0.5} lineHeight={0}>
                          <SoftTypography fontSize="12px">
                            <b>Purchase price :</b> {item?.purchasePrice}
                          </SoftTypography>
                        </SoftBox>
                        <SoftBox mb={1} ml={0.5} lineHeight={0}>
                          <SoftTypography fontSize="12px">
                            <b>Expiry date :</b> {item?.expiryDate ? formatDateDDMMYYYY(item?.expiryDate) : 'NA'}
                          </SoftTypography>
                        </SoftBox>
                        <SoftBox mb={1} ml={0.5} lineHeight={0}>
                          <SoftTypography fontSize="12px">
                            <b>Quantity :</b>
                          </SoftTypography>
                          <SoftInput
                            type="number"
                            value={batch ? batch.quantity : ''}
                            onChange={(e) => handleChange(e.target.value, item, index)}
                            disabled={selectedRows[index] ? false : true}
                          />
                        </SoftBox>
                      </div>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })
          )}
        </Grid>
      </Box>
    </Modal>
  );
};

export default SalesOrdeBatchSelection;
