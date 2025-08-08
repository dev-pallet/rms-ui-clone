import React, { useEffect, useState } from 'react';
import SoftBox from '../../../../../../components/SoftBox';
import { Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { getPriceRevision } from '../../../../../../config/Services';
import Spinner from '../../../../../../components/Spinner';
import { useSnackbar } from '../../../../../../hooks/SnackbarProvider';
import UpgradePlan from '../../../../../../UpgardePlan';
import { dataGridStyles } from '../../../../Common/NewDataGridStyle';

const PriceRevisions = ({ gtin, selectedVariantBarcode, setReloadBatchDetails, reloadBatchDetails }) => {
  const [pageState, setPageState] = useState({
    loader: false,
    datRows: [],
    total: 0,
    page: 1,
    totalPages: 0,
    pageSize: 5,
  });

  const featureSettings = JSON.parse(localStorage.getItem('featureSettings'));
  const showSnackbar = useSnackbar();

  const locId = localStorage.getItem('locId');
  const orgId = localStorage.getItem('orgId');

  const columns = [
    {
      field: 'date',
      headerName: 'Date',
      minWidth: 60,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'batchNo',
      headerName: 'Batch no.',
      minWidth: 80,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'oldMrp',
      headerName: 'Old MRP',
      minWidth: 50,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'currentMrp',
      headerName: 'Current MRP',
      minWidth: 50,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'oldSellingPrice',
      headerName: 'Old Selling Price',
      minWidth: 80,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },

    {
      field: 'selling',
      headerName: 'Current Selling Price',
      minWidth: 50,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'valid',
      headerName: 'Valid Until',
      minWidth: 80,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'revisedBy',
      headerName: 'Revised By',
      minWidth: 80,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
  ];

  let dataArr,
    dataRow = [];

  const filterObject = {
    pageNumber: pageState.page,
    // pageSize: '5',
    pageSize: pageState.pageSize,
  };

  useEffect(() => {
    setPageState((old) => ({ ...old, loader: true }));

    getPriceRevision(locId, gtin, filterObject)
      .then((res) => {
        if (res?.data?.data?.es === 0) {
          // dataArr = res?.data?.data?.data;
          let dataRes = res?.data?.data?.data;
          dataArr = res?.data?.data?.data?.data;
          // dataRow.push(
          //   dataArr?.object?.map((row, i) => ({
          //     id: i,
          //     date: row?.createdOn,
          //     mrp: row?.mrp,
          //     purchase: row?.purchasePrice,
          //     selling: row?.sellingPrice,
          //     name: row?.createdBy,
          //     batchNo: row?.batchNo,
          //   })),
          // );
          dataRow.push(
            dataArr?.map((row, i) => ({
              id: i,
              date: row?.createdOn,
              oldMrp: row?.oldMrp,
              oldPrice: row?.oldPurchasePrice,
              selling: row?.sellingPrice,
              // revisedBy: row?.createdBy,
              batchNo: row?.batchNo,
              oldSellingPrice: row?.oldSellingPrice,
              revisedBy: row?.createdBy,
              currentMrp: row?.mrp,
            })),
          );
          setPageState((old) => ({
            ...old,
            loader: false,
            datRows: dataRow[0] || [],
            page: dataRes?.pageNumber || 1,
            totalPages: dataRes?.totalResults || 1,
            total: dataArr?.totalPageNumber || 0,
          }));
        }
        setPageState((old) => ({ ...old, loader: false }));
      })
      .catch((err) => {
        // showSnackbar('Failed to fetch price details', 'error');
        setPageState((old) => ({ ...old, loader: false }));
      });
  }, [pageState.page, gtin, reloadBatchDetails]);

  return (
    <div>
      <SoftBox>
        <Typography className="products-new-details-pack-typo" style={{ marginBottom: '10px' }}>
          Price Revisions
        </Typography>
        {/* <SoftBox style={{ height: 225, width: '100%', marginTop: '20px' }} className="dat-grid-table-box"> */}

        {pageState.loader && <Spinner />}
        {!pageState.loader && (
          <div
            style={{
              height: featureSettings !== null && featureSettings['PRICE_REVISION_HISTORY'] == 'FALSE' ? 525 : null,
              width: '100%',
              position: 'relative',
            }}
          >
            {featureSettings !== null && featureSettings['PRICE_REVISION_HISTORY'] == 'FALSE' ? <UpgradePlan /> : null}
            <DataGrid
              sx={{ ...dataGridStyles.header, borderRadius: '24px', cursor: 'pointer' }}
              columns={columns}
              rows={pageState.datRows}
              getRowId={(row) => row.id}
              rowCount={parseInt(pageState.totalPages)}
              loading={pageState.loader}
              pagination
              page={pageState.page - 1}
              pageSize={pageState.pageSize}
              paginationMode="server"
              // components={{
              //   Pagination: CustomPagination,
              // }}
              onPageChange={(newPage) => {
                setPageState((old) => ({ ...old, page: newPage + 1 }));
              }}
              onPageSizeChange={(newPageSize) => setPageState((old) => ({ ...old, pageSize: newPageSize }))}
              disableSelectionOnClick
              disableColumnMenu
              autoHeight
            />
          </div>
        )}
        {/* </SoftBox> */}
      </SoftBox>
    </div>
  );
};

export default PriceRevisions;
