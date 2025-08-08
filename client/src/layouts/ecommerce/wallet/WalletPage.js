import { Box, Grid, List, ListItem, Typography } from '@mui/material';
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../examples/Navbars/DashboardNavbar';
import MainCard from '../../dashboard widgets/StockOverview/MainCard';
import React from 'react';
import SoftBox from '../../../components/SoftBox';
import styled from '@emotion/styled';

const CardWrapper = styled(MainCard)(({ theme }) => ({
  backgroundColor: 'rgb(30, 136, 229)',
  color: theme.palette.primary.light,
  overflow: 'hidden',
  position: 'relative',
  minHeight: '8.5rem',
  justifyContent: 'center',
  alignItems: 'flex-start',
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
}));

export default function WalletPage() {
  return (
    <>
      <DashboardLayout>
        <DashboardNavbar />
        <SoftBox className="search-bar-filter-and-table-container">
          <SoftBox className="search-bar-filter-container">
            <Typography fontSize="1rem" color="white !important">
              Wallet
            </Typography>
          </SoftBox>
          <Box sx={{ padding: '15px' }}>
            <Grid container>
              <Grid item xs={12} sm={6} md={4} lg={4}>
                <CardWrapper border={false} content={false}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: 'rgb(238, 242, 246)',
                      marginTop: '10px',
                      marginLeft: '15px',
                      fontSize: '1rem',
                      fontWeight: 'bold',
                    }}
                  >
                    Available Balance
                  </Typography>
                  <Box sx={{ p: 2 }}>
                    <List sx={{ py: 0 }}>
                      <ListItem alignItems="center" disableGutters sx={{ py: 0, color: 'white !important' }}>
                        {/* <ListItemAvatar>
                          <Avatar
                            variant="rounded"
                            sx={{
                              width: '44px !important',
                              height: '44px !important',
                              backgroundColor: 'rgb(21, 101, 192)',
                              color: '#fff',
                            }}
                          >
                            <BiSolidCoupon fontSize="inherit" />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          sx={{
                            py: 0,
                            mt: 0.45,
                            mb: 0.45,
                          }}
                          //   secondary={
                          //     <Typography
                          //       variant="h6"
                          //       style={{ display: 'flex', flexDirection: 'column', color: '#fff' }}
                          //     >
                          //       <SoftBox style={{ color: 'white', fontSize: '0.9rem' }}>Available Balance</SoftBox>
                          //     </Typography>
                          //   }
                        /> */}
                        $ NA
                      </ListItem>
                    </List>
                  </Box>
                </CardWrapper>
              </Grid>
            </Grid>
          </Box>
          <Box sx={{ padding: '15px 0px', height: '350px' }}>
            <hr />
            <Typography fontSize="1rem" fontWeight={'bold'} sx={{ padding: '15px' }}>
              Recent Transactions
            </Typography>
            <hr />
            <Box sx={{ padding: '15px' }}>
              <Typography fontSize="1rem" textAlign={'center'}>No Transactions</Typography>
            </Box>
          </Box>
        </SoftBox>
      </DashboardLayout>
    </>
  );
}
