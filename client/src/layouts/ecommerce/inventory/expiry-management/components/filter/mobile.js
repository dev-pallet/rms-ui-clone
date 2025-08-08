import React, { useEffect, useMemo, useState } from 'react';
import MobileFilterComponent from '../../../../Common/mobile-new-ui-components/mobile-filter';

export default function ExpiryManagementMobileFilter({
  isFilterOpened,
  setIsFilterOpened,
  mainCategoryList,
  vendorList,
  brandList,
  setCategory,
  setVendor,
  setBrand,
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
      { filterLabel: 'Category', filterValue: 'category' },
      { filterLabel: 'Vendor', filterValue: 'vendor' },
      { filterLabel: 'Brand', filterValue: 'brand' },
      { filterLabel: 'Start Date', filterValue: 'startDate' },
      { filterLabel: 'End Date', filterValue: 'endDate' },
    ],
    [],
  );

  const filterOptions = useMemo(
    () => ({
      category: mainCategoryList,
      vendor: vendorList,
      brand: brandList,
      startDate: [{ value: 'custom', label: 'Custom' }],
      endDate: [{ value: 'custom', label: 'Custom' }],
      // vendor: [],
    }),
    [mainCategoryList, vendorList, brandList],
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
      setVendor(selectedSubFilters?.['vendor']?.[0] || []);
      setBrand(selectedSubFilters?.['brand']?.[0] || []);
      setStartDate(selectedSubFilters?.['startDate']?.[0]?.value || '');
      setEndDate(selectedSubFilters?.['endDate']?.[0]?.value || '');
    } else {
      setCategory([]);
      setVendor([]);
      setBrand([]);
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
      createButtonTitle={'Expiry Management'}
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
