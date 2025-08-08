import {
  Box,
  Button,
  Card,
  Checkbox,
  Chip,
  Grid,
  InputLabel,
  Modal,
  TextField,
  TextareaAutosize,
  Tooltip,
  Typography,
} from '@mui/material';
import './index.css';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { useEffect, useState } from 'react';
import {
  getAllBrands,
  getAllLevel1Category,
  getAllLevel2Category,
  getAllMainCategory,
  getAllManufacturerV2,
  getAllSubBrands,
  getCatLevel2ByName,
  getGlobalProducts,
  getItemsInfo,
  getTaxDetailsByLevel3Id,
} from '../../../../../../../../config/Services';
import SoftButton from '../../../../../../../../components/SoftButton';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SoftBox from '../../../../../../../../components/SoftBox';
import SoftSelect from '../../../../../../../../components/SoftSelect';
import SoftInput from '../../../../../../../../components/SoftInput';
import { isSmallScreen, textFormatter } from '../../../../../../Common/CommonFunction';
import SoftTypography from '../../../../../../../../components/SoftTypography';
import { useSelector } from 'react-redux';
import {
  clearProductDetails,
  getClearedDetails,
  getProductDetails,
  setProductDetails,
} from '../../../../../../../../datamanagement/productDetailsSlice';
import { Navigate, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import ComingSoonAlert from '../../../../../../products-new-page/ComingSoonAlert';
import { AsyncPaginate } from 'react-select-async-paginate';
import SoftAsyncPaginate from '../../../../../../../../components/SoftSelect/SoftAsyncPaginate';

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
  width: '70%',
  height: '70%',
  p: 4,
};

