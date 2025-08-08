import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import SoftBox from '../../../../../../components/SoftBox';
import SoftTypography from '../../../../../../components/SoftTypography';

const SyncData = ({ syncData, handleSyncDataChange }) => {
  return (
    <SoftBox className="sync-data">
      <SoftBox className="sync-data-details">
        <SoftTypography className="sync-data-top-heading">
          Choose the data you want to sync for configuration in Tally
        </SoftTypography>
        <SoftTypography className="sync-data-sub-heading">
          Select the data you want to sync for which you want to synchronize data with tally. This configuration will
          determine the settings for the chosen data.
        </SoftTypography>
      </SoftBox>

      <SoftBox className="sync-form-data">
        <SoftBox className="sync-form" sx={{ height: '12rem', overflow: 'auto' }}>
          <FormGroup className="sync-checkbox-container">
            {syncData?.map((item, index) => (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={item?.isChecked}
                    name={item?.name}
                    onChange={(e) => handleSyncDataChange(e, index)}
                  />
                }
                label={item?.name}
              />
            ))}
          </FormGroup>
        </SoftBox>
      </SoftBox>
    </SoftBox>
  );
};

export default SyncData;
