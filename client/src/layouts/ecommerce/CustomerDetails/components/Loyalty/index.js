import { useEffect, useState } from 'react';
import { useSnackbar } from '../../../../../hooks/SnackbarProvider';
import CommonDataGrid from '../../../Common/new-ui-common-components/common-datagrid';
import {
  CopyToClipBoard,
  dateFormatter,
  isSmallScreen,
  noDatagif,
  textFormatter,
} from '../../../Common/CommonFunction';
import { getCustomerLoyaltyPointsList } from '../../../../../config/Services';
import { useNavigate } from 'react-router-dom';
import Spinner from '../../../../../components/Spinner';
import ViewMore from '../../../Common/mobile-new-ui-components/view-more';

const CustomerLoyalty = ({ customerId, uidx, orgId, locId, retailId }) => {
  const showSnackbar = useSnackbar();
  const isMobileDevice = isSmallScreen();
  const navigate = useNavigate();
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

  const columns = [
    {
      field: 'date',
      headerName: 'Date',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 220,
      flex: 1,
    },
    {
      field: 'orderId',
      headerName: 'Order ID',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 180,
      flex: 1,
      renderCell: (params) => {
        return <CopyToClipBoard params={params} />;
      },
    },
    {
      field: 'channel',
      headerName: 'Channel',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 180,
      flex: 1,
    },
    {
      field: 'location',
      headerName: 'Location',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 80,
      flex: 1,
    },
    {
      field: 'amount',
      headerName: 'Amount',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 100,
      flex: 1,
    },
    {
      field: 'status',
      headerName: 'Status',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
      minWidth: 100,
      flex: 1,
    },
  ];

  const fetchCustomerLoyalty = async ({ pageNo }) => {
    const payload = {
      customerId: customerId || uidx || retailId, // customerId for app, uidx for pos
      organizationId: orgId,
      locationId: uidx ? locId : retailId ? locId : '',
      page: pageNo,
      size: pageState?.pageSize,
    };
    try {
      setPageState((prev) => ({ ...prev, page: pageNo, loading: true }));

      const response = await getCustomerLoyaltyPointsList(payload);
      if (response?.data?.status === 'ERROR' || response?.data?.data?.es) {
        showSnackbar(response?.data?.data?.message || 'Error fetching loyalty details', 'error');
        setPageState((prev) => ({
          ...prev,
          dataRows: [],
          totalPages: 0,
          totalResults: 0,
          error: true,
          loading: false,
        }));
        return;
      }

      const dataRows = response?.data?.data?.customerLoyaltyDto?.map((row, index) => {
        return {
          id: index,
          date: row?.date ? dateFormatter(row?.date) : 'N/A',
          orderId: row?.orderId || 'N/A',
          channel: row?.channel || 'N/A',
          location: row?.location || 'N/A',
          amount: row?.amount || 'N/A',
          status: row?.status || 'N/A',
        };
      });

      setPageState((prev) => ({
        ...prev,
        dataRows: dataRows || [],
        totalPages: response?.data?.data?.numberOfPages,
        totalResults: response?.data?.data?.numberOfRows,
        error: false,
        loading: false,
      }));
    } catch (err) {
      setPageState((prev) => ({ ...prev, dataRows: [], totalPages: 0, totalResults: 0, error: true, loading: false }));
      showSnackbar('Error fetching loyalty details', 'error');
    }
  };

  const handleCellClick = (rows) => {
    const orderId = rows?.row?.id;
    navigate(`/order/details/${orderId}`);
  };

  useEffect(() => {
    fetchCustomerLoyalty({ pageNo: 0 });
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
          {pageState?.loading && (
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
          )}
          {!isMobileDevice ? (
            <>
              <CommonDataGrid
                page={pageState?.page}
                rows={pageState?.dataRows || []}
                rowCount={pageState?.totalResults}
                columns={columns}
                pagination
                pageSize={pageState?.pageSize}
                paginationMode="server"
                disableSelectionOnClick
                onCellClick={(rows) => handleCellClick(rows)}
                onPageChangeFunction={() => fetchCustomerLoyalty({ pageNo: pageState?.page + 1 })}
              />
            </>
          ) : (
            <>
              <div className="job-listing-main-div">
                <div className="stock-count-title-div">
                  <span className="stock-count-title">Loyalty Details</span>
                </div>
                <div className="job-list-card-main">
                  {pageState?.dataRows?.map((el) => (
                    <div className="job-card">
                      <div className="stack-row-center-between width-100">
                        <div className="flex-colum-align-start">
                          <span className="bill-card-label">Order Id</span>
                          <span className="bill-card-value">{el?.orderId || 'N/A'}</span>
                        </div>
                        <div className="flex-colum-align-start">
                          <span className="bill-card-label">Channel</span>
                          <span className="bill-card-value">{el?.channel || 'N/A'}</span>
                        </div>
                      </div>
                      <div className="stack-row-center-between width-100">
                        <div className="flex-colum-align-start">
                          <span className="bill-card-label">Amount</span>
                          <span className="bill-card-value">{el?.amount || 'N/A'}</span>
                        </div>
                        <div className="flex-colum-align-start">
                          <span className="bill-card-label">Location</span>
                          <span className="bill-card-value">{el?.location || 'N/A'}</span>
                        </div>
                      </div>
                      <div className="stack-row-center-between width-100">
                        <div className="flex-colum-align-start">
                          <span className="bill-card-label">Status</span>
                          <span className="bill-card-value">{el?.status || 'N/A'}</span>
                        </div>
                        <div className="flex-colum-align-end">
                          <span className="bill-card-label">Date</span>
                          <span className="bill-card-value">{el?.date || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {pageState?.dataRows?.length === pageState?.totalResults - 1 && (
                    <ViewMore
                      loading={viewMoreLoader}
                      handleNextFunction={() => {
                        setViewMoreLoader(true);
                        setPageState((prev) => ({ ...prev, page: prev?.page + 1 }));
                      }}
                    />
                  )}
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default CustomerLoyalty;
