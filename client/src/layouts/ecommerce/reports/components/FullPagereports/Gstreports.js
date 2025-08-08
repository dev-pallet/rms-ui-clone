import './reports.css';
import { Box, Grid, Paper, Typography } from '@mui/material';
import { DAY_INTERVAL } from '../../../Common/date';
import { salesReports } from '../../../../../config/Services';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../examples/Navbars/DashboardNavbar';
import React, { useEffect, useState } from 'react';
import SoftBox from '../../../../../components/SoftBox';
import SoftTypography from '../../../../../components/SoftTypography';
import { gstReportArray } from '../ReportsData';

const Gstreports = () => {
  const navigate = useNavigate();
  const onCard = (heading, reportId) => {
    if (heading === 'Sales') {
      navigate(`/reports/gstchart/${reportId}`);
    } else if (heading === 'Purchase') {
      navigate(`/reports/Generalreports/${reportId}`);
    }
  };
  const locId = localStorage.getItem('locId');
  const orgId = localStorage.getItem('orgId');

  const summaryItems = [
    { title: 'GST sales' },
    { title: 'GST output tax' },
    { title: 'GST collected' },
    { title: 'GST input tax credits' },
    { title: 'GST purchases' },
    { title: 'GST payments made' },
    { title: 'GST refunds received' },
    { title: 'GST exempt supplies' },
    { title: 'GST by inter-state sales' },
    { title: 'GST by intra-state sales' },
    { title: 'GST by tax rate breakdown' },
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar prevLink={true} />
      <Grid item xs={12} md={6}>
        <Paper sx={{ padding: '15px' }}>
          <SoftBox>
            <Box>
              <Typography variant="h6" fontWeight="550">
                GST
              </Typography>
              <SoftTypography width="80%" mt="10px" fontSize="14px" color="black">
                Gain insights into who your customers are and how they interact with your business.{' '}
              </SoftTypography>
            </Box>
          </SoftBox>
          <Box sx={{ marginTop: '25px' }}>
            {gstReportArray?.map((section, sectionIndex) => (
              <React.Fragment key={sectionIndex}>
                {/* Render section heading if needed */}
                <SoftTypography
                  fontSize="medium"
                  fontWeight="bold"
                  style={{ margin: '5px 0', textDecoration: 'underline' }}
                >
                  {section.heading}
                </SoftTypography>

                {section.reports.map((report, reportIndex) => (
                  <Box
                    key={reportIndex}
                    className="reports-title-div"
                    onClick={() => onCard(section.heading, report.onCardParam)}
                  >
                    <SoftTypography className="reports-title-text">{report.title}</SoftTypography>
                  </Box>
                ))}
              </React.Fragment>
            ))}

            {/* Render summary items */}
            {summaryItems.map((item, index) => (
              <Box key={index} className="reports-title-div unAvailable_Report">
                <SoftTypography className="reports-title-text">{item.title}</SoftTypography>
              </Box>
            ))}
          </Box>
        </Paper>
      </Grid>
    </DashboardLayout>
  );
};

export default Gstreports;
