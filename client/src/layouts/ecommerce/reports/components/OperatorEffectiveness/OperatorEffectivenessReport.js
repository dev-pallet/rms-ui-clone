import { Box, Grid, Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import SoftBox from '../../../../../components/SoftBox';

const OperatorEffectivenessReport = () => {
  const navigate = useNavigate();

  const [openSubEvents, setOpenSubEvents] = useState({
    Cart: false,
    Order: false,
  });
  const [subEvents, setSubEvents] = useState([]);

  const handleOpenSubEvents = (type) => {
    if (type === 'Cart') {
      setSubEvents(['CART_DELETED', 'CART_HOLD', 'CART_ITEM_REMOVED']);
      setOpenSubEvents({
        ...openSubEvents,
        Cart: !openSubEvents.Cart,
        Order: false,
      });
    } else if (type === 'Order') {
      setSubEvents(['ORDER_EDITED', 'ORDER_RECEIPT_REPRINT']);
      setOpenSubEvents({
        ...openSubEvents,
        Cart: false,
        Order: !openSubEvents.Order,
      });
    }
  };

  return (
    <Grid container sx={{ marginTop: '20px', paddingBottom: '20px' }} spacing={2}>
      <Grid item xs={12} md={6}>
        <Paper className="report-card-border">
          <SoftBox>
            <Box>
              <Typography variant="h6" fontWeight="550">
                Operator Effectiveness
              </Typography>
              <Typography className="reportDescriptionText">
                Tracking the activities of the operators of POS.{' '}
              </Typography>
            </Box>
          </SoftBox>
          <Box sx={{ marginTop: '25px' }}>
            <Typography className="reports-operator-typo-2"></Typography>
            <Box>
              <Box className="reports-title-div" onClick={() => navigate('/reports/operator-effectiveness')}>
                <Typography fontSize="14px" color="blue" sx={{ cursor: 'pointer' }}>
                  Intrusion Reports
                </Typography>
              </Box>
              <Box className="reports-title-div" onClick={() => navigate('/reports/cart-delete')}>
                <Typography fontSize="14px" color="blue" sx={{ cursor: 'pointer' }}>
                  Cart Delete reports
                </Typography>
              </Box>
      
              {/* <SoftBox style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <a
                  onClick={() => navigate('/reports/operator-effectiveness')}
                  style={{ fontSize: '0.9rem', paddingTop: '10px', marginLeft: 'auto' }}
                >
                  See all
                </a>
              </SoftBox> */}
            </Box>
          </Box>
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper className="report-card-border">
          <SoftBox>
            <Box>
              <Typography variant="h6" fontWeight="550">
                Stock Transfer Reports
              </Typography>
              <Typography className="reportDescriptionText">Month/Date/Bill/Item/Category Wise Summary </Typography>
            </Box>
          </SoftBox>

          <Box
            sx={{ marginTop: '25px' }}
            // onClick={onCard}
          >
            <Typography className="reportText"></Typography>
            <Box>
              <Box className="reports-title-div unAvailable_Report">
                <Typography fontSize="14px" color="blue">
                  Transfer In
                </Typography>
              </Box>
              <Box className="reports-title-div unAvailable_Report">
                <Typography fontSize="14px" color="blue">
                  Transfer Out{' '}
                </Typography>
              </Box>
              {/* <Box className="reports-title-div unAvailable_Report">
                <Typography fontSize="14px" color="blue">
                  Location Stock Transfer
                </Typography>
              </Box> */}
       
            </Box>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default OperatorEffectivenessReport;
