import React, { useEffect, useMemo, useState } from 'react';
import DashboardLayout from '../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../examples/Navbars/DashboardNavbar';
import { Box, Typography } from '@mui/material';
import SoftBox from '../../../../../components/SoftBox';
import SoftButton from '../../../../../components/SoftButton';
import Spinner from '../../../../../components/Spinner';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../../../../hooks/SnackbarProvider';
import { getAllProductsV2New } from '../../../../../config/Services';
import Status from '../../../Common/Status';
import vegImage from '../../../../../assets/images/veg.jpg';
import nonVegImage from '../../../../../assets/images/non-veg.jpg';

const CombosListing = () => {
  const [loader, setLoader] = useState(false);
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [anchorMarkupEl, setAnchorMarkupEl] = useState(null);

  const markUpOpen = Boolean(anchorMarkupEl);
  const [selectedLevel3Row, setSelectedLevel3Row] = useState(null);
  const navigate = useNavigate();
  const showSnackBar = useSnackbar();

  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const user_details = localStorage.getItem('user_details');
  let lowerCaseLocId = locId.toLocaleLowerCase();
  const d_img = 'https://i.imgur.com/dL4ScuP.png';

  // page change for the combos listing

  const handleLevel1PageChange = (newPage) => {
    setPage(newPage);
  };

  const columns = useMemo(() => [
    {
      field: 'image',
      headerName: 'Image',
      minWidth: 100,
      flex: 0.75,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      renderCell: (params) => {
        return <img src={params.value} className="all-product-image" width="60px" height="60px" />;
      },
    },
    {
      field: 'product',
      headerName: 'Product Name',
      minWidth: 230,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'status',
      headerName: 'Status',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 50,
      flex: 1,
      cellClassName: 'datagrid-rows',
      align: 'left',
      renderCell: (cellValues) => {
        return <div>{cellValues.value !== '' && <Status label={cellValues.value} />}</div>;
      },
    },
    {
      field: 'salePrice',
      headerName: 'Sale Price',
      minWidth: 50,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
    },

    {
      field: 'category',
      headerName: 'Category',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      flex: 1,
      minWidth: 150,
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'foodType',
      headerName: 'Food type',
      minWidth: 100,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      renderCell: (params) => {
        const foodType = params?.value || 'veg';
        const imageUrl = foodType?.toLowerCase() === 'veg' ? vegImage : nonVegImage;
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img src={imageUrl} alt={foodType} width="20" height="20" />
          </div>
        );
      },
    },
  ]);

  const fetchImages = (row) => {
    return row?.imageUrls?.front || row?.imageUrls?.back || row?.imageUrls?.top_left || row?.imageUrls?.right || d_img;
  };

  const getAllComboProducts = () => {
    setLoader(true);
    const payload = {
      page: page + 1,
      names: [],
      query: '',
      brands: [],
      barcode: [],
      manufacturers: [],
      appCategories: {
        categoryLevel1: [],
        categoryLevel2: [],
        categoryLevel3: [],
      },
      productStatus: [],
      preferredVendors: [],
      mergedProductShow: false,
      sortByPrice: 'DEFAULT',
      sortByCreatedAt: 'DESC',
      storeLocations: [locId],
      pageSize: 10,
      showBundles: true,
    };

    getAllProductsV2New(payload)
      .then(function (responseTxt) {
        setLoader(false);
        if (responseTxt?.data?.status === 'ERROR' || responseTxt?.data?.data?.es > 0) {
          showSnackBar(
            responseTxt?.data?.message || responseTxt?.data?.data?.message || 'There was an error fetching the data',
            'error',
          );
          return;
        } else {
          let dataRes = responseTxt?.data?.data?.data;
          let dataArr = responseTxt?.data?.data?.data?.data || [];
          setTotalPage(dataRes?.totalPages);
          const results = dataArr?.map((row, index) => {
            return {
              id: index + 1,
              category: row?.appCategories?.categoryLevel1?.[0] || 'NA',
              subCategory: row?.appCategories?.categoryLevel2?.[0] || 'NA',
              shortCode: row?.variants?.[0].shortCode || 'NA',
              foodType: row?.attributes?.foodType,
              eligibleForSale: row?.eligibleForSale,
              // productType: getProductTypeLabels(row?.productTypes) || 'NA',
              image: fetchImages(row),
              product: row?.name,
              barcode: row?.variants?.[0]?.barcodes,
              variants: row?.variants,
              completeVariants: row?.variants,
              brand: row?.companyDetail?.brand || 'NA',
              mrp: row?.variants?.[0]?.inventorySync?.mrp
                ? `₹ ${row?.variants?.[0]?.inventorySync?.mrp}`
                : row?.variants?.[0]?.mrpData?.[0]?.mrp
                ? `₹ ${row?.variants?.[0]?.mrpData?.[0]?.mrp}`
                : 'NA',
              salePrice: row?.bundlePrice ? `₹ ${row?.bundlePrice}` : 'NA',
              status: row?.isActive ? 'ACTIVE' : 'INACTIVE',
              isBundle: row?.isBundle,
              bundleBarcode: row?.bundleBarcode,
              manufacturer:
                row?.companyDetail?.name || row?.companyDetail?.manufacturer || row?.companyDetail?.manufacturerName,
              productId: row?.productId,
              availableQty:
                row?.variants?.reduce((total, variant) => {
                  return total + variant?.inventorySync?.availableQuantity;
                }, 0) || '0',
            };
          });
          setRows(results);
          setTotalRows(dataRes?.totalRecords);
        }
      })
      .catch(function (error) {
        setLoader(false);
        showSnackBar('There was an error fetching the data', 'error');
      });
  };

  useEffect(() => {
    getAllComboProducts();
  }, [page]);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Typography className="products-new-online-category-heading">Combos</Typography>

      <SoftBox className="search-bar-filter-and-table-container" style={{ marginTop: '20px' }}>
        <SoftBox className="search-bar-filter-container">
          <SoftBox>
            <Box className="all-products-filter-product" style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <SoftButton variant="solidWhiteBackground" onClick={() => navigate('/products/all-combos/create')}>
                + New
              </SoftButton>
            </Box>
          </SoftBox>
        </SoftBox>
        <SoftBox>
          <Box sx={{ height: 525, width: '100%' }}>
            {loader && <Spinner />}
            {!loader && (
              <DataGrid
                rows={rows}
                columns={columns}
                pagination
                pageSize={10}
                paginationMode="server"
                rowCount={totalRows}
                page={page}
                onPageChange={handleLevel1PageChange}
                getRowId={(row) => row?.productId}
                onCellClick={(row) => {
                  navigate(`/products/all-combos/details/${row?.row?.productId}`);
                }}
              />
            )}
          </Box>
        </SoftBox>
      </SoftBox>
    </DashboardLayout>
  );
};

export default CombosListing;
