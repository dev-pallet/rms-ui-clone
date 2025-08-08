import React, { useEffect, useMemo, useState } from 'react';
import MobileFilterComponent from '../../../../Common/mobile-new-ui-components/mobile-filter';

export default function ABCAnalysisMobileFilter({
  isFilterOpened,
  setIsFilterOpened,
  categoryOptions,
  setCategory,
  applyFilter,
  handleClearFilter,
  applyMobileFilter,
  setApplyMobileFilter,
}) {
  const [mainSelecetedFilter, setMainSelectedFilter] = useState('');
  const [selectedSubFilters, setSelectedSubFilters] = useState({});

  const filters = useMemo(() => [{ filterLabel: 'Category', filterValue: 'category' }], []);

  const filterOptions = useMemo(
    () => ({
      category: categoryOptions,
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
      setCategory(selectedSubFilters?.['category']?.[0] || []);
    } else {
      setCategory([]);
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
      createButtonTitle={'ABC Analysis'}
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
