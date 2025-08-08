import { Badge, Box, Card, Grid } from '@mui/material';
import { getDetailsDeliveryAgent, updateDeliveryAgent } from '../../../../../../config/Services';
import { useParams } from 'react-router-dom';
import { useSnackbar } from '../../../../../../hooks/SnackbarProvider';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import DashboardLayout from '../../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../../examples/Navbars/DashboardNavbar';
import DefaultLogo from '../../../../../../assets/images/default-profile-logo.jpg';
import DownloadForOfflineOutlinedIcon from '@mui/icons-material/DownloadForOfflineOutlined';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import OtherDeliveryDetails from './other-details';
import React, { useEffect, useState } from 'react';
import RecentFulfillment from './recent-fulfilment';
import RecentTransactions from './recent-transaction';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import SoftAvatar from '../../../../../../components/SoftAvatar';
import SoftBox from '../../../../../../components/SoftBox';
import SoftInput from '../../../../../../components/SoftInput';
import SoftSelect from '../../../../../../components/SoftSelect';
import SoftTypography from '../../../../../../components/SoftTypography';
import Spinner from '../../../../../../components/Spinner';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

const DeliverAgentDetails = () => {
  const { id } = useParams();
  const showSnackbar = useSnackbar();
  const [image, setImage] = useState(null);
  const [data, setData] = useState(null);
  const [agentName, setAgentName] = useState(null);
  const [panNumber, setpanNumber] = useState(null);
  const [languagesKnowList, setLanguagesKnowList] = useState(null);
  const [vehicleNumber, setVehicleNumber] = useState(null);
  const [vehicleType, setVehicleType] = useState({ value: 'Electric', label: 'Electric' });
  const [errorComing, setErrorComing] = useState(false);
  const [edit, setEdit] = useState(false);
  const [cancelEdit, setCancelEdit] = useState(false);
  const [saveLoader, setSaveLoader] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [driverLicence, setDriverLicence] = useState(null);

  const user_details = JSON.parse(localStorage.getItem('user_details'));
  const uidx = user_details.uidx;

  useEffect(() => {
    agentDetails();
  }, []);
  const agentDetails = () => {
    setSaveLoader(true);
    getDetailsDeliveryAgent(id)
      .then((res) => {
        const response = res?.data?.data;
        setSaveLoader(false);
        if (response?.es) {
          showSnackbar(response?.message, 'error');
          return ;
        } 
        setData(response?.data);
        setAgentName(response?.data?.agentName);
        setpanNumber(response?.data?.panNumber);
        setVehicleNumber(response?.data?.vehicleNumber);
        setDriverLicence(null);
        setSelectedFiles(null);
        setVehicleType({ value: response?.data?.vehicleType, label: response?.data?.vehicleType });
        showSnackbar(response?.message, 'success');
      })
      .catch((err) => {
        setSaveLoader(false);
        showSnackbar(err?.response?.data?.message || 'Some error occured', 'error');
      });
  };

  const handleOpenPDF = (url) => {
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
      })
      .catch((error) => {
        showSnackbar('Some error occured', 'error');
      });
  };

  const updatePayload = {
    agentId: data?.deliveryAgentId,
    agentName: agentName,
    updatedBy: uidx,
  };

  const handleSaveAllData = () => {
    updatePayload.vehicleType = vehicleType.value;
    updatePayload.panNumber = panNumber;
    updatePayload.vehicleNumber = vehicleNumber;
    // updatePayload.languagesKnowList= ['string'];
    if (!saveLoader) {
      handleUpdate();
    }
  };
  const handleCancelAllData = () => {
    if (!saveLoader) {
      setEdit(false);
    }
  };
  const handleFileChange = (event) => {
    setSelectedFiles(event.target.files[0]);
  };

  const handleDriverLicence = (event) => {
    const file = event.target.files[0];
    setDriverLicence(file);
  };

  const handleUpdate = () => {
    setSaveLoader(true);
    const formData = new FormData();
    formData.append(
      'updateReq',
      new Blob([JSON.stringify(updatePayload)], {
        type: 'application/json',
      }),
    );
    if (selectedFiles !== null) {
      formData.append('profilePic', selectedFiles);
    }
    if (driverLicence !== null) {
      formData.append('drivingLicense', driverLicence);
    }

    updateDeliveryAgent(formData)
      .then((res) => {
        setEdit(false);
        setSaveLoader(false);
        const response = res?.data?.data;
        if (response?.es) {
          showSnackbar(response?.message, 'error');
          return;
        } 
        setDriverLicence(null);
        setSelectedFiles(null);
        showSnackbar(response?.message, 'success');
        agentDetails();
      })
      .catch((err) => {
        showSnackbar(err?.response?.data?.message || 'Some error occured', 'error');
        setSaveLoader(false);
      });
  };
  return (
    <DashboardLayout>
      <DashboardNavbar prevLink={true} />
      <SoftBox>
        <SoftBox
          className="blue-col"
          sx={{
            backgroundImage: `url(${'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRT-mpzONNdRWtZ7NKdkLlqTI3lP_IPWtLIUA&usqp=CAU'})`,
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
            py: 2,
            px: 2,
          }}
        >
          {edit ? (
            <Grid alignItems="center" container>
              <label variant="body2">
                <Badge
                  color="secondary"
                  className="pencil-icon"
                  badgeContent={<ModeEditIcon sx={{ fontSize: '5px' }} />}
                />
                <input
                  type="file"
                  name="images"
                  onChange={handleFileChange}
                  multiple
                  accept="image/png ,image/jpeg, image/webp"
                />
              </label>
              <SoftAvatar
                src={selectedFiles === null ? data?.profilePicBlobLink || DefaultLogo : selectedFiles}
                alt=""
                variant="rounded"
                size="xl"
                shadow="sm"
              ></SoftAvatar>
            </Grid>
          ) : (
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={1} lg={1}>
                <Box className="vendor-logo">
                  {/* <Badge
                      color="secondary"
                      className="pencil-icon"
                      id="vendor-logo-edit-badge"
                      style={{ cursor: 'pointer' }}
                      badgeContent={<ModeEditIcon sx={{ fontSize: '5px' }} />}
                      //   onClick={handleOpenModal}
                    /> */}
                  <SoftAvatar
                    src={data?.profilePicBlobLink !== null ? data?.profilePicBlobLink : DefaultLogo}
                    alt=""
                    variant="rounded"
                    size="xl"
                    shadow="sm"
                  />
                </Box>
              </Grid>
            </Grid>
          )}
        </Card>
      </SoftBox>
      {saveLoader && <Spinner size={20} />}
      <SoftBox mt={5} mb={3}>
        <Grid container spacing={1}>
          <Grid item xs={12} md={5} xl={5}>
            <Card sx={{ overflow: 'visible' }}>
              <SoftBox pt={1.5} pb={2} px={2} lineHeight={1.25}>
                <SoftBox mb={2} display="flex" justifyContent="space-between" alignItems="center">
                  <SoftTypography variant="caption" fontWeight="bold" fontSize="15px">
                    Delivery Agent information
                  </SoftTypography>
                  {edit ? (
                    <SoftBox display="flex" justifyContent="space-between" alignItems="center" gap="10px">
                      <SaveOutlinedIcon color="success" cursor="pointer" onClick={handleSaveAllData} />
                      <CancelOutlinedIcon color="error" cursor="pointer" onClick={handleCancelAllData} />
                    </SoftBox>
                  ) : (
                    <SoftBox>
                      <CreateOutlinedIcon cursor="pointer" color='info' onClick={() => setEdit(true)} />
                    </SoftBox>
                  )}
                </SoftBox>
                <SoftBox display="flex" py={1} mb={0.25}>
                  <SoftBox width="60%">
                    <SoftTypography variant="button" fontWeight="regular" color="text">
                      Contact Name
                    </SoftTypography>
                  </SoftBox>
                  <SoftBox width="60%" ml={1.5}>
                    {edit ? (
                      <SoftInput type="text" value={agentName} onChange={(e) => setAgentName(e.target.value)} />
                    ) : (
                      <SoftTypography variant="button" fontWeight="regular" color="text">
                        {agentName || 'NA'}
                      </SoftTypography>
                    )}
                  </SoftBox>
                </SoftBox>
                <SoftBox display="flex" py={1} mb={0.25}>
                  <SoftBox width="60%">
                    <SoftTypography variant="button" fontWeight="regular" color="text">
                      Gender
                    </SoftTypography>
                  </SoftBox>
                  <SoftBox width="60%" ml={1.5}>
                    <SoftTypography variant="button" fontWeight="regular" color="text">
                      {data?.gender || 'NA'}
                    </SoftTypography>
                  </SoftBox>
                </SoftBox>
                <SoftBox display="flex" py={1} mb={0.25}>
                  <SoftBox width="60%">
                    <SoftTypography variant="button" fontWeight="regular" color="text">
                      Mobile Number
                    </SoftTypography>
                  </SoftBox>
                  <SoftBox width="60%" ml={1.5}>
                    <SoftTypography variant="button" fontWeight="regular" color="text">
                      {data?.contactDetails[0]?.phoneNo || 'NA'}
                    </SoftTypography>
                  </SoftBox>
                </SoftBox>
                <SoftBox display="flex" py={1} mb={1}>
                  <SoftBox width="60%">
                    <SoftTypography variant="button" fontWeight="regular" color="text">
                      Email
                    </SoftTypography>
                  </SoftBox>
                  <SoftBox width="60%" ml={1.5} overflow="hidden">
                    <SoftTypography variant="button" fontWeight="regular" color="text">
                      {data?.contactDetails[0]?.email || 'NA'}
                    </SoftTypography>
                  </SoftBox>
                </SoftBox>
                <SoftBox display="flex" py={1} mb={1}>
                  <SoftBox width="60%">
                    <SoftTypography variant="button" fontWeight="regular" color="text">
                      Aadhar Number
                    </SoftTypography>
                  </SoftBox>
                  <SoftBox width="60%" ml={1.5} overflow="hidden">
                    <SoftTypography variant="button" fontWeight="regular" color="text">
                      {data?.aadharNumber || 'NA'}
                    </SoftTypography>
                  </SoftBox>
                </SoftBox>
                <SoftBox display="flex" py={1} mb={1}>
                  <SoftBox width="60%">
                    <SoftTypography variant="button" fontWeight="regular" color="text">
                      PAN Number
                    </SoftTypography>
                  </SoftBox>
                  <SoftBox width="60%" ml={1.5} overflow="hidden">
                    {edit ? (
                      <SoftInput type="text" value={panNumber} onChange={(e) => setpanNumber(e.target.value)} />
                    ) : (
                      <SoftTypography variant="button" fontWeight="regular" color="text">
                        {data?.panNumber || 'NA'}
                      </SoftTypography>
                    )}
                  </SoftBox>
                </SoftBox>
                <SoftBox display="flex" py={1} mb={1}>
                  <SoftBox width="60%">
                    <SoftTypography variant="button" fontWeight="regular" color="text">
                      City
                    </SoftTypography>
                  </SoftBox>
                  <SoftBox width="60%" ml={1.5}>
                    <SoftTypography variant="button" fontWeight="regular" color="text">
                      {data?.addressDetails[0]?.city || 'NA'}
                    </SoftTypography>
                  </SoftBox>
                </SoftBox>
                <SoftBox display="flex" py={1} mb={1}>
                  <SoftBox width="60%">
                    <SoftTypography variant="button" fontWeight="regular" color="text">
                      Language
                    </SoftTypography>
                  </SoftBox>
                  <SoftBox width="60%" ml={1.5}>
                    <SoftTypography variant="button" fontWeight="regular" color="text">
                      {data?.languagesKnowList?.join(', ') || 'NA'}
                    </SoftTypography>
                  </SoftBox>
                </SoftBox>
                <SoftBox display="flex" py={1} mb={1}>
                  <SoftBox width="60%">
                    <SoftTypography variant="button" fontWeight="regular" color="text">
                      Vehicle Number
                    </SoftTypography>
                  </SoftBox>
                  <SoftBox width="60%" ml={1.5}>
                    {edit ? (
                      <SoftInput value={vehicleNumber} onChange={(e) => setVehicleNumber(e.target.value)} />
                    ) : (
                      <SoftTypography variant="button" fontWeight="regular" color="text">
                        {data?.vehicleNumber || 'NA'}
                      </SoftTypography>
                    )}
                  </SoftBox>
                </SoftBox>
                <SoftBox display="flex" py={1} mb={1}>
                  <SoftBox width="60%">
                    <SoftTypography variant="button" fontWeight="regular" color="text">
                      Vehicle Type
                    </SoftTypography>
                  </SoftBox>
                  <SoftBox width="60%" ml={1.5}>
                    {edit ? (
                      <SoftSelect
                        defaultValue={{ value: 'Electric', label: 'Electric' }}
                        value={vehicleType}
                        onChange={(option) => setVehicleType(option)}
                        options={[
                          { value: 'Electric', label: 'Electric' },
                          { value: 'Others', label: 'Others' },
                        ]}
                      />
                    ) : (
                      <SoftTypography variant="button" fontWeight="regular" color="text">
                        {data?.vehicleType || 'NA'}
                      </SoftTypography>
                    )}
                  </SoftBox>
                </SoftBox>
                <SoftBox display="flex" py={1} mb={1}>
                  <SoftBox width="60%">
                    <SoftTypography variant="button" fontWeight="regular" color="text">
                      Licence Number
                    </SoftTypography>
                  </SoftBox>
                  <SoftBox width="60%" ml={1.5}>
                    <SoftTypography variant="button" fontWeight="regular" color="text">
                      {data?.drivingLicenseNumber || 'NA'}
                    </SoftTypography>
                  </SoftBox>
                </SoftBox>
                <SoftBox display="flex" py={1} mb={1}>
                  <SoftBox width="60%">
                    <SoftTypography variant="button" fontWeight="regular" color="text">
                      Licence Exp. Date
                    </SoftTypography>
                  </SoftBox>
                  <SoftBox width="60%" ml={1.5}>
                    <SoftTypography variant="button" fontWeight="regular" color="text">
                      {data?.licenseExpiryOn || 'NA'}
                    </SoftTypography>
                  </SoftBox>
                </SoftBox>
                <SoftBox display="flex" py={1}>
                  <SoftBox width="60%">
                    <SoftTypography variant="button" fontWeight="regular" color="text">
                      Driver Licence
                    </SoftTypography>
                  </SoftBox>
                  <SoftBox width="60%" ml={1.5}>
                    {edit ? (
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
                          src={driverLicence === null ? data?.drivingLicenseBlobLin || DefaultLogo : driverLicence}
                          alt=""
                          variant="rounded"
                          size="xl"
                          shadow="sm"
                        ></SoftAvatar>
                      </Grid>
                    ) : data?.drivingLicenseBlobLin ? (
                      <SoftBox pb={2} mt={1} display="flex" gap="20px" alignItems="center">
                        <div onClick={() => handleOpenPDF(data?.drivingLicenseBlobLin)}>
                          <VisibilityOutlinedIcon color="success" sx={{ fontSize: '15px', cursor:'pointer' }} />
                        </div>
                        <a href={data?.drivingLicenseBlobLin}>
                          <DownloadForOfflineOutlinedIcon color="info" cursor='pointer'/>
                        </a>
                      </SoftBox>
                    ) : (
                      <SoftTypography variant="button" fontWeight="regular" color="text">
                        NA
                      </SoftTypography>
                    )}
                  </SoftBox>
                </SoftBox>
              </SoftBox>
            </Card>
          </Grid>
          <Grid item xs={12} md={7} xl={7} className="overview-other-details">
            <OtherDeliveryDetails />
            {errorComing && (
              <>
                {' '}
                <RecentTransactions />
                <RecentFulfillment />
              </>
            )}
          </Grid>
        </Grid>
      </SoftBox>
    </DashboardLayout>
  );
};

export default DeliverAgentDetails;
