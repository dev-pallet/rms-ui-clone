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
import './header.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Box from '@mui/material/Box';
import FormField from 'layouts/ecommerce/product/all-products/components/edit-product/components/FormField/index';
import Modal from '@mui/material/Modal';
import SettingsIcon from '@mui/icons-material/Settings';
import SoftBox from 'components/SoftBox';
import SoftButton from 'components/SoftButton';
import SoftInput from 'components/SoftInput';
import SoftSelect from 'components/SoftSelect';
import SoftTypography from 'components/SoftTypography';

const Header = ({ handleSubmit }) => {
  const navigate = useNavigate();
  const [openmodel, setOpenmodel] = useState(false);

  const handleopen = () => {
    setOpenmodel(true);
  };

  const handleClose = () => {
    setOpenmodel(false);
  };

  const handleSettings = () => {
    navigate('/product/production/settings');
  };

  return (
    <SoftBox display="flex" alignItems="center">
      <SoftButton onClick={handleopen} variant="gradient" color="info" sx={{ marginRight: '1rem' }}>
        New
      </SoftButton>

      <SoftButton onClick={handleSettings}>
        <SettingsIcon
          sx={{
            position: 'relative',
            right: '0.5rem',
          }}
        />
        Settings
      </SoftButton>

      <Modal
        open={openmodel}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            width: '40vw',
            height: '70vh',
            backgroundColor: '#fff',
            margin: 'auto',
            marginTop: '6rem',
            borderRadius: '1rem',
            padding: '2rem',
            boxSizing: 'border-box',
            position: 'relative',
          }}
          className="header-new-btn-modal"
        >
          <Box className="sku">
            <SoftTypography
              style={{ marginTop: '0.8rem' }}
              component="label"
              variant="caption"
              fontWeight="bold"
              textTransform="capitalize"
            >
              SKU
            </SoftTypography>
            <SoftSelect
              sx={{
                marginTop: '0.5rem',
              }}
              defaultValue={{ value: 'sk', label: 'Orange' }}
              options={[
                { value: 'sku1', label: 'Apple' },
                { value: 'sku2', label: 'Banana' },
                { value: 'sku3', label: 'Grapes' },
                { value: 'sku4', label: 'Mango' },
                { value: 'sku5', label: 'Chilli' },
              ]}
            />
          </Box>
            
          <Box className="quantiy">
            <SoftTypography
              style={{ marginTop: '0.8rem' }}
              component="label"
              variant="caption"
              fontWeight="bold"
              textTransform="capitalize"
            >
              Quantiy
            </SoftTypography>
            <FormField type="text" 
              //  label="Quantity" 
              defaultValue="200 kg" />
          </Box>

          <Box className="expected-date">
            <SoftTypography
              style={{ marginTop: '0.8rem' }}
              component="label"
              variant="caption"
              fontWeight="bold"
              textTransform="capitalize"
            >
              Expected Date
            </SoftTypography>
            <SoftInput 
              type="date"
            />
          </Box>

          <Box className="cancel-save-btn">
            <SoftButton
              sx={{
                marginRight: '0.8rem',
              }}
              onClick={handleClose}
            >
                  cancel
            </SoftButton>
            <SoftButton variant="gradient" color="info">
                  save
            </SoftButton>
          </Box>
        </Box>
      </Modal>
    </SoftBox>
  );
};

export default Header;
