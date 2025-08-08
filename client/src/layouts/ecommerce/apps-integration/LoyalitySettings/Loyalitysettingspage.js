import { Box, Grid } from '@mui/material';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import React, { useEffect, useState } from 'react';

import { DataGrid } from '@mui/x-data-grid';
import { Snackbar } from '@mui/material';
import { dateFormatter, noDatagif } from '../../Common/CommonFunction';
import {
  getBlacklistedCustomers,
  getLoyaltyConfiguration,
  getLoyaltyDetails,
  getRecentLoyaltyTransactions,
  removeBlacklistedCustomer,
} from '../../../../config/Services';
import { setPoints, setRewards, setTerms, setTitle } from '../../../../datamanagement/loyaltyProgramSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../../../hooks/SnackbarProvider';
import LoyalityPointsGrid from './LoyalityPointsGrid';
import MuiAlert from '@mui/material/Alert';
import SoftBox from '../../../../components/SoftBox';
import SoftButton from '../../../../components/SoftButton';
import SoftInput from '../../../../components/SoftInput';

const tColumns = [
  {
    field: 'id',
    headerName: 'Sr No.',
    headerAlign: 'center',
    minWidth: 80,
    flex: 1,
    headerStyle: { fontSize: '14px' },
    cellStyle: { fontSize: '12px' },
    align: 'center',
    sortable: false,
    disableColumnMenu: true,
    headerClassName: 'datagrid-columns',
    headerAlign: 'center',
    cellClassName: 'datagrid-rows',
    align: 'center',
  },
  {
    field: 'order_id',
    headerName: 'Order Id',
    headerAlign: 'center',
    minWidth: 80,
    flex: 1,
    headerStyle: { fontSize: '14px' },
    cellStyle: { fontSize: '12px' },
    align: 'center',
    sortable: false,
    disableColumnMenu: true,
    headerClassName: 'datagrid-columns',
    headerAlign: 'center',
    cellClassName: 'datagrid-rows',
    align: 'center',
  },
  {
    field: 'redeem_type',
    headerName: 'Transaction Type',
    headerAlign: 'center',
    minWidth: 80,
    flex: 1,
    headerStyle: { fontSize: '14px' },
    cellStyle: { fontSize: '12px' },
    align: 'center',
    sortable: false,
    disableColumnMenu: true,
    headerClassName: 'datagrid-columns',
    headerAlign: 'center',
    cellClassName: 'datagrid-rows',
    align: 'center',
  },
  {
    field: 'date',
    headerName: 'Date',
    headerAlign: 'center',
    minWidth: 80,
    flex: 1,
    headerStyle: { fontSize: '14px' },
    cellStyle: { fontSize: '12px' },
    align: 'center',
    sortable: false,
    disableColumnMenu: true,
    headerClassName: 'datagrid-columns',
    headerAlign: 'center',
    cellClassName: 'datagrid-rows',
    align: 'center',
  },
  {
    field: 'loyaltyRedeemed',
    headerName: 'Loyalty Points',
    headerAlign: 'center',
    minWidth: 80,
    flex: 1,
    headerStyle: { fontSize: '14px' },
    cellStyle: { fontSize: '12px' },
    align: 'center',
    sortable: false,
    disableColumnMenu: true,
    headerClassName: 'datagrid-columns',
    headerAlign: 'center',
    cellClassName: 'datagrid-rows',
    align: 'center',
  },
];

