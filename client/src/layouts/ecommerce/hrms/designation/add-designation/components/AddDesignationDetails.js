import { Autocomplete, Grid, Card, InputLabel, TextField, createFilterOptions } from '@mui/material';
import { useEffect, useState } from 'react';
import SoftBox from '../../../../../../components/SoftBox';
import SoftInput from '../../../../../../components/SoftInput';
import { hrmsGetDepartments } from '../../../../../../config/Services';

function AddDesignationDetails({ designationName, setDesignationName, departmentDetails, setDepartmentDetails }) {
  const inputLabelStyle = { fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' };
  const [departmentList, setDepartmentList] = useState([]);
  const filter = createFilterOptions();

  const getDepartments = () => {
    const orgId = localStorage.getItem('orgId');
    const locId = localStorage.getItem('locId');
    const payload = {
      pageNumber: 0,
      pageSize: 50,
      organizationId: orgId,
      locationId: locId,
    };
    hrmsGetDepartments(payload).then((res) => {
      if (res?.status === 200 && res?.data?.data?.es === 0) {
        const list = res?.data?.data?.data?.data?.map((item, index) => ({
          value: item?.departmentId,
          label: item?.departmentName,
        }));
        setDepartmentList(list);
      }
    });
  };

  useEffect(() => {
    getDepartments();
  }, []);

  const handleInputChange = (e) => {
    setDesignationName(e.target.value);
  };

  const handleSelectChange = (e, v) => {
    setDepartmentDetails({ value: v?.value, label: v?.label });
  };

  const designationDetails = [
    {
      id: 'designationName',
      label: 'Designation Name',
      onChange: handleInputChange,
      value: designationName,
      type: 'input',
    },
    {
      id: 'departmentName',
      label: 'Department Name',
      onChange: handleSelectChange,
      value: departmentDetails,
      type: 'select',
      options: departmentList,
    },
  ];

  return (
    <Card sx={{ padding: '15px', overflow: 'visible' }}>
      <SoftBox sx={{ flexGrow: 1, marginLeft: '20px' }}>
        <InputLabel style={{ fontWeight: 'bold' }}>Designation</InputLabel>
        <Grid container mt={1} spacing={2}>
          {designationDetails?.map((field, index) => (
            <Grid item xs={12} md={12} lg={12} key={index}>
              <SoftBox>
                <InputLabel sx={inputLabelStyle} required={field.id == 'designationName'}>
                  {field?.label}
                </InputLabel>
                {field?.type == 'input' && (
                  <SoftInput
                    value={field?.value}
                    onChange={field?.onChange}
                    className="select-box-category"
                    size="medium"
                  />
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
                    onChange={field.onChange}
                    isOptionEqualToValue={(option, value) => option?.value === value?.value}
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
      </SoftBox>
    </Card>
  );
}

export default AddDesignationDetails;
