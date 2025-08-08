import './Statement.css';
import SoftBox from 'components/SoftBox';
export const Statement = () => {
  return (
    <SoftBox py={1} width={'100%'} className="statement-main-container">

      <SoftBox
        sx={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <img src="https://media.istockphoto.com/id/1356466745/vector/vector-illustration-coming-soon-banner-with-clock-sign.jpg?s=612x612&w=0&k=20&c=B3zjuvyrKLWPXmadC1TptchLH6et9P9-Nrr76Pia8Lo=" />
      </SoftBox>
    </SoftBox>
  );
};
