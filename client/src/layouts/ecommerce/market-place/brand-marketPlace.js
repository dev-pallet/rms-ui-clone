import { brandFilter } from '../../../config/Services';
import { useMediaQuery } from '@mui/material';
import React, { useEffect, useState } from 'react';
import SoftBox from '../../../components/SoftBox';
import SoftTypography from '../../../components/SoftTypography';

const BrandMarketPlace = () => {
  const isMD = useMediaQuery('(max-width:950px)');
  const isSM = useMediaQuery('(max-width:550px)');
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [brandDetails, setBrandDetails] = useState([]);
  const locId = localStorage.getItem('locId');
  const orgId = localStorage.getItem('orgId');
  useEffect(() => {
    const payload = {
      page: 1,
      pageSize: 10,
      listedOn: ['RMS'],

      sourceId: [orgId],
      sourceLocationId: [locId],

      sort: {
        creationDateSortOption: 'DEFAULT',
        tagPriority: 'DEFAULT',
      },
    };
    brandFilter(payload)
      .then((res) => {
        const data = res?.data?.data?.data?.data?.map((item) => item?.image);
        setBrandDetails(data);
      })
      .catch((err) => {});
  }, []);
  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };
  const brands = [
    'https://i.ibb.co/bNr6pDJ/Twinleaves-no-background.png',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2nu6hy93FEDwYnsCt8Ye2wB_5NmEAyrN_Hg&usqp=CAU',
    'https://static.vecteezy.com/system/resources/previews/019/766/248/original/amul-logo-amul-icon-transparent-logo-free-png.png',
    'https://d1yjjnpx0p53s8.cloudfront.net/styles/logo-thumbnail/s3/062019/himalaya_herbals.png?P.86odC.wbrZoNpuja.FNIzc7XNKugBB&itok=xo-AOKV3',
    'https://images.squarespace-cdn.com/content/v1/570b9bd42fe131a6e20717c2/1591275138853-EFP3ZZM0X6G7IIQXONUE/Tata+Sampann_Packaging_Elephant+Design+6.jpg',
    'https://bisonmart.in/wp-content/uploads/2022/10/71uRt13ppFL._SX569_.jpg',
  ];

  return (
    <>
      {brandDetails?.length > 0 && (
        <SoftBox
          sx={{
            width: '100%',

            marginTop: '25px',
            marginBottom: '25px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '20px',
            flexDirection: isMD ? 'column' : 'row',
          }}
        >
          {/* <Card
          sx={{
            width: isSM ? '100%' : isMD ? '60%' : '350px',
            height: '100%',
            background: 'white',
            borderRadius: '10px',
            padding: '20px',
            boxShadow: ' 0rem 1.25rem 1.6875rem 0rem rgba(0, 0, 0, 0.05)',
          }}
        >
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHkHL6kI9qoBXydvctt6ctOaSVhCp2k6qAlg&usqp=CAU"
            alt=""
            className="dotd-img"
          />
          <SoftTypography className="category-text deal_of_day">Deal of the Day</SoftTypography>
          <Swipermarket showControls={false} images={dealsOftheDayImages} />
        </Card> */}
          <SoftBox
            sx={{
              width: '100%',
              height: 'fit-content',
              background: 'white',
              borderRadius: '10px',
              padding: '20px',
              boxShadow: ' 0rem 1.25rem 1.6875rem 0rem rgba(0, 0, 0, 0.05)',
            }}
          >
            <SoftTypography className="category-text" style={{ marginBottom: '10px', marginLeft: '-30px' }}>
              Shop by Brand
            </SoftTypography>
            <SoftBox
              sx={{
                display: 'block !important',
              }}
            >
              <SoftBox
                sx={{
                  width: '100%',
                  height: 'auto',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  //   justifyContent: 'space-between',
                  // gridTemplateColumns: isMD ? 'unset' : 'repeat(3, 1fr)',
                  // gridTemplateRows: isMD ? 'unset' : 'repeat(3, 1fr)',
                  gap: '20px',
                  padding: isMD ? '20px' : '0 auto',
                  overflowX: isMD ? 'scroll' : 'unset',
                }}
              >
                {brandDetails?.map((imageUrl, index) => (
                  <div
                    className="brand-img-div"
                    key={index}
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={handleMouseLeave}
                    style={{
                      width: '120px',
                      height: '120px',
                      borderRadius: '50%',
                      margin: '5px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      overflow: 'hidden', // Ensures the image stays within the circle
                      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.6)',
                      filter: hoveredIndex !== null && hoveredIndex !== index ? 'grayscale(100%)' : 'none',
                    }}
                  >
                    <img
                      style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                      src={imageUrl}
                      alt={`brand${index + 1}`}
                    />
                  </div>
                ))}
              </SoftBox>
            </SoftBox>
          </SoftBox>
        </SoftBox>
      )}
      <br />
    </>
  );
};

export default BrandMarketPlace;
