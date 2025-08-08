import './Contacts.css';
import { Box, Grid, Typography, styled } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../examples/Navbars/DashboardNavbar';
import MainCard from '../../../../dashboard widgets/StockOverview/MainCard';
import React from 'react';
import SoftBox from '../../../../../components/SoftBox';

const CardWrapper = styled(MainCard)(({ theme }) => ({
  // backgroundColor: 'rgb(30, 136, 229)',
  // color: theme.palette.primary.light,
  overflow: 'hidden',
  position: 'relative',
  minHeight: '8.5rem',
  justifyContent: 'center',
  alignItems: 'center',
  '&:after': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: 'linear-gradient(210.04deg, rgb(144, 202, 249) -50.94%, rgba(144, 202, 249, 0) 83.49%)',
    borderRadius: '50%',
    top: -30,
    right: -180,
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: 'linear-gradient(140.9deg, rgb(144, 202, 249) -14.02%, rgba(144, 202, 249, 0) 77.58%)',
    borderRadius: '50%',
    top: -160,
    right: -130,
  },
  '&:after': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: 'linear-gradient(210.04deg, rgb(144, 202, 249) -50.94%, rgba(144, 202, 249, 0) 83.49%)',
    borderRadius: '50%',
    bottom: -30,
    left: -180,
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: 'linear-gradient(140.9deg, rgb(144, 202, 249) -14.02%, rgba(144, 202, 249, 0) 77.58%)',
    borderRadius: '50%',
    bottom: -160,
    left: -130,
  },
}));

const AddContacts = () => {
  const navigate = useNavigate();

  return (
    <div>
      <DashboardLayout>
        <DashboardNavbar prevLink={true} />
        <Box
          className="table-css-fix-box-scroll-vend"
          style={{
            boxShadow: 'rgba(37, 37, 37, 0.126) 0px 5px 50px',
            position: 'relative',
            padding: '20px',
          }}
        >
          <SoftBox style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <Typography>Import Audience</Typography>
          </SoftBox>
          <SoftBox
            py={0}
            px={0}
            sx={{
              marginTop: '1rem',
            }}
          >
            <Grid container className="cards">
              <Grid item xs={12} sm={12} md={3} xl={4}>
                <div
                  className="campaign-dashboard-card-box"
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate('/marketing/contacts/import/upload')}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <img
                      src="https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_images/file.png"
                      style={{ height: '50px' }}
                    />
                    <div className="whatsapp-business-workflow-checkbox" style={{ position: 'unset' }}></div>
                  </div>
                  <Typography style={{ fontWeight: '600', fontSize: '1.2rem', lineHeight: '2', color: '#4b524d' }}>
                    Upload a File
                  </Typography>
                  <Typography
                    style={{
                      fontWeight: '200',
                      fontSize: '0.8rem',
                      lineHeight: '1.5',
                      color: '#4b524d',
                      textAlign: 'left',
                      margin: '20px 0px',
                    }}
                  >
                    Select a .csv file from your computer
                  </Typography>
                </div>
              </Grid>
              <Grid item xs={12} sm={12} md={3} xl={4}>
                <div
                  className="campaign-dashboard-card-box"
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate('/marketing/contacts/import/copy-paste')}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <img
                      src="https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_images/duplicate.png"
                      style={{ height: '50px' }}
                    />
                    <div className="whatsapp-business-workflow-checkbox" style={{ position: 'unset' }}></div>
                  </div>
                  <Typography style={{ fontWeight: '600', fontSize: '1.2rem', lineHeight: '2', color: '#4b524d' }}>
                    Copy/Paste
                  </Typography>
                  <Typography
                    style={{
                      fontWeight: '200',
                      fontSize: '0.8rem',
                      lineHeight: '1.5',
                      color: '#4b524d',
                      textAlign: 'left',
                      margin: '20px 0px',
                    }}
                  >
                    Copy and paste contacts from your .xls file.
                  </Typography>
                </div>
              </Grid>
            </Grid>
          </SoftBox>
        </Box>
      </DashboardLayout>
    </div>
  );
};

export default AddContacts;
