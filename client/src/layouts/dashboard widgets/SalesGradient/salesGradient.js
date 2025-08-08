/**
=========================================================
* Soft UI Dashboard PRO React - v4.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-pro-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useRef, useEffect, useState, useMemo } from 'react';

// porp-types is a library for typechecking of props
import PropTypes from 'prop-types';

// react-chartjs-2 components
import { Line } from 'react-chartjs-2';

// @mui material components
import Card from '@mui/material/Card';

// Soft UI Dashboard PRO React components
import SoftBox from '../../../components/SoftBox';
import SoftTypography from '../../../components/SoftTypography';

// Soft UI Dashboard PRO React helper functions
import gradientChartLine from '../../../assets/theme/functions/gradientChartLine';

// GradientLineChart configurations
import configs from '../../../examples/Charts/LineCharts/GradientLineChart/configs';

// Soft UI Dashboard PRO React base styles
import colors from 'assets/theme/base/colors';
import { salesOverview } from '../../../config/Services';
import SoftSelect from '../../../components/SoftSelect';
import GradientLineChart from '../../../examples/Charts/LineCharts/GradientLineChart';

function SalesGradientLineChart({ title, description, height, orgId , salesToggle , filterGraph}) {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState({
    data: {
      labels: [],
      datasets: [
        {
          label: 'Sales',
          color: 'info',
          data: [],
        },
      ],
    },
    options: {},
  });
  const { data, options } = chartData;
  const [oneWeek, setOneWeek] = useState([]);
  const locId = localStorage.getItem('locId');
  const [salesData, setSalesData] = useState([]);
  const [salesValues, setSalesValues] = useState([]);
  const [prevsalesData, setPrevSalesData] = useState([]);
  const [prevsalesValues, setPrevSalesValues] = useState([]);
  const [currPathname, setCurrPathname] = useState('');

  useEffect(() => {
    const currentDate = new Date();
    const previousSeventhDay = new Date(currentDate);
    previousSeventhDay.setDate(currentDate.getDate() - 7);
    if (orgId) {
      overviewSales(previousSeventhDay , "previousWeek");
      overviewSales(currentDate , "currentWeek");
    }
    setCurrPathname(location.pathname);
  }, [orgId]);

  const overviewSales = (currentDate , status) => {
    const numberOfDays = 7;
   const previousWeekDates = [];
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const formatter = new Intl.DateTimeFormat('en-US', options);
    for (let i = numberOfDays - 1; i >= 0; i--) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() - i);
      const formattedDate = formatter.format(date);
      const [month, day, year] = formattedDate.split('/');
      const formattedDateString = `${year}-${month}-${day}`;
      const weekdayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      previousWeekDates.push({
        date: formattedDateString,
        weekday: weekdayName,
      });
      setOneWeek(previousWeekDates);
    }
    let payload = {
      startDate: previousWeekDates[0].date,
      endDate: previousWeekDates[6].date,
      orgId: orgId,
    };
    // if (currPathname && currPathname !== '/AllOrg_loc') {
    if (location.pathname !== '/AllOrg_loc') {
      payload.locationId = locId;
    }

    if (status === "previousWeek") {
      salesOverview(payload)
      .then((res) => {
        const matchedSales = [];
        const matchedSalesValue = [];
        previousWeekDates.map((item, index) => {
          const matchedMonth = res?.data?.data?.salesReportOverTime?.salesReportOverMonthWiseList.find((elem) =>
            elem?.days.startsWith(item?.date),
          );
          if (matchedMonth) {
            matchedSales[index] = matchedMonth.sales;
            matchedSalesValue[index] = matchedMonth.salesValue;
          } else {
            matchedSales[index] = 0;
            matchedSalesValue[index] = 0;
          }
        });
        setPrevSalesData(matchedSales);
        setPrevSalesValues(matchedSalesValue);
      })
      .catch((err) => {
        setPrevSalesData([]);
        setPrevSalesValues([]);
      });
    } else if (status === "currentWeek") { 

      salesOverview(payload)
      .then((res) => {
        const matchedSales = [];
        const matchedSalesValue = [];
        previousWeekDates.map((item, index) => {
          const matchedMonth = res?.data?.data?.salesReportOverTime?.salesReportOverMonthWiseList.find((elem) =>
            elem?.days.startsWith(item?.date),
          );
          if (matchedMonth) {
            matchedSales[index] = matchedMonth.sales;
            matchedSalesValue[index] = matchedMonth.salesValue;
          } else {
            matchedSales[index] = 0;
            matchedSalesValue[index] = 0;
          }
        });
        setSalesData(matchedSales);
        setSalesValues(matchedSalesValue);
      })
      .catch((err) => {
        setSalesData([]);
        setSalesValues([]);
      });
    }
  };

  useEffect(() => {
    const chart = {
      labels: oneWeek.map((item) => item?.weekday) || [],
      datasets: [
        {
          label: 'This Week',
          color: 'dark',
          data: filterGraph === "WeeklyOrderValue" ? salesValues :  salesData,
        },
      ],
    };

    if (!salesToggle) {
      chart.datasets = [...chart.datasets ,   {
        label: 'Last Week',
        color: 'warning',
        data: filterGraph === "WeeklyOrderValue" ? prevsalesValues :  prevsalesData,
      },]
    }
    const chartDatasets = chart.datasets
      ? chart.datasets.map((dataset) => ({
          ...dataset,
          tension: 0.4,
          pointRadius: 0,
          borderWidth: 3,
          borderColor: colors[dataset.color] ? colors[dataset.color || 'dark'].main : colors.dark.main,
          fill: true,
          maxBarThickness: 6,
          backgroundColor: gradientChartLine(
            chartRef.current.children[0],
            colors[dataset.color] ? colors[dataset.color || 'dark'].main : colors.dark.main,
          ),
        }))
      : [];

    setChartData(configs(chart.labels || [], chartDatasets));
    const sData = JSON.stringify(salesValues)
    localStorage.setItem('salesValues' , sData)
  }, [oneWeek, salesData , salesValues , filterGraph , prevsalesData , prevsalesValues]);


  const renderChart = (
    <SoftBox p={2}>
      {title || description ? (
        <SoftBox px={description ? 1 : 0} pt={description ? 1 : 0} display="flex" justifyContent="space-between">
          {title && (
            <SoftBox mb={1}>
              <SoftTypography variant="h6">{title}</SoftTypography>
            </SoftBox>
          )}
          <SoftBox mb={2}>
            <SoftTypography component="div" variant="button" fontWeight="regular" color="text">
              {description}
            </SoftTypography>
          </SoftBox>
        </SoftBox>
      ) : null}
      {useMemo(
        () => (
          <SoftBox ref={chartRef} sx={{ height }}>
            <Line data={data} options={options} />
          </SoftBox>
        ),
        [chartData, height],
      )}


    </SoftBox>
  );

  return title || description ? <Card>{renderChart}</Card> : renderChart;
}

// Setting default values for the props of SalesGradientLineChart
SalesGradientLineChart.defaultProps = {
  title: '',
  description: '',
  height: '230px',
};

// Typechecking props for the SalesGradientLineChart
SalesGradientLineChart.propTypes = {
  title: PropTypes.string,
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  chart: PropTypes.objectOf(PropTypes.array),
};

export default SalesGradientLineChart;
