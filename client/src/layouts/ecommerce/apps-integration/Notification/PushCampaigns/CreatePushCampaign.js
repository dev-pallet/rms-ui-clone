import Picker from '@emoji-mart/react';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import { Box, Grid, Typography } from '@mui/material';
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SoftBox from '../../../../../components/SoftBox';
import SoftButton from '../../../../../components/SoftButton';
import SoftInput from '../../../../../components/SoftInput';
import { pushBulkTemplateCreation } from '../../../../../config/Services';
import DashboardLayout from '../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../examples/Navbars/DashboardNavbar';
import { useSnackbar } from '../../../../../hooks/SnackbarProvider';
import './pushCampaigns.css';
import data from '@emoji-mart/data';

const CreatePushCampaign = () => {
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationText, setNotificationText] = useState('');
  const [templateName, setTemplateName] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);

  const [contactCSVFile, setContactCSVFile] = useState('');
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const clientId = localStorage.getItem('clientId');
  const showSnackbar = useSnackbar();

  const handleCheckboxChange = (event) => {
    setIsCheckboxChecked(event.target.checked);
  };

  const handleFileChange = (event) => {
    setContactCSVFile(event.target.files[0]);
  };

  const handleInputChange = (event) => {
    let text = event.target.value;
    text = text.replace(/\n/g, '\n');
    setNotificationText(text);
    setCursorPosition(event.target.selectionStart);
  };

  const handleEmojiSelect = (emoji) => {
    const newText = notificationText.slice(0, cursorPosition) + emoji.native + notificationText.slice(cursorPosition);
    setNotificationText(newText);
    setCursorPosition(cursorPosition + emoji.native.length);
    setShowEmojiPicker(false);
  };

  const convertNewlines = (text) => {
    return text.replace(/\\n/g, '\n');
  };

  const handleCreateTemplate = () => {
    const payload = {
      templateName: templateName,
      templateFormat: convertNewlines(notificationText),
      clientId: clientId,
      templateType: 'PUSH',
      userId: '',
      dltTemplateId: '',
      airtelMsgType: '',
    };

    try {
      pushBulkTemplateCreation(payload).then((res) => {
        showSnackbar('Template Created Successfully', 'success');
        navigate('/campaigns/templates/list/push');
      });
    } catch (error) {
      showSnackbar('Push Campaign Template not Created', 'error');
    }
  };

  const displayedText = notificationText.replace(/\\n/g, '\n');

  const StyledTextComponent = ({ bodyText }) => {
    // Split bodyText by \\n
    const parts = bodyText.split(/\\n|\n/);

    return (
      <div>
        {parts.map((part, index) => (
          // Render each part with a line break
          <React.Fragment key={index}>
            {index !== 0 && <br />} {/* Add a line break except for the first part */}
            <span>{part}</span>
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div>
      <DashboardLayout>
        <DashboardNavbar prevLink={true} />
        <Box
          className="table-css-fix-box-scroll-vend"
          style={{
            boxShadow: 'rgba(37, 37, 37, 0.126) 0px 5px 50px',
            position: 'relative',
            padding: '20px',
          }}
        >
          <div style={{ display: 'flex', gap: '10px' }}>
            <Typography>Push Notification Template Set up</Typography>
          </div>
          <SoftBox
            py={0}
            px={0}
            sx={{
              marginTop: '1rem',
            }}
          >
            <Grid container spacing={4}>
              <Grid item lg={8} sm={12} md={6} xs={12}>
                <SoftBox style={{ marginTop: '20px' }}>
                  <Typography
                    style={{
                      fontWeight: '600',
                      fontSize: '0.9rem',
                      lineHeight: '1.5',
                      color: '#0562FB',
                      textAlign: 'left',
                      margin: '10px 0px',
                    }}
                  >
                    Name
                  </Typography>
                  <Typography
                    style={{
                      fontWeight: '200',
                      fontSize: '0.8rem',
                      lineHeight: '1.5',
                      color: '#4b524d',
                      textAlign: 'left',
                      margin: '10px 0px',
                    }}
                  >
                    Name your message template.
                  </Typography>
                  <SoftInput
                    placeholder="Enter Template Name"
                    style={{ width: '400px' }}
                    value={templateName}
                    onChange={(e) => {
                      const newValue = e.target.value.toLowerCase().replace(/\s+/g, '_');
                      setTemplateName(newValue);
                    }}
                  />
                  <Typography
                    style={{
                      fontWeight: '200',
                      fontSize: '0.8rem',
                      lineHeight: '1.5',
                      color: '#4b524d',
                      textAlign: 'left',
                      margin: '10px 0px',
                    }}
                  >
                    Name should start with small letter and contains '_'
                  </Typography>
                </SoftBox>

                <SoftBox style={{ marginTop: '20px' }}>
                  <Typography
                    style={{
                      fontWeight: '600',
                      fontSize: '0.9rem',
                      lineHeight: '1.5',
                      color: '#0562FB',
                      textAlign: 'left',
                      margin: '10px 0px',
                    }}
                  >
                    Notification Text
                  </Typography>
                  <Typography
                    style={{
                      fontWeight: '200',
                      fontSize: '0.8rem',
                      lineHeight: '1.5',
                      color: '#4b524d',
                      textAlign: 'left',
                      margin: '10px 0px',
                    }}
                  >
                    Text of your Push Notification.
                  </Typography>
                  <textarea
                    ref={inputRef}
                    placeholder="Enter Notification Text"
                    onChange={handleInputChange}
                    value={displayedText}
                    className="text-editor-textarea-2"
                    // onChange={(event) => setNotificationText(event.target.value)}
                  />
                  <SoftBox className="emoji-selector">
                    <EmojiEmotionsIcon onClick={() => setShowEmojiPicker(!showEmojiPicker)} />
                  </SoftBox>

                  {showEmojiPicker && <Picker data={data} onEmojiSelect={handleEmojiSelect} />}
                </SoftBox>
              </Grid>
              <Grid item lg={4} sm={12} md={6} xs={12} style={{ position: 'sticky', top: '0', zIndex: '1' }}>
                <Typography
                  style={{
                    fontWeight: '200',
                    fontSize: '1rem',
                    lineHeight: '1.5',
                    color: '#4b524d',
                    textAlign: 'left',
                    margin: '10px 0px',
                  }}
                >
                  Message Preview
                </Typography>
                <Typography
                  style={{
                    fontWeight: '200',
                    fontSize: '0.8rem',
                    lineHeight: '1.5',
                    color: '#4b524d',
                    textAlign: 'left',
                    margin: '10px 0px',
                  }}
                >
                  The preview providers a general idea of how your message will appear on a mobile device Actual message
                  rendering will very depending on the device.Test with a real device for actual results
                </Typography>
                <SoftBox mt={3} className="push-preview-box">
                  <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
                    <img
                      src="https://static.wixstatic.com/media/a16c70_66558d16022144629d4d1d073893825b~mv2.jpg/v1/fit/w_2500,h_1330,al_c/a16c70_66558d16022144629d4d1d073893825b~mv2.jpg"
                      alt=""
                      style={{ width: '25px', height: '25px' }}
                    />
                    <Typography
                      style={{
                        fontWeight: '600',
                        fontSize: '0.7rem',
                        lineHeight: '1.5',
                        color: '#4b524d',
                        textAlign: 'left',
                        margin: '10px 0px',
                      }}
                    >
                      Twinleaves
                    </Typography>
                  </div>
                  <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                    {contactCSVFile !== '' && (
                      <img
                        src={URL.createObjectURL(contactCSVFile)}
                        alt=""
                        style={{ width: '50px', height: '50px', borderRadius: '5px' }}
                      />
                    )}
                    <div>
                      {notificationTitle !== '' && (
                        <Typography
                          style={{
                            fontWeight: '600',
                            fontSize: '1rem',
                            lineHeight: '1.5',
                            color: '#4b524d',
                            textAlign: 'left',
                          }}
                        >
                          {notificationTitle}
                        </Typography>
                      )}
                      {notificationText !== '' && (
                        <Typography
                          style={{
                            fontWeight: '200',
                            fontSize: '0.8rem',
                            lineHeight: '1.5',
                            color: '#4b524d',
                            textAlign: 'left',
                          }}
                        >
                          <StyledTextComponent bodyText={notificationText} />
                        </Typography>
                      )}
                    </div>
                  </div>
                </SoftBox>
              </Grid>
            </Grid>
            <SoftBox display="flex" justifyContent="flex-end" mt={4}>
              <SoftBox display="flex">
                <SoftButton className="vendor-second-btn" onClick={() => navigate('/campaigns/templates/list/push')}>
                  Cancel
                </SoftButton>
                <SoftBox ml={2}>
                  <SoftButton
                    // variant="gradient"
                    color="info"
                    className="vendor-add-btn"
                    onClick={handleCreateTemplate}
                  >
                    Submit
                  </SoftButton>
                </SoftBox>
              </SoftBox>
            </SoftBox>
          </SoftBox>
        </Box>
      </DashboardLayout>
    </div>
  );
};

export default CreatePushCampaign;
