import './totalTransaction.css';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Box, Chip, Grid } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { makeStyles } from '@mui/styles';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import DashboardLayout from '../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../examples/Navbars/DashboardNavbar';
import Drawer from '@mui/material/Drawer';
import React, { useEffect, useState } from 'react';
import SoftBox from '../../../../../components/SoftBox';
import SoftInput from '../../../../../components/SoftInput';
import SoftSelect from '../../../../../components/SoftSelect';
import SoftTypography from '../../../../../components/SoftTypography';
import Spinner from 'components/Spinner/index';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { ChipBoxHeading } from '../../../Common/Filter Components/filterComponents';
import { dateFormatter, formatDateDDMMYYYY, noDatagif } from '../../../Common/CommonFunction';
import {
  getMachnineDetailsForTotalTransactions,
  getTotalTransactionsPalletPay,
  getTransactionDetailsWithTransactionId,
} from '../../../../../config/Services';
import Filter from '../../../Common/Filter';
import MerchantDetails from './components/MerchantDetails';
import Status from '../../../Common/Status';
import TransactionDetails from './components/TransactionDetails';
import dayjs from 'dayjs';

const drawerWidth = 500;

const useStyles = makeStyles((theme) => ({
  drawer: {
    minWidth: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    minWidth: drawerWidth,
    background: 'white !important',
  },
  content: {
    padding: '16px',
  },
}));

