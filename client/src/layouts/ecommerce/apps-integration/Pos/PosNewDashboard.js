import { Card, Container, Grid, Icon, Paper, Typography } from '@mui/material';
import {
  dashBoardDetails,
  getAllSessionServiceDetails,
  getLocationActivity,
  paymentMethodsData,
  salesLeaderBoard,
} from '../../../../config/Services';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import Counter from '../../Pallet-pay/AnimateCounter';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import DefaultDoughnutChart from 'examples/Charts/DoughnutCharts/DefaultDoughnutChart';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import GradientLineChart from '../../../../examples/Charts/LineCharts/GradientLineChart';
import ReportIcon from '@mui/icons-material/Report';
import SettingsIcon from '@mui/icons-material/Settings';
import SoftBox from '../../../../components/SoftBox';
import SoftButton from '../../../../components/SoftButton';
import SoftTypography from '../../../../components/SoftTypography';
import gradientLineChartData from 'layouts/dashboards/default/data/gradientLineChartData';

import './PosNewDashboard.css';
import { isSmallScreen } from '../../Common/CommonFunction';
import BottomNavbar from '../../../../examples/Navbars/BottomNavbarMob';
import FormField from './components/formfield';
import MobileNavbar from '../../../../examples/Navbars/MobileNavbar/mobile-navbar-drawer';
import usePreviousDayChecker from '../../../../hooks/useDayChecker';

