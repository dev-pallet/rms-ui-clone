import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Chip, FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { DataGrid } from '@mui/x-data-grid';
import moment from 'moment';
import { useEffect, useState } from 'react';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import SoftBox from '../../../../components/SoftBox';
import SoftButton from '../../../../components/SoftButton';
import SoftSelect from '../../../../components/SoftSelect';
import SoftTypography from '../../../../components/SoftTypography';
import { exportBigQueryReports, fetchGeneratedInventoryReports } from '../../../../config/Services';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import { useSnackbar } from '../../../../hooks/SnackbarProvider';
import { dataGridStyles } from '../../Common/NewDataGridStyle';
import downLoadLogo from '../components/assests/downloadLogo.png';
import CreateNewReportModal from './CreateNewReportModal';

const InventoryReportchart = () => {
  const showSnackBar = useSnackbar();

  const [fromdate, setFromdate] = useState();
  const [todate, setTodate] = useState();
  const [selectedValue, setSelectedValue] = useState('A');
  const [selectedAnalysisType, setSelectedAnalysisType] = useState({ value: 'INVENTORY', label: 'Inventory' });
  const [exportInventoryLog, setExportInventoryLog] = useState([]);
  const [loader, setLoader] = useState(false);
  const { reportId } = useParams();
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const user_name = localStorage.getItem('user_name');
  const user_details = localStorage.getItem('user_details');
  const exportedById = user_details && JSON.parse(user_details).uidx;
  const [open, setOpen] = useState(false);

  const randomId = uuidv4();

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleTextSpace = (text) => {
    return text
      ?.replace(/([A-Z])/g, ' $1')
      .trim()
      .replace(/^\w/, (c) => c.toUpperCase());
  };
  const fetchReportType = (reportType) => {
    const reportTypeMap = {
      InventoryOverTime: 'INVENTORY_OVER_TIME',
      SlowMovingInventory: 'SLOW_MOVING_ITEM_WISE_REPORT',
      InvalidPriceConditions: 'INVALID_PRICE_CONDITION_REPORT',
      ExpiredProducts: 'EXPIRED_INVENTORY_REPORT',
      InventoryByDay: 'INVENTORY_BY_DAY',
      WastageReport: 'WASTAGE_STOCK_REPORT',
      InventoryBasedOnAnalysis: 'ABC_ANALYSIS_REPORT',
      ProductsExpiringToday: 'TODAY_EXPIRING_PRODUCT',
      ExpiredProductsInTheLast30Days: 'LAST_THIRTY_DAYS_EXPIRED_PRODUCT',
      ProductsExpiringInTheNext7Days: 'NEXT_SEVEN_DAYS_EXPIRING_PRODUCT',
      ProductsExpiringInTheNext14Days: 'NEXT_FOURTEEN_DAYS_EXPIRING_PRODUCT',
      ExpiredProductAdjustmentsReport: 'ADJUSTMENT_EXPIRED_REPORT',
      ManualInventoryAdjustmentsReport: 'ADJUSTMENT_MANUAL_REPORT',
      WastageAdjustmentsReport: 'ADJUSTMENT_WASTAGE_REPORT',
      StockAgingReportLast3Months: 'LAST_THREE_MONTHS_STOCK_AGING_REPORT',
      InactiveInventoryProductsReport: 'INACTIVE_INVENTORY_PRODUCTS_REPORT',
      ActiveInventoryProductsReport: 'ACTIVE_INVENTORY_PRODUCTS_REPORT',
      NegativeInventoryStockReport: 'NEGATIVE_INVENTORY_STOCK_REPORT',
      InventoryStockReport: 'INVENTORY_STOCK_REPORT',
      InventoryDailyOversoldReport: 'INVENTORY_DAILY_OVERSOLD',
      DayWiseItemReport: 'DAY_WISE_ITEM_REPORT',
      InventoryAdjustmentStockCount: 'INVENTORY_ADJUSTMENT_STOCK_COUNT'
    };

    // Normalize reportType by removing spaces and non-alphanumeric characters
    const normalizedReportType = reportType.replace(/[^a-zA-Z0-9]/g, '');
    return reportTypeMap?.[normalizedReportType] || '';
  };

  const fetchAvailableReports = () => {
    const payload = {
      orgId: orgId,
      locationId: locId,
      reportType: fetchReportType(reportId),
    };
    const dateTimeFormatter = (dateString) => {
      return moment(dateString).format('MMM DD YYYY, h:mm:ss a');
    };
    if (!loader) {
      fetchGeneratedInventoryReports(payload)
        .then((res) => {
          const data = res?.data?.data?.map((item) => ({
            docId: item?.docId,
            createdOn: item?.createdOn ? dateTimeFormatter(item?.createdOn) : '---',
            reportStartDate: item?.reportStartDate || 'NA',
            reportEndDate: item?.reportEndDate || 'NA',
            status: item?.status,
            docUrl: item?.docUrl,
            createdBy: item?.createdBy || '',
          }));
          setExportInventoryLog(data || []);
        })
        .catch(() => {});
    }
  };
  useEffect(() => {
    fetchAvailableReports();
    const intervalId = setInterval(() => {
      fetchAvailableReports();
    }, 30000);
    return () => clearInterval(intervalId);
  }, [loader]);

  const handleExportBigQueryReports = () => {
    const payload = {
      locationId: locId,
      orgId: orgId,
      inventoryReportEnum: fetchReportType(reportId),
      startDate: fromdate,
      endDate: todate,
      // category : null,
      // brand : null,
      // inventoryAnalysis: null,
      // salesAnalysis : null,
      // salesProfitAnalysis : null,
      exportedByName: user_name,
      exportedBy: exportedById,
    };

    if (reportId === 'InventoryBasedOnAnalysis' && selectedAnalysisType?.value) {
      const analysisMapping = {
        INVENTORY: 'inventoryAnalysis',
        SALES: 'salesAnalysis',
        PROFIT: 'salesProfitAnalysis',
      };

      const analysisKey = analysisMapping[selectedAnalysisType?.value];
      if (analysisKey) {
        payload[analysisKey] = selectedValue;
      }
    }
    exportBigQueryReports(payload)
      .then((res) => {
        const docUrl = res?.data?.data?.reportUrl;

        if (docUrl) {
          window.open(docUrl, '_blank');
        } else {
          showSnackBar('Report is being generated', 'success');
        }
        fetchAvailableReports();
        handleClose();
      })
      .catch((err) => {
        handleClose();
      });
  };

  const chipStyle = {
    height: 'auto',
    '& .MuiChip-label': {
      fontSize: '0.75rem !Important',
    },
  };
  const exportInventoryColumns = [
    {
      field: 'docId',
      headerName: 'Req ID',
      minWidth: 80,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      flex: 1,
    },
    {
      field: 'createdOn',
      headerName: 'Created on',
      minWidth: 150,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      flex: 1,
    },
    {
      field: 'createdBy',
      headerName: 'Created By',
      minWidth: 150,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      flex: 1,
      renderCell: (params) => {
        const firstLetter = params.value ? params.value.charAt(0).toUpperCase() : '';
        const isPallet = params.value === 'Pallet';
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div
              style={{
                backgroundColor: isPallet ? 'transparent' : 'cornflowerblue',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '8px',
                fontSize: '10px',
                color: '#fff',
              }}
            >
              {isPallet ? (
                <img
                  src="https://storage.googleapis.com/twinleaves_bucket/FrontEnd/Pallet_images/Youtube%20Channel%20Logo%20(1).png"
                  alt="Pallet"
                  style={{ width: '18px', height: '18px' }}
                />
              ) : (
                firstLetter
              )}
            </div>
            {params.value}
          </div>
        );
      },
    },
    {
      field: 'reportStartDate',
      headerName: 'Start Data',
      minWidth: 120,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      flex: 1,
    },
    {
      field: 'reportEndDate',
      headerName: 'End Date',
      minWidth: 120,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      flex: 1,
    },
    {
      field: 'status',
      headerName: 'Status',
      minWidth: 150,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      flex: 1,
      renderCell: (params) => {
        if (
          params?.row?.status === 'CREATED' ||
          params?.row?.status === 'Generated' ||
          params?.row?.status === 'GENERATED'
        ) {
          return <Chip label={params?.row?.status || '---'} color="success" sx={chipStyle} />;
        } else if (params?.row?.status === 'IN_PROGRESS') {
          return <Chip label="IN-PROGRESS" color="warning" sx={chipStyle} />;
        }
      },
    },
    {
      field: 'docUrl',
      headerName: 'Url',
      minWidth: 80,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      flex: 1,
      renderCell: (params) => {
        if (
          params?.row?.status === 'CREATED' ||
          params?.row?.status === 'Generated' ||
          params?.row?.status === 'GENERATED'
        ) {
          return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
              <img
                src={downLoadLogo}
                alt="Download"
                style={{ cursor: 'pointer', width: '24px', height: '24px' }}
                onClick={() => window.location.assign(params?.row?.docUrl)}
              />
            </div>
          );
        }
      },
    },
  ];
  const noDateRangeList = [
    'Daily-Stock-Report',
    'InventoryByDay',
    'InventoryOverTime',
    'ProductsExpiringToday',
    'ExpiredProductsInTheLast 30Days',
    'ProductsExpiringInTheNext 7Days',
    'ProductsExpiringInTheNext 14Days',
    'ExpiredProductAdjustmentsReport',
    'ManualInventoryAdjustmentsReport',
    'WastageAdjustmentsReport',
    'StockAgingReport (Last 3 Months)',
    'NegativeInventoryStockReport',
    'InventoryDailyOversoldReport'
  ];
  const renderDateRange = !noDateRangeList.includes(reportId);

  const selectBoxArray = [];
  return (
    <DashboardLayout>
      <DashboardNavbar prevLink={true} />
      {open && (
        <CreateNewReportModal
          open={open}
          handleClose={handleClose}
          selectBoxArray={selectBoxArray}
          loader={loader}
          setFromdate={setFromdate}
          setTodate={setTodate}
          onExport={handleExportBigQueryReports}
          renderDateRange={renderDateRange}
        />
      )}
      <Container fixed sx={{ paddingLeft: '0 !important', paddingRight: '0 !important', paddingBottom: '15px' }}>
        <div className="reportHeader">
          <SoftTypography variant="h6" color="white">
            {' '}
            <strong> {handleTextSpace(reportId || 'InventoryReport')}</strong>
          </SoftTypography>
          {renderDateRange ? (
            <SoftButton size="small" onClick={handleOpen}>
              + Create new report
            </SoftButton>
          ) : (
            <SoftButton size="small" onClick={handleExportBigQueryReports}>
              <CloudDownloadOutlinedIcon style={{ marginRight: '5px' }} />
              Export
            </SoftButton>
          )}
        </div>
        <p style={{ fontSize: '0.7rem', margin: '5px 3px', color: 'dimgray', display: 'flex', alignItems: 'center' }}>
          <InfoOutlinedIcon style={{ marginRight: '8px', color: 'info' }} /> Data will be fetched every 30 seconds
        </p>
        {reportId === 'InventoryBasedOnAnalysis' && (
          <SoftBox
            style={{
              padding: '15px',
              display: 'flex',
              gap: '15px',
              marginTop: '10px',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', gap: '10px' }}>
              <SoftSelect
                size="small"
                value={selectedAnalysisType}
                options={[
                  { value: 'INVENTORY', label: 'Inventory' },
                  { value: 'SALES', label: 'Sales' },
                  { value: 'PROFIT', label: 'Profit' },
                ]}
                onChange={(e) => setSelectedAnalysisType(e)}
              />
              {selectedAnalysisType?.value && (
                <FormControl component="fieldset">
                  <RadioGroup aria-label="options" name="options" value={selectedValue} onChange={handleChange} row>
                    <FormControlLabel value="A" control={<Radio />} label="A" />
                    <FormControlLabel value="B" control={<Radio />} label="B" />
                    <FormControlLabel value="C" control={<Radio />} label="C" />
                  </RadioGroup>
                </FormControl>
              )}
            </div>
          </SoftBox>
        )}

        <Box>
          <Box style={{ height: 525, width: '100%' }} className="dat-grid-table-box">
            <DataGrid
              sx={{ ...dataGridStyles.header, borderRadius: '24px', cursor: 'pointer' }}
              rows={exportInventoryLog || []}
              columns={exportInventoryColumns}
              pageSize={10}
              pagination
              disableSelectionOnClick
              getRowId={(row) => row.docId || randomId}
              className="data-grid-table-boxo"
            />
          </Box>
        </Box>
      </Container>
    </DashboardLayout>
  );
};

export default InventoryReportchart;
