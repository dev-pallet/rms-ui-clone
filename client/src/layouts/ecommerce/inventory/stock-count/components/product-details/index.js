import FilterListIcon from '@mui/icons-material/FilterList';
import { CircularProgress, Grid, InputAdornment, Modal, OutlinedInput, Typography } from '@mui/material';
import { debounce } from 'lodash';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { emit, useNativeMessage } from 'react-native-react-bridge/lib/web';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import SoftBox from '../../../../../../components/SoftBox';
import SoftButton from '../../../../../../components/SoftButton';
import SoftSelect from '../../../../../../components/SoftSelect';
import SoftTypography from '../../../../../../components/SoftTypography';
import {
  closeStockCountSession,
  getAllProductsListFilter,
  getOpenJobSessionItemList,
  getSessionItemsListV2,
  startStockCountSession,
} from '../../../../../../config/Services';
import DashboardLayout from '../../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../../examples/Navbars/DashboardNavbar';
import { useSnackbar } from '../../../../../../hooks/SnackbarProvider';
import { isSmallScreen } from '../../../../Common/CommonFunction';
import ProductCard from './components/product-card';
import './index.css';
import MobileSearchBar from '../../../../Common/mobile-new-ui-components/mobile-searchbar';
import CustomMobileButton from '../../../../Common/mobile-new-ui-components/button';
import { AdjustmentsVerticalIcon } from '@heroicons/react/24/outline';
import MobileFilterComponent from '../../../../Common/mobile-new-ui-components/mobile-filter';
import ViewMore from '../../../../Common/mobile-new-ui-components/view-more';

const newSwal = Swal.mixin({
  customClass: {
    cancelButton: 'button button-error',
  },
});

