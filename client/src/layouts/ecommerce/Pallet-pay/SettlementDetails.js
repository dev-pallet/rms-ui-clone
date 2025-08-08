import './PalletPay.css';
import { Box, Grid } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { getSettlementDetailsForId, getSettlementDetailsForOrgForDay } from '../../../config/Services';
import { makeStyles } from '@mui/styles';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import CloseIcon from '@mui/icons-material/Close';
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../examples/Navbars/DashboardNavbar';
import Drawer from '@mui/material/Drawer';
import Filter from '../Common/Filter';
import React from 'react';
import SettlementDrawerDetails from './SettlementDrawerDetails';
import SettlementTransaction from './SettlementTransaction';
import SoftBox from '../../../components/SoftBox';
import SoftInput from '../../../components/SoftInput';
import SoftTypography from '../../../components/SoftTypography';
import Spinner from 'components/Spinner/index';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { noDatagif } from '../Common/CommonFunction';

const drawerWidth = 500;

const useStyles = makeStyles((theme) => ({
  drawer: {
    minWidth: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    minWidth: drawerWidth,
    backgroundColor: 'white !important',
  },
  content: {
    padding: '16px',
  },
}));

const SettlementDetails = () => {
  const { date } = useParams();

  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');

  const classes = useStyles();
  const [loader, setLoader] = useState(false);
  const [transactionId, setTransactionId] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [errorComing, setErrorComing] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [rowData, setRowData] = useState(null);
  const [settlementDrawerData, setSettlementDrawerData] = useState(null);
  const [pageState, setPageState] = useState({
    loader: false,
    datRows: [],
    total: 0,
    page: 1,
    pageSize: 10,
  });

  const dateAndTimeConverter = (timestamp) => {
    // Convert the timestamp to a JavaScript Date object
    const dateObject = new Date(timestamp);

    // Format the date and time as desired
    const formattedDateTime = dateObject.toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
    });

    return formattedDateTime;
  };

  const settlementColumns = [
    {
      headerName: 'Transaction Date',
      field: 'calculatedOn',
      minWidth: 220,
      editable: false,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
    },
    {
      headerName: 'Settlement Amount',
      field: 'settlementAmount',
      type: 'number',
      minWidth: 180,
      editable: false,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
    },
    {
      headerName: 'Transaction Charges',
      field: 'transactionCharges',
      type: 'number',
      minWidth: 180,
      editable: false,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
    },
    {
      headerName: 'Transaction Rate',
      field: 'rate',
      type: 'number',
      minWidth: 180,
      editable: false,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
    },
    {
      headerName: 'Payment Method',
      field: 'paymentMethod',
      type: 'number',
      minWidth: 180,
      editable: false,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
    },
    {
      headerName: 'Card Type',
      field: 'cardType',
      type: 'number',
      minWidth: 180,
      editable: false,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
    },
    {
      headerName: 'Card Brand',
      field: 'cardBrand',
      type: 'number',
      minWidth: 180,
      editable: false,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
    },
  ];

  const mockSettlementData = [
    {
      settlementAmount: 541.23,
      transactionCharges: 5.47,
      calculatedOn: dateAndTimeConverter('2023-11-23T18:55:16.825124'),
      id: 2,
      paymentMethod: 'CARD',
      cardType: null,
      cardBrand: null,
      rate: 1.0,
    },
    {
      settlementAmount: 664.92,
      transactionCharges: 3.34,
      calculatedOn: dateAndTimeConverter('2023-11-23T18:55:16.825124'),
      id: 4,
      paymentMethod: 'CARD',
      cardType: null,
      cardBrand: null,
      rate: 0.5,
    },
    {
      settlementAmount: 592.07,
      transactionCharges: 3.57,
      calculatedOn: dateAndTimeConverter('2023-11-23T18:55:16.826123'),
      id: 5,
      paymentMethod: 'CARD',
      cardType: null,
      cardBrand: null,
      rate: 0.6,
    },
    {
      settlementAmount: 297.51,
      transactionCharges: 1.5,
      calculatedOn: dateAndTimeConverter('2023-11-23T18:55:16.826123'),
      id: 6,
      paymentMethod: 'CARD',
      cardType: null,
      cardBrand: null,
      rate: 0.5,
    },
    {
      settlementAmount: 1188.36,
      transactionCharges: 7.17,
      calculatedOn: dateAndTimeConverter('2023-11-23T18:55:16.826123'),
      id: 7,
      paymentMethod: 'CARD',
      cardType: null,
      cardBrand: null,
      rate: 0.6,
    },
    {
      settlementAmount: 1252.46,
      transactionCharges: 6.29,
      calculatedOn: dateAndTimeConverter('2023-11-23T18:55:16.826123'),
      id: 8,
      paymentMethod: 'CARD',
      cardType: null,
      cardBrand: null,
      rate: 0.5,
    },
    {
      settlementAmount: 781.7,
      transactionCharges: 7.9,
      calculatedOn: dateAndTimeConverter('2023-11-23T18:55:16.826123'),
      id: 9,
      paymentMethod: 'CARD',
      cardType: null,
      cardBrand: null,
      rate: 1.0,
    },
    {
      settlementAmount: 1202.17,
      transactionCharges: 12.14,
      calculatedOn: dateAndTimeConverter('2023-11-23T18:55:16.826123'),
      id: 10,
      paymentMethod: 'CARD',
      cardType: null,
      cardBrand: null,
      rate: 1.0,
    },
    {
      settlementAmount: 3239.67,
      transactionCharges: 39.35,
      calculatedOn: dateAndTimeConverter('2023-11-23T18:55:16.827104'),
      id: 11,
      paymentMethod: 'CARD',
      cardType: null,
      cardBrand: null,
      rate: 1.2,
    },
    {
      settlementAmount: 1475.76,
      transactionCharges: 7.42,
      calculatedOn: dateAndTimeConverter('2023-11-23T18:55:16.827104'),
      id: 12,
      paymentMethod: 'CARD',
      cardType: null,
      cardBrand: null,
      rate: 0.5,
    },
  ];

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  const fetchSettlementDetails = async () => {
    const payload = {
      date: date,
      organizationId: orgId,
      pageNumber: pageState.page - 1,
      pageSize: pageState.pageSize,
    };

    try {
      setLoader(true);
      const response = await getSettlementDetailsForOrgForDay(payload);
      setErrorComing(false);
      let result = response.data.data.settlements;
      if (response.data.data.settlements.length > 0 && response.data.data.es == 0) {
        result = result.map((row) => ({
          id: uuidv4(),
          settlementAmount: row?.settlementAmount !== null ? '₹' + row?.settlementAmount : '---',
          transactionCharges: row?.transactionCharges !== null ? '₹' + row?.transactionCharges : '---',
          calculatedOn: row?.calculatedOn !== null ? dateAndTimeConverter(row?.calculatedOn) : row?.calculatedOn,
          paymentMethod: row?.paymentMethod !== null ? row?.paymentMethod : '---',
          cardType: row?.cardType !== null ? row?.cardType : '---',
          cardBrand: row?.cardBrand !== null ? row?.cardBrand : '---',
          rate: row?.rate !== null ? row?.rate : '---',
          ezetapTransactionId: row?.ezetapTransactionId !== null ? row?.ezetapTransactionId : '---',
          transactionId: row.id,
        }));
        setPageState((old) => ({
          ...old,
          loader: false,
          datRows: result || [],
          total: response.data.data.totalSize,
        }));
      } else {
        setLoader(false);
        setErrorComing(true);
      }

      setLoader(false);
    } catch (err) {
      setLoader(false);
      setErrorComing(true);
    }
  };

  useEffect(() => {
    fetchSettlementDetails();
  }, [date, pageState.page, pageState.pageSize]);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleRowDetails = async (rows) => {
    const txnId = rows.row.transactionId;
    try {
      const response = await getSettlementDetailsForId(txnId);
      const result = response.data.data.data;
      setSettlementDrawerData(result);
    } catch (err) {}
    toggleDrawer();
  };

  const handleTabsChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Box
        // className="table-css-fix-box-scroll-vend"
        // style={{
        //   boxShadow: 'rgba(37, 37, 37, 0.126) 0px 5px 50px',
        //   position: 'relative',
        // }}
        className="search-bar-filter-and-table-container"
      >
        <Box className="search-bar-filter-container">
          <Grid container spacing={2}>
            <Grid item lg={5.5} md={5.5} sm={6} xs={12}>
              <SoftInput
                // className="filter-soft-input-box"
                placeholder="Search Orders"
                icon={{ component: 'search', direction: 'left' }}
              />
            </Grid>

            <Grid
              item
              lg={6.5}
              md={6.5}
              sm={6}
              xs={12}
              sx={{ display: 'flex', justifyContent: 'right', alignItems: 'center', gap: '10px' }}
            >
              {/* filter  */}
              <Filter />
            </Grid>
          </Grid>
        </Box>
        <Box
        // className="settlement-table"
        >
          {errorComing ? (
            <SoftBox className="No-data-text-box">
              <SoftBox className="src-imgg-data">
                <img className="src-dummy-img" src={noDatagif} />
              </SoftBox>

              <h3 className="no-data-text-I">NO DATA FOUND</h3>
            </SoftBox>
          ) : (
            <div style={{ height: 525, width: '100%' }} className="datagrid-container">
              {loader && (
                <SoftBox
                  sx={{
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Spinner />
                </SoftBox>
              )}
              {!loader && (
                <DataGrid
                  rows={pageState.datRows}
                  columns={settlementColumns}
                  rowCount={parseInt(pageState.total)}
                  // rowsPerPageOptions={[10]}
                  loading={pageState.loader}
                  pageCount
                  disableSelectionOnClick
                  pagination
                  page={pageState.page - 1}
                  pageSize={pageState.pageSize}
                  paginationMode="server"
                  onPageChange={(newPage) => {
                    setPageState((old) => ({ ...old, page: newPage + 1 }));
                  }}
                  onPageSizeChange={(newPageSize) => setPageState((old) => ({ ...old, pageSize: newPageSize }))}
                  getRowId={(row) => row.id}
                  onCellClick={(rows) => handleRowDetails(rows)}
                />
              )}
            </div>
          )}
        </Box>
      </Box>
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={handleCloseDrawer}
        className={classes.drawer}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Box className={classes.content}>
          <Box className="top-header-drawer">
            <SoftTypography
              sx={{
                fontSize: '1rem',
                fontWeight: 'bold',
              }}
            >
              Settlement details
            </SoftTypography>
            <CloseIcon
              onClick={handleCloseDrawer}
              sx={{
                fontSize: '1rem',
                cursor: 'pointer',
              }}
            />
          </Box>
          <Box className="transaction-tabs">
            <Tabs
              onChange={handleTabsChange}
              value={tabValue}
              TabIndicatorProps={{ style: { backgroundColor: '#343767' } }}
            >
              <Tab
                label={
                  <SoftBox
                    py={0.5}
                    px={2}
                    sx={{
                      color: tabValue == 0 ? 'white !important' : null,
                    }}
                  >
                    Settlement details
                  </SoftBox>
                }
              />
              <Tab
                label={
                  <SoftBox
                    py={0.5}
                    px={2}
                    sx={{
                      color: tabValue == 1 ? 'white !important' : null,
                    }}
                  >
                    Transaction details
                  </SoftBox>
                }
              />
            </Tabs>
          </Box>
        </Box>
        <Box className="tab-contents">
          {/* {tabValue === 0 && transactionIdDetails !== null && (
            <TransactionDetails transactionIdDetails={transactionIdDetails} />
          )}
          {tabValue === 1 && transactionIdDetails !== null && (
            <MerchantDetails transactionIdDetails={transactionIdDetails} />
          )} */}
          {tabValue === 0 && <SettlementDrawerDetails settlementDetails={settlementDrawerData?.settlement} />}
          {tabValue === 1 && <SettlementTransaction transactionDetails={settlementDrawerData?.transaction} />}
        </Box>
      </Drawer>
    </DashboardLayout>
  );
};

export default SettlementDetails;
