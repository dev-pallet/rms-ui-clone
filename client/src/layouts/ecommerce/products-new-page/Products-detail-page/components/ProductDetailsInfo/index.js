import React, { useEffect, useState } from 'react';
import SoftBox from '../../../../../../components/SoftBox';
import { Avatar, Card, Chip, Dialog, Grid, IconButton, Slide, Tooltip, Typography } from '@mui/material';
import './product-details-info.css';
import DownloadIcon from '@mui/icons-material/Download';
import SoftButton from '../../../../../../components/SoftButton';
import {
  generateBarcodeWithNum,
  getInventoryDetails,
  getPurchaseMarginAccToVendor,
} from '../../../../../../config/Services';
import { useSnackbar } from '../../../../../../hooks/SnackbarProvider';
import { capitalizeFirstLetterOfWords, CopyToClipBoard, isSmallScreen } from '../../../../Common/CommonFunction';
import SplideCommon from '../../../../../dashboards/default/components/common-tabs-carasoul';
import { SplideSlide } from '@splidejs/react-splide';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { DataGrid } from '@mui/x-data-grid';
import { dataGridStyles } from '../../../../Common/NewDataGridStyle';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import GroceryVariantsSection from './components/GroceryVariantsSection';
import RestaurantVariantsSection from './components/RestaurantVariantsSection';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const CopyToClipboardIcon = ({ textToCopy }) => {
  const [tooltipText, setTooltipText] = useState('Click to copy');

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        setTooltipText('Copied!');
        setTimeout(() => {
          setTooltipText('Click to copy');
        }, 1500);
      })
      .catch((err) => {
        setTooltipText('Failed to copy');
      });
  };

  return (
    <Tooltip title={tooltipText} arrow>
      <IconButton onClick={copyToClipboard}>
        <ContentCopyIcon style={{ cursor: 'pointer', fontSize: '18px', color: '#0562FB' }} />
      </IconButton>
    </Tooltip>
  );
};

