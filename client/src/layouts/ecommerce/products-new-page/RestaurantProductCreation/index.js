import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import { Box, Grid, Tooltip } from '@mui/material';
import SoftBox from '../../../../components/SoftBox';
import SoftTypography from '../../../../components/SoftTypography';
import ProductDescription from './components/ProductDesc';
import SoftButton from '../../../../components/SoftButton';
import Spinner from '../../../../components/Spinner';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ProductRestaurantVariant from './components/ProductVariant';
import AdditionalRestaurantDetails from './components/AdditionalRestaurantDetails';
import {
  createInventoryProducts,
  createRestaurantProduct,
  getProductDetailsNew,
  getProductDetailsRestaurant,
  getRecipeDetailsRestaurant,
  updateProductDetailsNew,
} from '../../../../config/Services';
import { useSnackbar } from '../../../../hooks/SnackbarProvider';
import { useNavigate, useParams } from 'react-router-dom';

const RestauarantProductCreation = () => {
  const [editLoader, setEditLoader] = useState(false);
  const [loader, setLoader] = useState(false);
  const userDetails = localStorage.getItem('user_details')
    ? JSON.parse(localStorage.getItem('user_details') || {})
    : {};
  const userName = userDetails?.firstName + ' ' + userDetails?.secondName;
  const userUidx = userDetails?.uidx;
  const userId = userDetails?.id || '';
  const orgId = localStorage.getItem('orgId') || '';
  const locId = localStorage.getItem('locId') || '';
  const locName = localStorage.getItem('locName') || '';
  const orgName = localStorage.getItem('orgName') || '';
  const showSnackbar = useSnackbar();
  const navigate = useNavigate();
  const params = useParams();
  const { id } = params;

  const [productDescription, setProductDescription] = useState({
    productName: '',
    productTypes: [],
    rawMaterialGrouping: '',
    storageType: '',
    trackInventory: false,
    eligibleForSale: false,
    itemAvailabilityStart: '',
    itemAvailabilityEnd: '',
    mainMenuCategory: {},
    subMenuCategory: {},
    hsnCode: '',
    gst: '',
    cess: '',
    taxExempted: false,
    mrpRestrictions: false,
    description: '',
    needsWeighingScaleIntegration: false,
    sellingUom: {},
  });

  const [variantData, setVariantData] = useState([
    {
      id: 1,
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
          addToFoodCost: false,
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
          additionalPrice: '',
        },
      ],
      salesChannels: [],
      imageList: [],
    },
  ]);

  const [additionalAttributes, setAdditionalAttributes] = useState({
    additional: true,
    returnableItem: false,
    returnWithin: '',
    organicProduct: false,
    foodType: '',
    allergen: [],
    spiceLevel: '',
    ageRestrictions: false,
    age: '',
    productTitleInlocalLang: [
      {
        id: 1,
        title: '',
        language: '',
      },
    ],
    seoTags: '',
  });

  // this function is used to handle validation of the payload before creating or updating the product
  const handleValidatePayload = () => {
    const validations = [
      {
        condition: !productDescription?.productName?.trim(),
        message: 'Product Title is required',
      },
      {
        condition: !productDescription?.productTypes?.length,
        message: 'Product Type is required',
      },
      {
        condition: productDescription?.eligibleForSale && !productDescription?.mainMenuCategory?.label,
        message: 'Menu is required',
      },
      {
        condition: productDescription?.gst === null || productDescription?.gst === '',
        message: 'GST is required',
      },
      {
        condition: !variantData?.every((variant) => variant?.variantName?.trim()),
        message: 'Variant Title is required for all variants',
      },
      {
        condition: !variantData?.every((variant) => variant?.uom?.label),
        message: 'UOM is required for all variants',
      },
      {
        condition: !variantData?.every((variant) => variant?.specification?.trim()),
        message: 'Specification is required for all variants',
      },
      {
        condition:
          productDescription?.eligibleForSale && !variantData?.every((variant) => variant?.salesChannels?.length > 0),
        message: 'At least one Sale Channel is required for all variants if Eligible for Sale is selected',
      },
      {
        condition: !additionalAttributes?.foodType?.trim(),
        message: 'Food Type is required',
      },
    ];
    for (const { condition, message } of validations) {
      if (condition) {
        showSnackbar(message, 'error');
        return false;
      }
    }
    return true;
  };

  //This function is used to transform the image list to an object with keys as directions
  const transformImageListToObject = (imageList) => {
    const directions = ['front', 'back', 'right', 'left', 'top', 'bottom', 'interior', 'other'];
    const imagesObject = {};
    imageList?.forEach((image, index) => {
      const direction = directions[index];
      if (direction) {
        imagesObject[direction] = image;
      }
    });
    return imagesObject;
  };

  // This function is used to handle the creation of a new product
  const handleCreateProduct = async (action) => {
    if (!handleValidatePayload()) {
      return;
    }

    try {
      setLoader(true);
      let payload = {
        productName: productDescription?.productName || '',
        action: 'product_create',
        logType: 'Create',
        logTime: new Date().toISOString(),
        loggedBy: userUidx,
        loggedByName: userName,
        sourceName: locName,
        sourceType: 'Restaurant',
        product: {
          // id: Math.random().toString(36).substring(2, 15),
          name: productDescription?.productName || '',
          title: productDescription?.productName || '',
          description: productDescription?.description || '',
          rawMaterialGrouping: productDescription?.rawMaterialGrouping?.label || '',
          appCategories: {
            categoryLevel1: productDescription?.mainMenuCategory?.label
              ? [productDescription.mainMenuCategory.label]
              : [],
            categoryLevel1Id: productDescription?.mainMenuCategory?.value
              ? [productDescription.mainMenuCategory.value]
              : [],
            categoryLevel2: productDescription?.subMenuCategory?.label
              ? [productDescription.subMenuCategory.label]
              : [],
            categoryLevel2Id: productDescription?.subMenuCategory?.value
              ? [productDescription.subMenuCategory.value]
              : [],
          },

          posCategories: {
            categoryLevel1: productDescription?.mainMenuCategory?.label
              ? [productDescription.mainMenuCategory.label]
              : [],
            categoryLevel1Id: productDescription?.mainMenuCategory?.value
              ? [productDescription.mainMenuCategory.value]
              : [],
            categoryLevel2: productDescription?.subMenuCategory?.label
              ? [productDescription.subMenuCategory.label]
              : [],
            categoryLevel2Id: productDescription?.subMenuCategory?.value
              ? [productDescription.subMenuCategory.value]
              : [],
          },
          tags: additionalAttributes?.seoTags ? [additionalAttributes?.seoTags] : [],
          allergenItems: additionalAttributes?.allergen || [],
          spiceLevels: additionalAttributes?.spiceLevel ? [additionalAttributes?.spiceLevel] : [],
          needsWeighingScaleIntegration: productDescription?.needsWeighingScaleIntegration || false,
          unitOfMeasure: productDescription?.sellingUom?.label || '',
          productTypes: productDescription?.productTypes || '',
          itemAvailableStartTime: productDescription?.itemAvailabilityStart || '',
          itemAvailableEndTime: productDescription?.itemAvailabilityEnd || '',
          // eligibleForExport: productDescription?.eligibleForSale || false,
          eligibleForSale: productDescription?.eligibleForSale || false,
          trackInventory: productDescription?.trackInventory || false,
          isTaxExempted: productDescription?.taxExempted || false,
          isMrpRestricted: productDescription?.mrpRestrictions || false,
          storageType: productDescription?.storageType?.label || '',
          returnable: additionalAttributes?.returnableItem || false,
          returnWindowInDays: additionalAttributes?.returnWithin || '',
          taxReference: {
            taxName: 'GST & CESS',
            taxType: 'GST',
            taxCategory: 'GST',
            taxRate: productDescription?.gst || '',
            isDefault: true,
            metadata: {
              hsnCode: productDescription?.hsnCode || '',
              cess: productDescription?.cess || '',
            },
          },
          attributes: {
            ageLimit: additionalAttributes?.age || 0,
            foodType: additionalAttributes?.foodType || '',
            gender: '',
            regulatoryData: {
              organic: additionalAttributes?.organicProduct,
              organicCertificate: '',
            },
          },
          storeSpecificData: {
            storeId: orgId,
            storeLocationId: locId,
            storeName: orgName,
            storeLocationName: locName,
          },
          nativeLanguages: additionalAttributes?.productTitleInlocalLang?.map((item) => ({
            language: item?.language?.label || '',
            name: item?.title || '',
          })),
          variants: variantData?.map((item) => {
            let isDineIn = item?.salesChannels?.find((item) => item?.id === 'DINE_IN');
            let isDelivery = item?.salesChannels?.find((item) => item?.id === 'DELIVERY');
            let images =
              item?.imageList?.forEach((image, index) => {
                return {
                  index: image || '',
                };
              }) || {};
            return {
              name: item?.variantName || '',
              // description: 'Khao aur kho jao',
              barcodes: item?.barcodeNeed && item?.barcode ? [item?.barcode] : [],
              shortCode: item?.shortCode || '',
              prepTime: item?.prepTime || 0,
              calories: item?.calories || 0,
              weight: item?.specification || '',
              weightUnit: item?.uom?.label || '',
              recipeRequest: {
                name: item?.variantName || '',
                // description: 'Khao aur kho jao',
                ingredients: item?.recipeArr?.some((recipeItem) => recipeItem?.recipeTitle)
                  ? item?.recipeArr?.map((recipeItem) => ({
                      name: recipeItem?.recipeTitle?.label || '',
                      unit: recipeItem?.uom?.label || '',
                      specification: recipeItem?.specification || '',
                      cost: recipeItem?.targetCost || 0,
                      addToFoodCost: recipeItem?.addToFoodCost || false,
                      variantId: recipeItem?.recipeTitle?.other?.variantId || '',
                      productId: recipeItem?.recipeTitle?.productId || '',
                    }))
                  : [],
                instructions: item?.cookingInstruction?.some((recipeItem) => recipeItem?.instruction)
                  ? item?.cookingInstruction?.map((cook, idx) => ({
                      instruction: cook?.instruction || '',
                      priority: idx + 1 || 0,
                      description: cook?.instruction || '',
                      totalTime: 0,
                    }))
                  : [],
                // servings: 1,
                // preparationTime: 0,
                sourceId: orgId,
                sourceLocationId: locId,
              },
              addOn: item?.addOnData?.some((recipeItem) => recipeItem?.title)
                ? item?.addOnData?.map((addOnItem) => {
                    return {
                      // addOnId: 'string',
                      variantId: addOnItem?.title?.other?.variantId || '',
                      productId: addOnItem?.title?.productId,
                      title: addOnItem?.title?.label || '',
                      foodType: addOnItem?.title?.productData?.attributes?.foodType || '',
                      additionalPrice: addOnItem?.additionalPrice || 0,
                      // gst: 'string',
                      unitOfMeasure: addOnItem?.uom?.label || '',
                      specification: addOnItem?.specification || '',
                    };
                  })
                : [],
              externalSalesChannels: item?.salesChannels?.map((item) => {
                return {
                  salesChannelName: item?.id || '',
                  deliveryConsumable: Array.isArray(item?.consumable)
                    ? item.consumable.map((consumable) => ({
                        code: consumable?.value || '',
                        name: consumable?.label || '',
                        productId: consumable?.productId || '',
                        variantId: consumable?.value || '',
                      }))
                    : [],
                  salePrice: item?.salePrice || 0,
                  marginPercentage: item?.margin || 0,
                  profit: item?.profit || 0,
                };
              }),
              salesChannels: item?.salesChannels?.map((item) => item?.id || ''),
              choosePrepStation: {
                id: item?.prepStation?.value,
                displayName: item?.prepStation?.label,
              },
              sendToKds: item?.sendToKds ? 'YES' : 'NO',
              // sku: '5555500106325',
              // weight: '1',
              // weightUnit: 'nos',
              // packType: 'Pouch',
              // isRawMaterial: true,
              needsWeighingScaleIntegration: productDescription?.needsWeighingScaleIntegration || false,
              taxStatus: item?.taxStatus?.label || '',
              minB2COrderQuantity: 1,
              minB2BOrderQuantity: 1,
              minPosOrderQuantity: 1,
              ...(isDineIn
                ? {
                    inventorySync: {
                      availableQuantity: 1,
                      mrp: isDineIn?.salePrice || 0,
                      sellingPrice: isDineIn?.salePrice || 0,
                      purchasePrice: isDineIn?.salePrice || 0,
                    },
                  }
                : productDescription?.productTypes?.includes('CONSUMABLE')
                ? {
                    inventorySync: {
                      availableQuantity: 1,
                      mrp: item?.consumableSalePrice || 0,
                      sellingPrice: item?.consumableSalePrice || 0,
                      purchasePrice: item?.consumableSalePrice || 0,
                    },
                  }
                : {
                    inventorySync: {
                      availableQuantity: 1,
                      mrp: isDelivery?.salePrice || 0,
                      sellingPrice: isDelivery?.salePrice || 0,
                      purchasePrice: isDelivery?.salePrice || 0,
                    },
                  }),

              // sellingUnits: [
              //   {
              //     quantity: '1',
              //     unitOfMeasure: 'nos',
              //   },
              // ],
              // weightsAndMeasures: [
              //   {
              //     measurementUnit: 'nos',
              //     netWeight: '1',
              //     grossWeight: '1',
              //     netContent: '1',
              //     metadata: {
              //       type: 'PRIMARY',
              //     },
              //   },
              // ],
              images: transformImageListToObject(item?.imageList || []),
              tags: [additionalAttributes?.seoTags] || [],
              // metadata: {
              //   additionalProp1: 'string',
              //   additionalProp2: 'string',
              //   additionalProp3: 'string',
              // },
              createdBy: userUidx,
              createdByName: userName,
              updatedBy: userUidx,
              updatedByName: userName,
              // created: new Date().toISOString(),
              // updated: new Date().toISOString(),
              isActive: true,
              isDeleted: false,
              // deletedBy: 'string',
              // deletedByName: 'string',
              // deletedAt: 0,
            };
          }),

          createdBy: userUidx,
          createdByName: userName,
          updatedBy: userUidx,
          updatedByName: userName,
        },
        sourceId: orgId,
        sourceLocationId: locId,
      };

      const createProduct = await createRestaurantProduct(payload);
      if (
        createProduct?.data?.status === 'ERROR' ||
        createProduct?.data?.status === 'error' ||
        createProduct?.data?.data?.es > 0
      ) {
        showSnackbar(
          createProduct?.data?.message ||
            createProduct?.data?.data?.message ||
            'Something went wrong while creating product',
          'error',
        );
        setLoader(false);
        return;
      }
      const resData = createProduct?.data?.data?.data;

      const inventoryPayload = createProduct?.data?.data?.data?.variants?.map((item, id) => {
        const salePrice = item?.inventorySync?.sellingPrice || null;

        return {
          productId: resData?.productId,
          orgId: orgId,
          locationId: locId,
          gtin: item?.barcodes[0] || '',
          category: productDescription?.mainMenuCategory?.label,
          subCategory: productDescription?.subMenuCategory?.label,
          level2Category: '',
          brand: '',
          specification: item?.weight,
          sellingUnit: item?.weightUnit,
          manufacturer: '',
          packagingType: item?.needsWeighingScaleIntegration ? 'weighingScale' : 'standard',
          createdBy: userUidx,
          sourceId: null,
          sourceName: null,
          variantId: item?.variantId,
          itemType: productDescription?.productTypes || '',
          restaurantBatchEnabled: true,
          createdByName: userName,
          productName: item?.name,
          purchasePrice: null,
          sellingPrice: salePrice,
          mrp: null,
        };
      });

      createInventoryProducts(inventoryPayload)
        .then((res) => {
          if (res?.data?.status === 'ERROR') {
            showSnackbar(res?.data?.message, 'error');
          } else if (res?.data?.data?.es === 1) {
            showSnackbar(res?.data?.data?.message, 'error');
          } else {
            showSnackbar('Product Created Succesfully', 'success');
            navigate(-1);
          }
          setLoader(false);
        })
        .catch((err) => {
          setLoader(false);
          showSnackbar('There was an error creating the product', 'error');
        });
    } catch (error) {
      setLoader(false);
    }
  };

  // This function is used to backfill all the details of a product for updation
  const handleGetProductDetails = async () => {
    setEditLoader(true);
    try {
      const response = await getProductDetailsRestaurant(id, locId?.toLowerCase());
      const variantIds = response?.data?.data?.data?.variants?.map((item) => item?.variantId) || [];
      const recipePayload = {
        page: 1,
        pageSize: 100,
        variantIds: variantIds || [],
      };
      const recipeResponse = await getRecipeDetailsRestaurant(recipePayload);
      if (response?.data?.status === 'ERROR' || response?.data?.status === 'error' || response?.data?.data?.es > 0) {
        showSnackbar(response?.data?.message || 'Something went wrong while fetching product details', 'error');
        return;
      }
      const res = response?.data?.data?.data || {};
      const recipeRes = recipeResponse?.data?.data?.data?.data || [];
      // const currentRecipe = recipeRes?.find((item) => item?.productId === id) || {};

      setProductDescription((prev) => ({
        ...prev,
        ...res,
        newId: res?.id,
        productName: res?.title || '',
        productTypes: res?.productTypes || [],
        rawMaterialGrouping: { label: res?.rawMaterialGrouping, value: res?.rawMaterialGrouping } || '',
        storageType: { label: res?.storageType, value: res?.storageType } || '',
        trackInventory: res?.trackInventory || false,
        eligibleForSale: res?.eligibleForSale || false,
        itemAvailabilityStart: res?.itemAvailableStartTime || '',
        itemAvailabilityEnd: res?.itemAvailableEndTime || '',
        mainMenuCategory: {
          label: res?.appCategories?.categoryLevel1[0] || '',
          value: res?.appCategories?.categoryLevel1Id[0] || '',
        },
        hsnCode: res?.taxReference?.metadata?.hsnCode || '',
        gst: res?.taxReference?.taxRate || '',
        cess: res?.taxReference?.metadata?.cess || '',
        subMenuCategory: {
          label: res?.appCategories?.categoryLevel2[0] || '',
          value: res?.appCategories?.categoryLevel2Id[0] || '',
        },
        taxExempted: res?.isTaxExempted || false,
        mrpRestrictions: res?.isMrpRestricted || false,
        description: res?.description || '',
        needsWeighingScaleIntegration: res?.needsWeighingScaleIntegration || false,
        sellingUom: {
          label: res?.unitOfMeasure || '',
          value: res?.unitOfMeasure || '',
        },
      }));

      const variantDataGet = res?.variants?.map((item, index) => {
        const currentRecipe = recipeRes?.find((recipe) => recipe?.variantId === item?.variantId) || {};

        return {
          ...item,
          id: index + 1,
          variantName: item?.name || '',
          shortCode: item?.shortCode || '',
          uom: {
            label: item?.weightUnit || '',
            value: item?.weightUnit || '',
          },
          specification: item?.weight || '',
          prepTime: item?.prepTime || '',
          calories: item?.calories || '',
          taxStatus: {
            label: item?.taxStatus || '',
            value: item?.taxStatus || '',
          },
          barcodeNeed: item?.barcodes?.length > 0,
          barcode: item?.barcodes?.length ? item?.barcodes[0] : '',
          sendToKds: item?.sendToKds === 'YES',
          prepStation: {
            label: item?.choosePrepStation?.displayName,
            value: item?.choosePrepStation?.id,
          },
          addRecipe: currentRecipe?.ingredients?.length > 0,
          recipeArr:
            Array.isArray(currentRecipe?.ingredients) && currentRecipe?.ingredients?.length > 0
              ? currentRecipe?.ingredients?.map((recipeItem, i) => ({
                  ...recipeItem,
                  id: recipeItem?.ingredientId,
                  recipeTitle: {
                    id: recipeItem?.ingredientId,
                    label: recipeItem?.name || '',
                    value: recipeItem?.name || '',
                    productId: recipeItem?.productId || '',
                    other: {
                      variantId: recipeItem?.variantId || '',
                      productId: recipeItem?.productId || '',
                    },
                  },
                  unit: recipeItem?.unit || '',
                  variantId: recipeItem?.variantId || '',
                  productId: recipeItem?.productId || '',
                  specification: recipeItem?.specification || '',
                  targetCost: recipeItem?.cost || 0,
                  addToFoodCost: recipeItem?.addToFoodCost || false,
                  uom: {
                    label: recipeItem?.unit || '',
                    value: recipeItem?.unit || '',
                  },
                }))
              : [
                  {
                    id: 1,
                    recipeTitle: '',
                    uom: {},
                    specification: '',
                    targetCost: '',
                    addToFoodCost: false,
                  },
                ],
          cookingInstruction: Array.isArray(currentRecipe?.instruction)
            ? currentRecipe.instruction.map((cook, idx) => ({
                instruction: cook?.instruction || '',
                id: cook?.priority || 1,
              }))
            : [{ instruction: '', id: 1 }],
          addOn: item?.addOn?.length > 0,
          addOnData:
            item?.addOn?.length > 0
              ? item?.addOn?.map((addOnItem, i) => ({
                  ...addOnItem,
                  id: i,
                  title: {
                    label: addOnItem?.title || '',
                    value: addOnItem?.title || '',
                    other: {
                      variantId: addOnItem?.variantId || '',
                      productId: addOnItem?.productId || '',
                    },
                    productData: {
                      attributes: {
                        foodType: addOnItem?.foodType || '',
                      },
                    },
                  },
                  additionalPrice: addOnItem?.additionalPrice || 0,
                  uom: {
                    label: addOnItem?.unitOfMeasure || '',
                    value: addOnItem?.unitOfMeasure || '',
                  },
                  specification: addOnItem?.specification || '',
                }))
              : [
                  {
                    id: 1,
                    title: '',
                    uom: {},
                    specification: '',
                    additionalPrice: '',
                  },
                ],
          salesChannels: item?.externalSalesChannels?.map((channel) => ({
            id: channel?.salesChannelName || '',
            consumable: channel?.deliveryConsumable?.map((consumable) => ({
              code: consumable?.value || '',
              name: consumable?.name || '',
              productId: consumable?.productId || '',
              variantId: consumable?.variantId || '',
              label: consumable?.name || '',
              value: consumable?.variantId || '',
            })),
            salePrice: channel?.salePrice || 0,
            margin: channel?.marginPercentage || 0,
            profit: channel?.profit,
          })),
          imageList: Object.values(item?.images || {}),
        };
      });

      setVariantData(variantDataGet);

      const additionalAttributesData = res?.attributes || {};
      setAdditionalAttributes((prev) => ({
        ...prev,
        ...additionalAttributesData,
        additional: additionalAttributesData?.additional || true,
        returnableItem: res?.returnable || false,
        returnWithin: res?.returnWindowInDays ?? '',
        organicProduct: additionalAttributesData?.regulatoryData?.organic === 'true' ? true : false,
        foodType: additionalAttributesData?.foodType || '',
        allergen: res?.allergenItems,
        spiceLevel: res?.spiceLevels?.length ? res?.spiceLevels[0] : '',
        ageRestrictions: false,
        age: additionalAttributesData?.ageLimit || '',
        seoTags: res?.tags?.length ? res?.tags[0] : '',
        productTitleInlocalLang: res?.nativeLanguages?.map((item, index) => ({
          id: index + 1,
          title: item?.name || '',
          language: {
            label: item?.language || '',
            value: item?.language || '',
          },
        })),
      }));
      setEditLoader(false);
    } catch (error) {
      setEditLoader(false);
    }
  };

  // This function is used to handle the update of an existing product
  const handleUpdateProducts = async () => {
    try {
      setLoader(true);
      let payload = {
        productId: id,
        productName: productDescription?.productName || '',
        action: 'UPDATE',
        logType: 'Create',
        logTime: new Date().toISOString(),
        loggedBy: userUidx,
        loggedByName: userName,
        sourceName: locName,
        sourceType: 'Restaurant',
        product: {
          productId: id,
          id: productDescription?.newId,
          name: productDescription?.productName || '',
          title: productDescription?.productName || '',
          description: productDescription?.description || '',
          rawMaterialGrouping: productDescription?.rawMaterialGrouping?.label || '',
          appCategories: {
            categoryLevel1: productDescription?.mainMenuCategory?.label
              ? [productDescription.mainMenuCategory.label]
              : [],
            categoryLevel1Id: productDescription?.mainMenuCategory?.value
              ? [productDescription.mainMenuCategory.value]
              : [],
            categoryLevel2: productDescription?.subMenuCategory?.label
              ? [productDescription.subMenuCategory.label]
              : [],
            categoryLevel2Id: productDescription?.subMenuCategory?.value
              ? [productDescription.subMenuCategory.value]
              : [],
          },

          posCategories: {
            categoryLevel1: productDescription?.mainMenuCategory?.label
              ? [productDescription.mainMenuCategory.label]
              : [],
            categoryLevel1Id: productDescription?.mainMenuCategory?.value
              ? [productDescription.mainMenuCategory.value]
              : [],
            categoryLevel2: productDescription?.subMenuCategory?.label
              ? [productDescription.subMenuCategory.label]
              : [],
            categoryLevel2Id: productDescription?.subMenuCategory?.value
              ? [productDescription.subMenuCategory.value]
              : [],
          },
          tags: additionalAttributes?.seoTags ? [additionalAttributes?.seoTags] : [],
          allergenItems: additionalAttributes?.allergen || [],
          spiceLevels: additionalAttributes?.spiceLevel ? [additionalAttributes?.spiceLevel] : [],
          needsWeighingScaleIntegration: productDescription?.needsWeighingScaleIntegration || false,
          unitOfMeasure: productDescription?.sellingUom?.label || '',
          productTypes: productDescription?.productTypes || '',
          itemAvailableStartTime: productDescription?.itemAvailabilityStart || '',
          itemAvailableEndTime: productDescription?.itemAvailabilityEnd || '',
          // eligibleForExport: productDescription?.eligibleForSale || false,
          eligibleForSale: productDescription?.eligibleForSale || false,
          trackInventory: productDescription?.trackInventory || false,
          isTaxExempted: productDescription?.taxExempted || false,
          isMrpRestricted: productDescription?.mrpRestrictions || false,
          storageType: productDescription?.storageType?.label || '',
          returnable: additionalAttributes?.returnableItem || false,
          returnWindowInDays: additionalAttributes?.returnWithin || '',
          taxReference: {
            taxName: 'GST & CESS',
            taxType: 'GST',
            taxCategory: 'GST',
            taxRate: productDescription?.gst || '',
            isDefault: true,
            metadata: {
              hsnCode: productDescription?.hsnCode || '',
              cess: productDescription?.cess || '',
            },
          },
          attributes: {
            ageLimit: additionalAttributes?.age || 0,
            foodType: additionalAttributes?.foodType || '',
            gender: '',
            regulatoryData: {
              organic: additionalAttributes?.organicProduct || '',
              organicCertificate: '',
            },
          },
          storeSpecificData: {
            storeId: orgId,
            storeLocationId: locId,
            storeName: orgName,
            storeLocationName: locName,
          },
          nativeLanguages: additionalAttributes?.productTitleInlocalLang?.map((item) => ({
            language: item?.language?.label || '',
            name: item?.title || '',
          })),
          variants: variantData?.map((item) => {
            let isDineIn = item?.salesChannels?.find((item) => item?.id === 'DINE_IN');
            let isDelivery = item?.salesChannels?.find((item) => item?.id === 'DELIVERY');
            let images =
              item?.imageList?.forEach((image, index) => {
                return {
                  index: image || '',
                };
              }) || {};
            return {
              // ...item,
              variantId: item?.variantId || null,
              name: item?.variantName || '',
              // description: 'Khao aur kho jao',
              barcodes: item?.barcode ? [item?.barcode] : [],
              shortCode: item?.shortCode || '',
              prepTime: item?.prepTime || 0,
              calories: item?.calories || 0,
              weight: item?.specification || '',
              weightUnit: item?.uom?.label || '',
              recipeRequest: {
                id: item?.recipeArr[0]?.id || '',
                name: item?.variantName || '',
                variantId: item?.variantId || null,
                productId: id,
                // description: 'Khao aur kho jao',
                ingredients: item?.recipeArr?.some((recipeItem) => recipeItem?.recipeTitle)
                  ? item?.recipeArr?.map((recipeItem) => ({
                      ingredientId: recipeItem?.ingredientId || '',
                      name: recipeItem?.recipeTitle?.label || '',
                      unit: recipeItem?.uom?.label || '',
                      specification: recipeItem?.specification || '',
                      cost: recipeItem?.targetCost || 0,
                      addToFoodCost: recipeItem?.addToFoodCost || false,
                      variantId: recipeItem?.recipeTitle?.other?.variantId || '',
                      productId: recipeItem?.recipeTitle?.productId || '',
                    }))
                  : [],
                instructions: item?.cookingInstruction?.some((recipeItem) => recipeItem?.instruction)
                  ? item?.cookingInstruction?.map((cook, idx) => ({
                      instruction: cook?.instruction || '',
                      priority: idx + 1 || 0,
                      description: cook?.instruction || '',
                      totalTime: 0,
                    }))
                  : [],
                // servings: 1,
                // preparationTime: 0,
                sourceId: orgId,
                sourceLocationId: locId,
              },
              addOn: item?.addOnData?.some((recipeItem) => recipeItem?.title)
                ? item?.addOnData?.map((addOnItem) => {
                    return {
                      ...(addOnItem?.addOnId && { addOnId: addOnItem?.addOnId }),
                      variantId: addOnItem?.title?.other?.variantId || '',
                      productId: addOnItem?.title?.productId,
                      title: addOnItem?.title?.label || '',
                      foodType: addOnItem?.title?.productData?.attributes?.foodType || '',
                      additionalPrice: addOnItem?.additionalPrice || 0,
                      // gst: 'string',
                      unitOfMeasure: addOnItem?.uom?.label || '',
                      specification: addOnItem?.specification || '',
                    };
                  })
                : [],
              externalSalesChannels: item?.salesChannels?.map((item) => {
                return {
                  salesChannelName: item?.id || '',
                  deliveryConsumable: Array.isArray(item?.consumable)
                    ? item.consumable.map((consumable) => ({
                        code: consumable?.value || '',
                        name: consumable?.label || '',
                        productId: consumable?.productId || '',
                        variantId: consumable?.value || '',
                      }))
                    : [],
                  salePrice: item?.salePrice || 0,
                  marginPercentage: item?.margin || 0,
                  profit: item?.profit || 0,
                };
              }),
              salesChannels: item?.salesChannels?.map((item) => item?.id || ''),
              choosePrepStation: {
                id: item?.prepStation?.value || '',
                displayName: item?.prepStation?.label || '',
              },
              sendToKds: item?.sendToKds ? 'YES' : 'NO',
              // sku: '5555500106325',
              // weight: '1',
              // weightUnit: 'nos',
              // packType: 'Pouch',
              // isRawMaterial: true,
              taxStatus: item?.taxStatus?.label || '',
              minB2COrderQuantity: 1,
              minB2BOrderQuantity: 1,
              minPosOrderQuantity: 1,
              ...(isDineIn
                ? {
                    inventorySync: {
                      availableQuantity: 1,
                      mrp: isDineIn?.salePrice || 0,
                      sellingPrice: isDineIn?.salePrice || 0,
                      purchasePrice: isDineIn?.salePrice || 0,
                    },
                  }
                : productDescription?.productTypes?.includes('CONSUMABLE')
                ? {
                    inventorySync: {
                      availableQuantity: 1,
                      mrp: isDelivery?.consumableSalePrice || 0,
                      sellingPrice: isDelivery?.consumableSalePrice || 0,
                      purchasePrice: isDelivery?.consumableSalePrice || 0,
                    },
                  }
                : {
                    inventorySync: {
                      availableQuantity: 1,
                      mrp: isDelivery?.salePrice || 0,
                      sellingPrice: isDelivery?.salePrice || 0,
                      purchasePrice: isDelivery?.salePrice || 0,
                    },
                  }),
              // sellingUnits: [
              //   {
              //     quantity: '1',
              //     unitOfMeasure: 'nos',
              //   },
              // ],
              // weightsAndMeasures: [
              //   {
              //     measurementUnit: 'nos',
              //     netWeight: '1',
              //     grossWeight: '1',
              //     netContent: '1',
              //     metadata: {
              //       type: 'PRIMARY',
              //     },
              //   },
              // ],
              needsWeighingScaleIntegration: productDescription?.needsWeighingScaleIntegration || false,
              images: transformImageListToObject(item?.imageList || []),
              tags: [additionalAttributes?.seoTags] || [],
              // metadata: {
              //   additionalProp1: 'string',
              //   additionalProp2: 'string',
              //   additionalProp3: 'string',
              // },
              createdBy: userUidx,
              createdByName: userName,
              updatedBy: userUidx,
              updatedByName: userName,
              // created: new Date().toISOString(),
              // updated: new Date().toISOString(),
              isActive: true,
              isDeleted: false,
              // deletedBy: 'string',
              // deletedByName: 'string',
              // deletedAt: 0,
            };
          }),

          createdBy: userUidx,
          createdByName: userName,
          updatedBy: userUidx,
          updatedByName: userName,
        },
        sourceId: orgId,
        sourceLocationId: locId,
      };
      const updateProduct = await updateProductDetailsNew(payload);
      if (
        updateProduct?.data?.status === 'ERROR' ||
        updateProduct?.data?.status === 'error' ||
        updateProduct?.data?.data?.es > 0
      ) {
        showSnackbar(
          updateProduct?.data?.message ||
            updateProduct?.data?.data?.message ||
            'Something went wrong while updating product',
          'error',
        );
        setLoader(false);
        return;
      }
      setLoader(false);
      navigate(-1);
    } catch (error) {
      setLoader(false);
      showSnackbar('Something went wrong while updating product', 'error');
    }
  };

  useEffect(() => {
    if (id) {
      handleGetProductDetails();
    }
  }, [id]);

  return (
    <div>
      <DashboardLayout>
        <DashboardNavbar prevLink={true} />
        {editLoader && (
          <div className="overlay-spinner">
            <div className="spinner-container">
              <Spinner size="30px" />
            </div>
          </div>
        )}
        <Box p={1} className={editLoader ? 'content-blur-spin' : ''}>
          <SoftBox p={1} className="common-display-flex">
            <SoftTypography fontWeight="bold" fontSize="1.1rem">
              {id ? 'Edit Product' : 'Add new Product'}
            </SoftTypography>{' '}
          </SoftBox>

          <SoftBox className="main-product-description">
            <ProductDescription productDescription={productDescription} setProductDescription={setProductDescription} />
          </SoftBox>
          <SoftBox mt={2} className="main-product-description">
            <ProductRestaurantVariant
              id={id}
              productDescription={productDescription}
              variantData={variantData}
              setVariantData={setVariantData}
            />
          </SoftBox>

          <SoftBox mt={2} className="main-product-description">
            <AdditionalRestaurantDetails
              additionalAttributes={additionalAttributes}
              setAdditionalAttributes={setAdditionalAttributes}
            />
          </SoftBox>

          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}></Grid>
            <Grid item xs={12} md={4}>
              {' '}
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <SoftButton size="small" color="info" variant="outlined">
                  <AutoAwesomeIcon color="#367df3" style={{ marginRight: '5px' }} /> Use Autogenerator
                </SoftButton>
                <Tooltip title="Auto fill all the product details" placement="right">
                  <InfoOutlinedIcon style={{ marginLeft: '5px', color: '#367df3' }} />
                </Tooltip>
              </div>
            </Grid>
            <Grid item xs={12} md={4}>
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'row-reverse', gap: '20px' }}>
                {loader ? (
                  <div style={{ margin: '0px 15px', display: 'flex' }}>
                    <Spinner size={'1.2rem'} />
                  </div>
                ) : (
                  <SoftButton
                    size="small"
                    color="info"
                    onClick={() => (id ? handleUpdateProducts() : handleCreateProduct('CREATE'))}
                  >
                    {id ? 'Update' : 'Save'}
                  </SoftButton>
                )}

                {/* <SoftButton size="small" color="error" onClick={() => handleCreateProduct('DELETE')}>
                Delete
              </SoftButton> */}
                <SoftButton size="small" onClick={() => navigate(-1)}>
                  Cancel
                </SoftButton>
              </div>
            </Grid>
          </Grid>
        </Box>
      </DashboardLayout>
    </div>
  );
};

export default RestauarantProductCreation;
