import { Order } from '../../Order/order';
import React from 'react';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  maxHeight: '450px',
  bgcolor: 'background.paper',
  border: '1px solid gray',
  borderRadius: '10px',
  boxShadow: 14,
  p: 4,
};
const VendorDetailsProducts = () => {

  return (
    <div style={{padding:'15px'}}>
      <Order />
    </div>
  );
};

export default VendorDetailsProducts;