import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { Box, Chip } from '@mui/material';
import { ChipBoxHeading } from '../../../../Common/Filter Components/filterComponents';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import Filter from '../../../../Common/Filter';
import React, { useMemo, useState } from 'react';
import SoftSelect from '../../../../../../components/SoftSelect';
import dayjs from 'dayjs';

export const StockCountJobListingFilter = ({ setFilters, filters, usersList }) => {
  // private String locationId; -

  // private List<String> status;

  // private String jobId; - search

  // private LocalDate startDate;
  // private LocalDate endDate;

  // private List<String> assigneeUidx;

  //   <--- filter states
  const [status, setStatus] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [assigneeUidx, setAssigneeUidx] = useState('');
  // --->

  // filters
  // to manage filters applied state for sales order filters
  const [filtersApplied, setFiltersApplied] = useState(0);
  const [filterState, setFilterState] = useState({
    status: 0,
    startDate: 0,
    endDate: 0,
    assigneeUidx: 0,
  });

  const statuses = useMemo(
    () => [
      { value: 'CREATED', label: 'Created' },
      { value: 'INPROGRESS', label: 'In Progress' },
      { value: 'APPROVAL_PENDING', label: 'Approval Pending' },
      { value: 'COMPLETED', label: 'Completed' },
    ],
    [],
  );

  const userUidxList = useMemo(() => usersList.map((user) => user.uidx), [usersList]);

  const applyFilter = () => {
    setFilters({
      status: status ? [status.value] : [],
      startDate,
      endDate,
      assigneeUidx: assigneeUidx ? [assigneeUidx.uidx] : userUidxList,
    });
  };

  const handleClearFilter = () => {
    setStatus('');
    setStartDate('');
    setEndDate('');
    setAssigneeUidx('');
    setFiltersApplied(0);
    setFilterState({
      status: 0,
      startDate: 0,
      endDate: 0,
      assigneeUidx: 0,
    });
    setFilters({
      status: [],
      startDate: '',
      endDate: '',
      assigneeUidx: userUidxList,
    });
  };

  const removeFilters = (filterType) => {
    switch (filterType) {
      case 'startDate':
        setFiltersApplied((prev) => prev - 1);
        setFilterState({ ...filterState, startDate: 0 });
        setStartDate('');
        setFilters({
          ...filters,
          startDate: '',
        });
        break;
      case 'endDate':
        setFiltersApplied((prev) => prev - 1);
        setFilterState({ ...filterState, endDate: 0 });
        setEndDate('');
        setFilters({
          ...filters,
          endDate: '',
        });
        break;
      case 'status':
        setFiltersApplied((prev) => prev - 1);
        setFilterState({ ...filterState, status: 0 });
        setStatus('');
        setFilters({
          ...filters,
          status: [],
        });
        break;
      case 'assigneeUidx':
        setFiltersApplied((prev) => prev - 1);
        setFilterState({ ...filterState, assigneeUidx: 0 });
        setAssigneeUidx('');
        setFilters({
          ...filters,
          assigneeUidx: userUidxList,
        });
        break;
      default:
        return;
    }
  };

  const filterChipBoxes = (
    <>
      {filterState.startDate === 1 && (
        <Box className="singleChipDisplayBox">
          <ChipBoxHeading heading="Start From" />
          <Box className="insideSingleChipDisplayBox">
            <Chip
              label={startDate}
              onDelete={() => removeFilters('startDate')}
              deleteIcon={<CancelOutlinedIcon />}
              color="primary"
              variant="outlined"
            />
          </Box>
        </Box>
      )}
      {filterState.endDate === 1 && (
        <Box className="singleChipDisplayBox">
          <ChipBoxHeading heading="End Till" />
          <Box className="insideSingleChipDisplayBox">
            <Chip
              label={endDate}
              onDelete={() => removeFilters('endDate')}
              deleteIcon={<CancelOutlinedIcon />}
              color="primary"
              variant="outlined"
            />
          </Box>
        </Box>
      )}
      {filterState.status === 1 && (
        <Box className="singleChipDisplayBox">
          <ChipBoxHeading heading="Status" />
          <Box className="insideSingleChipDisplayBox">
            <Chip
              label={status.label || ''}
              onDelete={() => removeFilters('status')}
              deleteIcon={<CancelOutlinedIcon />}
              color="primary"
              variant="outlined"
            />
          </Box>
        </Box>
      )}
      {filterState.assigneeUidx === 1 && (
        <Box className="singleChipDisplayBox">
          <ChipBoxHeading heading="Counter" />
          <Box className="insideSingleChipDisplayBox">
            <Chip
              label={assigneeUidx.value || ''}
              onDelete={() => removeFilters('assigneeUidx')}
              deleteIcon={<CancelOutlinedIcon />}
              color="primary"
              variant="outlined"
            />
          </Box>
        </Box>
      )}
    </>
  );

  //   <--- selectboxes
  //   status select
  const statusSelect = (
    <>
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
        options={statuses}
        onChange={(option, e) => handleStatus(option)}
      />
    </>
  );

  //   counter select
  const counterSelect = (
    <>
      <SoftSelect
        placeholder="Select Counter"
        {...(assigneeUidx.label
          ? {
              value: {
                value: assigneeUidx.value,
                label: assigneeUidx.label,
              },
            }
          : {
              value: {
                value: '',
                label: 'Select Counter',
              },
            })}
        options={usersList}
        onChange={(option, e) => handleCounter(option)}
      />
    </>
  );

  // start date
  const startDateSelect = (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          views={['year', 'month', 'day']}
          label="Select Start Date"
          value={startDate ? dayjs(startDate) : ''}
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

  //  end date
  const endDateSelect = (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          views={['year', 'month', 'day']}
          label="Select End Date"
          value={endDate ? dayjs(endDate) : ''}
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

  // --->

  //   <--- functions
  // handle status fn
  const handleStatus = (option) => {
    setStatus(option);

    if (option !== '') {
      if (filterState['status'] === 0) {
        setFiltersApplied((prev) => prev + 1);
        setFilterState({ ...filterState, status: 1 });
      }
    }
  };

  // handle counter fn
  const handleCounter = (option) => {
    setAssigneeUidx(option);

    if (option !== '') {
      if (filterState['assigneeUidx'] === 0) {
        setFiltersApplied((prev) => prev + 1);
        setFilterState({ ...filterState, assigneeUidx: 1 });
      }
    }
  };

  // handle start date fn
  const handleStartDate = (date) => {
    if (date) {
      // Format the date as a string in the 'YYYY-MM-DD' format
      const formattedDate = dayjs(date).format('YYYY-MM-DD');
      setStartDate(formattedDate);

      if (filterState['startDate'] === 0) {
        setFiltersApplied((prev) => prev + 1);
        setFilterState({ ...filterState, startDate: 1 });
      }
    }
  };

  // handle end date fn
  const handleEndDate = (date) => {
    if (date) {
      // Format the date as a string in the 'YYYY-MM-DD' format
      const formattedDate = dayjs(date).format('YYYY-MM-DD');
      setEndDate(formattedDate);

      if (filterState['endDate'] === 0) {
        setFiltersApplied((prev) => prev + 1);
        setFilterState({ ...filterState, endDate: 1 });
      }
    }
  };

  //   --->

  // select boxes array to pass as prop to Filter component
  const selectBoxArray = [statusSelect, startDateSelect, endDateSelect, counterSelect];

  return (
    <>
      <Filter
        filtersApplied={filtersApplied}
        filterChipBoxes={filterChipBoxes}
        selectBoxArray={selectBoxArray}
        handleApplyFilter={applyFilter}
        handleClearFilter={handleClearFilter}
      />
    </>
  );
};
