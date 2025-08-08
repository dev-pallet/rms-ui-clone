import EditIcon from '@mui/icons-material/Edit';
import { Box, CircularProgress, Grid, Typography } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { format } from 'date-fns';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SoftBox from '../../../../../components/SoftBox';
import SoftButton from '../../../../../components/SoftButton';
import SoftInput from '../../../../../components/SoftInput';
import SoftSelect from '../../../../../components/SoftSelect';
import SoftTypography from '../../../../../components/SoftTypography';
import {
  getAllMarketingSegmentsList,
  getAllWhatsAppCampaignTemplateList,
  getSingleWhatsappCampaignTemplate,
  whatsappCampaignCreation,
  whatsappCampaignScheduler,
  whatsappCampaignSegment,
} from '../../../../../config/Services';
import DashboardLayout from '../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../examples/Navbars/DashboardNavbar';
import { useSnackbar } from '../../../../../hooks/SnackbarProvider';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';

const CreateWhatsAppCampaign = () => {
  const [contactCSVFile, setContactCSVFile] = useState('');
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  const [endDate, setEndDate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [renderKey, setRenderKey] = useState(0);
  const [templateName, setTemplateName] = useState('');
  const [mediaType, setMediaType] = useState('');
  const [mediaLink, setMediaLink] = useState('');
  const [campaignName, setCampaignName] = useState('');
  const [templateList, setTemplateList] = useState([]);
  const [formatedTemplateList, setFormatedTemplateList] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [singleTemplate, setSingleTemplate] = useState([]);
  const [currentTime, setCurrentTime] = useState('');
  const [showMobile, setShowMobile] = useState(false);
  const [sendImm, setSendImm] = useState(false);
  const [loader, setLoader] = useState(false);
  const [scheduler, setScheduler] = useState('');
  const navigate = useNavigate();

  const showSnackbar = useSnackbar();

  const [selectedList, setSelectedList] = useState('');

  // Function to handle checkbox selection
  const handleRecipientChange = (event) => {
    const { id } = event.target;
    setSelectedList(id);
  };

  const handleCheckboxChange = (event) => {
    setIsCheckboxChecked(event.target.checked);
    setSendImm(!event.target.checked);
  };

  const handleSendImm = (event) => {
    setSendImm(event.target.checked);
    setIsCheckboxChecked(!event.target.checked);
  };

  const allTemplates = () => {
    try {
      getAllWhatsAppCampaignTemplateList().then((res) => {
        setTemplateList(res?.data?.data);
      });
    } catch (error) {
      showSnackbar('Templates List not fetched', 'error');
    }
  };

  useEffect(() => {
    allTemplates();
  }, []);

  useEffect(() => {
    const formattedData = templateList.map((category) => ({
      value: `${category.templateName}`,
      label: `${category.templateName}`,
    }));
    setFormatedTemplateList(formattedData);
  }, [templateList]);

  const getTemplate = () => {
    try {
      getSingleWhatsappCampaignTemplate(selectedTemplate).then((res) => {
        setSingleTemplate(res?.data?.data);
      });
    } catch (error) {
      showSnackbar('Template Not Fetched', 'error');
    }
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

  useEffect(() => {
    if (selectedTemplate) {
      getTemplate();
    }
  }, [selectedTemplate]);

  let mediaPreview = null;

  if (singleTemplate.headerFormate === 'TEXT') {
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
        {singleTemplate.headerText}
      </Typography>
    );
  } else if (singleTemplate.headerFormate === 'IMAGE' && mediaLink !== '') {
    mediaPreview = <img src={mediaLink} style={{ width: '250px', height: '150px' }} />;
  }
  // else if (singleTemplate.headerFormate === 'DOCUMENT' && singleTemplate.mediaUrl !== '') {
  //   mediaPreview = (
  //     <embed
  //       src={URL.createObjectURL(singleTemplate.mediaUrl)}
  //       type="application/pdf"
  //       style={{ width: '250px', height: '150px' }}
  //     />
  //   );
  // }
  // else if (singleTemplate.headerFormate === 'VIDEO' && singleTemplate.mediaUrl !== '') {
  //   mediaPreview = (
  //     <video controls src={URL.createObjectURL(singleTemplate.mediaUrl)} style={{ width: '250px', height: '150px' }} />
  //   );
  // }
  else if (
    singleTemplate.headerFormate === 'VIDEO' ||
    singleTemplate.headerFormate === 'IMAGE' ||
    singleTemplate.headerFormate === 'DOCUMENT'
  ) {
    // handle other media types (Image, Video, Document) with default images here
    if (singleTemplate.headerFormate === 'IMAGE') {
      mediaPreview = (
        <SoftBox className="media-message-preview">
          <img
            src="https://static.xx.fbcdn.net/rsrc.php/v3/yP/r/UL8I81pzwLA.png"
            style={{ width: '100px', height: '100px' }}
          />
        </SoftBox>
      );
    } else if (singleTemplate.headerFormate === 'VIDEO') {
      mediaPreview = (
        <SoftBox className="media-message-preview">
          <img
            src="https://static.xx.fbcdn.net/rsrc.php/v3/yy/r/WbGV1ImQmlh.png"
            style={{ width: '100px', height: '100px' }}
          />
        </SoftBox>
      );
    } else if (singleTemplate.headerFormate === 'DOCUMENT') {
      mediaPreview = (
        <SoftBox className="media-message-preview">
          <img
            src="https://static.xx.fbcdn.net/rsrc.php/v3/yp/r/FgGwlb24b_H.png"
            style={{ width: '100px', height: '100px' }}
          />
        </SoftBox>
      );
    } else if (singleTemplate.headerFormate === 'LOCATION') {
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

  const mediaTypes = [
    {
      value: 'Image',
      label: 'Image',
    },
    {
      value: 'Video',
      label: 'Video',
    },
    {
      value: 'Document',
      label: 'Document',
    },
    {
      value: 'Text',
      label: 'Text',
    },
  ];

  const [errorMessage, setErrorMessage] = useState('');

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    // Check if a file is selected
    if (selectedFile) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const content = e.target.result;
        const rows = content.split('\n');
        const header = rows[0].trim(); // Get the header (first row) and remove leading/trailing spaces

        // Check if the header contains "phone_number"
        if (header.toLowerCase() === 'phone_number') {
          setContactCSVFile(selectedFile);
          setErrorMessage('');
        } else {
          setErrorMessage('Error: The CSV file must contain a header row with the title "phone_number".');
          setContactCSVFile(null);
        }
      };

      reader.readAsText(selectedFile);
    } else {
      // No file selected, reset everything
      setContactCSVFile(null);
      setErrorMessage('');
    }
  };

  const handleCreation = () => {
    if (contactCSVFile !== '' && !isCheckboxChecked) {
      handleCampaignCreation();
    } else if (isCheckboxChecked) {
      handleCampaignScheduler();
    } else if (!isCheckboxChecked && contactCSVFile === '') {
      handleSegmentSend();
    }
  };

  const handleSegmentSend = () => {
    const now = new Date();
    setLoader(true);

    const payloadSegment = {
      campaignName: campaignName,
      clientId: clientId,
      templateName: templateName || selectedTemplate,
      linkType: mediaType.toLowerCase(),
      link: mediaLink,
      documentFilename: `${campaignName}.pdf`,
      segmentId: selectedSegmentId,
      reportType: 'csv',
      reportCreatedBy: 'nms',
      reportJobType: 'FIXED',
      reportFrequency: 'DAILY',
      noOfTimesToCreateReport: '4',
      triggered: true,
    };

    try {
      whatsappCampaignSegment(payloadSegment).then((res) => {
        setLoader(false);
        showSnackbar('WhatsApp Campaign Created', 'success');
        navigate('/campaigns/whatsapp');
      });
    } catch (error) {
      setLoader(false);
      showSnackbar('WhatsApp Campaign not Created', 'error');
    }
  };

  const clientId = localStorage.getItem('clientId');

  const payload = {
    campaignName: campaignName,
    clientId: clientId,
    templateName: templateName || selectedTemplate,
    linkType: mediaType.toLowerCase(),
    link: mediaLink,
    documentFilename: `${campaignName}.pdf`,
  };

  const handleCampaignCreation = () => {
    setLoader(true);
    const filePayload = new Blob([contactCSVFile], { type: 'text/csv' });

    const formData = new FormData();
    formData.append('multipartFile', filePayload);
    formData.append(
      'whatsAppBulkMsg',
      new Blob([JSON.stringify(payload)], {
        type: 'application/json',
      }),
    );

    try {
      whatsappCampaignCreation(formData).then((res) => {
        setLoader(false);
        showSnackbar('Whatsapp Campaign Created', 'success');
        navigate('/campaigns/whatsapp');
      });
    } catch (error) {
      setLoader(false);
      showSnackbar('Whatsapp Campaign not Created', 'error');
    }
  };

  const [scheduledTime, setScheduledTime] = useState('');

  const handleTimeChange = (event) => {
    setScheduledTime(event.target.value);
  };

  const handleCampaignScheduler = () => {
    setLoader(true);

    if (!clientId) {
      showSnackbar('Client Id not found', 'error');
      return;
    }

    if (!scheduler || !scheduledTime || !endDate || !startDate || !campaignName) {
      showSnackbar('Please fill all required fields', 'warning');
      setLoader(false);
      return;
    }

    const [hours, minutes] = scheduledTime?.split(':')?.map(Number);

    if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      showSnackbar('Invalid scheduled time', 'error');
      setLoader(false);
      return;
    }

    const istDate = new Date(Date?.UTC(1970, 0, 1, hours, minutes));
    const utcDate = new Date(istDate?.getTime() - (5 * 60 + 30) * 60000);

    const formattedScheduledTime = `${String(utcDate?.getUTCHours())?.padStart(2, '0')}:${String(
      utcDate?.getUTCMinutes(),
    )?.padStart(2, '0')}:00`;

    // Start and end dates in the specified format
    const formattedStartDate = `${startDate}`;
    const formattedEndDate = `${endDate}`;

    const payload = {
      campaignName: campaignName,
      clientId: clientId,
      templateName: templateName || selectedTemplate,
      linkType: mediaType?.toLowerCase(),
      link: mediaLink,
      documentFilename: `${campaignName}.pdf`,
      scheduler: scheduler,
      scheduledTime: formattedScheduledTime,
      segmentId: selectedSegmentId,
      reportType: 'csv',
      reportCreatedBy: username,
      reportJobType: 'FIXED',
      reportFrequency: 'DAILY',
      noOfTimesToCreateReport: '4',
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      createdBy: username,
      triggered: false,
    };

    const filePayload = new Blob([contactCSVFile], { type: 'text/csv' });

    const formData = new FormData();
    formData.append('multipartFile', filePayload);
    formData.append(
      'campaignModel',
      new Blob([JSON.stringify(payload)], {
        type: 'application/json',
      }),
    );

    console.log(payload);

    try {
      whatsappCampaignScheduler(formData).then((res) => {
        setLoader(false);
        showSnackbar('WhatsApp Campaign Created', 'success');
        navigate('/campaigns/whatsapp');
      });
    } catch (error) {
      setLoader(false);
      showSnackbar('WhatsApp Campaign not Created', 'error');
    }
  };

  const [allLists, setAllLists] = useState([]);
  const [selectedSegmentId, setSelectedSegmentId] = useState('');
  const orgId = localStorage.getItem('orgId');
  const username = localStorage.getItem('user_name');

  const getAllLists = () => {
    getAllMarketingSegmentsList(orgId)
      .then((res) => {
        const results = res?.data?.data;
        const data = results?.map((item) => ({
          value: item?.segmentId,
          label: item?.segmentName || 'NA',
        }));
        setAllLists(data);
      })
      .catch((err) => {
        showSnackbar('Error while getting segments list', 'error');
      });
  };

  useEffect(() => {
    getAllLists();
  }, []);

  const [errorM, setErrorM] = useState('');

  const validateMediaLink = (link) => {
    const allowedExtensions = /\.(txt|xls|xlsx|doc|docx|ppt|pptx|pdf|aac|amr|mp3|mp4|ogg|opus|jpeg|jpg|png)$/i;

    if (allowedExtensions.test(link)) {
      setErrorM('');
    } else {
      setErrorM('Invalid file format. Please provide a link with an allowed format.');
    }
  };

  const handleChange = (e) => {
    const link = e.target.value;
    setMediaLink(link);
    validateMediaLink(link);
  };

  const schedulerOptions = [
    {
      label: 'Daily',
      value: 'DAILY',
    },
  ];

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
            {/* <SoftBox style={{ marginTop: '1px' }}>
            <BiArrowBack onClick={() => navigate('/campaigns/whatsapp')} style={{ cursor: 'pointer' }} />
          </SoftBox> */}
            <Typography>WhatsApp Campaign Set up</Typography>
          </div>
          <SoftBox
            py={0}
            px={0}
            sx={{
              marginTop: '1rem',
            }}
          >
            <Grid container spacing={4}>
              <Grid item lg={selectedTemplate !== '' ? 8 : 12} sm={12} md={6} xs={12}>
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
                    Campaign Name
                  </Typography>
                  <SoftInput
                    placeholder="Campaign Name"
                    style={{ width: '400px' }}
                    value={campaignName}
                    onChange={(e) => {
                      const newValue = e.target.value.toLowerCase().replace(/\s+/g, '_');
                      setCampaignName(newValue);
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
                    Give your campaign an internal name to help organize and locate it easily within your account. For
                    example: 'Course_offer'
                  </Typography>
                </SoftBox>

                <SoftBox style={{ marginTop: '30px' }}>
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
                    Name of the Template
                  </Typography>
                  <SoftInput
                    placeholder="Template Name"
                    style={{ width: '400px' }}
                    onChange={(e) => setTemplateName(e.target.value)}
                  />
                  {/* <SoftSelect placeholder="Template" style={{ width: '400px' }} options={mainTemplates} /> */}
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
                    Select the name of the Template created in Meta.
                  </Typography>
                </SoftBox>

                <SoftBox style={{ marginTop: '30px' }}>
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
                    Select Template
                  </Typography>
                  <SoftSelect
                    placeholder="Template"
                    style={{ width: '400px' }}
                    options={formatedTemplateList}
                    onChange={(option, e) => {
                      setSelectedTemplate(option.value);
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
                    Choose from a list of active templates or design a new template.
                  </Typography>
                </SoftBox>

                <SoftBox style={{ marginTop: '30px' }}>
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
                    Media Type
                  </Typography>
                  <SoftSelect
                    placeholder="Media Type"
                    style={{ width: '400px' }}
                    options={mediaTypes}
                    onChange={(options) => setMediaType(options.value)}
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
                    Choose from a list of active templates the media type used in the template
                  </Typography>
                </SoftBox>

                <SoftBox style={{ marginTop: '30px' }}>
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
                    Media Link
                  </Typography>
                  <SoftInput
                    type="text"
                    placeholder="Media Link"
                    style={{ width: '400px' }}
                    onChange={handleChange}
                    value={mediaLink}
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
                    Provide the link for the media file used in the template only in Text, Microsoft Excel, Microsoft
                    Word, Microsoft PowerPoint, PDF, AAC, AMR, MP3, MP4 Audio, OGG Audio, JPEG, or PNG format.
                  </Typography>
                  {errorM && (
                    <Typography
                      style={{
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        lineHeight: '1.5',
                        color: 'red',
                        textAlign: 'left',
                        margin: '10px 0px',
                      }}
                    >
                      {errorM}
                    </Typography>
                  )}
                </SoftBox>

                <SoftBox style={{ marginTop: '30px' }}>
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
                    Recipients
                  </Typography>
                  <SoftBox>
                    <input
                      type="checkbox"
                      id="lista"
                      name="lista"
                      value=""
                      checked={selectedList === 'lista'}
                      onChange={handleRecipientChange}
                    />
                    <label
                      htmlFor="lista"
                      style={{
                        fontWeight: '200',
                        fontSize: '0.8rem',
                        lineHeight: '1.5',
                        color: '#4b524d',
                        textAlign: 'left',
                        margin: '10px 5px',
                      }}
                    >
                      {' '}
                      Import list from system
                    </label>
                    <br />

                    <input
                      type="checkbox"
                      id="listb"
                      name="listb"
                      value=""
                      checked={selectedList === 'listb'}
                      onChange={handleRecipientChange}
                    />
                    <label
                      htmlFor="listb"
                      style={{
                        fontWeight: '200',
                        fontSize: '0.8rem',
                        lineHeight: '1.5',
                        color: '#4b524d',
                        textAlign: 'left',
                        margin: '10px 5px',
                      }}
                    >
                      {' '}
                      Import list from local
                    </label>
                  </SoftBox>
                  {selectedList === 'lista' && (
                    <SoftBox>
                      <SoftSelect
                        placeholder="Select list"
                        options={allLists}
                        onChange={(option) => setSelectedSegmentId(option.value)}
                      />
                    </SoftBox>
                  )}
                  {selectedList === 'listb' && (
                    <SoftBox className="attach-file-box" mt={3}>
                      {contactCSVFile ? (
                        <SoftBox className="logo-box-org-II">
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <img src={contactCSVFile} className="logo-box-org" />
                            <Grid item xs={12} md={6} xl={6}>
                              <SoftButton
                                onClick={() => {
                                  setContactCSVFile('');
                                }}
                              >
                                <EditIcon />
                              </SoftButton>
                            </Grid>
                          </div>
                          <SoftBox className="header-submit-box" mt={2} mb={1} lineHeight={0} display="inline-block">
                            <SoftButton
                              className="vendor-second-btn"
                              style={{ marginLeft: '10px' }}
                              onClick={() => {
                                setContactCSVFile('');
                              }}
                            >
                              Cancel
                            </SoftButton>
                          </SoftBox>
                        </SoftBox>
                      ) : (
                        <SoftBox className="add-customer-file-box-I">
                          <SoftTypography className="add-customer-file-head">Attach File(s)</SoftTypography>
                          <SoftBox className="profile-box-up">
                            <input
                              type="file"
                              name="file"
                              id="my-file"
                              className="hidden"
                              accept="application/csv, text/csv"
                              // onChange={(event) => setContactCSVFile(event.target.files[0])}
                              onChange={handleFileChange}
                            />
                            <label htmlFor="my-file" className="custom-file-upload-data-I-bills">
                              <SoftTypography className="upload-text-I">Upload File</SoftTypography>
                            </label>
                          </SoftBox>
                          {errorMessage && (
                            <Typography
                              style={{
                                fontWeight: '600',
                                fontSize: '0.9rem',
                                lineHeight: '1.5',
                                color: 'red',
                                textAlign: 'left',
                                margin: '10px 0px',
                              }}
                            >
                              {errorMessage}
                            </Typography>
                          )}
                        </SoftBox>
                      )}
                    </SoftBox>
                  )}
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
                    Choose a contact list to whom this email should be sent.
                  </Typography>
                </SoftBox>

                <SoftBox style={{ marginTop: '30px' }}>
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
                    Schedule
                  </Typography>
                  <SoftBox>
                    <input
                      type="checkbox"
                      id="schedule"
                      name="schedule"
                      value=""
                      checked={sendImm}
                      onChange={handleSendImm}
                    />
                    <label
                      htmlFor="schedule"
                      style={{
                        fontWeight: '200',
                        fontSize: '0.8rem',
                        lineHeight: '1.5',
                        color: '#4b524d',
                        textAlign: 'left',
                        margin: '10px 5px',
                      }}
                    >
                      {' '}
                      Send the email instantly
                    </label>
                    <br />

                    <input
                      type="checkbox"
                      id="schedule1"
                      name="schedule1"
                      value=""
                      checked={isCheckboxChecked}
                      onChange={handleCheckboxChange}
                    />
                    <label
                      htmlFor="schedule1"
                      style={{
                        fontWeight: '200',
                        fontSize: '0.8rem',
                        lineHeight: '1.5',
                        color: '#4b524d',
                        textAlign: 'left',
                        margin: '10px 5px',
                      }}
                    >
                      {' '}
                      When do you want to send the email?
                    </label>
                    <br />
                    {isCheckboxChecked && (
                      <SoftBox>
                        <SoftBox style={{ marginTop: '30px' }}>
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
                            Select Scheduler
                          </Typography>
                          <SoftSelect
                            placeholder="Select"
                            style={{ width: '400px' }}
                            options={schedulerOptions}
                            onChange={(option, e) => {
                              setScheduler(option?.value);
                            }}
                          />
                        </SoftBox>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <SoftBox style={{ display: 'flex', gap: '10px' }}>
                            <div>
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
                                Start Date
                              </Typography>
                              <DatePicker
                                key={renderKey}
                                {...(startDate && {
                                  value: dayjs(startDate),
                                })}
                                disablePast
                                views={['year', 'month', 'day']}
                                format="DD-MM-YYYY"
                                onChange={(date) => setStartDate(format(date.$d, 'yyyy-MM-dd'))}
                              />
                            </div>
                            <div>
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
                                End Date
                              </Typography>
                              <DatePicker
                                key={renderKey}
                                {...(endDate && {
                                  value: dayjs(endDate),
                                })}
                                disablePast
                                views={['year', 'month', 'day']}
                                format="DD-MM-YYYY"
                                onChange={(date) => setEndDate(format(date.$d, 'yyyy-MM-dd'))}
                              />
                            </div>
                          </SoftBox>
                          <div style={{ width: '250px' }}>
                            <SoftBox>
                              <input
                                type="time"
                                id="timeOutput"
                                value={scheduledTime}
                                onChange={handleTimeChange}
                                className="time-input-dynamic-coupon"
                                style={{ width: '248px', borderRadius: '8px', marginTop: '15px', height: '43px' }}
                              />
                            </SoftBox>
                          </div>
                        </LocalizationProvider>
                      </SoftBox>
                    )}
                  </SoftBox>
                </SoftBox>
              </Grid>

              {selectedTemplate !== '' && (
                <Grid item lg={4} sm={12} md={6} xs={12}>
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
                      {singleTemplate.bodytext !== '' ? (
                        <Typography
                          style={{
                            fontSize: '0.9rem',
                            lineHeight: '1.5',
                            textAlign: 'left',
                            margin: '10px 0px',
                            fontWeight: '200',
                          }}
                        >
                          {singleTemplate.bodytext}
                        </Typography>
                      ) : null}

                      {singleTemplate.footerText !== '' ? (
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
                          {singleTemplate.footerText}
                        </Typography>
                      ) : null}
                      <p className="message-preview-time">{currentTime}</p>
                      {singleTemplate.button1 !== '' ? (
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
                              {singleTemplate.button1}
                            </Typography>
                          </div>
                        </SoftBox>
                      ) : null}
                    </SoftBox>
                  </SoftBox>
                </Grid>
              )}
            </Grid>
            <SoftBox display="flex" justifyContent="flex-end" mt={4}>
              <SoftBox display="flex">
                {/* <SoftButton className="vendor-add-btn" onClick={() => setShowMobile(true)}>
                  Send test message
                </SoftButton> */}
                {/* <SoftBox ml={2}>
                  <SoftButton
                    // variant="gradient"
                    color="info"
                    className="vendor-add-btn"
                    onClick={handleCampaignScheduler}
                  >
                    Schedule
                  </SoftButton>
                </SoftBox> */}
                <SoftBox ml={2}>
                  <SoftButton className="vendor-second-btn" onClick={() => navigate('/campaigns/whatsapp')}>
                    Cancel
                  </SoftButton>
                </SoftBox>
                <SoftBox ml={2}>
                  <SoftButton
                    // variant="gradient"
                    color="info"
                    className="vendor-add-btn"
                    onClick={handleCreation}
                  >
                    {loader ? (
                      <CircularProgress
                        size={18}
                        sx={{
                          color: '#fff',
                        }}
                      />
                    ) : (
                      <>Create</>
                    )}
                  </SoftButton>
                </SoftBox>
              </SoftBox>
            </SoftBox>
            {showMobile && (
              <>
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
                    Phone Number
                  </Typography>
                  <SoftInput placeholder="Phone Number" style={{ width: '400px' }} />
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
                    Give a whatsapp number where you would like to send the test message.
                  </Typography>
                </SoftBox>
                <SoftBox display="flex" justifyContent="flex-end" mt={4}>
                  <SoftButton className="vendor-add-btn">Test</SoftButton>
                </SoftBox>
              </>
            )}
          </SoftBox>
        </Box>
      </DashboardLayout>
    </div>
  );
};

export default CreateWhatsAppCampaign;
