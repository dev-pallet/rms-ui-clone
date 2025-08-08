import React from 'react';
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../examples/Navbars/DashboardNavbar';
import GradientLineChart from '../../../examples/Charts/LineCharts/GradientLineChart';
import Grid from '@mui/material/Grid';
import { getProfitDetails } from '../../../config/Services';
import { useEffect, useState } from 'react';
import VerticalBarChart from '../../../examples/Charts/BarCharts/VerticalBarChart';
import { START_DATE , END_DATE} from '../../ecommerce/Common/date';
const ProfitsChart = ({orgIdb}) => {
  const [profitData, setProfitData] = useState([]);
  const [oneWeek, setOneWeek] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [salesValues, setSalesValues] = useState([]);
  const [labels , setlabels] = useState([])
  const locId = localStorage.getItem('locId');
  const orgId = localStorage.getItem('orgId');

  const formatLargeNumber = (num) => {
    return num.toLocaleString('en-IN');
  };

  const salesValueData = JSON.parse(localStorage.getItem('salesValues'));
  const overviewSales = () => {
    const numberOfDays = 7;
    const currentDate = new Date();
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
    const year = currentDate.getFullYear();
    let payload = {
      startDate: `${year}-${START_DATE}`,
      endDate: `${year + 1}-${END_DATE}`,
      orgId: orgId || orgIdb,
      frequency: 'month',
    };

    if (locId) {
      payload.locationId = locId;
    }



      const months = [
        {
          name: 'January',
          month: 1,
        },
        {
          name: 'February',
          month: 2,
        },
        {
          name: 'March',
          month: 3,
        },
        {
          name: 'April',
          month: 4,
        },
        {
          name: 'May',
          month: 5,
        },
        {
          name: 'June',
          month: 6,
        },
        {
          name: 'July',
          month: 7,
        },
        {
          name: 'August',
          month: 8,
        },
        {
          name: 'September',
          month: 9,
        },
        {
          name: 'October',
          month: 10,
        },
        {
          name: 'November',
          month: 11,
        },
        {
          name: 'December',
          month: 12,
        },
      ];

      const currentMonth = new Date().getMonth();
      const resultdata = Array.from({ length: 6 }, (_, index) => {
        const monthIndex = (currentMonth - index + 12) % 12;
        return {
          name: months[monthIndex].name,
          month: monthIndex + 1,
        };
      }).reverse();
      const labels = Array.from({ length: 6 }, (_, index) => {
        const monthIndex = (currentMonth - index + 12) % 12;
        return months[monthIndex].name.slice(0, 3);
      }).reverse();

      setlabels(labels);

      getProfitDetails(payload)
      .then((res) => {

        setProfitData(res?.data?.data.marginData?.map((item) => item.grossProfit) || []);

        const matchedSales = [];
        const matchedSalesValue = [];
        resultdata.map((item, index) => {
          const matchedMonth = res?.data?.data.marginData.find(
            (monthItem) => monthItem.months === item.month,
          );
          if (matchedMonth) {
            matchedSales[index] = matchedMonth.grossSales || 0;
            matchedSalesValue[index] = matchedMonth.grossPurchase || 0;
          } else {
            matchedSales[index] = 0;
            matchedSalesValue[index] = 0;
          }
        });
        setSalesData(matchedSales || []);
        setSalesValues(matchedSalesValue || []);
        // setlabels(previousWeekDates?.map((e) => e.weekday))
      })
      .catch((err) => {
        setSalesData([]);
        setSalesValues([]);
      });
  };
  useEffect(() => {
    overviewSales();
  }, []);

  return (
    <>
      
          <VerticalBarChart
                  height="230px"
            title="Revenue Overview"
            chart={{
              labels: labels || [],
              datasets: [
                {
                  label: 'Sales Value',
                  color: 'dark',
                  data: salesData,
                },
                {
                  label: 'Purchase Value',
                  color: 'info',
                  data: salesValues,
                },
                // {
                //   label: 'Margin %',
                //   color: 'success',
                //   data: [10,20,30,25,33,28,48],
                // },
              ],
            }}
          />
     
    </>
  );
};

export default ProfitsChart;
