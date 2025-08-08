import React, { useEffect, useRef, useState } from 'react';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import SoftTypography from '../../../../components/SoftTypography';
import SoftButton from '../../../../components/SoftButton';
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  InputLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import SoftInput from '../../../../components/SoftInput';
import SoftSelect from '../../../../components/SoftSelect';
import CloseIcon from '@mui/icons-material/Close';

import { country } from '../../../ecommerce/softselect-Data/country';
import { state as states } from '../../../ecommerce/softselect-Data/state';
import { city as citys } from '../../../ecommerce/softselect-Data/city';
import SoftBox from '../../../../components/SoftBox';
import { useLocation, useNavigate } from 'react-router-dom';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  createDetailedBrand,
  createImageUrl,
  createManufactureNew,
  createManufacturer,
  editBrand,
  editManufacture,
  fetchOrganisations,
  filterDepartments,
  filterLineOfBusiness,
  getAllBrands,
  getAllLevel1Category,
  getAllLevel2Category,
  getAllMainCategory,
  getAllManufacturers,
  getAllManufacturerV2,
  getAllVendors,
  getHOSubDepartment,
  getVendorDetails,
  masterBrandCreation,
  singleBrandCreation,
} from '../../../../config/Services';
import { useSnackbar } from '../../../../hooks/SnackbarProvider';
import { RequiredAsterisk, textFormatter } from '../../Common/CommonFunction';
import ComingSoonAlert from '../ComingSoonAlert';
import { useDebounce } from 'usehooks-ts';
import ManufactureCreate from './ManufactureCreate';
import './brandCreation.css';
import SubBrandCreate from './subBrandCreate';
import SoftAsyncPaginate from '../../../../components/SoftSelect/SoftAsyncPaginate';

