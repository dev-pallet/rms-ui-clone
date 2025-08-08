import { Box } from '@mui/material';
import {
  EndDateSelect,
  FilterChipDisplayBox,
  StartDateSelect,
  filterStateAndFiltersAppliedHandleFn,
} from '../../../Common/Filter Components/filterComponents';
import { getAllVendors } from '../../../../../config/Services';
import {
  getFiltersStateData,
  setFilterStateData,
  setFilters,
  setPage,
} from '../../../../../datamanagement/Filters/commonFilterSlice';
import { textFormatter, truncateWord } from '../../../Common/CommonFunction';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import Filter from '../../../Common/Filter';
import React, { useEffect, useMemo, useState } from 'react';
import SoftBox from '../../../../../components/SoftBox';
import SoftSelect from '../../../../../components/SoftSelect';
import dayjs from 'dayjs';

export default function PurchaseOrderFilter({ showSnackbar, filterObjectMain }) {
  const dispatch = useDispatch();
  const persistedFilterStateData = useSelector(getFiltersStateData);

  const [status, setStatus] = useState(filterObjectMain?.status || '');
  const [startDate, setStartDate] = useState(filterObjectMain?.startDate || '');
  const [endDate, setEndDate] = useState(filterObjectMain?.endDate || '');
  // for vendor
  const [vendorList, setVendorList] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(filterObjectMain?.selectedVendor || '');

  // to manage filters applied state for purchase order filters
  const [filterState, setFilterState] = useState({
    status: persistedFilterStateData?.status || 0,
    vendor: persistedFilterStateData?.vendor || 0,
    startDate: persistedFilterStateData?.startDate || 0,
    endDate: persistedFilterStateData?.endDate || 0,
  });

  //selectboxes
  // select order type selectbox
  const statusSelect = (
    <>
      <SoftBox>
        <SoftSelect
          placeholder="Select Status"
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
                  label: 'Select Status',
                },
              })}
          options={[
            { value: 'CREATED', label: 'Created' },
            { value: 'ACCEPTED', label: 'Accepted' },
            { value: 'IN_TRANSIT', label: 'In Transit' },
            { value: 'PARTIALLY_INWARDED', label: 'Partially Inwarded' },
            { value: 'INWARDED', label: 'Inwarded' },
            { value: 'CLOSED', label: 'Closed' },
            { value: 'REJECTED', label: 'Rejected' },
          ]}
          onChange={(option, e) => handleStatus(option)}
        />
      </SoftBox>
    </>
  );

  // select vendors
  const vendorSelect = (
    <>
      <Box className="all-products-filter-product">
        <SoftSelect
          className="all-products-filter-soft-select-box"
          placeholder="Vendor"
          name="vendor"
          {...(selectedVendor?.label
            ? {
                value: {
                  value: selectedVendor?.value,
                  label: selectedVendor?.label,
                },
              }
            : {
                value: {
                  value: '',
                  label: 'Select Vendor',
                },
              })}
          options={vendorList}
          onChange={(option, e) => {
            // handleMainCat(option);
            handleVendor(option);
          }}
        />
      </Box>
    </>
  );

  //   functions
  const handleFilterStateAndFiltersApplied = (filterType) => {
    filterStateAndFiltersAppliedHandleFn(filterType, filterState, setFilterState);
  };

  // remove selected filter fn
  const removeSelectedFilter = (filterType) => {
    const filterMap = {
      status: setStatus,
      vendor: setSelectedVendor,
      startDate: setStartDate,
      endDate: setEndDate,
    };

    if (filterMap[filterType]) {
      filterMap[filterType]('');
      setFilterState((prevState) => ({ ...prevState, [filterType]: 0 }));
    }
  };

  const filterChipData = useMemo(
    () => [
      { heading: 'Status', label: status.label, key: 'status', condition: filterState.status === 1 },
      { heading: 'Vendor', label: selectedVendor.label, key: 'vendor', condition: filterState.vendor === 1 },
      { heading: 'Start Date', label: startDate, key: 'startDate', condition: filterState.startDate === 1 },
      { heading: 'End Date', label: endDate, key: 'endDate', condition: filterState.endDate === 1 },
    ],
    [status, selectedVendor, startDate, endDate],
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

  // api
  // get vendor list
  const getVendorList = () => {
    // vendor payload
    const payload = {
      page: 1,
      pageSize: 10,
      filterVendor: {},
    };
    const organizationId = localStorage.getItem('orgId');

    getAllVendors(payload, organizationId)
      .then((res) => {
        const data = res?.data?.data?.vendors;

        const vendorsArr = [];
        vendorsArr.push(
          data
            ?.map((row) => ({
              value: row.vendorId,
              label: textFormatter(row.vendorName),
            }))
            .sort((a, b) => a.label.localeCompare(b.label)),
        );

        setVendorList(vendorsArr[0] || []);
      })
      .catch((e) => console.log(e));
  };

  // functions
  // handle status fn
  const handleStatus = (option) => {
    setStatus(option);
    if (option !== '') {
      handleFilterStateAndFiltersApplied('status');
    }
  };

  const handleVendor = (option) => {
    const { label: originalLabel, value } = option;
    const label = truncateWord(originalLabel);

    const isValidSelection = label && value;

    setSelectedVendor(isValidSelection ? { label, value } : {});

    handleFilterStateAndFiltersApplied('vendor');
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

  // fn to apply sales order Filter
  const applyFilter = () => {
    // setPoNumberPayload((old)=>({...old,page: 0}))
    // allPurchaseOrder(true,0);
    dispatch(
      setFilters({
        status,
        selectedVendor,
        startDate,
        endDate,
      }),
    );
    dispatch(setFilterStateData(filterState));
    dispatch(setPage(0));
  };

  // fn to  clear the purchase order filter
  const handleClearPurchaseOrderFilter = async () => {
    setStatus('');
    setStartDate('');
    setEndDate('');
    setSelectedVendor('');

    // reset filterState
    setFilterState({
      status: 0,
      vendor: 0,
      startDate: 0,
      endDate: 0,
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
    vendorSelect,
    <StartDateSelect
      startDate={startDate}
      handleStartDate={handleStartDate}
      label="Select Start Date"
      dateFormat="DD/MM/YYYY"
    />,
    <EndDateSelect endDate={endDate} handleEndDate={handleEndDate} label="Select End Date" dateFormat="DD/MM/YYYY" />,
  ];

  useEffect(() => {
    getVendorList();
  }, []);

  // applied filters count
  const filterLength = Object.values(filterState).filter((value) => value === 1).length;

  return (
    <Filter
      filtersApplied={filterLength}
      filterChipBoxes={filterChipBoxes}
      selectBoxArray={selectBoxArray}
      handleApplyFilter={applyFilter}
      handleClearFilter={handleClearPurchaseOrderFilter}
    />
  );
}
