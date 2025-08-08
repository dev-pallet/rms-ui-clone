import { Drawer, IconButton } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import './mobile-drawer.css';

const MobileDrawerCommon = ({ anchor, paperProps, children, drawerOpen, drawerClose, overflowHidden, ...rest }) => {
  return (
    <Drawer
      anchor={anchor}
      open={drawerOpen}
      onClose={drawerClose}
      PaperProps={{
        sx: {
          ...paperProps,
          borderRadius: '10px 10px 0 0',
          backgroundColor: 'transparent !important',
          backdropFilter: 'none !important',
          boxShadow: 'none !important',
          margin: '0px',
          width: '100%  !important',
          height: 'auto',
        },
      }}
      {...rest}
    >
      <div className="common-drawer-close">
        <div className="close-icon-mobile-drawer" onClick={drawerClose}>
          <CloseRoundedIcon sx={{ color: 'white !important' }} />
        </div>
        <div className="children-div-mobile-drawer">{children}</div>
      </div>
    </Drawer>
  );
};

export default MobileDrawerCommon;
