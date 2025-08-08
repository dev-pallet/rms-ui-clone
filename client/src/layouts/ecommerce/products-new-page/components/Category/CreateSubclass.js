import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../examples/Navbars/DashboardNavbar';
import SoftBox from '../../../../../components/SoftBox';
import { CircularProgress, Grid, Typography } from '@mui/material';
import SoftInput from '../../../../../components/SoftInput';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../../../../hooks/SnackbarProvider';
import SoftButton from '../../../../../components/SoftButton';
import CloseIcon from '@mui/icons-material/Close';
import {
  createLevel2Categories,
  editLevel2Category,
  getAllLevel1Category,
  getAllLevel2Category,
  getAllLevel2CategoryAndMain,
  getAllMainCategory,
} from '../../../../../config/Services';
import SoftAsyncPaginate from '../../../../../components/SoftSelect/SoftAsyncPaginate';
import SoftSelect from '../../../../../components/SoftSelect';

const CreateSubclass = () => {
  const navigate = useNavigate();
  const showSnackBar = useSnackbar();

  const location1 = useLocation();

  const getQueryParams = () => {
    const params = new URLSearchParams(location1.search);
    const subClassId = params.get('subClassId');
    return { subClassId };
  };
  const [classOptions, setClassOptions] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');

  const [subClassData, setSubClassData] = useState([
    {
      id: 1,
      mainCategoryName: '',
      mainCategoryId: '',
      className: '',
      classId: '',
      subClassName: '',
      description: '',
      subClassCode: '',
      classOptions: [],
      isNew: true,
    },
  ]);

  const [loader, setLoader] = useState(false);

  const { subClassId } = getQueryParams();

  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const user_details = localStorage.getItem('user_details');
  const user_name = localStorage.getItem('user_name');
  const AppAccountId = localStorage.getItem('AppAccountId');
  const uidx = JSON.parse(user_details).uidx;

  const handleSubClassChange = (id, name, value) => {
    setSubClassData(
      subClassData.map((form) => {
        if (form.id === id) {
          if (name === 'category') {
            // Update main category
            const updatedForm = { ...form, mainCategoryId: value?.value, mainCategoryName: value?.label };

            // Fetch class options based on the selected main category
            const payload = {
              page: 1,
              pageSize: 50,
              mainCategoryId: [value?.value],
              type: ['POS'],
              active: [true],
            };

            getAllLevel1Category(payload).then((response) => {
              let cat = [];
              response?.data?.data?.results?.map((e) => {
                cat.push({ value: e?.level1Id, label: e?.categoryName });
              });

              // Update the form's classOptions once the data is fetched
              setSubClassData((prevState) =>
                prevState.map((form) => (form.id === id ? { ...form, classOptions: cat } : form)),
              );
            });

            return updatedForm;
          } else if (name === 'class') {
            // Update the selected class
            return { ...form, classId: value?.value, className: value?.label };
          } else {
            return { ...form, [name]: value };
          }
        }
        return form;
      }),
    );
  };

  const addSubClass = () => {
    setSubClassData([
      ...subClassData,
      {
        id: subClassData.length + 1,
        mainCategoryName: '',
        mainCategoryId: '',
        className: '',
        classId: '',
        subClassName: '',
        subClassCode: '',
        description: '',
        classOptions: [],
        isNew: true,
      },
    ]);
  };

  const removeSubClass = (id) => {
    setSubClassData(subClassData.filter((form) => form.id !== id));
  };

  const loadMainCategoriesOptions = async (searchQuery, loadedOptions, { page }) => {
    const payload = {
      page: page,
      pageSize: 50,
      sourceId: [orgId],
      sourceLocationId: [locId],
      type: ['POS'],
      sortByUpdatedDate: 'DESCENDING',
      active: [true],
    };

    try {
      const res = await getAllMainCategory(payload);
      const data = res?.data?.data?.results || [];

      const options = data?.map((item) => ({
        label: item?.categoryName,
        value: item?.mainCategoryId,
      }));

      return {
        options,
        hasMore: data?.length >= 50,
        additional: { page: page + 1 }, // Increment the page number for infinite scroll
      };
    } catch (error) {
      showSnackBar('Error fetching Level 1 categories', 'error');
      return {
        options: [],
        hasMore: false,
      };
    }
  };

  const handleLevel2Create = () => {
    const isAnyNameEmpty = subClassData.some((data) => !data.subClassName.trim());

    if (isAnyNameEmpty) {
      showSnackBar('Please provide Sub-class name for all entries', 'error');
      return;
    }
    setLoader(true);
    const newBusinessData = subClassData.filter((data) => data.isNew);
    const payload = newBusinessData?.map((item, index) => ({
      categoryImage: null,
      // mainCategoryId: item?.mainCategoryId,
      level1Id: item?.classId,
      categoryPriority: 0,
      categoryCode: item?.subClassCode,
      categoryDescription: item?.description,
      categoryName: item?.subClassName,
      accountId: AppAccountId,
      sourceId: orgId,
      sourceLocationId: locId,
      sourceType: 'RETAIL',
      createdBy: uidx,
      createdByName: user_name,
      type: 'POS',
    }));

    createLevel2Categories(payload)
      .then((res) => {
        if (res?.data?.data?.message === 'Success' && res?.data?.data?.es === 0) {
          setLoader(false);
          showSnackBar('level 2 category created successfully');
          navigate('/products/department');
        } else {
          setLoader(false);
          showSnackBar('some Error occured', 'error');
        }
      })
      .catch(() => {
        setLoader(false);
        showSnackBar('some Error occured', 'error');
      });
  };

  const getLevel2SubClass = () => {
    const paylaod = {
      page: 1,
      pageSize: 10,
      //   level1Id: [class1Category],
      level2Id: [subClassId],
      sourceId: [orgId],
      sourceLocationId: [locId],
      type: ['POS'],
    };
    getAllLevel2CategoryAndMain(paylaod)
      .then((res) => {
        const response = res?.data?.data?.categoryLevel2Responses;
        if (response.length > 0) {
          const data = response.map((e, index) => ({
            id: index + 1,
            mainCategoryName: e?.mainCategoryName,
            mainCategoryId: e?.mainCategoryId,
            className: e?.level1CategoryName,
            classId: e?.level1Id,
            subClassName: e?.level2CategoryName,
            description: e?.categoryDescription,
            subClassCode: e?.categoryCode,
            value: e?.level2Id,
            isNew: false,
          }));
          setSubClassData(
            data.length > 0
              ? data
              : [
                  {
                    id: Date.now(),
                    subClassName: '',
                    description: '',
                    subClassCode: '',
                    isNew: true,
                  },
                ],
          );
        }
      })
      .catch((err) => {});
  };

  useEffect(() => {
    getLevel2SubClass();
  }, [subClassId]);

  const handleSubClassEdit = () => {
    const isAnyNameEmpty = subClassData.some((data) => !data.subClassName.trim());

    if (isAnyNameEmpty) {
      showSnackBar('Please provide category name for all entries', 'error');
      return;
    }
    const categoryToEdit = subClassData[0];
    const payload = {
      categoryImage: '',
      level1Id: categoryToEdit?.classId,
      categoryPriority: 0,
      categoryCode: categoryToEdit?.subClassCode,
      categoryDescription: categoryToEdit?.description,
      categoryName: categoryToEdit?.subClassName,
      type: 'POS',
      level2Id: subClassId || 'NA',
      accountId: AppAccountId,
      sourceId: orgId,
      sourceLocationId: locId,
      sourceType: 'RETAIL',
      updatedBy: uidx,
      updatedByName: user_name,
    };

    editLevel2Category(payload)
      .then((res) => {
        if (res?.data?.data?.message === 'Success' && res?.data?.data?.es === 0) {
          setLoader(false);
          showSnackBar('Main Category Updated', 'success');
          navigate('/products/department');
        } else {
          showSnackBar('some Error occured', 'error');
        }
      })
      .catch(() => {
        setLoader(false);
        showSnackBar('Error while updating main category', 'error');
      });
  };

  return (
    <div>
      <DashboardLayout>
        <DashboardNavbar prevLink={true} />

        <SoftBox className="products-new-department-form-box">
          <form>
            {subClassData.map((form) => (
              <Grid container spacing={2} key={form.id} style={{ marginBottom: '15px' }}>
                <Grid item xs={12} md={5} lg={2} className="products-new-department-each-field">
                  <label className="products-department-new-form-label">Main Category Name</label>
                  <SoftAsyncPaginate
                    className="all-products-filter-soft-input-box"
                    placeholder="Select main category..."
                    loadOptions={loadMainCategoriesOptions}
                    additional={{ page: 1 }}
                    value={form.mainCategoryId ? { value: form.mainCategoryId, label: form.mainCategoryName } : null}
                    onChange={(selectedOption) => handleSubClassChange(form.id, 'category', selectedOption)}
                    isClearable
                    size="small"
                    menuPortalTarget={document.body}
                  />
                </Grid>

                <Grid item xs={12} md={5} lg={2} className="products-new-department-each-field">
                  <label className="products-department-new-form-label">Class Name</label>
                  <SoftSelect
                    className="all-products-filter-soft-input-box"
                    size="small"
                    placeholder="Select class..."
                    value={form.classId ? { value: form.classId, label: form.className } : null}
                    onChange={(option) => handleSubClassChange(form.id, 'class', option)}
                    options={form?.classOptions || []}
                  />
                </Grid>
                <Grid item xs={12} md={5} lg={2} className="products-new-department-each-field">
                  <label className="products-department-new-form-label">Sub-class Name</label>
                  <SoftInput
                    type="text"
                    name="subClassName"
                    placeholder="Enter sub-class name..."
                    size="small"
                    value={form.subClassName}
                    onChange={(e) => handleSubClassChange(form.id, 'subClassName', e.target.value)}
                    // className="products-department-new-form-input"
                  />
                </Grid>
                <Grid item xs={12} md={5} lg={3} className="products-new-department-each-field">
                  <label className="products-department-new-form-label">Description</label>
                  <SoftInput
                    type="text"
                    name="description"
                    placeholder="Enter sub-class desc..."
                    size="small"
                    value={form.description}
                    onChange={(e) => handleSubClassChange(form.id, 'description', e.target.value)}
                    // className="products-department-new-form-input"
                  />
                </Grid>
                <Grid item xs={12} md={5} lg={2} className="products-new-department-each-field">
                  <label className="products-department-new-form-label">Sub-class code</label>
                  <SoftInput
                    type="text"
                    name="subClassCode"
                    placeholder="Enter sub-class code..."
                    size="small"
                    value={form.subClassCode}
                    onChange={(e) => handleSubClassChange(form.id, 'subClassCode', e.target.value)}
                    // className="products-department-new-form-input"
                  />
                </Grid>

                {form.isNew && subClassData.length > 1 && (
                  <Grid item lg={1}>
                    <CloseIcon
                      onClick={() => removeSubClass(form.id)}
                      style={{ color: 'red', fontSize: '18px', marginTop: '40px', cursor: 'pointer' }}
                    />
                  </Grid>
                )}
              </Grid>
            ))}
            {!subClassId && (
              <Typography type="button" onClick={addSubClass} className="products-new-department-addmore-btn">
                + Add more
              </Typography>
            )}
          </form>
        </SoftBox>

        <SoftBox display="flex" justifyContent="flex-end" mt={4}>
          <SoftBox display="flex">
            <SoftButton className="vendor-second-btn" onClick={() => navigate(-1)}>
              Cancel
            </SoftButton>
            <SoftBox ml={2}>
              <SoftButton
                color="info"
                className="vendor-add-btn"
                onClick={subClassId ? handleSubClassEdit : handleLevel2Create}
              >
                {loader ? (
                  <CircularProgress
                    size={18}
                    sx={{
                      color: '#fff',
                    }}
                  />
                ) : subClassId ? (
                  <>Edit</>
                ) : (
                  <>Save</>
                )}
              </SoftButton>
            </SoftBox>
          </SoftBox>
        </SoftBox>
      </DashboardLayout>
    </div>
  );
};

export default CreateSubclass;
