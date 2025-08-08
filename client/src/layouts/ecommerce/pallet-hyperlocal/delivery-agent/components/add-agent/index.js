import { Badge, Box, Card, Grid, InputLabel } from '@mui/material';
import { getAllOrgUsers, getUserFromUidx, registerDeliveryAgent } from '../../../../../../config/Services';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../../../../../hooks/SnackbarProvider';
import DashboardLayout from '../../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../../examples/Navbars/DashboardNavbar';
import DefaultLogo from '../../../../../../assets/images/default-profile-logo.jpg';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import React, { useEffect, useState } from 'react';
import SoftAvatar from '../../../../../../components/SoftAvatar';
import SoftBox from '../../../../../../components/SoftBox';
import SoftButton from '../../../../../../components/SoftButton';
import SoftInput from '../../../../../../components/SoftInput';
import SoftSelect from '../../../../../../components/SoftSelect';
import SoftTypography from '../../../../../../components/SoftTypography';

const AddDeliveryAgent = () => {
  const showSnackbar = useSnackbar();
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [driverLicence, setDriverLicence] = useState(null);
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [mobileNum, setMobileNum] = useState('');
  const [email, setEmail] = useState('');
  const [aadharNum, setAadharNum] = useState('');
  const [panNum, setPanNum] = useState('');
  const [city, setCity] = useState('');
  const [languages, setLanguages] = useState('');
  const [vehicleNum, setVehicleNum] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [licenseNum, setLicenseNum] = useState('');
  const [licenseExp, setLicenseExp] = useState('');
  const [userSelected, setUserSelected] = useState(false);
  const [userUidx, setUserUidx] = useState('');
  const [userOptions, setUserOtions] = useState([]);

  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const user_details = JSON.parse(localStorage.getItem('user_details'));
  const uidx = user_details.uidx;
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    setSelectedFiles(event.target.files[0]);
  };

  const handleDriverLicence = (event) => {
    const file = event.target.files[0];
    setDriverLicence(file);
  };

  const handleLanguage = (e) => {
    const lang = [];
    e.map((item) => {
      lang.push(item.value);
    });
    setLanguages(lang);
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  let dataArr,
    dataRow = [];
  const getAllUsers = () => {
    const payload = {
      orgId: orgId,
      contextId: locId,
    };
    getAllOrgUsers(payload)
      .then((response) => {
        dataArr = response?.data?.data;
        const deliveryAgents = response?.data?.data.filter((user) => user?.roles?.includes('DELIVERY_AGENT'));

        const options = deliveryAgents.map((agent) => ({
          label: `${agent.firstName} ${agent.secondName}`,
          value: agent.uidx,
        }));
        if (options.length === 0) {
          showSnackbar('No user found for delivery agent role', 'error');
        } else {
          setUserOtions(options);
        }
      })
      .catch((err) => {
        showSnackbar(err?.response?.data?.message, 'error');
      });
  };

  const handleSelectUser = (options) => {
    getUserFromUidx(options.value)
      .then((res) => {
        const response = res?.data?.data;
        setName(response?.firstName + ' ' + response?.secondName);
        setEmail(response?.email);
        setMobileNum(response?.mobileNumber);
        setUserUidx(response?.uidx);
        setUserSelected(true);
      })
      .catch((err) => {
        showSnackbar(err?.response?.data?.message || 'Some error occured', 'error');
      });
  };

  const handleSave = () => {
    if (!userSelected) {
      showSnackbar('Select User', 'error');
    } else if (!name || !gender || !mobileNum || !email || !city || !licenseExp || !vehicleNum || !licenseNum) {
      showSnackbar('Enter all the mandetory fields', 'warning');
    } else {
      if (mobileNum.length !== 10) {
        showSnackbar('The mobile number must contain exactly 10 digits', 'warning');
      } else if (aadharNum !== '' && aadharNum.length !== 12) {
        showSnackbar('The aadhar number must contain exactly 12 digits', 'warning');
      } else if (panNum !== '' && panNum.length !== 10) {
        showSnackbar('The pan number must contain exactly 10 digits', 'warning');
      } else {
        const payload = {
          agentName: name,
          uidx: userUidx,
          orgId: orgId,
          locId: locId,
          contactDetails: [
            {
              contactName: name,
              phoneNo: mobileNum,
              email: email,
              createdBy: uidx,
            },
          ],
          addressDetails: [
            {
              city: city,
              createdBy: uidx,
            },
          ],
          aadharNumber: aadharNum,
          vehicleType: vehicleType,
          drivingLicense: licenseNum,
          licenseExpiryDate: licenseExp,
          vehicleNumber: vehicleNum,
          gender: gender,
          panNumber: panNum,
          languagesKnowList: languages,
        };
        const formData = new FormData();
        formData.append(
          'registerDeliveryAgent',
          new Blob([JSON.stringify(payload)], {
            type: 'application/json',
          }),
        );
        if (selectedFiles !== null) {
          formData.append('profilePic', selectedFiles);
        }
        if (driverLicence !== null) {
          formData.append('drivingLicense', driverLicence);
        }

        registerDeliveryAgent(formData)
          .then((res) => {
            if (res?.data?.data?.es) {
              showSnackbar(res?.data?.data?.message, 'error');
              return;
            }
            showSnackbar(res?.data?.data?.message, 'success');
            navigate('/pallet-hyperlocal/delivery-agent');
          })
          .catch((err) => {
            showSnackbar(err?.response?.data?.message || 'Some error occured', 'error');
          });
      }
    }
  };

 

  const handleCancel = () => {
    navigate('/pallet-hyperlocal/delivery-agent');
  };

  return (
    <DashboardLayout>
      <DashboardNavbar prevLink={true} />
      <SoftBox
        className="bg-u"
        display="flex"
        justifyContent="flex-start"
        position="relative"
        // minHeight="6.7rem"
        borderRadius="xl"
        sx={{
          backgroundImage: `url(${'https://i.postimg.cc/hvjSRvvW/pngtree-simple-light-blue-background-image-396574.jpg'})`,
        }}
      />
      <Card
        sx={{
          backdropFilter: 'saturate(200%) blur(30px)',
          backgroundColor: ({ functions: { rgba }, palette: { white } }) => rgba(white.main, 0.8),
          boxShadow: ({ boxShadows: { navbarBoxShadow } }) => navbarBoxShadow,
          position: 'relative',
          mt: -8,
          mx: 3,
          p: 3,
        }}
      >
        <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
          <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>Driver Image</InputLabel>
        </SoftBox>
        <Grid alignItems="center" container>
          <label variant="body2">
            <Badge color="secondary" className="pencil-icon" badgeContent={<ModeEditIcon sx={{ fontSize: '5px' }} />} />
            <input
              type="file"
              name="images"
              onChange={handleFileChange}
              multiple
              accept="image/png ,image/jpeg, image/webp"
            />
          </label>
          <SoftAvatar
            src={selectedFiles === null ? DefaultLogo : selectedFiles}
            alt=""
            variant="rounded"
            size="xl"
            shadow="sm"
          ></SoftAvatar>
        </Grid>
      </Card>
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12} lg={12} mt={3}>
            <SoftBox p={3} className="add-customer-other-details-box">
              <SoftBox>
                <SoftTypography variant="h5" fontWeight="bold">
                  Agent Information
                </SoftTypography>
              </SoftBox>
              <Grid container spacing={3} mt={1}>
                <Grid item xs={12} md={6} lg={6}>
                  <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                    <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                      Select User
                    </InputLabel>
                  </SoftBox>
                  <SoftSelect options={userOptions} onChange={(option) => handleSelectUser(option)} />
                </Grid>
                <Grid item xs={12} md={6} lg={6}></Grid>
                <Grid item xs={12} md={6} lg={6}>
                  <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                    <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                      Full Name
                    </InputLabel>
                  </SoftBox>
                  <SoftInput type="text" value={name} disabled onChange={(e) => setName(e.target.value)} />
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                  <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                    <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                      Gender
                    </InputLabel>
                  </SoftBox>
                  <SoftSelect
                    onChange={(option) => setGender(option.value)}
                    options={[
                      { value: 'MALE', label: 'Male' },
                      { value: 'FEMALE', label: 'Female' },
                      { value: 'OTHERS', label: 'Others' },
                    ]}
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                  <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                    <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                      Mobile Number
                    </InputLabel>
                  </SoftBox>
                  <SoftInput type="number" value={mobileNum} disabled onChange={(e) => setMobileNum(e.target.value)} />
                  {mobileNum?.length !== 10 && (
                    <span style={{ color: 'red', fontSize: '11px' }}>
                      The mobile number must contain exactly 10 digits.
                    </span>
                  )}
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                  <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                    <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                      Email
                    </InputLabel>
                  </SoftBox>
                  <SoftInput type="email" disabled value={email} onChange={(e) => setEmail(e.target.value)} />
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                  <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                    <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                      Aadhar Number
                    </InputLabel>
                  </SoftBox>
                  <SoftInput type="number" onChange={(e) => setAadharNum(e.target.value)} />
                  {aadharNum?.length !== 12 && aadharNum !== '' && (
                    <span style={{ color: 'red', fontSize: '11px' }}>
                      The aadhar number must contain exactly 12 digits.
                    </span>
                  )}
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                  <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                    <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                      PAN Number
                    </InputLabel>
                  </SoftBox>
                  <SoftInput type="text" onChange={(e) => setPanNum(e.target.value)} />
                  {panNum?.length !== 10 && panNum !== '' && (
                    <span style={{ color: 'red', fontSize: '11px' }}>
                      The pan number must contain exactly 10 digits.
                    </span>
                  )}
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                  <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                    <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                      City
                    </InputLabel>
                  </SoftBox>
                  <SoftInput type="text" onChange={(e) => setCity(e.target.value)} />
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                  <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                    <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                      Languages
                    </InputLabel>
                  </SoftBox>
                  <SoftSelect
                    placeholder="Select"
                    isMulti
                    onChange={(e) => handleLanguage(e)}
                    options={[
                      { value: 'ENGLISH', label: 'English' },
                      { value: 'HINDI', label: 'Hindi' },
                      // { value: 'OTHER', label: 'Others' },
                    ]}
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                  <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                    <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                      Vehicle Number
                    </InputLabel>
                  </SoftBox>
                  <SoftInput type="text" onChange={(e) => setVehicleNum(e.target.value)} />
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                  <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                    <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                      Two Wheeler Type
                    </InputLabel>
                  </SoftBox>
                  <SoftSelect
                    onChange={(option) => setVehicleType(option.value)}
                    options={[
                      { value: 'Electric', label: 'Electric' },
                      { value: 'Others', label: 'Others' },
                    ]}
                  />
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                  <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                    <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                      License Number
                    </InputLabel>
                  </SoftBox>
                  <SoftInput type="text" onChange={(e) => setLicenseNum(e.target.value)} />
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                  <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                    <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                      License Expiry Date
                    </InputLabel>
                  </SoftBox>
                  <SoftInput type="date" onChange={(e) => setLicenseExp(e.target.value)} />
                </Grid>
              </Grid>
            </SoftBox>
            <Grid item xs={12} md={6} lg={6} mt={3}>
              <Card className="add-vendor-other-details">
                <SoftBox className="AddVendorInp5">
                  <Grid item xs={12} md={6} lg={6}>
                    <SoftBox mb={1} ml={0.5} lineHeight={0} display="inline-block">
                      <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                        Driver License
                      </InputLabel>
                    </SoftBox>
                    <Grid alignItems="center" container>
                      <label variant="body2" htmlFor="my-file">
                        <Badge
                          color="secondary"
                          className="pencil-icon"
                          badgeContent={<ModeEditIcon sx={{ fontSize: '5px' }} />}
                        />
                        <input type="file" name="file" id="my-file" onChange={handleDriverLicence} />
                      </label>
                      <SoftAvatar
                        src={driverLicence === null ? DefaultLogo : driverLicence}
                        alt=""
                        variant="rounded"
                        size="xl"
                        shadow="sm"
                      ></SoftAvatar>
                    </Grid>
                  </Grid>
                </SoftBox>
              </Card>
            </Grid>
          </Grid>

          <Grid container justifyContent="flex-end" marginBottom="20px">
            <SoftBox className="form-button-customer" style={{ display: 'flex', gap: '12px' }}>
              <SoftButton className="vendor-second-btn" onClick={handleCancel}>
                Cancel
              </SoftButton>
              <SoftButton className="vendor-add-btn" onClick={handleSave}>
                Save
              </SoftButton>
            </SoftBox>
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  );
};

export default AddDeliveryAgent;