const PosNewDashboard = () => {
  const currentDate = new Date();
  const isMobileDevice = isSmallScreen();
  const options = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  };
  const formattedDate = currentDate.toLocaleString('en-US', options);
  const navigate = useNavigate();
  const [sessionData, setSessionData] = useState([]);
  const [getReportData, setGetReportData] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isPreviousDay, setIsPreviousDay] = useState('');
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [audioSrc, setAudioSrc] = useState('https://streamer.radio.co/sae99e04ea/listen');
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [dailogeopen, setdailogeOpen] = useState(false);
  const [audioUrl, SetAudioURL] = useState('');
  const [chartData, setChartData] = useState({
    labels: ['No Data Available'],
    datasets: {
      label: 'Projects',
      backgroundColors: ['secondary', 'primary', 'dark', 'info', 'primary'],
      data: [1],
    },
  });
  const [salesLeaderBoardData, setSalesLeaderBoard] = useState();
  const handleClickOpendailoge = () => {
    setdailogeOpen(true);
  };

  const handleClosedailog = () => {
    setdailogeOpen(false);
  };

  useEffect(() => {
    const storedAudioSrc = localStorage.getItem('audioSrc');
    if (storedAudioSrc) {
      setAudioSrc(storedAudioSrc);
    }
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('ended', handleAudioEnded);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', handleAudioEnded);
      }
    };
  }, []);
  const [error, setError] = useState(false);

  const handleError = () => {
    setError(true);
  };

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  const handleSeek = (e) => {
    const newTime = e.target.value;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleAudioEnded = () => {
    audioRef.current.currentTime = 0;
    audioRef.current.play();
  };

  const handleStop = () => {
    setIsPlaying(false);
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  };

  const handleDefault = () => {
    handleClose();
    setAudioSrc('https://streamer.radio.co/sae99e04ea/listen');
    localStorage.setItem('audioSrc', 'https://streamer.radio.co/sae99e04ea/listen');
    setIsPlaying(false);
    setError(false);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setAudioSrc(fileUrl);
      localStorage.setItem('audioSrc', fileUrl);
      setIsPlaying(false);
    }
    handleClose();
  };

  const handleAudioUpload = () => {
    setAudioSrc(audioUrl);
    localStorage.setItem('audioSrc', audioUrl);
    setIsPlaying(false);
    handleClose();
    handleClosedailog();
    SetAudioURL('');
    setError(false);
  };

  useEffect(() => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    const currDate = `${year}-${month}-${day}`;
    const previousDate = new Date(currentDate);
    previousDate.setDate(currentDate.getDate() - 7);
    const prevYear = previousDate.getFullYear();
    const prevMonth = (previousDate.getMonth() + 1).toString().padStart(2, '0');
    const prevDay = previousDate.getDate().toString().padStart(2, '0');
    const formattedPrevDate = `${prevYear}-${prevMonth}-${prevDay}`;
    const payload = {
      startDate: currDate,
      endDate: currDate,
      orgId: orgId,
      locationId: locId,
    };

    paymentMethodsData(payload)
      .then((res) => {
        if (
          res?.data?.data?.es === 0 &&
          res?.data?.data?.salesData !== undefined &&
          res?.data?.data?.orderResponseModel === undefined
        ) {
          const cardValue = res?.data?.data?.salesData?.cardOrders || 0;
          const cardOrderValue = res?.data?.data?.salesData?.cardOrdersValue || 0;
          const upiValue = res?.data?.data?.salesData?.upiOrders || 0;
          const upiOrderValue = res?.data?.data?.salesData?.upiOrdersValue || 0;
          const cashValue = res?.data?.data?.salesData?.cashOrders || 0;
          const cashOrderValue = res?.data?.data?.salesData?.cashOrdersValue || 0;

          setChartData({
            labels: ['Cash', 'UPI', 'Card'],

            datasets: {
              label: 'Projects',
              backgroundColors: ['darkblue', 'blue', 'green'],
              data: [cashValue, upiValue, cardValue],
            },
          });
          setGetReportData(res?.data?.data?.salesData);
        }
      })
      .catch((err) => {});
  }, []);
  const onSettings = () => {
    navigate('/pos/settings');
  };

  const onActivePos = (licenseType) => {
    navigate(`/pos/addposmachines/${licenseType}`);
  };

  useEffect(() => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    const currDate = `${year}-${month}-${day}`;
    const payload = {
      startDate: currDate,
      endDate: currDate,
      orgId: orgId,
      locationId: locId,

      frequency: 'day',
    };
    salesLeaderBoard(payload)
      .then((res) => {
        setSalesLeaderBoard(res?.data?.data?.leaderBoard);
      })
      .catch((err) => {});
  }, []);

  const [activeStat, setActiveStat] = useState('');
  const [isLoading, setIsloading] = useState(false);
  const [dayDate, setDayDate] = useState('');
  const [sessionId, setSessionId] = useState(localStorage.getItem('sessionId') || '');
  const [totalSessionDetails, setTotalSessionDetails] = useState({});
  const d = new Date();
  const date = d.toISOString();
  const val = localStorage.getItem('user_details');
  const object = JSON.parse(val);
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const roles = object.roles;
  const [totalSessions, setTotalSessions] = useState('');

  // useEffect(() => {
  //   const locId = localStorage.getItem('locId');
  //   activeSessionDay(locId).then((response) => {
  //     const sessionId = response?.data?.userSession?.sessionId;
  //     localStorage.setItem('sessionId', sessionId);
  //     getSessionDetails(sessionId).then((res) => {
  //       setActiveStat(res?.data?.userSession?.active);
  //       setDayDate(res?.data?.userSession?.startTime);
  //     });
  //   });
  // }, []);

  useEffect(() => {
    const locId = localStorage.getItem('locId');
    const orgId = localStorage.getItem('orgId');
    getAllSessionServiceDetails(locId).then((response) => {
      setSessionData(response.data.data.salesData);
    });
    dashBoardDetails(locId, orgId).then((response) => {
      setTotalSessionDetails(response?.data);
    });
  }, []);

  // const handleStartEndDay = () => {
  //   setIsloading(true);
  //   if (activeStat) {
  //     navigate('/sales_channels/pos/end_day');
  //   } else {
  //     const payload = {
  //       uidx: object.uidx,
  //       role: roles.includes('RETAIL_ADMIN')
  //         ? 'RETAIL_ADMIN'
  //         : roles.includes('POS_MANAGER')
  //         ? 'POS_MANAGER'
  //         : 'SUPER_ADMIN',
  //       organizationId: orgId,
  //       locationId: locId,
  //       createdBy: object.firstName + ' ' + object.secondName,
  //     };
  //     StartDay(payload).then((response) => {
  //       setIsloading(false);
  //       localStorage.setItem('sessionId', response?.data?.userSession?.sessionId);
  //       setActiveStat(response?.data?.userSession?.active);
  //     });
  //   }
  // };

  useEffect(() => {
    const locId = localStorage.getItem('locId');
    const orgId = localStorage.getItem('orgId');
    const sessionId = localStorage.getItem('sessionId');
    getLocationActivity(locId, orgId, sessionId).then((res) => {
      setTotalSessions({
        totalSes: res?.data?.totalSessions,
        startamt: res?.data?.startingBalance,
      });
    });
  }, []);

  const isPrevious = usePreviousDayChecker(dayDate);
  useEffect(() => {
    setIsPreviousDay(isPrevious);
  }, [dayDate]);

  return (
    <DashboardLayout>
      {!isMobileDevice && <DashboardNavbar />}
      <div>
        <Dialog
          open={dailogeopen}
          onClose={handleClosedailog}
          sx={{
            '& .MuiDialog-container': {
              '& .MuiPaper-root': {
                width: '100%',
                maxWidth: '450px',
              },
            },
          }}
        >
          <DialogContent>
            <FormField
              autoFocus
              margin="dense"
              id="name"
              label="Audio url"
              type="text"
              fullWidth
              variant="standard"
              value={audioUrl}
              onChange={(e) => SetAudioURL(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClosedailog}>Cancel</Button>
            <Button onClick={handleAudioUpload}>Upload</Button>
          </DialogActions>
        </Dialog>
      </div>
      <Container sx={{ marginTop: isMobileDevice && '20px' }}>
        <SoftBox style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item lg={9} md={9} sm={12}>
              <SoftBox style={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap' }}>
                <SoftBox className="startend-button-mian-div">
                  <SoftTypography
                    style={{
                      // marginLeft: '25px',
                      marginRight: '25px',
                      fontSize: isMobileDevice ? '1rem' : '1.2rem',
                      fontWeight: '400',
                    }}
                  >
                    {formattedDate}
                  </SoftTypography>
                  {/* <SoftButton
                    disabled={isLoading}
                    className="contained-softbutton"
                    onClick={() => handleStartEndDay()}
                    style={{
                      marginLeft: !isMobileDevice && '20px',
                      height: '20px !important',
                      padding: '0px !important',
                      backgroundColor: '#0562FB',
                      color: '#fff',
                      maxWidth: '120px',
                      float: isMobileDevice && 'right',
                    }}
                  >
                    {isLoading ? (
                      <CircularProgress className="circular-progress-dashboard" />
                    ) : activeStat == '' ? (
                      <CircularProgress className="circular-progress-dashboard" />
                    ) : activeStat ? (
                      'End Day'
                    ) : (
                      'Start Day'
                    )}
                  </SoftButton> */}
                  <SoftButton color="info" onClick={() => navigate('/sales_channels/pos/terminals')}>
                    Terminal Details
                  </SoftButton>
                </SoftBox>

                <SoftBox
                // style={{ display: 'flex', flexDirection: 'column' }}
                >
                  {isPreviousDay ? (
                    <SoftBox
                      display={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                        height: 'auto',
                        gap: '10px',
                        marginTop: '10px',
                        // flexWrap: 'wrap',
                      }}
                    >
                      <ReportIcon color="error" />
                      <SoftTypography sx={{ color: 'red', fontSize: '0.9rem' }} className="warning-about-day">
                        Warning: Previous day is going on. Recommend to start a new day!
                      </SoftTypography>
                    </SoftBox>
                  ) : null}
                </SoftBox>
              </SoftBox>
            </Grid>
            <Grid
              item
              lg={3}
              md={3}
              sm={12}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              className={`${isMobileDevice && 'po-box-shadow audio-grid-div'}`}
            >
              <SoftBox
                display="flex"
                style={{ transform: isMobileDevice ? 'scale(0.7)' : 'scale(0.63)', flexDirection: 'column' }}
              >
                {/* <SoftBox>
                  <SoftBox display="flex" gap="10px" alignItems="center">
                    <SoftBox marginTop="5px">
                      <audio
                        ref={audioRef}
                        src={audioSrc}
                        onTimeUpdate={handleTimeUpdate}
                        onLoadedMetadata={handleLoadedMetadata}
                        onError={handleError}
                      />
                      <SoftBox style={{ display: 'flex', alignItems: 'center' }}>
                        <SoftTypography style={{ fontSize: '22px', alignItems: 'center' }} onClick={handleClick}>
                          Audio
                        </SoftTypography>
                        <SoftBox>
                          <UploadIcon
                            sx={{ cursor: 'pointer', marginLeft: '10px', paddingTop: '6px' }}
                            fontSize="large"
                            onClick={handleClick}
                          />
                        </SoftBox>
                      </SoftBox>

                      <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                          'aria-labelledby': 'basic-button',
                        }}
                      >
                        <MenuItem onClick={handleDefault}>Default</MenuItem>
                        <label>
                          <MenuItem onClick={handleClickOpendailoge}>Upload URL</MenuItem>
                        </label>
                      </Menu>
                    </SoftBox>
                    <SoftBox onClick={togglePlay} style={{ marginTop: '10px', display: 'flex' }}>
                      {isPlaying ? <PauseIcon fontSize="large" /> : <PlayArrowIcon fontSize="large" />}

                      <SoftBox onClick={handleStop} style={{ marginLeft: '10px' }}>
                        <StopIcon fontSize="large" />
                      </SoftBox>
                    </SoftBox>
                  </SoftBox>
                  <SoftBox className="audio-player-container">
                    <input type="range" min="0" max={duration} value={currentTime} onChange={handleSeek} />
                  </SoftBox>
                </SoftBox>
                {error && <p style={{ color: '#f03a4c' }}>Audio format is not supported</p>} */}
              </SoftBox>
              <SoftBox onClick={onSettings} marginTop="5px">
                <SettingsIcon fontSize="medium" />
              </SoftBox>
            </Grid>
          </Grid>
        </SoftBox>

        <Grid container spacing={2} justifyContent="space-evenly" style={{ margin: '20px', marginLeft: '-20px' }}>
          <Grid item xs={12} sm={6} md={4} lg={3} onClick={() => onActivePos('pos')}>
            <Paper
              elevation={2}
              sx={{
                background: 'linear-gradient(45deg, #2a72c7, #6695cc)',
                padding: '18px',
                color: 'white',
                borderRadius: '10px',
              }}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/1585/1585258.png"
                alt=""
                style={{ width: '30px', marginBottom: '15px' }}
              />
              <Typography variant="subtitle2" style={{ fontSize: '0.8rem', marginBottom: '10px', color: 'white' }}>
                Active POS Counters
              </Typography>
              <Typography variant="h6" style={{ fontSize: '1.2rem', color: 'white' }}>
                {totalSessionDetails?.activePosSessions || 0} out of {totalSessionDetails?.totalPosLicense || 0}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Paper
              elevation={2}
              sx={{
                background: 'linear-gradient(45deg, #2a72c7, #6695cc)',
                padding: '18px',
                color: 'white',
                borderRadius: '10px', // Adjust the value as needed
              }}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/1585/1585258.png"
                alt=""
                style={{ width: '30px', marginBottom: '15px' }}
              />
              <Typography variant="subtitle2" style={{ fontSize: '0.8rem', marginBottom: '10px', color: 'white' }}>
                Total Sales
              </Typography>
              <Typography variant="h6" style={{ fontSize: '1.2rem', color: 'white' }}>
                ₹ <Counter value={getReportData?.actualOrderValue || 0} />
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Paper
              elevation={2}
              sx={{
                background: 'linear-gradient(45deg, #2a72c7, #6695cc)',
                padding: '18px',
                color: 'white',
                borderRadius: '10px',
              }}
              onClick={() => onActivePos('mpos')}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/1585/1585258.png"
                alt=""
                style={{ width: '30px', marginBottom: '15px' }}
              />
              <Typography variant="subtitle2" style={{ fontSize: '0.8rem', marginBottom: '10px', color: 'white' }}>
                Active Mobile POS
              </Typography>
              <Typography variant="h6" style={{ fontSize: '1.2rem', color: 'white' }}>
                0 out of 0
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Paper
              elevation={2}
              sx={{
                background: 'linear-gradient(45deg, #2a72c7, #6695cc)',
                padding: '18px',
                color: 'white',
                borderRadius: '10px', // Adjust the value as needed
              }}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/1585/1585258.png"
                alt=""
                style={{ width: '30px', marginBottom: '15px' }}
              />
              <Typography variant="subtitle2" style={{ fontSize: '0.8rem', marginBottom: '10px', color: 'white' }}>
                Mobile POS sales
              </Typography>
              <Typography variant="h6" style={{ fontSize: '1.2rem', color: 'white' }}>
                ₹ <Counter value={0} />
              </Typography>
            </Paper>
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={5}>
            <DefaultDoughnutChart
              title="Payment Methods"
              height="340px"
              chart={chartData}
              options={{
                plugins: {
                  legend: {
                    position: 'right',
                  },
                },
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
          </Grid>
          <Grid item xs={12} lg={7}>
            <GradientLineChart
              title=" Overview"
              description={
                <SoftBox display="flex" alignItems="center">
                  <SoftBox fontSize={'15px'} color="success" mb={0.3} mr={0.5} lineHeight={0}>
                    <Icon sx={{}}>arrow_upward</Icon>
                  </SoftBox>
                  <SoftTypography variant="button" color="text" fontWeight="medium">
                    4% more{' '}
                    <SoftTypography variant="button" color="text" fontWeight="regular">
                      in 2021
                    </SoftTypography>
                  </SoftTypography>
                </SoftBox>
              }
              chart={gradientLineChartData}
            />
          </Grid>
        </Grid>

        <Grid container spacing={2} style={{ marginTop: '20px' }}>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Paper
              elevation={2}
              sx={{ backgroundColor: 'white', padding: '15px', borderRadius: '5px', textAlign: 'center' }}
            >
              <div style={{ color: '#575859', fontWeight: 'bold', fontSize: '14px' }}>Total sessions</div>
              <div style={{ color: '#4f81bd', fontWeight: 'bold', fontSize: '16px' }}>
                {totalSessions?.totalSes || 0}
              </div>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Paper
              elevation={2}
              sx={{ backgroundColor: 'white', padding: '15px', borderRadius: '5px', textAlign: 'center' }}
            >
              <div style={{ color: '#575859', fontWeight: 'bold', fontSize: '14px' }}>Total session time</div>
              <div style={{ color: '#4f81bd', fontWeight: 'bold', fontSize: '16px' }}>---</div>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Paper
              elevation={2}
              sx={{ backgroundColor: 'white', padding: '15px', borderRadius: '5px', textAlign: 'center' }}
            >
              <div style={{ color: '#575859', fontWeight: 'bold', fontSize: '14px' }}>Total orders</div>
              <div style={{ color: '#4f81bd', fontWeight: 'bold', fontSize: '16px' }}>
                {getReportData?.actualOrders || 0}
              </div>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Paper
              elevation={2}
              sx={{ backgroundColor: 'white', padding: '15px', borderRadius: '5px', textAlign: 'center' }}
            >
              <div style={{ color: '#575859', fontWeight: 'bold', fontSize: '14px' }}>Average order value</div>
              <div style={{ color: '#4f81bd', fontWeight: 'bold', fontSize: '16px' }}>
                <div>{Math.round(getReportData?.avgOrderValue || 0)}</div>
              </div>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Paper
              elevation={2}
              sx={{ backgroundColor: 'white', padding: '15px', borderRadius: '5px', textAlign: 'center' }}
            >
              <div style={{ color: '#575859', fontWeight: 'bold', fontSize: '14px' }}>Returns</div>
              <div style={{ color: '#4f81bd', fontWeight: 'bold', fontSize: '16px' }}>
                {' '}
                {getReportData?.returns || 0}
              </div>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Paper
              elevation={2}
              sx={{ backgroundColor: 'white', padding: '15px', borderRadius: '5px', textAlign: 'center' }}
            >
              <div style={{ color: '#575859', fontWeight: 'bold', fontSize: '14px' }}>Coupons</div>
              <div style={{ color: '#4f81bd', fontWeight: 'bold', fontSize: '16px' }}>
                {' '}
                {getReportData?.coupons || 0}
              </div>
            </Paper>
          </Grid>
        </Grid>

        <SoftBox style={{ marginTop: '20px' }}>
          <SoftTypography style={{ marginLeft: '25px', fontSize: '1.2rem', fontWeight: 'bold' }}>
            Sales Leader board
          </SoftTypography>

          {/* sales leader board */}
          <Grid container spacing={2}>
            {salesLeaderBoardData?.map((item, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Card
                  style={{
                    display: 'flex',
                    height: '140px',
                    backgroundColor: '#4b84c9',
                    padding: '18px',
                  }}
                >
                  <img
                    src="https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?w=2000"
                    alt=""
                    style={{ width: '40px', marginBottom: '15px', borderRadius: '50%' }}
                  />
                  <div style={{ justifyContent: 'flex-start', flexDirection: 'column', color: 'white' }}>
                    <Typography variant="body2" style={{ fontSize: '0.9rem', color: 'white' }}>
                      {item?.userName}
                    </Typography>
                    <Typography variant="h6" style={{ fontSize: '1.3rem', color: 'white' }}>
                      {item?.totalSales !== null ? item?.totalSales : 'N/A'}
                    </Typography>
                  </div>
                </Card>
              </Grid>
            ))}
          </Grid>
        </SoftBox>

        {/* <SoftBox>
          <SoftTypography style={{ marginLeft: '25px', fontSize: '1.2rem', fontWeight: 'bold' }}>
            Top Items Sold
          </SoftTypography>
        </SoftBox> */}
      </Container>
    </DashboardLayout>
  );
};

export default PosNewDashboard;
