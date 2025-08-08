import * as React from 'react';
import { Card, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import SoftButton from '../../../../components/SoftButton';
import SoftTypography from '../../../../components/SoftTypography';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '1px solid gray',
  borderRadius: '10px',
  boxShadow: 14,
  p: 4,

};

const cardStyle = {
  fontWeight: '600',
  fontSize: '1.2rem',
  lineHeight: '2',
  color: '#4b524d',
};

const outerCardStyle = {
  cursor: 'pointer',
  marginTop: '15px',
  textAlign: 'center',
  padding: '20px !important',
  boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
};

export default function CreateCouponModal() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const navigate = useNavigate();

  const handlecoupon = (event) => {
    navigate('/coupons/create/cart-value');
  };
  const handleproduct = (event) => {
    navigate('/coupons/create/product');
  };
  const handlepreapproved = (event) => {
    navigate('/coupons/create/preapproved');
  };
  const handleFreebie = () => {
    navigate('/coupons/create/freebie');
  };
  const handleDynamic = () => {
    navigate('/coupons/create/dynamic');
  };
  return (
    <div>
      <SoftButton onClick={handleOpen} color="info">
        + New
      </SoftButton>
      <Modal
        keepMounted
        open={open}
        onClose={handleClose}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
        sx={{
          '& > .MuiBackdrop-root': {
            backdropFilter: 'blur(5px)',
          },
        }}
      >
        <Box sx={style}>
          <SoftTypography style={{ fontSize: '1rem' }}>Select Coupon Type</SoftTypography>
          <hr
            style={{
              color: 'blue',
              backgroundColor: 'lightgray',
              marginTop: '10px',
              marginBottom: '10px',
              height: '1px',
              border: 'none',
              opacity: '0.4',
            }}
          />
          <Grid container spacing={2}>
            <Grid item xs={12} onClick={handlecoupon}>
              <Card sx={outerCardStyle}>
                <SoftTypography textGradient color="info" style={cardStyle}>
                  By Cart Value{' '}
                </SoftTypography>{' '}
              </Card>
            </Grid>

            <Grid item xs={12} onClick={handleproduct}>
              <Card sx={outerCardStyle}>
                <SoftTypography textGradient color="info" style={cardStyle}>
                  Product{' '}
                </SoftTypography>{' '}
              </Card>
            </Grid>
            <Grid item xs={12} onClick={handlepreapproved}>
              <Card sx={outerCardStyle}>
                <SoftTypography textGradient color="info" style={cardStyle}>
                  Preapproved{' '}
                </SoftTypography>{' '}
              </Card>
            </Grid>
            <Grid item xs={12} onClick={handleFreebie}>
              <Card sx={outerCardStyle}>
                <SoftTypography textGradient color="info" style={cardStyle}>
                  Freebie{' '}
                </SoftTypography>{' '}
              </Card>
            </Grid>
            {/* <Grid item xs={12} onClick={handleDynamic}>
              <Card sx={outerCardStyle}>
            <SoftTypography
              textGradient
              color="info"
                    style={{ fontWeight: '600', fontSize: '1.2rem', lineHeight: '2', color: '#4b524d' , margin:"10px !important" }}
            >
              Dynamic{' '}
            </SoftTypography>{' '}
          </Card>
        </Grid> */}
          </Grid>
        </Box>
      </Modal>
    </div>
  );
}
