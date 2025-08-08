import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import SoftBox from '../../../../../../../../components/SoftBox';
import {
  deleteProductFromSession,
  getBatchesItemsLinkedWithSessions,
} from '../../../../../../../../config/Services';
import { useSnackbar } from '../../../../../../../../hooks/SnackbarProvider';
import BatchList from './components/batchlist';
import ItemCount from './components/itemCount';
import './index.css';

const newSwal = Swal.mixin({
  customClass: {
    cancelButton: 'button button-error',
  },
});

export const CycleCountModal = ({
  reportData,
  modalOpen,
  setModalOpen,
  getSessionItemsListFn,
  jobType,
  currentProductSessionId,
  sessionStatus,
  setSearchText,
  debounceSearch,
  handleOpen,
  // refetchReportList
  isClickedOnDelete,
  setIsClickedOnDelete
}) => {
  const [showContent, setShowContent] = useState(false);
  const showSnackbar = useSnackbar();
  const dispatch = useDispatch();
  // const storedReportItem = useSelector(getReportItem);
  const [responseObj, setResponseObj] = useState({});
  const [pageState, setPageState] = useState({
    pageSize: 10,
    pageNumber: 0,
    total: 0,
  });
  const [batchSessionId, setBatchSessionId] = useState('');
  const [viewMoreLoader, setViewMoreLoader] = useState(false);

  const [batchList, setBatchList] = useState([]);
  const [isFetchingBatchList, setIsFetchingBatchList] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState({});
  const [batchesTotalPages, setBatchesTotalPages] = useState(0);

  const handleBack = () => {
      setShowContent(false);
      setPageState({
        pageSize: 10,
        pageNumber: 0,
        total: 0,
      })
      setModalOpen(false);
      setSearchText('');
      debounceSearch('')
      setBatchList([]);
  };

  const getBatchesForItems = async () => {
    try {
      const payload = {
        productSessionId: jobType === 'OPEN' ? currentProductSessionId : reportData?.productSessionId,
        pageNumber: pageState.pageNumber,
        pageSize: pageState?.pageSize,
      };

      if(isFetchingBatchList) return;
      // if (!viewMoreLoader) {
        setIsFetchingBatchList(true);
      // }

      const response = await getBatchesItemsLinkedWithSessions(payload);

      if (response?.data?.data?.es) {
        setIsFetchingBatchList(false);
        setViewMoreLoader(false);
        showSnackbar(response?.data?.data?.message, 'error');
        return;
      }

      setResponseObj(response?.data?.data?.session);
      const toatalpages = Math.ceil(response?.data?.data?.total / pageState.pageSize);
      setBatchesTotalPages(toatalpages);

      let array = [...batchList, ...response?.data?.data?.session?.batches]
      setBatchList(array);

      setPageState((prev) => ({...prev, total: response?.data?.data?.total}))

      setIsFetchingBatchList(false);
      setViewMoreLoader(false);
    } catch (err) {
      setIsFetchingBatchList(false);
      showSnackbar('something went wrong', 'error');
    }
  };

  useEffect(() => {
    if (modalOpen) {
      getBatchesForItems();
    }
  }, [modalOpen, pageState?.pageNumber]);

  const deleteProductFromSessionFunc = (productSessionId) => {
    const user_details = localStorage.getItem('user_details');
    const { uidx, firstName, secondName } = user_details && JSON.parse(user_details);
    newSwal
      .fire({
        title: 'Remove Product?',
        text: 'Are you sure you want to remove this product from the session?',
        icon: 'warning',
        confirmButtonText: 'Yes',
        //   cancelButtonText: 'No',
        showCancelButton: true,
        showLoaderOnConfirm: true,
        preConfirm: async () => {
          try {
            const payload = {
              productSessionId,
              updatedBy: uidx,
              updatedByName: `${firstName} ${secondName}`,
            };
            const response = await deleteProductFromSession(payload);
            return response;
          } catch (err) {
            showSnackbar('something went wrong', 'error');
          }
        },
        allowOutsideClick: () => !newSwal.isLoading(),
        backdrop: 'rgba(0,0,0,0.4)',
      })
      .then((result) => {
        if (result?.value?.data?.data?.es > 0) {
          newSwal.fire({
            title: 'Error!',
            text: result?.value?.data?.data?.message,
            icon: 'error',
            confirmButtonText: 'Ok',
          });
          return;
        }
        if (result.isConfirmed) {
          newSwal
            .fire({
              title: 'Product Removed!',
              icon: 'success',
              confirmButtonText: 'Ok',
            })
            .then(() => {
              setIsClickedOnDelete(false);
              setModalOpen(false);
              getSessionItemsListFn(false);
            });
        }
      });
  };

  useEffect(() => {
    if(isClickedOnDelete){
      deleteProductFromSessionFunc(reportData?.productSessionId || currentProductSessionId)
    }
  },[isClickedOnDelete])

  const handleViewMore = () => {
    setViewMoreLoader(true);
    setPageState((prev)=>({...prev, pageNumber: prev.pageNumber + 1}))
  }  

  return (
    <>
      {/* <KeyboardBackspaceIcon className="stock-taking-modal-back-btn" onClick={handleBack} /> */}
      <div
        className="pi-card-products-trigger"
        onClick={() => {
          if (!isFetchingBatchList) {
            modalOpen ? handleBack() : handleOpen();
          }
        }}
      >
        <span className="pi-card-product-count">{pageState?.total || ''} Batches</span>
        {modalOpen ? (
          <ChevronUpIcon
            style={{
              width: '0.5rem',
              height: '0.5rem',
            }}
          />
        ) : (
          <ChevronDownIcon
            style={{
              width: '0.5rem',
              height: '0.5rem',
            }}
          />
        )}
      </div>
      {isFetchingBatchList && pageState?.pageNumber === 0 ? (
        <SoftBox className="stock-modal-loader-container width-100 content-center">
          <CircularProgress size={40} className="circular-progress-loader" />
        </SoftBox>
      ) : (
        <>
          {modalOpen && (
            <BatchList
              handleBack={handleBack}
              // batchList={storedReportItem?.stReportBatchList}
              showContent={showContent}
              setShowContent={setShowContent}
              batchList={batchList}
              setSelectedBatch={setSelectedBatch}
              setBatchSessionId={setBatchSessionId}
              batchSessionId={batchSessionId}
              selectedBatch={selectedBatch}
              itemCount={
                showContent && (
                  <ItemCount
                    getBatchesForItems={getBatchesForItems}
                    setShowContent={setShowContent}
                    selectedBatch={selectedBatch}
                    sessionStatus={sessionStatus}
                    array={batchList}
                    setBatchList={setBatchList}
                  />
                )
              }
            />
          )}
          {viewMoreLoader && (
            <div className="view-more-loader-batchlist">
              <CircularProgress size={10} className="circular-progress-loader" />
            </div>
          )}

          {modalOpen && batchesTotalPages - 1 !== pageState.pageNumber && !viewMoreLoader && (
            <div className="pi-card-products-trigger" onClick={handleViewMore}>
              <span className="pi-card-product-count">View More</span>
              <ChevronDownIcon
                style={{
                  width: '0.5rem',
                  height: '0.5rem',
                }}
              />
            </div>
          )}
        </>
      )}
    </>
  );
};
