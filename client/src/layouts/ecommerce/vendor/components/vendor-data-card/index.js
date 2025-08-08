import { Divider, Stack, Typography } from '@mui/material';

const VendorCard = ({data}) => {
  const vendorCardArray = [
    {
      titleName1: 'Vendor Name',
      titleName2: 'Status',
      titleValue1: 'vendorName',
      titleValue2: '',
      titleValue3: 'vendorId',
      showTitle: false,
      showTitle2: false,
      isFirstColumn: true
    },
    {
      titleName1: 'Gst Number',
      titleName2: 'Contact Number',
      titleValue1: 'gstNumber',
      titleValue2: 'contactNumber',
      showTitle: true,
      showTitle2: true,
      isFirstColumn: false

    },
    {
      titleName1: 'Location',
      titleName2: '',
      titleValue1: 'location',
      titleValue2: '',
      showTitle: true,
      showTitle2: true,
      isFirstColumn: false

    },
  ];
  return (
    <Stack
      className="all-order-card-main-div po-box-shadow"
      //   onClick={() => navigateToDetailsPage(product?.orderNumber)}
    >
      {vendorCardArray.map((item, index) => (
        <>
          <Stack direction="row" justifyContent="space-between" key={index}>
            <Stack alignItems="flex-start">
              {item.showTitle && <Typography fontSize="12px">{item.titleName1}</Typography>}
              <Typography fontSize="14px" fontWeight={700}>
                {data[item.titleValue1]}
              </Typography>
              {item.isFirstColumn && <Typography fontSize="12px" fontWeight={700}>
                {data[item.titleValue3]}
              </Typography>}
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
          {index < vendorCardArray.length - 1 && <Divider sx={{ margin: '5px !important' }} />}
        </>
      ))}
    </Stack>
  );
};

export default VendorCard;