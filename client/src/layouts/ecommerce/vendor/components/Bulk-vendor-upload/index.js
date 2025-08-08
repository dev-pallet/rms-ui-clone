import React from 'react';

import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { Box, Grid, useMediaQuery, useTheme } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { createStyles, makeStyles } from '@mui/styles';
import { DataGrid } from '@mui/x-data-grid';
import clsx from 'clsx';
import SoftBox from '../../../../../components/SoftBox';
import SoftSelect from '../../../../../components/SoftSelect';
import DashboardLayout from '../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../examples/Navbars/DashboardNavbar';

const defaultTheme = createTheme();
const useStyles = makeStyles(
  (theme) =>
    createStyles({
      root: {
        border: `1px solid ${theme.palette.divider}`,
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        height: 26,
        borderRadius: 2,
      },
      value: {
        position: 'absolute',
        lineHeight: '24px',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
      },
      bar: {
        height: '100%',
        '&.low': {
          backgroundColor: '#f44336',
        },
        '&.medium': {
          backgroundColor: '#efbb5aa3',
        },
        '&.high': {
          backgroundColor: '#088208a3',
        },
      },
    }),
  { defaultTheme },
);

const ProgressBar = React.memo(function ProgressBar(props) {
  const { value } = props;
  const valueInPercent = value;
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.value}>{`${valueInPercent.toLocaleString()} %`}</div>
      <div
        className={clsx(classes.bar, {
          low: valueInPercent < 30,
          medium: valueInPercent >= 30 && valueInPercent <= 70,
          high: valueInPercent > 70,
        })}
        style={{ maxWidth: `${valueInPercent}%` }}
      />
    </div>
  );
});
export function renderProgress(params) {
  return <ProgressBar value={Number(params.value)} />;
}

