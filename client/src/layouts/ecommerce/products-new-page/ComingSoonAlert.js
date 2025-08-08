import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Typography } from '@mui/material';

const ComingSoonAlert = ({ open, handleClose }) => {

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {"Coming Soon"}
      </DialogTitle>
      <DialogContent>
        <img src="https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_new_ui_images/5643241.jpg" style={{width: "400px", height: "300px"}} />
        <Typography style={{textAlign: "center", fontSize: "20px", fontWeight: "600", marginTop: "20px"}}>
          We are coding!
        </Typography>
        <Typography style={{textAlign: "center", fontSize: "14px"}}>
          Coming Soon!
        </Typography>
      </DialogContent>
      {/* <DialogActions>
        <Button onClick={handleDisagree} color="primary">
          Disagree
        </Button>
        <Button onClick={handleAgree} color="primary" autoFocus>
          Agree
        </Button>
      </DialogActions> */}
    </Dialog>
  );
};

export default ComingSoonAlert;