const BrandCreation = () => {
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();
  const userDetails = localStorage.getItem('user_details');
  const userInfo = userDetails ? JSON.parse(userDetails) : {};
  const userName = localStorage.getItem('user_name');
  const [allBrandData, setAllBrandData] = useState({
    manufacturerName: '',
    manufactureId: '',
    manufacturerDesc: '',
    fssai: '',
    gst: '',
    cin: '',
    email: '',
    website: '',
    phoneNumber: '',
    logo: '',
  });

  const [manufactureNameOptions, setManufactureNameOptions] = useState([]);
  const [addressDetailsData, setAddressDetailsData] = useState({
    businessLocation: '',
    country: '',
    state: '',
    city: '',
    addressLine1: '',
    addressLine2: '',
    pinCode: '',
  });
  const [citiesOption, setCitiesOption] = useState([]);
  const [manufactureEditing, setManufactureEditing] = useState(false);
  const [selectedValue, setSelectedValue] = useState('brand');

  const handleTypeChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const [brandNameOptions, setBrandNameOptions] = useState([{}]);
  const [brandNameIndex, setBrandNameIndex] = useState(1);
  const [brandDetails, setBrandDetails] = useState([
    {
      id: 1,
      brandName: '',
      brandCode: '',
      subBrandName: '',
      lineOfBusiness: '',
      category: '',
      className: '',
      subClassName: '',
      departmentName: '',
      subDepartmentName: '',
    },
  ]);
  const [brandMarketingData, setBrandMarketingDetails] = useState([
    {
      id: 1,
      vendorName: '',
      businessLocation: '',
      serviceableAreas: [],
      serviceableAreasOptions: [],
    },
  ]);
  const [lineOfBusinessOptions, setLineOfBusinessOptions] = useState([]);
  const [mainCategoryOptions, setMainCategoryOptions] = useState([]);
  const [level1CategoryOptions, setLevel1CategoryOptions] = useState([]);
  const [level2CategoryOptions, setLevel2CategoryOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [subDepartmentOptions, setSubDepartmentOptions] = useState([]);
  const [displayStoreOptions, setDisplayStoreOptions] = useState([]);

  const [manufactureImage, setManufactureImage] = useState(null);
  const [brandImage, setBrandImage] = useState(null);

  const [vendorNameOptions, setVendorNameOptions] = useState([]);
  const fileInputRefManufacture = useRef();
  const fileInputRefBrand = useRef();
  //loaders =========
  const [allBrandLoader, setAllBrandLoader] = useState(false);
  const [brandNameLoader, setBrandNameLoader] = useState(false);

  const [mainCategory, setMainCategory] = useState('');
  const [level1Category, setLevel1Category] = useState('');
  const [departmentSelect, setDepartmentSelect] = useState('');

  const [inputValue, setInputValue] = useState('');
  const [manufacturerOptions, setManufactureOptions] = useState([]);
  const [selectedManufacturerId, setSelectedManufacturerId] = useState(null);
  const location1 = useLocation();

  const debouncedManufacturer = useDebounce(allBrandData?.manufacturerName, 500);
  const debouncedBrandName = useDebounce(brandDetails[brandNameIndex - 1], 500);
  const [vendorOptArray, setVendorOptArray] = useState([]);

  useEffect(() => {
    if (addressDetailsData.state) {
      const initialCities = citys?.filter((cit) => cit.value === addressDetailsData.state) || [];
      setCitiesOption(initialCities);
    }
  }, [addressDetailsData.state]);

  const getQueryParams = () => {
    const params = new URLSearchParams(location1.search);
    const brandId = params.get('brandId');
    const manufactureId = params.get('manufactureId'); // Fetch manufactureId if present
    return { brandId, manufactureId };
  };

  const { brandId, manufactureId } = getQueryParams();

  const fetchOptions = async (value) => {
    if (value !== '') {
      setBrandNameLoader(true);
      const brandPayload = {
        page: 1,
        pageSize: 50,
        brandName: [value],
      };

      try {
        const res = await getAllBrands(brandPayload);
        const response = res?.data?.data;

        let brandNameOptions =
          response?.results?.map((item) => ({
            value: item?.brandId,
            label: item?.brandName,
          })) || [];

        brandNameOptions.unshift({
          value: '',
          label: `ADD "${value}"`,
        });

        setBrandNameOptions(brandNameOptions);
      } catch (error) {
      } finally {
        setBrandNameLoader(false);
      }
    }
  };

  const handleBrandInputChange = (value, actionMeta) => {
    setInputValue(value);
    fetchOptions(value);
  };

  const handleChange = (selectedOption, index) => {
    const label = selectedOption ? selectedOption.label.replace(/^ADD\s+"|"\s*$/g, '') : '';
    setBrandDetails(
      brandDetails.map((detail, i) =>
        i === index ? { ...detail, brandName: { value: selectedOption?.value, label: label } } : detail,
      ),
    );
  };

  const addMoreBrandDetails = () => {
    setBrandDetails([
      ...brandDetails,
      {
        id: brandDetails.length + 1,
        brandName: '',
        subBrandName: '',
        lineOfBusiness: '',
        category: '',
        className: '',
        subClassName: '',
        departmentName: '',
        subDepartmentName: '',
      },
    ]);
  };

  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const AppAccountId = localStorage.getItem('AppAccountId');

  const removeBrand = (id) => {
    setBrandDetails(brandDetails.filter((form) => form.id !== id));
  };

  const handleBrandChange = (id, name, value, actionMeta) => {
    if (actionMeta && actionMeta.action === 'input-change') {
      setBrandNameIndex(id);
    }
    setBrandDetails(brandDetails.map((form) => (form.id === id ? { ...form, [name]: value } : form)));
  };

  const addMoreBrandMarketing = () => {
    setBrandMarketingDetails([
      ...brandMarketingData,
      {
        id: brandMarketingData.length + 1,
        vendorName: '',
        businessLocation: '',
        serviceableAreas: [],
      },
    ]);
  };

  const removeBrandMarketing = (id) => {
    setBrandMarketingDetails(brandMarketingData.filter((form) => form.id !== id));
  };

  const handleBrandMarketingChange = (id, name, value) => {
    if (name === 'vendorName') {
      getVendorDetails(orgId, value)
        .then((res) => {
          const data = res?.data?.data;
          let stores = data?.vendorDelivery?.deliveryOptions?.map((item) => item?.deliveryStores);
          setBrandMarketingDetails(
            brandMarketingData.map((form) =>
              form.id === id ? { ...form, [name]: value, serviceableAreasOptions: stores || [] } : form,
            ),
          );
        })
        .catch(() => {
          setBrandMarketingDetails(
            brandMarketingData.map((form) => (form.id === id ? { ...form, [name]: value } : form)),
          );
        });
    } else {
      setBrandMarketingDetails(brandMarketingData.map((form) => (form.id === id ? { ...form, [name]: value } : form)));
    }
  };

  useEffect(() => {
    getAllLineOfBusiness();
    getAllDepartments();
    getAllMainCategories();
    fetchSubDepartment(departmentSelect);
    fetchLevel1Category(mainCategory);
    fetchLevel2Category(level1Category);
  }, []);

  const [lineOfBusinessLoader, setLineOfBusinessLoader] = useState(false);
  const getAllLineOfBusiness = () => {
    setLineOfBusinessLoader(true);
    const payload = {
      page: 1,
      pageSize: 50,
      sortByCreatedDate: 'ASCENDING',
      sortByUpdatedDate: 'ASCENDING',
      sourceId: [orgId],
      sourceLocationId: [locId],
      active: [true],
    };

    filterLineOfBusiness(payload)
      .then((res) => {
        const results = res?.data?.data?.results;
        const data = results?.map((item) => ({
          image: item?.lobImage,
          value: item?.lineOfBusinessId,
          label: item?.lobName || 'NA',
        }));
        setLineOfBusinessOptions(data);
        setLineOfBusinessLoader(false);
      })
      .catch((err) => {
        showSnackbar(err?.response?.message || 'Something went wrong while fetching line of business', 'error');
        setLineOfBusinessLoader(false);
      });
  };

  const [allDepartmentsLoader, setAllDepartmentsLoader] = useState(false);
  const getAllDepartments = () => {
    setAllDepartmentsLoader(true);
    const payload = {
      page: 1,
      pageSize: 50,
      sourceId: [orgId],
      sourceLocationId: [locId],
      sortByUpdatedDate: 'ASCENDING',
      active: [true],
    };

    filterDepartments(payload)
      .then((res) => {
        const results = res?.data?.data?.results;
        const data = results?.map((item) => ({
          image: item?.departmentImage,
          value: item?.departmentId,
          label: item?.departmentName || 'NA',
        }));
        setDepartmentOptions(data);
        setAllDepartmentsLoader(false);
      })
      .catch((err) => {
        showSnackbar(err?.response?.message || 'Something went wrong while fetching All Departments', 'error');
        setAllDepartmentsLoader(false);
      });
  };

  //getting all main categories
  const [brandDetailsIndex, setBrandDetailsIndex] = useState(0);
  const [allMainCategoriesLoader, setAllMainCategoriesLoader] = useState(false);
  const getAllMainCategories = () => {
    setAllMainCategoriesLoader(true);
    const payload = {
      page: 1,
      pageSize: 50,
      sourceId: [orgId],
      sourceLocationId: [locId],
      type: ['APP'],
      sortByUpdatedDate: 'DESCENDING',
      type: ['POS'],
      active: [true],
    };
    getAllMainCategory(payload)
      .then((res) => {
        const results = res?.data?.data?.results;
        const data = results?.map((item) => ({
          image: item?.categoryImage,
          value: item?.mainCategoryId,
          label: item?.categoryName || 'NA',
        }));
        setMainCategoryOptions(data);
        setAllMainCategoriesLoader(false);
      })
      .catch((err) => {
        showSnackbar(err?.response?.message || 'Something went wrong while fetching All Main Categories', 'error');
        setAllMainCategoriesLoader(false);
      });
  };

  useEffect(() => {
    fetchOrganisations()
      .then((res) => {
        const retailData = res?.data?.data?.retails;
        const matchedRetail = retailData?.find((retail) => retail?.retailId === orgId);
        const branches = matchedRetail?.branches?.map((item) => ({ value: item?.branchId, label: item?.displayName }));
        setDisplayStoreOptions(branches || []);
      })
      .catch(() => {});
  }, []);

  //fetching all vendors
  const [vendorNamesLoader, setVendorNamesLoader] = useState(false);
  // const getAllVendorNames = () => {
  //   const filterObject = {
  //     page: 0,
  //     pageSize: 10,
  //     filterVendor: {},
  //   };
  //   setVendorNamesLoader(true);
  //   getAllVendors(filterObject, orgId)
  //     .then((res) => {
  //       const data = res?.data?.data?.vendors;
  //       let vendorsArr = [];
  //       data?.map((e) => {
  //         vendorsArr.push({
  //           value: e?.vendorId,
  //           label: textFormatter(e?.vendorName),
  //           location: e?.location,
  //         });
  //       });
  //       setVendorNameOptions(vendorsArr || []);
  //       setVendorNamesLoader(false);
  //     })
  //     .catch((err) => {
  //       showSnackbar(err?.response?.message || 'Some error occurred', 'error');
  //       setVendorNamesLoader(false);
  //     });
  // };

  const loadVendorOptions = async (searchQuery, loadedOptions, { page }) => {
    const filterObject = {
      page: page,
      pageSize: 50,
      filterVendor: {},
    };

    try {
      const res = await getAllVendors(filterObject, orgId);
      const data = res?.data?.data?.vendors || [];
      const options = data?.map((item) => ({
        label: textFormatter(item?.vendorName),
        value: item?.vendorId,
        location: item?.location,
      }));
      setVendorNameOptions(options || []);

      return {
        options,
        hasMore: data?.length >= 50,
        additional: { page: page + 1 },
      };
    } catch (error) {
      showSnackbar('Error fetching Vendors', 'error');
      return {
        options: [],
        hasMore: false,
      };
    }
  };

  //fetching category level  1

  const [level1CatLoader, setLevel1CatLoader] = useState(false);
  const fetchLevel1Category = (mainCategoryId) => {
    const payload = {
      page: 1,
      pageSize: 50,
      mainCategoryId: [mainCategoryId],
      sourceId: [orgId],
      sourceLocationId: [locId],
      type: ['POS'],
      active: [true],
    };
    setLevel1CatLoader(true);
    getAllLevel1Category(payload)
      .then((res) => {
        const results = res?.data?.data?.results;
        const data = results?.map((item) => ({
          value: item?.level1Id,
          label: item?.categoryName,
          mainCategoryId: item?.mainCategoryId,
        }));
        setLevel1CategoryOptions(data);
        setLevel1CatLoader(false);
      })
      .catch((err) => {
        showSnackbar(err?.response?.message || 'Something went wrong while fetching Level 1 Categories', 'error');
        setLevel1CatLoader(false);
      });
  };

  //fetching category level 2
  const [level2CatLoader, setLevel2CatLoader] = useState(false);
  const fetchLevel2Category = (level1Category) => {
    const payload = {
      page: 1,
      pageSize: 50,
      level1Id: [level1Category],
      sourceId: [orgId],
      sourceLocationId: [locId],
      type: ['POS'],
      active: [true],
    };
    setLevel2CatLoader(true);
    getAllLevel2Category(payload)
      .then((res) => {
        const response = res?.data?.data?.results;
        if (response.length > 0) {
          let arr = [];
          arr.push(
            response.map((e) => ({
              value: e?.level2Id,
              label: e?.categoryName,
            })),
          );
          setLevel2CategoryOptions(arr[0]);
        }
        setLevel2CatLoader(false);
      })
      .catch((err) => {
        showSnackbar(err?.response?.data?.message || 'Some error occurred', 'error');
        setLevel2CatLoader(false);
      });
  };

  //fetching sub department
  const [departmentSelectLoader, setDepartmentSelectLoader] = useState(false);
  const fetchSubDepartment = (departmentSelect) => {
    let payload = {
      page: 1,
      pageSize: 50,
      sourceId: [orgId],
      sourceLocationId: [locId],
      departmentId: [departmentSelect],
      sortByUpdatedDate: 'ASCENDING',
      active: [true],
    };
    setDepartmentSelectLoader(true);
    getHOSubDepartment(payload)
      .then((res) => {
        const response = res?.data?.data?.results;
        if (response?.length > 0) {
          let arr = [];
          arr.push(
            response?.map((e) => ({
              value: e?.subDepartmentId,
              label: e?.subDepartmentName,
            })),
          );
          setSubDepartmentOptions(arr[0]);
        }
        setDepartmentSelectLoader(false);
      })
      .catch((err) => {
        showSnackbar(err?.response?.data?.message || 'Some error occurred', 'error');
        setDepartmentSelectLoader(false);
      });
  };

  useEffect(() => {
    const filterObject = {
      page: 0,
      pageSize: 20,
      filterVendor: {
        // searchText: vendorTitle,
      },
    };

    getAllVendors(filterObject, orgId).then((response) => {
      const vendors = response?.data?.data?.vendors;

      const vendorOptions = vendors?.map((ele) => ({
        label: ele?.vendorName,
        value: ele?.vendorId,
      }));
      setVendorOptArray(vendorOptions);
    });
  }, [manufactureId]);

  // fetch brandData with id
  useEffect(() => {
    const fetchBrandAndManufacturer = async () => {
      const payload = {
        brandId: [brandId],
      };

      try {
        const res = await getAllBrands(payload);
        const response = res?.data?.data?.results?.[0] || {};

        // Fetch manufacturer details based on manufacturerId
        const manufacturerOptions = await handleAllManufactures(response?.manufacturerId);

        // Find the specific manufacturer name and ID
        const selectedManufacturer = manufacturerOptions?.find((option) => option?.value === response?.manufacturerId);

        // Set the selected manufacturer details
        setSelectedManufacturerId(selectedManufacturer);

        // Set brand details
        const brandData = {
          id: response.id || 1,
          brandName: { label: response?.brandName || '', value: response?.brandId || '' },
          subBrandName: response?.subBrands?.[0]?.subBrandName || '',
          lineOfBusiness: response?.lineOfBusinessId || '',
          category: response?.categoryId || '',
          className: response?.classId || '',
          subClassName: response?.subClassId || '',
          departmentName: response?.departmentId || '',
          subDepartmentName: response?.subDepartmentId || '',
          subBrandId: response?.subBrands?.[0]?.subBrandId || '',
        };

        setBrandImage(response?.logo);
        setBrandDetails([brandData]);
      } catch (error) {}
    };

    fetchBrandAndManufacturer();
  }, [brandId]);

  const handleAllManufactures = async (id) => {
    const payload = {
      manufacturerId: [id],
      active: [true],
    };

    try {
      const res = await getAllManufacturerV2(payload);

      // Accessing the results array from the API response
      const response = res?.data?.data?.results;

      if (response?.length > 0) {
        // Mapping the response to an array of {label, value}
        const arr = response.map((e) => ({
          value: e.manufacturerId || '',
          label: e.manufacturerName || 'Unknown Manufacturer', // Fallback for missing name
        }));

        return arr; // Returning the manufacturer options
      } else {
        return []; // Return an empty array if no results
      }
    } catch (error) {
      return []; // Return an empty array in case of an error
    }
  };

  const loadManufactureOptions = async (searchQuery, loadedOptions, { page }) => {
    const payload = {
      page: page.toString(),
      pageSize: '50',
      sourceId: [orgId],
      sourceLocationId: [locId],
      sortByCreatedDate: 'DESCENDING',
      manufacturerName: [searchQuery] || [],
    };
    if (manufactureId) {
      payload.manufacturerId = [manufactureId];
    }

    try {
      const res = await getAllManufacturerV2(payload); // Call your API to get manufacturer data
      const response = res?.data?.data?.results || [];

      // Map the results to options
      const options = response?.map((item) => ({
        label: item?.manufacturerName || '',
        value: item?.manufacturerId || '',
      }));

      // Return options along with pagination info
      return {
        options,
        hasMore: response?.length >= 50, // If response has 50 or more items, assume there are more
        additional: {
          page: page + 1, // Increment page for the next request
        },
      };
    } catch (error) {
      return {
        options: [],
        hasMore: false,
      };
    }
  };

  const removeDataURLPrefix = (encoded) => {
    if (encoded.startsWith('data:image/png;base64,')) {
      return encoded.replace('data:image/png;base64,', '');
    } else if (encoded.startsWith('data:image/jpeg;base64,')) {
      return encoded.replace('data:image/jpeg;base64,', '');
    } else if (encoded.startsWith('https://storage.googleapis.com')) {
      return null;
    } else {
      return encoded;
    }
  };

  const createBrand = () => {
    // Function to prepare the payload for brand creation
    const prepareBrandPayload = (logoUrl = '') => {
      const brandModelData = brandDetails?.map((detail) => ({
        manufacturerId: selectedManufacturerId?.value,
        brandCode: detail.brandCode || '',
        brandName: typeof detail.brandName === 'object' ? detail.brandName.label : detail.brandName || '',
        logo: logoUrl, // Set logo URL if available
        accountId: AppAccountId,
        sourceId: orgId,
        sourceLocationId: locId,
        sourceType: 'RETAIL',
        lineOfBusinessId: detail.lineOfBusiness || '',
        categoryId: detail.category || '',
        classId: detail.className || '',
        subClassId: detail.subClassName || '',
        departmentId: detail.departmentName || '',
        subDepartmentId: detail.subDepartmentName || '',
        createdBy: userInfo?.uidx || '',
        createdByName: userName || '',
        subBrand: null,
      }));

      const marketingData = brandMarketingData?.map((item) => ({
        manufacturerId: selectedManufacturerId?.value,
        vendorName: item?.vendorName,
        businessLocation: item?.businessLocation,
        serviceableAreas: item?.serviceableAreas?.map((item) => item?.value),
        createdBy: userInfo?.uidx,
        createdByName: userName,
      }));
      return {
        createBrandModel: brandModelData,
        brandMarketingCompanies: marketingData,
      };
    };
    if (!selectedManufacturerId || !brandDetails?.some((detail) => detail.brandName)) {
      showSnackbar('Please fill all required details', 'error');
      return;
    }

    const uniqueImageName = `image_${Date.now()}`;

    // Assuming manufactureImage holds the image data; adjust as necessary
    if (brandImage) {
      const imagePayload = {
        uploadType: 'Brand',
        images: {
          [uniqueImageName]: removeDataURLPrefix(brandImage),
        },
      };

      createImageUrl(imagePayload)
        .then((res) => {
          const imageObject = res?.data?.data?.data || {};
          const imageUrl = Object.values(imageObject)[0] || ''; // Extract the URL

          const payload = prepareBrandPayload(imageUrl);
          masterBrandCreation(payload)
            .then((res) => {
              if (res?.data?.data?.es === 0) {
                showSnackbar('Brand created successfully', 'success');
                navigate(-1);
              } else if (res?.data?.data?.es === 1) {
                showSnackbar(res?.data?.data?.message || 'Error while creating brand', 'error');
              }
            })
            .catch((err) => {
              showSnackbar('Error while creating brand', 'error');
            });
        })
        .catch((error) => {
          showSnackbar('Error while uploading image', 'error');
        });
    } else {
      // Directly call masterBrandCreation if no image is present
      const payload = prepareBrandPayload();
      masterBrandCreation(payload)
        .then((res) => {
          if (res?.data?.data?.es === 0) {
            navigate(-1);
            showSnackbar('Brand created successfully', 'success');
          } else if (res?.data?.data?.es === 1) {
            showSnackbar(res?.data?.data?.message || 'Error while creating brand', 'error');
          }
        })
        .catch((err) => {
          showSnackbar('Error while creating brand', 'error');
        });
    }
  };

  const handleEditBrand = () => {
    // Function to prepare the payload for brand creation
    const prepareBrandPayload = (logoUrl = '') => {
      return brandDetails?.map((detail) => ({
        manufacturerId: selectedManufacturerId?.value,
        brandCode: detail.brandCode || '',
        brandName: typeof detail.brandName === 'object' ? detail.brandName.label : detail.brandName || '',
        logo: logoUrl, // Set logo URL if available
        accountId: AppAccountId,
        brandId: brandId,
        sourceId: orgId,
        sourceLocationId: locId,
        sourceType: 'RETAIL',
        lineOfBusinessId: detail.lineOfBusiness || '',
        categoryId: detail.category || '',
        classId: detail.className || '',
        subClassId: detail.subClassName || '',
        departmentId: detail.departmentName || '',
        subDepartmentId: detail.subDepartmentName || '',
        createdBy: userInfo?.uidx || '',
        createdByName: userName || '',
        subBrand: {
          brandId: brandId ? brandId : null,
          subBrandId: detail?.subBrandId || '',
          subBrandCode: detail?.subBrandName || '',
          subBrandName: detail?.subBrandName || '',
          accountId: AppAccountId,
          sourceId: orgId,
          sourceLocationId: locId,
          sourceType: 'RETAIL',
          createdBy: userInfo?.uidx || '',
          createdByName: userName || '',
        },
      }));
    };

    if (!selectedManufacturerId || !brandDetails?.some((detail) => detail.brandName)) {
      showSnackbar('Please fill all required details', 'error');
      return;
    }

    const uniqueImageName = `image_${Date.now()}`;
    const imageData = removeDataURLPrefix(brandImage);
    // Assuming manufactureImage holds the image data; adjust as necessary
    if (imageData) {
      const imagePayload = {
        uploadType: 'Brand',
        images: {
          [uniqueImageName]: removeDataURLPrefix(brandImage),
        },
      };

      createImageUrl(imagePayload)
        .then((res) => {
          const imageObject = res?.data?.data?.data || {};
          const imageUrl = Object.values(imageObject)[0] || ''; // Extract the URL

          const payload = prepareBrandPayload(imageUrl);
          editBrand(payload)
            .then((res) => {
              if (res?.data?.data?.es === 0) {
                showSnackbar(`Brand with ${brandId} edited successfully`, 'success');
                navigate(-1);
              } else {
                showSnackbar('Error while editing brand', 'error');
              }
            })
            .catch((err) => {
              showSnackbar('Error while editing brand', 'error');
            });
        })
        .catch((error) => {
          showSnackbar('Error while uploading image', 'error');
        });
    } else {
      // Directly call masterBrandCreation if no image is present
      const payload = prepareBrandPayload(brandImage);
      editBrand(payload)
        .then((res) => {
          if (res?.data?.data?.es === 0) {
            navigate(-1);
            showSnackbar(`Brand with ${brandId} edited successfully`, 'success');
          } else {
            showSnackbar('Error while editing brand', 'error');
          }
        })
        .catch((err) => {
          showSnackbar('Error while editing brand', 'error');
        });
    }
  };

  const handleImageClick = (level) => {
    let fileInputRef;
    if (level === 'Manufacture') {
      fileInputRef = fileInputRefManufacture;
    } else if (level === 'Brand') {
      fileInputRef = fileInputRefBrand;
    }

    fileInputRef.current.click();
    fileInputRef.current.onchange = (e) => {
      if (e.target.files.length > 0) {
        handleImageChange(level, e.target.files[0]);
      }
    };
  };

  const handleImageChange = (level, file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      let imageBase64 = reader.result; // Base64 string of the image

      if (level === 'Manufacture') {
        setManufactureImage(imageBase64);
      } else if (level === 'Brand') {
        setBrandImage(imageBase64);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <DashboardLayout>
        <DashboardNavbar prevLink={true} />
        <SoftBox className="products-new-main-box">
          <>
            <SoftBox className="products-new-department-form-box">
              <Typography className="products-department-new-form-label-2">Brands</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={9} lg={9}>
                  <div style={{ marginBottom: '15px' }}>
                    <label className="products-department-new-form-label" required>
                      Manufacturer
                    </label>

                    {/* <SoftSelect
                        size="small"
                        placeholder="Select Manufacturer"
                        options={manufacturerOptions}
                        value={manufacturerOptions?.find((option) => option?.value === selectedManufacturerId)}
                        onChange={(e) => setSelectedManufacturerId(e?.value)}
                      /> */}
                    <SoftAsyncPaginate
                      size="small"
                      placeholder="Select Manufacturer"
                      value={
                        selectedManufacturerId
                          ? { label: selectedManufacturerId.label, value: selectedManufacturerId.value }
                          : null
                      }
                      loadOptions={loadManufactureOptions} // Load options with pagination
                      additional={{
                        page: 1, // Initial page
                      }}
                      onChange={(e) => setSelectedManufacturerId(e)} // Update selected manufacturer
                      isClearable
                      menuPortalTarget={document.body}
                    />
                  </div>
                </Grid>
                <Grid item xs={12} md={3} lg={3}>
                  <div className="products-new-department-right-bar" style={{ marginTop: '30px' }}>
                    {brandImage ? (
                      <div style={{ position: 'relative', display: 'inline-block', marginLeft: '10px' }}>
                        <img
                          src={brandImage}
                          alt="Manufacture"
                          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                        />
                        <IconButton
                          onClick={() => setBrandImage(null)}
                          style={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            backgroundColor: 'rgba(255, 255, 255, 0.7)',
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </div>
                    ) : (
                      <button type="button" onClick={() => handleImageClick('Brand')}>
                        Upload Image <CloudUploadIcon sx={{ marginLeft: '8px' }} fontSize="small" />
                      </button>
                    )}
                  </div>
                </Grid>
              </Grid>
              {brandDetails?.map((item, index) => (
                <div key={index}>
                  <Grid container spacing={2} style={{ marginBottom: '15px' }}>
                    <Grid item xs={12} md={5} lg={7.6} className="products-new-department-each-field">
                      <label className="products-department-new-form-label">Brand Name</label>
                      <RequiredAsterisk />
                      <SoftSelect
                        isLoading={false}
                        options={brandNameOptions}
                        placeholder="Enter brand name..."
                        name="brandName"
                        size="small"
                        value={item?.brandName}
                        onInputChange={handleBrandInputChange}
                        onChange={(selectedOption) => handleChange(selectedOption, index)}
                      />
                    </Grid>
                    <Grid item xs={12} md={5} lg={3.8} className="products-new-department-each-field">
                      <label className="products-department-new-form-label">Line of Business</label>
                      <SoftSelect
                        placeholder="Select line of business..."
                        size="small"
                        isLoading={lineOfBusinessLoader}
                        noOptionsMessage={() => 'No data found'}
                        options={lineOfBusinessOptions}
                        value={
                          lineOfBusinessOptions.find(
                            (option) => option.value === item?.lineOfBusiness, // Find by ID
                          ) || null
                        }
                        onChange={(option) => handleBrandChange(item.id, 'lineOfBusiness', option.value)}
                        // onFocus={() => getAllLineOfBusiness()}
                      />
                    </Grid>
                    {brandDetails.length > 1 && (
                      <Grid item xs={12} md={1} lg={0.6} className="products-new-department-each-field">
                        <CloseIcon
                          onClick={() => removeBrand(item.id)}
                          style={{ color: 'red', fontSize: '18px', marginTop: '40px', cursor: 'pointer' }}
                        />
                      </Grid>
                    )}
                  </Grid>
                  <Grid container spacing={2} style={{ marginBottom: '15px' }}>
                    <Grid item xs={12} md={5} lg={2.5} className="products-new-department-each-field">
                      <label className="products-department-new-form-label">Category title</label>
                      <SoftSelect
                        placeholder="Select category..."
                        size="small"
                        isLoading={allMainCategoriesLoader && brandDetailsIndex === index}
                        noOptionsMessage={() => 'No data found'}
                        options={mainCategoryOptions}
                        value={mainCategoryOptions?.find(
                          (option) =>
                            option?.value === brandDetails?.find((detail) => detail?.id === item?.id)?.category,
                        )}
                        onChange={(option) => {
                          handleBrandChange(item?.id, 'category', option?.value);
                          setMainCategory(option?.value);
                        }}
                        onFocus={() => {
                          setBrandDetailsIndex(index);
                          // getAllMainCategories();
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={5} lg={2.5} className="products-new-department-each-field">
                      <label className="products-department-new-form-label">Class title</label>
                      <SoftSelect
                        placeholder="Select class..."
                        size="small"
                        isLoading={level1CatLoader && brandDetailsIndex === index}
                        noOptionsMessage={() => 'No data found'}
                        options={level1CategoryOptions}
                        value={level1CategoryOptions?.find(
                          (option) =>
                            option?.value === brandDetails?.find((detail) => detail?.id === item?.id)?.className,
                        )}
                        onChange={(option) => {
                          handleBrandChange(item?.id, 'className', option?.value);
                          setLevel1Category(option?.value);
                        }}
                        onFocus={() => mainCategory && fetchLevel1Category(mainCategory)}
                      />
                    </Grid>
                    <Grid item xs={12} md={5} lg={2.5} className="products-new-department-each-field">
                      <label className="products-department-new-form-label">Sub-class title</label>
                      <SoftSelect
                        placeholder="Select sub-class..."
                        size="small"
                        isLoading={level2CatLoader && brandDetailsIndex === index}
                        noOptionsMessage={() => 'No data found'}
                        options={level2CategoryOptions}
                        value={level2CategoryOptions?.find(
                          (option) =>
                            option?.value === brandDetails?.find((detail) => detail?.id === item?.id)?.subClassName,
                        )}
                        onChange={(option) => handleBrandChange(item?.id, 'subClassName', option?.value)}
                        onFocus={() => {
                          if (level1Category) {
                            setBrandDetailsIndex(index);
                            fetchLevel2Category(level1Category);
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={5} lg={2} className="products-new-department-each-field">
                      <label className="products-department-new-form-label">Department title</label>
                      <SoftSelect
                        placeholder={item?.departmentName ? item?.departmentName : 'Select department...'}
                        size="small"
                        isLoading={allDepartmentsLoader && brandDetailsIndex === index}
                        noOptionsMessage={() => 'No data found'}
                        options={departmentOptions}
                        value={departmentOptions?.find(
                          (option) =>
                            option?.value === brandDetails?.find((detail) => detail?.id === item?.id)?.departmentName,
                        )}
                        onChange={(option) => {
                          handleBrandChange(item?.id, 'departmentName', option?.value);
                          setDepartmentSelect(option?.value);
                        }}
                        onFocus={() => {
                          setBrandDetailsIndex(index);
                          // getAllDepartments();
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={5} lg={2.5} className="products-new-department-each-field">
                      <label className="products-department-new-form-label">Sub-department title</label>
                      <SoftSelect
                        placeholder={item?.subDepartmentName ? item?.subDepartmentName : 'Select sub-department...'}
                        size="small"
                        isLoading={departmentSelectLoader && brandDetailsIndex === index}
                        noOptionsMessage={() => 'No data found'}
                        options={subDepartmentOptions}
                        value={subDepartmentOptions?.find(
                          (option) =>
                            option?.value ===
                            brandDetails?.find((detail) => detail?.id === item?.id)?.subDepartmentName,
                        )}
                        onChange={(option) => handleBrandChange(item?.id, 'subDepartmentName', option?.value)}
                        onFocus={() => {
                          if (departmentSelect) {
                            setBrandDetailsIndex(index);
                            fetchSubDepartment(departmentSelect);
                          }
                        }}
                      />
                    </Grid>
                  </Grid>
                  {index < brandDetails.length - 1 && (
                    <hr style={{ margin: '20px 0', opacity: 0.3, border: 'none', borderTop: '1px solid lightgray' }} />
                  )}
                </div>
              ))}

              <span type="button" onClick={addMoreBrandDetails} className="products-new-department-addmore-btn-2">
                + Add more
              </span>
            </SoftBox>
            <SoftBox className="products-new-department-form-box">
              <Typography className="products-department-new-form-label-2">Brand Marketing Company</Typography>
              {brandMarketingData?.map((item, index) => (
                <div>
                  <Grid container spacing={2} style={{ marginBottom: '15px' }}>
                    <Grid item xs={12} md={5} lg={4} className="products-new-department-each-field">
                      <label className="products-department-new-form-label">Vendor Name</label>
                      {/* <SoftSelect
                        placeholder="Select vendor name..."
                        size="small"
                        options={vendorNameOptions}
                        isLoading={vendorNamesLoader && brandDetailsIndex === index}
                        noOptionsMessage={() => 'No data found'}
                        value={vendorNameOptions?.find(
                          (option) =>
                            option?.value === brandMarketingData?.find((detail) => detail?.id === item?.id)?.vendorName,
                        )}
                        onChange={(option) => handleBrandMarketingChange(item?.id, 'vendorName', option?.value)}
                        onFocus={() => {
                          setBrandDetailsIndex(index);
                          getAllVendorNames();
                        }}
                      /> */}
                      <SoftAsyncPaginate
                        size="small"
                        placeholder="Select Vendor"
                        value={vendorNameOptions?.find(
                          (option) =>
                            option?.value === brandMarketingData?.find((detail) => detail?.id === item?.id)?.vendorName,
                        )}
                        loadOptions={loadVendorOptions} // Load options with pagination
                        additional={{
                          page: 1, // Initial page
                        }}
                        onChange={(option) => handleBrandMarketingChange(item?.id, 'vendorName', option?.value)}
                        isClearable
                        menuPortalTarget={document.body}
                      />
                    </Grid>
                    <Grid item xs={12} md={5} lg={4} className="products-new-department-each-field">
                      <label className="products-department-new-form-label">Business Location</label>
                      <SoftSelect
                        placeholder="Select business location..."
                        size="small"
                        options={displayStoreOptions}
                        value={vendorNameOptions?.find(
                          (option) =>
                            option?.location ===
                            brandMarketingData?.find((detail) => detail?.id === item?.id)?.businessLocation,
                        )}
                        //   onChange={(option) => handleBrandMarketingChange(item.id, 'businessLocation', option.value)}
                      />
                    </Grid>
                    <Grid item xs={12} md={5} lg={3} className="products-new-department-each-field">
                      <label className="products-department-new-form-label">Serviceable Areas</label>
                      <SoftSelect
                        placeholder="Select serviceable areas..."
                        size="small"
                        options={
                          brandMarketingData?.[index]?.serviceableAreasOptions?.map((item) => ({
                            value: item,
                            label: item,
                          })) || []
                        }
                        // value={brandMarketingData?.serviceableAreasOptions.find(
                        //   (option) => option.value === item.serviceableAreas,
                        // )}
                        value={brandMarketingData?.[index]?.serviceableAreas || []}
                        onChange={(option) => handleBrandMarketingChange(item.id, 'serviceableAreas', option)}
                        isMulti
                      />
                    </Grid>
                    {brandMarketingData?.length > 1 && (
                      <Grid item xs={12} md={1} lg={1} className="products-new-department-each-field">
                        <CloseIcon
                          onClick={() => removeBrandMarketing(item.id)}
                          style={{ color: 'red', fontSize: '18px', marginTop: '40px', cursor: 'pointer' }}
                        />
                      </Grid>
                    )}
                  </Grid>
                </div>
              ))}

              <span type="button" onClick={addMoreBrandMarketing} className="products-new-department-addmore-btn-2">
                + Add more
              </span>
            </SoftBox>
            <SoftBox display="flex" justifyContent="flex-end" mt={4}>
              <SoftBox display="flex">
                <SoftButton className="vendor-second-btn" onClick={() => navigate(-1)}>
                  Cancel
                </SoftButton>
                <SoftBox ml={2}>
                  {brandId ? (
                    <SoftButton color="info" className="vendor-add-btn" onClick={handleEditBrand}>
                      Edit
                    </SoftButton>
                  ) : (
                    <SoftButton color="info" className="vendor-add-btn" onClick={createBrand}>
                      Save
                    </SoftButton>
                  )}
                </SoftBox>
              </SoftBox>
            </SoftBox>
          </>
        </SoftBox>
        <input
          type="file"
          ref={fileInputRefBrand}
          style={{ display: 'none' }}
          accept=".jpg, .jpeg, .png"
          onChange={(e) => handleImageChange('Brand', e.target.files[0])}
        />
      </DashboardLayout>
    </div>
  );
};

export default BrandCreation;
