import './Notificationsettings.css';
import { Grid, Typography } from '@mui/material';
import { displayMainCategory, updateClientData } from '../../../../config/Services';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import React, { useEffect, useState } from 'react';
import SoftBox from '../../../../components/SoftBox';
import SoftTypography from '../../../../components/SoftTypography';

import { useSnackbar } from '../../../../hooks/SnackbarProvider';
import CustomCard from './CustomComponents/CustomCard';
import SoftButton from '../../../../components/SoftButton';

const NotificationCategory = () => {
  const navigate = useNavigate();
  const [currentSelected, setCurrentSelected] = useState('');
  const [allCategories, setAllCategories] = useState([]);

  const showSnackbar = useSnackbar();
  const pushNotificationLimit = localStorage.getItem('pushNotificationLimit');
  const clientId = localStorage.getItem('clientId');
  const userRoles = localStorage.getItem('user_roles');
  const isSuperAdmin = userRoles.includes('SUPER_ADMIN');

  const updateData = () => {
    if (pushNotificationLimit === '') {
      const payload = {
        clientId: clientId,
        pushNotifyLimit: '10000',
      };

      try {
        updateClientData(payload).then((res) => {});
      } catch (error) {
        showSnackbar('Error: No data found', 'error');
      }
    }
  };

  useEffect(() => {
    try {
      displayMainCategory().then((res) => {
        const All = res?.data?.data.filter((item) => item.comMainCategoryName !== 'User');
        setAllCategories(All);
        showSnackbar('All Categories Fetched', 'success');
      });
    } catch (error) {
      showSnackbar('Error: Categories not Fetched', 'error');
    }
  }, []);

  useEffect(() => {
    updateData();
  }, [allCategories]);

  return (
    <DashboardLayout>
      <DashboardNavbar prevLink={true} />

      {/* categories list  */}
      <SoftBox mb={3} p={1} style={{ display: 'flex', justifyContent: 'space-between' }}>
        <SoftTypography
          //   variant={window.innerWidth < values.sm ? 'h3' : 'h2'}
          textTransform="capitalize"
          fontWeight="bold"
        >
          Select Category
        </SoftTypography>
        {isSuperAdmin && (
          <SoftButton className="vendor-add-btn" onClick={() => navigate('/notification/add/category')}>
            Add Category
          </SoftButton>
        )}
      </SoftBox>
      <Grid container className="cards" sx={{ marginTop: '20px' }}>
        {allCategories.map((item) => {
          return (
            <Grid item xs={12} sm={12} md={3} xl={4}>
              <div onClick={() => navigate(`/allnotificationPage/${item.commMainCategoryId}`)}>
                <CustomCard className="cardname-category">
                  <Typography
                    style={{
                      fontWeight: currentSelected === 'Products' ? 'bolder' : '600',
                      fontSize: '1rem',
                      lineHeight: '2',
                      color: '#4b524d',
                    }}
                  >
                    {item.comMainCategoryName}
                  </Typography>
                  <span>
                    <img
                      src={
                        item?.comMainCategoryName === 'Purchase'
                          ? 'https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_images/shopping-cart_3594363.png'
                          : item?.comMainCategoryName === 'User'
                          ? 'https://i.postimg.cc/JngDnPQm/team.png'
                          : item?.comMainCategoryName === 'Products'
                          ? 'https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_images/products_1312205.png'
                          : item?.comMainCategoryName === 'Sales Order'
                          ? 'https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_images/procurement_4862293.png'
                          : item?.comMainCategoryName === 'Reports'
                          ? 'https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_images/statistics_2672346.png'
                          : item?.comMainCategoryName === 'Customer'
                          ? 'https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_images/rating_2673061.png'
                          : item?.comMainCategoryName === 'MarketPlace'
                          ? 'https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_images/shop_3007247.png'
                          : item?.comMainCategoryName === 'Push Notification'
                          ? 'https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_images/4.png'
                          : item?.comMainCategoryName === 'Help & Support'
                          ? 'https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_images/4961759.png'
                          : null
                      }
                      style={{ height: '50px' }}
                    />
                  </span>
                </CustomCard>
              </div>
            </Grid>
          );
        })}
      </Grid>

      {/* coming soon  */}
      {currentSelected === 'Products' ||
      currentSelected === 'Customer' ||
      currentSelected === 'Reports' ||
      currentSelected === 'User' ? (
        <SoftBox sx={{ position: 'relative' }}>
          <img
            style={{
              margin: '0',
              position: 'absolute',
              top: '10%',
              left: '50%',
              transform: 'translate(-50%, 10%)',
            }}
            src="https://media.istockphoto.com/id/1356466745/vector/vector-illustration-coming-soon-banner-with-clock-sign.jpg?s=612x612&w=0&k=20&c=B3zjuvyrKLWPXmadC1TptchLH6et9P9-Nrr76Pia8Lo="
          />
        </SoftBox>
      ) : null}
    </DashboardLayout>
  );
};

export default NotificationCategory;
