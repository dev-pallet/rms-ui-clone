import { Paper } from '@mui/material';
import Counter from '../../../Pallet-pay/AnimateCounter';
import NorthIcon from '@mui/icons-material/North';
import React from 'react';
import SoftTypography from '../../../../../components/SoftTypography';

const DashboardCard = ({ title, count, type }) => {
  return (
    <Paper style={{  height: '130px' , borderRadius: '12px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
      <SoftTypography style={{ fontSize: '1rem', margin: '20px', marginBottom:'0px',fontWeight: 'bold', color: '#7a7b7d' }}>
        {title}
      </SoftTypography>
      <div style={{ marginLeft: '20px', fontSize: '1.8rem', color: '#3498db', overflow: 'hidden' }}>
        {type || '₹'}{' '}
        <span style={{ fontWeight: 'bold', color: '#2ecc71' }}>
          <Counter value={count} />
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px' }}>
        <SoftTypography style={{ fontSize: '0.9rem', color: '#95a5a6', overflow: 'hidden' }}>
          <span style={{ color: '#27ae60', marginRight: '8px' }}>
            <NorthIcon />
          </span>
          +0% Since last Week
        </SoftTypography>

    
      </div>
    </Paper>
  );
};

export default DashboardCard;
