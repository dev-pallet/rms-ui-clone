import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import CurrencyRupeeRoundedIcon from '@mui/icons-material/CurrencyRupeeRounded';
import KeyboardReturnOutlinedIcon from '@mui/icons-material/KeyboardReturnOutlined';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import { Chip, Divider, Grid, Menu, MenuItem, Stack, Tooltip } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import Spinner from '../../../../../../components/Spinner';
import {
  exportTaxInvoice,
  salesOrderReturnDetails,
  salesOrderReturnTimeline,
  soCreateComment,
  sogetAllComment,
} from '../../../../../../config/Services';
import DashboardLayout from '../../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../../examples/Navbars/DashboardNavbar';
import { useSnackbar } from '../../../../../../hooks/SnackbarProvider';
import { convertUTCtoIST, isSmallScreen, textFormatter } from '../../../../Common/CommonFunction';
import MobileDrawerCommon from '../../../../Common/MobileDrawer';
import AdditionalDetails from '../../../../Common/new-ui-common-components/additional-details';
import CommentComponent from '../../../../Common/new-ui-common-components/comment-component';
import CommonDataGrid from '../../../../Common/new-ui-common-components/common-datagrid';
import CommonTimeLine from '../../../../Common/new-ui-common-components/timeline';
import BillingDataRow from '../../../new-sales/components/sales-details/components/billingData';

