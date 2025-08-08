import { Box, CircularProgress } from '@mui/material';
import { createServiceSlotsByRegion } from '../../../../../../config/Services';
import {
  getAreaName,
  getDeliveryCost,
  getDeliverySlots,
  getDistanceArray,
  getInstantDelivery,
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
  getWeightArray,
} from '../../../../../../datamanagement/serviceSlice';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useSnackbar } from '../../../../../../hooks/SnackbarProvider';
import { useState } from 'react';
import AreaLocation from '../areaLocation';
import DashboardLayout from '../../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../../examples/Navbars/DashboardNavbar';
import DeliveryCharges from '../delivery-charges';
import DeliveryTime from '../delivery-time';
import PickupLocation from '../pickup-location';
import SoftButton from '../../../../../../components/SoftButton';

const PincodeServiceableArea = () => {
  const templateArray = [
    { component: <AreaLocation /> },
    { component: <DeliveryTime /> },
    { component: <DeliveryCharges /> },
    { component: <PickupLocation /> },
  ];

  const areaName = useSelector(getAreaName);
  const locationArray = useSelector(getLocationArray);
  const locationArrayByRadius = useSelector(getLocationArrayByRadius);
  const instantDelivery = useSelector(getInstantDelivery);
  const deliverySlots = useSelector(getDeliverySlots);
  const pickupName = useSelector(getPickupName);
  const pickupAddress = useSelector(getPickupAddress);
  const pickupInstruction = useSelector(getPickupInstruction);
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const selectOption = useSelector(getSelectOption);
  const weightData = useSelector(getWeightArray);
  const priceData = useSelector(getPriceArray);
  const distanceData = useSelector(getDistanceArray);
  const rateData = useSelector(getRateArray);
  const pickUpCheckBox = useSelector(getPickUpCheckBox);
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const showsnackbar = useSnackbar();
  const userDetails = JSON.parse(localStorage.getItem('user_details'));
  const uidx = userDetails?.uidx;
  const deliveryCost = useSelector(getDeliveryCost);
  const sameDeliveryAllYear = useSelector(getSameDeliveryYear);
  const fullName = localStorage.getItem('user_name');

  const instantDeliveryNew = instantDelivery.map((item) => ({
    ...item,
    createdBy: uidx,
    createdByName: fullName,
  }));

  // apis for creating slots for a region
  const handleServiceSave = () => {
    setLoader(true);
    const payload = {
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
      createdBy: uidx,
      modifiedBy: uidx,
      sameSlotEveryDay: sameDeliveryAllYear ? sameDeliveryAllYear : false,
      shippingCharges: [
        {
          freeDeliveryAbove: deliveryCost ? deliveryCost : 0,
          chargeableType: selectOption?.value,
          freeDeliveryIsAvailable: selectOption?.value === 'FREE_SHIPPING' ? true : pickUpCheckBox ? true : false,
          shippingConfigs:
            selectOption?.value === 'FREE_SHIPPING'
              ? null
              : selectOption?.value === 'FLAT_RATE'
                ? [rateData]
                : selectOption?.value === 'RATE_BY_WEIGHT'
                  ? weightData
                  : selectOption?.value === 'RATE_BY_DISTANCE'
                    ? distanceData
                    : priceData,
        },
      ],
      createSlots: deliverySlots,
      createTats: locationArray,
      instantDelivery: [
        {
          createdBy: instantDeliveryNew[0].createdBy,
          createdByName: instantDeliveryNew[0].createdByName,
          instantDeliveryStartTime: instantDeliveryNew[0]?.instantDeliveryStartTime,
          instantDeliveryEndTime: instantDeliveryNew[0]?.instantDeliveryEndTime,
          instantDeliveryOrderCapacity: instantDeliveryNew[0]?.instantDeliveryOrderCapacity,
          instantDeliveryCutoff: instantDeliveryNew[0]?.instantDeliveryCutoff,
          packingTime: instantDeliveryNew[0]?.packingTime,
        },
      ],
    };
    createServiceSlotsByRegion(payload)
      .then((res) => {
        if (res?.data?.data?.es === 1) {
          showsnackbar('Unable to create region', 'error');
          setLoader(false);
        } else {
          showsnackbar('Success slots created for region', 'success');
          setLoader(false);
          navigate('/pallet-hyperlocal/serviceability');
        }
      })
      .catch((err) => {
        showsnackbar(err?.message, 'error');
        setLoader(false);
      });
  };

  console.log({ deliverySlots, instantDeliveryNew });

  // to cancel slots creations:---
  const handleCancel = () => {
    navigate('/pallet-hyperlocal/serviceability');
  };

  return (
    <DashboardLayout>
      <DashboardNavbar prevLink={true} />
      {templateArray.map((e) => (
        <Box className="components-wrapper-box">{e?.component}</Box>
      ))}
      <Box className="service-details-main-wrapper-edit-box">
        <SoftButton className="cancel-edit-wrapper-btn" onClick={handleCancel}>
          Cancel
        </SoftButton>
        <SoftButton className="save-edit-wrapper-btn" onClick={handleServiceSave}>
          {loader ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Save'}
        </SoftButton>
      </Box>
    </DashboardLayout>
  );
};

export default PincodeServiceableArea;
