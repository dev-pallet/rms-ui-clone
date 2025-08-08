import './layout-card.css';
import { deleteLayout } from '../../../../../../../config/Services';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import React, { useState } from 'react';
import SoftTypography from 'components/SoftTypography';
import Swal from 'sweetalert2';
import layoutImg from './layout-img1.jpg';

const LayoutCard = ({ layout, totalLayouts, setTotalLayouts }) => {
  const navigate = useNavigate();

  const user_details = localStorage.getItem('user_details');
  const uidx = JSON.parse(user_details).uidx;
  const locId = localStorage.getItem('locId');

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEditLayouts = (layout) => {
    localStorage.setItem('layout_id', layout.layoutId);
    localStorage.setItem('layout_name', layout.layoutName);
    navigate('/setting/edit-layouts/');
  };

  const handleViewHierarchy = () => {
    // navigate(`/setting/layout/${layout.layoutId}`);
    localStorage.setItem('layout_id', layout.layoutId);
    localStorage.setItem('layout_name', layout.layoutName);
    // navigate(`/setting/layout/hierarchy`);
    navigate('/setting/layout-table');
  };

  const handleDelete = () => {
    // console.log('layoutData', layout);
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        const payload = {
          userId: uidx,
          ownerId: locId,
          layoutId: layout.layoutId,
        };

        deleteLayout(payload)
          .then((res) => {
            const totLayouts = [...totalLayouts];
            const finalTotalLayouts = totLayouts.filter((item) => item.layoutId !== layout.layoutId);
            handleClose();
            Swal.fire('Deleted!', `${res.data.data.message}`, 'success');

            setTotalLayouts(finalTotalLayouts);
          })
          .catch((err) => {});
      } else {
        handleClose();
      }
    });
  };


  return (
    <>
      {/* <Box className="layout-card" onClick={handleViewHierarchy}>
        <SoftTypography
          component="label"
          variant="h5"
          textTransform="capitalize"
          noWrap
          style={{
            marginTop: '0.8rem',
            color: 'white',
            fontSize: '1.5rem',
            letterSpacing: '0.05rem',
            fontWeight: '800',
            wordBreak: 'break-all',
          }}
        >
          {layout.layoutName}
        </SoftTypography>
        <SoftTypography
          component="label"
          variant="h6"
          fontWeight="light"
          textTransform="capitalize"
          fontSize="0.8rem"
          style={{ marginTop: '0.8rem', color: '#f5f5f5', wordBreak: 'break-all' }}
        >
          Created on - {layout.createdOn}
        </SoftTypography>
        <SoftTypography
          component="label"
          variant="h6"
          fontWeight="light"
          fontSize="0.8rem"
          textTransform="capitalize"
          style={{ marginTop: '0.8rem', color: '#f5f5f5', wordBreak: 'break-all' }}
        >
          Created By - {layout.createdBy}
        </SoftTypography>

        <MoreVertIcon
          id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          style={{
            marginTop: '0.5rem',
            marginRight: '0.5rem',
            position: 'absolute',
            top: '0',
            right: '0',
            color: 'white',
            cursor: 'pointer',
          }}
        />
      </Box>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        className="menu"
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <MenuItem onClick={() => handleEditLayouts(layout)} className="listOptions">
          Edit Layout
        </MenuItem>
        <MenuItem className="listOptions" onClick={() => handleViewHierarchy( layout)}>
          View Layout
        </MenuItem>
        <MenuItem
          className="listOptions"
          // onClick={() => handleViewHierarchy(layout)}
          onClick={() => handleDelete(layout)}
        >
          Delete Layout
        </MenuItem>
      </Menu> */}

      <Box className="layout-crd" onClick={handleViewHierarchy}>
        <Box className="layout-crad-details">
          <Box className="layout-img-box">
            <img src={layoutImg} className="layout-img" />
          </Box>
          <Box className="layout-description">
            <SoftTypography className="top-text">{layout.layoutName}</SoftTypography>
            <SoftTypography className="middle-text"> Created on - {layout.createdOn}</SoftTypography>
            <SoftTypography className="bottom-text"> Created By - {layout.createdBy}</SoftTypography>
          </Box>
        </Box>

        <MoreVertIcon
          id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          style={{
            marginTop: '0.5rem',
            marginRight: '0.5rem',
            position: 'absolute',
            top: '0',
            right: '0',
            color: '#0562fb',
            cursor: 'pointer',
          }}
        />
      </Box>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        className="menu"
        getContentAnchorEl={null}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <MenuItem onClick={() => handleEditLayouts(layout)} className="listOptions">
          Edit Layout
        </MenuItem>
        <MenuItem className="listOptions" onClick={() => handleViewHierarchy(layout)}>
          View Layout
        </MenuItem>
        <MenuItem
          className="listOptions"
          // onClick={() => handleViewHierarchy(layout)}
          onClick={() => handleDelete(layout)}
        >
          Delete Layout
        </MenuItem>
      </Menu>
    </>
  );
};

export default LayoutCard;
