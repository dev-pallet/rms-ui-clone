import { Box, Card, CardContent, Grid, Modal } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import React, { useEffect, useState } from 'react';
import SoftBox from '../../../../../../../components/SoftBox';
import SoftTypography from '../../../../../../../components/SoftTypography';

const ListAllBatchOffer = ({
  openModal,
  setOpenModal,
  allAvailableUnits,
  batchNum,
  setBatchNum,
  sellingPrice,
  setSellingPrice,
  mrp,
  setMrp,
  count,
  setCount,
  selectedRows,
  setSelectedRows,
  setSelectLoader,
  selectLoader,
}) => {
  const [data, setData] = useState([]);
  const [remove, setRemove] = useState(false);

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  useEffect(() => {
    if (allAvailableUnits.length > 0) {
      // const filteredUnits = allAvailableUnits?.filter((unit) => {
      //   return unit.batchNo && !batchNum.includes(unit.batchNo);
      // });
      // setData(filteredUnits);
      setData(allAvailableUnits);
    }
    setSelectLoader(false);
    setSelectedRows(null);
  }, [allAvailableUnits]);

  useEffect(() => {
    if (remove) {
      setCount((prev) => prev - 1);
    }
    setRemove(false);
  }, [selectLoader]);

  const handleCheckboxChange = (item, index) => {
    setSelectedRows(index);
    const updatebatchNumber = [...batchNum];
    updatebatchNumber[count - 1] = item?.batchNo;
    setBatchNum(updatebatchNumber);

    const updatedmrp = [...mrp];
    updatedmrp[count - 1] = item?.mrp;
    setMrp(updatedmrp);

    const updateSellingPrice = [...sellingPrice];
    updateSellingPrice[count - 1] = item?.sellingPrice;
    setSellingPrice(updateSellingPrice);
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
            <SoftBox display='flex' justifyContent='space-between'>
              <SoftTypography fontSize="16px" fontWeight="bold">
              Select Batch
              </SoftTypography>
              <CancelIcon color='error' cursor='pointer' onClick={handleCloseModal}/>
            </SoftBox>
          </Grid>
          {data?.map((item, index) => {
            return (
              <Grid item xs={12} md={12}>
                <Card sx={{ width: '100%' }}>
                  <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <SoftBox mb={1} ml={-2} lineHeight={0} display="flex" gap="10px">
                        <input
                          type="radio"
                          checked={selectedRows === index}
                          onChange={() => handleCheckboxChange(item, index)}
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

export default ListAllBatchOffer;
