import 'react-datepicker/dist/react-datepicker.css';
import { Tooltip } from '@mui/material';
import {
  getDeliverySlots,
  getRegionId,
  getSameDeliveryYear,
  setDeliverySlots,
} from '../../../../../../../datamanagement/serviceSlice';
import { getSlotData } from '../../../../../../../config/Services';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import DatePicker from 'react-datepicker';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import React, { useEffect, useState } from 'react';
import moment from 'moment';

const DeliverySlotsMondayCopy = () => {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const dispatch = useDispatch();
  const [transformedData, setTransformedData] = useState([]);
  const id = useSelector(getRegionId);
  const [cutoffArray, setcutoffArray] = useState([]);
  const sameYearCheckBoxValue = useSelector(getSameDeliveryYear);
  const [commonProperties, setCommonProperties] = useState({
    sameDeliveryAllYear: false,
    cutoffTime: 0,
  });

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

  //to get slot data changing the apis array here
  useEffect(() => {
    getSlotData(slotPayload).then((res) => {
      setcutoffArray(res?.data?.data?.data);
      dispatch(setDeliverySlots(res?.data?.data?.data));
    });
  }, []);

  const newArray = useSelector(getDeliverySlots);

  const calculateDynamicStartTime = (dayIndex, slotIndex) => {
    const currentDate = new Date();
    const currentDayOfWeek = currentDate.getDay();
    const daysToAdd = (dayIndex + 7 - currentDayOfWeek) % 7;
    const startHour = 9; // Always start from 9 AM

    // Create a new Date object for the start time
    const adjustedStartTime = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() + (dayIndex < currentDayOfWeek ? daysToAdd + 7 : daysToAdd), // Adjust daysToAdd for the new day
      startHour + slotIndex, // Incrementing by slotIndex
      0,
    );

    // Add 5 hours and 30 minutes to the start time
    adjustedStartTime.setHours(adjustedStartTime.getHours() + 5);
    adjustedStartTime.setMinutes(adjustedStartTime.getMinutes() + 30);

    return adjustedStartTime;
  };

  const calculateDynamicEndTime = (prevEndTime, slotIndex) => {
    const newEndTime = new Date(prevEndTime);
    newEndTime.setHours(newEndTime.getHours() + 1 * (slotIndex + 1)); // Increment by 1 hour for each slot

    // Add 5 hours and 30 minutes to the end time
    newEndTime.setHours(newEndTime.getHours() + 5);
    newEndTime.setMinutes(newEndTime.getMinutes() + 30);

    return newEndTime;
  };

  const initialSchedule = daysOfWeek.map((day) => {
    const matchingSlots = newArray.filter(
      (slot) => slot.slot && slot.slot.day && slot.slot.day.toUpperCase() === day.toUpperCase(),
    );

    const hasSlots = matchingSlots.length > 0;

    return {
      day,
      selected: hasSlots,
      commonProperties: {
        cutoffTime: hasSlots ? matchingSlots[0]?.slot?.processingTime : '', // Use the first matching slot's processingTime as cutoffTime
        sameDeliveryAllYear: false,
      },
      slots: hasSlots
        ? matchingSlots.map((slot) => {
          const startTime = new Date(slot.slot.startTime);
          const endTime = new Date(slot.slot.endTime);

          // Extract slotId and processingTime from newArray
          const correspondingSlotInfo = newArray.find((s) => s.slot.slotId === slot.slot.slotId);
          const slotId = correspondingSlotInfo.slot.slotId;
          const processingTime = correspondingSlotInfo.slot.processingTime;

          // Add 5 hours and 30 minutes to the start and end times
          startTime.setHours(startTime.getHours() + 5);
          startTime.setMinutes(startTime.getMinutes() + 30);

          endTime.setHours(endTime.getHours() + 5);
          endTime.setMinutes(endTime.getMinutes() + 30);

          return {
            id: Date.now(),
            startTime,
            endTime,
            orderCapacity: slot && slot?.capacity,
            slotId,
            processingTime,
          };
        })
        : [
          // Create a default slot with 9:00 AM - 10:00 AM if no slots exist
          {
            id: Date.now(),
            startTime: new Date().toISOString(), // Set to current time
            endTime: new Date(new Date().getTime() + 60 * 60 * 1000).toISOString(), // Set to 1 hour from current time
            orderCapacity: '',
            slotId: 0, // You might want to adjust this default value based on your logic
            processingTime: 0, // You might want to adjust this default value based on your logic
          },
        ],
    };
  });

  const [schedule, setSchedule] = useState(initialSchedule);

  // Modify createDefaultSlot function
  const createDefaultSlot = (dayIndex, slotIndex, day) => {
    const isUncheckedDay = !day || !day.selected;

    // Define a consistent time format
    const timeFormat = 'HH:mm';

    if (slotIndex === 0) {
      // For the first slot, set the start time to 9:00 AM and end time to 10:00 AM
      const startTime = isUncheckedDay
        ? '09:00'
        : calculateDynamicStartTime(dayIndex, slotIndex, null).format(timeFormat);
      const endTime = isUncheckedDay
        ? '10:00'
        : moment(startTime, timeFormat)
          .add(1, 'hour') // Increment by 1 hour
          .format(timeFormat);

      return {
        id: `slot_${dayIndex}_${slotIndex}_${Date.now()}`,
        startTime: moment(startTime, timeFormat).toDate(),
        endTime: moment(endTime, timeFormat).toDate(),
        orderCapacity: '',
      };
    } else if (day && day.slots && day.slots.length > 0) {
      const lastSlotEndTime = day.slots[day.slots.length - 1].endTime;

      const startTime = moment(lastSlotEndTime, timeFormat)
        .add(
          moment(lastSlotEndTime, timeFormat).diff(moment(lastSlotEndTime, timeFormat).startOf('hour'), 'hours'),
          'hours',
        )
        .format(timeFormat);

      const endTime = moment(startTime, timeFormat)
        .add(1, 'hour') // Increment by 1 hour
        .format(timeFormat);

      return {
        id: `slot_${dayIndex}_${slotIndex}_${Date.now()}`,
        startTime: moment(startTime, timeFormat).toDate(),
        endTime: moment(endTime, timeFormat).toDate(),
        orderCapacity: day.slots[day.slots.length - 1].orderCapacity || '',
      };
    }

    const defaultStartTime = isUncheckedDay
      ? '09:00'
      : calculateDynamicStartTime(dayIndex, slotIndex, null).format(timeFormat);
    const defaultEndTime = isUncheckedDay
      ? '10:00'
      : moment(defaultStartTime, timeFormat)
        .add(1, 'hour') // Increment by 1 hour
        .format(timeFormat);

    return {
      id: `slot_${dayIndex}_${slotIndex}_${Date.now()}`,
      startTime: moment(defaultStartTime, timeFormat).toDate(),
      endTime: moment(defaultEndTime, timeFormat).toDate(),
      orderCapacity: day.slots[day.slots.length - 1].orderCapacity || 'default_value',
    };
  };

  const handleCheckboxChange = (dayIndex) => {
    setSchedule((prevSchedule) =>
      prevSchedule.map((day, index) =>
        index === dayIndex
          ? {
            ...day,
            selected: !day.selected,
            slots: day.selected ? [] : [createDefaultSlot(dayIndex, 0)],
          }
          : day,
      ),
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
            slots: day.slots.map((slot, i) =>
              i === slotIndex
                ? {
                  ...slot,
                  [field]: moment(date).toDate(), // Convert to JavaScript Date object
                }
                : slot,
            ),
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
                day.slots.length < 8 ? [...day.slots, createDefaultSlot(dayIndex, day.slots.length, day)] : day.slots,
          }
          : day,
      ),
    );
  };

  const handleDeleteSlot = (dayIndex, slotIndex) => {
    setSchedule((prevSchedule) =>
      prevSchedule.map((day, index) =>
        index === dayIndex
          ? {
            ...day,
            slots: day.slots.length > 1 ? day.slots.filter((slot, i) => i !== slotIndex) : day.slots,
          }
          : day,
      ),
    );
  };

  const convertToCutoffArray = (slotsArray) => {
    return slotsArray.map((slot) => {
      const dayOfWeek = moment(slot.startTime).format('dddd').toUpperCase();
      const selectedDayIndex = daysOfWeek.indexOf(dayOfWeek);
      const daysToAdd = selectedDayIndex >= 0 ? selectedDayIndex : 0;

      return {
        cutoffId: slot.cutoffId || (slot.slotId ? `CTF${slot.slotId.substring(4)}` : null),
        sourceId: slot.sourceId,
        sourceLocationId: slot.sourceLocationId,
        orgId: slot.orgId,
        pickUpTat: 0,
        transportDateTime: moment(slot.startTime)
          .subtract(slot.processingTime, 'minutes')
          .add(daysToAdd, 'days')
          .toISOString(),
        orderDateTime: moment(slot.startTime)
          .subtract(slot.processingTime, 'minutes')
          .add(daysToAdd, 'days')
          .toISOString(),
        capacity: slot.ordersCapacity || (slot.slot ? slot.slot.capacity : 0), // Use the correct property name
        consumedCapacity: 0,
        priorityCapacity: 0,
        priorityConsumedCapacity: 0,
        sameSlotEveryDay: false,
        slot: {
          slotId: slot.slotId || (slot.slot ? slot.slot.slotId : null),
          day: dayOfWeek,
          startTime: moment(slot.startTime).format('YYYY-MM-DDTHH:mm:ss'),
          endTime: moment(slot.endTime).format('YYYY-MM-DDTHH:mm:ss'),
          processingTime: slot.processingTime,
          consumedCapacity: 0,
          orderItemCapacity: 0,
          availableCapacity: 0,
          isAvailable: true,
          createdAt: moment().toISOString(),
          modifiedAt: moment().toISOString(),
          createdBy: slot.createdBy,
          modifiedBy: slot.modifiedBy,
        },
      };
    });
  };

  const handleUpdateSlot = (dayIndex, slotIndex, field, value) => {
    setSchedule((prevSchedule) =>
      prevSchedule.map((day, index) =>
        index === dayIndex
          ? {
            ...day,
            slots: day.slots.map((slot) =>
              slot.id === prevSchedule[dayIndex].slots[slotIndex].id
                ? { ...slot, [field]: field === 'orderCapacity' ? parseInt(value, 10) : value }
                : slot,
            ),
          }
          : day,
      ),
    );
  };

  useEffect(() => {
    const newData = schedule.flatMap((day) => {
      if (day.selected) {
        return day.slots.map((slot, slotIndex) => {
          // Find the corresponding item in the cutoffArray
          const correspondingCutoff = cutoffArray.find((cutoff) => cutoff.slot.slotId === slot.slotId);

          // Use the capacity from cutoffArray or default to 0
          const capacityorder = correspondingCutoff ? correspondingCutoff.capacity : 0;

          // Map startTime, endTime, and day from newArray or slot.slot object
          const startTime = correspondingCutoff ? correspondingCutoff.slot.startTime : moment(new Date()).toISOString();
          const endTime = correspondingCutoff ? correspondingCutoff.slot.endTime : moment(new Date()).toISOString();
          const dayOfWeek = correspondingCutoff ? correspondingCutoff.slot.day.toUpperCase() : day.day.toUpperCase();

          return {
            ...correspondingCutoff,
            cutoffId: slot?.cutoffId || (slot?.slotId ? `CTF${slot?.slotId.substring(4)}` : null), // You might want to adjust this default value based on your logic
            consumedCapacity: 0, // Use the correct property name
            priorityCapacity: 0,
            priorityConsumedCapacity: 0,
            capacity: slot.ordersCapacity || (slot.slot ? slot.slot.capacity : 0),
            sameSlotEveryDay: false,
            slot: {
              slotId: slot.slotId || (slot.slot ? slot.slot.slotId : null),
              day: dayOfWeek,
              startTime,
              endTime,
              processingTime: day.commonProperties.cutoffTime || 0,
              consumedCapacity: 0,
              orderItemCapacity: 0,
              availableCapacity: 0,
              isAvailable: true,
              createdAt: moment().toISOString(),
              modifiedAt: moment().toISOString(),
              createdBy: 'string',
              modifiedBy: slot.modifiedBy,
            },
          };
        });
      } else if (day.selected && !day.slots.length) {
        // Day is checked, but no slots are added, add a default entry with formatted time
        const uncheckedDay = {
          cutoffId: null,
          sourceId: orgId,
          sourceLocationId: locId,
          orgId: orgId,
          pickUpTat: 0,
          transportDateTime: moment(new Date()).toISOString(),
          orderDateTime: moment(new Date()).toISOString(),
          consumedCapacity: 0,
          priorityCapacity: 0,
          priorityConsumedCapacity: 0,
          sameSlotEveryDay: false,
          slot: {
            slotId: null,
            day: day.day.toUpperCase(),
            startTime: moment(new Date()).toISOString() || null,
            endTime: moment(new Date()).toISOString() || null,
            processingTime: day.commonProperties.cutoffTime || 0,
            consumedCapacity: 0,
            orderItemCapacity: 0,
            availableCapacity: 0,
            isAvailable: true,
            createdAt: moment().toISOString(),
            modifiedAt: moment().toISOString(),
            createdBy: null,
            modifiedBy: null,
          },
        };

        return [uncheckedDay];
      }

      return [];
    });

    dispatch(setDeliverySlots(newData));
  }, [orgId, locId, schedule, cutoffArray]);

  const convertedCutoffArray = convertToCutoffArray(newArray);

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
              {day.slots.map((slot, slotIndex) => {
                return (
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
                        value={slot.orderCapacity || null} // Adjust the path as needed
                        onChange={(e) => handleUpdateSlot(dayIndex, slotIndex, 'orderCapacity', e.target.value)}
                      />
                    </div>
                    <span className="delete-icon" onClick={() => handleDeleteSlot(dayIndex, slotIndex)}>
                      &#10006;
                    </span>
                  </div>
                );
              })}
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

export default DeliverySlotsMondayCopy;
