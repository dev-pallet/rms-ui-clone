import { CopyToClipBoard } from '../../../Common/CommonFunction';

export const inventoryColumns = [
  {
    field: 'title',
    headerName: 'Title',
    headerClassName: 'datagrid-columns',
    headerAlign: 'left',
    cellClassName: 'datagrid-rows',
    align: 'left',
    minWidth: 200,
    flex: 1,
  },
  {
    field: 'barcode',
    headerName: 'Barcode',
    headerClassName: 'datagrid-columns',
    headerAlign: 'left',
    cellClassName: 'datagrid-rows',
    align: 'left',
    minWidth: 150,
    flex: 1,
    renderCell: (params) => {
      return <CopyToClipBoard params={params} />;
    },
  },
  {
    field: 'classification',
    headerName: 'Classification',
    headerClassName: 'datagrid-columns',
    headerAlign: 'left',
    cellClassName: 'datagrid-rows',
    align: 'left',
    minWidth: 70,
    flex: 1,
  },
  {
    field: 'stockTurnover',
    headerName: 'Stock Turnover',
    headerClassName: 'datagrid-columns',
    headerAlign: 'left',
    cellClassName: 'datagrid-rows',
    align: 'left',
    minWidth: 70,
    flex: 1,
  },
  {
    field: 'purchasePerWeek',
    headerName: 'Purchase Per Week',
    headerClassName: 'datagrid-columns',
    headerAlign: 'left',
    cellClassName: 'datagrid-rows',
    align: 'left',
    minWidth: 70,
    flex: 1,
  },
  {
    field: 'salesPerWeek',
    headerName: 'Sales Per Week',
    headerClassName: 'datagrid-columns',
    headerAlign: 'left',
    cellClassName: 'datagrid-rows',
    align: 'left',
    minWidth: 70,
    flex: 1,
  },
  {
    field: 'stockInHand',
    headerName: 'Stock In Hand',
    headerClassName: 'datagrid-columns',
    headerAlign: 'left',
    cellClassName: 'datagrid-rows',
    align: 'left',
    minWidth: 130,
    flex: 1,
  },
  {
    field: 'stockValue',
    headerName: 'Stock Value',
    headerClassName: 'datagrid-columns',
    headerAlign: 'left',
    cellClassName: 'datagrid-rows',
    align: 'left',
    minWidth: 130,
    flex: 1,
    // renderCell: (params) => (
    //   <>
    //     {/* <FlagIcon color="success" sx={{ width: '1.5em', height: '1.5em' }} /> */}
    //     NA
    //   </>
    // ),
  },
];

export const profitColumns = [
  {
    field: 'title',
    headerName: 'Title',
    headerClassName: 'datagrid-columns',
    headerAlign: 'left',
    cellClassName: 'datagrid-rows',
    align: 'left',
    minWidth: 200,
    flex: 1,
  },
  {
    field: 'barcode',
    headerName: 'Barcode',
    headerClassName: 'datagrid-columns',
    headerAlign: 'left',
    cellClassName: 'datagrid-rows',
    align: 'left',
    minWidth: 150,
    flex: 1,
    renderCell: (params) => {
      return <CopyToClipBoard params={params} />;
    },
  },
  {
    field: 'classification',
    headerName: 'Classification',
    headerClassName: 'datagrid-columns',
    headerAlign: 'left',
    cellClassName: 'datagrid-rows',
    align: 'left',
    minWidth: 70,
    flex: 1,
  },
  {
    field: 'sales',
    headerName: 'Sales',
    headerClassName: 'datagrid-columns',
    headerAlign: 'left',
    cellClassName: 'datagrid-rows',
    align: 'left',
    minWidth: 70,
    flex: 1,
  },
  {
    field: 'profit',
    headerName: 'Profit',
    headerClassName: 'datagrid-columns',
    headerAlign: 'left',
    cellClassName: 'datagrid-rows',
    align: 'left',
    minWidth: 70,
    flex: 1,
  },
  {
    field: 'saleMargin',
    headerName: 'Sale Margin',
    headerClassName: 'datagrid-columns',
    headerAlign: 'left',
    cellClassName: 'datagrid-rows',
    align: 'left',
    minWidth: 70,
    flex: 1,
  },
  {
    field: 'purchaseMargin',
    headerName: 'Purchase Margin',
    headerClassName: 'datagrid-columns',
    headerAlign: 'left',
    cellClassName: 'datagrid-rows',
    align: 'left',
    minWidth: 130,
    flex: 1,
  },
  {
    field: 'stockValue',
    headerName: 'Stock Value',
    headerClassName: 'datagrid-columns',
    headerAlign: 'left',
    cellClassName: 'datagrid-rows',
    align: 'left',
    minWidth: 130,
    flex: 1,
    // renderCell: (params) => (
    //   <>
    //     {/* <FlagIcon color="success" sx={{ width: '1.5em', height: '1.5em' }} /> */}
    //     NA
    //   </>
    // ),
  },
];

export const salesColumns = [
  {
    field: 'title',
    headerName: 'Title',
    headerClassName: 'datagrid-columns',
    headerAlign: 'left',
    cellClassName: 'datagrid-rows',
    align: 'left',
    minWidth: 200,
    flex: 1,
  },
  {
    field: 'barcode',
    headerName: 'Barcode',
    headerClassName: 'datagrid-columns',
    headerAlign: 'left',
    cellClassName: 'datagrid-rows',
    align: 'left',
    minWidth: 150,
    flex: 1,
    renderCell: (params) => {
      return <CopyToClipBoard params={params} />;
    },
  },
  {
    field: 'classification',
    headerName: 'Classification',
    headerClassName: 'datagrid-columns',
    headerAlign: 'left',
    cellClassName: 'datagrid-rows',
    align: 'left',
    minWidth: 70,
    flex: 1,
  },
  {
    field: 'netRevenue',
    headerName: 'Net Revenue',
    headerClassName: 'datagrid-columns',
    headerAlign: 'left',
    cellClassName: 'datagrid-rows',
    align: 'left',
    minWidth: 70,
    flex: 1,
  },
  {
    field: 'salePrice',
    headerName: 'Sale Price',
    headerClassName: 'datagrid-columns',
    headerAlign: 'left',
    cellClassName: 'datagrid-rows',
    align: 'left',
    minWidth: 70,
    flex: 1,
  },
  {
    field: 'salesPerMonth',
    headerName: 'Sales Per Month',
    headerClassName: 'datagrid-columns',
    headerAlign: 'left',
    cellClassName: 'datagrid-rows',
    align: 'left',
    minWidth: 70,
    flex: 1,
  },
  {
    field: 'stockInHand',
    headerName: 'Stock In Hand',
    headerClassName: 'datagrid-columns',
    headerAlign: 'left',
    cellClassName: 'datagrid-rows',
    align: 'left',
    minWidth: 130,
    flex: 1,
  },
  {
    field: 'stockValue',
    headerName: 'Stock Value',
    headerClassName: 'datagrid-columns',
    headerAlign: 'left',
    cellClassName: 'datagrid-rows',
    align: 'left',
    minWidth: 130,
    flex: 1,
    // renderCell: (params) => (
    //   <>
    //     {/* <FlagIcon color="success" sx={{ width: '1.5em', height: '1.5em' }} /> */}
    //     NA
    //   </>
    // ),
  },
];
