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
import Divider from '@mui/material/Divider';

// Soft UI Dashboard PRO React components
import { isSmallScreen } from '../../../../Common/CommonFunction';
import { useState } from 'react';
import SoftBadge from 'components/SoftBadge';
import SoftBox from 'components/SoftBox';
import SoftButton from 'components/SoftButton';
import SoftInput from 'components/SoftInput';
import SoftTypography from 'components/SoftTypography';


function Authentication() {

  const [phonedata,setPhonedata] = useState({
    mobile:'',
  });
  const isMobilDevice = isSmallScreen();

  const handlephone = (e) =>{
    const {name,value} = e.target;
    setPhonedata({...phonedata,[name]:value});
  };


  const [showedit,setShowedit] = useState(false);

  const handleEdit = () =>{
    setShowedit(true);
  };

  const handleSave = () =>{
    setShowedit(false);

  };


  return (
    <Card id="2fa" sx={{ overflow: 'visible' }} className={`${isMobilDevice && 'po-box-shadow'}`}>
      <SoftBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
        <SoftTypography variant="h5">Two-factor authentication</SoftTypography>
        <SoftBadge variant="contained" color="success" badgeContent="enabled" container />
      </SoftBox>

      <SoftBox p={3}>
        {/* <SoftBox
          display="flex"
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          flexDirection={{ xs: "column", sm: "row" }}
        >
          <SoftTypography variant="body2" color="text">
            Security keys
          </SoftTypography>
          <SoftBox
            display="flex"
            alignItems={{ xs: "flex-start", sm: "center" }}
            flexDirection={{ xs: "column", sm: "row" }}
          >
            <SoftBox mx={{ xs: 0, sm: 2 }} mb={{ xs: 1, sm: 0 }}>
              <SoftTypography variant="button" color="text" fontWeight="regular">
                No Security keys
              </SoftTypography>
            </SoftBox>
            <SoftButton variant="outlined" color="dark" size="small">
              add
            </SoftButton>
          </SoftBox>
        </SoftBox> */}
        {/* <Divider /> */}
        <SoftBox
          display="flex"
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          flexDirection={{ xs: 'column', sm: 'row' }}
        >
          <SoftTypography variant="body2" color="text">
            SMS number
          </SoftTypography>
          <SoftBox
            display="flex"
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            flexDirection={{ xs: 'column', sm: 'row' }}
          >
            <SoftBox mx={{ xs: 0, sm: 2 }} mb={{ xs: 1, sm: 0 }}>
              {showedit ? <SoftInput name="mobile" value={phonedata['mobile']} onChange={handlephone} type="number"/>:<SoftTypography variant="button" color="text" fontWeight="regular">
                {phonedata.mobile}
              </SoftTypography>}
              
            </SoftBox>

            {showedit ?  <SoftButton variant="outlined" color="dark" size="small" onClick={()=>handleSave()}>
              save
            </SoftButton>: <SoftButton variant="outlined" color="dark" size="small" onClick={()=>handleEdit()}>
              edit
            </SoftButton>}
           
          </SoftBox>
        </SoftBox>
        <Divider />
        {/* <SoftBox
          display="flex"
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          flexDirection={{ xs: "column", sm: "row" }}
        >
          <SoftTypography variant="body2" color="text">
            Authenticator app
          </SoftTypography>
          <SoftBox
            display="flex"
            alignItems={{ xs: "flex-start", sm: "center" }}
            flexDirection={{ xs: "column", sm: "row" }}
          >
            <SoftBox mx={{ xs: 0, sm: 2 }} mb={{ xs: 1, sm: 0 }}>
              <SoftTypography variant="button" color="text" fontWeight="regular">
                Not Configured
              </SoftTypography>
            </SoftBox>
            <SoftButton variant="outlined" color="dark" size="small">
              set up
            </SoftButton>
          </SoftBox>
        </SoftBox> */}
      </SoftBox>
    </Card>
  );
}

export default Authentication;
