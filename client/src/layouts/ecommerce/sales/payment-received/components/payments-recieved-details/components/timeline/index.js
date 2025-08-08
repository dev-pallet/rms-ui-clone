/**
=========================================================
* Soft UI Dashboard PRO React - v4.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-pro-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Grid from '@mui/material/Grid';

// Soft UI Dashboard PRO React components
import SoftBox from 'components/SoftBox';

// Soft UI Dashboard PRO React example components
import TimelineItem from 'examples/Timeline/TimelineItem';
import TimelineList from 'examples/Timeline/TimelineList';

// Data
// import timelineData from "layouts/pages/projects/timeline/data/timelineData";
import timelineData from './data/timelineData';



const Timeline = () => {
  const renderTimelineItems = timelineData.map(
    ({ color, icon, title, dateTime, description, badges, lastItem }) => (
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
    )
  );

  return (
   
    <SoftBox my={3}>
      <Grid container spacing={3}>
        <Grid item xs={12} lg={12}>
          <TimelineList title="Track Order">{renderTimelineItems}</TimelineList>            
        </Grid>
      </Grid>
    </SoftBox>

  );
};

export default Timeline;
