import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { isSmallScreen } from '../../Common/CommonFunction';
import { JobLists } from './components/job-lists';
import './index.css';
import { CircularProgress, Grid } from '@mui/material';
import { debounce } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import SoftBox from '../../../../components/SoftBox';
import SoftTypography from '../../../../components/SoftTypography';
import { getSessionListV3 } from '../../../../config/Services';
import { getPageTitle } from '../../../../datamanagement/Filters/commonFilterSlice';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import { useSnackbar } from '../../../../hooks/SnackbarProvider';
import { SessionCard } from './components/sessioncard';
import ViewMore from '../../Common/mobile-new-ui-components/view-more';
import CustomMobileButton from '../../Common/mobile-new-ui-components/button';

export const StockCount = () => {
  const dispatch = useDispatch();
  const pageTitle = useSelector(getPageTitle);
  const isMobileDevice = isSmallScreen();
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();
  const location = useLocation(); 
  const isRosAppInventoryPage = location.pathname.includes('ros-app-inventory');

  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const user_details = localStorage.getItem('user_details');
  const uidx = user_details && JSON.parse(user_details).uidx;
  const roles = localStorage.getItem('user_roles');
  const hasAccess = roles.includes('RETAIL_USER');
  const useRoles = JSON.parse(localStorage.getItem('user_roles'));
  const allowStockCountListing = useRoles? useRoles.some(role => ['STORE_MANAGER', 'ADMIN', 'SUPER_ADMIN'].includes(role)) : null;

  // const [infiniteLoader, setInfiniteLoader] = useState(false);
  const [showViewMore, setShowViewMore] = useState(true);
  const [initialLoader, setInitialLoader] = useState(false);
  const [errorComing, setErrorComing] = useState(false);

  const [tab, setTab] = useState(localStorage.getItem('stockCountTabName') || 'sessionList');

  const handleTab = (tabName) => {
    setTab(tabName);
    localStorage.setItem('stockCountTabName', tabName);
  }

  const [pageState, setPageState] = useState({
    loading: false,
    dataRows: [],
    page: 0,
    totalResults: 0,
    totalPages: 0,
    pageSize: 5,
  });

  // get stock session list with pagination
  const getSessionList = async ({ pageNo }) => {
    try {
      // setInfiniteLoader(true);
      pageNo === 0 && setInitialLoader(true);
      setPageState((prev) => ({ ...prev, loading: true, page: pageNo }));

      const payload = {
        pageNumber: pageNo,
        pageSize: pageState?.pageSize,
        locationId: locId,
        counterUidx: uidx,
      };

      const response = await getSessionListV3(payload);

      if (response?.data?.data?.es === 0) {
        if (response?.data?.data?.pageNumber === response?.data?.data?.totalPages - 1) {
          setShowViewMore(false);
        } else {
          if (!showViewMore) {
            setShowViewMore(true);
          }
        }

        setPageState((prev) => ({
          ...prev,
          dataRows: pageNo === 0 ? response?.data?.data?.sessions : [...prev.dataRows, ...response?.data?.data?.sessions],
          loading: false,
          totalResults: response?.data?.data?.totalResults,
          totalPages: response?.data?.data?.totalPages,
        }));
        // setInfiniteLoader(false);
        setInitialLoader(false);
        setErrorComing(false);
      } else {
        setPageState((prev) => ({ ...prev, dataRows: [] }));
        setShowViewMore(false);
        setInitialLoader(false);
        setErrorComing(true);
      }
    } catch (err) {
      setPageState((prev) => ({ ...prev, dataRows: [], totalPages: 0, totalResults: 0, loading: false }));
      setInitialLoader(false);
      setErrorComing(true);
      showSnackbar('Something went wrong', 'error');
    }
  };

  const handleProductCount = (sessionId, jobType) => {
    // navigate(`/stock-taking/stock-items-list/${sessionId}`);
    navigate(`/inventory/stock-count/stock-items-list/${sessionId}`, { state: { jobType: jobType } });
  };

  const checkAccess = () => {
    if (!hasAccess) {
      Swal.fire({
        icon: 'error',
        title: 'You do not have access to this page',
        showConfirmButton: true,
        confirmButtonText: 'OK',
      }).then(() => {
        navigate(-1);
      });
    }
  };

  useEffect(() => {
    checkAccess();
  }, []);

  // summary and listing
  useEffect(() => {
    if(isMobileDevice){
      if(tab === 'jobList') return;
      getSessionList({ pageNo: 0 });
    }
  }, [tab]);
  
  return (
    <DashboardLayout>
      {!isMobileDevice && <DashboardNavbar />}
      {hasAccess && isMobileDevice && (
        <SoftBox className="pi-listing-card-main-div">
          {isRosAppInventoryPage && (
            <div className="listing-order-name-main">
              <CustomMobileButton
                variant={tab === 'sessionList' ? 'black-D' : 'black-S'}
                title={'Session List'}
                onClickFunction={() => handleTab('sessionList')}
                flex={1}
                justifyContent={'center'}
              >
                Session List
              </CustomMobileButton>
              {allowStockCountListing && (
                <CustomMobileButton
                  // key={filter.name}
                  variant={tab === 'jobList' ? 'black-D' : 'black-S'}
                  title={'Job List'}
                  onClickFunction={() => handleTab('jobList')}
                  flex={1}
                  justifyContent={'center'}
                >
                  Job List
                </CustomMobileButton>
              )}
            </div>
          )}

          {tab === 'sessionList' && (
            <>
              {initialLoader && (
                <SoftBox className="content-center" sx={{ width: '100%' }}>
                  <CircularProgress size={30} color="info" />
                </SoftBox>
              )}

              {pageState?.dataRows?.length > 0 &&
                tab === 'sessionList' &&
                pageState.dataRows.map((session, index) => (
                  <SessionCard
                    key={index}
                    sessionDetails={session}
                    onClick={() => {
                      localStorage.setItem('sessionStatus', session?.status);
                      handleProductCount(session?.sessionId, session?.jobType);
                    }}
                  />
                ))}
              {((!pageState?.dataRows?.length && !pageState?.loading) || errorComing) && (
                <SoftBox className="content-center" sx={{ width: '100%' }}>
                  <SoftTypography variant="h4" fontSize="1.2rem" fontWeight="bold" sx={{ textAlign: 'center' }}>
                    No sessions available
                  </SoftTypography>
                </SoftBox>
              )}

              {showViewMore && isMobileDevice && pageState?.dataRows?.length !== 0 && tab === 'sessionList' ? (
                <>
                  {!initialLoader && (
                    <ViewMore
                      loading={pageState.loading}
                      handleNextFunction={() => getSessionList({ pageNo: pageState.page + 1 })}
                    />
                  )}
                </>
              ) : null}
            </>
          )}
          {tab === 'jobList' && <JobLists />}
        </SoftBox>
      )}

      {hasAccess && !isMobileDevice && <JobLists />}
    </DashboardLayout>
  );
};