const ProductsDetailsInfo = ({
  productDetails,
  setSelectedVariantBarcode,
  selectedVariantBarcode,
  handleGtinChange,
  selectedVariant,
  setSelectedVariant,
  pricingDetail,
  reloadBatchDetails,
  type,
}) => {
  const isRestaurant = type === 'RESTAURANT';
  const productTypeTags = {
    RAW: { label: 'Raw Material', color: '#FFA500' },
    CONSUMABLE: { label: 'Consumables', color: '#8B4513' },
    ADD_ON: { label: 'Add-ons', color: '#32CD32' },
    MENU: { label: 'Finished Product', color: '#FFD700' },
    PREP: { label: 'Prep Item', color: '#1E90FF' },
  };
  const productType = productDetails?.productTypes?.[0];
  const tag = productTypeTags?.[productType];
  const [variants, setVariants] = useState([]);
  const showSnackbar = useSnackbar();

  const locId = localStorage.getItem('locId');
  const orgId = localStorage.getItem('orgId');
  const [openVendorPop, setOpenVendorPop] = useState(false);
  const [vendorData, setVendorData] = useState([]);

  useEffect(() => {
    if (productDetails?.variants?.length > 0) {
      const updatedVariants = productDetails.variants.map((variant, index) => ({
        ...variant,
        checked: index === 0,
        barcodeImage: null,
        mrp: '-----', // Set initially to '-----', will update later
        salePrice: '-----',
        purchasePrice: '-----',
        purchaseMargin: '-----',
        availableQty: '-----',
      }));

      const variantPromises = updatedVariants.map((variant) => {
        const payload = {
          gtin: [variant.barcodes[0]],
        };

        const barcodePromise = generateBarcodeWithNum(variant.barcodes[0] || 'NA').catch((err) => {
          showSnackbar(err?.response?.data?.message?.error || 'Error generating barcode', 'error');
          return { data: { data: { image: d_img } } };
        });

        const inventoryPromise = getInventoryDetails(locId, variant.barcodes[0]).catch((err) => {
          showSnackbar(err?.response?.data?.message || 'Error fetching inventory details', 'error');
          return { data: { data: { data: { multipleBatchCreations: [] } } } };
        });

        // const marginPromise = getPurchaseMarginAccToVendor(payload).catch((err) => {
        //   // showSnackbar(err?.response?.data?.message || 'Error fetching purchase margin', 'error');
        //   return { data: { data: { object: [], total: 0 } } };
        // });

        return Promise.all([barcodePromise, inventoryPromise]);
      });

      Promise.all(variantPromises)
        .then((results) => {
          const updatedVariantsWithDetails = updatedVariants.map((variant, idx) => {
            const barcodeResult = results[idx][0];
            // const marginResult = results[idx][2];
            const inventoryResult = results[idx][1];

            // const vendor = marginResult?.data?.data?.object || [];
            // const vendorLength = marginResult?.data?.data?.total || 0;
            // const purchaseMarginn = vendor[0]?.purchaseMargin;

            // const vendorpm = vendor.map((item) => ({
            //   productPrice: item.productPrice ? `₹${item.productPrice}` : '-----',
            //   vendorProductPrice: item.vendorProductPrice ? `₹${item.vendorProductPrice}` : '-----',
            //   discount: item.discount ? `${item.discount}%` : '-----',
            //   purchaseMargin12: item.purchaseMargin || '-----',
            //   id: item.vendorId,
            // }));

            // let displayPurchaseMargin = '-----';
            // if (vendorLength === 0) {
            //   displayPurchaseMargin = '-----';
            // } else if (vendorLength > 1) {
            //   displayPurchaseMargin = (
            //     <>
            //       {purchaseMarginn} <KeyboardArrowDownIcon onClick={() => setOpenVendorPop(true)} />
            //     </>
            //   );
            // } else if (typeof purchaseMarginn === 'string' || typeof purchaseMarginn === 'number') {
            //   displayPurchaseMargin = purchaseMarginn;
            // }

            // Extracting inventory details (available units, selling price, purchase price)
            const inventoryData = inventoryResult?.data?.data?.data?.multipleBatchCreations || [];
            const totalAvailableQty = inventoryData.reduce((sum, batch) => sum + (batch.availableUnits || 0), 0);
            const latestInventory = inventoryData.length > 0 ? inventoryData[0] : {};

            // Set MRP based on priority: mrpData first, then inventory data, otherwise '-----'
            const mrp = latestInventory?.mrp
              ? `₹${latestInventory?.mrp}`
              : variant?.mrpData?.[0]?.mrp
              ? `${variant?.mrpData?.[0]?.currencySymbol} ${variant?.mrpData?.[0]?.mrp}`
              : '-----';

            return {
              ...variant,
              barcodeImage: barcodeResult ? `data:image/png;base64,${barcodeResult.data?.data?.image || ''}` : d_img,
              // purchaseMargin: displayPurchaseMargin,
              // vendorpm,
              availableQty: totalAvailableQty || '-----',
              salePrice: latestInventory?.sellingPrice ? `₹${latestInventory?.sellingPrice}` : '-----',
              purchasePrice: latestInventory?.purchasePrice ? `₹${latestInventory?.purchasePrice}` : '-----',
              purchaseMargin:
                latestInventory?.purchasePrice !== null &&
                latestInventory?.purchasePrice !== undefined &&
                latestInventory?.mrp !== null &&
                latestInventory?.mrp !== undefined &&
                latestInventory?.mrp > 0
                  ? latestInventory?.purchasePrice === 0
                    ? '0%'
                    : `${(
                        ((latestInventory?.mrp - latestInventory?.purchasePrice) / latestInventory?.mrp) *
                        100
                      ).toFixed(1)}%`
                  : '-----',
              mrp, // Updated with proper logic
            };
          });

          const flatVendorData = updatedVariantsWithDetails.flatMap((variant) => variant.vendorpm || []);

          setVariants(updatedVariantsWithDetails);
          setVendorData(flatVendorData);
          setSelectedVariant(updatedVariantsWithDetails[0]);
          setSelectedVariantBarcode(updatedVariantsWithDetails[0].barcodes[0] || 'NA');
          handleGtinChange(updatedVariantsWithDetails[0].barcodes[0] || 'NA');
        })
        .catch((err) => {
          // showSnackbar('Some error occurred while processing variants', 'error');
        });
    }
  }, [productDetails, reloadBatchDetails]);

  const handleRadioButtonChange = (item, index) => {
    const updatedVariants = variants.map((variant, i) => ({
      ...variant,
      checked: i === index,
    }));
    setVariants(updatedVariants);
    // Set the selected variant's barcode
    setSelectedVariant(item);
    setSelectedVariantBarcode(item.barcodes[0] || 'NA');
    handleGtinChange(item.barcodes[0] || 'NA');
  };

  const d_img = 'https://i.imgur.com/dL4ScuP.png';

  const download = (image) => {
    const link = document.createElement('a');
    link.href = image;
    link.download = `${productDetails?.name}_barcode.png`;
    document.body.appendChild(link);
    link.click();
  };

  const isMobileDevice = isSmallScreen();
  const capitalise = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  const columns = [
    {
      field: 'id',
      headerName: 'Vendor Id',
      minWidth: 100,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'productPrice',
      headerName: 'Product Price',
      minWidth: 100,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'vendorProductPrice',
      headerName: 'Vendor Product Price',
      minWidth: 100,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'discount',
      headerName: 'Discount',
      minWidth: 150,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'purchaseMargin12',
      headerName: 'Purchase Margin',
      minWidth: 150,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
  ];

  const uomArr = [
    { value: 'nos', label: 'each' },
    { value: 'Grams', label: 'gm' },
    { value: 'Kilograms', label: 'kg' },
    { value: 'Millilitres', label: 'ml' },
    { value: 'Litres', label: 'ltr' },
  ];

  const getWeightUnitLabel = (weightUnitValue) => {
    const uom = uomArr.find((unit) => unit.value === weightUnitValue);
    return uom ? uom.label : weightUnitValue; // Return the label if found, else return the value itself
  };

  return (
    <div>
      <Dialog
        open={openVendorPop}
        TransitionComponent={Transition}
        keepMounted
        maxWidth={false}
        PaperProps={{ style: { width: '100%', maxWidth: 'none', padding: '15px' } }}
        onClose={() => setOpenVendorPop(false)}
      >
        <SoftBox mb={2} mt={2} sx={{ width: '100%' }}>
          <DataGrid
            sx={{
              ...dataGridStyles.header,
              borderRadius: '24px',
              cursor: 'pointer',
              '& .MuiDataGrid-root': {
                height: '100%',
              },
            }}
            columns={columns}
            rows={vendorData}
            pagination
            pageSize={5}
            disableHover
            autoHeight
            disableSelectionOnClick
            getRowId={(row) => row.id}
          />
        </SoftBox>
      </Dialog>
      <SoftBox>
        {!isRestaurant && (
          <Typography className="product-new-details-brand-typo">
            {productDetails?.companyDetail?.brand || 'NA'} - {productDetails?.companyDetail?.subBrand || 'NA'}
          </Typography>
        )}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography className="product-new-details-name-typo" style={{ marginTop: isMobileDevice ? '0px' : '10px' }}>
            {productDetails?.name}
          </Typography>
          {tag && isRestaurant && (
            <div
              style={{
                backgroundColor: tag?.color,
                padding: '4px 10px',
                borderRadius: '5px',
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '12px',
              }}
            >
              {tag?.label}
            </div>
          )}
        </div>

        <SoftBox className={!isMobileDevice ? 'product-new-details-gst-box' : 'products-new-details-gst-box-mob'}>
          {/* <Typography className="product-new-details-gst-typo">
            HSN Code:{' '}
            <span className="product-new-details-gst-typo-value">
              {productDetails?.taxReference?.metadata?.hsnCode}
            </span>
          </Typography> */}
          {Object.entries(productDetails?.taxReference?.metadata || {}).map(([key, value]) => (
            <Typography key={key} className="product-new-details-gst-typo">
              {key === 'hsnCode' ? 'HSN Code' : key.toUpperCase()}:{' '}
              <span className="product-new-details-gst-typo-value">
                {key === 'hsnCode' ? value : value || 0} {key === 'hsnCode' ? '' : '%'}
              </span>
            </Typography>
          ))}
          {!productDetails?.taxReference?.metadata?.gst && productDetails?.taxReference?.taxType === 'GST' && (
            <Typography className="product-new-details-gst-typo">
              GST:{' '}
              <span className="product-new-details-gst-typo-value">{productDetails?.taxReference?.taxRate || 0}%</span>
            </Typography>
          )}
          {/* <Typography className="product-new-details-gst-typo">
            Cess:{' '}
            <span className="product-new-details-gst-typo-value">
              {productDetails?.taxReference?.metadata?.cess ? productDetails?.taxReference?.metadata?.cess : 0}%
            </span>
          </Typography> */}
        </SoftBox>

        {!isMobileDevice && (
          <SoftBox className="products-new-details-tags-div">
            {productDetails?.returnable && (
              <div className="products-new-details-tag-single">
                <img
                  src="https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_new_ui_images/Icon%20assignment%20return.png"
                  style={{ height: '31px' }}
                />
                <Typography className="products-new-details-tag-typo">
                  Return within {productDetails?.minutesToReturnBack ? productDetails.minutesToReturnBack : 'NA'} days
                </Typography>
              </div>
            )}

            {productDetails?.attributes?.foodType && (
              <div className="products-new-details-tag-single">
                <img
                  src={
                    productDetails?.attributes?.foodType === 'NA'
                      ? 'https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_new_ui_images/Icon%20no%20food.png'
                      : 'https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_new_ui_images/food.png'
                  }
                  style={{ height: '19px' }}
                />
                <Typography className="products-new-details-tag-typo">
                  {productDetails?.attributes?.foodType === 'NA'
                    ? 'Non-food item'
                    : capitalizeFirstLetterOfWords(productDetails?.attributes?.foodType)}
                </Typography>
              </div>
            )}

            {productDetails?.attributes?.regulatoryData?.organic === 'N' ? (
              <div className="products-new-details-tag-single">
                <img
                  src="https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_new_ui_images/plant.png"
                  style={{ height: '26px' }}
                />
                <Typography className="products-new-details-tag-typo">Non-organic</Typography>
              </div>
            ) : productDetails?.attributes?.regulatoryData?.organic === 'Y' ? (
              <div className="products-new-details-tag-single">
                <img
                  src="https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_new_ui_images/natural-product.png"
                  style={{ height: '26px' }}
                />
                <Typography className="products-new-details-tag-typo">Organic</Typography>
              </div>
            ) : null}

            {productDetails?.variants &&
              productDetails?.variants.length > 0 &&
              selectedVariant &&
              selectedVariant?.cartons.length !== 0 && (
                <div className="products-new-details-tag-single">
                  <img
                    src="https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_new_ui_images/Icon%20cube.png"
                    style={{ height: '32px' }}
                  />
                  <Typography className="products-new-details-tag-typo">
                    {capitalizeFirstLetterOfWords(selectedVariant?.cartons[0]?.value)} in a{' '}
                    {capitalizeFirstLetterOfWords(selectedVariant?.cartons[0]?.type)}
                  </Typography>
                </div>
              )}

            {/* <div className="products-new-details-tag-single">
              <img
                src="https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_new_ui_images/Icon%20tape.png"
                style={{ height: '26px' }}
              />
              <Typography className="products-new-details-tag-typo">Plastic bottle</Typography>
            </div> */}

            {productDetails?.variants &&
            productDetails?.variants?.length > 0 &&
            selectedVariant &&
            selectedVariant?.needsWeighingScaleIntegration === false ? (
              <div className="products-new-details-tag-single">
                <img
                  src="https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_new_ui_images/scale.png"
                  style={{ height: '25px' }}
                />
                <Typography className="products-new-details-tag-typo">Non-weighing scale</Typography>
              </div>
            ) : (
              <div className="products-new-details-tag-single">
                <img
                  src="https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_new_ui_images/scale%20(1).png"
                  style={{ height: '25px' }}
                />
                <Typography className="products-new-details-tag-typo">Weighing scale</Typography>
              </div>
            )}

            {productDetails?.attributes?.gender && productDetails?.attributes?.gender !== 'NA' && (
              <div className="products-new-details-tag-single">
                <img
                  src={
                    productDetails?.attributes?.gender === 'MEN'
                      ? 'https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_new_ui_images/Icon%20man%203.png'
                      : productDetails?.attributes?.gender === 'WOMEN'
                      ? 'https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_new_ui_images/woman.png'
                      : 'https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_new_ui_images/female.png'
                  }
                  style={{ height: '23px' }}
                />
                <Typography className="products-new-details-tag-typo">
                  {capitalizeFirstLetterOfWords(productDetails?.attributes?.gender)}
                </Typography>
              </div>
            )}
          </SoftBox>
        )}

        {isMobileDevice && (
          <SoftBox style={{ marginLeft: '-10px', marginTop: '-10px' }}>
            <SplideCommon>
              {productDetails?.returnable && (
                <SplideSlide className="mob-res-slide" style={{ padding: '0px' }}>
                  <Chip
                    label={`Return within
                    ${productDetails?.minutesToReturnBack ? productDetails?.minutesToReturnBack : 'NA'}
                    days`}
                    avatar={
                      <Avatar
                        alt="Natacha"
                        src="https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_new_ui_images/Icon%20assignment%20return.png"
                      />
                    }
                    variant="outlined"
                  />
                </SplideSlide>
              )}

              {productDetails?.attributes?.regulatoryData?.organic && (
                <SplideSlide className="mob-res-slide">
                  <Chip
                    label={productDetails?.attributes?.regulatoryData?.organic === 'N' ? 'Non-Organic' : 'Organic'}
                    avatar={
                      <Avatar
                        alt="Natacha"
                        src={
                          productDetails?.attributes?.regulatoryData?.organic === 'N'
                            ? 'https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_new_ui_images/plant.png'
                            : 'https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_new_ui_images/natural-product.png'
                        }
                      />
                    }
                    variant="outlined"
                  />
                </SplideSlide>
              )}

              {productDetails?.variants &&
                productDetails?.variants?.length > 0 &&
                selectedVariant &&
                selectedVariant?.needsWeighingScaleIntegration === false && (
                  <SplideSlide className="mob-res-slide">
                    <Chip
                      label={
                        productDetails?.variants &&
                        productDetails?.variants?.length > 0 &&
                        selectedVariant &&
                        selectedVariant?.needsWeighingScaleIntegration === false
                          ? 'Non-weighing scale'
                          : 'Weighing-scale'
                      }
                      avatar={
                        <Avatar
                          alt="Natacha"
                          src={
                            productDetails?.variants &&
                            productDetails?.variants?.length > 0 &&
                            selectedVariant &&
                            selectedVariant?.needsWeighingScaleIntegration
                              ? 'https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_new_ui_images/scale%20(1).png'
                              : 'https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_new_ui_images/scale.png'
                          }
                        />
                      }
                      variant="outlined"
                    />
                  </SplideSlide>
                )}

              {productDetails?.attributes?.gender && productDetails?.attributes?.gender !== 'NA' && (
                <SplideSlide className="mob-res-slide">
                  <Chip
                    label={capitalizeFirstLetterOfWords(productDetails?.attributes?.gender)}
                    avatar={
                      <Avatar
                        alt="Natacha"
                        src={
                          productDetails?.attributes?.gender === 'MEN'
                            ? 'https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_new_ui_images/Icon%20man%203.png'
                            : productDetails?.attributes?.gender === 'WOMEN'
                            ? 'https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_new_ui_images/woman.png'
                            : 'https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_new_ui_images/female.png'
                        }
                      />
                    }
                    variant="outlined"
                  />
                </SplideSlide>
              )}

              {/* <SplideSlide className="mob-res-slide">
                <Chip
                  label={'Plastic Bottle'}
                  avatar={
                    <Avatar
                      alt="Natacha"
                      src="https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_new_ui_images/Icon%20tape.png"
                    />
                  }
                  variant="outlined"
                />
              </SplideSlide> */}
              {productDetails?.attributes?.foodType && (
                <SplideSlide className="mob-res-slide">
                  <Chip
                    label={
                      productDetails?.attributes?.foodType === 'NA'
                        ? 'Non-food item'
                        : capitalizeFirstLetterOfWords(productDetails?.attributes?.foodType)
                    }
                    avatar={
                      <Avatar
                        alt="Natacha"
                        src={
                          productDetails?.attributes?.foodType === 'NA'
                            ? 'https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_new_ui_images/Icon%20no%20food.png'
                            : 'https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_new_ui_images/food.png'
                        }
                      />
                    }
                    variant="outlined"
                  />
                </SplideSlide>
              )}

              {productDetails?.variants &&
                productDetails?.variants.length > 0 &&
                selectedVariant &&
                selectedVariant?.cartons.length !== 0 && (
                  <SplideSlide className="mob-res-slide">
                    <Chip
                      label={`${capitalizeFirstLetterOfWords(
                        selectedVariant?.cartons[0]?.value,
                      )} in a ${capitalizeFirstLetterOfWords(selectedVariant?.cartons[0]?.type)}`}
                      avatar={
                        <Avatar
                          alt="Natacha"
                          src="https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_new_ui_images/Icon%20cube.png"
                        />
                      }
                      variant="outlined"
                    />
                  </SplideSlide>
                )}
            </SplideCommon>
          </SoftBox>
        )}

        <SoftBox className="products-new-details-sales-channel-div">
          {!isMobileDevice && <Typography className="products-new-details-pack-typo">Pack Sizes</Typography>}
          {productDetails?.variants &&
            productDetails.variants.length > 0 &&
            selectedVariant &&
            selectedVariant.salesChannels &&
            selectedVariant.salesChannels.length > 0 && (
              <div className="products-new-details-sales-channel-box">
                <Typography className="products-new-details-pack-typo">Sales Channel</Typography>
                {selectedVariant && selectedVariant.salesChannels && selectedVariant.salesChannels.length > 0 && (
                  <Typography className="products-details-sales-channel-typo">
                    {selectedVariant.salesChannels
                      .map((channel) => {
                        if (channel === 'TWINLEAVES_APP') {
                          return 'App';
                        }
                        return channel.replace(/_/g, ' ');
                      })
                      .map((channel) => channel.split(' ').map(capitalise).join(' '))
                      .join(', ')}
                  </Typography>
                )}
              </div>
            )}
        </SoftBox>

        {!isMobileDevice && (
          <>
            {isRestaurant ? (
              <RestaurantVariantsSection
                variants={variants}
                handleRadioButtonChange={handleRadioButtonChange}
                download={download}
                d_img={d_img}
                getWeightUnitLabel={getWeightUnitLabel}
              />
            ) : (
              <GroceryVariantsSection
                variants={variants}
                handleRadioButtonChange={handleRadioButtonChange}
                download={download}
                d_img={d_img}
                getWeightUnitLabel={getWeightUnitLabel}
              />
            )}
          </>
        )}

        {isMobileDevice && (
          <SoftBox style={{ marginLeft: '-10px', marginTop: '-10px' }}>
            <SplideCommon>
              {variants.map((item, index) => (
                <SplideSlide>
                  <Card className="productKpiCard">
                    <div>
                      <input
                        type="radio"
                        id={`scheduleYes${index}`}
                        name="scheduleGroup"
                        value={item?.quantity}
                        className="dynamic-coupon-marginright-10"
                        checked={item?.checked}
                        onChange={() => handleRadioButtonChange(item, index)}
                      />
                      <label htmlFor={`scheduleYes${index}`} className="products-new-department-label-typo">
                        {item?.weight} {item?.weightUnit}
                      </label>
                    </div>
                    <div style={{ marginTop: '10px', padding: '0px 10px', display: 'flex' }}>
                      <img
                        style={{
                          display: item?.barcodeImage ? 'block' : 'none',
                          objectFit: 'cover',
                          height: '70px',
                          marginRight: '20px',
                        }}
                        src={item?.barcodeImage ? item?.barcodeImage : d_img}
                        alt=""
                      />
                      <div onClick={() => showSnackbar('Copied', 'success')}>
                        {item?.barcodeImage && <CopyToClipboardIcon textToCopy={item?.barcodes[0]} fontSize="small" />}
                      </div>
                      {/* {item?.barcodeImage && (
                        <SoftButton
                          variant="gradient"
                          color="info"
                          iconOnly
                          onClick={() => download(item?.barcodeImage)}
                        >
                          <DownloadIcon />
                        </SoftButton>
                      )} */}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                      <div className="products-new-details-variants-price" style={{ alignItems: 'flex-start' }}>
                        <Typography className="products-new-details-variants-price-typo-sm">Purchase Price</Typography>
                        <Typography className="products-new-details-variants-price-typo-value">
                          {item?.purchasePrice}
                        </Typography>
                      </div>
                      <div className="products-new-details-variants-price" style={{ alignItems: 'flex-start' }}>
                        <Typography className="products-new-details-variants-price-typo-sm">Purchase Margin</Typography>
                        <Typography className="products-new-details-variants-price-typo-value">
                          {item?.purchaseMargin}
                        </Typography>
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                      <div className="products-new-details-variants-price" style={{ alignItems: 'flex-start' }}>
                        <Typography className="products-new-details-variants-price-typo-sm">MRP</Typography>
                        <Typography className="products-new-details-variants-price-typo-value">{item?.mrp}</Typography>
                      </div>
                      <div className="products-new-details-variants-price" style={{ alignItems: 'flex-start' }}>
                        <Typography className="products-new-details-variants-price-typo-sm">Sale Price</Typography>
                        <Typography className="products-new-details-variants-price-typo-value">
                          {item?.salePrice}
                        </Typography>
                      </div>
                      <div className="products-new-details-variants-price" style={{ alignItems: 'flex-start' }}>
                        <Typography className="products-new-details-variants-price-typo-sm">Stock In Hand</Typography>
                        <Typography className="products-new-details-variants-price-typo-value">
                          {item?.availableQty}
                        </Typography>
                      </div>
                    </div>
                  </Card>
                </SplideSlide>
              ))}
            </SplideCommon>
          </SoftBox>
        )}
      </SoftBox>
    </div>
  );
};

export default ProductsDetailsInfo;
