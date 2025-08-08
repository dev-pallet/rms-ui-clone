import './end_day.css';
import { Box, Card, Grid, Snackbar } from '@mui/material';
import {
  StartDay,
  activeSessionDay,
  closeDay,
  getSessionDetails,
  getStoreActivity,
} from '../../../../../../config/Services';
import { isSmallScreen } from '../../../../Common/CommonFunction';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useSnackbar } from '../../../../../../hooks/SnackbarProvider';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import DashboardLayout from '../../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../../examples/Navbars/DashboardNavbar';
import MobileNavbar from '../../../../../../examples/Navbars/MobileNavbar/mobile-navbar-drawer';
import MuiAlert from '@mui/material/Alert';
import React, { useEffect, useState } from 'react';
import SoftBox from '../../../../../../components/SoftBox';
import SoftButton from '../../../../../../components/SoftButton';
import SoftTypography from '../../../../../../components/SoftTypography';
import Spinner from '../../../../../../components/Spinner';
import img from 'assets/images/online.png';
import img1 from 'assets/images/offline.png';
import usePreviousDayChecker from '../../../../../../hooks/useDayChecker';

export const EndDay = ({ terminalDetails }) => {
  const showSnackbar = useSnackbar();
  const [terminalData, setTerminalData] = useState([]);
  const isMobileDevice = isSmallScreen();
  const [isLoading, setIsloading] = useState(false);
  const [isLoadingBtn, setIsloadingBtn] = useState(false);
  const [closeDayAllowed, setCloseDayAllowed] = useState(false);
  const [opensnack, setOpensnack] = useState(false);
  const [timelinerror, setTimelineerror] = useState('');
  const [alertmessage, setAlertmessage] = useState('');
  const orgId = localStorage.getItem('orgId');
  const sessionId = localStorage.getItem('sessionId');
  const locId = localStorage.getItem('locId');
  const [available, setAvailable] = useState(false);
  const [activeStat, setActiveStat] = useState('');
  const [isPreviousDay, setIsPreviousDay] = useState('');
  const [dayDate, setDayDate] = useState('');

  const val = localStorage.getItem('user_details');
  const object = JSON.parse(val);
  const roles = object.roles;

  const handleStartEndDay = () => {
    setIsloadingBtn(true);
    if (activeStat) {
      // navigate('/sales_channels/pos/end_day');
      if (closeDayAllowed) {
        EndDayFunction();
      } else {
        showSnackbar('Close sessions to end day', 'error');
        setIsloadingBtn(false);
      }
    } else {
      const payload = {
        uidx: object.uidx,
        role: roles.includes('RETAIL_ADMIN')
          ? 'RETAIL_ADMIN'
          : roles.includes('POS_MANAGER')
          ? 'POS_MANAGER'
          : 'SUPER_ADMIN',
        organizationId: orgId,
        locationId: locId,
        createdBy: object.firstName + ' ' + object.secondName,
      };
      console.log(payload);
      StartDay(payload)
        .then((response) => {
          setIsloadingBtn(false);
          localStorage.setItem('sessionId', response?.data?.userSession?.sessionId);
          setActiveStat(response?.data?.userSession?.active);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  useEffect(() => {
    const locId = localStorage.getItem('locId');
    activeSessionDay(locId).then((response) => {
      const sessionId = response?.data?.userSession?.sessionId;
      localStorage.setItem('sessionId', sessionId);
      getSessionDetails(sessionId).then((res) => {
        setActiveStat(res?.data?.userSession?.active);
        setDayDate(res?.data?.userSession?.startTime);
      });
    });
  }, []);
  const isPrevious = usePreviousDayChecker(dayDate);
  useEffect(() => {
    setIsPreviousDay(isPrevious);
  }, [dayDate]);

  const isMobile = window.innerWidth < 576;
  const sessionQuery = useQuery(['session'], () => getStoreActivity(locId, orgId, sessionId, isMobile), {
    refetchInterval: 5000,
    onSuccess: (response) => {
      if (response?.data?.licenses.length == 0) {
        setAlertmessage('No licenses found. Please create a license', response?.data?.licenses.length);
        setTimelineerror('error');
        setAvailable(false);
        handleopensnack();
      } else {
        setAvailable(true);
        setCloseDayAllowed(response?.data?.closeSessionAllowed);
        setIsloading(false);
        setTerminalData(response?.data?.licenses);
      }
    },
    onError: (error) => {
      setIsloading(false);
      setAlertmessage(error.message);
      setTimelineerror('error');
      handleopensnack();
    },
  });

  const navigate = useNavigate();

  const handleSessionDetails = (licenseId) => {
    navigate(`/sales_channels/pos/terminal_details/${licenseId}`);
  };

  const EndDayFunction = () => {
    const sessionId = localStorage.getItem('sessionId');
    const uidx = JSON.parse(localStorage.getItem('user_details')).uidx;

    const payload = {
      sessionId: sessionId,
      updatedBy: uidx,
    };
    setIsloading(true);
    closeDay(payload)
      .then((response) => {
        setIsloading(false);
        navigate('/sales_channels/pos/end_day_details');
      })
      .catch((err) => {
        setIsloading(false);
      });
  };

  const handleCloseSession = (sessionId, licenseId) => {
    navigate(`/sales_channels/pos/closeSession/${sessionId}/${licenseId}`);
  };

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const handleopensnack = () => {
    setOpensnack(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpensnack(false);
  };

  const handleCreateLicense = () => {
    navigate('/pos/addposmachines/pos');
  };

  return (
    <DashboardLayout>
      {!isMobileDevice && <DashboardNavbar />}
      {!available ? (
        <>
          <Card
            style={{
              padding: '15px',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderRadius: '0px !important',
              marginBottom: '5px',
            }}
            className="search-bar-filter-and-table-container contained-softbutton"
          >
            <SoftBox>
              <SoftTypography style={{ fontSize: '1.1rem', color: '#fff' }}>
                Number of terminals available for your location
              </SoftTypography>
            </SoftBox>
            <SoftButton
              disabled={isLoadingBtn}
              // className="contained-softbutton"
              onClick={() => handleStartEndDay()}
              style={{
                marginLeft: !isMobileDevice && '20px',
                height: '20px !important',
                padding: '0px !important',
                // backgroundColor: '#0562FB',
                // color: '#fff',
                maxWidth: '120px',
                float: isMobileDevice && 'right',
              }}
            >
              {isLoadingBtn ? (
                <Spinner size={'1rem'} />
              ) : activeStat == '' ? (
                <Spinner size={'1rem'} />
              ) : activeStat ? (
                'End Day'
              ) : (
                'Start Day'
              )}
            </SoftButton>
          </Card>
          <Card className="no-license-box">
            <Box>
              <SoftTypography variant="h4">No Licenses available</SoftTypography>
              <button className="no-license-btn" onClick={() => handleCreateLicense()}>
                Create License
              </button>
            </Box>
          </Card>
        </>
      ) : (
        <>
          <Box p={2} className="main-container">
            <Box>
              <Card
                style={{
                  padding: '15px',
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderRadius: '0px !important',
                }}
                className="search-bar-filter-and-table-container contained-softbutton"
              >
                <SoftBox>
                  <SoftTypography style={{ fontSize: '1.1rem', color: '#fff' }}>
                    Number of terminals available for your location
                  </SoftTypography>
                </SoftBox>
                <SoftButton
                  disabled={isLoadingBtn}
                  // className="contained-softbutton"
                  onClick={() => handleStartEndDay()}
                  style={{
                    marginLeft: !isMobileDevice && '20px',
                    height: '20px !important',
                    padding: '0px !important',
                    // backgroundColor: '#0562FB',
                    // color: '#fff',
                    maxWidth: '120px',
                    float: isMobileDevice && 'right',
                  }}
                >
                  {isLoadingBtn ? (
                    <Spinner size={'1rem'} />
                  ) : activeStat == '' ? (
                    <Spinner size={'1rem'} />
                  ) : activeStat ? (
                    'End Day'
                  ) : (
                    'Start Day'
                  )}
                </SoftButton>
              </Card>
              <br />
              {/* <SoftTypography variant="p">Number of terminals available for your location</SoftTypography> */}
              {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Spinner />
                </Box>
              ) : (
                <Grid container spacing={3}>
                  {terminalData?.map((e, i) => {
                    return (
                      <Grid item xs={12} md={4} xl={3}>
                        <Card>
                          <Box className="terminal-details-box" p={2}>
                            <SoftTypography variant="h6" className="terminal-name-box-head">
                              {e?.licenseName}
                            </SoftTypography>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                              <SoftTypography variant="h6" className="terminal-name-box">
                                Terminal is {e?.active ? 'active' : 'inactive'}
                                {e?.active ? (
                                  <img className="active-img-logo" src={img} alt="" />
                                ) : (
                                  <img className="active-img-logo" src={img1} alt="" />
                                )}
                              </SoftTypography>
                            </Box>
                            {e?.active ? (
                              <SoftButton
                                variant="gradient"
                                color="info"
                                onClick={() => handleCloseSession(terminalData[i]?.sessionDto?.sessionId, e?.licenseId)}
                                className="terminal-close-btn"
                              >
                                Close Session
                              </SoftButton>
                            ) : null}
                          </Box>
                          <Box
                            m={2}
                            className="terminal-details-btn"
                            onClick={() => handleSessionDetails(e?.licenseId)}
                          >
                            <ArrowRightAltIcon />
                          </Box>
                        </Card>
                      </Grid>
                    );
                  })}
                </Grid>
              )}
            </Box>
          </Box>
          {!terminalDetails && (
            <Box className="terminal-end-btn">
              <SoftButton
                disabled={!closeDayAllowed}
                variant="gradient"
                color="info"
                onClick={() => EndDayFunction()}
                style={{ marginLeft: '40px', height: '20px !important', padding: '0px !important' }}
              >
                {isLoading ? <Spinner /> : 'End Day'}
              </SoftButton>
            </Box>
          )}
        </>
      )}
      <Snackbar open={opensnack} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={timelinerror} sx={{ width: '100%' }}>
          {alertmessage}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
};
