import CustomMobileInput from '../../../../../../Common/mobile-new-ui-components/common-input';
import '../../po-mobile-screen.css';
export const MoPoProductFooter = ({
  price,
  amount,
  row,
  index,
  onInputValueChange,
  isApproved,
  quantityLeft,
  quantityAccepted,
}) => (
  <div className="mob-prod-footer-box">
    <div>
      <div className="mob-po-prod-rate-qty-head">Rate</div>
      <CustomMobileInput
        type="number"
        disabled={isApproved === 'N'}
        value={price || ''}
        onChange={(e) => onInputValueChange(e.target.value, 'previousPurchasePrice', index)}
      />
    </div>
    <div>
      <div className="mob-po-prod-rate-qty-head">Fulfilling Qty</div>
      <CustomMobileInput
        type="number"
        disabled={isApproved === 'N' || quantityLeft === 0 ? true : false}
        value={
          quantityLeft === 0
            ? quantityLeft
            : quantityAccepted === 0 || quantityAccepted === null
            ? quantityLeft
            : quantityAccepted
        }
        onChange={(e) => onInputValueChange(e.target.value, 'quantityAccepted', index)}
      />
    </div>
    <div>
      <div className="mob-po-prod-rate-qty-head" style={{ marginBottom: '8px' }}>
        Amount
      </div>
      <div className="product-card-otherData mob-po-product-other-data">₹ {amount ?? 0}</div>
    </div>
  </div>
);