const BulkVendorUploadHistory = () => {
  //material ui media query
  const themes = useTheme();
  const isMobile = useMediaQuery(themes.breakpoints.down('md'));

  const mainStatus = [
    {
      value: 'Completed',
      label: 'Completed',
    },
    {
      value: 'Pending',
      label: 'Pending',
    },
  ];
  const columns = isMobile
    ? [
        {
          field: 'id',
          headerName: 'Id',
          minWidth: 20,
          flex: 1,
          headerClassName: 'datagrid-columns',
          headerAlign: 'center',
          cellClassName: 'datagrid-rows',
          align: 'center',
        },

        {
          field: 'fileName',
          headerName: 'File Name',
          headerClassName: 'datagrid-columns',
          headerAlign: 'center',
          flex: 1,
          minWidth: 120,
          cellClassName: 'datagrid-rows',
          align: 'center',
        },
        {
          field: 'status',
          headerName: 'Status',
          headerClassName: 'datagrid-columns',
          headerAlign: 'center',
          flex: 1,
          minWidth: 100,
          cellClassName: 'datagrid-rows',
          align: 'center',
        },
        {
          field: 'progress',
          headerName: 'Progress',
          headerClassName: 'datagrid-columns',
          headerAlign: 'center',
          flex: 1,
          minWidth: 150,
          cellClassName: 'datagrid-rows',
          align: 'center',
          renderCell: renderProgress,
        },
        {
          field: 'download',
          headerName: 'Download',
          headerClassName: 'datagrid-columns',
          headerAlign: 'center',
          flex: 1,
          minWidth: 50,
          cellClassName: 'datagrid-rows',
          align: 'center',
          renderCell: (params) => {
            // console.log('params', params);

            return (
              <SoftBox className="print-label">
                <FileDownloadOutlinedIcon color="info" fontSize="medium" />
              </SoftBox>
            );
          },
        },
      ]
    : [
        {
          field: 'id',
          headerName: 'Id',
          minWidth: 20,
          flex: 1,
          headerClassName: 'datagrid-columns',
          headerAlign: 'center',
          cellClassName: 'datagrid-rows',
          align: 'center',
        },

        {
          field: 'fileName',
          headerName: 'File Name',
          headerClassName: 'datagrid-columns',
          headerAlign: 'center',
          flex: 1,
          minWidth: 120,
          cellClassName: 'datagrid-rows',
          align: 'center',
        },
        {
          field: 'createdON',
          headerName: 'Created Date',
          headerClassName: 'datagrid-columns',
          headerAlign: 'center',
          minWidth: 100,
          flex: 1,
          cellClassName: 'datagrid-rows',
          align: 'center',
        },
        {
          field: 'status',
          headerName: 'Status',
          headerClassName: 'datagrid-columns',
          headerAlign: 'center',
          flex: 1,
          minWidth: 100,
          cellClassName: 'datagrid-rows',
          align: 'center',
        },
        {
          field: 'progress',
          headerName: 'Progress',
          headerClassName: 'datagrid-columns',
          headerAlign: 'center',
          flex: 1,
          minWidth: 150,
          cellClassName: 'datagrid-rows',
          align: 'center',
          renderCell: renderProgress,
        },
        {
          field: 'noOfRows',
          headerName: 'Total Items',
          headerClassName: 'datagrid-columns',
          headerAlign: 'center',
          flex: 1,
          minWidth: 50,
          cellClassName: 'datagrid-rows',
          align: 'center',
        },
        {
          field: 'noOfRowsProcessed',
          headerName: 'Total Items Processed',
          headerClassName: 'datagrid-columns',
          headerAlign: 'center',
          flex: 1,
          minWidth: 50,
          cellClassName: 'datagrid-rows',
          align: 'center',
        },
        {
          field: 'download',
          headerName: 'Download',
          headerClassName: 'datagrid-columns',
          headerAlign: 'center',
          flex: 1,
          minWidth: 50,
          cellClassName: 'datagrid-rows',
          align: 'center',
          renderCell: (params) => {
            // console.log('params', params);

            return (
              <SoftBox className="print-label">
                <FileDownloadOutlinedIcon color="info" fontSize="medium" />
              </SoftBox>
            );
          },
        },
      ];

  const rows = [
    {
      id: 1,
      fileName: 'File 1',
      createdON: '30/10/2023',
      status: 'Pending',
      progress: 20,
      noOfRows: 100,
      noOfRowsProcessed: 20,
    },
    {
      id: 2,
      fileName: 'File 1',
      createdON: '30/10/2023',
      status: 'Pending',
      progress: 40,
      noOfRows: 100,
      noOfRowsProcessed: 20,
    },
    {
      id: 3,
      fileName: 'File 1',
      createdON: '30/10/2023',
      status: 'Pending',
      progress: 60,
      noOfRows: 100,
      noOfRowsProcessed: 20,
    },
    {
      id: 4,
      fileName: 'File 1',
      createdON: '30/10/2023',
      status: 'Pending',
      progress: 30,
      noOfRows: 100,
      noOfRowsProcessed: 20,
    },
    {
      id: 5,
      fileName: 'File 1',
      createdON: '30/10/2023',
      status: 'Pending',
      progress: 90,
      noOfRows: 100,
      noOfRowsProcessed: 20,
    },
  ];

  return (
    <div>
      <DashboardLayout>
        <DashboardNavbar />

        <Box
          className="table-css-fix-box-scroll-vend"
          style={{
            boxShadow: 'rgba(37, 37, 37, 0.126) 0px 5px 50px',
            position: 'relative',
          }}
        >
          <Box className="header-bulk-price-edit all-products-filter-wrapper" style={{ justifyContent: 'flex-start' }}>
            <Grid container spacing={2} className="all-products-filter">
              <Grid item lg={4} md={4} sm={6} xs={12}>
                <Box className="all-products-filter-product">
                  <SoftSelect
                    className="all-products-filter-soft-select-box"
                    placeholder="Status"
                    options={mainStatus}
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>

          <SoftBox
            py={0}
            px={0}
            sx={{
              marginTop: '1rem',
            }}
          >
            <SoftBox style={{ height: 525, width: '100%' }} className="dat-grid-table-box">
              <DataGrid
                columns={columns}
                rows={rows}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 5,
                    },
                  },
                }}
                pageSizeOptions={[5]}
              />
            </SoftBox>
          </SoftBox>
        </Box>
      </DashboardLayout>
    </div>
  );
};

export default BulkVendorUploadHistory;
