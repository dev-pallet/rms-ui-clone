import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../examples/Navbars/DashboardNavbar';
import { Button, Card, Grid, InputLabel } from '@mui/material';
import SoftTypography from '../../components/SoftTypography';
import SoftInput from '../../components/SoftInput';
import SoftButton from '../../components/SoftButton';
import SoftBox from '../../components/SoftBox';
import { useNavigate } from 'react-router-dom';

const BrandOwning = () => {
const navigate = useNavigate()
  const [brandCount, setBrandCount] = useState(1);
  const [brandName, setBrandName] = useState([]);
  const [brandCode, setBrandCode] = useState([]);


  const handleSetPermission = () => {
    localStorage.setItem('BrandMarketing', JSON.stringify(brandName));
    // navigate(-1)
  };
  return (
   
      <Card sx={{ marginBottom: '15px' }}>
        <div
          className="search-bar-filter-container"
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}
        >
          <SoftTypography style={{ color: 'white', fontSize: '1rem' }}>Brand Owning Company</SoftTypography>
        </div>
        <Card style={{ padding: '30px' }}>
          {Array.from({ length: brandCount }).map((_, index) => (
            <Grid container spacing={2} key={index} style={{ marginBottom: '10px' }}>
              <Grid item xs={12} md={6}>
                {index === 0 && (
                  <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                    Brand Name
                  </InputLabel>
                )}

                <SoftInput
                  placeholder="Enter Brand Name...."
                  value={brandName[index]}
                  onChange={(e) => {
                    const updatedNames = [...brandName];
                    updatedNames[index] = e.target.value;
                    setBrandName(updatedNames);
                  }}
                ></SoftInput>
              </Grid>
              <Grid item xs={12} md={6}>
                {index === 0 && (
                  <InputLabel required sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' }}>
                    Code
                  </InputLabel>
                )}

                <SoftInput placeholder="############"     value={brandCode[index]}
                  onChange={(e) => {
                    const updatedCode = [...brandCode];
                    updatedCode[index] = e.target.value;
                    setBrandCode(updatedCode);
                  }}></SoftInput>
              </Grid>
            </Grid>
          ))}

          <Button style={{ marginRight: 'auto' }} onClick={() => setBrandCount(brandCount + 1)}>
            + Add more
          </Button>
          <br />
          <SoftBox style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
            <SoftButton color="error">cancel</SoftButton>
            <SoftButton color="info" onClick={handleSetPermission}>
              Save
            </SoftButton>
          </SoftBox>
        </Card>
        {/* <Card style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img
            src="https://www.simsnd.in/assets/admin/no_data_found.png"
            alt="no data found"
            style={{
              minWidth: '150px',
              maxWidth: '350px',
              borderRadius: '15px',
            }}
          />
        </Card> */}
      </Card>
  );
};

export default BrandOwning;
