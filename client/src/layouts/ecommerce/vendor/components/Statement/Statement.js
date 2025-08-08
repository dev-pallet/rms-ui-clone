import FileDownloadIcon from '@mui/icons-material/FileDownload';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import SoftBox from 'components/SoftBox';
import SoftButton from 'components/SoftButton';
import SoftTypography from 'components/SoftTypography';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BeatLoader from 'react-spinners/BeatLoader';
import { vendorStatement, vendorStatementPdf } from '../../../../../config/Services';
import './Statement.css';

import CategoryIcon from '@mui/icons-material/Category';
import { Card } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import * as React from 'react';
import { dataGridStyles } from '../../../Common/NewDataGridStyle';

export const Statement = () => {
  const { vendorId } = useParams();

  const locId = localStorage.getItem('locId');
  const orgId = localStorage.getItem('orgId');
  const orgType = localStorage.getItem('contextType');

  const [opensnack, setOpensnack] = useState(false);
  const [timelinerror, setTimelineerror] = useState('');
  const [alertmessage, setAlertmessage] = useState('');

  const handleopensnack = () => {
    setOpensnack(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpensnack(false);
  };

  //snackbar
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [statementData, setStatementData] = useState([]);
  const [balance, setBalance] = useState('');
  const [notFound, setNotFound] = useState(false);
  const [exportLoader, setExportLoader] = useState(false);

  const fetchInitialStatement = async () => {
    const payload = {
      vendorId: vendorId,
      orgId: orgId,
      orgLocId: locId,
      orgType: orgType,
      dateLimit: false,
    };
    try {
      const response = await vendorStatement(payload);
      const tableData = response.data.data.transactionList;
      setBalance(response.data.data.balance);
      if (tableData.length) {
        const statementTableData = tableData.map((row) => ({
          refId: row.refId,
          date: row.date,
          poNumber: row.poNumber,
          description: row.description,
          credit: row.credit,
          debit: row.debit,
        }));
        setStatementData(statementTableData);
      } else {
        setStatementData([]);
        setNotFound(true);
      }
    } catch (err) {}
  };

  const fetchStatement = async () => {
    const payload = {
      vendorId: vendorId,
      from: startDate,
      to: endDate,
      dateLimit: true,
    };

    try {
      const response = await vendorStatement(payload);
      const tableData = response.data.data.transactionList;
      setBalance(response.data.data.balance);
      if (tableData.length) {
        const statementTableData = tableData.map((row) => ({
          refId: row.refId,
          date: row.date,
          poNumber: row.poNumber,
          description: row.description,
          credit: row.credit,
          debit: row.debit,
        }));
        setStatementData(statementTableData);
      } else {
        setStatementData([]);
        setNotFound(true);
      }
    } catch (err) {}
  };

  useEffect(() => {
    fetchInitialStatement();
  }, []);

  useEffect(() => {
    if (startDate !== null && endDate !== null) {
      fetchStatement();
    }
  }, [startDate, endDate]);

  const columns = [
    {
      field: 'date',
      headerName: 'Date',
      minWidth: 200,
      flex: 1,
      headerAlign: 'left',
      align: 'left',
      headerClassName: 'datagrid-columns',
      cellClassName: 'datagrid-rows',
    },
    // {
    //   field: 'poNumber',
    //   headerName: 'PO',
    //   headerClassName: 'datagrid-columns',
    //   headerAlign: 'left',
    //   cellClassName: 'datagrid-rows',
    //   align: 'left',
    //   width: 205,
    // },

    {
      field: 'description',
      headerName: 'Description',
      width: 250,
      headerAlign: 'left',
      align: 'left',
      headerClassName: 'datagrid-columns',
      cellClassName: 'datagrid-rows',
      flex: 1,
    },

    {
      field: 'credit',
      headerName: 'Credit',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 150,
      flex: 1,
    },
    {
      field: 'debit',
      headerName: 'Debit',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 150,
      flex: 1,
    },
  ];

  const handleStartDate = (date) => {
    // console.log('startDate: ' + date);
    const time = moment.utc(date).format('YYYY-MM-DD HH:mm:ss');
    const stillUtc = moment.utc(time).toDate();
    const start = moment(stillUtc).local().format('YYYY-MM-DD');
    setStartDate(start);
    // console.log(moment(stillUtc).local().format('YYYY-MM-DD'));
  };

  const handleEndDate = (date) => {
    const time = moment.utc(date).format('YYYY-MM-DD HH:mm:ss');
    const stillUtc = moment.utc(time).toDate();
    const end = moment(stillUtc).local().format('YYYY-MM-DD');
    setEndDate(end);
    // console.log(moment(stillUtc).local().format('YYYY-MM-DD'));
  };

  const handleStatemenExport = () => {
    const payload = {
      vendorId: vendorId,
      orgId: orgId,
      orgLocId: locId,
      orgType: orgType,
      from: startDate,
      to: endDate,
      dateLimit: startDate !== null && endDate !== null ? true : false,
      exportFormant: 'pdf',
    };

    if (statementData.length == 0 && startDate == null && endDate == null) {
      setAlertmessage('No Data found to export');
      setTimelineerror('warning');
      handleopensnack();
    }

    if (statementData.length == 0 && startDate !== null && endDate !== null) {
      setAlertmessage('No Data found to export');
      setTimelineerror('warning');
      handleopensnack();
    }

    if (startDate !== null && endDate == null) {
      setAlertmessage('Please select the end date as well to export');
      setTimelineerror('warning');
      handleopensnack();
    }

    if (startDate == null && endDate == null && statementData.length !== 0) {
      setExportLoader(true);
      vendorStatementPdf(payload)
        .then((res) => {
          /** Preview PDF */
          const blob = new Blob([res.data], { type: 'application/pdf' });
          const objectUrl = URL.createObjectURL(blob);
          window.open(objectUrl);

          /** Doownload PDF */
          // var blob = new Blob([res.data], { type: 'application/pdf' });
          // const link = document.createElement('a');
          // link.href = URL.createObjectURL(blob);
          // link.download = `Bank_Statement.pdf`;
          // document.body.appendChild(link);
          // link.click();
          // link.remove();

          setExportLoader(false);
          setAlertmessage('Statement exported successfully');
          setTimelineerror('success');
          handleopensnack();
        })
        .catch((err) => {});
    }

    if (startDate !== null && endDate !== null && statementData.length !== 0) {
      setExportLoader(true);
      vendorStatementPdf(payload)
        .then((res) => {
          const blob = new Blob([res.data], { type: 'application/pdf' });
          const objectUrl = URL.createObjectURL(blob);
          window.open(objectUrl);
          setExportLoader(false);
          setAlertmessage('Statement exported successfully');
          setTimelineerror('success');
          handleopensnack();
        })
        .catch((err) => {});
    }
  };

  return (
    <>
      <Snackbar open={opensnack} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={timelinerror} sx={{ width: '100%' }}>
          {alertmessage}
        </Alert>
      </Snackbar>

      {!statementData.length && notFound ? (
        <Card className="vendorCardShadow" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
            <div>
              <CategoryIcon sx={{ color: '#0562FB', fontSize: '30px' }} />
            </div>
            <SoftTypography fontSize="14px" fontWeight="bold" variant="caption">
              Sorry, there is no statement available for this vendor{' '}
            </SoftTypography>
            {/* <SoftButton color="info">+ Add</SoftButton> */}
          </div>
        </Card>
      ) : (
        <SoftBox
          p={2}
          mt={4}
          className="statement-main-container"
          style={{
            overflowX: 'auto',
          }}
        >
          <SoftBox className="statement-headers">
            <Box className="date-filters">
              <Box
                className="start-date"
                sx={{
                  marginTop: '0',
                }}
              >
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    views={['year', 'month', 'day']}
                    label="Start Date"
                    value={startDate}
                    onChange={(date) => {
                      handleStartDate(date.$d);
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
              </Box>

              <Box
                className="end-date"
                sx={{
                  marginTop: '0',
                }}
              >
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    views={['year', 'month', 'day']}
                    label="End Date"
                    value={endDate}
                    onChange={(date) => {
                      handleEndDate(date.$d);
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
              </Box>
              {exportLoader ? (
                <BeatLoader color="rgb(0,100,254)" size={15} />
              ) : (
                <SoftButton onClick={handleStatemenExport}>
                  <FileDownloadIcon
                    sx={{
                      position: 'relative',
                      right: '0.5rem',
                    }}
                  />
                  Export
                </SoftButton>
              )}
            </Box>
            {/* <SoftBox
              className="balance"
              sx={{
                display: 'flex',
              }}
            >
              <SoftTypography
                variant="button"
                // fontWeight="medium"
                color="text"
                sx={{
                  fontWeight: 'bold',
                  fontSize: '1rem',
                }}
              >
                Balance :
              </SoftTypography>
              <SoftTypography
                variant="button"
                // fontWeight="medium"
                color="text"
                sx={{
                  fontWeight: '400',
                  fontSize: '1rem',
                  marginLeft: '0.8rem',
                }}
              >
                {balance}
              </SoftTypography>
            </SoftBox> */}
          </SoftBox>
          <Card style={{ height: 525, width: '100%', marginTop: '1rem' }}>
            <DataGrid
              sx={{
                ...dataGridStyles.header,
              }}
              rows={statementData}
              columns={columns}
              pagination
              rowsPerPageOptions={[10]}
              disableSelectionOnClick
              getRowId={(row) => row.refId}
            />
          </Card>
        </SoftBox>
      )}
    </>
  );
};
