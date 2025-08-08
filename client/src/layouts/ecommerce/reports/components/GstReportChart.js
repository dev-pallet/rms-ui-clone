import ArchiveIcon from '@mui/icons-material/Archive'; // theme css file
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import { CircularProgress, Menu, MenuItem } from '@mui/material';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { alpha, styled } from '@mui/material/styles';
import React, { useState } from 'react';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { useParams } from 'react-router-dom';
import SoftBox from '../../../../components/SoftBox';
import SoftButton from '../../../../components/SoftButton';
import SoftInput from '../../../../components/SoftInput';
import SoftSelect from '../../../../components/SoftSelect';
import SoftTypography from '../../../../components/SoftTypography';
import { exportGstConsolidatedReport, exportProfitReport, exportTaxPdf } from '../../../../config/Services';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import { useSnackbar } from '../../../../hooks/SnackbarProvider'; // main style file
import SalesGradientLineChart from '../../../dashboard widgets/SalesGradient/salesGradient';
import Filter from '../../Common/Filter';
import CustomGradientLineChart from './CustomGradientLineChart';

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

const orderTypes = [
  { value: 'SALES_ORDER', label: 'Sales Order' },
  { value: 'POS_ORDER', label: 'Pos Order' },
  { value: 'B2C_ORDER', label: 'App Order' },
  { value: 'MARKETPLACE_ORDER', label: 'Marketplace Order' },
  { value: 'ALL_ORDERS', label: 'All Orders' },
];

