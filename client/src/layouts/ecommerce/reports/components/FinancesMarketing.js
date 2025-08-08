import { Box, Grid, Paper, Typography, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import SoftBox from '../../../../components/SoftBox';

const FinancesMarketing = () => {
  const isMobile = useMediaQuery('(max-width: 1200px)');
  const navigate = useNavigate();

  const onCard = () => { 
    navigate('/reports/Generalreports');
  };
  return (
    <Grid container sx={{ marginTop: '20px' }} spacing={2}>
      <Grid item xs={12} md={6}>
        <Paper sx={{ padding: '15px' }}>
          <SoftBox
        
          >
            <Box>
              <Typography variant="h6" fontWeight="550">
              Finances
              </Typography>
              <Typography className="reportDescriptionText">
              View your store’s finances including sales, returns, taxes, payments, and more.     
              </Typography>
            </Box>
            <Box
              sx={{
                width: '100%',
                borderBottom: '1px solid lightgrey',
                paddingBottom: '10px',
              }}
            >
              <Typography
                marginTop="15px"
                textTransform="uppercase"
                fontSize="15px"
                letterSpacing="0.1px"
                variant="h6" fontWeight="550"
              >
              TOTAL SALES THIS MONTH TO DATE
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Typography marginTop="15px" variant="h6" fontSize="30px" margin="0">
                  0
                </Typography>
                {/* Chart will be coming as props or components */}
                <p style={{ color: 'blue' , fontWeight:'bold'}}>______________</p>
              </Box>
            </Box>
          
          </SoftBox>
          <Box sx={{ marginTop: '25px' }} onClick={onCard}>
            <Typography
              padding="5px 0 5px 0"
              borderBottom="1px solid lightgrey"
              fontSize="14px"
              textTransform="uppercase"
              fontWeight="bold"
              style={{fontSize:'0.8rem'}}
            >
              Reports
            </Typography>
            <Box>
              <Box
                sx={{
                  height: '100%',
                  padding: '5px 0 5px 0',
                  borderBottom: '1px solid lightgrey',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Typography fontSize="14px" color="blue">
                Total sales
                </Typography>
                <Typography fontSize="14px">0 orders</Typography>
              </Box>
              <Box
                sx={{
                  height: '100%',
                  padding: '5px 0 5px 0',
                  borderBottom: '1px solid lightgrey',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Typography fontSize="14px" color="blue">
                Taxes
                </Typography>
                <Typography fontSize="14px">0 orders</Typography>
              </Box>
              <Box
                sx={{
                  height: '100%',
                  padding: '5px 0 5px 0',
                  borderBottom: '1px solid lightgrey',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Typography fontSize="14px" color="blue">
                Payments
                </Typography>
                <Typography fontSize="14px">0 orders</Typography>
              </Box>
              <Box
                sx={{
                  height: '100%',
                  padding: '5px 0 5px 0',
                  borderBottom: '1px solid lightgrey',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Typography fontSize="14px" color="blue">
                Sales by product vendor
                </Typography>
                <Typography fontSize="14px">0 orders</Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper sx={{ padding: '15px' }}>
          <SoftBox
        
          >
            <Box>
              <Typography variant="h6" fontWeight="550">
            Marketing
              </Typography>
              <Typography width="80%" mt="10px" fontSize="14px" color="black">
            Gain insights into where your online store customers are converting from.          </Typography>
            </Box>
            <Box
              sx={{
                width: '100%',
                borderBottom: '1px solid lightgrey',
                paddingBottom: '10px',
              }}
            >
              <Typography
                marginTop="15px"
               
               
                textTransform="uppercase"
                fontSize="15px"
                letterSpacing="0.1px"
                variant="h6" fontWeight="550"
              >
               SALES ATTRIBUTED TO MARKETING LAST 30 DAYS
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Typography marginTop="15px" variant="h6" fontSize="30px" margin="0">
                0
                </Typography>
                {/* Chart will be coming as props or components */}
                <p style={{ color: 'blue' , fontWeight:'bold'}}>______________</p>
              </Box>
            </Box>
        
          </SoftBox>
          <Box sx={{ marginTop: '25px' }} onClick={onCard}>
            <Typography
              padding="5px 0 5px 0"
              borderBottom="1px solid lightgrey"
              fontSize="14px"
              textTransform="uppercase"
              fontWeight="bold"
              style={{ fontSize: '0.8rem' }}
            >
              Reports
            </Typography>
            <Box>
              <Box
                sx={{
                  height: '100%',
                  padding: '5px 0 5px 0',
                  borderBottom: '1px solid lightgrey',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Typography fontSize="14px" color="blue">
                Sessions attributed to marketing
                </Typography>
                <Typography fontSize="14px">0 orders</Typography>
              </Box>
              <Box
                sx={{
                  height: '100%',
                  padding: '5px 0 5px 0',
                  borderBottom: '1px solid lightgrey',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Typography fontSize="14px" color="blue">
                Sales attributed to marketing
                </Typography>
                <Typography fontSize="14px">0 orders</Typography>
              </Box>
              <Box
                sx={{
                  height: '100%',
                  padding: '5px 0 5px 0',
                  borderBottom: '1px solid lightgrey',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Typography fontSize="14px" color="blue">
                Conversion by first interaction
                </Typography>
                <Typography fontSize="14px">0 orders</Typography>
              </Box>
              <Box
                sx={{
                  height: '100%',
                  padding: '5px 0 5px 0',
                  borderBottom: '1px solid lightgrey',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Typography fontSize="14px" color="blue">
                Conversion by last interaction
                </Typography>
                <Typography fontSize="14px">0 orders</Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default FinancesMarketing;
