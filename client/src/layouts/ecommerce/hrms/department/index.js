import { useEffect, useState, useCallback } from 'react';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import sideNavUpdate from '../components/sidenavupdate';
import SoftBox from '../../../../components/SoftBox';
import SoftInput from '../../../../components/SoftInput';
import { Box, Button, Grid, Menu, MenuItem } from '@mui/material';
import SoftButton from '../../../../components/SoftButton';
import { DataGrid } from '@mui/x-data-grid';
import Spinner from '../../../../components/Spinner';
import { useNavigate } from 'react-router-dom';
import { hrmsDeleteDepartment, hrmsGetDepartments } from '../../../../config/Services';
import { useSnackbar } from '../../../../hooks/SnackbarProvider';
import { debounce } from 'lodash';
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from 'sweetalert2';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';

function HrmsDepartment() {
  sideNavUpdate();
  const showSnackbar = useSnackbar();
  const navigate = useNavigate();
  const [searchVal, setSearchVal] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [anchorMarkupEl, setAnchorMarkupEl] = useState(null);
  const markUpOpen = Boolean(anchorMarkupEl);
  const [pageState, setPageState] = useState({
    loader: false,
    dataRows: [],
    page: 0,
    pageSize: 10,
    totalResults: '',
  });
  const [selectedDepartmentRow, setSelectedDepartmentRow] = useState();

  const getDepartments = () => {
    setPageState((prevState) => ({ ...prevState, loader: true }));
    const locationId = localStorage.getItem('locId');
    const organizationId = localStorage.getItem('orgId');

    const payload = {
      pageNumber: pageState.page,
      pageSize: pageState.pageSize,
      locationId: locationId,
      organizationId: organizationId,
      searchBox: searchVal,
    };

    hrmsGetDepartments(payload)
      .then((res) => {
        setPageState((prevState) => ({
          ...prevState,
          totalResults: res?.data?.data?.data?.totalResults,
        }));
        if (res?.status === 200 && res?.data?.data?.es == 0) {
          const rows = res?.data?.data?.data?.data?.map((item, index) => ({
            id: item?.departmentId,
            departmentName: item?.departmentName || 'N/A',
            departmentLead: item?.departmentLeadName || 'N/A',
            totalEmployees: item?.totalEmployees || '0',
            fullTime: item?.fullTimeEmployees || '0',
            probation: item?.probationEmployees || '0',
            contracted: item?.contractedEmployees || '0',
            interns: item?.internEmployees || '0',
          }));

          setPageState((prevState) => ({
            ...prevState,
            dataRows: rows,
            loader: false,
          }));

          showSnackbar('Departments loaded successfully!', 'success');
        } else if (res?.data?.data?.es == 2 && res?.data?.data?.statusCode == 300) {
          showSnackbar(`${res?.data?.data?.message}`, 'warning');
          setPageState((prevState) => ({
            ...prevState,
            loader: false,
            dataRows: [],
          }));
        } else {
          showSnackbar(`${res?.data?.data?.message}`, 'warning');
          setPageState((prevState) => ({
            ...prevState,
            loader: false,
          }));
        }
      })
      .catch((err) => {
        if (err.response) {
          showSnackbar(err?.response?.data?.message || 'Server error occurred', 'error');
        } else if (err.request) {
          showSnackbar('No response from server. Please check your connection.', 'error');
        } else {
          showSnackbar(err?.message || 'An unknown error occurred', 'error');
        }
      });
  };

  useEffect(() => {
    getDepartments();
  }, [searchVal, pageState?.page]);

  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearchVal(value);
    }, 300),
    [],
  );

  const handleSearch = (event) => {
    const { value } = event.target;
    setSearchInput(value);
    debouncedSearch(value);
  };

  const columns = [
    {
      field: 'departmentName',
      headerName: 'Department Name',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      flex: 1,
      minWidth: 100,
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'departmentLead',
      headerName: 'Department Lead',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      flex: 1,
      minWidth: 70,
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'totalEmployees',
      headerName: 'Total Employees',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      flex: 1,
      minWidth: 100,
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'fullTime',
      headerName: 'Full Time',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      flex: 1,
      minWidth: 70,
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'probation',
      headerName: 'Probation',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      flex: 1,
      minWidth: 70,
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'contracted',
      headerName: 'Contracted',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      flex: 1,
      minWidth: 70,
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'interns',
      headerName: 'Interns',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      flex: 1,
      minWidth: 70,
      cellClassName: 'datagrid-rows',
      align: 'center',
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
          setSelectedDepartmentRow(params.row);
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
            organizationId: orgId,
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
              hrmsDeleteDepartment(payload, id)
                .then((res) => {
                  if (res?.status === 200 && res?.data?.data?.es === 0) {
                    Swal.fire('Deleted!', 'The department has been deleted.', 'success');
                    getDepartments();
                  } else {
                    const errorMessage = res?.data?.message || 'Failed to delete. Please try again.';
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
                  <div onClick={() => navigate(`/hrms/updateDepartmentDetails/${selectedDepartmentRow.id}`)}>
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
                  <div onClick={() => handleDelete(selectedDepartmentRow.id)}>
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
                placeholder="Search Departments"
                value={searchInput}
                onChange={handleSearch}
                icon={{ component: 'search', direction: 'left' }}
              />
            </SoftBox>
          </Grid>

          <Grid item lg={6.5} md={6.5} sm={6} xs={12} justifyContent={'right'}>
            <Box display={'flex'} alignItems={'center'} justifyContent={'right'} gap={'10px'}>
              <SoftButton
                sx={{
                  display: 'block',
                }}
                variant="solidWhiteBackground"
                onClick={() => navigate('/hrms/add-department')}
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
                hideScrollbar={true}
                className="data-grid-table-boxo"
              />
            </SoftBox>
          </SoftBox>
        )}
      </Box>
    </DashboardLayout>
  );
}

export default HrmsDepartment;
