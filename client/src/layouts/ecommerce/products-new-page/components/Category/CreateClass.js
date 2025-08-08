import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../examples/Navbars/DashboardNavbar';
import { useLocation, useNavigate } from 'react-router-dom';
import SoftBox from '../../../../../components/SoftBox';
import { CircularProgress, Grid, Typography } from '@mui/material';
import SoftInput from '../../../../../components/SoftInput';
import CloseIcon from '@mui/icons-material/Close';
import SoftButton from '../../../../../components/SoftButton';
import { useSnackbar } from '../../../../../hooks/SnackbarProvider';
import {
  createLevel1Category,
  editLevel1Category,
  getAllLevel1Category,
  getAllLevel1CategoryAndMain,
  getAllMainCategory,
} from '../../../../../config/Services';
import SoftAsyncPaginate from '../../../../../components/SoftSelect/SoftAsyncPaginate';

const CreateClass = () => {
  const location1 = useLocation();
  const showSnackBar = useSnackbar();
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);

  const getQueryParams = () => {
    const params = new URLSearchParams(location1.search);
    const classId = params.get('classId');
    return { classId };
  };

  const { classId } = getQueryParams();

  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const user_details = localStorage.getItem('user_details');
  const user_name = localStorage.getItem('user_name');
  const AppAccountId = localStorage.getItem('AppAccountId');
  const uidx = JSON.parse(user_details).uidx;

  const [classData, setClassData] = useState([
    {
      id: 1,
      mainCategoryId: '',
      mainCategoryName: '',
      className: '',
      description: '',
      classCode: '',
      isNew: true,
    },
  ]);

  const handleClassChange = (id, name, value) => {
    setClassData(
      classData.map((form) =>
        form.id === id
          ? name === 'category'
            ? { ...form, mainCategoryId: value?.value, mainCategoryName: value?.label }
            : { ...form, [name]: value }
          : form,
      ),
    );
  };

  const addClass = () => {
    setClassData([
      ...classData,
      {
        id: classData.length + 1,
        mainCategoryName: '',
        className: '',
        description: '',
        classCode: '',
        isNew: true,
        mainCategoryId: '',
      },
    ]);
  };

  const removeClass = (id) => {
    setClassData(classData.filter((form) => form.id !== id));
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

  const handleLevel1CategoryData = () => {
    const isAnyNameEmpty = classData.some((data) => !data.className.trim());

    if (isAnyNameEmpty) {
      showSnackBar('Please provide class name for all entries', 'error');
      return;
    }
    setLoader(true);
    const payload = classData
      .filter((category) => category.isNew)
      .map((data) => ({
        mainCategoryId: data?.mainCategoryId,
        categoryImage: null,
        categoryPriority: 0,
        categoryCode: data?.classCode,
        categoryDescription: data?.description,
        categoryName: data?.className,
        accountId: AppAccountId,
        sourceId: orgId,
        sourceLocationId: locId,
        sourceType: 'RETAIL',
        createdBy: uidx,
        createdByName: user_name,
        type: 'POS',
      }));

    createLevel1Category(payload)
      .then((res) => {
        if (res?.data?.data?.message === 'Success' && res?.data?.data?.es === 0) {
          setLoader(false);
          showSnackBar('level 1 category created successfully', 'success');
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

  const getLevel1Data = () => {
    if (classId) {
      const payload = {
        page: 1,
        pageSize: 10,
        level1Id: [classId],
        sourceId: [orgId],
        sourceLocationId: [locId],
        type: ['POS'],
      };
      getAllLevel1CategoryAndMain(payload)
        .then((res) => {
          const results = res?.data?.data?.categoryLevel1Responses;
          const data = results?.map((item, index) => ({
            id: index + 1,
            value: item?.level1Id,
            label: item?.categoryName,
            mainCategoryId: item?.mainCategoryId,
            mainCategoryName: item?.mainCategoryName,
            isNew: false,
            className: item?.categoryName,
            description: item?.categoryDescription,
            classCode: item?.categoryCode,
          }));
          setClassData(
            data.length > 0
              ? data
              : [
                  {
                    id: Date.now(),
                    className: '',
                    description: '',
                    classCode: '',
                    isNew: true,
                  },
                ],
          );
        })
        .catch(() => {});
    }
  };

  useEffect(() => {
    getLevel1Data();
  }, [classId]);

  const handleClassEdit = () => {
    const isAnyNameEmpty = classData.some((data) => !data.className.trim());

    if (isAnyNameEmpty) {
      showSnackBar('Please provide category name for all entries', 'error');
      return;
    }
    const categoryToEdit = classData[0];
    const payload = {
      categoryImage: '',
      categoryPriority: 0,
      categoryCode: categoryToEdit?.classCode,
      categoryDescription: categoryToEdit?.description,
      categoryName: categoryToEdit?.className,
      mainCategoryId: categoryToEdit?.mainCategoryId,
      type: 'POS',
      accountId: AppAccountId,
      sourceId: orgId,
      sourceLocationId: locId,
      sourceType: 'RETAIL',
      updatedBy: uidx,
      updatedByName: user_name,
      level1Id: classId,
    };
    editLevel1Category(payload)
      .then((res) => {
        if (res?.data?.data?.message === 'Success' && res?.data?.data?.es === 0) {
          setLoader(false);
          showSnackBar('Class Updated', 'success');
          navigate('/products/department');
        } else {
          showSnackBar('some Error occured', 'error');
        }
        getLevel1Data();
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
            {classData.map((form) => (
              <Grid container spacing={2} key={form.id} style={{ marginBottom: '15px' }}>
                <Grid item xs={12} md={5} lg={3} className="products-new-department-each-field">
                  <label className="products-department-new-form-label">Main Category name</label>
                  <SoftAsyncPaginate
                    className="all-products-filter-soft-input-box"
                    placeholder="Select main category..."
                    loadOptions={loadMainCategoriesOptions}
                    additional={{ page: 1 }}
                    value={form.mainCategoryId ? { value: form.mainCategoryId, label: form.mainCategoryName } : null}
                    onChange={(selectedOption) => handleClassChange(form.id, 'category', selectedOption)}
                    isClearable
                    size="small"
                    menuPortalTarget={document.body}
                  />
                </Grid>
                <Grid item xs={12} md={5} lg={3} className="products-new-department-each-field">
                  <label className="products-department-new-form-label">Class name</label>
                  <SoftInput
                    type="text"
                    name="className"
                    placeholder="Enter class name..."
                    size="small"
                    value={form.className}
                    onChange={(e) => handleClassChange(form.id, e.target.name, e.target.value)}

                    // className="products-department-new-form-input"
                  />
                </Grid>
                <Grid item xs={12} md={5} lg={3} className="products-new-department-each-field">
                  <label className="products-department-new-form-label">Description</label>
                  <SoftInput
                    type="text"
                    name="description"
                    placeholder="Enter class desc..."
                    size="small"
                    value={form.description}
                    onChange={(e) => handleClassChange(form.id, e.target.name, e.target.value)}

                    // className="products-department-new-form-input"
                  />
                </Grid>
                <Grid item xs={12} md={5} lg={2} className="products-new-department-each-field">
                  <label className="products-department-new-form-label">Class code</label>
                  <SoftInput
                    type="text"
                    name="classCode"
                    placeholder="Enter class code"
                    value={form.classCode}
                    size="small"
                    onChange={(e) => handleClassChange(form.id, e.target.name, e.target.value)}

                    // className="products-department-new-form-input"
                  />
                </Grid>

                {classData.length > 1 && form.isNew && (
                  <Grid item lg={1}>
                    <CloseIcon
                      onClick={() => removeClass(form.id)}
                      style={{ color: 'red', fontSize: '18px', marginTop: '40px', cursor: 'pointer' }}
                    />
                  </Grid>
                )}
              </Grid>
            ))}
            {!classId && (
              <Typography type="button" onClick={addClass} className="products-new-department-addmore-btn">
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
                onClick={classId ? handleClassEdit : handleLevel1CategoryData}
              >
                {loader ? (
                  <CircularProgress
                    size={18}
                    sx={{
                      color: '#fff',
                    }}
                  />
                ) : classId ? (
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

export default CreateClass;
