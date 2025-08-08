import './overview.css';
import { AppBar, Tab, Tabs } from '@mui/material';
import { BillingDetails } from 'layouts/ecommerce/vendor/components/Overview/components/billing-details/index';
import { Statement } from '../Statement/Statement';
import {
  getVendorDetails,
  getVendorPurchaseOrderDetails,
} from 'config/Services';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { vendorAvailableStockValue } from '../../../../../config/Services';
import { vendorBaseData } from 'datamanagement/customerdataSlice';
import AverageCycleComponent from './OverViewComponents/AverageCycleComponent';
import BankDetails from './components/bank-details';
import Grid from '@mui/material/Grid';
import PanDetails from './components/pan-details';
import PlatformSettings from 'layouts/ecommerce/vendor/components/Overview/components/overview-platformsettings/index';
import SoftBox from 'components/SoftBox';
import Spinner from 'components/Spinner/index';
import VednorDetailsTerms from './OverViewComponents/VednorDetailsTerms';
import VendorDetailsBrands from './OverViewComponents/VendorDetailsBrands';
import VendorDetailsProducts from './OverViewComponents/VendorDetailsProducts';
import VendorDetailsPromotion from './OverViewComponents/VendorDetailsPromotion';
import VendorDetailsTopItems from './OverViewComponents/VendorDetailsTopItems';
import VendorOverview from './OverViewComponents/VendorOverview';
import VendorPurchaseDetails from './OverViewComponents/VendorPurchaseDetails';
import ViewlegalDocuments from '../AddLegalDocuments/ViewlegalDocuments';
import { isSmallScreen } from '../../../Common/CommonFunction';

