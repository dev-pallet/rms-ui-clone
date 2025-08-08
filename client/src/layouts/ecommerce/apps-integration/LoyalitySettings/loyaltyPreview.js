//soft ui components
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import SoftBox from '../../../../components/SoftBox';
import SoftTypography from '../../../../components/SoftTypography';

//mui components
import { Avatar, Button, Card } from '@mui/material';

//icons
import ForwardToInboxRoundedIcon from '@mui/icons-material/ForwardToInboxRounded';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';

//styles
import './loyalitypoints.css';

//react
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

//custom components
import { useSnackbar } from '../../../../hooks/SnackbarProvider';
import AlertDialogSlide from './alertDialogSlide';

//redux
import {
  getLoyaltyPoints,
  getLoyaltyReward,
  getLoyaltyTerms,
  getLoyaltyTitle,
} from '../../../../datamanagement/loyaltyProgramSlice';
import { useSelector } from 'react-redux';

//api
import { createLoyaltyPoints, editLoyaltyProgram } from '../../../../config/Services';

export const LoyaltyReview = () => {
  const navigate = useNavigate();
  const showSnackBar = useSnackbar();
  const [loader, setLoader] = useState(false);
  const loyaltyTitle = useSelector(getLoyaltyTitle);
  const getPoints = useSelector(getLoyaltyPoints);
  const getRewards = useSelector(getLoyaltyReward);
  const getTerms = useSelector(getLoyaltyTerms);
  const [currentPage, setCurrentPage] = useState('Title');
  const [open, setOpen] = useState(false);
  const [menuItemColor, setMenuItemColor] = useState({
    title: true,
    points: false,
    reward: false,
    terms: false,
  });
  const sourceType = localStorage.getItem('contextType');
  const loyaltyConfigId = localStorage.getItem('loyaltyConfigId');
  const sourceOrgId = localStorage.getItem('orgId');
  const sourceLocationId = localStorage.getItem('locId');
  const createdById = JSON.parse(localStorage.getItem('user_details')).uidx;
  const loyalty_type = localStorage.getItem('loyaltyType');
  const loyaltyProgram = localStorage.getItem('loyaltyProgram');

  const termsAndConditions = useMemo(
    () => [
      {
        label: `Loyalty can only be earned or rewarded ${getTerms?.num_trans_per_day} times in a day`,
        value: getTerms?.num_trans_per_day,
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

  const handleUpdateProgram = () => {
    setOpen(true);
  };

  const comfirmUpdate = () => {
    setLoader(true);

    const editPayload = {
      userId: createdById,
      sourceId: sourceOrgId,
      configId: loyaltyConfigId,
      expiryDetail: getPoints?.date,
    };

    const createPayload = {
      sourceOrgId,
      sourceLocationId,
      expiryAfter: getPoints?.date,
      createdById,
      manufacturerList: [],
      productCategoryList: [],
    };

    const requestBody = {
      sourceType: sourceType,
      rewardMinPurchasePrice: parseInt(getTerms?.minPurchaseReq) || null,
      rewardUptoPoint: parseInt(getRewards?.minReqPoints),
      rewardRatePoint: parseInt(getPoints?.pointsGiven),
      rewardRateAmount: parseInt(getPoints?.amountSpend),
      rewardRatePointValue: parseFloat(getPoints?.pointsValue),
      maxRewardEarningsPerDay: parseInt(getTerms?.max_reward_per_transaction) || null,
      expiryAfter: getPoints.date,
      redeemThresholdAmount: parseInt(getTerms?.minPurchaseReq) || null,
      redeemAmountUpto: parseInt(getRewards?.generalAmountSpend.maxAmountPercent),
      redeemPercentage: parseFloat(getRewards?.generalAmountSpend.percentageDis),
      redeemableIfCouponApplied: getTerms?.clubbed || false,
      createdById,
      manufacturerList: [],
      productCategoryList: [],
      header: loyaltyTitle?.header,
      subTitle: loyaltyTitle?.subheader,
      platformSupportTypeList: [String(getRewards?.customer_type)],
      otpValidation: getTerms?.otp_validation || false,
      customerType: getRewards?.customer_type,
      blackListing: getTerms?.blacklistEnabled || false,
      blackListingOrderThresholdPerDay: parseInt(getTerms?.blackListingOrderThresholdPerDay) || null,
      blackListingOrderThresholdPerMonth: parseInt(getTerms?.blackListingOrderThresholdPerMonth) || null,
      blackListingOrderValueThresholdPerDay: parseInt(getTerms?.blackListingOrderValueThresholdPerDay) || null,
      blackListingOrderValueThresholdPerMonth: parseInt(getTerms?.blackListingOrderValueThresholdPerMonth) || null,
    };

    {
      loyaltyProgram === 'edit'
        ? editLoyaltyProgram({ ...requestBody, ...editPayload })
            .then((response) => {
              setLoader(false);
              navigate('/marketing/loyaltysettings');
            })
            .catch((error) => {
              setLoader(false);
              showSnackBar(error.response.data.message || error.message, 'error');
            })
        : createLoyaltyPoints({ ...requestBody, ...createPayload })
            .then((response) => {
              setLoader(false);
              navigate('/marketing/loyaltysettings');
            })
            .catch((error) => {
              setLoader(false);
              showSnackBar(error.response.data.message || error.message, 'error');
            });
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox className="loyalty-config-next-btn-box">
        <SoftTypography variant="h4" fontSize="23px" fontWeight="bold" marginBottom="25px ">
          Loyalty Configuration
        </SoftTypography>
        <Button className="loyalty-config-next-btn" onClick={() => handleUpdateProgram()}>
          {loyaltyProgram === 'edit' ? 'Update' : 'Create'}
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
            {getPoints?.validity ? (
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
                {getRewards.generalAmountSpend.rewardType == 'percentage_dis' && (
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
                {getRewards?.minReqPoints} {getPoints?.pointsBrand} required to redeem
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
        <SoftBox className="loyalty-preview-box">
          <SoftTypography variant="h4" fontSize="1.4375rem" fontWeight="bold">
            Review Loyalty Program
          </SoftTypography>
          <SoftBox mt={2} p={2}>
            <SoftBox className="loyalty-review-box">
              <CardGiftcardIcon color="info" className="icon-margin" />
              <SoftTypography variant="h4" fontSize="1rem" fontWeight="bold" className="text-underline-dec">
                Reward
              </SoftTypography>
            </SoftBox>
            <SoftTypography variant="h4" fontSize="1rem" fontWeight="bold">
              {loyalty_type == 'general_amount_spend'
                ? 'General Amount Spent'
                : loyalty_type == 'brands'
                ? 'Brands'
                : "Categories & SKU's"}
            </SoftTypography>
          </SoftBox>
          <SoftBox className="loyalty-review-cont" mt={2} p={2}>
            <SoftBox>
              <SoftBox className="loyalty-review-box">
                <AutoAwesomeOutlinedIcon color="warning" className="icon-margin" />
                <SoftTypography variant="h4" fontSize="1rem" fontWeight="bold" className="text-underline-dec">
                  Points Branding
                </SoftTypography>
              </SoftBox>
              <SoftTypography variant="h4" fontSize="1rem" fontWeight="bold">
                {getPoints?.pointsBrand}
              </SoftTypography>
            </SoftBox>
            <BorderColorOutlinedIcon
              color="success"
              onClick={() => navigate(`/new-loyalty-config/configuration/general-amount-spend/${loyaltyProgram}`)}
            />
          </SoftBox>

          <SoftBox className="loyalty-review-cont" mt={2} p={2}>
            <SoftBox>
              <SoftBox className="loyalty-review-box">
                <NotificationsActiveOutlinedIcon color="success" className="icon-margin" />
                <SoftTypography variant="h4" fontSize="1rem" fontWeight="bold" className="text-underline-dec">
                  Points Expiry
                </SoftTypography>
              </SoftBox>
              <SoftTypography variant="h4" fontSize="1rem" fontWeight="bold">
                {getPoints?.validity}
              </SoftTypography>
            </SoftBox>
            <BorderColorOutlinedIcon color="success" onClick={() => navigate('/new-loyalty-config/reminder')} />
          </SoftBox>
          <SoftBox className="loyalty-review-cont" mt={2} p={2}>
            <SoftBox>
              <SoftBox className="loyalty-review-box">
                <ForwardToInboxRoundedIcon color="info" className="icon-margin" />
                <SoftTypography variant="h4" fontSize="1rem" fontWeight="bold" className="text-underline-dec">
                  Communication Channels
                </SoftTypography>
              </SoftBox>
              <li style={{ fontSize: '1rem', fontWeight: 'bold' }}>Whatsapp Utility</li>
              <li style={{ fontSize: '1rem', fontWeight: 'bold' }}>Email</li>
            </SoftBox>
            <BorderColorOutlinedIcon color="success" onClick={() => navigate('/new-loyalty-config/channels')} />
          </SoftBox>

          <SoftBox className="loyalty-review-cont" mt={2} p={2}>
            <SoftBox>
              <SoftBox className="loyalty-review-box">
                <NotificationsActiveOutlinedIcon color="error" className="icon-margin" />
                <SoftTypography variant="h4" fontSize="1rem" fontWeight="bold" className="text-underline-dec">
                  Multiple Bill Alert
                </SoftTypography>
              </SoftBox>
              <SoftTypography variant="h4" fontSize="1rem" fontWeight="bold">
                ON
              </SoftTypography>
            </SoftBox>
            <BorderColorOutlinedIcon
              color="success"
              onClick={() => navigate('/new-loyalty-config/mutiple-order-alert')}
            />
          </SoftBox>
          <SoftBox mt={2} p={2}>
            <SoftBox className="loyalty-review-box">
              <SoftTypography variant="h4" fontSize="1rem" fontWeight="bold" className="text-underline-dec">
                Alert on Generating
              </SoftTypography>
            </SoftBox>
            <SoftTypography variant="h4" fontSize="1rem" fontWeight="bold">
              2 Orders in 1 Day
            </SoftTypography>
          </SoftBox>
        </SoftBox>
      </SoftBox>
      <AlertDialogSlide open={open} handleClose={() => setOpen(false)} handleUpdate={comfirmUpdate} loader={loader} />
    </DashboardLayout>
  );
};
