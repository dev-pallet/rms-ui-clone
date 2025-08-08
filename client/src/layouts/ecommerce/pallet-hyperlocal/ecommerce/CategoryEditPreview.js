import { Box, Card, Grid, InputLabel } from '@mui/material';
import { categoryFilter, getAllMainCategory, getCategoryList } from '../../../../config/Services';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import React, { useEffect, useState } from 'react';
import SoftBox from '../../../../components/SoftBox';
import SoftButton from '../../../../components/SoftButton';
import SoftTypography from '../../../../components/SoftTypography';

const CategoryEditPreview = () => {
  const navigate = useNavigate();
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const [createdCategory, setCreatedCategory] = useState({});
  const [category, setCategory] = useState([]);
  const [ilteredCategory, setFilteredCateory] = useState([]);

  const handleNew = () => {
    if (createdCategory?.categoryViewId) {
      navigate(`/pallet-hyperlocal/customize/categories/${createdCategory?.categoryViewId}`);
    } else {
      navigate('/pallet-hyperlocal/customize/categories');
    }
  };

  const getCategory = () => {
    const payload = {
      page: 1,
      pageSize: 50,
      type: ['APP'],
      sourceId: [orgId],
      sourceLocationId: [locId],
      active: [true],
    };

    getAllMainCategory(payload)
      .then((res) => {
        const d_img = 'https://i.imgur.com/dL4ScuP.png';

        const data = res?.data?.data?.results || [];
        const categoryOptions = data?.map((item) => ({
          id: item?.mainCategoryId,
          value: item?.categoryName,
          label: item?.categoryName,
          image: item?.categoryImage || d_img,
        }));
        setCategory(categoryOptions || []);
      })
      .catch((err) => {
        showSnackbar("Failed to fetch Categories" , "error")
      });
  };

  useEffect(() => {
    getCategory();
  }, []);

  useEffect(() => {
    const payload = {
      page: 1,
      pageSize: 10,
      sourceId: [orgId],
      sourceLocationId: [locId],

      sort: {
        creationDateSortOption: 'DESC',
        tagPriority: 'DESC',
      },
    };
    categoryFilter(payload)
      .then((res) => {
        setCreatedCategory(res?.data?.data?.data?.data[0]);
        // navigate('/pallet-hyperlocal/customize/categories/preview');
      })
      .catch((err) => {});
  }, []);

  useEffect(() => {
    if (createdCategory || category) {
      const filteredCategory = category?.filter((categoryItem) => {
        const matchingCreatedCategory = createdCategory?.categoryData?.find((createdCategoryItem) => {
          return createdCategoryItem.categoryId === categoryItem.id;
        });

        return matchingCreatedCategory !== undefined;
      });
      setFilteredCateory(filteredCategory);
    }
  }, [createdCategory, category]);

  return (
    <DashboardLayout>
      <DashboardNavbar prevLink={true} />
      <Box
        className="search-bar-filter-container"
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '10px' }}
      >
        {/* <Card
          style={{
            padding: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
          }}
        > */}
        <SoftBox style={{ display: 'flex', alignItems: 'center' }}>
          <SoftTypography style={{ color: 'white', fontSize: '1rem', marginInline: '5px' }}>
            Available Categories
          </SoftTypography>
        </SoftBox>
        <SoftBox style={{ marginLeft: 'auto' }}>
          <SoftButton variant="solidWhiteBackground" onClick={handleNew}>
            + New
          </SoftButton>
        </SoftBox>
        {/* </Card> */}
      </Box>
      <br />

      {ilteredCategory.length ? (
        <Card style={{ padding: '20px' }}>
          <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#344767' }}>Categories </InputLabel>
          <div container spacing={0} className="category-grid-box" style={{ marginTop: '10px' }}>
            {ilteredCategory?.map((e) => (
              <div
                key={e.id}
                draggable="true"
                //   onDragStart={(event) => handleDragStart(event, e)}
                //   onDragEnd={handleDragEnd}
                //   onDragOver={handleDragOver}
                //   onDrop={(event) => handleDrop(event, e)}
                style={{ cursor: 'grab' }}
              >
                <Grid item xs={2} style={{ transform: 'scale(0.85)' }}>
                  <div className="category-image-container">
                    <img className="category-img" src={e?.image} alt="" />
                  </div>
                  <div>
                    <h3 className="category-title">{e?.label}</h3>
                  </div>
                </Grid>
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <Card style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '15px' }}>
          <img
            src="https://www.simsnd.in/assets/admin/no_data_found.png"
            alt="no data found"
            style={{
              minWidth: '150px',
              maxWidth: '350px',
              borderRadius: '15px',
            }}
          />
        </Card>
      )}
    </DashboardLayout>
  );
};

export default CategoryEditPreview;
