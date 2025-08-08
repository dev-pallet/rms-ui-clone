import { Badge, Box, Card, Grid, InputLabel } from '@mui/material';
import React, { useState } from 'react';
import SoftAvatar from '../../../../../../components/SoftAvatar';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import SoftInput from '../../../../../../components/SoftInput';
import SoftBox from '../../../../../../components/SoftBox';
import ModalComponent from './ModalComponent';
import '../../../hrms.css';
import { uploadPhoto } from '../../../../../../config/Services';
import { useSnackbar } from '../../../../../../hooks/SnackbarProvider';

function AddEmployeeDescription({ name, setName, nickName, setNickName, age, setAge, photoUrl, setPhotoUrl }) {
  const [open, setOpen] = useState(false);
  const handleOpenModal = () => {
    setOpen(true);
  };
  const showSnackbar = useSnackbar();

  const inputLabelStyle = { fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' };

  const handleImageUpload = (event) => {
    const imageFile = event.target.files[0];

    if (!imageFile) {
      showSnackbar('No file selected.');
      return;
    }
    showSnackbar('Image is uploading...', 'info', '', '', '', '', '', true);

    const reader = new FileReader();

    reader.readAsDataURL(imageFile);

    reader.onload = () => {
      const base64String = reader.result.split(',')[1];
      const uploadPhotoPayload = {
        uploadType: imageFile.type,
        files: {
          file: base64String,
        },
      };

      uploadPhoto(uploadPhotoPayload)
        .then((response) => {
          const fileUrl = response?.data?.data?.data?.file;
          if (fileUrl) {
            setPhotoUrl(fileUrl);
            showSnackbar('File uploaded successfully!', 'success');
          } else {
            showSnackbar('Upload failed: File URL not received.', 'error');
          }
        })
        .catch((err) => {
          if (err?.code === 'ERR_NETWORK') {
            showSnackbar('Network Error: Please check your internet connection.', 'error');
          } else if (err?.response) {
            showSnackbar(err?.response.data?.message || 'Server error occurred during upload.', 'error');
          } else if (err?.request) {
            showSnackbar('No response from server. Please try again later.', 'error');
          } else {
            showSnackbar(err?.message || 'An unexpected error occurred.', 'error');
          }
        });
    };
  };

  const handleModalSave = () => {
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
    setPhotoUrl('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    switch (name) {
      case 'name':
        setName(value);
        break;
      case 'nickName':
        setNickName(value);
        break;
      case 'age':
        setAge(+value);
        break;
      default:
        break;
    }
  };

  const contactFields = [
    { id: 'name', label: 'Name', type: 'input' },
    { id: 'nickName', label: 'Nick Name', type: 'input' },
    { id: 'age', label: 'Age', type: 'input' },
  ];

  return (
    <Card sx={{ padding: '15px', overflow: 'visible' }}>
      <SoftBox sx={{ flexGrow: 1, marginLeft: '20px' }}>
        <InputLabel style={{ fontWeight: 'bold' }}>Basic Details</InputLabel>
        <SoftBox
          sx={{
            display: 'flex',
            flexGrow: 1,
            gap: '20px',
            marginTop: '10px',
            flexWrap: {
              xs: 'wrap',
              sm: 'nowrap',
            },
          }}
        >
          <Box
            style={{ position: 'relative', backgroundColor: '#f0f3f3', marginTop: '29px' }}
            width={'2in'}
            height={'2in'}
            flexShrink={0}
          >
            <SoftAvatar
              src={photoUrl}
              alt="Passport Photo"
              variant="square"
              size="xxl"
              shadow="sm"
              className="custom-soft-avatar"
            />
            <Badge
              color="secondary"
              style={{ position: 'absolute', top: '0', right: '0', cursor: 'pointer' }}
              badgeContent={<ModeEditIcon sx={{ fontSize: '5px' }} />}
              onClick={handleOpenModal}
            />
          </Box>

          <Grid container mt={1} spacing={2} direction="row" justifyContent="space-between" alignItems="center">
            {contactFields?.map((field, index) => (
              <Grid item xs={12} md={12} lg={12} key={index}>
                <SoftBox>
                  <InputLabel sx={inputLabelStyle} required={field.id == 'name' ? true : false}>
                    {field?.label}
                  </InputLabel>
                  <SoftInput
                    name={field?.id}
                    onChange={handleChange}
                    value={field?.id === 'name' ? name : field?.id === 'nickName' ? nickName : age}
                    className="select-box-category"
                    size="small"
                  />
                </SoftBox>
              </Grid>
            ))}
          </Grid>
        </SoftBox>

        {/* Modal section */}

        <ModalComponent
          photoUrl={photoUrl}
          open={open}
          handleImageUpload={handleImageUpload}
          handleClose={handleClose}
          handleModalSave={handleModalSave}
        />
      </SoftBox>
    </Card>
  );
}

export default AddEmployeeDescription;
