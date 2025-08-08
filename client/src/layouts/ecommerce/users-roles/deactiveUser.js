import './users-roles.css';
import { Box, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Menu, MenuItem, Tooltip, tooltipClasses } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { deletedUsers,  getAllRoles, userStatusChange } from './../../../config/Services';
import Avatar from '@mui/material/Avatar';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import MuiAlert from '@mui/material/Alert';
import React, { useEffect, useState } from 'react';
import SetInterval from '../setinterval';
import Snackbar from '@mui/material/Snackbar';
import SoftBox from 'components/SoftBox';
import SoftButton from '../../../components/SoftButton';
import Spinner from './../../../components/Spinner/index';
import sideNavUpdate from '../../../components/Utility/sidenavupdate';
import styled from '@emotion/styled';

const DeactiveUserroles = ({handleTab}) => {
  sideNavUpdate();
  const [dataRows, setTableRows] = useState([]);
  const [anchorElAction, setAnchorElAction] = useState(null);
  const [userData, setUserData] = useState({});
  const [isPosUser, setIsPosUser] = useState(false);
  
  const openAction = Boolean(anchorElAction);
  const roles = JSON.parse(localStorage.getItem('user_roles'));

  const actionButtonClick = (event, row) => {
    setAnchorElAction(event.currentTarget);
    setUserData(row);
    if(row.roles.split(', ').includes('Pos User')){
      setIsPosUser(true);
    }
  };
  const handleCloseAction = () => {
    setAnchorElAction(null);
    setIsPosUser(false);
  };

  useEffect(() => {
    const tabChangeFromSku = localStorage.getItem('add-vendor-product-portfolio');
    if (tabChangeFromSku) {
      handleTab(1);
    }
  }, []);

  useEffect(() => {
  }, [isPosUser]);
  
  const LightTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)(
    ({ theme }) => ({
      [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: theme.palette.common.white,
        color: 'rgba(0, 0, 0, 0.87)',
        boxShadow: theme.shadows[1],
        fontSize: 11,
      },
    }),
  );

  const columns = [
    {
      field: 'image',
      headerName: 'Image',
      minWidth: 100,
      flex: 0.75,
      headerClassName: 'datagrid-columns',
      headerAlign: 'center',
      cellClassName: 'datagrid-rows',
      align: 'center',
      renderCell: (params) => {
        return <Avatar src={params.value} className="all-product-image" width="60px" height="60px" />;
      },
    },
    {
      field: 'name',
      headerName: 'Name',
      minWidth: 190,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'email',
      headerName: 'Email',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 180,
      flex: 1,
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'mobile',
      headerName: 'Mobile',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 150,
      flex: 1,
      cellClassName: 'datagrid-rows',
      align: 'left',
    },
    {
      field: 'roles',
      headerName: 'Roles',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      flex: 1,
      minWidth: 150,
      cellClassName: 'datagrid-rows',
      align: 'left',
      renderCell: (params) => {
        const title = ` ${params?.row?.roles}`;
        return (
          <LightTooltip title={title}>
            <div>{params?.value} </div>
          </LightTooltip>
        );
      },
    },
    { ...(roles.includes('SUPER_ADMIN')
      ?{
        field: 'action-button',
        headerName: '',
        headerClassName: 'datagrid-columns',
        headerAlign: 'center',
        width: 230,
        cellClassName: 'datagrid-rows',
        align: 'center',
        disableClickEventBubbling: true,
        renderCell: (params) => {
          return (
            <SoftBox>
              <SoftBox
                className="moreicons-dot-box"
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={(e) => actionButtonClick(e, params.row)}
              >
                <MoreHorizIcon className="moreicons-dot" />
              </SoftBox>
                  
            </SoftBox>
          );
        },
      }
      :null    
    )
    },
  ];

  let dataArr,
    dataRow = [];
  const [loader, setLoader] = useState(false);

  //snackbar
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const [opensnack, setOpensnack] = useState(false);
  const [alertmessage, setAlertmessage] = useState('');
  const [timelinerror, setTimelineerror] = useState('');
  const [activateLoader, setActivateLoader] = React.useState(false);

  const handleopensnack = () => {
    setOpensnack(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpensnack(false);
  };

  const userRole = JSON.parse(localStorage.getItem('user_roles'));
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');

  useEffect(() => {
    getAllUsers();
  }, []);
  
  const getAllUsers = () => {
    const payload = {
      orgId: orgId,
      contextId: locId,
    };
    if (!locId) {
      setAlertmessage(`Select a location for ${orgId}`);
      setTimelineerror('error');
      SetInterval(handleopensnack());
    } else {
      setLoader(true);
      deletedUsers(payload).then((response) => {
        dataArr = response.data.data;
        getAllRoles(localStorage.getItem('contextType'))
          .then((res) => {
            const allRoles = res.data.data;
            const newDataRows = dataArr?.map((row) => {
              const commonNames = allRoles.filter((obj) => row?.roles.includes(obj.name)).map((obj) => obj.name);
              const modifiedArray = commonNames.map((item) => {
                const words = item.split('_');
                const capitalizedWords = words.map((word) => {
                  const lowercaseWord = word.toLowerCase();
                  return lowercaseWord.charAt(0).toUpperCase() + lowercaseWord.slice(1);
                });
                return capitalizedWords.join(' ');
              });
              return {
                image: row.profilePicture,
                name: row?.firstName + ' ' +row?.secondName,
                firstName: row?.firstName,
                secondName: row?.secondName,
                email: row?.email,
                mobile: row?.mobileNumber,
                roles: modifiedArray.join(', '),
                last_login: '2023-02-22T10:12:18.675Z',
                uidx: row?.uidx,
                profilePicture: row?.profilePicture,
                mobileNumber: row?.mobileNumber,
              };
            });
  
            setLoader(false);
            setTableRows(newDataRows);
          }).catch((err) => {
            setLoader(false);
            setAlertmessage(err.response.data.message);
            setTimelineerror('error');
            SetInterval(handleopensnack());
          });
      })
        .catch((err) => {
          setLoader(false);
          setAlertmessage(err.response.data.message);
          setTimelineerror('error');
          SetInterval(handleopensnack());
        });
    }
  };

  const [open1, setOpen1] = React.useState(false);

  const handleClickOpen1 = () => {
    setOpen1(true);
  };

  const handleClose1 = () => {
    setOpen1(false);
  };

  const handleActivate = () => {
    handleCloseAction();
    handleClickOpen1();
  };

  const deactivateUser = () => {
    setActivateLoader(true);
    handleCloseAction();
    const payload = {
      'flag':'false',
      'mobile':userData.mobile,
      'orgId':orgId,
      'contextId':locId
    };
    userStatusChange(payload)
      .then((res) => {
        if(res.data.code === 'ECONNRESET'){
          setAlertmessage('Some error Occured');
          setTimelineerror('error');
          SetInterval(handleopensnack());
        }
        setActivateLoader(false);
        handleClose1();
        getAllUsers();
      })
      .catch((err) => {
        setActivateLoader(false);
        handleClose1();
      });

  };

  
  return (
    <Box mt={2}>
      <Snackbar open={opensnack} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={timelinerror} sx={{ width: '100%' }}>
          {alertmessage}
        </Alert>
      </Snackbar>
      <SoftBox>

        <SoftBox py={1} className="data-grid-table-boxo-user">
          {loader && <Spinner />}
          {!loader && (
            <DataGrid
              sx={{cursor: 'pointer'}}
              rows={dataRows}
              style={{ height: 425, width: '100%' }}
              rowsPerPageOptions={[10]}
              getRowId={(row) => row.mobile}
              rowHeight={45}
              columns={columns}
            />
          )}
        </SoftBox>
        <Dialog
          open={open1}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
          maxWidth="xs"
        >
          <DialogTitle id="alert-dialog-title">
            {'Deactivate User'}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
                        Are you sure you want to activate user<b> {userData.firstName} {userData.secondName}</b>? 
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            {!activateLoader
              ?<SoftButton onClick={() => {handleClose1(), handleCloseAction();}}>Close</SoftButton>
              :<SoftButton disabled>Close</SoftButton>
            }
            <SoftButton variant="gradient"
              color="info"
              onClick={deactivateUser} autoFocus>
              {activateLoader ? (
                <CircularProgress
                  size={24}
                  sx={{
                    color: '#fff',
                  }}
                />
              ) : (
                <>Activate</>
              )}
            </SoftButton>
          </DialogActions>
        </Dialog>
      </SoftBox>
      <Menu
        id="basic-menu"
        anchorEl={anchorElAction}
        open={openAction}
        onClose={handleCloseAction}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(-10px -10px -10px red)',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 20,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,

              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem key="activate" onClick={handleActivate}>Activate</MenuItem>
            
      </Menu>
    </Box>
  );
};

export default DeactiveUserroles;
