//mui components
import { Avatar, Button, Card } from '@mui/material';

//soft ui components
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import SoftBox from '../../../../components/SoftBox';
import SoftTypography from '../../../../components/SoftTypography';

//styles
import './loyalitypoints.css';

//react
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

//icons
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import PaidIcon from '@mui/icons-material/Paid';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import TitleOutlinedIcon from '@mui/icons-material/TitleOutlined';

//redux
import { LoyaltyPoints } from './loyaltyPoints';
import { LoyaltyTerms } from './loyaltyTerms';
import { LoyaltyTitle } from './loyaltyTitle';
import {
  getLoyaltyPoints,
  getLoyaltyReward,
  getLoyaltyTerms,
  getLoyaltyTitle,
} from '../../../../datamanagement/loyaltyProgramSlice';
import { useSelector } from 'react-redux';
import LoyaltyReward from './loyaltyReward';

//custom components
import { useSnackbar } from '../../../../hooks/SnackbarProvider';

export const loyaltyRewardStyles = {
  fontWeight: 'bold',
  fontSize: '1rem',
  color: '#344767',
};

export const NewLoyaltyConfig = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const loyaltyProgram = pathname.split('/').pop();

  const showSnackbar = useSnackbar();
  const loyaltyTitle = useSelector(getLoyaltyTitle);
  const getPoints = useSelector(getLoyaltyPoints);
  const getRewards = useSelector(getLoyaltyReward);
  const getTerms = useSelector(getLoyaltyTerms);
  const [currentPage, setCurrentPage] = useState('Title');
  const [menuItemColor, setMenuItemColor] = useState({
    title: true,
    points: false,
    reward: false,
    terms: false,
  });

  useEffect(() => {
    localStorage.setItem('loyaltyProgram', loyaltyProgram);
    pathname === '/new-loyalty-config/configuration/general-amount-spend/create' ||
    pathname === '/new-loyalty-config/configuration/general-amount-spend/edit'
      ? localStorage.setItem('loyaltyType', 'general_amount_spend')
      : pathname === '/new-loyalty-config/configuration/brands/create' ||
        pathname === '/new-loyalty-config/configuration/brands/edit'
      ? localStorage.setItem('loyaltyType', 'brands')
      : localStorage.setItem('loyaltyType', 'categories_or_sku');
  }, [pathname]);

  const navbarItems = useMemo(
    () => [
      {
        label: 'Title',
        icon: (
          <TitleOutlinedIcon className={menuItemColor.title ? 'bottom-navbar-text-selected' : 'bottom-navbar-text'} />
        ),
        render: () => {
          setCurrentPage('Title');
          setMenuItemColor({
            title: true,
            points: false,
            reward: false,
            terms: false,
          });
        },
        selected: menuItemColor.title,
      },
      {
        label: 'Points',
        icon: <PaidIcon className={menuItemColor.points ? 'bottom-navbar-text-selected' : 'bottom-navbar-text'} />,
        render: () => {
          setCurrentPage('Points');
          setMenuItemColor({
            title: false,
            points: true,
            reward: false,
            terms: false,
          });
        },
        selected: menuItemColor.points,
      },
      {
        label: 'Reward',
        icon: (
          <CardGiftcardIcon className={menuItemColor.reward ? 'bottom-navbar-text-selected' : 'bottom-navbar-text'} />
        ),
        render: () => {
          setCurrentPage('Reward');
          setMenuItemColor({
            title: false,
            points: false,
            reward: true,
            terms: false,
          });
        },
        selected: menuItemColor.reward,
      },
      {
        label: 'Terms',
        icon: (
          <SettingsOutlinedIcon
            className={menuItemColor.terms ? 'bottom-navbar-text-selected' : 'bottom-navbar-text'}
          />
        ),
        render: () => {
          setCurrentPage('Terms');
          setMenuItemColor({
            title: false,
            points: false,
            reward: false,
            terms: true,
          });
        },
        selected: menuItemColor.terms,
      },
    ],
    [menuItemColor],
  );

  const renderMenuComponent = (currentPage) => {
    switch (currentPage) {
      case 'Title':
        return <LoyaltyTitle />;
      case 'Reward':
        return <LoyaltyReward />;
      case 'Points':
        return <LoyaltyPoints />;
      case 'Terms':
        return <LoyaltyTerms />;
      default:
        return 'component not found';
    }
  };

  const termsAndConditions = useMemo(
    () => [
      {
        label: `Loyalty can only be earned or rewarded ${getTerms.num_trans_per_day} times in a day`,
        value: getTerms.num_trans_per_day,
      },
      {
        label: `Minimum purchase or cart value of ₹${getTerms?.minPurchaseReq} required for redemption`,
        value: `₹${getTerms?.minPurchaseReq}`,
      },
      {
        label: `Maximum of ${getTerms?.max_reward_per_transaction} points will be rewarded per transaction.`,
        value: getTerms?.max_reward_per_transaction,
      },
      {
        label: `Loyalty points ${getTerms?.clubbed ? 'cannot' : 'can'} be redeemed with other coupons/ discounts.`,
        value: getTerms?.clubbed,
      },
      {
        label: `Otp validation is ${getTerms?.otp_validation ? null : 'not'} required for loyalty redemption`,
        value: getTerms?.otp_validation,
      },
      {
        label: `Customer blacklisting is ${getTerms?.blacklistEnabled ? 'enabled' : 'disabled'}`,
        value: getTerms?.blacklistEnabled,
      },
    ],
    [getTerms],
  );

  const validateBeforeNavigating = () => {
    const rewardsCheck = isAnyKeyEmpty(getRewards?.generalAmountSpend);
    const titleCheck = isAnyKeyEmpty(loyaltyTitle);
    const pointsCheck = isAnyKeyEmpty(getPoints);

    titleCheck
      ? showSnackbar('Please fill all the title fields', 'error')
      : pointsCheck
      ? showSnackbar('Please fill all the points fields', 'error')
      : rewardsCheck
      ? showSnackbar('Please fill all the rewards fields', 'error')
      : navigate('/new-loyalty-config/bonus-points');
  };

  function isAnyKeyEmpty(obj) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key) && (obj[key] === '' || obj[key] === null || obj[key] === undefined)) {
        return true;
      }
    }
    return false;
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox className="loyalty-config-next-btn-box">
        <SoftTypography variant="h4" fontSize="1.4375rem" fontWeight="bold" marginBottom="25px">
          Loyalty Configuration
        </SoftTypography>
        <Button className="loyalty-config-next-btn" onClick={() => validateBeforeNavigating()}>
          Next
        </Button>
      </SoftBox>
      <SoftBox className="loyalty-main-card">
        <Card className="loyalty-config-card">
          <div className="loyalty-card-image-box">
            <img
              className="loyalty-config-card-image"
              src="https://reelo-assets.s3.ap-south-1.amazonaws.com/static/loyalty/retail/grocery_convenience_thumbs/Grocery+1+default.jpg"
              alt="err"
            />
            <Avatar className="loyalty-config-avatar">{loyaltyTitle?.header?.[0]?.toUpperCase()}</Avatar>
          </div>
          <SoftBox p={2} className="preview-container-box">
            <SoftTypography variant="h4" fontSize="1.4375rem" fontWeight="bold">
              {loyaltyTitle?.header}
            </SoftTypography>
            <SoftTypography variant="h4" fontSize="1rem" fontWeight="bold">
              {loyaltyTitle?.subheader}
            </SoftTypography>
            <SoftTypography variant="h4" fontSize="1rem" fontWeight="bold">
              {getPoints?.amountSpend} Spent = {getPoints?.pointsGiven} {getPoints?.pointsBrand}
            </SoftTypography>
            <SoftTypography variant="h4" fontSize="1rem" fontWeight="bold">
              1 {getPoints?.pointsBrand} = ₹{getPoints?.pointsValue}
            </SoftTypography>
            {getPoints.validity ? (
              <SoftTypography className="valid-till-box" variant="h4" fontSize="1rem" fontWeight="bold">
                valid till {getPoints?.validity}
              </SoftTypography>
            ) : null}

            <SoftBox className="preview-cookies-box">
              <SoftBox flex={1}>
                {getRewards?.generalAmountSpend?.rewardType == 'free_item' && (
                  <SoftTypography variant="h4" fontSize="1rem" fontWeight="bold">
                    Get a free {getRewards?.generalAmountSpend?.freeItem}
                  </SoftTypography>
                )}
                {getRewards?.generalAmountSpend?.rewardType == 'percentage_dis' && (
                  <SoftTypography variant="h4" fontSize="1rem" fontWeight="bold">
                    {getRewards?.generalAmountSpend?.percentageDis}% off on entire purchase upto ₹
                    {getRewards?.generalAmountSpend?.maxAmountPercent}
                  </SoftTypography>
                )}
                {getTerms?.minPurchaseReq?.length > 0 ? (
                  <SoftTypography variant="h4" fontSize="0.7rem" marginTop="10px" fontWeight="bold">
                    *Minimum purchase of ₹{getTerms?.minPurchaseReq} required to redeem reward.
                  </SoftTypography>
                ) : null}
              </SoftBox>
              <SoftTypography variant="h4" fontSize="1rem" fontWeight="bold" flex={1}>
                {getRewards.minReqPoints} {getPoints?.pointsBrand} required to redeem
              </SoftTypography>
            </SoftBox>
            <hr style={{ borderStyle: 'dashed', color: 'rgba(213, 220, 227, 0.804)' }} />
            <SoftBox className="preview-terms-box">
              <SoftTypography
                variant="h4"
                sx={{ fontWeight: 'bold', fontSize: '0.7rem', color: '#344767', marginBottom: '10px' }}
              >
                Terms & Conditions
              </SoftTypography>
              {termsAndConditions.map((e, i) => (
                <>
                  {(e?.value?.length > 0 && e.value != '₹') || e.value == true || e.value == false ? (
                    <SoftTypography variant="h4" fontSize=".7rem">
                      *{e.label}
                    </SoftTypography>
                  ) : null}
                </>
              ))}
            </SoftBox>
          </SoftBox>
        </Card>

        <SoftBox className="icon-main-div">
          <SoftBox mb={8}>{renderMenuComponent(currentPage)}</SoftBox>
          <SoftBox className="bottom-navbar">
            {navbarItems.map((item, i) => (
              <SoftBox key={i} onClick={item?.render} className="bottom-navbar-box">
                {item?.icon}
                <div className={item?.selected ? 'bottom-navbar-text-selected' : 'bottom-navbar-text'}>
                  {item?.label}
                </div>
              </SoftBox>
            ))}
          </SoftBox>
        </SoftBox>
      </SoftBox>
    </DashboardLayout>
  );
};
