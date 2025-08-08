import { ArrowDownIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import './multi-type-input.css';
import CommonIcon from '../common-icon-comp';
import MobileDrawerCommon from '../../MobileDrawer';
import { useEffect, useRef, useState } from 'react';
import CommonStaticDatePicker from '../static-datepicker';
import MobileSearchBar from '../mobile-searchbar';
import { CircularProgress } from '@mui/material';
import CustomMobileButton from '../button';
const MultiTypeInput = ({
  inputLabel,
  inputValue,
  inputType,
  selectOptions,
  value,
  onChangeFunction,
  placeholder,
  loading,
  setMainSelectedInput,
  disablePast,
  customCss
}) => {
  const [selectDrawer, setSelectDrawer] = useState(false);
  const [selectOptionsCopy, setSelectOptionsCopy] = useState([...(selectOptions || [])]);
  const [searchedValue, setSearchedValue] = useState('');
  const [inputRefs, setInputRef] = useState('');
  const inputRef = useRef();

  useEffect(() => {
    if (selectOptions && (inputType === 'select' || inputType === 'multi-select')) {
      setSelectOptionsCopy([...(selectOptions || [])]);
    }
  }, [selectOptions, inputType]);

  const renderValue = () => {
    if (Array.isArray(value) && value?.length) {
      const valueCopy = [...value];
      let newValue =
        valueCopy?.length === 1
          ? valueCopy?.[0]?.label
          : valueCopy?.reverse()?.[0]?.label + ` + ${valueCopy?.length - 1} Selected`;
      return newValue;
    } else {
      return value?.label;
    }
  };

  const renderSelectedValue = (item) => {
    let isSelected;
    if (Array.isArray(value)) {
      isSelected = value?.some((valueItem) => valueItem?.value === item?.value);
    } else {
      isSelected = value?.value === item?.value;
    }
    return isSelected;
  };

  const handleInputChange = (e) => {
    setMainSelectedInput(inputValue);
    if (inputType !== 'text') {
      setSelectDrawer(true);
    } else if (inputType !== 'date') {
      onChangeFunction(inputValue, e.target.value);
    }

    if (inputType !== 'text') {
      inputRef.current.blur();
    }
  };

  const handleDateFunction = (value) => {
    const dateItem = { value: value, label: value };
    onChangeFunction(inputValue, dateItem);
  };

  const updatingInputRedf = (value) => {
    setInputRef(value);
  };

  const renderInput = () => {
    switch (inputType) {
      case 'text':
        return (
          <input
            value={renderValue()}
            type="text"
            placeholder={placeholder}
            name={inputLabel}
            className="multi-select-input"
            onClick={(e) => handleInputChange(e)}
            ref={inputRef}
          />
        );
      case 'select':
        return (
          <input
            value={renderValue()}
            placeholder={placeholder}
            name={inputLabel}
            className={`multi-select-input ${customCss?.multiSelectInput || ''}`}
            onClick={(e) => handleInputChange(e)}
            ref={inputRef}
          />
        );
      case 'multi-select':
        return (
          <input
            value={renderValue()}
            name={inputLabel}
            placeholder={placeholder}
            className="multi-select-input"
            onClick={(e) => handleInputChange(e)}
            ref={inputRef}
          />
        );
      case 'date':
        return (
          <input
            value={renderValue()}
            name={inputLabel}
            placeholder={placeholder}
            className="multi-select-input"
            onClick={(e) => handleInputChange(e)}
            ref={inputRef}
          />
        );
      default:
        return;
    }
  };

  const handleSelectedValue = (item) => {
    onChangeFunction(inputValue, item, setSelectDrawer);
    if (inputType !== 'text' || inputType !== 'date') {
      setSelectOptionsCopy([...(selectOptions || [])]);
      setSearchedValue('');
    }
  };

  const handleOptionFilter = (e) => {
    // current user api is not paginated thats why filtering from ui side
    const value = e.target.value?.toLowerCase();
    setSearchedValue(e.target.value);
    const filteredItems = selectOptions?.filter((option) => option?.label?.toLowerCase()?.includes(value));
    setSelectOptionsCopy(filteredItems);
  };

  return (
    <div className="multi-type-input-main-div">
      <span className={customCss ? customCss?.inputLabel : `multi-type-input-label`}>{inputLabel}</span>
      <div className="width-100 main-input-div">
        {renderInput()}
        {(inputType === 'select' || inputType === 'multi-select') && (
          <div className={`multi-select-arrow-icon ${customCss?.arrowIcon || ''}`}>
            <CommonIcon icon={<ChevronDownIcon />} />
          </div>
        )}
      </div>
      {inputType === 'select' || inputType === 'multi-select' ? (
        <MobileDrawerCommon anchor="bottom" drawerOpen={selectDrawer} drawerClose={() => setSelectDrawer(false)}>
          <div className="select-options-parent-div">
            <span className="select-option-main-title">{inputLabel}</span>
            <MobileSearchBar value={searchedValue} placeholder={'Search...'} onChangeFunction={handleOptionFilter} />
            <div
              className={`select-options-main-div`}
              style={{ height: selectOptions?.length > 10 ? '350px' : 'auto' }}
            >
              {loading ? (
                <div
                  className="width-100 stack-row-center-between"
                  style={{ padding: '1rem', justifyContent: 'center' }}
                >
                  <CircularProgress size={30} sx={{ color: '#0562fb !important' }} />
                </div>
              ) : (
                selectOptionsCopy?.map((item) => (
                  <div className={`select-option-div`} onClick={() => handleSelectedValue(item)}>
                    <CustomMobileButton
                      variant={`${renderSelectedValue(item) ? 'black-P' : 'transparent'}`}
                      title={item?.label}
                      width="100%"
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </MobileDrawerCommon>
      ) : (
        <CommonStaticDatePicker
          openDatePicker={selectDrawer}
          onCloseFunction={() => setSelectDrawer(false)}
          datePickerOnAccpetFunction={handleDateFunction}
          value={renderValue()}
          disablePast={disablePast}
        />
      )}
    </div>
  );
};

export default MultiTypeInput;
