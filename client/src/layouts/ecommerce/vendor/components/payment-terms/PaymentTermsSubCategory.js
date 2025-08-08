import './payment-terms.css';
import { Checkbox, InputLabel } from '@mui/material';
import React from 'react';

const PaymentTermsSubCategory = ({ returnType, subCategoryCheckBoxValue, setSubCategoryCheckBoxValue , disableEdit = true }) => {
  const handleSubCategoryOnClick = (subCategory) => {
    const newValue = !subCategoryCheckBoxValue[returnType][subCategory];
    setSubCategoryCheckBoxValue((prevState) => ({
      ...prevState,
      [returnType]: {
        ...prevState[returnType],
        [subCategory]: newValue,
      },
    }));
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '30px', marginLeft: '50px', flexWrap: 'wrap' }}>
      {Object.keys(subCategoryCheckBoxValue[returnType]).map((subCategory) => (
        <div key={subCategory} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Checkbox
            disabled={!disableEdit}
            checked={subCategoryCheckBoxValue[returnType][subCategory]}
            onChange={() => handleSubCategoryOnClick(subCategory)}
          />
          <InputLabel className="inputLabelTextStyle">{subCategory?.replace(/_/g, ' ')}</InputLabel>
        </div>
      ))}
    </div>
  );
};

export default PaymentTermsSubCategory;
