import { isSmallScreen } from '../../../../CommonFunction';
import './additional-details-tab.css';

const AdditionalDetTab = ({ tabData, index, length, additionalDetails }) => {
  const isMobileDevice = isSmallScreen();
  return (
    <div
      className="addDet-tab-main-container"
      style={{ borderRight: !isMobileDevice ? (index === length ? 'none' : '2px solid #c2c2c2') : 'unset' }}
    >
      <div className="title-download-addDetTab">
        <span className="addDet-tabname">{tabData?.tabName}</span>
        <div className="tab-icon-div">{tabData?.tabIcon}</div>
      </div>
      <span className="addDet-value">{additionalDetails?.[tabData.tabValue] || 'NA'}</span>
      <span className="addDet-desc">{tabData?.tabDescription}</span>
    </div>
  );
};

export default AdditionalDetTab;
