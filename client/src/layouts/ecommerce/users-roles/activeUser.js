import './users-roles.css';
import {
  Box,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Menu,
  MenuItem,
  Tooltip,
  tooltipClasses,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import SoftBox from 'components/SoftBox';
import SoftButton from '../../../components/SoftButton';
import SoftTypography from 'components/SoftTypography';
// import Modal from "react-modal";
import { DataGrid } from '@mui/x-data-grid';
import {
  getAllOrgUsers,
  getAllOrgUsersFiltered,
  getAllRoles,
  resetUserPin,
  updateUserPin,
  userStatusChange,
  userTimeline,
} from './../../../config/Services';
import { useSnackbar } from '../../../hooks/SnackbarProvider';
import Avatar from '@mui/material/Avatar';
import EditUserData from './editUser';
import Modal from '@mui/material/Modal';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import SoftInput from '../../../components/SoftInput';
import Spinner from './../../../components/Spinner/index';
import UserDetailsByMobile from './userDetails';
import sideNavUpdate from '../../../components/Utility/sidenavupdate';
import styled from '@emotion/styled';

const ActiveUserroles = ({ selectedUserRoles, isApplied, setIsApplied, onClear, setOnClear, handleTab }) => {
  sideNavUpdate();
  const [dataRows, setTableRows] = useState([]);
  const [anchorElAction, setAnchorElAction] = useState(null);
  const [openmodel, setOpenmodel] = useState(false);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [userData, setUserData] = useState({});
  const [isPosUser, setIsPosUser] = useState(false);
  const [allUserRoles, setAllUserRoles] = useState(null);

  const openAction = Boolean(anchorElAction);
  const roles = JSON.parse(localStorage.getItem('user_roles'));

  const showSnackbar = useSnackbar();

  const actionButtonClick = (event, row, roles) => {
    setAnchorElAction(event.currentTarget);
    setUserData(row);
    setAllUserRoles(roles);
    if (row.roles.split(', ').includes('Pos User')) {
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

  useEffect(() => {}, [isPosUser]);

  const handleopen = () => {
    setOpenmodel(true);
  };

  const handleEdit = () => {
    handleCloseAction();
    handleopen();
  };
  const handleDetail = () => {
    handleCloseAction();
    setOpenDetailModal(true);
  };

  const [open2, setOpen2] = React.useState(false);
  const [agreeLoader, setAgreeLoader] = React.useState(false);

  const handleClickOpen2 = () => {
    setOpen2(true);
  };

  const handleClose2 = () => {
    setOpen2(false);
    handleCloseAction();
    setIsPosUser(false);
  };

  const [open3, setOpen3] = React.useState(false);
  const [deactivateLoader, setDeactivateLoader] = React.useState(false);

  const handleClickOpen3 = () => {
    setOpen3(true);
  };

  const handleClose3 = () => {
    setOpen3(false);
    handleCloseAction();
    setIsPosUser(false);
  };

  const [open4, setOpen4] = React.useState(false);

  const handleClickOpen4 = () => {
    setOpen4(true);
  };

  const handleClose4 = () => {
    setOpen4(false);
  };
  const [open5, setOpen5] = React.useState(false);

  const handleClickOpen5 = () => {
    setOpen5(true);
  };

  const handleClose5 = () => {
    setOpen5(false);
  };

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
    ...(roles.includes('SUPER_ADMIN')
      ? [
        {
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
                  onClick={(e) => actionButtonClick(e, params.row, params?.row?.userRoles)}
                >
                  <MoreHorizIcon className="moreicons-dot" />
                </SoftBox>
              </SoftBox>
            );
          },
        },
      ]
      : []),
  ];

  let dataArr,
    dataRow = [];
  const [loader, setLoader] = useState(false);
  const [saveLoader, setSaveLoader] = useState(false);

  //snackbar
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const [opensnack, setOpensnack] = useState(false);
  const [alertmessage, setAlertmessage] = useState('');
  const [timelinerror, setTimelineerror] = useState('');

  const handleopensnack = () => {
    setOpensnack(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpensnack(false);
  };

  // const roles = localStorage.getItem('user_roles');
  const permissions = JSON.parse(localStorage.getItem('permissions'));
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
      showSnackbar(`Select a location for ${orgId}`, 'error');
    } else {
      setLoader(true);
      getAllOrgUsers(payload)
        .then((response) => {
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
                  name: row?.firstName + ' ' + row?.secondName,
                  firstName: row?.firstName,
                  secondName: row?.secondName,
                  email: row?.email,
                  mobile: row?.mobileNumber,
                  roles: modifiedArray.join(', '),
                  last_login: '2023-02-22T10:12:18.675Z',
                  uidx: row?.uidx,
                  profilePicture: row?.profilePicture,
                  mobileNumber: row?.mobileNumber,
                  userRoles: row?.roles,
                };
              });

              setLoader(false);
              setTableRows(newDataRows);
            })
            .catch((err) => {
              setLoader(false);
              showSnackbar(err?.response?.data?.message || 'Some error occurred', 'error');
            });
        })
        .catch((err) => {
          setLoader(false);
          showSnackbar(err?.response?.data?.message || 'Some error occurred', 'error');
        });
    }
  };

  useEffect(() => {
    if (userRole.includes('SUPER_ADMIN')) {
      setAuthorization(true);
    } else {
      setAuthorization(false);
    }
  });

  const getFilteredUsers = () => {
    // remove spaces with _ in selectedUserRoles array
    const modifiedArray = selectedUserRoles.map((obj) => ({
      ...obj,
      label: obj.label.includes(' ') ? obj.label.replace(/\s+/g, '_') : obj.label,
    }));

    const filtered_user_roles = modifiedArray.map((obj) => `roles[]=${encodeURIComponent(obj.label)}`).join('&');

    const payload = {
      orgId: orgId,
      contextId: locId,
    };
    if (!locId) {
      showSnackbar(`Select a location for ${orgId}`, 'error');
    } else {
      setLoader(true);
      getAllOrgUsersFiltered(payload, filtered_user_roles)
        .then((response) => {
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
                  name: row?.firstName + ' ' + row?.secondName,
                  firstName: row?.firstName,
                  secondName: row?.secondName,
                  email: row?.email,
                  mobile: row?.mobileNumber,
                  roles: modifiedArray.join(', '),
                  last_login: '2023-02-22T10:12:18.675Z',
                  uidx: row?.uidx,
                  profilePicture: row?.profilePicture,
                  mobileNumber: row?.mobileNumber,
                  userRoles: row?.roles,
                };
              });

              setLoader(false);
              setTableRows(newDataRows);
            })
            .catch((err) => {
              setLoader(false);
              showSnackbar(err?.response?.data?.message || 'Some error occured', 'error');
            });
        })
        .catch((err) => {
          setLoader(false);
          showSnackbar(err?.response?.data?.message || 'Some error occured', 'error');
        });
    }
  };

  // when apply is clicked on filter
  useEffect(() => {
    if (isApplied) {
      getFilteredUsers();
      setIsApplied(false);
    }
  }, [isApplied]);

  // when clear is clicked on filter
  useEffect(() => {
    if (onClear) {
      getAllUsers();
      setOnClear(false);
    }
  }, [onClear]);

  const [authorization, setAuthorization] = useState(false);
  const [selectedImages, setSelectedImages] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [editedItem, setEditedItem] = useState({});
  const [otp, setOtp] = useState('');
  const [newPin, setNewPin] = useState('');

  const handleResetPin = () => {
    handleClickOpen2();
  };

  const handleAgreeReset = () => {
    setAgreeLoader(true);
    setIsPosUser(false);
    handleCloseAction();
    const payload = {
      mobile: userData.mobileNumber,
    };
    resetUserPin(payload)
      .then((res) => {
        showSnackbar('OTP send to the registered email', 'success');
        handleClose2();
        setAgreeLoader(false);
        handleClickOpen3();
      })
      .catch((err) => {
        handleClose2();
        setAgreeLoader(false);
        if (err.response.data.message == 'User is not found, please sign up') {
          showSnackbar('Pos User is not found, please sign up', 'error');
        } else {
          showSnackbar(err?.response?.data?.message || 'Some error occurred', 'error');
        }
      });
  };

  const handleUpdatePin = () => {
    setAgreeLoader(true);
    setIsPosUser(false);
    handleCloseAction();
    const payload = {
      primaryPassword: newPin,
      otp: otp,
      mobile: userData.mobileNumber,
    };
    if (newPin.length !== 4) {
      showSnackbar('PIN should of 4 digits', 'warning');
    } else {
      updateUserPin(payload)
        .then((res) => {
          showSnackbar('PIN send to the registered email', 'success');
          handleClose3();
          setAgreeLoader(false);
        })
        .catch((err) => {
          handleClose3();
          setAgreeLoader(false);
          showSnackbar(err?.response?.data?.message || 'Some error occurred', 'error');
        });
    }
  };

  const [activityLoader, setActivityLoader] = useState(false);
  const [openmodel2, setOpenmodel2] = useState(false);
  const [userLoginData, setUserLoginData] = useState([]);
  const [userLoginError, setUserLoginError] = useState('');

  const handleopen2 = () => {
    setOpenmodel2(true);
  };
  const handleCloseModal = () => {
    setOpenmodel2(false);
    setUserLoginError('');
    setUserLoginData([]);
  };

  const handleUserActivity = () => {
    handleCloseAction();
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 2);
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 1);

    function formatDate(date) {
      let day = date.getDate();
      let month = date.getMonth() + 1;
      const year = date.getFullYear() % 100;

      day = day.toString();
      month = month.toString();

      return month + '/' + day + '/' + year;
    }

    const startDateFormatted = formatDate(startDate);
    const endDateFormatted = formatDate(endDate);

    const payload = {
      uidx: userData.uidx,
      startDate: startDateFormatted,
      endDate: endDateFormatted,
    };
    setActivityLoader(true);
    userTimeline(payload)
      .then((res) => {
        setActivityLoader(false);
        if (res?.data?.code === 'ECONNRESET') {
          showSnackbar('Some error occurred', 'error');
          handleCloseModal();
        } else {
          if (res?.data?.data?.message === 'No Login activity available') {
            setUserLoginError(res?.data?.data?.message + ' for 2 days');
          } else {
            setUserLoginData(res?.data?.data);
          }
        }
      })
      .catch((err) => {
        setActivityLoader(false);
        if (err?.response?.data?.message === 'No Login activity available') {
          setUserLoginError(err?.response?.data?.message + ' for 2 days');
        } else {
          setUserLoginError(err?.response?.data?.message);
        }
      });
    handleopen2(true);
  };

  function isExpiredAt(at_expiry) {
    const atExpiryDate = new Date(at_expiry);
    return new Date() > atExpiryDate;
  }
  function isExpiredRT(rt_expiry) {
    const rtExpiryDate = new Date(rt_expiry);
    return new Date() > rtExpiryDate;
  }

  const handleDeactivate = () => {
    const user = JSON.parse(localStorage.getItem('user_details'));
    if (user.mobileNumber === userData.mobile) {
      handleClickOpen5();
    } else {
      handleClickOpen4();
    }
    handleCloseAction();
  };

  const deactivateUser = () => {
    setDeactivateLoader(true);
    handleCloseAction();
    const payload = {
      flag: 'true',
      mobile: userData.mobile,
      orgId: orgId,
      contextId: locId,
    };
    userStatusChange(payload)
      .then((res) => {
        if (res.data.code === 'ECONNRESET') {
          showSnackbar('Some error occurred', 'error');
        }
        setDeactivateLoader(false);
        handleClose4();
        getAllUsers();
      })
      .catch((err) => {
        setDeactivateLoader(false);
        handleClose4();
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
        <Grid container spacing={3}>
          <Grid item xs={12} md={12} xl={12}>
            {/* <SoftBox className="auto-div" display='flex' justifyContent='space-between'>
              <SoftTypography className="gift-text-I">Users and Permissions</SoftTypography>
              {authorization &&
              (permissions?.RETAIL_Settings?.WRITE ||
                permissions?.WMS_Settings?.WRITE ||
                permissions?.VMS_Settings?.WRITE) ? (
                <Link to="/setting/account/new">
                  <SoftButton
                    // className="add-staff-btn"
                    color="info"
                  >
                    Add Staff
                  </SoftButton>
                </Link>
              ) : null}
            </SoftBox> */}
          </Grid>
        </Grid>

        <SoftBox py={1} className="data-grid-table-boxo-user">
          {loader && <Spinner size={40} />}
          {!loader && (
            <DataGrid
              sx={{ cursor: 'pointer' }}
              rows={dataRows}
              style={{ height: 425, width: '100%' }}
              pageSizeOptions={[10]}
              pagination
              autoPageSize
              getRowId={(row) => row.mobile}
              rowHeight={45}
              columns={columns}
              disableSelectionOnClick
            />
          )}
        </SoftBox>
        {/* RESET PIN */}
        <Dialog
          open={open2}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
          maxWidth="xs"
        >
          <DialogTitle id="alert-dialog-title">{'Resend PIN'}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              OTP will be sent to the <b> {userData.email} </b>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            {!agreeLoader ? (
              <SoftButton
                onClick={() => {
                  handleClose2(), handleCloseAction();
                }}
                className="vendor-second-btn"
              >
                Close
              </SoftButton>
            ) : (
              <SoftButton disabled className="vendor-second-btn">
                Close
              </SoftButton>
            )}
            <SoftButton className="vendor-add-btn" onClick={handleAgreeReset} autoFocus>
              {agreeLoader ? (
                <CircularProgress
                  size={24}
                  sx={{
                    color: '#fff',
                  }}
                  // className="add-customer-progress-otp"
                />
              ) : (
                <>Send OTP</>
              )}
            </SoftButton>
          </DialogActions>
        </Dialog>

        {/* UPDATE PIN */}
        <Dialog
          open={open3}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
          maxWidth="xs"
        >
          <DialogTitle id="alert-dialog-title">{'Update PIN'}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To update pin, please enter the otp send to <b> {userData.email} </b>
            </DialogContentText>
            <SoftInput
              autoFocus
              margin="dense"
              id="name"
              label="OTP"
              type="number"
              fullWidth
              variant="standard"
              onChange={(e) => setOtp(e.target.value)}
            />
            <DialogContentText>Enter new pin</DialogContentText>
            <SoftInput
              autoFocus
              margin="dense"
              id="name"
              label="New Pin"
              type="number"
              fullWidth
              variant="standard"
              onChange={(e) => setNewPin(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            {!agreeLoader ? (
              <SoftButton
                onClick={() => {
                  handleClose3(), handleCloseAction();
                }}
                className="vendor-second-btn"
              >
                Close
              </SoftButton>
            ) : (
              <SoftButton disabled className="vendor-second-btn">
                Close
              </SoftButton>
            )}
            <SoftButton className="vendor-add-btn" onClick={handleUpdatePin} autoFocus>
              {agreeLoader ? (
                <CircularProgress
                  size={24}
                  sx={{
                    color: '#fff',
                  }}
                  // className="add-customer-progress-otp"
                />
              ) : (
                <>Update</>
              )}
            </SoftButton>
          </DialogActions>
        </Dialog>

        {/* DEACTIVATE */}
        <Dialog
          open={open4}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
          maxWidth="xs"
        >
          <DialogTitle id="alert-dialog-title">{'Deactivate User'}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to deactivate user{' '}
              <b>
                {' '}
                {userData.firstName} {userData.secondName}
              </b>
              ? Once deactivated can be activated again.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            {!deactivateLoader ? (
              <SoftButton
                onClick={() => {
                  handleClose4(), handleCloseAction();
                }}
                className="vendor-second-btn"
              >
                Close
              </SoftButton>
            ) : (
              <SoftButton disabled className="vendor-second-btn">
                Close
              </SoftButton>
            )}
            <SoftButton className="vendor-add-btn" onClick={deactivateUser} autoFocus>
              {deactivateLoader ? (
                <CircularProgress
                  size={24}
                  sx={{
                    color: '#fff',
                  }}
                />
              ) : (
                <>Deactivate</>
              )}
            </SoftButton>
          </DialogActions>
        </Dialog>

        {/* Current User */}
        <Dialog
          open={open5}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
          maxWidth="xs"
        >
          <DialogTitle id="alert-dialog-title">{'Deactivate User'}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">You cannot deactivate yourself</DialogContentText>
          </DialogContent>
          <DialogActions>
            <SoftButton
              className="vendor-add-btn"
              onClick={() => {
                handleClose5(), handleCloseAction();
              }}
            >
              Close
            </SoftButton>
          </DialogActions>
        </Dialog>

        {/* Edit User */}
        {openmodel && (
          <EditUserData
            openmodel={openmodel}
            setOpenmodel={setOpenmodel}
            userData={userData}
            setUserData={setUserData}
            getAllUsers={getAllUsers}
            allUserRoles={allUserRoles}
          />
        )}

        {openDetailModal && (
          <UserDetailsByMobile
            openDetailModal={openDetailModal}
            setOpenDetailModal={setOpenDetailModal}
            userData={userData}
          />
        )}

        <Modal
          open={openmodel2}
          onClose={handleCloseModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          className="modal-pi-border"
          sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
          maxWidth="xs"
        >
          <Box
            className="pi-box-inventory"
            sx={{
              position: 'absolute',
              top: '35%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              bgcolor: 'background.paper',
              boxShadow: 24,
              width: '60vh',
              // p: 4,
              overflow: 'auto',
              maxHeight: '80vh',
            }}
          >
            <Grid container spacing={1} p={1}>
              <SoftTypography display="block" variant="button" fontWeight="bold" color="text" mb={2}>
                User Activity for {userData?.firstName + ' ' + userData?.secondName}
              </SoftTypography>
              {userLoginError !== '' && (
                <SoftTypography variant="button" color="secondary" fontWeight="regular">
                  {userLoginError}
                </SoftTypography>
              )}
              <br />
              <SoftBox style={{ marginLeft: '20px' }}>{activityLoader && <Spinner size={20} />}</SoftBox>
              <SoftBox sx={{ overflow: 'auto' }}>
                {userLoginData?.map((session, index) => (
                  <Grid item xs={12} md={12}>
                    <SoftBox
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      width={{ xs: 'max-content', sm: '100%' }}
                      marginBottom="15px"
                    >
                      <SoftBox display="flex" flexDirection="column">
                        <SoftBox height="100%" lineHeight={1.4}>
                          <SoftTypography display="block" variant="button" fontWeight="bold" color="text">
                            {session?.platform}
                          </SoftTypography>
                        </SoftBox>
                        <SoftTypography variant="button" color="secondary" fontWeight="regular">
                          {session?.issue_date ? `${session?.type} Time: ${session?.issue_date}` : ''}
                        </SoftTypography>
                        <SoftBox alignItems="center">
                          <SoftBox display="flex" flexDirection="column" gap={1} lineHeight={1}>
                            <SoftTypography variant="caption" color={isExpiredAt(session.at_expiry) ? 'red' : 'text'}>
                              {session?.at_expiry ? `Expiry At: ${session?.at_expiry}` : ''}
                            </SoftTypography>
                            <SoftTypography variant="caption" color={isExpiredRT(session.rt_expiry) ? 'red' : 'text'}>
                              {session?.rt_expiry ? `Expiry Rt: ${session?.rt_expiry}` : ''}
                            </SoftTypography>
                          </SoftBox>
                        </SoftBox>
                      </SoftBox>
                    </SoftBox>
                  </Grid>
                ))}
              </SoftBox>
            </Grid>
          </Box>
        </Modal>
      </SoftBox>
      {/* Action button */}
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
        <MenuItem key="edit" onClick={handleEdit}>
          Edit
        </MenuItem>
        <MenuItem key="edit" onClick={handleDetail}>
          Details
        </MenuItem>
        <MenuItem key="deactivate" onClick={handleUserActivity}>
          User Activity
        </MenuItem>
        <MenuItem key="deactivate" onClick={handleDeactivate}>
          Deactivate
        </MenuItem>
        <MenuItem key="resend-pin" onClick={() => handleResetPin()}>
          Update Pin
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default ActiveUserroles;
