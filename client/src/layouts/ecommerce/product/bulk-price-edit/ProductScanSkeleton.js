import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import PropTypes from 'prop-types';
import Skeleton from '@mui/material/Skeleton';

export default function ProductScanSkeleton(props) {
  const { loading = false } = props;

  return (
    <Card style={{margin:'5px 0px 5px 0px'}}>
      <CardHeader
        avatar={
          loading ? (
            <Skeleton animation="wave" variant="circular" width={50} height={50} />
          ) : null
        }
        title={
          loading ? (
            <Skeleton animation="wave" height={10} width="40%" />
          ) : null
        }
        subheader={
          loading ? (
            <Skeleton
              animation="wave"
              height={10}
              width="80%"
              style={{ marginBottom: 6 }}
            />
          ) : null
        }
      />
  


    </Card>
  );
}

ProductScanSkeleton.propTypes = {
  loading: PropTypes.bool,
};

