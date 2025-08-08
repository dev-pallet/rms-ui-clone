import '../data-grid-card.css';
import { Divider, Grid, Stack } from '@mui/material';

const PoItemsCard = ({ data, index }) => {
  return (
    <div className="card-main-component pi-item-card-main-component" key={index}>
      <Stack direction={'row'} alignItems={'flex-start'} justifyContent={'space-between'}>
        <Stack>
          <span className="card-title">{data?.title?.length > 19 ? data?.title?.slice(0,18) : data?.title}</span>
          <span className="card-sub-title">Gtin: {data?.barcode}</span>
        </Stack>
        <Stack alignItems={'flex-end'}>
          <span className="card-small-title">Fill Rate</span>
          <span className="card-small-value">{data?.fillRate}</span>
        </Stack>
      </Stack>
      <Divider className="common-divider-mob-cards" />
      <Grid container>
        <Grid item lg={4} md={4} sm={4} xs={4}>
          <Stack>
            <span className="card-small-title">Sales/Week</span>
            <span className="card-small-value">{data?.salesPerWeek}</span>
          </Stack>
        </Grid>
        <Grid item lg={4} md={4} sm={4} xs={4}>
          <Stack alignItems={'center'}>
            <span className="card-small-title">Stk When Ordered</span>
            <span className="card-small-value">{data?.stockWhenOrdered}</span>
          </Stack>
        </Grid>
        <Grid item lg={4} md={4} sm={4} xs={4}>
          <Stack alignItems={'flex-end'}>
            <span className="card-small-title">Ordered Qty</span>
            <span className="card-small-value">{data?.orderQty}</span>
          </Stack>
        </Grid>
      </Grid>
      {/* <Divider className="common-divider-mob-cards" /> */}
      {/* <Grid container>
        <Grid item lg={6} md={6} sm={6} xs={6}>
          <Stack>
            <span className="card-small-title">Qty Fullfiled</span>
            <span className="card-small-value">{data?.quantityFullfilled}</span>
          </Stack>
        </Grid>
        <Grid item lg={6} md={6} sm={6} xs={6}>
          <Stack alignItems={'flex-end'}>
            <span className="card-small-title">Fill Rate</span>
            <span className="card-small-value">{fillRate}</span>
          </Stack>
        </Grid>
      </Grid> */}
    </div>
  );
};

export default PoItemsCard;
