import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { AsyncPaginate } from 'react-select-async-paginate'; // Correct import
import colors from 'assets/theme/base/colors';
import styles from 'components/SoftSelect/styles'; // Ensure this path is correct

const SoftAsyncPaginate = forwardRef(({ size, error, success, insideHeader, ...rest }, ref) => {
  const { light } = colors;

  return (
    <AsyncPaginate
      placeholder="Select"
      {...rest}
      ref={ref}
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

SoftAsyncPaginate.defaultProps = {
  size: 'medium',
  error: false,
  success: false,
};

SoftAsyncPaginate.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  error: PropTypes.bool,
  success: PropTypes.bool,
};

export default SoftAsyncPaginate;
