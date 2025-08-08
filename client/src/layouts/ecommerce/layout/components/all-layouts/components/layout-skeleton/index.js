import '../../all-layouts.css';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import React, { useState } from 'react';
import Skeleton from '@mui/material/Skeleton';

const SkeletonLoader = () => {
  const [skeleton, setSkeleton] = useState([0, 1, 2, 3, 4, 5]);

  return (
    <Grid container spacing={4} mt={1}>
      {skeleton.map((item) => (
        <Grid item lg={4} md={4} xl={4} xs={12}>
          <Box className="layout-skeleton">
            <Skeleton
              variant="rectangular"
              animation="wave"
              style={{
                height: '22rem',
                borderRadius: '1rem',
                minWidth: '5rem',
              }}
            />
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

export default SkeletonLoader;
