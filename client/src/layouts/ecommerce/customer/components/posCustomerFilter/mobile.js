import React, { useEffect, useMemo, useState } from 'react';
import MobileFilterComponent from '../../../Common/mobile-new-ui-components/mobile-filter';

export default function PosCustomerMobileFilter({
  isFilterOpened,
  setIsFilterOpened,
  setStartDate,
  setEndDate,
  applyFilter,
  handleClearFilter,
  resetFilters,
  applyMobileFilter,
  setApplyMobileFilter,
  set_start_date,
  set_end_date,
  customerType
}) {
  const [mainSelecetedFilter, setMainSelectedFilter] = useState('');
  const [selectedSubFilters, setSelectedSubFilters] = useState({});

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
      filter: true,
      create: false,
    };
    return title;
  };

  useEffect(() => {
    if (Object.keys(selectedSubFilters)?.length) {
      setStartDate(selectedSubFilters?.['startDate']?.[0]?.value || '');
      setEndDate(selectedSubFilters?.['endDate']?.[0]?.value || '');
      set_start_date(selectedSubFilters?.['startDate']?.[0]?.value || '');
      set_end_date(selectedSubFilters?.['endDate']?.[0]?.value || '');
    } else {
      setStartDate('');
      setEndDate('');
      set_start_date(null);
      set_end_date(null);
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

  useEffect(() => {
    resetFilters();
  },[customerType])

  return (
    <MobileFilterComponent
      filters={filters}
      filterOptions={filterOptions}
      createButtonTitle={
        customerType?.value === 'pos' ? 'POS Customer' : customerType?.value === 'org' ? 'B2B Customer' : 'App Customer'
      }
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
