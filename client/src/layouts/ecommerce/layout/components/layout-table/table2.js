import { useEffect, useState } from 'react';
import DownloadIcon from '@mui/icons-material/Download';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SoftBox from 'components/SoftBox';
import SoftButton from 'components/SoftButton';
import SoftSelect from 'components/SoftSelect';
import SoftTypography from 'components/SoftTypography';

import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

import './table1.css';

import { generateBarcodeForLayoutComponents } from '../../../../../config/Services';

const Table2 = ({ totalSavedComponents, topHierarchy, topHierarchyLabel, topHierarchyData }) => {
  //

  const navigate = useNavigate();

  const layoutId = localStorage.getItem('layout_id');
  const locId = localStorage.getItem('locId');

  const [loader, setLoader] = useState(false);

  const [rowData, setRowData] = useState(null);
  const [imgFormat, setImgFormat] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const [barcodeImage, setBarcodeImage] = useState(null);

  const [opensnack, setOpensnack] = useState(false);
  const [timelinerror, setTimelineerror] = useState('');
  const [alertmessage, setAlertmessage] = useState('');

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const handleClick = (event) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleopensnack = () => {
    setOpensnack(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpensnack(false);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setBarcodeImage(null);
    setAnchorEl(null);
  };

  const handleRowData = (item) => {
    setRowData(item);
  };

  const handleImageFormat = (option) => {
    setImgFormat(option);
    setBarcodeImage(null);
  };

  const viewBarcode = async () => {
    const locid = locId;
    const layout_id = layoutId;
    const mapId = rowData.mapId;
    // const imageFormat = imgFormat.value;
    //
    try {
      const response = await generateBarcodeForLayoutComponents(locid, layout_id, mapId, 'png');
      //
      const result = response.data.data.object;
      const barImg = result.barcodeImage;
      //
      setBarcodeImage(`data:image/png;base64,${barImg}`);
    } catch (err) {}
  };

  const generateBarcode = async () => {
    if (imgFormat == '') {
      setTimelineerror('warning');
      setAlertmessage('Please select image format');
      setOpensnack(true);
      return;
    } else {
      const locid = locId;
      const layout_id = layoutId;
      const mapId = rowData.mapId;
      const imageFormat = imgFormat.value;
      //
      try {
        const response = await generateBarcodeForLayoutComponents(locid, layout_id, mapId, imageFormat);
        //
        const result = response.data.data.object;
        const barImg = result.barcodeImage;
        //
        setBarcodeImage(`data:image/png;base64,${barImg}`);
      } catch (err) {}
    }
  };

  const handleBarCode = () => {
    viewBarcode();
    setOpenModal(true);
  };

  const handleEdit = () => {
    localStorage.setItem('mapId', rowData.mapId);
    navigate('/setting/layout-edit-component/');
  };

  useEffect(() => {
    if (localStorage.getItem('definitionId')) {
      localStorage.removeItem('definitionId');
    }
    if (localStorage.getItem('mapId')) {
      localStorage.removeItem('mapId');
    }
  }, []);

  useEffect(() => {
    if (imgFormat !== null) {
      generateBarcode();
    }
  }, [imgFormat]);

  const download = () => {
    const link = document.createElement('a');
    link.href = barcodeImage;
    link.download = `${rowData.entityName}_barcode.${imgFormat.value}`;
    document.body.appendChild(link);
    link.click();
    setOpensnack(false);
  };

  return (
    <>
      <SoftBox className="table-box">
        <table>
          <thead>
            <tr>
              <th className="table-top-hierarchy-head">{topHierarchyLabel[0].label}</th>
              {totalSavedComponents.map((item) => (
                <th className="table-head">{item.label}</th>
              ))}
              <th className="table-head"></th>
            </tr>
          </thead>
          <tbody>
            <tr className="table-row" onClick={() => handleRowData(topHierarchyData)}>
              <td className="table-row-data">{topHierarchy.label}</td>
              {new Array(totalSavedComponents.length).fill(0).map((item) => (
                <td></td>
              ))}
              <td
                style={{
                  cursor: 'pointer',
                }}
              >
                <MoreVertIcon
                  id="basic-button"
                  aria-controls={open ? 'basic-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                  onClick={topHierarchy == '' ? null : handleClick}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </SoftBox>
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
        <MenuItem onClick={() => handleEdit()} className="listOptions">
          Edit
        </MenuItem>
        <MenuItem className="listOptions" onClick={() => handleBarCode()}>
          Barcode
        </MenuItem>
      </Menu>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box
          sx={{
            width: '50vw',
            height: '50vh',
            backgroundColor: '#fff',
            margin: 'auto',
            marginTop: '6rem',
            borderRadius: '1rem',
            padding: '2rem',
            boxSizing: 'border-box',
            position: 'relative',
            overflowY: 'auto',
          }}
          className="modal-box-barcode"
        >
          <Box className="generate-barcode">
            <SoftTypography
              component="label"
              variant="h4"
              fontWeight="bold"
              textTransform="capitalize"
              style={{ marginTop: '0.8rem' }}
            >
              Barcode for {rowData !== null ? ` ${rowData.entityName}` : null}
            </SoftTypography>
          </Box>
          <Box className="img-format">
            <SoftTypography
              component="label"
              variant="h5"
              fontWeight="light"
              textTransform="capitalize"
              style={{ marginTop: '1.2rem', fontSize: '1rem' }}
            >
              Image Format
            </SoftTypography>
            <SoftSelect
              placeholder="Image Format"
              options={[
                { value: 'png', label: 'PNG' },
                { value: 'jpeg', label: 'JPEG' },
                { value: 'JPG', label: 'JPG' },
              ]}
              onChange={(option) => handleImageFormat(option)}
            />
          </Box>
          {barcodeImage == null ? null : ( // </Box> //   </SoftButton> //     Generate //   <SoftButton color="info" variant="gradient" onClick={() => generateBarcode()}> // <Box className="generate-btn">
            <Box className="barcode-container">
              <img
                style={{
                  display: barcodeImage ? 'block' : 'none',
                  objectFit: 'cover',
                  height: '90px',
                }}
                src={
                  barcodeImage
                  // || d_img
                }
                alt=""
              />
              <SoftButton variant="gradient" color="info" iconOnly onClick={download}>
                <DownloadIcon />
              </SoftButton>
            </Box>
          )}
        </Box>
      </Modal>
      <Snackbar open={opensnack} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={timelinerror} sx={{ width: '100%' }}>
          {alertmessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Table2;
