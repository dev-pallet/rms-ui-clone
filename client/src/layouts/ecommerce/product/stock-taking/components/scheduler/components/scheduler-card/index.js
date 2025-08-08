import { ListItemIcon, Menu, MenuItem } from '@mui/material';
import { useMemo, useState } from 'react';
import ComplexProjectCard from '../../../../../../../../examples/Cards/ProjectCards/ComplexProjectCard';
import ContentPasteOffRoundedIcon from '@mui/icons-material/ContentPasteOffRounded';
import DeleteIcon from '@mui/icons-material/Delete';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';

export const SchedulerCard = ({ scheduler, handleScheduler }) => {
  const img =
    'https://varelahighschool.net/wp-content/uploads/2020/08/18-185839_plan-your-schedule-schedule-clipart.jpg';
  // ComplexProjectCard dropdown menu state
  const [slackBotMenu, setSlackBotMenu] = useState(null);
  // TeamProfileCard dropdown menu handlers
  const openSlackBotMenu = (event) => setSlackBotMenu(event.currentTarget);
  const closeSlackBotMenu = () => setSlackBotMenu(null);

  const categoryName = useMemo(() => {
    if (scheduler?.scMainCategory?.length) {
      return scheduler?.scMainCategory?.join(', ');
    }
    return 'No Category';
  }, [scheduler]);

  const renderMenu = (state, close) => (
    <Menu
      anchorEl={state}
      anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={Boolean(state)}
      onClose={close}
      keepMounted
    >
      <MenuItem onClick={close}>
        <ListItemIcon>
          <EditOutlinedIcon fontSize="small" />
        </ListItemIcon>
        Edit
      </MenuItem>
      <MenuItem onClick={close}>
        <ListItemIcon>
          <InfoRoundedIcon fontSize="small" />
        </ListItemIcon>
        Details
      </MenuItem>
      <MenuItem onClick={close}>
        <ListItemIcon>
          <DeleteIcon fontSize="small" />
        </ListItemIcon>
        Delete
      </MenuItem>
      <MenuItem onClick={close}>
        <ListItemIcon>
          <ContentPasteOffRoundedIcon fontSize="small" />
        </ListItemIcon>
        Deactivate
      </MenuItem>
    </Menu>
  );

  return (
    <ComplexProjectCard
      image={img}
      onClick={handleScheduler}
      title={categoryName}
      frequency={scheduler?.frequency || 'N/A'}
      itemPerSession={scheduler?.productPerSession || 'N/A'}
      totalLength={scheduler?.totalItems || 'N/A'}
      totalSession={scheduler?.totalSession || 'N/A'}
      description="3000 products available for this schedule"
      dateTime={scheduler?.startDate || 'N/A'}
      dropdown={{
        action: openSlackBotMenu,
        menu: renderMenu(slackBotMenu, closeSlackBotMenu),
      }}
    />
  );
};
