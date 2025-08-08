import { Box, Card, CircularProgress, Grid, Typography } from '@mui/material';
import { buttonStyles } from '../Common/buttonColor';
import { clearCookie, isSmallScreen, isRmsMobileApp } from '../Common/CommonFunction';
import {
  fetchOrganisations,
  getAllRoles,
  getFeatureSettings,
  roleBasedPermission,
  subscriptionDetailsForOrg,
  userRefreshToken,
} from '../../../config/Services';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../../hooks/SnackbarProvider';
import EnvConfig from '../../../config/EnvConfig';
import LocationImage from '../../../assets/images/location-image.png';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LocationSkeleton from './components/Location-Skeleton';
import OrgLocationCard from './OrgLocationCard';
import React, { useEffect, useState } from 'react';
import SoftBox from '../../../components/SoftBox';
import SoftButton from '../../../components/SoftButton';
import SoftTypography from '../../../components/SoftTypography';
import { emit } from 'react-native-react-bridge/lib/web';

const OrgLocationPage = () => {
  const accountId = localStorage.getItem('AppAccountId');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [retail, setRetail] = useState([]);
  const [contextIds, setContextIds] = useState([]);
  const [contextOrgIds, setContextOrgIds] = useState([]);
  const [vmsData, setVmsData] = useState([]);
  const [errororg, setErrororg] = useState();
  const [loadingState, setLoadingState] = useState({});
  const showSnackbar = useSnackbar();
  const [isNavigating, setIsNavigating] = useState(false);
  const [cookies, setCookie] = useCookies(['user']);

  const isMobileDevice = isSmallScreen();
  const envSigninUrl = EnvConfig().signupUrl;

  useEffect(() => {
    fetchingOrganisation();
  }, []);

  const handleClick = (orgname) => {
    setOpen(true);
    showSnackbar(`No locations available for ${orgname}`, 'error');
  };

  const fetchingOrganisation = () => {
    fetchOrganisations()
      .then((res) => {
        if (res?.data?.data?.status === 'ERROR') {
          localStorage.setItem('user_details', {});
          localStorage.setItem('user_roles', []);
          localStorage.setItem('user_name', '');
          showSnackbar(res?.data?.data?.message || 'Some Error Occured', 'error');
          return;
        }
        setLoading(true);
        const userDetails = res?.data?.data?.userDetails;
        const orgIds = res?.data?.data?.orgIdList;
        const retails = res?.data?.data?.retails;
        localStorage.setItem('user_details', JSON.stringify(userDetails || {}));
        localStorage.setItem('user_roles', JSON.stringify(userDetails?.roles || []));
        localStorage.setItem('user_name', userDetails?.firstName + ' ' + userDetails?.secondName);
        const userContext = userDetails?.contexts;
        const contexts = new Set();
        const contextOrgs = new Set();
        for (const userRole in userContext) {
          const metaData = userContext[userRole].meta;
          for (const meta of metaData) {
            setContextIds((prevContextIds) => new Set([...prevContextIds, meta.contextId]));
            setContextOrgIds((prevContextIds) => new Set([...prevContextIds, meta.org_id]));
            contexts.add(meta.contextId);
            contextOrgs.add(meta.org_id);
          }
        }
        setVmsData(orgIds?.VMS);
        setRetail(retails);
        retails?.forEach((retail) => {
          if (retail?.branches?.length === 0) {
            handleClick(retails?.displayName);
          }
        });

        setLoading(false);
      })
      .catch((error) => {
        showSnackbar(error, 'error');
        setRetail([]);
        setVmsData([]);
        setContextIds([]);
        setContextOrgIds([]);
        // localStorage.setItem('user_details', JSON.stringify({}));
        // localStorage.setItem('user_roles', JSON.stringify([]));
      });
  };

  const user_roles = localStorage.getItem('user_roles');
  const userRole = user_roles ? JSON.parse(user_roles) : [];
  let allRoles = [];
  const access_token = localStorage.getItem('access_token');

  const handleUnauthorized = () => {
    localStorage.clear();
    navigate('/');
    clearCookie('access_token');
    clearCookie('refresh_token');
  };

  const refreshToken = async () => {
    const refresh_token = localStorage.getItem('refresh_token');
    if (refresh_token) {
      try {
        const res = await userRefreshToken();
        localStorage.setItem('access_token', res?.data?.data?.at);
        localStorage.setItem('refresh_token', res?.data?.data?.rt);
        setCookie('access_token', res?.data?.data?.at, { path: '/' });
        setCookie('refresh_token', res?.data?.data?.rt, { path: '/' });
        sessionStorage.setItem('access_token', res?.data?.data?.at);
        return res;
      } catch (err) {
        if (
          err?.response?.data?.message == 'UNAUTHORIZED RT' ||
          err?.response?.data?.message == 'User not found' ||
          err?.response?.data?.message == 'Verifying RT FAILED'
        ) {
          handleUnauthorized();
        }
        throw err;
      }
    } else {
      throw new Error('No refresh token available');
    }
  };

  const refreshAndRedirect = async (contextType, locationId) => {
    try {
      const res = await refreshToken();
      if (isRmsMobileApp()) {
        //condition to render B2B app in react native
        emit({
          type: 'selectedBranch',
          data: null,
        });
        return;
      }
      window.location.href = `/dashboards/${contextType}`;
    } catch (error) {
      showSnackbar(error?.response?.data?.message || 'Something Went Wrong', 'error');
    } finally {
      setLoadingState((prevState) => ({
        ...prevState,
        [locationId]: false,
      }));
    }
  };

  const handleLocation = async (
    locationId,
    organizationId,
    contextType,
    sourceApp,
    organisationName,
    locationName,
    retailType,
  ) => {
    setIsNavigating(true);
    localStorage.removeItem('data');
    setLoadingState((prevState) => ({
      ...prevState,
      [locationId]: true,
    }));
    try {
      const response = await getFeatureSettings(organizationId);
      // console.log('featureResponse', response);
      if (response.data.data.es == 2) {
        // console.log('data', response.data.data.message);
      } else {
        const result = response?.data?.data?.data;
        if (result) {
          localStorage.setItem('featureSettings', JSON.stringify(result) || {});
        }
        // console.log('featureSettings', result);
      }
    } catch (err) {
      console.log('error', err);
    }

    try {
      const response = await subscriptionDetailsForOrg(organizationId);
      // console.log('responseDetails', response);
      const result = response?.data?.data?.data;
      const subsData = result?.subscriptionResponse;
      const activePlanDetails = {
        billingCycle: subsData?.billingCycle,
        planName: subsData?.packageName,
        startDate: result?.accountSubscriptionResponse?.startDate,
        netPrice: subsData?.netPrice,
        endDate: result?.accountSubscriptionResponse?.endDate,
        subscriptionId: subsData?.subscriptionId,
        isEnterprise: subsData?.isEnterprise,
      };
      const isEnterprise = subsData?.isEnterprise;
      localStorage.setItem('activePlanDetails', JSON.stringify(activePlanDetails));

      localStorage.setItem('isEnterprise', isEnterprise);
    } catch (err) {
      // console.log('error', err);
    }

    localStorage.removeItem('Orgnames');
    localStorage.removeItem('locId');
    localStorage.removeItem('email_connected');
    localStorage.removeItem('cartId-SO');
    localStorage.removeItem('cartId-MP');
    localStorage.removeItem('epoNumber');
    localStorage.removeItem('Transfer_Type');
    localStorage.removeItem('returnJobId');
    localStorage.setItem('contextType', contextType);
    localStorage.setItem('sourceApp', sourceApp);
    localStorage.setItem('orgId', organizationId);
    localStorage.setItem('locId', locationId);
    localStorage.setItem('orgName', organisationName);
    localStorage.setItem('locName', locationName);
    localStorage.setItem('retailType', retailType);
    getAllRoles(contextType)
      .then((res) => {
        allRoles = res?.data?.data;
        const commonNames = allRoles?.filter((obj) => userRole?.includes(obj.name))?.map((obj) => obj.name);
        const payload = {
          roles: commonNames,
        };
        roleBasedPermission(payload)
          .then((res) => {
            const permissions = {};
            for (const key in res?.data?.data) {
              if (key.includes(contextType)) {
                permissions[key] = res.data.data[key];
              }
            }
            localStorage.setItem('permissions', JSON.stringify(permissions));
            setIsNavigating(false);
            refreshAndRedirect(contextType, locationId);
          })
          .catch((err) => {
            setLoadingState((prevState) => ({
              ...prevState,
              [locationId]: false,
            }));
          });
      })
      .catch((err) => {
        setLoadingState((prevState) => ({
          ...prevState,
          [locationId]: false,
        }));
      });
  };

  const [hiddenBranches, setHiddenBranches] = useState([]);

  const toggleBranches = (retailId) => {
    if (hiddenBranches.includes(retailId)) {
      setHiddenBranches(hiddenBranches.filter((id) => id !== retailId));
    } else {
      setHiddenBranches([...hiddenBranches, retailId]);
    }
  };

  useEffect(() => {
    if (
      retail &&
      retail?.retails &&
      retail?.retails?.length > 0 &&
      retail?.retails[0]?.branches &&
      retail?.retails[0]?.branches?.length === 1
    ) {
      const singleRetailId = retail.retails[0].retailId;
      const singleBranchId = retail.retails[0].branches[0].branchId;
      handleLocation(singleBranchId, singleRetailId, 'RETAIL', 'PALLET_RETAIL');
    }
  }, []);

  const onBilling = () => {
    navigate('/Billinginfo');
  };

  const handleNoPermission = (navigate) => {
    Swal.fire({
      icon: 'error',
      title: 'No Organization/Location found, Please add Location',
      showConfirmButton: true,
      confirmButtonText: 'OK',
    }).then(() => {
      localStorage.clear();
      clearCookie('access_token');
      clearCookie('refresh_token');
      navigate('/');
    });
    return null;
  };
  const data = retail?.retails?.map((branch, i) => {
    const output = branch?.branches.map((item) => contextIds.has(item?.branchId));
    return output;
  });
  if (data?.flat()?.every((item) => item === false)) {
    handleNoPermission(navigate);
  }

  const [open, setOpen] = React.useState(false);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <>
      <SoftBox sx={{ marginTop: isMobileDevice ? '75px !important' : '70px !important' }}>
        {retail && retail?.length > 0 ? (
          <SoftBox sx={{ paddingBottom: isMobileDevice && '80px !important' }}>
            {retail?.map((retail) =>
              retail?.branches.some((item) => contextIds.has(item.branchId)) && retail.primaryFlag === true ? (
                <OrgLocationCard
                  isNavigating={isNavigating}
                  retail={retail}
                  loadingState={loadingState}
                  LocationImage={LocationImage}
                  handleLocation={handleLocation}
                  hiddenBranches={hiddenBranches}
                  isMobileDevice={isMobileDevice}
                  onBilling={onBilling}
                  contextIds={contextIds}
                  toggleBranches={toggleBranches}
                />
              ) : null,
            )}
            {!!vmsData.length && (
              <Box sx={{ padding: !isMobileDevice ? '0rem 5rem 2rem 5rem !important' : '0rem !important' }}>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Grid container>
                    {vmsData?.map((organization) => (
                      <Grid item xs={12} key={organization}>
                        <SoftBox
                          className="vms-card-div-one"
                          onClick={() => handleLocation(organization, organization, 'VMS', 'PALLET_VMS', organization)}
                        >
                          <Card className="welcome-container location-card-box-shadow">
                            <SoftBox style={{ display: 'flex', minWidth: '300px' }}>
                              <SoftBox>
                                <img
                                  style={{ height: !isMobileDevice ? '90px' : '115px', marginRight: '16px' }}
                                  src="https://static.vecteezy.com/system/resources/previews/010/164/663/original/vms-letter-technology-logo-design-on-white-background-vms-creative-initials-letter-it-logo-concept-vms-letter-design-vector.jpg"
                                />
                              </SoftBox>
                              <SoftBox sx={{ width: '100%', padding: '10px' }}>
                                <Typography
                                  variant="h6"
                                  component="div"
                                  style={{ color: '#2c292e', fontWeight: '600', fontSize: '1rem' }}
                                >
                                  {organization}
                                </Typography>
                                <SoftBox className="vms-info-main-div">
                                  <LocationOnIcon />
                                  <SoftTypography sx={{ fontSize: '14px', marginRight: '5px' }}>Vms</SoftTypography>
                                  <SoftTypography className="vms-free">Free</SoftTypography>
                                </SoftBox>
                                <SoftButton
                                  color={buttonStyles.containedColor}
                                  variant={buttonStyles.primaryVariant}
                                  onClick={onBilling}
                                  className="dashboard-billing-card-btn"
                                  sx={{ marginTop: '0px !important' }}
                                >
                                  {' '}
                                  Billing Information
                                </SoftButton>
                              </SoftBox>
                            </SoftBox>
                          </Card>
                        </SoftBox>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Box>
            )}
          </SoftBox>
        ) : (
          <SoftBox className={`${!isMobileDevice ? 'circular-progress-div' : 'skeleton-main-div'}`}>
            {!isMobileDevice ? <CircularProgress sx={{ color: '#0562fb !important' }} /> : <LocationSkeleton />}
          </SoftBox>
        )}
      </SoftBox>
    </>
  );
};

export default OrgLocationPage;
