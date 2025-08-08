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

// sweetalert2 components
import Swal from 'sweetalert2';

// Soft UI Dashboard PRO React components
import './edit-product.css';
import * as React from 'react';
import { Button, Checkbox, Chip } from '@mui/material';
import {
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  closestCorners,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { Photo } from './Photo';
import { Grid as PhotoGrid } from './Grid';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { SortablePhoto } from './SortablePhoto';
import {
  addProductInventory,
  deleteProduct,
  deleteProductFromOrg,
  editProduct,
  getAllVendors,
  getInventoryDetails,
  getProductDetails,
} from 'config/Services';
import { buttonStyles } from '../../../../Common/buttonColor';
import { debounce, lastIndexOf } from 'lodash';
import {
  filterVendorSKUData,
  getAllBrands,
  getAllLevel1Category,
  getAllLevel2Category,
  getAllMainCategory,
  getAllManufacturerV2,
  getInventoryBatchByGtin,
  getItemsInfo,
} from '../../../../../../config/Services';
import { getValueAfterSecondUnderscore } from '../../../../Common/cartUtils';
import { isSmallScreen, productIdByBarcode } from '../../../../Common/CommonFunction';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import Card from '@mui/material/Card';
import CircularProgress from '@mui/material/CircularProgress';
import CloseIcon from '@mui/icons-material/Close';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditPricingField from './components/FormField/EditPricingField';
import Footer from 'examples/Footer';
import FormField from 'layouts/ecommerce/product/all-products/components/edit-product/components/FormField/index';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import InventoyBatcheswithgtin from '../add-product/components/ProductInfo/inventoyBatchesModal';
import MobileNavbar from '../../../../../../examples/Navbars/MobileNavbar/mobile-navbar-drawer';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import SoftBox from 'components/SoftBox';
import SoftButton from 'components/SoftButton';
import SoftInput from 'components/SoftInput';
import SoftSelect from 'components/SoftSelect';
import SoftTypography from 'components/SoftTypography';
import Spinner from '../../../../../../components/Spinner';
import TextField from '@mui/material/TextField';
import photos from './photos.json';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const foodTypeOptions = [
  { value: 'Vegetarian', label: 'Vegetarian' },
  { value: 'Non Vegetarian', label: 'Non Vegetarian' },
  { value: 'Not Applicable', label: 'Not Applicable' },
];

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
function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isMobileDevice = isSmallScreen();

  const access_token = sessionStorage.getItem('access_token');

  const [datRows, setTableRows] = useState({});
  const [prodLoader, setProdLoader] = useState(false);
  const [invetoryLoader, setInvetoryLoader] = useState(false);
  const [loader, setLoader] = useState(false);

  const [title, setTitle] = useState('');
  const [isTitleChange, setisTitleChange] = useState(false);
  const [returned, setReturned] = useState('N');
  const [sofs, setSofs] = useState('N');
  const [comparePrice, setComparePrice] = useState('N');
  const [changeSellingUnit, setChangeSellingUnit] = useState(false);
  const [mrp, setMrp] = useState('');
  const [gtin, setGtin] = useState('');
  const [hscode, setHscode] = useState('');
  const [ishscodeChange, setisHscodeChange] = useState(false);
  const [isIgstChange, setisIgstChange] = useState(false);
  const [igst, setIgst] = useState('');
  const [cgst, setCgst] = useState('');
  const [sgst, setSgst] = useState('');
  const [cess, setCess] = useState('');
  const [comName, setComName] = useState('');
  const [inputlist, setInputlist] = useState([{}]);
  const [isFoodItem, setIsFoodItem] = useState({ value: null, label: null });
  const [isFood, setIsFood] = useState(false);
  const [productSource, setProductSource] = useState({});
  const [units, setUnits] = useState('');
  const [secondaryWeighingUnit, setSecondaryWeighingUnits] = useState([]);
  const [salePrice, setSalePrice] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [openingStack, setOpeningStack] = useState('');
  const [packagingTypeIMS, setPackagingTypeIMS] = useState('');
  const [reorderPoint, setReorderPoint] = useState('');
  const [reorderQuantity, setReorderQuantity] = useState('');
  const [batchno, setBatchNo] = useState(['', '', '']);
  const [inventoryId, setInventoryId] = useState('');
  const [availableUnits, setAvailableUnits] = useState('');
  const [expDate, setExpDate] = useState('');
  const [quantity, setQuantity] = useState('');
  const [sellOutOfStock, SetsellOutOfStock] = useState('');
  const [reorderQuantityUnit, setReorderQuantityUnit] = useState({ value: 'each', label: 'each' });
  const [spOption, setSpOption] = useState({ value: 'each', label: 'each' });
  const [secondarySPOption, setSecondarySpOption] = useState([{ value: 'each', label: 'each' }]);
  const [marginType, setMarginType] = useState({ value: '%', label: '%' });
  const [marginBased, setMarginBased] = useState({ value: 'pp', label: 'Purchase Price' });
  const [marginValue, setMarginValue] = useState(null);
  const [isGen, setIsGen] = useState(false);
  const [tags, setTags] = useState([]);
  const [minOrderQty, setMinOrderQty] = useState('');
  const [itemReferences, setitemReferences] = useState('');
  const [minOrderQtyUnit, setMinOrderQtyUnit] = useState({ value: 'each', label: 'each' });
  const [sellingUnit, setSellingUnit] = useState({ value: 'each', label: 'each' });
  const [ismanufacturer, setisManufacturer] = useState(false);
  const [weighingScale, setWeighingScale] = useState(false);
  const [weighingScaleUnit, setWeighingScaleUnit] = useState({ value: 'kg', label: 'kg' });
  const [manufacturer, setManufacturer] = useState({ label: '', value: '' });
  const [preferredVendor, setPreferredVendor] = useState({ label: '', value: '' });
  const [description, setDescription] = useState('');
  const [username, setUsername] = useState('');
  const [blobImages, setBlobImages] = useState([]);
  const [manuTitle, setManuTitle] = useState('');
  const [vendorTitle, setVendorTitle] = useState('');
  const [manuOptArray, setManuOptArray] = useState([]);
  const [vendorOptArray, setVendorOptArray] = useState([]);
  const [manuOptionsArray, setManuOptionsArray] = useState([]);
  const [vendorOptionsArray, setVendorOptionsArray] = useState([]);
  const [batchPresent, setBatchPresent] = useState(false);
  const [packagingType, setPackagingType] = useState('');
  const [bundleProductData, setBundleProductData] = useState([]);
  const [batchData, setBatchData] = useState([]);
  const [selectedproduct, setSelectedProduct] = useState([]);
  const [IsreadOnly, setIsreadOnly] = useState(true);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imgaediv, setImgdiv] = useState(false);
  const [prImg, setPrImg] = useState(
    'https://www.vuescript.com/wp-content/uploads/2018/11/Show-Loader-During-Image-Loading-vue-load-image.png',
  );
  const [secondaryWeighingSpecs, setSecondaryWeighingSpecs] = useState({ value: 'each', label: 'each' });
  const [secWeighingCheckBox, setSecWeighingCheckBox] = useState(false);
  const [orgainc, setOrganic] = useState('N');
  const [brandName, setBrandName] = useState('');

  let dataArr,
    dataRow = [];

  const filter = createFilterOptions();

  const [mainCatArr, setMainCatArr] = useState([]);
  const [arr, setArr] = useState([]);
  const [cng, setCng] = useState(false);
  const [bundleGtin, setBundleGtin] = useState([]);
  const [inputProductData, setInputProductData] = useState([]);
  const [openBatch, setOpenBatch] = useState(false);
  const handleOpen = () => setOpenBatch(true);
  const handleClose = () => setOpenBatch(false);
  const [optArray, setOptArray] = useState([]);
  const [optionsArray, setOptionsArray] = useState([]);
  const [tempTitle, setTempTitle] = useState('');
  const [brandList, setBrandList] = useState([]);

  const mainCatgSelected = mainCatArr.find((opt) => !!opt.value);

  const [mainCatSelected, setMainCat] = useState(mainCatgSelected);
  const [isMainCatChange, setisMainCatChange] = useState(false);
  const [isCat1Change, setisCat1Change] = useState(false);
  const [isCat2Change, setisCat2Change] = useState(false);
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState('success');
  const [errormsg, setErrorMsg] = useState('');
  const [catLevel1, setCatLevel1] = useState([]);
  const [arr1, setArr1] = useState([]);
  const [cng1, setCng1] = useState(false);
  const [items, setItems] = useState(photos);
  const [activeId, setActiveId] = useState(null);
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));
  const [secWeighingCount, setSecWeighingCount] = useState(0);

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  function handleDragStart(event) {
    setActiveId(event.active.id);
  }

  function handleDragOver(event) {
    const { active, over } = event;

    if (active.id !== over.id) {
      setSelectedImages((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);

        const newArr = [...blobImages];
        const element = newArr[oldIndex];
        newArr.splice(oldIndex, 1);
        newArr.splice(newIndex, 0, element);
        setBlobImages(newArr);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  function handleDragEnd(event) {
    setActiveId(null);
  }

  function handleDragCancel() {
    setActiveId(null);
  }

  const locId = localStorage.getItem('locId');
  const user_name = localStorage.getItem('user_name');
  const orgId = localStorage.getItem('orgId');
  const user_roles = localStorage.getItem('user_roles');
  const isSuperAdmin = user_roles.includes('SUPER_ADMIN');
  const isRetailAdmin = user_roles.includes('RETAIL_ADMIN');

  useEffect(() => {
    const payload = {
      page: 1,
      pageSize: 100,
    };
    getAllMainCategory(payload).then((response) => {
      setArr(response?.data?.data?.results);
      setCng(!cng);
    });
  }, []);

  useEffect(() => {
    const cat = [];
    arr?.map((e) => {
      if (e !== undefined) {
        cat.push({ value: e.mainCategoryId, label: e.categoryName });
      }
    });
    setMainCatArr(cat);
  }, [cng]);

  useEffect(() => {
    const payload = {
      page: 1,
      pageSize: 100,
      mainCategoryId: [mainCatSelected?.value],
    };
    if (mainCatSelected === undefined) {
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
  const catLevel1gSelected = catLevel1.find((opt) => !!opt.value);
  const [cat1, setCat1] = useState(catLevel1gSelected);

  const [catLevel2, setCatLevel2] = useState([]);
  const [arr2, setArr2] = useState([]);
  const [cng2, setCng2] = useState(false);
  const [cng3, setCng3] = useState(false);

  useEffect(() => {
    const options = [];
    optionsArray?.map((ele) => {
      options?.push({ label: ele.name, gtin: ele.gtin });
    });
    setOptArray(options);
  }, [optionsArray]);

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

  const handleProductNavigation = async (barcode) => {
    try {
      const productId = await productIdByBarcode(barcode);
      if (productId) {
        navigate(`/products/product/details/${productId}`);
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (cat1 === undefined) {
      return;
    }
    const payload = {
      page: 1,
      pageSize: 100,
      level1Id: [cat1?.value],
    };
    getAllLevel2Category(payload)
      .then((res) => {
        setArr2(res?.data?.data?.results);
        setCng3(!cng3);
      })
      .catch((err) => {});
  }, [cat1]);

  useEffect(() => {
    const cat = [];
    arr2?.map((e) => {
      cat.push({
        value: e.level2Id,
        label: e.categoryName,
        hsn: e.hsnCode,
        igst: e.igst,
        sgst: e.sgst,
        cgst: e.cgst,
      });
    });

    setCatLevel2(cat);
  }, [cng3]);
  useEffect(() => {
    setHscode(cat2?.hsn);
    setIgst(cat2?.igst);
    setCgst(cat2?.cgst);
    setSgst(cat2?.sgst);
  }, [cat2]);

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
      //
      setVendorOptionsArray(response?.data?.data?.vendors);
    });
  }, [vendorTitle]);
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
      vendorOptions?.push({ label: ele.vendorName || '', value: ele.vendorId || '' });
    });

    //
    setVendorOptArray(vendorOptions);
  }, [vendorOptionsArray]);

  // useEffect(() => {
  //
  //
  //   let vendorObj = vendorOptArray.find((e) => e.label === preferredVendor.label);
  //
  //   setPreferredVendor(vendorObj);
  // }, [manufacturer]);

  const catLevel2gSelected = catLevel2.find((opt) => !!opt.value);
  const [cat2, setCat2] = useState(catLevel2gSelected);

  const [count, SetCount] = useState(1);
  const [addBundleCount, setaddBundleCount] = useState(1);
  const [fixedCount, SetFixedCount] = useState();
  const [multipleBatchCreations, setMultipleBatchCreations] = useState([]);

  const handleAddmore = () => {
    SetCount(count + 1);
  };

  const handleAddproduct = () => {
    setaddBundleCount(addBundleCount + 1);
  };

  useEffect(() => {
    setProdLoader(true);
    setInvetoryLoader(true);
    getProductDetails(id)
      .then(function (responseTxt) {
        setProdLoader(false);
        dataArr = responseTxt?.data?.data;

        // if (
        //   !dataArr?.name ||
        //   !dataArr?.main_category ||
        //   !dataArr?.category_level_1 ||
        //   !dataArr?.category_level_2 ||
        //   !dataArr?.hs_code ||
        //   !dataArr?.igst ||
        //   !dataArr?.company_detail?.name ||
        //   !dataArr?.gtin
        // ) {
        //   Swal.fire({
        //     icon: 'info',
        //     title: 'Product cannot be edited',
        //     showConfirmButton: true,
        //     confirmButtonText: 'OK',
        //   }).then(() => {
        //     navigate(`/products/all-products/details/${id}`);
        //   });
        // }
        // console.log(dataArr?.storeItemReferences[0]);
        setTitle(dataArr?.name);
        setMainCat({ value: dataArr.main_category_id ?? '', label: dataArr.main_category ?? '' });
        setCat1({ value: dataArr.category_level_1_id ?? '', label: dataArr.category_level_1 ?? '' });
        setCat2({ value: dataArr.category_level_2_id ?? '', label: dataArr.category_level_2 ?? '' });
        setPrImg(dataArr?.images?.top_left);
        setReturned(dataArr?.returnable);
        setSofs(dataArr?.sell_out_of_stock);
        setUsername(dataArr?.created_by);
        setIsGen(dataArr?.productSource?.sourceId === orgId ? false : true);
        setTags(dataArr?.productSource?.tags);
        setGtin(dataArr?.gtin);
        setIgst(dataArr?.igst);
        setCgst(dataArr?.cgst);
        setSgst(dataArr?.sgst);
        setCess(dataArr?.cess);
        setHscode(dataArr?.hs_code);
        setitemReferences(dataArr?.storeItemReferences);
        setDescription(dataArr?.description);
        if (dataArr?.company_detail?.name !== null) {
          setManufacturer({ label: dataArr?.company_detail?.name, value: dataArr?.company_detail?.name });
          setisManufacturer(true);
        }
        if (dataArr?.productSource?.supportedVendors?.length) {
          setPreferredVendor({
            label: dataArr?.productSource?.supportedVendorNames[0],
            value: dataArr?.productSource?.supportedVendors[0],
          });
        }
        setInputlist(dataArr?.language?.nativeLanguages);
        setBrandName(dataArr?.brand);
        setIsFoodItem({ value: dataArr?.attributes?.food_type, label: dataArr?.attributes?.food_type });
        setIsFood(dataArr?.attributes?.food_type === 'Not Applicable' ? false : true);
        setProductSource(dataArr?.productSource);
        setPackagingType(dataArr?.packaging_type ? dataArr.packaging_type.toLowerCase().replace(/\s/g, '') : '');
        let imageArray = [];
        imageArray.push(dataArr?.images.front || null);
        imageArray.push(dataArr?.images.back || null);
        imageArray.push(dataArr?.images.top || null);
        imageArray.push(dataArr?.images.bottom || null);
        imageArray.push(dataArr?.images.left || null);
        imageArray.push(dataArr?.images.right || null);
        imageArray.push(dataArr?.images.top_left || null);
        imageArray.push(dataArr?.images.top_right || null);
        imageArray = imageArray.filter(Boolean).filter((e) => e !== 'string');

        setSelectedImages(imageArray);

        const imgArr = [];
        imageArray.map((item, i) => {
          const onImageEdit = async (item) => {
            const imgExt = item.split(/[#?]/)[0].split('.').pop().trim();

            const response = await fetch(item);
            const blob = await response.blob();
            const file = new File([blob], `productImage-${i}.` + imgExt, {
              type: blob.type,
            });
            file.index = i;
            setBlobImages((prev) => [...prev, file].sort((a, b) => a.index - b.index));
          };
          onImageEdit(item);
        });
        if (dataArr?.weights_and_measures?.secondarySpecs) {
          const data = dataArr?.weights_and_measures?.secondarySpecs;
          setSecWeighingCheckBox(true);
          setSecWeighingCount(data?.length);
          const weighingUnits = data.map((item) => item?.net_weight || '');

          setSecondaryWeighingUnits(weighingUnits);
          const weighingOptions = data.map((item) => ({
            value: item?.measurement_unit || '',
            label: item?.measurement_unit || '',
          }));

          setSecondarySpOption(weighingOptions);
        }
        setTableRows(dataArr);
      })
      .catch((err) => {
        setProdLoader(false);
      });

    getInventoryDetails(locId, id)
      .then((res) => {
        setInvetoryLoader(false);
        // if (res?.data?.data?.es !== 1) {
        //   SetFixedCount(res?.data?.data?.data?.multipleBatchCreations?.length);
        //   SetCount(res?.data?.data?.data?.multipleBatchCreations?.length ? res?.data?.data?.data?.multipleBatchCreations?.length: 1);
        // } else {
        //   SetFixedCount(1)
        //   SetCount(1);
        // }
        const response = res?.data?.data?.data;

        if (res?.data?.data?.es === 1) {
          SetCount(0);
          SetFixedCount(0);
        } else {
          setMultipleBatchCreations(res?.data?.data?.data?.multipleBatchCreations);
          SetFixedCount(res?.data?.data?.data?.multipleBatchCreations?.length);
          SetCount(res?.data?.data?.data?.multipleBatchCreations?.length);
          setMrp(
            response?.multipleBatchCreations?.map((item) =>
              item?.mrp !== null && item?.mrp !== undefined ? item?.mrp : 0,
            ),
          );
        }
        setUnits(response.specification);
        setSalePrice(
          response?.multipleBatchCreations?.map((item) =>
            item?.sellingPrice !== null && item?.sellingPrice !== undefined ? item?.sellingPrice : 0,
          ),
        );
        setPurchasePrice(
          response?.multipleBatchCreations?.map((item) =>
            item?.purchasePrice !== null && item?.purchasePrice !== undefined ? item?.purchasePrice : 0,
          ),
        );
        setBatchNo(
          response?.multipleBatchCreations?.map((item) =>
            item?.batchId !== null && item?.batchId !== undefined ? item?.batchId : 0,
          ),
        );
        setInventoryId(
          response?.multipleBatchCreations?.map((item) =>
            item?.inventoryId !== null && item?.inventoryId !== undefined ? item?.inventoryId : 0,
          ),
        );
        setAvailableUnits(
          response?.multipleBatchCreations?.map((item) =>
            item?.availableUnits !== null && item?.availableUnits !== undefined ? item?.availableUnits : 0,
          ),
        );
        const dataArr = response?.multipleBatchCreations?.map((item) =>
          item?.expiryDate !== null && item?.expiryDate !== undefined ? item?.expiryDate : null,
        );
        const extractedDates = dataArr.map((dateString) => {
          if (dateString !== null) {
            const date = new Date(dateString);
            const year = date.getUTCFullYear();
            const month = String(date.getUTCMonth() + 1).padStart(2, '0');
            const day = String(date.getUTCDate()).padStart(2, '0');

            return `${year}-${month}-${day}`;
          }
          return null;
        });
        setExpDate(extractedDates);
        setQuantity(
          response?.multipleBatchCreations?.map((item) =>
            item?.quantity !== null && item?.quantity !== undefined ? item?.quantity : 0,
          ),
        );
        setOpeningStack(response.openingStock);
        setPackagingTypeIMS(response.packagingType);
        SetsellOutOfStock(response?.continueSelling);
        setComparePrice(response.comparePrice);
        setReorderPoint(response.reorderPoint);
        setReorderQuantity(response.reorderQuantity);
        if (response.marginType !== null) {
          setMarginType({ value: response.marginType, label: response.marginType });
        }
        if (response.marginValue !== null) {
          setMarginValue(response.marginValue);
        }
        if (response.sellingUnit !== null) {
          setSellingUnit({ value: response.sellingUnit, label: response.sellingUnit });
        }
        setReorderQuantityUnit({ value: response.reorderQuantityType, label: response.reorderQuantityType });
        setMinOrderQty(response.minimumOrderQuantity);
        setMinOrderQtyUnit({
          value: response?.minimumOrderQuantityUnit,
          label: response?.minimumOrderQuantityUnit,
        });
        if (response?.unitType === 'Grams') {
          setSpOption({ value: 'Grams', label: 'gms' });
        } else if (response?.unitType === 'Kilograms') {
          setSpOption({ value: 'Kilograms', label: 'kg' });
        } else if (response?.unitType === 'Millilitres') {
          setSpOption({ value: 'Millilitres', label: 'ml' });
        } else if (response?.unitType === 'Litres') {
          setSpOption({ value: 'Litres', label: 'Litres' });
        } else {
          setSpOption({ value: 'each', label: 'each' });
        }

        if (response?.marginBasedOn === 'pp') {
          setMarginBased({ value: 'pp', label: 'Purchase Price' });
        } else {
          setMarginBased({ value: 'mrp', label: 'MRP' });
        }
      })
      .catch((err) => {
        setInvetoryLoader(false);
      });
  }, []);

  const handleChange = (e) => {
    setTitle(e.currentTarget.value);
    setisTitleChange(true);
  };

  const handleChange1 = (e) => {
    setMainCat(e.currentTarget.value);
  };

  //  const handleRow=(a)=>{
  //  setNewRow([...newRow,{id:newRow[newRow.length-1].id+a}])
  // }

  const handleRemove = (index) => {
    const list = [...inputlist];
    list.splice(index, 1);
    setInputlist(list);
  };

  const onSelectFile = (event) => {
    const selectedFiles = event.target.files;
    const selectedFilesArray = Array.from(selectedFiles);
    selectedFilesArray.map((e) => {
      setBlobImages((prev) => [...prev, e]);
    });
    const imagesArray = selectedFilesArray.map((file) => {
      return URL.createObjectURL(file);
    });
    setSelectedImages((previousImages) => previousImages.concat(imagesArray));
    event.target.value = '';
  };

  function deleteHandler(image) {
    setSelectedImages(selectedImages.filter((e, i) => i !== image));
    setBlobImages(blobImages.filter((e, i) => i !== image));
    URL.revokeObjectURL(image);
  }

  const handleImage = () => {
    setImgdiv(true);
  };

  const handleSaveImage = () => {
    setImgdiv(false);
  };

  useEffect(() => {
    const bundleData = productSource?.bundledGtins;
    const payload = {
      gtin: bundleData,

      sort: {
        mrpSortOption: 'DEFAULT',
        popular: 'DEFAULT',
        creationDateSortOption: 'DEFAULT',
      },
    };
    if (bundleData?.length) {
      filterVendorSKUData(payload)
        .then((res) => {
          setBundleProductData(res?.data?.data?.products);
        })
        .catch((err) => {});
    }
  }, [productSource]);

  const handleSaveAlert = () => {
    if (isGen && (isTitleChange || isMainCatChange || isCat1Change || isCat2Change || ishscodeChange || isIgstChange)) {
      const newSwal = Swal.mixin({
        buttonsStyling: false,
      });
      newSwal
        .fire({
          title: 'Are you sure?',
          text: 'This is a global product, editing this will affect other locations. This change will be reviewed internally.',
          icon: 'warning',
          confirmButtonText: 'Confirm',
          showCancelButton: true,
          reverseButtons: true,
          customClass: {
            title: 'custom-swal-title',
            cancelButton: 'logout-cancel-btn',
            confirmButton: 'logout-success-btn', // Added custom class for title
          },
        })
        .then((result) => {
          if (result.isConfirmed) {
            editProductFn();
          }
        });
    } else {
      editProductFn();
    }
  };

  const isNumber = (value) => {
    return typeof value === 'number' && !Number.isNaN(value);
  };

  const editProductFn = () => {
    const contextType = localStorage.getItem('contextType');
    const inventoryData = Array.from({ length: count }).map((_, index) => ({
      quantity: Number(quantity[index]),
      expiryDate: expDate[index],
      purchasePrice: Number(purchasePrice[index]),
      sellingPrice: Number(salePrice[index]),
      mrp: Number(mrp[index]),
      batchId: batchno[index],
      inventoryId: inventoryId[index],
      availableUnits: availableUnits[index],
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

    function areBatchNosEqual(arr1, arr2) {
      if (arr2.length > 0) {
        return arr1.length === arr2.length && arr1.every((item, index) => item.batchNo === arr2[index].batchNo);
      }
    }

    if (batchPresent && !areBatchNosEqual(sortedInventoryData, multipleBatchCreations)) {
      setSeverity('error');
      setErrorMsg('Batch already present, remove or add different Batch');
      setOpen(true);
    } else {
      const payload2 = {
        productId: gtin,
        locationId: locId,
        unitType: spOption?.value,
        continueSelling: sellOutOfStock ? sellOutOfStock : 0,
        threshHold: sellOutOfStock === 'N' ? 0 : 999999,
        overSold: 0,
        createdBy: user_name,
        sourceId: locId,
        sourceName: null,
        category: mainCatSelected?.label,
        subCategory: cat1?.label,
        openingStock: openingStack,
        packagingType: weighingScale ? 'weighingScale' : packagingTypeIMS,
        specification: units,
        reorderPoint: reorderPoint,
        gtin: gtin,
        status: null,
        orgId: orgId,
        reorderQuantity: reorderQuantity,
        reorderQuantityType: reorderQuantityUnit.label,
        comparePrice: comparePrice,
        minimumOrderQuantity: minOrderQty,
        minimumOrderQuantityUnit: minOrderQtyUnit?.label,
        brand: manufacturer?.label,
        locationType: contextType,
        itemName: title,
        purchaseIGst: igst || 0,
        purchaseCGst: cgst || 0,
        purchaseSGst: sgst || 0,
        sellingCESS: cess || 0,
        multipleBatchCreations: sortedInventoryData,
        skuid: gtin,
        marginValue: marginValue,
        marginType: marginType?.label,
        marginBasedOn: marginBased?.value,
        sellingUnit: weighingScale ? weighingScaleUnit?.value : sellingUnit.value,
      };

      // if (!isGen) {
      const igstValue = igst === 0 ? '0' : igst;
      if (
        (!isGen &&
          (!title || !mainCatSelected?.label || !cat1?.label || !cat2?.label || !manufacturer?.label || !units)) ||
        !hscode ||
        !igstValue ||
        !gtin ||
        hasEmptyValue
      ) {
        setSeverity('warning');
        setErrorMsg('Please fill all required fields ');
        setOpen(true);
      } else {
        const languages = inputlist?.filter((e) => e.name);
        setLoader(true);
        let highestDateIndex = 0;
        if (expDate) {
          const dates = expDate?.map((dateStr) => new Date(dateStr));

          highestDateIndex = dates?.reduce((maxIndex, currentDate, currentIndex) => {
            return currentDate > dates[maxIndex] ? currentIndex : maxIndex;
          }, 0);
        }

        const typeOf = isNumber(Number(itemReferences));

        const payload1 = {
          name: title,
          brand: brandName?.label,
          gtin: gtin,
          main_category: mainCatSelected.label,
          category_level_1: cat1.label,
          category_level_2: cat2.label,
          description: description,
          returnable: returned,
          sell_out_of_stock: sofs,
          minimum_order_quantity: minOrderQty,
          minimum_order_quantity_unit: minOrderQtyUnit?.label,
          vendorId: preferredVendor?.value,
          vendorName: preferredVendor?.label,
          compare_price: comparePrice,
          foodType: isFood ? isFoodItem?.value : 'Not Applicable',
          storeItemReferences:
            itemReferences.length > 0 ? [typeOf ? locId + '_' + itemReferences : itemReferences.join('')] : [],
          // mrp: expDate? mrp[highestDateIndex] : '',
          specification: units,
          unit: spOption?.value,
          hsnCode: hscode || 0,
          igst: igst || 0,
          cgst: cgst || 0,
          sgst: sgst || 0,
          cess: cess || 0,
          language: {
            nativeLanguages: languages,
          },
          companyDetail: {
            name: manufacturer?.label,
          },
          bundledGtins: bundleProductData?.map((item) => item?.gtin) ?? [],
          tags: tags,
        };
        if (secWeighingCheckBox) {
          payload1.secondarySpecs = Array.from({ length: secWeighingCount }).map((e, index) => ({
            measurement_unit: secondarySPOption[index]?.value,
            net_weight: secondaryWeighingUnit[index],
            gross_weight: secondaryWeighingUnit[index],
            net_content: secondaryWeighingUnit[index],
          }));
        }
        if (weighingScale) {
          payload1.packaging_type = 'weighingScale';
        } else {
          payload1.packaging_type = packagingType === 'weighingscale' ? 'weighingScale' : 'standard';
        }

        const prevBundleData = bundleProductData?.map((item) => item?.gtin) ?? [];
        const newBundleData = bundleGtin;
        payload1.bundledGtins = [...prevBundleData, ...newBundleData];
        if (expDate) {
          payload1.mrp = mrp[highestDateIndex];
        } else if (mrp) {
          payload1.mrp = lastIndexOf(mrp);
        }
        const formData = new FormData();
        formData.append(
          'product',
          new Blob([JSON.stringify(payload1)], {
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
        editProduct(id, formData)
          .then(() => {
            addProductInventory(payload2)
              .then((res) => {
                setLoader(false);
                if (res.data.data.es === 0) {
                  // navigate(`/products/all-products/details/${id}`);
                  handleProductNavigation(id);
                } else {
                  setSeverity('error');
                  setErrorMsg(res.data.data.message);
                  setOpen(true);
                }
              })
              .catch((err) => {
                setLoader(false);
              });
          })
          .catch((err) => {
            setLoader(false);
          });
      }
      // } else {
      //   if (hasEmptyValue) {
      //     setSeverity('warning');
      //     setErrorMsg('Please fill all required fields related to Price');
      //     setOpen(true);
      //   } else {
      //     addProductInventory(payload2)
      //       .then((res) => {
      //         setLoader(false);
      //         if (res.data.data.es === 0) {
      //           navigate(`/products/all-products/details/${id}`);
      //         } else {
      //           setSeverity('error');
      //           setErrorMsg(res.data.data.message);
      //           setOpen(true);
      //         }
      //       })
      //       .catch((err) => {
      //         setLoader(false);
      //       });
      //   }
      // }
    }
  };

  const showAlert = () => {
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
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
      })
      .then((result) => {
        if (result.isConfirmed) {
          // Swal.fire('Deleted!', 'Product has been deleted.', 'success');
          if (!isGen) {
            deleteProduct(id)
              .then((res) => {
                Swal.fire({
                  icon: 'success',
                  title: 'Product has been deleted',
                  showConfirmButton: true,
                  confirmButtonText: 'OK',
                }).then(() => {
                  navigate('/products/all-products');
                });
              })
              .catch((err) => {
                Swal.fire({
                  icon: 'error',
                  title: 'Unable to delete product',
                  showConfirmButton: true,
                  confirmButtonText: 'OK',
                });
              });
          } else {
            const setContextPayload = (context) => {
              if (context === 'RETAIL') {
                return 'RETAIL';
              } else if (context === 'WMS') {
                return 'WAREHOUSE';
              } else {
                return '';
              }
            };
            const contextType = setContextPayload(localStorage.getItem('contextType'));
            deleteProductFromOrg(id, locId, contextType)
              .then((res) => {
                Swal.fire({
                  icon: 'success',
                  title: 'Product has been deleted',
                  showConfirmButton: true,
                  confirmButtonText: 'OK',
                }).then(() => {
                  navigate('/products/all-products');
                });
              })
              .catch((err) => {
                Swal.fire({
                  icon: 'error',
                  title: 'Unable to delete product',
                  showConfirmButton: true,
                  confirmButtonText: 'OK',
                });
              });
          }
        }
      });
  };

  const handleRow = () => {
    setInputlist([...inputlist, { product_title: '', lang_location: '' }]);
  };

  const handleProdLang = (index, e) => {
    const { name, value } = e.target;
    const list = [...inputlist];
    list[index][name] = value;
    setInputlist(list);
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

  const handleBundleDelete = (index) => {
    const updatedBundleProductData = [...bundleProductData];
    updatedBundleProductData.splice(index, 1);
    setBundleProductData(updatedBundleProductData);
  };

  const handleDeleteproduct = (index) => {
    const updatedBundleProductData = [...bundleGtin];
    const inputData = [...inputProductData];
    updatedBundleProductData.splice(index, 1);
    inputData.splice(index, 1);
    setInputProductData(inputData);
    setBundleGtin(updatedBundleProductData);
    // setaddBundleCount(addBundleCount - 1 || 1);
  };

  const handleDeleteSecondarySpec = (index) => {
    const secondaryUnitsdata = [...secondaryWeighingUnit];
    const secondaryOptions = [...secondarySPOption];
    secondaryUnitsdata.splice(index, 1);
    secondaryOptions.splice(index, 1);
    setSecondarySpOption(secondaryOptions);
    setSecondaryWeighingUnits(secondaryUnitsdata);
    setSecWeighingCount(secWeighingCount - 1 || 0);
  };

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

  return (
    <DashboardLayout>
      {!isMobileDevice && <DashboardNavbar prevLink={true} />}
      {isMobileDevice && (
        <SoftBox className="navbar-main-div-mob-bg po-box-shadow nav-pos-mob">
          <MobileNavbar title={'Edit Product Details'} prevLink={true} />
        </SoftBox>
      )}
      <SoftBox my={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={4}>
            <Card sx={{ height: '100%' }} className={`${isMobileDevice && 'po-box-shadow'}`}>
              <SoftBox p={3}>
                <SoftTypography variant="h5" fontWeight="bold">
                  Product Image
                </SoftTypography>
                <br />
                {prodLoader ? (
                  <Spinner />
                ) : (
                  <>
                    {imgaediv ? (
                      <section>
                        <SoftBox className="multiple-box">
                          <label variant="body2" className="body-label">
                            <br />
                            Browse Image
                            <input
                              type="file"
                              name="images"
                              onChange={onSelectFile}
                              multiple
                              accept="image/png , image/jpeg, image/webp"
                            />
                          </label>
                        </SoftBox>

                        {selectedImages.length > 0 &&
                          (selectedImages.length > 10 ? (
                            <p className="error">
                              You can't upload more than 10 images! <br />
                              <span>
                                please delete <b> {selectedImages.length - 10} </b> of them{' '}
                              </span>
                            </p>
                          ) : (
                            ''
                          ))}

                        <div className="images-box">
                          {/* {selectedImages &&
                            selectedImages.map((image, index) => {
                              return (
                                <div key={image} className="image">
                                  <img src={image} height="200" alt="" className="uil" />
                                  <button onClick={() => deleteHandler(image)} className="del-btn">
                                    <DeleteOutlineIcon />
                                  </button>
                                </div>
                              );
                            })} */}
                          <DndContext
                            sensors={sensors}
                            collisionDetection={closestCorners}
                            onDragStart={handleDragStart}
                            onDragOver={handleDragOver}
                            onDragEnd={handleDragEnd}
                            onDragCancel={handleDragCancel}
                          >
                            <SortableContext items={selectedImages} strategy={() => {}}>
                              <PhotoGrid columns={2}>
                                {selectedImages.map((url, index) => (
                                  <div key={url} className="image">
                                    <SoftTypography variant="h7" fontWeight="bold">
                                      {index == 0 ? (
                                        <>1</>
                                      ) : index == 1 ? (
                                        <>2</>
                                      ) : index == 2 ? (
                                        <>3</>
                                      ) : index == 3 ? (
                                        <>4</>
                                      ) : index == 4 ? (
                                        <>5</>
                                      ) : index == 5 ? (
                                        <>6</>
                                      ) : index == 6 ? (
                                        <>7</>
                                      ) : index == 7 ? (
                                        <>8</>
                                      ) : (
                                        <></>
                                      )}
                                    </SoftTypography>
                                    <SortablePhoto key={url} url={url} index={index} />
                                    <button onClick={() => deleteHandler(index)} className="del-btn">
                                      <DeleteOutlineIcon />
                                    </button>
                                  </div>
                                ))}
                              </PhotoGrid>
                            </SortableContext>

                            <DragOverlay adjustScale={false}>
                              {activeId ? (
                                <div
                                  style={{
                                    display: 'grid',
                                    gridAutoColumns: 'auto',
                                    gridAutoRows: 'auto',
                                    height: '100%',
                                  }}
                                >
                                  <Photo url={activeId} />
                                </div>
                              ) : null}
                            </DragOverlay>
                          </DndContext>
                        </div>
                      </section>
                    ) : (
                      <>
                        {selectedImages && (
                          <SoftBox>
                            {selectedImages.map((e) => {
                              return (
                                <SoftBox
                                  component="img"
                                  src={e}
                                  key={e}
                                  alt=""
                                  borderRadius="lg"
                                  shadow="lg"
                                  width="100px"
                                  height="100px"
                                  my={3}
                                  mr={2}
                                />
                              );
                            })}
                          </SoftBox>
                        )}
                        {selectedImages.length < 1 ? (
                          <SoftBox>
                            <SoftTypography variant="h6">No image available, upload an image.</SoftTypography>
                          </SoftBox>
                        ) : null}
                      </>
                    )}
                    <br />
                    <SoftBox display="flex">
                      <SoftBox mr={1}>
                        {imgaediv ? (
                          <SoftButton
                            disabled={isGen ? true : false}
                            variant={buttonStyles.primaryVariant}
                            className="contained-softbutton"
                            size="small"
                            onClick={handleSaveImage}
                          >
                            save
                          </SoftButton>
                        ) : (
                          <SoftButton
                            disabled={isGen ? true : false}
                            variant={buttonStyles.primaryVariant}
                            className="contained-softbutton"
                            size="small"
                            onClick={handleImage}
                          >
                            edit
                          </SoftButton>
                        )}
                      </SoftBox>
                      <SoftButton
                        variant={buttonStyles.secondaryVariant}
                        className="outlined-softbutton"
                        disabled={isGen ? true : false}
                        onClick={() => {
                          setSelectedImages([]);
                          setBlobImages([]);
                        }}
                        size="small"
                      >
                        remove
                      </SoftButton>
                    </SoftBox>
                  </>
                )}
              </SoftBox>
            </Card>
          </Grid>
          <Grid item xs={12} lg={8}>
            <Card sx={{ overflow: 'visible' }} className={`${isMobileDevice && 'po-box-shadow'}`}>
              <SoftBox p={3}>
                <SoftBox display="flex" gap="30px">
                  <SoftTypography variant="h5">Product Information</SoftTypography>
                  {prodLoader ? (
                    <SoftTypography variant="h5">
                      <Spinner size={10} />
                    </SoftTypography>
                  ) : null}
                </SoftBox>
                <SoftBox mt={2}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <SoftBox mb={1} lineHeight={0}>
                        <SoftBox mb={1}>
                          <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                            {bundleProductData?.length ? 'Bundle Title' : 'Product Title'}
                          </InputLabel>
                        </SoftBox>

                        <SoftInput
                          type="text"
                          disabled={isGen ? true : false}
                          // disabled={!(isSuperAdmin || isRetailAdmin)}
                          id="prodtitle"
                          value={title}
                          onChange={handleChange}
                        />
                      </SoftBox>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <SoftBox mb={1}>
                        <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                          Barcode
                        </InputLabel>
                      </SoftBox>
                      <SoftInput readOnly type="text" value={gtin} />
                    </Grid>

                    {/* bundle products  */}
                    {bundleProductData?.length > 0 && (
                      <Grid item xs={12} sm={6}>
                        <SoftBox mb={1} lineHeight={0}>
                          <SoftBox mb={1}>
                            <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                              Bundle Products
                            </InputLabel>
                          </SoftBox>
                          {bundleProductData?.map((e, i) => (
                            <SoftBox style={{ margin: '5px', position: 'relative' }} key={i}>
                              <SoftInput
                                type="text"
                                id="prodtitle"
                                value={bundleProductData[i]?.name}
                                // onChange={handleChange}
                              />
                              <SoftTypography
                                onClick={() => handleBundleDelete(i)}
                                style={{
                                  fontSize: '1.2rem',
                                  position: 'absolute',
                                  top: '5px',
                                  right: '10px',
                                  color: 'red',
                                }}
                              >
                                <DeleteOutlineIcon />{' '}
                              </SoftTypography>
                            </SoftBox>
                          ))}
                        </SoftBox>
                      </Grid>
                    )}
                    {bundleProductData?.length > 0 && (
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                      >
                        <>
                          <SoftBox lineHeight={0} display="inline-block">
                            <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                              Add Bundle Products{' '}
                            </InputLabel>
                          </SoftBox>
                          {Array.from({ length: addBundleCount }).map((_, index) => (
                            <div style={{ marginTop: '5px', position: 'relative' }}>
                              <Autocomplete
                                disabled={isGen ? true : false}
                                onChange={(event, newValue) => {
                                  setBundleGtin((prev) => [...prev, newValue?.gtin]),
                                    handleGetBatchfromGtin(newValue),
                                    setInputProductData((prev) => [...prev, newValue]);
                                }}
                                filterOptions={(options, params) => {
                                  const filtered = filter(options, params);

                                  const { inputValue } = params;
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
                                    value={inputProductData[index]?.label}
                                    style={{ width: '100%' }}
                                    fullWidth
                                  />
                                )}
                              />
                              <SoftTypography
                                onClick={() => handleDeleteproduct(index)}
                                style={{
                                  fontSize: '1.2rem',
                                  position: 'absolute',
                                  top: '5px',
                                  right: '10px',
                                  color: 'red',
                                }}
                              >
                                <DeleteOutlineIcon />{' '}
                              </SoftTypography>
                            </div>
                          ))}

                          <Grid container mt={3}>
                            <SoftTypography
                              className="add-more-text"
                              style={{ marginLeft: '20px', marginTop: '0px' }}
                              onClick={() => handleAddproduct()}
                              component="label"
                              variant="caption"
                              fontWeight="bold"
                              textTransform="capitalize"
                            >
                              + Add More
                            </SoftTypography>
                          </Grid>
                        </>
                      </Grid>
                    )}

                    <InventoyBatcheswithgtin
                      handleClose={handleClose}
                      handleOpen={handleOpen}
                      open={openBatch}
                      setOpen={setOpenBatch}
                      batchData={batchData}
                      selectedproduct={selectedproduct}
                    />

                    <Grid item xs={12} sm={6}>
                      <SoftBox>
                        <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                          <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                            Main Category
                          </InputLabel>
                        </SoftBox>
                        <SoftSelect
                          value={mainCatSelected}
                          options={mainCatArr}
                          isDisabled={isGen ? true : false}
                          // isDisabled={!(isSuperAdmin || isRetailAdmin)}
                          onChange={(option) => {
                            setisMainCatChange(true);
                            setMainCat(option);
                            setCat1('');
                            setCat2('');
                          }}
                        />
                      </SoftBox>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <SoftBox mb={1}>
                        <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                          <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                            Category level 1
                          </InputLabel>
                        </SoftBox>
                        <SoftSelect
                          value={cat1}
                          options={catLevel1}
                          isDisabled={isGen ? true : false}
                          // isDisabled={!(isSuperAdmin || isRetailAdmin)}
                          onChange={(option) => {
                            setCat1(option);
                            setisCat1Change(true);
                            setCat2('');
                          }}
                        />
                      </SoftBox>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <SoftBox mb={1}>
                        <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                          <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                            Category level 2
                          </InputLabel>
                        </SoftBox>
                        <SoftSelect
                          value={cat2}
                          options={catLevel2}
                          isDisabled={isGen ? true : false}
                          // isDisabled={!(isSuperAdmin || isRetailAdmin)}
                          onChange={(option) => {
                            setCat2(option);
                            setisCat2Change(true);
                            setisHscodeChange(true);
                            setisIgstChange(true);
                            setIgst(option.igst);
                            setCgst(option.cgst);
                            setSgst(option.sgst);
                            setHscode(option.hsn);
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
                      <SoftInput
                        // disabled={isGen ? true : false}
                        disabled={!(isSuperAdmin || isRetailAdmin)}
                        value={hscode}
                        onChange={(e) => {
                          setisHscodeChange(true);
                          setHscode(e.target.value);
                        }}
                      />
                    </Grid>
                    <Grid item xs={6} sm={2}>
                      <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                        <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                          GST
                        </InputLabel>
                      </SoftBox>
                      {/* <SoftInput
                        type="number"
                        // disabled={isGen ? true : !(isSuperAdmin || isRetailAdmin)}
                        disabled={!(isSuperAdmin || isRetailAdmin)}
                        value={igst}
                        icon={{
                          component: '%',
                          direction: 'right',
                        }}
                        onChange={(e) => {
                          setisIgstChange(true);
                          setIgst(e.target.value);
                          setCgst(e.target.value / 2);
                          setSgst(e.target.value / 2);
                        }}
                      /> */}
                      <SoftSelect
                        isDisabled={!(isSuperAdmin || isRetailAdmin)}
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
                          setisIgstChange(true);
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
                        isDisabled={!(isSuperAdmin || isRetailAdmin)}
                        placeholder="Select Cess"
                        options={cessArray}
                        value={{ value: cess, label: cess }}
                        onChange={(e) => {
                          setCess(e?.value);
                        }}
                      ></SoftSelect>
                    </Grid>
                    {/* <Grid item xs={12} sm={6}>
              <SoftBox mb={1}>
                  <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                      <SoftTypography component="label" variant="caption" fontWeight="bold" textTransform="capitalize">Manufacturer</SoftTypography>
                  </SoftBox> */}
                    {/* <SoftSelect
                      value={datRows?.company_detail?.name}
                        options={[
                          { value: "clothing", label: "Clothing" },
                          { value: "electronics", label: "Electronics" },
                          { value: "furniture", label: "Furniture" },
                          { value: "others", label: "Others" },
                          { value: "real estate", label: "Real Estate" },
                        ],
                      [

                      ]}
                      /> */}
                    {/* </SoftBox>
              </Grid> */}
                    <Grid item xs={12} sm={6}>
                      <SoftBox mb={1} lineHeight={0} display="inline-block">
                        <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
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
                          // disabled={isGen ? ismanufacturer : true}
                          // disabled={!(isSuperAdmin || isRetailAdmin)}
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
                            if (filtered == null) {
                              return ' ';
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
                        <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                          <SoftTypography
                            component="label"
                            variant="caption"
                            fontWeight="bold"
                            textTransform="capitalize"
                          >
                            Preferred vendor
                          </SoftTypography>
                        </SoftBox>
                        <Autocomplete
                          value={preferredVendor}
                          // disabled={!(isSuperAdmin || isRetailAdmin)}
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
                              onChange={(event) => setVendorTitle(event.target.value)}
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
                        <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                          <SoftTypography
                            component="label"
                            variant="caption"
                            fontWeight="bold"
                            textTransform="capitalize"
                          >
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

                    <Grid item xs={12} sm={12}></Grid>
                    <Grid item xs={6} sm={3}>
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
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <SoftBox mb={1} lineHeight={0} display="inline-block">
                        <SoftTypography
                          component="label"
                          variant="caption"
                          fontWeight="bold"
                          textTransform="capitalize"
                        >
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
                    {
                      packagingType === 'weighingscale' ? (
                        <Grid item xs={12} sm={12}>
                          <SoftBox mt={1}>
                            <Grid container spacing={1}>
                              <Grid item xs={12} sm={12}>
                                <SoftBox className="hja-box">
                                  <input
                                    className="info-prod-check"
                                    type="checkbox"
                                    checked={changeSellingUnit}
                                    onChange={(e) => setChangeSellingUnit(e.target.checked ? true : false)}
                                  />
                                  <span className="span-text-info">Do you want to change Selling Unit</span>
                                </SoftBox>
                                {changeSellingUnit ? (
                                  <Grid item xs={6} sm={3} mt={1}>
                                    <p className="spec-text">Selling Unit</p>
                                    <SoftBox className="boom-box">
                                      <SoftBox className="boom-soft-box">
                                        <SoftSelect
                                          className="boom-soft-select"
                                          value={sellingUnit}
                                          onChange={(option) => setSellingUnit(option)}
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
                                  </Grid>
                                ) : null}
                              </Grid>
                              <Grid item xs={12} sm={12}></Grid>
                            </Grid>
                          </SoftBox>
                        </Grid>
                      ) : null
                      // (
                      //   (isSuperAdmin || isRetailAdmin) &&
                      //   gtin.length <= 6 && (
                      //     <Grid item xs={12} sm={12}>
                      //       <SoftBox className="hja-box">
                      //         <input
                      //           className="info-prod-check"
                      //           type="checkbox"
                      //           // disabled={isBar}
                      //           checked={weighingScale}
                      //           onChange={(e) => {
                      //             setWeighingScale(e.target.checked ? true : false);
                      //           }}
                      //         />
                      //         <span className="span-text-info">Needs Weighing Scale Integration</span>
                      //       </SoftBox>
                      //       {weighingScale ? (
                      //         <Grid item xs={6} sm={3}>
                      //           <SoftBox mt={1.3}>
                      //             <p className="spec-text">Selling Units</p>
                      //             <SoftBox className="boom-box">
                      //               <SoftBox className="boom-soft-box">
                      //                 <SoftSelect
                      //                   className="boom-soft-select"
                      //                   value={weighingScaleUnit}
                      //                   onChange={(option) => setWeighingScaleUnit(option)}
                      //                   options={[
                      //                     { value: 'gm', label: 'gm' },
                      //                     { value: 'kg', label: 'kg' },
                      //                     { value: 'ml', label: 'ml' },
                      //                     { value: 'ltr', label: 'ltr' },
                      //                     { value: 'each', label: 'each' },
                      //                   ]}
                      //                 />
                      //               </SoftBox>
                      //             </SoftBox>
                      //           </SoftBox>
                      //         </Grid>
                      //       ) : null}
                      //     </Grid>
                      //   )
                      // )
                    }
                    <Grid item xs={12} sm={4} className="hja-box">
                      <input
                        className="info-prod-check"
                        type="checkbox"
                        checked={comparePrice === 'N' ? false : true}
                        onChange={(e) => setComparePrice(e.target.checked ? 'Y' : 'N')}
                      />
                      <span className="span-text-info">Compare Price</span>
                    </Grid>

                    <Grid item xs={12} sm={4} className="hja-box">
                      <input
                        className="info-prod-check"
                        type="checkbox"
                        checked={returned === 'N' ? false : true}
                        onChange={(e) => setReturned(e.target.checked ? 'Y' : 'N')}
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
                        className="info-prod-check"
                        type="checkbox"
                        checked={sofs === 'N' ? false : true}
                        onChange={(e) => setSofs(e.target.checked ? 'Y' : 'N')}
                      />
                      <span className="span-text-info">Continue selling when out of stock</span>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <SoftBox mt={1}>
                        <Grid container spacing={1}>
                          <Grid item xs={12} sm={12}>
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
                                <SoftSelect
                                  defaultValue={isFoodItem}
                                  onChange={(option) => setIsFoodItem(option)}
                                  options={foodTypeOptions}
                                />
                              </SoftBox>
                            ) : null}
                          </Grid>
                          <Grid item xs={12} sm={12}></Grid>
                        </Grid>
                      </SoftBox>
                    </Grid>
                  </Grid>
                </SoftBox>

                <SoftBox mb={2} mt={3}>
                  <SoftTypography variant="h6">Add product title in your local language</SoftTypography>
                </SoftBox>

                {inputlist?.map((x, i) => {
                  return (
                    <Grid container spacing={1} key={i}>
                      <Grid item xs={12} sm={5}>
                        <FormField
                          type="text"
                          label="product title"
                          name="name"
                          value={inputlist[i].name || ''}
                          onChange={(e) => handleProdLang(i, e)}
                        />
                      </Grid>

                      <Grid item xs={12} sm={5}>
                        <SoftBox>
                          <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                            <SoftTypography
                              component="label"
                              variant="caption"
                              fontWeight="bold"
                              textTransform="capitalize"
                            >
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
                              <option>--</option>
                              {stateArr.map((e, i) => {
                                return <option key={i}>{e}</option>;
                              })}
                            </select>
                          </SoftBox>
                          {/* <SoftSelect
            value={{ value: "location", label: "location" }}
            options={[
              { value: "clothing", label: "Kolkata" },
              { value: "electronics", label: "Bangalore" },
              { value: "furniture", label: "Chennai" },
              { value: "others", label: "Tamil Nadu" },
              { value: "real estate", label: "Bihar" },
            ]}
            onChange={(e)=>handleProdLang(i,e)}
            name="lang_location"
          /> */}
                        </SoftBox>
                      </Grid>

                      <Grid item xs={12} sm={1} ml={3} className="close-box-icon">
                        <CloseIcon onClick={() => handleRemove(i)} />
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
                    >
                      Add more
                    </SoftTypography>
                  </Grid>
                </SoftBox>

                <Grid item xs={12} spacing={3}>
                  <InputLabel
                    sx={{
                      fontWeight: 'bold',
                      fontSize: '0.75rem',
                      color: '#344767',
                      marginTop: '18px',
                      marginBottom: '5px',
                    }}
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
          </Grid>

          <Grid item xs={12} lg={12}>
            <Card sx={{ overflow: 'visible' }} className={`${isMobileDevice && 'po-box-shadow'}`}>
              <SoftBox p={3}>
                <SoftBox display="flex" gap="30px">
                  <SoftTypography variant="h5" fontWeight="bold">
                    Specifications
                  </SoftTypography>
                  {invetoryLoader ? (
                    <SoftTypography variant="h5" fontWeight="bold">
                      <Spinner />
                    </SoftTypography>
                  ) : null}
                </SoftBox>

                <SoftBox mt={1}>
                  <Grid container spacing={3} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <Grid item xs={12} sm={6} md={2}>
                      <SoftBox mt={1.3}>
                        <SoftBox mb={1}>
                          <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                            Specifications
                          </InputLabel>
                        </SoftBox>
                        <SoftBox className="boom-box">
                          <SoftInput
                            className="boom-input"
                            value={units}
                            disabled={isGen ? true : false}
                            onChange={(e) => setUnits(e.target.value)}
                            type="number"
                          />
                          <SoftBox className="boom-soft-box">
                            <SoftSelect
                              className="boom-soft-select"
                              value={spOption}
                              isDisabled={isGen ? true : false}
                              defaultValue={{ value: 'each', label: 'each' }}
                              onChange={(option) => setSpOption(option)}
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

                    <Grid item xs={12} sm={6} md={1.5}>
                      <FormField
                        type="number"
                        label="opening stock"
                        defaultValue="1"
                        value={openingStack}
                        onChange={(e) => setOpeningStack(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={2}>
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
                    <Grid item xs={12} sm={6} md={2}>
                      <SoftBox mt={1.3}>
                        <SoftBox mb={1} ml={1}>
                          <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                            Margin
                          </InputLabel>
                        </SoftBox>
                        <SoftBox className="boom-box">
                          <SoftInput
                            className="boom-input"
                            value={marginValue}
                            onChange={(e) => setMarginValue(e.target.value)}
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
                    <Grid item xs={12} sm={6} md={1.5}>
                      <FormField
                        type="number"
                        label="reorder point"
                        defaultValue="1"
                        value={reorderPoint}
                        onChange={(e) => setReorderPoint(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={2}>
                      <SoftBox mt={1.3}>
                        <p className="spec-text">Reorder Quantity</p>
                        <SoftBox className="boom-box">
                          <SoftInput
                            className="boom-input"
                            value={reorderQuantity}
                            onChange={(e) => setReorderQuantity(e.target.value)}
                            type="number"
                          />
                          <SoftBox className="boom-soft-box">
                            <SoftSelect
                              className="boom-soft-select"
                              defaultValue={{ value: 'each', label: 'each' }}
                              value={reorderQuantityUnit}
                              onChange={(option) => setReorderQuantityUnit(option)}
                              options={[
                                { value: 'gm', label: 'gm' },
                                { value: 'kg', label: 'kg' },
                                { value: 'ml', label: 'ml' },
                                { value: 'lt', label: 'ltr' },
                                { value: 'each', label: 'each' },
                              ]}
                            />
                          </SoftBox>
                        </SoftBox>
                      </SoftBox>
                    </Grid>
                  </Grid>
                </SoftBox>
                {packagingType === 'weighingscale' && (
                  <SoftBox
                    style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', gap: '20px' }}
                  >
                    <SoftBox mt={1} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <SoftBox style={{ marginTop: '5px' }}>
                        <Checkbox
                          inputProps={{ 'aria-label': 'controlled' }}
                          checked={secWeighingCheckBox}
                          onClick={() => setSecWeighingCheckBox(event.target.checked)}
                        />
                      </SoftBox>
                      <SoftBox>
                        <InputLabel
                          sx={{
                            fontWeight: 'bold',
                            fontSize: '0.75rem',
                            color: '#344767',
                            marginTop: '18px',
                            marginBottom: '5px',
                          }}
                        >
                          Additional Weighing Specs & units
                        </InputLabel>
                      </SoftBox>
                    </SoftBox>

                    {secWeighingCheckBox && (
                      <>
                        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                          {Array.from({ length: secWeighingCount }).map((e, index) => (
                            <Grid item xs={12} sm={6} md={2}>
                              <SoftBox mt={1.3}>
                                <SoftBox mb={1}>
                                  <InputLabel
                                    required
                                    sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}
                                  >
                                    Specifications
                                  </InputLabel>
                                </SoftBox>

                                <SoftBox style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                  <SoftBox className="boom-box">
                                    <SoftInput
                                      className="boom-input"
                                      value={secondaryWeighingUnit[index]}
                                      disabled={isGen ? true : false}
                                      onChange={(e) => {
                                        const newValue = e.target.value;
                                        setSecondaryWeighingUnits((prevUnits) => {
                                          const updatedUnits = [...prevUnits];
                                          updatedUnits[index] = newValue;
                                          return updatedUnits;
                                        });
                                      }}
                                      type="number"
                                    />
                                    <SoftBox className="boom-soft-box">
                                      <SoftSelect
                                        className="boom-soft-select"
                                        value={secondarySPOption[index]}
                                        isDisabled={isGen ? true : false}
                                        defaultValue={{ value: 'each', label: 'each' }}
                                        onChange={(option) => {
                                          const newValue = option;
                                          setSecondarySpOption((prevUnits) => {
                                            const updatedUnits = [...prevUnits];
                                            updatedUnits[index] = newValue;
                                            return updatedUnits;
                                          });
                                        }}
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
                                  <SoftBox>
                                    <SoftTypography
                                      onClick={() => handleDeleteSecondarySpec(index)}
                                      style={{
                                        fontSize: '1.2rem',
                                        top: '5px',
                                        right: '10px',
                                        color: 'red',
                                      }}
                                    >
                                      <DeleteOutlineIcon />{' '}
                                    </SoftTypography>
                                  </SoftBox>
                                </SoftBox>
                              </SoftBox>
                            </Grid>
                          ))}
                        </div>
                        <SoftBox style={{ marginRight: 'auto' }}>
                          <Button
                            onClick={() => setSecWeighingCount(secWeighingCount + 1)}
                            className="add-more-text"
                            style={{ textTransform: 'none' }}
                          >
                            + Add More
                          </Button>
                        </SoftBox>
                      </>
                    )}
                  </SoftBox>
                )}
              </SoftBox>
            </Card>

            <EditPricingField
              invetoryLoader={invetoryLoader}
              setSeverity={setSeverity}
              setErrorMsg={setErrorMsg}
              setOpen={setOpen}
              count={count}
              SetCount={SetCount}
              handleAddmore={handleAddmore}
              mrp={mrp}
              setMrp={setMrp}
              salePrice={salePrice}
              setSalePrice={setSalePrice}
              purchasePrice={purchasePrice}
              setPurchasePrice={setPurchasePrice}
              batchno={batchno}
              inventoryId={inventoryId}
              availableUnits={availableUnits}
              setBatchNo={setBatchNo}
              setInventoryId={setInventoryId}
              setAvailableUnits={setAvailableUnits}
              expDate={expDate}
              quantity={quantity}
              setQuantity={setQuantity}
              setExpDate={setExpDate}
              fixedCount={fixedCount}
              setBatchPresent={setBatchPresent}
            />
          </Grid>
        </Grid>
      </SoftBox>
      <SoftBox mb={3}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} lg={6}></Grid>
          <Grid item xs={12} lg={6}>
            <SoftBox display="flex" justifyContent="flex-end">
              <SoftButton
                variant={buttonStyles.secondaryVariant}
                className="outlined-softbutton"
                onClick={() => handleProductNavigation(gtin)}
                style={{ marginRight: '10px' }}
              >
                cancel
              </SoftButton>
              <SoftButton
                disabled={loader}
                onClick={() => handleSaveAlert(datRows?.gtin)}
                variant={buttonStyles.primaryVariant}
                className="edit-product-save-btn contained-softbutton"
              >
                {loader ? (
                  <CircularProgress
                    size={18}
                    sx={{
                      color: '#fff',
                    }}
                  />
                ) : (
                  <>Save</>
                )}
              </SoftButton>
              <SoftButton
                variant={buttonStyles.primaryVariant}
                onClick={showAlert}
                color="error"
                sx={{ height: '100%', marginLeft: '0.5rem' }}
              >
                Delete
              </SoftButton>
            </SoftBox>
          </Grid>
        </Grid>
      </SoftBox>
      <Footer />
      <Snackbar open={open} autoHideDuration={3000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity={severity} sx={{ width: '100%' }}>
          {errormsg}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
}

export default EditProduct;
