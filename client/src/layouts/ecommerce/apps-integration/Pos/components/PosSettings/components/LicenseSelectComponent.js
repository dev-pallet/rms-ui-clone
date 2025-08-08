import SoftSelect from '../../../../../../../components/SoftSelect';
import SoftTypography from '../../../../../../../components/SoftTypography';
import { useSoftUIController } from '../../../../../../../context';

export const LicenseSelectComponent = ({ onChange, selectedLicenses = [] }) => {
  const [controller] = useSoftUIController();
  const { licenses } = controller;

  return (
    <div className="license-select-container">
      <SoftTypography fontSize="14px">Choose terminals to apply this setting to:</SoftTypography>
      <SoftSelect
        isMulti
        options={licenses}
        value={selectedLicenses}
        onChange={(value) => onChange(value)}
        size="small"
      />
    </div>
  );
};
