import { Box, Card, Grid, Stack, Typography, useMediaQuery } from '@mui/material';
import React, { useEffect, useState } from 'react';
import SoftTypography from '../../../components/SoftTypography';
import { getPopularProducts, getSlowMovingInventory } from '../../../config/Services';
import DataTable from '../../../examples/Tables/DataTable';
import { useNavigate } from 'react-router-dom';
import SoftBox from '../../../components/SoftBox';
import './popularProduct.css';
import { Splide, SplideTrack, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import SplideCommon from '../../dashboards/default/components/common-tabs-carasoul';
import { DataGrid } from '@mui/x-data-grid';
import { isSmallScreen, noDatagif, productIdByBarcode, textFormatter } from '../../ecommerce/Common/CommonFunction';
import Filter from '../../ecommerce/Common/Filter';
import SoftSelect from '../../../components/SoftSelect';

const SlowMovingInventory = ({ orgId, displayCards }) => {
  const cols = [
    {
      field: 'gtin',
      headerName: 'Bar code',
      flex: 1,
      minWidth: 50,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'itemName',
      headerName: 'Product Name',
      flex: 1,
      minWidth: 50,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'totalAvailableUnits',
      headerName: 'Available Units',
      flex: 1,
      minWidth: 50,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'totalQuantityUnits',
      headerName: 'Total Quantity',
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
      slowMovingInventory();
    }
  }, [orgId]);

  function toCamelCase(str) {
    return str.replace(/(?:^\w|[.-_]\w)/g, function (match) {
      return match.toUpperCase().replace(/[-_.]/, '');
    });
  }

  const slowMovingInventory = () => {
    const currentDate = new Date();
    const numberOfDays = 7;
    const previousWeekDates = [];
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const formatter = new Intl.DateTimeFormat('en-US', options);
    for (let i = numberOfDays - 1; i >= 0; i--) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() - i);
      const formattedDate = formatter.format(date);
      const [month, day, year] = formattedDate.split('/');
      const formattedDateString = `${year}-${month}-${day}`;
      const weekdayName = date.toLocaleDateString('en-US', { weekday: 'long' });
      previousWeekDates.push({
        date: formattedDateString,
        weekday: weekdayName,
      });
    }

    getSlowMovingInventory(orgId, locId, previousWeekDates[0].date, previousWeekDates[6].date)
      .then((res) => {
        if (res?.data?.data?.es === 0) {
          const result = res?.data?.data?.data?.data?.map((item) => ({
            ...item,
            itemName: textFormatter(item?.itemName),
          }));
          setTableRows(result);
        } else {
          setTableRows([]);
        }
      })
      .catch(() => {});
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

  const tableDataToShow = dataRows?.slice(0, 10) || [];
  //mobile device
  const isMobileDevice = isSmallScreen();
  const noImage =
    'https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg';

  // filters
  const filterSelect = (
    <>
      <SoftBox
        sx={{
          width: '100%',
          paddingLeft: '10px',
          paddingRight: '10px',
        }}
      >
        <SoftSelect
          sx={{
            width: '100%',
          }}
          placeholder="Daily"
          options={[
            { value: 'SMS', label: 'Daily' },
            { value: 'SMS', label: 'Weekly' },
            { value: 'SMS', label: 'Monthly' },
            { value: 'SMS', label: 'Yearly' },
          ]}
        />
      </SoftBox>
    </>
  );

  // select boxes array to pass as prop to Filter component
  const selectBoxArray = [filterSelect];

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
                  Slow Moving Inventory
                </SoftTypography>
                {/* filter */}
                {/* <Box>
                  <Filter selectBoxArray={selectBoxArray} />
                </Box> */}
              </Box>

              {tableDataToShow?.length > 0 ? (
                <Box style={{ height: 580, width: '100%' }} className="dat-grid-table-box">
                  <DataGrid
                    rows={tableDataToShow || []}
                    columns={cols}
                    getRowId={(row) => row?.gtin}
                    pageSize={10}
                    paginationMode="client"
                    // pagination
                    hideFooter
                    // rowCount={parseInt(markDownpg || 0)}
                    className="data-grid-table-boxo"
                    autoHeight
                    disableSelectionOnClick
                    onRowClick={(row) => handleNavigae(row?.id)}
                  />
                </Box>
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
            {!displayCards && (
              <Typography pl="10px" fontSize="18px" fontWeight={600}>
                Slow Moving Inventory
              </Typography>
            )}
            <SoftBox className="slider-main-wrapper">
              {tableDataToShow?.map((product, index) => (
                <SoftBox className="splide-slide-popular-prdt">
                  <Box className="popular-prdt-main-div po-box-shadow">
                    <Box className="popular-prdt-img-div">
                      <img src={product?.frontImage || noImage} alt="" className="popular-prdt-image" />
                    </Box>
                    <Typography className="popular-prdt-rank">{index + 1}</Typography>
                    <Stack alignItems="flex-start" mt={1}>
                      <Typography fontSize="16px" fontWeight={700}>
                        {product?.itemName?.length > 15 ? product?.itemName?.slice(0, 15) + '...' : product?.itemName}
                      </Typography>
                      <Typography fontSize="12px">{product?.gtin || 'NA'}</Typography>
                    </Stack>
                    <Stack mt={1}>
                      <Typography fontSize="12px">Available Units</Typography>
                      <Typography fontSize="14px" fontWeight="bold">
                        {product?.totalAvailableUnits || 0}
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

export default SlowMovingInventory;
