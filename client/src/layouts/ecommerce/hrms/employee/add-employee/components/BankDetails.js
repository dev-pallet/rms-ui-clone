import { Card, Grid, InputLabel } from '@mui/material';
import SoftBox from '../../../../../../components/SoftBox';
import SoftInput from '../../../../../../components/SoftInput';

function BankDetails({
  accountName,
  setAccountName,
  bankName,
  setBankName,
  accountNumber,
  setAccountNumber,
  ifscCode,
  setIfscCode,
  bankingType,
  setBankingType,
}) {
  const inputLabelStyle = { fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'accountName':
        setAccountName(value);
        break;
      case 'bankName':
        setBankName(value);
        break;
      case 'accountNumber':
        setAccountNumber(value);
        break;
      case 'ifscCode':
        setIfscCode(value);
        break;
      case 'bankingType':
        setBankingType(value);
        break;
      default:
        break;
    }
  };

  const formFields = [
    { id: 'accountName', label: 'Account Name', onChange: handleInputChange, value: accountName },
    { id: 'bankName', label: 'Bank Name', onChange: handleInputChange, value: bankName },
    { id: 'accountNumber', label: 'Account Number', onChange: handleInputChange, value: accountNumber },
    { id: 'ifscCode', label: 'IFSC code', onChange: handleInputChange, value: ifscCode },
    { id: 'bankingType', label: 'Banking Type', onChange: handleInputChange, value: bankingType },
  ];

  return (
    <Card sx={{ padding: '15px', overflow: 'visible' }}>
      <SoftBox sx={{ flexGrow: 1, marginLeft: '20px' }}>
        <InputLabel style={{ fontWeight: 'bold' }}>Bank Details</InputLabel>

        <Grid container mt={1} spacing={2} direction="row" justifyContent="space-between" alignItems="center">
          {formFields?.map((field, index) => (
            <Grid item xs={12} md={12} lg={12} key={index}>
              <SoftBox>
                <InputLabel sx={inputLabelStyle}>{field?.label}</InputLabel>
                <SoftInput
                  name={field?.id}
                  value={field?.value}
                  onChange={field?.onChange}
                  className="select-box-category"
                  size="small"
                />
              </SoftBox>
            </Grid>
          ))}
        </Grid>
      </SoftBox>
    </Card>
  );
}

export default BankDetails;
