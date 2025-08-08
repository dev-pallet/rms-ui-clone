import React, { useEffect, useRef, useState } from 'react';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import SoftBox from '../../../../components/SoftBox';
import { CircularProgress, Grid, IconButton, Typography } from '@mui/material';
import SoftInput from '../../../../components/SoftInput';
import SoftButton from '../../../../components/SoftButton';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../../../hooks/SnackbarProvider';
import {
  createImageUrl,
  createLevel2Categories,
  deleteImagefromCloud,
  editLevel2Category,
  getAllLevel1Category,
  getAllLevel2Category,
  getAllLevel2CategoryAndMain,
  getAllMainCategory,
} from '../../../../config/Services';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import SoftAsyncPaginate from '../../../../components/SoftSelect/SoftAsyncPaginate';
import SoftSelect from '../../../../components/SoftSelect';

const CreateLevel3Category = () => {
  const navigate = useNavigate();
  const showSnackBar = useSnackbar();
  const [loader, setLoader] = useState(false);

  const [level3Data, setLevel3Data] = useState([
    {
      id: 1,
      mainCategoryName: '',
      mainCategoryId: '',
      level2Name: '',
      level2Options: [],
      level2Id: '',
      level3Name: '',
      image: '',
      description: '',
      isNew: true,
    },
  ]);

  const location1 = useLocation();
  const fileInputRefLevel3 = useRef(null);

  const getQueryParams = () => {
    const params = new URLSearchParams(location1.search);
    const subClassId = params.get('subClassId');
    return { subClassId };
  };

  const { subClassId } = getQueryParams();

  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const user_details = localStorage.getItem('user_details');
  const user_name = localStorage.getItem('user_name');
  const AppAccountId = localStorage.getItem('AppAccountId');
  const uidx = JSON.parse(user_details).uidx;

  // const handleChangeLevel3 = (id, name, value) => {
  //   setLevel3Data(level3Data.map((form) => (form.id === id ? { ...form, [name]: value } : form)));
  // };

  const handleChangeLevel3 = (id, name, value) => {
    setLevel3Data(
      level3Data.map((form) => {
        if (form.id === id) {
          if (name === 'category') {
            // Update main category
            const updatedForm = { ...form, mainCategoryId: value?.value, mainCategoryName: value?.label };

            // Fetch class options based on the selected main category
            const payload = {
              page: 1,
              pageSize: 50,
              mainCategoryId: [value?.value],
              type: ['APP'],
              active: [true],
            };

            getAllLevel1Category(payload).then((response) => {
              let cat = [];
              response?.data?.data?.results?.map((e) => {
                cat.push({ value: e?.level1Id, label: e?.categoryName });
              });

              // Update the form's classOptions once the data is fetched
              setLevel3Data((prevState) =>
                prevState.map((form) => (form.id === id ? { ...form, level2Options: cat } : form)),
              );
            });

            return updatedForm;
          } else if (name === 'class') {
            // Update the selected class
            return { ...form, level2Id: value?.value, level2Name: value?.label };
          } else {
            return { ...form, [name]: value };
          }
        }
        return form;
      }),
    );
  };

  const addFormLevel3 = () => {
    setLevel3Data([
      ...level3Data,
      {
        id: level3Data.length + 1,
        mainCategoryName: '',
        mainCategoryId: '',
        level2Name: '',
        level2Id: '',
        level3Name: '',
        image: '',
        isNew: true,
        description: '',
        level2Options: [],
      },
    ]);
  };

  const removeFormLevel3 = (id) => {
    setLevel3Data(level3Data.filter((form) => form.id !== id));
  };

  const handleImageChange = (level, id, file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      let imageBase64 = reader.result; // Base64 string of the image

      if (level === 'Level3') {
        setLevel3Data(level3Data.map((form) => (form.id === id ? { ...form, image: imageBase64 } : form)));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleImageClick = (level, id) => {
    let fileInputRef;
    fileInputRef = fileInputRefLevel3;

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

  const handleLevel2Create = () => {
    const isAnyNameEmpty = level3Data.some((data) => !data.level3Name.trim());

    if (isAnyNameEmpty) {
      showSnackBar('Please provide Level 3 class name for all entries', 'error');
      return;
    }

    setLoader(true);

    const createCategoryPayload = (imageUrls = {}) => {
      const payload = level3Data
        ?.filter((category) => category.isNew)
        .map((item, index) => ({
          categoryImage: imageUrls[`category3Image${index + 1}`] || '',
          level1Id: item?.level2Id,
          categoryPriority: 0,
          type: 'APP',
          categoryCode: '',
          categoryDescription: item?.description,
          categoryName: item?.level3Name,
          accountId: AppAccountId,
          sourceId: orgId,
          sourceLocationId: locId,
          sourceType: 'RETAIL',
          createdBy: uidx,
          createdByName: user_name,
        }));

      createLevel2Categories(payload)
        .then((res) => {
          if (res?.data?.data?.message === 'Success' && res?.data?.data?.es === 0) {
            setLoader(false);
            showSnackBar('Level 3 category created successfully');
            navigate('/products/online-category');
          } else {
            setLoader(false);
            showSnackBar('Some error occurred', 'error');
          }
        })
        .catch(() => {
          setLoader(false);
          showSnackBar('Some error occurred', 'error');
        });
    };

    // Check if any images need to be uploaded
    const hasImages = level3Data.some((item) => item.image);

    if (hasImages) {
      const imagePayload = {
        uploadType: 'Category3',
        images: level3Data.reduce((acc, item, index) => {
          if (item.image) {
            acc[`category3Image${index + 1}`] = removeDataURLPrefix(item.image);
          }
          return acc;
        }, {}),
      };

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

  const getLevel2SubClass = () => {
    const paylaod = {
      page: 1,
      pageSize: 50,
      //   level1Id: [level1Category],
      level2Id: [subClassId],
      sourceId: [orgId],
      sourceLocationId: [locId],
      type: ['APP'],
    };
    getAllLevel2CategoryAndMain(paylaod)
      .then((res) => {
        const response = res?.data?.data?.categoryLevel2Responses;
        if (response.length > 0) {
          const data = response.map((e, index) => ({
            id: index + 1,
            level3Name: e?.level2CategoryName,
            description: e?.categoryDescription,
            mainCategoryName: e?.mainCategoryName,
            mainCategoryId: e?.mainCategoryId,
            level2Name: e?.level1CategoryName,
            level2Id: e?.level1Id,
            image: e?.categoryImage,
            value: e?.level2Id,
            isNew: false,
          }));
          setLevel3Data(
            data.length > 0
              ? data
              : [
                  {
                    id: Date.now(),
                    categoryName: '',
                    level1Name: '',
                    level2Name: '',
                    level3Name: '',
                    description: '',
                    image: '',
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
    const isAnyNameEmpty = level3Data.some((data) => !data.level3Name.trim());

    if (isAnyNameEmpty) {
      showSnackBar('Please provide category name for all entries', 'error');
      return;
    }

    const categoryToEdit = level3Data[0];

    const updateCategory = (imageUrls = {}) => {
      const payload = {
        categoryImage: imageUrls[`category3Image1`] || '',
        categoryPriority: 0,
        // categoryCode: categoryToEdit?.subClassCode,
        categoryDescription: categoryToEdit?.description,
        categoryName: categoryToEdit?.level3Name,
        type: 'APP',
        level1Id: categoryToEdit?.level2Id,
        accountId: AppAccountId,
        sourceId: orgId,
        sourceLocationId: locId,
        sourceType: 'RETAIL',
        updatedBy: uidx,
        updatedByName: user_name,
        level2Id: subClassId || 'NA',
      };

      editLevel2Category(payload)
        .then((res) => {
          if (res?.data?.data?.message === 'Success' && res?.data?.data?.es === 0) {
            setLoader(false);
            showSnackBar('Level 3 Category Updated', 'success');
            navigate('/products/online-category');
          } else {
            showSnackBar('Some error occurred', 'error');
          }
        })
        .catch(() => {
          setLoader(false);
          showSnackBar('Error while updating level 3 category', 'error');
        });
    };

    // Check if image is present for the category to edit
    if (categoryToEdit?.image) {
      const imagePayload = {
        uploadType: 'Category3',
        images: {
          [`category3Image1`]: removeDataURLPrefix(categoryToEdit?.image),
        },
      };

      createImageUrl(imagePayload)
        .then((res) => {
          const imageUrls = res?.data?.data?.data || {};
          updateCategory(imageUrls); // Proceed with image URLs
        })
        .catch((err) => {
          setLoader(false);
          showSnackBar('Error while uploading images', 'error');
        });
    } else {
      // No image to upload, proceed to update category directly
      updateCategory();
    }
  };

  return (
    <div>
      <DashboardLayout>
        <DashboardNavbar prevLink={true} />
        <SoftBox className="products-new-department-form-box">
          <form>
            {level3Data.map((form) => (
              <Grid container spacing={2} key={form.id} style={{ marginBottom: '15px' }}>
                <Grid item xs={12} md={5} lg={2} className="products-new-department-each-field">
                  <label className="products-department-new-form-label">Level 1 Category Name</label>
                  <SoftAsyncPaginate
                    className="all-products-filter-soft-input-box"
                    placeholder="Select main category..."
                    loadOptions={loadMainCategoriesOptions}
                    additional={{ page: 1 }}
                    value={form.mainCategoryId ? { value: form.mainCategoryId, label: form.mainCategoryName } : null}
                    onChange={(selectedOption) => handleChangeLevel3(form.id, 'category', selectedOption)}
                    isClearable
                    size="small"
                    menuPortalTarget={document.body}
                  />
                </Grid>
                <Grid item xs={12} md={5} lg={2} className="products-new-department-each-field">
                  <label className="products-department-new-form-label">Level 2 Category Name</label>
                  <SoftSelect
                    className="all-products-filter-soft-input-box"
                    size="small"
                    placeholder="Select class..."
                    value={form.level2Id ? { value: form.level2Id, label: form.level2Name } : null}
                    onChange={(option) => handleChangeLevel3(form.id, 'class', option)}
                    options={form?.level2Options || []}
                  />
                </Grid>
                <Grid item xs={12} md={5} lg={2} className="products-new-department-each-field">
                  <label className="products-department-new-form-label">Level 3 category name</label>
                  <SoftInput
                    type="text"
                    placeholder="Enter level 3 name..."
                    name="level3Name"
                    size="small"
                    value={form.level3Name}
                    onChange={(e) => handleChangeLevel3(form.id, 'level3Name', e.target.value)}
                    // className="products-department-new-form-input"
                  />
                </Grid>
                <Grid item xs={12} md={5} lg={2} className="products-new-department-each-field">
                  <label className="products-department-new-form-label">Level 3 description</label>
                  <SoftInput
                    type="text"
                    placeholder="Enter level 3 desc..."
                    name="level3Name"
                    size="small"
                    value={form.description}
                    onChange={(e) => handleChangeLevel3(form.id, 'description', e.target.value)}
                    // className="products-department-new-form-input"
                  />
                </Grid>
                {form.isNew && level3Data.length >= 1 && (
                  <Grid item xs={12} md={5} lg={3} className="products-new-department-each-field">
                    <label className="products-department-new-form-label">Image</label>
                    <div className="products-new-department-right-bar" id="products-image-show">
                      {!form.image && (
                        <button type="button" onClick={() => handleImageClick('Level3', form.id)}>
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
                            setLevel3Data((prevData) =>
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
                          <button type="button" onClick={() => handleImageClick('Level3', form.id)}>
                            Upload Image <CloudUploadIcon sx={{ marginLeft: '8px' }} fontSize="small" />
                          </button>
                        </div>
                      </>
                    )}
                  </Grid>
                )}
                {form.isNew && level3Data.length >= 1 && (
                  <Grid item lg={1}>
                    <CloseIcon
                      onClick={() => removeFormLevel3(form.id)}
                      style={{ color: 'red', fontSize: '18px', marginTop: '40px', cursor: 'pointer' }}
                    />
                  </Grid>
                )}

                {/* {!form.isNew && (
                  <Grid item lg={1}>
                    {editingLevel3Id !== form.id ? (
                      <EditIcon
                        color="info"
                        onClick={() => handleSubClassEdit(form.id, form.value)}
                        style={{ marginTop: '40px', cursor: 'pointer' }}
                      />
                    ) : (
                      <UpgradeIcon
                        color="info"
                        onClick={() => handleSubClassEdit(form.id, form.value)}
                        style={{ marginTop: '40px', cursor: 'pointer' }}
                      />
                    )}
                  </Grid>
                )} */}
              </Grid>
            ))}
            {!subClassId && (
              <Typography type="button" onClick={addFormLevel3} className="products-new-department-addmore-btn">
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

      <input
        type="file"
        ref={fileInputRefLevel3}
        style={{ display: 'none' }}
        accept=".jpg, .jpeg, .png"
        onChange={(e) => handleImageChange('Level3', e.target.files[0])}
      />
    </div>
  );
};

export default CreateLevel3Category;
