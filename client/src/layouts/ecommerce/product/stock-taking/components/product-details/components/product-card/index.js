import './index.css';
import { Card } from '@mui/material';
import { CycleCountModal } from '../countmodal';
import { defaultImage } from '../../../../../../Common/linkConstants';
import { memo, useMemo, useState } from 'react';
import CustomLinearProgressBar from '../linear-progress';
import SoftBox from '../../../../../../../../components/SoftBox';
import SoftTypography from '../../../../../../../../components/SoftTypography';

const ProductCard = ({ reportData, refetchReportList }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpen = () => {
    setModalOpen(true);
  };

  const percentage = useMemo(() => {
    const verifiedItems = reportData?.stReportBatchList?.filter((item) => item.verified === 'Y') || [];
    const totalItems = reportData?.stReportBatchList?.length || 0;

    return ((verifiedItems.length / totalItems) * 100).toFixed(1);
  }, [reportData]);

  return (
    <>
      <Card onClick={handleOpen}>
        <SoftBox className="product-card-box" p={1}>
          <img src={defaultImage} alt="error" className="stock-item-image" />
          <SoftBox ml={1} className="stock-item-mian-box">
            <SoftTypography variant="h4" className="stock-item-details">
              {reportData?.itemName}
            </SoftTypography>
            <SoftTypography variant="h4" className="stock-item-details">
              Gtin: {reportData?.gtin}
            </SoftTypography>
            <SoftTypography variant="h4" className="stock-item-details">
              Batches: {reportData?.stReportBatchList?.length}
            </SoftTypography>
            <SoftBox SoftBoxRoot={{ width: '100%' }}>
              <CustomLinearProgressBar percentage={percentage} />
            </SoftBox>
          </SoftBox>
        </SoftBox>
      </Card>
      <CycleCountModal
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        reportData={reportData}
        refetchReportList={refetchReportList}
      />
    </>
  );
};
export default memo(ProductCard);
