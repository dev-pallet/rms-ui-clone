import React, { useEffect, useState } from 'react';
import './index.css';
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  Menu,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import SoftBox from '../../../../../../../../components/SoftBox';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SoftInput from '../../../../../../../../components/SoftInput';
import SoftSelect from '../../../../../../../../components/SoftSelect';
import SoftTypography from '../../../../../../../../components/SoftTypography';
import SoftButton from '../../../../../../../../components/SoftButton';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import VerifiedIcon from '@mui/icons-material/Verified';
import ProductVarientImagesUpload from './varientImages';
import { useSelector } from 'react-redux';
import { getClearedDetails, getProductDetails } from '../../../../../../../../datamanagement/productDetailsSlice';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import {
  generateBarcode,
  generateWeighingScaleBarcode,
  getGlobalProducts,
} from '../../../../../../../../config/Services';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloseIcon from '@mui/icons-material/Close';
import { useSnackbar } from '../../../../../../../../hooks/SnackbarProvider';
import { debounce } from 'lodash';
import Swal from 'sweetalert2';
import Spinner from '../../../../../../../../components/Spinner';
import { isSmallScreen } from '../../../../../../Common/CommonFunction';
import AddIcon from '@mui/icons-material/Add';
import VariantModal from './VariantModal';
import EditSharpIcon from '@mui/icons-material/EditSharp';
import CheckIcon from '@mui/icons-material/Check';
import ImageSharpIcon from '@mui/icons-material/ImageSharp';

const uomArr = [
  { value: 'nos', label: 'each' },
  { value: 'Grams', label: 'gm' },
  { value: 'Kilograms', label: 'kg' },
  { value: 'Millilitres', label: 'ml' },
  { value: 'Litres', label: 'ltr' },
];

const packageTypeArr = [
  { value: 'Pouch', label: 'Pouch' },
  { value: 'Can', label: 'Can' },
  { value: 'Bottle', label: 'Bottle' },
  { value: 'Sachet', label: 'Sachet' },
  { value: 'Loose', label: 'Loose' },
  { value: 'Sealed', label: 'Sealed' },
];
const weighingScaleTypeArr = [{ value: 'Loose', label: 'Loose' }];

const taxStatusArr = [
  { value: 'EXEMPT', label: 'Exempted' },
  { value: 'TAXABLE', label: 'Taxable' },
];

const salesChannelArr = [
  { value: 'IN_STORE', label: 'Store' },
  // { value: 'TWINLEAVES_APP', label: 'App' },
  { value: 'B2C_APP', label: 'App' },
  { value: 'B2B_APP', label: 'B2B App' },
];

