import './BillingInfo.css';
import { Box } from '@mui/material';
import { Button } from '@mui/material';
import { Card, CardContent } from '@material-ui/core';
import { DataGrid } from '@mui/x-data-grid';
import { installedAddons, resumeSubscriptionForPricingPlans } from '../../../../config/Services';
import { makeStyles } from '@mui/styles';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../../../hooks/SnackbarProvider';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import Drawer from '@mui/material/Drawer';
import Modal from '@mui/material/Modal';
import PageLayout from '../../../../examples/LayoutContainers/PageLayout';
import ReactSpeedometer from 'react-d3-speedometer';
import SoftBox from '../../../../components/SoftBox';
import SoftButton from '../../../../components/SoftButton';
import SoftTypography from '../../../../components/SoftTypography';
import Spinner from 'components/Spinner/index';

import {
  getFeatureUsageDetails,
  subscriptionDetailsForOrg,
  subscriptionPlanDetailsForPricingPlans,
} from '../../../../config/Services';
import { noDatagif } from '../../Common/CommonFunction';

const drawerWidth = 500;

const useStyles = makeStyles((theme) => ({
  drawer: {
    minWidth: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    minWidth: drawerWidth,
    backgroundColor: 'white !important',
  },
  content: {
    padding: '1rem',
    overflow: 'scroll',
  },
}));

