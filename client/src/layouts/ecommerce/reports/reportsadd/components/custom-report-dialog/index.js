import { Typography } from '@mui/material';
import { buttonStyles } from '../../../../Common/buttonColor';
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import React, { useState } from 'react';
import Slide from '@mui/material/Slide';
import SoftButton from '../../../../../../components/SoftButton';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

function CustomReport() {
  const [open, setOpen] = useState(false);
  const [reportTemplateType, setReportTemplateType] = useState('');

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setReportTemplateType('');
  };

  const reportTemplateHandler = (e) => {
    setReportTemplateType(e.target.value);
  };

  return (
    <>
      <SoftButton
        variant={buttonStyles.primaryVariant}
        className="contained-softbutton"
        // sx={{
        //   border: '1px solid #80808094',
        //   height: '90%',
        //   width: 'auto',
        //   padding: '2px 6px 2px 6px',
        //   borderRadius: '5px',
        //   display: 'flex',
        //   alignItems: 'center',
        //   justifyContent: 'space-between',
        //   gap: '6px',
        // }}
        onClick={handleClickOpen}
      >
        <AddIcon
          // sx={{
          //   fontSize: '1rem !important',
          //   color: '#344767 !important',
          // }}
        />
        {/* <Typography
          variant="caption"
          sx={{
            fontWeight: '600 !important',
            color: '#344767 !important',
            fontSize: '0.65rem !important',
            textTransform: 'capitalize',
          }}
        >
          Create custom report
        </Typography> */}
        Create Custom Report
      </SoftButton>
      <Dialog open={open} onClose={handleClose} aria-describedby="alert-dialog-slide-description" TransitionComponent={Transition}>
        <DialogTitle borderBottom="1px solid lightgrey">Create custom report</DialogTitle>
        <DialogContent sx={{ background: '#f7fafc' }}>
          <DialogContentText id="alert-dialog-slide-description" fontSize="0.9rem !important" color="black !important" mt={1}>
            Start by selecting a report template. You can edit columns and filters after you create your custom report.
            <Typography fontSize="0.9rem" mt={1}>
              Report Title
            </Typography>
            {reportTemplateType && (
              <Typography
                sx={{
                  border: '1px solid black',
                  background: 'white',
                  height: 'auto',
                  width: '100%',
                  p: '10px',
                  fontSize: '0.9rem',
                  borderRadius: '10px',
                  mt: '5px',
                }}
              >
                {reportTemplateType}
              </Typography>
            )}
            <Typography  fontSize="0.9rem" mt={1} fontWeight="bold">
              Report Template
            </Typography>
          </DialogContentText>
          <Box pl={1} mt={0.5}>
            <FormControl>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="female"
                name="radio-buttons-group"
                fontWeight="100"
                onChange={reportTemplateHandler}
              >
                <FormControlLabel
                  value="Sales over time"
                  control={<Radio />}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                  }}
                  label={<Typography fontSize="0.9rem" color="black !important">Sales over time</Typography>}
                />
                <FormControlLabel
                  value="Payments by method"
                  control={<Radio />}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                  }}
                  label={<Typography fontSize="0.9rem" color="black !important">Payments by method</Typography>}
                />
                <FormControlLabel
                  value="Tax Collected over time"
                  control={<Radio />}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                  }}
                  label={<Typography fontSize="0.9rem" color="black !important">Tax Collected over time</Typography>}
                />
                <FormControlLabel
                  value="Session over time"
                  control={<Radio />}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                  }}
                  label={<Typography fontSize="0.9rem" color="black !important">Session over time</Typography>}
                />
                <FormControlLabel
                  value="Customers by order value"
                  control={<Radio />}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                  }}
                  label={<Typography fontSize="0.9rem" color="black !important">Customers by order value</Typography>}
                />
              </RadioGroup>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid lightgrey' }}>
          <SoftButton
            onClick={handleClose}
            variant={buttonStyles.outlinedColor}
            className="outlined-softbutton"
            // sx={{
            //   border: '1px solid gray',
            //   background: 'white',
            //   color: 'black !important',
            //   fontWeight: 'bold',
            // }}
          >
            Cancel
          </SoftButton>
          <SoftButton
            onClick={handleClose}
            // color="primary"
            variant={buttonStyles.primaryVariant}
            className="contained-softbutton"
            // sx={{
            //   border: '1px solid lightgray',
            //   color: 'white !important',
            //   fontWeight: 'bold',
            //   background: '#587DEC',
            // }}
          >
            Create Custom Report
          </SoftButton>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default CustomReport;
