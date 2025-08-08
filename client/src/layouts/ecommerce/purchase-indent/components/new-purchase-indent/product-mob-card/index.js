import './product-mob-card.css';
import { Divider, Grid, Stack, Typography } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import SoftBox from '../../../../../../components/SoftBox';

const ProductMobCard = ({
  key,
  index,
  barcodeNumber,
  productName,
  specification,
  availableStock,
  purchaseMargin,
  quantityOrdered,
  mrp,
  preferredVendor,
  vendorId,
  salesPerWeek,
  handleDelete,
  setCount,
  rowData,
  mobileItemAddModal,
  setMobileItemAddModal,
  isEditing,
  setIsEditing,
  selectProduct,
  setEditingIndex,
}) => {

  return (
    <SoftBox
      key={index}
      className="product-mob-card-main-conatiner po-box-shadow"
      sx={{ marginRight: rowData?.length <= 2 ? 'unset' : '10px' }}
      onClick={() => {
        setIsEditing(true);
        setEditingIndex(index);
        const itemData = {
          name: productName,
          gtin: barcodeNumber,
          weights_and_measures: {
            net_weight: specification?.split(' ')[0],
            measurement_unit: specification?.split(' ')[1],
          },
          mrp: { mrp: mrp },
          quantityOrdered: quantityOrdered,
          availableStocks: availableStock,
          salesPerWeek: salesPerWeek,
          purchaseMargin: purchaseMargin,
          preferredVendor: preferredVendor,
          vendorId: vendorId,
        };
        selectProduct(itemData, index, true);
      }}
    >
      <Stack direction={'row'} className="parent-stack">
        <Stack alignItems={'flex-start'}>
          <Typography fontSize="14px" fontWeight={700}>
            {productName}
          </Typography>
          <Typography fontSize="12px">{barcodeNumber}</Typography>
        </Stack>
        <CancelIcon
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(index);
          }}
          fontSize="small"
          color="error"
        />
      </Stack>
      <Divider sx={{ margin: '5px !important' }} />

      <Stack direction={'row'} className="parent-stack">
        <Grid container>
          <Grid item lg={4} sm={4} md={4} xs={4}>
            <Stack alignItems={'flex-start'}>
              <Typography className="product-mob-picard-label">UOM</Typography>
              <Typography className="product-mob-picard-value">{specification}</Typography>
            </Stack>
          </Grid>
          <Grid item lg={4} sm={4} md={4} xs={4}>
            <Stack alignItems={'center'}>
              <Typography className="product-mob-picard-label">P. Margin</Typography>
              <Typography className="product-mob-picard-value">{purchaseMargin}</Typography>
            </Stack>
          </Grid>
          <Grid item lg={4} sm={4} md={4} xs={4}>
            <Stack alignItems={'flex-end'}>
              <Typography className="product-mob-picard-label">MRP</Typography>
              <Typography className="product-mob-picard-value">{mrp}</Typography>
            </Stack>
          </Grid>
        </Grid>
      </Stack>
      <Divider sx={{ margin: '5px !important' }} />
      <Stack direction={'row'} className="parent-stack">
        <Grid container>
          <Grid item lg={4} sm={4} md={4} xs={4}>
            <Stack alignItems={'flex-start'}>
              <Typography className="product-mob-picard-label">Available Stk</Typography>
              <Typography className="product-mob-picard-value">{availableStock}</Typography>
            </Stack>
          </Grid>
          <Grid item lg={4} sm={4} md={4} xs={4}>
            <Stack alignItems={'center'}>
              <Typography className="product-mob-picard-label">Quantity</Typography>
              <Typography className="product-mob-picard-value">{quantityOrdered || 'NA'}</Typography>
            </Stack>
          </Grid>
          <Grid item lg={4} sm={4} md={4} xs={4}>
            <Stack alignItems={'flex-end'}>
              <Typography className="product-mob-picard-label">Sales/week</Typography>
              <Typography className="product-mob-picard-value">{salesPerWeek || 'NA'}</Typography>
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </SoftBox>
  );
};

export default ProductMobCard;
