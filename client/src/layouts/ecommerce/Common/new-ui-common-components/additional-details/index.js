import './additional-details.css';
import { useLocation } from 'react-router-dom';
import AdditionalDetTab from './components/additional-details-tab';
import { isSmallScreen } from '../../CommonFunction';
import { Divider } from '@mui/material';

const AdditionalDetails = ({ additionalDetailsArray, additionalDetails }) => {
  const location = useLocation();
  const isMobileDevice = isSmallScreen();
  return (
    <div
      className="component-bg-br-sh-p additional-details-main-container"
      style={{
        gridTemplateColumns: location.pathname.includes('/sales/returns/') ? 'repeat(5, 1fr)' : `repeat(${additionalDetailsArray?.length}, 1fr)`,
      }}
    >
      {additionalDetailsArray?.map((info, index) => (
        <>
          <AdditionalDetTab
            tabData={info}
            index={index}
            length={additionalDetailsArray.length - 1}
            additionalDetails={additionalDetails}
          />
          {index !== additionalDetailsArray.length - 1 && isMobileDevice && (
            <Divider
              orientation="vertical"
              flexItem
              sx={{
                margin: 'auto 0 !important',
                backgroundImage: 'none !important',
                width: '0.1rem',
                height: '2.5rem',
                backgroundColor: '#BDBDBD !important',
                opacity: 1,
              }}
            />
          )}
        </>
      ))}
    </div>
  );

  
};

export default AdditionalDetails;
