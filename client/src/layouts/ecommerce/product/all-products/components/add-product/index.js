/**
=========================================================
* Soft UI Dashboard PRO React - v4.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-pro-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import Swal from 'sweetalert2';
// @mui material components
import Grid from '@mui/material/Grid';

// Soft UI Dashboard PRO React components
import SoftBox from 'components/SoftBox';
import SoftButton from 'components/SoftButton';

// Soft UI Dashboard PRO React example components
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Footer from 'examples/Footer';

// EditProduct page components
import * as React from 'react';
import {
  addGlobalProduct,
  getAllLevel1Category,
  getAllLevel2Category,
  getAllMainCategory,
} from '../../../../../../config/Services';
import { addProduct, addProductWithImages } from 'config/Services';
import { addProductInventory } from 'config/Services';
import { buttonStyles } from '../../../../Common/buttonColor';
import { getCatLevel2ByName } from 'config/Services';
import { isSmallScreen, removeExtraSpaces } from '../../../../Common/CommonFunction';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import MobileNavbar from '../../../../../../examples/Navbars/MobileNavbar/mobile-navbar-drawer';
import MuiAlert from '@mui/material/Alert';
import Pricing from 'layouts/ecommerce/product/all-products/components/add-product/components/Pricing/index';
import PricingField from './components/Pricing/Pricingfield';
import ProductImage from 'layouts/ecommerce/product/all-products/components/add-product/components/ProductImage/index';
import ProductInfo from 'layouts/ecommerce/product/all-products/components/add-product/components/ProductInfo/index';
import Snackbar from '@mui/material/Snackbar';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const AddProducts = () => {
  const { bundle } = useParams();
  const [productTitle, setProductTitle] = useState(null);
  const [hsn, setHsn] = useState('');
  const [manufacturer, setManufacturer] = useState(null);
  const [preferredVendor, setPreferredVendor] = useState(null);
  const [barcode, setBarcode] = useState('');
  const [manBarcode, setManBarcode] = useState('');
  const [comparePrice, setComparePrice] = useState('N');
  const [returnable, setReturnable] = useState('N');
  const [sellOutOfStock, setSellOutOfStock] = useState('N');
  const [orgainc, setOrganic] = useState('N');
  const [isFood, setIsFood] = useState(false);
  const [inputlist, setInputlist] = useState([{}]);
  const [tags, setTags] = useState([]);
  const [itemReferences, setitemReferences] = useState('');
  const [bundleGtin, setBundleGtin] = useState([]);
  const [bundleTitle, setBundleTitle] = useState('');
  const [specification, setSpecification] = useState('');
  const [cmsMRP, setCMSMrp] = useState('');
  const [mrp, setMrp] = useState(Array.from({ length: count }).map(() => ''));
  const [salePrice, setSalePrice] = useState(Array.from({ length: count }).map(() => ''));
  const [purchasePrice, setPurchasePrice] = useState(Array.from({ length: count }).map(() => ''));
  const [openingStack, setOpeningStack] = useState('0');
  const [quantity, SetQuantity] = useState(Array.from({ length: count }).map(() => ''));
  const [batchNo, setBatchNo] = useState(Array.from({ length: count }).map(() => ''));
  const [expDate, setExpDate] = useState(Array.from({ length: count }).map(() => ''));
  const [reorderPoint, setReorderPoint] = useState('');
  const [reorderQuantity, setReorderQuantity] = useState('');
  const [reorderQuantityUnit, setReorderQuantityUnit] = useState({ value: 'each', label: 'each' });
  const [isFoodItem, setIsFoodItem] = useState({ value: 'Not Applicable', label: 'Not Applicable' });
  const [units, setUnits] = useState('');
  const [minOrderQty, setMinOrderQty] = useState('');
  const [minOrderQtyUnit, setMinOrderQtyUnit] = useState({ value: 'each', label: 'each' });
  const [igst, setIgst] = useState('');
  const [sgst, setSgst] = useState('');
  const [cgst, setCgst] = useState('');
  const [cess, setCess] = useState('');
  const [images, setImages] = useState([]);
  const [isGen, setIsGen] = useState(false);
  const [isLocal, setIsLocal] = useState('');
  const [unitOption, setUnitOption] = useState({});
  const [spOption, setSpOption] = useState({ value: 'each', label: 'each' });
  const [marginType, setMarginType] = useState({ value: '%', label: '%' });
  const [marginBased, setMarginBased] = useState({ value: 'mrp', label: 'MRP' });
  const [marginValue, setMarginValue] = useState(null);
  const [orgArray, setOrgArray] = useState([]);
  const [retailOrgArray, setRetailOrgArray] = useState([]);
  const [vmsOrgArray, setVMSOrgArray] = useState([]);
  const [productData, setProductData] = useState([1]);
  const [blobImages, setBlobImages] = useState([]);
  const [description, setDescription] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [isUpload, setIsUpload] = useState(false);
  const [weighingScale, setWeighingScale] = useState(false);
  const [weighingScaleUnit, setWeighingScaleUnit] = useState({ value: 'Kilograms', label: 'kg' });
  const [secWeighingCheckBox, setSecWeighingCheckBox] = useState(false);
  const [secondaryWeighingUnit, setSecondaryWeighingUnits] = useState([]);
  const [secondarySPOption, setSecondarySpOption] = useState([{ value: 'each', label: 'each' }]);
  const [secWeighingCount, setSecWeighingCount] = useState(1);
  const [brandName, setBrandName] = useState('');
  const [mainCatArr, setMainCatArr] = useState([]);
  const [arr, setArr] = useState([]);
  const [cng, setCng] = useState(false);
  const [saveLoader, setSaveLoader] = useState(false);

  const [open, setOpen] = useState(false);
  const [batchPresent, setBatchPresent] = useState(false);
  const [severity, setSeverity] = useState('success');
  const [errormsg, setErrorMsg] = useState('');
  const [count, SetCount] = useState(0);
  const user_details = localStorage.getItem('user_details');
  const createdById = user_details && JSON.parse(user_details).uidx;

  const handleAddmore = () => {
    SetCount(count + 1);
  };

  const dates = expDate?.map((dateStr) => new Date(dateStr));

  const highestDateIndex = dates?.reduce((maxIndex, currentDate, currentIndex) => {
    return currentDate > dates[maxIndex] ? currentIndex : maxIndex;
  }, 0);

  const navigate = useNavigate();

  const locId = localStorage.getItem('locId');
  const user_name = localStorage.getItem('user_name');
  const orgId = localStorage.getItem('orgId');
  const contextType = localStorage.getItem('contextType');

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    const payload = {
      page: 1,
      pageSize: 100,
    };

    getAllMainCategory(payload).then((response) => {
      setArr(response.data.data.results);
      setCng(!cng);
    });
  }, []);

  useEffect(() => {
    const cat = [];
    arr.map((e) => {
      if (e !== undefined) {
        cat.push({ value: e.mainCategoryId, label: e.categoryName });
      }
    });
    setMainCatArr(cat);
  }, [cng]);
  const mainCatgSelected = mainCatArr.find((opt) => !!opt.value);

  const [mainCatSelected, setMainCat] = useState(mainCatgSelected);

  const [catLevel1, setCatLevel1] = useState([]);
  const [arr1, setArr1] = useState([]);
  const [cng1, setCng1] = useState(false);

  useEffect(() => {
    const payload = {
      page: 1,
      pageSize: 100,
      mainCategoryId: [mainCatSelected?.value],
    };

    if (isGen) {
      return;
    }
    if (mainCatSelected) {
      getAllLevel1Category(payload).then((response) => {
        setArr1(response.data.data.results);
        setCng1(!cng1);
      });
    }
  }, [mainCatSelected]);

  useEffect(() => {
    const cat = [];
    arr1?.map((e) => {
      cat.push({ value: e?.level1Id, label: e?.categoryName });
    });

    setCatLevel1(cat);
  }, [cng1]);

  const catLevel1gSelected = catLevel1.find((opt) => !!opt.value);
  const [cat1, setCat1] = useState(catLevel1gSelected);

  const [catLevel2, setCatLevel2] = useState([]);
  const [arr2, setArr2] = useState([]);
  const [cng2, setCng2] = useState(false);
  const [cng3, setCng3] = useState(false);

  useEffect(() => {
    const payload = {
      page: 1,
      pageSize: 100,
      level1Id: [cat1?.value],
    };

    if (cat1) {
      if (isGen) {
        getCatLevel2ByName(cat1?.label)
          .then((res) => {
            setArr2(res.data);
            setCng3(!cng3);
          })
          .catch((err) => {});
      } else {
        getAllLevel2Category(payload)
          .then((response) => {
            setArr2(response.data.data.results);
            setCng2(!cng2);
          })
          .catch((error) => {});
      }
    }
  }, [cat1]);

  useEffect(() => {
    if (!isGen) {
      if (cat1) {
        const item = arr2?.find((e) => e.categoryName === cat2.label);
        setIgst(item?.igst || productData?.igst);
        setHsn(item?.hsnCode || productData?.hs_code);
        setSgst(item?.sgst || productData?.sgst);
        setCgst(item?.cgst || productData?.cgst);
      }
    }
  }, [cng3]);

  useEffect(() => {
    const cat = [];
    arr2?.map((e) => {
      cat.push({ value: e.level2Id, label: e.categoryName, hsn: e.hsnCode, igst: e.igst, sgst: e.sgst, cgst: e.cgst });
    });

    setCatLevel2(cat);
  }, [cng2]);

  const catLevel2gSelected = catLevel2.find((opt) => !!opt.value);
  const [cat2, setCat2] = useState(catLevel2gSelected);

  const handleSave = () => {
    const inventoryData = Array.from({ length: count }).map((_, index) => ({
      quantity: Number(quantity[index]),
      expiryDate: expDate[index],
      purchasePrice: Number(purchasePrice[index]),
      sellingPrice: Number(salePrice[index]),
      mrp: Number(mrp[index]),
      batchId: batchNo[index],
      availableUnits: Number(quantity[index]),
    }));

    const sortedInventoryData = inventoryData.sort((a, b) => {
      const aExpiryDate = new Date(a.expiryDate);
      const bExpiryDate = new Date(b.expiryDate);
      return aExpiryDate - bExpiryDate;
    });

    // const hasEmptyValue = sortedInventoryData.every((item) => {
    //   return Object.keys(item).every((key) => key === 'inventoryId' || (item[key] !== undefined && !isNaN(item[key])));
    // });
    const hasEmptyValue = inventoryData.some((item) => {
      return (
        item.batchId === undefined ||
        isNaN(item.quantity) ||
        isNaN(item.purchasePrice) ||
        isNaN(item.sellingPrice) ||
        isNaN(item.mrp)
      );
    });
    const newBarcode = barcode !== '' ? barcode : manBarcode;
    const igstValue = igst === 0 ? '0' : igst;
    const title = bundle ? bundleTitle : productTitle;
    if (
      !title ||
      !mainCatSelected?.label ||
      !cat1?.label ||
      !cat2?.label ||
      !hsn ||
      !igstValue ||
      !manufacturer?.label
      // || !units
      // || hasEmptyValue
    ) {
      setSeverity('warning');
      setErrorMsg('Please fill all required fields');
      setOpen(true);
      return;
    }
    if (!weighingScale && !newBarcode) {
      setSeverity('warning');
      setErrorMsg('Please fill all required fields');
      setOpen(true);
      return;
    }
    if (hasEmptyValue) {
      setSeverity('warning');
      setErrorMsg('Please fill all batch values or remove the batch');
      setOpen(true);
      return;
    }
    // if (batchPresent) {
    if (contextType === 'WMS') {
      setOrgArray([...orgArray, orgArray.push(orgId, locId)]);
      setRetailOrgArray([...retailOrgArray]);
      setVMSOrgArray([...vmsOrgArray]);
    } else if (contextType === 'RETAIL') {
      setOrgArray([...orgArray]);
      setRetailOrgArray([...retailOrgArray, retailOrgArray.push(orgId, locId)]);
      setVMSOrgArray([...vmsOrgArray]);
    } else if (contextType === 'VMS') {
      setOrgArray([...orgArray]);
      setRetailOrgArray([...retailOrgArray]);
      setVMSOrgArray([...vmsOrgArray, vmsOrgArray.push(orgId, locId)]);
    }
    const uniqueOrgs = [...new Set(orgArray)].filter(Boolean).filter((e) => e !== 'string' && isNaN(e));
    const retailuniqueOrgs = [...new Set(retailOrgArray)].filter(Boolean).filter((e) => e !== 'string' && isNaN(e));
    const vmsuniqueOrgs = [...new Set(vmsOrgArray)].filter(Boolean).filter((e) => e !== 'string' && isNaN(e));

    const languages = inputlist?.filter((e) => e.name);
    const storeCode = itemReferences !== '' ? locId + '_' + itemReferences : null;
    const payload = {
      id: null,
      brand: brandName?.label,
      name: productTitle ? removeExtraSpaces(productTitle) : removeExtraSpaces(bundleTitle),
      description: description || '',
      derived_description: null,
      gtin: weighingScale ? '' : barcode !== '' ? barcode : manBarcode,
      caution: null,
      sku_code: null,
      isLocalProduct: 'yes',
      main_category: mainCatSelected?.label,
      category_level_1: cat1?.label,
      category_level_2: cat2?.label,
      main_category_id: mainCatSelected?.value,
      category_level_1_id: cat1?.value,
      category_level_2_id: cat2?.value,
      gs1category: null,
      gs1sub_category: null,
      gpc_code: null,
      minimum_order_quantity: minOrderQty,
      minimum_order_quantity_unit: minOrderQtyUnit?.label,
      created_by: user_name,
      compare_price: comparePrice,
      marketing_info: null,
      url: null,
      activation_date: null,
      deactivation_date: null,
      country_of_origin: null,
      created_date: null,
      modified_date: null,
      type: null,
      primary_gtin: null,
      published: null,
      gs1_images: {
        front: null,
        back: null,
        top: null,
        bottom: null,
        left: null,
        right: null,
        top_left: null,
        top_right: null,
      },
      images: {
        front: productData?.images?.front || null,
        back: productData?.images?.back || null,
        top: productData?.images?.top || null,
        bottom: productData?.images?.bottom || null,
        left: productData?.images?.left || null,
        right: productData?.images?.right || null,
        top_left: productData?.images?.top_left || null,
        top_right: productData?.images?.top_right || null,
      },
      company_detail: {
        name: manufacturer?.label,
      },
      weights_and_measures: {
        measurement_unit: spOption?.value,
        net_weight: units,
        gross_weight: null,
        net_content: null,
      },
      dimensions: {
        measurement_unit: null,
        height: null,
        width: null,
        depth: null,
      },
      case_configuration: {
        gtin: barcode !== '' ? barcode : manBarcode,
        quantity: null,
        height: null,
        width: null,
        depth: null,
        weight: null,
        weight_measurement_unit: null,
        dimension_measurement_unit: null,
        pack_type: null,
      },
      mrp: {
        mrp: inventoryData?.length > 0 ? mrp[highestDateIndex] : cmsMRP || 0,
        target_market: null,
        activation_date: null,
        currency: null,
        location: null,
      },
      hs_code: hsn || 0,
      igst: igst || 0,
      cgst: cgst || 0,
      sgst: sgst || 0,
      cess: cess || 0,
      returnable: returnable,
      sell_out_of_stock: sellOutOfStock,
      min_order_value: null,
      attributes: {
        nutritional_information: null,
        ingredients: null,
        ingredients_image: null,
        ean_image: null,
        storage_condition: null,
        storage_instruction: null,
        storage_temperature: {
          value: null,
          unit: null,
        },
        regulatory_data: {
          fssai_lic_no: null,
          isi_no: null,
          agmark_ca_number: null,
          agmark_ca_number_validity_period: null,
          organic: orgainc,
          organic_certificate: null,
        },
        shelf_life: {
          value: null,
          unit: null,
          based_on: null,
          shelf_life_image: null,
        },
        food_type: isFoodItem?.value,
        product_type_generic_name: null,
        product_variant: null,
        variant_sku: null,
        variant_default_image: null,
        health_benefit: null,
        imported_product: null,
        importer_packer_name_address: null,
        manufacturing_license_image: null,
        bogo_offers: null,
        kitted: null,
        maximum_order_quantity: null,
        keywords: null,
        form: null,
        sachet_article: null,
        weighted_item: null,
        box_contents: null,
        grain_size: null,
        packing_material_internal: null,
        packing_material_external: null,
        rigidity_of_packing: null,
        caution_warning: null,
        direction_how_to_use: null,
        direction_how_to_use_image: null,
        carbohydrates: null,
        vegan: null,
        pre_cooked: null,
        dairy_supplement: null,
        eggless: null,
        gluten_free: null,
        lactose_free: null,
        alcohol_free: null,
        speciality: null,
        product_flavour: null,
        artificial_flavour: null,
        added_flavors: null,
        added_preservatives: null,
        added_fruit: null,
        added_colours: null,
        artificial_colours: null,
        oil_extraction: null,
        allergen_information: null,
        microwaveable: null,
        safe_for_children: null,
        age_limit: null,
        productPackaging: {
          conveyable: null,
          crush_factor_for_carton: null,
          recyclable_packaging: null,
          bio_degradable_packaging: null,
        },
        product_on_recall: null,
        batch_number: null,
      },
      language: {
        nativeLanguages: languages,
      },
      productSource: {
        sourceId: orgId,
        sourceLocationId: locId,
        sourceType: contextType,
        productStatus: 'CREATED',
        // createdDate: new Date(),
        productVisibility: 'LOCAL',
        supportedWarehouses: uniqueOrgs,
        supportedVendors: preferredVendor?.value ? [preferredVendor?.value] : [],
        supportedVendorNames: preferredVendor?.label ? [preferredVendor?.label] : [],
        supportedRetails: retailuniqueOrgs,
        marketPlaceSellers: vmsuniqueOrgs,
        imageStatus: null,
        tenantId: null,
        tags: tags?.map((e) => {
          return e.toUpperCase();
        }),
        bundledGtins: bundleGtin,
      },
      storeItemReferences: storeCode === null ? [] : [storeCode],
      is_gs1_product: false,
    };
    if (secWeighingCheckBox) {
      payload.weights_and_measures.secondarySpecs = Array.from({ length: secWeighingCount }).map((e, index) => ({
        measurement_unit: secondarySPOption[index]?.value,
        net_weight: secondaryWeighingUnit[index],
        gross_weight: secondaryWeighingUnit[index],
        net_content: secondaryWeighingUnit[index],
      }));
    }
    if (weighingScale) {
      (payload.packaging_type = 'weighingScale'), (payload.sellingUnit = weighingScaleUnit?.label);
    } else {
      payload.packaging_type = 'standard';
    }
    const payloaddata = {
      productId: barcode !== '' ? barcode : manBarcode,
      locationId: locId,
      unitType: spOption?.value,
      continueSelling: sellOutOfStock,
      threshHold: sellOutOfStock === 'N' ? 0 : 999999,
      overSold: 0,
      createdBy: user_name,
      sourceId: locId,
      sourceName: null,
      category: mainCatSelected?.label,
      subCategory: cat1?.label,
      openingStock: openingStack,
      specification: units,
      reorderPoint: reorderPoint,
      gtin: barcode !== '' ? barcode : manBarcode,
      status: null,
      orgId: orgId,
      reorderQuantity: reorderQuantity,
      reorderQuantityType: reorderQuantityUnit.label,
      comparePrice: comparePrice,
      minimumOrderQuantity: minOrderQty,
      minimumOrderQuantityUnit: minOrderQtyUnit?.label,
      brand: manufacturer?.label,
      locationType: contextType,
      itemName: removeExtraSpaces(productTitle) || bundleTitle,
      purchaseIGst: igst || 0,
      purchaseCGst: cgst || 0,
      purchaseSGst: sgst || 0,
      sellingCESS: cess || 0,
      multipleBatchCreations: sortedInventoryData,
      skuid: barcode !== '' ? barcode : manBarcode,
      marginValue: marginValue,
      marginType: marginType?.label,
      marginBasedOn: marginBased?.value,
    };
    if (weighingScale) {
      payloaddata.sellingUnit = weighingScaleUnit?.label;
      payloaddata.packagingType = 'weighingScale';
    } else {
      payloaddata.packagingType = 'standard';
    }
    setSaveLoader(true);
    const formData = new FormData();
    formData.append(
      'product',
      new Blob([JSON.stringify(payload)], {
        type: 'application/json',
      }),
    );
    if (blobImages.length === 0) {
      formData.append('files', []);
    } else {
      blobImages.forEach((item) => {
        formData.append('files', item);
      });
    }

    const newSwal = Swal.mixin({
      customClass: {
        confirmButton: 'button button-success',
        cancelButton: 'button button-error',
      },
      buttonsStyling: false,
    });

    newSwal
      .fire({
        title: 'Are you sure?',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Create',
      })
      .then((result) => {
        if (result.isConfirmed) {
          if (isGen) {
            const globalPayload = {
              storeId: orgId,
              storeLocationId: locId,
              productIds: [barcode],
            };
            // addGlobalProduct(globalPayload)
            //   .then((res) => {
            //     addProductInventory(payloaddata)
            //       .then((res) => {
            //         setSaveLoader(false);
            //         Swal.fire({
            //           icon: 'success',
            //           title: 'Product has been created',
            //           showConfirmButton: true,
            //           confirmButtonText: 'OK',
            //         }).then(() => {
            //           navigate('/products/all-products');
            //         });
            //       })
            //       .catch((err) => {
            //         setSaveLoader(false);
            //         Swal.fire({
            //           icon: 'error',
            //           title: 'Unable to create product',
            //           showConfirmButton: true,
            //           confirmButtonText: 'OK',
            //         });
            //       });
            //   })
            //   .catch((err) => {
            //     setSaveLoader(false);
            //     Swal.fire({
            //       icon: 'error',
            //       title: 'Unable to create product',
            //       showConfirmButton: true,
            //       confirmButtonText: 'OK',
            //     });
            //   })
            //   .catch((err) => {});
          } else {
            if (!blobImages.length) {
              addProduct(payload)
                .then((res) => {
                  payloaddata.gtin = res?.data?.data?.gtin;
                  addProductInventory(payloaddata)
                    .then((res) => {
                      setSaveLoader(false);
                      Swal.fire({
                        icon: 'success',
                        title: 'Product has been created',
                        showConfirmButton: true,
                        confirmButtonText: 'OK',
                      }).then(() => {
                        navigate('/products/all-products');
                      });
                    })
                    .catch((err) => {
                      setSaveLoader(false);
                      Swal.fire({
                        icon: 'error',
                        title: 'Unable to add inventory data',
                        showConfirmButton: true,
                        confirmButtonText: 'OK',
                      });
                    });
                })
                .catch((err) => {
                  setSaveLoader(false);
                  Swal.fire({
                    icon: 'error',
                    title: 'Unable to create product',
                    showConfirmButton: true,
                    confirmButtonText: 'OK',
                  });
                });
            } else {
              addProductWithImages(formData)
                .then((res) => {
                  payloaddata.gtin = res?.data?.data?.gtin;
                  addProductInventory(payloaddata)
                    .then((res) => {
                      setSaveLoader(false);
                      Swal.fire({
                        icon: 'success',
                        title: 'Product has been created',
                        showConfirmButton: true,
                        confirmButtonText: 'OK',
                      }).then(() => {
                        navigate('/products/all-products');
                      });
                    })
                    .catch((err) => {
                      setSaveLoader(false);
                      Swal.fire({
                        icon: 'error',
                        title: 'Unable to create product',
                        showConfirmButton: true,
                        confirmButtonText: 'OK',
                      });
                    });
                })
                .catch((err) => {
                  setSaveLoader(false);
                  Swal.fire({
                    icon: 'error',
                    title: 'Unable to create product',
                    showConfirmButton: true,
                    confirmButtonText: 'OK',
                  });
                });
            }
          }
        } else {
          setSaveLoader(false);
        }
      });
    // } else {
    //   setSeverity('error');
    //   setErrorMsg('Update Batch Number');
    //   setOpen(true);
    // }
  };
  const [keyValue, setKeyValue] = useState(0);
  const clearing = () => {
    setKeyValue((prev) => {
      return (prev = prev + 1);
    });
  };
  const resetState = () => {
    setProductTitle(null);
    setHsn('');
    setManufacturer(null);
    setPreferredVendor(null);
    setBarcode('');
    setManBarcode('');
    setComparePrice('N');
    setReturnable('N');
    setSellOutOfStock('N');
    setIsFood(false);
    setInputlist([{}]);
    setSpecification('');
    setMrp('');
    setSalePrice('');
    setPurchasePrice('');
    setOpeningStack('0');
    SetQuantity(Array.from({ length: count }).map(() => ''));
    setBatchNo(Array.from({ length: count }).map(() => ''));
    setExpDate(Array.from({ length: count }).map(() => ''));
    setReorderPoint('');
    setReorderQuantity('');
    setReorderQuantityUnit({ value: 'each', label: 'each' });
    setIsFoodItem({ value: 'Not Applicable', label: 'Not Applicable' });
    setUnits('');
    setMinOrderQty('');
    setMinOrderQtyUnit({ value: 'each', label: 'each' });
    setIgst('');
    setSgst('');
    setCgst('');
    setImages([]);
    setIsGen(false);
    setIsLocal('');
    setUnitOption({});
    setSpOption({ value: 'each', label: 'each' });
    setMarginType({ value: '%', label: '%' });
    setMarginBased({ value: 'pp', label: 'Purchase Price' });
    setMarginValue('0');
    setOrgArray([]);
    setRetailOrgArray([]);
    setVMSOrgArray([]);
    setProductData([1]);
    setBlobImages([]);
    setDescription('');
    setSelectedImages([]);
    setIsUpload(false);
    setWeighingScale(false);
    setWeighingScaleUnit({ value: 'Kilograms', label: 'kg' });
    // setMainCatArr([]);
    // setArr([]);
    setCng(false);

    // Reset the additional state variables
    setMainCat('');
    setCatLevel1([]);
    // setArr1([]);
    setCng1(false);
    setCat1('');
    setCatLevel2([]);
    // setArr2([]);
    setCng2(false);
    setCng3(false);
    SetCount(1);
    setTags([]);
    setitemReferences('');
  };

  const isMobileDevice = isSmallScreen();

  const isHidden = React.useMemo(
    () => location?.pathname !== '/products/all-products/add-products',
    [location?.pathname],
  );

  return (
    <DashboardLayout>
      {!isMobileDevice && <DashboardNavbar prevLink={true} />}
      {isMobileDevice && (
        <SoftBox className="navbar-main-div-mob-bg po-box-shadow nav-pos-mob">
          <MobileNavbar title={'Add Product'} prevLink={true} />
        </SoftBox>
      )}
      <SoftBox my={3} key={keyValue}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={4}>
            <ProductImage
              images={images}
              setImages={setImages}
              isGen={isGen}
              setIsGen={setIsGen}
              setBlobImages={setBlobImages}
              blobImages={blobImages}
              selectedImages={selectedImages}
              setSelectedImages={setSelectedImages}
              isUpload={isUpload}
              setIsUpload={setIsUpload}
            />
          </Grid>
          <Grid item xs={12} lg={8}>
            <ProductInfo
              sellOutOfStock={sellOutOfStock}
              setOrganic={setOrganic}
              orgainc={orgainc}
              returnable={returnable}
              comparePrice={comparePrice}
              clearing={resetState}
              productTitle={productTitle}
              setProductTitle={setProductTitle}
              setMainCat={setMainCat}
              setManufacturer={setManufacturer}
              manufacturer={manufacturer}
              setPreferredVendor={setPreferredVendor}
              preferredVendor={preferredVendor}
              setComparePrice={setComparePrice}
              setReturnable={setReturnable}
              setSellOutOfStock={setSellOutOfStock}
              setIsFood={setIsFood}
              setBarcode={setBarcode}
              setManBarcode={setManBarcode}
              barcode={barcode}
              manBarcode={manBarcode}
              inputlist={inputlist}
              isFood={isFood}
              setIsFoodItem={setIsFoodItem}
              mainCatArr={mainCatArr}
              mainCatSelected={mainCatSelected}
              catLevel1={catLevel1}
              cat1={cat1}
              setCat1={setCat1}
              setCat2={setCat2}
              cat2={cat2}
              catLevel2={catLevel2}
              setInputlist={setInputlist}
              setTags={setTags}
              tags={tags}
              bundleGtin={bundleGtin}
              setBundleGtin={setBundleGtin}
              bundleTitle={bundleTitle}
              setBundleTitle={setBundleTitle}
              cng2={cng2}
              setCatLevel2={setCatLevel2}
              hsn={hsn}
              setHsn={setHsn}
              igst={igst}
              setIgst={setIgst}
              cmsMRP={cmsMRP}
              setCMSMrp={setCMSMrp}
              setUnits={setUnits}
              units={units}
              images={images}
              setImages={setImages}
              setBlobImages={setBlobImages}
              blobImages={blobImages}
              isGen={isGen}
              setIsGen={setIsGen}
              setIsLocal={setIsLocal}
              unitOption={unitOption}
              setUnitOption={setUnitOption}
              setOrgArray={setOrgArray}
              setRetailOrgArray={setRetailOrgArray}
              setVMSOrgArray={setVMSOrgArray}
              orgArray={orgArray}
              retailOrgArray={retailOrgArray}
              vmsOrgArray={vmsOrgArray}
              productData={productData}
              setProductData={setProductData}
              minOrderQty={minOrderQty}
              setMinOrderQty={setMinOrderQty}
              minOrderQtyUnit={minOrderQtyUnit}
              setMinOrderQtyUnit={setMinOrderQtyUnit}
              description={description}
              setDescription={setDescription}
              setSgst={setSgst}
              setCgst={setCgst}
              setWeighingScale={setWeighingScale}
              weighingScale={weighingScale}
              setWeighingScaleUnit={setWeighingScaleUnit}
              weighingScaleUnit={weighingScaleUnit}
              setMarginBased={setMarginBased}
              brandName={brandName}
              setBrandName={setBrandName}
              cess={cess}
              setCess={setCess}
              itemReferences={itemReferences}
              setitemReferences={setitemReferences}
            />
          </Grid>

          {!isHidden && (
            <>
              <Grid item xs={12} lg={12}>
                <Pricing
                  setReorderPoint={setReorderPoint}
                  setReorderQuantity={setReorderQuantity}
                  setOpeningStack={setOpeningStack}
                  setSpecification={setSpecification}
                  mrp={mrp}
                  setMrp={setMrp}
                  setSalePrice={setSalePrice}
                  setPurchasePrice={setPurchasePrice}
                  setUnits={setUnits}
                  units={units}
                  isGen={isGen}
                  setIsGen={setIsGen}
                  unitOption={unitOption}
                  setUnitOption={setUnitOption}
                  setSpOption={setSpOption}
                  setMarginType={setMarginType}
                  setMarginBased={setMarginBased}
                  setMarginValue={setMarginValue}
                  marginValue={marginValue}
                  marginBased={marginBased}
                  marginType={marginType}
                  spOption={spOption}
                  salePrice={salePrice}
                  purchasePrice={purchasePrice}
                  reorderPoint={reorderPoint}
                  openingStack={openingStack}
                  batchNo={batchNo}
                  setBatchNo={setBatchNo}
                  expDate={expDate}
                  setExpDate={setExpDate}
                  reorderQuantity={reorderQuantity}
                  setReorderQuantityUnit={setReorderQuantityUnit}
                  reorderQuantityUnit={reorderQuantityUnit}
                  weighingScale={weighingScale}
                  secWeighingCheckBox={secWeighingCheckBox}
                  setSecWeighingCheckBox={setSecWeighingCheckBox}
                  secondaryWeighingUnit={secondaryWeighingUnit}
                  setSecondaryWeighingUnits={setSecondaryWeighingUnits}
                  secondarySPOption={secondarySPOption}
                  setSecondarySpOption={setSecondarySpOption}
                  secWeighingCount={secWeighingCount}
                  setSecWeighingCount={setSecWeighingCount}
                />
              </Grid>

              <Grid item xs={12} lg={12}>
                <PricingField
                  setReorderPoint={setReorderPoint}
                  setReorderQuantity={setReorderQuantity}
                  setOpeningStack={setOpeningStack}
                  setSpecification={setSpecification}
                  mrp={mrp}
                  setMrp={setMrp}
                  setSalePrice={setSalePrice}
                  setPurchasePrice={setPurchasePrice}
                  setUnits={setUnits}
                  units={units}
                  isGen={isGen}
                  setIsGen={setIsGen}
                  unitOption={unitOption}
                  setUnitOption={setUnitOption}
                  setSpOption={setSpOption}
                  spOption={spOption}
                  salePrice={salePrice}
                  purchasePrice={purchasePrice}
                  reorderPoint={reorderPoint}
                  openingStack={openingStack}
                  batchNo={batchNo}
                  setBatchNo={setBatchNo}
                  expDate={expDate}
                  setExpDate={setExpDate}
                  reorderQuantity={reorderQuantity}
                  setReorderQuantityUnit={setReorderQuantityUnit}
                  reorderQuantityUnit={reorderQuantityUnit}
                  handleAddmore={handleAddmore}
                  SetCount={SetCount}
                  count={count}
                  SetQuantity={SetQuantity}
                  quantity={quantity}
                  barcode={barcode}
                  manBarcode={manBarcode}
                  setSeverity={setSeverity}
                  setErrorMsg={setErrorMsg}
                  setOpen={setOpen}
                  setBatchPresent={setBatchPresent}
                  weighingScale={weighingScale}
                />
              </Grid>
            </>
          )}
        </Grid>
        <SoftBox display="flex" justifyContent="flex-end" mt={4} mb={4}>
          <SoftBox display="flex">
            <SoftButton
              onClick={() => navigate('/products/all-products/')}
              variant={buttonStyles.secondaryVariant}
              className="vendor-second-btn outlined-softbutton"
            >
              Cancel
            </SoftButton>
            <SoftBox ml={2}>
              <SoftButton
                // variant="gradient"
                disabled={saveLoader}
                variant={buttonStyles.primaryVariant}
                className="vendor-add-btn contained-softbutton"
                onClick={() => handleSave()}
              >
                Save
              </SoftButton>
            </SoftBox>
          </SoftBox>
        </SoftBox>
      </SoftBox>
      <Footer />
      <Snackbar open={open} autoHideDuration={3000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity={severity} sx={{ width: '100%' }}>
          {errormsg}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
};
