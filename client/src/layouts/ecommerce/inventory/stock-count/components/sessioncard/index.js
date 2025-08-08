// import Watermark from '../watermark/watermark';
import { formatDateDDMMYYYY, textFormatter } from '../../../../Common/CommonFunction';
import CommonStatus from '../../../../Common/mobile-new-ui-components/status';
import './index.css';

export const SessionCard = ({ onClick, sessionDetails }) => {

  return (
    <div className="listing-card-main-bg" onClick={onClick}>
        <div className='stack-row-center-between width-100'>
          <span className='vendor-name-bills-list'>
            {sessionDetails?.title || 'NA'} 
          </span>
          <div>
            <CommonStatus status={sessionDetails?.status === 'CREATED' ? textFormatter(sessionDetails?.status) : sessionDetails?.status}/>
          </div>
        </div>
        <hr className="horizontal-line-app-ros"/>
        <div className='stack-row-center-between width-100'>
          <div className="flex-colum-align-start">
            <span className="bill-card-label">
              Counted Products
            </span>
            <span className="bill-card-value">
            {`${sessionDetails?.productsCounted}/${sessionDetails?.productsCount}`}
            </span>
          </div>
          <div className="flex-colum-align-center">
            {sessionDetails?.targetProduct &&
              <span className="bill-card-label">
                Targeted Products
              </span>
            }
            <span className="bill-card-value">
              {sessionDetails?.targetProduct || 'One Time'}
            </span>
          </div>
          <div className="flex-colum-align-end ">
          {/* {sessionDetails?.jobType === 'OPEN' ? 'Target Products' : 'Product Counted'} */}
            <span className='bill-card-label'>Start Date</span>
            <span className='bill-card-value'>{formatDateDDMMYYYY(sessionDetails?.expectedStartDate) || 'NA'}</span>
          </div>
        </div>
      {/* </div> */}
    </div>
  );
};
