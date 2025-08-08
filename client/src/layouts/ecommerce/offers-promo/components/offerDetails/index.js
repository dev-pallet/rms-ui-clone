import { Box, Card, CardContent, Grid, Menu, MenuItem, Modal } from '@mui/material';
import { createOfferAndPromo, deleteOffer, detailsAllOfferAndPromo } from '../../../../../config/Services';
import { dateFormatter } from '../../../Common/CommonFunction';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from '../../../../../hooks/SnackbarProvider';
import DashboardLayout from '../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../examples/Navbars/DashboardNavbar';
import DetailCategoryLevel from './components/categoryLevel';
import DetailIemLevel from './components/itemLevel';
import React, { useEffect, useState } from 'react';
import SoftBox from '../../../../../components/SoftBox';
import SoftButton from '../../../../../components/SoftButton';
import SoftTypography from '../../../../../components/SoftTypography';
import Spinner from '../../../../../components/Spinner';
import Status from '../../../Common/Status';

const OfferAndPromoDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();
  const [loader, setLoader] = useState(false);
  const [statusModal, setStatusModal] = useState(false);
  const [submitLoader, setSubmitLoader] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState(false);
  const [data, setData] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const user_name = localStorage.getItem('user_name');
  const user_details = JSON.parse(localStorage.getItem('user_details'));
  const uidx = user_details.uidx;
  const open = Boolean(anchorEl);
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    detailsOffer();
  }, []);

  const detailsOffer = () => {
    setLoader(true);
    detailsAllOfferAndPromo(id)
      .then((res) => {
        setLoader(false);
        if (res?.data?.data?.es) {
          showSnackbar(res?.data?.data?.message || 'Some error occured', 'error');
          return;
        }
        const response = res?.data?.data?.data;
        setData(response);
      })
      .catch((err) => {
        setLoader(false);
        showSnackbar(err?.response?.data?.message || 'Some error occured', 'error');
      });
  };

  function formatString(inputString) {
    const words = inputString?.toLowerCase().split('_');
    const formattedString = words?.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    return formattedString;
  }

  const handleCloseModal = () => {
    setStatusModal(false);
  };
  const handleCloseDeletModal = () => {
    setDeleteModal(false);
  };

  const handleStatus = () => {
    setStatusModal(true);
  };
  const handleDeleteOffer = () => {
    setDeleteModal(true);
  };
  const changeStatus = () => {
    handleMenuClose();
    const payload = data;
    payload.offerStatus = data?.offerStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    payload.modifiedBy = uidx;
    payload.modifiedByName = user_name;
    setSubmitLoader(true);
    createOfferAndPromo(payload)
      .then((res) => {
        setSubmitLoader(false);
        if (res?.data?.data?.es) {
          showSnackbar(res?.data?.data?.message, 'error');
          return;
        }
        detailsOffer();
        handleCloseModal();
      })
      .catch((err) => {
        showSnackbar(err?.response?.data?.message, 'error');
        setSubmitLoader(false);
      });
  };

  const handleDelete = () => {
    setDeleteLoader(true);
    deleteOffer(id)
      .then((res) => {
        setDeleteLoader(false);
        if (res?.data?.data?.es) {
          showSnackbar(res?.data?.data?.message, 'error');
          return;
        }
        navigate('/marketting/offers-promotions');
      })
      .catch((err) => {
        setDeleteLoader(false);
        showSnackbar(err?.response?.data?.message, 'error');
      });
  };
  return (
    <DashboardLayout>
      <DashboardNavbar prevLink={true} />
      <SoftBox className="bills-details-top-box">
        <SoftBox className="bills-details-inner-left-box" ml={1}>
          <SoftTypography variant="h6" marginRight="10px">
            {' '}
            <span style={{ fontWeight: 'bold' }}>Offer Name: </span>
            {data?.offerName}
          </SoftTypography>
          {/* <SoftTypography fontSize="12px">Last modified on: {dateFormatter(data?.modifiedOn)}</SoftTypography> */}
        </SoftBox>
        {/* <SoftBox className="bills-details-inner-right-box">
        </SoftBox> */}
        <SoftBox className="bills-details-inner-right-box">
          {data?.offerStatus && <Status label={data?.offerStatus} />}
          <SoftButton className="vendor-second-btn">Edit</SoftButton>
          <SoftButton className="vendor-add-btn" onClick={handleMenu}>
            Status{' '}
          </SoftButton>
        </SoftBox>
        <Menu
          id="account-menu"
          //   className="menu-box"
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          {data?.offerStatus === 'ACTIVE' ? (
            <MenuItem onClick={handleStatus}>
              <Status label="INACTIVE" />
            </MenuItem>
          ) : (
            <MenuItem onClick={handleStatus}>
              <Status label="ACTIVE" />
            </MenuItem>
          )}
          <MenuItem onClick={handleDeleteOffer}>
            <Status label={'DELETE'} />
          </MenuItem>
          <Modal
            open={statusModal}
            onClose={handleCloseModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box className="pi-approve-menu">
              <SoftTypography id="modal-modal-title" variant="h6" component="h2">
                Are you sure you want to change status ?
              </SoftTypography>
              <SoftBox className="pi-approve-btns-div" style={{ gap: '10px' }}>
                <SoftButton className="vendor-second-btn" onClick={handleCloseModal}>
                  Cancel
                </SoftButton>
                <SoftButton className="vendor-add-btn" onClick={changeStatus} disabled={submitLoader ? true : false}>
                  {submitLoader ? <Spinner size={20} /> : <> Save </>}
                </SoftButton>
              </SoftBox>
            </Box>
          </Modal>
          <Modal
            open={deleteModal}
            onClose={handleCloseDeletModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box className="pi-approve-menu">
              <SoftTypography id="modal-modal-title" variant="h6" component="h2">
                Are you sure you want to delete the offer ?
              </SoftTypography>
              <SoftBox className="pi-approve-btns-div" style={{ gap: '10px' }}>
                <SoftButton className="vendor-second-btn" onClick={handleCloseDeletModal}>
                  Cancel
                </SoftButton>
                <SoftButton className="vendor-add-btn" onClick={handleDelete} disabled={deleteLoader ? true : false}>
                  {deleteLoader ? <Spinner size={20} /> : <> Save </>}
                </SoftButton>
              </SoftBox>
            </Box>
          </Modal>
        </Menu>
      </SoftBox>
      <SoftBox my={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4} lg={4}>
            <Card>
              <CardContent>
                <SoftTypography variant="h6" fontWeight="bold" mb={1}>
                  {' '}
                  Offer Type
                </SoftTypography>
                <SoftTypography variant="h6">
                  {' '}
                  {data ? (data?.offerType === 'OFFER_ON_MRP' ? 'Offer on MRP' : formatString(data?.offerType)) : 'NA'}
                </SoftTypography>
              </CardContent>
            </Card>
          </Grid>
          {data?.offerSubType && (
            <Grid item xs={12} md={4} lg={4}>
              <Card>
                <CardContent>
                  <SoftTypography variant="h6" fontWeight="bold" mb={1}>
                    {' '}
                    Offer Subtype
                  </SoftTypography>
                  <SoftTypography variant="h6"> {data?.offerSubType || 'NA'}</SoftTypography>
                </CardContent>
              </Card>
            </Grid>
          )}
          <Grid item xs={12} md={4} lg={4}>
            <Card>
              <CardContent>
                <SoftTypography variant="h6" fontWeight="bold" mb={1}>
                  Channel
                </SoftTypography>
                <SoftTypography variant="h6"> {data ? data?.channels?.join(', ') : 'NA'}</SoftTypography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4} lg={4}>
            <Card>
              <CardContent>
                <SoftTypography variant="h6" fontWeight="bold" mb={1}>
                  Created By
                </SoftTypography>
                <SoftTypography variant="h6"> {data ? `${data?.createdByName} on ${dateFormatter(data?.createdOn)} ` : 'NA'}</SoftTypography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4} lg={4}>
            <Card>
              <CardContent>
                <SoftTypography variant="h6" fontWeight="bold" mb={1}>
                  Valid From - Valid Upto
                </SoftTypography>
                <SoftTypography fontSize="13px">
                  {' '}
                  {data?.validFrom ? new Date(data?.validFrom).toISOString().split('T')[0] : 'NA'} -{' '}
                  {data?.validUpto ? new Date(data?.validUpto).toISOString().split('T')[0] : 'NA'}
                </SoftTypography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4} lg={4}>
            <Card>
              <CardContent>
                <SoftTypography variant="h6" fontWeight="bold" mb={1}>
                  Time From - Time Upto
                </SoftTypography>
                <SoftTypography fontSize="13px">
                  {' '}
                  {data?.timeFrom ? data?.timeFrom : 'NA'} - {data?.timeUpto ? data?.timeUpto : 'NA'}
                </SoftTypography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4} lg={4}>
            <Card>
              <CardContent>
                <SoftTypography variant="h6" fontWeight="bold" mb={1}>
                  Modified By
                </SoftTypography>
                <SoftTypography variant="h6"> {data ? `${data?.modifiedByName} on ${dateFormatter(data?.modifiedOn)} ` : 'NA'}</SoftTypography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Grid item xs={12} lg={12} mt={2}>
          {data?.mainCategory === null || data?.brand === null || data?.brand?.length === 0 ? (
            loader ? (
              <Spinner size={20} />
            ) : (
              <DetailIemLevel data={data} loader={loader} />
            )
          ) : loader ? (
            <Spinner size={20} />
          ) : (
            <DetailCategoryLevel data={data} loader={loader} />
          )}
        </Grid>
      </SoftBox>
    </DashboardLayout>
  );
};

export default OfferAndPromoDetails;
