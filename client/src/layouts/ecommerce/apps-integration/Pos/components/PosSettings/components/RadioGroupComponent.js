import { FormControlLabel, Radio, RadioGroup } from '@mui/material';

export const RadioGroupComponent = ({ value, onChange, options, disabled }) => (
  <RadioGroup row value={value} onChange={(e) => onChange(e.target.value)}>
    {options.map((option) => (
      <FormControlLabel
        key={option?.value}
        value={option?.value}
        control={<Radio />}
        label={option?.label}
        disabled={disabled}
        className={disabled ? 'license-settings-radio-disabled' : ''}
      />
    ))}
  </RadioGroup>
);
