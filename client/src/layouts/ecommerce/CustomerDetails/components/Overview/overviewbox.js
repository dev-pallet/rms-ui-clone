import './overview.css';
import { BillingDetails } from 'layouts/ecommerce/CustomerDetails/components/Overview/components/billing-details/index';
import { CopyToClipBoard, noDatagif } from '../../../Common/CommonFunction';
import { DataGrid } from '@mui/x-data-grid';
import { customerBaseData } from 'datamanagement/customerdataSlice';
import { getCustomerDetails } from 'config/Services';
import { getCustomerOrdersSummary, getCustomerTopPurchasedOrderItem } from '../../../../../config/Services';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BankDetails from './components/bank-details';
import Box from '@mui/material/Box';
import Footer from 'examples/Footer';
import Grid from '@mui/material/Grid';
import OtherDetails from 'layouts/ecommerce/CustomerDetails/components/Overview/components/other-details';
import PanDetails from './components/pan-details';
import PlatformSettings from 'layouts/ecommerce/CustomerDetails/components/Overview/components/overview-platformsettings/index';
import SoftBox from 'components/SoftBox';
import SoftTypography from 'components/SoftTypography';

export const Overview = () => {
  const dispatch = useDispatch();
  const { retailId } = useParams();
  const [addressList1, setAddressList1] = useState('');
  const [updateDetails, setUpdateDetails] = useState(null);
  const [orderSummary, setOrderSummary] = useState([]);
  const [topPurchasedItems, setTopPurchasedItems] = useState([]);
  const [errorTableData, setErrorTableData] = useState(false);

  useEffect(() => {
    getCustomerDetails(retailId).then(function (responseTxt) {
      dispatch(customerBaseData(responseTxt.data.data.retail));
      setAddressList1(responseTxt.data.data.retail.addresses);
    });

    // const orgId = localStorage.getItem("orgId");
    // const locId = localStorage.getItem("locId");

    const payloadCustomerOrdersSummary = {
      sourceId: retailId,
      // sourceLocationId: orgId,
      // destinationId: orgId,
      // destinationLocationId: locId,
    };
    getCustomerOrdersSummary(payloadCustomerOrdersSummary, retailId)
      .then((response) => {
        if (response.data !== '') {
          const ordSummary = response.data.data;
          setOrderSummary(ordSummary);
        }
      })
      .catch((error) => {});

    getCustomerTopPurchasedOrderItem(retailId)
      .then((response) => {
        const unique = [];

        const data = response.data.data;
        const topPurchased = data.orderItemList;

        // to have unique list with no duplicates
        topPurchased.map((x) => (unique.filter((a) => a.gtin == x.gtin).length > 0 ? null : unique.push(x)));

        const topPurchasedItemsTableRows = unique.map((row) => ({
          productName: row.productName,
          gtin: row.gtin,
          rate: row.sellingPrice,
          quantity: row.quantity,
          subTotal: row.subTotal,
        }));
        setTopPurchasedItems(topPurchasedItemsTableRows);
      })
      .catch((error) => {
        setErrorTableData(true);
      });
  }, [retailId]);

  useEffect(() => {
    if (updateDetails !== null) {
      getCustomerDetails(retailId).then(function (responseTxt) {
        dispatch(customerBaseData(responseTxt.data.data.retail));
      });
    }
  }, [updateDetails]);

  const columns = [
    {
      field: 'productName',
      headerName: 'Product Name',
      width: 200,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'gtin',
      headerName: 'GTIN',
      width: 150,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      renderCell: (params) => {
        return <CopyToClipBoard params={params} />;
      },
    },
    {
      field: 'rate',
      headerName: 'Rate',
      width: 200,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      width: 200,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'subTotal',
      headerName: 'Value',
      width: 200,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
  ];

  return (
    <SoftBox sx={{ width: '100%' }}>
      <SoftBox mt={5} mb={3}>
        <Grid container spacing={1}>
          <Grid item xs={12} md={12} xl={5}>
            <PlatformSettings retailId={retailId} setUpdateDetails={setUpdateDetails} updateDetails={updateDetails} />
            <SoftBox mt={2}>
              <PanDetails />
            </SoftBox>
            <SoftBox mt={2}>
              <BankDetails />
            </SoftBox>
            <SoftBox mt={2}>
              <BillingDetails setUpdateDetails={setUpdateDetails} updateDetails={updateDetails} />
            </SoftBox>
            {/* <SoftBox mt={2}>
              <MiscDetails setUpdateDetails={setUpdateDetails} updateDetails={updateDetails} />
            </SoftBox> */}
          </Grid>
          <Grid item xs={12} md={12} xl={7} className="overview-other-details">
            <OtherDetails orderSummary={orderSummary} />
            <SoftBox pt={3} px={1}>
              <SoftTypography variant="h6" fontWeight="medium">
                Top items purchased
              </SoftTypography>
            </SoftBox>
            <SoftBox py={1}>
              <SoftBox className="softbox-box-shadow">
                <Box sx={{ height: 400, width: '100%' }}>
                  {errorTableData ? (
                    <SoftBox className="No-data-text-box">
                      <SoftBox className="src-imgg-data">
                        <img className="src-dummy-img" src={noDatagif} />
                      </SoftBox>

                      <h3 className="no-data-text-I">NO DATA FOUND</h3>
                    </SoftBox>
                  ) : (
                    <DataGrid
                      rows={topPurchasedItems}
                      columns={columns}
                      pageSize={5}
                      rowsPerPageOptions={[5]}
                      getRowId={(row) => row?.gtin}
                      // checkboxSelection
                      disableSelectionOnClick
                      // onCellDoubleClick={(rows) => rows.row['gtin']}
                    />
                  )}
                </Box>
              </SoftBox>
            </SoftBox>
          </Grid>
        </Grid>
      </SoftBox>
      <Footer />
    </SoftBox>
  );
};
