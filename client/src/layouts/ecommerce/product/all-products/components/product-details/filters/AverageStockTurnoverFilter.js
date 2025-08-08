import '../product-detailspage.css';
import { Box, Menu, Slider } from '@mui/material';
import { useState } from 'react';
import Filter from '../../../../../Common/Filter';
import SoftSelect from '../../../../../../../components/SoftSelect';

export default function AverageStockTurnoverFilter() {
  // Inwared Date, Quantity (min-max), Batch, Available Units (min-max), Stock Turnover

  const inwardedDateSelect = (
    <>
      <SoftSelect placeholder="Select Inwarded Date" name="inwardedDate" />
    </>
  );

  const [minQuantity, setMinQuantity] = useState(50); // Initial value for the min slider
  const [maxQuantity, setMaxQuantity] = useState(50); // Initial value for the max slider

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMinQuantity = (newValue) => {
    setMinQuantity(newValue);
  };

  const handleMaxQuantity = (newValue) => {
    setMaxQuantity(newValue);
  };

  const quantitySelect = (
    <>
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          padding: '0px 12px',
          border: '1px solid gainsboro',
          borderRadius: '0.5rem',
          opacity: 0.7,
        }}
        onClick={handleClick}
      >
        Select Quantity
      </Box>

      <Menu
        PaperProps={{ style: { maxWidth: 'none', width: '220px' } }}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <Box className="min-select-div">
          Min Quantity
          <br />
          <Slider
            sx={{ '& .MuiSlider-valueLabel': { color: '#ffffff' } }}
            aria-label="Always visible"
            defaultValue={minQuantity}
            // getAriaValueText={(value) => setMinQuantity(value)}
            getAriaValueText={handleMinQuantity}
            step={10}
            marks={[
              {
                value: 0,
                label: '0',
              },
              {
                value: 100,
                label: '100',
              },
            ]}
            // valueLabelDisplay="on"
            valueLabelDisplay="auto"
          />
        </Box>
        <Box className="max-select-div">
          Max Quantity
          <br />
          <Slider
            sx={{ '& .MuiSlider-valueLabel': { color: '#ffffff' } }}
            aria-label="Always visible"
            defaultValue={maxQuantity}
            // getAriaValueText={(value) => setMaxQuantity(value)}
            getAriaValueText={handleMaxQuantity}
            step={10}
            marks={[
              {
                value: 0,
                label: '0',
              },
              {
                value: 100,
                label: '100',
              },
            ]}
            // valueLabelDisplay="on"
            valueLabelDisplay="auto"
          />
        </Box>
      </Menu>
    </>
  );

  const batchSelect = (
    <>
      <SoftSelect placeholder="Select Batch" name="batch" />
    </>
  );

  const availableUnitSelect = (
    <>
      <SoftSelect placeholder="Select Available Units" name="availableUnits" />
    </>
  );

  const stockTurnoverSelect = (
    <>
      <SoftSelect placeholder="Select Stock Turnover" name="stockTurnover" />
    </>
  );

  const selectBoxArray = [inwardedDateSelect, quantitySelect, batchSelect, availableUnitSelect, stockTurnoverSelect];

  return (
    <>
      <Filter color="#344767" selectBoxArray={selectBoxArray} />
    </>
  );
}
