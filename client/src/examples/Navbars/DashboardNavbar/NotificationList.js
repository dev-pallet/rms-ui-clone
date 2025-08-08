import InfoIcon from '@mui/icons-material/InfoOutlined';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addNotificationToCookie } from '../../../layouts/ecommerce/Common/CommonFunction';
import CampaignIcon from '@mui/icons-material/Campaign';
import './dash.css';

const NotificationsListHeader = ({ unReadNotificationsList, onNotificationRead  }) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToClickedNotification = (element) => {
    addNotificationToCookie(element?.id);
    onNotificationRead(element?.id); // Notify Notification in header about the read notification
    navigate(`/setting-help-and-support/Announcement/${element?.category}/${element?.subCategory}/${element?.id}`);
  };

  useEffect(() => {
    if (unReadNotificationsList?.length <= 1) return; // No animation if only one item

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % unReadNotificationsList?.length);
    }, 5000); // Change notification every 5 seconds

    return () => clearInterval(interval);
  }, [unReadNotificationsList]);

  return (
    <div className="notification-wrapper content-right">
      {unReadNotificationsList?.map((element, index) => (
        <div
          key={index}
          className={`notification-item ${index === currentIndex ? 'visible' : 'hidden'}`}
          style={{
            position: 'absolute',
          }}
          onClick={() => {
            goToClickedNotification(element);
          }}
        >
          {element?.title} <CampaignIcon sx={{ width: '20px', height: '20px', marginTop: '-3px' }} /> 
        </div>
      ))}
    </div>
  );
};

export default NotificationsListHeader;
