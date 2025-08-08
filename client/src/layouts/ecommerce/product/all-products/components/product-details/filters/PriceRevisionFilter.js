import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { Box, Chip } from '@mui/material';
import {
  ChipBoxHeading,
  filterStateAndFiltersAppliedHandleFn,
} from '../../../../../Common/Filter Components/filterComponents';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { formatDateDDMMYYYY } from '../../../../../Common/CommonFunction';
import { useState } from 'react';
import Filter from '../../../../../Common/Filter';
import SoftSelect from '../../../../../../../components/SoftSelect';
import dayjs from 'dayjs';

export default function PriceRevisionFilter() {
  //   Date (date range), Batch , MRP (min-max), Selling Price (min-max),
  // Purchase Price (min-max), Revised By (Name)
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // to manage filters applied state for sales order filters
  const [filterState, setFilterState] = useState({
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

  const batchSelect = (
    <>
      <SoftSelect placeholder="Select Batch" name="batch" />
    </>
  );

  const mrpSelect = (
    <>
      <SoftSelect placeholder="Select MRP" name="mrp" />
    </>
  );

  const sellingPriceSelect = (
    <>
      <SoftSelect placeholder="Select Selling Price" name="sellingPrice" />
    </>
  );

  const purchasePriceSelect = (
    <>
      <SoftSelect placeholder="Select Purchase Price" name="purchasePrice" />
    </>
  );

  const revisedBySelect = (
    <>
      <SoftSelect placeholder="Select Revised By" name="revisedBy" />
    </>
  );

  // functions
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
      case 'startDate':
        setStartDate(null);
        // if (filterObject.from) {
        //   delete filterObject.from;
        // }
        break;
      case 'endDate':
        setEndDate(null);
        // if (filterObject.to) {
        //   delete filterObject.to;
        // }
        break;
    }
    setFilterState({ ...filterState, [filterType]: 0 });
  };

  // fn to apply sales order Filter
  const applyFilter = () => {};

  // fn to  clear the  filter
  const handleClearFilter = () => {
    setStartDate(null);
    setEndDate(null);

    // reset filterState
    setFilterState({
      startDate: 0,
      endDate: 0,
    });

    // set on clear to true
    // setOnClear(true);
  };

  const selectBoxArray = [startDateSelect, endDateSelect];

  // applied filters count
  const filterLength = Object.values(filterState).filter((value) => value === 1).length;

  return (
    <>
      <Filter
        color="#344767"
        filtersApplied={filterLength}
        filterChipBoxes={filterChipBoxes}
        selectBoxArray={selectBoxArray}
        // handleApplyFilter={applyFilter}
        handleClearFilter={handleClearFilter}
      />
    </>
  );
}
