import React, { useEffect, useRef, useState } from 'react';
import './online-product-category.css';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import { CircularProgress, Grid, IconButton, Typography } from '@mui/material';
import SoftBox from '../../../../components/SoftBox';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../../../hooks/SnackbarProvider';
import SoftButton from '../../../../components/SoftButton';
import CloseIcon from '@mui/icons-material/Close';
import SoftInput from '../../../../components/SoftInput';
import SoftSelect from '../../../../components/SoftSelect';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import EditIcon from '@mui/icons-material/Edit';
import UpgradeIcon from '@mui/icons-material/Upgrade';
import {
  createHOCategory,
  createImageUrl,
  createLevel1Category,
  createLevel2Categories,
  deleteImagefromCloud,
  editHOCategory,
  editLevel1Category,
  editLevel2Category,
  getAllLevel1Category,
  getAllLevel2Category,
  getAllMainCategory,
} from '../../../../config/Services';
import DeleteIcon from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Edit';

const OnlineProductCategory = () => {
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();
  const [selectedTab, setSelectedTab] = useState('Level1');
  const [level1Data, setLevel1Data] = useState([
    {
      id: 1,
      categoryName: '',
      description: '',
      image: '',
      isNew: true,
    },
  ]);
  const [editingLevel1Id, setEditingLevel1Id] = useState(null);

  const [level2Data, setLevel2Data] = useState([
    {
      id: 1,
      categoryName: '',
      level2Name: '',
      image: '',
      isNew: true,
    },
  ]);
  const [editingLevel2Id, setEditingLevel2Id] = useState(null);

  const [level3Data, setLevel3Data] = useState([
    {
      id: 1,
      categoryName: '',
      level2Name: '',
      level3Name: '',
      image: '',
      isNew: true,
    },
  ]);
  const [editingLevel3Id, setEditingLevel3Id] = useState(null);

  const [loader, setLoader] = useState(false);
  const [mainCategoryOptions, setMainCategoryOptions] = useState([]);
  const [level1Categoryoptions, setLevel1CategoryOptions] = useState([]);
  const [mainCategory, setMainCategory] = useState('');
  const [level1Category, setLevel1Category] = useState('');
  const [showCreateCategory, setShowCreateCategory] = useState(false);

  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const user_details = localStorage.getItem('user_details');
  const user_name = localStorage.getItem('user_name');
  const AppAccountId = localStorage.getItem('AppAccountId');
  const uidx = JSON.parse(user_details).uidx;

  const showSnackBar = useSnackbar();

  const location1 = useLocation();

  const getQueryParams = () => {
    const params = new URLSearchParams(location1.search);
    const level1Id = params.get('level1Id');
    return { level1Id };
  };

  const { level1Id } = getQueryParams();

  const fileInputRefLevel1 = useRef(null);
  const fileInputRefLevel2 = useRef(null);
  const fileInputRefLevel3 = useRef(null);

  const handleLevel1Change = (id, e) => {
    const { name, value } = e.target;
    setLevel1Data(level1Data.map((form) => (form.id === id ? { ...form, [name]: value } : form)));
  };

  const addLevel1Form = () => {
    setLevel1Data([
      ...level1Data,
      { id: level1Data.length + 1, categoryName: '', description: '', image: '', isNew: true },
    ]);
  };

  const removeLevel1Form = (id) => {
    setLevel1Data(level1Data.filter((form) => form.id !== id));
  };

  const handleChangeLevel2 = (id, name, value) => {
    setLevel2Data(level2Data.map((form) => (form.id === id ? { ...form, [name]: value } : form)));
  };

  const addFormLevel2 = () => {
    setLevel2Data([
      ...level2Data,
      { id: level2Data.length + 1, categoryName: '', level2Name: '', image: '', isNew: true },
    ]);
  };

  const removeFormLevel2 = (id) => {
    setLevel2Data(level2Data.filter((form) => form.id !== id));
  };

  const handleChangeLevel3 = (id, name, value) => {
    setLevel3Data(level3Data.map((form) => (form.id === id ? { ...form, [name]: value } : form)));
  };

  const addFormLevel3 = () => {
    setLevel3Data([
      ...level3Data,
      { id: level3Data.length + 1, categoryName: '', level2Name: '', level3Name: '', image: '', isNew: true },
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

      if (level === 'Level1') {
        setLevel1Data(level1Data.map((form) => (form.id === id ? { ...form, image: imageBase64 } : form)));
      } else if (level === 'Level2') {
        setLevel2Data(level2Data.map((form) => (form.id === id ? { ...form, image: imageBase64 } : form)));
      } else if (level === 'Level3') {
        setLevel3Data(level3Data.map((form) => (form.id === id ? { ...form, image: imageBase64 } : form)));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleImageClick = (level, id) => {
    let fileInputRef;
    if (level === 'Level1') {
      fileInputRef = fileInputRefLevel1;
    } else if (level === 'Level2') {
      fileInputRef = fileInputRefLevel2;
    } else if (level === 'Level3') {
      fileInputRef = fileInputRefLevel3;
    }

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

  const handleCreateMainCategory = () => {
    const isAnyNameEmpty = level1Data.some((data) => !data.categoryName.trim());

    if (isAnyNameEmpty) {
      showSnackBar('Please provide Level 1 class name for all entries', 'error');
      return;
    }

    setLoader(true);

    // Prepare the image payload if any image is present
    const imagePayload = {
      uploadType: 'Category1',
      images: level1Data.reduce((acc, item, index) => {
        if (item.image) {
          // Only include categories that have an image
          acc[`category1Image${index + 1}`] = removeDataURLPrefix(item.image); // Remove data URL prefix
        }
        return acc;
      }, {}),
    };

    const createCategoryPayload = (imageUrls = {}) => {
      const payload = level1Data
        .filter((category) => category.isNew)
        .map((category, index) => ({
          categoryImage: imageUrls[`category1Image${index + 1}`] || '',
          categoryPriority: 0,
          categoryCode: '',
          categoryDescription: category?.description,
          categoryName: category?.categoryName,
          type: 'APP',
          accountId: AppAccountId,
          sourceId: orgId,
          sourceLocationId: locId,
          sourceType: 'RETAIL',
          createdBy: uidx,
          createdByName: user_name,
        }));

      // Create the category with the payload
      createHOCategory(payload)
        .then((res) => {
          setLoader(false);
          if (res?.data?.data?.message === 'Success' && res?.data?.data?.es === 0) {
            showSnackBar('Level 1 Category Created', 'success');
            navigate('/products/online-category');
          } else {
            showSnackBar('Error while creating main category', 'error');
          }
        })
        .catch(() => {
          setLoader(false);
          showSnackBar('Error while creating main category', 'error');
        });
    };

    // If there are images, call the createImageUrl API, otherwise directly create the category
    if (Object.keys(imagePayload.images).length > 0) {
      // Uploading images
      createImageUrl(imagePayload)
        .then((res) => {
          const imageUrls = res?.data?.data?.data || {};
          createCategoryPayload(imageUrls); // Proceed with creating category
        })
        .catch(() => {
          setLoader(false);
          showSnackBar('Error while uploading images', 'error');
        });
    } else {
      // No images to upload, directly create category
      createCategoryPayload();
    }
  };

  const getMainCategories = () => {
    const payload = {
      page: 1,
      pageSize: 50,
      sourceId: [orgId],
      sourceLocationId: [locId],
      type: ['APP'],
      mainCategoryId: [level1Id],
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
          isNew: false,
        }));
        setLevel1Data(
          data.length > 0 ? data : [{ id: Date.now(), categoryName: '', description: '', image: '', isNew: true }],
        );
      })
      .catch(() => {});
  };

  useEffect(() => {
    getMainCategories();
  }, [level1Id]);

  const handleCategoryEdit = () => {
    const isAnyNameEmpty = level1Data.some((data) => !data.categoryName.trim());

    if (isAnyNameEmpty) {
      showSnackBar('Please provide category name for all entries', 'error');
      return;
    }

    const categoryToEdit = level1Data[0];

    const createEditCategoryPayload = (imageUrl = '') => {
      const payload = {
        categoryImage: imageUrl || '', // Use image URL if present, otherwise empty
        categoryPriority: 0,
        categoryDescription: categoryToEdit?.description,
        categoryName: categoryToEdit?.categoryName,
        type: 'APP',
        mainCategoryId: categoryToEdit?.value,
        accountId: AppAccountId,
        sourceId: orgId,
        sourceLocationId: locId,
        sourceType: 'RETAIL',
        updatedBy: uidx,
        updatedByName: user_name,
      };

      // Edit category
      editHOCategory(payload)
        .then((res) => {
          if (res?.data?.data?.message === 'Success' && res?.data?.data?.es === 0) {
            setLoader(false);
            showSnackBar('Main Category Updated', 'success');
            navigate('/products/online-category');
          } else {
            showSnackBar('Some error occurred', 'error');
          }
          getMainCategories();
        })
        .catch(() => {
          setLoader(false);
          showSnackBar('Error while updating main category', 'error');
        });
    };

    // Check if the category has an image to upload
    if (categoryToEdit?.image) {
      const imagePayload = {
        uploadType: 'Category1',
        images: {
          [`category1Image1`]: removeDataURLPrefix(categoryToEdit?.image), // Only include the specific image being edited
        },
      };

      // Upload image if present
      createImageUrl(imagePayload)
        .then((res) => {
          const imageUrls = res?.data?.data?.data || {};
          createEditCategoryPayload(imageUrls[`category1Image1`]); // Proceed with image URL
        })
        .catch((err) => {
          setLoader(false);
          showSnackBar('Error while uploading images', 'error');
        });
    } else {
      // No image to upload, proceed to edit category without uploading
      createEditCategoryPayload();
    }
  };

  const handleLevel1CategoryData = () => {
    const isAnyNameEmpty = level2Data.some((data) => !data.level2Name.trim());

    if (isAnyNameEmpty) {
      showSnackBar('Please provide Level 2 class name for all entries', 'error');
      return;
    }
    setLoader(true);
    setLevel1Data([
      {
        id: 1,
        categoryName: '',
        description: '',
        image: '',
      },
    ]);

    const imagePayload = {
      uploadType: 'Category2',
      images: level2Data.reduce((acc, item, index) => {
        acc[`category2Image${index + 1}`] = removeDataURLPrefix(item.image);
        return acc;
      }, {}),
    };

    createImageUrl(imagePayload)
      .then((res) => {
        const imageUrls = res?.data?.data?.data || {};

        const payload = level2Data
          .filter((category) => category.isNew)
          .map((data, index) => ({
            mainCategoryId: mainCategory,
            categoryImage: imageUrls[`category2Image${index + 1}`] || '',
            categoryPriority: 0,
            type: 'APP',
            categoryCode: '',
            categoryDescription: '',
            categoryName: data?.level2Name,
            accountId: AppAccountId,
            sourceId: orgId,
            sourceLocationId: locId,
            sourceType: 'RETAIL',
            createdBy: uidx,
            createdByName: user_name,
          }));

        // Creating the category with the new payload
        createLevel1Category(payload)
          .then((res) => {
            if (res?.data?.data?.message === 'Success' && res?.data?.data?.es === 0) {
              setLoader(false);
              showSnackBar('Level 2 category created successfully');
            } else {
              setLoader(false);
              showSnackBar('some Error occured', 'error');
            }
          })
          .catch(() => {
            setLoader(false);
            showSnackBar('some Error occured', 'error');
          });
      })
      .catch(() => {
        setLoader(false);
        showSnackBar('Error while uploading images', 'error');
      });
  };

  const prevCategoryNamesRef = useRef([]);

  useEffect(() => {
    const payload = {
      page: 1,
      pageSize: 50,
      mainCategoryId: [mainCategory],
      accountId: [AppAccountId],
      sourceId: [orgId],
      sourceLocationId: [locId],
      sourceType: ['RETAIL'],
      type: ['APP'],
    };
    getAllLevel1Category(payload)
      .then((res) => {
        const results = res?.data?.data?.results;
        const data = results?.map((item) => ({
          value: item?.level1Id,
          label: item?.categoryName,
          mainCategoryId: item?.mainCategoryId,
          categoryName: item?.mainCategoryName,
          level2Name: item?.categoryName,
          description: item?.description,
          image: item?.categoryImage,
          isNew: false,
        }));
        setLevel1CategoryOptions(data);
        setLevel2Data(
          data.length > 0
            ? data
            : [{ id: Date.now(), categoryName: '', level1Name: '', description: '', image: '', isNew: true }],
        );
      })
      .catch(() => {});
  }, [selectedTab, mainCategory]);

  const handleClassEdit = (idx, id) => {
    if (editingLevel2Id === idx) {
      const isAnyNameEmpty = level2Data.some((data) => !data.level2Name.trim());

      if (isAnyNameEmpty) {
        showSnackBar('Please provide category name for all entries', 'error');
        return;
      }

      const categoryToEdit = level2Data.find((data) => data.value === id);

      const imagePayload = {
        uploadType: 'Category2',
        images: {
          [`category2Image${idx + 1}`]: removeDataURLPrefix(categoryToEdit?.image), // Only include the specific image being edited
        },
      };

      createImageUrl(imagePayload)
        .then((res) => {
          const imageUrls = res?.data?.data?.data || {};

          const payload = {
            categoryImage: imageUrls[`category2Image${idx + 1}`] || '',
            categoryPriority: 0,
            // categoryCode: categoryToEdit?.classCode,
            // categoryDescription: categoryToEdit?.description,
            categoryName: categoryToEdit?.level2Name,
            type: 'APP',
            mainCategoryId: categoryToEdit?.mainCategoryId,
            accountId: AppAccountId,
            sourceId: orgId,
            sourceLocationId: locId,
            sourceType: 'RETAIL',
            createdBy: uidx,
            createdByName: user_name,
            level1Id: categoryToEdit?.value,
          };
          editLevel1Category(payload)
            .then((res) => {
              if (res?.data?.data?.message === 'Success' && res?.data?.data?.es === 0) {
                setLoader(false);
                showSnackBar('Level 2 Category Updated', 'success');
                setEditingLevel2Id(null);
              } else {
                showSnackBar('some Error occured', 'error');
              }
            })
            .catch(() => {
              setLoader(false);
              showSnackBar('Error while updating level 2 category', 'error');
            });
        })
        .catch((err) => {
          setLoader(false);
          showSnackBar('Error while updating level 2 category', 'error');
        });
    } else {
      setEditingLevel2Id(idx);
    }
  };

  const handleLevel2Create = () => {
    const isAnyNameEmpty = level3Data.some((data) => !data.level3Name.trim());

    if (isAnyNameEmpty) {
      showSnackBar('Please provide Level 3 class name for all entries', 'error');
      return;
    }
    setLoader(true);
    setLevel2Data([
      {
        id: 1,
        categoryName: '',
        level2Name: '',
        image: '',
      },
    ]);
    setLevel1Data([
      {
        id: 1,
        categoryName: '',
        description: '',
        image: '',
      },
    ]);

    const imagePayload = {
      uploadType: 'Category3',
      images: level3Data.reduce((acc, item, index) => {
        acc[`category3Image${index + 1}`] = removeDataURLPrefix(item.image);
        return acc;
      }, {}),
    };

    createImageUrl(imagePayload)
      .then((res) => {
        const imageUrls = res?.data?.data?.data || {};

        const payload = level3Data
          ?.filter((category) => category.isNew)
          .map((item, index) => ({
            categoryImage: imageUrls[`category3Image${index + 1}`] || '',
            mainCategoryId: item?.categoryName,
            level1Id: item?.level2Name,
            categoryPriority: 0,
            type: 'APP',
            categoryCode: '',
            categoryDescription: '',
            categoryName: item?.level3Name,
            accountId: AppAccountId,
            sourceId: orgId,
            sourceLocationId: locId,
            sourceType: 'RETAIL',
            createdBy: uidx,
            createdByName: user_name,
          }));

        // Creating the category with the new payload
        createLevel2Categories(payload)
          .then((res) => {
            if (res?.data?.data?.message === 'Success' && res?.data?.data?.es === 0) {
              setLoader(false);
              showSnackBar('Level 3 category created successfully');
            } else {
              setLoader(false);
              showSnackBar('some Error occured', 'error');
            }
          })
          .catch(() => {
            setLoader(false);
          });
      })
      .catch(() => {
        setLoader(false);
        showSnackBar('Error while uploading images', 'error');
      });
    // navigate('/products/product-master');
  };

  const getLevel2SubClass = () => {
    const paylaod = {
      page: 1,
      pageSize: 50,
      level1Id: [level1Category],
      // level2Id: [class1Category],
      accountId: [AppAccountId],
      sourceId: [orgId],
      sourceLocationId: [locId],
      type: ['APP'],
    };
    getAllLevel2Category(paylaod)
      .then((res) => {
        const response = res?.data?.data?.results;
        if (response.length > 0) {
          const data = response.map((e, index) => ({
            id: index + 1,
            categoryName: mainCategory,
            level2Name: level1Category,
            level3Name: e?.categoryName,
            // description: e?.categoryDescription,
            // subClassCode: e?.categoryCode,
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
  }, [level1Category]);

  const handleSubClassEdit = (idx, id) => {
    if (editingLevel3Id === idx) {
      const isAnyNameEmpty = level3Data.some((data) => !data.level3Name.trim());

      if (isAnyNameEmpty) {
        showSnackBar('Please provide category name for all entries', 'error');
        return;
      }

      const categoryToEdit = level3Data.find((data) => data.value === id);

      const imagePayload = {
        uploadType: 'Category3',
        images: {
          [`category3Image${idx + 1}`]: removeDataURLPrefix(categoryToEdit?.image),
        },
      };

      createImageUrl(imagePayload)
        .then((res) => {
          const imageUrls = res?.data?.data?.data || {};

          const payload = {
            categoryImage: imageUrls[`category3Image${idx + 1}`] || '',
            categoryPriority: 0,
            // categoryCode: categoryToEdit?.subClassCode,
            // categoryDescription: categoryToEdit?.description,
            categoryName: categoryToEdit?.level3Name,
            type: 'APP',
            level1Id: categoryToEdit?.level2Name,
            accountId: AppAccountId,
            sourceId: orgId,
            sourceLocationId: locId,
            sourceType: 'RETAIL',
            createdBy: uidx,
            createdByName: user_name,
            level2Id: categoryToEdit?.value || 'NA',
          };
          editLevel2Category(payload)
            .then((res) => {
              if (res?.data?.data?.message === 'Success' && res?.data?.data?.es === 0) {
                setLoader(false);
                showSnackBar('Level 3 Category Updated', 'success');
                setEditingLevel3Id(null);
              } else {
                showSnackBar('some Error occured', 'error');
              }
              getLevel2SubClass();
            })
            .catch(() => {
              setLoader(false);
              showSnackBar('Error while updating level 3 category', 'error');
            });
        })
        .catch((err) => {
          setLoader(false);
          showSnackBar('Error while uploading images', 'error');
        });
    } else {
      setEditingLevel3Id(idx);
    }
  };

  const handleDeleteImage = (id, image) => {
    function extractImagePath(url) {
      const start = 'pallet/cms/product';
      const startIndex = url.indexOf(start);
      if (startIndex !== -1) {
        return url.substring(startIndex);
      }
      return '';
    }

    const payload = {
      filePath: extractImagePath(image),
    };
    deleteImagefromCloud(payload)
      .then((res) => {})
      .catch((err) => {});
  };

  return (
    <div>
      <DashboardLayout>
        <DashboardNavbar prevLink={true} />

        <SoftBox className="products-new-department-form-box">
          <form>
            {level1Data.map((form) => (
              <Grid container spacing={2} key={form.id} style={{ marginBottom: '15px' }}>
                <Grid item xs={12} md={5} lg={4} className="products-new-department-each-field">
                  <label className="products-department-new-form-label">Level 1 Category Name</label>
                  <SoftInput
                    placeholder="Enter category name..."
                    type="text"
                    name="categoryName"
                    size="small"
                    value={form.categoryName}
                    onChange={(e) => handleLevel1Change(form.id, e)}
                    // className="products-department-new-form-input"
                  />
                </Grid>
                <Grid item xs={12} md={5} lg={4} className="products-new-department-each-field">
                  <label className="products-department-new-form-label">Description</label>
                  <SoftInput
                    placeholder="Enter Department desc..."
                    type="text"
                    size="small"
                    name="description"
                    value={form.description}
                    onChange={(e) => handleLevel1Change(form.id, e)}
                    // className="products-department-new-form-input"
                  />
                </Grid>

                {form.isNew && (
                  <Grid item xs={12} md={5} lg={3} className="products-new-department-each-field">
                    <label className="products-department-new-form-label">Image</label>
                    <div className="products-new-department-right-bar" id="products-image-show">
                      {!form.image && (
                        <button type="button" onClick={() => handleImageClick('Level1', form.id)}>
                          Upload Image <CloudUploadIcon sx={{ marginLeft: '8px' }} fontSize="small" />{' '}
                        </button>
                      )}
                      {form.image && <img src={form.image} style={{ width: '50px' }} />}
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
                            // handleDeleteImage(form.id, form.image),
                            setLevel1Data((prevData) =>
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
                          <button type="button" onClick={() => handleImageClick('Level1', form.id)}>
                            Upload Image <CloudUploadIcon sx={{ marginLeft: '8px' }} fontSize="small" />
                          </button>
                        </div>
                      </>
                    )}
                  </Grid>
                )}
                {form.isNew && level1Data.length > 1 && (
                  <Grid item lg={1}>
                    <CloseIcon
                      onClick={() => removeLevel1Form(form.id)}
                      style={{ color: 'red', fontSize: '18px', marginTop: '40px', cursor: 'pointer' }}
                    />
                  </Grid>
                )}

                {/* {!form.isNew && (
                  <Grid item lg={1}>
                    {editingLevel1Id !== form.id ? (
                      <EditIcon
                        color="info"
                        onClick={() => handleCategoryEdit(form.id, form.value)}
                        style={{ marginTop: '40px', cursor: 'pointer' }}
                      />
                    ) : (
                      <UpgradeIcon
                        color="info"
                        onClick={() => handleCategoryEdit(form.id, form.value)}
                        style={{ marginTop: '40px', cursor: 'pointer' }}
                      />
                    )}
                  </Grid>
                )} */}
              </Grid>
            ))}
            {!level1Id && (
              <Typography type="button" onClick={addLevel1Form} className="products-new-department-addmore-btn">
                + Add more
              </Typography>
            )}
          </form>
        </SoftBox>

        {/* <SoftBox className="products-new-department-form-box">
            <form>
              {level2Data.map((form) => (
                <Grid container spacing={2} key={form.id} style={{ marginBottom: '15px' }}>
                  <Grid item xs={12} md={5} lg={4} className="products-new-department-each-field">
                    <label className="products-department-new-form-label">Main Category name</label>
                   
                    <SoftSelect
                      placeholder="Select Main Category..."
                      size="small"
                      options={mainCategoryOptions}
                      value={mainCategoryOptions.find((option) => option.value === form.categoryName)}
                      onChange={(option) => {
                        handleChangeLevel2(form.id, 'categoryName', option.value);
                        setMainCategory(option.value);
                      }}
                      disabled={!form.isNew && editingLevel2Id !== form.id}
                    ></SoftSelect>
                  </Grid>
                  <Grid item xs={12} md={5} lg={4} className="products-new-department-each-field">
                    <label className="products-department-new-form-label">Level 2 category Name</label>
                    <SoftInput
                      placeholder="Enter Level 2 name..."
                      type="text"
                      name="level2Name"
                      value={form.level2Name}
                      size="small"
                      onChange={(e) => handleChangeLevel2(form.id, 'level2Name', e.target.value)}
                      // className="products-department-new-form-input"
                      disabled={!form.isNew && editingLevel2Id !== form.id}
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
                          {editingLevel2Id === form.id && (
                            <IconButton
                              onClick={() => {
                                handleDeleteImage(form.id, form.image),
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
                          )}
                        </div>
                      ) : (
                        editingLevel2Id === form.id && (
                          <div className="products-new-department-right-bar" id="products-image-show">
                            <button
                              type="button"
                              onClick={() => handleImageClick('Level2', form.id)}
                              style={{ marginTop: '20px' }}
                            >
                              Upload Image <CloudUploadIcon sx={{ marginLeft: '8px' }} fontSize="small" />
                            </button>
                          </div>
                        )
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

                  {!form.isNew && (
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
                  )}
                </Grid>
              ))}
              <Typography type="button" onClick={addFormLevel2} className="products-new-department-addmore-btn">
                + Add more
              </Typography>
            </form>
          </SoftBox>
        
          <SoftBox className="products-new-department-form-box">
            <form>
              {level3Data.map((form) => (
                <Grid container spacing={2} key={form.id} style={{ marginBottom: '15px' }}>
                  <Grid item xs={12} md={5} lg={3} className="products-new-department-each-field">
                    <label className="products-department-new-form-label">Main Category name</label>
                    
                    <SoftSelect
                      placeholder="Select main category..."
                      size="small"
                      options={mainCategoryOptions}
                      value={mainCategoryOptions.find((option) => option.value === form.categoryName)}
                      onChange={(option) => {
                        handleChangeLevel3(form.id, 'categoryName', option.value);
                        setMainCategory(option.value);
                      }}
                      disabled={!form.isNew && editingLevel3Id !== form.id}
                    ></SoftSelect>
                  </Grid>
                  <Grid item xs={12} md={5} lg={3} className="products-new-department-each-field">
                    <label className="products-department-new-form-label">Level 2 category name</label>
                    <SoftSelect
                      placeholder="Select level 2 category..."
                      size="small"
                      options={level1Categoryoptions}
                      value={level1Categoryoptions.find((option) => option.value === form.level2Name)}
                      onChange={(option) => {
                        handleChangeLevel3(form.id, 'level2Name', option.value);
                        setLevel1Category(option.value);
                      }}
                      disabled={!form.isNew && editingLevel3Id !== form.id}
                    ></SoftSelect>
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
                      disabled={!form.isNew && editingLevel3Id !== form.id}
                    />
                  </Grid>
                  {form.isNew && level2Data.length >= 1 && (
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
                          {editingLevel3Id === form.id && (
                            <IconButton
                              onClick={() => {
                                handleDeleteImage(form.id, form.image),
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
                          )}
                        </div>
                      ) : (
                        editingLevel3Id === form.id && (
                          <div className="products-new-department-right-bar" id="products-image-show">
                            <button
                              type="button"
                              onClick={() => handleImageClick('Level3', form.id)}
                              style={{ marginTop: '20px' }}
                            >
                              Upload Image <CloudUploadIcon sx={{ marginLeft: '8px' }} fontSize="small" />
                            </button>
                          </div>
                        )
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

                  {!form.isNew && (
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
                  )}
                </Grid>
              ))}
              <Typography type="button" onClick={addFormLevel3} className="products-new-department-addmore-btn">
                + Add more
              </Typography>
            </form>
          </SoftBox> */}

        <SoftBox display="flex" justifyContent="flex-end" mt={4}>
          <SoftBox display="flex">
            <SoftButton className="vendor-second-btn" onClick={() => navigate(-1)}>
              Cancel
            </SoftButton>
            <SoftBox ml={2}>
              <SoftButton
                color="info"
                className="vendor-add-btn"
                onClick={level1Id ? handleCategoryEdit : handleCreateMainCategory}
              >
                {loader ? (
                  <CircularProgress
                    size={18}
                    sx={{
                      color: '#fff',
                    }}
                  />
                ) : level1Id ? (
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
        ref={fileInputRefLevel1}
        style={{ display: 'none' }}
        accept=".jpg, .jpeg, .png"
        onChange={(e) => handleImageChange('Level1', e.target.files[0])}
      />
      <input
        type="file"
        ref={fileInputRefLevel2}
        style={{ display: 'none' }}
        accept=".jpg, .jpeg, .png"
        onChange={(e) => handleImageChange('Level2', e.target.files[0])}
      />
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

export default OnlineProductCategory;
