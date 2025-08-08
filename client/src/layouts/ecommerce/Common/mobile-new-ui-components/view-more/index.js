import { ChevronDownIcon } from '@heroicons/react/24/outline';
import CommonIcon from '../common-icon-comp';
import './view-more.css';
import { CircularProgress } from '@mui/material';
const ViewMore = ({ loading, handleNextFunction }) => {
  return (
    <div className="view-more-listing-cards" onClick={handleNextFunction}>
      {loading ? (
        <CircularProgress size={20} sx={{ color: '#0562fb !important' }} />
      ) : (
        <>
          <span className="view-more-btn">View More</span>
          <CommonIcon icon={<ChevronDownIcon />} />
        </>
      )}
    </div>
  );
};

export default ViewMore;
