import { Badge, Box, Chip, CircularProgress, Grid, Menu, MenuItem, Modal } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import PersonIcon from '@mui/icons-material/Person';
import {
  approveExpressPurchaseEvent,
  deleteExpressPurchase,
  getUserFromUidx,
  itemDetailsExpressPurchase,
  startExpressPurchaseEvent,
  timelineExpressPurchase,
} from '../../../../../config/Services';
import { buttonStyles } from '../../../Common/buttonColor';
import { capitalizeFirstLetterOfWords, dateFormatter } from '../../../Common/CommonFunction';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from '../../../../../hooks/SnackbarProvider';
import AnimatedStatisticsCard from '../../../../../examples/Cards/StatisticsCards/AnimatedStatisticsCard';
import DashboardLayout from '../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../examples/Navbars/DashboardNavbar';
import FlagIcon from '@mui/icons-material/Flag';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import MiniStatisticsCard from '../../../../../examples/Cards/StatisticsCards/MiniStatisticsCard';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import React, { useEffect, useState } from 'react';
import SoftBox from '../../../../../components/SoftBox';
import SoftButton from '../../../../../components/SoftButton';
import SoftSelect from '../../../../../components/SoftSelect';
import SoftTypography from '../../../../../components/SoftTypography';
import Spinner from '../../../../../components/Spinner';
import TimelineItem from './TimelineItem';
import TimelineList from '../../../../../examples/Timeline/TimelineList';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import styled from '@emotion/styled';

