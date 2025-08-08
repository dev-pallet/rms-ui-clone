import { getAllSubcategories, getSubCategory } from '../../../../config/Services';
import { makeStyles } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import { useSnackbar } from '../../../../hooks/SnackbarProvider';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import Fetchnotification from './Fetchnotification';
import PushNotifications from './PushNotifications';
import React, { useEffect, useState } from 'react';
import SoftBox from '../../../../components/SoftBox';
import SoftSelect from '../../../../components/SoftSelect';

const useStyles = makeStyles((theme) => ({
  filterContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
    marginTop: '30px',
  },
  filterLabel: {
    marginRight: theme.spacing(2),
    fontWeight: 'bold',
  },
  filterSelect: {
    minWidth: 200,
  },
}));

const Allnotificationpage = () => {
  const classes = useStyles();
  const [selectedNotification, setSelectedNotification] = useState('');
  const [selectedNotificationName, setSelectedNotificationName] = useState('');
  const [formattedCategories, setFormattedCategories] = useState([]);
  const [allSub, setAllSub] = useState([]);

  const [categories, setCategories] = useState([]);

  const { id } = useParams();

  const showSnackbar = useSnackbar();

  let dataForSales = [];
  useEffect(() => {
    if (id === 'MCAT00004') {
      // Use Promise.all to wait for both promises to resolve
      Promise.all([getSubCategory('MCAT00004'), getSubCategory('MCAT00009')])
        .then(([res1, res2]) => {
          // Assuming both responses have a similar structure
          dataForSales = res1?.data?.data.concat(res2?.data?.data);
          showSnackbar('Sub-Categories Fetched', 'success');
          setCategories(dataForSales);
        })
        .catch((error) => {
          showSnackbar('Error fetching sub-categories', 'error');
        });
    } else {
      getSubCategory(id).then((res) => {
        setCategories(res?.data?.data);
        showSnackbar('Sub-Categories Fetched', 'success');
      });
    }

  }, [id]);

  useEffect(() => {
    const formattedData = categories.map((category) => ({
      value: `${category.comCategoryId}`,
      label: `${category.comCategoryName}`,
    }));
    setFormattedCategories(formattedData);
  }, [categories]);

  useEffect(() => {
    if (formattedCategories.length > 0) {
      setSelectedNotification(formattedCategories[0].value);
      setSelectedNotificationName(formattedCategories[0].label);
    }
  }, [formattedCategories]);

  const allSubcategories = () => {
    try {
      getAllSubcategories().then((res) => {
        setAllSub(res?.data?.data);
      });
    } catch (error) {
      showSnackbar('Error: Sub-Categories not Fetched', 'error');
    }
  };

  useEffect(() => {
    allSubcategories();
  }, []);

  const renderComponent = () => {
    const selectedSub = allSub.find((sub) => sub.comCategoryName === selectedNotificationName);

    if (selectedSub) {
      if (selectedSub.comCategoryName === 'Transactional Notifications') {
        return (
          <PushNotifications
            comCategoryId={selectedSub.comCategoryId}
            selectedNotification={selectedSub.comCategoryName}
          />
        );
      } else {
        return (
          <Fetchnotification
            comCategoryId={selectedSub.comCategoryId}
            selectedNotification={selectedSub.comCategoryName}
          />
        );
      }
    } else {
      return (
        <img
          src="https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_images/app-development-vectror.png"
          alt=""
          style={{
            borderRadius: '30px',
            marginTop: '30px',
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto',
            width: 'auto',
            height: '430px',
          }}
        />
      );
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar prevLink={true} />
      <SoftBox ml={4} mt={5} maxWidth={300}>
        <SoftSelect
          placeholder={selectedNotificationName}
          options={formattedCategories}
          onChange={(option) => {
            setSelectedNotification(option.value), setSelectedNotificationName(option.label);
          }}
        />
      </SoftBox>
      <div>{renderComponent()}</div>
    </DashboardLayout>
  );
};

export default Allnotificationpage;
