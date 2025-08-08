import CircleIcon from '@mui/icons-material/Circle';
import CountertopsIcon from '@mui/icons-material/Countertops';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LoopIcon from '@mui/icons-material/Loop';
import PersonalVideoIcon from '@mui/icons-material/PersonalVideo';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import TimerIcon from '@mui/icons-material/Timer';
import VerifiedIcon from '@mui/icons-material/Verified';
import WifiIcon from '@mui/icons-material/Wifi';
import { IconButton, Typography } from '@mui/material';
import Fade from '@mui/material/Fade';
import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import moment from 'moment';
import { Fragment, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './TerminalItem.css';

const HtmlTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)(
  ({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#fff',
      color: 'rgba(0, 0, 0, 0.87)',
      fontSize: theme.typography.pxToRem(12),
      border: '1px solid #dadde9',
    },
  }),
);

const TerminalItem = ({ terminal }) => {
  const navigate = useNavigate();
  const billingStatus = useMemo(() => {
    switch (!!terminal?.isDeviceOnline) {
      case true:
        return 'Billing online';
      case false:
        return 'Billing offline';
      default:
        return 'Billing inactive';
    }
  }, []);

  const sessionTimeText = useMemo(() => {
    if (!terminal?.sessionDto) {
      return 'N/A';
    }

    const startMoment = moment.utc(terminal?.sessionDto?.startTime).local();
    const endMoment = terminal?.sessionDto?.endTime ? moment.utc(terminal?.sessionDto?.endTime).local() : moment();

    const duration = moment.duration(endMoment.diff(startMoment));
    const intervalTime = `${duration.hours()} hrs ${duration.minutes()} mins`;

    return terminal?.sessionDto?.endTime ? `Last session ${intervalTime}` : `Current session ${intervalTime}`;
  }, [terminal?.sessionDto]);

  const syncText = useMemo(() => {
    if (!terminal?.lastSync) {
      return 'N/A';
    }
    const lastSync = moment(terminal?.lastSync);
    const duration = moment.duration(moment().diff(lastSync));
    const intervalTime = `${duration.hours()} hrs ${duration.minutes()} mins`;
    return `Last sync ${intervalTime}`;
  }, []);

  const rowData = useMemo(
    () => [
      {
        icon: (
          <CircleIcon sx={{ color: terminal?.sessionDto?.status === 'ACTIVE' ? '#00C853' : 'red', fontSize: '16px' }} />
        ),
        data: terminal?.sessionDto?.status === 'ACTIVE' ? 'Session Active' : 'Session Inactive',
      },
      {
        icon: <WifiIcon sx={{ color: !!terminal?.isDeviceOnline ? '#00C853' : 'red', fontSize: '16px' }} />,
        data: billingStatus,
      },
      {
        icon: <TimerIcon sx={{ color: '#2782a7', fontSize: '16px' }} />,
        data: sessionTimeText,
      },
      {
        icon: <LoopIcon sx={{ color: 'var(--blue)', fontSize: '16px' }} />,
        data: syncText,
      },
    ],
    [terminal],
  );

  const handleTerminalClick = () => {
    navigate(`/sales_channels/pos/terminal_details/${terminal?.licenseId}`);
  };

  return (
    <div className="terminal-listing-item" onClick={handleTerminalClick}>
      <div className="terminal-listing-item-header">
        <Typography variant="h3" fontSize="16px" fontWeight="bold">
          <CountertopsIcon sx={{ color: 'var(--blue)', fontSize: '24px' }} /> {terminal.licenseName}
        </Typography>
        <div className="terminal-status-icon-container">
          {terminal?.licenseType === 'MPOS' ? (
            <PhoneIphoneIcon sx={{ color: 'var(--blue)', fontSize: '18px' }} />
          ) : (
            <PersonalVideoIcon sx={{ color: 'var(--blue)', fontSize: '18px' }} />
          )}
          <VerifiedIcon
            sx={{
              color: !!terminal?.isDeviceProvisioned ? '#00C853' : '#c3c3c3',
              fontSize: '18px',
              marginLeft: '5px',
            }}
          />
        </div>
      </div>
      <div className="terminal-listing-item-body">
        {rowData?.map((row, index) => (
          <div key={index} className="terminal-listing-item-body-row">
            {row?.icon}
            <Typography variant="h3" fontSize="12px" fontWeight="300">
              {row?.data}
            </Typography>
          </div>
        ))}
      </div>
      <div className="terminal-listing-info-button">
        <HtmlTooltip
          TransitionComponent={Fade}
          TransitionProps={{ timeout: 300 }}
          title={
            <Fragment>
              <Typography variant="h3" fontSize="13px" fontWeight="300">
                Backend version: {terminal?.backendVersion}
              </Typography>
              <Typography variant="h3" fontSize="13px" fontWeight="300">
                Desktop version: {terminal?.desktopVersion}
              </Typography>
            </Fragment>
          }
        >
          <IconButton aria-label="Info">
            <InfoOutlinedIcon sx={{ fontSize: '18px' }} />
          </IconButton>
        </HtmlTooltip>
      </div>
    </div>
  );
};

export default TerminalItem;
