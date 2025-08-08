import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import { Box, Grid } from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { createTheme } from '@mui/material/styles';
import { createStyles, makeStyles } from '@mui/styles';
import { DataGrid } from '@mui/x-data-grid';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SoftBox from '../../../../../../components/SoftBox';
import SoftButton from '../../../../../../components/SoftButton';
import SoftSelect from '../../../../../../components/SoftSelect';
import Spinner from '../../../../../../components/Spinner';

import { getAllBulkUploadProducts, stopBulkJobProducts } from '../../../../../../config/Services';
import DashboardLayout from '../../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../../examples/Navbars/DashboardNavbar';
import { useSnackbar } from '../../../../../../hooks/SnackbarProvider';
import Status from '../../../../Common/Status';
import './bulk-product-history.css';
import Swal from 'sweetalert2';

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

const BulkProductHistory = () => {
  const [loader, setLoader] = useState(true);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalData, setTotalData] = useState();
  const [pageSize, setPageSize] = useState(8); // Page size
  const [statusFilter, setStatusFilter] = useState('ALL'); // Status filter
  const [filteredData, setFilteredData] = useState(data); // Filtered data
  const [clickedRow, setClickedRow] = useState([]);

  const [anchorEl, setAnchorEl] = useState(null);

  const showSnackbar = useSnackbar();

  // local storage items
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const sourceType = localStorage.getItem('contextType');

  // Function to filter data based on status
  const filterDataByStatus = () => {
    if (!statusFilter) {
      // If no status filter is selected, display all data
      setFilteredData(data);
    } else {
      // Filter data based on the selected status
      const filtered = data.filter((item) => item.status === statusFilter);
      setFilteredData(filtered);
    }
    setPage(1); // Reset the page to 1 when applying a filter
  };

  // Function to handle page size change
  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setPage(1); // Reset the page to 1 when changing page size
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const navigate = useNavigate();

  const handleAddBulkProducts = () => {
    navigate('/products/bulk-upload');
  };

  const mainStatus = [
    {
      value: 'ALL',
      label: 'All',
    },
    {
      value: 'COMPLETED',
      label: 'Completed',
    },
    {
      value: 'IN_PROGRESS',
      label: 'In Progress',
    },
    {
      value: 'PENDING',
      label: 'Pending',
    },
  ];

  const handleRefreshClick = () => {
    // window.location.reload();
    // This will reload the current page
    fetchData();
  };

  const downloadCSVFromURL = async (url, filename) => {
    // Create a hidden anchor element to trigger the download
    const anchor = document.createElement('a');
    anchor.style.display = 'none';
    document.body.appendChild(anchor);

    try {
      // Fetch the data from the URL
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Get the blob data
      const blob = await response.blob();

      // Create a Blob URL for the fetched data
      const blobUrl = window.URL.createObjectURL(blob);

      // Set the anchor's href and download attributes
      anchor.href = blobUrl;
      anchor.download = filename;

      // Trigger a click event on the anchor element to initiate the download
      anchor.click();

      // Clean up by revoking the Blob URL and removing the anchor element
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
    } finally {
      // Remove the anchor element
      document.body.removeChild(anchor);
    }
  };

  const filterObject = {
    page: page,
    pageSize: 8,
    jobIds: [],
    fileName: [],
    fileUrl: [],
    creatorType: [],
    startDate: '',
    endDate: '',
    orderBy: 'DESC',
    sourceIds: [orgId],
    sourceLocationIds: [locId],
    sourceType: [sourceType],
    ...(statusFilter !== 'ALL' && { status: [statusFilter] }),
    // status: [statusFilter],
    noOfRows: [],
    noOfRowsProcessed: [],
    blobIds: [],
  };

  const handleDownloadClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const columns = [
    {
      field: 'id',
      headerName: 'Job ID',
      minWidth: 20,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      sortable: false,
    },
    {
      field: 'createdON',
      headerName: 'Created Date',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 100,
      flex: 1,
      cellClassName: 'datagrid-rows',
      align: 'left',
      sortable: false,
    },
    {
      field: 'status',
      headerName: 'Status',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      flex: 1,
      minWidth: 100,
      cellClassName: 'datagrid-rows',
      align: 'left',
      sortable: false,
      renderCell: (cellValues, params) => {
        return (
          <div>
            {cellValues.value !== '' && (
              <Status label={cellValues?.row?.forceStop === true ? 'STOPPED' : cellValues.value} />
            )}
          </div>
        );
      },
    },
    // {
    //   field: 'progress',
    //   headerName: 'CMS Progress',
    //   headerClassName: 'datagrid-columns',
    //   headerAlign: 'left',
    //   flex: 1,
    //   minWidth: 150,
    //   cellClassName: 'datagrid-rows',
    //   align: 'left',
    //   renderCell: renderProgress,
    //   sortable: false,
    // },
    {
      field: 'noOfRows',
      headerName: 'Total Products',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      flex: 1,
      minWidth: 50,
      cellClassName: 'datagrid-rows',
      align: 'left',
      sortable: false,
    },
    {
      field: 'noOfRowsProcessed',
      headerName: 'CMS Processed Items',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      flex: 1,
      minWidth: 50,
      cellClassName: 'datagrid-rows',
      align: 'center',
      sortable: false,
    },
    // {
    //   field: 'progressInventory',
    //   headerName: 'Progress Inventory',
    //   headerClassName: 'datagrid-columns',
    //   headerAlign: 'left',
    //   flex: 1,
    //   minWidth: 150,
    //   cellClassName: 'datagrid-rows',
    //   align: 'left',
    //   renderCell: renderProgress,
    //   sortable: false,
    // },
    {
      field: 'noOfRowsProcessedInventory',
      headerName: 'Inventory Processed Items',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      flex: 1,
      minWidth: 50,
      cellClassName: 'datagrid-rows',
      align: 'center',
      sortable: false,
    },
    {
      field: 'download',
      headerName: 'Download',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      flex: 1,
      minWidth: 50,
      cellClassName: 'datagrid-rows',
      align: 'left',
      sortable: false,
      renderCell: (params) => {
        const handleClick = (event) => {
          setAnchorEl(event.currentTarget);
          setClickedRow(params.row);
        };
        return (
          <SoftBox className="print-label">
            <SaveAltIcon
              color="info"
              fontSize="medium"
              onClick={(event) => handleClick(event)}
              sx={{ cursor: 'pointer' }}
            />
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)} // Close the menu
            >
              {clickedRow.fileUrl !== null && (
                <MenuItem onClick={() => downloadCSVFromURL(clickedRow.fileUrl, 'AllProducts.csv')}>
                  Uploaded File
                </MenuItem>
              )}
              {clickedRow.savedProducts !== null && (
                <MenuItem onClick={() => downloadCSVFromURL(clickedRow.savedProducts, 'savedProducts.csv')}>
                  Saved Products CMS
                </MenuItem>
              )}
              {clickedRow.savedProductsInventory !== null && (
                <MenuItem
                  onClick={() => downloadCSVFromURL(clickedRow.savedProductsInventory, 'savedProductsInventory.csv')}
                >
                  Saved Inventory
                </MenuItem>
              )}
              {clickedRow.notSavedProducts !== null && (
                <MenuItem onClick={() => downloadCSVFromURL(clickedRow.notSavedProducts, 'notSavedProducts.csv')}>
                  Unsaved CMS
                </MenuItem>
              )}
              {clickedRow.notSavedProductsInventory !== null && (
                <MenuItem
                  onClick={() =>
                    downloadCSVFromURL(clickedRow.notSavedProductsInventory, 'notSavedProductsInventory.csv')
                  }
                >
                  Unsaved Inventory
                </MenuItem>
              )}
            </Menu>
          </SoftBox>
        );
      },
    },
    {
      field: '',
      headerName: '',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      flex: 1,
      minWidth: 50,
      cellClassName: 'datagrid-rows',
      align: 'left',
      renderCell: (params) => {
        const { status, inventoryUpload, id, noOfRows, noOfRowsProcessed, noOfRowsProcessedInventory, forceStop } =
          params.row;
        const isButtonVisible =
          !(inventoryUpload === false && status === 'COMPLETED') &&
          // !(inventoryUpload === true && noOfRowsProcessedInventory === noOfRows) &&
          forceStop === false;

        return (
          <SoftBox className="print-label">
            {isButtonVisible && ( // Conditionally render the button
              <SoftButton onClick={() => handleForceClose(id)}>Stop</SoftButton>
            )}
          </SoftBox>
        );
      },
    },
  ];

  const handleForceClose = (bulkId) => {
    const payload = {
      forceStop: true,
    };

    const newSwal = Swal.mixin({
      buttonsStyling: false, // Disable default styling if using custom classes
    });

    // Fire the Swal popup
    newSwal
      .fire({
        title: `Are you sure you want to stop this bulk job?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Stop',
        reverseButtons: true,
        customClass: {
          title: 'custom-swal-title',
          cancelButton: 'logout-cancel-btn',
          confirmButton: 'logout-success-btn',
        },
      })
      .then((result) => {
        if (result.isConfirmed) {
          stopBulkJobProducts(payload, bulkId)
            .then((res) => {
              if (res?.data?.data?.es === 1) {
                showSnackbar(res?.data?.data?.message, 'error');
              } else {
                showSnackbar('This bulk upload has been stopped', 'success');
                fetchData();
              }
            })
            .catch((err) => {
              showSnackbar('Error while stopping the bulk upload', 'error');
            });
        }
      });
  };

  let dataArr;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const fetchData = async () => {
    try {
      const res = await getAllBulkUploadProducts(filterObject);
      setTotalData(res?.data?.data?.total_results);
      setLoader(false);
      dataArr = res?.data?.data?.bulkJobList;
      const updatedDataRow = dataArr.map((item, idx) => {
        // Parse createdOn string and format it to "3 Nov 2023" format
        const createdOn = new Date(item?.createdOn);
        const formattedDate = `${createdOn.getDate()} ${months[createdOn.getMonth()]} ${createdOn.getFullYear()}`;

        return {
          id: item?.id,
          createdON: formattedDate, // Assign formatted date to createdON property
          status: item?.status,
          noOfRows: item?.noOfRows,
          noOfRowsProcessed: item?.noOfRowsProcessed,
          noOfRowsProcessedInventory: item?.noOfRowsProcessedInventory,
          fileUrl: item?.fileUrl,
          savedProducts: item?.savedProducts,
          savedProductsInventory: item?.savedProductsInventory,
          notSavedProducts: item?.notSavedProducts,
          notSavedProductsInventory: item?.notSavedProductsInventory,
          inventoryUpload: item?.inventoryUpload,
          forceStop: item?.forceStop,
        };
      });
      setData(updatedDataRow);
    } catch (error) {
      // Handle error
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchData();

    // const intervalId = setInterval(() => {
    //   fetchData();
    // }, 60000);

    // return () => clearInterval(intervalId);
  }, [filteredData, page]);

  useEffect(() => {
    const pendingItems = data?.filter((item) => item?.status === 'PENDING' || item?.status === 'IN_PROGRESS');

    if (pendingItems?.length > 0) {
      const timeoutId = setTimeout(() => {
        fetchData();
      }, 120000); // 5 seconds delay

      return () => clearTimeout(timeoutId);
    }
  }, [data]);

  return (
    <div>
      <DashboardLayout>
        <DashboardNavbar />

        <Box
          // className="table-css-fix-box-scroll-vend"
          className="search-bar-filter-and-table-container"
          style={{
            // boxShadow: 'rgba(37, 37, 37, 0.126) 0px 5px 50px',
            position: 'relative',
          }}
        >
          {/* <Box
            // sx={{ padding: '15px', backgroundColor: 'var(--search-bar-filter-container-bg)' }}
            className="search-bar-filter-container"
          >
            <Box className="header-bulk-price-edit all-products-filter-wrapper">
              <Grid container spacing={2} className="all-products-filter select-box-css">
                <Grid item lg={4} md={4} sm={6} xs={12}>
                  <Box className="all-products-filter-product">
                    <SoftSelect
                      insideHeader={true}
                      className="all-products-filter-soft-select-box"
                      placeholder="Status"
                      options={mainStatus}
                      onChange={(option, e) => {
                        setStatusFilter(option.value);
                        filterDataByStatus();
                      }}
                    />
                  </Box>
                </Grid>
                <Grid item lg={8} md={8} sm={8} xs={12}>
                  <SoftBox className="vendors-new-btn" style={{ float: 'right' }}>
                    <SoftButton variant="insideHeader" className="vendor-add-btn" onClick={handleAddBulkProducts}>
                      <AddIcon />
                      Upload
                    </SoftButton>
                    <SoftButton
                      // className="vendor-second-btn"
                      variant="insideHeader"
                      className="vendor-add-btn"
                      style={{
                        marginLeft: '20px',
                        // backgroundColor: 'var(--bg-button)',
                        // color: '#ffffff !important',
                        // border: '2px solid #ffffff !important',
                      }}
                      onClick={handleRefreshClick}
                    >
                      <BiRefresh />
                      Refresh
                    </SoftButton>
                  </SoftBox>
                </Grid>
              </Grid>
            </Box>
          </Box> */}
          <SoftBox
            className="header-bulk-price-edit all-products-filter-wrapper"
            sx={{
              padding: '15px',
              bgcolor: 'var(--search-bar-filter-container-bg)',
            }}
            // variant="gradient"
            // bgColor="info"
          >
            <Grid container spacing={2} className="all-products-filter">
              <Grid item lg={5.5} md={5.5} sm={6} xs={12}>
                <Box className="all-products-filter-product">
                  <SoftSelect
                    className="all-products-filter-soft-select-box color"
                    placeholder="Status"
                    options={mainStatus}
                    insideHeader={true}
                    onChange={(option, e) => {
                      setStatusFilter(option.value);
                      filterDataByStatus();
                    }}
                  />
                </Box>
              </Grid>
              <Grid item lg={6.5} md={6.5} sm={6} xs={12} justifyContent={'right'}>
                <SoftBox
                  className="all-products-header-new-btn"
                  display={'flex'}
                  alignItems={'left'}
                  justifyContent={'right'}
                  gap="1rem"
                >
                  <SoftButton
                    // sx={{
                    //   backgroundColor: '#0562FB !important',
                    //   color: '#ffffff !important',
                    //   border: '2px solid #ffffff !important',
                    // }}
                    variant="solidWhiteBackground"
                    // className="vendor-add-btn"
                    onClick={handleAddBulkProducts}
                  >
                    <AddIcon />
                    Upload
                  </SoftButton>
                  <SoftButton
                    // className="vendor-second-btn"
                    // sx={{
                    //   backgroundColor: '#0562FB !important',
                    //   color: '#ffffff !important',
                    //   border: '2px solid #ffffff !important',
                    //   marginInline: '10px',
                    // }}
                    variant="insideHeader"
                    onClick={handleRefreshClick}
                  >
                    <RefreshIcon />
                    Refresh
                  </SoftButton>
                </SoftBox>
              </Grid>
            </Grid>
          </SoftBox>

          <SoftBox
            py={0}
            px={0}
            sx={
              {
                // marginTop: '1rem',
              }
            }
          >
            {loader && (
              <Box
                sx={{
                  height: '70vh',
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Spinner />
              </Box>
            )}

            {!loader && (
              <SoftBox style={{ height: 525, width: '100%' }} className="dat-grid-table-box">
                <DataGrid
                  columns={columns}
                  rows={data}
                  pagination
                  paginationMode="server"
                  pageSize={pageSize}
                  rowCount={totalData} // Total number of rows
                  page={page - 1}
                  onPageChange={(newPage) => handlePageChange(newPage + 1)}
                  onPageSizeChange={handlePageSizeChange}
                  disableColumnMenu //hides the filter in table header, which is coming default from mui
                  // hides the sort icon in table header
                  sx={{
                    '.MuiDataGrid-iconButtonContainer': {
                      display: 'none',
                    },
                    borderBottomLeftRadius: '10px',
                    borderBottomRightRadius: '10px',
                  }}
                />
              </SoftBox>
            )}
          </SoftBox>
        </Box>
      </DashboardLayout>
    </div>
  );
};

export default BulkProductHistory;
