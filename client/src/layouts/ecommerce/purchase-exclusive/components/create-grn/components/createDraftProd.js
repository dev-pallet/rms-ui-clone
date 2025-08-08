import { Box, CircularProgress, FormControlLabel, Grid, InputLabel, Modal, Radio, RadioGroup } from '@mui/material';
import {
  addGlobalProduct,
  addGlobalProductV2,
  addProduct,
  addProductInventory,
  createCmsProduct,
  generateBarcode,
  generateBarcodeWithNum,
  generateWeighingBarcode,
  getAllBrands,
  getAllLevel1Category,
  getAllLevel2Category,
  getAllMainCategory,
  getAllManufacturerV2,
  getAllProductSuggestionV2,
  getAllSubBrands,
  getCatLevel2ByName,
  getItemsInfo,
  getProductDetails,
  getProductDetailsNew,
  getTaxDetailsByLevel3Id,
  manufacturerSearch,
  spMarginValueConfig,
} from '../../../../../../config/Services';
import { useDebounce } from 'usehooks-ts';
import { useSnackbar } from '../../../../../../hooks/SnackbarProvider';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import React, { useEffect, useRef, useState } from 'react';
import SoftBox from '../../../../../../components/SoftBox';
import SoftButton from '../../../../../../components/SoftButton';
import SoftInput from '../../../../../../components/SoftInput';
import SoftSelect from '../../../../../../components/SoftSelect';
import Spinner from '../../../../../../components/Spinner';
import TextField from '@mui/material/TextField';
import { debounce } from 'lodash';

