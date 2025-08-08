import CircleIcon from '@mui/icons-material/Circle';
import { Box, Card, Grid, InputLabel } from '@mui/material';
import SoftButton from '../../../../../../../components/SoftButton';
import SoftTypography from '../../../../../../../components/SoftTypography';
import './index.css';
import flag from './flag.svg';
import { displayNameFirstLetter, isSmallScreen } from '../../../../../Common/CommonFunction';
import { useEffect, useRef, useState } from 'react';

const CustomerDetailsHeader = ({
  logo,
  displayName,
  mobileNumber,
  locations = [],
  channels = [],
  customer,
  customerType,
  outStandingPayables,
  dueDays,
  onSendReminder,
  pendingDebitNote,
  unusedCredit,
}) => {
  const isMobileDevice = isSmallScreen();
  const [showAll, setShowAll] = useState(false);
  const containerRef = useRef(null);

  const handleToggleView = () => {
    setShowAll(!showAll);
  };

  const handleClickOutside = (event) => {
    if (containerRef.current && !containerRef.current.contains(event.target)) {
      setShowAll(false);
    }
  };

  useEffect(() => {
    if (showAll) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showAll]);

  const displayedLocations = showAll ? locations : locations?.slice(0, 3);

  return (
    <>
      {isMobileDevice ? (
        <>
          <div className="logo-name-container">
            <div className="logo-container">
              {customer === 'B2B' ? (
                logo
              ) : (
                <div className="vendorImage-style">
                  <span>{displayNameFirstLetter(displayName)}</span>
                </div>
              )}
            </div>
            <div className="flex-colum-align-start width-100">
              <div className="purchase-id-title text-align-left">{displayName || 'N/A'}</div>
              <div className="bill-card-value"></div>
            </div>
          </div>
          <div>
            <div className="content-left">
              <InputLabel sx={{ fontSize: '0.75rem', color: '#344767' }}>Locations</InputLabel>
              <div ref={containerRef}>
                {locations?.length > 0 ? (
                  <>
                    {displayedLocations?.map((location, index) => (
                      <button key={index} className="vendorLocationbtn padding-btn">
                        {location?.city || 'N/A'}
                      </button>
                    ))}
                    {locations?.length > 3 && !showAll && (
                      <button className="vendorLocationbtn padding-btn" onClick={handleToggleView}>
                        +{locations?.length - 3} more
                      </button>
                    )}
                    {showAll && (
                      <div className="scrollable-container">
                        {locations?.map((location, index) => (
                          <button key={index} className="vendorLocationbtn padding-btn">
                            {location?.city || 'N/A'}
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <button className="vendorLocationbtn padding-btn">N/A</button>
                )}
              </div>
            </div>
            <div className="content-left">
              <InputLabel sx={{ fontSize: '0.75rem', color: '#344767' }}>Channels</InputLabel>
              {channels?.length > 0 ? (
                channels?.map((channel, index) => (
                  <button key={index} className="vendorLocationbtn padding-btn">
                    {channel}
                  </button>
                ))
              ) : (
                <button className="vendorLocationbtn padding-btn">N/A</button>
              )}
            </div>
            <div style={{margin: '10px 0px'}}>
              <InputLabel sx={{ fontSize: '0.75rem', color: '#344767' }}>
                Outstanding payables: ₹ {outStandingPayables}
              </InputLabel>
            </div>
          </div>
        </>
      ) : (
        <Card className="vendorCardContainer" style={{ position: 'relative' }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={1.7}>
              {customer === 'B2B' ? (
                logo
              ) : (
                <div className="vendorImage-style">
                  <span className="vendorLogo-text">{displayNameFirstLetter(displayName)}</span>
                </div>
              )}
            </Grid>
            <Grid item xs={12} md={5.5}>
              <Box height="100%" mt={0.5} lineHeight={1}>
                <Box style={{ display: 'flex' }} mb={1}>
                  <SoftTypography variant="caption" fontWeight="bold" fontSize="16px">
                    {displayName || 'N/A'}
                  </SoftTypography>
                </Box>
                <InputLabel sx={{ fontSize: '0.75rem', color: '#344767' }}>Mobile Number</InputLabel>
                <Box className="content-left">
                  <img src={flag} width={'32px'} height={'32px'} />
                  <SoftTypography variant="button" color="text" fontWeight="medium" fontSize="13px">
                    {mobileNumber || 'N/A'}
                  </SoftTypography>
                </Box>

                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}
                >
                  <div className="content-left">
                    <InputLabel sx={{ fontSize: '0.75rem', color: '#344767' }}>Locations</InputLabel>
                    <div ref={containerRef}>
                      {locations?.length > 0 ? (
                        <>
                          {displayedLocations?.map((location, index) => (
                            <button key={index} className="vendorLocationbtn">
                              {location?.city || 'N/A'}
                            </button>
                          ))}
                          {locations?.length > 3 && !showAll && (
                            <button className="vendorLocationbtn" onClick={handleToggleView}>
                              +{locations?.length - 3} more
                            </button>
                          )}
                          {showAll && (
                            <div className="scrollable-container">
                              {locations?.map((location, index) => (
                                <button key={index} className="vendorLocationbtn">
                                  {location?.city || 'N/A'}
                                </button>
                              ))}
                            </div>
                          )}
                        </>
                      ) : (
                        <button className="vendorLocationbtn">N/A</button>
                      )}
                    </div>
                  </div>

                  {/* {customer !== 'B2B' && ( */}
                  <div className="content-left">
                    <InputLabel sx={{ fontSize: '0.75rem', color: '#344767' }}>Channels</InputLabel>
                    {channels?.length > 0 ? (
                      channels?.map((channel, index) => (
                        <button key={index} className="vendorLocationbtn">
                          {channel}
                        </button>
                      ))
                    ) : (
                      <button className="vendorLocationbtn">N/A</button>
                    )}
                  </div>
                  {/* )} */}

                  <div className="content-left">
                    <InputLabel sx={{ fontSize: '0.75rem', color: '#344767' }}>Type</InputLabel>
                    {customerType?.length > 0 ? (
                      customerType?.map((type, index) => (
                        <button key={index} className="vendorLocationbtn">
                          {type}
                        </button>
                      ))
                    ) : (
                      <button className="vendorLocationbtn">{'N/A'}</button>
                    )}
                  </div>
                </div>
              </Box>
            </Grid>
            <Grid item xs={12} md={4.8}>
              <div>
                <SoftTypography
                  className="vendorCardHeading"
                  style={{ color: '#505050', fontWeight: '600', fontSize: '15px' }}
                >
                  Outstanding payables
                </SoftTypography>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    marginBottom: '10px',
                    justifyContent: 'space-between',
                  }}
                >
                  <SoftTypography className="vendorCardValue">
                    ₹ {outStandingPayables}
                    <span style={{ fontSize: '0.73rem', marginLeft: '10px' }}>Due in {dueDays || 'N/A'} days</span>
                  </SoftTypography>
                  <SoftButton className="contained-softbutton" onClick={onSendReminder}>
                    Send Reminder
                  </SoftButton>
                </div>
                <div>
                  <SoftTypography style={{ fontSize: '0.73rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    {<CircleIcon sx={{ color: '#ff9500' }} />} {pendingDebitNote || 'N/A'} pending debit note
                  </SoftTypography>
                  <SoftTypography style={{ fontSize: '0.73rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    {<CircleIcon sx={{ color: '#4fb061' }} />} {unusedCredit || 'N/A'} un-used credit
                  </SoftTypography>
                </div>
              </div>
            </Grid>
          </Grid>
        </Card>
      )}
    </>
  );
};

export default CustomerDetailsHeader;
