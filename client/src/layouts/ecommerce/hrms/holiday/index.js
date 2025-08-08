import { useCallback, useEffect, useState } from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import { Box, Button, Grid, Menu, MenuItem } from '@mui/material';
import SoftBox from '../../../../components/SoftBox';
import SoftInput from '../../../../components/SoftInput';
import SoftButton from '../../../../components/SoftButton';
import { DataGrid } from '@mui/x-data-grid';
import sideNavUpdate from '../components/sidenavupdate';
import { useNavigate } from 'react-router-dom';
import { hrmsDeleteHoliday, hrmsGetHoliday } from '../../../../config/Services';
import { useSnackbar } from '../../../../hooks/SnackbarProvider';
import Spinner from '../../../../components/Spinner';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Swal from 'sweetalert2';
import { debounce } from 'lodash';
import GridViewIcon from '@mui/icons-material/GridView';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

function HrmsHoliday() {
  sideNavUpdate();
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();
  const [searchVal, setSearchVal] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [anchorMarkupEl, setAnchorMarkupEl] = useState(null);
  const markUpOpen = Boolean(anchorMarkupEl);
  const [selectedView, setSelectedView] = useState('grid');
  const localizer = momentLocalizer(moment);
  const [selectedHolidayRow, setSelectedHolidayRow] = useState();

  const [pageState, setPageState] = useState({
    loader: false,
    dataRows: [],
    page: 0,
    pageSize: 10,
    totalResults: 0,
    events: [],
  });

  const mainContentStyle = {
    padding: '20px',
    background: '#f9f9f9',
    minHeight: '80vh',
  };

  const checkTypes = (type) => {
    switch (type) {
      case 'GENERAL_HOLIDAY':
        return 'General Holiday';
      case 'OPTIONAL_HOLIDAY':
        return 'Optional Holiday';
      default:
        break;
    }
  };

  const getHolidays = () => {
    const locationId = localStorage.getItem('locId');
    const organizationId = localStorage.getItem('orgId');

    setPageState((prevState) => ({
      ...prevState,
      loader: true,
    }));

    const payload = {
      pageSize: 10,
      pageNumber: pageState?.page,
      organizationId: organizationId,
      locationId: locationId,
      sortByCreatedAt: 'ASCENDING',
      searchBox: searchVal,
    };

    hrmsGetHoliday(payload)
      .then((res) => {
        setPageState((prevState) => ({
          ...prevState,
          totalResults: res?.data?.data?.data?.totalResults,
        }));

        if (res?.status === 200 && res?.data?.data?.es == 0) {
          const events = res?.data?.data?.data?.data?.map((item, index) => ({
            title: item?.holidayName,
            start: new Date(item?.holidayDate),
            end: new Date(item?.holidayDate),
            allDay: true,
          }));

          setPageState((prevState) => ({
            ...prevState,
            loader: false,
            events: events,
          }));

          const rows = res?.data?.data?.data?.data?.map((item, index) => ({
            id: item?.generalHolidayId,
            holiday: item?.holidayName || 'N/A',
            type: checkTypes(item?.holidayType) || 'N/A',
            country: item?.country || 'N/A',
            date: item?.holidayDate || 'N/A',
          }));

          setPageState((prevState) => ({
            ...prevState,
            loader: false,
            dataRows: rows,
          }));
          showSnackbar('Holidays loaded successfully!', 'success');
        } else if (res?.data?.data?.es === 2 && res?.data?.data?.statusCode === 300) {
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
        if (err?.response) {
          showSnackbar(err?.response.data?.message || 'Server error occurred.', 'error');
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

  useEffect(() => {
    getHolidays();
  }, [searchVal, pageState?.page]);

  const handleViewChange = (val) => {
    setSelectedView(val);
  };

  const columns = [
    {
      field: 'holiday',
      headerName: 'Holiday',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      flex: 1,
      minWidth: 100,
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'type',
      headerName: 'Type',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      flex: 1,
      minWidth: 70,
      cellClassName: 'datagrid-rows',
      align: 'center',
    },

    {
      field: 'country',
      headerName: 'Country',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      flex: 1,
      minWidth: 100,
      cellClassName: 'datagrid-rows',
      align: 'center',
    },
    {
      field: 'date',
      headerName: 'Date',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      flex: 1,
      minWidth: 100,
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
          setSelectedHolidayRow(params.row);
          event.stopPropagation();
        };

        const handleCloseOp = () => {
          setAnchorMarkupEl(null);
          event.stopPropagation();
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
              hrmsDeleteHoliday(payload, id)
                .then((res) => {
                  if (res?.status === 200 && res?.data?.data?.es === 0) {
                    Swal.fire('Deleted!', 'Holiday has been deleted.', 'success');
                    getHolidays();
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
                  <div onClick={() => navigate(`/hrms/updateHoliday/${selectedHolidayRow?.id}`)}>
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
                  <div onClick={() => handleDelete(selectedHolidayRow?.id)}>
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
        display="flex"
        gap="10px"
        alignItems="center"
        justifyContent="end"
        sx={{ margin: '10px 0', padding: '10px' }}
      >
        <SoftButton
          onClick={() => handleViewChange('grid')}
          sx={{
            backgroundColor: selectedView === 'grid' ? '#007AFF !important' : '',
            color: selectedView === 'grid' ? '#fff' : '',
          }}
        >
          <GridViewIcon />
        </SoftButton>
        <SoftButton
          onClick={() => handleViewChange('calendar')}
          sx={{
            backgroundColor: selectedView === 'calendar' ? '#007AFF !important' : '',
            color: selectedView === 'calendar' ? '#fff' : '#000',
          }}
        >
          <CalendarMonthIcon />
        </SoftButton>
      </Box>

      {selectedView == 'grid' && (
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
                  placeholder="Search Holiday"
                  onChange={handleSearch}
                  icon={{ component: 'search', direction: 'left' }}
                  value={searchInput}
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
                  onClick={() => navigate('/hrms/add-holiday')}
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
      )}

      {selectedView == 'calendar' && (
        <div style={mainContentStyle}>
          <div
            style={{
              height: '70vh',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
              borderRadius: '8px',
              background: '#fff',
              padding: '30px',
            }}
          >
            <Calendar
              localizer={localizer}
              events={pageState?.events || []}
              startAccessor="start"
              endAccessor="end"
              views={{ month: true }}
              defaultView={Views?.MONTH}
              style={{ height: '100%' }}
            />
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default HrmsHoliday;
