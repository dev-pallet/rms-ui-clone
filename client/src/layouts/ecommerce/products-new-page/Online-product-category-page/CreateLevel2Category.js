import React, { useEffect, useRef, useState } from 'react';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import SoftBox from '../../../../components/SoftBox';
import { CircularProgress, Grid, IconButton, Typography } from '@mui/material';
import SoftInput from '../../../../components/SoftInput';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../../../hooks/SnackbarProvider';
import SoftButton from '../../../../components/SoftButton';
import {
  createImageUrl,
  createLevel1Category,
  editLevel1Category,
  getAllLevel1Category,
  getAllLevel1CategoryAndMain,
  getAllMainCategory,
} from '../../../../config/Services';
import SoftAsyncPaginate from '../../../../components/SoftSelect/SoftAsyncPaginate';

const CreateLevel2Category = () => {
  const navigate = useNavigate();
  const showSnackBar = useSnackbar();
  const [loader, setLoader] = useState(false);

  const [level2Data, setLevel2Data] = useState([
    {
      id: 1,
      mainCategoryName: '',
      mainCategoryId: '',
      level2Name: '',
      image: '',
      description: '',
      isNew: true,
    },
  ]);

  const location1 = useLocation();

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

  const fileInputRefLevel2 = useRef(null);

  const handleChangeLevel2 = (id, name, value) => {
    setLevel2Data(
      level2Data.map((form) =>
        form.id === id
          ? name === 'level1'
            ? { ...form, mainCategoryId: value?.value, mainCategoryName: value?.label }
            : { ...form, [name]: value }
          : form,
      ),
    );
  };

  const addFormLevel2 = () => {
    setLevel2Data([
      ...level2Data,
      {
        id: level2Data.length + 1,
        level2Name: '',
        image: '',
        isNew: true,
        description: '',
        mainCategoryName: '',
        mainCategoryId: '',
      },
    ]);
  };

  const removeFormLevel2 = (id) => {
    setLevel2Data(level2Data.filter((form) => form.id !== id));
  };

  const handleImageChange = (level, id, file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      let imageBase64 = reader.result; // Base64 string of the image

      if (level === 'Level2') {
        setLevel2Data(level2Data.map((form) => (form.id === id ? { ...form, image: imageBase64 } : form)));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleImageClick = (level, id) => {
    let fileInputRef;
    fileInputRef = fileInputRefLevel2;

    fileInputRef.current.click();
    fileInputRef.current.onchange = (e) => {
      if (e.target.files.length > 0) {
        handleImageChange(level, id, e.target.files[0]);
      }
    };
  };

  const removeDataURLPrefix = (encoded) => {
    if (encoded.startsWith('data:image/png;base64,')) {
      return encoded.replace('data:image/png;base64,', '');
    } else if (encoded.startsWith('data:image/jpeg;base64,')) {
      return encoded.replace('data:image/jpeg;base64,', '');
    } else {
      return encoded; // If no prefix matches, return as is
    }
  };

  const loadMainCategoriesOptions = async (searchQuery, loadedOptions, { page }) => {
    const payload = {
      page: page,
      pageSize: 50,
      sourceId: [orgId],
      sourceLocationId: [locId],
      type: ['APP'],
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
    const isAnyNameEmpty = level2Data.some((data) => !data.level2Name.trim());

    if (isAnyNameEmpty) {
      showSnackBar('Please provide Level 2 class name for all entries', 'error');
      return;
    }

    setLoader(true);

    const createCategoryPayload = (imageUrls = {}) => {
      const payload = level2Data
        .filter((category) => category.isNew)
        .map((data, index) => ({
          mainCategoryId: data?.mainCategoryId,
          categoryImage: imageUrls[`category2Image${index + 1}`] || '', // Use image URL if available, else empty
          categoryPriority: 0,
          type: 'APP',
          categoryCode: '',
          categoryDescription: data?.description,
          categoryName: data?.level2Name,
          accountId: AppAccountId,
          sourceId: orgId,
          sourceLocationId: locId,
          sourceType: 'RETAIL',
          createdBy: uidx,
          createdByName: user_name,
        }));

      createLevel1Category(payload)
        .then((res) => {
          if (res?.data?.data?.message === 'Success' && res?.data?.data?.es === 0) {
            setLoader(false);
            showSnackBar('Level 2 category created successfully', 'success');
            navigate('/products/online-category');
          } else {
            setLoader(false);
            showSnackBar('Error while creating category', 'error');
          }
        })
        .catch(() => {
          setLoader(false);
          showSnackBar('Error while creating category', 'error');
        });
    };

    // Check if any image is present in the level2Data
    const hasImages = level2Data.some((item) => item.image);

    if (hasImages) {
      const imagePayload = {
        uploadType: 'Category2',
        images: level2Data.reduce((acc, item, index) => {
          if (item.image) {
            acc[`category2Image${index + 1}`] = removeDataURLPrefix(item.image);
          }
          return acc;
        }, {}),
      };

      // Upload images if present
      createImageUrl(imagePayload)
        .then((res) => {
          const imageUrls = res?.data?.data?.data || {};
          createCategoryPayload(imageUrls); // Proceed with image URLs
        })
        .catch(() => {
          setLoader(false);
          showSnackBar('Error while uploading images', 'error');
        });
    } else {
      // No images to upload, proceed to create category directly
      createCategoryPayload();
    }
  };

  const getAllLevel1Categories = () => {
    const payload = {
      page: 1,
      pageSize: 10,
      level1Id: [classId],
      sourceId: [orgId],
      sourceLocationId: [locId],
      type: ['APP'],
    };
    getAllLevel1CategoryAndMain(payload)
      .then((res) => {
        const results = res?.data?.data?.categoryLevel1Responses;
        const data = results?.map((item) => ({
          value: item?.level1Id,
          label: item?.categoryName,
          mainCategoryId: item?.mainCategoryId,
          mainCategoryName: item?.mainCategoryName,
          level2Name: item?.categoryName,
          description: item?.categoryDescription,
          image: item?.categoryImage,
          isNew: false,
        }));
        setLevel2Data(
          data.length > 0
            ? data
            : [{ id: Date.now(), categoryName: '', level1Name: '', description: '', image: '', isNew: true }],
        );
      })
      .catch(() => {});
  };

  useEffect(() => {
    getAllLevel1Categories();
  }, [classId]);

  const handleClassEdit = () => {
    const isAnyNameEmpty = level2Data.some((data) => !data.level2Name.trim());

    if (isAnyNameEmpty) {
      showSnackBar('Please provide category name for all entries', 'error');
      return;
    }

    const categoryToEdit = level2Data[0];

    const editCategoryPayload = (imageUrls = {}) => {
      const payload = {
        categoryImage: imageUrls[`category2Image0`] || '',
        categoryPriority: 0,
        // categoryCode: categoryToEdit?.classCode,
        categoryDescription: categoryToEdit?.description,
        categoryName: categoryToEdit?.level2Name,
        type: 'APP',
        mainCategoryId: categoryToEdit?.mainCategoryId,
        accountId: AppAccountId,
        sourceId: orgId,
        sourceLocationId: locId,
        sourceType: 'RETAIL',
        updatedBy: uidx,
        updatedByName: user_name,
        level1Id: categoryToEdit?.value,
      };

      editLevel1Category(payload)
        .then((res) => {
          if (res?.data?.data?.message === 'Success' && res?.data?.data?.es === 0) {
            setLoader(false);
            showSnackBar('Level 2 Category Updated', 'success');
            navigate('/products/online-category');
          } else {
            showSnackBar('Some error occurred', 'error');
          }
        })
        .catch(() => {
          setLoader(false);
          showSnackBar('Error while updating level 2 category', 'error');
        });
    };

    // Check if an image is present for the category being edited
    if (categoryToEdit?.image) {
      const imagePayload = {
        uploadType: 'Category2',
        images: {
          [`category2Image0`]: removeDataURLPrefix(categoryToEdit?.image), // Only include the specific image being edited
        },
      };

      // Upload image if present
      createImageUrl(imagePayload)
        .then((res) => {
          const imageUrls = res?.data?.data?.data || {};
          editCategoryPayload(imageUrls); // Proceed with image URL
        })
        .catch((err) => {
          setLoader(false);
          showSnackBar('Error while uploading image', 'error');
        });
    } else {
      // No image to upload, proceed to edit category directly
      editCategoryPayload();
    }
  };

  return (
    <div>
      <DashboardLayout>
        <DashboardNavbar prevLink={true} />
        <SoftBox className="products-new-department-form-box">
          <form>
            {level2Data.map((form) => (
              <Grid container spacing={2} key={form.id} style={{ marginBottom: '15px' }}>
                <Grid item xs={12} md={5} lg={3} className="products-new-department-each-field">
                  <label className="products-department-new-form-label">Level 1 category Name</label>
                  <SoftAsyncPaginate
                    className="all-products-filter-soft-input-box"
                    placeholder="Select main category..."
                    loadOptions={loadMainCategoriesOptions}
                    additional={{ page: 1 }}
                    value={form.mainCategoryId ? { value: form.mainCategoryId, label: form.mainCategoryName } : null}
                    onChange={(selectedOption) => handleChangeLevel2(form.id, 'level1', selectedOption)}
                    isClearable
                    size="small"
                    menuPortalTarget={document.body}
                  />
                </Grid>
                <Grid item xs={12} md={5} lg={2} className="products-new-department-each-field">
                  <label className="products-department-new-form-label">Level 2 category Name</label>
                  <SoftInput
                    placeholder="Enter Level 2 name..."
                    type="text"
                    name="level2Name"
                    value={form.level2Name}
                    size="small"
                    onChange={(e) => handleChangeLevel2(form.id, 'level2Name', e.target.value)}
                    // className="products-department-new-form-input"
                  />
                </Grid>
                <Grid item xs={12} md={5} lg={3} className="products-new-department-each-field">
                  <label className="products-department-new-form-label">Level 2 category description</label>
                  <SoftInput
                    placeholder="Enter Level 2 description..."
                    type="text"
                    name="level2Name"
                    value={form.description}
                    size="small"
                    onChange={(e) => handleChangeLevel2(form.id, 'description', e.target.value)}
                    // className="products-department-new-form-input"
                  />
                </Grid>
                {form.isNew && level2Data.length >= 1 && (
                  <Grid item xs={12} md={5} lg={3} className="products-new-department-each-field">
                    <label className="products-department-new-form-label">Image</label>
                    <div className="products-new-department-right-bar" id="products-image-show">
                      {!form.image && (
                        <button type="button" onClick={() => handleImageClick('Level2', form.id)}>
                          Upload Image <CloudUploadIcon sx={{ marginLeft: '8px' }} fontSize="small" />{' '}
                        </button>
                      )}
                      {form.image && <img src={form.image} style={{ width: '40px' }} />}
                    </div>
                  </Grid>
                )}

                {!form.isNew && (
                  <Grid item xs={12} md={5} lg={3} className="products-new-department-each-field">
                    {form.image ? (
                      <div
                        style={{
                          position: 'relative',
                          display: 'inline-block',
                          marginLeft: '10px',
                          marginTop: '20px',
                        }}
                      >
                        <img src={form.image} style={{ width: '50px', height: '50px', objectFit: 'cover' }} />

                        <IconButton
                          onClick={() => {
                            setLevel2Data((prevData) =>
                              prevData.map((item) => (item.id === form.id ? { ...item, image: null } : item)),
                            );
                          }}
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
                      <>
                        <label className="products-department-new-form-label">Image</label>
                        <div className="products-new-department-right-bar" id="products-image-show">
                          <button type="button" onClick={() => handleImageClick('Level2', form.id)}>
                            Upload Image <CloudUploadIcon sx={{ marginLeft: '8px' }} fontSize="small" />{' '}
                          </button>
                        </div>
                      </>
                    )}
                  </Grid>
                )}
                {form.isNew && level2Data.length >= 1 && (
                  <Grid item lg={1}>
                    <CloseIcon
                      onClick={() => removeFormLevel2(form.id)}
                      style={{ color: 'red', fontSize: '18px', marginTop: '40px', cursor: 'pointer' }}
                    />
                  </Grid>
                )}

                {/* {!form.isNew && (
                  <Grid item lg={1}>
                    {editingLevel2Id !== form.id ? (
                      <EditIcon
                        color="info"
                        onClick={() => handleClassEdit(form.id, form.value)}
                        style={{ marginTop: '40px', cursor: 'pointer' }}
                      />
                    ) : (
                      <UpgradeIcon
                        color="info"
                        onClick={() => handleClassEdit(form.id, form.value)}
                        style={{ marginTop: '40px', cursor: 'pointer' }}
                      />
                    )}
                  </Grid>
                )} */}
              </Grid>
            ))}
            {!classId && (
              <Typography type="button" onClick={addFormLevel2} className="products-new-department-addmore-btn">
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

      <input
        type="file"
        ref={fileInputRefLevel2}
        style={{ display: 'none' }}
        accept=".jpg, .jpeg, .png"
        onChange={(e) => handleImageChange('Level2', e.target.files[0])}
      />
    </div>
  );
};

export default CreateLevel2Category;
