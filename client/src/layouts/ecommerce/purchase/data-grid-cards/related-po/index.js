import '../data-grid-card.css';
import { Divider, Grid, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CommonStatus from '../../../Common/mobile-new-ui-components/status';

const RelatedPoCard = ({ data, index }) => {
  const navigate = useNavigate();

  const handleNavigate = (ele) => {
    if (ele?.purchaseOrder?.includes('PO')) {
      navigate(`/purchase/purchase-orders/details/${ele?.purchaseOrder}`);
    }
    // else if(ele?.purchaseOrder.includes('EXP')){
    //   navigate(`/purchase/express-grn/details/${ele?.purchaseOrder}`);
    // }
  };
  return (
    <div className="card-purchase-main-div card-main-component" key={index} onClick={() => handleNavigate(data)}>
      <div className="width-100 stack-row-center-between">
        <div className="flex-colum-align-start">
          <span className="card-title">{data?.purchaseOrder}</span>
          <span className="card-sub-title">{data?.date}</span>
        </div>
        <div className="flex-colum-align-end">
          <span className="card-title">{data?.poValue}</span>
          <span className="card-sub-title">Estimated Value</span>
        </div>
      </div>
      <hr className="horizontal-line-app-ros" />
      <div className="width-100 stack-row-center-between">
        <div className="flex-colum-align-start">
          <span className="card-title">{data?.fillRate}</span>
          <span className="card-sub-title">Fill Rate</span>
        </div>
        <div className="flex-colum-align-end">
          <span className="card-title">{data?.procurementCycle} Days</span>
          <span className="card-sub-title">Procurement Cycle</span>
        </div>
      </div>
      <div className="width-100 stack-row-center-between">
        <div className="flex-colum-align-start">
          <span className="card-title">{data?.delivery}</span>
          <span className="card-sub-title">Delivery</span>
        </div>
        <div className="flex-colum-align-end">
          <CommonStatus status={data?.status} />
        </div>
      </div>
    </div>
  );
};

export default RelatedPoCard;
