import { Autocomplete, Box, CircularProgress, Grid, Modal, TextField } from '@mui/material';
import { getAllRoles, profileUpdateContext, updateProfilePicture } from '../../../config/Services';
import { useSnackbar } from '../../../hooks/SnackbarProvider';
import EditIcon from '@mui/icons-material/Edit';
import React, { useEffect, useState } from 'react';
import SoftBox from '../../../components/SoftBox';
import SoftButton from '../../../components/SoftButton';
import SoftInput from '../../../components/SoftInput';
import SoftTypography from '../../../components/SoftTypography';
import UploadFileIcon from '@mui/icons-material/UploadFile';

const EditUserData = ({ openmodel, setOpenmodel, userData, setUserData, getAllUsers, allUserRoles }) => {
  const [selectedImages, setSelectedImages] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [saveLoader, setSaveLoader] = useState(false);
  const showSnackbar = useSnackbar();
  const contextType = localStorage.getItem('contextType');
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const [allRoles, setAllRoles] = useState([]);
  const [userLabel, setUserLabel] = useState([]);
  const [userValue, setUserValue] = useState([]);
  const [userWithoutContext, setUserWithoutContext] = useState([]);
  
  useEffect(() => {
    getAllRoles(contextType)
      .then((response) => {
        const modifiedArray = response.data.data.map((obj) => {
          const modifiedName = obj.name;
          return { id: obj.id, name: modifiedName };
        });
        setAllRoles(modifiedArray);
        const replaceRetailWithSpace = allUserRoles.map((role) =>
          role
        );
        
        setAllUserLabel(modifiedArray, replaceRetailWithSpace);
        // .replace(/_/g, ' ').replace(contextType + ' ', '');
      })
      .catch((error) => {});
  }, []);

  const assignUser = [];
  const assignUserLabel = [];
  const setAllUserLabel = (modifiedArray, allUserRoles) => {
    modifiedArray.map((item) => {
      const foundRole = allUserRoles.find((role) => role === item.name);
      if (foundRole) {
        assignUserLabel.push({
          value: item.id,
          label: item.name,
        });
      } else {
        assignUser.push({
          value: item.id,
          label: item.name,
        });
      }
    });
    setUserLabel(assignUserLabel);
    setUserValue(assignUser);
  };

  const handleClose = () => {
    setOpenmodel(false);
    setUserData({});
    setSelectedImages(null);
    setPreviewImage(null);
  };

  const handleUploadImage = () => {
    const formData = new FormData();
    formData.append('file', selectedImages);
    formData.append('uidx', userData.uidx);

    updateProfilePicture(formData)
      .then((res) => {
        showSnackbar('Updated Successfully ', 'success');
        getAllUsers();
        handleClose();
        setSaveLoader(false);
      })
      .catch((err) => {
        showSnackbar(err?.response?.data?.message, 'error');
        setSaveLoader(false);
      });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImages(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleSave = () => {
    setSaveLoader(true);
    const labelsArray = userLabel.map(item => item.label);
    const payload = {
      uidx: userData.uidx,
      mobileNumber: userData.mobile,
      email: userData.email,
      firstName: userData.firstName,
      secondName: userData.secondName,
      profilePicture: userData.profilePicture,
      tennatId: '1',
      roles: labelsArray,
      contextPayload: {
        type: 'RETAIL',
        orgId: orgId,
        contextId: locId,
      },
    };
    profileUpdateContext(payload, userData.uidx)
      .then((res) => {
        if(selectedImages !== null){
          handleUploadImage();
        }else{
          showSnackbar('Updated Successfully ', 'success');
          getAllUsers();
          handleClose();
          setSaveLoader(false);
        }
      })
      .catch((err) => {
        showSnackbar(err?.response?.data?.message, 'error');
        handleClose();
        setSaveLoader(false);
      });
  };

  // const handleChangeRoles = (event, newValue) => {
  //   const userlabels = [];
  //   let userValues = [...userValue];
  //   newValue.forEach((item) => {
  //     userValues = userValues.filter((val) => val.value !== item.value);

  //     userlabels.push({
  //       value: item.value,
  //       label: item.label,
  //     });
  //   });
  //   setUserLabel(userlabels);
  //   setUserValue(userValues);
  // };

  const handleChangeRoles = (event, newValue) => {
    let userValues = [...userValue];
    const userlabels = [];
  
    // Store the original indices of the roles
    const originalIndices = {};
  
    userValues.forEach((val, index) => {
      originalIndices[val.value] = index;
    });
  
    newValue.forEach((item) => {
      // Add selected roles to the labels
      userlabels.push({
        value: item.value,
        label: item.label,
      });
  
      // Remove selected roles from userValues
      userValues = userValues.filter((val) => val.value !== item.value);
    });
  
    // Find roles that are no longer selected and add them back to userValues
    const removedRoles = userLabel.filter(
      (label) => !newValue.some((item) => item.value === label.value)
    );
  
    removedRoles.forEach((role) => {
      const index = originalIndices[role.value];
      userValues.splice(index, 0, role); // Insert at the original index
    });
  
    setUserLabel(userlabels);
    setUserValue(userValues);
  };
  

  return (
    <Modal
      disableEscapeKeyDown
      hideBackdrop
      open={openmodel}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="modal-pi-border"
      //   sx={{ '& .MuiDialog-paper': { width: '100%', maxHeight: 435 } }}
      //   maxWidth="xs"
    >
      <Box
        className="pi-box-inventory"
        sx={{
          position: 'absolute',
          top: '35%',
          left: '50%',
          width: '60vh',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          overflow: 'auto',
          maxHeight: '80vh',
        }}
      >
        <Grid container spacing={1} p={1}>
          <SoftBox className="attach-file-box" mt={3}>
            {previewImage ? (
              <SoftBox className="logo-box-org-I">
                <img src={previewImage} className="logo-box-org" />
                <SoftButton
                  onClick={() => {
                    setSelectedImages(''), setPreviewImage('');
                  }}
                >
                  <EditIcon />
                </SoftButton>
              </SoftBox>
            ) : (
              <SoftBox className="add-customer-file-box-I" display="flex" gap="10px">
                {userData.profilePicture !== '' && <img src={userData.profilePicture} className="logo-box-org" />}
                <SoftBox className="profile-box-up">
                  {userData.profilePicture === '' && (
                    <SoftTypography className="add-customer-file-head">Upload Profile Picture</SoftTypography>
                  )}
                  <input
                    type="file"
                    name="file"
                    id="my-file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="my-file" className="custom-file-upload-data-I-bills">
                    <SoftTypography className="upload-text-I">
                      Upload <UploadFileIcon />{' '}
                    </SoftTypography>
                  </label>
                </SoftBox>
              </SoftBox>
            )}
          </SoftBox>
          <Grid item xs={12} md={12} xl={12}>
            <SoftBox width='100%' mb={1} ml={0.5} lineHeight={0} display="inline-block">
              <SoftTypography
                component="label"
                variant="caption"
                fontWeight="bold"
                textTransform="capitalize"
                fontSize="13px"
              >
                Fisrt Name
              </SoftTypography>
              <SoftInput type="text" name="firstName" defaultValue={userData.firstName} onChange={handleInputChange} />
            </SoftBox>
          </Grid>

          <Grid item xs={12} md={12} xl={12}>
            <SoftBox width='100%' mb={1} ml={0.5} lineHeight={0} display="inline-block">
              <SoftTypography
                component="label"
                variant="caption"
                fontWeight="bold"
                textTransform="capitalize"
                fontSize="13px"
              >
                Second Name
              </SoftTypography>
              <SoftInput type="text" name="secondName" value={userData.secondName} onChange={handleInputChange} />
            </SoftBox>
          </Grid>
          <Grid item xs={12} md={12} xl={12}>
            <SoftBox width='100%' mb={1} ml={0.5} lineHeight={0} display="inline-block">
              <SoftTypography
                component="label"
                variant="caption"
                fontWeight="bold"
                textTransform="capitalize"
                fontSize="13px"
              >
                User Roles
              </SoftTypography>
              <Autocomplete
                multiple
                id="tags-standard"
                value={userLabel}
                onChange={(event, newValue) => handleChangeRoles(event, newValue)}
                options={userValue}
                getOptionLabel={(option) => `${option.label}`}
                clearIcon={null}
                renderInput={(params) => <TextField {...params} variant="outlined" placeholder="Select roles" />}
              />
            </SoftBox>
          </Grid>
          <Grid item xs={12} md={12} xl={12}>
            <SoftBox  width='100%' mb={1} ml={0.5} lineHeight={0} display="inline-block">
              <SoftTypography
                component="label"
                variant="caption"
                fontWeight="bold"
                textTransform="capitalize"
                fontSize="13px"
              >
                Email
              </SoftTypography>
              <SoftInput type="email" name="email" value={userData.email} onChange={handleInputChange} />
            </SoftBox>
          </Grid>

          <Grid item xs={12} md={12} xl={12}>
            <SoftBox width='100%' mb={1} ml={0.5} lineHeight={0} display="inline-block">
              <SoftTypography
                component="label"
                variant="caption"
                fontWeight="bold"
                textTransform="capitalize"
                fontSize="13px"
              >
                Mobile Number
              </SoftTypography>
              <SoftInput type="number" disabled name="mobile" value={userData.mobile} onChange={handleInputChange} />
            </SoftBox>
          </Grid>

          <Grid item xs={12} md={12} xl={12}>
            <SoftBox className="header-submit-box">
              <SoftButton className="vendor-second-btn" disabled={saveLoader} onClick={() => handleClose()}>
                cancel
              </SoftButton>

              <SoftButton className="vendor-add-btn" disabled={saveLoader} onClick={() => handleSave()}>
                {saveLoader ? (
                  <CircularProgress
                    size={24}
                    sx={{
                      color: '#fff',
                    }}
                  />
                ) : (
                  <>Save</>
                )}
              </SoftButton>
            </SoftBox>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default EditUserData;
