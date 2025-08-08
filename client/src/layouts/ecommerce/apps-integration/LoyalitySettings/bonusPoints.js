//soft ui components
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import SoftBox from '../../../../components/SoftBox';
import SoftInput from '../../../../components/SoftInput';
import SoftTypography from '../../../../components/SoftTypography';

//images
import phone from '../../../../assets/images/ecommerce/phone.png';

//mui components
import { Button, InputLabel, Switch } from '@mui/material';

//react
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const label = { inputProps: { 'aria-label': 'Switch demo' } };

export const BonusPoints = () => {

  const navigate = useNavigate();

  const [checked, setChecked] = useState(false);

  const switchHandler = (event) => {
    setChecked(event.target.checked);
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox className="loyalty-config-next-btn-box">
        <SoftTypography variant="h4" fontSize="23px" fontWeight="bold" marginBottom="25px ">Loyalty Configuration</SoftTypography>
        <Button variant="contained" className="loyalty-config-next-btn" onClick={() => navigate('/new-loyalty-config/channels')}>Next</Button>
      </SoftBox>
      <SoftBox className="bonus-points-main-box">
        <SoftBox className="bonus-points-phone-box">
          <img src={phone} alt="" />
        </SoftBox>
        <SoftBox className="bonus-points-content-box">
          <SoftTypography variant="h4" fontSize="23px" fontWeight="bold">Edit Terms & Conditions</SoftTypography>
          <SoftBox className="loyalty-branding-box" mt={2}>
            <SoftTypography variant="h4" fontSize="23px" fontWeight="bold">Bonus Points</SoftTypography>
            <Switch {...label} checked={checked} onChange={switchHandler} size="medium" />
          </SoftBox>
          <SoftBox mb={1} ml={0.5} display="flex" flexDirection="column" gap={1} className="input-container">
            <InputLabel sx={{ fontSize: '1rem', color: '#344767' }}>
                            Encourage customers to share their birthday, email, gender, anniversary and give bonus points.
            </InputLabel>
            <SoftInput
              type="number"
              style={{ maxHeight: '50px' }}
              defaultValue="100"
              disabled={!checked}
            />
          </SoftBox>
        </SoftBox>
      </SoftBox>
    </DashboardLayout>
  );
};