import './timeline.css';
import { CircularProgress } from '@mui/material';
import { isSmallScreen } from '../../CommonFunction';
import CommonTimeLineStatus from './statusRender';

const CommonTimeLine = ({ timelineArray, timelineLoader, purchaseId, timelineFunction }) => {
  const isMobileDevice = isSmallScreen();
  return (
    <div>
      {timelineLoader ? (
        <div className="timeline-circularprogress">
          <CircularProgress sx={{ color: '#0562fb !important' }} />
        </div>
      ) : (
        <div>
          {timelineArray?.map((timeline, index) => {
            return (
              <CommonTimeLineStatus
                statusName={timeline?.name}
                iconColor={timeline?.iconColor}
                userName={timeline?.userDesc}
                dateTime={timeline?.dateTime}
                reason={timeline?.reason}
                icon={timeline?.icon}
                index={index}
                length={timelineArray.length}
                view={timeline?.view}
                logType={timeline?.logType}
                quoteId={timeline?.quoteId}
                purchaseId={purchaseId}
                timelineFunction={timelineFunction}
                docId={timeline?.docId}
              />
            );
          })}
        </div>
      )}
      {timelineArray?.length === 0 && !timelineLoader && (
        <div className="no-timeline-data">No timeline data available</div>
      )}
    </div>
  );
};

export default CommonTimeLine;