const AddProductVariant = ({ onDataChange, isEditable, descriptionData }) => {
  const showSnackBar = useSnackbar();
  const isMobileDevice = isSmallScreen();
  const locId = localStorage.getItem('locId');
  const orgId = localStorage.getItem('orgId');
  const isEditing = location.pathname !== '/products/all-products/add-products';
  const productData = useSelector(isEditable ? getProductDetails : getClearedDetails);
  const user_roles = JSON.parse(localStorage.getItem('user_roles'));
  const permission = user_roles?.includes('SUPER_ADMIN');
  const [productVariantArr, setProductVariantArr] = useState([]);
  const [isWeighingScale, setIsWeighingScale] = useState(false);
  const [currIndex, setCurrIndex] = useState('');
  const [openImageModal, setOpenImageModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuIndex, setMenuIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState();
  const openModal = (index) => {
    setIsModalOpen(true);
    setSelectedIndex(index);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedIndex();
  };

  const handleMenuOpen = (event, index) => {
    setAnchorEl(event.currentTarget);
    setMenuIndex(index);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuIndex(null);
  };

  const handleMenuClick = (action, index) => {
    switch (action) {
      case 'activate':
        setIsActive(index, true);
        break;
      case 'deactivate':
        setIsActive(index, false);
        break;
      case 'delete':
        handleDeleteRow(index);
        break;
      default:
        break;
    }
    handleMenuClose();
  };

  const handleCloseImageModal = () => {
    setOpenImageModal(false);
  };

  const handleAddPhoto = (index) => {
    setOpenImageModal(true);
    setCurrIndex(index);
  };

  const handleDeleteRow = (index) => {
    if (productVariantArr.length > 0) {
      const newArray = [...productVariantArr];
      newArray.splice(index, 1);
      setProductVariantArr(newArray);
    } else {
      showSnackBar('At least one variant must be present.', 'warning');
    }
  };

  const handleAddMore = (weighingScaleType) => {
    const newRow = [
      ...productVariantArr,
      {
        name: descriptionData?.productTitle,
        barcode: '',
        uom: '',
        specification: '',
        packageType: '',
        mrp: '',
        taxStatus: '',
        cartonData: '',
        salesChannel: '',
        imageList: [],
        isActive: true,
        weighingScale: weighingScaleType,
        referenceID: '',
        loader: false,
        appMinQty: 1,
        b2cMinQty: 1,
        b2bMinQty: 1,
        storeMinQty: 1,
      },
    ];
    setProductVariantArr(newRow);
  };

  const checkAvailableBarcode = (barcode) => {
    const payload = {
      page: 1,
      pageSize: 10,
      barcode: [barcode],
      storeLocations: [locId],
    };

    return getGlobalProducts(payload)
      .then((res) => {
        const productLength = res?.data?.data?.data?.data?.length || 0;
        if (productLength > 0) {
          showSnackBar('Barcode already present for this location.', 'error');
          return 'cancel'; // Return 'cancel' if barcode is present
        }
        return 'continue'; // Return 'continue' if barcode is not present
      })
      .catch(() => {
        return 'error'; // Handle error case
      });
  };

  // Debounced version of the API call to avoid checking on every key press
  const debouncedCheckAvailableBarcode = debounce(checkAvailableBarcode, 300);

  const handleInputChange = async (index, fieldName, value) => {
    // Make a copy of the productVariantArr to update
    const updatedData = [...productVariantArr];
    // Update the field value
    updatedData[index][fieldName] = value;
    setProductVariantArr(updatedData);
    let baseName = updatedData[index]?.name ? updatedData[index]?.name?.split('-')[0]?.trim() : '';
    // If the field being changed is barcode, check availability
    if (fieldName === 'barcode') {
      const result = await debouncedCheckAvailableBarcode(value); // Wait for the debounce result
      if (result === 'cancel') {
        // If barcode is already present, clear the field
        updatedData[index][fieldName] = '';
        setProductVariantArr(updatedData);
      }
    }
    // Clear the barcode if weighingScale is true
    if (fieldName === 'weighingScale' && value === true) {
      updatedData[index]['barcode'] = ''; // Clear barcode if weighingScale is true
      // Only set the base name for weighingScale
      updatedData[index].name = baseName;
    } else if (fieldName === 'specification' || fieldName === 'uom') {
      // Split the name by the delimiter '-' to isolate the base name
      const specification = updatedData[index]?.specification || '';
      const uom = updatedData[index]?.uom === 'each' ? 'nos' : updatedData[index]?.uom || '';
      // Build the updated name by keeping the baseName and appending spec and uom together
      const specAndUom = [specification, uom]?.filter(Boolean)?.join(' '); // Join spec and uom with space
      const updatedName = `${baseName}${specAndUom ? ` - ${specAndUom}` : ''}`.trim();
      // Update the name in updatedData
      updatedData[index].name = updatedData?.[index]?.weighingScale ? baseName : updatedName;
    }

    setProductVariantArr(updatedData);
  };

  useEffect(() => {
    if (descriptionData) {
      const updatedData = productVariantArr?.map((variant) => ({
        ...variant,
        name: variant?.name || descriptionData?.productTitle,
      }));
      setProductVariantArr(updatedData);
    }
  }, [descriptionData?.productTitle]);

  useEffect(() => {
    onDataChange(productVariantArr);
  }, [productVariantArr]);

  useEffect(() => {
    let mappedData = [];
    if (productData?.variants?.length > 0) {
      mappedData = productData?.variants?.map((item) => ({
        variantId: item?.variantId || '',
        name: item?.name || '',
        barcode: item?.barcodes[0] || '',
        uom: item?.weightUnit === 'Kg' ? 'Kilograms' : item?.weightUnit || '',
        specification: item?.weight,
        packageType: item?.packType || '',
        mrp: item?.mrpData?.length > 0 ? item?.mrpData[0]?.mrp : '',
        taxStatus: item?.taxStatus || '',
        cartonData: item?.cartons?.[0]?.value || '',
        salesChannel: item?.salesChannels || '',
        weighingScale: item?.needsWeighingScaleIntegration,
        imageList: Object.values(item?.images || {}),
        isActive: item?.isActive,
        referenceID: item?.storeReference?.[0] ? item?.storeReference?.[0] : '',
        disabled: isEditing,
        b2cMinQty: item?.minB2COrderQuantity,
        b2cMaxQty: item?.maxB2COrderQuantity,
        b2bMinQty: item?.minB2BOrderQuantity,
        b2bMaxQty: item?.maxB2BOrderQuantity,
        storeMinQty: item?.minPosOrderQuantity,
        storeMaxQty: item?.maxPosOrderQuantity,
        appMinQty:
          item?.minB2BOrderQuantity === item?.minB2COrderQuantity && item?.minB2BOrderQuantity != null
            ? item.minB2BOrderQuantity
            : null,
        appMaxQty:
          item?.maxB2BOrderQuantity === item?.maxB2COrderQuantity && item?.maxB2BOrderQuantity != null
            ? item?.maxB2BOrderQuantity
            : null,
        inventorySync: item?.inventorySync || {},

        secondaryWeighingUnits:
          item?.weightsAndMeasures
            ?.filter((measure) => measure?.metadata?.type === 'SECONDARY')
            ?.map((measure) => ({
              unit: measure?.netWeight,
              option: {
                value: measure?.measurementUnit,
                label: uomArr.find((uom) => uom?.value === measure?.measurementUnit)?.label || '',
              },
            })) || [],
      }));
    }

    setProductVariantArr(mappedData || []);
  }, [productData]);

  const handleGenerateBarCode = (index) => {
    const updatedVariants = [...productVariantArr];
    updatedVariants[index] = { ...updatedVariants[index], loader: true };
    setProductVariantArr(updatedVariants);
    const variant = productVariantArr[index];

    if (variant?.weighingScale && variant?.barcode) {
      handleInputChange(index, 'barcode', '');
    }

    const barcodePromise = variant.weighingScale ? generateWeighingScaleBarcode() : generateBarcode();
    barcodePromise
      .then((res) => {
        const updatedVariants = [...productVariantArr];
        updatedVariants[index] = { ...updatedVariants[index], loader: false };
        setProductVariantArr(updatedVariants);
        handleInputChange(index, 'barcode', res?.data?.data?.barcode);
      })
      .catch(() => {
        const updatedVariants = [...productVariantArr];
        updatedVariants[index] = { ...updatedVariants[index], loader: false };
        setProductVariantArr(updatedVariants);
        showSnackBar('Error while generating barcode', 'error');
      });
  };

  const setIsActive = (index, status) => {
    const updatedData = productVariantArr.map((item, i) => (i === index ? { ...item, isActive: status } : item));
    setProductVariantArr(updatedData);
  };

  const getValueAfterLastUnderscore = (str) => {
    if (str) {
      const parts = str.split('_');
      return parts.length > 1 ? parts[parts.length - 1] : null;
    } else {
      return null;
    }
  };

  const [editingIndex, setEditingIndex] = useState(null);
  const [editedText, setEditedText] = useState('');

  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditedText('');
  };

  const handleSave = (index) => {
    const nameToSave = editedText || productVariantArr[index]?.name;
    handleInputChange(index, 'name', nameToSave);
    setEditingIndex(null);
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setEditedText('');
  };

  return (
    <>
      <VariantModal
        isOpen={isModalOpen}
        onClose={closeModal}
        handleInputChange={handleInputChange}
        selectedIndex={selectedIndex}
        productVariantArr={productVariantArr}
      />
      <Card sx={{ padding: '15px' }}>
        <SoftBox className="common-display-flex" style={{ gap: '5px', justifyContent: 'flex-start' }}>
          <div className="title-heading-products">
            Product Variant{' '}
            <span className="main-header-icon">
              <Tooltip title="Specify variant details of the product" placement="right">
                <InfoOutlinedIcon />
              </Tooltip>
            </span>
          </div>
        </SoftBox>
        <SoftBox style={{ marginTop: '10px', overflowX: 'scroll' }}>
          {productVariantArr?.map((item, index) => {
            return (
              <>
                <SoftBox
                  style={{
                    marginTop: index === 0 ? '10px' : '5px',
                    minWidth: '950px',
                    backgroundColor: item?.isActive ? '' : '#d3d3d338',
                    borderRadius: '10px',
                    border: '1px solid #d2d6da',
                    padding: '10px 0px 10px 10px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '5px',
                      marginTop: index === 0 ? '0px' : '5px',
                    }}
                  >
                    {/* Check if this is the item being edited */}
                    {editingIndex === index ? (
                      <TextField
                        value={editedText || item?.name} // Fallback to item?.name if editedText is empty
                        onChange={(event) => setEditedText(event.target.value)} // Only update editedText
                        size="small"
                        autoFocus
                        onBlur={() => handleSave(index)} // Save on losing focus
                        style={{ marginRight: '8px' }}
                      />
                    ) : (
                      <Typography className="variant-name-css" style={{ marginRight: '8px' }}>
                        <ImageSharpIcon style={{ fontSize: '16px' }} /> {item?.name}
                      </Typography>
                    )}

                    {/* Edit/Save/Cancel Icons */}
                    {editingIndex === index ? (
                      <div>
                        <IconButton onClick={() => handleSave(index)} size="small">
                          <CheckIcon style={{ fontSize: '16px', cursor: 'pointer' }} />
                        </IconButton>
                        <IconButton onClick={handleCancel} size="small">
                          <CloseIcon style={{ fontSize: '16px', cursor: 'pointer' }} />
                        </IconButton>
                      </div>
                    ) : (
                      <IconButton onClick={() => handleEdit(index)} size="small">
                        <EditSharpIcon style={{ fontSize: '12px', cursor: 'pointer' }} />
                      </IconButton>
                    )}
                  </div>

                  <Grid container direction="row" justifyContent="space-between" alignItems="center" gap="5px">
                    <Grid item xs={2} md={2} lg={2.5}>
                      {index === 0 && (
                        <InputLabel required className="inputLabel-style">
                          Barcode(EAN){' '}
                        </InputLabel>
                      )}
                      <div className="common-display-flex" style={{ gap: '5px', justifyContent: 'flex-start' }}>
                        {/* <span className="main-header-icon" style={{ color: 'success' }}>
                      <VerifiedIcon color="success" />
                    </span> */}
                        <div style={{ position: 'relative' }}>
                          <SoftInput
                            type="number"
                            size="small"
                            value={item?.barcode || ''}
                            onChange={(event) => handleInputChange(index, 'barcode', event.target.value)}
                            disabled={item?.disabled || item?.weighingScale}
                            // endAdornment={
                            //   <InputAdornment position="left">
                            //     <Button size="small">Gen</Button>
                            //   </InputAdornment>
                            // }
                          />

                          {!item?.weighingScale && (
                            <SoftTypography
                              onClick={() => {
                                if (!item?.disabled) {
                                  handleGenerateBarCode(index);
                                }
                              }}
                              style={{
                                fontSize: '1.2rem',
                                position: 'absolute',
                                top: !item?.loader ? '0px' : '5px',
                                right: '10px',
                                cursor: 'pointer',
                              }}
                            >
                              {!item?.loader ? (
                                <Tooltip title="Generate Barcode" placement="bottom">
                                  <AutoAwesomeIcon color={item?.barcode ? 'secondary' : 'primary'} fontSize="14px" />
                                </Tooltip>
                              ) : (
                                <div>
                                  <Spinner
                                    size="20px"
                                    sx={{
                                      height: '10px !important',
                                      width: '10px !important',
                                      marginTop: '5px',
                                      color: '#0562fb !important',
                                    }}
                                  />
                                </div>
                              )}
                            </SoftTypography>
                          )}
                        </div>
                      </div>
                    </Grid>

                    <Grid item xs={1.2} md={1.2} lg={1}>
                      {index === 0 && (
                        <InputLabel className="inputLabel-style" required>
                          Specification
                        </InputLabel>
                      )}
                      <SoftInput
                        size="small"
                        value={item?.specification}
                        onChange={(event) => handleInputChange(index, 'specification', event.target.value)}
                      />
                    </Grid>
                    <Grid item xs={1} md={1} lg={0.9}>
                      {index === 0 && (
                        <InputLabel className="inputLabel-style" required>
                          UOM
                        </InputLabel>
                      )}
                      <SoftSelect
                        size="small"
                        menuPortalTarget={document.body}
                        value={uomArr?.find((ele) => ele?.value === item?.uom) || ''}
                        onChange={(option) => handleInputChange(index, 'uom', option.value)}
                        options={uomArr}
                      />
                    </Grid>
                    <Grid item xs={1.2} md={1.2} lg={1.2}>
                      {index === 0 && <InputLabel className="inputLabel-style">Packaging Type</InputLabel>}
                      <SoftSelect
                        size="small"
                        value={packageTypeArr.find((ele) => ele.value === item?.packageType) || ''}
                        menuPortalTarget={document.body}
                        onChange={(option) => handleInputChange(index, 'packageType', option.value)}
                        options={item?.weighingScale ? weighingScaleTypeArr : packageTypeArr}
                      />
                    </Grid>
                    <Grid item xs={0.7} md={0.7} lg={0.7}>
                      {index === 0 && (
                        <InputLabel className="inputLabel-style" required>
                          MRP
                        </InputLabel>
                      )}
                      <SoftInput
                        size="small"
                        value={item?.mrp}
                        onChange={(event) => handleInputChange(index, 'mrp', event.target.value)}
                      />
                    </Grid>
                    <Grid item xs={1} md={1} lg={0.9}>
                      {index === 0 && <InputLabel className="inputLabel-style">Tax Status</InputLabel>}
                      <SoftSelect
                        size="small"
                        menuPortalTarget={document.body}
                        value={taxStatusArr.find((ele) => ele.value === item?.taxStatus) || ''}
                        onChange={(option) => handleInputChange(index, 'taxStatus', option.value)}
                        options={taxStatusArr}
                      />
                    </Grid>
                    {/* <Grid item xs={1.5} md={1.5} lg={1.2}>
                      {index === 0 && <InputLabel className="inputLabel-style">Carton Details</InputLabel>}
                      <div className="common-display-flex-1">
                        <SoftInput
                          size="small"
                          value={item?.cartonData}
                          onChange={(event) => handleInputChange(index, 'cartonData', event.target.value)}
                        />
                        <span style={{ fontSize: '10px', fontWeight: 'bold' }}>In a box</span>
                      </div>
                    </Grid> */}
                    <Grid item xs={1.2} md={2.2} lg={2.5}>
                      {index === 0 && (
                        <InputLabel className="inputLabel-style" required>
                          Sales Channel
                        </InputLabel>
                      )}
                      <SoftSelect
                        size="small"
                        menuPortalTarget={document.body}
                        isMulti
                        value={salesChannelArr.filter((ele) => item?.salesChannel?.includes(ele.value)) || []}
                        onChange={(options) =>
                          handleInputChange(
                            index,
                            'salesChannel',
                            options.map((option) => option.value),
                          )
                        }
                        truncateLabels={true}
                        options={salesChannelArr}
                      />
                    </Grid>
                    <Grid item xs={0.8} md={0.8} lg={0.8}>
                      {index === 0 && <InputLabel className="inputLabel-style">Photos</InputLabel>}
                      <SoftButton
                        size="small"
                        color="info"
                        variant="outlined"
                        onClick={() => handleAddPhoto(index)}
                        style={{ padding: '0px' }}
                      >
                        {productVariantArr[index]?.imageList?.length > 0 ? 'View' : 'Add'}
                      </SoftButton>
                    </Grid>
                    <Grid item xs={0.3} md={0.3} lg={0.3}>
                      {/* {index === 0 && (
                      <Tooltip title="Store Item References" placement="top">
                        <InputLabel className="inputLabel-style">Id</InputLabel>
                      </Tooltip>
                    )}
                    <SoftInput
                      type="number"
                      size="small"
                      value={item?.referenceID}
                      onChange={(e) => handleInputChange(index, 'referenceID', e.target.value)}
                    />{' '} */}
                      <Tooltip title="Add more details for variant" arrow>
                        <AddIcon
                          color="info"
                          style={{ marginTop: index === 0 ? '10px' : '0px', cursor: 'pointer' }}
                          onClick={() => openModal(index)}
                        />
                      </Tooltip>
                    </Grid>
                    {/* <SoftBox mt={index === 0 ? '25px' : '5px'} width="20px" height="40px" style={{ cursor: 'pointer' }}>
                  <IoClose color="red" onClick={() => handleDeleteRow(index)} />
                </SoftBox> */}
                    {isEditable ? (
                      <>
                        <SoftBox
                          mt={index === 0 ? '15px' : '5px'}
                          width="20px"
                          height="40px"
                          style={{ cursor: 'pointer' }}
                          onClick={(event) => handleMenuOpen(event, index)}
                        >
                          <MoreVertIcon />{' '}
                        </SoftBox>
                        <Menu
                          anchorEl={anchorEl}
                          open={Boolean(anchorEl) && menuIndex === index}
                          onClose={handleMenuClose}
                        >
                          <MenuItem onClick={() => handleMenuClick('activate', index)} disabled={!permission}>
                            Activate
                          </MenuItem>
                          <MenuItem onClick={() => handleMenuClick('deactivate', index)} disabled={!permission}>
                            Deactivate
                          </MenuItem>
                          <MenuItem onClick={() => handleMenuClick('delete', index)} disabled={!permission}>
                            Delete
                          </MenuItem>
                        </Menu>
                      </>
                    ) : (
                      <CloseIcon
                        onClick={() => handleMenuClick('delete', index)}
                        style={{
                          color: 'red',
                          fontSize: '16px',
                          marginTop: index === 0 ? '13px' : '0px',
                          marginRight: '5px',
                          cursor: 'pointer',
                        }}
                      />
                    )}
                  </Grid>
                </SoftBox>
              </>
            );
          })}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              marginTop: '10px',
              marginLeft: '5px',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            <SoftButton
              onClick={() => {
                handleAddMore(true);
              }}
              style={{ textTransform: 'none', backgroundColor: 'aliceblue' }}
              size="small"
            >
              + Add Weighing Scale{' '}
              <img
                src="https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_new_ui_images/scale%20(1).png"
                alt="Weighing Scale"
                style={{
                  height: '20px',
                  marginLeft: '10px',
                }}
              />
            </SoftButton>{' '}
            {!isMobileDevice && <p style={{ fontSize: 'larger' }}>/</p>}
            <SoftButton
              onClick={() => {
                handleAddMore(false);
              }}
              style={{ textTransform: 'none', backgroundColor: 'aliceblue' }}
              size="small"
            >
              + Add Regular Product{' '}
              <img
                src="https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_new_ui_images/scale.png"
                alt="Weighing Scale"
                style={{
                  height: '20px',
                  marginLeft: '10px',
                }}
              />
            </SoftButton>
          </div>
          {openImageModal && (
            <ProductVarientImagesUpload
              index={currIndex}
              openImageModal={openImageModal}
              handleCloseImageModal={handleCloseImageModal}
              productVariantArr={productVariantArr}
              setProductVariantArr={setProductVariantArr}
            />
          )}
        </SoftBox>
      </Card>
    </>
  );
};

export default AddProductVariant;
