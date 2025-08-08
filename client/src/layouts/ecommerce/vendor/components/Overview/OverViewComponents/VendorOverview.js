import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CropIcon from '@mui/icons-material/Crop';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import PercentIcon from '@mui/icons-material/Percent';
import ViewAgendaOutlinedIcon from '@mui/icons-material/ViewAgendaOutlined';
import { Card, Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SoftTypography from '../../../../../../components/SoftTypography';
import { getVendorDeadStock, getVendorRanking, vendorTradeDetails } from '../../../../../../config/Services';

const VendorOverview = ({ vendorOverViewData }) => {
  const navigate = useNavigate();
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const totalVendors = localStorage.getItem('totalVendors');
  const { vendorId } = useParams();
  const [vendorTradeData, setVendorTradeData] = useState({});
  const [inventoryData, setInventoryData] = useState({});
  const [vendorRanking, setVendorRanking] = useState();
  useEffect(() => {
    const payload = {
      organizationId: orgId,
      locationId: locId,
      vendorId: vendorId,
    };
    vendorTradeDetails(payload)
      .then((res) => {
        setVendorTradeData(res?.data?.data);
      })
      .catch(() => {});
    getVendorDeadStock(locId, vendorId)
      .then((res) => {
        const data = res?.data?.data;
        setInventoryData(data || {});
      })
      .catch(() => {});
    getVendorRanking(orgId, locId, vendorId)
      .then((res) => {
        setVendorRanking(res?.data?.data?.rank || 'NA');
      })
      .catch(() => {});
  }, []);
  const handleNavigate = (iconText) => {
    switch (iconText) {
      case 'offer':
        navigate('/marketting/offers-promotions');
        break;
      case 'purchaseReturn':
        navigate('/purchase/purchase-returns');

        break;
      case 'stockTransfer':
        navigate('/inventory/transfers');

        break;
      case 'inventoryAdjustment':
        navigate('/inventory/stock-adjustment');
        break;
      case 'coupon':
        navigate('/marketing/Coupons');
        break;
      case 'palletIQ':
        break;
      default:
        // Optionally handle any other cases
        break;
    }
  };

  return (
    <div style={{ padding: '15px' }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Card className="vendorCardContainer">
            <SoftTypography className="vendorCardHeading" fontWeight="medium" variant="caption">
              Trade revenue
            </SoftTypography>
            <SoftTypography className="vendorCardValue">₹ {vendorTradeData?.tradeRevenue || 0}</SoftTypography>
            <SoftTypography className="vendorCardCount">
              {vendorTradeData?.totalSalePercentage || 0} % of total sales
            </SoftTypography>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card className="vendorCardContainer">
            <SoftTypography className="vendorCardHeading">Non-trade revenue</SoftTypography>
            <SoftTypography className="vendorCardValue">₹ {vendorTradeData?.nonTradeRevenue || 0}</SoftTypography>
            <SoftTypography className="vendorCardCount">
              from {vendorTradeData?.promotionCount || 0} promotions
            </SoftTypography>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card className="vendorCardContainer">
            <SoftTypography className="vendorCardHeading">Vendor ranking</SoftTypography>
            <SoftTypography className="vendorCardValue">
              {' '}
              {vendorRanking ? `${vendorRanking} / ${totalVendors}` : 'NA'}
            </SoftTypography>
            <SoftTypography className="vendorCardCount">based on purchase value</SoftTypography>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card className="vendorCardContainer">
            <SoftTypography className="vendorCardHeading" fontWeight="medium" variant="caption">
              Recievables
            </SoftTypography>
            <SoftTypography className="vendorCardValue">₹ {vendorTradeData?.receivables || 0}</SoftTypography>
            <SoftTypography className="vendorCardCount">from promotions & targets</SoftTypography>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card className="vendorCardContainer">
            <SoftTypography className="vendorCardHeading" fontWeight="medium" variant="caption">
              Estimated dead stock
            </SoftTypography>
            <SoftTypography className="vendorCardValue">
              {inventoryData?.deadStockValue ? `₹ ${Math.round(inventoryData?.deadStockValue)}` : 'NA'}{' '}
            </SoftTypography>
            <SoftTypography className="vendorCardCount">stock turnover &gt; 60 days</SoftTypography>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card className="vendorCardContainer">
            <SoftTypography className="vendorCardHeading" fontWeight="medium" variant="caption">
              Purchase fill rate
            </SoftTypography>
            <SoftTypography className="vendorCardValue">{vendorOverViewData?.purchaseFillRate || 0} %</SoftTypography>
            <SoftTypography className="vendorCardCount">
              from {vendorOverViewData?.purchaseFillRateFrom || 0} orders
            </SoftTypography>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card className="vendorCardContainer" style={{ minHeight: '140px' }}>
            <SoftTypography className="vendorCardHeading" fontWeight="medium" variant="caption">
              PO vs direct purchase
            </SoftTypography>
            <SoftTypography className="vendorCardValue">{vendorOverViewData?.poVsDirectPO || 0} %</SoftTypography>
            <SoftTypography className="vendorCardCount">
              {vendorOverViewData?.directPoCount || 0} direct purchase from {vendorOverViewData?.normalPoCount || 0}{' '}
              orders
            </SoftTypography>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card className="vendorCardContainer">
            <SoftTypography className="vendorCardHeading" fontWeight="medium" variant="caption">
              ABC analysis
            </SoftTypography>

            <Grid container>
              <Grid item xs={3}></Grid>
              <Grid item xs={3}>
                <div>
                  <SoftTypography className="vendorCardCount">Class</SoftTypography>
                  <SoftTypography className="vendorCardCount">A</SoftTypography>
                  <SoftTypography className="vendorCardCount">B</SoftTypography>
                  <SoftTypography className="vendorCardCount">C</SoftTypography>
                </div>
              </Grid>
              <Grid item xs={6}>
                <div>
                  <SoftTypography className="vendorCardCount">Stock turnover</SoftTypography>
                  <SoftTypography className="vendorCardCount">
                    {inventoryData?.inventoryAnanlysisMap?.A || 'NA'} days
                  </SoftTypography>
                  <SoftTypography className="vendorCardCount">
                    {inventoryData?.inventoryAnanlysisMap?.B || 'NA'} days
                  </SoftTypography>
                  <SoftTypography className="vendorCardCount">
                    {inventoryData?.inventoryAnanlysisMap?.C || 'NA'} days
                  </SoftTypography>
                </div>
              </Grid>
            </Grid>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card className="vendorCardContainer" style={{ minHeight: '140px' }}>
            <SoftTypography className="vendorCardHeading" fontWeight="medium" variant="caption">
              Quick links
            </SoftTypography>
            <Grid container alignItems="center" textAlign="center">
              <Grid item xs={4}>
                <PercentIcon onClick={() => handleNavigate('offer')} sx={{ cursor: 'pointer', color: '#0562FB' }} />
              </Grid>
              <Grid item xs={4}>
                <AssignmentReturnIcon
                  color="orange"
                  onClick={() => handleNavigate('purchaseReturn')}
                  sx={{ cursor: 'pointer', color: 'orange' }}
                />
              </Grid>
              <Grid item xs={4}>
                <ViewAgendaOutlinedIcon
                  onClick={() => handleNavigate('stockTransfer')}
                  sx={{ cursor: 'pointer', color: '#0562FB' }}
                />
              </Grid>
              <Grid item xs={4}>
                <CropIcon
                  onClick={() => handleNavigate('inventoryAdjustment')}
                  sx={{ cursor: 'pointer', color: '#0562FB' }}
                />
              </Grid>

              <Grid item xs={4}>
                <LocalOfferIcon onClick={() => handleNavigate('coupon')} sx={{ cursor: 'pointer', color: '#FCDC2A' }} />
              </Grid>
              <Grid item xs={4}>
                <AutoAwesomeIcon
                  onClick={() => handleNavigate('palletIQ')}
                  sx={{ cursor: 'pointer', color: '#0562FB' }}
                />
              </Grid>
            </Grid>
            {/* <SoftTypography className="vendorCardValue">83 %</SoftTypography>
            <SoftTypography className="vendorCardCount">14 direct purchase from 73 orders</SoftTypography> */}
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default VendorOverview;
