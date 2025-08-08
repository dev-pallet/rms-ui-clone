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

import { useState } from 'react';

// @mui material components
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';

// Soft UI Dashboard PRO React components
import SoftBox from 'components/SoftBox';
import SoftButton from 'components/SoftButton';
import SoftInput from 'components/SoftInput';
import SoftSelect from 'components/SoftSelect';
import SoftTypography from 'components/SoftTypography';
// NewProduct page components
import './info.css';
import 'react-quill/dist/quill.snow.css';
import { Chip } from '@mui/material';
import { buttonStyles } from '../../../../../../Common/buttonColor';
import { debounce } from 'lodash';
import {
  filterVendorSKUData,
  getAllBrands,
  getAllManufacturerV2,
  getInventoryBatchByGtin,
} from '../../../../../../../../config/Services';
import {
  generateBarcode,
  generateBarcodeWithNum,
  getAllVendors,
  getItemsInfo,
  getProductDetails,
} from 'config/Services';
import { getValueAfterSecondUnderscore } from '../../../../../../Common/cartUtils';
import { isSmallScreen } from '../../../../../../Common/CommonFunction';
import { productSuggestionSearch } from 'config/Services';
import { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import FormField from 'layouts/ecommerce/product/all-products/components/edit-product/components/FormField/index';
import InventoyBatcheswithgtin from './inventoyBatchesModal';
import Spinner from 'components/Spinner/index';
import TextField from '@mui/material/TextField';

const stateArr = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu and Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttarakhand',
  'Uttar Pradesh',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli',
  'Daman and Diu',
  'Delhi',
  'Lakshadweep',
  'Puducherry',
];

