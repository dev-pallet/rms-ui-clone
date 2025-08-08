import TimelineItem from '../../../../../../../../examples/Timeline/TimelineItem';
import TimelineList from '../../../../../../../../examples/Timeline/TimelineList';
import timelineData from './data/timelineData';

export const StockTimeLine = () => {
  const renderTimelineItems = timelineData.map(({ color, icon, title, dateTime, description, badges, lastItem }) => (
    <TimelineItem
      key={title + color}
      color={color}
      icon={icon}
      title={title}
      dateTime={dateTime}
      description={description}
      badges={badges}
      lastItem={lastItem}
    />
  ));

  return <TimelineList title="Timeline with dotted line">{renderTimelineItems}</TimelineList>;
};
