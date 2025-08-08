import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import SoftBox from '../../../../components/SoftBox';
import Spinner from '../../../../components/Spinner';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AlertDialogSlide({ open, handleClose, handleUpdate, loader }) {

  return (
    <React.Fragment>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <SoftBox p={2}>
          <DialogTitle>{'Update loyalty program?'}</DialogTitle>
          <hr />
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              {loader ? <Spinner /> : 'By proceeding, your loyalty program will be updated with the changes you made.'}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="error" onClick={handleClose}>Cancel</Button>
            <Button variant="contained" className='proceed-btn-alert' onClick={handleUpdate}>Yes, proceed</Button>
          </DialogActions>
        </SoftBox>
      </Dialog>
    </React.Fragment>
  );
}
