import CloseIcon from '@mui/icons-material/Close';
import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SoftBox from '../../../../../components/SoftBox';
import SoftButton from '../../../../../components/SoftButton';
import SoftInput from '../../../../../components/SoftInput';
import SoftSelect from '../../../../../components/SoftSelect';
import DashboardLayout from '../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../examples/Navbars/DashboardNavbar';

const CreateAutomatedForm = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(localStorage.getItem('automated_campaign'));
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  const [count, setCount] = useState(1);
  const [sendCampaignBox, setSendCampaignBox] = useState([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]); // Initialize with an array of empty strings
  const [contactCSVFile, setContactCSVFile] = useState('');

  const platFormOptions = ['SMS', 'Whatsapp', 'Email', 'Push Notifications']; // Replace with your actual platform options

  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setContactCSVFile(selectedFile);
  };

  useEffect(() => {
    localStorage.setItem('automated_campaign', selectedTemplate);
  }, [selectedTemplate]);

  const handlePlatformChange = (platform) => {
    if (selectedPlatforms.includes(platform)) {
      // If platform is already selected, remove it
      setSelectedPlatforms((prevSelected) => prevSelected.filter((selected) => selected !== platform));
    } else {
      // If platform is not selected, add it
      setSelectedPlatforms((prevSelected) => [...prevSelected, platform]);
    }
  };

  const getTemplatesForPlatform = (platform) => {
    switch (platform) {
      case 'SMS':
        return SMSTemplates; // Replace with your SMS templates array
      case 'Email':
        return EmailTemplates; // Replace with your Email templates array
      case 'Push Notifications':
        return PushTemplates; // Replace with your Push templates array
      case 'Whatsapp':
        return WhatsappTemplates; // Replace with your Whatsapp templates array
      default:
        return []; // Return an empty array or handle the default case based on your requirements
    }
  };

  const timeOptions = [
    {
      label: 'Minutes',
      value: 'minutes',
    },
    {
      label: 'Hours',
      value: 'hours',
    },
    {
      label: 'Days',
      value: 'days',
    },
  ];

  const SMSTemplates = [
    {
      label: 'SMS Template 1',
      value: 'SMS Template 1',
    },
    {
      label: 'SMS Template 2',
      value: 'SMS Template 2',
    },
    {
      label: 'SMS Template 3',
      value: 'SMS Template 3',
    },
  ];

  const EmailTemplates = [
    {
      label: 'Email Template 1',
      value: 'Email Template 1',
    },
    {
      label: 'Email Template 2',
      value: 'Email Template 2',
    },
    {
      label: 'Email Template 3',
      value: 'Email Template 3',
    },
  ];

  const PushTemplates = [
    {
      label: 'Push Template 1',
      value: 'Push Template 1',
    },
    {
      label: 'Push Template 2',
      value: 'Push Template 2',
    },
    {
      label: 'Push Template 3',
      value: 'Push Template 3',
    },
  ];

  const WhatsappTemplates = [
    {
      label: 'Whatsapp Template 1',
      value: 'Whatsapp Template 1',
    },
    {
      label: 'Whatsapp Template 2',
      value: 'Whatsapp Template 2',
    },
    {
      label: 'Whatsapp Template 3',
      value: 'Whatsapp Template 3',
    },
  ];

  const addBox = () => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push(
        <div key={i}>
          <SoftBox>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <CloseIcon sx={{ marginTop: '5px' }} onClick={() => setCount((prev) => prev - 1)} />
            </div>
          </SoftBox>
          {selectedPlatforms.length !== 0 && (
            <SoftBox>
              <SoftBox className="select-template-automated-box">
                {selectedPlatforms.map((platform, index) => (
                  <div key={index}>
                    <Typography
                      style={{
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        lineHeight: '1.5',
                        color: '#0562FB',
                        textAlign: 'left',
                        margin: '10px 0px',
                      }}
                    >{`Select Template for ${platform}`}</Typography>
                    <SoftSelect options={getTemplatesForPlatform(platform)} />
                  </div>
                ))}
              </SoftBox>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                <SoftButton className="vendor-add-btn">Preview</SoftButton>
              </div>
            </SoftBox>
          )}
          <SoftBox style={{ marginBottom: '20px' }}>
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
              Send this
            </Typography>
            <div style={{ display: 'flex', gap: '40px', width: '50%' }}>
              <SoftInput placeholder="Enter time" />
              <SoftSelect placeholder="Select" options={timeOptions} />
            </div>
          </SoftBox>
          <hr />
        </div>,
      );
    }
    setSendCampaignBox(arr);
  };

  const handleCheckboxChange = (event) => {
    setIsCheckboxChecked(event.target.checked);
    setCount(1);
    addBox();
  };

  const allJourneys = [
    {
      label: 'Welcome message',
      value: 'welcome_message',
    },
    {
      label: 'Abandoned cart',
      value: 'abandoned_cart',
    },
    {
      label: 'Customer birthday',
      value: 'customer_birthday',
    },
    {
      label: 'New offers or promotions',
      value: 'new_offers_promotions',
    },
    {
      label: 'Last purchase or visit',
      value: 'last_purchase_visit',
    },
    {
      label: 'Visits on the brand page in app',
      value: 'visits_on_brand_page',
    },
    {
      label: 'Visits on a particular product page in app',
      value: 'visit_on_product_page',
    },
    {
      label: 'Re-engage dormant customers with restocking alerts',
      value: 'restocking_alerts',
    },
    {
      label: 'Product feedback/ ratings',
      value: 'product_feedback',
    },
    {
      label: 'Delivery feedback/ ratings',
      value: 'deliver_feedbacks',
    },
    {
      label: 'New product launch',
      value: 'new_product_launch',
    },
    {
      label: 'Encourage online reviews',
      value: 'encourage_online_reviews',
    },
    {
      label: 'Product price drops',
      value: 'product_price_drops',
    },
  ];

  useEffect(() => {
    addBox();
  }, [count, selectedPlatforms]);

  const ListOptions = [
    {
      value: 'List 1',
      label: 'List 1',
    },
    {
      value: 'List 2',
      label: 'List 2',
    },
    {
      value: 'List 3',
      label: 'List 3',
    },
    {
      value: 'List 4',
      label: 'List 4',
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
            <Typography>Campaign details</Typography>
          </div>
          <SoftBox
            py={0}
            px={0}
            sx={{
              marginTop: '1rem',
            }}
          >
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
                Campaign Type
              </Typography>
              <SoftSelect
                placeholder="Campaign Type"
                options={allJourneys}
                onChange={(option, e) => {
                  setSelectedTemplate(option.label);
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
                Select the pre-built Journey you want to use to send an automated campaign.
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
                Recipients
              </Typography>
              <SoftSelect placeholder="Select List" options={ListOptions} />
              {/* <SoftBox className="attach-file-box" mt={3}>
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
                      <label for="my-file" className="custom-file-upload-data-I-bills">
                        <SoftTypography className="upload-text-I">Upload File</SoftTypography>
                      </label>
                    </SoftBox>
                  </SoftBox>
                )}
              </SoftBox> */}
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
            <SoftBox style={{ marginTop: '20px', display: 'flex', gap: '50px' }}>
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
                Segment
              </Typography>
              <Typography
                style={{
                  fontWeight: '600',
                  fontSize: '1rem',
                  lineHeight: '1.5',
                  color: '#4b524d',
                  textAlign: 'left',
                  margin: '10px 0px',
                }}
              >
                {selectedTemplate}
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
                Distribution Channels
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
                Select the distribution channels you want to send your campaign with.
              </Typography>
              <SoftBox className="selected-platform-box">
                {platFormOptions.map((platform) => (
                  <div key={platform}>
                    <input
                      type="checkbox"
                      id={`platform-${platform}`}
                      name={`platform-${platform}`}
                      checked={selectedPlatforms.includes(platform)}
                      onChange={() => handlePlatformChange(platform)}
                    />
                    <label
                      htmlFor={`platform-${platform}`}
                      style={{
                        fontWeight: '200',
                        fontSize: '0.8rem',
                        lineHeight: '1.5',
                        color: '#4b524d',
                        textAlign: 'left',
                        margin: '10px 10px',
                      }}
                    >
                      {' '}
                      {platform}
                    </label>
                  </div>
                ))}
              </SoftBox>
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
                Steps included in your campaign
              </Typography>
              <SoftBox>
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
                    margin: '10px 0px',
                  }}
                >
                  {' '}
                  When do you want to send the campaign?
                </label>
                {isCheckboxChecked && (
                  <SoftBox className="automated-form-send-box">
                    {sendCampaignBox}

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography
                        style={{
                          fontWeight: '200',
                          fontSize: '0.8rem',
                          lineHeight: '1.5',
                          color: '#0562FB',
                          textAlign: 'left',
                          margin: '10px 0px',
                          cursor: 'pointer',
                        }}
                        onClick={() => setCount((prev) => prev + 1)}
                      >
                        Add More
                      </Typography>
                    </div>
                  </SoftBox>
                )}
              </SoftBox>
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
                Exit Criteria
              </Typography>
              <SoftBox>
                <input type="checkbox" id="schedule" name="schedule" value="" />
                <label
                  htmlFor="schedule"
                  style={{
                    fontWeight: '200',
                    fontSize: '0.8rem',
                    lineHeight: '1.5',
                    color: '#4b524d',
                    textAlign: 'left',
                    margin: '10px 0px',
                  }}
                >
                  {' '}
                  When all the campaigns are sent
                </label>
              </SoftBox>
              <SoftBox>
                <input type="checkbox" id="schedule" name="schedule" value="" />
                <label
                  htmlFor="schedule"
                  style={{
                    fontWeight: '200',
                    fontSize: '0.8rem',
                    lineHeight: '1.5',
                    color: '#4b524d',
                    textAlign: 'left',
                    margin: '10px 0px',
                  }}
                >
                  {' '}
                  When the customer makes a purchase
                </label>
              </SoftBox>
            </SoftBox>
            <SoftBox display="flex" justifyContent="flex-end" mt={4}>
              <SoftBox display="flex">
                <SoftButton className="vendor-second-btn" onClick={() => navigate('/marketing/campaigns/automated')}>
                  Cancel
                </SoftButton>
                <SoftBox ml={2}>
                  <SoftButton
                    // variant="gradient"
                    color="info"
                    className="vendor-add-btn"
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

export default CreateAutomatedForm;
