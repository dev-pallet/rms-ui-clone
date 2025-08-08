import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  IconButton,
  Button,
  InputLabel,
  CircularProgress,
} from '@mui/material';
import SoftTypography from '../../../../../../components/SoftTypography';
import SoftBox from '../../../../../../components/SoftBox';
import SoftInput from '../../../../../../components/SoftInput';
import SoftButton from '../../../../../../components/SoftButton';
import CloseIcon from '@mui/icons-material/Close';
import { updateBatchdetails } from '../../../../../../config/Services';
import SoftSelect from '../../../../../../components/SoftSelect';
const labelStyle = { fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' };
const BatchDetailsDialog = ({
  openEditBatch,
  setOpenEditBatch,
  batchDetails,
  handleInputChange,
  handleDelete,
  handleMultipleBatchCreate,
  formatDate,
  setReloadBatchDetails,
  saveLoader,
  isEditable,
  selectedIndex,
  setSelectedIndex,
  setSaveLoader,
  reloadBatchDetails,
}) => {
  const user_details = localStorage.getItem('user_details');
  const uidx = JSON.parse(user_details)?.uidx;
  const user_name = localStorage.getItem('user_name');
  const contextType = localStorage.getItem('contextType');
  const [newBatchData, setNewBatchData] = useState([]);
  const [rows, setRows] = useState([
    {
      batchNo: '',
      quantity: '',
      availableUnits: '',
      mrp: '',
      purchasePrice: '',
      sellingPrice: '',
      purchaseMargin: '',
      expiry: '',
    },
  ]);
  const handleRowInputChange = (index, field, value) => {
    const newRows = [...rows];
    newRows[index][field] = value;
    setRows(newRows);
  };

  const handleAddMore = () => {
    setRows([
      ...rows,
      {
        batchNo: '',
        quantity: '',
        availableUnits: '',
        mrp: '',
        purchasePrice: '',
        purchaseMargin: '',
        expiry: '',
      },
    ]);
  };
  const handleUpdateInputChange = (index, field, value) => {
    try {
      const updatedDetails = [...newBatchData];
      const currentData = updatedDetails[index];

      currentData[field] = value;

      if (field === 'mrp') {
        if (currentData.mrp > 0 && currentData.purchasePrice) {
          currentData.purchaseMargin = `${(
            ((currentData?.mrp - currentData?.purchasePrice) / currentData?.mrp) *
            100
          ).toFixed(1)}%`;
        } else {
          currentData.purchaseMargin = 'NA';
        }
      }

      setNewBatchData(updatedDetails);
    } catch (err) {
      console.error('Error in handleInputChange:', err);
    }
  };

  useEffect(() => {
    if (batchDetails?.length > 0) {
      const filteredBatch = batchDetails?.filter((item) => item.batchId === selectedIndex);
      let data = filteredBatch?.length > 0 ? filteredBatch : batchDetails;
      setNewBatchData(data || []);
    }
  }, [batchDetails, selectedIndex]);

  const renderInputField = (index, label, field, type = 'text', isExisting) => {
    let renderLabel = index === 0;
    let purchaseMarginValue;

    const removePercentage = (value) =>
      typeof value === 'string'
        ? value.endsWith('%')
          ? parseFloat(value.slice(0, -1))
          : (console.error('Invalid percentage format'), null)
        : (console.error('Input must be a string'), null);

    if (!isEditable) {
      renderLabel = true;
    }
    if (field === 'purchaseMargin') {
      purchaseMarginValue = removePercentage(newBatchData[index][field]);
    }

    const fieldArr = ['expiryDateApi', 'sellingMargin', 'sellingPrice', 'mrp'];
    let isDisabled = fieldArr?.includes(field);
    return (
      <Grid item xs={1.3} sm={1.3} md={1.3} mt={index === 0 ? '10px' : '-1px'}>
        {renderLabel && (
          <SoftBox mb={1} display="flex">
            <InputLabel required sx={labelStyle}>
              {label}
            </InputLabel>
          </SoftBox>
        )}
        {type === 'SoftSelect' ? (
          <SoftSelect
            size="small"
            options={[
              { value: 'MarkUp', label: 'Markup' },
              { value: 'MarkDown', label: 'MarkDown' },
            ]}
            placeholder="Margin type"
            onChange={(e) =>
              isEditable
                ? handleUpdateInputChange(index, field, e.value)
                : handleInputChange(index, field, e.value, isExisting)
            }
          ></SoftSelect>
        ) : (
          <SoftInput
            size="small"
            type={type}
            value={purchaseMarginValue ? purchaseMarginValue : newBatchData[index][field]}
            onChange={(e) =>
              isEditable
                ? handleUpdateInputChange(index, field, e.target.value)
                : handleInputChange(index, field, e.value, isExisting)
            }
            disabled={(isExisting && !isDisabled) || !isDisabled}
            icon={
              field === 'sellingMargin' || field === 'purchaseMargin'
                ? { component: '%', direction: 'right' }
                : undefined
            }
          />
        )}
      </Grid>
    );
  };

  const handleUpdateBatch = () => {
    setSaveLoader(true);
    const payload = {
      inventoryId: newBatchData?.[0]?.inventoryId,
      expiryDate: newBatchData?.[0]?.expiryDateApi,
      sellingPrice: newBatchData?.[0]?.sellingPrice,
      mrp: newBatchData?.[0]?.mrp,
      updatedBy: uidx,
      updatedByName: user_name,
      locationType: contextType,
    };
    updateBatchdetails(payload)
      .then((res) => {
        setSaveLoader(false);
        setOpenEditBatch(false);
        setSelectedIndex();
        setReloadBatchDetails(!reloadBatchDetails);
      })
      .catch((err) => {
        setSaveLoader(false);
        setOpenEditBatch(false);
        setSelectedIndex();
      });
  };
  const onCancel = () => {
    setRows([
      {
        batchNo: '',
        quantity: '',
        availableUnits: '',
        mrp: '',
        purchasePrice: '',
        sellingPrice: '',
        purchaseMargin: '',
        expiry: '',
      },
    ]);
  };
  const handleRowDelete = (index) => {
    setRows((prevRows) => {
      const updatedRows = [...prevRows];
      updatedRows.splice(index, 1);
      return updatedRows;
    });
  };

  return (
    <>
      <Dialog
        open={openEditBatch}
        onClose={() => {
          setOpenEditBatch(false);
          setSelectedIndex();
          onCancel();
        }}
        maxWidth={false}
        PaperProps={{ style: { width: 'auto', maxWidth: 'none', padding: '15px' } }}
      >
        <DialogTitle>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <SoftTypography variant="h6" fontWeight="bold">
              Batch Details
            </SoftTypography>
            <IconButton onClick={() => setOpenEditBatch(false)} size="small">
              <CloseIcon color="error" fontSize="small" />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent>
          {isEditable ? (
            <>
              {' '}
              {newBatchData?.map((detail, index) => {
                const isExisting = !detail.isNew;
                if (!isEditable && isExisting) {
                  return null;
                }
                return (
                  <SoftBox mt={1} key={index} style={{ minWidth: '900px' }}>
                    <Grid container spacing={3} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                      {renderInputField(index, 'Batch No', 'batchId', 'text', isExisting)}
                      {renderInputField(index, 'Quantity', 'quantity', 'number', isExisting)}
                      {renderInputField(index, 'Available Units', 'availableUnits', 'number', isExisting)}
                      {renderInputField(index, 'MRP', 'mrp', 'number', isExisting)}
                      {renderInputField(index, 'Selling Price', 'sellingPrice', 'number', isExisting)}
                      {renderInputField(index, 'Purchase Price', 'purchasePrice', 'number', isExisting)}
                      {renderInputField(index, 'Purchase margin', 'purchaseMargin', 'text', isExisting)}
                      {/* {renderInputField(index, 'Margin type', 'marginType', 'SoftSelect', isExisting)}
                {renderInputField(index, 'Selling margin', 'sellingMargin', 'number', isExisting)} */}
                      {renderInputField(index, 'Expiry Date', 'expiryDateApi', 'date', isExisting)}
                      <SoftBox className="close-icons" mt={index === 0 ? '52px' : '28px'} ml={'10px'} width="20px">
                        {isExisting ? (
                          <IconButton size="small">{/* <EditIcon /> */}</IconButton>
                        ) : (
                          <IconButton onClick={() => handleDelete(index, isExisting)} size="small">
                            <CloseIcon color="red" size="20px" />
                          </IconButton>
                        )}
                      </SoftBox>
                    </Grid>
                  </SoftBox>
                );
              })}
            </>
          ) : (
            <SoftBox mt={1} style={{ minWidth: '900px' }}>
              <Grid container spacing={3} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                {rows?.map((row, index) => (
                  <Grid item xs={12} display="flex">
                    <Grid container spacing={2} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                      <Grid item xs={1.4}>
                        <SoftBox mb={1} display="flex">
                          <InputLabel required sx={labelStyle}>
                            Batch no
                          </InputLabel>
                        </SoftBox>
                        <SoftInput
                          size="small"
                          value={row?.batchNo}
                          onChange={(e) => handleRowInputChange(index, 'batchNo', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={1.4}>
                        <SoftBox mb={1} display="flex">
                          <InputLabel required sx={labelStyle}>
                            Quantity
                          </InputLabel>
                        </SoftBox>
                        <SoftInput
                          type="number"
                          size="small"
                          value={row?.quantity}
                          onChange={(e) => handleRowInputChange(index, 'quantity', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={1.4}>
                        <SoftBox mb={1} display="flex">
                          <InputLabel required sx={labelStyle}>
                            Available Units
                          </InputLabel>
                        </SoftBox>
                        <SoftInput
                          size="small"
                          type="number"
                          value={row?.availableUnits}
                          onChange={(e) => handleRowInputChange(index, 'availableUnits', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={1.4}>
                        <SoftBox mb={1} display="flex">
                          <InputLabel required sx={labelStyle}>
                            MRP
                          </InputLabel>
                        </SoftBox>
                        <SoftInput
                          size="small"
                          type="number"
                          value={row?.mrp}
                          onChange={(e) => handleRowInputChange(index, 'mrp', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={1.4}>
                        <SoftBox mb={1} display="flex">
                          <InputLabel required sx={labelStyle}>
                            Selling Price
                          </InputLabel>
                        </SoftBox>
                        <SoftInput
                          type="number"
                          size="small"
                          value={row?.sellingPrice}
                          onChange={(e) => handleRowInputChange(index, 'sellingPrice', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={1.4}>
                        <SoftBox mb={1} display="flex">
                          <InputLabel required sx={labelStyle}>
                            Purchase Price
                          </InputLabel>
                        </SoftBox>
                        <SoftInput
                          type="number"
                          size="small"
                          value={row?.purchasePrice}
                          onChange={(e) => handleRowInputChange(index, 'purchasePrice', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={1.4}>
                        <SoftBox mb={1} display="flex">
                          <InputLabel required sx={labelStyle}>
                            Expiry
                          </InputLabel>
                        </SoftBox>
                        <SoftInput
                          size="small"
                          type="date"
                          value={row?.expiry}
                          onChange={(e) => handleRowInputChange(index, 'expiry', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={1.3}>
                        <IconButton onClick={() => handleRowDelete(index)} size="small" style={{ marginTop: '20px' }}>
                          <CloseIcon style={{ color: 'red' }} size="20px" />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Grid>
                ))}
                <Grid item xs={12}>
                  <Button onClick={handleAddMore} style={{ marginRight: 'auto' }}>
                    + Add more
                  </Button>
                </Grid>
              </Grid>
            </SoftBox>
          )}
        </DialogContent>
        <SoftBox display="flex" justifyContent="flex-end">
          <SoftButton
            className="vendor-second-btn"
            onClick={() => {
              setOpenEditBatch(false);
              setSelectedIndex();
              onCancel();
            }}
          >
            {' '}
            Cancel
          </SoftButton>
          <SoftBox ml={2}>
            <SoftBox ml={2}>
              <SoftButton
                color="info"
                className="vendor-add-btn"
                onClick={() => {
                  if (!saveLoader) isEditable ? handleUpdateBatch() : handleMultipleBatchCreate(rows);
                }}
              >
                {saveLoader ? (
                  <CircularProgress
                    sx={{ color: 'white !important', height: '15px !important', width: '15px !important' }}
                  />
                ) : (
                  'Save'
                )}
              </SoftButton>
            </SoftBox>
          </SoftBox>
        </SoftBox>
      </Dialog>
    </>
  );
};

export default BatchDetailsDialog;
