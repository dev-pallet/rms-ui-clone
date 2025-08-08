import { Fragment } from 'react';
import './HorizontalTimeline.css';

const HorizontalTimeline = ({ data, status, isMobileDevice }) => {
  
  const timelineClass = `timeline-value ${isMobileDevice ? (status === 'COMPLETED' ? 'timeline-value-mobile-completed' : 'timeline-value-mobile') : ''}`;
  
  return (
    <div className={`timeline-container ${isMobileDevice ? 'timeline-container-w-460' : ''}`}>
      {data?.map((point, index) => {
        if (point?.title === 'Count value' && status === 'CREATED') {
          return null;
        }
        return (
          <Fragment key={index}>
            <div className="timeline-point">
              <div className="timeline-title">{point?.title}</div>
              <div className="timeline-timestamp">{point?.timestamp}</div>
              <div className="timeline-value-container">
                <div className={timelineClass}>{point?.value}</div>
                {index < data?.length - 1 && <div className="timeline-line"></div>}
              </div>
              <div className="timeline-events">
                {point?.events.map((event, eventIndex) => {
                  return (
                    event?.value && (
                      <span key={eventIndex} className="timeline-event">
                        <span className={`timeline-circle ${event?.type}`}></span>
                        {event?.value} {event?.type}
                      </span>
                    )
                  );
                })}{' '}
              </div>
            </div>
          </Fragment>
        );
      })}
    </div>
  );
};

export default HorizontalTimeline;
