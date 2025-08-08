import '../../../../App.module.css';
import './customizeb2c.css';
import { Box, Card } from '@mui/material';
import { brandFilter } from '../../../../config/Services';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import EditIcon from '@mui/icons-material/Edit';
import React, { useEffect, useState } from 'react';
import SoftBox from '../../../../components/SoftBox';
import SoftButton from '../../../../components/SoftButton';
import SoftTypography from '../../../../components/SoftTypography';
const BrandEditPreview = () => {
  const navigate = useNavigate();
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const [brandDetails, setBrandDetails] = useState([]);
  const [showEdit, setShowEdit] = useState(false);

  const handleNew = () => {
    navigate('/pallet-hyperlocal/customize/brand');
  };
  const handleEdit = (brandId) => {
    navigate(`/pallet-hyperlocal/customize/brand/${brandId}`);
  };

  useEffect(() => {
    const payload = {
      page: 1,
      pageSize: 10,

      sourceId: [orgId],
      sourceLocationId: [locId],

      sort: {
        creationDateSortOption: 'DEFAULT',
        tagPriority: 'DEFAULT',
      },
    };
    brandFilter(payload)
      .then((res) => {
        setBrandDetails(res?.data?.data?.data?.data);
      })
      .catch((err) => {});
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar prevLink={true} />
      <Box
        className="search-bar-filter-container"
        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '10px' }}
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
            Available Brands
          </SoftTypography>
        </SoftBox>
        <SoftBox style={{ marginLeft: 'auto' }}>
          <SoftButton variant="solidWhiteBackground" onClick={handleNew}>
            + New
          </SoftButton>
        </SoftBox>
        {/* </Card> */}
      </Box>
      <br />

      {brandDetails.length ? (
        <Card>
          <div style={{ margin: '10px' }}>
            <SoftButton
              color="info"
              onClick={() => setShowEdit(!showEdit)}
              style={{ float: 'right', backgroundColor: '#0562FB' }}
            >
              Edit
            </SoftButton>
          </div>
          <Card className="Card_brand" style={{ display: 'flex', flexDirection: 'row' }}>
            {brandDetails?.map((e, i) => (
              <div>
                <div key={i} className="brand-box_brand">
                  <div className="brand-image_brand">
                    <img src={e?.image} alt={e?.brandName} />
                  </div>
                  <div className="brand-name_brand">
                    <p>{e?.brandName}</p>
                    {showEdit && (
                      <div style={{ marginTop: '-10px' }} onClick={() => handleEdit(e?.brandStoreId)}>
                        <EditIcon />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </Card>
        </Card>
      ) : (
        <Card style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img
            src="https://www.simsnd.in/assets/admin/no_data_found.png"
            alt=""
            style={{
              minWidth: '150px',
              maxWidth: '350px',
              borderRadius: '15px',
            }}
          />
        </Card>
      )}
    </DashboardLayout>
  );
};

export default BrandEditPreview;
