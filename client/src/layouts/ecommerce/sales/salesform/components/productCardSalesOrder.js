import './cardSalesPrdt.css';
import { Divider, IconButton, Stack, Typography } from '@mui/material';
import { textFormatter } from '../../../Common/CommonFunction';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import SoftBox from '../../../../../components/SoftBox';

const SalesOrderProductCard = ({ data, inclusiveTax, handleDelete, index ,deleteLoader}) => {
  return (
    <SoftBox className="po-box-shadow sales-order-main-div-wrapper">
      <SoftBox className="sales-order-card-main-div" key={data?.gtin}>
        <Stack flexDirection="row" justifyContent="space-between">
          <Stack alignItems="flex-start">
            <Typography fontSize="16px" fontWeight={700}>
              {textFormatter(data?.productName)}
            </Typography>
            <Typography fontSize="12px">{data?.gtin}</Typography>
          </Stack>
          <Stack alignItems="flex-start">
            <IconButton className='sales-card-iconbtn' onClick={() => handleDelete(index)}>
              <DeleteForeverIcon className="sales-prdt-card-btn" sx={{color: deleteLoader && 'lightgray'}}/>
            </IconButton>
            {/* <Typography fontSize="16px" fontWeight={700}>
              ₹ {data?.sellingPrice}
            </Typography>
            <Typography fontSize="12px" sx={{ textDecoration: 'line-through' }}>
              ₹ {data?.mrp}
            </Typography> */}
          </Stack>
        </Stack>
        <Divider sx={{ margin: '5px !important' }} />
        <Stack flexDirection="row" justifyContent="space-between">
          <Stack alignItems="flex-start">
            <Typography className="sales-order-heading">MRP</Typography>
            <Typography className="sales-order-value">{data?.mrp}</Typography>
          </Stack>
          <Stack alignItems="flex-end">
            <Typography className="sales-order-heading">Selling Price</Typography>
            <Typography className="sales-order-value">{data?.sellingPrice}</Typography>
          </Stack>
        </Stack>
        <Divider sx={{ margin: '5px !important' }} />
        <Stack flexDirection="row" justifyContent="space-between">
          <Stack>
            <Typography className="sales-order-heading">Quantity</Typography>
            <Typography className="sales-order-value">{data?.quantity}</Typography>
          </Stack>
          <Stack alignItems="flex-end">
            {/* <Typography className="sales-order-heading">Total Amount</Typography> */}
            <Stack flexDirection="row" justifyContent="space-between">
              <Typography className="sales-order-heading" sx={{ textDecoration: !inclusiveTax && 'line-through' }}>
                Tax -{' '}
              </Typography>
              <Typography
                className="sales-order-heading"
                fontWeight={inclusiveTax ? 700 : 400}
                sx={{ textDecoration: !inclusiveTax && 'line-through' }}
              >
                {' ' + data?.tax}
              </Typography>
            </Stack>
            <Typography className="sales-order-value">
            Total Amount - ₹ {inclusiveTax ? data?.amountWithTax : data?.amountWithoutTax}
            </Typography>
          </Stack>
        </Stack>
      </SoftBox>
      {/* <SoftBox className="sales-prdt-card-btn-div" onClick={() => handleDelete(index)}>
        <DeleteForeverIcon className="sales-prdt-card-btn"  />
      </SoftBox> */}
    </SoftBox>
  );
};

export default SalesOrderProductCard;
