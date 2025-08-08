import { textFormatter } from '../../../Common/CommonFunction';
import '../data-grid-card.css';

const InwardCard = ({ data, index }) => {
  return (
    <div className="card-purchase-main-div inward-card-ros-app" key={index}>
      <span className="inward-card-title-app">{textFormatter(data?.title)}</span>
      <hr className="horizontal-line-app-ros" />
      <div className="width-100 stack-cloumn-start inward-card-info-main-div">
        <div className="stack-row-center-between width-100">
          <div className="flex-colum-align-start">
            <span className="inward-info-title-ros-app">MRP</span>
            <span className="inward-info-value-ros-app">{data?.mrp}</span>
          </div>
          <div className="flex-colum-align-end">
            <span className="inward-info-title-ros-app">Qty</span>
            <span className="inward-info-value-ros-app">{data?.quantity}</span>
          </div>
        </div>
        <div className="stack-row-center-between width-100">
          <div className="flex-colum-align-start">
            <span className="inward-info-title-ros-app">Tax</span>
            <span className="inward-info-value-ros-app">{data?.tax}</span>
          </div>
          <div className="flex-colum-align-end">
            <span className="inward-info-title-ros-app">Purchase Cost</span>
            <span className="inward-info-value-ros-app">{data?.purchaseCost}</span>
          </div>
        </div>
        <div className="stack-row-center-between width-100">
          <div className="flex-colum-align-start">
            <span className="inward-info-title-ros-app">Cess</span>
            <span className="inward-info-value-ros-app">{data?.cess}</span>
          </div>
          <div className="flex-colum-align-end">
            <span className="inward-info-title-ros-app">Cost/unit</span>
            <span className="inward-info-value-ros-app">{data?.costPerUnit}</span>
          </div>
        </div>
        <div className="stack-row-center-between width-100">
          <div className="flex-colum-align-start">
            <span className="inward-info-title-ros-app">Purchase Margin</span>
            <span className="inward-info-value-ros-app">{data?.purchaseMargin}</span>
          </div>
          <div className="flex-colum-align-end">
            <span className="inward-info-title-ros-app">Total Amount</span>
            <span className="inward-info-value-ros-app">{data?.totalAmount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InwardCard;
