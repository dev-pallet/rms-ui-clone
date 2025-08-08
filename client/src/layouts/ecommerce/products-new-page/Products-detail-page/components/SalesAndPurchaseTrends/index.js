import React, { useEffect, useState } from 'react';
import SoftBox from '../../../../../../components/SoftBox';
import { Switch, Typography } from '@mui/material';
import DefaultLineChart from '../../../../../../examples/Charts/LineCharts/DefaultLineChart';
import { getPurchaseTrend, productWiseTrend } from '../../../../../../config/Services';
import { useSnackbar } from '../../../../../../hooks/SnackbarProvider';
import UpgradePlan from '../../../../../../UpgardePlan';
import SoftTypography from '../../../../../../components/SoftTypography';

const SalesAndPurchaseTrends = ({ gtin, selectedVariantBarcode }) => {
  const showSnackBar = useSnackbar();
  const [label, setLabel] = useState([]);
  const [purchaseToggle, setPurchaseToggle] = useState(false);
  const [salesData, setSalesData] = useState([]);
  const [purchaseData, setPurchaseData] = useState({
    price: [],
    volume: [],
  });

  const [loader, setLoader] = useState(false);
  const featureSettings = JSON.parse(localStorage.getItem('featureSettings'));

  const permissions = JSON.parse(localStorage.getItem('permissions'));
  const locId = localStorage.getItem('locId');
  const orgId = localStorage.getItem('orgId');

  const currMonth = new Date().getMonth() + 1;
  const currentDate = new Date();
  const year = currentDate.getFullYear();

  const startDate = `${year - 1}-${currMonth.toString().padStart(2, '0')}-01`;
  const lastDay = new Date(year, currMonth, 0).getDate();
  const endDate = `${year}-${currMonth.toString().padStart(2, '0')}-${lastDay.toString().padStart(2, '0')}`;

  const salesTrend = () => {
    let payload = {
      startDate: startDate,
      endDate: endDate,
      orgId: orgId,
      locationId: locId,
      gtin: gtin,
    };
    productWiseTrend(payload)
      .then((res) => {
        handleProductWiseData(res?.data?.data);
      })
      .catch((err) => {});
  };

  const handleProductWiseData = (res) => {
    const currentMonth = Number(new Date(res?.toDate).toLocaleString('en-us', { month: 'numeric' })) + 1;

    const createMonthArray = (startMonth) => {
      const months = [
        { monthNo: 1, month: 'Jan', price: 0, volume: 0 },
        { monthNo: 2, month: 'Feb', price: 0, volume: 0 },
        { monthNo: 3, month: 'Mar', price: 0, volume: 0 },
        { monthNo: 4, month: 'Apr', price: 0, volume: 0 },
        { monthNo: 5, month: 'May', price: 0, volume: 0 },
        { monthNo: 6, month: 'Jun', price: 0, volume: 0 },
        { monthNo: 7, month: 'Jul', price: 0, volume: 0 },
        { monthNo: 8, month: 'Aug', price: 0, volume: 0 },
        { monthNo: 9, month: 'Sep', price: 0, volume: 0 },
        { monthNo: 10, month: 'Oct', price: 0, volume: 0 },
        { monthNo: 11, month: 'Nov', price: 0, volume: 0 },
        { monthNo: 12, month: 'Dec', price: 0, volume: 0 },
      ];

      const startMonthIndex = months?.findIndex((month) => month?.monthNo === (startMonth === 13 ? 1 : startMonth));

      const resultArray = [];
      for (let i = 0; i < 12; i++) {
        const monthIndex = (startMonthIndex + i) % 12;
        resultArray.push(months[monthIndex]);
      }

      return resultArray?.map((monthObj) => {
        const matchingMonth = res?.trendMonth.find((trendObj) => trendObj?.month === monthObj?.monthNo);
        if (matchingMonth) {
          return {
            ...monthObj,
            volume: matchingMonth.volume,
            price: matchingMonth.price,
            year: matchingMonth.year,
          };
        }
        return monthObj;
      });
    };

    const monthArray = createMonthArray(currentMonth);

    const [months, prices, volumes] = monthArray?.reduce(
      (acc, { month, price, volume }) => {
        acc[0].push(month);
        acc[1].push(price);
        acc[2].push(volume);
        return acc;
      },
      [[], [], []],
    );

    const data = {
      price: prices,
      volume: volumes,
    };
    setSalesData(data);
    setLabel(months);
  };

  const createPurchaseData = (res) => {
    const currentMonth = Number(new Date(res?.toDate).toLocaleString('en-us', { month: 'numeric' })) + 1;

    const createMonthArray = (startMonth) => {
      const months = [
        { monthNo: 1, month: 'Jan', price: 0, volume: 0 },
        { monthNo: 2, month: 'Feb', price: 0, volume: 0 },
        { monthNo: 3, month: 'Mar', price: 0, volume: 0 },
        { monthNo: 4, month: 'Apr', price: 0, volume: 0 },
        { monthNo: 5, month: 'May', price: 0, volume: 0 },
        { monthNo: 6, month: 'Jun', price: 0, volume: 0 },
        { monthNo: 7, month: 'Jul', price: 0, volume: 0 },
        { monthNo: 8, month: 'Aug', price: 0, volume: 0 },
        { monthNo: 9, month: 'Sep', price: 0, volume: 0 },
        { monthNo: 10, month: 'Oct', price: 0, volume: 0 },
        { monthNo: 11, month: 'Nov', price: 0, volume: 0 },
        { monthNo: 12, month: 'Dec', price: 0, volume: 0 },
      ];

      const startMonthIndex = months?.findIndex((month) => month?.monthNo === (startMonth === 13 ? 1 : startMonth));

      const resultArray = [];
      for (let i = 0; i < 12; i++) {
        const monthIndex = (startMonthIndex + i) % 12;
        resultArray.push(months[monthIndex]);
      }

      return resultArray?.map((monthObj) => {
        const matchingMonth = res?.trendMonth.find((trendObj) => trendObj?.month === monthObj?.monthNo.toString());
        if (matchingMonth) {
          return {
            ...monthObj,
            volume: matchingMonth.volume,
            price: matchingMonth.price,
            year: matchingMonth.year,
          };
        }
        return monthObj;
      });
    };

    const monthArray = createMonthArray(currentMonth);

    const [months, prices, volumes] = monthArray?.reduce(
      (acc, { month, price, volume }) => {
        acc[0].push(month);
        acc[1].push(price);
        acc[2].push(volume);
        return acc;
      },
      [[], [], []],
    );

    setPurchaseData({
      price: prices,
      volume: volumes,
    });
    setLabel(months);
  };

  useEffect(() => {
    getPurchaseTrend(orgId, locId, gtin)
      .then((res) => {
        createPurchaseData(res?.data?.data);
        setLoader(false);
      })
      .catch((err) => {
        // showSnackBar(err?.response?.data?.message, 'error');
        setLoader(false);
      });
    salesTrend();
  }, [gtin]);

  return (
    <div>
      <SoftBox>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography className="products-new-details-pack-typo">Sales and Purchase trends</Typography>
          <SoftBox display="flex" gap={1} alignItems="center">
            <SoftTypography variant="caption" fontWeight="medium" ml={1}>
              {purchaseToggle ? 'Price' : 'Volume'}
            </SoftTypography>
            <Switch checked={purchaseToggle} onChange={() => setPurchaseToggle(!purchaseToggle)} />
          </SoftBox>
        </div>
        <div
          style={{
            height:
              featureSettings !== null &&
              featureSettings['PRODUCT_LEVEL_SALES_HISTORY'] == 'FALSE' &&
              featureSettings['PURCHASE_TREND'] == 'FALSE'
                ? 525
                : null,
            width: '100%',
            position: 'relative',
          }}
        >
          {featureSettings !== null &&
          featureSettings['PRODUCT_LEVEL_SALES_HISTORY'] == 'FALSE' &&
          featureSettings['PURCHASE_TREND'] == 'FALSE' ? (
            <UpgradePlan />
          ) : null}
          {purchaseToggle ? (
            <DefaultLineChart
              chart={{
                labels: label || [],
                datasets: [
                  {
                    label: 'Sales',
                    color: 'info',
                    data: salesData?.price || [], // Price data for sales
                  },
                  {
                    label: 'Purchase',
                    color: 'dark',
                    data: purchaseData?.price || [], // Price data for purchases
                  },
                ],
              }}
            />
          ) : (
            <DefaultLineChart
              chart={{
                labels: label || [],
                datasets: [
                  {
                    label: 'Sales',
                    color: 'info',
                    data: salesData?.volume || [], // Price data for sales
                  },
                  {
                    label: 'Purchase',
                    color: 'dark',
                    data: purchaseData?.volume || [], // Price data for purchases
                  },
                ],
              }}
            />
          )}
        </div>
      </SoftBox>
    </div>
  );
};

export default SalesAndPurchaseTrends;
