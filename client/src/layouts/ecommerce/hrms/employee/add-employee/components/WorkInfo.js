import { Autocomplete, Card, CircularProgress, createFilterOptions, Grid, InputLabel, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import SoftBox from '../../../../../../components/SoftBox';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { hrmsGetDepartments, hrmsGetDesignations, hrmsGetEmployees } from '../../../../../../config/Services';
import { useSnackbar } from '../../../../../../hooks/SnackbarProvider';

function WorkInfo({
  departmentId,
  setDepartmentId,
  designationId,
  setDesignationId,
  reportingAuthority,
  setReportingAuthority,
  employmentType,
  setEmploymentType,
  employmentStatus,
  setEmploymentStatus,
  sourceOfHire,
  setSourceOfHire,
  dateOfJoining,
  setDateOfJoining,
}) {
  const filter = createFilterOptions();

  const [department, setDepartment] = useState('');
  const [designation, setDesignation] = useState('');
  const [departmentList, setDepartmentList] = useState([]);
  const [designationList, setDesignationList] = useState([]);
  const [reportingAuthorityList, setReportingAuthorityList] = useState([]);
  const showSnackbar = useSnackbar();

  const inputLabelStyle = { fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' };

  useEffect(() => {
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

    hrmsGetDesignations(payload).then((res) => {
      if (res?.status === 200 && res?.data?.data?.es === 0) {
        const list = res?.data?.data?.data?.data?.map((item, index) => ({
          value: item?.designationId,
          label: item?.designationName,
        }));
        setDesignationList(list);
      }
    });
    hrmsGetEmployees(payload).then((res) => {
      if (res?.status === 200 && res?.data?.data?.es == 0) {
        const reportingAuthorityList = res?.data?.data?.data?.data?.map((item, index) => ({
          value: item?.employeeId,
          label: item?.name,
        }));
        setReportingAuthorityList(reportingAuthorityList);
      } else {
        showSnackbar(`${res?.data?.data?.message}`, 'warning');
      }
    });
  }, []);

  const handleDepartmentChange = (e, v) => {
    setDepartment(v?.label);
    setDepartmentId(v?.value);
  };

  const handleDesignationChange = (e, v) => {
    setDesignation(v?.label);
    setDesignationId(v?.value);
  };

  const handleReportingAuthority = (e, v) => {
    setReportingAuthority({
      value: v?.value,
      label: v?.label,
    });
  };

  const handleDateChange = (date) => {
    const formattedDate = date ? dayjs(date).format('YYYY-MM-DD') : '';
    setDateOfJoining(formattedDate);
  };

  const workInfo = [
    {
      label: 'Department',
      type: 'select',
      onChange: handleDepartmentChange,
      value: department,
      options: departmentList,
    },
    {
      label: 'Designation',
      type: 'select',
      onChange: handleDesignationChange,
      value: designation,
      options: designationList,
    },
    {
      label: 'Reporting Authority',
      value: reportingAuthority,
      options: reportingAuthorityList,
      onChange: handleReportingAuthority,
      type: 'select',
    },
    {
      label: 'Employment Type',
      type: 'select',
      options: [
        { value: 'FULL_TIME', label: 'Full Time' },
        { value: 'PROBATION', label: 'Probation' },
        { value: 'CONTRACTED', label: 'Contracted' },
        { value: 'INTERNS', label: 'Intern' },
      ],
      onChange: (e, v) => setEmploymentType({ value: v?.value, label: v?.label }),
      value: employmentType?.label,
    },
    {
      label: 'Employment Status',
      type: 'select',
      options: [
        { value: 'ACTIVE', label: 'Active' },
        { value: 'INACTIVE', label: 'Inactive' },
        { value: 'ON_LEAVE', label: 'On Leave' },
        { value: 'TERMINATED', label: 'Terminated' },
      ],
      onChange: (e, v) => setEmploymentStatus({ value: v?.value, label: v?.label }),
      value: employmentStatus?.label,
    },
    {
      label: 'Source of Hire',
      type: 'select',
      options: [
        { value: 'direct', label: 'Direct' },
        { value: 'web', label: 'Web' },
        { value: 'referral', label: 'Referral' },
        { value: 'newspaper', label: 'Newspaper' },
        { value: 'advertisment', label: 'Advertisment' },
      ],
      onChange: (e, v) => setSourceOfHire(v?.label),
      value: sourceOfHire,
    },
    { label: 'Date of Joining', type: 'date', onChange: handleDateChange, value: dateOfJoining },
  ];

  return (
    <Card sx={{ padding: '15px', overflow: 'visible' }}>
      <SoftBox sx={{ flexGrow: 1, marginLeft: '20px' }}>
        <InputLabel style={{ fontWeight: 'bold' }}>Work Information</InputLabel>

        <Grid mt={1} container spacing={2}>
          {workInfo?.map((field, index) => (
            <Grid item xs={12} md={12} lg={12} key={index}>
              <SoftBox>
                <InputLabel sx={inputLabelStyle}>{field?.label}</InputLabel>

                {field?.type == 'date' && (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      format="YYYY/MM/DD"
                      onChange={field?.onChange}
                      value={field?.value}
                      className="custom-date-picker-md"
                    />
                  </LocalizationProvider>
                )}

                {field?.type == 'select' && (
                  <Autocomplete
                    options={field?.options}
                    placeholder="Select"
                    getOptionLabel={(option) => option?.label || ''}
                    renderInput={(params) => (
                      <TextField {...params} placeholder="Select" variant="outlined" fullWidth />
                    )}
                    isOptionEqualToValue={(option, value) => {
                      if (option?.label === value?.label) {
                        return true;
                      }
                    }}
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

export default WorkInfo;