const Billinginfo = () => {
  const showSnackbar = useSnackbar();
  const classes = useStyles();
  const navigate = useNavigate();
  const contextType = localStorage.getItem('contextType');
  const accountId = localStorage.getItem('AppAccountId');

  const [loader, setLoader] = useState(false);
  const [errorComing, setErrorComing] = useState(false);
  const [planDetailsData, setPlanDetailsData] = useState(null);
  const [planDetailsDataRow, setPlanDetailsDataRows] = useState(null);
  const [featureUsageData, setFeatureUsageData] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [featureUsage, setFeatureUsage] = useState(null);
  const [addonsList, setAddonsList] = useState([]);
  const [subscripitionStatus, setSubscriptionStatus] = useState(null);
  const [openAddContactModal, setOpenAddContactModal] = useState(false);

  const orgId = localStorage.getItem('orgId');

  const isEnterprise = localStorage.getItem('isEnterprise');

  const onCancelplan = () => {
    navigate('/Billinginfo/cancelplan');
  };

  const onResumeplan = async () => {
    try {
      const result = await resumeSubscriptionForPricingPlans('sub_MhduS0f7qoQBw4');
      // console.log('result', result);
    } catch (e) {}
  };

  const handleChangePlan = () => {
    localStorage.setItem('pricingPageTabVal', 1);
  };

  const featureUsageColumns = [
    {
      headerName: 'S.No',
      field: 'serialNumber',
      width: 150,
      editable: false,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
    },
    {
      headerName: 'Feature Name',
      field: 'featureName',
      width: 150,
      editable: false,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
    },
    {
      headerName: 'Usage Cap',
      field: 'featureThreshold',
      type: 'number',
      width: 150,
      editable: false,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
    },
    {
      headerName: 'Feature Category',
      field: 'featureCategory',
      type: 'number',
      width: 150,
      editable: false,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
    },
    {
      headerName: 'Feature Description',
      field: 'featureDescription',
      type: 'number',
      width: 150,
      editable: false,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
    },
  ];

  const fetchFeatureUsage = async () => {
    const payload = {
      orgId: orgId,
    };

    try {
      setLoader(true);
      const response = await getFeatureUsageDetails(payload);
      const result = response.data.data;
      if (result.es == 0) {
        // setFeatureUsageData(result.data);
        const totalResult = result.data.map((row, index) => ({
          serialNumber: index + 1,
          featureName: row.featureName,
          featureThreshold: row.featureThreshold,
          featureCategory: row.featureCategory,
          featureDescription: row.featureDescription,
          id: row.featureId,
          ...row,
        }));
        setFeatureUsageData(totalResult);
        setLoader(false);
      }
    } catch (e) {
      // console.log('error', e);
      setLoader(false);
      setErrorComing(true);
    }
  };

  const planDetailsColumns = [
    {
      headerName: 'Date',
      field: 'paymentDate',
      width: 150,
      editable: false,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
    },
    {
      headerName: 'Order Number',
      field: 'invoiceNumber',
      width: 150,
      editable: false,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
    },
    {
      headerName: 'Type',
      field: 'invoice',
      type: 'number',
      width: 150,
      editable: false,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
    },
    {
      headerName: 'Amount',
      field: 'totalAmount',
      type: 'number',
      width: 150,
      editable: false,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
    },
    {
      headerName: 'Receipt',
      field: 'receiptUrl',
      type: 'number',
      width: 150,
      editable: false,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
      renderCell: (params) => {
        return (
          <SoftButton
            sx={{
              backgroundColor: '#0562FB',
              color: 'white !important',
              '&:hover': {
                color: 'black !important',
              },
            }}
            onClick={() => handleViewPdf(params)}
          >
            View PDF
          </SoftButton>
        );
      },
    },
  ];

  const fetchCurrentPlanDetailsForOrg = async () => {
    try {
      const response = await subscriptionDetailsForOrg(orgId);
      // console.log('responseDetails', response);
      const result = response?.data?.data?.data;
      const subsData = result?.subscriptionResponse;
      const activePlanDetails = {
        billingCycle: subsData?.billingCycle,
        planName: subsData?.packageName,
        startDate: result?.accountSubscriptionResponse?.startDate,
        netPrice: subsData?.netPrice,
        endDate: result?.accountSubscriptionResponse?.endDate,
        subscriptionId: subsData?.subscriptionId,
        isEnterprise: subsData?.isEnterprise,
      };
      const isEnterprise = subsData?.isEnterprise;
      localStorage.setItem('activePlanDetails', JSON.stringify(activePlanDetails));

      localStorage.setItem('isEnterprise', isEnterprise);
    } catch (err) {
      // console.log('error', err);
    }
  };

  const fetchPlanDetails = async () => {
    const payload = {
      accountId: accountId,
    };
    try {
      setLoader(true);
      const response = await subscriptionPlanDetailsForPricingPlans(payload);

      if (response?.data?.data?.es == 0 && response?.data?.data?.message == 'NO_CONTACTS_FOUND_FOR_THE_ACCOUNT') {
        setOpenAddContactModal(true);
        return;
      }

      if (response?.data?.data?.es == 0) {
        const result = response.data.data;
        const planStatus = result.accountSubscription.status;
        // console.log('planStatus', planStatus);
        // console.log('activePlanStatus', result);
        localStorage.setItem('accountSubscriptionId', result.accountSubscription.accountSubscriptionId);

        fetchCurrentPlanDetailsForOrg();

        const totalResult = result?.paymentInvoiceResponses?.map((row, index) => ({
          paymentDate: row.paymentDate !== null || undefined ? row.paymentDate : '---',
          invoiceNumber: row.invoice?.invoiceNumber !== null || undefined ? row.invoice?.invoiceNumber : '---',
          invoice: 'Invoice',
          totalAmount: row.invoice?.totalAmount !== null || undefined ? row.invoice?.totalAmount : '---',
          receiptUrl: row.invoice?.invoiceUrl !== null || undefined ? row.invoice?.invoiceUrl : '---',
          id: index + 1,
        }));

        setSubscriptionStatus(planStatus);
        setPlanDetailsData(result);
        setPlanDetailsDataRows(totalResult);
        setLoader(false);
      } else if (response.data.data.es == 2) {
        setPlanDetailsData(null);
        setLoader(false);
      }
    } catch (e) {
      // console.log('error', e);
      setLoader(false);
      setErrorComing(true);
    }
  };

  const fetchInstalledAddons = async () => {
    const payload = {
      accountId: accountId,
    };
    try {
      const response = await installedAddons(payload);
      const result = response.data.data.data;
      setAddonsList(result);
      // console.log('response', response);
    } catch (e) {}
  };

  useEffect(() => {
    if (isEnterprise == 'false') {
      fetchPlanDetails();
      fetchFeatureUsage();
      fetchInstalledAddons();
    }
  }, []);

  const handleActivateSubscription = () => {
    navigate('/pricingPage');
  };

  const handleViewPdf = (data) => {
    const url = data.row.receiptUrl;
    window.open(url, '_blank');
  };

  const handleFeatureRowData = (data) => {
    // console.log('featutreData', data);
    if (data.alterable == true) {
      // Usage
      const featureData = {
        usageValue: data.usage.usageValue,
        consumedUnits: data.usage.consumedUnits,
        featureThreshold: data.featureThreshold,
      };
      // console.log('featureUsage', featureData);
      setFeatureUsage(featureData);
      toggleDrawer();
    } else {
      showSnackbar('No usage information available', 'success');
      return;
    }
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setFeatureUsage(null);
  };

  const handleBackBtn = () => {
    // navigate(`/dashboards/${contextType}/`);
    navigate('/AllOrg_loc');
  };

  // console.log('featureUsage', featureUsage);

  const handleCloseAddContactModal = () => {
    setOpenAddContactModal(false);
  };

  const handleDefaultAddContactAddress = () => {
    navigate('/setting/organisation');
  };

  return (
    <PageLayout background="white">
      {isEnterprise == 'false' ? (
        <SoftBox style={{ margin: '50px' }}>
          <Box className="back-btn-box">
            <SoftButton className="back-btn" onClick={handleBackBtn}>
              <ArrowBackIcon className="arrow-back-icon" />
              Back
            </SoftButton>
          </Box>
          <Card style={{ margin: '10px' }}>
            <CardContent>
              <SoftTypography style={{ fontSize: '1rem', fontWeight: '500' }}> Plan Details</SoftTypography>
              <hr />

              {planDetailsData !== null && !loader ? (
                <>
                  <SoftTypography style={{ fontSize: '0.8rem', marginTop: '15px' }}>
                    You are currently subscribed to the{' '}
                    <b>
                      {planDetailsData?.subscriptionPlan?.packageName.charAt(0).toUpperCase() +
                        planDetailsData?.subscriptionPlan?.packageName.slice(1).toLowerCase()}{' '}
                      plan
                    </b>
                    .{' '}
                    <a href="/pricingPage" style={{ color: 'blue' }}>
                      Change plan
                    </a>{' '}
                  </SoftTypography>
                  <br />
                  <SoftTypography style={{ fontSize: '0.8rem' }} onClick={handleChangePlan}>
                    Your payment period is{' '}
                    <b>
                      {planDetailsData.subscriptionPlan?.billingCycle.charAt(0).toUpperCase() +
                        planDetailsData.subscriptionPlan?.billingCycle.slice(1).toLowerCase()}
                    </b>
                    .{' '}
                    {planDetailsData?.subscriptionPlan?.billingCycle == 'MONTHLY' ? (
                      <a href="/pricingPage" style={{ color: 'blue' }}>
                        Change to annual
                      </a>
                    ) : null}
                  </SoftTypography>
                </>
              ) : planDetailsData == null && loader ? (
                <SoftBox
                  sx={{
                    margin: '2rem',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Spinner />
                </SoftBox>
              ) : (
                planDetailsData == null &&
                !loader && (
                  <>
                    <SoftTypography style={{ fontSize: '0.8rem' }}>No active plans are available</SoftTypography>
                    <Button
                      variant="contained"
                      style={{ backgroundColor: '#0562FB', color: 'white', padding: '7px', marginTop: '1rem' }}
                      onClick={handleActivateSubscription}
                    >
                      Activate subscription
                    </Button>
                  </>
                )
              )}

              {planDetailsData !== null ? (
                <>
                  <SoftTypography style={{ marginTop: '20px', fontSize: '1rem', fontWeight: '500' }}>
                    Billing Actions
                  </SoftTypography>
                  <hr />
                  <SoftTypography style={{ fontSize: '0.8rem', marginTop: '15px' }}>
                    Billing emails are sent to <b>{planDetailsData.accountSubscription?.email}</b>
                  </SoftTypography>
                  <br />
                  {subscripitionStatus !== null && subscripitionStatus == 'ACTIVE' ? (
                    <SoftTypography style={{ fontSize: '0.8rem' }}>
                      Your next billing date is <b>{planDetailsData.accountSubscription?.renewalDate}</b>.
                    </SoftTypography>
                  ) : (
                    <SoftTypography style={{ fontSize: '0.8rem' }}>
                      You have currently unsbscribed from your current plan. Your next billing date is{' '}
                      <b>{planDetailsData.accountSubscription?.endDate}</b>.
                    </SoftTypography>
                  )}
                  <br />
                  {planDetailsData?.subscriptionPlan?.packageName !== 'STARTER' &&
                  subscripitionStatus !== null &&
                  subscripitionStatus == 'ACTIVE' ? (
                    <SoftBox sx={{ display: 'flex', gap: '1rem' }}>
                      <Button
                        variant="outlined"
                        style={{
                          // backgroundColor: '#0562FB',
                          color: '#0562FB',
                          padding: '7px',
                          margin: '10px',
                        }}
                        onClick={onCancelplan}
                      >
                        Cancel subscription
                      </Button>
                    </SoftBox>
                  ) : null}
                </>
              ) : null}
            </CardContent>
          </Card>

          {addonsList.length ? (
            <Card style={{ margin: '10px' }}>
              <CardContent>
                <SoftTypography style={{ fontSize: '1rem', fontWeight: '500' }}>Installed Addons</SoftTypography>
                <Box className="addons-list">
                  {addonsList.map((item) => (
                    <Box className="addon">
                      <Box
                        sx={{
                          height: '2rem',
                          width: '2rem',
                        }}
                      >
                        <img src={item.logoUrl} className="addon-img" />
                      </Box>

                      <SoftTypography style={{ fontSize: '0.8rem', fontWeight: '500' }}>
                        {item.packageName}
                      </SoftTypography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          ) : null}

          {(planDetailsData !== null &&
            planDetailsData.paymentInvoiceResponses.length &&
            planDetailsData.paymentInvoiceResponses !== null) ||
          (planDetailsData !== null &&
            planDetailsData.paymentInvoiceResponses.length &&
            planDetailsData.paymentInvoiceResponses !== undefined) ? (
            <Card style={{ margin: '10px' }}>
              <CardContent>
                <SoftTypography>Billing History</SoftTypography>
                <Box
                  sx={{
                    marginTop: '1rem',
                    padding: '15px',
                    overflow: 'auto !important',
                  }}
                >
                  {errorComing ? (
                    <SoftBox className="No-data-text-box">
                      <SoftBox className="src-imgg-data">
                        <img className="src-dummy-img" src={noDatagif} />
                      </SoftBox>

                      <h3 className="no-data-text-I">NO DATA FOUND</h3>
                    </SoftBox>
                  ) : (
                    <div style={{ height: 525, width: '99%', minWidth: '50rem' }}>
                      {loader && (
                        <SoftBox
                          sx={{
                            height: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <Spinner />
                        </SoftBox>
                      )}
                      {!loader && planDetailsDataRow !== null && (
                        <DataGrid
                          rows={planDetailsDataRow}
                          columns={planDetailsColumns}
                          getRowId={(row) => row.id}
                          // onCellClick={(rowData) => handleRowData(rowData.row)}
                          disableSelectionOnClick
                          pagination
                          pageSize={10}
                        />
                      )}
                    </div>
                  )}
                </Box>
              </CardContent>
            </Card>
          ) : null}
        </SoftBox>
      ) : (
        <SoftBox style={{ margin: '50px' }}>
          <Box className="back-btn-box">
            <SoftButton className="back-btn" onClick={handleBackBtn}>
              <ArrowBackIcon className="arrow-back-icon" />
              Back
            </SoftButton>
          </Box>
          <Card style={{ margin: '4rem' }}>
            <CardContent>
              <SoftBox className="billing-details-not-allowed">
                <SoftTypography className="billing-details-not-allowed-content">
                  You don't have access to this.
                </SoftTypography>
                <SoftTypography className="billing-details-not-allowed-content">
                  Please contact your Head Office for further details.
                </SoftTypography>
              </SoftBox>
            </CardContent>
          </Card>
        </SoftBox>
      )}
      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={handleCloseDrawer}
        className={classes.drawer}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Box
          className="top-header-drawer"
          sx={{
            marginTop: '1rem',
            padding: '1rem',
          }}
        >
          <SoftTypography
            sx={{
              fontSize: '1rem',
              fontWeight: 'bold',
            }}
          >
            Feature Consumption
          </SoftTypography>
          <CloseIcon
            onClick={handleCloseDrawer}
            sx={{
              fontSize: '1rem',
              cursor: 'pointer',
            }}
          />
        </Box>
        <Box className={classes.content}>
          <Box
            className="feature-consumtion"
            sx={{
              overflow: 'scroll',
            }}
          >
            <Box className="transaction-flex">
              <SoftTypography className="header-text">Feature Threshold</SoftTypography>
              <SoftTypography className="header-subtext">
                {' '}
                {featureUsage?.featureThreshold === 'UNLIMITED' ? 'UNLIMITED' : featureUsage?.featureThreshold}
              </SoftTypography>
            </Box>
            <Box className="transaction-flex">
              <SoftTypography className="header-text">Usage Value</SoftTypography>
              <SoftTypography className="header-subtext">{featureUsage?.usageValue}</SoftTypography>
            </Box>
            <Box className="transaction-flex">
              <SoftTypography className="header-text">Consumed Units</SoftTypography>
              <SoftTypography className="header-subtext">{featureUsage?.consumedUnits}</SoftTypography>
            </Box>
          </Box>

          <Box
            className="feature-usage-meter"
            sx={{
              marginTop: '2rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <ReactSpeedometer
              value={parseInt(featureUsage?.usageValue)}
              needleColor="#344767"
              startColor="blue"
              endColor="#343767"
              segments={5}
              maxValue={
                featureUsage?.featureThreshold === 'UNLIMITED'
                  ? parseInt(featureUsage?.usageValue) + 1000
                  : parseInt(featureUsage?.featureThreshold)
              }
              width={300}
              height={200}
              currentValueText={'Usage value: ${value} %'}
            />
            <ReactSpeedometer
              value={parseInt(featureUsage?.consumedUnits)}
              needleColor="#344767"
              startColor="blue"
              endColor="#343767"
              segments={5}
              maxValue={
                featureUsage?.featureThreshold === 'UNLIMITED'
                  ? parseInt(featureUsage?.usageValue) + 1000
                  : parseInt(featureUsage?.featureThreshold)
              }
              width={300}
              height={200}
              currentValueText={'Consumed units: ${value} %'}
            />
          </Box>
        </Box>
      </Drawer>
      <Modal
        open={openAddContactModal}
        onClose={handleCloseAddContactModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            width: '60vw',
            height: '70vh',
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'center',
            margin: 'auto',
            marginTop: '6rem',
            borderRadius: '1rem',
            overflow: 'auto',
            position: 'relative',
          }}
        >
          <Box className="add-contact-info">
            <SoftTypography>Please add your default contact and default address as well.</SoftTypography>
            <SoftButton
              sx={{
                background: '#0562fb',
                color: '#ffffff',
              }}
              onClick={handleDefaultAddContactAddress}
            >
              OK
            </SoftButton>
          </Box>
        </Box>
      </Modal>
    </PageLayout>
  );
};

export default Billinginfo;
