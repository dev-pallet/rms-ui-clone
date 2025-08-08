import React, { useEffect, useState } from 'react';
import SoftBox from '../../../../../../components/SoftBox';
import SoftButton from '../../../../../../components/SoftButton';
import { Autocomplete, CircularProgress, Grid, TextField, Typography } from '@mui/material';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from '../../../../../../hooks/SnackbarProvider';
import SoftSelect from '../../../../../../components/SoftSelect';
import {
  createTaxMapping,
  filterTaxSlabs,
  getAllLevel1Category,
  getAllLevel2Category,
  getAllMainCategory,
} from '../../../../../../config/Services';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import CloseIcon from '@mui/icons-material/Close';
import DashboardLayout from '../../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../../examples/Navbars/DashboardNavbar';
import SoftAsyncPaginate from '../../../../../../components/SoftSelect/SoftAsyncPaginate';
import { RequiredAsterisk } from '../../../../Common/CommonFunction';

const CategoryTaxMapping = () => {
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();
  const location1 = useLocation();

  const getQueryParams = () => {
    const params = new URLSearchParams(location1.search);
    const mapId = params.get('mapId');
    return { mapId };
  };

  const { mapId } = getQueryParams();

  const [mainCategoryOptions, setMainCategoryOptions] = useState([]);
  const [selectedMainCategory, setSelectedMainCategory] = useState('');

  const [level1CategoryOptions, setLevel1CategoryOptions] = useState([]);
  const [selectedLevel1Category, setSelectedLevel1Category] = useState('');

  const [level2CategoryOptions, setLevel2CategoryOptions] = useState([]);
  const [selectedLevel2Category, setSelectedLevel2Category] = useState('');

  const [selectedSlabType, setSelectedSlabType] = useState('');
  const [selectedSlabSubType, setSelectedSlabSubType] = useState('');
  const [selectedSlabId, setSelectedSlabId] = useState('');

  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const user_details = localStorage.getItem('user_details');
  const user_name = localStorage.getItem('user_name');
  const AppAccountId = localStorage.getItem('AppAccountId');
  const uidx = JSON.parse(user_details).uidx;
  const [loader, setLoader] = useState(false);

  const [categoryMappingData, setCategoryMappingData] = useState([
    {
      id: 1,
      category: '',
      class: '',
      subClass: '',
      hsnCode: '',
      dynamicFields: {},
    },
  ]);

  const handleCategoryMapping = (id, option, field) => {
    setCategoryMappingData((prevState) =>
      prevState.map((item) => (item.id === id ? { ...item, [field]: option } : item)),
    );
  };

  const handleDynamicFieldChange = (id, field, value) => {
    setCategoryMappingData((prevState) =>
      prevState.map((item) =>
        item.id === id
          ? {
              ...item,
              dynamicFields: {
                ...item.dynamicFields,
                [field]: value,
              },
            }
          : item,
      ),
    );
  };

  const addCategoryMapping = () => {
    setCategoryMappingData((prevState) => [
      ...prevState,
      {
        id: prevState.length + 1,
        category: '',
        class: '',
        subClass: '',
        hsnCode: '',
        dynamicFields: {},
      },
    ]);
  };

  const removeCategoryMapping = (id) => {
    setCategoryMappingData((prevState) => prevState.filter((item) => item.id !== id));
  };

  const loadTaxSlabData = async (searchQuery, loadedOptions, { page }) => {
    const payload = {
      page: page,
      pageSize: 50,
      sourceId: [orgId],
      sourceLocationId: [locId],
      sortByCreatedDate: 'DESCENDING',
    };

    try {
      const res = await filterTaxSlabs(payload);
      const results = res?.data?.data?.results || [];

      const options = results?.map((item) => ({
        value: item?.slabId,
        label: item?.taxCode || 'NA',
        type: item?.type,
        subType: item?.subType,
      }));

      return {
        options,
        hasMore: results?.length >= 50, // Check if there are more results to load
        additional: { page: page + 1 }, // Increment page for next load
      };
    } catch (error) {
      showSnackbar('Error fetching tax slab options', 'error');
      return {
        options: [],
        hasMore: false,
      };
    }
  };

  const loadMainCategoryOptions = async (searchQuery, loadedOptions, { page }) => {
    const payload = {
      page: page,
      pageSize: 50,
      sourceId: [orgId],
      sourceLocationId: [locId],
      type: ['APP'],
      // categoryName: searchQuery || '', // Use search query if available
    };

    try {
      const res = await getAllMainCategory(payload);
      const results = res?.data?.data?.results || [];

      const options = results?.map((item) => ({
        value: item?.mainCategoryId,
        label: item?.categoryName || 'NA',
      }));

      return {
        options,
        hasMore: results?.length >= 50, // Check if there are more results to load
        additional: { page: page + 1 }, // Increment page for next load
      };
    } catch (error) {
      showSnackbar('Error fetching main category options', 'error');
      return {
        options: [],
        hasMore: false,
      };
    }
  };

  useEffect(() => {
    const payload = {
      page: 1,
      pageSize: 50,
      mainCategoryId: [selectedMainCategory],
      sourceId: [orgId],
      sourceLocationId: [locId],
      type: ['APP'],
    };
    getAllLevel1Category(payload)
      .then((res) => {
        const results = res?.data?.data?.results;
        const data = results?.map((item) => ({
          value: item?.level1Id,
          label: item?.categoryName,
        }));
        setLevel1CategoryOptions(data);
      })
      .catch(() => {});
  }, [selectedMainCategory]);

  const getLevel2SubClass = () => {
    const paylaod = {
      page: 1,
      pageSize: 50,
      level1Id: [selectedLevel1Category],
      sourceId: [orgId],
      sourceLocationId: [locId],
      type: ['APP'],
    };
    getAllLevel2Category(paylaod)
      .then((res) => {
        const response = res?.data?.data?.results;
        if (response.length > 0) {
          const data = response.map((e, index) => ({
            label: e?.categoryName,
            value: e?.level2Id,
          }));
          setLevel2CategoryOptions(data);
        }
      })
      .catch((err) => {});
  };

  useEffect(() => {
    getLevel2SubClass();
  }, [selectedLevel1Category]);

  const handleCreateTaxMapping = () => {
    setLoader(true);
    const payload = categoryMappingData.map((item) => ({
      level3Id: item?.subClass,
      slabId: selectedSlabId,
      sourceId: orgId,
      sourceLocationId: locId,
      createdBy: user_name,
      createdByName: uidx,
      updatedBy: user_name,
      updatedByName: uidx,
    }));
    if (!selectedSlabId) {
      showSnackbar('Please select a tax slab', 'error');
      setLoader(false);
      return;
    }

    createTaxMapping(payload)
      .then((res) => {
        setLoader(false);
        if (res?.data?.status === 'ERROR') {
          showSnackbar(res?.data?.message, 'error');
        }
        showSnackbar('Tax Mapping created Successfully', 'success');
        navigate('/products/tax');
      })
      .catch((err) => {
        setLoader(false);
        showSnackbar('Error while creating tax mapping', 'error');
      });
  };

  return (
    <DashboardLayout>
      <DashboardNavbar prevLink={true} />
      <div>
        <SoftBox className="products-new-department-form-box">
          <Grid container spacing={2} style={{ marginBottom: '15px', marginTop: '10px' }}>
            <Grid item lg={6} sm={12} md={6}>
              <label className="products-department-new-form-label">Select Tax Slab</label>
              <RequiredAsterisk />
              <SoftAsyncPaginate
                placeholder="Select Slab..."
                size="small"
                loadOptions={(searchQuery, loadedOptions, additional) =>
                  loadTaxSlabData(searchQuery, loadedOptions, additional)
                }
                additional={{ page: 1 }} // Start with the first page
                onChange={(option) => {
                  if (option) {
                    // Update the selected slab type and subtype
                    setSelectedSlabId(option?.value);
                    setSelectedSlabType(option?.type);
                    setSelectedSlabSubType(option?.subType);
                  } else {
                    // Reset type and subtype if no option is selected
                    setSelectedSlabType('');
                    setSelectedSlabSubType('');
                  }
                }}
                isClearable
                menuPortalTarget={document.body}
              />
            </Grid>
            {selectedSlabType && (
              <Grid item lg={2} sm={6} md={2} style={{ marginTop: '40px' }}>
                <Typography className="product-new-details-gst-typo">
                  Type: <span className="product-new-details-gst-typo-value">{selectedSlabType}</span>
                </Typography>
              </Grid>
            )}
            {selectedSlabSubType && (
              <Grid item lg={2} sm={6} md={2} style={{ marginTop: '40px' }}>
                <Typography className="product-new-details-gst-typo">
                  Sub-Type: <span className="product-new-details-gst-typo-value">{selectedSlabSubType}</span>
                </Typography>
              </Grid>
            )}
          </Grid>
          <form>
            {categoryMappingData.map((form) => (
              <Grid container spacing={1} key={form.id} style={{ marginBottom: '15px' }}>
                <Grid item xs={12} md={5} lg={3.7} className="products-new-department-each-field">
                  <label className="products-department-new-form-label">Level 1</label>
                  {/* <SoftSelect
                    placeholder="Select category..."
                    size="small"
                    options={mainCategoryOptions}
                    onChange={(option) => {
                      setSelectedMainCategory(option.value);
                      handleCategoryMapping(form.id, option.value, 'category');
                    }}
                  /> */}
                  <SoftAsyncPaginate
                    placeholder="Select category..."
                    size="small"
                    loadOptions={(searchQuery, loadedOptions, additional) =>
                      loadMainCategoryOptions(searchQuery, loadedOptions, additional)
                    }
                    additional={{ page: 1 }} // Start with the first page
                    value={mainCategoryOptions?.find((option) => option.value === selectedMainCategory)}
                    onChange={(option) => {
                      setSelectedMainCategory(option?.value);
                      handleCategoryMapping(form.id, option?.value, 'category');
                    }}
                    isClearable
                    menuPortalTarget={document.body}
                  />
                </Grid>
                <Grid item xs={12} md={5} lg={3.7} className="products-new-department-each-field">
                  <label className="products-department-new-form-label">Level 2</label>
                  <SoftSelect
                    placeholder="Select class..."
                    size="small"
                    options={level1CategoryOptions}
                    onChange={(option) => {
                      setSelectedLevel1Category(option.value);
                      handleCategoryMapping(form.id, option.value, 'class');
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={5} lg={3.7} className="products-new-department-each-field">
                  <label className="products-department-new-form-label">Level 3</label>
                  <SoftSelect
                    placeholder="Select sub-class..."
                    size="small"
                    options={level2CategoryOptions}
                    onChange={(option) => {
                      setSelectedLevel2Category(option.value);
                      handleCategoryMapping(form.id, option.value, 'subClass');
                    }}
                  />
                </Grid>
                {/* <Grid item xs={12} md={5} lg={2} className="products-new-department-each-field">
                  <label className="products-department-new-form-label">HSN Code</label>
                  <Autocomplete
                    multiple
                    options={gstOptions}
                    onChange={(event, value) => handleCategoryMapping(form.id, value, 'hsnCode')}
                    size="small"
                    getOptionLabel={(option) => option.label}
                    renderInput={(params) => <TextField {...params} placeholder="Select..." />}
                  />
                </Grid> */}
                {/* {selectedDomesticTax.map((item) => (
                  <Grid item xs={12} md={5} lg={2} className="products-new-department-each-field" key={item}>
                    <label className="products-department-new-form-label">{item} %</label>

                    <Autocomplete
                      multiple
                      options={gstOptions} // Add "All" option
                      type="number"
                      placeholder="Enter..."
                      value={form.dynamicFields[item.toLowerCase()] || []}
                      size="small"
                      getOptionLabel={(option) => option.label}
                      renderInput={(params) => <TextField {...params} placeholder="Select..." />}
                      onChange={(event, value) => handleDynamicFieldChange(form.id, item.toLowerCase(), value)}
                    />
                  </Grid>
                ))} */}

                <Grid item lg={0.5}>
                  {categoryMappingData.length > 1 && (
                    <CloseIcon
                      onClick={() => removeCategoryMapping(form.id)}
                      style={{ color: 'red', fontSize: '18px', marginTop: '40px', cursor: 'pointer' }}
                    />
                  )}
                </Grid>
              </Grid>
            ))}
            <Typography type="button" onClick={addCategoryMapping} className="products-new-department-addmore-btn-2">
              + Add more
            </Typography>
          </form>
        </SoftBox>

        <SoftBox display="flex" justifyContent="flex-end" mt={4}>
          <SoftBox display="flex">
            <SoftButton
              className="vendor-second-btn"
              onClick={() => {
                navigate(-1);
              }}
            >
              Cancel
            </SoftButton>
            <SoftBox ml={2}>
              <SoftButton color="info" className="vendor-add-btn" onClick={handleCreateTaxMapping}>
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
            </SoftBox>
          </SoftBox>
        </SoftBox>
      </div>
    </DashboardLayout>
  );
};

export default CategoryTaxMapping;
