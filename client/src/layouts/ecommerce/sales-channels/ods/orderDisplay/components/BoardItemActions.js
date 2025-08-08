import './BoardItemActions.css';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import {
  assignPicker,
  cancelB2COrder,
  cancelShipment,
  createTrip,
  getShipmentFromOrderId,
  getTripList,
  getUsersByRole,
  updateTrip,
} from '../../../../../../config/Services';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSnackbar } from '../../../../../../hooks/SnackbarProvider';
import { useState } from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SkeletonLoader from './SkeletonLoader';
import SoftSelect from 'components/SoftSelect';
import StyledButton from '../../../../../../components/StyledButton';
import moment from 'moment';
import usePrint from '../../../../../../hooks/usePrint';

const BoardItemActions = ({
  item,
  orderQuery,
  isAssigned,
  openModal,
  handleClose,
  selectedPicker,
  setSelectedPicker,
}) => {
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const retailUserDetails = JSON.parse(localStorage.getItem('user_details'));
  const { startPrint, isPrinting } = usePrint();
  const showSnackbar = useSnackbar();
  const [selectedAgent, setSelectedAgent] = useState('');
  const [selectedTrip, setSelectedTrip] = useState('');
  const [loading, setLoading] = useState(false);
  const [tripState, setTripState] = useState('create_trip');
  const [shipmentId, setShipmentId] = useState('');
  const [agentList, setAgentList] = useState([]);
  const [selectedReason, setSelectedReason] = useState({});

  // const pickerList = [
  //   { value: "Yanush G", label: "Yanush G" },
  //   { value: "Sooriya F", label: "Sooriya F" },
  //   { value: "Udaya F", label: "Udaya F" },
  // ];

  const { isFetching: isFetchingPickers, data: pickerList } = useQuery({
    refetchOnWindowFocus: false,
    queryKey: ['picker'],
    queryFn: async () => {
      const payload = {
        contextId: locId,
        roles: ['POS_USER'],
      };
      const res = await getUsersByRole(payload);

      const pickerList = res?.data?.data?.map((picker) => ({
        value: picker.uidx,
        label: picker.first_name + ' ' + picker.second_name,
      }));
      return pickerList;
    },
    onError: (error) => {
      showSnackbar(error?.response?.data?.message || error?.message, 'error');
    },
  });

  const shipmentQuery = useQuery(['shipment'], () => getShipmentFromOrderId(item?.orderId), {
    retry: 2,
    refetchOnWindowFocus: false,
    onSuccess: (res) => {
      if (res?.data?.data?.es) {
        // showSnackbar(res?.data?.data?.message, "error");
        return;
      }
      setShipmentId(res?.data?.data?.data?.shipmentId);
    },
    onError: (error) => {
      showSnackbar(error?.response?.data?.message || error?.message, 'error');
    },
  });

  const tripQuery = useQuery(['trip'], () => getTripList(orgId, locId), {
    retry: 2,
    refetchOnWindowFocus: false,
    onSuccess: (res) => {
      if (res?.data?.data?.es) {
        // showSnackbar(res?.data?.data?.message, "error");
        return;
      }
      const agentList = res?.data?.data?.data?.map((agent) => ({
        ...agent,
        value: agent.agentId,
        label: agent.agentName,
      }));
      setAgentList(agentList);
    },
    onError: (error) => {
      showSnackbar(error?.response?.data?.message || error?.message, 'error');
    },
  });

  const cancelOrderMutation = useMutation({
    // mutationFn: (payload) => updateOrderTimeline(payload),
    mutationFn: async (payload) => {
      const res = await cancelB2COrder(payload);
      if (res?.data?.code === 'ECONNRESET') {
        throw new Error(res?.data?.message);
      }
      if (res?.data?.data?.es) {
        throw new Error(res?.data?.data?.message);
      }
      return res;
    },
    onSuccess: (res) => {
      showSnackbar('Order cancelled', 'success');
      handleClose();
    },
    onError: (error) => {
      showSnackbar(error?.response?.data?.message || error?.message, 'error');
    },
  });

  const assignPickerMutation = useMutation({
    mutationFn: (payload) => assignPicker(payload),
    onSuccess: (res) => {
      if (res?.data?.data?.es) {
        showSnackbar(res?.data?.data?.message, 'error');
        return;
      }
      orderQuery.refetch();
      showSnackbar('Picker assigned', 'success');
    },
    onError: (error) => {
      showSnackbar(error?.response?.data?.message || error?.message, 'error');
    },
  });

  const createTripMutation = useMutation({
    mutationFn: (payload) => createTrip(payload),
    onSuccess: (res) => {
      if (res?.data?.data?.es) {
        showSnackbar(res?.data?.data?.message, 'error');
        return;
      }
      showSnackbar('Trip created', 'success');
    },
    onError: (error) => {
      showSnackbar(error?.response?.data?.message || error?.message, 'error');
    },
  });

  const updateTripMutation = useMutation({
    mutationFn: (payload) => updateTrip(payload),
    onSuccess: (res) => {
      if (res?.data?.data?.es) {
        showSnackbar(res?.data?.data?.message, 'error');
        return;
      }
      showSnackbar('Trip updated', 'success');
    },
    onError: (error) => {
      showSnackbar(error?.response?.data?.message || error?.message, 'error');
    },
  });

  const cancelShipmentMutation = useMutation({
    mutationFn: (payload) => cancelShipment(payload),
    onSuccess: (res) => {
      if (res?.data?.data?.es) {
        showSnackbar(res?.data?.data?.message, 'error');
        return;
      }
      showSnackbar(res?.data?.data?.data?.message || 'Shipment cancelled successfully', 'success');
      handleClose();
    },
    onError: (error) => {
      showSnackbar(error?.response?.data?.message || error?.message, 'error');
    },
  });

  const handleAssignPicker = (option) => {
    const payload = {
      orderId: item?.orderId,
      isAssigned: true,
    };
    assignPickerMutation.mutate(payload);
    setSelectedPicker(option);
  };

  const handleAgentChange = (value) => {
    setSelectedAgent(value);
    setTripState('create_trip');
    setSelectedTrip('');
  };

  const handleTripCreation = () => {
    if (!shipmentId) {
      showSnackbar('Cannot create trip without shipment', 'error');
      return;
    }
    const updatedScheduledDepartureAt = moment().add(30, 'minutes').format('YYYY-MM-DDTHH:mm:ss');
    const payload = {
      createdBy: retailUserDetails.uidx,
      scheduledDepartureAt: updatedScheduledDepartureAt,
      purpose: '',
      tripType: 'FORWARD',
      tripCost: 0,
      comment: '',
      shipmentIdList: [shipmentId],
      deliveryAgentId: selectedAgent?.agentId,
    };
    createTripMutation.mutate(payload);
  };

  const handleTripUpdation = () => {
    if (!shipmentId) {
      showSnackbar('Cannot create trip without shipment', 'error');
      return;
    }
    const payload = {
      deliveryAgentId: selectedAgent?.agentId,
      shipmentIds: [shipmentId],
      tripId: selectedTrip,
      uidx: retailUserDetails.uidx,
    };
    updateTripMutation.mutate(payload);
  };

  const handleCancelShipment = () => {
    if (!shipmentId) {
      showSnackbar('Cannot cancel shipment without shipment Id', 'error');
      return;
    }
    const payload = {
      shipmentId: shipmentId,
      orderId: item?.orderId,
      userId: retailUserDetails?.uidx,
      reason: selectedReason?.label,
    };
    cancelShipmentMutation.mutate(payload);
  };

  const handleCancelOrder = () => {
    const payload = {
      userId: item?.loggedInUserId,
      orderId: item?.orderId,
    };
    cancelOrderMutation.mutate(payload);
  };

  const renderAgentStatus = () => (
    <div className="board-item-details-select-container">
      <div>
        <div className="board-item-details-select-text">Assign delivery agent</div>
        {tripQuery?.isLoading || tripQuery?.isFetching ? (
          <SkeletonLoader type="single-item" />
        ) : (
          <SoftSelect
            value={selectedAgent}
            onChange={handleAgentChange}
            options={agentList}
            menuPortalTarget={document.body}
            placeholder={'Select agent'}
            classNamePrefix="soft-select"
          />
        )}
      </div>

      {selectedAgent && (
        <>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            value={tripState}
            onChange={(e) => setTripState(e.target.value)}
          >
            <FormControlLabel
              className="board-item-details-select-radio"
              value="create_trip"
              control={<Radio />}
              label={<span style={{ fontSize: '14px' }}>Create Trip</span>}
            />
            <FormControlLabel
              className="board-item-details-select-radio"
              value="update_trip"
              disabled={selectedAgent?.agentStatus !== 'OCCUPIED'}
              control={<Radio />}
              label={<span style={{ fontSize: '14px' }}>Update Trip</span>}
            />
          </RadioGroup>
          {tripState === 'update_trip' && (
            <div className="board-item-trips-container">
              <Accordion className="board-item-trips-accordion">
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                  <div style={{ fontWeight: 'bold' }}>Select Trip</div>
                </AccordionSummary>
                <AccordionDetails>
                  <div>
                    <div className="board-item-trip">
                      {selectedAgent?.agentTripDetailsResList.map((job) => (
                        <div className="board-item-trip-item" key={job.tripId}>
                          <RadioGroup
                            aria-label="job-selection"
                            name="job-selection"
                            value={selectedTrip}
                            onChange={(e) => setSelectedTrip(e.target.value)}
                          >
                            <FormControlLabel
                              value={job.tripId}
                              control={<Radio />}
                              label={
                                <div className="board-item-trip-radio-label">
                                  <div className="board-item-trip-radio-label-trip-id">{`Trip ID: ${job.tripId}`}</div>
                                  <div>{`Created On: ${job.createdOn}`}</div>
                                  <div>{`Total Shipments: ${job.totalShipments}`}</div>
                                </div>
                              }
                            />
                          </RadioGroup>
                        </div>
                      ))}
                    </div>
                  </div>
                </AccordionDetails>
              </Accordion>
            </div>
          )}
          {tripState === 'update_trip' ? (
            <>
              <StyledButton
                style={{ width: '10rem', marginLeft: 'auto', height: '2.2rem' }}
                disabled={!selectedTrip}
                loading={updateTripMutation?.isLoading}
                onClick={handleTripUpdation}
              >
                Update Trip
              </StyledButton>
              {updateTripMutation?.isSuccess && (
                <div className="board-item-trip-created">
                  <div>
                    <CheckCircleIcon style={{ color: 'green', fontSize: '1rem' }} />
                  </div>
                  <div>Trip updated successfully</div>
                </div>
              )}
            </>
          ) : (
            <>
              <StyledButton
                style={{ width: '10rem', marginLeft: 'auto', height: '2.2rem' }}
                disabled={!selectedAgent}
                loading={createTripMutation?.isLoading}
                onClick={handleTripCreation}
              >
                Create Trip
              </StyledButton>
              {createTripMutation?.isSuccess && (
                <div className="board-item-trip-created">
                  <div>
                    <CheckCircleIcon style={{ color: 'green', fontSize: '1rem' }} />
                  </div>
                  <div>Trip created successfully</div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );

  const renderOrderUpdate = () => (
    <div className="board-item-order-update-container">
      <div className="board-item-details-select-text">Order updates</div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}
      >
        <SoftSelect
          options={[
            { value: 'not_responding', label: 'Cutomer not responding' },
            { value: 'address_not_found', label: 'Address not found' },
            { value: 'house_locked', label: 'House locked' },
            { value: 'entry_denied', label: 'Entry denied' },
            { value: 'other', label: 'Other' },
          ]}
          onChange={(value) => setSelectedReason(value)}
          menuPortalTarget={document.body}
          placeholder={'Select reason for order failure'}
          classNamePrefix="soft-select"
        />
        {item?.fulfilmentStatus === 'CREATED' ? (
          <StyledButton
            style={{ width: '10rem', marginLeft: 'auto', height: '2.2rem' }}
            variant="secondary"
            color="red"
            onClick={handleCancelOrder}
            loading={cancelOrderMutation?.isLoading}
            // disabled={!selectedTrip}
          >
            Cancel Order
          </StyledButton>
        ) : (
          <StyledButton
            style={{ width: '10rem', marginLeft: 'auto', height: '2.2rem' }}
            variant="secondary"
            color="red"
            onClick={handleCancelShipment}
            loading={cancelShipmentMutation?.isLoading}
            // disabled={!selectedTrip}
          >
            Cancel Shipment
          </StyledButton>
        )}
      </div>
    </div>
  );

  switch (item?.fulfilmentStatus) {
    case 'CREATED':
      return (
        <div className="board-item-details-created-actions">
          <div className="board-item-details-created-top-box">
            <div className="board-item-details-select-container">
              <div className="board-item-details-select-text">Assign Picker</div>
              {assignPickerMutation?.isLoading || isFetchingPickers ? (
                <SkeletonLoader type="single-item" />
              ) : (
                <SoftSelect
                  value={selectedPicker}
                  // onChange={handleSlotChange}
                  onChange={handleAssignPicker}
                  options={pickerList}
                  menuPortalTarget={document.body}
                  placeholder={'Select order picker'}
                  classNamePrefix="soft-select"
                />
              )}
            </div>
            <div>{renderOrderUpdate()}</div>
          </div>
          <div className="board-item-details-buttons-box">
            {/* <StyledButton
              onClick={handleAssignPicker}
              className="vendor-add-btn"
              loading={assignPickerMutation?.isLoading}
            >
              Assign Picker
            </StyledButton> */}
            <StyledButton
              onClick={() => {
                if (!selectedPicker) {
                  showSnackbar('Please select picker', 'error');
                  return;
                }
                startPrint({
                  orderId: item?.orderId,
                  printType: 'picklist',
                  pickerName: selectedPicker,
                });
              }}
              className="vendor-add-btn"
              disabled={!isAssigned}
              loading={isPrinting}
            >
              Print Pick List
            </StyledButton>
            <StyledButton onClick={openModal}>Validate</StyledButton>
          </div>
        </div>
      );
    case 'PACKAGED':
      return (
        <div className="board-item-details-created-actions">
          <div className="board-item-details-created-top-box">
            <div>{renderAgentStatus()}</div>
            <div>{renderOrderUpdate()}</div>
          </div>
          <div className="board-item-details-buttons-box">
            <StyledButton
              onClick={() => startPrint({ orderId: item?.orderId, b2c: true })}
              className="vendor-add-btn"
              loading={isPrinting}
            >
              Print Invoice
            </StyledButton>
          </div>
        </div>
      );
    case 'IN_TRANSIT':
      return (
        <div className="board-item-details-created-actions">
          <div className="board-item-details-created-top-box">
            <div>{renderOrderUpdate()}</div>
          </div>
        </div>
      );
    case 'DELIVERED':
      return (
        <div className="board-item-details-created-actions">
          <div className="board-item-details-created-top-box">{/* <div>{renderOrderUpdate()}</div> */}</div>
        </div>
      );
    default:
      return null;
  }
};

export default BoardItemActions;
