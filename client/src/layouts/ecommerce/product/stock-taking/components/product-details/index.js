import './index.css';
import { CircularProgress, Grid, InputAdornment, OutlinedInput, Typography } from '@mui/material';
import { Fragment, useCallback, useState } from 'react';
import { closeStockSession, createReport, getAllReports, getReportId } from '../../../../../../config/Services';
import { debounce } from 'lodash';
import { emit, useNativeMessage } from 'react-native-react-bridge/lib/web';
import { isSmallScreen } from '../../../../Common/CommonFunction';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from '../../../../../../hooks/SnackbarProvider';
import DashboardLayout from '../../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../../examples/Navbars/DashboardNavbar';
import MobileNavbar from '../../../../../../examples/Navbars/MobileNavbar/mobile-navbar-drawer';
import ProductCard from './components/product-card';
import SoftBox from '../../../../../../components/SoftBox';
import SoftButton from '../../../../../../components/SoftButton';
import SoftTypography from '../../../../../../components/SoftTypography';
import Swal from 'sweetalert2';

export const ProductStockDetails = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const isMobileDevice = isSmallScreen();
  const showSnackbar = useSnackbar();
  const user_details = localStorage.getItem('user_details');
  const { uidx, firstName, secondName } = user_details && JSON.parse(user_details);

  const [searchText, setSearchText] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const [reportId, setReportId] = useState('');
  const [payloadFilter, setPayloadFilter] = useState({
    pageNo: 1,
    pageSize: 10,
    reportId: reportId,
    gtin: '',
  });

  const openScanner = () => {
    emit({ type: 'scanner' });
  };

  const { isLoading: isLoadingReportId } = useQuery({
    refetchOnWindowFocus: false,
    retry: 1,
    queryKey: ['reportId'],
    queryFn: () => getReportId({ sessionId, uidx }),
    onSuccess: (response) => {
      if (response?.data?.data?.es === 69) {
        openAlert();
        return;
      }
      if (response?.data?.data?.es) {
        showSnackbar(response?.data?.data?.message, 'error');
        return;
      }
      setReportId(response?.data?.data?.data);
    },
    onError: (error) => {
      showSnackbar(error?.message || error?.response?.data?.message || 'Some error occured', 'error');
    },
  });

  const {
    data: reportList,
    isLoading: isLoadingReportList,
    refetch: refetchReportList,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    refetchOnWindowFocus: false,
    retry: 1,
    // staleTime: Infinity,
    enabled: !!reportId,
    queryKey: ['reportList', debouncedSearchTerm],
    queryFn: async ({ pageParam = 1 }) => {
      const payload = {
        ...payloadFilter,
        reportId: reportId,
        pageNo: pageParam,
        gtin: debouncedSearchTerm,
      };
      const response = await getAllReports(payload);
      if (response?.data?.data?.es) {
        showSnackbar(response?.data?.data?.message, 'error');
        throw new Error(response?.data?.data?.message);
      }
      return response?.data?.data?.data;
    },
    getNextPageParam: (lastPage, allPages) => {
      const { pageNumber, totalPage } = lastPage;
      return pageNumber < totalPage ? pageNumber + 1 : undefined;
    },
    onError: (error) => {
      showSnackbar(error?.message || error?.response?.data?.message || 'Some error occured', 'error');
    },
  });

  const openAlert = () => {
    Swal.fire({
      title: 'Report not created!',
      text: 'Create a report to continue',
      icon: 'error',
      confirmButtonText: 'Create',
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          const payload = { sessionId: sessionId, uidx: uidx, userName: `${firstName} ${secondName}` };
          const response = await createReport(payload);
          if (response?.data?.data?.es) {
            return Swal.showValidationMessage(`Request failed: ${response?.data?.data?.message}`);
          }
          setReportId(response?.data?.data?.id);
          return response?.data?.data?.id;
        } catch (error) {
          Swal.showValidationMessage(`
          Request failed: ${error}
        `);
        }
      },
      allowOutsideClick: false,
      backdrop: 'rgba(0,0,0,0.4)',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Report Created!',
          icon: 'success',
        });
      }
    });
  };

  const openCloseAlert = () => {
    const newSwal = Swal.mixin({
      customClass: {
        cancelButton: 'button button-error',
      },
    });
    newSwal
      .fire({
        title: 'Close Session?',
        text: 'Are you sure you want to close the session?',
        icon: 'warning',
        confirmButtonText: 'Yes',
        //   cancelButtonText: 'No',
        showCancelButton: true,
        showLoaderOnConfirm: true,
        preConfirm: async () => {
          try {
            const response = await closeStockSession({ sessionId });
            if (response?.data?.data?.es) {
              return Swal.showValidationMessage(`Request failed: ${response?.data?.data?.message}`);
            }
            return response?.data?.data;
          } catch (error) {
            Swal.showValidationMessage(`
          Request failed: ${error}
        `);
          }
        },
        allowOutsideClick: () => !Swal.isLoading(),
        backdrop: 'rgba(0,0,0,0.4)',
      })
      .then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: 'Session Closed!',
            icon: 'success',
            confirmButtonText: 'Ok',
          }).then(() => {
            navigate(-1);
          });
        }
      });
  };

  const debounceSearch = useCallback(
    debounce((nextValue) => setDebouncedSearchTerm(nextValue), 1000),
    [],
  );

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  useNativeMessage((message) => {
    const data = JSON.parse(message?.data);
    if (message?.type === 'gtin') {
      if (!isLoadingReportList) {
        setSearchText(data?.gtin);
        debounceSearch(data?.gtin);
      }
    }
  });

  const renderReportList = () => {
    if (isLoadingReportList) {
      return (
        <SoftBox display="flex" alignItems="center" justifyContent="center" flex={1}>
          <CircularProgress size={40} className="circular-progress-loader" />
        </SoftBox>
      );
    }
    if (!reportList?.pages[0]?.data?.length) {
      return (
        <Grid item xs={12} md={6} xl={4}>
          <SoftTypography
            variant="h4"
            fontSize="1.2rem"
            fontWeight="bold"
            sx={{
              textAlign: 'center',
            }}
          >
            {reportId ? 'No Product Found' : 'Report not created'}
          </SoftTypography>
        </Grid>
      );
    }
    return (
      <>
        {reportList.pages.flatMap((page, i) => (
          <Fragment key={i}>
            {page.data.map((report, index) => (
              <Grid item xs={12} md={6} xl={4} key={index}>
                <ProductCard reportData={report} refetchReportList={refetchReportList} />
              </Grid>
            ))}
          </Fragment>
        ))}
        {hasNextPage && (
          <Grid container justifyContent="center" style={{ marginTop: '20px' }}>
            <SoftButton variant="contained" color="primary" onClick={() => fetchNextPage()}>
              {isFetchingNextPage ? <CircularProgress size={20} color="inherit" /> : 'Load More'}
            </SoftButton>
          </Grid>
        )}
      </>
    );
  };

  return (
    <DashboardLayout>
      {isMobileDevice && (
        <SoftBox className="new-search-header po-box-shadow">
          <MobileNavbar
            title={'Cycle Count Items'}
            stockCount={{
              scannedCount: reportList?.pages[0]?.verifiedProducts,
              totalCount: reportList?.pages[0]?.totalResult,
            }}
            prevLink={true}
          />
          <SoftBox
            className="po-btn-main-div"
            sx={{
              height: 'auto',
              width: '80%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
            }}
          >
            <SoftBox className="new-po-search-button-div">
              <OutlinedInput
                placeholder="Search Product..."
                className="search-input-po"
                sx={{
                  borderRadius: '100vw 100vw 100vw 100vw !important',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 0px 10px 15px !important',
                  border: '0px !important',
                }}
                value={searchText}
                onChange={(e) => {
                  setSearchText(e.target.value);
                  debounceSearch(e.target.value);
                }}
                endAdornment={
                  <InputAdornment position="end">
                    <SoftButton className="all-product-scan" onClick={openScanner}>
                      <Typography fontSize="12px" fontWeight={500}>
                        Scan
                      </Typography>
                    </SoftButton>
                  </InputAdornment>
                }
                aria-describedby="outlined-weight-helper-text"
                inputProps={{
                  'aria-label': 'weight',
                }}
              />
            </SoftBox>
          </SoftBox>
        </SoftBox>
      )}
      {!isMobileDevice && <DashboardNavbar />}
      <SoftBox>
        <Grid container spacing={1.5}>
          {renderReportList()}
        </Grid>
        <div className="close-session-btn-container">
          <SoftButton className="close-session-btn" disabled={isLoadingReportList} onClick={openCloseAlert}>
            Close Session
          </SoftButton>
        </div>
      </SoftBox>
    </DashboardLayout>
  );
};
