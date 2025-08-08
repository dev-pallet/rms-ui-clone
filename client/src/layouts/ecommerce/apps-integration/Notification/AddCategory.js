import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SoftBox from '../../../../components/SoftBox';
import SoftButton from '../../../../components/SoftButton';
import SoftInput from '../../../../components/SoftInput';
import SoftSelect from '../../../../components/SoftSelect';
import {
  createCommsAction,
  createCommsMainCategory,
  createCommsSubCategory,
  displayMainCategory,
  getSubCategory,
} from '../../../../config/Services';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import { useSnackbar } from '../../../../hooks/SnackbarProvider';

const AddCategory = () => {
  const [allCategories, setAllCategories] = useState([]);
  const [formattedCategories, setFormattedCategories] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState('');
  const [selectedNotificationName, setSelectedNotificationName] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [showAddCategory, setShowCategory] = useState(true);
  const [showSubCategory, setShowSubCategory] = useState(false);
  const [newSubCategory, setNewSubCategory] = useState('');
  const [showActions, setShowActions] = useState(false);
  const [allSubCategories, setAllSubCategories] = useState([]);
  const [formattedSubCategories, setFormattedSubCategories] = useState([]);
  const [selectedSubNotification, setSelectedSubNotification] = useState('');
  const [selectedSubNotificationName, setSelectedSubNotificationName] = useState('');
  const [newActionName, setNewActionName] = useState('');

  const showSnackbar = useSnackbar();
  const navigate = useNavigate();

  const userName = localStorage.getItem('user_name');

  const handleAddSubCategory = () => {
    setShowCategory(false);
    setShowSubCategory(true);
  };

  const handleAddActions = () => {
    setShowSubCategory(false);
    setShowActions(true);
  };

  useEffect(() => {
    try {
      displayMainCategory().then((res) => {
        const All = res.data.data.filter((item) => item.comMainCategoryName !== 'User');
        setAllCategories(All);
      });
    } catch (error) {
      showSnackbar('Error: Categories not Fetched', 'error');
    }
  }, [showSubCategory]);

  useEffect(() => {
    const formattedData = allCategories.map((category) => ({
      value: `${category.commMainCategoryId}`,
      label: `${category.comMainCategoryName}`,
    }));
    setFormattedCategories(formattedData);
  }, [allCategories]);

  //   for subCategories
  useEffect(() => {
    const fetchData = async () => {
      try {
        getSubCategory(selectedNotification).then((res) => {
          setAllSubCategories(res.data.data);
        });
      } catch (error) {
        showSnackbar('Error: Subcategories not Fetched', 'error');
      }
    };

    fetchData();
  }, [selectedNotification, showActions]);

  useEffect(() => {
    const formattedData = allSubCategories.map((category) => ({
      value: `${category.comCategoryId}`,
      label: `${category.comCategoryName}`,
    }));
    setFormattedSubCategories(formattedData);
  }, [allSubCategories, selectedNotification]);

  const handleAddCategoryChange = (event) => {
    const inputValue = event.target.value;
    // Capitalize the first letter of each word
    const formattedInput = inputValue
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    setNewCategory(formattedInput);
  };

  const handleAddSubcategoryChange = (event) => {
    const inputValue = event.target.value;
    // Capitalize the first letter of each word
    const formattedInput = inputValue
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    setNewSubCategory(formattedInput);
  };

  const handleNewActionChange = (event) => {
    const inputValue = event.target.value;
    // Remove non-capital letters and replace spaces with underscores
    const formattedInput = inputValue
      .toUpperCase()
      .replace(/[^A-Z]/g, ' ')
      .replace(/\s/g, '_');
    setNewActionName(formattedInput);
  };

  const addNewCategory = () => {
    const categoryPayload = {
      comMainCategoryName: newCategory,
      createdBy: userName,
    };
    try {
      createCommsMainCategory(categoryPayload).then((res) => {
        // setShowCategory(false);
        // setShowSubCategory(true);
        showSnackbar(`${newCategory} Category added`, 'success');
        setTimeout(() => {
          navigate('/notification-category');
        }, 1000);
      });
    } catch (error) {
      showSnackbar('Error in adding new Category', 'error');
    }
  };

  const addNewSubCategory = () => {
    const subCategoryPayload = {
      comCategoryName: newSubCategory,
      createdBy: userName,
      commMainCategoryId: selectedNotification,
    };

    try {
      createCommsSubCategory(subCategoryPayload).then((res) => {
        // setShowSubCategory(false);
        // setShowActions(true);
        showSnackbar(`${newSubCategory} Subcategory added`, 'success');
        setTimeout(() => {
          navigate('/notification-category');
        }, 1000);
      });
    } catch (error) {
      showSnackbar('Error in adding new Subcategory', 'error');
    }
  };

  const addNewAction = () => {
    const actionPayload = {
      comCategoryId: selectedSubNotification,
      comActionName: newActionName,
      createdBy: userName,
    };

    try {
      createCommsAction(actionPayload).then((res) => {
        showSnackbar(`${newActionName} Action added`, 'success');
        setTimeout(() => {
          navigate('/notification-category');
        }, 1000);
      });
    } catch (error) {
      showSnackbar('Error in adding new Action', 'error');
    }
  };

  return (
    <div>
      <DashboardLayout>
        <DashboardNavbar />
        <Box
          className="table-css-fix-box-scroll-vend"
          style={{
            boxShadow: 'rgba(37, 37, 37, 0.126) 0px 5px 50px',
            position: 'relative',
            padding: '20px',
          }}
        >
          <SoftBox style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <ArrowBackIcon onClick={() => navigate('/notification-category')} sx={{ cursor: 'pointer' }} />
            <Typography>
              {showAddCategory ? 'Add Category' : showSubCategory ? 'Add Subcategory' : 'Add Actions'}
            </Typography>
          </SoftBox>
          <SoftBox
            py={0}
            px={0}
            sx={{
              marginTop: '1rem',
            }}
          >
            {showAddCategory && (
              <SoftBox style={{ marginTop: '20px' }}>
                <Typography
                  style={{
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    lineHeight: '1.5',
                    color: '#0562FB',
                    textAlign: 'left',
                    margin: '10px 0px',
                  }}
                >
                  Category Name
                </Typography>

                <SoftInput
                  placeholder="Category Name"
                  style={{ width: '400px' }}
                  value={newCategory} // Controlled component, value is set to newCategory
                  onChange={handleAddCategoryChange}
                />
                <SoftBox display="flex" justifyContent="flex-end" mt={4}>
                  <SoftBox display="flex">
                    <SoftButton className="vendor-second-btn" onClick={addNewCategory}>
                      Add Category
                    </SoftButton>
                    <SoftBox ml={2}>
                      <SoftButton
                        // variant="gradient"
                        color="info"
                        className="vendor-add-btn"
                        onClick={handleAddSubCategory}
                      >
                        Add Subcategory
                      </SoftButton>
                    </SoftBox>
                  </SoftBox>
                </SoftBox>
              </SoftBox>
            )}

            {showSubCategory && (
              <SoftBox style={{ marginTop: '30px' }}>
                <Typography
                  style={{
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    lineHeight: '1.5',
                    color: '#0562FB',
                    textAlign: 'left',
                    margin: '10px 0px',
                  }}
                >
                  Select Category
                </Typography>
                <SoftSelect
                  placeholder={selectedNotificationName}
                  options={formattedCategories}
                  // options={optionsarr}
                  onChange={(option) => {
                    setSelectedNotification(option.value), setSelectedNotificationName(option.label);
                  }}
                />
                <SoftBox style={{ marginTop: '20px' }}>
                  <Typography
                    style={{
                      fontWeight: '600',
                      fontSize: '0.9rem',
                      lineHeight: '1.5',
                      color: '#0562FB',
                      textAlign: 'left',
                      margin: '10px 0px',
                    }}
                  >
                    Add Subcategory
                  </Typography>
                  <SoftInput
                    placeholder="Subcategory Name"
                    style={{ width: '400px' }}
                    value={newSubCategory} // Controlled component, value is set to newCategory
                    onChange={handleAddSubcategoryChange}
                  />
                </SoftBox>
                <SoftBox display="flex" justifyContent="flex-end" mt={4}>
                  <SoftBox display="flex">
                    <SoftButton className="vendor-second-btn" onClick={addNewSubCategory}>
                      Add Subcategory
                    </SoftButton>
                    <SoftBox ml={2}>
                      <SoftButton
                        // variant="gradient"
                        color="info"
                        className="vendor-add-btn"
                        onClick={handleAddActions}
                      >
                        Add Actions
                      </SoftButton>
                    </SoftBox>
                  </SoftBox>
                </SoftBox>
              </SoftBox>
            )}

            {showActions && (
              <SoftBox style={{ marginTop: '30px' }}>
                <Typography
                  style={{
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    lineHeight: '1.5',
                    color: '#0562FB',
                    textAlign: 'left',
                    margin: '10px 0px',
                  }}
                >
                  Select Category
                </Typography>
                <SoftSelect
                  placeholder={selectedSubNotificationName}
                  options={formattedCategories}
                  // options={optionsarr}
                  onChange={(option) => {
                    setSelectedNotification(option.value), setSelectedNotificationName(option.label);
                  }}
                />
                <SoftBox style={{ marginTop: '20px' }}>
                  <Typography
                    style={{
                      fontWeight: '600',
                      fontSize: '0.9rem',
                      lineHeight: '1.5',
                      color: '#0562FB',
                      textAlign: 'left',
                      margin: '10px 0px',
                    }}
                  >
                    Select Subcategory
                  </Typography>
                  <SoftSelect
                    placeholder={selectedNotificationName}
                    options={formattedSubCategories}
                    // options={optionsarr}
                    onChange={(option) => {
                      setSelectedSubNotification(option.value), setSelectedSubNotificationName(option.label);
                    }}
                  />
                </SoftBox>
                <SoftBox style={{ marginTop: '20px' }}>
                  <Typography
                    style={{
                      fontWeight: '600',
                      fontSize: '0.9rem',
                      lineHeight: '1.5',
                      color: '#0562FB',
                      textAlign: 'left',
                      margin: '10px 0px',
                    }}
                  >
                    Action Name
                  </Typography>
                  <SoftInput
                    placeholder="Action Name"
                    style={{ width: '400px' }}
                    value={newActionName} // Controlled component, value is set to newActionName
                    onChange={handleNewActionChange}
                    // onChange={(event) => setNewActionName(event.target.value)}
                  />
                  <Typography
                    style={{
                      fontWeight: '200',
                      fontSize: '0.8rem',
                      lineHeight: '1.5',
                      color: '#4b524d',
                      textAlign: 'left',
                      margin: '10px 0px',
                    }}
                  >
                    Action Name should be in capital letters and joined together with '_'
                  </Typography>
                </SoftBox>
                <SoftBox display="flex" justifyContent="flex-end" mt={4}>
                  <SoftBox display="flex">
                    <SoftButton className="vendor-second-btn" onClick={addNewAction}>
                      Add Action
                    </SoftButton>
                  </SoftBox>
                </SoftBox>
              </SoftBox>
            )}
          </SoftBox>
        </Box>
      </DashboardLayout>
    </div>
  );
};

export default AddCategory;
