import { Card, Grid, InputLabel } from '@mui/material';
import { categoryFilter, getAllMainCategory, getCategoryList } from '../../../../../config/Services';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

const AvailableCategory = ({ setCategoryId }) => {
  const navigate = useNavigate();
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const [createdCategory, setCreatedCategory] = useState({});
  const [category, setCategory] = useState([]);
  const [filteredCategory, setFilteredCateory] = useState([]);
  const handleNew = () => {
    if (createdCategory?.categoryViewId) {
      navigate(`/pallet-hyperlocal/customize/categories/${createdCategory?.categoryViewId}`);
    } else {
      navigate('/pallet-hyperlocal/customize/categories');
    }
  };

  const getCategory = () => {
    const d_img = 'https://i.imgur.com/dL4ScuP.png';
    const payload = {
      page: 1,
      pageSize: 50,
      type: ['APP'],
      sourceId: [orgId],
      sourceLocationId: [locId],
      mainCategoryId: createdCategory?.categoryData?.map((item) => item?.categoryId),
      active: [true],
    };
    getAllMainCategory(payload)
      .then((res) => {
        const data = res?.data?.data?.results;
        const categoryOptions = data?.map((item) => {
          return {
            id: item?.mainCategoryId,
            value: item?.categoryName,
            label: item?.categoryName,
            image: item?.categoryImage || d_img,
          };
        });
        setCategory(categoryOptions);
      })
      .catch((err) => {});
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
        setCategoryId(res?.data?.data?.data?.data[0]?.categoryViewId);
        setCreatedCategory(res?.data?.data?.data?.data[0]);
        // navigate('/pallet-hyperlocal/customize/categories/preview');
      })
      .catch((err) => {});
  }, []);

  return (
    <>
      {category.length ? (
        <Card style={{ padding: '20px' }}>
          <InputLabel className="inputLabelFontStyle">Categories </InputLabel>
          <div container spacing={0} className="availableCategoryGrid">
            {category?.map((e) => (
              <div key={e.id} draggable="true" style={{ cursor: 'grab' }}>
                <Grid item xs={2} style={{ transform: 'scale(0.85)' }}>
                  <div className="category-image-container">
                    <img className="categoryDisplay-img" src={e?.image} alt="err" />
                  </div>
                  <div>
                    <h3 className="categoryDisplay-title">{e?.label}</h3>
                  </div>
                </Grid>
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <Card className="noDataFound_Align">
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
    </>
  );
};

export default AvailableCategory;
