//soft ui components
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import SoftBox from '../../../../components/SoftBox';
import SoftTypography from '../../../../components/SoftTypography';

//mui components
import { Button, Checkbox, Switch } from '@mui/material';

//react
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

//icons
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import SmsIcon from '@mui/icons-material/Sms';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import bluestar from '../../../../assets/images/ecommerce/bluestars.png';

//react carousel
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import SimpleImageSlider from 'react-simple-image-slider';

const label = { inputProps: { 'aria-label': 'Switch demo' } };

export const LoyaltyChannels = () => {

  const navigate = useNavigate();

  const [checked, setChecked] = useState(false);
  const [checkedBox, setCheckedBox] = useState(false);

  const switchHandler = (event) => {
    setChecked(event.target.checked);
  };

  const checkboxHandler = (event) => {
    setCheckedBox(e.target.value);
  };

  const images = [
    { url: 'https://image.similarpng.com/very-thumbnail/2020/04/chat-WhatsApp-template-phone-png.png' },
    { url: 'https://www.heritagechristiancollege.com/wp-content/uploads/2019/05/text-message-templates-free-of-green-iphone-clipart-of-text-message-templates-free.jpg' },
    { url: 'https://i.pinimg.com/originals/31/03/51/3103518011641f79e0c7aa79de6bd8af.jpg' },
    { url: 'https://image.similarpng.com/very-thumbnail/2020/04/chat-screen-WhatsApp-mobile-phone-template-png.png' },
  ];



  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox className="loyalty-config-next-btn-box">
        <SoftTypography variant="h4" fontSize="1.4375rem" fontWeight="bold" marginBottom="25px ">Loyalty Configuration</SoftTypography>
        <Button variant="contained" className="loyalty-config-next-btn" onClick={() => navigate('/new-loyalty-config/mutiple-order-alert')}>Next</Button>
      </SoftBox>
      <SoftBox className="channel-main-box">
        <SoftBox className="channel-phone-box">
          <div className="channel-silder-box">
            <SimpleImageSlider
              width={300}
              height={500}
              images={images}
              showBullets={true}
              showNavs={true}
            />
            <div>
            </div>
          </div>
        </SoftBox>
        <SoftBox className="channel-content-box">
          <SoftTypography variant="h4" fontSize="1.4375rem" fontWeight="bold">How do your customers get loyalty communication?
          </SoftTypography>

          <SoftBox className="points-insp-box" mt={3}>
            <img src={bluestar} alt="" className="points-insp-image" />
            <SoftTypography className="points-text-box" fontSize="1rem">Most Preferred Channel</SoftTypography>
          </SoftBox>

          <SoftBox className="loyalty-channel-checkbox-card">
            <SoftBox sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
              <WhatsAppIcon color="success" fontSize="medium" className="icon-margin" />
              <SoftTypography variant="h4" fontSize="1rem" fontWeight="800">Whatsapp Utility</SoftTypography>
            </SoftBox>
            <Checkbox
              {...label}
              sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
              value={checkedBox}
              onChange={checkboxHandler}
            />
          </SoftBox>

          <SoftBox className="loyalty-branding-box" mt={2}>
            <SoftTypography variant="h4" fontSize="1rem">Send via SMS if WhatsApp fails to deliver</SoftTypography>
            <Switch {...label} checked={checked} onChange={switchHandler} size="medium" />
          </SoftBox>
          <SoftBox className="loyalty-channel-checkbox-card">
            <SoftBox sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
              <SmsIcon color="primary" fontSize="medium" className="icon-margin" />
              <SoftTypography variant="h4" fontSize="1rem" fontWeight="800">SMS</SoftTypography>
            </SoftBox>
            <Checkbox
              {...label}
              sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
              value={checkedBox}
              onChange={checkboxHandler}
            />
          </SoftBox>
          <SoftBox className="loyalty-channel-checkbox-card">
            <SoftBox sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
              <MailOutlineIcon color="error" fontSize="medium" className="icon-margin" />
              <SoftTypography variant="h4" fontSize="1rem" fontWeight="800">Email</SoftTypography>
            </SoftBox>
            <Checkbox
              {...label}
              sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
              value={checkedBox}
              onChange={checkboxHandler}
            />
          </SoftBox>
          <SoftBox className="loyalty-channel-checkbox-card">
            <SoftBox sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
              <NotificationsNoneIcon color="warning" fontSize="medium" className="icon-margin" />
              <SoftTypography variant="h4" fontSize="1rem" fontWeight="800">Push Notification</SoftTypography>
            </SoftBox>
            <Checkbox
              {...label}
              sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
              value={checkedBox}
              onChange={checkboxHandler}
            />
          </SoftBox>
        </SoftBox>
      </SoftBox>
    </DashboardLayout>
  );
};