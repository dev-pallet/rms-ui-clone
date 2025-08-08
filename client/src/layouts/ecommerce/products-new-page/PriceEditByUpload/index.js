import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import { Box, Chip, Grid, Menu, MenuItem, Tooltip } from '@mui/material';
import SoftBox from '../../../../components/SoftBox';
import SoftSelect from '../../../../components/SoftSelect';
import SoftButton from '../../../../components/SoftButton';
import Spinner from '../../../../components/Spinner';
import { DataGrid } from '@mui/x-data-grid';
import { useSnackbar } from '../../../../hooks/SnackbarProvider';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import Status from '../../Common/Status';
import { getBulkPriceEditList } from '../../../../config/Services';

const BulkPriceEditUploadListing = () => {
  const [allData, setAllData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [clickedRow, setClickedRow] = useState([]);
  const [page, setPage] = useState(0);
  const [totalResults, setTotalResults] = useState();
  const [statusFilter, setStatusFilter] = useState('ALL'); // Status filter
  const [filteredData, setFilteredData] = useState(allData); // Filtered data

  const [anchorEl, setAnchorEl] = useState(null);

  const showSnackbar = useSnackbar();
  const navigate = useNavigate();

  // local storage items
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const sourceType = localStorage.getItem('contextType');

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
      value: 'FAILED',
      label: 'Failed',
    },
  ];

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const downloadCSVFromURL = async (url, filename) => {
    const anchor = document.createElement('a');
    anchor.style.display = 'none';
    document.body.appendChild(anchor);

    try {
      const response = await fetch(url);
      if (!response?.ok) {
        // Optional chaining for response object
        throw new Error('Network response was not ok');
      }

      const blob = await response?.blob(); // Optional chaining for blob creation

      const blobUrl = window.URL?.createObjectURL(blob); // Optional chaining for URL API

      anchor.href = blobUrl;
      anchor.download = filename;
      anchor.click();

      window.URL?.revokeObjectURL(blobUrl); // Optional chaining for revokeObjectURL
    } catch (error) {
    } finally {
      document.body.removeChild(anchor);
    }
  };

  const chipStyle = {
    height: 'auto',
    '& .MuiChip-label': {
      fontSize: '0.75rem !Important',
    },
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
      field: 'createdBy',
      headerName: 'Created By',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      flex: 1,
      minWidth: 100,
      cellClassName: 'datagrid-rows',
      align: 'left',
      sortable: false,
      renderCell: (params) => {
        const firstLetter = params?.value ? params?.value?.charAt(0)?.toUpperCase() : '';
        const isPallet = params?.value === 'Pallet';
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div
              style={{
                backgroundColor: isPallet ? 'transparent' : 'cornflowerblue',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '8px',
                fontSize: '10px',
                color: '#fff',
              }}
            >
              {isPallet ? (
                <img
                  src="https://storage.googleapis.com/twinleaves_bucket/FrontEnd/Pallet_images/Youtube%20Channel%20Logo%20(1).png"
                  alt="Pallet"
                  style={{ width: '18px', height: '18px' }}
                />
              ) : (
                firstLetter
              )}
            </div>
            {params.value}
          </div>
        );
      },
    },
    {
      field: 'appstatus',
      headerName: 'Status',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      flex: 1,
      minWidth: 150,
      cellClassName: 'datagrid-rows',
      align: 'left',
      sortable: false,
      renderCell: (params) => {
        const reason = params?.row?.reason;
        if (params?.row?.appstatus === 'COMPLETED') {
          return <Chip label={params?.row?.appstatus || '---'} color="success" sx={chipStyle} />;
        } else if (params?.row?.appstatus === 'IN_PROGRESS') {
          return <Chip label="IN_PROGRESS" color="warning" sx={chipStyle} />;
        } else if (params?.row?.appstatus === 'FAILED') {
          return (
            <Tooltip title={reason}>
              <Chip label="FAILED" color="warning" sx={chipStyle} />
            </Tooltip>
          );
        }
      },
    },
    {
      field: 'progress',
      headerName: 'Progress',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      flex: 1,
      minWidth: 50,
      cellClassName: 'datagrid-rows',
      align: 'left',
      sortable: false,
      //   renderCell: (cellValues) => {
      //     return <div>{cellValues.value !== '' && <Status label={cellValues.value} />}</div>;
      //   },
    },

    {
      field: 'totalProducts',
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
      field: 'processed',
      headerName: 'Processed products',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      flex: 1,
      minWidth: 50,
      cellClassName: 'datagrid-rows',
      align: 'left',
      sortable: false,
    },
    {
      field: 'error',
      headerName: 'Error products',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      flex: 1,
      minWidth: 50,
      cellClassName: 'datagrid-rows',
      align: 'left',
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
              {clickedRow?.downloadUrl !== null && (
                <MenuItem onClick={() => downloadCSVFromURL(clickedRow?.downloadUrl, 'AllProducts.csv')}>
                  Uploaded File
                </MenuItem>
              )}
              {clickedRow?.errorUrl !== null && (
                <MenuItem onClick={() => downloadCSVFromURL(clickedRow?.errorUrl, 'ErrorProducts.csv')}>
                  Error Products
                </MenuItem>
              )}
            </Menu>
          </SoftBox>
        );
      },
    },
  ];

  const getAllList = () => {
    const payload = {
      locationId: locId,
      pageNumber: page,
      pageSize: 10,
    };
    setLoader(true);

    getBulkPriceEditList(payload)
      .then((res) => {
        setLoader(false);
        setTotalResults(res?.data?.data?.total || 0);
        const results = res?.data?.data?.data || [];
        const arr = results?.map((item) => {
          const createdOn = new Date(item?.created);
          const formattedDate = `${createdOn?.getDate()} ${months[createdOn?.getMonth()]} ${createdOn?.getFullYear()}`;

          return {
            id: item?.bulkPriceEditJobId,
            createdON: formattedDate,
            appstatus: item?.status,
            totalProducts: item?.totalProducts,
            processed: item?.processedProducts,
            error: item?.errorProductCount,
            downloadUrl: item?.fileUrl,
            errorUrl: item?.auditFileUrl,
            progress: `${item?.progress}%` || 0,
            createdBy: item?.createdByName,
            reason: item?.reason,
          };
        });

        setAllData(arr);
      })
      .catch((err) => {
        setLoader(false);
        showSnackbar('There was an error in fetching the list.', 'error');
      });
  };

  useEffect(() => {
    getAllList();
  }, [page]);

  const handleRefreshClick = () => {
    getAllList();
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div>
      <DashboardLayout>
        <DashboardNavbar />
        <Box
          className="search-bar-filter-and-table-container"
          style={{
            position: 'relative',
          }}
        >
          <SoftBox
            className="header-bulk-price-edit all-products-filter-wrapper"
            sx={{
              padding: '15px',
              bgcolor: 'var(--search-bar-filter-container-bg)',
            }}
          >
            <Grid container spacing={2} className="all-products-filter">
              <Grid item lg={5.5} md={5.5} sm={6} xs={12}>
                <Box className="all-products-filter-product">
                  {/* <SoftSelect
                    className="all-products-filter-soft-select-box color"
                    placeholder="Status"
                    options={mainStatus}
                    insideHeader={true}
                    onChange={(option, e) => {
                      setStatusFilter(option?.value);
                      filterDataByStatus();
                    }}
                  /> */}
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
                    variant="solidWhiteBackground"
                    onClick={() => navigate('/products/price-edit-upload/upload')}
                  >
                    <AddIcon />
                    Upload
                  </SoftButton>
                  <SoftButton variant="insideHeader" onClick={handleRefreshClick}>
                    <RefreshIcon />
                    Refresh
                  </SoftButton>
                </SoftBox>
              </Grid>
            </Grid>
          </SoftBox>

          <SoftBox py={0} px={0}>
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
                  rows={allData}
                  pagination
                  paginationMode="server"
                  pageSize={10}
                  rowCount={totalResults} // Total number of rows
                  page={page}
                  onPageChange={handlePageChange}
                  disableColumnMenu
                  onCellClick={(params) => {
                    if (params.field !== 'download' && params.row.appstatus === 'COMPLETED') {
                      navigate(`/products/price-edit-upload/details/${params.row.id}`);
                    }
                  }}
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

export default BulkPriceEditUploadListing;
