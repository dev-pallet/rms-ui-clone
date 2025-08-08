import SoftBox from '../../../../components/SoftBox';
import SoftTypography from '../../../../components/SoftTypography';

const NoDataFound = ({message}) => {
  return (
    <SoftBox className="no-data-found">
      <SoftTypography fontSize="14px">{message}</SoftTypography>
    </SoftBox>
  );
};

export default NoDataFound;
