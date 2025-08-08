import React, { useEffect, useMemo, useState } from 'react';
import DashboardLayout from '../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../examples/Navbars/DashboardNavbar';
import { Box, Button, Menu, MenuItem, Typography } from '@mui/material';
import SoftBox from '../../../../../components/SoftBox';
import SoftButton from '../../../../../components/SoftButton';
import Spinner from '../../../../../components/Spinner';
import { DataGrid } from '@mui/x-data-grid';
import Status from '../../../Common/Status';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../../../../hooks/SnackbarProvider';
import { getAllPrepStations } from '../../../../../config/Services';

const PrepStationListing = () => {
  const [loader, setLoader] = useState(false);
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [anchorMarkupEl, setAnchorMarkupEl] = useState(null);

  const markUpOpen = Boolean(anchorMarkupEl);
  const [selectedLevel3Row, setSelectedLevel3Row] = useState(null);
  const navigate = useNavigate();
  const showSnackBar = useSnackbar();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const user_details = localStorage.getItem('user_details');

  // page change for the prep station listing
  const handleLevel1PageChange = (newPage) => {
    setPage(newPage);
  };

  const columns = useMemo(
    () => [
      {
        field: 'id',
        headerName: 'Id',
        minWidth: 100,
        flex: 1,
        headerClassName: 'datagrid-columns',
        headerAlign: 'center',
        cellClassName: 'datagrid-rows',
        align: 'center',
      },

      {
        field: 'name',
        headerName: 'Name',
        minWidth: 100,
        flex: 1,
        headerClassName: 'datagrid-columns',
        headerAlign: 'center',
        cellClassName: 'datagrid-rows',
        align: 'center',
      },
      {
        field: 'shortCode',
        headerName: 'Short Code',
        minWidth: 70,
        flex: 1,
        headerClassName: 'datagrid-columns',
        headerAlign: 'center',
        cellClassName: 'datagrid-rows',
        align: 'center',
      },
      {
        field: 'status',
        headerName: 'Status',
        minWidth: 70,
        flex: 1,
        headerClassName: 'datagrid-columns',
        headerAlign: 'center',
        cellClassName: 'datagrid-rows',
        align: 'center',
        renderCell: (cellValues) => {
          return <div>{cellValues.value !== '' && <Status label={cellValues.value} />}</div>;
        },
      },
      {
        field: 'maxOrder',
        headerName: 'Order Capacity',
        minWidth: 70,
        flex: 1,
        headerClassName: 'datagrid-columns',
        headerAlign: 'center',
        cellClassName: 'datagrid-rows',
        align: 'center',
      },

      {
        field: 'createdDate',
        headerName: 'Created Date',
        minWidth: 100,
        flex: 1,
        headerClassName: 'datagrid-columns',
        headerAlign: 'center',
        cellClassName: 'datagrid-rows',
        align: 'center',
      },
      {
        field: 'updatedDate',
        headerName: 'Updated Date',
        minWidth: 100,
        flex: 1,
        headerClassName: 'datagrid-columns',
        headerAlign: 'center',
        cellClassName: 'datagrid-rows',
        align: 'center',
      },
      // {
      //   field: 'actions',
      //   headerName: '',
      //   minWidth: 40,
      //   flex: 1,
      //   headerClassName: 'datagrid-columns',
      //   headerAlign: 'center',
      //   cellClassName: 'datagrid-rows',
      //   align: 'center',
      //   renderCell: (params) => {
      //     const handleClick = (event) => {
      //       setAnchorMarkupEl(event.currentTarget);
      //       setSelectedLevel3Row(params.row);
      //     };

      //     const handleCloseOp = () => {
      //       setAnchorMarkupEl(null);
      //     };

      //     return (
      //       <div>
      //         <Button
      //           id="basic-button"
      //           aria-controls={markUpOpen ? 'basic-menu' : undefined}
      //           aria-haspopup="true"
      //           aria-expanded={markUpOpen ? 'true' : undefined}
      //           onClick={handleClick}
      //         >
      //           <MoreVertIcon fontSize="14px" />
      //         </Button>
      //         <Menu
      //           id="basic-menu"
      //           anchorEl={anchorMarkupEl}
      //           open={markUpOpen}
      //           onClose={handleCloseOp}
      //           MenuListProps={{
      //             'aria-labelledby': 'basic-button',
      //           }}
      //         >
      //           <MenuItem>
      //             <div
      //               style={{
      //                 border: 'none',
      //                 borderRadius: '5px',
      //                 cursor: 'pointer',
      //                 width: '100%',
      //                 textAlign: 'left',
      //               }}
      //             >
      //               <div onClick={() => navigate(`/products/prep-station/edit/${setSelectedLevel3Row?.id}`)}>
      //                 <EditIcon style={{ marginRight: '10px' }} />
      //                 Edit
      //               </div>
      //             </div>
      //           </MenuItem>
      //           <MenuItem>
      //             <div
      //               style={{
      //                 border: 'none',
      //                 borderRadius: '5px',
      //                 cursor: 'pointer',
      //                 width: '100%',
      //                 textAlign: 'left',
      //               }}
      //             >
      //               <div>
      //                 <ToggleOnIcon style={{ marginRight: '10px' }} />
      //                 Activate
      //               </div>
      //             </div>
      //           </MenuItem>
      //           <MenuItem>
      //             <div
      //               style={{
      //                 border: 'none',
      //                 borderRadius: '5px',
      //                 cursor: 'pointer',
      //                 width: '100%',
      //                 textAlign: 'left',
      //               }}
      //             >
      //               <div>
      //                 <ToggleOffIcon style={{ marginRight: '10px' }} />
      //                 Deactivate
      //               </div>
      //             </div>
      //           </MenuItem>
      //         </Menu>
      //       </div>
      //     );
      //   },
      // },
    ],
    [],
  );

  const getAllStationData = () => {
    setLoader(true);
    const payload = {
      page: page + 1,
      pageSize: 10,
      query: '',
      storeLocationId: [locId],
      sortByUpdatedAt: 'DESC',
    };
    getAllPrepStations(payload)
      .then((res) => {
        setLoader(false);
        if (res?.data?.status === 'ERROR' || res?.data?.data?.es > 0) {
          showSnackBar(
            res?.data?.message || res?.data?.data?.es > 0 || 'There was an error fetching prep station data',
            'error',
          );
        } else {
          const results = res?.data?.data?.data?.data || [];
          const ans = results?.map((item) => {
            const createdOn = new Date(item?.created * 1000);
            const formattedDate = `${createdOn?.getDate()} ${
              months[createdOn?.getMonth()]
            } ${createdOn?.getFullYear()}`;

            const updatedOn = new Date(item?.updated * 1000);
            const updatedFormat = `${updatedOn?.getDate()} ${
              months[updatedOn?.getMonth()]
            } ${updatedOn?.getFullYear()}`;
            return {
              id: item?.id,
              name: item?.displayName,
              shortCode: item?.shortCode,
              maxOrder: item?.maxOrderCapacity,
              createdDate: formattedDate,
              updatedDate: updatedFormat,
              status: item?.isActive ? 'ACTIVE' : 'INACTIVE',
            };
          });
          setRows(ans);
          setTotalRows(res?.data?.data?.data?.totalRecords);
        }
      })
      .catch((err) => {
        setLoader(false);
        showSnackBar('There was an error fetching data', 'error');
      });
  };

  useEffect(() => {
    getAllStationData();
  }, [page]);

  return (
    <DashboardLayout>
      <DashboardNavbar prevLink={true} />
      <Typography className="products-new-online-category-heading">Prep Station</Typography>

      <SoftBox className="search-bar-filter-and-table-container" style={{ marginTop: '20px' }}>
        <SoftBox className="search-bar-filter-container">
          <SoftBox>
            <Box className="all-products-filter-product" style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <SoftButton variant="solidWhiteBackground" onClick={() => navigate('/products/prep-station/create')}>
                + New
              </SoftButton>
            </Box>
          </SoftBox>
        </SoftBox>
        <SoftBox>
          <Box sx={{ height: 525, width: '100%' }}>
            {loader && <Spinner />}
            {!loader && (
              <DataGrid
                rows={rows}
                columns={columns}
                pagination
                pageSize={10}
                paginationMode="server"
                rowCount={totalRows}
                page={page}
                onPageChange={handleLevel1PageChange}
                getRowId={(row) => row?.id}
                onCellClick={(row) => navigate(`/products/prep-station/edit/${row?.id}`)}
              />
            )}
          </Box>
        </SoftBox>
      </SoftBox>
    </DashboardLayout>
  );
};

export default PrepStationListing;
