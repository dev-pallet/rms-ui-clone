import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';

import { useSnackbar } from '../../../../../hooks/SnackbarProvider';
import Filter from '../../../Common/Filter';
import {
  EndDateSelect,
  FilterChipDisplayBox,
  filterStateAndFiltersAppliedHandleFn,
  StartDateSelect,
} from '../../../Common/Filter Components/filterComponents';
import PosCustomerMobileFilter from './mobile';

export default function PosCustomerFilter({
  start_date,
  end_date,
  applyDateFilter,
  setResetDateFilter,
  set_start_date,
  set_end_date,
  searchParams,
  setSearchParams,
  isMobileDevice,
  loader,
  customerType,
}) {
  const showSnackbar = useSnackbar();
  const [startDate, setStartDate] = useState(start_date);
  const [endDate, setEndDate] = useState(end_date);

  // filters
  // to manage filters applied state for sales order filters
  const [filterState, setFilterState] = useState({
    startDate: 0,
    endDate: 0,
  });

  const [isFilterOpened, setIsFilterOpened] = useState(false);
  const [applyMobileFilter, setApplyMobileFilter] = useState(false);

  //   functions
  const handleFilterStateAndFiltersApplied = (filterType) => {
    filterStateAndFiltersAppliedHandleFn(filterType, filterState, setFilterState);
  };

  const handleSearchParams = (type, value) => {
    const updatedSearchParams = new URLSearchParams(searchParams);

    if (type === 'startDate') {
      updatedSearchParams.set('startDate', value);
    } else if (type === 'endDate') {
      updatedSearchParams.set('endDate', value);
    } else if (type === 'clearStartDate') {
      updatedSearchParams.delete('startDate');
    } else if (type === 'clearEndDate') {
      updatedSearchParams.delete('endDate');
    } else if (type === 'clearAll') {
      updatedSearchParams.delete('startDate');
      updatedSearchParams.delete('endDate');
    }

    // Update the URL these parameters
    setSearchParams(updatedSearchParams);
  };

  const handleStartDate = (date) => {
    if (date) {
      // Format the date as a string in the 'YYYY-MM-DD' format
      const formattedDate = dayjs(date).format('YYYY-MM-DD');
      setStartDate(formattedDate);
      set_start_date(formattedDate);
      handleSearchParams('startDate', formattedDate);

      handleFilterStateAndFiltersApplied('startDate');
    }
  };

  // handle end date fn
  const handleEndDate = (date) => {
    if (date) {
      // Format the date as a string in the 'YYYY-MM-DD' format
      const formattedDate = dayjs(date).format('YYYY-MM-DD');
      setEndDate(formattedDate);
      set_end_date(formattedDate);
      handleSearchParams('endDate', formattedDate);

      handleFilterStateAndFiltersApplied('endDate');
    }
  };

  // remove selected filter fn
  const removeSelectedFilter = (filterType) => {
    const filterMap = {
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
      { heading: 'Start Date', label: startDate, key: 'startDate', condition: filterState.startDate === 1 },
      { heading: 'End Date', label: endDate, key: 'endDate', condition: filterState.endDate === 1 },
    ],
    [startDate, endDate],
  );

  const filterChipBoxes = (
    <>
      {filterChipData.map(
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

  //   apply filter function
  const applyFilter = () => {
    applyDateFilter();
  };

  const resetFilters = () => {
    setStartDate('');
    setEndDate('');
    set_end_date(null);
    set_start_date(null);

    // reset filterState
    setFilterState({
      startDate: 0,
      endDate: 0,
    });
  }

  const handleClearFilter = async () => {
    resetFilters();
    setResetDateFilter(true);
    handleSearchParams('clearAll');
  };
  //   useeffect

  // select boxes array to pass as prop to Filter component
  const selectBoxArray = [
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

  useEffect(() => {
    if (loader === false && isMobileDevice) {
      setApplyMobileFilter(false);
      setIsFilterOpened(false);
    }
  }, [loader]);

  useEffect(() => {
    resetFilters();
  },[customerType])

  return (
    <>
      {isMobileDevice ? (
        <PosCustomerMobileFilter
          {...{
            isFilterOpened,
            setIsFilterOpened,
            applyFilter,
            handleClearFilter,
            resetFilters,
            applyMobileFilter,
            setApplyMobileFilter,
            set_start_date,
            setStartDate,
            set_end_date,
            setEndDate,
            customerType
          }}
        />
      ) : (
        <Filter
          filtersApplied={filterLength}
          filterChipBoxes={filterChipBoxes}
          selectBoxArray={selectBoxArray}
          handleApplyFilter={applyFilter}
          handleClearFilter={handleClearFilter}
        />
      )}
    </>
  );
}
