import React, { useEffect, useState } from 'react';
import SoftBox from '../../../../../components/SoftBox';
import { CircularProgress, Grid, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SoftInput from '../../../../../components/SoftInput';
import SoftButton from '../../../../../components/SoftButton';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../../../../hooks/SnackbarProvider';
import { createHOCategory, editHOCategory, getAllMainCategory } from '../../../../../config/Services';

import DashboardLayout from '../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../examples/Navbars/DashboardNavbar';

const ProductCategory = () => {
  const navigate = useNavigate();
  const showSnackBar = useSnackbar();
  const [loader, setLoader] = useState(false);
  const [categoryData, setCategoryData] = useState([
    {
      id: 1,
      categoryName: '',
      description: '',
      categoryCode: '',
      isNew: true,
    },
  ]);

  const location1 = useLocation();

  const getQueryParams = () => {
    const params = new URLSearchParams(location1.search);
    const catId = params.get('catId');
    return { catId };
  };

  const { catId } = getQueryParams();

  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const user_details = localStorage.getItem('user_details');
  const user_name = localStorage.getItem('user_name');
  const AppAccountId = localStorage.getItem('AppAccountId');
  const uidx = JSON.parse(user_details).uidx;

  const handleCategoryChange = (id, e) => {
    const { name, value } = e.target;
    setCategoryData(categoryData.map((form) => (form.id === id ? { ...form, [name]: value } : form)));
  };

  const addCategory = () => {
    setCategoryData([
      ...categoryData,
      { id: categoryData.length + 1, categoryName: '', description: '', categoryCode: '', isNew: true },
    ]);
  };

  const removeCategory = (id) => {
    setCategoryData(categoryData.filter((form) => form.id !== id));
  };

  const handleCreateMainCategory = () => {
    const isAnyNameEmpty = categoryData.some((data) => !data.categoryName.trim());

    if (isAnyNameEmpty) {
      showSnackBar('Please provide category name for all entries', 'error');
      return;
    }
    setLoader(true);
    const payload = categoryData
      .filter((category) => category.isNew)
      .map((category) => ({
        categoryImage: '',
        categoryPriority: 0,
        categoryCode: category?.categoryCode,
        categoryDescription: category?.description,
        categoryName: category?.categoryName,
        type: 'POS',
        // subType: 'string',
        accountId: AppAccountId,
        sourceId: orgId,
        sourceLocationId: locId,
        sourceType: 'RETAIL',
        createdBy: uidx,
        createdByName: user_name,
      }));

    createHOCategory(payload)
      .then((res) => {
        if (res?.data?.data?.message === 'Success' && res?.data?.data?.es === 0) {
          setLoader(false);
          showSnackBar('Main Category Created', 'success');
          navigate('/products/department');
        } else {
          setLoader(false);
          showSnackBar('some Error occured', 'error');
        }
      })
      .catch(() => {
        setLoader(false);
        showSnackBar('Error while creating main category', 'error');
      });
  };

  const getMainCategory = () => {
    const payload = {
      page: 1,
      pageSize: 50,
      sourceId: [orgId],
      mainCategoryId: [catId],
      type: ['POS'],
    };
    getAllMainCategory(payload)
      .then((res) => {
        const results = res?.data?.data?.results;
        const data = results?.map((item, index) => ({
          id: index + 1,
          image: item?.categoryImage,
          value: item?.mainCategoryId,
          label: item?.categoryName || 'NA',
          description: item?.categoryDescription,
          categoryName: item?.categoryName,
          categoryCode: item?.categoryCode,
          isNew: false,
        }));
        setCategoryData(
          data.length > 0
            ? data
            : [{ id: Date.now(), categoryName: '', description: '', categoryCode: '', isNew: true }],
        );
      })
      .catch(() => {});
  };

  useEffect(() => {
    getMainCategory();
  }, [catId]);

  const handleCategoryEdit = () => {
    const isAnyNameEmpty = categoryData.some((data) => !data.categoryName.trim());

    if (isAnyNameEmpty) {
      showSnackBar('Please provide category name for all entries', 'error');
      return;
    }
    const categoryToEdit = categoryData[0];
    const payload = {
      categoryImage: '',
      categoryPriority: 0,
      categoryCode: categoryToEdit?.categoryCode,
      categoryDescription: categoryToEdit?.description,
      categoryName: categoryToEdit?.categoryName,
      type: 'POS',
      mainCategoryId: categoryToEdit?.value,
      accountId: AppAccountId,
      sourceId: orgId,
      sourceLocationId: locId,
      sourceType: 'RETAIL',
      updatedBy: uidx,
      updatedByName: user_name,
    };
    editHOCategory(payload)
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
    <DashboardLayout>
      <DashboardNavbar />
      <div>
        {/* form to fill department and subdepartment settings */}

        <SoftBox className="products-new-department-form-box">
          <form>
            {categoryData.map((form) => (
              <Grid container spacing={2} key={form.id} style={{ marginBottom: '15px' }}>
                <Grid item xs={12} md={5} lg={4} className="products-new-department-each-field">
                  <label className="products-department-new-form-label">Category name</label>
                  <SoftInput
                    type="text"
                    placeholder="Enter category name..."
                    name="categoryName"
                    value={form.categoryName}
                    size="small"
                    onChange={(e) => handleCategoryChange(form.id, e)}
                    // className="products-department-new-form-input"
                  />
                </Grid>
                <Grid item xs={12} md={5} lg={4} className="products-new-department-each-field">
                  <label className="products-department-new-form-label">Description</label>
                  <SoftInput
                    type="text"
                    placeholder="Enter category desc..."
                    name="description"
                    value={form.description}
                    size="small"
                    onChange={(e) => handleCategoryChange(form.id, e)}
                    // className="products-department-new-form-input"
                  />
                </Grid>
                <Grid item xs={12} md={5} lg={3} className="products-new-department-each-field">
                  <label className="products-department-new-form-label">Category code</label>
                  <SoftInput
                    type="text"
                    name="categoryCode"
                    placeholder="Enter category code..."
                    value={form.categoryCode}
                    size="small"
                    onChange={(e) => handleCategoryChange(form.id, e)}
                    // className="products-department-new-form-input"
                  />
                </Grid>

                {form.isNew && categoryData.length > 1 && (
                  <Grid item lg={1}>
                    <CloseIcon
                      onClick={() => removeCategory(form.id)}
                      style={{ color: 'red', fontSize: '18px', marginTop: '40px', cursor: 'pointer' }}
                    />
                  </Grid>
                )}
              </Grid>
            ))}
            {!catId && (
              <Typography type="button" onClick={addCategory} className="products-new-department-addmore-btn">
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
                onClick={catId ? handleCategoryEdit : handleCreateMainCategory}
              >
                {loader ? (
                  <CircularProgress
                    size={18}
                    sx={{
                      color: '#fff',
                    }}
                  />
                ) : catId ? (
                  <>Edit</>
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

export default ProductCategory;
