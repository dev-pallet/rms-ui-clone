import './HomePage.css';
import {
  ArcElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { Box } from '@material-ui/core';
import { Doughnut, Line } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import AccessAlarmsIcon from '@mui/icons-material/AccessAlarms';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import Grid from '@mui/material/Grid';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import MuiAlert from '@mui/material/Alert';
import PaymentIcon from '@mui/icons-material/Payment';
import PersonIcon from '@mui/icons-material/Person';
import React, { useMemo, useState } from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Snackbar from '@mui/material/Snackbar';
import SoapIcon from '@mui/icons-material/Soap';
import SoftButton from '../../../../components/SoftButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ArcElement,
  Tooltip,
  Legend
);

const PosDashboard = () => {
  //get Dashboard data api
  const [opensnack, setOpensnack] = useState(false);
  const [timelinerror, setTimelineerror] = useState('');
  const [alertmessage, setAlertmessage] = useState('');
  const [sessionorderData, setSessionOrderData] = useState(null);
  const org_Id = localStorage.getItem('orgId');
  const loc_Id = localStorage.getItem('locId');
  const retailUserDetails = JSON.parse(localStorage.getItem('user_details'));
  const uidx = retailUserDetails.uidx;
  const name = localStorage.getItem('user_name');

  //snackbar
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

  //session data
  let fetchDashboard;
  //   const fetchDashboard = useFetch({
  //     name: "dashboard-service",
  //     service: dashBoardData,
  //     params: {
  //       org_Id,
  //       loc_Id,
  //       uidx,
  //     },
  //     condition: !!org_Id || !!loc_Id,
  //     onSuccess: (e) => {
  //       if(e){
  //         setSessionOrderData(e?.data?.posDashboardData);
  //         setAlertmessage("Success data fetched");
  //         setTimelineerror("success");
  //       }
  //       else{
  //         setSessionOrderData(null);
  //         setAlertmessage("Error Fetching fetched");
  //         setTimelineerror("error");

  //       }
  //       handleopensnack();
  //     },
  //   });
  useMemo(() => {
    if (!fetchDashboard?.error) {
      return;
    }
    setAlertmessage(fetchDashboard?.error?.message);
    setTimelineerror('error');
    handleopensnack();
  }, [fetchDashboard?.error]);

  const linedata = {
    labels: ['10:00', '10:30', '11:00', '11:30'],
    datasets: [
      {
        label: 'Dataset 1',
        data: [12, 19, 18, 27],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Dataset 2',
        data: [20, 18, 25, 21],
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: 'Dataset 3',
        data: [15, 21, 12, 18],
        borderColor: 'rgba(43, 220, 36)',
        backgroundColor: 'rgba(43, 220, 36, 0.5)',
      },
    ],
  };
  const piedata = {
    labels: ['Order adjustments', 'Cash register open requests', 'Cash register overtime alerts'],
    datasets: [
      {
        label: '# of Votes',
        data: [12, 19, 3],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const topList = [
    {
      name: 'Session timings',
      icon: <AccessTimeFilledIcon className="icons" sx={{ fontSize: '1.5rem' }} />,
      value: '2hr 28min',
    },
    {
      name: 'Total session',
      icon: <AddCircleIcon className="icons" sx={{ fontSize: '1.5rem' }} />,
      value: '2',
    },
    {
      name: 'New customers',
      icon: <PersonIcon className="icons" sx={{ fontSize: '1.5rem' }} />,
      value: '12',
    },
  ];

  const sessionData = [
    {
      name: 'Total order processed',
      icons: <SoapIcon className="icons" sx={{ fontSize: '1.5rem' }} />,
      value:
        sessionorderData?.totalOrdersProcessed === null
          ? '0'
          : sessionorderData?.totalOrdersProcessed,
    },
    {
      name: 'Avg time per order',
      icons: <AccessAlarmsIcon className="icons" sx={{ fontSize: '1.5rem' }} />,
      value: '1 min 23 sec',
    },
    {
      name: 'Session cash advance',
      icons: <LocalAtmIcon className="icons" sx={{ fontSize: '1.5rem' }} />,
      value:
        sessionorderData?.sessionCashAdvance === null
          ? '₹ 0'
          : `₹ ${sessionorderData?.sessionCashAdvance}`,
    },
    {
      name: 'Total order value',
      icons: <ShoppingCartIcon className="icons" sx={{ fontSize: '1.5rem' }} />,
      value:
        sessionorderData?.totalOrderValue === null
          ? '₹ 0'
          : `₹ ${sessionorderData?.totalOrderValue}`,
    },
    {
      name: 'Cash orders',
      icons: <MonetizationOnIcon className="icons" sx={{ fontSize: '1.5rem' }} />,
      value: sessionorderData?.cashOrders === null ? '₹ 0' : `₹ ${sessionorderData?.cashOrders}`,
    },
    {
      name: 'Digital payments',
      icons: <PaymentIcon className="icons" sx={{ fontSize: '1.5rem' }} />,
      value:
        sessionorderData?.digitalPayments === null
          ? '₹ 0'
          : `₹ ${sessionorderData?.digitalPayments}`,
    },
  ];
  const navigate = useNavigate();
  const onPossettings = () => {
    navigate('/pos/settings');
  };
  return (
    <DashboardLayout >
      <DashboardNavbar />
      <SoftButton sx={{float:'right'}} variant="gradient" color="info" onClick={onPossettings} >
        <SettingsIcon sx={{marginRight:'0.5rem'}} fontSize="small" />
          Settings
      </SoftButton>
      <Snackbar open={opensnack} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={timelinerror} sx={{ width: '100%' }}>
          {alertmessage}
        </Alert>
      </Snackbar>
      <Box style={{ display: 'flex', flex: 1 }} className="main-wrapper-container">
        <div className="homePageContainer">
          <Typography
            component="h1"
            sx={{
              fontSize: '1.8rem',
              fontWeight: '500',
              marginLeft: '0.1em',
              marginBottom: '0.5em',
            }}
          >
            Hello {name}! Here's your contribution today
          </Typography>
          <Grid container spacing={3} sx={{ height: '40rem' }}>
            <Grid item xs={12} md={8} sx={{ height: '100%' }}>
              <Grid
                container
                columnSpacing={3}
                sx={{ height: '100%', flexWrap: 'nowrap' }}
                direction="column"
                justifyContent="space-between"
              >
                <Grid item xs={12} md={12}>
                  <Grid
                    container
                    columnSpacing={3}
                    sx={{ height: '100%', flexWrap: 'nowrap', paddingBottom: '1.5rem' }}
                    direction="row"
                    justifyContent="space-between"
                    className="cardWrap"
                  >
                    {topList.map((ele ) => (
                      <Grid item xs={12} md={12} key={ele.name}>
                        <div style={{ height: '100%', padding: '0.8rem' }} className="box">
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div className="round-wrapper-icon-box">{ele.icon}</div>
                              <span
                                className="dark-white-span-text"
                                style={{ fontWeight: '500', color: 'gray' }}
                              >
                                {ele.name} 
                              </span>
                            </div>
                            <div className="data">{ele.value}</div>
                          </div>
                        </div>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
                <Grid item xs={12} md={12} sx={{ paddingBottom: '1.5rem' }}>
                  <div style={{ height: '16rem', padding: '0.8rem' }} className="box">
                    <Typography
                      sx={{
                        fontWeight: '600',
                        fontSize: '1rem',
                        marginBottom: '1rem',
                        float: 'left',
                      }}
                    >
                      Orders by hours vs payment mode
                    </Typography>
                    <div style={{ height: '12rem' }}>
                      <Line
                        options={{
                          plugins: {
                            legend: {
                              display: false,
                            },
                          },
                          responsive: true,
                          maintainAspectRatio: false,
                        }}
                        data={linedata}
                      />
                    </div>
                  </div>
                </Grid>
                <Grid item xs={12} md={12}>
                  <Grid
                    container
                    columnSpacing={3}
                    sx={{ height: '100%', flexWrap: 'nowrap' }}
                    direction="row"
                    justifyContent="space-between"
                  >
                    <Grid item xs={12} md={12}>
                      <div style={{ height: '100%', padding: '0.8rem' }} className="box">
                        <Typography
                          sx={{
                            fontWeight: '600',
                            fontSize: '1rem',
                            marginBottom: '0.5rem',
                            float: 'left',
                          }}
                        >
                          Billing efficiency
                        </Typography>
                        <div style={{ height: '7rem' }}>
                          <Doughnut
                            className="doughnut-text"
                            data={piedata}
                            width={100}
                            height={100}
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
                        </div>
                      </div>
                    </Grid>
                    <Grid item xs={12} md={12}>
                      <div style={{ height: '100%', padding: '0.8rem' }} className="box">
                        <Stack
                          direction="column"
                          justifyContent="flex-start"
                          alignItems="flex-start"
                        >
                          <Typography
                            sx={{ fontWeight: '600', fontSize: '1rem', marginBottom: '0.5rem' }}
                          >
                            Session alerts
                          </Typography>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              width: '80%',
                            }}
                          >
                            <Typography sx={{ fontSize: 15 }}>Order adjustments</Typography>
                            <Typography sx={{ fontSize: 15 }}>
                              {sessionorderData?.orderAdjustments === null
                                ? '0'
                                : sessionorderData?.orderAdjustments}
                            </Typography>
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              width: '80%',
                            }}
                          >
                            <Typography sx={{ fontSize: 15 }}>Cash register overtime</Typography>
                            <Typography sx={{ fontSize: 15 }}>2</Typography>
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              width: '80%',
                            }}
                          >
                            <Typography sx={{ fontSize: 15 }}>
                              Cash register open request
                            </Typography>
                            <Typography sx={{ fontSize: 15 }}>3</Typography>
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              width: '80%',
                            }}
                          >
                            <Typography sx={{ fontSize: 15 }}>
                              Order exceeding target time
                            </Typography>
                            <Typography sx={{ fontSize: 15 }}>1</Typography>
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              width: '80%',
                            }}
                          >
                            <Typography sx={{ fontSize: 15 }}>Manager intrusions</Typography>
                            <Typography sx={{ fontSize: 15 }}>1</Typography>
                          </div>
                        </Stack>
                      </div>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={4}>
              <div style={{ height: '100%', padding: '0.8rem' ,marginLeft:'25px'}} className="box-I">
                <Stack
                  direction="column"
                  justifyContent="flex-start"
                  alignItems="flex-start"
                  spacing={2}
                >
                  <Typography sx={{ fontWeight: '500', fontSize: '1.3rem', marginLeft:'80px' }}>
                    Session Details
                  </Typography>

                  {sessionData.map((ele) => (
                    <div className="main-wrapper-total-box-order" key={ele.name}>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <div className="round-wrapper-icon-box-I">{ele.icons}</div>
                        <div className="right-wrapper-total-box">
                          <span
                            className="dark-white-span-text"
                            style={{ fontWeight: '500', color: 'gray', fontSize: '0.9rem' }}
                          >
                            {ele.name}
                          </span>
                          <h4 className="bold-h-text">{ele?.value}</h4>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="recon-wrapper-box">
                    <div style={{ display: 'flex' }}>
                      <span style={{ fontWeight: '500', fontSize: '1.3rem' }}>
                        Cash recon as of now
                      </span>
                    </div>
                    <Typography
                      align="left"
                      sx={{
                        fontWeight: 'bold',
                        fontSize: 30,
                        marginLeft: '5px',
                        color: '#7ED957',
                      }}
                    >
                      {sessionorderData?.cashReconAsOfNow === null
                        ? '₹ 0'
                        : `₹ ${sessionorderData?.cashReconAsOfNow}`}
                    </Typography>
                  </div>
                </Stack>
              </div>
            </Grid>
          </Grid>
        </div>
      </Box>
    </DashboardLayout>
  );
};

export default PosDashboard;
