import './TableSummaryDiv.css';
import { isSmallScreen } from '../../CommonFunction';
import SoftBox from '../../../../../components/SoftBox';
import SoftTypography from '../../../../../components/SoftTypography';
import TableSummarySkeleton from './skeleton/TableSummarySkeleton';

export default function TableSummaryDiv({ summaryHeading, summaryArray, length, loader, lastUpdatedOn }) {
  const isMobileDevice = isSmallScreen();

  const renderSummaryCardSkeleton = () => {
    const len = length || 4;
    const components = [];
    for (let i = 0; i < len; i++) {
      components.push(<TableSummarySkeleton key={i} />);
    }
    return components;
  };

  return (
    <SoftBox
      className={isMobileDevice ? 'summary-mobile-style' : 'summary-default-style'}
      // sx={{ backgroundColor: '#ffffff', marginTop: '10px', padding: '10px', borderRadius: '4px' }}
    >
      <SoftTypography className={isMobileDevice ? 'heading-summary-mobile' : 'heading-summary'}>
        {summaryHeading}
        {!isMobileDevice && lastUpdatedOn && <span className="last_updated">{`Last Updated on ${lastUpdatedOn}`}</span>}
      </SoftTypography>

      <SoftBox
        sx={{
          display: 'grid',
          gridTemplateColumns: !isMobileDevice
            ? `repeat(${summaryArray.length}, 1fr)`
            : `repeat(${summaryArray.length}, 100%)`,
          gap: '10px',
          overflow: isMobileDevice && 'scroll',
        }}
      >
        {loader
          ? renderSummaryCardSkeleton()
          : summaryArray?.map((item, index) => (
              <>
                <SoftBox
                  paddingLeft={!isMobileDevice && '0px !important'}
                  className={
                    isMobileDevice
                      ? `stock-transfer-summary-div-mobile ${
                          index !== summaryArray.length - 1 && 'stock-transfer-summary-div'
                        }`
                      : index !== summaryArray.length - 1 && 'stock-transfer-summary-div '
                  }
                >
                  <SoftTypography className="sub-heading-summary">{item?.title}</SoftTypography>
                  <SoftTypography className="stock-transfer-text">{item?.value}</SoftTypography>
                </SoftBox>
                {/* {index !== summaryArray.length - 1 && <SoftBox className="stock-transfer-summary-div"></SoftBox>} */}
              </>
            ))}
      </SoftBox>
      {lastUpdatedOn && isMobileDevice && (
        <SoftTypography position="relative">
          {<span className="last_updated_mobile">{`Last Updated on ${lastUpdatedOn}`}</span>}
        </SoftTypography>
      )}
    </SoftBox>
  );
}
