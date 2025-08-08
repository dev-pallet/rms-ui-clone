import { Box, IconButton, Modal, Typography } from '@mui/material';
import { getAllProductsV2, getAllProductsV2New } from '../../../../config/Services';
import BarcodeReader from 'react-barcode-reader';
import CancelIcon from '@mui/icons-material/Cancel';
import ProductScanSkeleton from './ProductScanSkeleton';
import React, { useState } from 'react';
import SoftBox from '../../../../components/SoftBox';
import SoftButton from '../../../../components/SoftButton';
import SoftTypography from '../../../../components/SoftTypography';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  height: '95vh',
  width: '95vw',
  bgcolor: 'background.paper',
  border: '1px solid gray',
  borderRadius: '10px',
  boxShadow: 14,
  overflow: 'auto',
  padding: '15px',
};

const ScanAndAddProduct = ({ setScanBarCode, handleClickOpen }) => {
  const locId = localStorage.getItem('locId');
  const [loader, setLoader] = useState(false);
  const [result, setResult] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [inventoryData, setInventoryData] = useState([]);
  const [productData, setProductData] = useState([]);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const noImage =
    'https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg';
  // useEffect(() => {
  //   setLoader(true);
  //   const barCodes = ['000010', '5555500001361'];
  //   barCodes?.map(async (item) => {
  //     const data = await fetchProductName(item);
  //     const mergeData = [...result, item];
  //     setScanBarCode(mergeData);
  //     setResult(mergeData);
  // });

  // }, []);
  const handleScan = (data) => {
    setLoader(true);
    handleOpen();
    fetchProductName(data);
    const mergeData = [...result, data];
    setScanBarCode(mergeData);
    setResult(mergeData);
  };

  let lowerCaseLocId = locId.toLocaleLowerCase();

  const fetchProductName = (data) => {
    const payload = {
      barcode: [data],
      storeLocations: [locId],
    };
    getAllProductsV2New(payload)
      .then((res) => {
        const newProductData = res?.data?.data?.data?.data;
        const newInventoryData = res?.data?.data?.data?.response[0]?.inventoryData;
        setProductData((prevProductData) => [...prevProductData, newProductData]);
        setInventoryData((prevInventoryData) => [...prevInventoryData, newInventoryData]);
        setLoader(false);
      })
      .catch(() => {});
  };
  const handleError = (err) => {
    console.error(err);
  };

  const handleSave = () => {
    handleClose();
    setScanBarCode(result);
    handleClickOpen();
  };

  return (
    <div>
      <BarcodeReader onError={handleError} onScan={handleScan} />
      <SoftButton onClick={handleOpen}>Scan</SoftButton>
      <div>
        <Modal
          keepMounted
          open={open}
          onClose={handleClose}
          aria-labelledby="keep-mounted-modal-title"
          aria-describedby="keep-mounted-modal-description"
        >
          <Box sx={style}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px', borderRadius: '8px' }}>
              <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
                <b> Scanned Products for Custom Price Edit</b>
              </Typography>
              {/* <div>
                <img src="https://i.ibb.co/1dFfj1N/ezgif-2-139e71673a.gif" alt="" style={{ height: '80px' }} />
              </div> */}
              <IconButton edge="end" color="inherit" onClick={handleClose} aria-label="close">
                <CancelIcon color="error" />
              </IconButton>
            </div>

            <hr style={{ opacity: 0.1, margin: '3px' }} />
            <SoftBox style={{ overflow: 'auto', padding: '5px 0px 20px 0p' }}>
              {inventoryData?.map((item, index) => (
                <SoftBox className="scan-product-main-box" style={{ marginTop: '5px' }}>
                  <SoftBox className="vendor-prod-img">
                    <img
                      src={productData[index]?.variants[0]?.imageUrls?.front || noImage}
                      className="all-prdt-img all-vendor-prdt-img"
                    />
                  </SoftBox>
                  <SoftBox className="scan-prod-seconday">
                    <SoftBox>
                      <SoftBox display="flex" flexDirection="column">
                        <SoftBox className="vendor-prod-title-box" style={{ marginBottom: '5px' }}>
                          <SoftTypography className="vendor-prod-title"> {item?.itemName || 'NA'}</SoftTypography>
                        </SoftBox>
                        <SoftBox display="flex" justifyContent="space-between">
                          <SoftBox display="flex" justifyContent="flex-start" alignItems="center" gap="20px">
                            <SoftTypography fontSize="14px">
                              <b> EAN: </b>
                              {item?.gtin || 'NA'}
                            </SoftTypography>
                          </SoftBox>
                        </SoftBox>
                      </SoftBox>
                    </SoftBox>
                    <SoftBox className="other-vendor-prod-listing-1">
                      <SoftBox className="other-vendor-prod-item-listing">
                        <SoftTypography fontSize="12px">
                          <b> MRP : </b> ₹ {item?.mrp || 'NA'}
                        </SoftTypography>
                      </SoftBox>
                      <SoftBox className="other-vendor-prod-item-listing">
                        <SoftTypography fontSize="12px">
                          <b> category:</b> {productData[index]?.appCategories?.categoryLevel1 || 'NA'}
                        </SoftTypography>
                      </SoftBox>
                      <SoftBox className="other-vendor-prod-item-listing">
                        <SoftTypography fontSize="12px">
                          <b> Purchase Price :</b> {item?.purchasePrice || 'NA'}
                        </SoftTypography>
                      </SoftBox>

                      <SoftBox className="other-vendor-prod-item-listing">
                        <SoftTypography fontSize="12px">
                          <b> Selling Price :</b> {item?.sellingPrice || 'NA'}
                        </SoftTypography>
                      </SoftBox>
                      <SoftBox className="other-vendor-prod-item-listing">
                        <SoftTypography fontSize="12px">
                          <b> Available Stock :</b> {item?.availableUnits || 'NA'}
                        </SoftTypography>
                      </SoftBox>
                    </SoftBox>
                  </SoftBox>
                </SoftBox>
              ))}
              {loader && <ProductScanSkeleton loading={loader} />}
            </SoftBox>
            <div style={{ margin: '10px', position: 'sticky', float: 'right' }}>
              <SoftButton color="info" onClick={handleSave}>
                Edit
              </SoftButton>
            </div>
          </Box>
        </Modal>
      </div>
    </div>
  );
};

export default ScanAndAddProduct;
