import { Box, Card, CardContent, Grid, Modal } from '@mui/material';
import { useDebounce } from 'usehooks-ts';
import React, { useEffect, useState } from 'react';
import SoftBox from '../../../../../../../components/SoftBox';
import SoftInput from '../../../../../../../components/SoftInput';
import SoftTypography from '../../../../../../../components/SoftTypography';
import Spinner from '../../../../../../../components/Spinner';

const ListAllBatch = ({
  openModal,
  setOpenModal,
  allAvailableUnits,
  detailIndex,
  currGtin,
  productName,
  setProductName,
  barcodeNum,
  setBarcodeNum,
  mrp,
  setMrp,
  availabelUnits,
  setAvailabelUnits,
  batchNumber,
  setBatchNumber,
  sellingPrice,
  setSellingPrice,
  transferUnits,
  setTransferUnits,
  totalPurchasePrice,
  setTotalPurchasePrice,
  purchasePrice,
  setPurchasePrice,
  setProductBatch,
  productBatch,
  handleAddProduct,
  handleRemoveProduct,
  setCount,
  count,
  allItemList,
  setAllItemList,
  setSelectLoader,
  selectLoader,
  batchLoader,
  setBatchLoader,
}) => {
  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [transferValue, setTransferValue] = useState([]);
  const [quantChange, setQuantChange] = useState('');
  const debouncedValue = useDebounce(quantChange, 700);
  const [itemList, setItemList] = useState([]);
  const [remove, setRemove] = useState(false);
  // const [selectLoader, setSelectLoader] = useState(false);
  const stnNumber = localStorage.getItem('stnNumber');

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  function checkBarcodeAndBatch(barcodeToCheck, batchToCheck, barcodeNum, batchNum) {
    for (let i = 0; i < barcodeNum.length; i++) {
      if (barcodeNum[i] === barcodeToCheck && batchNum[i] === batchToCheck) {
        return true; // If both barcode and batch match, return true
      }
    }
    return false; // No match found
  }

  function getMatchedIndex(barcodeToCheck, batchToCheck, barcodeNum, batchNum) {
    for (let i = 0; i < barcodeNum.length; i++) {
      if (barcodeNum[i] === barcodeToCheck && batchNum[i] === batchToCheck) {
        return i; // Return the index if both barcode and batch match
      }
    }
    return -1; // No match found, return -1
  }

  useEffect(() => {
    setData(allAvailableUnits[detailIndex]);
    setBatchLoader(false);
    if (allAvailableUnits[detailIndex]?.length > 0 && itemList?.length > 0) {
      const newSelectedRows = [...selectedRows];
      const newTransferValue = [...transferValue];
      allAvailableUnits[detailIndex]?.forEach((item, index) => {
        const result = checkBarcodeAndBatch(currGtin, item?.batchNo, barcodeNum, batchNumber);
        const isPresent = itemList?.find(ele =>
          ele.itemNo === item.gtin && ele.batchNumber === item.batchNo
        );

        // const isPresent = itemList?.find((ele) => ele?.batchNumber === item?.batchNo);
        if (result && isPresent) {
          newSelectedRows[index] = true;

          const transferUnits = isPresent?.quantityTransfer;
          newTransferValue[index] = transferUnits !== undefined ? transferUnits : '';
        } else {
          newSelectedRows[index] = false;
          newTransferValue[index] = '';
        }
      });

      setSelectedRows(newSelectedRows);
      setTransferValue(newTransferValue);
    }
  }, [allAvailableUnits[detailIndex]]);

  useEffect(() => {
    setItemList(allItemList);
  }, [allItemList]);

  useEffect(() => {
    if (debouncedValue || debouncedValue === 'changeValue') {
      if (remove) {
        setCount((prev) => prev - 1);
        handleCloseModal();
        handleRemoveProduct();
      }
      else{
        handleAddProduct();
      }
      setRemove(false);
      setSelectLoader(false);
      // detailsStockTransfer(stnNumber)
      //   .then((res) => {
      //     const response = res?.data?.data;
      //     if (response?.es) {
      //       return;
      //     }
      // setGrossAmount(response?.stockTransfer?.grossAmount);
      // setSubTotal(response?.stockTransfer?.taxableValue);
      // setIgstValue(response?.stockTransfer?.igstValue);
      // setSgstValue(response?.stockTransfer?.sgstValue);
      // setCgstValue(response?.stockTransfer?.cgstValue);
      //     setAllItemList(response?.stockTransfer?.stockTransferItemList);
      //   })
      //   .catch((err) => {});
    }
  }, [debouncedValue, selectLoader]);

  const handleCheckboxChange = (item, index) => {
    const newSelectedRows = [...selectedRows];
    newSelectedRows[index] = !newSelectedRows[index];
    setSelectedRows(newSelectedRows);

    if (newSelectedRows[index]) {
      const updatedProductName = [...productName];
      updatedProductName[count - 1] = item?.itemName;
      setProductName(updatedProductName);

      const updatedBarcodeNum = [...barcodeNum];
      updatedBarcodeNum[count - 1] = item?.gtin;
      setBarcodeNum(updatedBarcodeNum);

      const updatedmrp = [...mrp];
      updatedmrp[count - 1] = item?.mrp;
      setMrp(updatedmrp);

      const updatedAvailabelUnits = [...availabelUnits];
      updatedAvailabelUnits[count - 1] = item?.availableUnits;
      setAvailabelUnits(updatedAvailabelUnits);

      const updatePurchasePrice = [...purchasePrice];
      updatePurchasePrice[count - 1] = item?.purchasePrice;
      setPurchasePrice(updatePurchasePrice);

      const updateSellingPrice = [...sellingPrice];
      updateSellingPrice[count - 1] = item?.sellingPrice;
      setSellingPrice(updateSellingPrice);

      const updatebatchNumber = [...batchNumber];
      updatebatchNumber[count - 1] = item?.batchNo;
      setBatchNumber(updatebatchNumber);

      setCount((prev) => prev + 1);
    } else {
      const result = checkBarcodeAndBatch(currGtin, item?.batchNo, barcodeNum, batchNumber);
      if (result) {
        // const batchIndex = batchNumber.findIndex((ele) => ele === item?.batchNo);
        const batchIndex = getMatchedIndex(currGtin, item?.batchNo, barcodeNum, batchNumber);

        const updatedProductName = [...productName];
        updatedProductName.splice(batchIndex, 1);
        setProductName(updatedProductName);

        const updatedBarcodeNum = [...barcodeNum];
        updatedBarcodeNum.splice(batchIndex, 1);
        setBarcodeNum(updatedBarcodeNum);

        const updatedmrp = [...mrp];
        updatedmrp.splice(batchIndex, 1);
        setMrp(updatedmrp);

        const updatedAvailabelUnits = [...availabelUnits];
        updatedAvailabelUnits.splice(batchIndex, 1);
        setAvailabelUnits(updatedAvailabelUnits);

        const updatePurchasePrice = [...purchasePrice];
        updatePurchasePrice.splice(batchIndex, 1);
        setPurchasePrice(updatePurchasePrice);

        const updateSellingPrice = [...sellingPrice];
        updateSellingPrice.splice(batchIndex, 1);
        setSellingPrice(updateSellingPrice);

        const updatebatchNumber = [...batchNumber];
        updatebatchNumber.splice(batchIndex, 1);
        setBatchNumber(updatebatchNumber);

        const updatetransfer = [...transferUnits];
        updatetransfer.splice(batchIndex, 1);
        setTransferUnits(updatetransfer);

        const updateTotalPurchasePrice = [...totalPurchasePrice];
        updateTotalPurchasePrice.splice(batchIndex, 1);
        setTotalPurchasePrice(updateTotalPurchasePrice);

        const newTransferValue = [...transferValue];
        newTransferValue[index] = '';
        setTransferValue(newTransferValue);

        if(transferUnits[batchIndex] !=='' && transferUnits[batchIndex]){
          setRemove(true);
          // setSelectLoader(true);
        }
        setQuantChange('changeValue');
      }
    }
  };

  const handleTransferBatch = (e, item, index) => {
    const result = checkBarcodeAndBatch(currGtin, item?.batchNo, barcodeNum, batchNumber);
    if (result) {
      // const batchIndex = batchNumber.findIndex((ele) => ele === item?.batchNo);
      const batchIndex = getMatchedIndex(currGtin, item?.batchNo, barcodeNum, batchNumber);

      const newTransferUnits = [...transferUnits];
      newTransferUnits[batchIndex] = e.target.value;

      setTransferUnits(newTransferUnits);
      const newTotalPurchasePrice = [...totalPurchasePrice];
      newTotalPurchasePrice[batchIndex] = e.target.value * purchasePrice[batchIndex];
      setTotalPurchasePrice(newTotalPurchasePrice);
    } else {
      const newTransferUnits = [...transferUnits];
      newTransferUnits[count - 1] = e.target.value;
      setTransferUnits(newTransferUnits);

      const newTotalPurchasePrice = [...totalPurchasePrice];
      newTotalPurchasePrice[count - 1] = e.target.value * purchasePrice[count - 1];
      setTotalPurchasePrice(newTotalPurchasePrice);
    }

    const newTransferValue = [...transferValue];
    newTransferValue[index] = e.target.value;
    setTransferValue(newTransferValue);
    setQuantChange(e.target.value);
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
              Select Batch for {currGtin} 
            </SoftTypography>
            {selectLoader || batchLoader || remove && <Spinner size={20} />}
          </Grid>
          {!selectLoader && data?.length > 0 && (
            <>
              {data?.map((item, index) => {
                const isPresent = checkBarcodeAndBatch(currGtin, item?.batchNo, barcodeNum, batchNumber);
                let presentTransfer = '';
                if (isPresent) {
                  itemList?.filter((ele) => {
                    if (ele?.batchNumber === item?.batchNo) {
                      presentTransfer = ele?.quantityTransfer;
                    }
                  });
                }
                return (
                  <Grid item xs={12} md={12}>
                    <Card sx={{ width: '100%' }}>
                      <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                          <SoftBox mb={1} ml={-2} lineHeight={0} display="flex" gap="10px">
                            <input
                              type="checkbox"
                              checked={selectedRows[index] || false}
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
                        <div>
                          <SoftBox mb={1} lineHeight={0}>
                            <SoftTypography fontSize="12px">
                              <b>Transfer Units :</b>
                            </SoftTypography>
                          </SoftBox>
                          <SoftBox width="70px">
                            <SoftInput
                              type="number"
                              value={
                                // quantChange !== ''
                                //   ? transferValue[index]
                                //   : isPresent
                                //   ? presentTransfer
                                //   :
                                selectedRows[index] ? transferValue[index] : ''
                              }
                              disabled={isPresent ? false : !selectedRows[index]}
                              onChange={(e) => handleTransferBatch(e, item, index)}
                            />
                          </SoftBox>
                        </div>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </>
          )}
        </Grid>
      </Box>
    </Modal>
  );
};

export default ListAllBatch;
