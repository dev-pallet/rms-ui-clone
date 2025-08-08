import { useMediaQuery } from '@mui/material';
import { textFormatter } from '../../../Common/CommonFunction';
import './common-purchase-card.css';
import CommonFlagData from '../../../Common/mobile-new-ui-components/common-flag-data-comp';
const CommonPurchaseCard = ({ index, data, isPo, handleProductNavigation }) => {
  const isSmallerThan400 = useMediaQuery('(max-width:400px)');

  return (
    <div className="card-purchase-main-div">
      <div
        className="card-main-component pi-item-card-main-component"
        key={index}
        onClick={() => handleProductNavigation(data?.barcode)}
      >
        <div className="stack-row-center-between width-100">
          <div className="flex-colum-align-start">
            <span className="card-title">
              {data?.title?.length > (isSmallerThan400 ? 19 : 30)
                ? textFormatter(data?.title)?.slice(0, isSmallerThan400 ? 18 : 30) + '...'
                : textFormatter(data?.title)}
            </span>
            <span className="card-sub-title">Gtin: {data?.barcode}</span>
          </div>
          <div className="flex-colum-align-end">
            <span className="card-title">{data?.orderQty || data?.quantityOrdered}</span>
            <span className="card-sub-title">Order Quantity</span>
          </div>
        </div>
        <hr className="horizontal-line-app-ros" />
        <div className="indent-details-info-div width-100">
          <div className="stack-row-center-between width-100">
            <div className="flex-colum-align-start">
              <span className="card-title">{data?.mrp}</span>
              <span className="card-sub-title">MRP</span>
            </div>
            <div className="flex-colum-align-end">
              <span className="card-title">{data?.availableQty}</span>
              <span className="card-sub-title">Available Quantity</span>
            </div>
          </div>
          <div className="stack-row-center-between width-100">
            <div className="flex-colum-align-start">
              <span className="card-title">{isPo ? data?.fillRate : data?.quantityFullfilled}</span>
              <span className="card-sub-title">{isPo ? 'Fill Rate' : 'Quantity fulfilled'}</span>
            </div>
            <div className="flex-colum-align-end">
              <span className="card-title">{isPo ? data?.stockWhenOrdered : `${data?.fillRate ?? 'NA'}`}</span>
              <span className="card-sub-title">{isPo ? `Stock When Ordered` : `Fill Rate`}</span>
            </div>
          </div>
        </div>
      </div>
      {!isPo && <CommonFlagData data={data} />}
    </div>
  );
};

export default CommonPurchaseCard;
