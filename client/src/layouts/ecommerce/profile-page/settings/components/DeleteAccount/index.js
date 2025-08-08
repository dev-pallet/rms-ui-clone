/**
=========================================================
* Soft UI Dashboard PRO React - v4.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-pro-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Card from '@mui/material/Card';
import Switch from '@mui/material/Switch';

// Soft UI Dashboard PRO React components
import './delete.css';
import { Grid } from '@mui/material';
import { clearCookie, isSmallScreen } from '../../../../Common/CommonFunction';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { userLogOut } from '../../../../../../config/Services';
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';
import MobileDrawerCommon from '../../../../Common/MobileDrawer';
import Modal from '@mui/material/Modal';
import SoftBox from 'components/SoftBox';
import SoftButton from 'components/SoftButton';
import SoftTypography from 'components/SoftTypography';
import Swal from 'sweetalert2';
import Typography from '@mui/material/Typography';

function DeleteAccount() {
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    height: 220,
    bgcolor: 'background.paper',
    borderRadius: '7px',
    boxShadow: 24,
    p: 4,
  };

  const navigate = useNavigate();
  const isMobilDevice = isSmallScreen();

  const [modal, setModal] = useState(false);

  const handleDelete = () => {
    setModal(true);
  };

  const handleClose = () => {
    setModal(false);
  };

  const handleLogout = () => {
    const newSwal = Swal.mixin({
      // customClass: {
      //   confirmButton: 'button button-success',
      //   cancelButton: 'button button-error',
      // },
      buttonsStyling: false,
    });

    newSwal
      .fire({
        title: 'Are you sure you want to logout?',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Logout',
        customClass: {
          title: 'custom-swal-title',
          cancelButton: 'logout-cancel-btn',
          confirmButton: 'logout-success-btn' // Added custom class for title
        },
      })
      .then((result) => {
        if (result.isConfirmed) {
          userLogOut()
            .then((res) => {
              Swal.fire({
                icon: 'success',
                title: 'Successfully Logged out',
                showConfirmButton: true,
                confirmButtonText: 'OK',
                customClass: {
                  title: 'custom-swal-title',
                  confirmButton: 'logout-success-btn' // Added custom class for title
                },
              }).then(() => {
                localStorage.clear();
                clearCookie('access_token'); 
                clearCookie('refresh_token'); 
                navigate('/');
              });
            })
            .catch((err) => {
              if (err?.response?.data?.message == 'UnAuthorized Token' || err?.response?.data?.code === 401) {
                Swal.fire({
                  icon: 'success',
                  title: 'Successfully Logged out',
                  showConfirmButton: true,
                  confirmButtonText: 'OK',
                  customClass: {
                    title: 'custom-swal-title',
                    confirmButton: 'logout-success-btn' // Added custom class for title
                  },
                }).then(() => {
                  localStorage.clear(); 
                  clearCookie('access_token');
                  clearCookie('refresh_token');
                  navigate('/');
                });
              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'Unable to Logout',
                  showConfirmButton: true,
                  confirmButtonText: 'OK',
                  customClass: {
                    title: 'custom-swal-title',
                    confirmButton: 'logout-success-btn' // Added custom class for title
                  },
                });
              }
            });
        }
      });
  };

  return (
    <Card id="delete-account" className={`${isMobilDevice && 'po-box-shadow'}`}>
      <SoftBox p={3} lineHeight={1}>
        <SoftBox mb={1}>
          <SoftTypography variant="h5">Delete Account</SoftTypography>
        </SoftBox>
        <SoftTypography variant="button" color="text" fontWeight="regular">
          Once you delete your account, there is no going back. Please be certain.
        </SoftTypography>
      </SoftBox>
      <SoftBox
        pb={3}
        px={3}
        display="flex"
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        flexDirection={{ xs: 'column', sm: 'row' }}
      >
        <SoftBox display="flex" alignItems="center" mb={{ xs: 3, sm: 0 }}>
          <Switch />
          <SoftBox ml={2} lineHeight={0}>
            <SoftTypography display="block" variant="button" fontWeight="medium">
              Confirm
            </SoftTypography>
            <SoftTypography variant="caption" color="text">
              I want to delete my account.
            </SoftTypography>
          </SoftBox>
        </SoftBox>
        <SoftBox display="flex" flexDirection={{ xs: 'column', sm: 'row' }}>
          <SoftButton className="vendor-second-btn" onClick={() => handleLogout()}>
            Logout
          </SoftButton>
          <SoftBox ml={{ xs: 0, sm: 1 }} mt={{ xs: 1, sm: 0 }}>
            <SoftButton className="vendor-add-btn" sx={{ height: '100%' }} onClick={handleDelete}>
              delete account
            </SoftButton>
            {!isMobilDevice ? (
              <Modal
                open={modal}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={12} xl={12} className="taxes-grid-modal-box">
                      <SoftTypography id="modal-modal-title" variant="h6" component="h2">
                        Are you sure you want to delete your account
                      </SoftTypography>
                      <CloseIcon onClick={handleClose} className="close-icon" />
                    </Grid>
                    <Typography className="typography-text">You are not authorized to delete the account</Typography>

                    <SoftBox className="border-bottom-box-pop"></SoftBox>

                    <SoftBox className="grid-button-box">
                      <SoftButton className="vendor-second-btn">Cancel</SoftButton>
                      <SoftButton className="vendor-add-btn">Delete</SoftButton>
                    </SoftBox>
                  </Grid>
                </Box>
              </Modal>
            ) : (
              <MobileDrawerCommon
                anchor="bottom"
                paperProps={{ height: 'auto  !important', maxHeight: '90%' }}
                drawerOpen={modal}
                drawerClose={handleClose}
              >
                <Box className="delete-acc-popup">
                  <SoftTypography id="modal-modal-title" variant="h6" component="h2" sx={{textAlign: 'center'}}> 
                    Are you sure you want to delete your account
                  </SoftTypography>
                  <Typography className="typography-text">You are not authorized to delete the account</Typography>
                  <SoftBox className="del-acc-btns">
                    <SoftButton className="del-acc-cancel-button" variant="outlined">
                      Cancel
                    </SoftButton>
                    <SoftButton className="del-acc-delete-button">DELETE</SoftButton>
                  </SoftBox>
                </Box>
              </MobileDrawerCommon>
            )}
          </SoftBox>
        </SoftBox>
      </SoftBox>
    </Card>
  );
}

export default DeleteAccount;
