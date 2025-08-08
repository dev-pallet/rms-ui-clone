import { Box, Card, Divider, Menu, MenuItem } from '@mui/material';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import { previewBanner } from '../../../../config/Services';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import React, { useEffect, useState } from 'react';
import SoftBox from '../../../../components/SoftBox';
import SoftButton from '../../../../components/SoftButton';
import SoftTypography from '../../../../components/SoftTypography';

const BannerEditPreview = () => {
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [prevBanner, setPrevBanner] = useState([]);
  const open = Boolean(anchorEl);
  const [bannerId, setBannerId] = useState('');
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
      pageSize: 10,
      // "bannerId": [
      //   "string"
      // ],
      // "bannerName": [
      //   "string"
      // ],
      // "type": [
      //   "string"
      // ],
      sourceId: [orgId],
      sourceLocationId: [locId],
      // "createdBy": [
      //   "string"
      // ],
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

  return (
    <DashboardLayout>
      <DashboardNavbar prevLink={true} />
      <Box
        className="search-bar-filter-container"
        sx={{ display: 'flex', justifyContent: 'space-between', borderRadius: '10px' }}
      >
        {/* <Card
            style={{
              padding: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexDirection: 'row',
            }}
          > */}
        <SoftBox style={{ display: 'flex', alignItems: 'center' }}>
          <SoftTypography style={{ color: 'white', fontSize: '1rem', marginInline: '5px' }}>
            Available Banners
          </SoftTypography>
        </SoftBox>
        <SoftBox style={{ marginLeft: 'auto' }}>
          <SoftButton
            variant="solidWhiteBackground"
            // color="info"
            onClick={handleNew}
            // style={{ backgroundColor: '#0562FB' }}
          >
            + New
          </SoftButton>
        </SoftBox>
        {/* </Card> */}
      </Box>
      {prevBanner?.length > 0 ? (
        <>
          {prevBanner?.map((e) => (
            <Card style={{ padding: '20px', marginTop: '10px' }}>
              <SoftBox
                style={{ display: 'flex', justifyContent: 'space-between', margin: '10px', alignItems: 'center' }}
              >
                <SoftBox>
                  <SoftTypography style={{ fontSize: '0.95rem' }}>{e?.bannerName}</SoftTypography>
                </SoftBox>
                <br />
                <SoftBox>
                  <Menu
                    anchorEl={anchorEl}
                    id="account-menu"
                    open={open}
                    onClose={handleClose}
                    onClick={handleClose}
                    PaperProps={{
                      elevation: 0,
                      sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                          width: 32,
                          height: 32,
                          ml: -0.5,
                          mr: 1,
                        },
                        '&:before': {
                          content: '""',
                          display: 'block',
                          position: 'absolute',
                          top: 0,
                          right: 14,
                          width: 10,
                          height: 10,
                          bgcolor: 'background.paper',
                          transform: 'translateY(-50%) rotate(45deg)',
                          zIndex: 0,
                        },
                      },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  >
                    <MenuItem onClick={handleEdit}>Edit</MenuItem>
                    <Divider />
                    <MenuItem>Active</MenuItem>
                    <MenuItem>Inactive</MenuItem>
                  </Menu>
                  <SoftBox className="export-div">
                    <SoftBox onClick={(event) => handleClick(event, e?.bannerId)} className="st-dot-box">
                      <MoreVertIcon fontSize={'small'} />
                    </SoftBox>
                  </SoftBox>
                </SoftBox>
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
                      style={{ height: '300px', width: '97%', borderRadius: '20px' , objectFit:'contain'}}
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
    </DashboardLayout>
  );
};

export default BannerEditPreview;
