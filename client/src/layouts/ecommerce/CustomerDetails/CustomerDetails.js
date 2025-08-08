import './CustomerDetails.css';
import { Credit } from './components/Credit/credit';
import { Order } from './components/Order/order';
import { Overview } from './components/Overview/overviewbox';
import { Statement } from './components/Statement/Statement';
import { customerBaseData } from 'datamanagement/customerdataSlice';
import { updateRetailLogo, uploadRetailLogo } from '../../../config/Services';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import CancelIcon from '@mui/icons-material/Cancel';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import DefaultLogo from '../../../assets/images/default-profile-logo.jpg';
import EditIcon from '@mui/icons-material/Edit';
import Modal from '@mui/material/Modal';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import SaveIcon from '@mui/icons-material/Save';
import SoftBox from 'components/SoftBox';
import SoftButton from 'components/SoftButton';
import SoftInput from 'components/SoftInput';
import SoftTypography from 'components/SoftTypography';
// import { Statement } from './components/Statement/Statement';

// @mui material components
import AppBar from '@mui/material/AppBar';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import SoftAvatar from 'components/SoftAvatar';

// Soft UI Dashboard PRO React base styles
import breakpoints from 'assets/theme/base/breakpoints';

import { updateCustomerDisplayName } from '../../../config/Services';
import { useDispatch, useSelector } from 'react-redux';

