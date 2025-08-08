import './index.css';
import { Grid, InputLabel } from '@mui/material';
import { getInstantDelivery, setInstantDelivery } from '../../../../../../datamanagement/serviceSlice';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import DatePicker from 'react-datepicker';
import DeliveryTypeCondition from '../delivery-condition';
import SoftBox from '../../../../../../components/SoftBox';
import dayjs from 'dayjs';
import moment from 'moment';
import utc from 'dayjs/plugin/utc';

const InstantDelivery = () => {
  dayjs.extend(utc);
  const [selectedOption, setSelectedOption] = useState('same');
  const [cutOffTime, setCutOffTime] = useState('');
  const dispatch = useDispatch();
  const instantDelivery = useSelector(getInstantDelivery);

  const convertToUTC = (date) => {
    return moment(new Date(date)).utc(false).format('HH:mm:ss');
  };

  useEffect(() => {
    if (instantDelivery?.length <= 0) {
      return;
    }
    const temp = instantDelivery[0];
    setSelectedOption(temp?.instantDeliveryDay === 1 ? 'next' : temp?.instantDeliveryDay === 2 ? 'mini' : 'same');
    setCutOffTime(temp?.instantDeliveryCutoff);
  }, [instantDelivery]);

  const hanldeInstantDeliveryTime = (newTime, index, type) => {
    const convertedTime = convertToUTC(newTime);
    const updatedArray = instantDelivery.map((delivery, i) => {
      if (i === index && type == 'start') {
        return {
          ...delivery,
          instantDeliveryStartTime: convertedTime,
        };
      } else if (i === index && type == 'end') {
        return {
          ...delivery,
          instantDeliveryEndTime: convertedTime,
        };
      }
      return delivery;
    });

    dispatch(setInstantDelivery(updatedArray));
  };

  const handleInputChange = (event, index) => {
    const { name, value } = event.target;
    const updatedArray = instantDelivery.map((delivery, i) => {
      if (i === index) {
        return {
          ...delivery,
          [name]: value === '' ? '' : Number(value),
        };
      }
      return delivery;
    });

    dispatch(setInstantDelivery(updatedArray));
  };

  const handleCutOffTimeChange = (event) => {
    const { value } = event.target;
    setCutOffTime(value);

    const updatedArray = instantDelivery.map((delivery) => ({
      ...delivery,
      instantDeliveryCutoff: value,
      instantDeliveryDay: getInstantDeliveryDay(selectedOption),
    }));

    dispatch(setInstantDelivery(updatedArray));
  };

  const getInstantDeliveryDay = (option) => {
    if (option === 'same') {
      return 0;
    } else if (option === 'next') {
      return 1;
    } else {
      return 2;
    }
  };

  const handleSelectOptionChange = (event) => {
    const { value } = event.target;
    setSelectedOption(value);
  };

  const convertUTCToIST = (time) => {
    // Parse the UTC time string
    const utcTime = moment.utc(time, 'HH:mm:ss');

    // Convert to IST (UTC+5:30)
    const istTime = utcTime.clone().utcOffset('+05:30');

    // Format the IST time
    return istTime.format('hh:mm A');
  };

  return (
    <Grid container spacing={3}>
      {instantDelivery.map((delivery, index) => {
        return (
          <div className="insatnt-wrapper-box">
            <Grid item xs={2} sm={2} md={2} xl={3}>
              <SoftBox mb={1} display="flex">
                <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                  Start Time
                </InputLabel>
              </SoftBox>
              <SoftBox display="flex" alignItems="center">
                <div className="date-picker-wrapper">
                  <DatePicker
                    value={
                      moment(delivery?.instantDeliveryStartTime, 'HH:mm:ss', true).isValid()
                        ? convertUTCToIST(delivery?.instantDeliveryStartTime)
                        : '--:--'
                    }
                    onChange={(newTime) => hanldeInstantDeliveryTime(newTime, index, 'start')}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={15}
                    timeFormat="HH:mm aa"
                    dateFormat="HH:mm aa"
                    className="datepicker-compI"
                  />
                </div>
              </SoftBox>
            </Grid>
            <Grid item xs={2} sm={2} md={2} xl={3}>
              <SoftBox mb={1} display="flex">
                <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                  End Time
                </InputLabel>
              </SoftBox>
              <SoftBox display="flex" alignItems="center">
                <div className="date-picker-wrapper">
                  <DatePicker
                    value={
                      moment(delivery?.instantDeliveryEndTime, 'HH:mm:ss', true).isValid()
                        ? convertUTCToIST(delivery?.instantDeliveryEndTime)
                        : '--:--'
                    }
                    onChange={(newTime) => hanldeInstantDeliveryTime(newTime, index, 'end')}
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={15}
                    timeFormat="h:mm aa"
                    dateFormat="h:mm aa"
                    className="datepicker-compI"
                  />
                </div>
              </SoftBox>
            </Grid>
            <Grid item xs={2} sm={2} md={2}>
              <SoftBox mb={1} display="flex" width="250px">
                <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                  Order Capacity
                </InputLabel>
              </SoftBox>
              <SoftBox display="flex" alignItems="center" className="instant-service-inout-box">
                <input
                  type="number"
                  className="instant-service-inout-feild"
                  value={delivery?.instantDeliveryOrderCapacity || ''}
                  onChange={(event) => handleInputChange(event, index)}
                  name="instantDeliveryOrderCapacity"
                />
              </SoftBox>
            </Grid>
            <Grid item xs={2} sm={2} md={2}>
              <SoftBox mb={1} display="flex" width="250px">
                <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                  Packing time (mins)
                </InputLabel>
              </SoftBox>
              <SoftBox display="flex" alignItems="center" className="instant-service-inout-box">
                <input
                  type="number"
                  className="instant-service-inout-feild"
                  value={delivery?.packingTime || ''}
                  onChange={(event) => handleInputChange(event, index)}
                  name="packingTime"
                />
              </SoftBox>
            </Grid>
          </div>
        );
      })}
      <DeliveryTypeCondition
        selectedOption={selectedOption}
        cutOffTime={cutOffTime}
        onCutOffTimeChange={handleCutOffTimeChange}
        onSelectOptionChange={handleSelectOptionChange}
      />
    </Grid>
  );
};

export default InstantDelivery;
