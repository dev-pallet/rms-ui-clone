import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import SoftTypography from '../../../../components/SoftTypography';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  FormControlLabel,
  Grid,
  InputLabel,
  Modal,
  Radio,
  RadioGroup,
  TextField,
  Tooltip,
  Typography,
  createFilterOptions,
} from '@mui/material';
import SoftInput from '../../../../components/SoftInput';
import SoftButton from '../../../../components/SoftButton';
import SoftSelect from '../../../../components/SoftSelect';
import WarningOutlinedIcon from '@mui/icons-material/WarningOutlined';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

import SoftBox from '../../../../components/SoftBox';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import '../ProductPage.css';
import {
  consumeInventoryBatchData,
  createCmsProduct,
  editCmsProduct,
  fetchOrganisations,
  generateBarcode,
  getAllLevel1Category,
  getAllLevel2Category,
  getAllMainCategory,
  getGlobalProducts,
  getInventoryBatchByGtin,
  getProductDetailsbyId,
} from '../../../../config/Services';
import { debounce } from 'lodash';
import { productIdByBarcode, textFormatter } from '../../Common/CommonFunction';
import { useNavigate, useParams } from 'react-router-dom';
import ProductVarientImagesUpload from '../new-product-screen/components/create-product/components/product-variant/varientImages';
import ComingSoonAlert from '../../products-new-page/ComingSoonAlert';
import BatchSelectionModal from './components/BatchSelectionModal';
import { state } from '../../softselect-Data/state';
import { useSnackbar } from '../../../../hooks/SnackbarProvider';
import CloseIcon from '@mui/icons-material/Close';
import SoftAsyncPaginate from '../../../../components/SoftSelect/SoftAsyncPaginate';
import Spinner from '../../../../components/Spinner';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  maxHeight: '450px',
  bgcolor: 'background.paper',
  border: '1px solid gray',
  borderRadius: '10px',
  boxShadow: 14,
  p: 4,
};

const cardContainerStyle = {
  overflowY: 'auto',
  maxHeight: '220px',
};
const approvalStatusOptions = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'REJECTED', label: 'Rejected' },
];

