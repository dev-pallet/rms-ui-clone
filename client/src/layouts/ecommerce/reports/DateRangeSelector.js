import React, { useState } from 'react';
import { DateRangePicker } from 'react-date-range';
import { format } from 'date-fns';

import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

import PropTypes from 'prop-types';
import SoftButton from '../../../components/SoftButton';
import { defaultStaticRanges } from './DefaultRanges';

const DateRangeSelector = ({ ranges, onChange, onSubmit, showDateRangeSelector, handleDateSelect, ...rest }) => {
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection',
  });
  const [show, setShow] = useState(false);

  function formatDateDisplay(date, defaultText) {
    if (!date) return defaultText;
    return format(date, 'MM/dd/yyyy');
  }

  const handleSelect = (ranges) => {
    setSelectedDateRange(ranges.selection);
  };

  const onClickClear = () => {
    setSelectedDateRange({
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    });
    setShow(false);
  };

  const handleDone = () => {
    setShow(true);
    handleDateSelect(selectedDateRange);
  };
  return (
    <React.Fragment>
      <div className="shadow d-inline-block">
        <DateRangePicker
          onChange={handleSelect}
          showSelectionPreview={true}
          moveRangeOnFirstSelection={false}
          months={2}
          ranges={[selectedDateRange]}
          direction="horizontal"
          maxDate={new Date()}
        //   rangeColors={['#0d6efd']}
          style={{ fontSize: '12px', width: '300px' }}
        />
        <div
          className="text-right position-relative rdr-buttons-position mr-3"
          style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}
        >
          <SoftButton size="small" variant="outlined" color="info" onClick={onClickClear}>
            Clear
          </SoftButton>
          <SoftButton size="small" color="info" onClick={handleDone}>
            Done
          </SoftButton>
        </div>
      </div>
    </React.Fragment>
  );
};

DateRangeSelector.defaultProps = {
  ranges: defaultStaticRanges,
};

DateRangeSelector.propTypes = {
  onSubmit: PropTypes.func,
};

export default DateRangeSelector;
