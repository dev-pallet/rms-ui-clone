import InfoIcon from '@mui/icons-material/Info';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import { Box, Grid, IconButton, Tooltip, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SoftBox from '../../../../../components/SoftBox';
import SoftButton from '../../../../../components/SoftButton';
import SoftProgress from '../../../../../components/SoftProgress';
import {
  abortBulkWhatsappCampaign,
  getSingleWhatsappCampaignTemplate,
  getWhatsAppCampaignByBulkJobId,
} from '../../../../../config/Services';
import DashboardLayout from '../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../examples/Navbars/DashboardNavbar';
import { useSnackbar } from '../../../../../hooks/SnackbarProvider';

const WhatsappCampaignStats = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const showSnackbar = useSnackbar();
  const [sendPercent, setSendPercent] = useState();
  const [singleTemplate, setSingleTemplate] = useState([]);
  const [currentTime, setCurrentTime] = useState('');

  // local storage items
  const clientId = localStorage.getItem('clientId');
  const company = localStorage.getItem('orgName');

  function calculatePercentage(number, total) {
    const percentage = (number / total) * 100;
    return Math.round(percentage);
  }

  const getWhatsAppStats = () => {
    try {
      getWhatsAppCampaignByBulkJobId(id, clientId).then((res) => {
        setData(res?.data?.data);
        const percent = calculatePercentage(res?.data?.data?.totalSuccessData, res?.data?.data?.totalRequestedData);
        setSendPercent(percent);
      });
    } catch (error) {}
  };

  useEffect(() => {
    getWhatsAppStats();
  }, [sendPercent]);

  const abortBulk = () => {
    try {
      abortBulkWhatsappCampaign(id, 'WHATSAPP').then((res) => {
        showSnackbar('Aborted WhatsApp Campaign', 'success');
      });
    } catch (error) {
      showSnackbar('WhatsApp Campaign cannot be aborted', 'error');
    }
  };

  const getTemplate = () => {
    try {
      getSingleWhatsappCampaignTemplate(data.templateName).then((res) => {
        setSingleTemplate(res?.data?.data);
      });
    } catch (error) {
      showSnackbar('Template not fetched', 'error');
    }
  };

  useEffect(() => {
    getTemplate();
  }, [data]);

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
  }
  // else if (singleTemplate.headerFormate === 'IMAGE' && singleTemplate.mediaUrl !== '') {
  //   mediaPreview = <img src={URL.createObjectURL(singleTemplate.mediaUrl)} style={{ width: '250px', height: '150px' }} />;
  // }
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

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const createdOn = new Date(data.startTime);
  const formattedDate = `${createdOn.getDate()} ${months[createdOn.getMonth()]} ${createdOn.getFullYear()}`;

  return (
    <div>
      <DashboardLayout>
        <DashboardNavbar prevLink={true} />
        {/* <SoftBox style={{ marginTop: '1px' }}>
          <BiArrowBack onClick={() => navigate('/campaigns/whatsapp')} style={{ cursor: 'pointer' }} />
        </SoftBox> */}
        <div style={{ display: 'flex', gap: '5px', marginBottom: '20px' }}>
          <img src="https://i.imgur.com/LW64F2e.png" style={{ height: '70px', width: '70px' }} />
          <div>
            <Typography
              style={{
                fontWeight: '600',
                fontSize: '1.4rem',
                lineHeight: '1.5',
                textAlign: 'left',
                margin: '10px 20px',
              }}
            >
              Friday sale campaign
            </Typography>
            <Typography
              style={{
                fontWeight: '600',
                fontSize: '1rem',
                lineHeight: '1.5',
                textAlign: 'left',
                color: '#4b524d',
                margin: '0px 20px',
              }}
            >
              {formattedDate}
            </Typography>
          </div>
        </div>
        <Box
          className="table-css-fix-box-scroll-vend"
          style={{
            boxShadow: 'rgba(37, 37, 37, 0.126) 0px 5px 50px',
            position: 'relative',
            padding: '20px',
          }}
        >
          <SoftBox
            py={0}
            px={0}
            sx={{
              marginTop: '1rem',
            }}
          >
            <Typography
              style={{
                fontWeight: '600',
                fontSize: '1.2rem',
                lineHeight: '1.5',
                color: '#0562FB',
                textAlign: 'left',
                margin: '10px 0px',
              }}
            >
              Campaign Details
            </Typography>
            <Grid container spacing={8} style={{ marginBottom: '30px' }}>
              <Grid item xs={12} lg={6}>
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
                  Company Name: <span style={{ color: '#344767', fontWeight: '600' }}>{company}</span>
                </Typography>
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
                  Campaign Type: <span style={{ color: '#344767', fontWeight: '600' }}>Marketing</span>
                </Typography>
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
                  Template Name: <span style={{ color: '#344767', fontWeight: '600' }}>{data.templateName}</span>
                </Typography>
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
                  Media Type:{' '}
                  <span style={{ color: '#344767', fontWeight: '600' }}>{singleTemplate.headerFormate}</span>
                </Typography>
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
                  Recipient List: <span style={{ color: '#344767', fontWeight: '600' }}>List Name</span>
                </Typography>
                {/* <div style={{marginTop: "20px", marginLeft: "50px"}}>
                  <CustomDoughnutChart value={calculatePercent(messagesRead, messagesDelivered)} total={messagesDelivered} />
                </div> */}
              </Grid>
              <Grid item xs={12} lg={6}>
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
                <SoftBox className="message-preview-inner">
                  <SoftBox className="media-message-preview">{mediaPreview}</SoftBox>
                  <SoftBox style={{ width: '250px' }}>
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
            </Grid>
            <Typography
              style={{
                fontWeight: '600',
                fontSize: '1.2rem',
                lineHeight: '1.5',
                color: '#0562FB',
                textAlign: 'left',
                margin: '10px 0px',
              }}
            >
              Performance
            </Typography>
            <div className="stats-typo-details">
              <div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Typography
                    style={{
                      fontWeight: '200',
                      fontSize: '1rem',
                      lineHeight: '1.5',
                      color: '#4b524d',
                      textAlign: 'left',
                      marginTop: '10px',
                    }}
                  >
                    Messages Sent
                  </Typography>
                  <Tooltip title="The actual messages delivered from our business" placement="top">
                    <IconButton>
                      <InfoIcon />
                    </IconButton>
                  </Tooltip>
                </div>
                <Typography
                  style={{
                    fontWeight: '600',
                    fontSize: '1.8rem',
                    lineHeight: '1.5',
                    textAlign: 'left',
                  }}
                >
                  {data.totalSuccessData}
                </Typography>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Typography
                    style={{
                      fontWeight: '200',
                      fontSize: '1rem',
                      lineHeight: '1.5',
                      color: '#4b524d',
                      textAlign: 'left',
                      marginTop: '10px',
                    }}
                  >
                    Messages Delivered
                  </Typography>
                  <Tooltip
                    title="The actual messages delivered to the customers. For exact data please refer to your Meta business acccount"
                    placement="top"
                  >
                    <IconButton>
                      <InfoIcon />
                    </IconButton>
                  </Tooltip>
                </div>
                <Typography
                  style={{
                    fontWeight: '600',
                    fontSize: '0.7rem',
                    lineHeight: '1.5',
                    textAlign: 'left',
                  }}
                >
                  Check Meta for Exact data
                </Typography>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Typography
                    style={{
                      fontWeight: '200',
                      fontSize: '1rem',
                      lineHeight: '1.5',
                      color: '#4b524d',
                      textAlign: 'left',
                      marginTop: '10px',
                    }}
                  >
                    Messages read
                  </Typography>
                  <Tooltip
                    title="The actual messages read by the customers. For exact data please refer to your Meta business acccount"
                    placement="top"
                  >
                    <IconButton>
                      <InfoIcon />
                    </IconButton>
                  </Tooltip>
                </div>
                <Typography
                  style={{
                    fontWeight: '600',
                    fontSize: '0.7rem',
                    lineHeight: '1.5',
                    textAlign: 'left',
                  }}
                >
                  Check Meta for Exact data
                </Typography>
              </div>
            </div>
            {/* <DefaultLineChart title="Campaign Overview" chart={gradientLineChartDataStats} /> */}
          </SoftBox>

          <SoftBox
            py={0}
            px={0}
            sx={{
              marginTop: '3rem',
            }}
          >
            <Typography
              style={{
                fontWeight: '600',
                fontSize: '1.2rem',
                lineHeight: '1.5',
                color: '#0562FB',
                textAlign: 'left',
                margin: '10px 0px',
              }}
            >
              Progress
            </Typography>
            <SoftBox style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <SoftBox style={{ width: '85%' }}>
                <div>
                  <SoftProgress variant="gradient" value={sendPercent} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography style={{ margin: '15px', fontSize: '13px', fontWeight: '200' }}>
                    {data.totalSuccessData}/{data.totalRequestedData} Messages sent
                  </Typography>
                  <Typography style={{ margin: '15px', fontSize: '13px', fontWeight: '200' }}>
                    {sendPercent}% uploaded
                  </Typography>
                </div>
              </SoftBox>
              <SoftButton color="error" style={{ width: '10%' }} onClick={abortBulk}>
                Abort
              </SoftButton>
            </SoftBox>
          </SoftBox>
        </Box>
      </DashboardLayout>
    </div>
  );
};

export default WhatsappCampaignStats;
