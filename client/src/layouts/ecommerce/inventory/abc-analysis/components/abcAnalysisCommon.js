import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import { Tooltip } from '@mui/material';
import SoftBox from '../../../../../components/SoftBox';
import SoftTypography from '../../../../../components/SoftTypography';
import { formatNumber } from '../../../Common/CommonFunction';
import CommonSearchBar from '../../../Common/MobileSearchBar';
import '../index.css';
import MobileSearchBar from '../../../Common/mobile-new-ui-components/mobile-searchbar';
import CustomMobileButton from '../../../Common/mobile-new-ui-components/button';

export const ACategory = ({ title }) => (
  <p className="aTab">
    <Tooltip title={title} className="aTab">
      A
    </Tooltip>
  </p>
);

export const BCategory = ({ title }) => (
  <p className="bTab">
    <Tooltip title={title} className="bTab">
      B
    </Tooltip>
  </p>
);

export const CCategory = ({ title }) => (
  <p className="bTab">
    <Tooltip title={title} className="cTab">
      C
    </Tooltip>
  </p>
);

export const ABCAnalysisHeader = ({
  searchValue,
  handleSearchValue,
  filter
}) => {

  return (
    <SoftBox>
      <SoftBox sx={{ position: 'relative', margin: '10px 0px' }}>
        <MobileSearchBar
          value={searchValue}
          placeholder={'Search...'}
          isScannerSearchbar={false}
          onChangeFunction={handleSearchValue}
        />
      </SoftBox>
      {filter}
    </SoftBox>
  );
};

export const ABCAnalysisTabs = ({ selected, handleSelectTab }) => {
  const filters = [
    { name: 'inventory', value: 'inventory' },
    { name: 'sales', value: 'sales' },
    { name: 'profit', value: 'profit' },
  ];

  return (
    <div className="listing-order-name-main" style={{marginTop: "10px"}}>
      {filters.map((filter) => (
        <CustomMobileButton
          key={filter.name}
          variant={filter.value === selected ? 'black-D' : 'black-S'}
          title={filter.name}
          onClickFunction={() => handleSelectTab(filter.value)}
          flex={1}
          justifyContent={'center'}
        >
          {filter.name}
        </CustomMobileButton>
      ))}
    </div>
  );
};