export const ProductStockDetails = () => {
  const locId = localStorage.getItem('locId');
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const isMobileDevice = isSmallScreen();
  const showSnackbar = useSnackbar();
  const user_details = localStorage.getItem('user_details');
  const { uidx, firstName, secondName } = user_details && JSON.parse(user_details);
  // const sessionStatus = localStorage.getItem('sessionStatus');
  const [sessionStatus, setSessionStatus] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);

  const [searchText, setSearchText] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [payloadFilter, setPayloadFilter] = useState({
    pageNumber: 0,
    pageSize: 20,
    sessionId: sessionId,
  });
  const [totalResults, setTotalResults] = useState(0);
  const [infinityScrollLoader, setInfinityScrollLoader] = useState(false);
  const [isInfinityScroll, setIsInfinityScroll] = useState(false);
  const infinityScrollLoaderRef = useRef(infinityScrollLoader);
  const [isScannerActive, setIsScannerActive] = useState(false);
  const [openFilterModal, setFilterModal] = useState(false);
  const [statusValue, setStatusValue] = useState([]);
  const [mainSelecetedFilter, setMainSelectedFilter] = useState('');
  const [selectedSubFilters, setSelectedSubFilters] = useState({});
  const [applyFilter, setApplyFilter] = useState(false);
  const [isFilterOpened, setIsFilterOpened] = useState(false);
  const [showViewMore, setShowViewMore] = useState(true);
  const [initialLoader, setInitialLoader] = useState(false);

  const [jobType, setJobType] = useState(null);
  const itemDivRef = useRef(null);

  const location = useLocation();
  const { state } = location;
  const sessionJobtype = state?.jobType;

  const openScanner = () => {
    setIsScannerActive(true);
    emit({ type: 'scanner' });
  };

  useNativeMessage((message) => {
    const data = JSON.parse(message?.data);
    if (message?.type === 'gtin') {
      if (!isLoadingItemsList) {
        setSearchText(data?.gtin);
        debounceSearch(data?.gtin);
      }
    }
  });

  const [itemsList, setItemsList] = useState([]);
  const [isLoadingItemsList, setIsLoadingItemsList] = useState(false);

  // start session
  const openAlert = () => {
    newSwal
      .fire({
        title: 'Session not started!',
        text: 'Start the session to continue',
        icon: 'error',
        confirmButtonText: 'Start',
        showCancelButton: true,
        showLoaderOnConfirm: true,
        preConfirm: async () => {
          try {
            const payload = {
              sessionId: sessionId,
              updatedBy: uidx,
              updatedByName: `${firstName} ${secondName}`,
            };
            const response = await startStockCountSession(payload);
            if (response?.data?.data?.es) {
              return newSwal.showValidationMessage(`Request failed: ${response?.data?.data?.message}`);
            }

            const session_Status = response?.data?.data?.session?.status;
            setSessionStatus(session_Status);
          } catch (error) {
            newSwal.showValidationMessage(`
          Request failed: ${error}
        `);
          }
        },
        allowOutsideClick: false,
        backdrop: 'rgba(0,0,0,0.4)',
      })
      .then((result) => {
        if (result.isConfirmed) {
          newSwal.fire({
            title: 'Session Started!',
            icon: 'success',
          });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          navigate(-1);
        }
      });
  };

  // get session items list
  const getSessionItemsListFn = async (infinityScrollLoading = false, isFilterCleared = false) => {
    try {
      if (infinityScrollLoading !== true) {
        setIsLoadingItemsList(true);
      }
      const payload = {
        ...payloadFilter,
        pageNumber: infinityScrollLoading ? payloadFilter?.pageNumber : 0,
      };
      payload?.pageNumber === 0 && setInitialLoader(true);

      const filterObject = {
        page: '1',
        pageSize: '20',
        supportedStore: [locId],
      };
      if (searchText) {
        if (sessionJobtype !== 'OPEN' && isScannerActive) {
          payload.gtin = searchText;
        } else {
          payload.textSearch = debouncedSearchTerm;
        }

        if (sessionJobtype == 'OPEN') {
          if (isScannerActive) {
            filterObject.gtin = [searchText];
          } else {
            // filterObject.names=[debouncedSearchTerm]
            if (!isNaN(debouncedSearchTerm) && debouncedSearchTerm.trim() !== '') {
              // If debouncedSearchTerm is a number
              filterObject.gtin = [debouncedSearchTerm];
            } else {
              // If debouncedSearchTerm is a string
              filterObject.names = [debouncedSearchTerm];
            }
          }
        }
      }

      if (isMobileDevice && Object.keys(selectedSubFilters)?.length > 0 && !isFilterCleared) {
        const status = selectedSubFilters?.['status']?.[0]?.value ? [selectedSubFilters?.['status']?.[0]?.value] : [];
        payload.statuses = status;
      }else{
        payload.statuses = [];
      }      

      let response = '';
      if (sessionJobtype === 'OPEN' && searchText) {
        setItemsList([]);
        const gtinsArray = [];
        try {
          // api call 1
          const productListResponse = await getAllProductsListFilter(filterObject);
          if (productListResponse?.data?.status !== 'SUCCESS') {
            if (isMobileDevice) {
              setApplyFilter(false);
            }
            showSnackbar('something went wrong', 'error');
          } else {
            productListResponse?.data?.data?.products?.map((el) => {
              gtinsArray.push(el?.gtin);
            });

            // pass the gtinsArray as payload and fetch ims api to get product list
            if (gtinsArray?.length) {
              const filterObject2 = {
                sessionId: sessionId,
                gtins: gtinsArray,
              };

              // api call 2
              response = await getOpenJobSessionItemList(filterObject2);
            }
            // continue from here as it's response is same as getSessionItemsListV2 response
          }
        } catch (err) {
          showSnackbar('Something went wrong', 'error');
          setIsLoadingItemsList(false);
          return;
        }
      }

      // if(!searchText){
      if (
        (sessionJobtype === 'OPEN' && !searchText) ||
        (sessionJobtype !== 'OPEN' && !searchText) ||
        (sessionJobtype !== 'OPEN' && searchText)
      ) {
        // const response = await getSessionItemsList(payload); // v1 api call to get session items list
        response = await getSessionItemsListV2(payload);
      }

      if (response?.data?.data?.es > 0) {
        if (isMobileDevice) {
          setApplyFilter(false);
        }
        if (sessionJobtype !== 'OPEN') {
          showSnackbar(response?.data?.data?.message || 'Something went wrong', 'error');
        }
        setItemsList([]);
        setInfinityScrollLoader(false);
        setIsLoadingItemsList(false);
        setShowViewMore(false);
        setInitialLoader(false);
        return;
      }
      const showViewMoreButton = (payload?.pageNumber + 1) * response?.data?.data?.pageSize < response?.data?.data?.total;
      if (!showViewMoreButton) {
        setShowViewMore(false);
        setInitialLoader(false);
      }

      setIsDisabled(!response?.data?.data?.session?.closeSessionAllowed);
      if (infinityScrollLoading) {
        if (sessionJobtype === 'OPEN' && searchText) {
          setItemsList([...itemsList, ...response?.data?.data?.session?.productDtos.slice(0, 10)]);
        } else {
          setItemsList([
            ...itemsList,
            ...(response?.data?.data?.session?.products || response?.data?.data?.session?.productDtos),
          ]);
        }
      } else {
        if (sessionJobtype === 'OPEN' && searchText) {
          setItemsList(response?.data?.data?.session?.productDtos.slice(0, 10));
        } else {
          setItemsList(response?.data?.data?.session?.products || response?.data?.data?.session?.productDtos);
        }
      }
      setTotalResults(response?.data?.data?.total);

      const session_Status = response?.data?.data?.session?.status;
      if (session_Status === 'CREATED') {
        openAlert();
      }
      setSessionStatus(session_Status);
      setJobType(response?.data?.data?.session?.jobType);
      setPayloadFilter((prev) => ({
        ...prev,
        pageNumber: response?.data?.data?.pageNumber + 1,
      }));
      setIsLoadingItemsList(false);
      setIsInfinityScroll(false);
      setIsScannerActive(false);
      setInfinityScrollLoader(false);
      infinityScrollLoaderRef.current = false;

      if (isMobileDevice) {
        setApplyFilter(false);
        setIsFilterOpened(false);
      }
      setInitialLoader(false);
    } catch (err) {
      setItemsList([]);
      setIsLoadingItemsList(false);
      setIsInfinityScroll(false);
      setInfinityScrollLoader(false);
      setIsScannerActive(false);
      console.log(err);
      showSnackbar(err, 'error');
      setApplyFilter(false);
      setShowViewMore(false);
      setInitialLoader(false);
    }
  };

  //adding the product in the session if job type is open

  const openCloseAlert = () => {
    if (isDisabled) {
      showSnackbar('Session cannot be closed as there are items pending for completion', 'warning');
      return;
    }
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
            const payload = {
              sessionId: sessionId,
              updatedBy: uidx,
              updatedByName: firstName + ' ' + secondName,
            };
            const response = await closeStockCountSession(payload);
            if (response?.data?.data?.es) {
              return newSwal.showValidationMessage(`Request failed: ${response?.data?.data?.message}`);
            }
            return response?.data?.data?.session;
          } catch (error) {
            newSwal.showValidationMessage(`
          Request failed: ${error}
        `);
          }
        },
        allowOutsideClick: () => !newSwal.isLoading(),
        backdrop: 'rgba(0,0,0,0.4)',
      })
      .then((result) => {
        if (result.isConfirmed) {
          newSwal
            .fire({
              title: 'Session Closed!',
              icon: 'success',
              confirmButtonText: 'Ok',
            })
            .then(() => {
              navigate(-1);
            });
        }
      });
  };

  const setDebounceTerm = (value) => {
    setDebouncedSearchTerm(value);
    // getSessionItemsListFn(value);
  };
  const debounceSearch = useCallback(
    debounce((nextValue) => setDebounceTerm(nextValue), 1000),
    [],
  );

  const renderItemsList = () => {
    if (isLoadingItemsList) {
      return (
        <SoftBox className="width-100" display="flex" alignItems="center" justifyContent="center" flex={1}>
          <CircularProgress size={40} className="circular-progress-loader" />
        </SoftBox>
      );
    }
    if (!itemsList?.length) {
      return (
          <SoftTypography
            variant="h4"
            fontSize="1.2rem"
            fontWeight="bold"
            sx={{
              textAlign: 'center',
            }}
          >
            No Product Found
          </SoftTypography>
      );
    }
    return (
      <>
        {itemsList.map((itemDetail, index) => (
          <ProductCard
            key={index}
            jobType={jobType}
            reportData={itemDetail}
            sessionStatus={sessionStatus}
            getSessionItemsListFn={getSessionItemsListFn}
            setPayloadFilter={setPayloadFilter}
            payloadFilter={payloadFilter}
            setItemsList={setItemsList}
            setSearchText={setSearchText}
            debounceSearch={debounceSearch}
          />
        ))}
      </>
    );
  };

  useEffect(() => {
    getSessionItemsListFn();
  }, [debouncedSearchTerm]);

  useEffect(() => {
    infinityScrollLoaderRef.current = infinityScrollLoader;
  }, [infinityScrollLoader]);

  const fetchMore = () => {
    if (searchText) {
      return;
    }

    setInfinityScrollLoader(true);
    setIsInfinityScroll(true);
    getSessionItemsListFn(true);
  }

  const handleFilterProduct = () => {
    setFilterModal(true);
  };

  const handleAppyFilter = (cleared) => {
    setFilterModal(false);
    if (cleared === true) {
      setStatusValue([]);
      getSessionItemsListFn(false, true);
    } else {
      getSessionItemsListFn(false);
      infinityScrollLoaderRef.current = true;
    }
  }; 

  const settingProductSearchValue = (e) => {
    setSearchText(e.target.value);
    debounceSearch(e.target.value);
  }

  const filters = [{ filterLabel: 'Status', filterValue: 'status' }];

  const filterOptions = {
    status: [
      { label: 'Created', value: 'CREATED' },
      { label: 'In Progress', value: 'INPROGRESS' },
      { label: 'Approval Pending', value: 'APPROVAL_PENDING' },
      { label: 'Completed', value: 'COMPLETED' },
    ],
  };

  const filter_CreateHandler = () => {
    let title = { 
      filter: true,
      create: false,
    };
    return title;
  };  

  useEffect(() => {
    if(mainSelecetedFilter === 'status'){
      if(Object.keys(selectedSubFilters).length !== 0){
        setStatusValue(selectedSubFilters?.status);
      }else{
        setStatusValue([]);
      }
    }else{
      setStatusValue([]);
    }
  }, [mainSelecetedFilter, selectedSubFilters])

  useEffect(() => {
    if (applyFilter) {
      handleAppyFilter();
    }
  }, [applyFilter]);

  return (
    <DashboardLayout>
      {!isMobileDevice && <DashboardNavbar />}
      <SoftBox className="main-padding-wrapper bg-white min-height-100">
        <SoftBox
          // className="po-btn-main-div"
          sx={{
            height: 'auto',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
          }}
        >
          <SoftBox className="new-po-search-button-div">
            <MobileSearchBar
              isScannerSearchbar={true}
              placeholder="Search products"
              variant={'bg-secondary'}
              onChangeFunction={settingProductSearchValue}
              value={searchText}
              scannerButtonFunction={openScanner}
            />
          </SoftBox>

        </SoftBox>
        <MobileFilterComponent
          filters={filters}
          filterOptions={filterOptions}
          createButtonTitle={'Session Item Lists'}
          // createButtonFunction={createButtonFunction}
          mainSelecetedFilter={mainSelecetedFilter}
          setMainSelectedFilter={setMainSelectedFilter}
          selectedSubFilters={selectedSubFilters}
          setSelectedSubFilters={setSelectedSubFilters}
          applyFilter={applyFilter}
          setApplyFilter={setApplyFilter}
          isFilterOpened={isFilterOpened}
          setIsFilterOpened={setIsFilterOpened}
          filterCreateExist={filter_CreateHandler()}
        />
        {/* <div> */}
        {renderItemsList()}
        {showViewMore && isMobileDevice ? (
            <>
              { !initialLoader && (
                <ViewMore
                  loading={infinityScrollLoader}
                  handleNextFunction={fetchMore}
                />
              )}
            </>
          ) : null}

        {sessionStatus === 'INPROGRESS' && (
          <div className="save-btn-container height-auto">
            <button className="save-btn" onClick={openCloseAlert}>
              <span className="save-btn-text">Close Session</span>
            </button>
          </div>
        )}
      </SoftBox>
      {isMobileDevice && (
        <Modal
          open={openFilterModal}
          onClose={() => setFilterModal(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <div className="pi-approve-menu stock-filter-status">
            <SoftTypography fontSize="16px">Select Status</SoftTypography>
            <SoftSelect
              value={statusValue}
              options={[
                { value: 'CREATED', label: 'Created' },
                { value: 'INPROGRESS', label: 'In Progress' },
                { value: 'APPROVAL_PENDING', label: 'Approval Pending' },
                { value: 'COMPLETED', label: 'Completed' },
              ]}
              // menuPlacement="top"
              sx={{ width: '100% !important' }}
              isMulti
              onChange={(e) => {
                // const statusData = e?.map((item) => item.value);
                setStatusValue(e);
              }}
              // menuPortalTarget={document.body}
            />
            <div className="apply-btn-stock-taking-filter">
              <SoftButton
                color="info"
                variant="outlined"
                onClick={() => {
                  if (statusValue.length > 0) {
                    handleAppyFilter(true);
                  } else {
                    showSnackbar('No status selected', 'error');
                  }
                }}
                sx={{
                  marginTop: '10px',
                }}
              >
                Clear
              </SoftButton>
              <SoftButton
                color="info"
                variant="contained"
                onClick={() => {
                  handleAppyFilter();
                }}
                sx={{
                  marginTop: '10px',
                }}
              >
                Apply
              </SoftButton>
            </div>
          </div>
        </Modal>
      )}
    </DashboardLayout>
  );
};
