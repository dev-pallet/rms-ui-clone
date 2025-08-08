import { Autocomplete, Card, createFilterOptions, Grid, InputLabel, TextField, Tooltip } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import SoftBox from '../../../../../../../components/SoftBox';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import {
  generateBarcode,
  getAllLevel1Category,
  getAllMainCategory,
  getGlobalProducts,
} from '../../../../../../../config/Services';
import { isSmallScreen } from '../../../../../Common/CommonFunction';
import SoftButton from '../../../../../../../components/SoftButton';
import SoftAsyncPaginate from '../../../../../../../components/SoftSelect/SoftAsyncPaginate';
import SoftSelect from '../../../../../../../components/SoftSelect';
import SoftInput from '../../../../../../../components/SoftInput';
import SoftTypography from '../../../../../../../components/SoftTypography';
import Spinner from '../../../../../../../components/Spinner';
import { useSnackbar } from '../../../../../../../hooks/SnackbarProvider';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ProductVarientImagesUpload from '../../../../../product/new-product-screen/components/create-product/components/product-variant/varientImages';

const inputLabelStyle = { fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' };

const ComboBasicInformation = ({
  productDescription,
  setProductDescription,
  productVariantArr,
  setProductVariantArr,
  barcodeNeed,
  setBarcodeNeed
}) => {
  const [tempTitle, setTempTitle] = useState('');
  const [optArray, setOptArray] = useState([]);
  const locId = localStorage.getItem('locId');
  const orgId = localStorage.getItem('orgId');
  const [optDataArray, setOptDataArray] = useState([]);
  const isMobileDevice = isSmallScreen();
  const filter = createFilterOptions();
  const [subMenuCategoryArray, setSubMenuCategoryArray] = useState([]);
  const showSnackBar = useSnackbar();
  const [openImageModal, setOpenImageModal] = useState(false);
 

  const percentageOptions = useMemo(
    () => [
      { label: '0%', value: 0 },
      { label: '3%', value: 3 },
      { label: '5%', value: 5 },
      { label: '12%', value: 12 },
      { label: '18%', value: 18 },
      { label: '28%', value: 28 },
    ],
    [],
  );

  const percentageOptionsCess = useMemo(
    () => [
      { label: '0%', value: 0 },
      { label: '3%', value: 3 },
      { label: '5%', value: 5 },
      { label: '12%', value: 12 },
      { label: '15%', value: 15 },
      { label: '17%', value: 17 },
      { label: '21%', value: 21 },
      { label: '22%', value: 22 },
    ],
    [],
  );

  const salesChannelsOptions = [
    {
      id: 'DINE_IN', // Add ID
      label: 'Dine in',
      value: 'DINE_IN',
    },
    {
      id: 'TAKE_AWAY',
      label: 'Take away',
      value: 'TAKE_AWAY',
    },
    {
      id: 'DELIVERY',
      label: 'Delivery',
      value: 'DELIVERY',
    },
    // {
    //   id: 'SWIGGY',
    //   label: 'Swiggy',
    //   value: 'SWIGGY',
    // },
    // {
    //   id: 'ZOMATO',
    //   label: 'Zomato',
    //   value: 'ZOMATO',
    // },
    {
      id: 'WEBSITE',
      label: 'Website',
      value: 'WEBSITE',
    },
  ];

  const handleCloseImageModal = () => {
    setOpenImageModal(false);
  };

  const handleAddPhoto = (index) => {
    setOpenImageModal(true);
  };

  const [generateBarcodeLoader, setGenerateBarcodeLoader] = useState(false);
  const handleGenerateBarCode = async (fieldName) => {
    try {
      setGenerateBarcodeLoader(true);
      const respone = await generateBarcode();
      if (respone?.data?.data?.es > 0 || respone?.data?.status === 'ERROR' || respone?.data?.status === 'error') {
        showSnackBar(respone?.data?.message || respone?.data?.data?.message, 'error');
        return;
      }
      const barcode = respone?.data?.data?.barcode || '';
      handleProdutDescription(barcode, fieldName);
      setGenerateBarcodeLoader(false);
    } catch (error) {
      showSnackBar(error?.response?.data?.message || error?.message, 'error');
      setGenerateBarcodeLoader(false);
    }
  };

  const errMsg = optArray?.some((item) => item?.label === productDescription?.productTitle);

  useEffect(() => {
    if (tempTitle?.length > 2) {
      const payload = {
        page: 1,
        pageSize: 10,
        isBundle: true,
        // names: [formData?.productTitle],
        query: tempTitle,
        storeLocationId: locId?.toLowerCase(),
      };
      getGlobalProducts(payload)
        .then((res) => {
          setOptDataArray(res?.data?.data?.data?.data || []);
          const data = res?.data?.data?.data?.data || [];
          setOptArray(data?.map((item) => ({ value: item?.id, label: item?.name })));
        })
        .catch(() => {});
    }
  }, [tempTitle]);

  const fetchLevel2Category = async (mainCategoryId) => {
    try {
      let payload = {
        page: 1,
        pageSize: 50, // Adjust this as needed
        // type: ['APP'],
        sourceId: [orgId],
        sourceLocationId: [locId],
        active: [true],
        ...(mainCategoryId && { mainCategoryId: [mainCategoryId] }),
      };

      const response = await getAllLevel1Category(payload);
      if (response?.data?.data?.results?.length > 0) {
        const subCategoryMenuArray = response?.data?.data?.results?.map((item) => ({
          label: item?.categoryName,
          value: item?.level1Id,
          other: item,
        }));
        setSubMenuCategoryArray(subCategoryMenuArray || []);
      } else {
        setSubMenuCategoryArray([]);
      }
    } catch (error) {}
  };

  const loadMainCategoryOptions = async (searchQuery, loadedOptions, additional, mainCategoryId) => {
    const page = additional.page || 1;

    let payload = {
      page,
      pageSize: 50,
      // type: ['APP'],
      sourceId: [orgId],
      sourceLocationId: [locId],
      active: [true],
      ...(mainCategoryId && { mainCategoryId: [mainCategoryId] }),
    };

    try {
      const response = await getAllMainCategory(payload);
      const results = response?.data?.data?.results || [];

      const options = results?.map((e) => ({
        value: e?.mainCategoryId,
        label: e?.categoryName,
      }));

      return {
        options,
        hasMore: results?.length === 50,
        additional: {
          page: page + 1,
        },
      };
    } catch (error) {
      return {
        options: [],
        hasMore: false,
        additional: {
          page,
        },
      };
    }
  };

  const handleProdutDescription = (value, fieldName) => {
    setProductDescription((prev) => ({
      ...prev,
      [fieldName]:
        fieldName === 'salesChannel'
          ? value.map((item) => item.value) // extract values from selected options
          : value,
    }));
  };

  return (
    <Card sx={{ padding: '15px' }}>
      <SoftBox className="common-display-flex">
        <InputLabel sx={inputLabelStyle} required>
          Product Title
        </InputLabel>
        {errMsg && (
          <div className="common-display-flex">
            <div className="desc-warning-icon">
              <WarningAmberOutlinedIcon />
            </div>
            <div className="duplicate-warning-msg">Duplicate warning: A similar title exists</div>
          </div>
        )}
      </SoftBox>
      <SoftBox className="common-display-flex">
        <Grid container spacing={1} mt={1}>
          <Grid item xs={12} md={8} lg={8}>
            <div style={{ width: '100%' }}>
              <Autocomplete
                size="small"
                value={productDescription?.productName}
                onChange={(event, newValue) => {
                  setProductDescription((prev) => ({
                    ...prev,
                    productName: newValue?.label?.split('Add ')[1]?.split(`"`)?.[1] || newValue?.label,
                  }));
                }}
                filterOptions={(options, params) => {
                  const filtered = filter(options, params);

                  const { inputValue } = params;
                  // Suggest the creation of a new value
                  const isExisting = options?.some((option) => inputValue === option.label);
                  if (inputValue !== '' && !isExisting) {
                    filtered.unshift({
                      inputValue,
                      label: `Add "${inputValue}"`,
                    });
                  }

                  return filtered;
                }}
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                className="free-solo-with-text-demo"
                options={optArray}
                getOptionLabel={(option) => {
                  // Value selected with enter, right from the input
                  if (typeof option === 'string') {
                    return option;
                  }
                  // Add "xxx" option created dynamically
                  if (option.inputValue) {
                    return option.inputValue;
                  }
                  // Regular option
                  return option.label;
                }}
                renderOption={(props, option) => <li {...props}>{option?.label}</li>}
                // sx={{ width: 300 }}
                freeSolo
                renderInput={(params) => (
                  <TextField
                    size="small"
                    {...params}
                    onChange={(event) => setTempTitle(event.target.value)}
                    placeholder="Enter product title, e.g. Sugar"
                    style={{ width: '100%' }}
                    fullWidth
                  />
                )}
              />
            </div>
          </Grid>
          <Grid item xs={12} md={2} lg={4} mt={isMobileDevice ? '10px' : '0px'}>
            <div className="common-display-flex">
              <SoftButton
                className="smallBtnStyle"
                size="small"
                variant="outlined"
                color="info"
                style={{ width: '150px' }}
                onClick={() => handleAddPhoto(0)}
              >
                {productVariantArr?.[0]?.imageList?.length > 0 ? 'View image' : 'Add image'}
              </SoftButton>{' '}
              {openImageModal && (
                <ProductVarientImagesUpload
                  index={0}
                  openImageModal={openImageModal}
                  handleCloseImageModal={handleCloseImageModal}
                  productVariantArr={productVariantArr}
                  setProductVariantArr={setProductVariantArr}
                />
              )}
              <div className="main-header-icon">
                <Tooltip title="Search for global products">
                  <InfoOutlinedIcon />
                </Tooltip>
              </div>
            </div>
          </Grid>
        </Grid>
      </SoftBox>

      <SoftBox style={{ marginTop: '10px' }}>
        <div className="title-heading-products">
          Menu Category
          <span className="main-header-icon">
            <Tooltip title=" Select the appropriate product category">
              <InfoOutlinedIcon />
            </Tooltip>
          </span>
        </div>
        <Grid container mt={1} direction="row" justifyContent="flex-start" alignItems="baseline">
          <Grid item xs={12} md={4} lg={4}>
            <SoftBox style={{ width: '95%' }}>
              <InputLabel sx={inputLabelStyle} required>
                Main Menu
              </InputLabel>

              <SoftAsyncPaginate
                size="small"
                className="select-box-category"
                placeholder="Select category..."
                value={productDescription?.category}
                loadOptions={loadMainCategoryOptions}
                additional={{
                  page: 1,
                }}
                isClearable
                onChange={(option) => {
                  handleProdutDescription(option, 'category');
                  fetchLevel2Category(option?.value);
                }}
                menuPortalTarget={document.body}
              />
            </SoftBox>
          </Grid>
          <Grid item xs={12} md={4} lg={4}>
            <SoftBox style={{ width: '95%' }}>
              <InputLabel sx={inputLabelStyle} required>
                Sub-Menu
              </InputLabel>
              <SoftSelect
                size="small"
                className="select-box-category"
                value={productDescription?.subCategory}
                options={subMenuCategoryArray}
                onChange={(option) => handleProdutDescription(option, 'subCategory')}
                menuPortalTarget={document.body}
              />
            </SoftBox>
          </Grid>
          <Grid item xs={12} md={4} lg={4}>
            <SoftBox style={{ width: '95%' }}></SoftBox>
          </Grid>
        </Grid>
      </SoftBox>
      <SoftBox style={{ marginTop: '10px' }}>
        <Grid container mt={1} direction="row" justifyContent="flex-start" alignItems="baseline" gap="10px">
          <Grid item xs={3} md={3} lg={3}>
            <SoftBox style={{ width: '100%' }}>
              <InputLabel sx={inputLabelStyle}>Short Code</InputLabel>
              <SoftInput
                value={productDescription?.shortCode}
                placeholder="Enter short code for the product"
                onChange={(e) => handleProdutDescription(e.target.value, 'shortCode')}
                size="small"
              />
            </SoftBox>
          </Grid>
          <Grid item xs={6} md={6} lg={6}>
            <SoftBox style={{ width: '100%' }}>
              <InputLabel sx={inputLabelStyle}>Sales Channel</InputLabel>
              <SoftSelect
                value={salesChannelsOptions?.filter((option) =>
                  productDescription?.salesChannel?.includes(option?.value),
                )}
                placeholder="Select Sales Channel"
                onChange={(e) => handleProdutDescription(e, 'salesChannel')}
                size="small"
                isMulti={true}
                options={salesChannelsOptions}
              />
            </SoftBox>
          </Grid>
        </Grid>
      </SoftBox>

      <SoftBox style={{ marginTop: '10px' }}>
        <Grid container mt={1} direction="row" justifyContent="flex-start" alignItems="baseline" gap="10px">
          <Grid item xs={2} md={1} lg={1}>
            <div className="stack-row-center-start width-100">
              <div>
                <input
                  type="checkbox"
                  id="barcodeNeed"
                  name="barcodeNeed"
                  checked={barcodeNeed}
                  onChange={(e) => setBarcodeNeed(e.target.checked)}
                />
                <label className="dynamic-coupon-label-typo">Barcode</label>
              </div>
            </div>
          </Grid>
          {barcodeNeed && (
            <Grid item xs={8} md={4} lg={4}>
              <SoftBox style={{ width: '100%' }}>
                <InputLabel sx={inputLabelStyle}>Barcode</InputLabel>
                <div>
                  <div style={{ position: 'relative' }}>
                    <SoftInput
                      size="small"
                      placeholder="Enter barcode for the product"
                      value={productDescription?.barcode}
                      onChange={(e) => handleProdutDescription(e?.target?.value, barcode)}
                    />

                    <SoftTypography
                      onClick={() => {
                        handleGenerateBarCode('barcode');
                      }}
                      style={{
                        fontSize: '1.2rem',
                        position: 'absolute',
                        top: !generateBarcodeLoader ? '0px' : '5px',
                        right: '10px',
                        cursor: 'pointer',
                      }}
                    >
                      {!generateBarcodeLoader ? (
                        <Tooltip title="Generate Barcode" placement="bottom">
                          <AutoAwesomeIcon
                            color={productDescription?.barcode ? 'secondary' : 'primary'}
                            fontSize="14px"
                          />
                        </Tooltip>
                      ) : (
                        <div>
                          <Spinner
                            size="20px"
                            sx={{
                              height: '10px !important',
                              width: '10px !important',
                              marginTop: '10px',
                              color: '#0562fb !important',
                            }}
                          />
                        </div>
                      )}
                    </SoftTypography>
                    {/* )} */}
                  </div>
                </div>
              </SoftBox>
            </Grid>
          )}
        </Grid>
      </SoftBox>

      <SoftBox style={{ marginTop: '10px' }}>
        <Grid container mt={1} direction="row" justifyContent="space-between" alignItems="baseline">
          <Grid item xs={12} md={12} lg={12}>
            <SoftBox style={{ width: '100%' }}>
              <InputLabel sx={inputLabelStyle}>Description</InputLabel>
              <SoftInput
                value={productDescription?.description}
                placeholder="Enter description for the product"
                onChange={(e) => handleProdutDescription(e.target.value, 'description')}
                // readOnly={isGen ? true : false}
                multiline
                rows={5}
              />
            </SoftBox>
          </Grid>
        </Grid>
      </SoftBox>

      <SoftBox style={{ marginTop: '10px' }}>
        <div className="title-heading-products">
          Tax details
          <span className="main-header-icon">
            <Tooltip title=" Select the appropriate product category">
              <InfoOutlinedIcon />
            </Tooltip>
          </span>
        </div>
        <Grid container mt={1} direction="row" justifyContent="space-between" alignItems="baseline">
          <Grid item xs={12} md={4} lg={4}>
            <SoftBox style={{ width: '95%' }}>
              <InputLabel sx={inputLabelStyle}>HSN Code</InputLabel>

              <SoftInput
                size="small"
                className="select-box-category"
                placeholder="Select"
                value={productDescription?.hsnCode}
                // loadOptions={loadMainCategoryOptions}
                isClearable
                onChange={(option) => handleProdutDescription(option?.target?.value, 'hsnCode')}
                menuPortalTarget={document.body}
              />
            </SoftBox>
          </Grid>
          <Grid item xs={12} md={2} lg={2}>
            <SoftBox style={{ width: '95%' }}>
              <InputLabel sx={inputLabelStyle} required>
                GST
              </InputLabel>
              <SoftSelect
                size="small"
                className="select-box-category"
                value={
                  productDescription?.gst !== ''
                    ? { value: productDescription?.gst, label: `${productDescription?.gst}%` }
                    : null
                }
                options={percentageOptions}
                onChange={(option) => handleProdutDescription(option?.value, 'gst')}
                menuPortalTarget={document.body}
              />
            </SoftBox>
          </Grid>
          <Grid item xs={12} md={2} lg={2}>
            <SoftBox style={{ width: '95%' }}>
              <InputLabel sx={inputLabelStyle}>CESS</InputLabel>
              <SoftSelect
                size="small"
                className="select-box-category"
                value={
                  productDescription?.cess !== ''
                    ? { label: productDescription?.cess, label: `${productDescription?.cess}%` }
                    : null
                }
                options={percentageOptionsCess}
                onChange={(option) => handleProdutDescription(option?.value, 'cess')}
                menuPortalTarget={document.body}
              />
            </SoftBox>
          </Grid>

          <Grid item xs={12} md={2} lg={2}>
            <SoftBox style={{ width: '95%' }}>
              <InputLabel sx={inputLabelStyle}>Tax Exempted</InputLabel>
              <input
                type="checkbox"
                id="taxExempted"
                name="scheduleGroup"
                checked={productDescription?.taxExempted}
                onChange={(e) => handleProdutDescription(e.target.checked, 'taxExempted')}
              />
              <label className="dynamic-coupon-label-typo">Exempted</label>
            </SoftBox>
          </Grid>

          <Grid item xs={12} md={2} lg={2}>
            <SoftBox style={{ width: '95%' }}>
              <InputLabel sx={inputLabelStyle}>Restrictions</InputLabel>
              <input
                type="checkbox"
                id="mrpRestrictions"
                name="scheduleGroup"
                checked={productDescription?.mrpRestrictions}
                onChange={(e) => handleProdutDescription(e.target.checked, 'mrpRestrictions')}
              />
              <label className="dynamic-coupon-label-typo">MRP Restrictions</label>
            </SoftBox>
          </Grid>
        </Grid>
      </SoftBox>

      <SoftBox style={{ marginTop: '10px' }}>
        <div className="title-heading-products">
          Combo Validity
          <span className="main-header-icon">
            <Tooltip title=" Select the appropriate product category">
              <InfoOutlinedIcon />
            </Tooltip>
          </span>
        </div>
        <Grid container mt={1} spacing={1} direction="row" justifyContent="flex-start" alignItems="baseline">
          <Grid item xs={2.5} md={2.5} lg={2.5}>
            <SoftBox style={{ width: '100%' }}>
              <InputLabel sx={inputLabelStyle}>Combo Start Date</InputLabel>
              <SoftInput
                size="small"
                type="date"
                value={productDescription?.comboValidityStartDate || ''}
                placeholder="Select start date"
                onChange={(e) => handleProdutDescription(e.target.value, 'comboValidityStartDate')}
              ></SoftInput>
            </SoftBox>
          </Grid>
          <Grid item xs={2.5} md={2.5} lg={2.5}>
            <SoftBox style={{ width: '100%' }}>
              <InputLabel sx={inputLabelStyle}>Combo End Date</InputLabel>
              <SoftInput
                size="small"
                type="date"
                value={productDescription?.comboValidityEndDate || ''}
                placeholder="Select end date"
                onChange={(e) => handleProdutDescription(e.target.value, 'comboValidityEndDate')}
              ></SoftInput>
            </SoftBox>
          </Grid>
          <Grid item xs={2.5} md={2.5} lg={2.5}>
            <SoftBox style={{ width: '100%' }}>
              <InputLabel sx={inputLabelStyle}>Combo Start Time</InputLabel>
              <SoftInput
                size="small"
                type="time"
                value={productDescription?.comboValidityStartTime || ''}
                placeholder="Select start time"
                onChange={(e) => handleProdutDescription(e.target.value, 'comboValidityStartTime')}
              ></SoftInput>
            </SoftBox>
          </Grid>
          <Grid item xs={2.5} md={2.5} lg={2.5}>
            <SoftBox style={{ width: '100%' }}>
              <InputLabel sx={inputLabelStyle}>Combo End Time</InputLabel>
              <SoftInput
                size="small"
                type="time"
                value={productDescription?.comboValidityEndTime || ''}
                placeholder="Select end time"
                onChange={(e) => handleProdutDescription(e.target.value, 'comboValidityEndTime')}
              ></SoftInput>
            </SoftBox>
          </Grid>
          <Grid item xs={2} md={2} lg={2}>
            <SoftBox style={{ width: '100%' }}>
              <InputLabel sx={inputLabelStyle}>Combo Quantity</InputLabel>
              <SoftInput
                size="small"
                value={productDescription?.totalCombos || ''}
                placeholder="Enter total combos"
                onChange={(e) => handleProdutDescription(e.target.value, 'totalCombos')}
              ></SoftInput>
            </SoftBox>
          </Grid>
        </Grid>
      </SoftBox>
    </Card>
  );
};

export default ComboBasicInformation;
