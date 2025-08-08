import React, { useEffect, useMemo, useState } from 'react';
import DashboardLayout from '../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../examples/Navbars/DashboardNavbar';
import Spinner from '../../../../../components/Spinner';
import { Box, Card, Grid, Tab, Tabs } from '@mui/material';
import SoftBox from '../../../../../components/SoftBox';
import { DataGrid } from '@mui/x-data-grid';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from '../../../../../hooks/SnackbarProvider';
import SoftInput from '../../../../../components/SoftInput';
import SoftButton from '../../../../../components/SoftButton';
import DownloadIcon from '@mui/icons-material/Download';
import { getAllProductsBulkPriceUpload, getBulkJobBulkPriceStatus } from '../../../../../config/Services';

const BulkPriceUploadDetails = () => {
  const [allData, setAllData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [clickedRow, setClickedRow] = useState([]);
  const [tabsOrientation, setTabsOrientation] = useState('horizontal');
  // analysis tabs for inventory, sales and profit
  const [tabValue, setTabValue] = useState(0);
  const [fileUrl, setFileUrl] = useState('');
  const [auditFileUrl, setAuditFileUrl] = useState('');
  const [allPage, setAllPage] = useState(0);
  const [allErrorPage, setAllErrorPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState();

  const { id } = useParams();

  const showSnackbar = useSnackbar();
  const navigate = useNavigate();

  // local storage items
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const sourceType = localStorage.getItem('contextType');

  const [anchorEl, setAnchorEl] = useState(null);

  const columns = [
    {
      field: 'barcode',
      headerName: 'Barcode',
      minWidth: 20,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      sortable: false,
    },
    {
      field: 'productName',
      headerName: 'Product name',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 200,
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
      minWidth: 120,
      flex: 1,
      cellClassName: 'datagrid-rows',
      align: 'left',
      sortable: false,
    },
    {
      field: 'mrp',
      headerName: 'MRP',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      flex: 1,
      minWidth: 50,
      cellClassName: 'datagrid-rows',
      align: 'left',
      sortable: false,
    },
    {
      field: 'oldMrp',
      headerName: 'Old MRP',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      flex: 1,
      minWidth: 50,
      cellClassName: 'datagrid-rows',
      align: 'left',
      sortable: false,
    },
    {
      field: 'sellingPrice',
      headerName: 'Selling Price',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      flex: 1,
      minWidth: 50,
      cellClassName: 'datagrid-rows',
      align: 'left',
      sortable: false,
    },
    {
      field: 'OldSellingPrice',
      headerName: 'Old Selling price',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      flex: 1,
      minWidth: 50,
      cellClassName: 'datagrid-rows',
      align: 'left',
      sortable: false,
    },
    {
      field: 'reason',
      headerName: 'Reason',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      flex: 1,
      minWidth: 200,
      cellClassName: 'datagrid-rows',
      align: 'left',
      sortable: false,
    },
  ];

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

  const handleSetTabValue = (event, newValue) => {
    setAllPage(0);
    setTabValue(newValue);
  };

  const getJobStatus = () => {
    getBulkJobBulkPriceStatus(id)
      .then((res) => {
        setFileUrl(res?.data?.data?.bulkPriceEditJob?.fileUrl);
        setAuditFileUrl(res?.data?.data?.bulkPriceEditJob?.auditFileUrl);
      })
      .catch((err) => {
        showSnackbar('Error while fetching the data', 'error');
      });
  };

  const getAllProducts = () => {
    const payload = {
      jobId: id,
      pageSize: 10,
      pageNumber: allPage,
    };
    if (tabValue === 2) {
      payload.issue = true;
    } else if (tabValue === 1) {
      payload.issue = false;
    }
    setLoader(true);

    getAllProductsBulkPriceUpload(payload)
      .then((res) => {
        setTotalProducts(res?.data?.data?.totalProducts || 0);
        setLoader(false);
        const results = res?.data?.data?.products || [];
        const arr = results?.map((item, idx) => ({
          id: idx,
          barcode: item?.gtin,
          productName: item?.itemName,
          mrp: item?.newMrp,
          oldMrp: item?.oldMrp,
          sellingPrice: item?.newSellingPrice,
          OldSellingPrice: item?.oldSellingPrice,
          reason: item?.reason,
          status: item?.status,
        }));
        setAllData(arr);
      })
      .catch((err) => {
        setLoader(false);
        showSnackbar('Error while loading the data', 'error');
      });
  };

  useEffect(() => {
    getJobStatus();
  }, [id]);

  useEffect(() => {
    getAllProducts();
  }, [allPage, tabValue]);

  const handlePageChange = (newPage) => {
    setAllPage(newPage);
  };

  const filteredColumns = useMemo(() => {
    if (tabValue === 1) {
      return columns?.filter((column) => column?.field !== 'reason');
    }
    return columns;
  }, [tabValue]);

  return (
    <div>
      <DashboardLayout>
        <DashboardNavbar prevLink={true} />
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
            <Box style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <div>
                <Card
                  sx={{
                    backdropFilter: 'saturate(200%) blur(30px)',
                    backgroundColor: ({ functions: { rgba }, palette: { white } }) => rgba(white.main, 0.8),
                    boxShadow: ({ boxShadows: { navbarBoxShadow } }) => navbarBoxShadow,
                    padding: '0 !important',
                    borderRadius: '0.5rem',
                    width: '400px',
                  }}
                >
                  <Tabs
                    orientation={tabsOrientation}
                    value={tabValue}
                    onChange={handleSetTabValue}
                    sx={{ background: 'transparent' }}
                    className="tabs-box"
                    style={{ marginLeft: '0px', padding: '0' }}
                  >
                    <Tab sx={{ padding: '7px 0px', fontSize: '14px' }} label="All" />
                    <Tab sx={{ padding: '7px 0px', fontSize: '14px' }} label="Processed" />
                    <Tab sx={{ padding: '7px 0px', fontSize: '14px' }} label="Error" />
                  </Tabs>
                </Card>
              </div>
              <div>
                <SoftBox>
                  {(tabValue === 0 || tabValue === 2) && (
                    <SoftButton
                      variant="solidWhiteBackground"
                      onClick={() =>
                        tabValue === 0
                          ? downloadCSVFromURL(fileUrl, 'AllProducts.csv')
                          : downloadCSVFromURL(auditFileUrl, 'ErrorProducts.csv')
                      }
                    >
                      <DownloadIcon />
                      Download
                    </SoftButton>
                  )}
                </SoftBox>
              </div>
            </Box>
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
                  columns={filteredColumns}
                  rows={allData}
                  pagination
                  paginationMode="server"
                  pageSize={10}
                  rowCount={totalProducts} // Total number of rows
                  page={allPage}
                  onPageChange={handlePageChange}
                  //   onPageSizeChange={handlePageSizeChange}
                  getRowId={(row) => row.id}
                  disableColumnMenu
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

export default BulkPriceUploadDetails;
