import './franchise-overview.css';
import { Grid, Tab, Tabs } from '@mui/material';
import FranchiseContactInformation from '../../../adding-franchise/components/Contact-information';
import OverviewAddressInfo from './components/overview-address-info';
import OverviewBInfo from './components/overview-binfo';
import OverviewBankInfo from './components/overview-bank-info';
import OverviewCustomers from './components/overview-customer';
import OverviewOtherInfo from './components/overview-other-info';
import OverviewProducts from './components/overview-products';
import OverviewPurchases from './components/overview-purchases';
import React, { useState } from 'react';
import SoftBox from '../../../../../../components/SoftBox';

const FranchiseOverview = () => {
  const [detailsTabValue, setDetailsTabValue] = useState('0');
  const [isDetailPage, setIsDetailPage] = useState(true);

  const [contactInformation, setContactInformation] = useState([
    {
      isPrimary: false,
      firstName: '',
      lastName: '',
      mobileNumber: '',
      email: '',
      key: 0,
    },
  ]);

  const detailsTabsHandler = (e, newValue) => {
    setDetailsTabValue(newValue);
  };
  return (
    <SoftBox>
      <SoftBox className="franchise-details-main-div">
        <Tabs value={detailsTabValue} onChange={detailsTabsHandler}>
          <Tab label="Overview" value="0" />
          <Tab label="Sales" value="1" />
          <Tab label="Purchases" value="2" />
          <Tab label="Customers" value="3" />
          <Tab label="Products" value="4" />
          <Tab label="Statement" value="5" />
        </Tabs>
      </SoftBox>
      {detailsTabValue === '0' && (
        <SoftBox className="frn-det-overview-main-div">
          <Grid container spacing={2}>
            <Grid item lg={6} md={6} sm={6} xs={12}>
              <OverviewBInfo />
            </Grid>
            <Grid item lg={6} md={6} sm={6} xs={12}>
              <OverviewAddressInfo />
            </Grid>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <FranchiseContactInformation
                contactInformation={contactInformation}
                setContactInformation={setContactInformation}
                isDetailPage={isDetailPage}
                setIsDetailPage={setIsDetailPage}
              />
            </Grid>
            <Grid item lg={6} md={6} sm={6} xs={12}>
              <OverviewOtherInfo />
            </Grid>
            <Grid item lg={6} md={6} sm={6} xs={12}>
              <OverviewBankInfo />
            </Grid>
          </Grid>
        </SoftBox>
      )}
      {detailsTabValue === '2' && (
        <>
          <OverviewPurchases />
        </>
      )}
      {detailsTabValue === '3' && (
        <>
          <OverviewCustomers />
        </>
      )}
      {detailsTabValue === '4' && (
        <>
          <OverviewProducts />
        </>
      )}
      
    </SoftBox>
  );
};

export default FranchiseOverview;
