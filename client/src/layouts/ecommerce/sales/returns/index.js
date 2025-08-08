import './over-view.css';
import { DataGrid } from '@mui/x-data-grid';
import { Grid } from '@mui/material';
import { dateFormatter, isSmallScreen, noDatagif, textFormatter } from '../../Common/CommonFunction';
import { getAllSalesReturn } from '../../../../config/Services';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../../../hooks/SnackbarProvider';
import CommonSearchBar from '../../Common/MobileSearchBar';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import MobileNavbar from '../../../../examples/Navbars/MobileNavbar/mobile-navbar-drawer';
import SoftBox from 'components/SoftBox';
import SoftInput from 'components/SoftInput';
import SoftTypography from '../../../../components/SoftTypography';

function Returns() {
  const isMobileDevice = isSmallScreen();

  const columns = [
    {
      field: 'createdDate',
      headerName: 'Date',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 120,
      flex: 0.75,
    },
    {
      field: 'orderNumber',
      headerName: 'Order Number',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 120,
      flex: 0.75,
    },
    {
      field: 'customerName',
      headerName: 'Customer Name',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 150,
      flex: 0.75,
    },
    {
      field: 'paymentStatus',
      headerName: 'Payment Status',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      cellclassName: 'sss-kskk',
      align: 'left',
      minWidth: 150,
      flex: 0.75,
    },
    {
      field: 'shipmentStatus',
      headerName: 'Shipment Status',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      cellclassName: 'sss-kskk',
      align: 'left',
      minWidth: 150,
      flex: 0.75,
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      cellclassName: 'sss-kskk',
      align: 'left',
      minWidth: 150,
      flex: 0.75,
    },
  ];

  const rows = [
    {
      createdDate: '22/04/2022',
      orderNumber: '45677555555550',
      paymentStatus: 'Rahul',
      shipmentStatus: 'Rahul',
      customerName: 'Closed',
      quantity: '56',
    },
  ];

  const navigate = useNavigate();
  const showSnackbar = useSnackbar();
  const locId = localStorage.getItem('locId');
  const [anchorEl, setAnchorEl] = useState(null);
  const [errorComing, setErrorComing] = useState(false);
  const [loader, setLoader] = useState(false);
  const [dataRows, setTableRows] = useState([]);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [open2, setOpen2] = useState(false);
  const handleOpen2 = () => setOpen2(true);

  useEffect(() => {
    allReturnList();
  }, []);

  let dataArr,
    dataRow = [];
  const allReturnList = () => {
    setLoader(true);
    const payload = {
      status: 'RETURNED',
      locationId: locId,
    };
    getAllSalesReturn(payload)
      .then((res) => {
        setLoader(false);
        if (res?.data?.data?.es) {
          setErrorComing(true);
          showSnackbar(res?.data?.data?.message, 'error');
          return;
        }
        const response = res?.data?.data?.orderItemList;
        if (response.length > 0) {
          dataRow.push(
            response.map((row) => ({
              customerName:
                row?.customerName !== null
                  ? row?.customerName
                    ? textFormatter(row?.baseOrderResponse?.customerName)
                    : '----'
                  : 'WALK-IN',
              orderNumber: row?.orderItemId ? row?.orderItemId : '-----',
              paymentStatus: row?.paymentStatus ? row?.paymentStatus : '-----',
              shipmentStatus: row?.shipmentStatus ? row?.shipmentStatus : '-----',
              quantity: row?.quantity ? row?.quantity : '-----',
              createdDate: row?.baseOrderResponse?.createdAt
                ? dateFormatter(row?.baseOrderResponse?.createdAt)
                : '-----',
            })),
          );
          setTableRows(dataRow[0]);
        }
        setErrorComing(false);
      })
      .catch((err) => {
        setLoader(false);
        setErrorComing(true);
        showSnackbar(err?.response?.data?.message || 'Some error occured', 'error');
      });
  };

  return (
    <>
      <DashboardLayout>
        {!isMobileDevice && <DashboardNavbar />}
        {isMobileDevice && (
          <SoftBox className="new-search-header po-box-shadow">
            <MobileNavbar title={'Returns'} />
            <CommonSearchBar
              // searchFunction={handleSearchFliter}
              // handleNewBtnFunction={handleNew}
              placeholder="Search Returns..."
              handleNewRequired={false}
            />
          </SoftBox>
        )}
        {!isMobileDevice ? (
          <SoftBox className="search-bar-filter-and-table-container">
            <SoftBox className="search-bar-filter-container">
              <Grid
                container
                spacing={2}
                className="filter-product-list-cont"
                sx={
                  {
                    // padding: '15px 15px 0px 15px ',
                  }
                }
              >
                <Grid item lg={5.5} md={5.5} sm={6} xs={12}>
                  <SoftBox>
                    <SoftInput
                      className="filter-add-list-cont-bill-search"
                      placeholder="Search"
                      icon={{ component: 'search', direction: 'left' }}
                      // onChange={handleSearchFliter}
                    />
                  </SoftBox>
                </Grid>
              </Grid>
            </SoftBox>
            <SoftBox
              style={{ height: 525, width: '100%' }}
              className="dat-grid-table-box"
              sx={{
                '& .super-app.Approved': {
                  color: '#69e86d',
                  fontSize: '0.7em',
                  fontWeight: '600',
                  margin: '0px auto 0px auto',
                  padding: '5px',
                },
                '& .super-app.Reject': {
                  color: '#df5231',
                  fontSize: '0.7em',
                  fontWeight: '600',
                  margin: '0px auto 0px auto',
                  padding: '5px',
                },
                '& .super-app.Create': {
                  color: '#888dec',
                  fontSize: '0.7em',
                  fontWeight: '600',
                  margin: '0px auto 0px auto',
                  padding: '5px',
                },
                '& .super-app.Assign': {
                  color: 'purple',
                  fontSize: '0.7em',
                  fontWeight: '600',
                  margin: '0px auto 0px auto',
                  padding: '5px',
                },
                '& .super-app.Deliver': {
                  color: '#E384FF',
                  fontSize: '0.7em',
                  fontWeight: '600',
                  margin: '0px auto 0px auto',
                  padding: '5px',
                },
                '& .super-app.Inwarded': {
                  color: 'Blue',
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
              {errorComing ? (
                <SoftBox className="No-data-text-box">
                  <SoftBox className="src-imgg-data">
                    <img className="src-dummy-img" src={noDatagif} />
                  </SoftBox>

                  <h3 className="no-data-text-I">NO DATA FOUND</h3>
                </SoftBox>
              ) : (
                <>
                  <DataGrid
                    sx={{ cursor: 'pointer', borderBottomRightRadius: '10px', borderBottomLeftRadius: '10px' }}
                    className="data-grid-table-boxo"
                    columns={columns}
                    rows={dataRows}
                    getRowId={(row) => row.orderNumber}
                    autoPageSize
                    pagination
                    disableSelectionOnClick
                  />
                </>
              )}
            </SoftBox>
          </SoftBox>
        ) : (
          <SoftBox className="no-data-found">
            <SoftTypography fontSize="14px">No Data Found</SoftTypography>
          </SoftBox>
        )}
      </DashboardLayout>
    </>
  );
}

export default Returns;
