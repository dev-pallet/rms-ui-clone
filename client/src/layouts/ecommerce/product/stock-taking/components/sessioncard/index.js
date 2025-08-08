import './index.css';
import { Card, Chip } from '@mui/material';
import { formatDateDDMMYYYY } from '../../../../Common/CommonFunction';
import SoftBox from '../../../../../../components/SoftBox';
import SoftTypography from '../../../../../../components/SoftTypography';
import Watermark from '../watermark/watermark';

export const SessionCard = ({ onClick, sessionDetails }) => {
  const setChipColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'CLOSED':
        return 'error';
      default:
        return 'info';
    }
  };

  return (
    <Card className="schedule-details-card" onClick={onClick}>
      <SoftBox className="card-inner-content">
        <SoftBox className="card-content-primary">
          <SoftTypography className="stocking-taking-card-text" variant="h4">
            Available Products : {sessionDetails?.noOfProduct}
          </SoftTypography>
          <SoftTypography className="stocking-taking-card-text" variant="h4">
            Start date : {formatDateDDMMYYYY(sessionDetails?.createdOn)}
          </SoftTypography>
          <SoftTypography className="stocking-taking-card-text" variant="h4">
            Status - <Chip label={sessionDetails?.status} color={setChipColor(sessionDetails?.status)} />
          </SoftTypography>
        </SoftBox>
      </SoftBox>
      <Watermark />
    </Card>
  );
};
