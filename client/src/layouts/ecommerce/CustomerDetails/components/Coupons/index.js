import { useEffect, useState } from 'react';
import SoftTypography from '../../../../../components/SoftTypography';
import Spinner from '../../../../../components/Spinner';
import { getCustomerCouponList } from '../../../../../config/Services';
import { useSnackbar } from '../../../../../hooks/SnackbarProvider';
import { dateFormatter, isSmallScreen, noDatagif } from '../../../Common/CommonFunction';
import ViewMore from '../../../Common/mobile-new-ui-components/view-more';
import './index.css';
import { useSelector } from 'react-redux';

const CustomerCoupons = ({ appUserMobileNumber, orgId, locId }) => {
  const custData = useSelector((state) => state.customerBaseDetails);
  const customerData = custData.customerBaseDetails[0];
  const isMobileDevice = isSmallScreen();

  const posUserMobileNumber = customerData?.mobileNumber;
  const showSnackbar = useSnackbar();
  const [pageState, setPageState] = useState({
    loading: false,
    dataRows: [],
    page: 0,
    totalResults: 0,
    totalPages: 0,
    pageSize: 5,
    error: false,
  });
  const [showViewMore, setShowViewMore] = useState(false);
  const [viewMoreLoader, setViewMoreLoader] = useState(false);

  const fetchCustomerCoupons = async ({ pageNo }) => {
    const payload = {
      mobileNumber: appUserMobileNumber ? appUserMobileNumber : posUserMobileNumber,
      ...(orgId && { organizationId: orgId }),
      ...(posUserMobileNumber && { locationId: locId }),
      page: pageNo,
      size: pageState.pageSize,
    };
    try {
      setPageState((prev) => ({ ...prev, page: pageNo, loading: true }));
      const response = await getCustomerCouponList(payload);

      if (response?.data?.status === 'ERROR' || response?.data?.data?.es) {
        showSnackbar(response?.data?.data?.message || 'Error fetching coupons data', 'error');
        setPageState((prev) => ({
          ...prev,
          dataRows: [],
          totalPages: 0,
          totalResults: 0,
          loading: false,
          error: true,
        }));
        setViewMoreLoader(false);
        return;
      }
      const showViewMoreButton = (payload.page + 1) * payload?.size < response?.data?.data?.numberOfRows;
      setShowViewMore(showViewMoreButton);

      setPageState((prev) => ({
        ...prev,
        dataRows: [...prev.dataRows, ...response?.data?.data?.customerCouponDetailsDtoList],
        totalPages: response?.data?.data?.numberOfPages,
        totalResults: response?.data?.data?.numberOfRows,
        loading: false,
        error: false,
      }));
      setViewMoreLoader(false);
    } catch (err) {
      setPageState((prev) => ({ ...prev, dataRows: [], totalPages: 0, totalResults: 0, loading: false, error: true }));
      setViewMoreLoader(false);
      showSnackbar('Error fetching coupons data', 'error');
    }
  };

  useEffect(() => {
    fetchCustomerCoupons({ pageNo: 0 });
  }, []);

  return (
    <div>
      <div style={{ marginTop: '20px', height: '500px' }} className="overflow-scroll">
        {pageState?.error && pageState?.dataRows?.length === 0 ? (
          <div className="No-data-text-box">
            <div className="src-imgg-data">
              <img className="src-dummy-img" src={noDatagif} />
            </div>

            <h3 className="no-data-text-I">NO DATA FOUND</h3>
          </div>
        ) : (
          <>
            {pageState?.loading && !viewMoreLoader ? (
              <div>
                <Spinner />
              </div>
            ) : (
              pageState?.dataRows?.map((el) => (
                <div
                  style={{
                    borderRadius: '10px',
                    padding: '10px',
                    border: '1px solid gainsboro',
                    marginBottom: '10px',
                  }}
                  className="content-space-between"
                >
                  <div>
                    <SoftTypography fontSize={isMobileDevice ? "0.8rem" : "1rem"} fontWeight="bold">
                      {el?.offerName || 'N/A'}
                    </SoftTypography>
                    <SoftTypography fontSize={isMobileDevice ? "0.6rem" : "0.8rem"}>{el?.description || 'N/A'}</SoftTypography>
                  </div>
                  <div>
                    <SoftTypography fontSize={isMobileDevice ? "0.8rem" : "1rem"} fontWeight="bold">
                      {el?.couponCode || 'N/A'}
                    </SoftTypography>
                    <SoftTypography fontSize={isMobileDevice ? "0.6rem" : "0.8rem"}>{el?.validTo ? dateFormatter(el?.validTo) : 'N/A'}</SoftTypography>
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </div>
      {/* show view more button  */}
      {showViewMore && (
        <ViewMore
          loading={pageState.loading}
          handleNextFunction={() => {
            setViewMoreLoader(true);
            fetchCustomerCoupons({ pageNo: pageState.page + 1 });
          }}
        />
      )}
    </div>
  );
};

export default CustomerCoupons;
