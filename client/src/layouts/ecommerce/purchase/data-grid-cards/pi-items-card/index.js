import '../data-grid-card.css';
import { Chip, Divider, Grid, Menu, Stack, Typography, useMediaQuery } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import FlagIcon from '@mui/icons-material/Flag';
import { textFormatter } from '../../../Common/CommonFunction';

const PiItemsCard = ({ data, index, categoryColour, getTagDescription }) => {
  const isSmallerThan400 = useMediaQuery('(max-width:400px)');
  const [fillRate, setFillRate] = useState('NA');
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // const qtyReceivedValue = Math.abs(data?.orderQty - data?.quantityLeft);
  const qtyReceivedValue = useMemo(
    () => Math.abs(data?.orderQty - data?.quantityLeft),
    [data?.orderQty, data?.quantityLeft],
  );
  const fillRateFunction = () => {
    const percentage = ((qtyReceivedValue / data?.orderQty) * 100).toString();
    const truncatedPercentage = percentage.replace(/(\.\d\d)\d*/, '$1');
    return (truncatedPercentage !== 'NaN' ? truncatedPercentage : '0') + '%';
    // const isValid = regex.test()
  };

  useEffect(() => {
    setFillRate(fillRateFunction());
  }, [data?.orderQty, data?.quantityLeft]);

  return (
    <div className="card-main-component pi-item-card-main-component" key={index}>
      <Stack direction={'row'} alignItems={'flex-start'} justifyContent={'space-between'}>
        <Stack>
          <span className="card-title">
            {data?.title?.length > (isSmallerThan400 ? 19 : 30)
              ? textFormatter(data?.title)?.slice(0, isSmallerThan400 ? 18 : 30) + '...'
              : textFormatter(data?.title)}
          </span>
          <span className="card-sub-title">Gtin: {data?.barcode}</span>
        </Stack>
        {/* <Stack>
          <div
            className="flag-data-div"
            style={{ backgroundColor: data?.purchaseRecommendationFlag }}
            onClick={handleClick}
          >
            <FlagIcon fontSize="small" style={{ color: '#fff', cursor: 'pointer' }} />
          </div>
        </Stack> */}
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
            <span className="card-small-title">Avl Qty</span>
            <span className="card-small-value">{data?.availableQty}</span>
          </Stack>
        </Grid>
        <Grid item lg={4} md={4} sm={4} xs={4}>
          <Stack alignItems={'flex-end'}>
            <span className="card-small-title">Ordered Qty</span>
            <span className="card-small-value">{data?.orderQty}</span>
          </Stack>
        </Grid>
      </Grid>
      <Divider className="common-divider-mob-cards" />
      <Grid container>
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
      </Grid>
      {/* <Menu id="basic-menu" anchorEl={anchorEl} open={open} onClose={handleClose}>
        <div className="flag-data-pi-details-mobile">
          <div className="flag-pi-det-child">
            <Typography className="flag-data-pi-heading">Recommendation:</Typography>
            <Typography className="flag-data-pi-detail-value" sx={{ fontSize: '14px' }}>
              {data?.purchaseFlagReason}
            </Typography>
          </div>
          <div className="flag-pi-det-child">
            <Typography className="flag-data-pi-heading">Inventory:</Typography>
            <div className="flag-data-pi-detail-value">
              {data?.inventoryFlag === 'D' ? (
                <span style={{ color: 'red', fontSize: '14px', fontWeight: 'bold' }}>Dead Stock</span>
              ) : (
                <>
                  <Chip color={categoryColour(data?.inventoryFlag)} label={data?.inventoryFlag || 'NA'} />
                  {data?.inventoryFlag !== 'NA' && (
                    <Chip
                      color={categoryColour(data?.inventoryFlag)}
                      label={getTagDescription('INVENTORY', data?.inventoryFlag) || 'NA'}
                    />
                  )}
                </>
              )}
            </div>
          </div>
          <div className="flag-pi-det-child">
            <Typography className="flag-data-pi-heading">Profit:</Typography>
            <div className="flag-data-pi-detail-value">
              <Chip color={categoryColour(data?.profitFlag)} label={data?.profitFlag || 'NA'} />
              {data?.profitFlag !== 'NA' && (
                <Chip
                  color={categoryColour(data?.profitFlag)}
                  label={getTagDescription('PROFIT', data?.profitFlag) || 'NA'}
                />
              )}
            </div>
          </div>
          <div className="flag-pi-det-child">
            <Typography className="flag-data-pi-heading">Sales:</Typography>
            <div className="flag-data-pi-detail-value">
              <Chip color={categoryColour(data?.salesFlag)} label={data?.salesFlag || 'NA'} />
              {data?.salesFlag !== 'NA' && (
                <Chip
                  color={categoryColour(data?.salesFlag)}
                  label={getTagDescription('SALES', data?.salesFlag) || 'NA'}
                />
              )}
            </div>
          </div>
        </div>
      </Menu> */}
    </div>
  );
};

export default PiItemsCard;
