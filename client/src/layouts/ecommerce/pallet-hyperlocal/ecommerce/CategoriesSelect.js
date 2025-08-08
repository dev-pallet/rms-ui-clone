import { Autocomplete, Box, Card, Grid, InputLabel, TextField } from '@mui/material';
import { categoryB2CCreation, categoryB2CEdit, getAllMainCategory, getCategoryList } from '../../../../config/Services';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import React, { useEffect, useState } from 'react';
import SoftBox from '../../../../components/SoftBox';
import SoftButton from '../../../../components/SoftButton';
import SoftInput from '../../../../components/SoftInput';
import SoftSelect from '../../../../components/SoftSelect';
import SoftTypography from '../../../../components/SoftTypography';
import { useSnackbar } from '../../../../hooks/SnackbarProvider';

const CategoriesSelect = () => {
  const showSnackbar = useSnackbar()
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const user_details = localStorage.getItem('user_details');
  const uidx = JSON.parse(user_details).uidx;
  const [selectedCategoryOptionsList, setSelectedCategoryOptionsList] = useState([]);
  const [category, setCategory] = useState([]);
  const [draggedElement, setDraggedElement] = useState(null);
  const [displayPage, setDisplayPage] = useState('');
  const [listedOn, setListedOn] = useState([]);

  const navigate = useNavigate();
  const { categoryId } = useParams();
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

  const handleDragStart = (e, element) => {
    setDraggedElement(element);
  };

  const handleDragEnd = () => {
    setDraggedElement(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleListedOn = (selectedList) => {
    setListedOn(selectedList);
  };

  const handleDrop = (e, targetElement) => {
    const updatedList = [...selectedCategoryOptionsList];
    const draggedIndex = updatedList.findIndex((e) => e.id === draggedElement.id);
    const targetIndex = updatedList.findIndex((e) => e.id === targetElement.id);
    [updatedList[draggedIndex], updatedList[targetIndex]] = [updatedList[targetIndex], updatedList[draggedIndex]];
    setSelectedCategoryOptionsList(updatedList);
    setDraggedElement(null);
  };

  const handleSelectCategory = (selectedOptions) => {
    setSelectedCategoryOptionsList(selectedOptions);
  };

  const createNewCategory = () => {
    const catPayload = {
      categoryData: selectedCategoryOptionsList?.map((e, index) => ({
        categoryId: e?.id,
        categoryName: e?.value,
        categoryPriority: index,
      })),
      categoryType: 'Main Category',
      page: displayPage || '',
      listedOn: listedOn?.map((item) => item?.value) || [],
      sourceId: orgId,
      sourceLocationId: locId,
      createdBy: uidx,
    };

    categoryB2CCreation(catPayload)
      .then((res) => {
        navigate('/pallet-hyperlocal/customize/categories/preview');
      })
      .catch((err) => {});
  };
  const editCategoryId = () => {
    const payload = {
      categoryViewId: categoryId,
      categoryData: selectedCategoryOptionsList?.map((e, index) => ({
        categoryId: e?.id,
        categoryName: e?.value,
        categoryPriority: index,
      })),
      page: displayPage || '',
      listedOn: listedOn?.map((item) => item?.value) || [],
      sourceId: orgId,
      sourceLocationId: locId,

      modifiedBy: uidx,
      // "isDeleted": true
    };
    categoryB2CEdit(payload)
      .then((res) => {
        navigate('/pallet-hyperlocal/customize/categories/preview');
      })
      .catch((err) => {});
  };
  const handleSaveCategory = () => {
    if (categoryId) {
      editCategoryId();
    } else {
      createNewCategory();
    }
  };
  return (
    <DashboardLayout>
      <DashboardNavbar prevLink={true} />
      <Card>
        <Box className="search-bar-filter-container">
          <SoftTypography style={{ color: 'white', fontSize: '0.95rem' }}>Select Categories </SoftTypography>
        </Box>
        <Box style={{ padding: '20px 15px' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <SoftTypography style={{ fontSize: '0.8rem', marginTop: '5px' }}>Display page</SoftTypography>

              <SoftInput
                type="text"
                value={displayPage}
                placeholder="Enter page to display"
                onChange={(e) => setDisplayPage(e.target.value)}
              ></SoftInput>
            </Grid>

            <Grid item xs={12} md={6}>
              <SoftTypography style={{ fontSize: '0.8rem', marginTop: '5px' }}> Listed on</SoftTypography>

              <SoftSelect
                menuPortalTarget={document.body}
                id="status"
                placeholder="Display on"
                options={[
                  { value: 'B2C', label: 'B2C' },
                  { value: 'B2B', label: 'B2B' },
                  { value: 'RMS', label: 'RMS' },
                  { value: 'WMS', label: 'WMS' },
                  { value: 'VENDOR', label: 'VENDOR' },
                ]}
                isMulti={true}
                value={listedOn}
                onChange={handleListedOn}
              ></SoftSelect>
            </Grid>
          </Grid>
          <br />
          <SoftBox>
            <Autocomplete
              multiple
              options={category}
              onChange={(_, newvalue) => handleSelectCategory(newvalue)}
              value={selectedCategoryOptionsList}
              getOptionLabel={(option) => option.label}
              filterSelectedOptions
              renderInput={(params) => <TextField {...params} placeholder="Select Categories to Display" />}
            />
          </SoftBox>

          <SoftBox style={{ textAlign: 'right', marginTop: '10px' }}>
            <SoftButton color="info" onClick={handleSaveCategory} style={{ backgroundColor: '#0562FB' }}>
              Save
            </SoftButton>
          </SoftBox>
        </Box>
      </Card>
      <br />
      <Card style={{ padding: '20px' }}>
        <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>Categories Preview</InputLabel>
        <div container spacing={0} className="category-grid-box" style={{ marginTop: '10px' }}>
          {selectedCategoryOptionsList?.map((e) => (
            <div
              key={e.id}
              draggable="true"
              onDragStart={(event) => handleDragStart(event, e)}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDrop={(event) => handleDrop(event, e)}
              style={{ cursor: 'grab' }}
            >
              <Grid item xs={2} style={{ transform: 'scale(0.85)' }}>
                <div className="category-image-container">
                  <img className="category-img" src={e.image} alt="" />
                </div>
                <div>
                  <h3 className="category-title">{e.label}</h3>
                </div>
              </Grid>
            </div>
          ))}
        </div>
      </Card>
      <SoftTypography
        style={{
          fontSize: '0.9rem',
          margin: '15px',
          color: 'gray',
          textAlign: 'center',
          backgroundColor: 'ghostwhite',
          borderRadius: '10px',
          padding: '10px',
        }}
      >
        Drag and drop to effortlessly rearrange your categories and customize their order with ease!{' '}
      </SoftTypography>
    </DashboardLayout>
  );
};

export default CategoriesSelect;
