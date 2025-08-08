import { Box, Grid, Paper, Typography, useMediaQuery } from '@mui/material';
import { getProfitDetails, paymentMethodsData, purchaseReports } from '../../../../config/Services';
import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import SoftBox from '../../../../components/SoftBox';
import SoftButton from '../../../../components/SoftButton';

const PosReports = () => {
  const isMobile = useMediaQuery('(max-width: 1200px)');
  const navigate = useNavigate();
  const onCard = (reportId) => {
    navigate(`/reports/pos/${reportId}`);
  };

  const onBillsCard = (reportId) => {
    navigate(`/reports/Generalreports/${reportId}`);
  };
  const [salesData, setSalesData] = useState({
    cashValue: 0,
    cashOrderValue: 0,
    upiValue: 0,
    upiOrderValue: 0,
    cardValue: 0,
    cardOrderValue: 0,
    adjustedOrders: 0,
    creditNoteOrders: 0,
  });
  const [seeAll, setSeeAll] = useState(false);
  const [marginData, setMarginData] = useState('NA');
  const onInventory = () => {
    navigate('/reports/InventoryChart');
  };
  const locId = localStorage.getItem('locId');
  const orgId = localStorage.getItem('orgId');

  const reportsData = [
    { reportTitle: 'Bills Master Report', onCardParam: 'BillsMasterReport' },
    { reportTitle: ' Bill Wise Payment Report', onCardParam: 'BillWisePaymentReport' },
    { reportTitle: 'Vendor Wise Bills Summary', onCardParam: 'VendorWiseBillsSummary' },
    { reportTitle: 'Payments Summary', onCardParam: 'PaymentsSummary' },
  ];
  return (
    <Grid container sx={{ marginTop: '20px', paddingBottom: '20px' }} spacing={2}>
      {/* <Grid item xs={12} md={6}>
        <Paper className="report-card-border">
          <SoftBox>
            <Box>
              <Typography variant="h6" fontWeight="550">
                Point of Sale (POS)
              </Typography>
              <Typography className="reportDescriptionText">
                Tracking the volume of transactions processed via POS.{' '}
              </Typography>
            </Box>
          </SoftBox>

          <Box sx={{ marginTop: '25px' }}>
            <Typography className="reportText"></Typography>
            <Box>
              <Box className="reports-title-div" onClick={() => onCard('Session')}>
                <Typography fontSize="14px" color="blue" sx={{ cursor: 'pointer' }}>
                  Session report
                </Typography>
              </Box>
              <Box className="reports-title-div" onClick={() => onCard('Terminal')}>
                <Typography fontSize="14px" color="blue" sx={{ cursor: 'pointer' }}>
                  Terminal wise report
                </Typography>
              </Box>
              <Box className="reports-title-div" onClick={() => onCard('End of Day')}>
                <Typography fontSize="14px" color="blue" sx={{ cursor: 'pointer' }}>
                  End of day report
                </Typography>
              </Box>
              <Box className="reports-title-div" onClick={() => onCard('Cash Sales')}>
                <Typography fontSize="14px" color="blue" sx={{ cursor: 'pointer' }}>
                  POS cash sales
                </Typography>
              </Box>
              {seeAll && (
                <>
                  <Box className="reports-title-div">
                    <Typography fontSize="14px" color="blue" sx={{ cursor: 'pointer' }}>
                      POS UPI sales
                    </Typography>
                  </Box>
                  <Box className="reports-title-div">
                    <Typography fontSize="14px" color="blue" sx={{ cursor: 'pointer' }}>
                      POS Card sales
                    </Typography>
                  </Box>
                  <Box className="reports-title-div">
                    <Typography fontSize="14px" color="blue" sx={{ cursor: 'pointer' }}>
                      POS offline sales
                    </Typography>
                  </Box>
                  <Box className="reports-title-div">
                    <Typography fontSize="14px" color="blue" sx={{ cursor: 'pointer' }}>
                      POS adjusted orders
                    </Typography>
                  </Box>
                  <Box className="reports-title-div">
                    <Typography fontSize="14px" color="blue" sx={{ cursor: 'pointer' }}>
                      POS credit notes{' '}
                    </Typography>
                  </Box>
                </>
              )}
              <SoftBox style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <a
                  onClick={() => setSeeAll(!seeAll)}
                  style={{ fontSize: '0.9rem', paddingTop: '10px', marginLeft: 'auto' }}
                >
                  See all
                </a>
              </SoftBox>{' '}
            </Box>
          </Box>
        </Paper>
      </Grid> */}
      <Grid item xs={12} md={6}>
        <Paper className="report-card-border">
          <SoftBox>
            <Box>
              <Typography variant="h6" fontWeight="550">
                BILLS & PAYMENT REPORTS{' '}
              </Typography>
              <Typography className="reportDescriptionText">Monitor and analyze transaction trends</Typography>
            </Box>
          </SoftBox>
          <Box sx={{ marginTop: '25px' }}>
            <Typography className="reportText"></Typography>
            <Box>
              {reportsData?.map((item) => (
                <Box className="reports-title-div" onClick={() => onBillsCard(item?.onCardParam)}>
                  <Typography fontSize="14px" color="blue" sx={{ cursor: 'pointer' }}>
                    {item?.reportTitle}
                  </Typography>
                </Box>
              ))}
              <SoftBox style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Link
                  to="/reports/bills&paymentreport"
                  style={{ fontSize: '0.9rem', paddingTop: '10px', marginLeft: 'auto' }}
                >
                  See all
                </Link>
              </SoftBox>

              {/* <SoftBox style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <a
                  onClick={() => setSeeAll(!seeAll)}
                  style={{ fontSize: '0.9rem', paddingTop: '10px', marginLeft: 'auto' }}
                >
                  See all
                </a>
              </SoftBox>{' '} */}
            </Box>
          </Box>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper className="report-card-border">
          <SoftBox>
            <Box>
              <Typography variant="h6" fontWeight="550">
                BUSINESS MASTERS
              </Typography>
              <Typography className="reportDescriptionText">Understand customer behavior to boost growth. </Typography>
            </Box>
          </SoftBox>
          <Box sx={{ marginTop: '25px' }}>
            <Typography className="reportText"></Typography>
            <Box>
              <Box className="reports-title-div unAvailable_Report">
                <Typography fontSize="14px" color="blue" sx={{ cursor: 'pointer' }}>
                  Mark-Up/Mark Down Report{' '}
                </Typography>
              </Box>
              <Box className="reports-title-div unAvailable_Report">
                <Typography fontSize="14px" color="blue" sx={{ cursor: 'pointer' }}>
                  Product List{' '}
                </Typography>
              </Box>
              <Box className="reports-title-div unAvailable_Report">
                <Typography fontSize="14px" color="blue" sx={{ cursor: 'pointer' }}>
                  Item Wise-EANCODE{' '}
                </Typography>
              </Box>
              <Box className="reports-title-div unAvailable_Report">
                <Typography fontSize="14px" color="blue" sx={{ cursor: 'pointer' }}>
                  Price List Summary{' '}
                </Typography>
              </Box>
            </Box>
          </Box>
          <SoftBox style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Link to="/reports/bussiness-report" className="linkFontStyle">
              See all
            </Link>
          </SoftBox>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default PosReports;
