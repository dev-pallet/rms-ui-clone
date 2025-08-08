import { memo, useState } from 'react';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import DeleteIcon from "../../../../../../../../assets/svg/delete.svg";
import SoftBox from '../../../../../../../../components/SoftBox';
import { addProductToSession, checkProductExistInDifferentSession } from '../../../../../../../../config/Services';
import { useSnackbar } from '../../../../../../../../hooks/SnackbarProvider';
import { CopyToClipBoard, textFormatter } from '../../../../../../Common/CommonFunction';
import { defaultImage } from '../../../../../../Common/linkConstants';
import { CycleCountModal } from '../countmodal';
import './index.css';
import CommonStatus from '../../../../../../Common/mobile-new-ui-components/status';

const newSwal = Swal.mixin({
  customClass: {
    cancelButton: 'button button-error',
  },
});

const ProductCard = ({
  reportData,
  //  refetchReportList
  getSessionItemsListFn,
  setPayloadFilter,
  payloadFilter,
  jobType,
  setItemsList,
  sessionStatus,
  setSearchText,
  debounceSearch,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentProductSessionId, setCurrentProductSessionId] = useState('');
  const user_details = localStorage.getItem('user_details');
  const { uidx, firstName, secondName } = user_details && JSON.parse(user_details);
  const showSnackbar = useSnackbar();
  const { sessionId } = useParams();
  const [addingLoader, setAddingLoader] = useState(false);
  const [checkProductExistLoader, setCheckProductExistLoader] = useState(false);
  const [isClickedOnDelete, setIsClickedOnDelete] = useState(false);

  const handleOpen = async () => {
    // if session is not closed by the user
    if (jobType === 'OPEN') {
      //api call
      let diffSession = false;
      let status = '';
      let productSessionId = '';
      if (checkProductExistLoader) return;
      setCheckProductExistLoader(true);
      const response = await checkProductExistInDifferentSession(reportData?.gtin, sessionId);
      if (response?.data?.data?.es) {
        showSnackbar('Something went wrong', 'error');
        setCheckProductExistLoader(false);
        return;
      } else {
        diffSession = response?.data?.data?.isDifferentSession;
        status = response?.data?.data?.status;
        productSessionId = response?.data?.data?.productSessionId;
        setCheckProductExistLoader(false);
      }

      if (diffSession === true) {
        if (status === 'COMPLETED') return showSnackbar('Product Session is already completed', 'error');
        //   // if product is not in the same session recounting it
        await handleRecountProduct(productSessionId, reportData?.gtin, sessionId);
      } else {
        // if (!productSessionId) {
        if (!reportData?.productSessionId) {
          // if product is not in any session
          await addingProductInSession(reportData?.productSessionId, reportData?.gtin, sessionId);
        } else {
          // if product is in the same session
          setCurrentProductSessionId(reportData?.productSessionId);
          setModalOpen(true);
          // window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    } else {
      setCheckProductExistLoader(false);
      setModalOpen(true);
      // window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const addingProductInSession = async (productSessionId, gtin, sessionId) => {
    if (['COMPLETED', 'APPROVAL_PENDING'].includes(sessionStatus)) {
      // if session is closed
      return showSnackbar('Session is already closed', 'error');
    }

    if (addingLoader) {
      return;
    } // if loader is already running returning so that multiple calls are avoided
    setAddingLoader(true);
    const addingProductPayload = {
      sessionId: sessionId,
      productSessionId: productSessionId,
      createdBy: uidx,
      createdByName: `${firstName} ${secondName}`,
      gtin: gtin,
    };

    try {
      const response = await addProductToSession(addingProductPayload);
      if (response?.data?.data?.es > 0) {
        showSnackbar(response?.data?.data?.message, 'error');
      } else {
        setCurrentProductSessionId(response?.data?.data?.productSession?.productSessionId);
        setModalOpen(true);
        // window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      showSnackbar(err?.response?.data?.message || 'Something went wrong while adding', 'error');
    } finally {
      setAddingLoader(false);
    }
  };

  const handleRecountProduct = async (productSessionId) => {
    const result = await newSwal.fire({
      title: 'Recount Product?',
      text: 'Are you sure you want to recount this product.',
      icon: 'warning',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      showCancelButton: true,
      showLoaderOnConfirm: true,
    });

    if (result.isConfirmed) {
      await addingProductInSession(
        productSessionId ? productSessionId : reportData?.productSessionId,
        reportData?.gtin,
        sessionId,
      );
    }
  };

  return (
    <>
      {/* <Card onClick={handleOpen}> */}
      <SoftBox className="product-card-box" p={1}>
        <div className="stock-item-image-title">
          <img src={defaultImage} alt="error" className="stock-item-image" />
          <div className="width-100">
            <div className="stack-row-center-between">
              <div className="product-card-item-title" onClick={handleOpen}>
                {reportData?.itemName ? textFormatter(reportData?.itemName) : 'NA'}
              </div>
              <div className="stack-row-center-between">
                {jobType === 'OPEN' &&
                  reportData?.status !== 'COMPLETED' &&
                  (reportData?.productSessionId || currentProductSessionId !== '') && (
                    <img src={DeleteIcon} onClick={() => setIsClickedOnDelete(true)} />
                  )}
              </div>
            </div>
            <div className="content-space-between">
              <div className="content-left gap-5px">
                <div className="product-card-item-barcode-brand content-space-between">
                  Barcode: 
                  <span className="displayInlineBlock space-5px">
                    <CopyToClipBoard
                      params={{ value: reportData?.gtin || 'NA' }}
                      className="product-card-item-barcode-brand gap-5px"
                      customWidth={'10px'}
                      customHeight={'10px'}
                    />
                  </span>
                </div>
              </div>
              <span className="product-card-item-barcode-brand">
                <CommonStatus status={reportData?.status === 'CREATED' ? textFormatter(reportData?.status) : reportData?.status} />
              </span>
            </div>
          </div>
        </div>
        <CycleCountModal
          handleOpen={handleOpen}
          currentProductSessionId={currentProductSessionId}
          jobType={jobType}
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          reportData={reportData}
          sessionStatus={sessionStatus}
          // refetchReportList={refetchReportList}
          getSessionItemsListFn={getSessionItemsListFn}
          setPayloadFilter={setPayloadFilter}
          payloadFilter={payloadFilter}
          setSearchText={setSearchText}
          debounceSearch={debounceSearch}
          isClickedOnDelete={isClickedOnDelete}
          setIsClickedOnDelete={setIsClickedOnDelete}
        />
      </SoftBox>
    </>
  );
};
export default memo(ProductCard);
