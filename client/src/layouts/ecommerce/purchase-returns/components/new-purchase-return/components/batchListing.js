import { Box, Card, CardContent, Grid, Modal } from '@mui/material';
import { getInventoryDetails, getvendorName, removeInventoryReturnItem } from '../../../../../../config/Services';
import { useSnackbar } from '../../../../../../hooks/SnackbarProvider';
import { v4 as uuidv4 } from 'uuid';
import CancelIcon from '@mui/icons-material/Cancel';
import React, { useEffect, useState } from 'react';
import SoftBox from '../../../../../../components/SoftBox';
import SoftTypography from '../../../../../../components/SoftTypography';
import Spinner from '../../../../../../components/Spinner';
import { noDatagif } from '../../../../Common/CommonFunction';

const PurchaseReturnsBatchList = ({
  rowData,
  setRowData,
  boxRef,
  openModal,
  handleCloseModal,
  currIndex,
  currGtin,
  currName,
  returnJobId,
  setListDisplay,
  isSelected,
  setIsSelected,
  vendorId,
  vendorDisplayName,
  isVendorSelected,
}) => {
  const showSnackbar = useSnackbar();
  const locId = localStorage.getItem('locId');
  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState(false);
  const [remove, setRemove] = useState(false);
  const [removedGtin, setRemovedGtin] = useState('');

  useEffect(() => {
    if (currGtin !== '') {
      handleInvertoryData(currGtin, currIndex);
    }
  }, []);

  function checkBarcodeAndBatch(barcodeToCheck, batchToCheck, rowData) {
    for (let i = 0; i < rowData.length; i++) {
      const item = rowData[i];
      if (item?.itemCode === barcodeToCheck && item?.batchNo === batchToCheck) {
        return true;
      }
    }
    return false;
  }

  function findMatchingBarcodeAndBatchIndex(barcodeToCheck, batchToCheck, rowData) {
    for (let i = 0; i < rowData.length; i++) {
      const item = rowData[i];
      if (item?.itemCode === barcodeToCheck && item?.batchNo === batchToCheck) {
        return i;
      }
    }
    return -1;
  }

  const fetchVendorName = async (item) => {
    try {
      const res = await getvendorName(item?.requestNumber);
      const vendorid = res?.data?.data?.vendorId;
      const vendorname = res?.data?.data?.vendorName;
      return { ...item, vendorid: vendorid, vendorname: vendorname };
    } catch (err) {
      return { ...item, vendorid: '', vendorname: '' };
    }
  };

  const handleInvertoryData = (gtin, index) => {
    setLoader(true);
    getInventoryDetails(locId, gtin)
      .then((res) => {
        if (res?.data?.data?.es === 1) {
          showSnackbar(res?.data?.data?.message, 'error');
          setLoader(false);
          setError(true);
        } else if (res?.data?.data?.es === 0) {
          // get all the batch from the api
          const response = res?.data?.data?.data;
          const newArray = response?.multipleBatchCreations
            .filter((batch) => batch?.batchId !== '' && batch?.availableUnits !== 0)
            .map((batch) => ({
              ...batch,
              purchaseIGst: response?.purchaseIGst,
              purchaseCGst: response?.purchaseCGst,
              purchaseSGst: response?.purchaseSGst,
            }));

          if (newArray?.length > 0) {
            // filter on basis of requestNumberType
            const filterData = newArray?.filter(
              (item) => item?.requestNumber !== null && item?.requestNumberType === 'PO',
            );

            // parallelly calling getVendorName for each batch to show vendor Name as well
            const vendorNameData = filterData?.map((item) => fetchVendorName(item));
            const vendorIdExist = vendorNameData?.filter((item) => item?.vendorid !== '');
            // promise will help in Waiting for all promises to resolve
            Promise.all(vendorIdExist)
              .then((vendorData) => {
                // const filteredBatch = vendorData?.filter((item) => batchNum.includes(item.batchId));
                if (vendorData?.length > 0) {
                  if (isVendorSelected && vendorId) {
                    const vendorFilter = vendorData?.filter((item) => item?.vendorid === vendorId);
                    if (vendorFilter?.length > 0) {
                      setError(false);
                      setData(vendorFilter);
                      if (rowData?.length > 0) {
                        const newSelectedRows = [...selectedRows];
                        vendorFilter?.forEach((item, index) => {
                          // const isPresent = filteredBatch?.find((ele) => ele?.batchId === item?.batchId);
                          // to handle the checkbox on the basis of already selected batches for that product
                          const result = checkBarcodeAndBatch(currGtin, item?.batchId, rowData);
                          if (result) {
                            newSelectedRows[index] = true;
                          } else {
                            newSelectedRows[index] = false;
                          }
                        });

                        setSelectedRows(newSelectedRows);
                      }
                    } else {
                      setError(true);
                    }
                  } else {
                    setData(vendorData);
                    if (rowData?.length > 0) {
                      const newSelectedRows = [...selectedRows];
                      vendorData?.forEach((item, index) => {
                        // const isPresent = filteredBatch?.find((ele) => ele?.batchId === item?.batchId);
                        // to handle the checkbox on the basis of already selected batches for that product
                        const result = checkBarcodeAndBatch(currGtin, item?.batchId, rowData);
                        if (result) {
                          newSelectedRows[index] = true;
                        } else {
                          newSelectedRows[index] = false;
                        }
                      });

                      setSelectedRows(newSelectedRows);
                    }
                  }

                  setLoader(false);
                } else {
                  setError(true);
                  setLoader(false);
                }
              })
              .catch((error) => {
                // const filteredBatch = filterData?.filter((item) => batchNum.includes(item.batchId));
                if (filterData?.length > 0) {
                  setData(filterData);

                  if (rowData?.length > 0) {
                    const newSelectedRows = [...selectedRows];
                    filterData?.forEach((item, index) => {
                      // const isPresent = filteredBatch?.find((ele) => ele?.batchId === item?.batchId);
                      const result = checkBarcodeAndBatch(currGtin, item?.batchId, rowData);
                      if (result) {
                        newSelectedRows[index] = true;
                      } else {
                        newSelectedRows[index] = false;
                      }
                    });

                    setSelectedRows(newSelectedRows);
                  }

                  setError(false);
                } else {
                  setError(true);
                }
                setLoader(false);
              });
          } else {
            setError(true);
            setLoader(false);
          }
        }
      })
      .catch((err) => {
        setLoader(false);
        showSnackbar(err?.response?.data?.message, 'error');
      });
  };

  useEffect(() => {
    if (remove) {
      if (!rowData.find((ele) => ele?.itemCode === removedGtin)) {
        handleCloseModal();
        return;
      }
      // setCount((prev) => prev - 1);
    }
    setRemove(false);
    setRemovedGtin('');
  }, [remove]);

  function formatDateToYYYYMMDD(dateString) {
    const date = new Date(dateString);
    const formattedDate = date.toISOString().split('T')[0];
    return formattedDate;
  }

  const handleCheckboxChange = (e, item, index) => {
    const isChecked = e.target.checked;
    if (isChecked && item?.requestNumberType === 'PO' && rowData?.length > 0) {
      const updateRowData = [...rowData];
      const rowIndex = updateRowData?.length-1;
      const batchIndex = findMatchingBarcodeAndBatchIndex(currGtin, item?.batchId, rowData);
      if (batchIndex === -1 && !rowData?.find((ele) => ele?.itemCode === currGtin)) {
        // Add a new row to rowData
        const newRow = {
          itemId: uuidv4(),
          rjItemId: null,
          itemCode: currGtin,
          itemName: currName,
          batchNo: item?.batchId,
          poNumber: item?.requestNumber,
          availableUnits: item?.availableUnits,
          igst: item?.purchaseIGst === 0 ? 0 : item?.purchaseIGst,
          cgst: item?.purchaseCGst === 0 ? 0 : item?.purchaseCGst,
          sgst: item?.purchaseSGst === 0 ? 0 : item?.purchaseSGst,
          vendorId: item?.vendorid,
          vendorName: item?.vendorname,
          purchasePrice: item?.purchasePrice === 0 ? '0' : item?.purchasePrice,
          expiryDate: item?.expiryDate ? formatDateToYYYYMMDD(item?.expiryDate) : null,
          // Add other properties as needed
        };
        updateRowData[currIndex] = newRow;
        setRowData(updateRowData);
      } 
      else if (batchIndex === -1) {
        // Add a new row to rowData
        const newRow = {
          itemId: uuidv4(),
          rjItemId: null,
          itemCode: currGtin,
          itemName: currName,
          batchNo: item?.batchId,
          poNumber: item?.requestNumber,
          availableUnits: item?.availableUnits,
          igst: item?.purchaseIGst === 0 ? 0 : item?.purchaseIGst,
          cgst: item?.purchaseCGst === 0 ? 0 : item?.purchaseCGst,
          sgst: item?.purchaseSGst === 0 ? 0 : item?.purchaseSGst,
          vendorId: item?.vendorid,
          vendorName: item?.vendorname,
          purchasePrice: item?.purchasePrice === 0 ? '0' : item?.purchasePrice,
          expiryDate: item?.expiryDate ? formatDateToYYYYMMDD(item?.expiryDate)  : '',
          // Add other properties as needed
        };
        if(isSelected){
          updateRowData[currIndex] = newRow;
        }
        else{
          updateRowData.push(newRow);
        }
        setIsSelected(false);
        setRowData(updateRowData);
      } else {
        // Update existing row
        const rowIndex = batchIndex;
        updateRowData[rowIndex]['itemCode'] = currGtin;
        updateRowData[rowIndex]['itemName'] = currName;
        updateRowData[rowIndex]['batchNo'] = item?.batchId;
        updateRowData[rowIndex]['poNumber'] = item?.requestNumber;
        updateRowData[rowIndex]['availableUnits'] = item?.availableUnits;
        updateRowData[rowIndex]['igst'] = item?.purchaseIGst === 0 ? 0 : item?.purchaseIGst;
        updateRowData[rowIndex]['cgst'] = item?.purchaseCGst === 0 ? 0 : item?.purchaseCGst;
        updateRowData[rowIndex]['sgst'] = item?.purchaseSGst === 0 ? 0 : item?.purchaseSGst;
        updateRowData[rowIndex]['vendorId'] = item?.vendorid;
        updateRowData[rowIndex]['vendorName'] = item?.vendorname;
        updateRowData[rowIndex]['purchasePrice'] = item?.purchasePrice === 0 ? '0' : item?.purchasePrice;
        setRowData(updateRowData);
      }
      
      const newSelectedRows = [...selectedRows];
      newSelectedRows[index] = true;
      setSelectedRows(newSelectedRows);

    } else if (!isChecked) {
      // const batchIndex = batchNum.findIndex((ele) => ele === item?.batchId);

      const batchIndex = findMatchingBarcodeAndBatchIndex(currGtin, item?.batchId, rowData);

      setRemovedGtin(rowData[batchIndex]?.itemCode);

      const newSelectedRows = [...selectedRows];
      newSelectedRows[index] = false;
      setSelectedRows(newSelectedRows);

      const updatedRowData = [...rowData];
      updatedRowData.splice(batchIndex, 1);
      setRowData(updatedRowData);

      setRemove(true);
      if (rowData[batchIndex]?.rjItemId !== '' && rowData[batchIndex]?.rjItemId !== null) {
        const payload = {
          rjItemId: rowData[batchIndex]?.rjItemId,
        };
        if (returnJobId?.includes('RN')) {
          payload.returnId = returnJobId;
        } else {
          payload.returnJobId = returnJobId;
        }
        removeInventoryReturnItem(payload)
          .then((res) => {
            const response = res?.data?.data;
            if (response?.es) {
              showSnackbar(response?.message || 'Some error occured', 'error');
              return;
            }
            setListDisplay(true);
          })
          .catch((err) => {
            showSnackbar(err?.response?.data?.message || 'Some error occured', 'error');
          });
      }
    }
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
            <SoftBox display="flex" justifyContent="space-between">
              <SoftTypography fontSize="16px" fontWeight="bold">
                Select batch {isVendorSelected && vendorId && `for vendor ${vendorDisplayName}`}
              </SoftTypography>
              <CancelIcon color="error" cursor="pointer" onClick={handleCloseModal} />
            </SoftBox>
          </Grid>
          {loader ? (
            <Box className="centerspinner" style={{ height: 445, width: '100%' }}>
              <Spinner />
            </Box>
          ) : error ? (
            <SoftBox className="No-data-text-box">
              <SoftBox className="src-imgg-data">
                <img
                  className="src-dummy-img"
                  src={noDatagif}
                />
              </SoftBox>

              <h3 className="no-data-text-I">NO DATA FOUND</h3>
            </SoftBox>
          ) : (
            data?.map((item, index) => {
              return (
                <Grid item xs={12} md={12} key={item?.inventoryId}>
                  <Card sx={{ width: '100%' }}>
                    <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <SoftBox mb={1} ml={-2} lineHeight={0} display="flex" gap="10px">
                          <input
                            style={{ cursor: 'pointer' }}
                            type="checkbox"
                            checked={selectedRows[index] || false}
                            onChange={(e) => handleCheckboxChange(e, item, index)}
                          />
                          <SoftTypography fontSize="12px">
                            <b>Batch No:</b> {item?.batchId}
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
                            <b>Requested Num :</b> {item?.requestNumber}
                          </SoftTypography>
                        </SoftBox>
                        <SoftBox mb={1} ml={0.5} lineHeight={0}>
                          <SoftTypography fontSize="12px">
                            <b>Vendor Name :</b> {item?.vendorname}
                          </SoftTypography>
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

export default PurchaseReturnsBatchList;
