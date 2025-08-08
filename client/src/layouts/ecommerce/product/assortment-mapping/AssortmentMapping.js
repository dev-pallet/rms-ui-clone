import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import SoftTypography from '../../../../components/SoftTypography';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Box, Card, Checkbox, Grid, InputLabel, Modal, Skeleton, Tooltip, Typography } from '@mui/material';
import SoftSelect from '../../../../components/SoftSelect';
import { dataGridStyles } from '../../Common/NewDataGridStyle';
import { DataGrid } from '@mui/x-data-grid';
import SoftButton from '../../../../components/SoftButton';
import {
  fetchAssortmentMappingProducts,
  fetchOrganisations,
  getAllBrands,
  getAllProductsV2New,
  saveAssortmentMapping,
} from '../../../../config/Services';
import CategoryIcon from '@mui/icons-material/Category';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CategoryAssortment from './CategoryAssortment';
import ManufactureAssortment from './ManufactureAssortment';
import SelectProductModal from './SelectProductModal';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../../../hooks/SnackbarProvider';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  // width: '95vw',
  maxHeight: '100vh',
  minHeight: '30vh',
  bgcolor: 'background.paper',
  border: '1px solid gray',
  borderRadius: '10px',
  boxShadow: 14,
  p: 3,
};
const AssortmentMapping = () => {
  const uidx = JSON.parse(localStorage.getItem('user_details')).uidx;
  const userName = localStorage.getItem('user_name');
  const showSnackbar = useSnackbar();
  const [displayStoreOptions, setDisplayStoreOptions] = useState([]);
  const orgId = localStorage.getItem('orgId');
  const [selectedGrouping, setSelectedGrouping] = useState([]);
  const [dataRows, setDataRows] = useState([]);
  const locId = localStorage.getItem('locId');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(100);
  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [brandRows, setBrandRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [brandProductLoader, setBrandProductLoader] = useState(false);
  const [selectedFromLoc, setSelectedFromLoc] = useState();
  const [selectedToLoc, setSelectedToLoc] = useState([]);
  const [brandRowCount, setBrandRowCount] = useState(0);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  // New modal state and handlers for "Next Step" confirmation
  const [nextStepModalOpen, setNextStepModalOpen] = useState(false);
  const handleNextStepModalOpen = () => setNextStepModalOpen(true);
  const handleNextStepModalClose = () => setNextStepModalOpen(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [productPage, setProductPage] = useState(1);
  const [selectedBrand, setSelectedBrand] = useState();
  const navigate = useNavigate();
  const columns = [
    {
      field: 'brandName',
      headerName: 'Brand name',
      flex: 1,
      minWidth: 50,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'totalProducts',
      headerName: 'Total products',
      flex: 1,
      minWidth: 50,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      align: 'left',
      renderCell: (params) => {
        return (
          <Tooltip title="View products" placement="right">
            <SoftTypography
              sx={{
                // backgroundColor: '#0562FB',
                cursor: 'pointer',
                fontSize: '0.75rem',
              }}
              onClick={handleOpen}
            >
              {params?.row?.totalProducts}
            </SoftTypography>
          </Tooltip>
        );
      },
    },

    {
      field: 'totalVariants',
      headerName: 'Total variants',
      flex: 1,
      minWidth: 50,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'vendorAvailablity',
      headerName: 'Vendor availability',
      flex: 1,
      minWidth: 50,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'manufacturer',
      headerName: 'Manufacturer',
      flex: 1,
      minWidth: 50,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      align: 'left',
    },
  ];

  useEffect(() => {
    fetchOrganisations()
      .then((res) => {
        const retailData = res?.data?.data?.retails;
        const matchedRetail = retailData?.find((retail) => retail?.retailId === orgId);
        const branches = matchedRetail?.branches?.map((item) => ({ value: item?.branchId, label: item?.displayName }));
        setDisplayStoreOptions(branches || []);
      })
      .catch(() => {});
  }, []);

  // fetching data for brand table
  const handleFetchProductData = (data) => {
    const payload = {
      type: 'BRAND',
      value: data?.map((item) => item?.brandName) || [],
      storeId: locId,
    };
    fetchAssortmentMappingProducts(payload)
      .then((res) => {
        const response = res?.data?.data?.data;

        if (response && response.startsWith('Aggregate: ')) {
          const parsedData = JSON.parse(response.replace('Aggregate: ', ''));
          const formatedData = parsedData.buckets.reduce((acc, bucket) => {
            acc[bucket.key] = {
              totalProducts: bucket.doc_count,
              totalVariants: bucket['sum#totalVariantCount'].value,
              vendorAvailablity: 'NA',
              manufacturer: 'NA',
            };
            return acc;
          }, {});

          const testData2 = data?.map((item) => {
            const formattedItem = formatedData[item?.brandName] || {};
            return {
              id: item?.brandId,
              brandName: item?.brandName,
              totalProducts: formattedItem?.totalProducts || 'NA',
              totalVariants: formattedItem?.totalVariants || 'NA',
              vendorAvailablity: formattedItem?.vendorAvailablity || 'NA',
              manufacturer: formattedItem?.manufacturer || 'NA',
            };
          });

          setDataRows(testData2 || []);
        } else {
          setDataRows([]);
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching assortment mapping products:', err);
      });
  };

  // useEffect(() => {
  //   handleFetchProductData();
  // }, []);

  useEffect(() => {
    const isBrand = selectedGrouping?.value === 'Brand';
    if (!selectedFromLoc?.value && isBrand) {
      showSnackbar('Select Source location', 'warning');
      return;
    }
    if (isBrand) {
      setLoading(true);
      const brandPayload = {
        page: currentPage,
        pageSize: 10,
        sourceId: [orgId],
        sourceLocationId: [selectedFromLoc?.value],
        sortByCreatedDate: 'DESCENDING',
        active: [true],
      };
      getAllBrands(brandPayload)
        .then((res) => {
          setBrandRowCount(res?.data?.data?.totalResults || 0);
          const data = res?.data?.data?.results?.map((item) => ({
            brandId: item?.brandId,
            brandName: item?.brandName,
          }));

          handleFetchProductData(data);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [selectedGrouping, currentPage]);

  const handleFetchBrandData = (brand) => {
    setSelectedBrand(selectedBrand ? selectedBrand : brand);
    setBrandProductLoader(true);
    // fetching products for respective brand
    const payload = {
      page: 1,
      pageSize: 10,
      names: [],
      brands: [brand ? brand?.row?.brandName : selectedBrand?.row?.brandName],
      barcode: [],
      manufacturers: [],
      appCategories: {
        categoryLevel1: [],
        categoryLevel2: [],
        categoryLevel3: [],
      },
      productStatus: [],
      preferredVendors: [],
      sortByPrice: 'DEFAULT',
      sortByCreatedAt: 'DESC',
      storeLocations: [locId],
    };
    getAllProductsV2New(payload)
      .then((res) => {
        const data = res?.data?.data?.data?.data;
        const count = res?.data?.data?.data?.totalResults || 0;
        setTotalResults(count || 0);
        const formatedRows = data?.map((item) => ({
          productId: item?.id,
          uom: item?.unitOfMeasure,
          name: item?.name,
          brand: item?.companyDetail?.brand,
          mrp: item?.variants?.[0]?.mrpData?.[0]?.mrp || 'NA',
          barcode: item?.variants?.[0]?.barcodes?.[0] || 'NA',
        }));
        setBrandRows(formatedRows || []);
        setBrandProductLoader(false);
      })
      .catch(() => {
        setBrandProductLoader(false);
      });
  };

  useEffect(() => {
    if (selectedBrand) {
      handleFetchBrandData();
    }
  }, []);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage + 1);
  };

  const handleRowClick = (row) => {
    const selectedIndex = selectedRows?.indexOf(row);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = [...selectedRows, row];
    } else if (selectedIndex === 0) {
      newSelected = [...selectedRows.slice(1)];
    } else if (selectedIndex === selectedRows.length - 1) {
      newSelected = [...selectedRows.slice(0, -1)];
    } else if (selectedIndex > 0) {
      newSelected = [...selectedRows.slice(0, selectedIndex), ...selectedRows.slice(selectedIndex + 1)];
    }

    setSelectedRows(newSelected);
  };

  const isSelected = (row) => {
    return selectedRows?.some((selectedRow) => selectedRow.productId === row.productId);
  };
  const handleSelectionModelChange = (newSelectionModel) => {
    setSelectedRowIds((prevRowIds) => {
      // Create a Set from the new selection for quick lookup
      const newSelectionSet = new Set(newSelectionModel);

      // Merge previous and new selections, allowing for deselection
      const updatedSelection = [
        ...prevRowIds.filter((id) => newSelectionSet.has(id) || !newSelectionSet.has(id)),
        ...newSelectionModel.filter((id) => !prevRowIds.includes(id)),
      ];

      // Remove deselected rows
      const finalSelection = updatedSelection.filter((id) => newSelectionSet.has(id) || prevRowIds.includes(id));

      return finalSelection;
    });
  };
  const handlePageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to the first page when changing page size
  };

  const handleCreateAssortmentMapping = () => {
    if (isDisabled) {
      return;
    }
    setIsDisabled(true);
    handleNextStepModalOpen();
    const payload = {
      storeModels: [
        {
          sourceId: orgId,
          sourceName: orgId,
          sourceLocationId: selectedToLoc?.value,
          sourceLocationName: selectedToLoc?.value,
          sourceType: 'RETAIL',
        },
      ],
      copyFromStoreLocationId: selectedFromLoc?.value,
      productFilterModelV2: {
        storeLocationId: locId,
        ids: selectedRows?.map((item) => item?.productId),
        // brands: selectedRowIds?.map((item) => item?.brand),
        brands: selectedRowIds,
      },
      createdBy: uidx,
      createdByName: userName,
    };
    saveAssortmentMapping(payload)
      .then((res) => {
        setIsDisabled(false);
        handleNextStepModalClose();
      })
      .catch(() => {
        setIsDisabled(false);
        handleNextStepModalClose();
      });
  };

  const filteredDestinationOptions = displayStoreOptions?.filter((option) => option?.value !== selectedFromLoc?.value);

  const filteredSourceOptions = displayStoreOptions?.filter((option) => option?.value !== selectedToLoc?.value);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div>
        <SelectProductModal
          open={open}
          handleClose={handleClose}
          brandRows={brandRows}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          brandProductLoader={brandProductLoader}
          handleRowClick={handleRowClick}
          isSelected={isSelected}
          style={style}
          totalCount={totalResults}
          setPage={setProductPage}
          page={productPage}
        />
        <Modal
          open={nextStepModalOpen}
          onClose={handleNextStepModalClose}
          aria-labelledby="next-step-modal-title"
          aria-describedby="next-step-modal-description"
          sx={{
            '& > .MuiBackdrop-root': {
              backdropFilter: 'blur(5px)',
            },
          }}
        >
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            sx={{ ...style, background: 'linear-gradient(135deg, #ffffff, #f0f0f0)', border: '2px solid lavender' }}
          >
            <video
              src="https://cdnl.iconscout.com/lottie/premium/thumb/data-transfer-9563375-7813496.mp4"
              alt="loading"
              style={{ maxHeight: '150px', maxWidth: '80vw' }}
              autoPlay
              loop
              muted
            />
            <SoftTypography variant="h6" fontWeight="bold" fontSize="1rem">
              {`Copying data from ${selectedFromLoc?.label} to ${selectedToLoc?.label}`}
            </SoftTypography>
          </Box>
        </Modal>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <SoftTypography fontWeight="bold" fontSize="1.1rem">
          Assortment mapping
        </SoftTypography>
      </div>
      <Card className="addbrand-Box" style={{ margin: '15px 0px 15px 0px' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <div className="select-wrapper">
              <InputLabel className="labeltitle" required>
                Select source
              </InputLabel>

              <SoftSelect
                size="small"
                options={filteredSourceOptions || []}
                value={selectedFromLoc}
                onChange={(e) => setSelectedFromLoc(e)}
              ></SoftSelect>
            </div>
          </Grid>
          <Grid item xs={12} md={4}>
            <div className="select-wrapper">
              <InputLabel className="labeltitle" required>
                Select Destination
              </InputLabel>

              <SoftSelect
                size="small"
                options={filteredDestinationOptions || []}
                value={selectedToLoc}
                onChange={(e) => setSelectedToLoc(e)}
              ></SoftSelect>
            </div>
          </Grid>
          <Grid item xs={12} md={4}>
            <div className="select-wrapper">
              <InputLabel className="labeltitle" required>
                Product Grouping
              </InputLabel>

              <SoftSelect
                size="small"
                options={[
                  { value: 'Brand', label: 'Brand' },
                  { value: 'Category', label: 'Category' },
                  { value: 'Manufacturer', label: 'Manufacturer' },
                  // { value: 'Vendor availability', label: 'Vendor availability' },
                  // { value: 'Department', label: 'Department' },
                ]}
                onChange={(e) => setSelectedGrouping(e)}
              ></SoftSelect>
            </div>
          </Grid>
        </Grid>
      </Card>
      <br />
      <Card className="vendorTablestyle">
        {!selectedGrouping?.value && (
          <Card className="vendorCardShadow" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
              <div>
                <CategoryIcon color="#0562FB" fontSize="30px" />
              </div>
              <SoftTypography fontSize="14px" fontWeight="bold" variant="caption">
                Select Product Grouping to display products
              </SoftTypography>
            </div>
          </Card>
        )}

        {selectedGrouping?.value === 'Brand' && (
          <Box>
            <DataGrid
              sx={{ ...dataGridStyles.header, borderRadius: '20px' }}
              rows={dataRows || []}
              columns={columns}
              getRowId={(row) => row.id}
              pageSize={10}
              // pagination
              // hideFooter
              // rowCount={parseInt(markDownpg || 0)}
              // onRowClick={(row) => handleNavigae(row?.id)}
              loading={loading}
              pagination
              paginationMode="server"
              rowsPerPageOptions={[]}
              rowCount={parseInt(brandRowCount || 0)}
              onPageChange={handlePageChange}
              // onPageSizeChange={handlePageSizeChange}
              autoHeight
              disableSelectionOnClick
              checkboxSelection
              onSelectionModelChange={handleSelectionModelChange}
              selectionModel={selectedRowIds}
              localeText={{
                footerRowSelected: () => '',
              }}
              onRowClick={(row) => handleFetchBrandData(row)}
            />
          </Box>
        )}

        {selectedGrouping?.value === 'Category' && (
          <CategoryAssortment selectedFromLoc={selectedFromLoc || {}} selectedToLoc={selectedToLoc || {}} />
        )}
        {selectedGrouping?.value === 'Manufacturer' && <ManufactureAssortment />}
      </Card>
      <br />
      {selectedGrouping?.value === 'Brand' && (
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <SoftButton variant="outlined" color="info" onClick={() => navigate(-1)}>
            Cancel
          </SoftButton>
          <SoftButton color="info" onClick={handleCreateAssortmentMapping}>
            Next
          </SoftButton>
        </div>
      )}

      <br />
    </DashboardLayout>
  );
};

export default AssortmentMapping;
