import { debounce } from 'lodash'; // Import lodash debounce
import { useCallback, useEffect, useState } from 'react';
import AddIcon from '../../../../../../../../../../assets/svg/add.svg';
import MinusIcon from '../../../../../../../../../../assets/svg/minus.svg';
import './index.css';

export default function CustomCount({
  initialValue = 0,   // Initial count value
  min = 0,            // Minimum value for the count
  max = 100000,       // Maximum value for the count
  step = 1,           // Step value for increment/decrement
  onChange,           // Callback function when value changes
  disabled,
  allowNegativeCalculation = false
}) {
  const [count, setCount] = useState(initialValue);

  // Update count state when initialValue prop changes
  useEffect(() => {
    setCount(Number(initialValue));
  }, [initialValue]);

  // Debounced change handler using lodash debounce
  const debouncedOnChange = useCallback(debounce((value) => {
    onChange && onChange(value); // Trigger callback if provided
  }, 300), [onChange]); // 300ms debounce delay

  // Handle increment
  const handleIncrement = () => {
    if (count < max) {
      const newValue = count + step;
      setCount(newValue);
      debouncedOnChange(newValue); // Use debounced function
    }
  };

  // Handle decrement
  const handleDecrement = () => {
    if (count > min || allowNegativeCalculation) {
      const newValue = count - step;
      setCount(newValue);
      debouncedOnChange(newValue); // Use debounced function
    }
  };

  // Handle manual input
  const handleInputChange = (e) => {
    const value = Number(e.target.value);
    if (value >= min && value <= max) {
      setCount(value);
      debouncedOnChange(value); // Use debounced function
    }
  };

  return (
    <div className="content-center">
      <div onClick={() => !disabled && handleDecrement()}>
        <img src={MinusIcon} alt="Decrease" className={`plus-minus-icon ${disabled ? 'disabled-input' : ''}`} />
      </div>
      <div className="count-input">
        <input
          type="number"
          className={`count-value ${disabled ? 'disabled-input' : ''}`}
          value={count}
          onChange={handleInputChange}
          min={min}
          max={max}
          disabled={disabled}
        />
      </div>
      <div onClick={() => !disabled && handleIncrement()}>
        <img src={AddIcon} alt="Increase" className={`plus-minus-icon ${disabled ? 'disabled-input' : ''}`} />
      </div>
    </div>
  );
}
