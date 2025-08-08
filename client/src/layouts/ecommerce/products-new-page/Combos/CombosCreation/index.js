import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../examples/Navbars/DashboardNavbar';
import { Box, Grid, Tooltip } from '@mui/material';
import Spinner from '../../../../../components/Spinner';
import SoftBox from '../../../../../components/SoftBox';
import SoftTypography from '../../../../../components/SoftTypography';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import ComboBasicInformation from './components/ComboBasicInformation';
import ProductsAdd from './components/ProductsAdd';
import SoftButton from '../../../../../components/SoftButton';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import AdditionalRestaurantDetails from '../../RestaurantProductCreation/components/AdditionalRestaurantDetails';
import { createRestaurantProduct, getProductDetailsRestaurant } from '../../../../../config/Services';

const CombosCreation = () => {
  const [editLoader, setEditLoader] = useState(false);
  const location = useLocation();
  let isEditable = location.pathname.includes('edit');
  const [loader, setLoader] = useState(false);
  const { id } = useParams();

  const navigate = useNavigate();

  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const userDetails = localStorage.getItem('user_details')
    ? JSON.parse(localStorage.getItem('user_details') || {})
    : {};
  const userName = userDetails?.firstName + ' ' + userDetails?.secondName;
  const userUidx = userDetails?.uidx;
  const locName = localStorage.getItem('locName') || '';
  const orgName = localStorage.getItem('orgName') || '';
  const [barcodeNeed, setBarcodeNeed] = useState(false);

  const [productVariantArr, setProductVariantArr] = useState([{ imageList: [] }]);

  const [productDescription, setProductDescription] = useState({
    productName: '',
    description: '',
    image: '',
    category: {},
    subCategory: {},
    barcode: '',
    shortCode: '',
    salesChannel: [],
    comboValidityStartTime: '',
    comboValidityEndTime: '',
    comboValidityStartDate: '',
    comboValidityEndDate: '',
    totalCombos: '',
    hsnCode: '',
    gst: '',
    cess: '',
    taxExempted: false,
    mrpRestrictions: false,
  });

  const [allProducts, setAllProducts] = useState([
    {
      id: 1,
      title: '',
      uom: '',
      salePrice: '',
      quantity: '',
      offerPrice: '',
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

  const [totalValue, setTotalValue] = useState({
    totalSalePrice: 0,
    totalOfferPrice: 0,
    totalQuantity: 0,
  });

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

  // this function is used to handle validation of the payload before creating or updating the product
  const handleValidatePayload = () => {
    const validations = [
      {
        condition: !productDescription?.productName?.trim(),
        message: 'Product Title is required',
      },
      {
        condition: !productDescription?.category?.label,
        message: 'Menu is required',
      },
      {
        condition: !allProducts?.every((variant) => variant?.title?.label?.trim()),
        message: 'Variant Title is required for all products',
      },
      {
        condition: !allProducts?.every((variant) => variant?.uom),
        message: 'UOM is required for all products',
      },
      {
        condition: !allProducts?.every((variant) => variant?.quantity),
        message: 'UOM is required for all products',
      },
      {
        condition: !allProducts?.every((variant) => variant?.offerPrice),
        message: 'UOM is required for all products',
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

  const handleCreateProduct = async () => {
    if (!handleValidatePayload()) {
      return;
    }
    try {
      setLoader(true);
      const startDate = new Date(productDescription?.comboValidityStartDate);
      const endDate = new Date(productDescription?.comboValidityEndDate);
      let payload = {
        productName: productDescription?.productName || '',
        action: 'CREATE_BUNDLE',
        logType: 'ProductLog',
        logTime: new Date().toISOString(),
        loggedBy: userName,
        loggedByName: userName,
        sourceName: locName,
        sourceType: 'Restaurant',
        product: {
          name: productDescription?.productName || '',
          title: productDescription?.productName || '',
          description: productDescription?.description || '',
          appCategories: {
            categoryLevel1: [productDescription?.category?.label],
            categoryLevel1Id: [productDescription?.category?.value],
            categoryLevel2: [productDescription?.subCategory?.label],
            categoryLevel2Id: [productDescription?.subCategory?.value],
          },
          posCategories: {
            categoryLevel1: [productDescription?.category?.label],
            categoryLevel1Id: [productDescription?.category?.value],
            categoryLevel2: [productDescription?.subCategory?.label],
            categoryLevel2Id: [productDescription?.subCategory?.value],
          },
          isBundle: true,
          bundleBarcode: productDescription?.barcode || '',

          tags: additionalAttributes?.seoTags ? [additionalAttributes?.seoTags] : [],
          allergenItems: additionalAttributes?.allergen || [],
          spiceLevels: additionalAttributes?.spiceLevel ? [additionalAttributes?.spiceLevel] : [],
          itemAvailableStartTime: productDescription?.comboValidityStartTime || '',
          itemAvailableEndTime: productDescription?.comboValidityEndTime || '',
          bundleValidity:
            startDate && endDate && !isNaN(startDate) && !isNaN(endDate)
              ? Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))
              : '',
          bundlePrice: totalValue?.totalOfferPrice || 0,
          isTaxExempted: productDescription?.taxExempted || false,
          isMrpRestricted: productDescription?.mrpRestrictions || false,
          returnable: additionalAttributes?.returnableItem || false,
          returnWindowInDays: additionalAttributes?.returnWithin || '',
          taxReference: {
            taxName: 'GST & CESS',
            taxType: 'GST',
            taxCategory: 'GST',
            taxRate: productDescription?.gst || 0,
            isDefault: true,
            metadata: {
              hsnCode: productDescription?.hsnCode || '',
              cess: productDescription?.cess || 0,
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
          imageUrls: transformImageListToObject(productVariantArr?.[0]?.imageList || []),
          variants: allProducts?.map((item) => {
            return {
              name: item?.title?.label || '',
              barcodes: item?.title?.other?.barcodes ? item?.title?.other?.barcodes : [],
              shortCode: item?.title?.other?.shortCode || '',
              weight: item?.title?.other?.weight || '',
              weightUnit: item?.title?.other?.weightUnit || '',
              // recipeRequest: {
              //   name: item?.title?.other?.name || '',
              //   // description: 'Khao aur kho jao',
              //   ingredients: item?.recipeArr?.some((recipeItem) => recipeItem?.recipeTitle)
              //     ? item?.recipeArr?.map((recipeItem) => ({
              //         name: recipeItem?.recipeTitle?.label || '',
              //         unit: recipeItem?.uom?.label || '',
              //         specification: recipeItem?.specification || '',
              //         cost: recipeItem?.targetCost || 0,
              //         addToFoodCost: recipeItem?.addToFoodCost || false,
              //         variantId: recipeItem?.recipeTitle?.other?.variantId || '',
              //         productId: recipeItem?.recipeTitle?.productId || '',
              //       }))
              //     : [],
              //   instructions: item?.cookingInstruction?.some((recipeItem) => recipeItem?.instruction)
              //     ? item?.cookingInstruction?.map((cook, idx) => ({
              //         instruction: cook?.instruction || '',
              //         priority: idx + 1 || 0,
              //         description: cook?.instruction || '',
              //         totalTime: 0,
              //       }))
              //     : [],
              //   // servings: 1,
              //   // preparationTime: 0,
              //   sourceId: orgId,
              //   sourceLocationId: locId,
              // },
              choosePrepStation: {
                id: item?.title?.other?.choosePrepStation?.id,
                displayName: item?.title?.other?.choosePrepStation?.displayName,
              },
              addOn: item?.title?.other?.addOn?.some((recipeItem) => recipeItem?.title)
                ? item?.title?.other?.addOn
                : [],

              salesChannels: productDescription?.salesChannel,
              minB2COrderQuantity: 1,
              minB2BOrderQuantity: 1,
              minPosOrderQuantity: 1,
              choosePrepStation: item?.title?.other?.choosePrepStation,
              sendToKds: item?.title?.other?.sendToKds,
              taxStatus: item?.title?.other.taxStatus,

              inventorySync: {
                productId: item?.title?.productId || '',
                variantId: item?.title?.value || '',
                gtin: item?.title?.other?.barcodes[0] || '',
                sourceId: orgId,
                sourceLocationId: locId,
                sourceType: 'RETAIL',
                mrp: item?.salePrice,
                sellingPrice: item?.salePrice,
                purchasePrice: item?.salePrice,
                offerPrice: item?.offerPrice,
                expiry: 0,
                bundleQuantity: item?.quantity,
              },

              tags: [additionalAttributes?.seoTags] || [],
              createdBy: userUidx,
              createdByName: userName,
              updatedBy: userUidx,
              updatedByName: userName,
              isActive: true,
              isDeleted: false,
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
      navigate(-1);
    } catch (error) {
      setLoader(false);
    }
  };

  const handleGetProductDetails = async () => {
    setEditLoader(true);
    try {
      const response = await getProductDetailsRestaurant(id, locId);
      const variantIds = response?.data?.data?.data?.variants?.map((item) => item?.variantId) || [];

      const res = response?.data?.data?.data || {};
      // const currentRecipe = recipeRes?.find((item) => item?.productId === id) || {};

      if (res?.bundleBarcode) {
        setBarcodeNeed(true);
      }

      setProductDescription((prev) => ({
        ...prev,
        id: res?.id,
        productName: res?.name,
        description: res?.description,
        image: Object.values(res?.imageUrls || {}),
        category: {
          label: res?.posCategories?.categoryLevel1[0] || '',
          value: res?.posCategories?.categoryLevel1Id[0] || '',
        },
        subCategory: {
          label: res?.posCategories?.categoryLevel2[0] || '',
          value: res?.posCategories?.categoryLevel2Id[0] || '',
        },
        barcode: res?.bundleBarcode,
        shortCode: '',
        salesChannel: res?.variants[0]?.salesChannels,
        comboValidityStartTime: res?.itemAvailableStartTime,
        comboValidityEndTime: res?.itemAvailableEndTime,
        comboValidityStartDate: '',
        comboValidityEndDate: '',
        totalCombos: '',
        hsnCode: res?.taxReference?.metadata?.hsnCode || '',
        gst: res?.taxReference?.taxRate,
        cess: res?.taxReference?.metadata?.cess || '',
        taxExempted: res?.isTaxExempted,
        mrpRestrictions: res?.isMrpRestricted,
      }));

      const comboProducts = res?.variants?.map((item) => ({
        id: item?.variantId,
        title: {
          label: item?.name,
          value: item?.variantId,
          productId: res?.productId,
          productData: res,
          other: item,
        },
        uom: `${item?.weight} ${item?.weightUnit}`,
        salePrice: item?.inventorySync?.mrp,
        quantity: '',
        offerPrice: item?.inventorySync?.offerPrice,
      }));

      setAllProducts(comboProducts);

      const totalSalePrice = comboProducts?.reduce((sum, product) => {
        const price = parseFloat(product?.salePrice || 0);
        const qty = parseFloat(product?.quantity || 1);
        return sum + price * qty;
      }, 0);

      setTotalValue({
        totalSalePrice: totalSalePrice,
        totalOfferPrice: res?.bundlePrice,
        totalQuantity: 0,
      });

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

  useEffect(() => {
    if (id) {
      handleGetProductDetails();
    }
  }, [id]);

  return (
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
            {isEditable ? 'Edit Combo' : 'Add new Combo'}
          </SoftTypography>{' '}
        </SoftBox>

        <SoftBox className="main-product-description">
          <ComboBasicInformation
            productDescription={productDescription}
            setProductDescription={setProductDescription}
            productVariantArr={productVariantArr}
            setProductVariantArr={setProductVariantArr}
            barcodeNeed={barcodeNeed}
            setBarcodeNeed={setBarcodeNeed}
          />
        </SoftBox>

        <SoftBox mt={2} className="main-product-description">
          <ProductsAdd
            allProducts={allProducts}
            setAllProducts={setAllProducts}
            totalValue={totalValue}
            setTotalValue={setTotalValue}
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
                <SoftButton size="small" color="info" onClick={() => handleCreateProduct('CREATE')}>
                  Save
                </SoftButton>
              )}

              <SoftButton size="small" onClick={() => navigate(-1)}>
                Cancel
              </SoftButton>
            </div>
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  );
};

export default CombosCreation;
