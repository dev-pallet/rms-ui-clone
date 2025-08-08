import { Autocomplete, Box, Card, createFilterOptions, Grid, InputLabel, TextField } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import SoftInput from '../../../../../../components/SoftInput';
import SoftBox from '../../../../../../components/SoftBox';
import dayjs from 'dayjs';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { hrmsGetEmployees } from '../../../../../../config/Services';
function AddDepartmentDetails({ departmentName, setDepartmentName, departmentLead, setDepartmentLead }) {
  const filter = createFilterOptions();
  const [editField, setEditField] = useState(null);
  const [departmentList, setDepartmentList] = useState([]);
  const [tempDepartmentName, setTempDepartmentName] = useState(departmentName);

  useEffect(() => {
    setTempDepartmentName(departmentName);
  }, [departmentName]);

  const getEmployees = () => {
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
  };

  useEffect(() => {
    getEmployees();
  }, []);

  const handleInputChange = (e) => {
    setTempDepartmentName(e.target.value);
  };

  const handleSelectChange = (e, v) => {
    setDepartmentLead({ value: v?.value, label: v?.label });
  };

  const departmentField = [
    {
      id: 'departmentName',
      label: 'Department Name',
      type: 'input',
      onChange: handleInputChange,
      value: editField === 'departmentName' ? tempDepartmentName : departmentName,
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

  const handleSaveEdit = (e, id) => {
    setEditField(null);
    switch (id) {
      case 'departmentName':
        setDepartmentName(tempDepartmentName);
        break;
      default:
        break;
    }
  };

  const handleCancelEdit = (e, id) => {
    setEditField(null);
    switch (id) {
      case 'departmentName':
        setTempDepartmentName(departmentName);
        break;
      default:
        break;
    }
  };

  const handleEdit = (id) => {
    setEditField(id);
  };

  return (
    <Card sx={{ padding: '15px', overflow: 'visible' }}>
      <Box>
        <Grid container spacing={2}>
          {departmentField?.map((field, index) => (
            <Grid key={index} item xs={12} md={12} lg={12}>
              <SoftBox sx={{ flexGrow: 1, marginLeft: '20px', marginTop: '10px' }}>
                <InputLabel sx={inputLabelStyle} required={field?.id == 'departmentName' ? true : false}>
                  {field?.label}
                </InputLabel>
                {field?.type === 'input' && (
                  <SoftBox sx={{ position: 'relative' }}>
                    <SoftInput
                      name={field?.id}
                      onChange={field?.onChange}
                      value={field?.value}
                      className="select-box-category"
                      size="medium"
                      disabled={field?.id != editField}
                    />
                    {editField == field?.id ? (
                      <SoftBox
                        sx={{
                          position: 'absolute',
                          right: '8px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          display: 'flex',
                          gap: '4px',
                          alignItems: 'center',
                        }}
                      >
                        <CheckIcon
                          sx={{ cursor: 'pointer', color: 'green' }}
                          onClick={(e) => handleSaveEdit(e, field?.id)}
                        />
                        <CloseIcon
                          sx={{ cursor: 'pointer', color: 'red' }}
                          onClick={(e) => handleCancelEdit(e, field?.id)}
                        />
                      </SoftBox>
                    ) : (
                      <SoftBox
                        sx={{
                          position: 'absolute',
                          right: '8px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <ModeEditIcon
                          sx={{ cursor: 'pointer', color: '#344767' }}
                          onClick={() => handleEdit(field?.id)}
                        />
                      </SoftBox>
                    )}
                  </SoftBox>
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
                    onChange={field?.onChange}
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
