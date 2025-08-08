import { Autocomplete, Box, Card, createFilterOptions, Grid, InputLabel, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import SoftInput from '../../../../../../components/SoftInput';
import SoftBox from '../../../../../../components/SoftBox';
import { hrmsGetEmployees } from '../../../../../../config/Services';

function AddDepartmentDetails({ departmentName, setDepartmentName, departmentLead, setDepartmentLead }) {
  const filter = createFilterOptions();
  const [departmentList, setDepartmentList] = useState([]);

  const getDepartments=()=>{
    const orgId = localStorage.getItem('orgId');
    const locId = localStorage.getItem('locId');
    const payload = {
      pageNumber: 0,
      pageSize: 50,
      organizationId: orgId,
      locationId: locId,
    };
    hrmsGetEmployees(payload).then((res) => {
      if (res?.status === 200 && res?.data?.data?.es === 0) {
        const list = res?.data?.data?.data?.data?.map((item, index) => ({
          value: item?.employeeId,
          label: item?.name,
        }));
        setDepartmentList(list);
      }
    });
  }
  
  useEffect(() => {
    getDepartments()
    
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'departmentName':
        setDepartmentName(value);
        break;
      default:
        break;
    }
  };

  const handleSelectChange = (e, v) => {
    setDepartmentLead({label:v.label,value:v.value});
  };

  const departmentField = [
    {
      id: 'departmentName',
      label: 'Department Name',
      type: 'input',
      value: departmentName,
      onChange: handleInputChange,
    },
    {
      id: 'departmentLead',
      label: 'Department Lead',
      type: 'select',
      value: departmentLead,
      onChange: handleSelectChange,
      options: departmentList,
    },
  ];
  const inputLabelStyle = { fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' };

  return (
    <Card sx={{ padding: '15px', overflow: 'visible' }}>
      <Box>
        <Grid container spacing={2}>
          {departmentField?.map((field, index) => (
            <Grid item xs={12} md={12} lg={12}>
              <SoftBox sx={{ flexGrow: 1, marginLeft: '20px', marginTop: '10px' }}>
                <InputLabel sx={inputLabelStyle} required={
                    field?.label !== 'Department Lead'}>{field?.label}  
                  </InputLabel>
                {field?.type == 'input' && (
                  <SoftInput size="medium" name={field?.id} onChange={field?.onChange} value={field?.value}></SoftInput>
                )}
                {field?.type == 'select' && (
                  <Autocomplete
                    options={field?.options}
                    value={field?.value}
                    placeholder="Select"
                    getOptionLabel={(option) => option?.label || ''}
                    renderInput={(params) => (
                      <TextField {...params} placeholder="Select" variant="outlined" fullWidth />
                    )}
                    isOptionEqualToValue={(option, value) => option?.value === value?.value}
                    onChange={field.onChange}
                    filterOptions={(options, params) => {
                      const filtered = filter(options, params);
                      const { inputValue } = params;
                      if (inputValue === '') {
                        return options;
                      }
                      return filtered;
                    }}
                  />
                )}
              </SoftBox>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Card>
  );
}

export default AddDepartmentDetails;
