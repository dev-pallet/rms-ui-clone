import { Card, Grid, Icon } from '@mui/material';
import React, { useState } from 'react';
import SoftBox from '../../../components/SoftBox';
import { isSmallScreen } from '../../ecommerce/Common/CommonFunction';
import SoftTypography from '../../../components/SoftTypography';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';

const CartMetrics = ({ bgColor, title, count = 0, percentage, icon, direction, random, random1, random2, random3 }) => {
  const isMobileDevice = isSmallScreen();

  const [isHovered, setIsHovered] = useState(false);

  const locId = localStorage.getItem('locId');
  const orgId = localStorage.getItem('orgId');
  const handleHover = () => {
    setIsHovered(!isHovered);
  };

  const LightTooltip = styled(({ className, ...props }) => <Tooltip {...props} classes={{ popper: className }} />)(
    ({ theme }) => ({
      [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: theme.palette.common.white,
        color: 'rgba(0, 0, 0, 0.87)',
        boxShadow: theme.shadows[1],
        fontSize: 11,
      },
    }),
  );

  return (
    <div>
      <Card className={`${isMobileDevice ? 'po-box-shadow' : 'card-box-shadow'}`}>
        <SoftBox bgColor={bgColor} variant="gradient" sx={{ borderRadius: '10px !important' }}>
          <SoftBox p={2}>
            <Grid container alignItems="center">
              {direction === 'left' ? (
                <Grid item>
                  <SoftBox
                    variant="gradient"
                    bgColor={bgColor === 'white' ? icon.color : 'white'}
                    color={bgColor === 'white' ? 'white' : 'dark'}
                    width="3rem"
                    height="3rem"
                    borderRadius="md"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    shadow="md"
                  >
                    <Icon fontSize="small" color="inherit">
                      {icon.component}
                    </Icon>
                  </SoftBox>
                </Grid>
              ) : null}

              <Grid item xs={8}>
                <SoftBox ml={direction === 'left' ? 2 : 0} lineHeight={1}>
                  <SoftTypography
                    variant="button"
                    color={bgColor === 'white' ? 'text' : 'white'}
                    opacity={bgColor === 'white' ? 1 : 0.7}
                    textTransform="capitalize"
                    fontWeight={title.fontWeight}
                  >
                    {title.text}
                  </SoftTypography>
                </SoftBox>
              </Grid>

              {direction === 'right' && icon ? (
                <Grid item xs={4}>
                  <SoftBox
                    variant="gradient"
                    style={{ background: '#0562FB' }}
                    // bgColor={bgColor === 'white' ? icon.color : 'white'}
                    color={bgColor === 'white' ? 'white' : 'dark'}
                    width="45px"
                    height="45px"
                    marginLeft="auto"
                    borderRadius="md"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    shadow="md"
                  >
                    <Icon fontSize="25px" color="inherit">
                      {icon.component}
                    </Icon>
                  </SoftBox>
                </Grid>
              ) : null}

              {random ? (
                <Grid item>
                  <Grid container spacing={4}>
                    <Grid item>
                      <SoftBox style={{ width: '250px !important' }}>
                        <SoftTypography
                          variant="button"
                          color="#979899"
                          opacity={bgColor === 'white' ? 1 : 0.7}
                          textTransform="capitalize"
                          fontWeight={title.fontWeight}
                        >
                          {random.title}
                        </SoftTypography>
                        {isHovered ? (
                          <LightTooltip title={random.value} style={{ cursor: 'pointer' }}>
                            <SoftTypography
                              variant="h5"
                              fontWeight="bold"
                              color={bgColor === 'white' ? 'dark' : 'white'}
                              overflow="hidden"
                              whiteSpace="nowrap"
                              textOverflow="ellipsis"
                              onMouseEnter={handleHover}
                              onMouseLeave={handleHover}
                            >
                              {random.value}{' '}
                            </SoftTypography>
                          </LightTooltip>
                        ) : (
                          <SoftTypography
                            variant="h5"
                            fontWeight="bold"
                            color={bgColor === 'white' ? 'dark' : 'white'}
                            overflow="hidden"
                            whiteSpace="nowrap"
                            textOverflow="ellipsis"
                            cursor="pointer"
                            onMouseEnter={handleHover}
                            onMouseLeave={handleHover}
                          >
                            {random.value}{' '}
                          </SoftTypography>
                        )}
                      </SoftBox>
                      <SoftBox style={{ width: '250px !important', marginTop: '5px' }}>
                        <SoftTypography
                          variant="button"
                          color="#979899"
                          opacity={bgColor === 'white' ? 1 : 0.7}
                          textTransform="capitalize"
                          fontWeight={title.fontWeight}
                        >
                          {random1.title}
                        </SoftTypography>
                        {isHovered ? (
                          <LightTooltip title={random1.value} style={{ cursor: 'pointer' }}>
                            <SoftTypography
                              variant="h5"
                              fontWeight="bold"
                              color={bgColor === 'white' ? 'dark' : 'white'}
                              overflow="hidden"
                              whiteSpace="nowrap"
                              textOverflow="ellipsis"
                              onMouseEnter={handleHover}
                              onMouseLeave={handleHover}
                            >
                              {random1.value}{' '}
                            </SoftTypography>
                          </LightTooltip>
                        ) : (
                          <SoftTypography
                            variant="h5"
                            fontWeight="bold"
                            color={bgColor === 'white' ? 'dark' : 'white'}
                            overflow="hidden"
                            whiteSpace="nowrap"
                            textOverflow="ellipsis"
                            cursor="pointer"
                            onMouseEnter={handleHover}
                            onMouseLeave={handleHover}
                          >
                            {random1.value}{' '}
                          </SoftTypography>
                        )}
                      </SoftBox>
                    </Grid>
                    <Grid item>
                      {random2 && (
                        <SoftBox style={{ width: '250px !important' }}>
                          <SoftTypography
                            variant="button"
                            color="#979899"
                            opacity={bgColor === 'white' ? 1 : 0.7}
                            textTransform="capitalize"
                            fontWeight={title.fontWeight}
                          >
                            {random2.title}
                          </SoftTypography>
                          {isHovered ? (
                            <LightTooltip title={random2.value} style={{ cursor: 'pointer' }}>
                              <SoftTypography
                                variant="h5"
                                fontWeight="bold"
                                color={bgColor === 'white' ? 'dark' : 'white'}
                                overflow="hidden"
                                whiteSpace="nowrap"
                                textOverflow="ellipsis"
                                onMouseEnter={handleHover}
                                onMouseLeave={handleHover}
                              >
                                {random2.value}{' '}
                              </SoftTypography>
                            </LightTooltip>
                          ) : (
                            <SoftTypography
                              variant="h5"
                              fontWeight="bold"
                              color={bgColor === 'white' ? 'dark' : 'white'}
                              overflow="hidden"
                              whiteSpace="nowrap"
                              textOverflow="ellipsis"
                              cursor="pointer"
                              onMouseEnter={handleHover}
                              onMouseLeave={handleHover}
                            >
                              {random2.value}{' '}
                            </SoftTypography>
                          )}
                        </SoftBox>
                      )}
                      {random3 && (
                        <SoftBox style={{ width: '250px !important', marginTop: '5px' }}>
                          <SoftTypography
                            variant="button"
                            color="#979899"
                            opacity={bgColor === 'white' ? 1 : 0.7}
                            textTransform="capitalize"
                            fontWeight={title.fontWeight}
                          >
                            {random3.title}
                          </SoftTypography>
                          {isHovered ? (
                            <LightTooltip title={random3.value} style={{ cursor: 'pointer' }}>
                              <SoftTypography
                                variant="h5"
                                fontWeight="bold"
                                color={bgColor === 'white' ? 'dark' : 'white'}
                                overflow="hidden"
                                whiteSpace="nowrap"
                                textOverflow="ellipsis"
                                // onMouseEnter={handleHover}
                                // onMouseLeave={handleHover}
                              >
                                {random3.value}{' '}{random3.percent && <span style={{fontSize: "14px"}}>({random3.percent})</span>}
                              </SoftTypography>
                            </LightTooltip>
                          ) : (
                            <SoftTypography
                              variant="h5"
                              fontWeight="bold"
                              color={bgColor === 'white' ? 'dark' : 'white'}
                              overflow="hidden"
                              whiteSpace="nowrap"
                              textOverflow="ellipsis"
                              cursor="pointer"
                              // onMouseEnter={handleHover}
                              // onMouseLeave={handleHover}
                            >
                              {random3.value}{' '}{random3.percent && <span style={{fontSize: "14px"}}>({random3.percent})</span>}
                            </SoftTypography>
                          )}
                        </SoftBox>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              ) : null}
            </Grid>
          </SoftBox>
        </SoftBox>
      </Card>
    </div>
  );
};

CartMetrics.defaultProps = {
  bgColor: 'white',
  title: {
    fontWeight: 'medium',
    text: '',
  },
  percentage: {
    color: 'success',
    text: '',
  },
  direction: 'right',
};

// Typechecking props for the CartMetrics
CartMetrics.propTypes = {
  bgColor: PropTypes.oneOf(['white', 'primary', 'secondary', 'info', 'success', 'warning', 'error', 'dark']),
  title: PropTypes.PropTypes.shape({
    fontWeight: PropTypes.oneOf(['light', 'regular', 'medium', 'bold']),
    text: PropTypes.string,
  }),
  count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  percentage: PropTypes.shape({
    color: PropTypes.oneOf(['primary', 'secondary', 'info', 'success', 'warning', 'error', 'dark', 'white']),
    text: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  icon: PropTypes.shape({
    color: PropTypes.oneOf(['primary', 'secondary', 'info', 'success', 'warning', 'error', 'dark']),
    component: PropTypes.node.isRequired,
  }).isRequired,
  direction: PropTypes.oneOf(['right', 'left']),
};

export default CartMetrics;
