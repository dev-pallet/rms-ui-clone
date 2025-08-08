import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SoftBox from '../../../../../../components/SoftBox';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';

export default function SlideCart({ cartdetails, openCart }) {
  const [state, setState] = React.useState({
    right: openCart,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const closeDrawer = (anchor) => () => {
    setState({ ...state, [anchor]: false });
  };

  const list = (anchor) => (
    <Box role="presentation">
      <SoftBox style={{ minWidth: '700px' }}>{cartdetails}</SoftBox>
      <Button onClick={closeDrawer(anchor)}>Close</Button>
    </Box>
  );

  return (
    <div>
      <React.Fragment key="right" style={{ width: '600px' }}>
        {/* <Button onClick={toggleDrawer("right", true)}> <ArrowCircleLeftIcon /> </Button> */}
        <Box
          display="flex"
          gap={1}
          onClick={toggleDrawer('right', true)}
          style={{ backgroundColor: '#0562FB', borderRadius: '10px 0 0 10px', height: '-20px' }}
        >
          <Box
            className="navigate-wrapper-product-box"
            style={{ backgroundColor: '#0562FB' }}
            onClick={toggleDrawer('right', true)}
          >
            <ShoppingCartIcon
              className="paymentPageBackBtn"
              style={{ boxShadow: 'none !important', color: 'white' }}
              fontSize="medium"
            />
          </Box>
        </Box>
        <SwipeableDrawer
          anchor="right"
          open={state.right}
          onClose={toggleDrawer('right', false)}
          onOpen={toggleDrawer('right', true)}
          // onClick={toggleDrawer('right', false)}
          PaperProps={{
            sx: {
              borderRadius: 3,
              overflowY: 'visible',
            },
          }}
          sx={{
            width: '300px',
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: '500px',
              padding: '10px',
            },
          }}
        >
          {list('right')}
        </SwipeableDrawer>
      </React.Fragment>
    </div>
  );
}
