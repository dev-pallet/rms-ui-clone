import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SoftBox from '../../../../../components/SoftBox';
import SoftSelect from '../../../../../components/SoftSelect';
import { getFiltersStateData, setFilters, setFilterStateData } from '../../../../../datamanagement/Filters/commonFilterSlice';
import Filter from '../../../Common/Filter';
import {
  EndDateSelect,
  FilterChipDisplayBox,
  filterStateAndFiltersAppliedHandleFn,
  StartDateSelect
} from '../../../Common/Filter Components/filterComponents';

export default function ExpressPurchaseFilter({
  filterObject, // payload
  setPageState,
}) {
  const dispatch = useDispatch();
  const persistedFilterStateData = useSelector(getFiltersStateData);

  const [status, setStatus] = useState(filterObject?.status || '');
  const [startDate, setStartDate] = useState(filterObject?.startDate || '');
  const [endDate, setEndDate] = useState(filterObject?.endDate || '');

  // to manage filters applied state for sales order filters
  const [filterState, setFilterState] = useState({
    status: persistedFilterStateData?.status || 0,
    startDate: persistedFilterStateData?.startDate || 0,
    endDate: persistedFilterStateData?.endDate || 0,
  });

  // fn to update filterstate and filtersapplied, just pass the filterType as argument
  const handleFilterStateAndFiltersApplied = (filterType) => {
    filterStateAndFiltersAppliedHandleFn(filterType, filterState, setFilterState);
  };

  // remove selected filter fn
  const removeSelectedFilter = (filterType) => {
    const filterMap = {
      status: setStatus,
      startDate: setStartDate,
      endDate: setEndDate,
    };

    if (filterMap[filterType]) {
      filterMap[filterType]('');
      setFilterState((prevState) => ({ ...prevState, [filterType]: 0 }));
    }
  };  

  // chipBoxes for filter
  const filterChipData = useMemo(
    () => [
      { heading: 'Status', label: status?.label, key: 'status', condition: filterState?.status === 1 },
      { heading: 'Start Date', label: startDate, key: 'startDate', condition: filterState?.startDate === 1 },
      { heading: 'End Date', label: endDate, key: 'endDate', condition: filterState?.endDate === 1 },
    ],
    [status, startDate, endDate],
  );  

  const filterChipBoxes = (
    <>
      {filterChipData?.map(
        ({ heading, label, key, condition }) =>
          condition && (
            <FilterChipDisplayBox
              key={key}
              heading={heading}
              label={label}
              objKey={key}
              removeSelectedFilter={removeSelectedFilter}
            />
          ),
      )}
    </>
  );

  // select boxes
  // express purchase status selectbox
  const statusSelect = (
    <>
      <SoftBox>
        <SoftSelect
          placeholder="Select Status"
          {...(status?.label
            ? {
                value: {
                  value: status?.value,
                  label: status?.label,
                },
              }
            : {
                value: {
                  value: '',
                  label: 'Select Status',
                },
              })}
          options={[
            { value: 'DRAFT', label: 'Draft' },
            { value: 'PENDING_APPROVAL', label: 'Pending Approval' },
            { value: 'ACCEPTED', label: 'Accepted' },
            { value: 'PO_CREATED', label: 'PO Created' },
            { value: 'PO_FAILED', label: 'PO Failed' },
            { value: 'INWARD_SUCCESSFUL', label: 'Inward Successful' },
            { value: 'INWARD_FAILED', label: 'Inward Failed' },
            { value: 'PUT_AWAY_SUCCESSFUL', label: 'Putaway Successful' },
            { value: 'PUT_AWAY_FAILED', label: 'Putaway Failed' },
            { value: 'CLOSE', label: 'Close' },
          ]}
          onChange={(option, e) => handleStatus(option)}
        />
      </SoftBox>
    </>
  );

  // functions
  // handle status fn - format - 2023-01-01
  const handleStatus = (option) => {
    setStatus(option);
    if (option !== '') {
      handleFilterStateAndFiltersApplied('status');
    }
  };

  // handle start date fn
  const handleStartDate = (date) => {
    if (date) {
      // Format the date as a string in the 'YYYY-MM-DD' format
      const formattedDate = dayjs(date).format('YYYY-MM-DD');
      setStartDate(formattedDate);

      handleFilterStateAndFiltersApplied('startDate');
    }
  };

  // handle end date fn - format - 2023-01-01
  const handleEndDate = (date) => {
    if (date) {
      // Format the date as a string in the 'YYYY-MM-DD' format
      const formattedDate = dayjs(date).format('YYYY-MM-DD');
      setEndDate(formattedDate);

      handleFilterStateAndFiltersApplied('endDate');
    }
  };

  // fn to apply sales order Filter
  const applyFilter = () => {
    dispatch(
      setFilters({
        status,
        startDate,
        endDate,
        page: 0,
      }),
    );
    dispatch(setFilterStateData(filterState));
    setPageState((prev) => ({ ...prev, page: 0 }));
  };

  // fn to  clear the  filter
  const handleClearExpressPurchaseFilter = () => {
    setStatus({});
    setStartDate(null);
    setEndDate(null);

    // reset filterState
    setFilterState({
      status: 0,
      startDate: 0,
      endDate: 0,
    });
    // reset filtersApplied
    
    dispatch(setFilters(null));
    dispatch(setFilterStateData(null));
    setPageState((prev) => ({ ...prev, page: 0 }));

    // set on clear to true
    // setOnClear(true);
  };

  // select boxes array to pass as prop to Filter component
  const selectBoxArray = [
    statusSelect,
    <StartDateSelect
      startDate={startDate}
      handleStartDate={handleStartDate}
      label="Select Start Date"
      dateFormat="DD/MM/YYYY"
    />,
    <EndDateSelect endDate={endDate} handleEndDate={handleEndDate} label="Select End Date" dateFormat="DD/MM/YYYY" />,
  ];

  // applied filters count
  const filterLength = Object.values(filterState).filter((value) => value === 1).length;

  return (
    <Filter
      filtersApplied={filterLength}
      filterChipBoxes={filterChipBoxes}
      selectBoxArray={selectBoxArray}
      handleApplyFilter={applyFilter}
      handleClearFilter={handleClearExpressPurchaseFilter}
    />
  );
}
