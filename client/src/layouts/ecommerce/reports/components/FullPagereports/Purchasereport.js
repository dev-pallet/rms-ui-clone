import { Box, Grid, Paper, Tooltip, Typography, tooltipClasses } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import SoftBox from '../../../../../components/SoftBox';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../examples/Navbars/DashboardNavbar';
import { purchaseReports } from '../../../../../config/Services';
import './reports.css';
import SoftTypography from '../../../../../components/SoftTypography';
import DescriptionTooltip from '../DescriptionToolTip';
import { purchaseReportsArray } from '../ReportsData';

const Purchasereport = () => {
  const [data, setData] = useState({});
  const navigate = useNavigate();
  const onCard = (reportId) => {
    if (reportId) {
      navigate(`/reports/Generalreports/${reportId}`);
    } else {
      navigate('/reports/Generalreports');
    }
  };

  const locId = localStorage.getItem('locId');
  const orgId = localStorage.getItem('orgId');

  const summaryItems = [
    { title: 'Cancelled purchase orders', dataKey: 'cancelled' },
    { title: 'Credit notes', dataKey: 'vendors' },
    { title: 'Top purchase by vendors', dataKey: 'topVendor' },
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar prevLink={true} />
      <Grid container sx={{ marginTop: '20px' }} spacing={2}>
        <Grid item xs={12} md={12}>
          <Paper sx={{ padding: '15px' }}>
            <SoftBox>
              <Box>
                <Typography variant="h6" fontWeight="550">
                  Purchase
                </Typography>
                <SoftTypography width="80%" mt="10px" fontSize="14px" color="black">
                  Make business decisions by comparing sales across products, staff, channels, and more.
                </SoftTypography>
              </Box>
            </SoftBox>
            <Box sx={{ marginTop: '25px' }}>
              {purchaseReportsArray?.map((section, sectionIndex) => (
                <React.Fragment key={sectionIndex}>
                  {/* <SoftTypography
                    fontSize="medium"
                    fontWeight="bold"
                    style={{ margin: '5px 0', textDecoration: 'underline' }}
                  >
                    {section?.heading}
                  </SoftTypography> */}

                  {section?.reports?.map((report, reportIndex) => (
                    <Box
                      key={reportIndex}
                      className="reports-title-div"
                      onClick={() =>
                        report.isNavigation ? navigate(`/reports/${report?.onCardParam}`) : onCard(report?.onCardParam)
                      }
                    >
                      {' '}
                      <DescriptionTooltip title={report?.description || ''} arrow>
                        <SoftTypography className="reports-title-text">{report?.title}</SoftTypography>
                      </DescriptionTooltip>
                    </Box>
                  ))}
                </React.Fragment>
              ))}

              {summaryItems?.map((item, index) => (
                <Box key={index} className="reports-title-div unAvailable_Report">
                  <SoftTypography className="reports-title-text">{item?.title}</SoftTypography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </DashboardLayout>
  );
};

export default Purchasereport;
