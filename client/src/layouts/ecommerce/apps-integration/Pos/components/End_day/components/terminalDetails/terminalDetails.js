import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import InfoIcon from '@mui/icons-material/Info';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import VerifiedIcon from '@mui/icons-material/Verified';
import { Box, Chip, Grid, IconButton, Menu, MenuItem } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SoftBox from '../../../../../../../../components/SoftBox';
import SoftButton from '../../../../../../../../components/SoftButton';
import SoftTypography from '../../../../../../../../components/SoftTypography';
import {
  getLicenseActivity,
  getLicenseDetailsById,
  getSessionDetailsForTerminal,
  regenerateActivation,
  updateLicense,
} from '../../../../../../../../config/Services';
import DashboardLayout from '../../../../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../../../../examples/Navbars/DashboardNavbar';
import { useSnackbar } from '../../../../../../../../hooks/SnackbarProvider';
import { CopyToClipBoard } from '../../../../../../Common/CommonFunction';
import AdditionalDetails from '../../../../../../Common/new-ui-common-components/additional-details';
import CommonTimeLine from '../../../../../../Common/new-ui-common-components/timeline';
import './terminalDetails.css';
import { IndividualSessionDetails } from '../individualSessionDetails/individualSessionDetails';
import moment from 'moment';
import SkeletonLoader from '../../../../../../sales-channels/ods/orderDisplay/components/SkeletonLoader';

const TerminalDetailsPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const showSnackbar = useSnackbar();
  const { licenseId } = useParams();
  const [anchorElOptions, setAnchorElOptions] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);

  const locId = localStorage.getItem('locId');
  const orgId = localStorage.getItem('orgId');
  const sessionId = localStorage.getItem('sessionId');
  const { uidx, firstName, secondName } = JSON.parse(localStorage.getItem('user_details')) || {};

  const openOptions = Boolean(anchorElOptions);
  const handleClickOptions = (event) => {
    setAnchorElOptions(event.currentTarget);
  };
  const handleCloseOptions = () => {
    setAnchorElOptions(null);
  };

  const { data: sessionDetailsData } = useQuery({
    refetchOnWindowFocus: false,
    queryKey: ['sessionDetails'],
    queryFn: async () => {
      const response = await getSessionDetailsForTerminal(locId, licenseId);
      if (response?.data?.code === 'ECONNRESET') {
        throw new Error('Network Error');
      }
      if (!!response?.data?.es) {
        showSnackbar(response?.data?.message, 'error');
        return {};
      }
      return response?.data?.data?.terminalData;
    },
    onError: (error) => {
      showSnackbar(error?.message || 'Something went wrong while fetching session details', 'error');
    },
  });

  const { data: licenseDetails } = useQuery({
    refetchOnWindowFocus: false,
    queryKey: ['licenseDetails'],
    queryFn: async () => {
      const response = await getLicenseDetailsById({ licenseId });
      if (response?.data?.code === 'ECONNRESET') {
        throw new Error('Network Error');
      }
      if (!!response?.data?.data?.es) {
        showSnackbar(response?.data?.message, 'error');
        return {};
      }
      return response?.data?.data?.data;
    },
    onError: (error) => {
      showSnackbar(error?.message || 'Something went wrong while fetching session details', 'error');
    },
  });

  const { data: licenseActivityData, isSuccess: isLicenseActivitySuccess } = useQuery({
    refetchOnWindowFocus: false,
    queryKey: ['licenseActivity'],
    queryFn: async () => {
      const response = await getLicenseActivity(locId, orgId, licenseId, sessionId);
      if (response?.data?.code === 'ECONNRESET') {
        throw new Error('Network Error');
      }
      if (!!response?.data?.es) {
        showSnackbar(response?.data?.message, 'error');
        return [];
      }
      if (response?.data?.statusCode === 15003) {
        return [];
      }
      const lastSession = response?.data?.userSessions?.slice(-1)[0]; // get last session
      formatSessionTimes(lastSession);
      return response?.data?.userSessions;
    },
    onError: (error) => {
      showSnackbar(error?.message || 'Something went wrong while fetching license activity', 'error');
    },
  });

  const { mutate: regenerateCode, isLoading: isRegenerating } = useMutation({
    mutationKey: ['regenerateCode'],
    mutationFn: async (payload) => {
      const response = await regenerateActivation(payload);
      if (response?.data?.code === 'ECONNRESET') {
        throw new Error('Network Error');
      }
      if (!!response?.data?.data?.es) {
        showSnackbar(response?.data?.data?.message, 'error');
        return {};
      }
      return response?.data?.data?.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['licenseDetails'], data);
      showSnackbar('Activation code regenerated successfully', 'success');
      handleCloseOptions();
    },
    onError: (error) => {
      showSnackbar(error?.message || 'Something went wrong while fetching session details', 'error');
    },
  });

  const { mutate: decoupleMacId, isLoading: isUpdating } = useMutation({
    mutationKey: ['decoupleMacId'],
    mutationFn: async (payload) => {
      const response = await updateLicense(payload);
      if (response?.data?.code === 'ECONNRESET') {
        throw new Error('Network Error');
      }
      if (!!response?.data?.data?.es) {
        showSnackbar(response?.data?.data?.message, 'error');
        return {};
      }
      return response?.data?.data?.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['licenseDetails'], data);
      showSnackbar('MAC ID decoupled successfully', 'success');
      handleCloseOptions();
    },
    onError: (error) => {
      showSnackbar(error?.message || 'Something went wrong while fetching session details', 'error');
    },
  });

  const formatSessionTimes = (session) => {
    if (!!session) {
      const startTime = moment.utc(session?.startTime).local().format('DD MMM YYYY, LT');
      const lastSync = session?.lastSync ? moment.utc(session?.lastSync).local().format('DD MMM YYYY, LT') : 'N/A';
      const endTime = session?.endTime
        ? moment.utc(session?.endTime).local().format('DD MMM YYYY, LT')
        : moment.utc().local().format('DD MMM YYYY, LT');

      const startMoment = moment(startTime);
      const endMoment = moment(endTime);

      const diff = endMoment.diff(startMoment);
      const duration = moment.duration(diff);
      const intervalTime = `${duration.hours()} hrs ${duration.minutes()} mins`;

      setSelectedSession({
        ...session,
        startTime,
        endTime,
        intervalTime,
        lastSync,
      });
    }
  };

  const horizData = useMemo(
    () => [
      {
        tabName: 'Total orders',
        tabValue: 'totalOrders',
        tabDescription: `from ${sessionDetailsData?.terminalSalesData?.totalSessions ?? 0} sessions`,
        tabIcon: '',
      },
      {
        tabName: 'Returns',
        tabValue: 'returns',
        tabDescription: `from ${sessionDetailsData?.terminalSalesData?.totalOrders ?? 0} orders`,
        tabIcon: '',
      },
      {
        tabName: 'Cash advance',
        tabValue: 'totalCashAdvance',
        tabDescription: `estimated ₹${sessionDetailsData?.terminalSalesData?.cashAdvance ?? 0}`,
        tabIcon: '',
      },
      {
        tabName: 'Receipt reprint',
        tabValue: 'reprintCount',
        tabDescription: `from ${sessionDetailsData?.terminalSalesData?.totalOrders ?? 0} orders`,
        tabIcon: '',
      },
      {
        tabName: 'Cart deletion',
        tabValue: 'cartDeletionCount',
        tabDescription: `from ${sessionDetailsData?.terminalSalesData?.totalOrders ?? 0} orders`,
        tabIcon: '',
      },
      {
        tabName: 'Online billing',
        tabValue: 'onlinePercentage',
        tabDescription: `${sessionDetailsData?.terminalSalesData?.offlineBillingPercentage ?? 0}% billing done offline`,
        tabIcon: '',
      },
    ],
    [],
  );

  // const timelineStatusObject = (statusName, userName, date, time) => {
  //   switch (statusName) {
  //     case 'SESSION_CREATED':
  //       return {
  //         name: 'Session Created',
  //         iconColor: '#0562fb',
  //         icon: <AddCircleOutlineIcon />,
  //         userDesc: `Created by ${userName}`,
  //         dateTime: `${date} ${time}`,
  //       };
  //     default:
  //       return {
  //         name: 'Name Not Found',
  //         iconColor: '#0562fb',
  //         icon: '',
  //         userDesc: 'Unknown User',
  //         dateTime: 'Unknown Date',
  //       };
  //   }
  // };

  // const timelineData = [
  //   {
  //     ...timelineStatusObject(
  //       'SESSION_CREATED',
  //       terminalData?.createdBy,
  //       dayjs(terminalData.createdAt).format('MMMM D, YYYY, h:mm A') || 'NA',
  //       dayjs(terminalData.createdAt).format(' h:mm A') || 'NA',
  //     ),
  //   },
  // ];

  const additionalHorizData = useMemo(() => {
    return {
      totalOrders: sessionDetailsData?.terminalSalesData?.totalOrders ?? 0,
      returns: sessionDetailsData?.terminalSalesData?.totalReturns ?? 0,
      totalCashAdvance: `₹${sessionDetailsData?.terminalSalesData?.totalCashAdvance ?? 0}`,
      reprintCount: sessionDetailsData?.cartMetrics?.receiptPrints ?? 0,
      cartDeletionCount: sessionDetailsData?.cartMetrics?.cartDeletion ?? 0,
      onlinePercentage: `${sessionDetailsData?.terminalSalesData?.onlineBillingPercentage ?? 0}%`,
    };
  }, [sessionDetailsData]);

  const licenseStatus = useMemo(() => (!!licenseDetails?.active ? 'Active' : 'Inactive'), [licenseDetails]);
  const billingStatus = useMemo(() => {
    const lastSession = licenseActivityData?.slice(-1)[0];
    switch (lastSession?.status) {
      case 'ACTIVE':
        return 'Billing online';
      case 'INACTIVE':
        return 'Billing inactive';
      case 'CLOSED':
        return 'Billing offline';
      default:
        return 'Billing offline';
    }
  }, [licenseActivityData]);

  const handleRegenerate = () => {
    regenerateCode({ licenseId });
  };

  const handleDecouple = () => {
    const payload = {
      licenseId: licenseId,
      macId: 'NA',
      updatedBy: uidx,
      updatedByName: `${firstName} ${secondName}`,
    };
    decoupleMacId(payload);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox className="container-card">
        <SoftBox className="terminal-header-container">
          <SoftBox className="terminal-details-left-container" flex={0.65}>
            <div className="terminal-details-header-title">
              <div className="terminal-details-title-container">
                <SoftTypography fontWeight="bold">{licenseDetails?.licenseName}</SoftTypography>
                <Chip
                  label={licenseStatus}
                  className={`terminal-chip ${!!licenseDetails?.active ? 'active-chip' : 'inactive-chip'}`}
                  variant="outlined"
                />
              </div>
              <div className="terminal-details-title-container">
                <SoftTypography fontWeight="bold">
                  MAC ID{' '}
                  <span style={{ color: 'grey' }}>
                    {licenseDetails?.macId && licenseDetails.macId !== 'NA' ? licenseDetails.macId : 'Not Activated'}
                  </span>
                </SoftTypography>
                <VerifiedIcon sx={{ color: !!licenseDetails?.isVerified ? '#00C853' : '#c3c3c3' }} />
              </div>
            </div>
            <SoftBox className="terminal-details-activation-code-container">
              <SoftTypography fontSize="14px" fontWeight="bold">
                Activated on
              </SoftTypography>
              <SoftTypography fontSize="14px">
                {licenseDetails?.activatedOn
                  ? moment.utc(licenseDetails?.activatedOn).local().format('DD MMM YYYY, LT')
                  : 'N/A'}
              </SoftTypography>
              <SoftTypography fontSize="14px" fontWeight="bold">
                Activation code
              </SoftTypography>
              <SoftTypography fontSize="14px">
                <CopyToClipBoard params={{ value: licenseDetails?.activationCode }} />
              </SoftTypography>
            </SoftBox>
            <SoftBox className="terminal-details-location-container">
              <SoftBox>
                <SoftTypography fontSize="14px" fontWeight="bold">
                  Location
                </SoftTypography>
                <SoftTypography fontSize="14px">{licenseDetails?.locId}</SoftTypography>
              </SoftBox>
              <SoftBox>
                <SoftTypography fontSize="14px" fontWeight="bold">
                  License type
                </SoftTypography>
                <SoftTypography fontSize="14px">{licenseDetails?.licenseType}</SoftTypography>
              </SoftBox>
            </SoftBox>
          </SoftBox>
          <IconButton
            id="basic-button"
            aria-controls={openOptions ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={openOptions ? 'true' : undefined}
            onClick={handleClickOptions}
            className="stock-count-details-options"
          >
            <MoreHorizIcon color="primary" />
          </IconButton>
          <Menu
            id="basic-menu"
            anchorEl={anchorElOptions}
            open={openOptions}
            onClose={handleCloseOptions}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <MenuItem style={{ display: 'flex' }} disabled={isUpdating} onClick={handleDecouple}>
              <div>Decouple MAC ID</div>
            </MenuItem>
            <MenuItem style={{ display: 'flex' }} disabled={isRegenerating} onClick={handleRegenerate}>
              <div>Regenerate Activation Code</div>
            </MenuItem>
          </Menu>
          <SoftBox flex={0.35} className="terminal-details-right-container">
            {!!licenseActivityData?.length ? (
              <>
                <div className="terminal-details-right-top-container">
                  <div className="terminal-details-session-data-container">
                    <SoftTypography fontWeight="bold">Session</SoftTypography>
                    <Chip
                      label={billingStatus}
                      className={`terminal-chip ${billingStatus == 'Billing online' ? 'active-chip' : 'inactive-chip'}`}
                      variant="outlined"
                    />
                  </div>
                  <div className="terminal-details-right-text">
                    <CurrencyRupeeIcon />
                    {selectedSession?.salesData?.totalOrdersValue || 'N/A'}
                  </div>
                  <div className="terminal-details-right-text">
                    <HourglassBottomIcon /> {selectedSession?.intervalTime}
                  </div>
                </div>
                <SoftBox className="terminal-details-right-data-container">
                  <SoftTypography fontSize="12px">Session start time</SoftTypography>
                  <SoftTypography fontSize="12px">{selectedSession?.startTime || 'N/A'}</SoftTypography>
                  <SoftTypography fontSize="12px">Last sync</SoftTypography>
                  <SoftTypography fontSize="12px">{selectedSession?.lastSync || 'N/A'}</SoftTypography>
                  <SoftTypography fontSize="12px">Cashier</SoftTypography>
                  <SoftTypography fontSize="12px">{selectedSession?.createdByName || 'N/A'}</SoftTypography>
                </SoftBox>
                {selectedSession?.status === 'ACTIVE' && (
                  <SoftButton
                    sx={{ alignSelf: 'flex-start' }}
                    onClick={() =>
                      navigate(`/sales_channels/pos/closeSession/${selectedSession?.sessionId}/${licenseId}`)
                    }
                    variant="contained"
                    className="contained-softbutton"
                  >
                    Close Session
                  </SoftButton>
                )}
              </>
            ) : (
              <div className="terminal-no-session-data">
                <InfoIcon style={{ fontSize: '50px', color: '#333' }} />
                <SoftTypography fontSize="16px" fontWeight="bold">
                  No Session Data Available
                </SoftTypography>
              </div>
            )}
          </SoftBox>
        </SoftBox>
      </SoftBox>
      <AdditionalDetails additionalDetailsArray={horizData} additionalDetails={additionalHorizData} />
      <div className="terminal-details-bottom-container">
        {/* <SoftBox sx={{ width: '100%', flex: '0.3' }}> */}
        {/*   <SoftTypography fontSize="14px" fontWeight="bold" mb={1}> */}
        {/*     Session Timeline */}
        {/*   </SoftTypography> */}
        {/*   <SoftBox className="component-bg-br-sh-p"> */}
        {/*     <CommonTimeLine timelineArray={timelineData} /> */}
        {/*   </SoftBox> */}
        {/* </SoftBox> */}
        <SoftBox sx={{ width: '100%' }}>
          <div className="terminal-session-details-container">
            <SoftTypography fontSize="14px" fontWeight="bold" mb={1}>
              Individual Session Report
            </SoftTypography>
            {!!licenseActivityData?.length ? (
              <IndividualSessionDetails data={licenseActivityData} id={licenseId} type={'session'} />
            ) : (
              <div className="terminal-no-session-data">
                <InfoIcon style={{ fontSize: '50px', color: '#333' }} />
                <SoftTypography fontSize="16px" fontWeight="bold">
                  No Session Data Available
                </SoftTypography>
              </div>
            )}
          </div>
        </SoftBox>
      </div>
    </DashboardLayout>
  );
};

export default TerminalDetailsPage;
