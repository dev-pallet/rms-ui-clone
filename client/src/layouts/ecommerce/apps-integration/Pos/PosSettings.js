import { CircularProgress, FormGroup } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SoftBox from '../../../../components/SoftBox';
import SoftButton from '../../../../components/SoftButton';
import SoftInput from '../../../../components/SoftInput';
import SoftTypography from '../../../../components/SoftTypography';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import { CheckboxWithDependents } from './components/PosSettings/components/CheckboxWithDependents';
import { LicenseSelectComponent } from './components/PosSettings/components/LicenseSelectComponent';
import { RadioGroupComponent } from './components/PosSettings/components/RadioGroupComponent';
import { authOptions, negativeInventoryOptions, otpOptions } from './components/PosSettings/config/posSettingsConfig';
import { usePosSettingsForm } from './components/PosSettings/hooks/usePosSettingsForm';
import './PosSettings.css';

const PosSettings = () => {
  const { formData, handleChange, handleSave, isFetchingConfig, isSavingConfig } = usePosSettingsForm();
  const navigate = useNavigate();

  if (isFetchingConfig) {
    return (
      <DashboardLayout>
        <DashboardNavbar />
        <SoftBox m={4} display="flex" justifyContent="center" alignItems="center">
          <CircularProgress sx={{ color: 'var(--blue) !important' }} size={40} />
        </SoftBox>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftTypography ml={3} mt={6} variant="h5" fontWeight="bold" gutterBottom>
        POS Settings
      </SoftTypography>

      <SoftBox m={4} sx={{ opacity: isSavingConfig ? '0.5' : '1' }}>
        <FormGroup>
          <CheckboxWithDependents
            checked={formData?.idleTimeout}
            onChange={(value) => handleChange('idleTimeout', value)}
            label="Enable idle timeout"
            disabled
          >
            <div className="terminal-settings-offline-input-container">
              <SoftTypography fontSize="14px" sx={{ whiteSpace: 'nowrap' }}>
                Custom Idle Timeout
              </SoftTypography>
              <SoftInput
                size="small"
                type="number"
                placeholder="Enter time"
                value={formData?.idleTimeoutValue}
                onChange={(e) => handleChange('idleTimeoutValue', e.target.value)}
              />
              <SoftTypography fontSize="14px">mins</SoftTypography>
            </div>
          </CheckboxWithDependents>

          <CheckboxWithDependents
            checked={formData?.offlinePos}
            onChange={(value) => handleChange('offlinePos', value)}
            label="Enable offline POS"
            disabled
          >
            <div>
              <div className="terminal-settings-offline-input-container">
                <SoftTypography fontSize="14px" sx={{ whiteSpace: 'nowrap' }}>
                  Maximum time a terminal can operate offline
                </SoftTypography>
                <SoftInput
                  size="small"
                  type="number"
                  placeholder="Enter time"
                  value={formData?.maxOfflineTime}
                  onChange={(e) => handleChange('maxOfflineTime', e.target.value)}
                />
                <SoftTypography fontSize="14px">mins</SoftTypography>
              </div>
              <LicenseSelectComponent
                selectedLicenses={formData?.offlinePosLicenses}
                onChange={(value) => handleChange('offlinePosLicenses', value)}
              />
            </div>
          </CheckboxWithDependents>

          <CheckboxWithDependents
            checked={formData?.dayClose}
            onChange={(value) => handleChange('dayClose', value)}
            label="Enable day close while offline"
            disabled
          />

          <CheckboxWithDependents
            checked={formData?.autoDayStart}
            onChange={(value) => handleChange('autoDayStart', value)}
            label="Enable automatic day start"
            disabled
          />

          <CheckboxWithDependents
            checked={formData?.reprintReceipt}
            onChange={(value) => handleChange('reprintReceipt', value)}
            label="Enable receipt reprint"
            disabled
          >
            <RadioGroupComponent
              value={formData?.reprintReceiptAuth}
              onChange={(value) => handleChange('reprintReceiptAuth', value)}
              options={authOptions}
              disabled
            />
          </CheckboxWithDependents>

          <CheckboxWithDependents
            checked={formData?.cartDeletion}
            onChange={(value) => handleChange('cartDeletion', value)}
            label="Allow entire cart deletion"
            disabled
          >
            <RadioGroupComponent
              value={formData?.cartDeletionAuth}
              onChange={(value) => handleChange('cartDeletionAuth', value)}
              options={authOptions}
            />
          </CheckboxWithDependents>

          <CheckboxWithDependents
            checked={formData?.salesReturns}
            onChange={(value) => handleChange('salesReturns', value)}
            label="Allow sales returns"
            disabled
          >
            <RadioGroupComponent
              value={formData?.salesReturnsAuth}
              onChange={(value) => handleChange('salesReturnsAuth', value)}
              options={authOptions}
            />
          </CheckboxWithDependents>

          <CheckboxWithDependents
            checked={formData?.loyalty}
            onChange={(value) => handleChange('loyalty', value)}
            label="Loyalty redemption"
            disabled
          >
            <RadioGroupComponent
              value={formData?.loyaltyOtp}
              onChange={(value) => handleChange('loyaltyOtp', value)}
              options={otpOptions}
              disabled
            />
            <CheckboxWithDependents
              checked={formData?.loyaltyAuth === 'ENABLED'}
              onChange={(value) => handleChange('loyaltyAuth', value ? 'ENABLED' : 'DISABLED')}
              label="Requires manager authentication"
              disabled
            />
          </CheckboxWithDependents>

          <CheckboxWithDependents
            checked={formData?.delivery}
            onChange={(value) => handleChange('delivery', value)}
            label="Enable delivery orders"
            disabled
          >
            <LicenseSelectComponent
              selectedLicenses={formData?.deliveryLicenses}
              onChange={(value) => handleChange('deliveryLicenses', value)}
            />
          </CheckboxWithDependents>

          <CheckboxWithDependents
            checked={formData?.secondaryScreen}
            onChange={(value) => handleChange('secondaryScreen', value)}
            label="Enable secondary screen"
            disabled
          >
            <LicenseSelectComponent
              selectedLicenses={formData?.secondaryScreenLicenses}
              onChange={(value) => handleChange('secondaryScreenLicenses', value)}
            />
          </CheckboxWithDependents>

          <CheckboxWithDependents
            checked={formData?.offlinePayments}
            onChange={(value) => handleChange('offlinePayments', value)}
            label="Enable offline payments"
            disabled
          >
            <LicenseSelectComponent
              selectedLicenses={formData?.offlinePaymentsLicenses}
              onChange={(value) => handleChange('offlinePaymentsLicenses', value)}
            />
          </CheckboxWithDependents>

          <CheckboxWithDependents
            checked={formData?.roundOff}
            onChange={(value) => handleChange('roundOff', value)}
            label="Payment round off rules"
            disabled
          />

          <CheckboxWithDependents
            checked={formData?.fifoGeneral}
            onChange={(value) => handleChange('fifoGeneral', value)}
            label="Merge batches and sell by FIFO for general products"
            disabled
          />

          <CheckboxWithDependents
            checked={formData?.fifoWeighing}
            onChange={(value) => handleChange('fifoWeighing', value)}
            label="Merge batches and sell by FIFO for weighing scale products"
            disabled
          />

          <CheckboxWithDependents
            checked={formData?.syncHoldOrders}
            onChange={(value) => handleChange('syncHoldOrders', value)}
            label="Sync hold orders to other active terminals"
            disabled
          />

          <CheckboxWithDependents
            checked={formData?.cashPayment}
            onChange={(value) => handleChange('cashPayment', value)}
            label="Allow cash payout from terminals for store expense management"
            disabled
          />

          <CheckboxWithDependents
            checked={formData?.sellPriceEdit}
            onChange={(value) => handleChange('sellPriceEdit', value)}
            label="Enable selling price edit in POS while billing"
          />

          <CheckboxWithDependents
            checked={formData?.mrpEdit}
            onChange={(value) => handleChange('mrpEdit', value)}
            label="Enable MRP edit in POS"
            disabled
          />

          <CheckboxWithDependents
            checked={formData?.batchEdit}
            onChange={(value) => handleChange('batchEdit', value)}
            label="Enable batch edit in POS"
            disabled
          />

          <CheckboxWithDependents
            checked={formData?.stockEdit}
            onChange={(value) => handleChange('stockEdit', value)}
            label="Enable stock edit in POS"
            disabled
          />

          <CheckboxWithDependents
            checked={formData?.negativeInventory}
            onChange={(value) => handleChange('negativeInventory', value)}
            label="Enable sales with negative inventory"
          >
            <div>
              <RadioGroupComponent
                value={formData?.negativeInventoryAuth}
                onChange={(value) => handleChange('negativeInventoryAuth', value)}
                options={authOptions}
                disabled
              />
              <div className="terminal-settings-row">
                <RadioGroupComponent
                  value={formData?.negativeInventoryConsume}
                  onChange={(value) => handleChange('negativeInventoryConsume', value)}
                  options={negativeInventoryOptions}
                  disabled
                />
                <CheckboxWithDependents
                  checked={formData?.negativeInventoryStockCount === 'ENABLED'}
                  onChange={(value) => handleChange('negativeInventoryStockCount', value ? 'ENABLED' : 'DISABLED')}
                  label="Create a stock count job"
                  disabled
                />
              </div>
            </div>
          </CheckboxWithDependents>

          <CheckboxWithDependents
            checked={formData?.holdCartRules}
            onChange={(value) => handleChange('holdCartRules', value)}
            label="Hold cart deletion rules"
            disabled
          />

          <CheckboxWithDependents
            checked={formData?.dayEndStockEntries}
            onChange={(value) => handleChange('dayEndStockEntries', value)}
            label="Enable end of day stock entries in POS "
            disabled
          />

          <CheckboxWithDependents
            checked={formData?.multipleBatchExpiry}
            onChange={(value) => handleChange('multipleBatchExpiry', value)}
            label="Show multiple batch expiry"
          />

          <CheckboxWithDependents
            checked={formData?.expiredItemIndicator}
            onChange={(value) => handleChange('expiredItemIndicator', value)}
            label="Show expired item indicator in cart"
            disabled
          />

          <CheckboxWithDependents
            checked={formData?.splitPayments}
            onChange={(value) => handleChange('splitPayments', value)}
            label="Enable split payments"
            disabled
          />

          <CheckboxWithDependents
            checked={formData?.sodexo}
            onChange={(value) => handleChange('sodexo', value)}
            label="Enable Sodexo payment method"
            disabled
          >
            <LicenseSelectComponent
              selectedLicenses={formData?.sodexoLicenses}
              onChange={(value) => handleChange('sodexoLicenses', value)}
            />
          </CheckboxWithDependents>

          <CheckboxWithDependents
            checked={formData?.dualDisplay}
            onChange={(value) => handleChange('dualDisplay', value)}
            label="Enable Dual Display"
            disabled
          >
            <LicenseSelectComponent
              selectedLicenses={formData?.dualDisplayLicenses}
              onChange={(value) => handleChange('dualDisplayLicenses', value)}
            />
          </CheckboxWithDependents>

          <CheckboxWithDependents
            checked={formData?.sellBelowPurchasePrice}
            onChange={(value) => handleChange('sellBelowPurchasePrice', value)}
            label="Allow selling products below purchase price"
            disabled
          />

          <CheckboxWithDependents
            checked={formData?.orgLogo}
            onChange={(value) => handleChange('orgLogo', value)}
            label="Display organization logo on Bill header"
            disabled
          />

          <CheckboxWithDependents
            checked={formData?.showFssai}
            onChange={(value) => handleChange('showFssai', value)}
            label="Display FSSAI Number on Tax Invoice"
            disabled
          />

          <CheckboxWithDependents
            checked={formData?.cartSequence}
            onChange={(value) => handleChange('cartSequence', value)}
            label="Enable Cart Sequence on Bills"
            disabled
          />

          <CheckboxWithDependents
            checked={formData?.showGst}
            onChange={(value) => handleChange('showGst', value)}
            label="Display GST Breakdown on Bills"
            disabled
          />

          <CheckboxWithDependents
            checked={formData?.totalSavings}
            onChange={(value) => handleChange('totalSavings', value)}
            label="Display Total Savings on Bills"
            disabled
          />

          <CheckboxWithDependents
            checked={formData?.footerText}
            onChange={(value) => handleChange('footerText', value)}
            label="Custom Text on Bill Footer"
            disabled
          />

          <CheckboxWithDependents
            checked={formData?.handheldPrinters}
            onChange={(value) => handleChange('handheldPrinters', value)}
            label="Enable integration with Handheld Thermal Printers"
            disabled
          />

          <CheckboxWithDependents
            checked={formData?.maxHoldCart}
            onChange={(value) => handleChange('maxHoldCart', value)}
            label="Maximum hold cart per session"
            disabled
          />
           <CheckboxWithDependents
            checked={formData?.holdCartVisibility}
            onChange={(value) => handleChange('holdCartVisibility', value)}
            label="Hold cart visibility across all active POS terminals"
            
          />

            <CheckboxWithDependents
            checked={formData?.roundOff}
            onChange={(value) => handleChange('roundOff', value)}
            label="Enable payment round off "
            
          />

             <CheckboxWithDependents
            checked={formData?.creditPayment}
            onChange={(value) => handleChange('creditPayment', value)}
            label="Enable credit payment"
            
          />

          <div className="terminal-settings-button-container">
            <SoftButton variant="outlined" size="small" color="primary" onClick={() => navigate(-1)}>
              Cancel
            </SoftButton>
            <SoftButton
              variant="contained"
              color="primary"
              size="small"
              disabled={isSavingConfig}
              onClick={() => handleSave(formData)}
            >
              {isSavingConfig ? <CircularProgress color="inherit" size={20} /> : 'Save'}
            </SoftButton>
          </div>
        </FormGroup>
      </SoftBox>
    </DashboardLayout>
  );
};

export default PosSettings;
