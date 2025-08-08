import { Card } from '@mui/material';
import SoftBox from '../../../../../../../components/SoftBox';
import SoftTypography from '../../../../../../../components/SoftTypography';

const TaxInformationCard = ({ gstNumber, panNumber, gstTreatment, taxPreferance, billingCurrency }) => {
  const taxInfo = [
    { label: 'GST Number', value: gstNumber || 'N/A' },
    { label: 'Pan Number', value: panNumber || 'N/A' },
    { label: 'GST Treatment', value: gstTreatment || 'N/A' },
    { label: 'Tax Preference', value: taxPreferance || 'N/A' },
    { label: 'Billing Currency', value: billingCurrency ?? 'N/A' },
  ];

  return (
    <Card sx={{ overflow: 'visible' }}>
      <SoftBox py={2}>
        <SoftBox px={2}>
          <SoftTypography variant="h6" fontWeight="bold">
            Tax Information
          </SoftTypography>
        </SoftBox>
        <SoftBox pt={1.5} pb={2} px={2} lineHeight={1.25}>
          {taxInfo?.map(({ label, value }, index) => (
            <SoftBox key={index} sx={{ display: 'flex', flexDirection: 'column' }} mt={index > 0 ? 1 : 0}>
              <SoftTypography variant="button" fontWeight="bold" color="text">
                {label || 'N/A'}
              </SoftTypography>
              <SoftTypography variant="button" fontWeight="regular" color="text">
                {value || 'N/A'}
              </SoftTypography>
            </SoftBox>
          ))}
        </SoftBox>
      </SoftBox>
    </Card>
  );
};

export default TaxInformationCard;
