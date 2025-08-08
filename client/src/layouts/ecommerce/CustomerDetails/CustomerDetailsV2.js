import CancelIcon from '@mui/icons-material/Cancel';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import SoftBox from 'components/SoftBox';
import SoftButton from 'components/SoftButton';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import DefaultLogo from '../../../assets/images/default-profile-logo.jpg';
import { updateRetailLogo, uploadRetailLogo } from '../../../config/Services';
import './CustomerDetails.css';
import { Overview } from './components/Overview/overviewboxV2';
// import { Statement } from './components/Statement/Statement';

// @mui material components

import SoftAvatar from 'components/SoftAvatar';

// Soft UI Dashboard PRO React base styles
import breakpoints from 'assets/theme/base/breakpoints';

import { useDispatch, useSelector } from 'react-redux';
import { updateCustomerDisplayName } from '../../../config/Services';
import { displayNameFirstLetter, isSmallScreen } from '../Common/CommonFunction';

//
export const CustomerDetails = () => {
  const { retailId, phoneNumber } = useParams();
  const dispatch = useDispatch();
  const custData = useSelector((state) => state.customerBaseDetails);
  const custBaseData = custData.customerBaseDetails[0];
  const isMobileDevice = isSmallScreen();

  const [customerLogo, setCustomerLogo] = useState('');
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [previewImg, setPreviewImg] = useState('');
  const [customerLogoUpdate, setCustomerLogoUpdate] = useState('');
  const [editDisplayName, setEditDisplayName] = useState(false);
  const [changeDisplayName, setChangeDisplayName] = useState('');

  const user_details = localStorage.getItem('user_details');
  const uidx = JSON.parse(user_details)?.uidx;

  useEffect(() => {
    if (custBaseData !== undefined) {
      setCustomerLogo(custBaseData?.logo);
    }
  }, [custBaseData]);

  const [tabsOrientation, setTabsOrientation] = useState('horizontal');

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

    let logoUrl = '';
    uploadRetailLogo(formData)
      .then((response) => {
        logoUrl = response?.data?.data?.fileUrl;
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

  const logo = useMemo(
    () => (
      <>
        {custBaseData?.logoUrl ? (
          <SoftAvatar
            src={custBaseData?.logoUrl !== null ? image : custBaseData?.logoUrl }
            alt=""
            variant="rounded"
            shadow="sm"
            sx={{ width: '100px', height: '100px', maxWidth: '135px', maxHeight: '100px' }}
          />
        ) : (
          <div className="vendorImage-style">
            <span className="vendorLogo-text">{displayNameFirstLetter(custBaseData?.displayName)}</span>
          </div>
        )}
      </>
    ),
    [custBaseData?.logoUrl, image],
  );

  return (
    <DashboardLayout>
      {!isMobileDevice && (
        <SoftBox position="relative">
          <DashboardNavbar prevLink={true} />
        </SoftBox>
      )}
      {isMobileDevice ? (
        <div className="purchase-details-main-div purchase-details-all-flex">
          <Overview logo={logo} />
        </div>
      ) : (
        <SoftBox className="full-range">
          <SoftBox className="containerSub">
            <Overview logo={logo} />
          </SoftBox>
        </SoftBox>
      )}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="retail-logo-select">
          <Box className="retail-logo-box-2">
            <Box className="cancel-icon-modal" onClick={handleClose}>
              <CancelIcon fontSize="medium" />
            </Box>
            <Box className="modal-preview-image-2">
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
            <Box className="content-right width-100">
              <SoftButton className="outlined-softbutton" onClick={handleClose}>
                Cancel
              </SoftButton>
              <SoftButton className="contained-softbutton" onClick={handleModalSave}>
                Save
              </SoftButton>
            </Box>
          </Box>
        </Box>
      </Modal>
    </DashboardLayout>
  );
};
