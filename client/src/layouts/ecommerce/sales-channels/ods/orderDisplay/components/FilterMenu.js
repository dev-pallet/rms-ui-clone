import './FilterMenu.css';
import { components } from 'react-select';
import { filterCutoff } from '../../../../../../config/Services';
import { useMemo, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useSnackbar } from '../../../../../../hooks/SnackbarProvider';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import SkeletonLoader from './SkeletonLoader';
import SoftButton from '../../../../../../components/SoftButton';
import SoftDatePicker from '../../../../../../components/SoftDatePicker';
import SoftInput from '../../../../../../components/SoftInput';
import SoftSelect from '../../../../../../components/SoftSelect';
import moment from 'moment';

const convertToIST = (date) => new Date(date?.getTime() - date?.getTimezoneOffset() * 60000)?.toISOString();
const convertToLocalDate = (time) => moment.utc(time).local().format('LL');
const convertToLocalTime = (time) => moment.utc(time).local().format('LT');

const FilterMenu = ({ filters, setFilters, payload, setPayload }) => {
  const showSnackbar = useSnackbar();
  const [slots, setSlots] = useState([]);

  const isDateSelected = useMemo(() => filters.fromDate && filters.toDate, [filters.fromDate, filters.toDate]);

  const slotListQuery = useMutation({
    mutationFn: (cutoffPayload) => filterCutoff(cutoffPayload),
    refetchOnWindowFocus: false,
    onSuccess: (response) => {
      if (response?.data?.data?.es) {
        showSnackbar(response?.data?.data?.message, 'error');
        return;
      }
      const slots = response?.data?.data?.data?.map((cutoffItem) => ({
        label: cutoffItem?.slot?.day,
        value: cutoffItem?.slot?.slotId,
        day: convertToLocalDate(cutoffItem?.slot?.startTime),
        startTime: convertToLocalTime(cutoffItem?.slot?.startTime),
        endTime: convertToLocalTime(cutoffItem?.slot?.endTime),
      }));
      setSlots(slots);
    },
    onError: (error) => {
      showSnackbar(error?.response?.data?.message || error?.message, 'error');
    },
  });

  const handleDateChange = (date, name) => {
    const tempFilters = { ...filters, [name]: date[0] ? convertToIST(date[0]) : null };

    if (tempFilters.fromDate && tempFilters.toDate) {
      slotListQuery?.mutate({
        slotStartTime: tempFilters?.fromDate,
        slotEndTime: tempFilters?.toDate,
      });
    }
    setFilters(tempFilters);
  };

  const handleSlotChange = (slotArray) => {
    setFilters({
      ...filters,
      slotList: slotArray,
    });
  };

  const formatOptionLabel = ({ label, day, startTime, endTime }) => (
    <div className="select-option-container">
      <div className="select-option-title">{label}</div>
      <div className="select-option-body">
        <div>{day}</div>
        <div>
          {startTime} - {endTime}
        </div>
      </div>
    </div>
  );

  const MultiValueLabel = (props) => {
    return (
      <components.MultiValueLabel {...props}>
        <div>{props.data.label}</div>
      </components.MultiValueLabel>
    );
  };

  const resetValues = () => {
    setFilters({
      searchText: '',
      fromDate: null,
      toDate: null,
      slotList: [],
    });
  };

  const applyFilters = () => {
    const slotIds = filters?.slotList?.map((slot) => slot?.value);
    setPayload({
      ...payload,
      orderId: filters?.searchText,
      slotIds: slotIds,
    });
  };

  return (
    <div className="board-filter-menu-container">
      <div className="board-filter-search-box">
        <div className="board-filter-search-title">Search</div>
        <SoftInput
          className="board-filter-search-input"
          label="Search"
          placeholder="Search by order id/token no."
          value={filters?.searchText}
          onChange={(event) => setFilters({ ...filters, searchText: event.target.value })}
        />
      </div>
      <div className="board-filter-date-box">
        <div className="board-filter-date-title">Date</div>
        <div className="board-filter-date-inputs">
          <SoftDatePicker
            input={{ placeholder: 'From' }}
            options={{ dateFormat: 'd-m-y' }}
            value={filters?.fromDate}
            onChange={(value) => handleDateChange(value, 'fromDate')}
            className="board-filter-menu-item"
          />
          <ArrowRightAltIcon fontSize="medium" />
          <SoftDatePicker
            input={{ placeholder: 'To' }}
            options={{ dateFormat: 'd-m-y' }}
            value={filters?.toDate}
            onChange={(value) => handleDateChange(value, 'toDate')}
            className="board-filter-menu-item"
          />
        </div>
      </div>
      <div className="board-filter-slot-box">
        <div className="board-filter-slot-title">Time Slot</div>
        {slotListQuery?.isLoading ? (
          <SkeletonLoader type="single-item" />
        ) : (
          <SoftSelect
            isMulti
            components={{ MultiValueLabel }}
            options={slots}
            value={filters?.slotList}
            onChange={handleSlotChange}
            formatOptionLabel={formatOptionLabel}
            menuPortalTarget={document.body}
            placeholder={isDateSelected ? 'Select Slots' : 'Select date range to view slots'}
            className={`board-filter-menu-item ${!isDateSelected && 'board-filter-select-disabled'}`}
            classNamePrefix="soft-select"
          />
        )}
      </div>
      <div className="board-filter-apply-box">
        <SoftButton variant="outlined" color="error" onClick={resetValues}>
          Clear
        </SoftButton>
        <SoftButton variant="gradient" color="info" onClick={applyFilters}>
          Apply
        </SoftButton>
      </div>
    </div>
  );
};

export default FilterMenu;
