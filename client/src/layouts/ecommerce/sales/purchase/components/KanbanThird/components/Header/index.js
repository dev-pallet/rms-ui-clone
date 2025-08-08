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


// Soft UI Dashboard PRO React components
import {useState} from 'react';
import Box from '@mui/material/Box';
import FormField from 'layouts/ecommerce/product/all-products/components/edit-product/components/FormField/index';
import Grid from '@mui/material/Grid';
import Modal from '@mui/material/Modal';
import SoftBox from 'components/SoftBox';
import SoftButton from 'components/SoftButton';
import SoftSelect from 'components/SoftSelect';
import SoftTypography from 'components/SoftTypography';


const Header =()=> {

  const [openmodel,setOpenmodel]  = useState(false);

  const handleopen = () =>{
    setOpenmodel(true);
  };

  const handleClose = () =>{
    setOpenmodel(false);
  };

  return (
    <SoftBox display="flex" alignItems="center">
      <SoftButton onClick={handleopen} variant="gradient" color="info">New</SoftButton>

      <Modal
        open={openmodel}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="batch-box">
          <Grid container spacing={1} p={1}>

            <SoftBox mt={2} mb={1} ml={2} lineHeight={0} display="inline-block">
              <SoftTypography component="label" variant="caption" fontWeight="bold" textTransform="capitalize">SKU</SoftTypography>
            </SoftBox>
            <Grid item xs={12} sm={12}>
              <SoftSelect
                defaultValue={{ value: 'sk', label: 'Orange' }}
                options={[
                  { value: 'sku1', label: 'Apple' },
                  { value: 'sku2', label: 'Banana' },
                  { value: 'sku3', label: 'Grapes' },
                  { value: 'sku4', label: 'Mango' },
                  { value: 'sku5', label: 'Chilli' }
                ]}
              />
            </Grid>

            <Grid item xs={12} sm={12}>
              <FormField type="text" label="Quantity" defaultValue="200 kg"/>
            </Grid>

            <Grid item xs={12} sm={12}>
              <SoftBox className="header-submit-box">
                <SoftButton>cancel</SoftButton>
                <SoftButton variant="gradient" color="info">submit</SoftButton> 
              </SoftBox>
            </Grid>
          </Grid>             
        </Box>
      </Modal>
    </SoftBox>
  );
};

export default Header;