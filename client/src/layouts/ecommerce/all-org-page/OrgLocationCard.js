import './OrgLocationCard.css';
import { Card, CardActions, CardContent, Chip, CircularProgress, Stack, Typography } from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import NolocationImage from '../../../assets/images/no-location-image.jpg';
import React, { memo } from 'react';
import SoftBox from '../../../components/SoftBox';
import SoftButton from '../../../components/SoftButton';

const OrgLocationCard = memo(
  ({
    retail,
    onBilling,
    loadingState,
    LocationImage,
    handleLocation,
    hiddenBranches,
    isMobileDevice,
    contextIds,
    toggleBranches,
    isNavigating,
  }) => {
    return (
      <SoftBox
        key={retail?.retailId}
        sx={{
          padding: !isMobileDevice ? '2.5rem 5rem 2rem 5rem !important' : '0rem !important',
          width: 'auto !important',
        }}
      >
        <SoftBox
          className="location-main-div mobile-padding-location-div "
          onClick={() => toggleBranches(retail?.retailId)}
        >
          <div className="org-motion-div">
            <Card className="upper-card-main-div location-card-box-shadow">
              <SoftBox className="upper-card-flex-wrapper">
                <img className="uppercard-img" src={retail?.logoUrl !== null ? retail?.logoUrl : NolocationImage} />

                <SoftBox className="org-info-main-div">
                  <Typography
                    variant="h6"
                    sx={{
                      color: '#2c292e',
                      fontWeight: '600',
                      fontSize: !isMobileDevice ? '1rem' : '0.9rem',
                      textAlign: !isMobileDevice ? 'center' : 'start',
                    }}
                  >
                    {retail?.displayName}
                  </Typography>
                  {isMobileDevice && (
                    <Stack direction="row" alignItems="center" justifyContent="flex-start" gap="10px" mt={1} mb={1}>
                      <Chip
                        icon={<LocationOnIcon sx={{ color: '#0562fb', width: '0.8em !important' }} />}
                        label={retail?.branches.length}
                        size="small"
                        px={0.8}
                      />
                      <Chip
                        icon={<AccountBalanceIcon sx={{ width: '0.8em !important' }} />}
                        label="Retail"
                        size="small"
                        px={0.8}
                      />
                      <Chip label={retail?.subscriptionTier || 'Free'} size="small" color="warning" px={0.8} />
                    </Stack>
                  )}
                </SoftBox>
              </SoftBox>
              {!isMobileDevice && (
                <Stack direction="row" alignItems="center" justifyContent="space-between" mt={1} mb={1}>
                  <Stack alignItems="flex-start">
                    <Typography fontSize="12px">Org Type</Typography>
                    <Typography fontSize="14px" fontWeight="bold">
                      Retail
                    </Typography>
                  </Stack>
                  <Stack alignItems="center">
                    <Typography sx={{ color: '#0562fb' }} fontSize="16px">
                      <LocationOnIcon />
                    </Typography>
                    <Typography fontSize="14px" fontWeight="bold">
                      {retail?.branches.length}
                    </Typography>
                  </Stack>
                  <Stack alignItems="flex-end">
                    <Typography fontSize="12px">Subcription</Typography>
                    <Typography className="loc-card-subscription-text">
                      {retail?.subscriptionTier?.includes('ENTERPRISE')
                        ? 'ENTERPRISE'
                        : retail?.subscriptionTier || 'Free'}{' '}
                    </Typography>
                  </Stack>
                </Stack>
              )}
              <SoftBox className="mobile-org-card-btn-div">
                <SoftButton onClick={onBilling} className="dashboard-billing-card-btn">
                  <Typography fontSize="12px">Billing Information</Typography>
                </SoftButton>
                {isMobileDevice && (
                  <SoftButton
                    onClick={() => toggleBranches(retail?.retailId)}
                    variant="info"
                    className="dashboard-card-btn contained-softbutton"
                  >
                    {hiddenBranches.includes(retail?.retailId) ? 'Show Locations' : 'Hide Locations'}
                  </SoftButton>
                )}
              </SoftBox>
            </Card>
          </div>
          {!isMobileDevice && (
            <SoftButton
              onClick={() => toggleBranches(retail?.retailId)}
              variant="info"
              className="dashboard-card-btn contained-softbutton"
            >
              {hiddenBranches.includes(retail?.retailId) ? 'Show Locations' : 'Hide Locations'}
            </SoftButton>
          )}
        </SoftBox>
        {!hiddenBranches.includes(retail?.retailId) && (
          <SoftBox className="location-card-main-div">
            {retail?.branches?.map(
              (branch, i) =>
                contextIds.has(branch?.branchId) && (
                  <SoftBox
                    key={branch?.branchId}
                    className="loc-card-div-one"
                    sx={{
                      // margin: isMobileDevice ? '0px auto' : 'unset',
                      paddingBottom: isMobileDevice ? '20px !important' : 'unset',
                      minWidth: !isMobileDevice && '320px !important',
                      padding: !isMobileDevice ? '0px 20px 20px 0px' : '0px',
                      position: 'relative',
                      display: isMobileDevice && 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Card
                      className="loc-card location-card-box-shadow"
                      onClick={
                        !isNavigating &&
                        (() =>
                          handleLocation(
                            branch?.branchId,
                            retail?.retailId,
                            'RETAIL',
                            'PALLET_RETAIL',
                            retail?.displayName,
                            branch?.displayName,
                            retail?.retailType,
                          ))
                      }
                    >
                      <img
                        src={LocationImage}
                        alt=""
                        height={`${isMobileDevice ? '120px' : '200'}`}
                        style={{
                          borderRadius: '10px',
                        }}
                      />
                      <CardActions className="location-card-action">
                        <SoftButton variant="contained" className="location-card-status">
                          Active
                        </SoftButton>
                        {loadingState[branch?.branchId] ? (
                          <CircularProgress
                            sx={{ height: '20px !important', width: '20px !important', color: '#0562fb !important' }}
                          />
                        ) : null}
                      </CardActions>
                      <CardContent sx={{ padding: '0px !important' }}>
                        <Typography
                          variant="h6"
                          component="div"
                          style={{
                            color: '#3c4043',
                            fontWeight: '600',
                            fontSize: isMobileDevice ? '0.9rem' : '1rem',
                            // paddingTop: '5px',
                          }}
                        >
                          {branch?.displayName}
                        </Typography>
                      </CardContent>
                      <Typography
                        variant="body2"
                        style={{
                          color: '#5f6368',
                          fontSize: isMobileDevice ? '0.7rem' : '0.8rem',
                          marginRight: 'auto',
                          // paddingLeft: '10px',
                          // marginLeft: '15px',
                        }}
                      >
                        Created by {retail?.displayName}
                      </Typography>
                    </Card>
                  </SoftBox>
                ),
            )}
          </SoftBox>
        )}
      </SoftBox>
    );
  },
);

export default OrgLocationCard;
