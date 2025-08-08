import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { CircularProgress } from '@mui/material';
import { format, parseISO } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import { getBatchesItemsLinkedWithSessions, stockAdjustment } from '../../../../../../../../config/Services';
import { useSnackbar } from '../../../../../../../../hooks/SnackbarProvider';
import CustomMobileButton from '../../../../../../Common/mobile-new-ui-components/button';
import CommonIcon from '../../../../../../Common/mobile-new-ui-components/common-icon-comp';
import ViewMore from '../../../../../../Common/mobile-new-ui-components/view-more';
import BatchCard from '../batchCard';

export default function BatchesList({ productSessionId, createdUidx, createdByName, fetchSessionProducts }) {
  const showSnackbar = useSnackbar();
  const [productInfo, setProductInfo] = useState({
    pageNumber: 0,
    pageSize: 10,
    total: 0,
    batches: [],
    sessionInfo: '',
  });
  const [viewBatches, setViewBatches] = useState(false);
  const [batchesLoader, setBatchesLoader] = useState(false);
  const [viewMoreLoader, setViewMoreLoader] = useState(false);
  const [showViewMore, setShowViewMore] = useState(true);

  //   filter
  const [batchNum, setBatchNum] = useState('');
  const reasonList = [
    { value: 'STOCK ADDITION', label: 'Stock Addition' },
    { value: 'STOCK REDUCTION', label: 'Stock Reduction' },
    { value: 'WASTAGE', label: 'Wastage' },
    { value: 'SHRINKAGE', label: 'Shrinkage' },
    { value: 'THEFT', label: 'Theft' },
    { value: 'STORE USE', label: 'Store use' },
    { value: 'DAMAGED', label: 'Damaged' },
    { value: 'EXPIRED', label: 'Expired' },
    { value: 'PRODUCT NOT FOUND', label: 'Product not found' },
    { value: 'OTHERS', label: 'Others' },
  ];
  const [mainSelectedInput, setMainSelectedInput] = useState();
  const [basicDetails, setBasicDetails] = useState({
    adjustmentReason: null,
  });
  const basicDetailsArray = useMemo(
    () => [
      {
        itemLabel: 'Adjustment Reason',
        itemValue: 'adjustmentReason',
        inputType: 'select',
        selectOptions: reasonList,
      },
    ],
    [],
  );

  const handleBasicDetails = (name, value, setSelectedDrawer) => {
    setBasicDetails((prev) => {
      const currentValue = prev[name];

      // Check if the value already exists in the state
      const valueExists = Array.isArray(currentValue)
        ? currentValue.some((item) => item?.value === value?.value)
        : currentValue === value;

      if (valueExists) {
        // If the value exists, simply set the field to null
        return { ...prev, [name]: null };
      } else {
        // If the value does not exist, add it
        return { ...prev, [name]: value };
      }
    });
  };
  
  //   filter
  const getBatchesData = async ({ pageNo, productSessionId }) => {
    try {
      // const response = await getSessionAndItemRelatedData(psid ? psid : selectedStockAdjustProductSessionId);
      // change productSession to session
      if (productInfo?.pageNumber === 0) {
        setBatchesLoader(true);
      }
      const payload = {
        productSessionId: productSessionId,
        pageNumber: pageNo ? pageNo : 0,
        pageSize: 5,
      };
      if (pageNo) {
        setProductInfo((prev) => ({ ...prev, pageNumber: pageNo }));
      }

      const response = await getBatchesItemsLinkedWithSessions(payload);
      if (response?.data?.data?.es) {
        showSnackbar(response?.data?.data?.message, 'error');
        return;
      }
      const showViewMoreButton =
        (payload.pageNumber + 1) * response?.data?.data?.pageSize < response?.data?.data?.total;

      setShowViewMore(showViewMoreButton);

      const approvalTime = response?.data?.data?.session?.approvalTime ?? 'NA';
      const mutatedData = response?.data?.data?.session?.batches?.map((item) => {
        return {
          ...item,
          adjustedQuantity: +((item?.userQuantity ?? 0) - (item?.imsQuantity ?? 0)).toFixed(2),
          reason: '',
          timelineData: [
            {
              timestamp: format(parseISO(item?.created), 'dd MMM, hh:mm a'),
              title: 'Quantity when job created',
              value: item?.imsQuantity,
              events: [
                { type: 'inwarded', value: item?.inwardBefore },
                { type: 'sold', value: item?.salesBefore },
                { type: 'transfer', value: item?.stockTransferBefore },
                { type: 'adjusted', value: item?.adjustmentBefore },
              ],
            },
            {
              timestamp: format(parseISO(item?.submitTime || item?.created), 'dd MMM, hh:mm a'),
              title: 'Count value',
              value: item?.userQuantity,
              events: [
                { type: 'inwarded', value: item?.inwardAfter },
                { type: 'sold', value: item?.salesAfter },
                { type: 'transfer', value: item?.stockTransferAfter },
                { type: 'adjusted', value: item?.adjustmentAfter },
              ],
            },
            {
              timestamp: approvalTime === 'NA' ? '-' : format(parseISO(approvalTime), 'dd MMM, hh:mm a'),
              title: 'Updated expected quantity',
              value: item?.updatedAvailableQuantity || '0',
              events: [],
            },
          ],
          status: item?.status,
          showTimeline: false,
        };
      });

      setProductInfo((prev) => ({
        ...prev,
        batches: payload.pageNumber === 0 ? mutatedData : [...prev.batches, ...mutatedData],
        sessionInfo: response?.data?.data?.session,
        total: response?.data?.data?.total,
      }));
      setBatchesLoader(false);
      setViewMoreLoader(false);
    } catch (err) {
      console.log(err);
      setBatchesLoader(false);
      setViewMoreLoader(false);
    }
  };

  const handleAdjustmentValueAndReason = ({ batchNumber, adjustmentValue, reason }) => {
    const updatedBatches = productInfo?.batches?.map((el) => {
      if (el?.batchNumber === batchNumber) {
        return {
          ...el,
          ...(adjustmentValue !== undefined ? { adjustedQuantity: adjustmentValue } : {}),
          ...(reason !== undefined ? { reason: reason } : {}),
        };
      }
      return el;
    });

    setProductInfo((prev) => ({
      ...prev,
      batches: updatedBatches,
    }));
  };

  const showBatches = (value) => {
    if (value) {
      getBatchesData({ productSessionId });
    }
    if (value === false) {
      setProductInfo((prev) => ({ ...prev, pageNumber: 0, batches: [], total: 0 }));
    }
    setViewBatches(value);
  };

  const viewMoreBatches = () => {
    setViewMoreLoader(true);
    getBatchesData({ pageNo: productInfo?.pageNumber + 1, productSessionId });
  };

  const handleUpdateAdjustInventory = async () => {
    for (const item of productInfo?.batches || []) {
      if (item?.variance) {
        if (!item?.adjustedQuantity) {
          showSnackbar('Please enter the adjusted quantity', 'warning');
          return;
        }
        if (!item?.reason?.value) {
          showSnackbar('Please select the reason', 'warning');
          return;
        }
      }
    }
    try {
      const payload = {
        productSessionId: productSessionId,
        batches: productInfo?.batches.map((item) => ({
          batchSessionId: item?.batchSessionId,
          adjustmentValue: Number(item?.adjustedQuantity),
          reason: item?.reason?.label || '',
        })),
        updatedBy: createdUidx,
        updatedByName: createdByName,
      };
      const response = await stockAdjustment(payload);
      if (response?.data?.data?.es === 0) {
        showSnackbar('Success', 'success');
        showBatches(viewBatches);
        fetchSessionProducts();
        return;
      }

      showSnackbar(response?.data?.data?.message, 'error');
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (batchNum) {
      if (basicDetails?.adjustmentReason) {
        handleAdjustmentValueAndReason({ batchNumber: batchNum, reason: basicDetails.adjustmentReason });
      }
    }
  }, [basicDetails]);

  return (
    <>
      <div className="stack-row-center-between width-100">
        <div className="flex-colum-align-start">
          <span className="bill-card-value">Batch Details</span>
        </div>
        <div className="flex-colum-align-end">
          <span className="bill-card-label">
            <CommonIcon
              icon={<ChevronDownIcon />}
              iconOnClickFunction={() => {
                showBatches(!viewBatches);
              }}
            />
          </span>
        </div>
      </div>

      {/* batches list */}
      {batchesLoader && !viewMoreLoader && (
        <div className="content-center w-100">
          <CircularProgress size={30} color="info" />
        </div>
      )}

      {/* batch card here  */}
      {productInfo?.batches?.length > 0 && viewBatches
        ? productInfo?.batches?.map((batch) => {
            const variance =
              batch?.stockInHand !== null && batch?.stockInHand !== undefined && batch?.stockInHand !== 'NA'
                ? +((batch?.stockInHand ?? 0) - (batch?.updatedAvailableQuantity ?? 0)).toFixed(2)
                : 'NA';
            return (
              <BatchCard
                key={batch?.batchSessionId}
                variance={variance}
                batch={batch}
                productInfo={productInfo}
                setProductInfo={setProductInfo}
                handleAdjustmentValueAndReason={handleAdjustmentValueAndReason}
                basicDetailsArray={basicDetailsArray}
                setMainSelectedInput={setMainSelectedInput}
                handleBasicDetails={handleBasicDetails}
                setBatchNum={setBatchNum}
              />
            );
          })
        : null}

      {productInfo?.batches?.length > 0 && viewBatches
        ? !productInfo?.batches?.some((item) => item?.reason === '') && (
            <div className="flex-colum-align-end w-100">
              <CustomMobileButton
                title="Approve"
                variant="green-D"
                onClickFunction={handleUpdateAdjustInventory}
              />
            </div>
          )
        : null}

      {productInfo?.batches?.length > 0 && showViewMore && viewBatches && (
        <ViewMore
          loading={viewMoreLoader}
          handleNextFunction={viewMoreBatches}
        />
      )}
    </>
  );
}
