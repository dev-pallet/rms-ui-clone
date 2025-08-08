import React, { useEffect, useRef, useState } from 'react';
import DashboardLayout from '../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../examples/Navbars/DashboardNavbar';
import SoftBox from '../../../../../components/SoftBox';
import { CopyToClipBoardValue, epochToIST, isSmallScreen } from '../../../Common/CommonFunction';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../../../../hooks/SnackbarProvider';
import { Grid, IconButton, Popover, Typography } from '@mui/material';
import SoftInput from '../../../../../components/SoftInput';
import SoftButton from '../../../../../components/SoftButton';
import AddIcon from '@mui/icons-material/Add';
import SoftTypography from '../../../../../components/SoftTypography';
import Filter from '../../../Common/Filter';
import { DataGrid } from '@mui/x-data-grid';
import { getAllProductsV2New } from '../../../../../config/Services';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import Spinner from '../../../../../components/Spinner';
import { noDatagif } from '../../../Common/CommonFunction';
import { Box, Button, Container } from '@mui/material';

const ProductApproval = () => {
  const locId = localStorage.getItem('locId');
  const [pageData, setPageData] = useState({ page: 1, pageSize: 10, total: 0, loading: false });
  const [totalRows, setTotalRows] = useState(1);
  const isMobileDevice = isSmallScreen();
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();
  const [dataRows, setDataRows] = useState([]);
  const [openDropdowns, setOpenDropdowns] = useState({});
  const popoverAnchorRefs = useRef({});
  const toggleDropdown = (rowId) => {
    setOpenDropdowns((prevState) => ({
      ...prevState,
      [rowId]: !prevState[rowId],
    }));
  };

  function extractProductData(products) {
    const data = products?.map((product) => ({
      id: product?.id,
      date: epochToIST(product?.created || ''),
      name: product?.name || '',
      variants: product?.variants,
      brand: product?.companyDetail?.brand || 'NA',
      storeLocation: product?.storeSpecificData?.storeLocationId || 'NA',
      vendorStatus: product?.vendorStatus || 'NA',
      salesStatus: product?.status || 'NA',
      addedBy: product?.createdByName || 'NA',
      isBundle: product?.isBundle,
    }));
    setDataRows(data || []);
  }

  // useEffect(() => {
  //   const payload = {
  //     page: pageData?.page,
  //     pageSize: pageData?.pageSize,
  //     storeLocationId: locId.toLocaleLowerCase(),
  //     sortByCreatedAt: 'DESC',
  //   };
  //   setPageData((prevData) => ({
  //     ...prevData,
  //     loading: true,
  //   }));
  //   getAllProductsV2New(payload)
  //     .then((res) => {
  //       setTotalRows(res?.data?.data?.data?.totalPages);
  //       setPageData((prevData) => ({
  //         ...prevData,
  //         total: res?.data?.data?.data?.totalRecords,
  //       }));
  //       const products = res?.data?.data?.data?.data;
  //       const extractedData = extractProductData(products);
  //       setPageData((prevData) => ({
  //         ...prevData,
  //         loading: false,
  //       }));
  //     })
  //     .catch(() => {
  //       setPageData((prevData) => ({
  //         ...prevData,
  //         loading: false,
  //       }));
  //     });
  // }, [pageData?.page]);

  const handleRowNavigate = (row) => {
    if (row?.isBundle) {
      navigate(`/products/edit-bundle/${row?.id}`);
    } else {
      navigate(`/products/edit-product/${row?.id}`);
    }
  };

  const columns = [
    {
      field: 'date',
      headerName: 'Date',
      minWidth: 110,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'name',
      headerName: 'Product title',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 150,
      flex: 1,
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'variants',
      headerName: 'Barcode',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      flex: 1,
      minWidth: 200,
      cellClassName: 'datagrid-rows',
      align: 'left',
      renderCell: (params) => {
        const rowId = params.id;
        const variants = params.row?.variants || [];
        const barcodes = variants.flatMap((variant) => variant.barcodes || []);
        const firstBarcode = barcodes.length > 0 ? barcodes[0] : 'NA';
        const hasMultipleVariants = variants.length > 1;

        return (
          <div>
            {firstBarcode}
            {hasMultipleVariants && (
              <>
                <IconButton
                  ref={(el) => {
                    if (el) popoverAnchorRefs.current[rowId] = el;
                  }}
                  onClick={() => toggleDropdown(rowId)}
                  size="small"
                >
                  {openDropdowns[rowId] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
                <Popover
                  open={Boolean(openDropdowns[rowId])}
                  anchorEl={popoverAnchorRefs.current[rowId]}
                  onClose={() => toggleDropdown(rowId)}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                  }}
                  PaperProps={{ style: { backgroundColor: '#ffffff', boxShadow: '0px 8px 16px rgba(0,0,0,0.1)' } }}
                >
                  <div style={{ padding: '10px' }}>
                    {barcodes.map((barcode, index) => (
                      <div key={index} style={{ marginBottom: '5px', fontSize: '12px', display: 'flex', gap: '5px' }}>
                        <Typography style={{ fontSize: '12px' }}>{barcode}</Typography>
                        <CopyToClipBoardValue params={barcode} />
                      </div>
                    ))}
                  </div>
                </Popover>
              </>
            )}
          </div>
        );
      },
    },
    {
      field: 'brand',
      headerName: 'Brand',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 100,
      flex: 1,
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'vendorStatus',
      headerName: 'Vendor status',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 110,
      flex: 1,
      width: 200,
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'salesStatus',
      headerName: 'Sales Status',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 100,
      flex: 1,
      width: 200,
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'addedBy',
      headerName: 'Added By',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 150,
      flex: 1,
      width: 200,
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Container
        maxWidth="xl"
        sx={{
          height: '85vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          // backgroundColor: '#f5f5f5',
          flexDirection: 'column',
          textAlign: 'center',
        }}
      >
        {/* Replace with your background image or add styles for the page */}
        <Box
          component="img"
          src="https://storage.googleapis.com/twinleaves_dev_public/pallet/cms/product/upload/images/ae2f3b32-71f7-4739-af61-a539e0c24362/image1"
          alt="Coming Soon"
          sx={{
            maxWidth: '400px',
            width: '100%',
            marginBottom: '20px',
          }}
        />
        <Typography
          variant="h2"
          sx={{
            fontWeight: 'bold',
            marginBottom: '20px',
            background: 'linear-gradient(90deg, #FF6B6B, #FFD93D)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            animation: 'pulse 2s infinite',
          }}
        >
          Coming Soon
        </Typography>
        <SoftTypography
          sx={{
            marginBottom: '30px',
            color: '#555',
            fontSize: '1.2rem',
            letterSpacing: '0.05em',
            lineHeight: '1.5',
            fontStyle: 'italic',
            animation: 'fadeIn 2s ease-in-out',
          }}
        >
          we are working on this feature so its ready for you. Wait for us.{' '}
        </SoftTypography>
      </Container>
    </DashboardLayout>
  );
  return (
    <div>
      <DashboardLayout>
        <DashboardNavbar />
        <SoftTypography style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Product approvals</SoftTypography>
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
                      placeholder="Search Product"
                      icon={{ component: 'search', direction: 'left' }}
                    />
                  </SoftBox>
                </SoftBox>
              </Grid>

              <Grid item>
                <SoftBox className="content-space-between">
                  <SoftBox className="vendors-new-btn"></SoftBox>
                  <Filter />
                </SoftBox>
              </Grid>
            </Grid>
          </SoftBox>

          <SoftBox>
            <div
              style={{
                width: '100%',
              }}
            >
              {pageData?.loading ? (
                <div style={{ height: '50vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Spinner size={24} />
                </div>
              ) : (
                <>
                  {' '}
                  {!dataRows?.length ? (
                    <SoftBox className="No-data-text-box">
                      <SoftBox className="src-imgg-data">
                        <img className="src-dummy-img" src={noDatagif} />
                      </SoftBox>
                      <h3 className="no-data-text-I">NO DATA FOUND</h3>
                    </SoftBox>
                  ) : (
                    <SoftBox
                      // py={0}
                      // px={0}
                      // p={'15px'}
                      style={{ height: 525, width: '100%' }}
                      className="dat-grid-table-box"
                    >
                      <DataGrid
                        rows={dataRows || []}
                        className="data-grid-table-boxo"
                        rowsPerPageOptions={[10]}
                        getRowId={(row) => row.id || row.name}
                        rowHeight={45}
                        hideScrollbar={true}
                        onCellClick={(rows) => {
                          // prevent redirecting to details page when the barcode/gtin column is clicked as it contains copy barcode option
                          if (rows.field !== 'variants') {
                            handleRowNavigate(rows?.row);
                          }
                        }}
                        columns={columns}
                        rowCount={parseInt(pageData?.total || 0)}
                        pagination
                        page={pageData?.page - 1}
                        // rowsPerPageOptions={[50]}
                        pageSize={pageData?.pageSize}
                        paginationMode="server"
                        onPageChange={(newPage) => {
                          if (!pageData?.loading) {
                            setPageData((old) => ({ ...old, page: newPage + 1 }));
                          }
                          //   dispatch2(setAllProductsPage(newPage + 1));
                        }}
                        loading={pageData?.loading}
                      />
                    </SoftBox>
                  )}
                </>
              )}
            </div>
          </SoftBox>
        </SoftBox>
      </DashboardLayout>
    </div>
  );
};

export default ProductApproval;
