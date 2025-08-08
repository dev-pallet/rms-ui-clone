import './pi-det-card.css';
import { Box, Chip, Divider, Menu, Stack, Typography, useMediaQuery } from '@mui/material';
import { useSnackbar } from '../../../../../hooks/SnackbarProvider';
import CancelIcon from '@mui/icons-material/Cancel';
import CircularProgress from '@mui/material/CircularProgress';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FlagIcon from '@mui/icons-material/Flag';
import React, { memo, useEffect, useState } from 'react';
import SaveIcon from '@mui/icons-material/Save';
import SoftBox from '../../../../../components/SoftBox';

const PiDetailsPrdtCard = memo(
  ({
    data,
    index,
    setEditingGtin,
    editingGtin,
    editPiItems,
    setRowId,
    setQuantChange,
    editQuantLoader,
    setEditQuantLoader,
    categoryColour,
    getTagDescription,
    isCreated,
  }) => {
    const is420px = useMediaQuery('(max-width: 420px)');
    const showSnackbar = useSnackbar();
    const [editInputValue, setEditInputValue] = useState(data?.quantityOrdered);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState('');
    const [receivedValue, setReceivedValue] = useState(0);

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };

    const qtyReceivedValue = Math.abs(data.quantityOrdered - data.quantityLeft);
    const fillRate = () => {
      const percentage = ((qtyReceivedValue / data.quantityOrdered) * 100).toString();
      const truncatedPercentage = percentage.replace(/(\.\d\d)\d*/, '$1');
      return (truncatedPercentage !== 'NaN' ? truncatedPercentage : '0') + '%';
      // const isValid = regex.test()
    };

    const handleCancelQuantity = () => {
      // setEditInputValue(data?.quantityOrdered);
      // setIsEditing(false);
      // setEditingGtin('');
      setIsEditing(false);
      setEditingId('');
      setEditingGtin('');
    };

    const handleEdit = () => {
      if (editingGtin === '1' && isEditing === false) {
        showSnackbar('Cannot edit two product at once', 'error');
        return;
      }
      if (isEditing && !editQuantLoader) {
        setIsEditing(false);
        setEditingGtin('');
      } else {
        setIsEditing(true);
        setEditingGtin('1');
      }
      setEditingId(data?.id);
    };

    const handleSave = () => {
      setQuantChange(editInputValue);

      // if (editingGtin === '1' && isEditing === false) {
      //   showSnackbar('Cannot edit two product at once', 'error');
      //   return;
      // }
      // if (isEditing && !editQuantLoader) {
      //   setIsEditing(false);
      //   setEditingGtin('');
      // } else {
      //   setIsEditing(true);
      //   setEditingGtin('1');
      // }
    };

    useEffect(() => {
      if (isEditing && !editQuantLoader) {
        setIsEditing(false);
        setEditingId('');
        setEditingGtin('');
        // setEditQuantLoader(false);
      }
    }, [editQuantLoader]);

    const handleQuantityChange = (e, rowId) => {
      setEditInputValue(e.target.value);
      setRowId(rowId);
    };

    return (
      <SoftBox
        className="pi-det-prdt-card-main-div"
        sx={{ borderTop: index === 0 && 'unset !important', paddingTop: index === 0 && 'unset !important' }}
      >
        {/* <SoftBox className="pi-det-prdt-card-img-div">
        <img
          src="https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg"
          alt=""
          className="pi-prdt-image"
        />
      </SoftBox> */}
        <Stack sx={{ width: '100%' }}>
          <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
            <Stack>
              <Typography fontSize="16px" fontWeight="bold">
                {is420px ? data?.itemName.slice(0, 13) + '...' : data?.itemName}
              </Typography>
              <Typography fontSize="12px">EAN: {data?.itemCode}</Typography>
              <Typography fontSize="12px">
                (MRP: {data?.finalPrice}, Spec: {data?.spec})
              </Typography>
            </Stack>
            {/* <Stack alignItems="flex-end">
            <Typography fontSize="12px">Spec</Typography>
            <Typography fontSize="14px" fontWeight="bold">
              {data.specification}
            </Typography>
          </Stack> */}
            {isCreated && (
              <Stack direction={'row'} gap="5px">
                <>
                  {isEditing ? (
                    editQuantLoader ? (
                      <CircularProgress size={20} sx={{ color: '#0562fb !important' }} />
                    ) : (
                      <>
                        <SaveIcon
                          fontSize="medium"
                          sx={{ padding: '0px !important', color: '#0562fb' }}
                          onClick={handleSave}
                        />
                        <CancelIcon
                          fontSize="medium"
                          sx={{ padding: '0px !important', color: 'red' }}
                          onClick={handleCancelQuantity}
                        />
                      </>
                    )
                  ) : (
                    <EditIcon
                      fontSize="medium"
                      sx={{ padding: '0px !important', color: '#0562fb' }}
                      onClick={handleEdit}
                    />
                  )}
                </>
                <>
                  {editQuantLoader && !isEditing && data?.id === editingId ? (
                    <CircularProgress size={20} sx={{ color: '#0562fb !important' }} />
                  ) : (
                    <DeleteIcon
                      fontSize="medium"
                      sx={{ padding: '0px !important', color: 'red' }}
                      onClick={() => {
                        setEditingId(data?.id);
                        editPiItems({ isDelete: true, deleteId: [data?.id] });
                      }}
                    />
                  )}
                </>
              </Stack>
            )}
          </Stack>
          <Divider sx={{ margin: '5px !important' }} />
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack alignItems="flex-start">
              <Typography fontSize="12px">Qty</Typography>
              {isEditing ? (
                <input
                  type="text"
                  className="qty-editing-input"
                  placeholder="Enter Qty"
                  value={editInputValue}
                  onChange={(e) => handleQuantityChange(e, data?.id)}
                />
              ) : (
                <Typography fontSize="14px" fontWeight="bold">
                  {data.quantityOrdered}
                </Typography>
              )}
            </Stack>
            <Stack alignItems="center">
              <Typography fontSize="12px">Avl Stk</Typography>
              <Typography fontSize="14px" fontWeight="bold">
                {data.availableStk}
              </Typography>
            </Stack>
            <Stack alignItems="flex-end">
              <Typography fontSize="12px">Qty Left</Typography>
              <Typography fontSize="14px" fontWeight="bold">
                {data.quantityLeft}
              </Typography>
            </Stack>
          </Stack>
          <Divider sx={{ margin: '5px !important' }} />
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack alignItems="flex-start">
              <Typography fontSize="12px">Previous PP</Typography>
              <Typography fontSize="14px" fontWeight="bold">
                {data?.previousPurchasePrice}
              </Typography>
            </Stack>
            <Stack alignItems="center">
              <Typography fontSize="12px">Qty Received</Typography>
              <Typography fontSize="14px" fontWeight="bold">
                {qtyReceivedValue}
              </Typography>
            </Stack>

            <Stack alignItems="flex-end">
              <Typography fontSize="12px">Fill Rate</Typography>
              <Typography fontSize="14px" fontWeight="bold">
                {fillRate()}
              </Typography>
            </Stack>
          </Stack>
          <Divider sx={{ margin: '5px !important' }} />
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack alignItems="flex-start">
              <Typography fontSize="12px">Vendor</Typography>
              <Typography fontSize="14px" fontWeight="bold">
                {data?.preferredVendor}
              </Typography>
            </Stack>
            <Stack>
              <div
                className="flag-data-div"
                style={{ backgroundColor: data?.purchaseRecommendationFlag }}
                onClick={handleClick}
              >
                <FlagIcon fontSize="small" style={{ color: '#fff', cursor: 'pointer' }} />
              </div>
            </Stack>
          </Stack>
        </Stack>
        <Menu id="basic-menu" anchorEl={anchorEl} open={open} onClose={handleClose}>
          <Box className="flag-data-pi-details-mobile">
            <Box className="flag-pi-det-child">
              <Typography className="flag-data-pi-heading">Recommendation:</Typography>
              <Typography className="flag-data-pi-detail-value" sx={{ fontSize: '14px' }}>
                {data?.purchaseFlagReason}
              </Typography>
            </Box>
            <Box className="flag-pi-det-child">
              <Typography className="flag-data-pi-heading">Inventory:</Typography>
              <Box className="flag-data-pi-detail-value">
                {data?.inventoryFlag === 'D' ? (
                  <span style={{ color: 'red', fontSize: '14px', fontWeight: 'bold' }}>Dead Stock</span>
                ) : (
                  <>
                    <Chip color={categoryColour(data?.inventoryFlag)} label={data?.inventoryFlag || 'NA'} />
                    {data?.inventoryFlag !== 'NA' && (
                      <Chip
                        color={categoryColour(data?.inventoryFlag)}
                        label={getTagDescription('INVENTORY', data?.inventoryFlag) || 'NA'}
                      />
                    )}
                  </>
                )}
              </Box>
            </Box>
            <Box className="flag-pi-det-child">
              <Typography className="flag-data-pi-heading">Profit:</Typography>
              <Box className="flag-data-pi-detail-value">
                <Chip color={categoryColour(data?.profitFlag)} label={data?.profitFlag || 'NA'} />
                {data?.profitFlag !== 'NA' && (
                  <Chip
                    color={categoryColour(data?.profitFlag)}
                    label={getTagDescription('PROFIT', data?.profitFlag) || 'NA'}
                  />
                )}
              </Box>
            </Box>
            <Box className="flag-pi-det-child">
              <Typography className="flag-data-pi-heading">Sales:</Typography>
              <Box className="flag-data-pi-detail-value">
                <Chip color={categoryColour(data?.salesFlag)} label={data?.salesFlag || 'NA'} />
                {data?.salesFlag !== 'NA' && (
                  <Chip
                    color={categoryColour(data?.salesFlag)}
                    label={getTagDescription('SALES', data?.salesFlag) || 'NA'}
                  />
                )}
              </Box>
            </Box>
          </Box>
        </Menu>
      </SoftBox>
    );
  },
);

export default PiDetailsPrdtCard;
