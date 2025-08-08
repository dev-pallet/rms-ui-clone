import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../../examples/Navbars/DashboardNavbar';
import './create-product.css';
import { Box, Grid, Tooltip } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SoftBox from '../../../../../../components/SoftBox';
import AddProductDescription from './components/product-description';
import ProductAddtionalAttributes from './components/additional-attributes';
import AddProductVariant from './components/product-variant';
import CustomizedDataProducts from './components/customized-data';
import SoftButton from '../../../../../../components/SoftButton';
import SoftTypography from '../../../../../../components/SoftTypography';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import {
  createCmsProduct,
  createInventoryProducts,
  editCmsProduct,
  getProductDetailsbyId,
} from '../../../../../../config/Services';
import { useSnackbar } from '../../../../../../hooks/SnackbarProvider';
import { useDispatch } from 'react-redux';
import { setProductDetails } from '../../../../../../datamanagement/productDetailsSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import Spinner from '../../../../../../components/Spinner';

const NewCreateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const dispatch = useDispatch();
  const uidx = JSON.parse(localStorage.getItem('user_details')).uidx;
  const userName = localStorage.getItem('user_name');
  const [loader, setLoader] = useState(false);
  const isEditable = location.pathname !== '/products/all-products/add-products';

  const showSnackBar = useSnackbar();
  const [descriptionData, setDescriptionData] = useState({});
  const [variantData, setVariantData] = useState([]);
  const [attributeData, setAttributeData] = useState({});
  const [customData, setCustomData] = useState({});
  const [editLoader, setEditLoader] = useState(false);
  const [productData, setProductData] = useState();

  useEffect(() => {
    const isEditable = location.pathname !== '/products/all-products/add-products';
    if (isEditable) {
      setEditLoader(true);
      getProductDetailsbyId(id, locId)
        .then((res) => {
          setEditLoader(false);
          setProductData(res?.data?.data?.data);
          dispatch(setProductDetails(res?.data?.data?.data || {}));
        })
        .catch(() => {
          setEditLoader(false);
        });
    }
  }, []);

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

  const validatePayload = (payload) => {
    const { productName, product } = payload || {};
    if (!productName) {
      showSnackBar('Add Product title', 'error');
      return false;
    }

    if (!product?.appCategories?.categoryLevel1?.[0]) {
      showSnackBar('Select Category', 'error');
      return false;
    }
    if (!product?.appCategories?.categoryLevel2?.[0]) {
      showSnackBar('Select Category level 2', 'error');
      return false;
    }
    if (!product?.appCategories?.categoryLevel3?.[0]) {
      showSnackBar('Select Category level 3', 'error');
      return false;
    }
    if (!product?.companyDetail?.brand) {
      showSnackBar('Select Brand', 'error');
      return false;
    }
    // if (!product?.companyDetail?.subBrand) {
    //   showSnackBar('Select sub-brand', 'error');
    //   return false;
    // }
    if (!product?.companyDetail?.manufacturer) {
      showSnackBar('Select Manufacturer', 'error');
      return false;
    }
    if (!product?.variants?.some((variant) => variant?.needsWeighingScaleIntegration || variant?.barcodes?.[0])) {
      showSnackBar('Add variant to Create product', 'error');
      return false;
    }

    if (!product?.variants?.some((variant) => variant?.weightUnit)) {
      showSnackBar('Add UOM for variant to Create product', 'error');
      return false;
    }
    if (!product?.variants?.some((variant) => variant?.weight)) {
      showSnackBar('Add specification for variant to Create product', 'error');
      return false;
    }
    if (!product?.variants?.some((variant) => variant?.mrpData[0]?.mrp)) {
      showSnackBar('Add Mrp for variant to Create product', 'error');
      return false;
    }
    if (!product?.variants?.some((variant) => variant?.salesChannels?.[0])) {
      showSnackBar('Add sales channel for variant to Create product', 'error');
      return false;
    }

    return true;
  };

  const handleCreateProduct = (isDeleted) => {
    setLoader(true);
    const addProductsPage = location.pathname === '/products/all-products/add-products';
    let payload = {
      productName: descriptionData?.productTitle || '',
      action: 'product_create',

      logType: 'Create',
      logTime: new Date().toISOString(),
      loggedBy: uidx,
      loggedByName: userName,
      product: {
        // id: 'string',
        name: descriptionData?.productTitle || '',
        title: descriptionData?.productTitle || '',
        shortDescription: descriptionData?.description,
        description: descriptionData?.description,

        appCategories: {
          categoryLevel1: descriptionData?.catLevel1?.label ? [descriptionData.catLevel1.label] : [],
          categoryLevel1Id: descriptionData?.catLevel1?.value ? [descriptionData.catLevel1.value] : [],
          categoryLevel2: descriptionData?.catLevel2?.label ? [descriptionData.catLevel2.label] : [],
          categoryLevel2Id: descriptionData?.catLevel2?.value ? [descriptionData.catLevel2.value] : [],
          categoryLevel3: descriptionData?.catLevel3?.label ? [descriptionData.catLevel3.label] : [],
          categoryLevel3Id: descriptionData?.catLevel3?.value ? [descriptionData.catLevel3.value] : [],
        },
        posCategories: {
          categoryLevel1: customData?.catLevel1?.label ? [customData.catLevel1.label] : [],
          categoryLevel1Id: customData?.catLevel1?.value ? [customData.catLevel1.value] : [],
          categoryLevel2: customData?.catLevel2?.label ? [customData.catLevel2.label] : [],
          categoryLevel2Id: customData?.catLevel2?.value ? [customData.catLevel2.value] : [],
          categoryLevel3: customData?.catLevel3?.label ? [customData.catLevel3.label] : [],
          categoryLevel3Id: customData?.catLevel3?.value ? [customData.catLevel3.value] : [],
          departmentId: customData?.department?.value ? [customData.department.value] : [],
          departmentCode: customData?.department?.code ? [customData.department.code] : [],
          departmentName: customData?.department?.label ? [customData.department.label] : [],
          subDepartmentId: customData?.subDepartment?.value ? [customData.subDepartment.value] : [],
          subDepartmentCode: customData?.subDepartment?.code ? [customData.subDepartment.code] : [],
          subDepartmentName: customData?.subDepartment?.label ? [customData.subDepartment.label] : [],
          lobId: customData?.lineOfBusiness?.value ? [customData.lineOfBusiness.value] : [],
          lobCode: customData?.lineOfBusiness?.code ? [customData.lineOfBusiness.code] : [],
          lobName: customData?.lineOfBusiness?.label ? [customData.lineOfBusiness.label] : [],
        },
        companyDetail: {
          brand: descriptionData?.brand?.label,
          brandCode: descriptionData?.brand?.brandCode,
          brandId: descriptionData?.brand?.value,
          subBrand: descriptionData?.subBrand?.label,
          subBrandId: descriptionData?.subBrand?.value,
          subBrandCode: descriptionData?.subBrand?.code,
          manufacturer: descriptionData?.manufacturer?.label,

          manufacturerId: descriptionData?.manufacturer?.value,
        },
        marketingCompanies: customData?.companyName?.map((item, index) => ({
          name: customData?.companyName?.[index]?.label || '',
          id: customData?.companyName?.[index]?.value || '',

          type: customData?.companyType?.[index]?.label || '',
          isPreferred: customData?.preferredVendor?.[index] || false,
          deliveryLocations: [customData?.deliveryArea?.[index]?.value || ''],
        })),

        // needsWeighingScaleIntegration: descriptionData?.weighingScaleIntegration,

        isTaxExempted: descriptionData?.exempeted,
        isMrpRestricted: descriptionData?.mrpRestrictions,
        // unitOfMeasure: descriptionData?.weighingScaleUnit?.value,
        eligibleForExport: descriptionData?.exportEligible,

        isRawMaterial: descriptionData?.isRawMaterial,
        returnable: attributeData?.isReturnable === 'Yes',
        minutesToReturnBack: attributeData?.returnWith,

        tags: [attributeData?.seoTags || ''],

        // dimensions: {
        //   measurementUnit: descriptionData?.weighingScaleUnit?.value,
        // },

        taxReference: {
          taxName: 'GST & CESS',
          taxType: 'GST',
          taxCategory: 'GST',
          taxRate: descriptionData?.igst || 0,

          isDefault: true,
          metadata: {
            hsnCode: descriptionData?.hsn,
            cess: descriptionData?.cess,
          },
        },
        attributes: {
          gender: attributeData?.gender || 'NA',
          foodType: attributeData?.foodType || 'NA',
          regulatoryData: {
            organic: attributeData?.isOrganic,
            organicCertificate: attributeData?.certificationBody || '',
          },
        },
        storeSpecificData: {
          storeId: orgId,
          storeLocationId: locId,
          storeName: orgId,
          storeLocationName: locId,
        },

        variants: variantData?.map((item) => ({
          ...(!addProductsPage && { variantId: item?.variantId }),
          name: item?.weighingScale === true ? descriptionData?.productTitle : item?.name,
          barcodes: item?.barcode ? [item?.barcode] : [],
          sku: item?.barcode,
          weight: item?.specification,
          weightUnit: item?.uom === 'Kilograms' ? 'Kg' : item?.uom,
          packType: item?.packageType,
          isRawMaterial: true,
          taxStatus: item?.taxStatus || 'TAXABLE',

          minB2COrderQuantity: item?.b2cMinQty || item?.appMinQty || 1,
          maxB2COrderQuantity: item?.b2cMaxQty || item?.appMaxQty,

          minB2BOrderQuantity: item?.b2bMinQty || item?.appMinQty || 1,
          maxB2BOrderQuantity: item?.b2bMaxQty || item?.appMaxQty,

          minPosOrderQuantity: item?.storeMinQty || 1,
          maxPosOrderQuantity: item?.storeMaxQty,

          images: transformImageListToObject(item?.imageList || []),
          needsWeighingScaleIntegration: item?.weighingScale,
          mrpData: [
            {
              currencyCode: 'INR',
              currencySymbol: '₹',
              mrp: item?.mrp,
              country: 'India',
            },
          ],
          sellingUnits: [
            {
              quantity: item?.specification,
              unitOfMeasure: item?.uom === 'Kilograms' ? 'Kg' : item?.uom,
            },
          ],
          inventorySync: item?.inventorySync || {},
          weightsAndMeasures: [
            {
              measurementUnit: item?.uom,
              netWeight: item?.specification,
              grossWeight: item?.specification,
              netContent: item?.specification,
              metadata: {
                type: 'PRIMARY',
              },
            },
            ...(item?.secondaryWeighingUnits
              ? item?.secondaryWeighingUnits?.map((secondaryItem) => {
                  return {
                    measurementUnit: secondaryItem?.option?.value,
                    netWeight: secondaryItem?.unit,
                    grossWeight: secondaryItem?.unit,
                    netContent: secondaryItem?.unit,
                    metadata: {
                      type: 'SECONDARY',
                    },
                  };
                })
              : []
            ).filter(Boolean),
          ],
          salesChannels: item?.salesChannel ? item?.salesChannel || [] : [],
          cartons: [
            {
              value: item?.cartonData,

              type: 'BOX',
            },
          ],
          listedOn: [],
          storeReference: item?.referenceID ? [item?.referenceID] : [],
          tags: attributeData?.seoTags ? [attributeData?.seoTags] : [],
          createdBy: uidx,
          createdByName: userName,
          isActive: item.isActive,
          ...(isDeleted === 'DELETE' && {
            isDeleted: true,
            deletedBy: uidx,
            deletedByName: userName,
          }),
        })),
        nativeLanguages: [
          {
            language: attributeData?.localLanguage?.value || '',

            name: attributeData?.localProductTitle,
          },
        ],

        createdBy: uidx,
        createdByName: userName,
        updatedBy: uidx,
        updatedByName: userName,
      },
      sourceId: orgId,
      sourceLocationId: locId,
    };
    if (isDeleted === 'DELETE') {
      payload.product.isDeleted = true;
      payload.product.deletedBy = uidx;
      payload.product.deletedByName = userName;
    }

    if (descriptionData?.metadata) {
      Object.keys(descriptionData.metadata).forEach((key) => {
        payload.product.taxReference.metadata[key.toLowerCase()] = descriptionData.metadata[key];
      });
    }

    const isValidated = validatePayload(payload);
    if (!isValidated) {
      setLoader(false);
      return;
    }
    if (addProductsPage) {
      createCmsProduct(payload)
        .then((res) => {
          if (res?.data?.data?.es === 1) {
            showSnackBar(res?.data?.data?.message, 'error');
            navigate(-1);
          } else {
            const resData = res?.data?.data?.data;
            const inventoryPayload = res?.data?.data?.data?.variants?.map((item, id) => ({
              productId: resData?.id,
              orgId: orgId,
              locationId: locId,
              gtin: item?.barcodes[0],
              category: descriptionData?.catLevel1?.label,
              subCategory: descriptionData?.catLevel2?.label,
              level2Category: descriptionData?.catLevel3?.label,
              brand: descriptionData?.brand?.label,
              specification: item?.weight,
              sellingUnit: item?.weightUnit,
              restaurantBatchEnabled: false,
              manufacturer: descriptionData?.manufacturer?.label,
              packagingType: item?.needsWeighingScaleIntegration ? 'weighingScale' : 'standard',
              createdBy: userName,
              sourceId: null,
              sourceName: null,
            }));
            createInventoryProducts(inventoryPayload)
              .then((res) => {
                if (res?.data?.status === 'ERROR') {
                  showSnackBar(res?.data?.message, 'error');
                  return;
                } else if (res?.data?.data?.es === 1) {
                  showSnackBar(res?.data?.data?.message, 'error');
                  return;
                } else {
                  showSnackBar('Product Created Succesfully', 'success');
                  navigate('/products/all-products');
                }
                setLoader(false);
              })
              .catch((err) => {
                setLoader(false);
                showSnackBar('There was an error creating the product', 'error');
              });
          }
        })
        .catch((err) => {
          showSnackBar('Fill all details', 'error');
          setLoader(false);
        });
    } else {
      payload.productId = productData?.productId;
      payload.product.productId = productData?.productId;
      payload.product.id = id;
      payload.action = 'UPDATE';
      payload.status = 'APPROVED';

      editCmsProduct(payload)
        .then((res) => {
          setLoader(false);
          if (res?.data?.status === 'ERROR' || res?.data?.data?.es > 0) {
            showSnackBar(
              res?.data?.message || res?.data?.data?.message || 'There was an error updating the product',
              'error',
            );
            return;
          } else {
            showSnackBar('Product Updated Succesfully', 'success');
            navigate('/products/all-products');
          }
        })
        .catch((err) => {
          showSnackBar('Something went wrong , try again', 'error');
          setLoader(false);
        });
    }
  };

  const handleDataFromDescription = (data) => {
    setDescriptionData(data);
  };
  const handleDataFromVarient = (data) => {
    setVariantData(data);
  };
  const handleDataFromAttributes = (data) => {
    setAttributeData(data);
  };
  const handleDataFromCustom = (data) => {
    setCustomData(data);
  };

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
            {isEditable ? 'Edit Product' : 'Add new Product'}
          </SoftTypography>{' '}
        </SoftBox>
        <SoftBox className="main-product-description">
          <AddProductDescription
            onDataChange={handleDataFromDescription}
            isEditable={isEditable}
            editLoader={editLoader}
            setEditLoader={setEditLoader}
          />
        </SoftBox>
        <SoftBox mt={2} className="main-product-description">
          <AddProductVariant
            onDataChange={handleDataFromVarient}
            isEditable={isEditable}
            descriptionData={descriptionData}
          />
        </SoftBox>
        <SoftBox mt={2} className="main-product-description">
          <ProductAddtionalAttributes onDataChange={handleDataFromAttributes} isEditable={isEditable} />
        </SoftBox>
        <SoftBox mt={2} className="main-product-description">
          <CustomizedDataProducts onDataChange={handleDataFromCustom} isEditable={isEditable} />
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
                <SoftButton size="small" color="info" onClick={handleCreateProduct}>
                  Save
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
  );
};

export default NewCreateProduct;
