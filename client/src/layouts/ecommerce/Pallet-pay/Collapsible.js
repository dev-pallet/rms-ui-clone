import { Box } from '@mui/material';
import { forwardRef, memo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import SoftTypography from '../../../components/SoftTypography';

const nameInLowerCase = (str) => {
  return str
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/(?:^|\s)\S/g, function (a) {
      return a.toUpperCase();
    });
};

const Collapsible = forwardRef(function Collapsible({ data, title, handleToggle, isExpanded, currentHeight }, ref) {
  //   console.log('data==>', data);

  return (
    <Box
      className={`list-group-item ${isExpanded ? 'is-expanded' : ''}`}
      onClick={handleToggle}
      sx={{
        marginTop: '1rem',
      }}
    >
      <Box className="card-title">
        <h5 className="card-title-text">{title}</h5>
      </Box>
      <Box className="card-collapse" style={{ height: `${currentHeight}px`, zIndex: '2222' }}>
        <Box className="card-body" 
          ref={ref}
        >
          <Box className="debit-card-list">
            {data.length &&
              data.map((item, index) => (
                <Box className="debit-transaction-charges" key={uuidv4()}>
                  <Box className="transaction-description">
                    <Box className="paymentCard-logo">
                      <img src={item.logoUrl} className="payment-logo" />
                    </Box>
                    {parseInt(item.endAmount) === 2000 ? (
                      <SoftTypography className="transaction-rate">
                        {nameInLowerCase(item.cardType)} &nbsp;
                        {title} less than Rs 2000{' '}
                      </SoftTypography>
                    ) : (
                      <SoftTypography className="transaction-rate" sx={{ marginLeft: '2rem' }}>
                        {title} more than Rs 2000{' '}
                      </SoftTypography>
                    )}
                  </Box>
                  <Box className="transaction-charges">
                    <SoftTypography className="transaction-rate">{item.rate}%</SoftTypography>
                  </Box>
                </Box>
              ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
});

export default memo(Collapsible);