export const Overview = ({ vendorOverViewData, creditTransferCreated }) => {
  const isMobileDevice = isSmallScreen();
  const { vendorId } = useParams();
  const [purchaseData, setPurchaseData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [addressList1, setAddressList1] = useState([]);
  const [vendorUnits, setVendorUnits] = useState('');
  const [topPurchasedItems, setTopPurchasedItems] = useState([]);
  const [errorTableData, setErrorTableData] = useState(false);
  const [update, setUpdate] = useState(null);
  const [availableStock, setAvailableStock] = useState(null);
  const dispatch = useDispatch();

  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');

  const [status, setStatus] = useState({
    tab1: true,
    tab2: false,
    tab3: false,
    tab4: false,
    tab5: false,
    tab6: false,
    tab7: false,
  });
  const [tabsOrientation, setTabsOrientation] = useState('horizontal');
  const [tabValue, setTabValue] = useState(0);
  const handleSetTabValue = (event, newValue) => {
    setTabValue(newValue);
    if (newValue == 0) {
      setStatus({
        tab1: true,
        tab2: false,
        tab3: false,
        tab4: false,
      });
    } else if (newValue == 1) {
      setStatus({
        tab1: false,
        tab2: true,
        tab3: false,
        tab4: false,
      });
    } else if (newValue == 2) {
      setStatus({
        tab1: false,
        tab2: false,
        tab3: true,
        tab4: false,
      });
    } else if (newValue == 3) {
      setStatus({
        tab1: false,
        tab2: false,
        tab3: false,
        tab4: true,
      });
    } else if (newValue == 4) {
      setStatus({
        tab1: false,
        tab2: false,
        tab3: false,
        tab4: false,
        tab5: true,
      });
    } else if (newValue == 5) {
      setStatus({
        tab1: false,
        tab2: false,
        tab3: false,
        tab4: false,
        tab5: false,
        tab6: true,
      });
    } else {
      setStatus({
        tab1: false,
        tab2: false,
        tab3: false,
        tab4: false,
        tab5: false,
        tab6: false,
        tab7: true,
      });
    }
  };
  const columns = [
    {
      field: 'itemNo',
      headerName: 'Barcode',
      width: 200,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'itemName',
      headerName: 'Item Name',
      width: 230,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'specification',
      headerName: 'Specification',
      width: 230,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      width: 200,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'returns',
      headerName: 'Returns',
      width: 200,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'value',
      headerName: 'Value',
      width: 200,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
  ];

  const prodItemName = (dataForProductGtins, gtin) => {
    if (gtin !== null) {
      const prodData = dataForProductGtins.find((el) => el.value == gtin);
      if (prodData == undefined) {
        return '---';
      }
      return prodData.label;
    } else {
      return '---';
    }
  };

  useEffect(() => {
    setLoader(true);
    getVendorDetails(orgId, vendorId)
      .then(function (responseTxt) {
        dispatch(vendorBaseData(responseTxt?.data?.data));
        setAddressList1(responseTxt.data.data.addressList);
      })
      .catch((err) => {});
    getVendorPurchaseOrderDetails(vendorId, locId)
      .then(function (response) {
        setPurchaseData(response.data.data);
        setLoader(false);
      })
      .catch((err) => {});
    // getVendorVendorCredit(vendorId)
    //   .then(function (responseTxt) {
    //     setVendorUnits(responseTxt.data.data.availableCredits);
    //   })
    //   .catch((err) => {});
  }, [creditTransferCreated]);

  useEffect(() => {
    if (update !== null) {
      getVendorDetails(orgId, vendorId).then(function (responseTxt) {
        dispatch(vendorBaseData(responseTxt.data.data));
      });
    }
  }, [update]);

  useEffect(() => {
    if (localStorage.getItem('vendorIdForProductPortfolioFromSku')) {
      localStorage.removeItem('vendorIdForProductPortfolioFromSku');
    }
  }, []);

  const fetchAvailableStock = async () => {
    const payload = {
      orgId: orgId,
      locationId: locId,
      vendorIdList: [vendorId],
    };
    try {
      const res = await vendorAvailableStockValue(payload);
      // console.log('availableStock', res);
      if (res?.data?.data?.es == 0) {
        const result = res?.data?.data?.data;
        setAvailableStock(result[0]);
      }
    } catch (err) {}
  };

  useEffect(() => {
    fetchAvailableStock();
  }, []);

  return (
    <>
      <SoftBox sx={{ width: '100%' }}>
        {loader ? (
          <Spinner />
        ) : (
          <SoftBox mt={5} mb={3} p={isMobileDevice && 2}>
            <Grid container spacing={1}>
              <Grid item xs={12} md={3}>
                <PlatformSettings vendorId={vendorId} setUpdate={setUpdate} update={update} />
                <SoftBox mt={2}>
                  <PanDetails />
                </SoftBox>
                <SoftBox mt={2}>
                  <BankDetails />
                </SoftBox>
                <SoftBox mt={2}>
                  <BillingDetails addressList1={addressList1} />
                </SoftBox>
                <SoftBox mt={2}>
                  {/* <MiscDetails vendorId={vendorId} setUpdate={setUpdate} update={update} /> */}
                </SoftBox>
              </Grid>
              <Grid item xs={12} md={9} className="overview-other-details">
                <SoftBox style={{ margin: '15px 10px 10px 10px' }}>
                  <AppBar position="static">
                    <Tabs
                      orientation={tabsOrientation}
                      value={tabValue}
                      onChange={handleSetTabValue}
                      TabIndicatorProps={{ sx: { display: 'none' } }}
                      sx={{
                        background: 'transparent',
                        '& .MuiTabs-flexContainer': {
                          flexWrap: 'wrap',
                          gap:'5px'
                        },
                      }}
                    >
                      <Tab label="Overview" className={tabValue === 0 ? 'overviewBtnStyle' : 'defaultvendorTabstyle'} />
                      <Tab
                        label="Purchases"
                        className={tabValue === 1 ? 'overviewBtnStyle' : 'defaultvendorTabstyle'}
                      />
                      <Tab label="Products" className={tabValue === 2 ? 'overviewBtnStyle' : 'defaultvendorTabstyle'} />
                      <Tab label="Terms" className={tabValue === 3 ? 'overviewBtnStyle' : 'defaultvendorTabstyle'} />
                      <Tab
                        label="Legal & Kyc"
                        className={tabValue === 4 ? 'overviewBtnStyle' : 'defaultvendorTabstyle'}
                      />
                      <Tab
                        label="Statement"
                        className={tabValue === 5 ? 'overviewBtnStyle' : 'defaultvendorTabstyle'}
                      />
                      <Tab
                        label="Promotions"
                        className={tabValue === 6 ? 'overviewBtnStyle' : 'defaultvendorTabstyle'}
                      />
                    </Tabs>
                  </AppBar>
                </SoftBox>
                {status?.tab1 && (
                // <>
                //   <OtherDetails
                //     purchaseData={purchaseData}
                //     vendorUnits={vendorUnits}
                //     availableStock={availableStock}
                //   />
                //   <SoftBox pt={3} px={1}>
                //     <SoftTypography variant="h6" fontWeight="medium">
                //       Top Items Purchased
                //     </SoftTypography>
                //   </SoftBox>
                //   <SoftBox py={1}>
                //     <SoftBox className="softbox-box-shadow">
                //       <Box sx={{ height: 400, width: '100%' }}>
                //         {errorTableData ? (
                //           <SoftBox className="No-data-text-box">
                //             <SoftBox className="src-imgg-data">
                //               <img
                //                 className="src-dummy-img"
                //                 src="https://2.bp.blogspot.com/-SXNnmaKWILg/XoNVoMTrxgI/AAAAAAAAxnM/7TFptA1OMC8uk67JsG5PcwO_8fAuQTzkQCLcBGAsYHQ/s1600/giphy.gif"
                //               />
                //             </SoftBox>

                  //             <h3 className="no-data-text-I">NO DATA FOUND</h3>
                  //           </SoftBox>
                  //         ) : (
                  //           <DataGrid
                  //             rows={topPurchasedItems}
                  //             columns={columns}
                  //             pageSize={5}
                  //             rowsPerPageOptions={[5]}
                  //             // checkboxSelection
                  //             disableSelectionOnClick
                  //             // onCellDoubleClick={() => { navigate("/sales/all-orders/details") }}
                  //           />
                  //         )}
                  //       </Box>
                  //     </SoftBox>
                  //   </SoftBox>
                  // </>
                  <>
                    <VendorOverview vendorOverViewData={vendorOverViewData} />
                    <AverageCycleComponent vendorOverViewData={vendorOverViewData} />
                    <VendorDetailsBrands />
                    <VendorDetailsTopItems topPurchasedItems={topPurchasedItems} />
                  </>
                )}
                {status?.tab2 && <VendorPurchaseDetails />}
                {status?.tab3 && <VendorDetailsProducts />}
                {status?.tab4 && <VednorDetailsTerms />}
                {status?.tab5 && <ViewlegalDocuments />}
                {status?.tab6 && (
                  <div style={{ paddingInline: '15px' }}>
                    {' '}
                    <Statement />
                  </div>
                )}
                {status?.tab7 && <VendorDetailsPromotion />}
              </Grid>
            </Grid>
          </SoftBox>
        )}
      </SoftBox>
    </>
  );
};
