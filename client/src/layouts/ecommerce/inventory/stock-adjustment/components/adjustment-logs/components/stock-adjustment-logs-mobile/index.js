import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import AdditonalDetailsCardMobile from '../additional-details-card-mobile';

const AdjustmentLogsMobileCard = React.memo(
  ({
    data,
    handleOpenModalStockAdjustmentLogs,
    getStockAdjustmentAdditionalData,
    additionalData,
    additionalDataLoader,
  }) => {
    const navigate = useNavigate();

    return (
      <>
        {/* <Stack
          className="all-order-card-main-div po-box-shadow"
          //   onClick={() => navigate(`/products/all-products/details/${data?.barcode}`)}
        >
          <Stack direction="row" justifyContent="space-between">
            <Stack alignItems="flex-start">
              <Typography fontSize="14px" fontWeight={700}>
                {data?.title}
              </Typography>
            </Stack>
            <Stack alignItems="flex-end">
              <Typography fontSize="12px">Barcode</Typography>
              <Typography fontSize="14px" fontWeight={700}>
                {data?.barcode}
              </Typography>
            </Stack>
          </Stack>
          <Divider sx={{ margin: '5px !important' }} />
          <Stack direction="row" justifyContent="space-between">
            <Stack alignItems="flex-start">
              <Typography fontSize="12px">UOM</Typography>
              <Typography fontSize="14px" fontWeight={700}>
                {data?.uom}
              </Typography>
            </Stack>
            <Stack alignItems="flex-end">
              <Typography fontSize="12px">MRP</Typography>
              <Typography fontSize="14px" fontWeight={700}>
                {data?.mrp}
              </Typography>
            </Stack>
          </Stack>
          <Divider sx={{ margin: '5px 0px !important' }} />
          <Stack direction="row" justifyContent="space-between">
            <Stack alignItems="flex-start">
              <Typography fontSize="12px">Adjusted Quantity</Typography>
              <Typography fontSize="14px" fontWeight={700}>
                {data?.adjustedQuantity}
              </Typography>
            </Stack>
            <Stack alignItems="flex-end">
              <Typography fontSize="12px">Adjusted Value</Typography>
              <Typography fontSize="14px" fontWeight={700}>
                {data?.adjustedValue}
              </Typography>
            </Stack>
          </Stack>
          <Divider sx={{ margin: '5px !important' }} />
          <Stack direction="row" justifyContent="space-between">
            <Stack alignItems="flex-start">
              <Typography fontSize="12px">Stock In Hand</Typography>
              <Typography fontSize="14px" fontWeight={700}>
                {data?.stockInHand}
              </Typography>
            </Stack>
            <Stack alignItems="flex-end">
              <Typography fontSize="12px">Batch</Typography>
              <Typography fontSize="14px" fontWeight={700}>
                {data?.batch}
              </Typography>
            </Stack>
          </Stack>
          <Divider sx={{ margin: '5px !important' }} />
          <Stack direction="row" justifyContent="space-between">
            <Stack alignItems="flex-start">
              <Typography fontSize="12px">Last Updated</Typography>
              <Typography fontSize="14px" fontWeight={700}>
                {data?.lastUpdated}
              </Typography>
            </Stack>
            <Stack alignItems="flex-end" sx={{ alignItems: 'center', justifyContent: 'center' }}>
              <InfoOutlinedIcon
                color="primary"
                fontSize="12px"
                onClick={(e) => {
                  handleOpenModalStockAdjustmentLogs(e);
                  getStockAdjustmentAdditionalData({
                    row: { barcode: data?.barcode, adjustmentId: data?.adjustmentId, batch: data?.batch },
                  });
                }}
              />
            </Stack>
          </Stack>
        </Stack> */}

        <div className="listing-card-bg-secondary">
          <div className="stack-row-center-between width-100">
            <div className="flex-colum-align-start">
              <span className="bill-card-value two-line-ellipsis">{data?.title}</span>
              <span className="bill-card-label">Barcode: {data?.barcode}</span>
            </div>
          </div>
          <hr className="horizontal-line-app-ros" />
          <div className="stack-row-center-between width-100">
            <div className="flex-colum-align-start">
              <span className="bill-card-label">Adjusted Quantity</span>
              <span className="bill-card-value">{data?.adjustedQuantity}</span>
            </div>
            <div className="flex-colum-align-end">
              <span className="bill-card-label">Adjusted Value</span>
              <span className="bill-card-value">₹ {data?.adjustedValue}</span>
            </div>
          </div>
          <div className="stack-row-center-between width-100">
            <div className="flex-colum-align-start">
              <span className="bill-card-label">Stock In Hand</span>
              <span className="bill-card-value">{data?.stockInHand}</span>
            </div>
            <div className="flex-colum-align-end">
              <span className="bill-card-label">Batch</span>
              <span className="bill-card-value">{data?.batch}</span>
            </div>
          </div>
          <div className="stack-row-center-between width-100">
            <div className="flex-colum-align-start">
              <span className="bill-card-label">Last Updated</span>
              <span className="bill-card-value">{data?.lastUpdated}</span>
            </div>
          </div>

          <AdditonalDetailsCardMobile
            getStockAdjustmentAdditionalData={getStockAdjustmentAdditionalData}
            data={data}
            additionalData={additionalData[data?.adjustmentId]}
            additionalDataLoader={additionalDataLoader}
          />
        </div>
      </>
    );
  },
);

export default AdjustmentLogsMobileCard;
