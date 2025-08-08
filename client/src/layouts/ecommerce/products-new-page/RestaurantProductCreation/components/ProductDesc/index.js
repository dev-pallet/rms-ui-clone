import { Autocomplete, Card, Checkbox, createFilterOptions, Grid, InputLabel, TextField, Tooltip } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import SoftBox from '../../../../../../components/SoftBox';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SoftButton from '../../../../../../components/SoftButton';
import { getAllLevel1Category, getAllMainCategory, getGlobalProducts } from '../../../../../../config/Services';
import { isSmallScreen } from '../../../../Common/CommonFunction';
import './ProductDesc.css';
import SoftAsyncPaginate from '../../../../../../components/SoftSelect/SoftAsyncPaginate';
import SoftSelect from '../../../../../../components/SoftSelect';
import TimerIcon from '@mui/icons-material/Timer';
import ComingSoonAlert from '../../../ComingSoonAlert';
import SoftInput from '../../../../../../components/SoftInput';
import { useSnackbar } from '../../../../../../hooks/SnackbarProvider';

const inputLabelStyle = { fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' };

const ProductDescription = ({ productDescription, setProductDescription }) => {
  const [tempTitle, setTempTitle] = useState('');
  const [optArray, setOptArray] = useState([]);
  const [optDataArray, setOptDataArray] = useState([]);
  const isMobileDevice = isSmallScreen();
  const [openComingSoon, setOpenComingSoon] = useState(false);
  const locId = localStorage.getItem('locId');
  const orgId = localStorage.getItem('orgId');
  const filter = createFilterOptions();
  const showSnackbar = useSnackbar();
  const [requiredCheckboxes, setRequiredCheckboxes] = useState({
    rawMaterial: false,
  });
  const [subMenuCategoryArray, setSubMenuCategoryArray] = useState([]);

  const handleOpenComingSoon = () => {
    setOpenComingSoon(true);
  };

  const handleCloseComingSoon = () => {
    setOpenComingSoon(false);
  };

  const errMsg = optArray?.some((item) => item.label === productDescription?.productTitle);

  useEffect(() => {
    if (tempTitle?.length > 2) {
      const payload = {
        page: 1,
        pageSize: 10,
        // names: [formData?.productTitle],
        query: tempTitle,
        storeLocations: [locId],
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

  const productTypeOptions = [
    {
      label: 'Raw Material',
      value: 'RAW',
    },
    {
      label: 'Prep Product',
      value: 'PREP',
    },
    {
      label: 'Finished Product',
      value: 'MENU',
    },
    {
      label: 'Add On',
      value: 'ADD_ON',
    },
    {
      label: 'Consumables',
      value: 'CONSUMABLE',
    },
  ];

  const handleProdutDescription = (value, fieldName) => {
    setProductDescription((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const productTypeCheckboxHandler = (type, checked, value) => {
    // Define product type rules
    const rules = {
      CONSUMABLE: { exclusive: true, message: 'Consumable products cannot be combined with other product types.' },
      RAW: { compatibleWith: ['ADD_ON'], message: 'Raw Material can only be combined with Add-on products.' },
    };

    // Current state (create copies to avoid direct mutation)
    const currentTypes = [...(productDescription?.productTypes || [])];
    let updatedTypes = [...currentTypes];
    let updatedCheckboxes = { ...requiredCheckboxes };

    // Handle checkbox toggling
    if (checked) {
      // Adding a product type
      const typeRule = rules[type];

      if (typeRule?.exclusive) {
        // Handle exclusive types (like CONSUMABLE)
        updatedTypes = [type];
        updatedCheckboxes.rawMaterial = false;
        showSnackbar(typeRule?.message, 'warning');
      } else if (type === 'RAW') {
        // Handle RAW material case
        if (currentTypes?.includes('CONSUMABLE')) {
          showSnackbar('Cannot select Raw Material while Consumable is selected.', 'error');
          return;
        }

        // Keep only compatible types
        updatedTypes = currentTypes?.filter((item) => typeRule?.compatibleWith?.includes(item));
        updatedTypes.push('RAW');
        updatedCheckboxes.rawMaterial = true;
        showSnackbar(typeRule?.message, 'warning');
      } else {
        // Handle other types
        if (currentTypes?.includes('CONSUMABLE')) {
          showSnackbar('Cannot select other product types while Consumable is selected.', 'error');
          return;
        }

        // Check for RAW compatibility
        if (currentTypes?.includes('RAW') && !rules?.RAW?.compatibleWith?.includes(type)) {
          showSnackbar(rules?.RAW?.message, 'error');
          return;
        }

        // Add the type if not already present
        if (!updatedTypes?.includes(value)) {
          updatedTypes.push(value);
        }

        // Ensure RAW checkbox is unchecked for incompatible types
        if (type !== 'ADD_ON' && type !== 'RAW') {
          updatedCheckboxes.rawMaterial = false;
          updatedTypes = updatedTypes?.filter((item) => item !== 'RAW');
        }
      }
    } else {
      // Removing a product type - simply filter it out
      updatedTypes = updatedTypes?.filter((item) => item !== value);

      // Update checkboxes if needed
      if (type === 'RAW') {
        updatedCheckboxes.rawMaterial = false;
      }
    }

    // Apply all updates
    setRequiredCheckboxes(updatedCheckboxes);
    setProductDescription((prev) => ({
      ...prev,
      productTypes: updatedTypes,
    }));
  };

  const storageType = useMemo(
    () => [
      { label: 'Dry storage', value: 'Dry storage' },
      { label: 'Refrigerated storage', value: 'Refrigerated storage' },
      { label: 'Frozen storage', value: 'Frozen storage' },
    ],
    [],
  );

  const rawMaterialGroupingOptions = useMemo(
    () => [
      { label: 'Rice', value: 'Rice' },
      { label: 'Lentils', value: 'Lentils' },
      { label: 'Salt', value: 'Salt' },
      { label: 'Masala & Spices', value: 'Masala & Spices' },
      { label: 'Vegetables', value: 'Vegetables' },
      { label: 'Salt & Sugar', value: 'Salt & Sugar' },
      { label: 'Oil & Ghee', value: 'Oil & Ghee' },
      { label: 'Dairy', value: 'Dairy' },
      { label: 'Flours', value: 'Flours' },
      { label: 'Baking Items', value: 'Baking Items' },
      { label: 'Soya', value: 'Soya' },
      { label: 'Dry Fruits', value: 'Dry Fruits' },
      { label: 'Fruits', value: 'Fruits' },
    ],
    [],
  );

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
      pageSize: 50, // Adjust this as needed
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
        hasMore: results?.length === 50, // If the number of results is less than pageSize, stop pagination
        additional: {
          page: page + 1, // Increment the page for the next request
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

  const uomArray = useMemo(
    () => [
      { label: 'gram', value: 'gram' },
      { label: 'kilogram', value: 'kilogram' },
      // { label: 'milliliter', value: 'milliliter' },
      // { label: 'liter', value: 'liter' },
      { label: 'piece', value: 'piece' },
      // { label: 'ounce', value: 'ounce' },
      // { label: 'pound', value: 'pound' },
      // { label: 'unit', value: 'unit' },
      // { label: 'kilocalorie', value: 'kilocalorie' },
    ],
    [],
  );

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
          <Grid item xs={12} md={10} lg={10}>
            <div style={{ width: '98%' }}>
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
          <Grid item xs={12} md={2} lg={2} mt={isMobileDevice ? '10px' : '0px'}>
            <div className="common-display-flex">
              <SoftButton
                className="smallBtnStyle"
                size="small"
                variant="outlined"
                color="info"
                style={{ width: '150px' }}
                // onClick={handleLookUp}
                isDisabled={true}
              >
                Look up
              </SoftButton>{' '}
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
          Product Type{' '}
          <span className="main-header-icon">
            <Tooltip title=" Select product type">
              <InfoOutlinedIcon />
            </Tooltip>
          </span>
        </div>
      </SoftBox>

      {/* <SoftBox className="stack-row-center-between width-100"> */}
      <div className="grid grid-5 ">
        {productTypeOptions?.map((item) => (
          <div className="stack-row-center-start width-100" key={item?.value}>
            <input
              type="checkbox"
              checked={productDescription?.productTypes?.includes(item?.value)}
              onChange={(e) => productTypeCheckboxHandler(item?.value, e?.target?.checked, item?.value)}
            />
            <label className="dynamic-coupon-label-typo">{item?.label}</label>
          </div>
        ))}
      </div>
      {/* </SoftBox> */}

      {requiredCheckboxes?.rawMaterial && (
        <Grid container mt={1} direction="row" alignItems="baseline">
          <Grid item xs={12} md={4} lg={4}>
            <SoftBox style={{ width: '95%' }}>
              <InputLabel sx={inputLabelStyle} required>
                Raw Material grouping
              </InputLabel>

              <SoftAsyncPaginate
                size="small"
                className="select-box-category"
                placeholder="Select category..."
                value={productDescription?.rawMaterialGrouping}
                options={rawMaterialGroupingOptions}
                additional={{
                  page: 1,
                }}
                isClearable
                onChange={(option) => {
                  handleProdutDescription(option, 'rawMaterialGrouping');
                }}
                menuPortalTarget={document.body}
              />
            </SoftBox>
          </Grid>
          <Grid item xs={12} md={4} lg={4}>
            <SoftBox style={{ width: '95%' }}>
              <InputLabel sx={inputLabelStyle} required>
                Storage Type
              </InputLabel>
              <SoftSelect
                size="small"
                className="select-box-category"
                value={productDescription?.storageType}
                options={storageType}
                onChange={(option) => {
                  handleProdutDescription(option, 'storageType');
                }}
                menuPortalTarget={document.body}
              />
            </SoftBox>
          </Grid>
        </Grid>
      )}

      <Grid container mt={1} direction="row" justifyContent="space-between" alignItems="baseline">
        <Grid item xs={12} md={6} lg={6}>
          <SoftBox style={{ width: '95%' }}>
            <div className="stack-row-center-start width-100">
              <input
                type="checkbox"
                id="eligibleForSale"
                name="scheduleGroup"
                checked={productDescription?.eligibleForSale}
                onChange={(e) => handleProdutDescription(e.target.checked, 'eligibleForSale')}
              />
              <label className="dynamic-coupon-label-typo">
                Eligible for sale (to be added in the restaurant menu)
              </label>
            </div>
          </SoftBox>
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <SoftBox style={{ width: '95%' }}>
            <div className="stack-row-center-start width-100">
              <input
                type="checkbox"
                id="trackInventory"
                name="scheduleGroup"
                checked={productDescription?.trackInventory}
                onChange={(e) => handleProdutDescription(e.target.checked, 'trackInventory')}
              />
              <label className="dynamic-coupon-label-typo">Track Inventory</label>
            </div>
          </SoftBox>
        </Grid>
      </Grid>

      <Grid container mt={1} direction="row" justifyContent="space-between" alignItems="baseline">
        <Grid item xs={12} md={12} lg={12}>
          <SoftBox style={{ width: '100%' }}>
            <div className="stack-row-center-start width-100">
              <div className="stack-row-center-start">
                <TimerIcon />
                <label className="dynamic-coupon-label-typo">Item Availability</label>
              </div>
              <InputLabel sx={inputLabelStyle}>Start Time</InputLabel>
              <div style={{ width: '25%' }}>
                <SoftInput
                  type="time"
                  placeholder="End Time"
                  size="small"
                  className="select-box-category"
                  value={productDescription?.itemAvailabilityStart || ''}
                  onChange={(option) => handleProdutDescription(option.target.value, 'itemAvailabilityStart')}
                />
              </div>
              <InputLabel sx={inputLabelStyle}>End Time</InputLabel>
              <div style={{ width: '25%' }}>
                <SoftInput
                  type="time"
                  size="small"
                  className="select-box-category"
                  placeholder="End Time"
                  value={productDescription?.itemAvailabilityEnd || ''}
                  onChange={(option) => handleProdutDescription(option.target.value, 'itemAvailabilityEnd')}
                />
              </div>
            </div>
          </SoftBox>
        </Grid>
      </Grid>

      {productDescription?.eligibleForSale && (
        <SoftBox style={{ marginTop: '10px' }}>
          <div className="title-heading-products">
            Menu Category
            <span className="main-header-icon">
              <Tooltip title=" Select the appropriate product category">
                <InfoOutlinedIcon />
              </Tooltip>
            </span>
          </div>
          <Grid container mt={1} direction="row" justifyContent="space-between" alignItems="baseline">
            <Grid item xs={12} md={4} lg={4}>
              <SoftBox style={{ width: '95%' }}>
                <InputLabel sx={inputLabelStyle} required>
                  Main Menu
                </InputLabel>

                <SoftAsyncPaginate
                  size="small"
                  className="select-box-category"
                  placeholder="Select category..."
                  value={productDescription?.mainMenuCategory}
                  loadOptions={loadMainCategoryOptions}
                  additional={{
                    page: 1,
                  }}
                  isClearable
                  onChange={(option) => {
                    handleProdutDescription(option, 'mainMenuCategory');
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
                  value={productDescription?.subMenuCategory}
                  options={subMenuCategoryArray}
                  onChange={(option) => handleProdutDescription(option, 'subMenuCategory')}
                  menuPortalTarget={document.body}
                />
              </SoftBox>
            </Grid>
            <Grid item xs={12} md={4} lg={4}>
              <SoftBox style={{ width: '95%' }}></SoftBox>
            </Grid>
          </Grid>
        </SoftBox>
      )}

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

        <SoftBox style={{ marginTop: '10px' }}>
          <div className="common-display-flex">
            <div className="title-heading-products">Description</div>
            <div className="common-display-flex">
              <SoftButton
                className="smallBtnStyle"
                size="small"
                variant="outlined"
                color="info"
                style={{ width: '150px' }}
                onClick={handleOpenComingSoon}
              >
                Try Pallet IQ
              </SoftButton>{' '}
              <ComingSoonAlert open={openComingSoon} handleClose={handleCloseComingSoon} />
              <span className="main-header-icon">
                <Tooltip title="Generate product descriptions using AI" placement="right">
                  <InfoOutlinedIcon />
                </Tooltip>
              </span>
            </div>
          </div>
          <div style={{ marginTop: '10px' }}>
            <SoftInput
              value={productDescription?.description}
              placeholder="Enter description for the product"
              onChange={(e) => handleProdutDescription(e.target.value, 'description')}
              // readOnly={isGen ? true : false}
              multiline
              rows={5}
            />
          </div>
        </SoftBox>

        <SoftBox style={{ marginTop: '10px' }}>
          <div className="title-heading-products">
            Selling Type
            <span className="main-header-icon">
              <Tooltip title="Select the appropriate product category">
                <InfoOutlinedIcon />
              </Tooltip>
            </span>
          </div>

          <Grid container mt={1} direction="row" justifyContent="space-between" alignItems="center">
            <Grid item xs={12} md={4} lg={4}>
              <SoftBox style={{ width: '95%' }}>
                {/* <InputLabel sx={inputLabelStyle}>Weighing Scale</InputLabel> */}
                <input
                  type="checkbox"
                  id="needsWeighingScaleIntegration"
                  name="scheduleGroup"
                  checked={productDescription?.needsWeighingScaleIntegration}
                  onChange={(e) => handleProdutDescription(e.target.checked, 'needsWeighingScaleIntegration')}
                />
                <label className="dynamic-coupon-label-typo">Needs Weighing scale integration</label>
              </SoftBox>
            </Grid>

            {productDescription?.needsWeighingScaleIntegration && (
              <>
                <Grid item xs={12} md={4} lg={4}>
                  <SoftBox style={{ width: '95%' }}>
                    <InputLabel sx={inputLabelStyle}>Selling UOM</InputLabel>
                    <SoftSelect
                      size="small"
                      className="select-box-category"
                      value={productDescription?.sellingUom}
                      options={uomArray}
                      onChange={(option) => handleProdutDescription(option, 'sellingUom')}
                      menuPortalTarget={document.body}
                    />
                  </SoftBox>
                </Grid>
                <Grid item xs={12} md={4} lg={4}></Grid>
              </>
            )}
          </Grid>
        </SoftBox>
      </SoftBox>
    </Card>
  );
};

export default ProductDescription;
