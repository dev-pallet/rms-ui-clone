import { Card, Grid, InputLabel } from '@mui/material';
import SoftBox from '../../../../../../components/SoftBox';
import SoftInput from '../../../../../../components/SoftInput';

function LeaveDetails({ earnedLeaves, setEarnedLeaves, casualLeaves, setCasualLeaves, sickLeaves, setSickLeaves }) {
  const inputLabelStyle = { fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    switch (name) {
      case 'earnedLeaves':
        setEarnedLeaves(+value);
        break;
      case 'casualLeaves':
        setCasualLeaves(+value);
        break;
      case 'sickLeaves':
        setSickLeaves(+value);
        break;
      default:
        break;
    }
  };

  const leaveDetails = [
    { id: 'earnedLeaves', label: 'Earned Leaves', onChange: handleInputChange, value: earnedLeaves },
    { id: 'casualLeaves', label: 'Casual Leaves', onChange: handleInputChange, value: casualLeaves },
    { id: 'sickLeaves', label: 'Sick Leaves', onChange: handleInputChange, value: sickLeaves },
  ];
  return (
    <Card sx={{ padding: '15px', overflow: 'visible' }}>
      <SoftBox sx={{ flexGrow: 1, marginLeft: '20px' }}>
        <InputLabel style={{ fontWeight: 'bold' }}>Allot Leaves</InputLabel>
        <Grid container mt={1} spacing={2} direction="row" justifyContent="space-between" alignItems="center">
          {leaveDetails?.map((field, index) => (
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

export default LeaveDetails;
