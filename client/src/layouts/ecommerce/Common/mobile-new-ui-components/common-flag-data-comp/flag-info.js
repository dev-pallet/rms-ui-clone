import { categoryColourValue, getTagDescriptionValue } from '../../CommonFunction';
import './common-flag-data-comp.css';
const FlagCommonInfo = ({ data }) => {
  return (
    <div>
      <div className="abc-anaylsis-main-parent">
        <div
          className="abc-analaysis-main-info"
          style={{
            backgroundColor: categoryColourValue(data?.profitFlag),
          }}
        >
          <span>{getTagDescriptionValue('PROFIT', data?.profitFlag)}</span>
        </div>
        <div
          className="abc-analaysis-main-info"
          style={{
            backgroundColor: categoryColourValue(data?.salesFlag),
          }}
        >
          <span>{getTagDescriptionValue('SALES', data?.salesFlag)}</span>
        </div>
        <div
          className="abc-analaysis-main-info"
          style={{
            backgroundColor: categoryColourValue(data?.inventoryFlag),
          }}
        >
          <span>{getTagDescriptionValue('INVENTORY', data?.inventoryFlag)}</span>
        </div>
      </div>
      <div className="abc-analysis-main-data">
        <div className="stack-row-center-between width-100">
          <span className="abc-analysis-title-secondary">Average sales per week</span>
          <span className="abc-analysis-value">{data?.salesPerWeek ?? 'NA'}</span>
        </div>
        <div className="stack-row-center-between width-100">
          <span className="abc-analysis-title-secondary">Purchase Margin</span>
          <span className="abc-analysis-value">{(data?.purchaseMargin ?? 'NA') + '%'}</span>
        </div>
      </div>
      <span className="abc-analysis-note">*This analysis shows how the products are doing in the store</span>
    </div>
  );
};

export default FlagCommonInfo;
