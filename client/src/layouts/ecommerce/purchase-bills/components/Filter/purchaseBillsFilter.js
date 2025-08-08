import { Box } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SoftBox from '../../../../../components/SoftBox';
import SoftSelect from '../../../../../components/SoftSelect';
import { getAllVendors } from '../../../../../config/Services';
import { getFiltersStateData, setFilters, setFilterStateData } from '../../../../../datamanagement/Filters/commonFilterSlice';
import { textFormatter, truncateWord } from '../../../Common/CommonFunction';
import Filter from '../../../Common/Filter';
import {
  FilterChipDisplayBox,
  filterStateAndFiltersAppliedHandleFn
} from '../../../Common/Filter Components/filterComponents';

export default function PurchaseBillsFilter({
  selectedFilters, // payload
  setOnClear, // update the clear status when clear is clicked in filter
  billsData, // fn
  setBillsPageNo
}) {
  const dispatch = useDispatch();
  const persistedFilterStateData = useSelector(getFiltersStateData);

  const [status, setStatus] = useState(selectedFilters?.status || '');
  const [vendorList, setVendorList] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(selectedFilters?.selectedVendor || '');

  // to manage filters applied state for sales order filters
  const [filterState, setFilterState] = useState({
    status: persistedFilterStateData?.status || 0,
    selectedVendor: persistedFilterStateData?.selectedVendor || 0,
  });

  // fn to update filterstate and filtersapplied, just pass the filterType as argument
  const handleFilterStateAndFiltersApplied = (filterType) => {
    filterStateAndFiltersAppliedHandleFn(filterType, filterState, setFilterState);
  };

  const handleVendor = (option) => {
    let label = option.label;
    label = truncateWord(label);
    const value = option.value;
    if (label !== '' && value !== '') {
      setSelectedVendor({ label, value });
      if (filterState['selectedVendor'] === 0) {
        setFilterState({ ...filterState, selectedVendor: 1 });
      }
    } else {
      setSelectedVendor('');
      setFilterState({ ...filterState, selectedVendor: 0 });
    }
  };

  // remove selected filter fn
  const removeSelectedFilter = (filterType) => {
    const filterMap = {
      status: setStatus,
      selectedVendor: setSelectedVendor,
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
      { heading: 'Vendor', label: selectedVendor?.label, key: 'selectedVendor', condition: filterState?.selectedVendor === 1 },
    ],
    [status, selectedVendor],
  );

  // chipBoxes for filter
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
  // express purchase status selectbox
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
            { value: 'CREATED', label: 'Created' },
            { value: 'ACCEPTED', label: 'Accepted' },
            { value: 'PARTIALLY_PAID', label: 'Partially Paid' },
            { value: 'PAID', label: 'Paid' },
            { value: 'REJECTED', label: 'Rejected' },
            { value: 'CLOSED', label: 'Closed' },
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

  // api
  // get vendor list
  const getVendorList = () => {
    // vendor payload
    const payload = {
      page: 1,
      pageSize: 100,
      filterVendor: {},
    };
    const organizationId = localStorage.getItem('orgId');

    getAllVendors(payload, organizationId)
      .then((res) => {
        const data = res?.data?.data?.vendors;
        // console.log('vendors', data);

        const vendorsArr = [];
        // data.map((e) => {
        //   vendorsArr.push({
        //     value: e.vendorId,
        //     label: textFormatter(e.vendorName),
        //   });
        // }).sort((a, b) => a.label.localeCompare(b.label));
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
      .catch((e) => {
        // console.log(e)
      });
  };

  // functions
  // handle status fn
  const handleStatus = (option) => {
    setStatus(option);
    if (option !== '') {
      handleFilterStateAndFiltersApplied('status');
    }
  };

  // fn to apply purchae bills Filter
  const applyFilter = () => {
    dispatch(
      setFilters({
        status,
        selectedVendor,
        page: 0,
      }),
    );
    dispatch(setFilterStateData(filterState));
    setBillsPageNo(0);
  };

  // fn to  clear the  filter
  const handleClearPurchaseBillsFilter = () => {
    setStatus('');
    setSelectedVendor('');

    // reset filterState
    setFilterState({
      status: 0,
      selectedVendor: 0,
    });
    // reset filtersApplied

    dispatch(setFilters(null));
    dispatch(setFilterStateData(null));
    setBillsPageNo(0);

    // set on clear to true
    setOnClear(true);
  };

  // select boxes array to pass as prop to Filter component
  const selectBoxArray = [statusSelect, vendorSelect];

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
      handleClearFilter={handleClearPurchaseBillsFilter}
    />
  );
}
