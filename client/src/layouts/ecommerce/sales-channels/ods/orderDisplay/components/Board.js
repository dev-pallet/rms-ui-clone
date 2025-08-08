import './Board.css';
import { Card, IconButton, Tooltip } from '@mui/material';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import {
  createShipment,
  filterCutoff,
  getAllOrdersList,
  salesPaymentRequest,
  updateOrderTimeline,
} from '../../../../../../config/Services';
import { useMemo, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../../../../../hooks/SnackbarProvider';
import AlertAudio from 'assets/audio/order-alert2.mp3';
import BoardItem from './BoardItem';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import RefreshIcon from '@mui/icons-material/Refresh';
import SkeletonLoader from './SkeletonLoader';
import SoftTypography from '../../../../../../components/SoftTypography';
import Swal from 'sweetalert2';
import moment from 'moment';

const baseArray = [
  {
    status: 'CREATED',
    data: [],
  },
  {
    status: 'PACKAGED',
    data: [],
  },
  {
    status: 'IN_TRANSIT',
    data: [],
  },
  {
    status: 'DELIVERED',
    data: [],
  },
];

const newSwal = Swal.mixin({
  customClass: {
    confirmButton: 'button ods-button-success',
    cancelButton: 'button ods-button-error',
    container: 'my-swal-container',
  },
  buttonsStyling: false,
});

// const audioUrl = "https://media.geeksforgeeks.org/wp-content/uploads/20190531135120/beep.mp3";
const audio = new Audio(AlertAudio);
audio.loop = true;

const playAudio = () => {
  audio.play();
};

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);

  const [removed] = sourceClone.splice(droppableSource.index, 1);
  destClone.splice(droppableDestination.index, 0, removed);

  return [sourceClone, destClone];
};
const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: 'none',
  margin: `0 0 ${grid}px 0`,
  borderRadius: `${grid / 2}px`,
  boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px',
  position: 'relative',
  overflow: 'hidden',

  background: isDragging ? 'lightgreen' : 'white',

  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? '#d3e2ff' : '#eeeeee',
  padding: `${grid * 2}px ${grid}px`,
  width: '100%',
  borderRadius: `${grid / 2}px`,
  overflow: 'auto',
  // maxHeight: "calc(100vh - 3.2rem)",
  maxHeight: '100%',
});

const convertToLocalTime = (time) => moment.utc(time).local().format('LT');

