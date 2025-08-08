import { Card, Menu, MenuItem } from '@mui/material';
import { YEAR_END_DATE, YEAR_START_DATE } from '../../Common/date';
import { alpha, styled } from '@mui/material/styles';
import { isSmallScreen } from '../../Common/CommonFunction';
import { salesReportsChart } from '../../../../config/Services';
import CustomGradientLineChart from '../../reports/components/CustomGradientLineChart';
import EventIcon from '@mui/icons-material/Event';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ProfitsChart from '../../../dashboard widgets/Sales/profitsChart';
import React, { useEffect, useMemo, useState } from 'react';
import SalesGradientLineChart from '../../../dashboard widgets/SalesGradient/salesGradient';
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

const SalesOverViewWidget = () => {
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const isMobileDevice = isSmallScreen();
  const [filterGraph, setFilterGraph] = useState('Weekly');
  const [monthlyLabels, setMonthlyLabels] = useState([]);
  const [salesValues, setSalesValues] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [prevsalesData, setPrevSalesData] = useState([]);
  const [prevsalesValues, setPrevSalesValues] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  


  useEffect(() => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    if (filterGraph === 'Monthly' || filterGraph === 'MonthlyOrderValue') {
      const payload = {
        startDate: `${year}-${YEAR_START_DATE}`,
        endDate: `${year}-${YEAR_END_DATE}`,
        orgId: orgId,
        locationId: locId,
      };
      const prevPayload = {
        startDate: `${year - 1}-${YEAR_START_DATE}`,
        endDate: `${year - 1}-${YEAR_END_DATE}`,
        orgId: orgId,
        locationId: locId,
      };

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

      setMonthlyLabels(labels);

      salesReportsChart(payload)
        .then((res) => {
          const matchedSales = [];
          const matchedSalesValue = [];
          resultdata.map((item, index) => {
            const matchedMonth = res?.data?.data?.salesReportOverTime?.salesReportOverMonthWiseList.find(
              (monthItem) => monthItem.month === item.month,
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
        .catch((err) => {});

      salesReportsChart(prevPayload)
        .then((res) => {
          const matchedSales = [];
          const matchedSalesValue = [];
          resultdata.map((item, index) => {
            const matchedMonth = res?.data?.data?.salesReportOverTime?.salesReportOverMonthWiseList.find(
              (monthItem) => monthItem.month === item.month,
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
        .catch((err) => {});
    }
  }, [filterGraph]);



  const SaleschartData = useMemo(
    () => [
      {
        labels: monthlyLabels,
        label: 'Sales',
        color: 'dark',
        data: filterGraph === 'MonthlyOrderValue' ? salesValues : salesData,
      },
      {
        labels: monthlyLabels,
        label: 'prev data',
        color: 'warning',
        data: filterGraph === 'MonthlyOrderValue' ? prevsalesValues : prevsalesData,
      },
    ],
    [salesValues, salesData, prevsalesData, prevsalesValues],
  );
  const onExport = async (e) => {
    setFilterGraph(e);
    return;
  };


  return (
    <> <SoftBox style={{margin:isMobileDevice ? '10px' : '20px 0px 0px 0px'}}>
      <Card className={`${isMobileDevice && 'po-box-shadow'}`}>
        <SoftBox sx={{ position: 'absolute', top: 13, right: 10, flex: 1, zIndex: 10 }}>
          <div>
            <SoftBox style={{ display: 'flex' }} onClick={handleClick}>
              <FilterAltIcon />
              <SoftTypography style={{ fontSize: '0.85rem', marginInline: '10px' }}>Filter</SoftTypography>
            </SoftBox>
            <StyledMenu
              id="demo-customized-menu"
              MenuListProps={{
                'aria-labelledby': 'demo-customized-button',
              }}
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
            >
              <MenuItem
                onClick={() => {
                  handleClose();
                  onExport('Weekly');
                }}
                disableRipple
              >
                <EventIcon />
              Weekly Orders
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleClose();
                  onExport('Monthly');
                }}
                disableRipple
              >
                <EventIcon />
              Monthly Orders
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleClose();
                  onExport('WeeklyOrderValue');
                }}
                disableRipple
              >
                <EventIcon />
              Weekly Order Value
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleClose();
                  onExport('MonthlyOrderValue');
                }}
                disableRipple
              >
                <EventIcon />
              Monthly Order Value
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleClose();
                  onExport('ProfitTrend');
                }}
                disableRipple
              >
                <EventIcon />
              Profit Trend
              </MenuItem>
            </StyledMenu>
          </div>
        </SoftBox>

        {filterGraph === 'ProfitTrend' && (
          <SoftBox>
            <ProfitsChart />
          </SoftBox>
        )}
        {(filterGraph === 'Weekly' || filterGraph === 'WeeklyOrderValue') && (
          <SalesGradientLineChart
            title="Sales Overview"
            orgId={orgId}
            filterGraph={filterGraph}
            description={<SoftBox display="flex" alignItems="center"></SoftBox>}
          />
        )}
        {(filterGraph === 'Monthly' || filterGraph === 'MonthlyOrderValue') && (
          <SoftBox>
            <SoftTypography style={{ fontSize: '0.95rem', margin: '15px', marginBottom: '-2px' }}>
            Sales Overview
            </SoftTypography>
            <CustomGradientLineChart chartData={SaleschartData} />
          </SoftBox>
        )}
      </Card>
    </SoftBox></>
  );
};

export default SalesOverViewWidget;