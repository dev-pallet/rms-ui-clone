import React, { useState, useEffect } from 'react';
import SoftBox from '../../../../../components/SoftBox';
import { Typography } from '@mui/material';
import SoftTypography from '../../../../../components/SoftTypography';
import UpgradePlan from '../../../../../UpgardePlan';
import DefaultLineChart from '../../../../../examples/Charts/LineCharts/DefaultLineChart';
import { useSnackbar } from '../../../../../hooks/SnackbarProvider';

const SalesAndFoodCostTrend = ({ gtin, selectedVariantBarcode }) => {
  const showSnackBar = useSnackbar();
  const [label, setLabel] = useState([]);
  const [salesData, setSalesData] = useState({ volume: [] });
  const [purchaseData, setPurchaseData] = useState({ volume: [] });
  const [wastageData, setWastageData] = useState({ volume: [] });

  const [loader, setLoader] = useState(false);
  const featureSettings = JSON.parse(localStorage.getItem('featureSettings'));
  const permissions = JSON.parse(localStorage.getItem('permissions'));
  const locId = localStorage.getItem('locId');
  const orgId = localStorage.getItem('orgId');

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       setLoader(true);
  //       // Replace with actual API calls
  //       setSalesData({ volume: [10, 20, 30, 40] });
  //       setPurchaseData({ volume: [8, 15, 25, 32] });
  //       setWastageData({ volume: [1, 3, 2, 4] });
  //       setLabel(['Week 1', 'Week 2', 'Week 3', 'Week 4']);
  //     } catch (error) {
  //       showSnackBar('Error fetching trend data', 'error');
  //     } finally {
  //       setLoader(false);
  //     }
  //   };

  //   fetchData();
  // }, [gtin, selectedVariantBarcode]);

  const isFeatureBlocked =
    featureSettings?.['PRODUCT_LEVEL_SALES_HISTORY'] === 'FALSE' &&
    featureSettings?.['PURCHASE_TREND'] === 'FALSE';

  return (
    <SoftBox>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography className="products-new-details-pack-typo">
          Sales, Food Cost Trend and Wastage trends
        </Typography>
      </div>

      <div
        style={{
          height: isFeatureBlocked ? 525 : undefined,
          width: '100%',
          position: 'relative',
        }}
      >
        {isFeatureBlocked ? (
          <UpgradePlan />
        ) : (
          <DefaultLineChart
            chart={{
              labels: label,
              datasets: [
                {
                  label: 'Sales',
                  color: 'info',
                  data: salesData?.volume || [],
                },
                {
                  label: 'Food Cost',
                  color: 'dark',
                  data: purchaseData?.volume || [],
                },
                {
                  label: 'Wastage',
                  color: 'error',
                  data: wastageData?.volume || [],
                },
              ],
            }}
          />
        )}
      </div>
    </SoftBox>
  );
};

export default SalesAndFoodCostTrend;
