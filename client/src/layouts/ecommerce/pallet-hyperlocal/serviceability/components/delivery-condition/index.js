import { Box, Grid, Radio, RadioGroup, Tooltip } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SoftBox from '../../../../../../components/SoftBox';
import SoftInput from '../../../../../../components/SoftInput';
import SoftTypography from '../../../../../../components/SoftTypography';

const DeliveryTypeCondition = (props) => {
  return (
    <Box>
      <SoftBox ml={2.5}>
        <Grid container p={2}>
          <Grid item md={12} sm={12} xs={12} mt={2} ml={-0.5}>
            <SoftTypography fontSize="16px" fontWeight="bold">
              Select the type of delivery you provide
            </SoftTypography>
          </Grid>
          <Grid item md={12} sm={12} xs={12} mt={2} ml={0.5}>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              name="radio-buttons-group"
              value={props.selectedOption}
              onChange={props.onSelectOptionChange}
            >
              <FormControlLabel
                value="same"
                control={<Radio size="small" />}
                label={<span style={{ fontSize: '0.75rem' }}>Same day Delivery</span>}
              />
              <FormControlLabel
                value="next"
                control={<Radio size="small" />}
                label={<span style={{ fontSize: '0.75rem' }}>Next day Delivery</span>}
              />
              <FormControlLabel
                value="mini"
                control={<Radio size="small" />}
                label={
                  <span style={{ fontSize: '0.85rem' }}>
                    Minimun 2-day Delivery{' '}
                    <Tooltip
                      mt={3}
                      title="Enter the minimum number of business days it would take to prepare and deliver an order."
                    >
                      <InfoOutlinedIcon fontSize="small" color={'info'} />{' '}
                    </Tooltip>
                  </span>
                }
              />
            </RadioGroup>
          </Grid>
          <Grid item md={12} sm={12} xs={12} mt={2}>
            <SoftBox display="flex" alignItems="center" gap="10px" width="200px">
              {props.selectedOption === 'same' || props.selectedOption === 'next' || props.selectedOption === 'mini' ? (
                <Box>
                  <span style={{ fontSize: '0.85rem' }}>
                    Cut-off Time{' '}
                    <Tooltip mt={3} title="Time taken to process the orders.">
                      <InfoOutlinedIcon fontSize="small" color={'info'} />{' '}
                    </Tooltip>
                  </span>
                  <SoftInput type="time" value={props.cutOffTime} onChange={props.onCutOffTimeChange} />
                </Box>
              ) : null}
            </SoftBox>
          </Grid>
        </Grid>
      </SoftBox>
    </Box>
  );
};

export default DeliveryTypeCondition;
