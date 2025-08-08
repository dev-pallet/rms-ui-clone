import './add-staff.css';
import { Grid } from '@mui/material';
import { createStaff, getAllRoles, posUserPinGeneration } from '../../../../../config/Services';
import { useEffect, useState } from 'react';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import SoftBox from 'components/SoftBox';
import SoftButton from '../../../../../components/SoftButton';
import SoftInput from '../../../../../components/SoftInput';
import SoftTypography from 'components/SoftTypography';

import * as React from 'react';
import { isSmallScreen } from '../../../Common/CommonFunction';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import MobileNavbar from '../../../../../examples/Navbars/MobileNavbar/mobile-navbar-drawer';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import TextField from '@mui/material/TextField';

const generalArray = [
  'Home',
  'Order',
  'Draft order',
  'Product',
  'Gift card',
  'Customers',
  'Report',
  'Dashboards',
  'Marketing',
  'Discount',
];

const onlineStoreArray = ['Themes', 'Blogs', 'Navigation'];

const administrationArray = [
  'Manage setting',
  'Locations',
  'Domains',
  'Edit permission',
  'External login service',
  'Revoke access token for other staff',
  'View app developed by staff and collaborators',
  'View customer events',
];

const financeArray = [
  'View billing and receive billing events',
  'View Shopify Payment payouts',
  'Manage other payment setting',
];

const AddstaffPos = () => {
  const navigate = useNavigate();
  const isMobileDevice = isSmallScreen();
  const [cookies, setCookie] = useCookies(['user']);
  const [allRoles, setAllRoles] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const [open, setOpen] = useState(false);
  const [errorHandler, setErrorHandler] = useState('');
  const [clrMsg, setClrMsg] = useState('');
  const [password, setPassword] = useState('');
  const [vertical, setVertical] = useState('bottom');
  const [horizontal, setHorizontal] = useState('right');
  const [loader, setloader] = useState(false);

  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
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
  
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

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
        const modifiedArray = response.data.data.map(obj => {
          let modifiedName = '';
          if (obj?.name === 'RETAIL_USER' || obj?.name === 'WMS_USER' || obj?.name === 'VMS_USER' ) {
            modifiedName = obj.name.replace(/_/g, ' ');
          } else {
            modifiedName = obj.name.replace(/_/g, ' ').replace(contextType, '');
          }
          return { id: obj.id, name: modifiedName };
        });
        setAllRoles(modifiedArray);
      })
      .catch((error) => {
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
  const isPosUserPresent = roleArray.some(item => item.label === 'POS USER');

  const staffCreation = () => {
    if (payload?.mobileNumber?.length < 10) {
      setErrorHandler('Valid mobile number is required');
      setClrMsg('error');
      setOpen(true);
    } else if (payload?.email === '') {
      setErrorHandler('Email Id is required');
      setClrMsg('error');
      setOpen(true);
    } else if (payload?.firstName === '') {
      setErrorHandler('First name is required');
      setClrMsg('error');
      setOpen(true);
    } else if (payload?.secondName === '') {
      setErrorHandler('Last name is required');
      setClrMsg('error');
      setOpen(true);
    } else if(isPosUserPresent && password === ''){
      setErrorHandler('Primary PIN is required');
      setClrMsg('error');
      setOpen(true);
    }else if(isPosUserPresent && password.length < 4){
      setErrorHandler('Pin should have atleast 4 digits');
      setClrMsg('error');
      setOpen(true);
    }
    else {
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
          if(isPosUserPresent){
            const pinPayload = {
              mobile: payload?.mobileNumber,
              primaryPassword: password
            };
            posUserPinGeneration(pinPayload)
              .then((res) => {
                setErrorHandler(res.message);
                setClrMsg('success');
                setOpen(true);
                setloader(false);
                navigate('/setting/users-roles');
              })
              .catch((err) => {
                setErrorHandler(err.response.data.message);
                setClrMsg('error');
                setOpen(true);
                setloader(false);
              });
          }
          else{
            setClrMsg('success');
            setOpen(true);
            setloader(false);
            navigate('/setting/users-roles');
          }
        })
        .catch((err) => {
          setErrorHandler(err.response.data.message);
          setClrMsg('error');
          setOpen(true);
          setloader(false);
        });
    }
  };

  const handleCancel = () => {
    navigate('/setting/users-roles');
  };

  return (
    <DashboardLayout>
      {!isMobileDevice && <DashboardNavbar prevLink={true} />}
      <SoftBox className="new-staff-box">
        <SoftTypography className="add-staff-text">Add staff</SoftTypography>
      </SoftBox>

      <SoftBox className={`${isMobileDevice && 'po-box-shadow'} staff-detials-box`}>
        <SoftTypography className="add-staff-text">Staff</SoftTypography>
        <SoftTypography className="small-txt-font">
          Give staff access to your store by sending them an invitation.
        </SoftTypography>
      </SoftBox>

      <Grid container spacing={3}>
        <Grid item xs={12} md={12} xl={12}>
          <SoftBox className={`${isMobileDevice && 'po-box-shadow'} staff-box-main`}>
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
          </SoftBox>
        </Grid>
        <SoftBox className="invite-box">
          <SoftButton className="cancel-btn" onClick={() => handleCancel()}>
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
              <>Add staff</>
            )}
          </SoftButton>
        </SoftBox>
      </Grid>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleCloseAlert} anchorOrigin={{ vertical, horizontal }}>
        <Alert onClose={handleCloseAlert} severity={clrMsg} sx={{ width: '100%' }}>
          {errorHandler}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
};
export default AddstaffPos;
