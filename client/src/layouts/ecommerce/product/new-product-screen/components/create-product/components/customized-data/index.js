import { Box, Card, Checkbox, Grid, Tooltip } from '@mui/material';
import SoftBox from '../../../../../../../../components/SoftBox';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SoftSelect from '../../../../../../../../components/SoftSelect';
import SoftTypography from '../../../../../../../../components/SoftTypography';
import { useEffect, useState } from 'react';
import {
  fetchOrganisations,
  getAllLevel1Category,
  getAllLevel2Category,
  getAllMainCategory,
  getAllVendors,
  getDepartmentList,
  getLobList,
  getSubDepartmentList,
} from '../../../../../../../../config/Services';
import { getClearedDetails, getProductDetails } from '../../../../../../../../datamanagement/productDetailsSlice';
import { useSelector } from 'react-redux';
import ClearIcon from '@mui/icons-material/Clear';
import { item } from '../../../../../../../../examples/Sidenav/styles/sidenavItem';
import SoftAsyncPaginate from '../../../../../../../../components/SoftSelect/SoftAsyncPaginate';

const vendorTypeOptions = [
  { label: 'Select', value: '---' },
  { label: 'Manufacturers', value: 'MANUFACTURER' },
  { label: 'Wholesalers', value: 'WHOLESALER' },
  { label: 'Retailers', value: 'RETAILER' },
  { label: 'Distributor', value: 'DISTRIBUTOR' },
  { label: 'Individual', value: 'INDIVIDUAL' },
];
const CustomizedDataProducts = ({ onDataChange, isEditable }) => {
  const locId = localStorage?.getItem('locId');
  const productData = useSelector(isEditable ? getProductDetails : getClearedDetails);
  const orgId = localStorage?.getItem('orgId');
  const [mainCatArr, setMainCatArr] = useState([]);
  const [marketingDataCount, setMarketingDataCount] = useState(1);
  const [displayStoreOptions, setDisplayStoreOptions] = useState([]);
  const [formData, setFormData] = useState({
    customizedDataChecked: false,
    category: '',
    class: '',
    subclass: '',
    department: '',
    subDepartment: '',
    lineOfBusiness: '',
    brandMarketingChecked: false,
    companyName: [],
    companyType: [],
    deliveryArea: [],
    preferredVendor: [],
    givenCatName: '',
    givenSubCatName: '',
    givenSubCat2Name: '',
  });
  const [vendorOptionArr, setVendorOptionsArray] = useState([]);

  useEffect(() => {
    onDataChange(formData);
  }, [formData]);

  const fetchCategoryName = async (categoryId) => {
    try {
      const payload = {
        type: ['POS'],
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
        type: ['POS'],
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
        type: ['POS'],
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

  const fetchDepartmentName = async (categoryId) => {
    try {
      const payload = {
        departmentId: [categoryId],
      };
      const res = await getDepartmentList(payload);
      return res?.data?.data?.results[0]?.departmentName || '';
    } catch (err) {
      return '';
    }
  };

  const fetchSubDepartmentName = async (categoryId) => {
    try {
      const payload = {
        subDepartmentId: [categoryId],
      };
      const res = await getSubDepartmentList(payload);
      return res?.data?.data?.results[0]?.subDepartmentName || '';
    } catch (err) {
      return '';
    }
  };

  const fetchLobName = async (categoryId) => {
    try {
      const payload = {
        lineOfBusinessId: [categoryId],
      };
      const res = await getLobList(payload);
      return res?.data?.data?.results[0]?.lobName || '';
    } catch (err) {
      return '';
    }
  };

  useEffect(() => {
    const setFormDataWithCategories = async () => {
      const newValues = {};

      if (productData?.posCategories?.categoryLevel1?.[0]) {
        const { categoryName, categoryId } = await fetchCategoryName(productData?.posCategories?.categoryLevel1?.[0]);

        // Prepare payload to call API and get the nearest name suggestion
        if (categoryName !== productData?.posCategories?.categoryLevel1[0]) {
          newValues.givenCatName = productData?.posCategories?.categoryLevel1[0]; // Set givenCatName to original input
        }

        newValues.catLevel1 = {
          value: categoryId,
          label: categoryName,
        };
      }

      if (productData?.posCategories?.categoryLevel2?.[0]) {
        const { categoryName, categoryId } = await fetchCategory2Name(productData?.posCategories?.categoryLevel2?.[0]);

        if (categoryName !== productData?.posCategories?.categoryLevel2[0]) {
          newValues.givenSubCatName = productData?.posCategories?.categoryLevel2[0];
          if (newValues.catLevel1) {
            handleMainCatChange(newValues.catLevel1);
          }
        }

        newValues.catLevel2 = {
          value: categoryId,
          label: categoryName,
        };
      }

      if (productData?.posCategories?.categoryLevel3?.[0]) {
        const { categoryName, categoryId } = await fetchCategory3Name(productData?.posCategories?.categoryLevel3?.[0]);
        if (categoryName !== productData?.posCategories?.categoryLevel3[0]) {
          newValues.givenSubCat2Name = productData?.posCategories?.categoryLevel3[0];
          if (newValues.catLevel2) {
            handleLevel2CatChange(newValues.catLevel2);
          }
        }

        newValues.catLevel3 = {
          value: categoryId,
          label: categoryName,
        };
      }

      if (productData?.posCategories?.departmentId?.[0]) {
        const departmentName = await fetchDepartmentName(productData?.posCategories?.departmentId?.[0]);
        newValues.department = {
          value: productData?.posCategories?.departmentId?.[0],
          label: departmentName,
          code: productData?.posCategories?.departmentCode?.[0],
        };
      }

      if (productData?.posCategories?.subDepartmentId?.[0]) {
        const subDepartmentName = await fetchSubDepartmentName(productData?.posCategories?.subDepartmentId?.[0]);
        newValues.subDepartment = {
          value: productData?.posCategories?.subDepartmentId?.[0],
          label: subDepartmentName,
          code: productData?.posCategories?.subDepartmentCode?.[0],
        };
      }

      if (productData?.posCategories?.lobId?.[0]) {
        const lineOfBusinessName = await fetchLobName(productData?.posCategories?.lobId?.[0]);
        newValues.lineOfBusiness = {
          value: productData?.posCategories?.lobId?.[0],
          label: lineOfBusinessName,
          code: productData?.posCategories?.lobCode?.[0],
        };
      }

      const companyNameData = productData?.marketingCompanies?.map((item) => ({ value: item?.id, label: item?.name }));
      const companyTypeData = productData?.marketingCompanies?.map((item) => ({
        value: item?.type,
        label: item?.type,
        deliveryLocations: item?.deliveryLocations?.[0],
      }));
      const preferedVendorData = productData?.marketingCompanies?.map((item) => item?.isPreferred);
      newValues.companyName = companyNameData;
      newValues.companyType = companyTypeData;
      newValues.preferredVendor = preferedVendorData;
      newValues.deliveryArea = companyTypeData?.map((item) => ({
        value: item?.deliveryLocations || '',
        label: item?.deliveryLocations || '',
      }));

      setFormData((prevFormData) => ({
        ...prevFormData,
        ...newValues,
      }));
    };
    if (productData) {
      setFormDataWithCategories();
    }

    setMarketingDataCount(productData?.marketingCompanies?.length || 1);
  }, [productData]);

  const handleChange = (field, value) => {
    setFormData((prevState) => ({ ...prevState, [field]: value }));
  };

  // useEffect(() => {
  //   let payload = {
  //     page: 1,
  //     pageSize: 50,
  //     sourceLocationId: [locId],
  //     // type: ['POS'],
  //   };

  //   let catPayload = {
  //     page: 1,
  //     pageSize: 50,
  //     sourceLocationId: [locId],
  //     type: ['POS'],
  //   };

  //   getAllMainCategory(catPayload).then((response) => {
  //     let cat = [];
  //     response?.data?.data?.results?.map((e) => {
  //       if (e !== undefined) cat.push({ value: e.mainCategoryId, label: e.categoryName });
  //     });
  //     setMainCatArr(cat);
  //   });

  //   getDepartmentList(payload)
  //     .then((res) => {
  //       const result = res?.data?.data?.results?.map((item) => ({
  //         label: item?.departmentName,
  //         value: item?.departmentId,
  //         code: item?.departmentCode,
  //       }));
  //       updateFormData('departmentOptions', result);
  //     })
  //     .catch((err) => {});

  //   getLobList(payload)
  //     .then((res) => {
  //       const result = res?.data?.data?.results?.map((item) => ({
  //         label: item?.lobName,
  //         value: item?.lineOfBusinessId,
  //         code: item?.lobCode,
  //       }));
  //       updateFormData('lobOptions', result);
  //     })
  //     .catch(() => {});
  // }, []);

  const loadMainCategoryOptions = async (searchQuery, loadedOptions, { page }) => {
    const payload = {
      page: page,
      pageSize: 50,
      sourceId: [orgId],
      sourceLocationId: [locId],
      type: ['POS'],
      active: [true],
    };

    try {
      const response = await getAllMainCategory(payload);
      const data = response?.data?.data?.results || [];
      const options = data?.map((item) => ({
        value: item?.mainCategoryId,
        label: item?.categoryName,
      }));

      return {
        options,
        hasMore: data?.length >= 50,
        additional: { page: page + 1 },
      };
    } catch (error) {
      showSnackbar('Error fetching main categories', 'error');
      return {
        options: [],
        hasMore: false,
      };
    }
  };

  const loadDepartmentOptions = async (searchQuery, loadedOptions, { page }) => {
    const payload = {
      page: page,
      pageSize: 50,
      sourceId: [orgId],
      sourceLocationId: [locId],
      active: [true],
    };

    try {
      const res = await getDepartmentList(payload);
      const data = res?.data?.data?.results || [];
      const options = data?.map((item) => ({
        label: item?.departmentName,
        value: item?.departmentId,
        code: item?.departmentCode,
      }));

      return {
        options,
        hasMore: data?.length >= 50,
        additional: { page: page + 1 },
      };
    } catch (error) {
      showSnackbar('Error fetching departments', 'error');
      return {
        options: [],
        hasMore: false,
      };
    }
  };

  const loadLobOptions = async (searchQuery, loadedOptions, { page }) => {
    const payload = {
      page: page,
      pageSize: 50,
      sourceId: [orgId],
      sourceLocationId: [locId],
      active: [true],
    };

    try {
      const res = await getLobList(payload);
      const data = res?.data?.data?.results || [];
      const options = data?.map((item) => ({
        label: item?.lobName,
        value: item?.lineOfBusinessId,
        code: item?.lobCode,
      }));

      return {
        options,
        hasMore: data?.length >= 50,
        additional: { page: page + 1 },
      };
    } catch (error) {
      showSnackbar('Error fetching Line of Business', 'error');
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
      type: ['POS'],
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
      pageSize: 50,
      level1Id: [option?.value],
      sourceLocationId: [locId],
      type: ['POS'],
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
  };
  const updateFormData = (key, value) => {
    setFormData((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const fetchSubDepartment = (department) => {
    const payload = {
      page: 1,
      pageSize: 50,
      departmentId: [department?.value],
      active: [true],
    };
    getSubDepartmentList(payload)
      .then((res) => {
        const result = res?.data?.data?.results?.map((item) => ({
          label: item?.subDepartmentName,
          value: item?.subDepartmentId,
          code: item?.subDepartmentCode,
        }));
        updateFormData('subDepartmentOptions', result);
      })
      .catch(() => {});
  };

  // useEffect(() => {
  //   const filterObject = {
  //     page: 0,
  //     pageSize: 20,
  //     filterVendor: {
  //       searchText: null,
  //     },
  //   };
  //   getAllVendors(filterObject, orgId).then((response) => {
  //     const data = response?.data?.data?.vendors?.map((item) => ({ label: item?.vendorName, value: item?.vendorId }));
  //     setVendorOptionsArray(data || []);

  //     // setOptions()
  //   });
  // }, []);

  const loadVendorOptions = async (searchQuery, loadedOptions, { page }) => {
    const filterObject = {
      page: page,
      pageSize: 50,
      filterVendor: {
        searchText: null,
      },
    };

    try {
      const res = await getAllVendors(filterObject, orgId);
      const data = res?.data?.data?.vendors || [];
      const options = data?.map((item) => ({
        label: item?.vendorName,
        value: item?.vendorId,
      }));

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

  const clearVendorData = (index) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      companyName: prevFormData?.companyName?.map((item, i) => (i === index ? {} : item)) || [],
      companyType: prevFormData?.companyType?.map((item, i) => (i === index ? {} : item)) || [],
      deliveryArea: prevFormData?.deliveryArea?.map((item, i) => (i === index ? {} : item)) || [],
      preferredVendor: prevFormData?.preferredVendor?.map((item, i) => (i === index ? false : item)) || [],
    }));
    setMarketingDataCount(marketingDataCount - 1);
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

  return (
    <Card style={{ padding: '15px' }}>
      <SoftBox className="common-display-flex" style={{ gap: '5px', justifyContent: 'flex-start' }}>
        <label className="common-display-flex-1" style={{ gap: '5px' }}>
          <Checkbox
            checked={formData.customizedDataChecked}
            onChange={(e) => handleChange('customizedDataChecked', e.target.checked)}
          />
          <div className="title-heading-products">
            Customized data{' '}
            <span className="main-header-icon">
              <Tooltip
                title="Include any additional product information that is unique to your product"
                placement="right"
              >
                <InfoOutlinedIcon />
              </Tooltip>
            </span>
          </div>
        </label>
      </SoftBox>
      {/* Category */}

      {formData?.customizedDataChecked && (
        <SoftBox style={{ marginTop: '10px' }}>
          <Grid container direction="row" justifyContent="space-between" alignItems="baseline" gap="5px">
            <Grid item xs={12} md={3} lg={2}>
              <div className="title-heading-products">Category Title</div>
              {/* <SoftSelect
                size="small"
                value={formData?.catLevel1}
                options={mainCatArr}
                onChange={(e) => handleMainCatChange(e)}
                menuPortalTarget={document.body}
              /> */}
              <SoftAsyncPaginate
                size="small"
                value={formData?.catLevel1}
                loadOptions={loadMainCategoryOptions}
                additional={{ page: 1 }}
                isClearable
                onChange={(e) => handleMainCatChange(e)}
                menuPortalTarget={document.body}
              />
              <div className="duplicate-category-msg">{formData?.givenCatName}</div>
            </Grid>
            <Grid item xs={12} md={3} lg={2}>
              <div className="title-heading-products">Class Title</div>
              <SoftSelect
                size="small"
                value={formData?.catLevel2}
                options={formData.catLeve2Arr}
                onChange={(e) => handleLevel2CatChange(e)}
                menuPortalTarget={document.body}
              />
              <div className="duplicate-category-msg">{formData?.givenSubCatName}</div>
            </Grid>
            <Grid item xs={12} md={3} lg={2}>
              <div className="title-heading-products">Sub-class Title</div>
              <SoftSelect
                size="small"
                value={formData?.catLevel3}
                options={formData.catLeve3Arr}
                onChange={(e) => handleLevel3CatChange(e)}
                menuPortalTarget={document.body}
              />
              <div className="duplicate-category-msg">{formData?.givenSubCat2Name}</div>
            </Grid>
            <Grid item xs={12} md={3} lg={2}>
              <div className="title-heading-products">Department Title</div>
              {/* <SoftSelect
                size="small"
                value={formData.department}
                options={formData?.departmentOptions}
                onChange={(e) => {
                  handleChange('department', e);
                  fetchSubDepartment(e);
                }}
                menuPortalTarget={document.body}
              /> */}
              <SoftAsyncPaginate
                size="small"
                value={formData.department}
                loadOptions={loadDepartmentOptions}
                additional={{ page: 1 }}
                isClearable
                onChange={(e) => {
                  handleChange('department', e);
                  fetchSubDepartment(e); // Fetch sub-departments after selecting a department
                }}
                menuPortalTarget={document.body}
              />
            </Grid>
            <Grid item xs={12} md={3} lg={2}>
              <div className="title-heading-products">Sub-department Title</div>
              <SoftSelect
                size="small"
                value={formData.subDepartment}
                options={formData?.subDepartmentOptions}
                onChange={(e) => handleChange('subDepartment', e)}
                menuPortalTarget={document.body}
              />
            </Grid>
            <Grid item xs={12} md={3} lg={1.5}>
              <div className="title-heading-products">Line of business</div>
              {/* <SoftSelect
                size="small"
                value={formData.lineOfBusiness}
                options={formData?.lobOptions}
                onChange={(e) => handleChange('lineOfBusiness', e)}
                menuPortalTarget={document.body}
              /> */}
              <SoftAsyncPaginate
                size="small"
                value={formData.lineOfBusiness}
                loadOptions={loadLobOptions}
                additional={{ page: 1 }}
                isClearable
                onChange={(e) => handleChange('lineOfBusiness', e)}
                menuPortalTarget={document.body}
              />
            </Grid>
          </Grid>
        </SoftBox>
      )}
      {/* Brand marketing */}
      <SoftBox style={{ marginTop: '20px' }}>
        <label className="common-display-flex-1" style={{ gap: '5px' }}>
          <Checkbox
            checked={formData.brandMarketingChecked}
            onChange={(e) => handleChange('brandMarketingChecked', e.target.checked)}
          />
          <div className="title-heading-products">
            Brand marketing company{' '}
            <span className="main-header-icon">
              <Tooltip title="Select vendor and type" placement="right">
                <InfoOutlinedIcon />
              </Tooltip>
            </span>
          </div>
        </label>
      </SoftBox>
      {formData?.brandMarketingChecked && (
        <SoftBox style={{ marginTop: '10px', overflowX: 'scroll' }}>
          <SoftBox style={{ minWidth: '900px' }}>
            {Array.from({ length: marketingDataCount }).map((e, index) => (
              <Grid
                container
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                style={{ marginTop: '5px' }}
                gap="10px"
              >
                <Grid item xs={3} md={3} lg={3}>
                  {index === 0 && <div className="title-heading-products">Vendor name</div>}
                  {/* <SoftSelect
                    size="small"
                    value={formData?.companyName?.[index]}
                    onChange={(e) => {
                      const updatedCompanyName = [...(formData?.companyName || [])];
                      updatedCompanyName[index] = e;
                      handleChange('companyName', updatedCompanyName);
                    }}
                    menuPortalTarget={document.body}
                    options={vendorOptionArr}
                  /> */}
                  <SoftAsyncPaginate
                    size="small"
                    value={formData?.companyName?.[index]}
                    loadOptions={loadVendorOptions}
                    additional={{ page: 1 }}
                    isClearable
                    onChange={(e) => {
                      const updatedCompanyName = [...(formData?.companyName || [])];
                      updatedCompanyName[index] = e;
                      handleChange('companyName', updatedCompanyName);
                    }}
                    menuPortalTarget={document.body}
                  />
                </Grid>

                <Grid item xs={3} md={3} lg={3}>
                  {index === 0 && <div className="title-heading-products">Vendor type</div>}
                  <SoftSelect
                    size="small"
                    value={formData?.companyType?.[index]}
                    onChange={(e) => {
                      const updatedCompanyType = [...(formData?.companyType || [])];
                      updatedCompanyType[index] = e;
                      handleChange('companyType', updatedCompanyType);
                    }}
                    options={vendorTypeOptions}
                    menuPortalTarget={document.body}
                  />
                </Grid>

                <Grid item xs={3} md={3} lg={3}>
                  {index === 0 && <div className="title-heading-products">Delivery area</div>}
                  <SoftSelect
                    size="small"
                    value={formData?.deliveryArea?.[index]}
                    options={displayStoreOptions}
                    onChange={(e) => {
                      const updatedDelivery = [...(formData?.deliveryArea || [])];
                      updatedDelivery[index] = e;
                      handleChange('deliveryArea', updatedDelivery);
                    }}
                    menuPortalTarget={document.body}
                  />
                </Grid>

                <Grid item xs={2} md={2} lg={2}>
                  {index === 0 && <div className="title-heading-products">Preferred Vendor</div>}
                  <Checkbox
                    checked={formData?.preferredVendor?.[index]}
                    onChange={(e) => {
                      const updatedPreferedVendor = [...(formData?.preferredVendor || [])];
                      updatedPreferedVendor[index] = e.target.checked;
                      handleChange('preferredVendor', updatedPreferedVendor);
                    }}
                  />
                </Grid>

                <Grid item xs={1} lg={0.5}>
                  <ClearIcon
                    style={{ cursor: 'pointer', color: 'red', marginTop: index === 0 ? '10px' : '0px' }}
                    onClick={() => clearVendorData(index)}
                  />
                </Grid>
              </Grid>
            ))}
          </SoftBox>
          <SoftTypography className="add-more-products" onClick={() => setMarketingDataCount(marketingDataCount + 1)}>
            + Add more
          </SoftTypography>
        </SoftBox>
      )}
    </Card>
  );
};

export default CustomizedDataProducts;