const GstReportChart = () => {
  const showSnackbar = useSnackbar();

  const { reportId } = useParams();
  const [tabledata, setTabledata] = useState([]);
  const [fromdate, setFromdate] = useState();
  const [todate, setTodate] = useState();
  const [status, setStatus] = useState('ACCEPTED');
  const [retail, setRetail] = useState([]);
  const [warehousdata, setWarehouseData] = useState();
  const [vmsData, setVmsData] = useState();
  const [loader, setLoader] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [initialMount, setInitialMount] = useState(true);
  const [modifiedStartDate, setModifiedStartDate] = useState('');
  const [modifiedEndDate, setModifiedEndDate] = useState('');
  const [selectedOptionType, setSelectedOptionType] = useState({ value: 'ALL_ORDERS', label: 'All Orders' });

  const open = Boolean(anchorEl);

  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const handleMonthSelect = (date) => {
    const [year, month] = date?.split('-');
    const startDate = `${date}-02`;
    const endDate = `${date}-${new Date(year, month, 0).getDate()}`;

    setModifiedStartDate(startDate);
    setModifiedEndDate(endDate);
  };

  const onPrint = () => {
    window.print();
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const onExport = async (e) => {
    if (reportId === 'GstConsolidateReport') {
      fetchExportGstConsolidatedReport();
      return;
    }
    if (!selectedOptionType?.value || !modifiedStartDate) {
      setLoader(false);
      showSnackbar('Please select order type and month', 'error');
      return;
    }
    setLoader(true);
    const payload = {
      startDate: modifiedStartDate,
      endDate: modifiedEndDate,
      locationId: locId,
      exportType: e,
      orderType: selectedOptionType?.value !== 'ALL_ORDERS' ? selectedOptionType?.value : null,
    };
    let fileformat;
    if (e === 'excel') {
      fileformat = 'xlsx';
    } else {
      fileformat = e;
    }

    try {
      const response = await exportTaxPdf(payload);
      const newblob = await response.blob();
      setLoader(false);
      const link = document.createElement('a');
      link.href = URL.createObjectURL(newblob);
      link.download = `TaxReport.${fileformat}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setLoader(false);
    }
  };

  const fetchExportGstConsolidatedReport = async () => {
    if (!selectedOptionType?.value || !modifiedStartDate) {
      setLoader(false);
      showSnackbar('Please select order type and month', 'error');
      return;
    }
    const payload = {
      locationId: locId,
      startDate: modifiedStartDate,
      endDate: modifiedEndDate,
      orderType: selectedOptionType?.value !== 'ALL_ORDERS' ? selectedOptionType?.value : null,
    };

    try {
      const response = await exportGstConsolidatedReport(payload);
      const newblob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(newblob);
      link.download = `GstConsolidatedReport.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();

      setLoader(false);
    } catch (err) {
      console.error('Error exporting GST consolidated report:', err);
      setLoader(false); // Hide loader on error
    }
  };

  const handleProfitExport = async () => {
    const payload = {
      startDate: fromdate,
      endDate: todate,
      locationId: locId,
    };

    try {
      const response = await exportProfitReport(payload);
      const newblob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(newblob);
      link.download = 'ProfitReport.pdf';
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {}
  };

  const onSave = () => {
    window.print();
  };

  const transformedOptions = retail?.map((retail) => ({
    value: retail?.branches?.map((branch) => branch.displayName),
    label: retail?.branches.map((branch) => branch.displayName),
  }));
  // console.log(transformedOptions)

  const currMonth = new Date().getMonth() + 1;
  const currentDate = new Date();
  const year = currentDate.getFullYear();

  const startDate = `${year}-${currMonth.toString().padStart(2, '0')}-01`;
  const lastDay = new Date(year, currMonth, 0).getDate();
  const endDate = `${year}-${currMonth.toString().padStart(2, '0')}-${lastDay.toString().padStart(2, '0')}`;

  const [lastSixmonths, setLastSixMonths] = useState([]);
  const [salesValues, setSalesValues] = useState([]);
  const [salesData, setSalesData] = useState([]);

  const chartData = [
    {
      labels: lastSixmonths.map((item) => item.name) || [],
      label: 'Price',
      color: 'dark',
      data: salesValues,
    },
  ];

  const orderTypeSelect = (
    <>
      {/* <InputLabel required className="inputLabel-style">
        Order type
      </InputLabel> */}
      <SoftSelect
        options={orderTypes}
        onChange={(e) => setSelectedOptionType(e)}
        value={selectedOptionType}
      ></SoftSelect>
    </>
  );
  const selectBoxArray = [orderTypeSelect];

  const handleTextSpace = (text) => {
    return text
      ?.replace(/([A-Z])/g, ' $1')
      .trim()
      .replace(/^\w/, (c) => c.toUpperCase());
  };

  return (
    <DashboardLayout>
      <DashboardNavbar prevLink={true} />
      <Container fixed>
        <Box className="search-bar-filter-and-table-container">
          <Box
            className="search-bar-filter-container"
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            {' '}
            <SoftTypography style={{ color: 'white', fontSize: '1.2rem' }}>{handleTextSpace(reportId)}</SoftTypography>
            {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatepickerReport setFromdate={setFromdate} setTodate={setTodate} />
            </LocalizationProvider> */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <SoftInput type="month" onChange={(e) => handleMonthSelect(e?.target?.value)}></SoftInput>
              <Filter selectBoxArray={selectBoxArray} />
            </div>
          </Box>
          <SoftBox style={{ padding: '15px' }}>
            <SoftBox style={{ display: 'flex', gap: '15px' }}>
              <div>
                {loader ? (
                  <SoftButton color="info">
                    <CircularProgress className="circular-progress-dashboard" />
                  </SoftButton>
                ) : (
                  <SoftButton color="info" onClick={handleClick}>
                    <CloudDownloadOutlinedIcon sx={{ marginRight: '10px' }} />
                    Export
                  </SoftButton>
                )}
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
                    disabled
                    onClick={() => {
                      handleClose();
                      onExport('pdf');
                      setLoader(true);
                    }}
                    disableRipple
                  >
                    <FileCopyIcon />
                    PDF
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleClose();
                      onExport('excel');
                      // setLoader(true);
                    }}
                    disableRipple
                  >
                    <ArchiveIcon />
                    EXCEL
                  </MenuItem>
                </StyledMenu>
              </div>
            </SoftBox>

            {todate && fromdate ? (
              <CustomGradientLineChart chartData={chartData} />
            ) : (
              // <GradientLineChart
              //   chart={{
              //     labels: lastSixmonths.map((item) => item.name) || [],
              //     datasets: [
              //       {
              //         label: 'Price',
              //         color: 'dark',
              //         data: salesValues,
              //       },
              //     ],
              //   }}
              // />
              <SalesGradientLineChart />
            )}
          </SoftBox>
        </Box>
      </Container>
    </DashboardLayout>
  );
};

export default GstReportChart;
