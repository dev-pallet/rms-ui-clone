import { Autocomplete, Grid, Card, InputLabel, TextField, createFilterOptions } from '@mui/material';
import React, { useEffect, useState } from 'react';
import SoftBox from '../../../../../../components/SoftBox';
import SoftInput from '../../../../../../components/SoftInput';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { hrmsGetDepartments } from '../../../../../../config/Services';

function AddDesignationDetails({ designationName, setDesignationName, departmentName, setDepartmentName }) {
  const inputLabelStyle = { fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' };
  const [editField, setEditField] = useState(null);
  const [departmentList, setDepartmentList] = useState([]);
  const [tempDesignationName, setTempDesignationName] = useState(designationName);

  const filter = createFilterOptions();

  useEffect(() => {
    setTempDesignationName(designationName);
  }, [designationName]);

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
    setTempDesignationName(e.target.value);
  };

  const handleSelectChange = (e, v) => {
    setDepartmentName({ label: v?.label, value: v?.value });
  };

  const designationDetails = [
    {
      id: 'designationName',
      label: 'Designation Name',
      onChange: handleInputChange,
      value: editField === 'designationName' ? tempDesignationName : designationName,
      type: 'input',
    },
    {
      label: 'Department Name',
      onChange: handleSelectChange,
      value: departmentName,
      type: 'select',
      options: departmentList,
    },
  ];

  const handleSaveEdit = () => {
    setEditField(null);
    setDesignationName(tempDesignationName);
  };
  const handleCancelEdit = () => {
    setEditField(null);

    setTempDesignationName(designationName);
  };
  const handleEdit = (id) => {
    setEditField(id);
  };

  return (
    <Card sx={{ padding: '15px', overflow: 'visible' }}>
      <SoftBox sx={{ flexGrow: 1, marginLeft: '20px' }}>
        <InputLabel style={{ fontWeight: 'bold' }}>Designation</InputLabel>
        <Grid container mt={1} spacing={2}>
          {designationDetails?.map((field, index) => (
            <Grid item xs={12} md={12} lg={12} key={index}>
              <SoftBox>
                <InputLabel sx={inputLabelStyle} required>
                  {field?.label}
                </InputLabel>
                {field?.type == 'input' && (
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
                        <CheckIcon sx={{ cursor: 'pointer', color: 'green' }} onClick={handleSaveEdit} />
                        <CloseIcon sx={{ cursor: 'pointer', color: 'red' }} onClick={handleCancelEdit} />
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
      </SoftBox>
    </Card>
  );
}

export default AddDesignationDetails;
