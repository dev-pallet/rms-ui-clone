import React, { useEffect, useMemo, useState } from 'react';
import MobileFilterComponent from '../../../../Common/mobile-new-ui-components/mobile-filter';

export default function OversoldMobileFilter({
  isFilterOpened,
  setIsFilterOpened,
  setStartDate,
  setEndDate,
  applyFilter,
  handleClearFilter,
  applyMobileFilter,
  setApplyMobileFilter,
}) {
  // const [isFilterOpened, setIsFilterOpened] = useState(false);
  const [mainSelecetedFilter, setMainSelectedFilter] = useState('');
  const [selectedSubFilters, setSelectedSubFilters] = useState({});
  // const [applyMobileFilter, setApplyMobileFilter] = useState(false);

  const filters = useMemo(
    () => [
      { filterLabel: 'Start Date', filterValue: 'startDate' },
      { filterLabel: 'End Date', filterValue: 'endDate' },
    ],
    [],
  );

  const filterOptions = useMemo(
    () => ({
      startDate: [{ value: 'custom', label: 'Custom' }],
      endDate: [{ value: 'custom', label: 'Custom' }],
    }),
    [],
  );

  const filter_CreateHandler = () => {
    let title = {
      filter: false,
      create: false,
    };
    return title;
  };

  useEffect(() => {
    if (Object.keys(selectedSubFilters)?.length) {
      setStartDate(selectedSubFilters?.['startDate']?.[0]?.value || '');
      setEndDate(selectedSubFilters?.['endDate']?.[0]?.value || '');
    } else {
      setStartDate('');
      setEndDate('');
    }
  }, [mainSelecetedFilter, selectedSubFilters]);

  useEffect(() => {
    if (applyMobileFilter) {
      if (mainSelecetedFilter) {
        applyFilter();
      } else {
        handleClearFilter();
      }
    }
  }, [applyMobileFilter]);
  return (
    <MobileFilterComponent
      filters={filters}
      filterOptions={filterOptions}
      createButtonTitle={'Oversold'}
      // createButtonFunction={createButtonFunction}
      mainSelecetedFilter={mainSelecetedFilter}
      setMainSelectedFilter={setMainSelectedFilter}
      selectedSubFilters={selectedSubFilters}
      setSelectedSubFilters={setSelectedSubFilters}
      applyFilter={applyMobileFilter}
      setApplyFilter={setApplyMobileFilter}
      isFilterOpened={isFilterOpened}
      setIsFilterOpened={setIsFilterOpened}
      filterCreateExist={filter_CreateHandler()}
    />
  );
}
