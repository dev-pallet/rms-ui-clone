import { Splide, SplideSlide } from '@splidejs/react-splide';

import { previewBanner } from '../../../../../config/Services';
import React, { useEffect, useState } from 'react';

const AvailableBanner = ({ typeId }) => {
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const [selectedImages, setSelectedImages] = useState();

  useEffect(() => {
    const payload = {
      page: 1,
      pageSize: 100,
      bannerId: [typeId],
      sourceId: [orgId],
      sourceLocationId: [locId],
      sort: {
        creationDateSortOption: 'DEFAULT',
        tagPriority: 'DEFAULT',
      },
    };
    previewBanner(payload)
      .then((res) => {
        const imageData = res?.data?.data?.data?.data[0]?.bannerImage?.map((e) => e?.image);
        setSelectedImages(imageData);
      })
      .catch((err) => {});
  }, []);
  return (
    <Splide
      style={{ width: '100%' }}
      options={{
        padding: '1rem',
        type: 'loop',
        perPage: 1,
        perMove: 1,
        interval: 2500,
        autoplay: true,
        pagination: false,
        height: 200,
      }}
      aria-label="My Favorite Images"
    >
      {selectedImages?.map((image, index) => (
        <SplideSlide key={index} className='splide_Alignflex' >
          <img
            className='splid_ImageSize'
            src={image}
            alt={`Image ${index + 1}`}
          />
        </SplideSlide>
      ))}
    </Splide>
  );
};

export default AvailableBanner;
