import { Chip, Typography } from '@mui/material';
import SoftBox from '../../../../../../components/SoftBox';
import DashboardLayout from '../../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../../examples/Navbars/DashboardNavbar';
import MobileNavbar from '../../../../../../examples/Navbars/MobileNavbar/mobile-navbar-drawer';
import { isSmallScreen } from '../../../../Common/CommonFunction';
import './TerminalListing.css';
import TerminalItem from './components/terminalItem/TerminalItem';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from '../../../../../../hooks/SnackbarProvider';
import {
  activeSessionDay,
  closeDay,
  getSessionDetails,
  getStoreActivity,
  StartDay,
} from '../../../../../../config/Services';
import { useNavigate } from 'react-router-dom';

const TerminalListing = () => {
  const isMobileDevice = isSmallScreen();
  const showSnackbar = useSnackbar();
  const navigate = useNavigate();
  const locId = localStorage.getItem('locId');
  const orgId = localStorage.getItem('orgId');
  const sessionId = localStorage.getItem('sessionId');
  const { uidx, roles, firstName, secondName } = JSON.parse(localStorage.getItem('user_details')) || {};
  const isMobile = window.innerWidth < 576;

  const queryClient = useQueryClient();

  const { mutate: endDay, isLoading: isEndingDay } = useMutation({
    mutationFn: async (payload) => {
      const response = await closeDay(payload);
      if (response?.data?.code === 'ECONNRESET') {
        throw new Error('Network Error');
      }
      if (!!response?.data?.es) {
        throw new Error(response?.data?.message);
      }
      showSnackbar('Day ended successfully', 'success');
      //   queryClient.invalidateQueries(['dayActive'], false);
      navigate('/sales_channels/pos/end_day_details');
    },
    onError: (error) => {
      showSnackbar(error?.message || 'Something went wrong while ending the day', 'error');
    },
  });

  const { mutate: startDay, isLoading: isStartingDay } = useMutation({
    mutationFn: async (payload) => {
      const response = await StartDay(payload);
      if (response?.data?.code === 'ECONNRESET') {
        throw new Error('Network Error');
      }
      if (!!response?.data?.es) {
        throw new Error(response?.data?.message);
      }
      showSnackbar('Day started successfully', 'success');
      return response?.data;
    },
    onSuccess: (data) => {
      localStorage.setItem('sessionId', data?.userSession?.sessionId);
      queryClient.setQueryData(['dayActive'], !!data?.userSession?.active);
    },
    onError: (error) => {
      showSnackbar(error?.message || 'Something went wrong while ending the day', 'error');
    },
  });

  const { data: isDayActive } = useQuery({
    refetchOnWindowFocus: false,
    queryKey: ['dayActive'],
    queryFn: async () => {
      const sessionRes = await activeSessionDay(locId);
      const sessionId = sessionRes?.data?.userSession?.sessionId;
      if (!sessionId) {
        return false;
      }
      localStorage.setItem('sessionId', sessionId);
      const response = await getSessionDetails(sessionId);
      if (response?.data?.code === 'ECONNRESET') {
        throw new Error('Network Error');
      }
      if (!!response?.data?.es) {
        showSnackbar(response?.data?.message, 'error');
        return false;
      }
      return !!response?.data?.userSession?.active;
    },
    onError: (error) => {
      showSnackbar(error?.message || 'Something went wrong while fetching licenses', 'error');
    },
  });

  const { data: terminalData } = useQuery({
    refetchOnWindowFocus: false,
    queryKey: ['terminalList'],
    queryFn: async () => {
      const response = await getStoreActivity(locId, orgId, sessionId, isMobile);
      if (response?.data?.code === 'ECONNRESET') {
        throw new Error('Network Error');
      }
      if (!!response?.data?.es) {
        throw new Error(response?.data?.message);
      }
      return {
        closeSessionAllowed: response?.data?.closeSessionAllowed,
        licensesCount: response?.data?.licenses.length,
        active: response?.data?.licenses.filter((license) => !!license.active),
        inactive: response?.data?.licenses.filter((license) => !license.active),
      };
    },
    onError: (error) => {
      showSnackbar(error?.message || 'Something went wrong while fetching licenses', 'error');
    },
  });

  const handleDayChange = () => {
    if (isDayActive) {
      if (!terminalData?.closeSessionAllowed) {
        showSnackbar('Please close all active sessions before ending the day', 'error');
        return;
      }
      const payload = {
        sessionId: sessionId,
        updatedBy: uidx,
      };
      endDay(payload);
    } else {
      const payload = {
        uidx: uidx,
        role: roles.includes('RETAIL_ADMIN')
          ? 'RETAIL_ADMIN'
          : roles.includes('POS_MANAGER')
          ? 'POS_MANAGER'
          : 'SUPER_ADMIN',
        organizationId: orgId,
        locationId: locId,
        createdBy: firstName + ' ' + secondName,
      };
      startDay(payload);
    }
  };

  const handleCreateLicense = () => {
    navigate('/pos/addposmachines/pos');
  };

  return (
    <DashboardLayout>
      {!isMobileDevice && <DashboardNavbar />}
      <div className="terminal-listing-container">
        <div className="terminal-listing-header">
          <Typography variant="h3" fontSize="22px" fontWeight="bold">
            Pallet charge
          </Typography>
          <div className="terminal-listing-header-chip-container">
            <Chip
              label={isDayActive ? 'End Day' : 'Start Day'}
              disabled={isEndingDay || isStartingDay}
              className={`terminal-chip ${isDayActive ? 'inactive-chip' : 'active-chip'}`}
              variant="outlined"
              onClick={handleDayChange}
            />
            <Chip
              label="+ License"
              className={`terminal-chip blue-chip`}
              variant="outlined"
              onClick={handleCreateLicense}
            />
          </div>
        </div>
        <div className="terminal-listing-body">
          {!!terminalData?.active?.length && (
            <div className="terminal-listing-section">
              <Typography variant="h3" fontSize="20px" fontWeight="bold">
                Active
              </Typography>
              <div className="terminal-listing-item-container">
                {terminalData?.active?.map((terminal) => (
                  <TerminalItem key={terminal?.licenseId} terminal={terminal} />
                ))}
              </div>
            </div>
          )}
          {!!terminalData?.inactive?.length && (
            <div className="terminal-listing-section">
              <Typography variant="h3" fontSize="20px" fontWeight="bold">
                In-active
              </Typography>
              <div className="terminal-listing-item-container">
                {terminalData?.inactive?.map((terminal) => (
                  <TerminalItem key={terminal?.licenseId} terminal={terminal} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TerminalListing;