const Loyalitysettings = () => {
  const orgId = localStorage?.getItem('orgId');
  const navigate = useNavigate();
  const showSnackBar = useSnackbar();
  const dispatch = useDispatch();
  const [opensnack, setOpensnack] = useState(false);
  const [timelinerror, setTimelineerror] = useState('');
  const [alertmessage, setAlertmessage] = useState('');
  const [loader, setLoader] = useState(false);
  const [dataMain, setDataMain] = useState([]);
  const [tLoyalty, setTLoyalty] = useState({});
  const [nodata, setNodata] = useState(false);
  const [loyaltydetails, setLoyaltyDetails] = useState([]);
  const permissions = JSON.parse(localStorage.getItem('permissions'));
  const [deleted, setDeleted] = useState(false);
  const [update, setUpdate] = useState(false);
  const [blacklisted, setBlackListed] = useState({
    loader: false,
    dataRows: [],
    page: 0,
    pageSize: 10,
    total: 0,
  });
  const [loyaltyType, setLoyaltyType] = useState({});
  const [loyaltyRows, setLoyaltyRows] = useState({
    loader: false,
    dataRows: [],
    page: 0,
    pageSize: 10,
    total: 0,
  });

  const [tLoyaltyRows, setTLoyaltyRows] = useState({
    loader: false,
    dataRows: [],
    page: 0,
    pageSize: 10,
    total: 0,
  });

  const bsColumn = [
    {
      field: 'custNameMob',
      headerName: 'Customer Mobile/Name',
      headerAlign: 'center',
      minWidth: 100,
      flex: 1,
      headerStyle: { fontSize: '14px' },
      cellStyle: { fontSize: '12px' },
      align: 'center',
      sortable: false,
      disableColumnMenu: true,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'id',
      headerName: 'Id',
      headerAlign: 'center',
      minWidth: 100,
      flex: 1,
      headerStyle: { fontSize: '14px' },
      cellStyle: { fontSize: '12px' },
      align: 'center',
      sortable: false,
      disableColumnMenu: true,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'date',
      headerName: 'Date',
      headerAlign: 'center',
      minWidth: 50,
      flex: 1,
      headerStyle: { fontSize: '14px' },
      cellStyle: { fontSize: '12px' },
      align: 'center',
      sortable: false,
      disableColumnMenu: true,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'reason',
      headerName: 'Reason',
      headerAlign: 'center',
      minWidth: 600,
      flex: 1,
      headerStyle: { fontSize: '14px' },
      cellStyle: { fontSize: '12px' },
      align: 'center',
      sortable: false,
      disableColumnMenu: true,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'status',
      headerName: 'Status',
      headerAlign: 'center',
      minWidth: 50,
      flex: 1,
      headerStyle: { fontSize: '14px' },
      cellStyle: { fontSize: '12px' },
      align: 'center',
      sortable: false,
      disableColumnMenu: true,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'remove',
      headerName: '',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 40,
      cellClassName: 'datagrid-rows',
      align: 'left',
      renderCell: (params) => {
        return (
          <SoftButton className="vendor-add-btn" onClick={() => handleRemoveBlackListedCustomer(orgId, params.id)}>
            Remove
          </SoftButton>
        );
      },
    },
  ];

  const handleRemoveBlackListedCustomer = (orgId, uidx) => {
    removeBlacklistedCustomer(orgId, uidx)
      .then((response) => {
        setUpdate(!update);
        showSnackBar(response?.data?.message);
      })
      .catch((err) => {
        showSnackBar(err?.message || err.response.data?.message);
      });
  };

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const orgID = localStorage.getItem('orgId');
  useEffect(() => {
    // getTotalLoyaltyUsage(orgID).then((response) => {
    //   setTLoyalty({
    //     totalLoayltyPoints: response?.data?.data?.data?.totalRewardedPoint,
    //     totalExpiredPoints: response?.data?.data?.data?.totalExpiredPoint,
    //     totalRedeemedPoints: response?.data?.data?.data?.totalRedeemedPoint,
    //     totalCancelledPoints: response?.data?.data?.data?.totalCancelledPoint,
    //     totalAvailablePoints: response?.data?.data?.data?.totalAvailablePoint,
    //   });
    // });
    getLoyaltyDetails(orgID)
      .then((res) => {
        const todayDate = new Date().toISOString().slice(0, 10);
        const rtPayload = {
          configId: res?.data?.data?.data?.configId,
          startDate: '2023-08-20',
          endDate: todayDate,
          transactionType: 'REDEEM',
          loyaltyPointStatus: 'DEBITED',
          paginationSortingReq: {
            pageNo: 0,
            pageSize: 100,
          },
        };
        if (res?.data?.data?.status) {
          getRecentLoyaltyTransactions(rtPayload).then((response) => {
            if (response?.data?.data?.data?.data) {
              setNodata(false);
              setTLoyaltyRows((prevState) => ({
                ...prevState,
                dataRows: response?.data?.data?.data?.data?.map((ele, index) => {
                  return {
                    id: index + 1,
                    order_id: ele?.orderId,
                    redeem_type: ele?.transactionType,
                    date: dateFormatter(ele?.transactionOn),
                    loyaltyRedeemed: ele?.loyaltyPointQuantity,
                  };
                }),
                total: response?.data?.data?.data?.data?.length,
              }));
            } else {
              setNodata(true);
            }
          });
        }
        setLoader(true);
        if (res?.data?.data?.data?.manfacturerSupportList.length > 0) {
          setLoyaltyType({
            value: 'MANUFACTURER',
            label: 'Manufacturer',
          });
          if (res?.data?.data.status === true) {
            setLoyaltyRows((prevState) => ({
              ...prevState,
              dataRows: res?.data?.data?.data?.manfacturerSupportList.map((manufactur, index) => {
                return {
                  id: index + 1,
                  configId: manufactur.configId,
                  createdOn: manufactur.createdOn,
                  incrementalValue: manufactur.incrementalValue + 'X',
                  name: manufactur.manufacturerName,
                  status: manufactur.status === true ? 'ACTIVE' : 'INACTIVE',
                  expiryAfter: manufactur.expiryAfter,
                };
              }),
              total: res?.data?.data?.data?.manfacturerSupportList.length,
            }));
            setLoader(false);
            setOpensnack(true);
            setTimelineerror('success');
            setAlertmessage(res?.data?.data?.message);
          } else {
            setLoader(false);
            setOpensnack(true);
            setTimelineerror('warning');
            setAlertmessage(res?.data?.data?.message);
          }
        } else {
          setLoyaltyType({
            value: 'PRODUCT_CATEGORY',
            label: 'Product Category',
          });
          if (res?.data?.data.status === true) {
            setLoyaltyRows((prevState) => ({
              ...prevState,
              dataRows: res?.data?.data?.data?.productCategorySupportList.map((category, index) => {
                return {
                  id: index + 1,
                  configId: category.configId,
                  createdOn: category.createdOn,
                  incrementalValue: category.incrementalValue + 'X',
                  name: category.productCategory,
                  status: res?.data?.data?.data?.configurationStatus,
                  expiryAfter: category?.expiryAfter,
                };
              }),
              total: res?.data?.data?.data?.productCategorySupportList?.length,
            }));
            setLoader(false);
            setOpensnack(true);
            setTimelineerror('success');
            setAlertmessage(res?.data?.data?.message);
          } else {
            setLoader(false);
            setOpensnack(true);
            setTimelineerror('warning');
            setAlertmessage(res?.data?.data?.message);
          }
        }
      })
      .catch((error) => {
        setLoader(false);
        setOpensnack(true);
        setTimelineerror('warning');
        setAlertmessage(error?.data?.data?.message);
      });
  }, []);

  useEffect(() => {
    getBlacklistedCustomers(orgID).then((resp) => {
      if (resp?.data?.data?.data) {
        setBlackListed((prevState) => ({
          ...prevState,
          dataRows: resp?.data?.data?.data?.map((ele, index) => {
            return {
              id: ele?.customerId,
              date: dateFormatter(ele?.createdDate),
              custNameMob: ele?.mobileNumber ? ele?.mobileNumber : ele?.name ? ele?.name : '---',
              reason: ele?.reason,
              status: ele?.status,
            };
          }),
          total: resp?.data?.data?.data?.length,
        }));
      }
    });
  }, [update]);

  useEffect(() => {
    const orgID = localStorage.getItem('orgId');
    setLoader(true);
    getLoyaltyConfiguration(orgID).then((res) => {
      const result = res?.data?.data?.data;
      if (result) {
        setDataMain(result);

        const newArray = result.map((obj) => ({
          header: obj?.header,
          subheading: obj?.subTitle,
          pointsEarned: obj?.rewardRatePoint,
          amountSpent: obj?.rewardRateAmount,
          pointValue: obj?.rewardRatePointValue,
          minPurchaseAmt: obj?.redeemThresholdAmount,
          customerType: obj?.customerType,
        }));

        setLoyaltyDetails(newArray);
      } else {
        setDataMain(null);
        setLoyaltyDetails(null);
      }
      setLoader(false);
    });
  }, [deleted]);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpensnack(false);
  };

  const createNewLoyaltyProgram = () => {
    dispatch(
      setTitle({ header: `${localStorage.getItem('orgName')} Loyalty`, subheader: localStorage.getItem('locName') }),
    );
    dispatch(
      setPoints({
        pointsGiven: '1',
        amountSpend: '100',
        pointsBrand: 'Points',
        pointsValue: '1',
        validity: '',
        date: '',
      }),
    );
    dispatch(
      setRewards({
        minReqPoints: '',
        generalAmountSpend: {
          rewardType: '',
          freeItem: 'nil',
          percentageDis: '',
          maxAmountPercent: '',
          cashDiscount: 'nil',
        },
      }),
    );
    dispatch(setTerms({ num_trans_per_day: '', minPurchaseReq: '', max_reward_per_transaction: '', clubbed: '' }));
    navigate('/new-loyalty-config/type-selection');
  };

  const isPosUser = dataMain?.some((item) => item.customerType == 'POS_USER');
  const isEndCustomer = dataMain?.some((item) => item.customerType == 'END_CUSTOMER');

  const posUser = loyaltydetails?.find((obj) => obj.customerType === 'POS_USER');
  const endUser = loyaltydetails?.find((obj) => obj.customerType === 'END_CUSTOMER');

  const handleLoyaltyDetails = (row) => {
    navigate(`/loyalty/details/${row.id}`);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox className="loyalty-new-button-box">
        <SoftBox className="heading" fontSize="1.4375rem">
          Loyalty Program
        </SoftBox>
        <SoftButton variant="contained" color="info" onClick={() => createNewLoyaltyProgram()}>
          New
        </SoftButton>
      </SoftBox>
      {isEndCustomer && (
        <>
          <p style={{ color: 'rgb(110, 118, 128)', fontSize: '1rem' }}>Active customer loyalty programs :</p>
          <hr style={{ borderColor: '#ede7e6', opacity: '0.5', marginBottom: '20px' }} />
        </>
      )}
      <Grid container spacing={3}>
        {isEndCustomer ? (
          dataMain
            .filter((item) => item.customerType === 'END_CUSTOMER')
            .map((e, i) => <LoyalityPointsGrid data={endUser} loader={loader} mainData={e} setDeleted={setDeleted} />)
        ) : (
          <SoftBox className="No-data-text-box-loyalty">
            <SoftBox className="src-imgg-data-loyalty">
              <img
                className="src-dummy-img"
                src="https://cdn.dribbble.com/users/458522/screenshots/3571483/create.jpg?resize=800x600&vertical=center"
              />
            </SoftBox>
            <h3 className="no-data-text-I">
              No active loyalty program. Please create a new loyalty program for your customers.
            </h3>
          </SoftBox>
        )}
      </Grid>
      <hr style={{ borderColor: '#ede7e6', opacity: '0.5', marginBottom: '20px' }} />
      {isPosUser && (
        <>
          {' '}
          <p style={{ color: 'rgb(110, 118, 128)', fontSize: '1rem', marginTop: '20px' }}>
            Active staff loyalty programs :
          </p>
          <hr style={{ borderColor: '#ede7e6', opacity: '0.5', marginBottom: '20px' }} />
        </>
      )}{' '}
      <Grid container spacing={3}>
        {isPosUser ? (
          dataMain
            .filter((item) => item.customerType === 'POS_USER')
            .map((e, i) => <LoyalityPointsGrid data={posUser} loader={loader} mainData={e} setDeleted={setDeleted} />)
        ) : (
          <SoftBox className="No-data-text-box-loyalty">
            <SoftBox className="src-imgg-data-loyalty">
              <img
                className="src-dummy-img"
                src="https://cdn.dribbble.com/users/458522/screenshots/3571483/create.jpg?resize=800x600&vertical=center"
              />
            </SoftBox>
            <h3 className="no-data-text-I">
              No active loyalty program. Please create a new loyalty program for your staffs.
            </h3>
          </SoftBox>
        )}
      </Grid>
      <SoftBox my={3}>
        <p style={{ color: 'rgb(110, 118, 128)', fontSize: '1rem' }}>Recent loyalty transactions :</p>
        <hr style={{ borderColor: '#ede7e6', opacity: '0.5' }} />
      </SoftBox>
      <SoftBox className="header-bulk-price-edit all-products-filter-wrapper search-bar-filter-container">
        <Grid container spacing={2} className="all-products-filter">
          <>
            <Grid item lg={5.5} md={5.5} sm={6} xs={12}>
              <Box className="all-products-filter-product">
                <SoftInput
                  className="all-products-filter-soft-input-box"
                  placeholder="Search transactions here..."
                  icon={{ component: 'search', direction: 'left' }}
                />
              </Box>
            </Grid>
          </>
        </Grid>
      </SoftBox>
      <SoftBox style={{ height: 525, width: '100%' }} className="dat-grid-table-box">
        <DataGrid
          className="data-grid-table-boxo"
          rows={tLoyaltyRows.dataRows}
          columns={tColumns}
          rowCount={tLoyaltyRows.total}
          pagination
          page={0}
          pageSize={10}
          disableSelectionOnClick
          components={{
            NoRowsOverlay: () => (
              <SoftBox className="No-data-text-box">
                <SoftBox className="src-imgg-data">
                  <img className="src-dummy-img" src={noDatagif} />
                </SoftBox>
                <h3 className="no-data-text-I"> No transaction available</h3>
              </SoftBox>
            ),
            NoResultsOverlay: () => (
              <SoftBox className="No-data-text-box">
                <SoftBox className="src-imgg-data">
                  <img className="src-dummy-img" src={noDatagif} />
                </SoftBox>
                <h3 className="no-data-text-I"> No transaction available</h3>
              </SoftBox>
            ),
          }}
        />
      </SoftBox>
      <SoftBox my={3}>
        <p style={{ color: 'rgb(110, 118, 128)', fontSize: '1rem' }}>Blacklisted Customers :</p>
        <hr style={{ borderColor: '#ede7e6', opacity: '0.5' }} />
      </SoftBox>
      <SoftBox className="header-bulk-price-edit all-products-filter-wrapper search-bar-filter-container">
        <Grid container spacing={2} className="all-products-filter">
          <>
            <Grid item lg={5.5} md={5.5} sm={6} xs={12}>
              <Box className="all-products-filter-product">
                <SoftInput
                  className="all-products-filter-soft-input-box"
                  placeholder="Search Customers here..."
                  icon={{ component: 'search', direction: 'left' }}
                />
              </Box>
            </Grid>
          </>
        </Grid>
      </SoftBox>
      <SoftBox style={{ height: 525, width: '100%' }} className="dat-grid-table-box">
        <DataGrid
          className="data-grid-table-boxo"
          rows={blacklisted.dataRows}
          columns={bsColumn}
          rowCount={blacklisted.total}
          getRowId={(row) => row.id}
          pagination
          page={0}
          pageSize={10}
          // onCellClick={(params) => handleLoyaltyDetails(params)}
          components={{
            NoRowsOverlay: () => (
              <SoftBox className="No-data-text-box">
                <SoftBox className="src-imgg-data">
                  <img className="src-dummy-img" src={noDatagif} />
                </SoftBox>
                <h3 className="no-data-text-I">No blacklisted customers available</h3>
              </SoftBox>
            ),
            NoResultsOverlay: () => (
              <SoftBox className="No-data-text-box">
                <SoftBox className="src-imgg-data">
                  <img className="src-dummy-img" src={noDatagif} />
                </SoftBox>
                <h3 className="no-data-text-I">No blacklisted customers available</h3>
              </SoftBox>
            ),
          }}
        />
      </SoftBox>
      <Snackbar open={opensnack} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={timelinerror} sx={{ width: '100%' }}>
          {alertmessage}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
};

export default Loyalitysettings;
