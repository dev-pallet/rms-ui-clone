import React, { useEffect, useState } from 'react';

import { Card } from '@mui/material';
import { brandFilter } from '../../../../../config/Services';
import { useNavigate } from 'react-router-dom';
import SoftTypography from '../../../../../components/SoftTypography';

import EditIcon from '@mui/icons-material/Edit';
const AvailableBrands = () => {
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
    <>
  

      {brandDetails?.length  > 0? (
        <Card>
          {/* <div style={{ margin: '10px' }}>
            <SoftButton
              color="info"
              onClick={() => setShowEdit(!showEdit)}
              style={{ float: 'right', backgroundColor: '#0562FB' }}
            >
              Edit
            </SoftButton>
          </div> */}
          <SoftTypography style={{fontSize:'0.8rem' , margin:'8px'}}> Shop by Brands</SoftTypography>
          <Card className="Card_brand" style={{ display: 'flex', flexDirection: 'row' }}>
            {brandDetails?.map((e, i) => (
              <div>
                <div key={i} className="brand-image_brand_Mobile">
                  <div className="brand-image_brand_Mobile">
                    <img src={e?.image} alt={e?.brandName} />
                  </div>
                  <div className="brand-name_brand_mobile" >
                    <p >{e?.brandName}</p>
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
            alt="no data found"
            style={{
              minWidth: '150px',
              maxWidth: '350px',
              borderRadius: '15px',
            }}
          />
        </Card>
      )}
    </>
  );
};

export default AvailableBrands;
