import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CloudDownloadOutlinedIcon from '@mui/icons-material/CloudDownloadOutlined';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// main style file
import ArchiveIcon from '@mui/icons-material/Archive'; // theme css file
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import React, { useEffect, useState } from 'react';
import SoftBox from '../../../../components/SoftBox';
import SoftTypography from '../../../../components/SoftTypography';

import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import {
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Menu,
  MenuItem,
  Paper,
  Slide,
  Typography,
  createTheme,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { alpha } from '@material-ui/core';
import {
  cashierDetails,
  exportEditOrders,
  exportEndofDayReport,
  getAllPosTerminals,
  getSessionId,
  getSessionReports,
  paymentMethodsData,
  salesFilterApi,
  sendSessionReports,
} from '../../../../config/Services';
import { dateFormatter, textFormatter } from '../../Common/CommonFunction';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from '../../../../hooks/SnackbarProvider';
import DatepickerReport from './Datepickerreport';
import Filter from '../../Common/Filter';
import Grid from '@mui/material/Grid';
import MuiAlert from '@mui/material/Alert';
import NorthIcon from '@mui/icons-material/North';
import PieChart from '../../../../examples/Charts/PieChart';
import SendIcon from '@mui/icons-material/Send';
import Snackbar from '@mui/material/Snackbar';
import SoftButton from '../../../../components/SoftButton';
import SoftSelect from '../../../../components/SoftSelect';
import Stack from '@mui/material/Stack';
import Status from '../../Common/Status';
import clsx from 'clsx';
import moment from 'moment';
import styled from '@emotion/styled';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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
const PosReportchart = () => {
  const showSnackbar = useSnackbar();
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth().toString().padStart(2, '0');
  const currentDay = '01';
  const [fromdate, setFromdate] = useState(`${currentDay}-${currentMonth}-${currentYear}`);
  const [todate, setTodate] = useState();
  const [status, setStatus] = useState('ACCEPTED');
  const [retail, setRetail] = useState([]);
  const [warehousdata, setWarehouseData] = useState();
  const [Vmsdata, setVmsData] = useState();
  const [totalresult, setTotalResut] = useState();
  const [showFilter, setshowFilter] = useState(false);
  const [terminalOptions, setTerminalOptions] = useState();
  const [sessionOptions, setSessionOptions] = useState();
  const [cashierOptions, setCashierOptions] = useState();
  const [selectedTerminal, setSelectedTerminal] = useState({});
  const [selectedSessionId, setSelectedSessionId] = useState();
  const [selectedCashierId, setSelectedCashierId] = useState();
  const [dataRows, setTableRows] = useState([]);
  const user_details = localStorage.getItem('user_details');
  const [loader, setLoader] = useState(false);
  const [sendloader, setSendLoader] = useState(false);
  const uidx = JSON.parse(user_details).uidx;
  // pos session report data
  const [selectedFilters, setSelectedFilters] = useState({
    terminalName: '',
    cashierName: '',
    sessionId: '',
  });

  // console.log('st', selectedTerminal, 'sid', selectedSessionId, 'sci', selectedCashierId);
  const [pageState, setPageState] = useState({
    loader: false,
    datRows: [],
    total: 0,
    page: 1,
    pageSize: 8,
    // invoiceId:getOrderText,
  });
  const [open, setOpen] = useState(false);
  const [masteropen, setMasterOpen] = useState(false);
  const [reportData, setReportData] = useState([]);

  const handleMasterOpen = () => {
    setMasterOpen(true);
  };
  const navigate = useNavigate();

  const masterClose = () => {
    setMasterOpen(false);
  };
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const { reportId } = useParams();
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  user_name;
  const user_name = localStorage.getItem('user_name');

  // useEffect(() => {
  //   const currentDate = new Date();
  //   const year = currentDate.getFullYear();
  //   const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  //   const day = currentDate.getDate().toString().padStart(2, '0');
  //   const currDate = `${year}-${month}-${day}`;
  //   const previousDate = new Date(currentDate);
  //   previousDate.setDate(currentDate.getDate() - 7);
  //   const prevYear = previousDate.getFullYear();
  //   const prevMonth = (previousDate.getMonth() + 1).toString().padStart(2, '0');
  //   const prevDay = previousDate.getDate().toString().padStart(2, '0');
  //   const formattedPrevDate = `${prevYear}-${prevMonth}-${prevDay}`;
  //   const payload = {
  //     startDate: '2023-09-01',
  //     endDate: currDate,
  //     orgId: orgId,
  //     locationId: locId,
  //     terminalId: selectedTerminal?.value,
  //     loggedInUserId: selectedCashierId?.value,
  //     sessionId: selectedSessionId,
  //   };

  //   paymentMethodsData(payload)
  //     .then((res) => {
  //       if (res?.data?.data?.es === 0) {
  //         setReportData(res?.data?.data?.salesData);
  //       }
  //     })
  //     .catch((err) => {});
  // }, [selectedCashierId, selectedTerminal, selectedSessionId]);

  // this is same as above function written inside useeffect
  const getReport = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    const currDate = `${year}-${month}-${day}`;
    const previousDate = new Date(currentDate);
    previousDate.setDate(currentDate.getDate() - 7);
    const prevYear = previousDate.getFullYear();
    const prevMonth = (previousDate.getMonth() + 1).toString().padStart(2, '0');
    const prevDay = previousDate.getDate().toString().padStart(2, '0');
    const formattedPrevDate = `${prevYear}-${prevMonth}-${prevDay}`;
    const payload = {
      startDate: '2023-09-01',
      endDate: currDate,
      orgId: orgId,
      locationId: locId,
      terminalId: selectedTerminal?.value,
      loggedInUserId: selectedCashierId?.value,
      sessionId: selectedSessionId,
    };

    paymentMethodsData(payload)
      .then((res) => {
        if (res?.data?.data?.es === 0) {
          setReportData(res?.data?.data?.salesData);
        }
      })
      .catch((err) => {});
  };

  useEffect(() => {
    getReport();
  }, []);

  useEffect(() => {
    const payload = {
      orgId: orgId,
      locId: locId,
      featureName: 'NO_OF_POS_USERS',
    };
    getAllPosTerminals(payload)
      .then((res) => {
        const terminalData = res?.data?.data?.data?.responses;
        const convertedData = terminalData?.map((item) => ({
          value: item.licenseId,
          label: item.licenseName,
        }));
        setTerminalOptions(convertedData);
      })
      .catch((err) => {});
  }, [fromdate, todate]);

  useEffect(() => {
    const currentDate = new Date().toISOString().slice(0, 10);
    const sessionPayload = {
      locationId: locId,
    };
    const cashierPayload = {
      //   startDate: currentDate,
      //   endDate: currentDate,
      // terminalIds: [
      //   string
      // ],
      // sessionIds: [
      //   0
      // ],
      locationId: locId,
    };

    if (fromdate && todate) {
      sessionPayload.startDate = fromdate;
      sessionPayload.endDate = todate;
      cashierPayload.startDate = fromdate;
      cashierPayload.endDate = todate;
    } else {
      sessionPayload.startDate = currentDate;
      sessionPayload.endDate = currentDate;
      cashierPayload.startDate = currentDate;
      cashierPayload.endDate = currentDate;
    }
    getSessionId(sessionPayload)
      .then((res) => {
        const sessionData = res?.data?.sessions;
        const convertedSession = sessionData.map((item) => ({
          value: item.sessionId,
          label: item.sessionId.toString(),
        }));
        setSessionOptions(convertedSession);
      })
      .catch((err) => {});

    cashierDetails(cashierPayload)
      .then((res) => {
        const cashierData = res?.data?.userDtos;
        const convertedCashier = cashierData.map((item) => ({
          value: item.uidx,
          label: item.firstName.toString(),
        }));
        setCashierOptions(convertedCashier);
      })
      .catch((err) => {});
  }, [fromdate, todate]);

  const convertUTCDateToLocalDate = (dat) => {
    const date = moment.utc(dat).format('YYYY-MM-DD HH:mm:ss');
    const stillUtc = moment.utc(date).toDate();
    return moment(stillUtc).local().format('L, LT');
  };

  useEffect(() => {
    setPageState((old) => ({ ...old, loader: true }));
    const payload = {
      page: pageState.page - 1,
      pageSize: 10,
      locationId: locId,
      loggedInUserId: selectedCashierId?.value,
      terminalId: selectedTerminal?.value,
      sessionId: selectedSessionId,
    };
    salesFilterApi(payload)
      .then((responseTxt) => {
        let dataArr = [];

        dataArr = responseTxt?.data?.data?.orderResponseList;
        const dataRow = dataArr?.map((row) => ({
          date: row.baseOrderResponse.createdAt
            ? // convertUTCDateToLocalDate(row.baseOrderResponse.createdAt)
              dateFormatter(row.baseOrderResponse.createdAt)
            : '-----',
          order_id: row.baseOrderResponse.orderId ? row.baseOrderResponse.orderId : '-----',
          invoice_id: row.baseOrderResponse.invoiceId ? row.baseOrderResponse.invoiceId : '-----',
          customer_number_name:
            (row.baseOrderResponse.customerName && textFormatter(row.baseOrderResponse.customerName)) ||
            row.baseOrderResponse.mobileNumber ||
            '-----',
          items: row.baseOrderResponse.numberOfLineItems ? row.baseOrderResponse.numberOfLineItems : '-----',
          amount: row.orderBillingDetails.grandTotal ? `₹ ${row.orderBillingDetails.grandTotal}` : '-----',
          status: row.baseOrderResponse.orderStatus ? row.baseOrderResponse.orderStatus : '-----',
          paymentMethod: row.orderBillingDetails.paymentMethod,
        }));

        setTableRows(dataRow);
        setPageState((old) => ({
          ...old,
          loader: false,
          datRows: dataRow[0] || [],
          total: responseTxt?.data?.data?.totalResults || 0,
        }));
      })
      .catch((err) => {});
  }, [pageState.page]);

  const handlePageChange = (event, value) => {
    setPageState((old) => ({ ...old, page: value }));
  };

  const cashIcon =
    'https://static.vecteezy.com/system/resources/previews/005/567/661/original/rupee-icon-indian-currency-symbol-illustration-coin-symbol-free-vector.jpg';
  const cardIcon = 'https://pngimg.com/uploads/mastercard/mastercard_PNG24.png';
  const upiIcon = 'https://logodix.com/logo/1763598.png';

  const renderPaymentIcon = (paymentMethod) => {
    switch (paymentMethod) {
      case 'CASH':
        return cashIcon;
      case 'CARD':
        return cardIcon;
      case 'UPI':
        return upiIcon;
      default:
        return '';
    }
  };
  const columns = [
    {
      field: 'date',
      headerName: 'Date',
      minWidth: 120,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'order_id',
      headerName: 'Order Id',
      minWidth: 120,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'invoice_id',
      headerName: 'Invoice Id',
      minWidth: 120,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'customer_number_name',
      headerName: 'Customer Number/Name',
      minWidth: 150,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'items',
      headerName: 'Items',
      minWidth: 50,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'amount',
      headerName: 'Amount',
      minWidth: 120,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      renderCell: (params) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span>{params.value}</span>
          <img
            src={renderPaymentIcon(params.row.paymentMethod)}
            alt=""
            width="20px"
            height="20px"
            style={{ marginLeft: 8 }}
          />
        </div>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      minWidth: 150,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      cellClassName: (params) => {
        if (params.value == null) {
          return '';
        }
        return clsx('super-app', {
          Paid: params.value === 'PAID',
          Create: params.value === 'CREATED',
          Adjust: params.value === 'ADJUSTED',
          Pending: params.value === 'PAYMENT_PENDING',
          Cancel: params.value === 'CANCELLED',
          Payment_Cancel: params.value === 'PAYMENT_CANCELLED',
        });
      },
      renderCell: (cellValues) => {
        return <div>{cellValues.value !== '' && <Status label={cellValues.value} />}</div>;
      },
    },
  ];

  const handleLookerstudio = () => {
    // will integrate pdf api
    handleSessionExport();
  };

  const handleSessionExport = () => {
    // if isApplied === true and selectedSessionId has some value
    if (selectedSessionId && isApplied) {
      getSessionReports(selectedSessionId)
        .then((res) => {
          setLoader(false);

          if (res?.data?.data?.url) {
            window.open(res?.data?.data?.url, '_self');
          }
        })
        .catch((error) => {
          setLoader(false);

          showSnackbar(error?.response?.data?.message, 'error');
        });
    } else {
      showSnackbar('Select SessionId for downloading Reports', 'error');
      setLoader(false);
    }
  };

  const onSendReport = () => {
    setSendLoader(true);
    const payload = {
      orgId: orgId,
      locationId: locId,
      sessionId: selectedSessionId,
      uidx: selectedCashierId?.value,
      reportType: 'SESSION_CLOSING_REPORT',
      terminals: [
        {
          terminalName: selectedTerminal?.label,
          terminalId: selectedTerminal?.value,
        },
      ],
    };
    const eodPayload = {
      orgId: orgId,
      startDate: fromdate,
      endDate: todate,
      locationId: locId,
      uidx: uidx,
      reportType: 'DAY_CLOSING_REPORT',
      terminals: terminalOptions?.map((item) => ({
        terminalId: item.value,
        terminalName: item.label,
      })),
    };
    sendSessionReports(reportId === 'End of Day' ? eodPayload : payload)
      .then((res) => {
        if (res?.data?.data?.message === 'Success') {
          setOpen(true);
        }
        setSendLoader(false);
      })
      .catch((err) => {
        setSendLoader(false);
      });
  };
  const onPrint = () => {
    window.print();
  };

  const HandleExport = async () => {
    const payload = {
      pageSize: totalresult,
      pageNo: 0,
      locationId: locId,
      startDate: fromdate,
      endDate: todate,
      exportType: 'pdf',
      generatedBy: user_name,
    };

    // try {
    //   const response = await inventoryExport(payload);
    //   const newblob = await response.blob();
    //   const link = document.createElement('a');
    //   link.href = URL.createObjectURL(newblob);
    //   link.download = `Inventory_Adjustment.pdf`;
    //   document.body.appendChild(link);
    //   link.click();
    //   link.remove();
    // } catch (err) {
    // }
  };

  const handleEodReport = (exportType) => {
    const payload = {
      orgId: orgId,
      startDate: fromdate,
      endDate: todate,
      locationId: locId,
      uidx: uidx,
      reportType: 'DAY_CLOSING_REPORT',
      orderType: 'POS_ORDER',
      terminals: terminalOptions?.map((item) => ({
        terminalId: item.value,
        terminalName: item.label,
      })),
      exportType: 'pdf',
    };
    if (!fromdate) {
      showSnackbar('Select Start/End Date for Eod Report', 'error');
      setLoader(false);
    }
    if (fromdate) {
      exportEndofDayReport(payload)
        .then((res) => {
          setLoader(false);
          const url = res?.data?.data?.url;
          if (url) {
            window.open(res?.data?.data?.url, '_self');
          } else {
            showSnackbar('Something went wrong. Please try again', 'error');
            // throw new Error("Something went wrong")
          }
        })
        .catch((error) => {
          setLoader(false);
          showSnackbar(error?.response?.data?.message, 'error');
        });
    }
  };
  const onExport = (event) => {
    setLoader(true);
    // HandleExport();
    if (reportId === 'End of Day') {
      handleEodReport(event);
    } else if (reportId === 'Session') {
      handleSessionExport();
    } else if (reportId === 'Adjusted Orders') {
      handleExportAdjustedOrders();
    }
  };

  const handleExportAdjustedOrders = async () => {
    const payload = {
      startDate: fromdate,
      endDate: todate,
      locationId: locId,
    };

    try {
      setLoader(false);

      const response = await exportEditOrders(payload);
      const newblob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(newblob);
      link.download = 'AdjustedOrders.pdf';
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setLoader(false);
    }
  };

  const onSave = () => {
    window.print();
  };

  const transformedOptions = retail?.map((retail) => ({
    value: retail?.branches?.map((branch) => branch.displayName),
    label: retail?.branches.map((branch) => branch.displayName),
  }));

  const denominationsData = [
    { id: 1, denomination: '500', count: 9, total: 500 * 9 },
    { id: 2, denomination: '200', count: 3, total: 200 * 3 },
    { id: 3, denomination: '100', count: 4, total: 100 * 4 },
    { id: 4, denomination: '50', count: 5, total: 50 * 5 },
    { id: 5, denomination: '20', count: 73, total: 20 * 73 },
    { id: 6, denomination: '10', count: 4, total: 10 * 4 },
    { id: 7, denomination: '5', count: 7, total: 5 * 7 },
    { id: 8, denomination: '2', count: 20, total: 2 * 20 },
    { id: 9, denomination: '1', count: 1, total: 1 * 1 },
  ];
  const salesTrend = () => {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const result = [];
    for (let i = 5; i >= 0; i--) {
      const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthName = months[targetDate.getMonth()];
      const monthNumber = targetDate.getMonth() + 1;
      result.push({
        name: monthName,
        month: monthNumber,
      });
      setLastSixMonths(result);
    }
    const payload = {
      startDate: startDate,
      endDate: endDate,
      months: currMonth,
      orgId: orgId,
      locationId: locId,
      gtin: id,
    };
    productsSalesTrend(payload)
      .then((res) => {
        const matchedSales = [];
        const matchedSalesValue = [];
        result.map((item, index) => {
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
  };

  // filters for pos report

  const terminalSelect = (
    <SoftSelect
      id="vendors"
      placeholder="Select Terminal"
      // value={selectedTerminal}
      // menuPortalTarget={document.body}
      options={terminalOptions}
      onChange={(e) => setSelectedTerminal(e)}
      //   isMulti={true}
    ></SoftSelect>
  );

  const sessionSelect = (
    <>
      {reportId !== 'Terminal' && (
        <SoftSelect
          id="items"
          placeholder="Select Session"
          // menuPortalTarget={document.body}
          options={sessionOptions}
          onChange={(e) => setSelectedSessionId(e.value)}
        ></SoftSelect>
      )}
    </>
  );

  const cashierSelect = (
    <SoftSelect
      placeholder="Select Cashier"
      onChange={(e) => setSelectedCashierId(e)}
      options={cashierOptions}
      // menuPortalTarget={document.body}
      id="status"
      // options={[
      //   { value: 'ACCEPTED', label: 'Accepted' },
      //   { value: 'REJECTED', label: 'Rejected' },
      // ]}
    ></SoftSelect>
  );

  // selectBoxArray
  const selectBoxArray =
    reportId !== 'Terminal' ? [terminalSelect, sessionSelect, cashierSelect] : [terminalSelect, cashierSelect];

  // filterchipboxes
  const filterChipBoxes = (
    <>
      {/* terminal  */}
      {selectedTerminal?.label && (
        <Box
          sx={{
            position: 'relative',
            padding: '15px 10px 10px !important',
            border: '1px solid gainsboro',
            borderRadius: '0.5rem',
          }}
        >
          <Typography
            style={{
              position: 'absolute',
              top: '2px',
              left: '10px',
              fontSize: '10px',
              fontWeight: 'bold',
            }}
          >
            Terminal
          </Typography>
          <Box
            sx={{
              marginTop: '5px',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <Chip
              label={selectedTerminal.label}
              onDelete={() => removeSelectedFilter('terminal')}
              deleteIcon={<CancelOutlinedIcon />}
              color="primary"
              variant="outlined"
            />
          </Box>
        </Box>
      )}

      {/* session  */}
      {selectedSessionId && (
        <Box
          sx={{
            position: 'relative',
            padding: '15px 10px 10px !important',
            border: '1px solid gainsboro',
            borderRadius: '0.5rem',
          }}
        >
          <Typography
            style={{
              position: 'absolute',
              top: '2px',
              left: '10px',
              fontSize: '10px',
              fontWeight: 'bold',
            }}
          >
            Session
          </Typography>
          <Box
            sx={{
              marginTop: '5px',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <Chip
              label={selectedSessionId}
              onDelete={() => removeSelectedFilter('session')}
              deleteIcon={<CancelOutlinedIcon />}
              color="primary"
              variant="outlined"
            />
          </Box>
        </Box>
      )}

      {/* cashier  */}
      {selectedCashierId?.label && (
        <Box
          sx={{
            position: 'relative',
            padding: '15px 10px 10px !important',
            border: '1px solid gainsboro',
            borderRadius: '0.5rem',
          }}
        >
          <Typography
            style={{
              position: 'absolute',
              top: '2px',
              left: '10px',
              fontSize: '10px',
              fontWeight: 'bold',
            }}
          >
            Cashier
          </Typography>
          <Box
            sx={{
              marginTop: '5px',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <Chip
              label={selectedCashierId.label}
              onDelete={() => removeSelectedFilter('cashier')}
              deleteIcon={<CancelOutlinedIcon />}
              color="primary"
              variant="outlined"
            />
          </Box>
        </Box>
      )}
    </>
  );

  // filter modal states
  const [modalStatus, setModalStatus] = useState(false);
  const [filtersApplied, setFiltersApplied] = useState(0);
  const [filterState, setFilterState] = useState({
    terminal: 0,
    session: 0,
    cashier: 0,
  });

  // end of filter modal states

  // overriding primary color of mui for filter box current selected filter
  const chipTextTheme = createTheme({
    palette: {
      primary: {
        main: '#0562FB',
        // light: will be calculated from palette.primary.main,
        // dark: will be calculated from palette.primary.main,
        // contrastText: will be calculated to contrast with palette.primary.main
      },
    },
  });

  const handleClick = (event) => {
    setAnchorElExport(event.currentTarget);
  };
  const [anchorElExport, setAnchorElExport] = useState(null);
  const openExport = Boolean(anchorElExport);

  // filter box
  const [anchorEl, setAnchorEl] = useState(null);

  const open3 = Boolean(anchorEl);
  const handleClickFilter = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseFilter = () => {
    setAnchorEl(null);
  };
  // end of filter box

  // apply filter function
  const applyPosFilter = () => {
    const payload = {
      page: pageState.page - 1,
      pageSize: 10,
      locationId: locId,
      loggedInUserId: selectedCashierId?.value,
      terminalId: selectedTerminal?.value,
      sessionId: selectedSessionId,
    };
    salesFilterApi(payload)
      .then((responseTxt) => {
        let dataArr = [];

        dataArr = responseTxt?.data?.data?.orderResponseList;
        const dataRow = dataArr?.map((row) => ({
          date: row.baseOrderResponse.createdAt
            ? // convertUTCDateToLocalDate(row.baseOrderResponse.createdAt)
              dateFormatter(row.baseOrderResponse.createdAt)
            : '-----',
          order_id: row.baseOrderResponse.orderId ? row.baseOrderResponse.orderId : '-----',
          invoice_id: row.baseOrderResponse.invoiceId ? row.baseOrderResponse.invoiceId : '-----',
          customer_number_name:
            (row.baseOrderResponse.customerName && textFormatter(row.baseOrderResponse.customerName)) ||
            row.baseOrderResponse.mobileNumber ||
            '-----',
          items: row.baseOrderResponse.numberOfLineItems ? row.baseOrderResponse.numberOfLineItems : '-----',
          amount: row.orderBillingDetails.grandTotal ? `₹ ${row.orderBillingDetails.grandTotal}` : '-----',
          status: row.baseOrderResponse.orderStatus ? row.baseOrderResponse.orderStatus : '-----',
          paymentMethod: row.orderBillingDetails.paymentMethod,
        }));

        setTableRows(dataRow);
        setPageState((old) => ({
          ...old,
          loader: false,
          datRows: dataRow[0] || [],
          total: responseTxt?.data?.data?.totalResults || 0,
        }));
      })
      .catch((err) => {});

    setSelectedFilters({
      terminalName: selectedTerminal?.label,
      cashierName: selectedCashierId?.label,
      sessionId: selectedSessionId ? selectedSessionId : '',
    });

    // set setIsApplied to true
    setIsApplied(true);

    // run getReport function
    getReport();

    // close filter modal box after 300ms
    setTimeout(() => {
      handleCloseFilter();
    }, 300);
  };

  // remove selected filter function
  const removeSelectedFilter = (filterType) => {
    switch (filterType) {
      case 'terminal':
        setFiltersApplied((prev) => prev - 1);
        setSelectedTerminal({});
        setFilterState({ ...filterState, terminal: 0 });
        break;
      case 'session':
        setFiltersApplied((prev) => prev - 1);
        setSelectedSessionId();
        setFilterState({ ...filterState, session: 0 });
        break;
      case 'cashier':
        setFiltersApplied((prev) => prev - 1);
        setSelectedCashierId();
        setFilterState({ ...filterState, cashier: 0 });
        break;
      default:
        return;
    }
  };

  // state to check wheather clear in filter box is clicked or not
  const [isClear, setIsClear] = useState(false);
  // state to check wheather apply is clicked or not
  const [isApplied, setIsApplied] = useState(false);

  // to clear the filter
  const handleClear = () => {
    setSelectedTerminal({});
    setSelectedSessionId();
    setSelectedCashierId();

    // reset the filterState
    setFilterState({ terminal: 0, session: 0, cashier: 0 });
    // reset filters applied to 0
    setFiltersApplied(0);
    // set setIsClear to true
    setIsClear(true);
  };

  // run this useeffect when clear is clicked in filter and setIsClear set to true
  useEffect(() => {
    if (isClear) {
      applyPosFilter();
      getReport();
      setIsClear(false);
    }
  }, [isClear]);

  // to keep track of filters applied to display in filter tooltip
  useEffect(() => {
    if (selectedTerminal?.label) {
      if (filterState['terminal'] === 0) {
        setFiltersApplied((prev) => prev + 1);
        setFilterState({ ...filterState, terminal: 1 });
      }
    } else {
      if (filterState['terminal'] !== 0) {
        setFiltersApplied((prev) => prev - 1);
        setFilterState({ ...filterState, terminal: 0 });
      }
    }

    if (selectedSessionId) {
      if (filterState['session'] === 0) {
        setFiltersApplied((prev) => prev + 1);
        setFilterState({ ...filterState, session: 1 });
      }
    } else {
      if (filterState['session'] !== 0) {
        setFiltersApplied((prev) => prev - 1);
        setFilterState({ ...filterState, session: 0 });
      }
    }

    if (selectedCashierId?.label) {
      if (filterState['cashier'] === 0) {
        setFiltersApplied((prev) => prev + 1);
        setFilterState({ ...filterState, cashier: 1 });
      }
    } else {
      if (filterState['cashier'] !== 0) {
        setFiltersApplied((prev) => prev - 1);
        setFilterState({ ...filterState, cashier: 0 });
      }
    }
  }, [selectedTerminal, selectedSessionId, selectedCashierId]);

  // if filtersApplied === 0, set isApplied to false
  useEffect(() => {
    if (filtersApplied === 0) {
      setIsApplied(false);
    }
  }, [filtersApplied]);

  const handleCloseExport = () => {
    setAnchorElExport(null);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar prevLink={true} />
      <Stack spacing={2} sx={{ width: '100%' }}>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
            Report sent successful
          </Alert>
        </Snackbar>
      </Stack>
      <Dialog
        open={masteropen}
        TransitionComponent={Transition}
        keepMounted
        onClose={masterClose}
        aria-describedby="alert-dialog-slide-description"
        PaperProps={{ style: { overflowY: 'visible' } }}
        sx={{
          '& .MuiDialog-container': {
            '& .MuiPaper-root': {
              width: '100%',
              maxWidth: '450px',
              minHeight: '250px',
            },
          },
        }}
      >
        <DialogTitle style={{ fontsize: '0.9rem !important' }}>
          {' '}
          <SoftTypography style={{ fontsize: '0.9rem !important' }}> Denominations </SoftTypography>{' '}
        </DialogTitle>
        <DialogContent
          sx={{
            zIndex: 100,
          }}
        >
          <div style={{ height: 525, width: '100%' }}>
            <DataGrid
              rows={denominationsData}
              columns={[
                {
                  field: 'denomination',
                  headerName: 'Denomination',
                  width: 120,
                  headerClassName: 'datagrid-columns',
                  headerAlign: 'left',
                  align: 'left',
                  cellClassName: 'datagrid-rows',
                },
                {
                  field: 'count',
                  headerName: 'Count',
                  width: 120,
                  headerClassName: 'datagrid-columns',
                  headerAlign: 'left',
                  flex: 1,
                  align: 'left',
                  cellClassName: 'datagrid-rows',
                },
                {
                  field: 'total',
                  headerName: 'Total',
                  width: 120,
                  headerClassName: 'datagrid-columns',
                  headerAlign: 'left',
                  flex: 1,
                  align: 'left',
                  cellClassName: 'datagrid-rows',
                },
              ]}
              rowsPerPageOptions={[0]}
              hideFooter
            />
          </div>
        </DialogContent>
        <DialogActions style={{ zIndex: 70 }}>
          <Button onClick={masterClose}>Close</Button>
        </DialogActions>
      </Dialog>
      <Container fixed sx={{ paddingLeft: '0 !important', paddingRight: '0 !important', paddingBottom: '15px' }}>
        <Box
          className="search-bar-filter-and-table-container"
          // sx={{ bgcolor: '#fff', borderRadius: '10px', boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)' }}
        >
          <SoftBox
            className="search-bar-filter-container"
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <SoftTypography sx={{ color: 'white !important', fontSize: '16px' }}>POS {reportId} Report</SoftTypography>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                {/* <DatePicker /> */}
                <DatepickerReport setFromdate={setFromdate} setTodate={setTodate} />
              </LocalizationProvider>

              {/* filter box  */}
              {reportId !== 'End of Day' && (
                <Filter
                  selectBoxArray={selectBoxArray}
                  filtersApplied={filtersApplied}
                  filterChipBoxes={filterChipBoxes}
                  handleApplyFilter={applyPosFilter}
                  handleClearFilter={handleClear}
                />
              )}

              {/* end of filter box  */}
            </Box>
          </SoftBox>

          <Box sx={{ padding: '20px' }}>
            <SoftBox style={{ display: 'flex', gap: '15px' }}>
              {/* <SoftBox style={{ display: 'flex' }} onClick={onPrint}>
              <img src="https://i.ibb.co/51ss8qP/print.jpg" alt="" style={{ width: '17px', height: '17px' }} />
              <SoftTypography style={{ fontSize: '0.85rem', marginInline: '10px' }}>Print</SoftTypography>
            </SoftBox> */}

              {/* <SoftBox style={{ display: 'flex' }} onClick={onExport}>
              <img
                src="https://i.ibb.co/ssTSJ9x/move-layer-down.jpg"
                alt=""
                style={{ width: '17px', height: '17px' }}
              />
              <SoftTypography style={{ fontSize: '0.85rem', marginInline: '10px' }}>Export</SoftTypography>
            </SoftBox> */}

              <SoftBox style={{ marginBottom: '10px', display: 'flex', gap: '20px' }}>
                <SoftBox style={{ display: 'flex', gap: '15px', padding: '15px' }}>
                  <div>
                    {loader ? (
                      <SoftButton color="info">
                        <CircularProgress className="circular-progress-dashboard" />
                      </SoftButton>
                    ) : (
                      <SoftButton color="info" onClick={onExport}>
                        <CloudDownloadOutlinedIcon style={{ marginRight: '10px' }} />
                        Export
                      </SoftButton>
                    )}
                  </div>
                  {sendloader ? (
                    <SoftButton color="info">
                      <CircularProgress className="circular-progress-dashboard" />
                    </SoftButton>
                  ) : (
                    <SoftButton color="info" onClick={onSendReport} style={{ height: '40px' }}>
                      {' '}
                      <SendIcon style={{ marginRight: '10px' }} />
                      Send Reports
                    </SoftButton>
                  )}
                </SoftBox>
              </SoftBox>

              {/* <SoftBox style={{ display: 'flex' }} onClick={onSave}>
              <img
                src="https://i.ibb.co/kmb9hcn/save-for-later.jpg"
                alt=""
                style={{ width: '17px', height: '17px' }}
              />
              <SoftTypography style={{ fontSize: '0.85rem', marginInline: '10px' }}>Save as</SoftTypography>
            </SoftBox> */}
            </SoftBox>
            <Grid container spacing={3} style={{ marginTop: '15px' }}>
              <Grid item xs={12} lg={5} style={{ display: 'flex', alignItems: 'center' }}>
                <PieChart
                  title=""
                  height="250px"
                  chart={{
                    labels: ['No Data Available'],
                    datasets: {
                      label: 'Projects',
                      backgroundColors: ['secondary', 'primary', 'dark', 'info', 'primary'],
                      data: [1],
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} lg={7}>
                <Grid container spacing={2}>
                  <br />
                  {reportId === 'Terminal' && (
                    <>
                      <Grid item xs={12} lg={6}>
                        <SoftTypography style={{ fontSize: '0.92rem' }}>Date : {'NA'}</SoftTypography>
                      </Grid>
                      <Grid item xs={12} lg={6}>
                        <SoftTypography style={{ fontSize: '0.92rem' }}>
                          Terminal Name : {selectedFilters?.terminalName}
                        </SoftTypography>
                      </Grid>

                      <Grid item xs={12} lg={6}>
                        <SoftTypography style={{ fontSize: '0.92rem' }}>Total Order Processed : {'NA'}</SoftTypography>
                      </Grid>
                      <Grid item xs={12} lg={6}>
                        <SoftTypography style={{ fontSize: '0.92rem' }}></SoftTypography>
                      </Grid>
                    </>
                  )}

                  {reportId === 'Session' && (
                    <>
                      <Grid item xs={12} lg={6}>
                        <SoftTypography style={{ fontSize: '0.92rem' }}>
                          Date :{/* {new Date().toISOString().slice(0, 10)} */}
                          {dateFormatter(new Date().toISOString().slice(0, 10))}
                        </SoftTypography>
                      </Grid>
                      <Grid item xs={12} lg={6}>
                        <SoftTypography style={{ fontSize: '0.92rem' }}>
                          Terminal Name : {selectedFilters?.terminalName}
                        </SoftTypography>
                      </Grid>

                      <Grid item xs={12} lg={6}>
                        <SoftTypography style={{ fontSize: '0.92rem' }}>Opening Time : {'NA'} </SoftTypography>
                      </Grid>
                      <Grid item xs={12} lg={6}>
                        <SoftTypography style={{ fontSize: '0.92rem' }}>Closing Time : {'NA'} </SoftTypography>
                      </Grid>
                      <Grid item xs={12} lg={6}>
                        <SoftTypography style={{ fontSize: '0.92rem' }}>
                          Cashier Name : {selectedFilters?.cashierName || 'NA'}
                        </SoftTypography>
                      </Grid>
                      <Grid item xs={12} lg={6}>
                        <SoftTypography style={{ fontSize: '0.92rem' }}>Opening Amount : {'NA'}</SoftTypography>
                      </Grid>
                      <Grid item xs={12} lg={6}>
                        <SoftTypography style={{ fontSize: '0.92rem' }}>Total Counter Cash : {'NA'}</SoftTypography>
                      </Grid>
                      <Grid item xs={12} lg={6}>
                        <SoftTypography style={{ fontSize: '0.92rem' }}>
                          Session Id : {selectedSessionId || 'NA'}
                        </SoftTypography>
                      </Grid>
                    </>
                  )}

                  <Grid item xs={12} lg={6}>
                    <Paper
                      onClick={handleMasterOpen}
                      elevation={2}
                      sx={{ backgroundColor: 'white', padding: '15px', borderRadius: '5px', textAlign: 'center' }}
                    >
                      <div style={{ color: '#575859', fontWeight: 'bold', fontSize: '14px' }}>Cash Sales</div>
                      <div style={{ color: '#4f81bd', fontWeight: 'bold', fontSize: '16px' }}>
                        {reportData?.cashOrdersValue}
                      </div>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} lg={6}>
                    <Paper
                      elevation={2}
                      sx={{ backgroundColor: 'white', padding: '15px', borderRadius: '5px', textAlign: 'center' }}
                    >
                      <div style={{ color: '#575859', fontWeight: 'bold', fontSize: '14px' }}>Upi Sales</div>
                      <div style={{ color: '#4f81bd', fontWeight: 'bold', fontSize: '16px' }}>
                        {reportData?.upiOrdersValue}
                      </div>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} lg={6}>
                    <Paper
                      elevation={2}
                      sx={{ backgroundColor: 'white', padding: '15px', borderRadius: '5px', textAlign: 'center' }}
                    >
                      <div style={{ color: '#575859', fontWeight: 'bold', fontSize: '14px' }}>Card Sales</div>
                      <div style={{ color: '#4f81bd', fontWeight: 'bold', fontSize: '16px' }}>
                        {reportData?.cardOrdersValue}
                      </div>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} lg={6}>
                    <Paper
                      elevation={2}
                      sx={{ backgroundColor: 'white', padding: '15px', borderRadius: '5px', textAlign: 'center' }}
                    >
                      <div style={{ color: '#575859', fontWeight: 'bold', fontSize: '14px' }}>Cash Refund</div>
                      <div style={{ color: '#4f81bd', fontWeight: 'bold', fontSize: '16px' }}>
                        {reportData?.cashRefunds}
                      </div>
                    </Paper>
                  </Grid>
                  <Grid item xs={12}>
                    <Paper
                      elevation={2}
                      sx={{ backgroundColor: 'white', padding: '15px', borderRadius: '5px', textAlign: 'center' }}
                    >
                      <div style={{ color: '#575859', fontWeight: 'bold', fontSize: '14px' }}>Total Sales Amount</div>
                      <div style={{ color: '#4f81bd', fontWeight: 'bold', fontSize: '16px', marginLeft: '25px' }}>
                        {reportData?.actualOrderValue}{' '}
                        <span style={{ color: 'Green', fontSize: '16px' }}>
                          (+12%) <NorthIcon fontSize="16px" style={{ color: 'Green' }} />
                        </span>
                      </div>
                    </Paper>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <br />
            <Divider sx={{ margin: 0 }} />
            {showFilter && (
              <motion.div
                initial={{ opacity: 0, y: 0, x: 300 }}
                //   whileInView={{ opacity: 1, y: 0, x: 0 }}
                animate={{ y: 0, opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                style={{ display: 'flex', flexDirection: 'row', gap: '15px', overflow: 'auto', flexWrap: 'wrap' }}
              >
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <SoftTypography htmlFor="vendors" style={{ fontSize: '0.8rem' }}>
                    Terminal
                  </SoftTypography>
                  <SoftSelect
                    id="vendors"
                    menuPortalTarget={document.body}
                    options={terminalOptions}
                    onChange={(e) => setSelectedTerminal(e)}
                    //   isMulti={true}
                  ></SoftSelect>
                </div>
                {reportId !== 'Terminal' && (
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <SoftTypography htmlFor="items" style={{ fontSize: '0.8rem' }}>
                      Session
                    </SoftTypography>
                    <SoftSelect
                      id="items"
                      menuPortalTarget={document.body}
                      options={sessionOptions}
                      onChange={(e) => setSelectedSessionId(e.value)}
                    ></SoftSelect>
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <SoftTypography htmlFor="status" style={{ fontSize: '0.8rem' }}>
                    Cashier
                  </SoftTypography>
                  <SoftSelect
                    onChange={(e) => setSelectedCashierId(e)}
                    options={cashierOptions}
                    menuPortalTarget={document.body}
                    id="status"
                    // options={[
                    //   { value: 'ACCEPTED', label: 'Accepted' },
                    //   { value: 'REJECTED', label: 'Rejected' },
                    // ]}
                  ></SoftSelect>
                </div>
                {/* <div style={{ display: 'flex', flexDirection: 'column' }}>
           <SoftTypography htmlFor="location" style={{ fontSize: '0.8rem' }}>
             Sales
           </SoftTypography>
           <SoftSelect
             menuPortalTarget={document.body}
             id="location"
             // options={transformedOptions}
           ></SoftSelect>
         </div> */}
              </motion.div>
            )}

            {/* <SoftBox>
              <DataGrid
                rows={dataRows}
                columns={columns}
                getRowId={(row) => row.order_id}
                rowCount={parseInt(pageState.total)}
                loading={pageState.loader}
                pagination
                page={pageState.page - 1}
                pageSize={pageState.pageSize}
                paginationMode="server"
                onPageChange={(newPage) => {
                  setPageState((old) => ({ ...old, page: newPage + 1 }));
                }}
                hideScrollbar={true}
                disableSelectionOnClick
                autoHeight={true}
                sx={{
                  '& .super-app.Paid': {
                    color: '#69E86D',
                    fontSize: '1em',
                    fontWeight: '600',
                    margin: '0px auto 0px auto',
                    padding: '5px',
                  },
                  '& .super-app.Create': {
                    color: 'blue',
                    fontSize: '1em',
                    fontWeight: '600',
                    margin: '0px auto 0px auto',
                    padding: '5px',
                  },
                  '& .super-app.Adjust': {
                    color: 'darkred',
                    fontSize: '1em',
                    fontWeight: '600',
                    margin: '0px auto 0px auto',
                    padding: '5px',
                  },
                  '& .super-app.Pending': {
                    color: 'orange',
                    fontSize: '1em',
                    fontWeight: '600',
                    margin: '0px auto 0px auto',
                    padding: '5px',
                  },
                  '& .super-app.Cancel': {
                    color: 'red',
                    fontSize: '1em',
                    fontWeight: '600',
                    margin: '0px auto 0px auto',
                    padding: '5px',
                  },
                  '& .super-app.Payment_Cancel': {
                    color: 'red',
                    fontSize: '.75em',
                    fontWeight: '900',
                    margin: '0px auto 0px auto',
                    padding: '5px',
                  },
                }}
              />
            </SoftBox> */}
          </Box>
        </Box>
      </Container>
    </DashboardLayout>
  );
};

export default PosReportchart;
