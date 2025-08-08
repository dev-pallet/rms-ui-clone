import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { Box, Chip, Typography } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

// selected filter display area
// single chip box heading
export const ChipBoxHeading = ({ heading }) => (
  <>
    <Typography className="chipDisplayBoxHeading">{heading}</Typography>
  </>
);

// filterState and filtersApplied handle function --> to change the filter state from 0 to 1
export const filterStateAndFiltersAppliedHandleFn = (filterType, filterState, setFilterState) => {
  if (filterState[filterType] === 0) {
    // setFiltersApplied((prev) => prev + 1);
    setFilterState({ ...filterState, [filterType]: 1 });
  }
};

// single filter chip box - heading(filter type name), label(selected filter name), key(object key from filterState), removeSelectedFilter(function to remove the selected filter)
export const FilterChipDisplayBox = ({ heading, label, objKey, removeSelectedFilter }) => {
  // console.log(heading, label, objKey, removeSelectedFilter);
  return (
    <Box className="singleChipDisplayBox">
      <ChipBoxHeading heading={heading} />
      <Box className="insideSingleChipDisplayBox">
        <Chip
          label={label}
          onDelete={() => removeSelectedFilter(objKey)}
          deleteIcon={<CancelOutlinedIcon />}
          color="primary"
          variant="outlined"
        />
      </Box>
    </Box>
  );
};

// select
// start date select
export const StartDateSelect = ({
  startDate,
  handleStartDate,
  label = 'Select Start Date',
  dateFormat = 'DD/MM/YYYY',
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        views={['year', 'month', 'day']}
        label={label}
        value={startDate ? dayjs(startDate) : null}
        format={dateFormat}
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
  );
};

export const EndDateSelect = ({ endDate, handleEndDate, label = 'Select End Date', dateFormat = 'DD/MM/YYYY' }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        views={['year', 'month', 'day']}
        label={label}
        value={endDate ? dayjs(endDate) : null}
        format={dateFormat}
        onChange={(date) => {
          // handleEndDate(date.$d);
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
  );
};
