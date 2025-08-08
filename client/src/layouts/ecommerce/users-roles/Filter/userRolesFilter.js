import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { Autocomplete, Box, Checkbox, Chip, List, ListItem, ListItemText, TextField } from '@mui/material';
import { ChipBoxHeading, filterStateAndFiltersAppliedHandleFn } from '../../Common/Filter Components/filterComponents';
import { getAllRoles } from '../../../../config/Services';
import { textFormatter } from '../../Common/CommonFunction';
import { useEffect, useState } from 'react';
import { useSnackbar } from '../../../../hooks/SnackbarProvider';
import Filter from '../../Common/Filter';
import SoftBox from '../../../../components/SoftBox';

export default function UserRolesFilter({ selectedUserRoles, setSelectedUserRoles, setIsApplied, setOnClear }) {
  //   const [userRoles, setUserRoles] = useState([]);
  const [allRoles, setAllRoles] = useState([]);
  const [roleList, setRoleList] = useState([]);

  const showSnackbar = useSnackbar();

  // to manage filters applied state for sales order filters
  const [filterState, setFilterState] = useState({
    roles: 0,
  });

  // fn to update filterstate and filtersapplied, just pass the filterType as argument
  const handleFilterStateAndFiltersApplied = (filterType) => {
    filterStateAndFiltersAppliedHandleFn(filterType, filterState, setFilterState);
  };

  const removeFromSelectedUserRoles = (label) => {
    const updatedSelectedUserRoles = selectedUserRoles.filter((el) => el.label !== label);
    setSelectedUserRoles(updatedSelectedUserRoles);
  };

  // chipBoxes for filter
  const filterChipBoxes = (
    <>
      {/* userRoles */}
      {filterState.roles === 1 && (
        <Box className="singleChipDisplayBox">
          <ChipBoxHeading heading={'User Roles'} />
          <Box className="insideSingleChipDisplayBox">
            {selectedUserRoles.map((item, index) => (
              <Chip
                // label={selectedUserRoles.map((el,index)=>{
                //   return textFormatter(el.label) + `${index<selectedUserRoles.length && ", "}`
                // })}
                label={textFormatter(item.label)}
                onDelete={() => {
                  if (selectedUserRoles.length === 1) {
                    removeSelectedFilter('roles');
                  } else {
                    removeFromSelectedUserRoles(item.label);
                  }
                }}
                deleteIcon={<CancelOutlinedIcon />}
                color="primary"
                variant="outlined"
              />
            ))}
          </Box>
        </Box>
      )}
    </>
  );

  // to show the checkbox selected or not, in the select option box
  const check = (label) => {
    let exist = false;
    for (let i = 0; i < selectedUserRoles.length; i++) {
      if (selectedUserRoles[i].label == label) {
        exist = true;
      }
    }
    return exist;
  };

  // select boxes
  // user roles selectbox
  const userRoleSelect = (
    <>
      <SoftBox>
        {/* <SoftSelect
          placeholder="Select User Roles"
          //   {...(userRoles
          //     ? {
          //         value: {
          //           value: status.value,
          //           label: status.label,
          //         },
          //       }
          //     : {
          //         value: {
          //           value: '',
          //           label: 'Select User Role',
          //         },
          //       })}
          options={roleList}
          onChange={(option, e) => handleUserRoles(option)}
        /> */}
        <Autocomplete
          // id="size-small-standard"
          id="multiple-limit-tags"
          disableCloseOnSelect
          // size="small"
          value={selectedUserRoles}
          options={roleList}
          getOptionLabel={(option) => option.label || ''}
          onChange={(e, v) => {
            handleUserRoles(v);
          }}
          multiple
          limitTags={0}
          ListboxComponent={({ children, ...props }) => <List {...props}>{children}</List>}
          renderOption={(props, option, { selected }) => {
            return (
              <ListItem {...props}>
                <Checkbox checked={check(option.label)} />
                <ListItemText
                  primary={textFormatter(option.label)}
                  primaryTypographyProps={{ fontSize: '14px !important' }}
                />
              </ListItem>
            );
          }}
          renderTags={() => null} // hides the selected option
          renderInput={(params) => (
            <TextField
              className="limit-tag"
              {...params}
              // placeholder="Select Categories"
              placeholder={
                selectedUserRoles === undefined || selectedUserRoles.length === 0
                  ? 'Select User Roles'
                  : (selectedUserRoles.length === 1 && `${selectedUserRoles.length} role selected`) ||
                    `${selectedUserRoles.length} roles selected`
              }
              variant="outlined"
            />
          )}
          clearIcon={null} // Hide the clear icon
        />
      </SoftBox>
    </>
  );

  // handle status fn
  const handleUserRoles = (option) => {
    setSelectedUserRoles(option);

    if (option !== '') {
      handleFilterStateAndFiltersApplied('roles');
    }
  };

  // fn to remove selected filter
  const removeSelectedFilter = (filterType) => {
    switch (filterType) {
      case 'roles':
        setSelectedUserRoles([]);
        // if (filterObject.roles) {
        //   delete filterObject.status;
        // }
        break;
    }
    setFilterState({ ...filterState, [filterType]: 0 });
  };

  // fn to apply sales order Filter
  const applyFilter = () => {
    setIsApplied(true);
    setSelectedUserRoles(selectedUserRoles);
  };

  // fn to  clear the  filter
  const handleClearUserRolesFilter = () => {
    setSelectedUserRoles([]);

    // reset filterState
    setFilterState({
      roles: 0,
    });

    // set on clear to true
    setOnClear(true);
    setIsApplied(false);
  };

  // select boxes array to pass as prop to Filter component
  const selectBoxArray = [userRoleSelect];

  const contextType = localStorage.getItem('contextType');
  useEffect(() => {
    getAllRoles(contextType)
      .then((response) => {
        const modifiedArray = response?.data?.data?.map((obj) => {
          let modifiedName = '';
          if (obj?.name === 'RETAIL_USER' || obj?.name === 'WMS_USER' || obj?.name === 'VMS_USER') {
            modifiedName = obj.name.replace(/_/g, ' ');
          } else {
            modifiedName = obj.name.replace(/_/g, ' ').replace(contextType, '');
          }
          return { id: obj.id, name: modifiedName.trim() };
        });
        setAllRoles(modifiedArray);
      })
      .catch((error) => {
        showSnackbar(error?.response?.data?.message || 'Some error occured', 'error');
      });
  }, []);

  useEffect(() => {
    if (allRoles.length != 0) {
      const roleArr = [];
      allRoles.map((e) => {
        roleArr.push({ value: e.id, label: e.name });
      });
      setRoleList(roleArr);
    }
  }, [allRoles]);

  // applied filters count
  const filterLength = Object.values(filterState).filter((value) => value === 1).length;

  return (
    <Filter
      color="#000000"
      filtersApplied={filterLength}
      filterChipBoxes={filterChipBoxes}
      selectBoxArray={selectBoxArray}
      handleApplyFilter={applyFilter}
      handleClearFilter={handleClearUserRolesFilter}
    />
  );
}
