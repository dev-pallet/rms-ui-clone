import React, { useState } from 'react';
import SoftButton from '../../../../../../components/SoftButton';
import { Box, Tab, Tabs } from '@mui/material';

function TabNavigator() {
  const listOfTabs = ['Overview'];
  const [tabValue, setTabValue] = useState('Overview');

  const handleTabChange = (e, newVal) => {
    setTabValue(newVal);
  };
  return (
    <Box sx={{ margin: '20px 0', display: 'flex', gap: '5px', width: '100%' }}>
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        TabIndicatorProps={{ sx: { display: 'none' } }}
        sx={{
          background: 'transparent',
          '& .MuiTabs-flexContainer': {
            flexWrap: 'wrap',
            gap: '5px',
          },
        }}
      >
        {listOfTabs?.map((el, index) => (
          <Tab
            key={index}
            label={el}
            value={el}
            sx={{ width: '130px' }}
            className={tabValue == el ? 'overviewBtnStyle' : 'defaultvendorTabstyle'}
          />
        ))}
      </Tabs>
    </Box>
  );
}

export default TabNavigator;