const PurchaseExclusiveDetails = () => {
  const { jobId } = useParams();
  const showSnackbar = useSnackbar();
  const [timelineloader, setTimelineloader] = useState(false);
  const [approveloader, setApproveLoaer] = useState(false);
  const [retryLoader, setRetryLoader] = useState(false);
  const [data, setData] = useState({});
  const [itemData, setItemData] = useState([]);
  const [createdBy, setCreatedBy] = useState('');
  const [assignedTo, setAssignTo] = useState('');
  const [datRows, setTableRows] = useState([]);
  const [dele, setDele] = useState(false);
  const [appr, setAppr] = useState(false);
  const [isApprover, setIsApprover] = useState(false);
  const [approverModal, setApproverModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');
  const [deleteLoader, setDeleteLoader] = useState(false);
  const navigate = useNavigate();
  const [rowData, setRowData] = useState([]);

  const user_details = JSON.parse(localStorage.getItem('user_details'));
  const uidx = user_details.uidx;
  const currUserName = localStorage.getItem('user_name');
  const contextType = localStorage.getItem('contextType');

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    itemDetailsExpressPurchase(jobId)
      .then((res) => {
        if (res?.data?.data?.es === 0) {
          setData(res?.data?.data?.expressPurchaseOrder);
          const response = res?.data?.data?.expressPurchaseOrder;
          if (response?.expressPOAssignedToList?.length > 0) {
            assignUserDetails(response?.expressPOAssignedToList);
            const isMatch = response?.expressPOAssignedToList?.some((item) => item.assignedUidx === uidx);
            setIsApprover(isMatch);
          }
          const originalItemList = response?.itemList?.map((item) => {
            let forecastData = null;
            if (item.forecastData !== null) {
              forecastData = JSON.parse(item.forecastData);
            }
            return { ...item, forecastData };
          });
          const newItemList = [];

          for (let i = 0; i < originalItemList.length; i++) {
            const mainProductDetails = originalItemList[i];
            newItemList.push(mainProductDetails);

            if (
              mainProductDetails.offers &&
              mainProductDetails.offers.offerType !== 'OFFER ON MRP' &&
              mainProductDetails.offers.offerDetailsList
            ) {
              mainProductDetails.offers.offerDetailsList.forEach((offerDetails) => {
                const newItem = {
                  ...offerDetails,
                  offerType: mainProductDetails.offers.offerType,
                  quantityOrdered: offerDetails.inwardedQuantity,
                  itemName: offerDetails.itemName,
                  itemNo: offerDetails.gtin,
                };

                newItemList.push(newItem);
              });
            }
          }
          setItemData(newItemList);
          userName(response?.createdBy);
        } else {
          showSnackbar(res?.data?.data?.message, 'error');
        }
      })
      .catch((err) => {
        showSnackbar(err?.response?.data?.message, 'error');
      });
  };

  const assignUserDetails = (inputArray) => {
    const promises = inputArray.map((item) =>
      getUserFromUidx(item.assignedUidx)
        .then((response) => response?.data?.data?.firstName + ' ' + response?.data?.data?.secondName)
        .catch((error) => {
          return '';
        }),
    );

    return Promise.all(promises)
      .then((userNameArray) => {
        const resultString = userNameArray.join(', ');
        setAssignTo(resultString);
      })
      .catch((error) => {});
  };

  const userName = (id) => {
    getUserFromUidx(id)
      .then((res) => {
        setCreatedBy(res?.data?.data?.firstName + ' ' + res?.data?.data?.secondName);
      })
      .catch((err) => {});
  };

  useEffect(() => {
    exPOTimeline();
  }, [dele, appr]);

  const exPOTimeline = () => {
    setTimelineloader(true);
    timelineExpressPurchase(jobId)
      .then((res) => {
        if (res?.data?.data?.es === 0) {
          setTableRows(res?.data?.data?.timelines);
        } else {
          showSnackbar(res?.data?.data?.message, 'error');
        }
        setTimelineloader(false);
      })
      .catch((err) => {
        setTimelineloader(false);
        showSnackbar('Some Error Occured, Try after some time', 'error');
      });
  };

  const handleRetry = async () => {
    setRetryLoader(true);
    const payload = {
      epoNumber: jobId,
      requestedBy: uidx,
      reqSourceType: contextType,
    };

    try {
      const res = await startExpressPurchaseEvent(payload);
      if (res?.data?.data?.es === 0) {
        setTimeout(() => {
          setRetryLoader(false);
          fetchData();
          exPOTimeline();
        }, 5000);
      } else if (res?.data?.data?.es === 1) {
        showSnackbar(res?.data?.data?.message, 'error');
        setRetryLoader(false);
      }
    } catch (err) {
      setRetryLoader(false);
      showSnackbar(err?.response?.data?.message, 'error');
    }
  };

  const handleEdit = () => {
    localStorage.setItem('epoNumber', jobId);
    navigate(`/purchase/express-grn/create-express-grn/${jobId}`);
  };
  const handleApprove = () => {
    setApproverModal(true);
    handleMenuClose();
  };

  const handleApproved = async () => {
    setTimelineloader(true);
    const payload = {
      epoNumber: jobId,
      status: 'ACCEPTED',
      comments: 'string',
      updatedBy: uidx,
      userName: currUserName,
    };

    try {
      const res = await approveExpressPurchaseEvent(payload);
      showSnackbar(res?.data?.data?.message, 'success');

      try {
        const itemRes = await itemDetailsExpressPurchase(jobId);
        if (itemRes?.data?.data?.es === 0) {
          setData(itemRes?.data?.data?.expressPurchaseOrder);
        }
      } catch (err) {
        showSnackbar(err?.response?.data?.message, 'error');
      }

      await handleRetry();

      setAppr(!appr);
      setApproverModal(false);
    } catch (err) {
      setApproverModal(false);
      showSnackbar(err?.response?.data?.message, 'error');
    } finally {
      setTimelineloader(false);
    }
  };

  const handlePutAway = (putawayId, poNumber) => {
    localStorage.setItem('sessionId', putawayId);
    localStorage.setItem('poNumber', poNumber);
    navigate('/products/putaway');
  };

  const handleDeleteEXPO = () => {
    setDeleteLoader(true);
    setDeleteModal(false);
    const payload = {
      userId: uidx,
      reason: deleteReason,
      epoNumber: jobId,
    };
    deleteExpressPurchase(payload)
      .then((res) => {
        if (res?.data?.data?.es === 1) {
          showSnackbar(res?.data?.data?.message, 'error');
        } else {
          setDele(!dele);
          showSnackbar('Deleted', 'success');
          localStorage.removeItem('epoNumber');
          navigate('/purchase/express-grn');
        }
        setDeleteLoader(false);
      })
      .catch((err) => {
        setDeleteLoader(false);
        showSnackbar(err?.response?.data?.message, 'error');
      });
  };

  const renderTimelineItems = datRows?.map(({ logType, status, updatedOn, updatedBy, docId }) => (
    <TimelineItem
      key={updatedOn}
      updatedOn={updatedOn}
      updatedBy={updatedBy}
      status={status}
      docId={docId}
      logType={logType}
      color={
        status == 'Created'
          ? 'info'
          : status == 'Po created'
          ? 'success'
          : status == 'Draft'
          ? 'warning'
          : status == 'Inward successful'
          ? 'success'
          : status === 'Put away successful'
          ? 'success'
          : status === 'Accepted'
          ? 'success'
          : status === 'Close'
          ? 'info'
          : 'error'
      }
      icon="archive"
    />
  ));

  const FlagTooltips = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)(
    ({ theme }) => ({
      [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#fff',
        color: 'rgba(0, 0, 0, 0.87)',
        maxWidth: 750,
        fontSize: theme.typography.pxToRem(12),
        boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
        padding: '10px',
        border: '2px dotted rgb(158, 156, 156)',
      },
    }),
  );

  const categoryColour = (data) => {
    switch (data) {
      case 'GREEN':
        return 'success';
      case 'ORANGE':
        return 'warning';
      case 'RED':
        return 'error';
      case 'GREY':
        return 'secondary';
      case 'A':
        return 'success';
      case 'B':
        return 'warning';
      case 'C':
        return 'error';
      default:
        return 'info';
    }
  };

  const getTagDescription = (type, result) => {
    if (type === 'INVENTORY') {
      switch (result) {
        case 'A':
          return 'Highest Consumption';
        case 'B':
          return 'Average Consumption';
        case 'C':
          return 'Lowest Consumption';
        case 'D':
          return 'Dead Stock';
        default:
          return '';
      }
    } else if (type === 'SALES') {
      switch (result) {
        case 'A':
          return 'Fast Movement';
        case 'B':
          return 'Average Movement';
        case 'C':
          return 'Low Movement';
        default:
          return '';
      }
    } else if (type === 'PROFIT') {
      switch (result) {
        case 'A':
          return 'Highest Value';
        case 'B':
          return 'Average Value';
        case 'C':
          return 'Lowest Value';
        default:
          return '';
      }
    }
  };

  const columns = [
    {
      headerName: 'S.No.',
      field: 'serialNo',
      minWidth: 10,
      editable: false,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
      renderCell: (params) => {
        const e = params?.row;
        return (
          <SoftBox style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {e?.offerType || e?.purchasePrice === 0 ? (
              <Tooltip title={e?.offerType || 'FREE PRODUCTS'}>
                <SoftBox style={{ padding: '6px', marginLeft: '5px' }}>
                  <LocalOfferIcon color="success" sx={{ fontSize: 18 }} />
                </SoftBox>
              </Tooltip>
            ) : e?.forecastData?.flag ? (
              <div style={{ marginLeft: '5px' }}>
                <Badge
                  badgeContent={
                    <FlagTooltips
                      placement="bottom-start"
                      title={
                        <div className="tooltip-flag-recommend">
                          <div className="tooltip-flag-heading-name">
                            <SoftTypography fontSize="14px" fontWeight="bold">
                              Recommendation:
                            </SoftTypography>
                            <SoftTypography
                              fontSize="14px"
                              fontWeight="bold"
                              mt={e?.forecastData?.inventoryCat === 'D' ? '' : 1}
                            >
                              Inventory:
                            </SoftTypography>
                            <SoftTypography fontSize="14px" fontWeight="bold" mt={1}>
                              Sales:
                            </SoftTypography>
                            <SoftTypography fontSize="14px" fontWeight="bold" mt={1}>
                              Gross Profit:
                            </SoftTypography>
                          </div>
                          <div className="tooltip-flag-heading-name">
                            <SoftTypography fontSize="14px">{e?.forecastData?.recommendation || 'NA'}</SoftTypography>
                            <div className={e?.forecastData?.inventoryCat === 'D' ? 'tooltip-flag-cat-data' : ''}>
                              {e?.forecastData?.inventoryCat === 'D' ? (
                                <span style={{ color: 'red', fontSize: '14px', fontWeight: 'bold' }}>Dead Stock</span>
                              ) : (
                                <>
                                  <Chip
                                    color={categoryColour(e?.forecastData?.inventoryCat)}
                                    label={e?.forecastData?.inventoryCat || 'NA'}
                                  />
                                  {e?.forecastData?.inventoryCat !== 'NA' && (
                                    <Chip
                                      color={categoryColour(e?.forecastData?.inventoryCat)}
                                      label={getTagDescription('INVENTORY', e?.forecastData?.inventoryCat) || 'NA'}
                                    />
                                  )}
                                </>
                              )}
                            </div>
                            <div className="tooltip-flag-cat-data">
                              <Chip
                                color={categoryColour(e?.forecastData?.salesCat)}
                                label={e?.forecastData?.salesCat || 'NA'}
                              />
                              {e?.forecastData?.salesCat !== 'NA' && (
                                <Chip
                                  color={categoryColour(e?.forecastData?.salesCat)}
                                  label={getTagDescription('SALES', e?.forecastData?.salesCat) || 'NA'}
                                />
                              )}
                            </div>
                            <div className="tooltip-flag-cat-data">
                              <Chip
                                color={categoryColour(e?.forecastData?.grossProfitCat)}
                                label={e?.forecastData?.grossProfitCat || 'NA'}
                              />
                              {e?.forecastData?.grossProfitCat !== 'NA' && (
                                <Chip
                                  color={categoryColour(e?.forecastData?.grossProfitCat)}
                                  label={getTagDescription('PROFIT', e?.forecastData?.grossProfitCat) || 'NA'}
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      }
                    >
                      <FlagIcon sx={{ fontSize: 15, color: '#fff', cursor: 'pointer' }} />
                    </FlagTooltips>
                  }
                  color={categoryColour(e?.forecastData?.flag || 'NA')}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  style={{ marginTop: '10px' }}
                >
                  <SoftBox style={{ padding: '6px', fontSize: '15px' }}>{e.serialNo}</SoftBox>
                </Badge>
              </div>
            ) : (
              <SoftBox style={{ padding: '6px', marginLeft: '5px', fontSize: '15px' }}>{e.serialNo}</SoftBox>
            )}
          </SoftBox>
        );
      },
    },
    {
      headerName: 'Item',
      field: 'itemName',
      minWidth: 180,
      editable: false,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      align: 'left',
      headerAlign: 'left',
      flex: 1,
      renderCell: (params) => {
        const e = params?.row;
        return (
          <SoftBox className="gold">
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                fontSize: '13px',
              }}
            >
              <Tooltip title={e.itemNo} placement="bottom-start">
                <InfoOutlinedIcon
                  color="info"
                  sx={{
                    marginRight: '5px',
                    marginTop: '0.75rem',
                  }}
                />
              </Tooltip>
              <span
                style={{
                  whiteSpace: 'nowrap',
                  maxWidth: '200px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  marginTop: '0.75rem',
                }}
              >
                <span
                  style={{
                    whiteSpace: 'nowrap',
                    maxWidth: '200px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    marginTop: '0.75rem',
                  }}
                  onClick={() => navigate(`/products/all-products/details/${e.itemNo}`)}
                >
                  <Tooltip title={e.itemName}>{e.itemName}</Tooltip>
                </span>
              </span>
            </span>
          </SoftBox>
        );
      },
    },
    {
      headerName: 'Unit Price',
      field: 'unitPrice',
      minWidth: 20,
      editable: false,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
    },
    {
      headerName: 'Specf',
      field: 'specification',
      minWidth: 50,
      editable: false,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
    },
    {
      headerName: 'PO Ordered',
      field: 'quantityOrdered',
      minWidth: 10,
      editable: false,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
    },
    {
      headerName: 'PP',
      field: 'purchasePrice',
      minWidth: 10,
      editable: false,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
    },
    {
      headerName: 'P Margin',
      field: 'purchaseMargin',
      minWidth: 10,
      editable: false,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
      renderCell: (params) => {
        const purchaseMargin =
          params?.row?.unitPrice !== undefined &&
          params?.row?.unitPrice !== '' &&
          params?.row?.unitPrice !== 0 &&
          params?.row?.purchasePrice !== 0 &&
          params?.row?.purchasePrice !== undefined &&
          params?.row?.purchasePrice !== '' &&
          !isNaN(params?.row?.unitPrice) &&
          !isNaN(params?.row?.purchasePrice) &&
          isFinite(params?.row?.unitPrice) &&
          isFinite(params?.row?.purchasePrice)
            ? Math.abs(
                (((params?.row?.unitPrice - params?.row?.purchasePrice) / params?.row?.unitPrice) * 100).toFixed(1),
              )
            : 0;
        return <SoftBox style={{ fontSize: '0.75rem' }}>{purchaseMargin || 0}</SoftBox>;
      },
    },
    {
      headerName: 'Tax',
      field: 'gstValue',
      minWidth: 30,
      editable: false,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
    },
    {
      headerName: 'Amount',
      field: 'finalPrice',
      minWidth: 50,
      editable: false,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      align: 'center',
      headerAlign: 'center',
      flex: 1,
    },
  ];
  useEffect(() => {
    let counter = 1;
    const updatedRow = itemData.map((e, index) => {
      return {
        id: index + 1,
        serialNo: e?.id ? counter++ : '',
        itemNo: e?.itemNo,
        itemName: e?.itemName,
        unitPrice: e?.unitPrice || 0,
        specification: e?.specification || 0,
        quantityOrdered: e?.quantityOrdered || 0,
        purchasePrice: e?.purchasePrice || 0,
        gstValue: e?.gstValue || 0,
        finalPrice: e?.finalPrice || 0,
        forecastData: e?.forecastData || null,
        offerType: e?.offerType || null,
        offerId: e?.offerId || null,
      };
    });
    setRowData(updatedRow);
  }, [itemData]);

  const LightTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} arrow classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.common.white,
      color: 'red',
      boxShadow: theme.shadows[1],
      fontSize: 11,
    },
    [`& .${tooltipClasses.arrow}`]: {
      color: theme.palette.common.white,
    },
  }));

  // const LightTooltip = styled(({ className, ...props }) => (
  //   <Tooltip {...props} arrow classes={{ popper: className }} />
  // ))(({ theme }) => ({
  //   [`& .${tooltipClasses.arrow}`]: {
  //     color: theme.palette.common.white,
  //   },
  //   [`& .${tooltipClasses.tooltip}`]: {
  //     backgroundColor: theme.palette.common.white,
  //     color: 'rgba(0, 0, 0, 0.87)',
  //     boxShadow: theme.shadows[1],
  //     fontSize: 11,
  //   },
  // }));

  return (
    <DashboardLayout>
      <DashboardNavbar prevLink={true} />

      <SoftBox className="bills-details-top-box">
        <SoftBox className="bills-details-inner-left-box">
          <SoftTypography>Job Id: {jobId}</SoftTypography>
        </SoftBox>

        <SoftBox className="bills-details-inner-right-box">
          <Box display="flex" gap="10px" sx={{ cursor: 'pointer' }}>
            {data?.status !== 'CLOSE' && data?.status !== 'PENDING_APPROVAL' ? (
              <LightTooltip
                title={`${data?.eventStatus === 'IN_PROGRESS' ? 'Express GRN event already started' : 'Retry'}`}
              >
                <span>
                  <SoftButton
                    variant={buttonStyles.primaryVariant}
                    className="contained-softbutton vendor-add-btn"
                    onClick={handleRetry}
                    disabled={retryLoader || data?.eventStatus === 'IN_PROGRESS' ? true : false}
                  >
                    {retryLoader ? <CircularProgress size={20} /> : <>Retry</>}
                  </SoftButton>
                </span>
              </LightTooltip>
            ) : null}
          </Box>
          {data?.status === 'PENDING_APPROVAL' && (
            <SoftBox className="st-dot-box-I" onClick={handleMenu}>
              <MoreVertIcon />
            </SoftBox>
          )}
          <Menu
            id="basic-menu"
            className="menu-box"
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            {data?.status === 'PENDING_APPROVAL' && <MenuItem onClick={handleEdit}>Edit</MenuItem>}
            {isApprover && data?.status === 'PENDING_APPROVAL' && <MenuItem onClick={handleApprove}>Approve</MenuItem>}

            <MenuItem onClick={() => setDeleteModal(true)}>Delete</MenuItem>
            {/* <MenuItem>Export as PDF</MenuItem> */}
          </Menu>
          <Modal
            open={approverModal}
            onClose={() => setApproverModal(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box className="pi-approve-menu">
              <SoftTypography id="modal-modal-title" variant="h6" component="h2">
                Are you sure you want to approve this.
              </SoftTypography>
              <SoftBox className="pi-approve-btns-div" style={{ gap: '10px' }}>
                <SoftButton className="vendor-second-btn" onClick={() => setApproverModal(false)}>
                  Cancel
                </SoftButton>
                {timelineloader ? (
                  <SoftButton color="info" variant="gradient">
                    <CircularProgress
                      size={24}
                      sx={{
                        color: '#fff',
                      }}
                    />
                  </SoftButton>
                ) : (
                  <SoftButton className="vendor-add-btn" onClick={handleApproved}>
                    Save
                  </SoftButton>
                )}
              </SoftBox>
            </Box>
          </Modal>
          <Modal
            open={deleteModal}
            onClose={() => setDeleteModal(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box className="pi-approve-menu-1">
              <SoftTypography id="modal-modal-title" variant="h6" component="h2">
                Are you sure you want to delete this.
              </SoftTypography>
              <SoftSelect
                onChange={(e) => setDeleteReason(e.value)}
                options={[
                  { value: 'Dummy PO', label: 'Dummy PO' },
                  { value: 'Wrong data', label: 'Wrong data' },
                  { value: 'No longer required', label: 'No longer required' },
                  { value: 'Others', label: 'Others' },
                ]}
              />
              <SoftBox className="pi-approve-btns-div" style={{ gap: '10px' }}>
                <SoftButton className="vendor-second-btn" onClick={() => setDeleteModal(false)}>
                  Cancel
                </SoftButton>
                <SoftButton className="vendor-add-btn" onClick={handleDeleteEXPO}>
                  {deleteLoader ? <CircularProgress size={20} /> : <>Delete</>}
                </SoftButton>
              </SoftBox>
            </Box>
          </Modal>
        </SoftBox>
      </SoftBox>
      <SoftBox my={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12} ld={4} xl={4}>
            {!timelineloader ? (
              <TimelineList title="Express GRN Timeline">{renderTimelineItems}</TimelineList>
            ) : (
              <Spinner />
            )}
          </Grid>

          <Grid item xs={12} md={12} lg={10} xl={8}>
            <Grid container spacing={3}>
              <Grid item xs={12} lg={4}>
                <SoftBox mb={3}>
                  <AnimatedStatisticsCard
                    title="Total Amount"
                    count={`${data?.grossAmount ? '₹' + data?.grossAmount : 'NA'}`}
                    percentage={{
                      color: 'dark',
                      label: `${dateFormatter(data?.createdOn)}`,
                    }}
                    action={{
                      type: 'internal',
                      route: '',
                      label: `${data?.status ? data?.status : 'In Progress'}`,
                    }}
                  />
                  <SoftTypography style={{ mt: '10px' }} className="bills-details-typo">
                    {' '}
                    Created by {createdBy}
                  </SoftTypography>
                </SoftBox>
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <SoftBox
                  mb={3}
                  style={{ cursor: data?.poRefId ? 'pointer' : null }}
                  onClick={() => {
                    data?.poRefId ? navigate(`/purchase/purchase-orders/details/${data?.poRefId}`) : null;
                  }}
                >
                  <MiniStatisticsCard
                    title={{ fontWeight: 'light', text: 'PO ID' }}
                    count={data?.poRefId !== null ? data?.poRefId : 'NA'}
                    icon={{ color: 'dark', component: 'public' }}
                    direction="left"
                  />
                </SoftBox>

                <SoftBox
                  mb={3}
                  style={{ cursor: data?.inwardRefId ? 'pointer' : null }}
                  onClick={() => {
                    data?.inwardRefId ? navigate(`/products/inwarddetails/${data?.inwardRefId}`) : null;
                  }}
                >
                  <MiniStatisticsCard
                    title={{ fontWeight: 'light', text: 'Inward Id' }}
                    count={data?.inwardRefId !== null ? data?.inwardRefId : 'NA'}
                    icon={{ color: 'dark', component: 'public' }}
                    direction="left"
                  />
                </SoftBox>
                <SoftBox
                  mb={3}
                  style={{ cursor: data?.putAwayRefId ? 'pointer' : null }}
                  onClick={() => {
                    data?.putAwayRefId ? handlePutAway(data?.putAwayRefId, data?.poRefId) : null;
                  }}
                >
                  <MiniStatisticsCard
                    title={{ fontWeight: 'light', text: 'Putaway ID' }}
                    count={data?.putAwayRefId !== null ? data?.putAwayRefId : 'NA'}
                    icon={{ color: 'dark', component: 'public' }}
                    direction="left"
                  />
                </SoftBox>
                <SoftBox
                  mb={3}
                  style={{ cursor: data?.vendorId ? 'pointer' : null }}
                  onClick={() => {
                    data?.vendorId ? navigate(`/purchase/vendors/details/${data?.vendorId}`) : null;
                  }}
                >
                  <MiniStatisticsCard
                    title={{ fontWeight: 'light', text: 'Vendor ID' }}
                    count={data?.vendorId}
                    icon={{ color: 'dark', component: 'public' }}
                    direction="left"
                  />
                </SoftBox>
                <SoftBox mb={3}>
                  <MiniStatisticsCard
                    title={{ fontWeight: 'light', text: 'Approver' }}
                    count={assignedTo || ''}
                    icon={{ color: 'dark', component: <PersonIcon /> }}
                    direction="left"
                  />
                </SoftBox>
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <SoftBox mb={3}>
                  <SoftBox mb={3}>
                    <MiniStatisticsCard
                      title={{ fontWeight: 'light', text: 'PO Status' }}
                      count={data?.poStatus !== null ? capitalizeFirstLetterOfWords(data?.poStatus || '') : 'NA'}
                      icon={{ color: 'dark', component: 'emoji_events' }}
                      direction="left"
                    />
                  </SoftBox>
                  <MiniStatisticsCard
                    title={{ fontWeight: 'light', text: 'Inward Status' }}
                    count={data?.inwardStatus !== null ? capitalizeFirstLetterOfWords(data?.inwardStatus || '') : 'NA'}
                    icon={{ color: 'dark', component: 'emoji_events' }}
                    direction="left"
                  />
                </SoftBox>

                <SoftBox mb={3}>
                  <MiniStatisticsCard
                    title={{ fontWeight: 'light', text: 'Putaway Status' }}
                    count={
                      data?.putAwayStatus !== null ? capitalizeFirstLetterOfWords(data?.putAwayStatus || '') : 'NA'
                    }
                    icon={{ color: 'dark', component: 'emoji_events' }}
                    direction="left"
                  />
                </SoftBox>
                <SoftBox mb={3}>
                  <MiniStatisticsCard
                    title={{ color: 'info', fontWeight: 'light', text: 'Vendor Name' }}
                    count={capitalizeFirstLetterOfWords(data?.vendorName || '')}
                    icon={{ color: 'dark', component: <PersonIcon /> }}
                    direction="left"
                  />
                </SoftBox>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} md={12} lg={9}>
            <SoftBox className="items-quan-box">
              <SoftTypography className="bills-details-typo">
                List of Products Ordered (Total No: {itemData?.length})
              </SoftTypography>
              <SoftBox>
                <SoftBox
                  style={{ height: rowData?.length < 10 ? 375 : 680, width: '100%' }}
                  className="dat-grid-table-box"
                >
                  <DataGrid
                    // autoHeight
                    columns={columns}
                    rows={rowData || []}
                    // rowCount={parseInt(pageState.total)}
                    // loading={pageState.loader}
                    pagination
                    // page={pageState.page - 1}
                    // pageSize={pageState.pageSize}
                    autoPageSize
                    rowsPerPageOptions={[20]}
                    getRowId={(row) => row?.id || row?.offerId}
                    disableSelectionOnClick
                  />

                  {/* <DataGrid
autoHeight
columns={columns}
rows={rowData || []}
// rowCount={parseInt(pageState.total)}
// loading={pageState.loader}
pagination
// page={pageState.page - 1}
// pageSize={pageState.pageSize}
rowsPerPageOptions={[10]}
getRowId={(row) => row?.id || uuidv4()}
/> */}
                </SoftBox>
              </SoftBox>
              {/* <table>
                  <thead className="tr-tet">
                    <tr style={{border: '1px solid #ebebeb'}}>
                      <th className="th-text">Item</th>
                      <th className="th-text">Unit Price</th>
                      <th className="th-text">Specification</th>
                      <th className="th-text">PO Ordered</th>
                      <th className="th-text">Purchase Price</th>
                      <th className="th-text">Tax</th>
                      <th className="th-text">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="jio">
                    {itemData.map((e) => {
                      return (
                        <>
                          <tr>
                            <td className="tdd-text">
                              <SoftBox className="gold">
                                {e.offerType || e.purchasePrice === 0 ? (
                                  <span
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'flex-start',
                                    }}
                                  >
                                    <Tooltip title={e.itemNo}>
                                      <InfoOutlinedIcon
                                        color="info"
                                        sx={{
                                          marginRight: '5px',
                                        }}
                                      />
                                    </Tooltip>
                                    <span
                                      style={{
                                        whiteSpace: 'nowrap',
                                        maxWidth: '200px',
                                        overflow: 'hidden',
                                        cursor: 'pointer',
                                      }}
                                      onClick={() => navigate(`/products/all-products/details/${e.itemNo}`)}
                                    >
                                      <Tooltip title={e.itemName} placement="bottom">
                                        {e.itemName}
                                      </Tooltip>
                                    </span>
                                    <Tooltip title={e.offerType || 'FREE PRODUCTS'}>
                                      <LocalOfferIcon
                                        color="success"
                                        sx={{
                                          marginLeft: '10px',
                                        }}
                                      />
                                    </Tooltip>
                                  </span>
                                ) : (
                                  <span
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'flex-start',
                                    }}
                                  >
                                    <Tooltip title={e.itemNo} placement="bottom-start">
                                      <InfoOutlinedIcon
                                        color="info"
                                        sx={{
                                          marginRight: '5px',
                                        }}
                                      />
                                    </Tooltip>
                                    <span
                                      style={{
                                        whiteSpace: 'nowrap',
                                        maxWidth: '200px',
                                        overflow: 'hidden',
                                        cursor: 'pointer',
                                      }}
                                      onClick={() => navigate(`/products/all-products/details/${e.itemNo}`)}
                                    >
                                      <Tooltip title={e.itemName}>{e.itemName}</Tooltip>
                                    </span>
                                  </span>
                                )}
                              </SoftBox>
                            </td>
                            <td>
                              <SoftBox className="gold">{e.unitPrice || 0}</SoftBox>
                            </td>
                            <td>
                              <SoftBox className="gold">{e.specification || 0}</SoftBox>
                            </td>
                            <td>
                              <SoftBox className="gold">{e.quantityOrdered || e.quantity}</SoftBox>
                            </td>
                            <td>
                              <SoftBox className="gold">{e.purchasePrice || 0}</SoftBox>
                            </td>
                            <td>
                              <SoftBox className="gold">{e.gstValue || 0}</SoftBox>
                            </td>
                            <td>
                              <SoftBox className="gold" style={{  }}>
                                {e.finalPrice || 0}
                              </SoftBox>
                            </td>
                          </tr>
                        </>
                      );
                    })}
                  </tbody>
                </table> */}
              {/* <SoftBox style={{ height: 200, width: '100%' }} className="dat-grid-table-box">
                  <DataGrid
                    rows={rowData}
                    columns={columns}
                    getRowId={(row) => row.itemNo}
                    pageSize={5} // set the number of rows per page
                    rowsPerPageOptions={[5]} // provide only the desired number of rows per page
                    paginationMode="server"
                    onCellClick={(params) => navigate(`/products/all-products/details/${params.row.itemNo}`)}
                  />
                </SoftBox> */}
            </SoftBox>
          </Grid>

          <Grid item xs={12} md={12} lg={3}>
            <SoftBox className="items-quan-box">
              <SoftTypography className="bills-details-typo">Billing Details</SoftTypography>
              <SoftBox className="add-po-bill-details-box" style={{ marginTop: '10px' }}>
                <SoftBox display="flex" justifyContent="space-between" p={3}>
                  <SoftBox style={{ width: '50%' }}>
                    <SoftTypography fontSize="12px" p="2px">
                      Discount
                    </SoftTypography>
                    <SoftTypography fontSize="12px" p="2px">
                      Sub Total
                    </SoftTypography>
                    <SoftTypography fontSize="12px" p="2px">
                      Vendor Credit
                    </SoftTypography>
                    <SoftTypography fontSize="12px" p="2px">
                      CESS
                    </SoftTypography>
                    <SoftTypography fontSize="12px" p="2px">
                      CGST
                    </SoftTypography>
                    <SoftTypography fontSize="12px" p="2px">
                      SGST
                    </SoftTypography>
                    <SoftTypography fontSize="12px" p="2px">
                      IGST
                    </SoftTypography>
                    <SoftTypography fontSize="15px" fontWeight="bold">
                      Total
                    </SoftTypography>
                    <SoftTypography fontSize="12px" p="2px">
                      Round Off
                    </SoftTypography>
                  </SoftBox>
                  <SoftBox style={{ width: '40%' }}>
                    <SoftTypography fontSize="12px" p="2px">
                      {data?.totalDiscountValue || 0}
                    </SoftTypography>
                    <SoftTypography fontSize="12px" p="2px">
                      {data?.taxableValue || 0}
                    </SoftTypography>
                    <SoftTypography fontSize="12px" p="2px">
                      {data?.creditAmountUsed || 0}
                    </SoftTypography>
                    <SoftTypography fontSize="12px" p="2px">
                      {data?.cess || 0}
                    </SoftTypography>
                    <SoftTypography fontSize="12px" p="2px">
                      {data?.cgstValue || 0}
                    </SoftTypography>
                    <SoftTypography fontSize="12px" p="2px">
                      {data?.sgstValue || 0}
                    </SoftTypography>
                    <SoftTypography fontSize="12px" p="2px">
                      {data?.igstValue || 0}
                    </SoftTypography>
                    <SoftTypography fontSize="15px" fontWeight="bold">
                      {' '}
                      {data?.grossAmount || 0}
                    </SoftTypography>
                    <SoftTypography fontSize="12px" p="2px">
                      {data?.roundedOff || 0}
                    </SoftTypography>
                  </SoftBox>
                </SoftBox>
              </SoftBox>
            </SoftBox>
          </Grid>

          {/* <Grid item xs={12}>
              <SoftBox className="comment-box-pi">
                <SoftTypography className="comment-text-pi">
                  Comments -- {data?.comments ? data?.comments : 'No Comments'}{' '}
                </SoftTypography>
              </SoftBox>
            </Grid> */}
        </Grid>
      </SoftBox>
    </DashboardLayout>
  );
};

export default PurchaseExclusiveDetails;