const inputLabelStyle = { fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' };
const AddProductDescription = ({ onDataChange, isEditable, editLoader, setEditLoader }) => {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const productData = useSelector(isEditable ? getProductDetails : getClearedDetails);
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const filter = createFilterOptions();
  const isMobileDevice = isSmallScreen();
  const [tempTitle, setTempTitle] = useState('');
  const [optionsArray, setOptionsArray] = useState([]);
  const [optArray, setOptArray] = useState([]);
  const [optDataArray, setOptDataArray] = useState([]);
  const [loader, setLoader] = useState(false);

  const [mainCatArr, setMainCatArr] = useState([]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  // ------------------------------------------------

  useEffect(() => {
    return () => {
      dispatch(clearProductDetails());
    };
  }, [dispatch]);

  const [formData, setFormData] = useState({
    productTitle: '',
    mainCatArr: [],
    catLevel1: '',
    catLeve2Arr: [],
    catLevel2: '',
    catLeve3Arr: [],
    catLevel3: '',
    hsn: '',
    igst: '',
    sgst: '',
    cgst: '',
    cess: '',
    spOption: { value: 'nos', label: 'each' },
    weighingScale: '',
    weighingScaleUnit: { value: 'Kg', label: 'kg' },
    exempeted: false,
    mrpRestrictions: false,
    weighingScaleIntegration: false,
    exportEligible: false,
    isRawMaterial: false,
    hsnOptions: [],
    metadata: {},
    givenCatName: '',
    givenSubCatName: '',
    givenSubCat2Name: '',
  });

  const [taxData, setTaxData] = useState([]);

  const errMsg = optArray?.some((item) => item.label === formData?.productTitle);
  const [brandList, setBrandList] = useState([]);
  const [subBrandList, setSubBrandList] = useState([]);
  const [manufacturerOptions, setManufactureOptions] = useState([]);
  const [productOptionData, setProductOptionData] = useState([]);
  const [productOption, setProductOption] = useState([]);
  const [selectedProductData, setSelectedProductData] = useState([]);
  const [variantData, setVariantData] = useState([]);
  // ----------------------------------------------

  const fetchCategoryName = async (categoryId) => {
    try {
      const payload = {
        type: ['APP'],
        active: [true],
        sourceId: [orgId],
        sourceLocationId: [locId],
        categoryName: [categoryId],
      };

      const res = await getAllMainCategory(payload);
      const categoryData = res?.data?.data?.results[0];

      if (categoryData) {
        // Return both the name and ID
        return {
          categoryName: categoryData?.categoryName || '',
          categoryId: categoryData?.mainCategoryId,
        };
      }

      return { categoryName: '', categoryId: '' };
    } catch (err) {
      return { categoryName: '', categoryId: '' };
    }
  };

  const fetchCategory2Name = async (categoryId) => {
    try {
      const payload = {
        type: ['APP'],
        active: [true],
        sourceId: [orgId],
        sourceLocationId: [locId],
        categoryName: [categoryId],
      };
      const res = await getAllLevel1Category(payload);
      const categoryData = res?.data?.data?.results[0];
      if (categoryData) {
        return {
          categoryName: categoryData?.categoryName || '',
          categoryId: categoryData?.level1Id,
        };
      }

      return { categoryName: '', categoryId: '' };
    } catch (err) {
      return { categoryName: '', categoryId: '' };
    }
  };

  const fetchCategory3Name = async (categoryId) => {
    try {
      const payload = {
        type: ['APP'],
        active: [true],
        sourceId: [orgId],
        sourceLocationId: [locId],
        categoryName: [categoryId],
      };
      const res = await getAllLevel2Category(payload);
      const categoryData = res?.data?.data?.results[0];
      if (categoryData) {
        return {
          categoryName: categoryData?.categoryName || '',
          categoryId: categoryData?.level2Id,
        };
      }

      return { categoryName: '', categoryId: '' };
    } catch (err) {
      return { categoryName: '', categoryId: '' };
    }
  };

  const fetchBrandName = async (categoryId) => {
    try {
      const payload = {
        brandId: [categoryId],
      };
      const res = await getAllBrands(payload);
      return res?.data?.data?.results[0]?.brandName || '';
    } catch (err) {
      return '';
    }
  };

  const fetchSubBrandName = async (categoryId) => {
    try {
      const payload = {
        subBrandId: [categoryId],
      };
      const res = await getAllSubBrands(payload);
      return res?.data?.data?.results[0]?.subBrandName || '';
    } catch (err) {
      return '';
    }
  };

  const fetchManuName = async (categoryId) => {
    try {
      const payload = {
        manufacturerId: [categoryId],
      };
      const res = await getAllManufacturerV2(payload);
      return res?.data?.data?.results[0]?.manufacturerName || '';
    } catch (err) {
      return '';
    }
  };
  const handleFetchCategories = async () => {
    setEditLoader(true);
    const newValues = {};
    // Fetch category name for catLevel1
    if (productData?.appCategories?.categoryLevel1?.[0]) {
      const { categoryName, categoryId } = await fetchCategoryName(productData?.appCategories?.categoryLevel1?.[0]);
      if (categoryName !== productData?.appCategories?.categoryLevel1[0]) {
        newValues.givenCatName = productData?.appCategories?.categoryLevel1[0];
      }

      newValues.catLevel1 = {
        value: categoryId,
        label: categoryName,
      };
    }

    // Other fields

    if (productData?.appCategories?.categoryLevel2?.[0]) {
      const { categoryName, categoryId } = await fetchCategory2Name(productData?.appCategories?.categoryLevel2?.[0]);
      if (categoryName !== productData?.appCategories?.categoryLevel2[0]) {
        newValues.givenSubCatName = productData?.appCategories?.categoryLevel2[0];
        if (newValues.catLevel1) {
          handleMainCatChange(newValues.catLevel1);
        }
      }

      newValues.catLevel2 = {
        value: categoryId,
        label: categoryName,
      };
    }

    if (productData?.appCategories?.categoryLevel3?.[0]) {
      const { categoryName, categoryId } = await fetchCategory3Name(productData?.appCategories?.categoryLevel3?.[0]);
      if (categoryName !== productData?.appCategories?.categoryLevel3[0]) {
        newValues.givenSubCat2Name = productData?.appCategories?.categoryLevel3[0];
        if (newValues.catLevel2) {
          handleLevel2CatChange(newValues.catLevel2);
        }
      }

      newValues.catLevel3 = {
        value: categoryId,
        label: categoryName,
      };
    }

    if (productData?.companyDetail?.brandId) {
      const brandName = await fetchBrandName(productData?.companyDetail?.brandId);

      newValues.brand = {
        value: productData?.companyDetail?.brandId,
        label: brandName,
      };
    }

    if (productData?.companyDetail?.subBrandId) {
      const subBrandName = await fetchSubBrandName(productData?.companyDetail?.subBrandId);

      newValues.subBrand = {
        value: productData?.companyDetail?.subBrandId,
        label: subBrandName,
      };
    }

    if (productData?.companyDetail?.manufacturerId) {
      const manufactureName = await fetchManuName(productData?.companyDetail?.manufacturerId);

      newValues.manufacturer = {
        value: productData?.companyDetail?.manufacturerId,
        label: manufactureName,
      };
    }
    setFormData((prevFormData) => ({
      ...prevFormData,
      ...newValues,
    }));
    setEditLoader(false);
  };
  useEffect(() => {
    const setFormDataWithCategories = async () => {
      const newValues = {};

      newValues.productTitle = productData?.title;
      newValues.description = productData?.description;

      // newValues.manufacturer = {
      //   value: productData?.companyDetail?.manufacturerId,
      //   label: productData?.companyDetail?.manufacturer,
      // };

      newValues.hsn = productData?.taxReference?.metadata?.hsnCode || '';
      newValues.cess = productData?.taxReference?.metadata?.cess || '';
      newValues.igst = productData?.taxReference?.taxRate || '';

      if (productData?.taxReference?.metadata) {
        const { cess, hsnCode, ...filteredMetadata } = productData?.taxReference?.metadata;
        newValues.metadata = filteredMetadata;
      } else {
        newValues.metadata = {};
      }

      newValues.weighingScaleIntegration = productData?.needsWeighingScaleIntegration;
      newValues.exportEligible = productData?.eligibleForExport;
      newValues.exempeted = productData?.isTaxExempted;
      newValues.mrpRestrictions = productData?.isMrpRestricted;
      newValues.isRawMaterial = productData?.isRawMaterial || false;

      // Set the formData state with new values
      setFormData((prevFormData) => ({
        ...prevFormData,
        ...newValues,
      }));
      handleFetchCategories();
    };

    if (productData) {
      setFormDataWithCategories();
    }
  }, [productData]);

  const handleLookUp = () => {
    const payload = {
      page: 1,
      pageSize: 20,
      // names: [formData?.productTitle],
      query: formData?.productTitle,
      // storeLocationId: locId?.toLowerCase(),
    };
    getGlobalProducts(payload)
      .then((res) => {
        setProductOptionData(res?.data?.data?.data?.data || []);
        setProductOption(
          res?.data?.data?.data?.data?.map((item) => ({
            value: item?.name,
            label: item?.name,
            id: item?.id,
            variantCount: item?.variants?.length,
            selected: false,
          })),
        );

        handleOpen();
      })
      .catch(() => {});
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

  useEffect(() => {
    onDataChange(formData);
  }, [formData]);

  const loadBrandOptions = async (searchQuery, loadedOptions, { page }) => {
    const payload = {
      page: page,
      pageSize: 10, // Adjust as necessary
      sourceId: [orgId],
      sourceLocationId: [locId],
      brandName: [searchQuery] || [], // If searchQuery exists, use it
      active: [true],
    };

    try {
      const res = await getAllBrands(payload);
      if (res?.data?.status === 'ERROR') {
        showSnackbar(res?.data?.message, 'error');
        return {
          options: [],
          hasMore: false,
        };
      } else {
        const data = res?.data?.data?.results || [];
        const options = data?.map((item) => ({
          label: item?.brandName,
          value: item?.brandId,
        }));
        return {
          options,
          hasMore: data?.length >= 10, // Check if there's more data to load
          additional: {
            page: page + 1, // Increment the page for the next fetch
          },
        };
      }
    } catch (error) {
      showSnackbar('Error while fetching brands', 'error');
      return {
        options: [],
        hasMore: false,
      };
    }
  };

  // const fetchSubBrands = (brandId) => {
  //   const subBrandPayload = {
  //     sourceLocationId: [locId],
  //     brandId: [brandId],
  //   };
  //   getAllSubBrands(subBrandPayload)
  //     .then((res) => {
  //       const data = res?.data?.data?.results;
  //       // setBrandList(data);
  //       if (data?.length > 0) {
  //         let subBrandArr = [];
  //         data?.map((e) => {
  //           subBrandArr?.push({ value: e?.subBrandId, label: e?.subBrandName });
  //         });
  //         setSubBrandList(subBrandArr);
  //       }
  //     })
  //     .catch(() => {});
  // };
  // useEffect(() => {
  //   // fetchBrands();
  //   handleAllManufactures();
  // }, []);

  // useEffect(() => {
  //   if (formData?.brand?.value) {
  //     fetchSubBrands(formData?.brand?.value);
  //   }
  // }, [formData?.brand]);

  const loadSubBrandOptions = async (searchQuery, loadedOptions, { page }) => {
    if (!formData?.brand?.value) {
      return { options: [], hasMore: false }; // If no Level 1 is selected, don't load options
    }
    const subBrandPayload = {
      sourceLocationId: [locId],
      brandId: [formData?.brand?.value], // Ensure we pass the selected brand
      page: page,
      pageSize: 50, // Adjust as necessary
      subBrandName: [searchQuery] || [], // Search query if present
      active: [true],
    };

    try {
      const res = await getAllSubBrands(subBrandPayload);
      if (res?.data?.status === 'ERROR') {
        showSnackbar(res?.data?.message, 'error');
        return {
          options: [],
          hasMore: false,
        };
      } else {
        const data = res?.data?.data?.results || [];
        const options = data?.map((item) => ({
          label: item?.subBrandName,
          value: item?.subBrandId,
        }));
        return {
          options,
          hasMore: data?.length >= 50, // Check if more data is available
          additional: {
            page: page + 1, // Increment page for next load
          },
        };
      }
    } catch (error) {
      showSnackbar('Error while fetching sub-brands', 'error');
      return {
        options: [],
        hasMore: false,
      };
    }
  };

  const loadManufactureOptions = async (searchQuery, loadedOptions, { page }) => {
    const paylaod = {
      sourceId: [orgId],
      sourceLocationId: [locId],
      page: page,
      pageSize: 50,
      manufacturerName: [searchQuery] || [],
      active: [true],
    };

    try {
      const res = await getAllManufacturerV2(paylaod);
      if (res?.data?.status === 'ERROR') {
        showSnackbar(res?.data?.message, 'error');
        return {
          options: [],
          hasMore: false,
        };
      } else {
        const data = res?.data?.data?.results || [];
        const options = data?.map((item) => ({
          label: item?.manufacturerName,
          value: item?.manufacturerId,
        }));
        return {
          options,
          hasMore: data?.length >= 50, // If there are 50 items, assume more data is available
          additional: {
            page: page + 1, // Increment page number
          },
        };
      }
    } catch (error) {
      showSnackbar('Error while fetching data', 'error');
      return {
        options: [],
        hasMore: false,
      };
    }
  };

  useEffect(() => {
    // if (tempTitle?.length > 2) {
    //   const payload = {
    //     page: '1',
    //     pageSize: '10',
    //     names: [tempTitle],
    //     supportedRetails: ['TWINLEAVES', orgId, locId],
    //   };
    //   getItemsInfo(payload).then((response) => {
    //     setOptionsArray(response?.data?.data?.products);
    //   });
    // }
    if (tempTitle?.length > 2) {
      const payload = {
        page: 1,
        pageSize: 10,
        // names: [formData?.productTitle],
        query: tempTitle,
        storeLocations: [locId],
      };
      getGlobalProducts(payload)
        .then((res) => {
          setOptDataArray(res?.data?.data?.data?.data || []);
          const data = res?.data?.data?.data?.data || [];
          setOptArray(data?.map((item) => ({ value: item?.id, label: item?.name })));
        })
        .catch(() => {});
    }
  }, [tempTitle]);

  // useEffect(() => {
  //   let options = [];
  //   optionsArray?.map((ele) => {
  //     options?.push({ label: textFormatter(ele.name), gtin: ele.gtin });
  //   });
  //   setOptArray(options);
  // }, [optionsArray]);

  // useEffect(() => {
  //   let payload = {
  //     page: 1,
  //     pageSize: 50,
  //     type: ['APP'],
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

  const loadMainCategoryOptions = async (searchQuery, loadedOptions, { page }) => {
    const payload = {
      page: page,
      pageSize: 50, // Adjust as necessary
      type: ['APP'],
      sourceId: [orgId],
      sourceLocationId: [locId],
      active: [true],
    };

    try {
      const res = await getAllMainCategory(payload);
      if (res?.data?.status === 'ERROR') {
        showSnackbar(res?.data?.message, 'error');
        return {
          options: [],
          hasMore: false,
        };
      } else {
        const data = res?.data?.data?.results || [];
        const options = data?.map((item) => ({
          label: item?.categoryName,
          value: item?.mainCategoryId,
        }));
        return {
          options,
          hasMore: data?.length >= 50, // Check if more data is available
          additional: {
            page: page + 1, // Increment page for next load
          },
        };
      }
    } catch (error) {
      showSnackbar('Error while fetching main categories', 'error');
      return {
        options: [],
        hasMore: false,
      };
    }
  };

  const handleMainCatChange = (option) => {
    updateFormData('catLevel1', option);
    let payload = {
      page: 1,
      pageSize: 50,
      mainCategoryId: [option?.value],
      type: ['APP'],
      active: [true],
      sourceId: [orgId],
      sourceLocationId: [locId],
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
      pageSize: 50,
      level1Id: [option?.value],
      type: ['APP'],
      active: [true],
      sourceId: [orgId],
      sourceLocationId: [locId],
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
    getTaxDetailsByLevel3Id(option.value)
      .then((res) => {
        const taxDataFromResponse = res?.data?.data || []; // Use data from the response directly
        setTaxData(taxDataFromResponse); // Update state but continue working with the response data

        if (taxDataFromResponse.length === 1) {
          // If only one result, directly set the form data and metadata
          const taxInfo = taxDataFromResponse[0];
          updateFormData('hsn', taxInfo?.taxCode || '');
          updateFormData('metadata', taxInfo?.metadata || {}); // Store metadata
        } else if (taxDataFromResponse.length > 1) {
          // Multiple results: Store options for selection and clear metadata initially
          updateFormData(
            'hsnOptions',
            taxDataFromResponse.map((item) => item.taxCode),
          );
          updateFormData('metadata', {}); // Clear metadata initially for manual entry
        } else {
          // No results: Clear form data
          updateFormData('hsn', '');
          updateFormData('metadata', {});
        }
      })
      .catch((err) => {
        // Handle error if needed
      });

    updateFormData('catLevel3', option);
  };

  const handleSaveSelectedLockup = (id) => {
    setProductOption((prevOptions) => {
      return prevOptions?.map((option) => {
        if (option.id === id) {
          return { ...option, selected: true };
        } else {
          return { ...option, selected: false };
        }
      });
    });
  };

  const handleSaveVariantFromLookUp = () => {
    productOption?.forEach((item) => {
      if (item?.selected) {
        const matchedObject = productOptionData?.find((dataItem) => dataItem?.id === item?.id);
        if (matchedObject) {
          dispatch(setProductDetails(matchedObject || {}));
        }
      }
    });
    handleClose();
  };

  const handleFetchLocalProductId = (id) => {
    const matchedObject = optDataArray?.find((dataItem) => dataItem?.id === id);
    if (matchedObject) {
      dispatch(setProductDetails(matchedObject || {}));
    }
  };

  const [openComingSoon, setOpenComingSoon] = useState(false);

  const handleOpenComingSoon = () => {
    setOpenComingSoon(true);
  };

  const handleCloseComingSoon = () => {
    setOpenComingSoon(false);
  };

  const handleHSNSelectChange = (selectedHSN) => {
    const selectedTaxData = taxData.find((item) => item.taxCode === selectedHSN);
    updateFormData('hsn', selectedHSN);
    updateFormData('metadata', selectedTaxData?.metadata || {}); // Update metadata based on selection
  };

  return (
    <Card sx={{ padding: '15px' }}>
      <Modal
        keepMounted
        open={open}
        onClose={handleClose}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
        sx={{
          '& > .MuiBackdrop-root': {
            backdropFilter: 'blur(5px)',
          },
        }}
      >
        <Box sx={style}>
          <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#344767' }}>Available products</InputLabel>
          {/* <SoftSelect size="small" options={productOption} onChange={(e) => handleSelectProductLookUp(e)}></SoftSelect> */}
          <div style={{ overflow: 'scroll', maxHeight: '90%', padding: '5px' }}>
            {productOption?.map((item) => (
              <Card
                className="addbrand-Box"
                style={{
                  padding: '15px',
                  border: item?.selected ? '1px solid #0562FB' : '',
                  cursor: 'pointer',
                }}
                onClick={() => handleSaveSelectedLockup(item?.id)}
              >
                <SoftTypography fontSize="0.8rem">{item?.label}</SoftTypography>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip
                    label={`${item?.variantCount} Variant` || 'NA'}
                    variant="outlined"
                    style={{ height: 'auto', border: '1px solid rgb(104 159 104)' }}
                  />
                  <Button
                    style={{ marginLeft: 'auto', textTransform: 'none' }}
                    onClick={() => navigate(`/products/product/details/global/${item?.id}`)}
                  >
                    View more
                  </Button>
                </div>
              </Card>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
            <SoftButton size="small" variant="outlined" color="info" onClick={handleClose}>
              cancel
            </SoftButton>
            <SoftButton size="small" color="info" onClick={handleSaveVariantFromLookUp}>
              Save
            </SoftButton>
          </div>
          <br />
        </Box>
      </Modal>
      <SoftBox className="common-display-flex">
        <InputLabel sx={inputLabelStyle} required>
          Product Title
        </InputLabel>
        {errMsg && (
          <div className="common-display-flex">
            <div className="desc-warning-icon">
              <WarningAmberOutlinedIcon />
            </div>
            <div className="duplicate-warning-msg">Duplicate warning: A similar title exists</div>
          </div>
        )}
      </SoftBox>
      <SoftBox className="common-display-flex">
        <Grid container spacing={1} mt={1}>
          <Grid item xs={12} md={10} lg={10}>
            <div style={{ width: '98%' }}>
              <Autocomplete
                size="small"
                value={formData?.productTitle}
                //   disabled={isGen ? true : false}
                onChange={(event, newValue) => {
                  if (typeof newValue === 'string') {
                    updateFormData('productTitle', newValue);
                    // setTempTitle(event.target.value)
                  } else if (newValue && newValue.inputValue) {
                    // Create a new value from the user input
                    updateFormData('productTitle', newValue.inputValue);

                    // setTempTitle(newValue.inputValue)
                  } else {
                    handleFetchLocalProductId(newValue?.value);
                    updateFormData('productTitle', newValue?.label);

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
                className="free-solo-with-text-demo"
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
                    size="small"
                    {...params}
                    onChange={(event) => setTempTitle(event.target.value)}
                    placeholder="Enter product title, e.g. Sugar"
                    style={{ width: '100%' }}
                    fullWidth
                  />
                )}
              />
            </div>
          </Grid>
          <Grid item xs={12} md={2} lg={2} mt={isMobileDevice ? '10px' : '0px'}>
            <div className="common-display-flex">
              <SoftButton
                className="smallBtnStyle"
                size="small"
                variant="outlined"
                color="info"
                style={{ width: '150px' }}
                onClick={handleLookUp}
                isDisabled={true}
              >
                Look up
              </SoftButton>{' '}
              <div className="main-header-icon">
                <Tooltip title="Search for global products">
                  <InfoOutlinedIcon />
                </Tooltip>
              </div>
            </div>
          </Grid>
        </Grid>
      </SoftBox>




      <SoftBox style={{ marginTop: '10px' }}>
        <div className="title-heading-products">
          Category{' '}
          <span className="main-header-icon">
            <Tooltip title=" Select the appropriate product category">
              <InfoOutlinedIcon />
            </Tooltip>
          </span>
        </div>
        <Grid container mt={1} direction="row" justifyContent="space-between" alignItems="baseline">
          <Grid item xs={12} md={4} lg={4}>
            <SoftBox style={{ width: '95%' }}>
              <InputLabel sx={inputLabelStyle} required>
                Level 1
              </InputLabel>
              {/* <SoftSelect
                size="small"
                className="select-box-category"
                value={formData?.catLevel1}
                options={mainCatArr}
                onChange={(option) => handleMainCatChange(option)}
                menuPortalTarget={document.body}
              /> */}
              <SoftAsyncPaginate
                size="small"
                className="select-box-category"
                placeholder="Select category..."
                value={formData?.catLevel1}
                loadOptions={loadMainCategoryOptions} // Using the new async category fetcher
                additional={{
                  page: 1,
                }}
                isClearable
                onChange={(option) => handleMainCatChange(option)} // Update form data when category changes
                menuPortalTarget={document.body}
              />
            </SoftBox>
            <div className="duplicate-category-msg">{formData?.givenCatName}</div>
          </Grid>
          <Grid item xs={12} md={4} lg={4}>
            <SoftBox style={{ width: '95%' }}>
              <InputLabel sx={inputLabelStyle} required>
                Level 2
              </InputLabel>
              <SoftSelect
                size="small"
                className="select-box-category"
                value={formData?.catLevel2}
                options={formData?.catLeve2Arr}
                onChange={(option) => handleLevel2CatChange(option)}
                menuPortalTarget={document.body}
              />
            </SoftBox>
            <div className="duplicate-category-msg">{formData?.givenSubCatName}</div>
          </Grid>
          <Grid item xs={12} md={4} lg={4}>
            <SoftBox style={{ width: '95%' }}>
              <InputLabel sx={inputLabelStyle} required>
                Level 3
              </InputLabel>
              <SoftSelect
                size="small"
                className="select-box-category"
                value={formData?.catLevel3}
                options={formData?.catLeve3Arr}
                onChange={(option) => handleLevel3CatChange(option)}
                menuPortalTarget={document.body}
              />
            </SoftBox>
            <div className="duplicate-category-msg">{formData?.givenSubCat2Name}</div>
          </Grid>
        </Grid>


        <Grid container mt={1} direction="row" justifyContent="space-between" alignItems="center">
          <Grid item xs={12} md={4} lg={4}>
            <SoftBox style={{ width: '95%' }}>
              <InputLabel sx={inputLabelStyle} required>
                Manufacturer
              </InputLabel>
              {/* <SoftSelect
                size="small"
                value={formData?.manufacturer}
                className="select-box-category"
                options={manufacturerOptions}
                onChange={(e) => {
                  updateFormData('manufacturer', e);
                }}
                menuPortalTarget={document.body}
              /> */}
              <SoftAsyncPaginate
                className="select-box-category"
                placeholder="Select manufacture..."
                value={formData?.manufacturer}
                loadOptions={loadManufactureOptions}
                additional={{
                  page: 1,
                }}
                isClearable
                size="small"
                onChange={(e) => {
                  updateFormData('manufacturer', e);
                }}
                menuPortalTarget={document.body}
              />
            </SoftBox>
          </Grid>
          <Grid item xs={12} md={4} lg={4}>
            <SoftBox style={{ width: '95%' }}>
              <InputLabel sx={inputLabelStyle} required>
                Brand
              </InputLabel>
              {/* <SoftSelect
                size="small"
                className="select-box-category"
                value={formData?.brand}
                options={brandList}
                onChange={(e) => {
                  updateFormData('brand', e);
                }}
                menuPortalTarget={document.body}
              /> */}
              <SoftAsyncPaginate
                className="select-box-category"
                placeholder="Select brand..."
                value={formData?.brand}
                loadOptions={loadBrandOptions} // Using the new async brand fetcher
                additional={{
                  page: 1,
                }}
                isClearable
                size="small"
                onChange={(e) => {
                  updateFormData('brand', e);
                }}
                menuPortalTarget={document.body}
              />
            </SoftBox>
          </Grid>
          <Grid item xs={12} md={4} lg={4}>
            <SoftBox style={{ width: '95%' }}>
              <InputLabel sx={inputLabelStyle}>Sub Brand</InputLabel>
              {/* <SoftSelect
                size="small"
                className="select-box-category"
                value={formData?.subBrand}
                options={subBrandList}
                onChange={(e) => {
                  updateFormData('subBrand', e);
                }}
                menuPortalTarget={document.body}
              /> */}
              <SoftAsyncPaginate
                size="small"
                className="select-box-category"
                placeholder="Select sub-brand..."
                value={formData?.subBrand}
                loadOptions={loadSubBrandOptions} // Using the new async sub-brand fetcher
                additional={{
                  page: 1,
                }}
                key={formData?.brand?.value}
                isClearable
                onChange={(e) => {
                  updateFormData('subBrand', e);
                }}
                menuPortalTarget={document.body}
              />
            </SoftBox>
          </Grid>
        </Grid>
      </SoftBox>






      <SoftBox style={{ marginTop: '10px' }}>
        <div className="title-heading-products">
          Tax details{' '}
          <span className="main-header-icon">
            <Tooltip title="Enter the correct tax information">
              <InfoOutlinedIcon />
            </Tooltip>
          </span>
        </div>
        <Grid container mt={1} direction="row" justifyContent="flex-start" alignItems="center" gap="10px">
          <Grid item xs={12} sm={2.5} md={2.5} lg={3}>
            <SoftBox className="common-display-flex">
              <div className="duplicate-warning-msg">HSN</div>
              {formData?.hsnOptions && formData?.hsnOptions.length > 1 ? (
                // If there are multiple options, render a select box
                <Autocomplete
                  freeSolo // Enables manual input
                  options={formData.hsnOptions || []} // The array of HSN options
                  getOptionLabel={(option) => option} // Display the option as a string
                  value={formData.hsn || ''} // Set the selected value
                  onChange={(e, newValue) => {
                    updateFormData('hsn', newValue || ''); // Update form data when an option is selected
                    handleHSNSelectChange(newValue); // Optionally handle any changes related to HSN selection
                  }}
                  onInputChange={(e, newInputValue) => {
                    updateFormData('hsn', newInputValue); // Update form data for manual input
                  }}
                  renderInput={(params) => <TextField {...params} variant="outlined" size="small" />}
                  clearOnEscape
                />
              ) : (
                // If single or no options, show input box
                <SoftInput
                  size="small"
                  className="select-box-category"
                  value={formData?.hsn}
                  onChange={(e) => updateFormData('hsn', e?.target?.value)}
                />
              )}
            </SoftBox>
          </Grid>
          {/* Check if metadata is empty */}
          {Object.keys(formData?.metadata || {}).length === 0 ? (
            <>
              {/* Show GST and CESS Select inputs if metadata is empty */}
              <Grid item xs={12} sm={2.5} md={2.5} lg={2}>
                <SoftBox className="common-display-flex">
                  <div className="duplicate-warning-msg"> GST</div>
                  <SoftSelect
                    size="small"
                    className="select-box-category"
                    placeholder="Select GST"
                    options={[
                      { value: 0, label: '0  %' },
                      { value: 3, label: '3  %' },
                      { value: 5, label: '5  %' },
                      { value: 12, label: '12 %' },
                      { value: 18, label: '18 %' },
                      { value: 28, label: '28 %' },
                    ]}
                    value={{ value: formData?.igst, label: formData?.igst }}
                    onChange={(e) => {
                      updateFormData('igst', e?.value);
                      updateFormData('cgst', e?.value / 2); // Update CGST dynamically
                      updateFormData('sgst', e?.value / 2); // Update SGST dynamically
                    }}
                    menuPortalTarget={document.body}
                  />
                </SoftBox>
              </Grid>

              <Grid item xs={12} sm={2.5} md={2.5} lg={2}>
                <SoftBox className="common-display-flex">
                  <div className="duplicate-warning-msg">CESS</div>
                  <SoftSelect
                    value={{ value: formData?.cess, label: formData?.cess }}
                    size="small"
                    className="select-box-category"
                    placeholder="Select Cess"
                    options={cessArray}
                    onChange={(e) => {
                      updateFormData('cess', e?.value);
                    }}
                    menuPortalTarget={document.body}
                  />
                </SoftBox>
              </Grid>
            </>
          ) : (
            // Dynamically render metadata fields if metadata is not empty
            Object.keys(formData?.metadata || {}).map((key) => (
              <Grid item xs={12} sm={2.5} md={2.5} lg={2} key={key}>
                <SoftBox className="common-display-flex">
                  <div className="duplicate-warning-msg">{key}</div> {/* Display metadata field name */}
                  <SoftInput
                    size="small"
                    className="select-box-category"
                    value={formData?.metadata[key] || ''}
                    onChange={(e) =>
                      updateFormData('metadata', {
                        ...formData.metadata,
                        [key]: e?.target?.value, // Dynamically update metadata value
                      })
                    }
                  />
                </SoftBox>
              </Grid>
            ))
          )}

          <Grid item xs={12} md={1.5} lg={1.5} ml={isMobileDevice ? '0px' : '20px'}>
            <label className="common-display-flex-1" style={{ gap: '5px' }}>
              {/* <input
                type="checkbox"
                // name="row-radio-buttons-group"
                // value="Yes"
                // onChange={handleChange}
                className="checkbox-products"
                // checked={selectedOption === 'Yes'}
              /> */}
              <Checkbox
                checked={formData?.exempeted}
                onChange={(e) => updateFormData('exempeted', e?.target?.checked)}
              />
              <div className="duplicate-warning-msg">Exempted</div>
            </label>
          </Grid>
          <Grid item xs={12} md={1.5} lg={1.5}>
            <label className="common-display-flex-1">
              <Checkbox
                checked={formData?.mrpRestrictions}
                onChange={(e) => updateFormData('mrpRestrictions', e?.target?.checked)}
              />
              <div className="duplicate-warning-msg" style={{ whiteSpace: 'nowrap', display: 'inline-block' }}>
                MRP Restrictions
              </div>{' '}
            </label>
          </Grid>
        </Grid>
      </SoftBox>
      <SoftBox style={{ marginTop: '10px' }}>
        <div className="common-display-flex">
          <div className="title-heading-products">Description </div>
          <div className="common-display-flex">
            <SoftButton
              className="smallBtnStyle"
              size="small"
              variant="outlined"
              color="info"
              style={{ width: '150px' }}
              onClick={handleOpenComingSoon}
            >
              Try Pallet IQ
            </SoftButton>{' '}
            <ComingSoonAlert open={openComingSoon} handleClose={handleCloseComingSoon} />
            <span className="main-header-icon">
              <Tooltip title="Generate product descriptions using AI" placement="right">
                <InfoOutlinedIcon />
              </Tooltip>
            </span>
          </div>
        </div>
        <div style={{ marginTop: '10px' }}>
          <SoftInput
            value={formData?.description}
            placeholder="Enter description for the product"
            onChange={(e) => updateFormData('description', e.target.value)}
            // readOnly={isGen ? true : false}
            multiline
            rows={5}
          />
        </div>
      </SoftBox>
      <SoftBox style={{ marginTop: '10px' }}>
        <div className="title-heading-products">
          Product Type{' '}
          <span className="main-header-icon">
            <Tooltip title="Select Product type" placement="right">
              <InfoOutlinedIcon />
            </Tooltip>
          </span>
        </div>
        <Grid container mt={1} justifyContent="flex-start" alignItems="baseline" gap={isMobileDevice ? '10px' : '50px'}>
          {/* <Grid item xs={12} md={6} lg={6}>
            <Grid container mt={1} justifyContent="space-between" alignItems="center">
              <Grid item xs={12} md={6} lg={6} display="flex">
                <Checkbox
                  checked={formData?.weighingScaleIntegration}
                  onChange={(e) => {
                    updateFormData('weighingScaleIntegration', e.target.checked);
                    // if (e.target.checked) {
                    //   setMarginBased({ value: 'pp', label: 'Purchase Price' });
                    // } else {
                    //   setMarginBased({ value: 'mrp', label: 'MRP' });
                    // }
                    // setManBarcode('');
                    // setBarcode('');
                    // setBarImage('');
                    // setIsBar(false);
                  }}
                />
                <SoftTypography fontSize="0.8rem">Needs weighing scale integration</SoftTypography>
              </Grid>
              {formData?.weighingScaleIntegration ? (
                <Grid item xs={12} md={6} lg={6}>
                  <SoftBox className="common-display-flex">
                    <div className="duplicate-warning-msg" style={{ width: '50%' }}>
                      {' '}
                      Selling UOM
                    </div>
                    <SoftSelect
                      size="small"
                      className="boom-soft-select"
                      // isDisabled={isGen ? true : false}
                      menuPortalTarget={document.body}
                      value={formData?.weighingScaleUnit}
                      onChange={(option) => updateFormData('weighingScaleUnit', option)}
                      options={[
                        { value: 'each', label: 'each' },
                        { value: 'Grams', label: 'gm' },
                        { value: 'Kilograms', label: 'kg' },
                        { value: 'Millilitres', label: 'ml' },
                        { value: 'Litres', label: 'ltr' },
                      ]}
                    />
                    <span className="main-header-icon">
                      <InfoOutlinedIcon />
                    </span>
                  </SoftBox>
                </Grid>
              ) : null}
            </Grid>
          </Grid> */}

          <Grid item xs={12} md={3} lg={2} ml={!isMobileDevice ? '15px' : '0px'}>
            <label className="common-display-flex-1" style={{ gap: '5px' }}>
              <Checkbox
                checked={formData?.isRawMaterial}
                onChange={(e) => updateFormData('isRawMaterial', e?.target?.checked)}
              />

              <div className="duplicate-warning-msg">Raw material</div>
            </label>
          </Grid>
          <Grid item xs={12} md={3} lg={2} ml={!isMobileDevice ? '15px' : '0px'}>
            <label className="common-display-flex-1" style={{ gap: '5px' }}>
              <Checkbox
                checked={formData?.exportEligible}
                onChange={(e) => updateFormData('exportEligible', e?.target?.checked)}
              />

              <div className="duplicate-warning-msg">Eligible for export </div>
            </label>
          </Grid>
        </Grid>
      </SoftBox>
    </Card>
  );
};

export default AddProductDescription;
