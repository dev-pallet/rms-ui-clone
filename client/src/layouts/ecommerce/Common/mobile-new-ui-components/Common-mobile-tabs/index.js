import React from 'react';

const CommonMobileTabs = ({ tabs, onTabChange }) => {
  return (
    <>
      {tabs?.map((tab) => (
        <div className="purchase-tab" onClick={() => onTabChange(tab?.tabValue)}>
          <span className={tab?.active ? 'purchase-tab-active' : 'purchase-tab-deactive'}>{tab?.tabName}</span>
        </div>
      ))}
    </>
  );
};

export default CommonMobileTabs;
