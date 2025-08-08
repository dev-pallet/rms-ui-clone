import React from 'react';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import SoftBox from '../../../../components/SoftBox';
import { isSmallScreen, noDatagif } from '../../Common/CommonFunction';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../../../hooks/SnackbarProvider';
import { Grid } from '@mui/material';
import SoftInput from '../../../../components/SoftInput';
import SoftButton from '../../../../components/SoftButton';
import AddIcon from '@mui/icons-material/Add';
import SoftTypography from '../../../../components/SoftTypography';
import Filter from '../../Common/Filter';
import { DataGrid } from '@mui/x-data-grid';

const AllRecipePage = () => {
  const isMobileDevice = isSmallScreen();
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();

  const columns = [
    {
      field: 'date',
      headerName: 'Date',
      minWidth: 150,
      flex: 0.75,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'prId',
      headerName: 'PR ID',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 150,
      flex: 0.75,
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'jobId',
      headerName: 'Job ID',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 150,
      flex: 0.75,
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'type',
      headerName: 'Type',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 150,
      flex: 0.75,
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'status',
      headerName: 'Status',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 150,
      flex: 0.75,
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'amount',
      headerName: 'Amount',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 150,
      flex: 0.75,
      width: 200,
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
        field: 'refundStatus',
        headerName: 'Refunt Status',
        headerClassName: 'datagrid-columns',
        headerAlign: 'left',
        minWidth: 150,
        flex: 0.75,
        width: 200,
        cellClassName: 'datagrid-rows',
        align: 'left',
      },
      {
        field: 'refundMode',
        headerName: 'Refund Mode',
        headerClassName: 'datagrid-columns',
        headerAlign: 'left',
        minWidth: 150,
        flex: 0.75,
        width: 200,
        cellClassName: 'datagrid-rows',
        align: 'left',
      },
  ];
  
  const dataRows = [
    {
        date: '23 june, 2024',
        prId: 'JREN21903ID',
        jobId: '93jen930d',
        type: 'Manual',
        status: 'Pre cleaning',
        amount: '1344',
        refundStatus: 'Paid',
        refundMode: 'Cash',
    }
  ]

  return (
    <div>
      <DashboardLayout>
        <DashboardNavbar />
        <SoftBox
          // className="table-css-fix-box-scroll-pi"
          className="search-bar-filter-and-table-container"
          sx={{ marginTop: isMobileDevice ? '0px' : '10px', boxShadow: isMobileDevice && 'none !important' }}
        >
          <SoftBox className="search-bar-filter-container">
            <Grid container spacing={2} justifyContent={'space-between'}>
              <Grid item lg={5.5} md={5.5} sm={6} xs={12}>
                <SoftBox>
                  <SoftBox className="vendor-filter-input" sx={{ position: 'relative' }}>
                    <SoftInput
                      className="filter-add-list-cont-bill-search"
                      placeholder="Search Recipes"
                      icon={{ component: 'search', direction: 'left' }}
                    />
                  </SoftBox>
                </SoftBox>
              </Grid>

              <Grid item>
                <SoftBox className="content-space-between">
                  <SoftBox className="vendors-new-btn">
                    <SoftButton variant="solidWhiteBackground" onClick={() => navigate("/products/recipe/create")}>
                      <AddIcon />
                      Recipe
                    </SoftButton>
                  </SoftBox>
                  {/* filter  */}
                  <Filter />
                </SoftBox>
              </Grid>
            </Grid>

            <Grid container spacing={2} className="payment-summary">
              <Grid item xs={12}>
                <SoftTypography className="payment-heading-summary">Recipe Summary</SoftTypography>
              </Grid>
              <Grid item xs={12}>
                <Grid container direction="row" justifyContent="space-between" p={1}>
                  <Grid item xs={1} md={1} xl={2}>
                    <SoftBox>
                      <SoftBox className="payment-text-box-summary">
                        <SoftTypography className="payment-sub-heading-summary">Total Recipes</SoftTypography>

                        <SoftTypography className="payment-text-summary" fontWeight="bold">
                          312
                        </SoftTypography>
                      </SoftBox>
                    </SoftBox>
                  </Grid>
                  <Grid item xs={1} md={1} xl={1.5}>
                    <SoftBox className="payment-text-box-summary">
                      <SoftTypography className="payment-sub-heading-summary">Items</SoftTypography>
                      <SoftTypography className="payment-text-due-summary">312</SoftTypography>
                    </SoftBox>
                  </Grid>
                  <Grid item xs={1.5} md={1.5} xl={1.5}>
                    <SoftBox className="payment-text-box-summary">
                      <SoftTypography className="payment-sub-heading-summary">Variants</SoftTypography>
                      <SoftTypography className="payment-text-summary">983</SoftTypography>
                    </SoftBox>
                  </Grid>
                  <Grid item xs={1.5} md={1.5} xl={1.5}>
                    <SoftBox className="payment-text-box-summary payment-no-border">
                      <SoftTypography className="payment-sub-heading-summary">Raw Materials</SoftTypography>
                      <SoftTypography className="payment-text-summary">984</SoftTypography>
                    </SoftBox>
                  </Grid>
                  <Grid item xs={1.5} md={1.5} xl={1.5}>
                    <SoftBox className="payment-text-box-summary payment-no-border">
                      <SoftTypography className="payment-sub-heading-summary">Add ons</SoftTypography>
                      <SoftTypography className="payment-text-summary">24</SoftTypography>
                    </SoftBox>
                  </Grid>
                  <Grid item xs={1.5} md={1.5} xl={1.5}>
                    <SoftBox className="payment-text-box-summary payment-no-border">
                      <SoftTypography className="payment-sub-heading-summary">Serving Add ons</SoftTypography>
                      <SoftTypography className="payment-text-summary">274</SoftTypography>
                    </SoftBox>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </SoftBox>

          {!isMobileDevice && (
            <SoftBox
            // py={1}
            >
              <div
                style={{
                  // height: '70vh',
                  width: '100%',
                }}
              >
                {!dataRows?.length ? (
                  <SoftBox className="No-data-text-box">
                    <SoftBox className="src-imgg-data">
                      <img
                        className="src-dummy-img"
                        src={noDatagif}
                      />
                    </SoftBox>
                    <h3 className="no-data-text-I">NO DATA FOUND</h3>
                  </SoftBox>
                ) : (
                  dataRows != null && (
                    <SoftBox
                      // py={0}
                      // px={0}
                      // p={'15px'}
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
                      }}
                    >
                      <DataGrid
                        rows={dataRows}
                        className="data-grid-table-boxo"
                        rowsPerPageOptions={[10]}
                        getRowId={(row) => row.prId}
                        rowHeight={45}
                        // onCellClick={(rows) => navigateToDetailsPage(rows.row['vendorId'])}
                        columns={columns}
                      />
                    </SoftBox>
                  )
                )}
              </div>
            </SoftBox>
          )}
        </SoftBox>
      </DashboardLayout>
    </div>
  );
};

export default AllRecipePage;