const AddBundleProduct = () => {
  const filter = createFilterOptions();
  const showSnackbar = useSnackbar();
  const { bundleId } = useParams();
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const isBundle = location.pathname !== '/products/all-products/add-products/bundle';
  const [selectedBatch, setSelectedBatch] = useState([]);
  const uidx = JSON.parse(localStorage.getItem('user_details')).uidx;
  const userName = localStorage.getItem('user_name');
  const [productCount, setproductCount] = useState(1);
  const [locationOptions, setLocationOptions] = useState([]);
  const [mainCatArr, setMainCatArr] = useState([]);
  const [optArray, setOptArray] = useState([]);
  const [nameOptions, setNameOptions] = useState([]);
  const [bundleProductCount, setBundleProductCount] = useState(1);
  const [productVariantArr, setProductVariantArr] = useState([{ imageList: [] }]);
  const [batchData, setBatchData] = useState([]);
  const [displayLowStockMsg, setDisplayLowStockMsg] = useState(false);
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    productTitle: '',
    description: '',
    barcode: '',
    variantData: [],
    manBarcode: '',
    salesChannel: [],
    batchSelection: 'SELECT_BATCH',
  });

  const [totalMRP, setTotalMRP] = useState(0);
  const [totalPurchaseCost, setTotalPurchaseCost] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [bundleSalePrice, setBundleSalePrice] = useState(0);

  useEffect(() => {
    // Extract data from formData
    const mrpData = formData?.mrp || {};
    const purchaseData = formData?.purchasePrice || {};
    const quantityData = formData?.quantity?.map((q) => parseInt(q) || 0) || [];
    const offerPriceData = formData?.offerPrice?.map((p) => parseInt(p) || 0) || [];

    // Calculate totalMRP (mrp * quantity)
    const totalMRPWithQuantity = Object.keys(mrpData)?.reduce((total, key) => {
      const mrp = mrpData[key] || 0;
      const quantity = quantityData[key] || 0;
      return total + mrp * quantity;
    }, 0);

    // Calculate totalPurchaseCost (purchasePrice * quantity)
    const totalPurchaseWithQuantity = Object.keys(purchaseData)?.reduce((total, key) => {
      const purchasePrice = purchaseData[key] || 0;
      const quantity = quantityData[key] || 0;
      return total + purchasePrice * quantity;
    }, 0);

    // Calculate total quantity
    const totalQuantityValue = quantityData?.reduce((acc, qty) => acc + qty, 0);

    // Calculate total offer price
    const bundleSalePriceValue = offerPriceData?.reduce((acc, price) => acc + price, 0);

    // Update state
    setTotalMRP(totalMRPWithQuantity);
    setTotalPurchaseCost(totalPurchaseWithQuantity);
    setTotalQuantity(totalQuantityValue);
    setBundleSalePrice(bundleSalePriceValue);
  }, [formData]);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [openImageModal, setOpenImageModal] = useState(false);
  const handleCloseImageModal = () => {
    setOpenImageModal(false);
  };

  const handleAddPhoto = (index) => {
    setOpenImageModal(true);
  };

  useEffect(() => {
    fetchOrganisations()
      .then((res) => {
        const retailData = res?.data?.data?.retails;
        const matchedRetail = retailData?.find((retail) => retail?.retailId === orgId);
        const branches = matchedRetail?.branches?.map((item) => ({ value: item?.branchId, label: item?.displayName }));
        setLocationOptions(branches || []);
      })
      .catch((err) => {});
  }, []);

  const updateFormData = (key, value) => {
    setFormData((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  // useEffect(() => {
  //   let payload = {
  //     page: 1,
  //     pageSize: 1000,
  //     type: ['APP'],
  //     sourceId: [orgId],
  //     sourceLocationId: [locId],
  //   };

  //   getAllMainCategory(payload).then((response) => {
  //     let cat = [];
  //     response?.data?.data?.results?.map((e) => {
  //       if (e !== undefined) cat.push({ value: e.mainCategoryId, label: e.categoryName });
  //     });
  //     setMainCatArr(cat);
  //   });
  // }, []);

  const loadMainCategoryOptions = async (searchQuery, loadedOptions, additional) => {
    const page = additional.page || 1;

    let payload = {
      page,
      pageSize: 50, // Adjust this as needed
      type: ['APP'],
      sourceId: [orgId],
      sourceLocationId: [locId],
      active: [true],
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

  const handleMainCatChange = (option) => {
    updateFormData('catLevel1', option);
    let payload = {
      page: 1,
      pageSize: 100,
      mainCategoryId: [option?.value],
      sourceId: [orgId],
      sourceLocationId: [locId],
      active: [true],
    };

    // if (isGen) return;
    if (option)
      getAllLevel1Category(payload).then((response) => {
        let cat = [];
        response?.data?.data?.results?.map((e) => {
          cat.push({ value: e?.level1Id, label: e?.categoryName });
        });

        updateFormData('catLeve2Arr', cat);
      });
  };

  const handleLevel2CatChange = (option) => {
    updateFormData('catLevel2', option);
    let payload = {
      page: 1,
      pageSize: 100,
      level1Id: [option?.value],
      sourceId: [orgId],
      sourceLocationId: [locId],
      active: [true],
    };

    if (option) {
      // if (isGen) {
      //   getCatLevel2ByName(cat1?.label)
      //     .then((res) => {
      //       setCatLevel3Arr(res?.data);
      //     })
      //     .catch((err) => {});
      // } else {
      getAllLevel2Category(payload)
        .then((response) => {
          let cat = [];
          response?.data?.data?.results?.map((e) => {
            cat.push({
              value: e?.level2Id,
              label: e?.categoryName,
              hsn: e?.hsnCode,
              igst: e?.igst,
              sgst: e?.sgst,
              cgst: e?.cgst,
            });
          });

          updateFormData('catLeve3Arr', cat);
        })
        .catch((error) => {});
    }
    // }
  };

  const handleLevel3CatChange = (option) => {
    updateFormData('catLevel3', option);
    updateFormData('hsn', option?.hsn);
    updateFormData('igst', option?.igst);
    updateFormData('cgst', option?.cgst);
    updateFormData('sgst', option?.sgst);
  };

  const handleBundleProductSearch = debounce((value) => {
    if (!value) {
      return;
    }
    const payload = {
      page: 1,
      pageSize: 10,
      storeLocations: [locId],
      barcode: [value],
      // query: value,
    };

    getGlobalProducts(payload)
      .then((res) => {
        const result = res?.data?.data?.data?.data?.reduce((acc, item) => {
          const matchingVariant = item?.variants?.find((variant) => variant?.barcodes?.[0] === value);

          if (matchingVariant && item?.id) {
            acc.push({
              value: item?.id,
              label: `${item?.name}(${matchingVariant?.barcodes?.[0] || ''})` || '',
              // label: item?.name || '',
              name: item?.name,
              data: filterVariantsByBarcode(item, value),
            });
          }
          return acc;
        }, []);
        setOptArray(result || []);
      })
      .catch(() => {});
  }, 300);

  const mapProductOptions = (product) => {
    const options = [];

    // Variants mapping
    product?.variants?.forEach((variant) => {
      variant?.barcodes?.forEach((barcode) => {
        options.push({
          value: product?.id,
          label: `${product?.name} (${barcode})`,
          data: product,
        });
      });
    });
    return options;
  };

  const handleBundleProductNameSearch = debounce((value) => {
    if (!value) {
      return;
    }
    const payload = {
      page: 1,
      pageSize: 10,
      storeLocations: [locId],
      // barcode: [value],
      query: value,
    };

    getGlobalProducts(payload)
      .then((res) => {
        const productData = res?.data?.data?.data?.data;
        const options = productData?.map((item) => ({
          value: item?.id,
          label: item?.name,
          data: item,
        }));

        const storedData = productData?.map((item) => {
          return mapProductOptions(item);
        });
        const flattenedData = storedData?.flat();
        setNameOptions(flattenedData || []);
      })
      .catch(() => {});
  }, 300);

  function filterVariantsByBarcode(productData, barcode) {
    const filteredVariants = productData?.variants?.filter((variant) => variant?.barcodes?.includes(barcode));

    return {
      ...productData,
      variants: filteredVariants,
    };
  }

  const handleGenerateBarCode = () => {
    generateBarcode()
      .then((res) => {
        updateFormData('manBarcode', res?.data?.data?.barcode);
        updateFormData('barcodeImage', `data:image/png;base64,${res?.data?.data?.image}`);
      })
      .catch(() => {});
  };

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
    if (!formData?.productTitle) {
      showSnackbar('Add Products title', 'error');
      return 'error';
    }
    if (!formData?.catLevel1?.value) {
      showSnackbar('Please select a category', 'error');
      return 'error';
    }
    if (!formData?.catLevel2?.value) {
      showSnackbar('Please select category level 2', 'error');
      return 'error';
    }
    if (!formData?.catLevel3?.value) {
      showSnackbar('Please select category level 3', 'error');
      return 'error';
    }
    const barcodeCheck = formData?.manBarcode === '';
    if (barcodeCheck) {
      showSnackbar('Generate Barcode to proceed', 'error');
      return 'error';
    }

    if (formData?.selectedBundleProduct?.length <= 1) {
      showSnackbar('Add more than 1 product to create bundle', 'error');
      return 'error';
    }
    if (formData?.salesChannel?.length === 0) {
      showSnackbar('Please select a sales channel', 'error');
      return 'error';
    }
  };
  const handleCreateBundleProduct = (isBundle) => {
    setLoader(true);
    let payload = {
      productName: formData?.productTitle || '',
      action: isBundle ? 'EDIT_BUNDLE' : 'CREATE_BUNDLE',
      logType: 'ProductLog',
      product: {
        // id: 'string',
        name: formData?.productTitle || '',
        title: formData?.productTitle || '',
        shortDescription: formData?.description,
        description: formData?.description,

        appCategories: {
          categoryLevel1: [formData?.catLevel1?.label || ''],
          categoryLevel1Id: [formData?.catLevel1?.value || ''],
          categoryLevel2: [formData?.catLevel2?.label || ''],
          categoryLevel2Id: [formData?.catLevel2?.value || ''],
          categoryLevel3: [formData?.catLevel3?.label || ''],
          categoryLevel3Id: [formData?.catLevel3?.value || ''],
        },
        posCategories: {
          categoryLevel1: [formData?.catLevel1?.label],
          categoryLevel1Id: [formData?.catLevel1?.value],
          categoryLevel2: [formData?.catLevel2?.label],
          categoryLevel2Id: [formData?.catLevel2?.value],
          categoryLevel3: [formData?.catLevel2?.label],
          categoryLevel3Id: [formData?.catLevel2?.value],
        },
        returnable: formData?.returnableItems === 'YES',
        isBundle: true,
        bundleBarcode: formData?.manBarcode || '',
        // bundleType: 'string',
        bundleValidity: 0,
        tags: [formData?.seoTags || ''],
        dimensions: {
          measurementUnit: formData?.weighingScaleUnit?.value,
        },
        taxReference: {
          taxName: 'GST & CESS',
          taxType: 'GST',
          taxCategory: 'GST',
          taxRate: formData?.igst || 0,
          isDefault: true,
          metadata: {
            hsnCode: formData?.hsn,
            cess: formData?.cess,
          },
        },
        attributes: {},
        storeSpecificData: {
          storeId: orgId,
          storeLocationId: locId,
          storeName: orgId,
          storeLocationName: locId,
        },

        variants: formData?.selectedBundleProduct?.map((item, index) => ({
          // variantId: 'string',
          name: item?.name,
          barcodes: item?.variants?.[0]?.barcodes || [],
          sku: item?.variants?.[0]?.barcodes?.[0] || [],
          weight: item?.variants?.[0]?.weight,
          weightUnit: item?.variants?.[0]?.weightUnit,
          packType: item?.variants?.[0]?.packType,
          mrpData: [
            {
              currencyCode: 'INR',
              currencySymbol: '₹',
              mrp: item?.variants?.[0]?.mrpData?.[0]?.mrp,
              country: 'India',
            },
          ],
          inventorySync: {
            // "inventoryId": "string",
            productId: item?.id || '',
            variantId: item?.variants?.[index]?.variantId || '',
            gtin: item?.variants?.[index]?.barcodes?.[index],
            batchNo: selectedBatch?.[index]?.batchNo,
            sourceId: orgId,
            sourceLocationId: locId,
            sourceType: 'RETAIL',
            availableQuantity: selectedBatch?.[index]?.availableUnits,
            mrp: selectedBatch?.[index]?.mrp,
            sellingPrice: selectedBatch?.[index]?.sellingPrice,
            purchasePrice: selectedBatch?.[index]?.purchasePrice,
            offerPrice: formData?.offerPrice?.[index],
            expiry: 0,
            bundleQuantity: formData?.quantity?.[index],
          },
          salesChannels: formData?.salesChannel ? formData?.salesChannel : [],

          listedOn: [],
          tags: formData?.seoTags ? [formData?.seoTags] : [],

          createdBy: uidx,
          createdByName: userName,

          isActive: true,
        })),
        nativeLanguages: [
          {
            language: formData?.localLanguage?.label,
            name: formData?.localProductTitle,
          },
        ],
        imageUrls: transformImageListToObject(productVariantArr?.[0]?.imageList || []),
        createdBy: uidx,
        updatedBy: uidx,
        createdByName: userName,
      },
      sourceId: orgId,
      sourceLocationId: locId,
    };
    if (isBundle) {
      payload.product.id = bundleId;
      payload.productId = bundleId;
      payload.status = 'APPROVED';
    }

    const validated = validatePayload(payload);
    if (validated === 'error') {
      setLoader(false);
      return;
    }

    if (location.pathname === '/products/all-bundle-products/add-products/bundle') {
      createCmsProduct(payload)
        .then((res) => {
          if (res?.data?.data?.es === 0) {
            handleConsumeInventory();
          }
        })
        .catch((err) => {
          showSnackbar('Something went wrong', 'error');
          setLoader(false);
        });
    } else {
      editCmsProduct(payload)
        .then((res) => {
          showSnackbar('Bundle Product Updated Succesfully', 'success');
        })
        .catch((err) => {
          showSnackbar('Something went wrong', 'error');
          setLoader(false);
        });
    }
  };

  const handleConsumeInventory = () => {
    const payload = {
      bundleGtin: formData?.barcode ? formData?.barcode : formData?.manBarcode || '',
      title: formData?.productTitle || '',
      categoryLevel1: formData?.catLevel1?.label || '',
      categoryLevel2: formData?.catLevel2?.label || '',
      categoryLevel3: formData?.catLevel3?.label || '',
      description: formData?.description,
      locationIds: [locId],
      organizationId: orgId,
      batchSelection: true,
      returnable: formData?.returnableItems === 'YES',
      startDate: formData?.validityFrom,
      endDate: formData?.validityUpto,
      mrp: totalMRP || 0,
      purchasePrice: totalPurchaseCost || 0,
      totalQuantity: totalQuantity || 0,
      sellingPrice: bundleSalePrice || 0,
      quantity: formData?.bundleQuantity || 0,
      bundleProducts: Array.from({ length: bundleProductCount }, (_, index) => {
        // Filter inventoryIds related to the current product index
        const inventoryIds = selectedBatch
          ?.filter((batch) => batch?.index === index)
          ?.map((batch) => batch?.inventoryId);

        return {
          gtin: formData?.productBarCode?.[index],
          itemName:
            formData?.selectedBundleProduct?.[index]?.name ||
            formData?.selectedBundleProduct?.[index]?.variants?.[0]?.name ||
            '',
          inventoryIds: formData?.batchSelection === 'SELECT_BATCH' ? inventoryIds : [], // Include all matching inventoryIds
          quantity: formData?.quantity?.[index],
          offerPrice: formData?.offerPrice?.[index],
          mrp: formData?.mrp?.[index],
          sellingPrice: formData?.sellingPrice?.[index],
          purchasePrice: formData?.purchasePrice?.[index],
        };
      }),
      createdBy: uidx,
      createdByName: userName,
    };

    consumeInventoryBatchData(payload)
      .then((res) => {
        if (res?.data?.data?.es === 0) {
          navigate('/products/all-bundle-products');
          showSnackbar('Bundle Product Created Succesfully', 'success');
          setLoader(false);
        }
      })
      .catch((err) => {
        setLoader(false);
      });
  };

  useEffect(() => {
    if (isBundle) {
      getProductDetailsbyId(bundleId, locId)
        .then((res) => {
          const productData = res?.data?.data?.data;
          const imageList = Object.values(productData?.imageUrls || {});
          setProductVariantArr([{ imageList: imageList || [] }]);
          const transformedVariants = productData?.variants?.map((item, index) => ({
            variants: [
              {
                id: productData?.id,
                name: item?.name,
                barcodes: item?.barcodes || [],
                sku: item?.sku || [],
                weight: item?.weight,
                weightUnit: item?.weightUnit,
                packType: item?.packType,
                mrpData: [
                  {
                    currencyCode: 'INR',
                    currencySymbol: '₹',
                    mrp: item?.mrpData?.[0]?.mrp,
                    country: 'India',
                  },
                ],
                inventorySync: {
                  gtin: item?.inventorySync?.gtin,
                  sourceId: orgId,
                  sourceLocationId: locId,
                  sourceType: 'RETAIL',
                  availableQuantity: item?.inventorySync?.availableQuantity,
                  mrp: item?.mrpData?.[0]?.mrp,
                  sellingPrice: item?.inventorySync?.sellingPrice,
                  purchasePrice: item?.inventorySync?.purchasePrice,
                  offerPrice: item?.inventorySync?.offerPrice,
                  bundleQuantity: item?.inventorySync?.bundleQuantity,
                },
                salesChannels: item?.salesChannels || [],
                listedOn: item?.listedOn || [],
                tags: item?.tags || [],
                createdBy: uidx,
                createdByName: userName,
                isActive: item?.isActive,
              },
            ],
          }));
          setBundleProductCount(transformedVariants?.length || 1);
          const productBarCode = productData?.variants?.flatMap((variant) => variant.barcodes);
          const newValues = {};
          newValues.productBarCode = productBarCode;
          newValues.selectedBundleProduct = transformedVariants || [];
          newValues.productTitle = productData?.name;
          newValues.catLevel1 = {
            value: productData?.appCategories?.categoryLevel1Id,
            label: productData?.appCategories?.categoryLevel1,
          };
          newValues.catLevel2 = {
            value: productData?.appCategories?.categoryLevel2Id,
            label: productData?.appCategories?.categoryLevel2,
          };
          newValues.catLevel3 = {
            value: productData?.appCategories?.categoryLevel3Id,
            label: productData?.appCategories?.categoryLevel3,
          };
          newValues.barcode = productData?.bundleBarcode;
          if (productData?.bundleBarcode) {
            handleFetchInventoryBatchDetails(productData?.bundleBarcode);
          }
          newValues.description = productData?.description;
          newValues.seoTags = productData?.tags;
          newValues.localProductTitle = productData?.nativeLanguages?.[0]?.name;
          newValues.returnableItems = productData?.returnable ? 'YES' : 'NO';
          // newValues.productBarCode = [];

          setFormData((prevFormData) => ({
            ...prevFormData,
            ...newValues,
          }));
        })
        .catch(() => {});
    }
  }, []);

  const handleFetchInventoryBatchDetails = (bundleBarcode) => {
    //     getInventoryBundleDetails(locId , bundleBarcode).then((res) => {
    //  const data = res?.data?.data?.data
    //     }).catch((err) => {
    //     })
  };
  const handleFetchBatchDetails = (barcodeData, index) => {
    getInventoryBatchByGtin(barcodeData?.[index] || '', locId).then((res) => {
      if (res?.data?.data?.data) {
        const formattedBatchData = res?.data?.data?.data?.map((item) => ({
          mrp: item?.mrp || '',
          sellingPrice: item?.sellingPrice || '',
          purchasePrice: item?.purchasePrice || '',
          availableUnits: item?.availableUnits || '',
          batchNo: item?.batchNo || '',
          inventoryId: item?.inventoryId,
          index: index,
          gtin: item?.gtin,
        }));
        setBatchData(formattedBatchData || []);
        // setSelectedProduct(newValue || []);
        if (formData?.batchSelection === 'SELECT_BATCH') {
          handleOpen();
        } else {
          setSelectedBatch((prevSelectedBatch) => [...(prevSelectedBatch || []), formattedBatchData?.[0]]);
        }
      }
    });
  };

  const [openComingSoon, setOpenComingSoon] = useState(false);

  const handleOpenComingSoon = () => {
    setOpenComingSoon(true);
  };

  const handleCloseComingSoon = () => {
    setOpenComingSoon(false);
  };

  const handleRadioChange = (batch, index) => {
    setSelectedBatch((prevSelectedBatch) => ({
      ...prevSelectedBatch,
      [index]: batch,
    }));
    const quantityData = [...(formData?.quantity || [])];
    quantityData[index] = 1;
    updateFormData('quantity', quantityData);
    const offerPriceData = [...(formData?.offerPrice || [])];
    offerPriceData[index] = batch.sellingPrice;
    updateFormData('offerPrice', offerPriceData);
  };

  const handleProductNavigation = async (barcode) => {
    if (barcode) {
      try {
        const productId = await productIdByBarcode(barcode);
        if (productId) {
          return `/products/product/details/${productId}`;
        }
      } catch (error) {
        return null;
      }
    }
  };

  const handleNavigate = async (gtin) => {
    try {
      const url = await handleProductNavigation(gtin);
      if (url) {
        window.open(url, '_blank');
      }
    } catch (error) {}
  };
  const handleClearRowData = (index) => {
    try {
      const updatedProductBarCode = [...(formData?.productBarCode || [])];
      const updatedSelectedBundleProduct = [...(formData?.selectedBundleProduct || [])];
      const updatedQuantity = [...(formData?.quantity || [])];
      const updatedOfferPrice = [...(formData?.offerPrice || [])];
      updatedProductBarCode?.splice(index, 1);
      updatedSelectedBundleProduct?.splice(index, 1);
      updatedQuantity?.splice(index, 1);
      updatedOfferPrice?.splice(index, 1);
      updateFormData('productBarCode', updatedProductBarCode);
      updateFormData('selectedBundleProduct', updatedSelectedBundleProduct);
      updateFormData('quantity', updatedQuantity);
      updateFormData('offerPrice', updatedOfferPrice);
      const updatedBatches = [...selectedBatch];
      updatedBatches?.splice(index, 1); // Use splice instead of delete
      setSelectedBatch(updatedBatches);
      setBundleProductCount(bundleProductCount - 1);
    } catch (err) {}
  };

  const handleSuggestOfferPrice = (qty, index, gtin) => {
    const batch = selectedBatch?.find((batch) => batch?.gtin === gtin);

    if (!batch) return;
    const sellingPrice = batch?.sellingPrice || 0;
    const quantity = parseInt(qty, 10) || 0;

    const calculatedOfferPrice = sellingPrice * quantity;

    // Update the formData for offerPrice
    const updatedOfferPrices = [...(formData.offerPrice || [])];
    updatedOfferPrices[index] = calculatedOfferPrice;

    updateFormData('offerPrice', updatedOfferPrices);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar prevLink={true} />
      <div>
        <BatchSelectionModal
          open={open}
          handleClose={handleClose}
          formData={formData}
          batchDetails={batchData}
          selectedBatch={selectedBatch}
          setSelectedBatch={setSelectedBatch}
          handleRadioChange={handleRadioChange}
          batchSelection={formData?.batchSelection}
          updateFormData={updateFormData}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <SoftTypography fontWeight="bold" fontSize="1.1rem">
          {isBundle ? 'Edit bundle product' : 'Add new product bundle'}
        </SoftTypography>
      </div>
      <Card style={{ padding: '20px' }} className="addbrand-Box">
        <InputLabel className="labeltitle" required>
          Product title
        </InputLabel>
        <div className="productTitle-flex">
          <SoftInput
            size="small"
            placeholder="Enter the product name exactly as printed in the product for better results
            "
            value={formData?.productTitle}
            onChange={(e) => updateFormData('productTitle', e.target.value)}
          ></SoftInput>

          <SoftButton
            className="smallBtnStyle"
            size="small"
            variant="outlined"
            color="info"
            style={{ width: '150px' }}
            onClick={() => handleAddPhoto(0)}
          >
            {productVariantArr?.[0]?.imageList?.length > 0 ? 'View image' : 'Add image'}
          </SoftButton>
          {openImageModal && (
            <ProductVarientImagesUpload
              index={0}
              openImageModal={openImageModal}
              handleCloseImageModal={handleCloseImageModal}
              productVariantArr={productVariantArr}
              setProductVariantArr={setProductVariantArr}
            />
          )}
          <Tooltip title={'Please add image for the bundle product you want to create'}>
            <InfoOutlinedIcon style={{ color: '#367df3' }} fontSize="small" />
          </Tooltip>
        </div>
        <div className="element-flex" style={{ margin: '10px 0px 0px 0px' }}>
          <InputLabel className="labeltitle" required>
            Category
          </InputLabel>
          <Tooltip title={'Please select appropriate product category'}>
            <InfoOutlinedIcon style={{ color: '#367df3' }} fontSize="small" />
          </Tooltip>
        </div>
        <Grid container direction="row" justifyContent="space-between" alignItems="center">
          <Grid item xs={12} md={4} lg={4}>
            <SoftBox style={{ width: '95%' }}>
              <div className="duplicate-warning-msg"> Level 1</div>
              {/* <SoftSelect
                size="small"
                className="select-box-category"
                value={formData?.catLevel1}
                options={mainCatArr}
                onChange={(option) => handleMainCatChange(option)}
              /> */}
              <SoftAsyncPaginate
                size="small"
                className="select-box-category"
                value={formData?.catLevel1}
                loadOptions={(searchQuery, loadedOptions, additional) =>
                  loadMainCategoryOptions(searchQuery, loadedOptions, additional)
                }
                additional={{ page: 1 }} // Start pagination with page 1
                onChange={(option) => handleMainCatChange(option)}
                isClearable
              />
            </SoftBox>
          </Grid>
          <Grid item xs={12} md={4} lg={4}>
            <SoftBox style={{ width: '95%' }}>
              <div className="duplicate-warning-msg"> Level 2</div>
              <SoftSelect
                size="small"
                className="select-box-category"
                value={formData?.catLevel2}
                options={formData?.catLeve2Arr}
                onChange={(option) => handleLevel2CatChange(option)}
              />
            </SoftBox>
          </Grid>
          <Grid item xs={12} md={4} lg={4}>
            <SoftBox style={{ width: '95%' }}>
              <div className="duplicate-warning-msg">Level 3</div>
              <SoftSelect
                size="small"
                className="select-box-category"
                value={formData?.catLevel3}
                options={formData?.catLeve3Arr}
                onChange={(option) => handleLevel3CatChange(option)}
              />
            </SoftBox>
          </Grid>
        </Grid>
        <div style={{ marginTop: '5px' }}>
          <InputLabel className="labeltitle" required>
            Barcode (EAN)
          </InputLabel>
          <div className="element-flex">
            <div className="select-wrapper">
              <SoftInput
                size="small"
                value={formData?.barcode ? formData?.barcode : formData?.manBarcode}
                disabled={formData?.barcode}
                onChange={(e) => updateFormData('manBarcode', e.target.value)}
              ></SoftInput>
            </div>{' '}
            <div className="select-wrapper">
              <SoftButton
                className="smallBtnStyle"
                size="small"
                variant="outlined"
                color="info"
                // style={{ width: '180px' }}
                onClick={handleGenerateBarCode}
              >
                Generate new
              </SoftButton>
            </div>
            {formData?.barcodeImage && (
              <div>
                <img src={formData?.barcodeImage} style={{ height: '60px' }} />
              </div>
            )}
          </div>
        </div>
        <div className="productTitle-flex" style={{ justifyContent: 'space-between' }}>
          <InputLabel className="labeltitle">Description</InputLabel>
        </div>
        <div>
          <SoftInput
            placeholder="Enter description"
            multiline
            rows={3}
            value={formData?.description}
            onChange={(e) => updateFormData('description', e.target.value)}
          ></SoftInput>
        </div>
      </Card>
      <Card className="addbrand-Box">
        {/* <div className="element-flex" style={{ margin: '10px 0px 10px 0px' }}>
          <InputLabel className="labeltitle">Locations</InputLabel>
          <Tooltip title={'Please select the location you want to add the bundle product.'}>
            <InfoOutlinedIcon style={{ color: '#367df3' }} fontSize="small" />
          </Tooltip>
        </div> */}
        <Grid container>
          {/* <Grid item xs={12} md={4}>
            <div>
              <InputLabel className="labeltitle">Select locations</InputLabel>
              <SoftSelect
                size="small"
                options={locationOptions || []}
                value={formData?.location}
                onChange={(e) => updateFormData('location', e)}
              >
                {' '}
              </SoftSelect>
            </div>
          </Grid> */}
        </Grid>

        <div>
          <div className="element-flex" style={{ margin: '10px 0px 0px 0px' }}>
            <InputLabel className="labeltitle">Batch selection</InputLabel>
            <Tooltip title={'Please select the batch for the particular product.'}>
              <InfoOutlinedIcon style={{ color: '#367df3' }} fontSize="small" />
            </Tooltip>
          </div>
          <RadioGroup
            defaultValue="CENTRALIZED"
            //   value={deliveryMethod}
            //   onChange={handleDeliveryMethodChange}
            value={formData?.batchSelection}
            onChange={(e) => updateFormData('batchSelection', e.target.value)}
            row
            style={{ gap: '15px' }}
          >
            <FormControlLabel value="AUTO_ASSIGN_BATCH" label="Auto assign batch" control={<Radio />} />
            <FormControlLabel value="SELECT_BATCH" label="Select batch" control={<Radio />} />
          </RadioGroup>
        </div>
      </Card>
      <Card className="addbrand-Box">
        <div className="element-flex" style={{ margin: '10px 0px 20px 0px' }}>
          <InputLabel className="labeltitle">Add Products</InputLabel>
          <Tooltip title={'Please add products to create a bundle.'}>
            <InfoOutlinedIcon style={{ color: '#367df3' }} fontSize="small" />
          </Tooltip>
        </div>
        {Array.from({ length: bundleProductCount }).map((_, index) => (
          <Grid container spacing={1} style={{ marginTop: '8px' }}>
            <>
              <Grid
                item
                xs={12}
                md={2}
                onClick={() => {
                  if (formData?.selectedBundleProduct?.[index]) {
                    handleNavigate(formData?.productBarCode?.[index] || '');
                  }
                }}
              >
                <div>
                  {index === 0 && (
                    <InputLabel className="labeltitle" required>
                      Barcode (EAN)
                    </InputLabel>
                  )}
                  <Autocomplete
                    size="small"
                    value={{
                      value: formData?.productBarCode?.[index] || '',
                      label: formData?.productBarCode?.[index] || '',
                    }}
                    onChange={(event, newValue) => {
                      if (typeof newValue === 'string') {
                        const barcodeData = [...(formData?.productBarCode || [])];
                        barcodeData[index] = newValue;
                        updateFormData('productBarCode', barcodeData);
                      } else if (newValue && newValue.inputValue) {
                        const barcodeData = [...(formData?.productBarCode || [])];
                        barcodeData[index] = newValue.inputValue;
                        updateFormData('productBarCode', barcodeData);
                      } else {
                        const data = [...(formData?.selectedBundleProduct || [])];
                        const barcodeData = [...(formData?.productBarCode || [])];
                        data[index] = newValue?.data;
                        barcodeData[index] = newValue?.data?.variants?.[0]?.barcodes?.[0];
                        updateFormData('productBarCode', barcodeData);
                        updateFormData('selectedBundleProduct', data);
                        updateFormData('currentIndex', index);
                        handleFetchBatchDetails(barcodeData, index);
                      }
                    }}
                    // onClick={() => {
                    //   // Ensure barcode exists before attempting to navigate
                    //   if (formData?.productBarCode?.[index]) {
                    //     handleProductNavigation(formData?.productBarCode?.[index]);
                    //   }
                    // }}
                    handleHomeEndKeys
                    className="free-solo-with-text-demo"
                    options={optArray}
                    getOptionLabel={(option) => {
                      if (typeof option === 'string') {
                        return option;
                      }
                      if (option.inputValue) {
                        return option.inputValue;
                      }
                      return option.label;
                    }}
                    renderOption={(props, option) => <li {...props}>{option.label}</li>}
                    freeSolo
                    renderInput={(params) => (
                      <TextField
                        size="small"
                        {...params}
                        onChange={(e) => {
                          const barcodeData = [...(formData?.productBarCode || [])];
                          barcodeData[index] = e.target.value;
                          updateFormData('productBarCode', barcodeData);
                          handleBundleProductSearch(e.target.value);
                        }}
                        placeholder="Enter barcode"
                        style={{ width: '100%' }}
                        fullWidth
                      />
                    )}
                  />
                </div>
              </Grid>
              <Grid item xs={12} md={2.25}>
                <div>
                  {index === 0 && <InputLabel className="labeltitle">Title</InputLabel>}

                  <Autocomplete
                    size="small"
                    value={
                      formData?.selectedBundleProduct?.[index]?.name ||
                      formData?.selectedBundleProduct?.[index]?.variants?.[0]?.name ||
                      ''
                    }
                    onChange={(event, newValue) => {
                      if (typeof newValue === 'string') {
                        const barcodeData = [...(formData?.productBarCode || [])];
                        barcodeData[index] = newValue;
                        updateFormData('productBarCode', barcodeData);
                      } else if (newValue && newValue.inputValue) {
                        const barcodeData = [...(formData?.productBarCode || [])];
                        barcodeData[index] = newValue.inputValue;
                        updateFormData('productBarCode', barcodeData);
                      } else {
                        const data = [...(formData?.selectedBundleProduct || [])];
                        const barcodeData = [...(formData?.productBarCode || [])];
                        data[index] = newValue?.data;
                        barcodeData[index] = newValue?.data?.variants?.[0]?.barcodes?.[0];
                        updateFormData('productBarCode', barcodeData);
                        updateFormData('selectedBundleProduct', data);
                        updateFormData('currentIndex', index);
                        handleFetchBatchDetails(barcodeData, index);
                      }
                    }}
                    handleHomeEndKeys
                    className="free-solo-with-text-demo"
                    options={nameOptions}
                    getOptionLabel={(option) => {
                      if (typeof option === 'string') {
                        return option;
                      }
                      if (option.inputValue) {
                        return option.inputValue;
                      }
                      return option.label;
                    }}
                    renderOption={(props, option) => <li {...props}>{option.label}</li>}
                    freeSolo
                    renderInput={(params) => (
                      <TextField
                        size="small"
                        {...params}
                        value={
                          formData?.selectedBundleProduct?.[index]?.name ||
                          formData?.selectedBundleProduct?.[index]?.variants?.[0]?.name ||
                          ''
                        }
                        onChange={(e) => {
                          // const barcodeData = [...(formData?.productBarCode || [])];
                          // barcodeData[index] = e.target.value;
                          // updateFormData('productBarCode', barcodeData);
                          handleBundleProductNameSearch(e.target.value);
                        }}
                        placeholder="Search product"
                        style={{ width: '100%' }}
                        fullWidth
                      />
                    )}
                  />
                </div>
              </Grid>
              <Grid item xs={12} md={1.25}>
                <div>
                  {index === 0 && <InputLabel className="labeltitle">UOM</InputLabel>}
                  <SoftInput
                    size="small"
                    disabled
                    value={formData?.selectedBundleProduct?.[index]?.variants?.[0]?.weightUnit || ''}
                  ></SoftInput>
                </div>
              </Grid>
              <Grid item xs={12} md={1.25}>
                <div>
                  {index === 0 && <InputLabel className="labeltitle">MRP</InputLabel>}
                  <SoftInput
                    size="small"
                    disabled
                    value={(() => {
                      const batchMRP =
                        Array.isArray(selectedBatch) &&
                        selectedBatch?.find((batch) => batch.gtin === formData?.productBarCode?.[index])?.mrp;
                      if (batchMRP && formData?.mrp?.[index] !== batchMRP) {
                        // Update formData with the MRP
                        const updatedMRP = { ...formData.mrp, [index]: batchMRP };
                        updateFormData('mrp', updatedMRP);
                      }
                      return formData?.mrp?.[index] || '';
                    })()}
                    // value={selectedBatch?.find((batch) => batch.gtin === formData?.productBarCode?.[index])?.mrp || ''}
                  ></SoftInput>
                </div>
              </Grid>
              <Grid item xs={12} md={1.25}>
                <div>
                  {index === 0 && <InputLabel className="labeltitle">Purchase Price</InputLabel>}
                  <SoftInput
                    size="small"
                    disabled
                    value={(() => {
                      const batchMRP =
                        Array.isArray(selectedBatch) &&
                        selectedBatch?.find((batch) => batch.gtin === formData?.productBarCode?.[index])?.purchasePrice;
                      if (batchMRP && formData?.purchasePrice?.[index] !== batchMRP) {
                        // Update formData with the MRP
                        const updatedMRP = { ...formData.purchasePrice, [index]: batchMRP };
                        updateFormData('purchasePrice', updatedMRP);
                      }
                      return formData?.purchasePrice?.[index] || '';
                    })()}
                    // value={
                    //   selectedBatch?.find((batch) => batch.gtin === formData?.productBarCode?.[index])?.purchasePrice ||
                    //   ''
                    // }
                  ></SoftInput>
                </div>
              </Grid>
              <Grid item xs={12} md={1.25}>
                <div>
                  {index === 0 && <InputLabel className="labeltitle">Sales Price</InputLabel>}
                  <SoftInput
                    size="small"
                    disabled
                    value={(() => {
                      const batchMRP =
                        Array.isArray(selectedBatch) &&
                        selectedBatch?.find((batch) => batch.gtin === formData?.productBarCode?.[index])?.sellingPrice;
                      if (batchMRP && formData?.sellingPrice?.[index] !== batchMRP) {
                        // Update formData with the MRP
                        const updatedMRP = { ...formData?.sellingPrice, [index]: batchMRP };
                        updateFormData('sellingPrice', updatedMRP);
                      }
                      return formData?.sellingPrice?.[index] || '';
                    })()}
                    // value={
                    //   selectedBatch?.find((batch) => batch.gtin === formData?.productBarCode?.[index])?.sellingPrice ||
                    //   ''
                    // }
                  ></SoftInput>
                </div>
              </Grid>
              <Grid item xs={12} md={1.25}>
                <div>
                  {index === 0 && (
                    <InputLabel className="labeltitle" required>
                      Quantity
                    </InputLabel>
                  )}
                  <SoftInput
                    size="small"
                    type="number"
                    value={formData?.quantity?.[index] || ''}
                    onChange={(e) => {
                      const data = [...(formData?.quantity || [])];
                      data[index] = e?.target?.value;
                      updateFormData('quantity', data);
                      handleSuggestOfferPrice(e?.target?.value, index, formData?.productBarCode?.[index]);
                    }}
                  ></SoftInput>
                </div>
              </Grid>
              <Grid item xs={12} md={1.25}>
                <div>
                  {index === 0 && (
                    <InputLabel className="labeltitle" required>
                      Offer price
                    </InputLabel>
                  )}
                  <SoftInput
                    size="small"
                    type="number"
                    value={formData?.offerPrice?.[index] || ''}
                    onChange={(e) => {
                      const data = [...(formData?.offerPrice || [])];
                      data[index] = e?.target?.value;
                      updateFormData('offerPrice', data);
                    }}
                  ></SoftInput>
                </div>
              </Grid>
              {index !== 0 && (
                <Grid item xs={12} md={0.25}>
                  <CloseIcon
                    style={{ color: 'red', marginTop: index === 0 ? '25px' : '0px' }}
                    onClick={() => handleClearRowData(index)}
                  />
                </Grid>
              )}
            </>
          </Grid>
        ))}

        <Button style={{ marginRight: 'auto' }} onClick={() => setBundleProductCount(bundleProductCount + 1)}>
          + Add more
        </Button>
        <br />
        <br />
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          {displayLowStockMsg && (
            <div>
              <div>
                <InputLabel className="labeltitle">
                  {' '}
                  <WarningOutlinedIcon style={{ color: 'red' }} fontSize="small" /> Caution
                </InputLabel>
              </div>
              <SoftTypography fontSize="0.85rem">Low stocks identified in one or more locations</SoftTypography>
            </div>
          )}

          <div className="bundleProduct-box">
            <div>
              <InputLabel className="labeltitle">Total MRP Value</InputLabel>
              <SoftTypography>{totalMRP}</SoftTypography>
            </div>
            <div>
              <InputLabel className="labeltitle">Total Purchase cost</InputLabel>
              <SoftTypography>{totalPurchaseCost}</SoftTypography>
            </div>
            <div>
              <InputLabel className="labeltitle">Total Quantity</InputLabel>
              <SoftTypography>{totalQuantity}</SoftTypography>
            </div>
            <div>
              <InputLabel className="labeltitle">Bundle sale price</InputLabel>
              <SoftTypography>{bundleSalePrice}</SoftTypography>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '15px' }}>
          <SoftTypography fontSize="0.85rem">
            <WarningOutlinedIcon style={{ color: 'orange' }} fontSize="small" /> This offer price is applicable only on
            bundle sales and does not affect sale price when sold individually
          </SoftTypography>
        </div>
      </Card>
      <Card className="addbrand-Box">
        <InputLabel className="labeltitle">Additional product attributes</InputLabel>

        <div>
          <div className="element-flex" style={{ margin: '10px 0px 0px 0px' }}>
            <InputLabel className="labeltitle">Returnable item</InputLabel>
            <Tooltip title={'Please tell if the item added is returnable?'}>
              <InfoOutlinedIcon style={{ color: '#367df3' }} fontSize="small" />
            </Tooltip>
          </div>
          <RadioGroup
            defaultValue="CENTRALIZED"
            //   value={deliveryMethod}
            //   onChange={handleDeliveryMethodChange}
            value={formData?.returnableItems}
            onChange={(e) => updateFormData('returnableItems', e.target.value)}
            row
            style={{ gap: '15px' }}
          >
            <FormControlLabel value="YES" label="Yes" control={<Radio />} />
            <FormControlLabel value="NO" label="No" control={<Radio />} />
          </RadioGroup>
        </div>
        <div className="element-flex" style={{ margin: '10px 0px 0px 0px' }}>
          <InputLabel className="labeltitle">Bundle quantity</InputLabel>
          <Tooltip title={'Please mention the quantity of the bundle.'}>
            <InfoOutlinedIcon style={{ color: '#367df3' }} fontSize="small" />
          </Tooltip>
        </div>
        <Grid container>
          <Grid item xs={12} md={4}>
            <SoftInput size="small" onChange={(e) => updateFormData('bundleQuantity', e.target.value)}></SoftInput>
          </Grid>
        </Grid>
        <div className="element-flex" style={{ margin: '10px 0px 0px 0px' }}>
          <InputLabel className="labeltitle">Bundle validity</InputLabel>
          <Tooltip title={'Mention the validity of the bundle product'}>
            <InfoOutlinedIcon style={{ color: '#367df3' }} fontSize="small" />
          </Tooltip>
        </div>
        <Grid container>
          <Grid item xs={12} md={6}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              {/* <MdDateRange color="#0562fb" fontSize="large" /> */}
              <SoftInput
                size="small"
                type="date"
                onChange={(e) => updateFormData('validityFrom', e.target.value)}
              ></SoftInput>
              <SoftInput
                size="small"
                type="date"
                onChange={(e) => updateFormData('validityUpto', e.target.value)}
              ></SoftInput>
            </div>
          </Grid>
        </Grid>
        <div className="element-flex" style={{ margin: '10px 0px 0px 0px' }}>
          <InputLabel className="labeltitle">Add product title in local language</InputLabel>

          <SoftButton
            className="smallBtnStyle"
            size="small"
            variant="outlined"
            color="info"
            onClick={handleOpenComingSoon}
          >
            Try pallet IQ
          </SoftButton>
          <ComingSoonAlert open={openComingSoon} handleClose={handleCloseComingSoon} />
          <Tooltip title={'Create product names in local languages using AI'}>
            <InfoOutlinedIcon style={{ color: '#367df3' }} fontSize="small" />
          </Tooltip>
        </div>
        <Grid container mt={1} direction="row" alignItems="center" gap="10px">
          <Grid xs={6} md={6} lg={6}>
            <InputLabel className="labeltitle">Product Title</InputLabel>

            <SoftInput
              size="small"
              name="localProductTitle"
              value={formData?.localProductTitle}
              onChange={(e) => updateFormData('localProductTitle', e.target.value)}
            />
          </Grid>
          <Grid xs={4} md={2} lg={2}>
            <InputLabel className="labeltitle">Language</InputLabel>

            <SoftSelect
              size="small"
              value={formData?.localLanguage}
              options={state || []}
              onChange={(e) => updateFormData('localLanguage', e)}
              menuPortalTarget={document.body}
            />
          </Grid>
        </Grid>
        <SoftBox style={{ marginTop: '10px' }}>
          <InputLabel className="labeltitle">
            SEO Tags{' '}
            <span className="main-header-icon">
              <Tooltip title={"Add keywords to improve the product's searchability"}>
                <InfoOutlinedIcon />
              </Tooltip>
            </span>
          </InputLabel>

          <Grid container alignItems="center" gap="10px">
            <Grid xs={12} md={6} lg={8}>
              <SoftInput
                size="small"
                name="seoTags"
                value={formData.seoTags}
                onChange={(e) => updateFormData('seoTags', e.target.value)}
                placeholder="Add upto 5 words separated by comma"
              />{' '}
            </Grid>
            <Grid xs={12} md={3} lg={3}>
              <div className="common-display-flex-1">
                <SoftButton
                  className="smallBtnStyle"
                  size="small"
                  variant="outlined"
                  color="info"
                  onClick={handleOpenComingSoon}
                >
                  Try pallet IQ
                </SoftButton>{' '}
                <ComingSoonAlert open={openComingSoon} handleClose={handleCloseComingSoon} />
                <span className="main-header-icon">
                  <Tooltip title={'Create seo tags using AI'}>
                    <InfoOutlinedIcon />
                  </Tooltip>
                </span>
              </div>
            </Grid>
          </Grid>
        </SoftBox>
        <SoftBox mt={1}>
          <InputLabel className="labeltitle" required>
            Sales channel
          </InputLabel>
          <Grid container>
            <Grid item xs={12} md={4.1}>
              <SoftSelect
                size="small"
                options={[
                  { value: 'IN_STORE', label: 'Store' },
                  // { value: 'TWINLEAVES_APP', label: 'App' },
                  { value: 'B2C_APP', label: 'App' },
                  { value: 'B2B_APP', label: 'B2B App' },
                ]}
                isMulti={true} // Enable multi-select
                value={
                  formData?.salesChannel?.map((channel) => ({ value: channel, label: textFormatter(channel) })) || []
                }
                onChange={(selectedOptions) => {
                  const selectedValues = selectedOptions ? selectedOptions.map((option) => option.value) : [];
                  updateFormData('salesChannel', selectedValues);
                }}
              ></SoftSelect>
            </Grid>
          </Grid>{' '}
        </SoftBox>
      </Card>

      <br />
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
        <SoftButton variant="outlined" color="info" onClick={() => navigate(-1)}>
          Cancel
        </SoftButton>
        {loader ? (
          <SoftButton size="small" color="info" variant="outlined">
            <Spinner size={'1.3rem'} />
          </SoftButton>
        ) : (
          <SoftButton color="info" onClick={() => handleCreateBundleProduct(isBundle)}>
            Save
          </SoftButton>
        )}
      </div>
      <br />
    </DashboardLayout>
  );
};

export default AddBundleProduct;
