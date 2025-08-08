import React, { useEffect, useState } from 'react';
import DefaultDoughnutChart from '../../../examples/Charts/DoughnutCharts/DefaultDoughnutChart';
import { Grid } from '@mui/material';
import { dashboardSalesByCategory, getCategoriesBulkPriceEdit } from '../../../config/Services';
import { isSmallScreen, textFormatter } from '../../ecommerce/Common/CommonFunction';
import SoftBox from '../../../components/SoftBox';

const SalesByCategory = ({dashBoardOrg}) => {
  const [chartData, setChartData] = useState({
    labels: ['No Data Available'],
    datasets: {
      label: 'Projects',
      backgroundColors: ['secondary', 'primary', 'dark', 'info', 'primary'],
      data: [1],
    },
  });
  const isMobileDevice = isSmallScreen();

  const locId = localStorage.getItem('locId');

  const handleTextSpace = (text) => {
    return text?.replace(/([A-Z])/g, ' $1').trim().replace(/^\w/, c => c.toUpperCase());
  }
  
 
  const getSalesByCategory = () => {
    const today = new Date();

    function getStartOfMonth() {
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
      return `${year}-${month}-01`;
    }

    // Create a function to get the end date of the current month in "YYYY-MM-DD" format
    function getEndOfMonth() {
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
      const lastDay = new Date(year, today.getMonth() + 1, 0).getDate();
      return `${year}-${month}-${lastDay}`;
    }

    const payload = {
      startDate: getStartOfMonth(),
      endDate : getEndOfMonth()
    };
    if (location.pathname === "/AllOrg_loc") {
      payload.orgId = dashBoardOrg
    } else {
      payload.locationId = locId
    }
    dashboardSalesByCategory(payload)
      .then((res) => {
     const salesData = res?.data?.data?.mainDashBoardCategoryData?.categoryModels?.map((item) => item?.sales > 0 )
if (salesData?.includes(true)) {
  setChartData({
    labels: res?.data?.data?.mainDashBoardCategoryData?.categoryModels?.map((item) => handleTextSpace(item?.category || "")) || [],

    datasets: {
      label: 'Projects',
      backgroundColors: ['darkblue', 'blue', 'green' , 'info' , 'secondary'],
      data: res?.data?.data?.mainDashBoardCategoryData?.categoryModels?.map((item) => item?.sales )|| [],
    },
  });
} 
   
      })
      .catch(() => {});
  };
  useEffect(() => {
    getSalesByCategory();
  }, [dashBoardOrg]);

  return (
    <Grid item xs={12} lg={7} style={{marginTop:isMobileDevice ? "-20px" : ""}}>
        <SoftBox sx={{ padding: isMobileDevice && !dashBoardOrg &&'10px' }}>

      <DefaultDoughnutChart
        title="Sales by Category"
        height="230px"
        chart={chartData}
        options={{
          plugins: {
            legend: {
              position: 'right',
            },
            datalabels: {
              color: 'blue',
              labels: {
                title: {
                  font: {
                    weight: 'bold',
                  },
                },
                value: {
                  color: 'green',
                },
              },
            },
          },
          responsive: true,
          maintainAspectRatio: false,
        }}
      />
              </SoftBox>

      {/* <PaymentPieChart /> */}
    </Grid>
  );
};

export default SalesByCategory;
