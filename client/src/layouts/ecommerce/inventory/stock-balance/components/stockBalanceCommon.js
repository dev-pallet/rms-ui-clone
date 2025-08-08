import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import dayjs from 'dayjs';
import SoftBox from '../../../../../components/SoftBox';
import { formatNumber } from '../../../Common/CommonFunction';
import TableSummaryDiv from '../../../Common/new-ui-common-components/table-summary-div/TableSummaryDiv';
import PurchaseAdditionalDetails from '../../../purchase/ros-app-purchase/components/purchase-additional-details';

export const StockBalanceTableSummaryDiv = ({ summaryLoader, analysisSummary, lastUpdatedOn, isMobileDevice }) => {
  const summaryArray = [
    {
      title: 'Total Stock Value',
      value: (
        <>
          <CurrencyRupeeIcon />
          {`${formatNumber(analysisSummary?.totalStockValue)} from ${formatNumber(
            analysisSummary?.totalStock,
          )} products`}
        </>
      ),
    },
    {
      title: <SoftBox color="warning">Incoming Stock</SoftBox>,
      value: (
        <>
          <CurrencyRupeeIcon />
          {`${formatNumber(analysisSummary?.totalIncomingValue)} from ${formatNumber(
            analysisSummary?.totalIncomingStock,
          )} orders`}
        </>
      ),
    },
    {
      title: <SoftBox>Committed for Sale</SoftBox>,
      value: (
        <>
          <CurrencyRupeeIcon />
          {`${formatNumber(analysisSummary?.totalCommitedValue)} from ${formatNumber(
            analysisSummary?.totalCommitedStock,
          )} orders`}
        </>
      ),
    },
    {
      title: 'Wastage',
      value: (
        <>
          <CurrencyRupeeIcon />
          {`${formatNumber(analysisSummary?.totalWastageValue)} from ${formatNumber(
            analysisSummary?.totalWastageStock,
          )} products`}
        </>
      ),
    },
    {
      title: 'Returns',
      value: (
        <>
          <CurrencyRupeeIcon />
          {`${formatNumber(analysisSummary?.totalReturnsValue)} from ${formatNumber(
            analysisSummary?.totalReturnsStock,
          )} returns`}
        </>
      ),
    },
  ];

  return (
    <>
      {!isMobileDevice ? (
        <TableSummaryDiv
          summaryHeading={'Stock Summary'}
          summaryArray={analysisSummary !== undefined ? summaryArray : []}
          loader={summaryLoader}
          length={summaryArray.length}
          lastUpdatedOn={lastUpdatedOn !== null ? dayjs(lastUpdatedOn).format('D MMMM h:mm A') : null}
        />
      ) : (
        <>
          <PurchaseAdditionalDetails additionalDetailsArray={summaryArray} />
          <div className="content-right" style={{margin: '10px 0px'}}>
            {lastUpdatedOn && (
              <span className="last_updated_mobile">{`Last Updated on ${dayjs(lastUpdatedOn).format(
                'D MMMM h:mm A',
              )}`}</span>
            )}
          </div>
        </>
      )}
    </>
  );
};
