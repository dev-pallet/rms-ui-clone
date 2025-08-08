import React, { useEffect, useMemo, useState } from 'react';
import MobileFilterComponent from '../../../../Common/mobile-new-ui-components/mobile-filter';

export default function StockTransferMobileFilter({
  isFilterOpened,
  setIsFilterOpened,
  statusOptions,
  transferTypeOpions,
  setStatus,
  setStartDate,
  setEndDate,
  setTransferType,
  applyFilter,
  handleClearFilter,
  applyMobileFilter,
  setApplyMobileFilter,
}) {
  const [mainSelecetedFilter, setMainSelectedFilter] = useState('');
  const [selectedSubFilters, setSelectedSubFilters] = useState({});

  const filters = useMemo(
    () => [
      { filterLabel: 'Status', filterValue: 'status' },
      { filterLabel: 'Transfer Type', filterValue: 'transferType' },
      { filterLabel: 'Start Date', filterValue: 'startDate' },
      { filterLabel: 'End Date', filterValue: 'endDate' },
    ],
    [],
  );

  const filterOptions = useMemo(
    () => ({
      status: statusOptions,
      transferType: transferTypeOpions,
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
      setStatus(selectedSubFilters?.['status']?.[0] || []);
      setTransferType(selectedSubFilters?.['transferType']?.[0] || []);
      setStartDate(selectedSubFilters?.['startDate']?.[0]?.value || '');
      setEndDate(selectedSubFilters?.['endDate']?.[0]?.value || '');
    } else {
      setStatus([]);
      setTransferType([]);
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
      createButtonTitle={'Stock Transfer List'}
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
