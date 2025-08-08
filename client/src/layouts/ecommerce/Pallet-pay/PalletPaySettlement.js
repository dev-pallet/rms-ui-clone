import './PalletPay.css';
import { Box, Grid } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { getSettlementDataForOrgPerDay } from '../../../config/Services';
import { makeStyles } from '@mui/styles';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import CloseIcon from '@mui/icons-material/Close';
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../examples/Navbars/DashboardNavbar';
import Drawer from '@mui/material/Drawer';
import Filter from '../Common/Filter';
import React from 'react';
import SoftBox from '../../../components/SoftBox';
import SoftInput from '../../../components/SoftInput';
import SoftTypography from '../../../components/SoftTypography';
import Spinner from 'components/Spinner/index';
import { noDatagif } from '../Common/CommonFunction';

const drawerWidth = 500;

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: 'white',
  },
  content: {
    padding: '16px',
  },
}));

const PalletPaySettlement = () => {
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');

  const navigate = useNavigate();
  const classes = useStyles();

  const contextType = localStorage.getItem('contextType');

  const [loader, setLoader] = useState(false);
  const [errorComing, setErrorComing] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [rowData, setRowData] = useState(null);
  const [pageState, setPageState] = useState({
    loader: false,
    datRows: [],
    total: 0,
    page: 1,
    pageSize: 10,
  });
  const [settlementData, setSettlementData] = useState([]);

  const settlementColumns = [
    {
      headerName: 'Transaction Date',
      field: 'calculatedOn',
      minWidth: 180,
      editable: true,
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
      editable: true,
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
      editable: true,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
    },
    {
      headerName: 'Total Amount',
      field: 'totalAmount',
      type: 'number',
      minWidth: 180,
      editable: true,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
    },
  ];

  const handleRowData = (data) => {
    // console.log('rowData', data);
    setRowData(data);
    // setIsDrawerOpen(true);
    navigate('/pallet-pay/settlement-details');
  };

  const toggleDrawer = (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  const fetchSettlementDataForOrg = async () => {
    const payload = {
      organizationId: orgId,
      pageNumber: 0,
      pageSize: 10,
    };
    try {
      setLoader(true);
      const response = await getSettlementDataForOrgPerDay(payload);
      setErrorComing(false);
      let result = response.data.data.settlements;
      if (result.length > 0 && response.data.data.es == 0) {
        result = result.map((row) => ({
          id: uuidv4(),
          calculatedOn: row?.calculatedOn !== null ? row?.calculatedOn : '---',
          settlementAmount: row?.settlementAmount !== null ? '₹' + row?.settlementAmount : '---',
          transactionCharges: row?.transactionCharges !== null ? '₹' + row?.transactionCharges : '---',
          totalAmount: row?.totalAmount !== null ? '₹' + row?.totalAmount : '---',
        }));
        setSettlementData(result);
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
      // console.log({ resp });
      setLoader(false);
      setErrorComing(true);
    }
  };

  useEffect(() => {
    fetchSettlementDataForOrg();
  }, []);

  const handleRowDetails = (rows) => {
    // console.log(rows);
    const tranasactionDay = rows.row.calculatedOn;
    navigate(`/pallet-pay/settlement-details/${tranasactionDay}`);
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

        <Box className="settlement-table">
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
        </Box>
      </Drawer>
    </DashboardLayout>
  );
};

export default PalletPaySettlement;