export const getABCAnalysisSummaryArray = ({ tab, analysisSummary }) => {
  // summary array
  // inventory
  return tab === 'inventory'
    ? [
        {
          title: <b>Total Stock Value</b>,
          value: (
            <>
              <CurrencyRupeeIcon />
              {`
         ${formatNumber(analysisSummary?.totalStockValue)} from ${formatNumber(
                analysisSummary?.totalStockCount,
              )} products`}
            </>
          ),
        },
        {
          title: (
            <>
              {/* <p className="aTab">A</p> */}
              <ACategory title={'Highest Consumption'} />
              <p className="displayInline"> - Stock Turnover &lt; 15days</p>
            </>
          ),
          value: (
            <>
              <CurrencyRupeeIcon />
              {` ${formatNumber(analysisSummary?.inventoryAValue)} from ${formatNumber(
                analysisSummary?.inventoryACount,
              )} products`}
            </>
          ),
        },
        {
          title: (
            <>
              <BCategory title={'Average Consumption'} />
              <p className="displayInline"> - Stock Turnover 15 - 45 days</p>
            </>
          ),
          value: (
            <>
              <CurrencyRupeeIcon />{' '}
              {`${formatNumber(analysisSummary?.inventoryBValue)} from ${formatNumber(
                analysisSummary?.inventoryBCount,
              )} products`}
            </>
          ),
        },
        {
          title: (
            <>
              <CCategory title={'Lowest Consumption'} />
              <p className="displayInline"> - Stock Turnover &gt; 45days</p>
            </>
          ),
          value: (
            <>
              <CurrencyRupeeIcon />
              {`${formatNumber(analysisSummary?.inventoryCValue)} from ${formatNumber(
                analysisSummary?.inventoryCCount,
              )} products`}
            </>
          ),
        },
        {
          title: <p className="dTab">Dead Stock</p>,
          value: (
            <>
              <CurrencyRupeeIcon />
              {`
            ${formatNumber(analysisSummary?.inventoryDValue)} from ${formatNumber(
                analysisSummary?.inventoryDCount,
              )} products
            `}
            </>
          ),
        },
      ]
    : tab === 'sales'
    ? [
        {
          title: <b>Total Sales</b>,
          value: (
            <>
              {/* Rs. 26,894 from 2493/3892 products */}
              <CurrencyRupeeIcon />
              {`${formatNumber(analysisSummary?.totalStockValue)} from ${formatNumber(
                analysisSummary?.totalStockCount,
              )} products`}
            </>
          ),
        },
        {
          title: (
            <>
              <ACategory title={'Fast Movement'} />
              <p className="displayInline"> - Net Revenue &gt; 10000</p>
            </>
          ),
          value: (
            <>
              <CurrencyRupeeIcon />
              {` ${formatNumber(analysisSummary?.salesAValue)} from ${formatNumber(
                analysisSummary?.salesACount,
              )} products`}
            </>
          ),
        },
        {
          title: (
            <>
              <BCategory title={'Average Movement'} />
              <p className="displayInline"> - Net Revenue 5000 - 10000</p>
            </>
          ),
          value: (
            <>
              <CurrencyRupeeIcon />{' '}
              {`${formatNumber(analysisSummary?.salesBValue)} from ${formatNumber(
                analysisSummary?.salesBCount,
              )} products`}
            </>
          ),
        },
        {
          title: (
            <>
              <CCategory title={'Low Movement'} />
              <p className="displayInline"> - Net Revenue &lt; 5000</p>
            </>
          ),
          value: (
            <>
              <CurrencyRupeeIcon />
              {`${formatNumber(analysisSummary?.salesCValue)} from ${formatNumber(
                analysisSummary?.salesCCount,
              )} products`}
            </>
          ),
        },
        {
          title: <p className="dTab">Un-Sold</p>,
          value: (
            <>
              <CurrencyRupeeIcon />
              {`
            ${formatNumber(analysisSummary?.salesDValue)} from ${formatNumber(analysisSummary?.salesDCount)} products`}
            </>
          ),
        },
      ]
    : tab === 'profit' && [
        {
          title: <b>Total Profit</b>,
          value: (
            <>
              {/* Rs. 26,894 (or) 13% margin of total sales */}
              <CurrencyRupeeIcon />
              {`${formatNumber(analysisSummary?.totalStockValue)} from ${formatNumber(
                analysisSummary?.totalStockCount,
              )} products`}
            </>
          ),
        },
        {
          title: (
            <>
              <ACategory title={'Highest Value'} />
              <p className="displayInline"> - Gross Profit &gt; 10%</p>
            </>
          ),
          value: (
            <>
              <CurrencyRupeeIcon />
              {` ${formatNumber(analysisSummary?.profitAValue)} from ${formatNumber(
                analysisSummary?.profitACount,
              )} products`}
            </>
          ),
        },
        {
          title: (
            <>
              <BCategory title={'Average Value'} />
              <p className="displayInline"> - Gross Profit 7% - 10%</p>
            </>
          ),
          value: (
            <>
              <CurrencyRupeeIcon />{' '}
              {`${formatNumber(analysisSummary?.profitBValue)} from ${formatNumber(
                analysisSummary?.profitBCount,
              )} products`}
            </>
          ),
        },
        {
          title: (
            <>
              <CCategory title={'Lowest Value'} />
              <p className="displayInline"> - Gross Profit &lt; 7%</p>
            </>
          ),
          value: (
            <>
              <CurrencyRupeeIcon />
              {`${formatNumber(analysisSummary?.profitCValue)} from ${formatNumber(
                analysisSummary?.profitCCount,
              )} products`}
            </>
          ),
        },
        {
          title: <p className="dTab">Sold &lt; Purchase Price</p>,
          value: (
            <>
              <CurrencyRupeeIcon />
              {`
            ${formatNumber(analysisSummary?.profitDValue)} from ${formatNumber(
                analysisSummary?.profitDCount,
              )} products`}
            </>
          ),
        },
      ];
};
