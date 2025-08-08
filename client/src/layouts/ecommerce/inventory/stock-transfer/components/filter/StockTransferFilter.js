import {
  EndDateSelect,
  FilterChipDisplayBox,
  StartDateSelect,
  filterStateAndFiltersAppliedHandleFn
} from '../../../../Common/Filter Components/filterComponents';
import {
  getFiltersStateData,
  setFilterStateData,
  setFilters,
  setPage,
} from '../../../../../../datamanagement/Filters/commonFilterSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useMemo, useState } from 'react';
import Filter from '../../../../Common/Filter';
import SoftBox from '../../../../../../components/SoftBox';
import SoftSelect from '../../../../../../components/SoftSelect';
import dayjs from 'dayjs';
import StockTransferMobileFilter from './mobile';

export default function StockTransferFilter({ filterObjectMain, isMobileDevice, pageState }) {
  const dispatch = useDispatch();
  const persistedFilterStateData = useSelector(getFiltersStateData);

  const [status, setStatus] = useState(filterObjectMain?.status || '');
  const [startDate, setStartDate] = useState(filterObjectMain?.startDate || '');
  const [endDate, setEndDate] = useState(filterObjectMain?.endDate || '');
  const [transferType, setTransferType] = useState(filterObjectMain?.transferType || '');

  const [isFilterOpened, setIsFilterOpened] = useState(false);
  const [applyMobileFilter, setApplyMobileFilter] = useState(false);

  const statusOptions = useMemo(
    () => [
      { value: '', label: 'All' },
      { value: 'DRAFT', label: 'Draft' },
      { value: 'CREATED', label: 'Created' },
      { value: 'PENDING_APPROVAL_1', label: 'Pending Approval 1' },
      { value: 'SOURCE_APPROVED', label: 'Source Approved' },
      { value: 'PENDING_APPROVAL_2', label: 'Pending Approval 2' },
      { value: 'APPROVED', label: 'Approved' },
      { value: 'SHIPPED', label: 'Shipped' },
      { value: 'INWARD_SUCCESSFUL', label: 'Inward Successful' },
      { value: 'INWARD_FAILED', label: 'Inward Failed' },
      { value: 'PUT_AWAY_SUCCESSFUL', label: 'Putaway Successful' },
      { value: 'PUT_AWAY_FAILED', label: 'Putaway Failed' },
      { value: 'RECEIVED', label: 'Received' },
      { value: 'REJECTED', label: 'Rejected' },
      { value: 'CLOSE', label: 'Closed' },
    ],
    [],
  );

  const transferTypeOpions = useMemo(
    () => [
      { value: '', label: 'All' },
      { value: 'inward', label: 'Inward' },
      { value: 'outward', label: 'Outward' },
    ],
    [],
  );

  // filters
  // to manage filters applied state for sales order filters
  const [filterState, setFilterState] = useState({
    status: persistedFilterStateData?.status || 0,
    transferType: persistedFilterStateData?.transferType || 0,
    startDate: persistedFilterStateData?.startDate || 0,
    endDate: persistedFilterStateData?.endDate || 0,
  });

  // select status selectbox
  const statusSelect = (
    <>
      <SoftBox>
        <SoftSelect
          placeholder="Select status"
          {...(status.label
            ? {
              value: {
                value: status.value,
                label: status.label,
              },
            }
            : {
              value: {
                value: '',
                label: 'Select status',
              },
            })}
          options={statusOptions}
          onChange={(option, e) => handleStatus(option)}
        />
      </SoftBox>
    </>
  );
  
  // select transfer type selectbox
  const transferTypeSelect = (
    <>
      <SoftBox>
        <SoftSelect
          placeholder="Select Transfer Type"
          {...(transferType.label
            ? {
              value: {
                value: transferType.value,
                label: transferType.label,
              },
            }
            : {
              value: {
                value: '',
                label: 'Select Transfer Type',
              },
            })}
          options={transferTypeOpions}
          onChange={(option, e) => handleTransferType(option)}
        />
      </SoftBox>
    </>
  );

  //   functions
  const handleFilterStateAndFiltersApplied = (filterType) => {
    filterStateAndFiltersAppliedHandleFn(filterType, filterState, setFilterState);
  };

  // handle status fn
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

  // handle end date fn
  const handleEndDate = (date) => {
    if (date) {
      // Format the date as a string in the 'YYYY-MM-DD' format
      const formattedDate = dayjs(date).format('YYYY-MM-DD');
      setEndDate(formattedDate);

      handleFilterStateAndFiltersApplied('endDate');
    }
  };

  const handleTransferType = (option) => {
    setTransferType(option);

    if (option !== '') {
      handleFilterStateAndFiltersApplied('transferType');
    }
  };

  // fn to remove selected filter
  const removeSelectedFilter = (filterType) => {
    const filterMap = {
      status: setStatus,
      startDate: setStartDate,
      endDate: setEndDate,
      transferType: setTransferType,
    };

    if (filterMap[filterType]) {
      filterMap[filterType]('');
      setFilterState((prevState) => ({ ...prevState, [filterType]: 0 }));
    }
  };

  // chipBoxes for filter
  const filterChipData = useMemo(
    () => [
      { heading: 'Status', label: status.label, key: 'status', condition: filterState.status === 1 },
      { heading: 'Start Date', label: startDate, key: 'startDate', condition: filterState.startDate === 1 },
      { heading: 'End Date', label: endDate, key: 'endDate', condition: filterState.endDate === 1 },
      {
        heading: 'Transfer Type',
        label: transferType.label,
        key: 'transferType',
        condition: filterState.transferType === 1,
      },
    ],
    [status, startDate, endDate, transferType],
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
    // filterFunction({ pageNo: 0, status: [status.value ?? ''], startDate: startDate ?? '', endDate: endDate ?? '' });
    // setSelectedStatus([status.value ?? '']);
    // setSelectedStartDate(startDate ?? '');
    // setSelectedEndDate(endDate ?? '');

    dispatch(
      setFilters({
        status,
        endDate,
        startDate,
        transferType,
      }),
    );
    dispatch(setFilterStateData(filterState));
    dispatch(setPage(0));
  };

  const handleClearFilter = async () => {
    setStatus('');
    setStartDate('');
    setEndDate('');
    setTransferType('');

    // reset filterState
    setFilterState({
      status: 0,
      startDate: 0,
      endDate: 0,
      transferType: 0,
    });

    // reset filtersApplied
    dispatch(setFilters(null));
    dispatch(setFilterStateData(null));
    // dispatch(setStockCountSearchValue(''));
    dispatch(setPage(0));
  };

  // select boxes array to pass as prop to Filter component
  const selectBoxArray = [
    statusSelect,
    transferTypeSelect,
    <StartDateSelect
      startDate={startDate}
      handleStartDate={handleStartDate}
      label="Select Start Date"
      dateFormat="DD/MM/YYYY"
    />,
    <EndDateSelect endDate={endDate} handleEndDate={handleEndDate} label="Select End Date" dateFormat="DD/MM/YYYY" />,
  ];

  // applied filters count
  const filterLength = Object.values(filterState).filter(value => value === 1).length;  

  useEffect(() => {
    if (pageState?.loader === false && isMobileDevice) {
      setApplyMobileFilter(false);
      setIsFilterOpened(false);
    }
  }, [pageState?.loader]);
  
  return (
    <>
      {isMobileDevice ? (
        <StockTransferMobileFilter
          {...{
            isFilterOpened,
            setIsFilterOpened,
            statusOptions,
            transferTypeOpions,
            applyFilter,
            handleClearFilter,
            applyMobileFilter,
            setApplyMobileFilter,
            setStatus,
            setStartDate,
            setEndDate,
            setTransferType,
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
