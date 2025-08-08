import { Box, Chip, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SoftBox from '../../../../components/SoftBox';
import Spinner from '../../../../components/Spinner';
import { filterBlog } from '../../../../config/Services';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import { useSnackbar } from '../../../../hooks/SnackbarProvider';
import { addNotificationToCookie, getReadNotifications, textFormatter } from '../../Common/CommonFunction';
import ViewMore from '../../Common/mobile-new-ui-components/view-more';
import notificationImg from './Images/notification.png';
import './Notificationsettings.css';
import { useSelector } from 'react-redux';
import { getUnreadNotificationsList, setUnReadNotification, setUnReadNotificationsList } from '../../../../datamanagement/Filters/notificationSlice';
import { useDispatch } from 'react-redux';
import SoftTypography from '../../../../components/SoftTypography';

export default function NotificationPage() {
  const dispatch = useDispatch();
  const showSnackbar = useSnackbar();
  const navigate = useNavigate();
  const unReadNotificationsList = useSelector(getUnreadNotificationsList);

  const [allLists, setAllLists] = useState([]);
  const [readNotifications, setReadNotifications] = useState('');
  const [pageState, setPageState] = useState({
    page: 1,
    pageSize: 10,
    totalResults: 0,
  });
  const [showViewMore, setShowViewMore] = useState(false);
  const [viewMoreLoader, setViewMoreLoader] = useState(false);

  const [isTabChanged, setIsTabChanged] = useState(false);
  const [selected, setSelected] = useState('announcement');

  const handleSelectTab = (value) => {
    setIsTabChanged(true);
    setSelected(value);
  };

  const goToClickedNotification = (element) => {
    addNotificationToCookie(element?.id);

    // Update Redux store
    const updatedNotificationsList = unReadNotificationsList.filter((notification) => notification.id !== element.id);
    dispatch(setUnReadNotificationsList(updatedNotificationsList));
    dispatch(setUnReadNotification(updatedNotificationsList.length));

    navigate(`/setting-help-and-support/Announcement/${element?.category}/${element?.subCategory}/${element?.id}`);
  };

  const fetchAnnouncementNotifications = async ({ pageNo }) => {
    try {
      setPageState((prev) => ({ ...prev, pageNo, loading: true }));
      
      // iso DateTime
      // const isoDateTimeNow = dayjs().toISOString();

      // convert date to epoch time
      const getEpoch = (date) => new Date(date).getTime();
      // Calculate current and future epoch dates
      const epochCurrentDate = getEpoch(dayjs().format('YYYY-MM-DD'));

      const payload = {
        page: pageNo,
        pageSize: pageState?.pageSize,
        listedOn: ['Announcement'],
        startExpiry: epochCurrentDate,
        createdDateSort: 'DESC'
      };

      setReadNotifications(getReadNotifications());
      const response = await filterBlog(payload);

      if (response?.data?.data?.es) {
        handleErrorState('Something went wrong');
        return;
      }

      const totalResults = response?.data?.data?.data?.totalResults || 0;
      const showViewMoreButton = pageNo * pageState?.pageSize < totalResults;
      setShowViewMore(showViewMoreButton);

      const data = response?.data?.data?.data?.data || [];
      setAllLists((prev) => [...prev, ...data]);

      setPageState((prev) => ({ ...prev, pageNo, loading: false }));
      setViewMoreLoader(false);
    } catch (err) {
      handleErrorState('Something went wrong');
    }
  };

  // Helper to handle error state
  const handleErrorState = (message) => {
    showSnackbar(message, 'error');
    setPageState((prev) => ({ ...prev, pageNo: 1, loading: false }));
    setAllLists([]);
    setViewMoreLoader(false);
  };

  useEffect(() => {
    fetchAnnouncementNotifications({ pageNo: 1 });
  }, []);

  return (
    <>
      <DashboardLayout>
        <DashboardNavbar prevLink={true} />
        <SoftBox className="search-bar-filter-and-table-container">
          <SoftBox className="search-bar-filter-container">
            <div className="content-left">
              <SoftTypography
                className={`notification-tabs ${selected === 'announcement' && 'active-tab'}`}
                onClick={() => handleSelectTab('announcement')}
              >
                Announcement
              </SoftTypography>
              <SoftTypography
                className={`notification-tabs ${selected === 'notification' && 'active-tab'}`}
                onClick={() => handleSelectTab('notification')}
              >
                Notification
              </SoftTypography>
            </div>
          </SoftBox>
          <Box sx={{ padding: '15px', height: '75vh', overflow: 'scroll' }}>
            {pageState.loading && !viewMoreLoader ? (
              <SoftBox
                sx={{
                  height: '70vh',
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Spinner />
              </SoftBox>
            ) : (
              <>
                {selected === 'announcement' && allLists?.length > 0 ? (
                  allLists?.map((element, innerIndex) => (
                    <Typography
                      fontSize="14px"
                      key={innerIndex}
                      py={1}
                      className="notification-row"
                      onClick={() => goToClickedNotification(element)}
                      sx={{ opacity: readNotifications.includes(element.id) ? 0.5 : 1 }}
                    >
                      {element.title ? textFormatter(element.title) : null}
                    </Typography>
                  ))
                ) : (
                  <Box sx={{ padding: '15px', height: '525px', textAlign: 'center' }}>
                    <img src={notificationImg} alt="" width={'400px'} />
                    <Typography fontSize="1rem">No Notifications yet</Typography>
                  </Box>
                )}
              </>
            )}

            <SoftBox className="content-right">
              {showViewMore && (
                <ViewMore
                  loading={viewMoreLoader}
                  handleNextFunction={() => {
                    setViewMoreLoader(true);
                    fetchAnnouncementNotifications({ pageNo: pageState.page + 1 });
                  }}
                />
              )}
            </SoftBox>
          </Box>
        </SoftBox>
      </DashboardLayout>
    </>
  );
}
