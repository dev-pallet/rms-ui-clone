import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { Box, Chip } from '@mui/material';
import { useState } from 'react';
import SoftBox from '../../../../../components/SoftBox';
import SoftSelect from '../../../../../components/SoftSelect';
import Filter from '../../../Common/Filter';
import {
  ChipBoxHeading,
  filterStateAndFiltersAppliedHandleFn,
} from '../../../Common/Filter Components/filterComponents';

export default function VendorsFilter({ filterObject, setOnClear, getAllVendorsList }) {
  const [status, setStatus] = useState({});
  const [vendorType, setVendorType] = useState({});

  if (status !== undefined) {
    if (status.value) {
      filterObject.status = [status.value];
    }
  }

  if (vendorType !== undefined) {
    if (vendorType.value) {
      filterObject.vendorType = [vendorType.value];
    }
  }

  // to manage filters applied state for sales order filters
  const [filterState, setFilterState] = useState({
    status: 0,
    vendorType: 0,
  });

  // fn to update filterstate and filtersapplied, just pass the filterType as argument
  const handleFilterStateAndFiltersApplied = (filterType) => {
    filterStateAndFiltersAppliedHandleFn(filterType, filterState, setFilterState);
  };

  // chipBoxes for filter
  const filterChipBoxes = (
    <>
      {/* vendor status */}
      {filterState.status === 1 && (
        <Box className="singleChipDisplayBox">
          <ChipBoxHeading heading={'Vendor Status'} />
          <Box className="insideSingleChipDisplayBox">
            <Chip
              label={status.label}
              onDelete={() => removeSelectedFilter('status')}
              deleteIcon={<CancelOutlinedIcon />}
              color="primary"
              variant="outlined"
            />
          </Box>
        </Box>
      )}

      {/* vendor type */}
      {filterState.vendorType === 1 && (
        <Box className="singleChipDisplayBox">
          <ChipBoxHeading heading={'Vendor Type'} />
          <Box className="insideSingleChipDisplayBox">
            <Chip
              label={vendorType.label}
              onDelete={() => removeSelectedFilter('vendorType')}
              deleteIcon={<CancelOutlinedIcon />}
              color="primary"
              variant="outlined"
            />
          </Box>
        </Box>
      )}
    </>
  );

  // select boxes
  // vendor status selectbox
  const statusSelect = (
    <>
      <SoftBox>
        <SoftSelect
          placeholder="Select Vendor Status"
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
                  label: 'Select Vendor Status',
                },
              })}
          options={[
            { value: 'CREATED', label: 'Created' },
            { value: 'APPROVED', label: 'Approved' },
            { value: 'REJECTED', label: 'Rejected' },
            { value: 'ACTIVE', label: 'Active' },
            { value: 'INACTIVE', label: 'Inactive' },
            { value: 'BLACKLISTED', label: 'Blacklisted' },
          ]}
          onChange={(option, e) => handleStatus(option)}
        />
      </SoftBox>
    </>
  );

  const vendorTypeSelect = (
    <>
      <SoftBox>
        <SoftSelect
          placeholder="Select Vendor Type"
          {...(vendorType.label
            ? {
                value: {
                  value: vendorType.value,
                  label: vendorType.label,
                },
              }
            : {
                value: {
                  value: '',
                  label: 'Select Vendor Type',
                },
              })}
          options={[
            { value: 'MANUFACTURER', label: 'Manufacturer' },
            { value: 'WHOLESALER', label: 'Wholeseller' },
            { value: 'DISTRIBUTOR', label: 'Distributor' },
            { value: 'RETAILER', label: 'Retailer' },
            { value: 'INDIVIDUAL', label: 'Individual' },
            { value: 'RESELLER', label: 'Reseller' },
          ]}
          onChange={(option, e) => handleVendorType(option)}
        />
      </SoftBox>
    </>
  );

  // functions

  // handle vendor status fn
  const handleStatus = (option) => {
    setStatus(option);
    if (option !== '') {
      handleFilterStateAndFiltersApplied('status');
    }
  };

  //   handle vendor type fn
  const handleVendorType = (option) => {
    setVendorType(option);
    if (option !== '') {
      handleFilterStateAndFiltersApplied('vendorType');
    }
  };

  // fn to remove selected filter
  const removeSelectedFilter = (filterType) => {
    switch (filterType) {
      case 'status':
        setStatus({});
        if (filterObject.status) {
          filterObject.status = [];
        }
        break;
      case 'vendorType':
        setVendorType({});
        if (filterObject.vendorType) {
          filterObject.vendorType = [];
        }
        break;
    }
    setFilterState({ ...filterState, [filterType]: 0 });
  };

  // fn to apply sales order Filter
  const applyFilter = () => {
    getAllVendorsList();
  };

  // fn to  clear the  filter
  const handleClearVendorsFilter = () => {
    setStatus({});
    setVendorType({});

    // reset filterState
    setFilterState({
      status: 0,
      vendorType: 0,
    });

    // reset filterObject
    filterObject = { ...filterObject, status: [], vendorType: [] };

    // set on clear to true
    setOnClear(true);
  };

  // select boxes array to pass as prop to Filter component
  const selectBoxArray = [statusSelect, vendorTypeSelect];

  // applied filters count
  const filterLength = Object.values(filterState).filter((value) => value === 1).length;

  return (
    <Filter
      filtersApplied={filterLength}
      filterChipBoxes={filterChipBoxes}
      selectBoxArray={selectBoxArray}
      handleApplyFilter={applyFilter}
      handleClearFilter={handleClearVendorsFilter}
    />
  );
}
