import { Checkbox, FormControlLabel, Menu, MenuItem } from '@mui/material';
import React, { useEffect, useState } from 'react';
import SoftButton from '../../../components/SoftButton';
import WidgetsIcon from '@mui/icons-material/Widgets';
const FilterDropdown = ({ options, setselectedWidgets }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState(
    JSON.parse(localStorage.getItem('selectedWidgets')) || ['Today\'s Sale', 'Monthly Sale', 'Yearly Sale','Today\'s Purchase', 'Monthly Purchase', 'Yearly Purchase' , 'GST' , 'Profits' , 'New Customers' , 'New Vendor' , 'Coupon Discount',
    ]
  );

  const handleClick = (event) => {
    // uncomment for dropdown filter
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOptionToggle = (option) => {
    const selectedIndex = selectedOptions.indexOf(option);
    const newSelected = [...selectedOptions];

    if (selectedIndex === -1) {
      newSelected.push(option);
    } else {
      newSelected.splice(selectedIndex, 1);
    }

    setSelectedOptions(newSelected);
    setselectedWidgets(newSelected);
    localStorage.setItem('selectedWidgets', JSON.stringify(newSelected));
  };

  const isOptionSelected = (option) => selectedOptions.indexOf(option) !== -1;

  useEffect(() => {
    // When the component mounts, update the selected options from local storage
    const storedSelectedOptions = JSON.parse(localStorage.getItem('selectedWidgets'));
    if (storedSelectedOptions) {
      setSelectedOptions(storedSelectedOptions);
    }
  }, []);

  return (
    <div>
      <SoftButton onClick={handleClick} style={{ cursor: 'pointer' }}>
        <WidgetsIcon onClick={handleClick} />
      </SoftButton>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {options.map((option) => (
          <MenuItem key={option}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isOptionSelected(option)}
                  onChange={() => handleOptionToggle(option)}
                />
              }
              label={option}
            />
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default FilterDropdown;
