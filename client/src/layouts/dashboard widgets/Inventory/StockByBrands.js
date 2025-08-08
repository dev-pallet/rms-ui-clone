import React, { useEffect, useState } from 'react';
import { isSmallScreen } from '../../ecommerce/Common/CommonFunction';
import { Card, Grid, Menu, MenuItem } from '@mui/material';
import SoftBox from '../../../components/SoftBox';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { alpha, styled } from '@mui/material/styles';
import EventIcon from '@mui/icons-material/Event';
import DefaultDoughnutChart from '../../../examples/Charts/DoughnutCharts/DefaultDoughnutChart';
import { YEAR_END_DATE } from '../../ecommerce/Common/date';
import { getStockByBrand, getStockByCategory, paymentMethodsData } from '../../../config/Services';
import SoftTypography from '../../../components/SoftTypography';
import { YEAR_START_DATE } from '../../ecommerce/Common/date';

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color: theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
      },
    },
  },
}));

const StockByBrands = () => {
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const isMobileDevice = isSmallScreen();
  const [anchorElPayment, setAnchorElPayment] = useState(null);
  const open = Boolean(anchorElPayment);
  const [openPayment, setOpenPayment] = useState(false);
  const [filterGraphPayment, setFilterGraphPayment] = useState('Weekly');

  const [chartData, setChartData] = useState({
    labels: ['No Data Available'],
    datasets: {
      label: 'Projects',
      backgroundColors: ['secondary', 'primary', 'dark', 'info', 'primary'],
      data: [1],
    },
  });

  useEffect(() => {
    getStockByBrand(orgId, locId)
      .then((res) => {
        const brandData = res?.data?.data?.data;
        const labels = brandData?.map((item) => 
          item?.brand || "NA"
        ) || [];
        const availableUnits = brandData?.map((item) => 
        item?.availableUnits
      ) || [];
        const stockValue = brandData?.map((item) => 
        item?.stockValue
      ) || [];
        if (brandData) {
          setChartData({
            labels: labels,

            datasets: {
              label: 'Projects',
              backgroundColors: ['darkblue', 'blue', 'green', 'secondary', 'success'],
              data: stockValue || [],
            },
          });
        }
      })
      .catch(() => {});
  }, []);

  const onExportPayment = async (e) => {
    setFilterGraphPayment(e);
    return;
  };
  const handleClosePayment = () => {
    setAnchorElPayment(null);
    setOpenPayment(false);
  };

  const handleClickPayment = (event) => {
    setAnchorElPayment(event.currentTarget);
    if (open) {
      setOpenPayment(false);
    } else if (event.currentTarget) {
      setOpenPayment(true);
    }
  };

  return (
    <>
      {' '}
      <Grid item xs={12}>
        <Card sx={{ margin: isMobileDevice ? '10px' : '0px' }} className="card-box-shadow">
          <DefaultDoughnutChart
            title="Stock By Brands"
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
        </Card>
      </Grid>
    </>
  );
};

export default StockByBrands;
