import React, { useEffect, useMemo, useState } from 'react';
import Filter from '../../../../Common/Filter';
import {
  EndDateSelect,
  FilterChipDisplayBox,
  filterStateAndFiltersAppliedHandleFn,
  StartDateSelect,
} from '../../../../Common/Filter Components/filterComponents';
import dayjs from 'dayjs';
import OversoldMobileFilter from './mobile';

export default function OversoldFilter({ searchParams, setSearchParams, isMobileDevice, pageState }) {
  const [startDate, setStartDate] = useState(searchParams.get('startDate') || '');
  const [endDate, setEndDate] = useState(searchParams.get('endDate') || '');

  // filters
  // to manage filters applied state
  const [filterState, setFilterState] = useState({
    startDate: startDate ? 1 : 0,
    endDate: endDate ? 1 : 0,
  });

  const [isFilterOpened, setIsFilterOpened] = useState(false);
  const [applyMobileFilter, setApplyMobileFilter] = useState(false);

  //   functions
  const handleFilterStateAndFiltersApplied = (filterType) => {
    filterStateAndFiltersAppliedHandleFn(filterType, filterState, setFilterState);
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

  // handle end date fn
  const handleEndDate = (date) => {
    if (date) {
      // Format the date as a string in the 'YYYY-MM-DD' format
      const formattedDate = dayjs(date).format('YYYY-MM-DD');
      setEndDate(formattedDate);

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
  const applyFilter = async () => {
    const updatedSearchParams = new URLSearchParams(searchParams);

    startDate ? updatedSearchParams.set('startDate', startDate) : updatedSearchParams.delete('startDate');
    endDate ? updatedSearchParams.set('endDate', endDate) : updatedSearchParams.delete('endDate');
    // set page to 0
    updatedSearchParams.set('page', 0);
    setSearchParams(updatedSearchParams);
  };

  const handleClearFilter = async () => {
    setStartDate('');
    setEndDate('');

    // reset filterState
    setFilterState({
      startDate: 0,
      endDate: 0,
    });

    const updatedSearchParams = new URLSearchParams(searchParams);
    updatedSearchParams.delete('startDate');
    updatedSearchParams.delete('endDate');
    updatedSearchParams.set('page', 0);
    setSearchParams(updatedSearchParams);
  };

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
    if (pageState?.loading === false && isMobileDevice) {
      setApplyMobileFilter(false);
      setIsFilterOpened(false);
    }
  }, [pageState?.loading]);

  return (
    <>
      {isMobileDevice ? (
        <OversoldMobileFilter
          {...{
            isFilterOpened,
            setIsFilterOpened,
            applyFilter,
            handleClearFilter,
            applyMobileFilter,
            setApplyMobileFilter,
            setStartDate,
            setEndDate,
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
