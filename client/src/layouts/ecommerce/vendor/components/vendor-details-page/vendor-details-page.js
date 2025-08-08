import SoftBox from 'components/SoftBox';
import SoftButton from 'components/SoftButton';
import SoftTypography from 'components/SoftTypography';
import Spinner from 'components/Spinner/index';
import { getVendorSKUData } from 'config/Services';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import { Order } from 'layouts/ecommerce/vendor/components/Order/order';
import { Overview } from 'layouts/ecommerce/vendor/components/Overview/overviewbox';
import { Purchases } from 'layouts/ecommerce/vendor/components/Purchases/purchases';
import { Statement } from 'layouts/ecommerce/vendor/components/Statement/Statement';
import { useNavigate, useParams } from 'react-router-dom';
import DefaultLogo from '../../../../../assets/images/default-profile-logo.jpg';
import SoftInput from '../../../../../components/SoftInput';
import MoreVertIcon from '@mui/icons-material/MoreVert';

// @mui material components
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Modal from '@mui/material/Modal';

// styles
import './vendor-details-page';
import './vendor-details-page.css';

// Soft UI Dashboard PRO React base styles
import breakpoints from 'assets/theme/base/breakpoints';
import { useEffect, useState } from 'react';

// Images

import CircleIcon from '@mui/icons-material/Circle';
import EditIcon from '@mui/icons-material/Edit';
import { InputLabel, Menu, MenuItem } from '@mui/material';
import { vendorBaseData } from 'datamanagement/customerdataSlice';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import {
  updateVendorDisplayName,
  updateVendorStatus,
  uploadVendorLogo,
  vendorAvailableStockValue,
  vendorOverviewDetails,
} from '../../../../../config/Services';
import { buttonStyles } from '../../../Common/buttonColor';
import HorizontalCardDetails from '../../../Common/new-ui-common-components/HorizontalCardDetails/HorizontalCardDetails';
import { isSmallScreen } from '../../../Common/CommonFunction';
import CreditNoteTransfer from './credit-note-transfer-creation';
import { SwapVert } from '@mui/icons-material';

