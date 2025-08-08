import { Box, Grid, InputLabel } from '@mui/material';
import {
  getPickupAddress,
  getPickupInstruction,
  getPickupName,
  setPickupAddress,
  setPickupName,
  setpickupInstruction,
} from '../../../../../../datamanagement/serviceSlice';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import SoftBox from '../../../../../../components/SoftBox';
import SoftInput from '../../../../../../components/SoftInput';
import SoftTypography from '../../../../../../components/SoftTypography';

const PickupLocation = () => {
  const dispatch = useDispatch();
  const pickUpName = useSelector(getPickupName);
  const pickUpAddress = useSelector(getPickupAddress);
  const pickUpInstruction = useSelector(getPickupInstruction);

  const handlePickupName = (e) => {
    const inputText = e.target.value;
    dispatch(setPickupName(inputText));
  };

  const handlePickupAddress = (e) => {
    const inputText = e.target.value;
    dispatch(setPickupAddress(inputText));
  };

  const handlePickupInstruction = (e) => {
    const inputText = e.target.value;
    dispatch(setpickupInstruction(inputText));
  };

  return (
    <Box>
      <SoftBox className="vendors-filter-div">
        <Grid container p={2}>
          <Grid item md={12} sm={12} xs={12} mt={2} ml={-0.5}>
            <SoftTypography fontSize="16px" fontWeight="bold">
              Add pickup location
            </SoftTypography>
          </Grid>
          <Grid item md={12} sm={12} xs={12} mt={2} ml={-0.5}>
            <SoftTypography fontSize="16px">
              Add details for this location. Customers will see these at Checkout, the Thank You page, and order
              confirmation email.
            </SoftTypography>
          </Grid>
          <Grid item md={12} sm={12} xs={12} mt={2}>
            <SoftBox mb={1} display="flex">
              <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>Pickup name</InputLabel>
            </SoftBox>
            <SoftBox display="flex" alignItems="center" gap="10px" width="220px">
              <SoftInput value={pickUpName} id="pickup-name" type="text" onChange={(e) => handlePickupName(e)} />
            </SoftBox>
          </Grid>
          <Grid item md={12} sm={12} xs={12} mt={2}>
            <SoftBox mb={1} display="flex">
              <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>Pickup address</InputLabel>
            </SoftBox>
            <SoftBox display="flex" alignItems="center" gap="10px" width="220px">
              <SoftInput
                type="text"
                id="pickup-address"
                placeholder="Enter street Address "
                onChange={(e) => handlePickupAddress(e)}
                value={pickUpAddress}
              />
            </SoftBox>
          </Grid>
          <Grid item md={12} sm={12} xs={12} mt={2}>
            <SoftBox mb={1} display="flex">
              <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                Pickup instructions
              </InputLabel>
            </SoftBox>
            <SoftBox display="flex" alignItems="center" gap="10px" width="220px">
              <SoftInput
                type="text"
                id="pickup-instruction"
                placeholder="Search Address "
                onChange={(e) => handlePickupInstruction(e)}
                value={pickUpInstruction}
              />
            </SoftBox>
          </Grid>
        </Grid>
      </SoftBox>
    </Box>
  );
};

export default PickupLocation;
