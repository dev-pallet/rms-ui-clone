//soft ui components
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import SoftBox from '../../../../components/SoftBox';
import SoftSelect from '../../../../components/SoftSelect';
import SoftTypography from '../../../../components/SoftTypography';

//mui components
import { Button, Checkbox, InputLabel, Switch } from '@mui/material';

//react
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

// icons
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import ShoppingBasketOutlinedIcon from '@mui/icons-material/ShoppingBasketOutlined';

//styles
import './loyalitypoints.css';


const label = { inputProps: { 'aria-label': 'Switch demo' } };

export const LoyaltyReminder = () => {

  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);
  const [checkedEx, setCheckedEx] = useState(false);

  const remainder_icons = {
    color: 'white !important',
    padding: '10px',
    borderRadius: '50%',
    marginRight: '1rem',
    fontSize: '36px !important'
  };

  const switchHandler = (event) => {
    setChecked(event.target.checked);
  };


  const switchHandlerExpiry = (event) => {
    setCheckedEx(event.target.checked);
  };

  const reminderArray = [
    {
      head: 'Purchase',
      text: 'Customer makes a purchase and earns loyalty points.', terms: null,
      clr: 'rgb(8,97,101)',
      icon: <ShoppingBasketOutlinedIcon
        sx={{ ...remainder_icons, backgroundColor: 'rgb(8,97,101)' }}
      />
    },
    {
      head: 'Reminder',
      text: 'Customer automatically gets a reminder message about their points balance.',
      terms: '30 days since last purchase',
      clr: 'rgb(9,146,80)',
      icon: <NotificationsActiveOutlinedIcon
        sx={{ ...remainder_icons, backgroundColor: 'rgb(9,146,80)' }}
      />
    },
    {
      head: 'Expiry Alert ',
      text: 'Customer gets an alert 14 days before their points are expiring.',
      terms: '11 months and 11 days since last purchase',
      clr: 'rgb(237,197,36)',
      icon: <NotificationsActiveOutlinedIcon
        sx={{ ...remainder_icons, backgroundColor: 'rgb(237,197,36)' }}
      />
    },
    {
      head: 'Points Expired ',
      text: 'Customer\'s points expire if they do not make a purchase before the expiry date.',
      terms: '12 Months since last purchase',
      clr: 'rgb(211,47,47)',
      icon: <DeleteOutlineOutlinedIcon
        sx={{ ...remainder_icons, backgroundColor: 'rgb(211,47,47)' }}
      />
    },
  ];

  const getCurrentMonthDays = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const daysInMonth = new Date(currentDate.getFullYear(), currentMonth + 1, 0).getDate();

    const daysArray = Array.from({ length: daysInMonth }, (_, index) => ({
      label: index + 1,
      value: index + 1,
    }));

    return daysArray;
  };

  const daysInCurrentMonth = getCurrentMonthDays();

  const dwmArray = [
    { label: 'Days', value: 'days' },
    { label: 'Weeks', value: 'weeks' },
    { label: 'Months', value: 'months' }
  ];

  const monthOptions = Array.from({ length: 12 }, (_, index) => ({
    label: `Month ${index + 1}`,
    value: index + 1,
  }));

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox className="loyalty-config-next-btn-box">
        <SoftTypography variant="h4" fontSize="23px" fontWeight="bold" marginBottom="25px ">Loyalty Configuration</SoftTypography>
        <Button variant="contained" className="loyalty-config-next-btn" onClick={() => navigate('/new-loyalty-config/channels')}>Next</Button>
      </SoftBox>
      <SoftBox className="bonus-points-main-box">
        <SoftBox className="loyalty-reminder-main-box">
          {reminderArray.map((e) => (
            <SoftBox className="loyalty-reminder-box">
              {e.icon}
              <SoftBox ml={2}>
                <SoftTypography variant="h4" fontWeight="bold" fontSize="1.5rem">{e.head} - <b style={{ color: e.clr }}>{e.terms}</b></SoftTypography>
                {e.text ? <SoftTypography variant="h4" color="rgb(107,120,119)" fontSize="1.2rem">{e.text}</SoftTypography> : null}
              </SoftBox>
            </SoftBox>
          ))}
        </SoftBox>
        <SoftBox className="loyalty-reminder-content-box">
          <SoftTypography variant="h4" fontSize="23px" fontWeight="bold">Set Reminder & Expiry</SoftTypography>
          <SoftBox className="loyalty-branding-box" mt={2}>
            <SoftTypography variant="h4" fontSize="23px" fontWeight="bold">Points Reminder</SoftTypography>
            <Switch {...label} checked={checked} onChange={switchHandler} size="medium" />
          </SoftBox>
          <SoftBox mb={1} ml={0.5} display="flex" flexDirection="column" gap={1} className="input-container">
            <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                            Remind customers about their available points balance when they have not made a purchase in.
            </InputLabel>
            <SoftBox style={{ width: '100%', display: 'flex', gap: '1rem' }} className={checked ? 'nonClickableDiv' : null}>
              <SoftSelect
                options={daysInCurrentMonth}
                className="loyalty-remainder-days-select"
              />
              <SoftSelect
                options={dwmArray}
                className="loyalty-remainder-select-box"
              />
            </SoftBox>
          </SoftBox>
          <SoftBox className="loyalty-reminder-checkbox-card">
            <Checkbox
              {...label}
              sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
              //   value={checked}
              //   onChange={handleRewardCheck}
              size="large"
            />
            <SoftTypography variant="h4" fontSize="15px">Only remind those customers who are eligible to redeem a reward</SoftTypography>
          </SoftBox>
          <SoftBox className="loyalty-branding-box" mt={2}>
            <SoftTypography variant="h4" fontSize="23px" fontWeight="bold">Points Reminder</SoftTypography>
            <Switch {...label} checked={checkedEx} onChange={switchHandlerExpiry} size="medium" />
          </SoftBox>
          <SoftBox mb={1} ml={0.5} display="flex" flexDirection="column" gap={1} className="input-container">
            <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                            Remind customers about their available points balance when they have not made a purchase in.
            </InputLabel>
            <SoftBox style={{ width: '100%', display: 'flex', gap: '1rem', justifyContent: 'flex-start', alignItems: 'center' }} className={checkedEx ? 'nonClickableDiv' : null}>
              <SoftSelect
                options={monthOptions}
                className="loyalty-remainder-days-select"
              />
              <SoftTypography variant="h4" fontSize="15px">Months after last purchase</SoftTypography>

            </SoftBox>
          </SoftBox>
        </SoftBox>
      </SoftBox>
    </DashboardLayout>
  );
};