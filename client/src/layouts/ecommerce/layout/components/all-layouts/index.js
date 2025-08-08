import './all-layouts.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Grid from '@mui/material/Grid';
import LayoutCard from '../all-layouts/components/layout-card/index';
import Modal from '@mui/material/Modal';
import SkeletonLoader from '../all-layouts/components/layout-skeleton/index';
import SoftButton from 'components/SoftButton';
import sideNavUpdate from '../../../../../components/Utility/sidenavupdate';

import { ToastContainer, toast } from 'react-toastify';
import { injectStyle } from 'react-toastify/dist/inject-style';

import { buttonStyles } from '../../../Common/buttonColor';
import { getAllLayouts } from '../../../../../config/Services';
import UpgradePlan from '../../../../../UpgardePlan';
import crownIcon from '../../../../../assets/images/crown.svg';

const AllLayouts = () => {
  sideNavUpdate();
  injectStyle();
  const navigate = useNavigate();
  const featureSettings = JSON.parse(localStorage.getItem('featureSettings'));

  const [totalLayouts, setTotalLayouts] = useState([]);
  const [loader, setLoader] = useState(false);

  const [openUpgradeModal, setOpenUpgradeModal] = useState(false);

  const handleCloseUpgradeModal = () => {
    setOpenUpgradeModal(false);
  };

  const handleOpenUpgradePlan = () => {
    setOpenUpgradeModal(true);
  };

  const handleNewLayout = () => {
    navigate('/setting/multiple-layout/');
  };

  const getTotalLayouts = () => {
    setLoader(true);
    getAllLayouts()
      .then((res) => {
        const totLayouts = res.data.data.object;
        if (res.data.data.object == null) {
          setLoader(false);
        }
        // setErrorHandler(res.data.data.message);
        // setesClr('success');
        // setOpenAlert(true);

        toast.success(res.data.data.message, {
          toastId: 'once',
          position: 'bottom-left',
          autoClose: 2000,
          theme: 'light',
        });
        setTotalLayouts(totLayouts);
        setLoader(false);
      })
      .catch((err) => {
        toast.error(err.response.data.message, {
          toastId: 'error',
          position: 'bottom-left',
          autoClose: 2000,
          theme: 'light',
        });
        setLoader(false);
      });
  };

  useEffect(() => {
    getTotalLayouts();
    // if (localStorage.getItem('layout_id')) {
    //   localStorage.removeItem('layout_id');
    // }
    if (localStorage.getItem('countsteps')) {
      localStorage.removeItem('countsteps');
    }
    if (localStorage.getItem('reverseStep')) {
      localStorage.removeItem('reverseStep');
    }
    // if (localStorage.getItem('layout_name')) {
    //   localStorage.removeItem('layout_name');
    // }
    if (localStorage.getItem('layoutName')) {
      localStorage.removeItem('layoutName');
    }
    if (localStorage.getItem('definitionName')) {
      localStorage.removeItem('definitionName');
    }
    if (localStorage.getItem('definitionId')) {
      localStorage.removeItem('definitionId');
    }
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <SoftButton
          variant={buttonStyles.primaryVariant}
          // className="vendor-add-btn"
          className="contained-softbutton"
          // onClick={handleNewLayout}
          onClick={
            featureSettings !== null && featureSettings['MULTIPLE_LAYOUT_CREATION'] == 'FALSE'
              ? handleOpenUpgradePlan
              : handleNewLayout
          }
          // sx={{
          //   backgroundColor: '#0562fb',
          //   color: '#ffffff',
          // }}
        >
          {featureSettings !== null && featureSettings['MULTIPLE_LAYOUT_CREATION'] == 'FALSE' ? (
            <img src={crownIcon} style={{ height: '1.5rem' }} />
          ) : null}
          <AddIcon />
          New
        </SoftButton>
      </Box>

      <Box className="all-layouts">
        <Grid container spacing={2} p={1}>
          {totalLayouts !== null && !loader ? (
            totalLayouts.map((layout) => (
              <Grid item lg={4} md={4} xl={4} xs={12} key={layout.layoutId}>
                <LayoutCard layout={layout} totalLayouts={totalLayouts} setTotalLayouts={setTotalLayouts} />
              </Grid>
            ))
          ) : totalLayouts == null && !loader ? null : (
            <SkeletonLoader />
          )}
        </Grid>
      </Box>

      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Modal
        open={openUpgradeModal}
        onClose={handleCloseUpgradeModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            width: '60vw',
            height: '70vh',
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'center',
            margin: 'auto',
            marginTop: '6rem',
            borderRadius: '1rem',
            overflow: 'auto',
            position: 'relative',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: '-6rem',
              bottom: '3rem',
              width: '100%',
            }}
          >
            <UpgradePlan />
          </Box>
        </Box>
      </Modal>
    </DashboardLayout>
  );
};

export default AllLayouts;
