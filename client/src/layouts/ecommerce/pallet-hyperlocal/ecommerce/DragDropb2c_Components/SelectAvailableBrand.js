import { Card } from '@mui/material';
import { brandFilter } from '../../../../../config/Services';
import React, { useEffect, useState } from 'react';
import SoftButton from '../../../../../components/SoftButton';

const SelectAvailableBrand = ({setContentTypeId}) => {
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const [brandDetails, setBrandDetails] = useState([]);
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
    brandFilter(payload)
      .then((res) => {
        setBrandDetails(res?.data?.data?.data?.data);
      })
      .catch((err) => {});
  }, []);
  return (
    <div>
      {brandDetails.length > 0 ? (
        <Card>
          <div style={{ margin: '10px' }}>
            <SoftButton
              color="secondary"
              style={{ float: 'right' }}
              onClick={() => setContentTypeId([{ type: 'BRANDS', idOfData: '', priority: '' }])}
            >
              Select
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
    </div>

  );
};

export default SelectAvailableBrand;