const Delivery = () => {
  const locId = localStorage.getItem('locId');
  const orgId = localStorage.getItem('orgId');
  const userName = localStorage.getItem('user_name');
  const retailUserDetails = JSON.parse(localStorage.getItem('retailUserDetails'));
  const sessionUidx = retailUserDetails?.uidx;
  const daySessionId = localStorage.getItem('daySessionId');
  const contextType = localStorage.getItem('contextType');
  const navigate = useNavigate();
  const [state, setState] = useState(baseArray);
  const [initialOrders, setInitialOrders] = useState([]);
  const [shouldRefresh, setShouldRefresh] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [slotList, setSlotList] = useState([]);
  const [payload, setPayload] = useState({
    locationId: locId,
    page: 0,
    pageSize: 99,
    orderType: 'B2C_ORDER',
    fulfilmentStatus: ['CREATED', 'PACKAGED', 'IN_TRANSIT', 'DELIVERED'],
    slotIds: [],
  });
  const [pageData, setPageData] = useState({
    totalResults: 0,
    totalPages: 0,
    slotIds: [],
  });
  const showSnackbar = useSnackbar();

  const dayStart = useMemo(() => moment().startOf('day').utc().format('YYYY-MM-DDTHH:mm:ss'), []);
  const dayEnd = useMemo(() => moment().endOf('day').utc().format('YYYY-MM-DDTHH:mm:ss'), []);
  // const dayStart = "2023-11-02T00:00:00";
  // const dayEnd = "2024-01-02T23:59:59";
  const formatData = (data) => {
    const arrayData = JSON.parse(JSON.stringify(baseArray));

    data.forEach((item) => {
      const status = item?.baseOrderResponse?.fulfilmentStatus;
      const index = arrayData.findIndex((el) => el?.status === status);
      arrayData[index]?.data.push({
        id: item?.baseOrderResponse?.orderId,
        loading: false,
        content: {
          ...item?.baseOrderResponse,
          ...item?.addressEntityModel,
          isAssigned: item?.orderTokenDetails?.isAssigned,
          token: item?.orderTokenDetails?.token,
          grandTotal: item?.orderBillingDetails?.grandTotal,
          paymentMethod: item?.orderBillingDetails?.paymentMethod,
        },
      });
    });
    return arrayData;
  };

  // const payload = {
  //   locationId: locId,
  //   page: currentPage - 1,
  //   pageSize: PAGE_SIZE,
  //   orderType: "B2C_ORDER",
  //   fulfilmentStatus: ["CREATED", "PACKAGED", "IN_TRANSIT", "DELIVERED"],
  //   slotIds: [selectedSlot],
  // };

  const updateOrderMutation = useMutation({
    // mutationFn: (payload) => updateOrderTimeline(payload),
    mutationFn: async (payload) => {
      setShouldRefresh(false);
      const res = await updateOrderTimeline(payload);
      if (res?.data?.code === 'ECONNRESET') {
        throw new Error(res?.data?.message);
      }
      if (res?.data?.data?.es) {
        throw new Error(res?.data?.data?.message);
      }
      return res;
    },
  });

  const recordPaymentMutation = useMutation({
    mutationFn: (payload) => salesPaymentRequest(payload),
    onSuccess: (res) => {
      if (res?.data?.data?.es) {
        showSnackbar(res?.data?.data?.message, 'error');
        return;
      }
      showSnackbar('Payment recorded', 'success');
    },
    onError: (error) => {
      showSnackbar(error?.response?.data?.message || error?.message, 'error');
    },
  });

  const createShipmentMutation = useMutation({
    // mutationFn: (payload) => createShipment(payload),
    mutationFn: async (payload) => {
      const res = await createShipment(payload);
      if (res?.data?.code === 'ECONNRESET') {
        throw new Error(res?.data?.message);
      }
      return res;
    },
    onSuccess: (res) => {
      if (res?.data?.data?.es) {
        showSnackbar(res?.data?.data?.message, 'error');
        return;
      }
      showSnackbar('Shipment created', 'success');
    },
    onError: (error) => {
      showSnackbar(error?.response?.data?.message || error?.message, 'error');
    },
  });

  const {
    isFetching: isFetchingSlot,
    isSuccess: isSuccessSlot,
    data: defaultSlots,
  } = useQuery({
    refetchOnWindowFocus: false,
    queryKey: ['slot-list'],
    queryFn: async () => {
      const payload = {
        slotStartTime: dayStart,
        slotEndTime: dayEnd,
        sourceIdList: [orgId],
        sourceLocationIdList: [locId],
        sortByStartTime: 'ASCENDING',
      };
      const response = await filterCutoff(payload);
      if (response?.data?.code === 'ECONNRESET') {
        throw new Error(response?.data?.message);
      }
      // if (response?.data?.data?.es) {
      //   throw new Error(response?.data?.data?.message);
      // }
      const slots = response?.data?.data?.results?.map((cutoffItem) => ({
        slotId: cutoffItem?.slot?.slotId,
        startTime: convertToLocalTime(cutoffItem?.slot?.startTime),
        endTime: convertToLocalTime(cutoffItem?.slot?.endTime),
        selected: false,
        createdCount: 0,
      }));
      setSlotList(slots);
      setPayload((prevPayload) => ({
        ...prevPayload,
        slotIds: slots?.map((slot) => slot?.slotId) || [],
      }));
      return slots;
    },
    onError: (error) => {
      showSnackbar(error?.response?.data?.message || error?.message, 'error');
    },
  });

  const orderListQuery = useQuery(['order-list', payload], () => getAllOrdersList(payload), {
    refetchOnWindowFocus: false,
    enabled: isSuccessSlot,
    refetchInterval: () => (shouldRefresh ? 60000 : false), // 1 min timeout
    onSuccess: (response) => {
      const data = response?.data?.data;
      const formattedData = formatData(data?.orderResponseList);
      // setState(formattedData);
      setInitialOrders(formattedData);

      const slotListClone = slotList.map((slot) => ({
        ...slot,
        createdCount: 0,
      }));

      const mutatedSlotList = slotListClone.map((slot) => {
        const matchingItems = formattedData.reduce((count, el) => {
          if (el?.status === 'CREATED' && el?.data?.some((item) => item?.content?.slotId === slot.slotId)) {
            return count + el.data.filter((item) => item?.content?.slotId === slot.slotId).length;
          }
          return count;
        }, 0);

        return {
          ...slot,
          createdCount: matchingItems,
        };
      });
      setSlotList(mutatedSlotList);

      handleSlotChange(
        formattedData,
        mutatedSlotList?.find((slot) => slot?.selected)?.slotId || mutatedSlotList[0]?.slotId,
      );
      // }

      if (
        pageData?.totalResults &&
        pageData?.totalResults < data?.totalResults &&
        pageData?.slotIds[0] === data?.slotIds[0]
      ) {
        // if (Math.random() < 0.5) {
        showSnackbar('New order placed', 'success');
        playAudio();
        newSwal.fire({
          title: 'New order placed',
          icon: 'info',
          confirmButtonText: 'OK',
          didOpen: () => {
            audio.play();
          },
          didClose: () => {
            audio.pause();
            audio.currentTime = 0;
          },
        });
      }
      setPageData({
        totalResults: data?.totalResults,
        totalPages: data?.totalPages,
        showingResults: data?.pageSize,
        slotIds: data?.slotIds,
      });
    },
    onError: (error) => {
      showSnackbar(error.message, 'error');
    },
  });

  const nextPage = () => {
    setPayload((prevPayload) => ({ ...prevPayload, page: prevPayload?.page + 1 }));
  };

  const prevPage = () => {
    setPayload((prevPayload) => ({ ...prevPayload, page: prevPayload?.page - 1 }));
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;

    const sInd = +source.droppableId;
    const dInd = +destination.droppableId;

    if (!destination) {
      return;
    }

    if (dInd < sInd) {
      showSnackbar('Orders cannot be reverted to previous status', 'warning');
      return;
    }

    if (dInd - sInd > 1) {
      showSnackbar('Skipping order status is not allowed', 'warning');
      return;
    }

    if (sInd === dInd) {
      const items = reorder(state[sInd].data, source.index, destination.index);
      const newState = [...state];
      newState[sInd].data = items;
      setState(newState);
    } else {
      const [sourceData, destData] = move(state[sInd].data, state[dInd].data, source, destination);
      const newState = [...state];

      const draggedItem = newState[sInd].data[source.index];
      draggedItem.loading = true;
      const [tempSourceData, tempDestData] = [newState[sInd].data, newState[dInd].data];
      newState[sInd].data = sourceData;
      newState[dInd].data = destData;

      updateOrderMutation.mutate(
        {
          orderId: draggedItem.id,
          orderStatus: state[dInd].status,
          updatedBy: userName,
        },
        {
          onSuccess: (response) => {
            showSnackbar('Order status updated successfully', 'success');
            if (state[dInd].status === 'DELIVERED') {
              const payload = {
                referenceId: draggedItem?.id,
                paymentMethod: 'CASH',
                paymentMode: 'OFFLINE',
                amountPaid: draggedItem?.content?.grandTotal,
                paymentStatus: 'COMPLETED',
              };
              recordPaymentMutation.mutate(payload);
            }
            if (state[dInd].status === 'PACKAGED') {
              // const mutatedSenderAddress = `${draggedItem?.content?.billingAddress?.addressLine1}+${draggedItem?.content?.billingAddress?.addressLine2}+${draggedItem?.content?.billingAddress?.city}+${draggedItem?.content?.billingAddress?.state}+${draggedItem?.content?.billingAddress?.country}`;
              const mutatedReceiverAddress = `${draggedItem?.content?.shippingAddress?.addressLine1}+${draggedItem?.content?.shippingAddress?.addressLine2}+${draggedItem?.content?.shippingAddress?.city}+${draggedItem?.content?.shippingAddress?.state}+${draggedItem?.content?.shippingAddress?.country}`;
              const payload = {
                sourceOrgId: orgId,
                sourceLocId: locId,
                sourceType: contextType || 'RETAIL',
                receiverUserId: draggedItem?.content?.loggedInUserId,
                shipmentType: 'FORWARD',
                paymentMode: draggedItem?.content?.paymentMethod,
                // senderAddress: mutatedSenderAddress,
                receiverAddress: mutatedReceiverAddress,
                // senderContact: draggedItem?.content?.billingAddress?.phoneNo,
                receiverContact: draggedItem?.content?.shippingAddress?.phoneNo,
                orderId: draggedItem?.id,
                receiverLat: draggedItem?.content?.shippingAddress?.latitude,
                receiverLong: draggedItem?.content?.shippingAddress?.longitude,
                startTime: draggedItem?.content?.startTime,
                endTime: draggedItem?.content?.endTime,
                shipmentItemList: draggedItem?.content?.lineItems.map((item) => ({
                  itemPrice: item?.subTotal,
                  gtin: item?.gtin,
                  quantity: item?.quantity,
                  itemName: item?.productName,
                })),
              };
              createShipmentMutation.mutate(payload);
            }
            orderListQuery.refetch();
          },
          onError: (error) => {
            newState[sInd].data = tempSourceData;
            newState[dInd].data = tempDestData;
            showSnackbar(error?.response?.data?.message || error?.message, 'error');
          },
          onSettled: () => {
            draggedItem.loading = false;
            setState(newState);
            setShouldRefresh(true);
          },
        },
      );
    }
  };

  const handleSlotChange = (orderList, slotId) => {
    const arrayData = JSON.parse(JSON.stringify(baseArray));

    if (slotId) {
      orderList.filter((el) =>
        el?.data?.some((item) => {
          const isFound = item?.content?.slotId === slotId;
          if (isFound) {
            const index = arrayData.findIndex((el) => el?.status === item?.content?.fulfilmentStatus);
            arrayData[index]?.data.push(item);
          }
        }),
      );
      setSlotList((prevSlotList) =>
        prevSlotList.map((slot) => ({
          ...slot,
          selected: slot?.slotId === slotId,
        })),
      );
      setState(arrayData);
    } else {
      setState(orderList);
    }
  };

  const renderSlots = () => {
    if (isFetchingSlot) {
      return <SkeletonLoader type="single-item" />;
    }
    if (!slotList?.length) {
      return (
        <div className="no-slot-container">
          <CalendarMonthIcon />
          <div className="no-slot">No slots available</div>
        </div>
      );
    }
    return slotList.map((slot) => (
      <div
        key={slot?.slotId}
        className={`slot-item ${slot?.selected ? 'selected-slot' : ''}`}
        onClick={() => handleSlotChange(initialOrders, slot?.slotId)}
      >
        {slot.createdCount > 0 && (
          <div className={`notification-count ${slot?.selected ? 'selected-notification' : ''}`}>
            {slot.createdCount}
          </div>
        )}
        <div className="slot-time">{`${slot?.startTime} - ${slot?.endTime}`}</div>
      </div>
    ));
  };

  return (
    <Card className="board-card">
      <div className="board-container">
        <div className="board-header-container">
          <div className="board-header">
            <SoftTypography variant="h3" color="info" className="board-header-title">
              B2C Order Display Screen
            </SoftTypography>
            {/* <SoftTypography variant="button" fontWeight="regular" color="text">
            Effortlessly manage and update the status of your placed orders through this screen.
          </SoftTypography> */}
          </div>
          <Tooltip key={'REFRESH'} title={'Refresh'} placement="bottom">
            <IconButton onClick={orderListQuery?.refetch}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>

          {/* <div className="board-filter-container">
            <IconButton
              onClick={(e) => setFilterOpen(e.currentTarget)}
              className="board-filter-icon"
            >
              <FilterAltIcon />
            </IconButton>
            <Menu
              anchorEl={filterOpen}
              open={Boolean(filterOpen)}
              onClose={() => setFilterOpen(false)}
              className="board-filter-menu"
              classes={{ paper: "board-filter-menu-paper" }}
            >
              <div className="board-filter-menu-container">
                <div className="board-filter-search-box">
                  <div className="board-filter-search-title">Search</div>
                  <Input
                    className="board-filter-search-input"
                    label="Search"
                    placeholder="Search by order id"
                  />
                </div>
                <div className="board-filter-date-box">
                  <div className="board-filter-date-title">Date</div>
                  <div className="board-filter-date-inputs">
                    <SoftDatePicker
                    input={{ placeholder: "From" }}
                    options={{ dateFormat: "d-m-y" }}
                    label="From"
                    // value={new Date()}
                    onChange={(date) => console.log(date)}
                    className="board-filter-menu-item"
                  />
                  <ArrowRightAltIcon fontSize="medium" />
                  <SoftDatePicker
                    input={{ placeholder: "To" }}
                    options={{ dateFormat: "d-m-y" }}
                    label="To"
                    // value={new Date()}
                    onChange={(date) => console.log(date)}
                    className="board-filter-menu-item"
                  />
                  </div>
                </div>
                <div className="board-filter-slot-box">
                  <div className="board-filter-slot-title">Time Slot</div>
                  <SoftSelect
                    options={[
                      { label: "Morning", value: "morning" },
                      { label: "Afternoon", value: "afternoon" },
                      { label: "Evening", value: "evening" },
                    ]}
                    menuPortalTarget={document.body}
                    label="Select Slot"
                    placeholder="Select Slot"
                    className="board-filter-menu-item"
                    classNamePrefix="soft-select"
                  />
                </div>
                <div className="board-filter-apply-box">
                  <StyledButton variant="secondary" color="red">
                    Clear
                  </StyledButton>
                  <StyledButton>Apply</StyledButton>
                </div>
              </div>
            </Menu>
          </div> */}

          {/* <div className="pagination-container">
            <div
              className={!payload?.page ? "disabled-arrow" : "pagination-arrow"}
              onClick={prevPage}
            >
              <ArrowBackIosNewIcon fontSize="10px" />
            </div>
            <div className="pagination-text">
              <div className="pagination-current-page">
                {payload?.page * payload?.pageSize + 1} -{" "}
                {Math.min(
                  payload?.page * payload?.pageSize + payload?.pageSize,
                  pageData?.totalResults
                )}
              </div>
              <div className="pagination-total-results">of {pageData.totalResults}</div>
            </div>
            <div
              className={
                payload?.page + 1 >= pageData.totalPages ? "disabled-arrow" : "pagination-arrow"
              }
              onClick={nextPage}
            >
              <ArrowForwardIosIcon fontSize="10px" />
            </div>
          </div> */}
        </div>
        <div className="board-slots-container">{renderSlots()}</div>
        <div className="board-items-container">
          <DragDropContext onDragEnd={onDragEnd}>
            {state.map((el, ind) => (
              <Droppable key={ind} droppableId={`${ind}`}>
                {(provided, snapshot) => (
                  <div
                    className="board-items"
                    ref={provided.innerRef}
                    style={getListStyle(snapshot.isDraggingOver)}
                    {...provided.droppableProps}
                  >
                    <div className="status-title">{`${el?.status} ${el?.data.length}`}</div>
                    {orderListQuery.isLoading ? (
                      <SkeletonLoader type="board" />
                    ) : (
                      el?.data.map((item, index) => (
                        <Draggable key={item.id} draggableId={item.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`board-item-${ind}`}
                              style={{
                                ...getItemStyle(snapshot.isDragging, provided.draggableProps.style),
                                pointerEvents: item?.loading ? 'none' : 'auto',
                              }}
                            >
                              <BoardItem
                                item={item?.content}
                                isLoading={item?.loading}
                                setShouldRefresh={setShouldRefresh}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </DragDropContext>
        </div>
      </div>
    </Card>
  );
};

export default Delivery;
