import { Divider, Stack, Typography } from '@mui/material';

const PaymentRecMobCard = ({ data }) => {
  const cardDetailsArray = [
    {
      titleName1: 'Invoice Number',
      titleName2: 'Invoice Date',
      titleValue1: 'invoiceNumber',
      titleValue2: 'invoiceDate',
      showTitle: false,
      showTitle2: false,
    },
    {
      titleName1: 'Payment Method',
      titleName2: 'Payment Status',
      titleValue1: 'paymentMethod',
      titleValue2: 'paymentStatus',
      showTitle: true,
      showTitle2: true,
    },
    {
      titleName1: 'Order Id',
      titleName2: 'Payment ID',
      titleValue1: 'orderID',
      titleValue2: 'paymentId',
      showTitle: true,
      showTitle2: true,
    },
    {
      titleName1: 'Cusotmer',
      titleName2: '',
      titleValue1: 'customerName',
      titleValue2: '',
      showTitle: true,
      showTitle2: false,
    },
  ];
  return (
    <Stack
      className="all-order-card-main-div po-box-shadow"
      //   onClick={() => navigateToDetailsPage(product?.orderNumber)}
    >
      {cardDetailsArray.map((item, index) => (
        <>
          <Stack direction="row" justifyContent="space-between">
            <Stack alignItems="flex-start">
              {item.showTitle && <Typography fontSize="12px">{item.titleName1}</Typography>}
              <Typography fontSize="14px" fontWeight={700}>
                {data[item.titleValue1]}
              </Typography>
            </Stack>
            {item.showTitle2 && (
              <Stack alignItems="flex-end">
                {item.showTitle && <Typography fontSize="12px">{item.titleName2}</Typography>}
                <Typography fontSize="14px" fontWeight={700}>
                  {data[item.titleValue2]}
                </Typography>
              </Stack>
            )}
          </Stack>
          {index < cardDetailsArray.length - 1 && <Divider sx={{ margin: '5px !important' }} />}
        </>
      ))}
    </Stack>
  );
};

export default PaymentRecMobCard;
