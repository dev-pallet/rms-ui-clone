import './filterComponent.css';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useEffect, useState } from 'react';
import { Badge, Box, Chip, Divider, Menu } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import SoftSelect from '../../../../../../components/SoftSelect';
import SoftButton from '../../../../../../components/SoftButton';
import SoftTypography from '../../../../../../components/SoftTypography';
import { ChipBoxHeading } from '../../../../Common/Filter Components/filterComponents';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

const FilterGRNComponent = ({ filter, values, onChange, applyFilters, handleRemoveFilter }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    handleRemoveFilter();
    setAnchorEl(null);
  };

  useEffect(() => {}, [values]);
  // Function to remove individual filters
  const handleRemoveIndividualFilter = (key) => {
    handleRemoveFilter(key);
  };

  const handleFilterApplied = () => {
    applyFilters();
    setTimeout(() => {
      setAnchorEl(null);
    }, 500);
  };

  //rendering input based on the type like normal text, select, multi-select or date picker
  const renderInput = (filter) => {
    switch (filter?.type) {
      case 'select':
        return (
          <>
            <SoftTypography fontSize="13px" fontWeight="bold">
              {filter?.label}
            </SoftTypography>
            <SoftSelect
              value={values[filter?.key] || null}
              placeholder={filter?.placeholder}
              options={filter?.options}
              menuPortalTarget={document.body}
              classNamePrefix="soft-select"
              onChange={(e) => onChange(filter?.key, e, filter?.label, 'select')}
            />
          </>
        );
      case 'multi-select':
        return (
          <SoftSelect
            value={values[filter?.key]}
            placeholder={filter?.placeholder}
            options={filter?.options}
            isMulti
            menuPortalTarget={document.body}
            classNamePrefix="soft-select"
            onChange={(e) => onChange(filter?.key, e, filter?.label, 'multi-select')}
          />
        );
      case 'date':
        return (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              defaultValue={values[filter?.key] && dayjs(values[filter?.key])}
              slotProps={{
                textField: {
                  //to render placeholder instead of label
                  placeholder: filter?.placeholder,
                },
              }}
              onChange={(e) => onChange(filter?.key, e, 'date')}
            />
          </LocalizationProvider>
        );
    }
  };

  //length of the filter to show the number of filters applied by converting the object into array of its key
  const filterLength = Object.keys(values)?.length;

  return (
    <div>
      <div className="customer-filter-main-div" onClick={handleClick}>
        <Badge badgeContent={filterLength} color="secondary">
          <FilterListIcon fontSize="large" />
        </Badge>
      </div>
      <Menu id="basic-menu" anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
        <div className="filter-menu-main-div">
          <div className="title-toolbar">
            <span className="text-large filter-heading">Filter</span>
            <div className="close-filter-modal-main-div" onClick={() => setAnchorEl(null)}>
              <CloseIcon fontSize="small" />
            </div>
          </div>
          <div className="selected-filters">
            <Box fontWeight={'bold'} padding={'4.8px 13px'}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }} className="filtersChipDisplayBox">
                {Object.keys(values).map((key) => {
                  return (
                    <Box className="singleChipDisplayBox">
                      <ChipBoxHeading heading={`${values[key]?.itemLabel}`} />
                      <Box className="insideSingleChipDisplayBox">
                        <Chip
                          key={key}
                          label={`${values[key]?.label}`}
                          onDelete={() => handleRemoveIndividualFilter(key)}
                          deleteIcon={<HighlightOffIcon />}
                          color="primary"
                          variant="outlined"
                        />
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </div>
          {filterLength !== 0 && (
            <Divider
              variant="middle"
              sx={{ borderWidth: '1', margin: '1rem', backgroundColor: '#67748E', opacity: '0.3' }}
            />
          )}
          <div className="custom-filter-main-div">
            {filter?.map((item, index) => (
              <div key={index} className="filter-custom-input">
                {renderInput(item)}
              </div>
            ))}
          </div>
          <div className="filter-actions-main-div">
            <SoftButton color="info" variant="outlined" onClick={handleClose}>
              Cancel
            </SoftButton>
            <SoftButton color="info" variant="contained" onClick={handleFilterApplied}>
              Apply
            </SoftButton>
          </div>
        </div>
      </Menu>
    </div>
  );
};

export default FilterGRNComponent;
