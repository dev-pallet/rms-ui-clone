import { useMemo } from 'react';
import './details-page-info.css';
import { textFormatter } from '../../../../Common/CommonFunction';
const DetailsPageEndInfo = ({ isPo, isPi, data, createdBy }) => {
  const infoArray = useMemo(
    () =>
      !isPo
        ? [
            { infoLabel: 'Expected delivery', infoValue: data?.expectedDeliveryDate },
            {
              infoLabel: 'Assigned to',
              infoValue:
                data?.assignedTo?.length > 1
                  ? `${textFormatter(data?.assignedTo?.[0]?.name)} + ${data?.assignedTo?.length - 1}`
                  : textFormatter(data?.assignedTo?.[0]?.name),
            },
            { infoLabel: 'Approved by', infoValue: data?.approvedBy },
            { infoLabel: 'Location', infoValue: data?.deliveryLocation },
            { infoLabel: 'Created by', infoValue: createdBy || 'NA' },
          ]
        : [
            { infoLabel: 'Expected delivery', infoValue: data?.expectedDeliveryDate },
            {
              infoLabel: 'Delivered on',
              infoValue: data?.deliveredOn,
            },
            { infoLabel: 'Delivery days', infoValue: data?.deliveryDays },
            { infoLabel: 'Invoice Number', infoValue: data?.invoiceRefNo?.[0] ?? 'NA' },
            { infoLabel: 'Location', infoValue: data?.deliveryLocation },
            { infoLabel: 'Created by', infoValue: createdBy || 'NA' },
          ],
    [data, createdBy],
  );

  return (
    <div className="details-page-info-main-div-ros-app">
      {infoArray?.map((item) => (
        <>
          <div className="width-100 stack-row-center-between">
            <span className="page-info-title">{item?.infoLabel}</span>
            <span className="page-info-value">{item?.infoValue}</span>
          </div>
        </>
      ))}
      <div className="width-100 stack-row-center-between estimated-value-details-info">
        <span className="estimated-total-details-info-title">Estimated Total</span>
        <span className="estimated-total-details-info-value">₹ {data?.estimatedCost}</span>
      </div>
    </div>
  );
};

export default DetailsPageEndInfo;
