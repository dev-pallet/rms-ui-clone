import { Box, Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import SoftBox from '../../../../../components/SoftBox';
import SoftInput from '../../../../../components/SoftInput';
import SoftSelect from '../../../../../components/SoftSelect';
import SoftTypography from '../../../../../components/SoftTypography';
import DashboardLayout from '../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../examples/Navbars/DashboardNavbar';

import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import EditIcon from '@mui/icons-material/Edit';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import { format } from 'date-fns';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import SoftButton from '../../../../../components/SoftButton';
import {
  createBulkPushCampaign,
  getAllBulkPushTemplates,
  getAllMarketingSegmentsList,
  singlePushTemplate,
} from '../../../../../config/Services';
import { useSnackbar } from '../../../../../hooks/SnackbarProvider';

const PushCampaignCreations = () => {
  const [contactCSVFile, setContactCSVFile] = useState('');
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  const [endDate, setEndDate] = useState('');
  const [renderKey, setRenderKey] = useState(0);
  const [isButtonNeeded, setIsButtonNeeded] = useState(false);

  const [buttonText, setButtonText] = useState('');

  const [campaignName, setCampaignName] = useState('');

  const [allTemplates, setAllTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [formatedTemplateList, setFormatedTemplateList] = useState([]);
  const [selectedTemplateValue, setSelectedTemplateValue] = useState('');
  const [singleTemplate, setSingleTemplate] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [allLists, setAllLists] = useState([]);
  const [selectedSegmentId, setSelectedSegmentId] = useState('');

  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const [errorMessage, setErrorMessage] = useState('');

  const [isTimeStampNeeded, setIsTimeStampNeeded] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [scheduler, setScheduler] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');

  const handleTimeChange1 = (event) => {
    setScheduledTime(event.target.value);
  };

  const [selectedList, setSelectedList] = useState('');

  // Function to handle checkbox selection
  const handleRecipientChange = (event) => {
    const { id } = event.target;
    setSelectedList(id);
  };

  const navigate = useNavigate();
  const handleCheckboxChange = (event) => {
    setIsCheckboxChecked(event.target.checked);
  };

  const handleButtonNeeded = (event) => {
    setIsButtonNeeded(event.target.checked);
  };

  const handleTimeStampChecked = (event) => {
    setIsTimeStampNeeded(event.target.checked);
  };

  let dataArr;
  const getListOfTemplates = async () => {
    try {
      const res = await getAllBulkPushTemplates();

      dataArr = res?.data?.data?.filter((template) => template.templateType === 'PUSH');

      setAllTemplates(dataArr);
    } catch (error) {}
  };

  useEffect(() => {
    getListOfTemplates();
  }, []);

  useEffect(() => {
    const formattedData = allTemplates.map((category) => ({
      value: `${category.templateId}`,
      label: `${category.templateName}`,
    }));
    setFormatedTemplateList(formattedData);
  }, [allTemplates]);

  const getSingleTemplate = () => {
    try {
      singlePushTemplate(selectedTemplateValue).then((res) => {
        setSingleTemplate(res?.data?.data);
      });
    } catch (error) {
      showSnackbar('Template Not Fetched', 'error');
    }
  };

  useEffect(() => {
    if (selectedTemplate !== '') {
      getSingleTemplate();
    }
  }, [selectedTemplate]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const content = e.target.result;
        const rows = content.split('\n');
        const header = rows[0].trim();

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
      setContactCSVFile(null);
      setErrorMessage('');
    }
  };

  const handleInputChange = (event) => {
    const text = event.target.value;
    setTitle(text);
    setCursorPosition(event.target.selectionStart);
  };

  const handleEmojiSelect = (emoji) => {
    const newText = title.slice(0, cursorPosition) + emoji.native + title.slice(cursorPosition);
    setTitle(newText);
    setCursorPosition(cursorPosition + emoji.native.length);
    setShowEmojiPicker(false);
  };

  const clientId = localStorage.getItem('clientId');
  const orgId = localStorage.getItem('orgId');
  const showSnackbar = useSnackbar();
  const username = localStorage.getItem('user_name');

  const handlePushCampaignCreation = () => {
    if (!clientId) {
      showSnackbar('Client Id not found', 'error');
      return;
    }

    if (!scheduler || !scheduledTime || !endDate || !startDate || !selectedTemplate || !campaignName) {
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
      templateName: selectedTemplate,
      title: title,
      token: 'string',
      templateData: {},
      orgId: orgId,
      imageUrl: imageUrl,
      scheduler: scheduler,
      scheduledTime: formattedScheduledTime,
      segmentId: selectedSegmentId || '',
      reportType: 'CSV',
      reportCreatedBy: 'NMS',
      reportJobType: 'FIXED',
      reportFrequency: 'DAILY',
      noOfTimesToCreateReport: '5',
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      daysRunning: 0,
      createdBy: username,
      triggered: false,
      buttonName: isButtonNeeded ? buttonText : '',
      timer: isTimeStampNeeded ? time * 60000 : 0,
    };

    const filePayload = new Blob([contactCSVFile], { type: 'text/csv' });

    const formData = new FormData();
    formData.append('multipartFile', filePayload);
    formData.append(
      'schedulePushRequest',
      new Blob([JSON.stringify(payload)], {
        type: 'application/json',
      }),
    );

    try {
      createBulkPushCampaign(formData).then((res) => {
        showSnackbar('Push Campaign Created', 'success');
        navigate('/campaigns/push');
      });
    } catch (error) {
      showSnackbar('Push Campaign Template not Created', 'error');
    }
  };

  const [time, setTime] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!time) {
      return;
    }

    const timeInSeconds = parseInt(time) * 60;

    // Start the timer
    setTimeLeft(timeInSeconds);

    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(intervalId); // Stop the timer when timeLeft reaches 0
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId); // Clean up the interval on component unmount
  }, [time]);

  const handleTimeChange = (e) => {
    setTime(e.target.value);
  };

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

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
        <Box className="table-css-fix-box-scroll-vend" id="box-shadow-1">
          <div style={{ display: 'flex', gap: '10px' }}>
            {/* <SoftBox style={{ marginTop: '1px' }}>
            <BiArrowBack onClick={() => navigate('/campaigns/whatsapp')} style={{ cursor: 'pointer' }} />
          </SoftBox> */}
            <Typography>Push Notification Campaign Set up</Typography>
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
                  <Typography className="push-campaign-typo-1">Campaign Name</Typography>
                  <SoftInput
                    placeholder="Campaign Name"
                    value={campaignName}
                    onChange={(e) => {
                      const newValue = e.target.value.toLowerCase().replace(/\s+/g, '_');
                      setCampaignName(newValue);
                    }}
                  />
                  <Typography className="push-campaign-typo-2">
                    Give your campaign an internal name to help organize and locate it easily within your account. For
                    example: 'Course_offer'
                  </Typography>
                </SoftBox>
                <SoftBox style={{ marginTop: '30px' }}>
                  <Typography className="push-campaign-typo-1">Select Template</Typography>
                  <SoftSelect
                    placeholder="Template"
                    style={{ width: '400px' }}
                    options={formatedTemplateList}
                    onChange={(option) => {
                      setSelectedTemplate(option.label), setSelectedTemplateValue(option.value);
                    }}
                  />
                  <Typography className="push-campaign-typo-2">
                    Choose from a list of active templates or design a new template.
                  </Typography>
                </SoftBox>
                <SoftBox style={{ marginTop: '20px' }}>
                  <Typography className="push-campaign-typo-1">Title</Typography>
                  <SoftInput placeholder="Campaign Title" value={title} onChange={handleInputChange} />
                  <SoftBox className="emoji-selector">
                    <EmojiEmotionsIcon onClick={() => setShowEmojiPicker(!showEmojiPicker)} />
                  </SoftBox>

                  {showEmojiPicker && <Picker data={data} onEmojiSelect={handleEmojiSelect} />}
                </SoftBox>
                <SoftBox style={{ marginTop: '20px' }}>
                  <Typography className="push-campaign-typo-1">Media Url</Typography>
                  <SoftInput placeholder="Media URL" onChange={(e) => setImageUrl(e.target.value)} />
                </SoftBox>

                <SoftBox style={{ marginTop: '30px' }}>
                  <Typography className="push-campaign-typo-1">Add Buttons</Typography>
                  <SoftBox>
                    <input
                      type="checkbox"
                      id="schedule"
                      name="schedule"
                      value=""
                      checked={isButtonNeeded}
                      onChange={handleButtonNeeded}
                    />
                    <label htmlFor="schedule" className="push-campaign-typo-2">
                      {' '}
                      Button
                    </label>
                    <br />
                    {isButtonNeeded && (
                      <>
                        <SoftBox style={{ margin: '10px 0px' }}>
                          <Typography className="push-campaign-typo-1">Button Text</Typography>
                          <SoftInput placeholder="Button Text" onChange={(e) => setButtonText(e.target.value)} />
                        </SoftBox>
                      </>
                    )}

                    <input
                      type="checkbox"
                      id="schedule1"
                      name="schedule1"
                      value=""
                      checked={isTimeStampNeeded}
                      onChange={handleTimeStampChecked}
                    />
                    <label htmlFor="schedule1" className="push-campaign-typo-2">
                      {' '}
                      Time Stamp
                    </label>
                    <br />
                    {isTimeStampNeeded && (
                      <>
                        <SoftBox style={{ margin: '10px 0px' }}>
                          <Typography className="push-campaign-typo-1">Enter Time in Minutes</Typography>
                          <SoftInput placeholder="Time in minutes" onChange={handleTimeChange} value={time} />
                        </SoftBox>
                      </>
                    )}
                  </SoftBox>
                </SoftBox>

                <SoftBox style={{ marginTop: '30px' }}>
                  <Typography className="push-campaign-typo-1">Recipients</Typography>
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
                </SoftBox>
                <SoftBox style={{ marginTop: '30px' }}>
                  <Typography className="push-campaign-typo-1">Schedule</Typography>
                  <SoftBox>
                    {/* <input type="checkbox" id="schedule" name="schedule" value="" />
                    <label htmlFor="schedule" className="push-campaign-typo-2">
                      {' '}
                      Send the notification instantly
                    </label>
                    <br /> */}

                    <input
                      type="checkbox"
                      id="schedule1"
                      name="schedule1"
                      value=""
                      checked={isCheckboxChecked}
                      onChange={handleCheckboxChange}
                    />
                    <label htmlFor="schedule1" className="push-campaign-typo-2">
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
                                onChange={handleTimeChange1}
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
                  <Typography className="push-campaign-typo-3">Message Preview</Typography>
                  <Typography className="push-campaign-typo-4">
                    The preview providers a general idea of how your message will appear on a mobile device Actual
                    message rendering will very depending on the device.Test with a real device for actual results
                  </Typography>
                  <SoftBox mt={3} className="push-preview-box">
                    <div className="push-campaign-mess-prev-box">
                      <img
                        src="https://static.wixstatic.com/media/a16c70_66558d16022144629d4d1d073893825b~mv2.jpg/v1/fit/w_2500,h_1330,al_c/a16c70_66558d16022144629d4d1d073893825b~mv2.jpg"
                        alt=""
                        className="push-campaign-img"
                      />
                      <Typography className="push-campaign-typo-5">Twinleaves</Typography>
                      {isTimeStampNeeded && (
                        <div>
                          <Typography className="push-campaign-typo-5">
                            {hours.toString().padStart(2, '0')}:{minutes.toString().padStart(2, '0')}:
                            {seconds.toString().padStart(2, '0')}
                          </Typography>
                        </div>
                      )}
                    </div>
                    <div className="push-campaign-mess-prev-box">
                      <div>
                        {title !== '' && <Typography className="push-campaign-typo-6">{title}</Typography>}
                        {singleTemplate.templateFormat !== '' && (
                          <Typography className="push-campaign-typo-7">{singleTemplate.templateFormat}</Typography>
                        )}
                      </div>
                    </div>
                    <div>{imageUrl !== '' && <img src={imageUrl} alt="" className="push-campaign-img-2" />}</div>
                    {isButtonNeeded && (
                      <div>
                        <Typography className="push-campaign-typo-8">{buttonText}</Typography>
                      </div>
                    )}
                  </SoftBox>
                </Grid>
              )}
            </Grid>
            <SoftBox display="flex" justifyContent="flex-end" mt={4}>
              <SoftBox display="flex">
                {/* <SoftButton className="vendor-add-btn">Send Test Message</SoftButton> */}
                <SoftBox ml={2}>
                  <SoftButton className="vendor-second-btn" onClick={() => navigate('/campaigns/push')}>
                    Cancel
                  </SoftButton>
                </SoftBox>
                <SoftBox ml={2}>
                  <SoftButton
                    // variant="gradient"
                    color="info"
                    className="vendor-add-btn"
                    onClick={handlePushCampaignCreation}
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

export default PushCampaignCreations;
