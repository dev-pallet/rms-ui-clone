/**
=========================================================
* Soft UI Dashboard PRO React - v4.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-pro-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState } from 'react';

// @mui material components
import Grid from '@mui/material/Grid';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
// import {getVendorVendorCredit} from "../../../../../../../config/Services";

// Soft UI Dashboard PRO React components
import SoftBox from 'components/SoftBox';

// Soft UI Dashboard PRO React example components
import DefaultStatisticsCard from 'examples/Cards/StatisticsCards/DefaultStatisticsCard';

// styles
import './other-details.css';

function OtherDetails({ purchaseData, vendorUnits, availableStock }) {
  // DefaultStatisticsCard state for the dropdown value

  const [salesDropdownValue, setSalesDropdownValue] = useState('Today');
  const [customersDropdownValue, setCustomersDropdownValue] = useState('Today');
  const [revenueDropdownValue, setRevenueDropdownValue] = useState('Today');

  // DefaultStatisticsCard state for the dropdown action
  const [salesDropdown, setSalesDropdown] = useState(null);
  const [customersDropdown, setCustomersDropdown] = useState(null);
  const [revenueDropdown, setRevenueDropdown] = useState(null);

  // DefaultStatisticsCard handler for the dropdown action
  const openSalesDropdown = ({ currentTarget }) => setSalesDropdown(currentTarget);
  const closeSalesDropdown = ({ currentTarget }) => {
    setSalesDropdown(null);
    setSalesDropdownValue(currentTarget.innerText || salesDropdownValue);
  };
  const openCustomersDropdown = ({ currentTarget }) => setCustomersDropdown(currentTarget);
  const closeCustomersDropdown = ({ currentTarget }) => {
    setCustomersDropdown(null);
    setCustomersDropdownValue(currentTarget.innerText || salesDropdownValue);
  };
  const openRevenueDropdown = ({ currentTarget }) => setRevenueDropdown(currentTarget);
  const closeRevenueDropdown = ({ currentTarget }) => {
    setRevenueDropdown(null);
    setRevenueDropdownValue(currentTarget.innerText || salesDropdownValue);
  };

  // Dropdown menu template for the DefaultStatisticsCard
  const renderMenu = (state, close) => (
    <Menu
      anchorEl={state}
      transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      open={Boolean(state)}
      onClose={close}
      keepMounted
      disableAutoFocusItem
    >
      <MenuItem onClick={close}>Last week</MenuItem>
      <MenuItem onClick={close}>Last month</MenuItem>
    </Menu>
  );

  return (
    <SoftBox className="other-details-box" p={3}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <DefaultStatisticsCard
            title="total purchase"
            count={purchaseData.length ? purchaseData[0].totalOrders : 0}
            dropdown={{
              action: openSalesDropdown,
              menu: renderMenu(salesDropdown, closeSalesDropdown),
              value: salesDropdownValue,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <DefaultStatisticsCard
            title="outstanding payables"
            count={purchaseData.length ? purchaseData[0].outstandingPayable : 0}
            dropdown={{
              action: openCustomersDropdown,
              menu: renderMenu(customersDropdown, closeCustomersDropdown),
              value: customersDropdownValue,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <DefaultStatisticsCard
            title="Orders in progress"
            count={purchaseData.length ? purchaseData[0].orderInProgress : 0}
            dropdown={{
              action: openRevenueDropdown,
              menu: renderMenu(revenueDropdown, closeRevenueDropdown),
              value: revenueDropdownValue,
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <DefaultStatisticsCard
            title="Vendor Credit"
            count={vendorUnits ? vendorUnits : 0}
            dropdown={{
              action: openRevenueDropdown,
              menu: renderMenu(revenueDropdown, closeRevenueDropdown),
              value: revenueDropdownValue,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <DefaultStatisticsCard
            title="Available Stock Value"
            count={availableStock !== null ? availableStock?.availableStock : 0}
            dropdown={{
              action: openRevenueDropdown,
              menu: renderMenu(revenueDropdown, closeRevenueDropdown),
              value: revenueDropdownValue,
            }}
          />
        </Grid>
      </Grid>
    </SoftBox>
  );
}

export default OtherDetails;