const SalesReturnDetails = () => {
  const { orderId, returnId } = useParams();
  const isMobileDevice = isSmallScreen();
  const showSnackbar = useSnackbar();
  const userName = localStorage.getItem('user_name');
  const [returnLoader, setReturnLoader] = useState(true);
  const [allData, setAllData] = useState();
  const [orderDate, setOrderDate] = useState({
    date: '',
    time: '',
  });
  const [fileLoader, setFileLoader] = useState(false);
  const [additionalDetailsArray, setAdditionalDetailsArray] = useState([]);
  const [infoDetails, setInfoDetails] = useState({});
  const [timelineArray, setTimelineArray] = useState([]);
  const [timelineLoader, setTimelineLoader] = useState(false);
  const [openDetailsDrawer, setOpenDetailsDrawer] = useState(false);
  const [detailsSelectedValue, setDetailsSelectedValue] = useState('');
  const [itemData, setItemData] = useState([]);
  const [transactionData, setTransactionData] = useState([]);
  const [comments, setComments] = useState([]);
  const [createdComment, setCreatedComment] = useState('');
  const [commentLoader, setCommentLoader] = useState(false);
  const [getCommentsLoader, setGetCommentsLoader] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(purchaseReturnId);
    showSnackbar('Copied', 'success');
  };

  useEffect(() => {
    timelineFunction();
    fetchComments();
    salesOrderReturnDetails(returnId, orderId)
      .then((res) => {
        if (res?.data?.status === 'ERROR') {
          showSnackbar(res?.data?.messaage, 'error');
          setReturnLoader(false);
          return;
        }
        const response = res?.data?.data;
        setAllData(response);
        const newDate = response?.baseReturnResponse?.createdAt
          ? convertUTCtoIST(response?.baseReturnResponse?.createdAt)
          : 'NA';
        if (newDate !== 'NA') {
          const parts = newDate.split(',');
          const datePart = parts[0].trim();
          const yearPart = parts[1].trim();
          const timePart = parts[2].trim();
          setOrderDate({ date: `${datePart}, ${yearPart}`, time: timePart });
        }
        const itemData = response?.baseReturnResponse?.returnedItems?.map((item, index) => ({
          id: index,
          title: item?.productName || 'NA',
          barcode: item?.gtin || 'NA',
          salePrice: item?.sellingPrice || 'NA',
          quantity: item?.quantity || 0,
          returnQuantity: item?.returnedQuantity || 0,
          subTotal: item?.returnedSubTotal || 0,
        }));
        setItemData(response?.baseReturnResponse?.returnedItems ? itemData : []);
        setTransactionData(response?.returnBillingDetails?.refunds);
        setInfoDetails({
          discount_reversal: response?.returnBillingDetails?.discountReversal ?? 'NA',
          coupon_reversal: response?.returnBillingDetails?.couponReversal ?? 'NA',
          loyalty_points: response?.returnBillingDetails?.loyaltyPointsReversal ?? 0,
          loyalty_discount: response?.returnBillingDetails?.loyaltyDiscountReversal ?? 0,
          additional_item: response?.returnBillingDetails?.additionalExp ?? 'NA',
        });
        setReturnLoader(false);
      })
      .catch((err) => {
        setReturnLoader(false);
        showSnackbar(err?.res?.data?.messaage, 'error');
      });
  }, []);
  const additionalInfoArray = [
    { infoName: 'Channel', infoValue: allData?.baseReturnResponse?.salesChannel ?? 'NA' },
    { infoName: 'Payment mode', infoValue: allData?.returnBillingDetails?.paymentMethod ?? 'NA' },
    { infoName: 'Order type', infoValue: allData?.baseReturnResponse?.orderType ?? 'NA' },
    { infoName: 'Session ID', infoValue: allData?.baseReturnResponse?.sessionId ?? 'NA' },
    { infoName: 'Terminal', infoValue: allData?.baseReturnResponse?.licenseId ?? 'NA' },
    { infoName: 'Cashier', infoValue: allData?.baseReturnResponse?.createdBy ?? 'NA' },
  ];

  const array = useMemo(
    () => [
      {
        tabName: 'Discount reversal',
        tabValue: 'discount_reversal',
        tabDescription: `from ${allData?.returnBillingDetails?.discountReversalItems || '0'} items`,
        tabIcon: '',
      },
      {
        tabName: 'Coupon reversal',
        tabValue: 'coupon_reversal',
        tabDescription: `${allData?.returnBillingDetails?.numberOfCouponApplied || '0'} coupon applied`,
        tabIcon: '',
      },
      {
        tabName: 'Loyalty points reversal',
        tabValue: 'loyalty_points',
        tabDescription: `from ${allData?.returnBillingDetails?.loyaltyPoints || '0'} points`,
        tabIcon: '',
      },
      {
        tabName: 'Loyalty discount reversal',
        tabValue: 'loyalty_discount',
        tabDescription: `from ${allData?.returnBillingDetails?.loyaltyDiscount || '0'} points`,
        tabIcon: '',
      },
      {
        tabName: 'Additional items',
        tabValue: 'additional_item',
        tabDescription: ` form ${allData?.baseReturnResponse?.numberOfLineItems || '0'} products`,
        tabIcon: '',
      },
    ],
    [allData],
  );

  const returnInitiatedby = [
    { label: 'Mahesh', value: '' },
    { label: 'Date', value: '1 May, 2024' },
    { label: 'Source', value: 'Pallet POS' },
  ];
  const refundInitiatedby = [
    { label: 'Mahesh', value: '' },
    { label: 'Date', value: '1 May, 2024' },
    { label: 'Mode', value: 'Refund to source' },
  ];

  const timelineSalesStatus = (statusName, userName, date) => {
    switch (statusName) {
      case 'RETURN_INITIATED':
        return {
          name: 'Return Initiated',
          iconColor: '#0562fb',
          icon: <KeyboardReturnOutlinedIcon />,
          userDesc: `By- ${userName}`,
          dateTime: `${date}`,
        };
      case 'RETURN_COMPLETED':
        return {
          name: 'Return success',
          iconColor: '#4cd964',
          icon: <KeyboardReturnOutlinedIcon />,
          userDesc: `By- ${userName}`,
          dateTime: `${date}`,
        };
      case 'RETURN_REJECTED':
        return {
          name: 'Return rejected',
          iconColor: '#ff3b30',
          icon: <KeyboardReturnOutlinedIcon />,
          userDesc: `By-  ${userName}`,
          dateTime: `${date}`,
        };
      case 'RETURN_CANCELLED':
        return {
          name: 'Return cancelled',
          iconColor: '#ff3b30',
          icon: <KeyboardReturnOutlinedIcon />,
          userDesc: `By-  ${userName}`,
          dateTime: `${date}`,
        };
      default:
        return {
          name: 'Unknown status',
          iconColor: '#0562fb',
          icon: '',
          userDesc: 'Unknown User',
          dateTime: 'Unknown Date',
        };
    }
  };

  const timelineFunction = () => {
    salesOrderReturnTimeline(orderId)
      .then((res) => {
        if (res?.data?.status === 'ERROR') {
          showSnackbar(res?.data?.message, 'error');
          setTimelineLoader(false);
          return;
        }
        const response = res?.data?.data;
        if (response?.timeLine?.length === 0) {
          setDeatiledView(true);
          setTimelineLoader(false);
          return;
        }
        const timelineData = response?.timeLine?.map((item, index) => {
          const parsedTimestamp = convertUTCtoIST(item?.updateAt);
          const status = timelineSalesStatus(
            //getting status object for timeline .ie name, icon, userDesc, dateTime
            item?.fulfilmentStatus,
            item?.updatedBy,
            parsedTimestamp,
          );
          return {
            id: index,
            ...status,
          };
        });
        setTimelineArray(timelineData);
        setTimelineLoader(false);
      })
      .catch((err) => {
        setTimelineLoader(false);
        showSnackbar(err?.response?.data?.message, 'error');
      });
  };

  const timelineChipOnClick = (value) => {
    setDetailsSelectedValue(value);
    setOpenDetailsDrawer(true);
  };

  const fetchComments = () => {
    setGetCommentsLoader(true);
    sogetAllComment(returnId)
      .then((res) => {
        const commentsData = res?.data?.data?.comments?.map((item, index) => ({
          id: index,
          comment: item?.comment,
          commentedBy: item?.createdBy,
          commentId: item?.commentId,
        }));
        setComments(commentsData);
        handleAddComment('');
        setGetCommentsLoader(false);
      })
      .catch((err) => {
        setComments([]);
        setGetCommentsLoader(false);
      });
  };

  const handleAddComment = (value) => {
    setCreatedComment(value);
  };

  const handleCreateComment = () => {
    if (createdComment == '') {
      return;
    }
    setCommentLoader(true);
    const commentPayload = {
      orderId: returnId,
      createdBy: userName,
      commentType: 'RETURN',
      comment: createdComment,
    };
    if (allData?.baseReturnResponse?.salesChannel === 'POS_ORDER') {
      commentPayload.orderType = 'POS_ORDER';
    } else if (allData?.baseReturnResponse?.salesChannel === 'DIRECT') {
      commentPayload.orderType = 'SALES_ORDER';
    } else if (allData?.baseReturnResponse?.salesChannel === 'B2C_ORDER') {
      commentPayload.orderType = 'B2C_ORDER';
    } else if (allData?.baseReturnResponse?.salesChannel === 'B2B_ORDER') {
      commentPayload.orderType = 'B2B_ORDER';
    }
    soCreateComment(commentPayload)
      .then((res) => {
        fetchComments();
        setCommentLoader(false);
      })
      .catch((err) => {
        setCommentLoader(false);
      });
  };
  const columns = [
    {
      field: 'title',
      headerName: 'Title',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 200,
      cellClassName: 'datagrid-rows',
      align: 'left',
      flex: 1,
    },
    {
      field: 'barcode',
      headerName: 'Barcode',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 150,
      cellClassName: 'datagrid-rows',
      align: 'left',
      flex: 1,
    },
    {
      field: 'quantity',
      headerName: 'Order Quantity',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 70,
      cellClassName: 'datagrid-rows',
      align: 'left',
      flex: 1,
    },
    {
      field: 'salePrice',
      headerName: 'Sale Price',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 115,
      cellClassName: 'datagrid-rows',
      align: 'left',
      flex: 1,
    },
    {
      field: 'returnQuantity',
      headerName: 'Return Quantity',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 180,
      cellClassName: 'datagrid-rows',
      align: 'left',
      flex: 1,
    },
    {
      field: 'subTotal',
      headerName: 'Amount',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 70,
      cellClassName: 'datagrid-rows',
      align: 'left',
      flex: 1,
    },
  ];

  const handleInvoiceDownload = async () => {
    const payload = {
      orderId: orderId,
      orderType: allData?.baseReturnResponse?.salesChannel,
    };
    setFileLoader(true);
    try {
      const response = await exportTaxInvoice(payload);
      if (response?.status === 200) {
        const blob = await response.blob();
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `Credit Note ${orderId} ${returnId}.pdf`;
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        showSnackbar('Some error occurred', 'error');
        return null;
      }
      setFileLoader(false);
    } catch (err) {
      setFileLoader(false);
      showSnackbar('Payment Needs to be confirmed', 'error');
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar prevLink={true} />

      {/* Return header */}
      <div className="purchDet-main-info-container component-bg-br-sh-p">
        <div className="purchDet-main-info-main-div">
          <div className="purchDet-main-info">
            <div className="title-menu-main-container-mobile">
              <div className="purchDet-id-main-conatiner">
                <h1 className="purchase-id">{`Return ID ${returnId}`}</h1>
                <ContentCopyIcon className="copy-icon" sx={{ cursor: 'pointer' }} onClick={handleCopy} />
                {returnLoader && <Spinner size={20} />}
              </div>
              <div className="menu-icon-div-mobile">
                <MoreHorizRoundedIcon fontSize="large" className="copy-icon menu-icon" onClick={handleMenu} />
              </div>
            </div>
            <div className="menu-icon-div-mobile">
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={openMenu}
                onClose={handleMenuClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
              >
                <MenuItem>Edit</MenuItem>,<MenuItem key="package-menu-item">Packaged</MenuItem>
                <MenuItem key="transit-menu-item">In-transit</MenuItem>
                <Divider key="divider" className="common-divider-mob" />
                <MenuItem key="quote">Quote</MenuItem>
              </Menu>
            </div>

            <div className="purchDet-id-main-conatiner">
              <span className="purchDet-vendorName-value-title approval-info-title" style={{ width: '100%' }}>
                Created by {allData?.baseReturnResponse?.createdBy || 'NA'}
              </span>
            </div>
            <div className="purchDet-id-main-container">
              <span className="purchDet-vendorName-value-title approval-info-title" style={{ width: '100%' }}>
                Credit note{' '}
                {allData?.baseReturnResponse?.invoiceId ? (
                  <>
                    {allData?.baseReturnResponse?.invoiceId}{' '}
                    {/* {allData.baseReturnResponse.invoiceId} && (fileLoader ? (
                      <div>
                        <Spinner size={20} />
                      </div>
                    ) : (
                      <FileDownloadIcon
                        color="success"
                        onClick={handleInvoiceDownload}
                        sx={{ cursor: 'pointer', fontSize: '20px' }}
                      />
                    ))} */}
                  </>
                ) : (
                  'NA'
                )}
              </span>
            </div>
            <div className="purchDet-vendor-name" style={{ width: !isMobileDevice && '400px' }}>
              <span className="purchDet-vendorName-value-title approval-info-title">Customer name</span>
              <span
                className="purchDet-vendorName-value-title approval-info-title"
                style={{ color: '#367df3', width: '100%' }}
              >
                {allData?.baseReturnResponse?.customerName}
              </span>
            </div>
          </div>

          {isMobileDevice && <Divider className="common-divider-mob" />}

          <div className="purchDet-main-tools">
            <div className="purchDet-main-aprroval-info">
              <div className="purchDet-estimated-value">
                <span className="purchDet-vendorName-value-title">Return Value</span>
                <span className="estimated-value">₹{allData?.returnBillingDetails?.returnAmount || 'NA'}</span>
              </div>
              <div className="purchDet-approval-info-details">
                <div className="purchDet-approval-info-span-div">
                  <span className="purchDet-vendorName-value-title approval-info-title">Order date</span>
                  <span className="purchDet-vendorName-value-title">{orderDate.date || 'NA'}</span>
                </div>
                <div className="purchDet-approval-info-span-div">
                  <span className="purchDet-vendorName-value-title approval-info-title">Order time</span>
                  <span className="purchDet-vendorName-value-title">{orderDate.time || 'NA'}</span>
                </div>
                {/* <div className="purchDet-approval-info-span-div">
                  <span className="purchDet-vendorName-value-title approval-info-title">Order time</span>
                  <span className="purchDet-vendorName-value-title">{'NA'}</span>
                </div> */}
                <div className="purchDet-approval-info-span-div">
                  <span className="purchDet-vendorName-value-title approval-info-title">Refund status</span>
                  <span
                    className={`purchDet-vendorName-value-title ${
                      allData?.baseReturnResponse?.returnStatus === 'COMPLETED'
                        ? 'order-status-box-success'
                        : 'order-status-box-pending'
                    }`}
                  >
                    {textFormatter(allData?.baseReturnResponse?.returnStatus) || 'NA'}
                  </span>
                </div>
                <div className="purchDet-approval-info-span-div">
                  <span className="purchDet-vendorName-value-title approval-info-title">Refund mode</span>
                  <span className="purchDet-vendorName-value-title">
                    {allData?.returnBillingDetails?.returnMode ?? 'NA'}
                  </span>
                </div>
              </div>
            </div>
            {/* <div className="menu-icon-div">
              <MoreHorizRoundedIcon fontSize="large" className="copy-icon menu-icon" onClick={handleMenu} />
            </div> */}
          </div>
        </div>
        {isMobileDevice && <Divider className="common-divider-mob" />}

        <div className="additional-info-main-container">
          {additionalInfoArray?.map((info) => {
            return (
              <div className="purchDet-header-additional-info">
                <span className="additionalInfo-title">{info?.infoName}</span>
                <span className="purchDet-vendorName-value-value second-tooltip-container">{info?.infoValue}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/*AdditionalDetails*/}
      <AdditionalDetails additionalDetailsArray={array} additionalDetails={infoDetails} />

      <div className="indent-details-main-container">
        {!isMobileDevice && <span className="purch-det-heading-title">Return timeline</span>}
        <div className="indent-details-main-div">
          {!isMobileDevice && (
            <div className="purchase-details-timeline component-bg-br-sh-p">
              <CommonTimeLine
                timelineArray={timelineArray}
                timelineLoader={timelineLoader}
                purchaseId={returnId}
                timelineFunction={timelineFunction}
              />
            </div>
          )}
          <div
            className="purchase-details-data"
            style={{
              marginTop: !isMobileDevice && '-50px',
              flex: !isMobileDevice ? '1' : '0.8',
            }}
          >
            {isMobileDevice && (
              <div className="vendor-details-pi">
                <Chip
                  label="Return timeline"
                  className="chip-style-purchase"
                  sx={{
                    border:
                      detailsSelectedValue === 'timeline'
                        ? '1px solid #0562fa !important'
                        : '1px solid #505050 !important',
                    color: detailsSelectedValue === 'timeline' ? '#0562fa !important' : '#505050 !important',
                  }}
                  variant="outlined"
                  onClick={() => timelineChipOnClick('timeline')}
                />
                <MobileDrawerCommon
                  anchor="bottom"
                  paperProps={{ height: 'auto  !important', maxHeight: '90%' }}
                  drawerOpen={openDetailsDrawer}
                  drawerClose={() => {
                    setOpenDetailsDrawer(false);
                    setDetailsSelectedValue('');
                  }}
                  overflowHidden={true}
                >
                  <div className="mobileDrawer-box-wrapper">
                    <div className="component-bg-br-sh-p">
                      <CommonTimeLine
                        timelineArray={timelineArray}
                        timelineLoader={timelineLoader}
                        purchaseId={returnId}
                        timelineFunction={timelineFunction}
                      />
                    </div>
                  </div>
                </MobileDrawerCommon>
              </div>
            )}
            <div className="purchase-details-datagrid" style={{ marginTop: '10px' }}>
              <div className="purch-det-heading-title" style={{ marginBottom: '10px' }}>
                Return details
              </div>
              {isMobileDevice ? (
                <div
                  className="indent-details-mob-card-main-container"
                  style={{ height: itemData?.length <= 1 ? 'auto' : '400px' }}
                >
                  {itemData?.length ? (
                    itemData?.map((data, index) => {
                      return (
                        <div className="card-main-component pi-item-card-main-component" key={index}>
                          <Stack direction={'row'} alignItems={'flex-start'} justifyContent={'space-between'}>
                            <Stack>
                              <span className="card-title">{data?.title}</span>
                              <span className="card-desc">{data?.barcode}</span>
                            </Stack>
                          </Stack>
                          <Divider className="common-divider-mob-cards" />
                          <Grid container>
                            <Grid item lg={4} md={4} sm={4} xs={4}>
                              <Stack alignItems={'flex-start'}>
                                <span className="card-small-title">Order Quantity</span>
                                <span className="card-small-value">{data?.quantity}</span>
                              </Stack>
                            </Grid>
                            <Grid item lg={4} md={4} sm={4} xs={4}>
                              <Stack alignItems={'flex-end'}>
                                <span className="card-small-title">Sale price</span>
                                <span className="card-small-value">{data?.salePrice}</span>
                              </Stack>
                            </Grid>
                          </Grid>
                          <Divider className="common-divider-mob-cards" />
                          <Grid container>
                            <Grid item lg={4} md={4} sm={4} xs={4}>
                              <Stack>
                                <span className="card-small-title">Retun Quantity</span>
                                <span className="card-small-value">{data?.retunQuantity}</span>
                              </Stack>
                            </Grid>
                            <Grid item lg={4} md={4} sm={4} xs={4}>
                              <Stack alignItems={'flex-end'}>
                                <span className="card-small-title">Amount</span>
                                <span className="card-small-value">{data?.subTotal}</span>
                              </Stack>
                            </Grid>
                          </Grid>
                        </div>
                      );
                    })
                  ) : (
                    <div className="no-data-purchase">
                      <span>No order data found</span>
                    </div>
                  )}
                </div>
              ) : (
                <CommonDataGrid columns={columns} rows={itemData} rowCount={itemData?.length} disableSelectionOnClick />
              )}
              <div
                style={{
                  display: 'flex',
                  flexDirection: isMobileDevice ? 'column' : 'row',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '10px',
                  marginTop: '20px',
                  width: isMobileDevice ? '100%' : '850px',
                  marginLeft: 'auto',
                  marginRight: '0',
                }}
              >
                <div>
                  <div>
                    {isMobileDevice ? (
                      <>
                        <div className="purch-det-heading-title">Transaction history</div>

                        <div
                          className="indent-details-mob-card-main-container"
                          style={{
                            height: allData?.returnDetails?.refund?.length <= 1 ? 'auto' : '200px',
                            width: '100%',
                            margin: 'auto',
                          }}
                        >
                          {allData?.returnDetails?.refund?.length
                            ? allData?.returnDetails?.refund?.map((data, index) => {
                                return (
                                  <div className="card-main-component pi-item-card-main-component" key={index}>
                                    <Stack direction={'row'} alignItems={'flex-start'} justifyContent={'space-between'}>
                                      <Stack>
                                        <div>
                                          <Tooltip title={data?.refundMode}>
                                            <div>
                                              {data?.refundMode === 'CASH' ? (
                                                <CurrencyRupeeRoundedIcon
                                                  className="transaction-visa-icon-order"
                                                  style={{ marginLeft: '-5px' }}
                                                />
                                              ) : (
                                                <CreditCardOutlinedIcon
                                                  className="transaction-visa-icon-order"
                                                  style={{ marginLeft: '-5px' }}
                                                />
                                              )}
                                            </div>
                                          </Tooltip>
                                          <span className="card-desc">
                                            <b> Transaction ID: </b>
                                            {data?.transactionCode || 'NA'}
                                          </span>
                                        </div>
                                        <span className="card-desc">{convertUTCtoIST(data?.createdDate) || 'NA'}</span>
                                      </Stack>
                                    </Stack>
                                    <Divider className="common-divider-mob-cards" />
                                    <Grid container>
                                      <Grid item lg={6} md={6} sm={6} xs={6}>
                                        <Stack>
                                          <span className="card-small-title">Amount</span>
                                          <div className="transaction-amount-order">
                                            <div>₹ {data?.refundAmount || 0}</div>
                                          </div>
                                        </Stack>
                                      </Grid>
                                      <Grid item lg={6} md={6} sm={6} xs={6}>
                                        <Stack alignItems={'flex-end'}>
                                          <span className="card-small-title">Status</span>
                                          <span
                                            className={
                                              data?.status === 'COMPLETED'
                                                ? 'transaction-success-order'
                                                : 'transaction-failed-order'
                                            }
                                          >
                                            {data?.status === 'COMPLETED' ? 'Success' : data?.status}
                                          </span>
                                        </Stack>
                                      </Grid>
                                    </Grid>
                                  </div>
                                );
                              })
                            : null}
                        </div>
                      </>
                    ) : (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '1px',
                          height: '90px',
                          overflow: 'auto',
                        }}
                      >
                        {transactionData?.length
                          ? transactionData?.map((data, index) => {
                              return (
                                <div
                                  className="transaction-history-data"
                                  style={{
                                    width: isMobileDevice ? '100%' : '500px',
                                    marginTop: isMobileDevice ? '30px' : '20px',
                                  }}
                                >
                                  <Tooltip title={data?.refundMode}>
                                    <div>
                                      {data?.refundMode === 'CASH' ? (
                                        <CurrencyRupeeRoundedIcon className="transaction-visa-icon-order" />
                                      ) : (
                                        <CreditCardOutlinedIcon className="transaction-visa-icon-order" />
                                      )}
                                    </div>
                                  </Tooltip>
                                  <div className="transaction-text-order" style={{ width: '80%' }}>
                                    <div>
                                      <b>Transaction ID: </b>
                                      {data?.transactionCode?.length > 28 ? (
                                        <Tooltip title={data?.transactionCode}>
                                          {data?.transactionCode?.slice(0, 28) + '...'}
                                        </Tooltip>
                                      ) : (
                                        data?.transactionCode || 'NA'
                                      )}
                                    </div>
                                    <div>{convertUTCtoIST(data?.createdDate) || 'Date: NA'}</div>
                                  </div>
                                  <div className="transaction-text-order">
                                    <b>
                                      ₹
                                      {data?.refundAmount?.length > 7 ? (
                                        <Tooltip title={data?.refundAmount}>
                                          {data?.refundAmount?.slice(0, 7) + '...'}
                                        </Tooltip>
                                      ) : (
                                        data?.refundAmount || 0
                                      )}
                                    </b>
                                  </div>
                                  <div
                                    className={
                                      data?.status === 'COMPLETED'
                                        ? 'transaction-success-order'
                                        : 'transaction-failed-order'
                                    }
                                    style={{ marginRight: '10px' }}
                                  >
                                    {data?.status === 'COMPLETED' ? 'Success' : data?.status}
                                  </div>
                                  {/* <MoreHorizIcon color="info" sx={{ marginRight: '10px' }} /> */}
                                </div>
                              );
                            })
                          : null}

                        {/* <div
                                className="transaction-history-data"
                                style={{
                                  width: isMobileDevice ? '100%' : '529px',
                                  marginTop: isMobileDevice ? '30px' : '20px',
                                }}
                              >
                                <FaCcMastercard className="transaction-master-icon-order" />
                                <div className="transaction-text-order">
                                  <div>Transaction ID: 2974jbajdbf8763blkd</div>
                                  <div>24 Feb, 2024, 13:56:23</div>
                                </div>
                                <div className="transaction-amount-order">
                                  <div>₹ 6432</div>
                                </div>
                                <div className="transaction-success-order">Success</div>
                                <MoreHorizIcon color="info" sx={{ marginRight: '10px' }} />
                              </div> */}
                      </div>
                    )}
                  </div>
                  {/* <div
                    style={{
                      display: 'flex',
                      flexDirection: isMobileDevice ? 'column' : 'row',
                      justifyContent: 'space-between',
                      margin: 'auto',
                      marginTop: '10px',
                      gap: '10px',
                      width: '100%',
                    }}
                  >
                    <div
                      className="sales-order-quick-link-box"
                      style={{ height: '150px', width: isMobileDevice ? '100%' : '227px' }}
                    >
                      <span className="sales-order-quick-link-text">Return initiated by</span>
                      <div style={{ padding: '10px' }}>
                        {returnInitiatedby.map((metric) => {
                          return (
                            <Grid container p={0.2} key={metric.label}>
                              <Grid item lg={4} md={4} sm={4} xs={4}>
                                <Stack alignItems={'flex-start'}>
                                  <span className="card-small-title">{metric.label}</span>
                                </Stack>
                              </Grid>
                              <Grid item lg={8} md={8} sm={8} xs={8}>
                                <Stack alignItems={'flex-start'}>
                                  <span className="card-small-title">{metric.value}</span>
                                </Stack>
                              </Grid>
                            </Grid>
                          );
                        })}
                      </div>
                    </div>
                    <div
                      className="sales-order-quick-link-box"
                      style={{ height: '150px', width: isMobileDevice ? '100%' : '227px' }}
                    >
                      <span className="sales-order-quick-link-text">Refund initiated by</span>
                      <div style={{ padding: '10px' }}>
                        {refundInitiatedby.map((metric) => {
                          return (
                            <Grid container p={0.2} key={metric.label}>
                              <Grid item lg={4} md={4} sm={4} xs={4}>
                                <Stack alignItems={'flex-start'}>
                                  <span className="card-small-title">{metric.label}</span>
                                </Stack>
                              </Grid>
                              <Grid item lg={8} md={8} sm={8} xs={8}>
                                <Stack alignItems={'flex-start'}>
                                  <span className="card-small-title">{metric.value}</span>
                                </Stack>
                              </Grid>
                            </Grid>
                          );
                        })}
                      </div>
                    </div>
                  </div> */}
                </div>
                <div
                  className="sales-order-item-bill-data"
                  style={{
                    width: isMobileDevice ? '100%' : '300px',
                    height: '230px',
                    marginTop: '20px',
                    alignContent: 'center',
                  }}
                >
                  <BillingDataRow
                    label="Discount corrections"
                    value={allData?.returnBillingDetails?.discountCorrections ?? '0'}
                  />
                  <BillingDataRow label="Pickup charges" value={allData?.returnBillingDetails?.pickUpCharges ?? '0'} />
                  <BillingDataRow label="Total taxable value" value={allData?.returnBillingDetails?.subTotal ?? '0'} />
                  <BillingDataRow label="IGST" value={allData?.returnBillingDetails?.igst ?? '0'} />
                  <BillingDataRow label="SGST" value={allData?.returnBillingDetails?.sgst ?? '0'} />
                  <BillingDataRow label="CGST" value={allData?.returnBillingDetails?.cgst ?? '0'} hasDivider />
                  <BillingDataRow
                    label={<b>Total</b>}
                    value={<b>{allData?.returnBillingDetails?.returnAmount ?? '0'}</b>}
                    hasDivider
                  />
                </div>
              </div>

              {/* COMMENTS */}
              <div
                style={{
                  marginTop: '20px',
                  width: isMobileDevice ? '100%' : '850px',
                  marginLeft: 'auto',
                  marginRight: '0',
                }}
              >
                <CommentComponent
                  commentData={comments}
                  addCommentFunction={handleAddComment}
                  handleSend={handleCreateComment}
                  loader={commentLoader}
                  getCommentsLoader={getCommentsLoader}
                  createdComment={createdComment}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SalesReturnDetails;
