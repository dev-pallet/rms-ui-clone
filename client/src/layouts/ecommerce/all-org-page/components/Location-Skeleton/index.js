import './location-skeleton.css';
import { Skeleton } from '@mui/material';
import { useState } from 'react';
import SoftBox from '../../../../../components/SoftBox';

const LocationSkeleton = () => {
  const [count, setCount] = useState(7);

  const skeletonArray = Array.from({ length: count });
  return (
    <>
      {skeletonArray.map((item) => (
        <SoftBox sx={{overflowX: 'hidden',width: '100%'}}>
          <SoftBox className="org-skull">
            <SoftBox className="org-skull-info">
              <Skeleton variant="rectangular" className="location-skelton-org-card" />
              <SoftBox className="org-skull-info-two">
                <Skeleton variant="rectangular" className="location-skelton-org-title" />
                <SoftBox className="org-skull-info">
                  <Skeleton variant="rectangular" className="location-skelton-org-chip" />
                  <Skeleton variant="rectangular" className="location-skelton-org-chip" />
                  <Skeleton variant="rectangular" className="location-skelton-org-chip" />
                </SoftBox>
              </SoftBox>
            </SoftBox>
            <SoftBox className="skull-btn-location">
              <Skeleton variant="rectangular" className="location-skelton-org-btn" />
              <Skeleton variant="rectangular" className="location-skelton-org-btn" />
            </SoftBox>
          </SoftBox>
          <SoftBox className="loc-skelton-div">
            <SoftBox className="skull-bg skull-card-div">
              <Skeleton variant="rectangular" className="location-skelton-loc-card" />
              <Skeleton variant="rectangular" className="location-skelton-loc-btn" />
              <Skeleton variant="rectangular" className="location-skelton-loc-name" />
              <Skeleton variant="rectangular" className="location-skelton-loc-subName" />
            </SoftBox>
            <SoftBox className="skull-bg skull-card-div">
              <Skeleton variant="rectangular" className="location-skelton-loc-card" />
              <Skeleton variant="rectangular" className="location-skelton-loc-btn" />
              <Skeleton variant="rectangular" className="location-skelton-loc-name" />
              <Skeleton variant="rectangular" className="location-skelton-loc-subName" />
            </SoftBox>
          </SoftBox>
        </SoftBox>
      ))}
    </>
  );
};

export default LocationSkeleton;
