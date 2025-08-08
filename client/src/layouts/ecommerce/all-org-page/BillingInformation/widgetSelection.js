import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Badge, Card, Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SoftBox from '../../../../components/SoftBox';
import SoftButton from '../../../../components/SoftButton';
import SoftTypography from '../../../../components/SoftTypography';
import { getDashboardSalesValues } from '../../../../config/Services';
import PageLayout from '../../../../examples/LayoutContainers/PageLayout';
import CartMetrics from '../../../dashboard widgets/Cart Metrics/CartMetrics';
import CouponDiscountMiniStatisticsCard from '../../../dashboard widgets/coupon/totalDiscountValue';
import CustomerMiniStatisticsCard from '../../../dashboard widgets/Customers/totalCustomer';
import ReconcillationMiniStatisticsCard from '../../../dashboard widgets/GST Reconcillation/gstReconcillation';
import PruchaseMiniStatisticsCard from '../../../dashboard widgets/Purchase/totalPurchase';
import ProfitsMiniStatisticsCard from '../../../dashboard widgets/Sales/totalProfits';
import TotalPruchaseMiniStatisticsCard from '../../../dashboard widgets/Sales/totalPurchase';
import SalesMiniStatisticsCard from '../../../dashboard widgets/Sales/totalSales';
import SalesMiniStatisticsCardToday from '../../../dashboard widgets/Sales/totalTodaySales';
import YearlySalesMiniStatisticsCard from '../../../dashboard widgets/Sales/totalyearlySales';
import StockOverviewValue from '../../../dashboard widgets/StockOverview/StockOverviewValue';
import VendorMiniStatisticsCard from '../../../dashboard widgets/Vendor/totalVendor';

const fontHeading = {
  fontSize: '1rem',
  opacity: '0.7',
  fontWeight: 'bold',
};

const cardStyle = {
  boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
  padding: '15px',
};
const prevOrder = {
  fontSize: '0.9rem',
  fontWeight: 'bold',
};

