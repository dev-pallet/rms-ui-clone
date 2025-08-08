import './dashboard-skelton.css';
import { Skeleton } from '@mui/material';
import SoftBox from '../../../../../components/SoftBox';

const DashboardSkeleton = () => {
  return (
    <SoftBox className="dashboard-skull-main-div">
      <Skeleton animation="wave" className="dash-skull-title" />
      <Skeleton animation="wave" className="dash-skull-select" />
      <SoftBox className="dashboard-skull-main">
        <SoftBox className="dash-skull-info">
          <Skeleton animation="wave" className="dash-skull-card-title" />
          <Skeleton animation="wave" className="dash-skull-value" />
        </SoftBox>
        <SoftBox className="dash-skull-icon">
          <Skeleton animation="wave" className="dash-skull-icon" />
        </SoftBox>
      </SoftBox>
      <SoftBox className="dashboard-skull-main">
        <SoftBox className="dash-skull-info">
          <Skeleton animation="wave" className="dash-skull-card-title" />
          <Skeleton animation="wave" className="dash-skull-value" />
        </SoftBox>
        <SoftBox className="dash-skull-icon">
          <Skeleton animation="wave" className="dash-skull-icon" />
        </SoftBox>
      </SoftBox>
      <SoftBox className="dashboard-skull-main">
        <SoftBox className="dash-skull-info">
          <Skeleton animation="wave" className="dash-skull-card-title" />
          <Skeleton animation="wave" className="dash-skull-value" />
        </SoftBox>
        <SoftBox className="dash-skull-icon">
          <Skeleton animation="wave" className="dash-skull-icon" />
        </SoftBox>
      </SoftBox>
      <SoftBox className="dashboard-skull-main">
        <SoftBox className="dash-skull-info">
          <Skeleton animation="wave" className="dash-skull-card-title" />
          <Skeleton animation="wave" className="dash-skull-value" />
        </SoftBox>
        <SoftBox className="dash-skull-icon">
          <Skeleton animation="wave" className="dash-skull-icon" />
        </SoftBox>
      </SoftBox>
      <SoftBox className="dashboard-skull-main">
        <SoftBox className="dash-skull-info">
          <Skeleton animation="wave" className="dash-skull-card-title" />
          <Skeleton animation="wave" className="dash-skull-value" />
        </SoftBox>
        <SoftBox className="dash-skull-icon">
          <Skeleton animation="wave" className="dash-skull-icon" />
        </SoftBox>
      </SoftBox>
      <SoftBox className="dashboard-skull-main">
        <SoftBox className="dash-skull-info">
          <Skeleton animation="wave" className="dash-skull-card-title" />
          <Skeleton animation="wave" className="dash-skull-value" />
        </SoftBox>
        <SoftBox className="dash-skull-icon">
          <Skeleton animation="wave" className="dash-skull-icon" />
        </SoftBox>
      </SoftBox>
    </SoftBox>
  );
};

export default DashboardSkeleton;
