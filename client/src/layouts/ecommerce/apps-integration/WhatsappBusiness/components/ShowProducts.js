import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Pagination, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SoftBox from '../../../../../components/SoftBox';
import SoftButton from '../../../../../components/SoftButton';
import Spinner from '../../../../../components/Spinner';
import { getAllProductsV2, getAllProductsV2New, whatsappBusinessGetProducts } from '../../../../../config/Services';
import { useSnackbar } from '../../../../../hooks/SnackbarProvider';
import { productIdByBarcode, textFormatter } from '../../../Common/CommonFunction';

const ShowProducts = ({ setSelectedTab }) => {
  const [anchorMarkupEl, setAnchorMarkupEl] = useState(null);
  const markUpOpen = Boolean(anchorMarkupEl);
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();
  const [productGTIN, setProductGTIN] = useState([]);
  const [page, setPage] = useState(1);
  const [totalData, setTotalData] = useState();
  const [pageSize, setPageSize] = useState(5); // Page size
  const [rowData1, setRowData1] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [names, setNames] = useState();

  const [noProducts, setNoProducts] = useState(false);

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
    setNoProducts(true);
    try {
      whatsappBusinessGetProducts(catalogId).then((res) => {
        const productGtinArray = res.data.data.map((product) => product.productGtin);
        setNoProducts(false);
        setProductGTIN(productGtinArray);
      });
    } catch (error) {
      setNoProducts(false);
      showSnackbar('error', 'error');
    }
  };

  useEffect(() => {
    getAllGtins();
  }, []);

  const handleProductNavigation = async (barcode) => {
    try {
      const productId = await productIdByBarcode(barcode);
      if (productId) {
        navigate(`/products/product/details/${productId}`);
      }
    } catch (error) {}
  };

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
      setLoadingData(true);
      getAllProductsV2New(filterObject1).then(function (responseTxt) {
        const dataArr = responseTxt?.data?.data?.data?.data;
        setTotalData((prevTotalData) => dataArr?.data?.totalResults);
        const newDataRow = dataArr?.map((row, index) => {
          return {
            id: index,
            image:
              row?.variants[0]?.images?.front?.trim() ||
              row?.variants[0]?.images?.back?.trim() ||
              row?.variants[0]?.images?.top_left?.trim() ||
              row?.variants[0]?.images?.top_right?.trim() ||
              d_img,
            product: textFormatter(row?.name),
            gtin: row?.variants?.flatMap((variant) => variant.barcodes).join(', ') || 'NA',
            brand: textFormatter(row?.companyDetail?.brand) || 'NA',
            productId: row?.id,
          };
        });

        setRowData1(newDataRow);
        setLoadingData(false);
      });
    }
  }, [productGTIN, page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div>
      <SoftBox className="add-catalog-products-box">
        <Typography className="whatsapp-bus-process-typo">Preview</Typography>
        {/* <Box className="all-products-filter-product" style={{paddingBottom: "20px"}}>
          <SoftInput
            className="all-products-filter-soft-input-box"
            placeholder="Search products"
            icon={{ component: 'search', direction: 'left' }}
            onChange={(e) => setNames(e.target.value)}
          />
        </Box> */}
        <SoftBox className="search-bar-filter-and-table-container">
          <SoftBox>
            {/* <Box sx={{ height: 525, width: '100%', background: '#fff' }}>
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
                  handleProductNavigation(params?.row?.gtin)
                  }
                }}
              />
            </Box> */}
            {noProducts ? (
              <Box style={{ height: 400, width: '100%', padding: '30px' }} className="dat-grid-table-box">
                <SoftBox style={{ marginTop: '20px' }} className="contacts-page-no-block">
                  <img
                    className="src-dummy-img"
                    src="https://cdn.dribbble.com/users/458522/screenshots/3571483/create.jpg?resize=800x600&vertical=center"
                  />
                  <Typography
                    style={{
                      fontWeight: '200',
                      fontSize: '1rem',
                      lineHeight: '1.5',
                      color: '#4b524d',
                      textAlign: 'center',
                    }}
                  >
                    You have not added any products. Please Add products
                  </Typography>
                  <div style={{ display: 'flex', gap: '20px' }}>
                    <SoftButton className="vendor-second-btn" onClick={() => setSelectedTab('Add')}>
                      Add Products
                    </SoftButton>
                  </div>
                </SoftBox>
              </Box>
            ) : rowData1.length === 0 ? (
              <Box style={{ height: 400, width: '100%', padding: '30px' }} className="dat-grid-table-box">
                <SoftBox style={{ marginTop: '20px' }} className="contacts-page-no-block">
                  <img
                    className="src-dummy-img"
                    src="https://cdn.dribbble.com/users/458522/screenshots/3571483/create.jpg?resize=800x600&vertical=center"
                  />
                  <Typography
                    style={{
                      fontWeight: '200',
                      fontSize: '1rem',
                      lineHeight: '1.5',
                      color: '#4b524d',
                      textAlign: 'center',
                    }}
                  >
                    The products in your catalog are not present in this location.
                  </Typography>
                  <div style={{ display: 'flex', gap: '20px' }}>
                    <SoftButton className="vendor-second-btn" onClick={() => setSelectedTab('Add')}>
                      Add Products
                    </SoftButton>
                  </div>
                </SoftBox>
              </Box>
            ) : !loadingData ? (
              <>
                <Box style={{ height: 525, width: '100%', padding: '15px' }} className="dat-grid-table-box">
                  {rowData1?.map((item) => {
                    return (
                      <div className="order-metrics-single-box">
                        <div className="order-metrics-product-left" onClick={() => handleProductNavigation(item?.gtin)}>
                          <img className="order-metrics-product-left-img" src={item.image} />
                          <div className="order-metrics-product-left-typo">
                            <Typography fontSize="11px" color="#0562fb">
                              {item.brand}
                            </Typography>
                            <Typography fontSize="14px">{item.product}</Typography>
                          </div>
                        </div>
                        <div className="order-metrics-product-right">
                          <Typography fontSize="14px">Barcode: {item.gtin}</Typography>
                          {/* <SoftButton className="vendor-second-btn">Remove</SoftButton> */}
                          <DeleteIcon sx={{ color: 'red', cursor: 'pointer' }} />
                        </div>
                      </div>
                    );
                  })}
                </Box>
                <div className="custom-pagination-component-order-metrics">
                  <Pagination
                    count={Math.ceil(totalData / pageSize)} // Corrected count
                    page={page}
                    onChange={(event, newPage) => handlePageChange(newPage)}
                    variant="outlined"
                    color="primary"
                  />
                </div>
              </>
            ) : (
              <Spinner />
            )}
          </SoftBox>
        </SoftBox>
        <SoftBox className="whatsapp-bus-button-box">
          <SoftButton className="vendor-second-btn" onClick={() => setSelectedTab('Flow')}>
            Next
          </SoftButton>
        </SoftBox>
      </SoftBox>
    </div>
  );
};

export default ShowProducts;
