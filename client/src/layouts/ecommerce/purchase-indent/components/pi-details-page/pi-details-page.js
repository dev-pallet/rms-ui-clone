import './pi-det-card.css';
import './pi.css';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Badge,
  Button,
  Chip,
  CircularProgress,
  Tooltip,
  Typography,
  tooltipClasses,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {
  addaQuote,
  approvedpurchaserequest,
  closepurchaseIndent,
  downloadIndentpdf,
  editPurchaseIndent,
  getAllVendors,
  getPurchaseIndentDetails,
  getUserFromUidx,
  getpiagedetails,
  getrelatedpodetails,
  pidelete,
  poTimelineforPI,
  rejectpurchaserequest,
  removePIItem,
} from '../../../../../config/Services';
import { buttonStyles } from '../../../Common/buttonColor';
import { getPiTimelineDetails } from 'config/Services';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from '../../../../../hooks/SnackbarProvider';
import AddIcon from '@mui/icons-material/Add';
import AnimatedStatisticsCard from 'examples/Cards/StatisticsCards/AnimatedStatisticsCard';
import Box from '@mui/material/Box';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import EditIcon from '@mui/icons-material/Edit';
import Grid from '@mui/material/Grid';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MiniStatisticsCard from 'examples/Cards/StatisticsCards/MiniStatisticsCard';
import MobileNavbar from '../../../../../examples/Navbars/MobileNavbar/mobile-navbar-drawer';
import Modal from '@mui/material/Modal';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PiDetailsPrdtCard from './pi-det-prdt-card';
import SetInterval from '../../../setinterval';
import SoftBox from 'components/SoftBox';
import SoftButton from 'components/SoftButton';
import SoftSelect from 'components/SoftSelect';
import SoftTypography from 'components/SoftTypography';
import Spinner from '../../../../../components/Spinner';
import TimelineItem from 'layouts/ecommerce/purchase-indent/components/pi-details-page/TimelineItem/index';
import TimelineList from 'examples/Timeline/TimelineList';
import TodoList from 'layouts/ecommerce/purchase-indent/components/TodoList/index';
import UpgradePlan from '../../../../../UpgardePlan';
import crownIcon from '../../../../../assets/images/crown.svg';
// import crownIcon from '../../../../../assets/images/crown.svg';
// import UpgradePlan from '../../../../../UpgardePlan';
import PersonIcon from '@mui/icons-material/Person';
import { SplideSlide } from '@splidejs/react-splide';
import { calculateMultiplicationAndAddition, isSmallScreen, textFormatter } from '../../../Common/CommonFunction';
import { useDebounce } from 'usehooks-ts';
import CancelIcon from '@mui/icons-material/Cancel';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FlagIcon from '@mui/icons-material/Flag';
import MobileDrawerCommon from '../../../Common/MobileDrawer';
import SaveIcon from '@mui/icons-material/Save';
import SoftInput from '../../../../../components/SoftInput';
import SplideCommon from '../../../../dashboards/default/components/common-tabs-carasoul';
import styled from '@emotion/styled';

const orderImage =
  'https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1400&q=80';

