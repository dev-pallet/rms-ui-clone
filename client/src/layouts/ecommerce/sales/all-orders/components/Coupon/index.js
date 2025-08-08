import './coupon.css';
import * as React from 'react';
import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

export default function CouponModal() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Typography fontSize="15px" fontWeight="normal" className="coupon-btn" onClick={handleOpen}>
        View All Coupons
      </Typography>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-description" sx={{ mt: 2 }} display="flex" justifyContent="space-between">
            <Typography>30% OFF upto ₹120</Typography>
            <Button> Apply </Button>
          </Typography>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Code: EASY10
          </Typography>
          <hr />
          <Typography id="modal-modal-description" sx={{ mt: 2 }} display="flex" justifyContent="space-between">
            <Typography>20% OFF upto ₹100</Typography>
            <Button> Apply </Button>
          </Typography>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Code: GAIN70
          </Typography>
        </Box>
      </Modal>
    </>
  );
}
