import './index.css';
import { format, formatISO, parse, parseISO } from 'date-fns';
import {
  getReportItem,
  getSelectedBatch,
  setReportItem,
} from '../../../../../../../../../../datamanagement/stockTakingSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import FormField from '../../../../../../../all-products/components/add-product/components/FormField';
import SaveIcon from '@mui/icons-material/Save';
import SoftBox from '../../../../../../../../../../components/SoftBox';
import SoftButton from '../../../../../../../../../../components/SoftButton';
import SoftTypography from '../../../../../../../../../../components/SoftTypography';

const formatDateFromISO = (date) => format(parseISO(date), 'yyyy-MM-dd');
const formatDateToISO = (date) => formatISO(parse(date, 'yyyy-MM-dd', new Date()));

const ItemCount = ({ handleBack, setShowContent }) => {
  const dispatch = useDispatch();
  const selectedBatch = useSelector(getSelectedBatch);
  const storedReportItem = useSelector(getReportItem);
  const [batchData, setBatchData] = useState({
    ...selectedBatch,
    expirationDate: selectedBatch.expirationDate ? formatDateFromISO(selectedBatch.expirationDate) : '',
    userCount: selectedBatch.userCount || '',
    storageName: selectedBatch.storageName || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBatchData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const oldUserCount =
      storedReportItem?.stReportBatchList.find((item) => item.reportBatchId === selectedBatch.reportBatchId)
        ?.userCount || 0;
    const updatedUserCount = +batchData.userCount || 0;
    const isUserCountChanged = oldUserCount !== updatedUserCount;

    const updatedReportItem = {
      ...storedReportItem,
      productVerified: isUserCountChanged ? 'Y' : storedReportItem.productVerified,
      totalUserCount:
        storedReportItem?.stReportBatchList.reduce((acc, item) => acc + (+item.userCount || 0), 0) -
        oldUserCount +
        updatedUserCount,
      stReportBatchList: storedReportItem?.stReportBatchList.map((item) =>
        item.reportBatchId === selectedBatch.reportBatchId
          ? {
            ...item,
            ...batchData,
            expirationDate: batchData?.expirationDate ? formatDateToISO(batchData?.expirationDate) : null,
            userCount: batchData?.userCount || null,
            storageName: batchData?.storageName || null,
            verified: isUserCountChanged ? 'Y' : item.verified,
          }
          : item,
      ),
    };

    dispatch(setReportItem(updatedReportItem));
    handleBack();
  };

  return (
    <SoftBox sx={{ height: '100vh' }}>
      <SoftTypography variant="h4" className="stock-item-header">
        Batch Id: {batchData?.batchNo}
      </SoftTypography>
      <SoftBox>
        <FormField
          type="number"
          label="Enter Item Available Count"
          name="userCount"
          value={batchData?.userCount}
          onChange={handleChange}
        />
        <FormField
          type="date"
          label="Expiry Date"
          name="expirationDate"
          value={batchData?.expirationDate}
          onChange={handleChange}
        />
        <FormField
          type="text"
          label="Item Location"
          name="storageName"
          value={batchData?.storageName}
          onChange={handleChange}
        />
      </SoftBox>
      <SoftButton className="item-count-save-btn" startIcon={<SaveIcon />} onClick={handleSave}>
        SAVE
      </SoftButton>
    </SoftBox>
  );
};

export default ItemCount;
