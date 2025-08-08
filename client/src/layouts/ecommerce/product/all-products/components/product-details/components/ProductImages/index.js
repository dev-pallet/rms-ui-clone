/**
=========================================================
* Soft UI Dashboard PRO React - v4.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-pro-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useEffect, useState } from 'react';

// react-images-viewer components
import ImgsViewer from 'react-images-viewer';

// @mui material components
import Grid from '@mui/material/Grid';

// Soft UI Dashboard PRO React components
import SoftBox from 'components/SoftBox';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Chip, InputLabel } from '@mui/material';
import { isSmallScreen } from '../../../../../../Common/CommonFunction';
import ProgressBar from 'react-bootstrap/ProgressBar';
import PropTypes from 'prop-types';
import SoftTypography from '../../../../../../../../components/SoftTypography';
import moment from 'moment';
function ProductImages({ Imgs, price, pricingDetail }) {
  const [currentImage, setCurrentImage] = useState(null);

  const [imgsViewer, setImgsViewer] = useState(false);
  const [imgsViewerCurrent, setImgsViewerCurrent] = useState(0);
  const isMobileDevice = isSmallScreen();

  const images = [];

  for (const key in Imgs) {
    images.push(Imgs[key]);
  }

  const imagesArray = images.filter(Boolean).filter((e) => e !== 'string');

  const imageSet = imagesArray.map((src) => ({ src }));

  useEffect(() => {
    if (Imgs?.front && Imgs?.front !== 'string') {
      setCurrentImage(Imgs.front);
    } else if (Imgs?.top && Imgs?.top !== 'string') {
      setCurrentImage(Imgs.top);
    } else if (Imgs?.bottom && Imgs?.bottom !== 'string') {
      setCurrentImage(Imgs.bottom);
    } else if (Imgs?.back && Imgs?.back !== 'string') {
      setCurrentImage(Imgs.back);
    } else if (Imgs?.top_left && Imgs?.top_left !== 'string') {
      setCurrentImage(Imgs.top_left);
    } else if (Imgs?.right && Imgs?.right !== 'string') {
      setCurrentImage(Imgs.right);
    } else if (Imgs?.left && Imgs?.left !== 'string') {
      setCurrentImage(Imgs.left);
    } else if (Imgs?.top_right && Imgs?.top_right !== 'string') {
      setCurrentImage(Imgs.top_right);
    } else {
      setCurrentImage(null);
    }

    const images = [];

    for (const key in Imgs) {
      images.push(Imgs[key]);
    }
  }, [Imgs]);

  const handleSetCurrentImage = ({ currentTarget }) => {
    setCurrentImage(currentTarget.src);
    setImgsViewerCurrent(Number(currentTarget.id));
  };

  const openImgsViewer = () => setImgsViewer(true);
  const closeImgsViewer = () => setImgsViewer(false);
  const imgsViewerNext = () => setImgsViewerCurrent(imgsViewerCurrent + 1);
  const imgsViewerPrev = () => setImgsViewerCurrent(imgsViewerCurrent - 1);

  const changingChipStatus = (data) => {
    switch (data) {
      case 'A':
        return 'success';
      case 'B':
        return 'warning';
      case 'C':
        return 'error';
      default:
        return 'info';
    }
  };

  const getTagDescription = (type, result) => {
    if (type === 'INVENTORY') {
      switch (result) {
        case 'A':
          return 'Highest Consumption';
        case 'B':
          return 'Average Consumption';
        case 'C':
          return 'Lowest Consumption';
        case 'D':
          return 'Dead Stock';
        default:
          return '';
      }
    } else if (type === 'SALES') {
      switch (result) {
        case 'A':
          return 'Fast Movement';
        case 'B':
          return 'Average Movement';
        case 'C':
          return 'Low Movement';
        default:
          return '';
      }
    } else if (type === 'PROFIT') {
      switch (result) {
        case 'A':
          return 'Highest Value';
        case 'B':
          return 'Average Value';
        case 'C':
          return 'Lowest Value';
        default:
          return '';
      }
    }
  };

  const categoryColour = (data) => {
    switch (data) {
      case 'A':
        return 'success';
      case 'B':
        return 'warning';
      case 'C':
        return 'error';
      default:
        return 'info';
    }
  };

  const renderExpiryMessage = (expiryDateApi) => {
    if (!expiryDateApi) {
      return 'Date Unavailable';
    }

    const expiryDate = new Date(expiryDateApi);
    const relativeTime = moment(expiryDate).fromNow();

    if (relativeTime.includes('ago')) {
      return `Expired ${relativeTime}`;
    } else if (relativeTime.includes('in')) {
      return `Expiring ${relativeTime}`;
    } else {
      return 'Invalid expiry date';
    }
  };

  const renderExpiredColor = (expiryDateApi) => {
    if (!expiryDateApi) {
      return '';
    }

    const expiryDate = new Date(expiryDateApi);
    const relativeTime = moment(expiryDate).fromNow();

    if (relativeTime.includes('ago')) {
      return 'danger';
    } else if (relativeTime.includes('in')) {
      if (relativeTime.includes('month') || relativeTime.includes('year')) {
        return 'success';
      } else {
        return 'warning';
      }
    } else {
      return 'success';
    }
  };
  function getBatchHealth(createdDate, expiryDate) {
    const totalDuration = new Date(expiryDate)?.getTime() - new Date(createdDate)?.getTime();

    // Get the duration from creation to current date
    // const elapsedDuration = moment.duration(moment(expiryDate).diff(moment(new Date)));
    const elapsedDuration = new Date()?.getTime() - new Date(createdDate).getTime();
    const progressValue = elapsedDuration / totalDuration;
    // const progress=elapsedDuration
    // Calculate progress value
    // Ensure progress value is within 0 to 100 range
    if (progressValue * 100 >= 1) {
      return progressValue * 100;
    } else {
      return 100;
    }
  }

  return (
    <SoftBox style={{ position: 'sticky', top: '6rem' }}>
      {!imagesArray.length && (
        <>
          <img
            style={{ width: '100%' }}
            src="https://www.freeiconspng.com/thumbs/no-image-icon/no-image-icon-15.png"
            alt="no image available"
          />
        </>
      )}
      <ImgsViewer
        imgs={imageSet}
        // imgs={[{ src: Imgs?.front},{src: Imgs?.back },{src: Imgs?.top },{src: Imgs?.left },{src: Imgs?.right },{src: Imgs?.top_left },{src: Imgs?.top_right }]}
        isOpen={imgsViewer}
        onClose={closeImgsViewer}
        currImg={imgsViewerCurrent}
        onClickPrev={imgsViewerPrev}
        onClickNext={imgsViewerNext}
        backdropCloseable
      />

      {currentImage && (
        <SoftBox
          component="img"
          src={currentImage}
          alt=""
          shadow="lg"
          borderRadius="lg"
          onClick={openImgsViewer}
          width={isMobileDevice ? '100%' : '230px'}
          height={isMobileDevice ? '100%' : '230px'}
          sx={{
            objectFit: 'contain',
            display: isMobileDevice ? 'block' : 'inline-block',
          }}
        />
      )}

      <SoftBox mt={2} pt={1} style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {Imgs?.front && Imgs?.front !== 'string' ? (
          <SoftBox
            component="img"
            id={1}
            src={Imgs?.front}
            alt=""
            borderRadius="lg"
            shadow="md"
            sx={{ cursor: 'pointer', height: '100%', objectFit: 'cover' }}
            onClick={handleSetCurrentImage}
            width="70px"
            height="70px"
          />
        ) : null}

        {Imgs?.back && Imgs?.back !== 'string' ? (
          <SoftBox
            component="img"
            id={4}
            src={Imgs?.back}
            alt=""
            borderRadius="lg"
            pagination
            rowsPerPageOptions={[10, 30, 50, 70, 100]}
            shadow="md"
            sx={{ cursor: 'pointer', height: '100%', objectFit: 'cover' }}
            onClick={handleSetCurrentImage}
            width="70px"
            height="70px"
          />
        ) : null}

        {Imgs?.top && Imgs?.top !== 'string' ? (
          <SoftBox
            component="img"
            id={4}
            src={Imgs?.top}
            alt=""
            borderRadius="lg"
            shadow="md"
            sx={{ cursor: 'pointer', height: '100%', objectFit: 'cover' }}
            onClick={handleSetCurrentImage}
            width="70px"
            height="70px"
          />
        ) : null}

        {Imgs?.bottom && Imgs?.bottom !== 'string' ? (
          <SoftBox
            component="img"
            id={4}
            src={Imgs?.bottom}
            alt=""
            borderRadius="lg"
            shadow="md"
            sx={{ cursor: 'pointer', height: '100%', objectFit: 'cover' }}
            onClick={handleSetCurrentImage}
            width="70px"
            height="70px"
          />
        ) : null}

        {Imgs?.left && Imgs?.left !== 'string' ? (
          <SoftBox
            component="img"
            id={4}
            src={Imgs?.left}
            alt=""
            borderRadius="lg"
            shadow="md"
            sx={{ cursor: 'pointer', height: '100%', objectFit: 'cover' }}
            onClick={handleSetCurrentImage}
            width="70px"
            height="70px"
          />
        ) : null}

        {Imgs?.right && Imgs?.right !== 'string' ? (
          <SoftBox
            component="img"
            id={4}
            src={Imgs?.right}
            alt=""
            borderRadius="lg"
            shadow="md"
            sx={{ cursor: 'pointer', height: '100%', objectFit: 'cover' }}
            onClick={handleSetCurrentImage}
            width="70px"
            height="70px"
          />
        ) : null}

        {Imgs?.top_left && Imgs?.top_left !== 'string' ? (
          <SoftBox
            component="img"
            id={4}
            src={Imgs?.top_left}
            alt=""
            borderRadius="lg"
            shadow="md"
            sx={{ cursor: 'pointer', height: '100%', objectFit: 'cover' }}
            onClick={handleSetCurrentImage}
            width="70px"
            height="70px"
          />
        ) : null}

        {Imgs?.top_right && Imgs?.top_right !== 'string' ? (
          <SoftBox
            component="img"
            id={4}
            src={Imgs?.top_right}
            alt=""
            borderRadius="lg"
            shadow="md"
            sx={{ cursor: 'pointer', height: '100%', objectFit: 'cover' }}
            onClick={handleSetCurrentImage}
            width="70px"
            height="70px"
          />
        ) : null}
      </SoftBox>
      {!isMobileDevice && (
        <>
          {/* product KPIS */}
          {price && (
            <div>
              <SoftBox style={{ margin: '10px 0px 10px 0px' }} className="content-space-between">
                <SoftTypography variant="h6" fontWeight="medium" style={{ fontSize: 16, fontWeight: 500 }}>
                  Product KPIs
                </SoftTypography>
              </SoftBox>
              <SoftBox style={{ margin: '10px 0px 3px 5px' }} className="content-space-between">
                <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.8rem', color: '#344767' }}>Analysis</InputLabel>
              </SoftBox>
              <Card className="productKpiCard">
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Grid container spacing={1}>
                      <Grid item xs={4} md={4}>
                        <SoftTypography
                          variant="caption"
                          fontWeight="bold"
                          style={{ fontSize: '0.9rem', width: '150px' }}
                        >
                          Inventory
                        </SoftTypography>
                      </Grid>
                      <Grid item xs={2} md={3}>
                        {price?.inventoryAnalysis === 'D' ? (
                          <Chip label="D" />
                        ) : (
                          <Chip
                            color={changingChipStatus(price?.inventoryAnalysis)}
                            label={price?.inventoryAnalysis || 'NA'}
                            variant={price?.inventoryAnalysis === null ? 'outlined' : undefined}
                            style={{ minWidth: 'fit-content' }}
                          />
                        )}
                      </Grid>
                      <Grid item xs={6} md={5}>
                        {price?.inventoryAnalysis && (
                          <Chip
                            color={categoryColour(price?.inventoryAnalysis)}
                            label={getTagDescription('INVENTORY', price?.inventoryAnalysis)}
                            // variant="outlined"
                            className="tagChipStyle"
                          />
                        )}
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container spacing={1}>
                      <Grid item xs={4} md={4}>
                        <SoftTypography
                          variant="caption"
                          fontWeight="bold"
                          style={{ fontSize: '0.9rem', width: '150px' }}
                        >
                          Sales
                        </SoftTypography>
                      </Grid>
                      <Grid item xs={2} md={3}>
                        <Chip
                          color={changingChipStatus(price?.salesAnalysis)}
                          label={price?.salesAnalysis || 'NA'}
                          variant={price?.salesAnalysis === null ? 'outlined' : undefined}
                          style={{ minWidth: 'fit-content' }}
                        />
                      </Grid>
                      <Grid item xs={6} md={5}>
                        {price?.salesAnalysis && (
                          <Chip
                            color={categoryColour(price?.salesAnalysis)}
                            label={getTagDescription('SALES', price?.salesAnalysis)}
                            className="tagChipStyle"
                          />
                        )}
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container spacing={1}>
                      <Grid item xs={4} md={4}>
                        <SoftTypography
                          variant="caption"
                          fontWeight="bold"
                          style={{ fontSize: '0.9rem', width: '150px' }}
                        >
                          Profit
                        </SoftTypography>
                      </Grid>
                      <Grid item xs={2} md={3}>
                        <Chip
                          color={changingChipStatus(price?.salesProfitAnalysis)}
                          label={price?.salesProfitAnalysis || 'NA'}
                          variant={price?.salesProfitAnalysis === null ? 'outlined' : undefined}
                          style={{ minWidth: 'fit-content' }}
                        />
                      </Grid>
                      <Grid item xs={6} md={5}>
                        {price?.salesProfitAnalysis && (
                          <Chip
                            color={categoryColour(price?.salesProfitAnalysis)}
                            label={getTagDescription('PROFIT', price?.salesProfitAnalysis)}
                            className="tagChipStyle"
                          />
                        )}
                      </Grid>
                    </Grid>
                  </Grid>

                  {/* <Grid item xs={12}>
                    <Grid container spacing={1}>
                      <Grid item xs={12} >
                        <SoftTypography
                          variant="caption"
                          fontWeight="bold"
                          style={{ fontSize:"0.9rem",width: '150px' }}
                        >
                          Average Sales Margin
                        </SoftTypography>
                      </Grid>
                      <Grid item xs={2} md={3}>
                    
                      </Grid>
                 
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container spacing={1}>
                      <Grid item xs={12} >
                        <SoftTypography
                          variant="caption"
                          fontWeight="bold"
                          style={{ fontSize:"0.9rem",width: '150px' }}
                        >
                          Average Purchase Margin
                        </SoftTypography>
                      </Grid>
                      <Grid item xs={2} md={3}>
                    
                      </Grid>
                 
                    </Grid>
                  </Grid> */}
                </Grid>
              </Card>
            </div>
          )}
          {/* batch Health */}
          {pricingDetail && pricingDetail[0]?.batchId && (
            <div>
              <SoftBox style={{ margin: '10px 0px 3px 5px' }} className="content-space-between">
                <InputLabel sx={{ fontWeight: 'bold', fontSize: '0.8rem', color: '#344767' }}>Batch Health</InputLabel>
              </SoftBox>
              <Card
                className="productKpiCard"
                style={{ maxHeight: '250px', overflow: 'scroll', scrollbarWidth: 'none' }}
              >
                <Grid container spacing={1} justifyContent={'space-between'} alignItems={'center'}>
                  {pricingDetail
                    ?.filter((item) => item?.availableUnits > 0)
                    ?.map((item) => {
                      return (
                        <>
                          <Grid item md={3}>
                            <SoftTypography
                              variant="caption"
                              fontWeight="bold"
                              style={{ fontSize: '0.9rem', width: '150px', overflow: 'scroll' }}
                            >
                              {item?.batchId}
                            </SoftTypography>
                          </Grid>
                          <Grid item md={8} justifyContent={'space-between'} alignItems={'center'}>
                            <ProgressBar
                              variant={renderExpiredColor(item?.expiryDateApi)}
                              now={getBatchHealth(item?.createdOn, item?.expiryDateApi)}
                              style={{ height: '0.5rem' }}
                              animated
                            />
                            <SoftTypography
                              variant="caption"
                              fontWeight="bold"
                              style={{ fontSize: '0.9rem', width: '150px', textAlign: 'right' }}
                            >
                              {renderExpiryMessage(item?.expiryDateApi)}
                            </SoftTypography>
                          </Grid>
                        </>
                      );
                    })}
                </Grid>
              </Card>
            </div>
          )}
        </>
      )}
    </SoftBox>
  );
}

ProductImages.propTypes = {
  frontImg: PropTypes.string,
  backImg: PropTypes.string,
};

export default ProductImages;
