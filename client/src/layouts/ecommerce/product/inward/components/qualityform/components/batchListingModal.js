import { Box, Card, CardContent, Grid, Modal } from '@mui/material';
import SoftTypography from '../../../../../../../components/SoftTypography';
import SoftBox from '../../../../../../../components/SoftBox';
import SoftInput from '../../../../../../../components/SoftInput';
import { useSnackbar } from '../../../../../../../hooks/SnackbarProvider';

const RepakingBatchListingModal = ({ openModal, setOpenModal, allAvailableUnits, primaryGoods, setPrimaryGoods }) => {
  const showSnackbar = useSnackbar();
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleCheckboxChange = (value, item) => {
    const updatedPrimaryProductSelected = primaryGoods?.batches;
    const index = updatedPrimaryProductSelected?.findIndex((i) => i?.batchNumber === item?.batchNo);
    if (value) {
      updatedPrimaryProductSelected.push({
        isChecked: value,
        quantityConsumed: 0,
        batchNumber: item?.batchNo,
        avlQty: item?.availableUnits,
        purchasePrice: item?.purchasePrice,
      });
      setPrimaryGoods((prev) => ({
        ...prev,
        batches: updatedPrimaryProductSelected,
      }));
    } else {
      setPrimaryGoods((prev) => ({
        ...prev,
        batches: updatedPrimaryProductSelected,
        totalAvlQty: Number(primaryGoods?.totalAvlQty) - Number(updatedPrimaryProductSelected[index]?.availableUnits),
        totalProductionQty:
          Number(primaryGoods?.totalProductionQty) - Number(updatedPrimaryProductSelected[index]?.quantityConsumed),
      }));
      updatedPrimaryProductSelected.splice(index, 1);
    }
  };

  const handleQuantityChange = (e, item) => {
    const { value } = e.target;
    if (value < 0) return;
    if (Number(value) > item?.availableUnits) {
      showSnackbar('Quantity should not be greater than available units', 'error');
      return;
    }
    const updatedPrimaryProductSelected = primaryGoods?.batches;
    const index = updatedPrimaryProductSelected?.findIndex((i) => i?.batchNumber === item?.batchNo);
    if (index === -1) {
      updatedPrimaryProductSelected.push({
        quantityConsumed: Number(value) || 0,
        batchNumber: item?.batchNo,
        avlQty: item?.availableUnits,
        purchasePrice: item?.purchasePrice,
      });
    } else {
      updatedPrimaryProductSelected[index]['quantityConsumed'] = Number(value);
    }
    setPrimaryGoods((prev) => ({
      ...prev,
      totalAvlQty: updatedPrimaryProductSelected?.reduce((acc, curr) => acc + curr?.avlQty, 0),
      totalProductionQty: updatedPrimaryProductSelected?.reduce((acc, curr) => acc + curr?.quantityConsumed, 0),
      batches: updatedPrimaryProductSelected,
    }));
  };

  return (
    <Modal
      open={openModal}
      onClose={handleCloseModal}
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
            <SoftTypography fontSize="16px" fontWeight="bold">
              Select Batch(s) for Repacking
            </SoftTypography>
          </Grid>

          {allAvailableUnits?.map((item, index) => {
            const qty = primaryGoods?.batches?.find((i) => i?.batchNumber === item?.batchNo)?.quantityConsumed;
            const isChecked = primaryGoods?.batches?.find((i) => i?.batchNumber === item?.batchNo)?.isChecked;
            return (
              <Grid item xs={12} md={12}>
                <Card sx={{ width: '100%' }}>
                  <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <SoftBox mb={1} ml={-2} lineHeight={0} display="flex" gap="10px">
                          <input
                            type="checkbox"
                            checked={isChecked ? true : false}
                            onChange={(e) => handleCheckboxChange(e.target.checked, item, index)}
                          />
                          <SoftTypography fontSize="12px">
                            <b>Batch No:</b> {item?.batchNo}
                          </SoftTypography>
                        </SoftBox>
                        <SoftBox mb={1} ml={0.5} lineHeight={0}>
                          <SoftTypography fontSize="12px">
                            <b>Available Qty :</b> {item?.availableUnits}
                          </SoftTypography>
                        </SoftBox>
                        <SoftBox mb={1} ml={0.5} lineHeight={0}>
                          <SoftTypography fontSize="12px">
                            <b>MRP :</b> {item?.mrp}
                          </SoftTypography>
                        </SoftBox>
                        <SoftBox mb={1} ml={0.5} lineHeight={0}>
                          <SoftTypography fontSize="12px">
                            <b>Selling Price :</b> {item?.sellingPrice}
                          </SoftTypography>
                        </SoftBox>
                        <SoftBox mb={1} ml={0.5} lineHeight={0}>
                          <SoftTypography fontSize="12px">
                            <b>Purchase Price :</b> {item?.purchasePrice}
                          </SoftTypography>
                        </SoftBox>
                        <SoftBox mb={1} ml={0.5} lineHeight={0}>
                          <SoftTypography fontSize="12px">
                            <b>Inwarded On :</b> {item?.inwardedOn}
                          </SoftTypography>
                        </SoftBox>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          width: '30%',
                        }}
                      >
                        <SoftTypography fontSize="12px" fontWeight="bold">
                          Quantity:
                        </SoftTypography>
                        <SoftInput
                          name="quantityOrdered"
                          type="number"
                          disabled={!isChecked}
                          value={qty || ''}
                          sx={{ width: '50%' }}
                          onChange={(e) => handleQuantityChange(e, item)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Modal>
  );
};

export default RepakingBatchListingModal;
