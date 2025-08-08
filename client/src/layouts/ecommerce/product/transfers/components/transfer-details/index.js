import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import EditIcon from '@mui/icons-material/Edit';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Box, Card, CardContent, Divider, Grid, Modal, Tooltip, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SoftBox from '../../../../../../components/SoftBox';
import SoftButton from '../../../../../../components/SoftButton';
import SoftTypography from '../../../../../../components/SoftTypography';
import Spinner from '../../../../../../components/Spinner';
import {
  changeStatusSTN,
  detailsStockTransfer,
  getlocationNameByLocId,
  stnTimeline,
} from '../../../../../../config/Services';
import AnimatedStatisticsCard from '../../../../../../examples/Cards/StatisticsCards/AnimatedStatisticsCard';
import MiniStatisticsCard from '../../../../../../examples/Cards/StatisticsCards/MiniStatisticsCard';
import DashboardLayout from '../../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../../examples/Navbars/DashboardNavbar';
import MobileNavbar from '../../../../../../examples/Navbars/MobileNavbar/mobile-navbar-drawer';
import TimelineList from '../../../../../../examples/Timeline/TimelineList';
import { useSnackbar } from '../../../../../../hooks/SnackbarProvider';
import { isSmallScreen, productIdByBarcode, textFormatter } from '../../../../Common/CommonFunction';
import { buttonStyles } from '../../../../Common/buttonColor';
import TimelineSTN from './TimelineStn';
import TransferProductCard from './product-card';
import './transferDetails.css';