const cessArray = [
  { value: 0, label: '0 %' },
  { value: 1, label: '1 %' },
  { value: 3, label: '3 %' },
  { value: 5, label: '5 %' },
  { value: 12, label: '12 %' },
  { value: 15, label: '15 %' },
  { value: 17, label: '17 %' },
  { value: 21, label: '21 %' },
  { value: 22, label: '22 %' },
  { value: 36, label: '36 %' },
  { value: 60, label: '60 %' },
  { value: 61, label: '61 %' },
  { value: 65, label: '65 %' },
  { value: 71, label: '71 %' },
  { value: 72, label: '72 %' },
  { value: 89, label: '89 %' },
  { value: 96, label: '96 %' },
  { value: 142, label: '142 %' },
  { value: 160, label: '160 %' },
  { value: 204, label: '204 %' },
];
function ProductInfo({
  sellOutOfStock,
  returnable,
  comparePrice,
  clearing,
  productTitle,
  setProductTitle,
  setMainCat,
  setManufacturer,
  manufacturer,
  setPreferredVendor,
  preferredVendor,
  setComparePrice,
  setReturnable,
  setSellOutOfStock,
  setIsFood,
  inputlist,
  setBarcode,
  setManBarcode,
  barcode,
  manBarcode,
  isFood,
  setIsFoodItem,
  mainCatArr,
  mainCatSelected,
  cat1,
  setCat1,
  catLevel1,
  cat2,
  setCat2,
  catLevel2,
  setInputlist,
  cng2,
  setCatLevel2,
  hsn,
  setHsn,
  igst,
  setIgst,
  setCMSMrp,
  cmsMRP,
  units,
  setUnits,
  selectedImages,
  setSelectedImages,
  images,
  setImages,
  setBlobImages,
  blobImages,
  isGen,
  setIsGen,
  setIsLocal,
  unitOption,
  setUnitOption,
  resetForm,
  setOrgArray,
  setRetailOrgArray,
  setVMSOrgArray,
  orgArray,
  vmsOrgArray,
  retailOrgArray,
  setProductData,
  productData,
  minOrderQty,
  setMinOrderQty,
  minOrderQtyUnit,
  setMinOrderQtyUnit,
  setDescription,
  description,
  setSgst,
  setCgst,
  itemReferences,
  setitemReferences,
  setWeighingScale,
  weighingScale,
  weighingScaleUnit,
  setWeighingScaleUnit,
  setMarginBased,
  setTags,
  tags,
  bundleGtin,
  setBundleGtin,
  setBundleTitle,
  bundleTitle,
  setOrganic,
  orgainc,
  brandName,
  setBrandName,
  cess,
  setCess,
}) {
  const [IsreadOnly, setIsreadOnly] = useState(true);
  const [isBar, setIsBar] = useState(false);
  const [loader, setLoader] = useState(false);
  const [barImage, setBarImage] = useState('');
  const [tempTitle, setTempTitle] = useState('');
  const [manuTitle, setManuTitle] = useState('');
  const [vendorTitle, setVendorTitle] = useState('');
  const { bundle } = useParams();
  const [productTitleCount, setProductTitleCount] = useState(bundle === 'bundle' ? 2 : 1);
  const [barErr, setBarErr] = useState(false);
  const [brandList, setBrandList] = useState([]);
  const generateButton = useRef();
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const user_roles = localStorage.getItem('user_roles');
  const isSuperAdmin = user_roles.includes('SUPER_ADMIN');
  const isRetailAdmin = user_roles.includes('RETAIL_ADMIN');
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const filter = createFilterOptions();

  const handleRow = () => {
    setInputlist([...inputlist, { product_title: '', lang_location: '' }]);
  };

  const handleAddproduct = () => {
    setProductTitleCount(productTitleCount + 1);
  };
  const handleDeleteproduct = () => {
    setProductTitleCount(productTitleCount - 1);
  };
  const handleProdLang = (index, e) => {
    const { name, value } = e.target;
    const list = [...inputlist];
    list[index][name] = value;
    setInputlist(list);
  };

  const [searchRes, setSearchRes] = useState([]);
  const [sugOpp, setSugOpp] = useState([]);

  const [optionsArray, setOptionsArray] = useState([]);
  const [manuOptionsArray, setManuOptionsArray] = useState([]);
  const [vendorOptionsArray, setVendorOptionsArray] = useState([]);
  const handleSuggestion = (text) => {
    productSuggestionSearch(text).then((response) => {
      setSearchRes(response.data.products);
    });
  };

  useEffect(() => {
    const cat = [];
    searchRes?.map((e) => {
      cat.push({ value: e.gtin, label: e.name });
    });

    setSugOpp(cat);
  }, [searchRes]);

  useEffect(() => {
    const cat = [];
    sugOpp?.map((e) => {
      cat.push({ value: e.level2Id, label: e.categoryName });
    });

    setCatLevel2(cat);
  }, [cng2]);

  const handleRemove = (index) => {
    const list = [...inputlist];
    list.splice(index, 1);
    setInputlist(list);
  };
  const foodTypeOptions = [
    { value: 'Vegetarian', label: 'Vegetarian' },
    { value: 'Non Vegetarian', label: 'Non Vegetarian' },
    { value: 'Not Applicable', label: 'Not Applicable' },
  ];

  const genBarcode = () => {
    setLoader(true);
    if (manBarcode) {
      const payload = {
        page: '1',
        pageSize: '10',
        gtin: [manBarcode],
        supportedRetails: ['TWINLEAVES', orgId, locId],
      };
      filterVendorSKUData(payload).then((response) => {
        if (response?.data?.data?.products[0]) {
          setProductTitle(response?.data?.data?.products[0]?.name);
          setProductData(response?.data?.data?.products[0]);
          setIsGen(response?.data?.data?.products[0]?.productSource?.sourceId === orgId ? false : true);
          setIsLocal(response?.data?.data?.products[0]?.isLocalProduct);
          setTags(response?.data?.data?.products[0]?.productSource?.tags);
        }
      });
    }
    if (manBarcode) {
      generateBarcodeWithNum(manBarcode)
        .then((response) => {
          setBarcode(manBarcode);
          setBarImage(`data:image/png;base64,${response.data.data.image}`);
          setIsBar(true);
          setLoader(false);
          setBarErr(false);
        })
        .catch(() => {
          setBarErr(true);
          setLoader(false);
        });
      // } else if (weighingScale) {
      //   generateWeighingBarcode()
      //     .then((response) => {
      //       setBarcode(response.data.data.barcode);
      //       setManBarcode(response.data.data.barcode);
      //       setIsBar(true);
      //       // setBarImage(`data:image/png;base64,${response.data.data.image}`);
      //       setLoader(false);
      //       setBarErr(false);
      //     })
      //     .catch((e) => {
      //       setBarErr(true);
      //       setLoader(false);
      //     });
    } else {
      generateBarcode()
        .then((response) => {
          setBarcode(response.data.data.barcode);
          setManBarcode(response.data.data.barcode);
          setIsBar(true);
          setBarImage(`data:image/png;base64,${response.data.data.image}`);
          setLoader(false);
          setBarErr(false);
        })
        .catch((e) => {
          setBarErr(true);
          setLoader(false);
        });
    }
  };

  useEffect(() => {
    if (!isGen) {
      setHsn(cat2?.hsn || productData?.hs_code);
      setIgst(productData?.igst || cat2?.igst);
      setSgst(productData?.sgst || cat2?.sgst);
      setCgst(productData?.cgst || cat2?.cgst);
    }
  }, [cat2]);

  // const optionsArray = []
  useEffect(() => {
    if (tempTitle?.length > 2) {
      const payload = {
        page: '1',
        pageSize: '10',
        names: [tempTitle],
        // supportedRetails: ['TWINLEAVES', orgId, locId],
        supportedStore: [locId],
      };
      getItemsInfo(payload).then((response) => {
        setOptionsArray(response.data.data.products);
        // setOptArray([])
      });
    }
  }, [tempTitle]);

  // useEffect(() => {
  //   if (manBarcode) {
  //     const payload = {
  //       page: '1',
  //       pageSize: '10',
  //       gtin: [manBarcode],
  //       supportedRetails: ['TWINLEAVES', orgId, locId],
  //     };
  //     filterVendorSKUData(payload).then((response) => {
  //       // setOptionsArray(response.data.data.products);
  //       if (response?.data?.data?.products[0]) {
  //         setProductTitle(response?.data?.data?.products[0]?.name)
  //         setProductData(response?.data?.data?.products[0])
  //         setIsGen(response?.data?.data?.products[0]?.productSource?.sourceId === orgId ? false : true);
  //         setTags(response?.data?.data?.products[0]?.productSource?.tags)
  //         genBarcode()
  //       }
  //     });
  //   }
  // }, [manBarcode]);

  useEffect(() => {
    const delayedAPICall = debounce((payload) => {
      getAllBrands(payload)
        .then((res) => {
          const data = res?.data?.data?.results;
          // setBrandList(data);
          if (data.length > 0) {
            const brandArr = [];
            data.map((e) => {
              brandArr.push({ value: e?.brandId, label: e?.brandName });
            });
            setBrandList(brandArr);
          }
        })
        .catch((err) => {});
    }, 300);
    const payload = {
      page: 1,
      pageSize: 100,

      // page: 1,
      // pageSize: 20,
      // sourceId: [orgId],
      // sourceLocationId: [locId],
    };
    if (brandName) {
      payload.brandName = [brandName];
    }

    delayedAPICall(payload);

    return delayedAPICall.cancel;
  }, [brandName]);

  useEffect(() => {
    const delayedAPICall = debounce((payload) => {
      getAllManufacturerV2(payload).then((response) => {
        setManuOptionsArray(response?.data?.data?.results);
      });
    }, 300);

    const payload = {};

    if (manuTitle) {
      payload.manufacturerName = [manuTitle];
    }

    delayedAPICall(payload);

    return delayedAPICall.cancel;
  }, [manuTitle]);

  useEffect(() => {
    const filterObject = {
      page: 0,
      pageSize: 20,
      filterVendor: {
        searchText: vendorTitle,
      },
    };
    getAllVendors(filterObject, orgId).then((response) => {
      setVendorOptionsArray(response?.data?.data?.vendors);

      // setOptions()
    });
  }, [vendorTitle]);

  useEffect(() => {
    if (productTitle?.gtin) {
      getProductDetails(productTitle.gtin).then((response) => {
        setProductData(response?.data?.data);
        setIsGen(response?.data?.data?.productSource?.sourceId === orgId ? false : true);
        setTags(response?.data?.data?.productSource?.tags);
      });
      // generateButton.current.click()
      setTimeout(() => {
        generateButton.current.click();
      }, 1000);
    }
  }, [productTitle]);

  useEffect(() => {
    const options = [];
    optionsArray?.map((ele) => {
      options?.push({ label: ele.name, gtin: ele.gtin });
    });
    setOptArray(options);
  }, [optionsArray]);

  useEffect(() => {
    const manuOptions = [];
    manuOptionsArray?.map((ele) => {
      manuOptions?.push({ label: ele.manufacturerName });
    });
    setManuOptArray(manuOptions);
  }, [manuOptionsArray]);

  useEffect(() => {
    const vendorOptions = [];
    vendorOptionsArray?.map((ele) => {
      vendorOptions?.push({ label: ele.vendorName, value: ele.vendorId });
    });
    setVendorOptArray(vendorOptions);
  }, [vendorOptionsArray]);

  useEffect(() => {
    if (preferredVendor) {
      const vendorObj = vendorOptArray.find((e) => e.label === preferredVendor.label);
      setPreferredVendor(vendorObj);
    }
  }, [preferredVendor]);

  useEffect(() => {
    if (!productData.length) {
      setMainCat({ label: productData?.main_category || '', value: productData?.main_category_id || '' });
      setCat1({ label: productData?.category_level_1 || '', value: productData?.category_level_1_id || '' });
      setCat2({ label: productData?.category_level_2 || '', value: productData?.category_level_2_id || '' });
      setManBarcode(productData?.gtin);
      setManufacturer({ label: productData?.company_detail?.name, value: productData?.company_detail?.name });
      if (productData?.productSource?.supportedVendors?.length) {
        setPreferredVendor({
          label: productData?.productSource?.supportedVendorNames[0],
          value: productData?.productSource?.supportedVendors[0],
        });
      } else {
        setPreferredVendor({
          label: '',
          value: '',
        });
      }
      console.log(productData?.storeItemReferences[0]);
      setitemReferences(productData?.storeItemReferences[0]);
      setDescription(productData?.description);
      setCMSMrp(productData?.mrp.mrp);
      setUnits(productData?.weights_and_measures?.net_weight);
      setUnitOption({ label: productData?.weights_and_measures?.measurement_unit });

      let imageArray = [];
      imageArray.push(productData?.images?.front || null);
      imageArray.push(productData?.images?.back || null);
      imageArray.push(productData?.images?.top || null);
      imageArray.push(productData?.images?.bottom || null);
      imageArray.push(productData?.images?.left || null);
      imageArray.push(productData?.images?.right || null);
      imageArray.push(productData?.images?.top_left || null);
      imageArray.push(productData?.images?.top_right || null);
      imageArray = imageArray.filter(Boolean).filter((e) => e !== 'string');

      setOrgArray([...orgArray, ...productData?.productSource?.supportedWarehouses.filter((e) => e !== 'string')]);
      setRetailOrgArray([
        ...retailOrgArray,
        ...productData?.productSource?.supportedRetails.filter((e) => e !== 'string'),
      ]);

      // setVMSOrgArray([
      //   ...vmsOrgArray,
      //   ...productData?.productSource?.marketPlaceSellers?.filter((e) => e !== 'string'),
      // ]);

      setVMSOrgArray(
        productData?.productSource?.marketPlaceSellers
          ? [...vmsOrgArray, ...productData?.productSource?.marketPlaceSellers?.filter((e) => e !== 'string')]
          : [],
      );

      setImages(imageArray);
      setBlobImages([]);
    }
  }, [productData]);

  const clearValues = () => {
    window.location.reload(false);
  };

  const [inputValue, setInputValue] = useState('');

  const handleInputKeyDown = (event) => {
    if (event.key === 'Enter' && inputValue.trim() !== '') {
      setTags([...tags, inputValue.trim()]);
      setInputValue('');
    }
  };

  const handleInputBlur = () => {
    if (inputValue.trim() !== '') {
      setTags([...tags, inputValue.trim()]);
      setInputValue('');
    }
  };
  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    if (inputValue.includes(' ')) {
      setInputValue(inputValue.replace(/ /g, ''));
    } else {
      setInputValue(inputValue);
    }
  };

  const handleTagDelete = (tagToDelete) => {
    setTags(tags.filter((tag) => tag !== tagToDelete));
  };

  const [optArray, setOptArray] = useState([]);
  const [manuOptArray, setManuOptArray] = useState([]);
  const [vendorOptArray, setVendorOptArray] = useState([]);

  const [keyValue, setKeyValue] = useState(0);
  const [batchData, setBatchData] = useState([]);
  const [selectedproduct, setSelectedProduct] = useState([]);

  const handleGetBatchfromGtin = (newValue) => {
    getInventoryBatchByGtin(newValue?.gtin, locId)
      .then((res) => {
        if (res?.data?.data?.data) {
          setBatchData(res?.data?.data?.data || []);
          setSelectedProduct(newValue || []);
          handleOpen();
        }
      })
      .catch(() => {});
  };

  const isMobileDevice = isSmallScreen();

  return (
    <Card sx={{ overflow: 'visible' }} key={keyValue} className={`${isMobileDevice && 'po-box-shadow'}`}>
      <SoftBox p={3}>
        <SoftBox
          lineHeight={0}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: isMobileDevice ? 'space-between' : 'flex-start',
            gap: !isMobileDevice && '15px',
          }}
        >
          <SoftTypography variant="h5">Product Information </SoftTypography>
          <SoftButton
            // variant="gradient"
            // color="info"
            size="small"
            onClick={() => {
              setIsGen(false);
              clearing();
              setIsBar(false);
            }}
            variant={buttonStyles.secondaryVariant}
            // className="vendor-add-btn contained-softbutton"
            className="outlined-softbutton"
          >
            Clear
          </SoftButton>
        </SoftBox>
        <InventoyBatcheswithgtin
          handleClose={handleClose}
          handleOpen={handleOpen}
          open={open}
          setOpen={setOpen}
          batchData={batchData}
          selectedproduct={selectedproduct}
        />
        {/* </SoftTypography> */}

        <SoftBox mt={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <SoftBox ml={0.5} lineHeight={0} display="inline-block">
                <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                  Barcode
                </InputLabel>
              </SoftBox>
              <div className="barcode-container">
                <SoftInput
                  error={barErr ? true : false}
                  success={isBar ? true : false}
                  sx={{ marginRight: '1rem' }}
                  type="text"
                  disabled={isBar || isGen || weighingScale ? true : false}
                  value={manBarcode}
                  onChange={(e) => setManBarcode(e.target.value)}
                />
                {!weighingScale && (
                  <SoftButton
                    disabled={barcode !== '' ? true : false}
                    // variant="gradient"
                    variant={buttonStyles.primaryVariant}
                    className="vendor-add-btn contained-softbutton"
                    size="small"
                    onClick={genBarcode}
                    ref={generateButton}
                  >
                    Generate
                  </SoftButton>
                )}
              </div>
            </Grid>
            {loader ? (
              <Grid item xs={12} sm={6}>
                <SoftBox>
                  <SoftBox mt={4.5} ml={17} lineHeight={0} display="inline-block">
                    <Spinner />
                  </SoftBox>
                </SoftBox>
              </Grid>
            ) : barErr ? (
              <Grid item xs={12} sm={6} />
            ) : !weighingScale ? (
              <Grid item xs={12} sm={6}>
                <SoftBox>
                  <SoftBox mt={2} className="image-container" lineHeight={0} display="inline-block">
                    <img
                      style={{
                        display: barcode ? 'block' : 'none',
                        objectFit: 'cover',
                        height: '90px',
                        margin: '0 auto',
                      }}
                      src={barImage}
                      alt=""
                    />
                  </SoftBox>
                </SoftBox>
              </Grid>
            ) : (
              <Grid item xs={12} sm={6}></Grid>
            )}

            <Grid item xs={12} sm={12}>
              <SoftBox mb={1} lineHeight={0}>
                <SoftBox mb={1} lineHeight={0} display="inline-block">
                  <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                    {bundle === 'bundle' ? 'Bundle Title' : 'Product Title'}
                  </InputLabel>
                </SoftBox>
                {bundle === 'bundle' ? (
                  <SoftInput
                    placeholder="Enter bundle Title"
                    onChange={(e) => setBundleTitle(e.target.value)}
                  ></SoftInput>
                ) : (
                  <div style={{ marginTop: '7px' }}>
                    <Autocomplete
                      value={productTitle}
                      disabled={isGen ? true : false}
                      onChange={(event, newValue) => {
                        if (typeof newValue === 'string') {
                          setProductTitle(newValue);
                          // setTempTitle(event.target.value)
                        } else if (newValue && newValue.inputValue) {
                          // Create a new value from the user input
                          setProductTitle(newValue.inputValue);
                          // setTempTitle(newValue.inputValue)
                        } else {
                          setProductTitle(newValue);
                          // setTempTitle(newValue)
                        }
                      }}
                      filterOptions={(options, params) => {
                        const filtered = filter(options, params);

                        const { inputValue } = params;
                        // Suggest the creation of a new value
                        const isExisting = options.some((option) => inputValue === option.label);
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
                      id="free-solo-with-text-demo"
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
                      renderOption={(props, option) => <li {...props}>{option.label}</li>}
                      // sx={{ width: 300 }}
                      freeSolo
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          onChange={(event) => setTempTitle(event.target.value)}
                          placeholder="Enter product title, e.g. Sugar"
                          style={{ width: '100%' }}
                          fullWidth
                        />
                      )}
                    />
                  </div>
                )}

                {bundle === 'bundle' && (
                  <>
                    <SoftBox m={0.5} lineHeight={0} display="inline-block">
                      <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                        Add Product{' '}
                      </InputLabel>
                    </SoftBox>
                    {Array.from({ length: productTitleCount }).map((_, index) => (
                      <div style={{ marginTop: '7px', position: 'relative' }}>
                        <Autocomplete
                          // value={productTitle}
                          disabled={isGen ? true : false}
                          onChange={(event, newValue) => {
                            setBundleGtin((prev) => [...prev, newValue?.gtin]), handleGetBatchfromGtin(newValue);
                          }}
                          filterOptions={(options, params) => {
                            const filtered = filter(options, params);

                            const { inputValue } = params;
                            // Suggest the creation of a new value
                            const isExisting = options.some((option) => inputValue === option.label);
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
                          id="free-solo-with-text-demo"
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
                          renderOption={(props, option) => <li {...props}>{option.label}</li>}
                          // sx={{ width: 300 }}
                          freeSolo
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              onChange={(event) => setTempTitle(event.target.value)}
                              placeholder="Enter bundle products , e.g. Sugar"
                              style={{ width: '100%' }}
                              fullWidth
                            />
                          )}
                        />
                        <SoftTypography
                          onClick={handleDeleteproduct}
                          style={{
                            fontSize: '1.2rem',
                            position: 'absolute',
                            top: '5px',
                            right: '10px',
                            color: 'red',
                            cursor: 'pointer',
                          }}
                        >
                          <DeleteOutlineIcon />{' '}
                        </SoftTypography>
                      </div>
                    ))}
                  </>
                )}

                {/* <FormField type="text" label="Product Title" onChange={(e) => setProductTitle(e.target.value)} /> */}
              </SoftBox>
            </Grid>
            {bundle && (
              <Grid container>
                <SoftTypography
                  className="add-more-text"
                  style={{ marginLeft: '24px', marginTop: '0px', cursor: 'pointer' }}
                  onClick={() => handleAddproduct()}
                  mt={2}
                  component="label"
                  variant="caption"
                  fontWeight="bold"
                  textTransform="capitalize"
                >
                  + Add More
                </SoftTypography>
              </Grid>
            )}

            {/* <Grid item xs={12} sm={6}></Grid> */}
            <Grid item xs={12} sm={6}>
              <SoftBox>
                <SoftBox mb={1} lineHeight={0} display="inline-block">
                  <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                    Main Category
                  </InputLabel>
                </SoftBox>
                <SoftSelect
                  // defaultValue={[]}

                  isDisabled={isGen ? true : false}
                  isClearable={true}
                  value={mainCatSelected}
                  options={mainCatArr}
                  onChange={(option) => {
                    setMainCat(option);
                    setCat1('');
                    setCat2('');
                    // setCatLevel1([]);
                    setCatLevel2([]);
                  }}
                />
              </SoftBox>
            </Grid>

            <Grid style={{ opacity: mainCatSelected ? '1' : '0.4' }} item xs={12} sm={6}>
              <SoftBox mb={1}>
                <SoftBox mb={1} lineHeight={0} display="inline-block">
                  <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                    Category level 1
                  </InputLabel>
                </SoftBox>
                <SoftSelect
                  isClearable={true}
                  isDisabled={!mainCatSelected || isGen ? true : false}
                  value={cat1}
                  options={catLevel1}
                  onChange={(option) => {
                    setCat1(option);
                    setCat2('');
                    setCatLevel2([]);
                  }}
                />
              </SoftBox>
            </Grid>

            <Grid style={{ opacity: cat1 ? '1' : '0.4' }} item xs={12} sm={6}>
              <SoftBox mb={1}>
                <SoftBox mb={1} lineHeight={0} display="inline-block">
                  <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                    Category level 2
                  </InputLabel>
                </SoftBox>
                <SoftSelect
                  className="cat2"
                  isDisabled={!cat1 || isGen ? true : false}
                  isClearable={true}
                  value={cat2}
                  options={catLevel2}
                  onChange={(option) => {
                    setCat2(option);
                  }}
                />
              </SoftBox>
            </Grid>

            <Grid item xs={6} sm={2}>
              <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                  HSN
                </InputLabel>
              </SoftBox>
              <SoftInput disabled={isGen ? true : false} value={hsn} onChange={(e) => setHsn(e.target.value)} />
            </Grid>
            <Grid item xs={6} sm={2}>
              <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                  GST
                </InputLabel>
              </SoftBox>
              {/* <SoftInput
                type="number"
                disabled={isGen ? true : !(isSuperAdmin || isRetailAdmin)}
                value={igst}
                icon={{
                  component: '%',
                  direction: 'right',
                }}
                onChange={(e) => {
                  setIgst(e.target.value);
                  setCgst(e.target.value / 2);
                  setSgst(e.target.value / 2);
                }}
              /> */}
              <SoftSelect
                isDisabled={isGen ? true : !(isSuperAdmin || isRetailAdmin)}
                placeholder="Select Gst"
                options={[
                  { value: 0, label: '0  %' },
                  { value: 3, label: '3  %' },
                  { value: 5, label: '5  %' },
                  { value: 12, label: '12 %' },
                  { value: 18, label: '18 %' },
                  { value: 28, label: '28 %' },
                ]}
                value={{ value: igst, label: igst }}
                onChange={(e) => {
                  setIgst(e?.value);
                  setCgst(e?.value / 2);
                  setSgst(e?.value / 2);
                }}
              ></SoftSelect>
            </Grid>

            <Grid item xs={6} sm={2}>
              <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                  CESS
                </InputLabel>
              </SoftBox>
              <SoftSelect
                isDisabled={isGen ? true : !(isSuperAdmin || isRetailAdmin)}
                placeholder="Select Cess"
                options={cessArray}
                value={{ value: cess, label: cess }}
                onChange={(e) => {
                  setCess(e?.value);
                }}
              ></SoftSelect>
            </Grid>
            <Grid item xs={12} sm={6}>
              <SoftBox mb={1} lineHeight={0} display="inline-block">
                <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }} required>
                  Brand
                </InputLabel>
              </SoftBox>

              <Autocomplete
                value={brandName}
                disabled={isGen ? true : false}
                onChange={(event, newValue) => {
                  if (typeof newValue === 'string') {
                    setBrandName({
                      label: newValue,
                    });
                    // setTempTitle(event.target.value)
                  } else if (newValue && newValue.inputValue) {
                    // Create a new value from the user input
                    setBrandName({
                      label: newValue.inputValue,
                    });
                    // setTempTitle(newValue.inputValue)
                  } else {
                    setBrandName(newValue);
                    // setTempTitle(newValue)
                  }
                }}
                filterOptions={(options, params) => {
                  const filtered = filter(options, params);

                  const { inputValue } = params;
                  // Suggest the creation of a new value
                  const isExisting = options.some((option) => inputValue === option.label);
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
                id="free-solo-with-text-demo"
                options={brandList}
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
                renderOption={(props, option) => <li {...props}>{option.label}</li>}
                // sx={{ width: 300 }}
                freeSolo
                renderInput={(params) => (
                  <TextField
                    {...params}
                    onChange={(event) => setBrandName(event.target.value)}
                    placeholder="Enter Brand name"
                    style={{ width: '100%' }}
                    fullWidth
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <SoftBox mb={1}>
                <SoftBox mb={1} lineHeight={0} display="inline-block">
                  <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                    Manufacturer
                  </InputLabel>
                </SoftBox>
                <Autocomplete
                  value={manufacturer}
                  disabled={isGen ? true : false}
                  onChange={(event, newValue) => {
                    if (typeof newValue === 'string') {
                      setManufacturer({
                        label: newValue,
                      });
                      // setTempTitle(event.target.value)
                    } else if (newValue && newValue.inputValue) {
                      // Create a new value from the user input
                      setManufacturer({
                        label: newValue.inputValue,
                      });
                      // setTempTitle(newValue.inputValue)
                    } else {
                      setManufacturer(newValue);
                      // setTempTitle(newValue)
                    }
                  }}
                  filterOptions={(options, params) => {
                    const filtered = filter(options, params);

                    const { inputValue } = params;
                    // Suggest the creation of a new value
                    const isExisting = options.some((option) => inputValue === option.label);
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
                  id="free-solo-with-text-demo"
                  options={manuOptArray}
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
                  renderOption={(props, option) => <li {...props}>{option.label}</li>}
                  // sx={{ width: 300 }}
                  freeSolo
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      onChange={(event) => setManuTitle(event.target.value)}
                      placeholder="Enter Manufacturer name"
                      style={{ width: '100%' }}
                      fullWidth
                    />
                  )}
                />
              </SoftBox>
            </Grid>

            <Grid item xs={12} sm={6}>
              <SoftBox mb={1}>
                <SoftBox mb={1} lineHeight={0} display="inline-block">
                  <SoftTypography component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                    Preferred vendor{' '}
                  </SoftTypography>
                </SoftBox>
                <Autocomplete
                  value={preferredVendor}
                  disabled={isGen ? true : false}
                  onChange={(event, newValue) => {
                    if (typeof newValue === 'string') {
                      setPreferredVendor({
                        label: newValue,
                      });
                      // setTempTitle(event.target.value)
                    } else if (newValue && newValue.inputValue) {
                      // Create a new value from the user input
                      setPreferredVendor({
                        label: newValue.inputValue,
                      });
                      // setTempTitle(newValue.inputValue)
                    } else {
                      setPreferredVendor(newValue);
                      // setTempTitle(newValue)
                    }
                  }}
                  filterOptions={(options, params) => {
                    const filtered = filter(options, params);

                    const { inputValue } = params;
                    // Suggest the creation of a new value
                    const isExisting = options.some((option) => inputValue === option.label);
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
                  id="free-solo-with-text-demo"
                  options={vendorOptArray}
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
                  renderOption={(props, option) => <li {...props}>{option.label}</li>}
                  // sx={{ width: 300 }}
                  freeSolo
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      onChange={(event) => {
                        setVendorOptArray([]);
                        setVendorTitle(event.target.value);
                      }}
                      placeholder="Select"
                      style={{ width: '100%' }}
                      fullWidth
                    />
                  )}
                />
              </SoftBox>
            </Grid>
            <Grid item xs={12} sm={6}>
              <SoftBox mb={1}>
                <SoftBox mb={1} lineHeight={0} display="inline-block">
                  <SoftTypography component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                    Store Item References{' '}
                  </SoftTypography>
                </SoftBox>
                <SoftInput
                  type="number"
                  value={getValueAfterSecondUnderscore(itemReferences)}
                  onChange={(e) => setitemReferences(e.target.value)}
                />
              </SoftBox>
            </Grid>
            <Grid item xs={12} sm={12}>
              <SoftBox className="hja-box">
                <input
                  className="info-prod-check"
                  type="checkbox"
                  // disabled={isBar}
                  checked={weighingScale}
                  onChange={(e) => {
                    setWeighingScale(e.target.checked ? true : false);
                    if (e.target.checked) {
                      setMarginBased({ value: 'pp', label: 'Purchase Price' });
                    } else {
                      setMarginBased({ value: 'mrp', label: 'MRP' });
                    }
                    setManBarcode('');
                    setBarcode('');
                    setBarImage('');
                    setIsBar(false);
                  }}
                />
                <span className="span-text-info">Needs Weighing Scale Integration</span>
              </SoftBox>
              {weighingScale ? (
                <Grid item xs={6} sm={3}>
                  <SoftBox mt={1.3}>
                    <p className="spec-text">Selling Units</p>
                    <SoftBox className="boom-box">
                      <SoftBox className="boom-soft-box">
                        <SoftSelect
                          className="boom-soft-select"
                          value={weighingScaleUnit}
                          onChange={(option) => setWeighingScaleUnit(option)}
                          options={[
                            { value: 'gm', label: 'gm' },
                            { value: 'kg', label: 'kg' },
                            { value: 'ml', label: 'ml' },
                            { value: 'ltr', label: 'ltr' },
                            { value: 'each', label: 'each' },
                          ]}
                        />
                      </SoftBox>
                    </SoftBox>
                  </SoftBox>
                </Grid>
              ) : null}
            </Grid>

            <Grid item xs={6} sm={3}>
              <SoftBox mt={1.3}>
                <p className="spec-text">Min. Order Quantity</p>
                <SoftBox className="boom-box">
                  <SoftInput
                    className="boom-input"
                    type="text"
                    value={minOrderQty}
                    onChange={(e) => setMinOrderQty(e.target.value)}
                  />
                  <SoftBox className="boom-soft-box">
                    <SoftSelect
                      className="boom-soft-select"
                      value={minOrderQtyUnit}
                      onChange={(option) => setMinOrderQtyUnit(option)}
                      options={[
                        { value: 'Grams', label: 'gm' },
                        { value: 'Kilograms', label: 'kg' },
                        { value: 'Millilitres', label: 'ml' },
                        { value: 'Litres', label: 'ltr' },
                        { value: 'each', label: 'each' },
                      ]}
                    />
                  </SoftBox>
                </SoftBox>
              </SoftBox>
            </Grid>

            {/* <Grid item xs={12} sm={12}>
              <SoftBox mb={1} lineHeight={0} display="inline-block">
                <SoftTypography component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                  Description
                </SoftTypography>
              </SoftBox>
              <SoftEditor
                value={description}
                placeholder="Enter description for the product"
                onChange={(e) => setDescription(e)}
                readOnly={isGen ? true : false}
              />
            </Grid> */}

            <Grid item xs={12} sm={12}>
              <SoftBox mb={1} lineHeight={0} display="inline-block">
                <SoftTypography component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                  Description
                </SoftTypography>
              </SoftBox>
              <SoftInput
                value={description}
                placeholder="Enter description for the product"
                onChange={(e) => setDescription(e.target.value)}
                readOnly={isGen ? true : false}
                multiline
                rows={5}
              />
            </Grid>

            <Grid item xs={12} sm={12}></Grid>
            <Grid item xs={12} sm={4} className="hja-box">
              <input
                checked={comparePrice === 'Y' ? true : false}
                className="info-prod-check"
                type="checkbox"
                onChange={(e) => setComparePrice(e.target.checked ? 'Y' : 'N')}
              />
              <span className="span-text-info">Compare Price</span>
            </Grid>
            <Grid item xs={12} sm={4} className="hja-box">
              <input
                checked={returnable === 'Y' ? true : false}
                className="info-prod-check"
                type="checkbox"
                onChange={(e) => setReturnable(e.target.checked ? 'Y' : 'N')}
              />
              <span className="span-text-info">Returnable item</span>
            </Grid>

            <Grid item xs={12} sm={4} className="hja-box">
              <input
                checked={orgainc === 'Y' ? true : false}
                className="info-prod-check"
                type="checkbox"
                onChange={(e) => setOrganic(e.target.checked ? 'Y' : 'N')}
              />
              <span className="span-text-info">Organic</span>
            </Grid>
            <Grid item xs={12} sm={4} className="hja-box">
              <input
                checked={sellOutOfStock === 'Y' ? true : false}
                className="info-prod-check"
                type="checkbox"
                onChange={(e) => setSellOutOfStock(e.target.checked ? 'Y' : 'N')}
              />
              <span className="span-text-info">Continue selling when out of stock</span>
            </Grid>

            <Grid item xs={12} sm={4}>
              <SoftBox className="hja-box">
                <input
                  className="info-prod-check"
                  type="checkbox"
                  checked={isFood}
                  onChange={(e) => setIsFood(e.target.checked ? true : false)}
                />
                <span className="span-text-info">This is a food item</span>
              </SoftBox>
              {isFood ? (
                <SoftBox mt={1}>
                  <p className="spec-text">Food Item</p>
                  <SoftSelect onChange={(option) => setIsFoodItem(option)} options={foodTypeOptions} />
                </SoftBox>
              ) : null}
            </Grid>
          </Grid>
        </SoftBox>

        <SoftBox mb={2} mt={3}>
          <SoftTypography variant="h6">Add product title in your local language</SoftTypography>
        </SoftBox>

        {inputlist.map((e, i) => {
          return (
            <Grid container spacing={3} key={i}>
              <Grid item xs={5} sm={5}>
                <FormField
                  type="text"
                  label="product title"
                  name="name"
                  value={inputlist[i].name || ''}
                  onChange={(e) => handleProdLang(i, e)}
                />
              </Grid>

              <Grid item xs={5} sm={5}>
                <SoftBox>
                  <SoftBox mb={1} lineHeight={0} display="inline-block">
                    <SoftTypography component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                      Location
                    </SoftTypography>
                  </SoftBox>

                  <SoftBox className="soft-spec-input-edit-prod">
                    <select
                      name="language"
                      className="soft-spec-box-edit-prod"
                      value={inputlist[i].language || ''}
                      onChange={(e) => handleProdLang(i, e)}
                    >
                      <option>Select Location</option>
                      {stateArr.map((e, i) => {
                        return <option key={i}>{e}</option>;
                      })}
                    </select>
                  </SoftBox>
                </SoftBox>
              </Grid>

              <Grid item xs={1} sm={1} ml={3} className="close-box-icon">
                <CloseIcon onClick={() => handleRemove(i)} sx={{ cursor: 'pointer' }} />
              </Grid>
            </Grid>
          );
        })}
        <SoftBox>
          <Grid container spacing={1}>
            <SoftTypography
              className="add-more-text"
              onClick={() => handleRow()}
              ml={1}
              mt={2}
              component="label"
              variant="caption"
              fontWeight="bold"
              textTransform="capitalize"
              style={{ cursor: 'pointer' }}
            >
              + Add more
            </SoftTypography>
          </Grid>
        </SoftBox>

        <Grid item xs={12} spacing={3}>
          <InputLabel
            sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767', marginTop: '18px', marginBottom: '5px' }}
          >
            Tags
          </InputLabel>{' '}
          <SoftBox style={{ display: 'flex', flexDirection: 'column' }}>
            <SoftInput
              placeholder="Enter Tags for products"
              label="Tags"
              variant="outlined"
              fullWidth
              value={inputValue}
              onChange={handleInputChange}
              // sx={{ maxWidth: '300px !important' }}
              onBlur={handleInputBlur}
              onKeyDown={handleInputKeyDown}
            >
              {' '}
            </SoftInput>
            <div style={{ marginTop: '5px' }}>
              {tags?.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  onDelete={() => handleTagDelete(tag)}
                  style={{ marginRight: '8px', marginBottom: '8px' }}
                />
              ))}
            </div>
          </SoftBox>
        </Grid>
      </SoftBox>
    </Card>
  );
}

export default ProductInfo;
