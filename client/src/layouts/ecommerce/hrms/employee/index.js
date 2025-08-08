import React, { useCallback, useEffect, useState } from 'react';
import sideNavUpdate from '../components/sidenavupdate';
import { Box, Button, Grid, Menu, MenuItem } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import SoftBox from '../../../../components/SoftBox';
import SoftInput from '../../../../components/SoftInput';
import SoftButton from '../../../../components/SoftButton';
import Spinner from '../../../../components/Spinner';
import { hrmsDeleteEmployees, hrmsGetEmployees } from '../../../../config/Services';
import { useSnackbar } from '../../../../hooks/SnackbarProvider';
import { debounce } from 'lodash';
import EmployeeFilter from '../components/employeeFilter';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from 'sweetalert2';

const HrmsEmployee = () => {
  sideNavUpdate();
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();
  const [searchVal, setSearchVal] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [pageState, setPageState] = useState({
    loader: false,
    dataRows: [],
    page: 0,
    pageSize: 10,
    totalResults: 0,
  });
  const [designationId, setDesignationId] = useState('');
  const [departmentId, setDepartmentId] = useState('');

  const [anchorMarkupEl, setAnchorMarkupEl] = useState(null);
  const markUpOpen = Boolean(anchorMarkupEl);
  const [selectedEmployeeRow, setSelectedEmployeeRow] = useState();

  const checkEmploymentType = (type) => {
    switch (type) {
      case 'FULL_TIME':
        return 'Full time';
      case 'PROBATION':
        return 'Probation';
      case 'CONTRACTED':
        return 'Contracted';
      case 'INTERNS':
        return 'Intern';
      default:
        return 'N/A';
    }
  };

  const getEmployees = () => {
    const locationId = localStorage.getItem('locId');
    const organizationId = localStorage.getItem('orgId');
    setPageState((prevState) => ({
      ...prevState,
      loader: true,
    }));

    const payload = {
      pageSize: 10,
      pageNumber: pageState.page,
      organizationId,
      locationId,
      sortByCreatedAt: 'ASCENDING',
      searchBox: searchVal,
    };

    if (departmentId) {
      payload.departmentId = [departmentId];
    }
    if (designationId) {
      payload.designationId = [designationId];
    }

    hrmsGetEmployees(payload)
      .then((res) => {
        setPageState((prevState) => ({
          ...prevState,
          totalResults: res?.data?.data?.data?.totalResults ?? 0,
        }));
        if (res?.status === 200 && res?.data?.data?.es === 0) {
          const rows = res?.data?.data?.data?.data?.map((item, index) => ({
            name: item?.name || 'N/A',
            id: item?.employeeId || 'N/A',
            designation: item?.designationName || 'N/A',
            department: item?.departmentName || 'N/A',
            employmentType: checkEmploymentType(item?.employmentType),
            joiningdate: item?.joiningDate || 'N/A',
            reportingManager: item?.reportingManagerName || 'N/A',
          }));

          setPageState((prevState) => ({
            ...prevState,
            loader: false,
            dataRows: rows,
          }));
          showSnackbar('Employees loaded successfully!', 'success');
        } else if (res?.data?.data?.es === 2 && res?.data?.data?.statusCode === 300) {
          showSnackbar(res?.data?.data?.message ?? 'Unknown error', 'warning');
          setPageState((prevState) => ({
            ...prevState,
            loader: false,
            dataRows: [],
          }));
        } else {
          showSnackbar(res?.data?.data?.message ?? 'Unknown error', 'warning');
          setPageState((prevState) => ({
            ...prevState,
            loader: false,
          }));
        }
      })
      .catch((err) => {
        if (err?.response) {
          showSnackbar(err?.response?.data?.message ?? 'Server error occurred.', 'error');
        } else if (err?.request) {
          showSnackbar('Unable to connect to the server. Please try again later.', 'error');
        } else {
          showSnackbar('An unexpected error occurred. Please try again.', 'error');
        }
      });
  };

  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchVal(value);
    }, 300),
    [],
  );

  useEffect(() => {
    getEmployees();
  }, [searchVal, pageState.page]);

  const handleSearch = (event) => {
    const { value } = event.target;
    setSearchInput(value);
    debouncedSearch(value);
  };

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const columns = [
    {
      field: 'name',
      headerName: 'Name',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      flex: 1,
      minWidth: 100,
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'id',
      headerName: 'Employee ID',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      flex: 1,
      minWidth: 70,
      cellClassName: 'datagrid-rows',
      align: 'center',
      renderCell: (params) => (
        <Box display="flex" alignItems="center">
          <PeopleIcon style={{ marginRight: 8 }} />
          {params.value ?? 'N/A'}
        </Box>
      ),
    },
    {
      field: 'designation',
      headerName: 'Designation',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      flex: 1,
      minWidth: 100,
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'department',
      headerName: 'Department',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      flex: 1,
      minWidth: 100,
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'employmentType',
      headerName: 'Employment Type',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      flex: 1,
      minWidth: 100,
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'joiningdate',
      headerName: 'Joining Date',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      flex: 1,
      minWidth: 100,
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'reportingManager',
      headerName: 'Reporting Manager',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      flex: 1,
      minWidth: 100,
      cellClassName: 'datagrid-rows',
      align: 'center',
      renderCell: (params) => (
        <Box display="flex" alignItems="center">
          <PeopleIcon style={{ marginRight: 8 }} />
          {params.value ?? 'N/A'}
        </Box>
      ),
    },
    {
      field: 'actions',
      headerName: '',
      minWidth: 40,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
      renderCell: (params) => {
        const handleClick = (event) => {
          setAnchorMarkupEl(event.currentTarget);
          setSelectedEmployeeRow(params.row);
          event.stopPropagation();
        };

        const handleCloseOp = () => {
          setAnchorMarkupEl(null);
        };

        const handleDelete = (id) => {
          const user_details = JSON.parse(localStorage.getItem('user_details'));
          const userId = user_details?.uidx;
          const userName = localStorage.getItem('user_name');
          const orgId = localStorage.getItem('orgId');
          const locId = localStorage.getItem('locId');

          const payload = {
            orgId: orgId,
            locationId: locId,
            updatedBy: userId,
            updatedByName: userName,
          };

          Swal.fire({
            title: 'Are you sure?',
            text: 'This action cannot be undone!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
          }).then((result) => {
            if (result?.isConfirmed) {
              hrmsDeleteEmployees(payload, id)
                .then((res) => {
                  if (res?.status === 200 && res?.data?.data?.es === 0) {
                    Swal.fire('Deleted!', 'The employee has been deleted.', 'success');
                    getEmployees();
                  } else {
                    const errorMessage = res?.data?.message ?? 'Failed to delete. Please try again.';
                    Swal.fire('Error!', errorMessage, 'error');
                  }
                })
                .catch((error) => {
                  Swal.fire('Error!', 'Failed to delete the blog post. Please try again.', 'error');
                });
            }
          });
        };

        return (
          <div>
            <Button
              id="basic-button"
              aria-controls={markUpOpen ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={markUpOpen ? 'true' : undefined}
              onClick={handleClick}
            >
              <MoreVertIcon fontSize="14px" />
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={markUpOpen ? anchorMarkupEl : null}
              open={markUpOpen}
              onClose={handleCloseOp}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              <MenuItem>
                <div
                  style={{
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'left',
                  }}
                >
                  <div onClick={() => navigate(`/hrms/updateEmployeeDetails/${selectedEmployeeRow?.id}`)}>
                    <EditIcon style={{ marginRight: '10px' }} />
                    Edit
                  </div>
                </div>
              </MenuItem>
              <MenuItem>
                <div
                  style={{
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'left',
                  }}
                >
                  <div onClick={() => handleDelete(selectedEmployeeRow?.id)}>
                    <DeleteIcon style={{ marginRight: '10px' }} />
                    Delete
                  </div>
                </div>
              </MenuItem>
            </Menu>
          </div>
        );
      },
    },
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar prevLink={true} />
      <Box
        className="search-bar-filter-and-table-container"
        style={{
          position: 'relative',
        }}
      >
        <SoftBox className="header-bulk-price-edit  search-bar-filter-container">
          <Grid item lg={5.5} md={5.5} sm={6} xs={12}>
            <SoftBox sx={{ position: 'relative' }}>
              <SoftInput
                placeholder="Search Employees"
                onChange={handleSearch}
                icon={{ component: 'search', direction: 'left' }}
                value={searchInput}
              />
            </SoftBox>
          </Grid>

          <Grid item lg={6.5} md={6.5} sm={6} xs={12} justifyContent={'right'}>
            <Box display={'flex'} alignItems={'center'} justifyContent={'right'} gap={'10px'}>
              <EmployeeFilter
                setDepartmentId={setDepartmentId}
                setDesignationId={setDesignationId}
                getEmployees={getEmployees}
              />
              <SoftButton
                sx={{
                  display: 'block',
                }}
                variant="solidWhiteBackground"
                onClick={() => navigate('/hrms/add-employee')}
              >
                + New
              </SoftButton>
            </Box>
          </Grid>
        </SoftBox>

        {pageState?.loader && (
          <Box
            sx={{
              height: '70vh',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Spinner />
          </Box>
        )}
        {!pageState?.loader && (
          <SoftBox py={0} px={0}>
            <SoftBox style={{ height: 525, width: '100%' }} className="dat-grid-table-box">
              <DataGrid
                sx={{ cursor: 'pointer', borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px' }}
                columns={columns}
                rows={pageState?.dataRows || []}
                rowCount={pageState?.totalResults}
                pagination
                page={pageState?.page}
                pageSize={pageState?.pageSize}
                paginationMode="server"
                onPageChange={(newPage) => {
                  setPageState((old) => ({ ...old, page: newPage }));
                }}
                onCellClick={(rows) => {
                  navigate(`/hrms/employeeDetailsPage/${rows.id}`);
                }}
                hideScrollbar={true}
                className="data-grid-table-boxo"
              />
            </SoftBox>
          </SoftBox>
        )}
      </Box>
    </DashboardLayout>
  );
};

export default HrmsEmployee;
