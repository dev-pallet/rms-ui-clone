import { Card, Grid, InputLabel } from '@mui/material';
import { categoryFilter, getAllMainCategory, getCategoryList } from '../../../../../config/Services';
import React, { useEffect, useState } from 'react';
import SoftButton from '../../../../../components/SoftButton';

const SelectAvailableCategories = ({ setContentTypeId }) => {
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const [createdCategory, setCreatedCategory] = useState({});
  const [category, setCategory] = useState([]);
  const [filteredCategory, setFilteredCateory] = useState([]);

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
  }, [createdCategory]);

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

  return (
    <div style={{ padding: '15px' }}>
      {category.length ? (
        <Card style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#344767' }}>Categories </InputLabel>
            <SoftButton
              color="secondary"
              style={{ float: 'right' }}
              onClick={() =>
                setContentTypeId([{ type: 'CATEGORY', idOfData: createdCategory?.categoryViewId, priority: '' }])
              }
            >
              Select
            </SoftButton>
          </div>

          <div container spacing={0} style={{ marginTop: '10px', display: 'flex', flexWrap: 'wrap' }}>
            {category?.map((e) => (
              <div key={e.id} draggable="true" style={{ cursor: 'grab' }}>
                <Grid item xs={2} style={{ transform: 'scale(0.85)' }}>
                  <div className="category-image-container">
                    <img className="category-img" src={e?.image} alt="err" />
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
    </div>
  );
};

export default SelectAvailableCategories;