export const PiDetailsPage = (status) => {
  const featureSettings = JSON.parse(localStorage.getItem('featureSettings'));
  const { piNum } = useParams();
  const showSnackbar = useSnackbar();
  const permissions = JSON.parse(localStorage.getItem('permissions'));
  const [selectedImages, setSelectedImages] = useState();
  const navigate = useNavigate();
  const [estimatedCost, setEstimatedCost] = useState();
  const [actualPiCost, setActualPiCost] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const convertPo = () => {
    function checkVendorIds(items) {
      let firstVendorId = null;
      let allEmptyOrNull = true;

      for (const item of items) {
        const vendorId = item?.vendorId;

        if (vendorId !== '' && vendorId !== null) {
          if (firstVendorId === null) {
            firstVendorId = vendorId;
          } else if (vendorId !== firstVendorId) {
            return false;
          }
          allEmptyOrNull = false;
        }
      }

      return allEmptyOrNull || firstVendorId !== null;
    }
    const isAllVendorPresent = checkVendorIds(allRespData?.purchaseIndentItems);
    if (allRespData?.piType === 'VENDOR_SPECIFIC') {
      navigate(`/purchase/purchase-orders/create-purchase-order/${piNum}/${allRespData?.vendorId}`);
    } else if (isAllVendorPresent) {
      if (allRespData?.purchaseIndentItems[0]?.vendorId === '') {
        navigate(`/purchase/purchase-orders/create-purchase-order/${piNum}`);
      } else {
        navigate(
          `/purchase/purchase-orders/create-purchase-order/${piNum}/${allRespData?.purchaseIndentItems[0]?.vendorId}`,
        );
      }
    } else {
      navigate(`/purchase/purchase-indent/convert-to-po/${piNum}`);
    }
    // navigate(`/purchase/purchase-orders/add-purchase-order/${piNum}`);
  };

  const [piAge, setPiAge] = useState('');
  const [duedate, setDuedate] = useState('');
  const [quoteURL, setQuoteURL] = useState('');
  const [approved, setApproved] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  const [quantNotZero, setQuantNotZero] = useState(false);
  const [quotesRecieved, setQuotesRecieved] = useState('');
  const [datRows, setTableRows] = useState([]);
  const [povalue, setPovalue] = useState({});
  const [posdata, setPosdata] = useState([]);
  const [itemstable, setItemstable] = useState([]);
  const [adi, setAdi] = useState(false);
  const [dele, setDele] = useState(false);
  const [rejo, setRejo] = useState(false);
  const [quote, setQuote] = useState(false);
  const [quoteAdded, setQuoteAdded] = useState(false);
  const [quoteApproved, setQuoteApproved] = useState(false);
  const [quoteRejected, setQuoteRejected] = useState(false);
  const [quoteDeleted, setQuoteDeleted] = useState(false);
  const [close, setpiclose] = useState(false);
  const [closedPiStatus, setClosedPiStatus] = useState(false);
  const [resAssign, setResAssign] = useState('');
  const [assignedTo, setAssignedTo] = useState([]);
  const [shippingMethod, setShippingMethod] = useState('');
  const [allRespData, setAllRespData] = useState({});
  const [createrUser, setCreaterUser] = useState('');
  const [shippingTerms, setShippingTerms] = useState('');
  const [approvedBy, setApprovedBy] = useState('');
  const [newapprovedBy, setnewApprovedBy] = useState('');
  // const [assignedToUser, setAssignedToUser] = useState([]);
  const [openUpgradeModal, setOpenUpgradeModal] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [rowId, setRowId] = useState('');
  const [quantChange, setQuantChange] = useState('');
  const debounceQuantChange = useDebounce(quantChange, 700);
  const [editingGtin, setEditingGtin] = useState(true);
  const [editQuantLoader, setEditQuantLoader] = useState(false);

  const [overAllFillRate, setOverallFillRate] = useState('');
  const [deleteEnabled, setDeleteEnabled] = useState(true);
  const [deleteLoader, setDeleteLoader] = useState(false);
  const [currentEdditingValue, setCurrentEditingValue] = useState('');
  const [editingLoader, setEditingLoader] = useState(false);
  const [preferredVendor, setPreferredVendor] = useState('');

  const [noVendorItem, setNoVendorItem] = useState([]);
  const [openItemSelectModal, setOpenItemSelectModal] = useState(false);
  const handleCloseItemSelectModal = () => setOpenItemSelectModal(false);

  const replenishImage =
    'https://static.vecteezy.com/system/resources/previews/017/619/097/non_2x/continuous-delivery-glyph-two-color-icon-vector.jpg';

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

  const editPiItems = ({ isDelete, deleteId }) => {
    setEditQuantLoader(true); // loader for editing mobile
    setEditingLoader(true); // loader for editing laptop

    if (debounceQuantChange !== '' || isDelete) {
      const itemData = rowData?.map((item, index) => {
        return {
          ...item,
          quantityOrdered: Number(item?.quantityOrdered) || 0,
          quantityLeft: Number(item?.quantityOrdered) || 0,
        };
      });
      let updatedRows;
      if (isDelete) {
        // delete item condition
        setDeleteLoader(true);
        updatedRows = itemData //getting the ids of the items to be deleted
          ?.filter((item, index) => {
            if (isDelete && deleteId.includes(item?.id)) {
              return item;
            }
          })
          .map((item) => item.id);
        if (itemData.length === updatedRows.length) {
          showSnackbar('Cannot delete all items', 'error');
          setDeleteLoader(false);
          setEditingLoader(false);
          setEditQuantLoader(false);
          return;
        }
        removePIItem({ itemIds: updatedRows }) //api call to delete the items
          .then((res) => {
            setDeleteLoader(false);
            setEditingLoader(false);
            setEditQuantLoader(false);
            updatedRows = itemData?.filter((item, index) => {
              if (!deleteId.includes(item?.id)) {
                return item;
              }
            });
            setRowData(updatedRows);
          })
          .catch((err) => {
            setDeleteLoader(false);
            setEditingLoader(false);
            setEditQuantLoader(false);
            showSnackbar(err?.response?.data?.message || 'Some error occured while deleting', 'error');
          });
      } else {
        updatedRows = itemData?.map((row) => {
          //updating the quantity of the items
          if (row.id === rowId) {
            return { ...row, quantityOrdered: quantChange };
          }
          return row;
        });
        const editPayload = {
          //payload for editing the items
          ...allRespData,
          tenantId: '1',
          purchaseIndentNo: piNum,
          purchaseIndentItems: updatedRows,
        };
        editPurchaseIndent(editPayload) //api call to edit the items
          .then((res) => {
            if (res?.data?.status === 'SUCCESS') {
              showSnackbar('Updated', 'success');
              getPurchaseIndentDetails(piNum).then((res) => {
                const response = res?.data?.data;
                const updatedRow = response?.purchaseIndentItems?.map((e, index) => {
                  return {
                    id: e?.id,
                    itemCode: e?.itemCode,
                    itemName: e?.itemName,
                    finalPrice: e?.finalPrice,
                    spec: e?.spec || '',
                    quantityOrdered: e?.quantityOrdered || 0,
                    quantityLeft: e?.quantityLeft || 0,
                    previousPurchasePrice: e?.previousPurchasePrice || 0,
                    preferredVendor: e?.preferredVendor || 0,
                    vendorId: e?.vendorId || 0,
                    availableStk: e?.availableStk || 0,
                    purchaseRecommendationFlag: e?.purchaseRecommendationFlag || 'NA',
                    purchaseFlagReason: e?.purchaseFlagReason || 'NA',
                    inventoryFlag: e?.inventoryFlag || 'NA',
                    salesFlag: e?.salesFlag || 'NA',
                    profitFlag: e?.profitFlag || 'NA',
                  };
                });
                setRowData(
                  updatedRow?.map((row) => ({
                    ...row,
                    // editable: row?.id === rowId, // Set editable to true for the row with id
                    editable: false, // Set editable to true for the row with id
                  })),
                );
                // setIsEditing(false)
                setEditQuantLoader(false);
                setEditingLoader(false);
              });
            }
            setQuantChange('');
            setRowId('');
          })
          .catch((err) => {
            setQuantChange('');
            setRowId('');
            showSnackbar(err?.response?.data?.message || 'Sone error occured', 'error');
          });
      }
    } else {
      setEditQuantLoader(false);
      setEditingLoader(false);
    }
  };

  useEffect(() => {
    editPiItems({ isDelete: false });
  }, [debounceQuantChange]);

  const calculatingEstimatedCost = () => {
    const quantityArray = rowData.map((item) => item?.quantityOrdered);
    const previousPurchasePrice = rowData.map((item) =>
      isNaN(Number(item?.previousPurchasePrice)) ? item?.finalPrice : Number(item?.previousPurchasePrice),
    );
    const mrpArray = rowData.map((item) => item?.finalPrice);
    setEstimatedCost(calculateMultiplicationAndAddition(quantityArray, previousPurchasePrice, mrpArray));
  };

  useEffect(() => {
    if (rowData) {
      calculatingEstimatedCost();
    }
  }, [rowData]);

  useEffect(() => {
    piTimeLineDetail();
  }, [adi, dele, rejo, quote, close, quoteApproved, quoteRejected, quoteDeleted]);

  const handleSelectionChange = (selection) => {
    if (selection.length === 0) {
      setDeleteEnabled(true);
    } else {
      setDeleteEnabled(false);
    }
    if (selection?.length > 0) {
      setSelectedRow(selection);
    } else {
      setSelectedRow(null);
    }
  };

  const handleBulkDelete = () => {
    // Handle deletion logic for selected rows
    editPiItems({ isDelete: true, deleteId: selectedRow });
  };

  const piTimeLineDetail = async () => {
    setTimelineloader(true);
    await getPiTimelineDetails(piNum)
      .then((response) => {
        if (response?.data?.data?.timelines.length === 0) {
          setTimeout(navigate('/purchase/purchase-indent'), 5000);
        } else {
          setTableRows(response?.data?.data?.timelines);
          setQuotesRecieved(response?.data?.data?.quoteReceived);
          // piInfoArrayUpdate('Quotes Recieved', response?.data?.data?.quoteReceived);
          setPiAge(response?.data?.data?.piAge);
        }
      })
      .catch((err) => {
        setTimelineloader(false);
        if (err.message === '429') {
          SetInterval(piTimeLineDetail());
        } else {
          showSnackbar('Error Occured', 'error');
        }
      });
    await poTimelineforPI(piNum)
      .then((res) => {
        setTimelineloader(false);
        setTableRows((prevArray) => [...prevArray, ...res?.data?.data?.timelines]);
      })
      .catch((err) => {
        setTimelineloader(false);
        if (err.message === '429') {
          SetInterval(piTimeLineDetail());
        } else {
          showSnackbar('Error Occured', 'error');
        }
      });
  };
  useEffect(() => {
    getpiagedetails(piNum).then((res) => {
      setDuedate(res?.data?.data?.dueDate);
      if (res?.data?.data?.status == 'APPROVED') {
        setApproved(true);
        setIsCreated(false);
      }
      if (res?.data?.data?.status == 'CREATED') {
        setIsCreated(true);
      }
      if (res?.data?.data?.status == 'CLOSED') {
        setIsCreated(false);
        setClosedPiStatus(true);
      }
    });
  }, []);

  useEffect(() => {
    getrelatedpodetails(piNum).then((res) => {
      setPovalue(res?.data?.data);
      // piInfoArrayUpdate("P.O's Created", res?.data?.data?.posCreated);
      // piInfoArrayUpdate('Vendors', res?.data?.data?.vendors);
      // piInfoArrayUpdate('P.O Value', res?.data?.data?.poValue);
      setPosdata(res.data.data.relatedPOs);
    });
  }, []);

  useEffect(() => {
    getPurchaseIndentDetails(piNum).then((res) => {
      const response = res?.data?.data;
      setAllRespData(response);
      setShippingMethod(response?.shippingMethod);
      // piInfoArrayUpdate('Shipping Method', response?.shippingMethod);
      setShippingTerms(response?.shippingTerms);
      setApprovedBy(response?.approvedBy);
      setAssignedTo(response?.assignedTo);
      setCreaterUser(response?.createdBy);
      setItemstable(response?.purchaseIndentItems);
      const filteredArray = response?.purchaseIndentItems?.filter((element) => {
        if (element.quantityOrdered === 0) {
          return true;
        }
        return false;
      });
      if (filteredArray.length !== res?.data?.data?.length) {
        setQuantNotZero(false);
      } else {
        setQuantNotZero(true);
      }
      if (response?.piType === 'VENDOR_SPECIFIC') {
        setPreferredVendor(response?.preferredVendor);
      } else {
        setPreferredVendor(response?.purchaseIndentItems[0]?.preferredVendor);
      }
    });
  }, []);

  const setAssignedToUser = [];
  let newassign = '';
  useEffect(() => {
    const fetchDataForAllKeys = () => {
      for (let i = 0; i < assignedTo.length; i++) {
        const item = assignedTo[i];
        getUserFromUidx(item.uidx)
          .then((res) => {
            setAssignedToUser[i] = ' ' + textFormatter(res?.data?.data?.firstName);
            newassign = setAssignedToUser?.toString();
            setResAssign(newassign);
            // piInfoArrayUpdate('Assigned To', newassign);
          })
          .catch((err) => {
            setResAssign(err.response.data.message);
          });
      }
    };
    fetchDataForAllKeys();
  }, [assignedTo]);

  useEffect(() => {
    approvedByUidx();
  }, [approvedBy]);

  const approvedByUidx = () => {
    getUserFromUidx(approvedBy)
      .then((res) => {
        setnewApprovedBy(res?.data?.data?.firstName);
        // piInfoArrayUpdate('Approved By', res?.data?.data?.firstName);
      })
      .catch((err) => {});
  };

  const fillRateCalculator = (data) => {
    const overallQty = data?.reduce((acc, item) => {
      return acc + item?.quantityOrdered;
    }, 0);

    const overallQtyReceived = data?.reduce((acc, item) => {
      return acc + (item?.quantityOrdered - item?.quantityLeft);
    }, 0);

    const initialFillRateValue = ((overallQtyReceived / overallQty) * 100).toString();
    const fillRate = initialFillRateValue?.replace(/(\.\d\d)\d*/, '$1') + '%';
    setOverallFillRate(fillRate === 'NaN%' ? 'NA' : fillRate);
  };

  // useEffect(() => {
  //   getItemstabledetails(piNum).then((res) => {
  //     setItemstable(res?.data?.data);
  //     const filteredArray = res?.data?.data.filter((element) => {
  //       if (element.quantityOrdered === 0) {
  //         return true;
  //       }
  //       return false;
  //     });

  //     if (filteredArray.length !== res?.data?.data?.length) {
  //       setQuantNotZero(false);
  //     } else {
  //       setQuantNotZero(true);
  //     }
  //   });
  // }, [approved]);

  const compareDates = (dateA, dateB) => {
    const parsedDateA = new Date(dateA);
    const parsedDateB = new Date(dateB);

    return parsedDateA.getTime() - parsedDateB.getTime();
  };

  datRows.sort((a, b) => {
    const { updatedOn: dateA } = a;
    const { updatedOn: dateB } = b;

    return compareDates(dateA, dateB);
  });

  const renderTimelineItems = datRows.map(({ logType, status, updatedOn, updatedBy, quoteId, view }) => {
    return (
      <TimelineItem
        key={updatedOn}
        updatedOn={updatedOn}
        updatedBy={updatedBy}
        quoteId={quoteId}
        status={status === 'Created' ? 'Pending Approval' : status}
        logType={logType}
        quoteURL={quoteURL}
        quoteAdded={quoteAdded}
        view={view}
        color={
          status == 'CREATED' ? 'info' : status == 'APPROVED' ? 'success' : status == 'Created' ? 'success' : 'error'
        }
        icon="archive"
        setQuoteApproved={setQuoteApproved}
        setQuoteRejected={setQuoteRejected}
        setQuoteDeleted={setQuoteDeleted}
      />
    );
  });

  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const [openModal1, setOpenModal1] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);
  const [openModal3, setOpenModal3] = useState(false);
  const [openModal5, setOpenModal5] = useState(false);

  const handleCloseModal1 = () => setOpenModal1(false);

  const handleApprove = () => {
    // const noVendor = [];
    // rowData?.forEach((ele) => {
    //   ele?.preferredVendor === '' ||
    //     ele?.preferredVendor === null ||
    //     (ele?.preferredVendor === 'NA' && noVendor.push(ele?.itemCode));
    // });
    // setNoVendorItem(noVendor)
    // if (isCreated && noVendor?.length > 0) {
    //   setOpenItemSelectModal(true);
    // } else {
    setOpenModal1(true);
    // }
    setAnchorEl(null);
  };

  const handleEdit = () => {
    localStorage.setItem('piNum', piNum);
    navigate(`/purchase/purchase-indent/create-purchase-indent/${piNum}`);
  };

  const handleCloseModal2 = () => setOpenModal2(false);

  const handleReject = () => {
    setOpenModal2(true);
    setAnchorEl(null);
  };

  const handleCloseModal3 = () => setOpenModal3(false);

  const handleDelete = () => {
    setOpenModal3(true);
    setAnchorEl(null);
  };

  const handleCloseModal5 = () => {
    setOpenModal5(false);
  };

  const [timelineloader, setTimelineloader] = useState(true);

  const val = localStorage.getItem('user_details');
  const object = JSON.parse(val);

  //timeline handler function

  async function handleSave() {
    setTimelineloader(true);
    const payload = {
      piNumber: piNum,
      piStatus: 'APPROVED',
      comments: 'string',
      updatedByUser: object?.uidx,
      rejectedReason: 'string',
    };

    try {
      const res = await approvedpurchaserequest(payload);
      showSnackbar('Success PI Approved', 'success');
      setAdi(!adi);
      setOpenModal1(false);
      setApproved(true);
      setIsCreated(false);
      setTimelineloader(false);
    } catch (err) {
      showSnackbar(err?.response?.data?.message, 'error');
      setOpenModal1(false);
      setTimeout(() => {
        setTimelineloader(false);
      }, []);
    }
  }

  const [reject, setRejection] = useState('');

  async function handleRejecthandler() {
    setTimelineloader(true);
    const payload = {
      piNumber: piNum,
      piStatus: 'REJECTED',
      comments: 'string',
      updatedByUser: object?.uidx,
      rejectedReason: reject,
    };
    try {
      const result = await rejectpurchaserequest(payload);
      showSnackbar('Success PI Rejected', 'success');
      setRejo(!rejo);
      setIsCreated(false);
      setOpenModal2(false);
      setTimelineloader(false);
    } catch (err) {
      showSnackbar(err?.response?.data?.message, 'error');
      setTimelineloader(false);
      setOpenModal2(false);
    }
  }

  const [rejectReason, setrejectReason] = useState('');
  const [closerejection, setcloseRejection] = useState('');

  function handleDeleteSave() {
    setTimelineloader(true);
    const payload = {
      piNumber: piNum,
      reason: rejectReason,
    };
    pidelete(payload)
      .then((res) => {
        setTimelineloader(false);
        if (res?.data?.data?.message == 'Cannot delete PI other than created state ') {
          showSnackbar(res?.data?.data?.message, 'warning');
          setOpenModal3(false);
        } else if (res?.data?.data?.message == 'deleted successfully') {
          showSnackbar('PI deleted success', 'success');
          setDele(!dele);
          // setTimeout(navigate('/purchase/purchase-indent'), 5000);
        }
      })

      .catch((err) => {
        setTimelineloader(false);
        showSnackbar(err?.response?.data?.message, 'error');
        setOpenModal3(false);
      });

    setOpenModal3(false);
  }

  // pdf download

  const [pdfDownloaderLoader, setPdfDownloaderLoader] = useState(false);

  const handleClickpdf = async () => {
    // setTimelineloader(true);
    setPdfDownloaderLoader(true);
    try {
      const response = await downloadIndentpdf(piNum);
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      setPdfDownloaderLoader(false);
      link.download = `${piNum}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      // setTimelineloader(false);
    } catch (err) {
      setTimelineerror(err.res.data.message);
      SetInterval(handleopensnack());
      setPdfDownloaderLoader(false);

      // setTimelineloader(false);
    }
  };

  //file upload add a quote
  const [vendorData, setVendorData] = useState('');
  const handleFileChange = (event) => {
    setSelectedImages(event.target.files[0]);
  };

  const handleSubmitFile = (event) => {
    setTimelineloader(true);
    const payload = {
      piNumber: piNum,
      vendorName: vendorData,
      createdBy: object?.uidx,
    };
    event.preventDefault();
    const formData = new FormData();
    formData.append('file', selectedImages);
    formData.append(
      'addQuoteRequest',
      new Blob([JSON.stringify(payload)], {
        type: 'application/json',
      }),
    );
    if (selectedImages) {
      addaQuote(formData)
        .then((res) => {
          setQuoteURL(res?.data?.data?.quoteImageUrl);
          showSnackbar('Success Quote Added', 'success');
          setQuote(!quote);
          setQuoteAdded(true);
          setTimelineloader(false);
          setOpenModal(false);
          // products / product - label;
        })
        .catch((err) => {
          showSnackbar(err?.response?.data?.message, 'error');
          setTimelineloader(false);
          setOpenModal(false);
          setQuoteAdded(true);
        });
    } else {
      showSnackbar('Upload Document', 'error');
    }
  };

  const orgId = localStorage.getItem('orgId');
  const filterObject = {
    page: 0,
    pageSize: 0,
    filterVendor: {
      searchText: '',
      startDate: '',
      endDate: '',
      locations: [],
      type: [],
      productName: [],
      productGTIN: [],
    },
  };

  const [dataRows, setTablevendorRows] = useState([]);
  let dataArrvendor,
    dataRow = [];

  useEffect(() => {
    getAllVendors(filterObject, orgId).then(function (result) {
      dataArrvendor = result.data.data;
      dataRow.push(
        dataArrvendor?.vendors?.map((row) => ({
          value: row.vendorId,
          label: row.vendorName,
        })),
      );
      setTablevendorRows(dataRow[0]);
    });
  }, []);

  const handleClickClose = () => {
    setOpenModal5(true);
  };
  const handleclosesave = async () => {
    const payload = {
      piNumber: piNum,
      piStatus: 'CLOSED',
      comments: '',
      updatedByUser: object?.uidx,
      rejectedReason: '',
      closedReason: closerejection,
    };
    try {
      const res = await closepurchaseIndent(payload);
      showSnackbar('Success PI Closed', 'success');
      setpiclose(!close);
      setOpenModal5(false);
      window.location.reload();
    } catch (err) {
      showSnackbar(err?.response?.data?.message, 'error');
      setOpenModal5(false);
    }
  };

  const isMobileDevice = isSmallScreen();
  const handleCloseUpgradeModal = () => {
    setOpenUpgradeModal(false);
  };

  const handleOpenUpgradePlan = () => {
    setOpenUpgradeModal(true);
  };

  const columns = [
    // { field: 'id', headerName: 'S.No.', flex: 1 },
    {
      field: 'itemCode',
      headerName: 'Barcode',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 150,
      flex: 1,
      cellClassName: 'datagrid-rows',
      align: 'left',
      renderCell: (params) => {
        return (
          <div>
            {params?.row?.purchaseRecommendationFlag === 'NA' ||
            params?.row?.purchaseRecommendationFlag === '' ||
            params?.row?.purchaseRecommendationFlag === '' ? (
              <div>{params?.value} </div>
            ) : (
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
                            mt={params?.row?.inventoryFlag === 'D' ? '' : 1}
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
                          <SoftTypography fontSize="14px">{params?.row?.purchaseFlagReason || 'NA'}</SoftTypography>
                          <div className={params?.row?.inventoryFlag === 'D' ? 'tooltip-flag-cat-data' : ''}>
                            {params?.row?.inventoryFlag === 'D' ? (
                              <span style={{ color: 'red', fontSize: '14px', fontWeight: 'bold' }}>Dead Stock</span>
                            ) : (
                              <>
                                <Chip
                                  color={categoryColour(params?.row?.inventoryFlag)}
                                  label={params?.row?.inventoryFlag || 'NA'}
                                />
                                {params?.row?.inventoryFlag !== 'NA' && (
                                  <Chip
                                    color={categoryColour(params?.row?.inventoryFlag)}
                                    label={getTagDescription('INVENTORY', params?.row?.inventoryFlag) || 'NA'}
                                  />
                                )}
                              </>
                            )}
                          </div>
                          <div className="tooltip-flag-cat-data">
                            <Chip
                              color={categoryColour(params?.row?.salesFlag)}
                              label={params?.row?.salesFlag || 'NA'}
                            />
                            {params?.row?.salesFlag !== 'NA' && (
                              <Chip
                                color={categoryColour(params?.row?.salesFlag)}
                                label={getTagDescription('SALES', params?.row?.salesFlag) || 'NA'}
                              />
                            )}
                          </div>
                          <div className="tooltip-flag-cat-data">
                            <Chip
                              color={categoryColour(params?.row?.profitFlag)}
                              label={params?.row?.profitFlag || 'NA'}
                            />
                            {params?.row?.profitFlag !== 'NA' && (
                              <Chip
                                color={categoryColour(params?.row?.profitFlag)}
                                label={getTagDescription('PROFIT', params?.row?.profitFlag) || 'NA'}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    }
                  >
                    <FlagIcon fontSize="small" style={{ color: '#fff', cursor: 'pointer', marginLeft: '7px' }} />
                  </FlagTooltips>
                }
                color={categoryColour(params?.row?.purchaseRecommendationFlag || 'NA')}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
              >
                <SoftBox style={{ padding: '6px', marginLeft: '5px' }}>{params?.value}</SoftBox>
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      field: 'itemName',
      headerName: 'Title',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      minWidth: 180,
      flex: 1,
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'finalPrice',
      headerName: 'MRP',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      minWidth: 50,
      flex: 1,
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'spec',
      headerName: 'UOM',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      minWidth: 50,
      flex: 1,
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'quantityLeft',
      headerName: 'Quantity Left',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      flex: 1,
      minWidth: 30,
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'previousPurchasePrice',
      headerName: 'Prev PP',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      flex: 1,
      minWidth: 30,
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'availableStk',
      headerName: 'Avail Stk',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      flex: 1,
      minWidth: 30,
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'quantityOrdered',
      headerName: 'Quantity',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      flex: 1,
      minWidth: 30,
      cellClassName: 'datagrid-rows',
      align: 'center',
      renderCell: (params) => {
        const [value, setValue] = useState(params?.row?.quantityOrdered);

        const handleInputChange = (e) => {
          setCurrentEditingValue(Number(e.target.value));
          setValue(Number(e.target.value));
          setRowId(params?.row?.id);
          // handleQuantityChange(params?.row?.id,e.target.value)
        };

        // const handleBlur = () => {
        //   const updatedRows = rowData.map((row) => {
        //     if (row.id === params.row.id) {
        //       return { ...row, quantity: value, editable: false };
        //     }
        //     return row;
        //   });
        //   setRowData(updatedRows);
        // };

        return params?.row?.editable ? (
          <SoftInput
            type="number"
            value={value}
            onChange={handleInputChange}
            // onBlur={handleBlur}
            autoFocus
          />
        ) : (
          <div>{params?.row?.quantityOrdered}</div>
        );
      },
    },
    {
      field: 'preferredVendor',
      headerName: 'Vendor',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      flex: 1,
      minWidth: 30,
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    isCreated
      ? {
          field: 'edit',
          headerName: 'Edit',
          headerClassName: 'datagrid-columns',
          headerAlign: 'center',
          flex: 1,
          minWidth: 30,
          cellClassName: 'datagrid-rows',
          align: 'center',
          renderCell: (params) => {
            return (
              <div>
                {editingLoader && params?.row?.editable ? (
                  <CircularProgress size={15} sx={{ color: '#0562fb !important' }} />
                ) : params?.row?.editable === true ? (
                  <div>
                    <SaveIcon
                      color="success"
                      style={{ cursor: 'pointer', fontSize: '20px' }}
                      onClick={() => handleSaveQty(params?.row?.id)}
                    />
                    <CancelIcon
                      color="error"
                      style={{ cursor: 'pointer', fontSize: '20px', marginLeft: '5px' }}
                      onClick={() => handleCancelQty(params?.row?.id)}
                    />
                  </div>
                ) : (
                  <EditIcon
                    color="info"
                    style={{ cursor: 'pointer', fontSize: '20px' }}
                    onClick={() => handleEditQuantity(params?.row?.id)}
                  />
                )}
              </div>
            );
          },
        }
      : null,
  ].filter(Boolean);

  const handleEditQuantity = (id) => {
    const updatedRows = rowData.map((row) => {
      return { ...row, editable: row.id === id };
    });
    setRowData(updatedRows);
  };

  const handleSaveQty = (id) => {
    setQuantChange(Number(currentEdditingValue));
  };

  const handleCancelQty = (id) => {
    const updatedRows = rowData.map((row) => {
      return { ...row, editable: false };
    });
    setRowData(updatedRows);
  };

  const handleQuantityChange = (id, value) => {
    const updatedRows = rowData?.map((row) => {
      if (row.id === id) {
        return { ...row, quantityOrdered: value };
      }
      return row;
    });
    setRowData(updatedRows);
  };

  useEffect(() => {
    const updatedRow = itemstable?.map((e, index) => {
      return {
        id: e?.id,
        itemCode: e?.itemCode,
        itemName: e?.itemName,
        finalPrice: e?.finalPrice,
        spec: e?.spec || '',
        quantityOrdered: e?.quantityOrdered || 0,
        quantityLeft: e?.quantityLeft || 0,
        previousPurchasePrice: e?.previousPurchasePrice || 0,
        preferredVendor: e?.preferredVendor || 'NA',
        vendorId: e?.vendorId || 0,
        availableStk: e?.availableStk || 0,
        purchaseRecommendationFlag: e?.purchaseRecommendationFlag || 'NA',
        purchaseFlagReason: e?.purchaseFlagReason || 'NA',
        inventoryFlag: e?.inventoryFlag || 'NA',
        salesFlag: e?.salesFlag || 'NA',
        profitFlag: e?.profitFlag || 'NA',
      };
    });
    if (itemstable) {
      fillRateCalculator(itemstable);
    }
    setRowData(updatedRow);
  }, [itemstable]);

  return (
    <DashboardLayout>
      {!isMobileDevice && <DashboardNavbar prevLink={true} />}
      {isMobileDevice && (
        <SoftBox className="navbar-main-div-mob-bg po-box-shadow nav-pos-mob">
          <MobileNavbar title={'PI Details'} prevLink={true} />
        </SoftBox>
      )}

      <SoftBox
        className={`bills-details-top-box bills-details-top-mob pi-number-position-mob ${
          isMobileDevice && 'po-box-shadow'
        }`}
      >
        <SoftBox className="pinum-main-container">
          <SoftBox className="bills-details-inner-left-box-PI">
            <SoftTypography className="bills-details-typo">
              {piNum} {''}
              <Tooltip title="Auto Replenished">
                {createrUser === 'SYSTEM' && (
                  <img src={replenishImage} alt="" style={{ width: '50px', height: '50px' }} />
                )}
              </Tooltip>
            </SoftTypography>
          </SoftBox>
          {(permissions?.RETAIL_Purchase?.WRITE ||
            permissions?.WMS_Purchase?.WRITE ||
            permissions?.VMS_Purchase?.WRITE) &&
          !closedPiStatus ? (
            <SoftBox className="bills-details-inner-right-box-pi">
              {!isMobileDevice &&
                (approved ? (
                  !quantNotZero ? (
                    <SoftBox>
                      <SoftButton
                        variant={buttonStyles.primaryVariant}
                        className="contained-softbutton"
                        onClick={() => convertPo()}
                      >
                        Convert to P.O
                      </SoftButton>
                    </SoftBox>
                  ) : (
                    <SoftBox>
                      <SoftButton disabled variant={buttonStyles.primaryVariant} className="contained-softbutton">
                        Convert to P.O
                      </SoftButton>
                    </SoftBox>
                  )
                ) : (
                  <SoftBox>
                    <SoftButton disabled variant={buttonStyles.primaryVariant} className="contained-softbutton">
                      Convert to P.O
                    </SoftButton>
                  </SoftBox>
                ))}
              {!isMobileDevice && (
                <SoftBox>
                  <SoftButton
                    className="vendor-add-btn"
                    onClick={
                      featureSettings !== null && featureSettings['QUOTE_MANAGEMENT'] == 'FALSE'
                        ? handleOpenUpgradePlan
                        : handleOpenModal
                    }
                    variant={buttonStyles.primaryVariant}
                    // onClick={handleOpenModal}
                  >
                    {featureSettings !== null && featureSettings['QUOTE_MANAGEMENT'] == 'FALSE' ? (
                      <img src={crownIcon} style={{ height: '1.5rem' }} />
                    ) : null}
                    <AddIcon />
                    Add Quote
                  </SoftButton>
                </SoftBox>
              )}

              {!isMobileDevice ? (
                <Modal
                  open={openModal}
                  onClose={handleCloseModal}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                  className="modal-pi-border"
                >
                  <Box className="pi-box-inventory">
                    <Grid container spacing={1} p={1}>
                      <SoftBox mt={2} mb={1} ml={2} lineHeight={0} display="inline-block">
                        <SoftTypography
                          component="label"
                          variant="caption"
                          fontWeight="bold"
                          textTransform="capitalize"
                        >
                          Select Vendor
                        </SoftTypography>
                      </SoftBox>
                      <Grid item xs={12} sm={12}>
                        <SoftSelect options={dataRows} onChange={(e) => setVendorData(e.value)} />
                      </Grid>

                      <SoftBox className="attach-file-box" mt={3}>
                        {selectedImages ? (
                          <SoftBox className="logo-box-org-I">
                            <img src={selectedImages} className="logo-box-org" />
                            <Grid item xs={12} md={6} xl={6}>
                              <SoftButton onClick={() => setSelectedImages('')}>
                                <EditIcon />
                              </SoftButton>
                            </Grid>
                          </SoftBox>
                        ) : (
                          <SoftBox className="add-customer-file-box-I">
                            <SoftTypography className="add-customer-file-head">Attach File(s) to Bill</SoftTypography>
                            <SoftBox className="profile-box-up">
                              <input
                                type="file"
                                name="file"
                                id="my-file"
                                className="hidden"
                                onChange={handleFileChange}
                              />
                              <label htmlFor="my-file" className="custom-file-upload-data-I-bills">
                                <SoftTypography className="upload-text-I">Upload Photo</SoftTypography>
                              </label>
                            </SoftBox>
                          </SoftBox>
                        )}
                      </SoftBox>
                      <Grid item xs={12} sm={12}>
                        <SoftBox className="header-submit-box">
                          <SoftButton className="vendor-second-btn" onClick={handleCloseModal}>
                            cancel
                          </SoftButton>
                          <SoftButton className="vendor-add-btn" onClick={handleSubmitFile}>
                            save
                          </SoftButton>
                        </SoftBox>
                      </Grid>
                    </Grid>
                  </Box>
                </Modal>
              ) : (
                <MobileDrawerCommon
                  anchor="bottom"
                  paperProps={{ height: 'auto  !important', maxHeight: '90%' }}
                  drawerOpen={openModal}
                  drawerClose={handleCloseModal}
                >
                  <Box className="pi-box-inventory" sx={{ margin: '0px', width: '100% !important' }}>
                    <Grid container spacing={1} p={1}>
                      <SoftBox mt={2} mb={1} ml={2} lineHeight={0} display="inline-block">
                        <SoftTypography
                          component="label"
                          variant="caption"
                          fontWeight="bold"
                          textTransform="capitalize"
                        >
                          Select Vendor
                        </SoftTypography>
                      </SoftBox>
                      <Grid item xs={12} sm={12}>
                        <SoftSelect options={dataRows} onChange={(e) => setVendorData(e.value)} />
                      </Grid>

                      <SoftBox className="attach-file-box" mt={3}>
                        {selectedImages ? (
                          <SoftBox className="logo-box-org-I">
                            <img src={selectedImages} className="logo-box-org" />
                            <Grid item xs={12} md={6} xl={6}>
                              <SoftButton onClick={() => setSelectedImages('')}>
                                <EditIcon />
                              </SoftButton>
                            </Grid>
                          </SoftBox>
                        ) : (
                          <SoftBox className="add-customer-file-box-I">
                            <SoftTypography className="add-customer-file-head">Attach File(s) to Bill</SoftTypography>
                            <SoftBox className="profile-box-up">
                              <input
                                type="file"
                                name="file"
                                id="my-file"
                                className="hidden"
                                onChange={handleFileChange}
                              />
                              <label htmlFor="my-file" className="custom-file-upload-data-I-bills">
                                <SoftTypography className="upload-text-I">Upload Photo</SoftTypography>
                              </label>
                            </SoftBox>
                          </SoftBox>
                        )}
                      </SoftBox>
                      <Grid item xs={12} sm={12}>
                        <SoftBox className="header-submit-box">
                          <SoftButton className="vendor-second-btn" onClick={handleCloseModal}>
                            cancel
                          </SoftButton>
                          <SoftButton className="vendor-add-btn" onClick={handleSubmitFile}>
                            save
                          </SoftButton>
                        </SoftBox>
                      </Grid>
                    </Grid>
                  </Box>
                </MobileDrawerCommon>
              )}

              <SoftBox className="st-dot-box-I" onClick={handleMenu}>
                <MoreVertIcon />
              </SoftBox>
              {/* </SoftBox> */}

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
                <MenuItem onClick={handleApprove}>Approve</MenuItem>

                {isCreated && <MenuItem onClick={handleEdit}>Edit</MenuItem>}
                <MenuItem onClick={handleReject}>Reject</MenuItem>
                {isCreated && <MenuItem onClick={handleDelete}>Delete</MenuItem>}
                {/* <MenuItem onClick={() => GoToPiForm()}>Edit</MenuItem> */}
                <MenuItem onClick={handleClickpdf}>
                  {pdfDownloaderLoader ? (
                    <CircularProgress size={18} sx={{ color: '#0562fb !important' }} />
                  ) : (
                    'Export as PDF'
                  )}
                </MenuItem>
                <MenuItem onClick={handleClickClose}>Close</MenuItem>
              </Menu>

              {!isMobileDevice ? (
                <Modal
                  open={openModal1}
                  onClose={handleCloseModal1}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box className="pi-approve-menu">
                    <SoftTypography id="modal-modal-title" variant="h6" component="h2">
                      {' '}
                      {/* <img src={crownIcon} style={{ height: '1.5rem' }} /> */}
                      Are you sure you want to approve this.
                    </SoftTypography>
                    <SoftBox className="pi-approve-btns-div" style={{ gap: '10px' }}>
                      <SoftButton className="vendor-second-btn" onClick={handleCloseModal1}>
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
                        <SoftButton className="vendor-add-btn" onClick={handleSave}>
                          Save
                        </SoftButton>
                      )}
                    </SoftBox>
                  </Box>
                </Modal>
              ) : (
                <MobileDrawerCommon
                  anchor="bottom"
                  paperProps={{ height: 'auto  !important', maxHeight: '90%' }}
                  drawerOpen={openModal1}
                  drawerClose={handleCloseModal1}
                >
                  <Box className="approve-modal-new-pi">
                    <SoftTypography id="modal-modal-title" variant="h6" component="h2">
                      Are you sure you want to approve this.
                    </SoftTypography>
                    <SoftBox className="pi-approve-btns-div-mob" style={{ gap: '10px' }}>
                      <SoftButton className="vendor-second-btn picancel-btn" onClick={handleCloseModal1}>
                        Cancel
                      </SoftButton>
                      {timelineloader ? (
                        <SoftButton color="info" variant="gradient" className="picancel-btn">
                          <CircularProgress
                            size={24}
                            sx={{
                              color: '#fff',
                            }}
                          />
                        </SoftButton>
                      ) : (
                        <SoftButton className="vendor-add-btn picancel-btn" onClick={handleSave}>
                          Save
                        </SoftButton>
                      )}
                    </SoftBox>
                  </Box>
                </MobileDrawerCommon>
              )}
              {!isMobileDevice ? (
                <Modal
                  open={openItemSelectModal}
                  onClose={handleCloseItemSelectModal}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box className="pi-approve-menu">
                    <SoftTypography id="modal-modal-title" variant="h6" component="h2">
                      Item: <b>{noVendorItem?.join(', ')}</b> are not associated with any vendor. Please add vendor for
                      further process.
                    </SoftTypography>
                    <SoftBox className="pi-approve-btns-div" style={{ gap: '10px' }}>
                      <SoftButton className="vendor-second-btn" onClick={handleCloseItemSelectModal}>
                        Cancel
                      </SoftButton>
                      <SoftButton className="vendor-add-btn" onClick={handleEdit}>
                        Save
                      </SoftButton>
                    </SoftBox>
                  </Box>
                </Modal>
              ) : (
                <MobileDrawerCommon
                  anchor="bottom"
                  paperProps={{ height: 'auto  !important', maxHeight: '90%' }}
                  drawerOpen={openItemSelectModal}
                  drawerClose={handleCloseItemSelectModal}
                >
                  <Box className="pi-approve-menu-1-mobile">
                    <SoftTypography id="modal-modal-title" className="reject-title-new-pi" variant="h6" component="h2">
                      Item: <b>{noVendorItem?.join(', ')}</b> are not associated with any vendor. Please add vendor for
                      further process.
                    </SoftTypography>
                    <SoftBox className="pi-approve-btns-div-mob" style={{ gap: '10px' }}>
                      <SoftButton className="vendor-second-btn picancel-btn" onClick={handleCloseItemSelectModal}>
                        Cancel
                      </SoftButton>
                      <SoftButton className="vendor-add-btn picancel-btn" onClick={handleEdit}>
                        Save
                      </SoftButton>
                    </SoftBox>
                  </Box>
                </MobileDrawerCommon>
              )}

              {/* close a pi */}
              {!isMobileDevice ? (
                <Modal
                  open={openModal5}
                  onClose={handleCloseModal5}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box className="pi-approve-menu-1">
                    <SoftTypography id="modal-modal-title" variant="h6" component="h2">
                      Are you sure you want to close this.
                    </SoftTypography>
                    <SoftSelect
                      defaultValue={{ value: '', label: '' }}
                      onChange={(e) => setcloseRejection(e.value)}
                      options={[
                        { value: 'Dummy PI', label: 'Dummy PI' },
                        { value: 'Surplus to requirement', label: 'Surplus to requirement' },
                        { value: 'Needs revision', label: 'Needs revision' },
                        { value: 'Shortage to requirement', label: 'Shortage to requirement' },
                        { value: 'Others', label: 'Others' },
                      ]}
                    />
                    <SoftBox className="pi-approve-btns-div" style={{ gap: '10px' }}>
                      <SoftButton className="vendor-second-btn" onClick={handleCloseModal5}>
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
                        <SoftButton className="vendor-add-btn" onClick={handleclosesave}>
                          Save
                        </SoftButton>
                      )}
                    </SoftBox>
                  </Box>
                </Modal>
              ) : (
                <MobileDrawerCommon
                  anchor="bottom"
                  paperProps={{ height: 'auto  !important', maxHeight: '90%' }}
                  drawerOpen={openModal5}
                  drawerClose={handleCloseModal5}
                  overflowHidden={true}
                >
                  <Box className="pi-approve-menu-1-mobile">
                    <SoftTypography id="modal-modal-title" className="reject-title-new-pi" variant="h6" component="h2">
                      Are you sure you want to close this.
                    </SoftTypography>
                    <SoftBox sx={{ width: '100% !important', marginBottom: '10px' }}>
                      <SoftSelect
                        defaultValue={{ value: '', label: '' }}
                        onChange={(e) => setcloseRejection(e.value)}
                        options={[
                          { value: 'Dummy PI', label: 'Dummy PI' },
                          { value: 'Surplus to requirement', label: 'Surplus to requirement' },
                          { value: 'Needs revision', label: 'Needs revision' },
                          { value: 'Shortage to requirement', label: 'Shortage to requirement' },
                          { value: 'Others', label: 'Others' },
                        ]}
                        menuPlacement="top"
                        sx={{ width: '100% !important' }}
                      />
                    </SoftBox>
                    <SoftBox className="pi-approve-btns-div-mob" style={{ gap: '10px' }}>
                      <SoftButton className="vendor-second-btn picancel-btn" onClick={handleCloseModal5}>
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
                        <SoftButton className="vendor-add-btn picancel-btn" onClick={handleclosesave}>
                          Save
                        </SoftButton>
                      )}
                    </SoftBox>
                  </Box>
                </MobileDrawerCommon>
              )}

              {!isMobileDevice ? (
                <Modal
                  open={openModal2}
                  onClose={handleCloseModal2}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box className="pi-approve-menu-1">
                    <SoftTypography id="modal-modal-title" variant="h6" component="h2">
                      Purchase indent rejected cannot be revoked. Are you sure you want to reject?
                    </SoftTypography>
                    <SoftBox>
                      <SoftTypography
                        component="label"
                        variant="caption"
                        fontWeight="bold"
                        textTransform="capitalize"
                        fontSize="13px"
                      >
                        Reason
                      </SoftTypography>
                    </SoftBox>
                    <SoftSelect
                      defaultValue={{ value: '', label: '' }}
                      onChange={(e) => setRejection(e.value)}
                      options={[
                        { value: 'Dummy PI', label: 'Dummy PI' },
                        { value: 'Surplus to requirement', label: 'Surplus to requirement' },
                        { value: 'Needs revision', label: 'Needs revision' },
                        { value: 'Others', label: 'Others' },
                      ]}
                    />
                    <SoftBox className="pi-approve-btns-div" style={{ gap: '10px' }}>
                      <SoftButton className="vendor-second-btn" onClick={handleCloseModal2}>
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
                        <SoftButton className="vendor-add-btn" onClick={handleRejecthandler}>
                          Save
                        </SoftButton>
                      )}
                    </SoftBox>
                  </Box>
                </Modal>
              ) : (
                <MobileDrawerCommon
                  anchor="bottom"
                  paperProps={{ height: 'auto  !important', maxHeight: '90%' }}
                  drawerOpen={openModal2}
                  drawerClose={handleCloseModal2}
                  overflowHidden={true}
                >
                  <Box className="pi-approve-menu-1-mobile">
                    <SoftTypography id="modal-modal-title" className="reject-title-new-pi" variant="h6" component="h2">
                      Purchase indent rejected cannot be revoked. Are you sure you want to reject?
                    </SoftTypography>
                    <SoftBox className="reason-main-div">
                      <SoftTypography
                        component="label"
                        variant="caption"
                        fontWeight="bold"
                        textTransform="capitalize"
                        fontSize="13px"
                        sx={{
                          textAlign: 'start',
                        }}
                      >
                        Reason
                      </SoftTypography>
                    </SoftBox>
                    <SoftBox sx={{ width: '100% !important', marginBottom: '10px' }}>
                      <SoftSelect
                        defaultValue={{ value: '', label: '' }}
                        onChange={(e) => setRejection(e.value)}
                        options={[
                          { value: 'Dummy PI', label: 'Dummy PI' },
                          { value: 'Surplus to requirement', label: 'Surplus to requirement' },
                          { value: 'Needs revision', label: 'Needs revision' },
                          { value: 'Others', label: 'Others' },
                        ]}
                        menuPlacement="top"
                        sx={{
                          width: '100% !important',
                        }}
                      />
                    </SoftBox>
                    <SoftBox className="pi-approve-btns-div-mob" style={{ gap: '10px' }}>
                      <SoftButton className="vendor-second-btn picancel-btn" onClick={handleCloseModal2}>
                        Cancel
                      </SoftButton>
                      {timelineloader ? (
                        <SoftButton color="info" variant="gradient" className="vendor-add-btn picancel-btn">
                          <CircularProgress
                            size={24}
                            sx={{
                              color: '#fff',
                            }}
                          />
                        </SoftButton>
                      ) : (
                        <SoftButton className="vendor-add-btn picancel-btn" onClick={handleRejecthandler}>
                          Save
                        </SoftButton>
                      )}
                    </SoftBox>
                  </Box>
                </MobileDrawerCommon>
              )}

              {!isMobileDevice ? (
                <Modal
                  open={openModal3}
                  onClose={handleCloseModal3}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box className="pi-approve-menu-1">
                    <SoftTypography id="modal-modal-title" variant="h6" component="h2">
                      Are you sure you want to delete this.
                    </SoftTypography>
                    <SoftBox>
                      <SoftTypography
                        component="label"
                        variant="caption"
                        fontWeight="bold"
                        textTransform="capitalize"
                        fontSize="13px"
                      >
                        Reason
                      </SoftTypography>
                    </SoftBox>
                    <SoftSelect
                      defaultValue={{ value: '', label: '' }}
                      onChange={(e) => setrejectReason(e.value)}
                      options={[
                        { value: 'Dummy PI', label: 'Dummy PI' },
                        { value: 'Surplus to requirement', label: 'Surplus to requirement' },
                        { value: 'Needs revision', label: 'Needs revision' },
                        { value: 'Shortage to requirement', label: 'Shortage to requirement' },
                        { value: 'Others', label: 'Others' },
                      ]}
                    />
                    <SoftBox className="pi-approve-btns-div" style={{ gap: '10px' }}>
                      <SoftButton className="vendor-second-btn" onClick={handleCloseModal3}>
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
                        <SoftButton className="vendor-add-btn" onClick={handleDeleteSave}>
                          Save
                        </SoftButton>
                      )}
                    </SoftBox>
                  </Box>
                </Modal>
              ) : (
                <MobileDrawerCommon
                  anchor="bottom"
                  paperProps={{ height: 'auto  !important', maxHeight: '90%' }}
                  drawerOpen={openModal3}
                  drawerClose={handleCloseModal3}
                  overflowHidden={true}
                >
                  <Box className="pi-approve-menu-1-mobile">
                    <SoftTypography id="modal-modal-title" className="reject-title-new-pi" variant="h6" component="h2">
                      Are you sure you want to delete this ?{' '}
                    </SoftTypography>
                    <SoftBox className="reason-main-div">
                      <SoftTypography
                        component="label"
                        variant="caption"
                        fontWeight="bold"
                        textTransform="capitalize"
                        fontSize="13px"
                        sx={{
                          textAlign: 'start',
                        }}
                      >
                        Reason
                      </SoftTypography>
                    </SoftBox>
                    <SoftBox sx={{ width: '100% !important', marginBottom: '10px' }}>
                      <SoftSelect
                        defaultValue={{ value: '', label: '' }}
                        onChange={(e) => setrejectReason(e.value)}
                        options={[
                          { value: 'Dummy PI', label: 'Dummy PI' },
                          { value: 'Surplus to requirement', label: 'Surplus to requirement' },
                          { value: 'Needs revision', label: 'Needs revision' },
                          { value: 'Shortage to requirement', label: 'Shortage to requirement' },
                          { value: 'Others', label: 'Others' },
                        ]}
                        menuPlacement="top"
                        sx={{ width: '100% !important' }}
                      />
                    </SoftBox>
                    <SoftBox className="pi-approve-btns-div-mob" style={{ gap: '10px' }}>
                      <SoftButton className="vendor-second-btn picancel-btn" onClick={handleCloseModal3}>
                        Cancel
                      </SoftButton>
                      {timelineloader ? (
                        <SoftButton color="info" variant="gradient" className="vendor-add-btn picancel-btn">
                          <CircularProgress
                            size={24}
                            sx={{
                              color: '#fff',
                            }}
                          />
                        </SoftButton>
                      ) : (
                        <SoftButton className="vendor-add-btn picancel-btn" onClick={handleDeleteSave}>
                          Save
                        </SoftButton>
                      )}
                    </SoftBox>
                  </Box>
                </MobileDrawerCommon>
              )}
            </SoftBox>
          ) : null}
        </SoftBox>
        {isMobileDevice && (
          <SoftBox className={'pi-det-button-div pi-btn-position'}>
            {(permissions?.RETAIL_Purchase?.WRITE ||
              permissions?.WMS_Purchase?.WRITE ||
              permissions?.VMS_Purchase?.WRITE) &&
            !closedPiStatus ? (
              <SoftBox className="bills-details-inner-right-box-pi">
                {approved ? (
                  !quantNotZero ? (
                    <SoftBox className="pi-det-btn-mob">
                      <SoftButton
                        variant="contained"
                        color="info"
                        className="pi-det-btn-mob no-btn-padding"
                        onClick={() => convertPo()}
                      >
                        Convert to P.O
                      </SoftButton>
                    </SoftBox>
                  ) : (
                    <SoftBox className="pi-det-btn-mob">
                      <Button disabled variant="contained" className="pi-det-btn-mob no-btn-padding">
                        Convert to P.O
                      </Button>
                    </SoftBox>
                  )
                ) : (
                  <SoftBox className="pi-det-btn-mob">
                    <Button disabled variant="contained" className="pi-det-btn-mob no-btn-padding">
                      Convert to P.O
                    </Button>
                  </SoftBox>
                )}
                <SoftBox className="pi-det-btn-mob">
                  <SoftButton
                    className="vendor-add-btn pi-det-btn-mob no-btn-padding"
                    // onClick={handleOpenModal}
                    onClick={
                      featureSettings !== null && featureSettings['QUOTE_MANAGEMENT'] == 'FALSE'
                        ? handleOpenUpgradePlan
                        : handleOpenModal
                    }
                  >
                    {featureSettings !== null && featureSettings['QUOTE_MANAGEMENT'] == 'FALSE' ? (
                      <img src={crownIcon} style={{ height: '1.5rem' }} />
                    ) : null}
                    <AddIcon />
                    Add Quote
                  </SoftButton>
                </SoftBox>
              </SoftBox>
            ) : null}
          </SoftBox>
        )}
      </SoftBox>
      {isMobileDevice && (
        <SoftBox className="pi-timeline-accord-main-div" sx={{ top: closedPiStatus ? '123px' : '167px' }}>
          <Accordion className="pi-timeline-accord">
            <AccordionSummary className="pi-timeline-accordion" expandIcon={<ExpandMoreIcon />}>
              <Typography fontSize={'12px'}>P.I Timeline</Typography>
            </AccordionSummary>
            <AccordionDetails>
              {!timelineloader ? <TimelineList title="">{renderTimelineItems}</TimelineList> : <Spinner />}
            </AccordionDetails>
          </Accordion>
        </SoftBox>
      )}

      {isMobileDevice && (
        <SoftBox
          sx={{
            width: '100%',
            height: 'auto',
            padding: '20px',
            marginTop: '15px',
            marginBottom: '15px',
            backgroundColor: 'white !important',
            borderRadius: '10px',
          }}
          className="po-box-shadow"
        >
          <SoftBox className="vendor-det-typo-div">
            <SoftTypography fontSize="13px" fontWeight="bold">
              Vendor Name:
            </SoftTypography>
            <SoftTypography fontSize="13px">{preferredVendor}</SoftTypography>
          </SoftBox>
          <SoftBox className="vendor-det-typo-div">
            <SoftTypography fontSize="13px" fontWeight="bold">
              GST:
            </SoftTypography>
            <SoftTypography fontSize="13px">NA</SoftTypography>
          </SoftBox>
          <SoftBox className="vendor-det-typo-div">
            <SoftTypography fontSize="13px" fontWeight="bold">
              Pan Number
            </SoftTypography>

            <SoftTypography fontSize="13px">NA</SoftTypography>
          </SoftBox>
        </SoftBox>
      )}
      {isMobileDevice && (
        <SoftBox
          sx={{
            width: '100%',
            height: 'auto',
            padding: '20px',

            marginBottom: '15px',
            backgroundColor: 'white !important',
            borderRadius: '10px',
          }}
          className="po-box-shadow"
        >
          <SoftBox className="vendor-det-typo-div">
            <SoftTypography fontSize="13px" fontWeight="bold">
              Outstanding Value:
            </SoftTypography>
            <SoftTypography fontSize="13px">0</SoftTypography>
          </SoftBox>
          <SoftBox className="vendor-det-typo-div">
            <SoftTypography fontSize="13px" fontWeight="bold">
              Returns:
            </SoftTypography>
            <SoftTypography fontSize="13px">0</SoftTypography>
          </SoftBox>
          <SoftBox className="vendor-det-typo-div">
            <SoftTypography fontSize="13px" fontWeight="bold">
              Credit Note:
            </SoftTypography>
            <SoftTypography fontSize="13px">0</SoftTypography>
          </SoftBox>
          <SoftBox className="vendor-det-typo-div">
            <SoftTypography fontSize="13px" fontWeight="bold">
              Debit Note:
            </SoftTypography>
            <SoftTypography fontSize="13px">0</SoftTypography>
          </SoftBox>
        </SoftBox>
      )}

      <SoftBox my={3}>
        {/* {isMobileDevice && <PiInfo piInfoArray={piInfoArray} />} */}
        {isMobileDevice && (
          // <SoftBox className="pi-details-splide po-box-shadow">
          <>
            <Typography fontSize="1rem" fontWeight={700} sx={{ marginLeft: '10px' }}>
              Purchase Indent Info
            </Typography>
            <SplideCommon title={''} showFilter={false}>
              <SplideSlide>
                <MiniStatisticsCard
                  title={{ color: 'info', fontWeight: 'medium', text: 'Quotes Recieved' }}
                  count={quotesRecieved}
                  // icon={{ color: 'dark', component: 'local_atm' }}
                  icon={{ color: 'dark', component: <CurrencyRupeeIcon /> }}
                  direction="left"
                  // piPoDetailsPage={true}
                />
              </SplideSlide>
              <SplideSlide>
                <MiniStatisticsCard
                  title={{ color: 'info', fontWeight: 'medium', text: 'Shipment Method' }}
                  count={shippingMethod}
                  icon={{ color: 'dark', component: 'public' }}
                  direction="left"
                  // piPoDetailsPage={true}
                />
              </SplideSlide>
              <SplideSlide>
                <MiniStatisticsCard
                  title={{ color: 'info', fontWeight: 'medium', text: 'Vendors' }}
                  count={povalue.vendors}
                  icon={{ color: 'dark', component: 'emoji_events' }}
                  direction="left"
                  // piPoDetailsPage={true}
                />
              </SplideSlide>
              <SplideSlide>
                <MiniStatisticsCard
                  title={{ color: 'info', fontWeight: 'medium', text: "P.O's created" }}
                  count={povalue.posCreated}
                  icon={{ color: 'dark', component: 'public' }}
                  direction="left"
                  // piPoDetailsPage={true}
                />
              </SplideSlide>
              <SplideSlide>
                <MiniStatisticsCard
                  title={{ color: 'info', fontWeight: 'medium', text: approved ? 'Approved By' : 'Pending Approval' }}
                  count={newapprovedBy}
                  icon={{ color: 'dark', component: <PersonIcon /> }}
                  direction="left"
                  // piPoDetailsPage={true}
                />
              </SplideSlide>
              {/* <SplideSlide>
                <MiniStatisticsCard
                  title={{ color: 'info', fontWeight: 'medium', text: 'Shipment Terms' }}
                  count={shippingTerms}
                  icon={{ color: 'dark', component: 'public' }}
                  direction="left"
                  // piPoDetailsPage={true}
                />
              </SplideSlide> */}
              <SplideSlide>
                <MiniStatisticsCard
                  title={{ color: 'info', fontWeight: 'medium', text: 'P.O value' }}
                  count={povalue.poValue}
                  icon={{ color: 'dark', component: 'storefront' }}
                  direction="left"
                  // piPoDetailsPage={true}
                />
              </SplideSlide>
              <SplideSlide>
                <MiniStatisticsCard
                  title={{ color: 'info', fontWeight: 'medium', text: 'Assigned To' }}
                  count={resAssign}
                  icon={{ color: 'dark', component: <PersonIcon /> }}
                  direction="left"
                  // piPoDetailsPage={true}
                />
              </SplideSlide>
            </SplideCommon>
          </>
          // </SoftBox>
        )}
        {isMobileDevice && (
          <>
            <Typography fontSize="1rem" fontWeight={700} mb={2} sx={{ marginLeft: '10px', marginTop: '20px' }}>
              Product Details
            </Typography>
            <SoftBox className="pi-details-prdt-main-div po-box-shadow">
              <SoftBox>
                {rowData?.map((item, index) => (
                  <PiDetailsPrdtCard
                    isCreated={isCreated}
                    setEditingGtin={setEditingGtin}
                    editingGtin={editingGtin}
                    data={item}
                    index={index}
                    editPiItems={editPiItems}
                    setRowId={setRowId}
                    setQuantChange={setQuantChange}
                    editQuantLoader={editQuantLoader}
                    setEditQuantLoader={setEditQuantLoader}
                    categoryColour={categoryColour}
                    getTagDescription={getTagDescription}
                  />
                ))}
              </SoftBox>
            </SoftBox>
          </>
        )}
        <Grid container spacing={isMobileDevice ? 0 : 3}>
          {!isMobileDevice && (
            <Grid item xs={12} md={12} ld={12} xl={4} lg={3}>
              {!timelineloader ? <TimelineList title="P.I Timeline">{renderTimelineItems}</TimelineList> : <Spinner />}
            </Grid>
          )}
          {/* {!isMobileDevice && ( */}
          <Grid item xs={12} md={12} lg={9} xl={8}>
            <Grid container spacing={3}>
              <Grid item xs={12} lg={4}>
                <SoftBox mb={3}>
                  <AnimatedStatisticsCard
                    isPiDetails={!!actualPiCost}
                    title="Estimated Cost"
                    title2={'Actual Cost'}
                    count={`₹${estimatedCost}`}
                    count2={`₹${actualPiCost.toFixed(2)}`}
                    // percentage={{
                    //   color: 'dark',
                    //   // label: `Due in ${duedate} days`,
                    //   // label: `${overAllFillRate}`,
                    // }}
                    action={{
                      type: 'internal',
                      route: '',
                      label: `Overall Fill Rate: ${overAllFillRate}`,
                    }}
                  />
                </SoftBox>
              </Grid>
              <>
                {!isMobileDevice && (
                  <Grid item xs={12} md={6} lg={4}>
                    <SoftBox
                      sx={{
                        width: '100%',
                        height: '120px',
                        padding: '20px',
                        marginBottom: '15px',
                        backgroundColor: 'white !important',
                        boxShadow: '0rem 1.25rem 1.6875rem 0rem rgba(0, 0, 0, 0.05)',
                        borderRadius: '10px',
                      }}
                    >
                      <SoftBox className="vendor-det-typo-div">
                        <SoftTypography fontSize="13px" fontWeight="bold">
                          Vendor Name:
                        </SoftTypography>
                        <SoftTypography fontSize="13px">{preferredVendor}</SoftTypography>
                      </SoftBox>
                      <SoftBox className="vendor-det-typo-div">
                        <SoftTypography fontSize="13px" fontWeight="bold">
                          GST:
                        </SoftTypography>
                        <SoftTypography fontSize="13px">NA</SoftTypography>
                      </SoftBox>
                      <SoftBox className="vendor-det-typo-div">
                        <SoftTypography fontSize="13px" fontWeight="bold">
                          Pan Number
                        </SoftTypography>

                        <SoftTypography fontSize="13px">NA</SoftTypography>
                      </SoftBox>
                    </SoftBox>

                    <SoftBox>
                      <SoftBox mb={3}>
                        <MiniStatisticsCard
                          title={{ color: 'info', fontWeight: 'medium', text: 'Quotes Recieved' }}
                          count={quotesRecieved}
                          // icon={{ color: 'dark', component: 'local_atm' }}
                          icon={{ color: 'dark', component: <CurrencyRupeeIcon /> }}
                          direction="left"
                        />
                      </SoftBox>
                      <SoftBox mb={3}>
                        <MiniStatisticsCard
                          title={{ color: 'info', fontWeight: 'medium', text: 'Assigned To' }}
                          count={resAssign}
                          icon={{ color: 'dark', component: <PersonIcon /> }}
                          direction="left"
                        />
                      </SoftBox>
                      <SoftBox mb={3}>
                        <MiniStatisticsCard
                          title={{ color: 'info', fontWeight: 'medium', text: 'Shipment Method' }}
                          count={shippingMethod}
                          icon={{ color: 'dark', component: 'public' }}
                          direction="left"
                        />
                      </SoftBox>
                      {/* <MiniStatisticsCard
                        title={{ color: 'info', fontWeight: 'medium', text: 'Vendors' }}
                        count={povalue.vendors}
                        icon={{ color: 'dark', component: 'emoji_events' }}
                        direction="left"
                      /> */}
                    </SoftBox>
                  </Grid>
                )}
                {!isMobileDevice && (
                  <Grid item xs={12} md={6} lg={4}>
                    <SoftBox
                      sx={{
                        width: '100%',
                        height: '120px',
                        padding: '20px',
                        marginBottom: '15px',
                        backgroundColor: 'white !important',
                        boxShadow: '0rem 1.25rem 1.6875rem 0rem rgba(0, 0, 0, 0.05)',
                        borderRadius: '10px',
                      }}
                    >
                      <SoftBox className="vendor-det-typo-div">
                        <SoftTypography fontSize="13px" fontWeight="bold">
                          Outstanding Value:
                        </SoftTypography>
                        <SoftTypography fontSize="13px">0</SoftTypography>
                      </SoftBox>
                      <SoftBox className="vendor-det-typo-div">
                        <SoftTypography fontSize="13px" fontWeight="bold">
                          Returns:
                        </SoftTypography>
                        <SoftTypography fontSize="13px">0</SoftTypography>
                      </SoftBox>
                      <SoftBox className="vendor-det-typo-div">
                        <SoftTypography fontSize="13px" fontWeight="bold">
                          Credit Note:
                        </SoftTypography>
                        <SoftTypography fontSize="13px">0</SoftTypography>
                      </SoftBox>
                      <SoftBox className="vendor-det-typo-div">
                        <SoftTypography fontSize="13px" fontWeight="bold">
                          Debit Note:
                        </SoftTypography>
                        <SoftTypography fontSize="13px">0</SoftTypography>
                      </SoftBox>
                    </SoftBox>
                    <SoftBox mb={3}>
                      <MiniStatisticsCard
                        title={{ color: 'info', fontWeight: 'medium', text: "P.O's created" }}
                        count={povalue.posCreated}
                        icon={{ color: 'dark', component: 'public' }}
                        direction="left"
                      />
                    </SoftBox>
                    <SoftBox mb={3}>
                      <MiniStatisticsCard
                        title={{
                          color: 'info',
                          fontWeight: 'medium',
                          text: approved ? 'Approved By' : 'Pending Approval',
                        }}
                        count={newapprovedBy}
                        icon={{ color: 'dark', component: <PersonIcon /> }}
                        direction="left"
                      />
                    </SoftBox>
                    {/* <SoftBox mb={3}>
                    <MiniStatisticsCard
                      title={{ color: 'info', fontWeight: 'medium', text: 'Shipment Terms' }}
                      count={shippingTerms}
                      icon={{ color: 'dark', component: 'public' }}
                      direction="left"
                    />
                  </SoftBox> */}

                    <MiniStatisticsCard
                      title={{ color: 'info', fontWeight: 'medium', text: 'P.O value' }}
                      count={povalue.poValue}
                      icon={{ color: 'dark', component: 'storefront' }}
                      direction="left"
                    />
                  </Grid>
                )}
              </>
            </Grid>
          </Grid>
          {/* )} */}

          {!isMobileDevice && (
            <Grid item xs={12} mt={2}>
              <SoftBox className="items-quan-box">
                <SoftBox className="pi-details-header">
                  <SoftTypography className="bills-details-typo">
                    List of Products Ordered (Total No: {itemstable?.length})
                  </SoftTypography>
                  {/* <table>
                    <thead>
                      <tr>
                        <th className="th-text">Item</th>
                        <th className="th-text">Specification</th>
                        <th className="th-text">Quantity</th>
                        <th className="th-text">Quantity Left</th>
                      </tr>
                    </thead>
                    {itemstable.map((e) => {
                      return (
                        <>
                          <tbody className="jio" key={e.itemCode}>
                            <tr>
                              <td className="tdd-text">
                                <SoftBox className="gold">{e.itemName}</SoftBox>
                              </td>
                              <td>
                                <SoftBox className="gold">{e.specification}</SoftBox>
                              </td>
                              <td>
                                <SoftBox className="gold">{e.quantityOrdered}</SoftBox>
                              </td>
                              <td>
                                <SoftBox className="gold">{e.quantityLeft}</SoftBox>
                              </td>
                            </tr>
                          </tbody>
                        </>
                      );
                    })}
                  </table> */}
                  {isCreated && (
                    <SoftButton
                      variant={buttonStyles.primaryVariant}
                      className="contained-softbutton"
                      disabled={deleteEnabled}
                      onClick={handleBulkDelete}
                    >
                      {deleteLoader ? <CircularProgress size={15} sx={{ color: 'white' }} /> : 'Delete'}
                    </SoftButton>
                  )}
                </SoftBox>
                <SoftBox style={{ height: 400, width: '100%' }} className="dat-grid-table-box">
                  <div style={{ height: 400, width: '100%' }}>
                    <DataGrid
                      rows={rowData}
                      columns={columns}
                      disableMultipleSelection
                      onSelectionModelChange={handleSelectionChange}
                      onRowSelectionModelChange={selectedRow ? [selectedRow] : []}
                      pagination
                      autoPageSize
                      checkboxSelection={isCreated ? true : false}
                      disableSelectionOnClick
                      disableRowSelectionOnClick
                    />
                  </div>
                </SoftBox>
              </SoftBox>
            </Grid>
          )}

          <Grid item xs={12}>
            {isMobileDevice && (
              <Typography fontSize="1rem" fontWeight={700} sx={{ marginLeft: '10px', marginBottom: '20px' }}>
                Related P.O's
              </Typography>
            )}
            <SoftBox className={`${isMobileDevice && 'po-box-shadow to-do-list'}`}>
              <TodoList actualPiCost={actualPiCost} setActualPiCost={setActualPiCost} />
            </SoftBox>
          </Grid>

          {/* {!isMobileDevice && (
              <Grid item xs={12}>
                <SoftBox className="comment-box-pi">
                  <SoftTypography className="comment-text-pi">Comments -- Hello vendors</SoftTypography>
                </SoftBox>
              </Grid>
            )} */}
        </Grid>
      </SoftBox>
      <Modal
        open={openUpgradeModal}
        onClose={handleCloseUpgradeModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            width: '60vw',
            height: '70vh',
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'center',
            margin: 'auto',
            marginTop: '6rem',
            borderRadius: '1rem',
            overflow: 'auto',
            position: 'relative',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: '-6rem',
              bottom: '3rem',
              width: '100%',
            }}
          >
            <UpgradePlan />
          </Box>
        </Box>
      </Modal>
    </DashboardLayout>
  );
};
