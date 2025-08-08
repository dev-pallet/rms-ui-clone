import { ChevronDownIcon, ChevronUpIcon, PencilIcon } from '@heroicons/react/24/outline';
import { CircularProgress } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SuccessGif from '../../../../../assets/gif/success-loder.svg';
import { approvedpurchaserequest, getItemstabledetails, rejectpurchaserequest } from '../../../../../config/Services';
import { useSnackbar } from '../../../../../hooks/SnackbarProvider';
import { getTimeAgo, textFormatter } from '../../../Common/CommonFunction';
import CustomMobileButton from '../../../Common/mobile-new-ui-components/button';
import CommonId from '../../../Common/mobile-new-ui-components/common-id';
import CommonStatus from '../../../Common/mobile-new-ui-components/status';
import './purchase-indent-card.css';

const PICard = ({ data, navigateToDetailsPage, locationName, userInfo }) => {
  const [openProducts, setOpenProducts] = useState(false);
  const [piApproveLoader, setPiApproveLoader] = useState(false);
  const showSnackbar = useSnackbar();
  const [piDeclineLoader, setPiDeclineLoader] = useState(false);
  const [piUserApprover, setPiUserApprover] = useState(false);
  const [approvalComplete, setApprovalComplete] = useState(null);
  const [piProducts, setPiProducts] = useState([]);
  const [piProductsLoader, setPiProductsLoader] = useState(false);
  const [totalPiProducts, setTotalPiProducts] = useState(data?.totalPiProducts);
  const navigate = useNavigate();

  const openProductsHandler = (e) => {
    e.stopPropagation();
    if (!openProducts && piProducts?.length === 0) {
      fetchPiProducts();
    }
    setOpenProducts(!openProducts);
  };

  async function handleApprove() {
    setPiApproveLoader(true);
    const payload = {
      piNumber: data?.purchaseIndentNo,
      piStatus: 'APPROVED',
      updatedByUser: userInfo?.uidx,
    };

    try {
      const res = await approvedpurchaserequest(payload);
      if (res?.data?.status === 'ERROR') {
        setPiApproveLoader(false);
        return;
      }
      showSnackbar('Success PI Approved', 'success');
      setApprovalComplete(true);
      setPiApproveLoader(false);
    } catch (err) {
      showSnackbar(err?.response?.data?.message, 'error');
      setPiApproveLoader(false);
    }
  }

  async function handleRejecthandler() {
    if (approvalComplete) return showSnackbar('Already Approved', 'error');
    setPiDeclineLoader(true);
    const payload = {
      piNumber: data?.purchaseIndentNo,
      piStatus: 'REJECTED',
      updatedByUser: userInfo?.uidx,
    };
    try {
      const result = await rejectpurchaserequest(payload);
      showSnackbar('Success PI Rejected', 'success');
      setPiDeclineLoader(false);
    } catch (err) {
      showSnackbar(err?.response?.data?.message, 'error');
      setPiDeclineLoader(false);
    }
  }

  const handleEditNavigation = () => {
    if (approvalComplete) return showSnackbar('Already Approved, cannot edit', 'error');
    navigate(`/purchase/purchase-indent/create-purchase-indent/${data?.purchaseIndentNo}`);
  };

  const checkUser = useCallback(() => {
    const isApprover = data?.approvedBy === userInfo?.uidx || false;
    if (isApprover) {
      setPiUserApprover(true);
      return;
    }
  }, [userInfo]);

  const fetchPiProducts = async () => {
    try {
      setPiProductsLoader(true);
      const response = await getItemstabledetails(data?.purchaseIndentNo);
      setPiProducts(response?.data?.data);
      setPiProductsLoader(false);
    } catch (error) {
      setPiProductsLoader(false);
    }
  };

  useEffect(() => {
    if (data) {
      checkUser();
    }
  }, [data]);

  return (
    <div className="listing-card-main-bg">
      <div className="stack-row-center-between pi-number-staus-main-div">
        <CommonId id={data?.purchaseIndentNo} />
        <div className="pi-toolbar-status-main-div">
          {/* {(data?.status === 'DRAFT' || data?.status === 'CREATED') && (
            <div className="pi-app-card-tools">
              {(data?.relatedPos === 0 || data?.status === 'DRAFT' || data?.status === 'CREATED') && (
                <div className="edit-icon-pi-card" onClick={handleEditNavigation}>
                  <PencilIcon
                    style={{
                      height: '0.6rem',
                      width: '0.6rem',
                      color: '#0860E6',
                    }}
                  />
                </div>
              )}
              {data?.status === 'CREATED' && piUserApprover && (
                <>
                  <CustomMobileButton
                    variant={'black-S'}
                    title={'Decline'}
                    loader={piDeclineLoader}
                    onClickFunction={handleRejecthandler}
                  />
                  <CustomMobileButton
                    variant={'blue-D'}
                    title={!approvalComplete ? 'Approve' : 'Approved'}
                    loader={piApproveLoader}
                    onClickFunction={handleApprove}
                  />
                </>
              )}
            </div>
          )} */}
          <CommonStatus status={data?.status} />
        </div>
      </div>
      <div className="pi-card-info-app" onClick={() => navigateToDetailsPage(data)}>
        <span className="pi-card-title-app">
          Against<span className="pi-card-vendorname"> {data?.preferredVendor || 'NA'}</span> for{' '}
          <strong>{locationName || 'NA'}</strong>
        </span>
        <div className="pi-card-products-main-div">
          {openProducts &&
            (piProductsLoader ? (
              <div className="circular-progress-div">
                <CircularProgress size={20} sx={{ color: '#0562fb !important' }} />
              </div>
            ) : piProducts?.length ? (
              <div className="pi-card-products-ul-main-div">
                <ul className="unordered-list-pi-app">
                  {piProducts?.map((item) => (
                    <li>
                      <div className="pi-app-li">
                        <span className="productName-pi-card">{textFormatter(item?.itemName)}</span>
                        <span className="productQty-pi-card">({item?.quantityOrdered} Qty)</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="circular-progress-div">
                <span>NA</span>
              </div>
            ))}
          <div className="pi-card-products-trigger" onClick={openProductsHandler}>
            <span className="pi-card-product-count">{data?.totalPiProducts || ''} Products</span>
            {openProducts ? (
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
        </div>
        <span className="view-details-app">View details</span>
      </div>
      <div className="stack-row-center-between pi-info-price-div" onClick={() => navigateToDetailsPage(data)}>
        <span className="pi-card-time">{getTimeAgo(data?.createdOnMobile)}</span>
        <div className="stack-row-center-between pi-value-main-div">
          <span className="estimated-value-label">Estimated Value </span>
          <span className="estimated-value-pi-app">₹{data?.estimatedValue ?? 'NA'}</span>
        </div>
      </div>
    </div>
  );
};

export default PICard;
