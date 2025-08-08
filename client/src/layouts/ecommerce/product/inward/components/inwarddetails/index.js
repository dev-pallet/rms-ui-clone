import './inwardDetails.css';
import * as React from 'react';
import { Box, Typography } from '@mui/material';
import { CopyToClipBoard, dateFormatter, isSmallScreen, textFormatter } from '../../../../Common/CommonFunction';
import { DataGrid } from '@mui/x-data-grid';
import { inwardDetailsData } from '../../../../../../config/Services';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Grid from '@mui/material/Grid';
import InwardDetailCard from '../inwardDetailsListCard';
import MobileNavbar from '../../../../../../examples/Navbars/MobileNavbar/mobile-navbar-drawer';
import MuiAlert from '@mui/material/Alert';
import SoftBox from 'components/SoftBox';
import SoftInput from '../../../../../../components/SoftInput';
import SoftTypography from 'components/SoftTypography';
import Spinner from '../../../../../../components/Spinner';
import Status from '../../../../Common/Status';
import clsx from 'clsx';

const InwardDetails = () => {
  //sessionId
  const { id } = useParams();
  const [Inwardinfo, setInwardInfo] = useState('');
  const [loader, setLoader] = useState(false);
  const [errorImg, setErrorImg] = useState(false);

  //snackbar

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

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

  const columns = [
    {
      field: 'product',
      headerName: 'Product',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
      minWidth: 120,
      flex: 1,
    },
    {
      field: 'id',
      headerName: 'Barcode',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
      minWidth: 150,
      flex: 1,
      renderCell: (params) => {      
        return (
          <CopyToClipBoard params={params} />
        ); 
      }, 
    },
    {
      field: 'batch',
      headerName: 'Batch No',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
      minWidth: 150,
      flex: 1,
    },
    {
      field: 'quantity',
      headerName: 'Inwarded Quantity',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
      minWidth: 150,
      flex: 1,
    },
    {
      field: 'createdOn',
      headerName: 'Expiry Date',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
      minWidth: 120,
      flex: 1,
    },
    {
      field: 'status',
      headerName: 'Status',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
      minWidth: 150,
      flex: 1,
      cellClassName: (params) => {
        if (params.value == null) {
          return '';
        }
        return clsx('super-app', {
          Recived: params.value === 'RECEIVED',
          Partially: params.value === 'PARTIALLY_RECEIVED',
        });
      },
      renderCell: (cellValues) => {
        return (
          <div
            // style={{
            //   width: '150px',
            //   // width: '70px',
            //   // height: '20px',
            //   backgroundColor: '#F6F6F6',
            //   padding: '2px 0px',
            //   borderRadius: '4px',
            //   textAlign: 'center',
            //   // border: '1px solid lightgreen',
            //   border:
            //     cellValues.value === 'STARTED' || cellValues.value === 'RECEIVED'
            //       ? '1px solid green'
            //       : '1px solid #DE350B',
            // }}
            // className="status-text"
          >
            {cellValues.value!=='' && <Status label={cellValues.value}/>}
          </div>
        );
      },
    },
    // {
    //   field: 'item',
    //   headerName: 'ItemName',
    //   headerClassName: 'datagrid-columns',
    //   headerAlign: 'center',
    //   cellClassName: 'datagrid-rows',
    //   align: 'center',
    //   minWidth: 180,
    //   flex: 1,
    // },
    {
      field: 'inwardedBy',
      headerName: 'Inwarded By',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
      minWidth: 180,
      flex: 1,
    },
  ];

  //inwards-details-api

  const [datRows, setTableRows] = useState([]);
  let dataArr,
    dataRow = [];

  useEffect(() => {
    setLoader(true);
    inwardDetailsData(id)
      .then((res) => {
        if (res.data.data.message === 'Provided id cannot be numeric: 3456') {
          setAlertmessage(res.data?.data?.message);
          setTimelineerror('error');
          handleopensnack();
          setLoader(false);
          setErrorImg(true);
        } else {
          setAlertmessage(res.data.data.message);
          setTimelineerror('success');
          handleopensnack();
          setInwardInfo(res.data.data.inwardSessionInfo);
          dataArr = res.data.data;
          dataRow.push(
            dataArr?.inwardItemInfo?.map((row) => ({
              product: row.itemName !== null ? textFormatter(row.itemName) : '---',
              createdOn: row.expiryDetail ? dateFormatter(row.expiryDetail) : '-----',
              status: row.itemInwardStatus ? row.itemInwardStatus : '-----',
              item: row.itemName ? row.itemName : '-----',
              batch: row.batchNumber ? row.batchNumber : '-----',
              id: row.gtin ? row.gtin : '-----',
              quantity: row.inwardedQuantity ? row.inwardedQuantity : '-----',
              inwardedBy: dataArr.inwardSessionInfo.inwardedBy !== null ? dataArr.inwardSessionInfo.inwardedBy : '---',
            })),
          );
          setTableRows(dataRow[0]);
          setLoader(false);
        }
      })
      .catch((err) => {
        setAlertmessage(err.response.data.message);
        setTimelineerror('error');
        handleopensnack();
        setLoader(false);
        setErrorImg(true);
      });
  }, []);

  const isMobileDevice = isSmallScreen();

  return (
    <DashboardLayout isMobileDevice={isMobileDevice}>
      {!isMobileDevice && <DashboardNavbar prevLink={true} />}
      {/* <Snackbar open={opensnack} autoHideDuration={3000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical, horizontal }}   key={vertical + horizontal}
>
        <Alert onClose={handleCloseSnackbar} severity={timelinerror} sx={{ width: '100%' }}>
          {alertmessage}
        </Alert>
      </Snackbar> */}

      {loader ? (
        <Spinner />
      ) : (
        <>
          {isMobileDevice && (
            <SoftBox className="navbar-main-div-mob-bg po-box-shadow nav-pos-mob">
              <MobileNavbar title={'Inward Details'} prevLink={true}/>
            </SoftBox>
          )}
          <SoftBox
            my={3}
            className="inward-details-box-1"
          >
            {errorImg ? (
              <SoftBox className="error-inward-box">
                <img className="no-data-img-todo-inward" src="https://www.imbbearing.in/Images/nodata.jpg" alt="" />
              </SoftBox>
            ) : (
              <>
                {!isMobileDevice && (<>
                  <SoftBox className="inward-details-session-details">
                    <SoftTypography className="inward-details-session-heading">
                Session Details
                    </SoftTypography>
                    <SoftTypography className="inward-details-session-heading">{Inwardinfo.sessionStatus && <Status label={Inwardinfo.sessionStatus}/>}</SoftTypography>
                  </SoftBox>
                  <Grid container spacing={3}>
                    <Grid item lg={4} md={12} sm={12}>
                      <div className="marketing-overview-second-box">
                        <div>
                          <Typography
                            variant="subtitle2"
                            className='inward-details-typo-heading-1'
                          >
                            {Inwardinfo.sessionId}
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            className='inward-details-typo-heading-2'
                          >
                        SessionId
                          </Typography>
                        </div>
                        <div>
                          <Typography
                            variant="subtitle2"
                            className='inward-details-typo-heading-1'
                          >
                            {Inwardinfo.requestNumber}
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            className='inward-details-typo-heading-2'
                          >
                        Request Number
                          </Typography>
                        </div>
                      </div>
                    </Grid>
                    <Grid item lg={4} md={12} sm={12}>
                      <div className="marketing-overview-second-box">
                        <div>
                          <Typography
                            variant="subtitle2"
                            className='inward-details-typo-heading-1'
                          >
                            {Inwardinfo.sessionStartedAt}
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            className='inward-details-typo-heading-2'
                          >
                        Session Started
                          </Typography>
                        </div>
                        <div>
                          <Typography
                            variant="subtitle2"
                            className='inward-details-typo-heading-1'
                          >
                            {Inwardinfo.sessionEndedAt === null ? '------' : Inwardinfo.sessionEndedAt}
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            className='inward-details-typo-heading-2'
                          >
                        Session Ended
                          </Typography>
                        </div>
                      </div>
                    </Grid>
                    <Grid item lg={4} md={12} sm={12}>
                      <div className="marketing-overview-second-box" style={{display: 'flex', justifyContent: 'space-between'}}>
                        <SoftBox>
                          <div>
                            <Typography
                              variant="subtitle2"
                              className='inward-details-typo-heading-1'
                            >
                              {Inwardinfo.totalOrderedQuantity}
                            </Typography>
                            <Typography
                              variant="subtitle2"
                              className='inward-details-typo-heading-2'
                            >
                          Ordered Quantity
                            </Typography>
                          </div>
                          <div>
                            <Typography
                              variant="subtitle2"
                              className='inward-details-typo-heading-1'
                            >
                              {Inwardinfo.totalPendingQuantity}
                            </Typography>
                            <Typography
                              variant="subtitle2"
                              className='inward-details-typo-heading-2'
                            >
                          Pending Quantity
                            </Typography>
                          </div>
                        </SoftBox>
                        <SoftBox>
                          <div>
                            <Typography
                              variant="subtitle2"
                              className='inward-details-typo-heading-1'
                            >
                              {Inwardinfo.totalReceivedQuantity}
                            </Typography>
                            <Typography
                              variant="subtitle2"
                              className='inward-details-typo-heading-2'
                            >
                          Received Quantity
                            </Typography>
                          </div>
                          <div>
                            <Typography
                              variant="subtitle2"
                              className='inward-details-typo-heading-1'
                            >
                              {Inwardinfo.totalItemScanned}
                            </Typography>
                            <Typography
                              variant="subtitle2"
                              className='inward-details-typo-heading-2'
                            >
                          Item Scanned
                            </Typography>
                          </div>
                        </SoftBox>
                      </div>
                    </Grid>
                  </Grid>
                </>)}
              
                <Grid container spacing={3}>
                  <Grid item xs={12} lg={12} height="300px" className='margin-top-inward-details'>
                    <SoftBox
                      className={!isMobileDevice && 'search-bar-filter-and-table-container grid-box'}
                      sx={{
                        '& .super-app.Recived': {
                        // color: '#69e86d',
                          color: 'green',
                          fontSize: '0.7em',
                          fontWeight: '600',
                          margin: '0px auto 0px auto',
                          padding: '5px',
                        },
                        '& .super-app.Partially': {
                          color: 'Purple',
                          fontSize: '0.7em',
                          fontWeight: '600',
                          margin: '0px auto 0px auto',
                          padding: '5px',
                        },
                      }}
                    >
                      {!isMobileDevice && <SoftBox className="search-bar-filter-container">
                        <SoftBox className="inward-details-session-details">
                          <Box className="all-products-filter-product" style={{ width: '350px' }}>
                            <SoftInput
                              className="all-products-filter-soft-input-box"
                              placeholder="Search"
                              icon={{ component: 'search', direction: 'left' }}
                            />
                          </Box>
                        </SoftBox>
                      </SoftBox>}
                      {!isMobileDevice ? (
                        <DataGrid rows={datRows} columns={columns} autoPageSize pagination disableSelectionOnClick />
                      ) : (
                        datRows.length > 0 && (
                          <SoftBox sx={{ height: '100% !important', marginBottom: '10px' }}>
                            <Typography fontSize="16px" fontWeight={700}>
                            Product Details
                            </Typography>
                            {datRows.map((row) => (
                              <InwardDetailCard data={row} />
                            ))}
                          </SoftBox>
                        )
                      )}
                    </SoftBox>
                  </Grid>
                </Grid>
              </>
            )}
          </SoftBox>
        </>
      )}
    </DashboardLayout>
  );
};

export default InwardDetails;
