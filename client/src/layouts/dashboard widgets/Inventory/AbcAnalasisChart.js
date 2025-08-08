import React, { useEffect, useState } from 'react'
import { isSmallScreen } from '../../ecommerce/Common/CommonFunction';
import { Card, Grid, Menu, MenuItem } from '@mui/material';
import SoftBox from '../../../components/SoftBox';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { alpha, styled } from '@mui/material/styles';
import EventIcon from '@mui/icons-material/Event';
import DefaultDoughnutChart from '../../../examples/Charts/DoughnutCharts/DefaultDoughnutChart';
import { YEAR_END_DATE } from '../../ecommerce/Common/date';
import { dashboardInventoryInfo, paymentMethodsData } from '../../../config/Services';
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

const AbcAnalasisChart = () => {
    const orgId = localStorage.getItem('orgId')
    const locId = localStorage.getItem('locId')
    const isMobileDevice = isSmallScreen();
    const [anchorElPayment, setAnchorElPayment] = useState(null);
    const open = Boolean(anchorElPayment);
  const [openPayment, setOpenPayment] = useState(false);
  const [filterGraphPayment, setFilterGraphPayment] = useState('Weekly');
  const [inventoryStockInfo, setInventoryStockInfo] = useState([]);


  const [chartData, setChartData] = useState({
    labels: ['No Data Available'],
    datasets: {
      label: 'Projects',
      backgroundColors: ['secondary', 'primary', 'dark', 'info', 'primary'],
      data: [1],
    },
  });

  const handleGetStockInfo = () => {
    dashboardInventoryInfo(locId, orgId)
      .then((res) => {
        setInventoryStockInfo(res?.data?.data?.data || []);
        const data = res?.data?.data?.data
        const  stockQuantity = data?.map((item) => item?.totalAvailableUnits)
        const  stockValue = data?.map((item) => item?.totalStockValue)
        if (stockValue?.length > 0) {
          setChartData({
            labels: ["A" , "B" , "C"],
  
            datasets: {
              label: 'Projects',
              backgroundColors: ['darkblue', 'blue', 'green', 'secondary', 'success'],
              data: stockValue,
            },
          });
        } 
      })
      .catch(() => {});
  };
  useEffect(() => {
    handleGetStockInfo();
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
    <> <Grid item xs={12}>
    <Card sx={{ margin: isMobileDevice ? '10px' : '0px' }} className="card-box-shadow">
      {/* <SoftBox sx={{ position: 'absolute', top: 13, right: 10, flex: 1, zIndex: 10 }}>
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
      </SoftBox> */}
      <DefaultDoughnutChart
        title="ABC Analysis"
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
  )
}

export default AbcAnalasisChart