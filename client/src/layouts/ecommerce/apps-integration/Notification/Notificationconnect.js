import React, { useEffect, useState } from 'react';

import {
  Card,
  CircularProgress,
  Container,
  DialogActions,
  DialogContent,
  DialogContentText,
  IconButton,
  Input,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import verifyOtpFile from './HTMLEmailTemplates/verifySenderOtp.html';

import Button from '@mui/material/Button';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';

import {
  getEmailConnectedStatus,
  getWhatsAppConnected,
  postEmailTemplate,
  postWhatsappConnectV2,
  sendEmailVerifySend,
  verifySenderEmailOtp,
  verifySubUser,
  whatsAppConnect,
} from '../../../../config/Services';
import { useNavigate, useParams } from 'react-router-dom';

import { useSnackbar } from '../../../../hooks/SnackbarProvider';
import SoftButton from '../../../../components/SoftButton';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SoftBox from '../../../../components/SoftBox';
import SoftInput from '../../../../components/SoftInput';
import Spinner from '../../../../components/Spinner';
import Swal from 'sweetalert2';

const Notificationconnect = () => {
  const [email, setEmail] = useState('');
  const [open, setOpen] = React.useState(false);
  const [smsActive, setSmsActive] = useState(true);
  const [emailActive, setEmailActive] = useState(false);
  const [whatsappActive, setWhatsappActive] = useState(false);
  const [pushActive, setPushActive] = useState(false);
  const [allActions, setAllActions] = useState([]);
  const [templateFile, setTemplateFile] = useState('');
  const [preferedTemplate, setPreferedTemplate] = useState([]);
  const [templateTypes, setTemplateTypes] = useState(null);
  const [userName, setUserName] = useState('');
  const { id } = useParams();
  const [addressOpen, setAddressOpen] = useState(false);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [name, setName] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [whatsAppDialogOpen, setWhatsAppDialogOpen] = useState(false);
  const [whatsAppdialog2, setWhatsAppdialog2] = useState(false);
  const [editWhatsapp, setEditWhatsapp] = useState(false);
  const [whatsappCredentials, setWhatsappCredentials] = useState({
    bearerToken: '',
    metaAppName: '',
    metaAppId: '',
    businessAccountName: '',
    businessAccountId: '',
    whatsappBusinessAccountName: '',
    whatsappBusinessAccountId: '',
    phoneNumber: '',
    phoneNumberId: '',
    tokenExpiryDate: '',
  });
  const [whatsappLoader, setWhatsappLoader] = useState(false);
  const [whatsappLoader2, setWhatsappLoader2] = useState(false);
  const [editWhatsappCredentials, setEditWhastappCredentials] = useState(false);

  const [emailLoader, setEmailLoader] = useState(false);
  const [isEmailEditing, setIsEmailEditing] = useState(false);
  const [error, setError] = useState('');

  const [openOtp, setOpenOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpLoader, setOtpLoader] = useState(false);

  const showSnackbar = useSnackbar();

  const [resendDisabled, setResendDisabled] = useState(true);
  const [timer, setTimer] = useState(45);

  useEffect(() => {
    if (openOtp) {
      // Start the countdown when the dialog opens
      setResendDisabled(true);
      setTimer(45);
      const countdown = setInterval(() => {
        setTimer((prev) => {
          if (prev === 1) {
            clearInterval(countdown);
            setResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Cleanup on dialog close or unmount
      return () => clearInterval(countdown);
    }
  }, [openOtp]);

  const filterTemplateFile = () => {
    const filteredTemplate = allActions.find((template) => template.comActionId === id);
    if (filteredTemplate) {
      setTemplateFile(filteredTemplate.comActionName);
    }
  };

  const navigate = useNavigate();

  const orgId = localStorage.getItem('orgId');
  const clientId = localStorage.getItem('clientId');
  const clientName = localStorage.getItem('clientName');
  const username = localStorage.getItem('user_name');

  const fetchEmailConnectionStatus = async () => {
    try {
      getEmailConnectedStatus(clientId).then((res) => {
        if (res?.data?.data?.message === 'Email Connected') {
          // setIsEmailEditing(true);
          setEmailActive(true);
        }
      });
    } catch (error) {
      showSnackbar('Error: Email not Connected', 'error');
    }
  };

  const fetchWhatsappConnect = () => {
    try {
      getWhatsAppConnected(clientId).then((res) => {
        if (res?.data?.data?.clientStatus === 'SUBSCRIBED') {
          const apiData = res?.data?.data;
          setWhatsappCredentials({
            bearerToken: apiData?.bearerToken || '',
            metaAppName: apiData?.metaAppName || '',
            metaAppId: apiData?.metaAppId || '',
            businessAccountName: apiData?.businessAccountName || '',
            businessAccountId: apiData?.businessAccountId || '',
            whatsappBusinessAccountName: apiData?.whatsAppBusinessAccountName || '',
            whatsappBusinessAccountId: apiData?.whatsAppBusinessAccountID || '',
            phoneNumber: apiData?.phoneNumber?.trim() || '',
            phoneNumberId: apiData?.phoneNumberID || '',
            tokenExpiryDate: apiData?.tokenExpireDate || '',
          });
          setWhatsappActive(true);
        } else if (res?.data?.data?.clientStatus === 'UNSUBSCRIBED') {
          setWhatsappActive(false);
          setWhatsappCredentials({
            bearerToken: '',
            metaAppName: '',
            metaAppId: '',
            businessAccountName: '',
            businessAccountId: '',
            whatsappBusinessAccountName: '',
            whatsappBusinessAccountId: '',
            phoneNumber: '',
            phoneNumberId: '',
            tokenExpiryDate: '',
          });
        }
      });
    } catch (error) {
      setWhatsappActive(false);
      showSnackbar('Error: Whatsapp not Connected', 'error');
    }
  };

  useEffect(() => {
    fetchEmailConnectionStatus();
    fetchWhatsappConnect();
  }, []);

  const emailCc = localStorage.getItem('user_details');
  const obj = JSON.parse(emailCc);

  const handleClickOpen = () => {
    setOpen(true);
    // setOpenOtp(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddressClose = () => {
    setAddressOpen(false);
  };

  const handleWhatsAppClose = () => {
    setWhatsAppDialogOpen(false);
  };

  const handleWhatsApp2Close = () => {
    setEditWhastappCredentials(false);
    setWhatsAppdialog2(false);
  };

  const registerWithMeta = () => {
    const newTab = window.open('/notification/register', '_blank');
    newTab.focus();
    setWhatsAppDialogOpen(false);
  };

  const setUpWhatsApp = (type) => {
    if (type === 'edit') {
      setEditWhatsapp(true);
    } else {
      setEditWhastappCredentials(true);
      setEditWhatsapp(false);
    }
    setWhatsAppDialogOpen(false);
    setWhatsAppdialog2(true);
  };

  const generateUniqueName = (id) => {
    const timestamp = Date.now();
    return `${id.replace(/ /g, '_')}_${timestamp}`;
  };

  const handleSubscribe = () => {
    setEmailLoader(true);
    const payload = {
      templateName: generateUniqueName('sender_template'),
      clientId: clientId,
      templateType: 'EMAIL',
      userId: obj.uidx,
    };
    const filePayload = new Blob([verifyOtpFile], { type: 'text/html' });
    const templatePayload = new Blob([JSON.stringify(payload)], { type: 'application/json' });
    const formData = new FormData();
    formData.append('file', filePayload);
    formData.append('uploadTemplate', templatePayload);

    postEmailTemplate(formData)
      .then((res) => {
        const templateId = res?.data?.data?.templateId;

        const sendOtpPayload = {
          clientId: clientId,
          templateId: templateId,
          subject: 'Email Verification',
          senderName: userName,
          toEmail: email,
          toName: orgId,
          ccEmail: obj.email,
          ccName: username,
          templateType: 'EMAIL',
        };
        sendEmailVerifySend(sendOtpPayload).then((res) => {
          setEmailLoader(false);
          setOpen(false);
          setOpenOtp(true);
        });
      })
      .catch((error) => {
        showSnackbar('Unable to fetch the templateId', 'error');
      });
  };

  const handleOtpVerify = () => {
    const payload = {};
    setOtpLoader(true);
    verifySenderEmailOtp(payload, email, otp, clientId)
      .then((res) => {
        setEmailActive(true);
        setOtpLoader(false);
        setOpenOtp(false);
        // setIsEmailEditing(true);
      })
      .catch((error) => {
        setOtpLoader(false);
        showSnackbar('Please Enter valid OTP', 'error');
      });
  };

  const handleVerify = () => {
    const payload = {
      nickname: clientName,
      from_email: email,
      from_name: 'string',
      reply_to: name,
      reply_to_name: 'string',
      address: address,
      address2: 'string',
      state: 'KA',
      city: city,
      country: 'INDIA',
      zip: zipCode,
    };
    try {
      verifySubUser(payload).then((res) => {
        showSnackbar('User Verified! Please connect to the services', 'success');
        handleAddressClose();
      });
    } catch (error) {
      showSnackbar('User not Verified!', 'error');
    }
  };

  const handleSmsActive = () => {
    setSmsActive(!smsActive);
  };
  const handleWhatsAppActive = () => {
    setWhatsAppDialogOpen(true);
    // setWhatsappActive(!whatsappActive);
  };
  const handlePushActive = () => {
    setPushActive(!pushActive);
  };

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setError('Please enter a valid email address.');
    } else {
      setError('');
    }
  };

  const handleChange = (event) => {
    const value = event.target.value;
    setEmail(value);
    validateEmail(value);
  };

  const handleWhatsappChange = (e) => {
    const { name, value } = e.target;
    setWhatsappCredentials((prevCredentials) => ({
      ...prevCredentials,
      [name]: value,
    }));
  };

  const handleEditWhatsapp = (type) => {
    const payload = {
      clientId: clientId,
      clientStatus: type === 'delete' ? 'UNSUBSCRIBED' : 'SUBSCRIBED',
      bearerToken: type === 'delete' ? '' : whatsappCredentials.bearerToken,
      TokenExpireDate: whatsappCredentials.tokenExpiryDate,
      metaAppName: whatsappCredentials.metaAppName,
      metaAppId: whatsappCredentials.metaAppId,
      businessAccountName: whatsappCredentials.businessAccountName,
      businessAccountId: whatsappCredentials.businessAccountId,
      whatsAppBusinessAccountName: whatsappCredentials.whatsappBusinessAccountName,
      whatsAppBusinessAccountID: whatsappCredentials.whatsappBusinessAccountId,
      phoneNumber: whatsappCredentials.phoneNumber,
      phoneNumberID: whatsappCredentials.phoneNumberId,
      messageType: 'WHATSAPP',
      createdBy: username,
      updatedBy: type === 'edit' || type === 'delete' ? username : undefined,
    };

    // Function to call the API
    const callApi = () => {
      if (type === 'create' || type === 'edit') {
        setWhatsappLoader(true);
      } else {
        setWhatsappLoader2(true);
      }
      postWhatsappConnectV2(payload)
        .then((res) => {
          if (type === 'edit') {
            showSnackbar('WhatsApp credentials edited', 'success');
            setWhatsappActive(true);
          } else if (type === 'delete') {
            showSnackbar('WhatsApp Service unsubscribed successfully', 'success');
            setWhatsappActive(false);
          } else if (type === 'create') {
            showSnackbar('WhatsApp Service Connected', 'success');
            setWhatsappActive(true);
          }
          setEditWhastappCredentials(false);
          setWhatsappLoader(false);
          setWhatsappLoader2(false);
          fetchWhatsappConnect();
          setWhatsAppdialog2(false);
        })
        .catch((err) => {
          setWhatsappLoader(false);
          setWhatsappLoader2(false);
          showSnackbar('WhatsApp Service not Connected', 'error');
        });
    };

    if (type === 'delete') {
      // Show Swal for delete confirmation
      const newSwal = Swal.mixin({
        buttonsStyling: false,
      });

      newSwal
        .fire({
          title: 'Are you sure you want to unsubscribe from WhatsApp?',
          icon: 'info',
          showCancelButton: true,
          reverseButtons: true,
          confirmButtonText: 'Delete',
          customClass: {
            title: 'custom-swal-title',
            cancelButton: 'logout-cancel-btn',
            confirmButton: 'logout-success-btn confirm-btn',
          },
        })
        .then((result) => {
          if (result.isConfirmed) {
            callApi(); // Call API if user confirms deletion
          } else {
            setWhatsappLoader(false);
            setWhatsappLoader2(false);
          }
        });
    } else {
      callApi();
    }
  };

  const isButtonDisabled = Object.values(whatsappCredentials).some((value) => value === '');

  return (
    <DashboardLayout>
      <DashboardNavbar prevLink={true} />
      <div>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Connect to Email</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To connect to Email service you should provide your sender email and display name. Please provide the
              following to verify your email.
            </DialogContentText>

            <TextField
              required
              autoFocus
              margin="dense"
              id="name"
              label="Email Address"
              type="email"
              fullWidth
              variant="standard"
              value={email}
              onChange={handleChange}
              error={!!error}
              helperText={error}
            />

            <TextField
              required
              margin="dense"
              id="name"
              label="Display Name"
              type="UserName"
              fullWidth
              variant="standard"
              value={userName}
              onChange={() => setUserName(event.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} style={{ backgroundColor: '#D22B2B', color: 'white', padding: '10px 5px' }}>
              Cancel
            </Button>
            <Button
              onClick={handleSubscribe}
              style={{ backgroundColor: '#008000', color: 'white', padding: '10px 5px' }}
              disabled={email === '' || !isValid}
            >
              {emailLoader ? (
                <CircularProgress
                  size={18}
                  sx={{
                    color: '#fff',
                  }}
                />
              ) : isEmailEditing ? (
                <>Send Otp</>
              ) : (
                <>Send Otp</>
              )}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openOtp} onClose={() => setOpenOtp(false)}>
          <DialogTitle>Verify OTP</DialogTitle>
          <DialogContent>
            <DialogContentText>Please enter the otp received on your email to verify the email.</DialogContentText>

            <TextField
              required
              autoFocus
              margin="dense"
              id="otp"
              label="OTP"
              type="otp"
              fullWidth
              variant="standard"
              value={otp}
              onChange={(event) => setOtp(event.target.value)}
            />
            <Typography
              onClick={handleSubscribe}
              disabled={resendDisabled}
              style={{ fontSize: '13px', color: '#0562FB', textAlign: 'end' }}
            >
              {resendDisabled ? `Resend OTP in ${timer} secs` : 'Resend OTP'}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setOpenOtp(false)}
              style={{ backgroundColor: '#D22B2B', color: 'white', padding: '10px 5px' }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleOtpVerify}
              style={{ backgroundColor: '#008000', color: 'white', padding: '10px 5px' }}
              disabled={email === '' || !isValid}
            >
              {otpLoader ? (
                <CircularProgress
                  size={18}
                  sx={{
                    color: '#fff',
                  }}
                />
              ) : (
                <>Verify</>
              )}
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={addressOpen} onClose={handleAddressClose}>
          <DialogTitle>Connect to Email</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To connect to Email service you should provide your sender email and display name. Please provide the
              following to verify your email.
            </DialogContentText>

            <br />
            <label>Display Name</label>
            <Input
              required
              autoFocus
              margin="dense"
              id="name"
              label="Name"
              type="text"
              fullWidth
              variant="standard"
              value={name}
              onChange={() => setName(event.target.value)}
            />

            <br />
            <label>Email Address</label>
            <Input
              required
              margin="dense"
              id="name"
              label="Email Address"
              type="email"
              fullWidth
              variant="standard"
              value={email}
              onChange={() => setEmail(event.target.value)}
            />

            <br />
            <label>Address</label>
            <Input
              required
              margin="dense"
              id="name"
              label="Address"
              type="text"
              fullWidth
              variant="standard"
              value={address}
              onChange={() => setAddress(event.target.value)}
            />
            <br />
            <label>City</label>
            <Input
              required
              margin="dense"
              id="name"
              label="City"
              type="text"
              fullWidth
              variant="standard"
              value={city}
              onChange={() => setCity(event.target.value)}
            />
            <br />
            <label>Pin Code</label>
            <Input
              required
              margin="dense"
              id="name"
              label="Pin Code"
              type="text"
              fullWidth
              variant="standard"
              value={zipCode}
              onChange={() => setZipCode(event.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleAddressClose}>Cancel</Button>
            <Button onClick={handleVerify}>Subscribe</Button>
          </DialogActions>
        </Dialog>

        {/* whatsapp dialog box */}

        <Dialog open={whatsAppDialogOpen} onClose={handleWhatsAppClose}>
          <DialogTitle>Connect to WhatsApp</DialogTitle>
          <DialogContent>
            <DialogContentText>Communicate with customers using WhatsApp</DialogContentText>

            <img
              src="https://www.userlike.com/api/proxy/resize/whatsapp-connect/header.png?height=720"
              style={{ width: '100%', margin: '20px 0px' }}
            />
            <DialogContentText>
              To Subscribe WhatsApp Notifications you need to have a Facebook account and register as a developer to
              Create a Meta for Developers account.
            </DialogContentText>
            <DialogActions style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Button
                onClick={registerWithMeta}
                style={{ textDecoration: 'underline', fontSize: '10px', float: 'left' }}
              >
                More about whatsapp
              </Button>
              <Button
                style={{ backgroundColor: '#008000', color: 'white', padding: '10px 5px' }}
                onClick={() => setUpWhatsApp('create')}
              >
                Subscribe Now
              </Button>
            </DialogActions>
          </DialogContent>
        </Dialog>

        {/* whatsapp dialog box 2 */}

        <Dialog open={whatsAppdialog2} onClose={handleWhatsApp2Close}>
          <DialogTitle>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              Subscribe
              {editWhatsapp && <EditIcon onClick={() => setEditWhastappCredentials(true)} />}
            </div>
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              To Subscribe WhatsApp Notifications please provide the following details.
            </DialogContentText>
            <br />
            <SoftBox className="whatsapp-connect-main-box">
              <div style={{ width: '100%' }}>
                <Typography className="dynamic-copupon-form-heading">Access Token</Typography>
                <SoftInput
                  placeholder="Add bearer token"
                  value={whatsappCredentials.bearerToken}
                  name="bearerToken"
                  onChange={handleWhatsappChange}
                  disabled={!editWhatsappCredentials}
                />
              </div>
            </SoftBox>
            <SoftBox className="whatsapp-connect-main-box">
              <div style={{ width: '100%' }}>
                <Typography className="dynamic-copupon-form-heading">Meta App Name</Typography>
                <SoftInput
                  placeholder="Add meta app name"
                  value={whatsappCredentials.metaAppName}
                  name="metaAppName"
                  onChange={handleWhatsappChange}
                  disabled={!editWhatsappCredentials}
                />
              </div>
              <div style={{ width: '100%' }}>
                <Typography className="dynamic-copupon-form-heading">Meta App Id</Typography>
                <SoftInput
                  placeholder="Add meta app id"
                  value={whatsappCredentials.metaAppId}
                  name="metaAppId"
                  onChange={handleWhatsappChange}
                  disabled={!editWhatsappCredentials}
                />
              </div>
            </SoftBox>

            <SoftBox className="whatsapp-connect-main-box">
              <div style={{ width: '100%' }}>
                <Typography className="dynamic-copupon-form-heading">Business Account Name</Typography>
                <SoftInput
                  placeholder="Add bussiness account name"
                  value={whatsappCredentials.businessAccountName}
                  name="businessAccountName"
                  onChange={handleWhatsappChange}
                  disabled={!editWhatsappCredentials}
                />
              </div>
              <div style={{ width: '100%' }}>
                <Typography className="dynamic-copupon-form-heading">Business Account Id</Typography>
                <SoftInput
                  placeholder="Add business account id"
                  value={whatsappCredentials.businessAccountId}
                  name="businessAccountId"
                  onChange={handleWhatsappChange}
                  disabled={!editWhatsappCredentials}
                />
              </div>
            </SoftBox>

            <SoftBox className="whatsapp-connect-main-box">
              <div style={{ width: '100%' }}>
                <Typography className="dynamic-copupon-form-heading">Whatsapp Business Account Name</Typography>
                <SoftInput
                  placeholder="Add whatsapp bussiness account name"
                  value={whatsappCredentials.whatsappBusinessAccountName}
                  name="whatsappBusinessAccountName"
                  onChange={handleWhatsappChange}
                  disabled={!editWhatsappCredentials}
                />
              </div>
              <div style={{ width: '100%' }}>
                <Typography className="dynamic-copupon-form-heading">Whatsapp Business Account Id</Typography>
                <SoftInput
                  placeholder="Add whatsapp business account id"
                  value={whatsappCredentials.whatsappBusinessAccountId}
                  name="whatsappBusinessAccountId"
                  onChange={handleWhatsappChange}
                  disabled={!editWhatsappCredentials}
                />
              </div>
            </SoftBox>

            <SoftBox className="whatsapp-connect-main-box">
              <div style={{ width: '100%' }}>
                <Typography className="dynamic-copupon-form-heading">Phone number</Typography>
                <SoftInput
                  placeholder="Add phone number"
                  type="number"
                  value={whatsappCredentials.phoneNumber}
                  name="phoneNumber"
                  onChange={handleWhatsappChange}
                  disabled={!editWhatsappCredentials}
                />
              </div>
              <div style={{ width: '100%' }}>
                <Typography className="dynamic-copupon-form-heading">Phone number Id</Typography>
                <SoftInput
                  placeholder="Add Phone number id"
                  value={whatsappCredentials.phoneNumberId}
                  name="phoneNumberId"
                  onChange={handleWhatsappChange}
                  disabled={!editWhatsappCredentials}
                />
              </div>
            </SoftBox>

            <SoftBox className="whatsapp-connect-main-box">
              <div style={{ width: '100%' }}>
                <Typography className="dynamic-copupon-form-heading">Token Expiry date</Typography>
                <SoftInput
                  placeholder="Add token expiry date"
                  type="date"
                  value={whatsappCredentials.tokenExpiryDate}
                  name="tokenExpiryDate"
                  onChange={handleWhatsappChange}
                  disabled={!editWhatsappCredentials}
                />
              </div>
            </SoftBox>
            <DialogActions style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Button
                onClick={registerWithMeta}
                style={{ textDecoration: 'underline', fontSize: '10px', float: 'left' }}
              >
                More about whatsapp
              </Button>
              {editWhatsappCredentials && (
                <div className="grid-button-box">
                  {whatsappLoader2 ? (
                    <SoftButton className="cancel-button">
                      <CircularProgress
                        size={18}
                        sx={{
                          color: '#4077cf',
                        }}
                      />
                    </SoftButton>
                  ) : (
                    <SoftButton
                      className="cancel-button"
                      onClick={editWhatsapp ? () => handleEditWhatsapp('delete') : handleWhatsApp2Close}
                    >
                      {editWhatsapp ? 'Delete' : 'Cancel'}
                    </SoftButton>
                  )}
                  {whatsappLoader ? (
                    <SoftButton style={{ backgroundColor: '#008000', color: 'white', padding: '10px 5px' }}>
                      <CircularProgress
                        size={18}
                        sx={{
                          color: '#fff',
                        }}
                      />
                    </SoftButton>
                  ) : (
                    <SoftButton
                      onClick={() => handleEditWhatsapp(editWhatsapp ? 'edit' : 'create')}
                      style={{ backgroundColor: '#008000', color: 'white', padding: '10px 5px' }}
                      disabled={isButtonDisabled}
                    >
                      {editWhatsapp ? 'Edit' : 'Subscribe'}
                    </SoftButton>
                  )}
                </div>
              )}
            </DialogActions>
          </DialogContent>
        </Dialog>
      </div>

      <Container>
        <Card style={{ padding: '30px', marginTop: '50px' }}>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column' }}>
            <li style={{ marginBottom: '10px' }}>
              <Paper style={{ padding: '15px', display: 'flex', alignItems: 'center' }}>
                <img
                  src="https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_images/3.png"
                  style={{ height: '60px', marginRight: '10px' }}
                />
                <span>SMS</span>
                {smsActive === false ? (
                  <Button
                    style={{ marginLeft: 'auto', backgroundColor: '#4077cf', color: 'white' }}
                    onClick={handleSmsActive}
                  >
                    Connect
                  </Button>
                ) : (
                  <Button style={{ marginLeft: 'auto', backgroundColor: '#008000', color: 'white' }}>Connected</Button>
                )}
              </Paper>
            </li>
            <li style={{ marginBottom: '10px' }}>
              <Paper style={{ padding: '15px', display: 'flex', alignItems: 'center' }}>
                <img
                  src="https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_images/2.png"
                  style={{ height: '60px', marginRight: '10px' }}
                />
                <span>Email</span>
                {emailActive === false ? (
                  <Button
                    style={{ marginLeft: 'auto', backgroundColor: '#4077cf', color: 'white' }}
                    onClick={handleClickOpen}
                  >
                    Connect
                  </Button>
                ) : (
                  <>
                    <Button style={{ marginLeft: 'auto', backgroundColor: '#008000', color: 'white' }}>
                      Connected
                    </Button>
                    {isEmailEditing && (
                      <EditIcon
                        style={{ marginLeft: '10px', cursor: 'pointer' }}
                        onClick={() => {
                          handleClickOpen();
                          setIsEmailEditing(true);
                        }}
                      />
                    )}
                  </>
                )}
              </Paper>
            </li>
            <li style={{ marginBottom: '10px' }}>
              <Paper style={{ padding: '15px', display: 'flex', alignItems: 'center' }}>
                <>
                  <img
                    src="https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_images/1.png"
                    style={{ height: '60px', marginRight: '10px' }}
                  />
                  <span>Whatsapp</span>
                </>
                {whatsappActive === false ? (
                  <>
                    <Button
                      style={{ marginLeft: 'auto', backgroundColor: '#4077cf', color: 'white' }}
                      onClick={handleWhatsAppActive}
                    >
                      Connect
                    </Button>
                  </>
                ) : (
                  <div style={{ marginLeft: 'auto' }}>
                    <IconButton onClick={() => setUpWhatsApp('edit')}>
                      <VisibilityIcon style={{ color: '#4077cf' }} />
                    </IconButton>
                    <Button style={{ marginLeft: 'auto', backgroundColor: '#008000', color: 'white' }}>
                      Connected
                    </Button>
                  </div>
                )}
              </Paper>
            </li>
            <li style={{ marginBottom: '10px' }}>
              <Paper style={{ padding: '15px', display: 'flex', alignItems: 'center' }}>
                <img
                  src="https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_images/4.png"
                  style={{ height: '60px', marginRight: '10px' }}
                />
                <span>Push Notification</span>
                {pushActive === false ? (
                  <Button
                    style={{ marginLeft: 'auto', backgroundColor: '#4077cf', color: 'white' }}
                    onClick={handlePushActive}
                  >
                    Connect
                  </Button>
                ) : (
                  <Button style={{ marginLeft: 'auto', backgroundColor: '#008000', color: 'white' }}>Connected</Button>
                )}
              </Paper>
            </li>
          </ul>
        </Card>
      </Container>
      <div>
        <br />
      </div>
    </DashboardLayout>
  );
};

export default Notificationconnect;
