import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import Select, { components } from 'react-select';
import colors from 'assets/theme/base/colors';
import styles from 'components/SoftSelect/styles';

const SoftSelect = forwardRef(({ size, error, success, insideHeader, truncateLabels, ...rest }, ref) => {
  const { light } = colors;

  // Custom Option component
  const Option = (props) => {
    return (
      <components.Option {...props}>
        {rest.isMulti && (
          <input type="checkbox" checked={props.isSelected} onChange={() => null} style={{ marginRight: 8 }} />
        )}
        <label>{props.label}</label>
      </components.Option>
    );
  };

  // Custom MultiValue component to show each selected option as a "bubble"
  const MultiValue = (props) => {
    const maxLength = 1; // Maximum length for each selected value's label
    const { children, ...innerProps } = props;
    const truncatedLabel = truncateLabels && children.length > maxLength ? `${children.slice(0, maxLength)}` : children;

    return (
      <components.MultiValue {...innerProps}>
        <span>{truncatedLabel}</span>
      </components.MultiValue>
    );
  };

  return (
    <Select
      placeholder="Select"
      {...rest}
      ref={ref}
      isDisabled={rest.disabled}
      components={{
        Option,
        MultiValue, // Use the custom MultiValue component
      }}
      closeMenuOnSelect={!rest.isMulti}
      isMulti={rest.isMulti}
      hideSelectedOptions={false}
      styles={styles(size, error, success, insideHeader)}
      theme={(theme) => ({
        ...theme,
        colors: {
          ...theme.colors,
          primary25: light.main,
          primary: light.main,
        },
      })}
    />
  );
});

SoftSelect.defaultProps = {
  size: 'medium',
  error: false,
  success: false,
  truncateLabels: false, // Default to not truncating labels
};

SoftSelect.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  error: PropTypes.bool,
  success: PropTypes.bool,
  truncateLabels: PropTypes.bool, // New prop to control label truncation
};

export default SoftSelect;
