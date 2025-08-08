import PropTypes from 'prop-types';

// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { Avatar, Box, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';

// project imports
import MainCard from './MainCard';

// assets
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import { useEffect, useState } from 'react';
import { getTotalStockValue } from '../../../config/Services';

// styles
const CardWrapper = styled(MainCard)(({ theme }) => ({
  backgroundColor: 'rgb(30, 136, 229)',
  color: theme.palette.primary.light,
  overflow: 'hidden',
  position: 'relative',
  '&:after': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: `linear-gradient(210.04deg, rgb(144, 202, 249) -50.94%, rgba(144, 202, 249, 0) 83.49%)`,
    borderRadius: '50%',
    top: -30,
    right: -180,
  },
  '&:before': {
    content: '""',
    position: 'absolute',
    width: 210,
    height: 210,
    background: `linear-gradient(140.9deg, rgb(144, 202, 249) -14.02%, rgba(144, 202, 249, 0) 77.58%)`,
    borderRadius: '50%',
    top: -160,
    right: -130,
  },
}));

// ==============================|| DASHBOARD - TOTAL INCOME DARK CARD ||============================== //

const StockTurnOverRatio = ({ isLoading }) => {
  const theme = useTheme();
  const [stockValue, setStockValue] = useState('');
 const orgId = localStorage.getItem('orgId');
 const locId = localStorage.getItem('locId');
 
 const formatLargeNumber = (num) => {
    return num.toLocaleString('en-IN');
  };

//   useEffect(() => {
//     getTotalStockValue(orgId, locId)
//       .then((res) => {
//         setStockValue('₹ ' + formatLargeNumber(Math.round(res?.data?.data?.data)));
//       })
//       .catch(() => {});
//   }, []);
  
  return (
    <>
      <CardWrapper border={false} content={false}>
        <Box sx={{ p: 2 }}>
          <List sx={{ py: 0 }}>
            <ListItem alignItems="center" disableGutters sx={{ py: 0 }}>
              <ListItemAvatar>
                <Avatar
                  variant="rounded"
                  sx={{
                  width:"44px !important" , height:"44px !important",
                    backgroundColor: 'rgb(21, 101, 192)',
                    color: '#fff',
                  }}
                >
                  <TableChartOutlinedIcon fontSize="inherit" />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                sx={{
                  py: 0,
                  mt: 0.45,
                  mb: 0.45,
                }}
                primary={
                  <Typography variant="h4" sx={{ color: '#fff' , fontSize:"0.98rem" , fontWeight:"bold"}}>
                    {stockValue || 0}
                  </Typography>
                }
                secondary={
                  <Typography variant="subtitle2" sx={{ color: 'rgb(238, 242, 246)', mt: 0.25 , fontSize:"0.85rem"}}>
                    Stock Turnover Ratio
                  </Typography>
                }
              />
            </ListItem>
          </List>
        </Box>
      </CardWrapper>
    </>
  );
};

StockTurnOverRatio.propTypes = {
  isLoading: PropTypes.bool,
};

export default StockTurnOverRatio;