const CreateNewDraftProduct = ({
  openModal,
  handleCloseModal,
  rowData,
  setRowData,
  prodName,
  barNum,
  selectProduct,
  currIndex,
}) => {
  const [loader, setLoader] = useState(false);
  const [saveLoader, setSaveLoader] = useState(false);
  const [weighingScale, setWeighingScale] = useState(false);
  const [weighingScaleUnit, setWeighingScaleUnit] = useState({ value: 'Kilograms', label: 'kg' });
  const [manBarcode, setManBarcode] = useState(barNum !== '' ? barNum : '');
  const [barErr, setBarErr] = useState(false);
  const [barcode, setBarcode] = useState('');
  const [barImage, setBarImage] = useState('');
  const [isBar, setIsBar] = useState(false);
  const [isFood, setIsFood] = useState(false);
  const [changeMarginBased, setChangeMarginBased] = useState(false);
  const [changeMarginType, setChangeMarginType] = useState(false);
  const [isFoodItem, setIsFoodItem] = useState({ value: 'Not Applicable', label: 'Not Applicable' });
  const generateButton = useRef();
  const showSnackbar = useSnackbar();

  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const user_name = localStorage.getItem('user_name');
  const uidx = JSON.parse(localStorage.getItem('user_details')).uidx;

  const contextType = localStorage.getItem('contextType');
  const user_roles = localStorage.getItem('user_roles');
  const isSuperAdmin = user_roles.includes('SUPER_ADMIN');
  const isRetailAdmin = user_roles.includes('RETAIL_ADMIN');
  const filter = createFilterOptions();

  const [productData, setProductData] = useState([1]);
  const [isGen, setIsGen] = useState(false);
  const [productTitle, setProductTitle] = useState(prodName !== '' ? prodName : null);
  const [tempTitle, setTempTitle] = useState(prodName !== '' ? prodName : '');
  const [hsn, setHsn] = useState('');
  const [manufacturer, setManufacturer] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [preferredVendor, setPreferredVendor] = useState(null);
  const [manuTitle, setManuTitle] = useState('');
  const [brandTitle, setBrandTitle] = useState('');
  const [optArray, setOptArray] = useState([]);
  const [manuOptArray, setManuOptArray] = useState([]);
  const [unitOption, setUnitOption] = useState({});
  const [units, setUnits] = useState('1');
  const [spOption, setSpOption] = useState({ value: 'each', label: 'each' });
  const [marginType, setMarginType] = useState({ value: '%', label: '%' });
  const [marginBased, setMarginBased] = useState({ value: 'mrp', label: 'MRP' });
  const [marginValue, setMarginValue] = useState(null);
  const debounceMarginValue = useDebounce(marginValue, 700);
  const [brandList, setBrandList] = useState([]);
  const [subBrandList, setSubBrandList] = useState([]);
  const [selectedSubBrand, setSelectedSubBrand] = useState(null);
  const [formData, setFormData] = useState({});
  const [optionsArray, setOptionsArray] = useState([]);
  const [manuOptionsArray, setManuOptionsArray] = useState([]);

  const [orgArray, setOrgArray] = useState([]);
  const [retailOrgArray, setRetailOrgArray] = useState([]);
  const [vmsOrgArray, setVMSOrgArray] = useState([]);

  const [mrp, setMrp] = useState('');
  const [purchaseMargin, setPurchaseMargin] = useState('');
  const [sellingPrice, setSellingPrice] = useState(null);

  const foodTypeOptions = [
    { value: 'Vegetarian', label: 'Vegetarian' },
    { value: 'Non Vegetarian', label: 'Non Vegetarian' },
    { value: 'Not Applicable', label: 'Not Applicable' },
  ];

  useEffect(() => {
    if (unitOption.label === 'Grams') {
      setSpOption({ value: 'Grams', label: 'gms' });
    } else if (unitOption.label === 'Kilograms') {
      setSpOption({ value: 'Kilograms', label: 'kg' });
    } else if (unitOption.label === 'Millilitres') {
      setSpOption({ value: 'Millilitres', label: 'ml' });
    } else if (unitOption.label === 'Litres') {
      setSpOption({ value: 'Litres', label: 'Litres' });
    } else {
      setSpOption({ value: 'each', label: 'each' });
    }
  }, [unitOption]);

  useEffect(() => {
    if (tempTitle?.length > 2) {
      const payload = {
        page: '1',
        pageSize: '10',
        query: tempTitle,
        // storeLocationId: locId.toLocaleLowerCase(),
        storeLocations: [locId],
      };
      getAllProductSuggestionV2(payload).then((res) => {
        if (res?.data?.data?.data?.data?.length > 0) {
          const response = res?.data?.data?.data?.data || [];
          const extractedVariants = response.flatMap((product) =>
            product?.variants?.map((variant) => ({
              ...variant,
              gtin: variant?.barcodes[0] || null,
              productSource: product?.storeSpecificData,
              igst: product?.taxReference?.igst,
              cess: product?.taxReference?.metaData?.cess,
              weights_and_measures: {
                net_weight: variant?.weightsAndMeasures
                  ? variant?.weightsAndMeasures?.find((ele) => ele?.type === 'PRIMARY')?.grossWeight ||
                    variant?.weightsAndMeasures[0]?.grossWeight
                  : '',
                measurement_unit: variant?.weightsAndMeasures
                  ? variant?.weightsAndMeasures?.find((ele) => ele?.type === 'PRIMARY')?.measurementUnit ||
                    variant?.weightsAndMeasures[0]?.measurementUnit
                  : '',
              },
            })),
          );
          setOptionsArray(extractedVariants);
        } else {
          // as requested by Abu commenting this as there will notbe any global products on 07-07-25
          // const globalPayload = {
          //   page: '1',
          //   pageSize: '10',
          //   query: tempTitle,
          // };
          // getAllProductSuggestionV2(globalPayload).then((res) => {
          //   if (res?.data?.data?.products?.length > 0) {
          //     const response = res?.data?.data?.data?.data || [];
          //     const extractedVariants = response?.flatMap((product) =>
          //       product?.variants?.map((variant) => ({
          //         ...variant,
          //         gtin: variant?.barcodes[0] || null,
          //         productSource: product?.storeSpecificData,
          //         igst: product?.taxReference?.taxRate,
          //         cess: product?.taxReference?.metaData?.cess,
          //         weights_and_measures: {
          //           net_weight: variant?.weightsAndMeasures
          //             ? variant?.weightsAndMeasures?.find((ele) => ele.type === 'PRIMARY')?.grossWeight ||
          //               variant?.weightsAndMeasures[0]?.grossWeight
          //             : '',
          //           measurement_unit: variant?.weightsAndMeasures
          //             ? variant?.weightsAndMeasures?.find((ele) => ele.type === 'PRIMARY')?.measurementUnit ||
          //               variant?.weightsAndMeasures[0]?.measurementUnit
          //             : '',
          //         },
          //       })),
          //     );
          //     setOptionsArray(extractedVariants);
          //   }
          // });
        }
      });
    }
  }, [tempTitle]);

  useEffect(() => {
    if (productTitle?.gtin) {
      getProductDetails(productTitle.gtin).then((response) => {
        const data = response?.data?.data;
        if (data) {
          setProductData(data);
          setIsGen(data?.productSource?.sourceLocationId !== locId);
        }
      });

      setTimeout(() => {
        if (generateButton?.current) {
          generateButton.current.click();
        }
      }, 1000);
    }
  }, [productTitle]);

  useEffect(() => {
    if (!productData?.length) {
      setMainCat({ label: productData?.main_category ?? '', value: productData?.main_category_id ?? '' });
      setCat1({ label: productData?.category_level_1 ?? '', value: productData?.category_level_1_id ?? '' });
      setCat2({ label: productData?.category_level_2 ?? '', value: productData?.category_level_2_id ?? '' });
      setManBarcode(productData?.gtin);
      setManufacturer({ label: productData?.company_detail?.name, value: productData?.company_detail?.name });

      setMrp(productData?.mrp.mrp);
      setUnits(productData?.weights_and_measures?.net_weight);
      setUnitOption({ label: productData?.weights_and_measures?.measurement_unit });

      setOrgArray([...orgArray, ...productData?.productSource?.supportedWarehouses?.filter((e) => e !== 'string')]);
      setRetailOrgArray([
        ...retailOrgArray,
        ...productData?.productSource?.supportedRetails?.filter((e) => e !== 'string'),
      ]);
      setVMSOrgArray(
        productData?.productSource?.marketPlaceSellers
          ? [...vmsOrgArray, ...productData?.productSource?.marketPlaceSellers?.filter((e) => e !== 'string')]
          : [],
      );
    }
  }, [productData]);

  useEffect(() => {
    const options = [];
    optionsArray?.map((ele) => {
      options?.push({ label: ele?.name, gtin: ele?.gtin });
    });
    setOptArray(options);
  }, [optionsArray]);

  const fetchManufacturer = () => {
    const payload = {
      page: 1,
      pageSize: 100,
      sourceId: [orgId],
      sortByCreatedDate: 'DESCENDING',
      sourceLocationId: [locId],
      active: [true],
    };
    if (manuTitle) {
      payload.manufacturerName = [manuTitle || ''];
    }
    getAllManufacturerV2(payload)
      .then((res) => {
        const results = res?.data?.data?.results || [];
        const options = results?.map((item) => ({ value: item?.manufacturerId, label: item?.manufacturerName }));
        setManuOptArray(options || []);
      })
      .catch(() => {});
  };
  useEffect(() => {
    if (manuTitle?.length > 2) {
      fetchManufacturer();
    }
  }, [manuTitle]);

  const [mainCatArr, setMainCatArr] = useState([]);
  const [arr, setArr] = useState([]);
  const [cng, setCng] = useState(false);

  useEffect(() => {
    const payload = {
      page: 1,
      pageSize: 100,
      sourceId: [orgId],
      sourceLocationId: [locId],
      type: ['APP'],
      active: [true],
    };
    getAllMainCategory(payload).then((response) => {
      setArr(response?.data?.data?.results);
      setCng(!cng);
    });
  }, []);

  useEffect(() => {
    const payload = {
      page: 1,
      pageSize: 100,
      sourceLocationId: [locId],
      active: [true],
    };
    getAllBrands(payload)
      .then((res) => {
        const data = res?.data?.data?.results;
        // setBrandList(data);
        if (data?.length > 0) {
          let brandArr = [];
          data?.map((e) => {
            brandArr?.push({ value: e?.brandId, label: e?.brandName });
          });
          setBrandList(brandArr);
        }
      })
      .catch(() => {});
    fetchManufacturer();
  }, []);

  useEffect(() => {
    const fetchSubBrands = (brandId) => {
      const subBrandPayload = {
        sourceLocationId: [locId],
        brandId: [brandId],
        active: [true],
      };
      getAllSubBrands(subBrandPayload)
        .then((res) => {
          const data = res?.data?.data?.results;
          // setBrandList(data);
          if (data?.length > 0) {
            let subBrandArr = [];
            data?.map((e) => {
              subBrandArr?.push({ value: e?.subBrandId, label: e?.subBrandName });
            });
            setSubBrandList(subBrandArr);
          }
        })
        .catch(() => {});
    };

    if (selectedBrand !== null) {
      fetchSubBrands(selectedBrand?.value);
    }
  }, [selectedBrand]);

  useEffect(() => {
    const cat = [];
    arr.map((e) => {
      if (e !== undefined) {
        cat.push({ value: e?.mainCategoryId, label: e?.categoryName });
      }
    });
    setMainCatArr(cat);
  }, [cng]);

  const mainCatgSelected = mainCatArr.find((opt) => !!opt?.value);

  const [mainCatSelected, setMainCat] = useState(mainCatgSelected);

  const [catLevel1, setCatLevel1] = useState([]);
  const [arr1, setArr1] = useState([]);
  const [cng1, setCng1] = useState(false);

  useEffect(() => {
    const payload = {
      page: 1,
      pageSize: 100,
      sourceId: [orgId],
      sourceLocationId: [locId],
      mainCategoryId: [mainCatSelected?.value],
      type: ['APP'],
      active: [true],
    };

    if (isGen) {
      return;
    }
    if (mainCatSelected) {
      getAllLevel1Category(payload).then((response) => {
        setArr1(response?.data?.data?.results);
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
  const [igst, setIgst] = useState('');
  const [sgst, setSgst] = useState('');
  const [cgst, setCgst] = useState('');
  const [cess, setCess] = useState('');

  useEffect(() => {
    const payload = {
      page: 1,
      pageSize: 100,
      sourceId: [orgId],
      sourceLocationId: [locId],
      level1Id: [cat1?.value],
      type: ['APP'],
      active: [true],
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
            setArr2(response?.data?.data?.results);
            setCng2(!cng2);
          })
          .catch((error) => {});
      }
    }
  }, [cat1]);

  useEffect(() => {
    if (!isGen) {
      if (cat1) {
        const item = arr2?.data?.find((e) => e?.categoryName === cat2?.label);
        setIgst(item?.igst);
        setHsn(item?.hsnCode);
        setSgst(item?.sgst);
        setCgst(item?.cgst);
      }
    } else {
      setIgst(productData?.igst);
      setHsn(productData?.hs_code);
      setSgst(productData?.sgst);
      setCgst(productData?.cgst);
    }
  }, [cng3]);

  useEffect(() => {
    const cat = [];
    arr2?.map((e) => {
      cat.push({
        value: e?.level2Id,
        label: e?.categoryName,
        hsn: e?.hsnCode,
        igst: e?.igst,
        sgst: e?.sgst,
        cgst: e?.cgst,
      });
    });

    setCatLevel2(cat);
  }, [cng2]);

  const catLevel2gSelected = catLevel2?.find((opt) => !!opt?.value);
  const [cat2, setCat2] = useState(catLevel2gSelected);

  useEffect(() => {
    if (!isGen) {
      setHsn(cat2?.hsn || productData?.hs_code);
      setIgst(cat2?.igst || productData?.igst);
      setSgst(cat2?.sgst || productData?.sgst);
      setCgst(cat2?.cgst || productData?.cgst);
    } else {
      setIgst(productData?.igst);
      setHsn(productData?.hs_code);
      setSgst(productData?.sgst);
      setCgst(productData?.cgst);
    }
  }, [cat2]);

  const genBarcode = () => {
    setLoader(true);
    if (manBarcode) {
      generateBarcodeWithNum(manBarcode)
        .then((response) => {
          setBarcode(manBarcode);
          setBarImage(`data:image/png;base64,${response?.data?.data?.image}`);
          setIsBar(true);
          setLoader(false);
          setBarErr(false);
        })
        .catch(() => {
          setBarErr(true);
          setLoader(false);
        });
    } else if (weighingScale) {
      generateWeighingBarcode()
        .then((response) => {
          setBarcode(response?.data?.data?.barcode);
          setManBarcode(response?.data?.data?.barcode);
          setIsBar(true);
          setLoader(false);
          setBarErr(false);
        })
        .catch((e) => {
          setBarErr(true);
          setLoader(false);
        });
    } else {
      generateBarcode()
        .then((response) => {
          setBarcode(response?.data?.data?.barcode);
          setManBarcode(response?.data?.data?.barcode);
          setIsBar(true);
          setBarImage(`data:image/png;base64,${response?.data?.data?.image}`);
          setLoader(false);
          setBarErr(false);
        })
        .catch((e) => {
          setBarErr(true);
          setLoader(false);
        });
    }
  };

  const handleChangeValues = (e, index) => {
    if (e.target.name === 'quantity') {
      const updatedData = [...rowData];
      updatedData[index]['quantityOrdered'] = e.target.value;
      const newPurchasePrice =
        parseFloat(e.target.value) === 0 ? 0 : parseFloat(rowData[index]?.totalPP / e.target.value).toFixed(3);
      updatedData[index]['purchasePrice'] =
        isNaN(newPurchasePrice) || newPurchasePrice === 'Infinity' ? '' : newPurchasePrice;
      setRowData(updatedData);

      if (mrp && newPurchasePrice) {
        const margin = ((mrp - newPurchasePrice) / mrp) * 100;
        setPurchaseMargin(isNaN(margin) ? '' : margin.toFixed(3));
      } else {
        setPurchaseMargin('');
      }
    } else if (e.target.name === 'totalPurchase') {
      const updatedData = [...rowData];
      updatedData[index]['totalPP'] = e.target.value;
      const newPurchasePrice =
        parseFloat(rowData[index]?.quantityOrdered) === 0
          ? 0
          : parseFloat(e.target.value / rowData[index]?.quantityOrdered).toFixed(3);
      updatedData[index]['purchasePrice'] =
        isNaN(newPurchasePrice) || newPurchasePrice === 'Infinity' ? '' : newPurchasePrice;
      setRowData(updatedData);

      if (mrp && newPurchasePrice) {
        const margin = ((mrp - newPurchasePrice) / mrp) * 100;
        setPurchaseMargin(isNaN(margin) ? '' : margin.toFixed(3));
      } else {
        setPurchaseMargin('');
      }
    } else if (e.target.name === 'mrp') {
      setMrp(e.target.value);
      const newPurchasePrice =
        parseFloat(rowData[index]?.purchasePrice) === 0
          ? 0
          : parseFloat(e.target.value / rowData[index]?.purchasePrice).toFixed(3);

      if (newPurchasePrice) {
        const margin = ((e.target.value - rowData[index]?.purchasePrice) / e.target.value) * 100;
        setPurchaseMargin(isNaN(margin) ? '' : margin.toFixed(3));
      } else {
        setPurchaseMargin('');
      }
    }
  };

  const handleMarginChange = (e) => {
    setMarginValue(e.target.value);
  };

  useEffect(() => {
    if (debounceMarginValue !== null) {
      const payload = {
        marginBasedOn: marginBased?.value,
        marginType: marginType?.label,
        marginValue: debounceMarginValue,
        puchasePrice: rowData[currIndex]?.purchasePrice,
        mrp: mrp,
      };
      spMarginValueConfig(payload)
        .then((res) => {
          if (res?.data?.data?.es === 0) {
            setSellingPrice(res?.data?.data?.data);
          }
        })
        .catch((err) => {});
    }
  }, [debounceMarginValue, marginBased, marginType]);

  const DEBOUNCE_DELAY = 300;

  useEffect(() => {
    const debouncedGetAllBrands = debounce((title) => {
      if (title) {
        const payload = {
          brandName: [title],
        };
        getAllBrands(payload)
          .then((res) => {
            const data = res?.data?.data?.results;
            if (data?.length > 0) {
              let brandArr = [];
              data.forEach((e) => {
                brandArr.push({ value: e?.brandId, label: e?.brandName });
              });
              setBrandList(brandArr);
            }
          })
          .catch(() => {});
      }
    }, DEBOUNCE_DELAY);

    debouncedGetAllBrands(brandTitle);
    return () => {
      debouncedGetAllBrands.cancel();
    };
  }, [brandTitle]);

  const handleSaveProduct = () => {
    const newBarcode = barcode !== '' ? barcode : manBarcode;
    const gtinPayload = {
      page: 1,
      pageSize: '50',
      quuery: newBarcode,
      storeLocationId: [locId],
    };
    getAllProductSuggestionV2(gtinPayload)
      .then((res) => {
        if (res?.data?.data?.data?.data?.length > 0) {
          showSnackbar('Product is already present, cannot create again', 'error');
          return;
        } else {
          if (
            !productTitle ||
            !mainCatSelected?.label ||
            !cat1?.label ||
            !cat2?.label ||
            !hsn ||
            !igst ||
            !manufacturer?.label ||
            !units
          ) {
            showSnackbar('Please fill all required fields', 'error');
            return;
          }
          if (!weighingScale && !newBarcode) {
            showSnackbar('Please fill all required fields', 'error');
            return;
          }
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
          const retailuniqueOrgs = [...new Set(retailOrgArray)]
            .filter(Boolean)
            .filter((e) => e !== 'string' && isNaN(e));
          const vmsuniqueOrgs = [...new Set(vmsOrgArray)].filter(Boolean).filter((e) => e !== 'string' && isNaN(e));

          const payload = {
            id: null,
            brand: null,
            name: productTitle?.label || productTitle,
            description: '',
            derived_description: null,
            gtin: weighingScale ? '' : barcode !== '' ? barcode : manBarcode,
            caution: null,
            sku_code: null,
            isLocalProduct: isGen ? 'no' : 'yes',
            main_category: mainCatSelected?.label,
            category_level_1: cat1?.label,
            category_level_2: cat2?.label,
            main_category_id: mainCatSelected?.value,
            category_level_1_id: cat1?.value,
            category_level_2_id: cat2?.value,
            gs1category: null,
            gs1sub_category: null,
            gpc_code: null,
            minimum_order_quantity: '',
            minimum_order_quantity_unit: 'each',
            created_by: isGen ? null : user_name,
            compare_price: 'N',
            marketing_info: null,
            url: null,
            activation_date: null,
            deactivation_date: null,
            country_of_origin: null,
            created_date: new Date(),
            modified_date: null,
            type: null,
            primary_gtin: barcode !== '' ? barcode : manBarcode,
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
              mrp: mrp || 0,
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
            returnable: null,
            sell_out_of_stock: null,
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
                organic: null,
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
              nativeLanguages: [],
            },
            productSource: {
              sourceId: isGen ? (productData?.productSource?.sourceId === orgId ? orgId : 'Abusalem') : orgId,
              sourceLocationId: locId,
              sourceType: isGen ? null : contextType,
              productStatus: 'DRAFT',
              createdDate: null,
              productVisibility: isGen ? 'ALL' : 'LOCAL',
              supportedWarehouses: uniqueOrgs,
              supportedVendors: [],
              supportedVendorNames: [],
              supportedRetails: retailuniqueOrgs,
              marketPlaceSellers: vmsuniqueOrgs,
              imageStatus: null,
              tenantId: isGen ? 'Abusalem' : null,
            },
            is_gs1_product: false,
          };
          if (weighingScale) {
            (payload.packaging_type = 'weighingScale'), (payload.sellingUnit = weighingScaleUnit?.label);
          } else {
            payload.packaging_type = 'standard';
          }

          const payloaddata = {
            productId: barcode !== '' ? barcode : manBarcode,
            locationId: locId,
            unitType: spOption?.value,
            continueSelling: 'Y',
            threshHold: 99999,
            overSold: 0,
            createdBy: user_name,
            sourceId: locId,
            sourceName: null,
            category: mainCatSelected?.label,
            subCategory: cat1?.label,
            openingStock: 0,
            specification: units,
            reorderPoint: '',
            gtin: barcode !== '' ? barcode : manBarcode,
            status: null,
            orgId: orgId,
            reorderQuantity: 0,
            reorderQuantityType: 'each',
            comparePrice: 'N',
            minimumOrderQuantity: ' ',
            minimumOrderQuantityUnit: 'each',
            brand: manufacturer?.label,
            locationType: contextType,
            itemName: productTitle?.label || productTitle,
            multipleBatchCreations: [],
            skuid: barcode !== '' ? barcode : manBarcode,
            marginValue: marginValue,
            openingStock: 0,
            marginType: marginType?.label,
            marginBasedOn: marginBased?.value,
          };
          if (weighingScale) {
            payloaddata.sellingUnit = weighingScaleUnit?.label;
            payloaddata.packagingType = 'weighingScale';
          }
          setSaveLoader(true);
          if (isGen) {
            const globalPayload = {
              destinationStoreOrgId: orgId,
              destinationStoreId: locId,
              gtin: manBarcode || '',
              updatedBy: uidx,
              updatedByName: user_name,
            };
            addGlobalProductV2(globalPayload)
              .then((cmsRes) => {})
              .catch((err) => {
                handleCloseModal();
                setSaveLoader(false);
              });
            const newPayload = {
              page: 1,
              pageSize: '50',
              query: newBarcode,
              // storeLocationId: locId.toLocaleLowerCase(),
              storeLocations: [locId],
            };
            getAllProductSuggestionV2(newPayload).then((itemRes) => {
              if (itemRes?.data?.data?.data?.data?.length > 0) {
                addProductInventory(payloaddata)
                  .then((res) => {
                    if (res?.data?.data?.es === 0) {
                      getProductDetails(res?.data?.data?.data?.gtin)
                        .then((prodRes) => {
                          selectProduct(prodRes?.data?.data, currIndex);
                          setSaveLoader(false);
                          handleCloseModal();
                        })
                        .catch((err) => {
                          setSaveLoader(false);
                        });
                    }
                  })
                  .catch((err) => {
                    setSaveLoader(false);
                  });
              }
            });
          } else {
            addProduct(payload)
              .then((cmsRes) => {
                payloaddata.gtin = cmsRes?.data?.data?.gtin;
                addProductInventory(payloaddata)
                  .then((res) => {
                    if (res?.data?.data?.es === 0) {
                      selectProduct(cmsRes?.data?.data, currIndex);
                    }
                    setSaveLoader(false);
                    handleCloseModal();
                  })
                  .catch((err) => {
                    setSaveLoader(false);
                  });
              })
              .catch((err) => {
                setSaveLoader(false);
              });
          }
        }
      })
      .catch((err) => {
        showSnackbar('Product is already present, cannot create again', 'error');
        return;
      });
  };

  const handleNewSaveProduct = async () => {
    const newBarcode = barcode !== '' ? barcode : manBarcode;
    if (
      !productTitle ||
      !mainCatSelected?.label ||
      !cat1?.label ||
      !cat2?.label ||
      // !hsn ||
      // !igst ||
      !mrp ||
      !manufacturer?.label ||
      !units
    ) {
      showSnackbar('Please fill all required fields', 'error');
      return;
    }
    if (!weighingScale && !newBarcode) {
      showSnackbar('Please fill all required fields', 'error');
      return;
    }
    let payload = {
      productName: productTitle?.label || productTitle || '',
      action: 'CREATE',
      logType: 'ProductLog',
      product: {
        // id: 'string',
        name: productTitle?.label || productTitle || '',
        title: productTitle?.label || productTitle || '',

        appCategories: {
          categoryLevel1: [mainCatSelected?.label || ''],
          categoryLevel1Id: [mainCatSelected?.value || ''],
          categoryLevel2: [cat1?.label || ''],
          categoryLevel2Id: [cat1?.value || ''],
          categoryLevel3: [cat2?.label || ''],
          categoryLevel3Id: [cat2?.value || ''],
        },
        posCategories: {
          categoryLevel1: [mainCatSelected?.label || ''],
          categoryLevel1Id: [mainCatSelected?.value || ''],
          categoryLevel2: [cat1?.label || ''],
          categoryLevel2Id: [cat1?.value || ''],
          categoryLevel3: [cat2?.label || ''],
          categoryLevel3Id: [cat2?.value || ''],
        },
        // bundleType: 'string',
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
        companyDetail: {
          brand: selectedBrand?.label || '',
          brandId: selectedBrand?.value || '',
          manufacturer: manufacturer?.label || '',
          manufacturerId: manufacturer?.value || '',
          subBrand: selectedSubBrand?.label || '',
          subBrandId: selectedSubBrand?.value || '',
        },
        variants: [
          {
            // name: productTitle?.label || productTitle,
            name: `${productTitle?.label || productTitle} - ${units}${
              spOption?.value !== 'each' ? ` ${spOption?.value}` : ''
            }`,
            barcodes: weighingScale ? [] : [barcode !== '' ? barcode : manBarcode],
            sku: barcode !== '' ? barcode : manBarcode,
            weight: units,
            weightUnit: spOption?.value === 'Kilograms' ? 'Kg' : spOption?.value,
            needsWeighingScaleIntegration: weighingScale ? true : false,
            mrpData: [
              {
                currencyCode: 'INR',
                currencySymbol: '₹',
                mrp: mrp,
                country: 'India',
              },
            ],
            sellingUnits: [
              {
                quantity: units,
                unitOfMeasure: spOption?.value === 'Kilograms' ? 'Kg' : spOption?.value,
              },
            ],
            inventorySync: {
              gtin: barcode !== '' ? barcode : manBarcode,
              sourceId: orgId,
              sourceLocationId: locId,
              sourceType: 'RETAIL',
              availableQuantity: 0,
              mrp: mrp,
              sellingPrice: 0,
              purchasePrice: 0,
            },

            createdBy: uidx,
            createdByName: user_name,

            isActive: true,
          },
        ],
        createdBy: uidx,
        updatedBy: uidx,
        createdByName: user_name,
      },
      sourceId: orgId,
      sourceLocationId: locId,
    };
    if (formData?.metadata) {
      Object.keys(formData?.metadata).forEach((key) => {
        payload.product.taxReference.metadata[key.toLowerCase()] = formData?.metadata[key];
      });
    }
    setSaveLoader(true);
    if (isGen) {
      let globalPayload = {
        destinationStoreOrgId: orgId,
        destinationStoreId: locId,
        gtin: manBarcode || '',
        updatedBy: uidx,
        updatedByName: user_name,
      };
      await addGlobalProductV2(globalPayload)
        .then((cmsRes) => {})
        .catch((err) => {
          handleCloseModal();
          setSaveLoader(false);
        });
      const newPayload = {
        page: 1,
        pageSize: '50',
        // barcode: [barcode !== '' ? barcode : manBarcode],
        query: barcode !== '' ? barcode : manBarcod,
        // storeLocationId: locId.toLocaleLowerCase(),
        storeLocations: [locId],
      };
      await getAllProductSuggestionV2(newPayload).then((itemRes) => {
        if (itemRes?.data?.data?.data?.data?.length > 0) {
          const payloaddata = {
            productId: barcode !== '' ? barcode : manBarcode,
            locationId: locId,
            unitType: spOption?.value,
            continueSelling: 'Y',
            threshHold: 99999,
            overSold: 0,
            createdBy: user_name,
            sourceId: locId,
            sourceName: null,
            category: mainCatSelected?.label,
            subCategory: cat1?.label,
            openingStock: 0,
            specification: units,
            reorderPoint: '',
            gtin: barcode !== '' ? barcode : manBarcode,
            status: null,
            orgId: orgId,
            reorderQuantity: 0,
            reorderQuantityType: 'each',
            comparePrice: 'N',
            minimumOrderQuantity: ' ',
            minimumOrderQuantityUnit: 'each',
            brand: manufacturer?.label,
            locationType: contextType,
            itemName: productTitle?.label || productTitle,
            multipleBatchCreations: [],
            skuid: barcode !== '' ? barcode : manBarcode,
            marginValue: marginValue,
            openingStock: 0,
            marginType: marginType?.label,
            marginBasedOn: marginBased?.value,
          };
          if (weighingScale) {
            payloaddata.sellingUnit = weighingScaleUnit?.label;
            payloaddata.packagingType = 'weighingScale';
          }

          addProductInventory(payloaddata)
            .then((res) => {
              if (res?.data?.data?.es >= 1) {
                showSnackbar(res?.data?.data?.message, 'error');
                return;
              }
              const response = itemRes?.data?.data?.data?.data[0];
              const { variants, weightsAndMeasures, ...responseWithoutVariants } = response || {};
              const productFound = {
                ...responseWithoutVariants,
                ...variants?.find((ele) => ((ele?.barcodes[0] === barcode) !== '' ? barcode : manBarcode)),
              };
              const extractedVariants = {
                ...productFound,
                gtin: productFound?.barcodes[0] || null,
                productSource: productFound?.storeSpecificData,
                igst: productFound?.taxReference?.taxRate,
                cess: productFound?.taxReference?.metaData?.cess,
                weights_and_measures: {
                  net_weight: productFound?.weightsAndMeasures
                    ? productFound?.weightsAndMeasures?.find((ele) => ele.type === 'PRIMARY')?.grossWeight ||
                      productFound?.weightsAndMeasures[0]?.grossWeight
                    : '',
                  measurement_unit: productFound?.weightsAndMeasures
                    ? productFound?.weightsAndMeasures?.find((ele) => ele.type === 'PRIMARY')?.measurementUnit ||
                      productFound?.weightsAndMeasures[0]?.measurementUnit
                    : '',
                },
              };

              selectProduct(extractedVariants, currIndex);
              setSaveLoader(false);
              handleCloseModal();
            })
            .catch((err) => {
              showSnackbar(err?.response?.data?.message || err, 'error');
              setSaveLoader(false);
            });
        }
      });
    } else {
      createCmsProduct(payload)
        .then((res) => {
          if (res?.data?.status === 'ERROR') {
            showSnackbar(res?.data?.message || 'Some error occured', 'error');
            return;
          }
          if (res?.data?.data?.es === 0) {
            getProductDetailsNew(res?.data?.data?.data?.id, locId)
              .then((prodRes) => {
                if (prodRes?.data?.data?.es === 0) {
                  const newPayload = {
                    page: 1,
                    pageSize: '50',
                    // barcode: [prodRes?.data?.data?.data?.variants[0]?.barcodes[0]],
                    query: prodRes?.data?.data?.data?.variants[0]?.barcodes[0],
                    // storeLocationId: locId.toLocaleLowerCase(),
                    storeLocations: [locId],
                  };
                  getAllProductSuggestionV2(newPayload).then((itemRes) => {
                    if (itemRes?.data?.data?.data?.data?.length > 0) {
                      const response = itemRes?.data?.data?.data?.data[0];
                      const { variants, weightsAndMeasures, ...responseWithoutVariants } = response || {};
                      const productFound = {
                        ...responseWithoutVariants,
                        ...variants?.find(
                          (ele) => ele?.barcodes[0] === prodRes?.data?.data?.data?.variants[0]?.barcodes[0],
                        ),
                      };
                      const extractedVariants = {
                        ...productFound,
                        gtin: productFound?.barcodes[0] || null,
                        productSource: productFound?.storeSpecificData,
                        igst: productFound?.taxReference?.taxRate,
                        cess: productFound?.taxReference?.metaData?.cess,
                        weights_and_measures: {
                          net_weight: productFound?.weightsAndMeasures
                            ? productFound?.weightsAndMeasures?.find((ele) => ele.type === 'PRIMARY')?.grossWeight ||
                              productFound?.weightsAndMeasures[0]?.grossWeight
                            : '',
                          measurement_unit: productFound?.weightsAndMeasures
                            ? productFound?.weightsAndMeasures?.find((ele) => ele.type === 'PRIMARY')
                                ?.measurementUnit || productFound?.weightsAndMeasures[0]?.measurementUnit
                            : '',
                        },
                      };
                      selectProduct(extractedVariants, currIndex);
                      setSaveLoader(false);
                      handleCloseModal();
                    }
                  });
                }
              })
              .catch((err) => {
                setSaveLoader(false);
              });
          } else {
            showSnackbar(res?.data?.data?.message, 'error');
          }
        })
        .catch(() => {
          setSaveLoader(false);
        });
    }
  };

  const handleCancel = () => {
    setManBarcode('');
    setBarErr(false);
    setBarcode('');
    setBarImage('');
    setIsBar(false);
    setIsGen(false);
    setProductTitle(null);
    setTempTitle('');
    setHsn('');
    setManufacturer(null);
    setManuTitle('');
    setOptArray([]);
    setManuOptArray([]);
    setOptionsArray([]);
    setManuOptionsArray([]);
    setOrgArray([]);
    setRetailOrgArray([]);
    setVMSOrgArray([]);

    setPurchaseMargin('');
    setSellingPrice(null);

    const updatedData = [...rowData];
    updatedData[currIndex]['totalPP'] = '';
    updatedData[currIndex]['purchasePrice'] = '';
    updatedData[currIndex]['quantityOrdered'] = '';
    setRowData(updatedData);

    handleCloseModal();
  };

  const handleWeighingScale = (e) => {
    setWeighingScale(e.target.checked ? true : false),
      setManBarcode(''),
      setBarcode(''),
      setBarImage(''),
      setIsBar(false);
    if (e.target.checked === true) {
      setMarginBased({ value: 'pp', label: 'Purchase Price' });
    } else {
      setMarginBased({ value: 'mrp', label: 'MRP' });
    }
  };

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

  const updateFormData = (key, value) => {
    setFormData((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };
  const handleFindHsnGst = (categoryId) => {
    getTaxDetailsByLevel3Id(categoryId)
      .then((res) => {
        const taxDataFromResponse = res?.data?.data || [];

        if (taxDataFromResponse.length === 1) {
          const taxInfo = taxDataFromResponse[0];
          updateFormData('hsn', taxInfo?.taxCode || '');
          updateFormData('metadata', taxInfo?.metadata || {});
        } else if (taxDataFromResponse.length > 1) {
          updateFormData(
            'hsnOptions',
            taxDataFromResponse.map((item) => item.taxCode),
          );
          updateFormData('metadata', {});
        } else {
          updateFormData('hsn', '');
          updateFormData('metadata', {});
        }
      })
      .catch((err) => {});
  };

  return (
    <Modal
      open={openModal}
      onClose={handleCloseModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="modal-pi-border"
    >
      <Box
        className="pi-box-inventory"
        sx={{
          position: 'absolute',
          top: '35%',
          left: '50%',
          width: '60vh',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          overflow: 'auto',
          maxHeight: '80vh',
        }}
      >
        <Grid container spacing={1} p={1}>
          <Grid item xs={12} md={12}>
            <SoftBox mb={1} lineHeight={0}>
              <SoftBox mb={1} lineHeight={0} display="inline-block">
                <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                  Product Title
                </InputLabel>
              </SoftBox>
              <Autocomplete
                value={productTitle}
                disabled={isGen ? true : false}
                onChange={(event, newValue) => {
                  if (typeof newValue === 'string') {
                    setProductTitle({
                      label: newValue,
                    });
                    // setTempTitle(event.target.value)
                  } else if (newValue && newValue.inputValue) {
                    // Create a new value from the user input
                    setProductTitle({
                      label: newValue.inputValue,
                    });
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

              {/* <FormField type="text" label="Product Title" onChange={(e) => setProductTitle(e.target.value)} /> */}
            </SoftBox>
          </Grid>

          {/* CATEGORY */}
          <Grid item xs={12} md={12}>
            <SoftBox>
              <SoftBox mb={1} lineHeight={0} display="inline-block">
                <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                  Main Category
                </InputLabel>
              </SoftBox>
              <SoftSelect
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
          <Grid item xs={12} md={12} style={{ opacity: mainCatSelected ? '1' : '0.4' }}>
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
          <Grid item xs={12} md={12} style={{ opacity: cat1 ? '1' : '0.4' }}>
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
                  handleFindHsnGst(option?.value);
                }}
              />
            </SoftBox>
          </Grid>

          <Grid item xs={12} md={12}>
            <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
              <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                HSN
              </InputLabel>
            </SoftBox>
            {formData?.hsnOptions && formData?.hsnOptions.length > 1 ? (
              <Autocomplete
                freeSolo
                options={formData.hsnOptions || []}
                getOptionLabel={(option) => option}
                value={formData.hsn || ''}
                onChange={(e, newValue) => {
                  updateFormData('hsn', newValue || '');
                  handleHSNSelectChange(newValue);
                }}
                onInputChange={(e, newInputValue) => {
                  updateFormData('hsn', newInputValue);
                }}
                renderInput={(params) => <TextField {...params} variant="outlined" />}
                clearOnEscape
              />
            ) : (
              <SoftInput
                className="select-box-category"
                value={formData?.hsn}
                disabled={isGen ? true : false}
                onChange={(e) => updateFormData('hsn', e?.target?.value)}
              />
            )}
          </Grid>
          {Object.keys(formData?.metadata || {}).length === 0 ? (
            <>
              <Grid item xs={12} md={12}>
                <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                  <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                    GST
                  </InputLabel>
                </SoftBox>
                <SoftSelect
                  className="select-box-category"
                  placeholder="Select GST"
                  options={[
                    { value: 0, label: '0  %' },
                    { value: 5, label: '5  %' },
                    { value: 12, label: '12 %' },
                    { value: 18, label: '18 %' },
                    { value: 28, label: '28 %' },
                  ]}
                  value={{ value: formData?.igst, label: formData?.igst }}
                  onChange={(e) => {
                    updateFormData('igst', e?.value);
                    updateFormData('cgst', e?.value / 2);
                    updateFormData('sgst', e?.value / 2);
                  }}
                  // menuPortalTarget={document.body}
                />
              </Grid>

              <Grid item xs={12} md={12}>
                <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                  <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                    CESS
                  </InputLabel>
                </SoftBox>
                <SoftSelect
                  value={{ value: formData?.cess, label: formData?.cess }}
                  isDisabled={isGen ? true : !(isSuperAdmin || isRetailAdmin)}
                  className="select-box-category"
                  placeholder="Select Cess"
                  options={cessArray}
                  onChange={(e) => {
                    updateFormData('cess', e?.value);
                  }}
                  // menuPortalTarget={document.body}
                />
              </Grid>
            </>
          ) : (
            Object.keys(formData?.metadata || {}).map((key) => (
              <Grid item xs={12} md={12} key={key}>
                <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                  <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                    {key}
                  </InputLabel>
                </SoftBox>
                <SoftInput
                  className="select-box-category"
                  value={formData?.metadata[key] || ''}
                  onChange={(e) =>
                    updateFormData('metadata', {
                      ...formData.metadata,
                      [key]: e?.target?.value,
                    })
                  }
                />
              </Grid>
            ))
          )}

          <Grid item xs={12} md={12}>
            <SoftBox mb={1}>
              <SoftBox mb={1} lineHeight={0} display="inline-block">
                <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                  Brand
                </InputLabel>
              </SoftBox>

              <SoftSelect
                options={brandList || []}
                onChange={(event) => setSelectedBrand(event)}
                onInputChange={(event) => setBrandTitle(event)}
                isClearable={true}
              ></SoftSelect>
            </SoftBox>
          </Grid>

          <Grid item xs={12} md={12}>
            <SoftBox mb={1}>
              <SoftBox mb={1} lineHeight={0} display="inline-block">
                <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>Sub-brand</InputLabel>
              </SoftBox>

              <SoftSelect
                options={subBrandList || []}
                onChange={(event) => setSelectedSubBrand(event)}
                isClearable={true}
              ></SoftSelect>
            </SoftBox>
          </Grid>

          <Grid item xs={12} md={12}>
            <SoftBox mb={1}>
              <SoftBox mb={1} lineHeight={0} display="inline-block">
                <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                  Manufacturer
                </InputLabel>
              </SoftBox>
              <SoftSelect
                options={manuOptArray || []}
                value={manufacturer}
                onChange={(e) => setManufacturer(e)}
                onInputChange={(event) => setManuTitle(event)}
              ></SoftSelect>
            </SoftBox>
          </Grid>

          <Grid item xs={12} md={12}>
            <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
              <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                MRP
              </InputLabel>
            </SoftBox>
            <SoftInput
              name="mrp"
              disabled={isGen ? true : false}
              value={mrp}
              onChange={(e) => {
                handleChangeValues(e, currIndex);
              }}
            />
          </Grid>

          <Grid item xs={12} sm={12} mt={1}>
            <SoftBox className="hja-box">
              <input
                className="info-prod-check"
                type="checkbox"
                // disabled={isBar}
                checked={weighingScale}
                onChange={(e) => {
                  handleWeighingScale(e);
                }}
              />
              <span className="span-text-info">Needs Weighing Scale Integration</span>
            </SoftBox>
            {weighingScale ? (
              // <Grid item xs={6} sm={3}>
              //   <SoftBox mt={1.3}>
              //     <p className="spec-text">Selling Units</p>
              //     <SoftBox className="boom-box">
              //       <SoftBox className="boom-soft-box">
              //         <SoftSelect
              //           className="boom-soft-select"
              //           value={weighingScaleUnit}
              //           onChange={(option) => setWeighingScaleUnit(option)}
              //           options={[
              //             { value: 'Grams', label: 'gm' },
              //             { value: 'Kilograms', label: 'kg' },
              //             { value: 'Millilitres', label: 'ml' },
              //             { value: 'Litres', label: 'ltr' },
              //             { value: 'each', label: 'each' },
              //           ]}
              //         />
              //       </SoftBox>
              //     </SoftBox>
              //   </SoftBox>
              // </Grid>
              <Grid item xs={12} md={12}>
                {weighingScale ? (
                  <SoftBox mt={1}>
                    <p className="spec-text">Selling Units</p>
                    <SoftSelect
                      className="boom-soft-select"
                      value={weighingScaleUnit}
                      onChange={(option) => setWeighingScaleUnit(option)}
                      options={[
                        { value: 'nos', label: 'each' },
                        { value: 'Grams', label: 'gm' },
                        { value: 'Kilograms', label: 'kg' },
                        { value: 'Millilitres', label: 'ml' },
                        { value: 'Litres', label: 'ltr' },
                      ]}
                    />
                  </SoftBox>
                ) : null}
              </Grid>
            ) : null}
          </Grid>
          <Grid item xs={12} md={12}>
            <SoftBox ml={0.5} lineHeight={0} display="inline-block">
              <InputLabel
                required={weighingScale ? false : true}
                sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}
              >
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
                  disabled={barcode || manBarcode !== '' ? true : false}
                  // variant="gradient"
                  color="info"
                  size="small"
                  onClick={genBarcode}
                  ref={generateButton}
                  className="vendor-add-btn"
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
          <Grid item xs={12} md={12}>
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

          <Grid item xs={12} md={12} mt={1}>
            <SoftBox mt={1.3}>
              <SoftBox mb={1}>
                <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                  Specifications
                </InputLabel>
              </SoftBox>
              <SoftBox className="boom-box" mt={1}>
                <SoftInput
                  className="boom-input"
                  disabled={isGen ? true : false}
                  value={units}
                  onChange={(e) => setUnits(e.target.value)}
                  type="number"
                />
                <SoftBox className="boom-soft-box">
                  <SoftSelect
                    className="boom-soft-select"
                    isDisabled={isGen ? true : false}
                    value={spOption}
                    defaultValue={{ value: 'each', label: 'each' }}
                    onChange={(option) => setSpOption(option)}
                    options={[
                      { value: 'NOS', label: 'each' },
                      { value: 'GRAMS', label: 'gm' },
                      { value: 'KG', label: 'kg' },
                      { value: 'ML', label: 'ml' },
                      { value: 'LTR', label: 'ltr' },
                    ]}
                  />
                </SoftBox>
              </SoftBox>
            </SoftBox>
          </Grid>

          <Grid item xs={12} md={12}>
            <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
              <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>Quantity</InputLabel>
            </SoftBox>
            <SoftInput
              type="number"
              name="quantity"
              value={rowData[currIndex]?.quantityOrdered}
              onChange={(e) => {
                handleChangeValues(e, currIndex);
              }}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
              <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                Total Purchase Price
              </InputLabel>
            </SoftBox>
            <SoftInput
              type="number"
              name="totalPurchase"
              value={rowData[currIndex]?.totalPP}
              onChange={(e) => {
                handleChangeValues(e, currIndex);
              }}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
              <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>Price per unit</InputLabel>
            </SoftBox>
            <SoftInput
              disabled
              value={rowData[currIndex]?.purchasePrice ? Math.round(rowData[currIndex]?.purchasePrice * 100) / 100 : 0}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
              <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                Purchase Margin (%)
              </InputLabel>
            </SoftBox>
            <SoftInput disabled type="number" value={purchaseMargin ? Math.round(purchaseMargin * 1000) / 1000 : 0} />
          </Grid>
          <Grid item xs={12} md={12}>
            <SoftBox mt={1.3}>
              <SoftBox mb={1}>
                <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                  Margin Based on
                </InputLabel>
              </SoftBox>
              <SoftBox className="boom-soft-box">
                <SoftSelect
                  className="boom-soft-select"
                  value={marginBased}
                  defaultValue={{ value: 'pp', label: 'Purchase Price' }}
                  onChange={(option) => setMarginBased(option)}
                  options={[
                    { value: 'pp', label: 'Purchase Price' },
                    { value: 'mrp', label: 'MRP' },
                  ]}
                />
              </SoftBox>
            </SoftBox>
          </Grid>
          <Grid item xs={12} md={12}>
            <SoftBox mt={1.3}>
              <SoftBox mb={1} ml={1}>
                <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>Margin</InputLabel>
              </SoftBox>
              <SoftBox className="boom-box">
                <SoftInput
                  className="boom-input"
                  value={marginValue}
                  onChange={(e) => handleMarginChange(e)}
                  type="number"
                />
                <SoftBox className="boom-soft-box">
                  <SoftSelect
                    className="boom-soft-select"
                    value={marginType}
                    defaultValue={{ value: '%', label: '%' }}
                    onChange={(option) => setMarginType(option)}
                    options={[
                      { value: '%', label: '%' },
                      { value: 'Rs', label: 'Rs' },
                    ]}
                  />
                </SoftBox>
              </SoftBox>
            </SoftBox>
          </Grid>
          {sellingPrice !== null && (
            <Grid item xs={12} md={12}>
              <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                  Selling Price
                </InputLabel>
              </SoftBox>
              <SoftInput disabled value={sellingPrice} />
            </Grid>
          )}

          <Grid item xs={12} sm={12}>
            <SoftBox className="header-submit-box">
              <SoftButton className="vendor-second-btn" onClick={handleCancel}>
                cancel
              </SoftButton>
              {saveLoader ? (
                <SoftButton className="vendor-add-btn">
                  <CircularProgress size={20} />
                </SoftButton>
              ) : (
                <SoftButton className="vendor-add-btn" onClick={handleNewSaveProduct}>
                  <>Save</>
                </SoftButton>
              )}
            </SoftBox>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default CreateNewDraftProduct;
