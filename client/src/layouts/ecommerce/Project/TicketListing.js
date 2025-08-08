import { DataGrid } from '@mui/x-data-grid';
import { useState } from 'react';
import './ticketListing.css';
import RadioButtonCheckedOutlinedIcon from '@mui/icons-material/RadioButtonCheckedOutlined';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom';
import { deleteTask } from '../../../config/Services';
import { useSnackbar } from '../../../hooks/SnackbarProvider';

const TicketListing = ({ ticketList, handlePageChange, handleSizeChange, fetchTicketList, fetchTicketSummary }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const openMenu = Boolean(anchorEl);
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();
  const columns = [
    {
      field: 'title',
      headerName: 'Title',
      minWidth: 170,
      flex: 1,
      align: 'left',
      headerAlign: 'center',
      headerClassName: 'datagrid-columns',
      cellClassName: 'datagrid-rows',
      renderCell: (params) => {
        return (
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
              gap: '8px',
              marginLeft: '15px',
            }}
          >
            <RadioButtonCheckedOutlinedIcon style={{ color: '#f44336' }} />
            {params?.value}
          </div>
        );
      },
    },
    {
      field: 'ticketId',
      headerName: 'Ticket Id',
      minWidth: 120,
      flex: 1,
      align: 'center',
      headerClassName: 'datagrid-columns',
      cellClassName: 'datagrid-rows',
      headerAlign: 'center',
      // renderCell: (params) => {
      //   const [copySuccess, setCopySuccess] = useState(false);
      //   const copyToClipboard = (e) => {
      //     e.stopPropagation();
      //     navigator.clipboard
      //       .writeText(params.row.taskId)
      //       .then(() => {
      //         setCopySuccess(true);

      //         setTimeout(() => setCopySuccess(false), 1000);
      //       })
      //       .catch(() => setCopySuccess(false));
      //   };
      //   return (
      //     <SoftBox style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
      //       <SoftBox>{params.row.taskId}</SoftBox>
      //       <SoftBox>
      //         {copySuccess ? (
      //           <span style={{ color: 'green', fontSize: '20px' }}>
      //             <CheckBoxOutlinedIcon />
      //           </span>
      //         ) : (
      //           <ContentCopyIcon style={{ cursor: 'pointer' }} onClick={copyToClipboard} />
      //         )}
      //       </SoftBox>
      //     </SoftBox>
      //   );
      // },
    },
    {
      field: 'product',
      headerName: 'Product',
      minWidth: 80,
      flex: 1,
      align: 'center',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
    },
    {
      field: 'feature',
      headerName: 'Feature',
      minWidth: 120,
      flex: 1,
      align: 'center',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
    },
    {
      field: 'status',
      headerName: 'Status',
      minWidth: 120,
      flex: 1,
      align: 'center',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
    },
    {
      field: 'created',
      headerName: 'Creation Date',
      minWidth: 120,
      flex: 1,
      align: 'center',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
    },
    {
      field: 'storeName',
      headerName: 'Store Name',
      minWidth: 120,
      flex: 1,
      align: 'center',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
    },
    {
      field: 'createdByName',
      headerName: 'Created Name',
      minWidth: 120,
      flex: 1,
      align: 'center',
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
    },
    {
      field: 'Actions',
      minWidth: 20,
      align: 'left',
      headerClassName: 'datagrid-columns',
      cellClassName: 'datagrid-rows',
      renderCell: (params) => {
        const handleMoreIconClick = (row) => {
          setSelectedRowId(row);
        };

        return (
          <>
            <MoreHorizIcon
              onClick={(event) => {
                event.stopPropagation();
                handleClick(event, params?.row?.ticketId), handleMoreIconClick(params?.row);
              }}
            />
            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={openMenu}
              onClose={handleCloseMenu}
              onClick={handleCloseMenu}
              slotProps={{
                paper: {
                  elevation: 0,
                  sx: {
                    // overflow: 'visible',
                    // filter: 'rgba(253, 253, 253, 0.96) 0px 8px 24px !important',
                    boxShadow: 'none',
                    border: '1px solid #f4ecec',
                    mt: 1.5,
                    '& .MuiAvatar-root': {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    '&::before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      // bgcolor: 'background.paper',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                    },
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem
                sx={{
                  '&.MuiMenuItem-root': {
                    padding: '4px !important',
                    marginTop: '2px !important',
                    margin: '3px',
                    left: '3px',
                  },
                }}
                onClick={() => handleEdit(selectedRowId)}
              >
                Edit
              </MenuItem>
              <MenuItem
                sx={{
                  '&.MuiMenuItem-root': {
                    padding: '4px !important',
                    marginTop: '2px !important',
                    margin: '3px',
                    left: '3px',
                  },
                }}
                onClick={() => handleDelete(selectedRowId)}
              >
                Delete
              </MenuItem>
            </Menu>
          </>
        );
      },
    },
  ];

  const handleClick = (event, rowId) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedRowId(rowId);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
    setSelectedRowId(null);
  };
  const navigateToDetailsPage = (taskId) => {
    navigate(`/project/details/${taskId}`);
  };

  const handleEdit = (row) => {
    navigate(`/project/edit-ticket/${row?.ticketId}`);
  };
  const source_location_Id = localStorage.getItem('locId');
  const org_Id = localStorage.getItem('orgId');
  const createByval = localStorage.getItem('user_details');
  const userDetails = JSON.parse(createByval);
  const uidxVal = userDetails.uidx;
  const createByNameVal = localStorage.getItem('user_name');

  const handleDelete = (row) => {
    const payload = {
      taskId: row?.ticketId,
      updatedBy: uidxVal,
      updatedByName: createByNameVal,
    };
    deleteTask(row?.ticketId, payload)
      .then((res) => {
        ticketList?.dataRows?.filter((item) => {
          item?.ticketId !== row?.ticketId;
        });
        fetchTicketList(source_location_Id, org_Id, 0, 10);
        fetchTicketSummary();
        showSnackbar(res?.data?.data?.message, 'success');
      })

      .catch((error) => {
        showSnackbar(error?.response?.data?.message || error?.message, 'error');
      });
  };
  return (
    <div className="tasklist-datagrid-container">
      <DataGrid
        columns={columns}
        rows={ticketList?.dataRows}
        getRowId={(row) => row?.id}
        rowCount={ticketList?.total}
        loading={ticketList?.loader}
        pagination
        page={ticketList?.page}
        // page={ticketList.pageNumber - 1}
        pageSize={ticketList?.pageSize}
        paginationMode="server"
        onPageChange={handlePageChange}
        onPageSizeChange={handleSizeChange}
        // pageSizeOptions={[10, 20, 50, 100]}
        onCellClick={(rows) => {
          navigateToDetailsPage(rows?.row?.ticketId);
        }}
        // className="tasklist-datagrid"
        sx={{
          '& .MuiDataGrid-row': {
            borderBottom: 'none',
            cursor: 'pointer',
          },
          '& .MuiDataGrid-cell': {
            borderBottom: 'none',
          },
          '& .MuiDataGrid-main .MuiDataGrid-iconButtonContainer': {
            display: 'none !important',
          },
          '& .MuiDataGrid-menuIcon': {
            display: 'none !important',
          },
          '& .MuiDataGrid-iconSeparator': {
            display: 'none !important',
          },
          '&.MuiDataGrid-root .MuiDataGrid-cell:focus-within': {
            outline: 'none !important',
          },

          border: 'none',
          fontSize: '14px',
          color: '#030303',
          lineHeight: '18px',
        }}
      />
    </div>
  );
};

export default TicketListing;
