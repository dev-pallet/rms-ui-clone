import React from 'react';
import SoftBox from '../../../../components/SoftBox';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

function SkeletonLoader() {
  return (
    <SoftBox className="skeleton-loader">
      <Box
        sx={{
          marginTop: '1rem',
          margin: 'auto',
          width: '50%',
        }}
      >
        <Skeleton variant="text" animation="wave" sx={{ fontSize: '2rem' }} />
      </Box>

      <Box
        sx={{
          marginTop: '2rem',
          margin: 'auto',
          width: '30%',
        }}
      >
        <Skeleton variant="text" animation="wave" sx={{ fontSize: '1.5rem' }} />
      </Box>

      <Box
        sx={{
          marginTop: '2rem',
          margin: 'auto',
          width: '50%',
        }}
      >
        <Skeleton variant="text" animation="wave" sx={{ fontSize: '3rem' }} />
      </Box>

      <Box
        sx={{
          marginTop: '1rem',
          padding: '1rem',
        }}
      >
        {[0, 1, 2.3, 4, 5].map((item) => (
          <Box
            sx={{
              display: 'flex',
              gap: '1rem',
              marginTop: '0.5rem',
            }}
          >
            <Skeleton variant="circular" animation="wave" width={40} height={40} />
            <Skeleton variant="text" animation="wave" sx={{ fontSize: '1rem', width: '100%' }} />
          </Box>
        ))}
      </Box>

      <Box
        sx={{
          marginTop: '1rem',
          margin: 'auto',
          width: '50%',
        }}
      >
        <Skeleton variant="text" animation="wave" sx={{ fontSize: '1rem' }} />
      </Box>
    </SoftBox>
  );
}

export default SkeletonLoader;
