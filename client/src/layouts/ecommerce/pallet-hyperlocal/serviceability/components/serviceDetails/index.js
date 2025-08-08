import './index.css';
import { Button, CircularProgress, Grid } from '@mui/material';
import { editServiceData, getServiceDataListDetails, getSlotData } from '../../../../../../config/Services';
import {
  getAreaName,
  getDeliveryCost,
  getDeliverySlots,
  getDistanceArray,
  getInstantDelivery,
  getInstantDeliveryId,
  getLocationArray,
  getLocationArrayByRadius,
  getPickUpCheckBox,
  getPickupAddress,
  getPickupInstruction,
  getPickupName,
  getPriceArray,
  getRateArray,
  getSameDeliveryYear,
  getSelectOption,
  getShippingId,
  getWeightArray,
  setAddLocation,
  setAddLocationByRadius,
  setAreaName,
  setDeliveryCost,
  setDeliverySlots,
  setInstantDelivery,
  setInstantDeliveryId,
  setPickupAddress,
  setPickupName,
  setRateByWeight,
  setRegionId,
  setShippingId,
  setTransformedData,
  setpickUpCheckBox,
  setpickupInstruction,
} from '../../../../../../datamanagement/serviceSlice';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AreaLocation from '../areaLocation';
import DashboardLayout from '../../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../../examples/Navbars/DashboardNavbar';
import DeliveryCharges from '../delivery-charges';
import DeliveryTimeEdit from '../delivery-time copy';
import EditIcon from '@mui/icons-material/Edit';
import GoogleMaps from '../serviceDetails/editMap/index';
import PickupLocation from '../pickup-location';
import SoftBox from '../../../../../../components/SoftBox';
import SoftInput from '../../../../../../components/SoftInput';
import moment from 'moment';

