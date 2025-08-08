import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import CommonMobileTabs from '../../Common/mobile-new-ui-components/Common-mobile-tabs';
// import './ros-app-inventory.css';
import { ABCAnalysis } from '../abc-analysis';
import { ExpiryManagement } from '../expiry-management';
import { StockAdjustment } from '../stock-adjustment';
import { StockBalance } from '../stock-balance';
import { StockCount } from '../stock-count';
import { StockTransfer } from '../stock-transfer';
import Inward from '../../product/inward';
import OverSold from '../oversold';

const RosAppInventory = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchParams.get('query') || '');
  const [activeInventoryTab, setActiveInventoryTab] = useState(searchParams.get('value'));

  useEffect(() => {
    const tabValue = searchParams.get('value');
    if (tabValue !== activeInventoryTab) {
      setActiveInventoryTab(tabValue);
    }
  }, [searchParams]);

  const inventoryTabs = useMemo(
    () => [
      {
        tabName: 'Stock Count',
        tabValue: 'stockCount',
        active: activeInventoryTab === 'stockCount' ? true : false,
      },
      {
        tabName: 'Stock Balance',
        tabValue: 'stockBalance',
        active: activeInventoryTab === 'stockBalance' ? true : false,
      },
      { tabName: 'Oversold', tabValue: 'oversold', active: activeInventoryTab === 'oversold' ? true : false },
      { tabName: 'Adjustments', tabValue: 'adjustments', active: activeInventoryTab === 'adjustments' ? true : false },
      { tabName: 'Stock Transfer', tabValue: 'stockTransfer', active: activeInventoryTab === 'stockTransfer' ? true : false },
      { tabName: 'Expiry Management', tabValue: 'expiryManagement', active: activeInventoryTab === 'expiryManagement' ? true : false },
      { tabName: 'ABC Analysis', tabValue: 'abcAnalysis', active: activeInventoryTab === 'abcAnalysis' ? true : false },
      { tabName: 'Repacking', tabValue: 'repacking', active: activeInventoryTab === 'repacking' ? true : false },
    ],
    [activeInventoryTab],
  );

  const tabChangeHandler = (tabValue) => {
    setActiveInventoryTab(tabValue);
    searchParams.set('value', tabValue);
    searchParams.delete('query');
    searchParams.delete('page'); 
    searchParams.delete('tab');
    setSearchParams(searchParams);
    setSearchValue('');
  };

  const titleHandler = useCallback(() => {
    let title =
      activeInventoryTab === 'stockCount'
        ? 'Stock Count Listing'
        : activeInventoryTab === 'stockBalance'
        ? 'Stock Balance'
        : activeInventoryTab === 'oversold'
        ? 'Oversold'
        : activeInventoryTab === 'adjustment'
        ? 'Adjustments'
        : activeInventoryTab === 'stockTransfer'
        ? 'Stock Transfer'
        : activeInventoryTab === 'expiryManagement'
        ? 'Expiry Management'
        : activeInventoryTab === 'abcAnalysis'
        ? 'ABC Analysis'
        : 'NA';

    return title;
  }, [activeInventoryTab]);

  return (
    <div className="ros-purchase-app-parent-container">
      <div className="purchase-tabs-main-div">
        <CommonMobileTabs tabs={inventoryTabs} onTabChange={tabChangeHandler} />
      </div>
      <div>
        {activeInventoryTab === 'stockCount' && <StockCount />}
        {activeInventoryTab === 'stockBalance' && <StockBalance />}
        {activeInventoryTab === 'oversold' && <OverSold />}
        {activeInventoryTab === 'stockTransfer' && <StockTransfer />}
        {activeInventoryTab === 'adjustments' && <StockAdjustment />}
        {activeInventoryTab === 'expiryManagement' && <ExpiryManagement />}
        {activeInventoryTab === 'abcAnalysis' && <ABCAnalysis />}
        {activeInventoryTab === 'repacking' && <Inward />}
      </div>
    </div>
  );
};

export default RosAppInventory;
