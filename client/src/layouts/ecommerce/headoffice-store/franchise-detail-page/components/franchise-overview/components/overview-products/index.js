import { DataGrid } from '@mui/x-data-grid';
import { Stack } from '@mui/material';
import SoftBox from '../../../../../../../../components/SoftBox';

const columns = [
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
    headerName: 'Product',
    minWidth: 250,
    flex: 1,
    headerClassName: 'datagrid-columns',
    headerAlign: 'left',
    cellClassName: 'datagrid-rows',
    align: 'left',
  },

  {
    field: 'gtin',
    headerName: 'Barcode',
    headerClassName: 'datagrid-columns',
    headerAlign: 'left',
    flex: 1,
    minWidth: 150,
    cellClassName: 'datagrid-rows',
    align: 'left',
  },
  {
    field: 'brand',
    headerName: 'Brand',
    minWidth: 80,
    flex: 1,
    headerClassName: 'datagrid-columns',
    headerAlign: 'left',
    cellClassName: 'datagrid-rows',
    align: 'left',
  },
  {
    field: 'mrp',
    headerName: 'MRP',
    minWidth: 50,
    flex: 1,
    headerClassName: 'datagrid-columns',
    headerAlign: 'left',
    cellClassName: 'datagrid-rows',
    align: 'left',
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
    field: 'manufacturer',
    headerName: 'Manufacturer',
    headerClassName: 'datagrid-columns',
    headerAlign: 'left',
    flex: 1,
    minWidth: 150,
    cellClassName: 'datagrid-rows',
    align: 'left',
  },
];

const OverviewProducts = () => {
  const noImage= 'https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg';
  const rows = [
    {
      id: 0,
      image: noImage,
      product: 'Product 1',
      gtin: '2345459872954',
      brand: 'Brand 1',
      mrp: 40,
      salePrice: 30,
      manufacturer: 'Manufacture 1',
    },
    {
      id: 1,
      image: noImage,
      product: 'Product 2',
      gtin: '2978454432954',
      brand: 'Brand 1',
      mrp: 435,
      salePrice: 400,
      manufacturer: 'Manufacture 2',
    },
    {
      id: 2,
      image: noImage,
      product: 'Product 3',
      gtin: '4535234523452',
      brand: 'Brand 1',
      mrp: 643,
      salePrice: 622,
      manufacturer: 'Manufacture 3',
    },
    {
      id: 4,
      image: noImage,
      product: 'Product 4',
      gtin: '2978459872954',
      brand: 'Brand 1',
      mrp: 400,
      salePrice: 300,
      manufacturer: 'Manufacture 4',
    },
  ];
  return (
    <Stack width="100%" sx={{ backgroundColor: 'white !important', marginBottom: '10px' }}>
      <SoftBox className="store-datagrid-header overview-products"></SoftBox>
      <SoftBox sx={{ height: 525 }}>
        <DataGrid
          sx={{ cursor: 'pointer', borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px' }}
          columns={columns}
          rows={rows}
          pagination
          pageSize={10}
          paginationMode="server"
          className="data-grid-table-boxo"
          // onRowClick={onClickRowHandler}
        />
      </SoftBox>
    </Stack>
  );
};

export default OverviewProducts;
