import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { Box, Chip, Typography } from '@mui/material';
import SoftSelect from '../../../../components/SoftSelect';

export const ChipBoxHeading = ({ heading }) => (
  <>
    <Typography className="chipDisplayBoxHeading">{heading}</Typography>
  </>
);
export const FilterChipDisplayBox = ({ heading, label, objKey, removeSelectedFilter }) => {
  return (
    <Box className="singleChipDisplayBox">
      <ChipBoxHeading heading={heading} />
      <Box className="insideSingleChipDisplayBox">
        <Chip
          label={label}
          onDelete={() => removeSelectedFilter(objKey)}
          deleteIcon={<CancelOutlinedIcon />}
          color="primary"
          variant="outlined"
        />
      </Box>
    </Box>
  );
};

const TicketFilters = ({ isLoading, projectData, featureData, userList, onFilterChange, filters, handleSearch }) => {
  const filterOptions = [
    {
      name: 'product',
      placeholder: 'Product',
      options: projectData,
      value: filters?.product,
      isMulti: false,
    },
    {
      name: 'feature',
      placeholder: 'Feature',
      options: featureData,
      value: filters?.feature,
      isMulti: false,
    },
    {
      name: 'createdByName',
      placeholder: 'User List',
      options: userList,
      value: filters?.createdByName,
      isMulti: true,
    },

    {
      name: 'status',
      placeholder: 'Status',
      options: [
        { label: 'OPEN', value: 'OPEN' },
        { label: 'IN_PROGRESS', value: 'IN_PROGRESS' },
        { label: 'CLOSED', value: 'CLOSED' },
      ],
      value: filters?.status,
      isMulti: false,
    },
  ];
  //style={{ display: 'flex', flexDirection: 'row', gap: '15px' }}
  return (
    <div>
      {filterOptions?.map((filter) => (
        <SoftSelect
          isMulti={filter?.isMulti}
          key={filter?.name}
          name={filter?.name}
          value={filter?.value}
          placeholder={filter?.placeholder}
          isLoading={isLoading}
          options={filter?.options}
          menuPortalTarget={document.body}
          classNamePrefix="soft-select"
          onChange={(e) => onFilterChange(filter.name, e)}
          // onInputChange={(e) => handleSearch(e)}
          style={{ width: '150px !important' }}
        />
      ))}
    </div>
  );
};

export default TicketFilters;
