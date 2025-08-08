import 'react-datepicker/dist/react-datepicker.css';
import { Tooltip } from '@mui/material';
import {
  getSameDeliveryYear,
  setDeliverySlots,
  setSameDeliveryYear,
} from '../../../../../../../datamanagement/serviceSlice';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import DatePicker from 'react-datepicker';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import React, { useEffect, useState } from 'react';

const DeliverySlotsMonday = () => {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const dispatch = useDispatch();
  const [transformedData, setTransformedData] = useState([]);
  const sameYearCheckBoxValue = useSelector(getSameDeliveryYear);

  const calculateDynamicStartTime = (dayIndex, slotIndex) => {
    const currentDate = new Date();
    const currentDayOfWeek = currentDate.getDay();
    const daysToAdd = (dayIndex + 7 - currentDayOfWeek) % 7;
    const startHour = 9 + slotIndex; // Starting from 9 AM, incrementing by slotIndex
    return new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + daysToAdd, startHour, 0);
  };

  const calculateDynamicEndTime = (prevEndTime, slotIndex) => {
    const newEndTime = new Date(prevEndTime);
    newEndTime.setHours(newEndTime.getHours() + 1 * (slotIndex + 1)); // Increment by 1 hour for each slot
    return newEndTime;
  };

  const initialSchedule = daysOfWeek.map((day, dayIndex) => ({
    day,
    selected: false,
    commonProperties: {
      cutoffTime: '',
      sameDeliveryAllYear: false,
    },
    slots: [
      {
        id: Date.now(),
        startTime: calculateDynamicStartTime(dayIndex, 0),
        endTime: calculateDynamicEndTime(calculateDynamicStartTime(dayIndex, 0), 0),
        orderCapacity: '',
      },
    ],
  }));

  const [schedule, setSchedule] = useState(initialSchedule);
  const [commonProperties, setCommonProperties] = useState({
    sameDeliveryAllYear: false,
    cutoffTime: '',
  });

  const handleCheckboxChange = (dayIndex) => {
    setSchedule((prevSchedule) =>
      prevSchedule.map((day, index) => (index === dayIndex ? { ...day, selected: !day.selected } : day)),
    );
  };

  const handleCommonCheckboxChange = (e) => {
    const inputValue = e.target.checked;
    dispatch(setSameDeliveryYear(inputValue));
  };

  const handleCommonCutoffChange = (value) => {
    setCommonProperties((prevCommonProperties) => ({
      ...prevCommonProperties,
      cutoffTime: value,
    }));

    // Update cutoffTime in each slot
    setSchedule((prevSchedule) =>
      prevSchedule.map((day) => ({
        ...day,
        commonProperties: {
          ...day.commonProperties,
          cutoffTime: value,
        },
      })),
    );
  };

  const handleTimeChange = (dayIndex, slotIndex, field, date) => {
    setSchedule((prevSchedule) =>
      prevSchedule.map((day, index) =>
        index === dayIndex
          ? {
            ...day,
            slots: day.slots.map((slot, i) => (i === slotIndex ? { ...slot, [field]: date } : slot)),
          }
          : day,
      ),
    );
  };

  const handleAddSlot = (dayIndex) => {
    setSchedule((prevSchedule) =>
      prevSchedule.map((day, index) =>
        index === dayIndex
          ? {
            ...day,
            slots:
                day.slots.length < 8
                  ? [
                    ...day.slots,
                    {
                      id: Date.now(),
                      startTime: day.slots[day.slots.length - 1].endTime, // Set start time as the previous slot's end time
                      endTime: new Date(
                        day.slots[day.slots.length - 1].endTime.getTime() +
                            (day.slots[day.slots.length - 1].endTime - day.slots[day.slots.length - 1].startTime),
                      ),
                      orderCapacity: day.slots[day.slots.length - 1].orderCapacity, // Copy the order capacity from the last slot
                    },
                  ]
                  : day.slots,
          }
          : day,
      ),
    );
  };

  const handleDeleteSlot = (dayIndex, slotId) => {
    setSchedule((prevSchedule) =>
      prevSchedule.map((day, index) =>
        index === dayIndex
          ? {
            ...day,
            slots: day.slots.length > 1 ? day.slots.filter((slot) => slot.id !== slotId) : day.slots,
          }
          : day,
      ),
    );
  };

  const handleUpdateSlot = (dayIndex, slotIndex, field, value) => {
    setSchedule((prevSchedule) =>
      prevSchedule.map((day, index) =>
        index === dayIndex
          ? {
            ...day,
            slots: day.slots.map((slot) =>
              slot.id === prevSchedule[dayIndex].slots[slotIndex].id ? { ...slot, [field]: value } : slot,
            ),
          }
          : day,
      ),
    );
  };

  useEffect(() => {
    const newData = schedule.flatMap((day) => {
      if (day.selected) {
        return day.slots.map((slot) => ({
          startTime: slot.startTime.toISOString(),
          endTime: slot.endTime.toISOString(),
          processingTime: day.commonProperties.cutoffTime || 0,
          ordersCapacity: slot.orderCapacity ? parseInt(slot.orderCapacity) : 0,
          orderItemCapacity: slot.orderCapacity ? slot.orderCapacity * 50 : 0,
          sourceId: orgId,
          sourceLocationId: locId,
          orgId: orgId,
          createdBy: 'string',
        }));
      }
      return [];
    });

    setTransformedData(newData);
    dispatch(setDeliverySlots(newData));
  }, [dispatch, orgId, locId, schedule]);

  return (
    <div className="schedule-container">
      {schedule.map((day, dayIndex) => (
        <div key={dayIndex} className="day-container">
          <div className="header">
            <div>
              <label>
                <input type="checkbox" checked={day.selected} onChange={() => handleCheckboxChange(dayIndex)} />
              </label>
            </div>
            <div>
              <h5 className="day-text">{day.day}</h5>
            </div>
          </div>

          {day.selected && (
            <div className="main-wrapper-label-container">
              <div className="label-container">
                <div className="label">Start Time</div>
                <div className="label-I">End Time</div>
                <div className="label-II">Order Capacity</div>
              </div>
              {day.slots.map((slot, slotIndex) => (
                <div key={slot.id} className="slot-container">
                  <div className="time-picker">
                    <DatePicker
                      selected={slot.startTime}
                      onChange={(date) => handleTimeChange(dayIndex, slotIndex, 'startTime', date)}
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={15}
                      timeFormat="h:mm aa"
                      dateFormat="h:mm aa"
                      className="datepicker-comp"
                    />
                  </div>
                  <div className="time-pickerI">
                    <DatePicker
                      selected={slot.endTime}
                      onChange={(date) => handleTimeChange(dayIndex, slotIndex, 'endTime', date)}
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={15}
                      timeFormat="h:mm aa"
                      dateFormat="h:mm aa"
                      className="datepicker-comp"
                    />
                  </div>
                  <div className="time-pickerII">
                    <input
                      type="number"
                      className="orderCapxity-input"
                      value={slot.orderCapacity}
                      onChange={(e) => handleUpdateSlot(dayIndex, slotIndex, 'orderCapacity', e.target.value)}
                    />
                  </div>
                  <span className="delete-icon" onClick={() => handleDeleteSlot(dayIndex, slot.id)}>
                    &#10006;
                  </span>
                </div>
              ))}
              {day.slots.length < 8 && (
                <button onClick={() => handleAddSlot(dayIndex)} className="add-more-btn">
                  Add More
                </button>
              )}
            </div>
          )}
        </div>
      ))}

      <div className="common-properties">
        <div className="common-prop-wrapper-box">
          <label>
            <input type="checkbox" checked={sameYearCheckBoxValue} onChange={handleCommonCheckboxChange} />
          </label>
          <h5 className="day-textI">
            Choosing a uniform delivery schedule for the entire year ensures consistent service across all seasons
          </h5>
        </div>
      </div>
      <div className="common-prop-wrapper-box">
        <span style={{ fontSize: '0.85rem', marginLeft: '10px' }}>
          Cut-off Time{' '}
          <Tooltip mt={3} title="Time taken to process your orders.">
            <InfoOutlinedIcon fontSize="small" color={'info'} />{' '}
          </Tooltip>
        </span>
        <label>
          <input
            className="cut-off-input"
            type="number"
            value={commonProperties.cutoffTime}
            onChange={(e) => handleCommonCutoffChange(e.target.value)}
          />
        </label>
      </div>
    </div>
  );
};

export default DeliverySlotsMonday;
