import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SoftBox from '../../../../../components/SoftBox';
import SoftSelect from '../../../../../components/SoftSelect';
import { getFiltersStateData, setFilters, setFilterStateData } from '../../../../../datamanagement/Filters/commonFilterSlice';
import Filter from '../../../Common/Filter';
import {
  FilterChipDisplayBox,
  filterStateAndFiltersAppliedHandleFn
} from '../../../Common/Filter Components/filterComponents';

export default function ReturnFilter({
  selectedFilters, // payload
  setPageState
}) {
  const dispatch = useDispatch();
  const persistedFilterStateData = useSelector(getFiltersStateData);

  const [status, setStatus] = useState(selectedFilters?.status || '');

  // to manage filters applied state for sales order filters
  const [filterState, setFilterState] = useState({
    status: persistedFilterStateData?.status || 0,
  });

  // fn to update filterstate and filtersapplied, just pass the filterType as argument
  const handleFilterStateAndFiltersApplied = (filterType) => {
    filterStateAndFiltersAppliedHandleFn(filterType, filterState, setFilterState);
  };

  // remove selected filter fn
  const removeSelectedFilter = (filterType) => {
    const filterMap = {
      status: setStatus,
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
    ],
    [status],
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
  // status selectbox
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
            { value: 'APPROVED', label: 'Approved' },
            { value: 'REJECTED', label: 'Reject' },
          ]}
          onChange={(option, e) => handleStatus(option)}
        />
      </SoftBox>
    </>
  );

  // functions
  // handle status fn
  const handleStatus = (option) => {
    setStatus(option);
    if (option !== '') {
      handleFilterStateAndFiltersApplied('status');
    }
  };

  // fn to apply sales order Filter
  const applyFilter = () => {
    dispatch(
      setFilters({
        status,
        page: 0,
      }),
    );
    dispatch(setFilterStateData(filterState));
    setPageState((old) => ({ ...old, page: 0 }));
  };

  // fn to  clear the  filter
  const handleClearRefundsFilter = () => {
    setStatus('');

    // reset filterState
    setFilterState({
      status: 0,
    });

    // reset redux filter state
    dispatch(setFilters(null));
    dispatch(setFilterStateData(null));
    setPageState((old) => ({ ...old, page: 0 }));
  };

  // select boxes array to pass as prop to Filter component
  const selectBoxArray = [
    statusSelect,
  ];

  // applied filters count
  const filterLength = Object.values(filterState).filter((value) => value === 1).length;

  return (
    <Filter
      filtersApplied={filterLength}
      filterChipBoxes={filterChipBoxes}
      selectBoxArray={selectBoxArray}
      handleApplyFilter={applyFilter}
      handleClearFilter={handleClearRefundsFilter}
    />
  );
}
