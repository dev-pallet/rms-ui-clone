import './common-data-grid.css';
import { Box, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { dataGridStyles } from './styles';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../../../../hooks/SnackbarProvider';
import { productIdByBarcode } from '../../CommonFunction';

const CustomNoRowsOverlay = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
      }}
    >
      <Typography variant="h6" color="textSecondary">
        No data found
      </Typography>
    </Box>
  );
};

const CommonDataGrid = ({ columns, rows, onPageChangeFunction, onPageSizeChangeFunction, pageSize, ...rest }) => {
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();
  const handleProductNavigation = async (barcode) => {
    try {
      const productId = await productIdByBarcode(barcode);
      if (productId) {
        navigate(`/products/product/details/${productId}`);
      }
    } catch (error) {}
  };
  const handleNavigate = (item) => {
    if (item?.purchaseOrder?.includes('PO')) {
      navigate(`/purchase/purchase-orders/details/${item?.purchaseOrder}`);
    } else if (item?.barcode) {
      handleProductNavigation(item?.barcode);
    }

    if (item?.isReturnDetails) {
      if (item?.gtin === 'NA') {
        showSnackbar('Product Gtin not found', 'error');
        return;
      }
      handleProductNavigation(item?.gtin);
    }
  };
  return (
    <div className="common-datagrid-main-container">
      <DataGrid
        sx={{ ...dataGridStyles.header, borderRadius: '24px', cursor: 'pointer' }}
        rows={rows}
        columns={columns}
        onPageChange={onPageChangeFunction}
        onPageSizeChange={onPageSizeChangeFunction}
        pageSize={pageSize || 10}
        onRowClick={(params) => handleNavigate(params?.row)}
        {...rest}
        disableRowSelectionOnClick
        disableSelectionOnClick
        components={{
          NoRowsOverlay: CustomNoRowsOverlay,
        }}
      />
    </div>
  );
};

export default CommonDataGrid;
