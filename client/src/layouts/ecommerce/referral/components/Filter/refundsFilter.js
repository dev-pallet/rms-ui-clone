import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { Box, Chip } from '@mui/material';
import {
  ChipBoxHeading,
  filterStateAndFiltersAppliedHandleFn,
} from '../../../Common/Filter Components/filterComponents';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { formatDateDDMMYYYY } from '../../../Common/CommonFunction';
import Filter from '../../../Common/Filter';
import React, { useState } from 'react';
import SoftBox from '../../../../../components/SoftBox';
import SoftSelect from '../../../../../components/SoftSelect';
import dayjs from 'dayjs';

export default function RefundsFilter({
  filterObject, // payload
  setOnClear, // update the clear status when clear is clicked in filter
  refundData, // fn
}) {
  const [status, setStatus] = useState({});
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  if (status !== undefined) {
    if (status.value) {
      filterObject.status = [status.value];
    }
  }

  if (startDate !== null) {
    filterObject.from = startDate;
  }

  if (endDate !== null) {
    filterObject.to = endDate;
  }

  // to manage filters applied state for sales order filters
  const [filterState, setFilterState] = useState({
    status: 0,
    startDate: 0,
    endDate: 0,
  });

  // fn to update filterstate and filtersapplied, just pass the filterType as argument
  const handleFilterStateAndFiltersApplied = (filterType) => {
    filterStateAndFiltersAppliedHandleFn(filterType, filterState, setFilterState);
  };

  // chipBoxes for filter
  const filterChipBoxes = (
    <>
      {/* status */}
      {filterState.status === 1 && (
        <Box className="singleChipDisplayBox">
          <ChipBoxHeading heading={'Status'} />
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

      {/* start date */}
      {filterState.startDate === 1 && (
        <Box className="singleChipDisplayBox">
          <ChipBoxHeading heading={'Start Date'} />
          <Box className="insideSingleChipDisplayBox">
            <Chip
              label={formatDateDDMMYYYY(startDate)}
              onDelete={() => removeSelectedFilter('startDate')}
              deleteIcon={<CancelOutlinedIcon />}
              color="primary"
              variant="outlined"
            />
          </Box>
        </Box>
      )}

      {/* end date */}
      {filterState.endDate === 1 && (
        <Box className="singleChipDisplayBox">
          <ChipBoxHeading heading={'End Date'} />
          <Box className="insideSingleChipDisplayBox">
            <Chip
              label={formatDateDDMMYYYY(endDate)}
              onDelete={() => removeSelectedFilter('endDate')}
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
  // status selectbox
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
            { value: 'DRAFT', label: 'Draft' },
            { value: 'PENDING_APPROVAL', label: 'Pending Approval' },
            { value: 'ACCEPTED', label: 'Accepted' },
            { value: 'PO_CREATED', label: 'PO Created' },
            { value: 'PO_FAILED', label: 'PO Failed' },
            { value: 'INWARD_SUCCESSFUL', label: 'Inward Successful' },
            { value: 'INWARD_FAILED', label: 'Inward Failed' },
            { value: 'PUT_AWAY_SUCCESSFUL', label: 'Putaway Successful' },
            { value: 'PUT_AWAY_FAILED', label: 'Putaway Failed' },
            { value: 'CLOSE', label: 'Close' },
          ]}
          onChange={(option, e) => handleStatus(option)}
        />
      </SoftBox>
    </>
  );

  // 2023-01-01
  const startDateSelect = (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          views={['year', 'month', 'day']}
          label="Select Start Date"
          value={startDate ? dayjs(startDate) : null}
          format="DD/MM/YYYY"
          onChange={(date) => {
            // handleStartDate(date.$d);
            handleStartDate(date);
          }}
          sx={{
            width: '100%',
            '& .MuiInputLabel-formControl': {
              fontSize: '14px',
              top: '-0.4rem',
              color: '#344767 !important',
              opacity: 0.8,
            },
          }}
        />
      </LocalizationProvider>
    </>
  );

  // 2023-01-01
  const endDateSelect = (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          views={['year', 'month', 'day']}
          label="Select End Date"
          value={endDate ? dayjs(endDate) : null}
          format="DD/MM/YYYY"
          onChange={(date) => {
            // handleStartDate(date.$d);
            handleEndDate(date);
          }}
          sx={{
            width: '100%',
            '& .MuiInputLabel-formControl': {
              fontSize: '14px',
              top: '-0.4rem',
              color: '#344767 !important',
              opacity: 0.8,
            },
          }}
        />
      </LocalizationProvider>
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

  // fn to remove selected filter
  const removeSelectedFilter = (filterType) => {
    switch (filterType) {
      case 'status':
        setStatus({});
        if (filterObject.status) {
          delete filterObject.status;
        }
        break;
      case 'startDate':
        setStartDate(null);
        if (filterObject.from) {
          delete filterObject.from;
        }
        break;
      case 'endDate':
        setEndDate(null);
        if (filterObject.to) {
          delete filterObject.to;
        }
        break;
    }
    setFilterState({ ...filterState, [filterType]: 0 });
  };

  // fn to apply sales order Filter
  const applyFilter = () => {
    refundData();
  };

  // fn to  clear the  filter
  const handleClearRefundsFilter = () => {
    setStatus({});
    setStartDate(null);
    setEndDate(null);

    // reset filterState
    setFilterState({
      status: 0,
      startDate: 0,
      endDate: 0,
    });

    // set on clear to true
    setOnClear(true);
  };

  // select boxes array to pass as prop to Filter component
  // statusSelect filter not required(as only one option is present)
  const selectBoxArray = [startDateSelect, endDateSelect];

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
