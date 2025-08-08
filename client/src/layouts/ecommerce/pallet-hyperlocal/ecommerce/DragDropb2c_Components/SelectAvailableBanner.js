import { Card } from '@mui/material';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import { previewBanner } from '../../../../../config/Services';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import SoftBox from '../../../../../components/SoftBox';
import SoftButton from '../../../../../components/SoftButton';
import SoftTypography from '../../../../../components/SoftTypography';

const SelectAvailableBanner = ({ setContentTypeId, contentTypeId , handleAddSelectedContent}) => {
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [prevBanner, setPrevBanner] = useState([]);
  const open = Boolean(anchorEl);
  const [bannerId, setBannerId] = useState('');
  const [selectedBanner, setSelectedBanner] = useState('');
  const handleClick = (event, bannerId) => {
    setBannerId(bannerId);
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    navigate(`/pallet-hyperlocal/customize/banner/${bannerId}`);
  };
  const handleNew = () => {
    navigate('/pallet-hyperlocal/customize/banner');
  };

  useEffect(() => {
    const payload = {
      page: 1,
      pageSize: 100,
      sourceId: [orgId],
      sourceLocationId: [locId],
      sort: {
        creationDateSortOption: 'DEFAULT',
        tagPriority: 'DEFAULT',
      },
    };
    previewBanner(payload)
      .then((res) => {
        setPrevBanner(res?.data?.data?.data?.data);
      })
      .catch((err) => {});
  }, []);

  const handleSelectBanner = (bannerId) => {
    setBannerId(bannerId);
    // setContentTypeId(prev => [ ...prev, { type: 'BANNER', idOfData: bannerId, priority: "" }]);
    setContentTypeId([{ type: 'BANNER', idOfData: bannerId, priority: '' }]);
  };
  return (
    <div style={{ padding: '10px' }}>
      {prevBanner?.length > 0 ? (
        <>
          {prevBanner?.map((e, index) => (
            <Card style={{ padding: '20px', marginTop: '10px' }}>
              <SoftBox
                style={{ display: 'flex', justifyContent: 'space-between', margin: '10px', alignItems: 'center' }}
              >
                <SoftBox>
                  <SoftTypography style={{ fontSize: '0.95rem' }}>{e?.bannerName}</SoftTypography>
                </SoftBox>
                <br />
                <SoftButton
                  color={e?.bannerId === bannerId ? 'info' : 'secondary'}
                  onClick={() => handleSelectBanner(e?.bannerId)}
                >
                  {e?.bannerId === bannerId ? 'Selected' : 'Select'}
                </SoftButton>
              </SoftBox>
              <br />
              <Splide
                style={{ width: '100%' }}
                options={{
                  padding: e?.bannerImage?.length === 1 ? '1rem' : '3rem',
                  type: 'loop',
                  perPage: 1,
                  perMove: 1,
                  interval: 2500,
                  autoplay: true,
                  pagination: false,
                }}
                aria-label="My Favorite Images"
              >
                {e?.bannerImage?.map((image, index) => (
                  <SplideSlide key={index} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <img
                      style={{ height: '300px', width: '97%', borderRadius: '20px', objectFit: 'contain' }}
                      src={image?.image}
                      alt={`Image ${index + 1}`}
                    />
                  </SplideSlide>
                ))}
              </Splide>
            </Card>
          ))}
        </>
      ) : (
        <Card style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '15px' }}>
          <img
            src="https://www.simsnd.in/assets/admin/no_data_found.png"
            alt="no data found"
            style={{
              minWidth: '150px',
              maxWidth: '350px',
              borderRadius: '15px',
            }}
          />
        </Card>
      )}
      <br />
    </div>
  );
};

export default SelectAvailableBanner;
