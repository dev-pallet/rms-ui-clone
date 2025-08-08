import { LocalizationProvider, StaticDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import './static-datepicker.css';
import MobileDrawerCommon from '../../MobileDrawer';
import dayjs from 'dayjs';

const CommonStaticDatePicker = ({
  openDatePicker,
  onCloseFunction,
  datePickerOnAccpetFunction,
  value,
  disablePast,
}) => {
  return (
    <MobileDrawerCommon
      drawerOpen={openDatePicker}
      // drawerOpen={true}
      anchor="bottom"
      drawerClose={onCloseFunction}
      className="filter-values-main-div"
    >
      <LocalizationProvider autoFocus={false} dateAdapter={AdapterDayjs}>
        <StaticDatePicker
          disablePast={disablePast}
          defaultValue={dayjs(value)}
          // onAccept={(value) => {
          //   datePickerOnAccpetFunction(value.toISOString().split('T')[0]); // sending YYYY-MM-DD as value
          //   onCloseFunction();
          // }}
          onAccept={(value) => {
            const date = new Date(value.$d);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
            const day = String(date.getDate()).padStart(2, '0');
            const formattedDate = `${year}-${month}-${day}`;
            datePickerOnAccpetFunction(formattedDate); // sending YYYY-MM-DD as value
            onCloseFunction();
          }}
        />
      </LocalizationProvider>
    </MobileDrawerCommon>
  );
};

export default CommonStaticDatePicker;
