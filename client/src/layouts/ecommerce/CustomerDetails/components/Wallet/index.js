import { useEffect, useState } from 'react';
import { useSnackbar } from '../../../../../hooks/SnackbarProvider';
import CommonDataGrid from '../../../Common/new-ui-common-components/common-datagrid';
import { getCustomerWalletDetails } from '../../../../../config/Services';
import { CopyToClipBoard, dateFormatter, isSmallScreen, noDatagif } from '../../../Common/CommonFunction';
import Spinner from '../../../../../components/Spinner';
import ViewMore from '../../../Common/mobile-new-ui-components/view-more';
import { useNavigate } from 'react-router-dom';

const CustomerWallet = ({ customerId }) => {
  const isMobileDevice = isSmallScreen();
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();
  const [viewMoreLoader, setViewMoreLoader] = useState(false);
  const [pageState, setPageState] = useState({
    loading: false,
    dataRows: [],
    page: 0,
    totalResults: 0,
    totalPages: 0,
    pageSize: 10,
    error: false,
  });

  // date, orderId, channel, location, amount, status
  const columns = [
    {
      field: 'created',
      headerName: 'Date',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 150,
      flex: 1
    },
    {
      field: 'orderCode',
      headerName: 'Order ID',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 180,
      flex: 1,
      renderCell: (params) => {
        return params?.row?.orderCode ? <CopyToClipBoard params={params} /> : 'N/A';
      },
    },
    {
      field: 'orderType',
      headerName: 'Channel',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 100,
      flex: 1
    },
    {
      field: 'location',
      headerName: 'Location',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 80,
      flex: 1
    },
    {
      field: 'amount',
      headerName: 'Amount',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 80,
      flex: 1
    },
    {
      field: 'transactionType',
      headerName: 'Status',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 100,
      flex: 1
    },
  ];

  const fetchCustomerWalletDetails = async () => {
    try {
      setPageState((prev) => ({ ...prev, loading: true }));

      const response = await getCustomerWalletDetails(customerId);
      if (response?.data?.status === 'ERROR' || response?.data?.es) {
        showSnackbar(response?.data?.message || 'Error fetching wallet data', 'error');
        setPageState((prev) => ({ ...prev, dataRows: [], loading: false, error: true }));
        setViewMoreLoader(false);
        return;
      }

      const rows = response?.data?.transactions?.map((el, index) => {
        return {
          id: index,
          created: el?.created ? dateFormatter(el?.created) : 'N/A',
          orderCode: el?.orderCode,
          orderType: el?.orderType || 'N/A',
          location: el?.order?.locationId || 'N/A',
          amount: el?.amount ?? 'N/A',
          transactionType: el?.transactionType || 'N/A',
        };
      });

      if (rows?.length > 0) {
        setPageState((prev) => ({
          ...prev,
          dataRows: rows,
          error: false,
          loading: false,
          totalResults: response?.data?.transactions?.length || 0,
        }));
      } else {
        setPageState((prev) => ({
          ...prev,
          dataRows: [],
          error: true,
          loading: false,
        }));
      }
      setViewMoreLoader(false);
    } catch (err) {
      setPageState((prev) => ({ ...prev, dataRows: [], loading: false, error: true }));
      setViewMoreLoader(false);
      showSnackbar(response?.data?.message || 'Error fetching wallet data', 'error');
    }
  };

  // const handleCellClick = (rows) => {
  //   const orderId = rows?.row?.orderCode;
  //   navigate(`/order/details/${orderId}`);
  // };

  useEffect(() => {
    fetchCustomerWalletDetails({ pageNo: 0 });
  }, []);

  return (
    <div>
      {pageState?.error && pageState?.dataRows?.length === 0 ? (
        <div className="No-data-text-box">
          <div className="src-imgg-data">
            <img className="src-dummy-img" src={noDatagif} />
          </div>

          <h3 className="no-data-text-I">NO DATA FOUND</h3>
        </div>
      ) : (
        <>
          {!isMobileDevice ? (
            <>
              {pageState?.loading ? (
                <div
                  sx={{
                    height: '400px',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Spinner />
                </div>
              ) : (
                <CommonDataGrid
                  rows={pageState?.dataRows || []}
                  columns={columns}
                  disableSelectionOnClick
                  getRowId={(row) => row?.id}
                />
              )}
            </>
          ) : (
            <>
              <>
                <div className="job-listing-main-div">
                  <div className="stock-count-title-div">
                    <span className="stock-count-title">Wallet Details</span>
                  </div>
                  <div className="job-list-card-main">
                    {pageState?.dataRows?.map((el) => (
                      <div className="job-card">
                        <div className="stack-row-center-between width-100">
                          <div className="flex-colum-align-start">
                            <span className="bill-card-label">Date</span>
                            <span className="bill-card-value">{el?.created || 'N/A'}</span>
                          </div>
                          <div className="flex-colum-align-end">
                            <span className="bill-card-label">Order Id</span>
                            <span className="bill-card-value">{el?.orderCode || 'N/A'}</span>
                          </div>
                        </div>
                        <div className="stack-row-center-between width-100">
                          <div className="flex-colum-align-start">
                            <span className="bill-card-label">Channel</span>
                            <span className="bill-card-value">{el?.orderType || 'N/A'}</span>
                          </div>
                          <div className="flex-colum-align-end">
                            <span className="bill-card-label">Amount</span>
                            <span className="bill-card-value">₹ {el?.amount || 'N/A'}</span>
                          </div>
                        </div>
                        <div className="stack-row-center-between width-100">
                          <div className="flex-colum-align-start">
                            <span className="bill-card-label">Location</span>
                            <span className="bill-card-value">{el?.location || 'N/A'}</span>
                          </div>
                          <div className="flex-colum-align-end">
                            <span className="bill-card-label">Status</span>
                            <span className="bill-card-value">{el?.transactionType || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {pageState?.dataRows?.length === pageState?.totalResults - 1 && (
                      <ViewMore
                        loading={viewMoreLoader}
                        handleNextFunction={() => {
                          setViewMoreLoader(true);
                          fetchCustomerWalletDetails({ pageNo: pageState?.page + 1 });
                          setPageState((prev) => ({ ...prev, page: prev?.page + 1 }));
                        }}
                      />
                    )}
                  </div>
                </div>
              </>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default CustomerWallet;
