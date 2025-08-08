import styled from '@emotion/styled';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import DiscountIcon from '@mui/icons-material/Discount';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
import { Avatar, Box, Card, Grid, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import SoftBox from '../../../../components/SoftBox';
import SoftTypography from '../../../../components/SoftTypography';
import MiniStatisticsCard from '../../../../examples/Cards/StatisticsCards/MiniStatisticsCard';
import MainCard from '../../../dashboard widgets/StockOverview/MainCard';
import Counter from '../../Pallet-pay/AnimateCounter';
import { noDatagif } from '../../Common/CommonFunction';

const CouponPerfomance = () => {
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

  return (
    <>
      <Card style={{ padding: '20px', backgroundColor: '#0562FB' }}>
        <SoftTypography style={{ fontSize: '1.2rem', fontWeight: '400 !important', color: 'white' }}>
          Coupons and Promotions
        </SoftTypography>
      </Card>
      <br />
      <Card sx={{ padding: '10px' }}>
        <SoftTypography
          style={{
            fontSize: '1rem',
            marginTop: '10px',
            marginBottom: '-20px',
            backgroundColor: 'honeydew',
            borderRadius: '8px',
            padding: '10px',
            width: '160px',
          }}
        >
          Static Coupons
        </SoftTypography>
        <Grid container spacing={3} justifyContent="space-evenly" style={{ margin: '10px -20px' }}>
          <Grid item xs={12} sm={6} md={4} lg={3}>
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
                Coupons applied
              </Typography>
              <Box sx={{ p: 2 }}>
                <List sx={{ py: 0 }}>
                  <ListItem alignItems="center" disableGutters sx={{ py: 0 }}>
                    <ListItemAvatar>
                      <Avatar
                        variant="rounded"
                        sx={{
                          width: '44px !important',
                          height: '44px !important',
                          backgroundColor: 'rgb(21, 101, 192)',
                          color: '#fff',
                        }}
                      >
                        <ConfirmationNumberIcon fontSize="inherit" />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      sx={{
                        py: 0,
                        mt: 0.45,
                        mb: 0.45,
                      }}
                      secondary={
                        <Typography variant="h6" style={{ display: 'flex', flexDirection: 'column', color: '#fff' }}>
                          <SoftBox style={{ color: 'white', fontSize: '1.1rem' }}>
                            <Counter value={1235} />
                          </SoftBox>
                        </Typography>
                      }
                    />
                  </ListItem>
                </List>
              </Box>
            </CardWrapper>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
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
                Discount value
              </Typography>
              <Box sx={{ p: 2 }}>
                <List sx={{ py: 0 }}>
                  <ListItem alignItems="center" disableGutters sx={{ py: 0 }}>
                    <ListItemAvatar>
                      <Avatar
                        variant="rounded"
                        sx={{
                          width: '44px !important',
                          height: '44px !important',
                          backgroundColor: 'rgb(21, 101, 192)',
                          color: '#fff',
                        }}
                      >
                        <DiscountIcon fontSize="inherit" />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      sx={{
                        py: 0,
                        mt: 0.45,
                        mb: 0.45,
                      }}
                      secondary={
                        <Typography variant="h6" style={{ display: 'flex', flexDirection: 'column', color: '#fff' }}>
                          <SoftBox style={{ color: 'white', fontSize: '1.1rem' }}>
                            <Counter value={23566} />
                          </SoftBox>
                        </Typography>
                      }
                    />
                  </ListItem>
                </List>
              </Box>
            </CardWrapper>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
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
                Unique customers
              </Typography>
              <Box sx={{ p: 2 }}>
                <List sx={{ py: 0 }}>
                  <ListItem alignItems="center" disableGutters sx={{ py: 0 }}>
                    <ListItemAvatar>
                      <Avatar
                        variant="rounded"
                        sx={{
                          width: '44px !important',
                          height: '44px !important',
                          backgroundColor: 'rgb(21, 101, 192)',
                          color: '#fff',
                        }}
                      >
                        <PersonIcon fontSize="small" />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      sx={{
                        py: 0,
                        mt: 0.45,
                        mb: 0.45,
                      }}
                      secondary={
                        <Typography variant="h6" style={{ display: 'flex', flexDirection: 'column', color: '#fff' }}>
                          <SoftBox style={{ color: 'white', fontSize: '1.1rem' }}>
                            <Counter value={856} />
                          </SoftBox>
                        </Typography>
                      }
                    />
                  </ListItem>
                </List>
              </Box>
            </CardWrapper>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
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
                Repeat customers
              </Typography>
              <Box sx={{ p: 2 }}>
                <List sx={{ py: 0 }}>
                  <ListItem alignItems="center" disableGutters sx={{ py: 0 }}>
                    <ListItemAvatar>
                      <Avatar
                        variant="rounded"
                        sx={{
                          width: '44px !important',
                          height: '44px !important',
                          backgroundColor: 'rgb(21, 101, 192)',
                          color: '#fff',
                        }}
                      >
                        <GroupIcon fontSize="inherit" />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      sx={{
                        py: 0,
                        mt: 0.45,
                        mb: 0.45,
                      }}
                      secondary={
                        <Typography variant="h6" style={{ display: 'flex', flexDirection: 'column', color: '#fff' }}>
                          <SoftBox style={{ color: 'white', fontSize: '1.1rem' }}>
                            <Counter value={344} />
                          </SoftBox>
                        </Typography>
                      }
                    />
                  </ListItem>
                </List>
              </Box>
            </CardWrapper>
          </Grid>
        </Grid>
      </Card>
      <br />
      <Card sx={{ padding: '10px' }}>
        <SoftTypography
          style={{
            fontSize: '1rem',
            marginTop: '10px',
            marginBottom: '-20px',
            backgroundColor: 'honeydew',
            borderRadius: '8px',
            padding: '10px',
            width: '160px',
            marginBottom: '10px',
          }}
        >
          Dynamic Coupons
        </SoftTypography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <MiniStatisticsCard
              title={{ text: 'Coupons Created', fontWeight: 'bold' }}
              count={0 || 'NA'}
              percentage={{ color: 'success', text: '+63%' }}
              icon={{ color: 'info', component: <ConfirmationNumberIcon /> }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <MiniStatisticsCard
              title={{ text: 'Coupons used', fontWeight: 'bold' }}
              count={0 || 'NA'}
              percentage={{ color: 'success', text: '+63%' }}
              icon={{ color: 'info', component: <ConfirmationNumberIcon /> }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <MiniStatisticsCard
              title={{ text: ' Discount value', fontWeight: 'bold' }}
              count={0 || 'NA'}
              percentage={{ color: 'success', text: '+70%' }}
              icon={{ color: 'info', component: <CurrencyRupeeIcon /> }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <MiniStatisticsCard
              title={{ text: 'Unique customers', fontWeight: 'bold' }}
              count={0 || 'NA'}
              percentage={{ color: 'success', text: '+70%' }}
              icon={{ color: 'info', component: <GroupIcon /> }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <MiniStatisticsCard
              title={{ text: 'Repeat customers', fontWeight: 'bold' }}
              count={0 || 'NA'}
              percentage={{ color: 'success', text: '+70%' }}
              icon={{ color: 'info', component: <GroupIcon /> }}
            />
          </Grid>
        </Grid>
      </Card>
      <br />

      <Box className="search-bar-filter-and-table-container">
        <Box className="search-bar-filter-container" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <SoftTypography
            style={{
              fontSize: '0.8em',
              marginInline: '10px',
              marginTop: '10px',
              color: '#ffffff',
              fontWeight: '500',
            }}
          >
            Top distribution channels
          </SoftTypography>
        </Box>
        <SoftBox className="No-data-text-box">
          <SoftBox className="src-imgg-data">
            <img className="src-dummy-img" src={noDatagif} />
          </SoftBox>

          <h3 className="no-data-text-I">NO DATA FOUND</h3>
        </SoftBox>
      </Box>
    </>
  );
};

export default CouponPerfomance;
