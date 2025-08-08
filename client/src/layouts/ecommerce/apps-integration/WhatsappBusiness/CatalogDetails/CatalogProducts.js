import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { getAllProductsV2, whatsappBusinessGetProducts } from '../../../../../config/Services';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../../../../hooks/SnackbarProvider';
import React, { useEffect, useState } from 'react';
import SoftButton from '../../../../../components/SoftButton';

const CatalogProducts = () => {
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();
  const [productGTIN, setProductGTIN] = useState([]);
  const [page, setPage] = useState(1);
  const [totalData, setTotalData] = useState();
  const [pageSize, setPageSize] = useState(10); // Page size
  const [rowData1, setRowData1] = useState([]);

  const orgId = localStorage.getItem('orgId');
  const catalogId = localStorage.getItem('catalogId');
  const locId = localStorage.getItem('locId');

  const columns = [
    {
      field: 'image',
      headerName: 'Image',
      minWidth: 40,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
      renderCell: (params) => {
        return <img src={params.value} className="all-product-image" width="60px" height="60px" />;
      },
    },

    {
      field: 'product',
      headerName: 'Product',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      flex: 1,
      minWidth: 120,
      cellClassName: 'datagrid-rows',
      align: 'center',
    },

    {
      field: 'gtin',
      headerName: 'Barcode',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      flex: 1,
      minWidth: 60,
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'brand',
      headerName: 'Brand',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      flex: 1,
      minWidth: 60,
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'delete',
      headerName: '',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 40,
      cellClassName: 'datagrid-rows',
      align: 'left',
      renderCell: (params) => {
        return <SoftButton className="vendor-add-btn">Remove</SoftButton>;
      },
    },
  ];

  const getAllGtins = () => {
    try {
      whatsappBusinessGetProducts(catalogId).then((res) => {
        const productGtinArray = res.data.data.map((product) => product.productGtin);
        setProductGTIN(productGtinArray);
      });
    } catch (error) {
      showSnackbar('error', 'error');
    }
  };

  useEffect(() => {
    getAllGtins();
  }, []);

  let lowerCaseLocId = locId.toLocaleLowerCase();

  const filterObject1 = {
    page: page,
    names: [],
    brands: [],
    barcode: productGTIN,
    manufacturers: [],
    query: '',
    appCategories: {
      categoryLevel1: [],
      categoryLevel2: [],
      categoryLevel3: [],
    },
    productStatus: [],
    preferredVendors: [],
    sortByPrice: 'DEFAULT',
    // sortByCreatedAt: 'DESC',
    // displayWithoutInventoryProducts: true,
    storeLocations: [locId],
    pageSize: pageSize,
  };
  const d_img = 'https://i.imgur.com/dL4ScuP.png';

  useEffect(() => {
    // Check if productGTIN is not empty before making the API call
    if (productGTIN.length !== 0) {
      getAllProductsV2New(filterObject1).then(function (responseTxt) {
        const dataArr = responseTxt?.data?.data?.data?.data;
        setTotalData((prevTotalData) => dataArr?.data?.totalResults);
        const newDataRow = dataArr?.map((row, index) => {
          return {
            id: index,
            image: (
              row?.variants[0]?.images?.front?.trim() || 
              row?.variants[0]?.images?.back?.trim() || 
              row?.variants[0]?.images?.top_left?.trim() || 
              row?.variants[0]?.images?.top_right?.trim()
            ) || d_img,
            product: textFormatter(row?.name),
            gtin: row?.variants?.flatMap(variant => variant.barcodes).join(', ') || 'NA',
            brand: textFormatter(row?.companyDetail?.brand) || 'NA',
            productId: row?.id,
          };
        });

        setRowData1((prevData) => [...prevData, ...newDataRow]);
      });
    }
  }, [productGTIN, page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div>
      <Box sx={{ height: 525, width: '100%', background: '#fff' }}>
        <DataGrid
          columns={columns}
          rows={rowData1 ? rowData1 : []}
          pagination
          pageSize={pageSize}
          paginationMode="server"
          rowCount={totalData} // Total number of rows
          page={page - 1}
          onPageChange={(newPage) => handlePageChange(newPage + 1)}
          disableSelectionOnClick
          getRowId={(row) => row.id}
          onCellClick={(params) => {
            // Check if the clicked column index is less than 4 (first 4 columns)
            if (params.field !== 'Add') {
              navigate(`/products/product/details/${params.row.productId}`);
            }
          }}
        />
      </Box>
    </div>
  );
};

export default CatalogProducts;