export const VendorDetailsPage = () => {
  const isMobileDevice = isSmallScreen();
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const navigate = useNavigate();
  const { vendorId } = useParams();
  const dispatch = useDispatch();
  const vendorData = useSelector((state) => state.vendorBaseDetails);
  const vendBaseData = vendorData?.vendorBaseDetails[0];
  const [creditTransferCreated, setCreditTransferCreated] = useState(false);

  const [status, setStatus] = useState({
    tab1: true,
    tab2: false,
    tab3: false,
    tab4: false,
  });
  const [loader, setLoader] = useState(false);
  const [tabsOrientation, setTabsOrientation] = useState('horizontal');
  const [tabValue, setTabValue] = useState(0);
  const [editDisplayName, setEditDisplayName] = useState(false);
  const [changeDisplayName, setChangeDisplayName] = useState('');
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [previewImg, setPreviewImg] = useState('');
  const [vendorLogoUpdate, setVendorLogoUpdate] = useState('');
  const [vendorOverViewData, setVendorOverviewData] = useState('');
  const [cards, setCards] = useState([]);
  const [availableStock, setAvailableStock] = useState(null);
  const [servicableStores, setServicableStores] = useState(['NA']);
  const [vendorPaymentUrl, setVendorPaymentUrl] = useState(['NA']);
  const user_roles = localStorage.getItem('user_roles');
  const vendorApprover = user_roles?.includes('VENDOR_APPROVER');
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const [OpenCreditTransfer, setOpenCreditTransfer] = useState(false);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOpenModal = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setPreviewImg('');
  };

  const handleImageUpload = (event) => {
    const imageFile = event.target.files[0];
    setVendorLogoUpdate(imageFile);
    const imageUrl = URL.createObjectURL(imageFile);
    setPreviewImg(imageUrl);
  };

  const handleModalSave = () => {
    const formData = new FormData();
    formData.append('file', vendorLogoUpdate);
    uploadVendorLogo(vendorId, formData)
      .then((result) => {
        setImage(previewImg);
        setPreviewImg('');
        setVendorLogoUpdate('');
        setOpen(false);
      })
      .catch((err) => {
        setOpen(false);
      });
  };

  const handleEditDisplayName = () => {
    setEditDisplayName(true);
    if (changeDisplayName.length) {
      setChangeDisplayName(changeDisplayName);
    } else {
      setChangeDisplayName(vendBaseData?.displayName);
    }
  };

  const handleCancelDisplayName = () => {
    setChangeDisplayName(vendBaseData?.displayName);
    setEditDisplayName(false);
  };

  const handleUpdateDisplayName = () => {
    const payload = {
      vendorId: vendorId,
      displayName: changeDisplayName,
    };

    updateVendorDisplayName(payload)
      .then((response) => {
        const updatedDisplayName = response.data.data.displayName;
        dispatch(vendorBaseData({ ...vendBaseData, displayName: updatedDisplayName }));
        setChangeDisplayName(updatedDisplayName);
        setEditDisplayName(false);
      })
      .catch((error) => {
        setEditDisplayName(false);
      });
  };

  useEffect(() => {
    const data = vendBaseData?.vendorDelivery?.deliveryOptions?.map((item) => item?.deliveryStores);
    setServicableStores(data || ['NA']);
    setVendorPaymentUrl(vendBaseData?.vendorPurchasePayment?.notes);
  }, [vendBaseData]);

  useEffect(() => {
    // A function that sets the orientation state of the tabs.
    function handleTabsOrientation() {
      return window.innerWidth < breakpoints.values.sm
        ? setTabsOrientation('vertical')
        : setTabsOrientation('horizontal');
    }

    /** 
     The event listener that's calling the handleTabsOrientation function when resizing the window.
    */
    window.addEventListener('resize', handleTabsOrientation);

    // Call the handleTabsOrientation function to set the state with the initial value.
    handleTabsOrientation();

    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleTabsOrientation);
  }, [tabsOrientation]);

  const handleSetTabValue = (event, newValue) => {
    setTabValue(newValue);
    if (newValue == 0) {
      setStatus({
        tab1: true,
        tab2: false,
        tab3: false,
        tab4: false,
      });
    } else if (newValue == 1) {
      setStatus({
        tab1: false,
        tab2: true,
        tab3: false,
        tab4: false,
      });
    } else if (newValue == 2) {
      setStatus({
        tab1: false,
        tab2: false,
        tab3: true,
        tab4: false,
      });
    } else {
      setStatus({
        tab1: false,
        tab2: false,
        tab3: false,
        tab4: true,
      });
    }
  };

  useEffect(() => {
    if (localStorage.getItem('navigateToSku')) {
      getVendorSKUData(vendorId)
        .then((response) => {})
        .catch((error) => {});
      handleSetTabValue(event, 2);
      localStorage.removeItem('navigateToSku');
    }
  }, []);

  const updateCards = (data, stockValue, vendorCredit) => {
    setCards((prevCards) => [
      {
        title: 'Total Purchase',
        value: data?.totalPurchaseValue || '0',
        count: data?.totalPurchaseCount ? `from ${data?.totalPurchaseCount} orders` : 'from 0 orders',
      },
      {
        title: 'Total Returns',
        value: data?.purchaseReturnValue || '0',
        count: data?.purchaseReturnCount ? `from ${data?.purchaseReturnCount} returns` : 'from 0 returns',
      },
      {
        title: 'Debit notes',
        value: data?.debitNoteValue || '0',
        count: data?.debitNoteOpen ? `open ${data?.debitNoteOpen} days` : 'open 0 days',
      },
      {
        title: (
          <div>
            Credit notes{' '}
            {Number(vendBaseData?.vendorCredit?.availableCredits) > 0 ? 
                <SwapVert
                  style={{ width: '20px', height: '20px' }}
                  className="cursor-pointer"
                  onClick={() => setOpenCreditTransfer(true)}
                />
                :null
            }
          </div>
        ),
        value: vendorCredit || '0',
        count: 'from 0 returns',
      },
      {
        title: 'Wastages',
        value: data?.returnWastage || '0',
        count: data?.returnWastageUnit ? `from ${data?.returnWastageUnit} units` : 'from 0 units',
      },
      {
        title: 'Current stock value',
        value: stockValue?.stockValue ? Math.round(stockValue?.stockValue) : 'NA',
        count: 'from 1 locations',
      },
      {
        title: 'Orders in progress',
        value: data?.orderInProgress || '0',
        count: data?.orderInProgressCount ? `from ${data?.orderInProgressCount} orders` : 'from 0 orders',
      },
    ]);
  };
  const fetchAvailableStock = async () => {
    const payload = {
      orgId: orgId,
      locationId: locId,
      vendorIdList: [vendorId],
    };
    try {
      const res = await vendorAvailableStockValue(payload);
      if (res?.data?.data?.es == 0) {
        const result = res?.data?.data?.data;
        return result[0];
      }
    } catch (err) {}
    return 'NA';
  };
  const fetchDataAndUpdateCards = async () => {
    const payload = {
      vendorId: vendorId,
      from: '',
      locId: locId,
      to: moment().format('YYYY-MM-DD'),
    };
    try {
      const res = await vendorOverviewDetails(payload);
      const data = res?.data?.data || [];
      const stockValue = await fetchAvailableStock();
      const vendorCredit = await vendBaseData?.vendorCredit?.availableCredits;
      setVendorOverviewData(data);
      updateCards(data, stockValue, vendorCredit);
    } catch (err) {
      console.error(err);
    }
  };
  const handleRedirect = () => {
    if (vendorPaymentUrl) {
      window.open(vendorPaymentUrl, '_blank');
    }
  };

  useEffect(() => {
    fetchDataAndUpdateCards();
  }, [vendorId, vendBaseData]);

  // const updateCreditNoteCard = (vendBaseData) => {
  //   if (vendBaseData?.vendorCredit?.availableCredits) {
  //     setCards((prevCards) => [
  //       ...prevCards.filter((card) => card.title !== 'Credit notes'),
  //       {
  //         title: 'Credit notes',
  //         value: vendBaseData?.vendorCredit?.availableCredits || '0',
  //         count: 'from 0 returns',
  //       },
  //     ]);
  //   }
  // };
  // useEffect(() => {
  //   updateCreditNoteCard(vendBaseData);
  // }, [vendBaseData]);

  const getInitials = (name) => {
    if (!name) {
      return '';
    }
    const words = name.split(' ');
    if (words.length > 1) {
      return words[0].charAt(0).toUpperCase() + words[1].charAt(0).toUpperCase();
    }
    return words[0].charAt(0).toUpperCase();
  };

  const handleVendorOptions = (vendorStatus) => {
    const payload = {
      vendorId: vendorId,
      status: vendorStatus,
      orgId: orgId,
      locId: locId,
    };
    updateVendorStatus(payload)
      .then((res) => {
        handleMenuClose();
      })
      .catch((err) => {
        handleMenuClose();
      });
  };

  const defaultImg =
    'https://storage.googleapis.com/download/storage/v1/b/twinleaves_dev_public/o/Vendor_Images%2Fprofile%2FlogoV000049?generation=1713858618932097&alt=media';
  return (
    <DashboardLayout>
      {OpenCreditTransfer ? (
        <CreditNoteTransfer
          orgId={orgId}
          displayName={vendBaseData?.displayName}
          vendorName={vendBaseData?.vendorName}
          vendorCredits={vendBaseData?.vendorCredit?.availableCredits || 'N/A'}
          vendorId={vendBaseData?.vendorId}
          OpenCreditTransfer={OpenCreditTransfer}
          setOpenCreditTransfer={setOpenCreditTransfer}
          isMobileDevice={isMobileDevice}
          setCreditTransferCreated={setCreditTransferCreated}
        />
      ) : null}
      {!isMobileDevice && <DashboardNavbar prevLink={true} />}
      <SoftBox p={isMobileDevice && 2}>
        <Card className="vendorCardContainer" style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', right: '15px', top: '0px', cursor: 'pointer' }}>
            <MoreVertIcon
              // onClick={() => navigate(`/purchase/edit-vendor/${vendorId}`)}
              onClick={handleMenuOpen}
            />
          </div>
          <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}></Box>
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={isMenuOpen}
            onClose={handleMenuClose}
            onClick={handleMenuClose}
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
                '&::before': {
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
            <MenuItem onClick={() => handleVendorOptions('REJECTED')} disabled={!vendorApprover}>
              Not approved
            </MenuItem>
            <MenuItem onClick={() => handleVendorOptions('APPROVED')} disabled={!vendorApprover}>
              Approve
            </MenuItem>
            <MenuItem onClick={() => handleVendorOptions('BLACKLISTED')} disabled={!vendorApprover}>
              Blacklist
            </MenuItem>

            <MenuItem onClick={() => navigate(`/purchase/edit-vendor/${vendorId}`)} disabled={!vendorApprover}>
              Edit
            </MenuItem>
          </Menu>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={1.5}>
              {/* <Badge
                  color="secondary"
                  className="pencil-icon"
                  id="vendor-logo-edit-badge"
                  style={{ cursor: 'pointer' }}
                  badgeContent={<ModeEditIcon sx={{ fontSize: '5px' }} />}
                  onClick={handleOpenModal}
                /> */}

              {image !== null ? (
                <Box>
                  <img
                    src={image || vendBaseData?.vendorLogo || defaultImg}
                    style={{ height: '90px', width: '90px', borderRadius: '8px' }}
                    alt=""
                  />
                </Box>
              ) : (
                <Box className="vendorImage-style">
                  <span className="vendorLogo-text">{getInitials(vendBaseData?.displayName)} </span>
                </Box>
              )}
            </Grid>
            <Grid item xs={12} md={6.2}>
              <SoftBox height="100%" mt={0.5} lineHeight={1}>
                {editDisplayName ? (
                  <Box style={{ display: 'flex' }}>
                    <SoftInput
                      value={changeDisplayName}
                      onChange={(e) => setChangeDisplayName(e.target.value)}
                      sx={{ maxWidth: '50%' }}
                    ></SoftInput>
                    <SaveIcon onClick={handleUpdateDisplayName} style={{ cursor: 'pointer' }} />
                    <CancelIcon onClick={handleCancelDisplayName} style={{ cursor: 'pointer' }} />
                  </Box>
                ) : (
                  <Box style={{ display: 'flex' }} mb={1}>
                    <SoftTypography variant="caption" fontWeight="bold" fontSize="16px">
                      {changeDisplayName.length ? changeDisplayName : vendBaseData?.displayName}
                    </SoftTypography>
                    {/* <EditIcon
                      fontSize="small"
                      style={{ marginLeft: '0.5rem', cursor: 'pointer' }}
                      onClick={handleEditDisplayName}
                    /> */}
                  </Box>
                )}
                <InputLabel sx={{ fontSize: '0.75rem', color: '#344767' }}>Legal name</InputLabel>
                <SoftTypography variant="button" color="text" fontWeight="medium" fontSize="13px">
                  {vendBaseData?.vendorName || '---'}
                </SoftTypography>

                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '10px' }}>
                  <InputLabel sx={{ fontSize: '0.75rem', color: '#344767' }}>Servicable stores</InputLabel>
                  {servicableStores?.map((item) => (
                    <button className="vendorLocationbtn">{item}</button>
                  ))}
                  {/* <button className="vendorLocationbtn">All</button>
                  <button className="vendorLocationbtn">Erode</button> */}
                </div>
              </SoftBox>
            </Grid>
            <Grid item xs={12} md={4.3} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <div>
                <SoftTypography
                  className="vendorCardHeading"
                  style={{ color: '#505050', fontWeight: '600', fontSize: '15px' }}
                >
                  Outstanding payables
                </SoftTypography>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    marginBottom: '10px',
                    justifyContent: 'space-between',
                  }}
                >
                  <SoftTypography className="vendorCardValue">
                    ₹ {vendorOverViewData?.outstandingPayable || 'NA'}{' '}
                    <span style={{ fontSize: '0.73rem' }}>
                      {vendorOverViewData?.outstandingDueDays
                        ? `Due in ${vendorOverViewData?.outstandingDueDays} days`
                        : 'NA'}
                    </span>
                  </SoftTypography>
                  {vendorPaymentUrl ? (
                    <a href={vendorPaymentUrl} target="_blank" rel="noopener noreferrer">
                      <SoftButton color="info" size="small">
                        Pay now
                      </SoftButton>
                    </a>
                  ) : (
                    <SoftButton color="info" size="small">
                      Pay now
                    </SoftButton>
                  )}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  <SoftTypography style={{ fontSize: '0.73rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    {<CircleIcon sx={{ color: '#ff9500' }} />}{' '}
                    {vendorOverViewData?.pendingDebitNote !== 'null' ? vendorOverViewData?.pendingDebitNote : 'NA'}{' '}
                    pending debit note
                  </SoftTypography>
                  <SoftTypography style={{ fontSize: '0.73rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    {<CircleIcon sx={{ color: '#4fb061' }} />} NA un-used credit
                  </SoftTypography>
                  <SoftTypography style={{ fontSize: '0.73rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    {<CircleIcon sx={{ color: '#ff3b30' }} />}{' '}
                    {vendorOverViewData?.pendingPurchaseReturns !== 'null'
                      ? vendorOverViewData?.pendingPurchaseReturns
                      : 'NA'}{' '}
                    pending purchase returns
                  </SoftTypography>
                </div>
              </div>
              {/* <AppBar position="static">
                <Tabs
                  orientation={tabsOrientation}
                  value={tabValue}
                  onChange={handleSetTabValue}
                  sx={{ background: 'transparent' }}
                >
                  <Tab label="Overview" />
                  <Tab label="Purchases" />
                  <Tab label="SKU's" />
                  <Tab label="Statement" />
                </Tabs>
              </AppBar> */}
            </Grid>
          </Grid>
        </Card>
      </SoftBox>

      <HorizontalCardDetails cards={cards} />

      <SoftBox>
        {loader && <Spinner />}
        {status.tab1 ? <Overview vendorOverViewData={vendorOverViewData} creditTransferCreated={creditTransferCreated}/> : null}
        {status.tab2 ? <Purchases /> : null}
        {status.tab3 ? <Order /> : null}
        {status.tab4 ? <Statement /> : null}
      </SoftBox>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="vendor-logo-select">
          <Box className="vendor-logo-box">
            <Box className="cancel-icon-modal" onClick={handleClose}>
              <CancelIcon fontSize="medium" />
            </Box>
            <Box className="modal-preview-image">
              {previewImg ? (
                <img src={previewImg} alt="" className="img-preview" />
              ) : (
                <Box className="input-file-box">
                  {/* <label for="file">Choose file to upload</label> */}
                  <img src={DefaultLogo} className="default-img-upload" />
                  <input
                    type="file"
                    id="file"
                    name="file"
                    onChange={handleImageUpload}
                    className="input-file-upload"
                    style={{ display: 'block', position: 'relative', left: '0rem' }}
                  />
                </Box>
              )}
            </Box>
            <Box className="cancel-save-btn-modal">
              <SoftButton
                // className="form-button-i"
                variant={buttonStyles.outlinedColor}
                className="outlined-softbutton"
                style={{ marginRight: '1rem' }}
                onClick={handleClose}
              >
                Cancel
              </SoftButton>
              <SoftButton className="form-button-submit-i" onClick={handleModalSave}>
                Save
              </SoftButton>
            </Box>
          </Box>
        </Box>
      </Modal>
    </DashboardLayout>
  );
};
