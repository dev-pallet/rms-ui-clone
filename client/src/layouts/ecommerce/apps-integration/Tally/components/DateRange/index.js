import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import SoftBox from '../../../../../../components/SoftBox';
import SoftSelect from '../../../../../../components/SoftSelect';
import SoftTypography from '../../../../../../components/SoftTypography';

const DateRange = ({ handleStartDateTimeChange, handleEndDateTimeChange, totalCompany,handleSelectCompanyToImportData }) => {
  return (
    <SoftBox className="tally-date-range">
      <SoftBox className="date-range-details">
        <SoftTypography className="date-range-top-heading">
          Choose the sync date range for configuration in Tally
        </SoftTypography>
        <SoftTypography className="date-range-sub-heading">
          Select the sync date range for which you want to synchronize data with tally. This configuration will
          determine the settings for the chosen sync date range.
        </SoftTypography>
      </SoftBox>
      <SoftBox className="sync-data-company">
        <SoftSelect
          className="syn-data-company-list"
          options={totalCompany}
          onChange={(option) => handleSelectCompanyToImportData(option)}
        />
      </SoftBox>
      <SoftBox className="date-range-start-end">
        <SoftBox className="start-date-range">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MobileDateTimePicker
              label="Start date"
              sx={{
                width: '14rem',
                '& .MuiInputLabel-formControl': {
                  fontSize: '0.8rem',
                  top: '-0.4rem',
                  color: '#344767',
                },
              }}
              format="DD/MM/YYYY hh:mm A"
              popperPlacement="right-end"
              onChange={handleStartDateTimeChange}
            />
          </LocalizationProvider>
        </SoftBox>
        <SoftBox className="end-date-range">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MobileDateTimePicker
              label="End date"
              sx={{
                width: '14rem',
                '& .MuiInputLabel-formControl': {
                  fontSize: '0.8rem',
                  top: '-0.4rem',
                  color: '#344767',
                },
              }}
              format="DD/MM/YYYY hh:mm A"
              popperPlacement="right-end"
              onChange={handleEndDateTimeChange}
            />
          </LocalizationProvider>
        </SoftBox>
      </SoftBox>
    </SoftBox>
  );
};

export default DateRange;
