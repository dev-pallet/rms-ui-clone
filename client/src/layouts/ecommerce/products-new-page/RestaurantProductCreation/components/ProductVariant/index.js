import { Card, Grid, InputLabel, Tooltip, Typography } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import SoftBox from '../../../../../../components/SoftBox';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import './ProductVariant.css';
import SoftInput from '../../../../../../components/SoftInput';
import SoftSelect from '../../../../../../components/SoftSelect';
import CloseIcon from '@mui/icons-material/Close';
import SoftButton from '../../../../../../components/SoftButton';
import ProductVarientImagesUpload from '../../../../product/new-product-screen/components/create-product/components/product-variant/varientImages';
import {
  generateBarcode,
  getAllPrepStations,
  getGlobalProducts,
  productCreationCalculation,
} from '../../../../../../config/Services';
import SoftAsyncPaginate from '../../../../../../components/SoftSelect/SoftAsyncPaginate';
import { useDebounce } from 'usehooks-ts';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import Spinner from '../../../../../../components/Spinner';
import SoftTypography from '../../../../../../components/SoftTypography';
import { useSnackbar } from '../../../../../../hooks/SnackbarProvider';

const inputLabelStyle = { fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' };

const ProductRestaurantVariant = ({ productDescription, variantData, setVariantData, id }) => {
  const [currIndex, setCurrIndex] = useState('');
  const [openImageModal, setOpenImageModal] = useState(false);
  const locId = localStorage.getItem('locId');
  const [salesPricesChange, setSalesPriceChange] = useState({
    price: '',
    mainIndex: 0,
  });
  const debouncedSalesPriceChange = useDebounce(salesPricesChange?.price, 500);
  const [startCalculateMargin, setStartCalculateMargin] = useState(false);
  const [estimatedFoodCostPerPortion, setEstimatedFoodCostPerPortion] = useState([]);
  const showSnackBar = useSnackbar();

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

  const uomArray = useMemo(
    () => [
      { label: 'gram', value: 'gram' },
      { label: 'kilogram', value: 'kilogram' },
      { label: 'milliliter', value: 'milliliter' },
      { label: 'liter', value: 'liter' },
      { label: 'piece', value: 'piece' },
      { label: 'ounce', value: 'ounce' },
      { label: 'pound', value: 'pound' },
      { label: 'unit', value: 'unit' },
      { label: 'kilocalorie', value: 'kilocalorie' },
      { label: 'Small', value: 'Small' },
      { label: 'Medium', value: 'Medium' },
      { label: 'Large', value: 'Large' },
      { label: 'Extra Large', value: 'Extra Large' },
      { label: 'Regular', value: 'Regualar' },
      { label: 'Half', value: 'Half' },
      { label: 'Full', value: 'Full' },
      { label: 'Quarter', value: 'Quarter' },
    ],
    [],
  );

  const taxStatus = useMemo(
    () => [
      { label: 'TAXABLE', value: 'TAXABLE' },
      { label: 'EXEMPT', value: 'EXEMPTED' },
    ],
    [],
  );

  const handleVariantDataChange = (id, fieldName, value) => {
    setVariantData((prevState) =>
      prevState?.map((variant) => {
        if (variant?.id === id) {
          let updatedValue;

          if (fieldName === 'barcodeNeed') {
            updatedValue = value === 'true' || value === true; // Ensures boolean value
          } else {
            updatedValue = value;
          }

          return {
            ...variant,
            [fieldName]: updatedValue,
          };
        }
        return variant;
      }),
    );
  };
  const [generateBarcodeLoader, setGenerateBarcodeLoader] = useState(false);
  const handleGenerateBarCode = async (index, id, fieldName) => {
    try {
      setGenerateBarcodeLoader(true);
      const respone = await generateBarcode();
      if (respone?.data?.data?.es > 0 || respone?.data?.status === 'ERROR' || respone?.data?.status === 'error') {
        showSnackBar(respone?.data?.message || respone?.data?.data?.message, 'error');
        return;
      }
      const barcode = respone?.data?.data?.barcode || '';
      await handleVariantDataChange(id, fieldName, barcode);
      setGenerateBarcodeLoader(false);
    } catch (error) {
      showSnackBar(error?.response?.data?.message || error?.message, 'error');
      setGenerateBarcodeLoader(false);
    }
  };

  const handleRecipeChange = (variantId, recipeId, fieldName, value, type, foodCost, addToCost, mainindex, index) => {
    if (fieldName === 'addToFoodCost' || fieldName === 'targetCost') {
      calculatingEstimatedFoodCost(foodCost, addToCost, mainindex, index);
    }
    if (type === 'addOn') {
      setVariantData((prevState) =>
        prevState?.map((variant) => {
          if (variant?.id === variantId) {
            return {
              ...variant,
              addOnData: variant?.addOnData?.map((recipe) =>
                recipe.id === recipeId
                  ? {
                      ...recipe,
                      [fieldName]: value,
                    }
                  : recipe,
              ),
            };
          }
          return variant;
        }),
      );
    } else {
      setVariantData((prevState) =>
        prevState?.map((variant) => {
          if (variant?.id === variantId) {
            return {
              ...variant,
              recipeArr: variant?.recipeArr?.map((recipe) =>
                recipe.id === recipeId
                  ? {
                      ...recipe,
                      [fieldName]: value,
                    }
                  : recipe,
              ),
            };
          }
          return variant;
        }),
      );
    }
  };

  const handleAddMoreRecipe = (variantId, type) => {
    if (type === 'recipe') {
      setStartCalculateMargin(true);
      setVariantData((prevState) =>
        prevState?.map((variant) =>
          variant?.id === variantId
            ? {
                ...variant,
                recipeArr: [
                  ...variant?.recipeArr,
                  {
                    id: variant?.recipeArr?.length + 1,
                    recipeTitle: '',
                    uom: {},
                    specification: '',
                    targetCost: '',
                    addToFoodCost: null,
                  },
                ],
              }
            : variant,
        ),
      );
    } else if (type === 'addOn') {
      setVariantData((prevState) =>
        prevState?.map((variant) =>
          variant?.id === variantId
            ? {
                ...variant,
                addOnData: [
                  ...variant?.addOnData,
                  {
                    id: variant?.addOnData?.length + 1,
                    title: '',
                    uom: {},
                    specification: '',
                  },
                ],
              }
            : variant,
        ),
      );
    }
  };

  const handleCancelRecipe = (variantId, recipeId, type) => {
    if (type === 'recipe') {
      setVariantData((prevState) =>
        prevState?.map((variant) =>
          variant?.id === variantId
            ? {
                ...variant,
                recipeArr: variant.recipeArr.filter((recipe) => recipe.id !== recipeId),
              }
            : variant,
        ),
      );
    } else if (type === 'addOn') {
      setVariantData((prevState) =>
        prevState?.map((variant) =>
          variant?.id === variantId
            ? {
                ...variant,
                addOnData: variant?.addOnData?.filter((recipe) => recipe?.id !== recipeId),
              }
            : variant,
        ),
      );
    }
  };

  const handleAddMoreVariants = () => {
    const newRow = [
      ...variantData,
      {
        id: variantData?.length + 1,
        variantName: '',
        shortCode: '',
        uom: {},
        specification: '',
        prepTime: '',
        calories: '',
        taxStatus: '',
        barcodeNeed: false,
        barcode: '',
        sendToKds: false,
        prepStation: {},
        addRecipe: false,
        estimatedFoodCostPerPortion: '',
        recipeArr: [
          {
            id: 1,
            recipeTitle: '',
            uom: {},
            specification: '',
            targetCost: '',
            addToFoodCost: null,
          },
        ],
        cookingInstruction: [
          {
            id: 1,
            instruction: '',
          },
        ],
        addOn: false,
        addOnData: [
          {
            id: 1,
            title: '',
            uom: {},
            specification: '',
          },
        ],
        salesChannels: [],
        imageList: [],
      },
    ];
    setVariantData(newRow);
  };

  const handleCancelVariant = (index) => {
    const updatedVariantsArr = [...variantData?.slice(0, index), ...variantData?.slice(index + 1)];
    setVariantData(updatedVariantsArr);
  };

  const handleSalesChannelChange = (variantId, channelId, field, value, isChecked, mainIndex) => {
    if (!channelId) {
      return;
    }

    if (field === 'salePrice') {
      setSalesPriceChange({
        price: value,
        mainIndex: mainIndex,
      });
    }

    setVariantData((prevData) =>
      prevData?.map((variant) => {
        if (variant?.id === variantId) {
          let updatedSalesChannels = Array?.isArray(variant?.salesChannels) ? [...variant?.salesChannels] : [];

          const existingChannelIndex = updatedSalesChannels?.findIndex((ch) => ch?.id === channelId);

          if (isChecked) {
            if (existingChannelIndex !== -1) {
              const updatedChannel = {
                ...updatedSalesChannels[existingChannelIndex],
                [field]: value,
              };

              updatedSalesChannels[existingChannelIndex] = updatedChannel;
            } else {
              updatedSalesChannels.push({
                id: channelId,
                type: salesChannelsOptions?.find((opt) => opt?.id === channelId)?.label || '',
                salePrice: '',
                consumable: '',
                margin: '',
                profit: '',
                [field]: value,
              });
            }
          } else {
            updatedSalesChannels = updatedSalesChannels?.filter((ch) => ch?.id !== channelId);
          }

          return { ...variant, salesChannels: updatedSalesChannels };
        }
        return variant;
      }),
    );
  };

  const calcultateProfitMargin = (mainIndex) => {
    const totalFoodCost = estimatedFoodCostPerPortion[mainIndex]?.total;
    const payload = {
      totalFoodCost: totalFoodCost || 0,
      channels: variantData?.[mainIndex]?.salesChannels?.map((item) => ({
        uuid: item?.type,
        name: item?.id,
        salePrice: item?.salePrice || 0,
        consumableCost: item?.consumableCost || 0,
      })),
    };
    productCreationCalculation(payload)
      .then((res) => {
        // set
        if (res?.data?.data?.es > 0 || res?.data?.status === 'ERROR' || res?.data?.status === 'error') {
          return;
        }
        const existingVairant = [...variantData]?.[mainIndex];

        existingVairant.salesChannels = existingVairant?.salesChannels?.map((item) => {
          const resSalesChannel = res?.data?.data?.data?.find((resItem) => {
            return resItem?.name === item?.id;
          });
          if (resSalesChannel) {
            const newItem = {
              ...item,
              margin: resSalesChannel?.margin,
              profit: resSalesChannel?.profit,
            };
            return newItem;
          } else {
            return item;
          }
        });

        setVariantData((prev) => {
          return prev?.map((item) => {
            if (item?.id === existingVairant?.id) {
              return existingVairant;
            } else {
              return item;
            }
          });
        });
      })
      .catch((err) => {
        showSnackBar('Error while calculating profits and margin', 'error');
      });
  };

  useEffect(() => {
    if (debouncedSalesPriceChange) {
      calcultateProfitMargin(salesPricesChange?.mainIndex);
    }
  }, [debouncedSalesPriceChange]);

  const handleAddPhoto = (index) => {
    setOpenImageModal(true);
    setCurrIndex(index);
  };

  const handleCloseImageModal = () => {
    setOpenImageModal(false);
  };

  const fetchAllGlobalProductsThroughType = (type) => {
    const loadProductsOptions = async (searchQuery, loadedOptions, additional, mainCategoryId) => {
      const page = additional.page || 1;

      const payload = {
        page: 1,
        pageSize: 10,
        // names: [formData?.productTitle],
        productTypes: type,
        query: searchQuery,
        storeLocations: [locId],
        sortByCreatedAt: 'DESC',
      };

      try {
        const response = await getGlobalProducts(payload);
        const results = response?.data?.data?.data?.data || [];

        const flatVariantData = results.flatMap((product) =>
          product?.variants?.map((variant) => ({
            label: `${product?.name} ${variant?.name}`,
            value: variant?.variantId,
            productId: product?.productId,
            productData: product,
            other: variant,
          })),
        );

        return {
          options: flatVariantData,
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

    return loadProductsOptions;
  };

  const fetchAllPrepStations = () => {
    const loadProductsOptions = async (searchQuery, loadedOptions, additional) => {
      const page = additional.page || 1;

      const payload = {
        page: page,
        pageSize: 10,
        query: '',
        storeLocationId: [locId],
        sortByUpdatedAt: 'DESC',
      };

      try {
        const response = await getAllPrepStations(payload);
        const results = response?.data?.data?.data?.data || [];

        const flatVariantData = results?.map((product) => ({
          label: product?.displayName,
          value: product?.id,
          shortCode: product?.shortCode,
          autoCloseThreshold: product?.autoCloseThreshold,
          maxOrderCapacity: product?.maxOrderCapacity,
          description: product?.description,
        }));

        return {
          options: flatVariantData,
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

    return loadProductsOptions;
  };

  const calculatingEstimatedFoodCost = (foodCost, addToCost, mainIndex, index) => {
    const updatedEstimatedFoodCostPerPortion = [...estimatedFoodCostPerPortion]; // Create a copy of the state
    const existingCostArray = updatedEstimatedFoodCostPerPortion[mainIndex] || {
      recipeArr: [],
      total: 0,
    };
    if (addToCost) {
      existingCostArray.recipeArr[index] = foodCost;
    } else if (existingCostArray.recipeArr?.[index] > 0) {
      existingCostArray.recipeArr[index] = 0;
    }
    existingCostArray.total = existingCostArray?.recipeArr?.reduce((acc, val) => acc + parseFloat(val), 0);
    updatedEstimatedFoodCostPerPortion[mainIndex] = existingCostArray; // Update the specific index
    setEstimatedFoodCostPerPortion(updatedEstimatedFoodCostPerPortion); // Update the state with the new array
  };

  useEffect(() => {
    if (id && variantData?.length > 0 && !startCalculateMargin) {
      const updatedEstimatedFoodCostPerPortion = variantData?.map((item) => {
        const total = item?.recipeArr?.reduce((acc, val) => acc + parseFloat(val?.targetCost || 0), 0);
        return {
          recipeArr: [total],
          total: total,
        };
      }, 0);
      setEstimatedFoodCostPerPortion(updatedEstimatedFoodCostPerPortion);
    }
  }, [id, variantData]);

  const handleAddMoreInstructions = (itemId, key) => {
    setVariantData((prevData) =>
      prevData?.map((item) =>
        item?.id === itemId
          ? {
              ...item,
              [key]: [...(item[key] || []), { id: Date.now().toString(), instruction: '' }],
            }
          : item,
      ),
    );
  };

  // Remove an instruction by its id
  const handleRemoveInstruction = (itemId, instructionId) => {
    setVariantData((prevData) =>
      prevData?.map((item) =>
        item?.id === itemId
          ? {
              ...item,
              cookingInstruction: item?.cookingInstruction?.filter((ins) => ins?.id !== instructionId),
            }
          : item,
      ),
    );
  };

  // Update instruction text
  const handleInstructionChange = (itemId, instructionId, value) => {
    setVariantData((prevData) =>
      prevData?.map((item) =>
        item?.id === itemId
          ? {
              ...item,
              cookingInstruction: item?.cookingInstruction?.map((ins) =>
                ins?.id === instructionId ? { ...ins, instruction: value } : ins,
              ),
            }
          : item,
      ),
    );
  };

  useEffect(() => {
    if (productDescription?.sellingUom) {
      setVariantData((prevVariants) =>
        prevVariants.map((variant) => ({
          ...variant,
          uom: productDescription?.sellingUom,
        })),
      );
    }
  }, [productDescription?.sellingUom]);

  return (
    <div>
      {variantData?.map((item, idx) => (
        <Card sx={{ padding: '15px', marginTop: '10px' }}>
          <SoftBox className="stack-row-center-between width-100">
            <div className="title-heading-products">
              Product variants
              <span className="main-header-icon">
                <Tooltip title="Add Variant data">
                  <InfoOutlinedIcon />
                </Tooltip>
              </span>
            </div>
            {variantData?.length > 1 && (
              <CloseIcon
                onClick={() => handleCancelVariant(idx)}
                style={{ color: 'red', fontSize: '24px', cursor: 'pointer' }}
              />
            )}
          </SoftBox>

          <SoftBox style={{ marginTop: '10px' }}>
            <Grid container direction="row" justifyContent="space-between" alignItems="center" gap="5px">
              <Grid item xs={2} md={1} lg={1}>
                <SoftBox className="product-variant-image-box" onClick={() => handleAddPhoto(idx)}>
                  <img
                    src={
                      item?.imageList?.length > 0
                        ? item?.imageList?.[0]
                        : 'https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_images/photo-album-icon-png-14.png'
                    }
                    style={{ width: '50px', height: '50px' }}
                  />
                </SoftBox>
              </Grid>

              <Grid item xs={2} md={3} lg={3}>
                <InputLabel className="inputLabel-style" required>
                  Variant Title
                </InputLabel>
                <SoftInput
                  size="small"
                  value={item?.variantName}
                  onChange={(event) => handleVariantDataChange(item?.id, 'variantName', event.target.value)}
                />
              </Grid>
              <Grid item xs={2} md={2} lg={2}>
                <InputLabel className="inputLabel-style">Short Code</InputLabel>
                <SoftInput
                  size="small"
                  value={item?.shortCode}
                  onChange={(event) => handleVariantDataChange(item?.id, 'shortCode', event.target.value)}
                />
              </Grid>
              <Grid item xs={2} md={1} lg={1}>
                <InputLabel className="inputLabel-style" required>
                  Uom
                </InputLabel>
                <SoftSelect
                  size="small"
                  value={item?.uom}
                  options={uomArray}
                  onChange={(event) => !productDescription?.needsWeighingScaleIntegration ? handleVariantDataChange(item?.id, 'uom', event): null}
                  disabled={!!productDescription?.needsWeighingScaleIntegration}
                />
              </Grid>
              <Grid item xs={2} md={1} lg={1}>
                <InputLabel className="inputLabel-style" required>
                  Specification
                </InputLabel>
                <SoftInput
                  size="small"
                  value={item?.specification}
                  onChange={(event) => handleVariantDataChange(item?.id, 'specification', event.target.value)}
                />
              </Grid>
              {!productDescription?.productTypes?.includes('CONSUMABLE') && (
                <Grid item xs={2} md={1} lg={1}>
                  <InputLabel className="inputLabel-style">Prep Time</InputLabel>
                  <SoftInput
                    size="small"
                    value={item?.prepTime}
                    onChange={(event) => handleVariantDataChange(item?.id, 'prepTime', event.target.value)}
                  />
                </Grid>
              )}
              {!productDescription?.productTypes?.includes('CONSUMABLE') && (
                <Grid item xs={2} md={1} lg={1}>
                  <InputLabel className="inputLabel-style">Calories</InputLabel>
                  <SoftInput
                    size="small"
                    value={item?.calories}
                    onChange={(event) => handleVariantDataChange(item?.id, 'calories', event.target.value)}
                  />
                </Grid>
              )}
              {productDescription?.productTypes?.includes('CONSUMABLE') && (
                <Grid item xs={2} md={1} lg={1}>
                  <InputLabel className="inputLabel-style">Sale Price</InputLabel>
                  <SoftInput
                    type="number"
                    size="small"
                    value={item?.consumableSalePrice}
                    onChange={(event) => handleVariantDataChange(item?.id, 'consumableSalePrice', event.target.value)}
                  />
                </Grid>
              )}
              <Grid item xs={2} md={1} lg={1}>
                <InputLabel className="inputLabel-style" required>
                  Tax Status
                </InputLabel>
                <SoftSelect
                  size="small"
                  value={item?.taxStatus}
                  options={taxStatus}
                  menuPortalTarget={document.body}
                  onChange={(event) => handleVariantDataChange(item?.id, 'taxStatus', event)}
                />
              </Grid>
            </Grid>
          </SoftBox>
          <SoftBox style={{ marginTop: '10px' }}>
            <Grid container direction="row" alignItems="center" gap="5px">
              <Grid item xs={6} md={6} lg={6}>
                <div className="stack-column-center-start width-100">
                  <label className="dynamic-coupon-label-typo">Cart View</label>
                  <div className="cart-view-box">
                    <div className="stack-row-center-start gap-10">
                      <img
                        src={
                          item?.imageList?.length > 0
                            ? item?.imageList?.[0]
                            : 'https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_images/photo-album-icon-png-14.png'
                        }
                        style={{ width: '35px', height: '35px' }}
                      />
                    </div>
                    <div className="stack-column-center-start">
                      <Typography style={{ fontSize: '16px', fontWeight: 'bold' }}>
                        {productDescription?.productName}
                      </Typography>
                      <Typography style={{ fontSize: '12px', marginLeft: '10px' }}>{item?.variantName}</Typography>
                    </div>
                  </div>
                </div>
              </Grid>
            </Grid>
          </SoftBox>
          <SoftBox style={{ marginTop: '10px' }}>
            <Grid container direction="row" alignItems="center" gap="5px">
              <Grid item xs={2} md={1} lg={1}>
                <div className="stack-row-center-start width-100">
                  <input
                    type="checkbox"
                    id="barcodeNeed"
                    name="barcodeNeed"
                    checked={item?.barcodeNeed}
                    onChange={(e) => handleVariantDataChange(item?.id, 'barcodeNeed', e.target.checked)}
                    disabled={productDescription?.needsWeighingScaleIntegration === true}
                  />
                  <label className="dynamic-coupon-label-typo">Barcode</label>
                </div>
              </Grid>
              {item?.barcodeNeed && (
                <Grid item xs={2} md={3} lg={3}>
                  <div className="common-display-flex" style={{ gap: '5px', justifyContent: 'flex-start' }}>
                    {/* <span className="main-header-icon" style={{ color: 'success' }}>
                      <VerifiedIcon color="success" />
                    </span> */}
                    <div style={{ position: 'relative' }}>
                      <SoftInput
                        size="small"
                        value={item?.barcode}
                        onChange={(e) => handleVariantDataChange(item?.id, 'barcode', e?.target?.value)}
                        // icon={{ component: <AutoAwesomeIcon />, direction: 'right' }}
                      />

                      {/* {!item?.weighingScale && ( */}
                      <SoftTypography
                        onClick={() => {
                          if (!item?.disabled) {
                            handleGenerateBarCode(idx, item?.id, 'barcode');
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
                        {!generateBarcodeLoader ? (
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
                </Grid>
              )}
              {!productDescription?.productTypes?.includes('CONSUMABLE') && (
                <>
                  <Grid item xs={2} md={2} lg={2}>
                    <div className="stack-row-center-start width-100">
                      <input
                        type="checkbox"
                        id="sendToKds"
                        name="sendToKds"
                        checked={item?.sendToKds}
                        onChange={(e) => handleVariantDataChange(item?.id, 'sendToKds', e.target.checked)}
                      />
                      <label className="dynamic-coupon-label-typo">Send to KDS</label>
                    </div>
                  </Grid>
                  <Grid item xs={2} md={4} lg={4}>
                    <div className="stack-row-center-start">
                      <InputLabel sx={inputLabelStyle}>Choose prep station</InputLabel>

                      <SoftAsyncPaginate
                        size="small"
                        className="select-box-category"
                        placeholder="Select Title..."
                        loadOptions={fetchAllPrepStations()}
                        additional={{
                          page: 1,
                        }}
                        isClearable
                        value={item?.prepStation}
                        onChange={(e) => handleVariantDataChange(item?.id, 'prepStation', e)}
                        menuPortalTarget={document.body}
                      />
                    </div>
                  </Grid>
                </>
              )}
            </Grid>
          </SoftBox>

          {!productDescription?.productTypes?.includes('CONSUMABLE') &&
            !productDescription?.productTypes?.includes('RAW') && (
              <SoftBox style={{ marginTop: '10px' }}>
                <Grid container direction="row" alignItems="center" gap="5px">
                  <Grid item xs={2} md={4} lg={4}>
                    <div className="stack-row-center-start width-100">
                      <input
                        type="checkbox"
                        id="addRecipe"
                        name="addRecipe"
                        checked={item?.addRecipe}
                        onChange={(e) => handleVariantDataChange(item?.id, 'addRecipe', e.target.checked)}
                      />
                      <label className="dynamic-coupon-label-typo">Add Recipe</label>
                    </div>
                  </Grid>
                </Grid>
              </SoftBox>
            )}

          {item?.addRecipe &&
            !productDescription?.productTypes?.includes('CONSUMABLE') &&
            !productDescription?.productTypes?.includes('RAW') && (
              <div>
                {item?.recipeArr?.map((recipe, index) => (
                  <SoftBox style={{ marginTop: '10px' }}>
                    <Grid container direction="row" alignItems="center" gap="5px">
                      <Grid item xs={2} md={2.5} lg={2.5}>
                        <InputLabel className="inputLabel-style">Title</InputLabel>
                        {/* <SoftInput
                          size="small"
                          value={recipe?.recipeTitle}
                          onChange={(event) =>
                            handleRecipeChange(item?.id, recipe?.id, 'recipeTitle', event.target.value)
                          }
                        /> */}

                        <SoftAsyncPaginate
                          size="small"
                          className="select-box-category"
                          placeholder="Select Title..."
                          value={recipe?.recipeTitle || ''}
                          loadOptions={fetchAllGlobalProductsThroughType(['RAW', 'PREP', 'ADD_ON'])}
                          additional={{
                            page: 1,
                          }}
                          isClearable
                          onChange={(event) => {
                            handleRecipeChange(item?.id, recipe?.id, 'recipeTitle', event);
                          }}
                          menuPortalTarget={document.body}
                        />
                      </Grid>
                      <Grid item xs={2} md={2} lg={2}>
                        <InputLabel className="inputLabel-style">Uom</InputLabel>
                        <SoftSelect
                          size="small"
                          options={uomArray}
                          value={recipe?.uom}
                          onChange={(event) => handleRecipeChange(item?.id, recipe?.id, 'uom', event)}
                        />
                      </Grid>
                      <Grid item xs={2} md={2} lg={2}>
                        <InputLabel className="inputLabel-style">Specification</InputLabel>
                        <SoftInput
                          size="small"
                          value={recipe?.specification}
                          onChange={(event) =>
                            handleRecipeChange(item?.id, recipe?.id, 'specification', event.target.value)
                          }
                        />
                      </Grid>
                      <Grid item xs={2} md={2} lg={2}>
                        <InputLabel className="inputLabel-style">Target Cost</InputLabel>
                        <SoftInput
                          size="small"
                          type="number"
                          value={recipe?.targetCost}
                          onChange={(event) =>
                            handleRecipeChange(
                              item?.id,
                              recipe?.id,
                              'targetCost',
                              event.target.value,
                              null,
                              event.target.value,
                              recipe?.addToFoodCost === null ? null : recipe?.addToFoodCost,
                              idx,
                              index,
                            )
                          }
                        />
                      </Grid>
                      <Grid item xs={2} md={2} lg={2}>
                        <div className="stack-row-center-start width-100">
                          <input
                            type="checkbox"
                            id="addToFoodCost"
                            name="addToFoodCost"
                            checked={recipe?.addToFoodCost}
                            onChange={(e) =>
                              handleRecipeChange(
                                item?.id,
                                recipe?.id,
                                'addToFoodCost',
                                e.target.checked,
                                null,
                                recipe?.targetCost,
                                e.target.checked,
                                idx,
                                index,
                              )
                            }
                          />
                          <label className="dynamic-coupon-label-typo">Add to food cost</label>
                        </div>
                      </Grid>
                      {/* {item?.recipeArr?.length > 1 && ( */}
                      <Grid item lg={0.5}>
                        <CloseIcon
                          onClick={() => handleCancelRecipe(item?.id, recipe?.id, 'recipe')}
                          style={{ color: 'red', fontSize: '18px', cursor: 'pointer' }}
                        />
                      </Grid>
                      {/* )} */}
                    </Grid>
                  </SoftBox>
                ))}
                <Typography
                  type="button"
                  onClick={() => handleAddMoreRecipe(item?.id, 'recipe')}
                  className="add-lang-new-btn"
                >
                  + Add more
                </Typography>
              </div>
            )}

          {item?.addRecipe &&
            !productDescription?.productTypes?.includes('CONSUMABLE') &&
            !productDescription?.productTypes?.includes('RAW') && (
              <SoftBox style={{ marginTop: '10px' }}>
                <div className="common-display-flex">
                  <div className="title-heading-products-header">
                    Estimated food cost according to specification ₹{estimatedFoodCostPerPortion[idx]?.total || 0}
                  </div>
                  <div className="common-display-flex">
                    <span className="main-header-icon">
                      <Tooltip title="Generate product descriptions using AI" placement="right">
                        <InfoOutlinedIcon />
                      </Tooltip>
                    </span>
                  </div>
                </div>
              </SoftBox>
            )}

          {!productDescription?.productTypes?.includes('CONSUMABLE') &&
            !productDescription?.productTypes?.includes('RAW') &&
            productDescription?.eligibleForSale && (
              <SoftBox style={{ marginTop: '10px' }}>
                <div className="common-display-flex">
                  <div className="title-heading-products">Sales Channel</div>
                  <div className="common-display-flex">
                    <span className="main-header-icon">
                      <Tooltip title="Generate product descriptions using AI" placement="right">
                        <InfoOutlinedIcon />
                      </Tooltip>
                    </span>
                  </div>
                </div>
              </SoftBox>
            )}

          {!productDescription?.productTypes?.includes('CONSUMABLE') &&
            !productDescription?.productTypes?.includes('RAW') && (
              <>
                {productDescription?.eligibleForSale && (
                  <SoftBox style={{ marginTop: '10px' }}>
                    <div className="flex-column width-100">
                      <Grid container direction="row" alignItems="center" gap="5px">
                        <Grid item xs={2} md={2} lg={2}>
                          <InputLabel className="inputLabel-style"></InputLabel>
                        </Grid>
                        <Grid item xs={2} md={2} lg={2}>
                          <InputLabel className="inputLabel-style">Sale Price</InputLabel>
                        </Grid>
                        <Grid item xs={2} md={4} lg={4}>
                          <InputLabel className="inputLabel-style">Add consumables</InputLabel>
                        </Grid>
                        <Grid item xs={2} md={1} lg={1}>
                          <InputLabel className="inputLabel-style">Margin in %</InputLabel>
                        </Grid>
                        <Grid item xs={2} md={1} lg={1}>
                          <InputLabel className="inputLabel-style">Profit</InputLabel>
                        </Grid>
                      </Grid>

                      <>
                        {' '}
                        {salesChannelsOptions?.map((channel) => (
                          <Grid container direction="row" alignItems="center" gap="5px">
                            <Grid item xs={2} md={2} lg={2}>
                              <div className="stack-row-center-stat">
                                <input
                                  type="checkbox"
                                  id="type"
                                  name="type"
                                  checked={item.salesChannels?.some((sc) => sc?.id === channel?.id) || false}
                                  onChange={(e) =>
                                    handleSalesChannelChange(
                                      item?.id,
                                      channel?.id,
                                      'type',
                                      channel?.label,
                                      e.target.checked,
                                      idx,
                                    )
                                  }
                                />
                                <label className="dynamic-coupon-label-typo">{channel?.label}</label>
                              </div>
                            </Grid>
                            <Grid item xs={2} md={2} lg={2}>
                              <SoftInput
                                type="number"
                                placeholder="Enter"
                                size="small"
                                value={item?.salesChannels?.find((sc) => sc?.id === channel?.id)?.salePrice || ''}
                                onChange={(e) =>
                                  handleSalesChannelChange(
                                    item?.id,
                                    channel?.id,
                                    'salePrice',
                                    e.target.value,
                                    true,
                                    idx,
                                  )
                                }
                              />
                            </Grid>
                            <Grid item xs={2} md={4} lg={4}>
                              <SoftAsyncPaginate
                                size="small"
                                isMulti
                                className="select-box-category"
                                placeholder="Select category..."
                                value={item?.salesChannels?.find((sc) => sc?.id === channel?.id)?.consumable || ''}
                                loadOptions={fetchAllGlobalProductsThroughType(['CONSUMABLE'])}
                                additional={{
                                  page: 1,
                                }}
                                isClearable
                                onChange={(option) => {
                                  handleSalesChannelChange(item?.id, channel?.id, 'consumable', option, true, idx);
                                }}
                                menuPortalTarget={document.body}
                              />
                              {/* <SoftSelect
                      placeholder="Select"
                      options={[]}
                      size="small"
                      value={item?.salesChannels?.find((sc) => sc?.type === channel?.label)?.consumable || ''}
                      onChange={(e) => handleSalesChannelChange(item?.id, channel?.id, 'consumable', e, true)}
                    /> */}
                            </Grid>
                            <Grid item xs={2} md={1} lg={1}>
                              <SoftInput
                                disabled
                                placeholder="Enter"
                                size="small"
                                value={item?.salesChannels?.find((sc) => sc?.id === channel?.id)?.margin || ''}
                                onChange={(e) =>
                                  handleSalesChannelChange(item?.id, channel?.id, 'margin', e.target.value, true, idx)
                                }
                              />
                            </Grid>
                            <Grid item xs={2} md={1} lg={1}>
                              <SoftInput
                                disabled
                                placeholder="Enter"
                                size="small"
                                value={item?.salesChannels?.find((sc) => sc?.id === channel?.id)?.profit || ''}
                                onChange={(e) =>
                                  handleSalesChannelChange(item?.id, channel?.id, 'profit', e.target.value, true, idx)
                                }
                              />
                            </Grid>
                          </Grid>
                        ))}
                      </>
                    </div>
                  </SoftBox>
                )}

                <SoftBox style={{ marginTop: '10px' }}>
                  <div className="common-display-flex">
                    <div className="title-heading-products">Cooking & Serving instructions</div>
                    <div className="common-display-flex">
                      <span className="main-header-icon">
                        <Tooltip title="Generate product descriptions using AI" placement="right">
                          <InfoOutlinedIcon />
                        </Tooltip>
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {Array.isArray(item?.cookingInstruction) &&
                      item?.cookingInstruction?.map((cook) => (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} key={cook?.id}>
                          <SoftInput
                            value={cook?.instruction}
                            placeholder="Enter description for the product"
                            onChange={(e) => handleInstructionChange(item?.id, cook?.id, e.target.value)}
                          />

                          {item?.cookingInstruction?.length > 1 && (
                            <CloseIcon
                              onClick={() => handleRemoveInstruction(item?.id, cook?.id)}
                              style={{ color: 'red', fontSize: '18px', cursor: 'pointer' }}
                            />
                          )}
                        </div>
                      ))}
                  </div>
                  <Typography
                    type="button"
                    onClick={() => handleAddMoreInstructions(item?.id, 'cookingInstruction')}
                    className="add-lang-new-btn"
                  >
                    Add More
                  </Typography>
                </SoftBox>

                <SoftBox style={{ marginTop: '10px' }}>
                  <Grid container direction="row" alignItems="center" gap="5px">
                    <Grid item xs={2} md={4} lg={4}>
                      <div className="stack-row-center-start width-100">
                        <input
                          type="checkbox"
                          id="addOn"
                          name="addOn"
                          checked={item?.addOn}
                          onChange={(e) => handleVariantDataChange(item?.id, 'addOn', e.target.checked)}
                        />
                        <label className="dynamic-coupon-label-typo">Add On</label>
                      </div>
                    </Grid>
                  </Grid>
                </SoftBox>
              </>
            )}

          {item?.addOn && (
            <div>
              {item?.addOnData?.map((addOn, index) => (
                <SoftBox style={{ marginTop: '10px' }}>
                  <Grid container direction="row" alignItems="center" gap="5px">
                    <Grid item xs={2} md={3} lg={3}>
                      <InputLabel className="inputLabel-style">Title</InputLabel>

                      <SoftAsyncPaginate
                        size="small"
                        className="select-box-category"
                        placeholder="Select Title..."
                        value={addOn?.title || ''}
                        loadOptions={fetchAllGlobalProductsThroughType(['ADD_ON'])}
                        additional={{
                          page: 1,
                        }}
                        isClearable
                        onChange={(event) => {
                          handleRecipeChange(item?.id, addOn?.id, 'title', event, 'addOn');
                        }}
                        menuPortalTarget={document.body}
                      />
                    </Grid>
                    <Grid item xs={2} md={2} lg={2}>
                      <InputLabel className="inputLabel-style">Uom</InputLabel>
                      <SoftSelect
                        size="small"
                        options={uomArray}
                        value={addOn?.uom}
                        onChange={(event) => handleRecipeChange(item?.id, addOn?.id, 'uom', event, 'addOn')}
                        menuPortalTarget={document.body}
                      />
                    </Grid>
                    <Grid item xs={2} md={2} lg={2}>
                      <InputLabel className="inputLabel-style">Specification</InputLabel>
                      <SoftInput
                        size="small"
                        value={addOn?.specification}
                        onChange={(event) =>
                          handleRecipeChange(item?.id, addOn?.id, 'specification', event.target.value, 'addOn')
                        }
                      />
                    </Grid>
                    <Grid item xs={2} md={2} lg={2}>
                      <InputLabel className="inputLabel-style">Additional Price</InputLabel>
                      <SoftInput
                        size="small"
                        value={addOn?.additionalPrice}
                        onChange={(event) =>
                          handleRecipeChange(item?.id, addOn?.id, 'additionalPrice', event.target.value, 'addOn')
                        }
                      />
                    </Grid>

                    {item?.addOnData?.length > 1 && (
                      <Grid item lg={1}>
                        <CloseIcon
                          onClick={() => handleCancelRecipe(item?.id, addOn?.id, 'addOn')}
                          style={{ color: 'red', fontSize: '18px', marginTop: '20px', cursor: 'pointer' }}
                        />
                      </Grid>
                    )}
                  </Grid>
                </SoftBox>
              ))}
              <Typography
                type="button"
                onClick={() => handleAddMoreRecipe(item?.id, 'addOn')}
                className="add-lang-new-btn"
              >
                + Add more
              </Typography>
            </div>
          )}
        </Card>
      ))}
      {!productDescription?.needsWeighingScaleIntegration && (
        <SoftButton
          className="smallBtnStyle"
          size="small"
          variant="outlined"
          color="info"
          onClick={handleAddMoreVariants}
        >
          + Add More
        </SoftButton>
      )}{' '}
      {openImageModal && (
        <ProductVarientImagesUpload
          index={currIndex}
          openImageModal={openImageModal}
          handleCloseImageModal={handleCloseImageModal}
          productVariantArr={variantData}
          setProductVariantArr={setVariantData}
        />
      )}
    </div>
  );
};

export default ProductRestaurantVariant;