const TransferDetails = () => {
  const { stn } = useParams();
  const navigate = useNavigate();
  const isMobileDevice = isSmallScreen();
  const showSnackbar = useSnackbar();
  const [data, setData] = useState({});
  const [itemData, setItemData] = useState([]);
  const [approverModal, setApproverModal] = useState(false);
  const [approveloader, setApproveloader] = useState(false);
  const [sourceApproval, setSourceApproval] = useState(false);
  const [shipped, setShipped] = useState(false);
  const [shipLoader, setShipLoader] = useState(false);
  const [received, setReceived] = useState(false);
  const [receiveLoader, setReceiveLoader] = useState(false);
  const [locIdDetails, setLocIdDetails] = useState([]);
  const [timelineloader, setTimelineloader] = useState(false);
  const [datRows, setTableRows] = useState([]);
  const [rowData, setRowData] = useState([]);

  const user_details = JSON.parse(localStorage.getItem('user_details'));
  const uidx = user_details.uidx;
  const userName = localStorage.getItem('user_name');
  const locId = localStorage.getItem('locId');

  useEffect(() => {
    stnDetails();
  }, []);

  const stnDetails = () => {
    detailsStockTransfer(stn)
      .then((res) => {
        if (res?.data?.data?.es === 0) {
          const response = res?.data?.data?.stockTransfer;
          setData(response);
          handleLocNameById(response?.sourceLocationId, response.destinationLocationId);
          setItemData(response?.stockTransferItemList);
          if (response.status === 'PENDING_APPROVAL_1' && response.sourceLocationId === locId) {
            setSourceApproval(true);
          } else if (response.status === 'PENDING_APPROVAL_2' && response.destinationLocationId === locId) {
            setSourceApproval(true);
          } else if (response.status === 'APPROVED' && response.sourceLocationId === locId) {
            setSourceApproval(false);
            setShipped(true);
          } else if (response.status === 'SHIPPED' && response.destinationLocationId === locId) {
            setShipped(false);
            setReceived(true);
          } else {
            setSourceApproval(false);
            setShipped(false);
            setReceived(false);
          }
        } else if (res?.data?.data?.es === 1) {
          showSnackbar(res?.data?.data?.message, 'error');
        }
      })
      .catch((err) => {
        showSnackbar(err?.response?.data?.message, 'error');
      });
  };

  useEffect(() => {
    stockTimeline();
  }, [approveloader, shipLoader, receiveLoader]);

  const handleApprove = () => {
    setApproverModal(true);
  };

  const handleEdit = () => {
    localStorage.setItem('stnNumber', stn);
    navigate(`/products/new-transfers/${stn}`);
  };

  const handleCloseModal = () => {
    setApproverModal(false);
  };

  const payload = {
    stnNumber: stn,
    status: 'APPROVED',
    comments: 'string',
    updatedBy: uidx,
    userName: userName,
    locId: locId,
  };
  const handleApproved = () => {
    setApproveloader(true);
    payload.status = 'APPROVED';
    changStatus();
  };
  const handleShipped = () => {
    setShipLoader(true);
    payload.status = 'SHIPPED';
    changStatus();
  };
  const handleReceived = () => {
    setReceiveLoader(true);
    payload.status = 'RECEIVED';
    changStatus();
    showSnackbar('Process has started, please do not hit receive button again', 'warning');
  };

  const changStatus = () => {
    changeStatusSTN(payload)
      .then((res) => {
        if (res?.data?.data?.es === 1) {
          showSnackbar(res?.data?.data?.message, 'error');
          setApproveloader(false);
          setShipLoader(false);
          setReceiveLoader(false);
        } else if (res?.data?.data?.es === 0) {
          handleCloseModal();
          setApproveloader(false);
          setShipLoader(false);
          setReceiveLoader(false);
          showSnackbar(res?.data?.data?.message, 'success');
          stnDetails();
          setSourceApproval(false);
        }
      })
      .catch((err) => {
        handleCloseModal();
        showSnackbar(err?.response?.data?.message, 'error');
        setApproverModal(false);
        setApproveloader(false);
        setShipLoader(false);
        setReceiveLoader(false);
      });
  };

  const stockTimeline = () => {
    setTimelineloader(true);
    stnTimeline(stn)
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
        showSnackbar(err?.response?.data?.message, 'error');
      });
  };

  const renderTimelineItems = datRows.map(({ logType, status, updatedOn, updatedBy, docId }) => (
    <TimelineSTN
      key={updatedOn}
      updatedOn={updatedOn}
      updatedBy={updatedBy}
      status={status}
      docId={docId}
      logType={logType}
      color={
        status == 'Created'
          ? 'info'
          : status == 'Pending approval 1'
          ? 'warning'
          : status == 'Pending approval 2'
          ? 'warning'
          : status == 'Source approved'
          ? 'success'
          : status === 'Approved'
          ? 'success'
          : status === 'Shipped'
          ? 'success'
          : status === 'Received'
          ? 'info'
          : 'error'
      }
      icon="archive"
    />
  ));

  const columns = [
    {
      field: 'info',
      headerName: '',
      minWidth: 20,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
      renderCell: (params) => (
        <Tooltip title={`${params?.row?.itemCode}`} arrow>
          <InfoOutlinedIcon
            color="info"
            sx={{
              marginRight: '5px',
              pointer: 'cursor',
            }}
          />
        </Tooltip>
      ),
    },
    {
      field: 'item',
      headerName: 'Item',
      minWidth: 100,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'UnitPrice',
      headerName: 'Unit Price',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      minWidth: 80,
      flex: 1,
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'TransferUnits',
      headerName: 'Transfer Units',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      flex: 1,
      minWidth: 80,
      cellClassName: 'datagrid-rows',
      align: 'center',
    },

    {
      field: 'PurchasePrice',
      headerName: 'Purchase Price',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      flex: 1,
      minWidth: 80,
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'Amount',
      headerName: 'Amount',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      flex: 1,
      minWidth: 80,
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'BatchNumber',
      headerName: 'Batch Number',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      flex: 1,
      minWidth: 80,
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
  ];

  useEffect(() => {
    const updatedRow = itemData.map((e) => {
      return {
        id: e?.id,
        item: textFormatter(e?.itemName),
        itemCode: e?.itemNo,
        UnitPrice: e?.unitPrice || 0,
        TransferUnits: e?.quantityTransfer || e?.quantity,
        PurchasePrice: e?.purchasePrice || 0,
        Amount: e?.finalPrice || 0,
        BatchNumber: e?.batchNumber || 0,
      };
    });
    setRowData(updatedRow);
  }, [itemData]);

  const handleLocNameById = (sourceLocId, destLocId) => {
    const payload = {
      branchIds: [sourceLocId, destLocId],
    };
    getlocationNameByLocId(payload)
      .then((res) => {
        const branches = res?.data?.data?.branches;
        const result = branches?.map((item) => `${item?.displayName || ''} (${item?.branchId})`);
        setLocIdDetails(result);
      })
      .catch(() => {});
  };

  const handleProductNavigation = async (barcode) => {
    try {
      const productId = await productIdByBarcode(barcode);
      if (productId) {
        navigate(`/products/product/details/${productId}`);
      }
    } catch (error) {}
  };

  return (
    <DashboardLayout>
      {!isMobileDevice && <DashboardNavbar prevLink={true} />}
      {isMobileDevice && (
        <SoftBox className="navbar-main-div-mob-bg po-box-shadow nav-pos-mob">
          <MobileNavbar title={'Transfer Details'} />
        </SoftBox>
      )}
      <SoftBox className="bills-details-top-box">
        <SoftBox className="bills-details-inner-left-box">
          <SoftTypography fontSize="16px">
            STN No: <b> {stn}</b>
          </SoftTypography>
        </SoftBox>
        {sourceApproval && (
          <>
            <SoftBox className={`bills-details-inner-right-box ${isMobileDevice && 'approve-btn-transfer'}`}>
              <Box display="flex" gap="10px">
                {data?.status === 'PENDING_APPROVAL_1' && (
                  <SoftButton
                    cvariant={buttonStyles.primaryVariant}
                    className="contained-softbutton vendor-add-btn"
                    onClick={handleEdit}
                  >
                    <EditIcon />
                  </SoftButton>
                )}
                <SoftButton className="vendor-second-btn" onClick={handleApprove}>
                  Approve
                </SoftButton>
              </Box>
            </SoftBox>
          </>
        )}
        {shipped && (
          <>
            <SoftBox className="bills-details-inner-right-box">
              <Box display="flex" gap="10px">
                <SoftButton className="vendor-second-btn" onClick={handleShipped} disabled={shipLoader ? true : false}>
                  {shipLoader ? <Spinner size={20} /> : <> Start Shipment</>}
                </SoftButton>
              </Box>
            </SoftBox>
          </>
        )}
        {received && (
          <>
            <SoftBox className="bills-details-inner-right-box">
              <Box display="flex" gap="10px">
                <SoftButton
                  className="vendor-second-btn"
                  onClick={handleReceived}
                  disabled={receiveLoader ? true : false}
                >
                  {receiveLoader ? <Spinner size={20} /> : <> Received</>}
                </SoftButton>
              </Box>
            </SoftBox>
          </>
        )}
        <Modal
          open={approverModal}
          onClose={handleCloseModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box className="pi-approve-menu">
            <SoftTypography id="modal-modal-title" variant="h6" component="h2">
              Are you sure you want to approve this.
            </SoftTypography>
            <SoftBox className="pi-approve-btns-div" style={{ gap: '10px' }}>
              <SoftButton className="vendor-second-btn" onClick={handleCloseModal}>
                Cancel
              </SoftButton>
              <SoftButton className="vendor-add-btn" onClick={handleApproved} disabled={approveloader ? true : false}>
                Save
              </SoftButton>
            </SoftBox>
          </Box>
        </Modal>
      </SoftBox>
      {isMobileDevice && (
        <SoftBox className="pi-details-prdt-main-div po-box-shadow" mt={3}>
          <Typography fontSize="1rem" fontWeight={500} mb={2}>
            Product Details
          </Typography>
          <SoftBox>
            {itemData.map((item, index) => (
              <TransferProductCard data={item} index={index} length={itemData?.length} />
            ))}
          </SoftBox>
        </SoftBox>
      )}
      <SoftBox my={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12} ld={4} xl={4}>
            {/* {!timelineloader ? ( */}
            <TimelineList title="Stock Transfer Timeline">{renderTimelineItems}</TimelineList>
            {/* ) : (
                <Spinner />
              )} */}
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
                      label: `${data?.createdOn}`,
                    }}
                    action={{
                      type: 'internal',
                      route: '',
                      label: `${data?.status ? data?.status : 'In Progress'}`,
                    }}
                  />
                  <SoftTypography sx={{ marginTop: '10px' }} className="bills-details-typo">
                    {' '}
                    Created by {data?.userCreated}
                  </SoftTypography>
                </SoftBox>
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <SoftBox mb={3}>
                  <MiniStatisticsCard
                    title={{ fontWeight: 'light', text: 'Source Location Id' }}
                    count={locIdDetails[0] ? locIdDetails[0] : data?.sourceLocationId}
                    icon={{ color: 'dark', component: <LocationOnIcon /> }}
                    direction="left"
                    countStyle={{ fontSize: '0.8rem' }}
                  />
                </SoftBox>
                <SoftBox mb={3}>
                  <MiniStatisticsCard
                    title={{ fontWeight: 'light', text: 'Payment Mode' }}
                    count={data?.paymentMode}
                    icon={{ color: 'dark', component: <CurrencyRupeeIcon /> }}
                    direction="left"
                  />
                </SoftBox>
                <SoftBox mb={!isMobileDevice ? 3 : 1}>
                  <Card className={`${isMobileDevice && 'po-box-shadow'}`}>
                    {/* <CardHeader title="Origin Address" /> */}
                    <CardContent sx={{ padding: '16px !important' }}>
                      <SoftTypography variant="h6" fontWeight="bold">
                        Origin Address
                      </SoftTypography>
                      <SoftBox width="100%" display="flex" flexDirection="column" lineHeight={1} mt={1}>
                        <SoftBox lineHeight={0}>
                          <SoftTypography variant="caption" fontWeight="medium" textTransform="capitalize">
                            {data?.sourceLocationAddress}
                          </SoftTypography>
                        </SoftBox>
                      </SoftBox>
                    </CardContent>
                  </Card>
                </SoftBox>
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <SoftBox mb={3}>
                  <MiniStatisticsCard
                    title={{ fontWeight: 'light', text: 'Destination Location Id' }}
                    count={locIdDetails[1] ? locIdDetails[1] : data?.destinationLocationId}
                    icon={{ color: 'dark', component: <LocationOnIcon /> }}
                    direction="left"
                    countStyle={{ fontSize: '0.8rem' }}
                  />
                </SoftBox>
                <SoftBox mb={3}>
                  <MiniStatisticsCard
                    title={{ fontWeight: 'light', text: 'Status' }}
                    count={data?.status}
                    icon={{ color: 'dark', component: 'local_atm' }}
                    direction="left"
                  />
                </SoftBox>
                <SoftBox
                  mb={3}
                  mt={
                    data?.paymentMode === 'Cheque' ||
                    data?.paymentMode === 'Cash' ||
                    data?.status !== 'ACCEPTED' ||
                    data?.status !== 'SHIPPED' ||
                    data?.status !== 'RECEIVED'
                      ? 0
                      : 6
                  }
                >
                  <Card className={`${isMobileDevice && 'po-box-shadow'}`}>
                    {/* <CardHeader title="Destination Address" /> */}
                    <CardContent sx={{ padding: '16px !important' }}>
                      <SoftTypography variant="h6" fontWeight="bold">
                        Destination Address
                      </SoftTypography>
                      <SoftBox width="100%" display="flex" flexDirection="column" lineHeight={1} mt={1}>
                        <SoftBox lineHeight={0}>
                          <SoftTypography variant="caption" fontWeight="medium" textTransform="capitalize">
                            {data?.destinationLocationAddress}
                          </SoftTypography>
                        </SoftBox>
                      </SoftBox>
                    </CardContent>
                  </Card>
                </SoftBox>
              </Grid>
            </Grid>
            {!isMobileDevice && (
              <Grid item xs={12} mb={2}>
                <SoftBox className="items-quan-box">
                  <SoftTypography className="bills-details-typo">
                    List of Products Ordered (Total No: {itemData?.length})
                  </SoftTypography>
                  {/* <table>
                    <thead className="tr-tet">
                      <tr>
                        <th className="th-text">Item</th>
                        <th className="th-text">Unit Price</th>
                        <th className="th-text">Transfer Units</th>
                        <th className="th-text">Purchase Price</th>
                        <th className="th-text">Amount</th>
                        <th className="th-text">Batch Number</th>
                      </tr>
                    </thead>
                    <tbody className="jio">
                      {itemData?.map((e) => {
                        return (
                          <>
                            <tr>
                              <td className="tdd-text">
                                <SoftBox className="gold">
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
                                      <Tooltip title={textFormatter(e.itemName)}>{textFormatter(e.itemName)}</Tooltip>
                                    </span>
                                  </span>
                                </SoftBox>
                              </td>
                              <td>
                                <SoftBox className="gold">{e.unitPrice || 0}</SoftBox>
                              </td>
                              <td>
                                <SoftBox className="gold">{e.quantityTransfer || e.quantity}</SoftBox>
                              </td>
                              <td>
                                <SoftBox className="gold">{e.purchasePrice || 0}</SoftBox>
                              </td>
                              <td>
                                <SoftBox className="gold" style={{ marginLeft: '5px' }}>
                                  {e.finalPrice || 0}
                                </SoftBox>
                              </td>
                              <td>
                                <SoftBox className="gold">{e.batchNumber || 0}</SoftBox>
                              </td>
                            </tr>
                          </>
                        );
                      })}
                    </tbody>
                  </table> */}
                  <SoftBox style={{ height: 200 }} className="dat-grid-table-box">
                    <DataGrid
                      rows={rowData}
                      columns={columns}
                      getRowId={(row) => row.id}
                      pageSize={5} // set the number of rows per page
                      rowsPerPageOptions={[5]} // provide only the desired number of rows per page
                      paginationMode="server"
                      onCellClick={(params) => handleProductNavigation(params?.row?.itemCode)}
                    />
                  </SoftBox>
                </SoftBox>
              </Grid>
            )}
            <Grid item xs={12}>
              <SoftBox className={`items-quan-box ${isMobileDevice && 'transfer-billing-details po-box-shadow'}`}>
                <SoftTypography className="bills-details-typo" sx={{ marginLeft: isMobileDevice && '0px !important' }}>
                  Billing Details
                </SoftTypography>
                <SoftBox
                  className={`add-po-bill-details-box ${isMobileDevice && 'transfer-billing-div-main-wrapper'}`}
                  style={{ marginTop: '10px' }}
                >
                  <SoftBox display="flex" justifyContent="space-between" p={3}>
                    <SoftBox style={{ width: '50%' }}>
                      <SoftTypography fontSize="15px" p="2px">
                        Sub Total
                      </SoftTypography>
                      <SoftTypography fontSize="15px" p="2px">
                        CGST
                      </SoftTypography>
                      <SoftTypography fontSize="15px" p="2px">
                        SGST
                      </SoftTypography>
                      <SoftTypography fontSize="15px" p="2px">
                        IGST
                      </SoftTypography>
                    </SoftBox>
                    <SoftBox style={{ width: '40%' }}>
                      <SoftTypography fontSize="15px" p="2px" className="billing-values-end">
                        {data?.taxableValue || 0}
                      </SoftTypography>
                      <SoftTypography fontSize="15px" p="2px" className="billing-values-end">
                        {data?.cgstValue || 0}
                      </SoftTypography>
                      <SoftTypography fontSize="15px" p="2px" className="billing-values-end">
                        {data?.sgstValue || 0}
                      </SoftTypography>
                      <SoftTypography fontSize="15px" p="2px" className="billing-values-end">
                        {data?.igstValue || 0}
                      </SoftTypography>
                    </SoftBox>
                  </SoftBox>
                  <Divider sx={{ margin: '10px !important', width: '100% !important' }} />
                  <SoftBox display="flex" justifyContent="space-between" p={3}>
                    <SoftBox style={{ width: '50%' }}>
                      <SoftTypography fontSize="18px" fontWeight="bold">
                        Total
                      </SoftTypography>
                    </SoftBox>
                    <SoftBox style={{ width: '40%' }}>
                      <SoftTypography fontSize="18px" fontWeight="bold" className="billing-values-end">
                        {' '}
                        {data?.grossAmount || 0}
                      </SoftTypography>
                    </SoftBox>
                  </SoftBox>
                </SoftBox>{' '}
              </SoftBox>
            </Grid>
          </Grid>
        </Grid>
      </SoftBox>
    </DashboardLayout>
  );
};

export default TransferDetails;
