import { Box, Card, Grid, Stack, Typography, useMediaQuery } from '@mui/material';
import React, { useEffect, useState } from 'react';
import SoftTypography from '../../../components/SoftTypography';
import { getPopularProducts } from '../../../config/Services';
import DataTable from '../../../examples/Tables/DataTable';
import { useNavigate } from 'react-router-dom';
import SoftBox from '../../../components/SoftBox';
import './popularProduct.css';
import { Splide, SplideTrack, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import SplideCommon from '../../dashboards/default/components/common-tabs-carasoul';
import { DataGrid } from '@mui/x-data-grid';
import { isSmallScreen, noDatagif, productIdByBarcode, textFormatter } from '../../ecommerce/Common/CommonFunction';
import SoftSelect from '../../../components/SoftSelect';

const PopularProducts = ({ orgId, displayCards }) => {
  const columns = [
    { Header: 'Product name', accessor: 'productName', width: '25%' },
    { Header: 'Bar Code', accessor: 'gtin', width: '30%' },
    { Header: ' Units sold', accessor: 'quantity', width: '18%' },
  ];

  const cols = [
    {
      field: 'gtin',
      headerName: 'Bar Code',
      flex: 1,
      minWidth: 50,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'productName',
      headerName: 'Product Name',
      flex: 1,
      minWidth: 50,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      align: 'left',
    },

    {
      field: 'quantity',
      headerName: 'Units Sold',
      flex: 1,
      minWidth: 50,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'totalSales',
      headerName: 'total Sales',
      flex: 1,
      minWidth: 50,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'sellingPrice',
      headerName: 'Product Value',
      flex: 1,
      minWidth: 50,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      align: 'left',
    },
  ];

  const navigate = useNavigate();
  const [dataRows, setTableRows] = useState([]);
  const locId = localStorage.getItem('locId');
  const [errorComing, setErrorComing] = useState(false);

  let dataArr,
    dataRow = [];

  useEffect(() => {
    if (orgId) {
      mostPopularProduct();
    }
  }, [orgId]);

  function toCamelCase(str) {
    return str.replace(/(?:^\w|[.-_]\w)/g, function (match) {
      return match.toUpperCase().replace(/[-_.]/, '');
    });
  }
  const mostPopularProduct = () => {
    getPopularProducts(orgId, locId)
      .then((res) => {
        if (res.data.data.orderItemList.length > 0) {
          dataArr = res.data.data;
          dataRow.push(
            dataArr?.orderItemList?.map((row, index) => ({
              id: index,
              productName: row?.productName
                ? // toCamelCase(row.productName)
                  textFormatter(row?.productName)
                : '-----',
              gtin: row?.gtin ? row?.gtin : '-----',
              quantity: row?.quantityBySpecs ? row?.quantityBySpecs : '-----',
              frontImage: row?.frontImage ? row?.frontImage : '',
              sellingPrice: row?.sellingPrice || 'NA',
              totalSales: row?.totalSales || 'NA',
            })),
          );
          setTableRows(dataRow[0]);
        }
      })
      .catch((err) => {
        if (err?.response?.status === '429') {
          mostPopularProduct();
        } else {
          setErrorComing(true);
        }
      });
  };

  const handleProductNavigation = async (barcode) => {
    try {
      const productId = await productIdByBarcode(barcode);
      if (productId) {
        navigate(`/products/product/details/${productId}`);
      }
    } catch (error) {}
  };

  const handleNavigae = (row) => {
    handleProductNavigation(row);
  };

  const tableDataToShow = dataRows?.slice(0, 10);
  //mobile device
  const isMobileDevice = isSmallScreen();
  const noImage =
    'https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg';

  return (
    <Box sx={{ marginBottom: '15px' }}>
      {!isMobileDevice && !displayCards && (
        <Box className="search-bar-filter-and-table-container">
          <Grid item xs={12} lg={12}>
            <Card>
              <Box className="search-bar-filter-container" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <SoftTypography
                  style={{
                    fontSize: '0.8em',
                    marginInline: '10px',
                    marginTop: '10px',
                    color: '#ffffff',
                    fontWeight: '500',
                  }}
                >
                  Most Popular Products
                </SoftTypography>
              </Box>
              {tableDataToShow?.length > 0 ? (
                <SoftBox style={{ cursor: 'pointer' }}>
                  {/* <DataTable
            entriesPerPage={0}
            showTotalEntries={false}
            style={{ marginBottom: '20px' }}
            getRowId={(row) => row.id}
            table={{
              columns: columns,
              rows: tableDataToShow,
            }}
            rowClick={handleNavigae}
          /> */}
                  <DataGrid
                    rows={tableDataToShow || []}
                    columns={cols}
                    getRowId={(row) => row.gtin}
                    pageSize={10}
                    paginationMode="client"
                    // pagination
                    hideFooter
                    // rowCount={parseInt(markDownpg || 0)}
                    autoHeight
                    disableSelectionOnClick
                    onRowClick={(row) => handleNavigae(row?.id)}
                  />
                </SoftBox>
              ) : (
                <SoftBox className="No-data-text-box">
                  <SoftBox className="src-imgg-data">
                    <img className="src-dummy-img" src={noDatagif} />
                  </SoftBox>

                  <h3 className="no-data-text-I">NO DATA FOUND</h3>
                </SoftBox>
              )}
            </Card>
          </Grid>
        </Box>
      )}
      {isMobileDevice ||
        (tableDataToShow?.length > 0 && displayCards && (
          <SoftBox className="slider-main-div">
            {/* <SplideCommon title={'Popular Products'} isPopularProduct={true} showFilter={false}> */}
            <Typography pl="10px" fontSize="18px" fontWeight={600}>
              Popular Products
            </Typography>
            <SoftBox className="slider-main-wrapper">
              {tableDataToShow.map((product, index) => (
                <SoftBox className="splide-slide-popular-prdt">
                  <Box className="popular-prdt-main-div po-box-shadow">
                    <Box className="popular-prdt-img-div">
                      <img src={product.frontImage || noImage} alt="" className="popular-prdt-image" />
                    </Box>
                    <Typography className="popular-prdt-rank">{index + 1}</Typography>
                    <Stack alignItems="flex-start" mt={1}>
                      <Typography fontSize="16px" fontWeight={700}>
                        {product?.productName.length > 15
                          ? product?.productName.slice(0, 15) + '...'
                          : product?.productName}
                      </Typography>
                      <Typography fontSize="12px">{product.gtin || 'NA'}</Typography>
                    </Stack>
                    <Stack mt={1}>
                      <Typography fontSize="12px">Units Sold</Typography>
                      <Typography fontSize="14px" fontWeight="bold">
                        {product?.quantity || 0}
                      </Typography>
                    </Stack>
                  </Box>
                </SoftBox>
              ))}
            </SoftBox>
          </SoftBox>
        ))}
    </Box>
  );
};

export default PopularProducts;
