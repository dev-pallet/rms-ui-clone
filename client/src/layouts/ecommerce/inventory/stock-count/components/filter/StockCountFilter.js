import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { Box, Chip } from '@mui/material';
import { ChipBoxHeading, EndDateSelect, StartDateSelect } from '../../../../Common/Filter Components/filterComponents';
import { formatDateDDMMYYYY } from '../../../../Common/CommonFunction';
import {
  getStockCountFiltersCount,
  getStockCountFiltersStateData,
  getStockCountUsersList,
  setStockCountFilterStateData,
  setStockCountFilters,
  setStockCountFiltersAppliedCount,
  setStockCountPage,
} from '../../../../../../datamanagement/Filters/stockCountSlice';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import Filter from '../../../../Common/Filter';
import React, { useMemo, useState } from 'react';
import SoftSelect from '../../../../../../components/SoftSelect';
import dayjs from 'dayjs';

export default function StockCountFilter({ filterObjectMain }) {
  const dispatch = useDispatch();
  const persistedUsersList = useSelector(getStockCountUsersList);
  const persistedFiltersAppliedCount = useSelector(getStockCountFiltersCount);
  const persistedFilterStateData = useSelector(getStockCountFiltersStateData);

  const [status, setStatus] = useState(filterObjectMain?.status || '');
  const [startDate, setStartDate] = useState(filterObjectMain?.startDate || '');
  const [endDate, setEndDate] = useState(filterObjectMain?.endDate || '');
  const [assigneeUidx, setAssigneeUidx] = useState(filterObjectMain?.assigneeUidx || '');

  // filters
  // to manage filters applied state for sales order filters
  const [filtersApplied, setFiltersApplied] = useState(persistedFiltersAppliedCount || 0);
  const [filterState, setFilterState] = useState({
    status: persistedFilterStateData?.status || 0,
    startDate: persistedFilterStateData?.startDate || 0,
    endDate: persistedFilterStateData?.endDate || 0,
    assigneeUidx: persistedFilterStateData?.assigneeUidx || 0,
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

  const filterChipBoxes = (
    <>
      {/* status  */}
      {filterState.status === 1 && (
        <Box className="singleChipDisplayBox">
          <ChipBoxHeading heading="Status" />
          <Box className="insideSingleChipDisplayBox">
            <Chip
              label={status.label || ''}
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
          <ChipBoxHeading heading="Start Date" />
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
          <ChipBoxHeading heading="End Date" />
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

      {/* assignee  */}
      {filterState.assigneeUidx === 1 && (
        <Box className="singleChipDisplayBox">
          <ChipBoxHeading heading="Assignee" />
          <Box className="insideSingleChipDisplayBox">
            <Chip
              label={assigneeUidx.label || ''}
              onDelete={() => removeSelectedFilter('assigneeUidx')}
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

  const AssigneeSelect = (
    <>
      <SoftSelect
        placeholder="Select Assignee"
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
                label: 'Select Assignee',
              },
            })}
        options={persistedUsersList}
        onChange={(option, e) => handleAssignee(option)}
      />
    </>
  );

  // fn to remove selected filter
  const removeSelectedFilter = (filterType) => {
    switch (filterType) {
      case 'status':
        setStatus('');
        setFilterState({ ...filterState, status: 0 });
        setFiltersApplied((prev) => prev - 1);
        break;
      case 'startDate':
        setStartDate('');
        setFilterState({ ...filterState, startDate: 0 });
        setFiltersApplied((prev) => prev - 1);
        break;
      case 'endDate':
        setEndDate('');
        setFilterState({ ...filterState, endDate: 0 });
        setFiltersApplied((prev) => prev - 1);
        break;
      case 'assigneeUidx':
        setAssigneeUidx('');
        setFilterState({ ...filterState, assigneeUidx: 0 });
        setFiltersApplied((prev) => prev - 1);
        break;
      default:
        return;
    }
  };

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

  //   handle counter/asigneed fn
  const handleAssignee = (option) => {
    setAssigneeUidx(option);

    if (option !== '') {
      if (filterState['assigneeUidx'] === 0) {
        setFiltersApplied((prev) => prev + 1);
        setFilterState({ ...filterState, assigneeUidx: 1 });
      }
    }
  };

  const applyFilter = () => {
    dispatch(
      setStockCountFilters({
        status,
        startDate,
        endDate,
        assigneeUidx,
      }),
    );
    dispatch(setStockCountFiltersAppliedCount(filtersApplied));
    dispatch(setStockCountFilterStateData(filterState));
    dispatch(setStockCountPage(0));
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

    dispatch(setStockCountFilters(null));
    dispatch(setStockCountFiltersAppliedCount(0));
    dispatch(setStockCountFilterStateData(null));
    // dispatch(setStockCountSearchValue(''));
    dispatch(setStockCountPage(0));
  };

  // select boxes array to pass as prop to Filter component
  const selectBoxArray = [
    statusSelect,
    <StartDateSelect
      startDate={startDate}
      handleStartDate={handleStartDate}
      label="Select Start Date"
      dateFormat="DD/MM/YYYY"
    />,
    <EndDateSelect endDate={endDate} handleEndDate={handleEndDate} label="Select End Date" dateFormat="DD/MM/YYYY" />,
    AssigneeSelect,
  ];

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
}
