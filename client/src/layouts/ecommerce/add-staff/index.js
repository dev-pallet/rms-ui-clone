import './add-staff.css';
import { Grid } from '@mui/material';
import { buttonStyles } from '../Common/buttonColor';
import { createStaff, getAllRoles, posUserPinGeneration } from '../../../config/Services';
import { useCookies } from 'react-cookie';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../../hooks/SnackbarProvider';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import SoftBox from 'components/SoftBox';
import SoftButton from '../../../components/SoftButton';
import SoftInput from '../../../components/SoftInput';
import SoftTypography from 'components/SoftTypography';
import TextField from '@mui/material/TextField';
import sideNavUpdate from '../../../components/Utility/sidenavupdate';

const Addstaff = ({ handleTab }) => {
  sideNavUpdate();
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();
  const [cookies, setCookie] = useCookies(['user']);
  const [allRoles, setAllRoles] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const [password, setPassword] = useState('');
  const [vertical, setVertical] = useState('bottom');
  const [horizontal, setHorizontal] = useState('right');
  const [loader, setloader] = useState(false);

  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const userRole = JSON.parse(localStorage.getItem('user_roles'));
  const [payload, setPayload] = useState({
    mobileNumber: '',
    email: '',
    firstName: '',
    secondName: '',
    profilePicture: '',
    tennatId: '',
    payload: [
      {
        // roleId: Number(rolesSel.value),
        // type: 'WMS',
        // orgId: orgId,
        // contextId: locId,
      },
    ],
  });

  const [roleArray, setRoleArray] = useState([]);

  const handleChange1 = (e) => {
    const { name, value } = e.target;
    setPayload({ ...payload, [name]: value });
  };

  const handleChange2 = (e) => {
    setPassword(e.target.value);
  };

  const contextType = localStorage.getItem('contextType');
  useEffect(() => {
    getAllRoles(contextType)
      .then((response) => {
        const modifiedArray = response.data.data.map((obj) => {
          let modifiedName = '';
          if (obj?.name === 'RETAIL_USER' || obj?.name === 'WMS_USER' || obj?.name === 'VMS_USER') {
            modifiedName = obj.name.replace(/_/g, ' ');
          } else {
            modifiedName = obj.name.replace(/_/g, ' ').replace(contextType, '');
          }
          return { id: obj.id, name: modifiedName };
        });
        setAllRoles(modifiedArray);
      })
      .catch((error) => {
        showSnackbar(error?.response?.data?.message || 'Some error occured', 'error');
      });
  }, []);

  useEffect(() => {
    if (allRoles.length != 0) {
      const roleArr = [];
      allRoles.map((e) => {
        roleArr.push({ value: e.id, label: e.name });
      });
      setRoleList(roleArr);
    }
  }, [allRoles]);

  const roleSelected = roleList.find((opt) => !!opt.value);
  const [rolesSel, setRolesSel] = useState(roleSelected);
  const isPosUserPresent = roleArray.some(
    (item) => item.label === 'POS USER' || item.label === 'POS MANAGER' || item.label === 'RMS USER',
  );

  const staffCreation = () => {
    if (payload?.mobileNumber?.length < 10) {
      showSnackbar('Valid mobile number is required', 'error');
    } else if (payload?.email === '') {
      showSnackbar('Email Id is required', 'error');
    } else if (payload?.firstName === '') {
      showSnackbar('First name is required', 'error');
    } else if (payload?.secondName === '') {
      showSnackbar('Last name is required', 'error');
    } else if (isPosUserPresent && password === '') {
      showSnackbar('Primary PIN is required', 'error');
    } else if (isPosUserPresent && password.length < 4) {
      showSnackbar('Pin should have atleast 4 digits', 'error');
    } else {
      setloader(true);
      const rolePayload = roleArray.map(function (item) {
        return { roleId: item.value, type: contextType, orgId: orgId, contextId: locId };
      });

      const PAYLOAD = {
        mobileNumber: payload?.mobileNumber,
        email: payload?.email,
        firstName: payload?.firstName,
        secondName: payload?.secondName,
        profilePicture: '',
        tennatId: '',
        payload: rolePayload,
      };

      createStaff(PAYLOAD, cookies.access_token)
        .then((res) => {
          if (isPosUserPresent) {
            const pinPayload = {
              mobile: payload?.mobileNumber,
              primaryPassword: password,
            };
            posUserPinGeneration(pinPayload)
              .then((res) => {
                showSnackbar(res.message, 'success');
                setloader(false);
                navigate('/setting-users-roles');
                handleTab(0);
              })
              .catch((err) => {
                showSnackbar(err.response.data.message, 'error');
                setloader(false);
              });
          } else {
            setloader(false);
            navigate('/setting-users-roles');
            handleTab(0);
          }
        })
        .catch((err) => {
          showSnackbar(err.response.data.message, 'error');
          setloader(false);
        });
    }
  };

  const handleCancel = () => {
    navigate('/setting-users-roles');
  };

  return (
    <>
      {/* <DashboardNavbar prevLink={true} /> */}
      {!userRole.includes('SUPER_ADMIN') && (
        <SoftBox className="new-staff-box">
          <SoftTypography className="add-staff-text">Add staff</SoftTypography>
        </SoftBox>
      )}

      {/* <SoftBox className="staff-detials-box">
        <SoftTypography className="add-staff-text">User</SoftTypography>
        <SoftTypography className="small-txt-font">
          Give staff access to your store by sending them an invitation.
        </SoftTypography>
      </SoftBox> */}

      <Grid container spacing={3}>
        <Grid item xs={12} md={12} xl={12}>
          <SoftBox className="staff-box-main">
            <SoftBox className="staff-flx-box">
              <SoftBox className="first-name-box">
                <SoftTypography className="email-txt">First Name</SoftTypography>
                <SoftInput type="text" name="firstName" value={payload?.firstName} onChange={handleChange1} required />
              </SoftBox>
              <SoftBox className="first-name-box">
                <SoftTypography className="email-txt">Last Name</SoftTypography>
                <SoftInput
                  type="text"
                  name="secondName"
                  value={payload?.secondName}
                  onChange={handleChange1}
                  required
                />
              </SoftBox>
            </SoftBox>
            <SoftBox className="staff-flx-box">
              <SoftBox className="first-name-box">
                <SoftTypography className="email-txt">Mobile Number</SoftTypography>
                <SoftInput
                  type="number"
                  name="mobileNumber"
                  value={payload?.mobileNumber}
                  onChange={handleChange1}
                  required
                />
              </SoftBox>
              <SoftBox className="first-name-box">
                <SoftTypography className="email-txt">Roles</SoftTypography>
                <Autocomplete
                  multiple
                  id="tags-standard"
                  options={roleList}
                  onChange={(event, newValue) => {
                    setRoleArray(newValue);
                  }}
                  getOptionLabel={(option) => option.label}
                  renderInput={(params) => <TextField {...params} variant="outlined" placeholder="Select roles" />}
                />
              </SoftBox>
            </SoftBox>
            <SoftTypography className="email-txt">Email</SoftTypography>
            <SoftInput type="email" name="email" value={payload?.email} onChange={handleChange1} required />
            {isPosUserPresent ? (
              <>
                <SoftTypography className="email-txt">Primary PIN</SoftTypography>
                <SoftInput
                  type="number"
                  name="primaryPassword"
                  min="4"
                  onChange={handleChange2}
                  required
                  placeholder="Enter pin of atleast 4 digit"
                />
              </>
            ) : null}
            <SoftBox mt={2} display="flex" justifyContent="space-between" gap="20px" sx={{ width: '100% !important' }}>
              <div>
                <span className="add-user-pin">
                  NOTE: To log in with a pin: add RMS USER for RMS, and add POS USER for POS
                </span>
              </div>
              <div className="add-users-btn">
                <SoftButton
                  variant={buttonStyles.outlinedColor}
                  className="cancel-btn outlined-softbutton"
                  onClick={() => handleCancel()}
                >
                  Cancel
                </SoftButton>
                <SoftButton className="send-btn" onClick={() => staffCreation()}>
                  {loader ? (
                    <CircularProgress
                      size={24}
                      sx={{
                        color: '#fff',
                      }}
                    />
                  ) : (
                    <>Add User</>
                  )}
                </SoftButton>
              </div>
            </SoftBox>
          </SoftBox>
        </Grid>
      </Grid>
    </>
  );
};
export default Addstaff;
