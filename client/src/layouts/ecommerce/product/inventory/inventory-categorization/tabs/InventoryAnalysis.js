import { CopyToClipBoard, noDatagif, textFormatter } from '../../../../Common/CommonFunction';
import { DataGrid } from '@mui/x-data-grid';
import { getDataAnalysis } from '../../../../../../config/Services';
import { useSnackbar } from '../../../../../../hooks/SnackbarProvider';
import { v4 as uuidv4 } from 'uuid';
import React, { useEffect, useState } from 'react';
import SoftBox from '../../../../../../components/SoftBox';
import Spinner from '../../../../../../components/Spinner';

export default function InventoryAnalysis({
  // selectedCategory,
  locationId,
  orgId,
  tabValue,
  debouncedSearchValAnalysis,
  currentSelectedCategory,
  setTotalProductCount,
  handleCellClickInventory,
}) {
  const [errorComing, setErrorComing] = useState(false);
  const showSnackbar = useSnackbar();
  const [pageState, setPageState] = useState({
    prevSelectedCategory: currentSelectedCategory,
    prevPage: 1,
    loader: false,
    dataRows: [],
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 0,
  });

  const columns = [
    {
      field: 'gtin',
      headerName: 'Barcode',
      minWidth: 150,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      renderCell: (params) => {
        return <CopyToClipBoard params={params} />;
      },
    },
    {
      field: 'name',
      headerName: 'Product Name',
      minWidth: 180,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
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
      field: 'category',
      headerName: 'Category',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 100,
      flex: 1,
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'totalAvailableUnits',
      headerName: 'Available Units',
      minWidth: 100,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    // {
    //   field: 'inventoryAnalysis',
    //   headerName: 'Inventory Analysis',
    //   headerClassName: 'datagrid-columns',
    //   headerAlign: 'left',
    //   minWidth: 100,
    //   flex: 1,
    //   cellClassName: 'datagrid-rows',
    //   align: 'left',
    // },
  ];

  const dataRow = [];
  const getInventoryAnalysis = () => {
    setErrorComing(false);

    const payload = {
      pageNo: pageState.page,
      pageSize: pageState.pageSize,
      searchBox: debouncedSearchValAnalysis,
      locationId: locationId,
      orgId: orgId,
      inventoryAnalysis: currentSelectedCategory,
      salesAnalysis: null,
      salesProfitAnalysis: null,
    };

    setPageState({ ...pageState, loader: true });

    getDataAnalysis(payload)
      .then((res) => {
        const resp = res?.data?.data?.data;
        const dataArr = resp?.data;
        if (dataArr.length > 0) {
          dataRow.push(
            dataArr?.map((row) => ({
              id: uuidv4(),
              gtin: row?.gtin,
              name: textFormatter(row?.itemName),
              brand: textFormatter(row?.brand),
              category: textFormatter(row?.category),
              inventoryAnalysis: row?.inventoryAnalysis,
              level2Category: row?.level2Category,
              locationId: row?.locationId,
              orgId: row?.orgId,
              subCategory: row?.subCategory,
              totalAvailableUnits: row?.totalAvailableUnits,
            })),
          );
          setPageState((old) => ({
            ...old,
            loader: false,
            dataRows: dataRow[0] || [],
            // page: resp.pageNumber,
            // total: resp.totalPageNumber || 0,
            total: resp.totalResults,
          }));
          setTotalProductCount(resp.totalResults);
        } else {
          showSnackbar('No Data Found', 'error');
          setPageState((old) => ({ ...old, loader: false, dataRows: [] }));
          setErrorComing(true);
          setTotalProductCount(0);
        }
      })
      .catch((err) => {
        showSnackbar('No Data Found', 'error');
        setErrorComing(true);
        setTotalProductCount(0);
      });
  };

  useEffect(() => {
    if (debouncedSearchValAnalysis) {
      // after delay of 300ms run this
      getInventoryAnalysis();
    } else {
      getInventoryAnalysis();
    }
  }, [pageState.page, pageState.prevPage, tabValue, debouncedSearchValAnalysis]);

  //for resetting pageState.page when currentSelectedCategory changes
  useEffect(() => {
    if (currentSelectedCategory !== pageState.prevSelectedCategory) {
      if (pageState.prevPage !== pageState.page) {
        // if current page is greater than 1 and the category is changed, reset page to 1
        setPageState((old) => ({ ...old, prevPage: 1, page: 1 }));
      } else {
        getInventoryAnalysis();
      }
    }
    setPageState((old) => ({ ...old, prevSelectedCategory: currentSelectedCategory }));
    // console.log('pgs', pageState);
    // console.log('csc', currentSelectedCategory);
  }, [currentSelectedCategory]);

  return (
    <div>
      <SoftBox>
        <div
          style={{
            height: 480,
          }}
        >
          {/* when page is loading show this  */}
          {pageState.loader && (
            <SoftBox className="spinner-div">
              <Spinner />
            </SoftBox>
          )}
          {errorComing && pageState.dataRows.length === 0 ? (
            <SoftBox className="No-data-text-box">
              <SoftBox className="src-imgg-data">
                <img className="src-dummy-img" src={noDatagif} />
              </SoftBox>

              <h3 className="no-data-text-I">NO DATA FOUND</h3>
            </SoftBox>
          ) : (
            !pageState.loader && (
              <DataGrid
                rows={pageState.dataRows}
                columns={columns}
                rowCount={parseInt(pageState.total)}
                loading={pageState.loader}
                pagination
                page={pageState.page - 1}
                pageSize={pageState.pageSize}
                paginationMode="server"
                onPageChange={(newPage) => {
                  setPageState((old) => ({ ...old, prevPage: pageState.page, page: newPage + 1 }));
                }}
                onPageSizeChange={(newPageSize) => setPageState((old) => ({ ...old, pageSize: newPageSize }))}
                getRowId={(row) => row.id}
                disableSelectionOnClick
                disableColumnMenu //hides the filter in table header, which is coming default from mui
                // hides the sort icon in table header
                onCellClick={(rows) => {
                  // prevent redirecting to details page when the barcode/gtin column is clicked as it contains copy barcode option
                  if (rows.field !== 'gtin') {
                    handleCellClickInventory(rows);
                  }
                }}
                sx={{
                  cursor: 'pointer',
                  '.MuiDataGrid-iconButtonContainer': {
                    display: 'none',
                  },
                  borderBottomLeftRadius: '10px',
                  borderBottomRightRadius: '10px',
                }}
              />
            )
          )}
        </div>
      </SoftBox>
    </div>
  );
}
