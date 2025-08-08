import './carasoul.css';
import '@splidejs/react-splide/css';
import { IconButton, Menu, MenuItem, Typography } from '@mui/material';
import { Splide } from '@splidejs/react-splide';
import React from 'react';
import SoftBox from '../../../../../components/SoftBox';
// import FilterAltIcon from '@mui/icons-material/FilterAlt';
import CloseIcon from '@mui/icons-material/Close';
import SortIcon from '@mui/icons-material/Sort';

const SplideCommon = ({ children, title, single, showFilter, isPopularProduct, checkboxArray, tables }) => {
  //opening menu for filters
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const prevOptions = {
    arrows: false,
    drag: true,
    pagination: false,
    perPage: isPopularProduct ? 2 : 1,
    gap: '10px',
    // type: 'loop',
    padding: isPopularProduct ? '1rem' : { right: !single ? '3rem' : '10px', left: '10px' },
    focus: 'center',
  };

  const tableOptions = {
    arrows: true,
    drag: true,
    pagination: false,
    perPage: isPopularProduct ? 2 : 1,
    gap: '10px',
    type: 'loop',
    padding: '1rem',
    focus: 'center',
  };
  return (
    <>
      <SoftBox className="splide-slider-main-div">
        {/* <Typography fontSize="18px" fontWeight={600} sx={{ padding: '5px 0 5px 15px' }}>
          {title}
        </Typography> */}
        <SoftBox className="slider-title-div">
          <Typography fontSize="18px" fontWeight={600}>
            {title}
          </Typography>
          <IconButton className="slider-icon-div" onClick={handleClick} sx={{ display: !showFilter && 'none' }}>
            {anchorEl !== null ? <CloseIcon /> : <SortIcon sx={{ transform: 'scaleX(-1)' }} />}
          </IconButton>
        </SoftBox>
        <Splide className="splide-main-component" options={tables ? tableOptions : prevOptions}>
          {children}
        </Splide>
      </SoftBox>
      {checkboxArray && (
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          {checkboxArray.map((checkbox) => (
            <MenuItem>{checkbox}</MenuItem>
          ))}
        </Menu>
      )}
    </>
  );
};

export default SplideCommon;