//
export const CustomerDetails = () => {
  const { retailId } = useParams();
  const dispatch = useDispatch();
  const custData = useSelector((state) => state.customerBaseDetails);
  const custBaseData = custData.customerBaseDetails[0];

  const [customerLogo, setCustomerLogo] = useState('');
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [previewImg, setPreviewImg] = useState('');
  const [customerLogoUpdate, setCustomerLogoUpdate] = useState('');
  const [editDisplayName, setEditDisplayName] = useState(false);
  const [changeDisplayName, setChangeDisplayName] = useState('');

  const user_details = localStorage.getItem('user_details');
  const uidx = JSON.parse(user_details).uidx;

  useEffect(() => {
    if (custBaseData !== undefined) {
      setCustomerLogo(custBaseData?.logo);
    }
  }, [custBaseData]);

  const [status, setStatus] = useState({
    tab1: true,
    tab2: false,
    tab3: false,
    tab4: false,
  });
  const [store, setStore] = useState({
    allstore: true,
    store1: false,
    store2: false,
    store3: false,
    store4: false,
    store5: false,
    store6: false,
  });
  const [str, setStr] = useState('');

  const changeLayout = (a, b, c, d) => {
    setStatus({
      tab1: a,
      tab2: b,
      tab3: c,
      tab4: d,
    });
  };

  const dummy = [
    { label: 'The Shawshank Redemption', year: 1994 },
    { label: 'The Godfather', year: 1972 },
    { label: 'The Godfather: Part II', year: 1974 },
    { label: 'The Dark Knight', year: 2008 },
    { label: '12 Angry Men', year: 1957 },
    { label: 'Schindler\'s List', year: 1993 },
    { label: 'Pulp Fiction', year: 1994 },
  ];
  const [tabsOrientation, setTabsOrientation] = useState('horizontal');
  const [tabValue, setTabValue] = useState(0);

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

  const handleOpenModal = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setPreviewImg('');
  };

  const handleImageUpload = (event) => {
    const imageFile = event.target.files[0];
    setCustomerLogoUpdate(imageFile);
    const imageUrl = URL.createObjectURL(imageFile);
    setPreviewImg(imageUrl);
  };

  const handleModalSave = () => {
    const formData = new FormData();
    formData.append('file', customerLogoUpdate);

    //

    let logoUrl = '';
    uploadRetailLogo(formData)
      .then((response) => {
        //
        logoUrl = response.data.data.fileUrl;

        //
        const payload = {
          logoUrl: logoUrl,
          retailId: retailId,
          updatedBy: uidx,
        };
        try {
          updateRetailLogo(payload).then((response) => {
            //
            setImage(previewImg);
            setPreviewImg('');
            setCustomerLogoUpdate('');
            setOpen(false);
          });
        } catch (error) {
          setOpen(false);
        }
      })
      .catch((error) => {
        setOpen(false);
      });
  };

  const handleEditDisplayName = () => {
    setEditDisplayName(true);
    if (changeDisplayName.length) {
      setChangeDisplayName(changeDisplayName);
    } else {
      setChangeDisplayName(custBaseData?.displayName);
    }
  };

  const handleCancelDisplayName = () => {
    setChangeDisplayName(custBaseData?.displayName);
    setEditDisplayName(false);
  };

  const handleUpdateDisplayName = () => {
    const payload = {
      displayName: changeDisplayName,
      retailId: retailId,
      updatedBy: uidx,
    };
    updateCustomerDisplayName(payload)
      .then((response) => {
        const updatedDisplayName = response.data.data.retail.displayName;
        setChangeDisplayName(updatedDisplayName);
        dispatch(customerBaseData({ ...custBaseData, displayName: updatedDisplayName }));
        setEditDisplayName(false);
      })
      .catch((error) => {
        setEditDisplayName(false);
      });
  };

  return (
    <DashboardLayout>
      <SoftBox position="relative">
        <DashboardNavbar absolute light prevLink={true} />
        <SoftBox
          display="flex"
          alignItems="center"
          position="relative"
          minHeight="10.75rem"
          borderRadius="xl"
          sx={{
            backgroundColor: '#1890ff',
          }}
        />
        <Card
          sx={{
            backdropFilter: 'saturate(200%) blur(30px)',
            backgroundColor: ({ functions: { rgba }, palette: { white } }) => rgba(white.main, 0.8),
            boxShadow: ({ boxShadows: { navbarBoxShadow } }) => navbarBoxShadow,
            position: 'relative',
            mt: -8,
            mx: 3,
            py: 2,
            px: 2,
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item>
              <Box className="reatil-logo">
                <Badge
                  color="secondary"
                  className="pencil-icon"
                  id="retail-logo-edit-badge"
                  style={{ cursor: 'pointer' }}
                  badgeContent={<ModeEditIcon sx={{ fontSize: '5px' }} />}
                  onClick={handleOpenModal}
                />
                <SoftAvatar
                  src={image !== null ? image : custBaseData?.logoUrl}
                  // src={`https://images.pexels.com/photos/20787/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=350`}
                  alt=""
                  variant="rounded"
                  size="xl"
                  shadow="sm"
                />
              </Box>
            </Grid>
            <Grid item>
              <SoftBox height="100%" mt={0.5} lineHeight={1}>
                {/* <SoftTypography variant="button" color="text" fontWeight="medium">
                  {custBaseData?.displayName}
                </SoftTypography> */}
                {editDisplayName ? (
                  <Box style={{ display: 'flex' }}>
                    <SoftInput
                      value={changeDisplayName}
                      onChange={(e) => setChangeDisplayName(e.target.value)}
                      sx={{ width: '50%' }}
                    ></SoftInput>
                    <SaveIcon onClick={handleUpdateDisplayName} style={{ cursor: 'pointer' }} />
                    <CancelIcon onClick={handleCancelDisplayName} style={{ cursor: 'pointer' }} />
                  </Box>
                ) : (
                  <Box style={{ display: 'flex' }}>
                    <SoftTypography variant="h6" fontWeight="medium" fontSize="13px">
                      {changeDisplayName.length ? changeDisplayName : custBaseData?.displayName}
                    </SoftTypography>
                    <EditIcon
                      fontSize="small"
                      style={{ marginLeft: '0.5rem', cursor: 'pointer' }}
                      onClick={handleEditDisplayName}
                    />
                  </Box>
                )}
                {/* <SoftBox className="store-select-box">
                  <select className="store-select-ul" onChange={(e) => setStr(e.target.value)}>
                    <option className="store-modal-li" value="allstore">
                      All Store
                    </option>
                    <option className="store-modal-li" value="store1">
                      Store 1
                    </option>
                    <option className="store-modal-li" value="store2">
                      Store 2
                    </option>
                    <option className="store-modal-li" value="store3">
                      Store 3
                    </option>
                    <option className="store-modal-li" value="store4">
                      Store 4
                    </option>
                    <option className="store-modal-li" value="store5">
                      Store 5
                    </option>
                    <option className="store-modal-li" value="store6">
                      Store 6
                    </option>
                  </select>
                </SoftBox> */}
              </SoftBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4} sx={{ ml: 'auto' }}>
              <AppBar position="static">
                <Tabs
                  orientation={tabsOrientation}
                  value={tabValue}
                  onChange={handleSetTabValue}
                  sx={{ background: 'transparent' }}
                >
                  <Tab label="Overview" />
                  <Tab label="Orders" />
                  <Tab label="Refund" />
                  <Tab label="Statement" />
                </Tabs>
                {/* <SoftBox className="store-select-box">
                                        <select className="store-select-ul" onChange={(e)=>setStr(e.target.value)}>
                                            <option className="store-modal-li" value="allstore">All Store</option>
                                            <option className="store-modal-li" value="store1">Store 1</option>
                                            <option className="store-modal-li" value="store2">Store 2</option>
                                            <option className="store-modal-li" value="store3">Store 3</option>
                                            <option className="store-modal-li" value="store4">Store 4</option>
                                            <option className="store-modal-li" value="store5">Store 5</option>
                                            <option className="store-modal-li" value="store6">Store 6</option>
                                        </select>
             </SoftBox> */}
              </AppBar>
            </Grid>
          </Grid>
        </Card>
      </SoftBox>
      <SoftBox className="full-range">
        <SoftBox>
          {store.allstore ? (
            <SoftBox className="containerSub">
              {status.tab1 ? <Overview /> : null}
              {status.tab2 ? <Order /> : null}
              {status.tab3 ? <Credit /> : null}
              {status.tab4 ? <Statement /> : null}
            </SoftBox>
          ) : null}
          {store.store1 ? (
            <SoftBox className="containerSub">
              {status.tab1 ? (
                <SoftBox>
                  <SoftTypography variant="h2" className="statement-content">
                    Store Overview Content 1
                  </SoftTypography>
                  <Overview />
                </SoftBox>
              ) : null}
              {status.tab2 ? (
                <SoftBox>
                  <SoftTypography variant="h2" className="statement-content">
                    Store Orders Content 1
                  </SoftTypography>
                  <Order />
                </SoftBox>
              ) : null}
              {status.tab3 ? (
                <SoftBox>
                  <SoftTypography variant="h2" className="statement-content">
                    Store Credit Content 1
                  </SoftTypography>
                  <Credit />
                </SoftBox>
              ) : null}
              {status.tab4 ? (
                <SoftBox className="details-page-box">
                  <SoftBox className="statement-main">
                    <SoftTypography variant="h2" className="statement-content">
                      Store Statement Content 1
                    </SoftTypography>
                    <SoftButton className="statement-btn">Export</SoftButton>
                  </SoftBox>
                  <Statement />
                </SoftBox>
              ) : null}
            </SoftBox>
          ) : null}
          {store.store2 ? (
            <SoftBox className="containerSub">
              {status.tab1 ? (
                <SoftBox>
                  <SoftTypography variant="h2" className="statement-content">
                    Store Overview Content 2
                  </SoftTypography>
                  <Overview />
                </SoftBox>
              ) : null}
              {status.tab2 ? (
                <SoftBox>
                  <SoftTypography variant="h2" className="statement-content">
                    Store Orders Content 2
                  </SoftTypography>
                  <Order />
                </SoftBox>
              ) : null}
              {status.tab3 ? (
                <SoftBox>
                  <SoftTypography variant="h2" className="statement-content">
                    Store Credit Content 2
                  </SoftTypography>
                  <Credit />
                </SoftBox>
              ) : null}
              {status.tab4 ? (
                <SoftBox className="details-page-box">
                  <SoftBox className="statement-main">
                    <SoftTypography variant="h2" className="statement-content">
                      Store Statement Content 2
                    </SoftTypography>
                    <SoftButton className="statement-btn">Export</SoftButton>
                  </SoftBox>
                  <Statement />
                </SoftBox>
              ) : null}
            </SoftBox>
          ) : null}
          {store.store3 ? (
            <SoftBox className="containerSub">
              {status.tab1 ? (
                <SoftBox>
                  <SoftTypography variant="h2" className="statement-content">
                    Store Overview Content 3
                  </SoftTypography>
                  <Overview />
                </SoftBox>
              ) : null}
              {status.tab2 ? (
                <SoftBox>
                  <SoftTypography variant="h2" className="statement-content">
                    Store Orders Content 3
                  </SoftTypography>
                  <Order />
                </SoftBox>
              ) : null}
              {status.tab3 ? (
                <SoftBox>
                  <SoftTypography variant="h2" className="statement-content">
                    Store Credit Content 3
                  </SoftTypography>
                  <Credit />
                </SoftBox>
              ) : null}
              {status.tab4 ? (
                <SoftBox className="details-page-box">
                  <SoftBox className="statement-main">
                    <SoftTypography variant="h2" className="statement-content">
                      Store Statement Content 3
                    </SoftTypography>
                    <SoftButton className="statement-btn">Export</SoftButton>
                  </SoftBox>
                  <Statement />
                </SoftBox>
              ) : null}
            </SoftBox>
          ) : null}
          {store.store4 ? (
            <SoftBox className="containerSub">
              {status.tab1 ? (
                <SoftBox>
                  <SoftTypography variant="h2" className="statement-content">
                    Store Overview Content 4
                  </SoftTypography>
                  <Overview />
                </SoftBox>
              ) : null}
              {status.tab2 ? (
                <SoftBox>
                  <SoftTypography variant="h2" className="statement-content">
                    Store Orders Content 4
                  </SoftTypography>
                  <Order />
                </SoftBox>
              ) : null}
              {status.tab3 ? (
                <SoftBox>
                  <SoftTypography variant="h2" className="statement-content">
                    Store Credit Content 4
                  </SoftTypography>
                  <Credit />
                </SoftBox>
              ) : null}
              {status.tab4 ? (
                <SoftBox className="details-page-box">
                  <SoftBox className="statement-main">
                    <SoftTypography variant="h2" className="statement-content">
                      Store Statement Content 4
                    </SoftTypography>
                    <SoftButton className="statement-btn">Export</SoftButton>
                  </SoftBox>
                  <Statement />
                </SoftBox>
              ) : null}
            </SoftBox>
          ) : null}
          {store.store5 ? (
            <SoftBox className="containerSub">
              {status.tab1 ? (
                <SoftBox>
                  <SoftTypography variant="h2" className="statement-content">
                    Store Overview Content 5
                  </SoftTypography>
                  <Overview />
                </SoftBox>
              ) : null}
              {status.tab2 ? (
                <SoftBox>
                  <SoftTypography variant="h2" className="statement-content">
                    Store Orders Content 5
                  </SoftTypography>
                  <Order />
                </SoftBox>
              ) : null}
              {status.tab3 ? (
                <SoftBox>
                  <SoftTypography variant="h2" className="statement-content">
                    Store Credit Content 5
                  </SoftTypography>
                  <Credit />
                </SoftBox>
              ) : null}
              {status.tab4 ? (
                <SoftBox className="details-page-box">
                  <SoftBox className="statement-main">
                    <SoftTypography variant="h2" className="statement-content">
                      Store Statement Content 5
                    </SoftTypography>
                    <SoftButton className="statement-btn">Export</SoftButton>
                  </SoftBox>
                  <Statement />
                </SoftBox>
              ) : null}
            </SoftBox>
          ) : null}
          {store.store6 ? (
            <SoftBox className="containerSub">
              {status.tab1 ? (
                <SoftBox>
                  <SoftTypography variant="h2" className="statement-content">
                    Store Overview Content 6
                  </SoftTypography>
                  <Overview />
                </SoftBox>
              ) : null}
              {status.tab2 ? (
                <SoftBox>
                  <SoftTypography variant="h2" className="statement-content">
                    Store Orders Content 6
                  </SoftTypography>
                  <Order />
                </SoftBox>
              ) : null}
              {status.tab3 ? (
                <SoftBox>
                  <SoftTypography variant="h2" className="statement-content">
                    Store Credit Content 6
                  </SoftTypography>
                  <Credit />
                </SoftBox>
              ) : null}
              {status.tab4 ? (
                <SoftBox className="details-page-box">
                  <SoftBox className="statement-main">
                    <SoftTypography variant="h2" className="statement-content">
                      Store Statement Content 6
                    </SoftTypography>
                    <SoftButton className="statement-btn">Export</SoftButton>
                  </SoftBox>
                  <Statement />
                </SoftBox>
              ) : null}
            </SoftBox>
          ) : null}
        </SoftBox>
      </SoftBox>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="retail-logo-select">
          <Box className="retail-logo-box">
            <Box className="cancel-icon-modal" onClick={handleClose}>
              <CancelIcon fontSize="medium" />
            </Box>
            <Box className="modal-preview-image">
              {previewImg ? (
                <img src={previewImg} alt="Preview" className="img-preview" />
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
                className="form-button-i"
                style={{ marginRight: '1rem', border: '1px solid rgb(28, 119, 255)' }}
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
