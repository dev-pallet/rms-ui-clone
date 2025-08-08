import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import HorizontalTimeline from '../../../../../../../../components/HorizontalTimeline/HorizontalTimeline';
import { isSmallScreen } from '../../../../../../Common/CommonFunction';
import MultiTypeInput from '../../../../../../Common/mobile-new-ui-components/multi-type-input';
import CustomCount from '../../../../components/product-details/components/countmodal/components/custom-count';

export default function BatchCard({
  variance,
  batch,
  handleAdjustmentValueAndReason,
  basicDetailsArray,
  setMainSelectedInput,
  handleBasicDetails,
  setBatchNum,
}) {
  const isMobileDevice = isSmallScreen();

  return (
    <div className={`listing-card-main-bg ${batch?.status === 'COMPLETED' && 'count-completed'}`}>
      <Accordion className="stock-count-accordion-mobile w-100">
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          className={`stock-batch-accordion-summary-mobile ${batch?.status === 'COMPLETED' && 'count-completed'}`}
          sx={{ '& .MuiAccordionSummary-content': { margin: 0 } }}
        >
          <div className="stack-row-center-between width-100">
            <span className="bill-card-value">Batch ID: {batch?.batchNumber || 'NA'}</span>
            <span className="bill-card-value">MRP: ₹{batch?.mrp || 'NA'}</span>
          </div>
        </AccordionSummary>
        <AccordionDetails sx={{ padding: '0 !important' }}>
          <div className={`stock-batch-accordion-item-mobile ${batch?.status === 'COMPLETED' && 'count-completed'}`}>
            <hr className="horizontal-line-app-ros" />
            <div className="stack-row-center-between width-100">
              <div className="flex-colum-align-start">
                <span className="bill-card-label">Inventory Location</span>
                <span className="bill-card-value">{batch?.layoutName || 'NA'}</span>
              </div>
              <div className="flex-colum-align-end">
                <span className="bill-card-label">Expected Count</span>
                <span className="bill-card-value">{batch?.imsQuantity ?? 'NA'}</span>
              </div>
            </div>

            <div className="stack-row-center-between width-100">
              <div className="flex-colum-align-start">
                <span className="bill-card-label">Primary Count</span>
                <span className="bill-card-value">{batch?.userQuantity ?? 'NA'}</span>
              </div>
              <div className="flex-colum-align-end">
                <span className="bill-card-label">Variance In Quantity</span>
                <span className="bill-card-value">
                  {batch?.varianceCount} {batch?.unitOfMeasurement ?? ''}
                </span>
              </div>
            </div>

            <div className="stack-row-center-between width-100">
              <div className="flex-colum-align-start">
                <span className="bill-card-label">Stock In Hand</span>
                <span className="bill-card-value">
                  {batch?.unitOfMeasurement !== 'kg' ? batch?.stockInHand ?? 'NA' : batch?.stockInHand?.toFixed(2) ?? 'NA'}{' '}
                  {/* {+((+batch.imsQuantity ?? 0) + +batch.adjustedQuantity).toFixed(2)}{' '} */}
                  {batch?.unitOfMeasurement || 'NA'}
                </span>
              </div>
            </div>

            <div className="w-100 ">
              <span className="bill-card-label">Timeline</span>
              <div className="w-100 overflow-scroll overflow-scroll-width-none">
                <HorizontalTimeline data={batch?.timelineData} status={batch?.status} isMobileDevice={isMobileDevice} />
              </div>
            </div>
            {batch?.status !== 'COMPLETED' && (
              <>
                <hr className="horizontal-line-app-ros" />
                <div className="content-space-between-align-top width-100 counter-gap">
                  <div className="flex-colum-align-start" style={{ gap: '0.35rem' }}>
                    <span className="bill-card-label">Available Units</span>
                    <CustomCount
                        initialValue={batch?.adjustedQuantity ? batch?.adjustedQuantity : batch?.userQuantity}
                      // initialValue={batch?.userQuantity}
                      allowNegativeCalculation
                      onChange={(newValue) => {
                        handleAdjustmentValueAndReason({ batchNumber: batch?.batchNumber, adjustmentValue: newValue });
                      }}
                    />
                  </div>
                  <div className="flex-colum-align-start" onClick={() => setBatchNum(batch?.batchNumber)}>
                    {basicDetailsArray?.map((el) => (
                      <MultiTypeInput
                        key={el?.itemLabel}
                        inputLabel={el?.itemLabel}
                        value={batch?.reason}
                        inputType={el?.inputType}
                        inputValue={el?.itemValue}
                        placeholder={el?.itemLabel}
                        selectOptions={el?.selectOptions}
                        onChangeFunction={handleBasicDetails}
                        setMainSelectedInput={setMainSelectedInput}
                        customCss={{
                          inputLabel: 'bill-card-label padding-left-0_5rem',
                          multiSelectInput: 'bg-gainsboro padding-0_5rem',
                          arrowIcon: 'right-0'
                        }}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
