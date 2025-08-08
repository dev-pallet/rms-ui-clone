import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../examples/Navbars/DashboardNavbar';
import { Box, Grid, IconButton, Tooltip, Typography } from '@mui/material';
import SoftBox from '../../../../../components/SoftBox';
import SoftProgress from '../../../../../components/SoftProgress';
import SoftButton from '../../../../../components/SoftButton';
import {
  abortBulkWhatsappCampaign,
  getSingleWhatsappCampaignTemplate,
  getWhatsAppCampaignByBulkJobId,
  singlePushTemplate,
  singlePushTemplateByName,
} from '../../../../../config/Services';
import { useSnackbar } from '../../../../../hooks/SnackbarProvider';
import InfoIcon from '@mui/icons-material/Info';

const PushCampaignDetails = () => {
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
      abortBulkWhatsappCampaign(id, 'PUSH').then((res) => {
        showSnackbar('Aborted WhatsApp Campaign', 'success');
      });
    } catch (error) {
      showSnackbar('WhatsApp Campaign cannot be aborted', 'error');
    }
  };

  const getTemplate = () => {
    try {
      singlePushTemplateByName(data?.templateName).then((res) => {
        setSingleTemplate(res?.data?.data);
      });
    } catch (error) {
      showSnackbar('Template not fetched', 'error');
    }
  };

  useEffect(() => {
    if (data?.templateName) {
      getTemplate();
    }
  }, [data]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const intervalId = setInterval(updateTime, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const createdOn = new Date(data.startTime);
  const formattedDate = `${createdOn.getDate()} ${months[createdOn.getMonth()]} ${createdOn.getFullYear()}`;

  return (
    <div>
      <DashboardLayout>
        <DashboardNavbar prevLink={true} />

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
              {data?.campaignName}
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
                  {/* <span style={{ color: '#344767', fontWeight: '600' }}>{singleTemplate.headerFormate}</span> */}
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
                <SoftBox mt={3} className="push-preview-box">
                  <div className="push-campaign-mess-prev-box">
                    <img
                      src="https://static.wixstatic.com/media/a16c70_66558d16022144629d4d1d073893825b~mv2.jpg/v1/fit/w_2500,h_1330,al_c/a16c70_66558d16022144629d4d1d073893825b~mv2.jpg"
                      alt=""
                      className="push-campaign-img"
                    />
                    <Typography className="push-campaign-typo-5">Twinleaves</Typography>
                    {data?.timer && (
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
                      {data?.title !== '' && <Typography className="push-campaign-typo-6">{data?.title}</Typography>}
                      {singleTemplate?.templateFormat !== '' && (
                        <Typography className="push-campaign-typo-7">{singleTemplate?.templateFormat}</Typography>
                      )}
                    </div>
                  </div>
                  <div>
                    {data?.imageUrl !== '' && <img src={data?.imageUrl} alt="" className="push-campaign-img-2" />}
                  </div>
                  {data?.buttonName && (
                    <div>
                      <Typography className="push-campaign-typo-8">{buttonText}</Typography>
                    </div>
                  )}
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
                    Total Messages
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
                  {data?.totalRequestedData}
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
                    Messages Processed
                  </Typography>
                </div>
                <Typography
                  style={{
                    fontWeight: '600',
                    fontSize: '1.8rem',
                    lineHeight: '1.5',
                    textAlign: 'left',
                  }}
                >
                  {data?.totalProcessedData}
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
                    Messages sent
                  </Typography>
                </div>
                <Typography
                  style={{
                    fontWeight: '600',
                    fontSize: '1.8rem',
                    lineHeight: '1.5',
                    textAlign: 'left',
                  }}
                >
                  {data?.totalSuccessData}
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

export default PushCampaignDetails;
