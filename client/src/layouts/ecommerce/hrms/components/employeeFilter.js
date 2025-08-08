import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { Box, Chip } from '@mui/material';
import Filter from '../../Common/Filter';
import SoftBox from '../../../../components/SoftBox';
import SoftSelect from '../../../../components/SoftSelect';
import { ChipBoxHeading, filterStateAndFiltersAppliedHandleFn } from '../../Common/Filter Components/filterComponents';
import { useEffect, useState } from 'react';
import { hrmsGetDepartments, hrmsGetDesignations } from '../../../../config/Services';

export default function EmployeeFilter({ setDepartmentId, setDesignationId, getEmployees }) {
  const [department, setDepartment] = useState({});
  const [designation, setDesignation] = useState({});
  const [onClear, setOnClear] = useState(false);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [designationOptions, setDesignationOptions] = useState([]);
  const [filterState, setFilterState] = useState({
    department: 0,
    designation: 0,
  });

  useEffect(() => {
    const locationId = localStorage.getItem('locId');
    const organizationId = localStorage.getItem('orgId');
    const payload = {
      pageNumber: 0,
      pageSize: 50,
      locationId: locationId,
      organizationId: organizationId,
    };
    hrmsGetDepartments(payload).then((res) => {
      if (res?.status === 200 && res?.data?.data?.es == 0) {
        const depOptions = res?.data?.data?.data?.data?.map((item, index) => ({
          value: item?.departmentId,
          label: item?.departmentName || 'N/A',
        }));
        setDepartmentOptions(depOptions);
      } else {
        return;
      }
    });
    hrmsGetDesignations(payload).then((res) => {
      if (res?.status === 200 && res?.data?.data?.es == 0) {
        const desOptions = res?.data?.data?.data?.data?.map((item, index) => ({
          value: item?.designationId,
          label: item?.designationName || 'N/A',
        }));
        setDesignationOptions(desOptions);
      } else {
        return;
      }
    });
  }, []);

  const departmentSelect = (
    <>
      <SoftBox>
        <SoftSelect
          placeholder="Select Department"
          {...(department?.label
            ? {
                value: {
                  value: department?.value,
                  label: department?.label,
                },
              }
            : {
                value: {
                  value: '',
                  label: 'Select Department',
                },
              })}
          options={departmentOptions}
          onChange={(option, e) => handleDepartmentType(option)}
        />
      </SoftBox>
    </>
  );

  const designationSelect = (
    <>
      <SoftBox>
        <SoftSelect
          placeholder="Select Designation"
          {...(designation.label
            ? {
                value: {
                  value: designation?.value,
                  label: designation?.label,
                },
              }
            : {
                value: {
                  value: '',
                  label: 'Select Designation',
                },
              })}
          options={designationOptions}
          onChange={(option, e) => handleDesignationType(option)}
        />
      </SoftBox>
    </>
  );

  const removeSelectedFilter = (filterType) => {
    switch (filterType) {
      case 'department':
        setDepartment({});
        setDepartmentId('');
        break;
      case 'designation':
        setDesignation({});
        setDesignationId('');
        break;
    }
    setFilterState({ ...filterState, [filterType]: 0 });
  };

  const handleFilterStateAndFiltersApplied = (filterType) => {
    filterStateAndFiltersAppliedHandleFn(filterType, filterState, setFilterState);
  };

  const handleDepartmentType = (option) => {
    setDepartment(option);
    setDepartmentId(option?.value);
    if (option !== '') {
      handleFilterStateAndFiltersApplied('department');
    }
  };

  const handleDesignationType = (option) => {
    setDesignation(option);
    setDesignationId(option?.value);
    if (option !== '') {
      handleFilterStateAndFiltersApplied('designation');
    }
  };

  // chipBoxes for filter
  const filterChipBoxes = (
    <>
      {filterState?.department === 1 && (
        <Box className="singleChipDisplayBox">
          <ChipBoxHeading heading={'Department'} />
          <Box className="insideSingleChipDisplayBox">
            <Chip
              label={department?.label}
              onDelete={() => removeSelectedFilter('department')}
              deleteIcon={<CancelOutlinedIcon />}
              color="primary"
              variant="outlined"
            />
          </Box>
        </Box>
      )}

      {filterState?.designation === 1 && (
        <Box className="singleChipDisplayBox">
          <ChipBoxHeading heading={'Designation'} />
          <Box className="insideSingleChipDisplayBox">
            <Chip
              label={designation?.label}
              onDelete={() => removeSelectedFilter('designation')}
              deleteIcon={<CancelOutlinedIcon />}
              color="primary"
              variant="outlined"
            />
          </Box>
        </Box>
      )}
    </>
  );

  // fn to apply sales order Filter
  const applyFilter = () => {
    getEmployees();
  };

  // fn to  clear the  filter
  const handleClearEmployeeFilter = () => {
    setDepartment({});
    setDesignation({});
    setDepartmentId('');
    setDesignationId('');

    // reset filterState
    setFilterState({
      department: 0,
      designation: 0,
    });

    // set on clear to true
    setOnClear(true);
  };

  // select boxes array to pass as prop to Filter component
  const selectBoxArray = [departmentSelect, designationSelect];

  // applied filters count
  const filterLength = Object?.values(filterState)?.filter((value) => value === 1)?.length;

  return (
    <Filter
      filtersApplied={filterLength}
      filterChipBoxes={filterChipBoxes}
      selectBoxArray={selectBoxArray}
      handleApplyFilter={applyFilter}
      handleClearFilter={handleClearEmployeeFilter}
    />
  );
}
