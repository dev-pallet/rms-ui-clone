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

import { useEffect, useMemo, useState } from 'react';

// porp-types is a library for typechecking of props
import PropTypes from 'prop-types';

// react-chartjs-2 components
import { Pie } from 'react-chartjs-2';

// @mui material components
import Card from '@mui/material/Card';

// Soft UI Dashboard PRO React components
import SoftBox from '../../../components/SoftBox';
import SoftTypography from '../../../components/SoftTypography';

// PieChart configurations
import { paymentChannel } from '../../../config/Services';
import configs from '../../../examples/Charts/PieChart/configs';
import PieChart from '../../../examples/Charts/PieChart';

function PaymentPieChart({ title, description, height, orgId }) {

    const [chartData, setChartData] = useState({});
    const { data, options } = chartData;
    const [paymentData, setPaymentData] = useState([]);
    const currMonth = new Date().getMonth() + 1;
    const currentDate = new Date();
    const year = currentDate.getFullYear();


    const startDate = `${year}-${currMonth.toString().padStart(2, '0')}-01`;
    const lastDay = new Date(year, currMonth, 0).getDate();
    const endDate = `${year}-${currMonth.toString().padStart(2, '0')}-${lastDay.toString().padStart(2, '0')}`;

    useEffect(() => {
        payment();
    }, [])
    const payment  = () => {
        let payload = {
            startDate: startDate,
            endDate: endDate,
            months: currMonth,
            orgId: orgId,
            locationId: localStorage.getItem('locId'),
          }
        paymentChannel(payload)
        .then((res) => {
            setPaymentData(res.data.data)
        })
        .catch((err) => {

        })
    }

    useEffect(() => {
        const chart = {
            labels: ["Cash", "UPI", "Debit card", "Credit card"],
            datasets: {
                label: "Projects",
                backgroundColors: ["secondary", "primary", "dark", "info", "primary"],
                data: [60, 20, 15, 12],
            },
        };
      setChartData(configs(chart.labels || [], chart.datasets || {}));
    }, [paymentData])

  const renderChart = (
    <SoftBox p={2}>
      {title || description ? (
        <SoftBox px={description ? 1 : 0} pt={description ? 1 : 0}>
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
          <SoftBox height={height}>
   <PieChart
                title="Payment channels"
                height="305px"
                chart={{
                  labels: ['Cash', 'UPI', 'Card'],
                  datasets: {
                    label: 'Projects',
                    backgroundColors: ['secondary', 'primary', 'dark', 'info', 'primary'],
                    data: [60, 20, 15],
                  },
                }}
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
            {/* <Pie data={data} options={options } /> */}
          </SoftBox>
        ),
        [chartData, height],
      )}
    </SoftBox>
  );

  return title || description ? <Card>{renderChart}</Card> : renderChart;
}

// Setting default values for the props of PaymentPieChart
PaymentPieChart.defaultProps = {
  title: '',
  description: '',
  height: '19.125rem',
};

// Typechecking props for the PaymentPieChart
PaymentPieChart.propTypes = {
  title: PropTypes.string,
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  chart: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.array, PropTypes.object])).isRequired,
};

export default PaymentPieChart;
