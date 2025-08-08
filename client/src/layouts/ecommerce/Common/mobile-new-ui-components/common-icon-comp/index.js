import { CircularProgress } from '@mui/material';
import './common-icon-comp.css';
const CommonIcon = ({ icon, iconColor = null, iconOnClickFunction, loading, height = '1rem', width = '1rem' }) => {
  return (
    <div
      className="icon-parent-div"
      onClick={iconOnClickFunction}
      style={{
        color: iconColor && iconColor,
        height,
        width,
      }}
    >
      {loading ? (
        <CircularProgress sx={{ color: '#0562fb !important' }} className="icon-circular-loader-ros-app" />
      ) : (
        icon
      )}
    </div>
  );
};

export default CommonIcon;
