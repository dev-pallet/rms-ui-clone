import './job-details.css';
import { Box, Grid } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { format, parseISO } from 'date-fns';
import { getAllJobs } from '../../../../../../config/Services';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useSnackbar } from '../../../../../../hooks/SnackbarProvider';
import { useState } from 'react';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import SoftBox from '../../../../../../components/SoftBox';
import SoftButton from '../../../../../../components/SoftButton';
import SoftInput from '../../../../../../components/SoftInput';
import { noDatagif } from '../../../../Common/CommonFunction';

const formatDateFromISO = (date) => format(parseISO(date), 'PPP');

export const JobDetails = () => {
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();
  const [rows, setRows] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const PAGE_SIZE = 10;

  const columns = [
    {
      field: 'id',
      headerName: 'Job ID',
      flex: 1,
      minWidth: 90,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'date',
      headerName: 'Created Date',
      editable: true,
      flex: 1,
      minWidth: 150,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'createdBy',
      headerName: 'Created By',
      editable: true,
      flex: 1,
      minWidth: 150,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'total_sessions',
      headerName: 'Total Sessions',
      editable: true,
      flex: 1,
      minWidth: 150,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'status',
      headerName: 'Status',
      editable: true,
      flex: 1,
      minWidth: 150,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <div className={`stock-status-chip ${renderClassname(params?.value)}`}>{params?.value}</div>
      ),
    },
  ];

  const renderClassname = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'active-chip';
      case 'CLOSED':
        return 'closed-chip';
      default:
        return 'pending-chip';
    }
  };

  const { data: jobList, isLoading: jobListLoading } = useQuery({
    refetchOnWindowFocus: false,
    retry: 1,
    queryKey: ['jobList', pageNo],
    queryFn: async () => {
      const payload = {
        pageNumber: pageNo,
        pageSize: PAGE_SIZE,
        sourceOrgId: orgId,
        sourceLocId: locId,
      };
      const response = await getAllJobs(payload);
      if (response?.data?.data?.es) {
        showSnackbar(response?.data?.data?.message, 'error');
        throw new Error(response?.data?.data?.message);
      }
      const rows = response?.data?.data?.data?.data.map((item) => {
        return {
          id: item?.jobId,
          date: item?.createdOn ? formatDateFromISO(item?.createdOn) : '',
          createdBy: item?.createdByName,
          total_sessions: item?.totalSessions,
          status: item?.status,
        };
      });
      setRows(rows);
      return response?.data?.data?.data;
    },
    onError: (error) => {
      showSnackbar(error?.message || error?.response?.data?.message || 'Some error occured', 'error');
    },
  });

  const handleSchedulerSettings = () => {
    navigate('/stock-taking/scheduler-settings');
  };

  const handleScheduler = (id) => {
    navigate(`/stock-taking/stock-session-monitor/${id}`);
  };

  return (
    <SoftBox>
      <SoftBox className="header-bulk-price-edit all-products-filter-wrapper search-bar-filter-container">
        <Grid container spacing={2} className="all-products-filter">
          <Grid item lg={5.5} md={5.5} sm={6} xs={12}>
            <Box className="all-products-filter-product">
              <SoftInput
                className="all-products-filter-soft-input-box"
                placeholder="Search Jobs"
                value={''}
                icon={{ component: 'search', direction: 'left' }}
              />
            </Box>
          </Grid>
          <Grid item lg={6.5} md={6.5} sm={6} xs={12} justifyContent={'right'}>
            <Box
              className="all-products-header-new-btn"
              display={'flex'}
              alignItems={'center'}
              justifyContent={'right'}
            >
              <SoftButton
                sx={{
                  display: 'block',
                }}
                variant="insideHeader"
                onClick={handleSchedulerSettings}
              >
                Scheduler <SettingsRoundedIcon sx={{ verticalAlign: 'text-top' }} />
              </SoftButton>
            </Box>
          </Grid>
        </Grid>
      </SoftBox>
      <SoftBox style={{ height: 525, width: '100%' }} className="dat-grid-table-box" mb={2}>
        <DataGrid
          columns={columns}
          rows={rows}
          getRowId={(row) => row?.id}
          rowCount={parseInt(jobList?.totalResult) || 0}
          loading={jobListLoading}
          pagination
          paginationMode="server"
          page={pageNo - 1 || 0}
          pageSize={PAGE_SIZE}
          rowsPerPageOptions={[PAGE_SIZE]}
          onPageChange={(newPage) => {
            setPageNo(newPage + 1);
          }}
          disableSelectionOnClick
          onCellClick={(row) => handleScheduler(row.id)}
          components={{
            NoRowsOverlay: () => (
              <SoftBox className="No-data-text-box">
                <SoftBox className="src-imgg-data">
                  <img className="src-dummy-img" src={noDatagif} />
                </SoftBox>
                <h3 className="no-data-text-I"> No transaction available</h3>
              </SoftBox>
            ),
            NoResultsOverlay: () => (
              <SoftBox className="No-data-text-box">
                <SoftBox className="src-imgg-data">
                  <img className="src-dummy-img" src={noDatagif} />
                </SoftBox>
                <h3 className="no-data-text-I"> No transaction available</h3>
              </SoftBox>
            ),
          }}
        />
      </SoftBox>
    </SoftBox>
  );
};
