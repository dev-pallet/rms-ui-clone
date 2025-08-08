import { memo } from 'react';
import { CopyToClipBoard } from '../../../../../Common/CommonFunction';

const ExpiryProductListMobileCard = memo(({ index, data, tab, handleProductNavigation }) => {

  return (
    <>
      <div className="listing-card-bg-secondary">
        <div className="stack-row-center-between width-100">
          <div className="flex-colum-align-start">
            <span className="bill-card-value two-line-ellipsis">
              {index}
              {' )'}. {data?.itemName}
            </span>
            <div className="bill-card-label product-card-item-barcode-brand content-space-between">
              Barcode:
              <span className="displayInlineBlock space-5px">
                <CopyToClipBoard
                  params={{ value: data?.barcode || 'NA' }}
                  className="product-card-item-barcode-brand gap-5px"
                  customWidth={'10px'}
                  customHeight={'10px'}
                />
              </span>
            </div>
          </div>
        </div>
        <hr className="horizontal-line-app-ros" />
        <div className="stack-row-center-between width-100">
          <div className="flex-colum-align-start">
            <span className="bill-card-label">Brand</span>
            <span className="bill-card-value">{data?.brandName}</span>
          </div>
          <div className="flex-colum-align-end">
            <span className="bill-card-label">{tab != 1 ? 'Quantities Expiring' : 'Quantities Expired'}</span>
            <span className="bill-card-value">{data?.availableUnits}</span>
          </div>
        </div>
        <div className="stack-row-center-between width-100">
          <div className="flex-colum-align-start">
            <span className="bill-card-label">Stock Value</span>
            <span className="bill-card-value">{data?.stockValue}</span>
          </div>
        </div>
        <span
          className="view-details-app"
          onClick={() => handleProductNavigation({ rowData: { barcode: data?.barcode } })}
        >
          View Details
        </span>
      </div>
    </>
  );
});

export default ExpiryProductListMobileCard;
