import { Skeleton } from '@mui/material';
import SoftBox from '../../../../../../components/SoftBox';

export default function TableSummarySkeleton() {
  return (
    <SoftBox sx={{ display: 'flex', flexDirection: 'column' }}>
      <Skeleton variant="text" width={'100%'} height="40px" />
      <Skeleton
        variant="rectangular"
        sx={{
          height: '70px',
          width: '100%',
        }}
      /> 
    </SoftBox>
  );
}
