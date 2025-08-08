import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import AddIcon from '@mui/icons-material/Add';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import InfoIcon from '@mui/icons-material/Info';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import StrikethroughSIcon from '@mui/icons-material/StrikethroughS';
import { Box, Button, Grid, IconButton, Tooltip, Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SoftBox from '../../../../../components/SoftBox';
import SoftButton from '../../../../../components/SoftButton';
import SoftInput from '../../../../../components/SoftInput';
import SoftSelect from '../../../../../components/SoftSelect';
import { whatsappCampaignTemplateCreation } from '../../../../../config/Services';
import DashboardLayout from '../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../examples/Navbars/DashboardNavbar';
import { useSnackbar } from '../../../../../hooks/SnackbarProvider';
import './CreateWhatsappCampaign.css';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const WhatsappTemplateCreations = () => {
  const [header, setHeader] = useState('');
  const [mediaType, setMediaType] = useState('Image');
  const [buttonOptions, setButtonOptions] = useState('');
  const fileInputRef = useRef(null);
  const fileInputRefVideo = useRef(null);
  const fileInputRefPDF = useRef(null);
  const [headerText, setHeaderText] = useState('');
  const [bodyText, setBodyText] = useState('');
  const [footerText, setFooterText] = useState('');
  const [websiteText, setWebsiteText] = useState('');
  const [websiteURL, setWebsiteURL] = useState('');
  const [callText, setCallText] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [mediaFileImg, setMediaFileImg] = useState('');
  const [mediaFileVid, setMediaFileVid] = useState('');
  const [mediaFilePDF, setMediaFilePDF] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [templateName, setTemplateName] = useState('');
  const [exampleBody, setExampleBody] = useState(false);
  const [count, setCount] = useState(0);
  const [disbaleBtn, setDisableBtn] = useState({
    'Visit Website 1': false,
    'Visit Website 2': false,
    'Call Phone Number': false,
    'Copy Offer Code': false,
  });
  const [buttonArr, setButtonArr] = useState([]);
  const [websiteText2, setWebsite2Text] = useState('');
  const [website2URL, setWebsite2URL] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [offerCodeText, setOfferCodeText] = useState('');
  const [offerCode, setOfferCode] = useState('');
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const [examples, setExamples] = useState([]);
  const navigate = useNavigate();

  const handleBoldClick = () => {
    setBodyText(bodyText + '**');
  };

  const handleItalicClick = () => {
    setBodyText(bodyText + '__');
  };

  const handleStrikeThrough = () => {
    setBodyText(bodyText + '~~');
  };

  const handleAddVariable = () => {
    // Append '{{' to the bodyText
    setBodyText(bodyText + '{{');
    setExampleBody(true);

    // Trigger the logic to generate input examples
    const occurrences = (bodyText.match(/{{/g) || []).length + 1;
    const inputExamples = [];
    for (let i = 0; i < occurrences; i++) {
      inputExamples.push(
        <div key={i} style={{ display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center' }}>
          <Typography
            style={{
              fontWeight: '200',
              fontSize: '0.8rem',
              lineHeight: '1.5',
              color: '#4b524d',
              textAlign: 'left',
              marginTop: '20px',
            }}
          >
            {i + 1}
          </Typography>
          <SoftInput
            key={i}
            type="text"
            placeholder={`Enter Content for {{${i + 1}}}`}
            style={{ width: '400px', marginTop: '20px' }}
            value={examples[i] ? examples[i].value : ''}
            onChange={(e) => handleExampleChange(e, i)}
          />
        </div>,
      );
    }
    setExamples(inputExamples);
  };

  const handleEmojiSelect = (emoji) => {
    // const newText =
    //   text.slice(0, cursorPosition) +
    //   emoji.native +
    //   text.slice(cursorPosition);
    const newText = bodyText + emoji.native;
    setBodyText(newText);
    // setCursorPosition(cursorPosition + emoji.native.length);
    setShowEmojiPicker(false);
  };

  const showSnackbar = useSnackbar();

  // Function to open the file input when the button is clicked
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleButtonClickVideo = () => {
    fileInputRefVideo.current.click();
  };

  const handleButtonClickPDF = () => {
    fileInputRefPDF.current.click();
  };

  const handleHeaderTextChange = (event) => {
    setHeaderText(event.target.value);
  };

  const handleBodyChange = (event) => {
    if (event.keyCode === 13) {
      // Check if Enter key is pressed
      event.preventDefault(); // Prevent default behavior (newline in textarea)
      let inputValue = event.target.value;
      inputValue += '\\n'; // Append newline character
      setBodyText(bodyText + inputValue); // Update state with the modified input value
      return; // Exit the function to prevent further processing
    }

    const inputValue = event.target.value;
    if (inputValue.length <= 1024) {
      // inputValue = inputValue.replace(/\n/g, '\\n');
      setBodyText(inputValue);

      // Check if the input value contains "{{"
      if (inputValue.includes('{{')) {
        setExampleBody(true);
      } else {
        setExampleBody(false);
      }

      // Word count logic
      const wordCount = inputValue.length;

      // Update state
      setCount1(wordCount);

      const occurrences = (inputValue.match(/{{/g) || []).length;
      setCount(occurrences);

      const inputExamples = [];
      for (let i = 0; i < occurrences; i++) {
        inputExamples.push(
          <div key={i} style={{ display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center' }}>
            <Typography
              style={{
                fontWeight: '200',
                fontSize: '0.8rem',
                lineHeight: '1.5',
                color: '#4b524d',
                textAlign: 'left',
                marginTop: '20px',
              }}
            >
              {i + 1}
            </Typography>
            <SoftInput
              key={i}
              type="text"
              placeholder={`Enter Content for {{${i + 1}}}`}
              style={{ width: '400px', marginTop: '20px' }}
              value={examples[i] ? examples[i].value : ''}
              onChange={(e) => handleExampleChange(e, i)}
            />
          </div>,
        );
      }
      setExamples(inputExamples);
    }
  };

  const handleExampleChange = (event, index) => {
    const newValue = event.target.value;

    // Update the examples array with the new value
    setExamples((prevExamples) =>
      prevExamples.map((example, i) => (i === index ? { ...example, value: newValue } : example)),
    );
  };

  const StyledTextComponent = ({ bodyText }) => {
    // Split bodyText by \\n
    const parts = bodyText.split('\\n');

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

  const handleFooterChange = (event) => {
    const inputValue = event.target.value;

    if (inputValue.length <= 60) {
      const wordCount = inputValue.length;

      // Update state
      setCount2(wordCount);
      setFooterText(inputValue);
    }
  };

  const HeaderOptions = [
    {
      label: 'None',
      value: 'None',
    },
    {
      label: 'Text',
      value: 'Text',
    },
    {
      label: 'Media',
      value: 'Media',
    },
  ];

  const ButtonOptionsBox = [
    // {
    //   label: 'Visit Website 1',
    //   value: 'Visit Website 1',
    //   isDisabled: disbaleBtn['Visit Website 1'],
    // },
    // {
    //   label: 'Visit Website 2',
    //   value: 'Visit Website 2',
    //   isDisabled: disbaleBtn['Visit Website 2'],
    // },
    {
      label: 'Call Phone Number',
      value: 'Call Phone Number',
      isDisabled: disbaleBtn['Call Phone Number'],
    },
    // {
    //   label: 'Copy Offer Code',
    //   value: 'Copy Offer Code',
    //   isDisabled: disbaleBtn['Copy Offer Code'],
    // },
  ];
  let mediaPreview = null;

  if (header === 'Text') {
    mediaPreview = (
      <Typography
        style={{
          fontWeight: '600',
          fontSize: '0.9rem',
          lineHeight: '1.5',
          textAlign: 'left',
          margin: '10px 0px',
        }}
      >
        {headerText}
      </Typography>
    );
  } else if (header === 'Media' && mediaType === 'Image' && mediaFileImg !== '') {
    mediaPreview = <img src={URL.createObjectURL(mediaFileImg)} style={{ width: '250px', height: '150px' }} />;
  } else if (header === 'Media' && mediaType === 'Document' && mediaFilePDF !== '') {
    mediaPreview = (
      <embed
        src={URL.createObjectURL(mediaFilePDF)}
        type="application/pdf"
        style={{ width: '250px', height: '150px' }}
      />
    );
  } else if (header === 'Media' && mediaType === 'Video' && mediaFileVid !== '') {
    mediaPreview = (
      <video controls src={URL.createObjectURL(mediaFileVid)} style={{ width: '250px', height: '150px' }} />
    );
  } else if (header === 'Media') {
    // handle other media types (Image, Video, Document) with default images here
    if (mediaType === 'Image') {
      mediaPreview = (
        <SoftBox className="media-message-preview">
          <img
            src="https://static.xx.fbcdn.net/rsrc.php/v3/yP/r/UL8I81pzwLA.png"
            style={{ width: '100px', height: '100px' }}
          />
        </SoftBox>
      );
    } else if (mediaType === 'Video') {
      mediaPreview = (
        <SoftBox className="media-message-preview">
          <img
            src="https://static.xx.fbcdn.net/rsrc.php/v3/yy/r/WbGV1ImQmlh.png"
            style={{ width: '100px', height: '100px' }}
          />
        </SoftBox>
      );
    } else if (mediaType === 'Document') {
      mediaPreview = (
        <SoftBox className="media-message-preview">
          <img
            src="https://static.xx.fbcdn.net/rsrc.php/v3/yp/r/FgGwlb24b_H.png"
            style={{ width: '100px', height: '100px' }}
          />
        </SoftBox>
      );
    } else if (mediaType === 'Location') {
      mediaPreview = (
        <SoftBox className="media-message-preview">
          <img
            src="https://static.xx.fbcdn.net/rsrc.php/v3/yC/r/OVyn07knF_b.png"
            style={{ width: '100px', height: '100px' }}
          />
        </SoftBox>
      );
    }
  }

  const handleButtonChange = (option) => {
    setButtonOptions(option.value);
    setButtonArr([...buttonArr, option.value]);
    setDisableBtn((prevState) => {
      return {
        ...prevState,
        [option.value]: true,
      };
    });
  };

  const handleHeaderChange = (option) => {
    setHeader(option.value);
  };

  useEffect(() => {
    // Function to update the current time every second

    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0'); // Get hours and pad with leading zero if necessary
      const minutes = now.getMinutes().toString().padStart(2, '0'); // Get minutes and pad with leading zero if necessary
      setCurrentTime(`${hours}:${minutes}`);
    };

    // Update the time immediately and then every second
    updateTime();
    const intervalId = setInterval(updateTime, 1000);

    // Clean up the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []);

  const clientId = localStorage.getItem('clientId');
  const fileType =
    mediaType === 'Image'
      ? mediaFileImg
      : mediaType === 'Video'
      ? mediaFileVid
      : mediaType === 'Document'
      ? mediaFilePDF
      : '';

  const result = [];
  const btnObj = {
    type: '',
    text: '',
    phoneNumber: '',
  };
  buttonArr.forEach((button) => {
    if (button === 'Visit Website 1') {
      btnObj.type = 'VISIT_WEBSITE';
      btnObj.text = websiteText;
      btnObj.phoneNumber = websiteURL;
      result.push({ ...btnObj });
    } else if (button === 'Visit Website 2') {
      btnObj.type = 'VISIT_WEBSITE';
      btnObj.text = websiteText2;
      btnObj.phoneNumber = website2URL;
      result.push({ ...btnObj });
    } else if (button === 'Call Phone Number') {
      btnObj.type = 'PHONE_NUMBER';
      btnObj.text = callText;
      btnObj.phoneNumber = `91${phoneNumber}`;
      result.push({ ...btnObj });
    } else if (button === 'Copy Offer Code') {
      btnObj.type = 'OFFER_CODE';
      btnObj.text = offerCodeText;
      btnObj.phoneNumber = offerCode;
      result.push({ ...btnObj });
    }
  });

  const convertNewlines = (text) => {
    return text.replace(/\n/g, '\\n');
  };

  const payload = {
    clientId: clientId,
    name: templateName,
    language: 'en_GB',
    category: 'MARKETING',
    headerComponent: {
      type: 'HEADER',
      format: header.toUpperCase() === 'MEDIA' ? mediaType.toUpperCase() : header.toUpperCase(),
      text: header.toUpperCase() === 'TEXT' ? headerText : undefined,
    },
    bodyComponent: {
      type: 'BODY',
      text: convertNewlines(bodyText),
    },
    footerComponent: {
      type: 'FOOTER',
      text: footerText,
    },
    buttonComponent: {
      type: 'BUTTONS',
      buttons: [
        {
          type: 'PHONE_NUMBER',
          text: callText,
          phone_number: `91${phoneNumber}`,
        },
      ],
    },
  };

  const handleTemplateCreation = () => {
    const filePayload = new Blob([fileType], { type: 'image/png' });

    const formData = new FormData();
    formData.append('file', filePayload);
    formData.append(
      'marketingTemplateRequest',
      new Blob([JSON.stringify(payload)], {
        type: 'application/json',
      }),
    );
    try {
      whatsappCampaignTemplateCreation(formData)
        .then((res) => {
          showSnackbar('Whatsapp Campaign Template Created', 'success');
          setOpenDialog(true);
        })
        .catch((error) => {
          showSnackbar('Whatsapp Campaign Template not Created', 'error');
        });
    } catch (error) {
      showSnackbar('Whatsapp Campaign Template not Created', 'error');
    }
  };

  return (
    <div>
      <DashboardLayout>
        <DashboardNavbar prevLink={true} />
        {/* enable disable notifications dialog box */}
        <div>
          <Dialog
            open={openDialog}
            TransitionComponent={Transition}
            keepMounted
            onClose={() => setOpenDialog(false)}
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle>Whatsapp Campaign Template Created</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                {`Your Whatsapp Campaign template ${templateName} is created. It will take 24 hours for Meta to check is quality and you will recieve a mail regarding the same.`}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => navigate('/campaigns/whatsapp/templates')}>Exit</Button>
            </DialogActions>
          </Dialog>
        </div>

        <Box
          className="table-css-fix-box-scroll-vend"
          style={{
            boxShadow: 'rgba(37, 37, 37, 0.126) 0px 5px 50px',
            position: 'relative',
            padding: '20px',
          }}
        >
          <div style={{ display: 'flex', gap: '10px' }}>
            {/* <SoftBox style={{ marginTop: '1px' }}>
              <BiArrowBack onClick={() => navigate('/campaigns/whatsapp/templates')} style={{ cursor: 'pointer' }} />
            </SoftBox> */}
            <Typography>WhatsApp Campaign Template Set up</Typography>
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
                    Header <span style={{ fontSize: '0.8rem' }}>Optional</span>
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
                    Add a title or choose which type of media you'll use for this header.
                  </Typography>
                  <SoftSelect
                    placeholder="None"
                    style={{ width: '400px' }}
                    options={HeaderOptions}
                    onChange={handleHeaderChange}
                  />
                </SoftBox>

                {header === 'Text' ? (
                  <SoftInput
                    placeholder="Enter Text"
                    style={{ width: '400px', marginTop: '20px' }}
                    onChange={handleHeaderTextChange}
                  />
                ) : header === 'Media' ? (
                  <SoftBox className="media-outer-box">
                    <div onClick={() => setMediaType('Image')}>
                      <div className={mediaType === 'Image' ? 'checked-media-box' : 'media-box'}>
                        <div className={mediaType === 'Image' ? 'checked-custom-radio' : 'custom-radio-button'}></div>
                        <img
                          src={
                            mediaType === 'Image'
                              ? 'https://static.xx.fbcdn.net/rsrc.php/v3/yB/r/ZASGtoByXsF.png'
                              : 'https://static.xx.fbcdn.net/rsrc.php/v3/yP/r/UL8I81pzwLA.png'
                          }
                        />
                        <p className={mediaType === 'Image' ? 'high-media-text' : 'media-text'}>Image</p>
                      </div>
                    </div>
                    <div onClick={() => setMediaType('Video')}>
                      <div className={mediaType === 'Video' ? 'checked-media-box' : 'media-box'}>
                        <div className={mediaType === 'Video' ? 'checked-custom-radio' : 'custom-radio-button'}></div>
                        <img
                          src={
                            mediaType === 'Video'
                              ? 'https://static.xx.fbcdn.net/rsrc.php/v3/yw/r/MCinRR7mDdn.png'
                              : 'https://static.xx.fbcdn.net/rsrc.php/v3/yy/r/WbGV1ImQmlh.png'
                          }
                        />
                        <p className={mediaType === 'Video' ? 'high-media-text' : 'media-text'}>Video</p>
                      </div>
                    </div>
                    <div onClick={() => setMediaType('Document')}>
                      <div className={mediaType === 'Document' ? 'checked-media-box' : 'media-box'}>
                        <div
                          className={mediaType === 'Document' ? 'checked-custom-radio' : 'custom-radio-button'}
                        ></div>
                        <img
                          src={
                            mediaType === 'Document'
                              ? 'https://static.xx.fbcdn.net/rsrc.php/v3/y5/r/3CGvNim1sDb.png'
                              : 'https://static.xx.fbcdn.net/rsrc.php/v3/yp/r/FgGwlb24b_H.png'
                          }
                        />
                        <p className={mediaType === 'Document' ? 'high-media-text' : 'media-text'}>Document</p>
                      </div>
                    </div>
                    <div onClick={() => setMediaType('Location')}>
                      <div className={mediaType === 'Location' ? 'checked-media-box' : 'media-box'}>
                        <div
                          className={mediaType === 'Location' ? 'checked-custom-radio' : 'custom-radio-button'}
                        ></div>
                        <img
                          src={
                            mediaType === 'Location'
                              ? 'https://static.xx.fbcdn.net/rsrc.php/v3/y9/r/HtUV5__cQJN.png'
                              : 'https://static.xx.fbcdn.net/rsrc.php/v3/yC/r/OVyn07knF_b.png'
                          }
                        />
                        <p className={mediaType === 'Location' ? 'high-media-text' : 'media-text'}>Location</p>
                      </div>
                    </div>
                  </SoftBox>
                ) : null}

                {header === 'Media' && mediaType === 'Image' ? (
                  <SoftBox style={{ marginTop: '20px' }} className="sample-media-box">
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
                      {' '}
                      Header content
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
                      To help us review your content, provide examples of the variables or media in the header. Do not
                      include any customer information. Cloud API hosted by Meta reviews templates and variable
                      parameters to protect the security and integrity of our services.
                    </Typography>
                    <SoftBox style={{ display: 'flex', gap: '10px' }}>
                      <p className="choose-media-text">Image</p>
                      {mediaFileImg !== '' ? (
                        <>
                          <button className="choose-media-type-button">{mediaFileImg.name}</button>
                          <CancelOutlinedIcon
                            className="close-button"
                            onClick={() => setMediaFileImg('')}
                            sx={{ marginTop: '5px' }}
                          />
                        </>
                      ) : (
                        <button className="choose-media-type-button" onClick={handleButtonClick}>
                          Choose PNG or JPG file
                        </button>
                      )}
                      {/* Hidden file input */}
                      <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        accept="image/*"
                        onChange={(e) => {
                          // Handle the selected file here (e.target.files[0])
                          setMediaFileImg(e.target.files[0]);
                          setMediaFilePDF('');
                          setMediaFileVid('');
                        }}
                      />
                    </SoftBox>
                  </SoftBox>
                ) : header === 'Media' && mediaType === 'Video' ? (
                  <SoftBox style={{ marginTop: '20px' }} className="sample-media-box">
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
                      {' '}
                      Header content
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
                      To help us review your content, provide examples of the variables or media in the header. Do not
                      include any customer information. Cloud API hosted by Meta reviews templates and variable
                      parameters to protect the security and integrity of our services.
                    </Typography>
                    <SoftBox style={{ display: 'flex', gap: '10px' }}>
                      <p className="choose-media-text">Video</p>
                      {mediaFileVid !== '' ? (
                        <>
                          <button className="choose-media-type-button">{mediaFileVid.name}</button>
                          <CancelOutlinedIcon
                            className="close-button"
                            onClick={() => setMediaFileVid('')}
                            sx={{ marginTop: '5px' }}
                          />
                        </>
                      ) : (
                        <button className="choose-media-type-button" onClick={handleButtonClickVideo}>
                          Choose MP4 file
                        </button>
                      )}
                      {/* Hidden file input */}
                      <input
                        type="file"
                        ref={fileInputRefVideo}
                        style={{ display: 'none' }}
                        accept="video/mp4"
                        onChange={(e) => {
                          // Handle the selected file here (e.target.files[0])
                          setMediaFileVid(e.target.files[0]);
                          setMediaFileImg('');
                          setMediaFilePDF('');
                        }}
                      />
                    </SoftBox>
                  </SoftBox>
                ) : header === 'Media' && mediaType === 'Document' ? (
                  <SoftBox style={{ marginTop: '20px' }} className="sample-media-box">
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
                      {' '}
                      Header content
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
                      To help us review your content, provide examples of the variables or media in the header. Do not
                      include any customer information. Cloud API hosted by Meta reviews templates and variable
                      parameters to protect the security and integrity of our services.
                    </Typography>
                    <SoftBox style={{ display: 'flex', gap: '10px' }}>
                      <p className="choose-media-text">Document</p>
                      {mediaFilePDF !== '' ? (
                        <>
                          <button className="choose-media-type-button">{mediaFilePDF.name}</button>
                          <CancelOutlinedIcon
                            className="close-button"
                            onClick={() => setMediaFilePDF('')}
                            sx={{ marginTop: '5px' }}
                          />
                        </>
                      ) : (
                        <button className="choose-media-type-button" onClick={handleButtonClickPDF}>
                          Choose PDF file
                        </button>
                      )}
                      {/* Hidden file input */}
                      <input
                        type="file"
                        ref={fileInputRefPDF}
                        style={{ display: 'none' }}
                        accept="application/pdf"
                        onChange={(e) => {
                          // Handle the selected file here (e.target.files[0])
                          setMediaFilePDF(e.target.files[0]);
                          setMediaFileImg('');
                          setMediaFileVid('');
                        }}
                      />
                    </SoftBox>
                  </SoftBox>
                ) : null}

                <SoftBox style={{ marginTop: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
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
                      Body
                    </Typography>
                    <Tooltip
                      title='To bold the text Please add the text between "*". To write the text in Italic Please add the text between "_". To strike-through the text Please add the text between "~"'
                      placement="top"
                    >
                      <IconButton>
                        <InfoIcon sx={{ fontSize: '15px' }} />
                      </IconButton>
                    </Tooltip>
                  </div>
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
                    Enter the text for your message.
                  </Typography>
                  <textarea
                    className="text-editor-textarea"
                    placeholder="Enter Text in English (UK)"
                    value={bodyText}
                    onChange={handleBodyChange}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                    <Typography
                      style={{
                        fontWeight: '600',
                        fontSize: '0.6rem',
                        lineHeight: '1.5',
                        color: '#0562FB',
                        margin: '10px 0px',
                      }}
                    >
                      {count1}/1024
                    </Typography>
                    <div className="text-editor-buttons-box">
                      <EmojiEmotionsIcon onClick={() => setShowEmojiPicker(!showEmojiPicker)} />
                      <FormatBoldIcon onClick={handleBoldClick} />
                      <FormatItalicIcon onClick={handleItalicClick} />
                      <StrikethroughSIcon onClick={handleStrikeThrough} />
                      <Typography fontSize="14px" onClick={handleAddVariable}>
                        <AddIcon />
                        Add Variable
                      </Typography>
                    </div>
                    {showEmojiPicker && <Picker data={data} onEmojiSelect={handleEmojiSelect} />}
                  </div>
                  {/* <textarea id="w3review" name="w3review" rows="4" placeholder="Enter Text in English (UK)"></textarea> */}
                </SoftBox>

                {exampleBody && (
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
                      Samples for body content
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
                      To help us review your message template, please add an example for each variable in your body
                      text. Do not use real customer information. Cloud API hosted by Meta reviews templates and
                      variable parameters to protect the security and integrity of our services.
                    </Typography>
                    <Typography
                      style={{
                        fontWeight: '600',
                        fontSize: '0.8rem',
                        lineHeight: '1.5',
                        color: '#4b524d',
                        textAlign: 'left',
                        margin: '10px 0px',
                      }}
                    >
                      Body
                    </Typography>
                    {examples}
                  </SoftBox>
                )}

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
                    Footer <span style={{ fontSize: '0.8rem' }}>Optional</span>
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
                    Add a short line of text to the bottom of your message template. If you add the marketing opt-out
                    button, the associated footer will be shown here by default.
                  </Typography>
                  <SoftInput
                    placeholder="Enter Text in English (UK)"
                    style={{ width: '400px' }}
                    value={footerText}
                    onChange={handleFooterChange}
                  />
                  <Typography
                    style={{
                      fontWeight: '600',
                      fontSize: '0.6rem',
                      lineHeight: '1.5',
                      color: '#0562FB',
                      textAlign: 'right',
                      margin: '10px 0px',
                    }}
                  >
                    {count2}/60
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
                    Buttons <span style={{ fontSize: '0.8rem' }}>Optional</span>
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
                    Create buttons that let customers respond to your message or take action.
                  </Typography>
                  <SoftSelect
                    placeholder="+ Add a Button"
                    style={{ width: '400px' }}
                    options={ButtonOptionsBox}
                    onChange={handleButtonChange}
                  />
                </SoftBox>
                {buttonArr.length !== 0 && (
                  <>
                    <SoftBox className="button-box">
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
                        Call To Action
                      </Typography>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          gap: '10px',
                          cursor: 'pointer',
                          flexDirection: 'column',
                        }}
                      >
                        {buttonArr.includes('Visit Website 1') && (
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              gap: '10px',
                              cursor: 'pointer',
                            }}
                          >
                            <SoftBox className="button-inner-box">
                              {/* <div>
                                <Typography
                                  style={{
                                    fontWeight: '600',
                                    fontSize: '0.9rem',
                                    lineHeight: '1.5',
                                    color: '#4b524d',
                                    textAlign: 'left',
                                    margin: '10px 0px',
                                  }}
                                >
                                  Type Of Action
                                </Typography>
                                <SoftSelect
                                  placeholder="+ Add a Button"
                                  style={{ width: '400px' }}
                                  options={ButtonOptionsBox}
                                  onChange={handleButtonChange}
                                />
                              </div> */}
                              <div>
                                <Typography
                                  style={{
                                    fontWeight: '600',
                                    fontSize: '0.9rem',
                                    lineHeight: '1.5',
                                    color: '#4b524d',
                                    textAlign: 'left',
                                    margin: '10px 0px',
                                  }}
                                >
                                  Button Text
                                </Typography>
                                <SoftInput
                                  placeholder="Enter Text"
                                  id="width-input1"
                                  onChange={(event) => setWebsiteText(event.target.value)}
                                />
                              </div>
                              <div>
                                <Typography
                                  style={{
                                    fontWeight: '600',
                                    fontSize: '0.9rem',
                                    lineHeight: '1.5',
                                    color: '#4b524d',
                                    textAlign: 'left',
                                    margin: '10px 0px',
                                  }}
                                >
                                  Website URL
                                </Typography>
                                <SoftInput
                                  placeholder="www.example.com"
                                  id="width-input2"
                                  onChange={(event) => setWebsiteURL(event.target.value)}
                                />
                              </div>
                            </SoftBox>
                            <CancelOutlinedIcon
                              className="close-button"
                              onClick={() => {
                                setButtonArr((prevArr) => prevArr.filter((item) => item !== 'Visit Website 1'));

                                setDisableBtn((prevState) => {
                                  const updatedState = { ...prevState };
                                  updatedState['Visit Website 1'] = false;
                                  return updatedState;
                                });
                              }}
                            />
                          </div>
                        )}
                        {buttonArr.includes('Visit Website 2') && (
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              gap: '10px',
                              cursor: 'pointer',
                            }}
                          >
                            <SoftBox className="button-inner-box">
                              <div>
                                <Typography
                                  style={{
                                    fontWeight: '600',
                                    fontSize: '0.9rem',
                                    lineHeight: '1.5',
                                    color: '#4b524d',
                                    textAlign: 'left',
                                    margin: '10px 0px',
                                  }}
                                >
                                  Button Text
                                </Typography>
                                <SoftInput
                                  placeholder="Enter Text"
                                  id="width-input1"
                                  onChange={(event) => setWebsite2Text(event.target.value)}
                                />
                              </div>
                              <div>
                                <Typography
                                  style={{
                                    fontWeight: '600',
                                    fontSize: '0.9rem',
                                    lineHeight: '1.5',
                                    color: '#4b524d',
                                    textAlign: 'left',
                                    margin: '10px 0px',
                                  }}
                                >
                                  Website URL
                                </Typography>
                                <SoftInput
                                  placeholder="www.example.com"
                                  id="width-input2"
                                  onChange={(event) => setWebsite2URL(event.target.value)}
                                />
                              </div>
                            </SoftBox>
                            <CancelOutlinedIcon
                              className="close-button"
                              onClick={() => {
                                setButtonArr((prevArr) => prevArr.filter((item) => item !== 'Visit Website 2'));

                                setDisableBtn((prevState) => {
                                  const updatedState = { ...prevState };
                                  updatedState['Visit Website 2'] = false;
                                  return updatedState;
                                });
                              }}
                            />
                          </div>
                        )}
                        {buttonArr.includes('Call Phone Number') && (
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              gap: '10px',
                              cursor: 'pointer',
                            }}
                          >
                            <SoftBox className="button-inner-box">
                              <div>
                                <Typography
                                  style={{
                                    fontWeight: '600',
                                    fontSize: '0.9rem',
                                    lineHeight: '1.5',
                                    color: '#4b524d',
                                    textAlign: 'left',
                                    margin: '10px 0px',
                                  }}
                                >
                                  Button Text
                                </Typography>
                                <SoftInput
                                  placeholder="Enter Text"
                                  id="width-input1"
                                  onChange={(event) => setCallText(event.target.value)}
                                />
                              </div>
                              <div>
                                <Typography
                                  style={{
                                    fontWeight: '600',
                                    fontSize: '0.9rem',
                                    lineHeight: '1.5',
                                    color: '#4b524d',
                                    textAlign: 'left',
                                    margin: '10px 0px',
                                  }}
                                >
                                  Phone Number
                                </Typography>
                                <SoftInput
                                  placeholder="1234567890"
                                  id="width-input2"
                                  onChange={(event) => setPhoneNumber(event.target.value)}
                                />
                              </div>
                            </SoftBox>
                            <CancelOutlinedIcon
                              className="close-button"
                              onClick={() => {
                                setButtonArr((prevArr) => prevArr.filter((item) => item !== 'Call Phone Number'));

                                setDisableBtn((prevState) => {
                                  const updatedState = { ...prevState };
                                  updatedState['Call Phone Number'] = false;
                                  return updatedState;
                                });
                              }}
                            />
                          </div>
                        )}
                        {buttonArr.includes('Copy Offer Code') && (
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              gap: '10px',
                              cursor: 'pointer',
                            }}
                          >
                            <SoftBox className="button-inner-box">
                              <div>
                                <Typography
                                  style={{
                                    fontWeight: '600',
                                    fontSize: '0.9rem',
                                    lineHeight: '1.5',
                                    color: '#4b524d',
                                    textAlign: 'left',
                                    margin: '10px 0px',
                                  }}
                                >
                                  Button Text
                                </Typography>
                                <SoftInput
                                  placeholder="Enter Text"
                                  id="width-input1"
                                  onChange={(event) => setOfferCodeText(event.target.value)}
                                />
                              </div>
                              <div>
                                <Typography
                                  style={{
                                    fontWeight: '600',
                                    fontSize: '0.9rem',
                                    lineHeight: '1.5',
                                    color: '#4b524d',
                                    textAlign: 'left',
                                    margin: '10px 0px',
                                  }}
                                >
                                  Offer Code
                                </Typography>
                                <SoftInput
                                  placeholder=""
                                  id="width-input2"
                                  onChange={(event) => setOfferCode(event.target.value)}
                                />
                              </div>
                            </SoftBox>
                            <CancelOutlinedIcon
                              className="close-button"
                              onClick={() => {
                                setButtonArr((prevArr) => prevArr.filter((item) => item !== 'Copy Offer Code'));

                                setDisableBtn((prevState) => {
                                  const updatedState = { ...prevState };
                                  updatedState['Copy Offer Code'] = false;
                                  return updatedState;
                                });
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </SoftBox>
                  </>
                )}
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
                <SoftBox className="message-preview-box">
                  <SoftBox className="message-preview-inner">
                    {mediaPreview}

                    {bodyText !== '' ? (
                      <Typography
                        style={{
                          fontSize: '0.9rem',
                          lineHeight: '1.5',
                          textAlign: 'left',
                          margin: '10px 0px',
                          fontWeight: '200',
                        }}
                      >
                        <StyledTextComponent bodyText={convertNewlines(bodyText)} />
                      </Typography>
                    ) : null}
                    {footerText !== '' ? (
                      <Typography
                        style={{
                          fontWeight: '200',
                          fontSize: '0.8rem',
                          lineHeight: '1.5',
                          textAlign: 'left',
                          margin: '10px 0px',
                          color: '#8D949E',
                        }}
                      >
                        {footerText}
                      </Typography>
                    ) : null}
                    <p className="message-preview-time">{currentTime}</p>

                    {buttonArr.includes('Visit Website 1') && (
                      <SoftBox>
                        <hr />
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: '10px',
                            gap: '10px',
                          }}
                        >
                          <OpenInNewOutlinedIcon sx={{ color: '#0562FB', size: '14px' }} />
                          <Typography
                            style={{
                              fontWeight: '200',
                              fontSize: '0.9rem',
                              lineHeight: '1.5',
                              textAlign: 'left',
                              margin: '10px 0px',
                              color: '#0562FB',
                            }}
                          >
                            {websiteText}
                          </Typography>
                        </div>
                      </SoftBox>
                    )}

                    {buttonArr.includes('Visit Website 2') && (
                      <SoftBox>
                        <hr />
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: '10px',
                            gap: '10px',
                          }}
                        >
                          <OpenInNewOutlinedIcon sx={{ color: '#0562FB', size: '14px' }} />
                          <Typography
                            style={{
                              fontWeight: '200',
                              fontSize: '0.9rem',
                              lineHeight: '1.5',
                              textAlign: 'left',
                              margin: '10px 0px',
                              color: '#0562FB',
                            }}
                          >
                            {websiteText2}
                          </Typography>
                        </div>
                      </SoftBox>
                    )}

                    {buttonArr.includes('Call Phone Number') && (
                      <SoftBox>
                        <hr />
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: '10px',
                            gap: '10px',
                            marginBottom: '10px',
                          }}
                        >
                          <LocalPhoneIcon sx={{ color: '#0562FB' }} />
                          <Typography
                            style={{
                              fontWeight: '200',
                              fontSize: '0.9rem',
                              lineHeight: '1.5',
                              textAlign: 'left',
                              margin: '10px 0px',
                              color: '#0562FB',
                            }}
                          >
                            {callText}
                          </Typography>
                        </div>
                      </SoftBox>
                    )}

                    {buttonArr.includes('Copy Offer Code') && (
                      <SoftBox>
                        <hr />
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: '10px',
                            gap: '10px',
                          }}
                        >
                          <ContentCopyIcon sx={{ color: '#0562FB' }} />
                          <Typography
                            style={{
                              fontWeight: '200',
                              fontSize: '0.9rem',
                              lineHeight: '1.5',
                              textAlign: 'left',
                              margin: '10px 0px',
                              color: '#0562FB',
                            }}
                          >
                            COPY OFFER CODE
                          </Typography>
                        </div>
                      </SoftBox>
                    )}
                  </SoftBox>
                </SoftBox>
              </Grid>
            </Grid>
            <SoftBox display="flex" justifyContent="flex-end" mt={4}>
              <SoftBox display="flex">
                <SoftButton className="vendor-second-btn" onClick={() => navigate('/campaigns/whatsapp')}>
                  Cancel
                </SoftButton>
                <SoftBox ml={2}>
                  <SoftButton
                    // variant="gradient"
                    color="info"
                    className="vendor-add-btn"
                    onClick={handleTemplateCreation}
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

export default WhatsappTemplateCreations;
