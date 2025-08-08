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

import PropTypes from 'prop-types';

function ProductImageMP({ Imgs }) {
  const [currentImage, setCurrentImage] = useState(null);

  const [imgsViewer, setImgsViewer] = useState(false);
  const [imgsViewerCurrent, setImgsViewerCurrent] = useState(0);

  const images = [];

  for (const key in Imgs) {
    images.push(Imgs[key]);
  }

  const imagesArray = images.filter(Boolean);

  const imageSet = imagesArray.map((src) => ({ src }));

  useEffect(() => {
    if (Imgs?.front) {
      setCurrentImage(Imgs.front);
    } else if (Imgs?.top != null) {
      setCurrentImage(Imgs.top);
    } else if (Imgs?.bottom != null) {
      setCurrentImage(Imgs.bottom);
    } else if (Imgs?.back != null) {
      setCurrentImage(Imgs.back);
    } else if (Imgs?.top_left != null) {
      setCurrentImage(Imgs.top_left);
    } else if (Imgs?.right != null) {
      setCurrentImage(Imgs.right);
    } else if (Imgs?.left != null) {
      setCurrentImage(Imgs.left);
    } else if (Imgs?.top_right != null) {
      setCurrentImage(Imgs.top_right);
    }

    const images = [];

    for (const key in Imgs) {
      images.push(Imgs[key]);
    }

    const imagesArray = images.filter(Boolean);

    const imageSet = imagesArray.map((src) => ({ src }));
    
  }, [Imgs]);

  const handleSetCurrentImage = ({ currentTarget }) => {
    setCurrentImage(currentTarget.src);
    setImgsViewerCurrent(Number(currentTarget.id));
  };

  const openImgsViewer = () => setImgsViewer(true);
  const closeImgsViewer = () => setImgsViewer(false);
  const imgsViewerNext = () => setImgsViewerCurrent(imgsViewerCurrent + 1);
  const imgsViewerPrev = () => setImgsViewerCurrent(imgsViewerCurrent - 1);
  return (
    <SoftBox>
      {!imagesArray.length && (
        <>
          <img
            style={{ width: '100%' }}
            src="https://www.freeiconspng.com/thumbs/no-image-icon/no-image-icon-15.png"
            alt=""
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
          width="400px"
          height="400px"
        />
      )}

      <SoftBox mt={2} pt={1}>
        <Grid container spacing={3}>
          {Imgs?.front ? (
            <Grid item xs={2}>
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
            </Grid>
          ) : null}

          {Imgs?.back ? (
            <Grid item xs={2}>
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
            </Grid>
          ) : null}

          {Imgs?.top ? (
            <Grid item xs={2}>
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
            </Grid>
          ) : null}

          {Imgs?.bottom ? (
            <Grid item xs={2}>
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
            </Grid>
          ) : null}

          {Imgs?.left ? (
            <Grid item xs={2}>
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
            </Grid>
          ) : null}

          {Imgs?.right ? (
            <Grid item xs={2}>
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
            </Grid>
          ) : null}

          {Imgs?.top_left ? (
            <Grid item xs={2}>
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
            </Grid>
          ) : null}

          {Imgs?.top_right ? (
            <Grid item xs={2}>
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
            </Grid>
          ) : null}
        </Grid>
      </SoftBox>
    </SoftBox>
  );
}

ProductImageMP.propTypes = {
  frontImg: PropTypes.string,
  backImg: PropTypes.string,
};

export default ProductImageMP;
