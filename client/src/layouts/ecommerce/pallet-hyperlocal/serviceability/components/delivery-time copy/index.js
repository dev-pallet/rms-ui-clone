import './index.css';
import { Box, FormControlLabel, Grid, Radio, RadioGroup, Tooltip } from '@mui/material';
import {
  getDeliverySlots,
  getInstantDelivery,
  setDeliverySlots,
  setInstantDelivery,
} from '../../../../../../datamanagement/serviceSlice';
import { useDispatch } from 'react-redux';
import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import DeliverySlotsMondayCopy from './day-wise/deliverySlotsMon';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import InstantDelivery from './instantDelivery';
import SoftBox from '../../../../../../components/SoftBox';
import SoftTypography from '../../../../../../components/SoftTypography';

const DeliveryTimeEdit = () => {
  const [selectedOption, setSelectedOption] = useState('instantDelivery');
  const dispatch = useDispatch();

  const deliverySlotsArray = useSelector(getDeliverySlots);
  const instantDelivery = useSelector(getInstantDelivery);

  useMemo(() => {
    if (deliverySlotsArray.length > 0) {
      setSelectedOption('deliverySlots');
    }
  }, [deliverySlotsArray]);

  const handleOptionChange = (event) => {
    if (selectedOption === 'instantDelivery') {
      dispatch(setDeliverySlots([]));
      dispatch(
        setInstantDelivery([
          { instantDeliveryStartTime: '', instantDeliveryEndTime: '', instantDeliveryOrderCapacity: '' },
        ]),
      );
    } else if (selectedOption === 'deliverySlots') {
      dispatch(
        setInstantDelivery([
          { instantDeliveryStartTime: '', instantDeliveryEndTime: '', instantDeliveryOrderCapacity: '' },
        ]),
      );
    }
    setSelectedOption(event.target.value);
  };

  return (
    <Box>
      <SoftBox className="vendors-filter-div">
        <Grid container p={2}>
          <Grid item md={12} sm={12} xs={12} mt={2} ml={-0.5}>
            <SoftTypography fontSize="16px" fontWeight="bold">
              Delivery Time
            </SoftTypography>
          </Grid>
          <Grid item md={12} sm={12} xs={12} mt={2}>
            <RadioGroup
              row
              aria-labelledby="demo-radio-buttons-group-label"
              name="range"
              value={selectedOption}
              onChange={handleOptionChange}
            >
              <FormControlLabel
                value="instantDelivery"
                control={<Radio size="small" />}
                label={<span style={{ fontSize: '0.75rem' }}>Instant Delivery</span>}
              />
              <span style={{ marginRight: '20px' }}></span>
              <FormControlLabel
                value="deliverySlots"
                control={<Radio size="small" />}
                label={<span style={{ fontSize: '0.75rem' }}>Delivery Slots</span>}
              />
            </RadioGroup>
          </Grid>
          <Grid item md={12} sm={12} xs={12} mt={2}>
            <InstantDelivery />

            <>
              <SoftBox display="flex" gap={2}>
                <SoftTypography fontSize="16px" fontWeight="bold">
                  Set days and time slots
                </SoftTypography>
                <Tooltip title="These are the delivery time slots customers will choose from at checkout. You can add multiple time slots per day.">
                  <InfoOutlinedIcon fontSize="small" color={'info'} />
                </Tooltip>
              </SoftBox>
              <DeliverySlotsMondayCopy />
            </>
          </Grid>
        </Grid>
      </SoftBox>
    </Box>
  );
};

export default DeliveryTimeEdit;
