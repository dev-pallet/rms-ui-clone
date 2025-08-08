import { Grid } from '@mui/material';

export const MoPoProductDetails = ({
  spec,
  finalPrice,
  qtyFulfilled,
  quantityOrdered,
  availableStock,
  salesPerWeek,
}) => (
  <>
    <hr className="horizontal-line-app-ros" />
    <div className="mob-product-other" style={{ marginTop: '15px' }}>
      <div className="mob-product-code">
        <div className="product-card-otherData">
          <span className="product-card-other-value">
            ₹ {finalPrice || 0} | {spec || 'NA'}
          </span>
        </div>
      </div>
      <div>
        <div className="product-card-otherData">
          Required: <span className="mob-po-product-other-data">{quantityOrdered ?? 0}</span>
        </div>
      </div>
      <div>
        <div className="product-card-otherData">
          Fulfilled: <span className="mob-po-product-other-data">{qtyFulfilled ?? 0}</span>
        </div>
      </div>
    </div>
    <div className="mob-product-other" style={{ marginTop: '15px' }}>
      <Grid container spacing={1} sx={{ marginTop: '0px' }}>
        <Grid item lg={4} md={4} sm={4} xs={4}>
          <div className="flex-colum-align-start border-right">
            <span className="pi-create-info-title">Current Stock</span>
            <span className="pi-create-info-value">{availableStock || '0'}</span>
          </div>
        </Grid>
        <Grid item lg={4} md={4} sm={4} xs={4}>
          <div className="flex-colum-align-center border-right">
            <span className="pi-create-info-title">Avg. sales/week</span>
            <span className="pi-create-info-value">{salesPerWeek || 'N0'}</span>
          </div>
        </Grid>
        <Grid item lg={4} md={4} sm={4} xs={4}>
          <div className="abc-analaysis-main-info" style={{ backgroundColor: 'black' }}>
            <span className="pi-create-info-title" style={{ color: '#fff', fontSize: '0.7rem' }}>
              NA{' '}
            </span>
          </div>
        </Grid>
      </Grid>
    </div>
    <hr className="horizontal-line-app-ros" />
  </>
);
