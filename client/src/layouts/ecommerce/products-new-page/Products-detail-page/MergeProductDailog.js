import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, Switch, FormControlLabel } from '@material-ui/core';
import SoftBox from '../../../../components/SoftBox';
import SoftButton from '../../../../components/SoftButton';
import { useNavigate } from 'react-router-dom';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Checkbox,
  InputLabel,
  TextField,
  Typography,
} from '@mui/material';
import SoftTypography from '../../../../components/SoftTypography';
import InfoIcon from '@mui/icons-material/Info';
import { getAllProductsV2New, mergeProductsapi } from '../../../../config/Services';
import { debounce } from 'lodash';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { noImage } from '../../Common/CommonFunction';
import Spinner from '../../../../components/Spinner';
import { MarginOutlined } from '@mui/icons-material';

const MergeProductDialog = ({ open, handleClose, productId }) => {
  const [autocompleteOpen, setAutocompleteOpen] = useState(false);
  const locId = localStorage.getItem('locId');
  const navigate = useNavigate();
  const [mergeProductTitles, setMergeProductTitles] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');
  const [isVariant, setIsVariant] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [checkedProducts, setCheckedProducts] = useState({ 0: false });
  const [checkedVariants, setCheckedVariants] = useState({});
  const [variantValues, setVariantValues] = useState({});
  const [variantSearch, setVariantSearch] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState({});
  const [checkedVariantsState, setCheckedVariantsState] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loader, setLoader] = useState(false);
  const [variantCount, setVariantCount] = useState(0);
  const handleCheckboxChange = (variantIndex) => {
    setCheckedVariants((prevState) => ({
      ...prevState,
      [variantIndex]: !prevState[variantIndex],
    }));
  };
  const handleSingleVariantCheckboxChange = (selectedVariant) => {
    setCheckedVariantsState((prevCheckedVariants) => {
      // Check if the variant is already selected
      const isVariantChecked = prevCheckedVariants?.some(
        (variant) => variant?.variant?.variantId === selectedVariant?.variant?.variantId,
      );

      if (isVariantChecked) {
        // Remove the variant if it is already checked
        return prevCheckedVariants?.filter(
          (variant) => variant?.variant?.variantId !== selectedVariant?.variant?.variantId,
        );
      } else {
        // Add the selected variant to the checked variants state
        return [...prevCheckedVariants, { ...selectedVariant, productID: selectedVariant?.productID }];
      }
    });
  };
  useEffect(() => {
    const selectedVariantCount = Object.values(checkedVariants).filter((value) => value === true).length;
    if (totalCount > 0 && selectedVariantCount === totalCount) {
      setCheckedProducts((prev) => ({ ...prev, 0: true }));
    } else {
      setCheckedProducts((prev) => ({ ...prev, 0: false }));
    }
  }, [checkedVariants, totalCount]);

  const handleMerge = () => {
    const isAllMerge = variantCount;
    setLoader(true);
    // if (mergeProductTitles.length === 0) {
    //   setError('At least one product title is required.');
    //   return;
    // }
    let payload = {
      source: checkedVariantsState?.[0]?.productID
        ? checkedVariantsState?.[0]?.productID
        : selectedProducts?.[0]?.title?.value,
      dest: productId,
      locationId: locId.toLowerCase(),
      allMerge: checkedVariantsState?.length === 0 ? checkedProducts?.[0] || false : false,
      productUpdateModel: {
        productId: productId,
        action: 'merge',
      },
    };

    if (checkedVariantsState?.length > 0) {
      const data = checkedVariantsState?.[0]?.variant?.variantId ? [checkedVariantsState?.[0]?.variant?.variantId] : [];
      if (variantCount === data?.length) {
        payload.allMerge = true;
      }
      payload.variantIds = data;
    } else if (checkedVariants && Object.keys(variantValues).length > 0) {
      const data = Object.values(variantValues);
      payload.variantIds = data;
    }
    mergeProductsapi(payload)
      .then((res) => {
        setLoader(false);
        handleClose();
      })
      .catch(() => {
        setLoader(false);
        handleClose();
      });

    // Perform merge action here
  };

  const handleSwitchChange = (event) => {
    setIsVariant(event.target.checked);
    setMergeProductTitles([]);
    setSelectedProducts([]);
  };

  const [mergeProductTitle, setMergeProductTitle] = useState(null); // Single value state

  const handleAutocompleteChange = (event, newValue) => {
    setMergeProductTitle(newValue);
    setTotalCount(newValue?.variantCount || 0);
    setError('');
    // Fetch and set selected product details based on newValue
    // For now, we'll just set a dummy product
    setSelectedProducts([{ title: newValue, details: 'Product details here' }]);
  };

  // const productOptions = [
  //   { value: 'Product1', label: 'Product 1' },
  //   { value: 'Product2', label: 'Product 2' },
  // ];

  function getVariantWithProductIdByBarcode(data, barcode) {
    const product = data?.find((product) => product?.variants?.some((variant) => variant?.barcodes?.includes(barcode)));

    if (product) {
      const variant = product?.variants?.find((variant) => variant?.barcodes?.includes(barcode));
      return {
        productID: product?.id,
        variant: variant,
      };
    } else {
      return null; // Return null if no matching variant is found
    }
  }
  const handleVariantDetails = (results, query) => {
    setVariantCount(results?.[0]?.variants?.length || 0);
    const filteredVariant = getVariantWithProductIdByBarcode(results, query);
    setSelectedVariant(filteredVariant || {});
    setVariantSearch(true);
  };

  const fetchProducts = async (type, query) => {
    const payload = {
      page: 1,
      names: [],
      brands: [],
      barcode: type === 'barcode' ? [query] : [],
      manufacturers: [],
      query: type === 'query' ? query : '',
      appCategories: {
        categoryLevel1: [],
        categoryLevel2: [],
        categoryLevel3: [],
      },
      productStatus: [],
      preferredVendors: [],
      sortByPrice: 'DEFAULT',
      sortByCreatedAt: 'DESC',
      storeLocationId: locId.toLowerCase(),
      pageSize: '10',
    };

    try {
      const res = await getAllProductsV2New(payload);
      const results = res?.data?.data?.data?.data || [];
      if (type === 'barcode') {
        handleVariantDetails(results, query);
        return;
      }
      setVariantSearch(false);
      setCheckedVariantsState([]);
      const filteredOptions = results?.map((product) => {
        const filteredVariants =
          product?.variants?.map((variant) => ({
            variantId: variant?.variantId,
            barcodes: variant?.barcodes,
            images: variant?.images,
            mrpData: variant?.mrpData,
            weight: variant?.weight || '',
            weightUnit: variant?.weightUnit || '',
          })) || [];

        return {
          value: product?.id,
          label: product?.name,
          variantCount: product?.variants?.length,
          variantsData: filteredVariants,
        };
      });
      setProductOptions(filteredOptions);
    } catch (err) {
      setError('Failed to fetch products. Please try again.');
      console.error(err);
    }
  };

  const debouncedFetchProducts = debounce(fetchProducts, 1000);

  const handleInputChange = (event, value) => {
    const isNumber = !isNaN(+value);
    setInputValue(value);

    if (value.length > 2) {
      if (isNumber) {
        debouncedFetchProducts('barcode', value);
      } else {
        debouncedFetchProducts('query', value);
      }
    } else {
      setProductOptions([]);
    }
  };

  const handleProductCheckboxChange = (index) => {
    const newCheckedProducts = { ...checkedProducts, [index]: !checkedProducts[index] };
    setCheckedProducts(newCheckedProducts);

    const newCheckedVariants = { ...checkedVariants };
    selectedProducts[index]?.title?.variantsData?.forEach((_, variantIndex) => {
      newCheckedVariants[`${index}-${variantIndex}`] = newCheckedProducts[index];
    });
    setCheckedVariants(newCheckedVariants);
  };

  const handleVariantCheckboxChange = (productIndex, variantIndex, value) => {
    const key = `${productIndex}-${variantIndex}`;
    const isChecked = !checkedVariants[key];

    setCheckedVariants({ ...checkedVariants, [key]: isChecked });

    if (isChecked) {
      setVariantValues({ ...variantValues, [key]: value });
    } else {
      const updatedValues = { ...variantValues };
      delete updatedValues[key];
      setVariantValues(updatedValues);
    }
  };

  return (
    <Dialog
      open={open}
      keepMounted
      maxWidth={false}
      PaperProps={{
        style: {
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          width: '85vw',
          height: '90vh',
        },
      }}
      BackdropProps={{
        style: {
          backdropFilter: 'blur(3px)',
        },
      }}
      onClose={handleClose}
    >
      <DialogTitle style={{ borderBottom: '1px solid #e0e0e0', padding: '0px', marginBottom: '0px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
          <SoftTypography style={{ fontSize: '1.2rem', fontWeight: '600' }}>Merge Product</SoftTypography>

          {/* <FormControlLabel
      control={<Switch checked={isVariant} onChange={handleSwitchChange} color="primary" />}
      label={<Typography style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>Merge as Variants</Typography>}
    /> */}
        </div>
      </DialogTitle>
      <SoftTypography
        style={{
          fontSize: '0.75rem',
          fontWeight: '500',
          marginBottom: '20px',
          backgroundColor: '#f0f4f8',
          padding: '10px',
          borderRadius: '5px',
          margin: '5px 5px',
          alignContent: 'center',
        }}
      >
        <InfoIcon style={{ fontSize: 'large', marginRight: '10px' }} />
        The selected variant or product will be merged into the current product.
      </SoftTypography>

      <div style={{ width: '100%', marginBottom: '20px' }}>
        <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.8rem', color: '#344767' }}>
          Search {isVariant ? 'Variants' : 'Products'} to merge
        </InputLabel>
        <Autocomplete
          value={mergeProductTitle}
          size="small"
          onChange={(event, value) => {
            handleAutocompleteChange(event, value);
            setAutocompleteOpen(false); // Close the dropdown after selection
          }}
          onInputChange={(event, value) => {
            handleInputChange(event, value);
            if (value && !/\d/.test(value) && productOptions.length > 0) {
              setAutocompleteOpen(true); // Open dropdown only if input is valid and options are available
            } else {
              setAutocompleteOpen(false); // Close dropdown if input is a number or no options
            }
          }}
          options={productOptions}
          getOptionLabel={(option) => option.label || ''}
          filterOptions={(x) => (/\d/.test(mergeProductTitle) ? [] : x)} // Disable options if input contains numbers
          open={autocompleteOpen}
          onClose={() => setAutocompleteOpen(false)}
          renderInput={(params) => (
            <TextField
              size="small"
              {...params}
              placeholder={`Enter ${isVariant ? 'variant' : 'product'} title, e.g. Sugar`}
              fullWidth
              error={!!error}
              helperText={error}
            />
          )}
        />
      </div>
      <div
        style={{
          textAlign: 'center',
          marginBottom: '20px',
          padding: '10px',
          border: '1px solid #e0e0e0',
          borderRadius: '4px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          height: '300px',
          overflow: 'scroll',
        }}
      >
        {variantSearch ? (
          <>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: '10px',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                backgroundColor: '#f9f9f9',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                cursor: 'pointer',
              }}
            >
              {/* Checkbox */}
              <div style={{ paddingInline: '10px', flex: 1 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name={`variant-${selectedVariant?.variant?.variantId}`}
                      checked={checkedVariantsState.some(
                        (variant) => variant?.variant?.variantId === selectedVariant?.variant?.variantId, // Ensure the checked state reflects the current variant
                      )}
                      onChange={() => handleSingleVariantCheckboxChange(selectedVariant)} // Pass only selectedVariant
                    />
                  }
                  label=""
                />
              </div>

              {/* Image */}
              <div style={{ paddingInline: '10px', flex: 1 }}>
                <img
                  src={selectedVariant?.variant?.images?.front || noImage}
                  alt=""
                  style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px' }}
                />
              </div>

              {/* Barcode */}
              <div style={{ paddingInline: '10px', flex: 1 }}>
                <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>Barcode</InputLabel>
                <span style={{ fontSize: '14px', fontWeight: '500' }}>
                  {selectedVariant?.variant?.barcodes?.[0] || 'No barcode available'}
                </span>
              </div>

              {/* MRP */}
              <div style={{ paddingInline: '10px', flex: 1 }}>
                <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>Mrp</InputLabel>
                <span style={{ fontSize: '14px', fontWeight: '500' }}>
                  {selectedVariant?.variant?.mrpData?.[0]?.currencySymbol || ''}
                  {selectedVariant?.variant?.mrpData?.[0]?.mrp || 'N/A'}
                </span>
              </div>

              {/* UOM */}
              <div style={{ paddingInline: '10px', flex: 1 }}>
                <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>UOM</InputLabel>
                <span style={{ fontSize: '14px', fontWeight: '500' }}>
                  {selectedVariant?.variant?.weight} {selectedVariant?.variant?.weightUnit}
                </span>
              </div>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {selectedProducts?.map((product, index) => (
              <Accordion
                defaultExpanded
                key={index}
                style={{
                  flex: '1 1 100%',
                  background: 'linear-gradient(135deg, #f0f0f0 0%, #ffffff 100%)',
                  borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                }}
              >
                <AccordionSummary
                  expandIcon={<KeyboardArrowDownIcon />}
                  aria-controls={`panel${index}-content`}
                  id={`panel${index}-header`}
                >
                  <div
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}
                  >
                    <SoftTypography style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                      <Checkbox
                        checked={checkedProducts[index] || false}
                        onChange={() => handleProductCheckboxChange(index)}
                      />{' '}
                      {product?.title?.label}
                    </SoftTypography>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <SoftTypography variant="body2">
                        Variant Count: {product?.title?.variantCount || 0}
                      </SoftTypography>
                    </div>
                  </div>
                </AccordionSummary>
                <AccordionDetails style={{ flexDirection: 'column' }}>
                  {product?.title?.variantsData?.map((variant, variantIndex) => (
                    <div
                      key={variantIndex}
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginBottom: '10px',
                        padding: '10px',
                        border: '1px solid #ddd',
                        borderRadius: '5px',
                        backgroundColor: '#f9f9f9',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{ paddingInline: '10px', flex: 1 }}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              name={`variant-${variantIndex}`}
                              checked={checkedVariants[`${index}-${variantIndex}`] || false}
                              onChange={() =>
                                handleVariantCheckboxChange(index, variantIndex, variant?.variantId || '')
                              }
                            />
                          }
                          label=""
                        />
                      </div>
                      <div style={{ paddingInline: '10px', flex: 1 }}>
                        <img
                          src={variant.images?.front || noImage}
                          alt=""
                          style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px' }}
                        />
                      </div>
                      <div style={{ paddingInline: '10px', flex: 1 }}>
                        <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                          Barcode
                        </InputLabel>
                        <span style={{ fontSize: '14px', fontWeight: '500' }}>{variant.barcodes?.[0] || ''}</span>
                      </div>
                      <div style={{ paddingInline: '10px', flex: 1 }}>
                        <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>Mrp</InputLabel>
                        <span style={{ fontSize: '14px', fontWeight: '500' }}>
                          {variant.mrpData?.[0]?.currencySymbol}
                          {variant.mrpData?.[0]?.mrp}
                        </span>
                      </div>
                      <div style={{ paddingInline: '10px', flex: 1 }}>
                        <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>UOM</InputLabel>
                        <span style={{ fontSize: '14px', fontWeight: '500' }}>
                          {variant.weight} {variant.weightUnit}
                        </span>
                      </div>
                    </div>
                  ))}
                </AccordionDetails>
              </Accordion>
            ))}
          </div>
        )}
      </div>

      <SoftBox display="flex" justifyContent="flex-end" style={{ paddingTop: '10px' }}>
        <SoftButton className="vendor-second-btn" onClick={handleClose} style={{ marginRight: '10px' }}>
          Cancel
        </SoftButton>
        {loader ? (
          <div style={{ margin: '0px 15px', display: 'flex' }}>
            <Spinner size={'1.2rem'} />
          </div>
        ) : (
          <SoftButton color="info" className="vendor-add-btn" onClick={handleMerge}>
            Merge
          </SoftButton>
        )}
      </SoftBox>
    </Dialog>
  );
};

export default MergeProductDialog;
