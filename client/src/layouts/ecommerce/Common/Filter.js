import './Filter.css';
import {
  Badge,
  Box,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  ThemeProvider,
  Tooltip,
  Typography,
  createTheme,
} from '@mui/material';
import { buttonStyles } from './buttonColor';
import CancelIcon from '@mui/icons-material/Cancel';
import FilterListIcon from '@mui/icons-material/FilterList';
import React, { useState } from 'react';
import SoftButton from '../../../components/SoftButton';

export default function Filter({
  // to show selected filters count
  filtersApplied,
  // filters values to display at top as chips
  filterChipBoxes,
  // it is a collection of selectBoxes in form of array ex - selectBoxArray = [statusSelect,dateSelect]
  selectBoxArray,
  // function to apply filter
  handleApplyFilter,
  // function to clear all filters
  handleClearFilter,
  // bg
  color,
  //chipSelectBox
  // chipSelectBox,
}) {
  // overriding primary color of mui for filter box current selected filter
  const chipTextTheme = createTheme({
    palette: {
      primary: {
        main: '#0562FB',
        // light: will be calculated from palette.primary.main,
        // dark: will be calculated from palette.primary.main,
        // contrastText: will be calculated to contrast with palette.primary.main
      },
    },
  });

  // filter box
  const [anchorEl, setAnchorEl] = useState(null);
  const filterBoxOpen = Boolean(anchorEl);
  const handleClickFilter = (event) => {
    // setAllProductsFilter(dispatch,{})
    setAnchorEl(event.currentTarget);
  };
  const handleCloseFilter = () => {
    setAnchorEl(null);
  };
  // end of filter box

  return (
    <>
      {/* filter box  */}
      <Box sx={{ marginLeft: '20px' }}>
        <Tooltip title="Filters">
          <IconButton
            onClick={handleClickFilter}
            size="small"
            // sx={{ ml: 2 }}
            aria-controls={filterBoxOpen ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={filterBoxOpen ? 'true' : undefined}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '29px',
                cursor: 'pointer',
                height: '100%',
              }}
            >
              <Badge badgeContent={filtersApplied ? filtersApplied : 0} color="secondary" showZero>
                {/* filter icon  */}
                <FilterListIcon color={color ? color : 'white'} size={'29px'} />
              </Badge>
            </Box>
            {/* </Avatar> */}
          </IconButton>
        </Tooltip>

        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          className="filterBox"
          open={filterBoxOpen}
          onClose={handleCloseFilter}
          sx={{
            '& .MuiPaper-root': {
              // Custom styles here
              width: '100%',
              overflowY: 'unset',
              overflowX: 'unset'
            },
          }}
          // onClick={handleCloseFilter}
          // PaperProps={{
          //   elevation: 0,
          //   sx: {
          //     overflow: 'visible',
          //     // filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
          //     // mt: 1.5,
          //     '& .MuiAvatar-root': {
          //       width: 70,
          //       height: 32,
          //       ml: -0.5,
          //       mr: 1,
          //     },
          //     '&:before': {
          //       content: '""',
          //       display: 'block',
          //       position: 'absolute',
          //       top: 0,
          //       right: 135,
          //       width: 10,
          //       height: 10,
          //       // bgcolor: '#ffffff',
          //       transform: 'translateY(-50%) rotate(45deg)',
          //       zIndex: 0,
          //     },
          //   },
          // }}
          transformOrigin={{ horizontal: 'left', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
        >
          <Box style={{ float: 'right', cursor: 'pointer' }} onClick={handleCloseFilter}>
            <CancelIcon fontSize="medium" />
          </Box>
          <Typography fontWeight={'bold'} padding={'4.8px 16px'}>
            Filters
          </Typography>
          <Box fontWeight={'bold'} padding={'4.8px 13px'}>
            {/* show this chip whenever any filter is selected  */}
            {filtersApplied >= 1 && (
              <ThemeProvider theme={chipTextTheme}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }} className="filtersChipDisplayBox">
                  {/* pass the selected filters values to show in display at top as chips  */}
                  {filterChipBoxes && filterChipBoxes}
                </Box>
              </ThemeProvider>
            )}
          </Box>
          {!!filtersApplied && (
            <Divider
              variant="middle"
              sx={{ borderWidth: '1', margin: '1rem', backgroundColor: '#67748E', opacity: '0.3' }}
            />
          )}
          {/* for the chip selectbox */}
          {/* {chipSelectBox && (
            <Box sx={{ mb: '15px', paddingX: '11px' }}>
              <MenuItem className="filter-select-menu">{chipSelectBox}</MenuItem>
            </Box>
          )} */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: selectBoxArray && selectBoxArray.length > 2 ? 'repeat(3, 220px)' : 'repeat(2,200px)',
              // display:"flex",
              flexWrap: 'wrap',
              gap: '15px 10px',
              paddingX: '11px',
            }}
          >
            {/* place the select boxes here  */}
            {/* map the selectBoxesArray here  */}
            {selectBoxArray &&
              selectBoxArray.map((selectBox, index) => (
                <>
                  <MenuItem key={index} className="filter-select-menu">
                    {selectBox}
                  </MenuItem>
                </>
              ))}
          </Box>

          <br />
          <Box className="all-products-clear-filter" sx={{ padding: '4.8px 5px', float: 'right' }}>
            {handleClearFilter && (
              <SoftButton
                onClick={handleClearFilter}
                // className="vendor-second-btn"
                // sx={{ color: '#ef233c !important', border: '1px solid #ef233c !important' }}
                variant={buttonStyles.secondaryVariant}
                className="outlined-softbutton"
              >
                Clear
              </SoftButton>
            )}
            {handleApplyFilter && (
              <SoftButton
                onClick={() => {
                  if (handleApplyFilter) {
                    handleApplyFilter();
                    setTimeout(() => {
                      handleCloseFilter();
                    }, 500);
                  }
                }}
                // className="vendor-second-btn"
                sx={{ marginLeft: '10px', marginRight: '10px' }}
                variant={buttonStyles.primaryVariant}
                className="contained-softbutton"
              >
                Apply
              </SoftButton>
            )}
          </Box>
        </Menu>
      </Box>

      {/* end of filter box  */}
    </>
  );
}
