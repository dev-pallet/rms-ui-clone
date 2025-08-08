import React from 'react';
import SoftBox from '../../../../../../components/SoftBox';
import { Card, Grid, InputLabel } from '@mui/material';
import SoftInput from '../../../../../../components/SoftInput';

function SalaryDetails({ ctc, setCtc, monthlyIncome, setMontlyIncome, incomeBreakUp, setIncomeBreakup }) {
  const inputLabelStyle = { fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    switch (name) {
      case 'ctc':
        setCtc(value);
        break;
      case 'monthly':
        setMontlyIncome(value);
        break;
      case 'breakup':
        setIncomeBreakup(value);
        break;
      default:
        break;
    }
  };
  const salaryDetails = [
    { id: 'ctc', label: 'CTC', type: 'input', value: ctc, onChange: handleInputChange },
    { id: 'monthly', label: 'Monthly', type: 'input', value: monthlyIncome, onChange: handleInputChange },
    { id: 'breakup', label: 'Break Up', type: 'input', value: incomeBreakUp, onChange: handleInputChange },
  ];

  return (
    <Card sx={{ padding: '15px', overflow: 'visible' }}>
      <SoftBox sx={{ flexGrow: 1, marginLeft: '20px' }}>
        <InputLabel style={{ fontWeight: 'bold' }}>Salary details</InputLabel>

        <Grid container mt={1} spacing={2} direction="row" justifyContent="space-between" alignItems="center">
          {salaryDetails?.map((field, index) => (
            <Grid item xs={12} md={field?.id == 'breakup' ? 12 : 6} lg={field?.id == 'breakup' ? 12 : 6} key={index}>
              <SoftBox>
                <InputLabel sx={inputLabelStyle} >
                  {field?.label}
                </InputLabel>
                <SoftInput
                  name={field?.id}
                  value={field?.value}
                  onChange={field?.onChange}
                  className="select-box-category"
                  size={field?.id == 'breakup' ? 'large' : 'small'}
                />
              </SoftBox>
            </Grid>
          ))}
        </Grid>
      </SoftBox>
    </Card>
  );
}

export default SalaryDetails;
