import { Card, Grid, Menu, MenuItem } from '@mui/material';
import { YEAR_END_DATE, YEAR_START_DATE } from '../../Common/date';
import { alpha, styled } from '@mui/material/styles';
import { isSmallScreen } from '../../Common/CommonFunction';
import { paymentMethodsData } from '../../../../config/Services';
import DefaultDoughnutChart from '../../../../examples/Charts/DoughnutCharts/DefaultDoughnutChart';
import EventIcon from '@mui/icons-material/Event';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import React, { useEffect, useState } from 'react';
import SoftBox from '../../../../components/SoftBox';
import SoftTypography from '../../../../components/SoftTypography';


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

const PaymentChannelWidget = () => {
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
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    const currDate = `${year}-${month}-${day}`;

    let payload;
    if (filterGraphPayment === 'Yearly' || filterGraphPayment === 'YearlyOrderValue') {
      payload = {
        startDate: `${year}-${YEAR_START_DATE}`,
        endDate: `${year}-${YEAR_END_DATE}`,
        orgId: orgId,
        locationId: locId,
      };
    } else {
      const previousDate = new Date(currentDate);
      previousDate.setDate(currentDate.getDate() - 6);
      const prevYear = previousDate.getFullYear();
      const prevMonth = (previousDate.getMonth() + 1).toString().padStart(2, '0');
      const prevDay = previousDate.getDate().toString().padStart(2, '0');
      const formattedPrevDate = `${prevYear}-${prevMonth}-${prevDay}`;
      payload = {
        startDate: formattedPrevDate,
        endDate: currDate,
        orgId: orgId,
        locationId: locId,
      };
    }

    paymentMethodsData(payload)
      .then((res) => {
        if (
          res?.data?.data?.es === 0 &&
          res?.data?.data?.salesData !== undefined &&
          res?.data?.data?.orderResponseModel === undefined
        ) {
          const cardValue = res?.data?.data?.salesData?.cardOrders || 0;
          const cardOrderValue = res?.data?.data?.salesData?.cardOrdersValue || 0;
          const upiValue = res?.data?.data?.salesData?.upiOrders || 0;
          const upiOrderValue = res?.data?.data?.salesData?.upiOrdersValue || 0;
          const cashValue = res?.data?.data?.salesData?.cashOrders || 0;
          const cashOrderValue = res?.data?.data?.salesData?.cashOrdersValue || 0;
          const splitValue = res?.data?.data?.salesData?.splitOrders || 0;
          const splitOrderValue = res?.data?.data?.salesData?.splitOrdersValue || 0;
          const sodexoValue = res?.data?.data?.salesData?.sodexoOrders || 0;
          const sodexoOrdersValue = res?.data?.data?.salesData?.sodexoOrdersValue || 0;
          if (filterGraphPayment === 'WeeklyOrderValue' || filterGraphPayment === 'YearlyOrderValue') {
            setChartData({
              labels: ['Cash', 'UPI', 'Card', 'Split', 'Sodexo'],

              datasets: {
                label: 'Projects',
                backgroundColors: ['darkblue', 'blue', 'green', 'secondary', 'success'],
                data: [cashOrderValue, upiOrderValue, cardOrderValue, splitOrderValue, sodexoOrdersValue],
              },
            });
          } else {
            setChartData({
              labels: ['Cash', 'UPI', 'Card', 'Split', 'Sodexo'],
              datasets: {
                label: 'Projects',
                backgroundColors: ['darkblue', 'blue', 'green', 'secondary', 'success'],
                data: [cashValue, upiValue, cardValue, splitValue, sodexoValue],
              },
            });
          }
        }
      })
      .catch((err) => {});
  }, [filterGraphPayment]);

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
    <> <Grid item xs={12} lg={5}>
      <Card sx={{ margin: isMobileDevice ? '10px' : '0px' }}>
        <SoftBox sx={{ position: 'absolute', top: 13, right: 10, flex: 1, zIndex: 10 }}>
          <div>
            <SoftBox style={{ display: 'flex' }} onClick={handleClickPayment}>
              <FilterAltIcon />
              <SoftTypography style={{ fontSize: '0.85rem', marginInline: '10px' }}>Filter</SoftTypography>
            </SoftBox>
            <StyledMenu
              id="demo-customized-menu"
              MenuListProps={{
                'aria-labelledby': 'demo-customized-button',
              }}
              anchorEl={anchorElPayment}
              open={openPayment}
              onClose={handleClosePayment}
            >
              <MenuItem
                onClick={() => {
                  handleClosePayment();
                  onExportPayment('Weekly');
                }}
                disableRipple
              >
                <EventIcon />
              Weekly Orders
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleClosePayment();
                  onExportPayment('Yearly');
                }}
                disableRipple
              >
                <EventIcon />
              Yearly Orders
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleClosePayment();
                  onExportPayment('WeeklyOrderValue');
                }}
                disableRipple
              >
                <EventIcon />
              Weekly Order Value
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleClosePayment();
                  onExportPayment('YearlyOrderValue');
                }}
                disableRipple
              >
                <EventIcon />
              Yearly Order Value
              </MenuItem>
            </StyledMenu>
          </div>
        </SoftBox>
        <DefaultDoughnutChart
          title="Payment channels"
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

    </Grid></>
  );
};

export default PaymentChannelWidget;