const TotalTransaction = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const contextType = localStorage.getItem('contextType');

  const [loader, setLoader] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [errorComing, setErrorComing] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  const [pageState, setPageState] = useState({
    loader: false,
    datRows: [],
    total: 0,
    page: 1,
    pageSize: 10,
  });

  const [filterVal, setFilterVal] = useState({
    transactionStatus: {
      value: '',
      label: 'Transaction Status',
    },
    machines: {
      value: '',
      label: 'Machines',
    },
    paymentMethod: {
      value: '',
      label: 'Payment Method',
    },
  });
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [transactionRows, setTransactionRows] = useState([]);
  const [machineLists, setMachineLists] = useState([]);
  const [transactionIdDetails, setTransactionIdDetails] = useState(null);

  // to manage filters applied state for inventory filters
  const [filtersApplied, setFiltersApplied] = useState(0);
  const [filterState, setFilterState] = useState({
    transactionStatus: 0,
    machines: 0,
    paymentMethod: 0,
    startDate: 0,
    endDate: 0,
  });

  const locId = localStorage.getItem('locId');
  const orgId = localStorage.getItem('orgId');

  const handleStartDate = (date) => {
    // let time = moment.utc(date).format('YYYY-MM-DD HH:mm:ss');
    // let stillUtc = moment.utc(time).toDate();
    // const start = moment(stillUtc).local().format('YYYY-MM-DD');
    // setStartDate(start);

    if (date) {
      // Format the date as a string in the 'YYYY-MM-DD' format
      const formattedDate = dayjs(date).format('YYYY-MM-DD');
      setStartDate(formattedDate);

      if (filterState['startDate'] === 0) {
        setFiltersApplied((prev) => prev + 1);
        setFilterState({ ...filterState, startDate: 1 });
      }
    }
  };

  const handleEndDate = (date) => {
    // let time = moment.utc(date).format('YYYY-MM-DD HH:mm:ss');
    // let stillUtc = moment.utc(time).toDate();
    // const end = moment(stillUtc).local().format('YYYY-MM-DD');
    // setEndDate(end);

    if (date) {
      // Format the date as a string in the 'YYYY-MM-DD' format
      const formattedDate = dayjs(date).format('YYYY-MM-DD');
      setEndDate(formattedDate);

      if (filterState['endDate'] === 0) {
        setFiltersApplied((prev) => prev + 1);
        setFilterState({ ...filterState, endDate: 1 });
      }
    }
  };

  const handleFilter = (option, key) => {
    setFilterVal((prev) => ({
      ...prev,
      [key]: {
        value: option.value,
        label: option.label,
      },
    }));

    if (key !== '' && key === 'transactionStatus') {
      if (filterState['transactionStatus'] === 0) {
        setFiltersApplied((prev) => prev + 1);
        setFilterState({ ...filterState, transactionStatus: 1 });
      }
    }

    if (key !== '' && key === 'machines') {
      if (filterState['machines'] === 0) {
        setFiltersApplied((prev) => prev + 1);
        setFilterState({ ...filterState, machines: 1 });
      }
    }

    if (key !== '' && key === 'paymentMethod') {
      if (filterState['paymentMethod'] === 0) {
        setFiltersApplied((prev) => prev + 1);
        setFilterState({ ...filterState, paymentMethod: 1 });
      }
    }
  };

  // chipBoxes
  const filterChipBoxes = (
    <>
      {/* transactionStatus  */}
      {filterVal.transactionStatus.value !== '' && (
        <Box className="singleChipDisplayBox">
          <ChipBoxHeading heading="Transaction Status" />
          <Box className="insideSingleChipDisplayBox">
            <Chip
              label={filterVal.transactionStatus.label}
              onDelete={() => removeSelectedFilter('transactionStatus')}
              deleteIcon={<CancelOutlinedIcon />}
              color="primary"
              variant="outlined"
            />
            {/* )} */}
          </Box>
        </Box>
      )}

      {/* machines */}
      {filterVal.machines.value !== '' && (
        <Box className="singleChipDisplayBox">
          <ChipBoxHeading heading="Machines" />
          <Box className="insideSingleChipDisplayBox">
            <Chip
              label={filterVal.machines.label}
              onDelete={() => removeSelectedFilter('machines')}
              deleteIcon={<CancelOutlinedIcon />}
              color="primary"
              variant="outlined"
            />
            {/* )} */}
          </Box>
        </Box>
      )}

      {/* paymentMethod */}
      {filterVal.paymentMethod.value !== '' && (
        <Box className="singleChipDisplayBox">
          <ChipBoxHeading heading="Payment Method" />
          <Box className="insideSingleChipDisplayBox">
            <Chip
              label={filterVal.paymentMethod.label}
              onDelete={() => removeSelectedFilter('paymentMethod')}
              deleteIcon={<CancelOutlinedIcon />}
              color="primary"
              variant="outlined"
            />
            {/* )} */}
          </Box>
        </Box>
      )}

      {/* start date  */}
      {startDate !== null && (
        <Box className="singleChipDisplayBox">
          <ChipBoxHeading heading="Start Date" />
          <Box className="insideSingleChipDisplayBox">
            <Chip
              label={formatDateDDMMYYYY(startDate)}
              onDelete={() => removeSelectedFilter('startDate')}
              deleteIcon={<CancelOutlinedIcon />}
              color="primary"
              variant="outlined"
            />
            {/* )} */}
          </Box>
        </Box>
      )}

      {/* end date  */}
      {endDate !== null && (
        <Box className="singleChipDisplayBox">
          <ChipBoxHeading heading="End Date" />
          <Box className="insideSingleChipDisplayBox">
            <Chip
              label={formatDateDDMMYYYY(endDate)}
              onDelete={() => removeSelectedFilter('endDate')}
              deleteIcon={<CancelOutlinedIcon />}
              color="primary"
              variant="outlined"
            />
            {/* )} */}
          </Box>
        </Box>
      )}
    </>
  );

  // fn to remove selected filters
  const removeSelectedFilter = (filterType) => {
    switch (filterType) {
      case 'transactionStatus':
        setFilterVal({
          ...filterVal,
          transactionStatus: {
            value: '',
            label: 'Transaction Status',
          },
        });
        setFilterState({ ...filterState, transactionStatus: 0 });
        setFiltersApplied((prev) => prev - 1);
        break;
      case 'machines':
        setFilterVal({
          ...filterVal,
          machines: {
            value: '',
            label: 'Machines',
          },
        });
        setFilterState({ ...filterState, machines: 0 });
        setFiltersApplied((prev) => prev - 1);
        break;
      case 'paymentMethod':
        setFilterVal({
          ...filterVal,
          paymentMethod: {
            value: '',
            label: 'Payment Method',
          },
        });
        setFilterState({ ...filterState, machines: 0 });
        setFiltersApplied((prev) => prev - 1);
        break;
      case 'startDate':
        setStartDate(null);
        setFilterState({ ...filterState, startDate: 0 });
        setFiltersApplied((prev) => prev - 1);
        break;
      case 'endDate':
        setEndDate(null);
        setFilterState({ ...filterState, endDate: 0 });
        setFiltersApplied((prev) => prev - 1);
        break;
      default:
        return;
    }
  };

  // apply filter function
  const handleApplyFilter = () => {
    fetchTotalTransaction();
  };

  // clear filter function
  const handleClearFilter = () => {
    fetchTotalTransaction();
    getMachineList();

    setFilterVal({
      transactionStatus: {
        value: '',
        label: 'Transaction Status',
      },
      machines: {
        value: '',
        label: 'Machines',
      },
      paymentMethod: {
        value: '',
        label: 'Payment Method',
      },
    });
    setStartDate(null);
    setEndDate(null);

    // reset filtersApplied to 0
    setFiltersApplied(0);

    // reset filterState
    setFilterState({
      transactionStatus: 0,
      machines: 0,
      paymentMethod: 0,
      startDate: 0,
      endDate: 0,
    });
  };

  const transactionColumns = [
    {
      headerName: 'Date & Time',
      field: 'createdTime',
      minWidth: 200,
      editable: false,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
    },
    {
      headerName: 'Transaction ID',
      field: 'txnId',
      minWidth: 110,
      editable: false,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
    },
    {
      headerName: 'Amount',
      field: 'amount',
      type: 'number',
      minWidth: 110,
      editable: false,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
    },
    {
      headerName: 'Order Code',
      field: 'externalRefNumber',
      type: 'number',
      minWidth: 110,
      editable: false,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
    },
    {
      headerName: 'Status',
      field: 'status',
      type: 'number',
      minWidth: 110,
      editable: false,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
      renderCell: (cellValues) => {
        return <div>{cellValues.value !== '' && <Status label={cellValues.value} />}</div>;
      },
    },
    {
      headerName: 'Payment Method',
      field: 'paymentMode',
      type: 'number',
      minWidth: 110,
      editable: false,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
    },
    {
      headerName: 'Card Brand',
      field: 'paymentCardBrand',
      type: 'number',
      minWidth: 110,
      editable: false,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
    },
    {
      headerName: 'Card Type',
      field: 'paymentCardType',
      type: 'number',
      minWidth: 110,
      editable: false,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
    },
    {
      headerName: 'Payer Name',
      field: 'payerName',
      type: 'number',
      minWidth: 110,
      editable: false,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
    },
  ];

  const getMachineList = async () => {
    const payload = {
      locId: locId,
      orgId: orgId,
    };
    try {
      const response = await getMachnineDetailsForTotalTransactions(payload);
      const result = response.data.data.data;
      // console.log('machinelist', result);
      const machineListData = result.map((item, index) => ({
        value: item.tid,
        label: item.machineName,
      }));
      // console.log('machinelist', machineListData);
      setMachineLists(machineListData);
    } catch (e) {
      console.log('errr', e);
    }
  };

  const convertEpochTimestampMsToLocalDate = (epochTimestampMs) => {
    const date = new Date(parseInt(epochTimestampMs));
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();

    const hours = date.getHours().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    // set the date month year in this form ex - 25 Jan, 2023
    const dateMonthYear = dateFormatter(`${year}-${month}-${day}`);

    // const formattedDate = `${day}-${month}-${year}   ${hours12}:${minutes}:${seconds} ${ampm}`;
    const formattedDate = `${dateMonthYear} ${hours12}:${minutes}:${seconds} ${ampm}`;
    // console.log('formattedDate', typeof formattedDate, formattedDate);
    return formattedDate;
  };

  const fetchTotalTransaction = async () => {
    const payload = {
      startDateEpoch: startDate == null ? null : Math.floor(new Date(startDate).getTime() / 1000),
      endDateEpoch: endDate == null ? null : Math.floor(new Date(endDate).getTime() / 1000),
      machineNumbers: filterVal.machines.value == '' ? [] : [filterVal.machines.value],
      pageNumber: pageState.page - 1,
      pageSize: pageState.pageSize,
      paymentMethod: filterVal.paymentMethod.value == '' ? [] : [filterVal.paymentMethod.value],
      status: filterVal.transactionStatus.value == '' ? [] : [filterVal.transactionStatus.value],
      locationId: locId,
    };

    // console.log('payloadFetchTotalTransaction', payload);
    try {
      setLoader(true);
      const response = await getTotalTransactionsPalletPay(payload);
      setErrorComing(false);
      // console.log('transactionResponse', response);
      let result = response.data.data.transactions;
      if (response.data.data.transactions.length > 0 && response.data.data.es == 0) {
        result = result.map((row) => ({
          createdTime: row.createdTime ? convertEpochTimestampMsToLocalDate(row.createdTime) : '',
          txnId: row?.txnId !== null ? row?.txnId : '',
          amount: row?.amount !== null ? row?.amount : '',
          externalRefNumber: row?.externalRefNumber !== null ? row?.externalRefNumber : '',
          paymentMode: row?.paymentMode !== null ? row?.paymentMode : '',
          paymentCardBrand: row?.paymentCardBrand !== null ? row?.paymentCardBrand : '',
          paymentCardType: row?.paymentCardType !== null ? row?.paymentCardType : '',
          payerName: row?.payerName !== null ? row?.payerName : '',
          status: row?.status !== null ? row?.status : '',
          id: row?.txnId !== null ? row?.txnId : '',
        }));
        setTransactionRows(result);
        // console.log('result', result);
        setPageState((old) => ({
          ...old,
          loader: false,
          datRows: result || [],
          total: response.data.data.totalCount,
        }));
      } else {
        setLoader(false);
        setErrorComing(true);
      }

      setLoader(false);
    } catch (e) {
      setLoader(false);
      setErrorComing(true);
    }
  };

  useEffect(() => {
    fetchTotalTransaction();
  }, [
    // filterVal,
    pageState.page,
    pageState.pageSize,
    // startDate,
    // endDate
  ]);

  useEffect(() => {
    getMachineList();
  }, []);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleRowDetails = async (rows) => {
    // console.log('rowData', rows);
    const txnId = rows.row.txnId;

    try {
      const response = await getTransactionDetailsWithTransactionId(txnId);
      const result = response.data.data.transaction;
      setTransactionIdDetails(result);
    } catch (err) {
      console.log('err', err);
    }

    toggleDrawer();
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    // setTransactionIdDetails(null);
  };

  const handleRowData = (data) => {
    // console.log('rowData', data);
    setIsDrawerOpen(true);
  };

  const handleTabsChange = (event, newValue) => {
    // console.log(event);
    // console.log(newValue);
    setTabValue(newValue);
  };

  // transaction select
  const transactionSelect = (
    <>
      <Box className="tansaction-status">
        <SoftSelect
          value={filterVal.transactionStatus}
          placeholder="Transaction Status"
          name="transactionStatus"
          options={[
            { value: 'AUTHORIZED', label: 'Authorized' },
            { value: 'EXPIRED', label: 'Expired' },
            { value: 'FAILED', label: 'Failed' },
            { value: 'PENDING', label: 'Pending' },
            { value: 'REVERSED', label: 'Reversed' },
            { value: 'SETTLED', label: 'Settled' },
            { value: 'SETTLEMENT_PENDING', label: 'Settlement Pending' },
            { value: 'SETTLEMENT_POSTED', label: 'Settlement Posted' },
          ]}
          onChange={(option, actionMeta) => handleFilter(option, actionMeta.name)}
          // menuPortalTarget={document.body}
        />
      </Box>
    </>
  );

  const machineListSelect = (
    <>
      <Box className="machine-list">
        <SoftSelect
          value={filterVal.machines}
          placeholder="Machines"
          name="machines"
          options={machineLists}
          onChange={(option, actionMeta) => handleFilter(option, actionMeta.name)}
          // menuPortalTarget={document.body}
        />
      </Box>
    </>
  );

  const paymentMethodSelect = (
    <>
      <Box className="payment-method">
        <SoftSelect
          value={filterVal.paymentMethod}
          placeholder="Payment Method"
          name="paymentMethod"
          options={[
            { value: 'CARD', label: 'Card' },
            // { value: 'CASH', label: 'CASH' },
            { value: 'UPI', label: 'Upi' },
          ]}
          onChange={(option, actionMeta) => handleFilter(option, actionMeta.name)}
          // menuPortalTarget={document.body}
        />
      </Box>
    </>
  );

  const startDateSelect = (
    <>
      {/* <SoftBox className="start-date"> */}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          views={['year', 'month', 'day']}
          className="date-labels"
          format="DD-MM-YYYY"
          label="Start Date"
          value={startDate ? dayjs(startDate) : null}
          onChange={(date) => {
            // handleStartDate(date.$d);
            handleStartDate(date);
          }}
          sx={{
            width: '100%',
            '& .MuiInputLabel-formControl': {
              fontSize: '0.8rem',
              top: '-0.4rem',
              color: '#344767',
            },
          }}
          // popperPlacement="right-end"
        />
      </LocalizationProvider>
      {/* </SoftBox> */}
    </>
  );

  const endDateSelect = (
    <>
      {/* <SoftBox className="end-date"> */}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          views={['year', 'month', 'day']}
          label="End Date"
          format="DD-MM-YYYY"
          className="date-labels"
          value={endDate ? dayjs(endDate) : null}
          onChange={(date) => {
            // handleEndDate(date.$d);
            handleEndDate(date);
          }}
          sx={{
            width: '100%',
            '& .MuiInputLabel-formControl': {
              fontSize: '0.8rem',
              top: '-0.4rem',
              color: '#344767',
            },
          }}
        />
      </LocalizationProvider>
      {/* </SoftBox> */}
    </>
  );

  // select boxes array
  const selectBoxArray = [transactionSelect, machineListSelect, paymentMethodSelect, startDateSelect, endDateSelect];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Box
        // className="table-css-fix-box-scroll-vend"
        className="search-bar-filter-and-table-container"
      >
        <SoftBox
          // className="header-bulk-price-edit all-products-filter-wrapper search-bar-filter-container"
          className="search-bar-filter-container"
        >
          <Box className="transaction-filters">
            <Grid container spacing={2} justifyContent={'space-between'}>
              <Grid item lg={5.5} md={5.5} sm={6} xs={12}>
                <Box className="all-products-filter-product">
                  <SoftInput
                    className="all-products-filter-soft-input-box"
                    placeholder="Search Transactions"
                    icon={{ component: 'search', direction: 'left' }}
                  />
                </Box>
              </Grid>
              <Grid item>
                <Filter
                  filtersApplied={filtersApplied}
                  filterChipBoxes={filterChipBoxes}
                  selectBoxArray={selectBoxArray}
                  handleApplyFilter={handleApplyFilter}
                  handleClearFilter={handleClearFilter}
                />
              </Grid>

              {/* <Grid item lg={2.4} md={4} sm={6} xs={12}>
              <Box className="search-input-transaction">
                <SoftInput placeholder="Search" icon={{ component: 'search', direction: 'left' }} />
              </Box>
            </Grid> */}
              {/* <Grid item>
                <Box className="clear-filter">
                  <SoftButton onClick={handleClearFilter} className="vendor-second-btn">
                    Clear
                  </SoftButton>
                </Box>
              </Grid> */}
            </Grid>
          </Box>
        </SoftBox>
        <Box
        // className="transaction-table"
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
                  columns={transactionColumns}
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
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
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
              Trasaction details
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
                    Transaction details
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
                    Consumer/Merchant details
                  </SoftBox>
                }
              />
              {/* <Tab
                label={
                  <SoftBox
                    py={0.5}
                    px={2}
                    sx={{
                      color: tabValue == 2 ? 'white !important' : null,
                    }}
                  >
                    Refund/Void
                  </SoftBox>
                }
              /> */}
            </Tabs>
          </Box>
        </Box>
        <Box className="tab-contents">
          {tabValue === 0 && transactionIdDetails !== null && (
            <TransactionDetails transactionIdDetails={transactionIdDetails} />
          )}
          {tabValue === 1 && transactionIdDetails !== null && (
            <MerchantDetails transactionIdDetails={transactionIdDetails} />
          )}
          {/* {tabValue === 2 && <Refund />} */}
        </Box>
      </Drawer>
    </DashboardLayout>
  );
};

export default TotalTransaction;
