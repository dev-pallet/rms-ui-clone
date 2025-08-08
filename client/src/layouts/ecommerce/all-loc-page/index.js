import './all-loc.css';
import { Box, Button, Card } from '@mui/material';
import { getOrgNameLogo, getUserLocations, getUserLocationsDetails } from '../../../config/Services';
import { getRetailUserLocationDetails } from '../../../config/Services';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import PageLayout from 'examples/LayoutContainers/PageLayout';
import SoftBox from 'components/SoftBox';
import SoftTypography from '../../../components/SoftTypography';
import Spinner from 'components/Spinner/index';
import { noDatagif } from '../Common/CommonFunction';

export const AllLocPage = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [data, setData] = useState([]);
  const [message, setMessage] = useState('');
  const [comDetails, setComDetails] = useState([]);
  const orgId = localStorage.getItem('orgId');
  const contextType = localStorage.getItem('contextType');
  const access_token = localStorage.getItem('access_token');
  const navigate = useNavigate();
  const [responses, setResponses] = useState({});
  const [counter, setCounter] = useState(0);
  const MAX_CALLS = 3;

  const val = localStorage.getItem('user_details');
  const object = JSON.parse(val);

  useEffect(() => {
    if (!loading) {
      setLoading(true);
      nameLogo();
    }
  }, []);

  // useEffect(() => {
  //   appVersionApi();
  // }, []);

  // const appVersionApi = async() => {
  //   getAppVersion()
  //     .then((res) => {
  //       const newResponses = { ...responses, [res.data.data.key]: res.data.data };
  //       setResponses(newResponses.undefined);
  //     })
  //     .catch((err) => {

  //     });
  // }

  // useEffect(() => {
  //   const allSuccess = Object.values(responses).every(
  //     (response) => response.status === "SUCCESS"
  //   );
  //   if (!allSuccess && counter < MAX_CALLS) {
  //     setCounter((prevCounter) => prevCounter + 1);
  //     setTimeout(appVersionApi, 1000);
  //   }
  // }, [responses]);

  const nameLogo = () => {
    const payload = {
      uidx: object.uidx,
      org_id: orgId,
    };
    getUserLocations(payload).then((response) => {
      const locationArray = response.data.data;
      if (contextType == 'RETAIL') {
        getRetailUserLocationDetails(orgId)
          .then((res) => {
            setLoading(false);
            if (res.data.data.message === 'Sorry! Something went wrong.') {
              setMessage(res.data.data.message);
              setErrorMessage(true);
            } else if (res.data.data.branches.length == 1) {
              // navigate('/')
              window.location.href = '/';
              localStorage.setItem('locId', res.data.data.branches[0].branchId);
            } else {
              setData(res.data.data.branches);
            }
          })
          .catch((err) => {
            setLoading(false);
          });
      } else if (contextType == 'WMS') {
        getOrgNameLogo(orgId).then((response) => {
          setComDetails(response.data.data);
        });
        getUserLocationsDetails(locationArray, orgId)
          .then((response) => {
            if (response.data.data.object == null) {
              setMessage(response.data.data.message);
              setErrorMessage(true);
            } else {
              if (response.data.data.object.length == 1) {
                window.location.href = '/';
                // navigate('/')
                localStorage.setItem('locId', response.data.data.object[0].locationId);
              } else {
                setData(response.data.data.object);
              }
            }
            setLoading(false);
          })
          .catch((err) => {
            setLoading(false);
          });
      }
    });
  };
  const handleLocation = (id) => {
    localStorage.setItem('locId', id);
    window.location.href = `/dashboards/${contextType}`;
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <PageLayout>
      {loading ? (
        <SoftBox className="main-box-loc" p={10}>
          <Spinner />
        </SoftBox>
      ) : (
        <Grid container spacing={3}>
          {contextType == 'WMS' ? (
            <>
              <SoftBox className="main-box-loc" p={10}>
                <SoftTypography variant="h4">Available locations for {comDetails.organisationName}</SoftTypography>
                <SoftBox className="child-box-loc">
                  {errorMessage ? (
                    <Box display="flex" flexDirection="column" gap="20px" justifyContent="center" alignItems="center">
                      <Button
                        onClick={goBack}
                        variant="contained"
                        sx={{ backgroundColor: '#0564fe', color: '#fff', width: '20%' }}
                        startIcon={<KeyboardBackspaceIcon />}
                      >
                        {' '}
                        Back
                      </Button>
                      <img className="src-dummy-img" src={noDatagif} />
                      <SoftTypography fontSize="13px" variant="p">
                        {message}
                      </SoftTypography>
                    </Box>
                  ) : (
                    <SoftTypography fontSize="13px" variant="p">
                      Please select a location.
                    </SoftTypography>
                  )}
                  <Box width="80%" margin="auto">
                    <Box
                      display="flex"
                      flexWrap="wrap"
                      alignItems="center"
                      justifyContent="space-evenly"
                      width="100%"
                      gap="10px"
                    >
                      {data.map((e) => {
                        return (
                          <Box onClick={() => handleLocation(e.locationId)} key={e.locationId}>
                            <Card className="all-loc-box">
                              <SoftTypography className="text-clr-loc">{e.name}</SoftTypography>
                            </Card>
                          </Box>
                        );
                      })}
                    </Box>
                  </Box>
                </SoftBox>
              </SoftBox>
            </>
          ) : contextType == 'RETAIL' ? (
            <>
              <SoftBox className="main-box-loc" p={10}>
                <SoftTypography variant="h4">Available locations for {comDetails.organisationName}</SoftTypography>
                <SoftBox className="child-box-loc">
                  {errorMessage ? (
                    <Box display="flex" flexDirection="column" gap="20px" justifyContent="center" alignItems="center">
                      <Button
                        onClick={goBack}
                        variant="contained"
                        sx={{ backgroundColor: '#0564fe', color: '#fff', width: '20%' }}
                        startIcon={<KeyboardBackspaceIcon />}
                      >
                        {' '}
                        Back
                      </Button>
                      <img className="src-dummy-img" src={noDatagif} />
                      <SoftTypography fontSize="13px" variant="p">
                        {message}
                      </SoftTypography>
                    </Box>
                  ) : (
                    <SoftTypography fontSize="13px" variant="p">
                      Please select a location.
                    </SoftTypography>
                  )}
                  <Box width="80%" margin="auto">
                    <Box display="flex" flexWrap="wrap" rowGap="10px" columnGap="2em">
                      {data.map((e) => {
                        return (
                          <Box onClick={() => handleLocation(e.branchId)} key={e.branchId} flex="1">
                            <Card className="all-loc-box">
                              <SoftTypography className="text-clr-loc">{e.displayName}</SoftTypography>
                            </Card>
                          </Box>
                        );
                      })}
                    </Box>
                  </Box>
                </SoftBox>
              </SoftBox>
            </>
          ) : null}
        </Grid>
      )}
    </PageLayout>
  );
};
