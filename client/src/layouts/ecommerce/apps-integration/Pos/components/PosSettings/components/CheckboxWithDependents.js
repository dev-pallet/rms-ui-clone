import { Checkbox, FormControlLabel } from '@mui/material';

export const CheckboxWithDependents = ({ checked, onChange, label, disabled, children }) => (
  <>
    <FormControlLabel
      control={<Checkbox checked={checked} onChange={(e) => onChange(e.target.checked)} />}
      label={label}
      disabled={disabled}
      className={disabled ? 'license-settings-checkbox-disabled' : ''}
    />
    {checked && children && <div className="license-settings-secondary-container">{children}</div>}
  </>
);