const header = {
  padding: '15px',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderRadius: 'none !important',
  backgroundColor: '#0562fb',
};
const availableWidgets = [
  "Today's Sale",
  'Monthly Sale',
  'Yearly Sale',
  "Today's Purchase",
  'Monthly Purchase',
  'Yearly Purchase',
  'dayProfit',
  'Profits',
  'New Customers',
  'New Vendor',
  'Coupon Discount',
  'StockOverView',
  'GST',
  'Order Metrics',
  'Cart Metrics',
  'GRN Metrics',
];
const WidgetSelection = () => {
  const navigate = useNavigate();
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const [salesData, setSalesData] = useState({});
  const [showBadge, setShowBadge] = useState(false);
  const [filteredWidgets, setFilteredWidgets] = useState(
    JSON.parse(localStorage.getItem('selectedWidgets')) || availableWidgets,
  );

  useEffect(() => {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());

    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    const payload = {
      startDate: formatDate(today),
      orgId: orgId,
      locationId: locId,
    };
    getDashboardSalesValues(payload)
      .then((res) => {
        setSalesData(res?.data?.data?.salesData || {});
      })
      .catch(() => {});
  }, []);

  function filterWidgets(widgetToFilter) {
    const widgetIndex = filteredWidgets.indexOf(widgetToFilter);

    const newFilteredWidgets = [...filteredWidgets];

    if (widgetIndex === -1) {
      newFilteredWidgets.push(widgetToFilter);
    } else {
      newFilteredWidgets.splice(widgetIndex, 1);
    }

    setFilteredWidgets(newFilteredWidgets);
    // localStorage.setItem('filteredWidgets', JSON.stringify(newFilteredWidgets));
  }

  const handleRestore = () => {
    setFilteredWidgets(availableWidgets);
  };
  const handleSave = () => {
    localStorage.setItem('selectedWidgets', JSON.stringify(filteredWidgets));
    navigate(-1);
  };

  const renderComponent = (widget) => {
    switch (widget) {
      case "Today's Sale":
        return (
          <SalesMiniStatisticsCardToday
            title={{ text: "Today's Sales", fontWeight: 'bold' }}
            percentage={{ color: 'success', text: '+12%' }}
            icon={{ component: <CurrencyRupeeIcon /> }}
            orgId={orgId}
          />
        );
      case 'Monthly Sale':
        return (
          <SalesMiniStatisticsCard
            title={{ text: 'Monthly sales', fontWeight: 'bold' }}
            percentage={{ color: 'success', text: '+12%' }}
            // icon={{ color: 'info', component: 'paid' }}
            icon={{ component: <CurrencyRupeeIcon /> }}
            orgId={orgId}
          />
        );
      case 'Yearly Sale':
        return (
          <YearlySalesMiniStatisticsCard
            title={{ text: 'Yearly sales', fontWeight: 'bold' }}
            percentage={{ color: 'success', text: '+12%' }}
            // icon={{ color: 'info', component: 'paid' }}
            icon={{ component: <CurrencyRupeeIcon /> }}
            orgId={orgId}
          />
        );
      case "Today's Purchase":
        return (
          <TotalPruchaseMiniStatisticsCard
            title={{ text: "Today's purchase", fontWeight: 'bold' }}
            icon={{ color: 'info', component: 'shopping_basket' }}
            orgId={orgId}
          />
        );
      case 'Monthly Purchase':
        return (
          <PruchaseMiniStatisticsCard
            title={{ text: 'Monthly purchase', fontWeight: 'bold' }}
            icon={{ color: 'info', component: 'shopping_basket' }}
            orgId={orgId}
            duration={'Monthly'}
          />
        );
      case 'Yearly Purchase':
        return (
          <PruchaseMiniStatisticsCard
            title={{ text: 'Yearly purchase', fontWeight: 'bold' }}
            icon={{ color: 'info', component: 'shopping_basket' }}
            orgId={orgId}
            duration={'Yearly'}
          />
        );
      case 'GST':
        return (
          <ReconcillationMiniStatisticsCard
            title={{ text: 'GST reconciliation', fontWeight: 'bold' }}
            icon={{ color: 'info', component: 'star' }}
            percentage={{ color: 'success' }}
            random={{
              title: 'Input credit',
              //   Value: `₹ ${inputCredit}`,
              note: '(Tax paid on all purchase)',
            }}
            random1={{
              title: 'Tax on Output',
              //   Value: `₹ ${gstCollected}`,
              note: ' (Tax collected from all sales)',
            }}
          />
        );
      case 'Profits':
        return (
          <ProfitsMiniStatisticsCard
            title={{ text: 'Monthly Profits', fontWeight: 'bold' }}
            icon={{ color: 'info', component: 'LocalAtmIcon' }}
            orgId={orgId}
          />
        );
      case 'New Customers':
        return (
          <CustomerMiniStatisticsCard
            title={{ text: 'New customers', fontWeight: 'bold' }}
            count="  85"
            percentage={{ color: 'success', text: '+3%' }}
            // icon={{ color: 'info', component: 'person_add' }}
            icon={{ component: <PeopleIcon /> }}
            orgId={orgId}
          />
        );
      case 'New Vendor':
        return (
          <VendorMiniStatisticsCard
            title={{ text: 'New vendors', fontWeight: 'bold' }}
            percentage={{ color: 'error', text: '-3%' }}
            icon={{ color: 'info', component: 'diversity_3' }}
            orgId={orgId}
          />
        );
      case 'Coupon Discount':
        return (
          <CouponDiscountMiniStatisticsCard
            title={{ text: 'Coupon Discount Value', fontWeight: 'bold' }}
            icon={{ color: 'info', component: 'shopping_basket' }}
            orgId={orgId}
          />
        );
      case 'StockOverView':
        return (
          <StockOverviewValue
            title={{ text: 'Stock OverView', fontWeight: 'bold' }}
            percentage={{ color: 'error', text: '-3%' }}
            icon={{ color: 'info', component: 'diversity_3' }}
            orgId={orgId}
          />
        );
      case 'StockOverView':
        return (
          <YearlySalesMiniStatisticsCard
            title={{ text: 'Yearly sales', fontWeight: 'bold' }}
            percentage={{ color: 'success', text: '+12%' }}
            // icon={{ color: 'info', component: 'paid' }}
            icon={{ component: <CurrencyRupeeIcon /> }}
            orgId={orgId}
          />
        );
      case 'dayProfit':
        return (
          <ProfitsMiniStatisticsCard
            title={{ text: "Today's Profits", fontWeight: 'bold' }}
            icon={{ color: 'info', component: 'LocalAtmIcon' }}
            orgId={orgId}
          />
        );
      case 'Cart Metrics':
        return (
          <CartMetrics
            title={{ text: 'Cart Metrics', fontWeight: 'bold' }}
            icon={{ component: <ShoppingCartIcon /> }}
            percentage={{ color: 'success' }}
            random={{
              title: 'Cart Deleted',
              value: 'NA',
            }}
            random1={{
              title: 'Cart Hold',
              value: 'NA',
            }}
            random2={{
              title: 'Cart Item Deleted',
              value: 'NA',
            }}
            random3={{
              title: 'Barcode/ Manual',
              value: 'NA/ NA',
            }}
          />
        );
      case 'Order Metrics':
        return (
          <CartMetrics
            title={{ text: 'Order Metrics', fontWeight: 'bold' }}
            icon={{ component: 'shopping_basket' }}
            percentage={{ color: 'success' }}
            random={{
              title: 'Order Edited',
              value: 'NA',
            }}
            random1={{
              title: 'Receipt Reprint',
              value: 'NA',
            }}
            random2={{
              title: 'Avg Order Time',
              value: 'NA',
            }}
            random3={{
              title: 'Avg Item Time',
              value: 'NA',
            }}
          />
        );
      case 'GRN Metrics':
        return (
          <CartMetrics
            title={{ text: 'GRN Metrics', fontWeight: 'bold' }}
            icon={{ component: 'shopping_basket' }}
            percentage={{ color: 'success' }}
            random={{
              title: 'Total Items',
              value: 'NA',
            }}
            random1={{
              title: 'Total Time',
              value: 'NA',
            }}
            random2={{
              title: 'Avg Item Time',
              value: 'NA',
            }}
            random3={{
              title: 'Total Orders',
              value: 'NA',
            }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <PageLayout style={{ position: 'relative' }}>
      {/* <DashboardNavbar /> */}
      <div
        style={{
          position: 'fixed',
          backgroundImage:
            'url(https://img.freepik.com/premium-photo/futuristic-style-white-background-wallpaper-web-page-design-decoration-template_1000823-29930.jpg)',
          backgroundSize: 'cover',
          opacity: 0.1,
          zIndex: -1,
          height: '100vh',
          width: '100vw',
        }}
      >
        {' '}
      </div>

      <SoftBox
        style={header}
        // className="search-bar-filter-and-table-container contained-softbutton"
      >
        <SoftBox>
          <SoftTypography style={{ fontSize: '1.2rem', color: '#fff' }}>Select Widgets</SoftTypography>
        </SoftBox>
        <SoftBox>
          <SoftButton variant="insideHeader" onClick={() => setShowBadge(!showBadge)}>
            Edit
          </SoftButton>
        </SoftBox>
      </SoftBox>
      <div style={{ padding: '30px', marginBottom: '20px' }}>
        <br />
        <Grid container>
          <Grid item xs={12} md={3}>
            <Card style={cardStyle}>
              <SoftTypography style={fontHeading}>Today's Sales</SoftTypography>
              <SoftTypography style={{ fontWeight: 'bold' }}>₹ {salesData?.todaySales}</SoftTypography>
              <SoftTypography style={prevOrder}>from NA orders</SoftTypography>
              <hr style={{ opacity: 0.3, width: '90%', margin: '15px' }} />
              <SoftTypography style={fontHeading}>Monthly Sales</SoftTypography>
              <SoftTypography style={{ fontWeight: 'bold' }}>₹ {salesData?.currentMonthSales}</SoftTypography>
              <SoftTypography style={prevOrder}>from NA orders</SoftTypography>
              <hr style={{ opacity: 0.3, width: '90%', margin: '3px' }} />
              <SoftTypography style={fontHeading}>Yearly Sales</SoftTypography>
              <SoftTypography style={{ fontWeight: 'bold' }}>₹ {salesData?.currentYearSales}</SoftTypography>
              <SoftTypography style={prevOrder}>from NA orders</SoftTypography>
            </Card>
          </Grid>
        </Grid>
        <hr style={{ opacity: 0.3, width: '90%', margin: '10px' }} />

        <Grid container spacing={2}>
          {availableWidgets?.map((item, index) => (
            <Grid item xs={12} md={4}>
              {filteredWidgets?.includes(item) ? (
                <SoftBox
                  key={index}
                  sx={{
                    position: 'relative',
                  }}
                  className={showBadge ? 'floatCards' : ''}
                >
                  {showBadge && (
                    <Badge
                      badgeContent={'x'}
                      color="secondary"
                      style={{ width: '100%', position: 'absolute' }}
                      onClick={() => filterWidgets(item)}
                    ></Badge>
                  )}
                  <SoftBox mb={3} style={{ width: '100%' }}>
                    {renderComponent(item)}
                  </SoftBox>
                </SoftBox>
              ) : null}
            </Grid>
          ))}
        </Grid>

        <SoftBox style={{ float: 'right', display: 'flex', gap: '15px' }}>
          <SoftButton color="error" onClick={handleRestore}>
            reset
          </SoftButton>
          <SoftButton color="info" onClick={handleSave}>
            save
          </SoftButton>
        </SoftBox>
        <br />
      </div>
    </PageLayout>
  );
};

export default WidgetSelection;