const ServiceDetails = () => {
  const { id } = useParams();
  const [serviceListDetailsData, setServiceListDetailsData] = useState([]);
  const [pincodeData, setPincodeData] = useState([]);
  const [shippingData, setShippingData] = useState([]);
  const [cutoffArray, setcutoffArray] = useState([]);
  const [shippingConfigs, setShippingConfigs] = useState([]);
  const [instantDelivery, setInstantDeliveryArray] = useState([]);
  const [editService, setEditService] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const areaName = useSelector(getAreaName);
  const locationArray = useSelector(getLocationArray);
  const locationArrayByRadius = useSelector(getLocationArrayByRadius);
  const instantDeliveryData = useSelector(getInstantDelivery);
  const deliverySlots = useSelector(getDeliverySlots);
  const pickupName = useSelector(getPickupName);
  const pickupAddress = useSelector(getPickupAddress);
  const pickupInstruction = useSelector(getPickupInstruction);
  const pickUpCheckBox = useSelector(getPickUpCheckBox);
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const selectOption = useSelector(getSelectOption);
  const weightData = useSelector(getWeightArray);
  const priceData = useSelector(getPriceArray);
  const distanceData = useSelector(getDistanceArray);
  const rateData = useSelector(getRateArray);
  const deliveryCost = useSelector(getDeliveryCost);
  const shippingId = useSelector(getShippingId);
  const instantId = useSelector(getInstantDeliveryId);
  const sameDeliveryAllYear = useSelector(getSameDeliveryYear);
  const [editLoader, setEditLoader] = useState(false);
  const fullName = localStorage.getItem('user_name');
  const userDetails = JSON.parse(localStorage.getItem('user_details'));
  const uidx = userDetails?.uidx;

  useEffect(() => {
    if (instantDeliveryData) {
      const instantDeliveryNew = instantDeliveryData.map((item) => ({
        ...item,
        createdBy: uidx,
        createdByName: fullName,
      }));
      setInstantDeliveryArray(instantDeliveryNew);
    }
  }, [instantDeliveryData]);

  function convertTo24HourFormat(time12h) {
    if (time12h) {
      const [time, modifier] = time12h?.split(' ');
      let [hours, minutes] = time?.split(':');

      if (hours === '12') {
        hours = '00';
      }

      if (modifier === 'PM') {
        hours = parseInt(hours, 10) + 12;
      }

      return `${hours}:${minutes}:00`;
    } else {
      return;
    }
  }

  const creatSlots = () => {
    getServiceDataListDetails(id)
      .then((res) => {
        setServiceListDetailsData(res?.data?.data);
        setPincodeData(res?.data?.data?.tats);
        setShippingData(res?.data?.data?.shippingCharges);
        setShippingConfigs(res?.data?.data?.shippingCharges[0]?.shippingConfigs);
        setInstantDeliveryArray(res?.data?.data?.instantDelivery);
        dispatch(setAreaName(res?.data?.data?.areaName));
        dispatch(setAddLocation(res?.data?.data?.tats));
        dispatch(setAddLocationByRadius(res?.data?.data));
        dispatch(setRateByWeight(res?.data?.data?.shippingCharges[0]?.shippingConfigs));
        dispatch(setPickupName(res?.data?.data?.pickupName));
        dispatch(setPickupAddress(res?.data?.data?.pickupAddress));
        dispatch(setpickupInstruction(res?.data?.data?.pickupInstructions));
        dispatch(setInstantDelivery(res?.data?.data?.instantDelivery));
        dispatch(setInstantDeliveryId(res?.data?.data?.instantDelivery?.instantDeliveryId));
        dispatch(setpickUpCheckBox(res?.data?.data?.shippingCharges[0]?.freeDeliveryIsAvailable));
        dispatch(setDeliveryCost(res?.data?.data?.shippingCharges[0]?.freeDeliveryAbove));
        dispatch(setShippingId(res?.data?.data?.shippingCharges[0]?.shippingChargeId));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    creatSlots();
  }, []);

  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0];
  const parts = formattedDate.split('-');
  const utcDate = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));

  // Convert to UTC date without time
  const originalDate = new Date(utcDate);

  // Get current date without time
  const currentDate = new Date();
  currentDate.setFullYear(originalDate.getFullYear());
  currentDate.setMonth(originalDate.getMonth());
  currentDate.setDate(originalDate.getDate());

  // Calculate end time (next week) without time
  const nextWeek = new Date(currentDate);
  nextWeek.setDate(nextWeek.getDate() + 7);
  nextWeek.setHours(0, 0, 0, 0);

  // Convert to ISO string without time
  const endTime = nextWeek.toISOString().split('T')[0] + 'T23:59:59.00Z';
  const startTime = currentDate.toISOString().split('T')[0] + 'T00:00:00.00Z';

  //to get slot data changing the apis array here and its getting hit after evry 5 minutes
  const fetchSlotData = async () => {
    const slotPayload = {
      sourceIdList: null,
      sourceLocationIdList: null,
      orgIdList: null,
      pickUpTatList: null,
      transportDateTimeStart: null,
      transportDateTimeEnd: null,
      orderDateTimeStart: null,
      orderDateTimeEnd: null,
      capacityList: null,
      consumedCapacityList: null,
      priorityCapacityList: null,
      priorityConsumedCapacityList: null,
      slotDayList: null,
      slotStartTime: startTime,
      slotEndTime: endTime,
      slotConsumedCapacityList: null,
      slotOrderItemCapacityList: null,
      slotAvailableCapacityList: null,
      slotIsAvailableList: null,
      regionIdList: [id],
    };
    try {
      const res = await getSlotData(slotPayload);
      setcutoffArray(res?.data?.data?.data);
      dispatch(setDeliverySlots(res?.data?.data?.data));
    } catch (error) {
      console.error('Error fetching slot data:', error);
    }
  };
  useEffect(() => {
    fetchSlotData();
    const intervalId = setInterval(() => {
      fetchSlotData();
    }, 50000);

    return () => clearInterval(intervalId);
  }, []);

  const transformCutoffArray = (cutoffArray) => {
    const transformedData = [
      { day: 'SUNDAY', slots: [] },
      { day: 'MONDAY', slots: [] },
      { day: 'TUESDAY', slots: [] },
      { day: 'WEDNESDAY', slots: [] },
      { day: 'THURSDAY', slots: [] },
      { day: 'FRIDAY', slots: [] },
      { day: 'SATURDAY', slots: [] },
    ];

    cutoffArray.forEach((cutoff) => {
      const day = cutoff.slot.day;
      const startTime = moment(cutoff.slot.startTime).format('h:mmA');
      const endTime = moment(cutoff.slot.endTime).format('h:mmA');
      const orderCapacity = cutoff.slot.orderItemCapacity / 100;

      // Find the corresponding day in transformedData
      const targetDay = transformedData.find((item) => item.day === day);

      if (targetDay) {
        // Add the slot to the corresponding day
        targetDay.slots.push({ startTime, endTime, orderCapacity });
      }
    });

    return transformedData;
  };

  // Usage
  const transformedData = transformCutoffArray(cutoffArray);

  useEffect(() => {
    dispatch(setRegionId(id));
    dispatch(setTransformedData(transformedData));
  }, [transformedData, id]);

  const convertUTCDateToLocalDate = (dat) => {
    const date = moment.utc(dat).toDate();
    return moment(date).local().format('LT');
  };

  const handleBack = () => {
    navigate('/pallet-hyperlocal/serviceability');
  };

  const handleEditService = () => {
    setEditService(true);
  };

  const handleSave = () => {
    setEditService(false);
    setEditLoader(true);
    const payload = {
      regionId: id,
      areaName: areaName,
      regionCode: 'string',
      latitude: locationArrayByRadius?.latitude ? locationArrayByRadius?.latitude : null,
      longitude: locationArrayByRadius?.longitude ? locationArrayByRadius?.longitude : null,
      radius: locationArrayByRadius?.radius ? locationArrayByRadius?.radius : null,
      pickupName: pickupName,
      pickupAddress: pickupAddress,
      pickupInstructions: pickupInstruction,
      sourceId: orgId,
      sourceLocationId: locId,
      isDeleted: false,
      tats: locationArray,
      cutoff: deliverySlots,
      instantDelivery: [
        {
          createdBy: instantDelivery?.[0]?.createdBy,
          createdByName: instantDelivery?.[0]?.createdByName,
          instantDeliveryStartTime: instantDelivery?.[0]?.instantDeliveryStartTime,
          instantDeliveryEndTime: instantDelivery?.[0]?.instantDeliveryEndTime,
          instantDeliveryOrderCapacity: instantDelivery?.[0]?.instantDeliveryOrderCapacity,
          instantDeliveryCutoff: instantDelivery?.[0]?.instantDeliveryCutoff,
          packingTime: instantDelivery?.[0]?.packingTime,
        },
      ],
      sameSlotEveryDay: sameDeliveryAllYear ? sameDeliveryAllYear : false,
      shippingCharges: [
        {
          freeDeliveryAbove: deliveryCost ? deliveryCost : 0,
          chargeableType: selectOption?.value,
          shippingChargeId: shippingId,
          freeDeliveryIsAvailable: selectOption?.value === 'FREE_SHIPPING' ? true : pickUpCheckBox ? true : false,
          shippingConfigs:
            selectOption?.value === 'FREE_SHIPPING'
              ? null
              : selectOption?.value === 'FLAT_RATE'
                ? [rateData]
                : selectOption?.value === 'RATE_BY_WEIGHT'
                  ? weightData.map((item) => ({ ...item, shippingChargeId: shippingId }))
                  : selectOption?.value === 'RATE_BY_DISTANCE'
                    ? distanceData.map((item) => ({ ...item, shippingChargeId: shippingId }))
                    : priceData.map((item) => ({ ...item, shippingChargeId: shippingId })),
        },
      ],
    };

    editServiceData(payload)
      .then((res) => {
        creatSlots();
        setEditLoader(false);
        dispatch(setAddLocationByRadius(res?.data?.data));
      })
      .catch((err) => {
        setEditLoader(false);
      });
  };

  const convertUTCToIST = (time) => {
    const utcTime = moment.utc(time, 'HH:mm:ss');
    const istTime = utcTime.clone().utcOffset('+05:30');
    return istTime.format('hh:mm A');
  };

  return (
    <DashboardLayout>
      <DashboardNavbar prevLink={true} />
      {!editService && (
        <div className="service-details-main-wrapper-edit-box">
          <EditIcon className="edit-icon-service" onClick={handleEditService} />
        </div>
      )}

      {editService ? (
        <div className="hold-service-edit-wrapper">
          <AreaLocation />
        </div>
      ) : (
        <>
          <div className="service-details-main-wrapper">
            <div className="service-location-wrapper">
              <div className="service-location-inner-wrapper">
                <h5 className="service_label_text_area">Area name :</h5>
                <h6 className="area_text_details_serviceI">{areaName}</h6>
              </div>
            </div>
          </div>

          <div className="service-details-main-wrapper">
            {locationArray[0]?.pinCode !== '' && (
              <div className="service_label_text_Wrapper_box">
                <h6 className="service_label_text">You added delivery range by pincode</h6>
              </div>
            )}
            {locationArray[0]?.pinCode !== '' ? (
              <div>
                <table className="slot-table">
                  <thead>
                    <tr>
                      <th>Pincode</th>
                      <th>Area Name</th>
                    </tr>
                  </thead>
                  {locationArray &&
                    locationArray.map((e, i) => (
                      <tbody key={i}>
                        <tr>
                          <td>{e.pinCode ? e.pinCode : 'N/A'}</td>
                          <td>{e.areaName ? e.areaName : 'N/A'}</td>
                        </tr>
                      </tbody>
                    ))}
                </table>
              </div>
            ) : (
              <div className="google-service-wrapper">
                {locationArrayByRadius && (
                  <h6 className="service_label_text">You added delivery range by radius in km</h6>
                )}
                <SoftBox className="radius-map">
                  <GoogleMaps locationArrayByRadius={locationArrayByRadius} />
                </SoftBox>
              </div>
            )}
          </div>
        </>
      )}

      {/* delivery slots edit coloumn */}

      {editService ? (
        <div className="hold-service-edit-wrapper">
          <DeliveryTimeEdit />
        </div>
      ) : (
        <div className="service-details-main-wrapper">
          <div className="service_label_text_Wrapper_box">
            <h6 className="service_label_text">Instant Delivery</h6>
          </div>
          <>
            <table className="slot-table">
              {instantDeliveryData && (
                <>
                  <thead>
                    <tr>
                      <th>Start Time</th>
                      <th>End Time</th>
                      <th>Order Capacity</th>
                    </tr>
                  </thead>

                  {instantDeliveryData?.map((e, i) => (
                    <tbody key={i}>
                      <tr>
                        <td>{convertUTCToIST(e?.instantDeliveryStartTime)}</td>
                        <td>{convertUTCToIST(e?.instantDeliveryEndTime)}</td>
                        <td>{e?.instantDeliveryOrderCapacity}</td>
                      </tr>
                    </tbody>
                  ))}
                </>
              )}
            </table>
          </>
          <div className="service_label_text_Wrapper_box">
            <h6 className="service_label_text">Delivery Slots</h6>
          </div>
          <div className="table-slot-wrapper-box">
            <table className="slot-table">
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Order Capacity</th>
                  <th>Consumed Capacity</th>
                </tr>
              </thead>
              {cutoffArray &&
                cutoffArray.map((item, i) => (
                  <tbody key={i}>
                    <tr>
                      <td>{item?.slot?.day}</td>
                      <td>{convertUTCDateToLocalDate(item?.slot?.startTime)}</td>
                      <td>{convertUTCDateToLocalDate(item?.slot?.endTime)}</td>
                      <td>{item?.capacity}</td>
                      <td>{item?.consumedCapacity}</td>
                    </tr>
                  </tbody>
                ))}
            </table>
          </div>
        </div>
      )}

      {editService ? (
        <div className="hold-service-edit-wrapper">
          <DeliveryCharges />
        </div>
      ) : (
        <div className="service-details-main-wrapper">
          {shippingData?.length === 0 ? (
            <h3 className="edit-no-data-text">No data found</h3>
          ) : (
            <>
              {shippingData &&
                shippingData.map((e) => (
                  <>
                    <div className="shipping-wrapper-box">
                      <h4 className="input-label-text">Delivery Type :</h4>
                      <h5 className="service_label_textT">{e?.chargeableType.replace(/_/g, ' ')}</h5>
                    </div>
                    <div>
                      {e?.freeDeliveryIsAvailable === true ? (
                        <h3 className="free-del-text-service">
                          (Free Delivery is available above <b>₹{e?.freeDeliveryAbove})</b>
                        </h3>
                      ) : null}
                    </div>
                  </>
                ))}
              <>
                {shippingConfigs.length !== 0 ? (
                  <table className="slot-table">
                    <thead>
                      <tr>
                        <th>Shipping Charges</th>
                        <th>Min</th>
                        <th>Max</th>
                        <th>Rate</th>
                      </tr>
                    </thead>
                    {shippingConfigs &&
                      shippingConfigs.map((item, i) => (
                        <tbody key={i}>
                          <tr>
                            <td>{item?.shippingConfigId}</td>
                            <td>{item?.min}</td>
                            <td>{item?.max}</td>
                            <td>{item?.rate}</td>
                          </tr>
                        </tbody>
                      ))}
                  </table>
                ) : null}
              </>
            </>
          )}
        </div>
      )}

      {editService ? (
        <div className="hold-service-edit-wrapper">
          <PickupLocation />
        </div>
      ) : (
        <div className="service-details-main-wrapper">
          <div className="service_label_text_Wrapper_box">
            <h6 className="service_label_text">Pickup Location</h6>
          </div>

          <SoftBox>
            <Grid container p={2}>
              <Grid item md={12} sm={12} xs={12} mt={2}>
                <SoftBox className="main-wrapper-edit-box">
                  <SoftBox className="pickup_edit_wrapper_box_name">
                    <div>
                      <h6 className="top-margin-txt">Pickup name</h6>
                    </div>
                    <div className="pickup-soft-wrapper-box-name">
                      <SoftInput
                        id="pickup-name"
                        type="text"
                        className="edit-input-service-name-wrapper"
                        value={pickupName ? pickupName : 'N/A'}
                        readOnly
                      />
                    </div>
                  </SoftBox>
                </SoftBox>
              </Grid>
              <Grid item md={12} sm={12} xs={12} mt={2}>
                <SoftBox className="main-wrapper-edit-box">
                  <SoftBox className="pickup_edit_wrapper_box_name">
                    <div>
                      <h6 className="top-margin-txt">Pickup address</h6>
                    </div>
                    <div className="pickup-soft-wrapper-box-address">
                      <SoftInput
                        type="text"
                        id="pickup-address"
                        placeholder="Enter street Address"
                        value={pickupAddress ? pickupAddress : 'N/A'}
                        className="edit-input-service-name-wrapper"
                        readOnly
                      />
                    </div>
                  </SoftBox>
                </SoftBox>
              </Grid>
              <Grid item md={12} sm={12} xs={12} mt={2}>
                <SoftBox className="main-wrapper-edit-box">
                  <SoftBox className="pickup_edit_wrapper_box_name">
                    <div>
                      <h6 className="top-margin-txt">Pickup instructions</h6>
                    </div>
                    <div className="pickup-soft-wrapper-box-instruction">
                      <SoftInput
                        type="text"
                        id="pickup-instruction"
                        placeholder="Search Address"
                        value={pickupInstruction ? pickupInstruction : 'N/A'}
                        readOnly
                        className="edit-input-service-name-wrapper"
                      />
                    </div>
                  </SoftBox>
                </SoftBox>
              </Grid>
            </Grid>
          </SoftBox>
        </div>
      )}
      <div className="service-details-main-wrapper-edit-box">
        {editService ? (
          <div className="edit-btn-wrapper-service">
            <Button className="cancel-edit-wrapper-btn" onClick={handleSave}>
              Cancel
            </Button>
            <Button className="save-edit-wrapper-btn" onClick={handleSave}>
              {editLoader ? <CircularProgress sx={{ color: '#fff' }} size={24} /> : 'Save'}
            </Button>
          </div>
        ) : null}
      </div>
    </DashboardLayout>
  );
};

export default ServiceDetails;
