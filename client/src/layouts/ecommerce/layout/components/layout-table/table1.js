import { useEffect, useState } from 'react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DownloadIcon from '@mui/icons-material/Download';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SoftBox from 'components/SoftBox';
import SoftButton from 'components/SoftButton';
import SoftSelect from 'components/SoftSelect';
import SoftTypography from 'components/SoftTypography';

import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

import './table1.css';
import * as React from 'react';
import { generateBarcodeForLayoutComponents } from '../../../../../config/Services';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

import { ToastContainer, toast } from 'react-toastify';
import { injectStyle } from 'react-toastify/dist/inject-style';
import SoftInput from '../../../../../components/SoftInput';

const Table1 = ({
  tableData,
  setTableData,
  totalSavedComponents,
  topHierarchy,
  topHierarchyLabel,
  topHierarchyData,
  pageNo,
  handlePageNext,
  handlePageBack,
  totalPage,
}) => {
  // console.log('tableData', tableData);
  // console.log('totalSavedComponents', totalSavedComponents);
  // console.log('topHierarchy', topHierarchy);
  // console.log('topHierarchyLabel', topHierarchyLabel);
  // console.log('topHierarchyData', topHierarchyData);

  const navigate = useNavigate();
  injectStyle();

  const layoutId = localStorage.getItem('layout_id');
  const locId = localStorage.getItem('locId');

  const [loader, setLoader] = useState(false);

  const [rowData, setRowData] = useState(null);
  const [rowDataCopy, setRowDataCopy] = useState(null);
  const [imgFormat, setImgFormat] = useState('png');
  const [openModal, setOpenModal] = useState(false);
  const [editRowModal, setEditRowModal] = useState(false);

  const [barcodeImage, setBarcodeImage] = useState(null);

  const [opensnack, setOpensnack] = useState(false);
  const [timelinerror, setTimelineerror] = useState('');
  const [alertmessage, setAlertmessage] = useState('');

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  const componentsTypeName = (str) => {
    return str
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/(?:^|\s)\S/g, function (a) {
        return a.toUpperCase();
      });
  };

  const handleClick = (event, item) => {
    event.preventDefault();
    event.stopPropagation();

    console.log('RowitemDetails', item);
    setRowData(item);
    setRowDataCopy(item);

    localStorage.setItem('mapId', item.mapId);
    if (item.hasOwnProperty('entityDefinitionId')) {
      localStorage.setItem('definitionId', item.entityDefinitionId);
    }
    if (item.hasOwnProperty('definitionId')) {
      localStorage.setItem('definitionId', item.definitionId);
    }
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

  //
  //
  //

  const handleCloseModal = () => {
    setOpenModal(false);
    setBarcodeImage(null);
    setAnchorEl(null);
  };

  const handleRowData = (item) => {
    console.log('rowItem', item);
    setRowData(item);
    setRowDataCopy(item);
    setEditRowModal(true);
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
      toast.success(response.data.data.message, {
        position: 'bottom-left',
        autoClose: 2000,
        theme: 'light',
      });
      const result = response.data.data.object;
      const barImg = result.barcodeImage;
      //
      setBarcodeImage(`data:image/png;base64,${barImg}`);
      setImgFormat('png');
      // setImgFormat({ value: 'png', label: 'PNG' });
    } catch (err) {
      toast.error(err.response.data.message, {
        position: 'bottom-left',
        autoClose: 2000,
        theme: 'light',
      });
    }
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
      const imageFormat = typeof imgFormat == 'string' ? imgFormat : imgFormat.value;
      //
      try {
        const response = await generateBarcodeForLayoutComponents(locid, layout_id, mapId, imageFormat);
        //

        toast.success(response.data.data.message, {
          position: 'bottom-left',
          autoClose: 2000,
          theme: 'light',
        });
        const result = response.data.data.object;
        const barImg = result.barcodeImage;
        //
        setBarcodeImage(`data:image/png;base64,${barImg}`);
      } catch (err) {}
    }
  };

  const download = () => {
    if (typeof imgFormat !== 'string') {
      const link = document.createElement('a');
      link.href = barcodeImage;
      link.download = `${rowData.entityName}_barcode.${imgFormat.value}`;
      document.body.appendChild(link);
      link.click();
      setOpensnack(false);
    } else {
      const link = document.createElement('a');
      link.href = barcodeImage;
      link.download = `${rowData.entityName}_barcode.${imgFormat}`;
      document.body.appendChild(link);
      link.click();
      setOpensnack(false);
    }
  };

  const handleBarCode = () => {
    viewBarcode();
    setOpenModal(true);
  };

  const handleEdit = () => {
    // navigate('/setting/layout-edit-component/');
    setEditRowModal(true);
  };

  useEffect(() => {
    if (localStorage.getItem('mapId')) {
      localStorage.removeItem('mapId');
    }
  }, []);

  useEffect(() => {
    if (typeof imgFormat !== 'string') {
      generateBarcode();
    }
  }, [imgFormat]);

  const handleCloseEditRowModal = () => {
    setEditRowModal(false);
    setAnchorEl(null);
    setRowData(rowDataCopy);
    setRowDataCopy(null);
  };

  const findAndUpdate = (targetMapId, newData) => {
    setTableData((prevData) => updateData(prevData, targetMapId, newData));
    setEditRowModal(false);
  };

  const updateData = (data, targetMapId, newData) => {
    return data.map((item) => {
      if (item.mapId === targetMapId) {
        return { ...item, ...newData };
      } else if (item.children) {
        return { ...item, children: updateData(item.children, targetMapId, newData) };
      }
      return item;
    });
  };

  const handleSaveUpdateRow = () => {
    const targetMapId = rowData.mapId;
    findAndUpdate(targetMapId, rowData);
  };

  const hanldeEditRowData = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setRowData((prev) => ({ ...prev, [name]: value }));
  };

  function generateTableRows(data, parentKeys = []) {
    return data.map((item, index) => {
      const currentKeys = item.inUse ? parentKeys.concat(item.entityName) : [];
      const hasChildren = item.children && item.inUse && item.children.length > 0;
      // console.log(currentKeys);

      /** hasChildren ---> to check [data] has children */
      /** currentKeys ---> to check if parent component is in use or not */

      if (hasChildren) {
        return [
          <tr key={item.mapId} className="table-row" onClick={() => handleRowData(item)}>
            <td className="table-row-data">{topHierarchy.label}</td>
            {currentKeys.map((key, index) => {
              //
              return (
                <td key={index} className="table-row-data">
                  {key}
                </td>
              );
            })}
            {currentKeys.length == 1 ? <td></td> : null}
            <td className="table-row-data">{item.totalSpace}</td>
            <td className="table-row-data">{'Chilled'}</td>
            <td className="table-row-data">{'Juice'}</td>
            {/* <td className="table-row-data">{item.parentId}</td> */}
            {currentKeys.length == 1
              ? new Array(totalSavedComponents.length + 3 - currentKeys?.length - 4).fill(0).map((item) => (
                <>
                  <td></td>
                </>
              ))
              : new Array(totalSavedComponents.length + 4 - currentKeys?.length - 4).fill(0).map((item) => (
                <>
                  <td></td>
                </>
              ))}
            <td
              style={{
                cursor: 'pointer',
              }}
            >
              <MoreVertIcon
                id="basic-button"
                key={item.mapId}
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={(event) => handleClick(event, item)}
                style={{
                  cursor: 'pointer !important',
                }}
              />
            </td>
          </tr>,
          ...generateTableRows(item.children, currentKeys),
        ];
      } else {
        if (currentKeys.length) {
          return (
            <tr key={item.mapId} className="table-row" onClick={() => handleRowData(item)}>
              <td className="table-row-data">{topHierarchy.label}</td>
              {currentKeys.map((key, index) => {
                //
                return (
                  <>
                    <td key={index} className="table-row-data">
                      {key}
                    </td>
                  </>
                );
              })}
              {currentKeys.length == 1 ? <td></td> : null}
              <td className="table-row-data">{item.totalSpace}</td>
              <td className="table-row-data">{'Chilled'}</td>
              <td className="table-row-data">{'Juice'}</td>
              {/* <td className="table-row-data">{item.parentId}</td> */}
              {currentKeys.length == 1
                ? new Array(totalSavedComponents.length + 3 - currentKeys?.length - 4).fill(0).map((item) => (
                  <>
                    <td></td>
                  </>
                ))
                : new Array(totalSavedComponents.length + 4 - currentKeys?.length - 4).fill(0).map((item) => (
                  <>
                    <td></td>
                  </>
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
                  onClick={(event) => handleClick(event, item)}
                />
              </td>
            </tr>
          );
        }
      }
    });
  }
  const tableRows = generateTableRows(tableData);

  return (
    <>
      <SoftBox
        className="table-box"
        // style={{ marginTop: '1rem' }}
        sx={{
          height: '29rem',
          overflowX:'auto'
        }}
      >
        <table className="hierarchy-table">
          <thead>
            <tr>
              <th className="table-top-hierarchy-head">{componentsTypeName(topHierarchyLabel[0].label)}</th>
              {totalSavedComponents.map((item) => (
                <th className="table-head">{componentsTypeName(item.label)}</th>
              ))}
              <th className="table-head">Total Space</th>
              <th className="table-head">Storage Type</th>
              <th className="table-head">Product</th>
              <th className="table-head"></th>
            </tr>
          </thead>
          <tbody>
            {/* 1st row with top-hierarchy label */}
            <tr className="table-row" onClick={() => handleRowData(topHierarchyData)}>
              <td className="table-row-data">{topHierarchy.label}</td>
              {/* to add columns and align menu e.g : 2 more coulmns added */}
              {new Array(totalSavedComponents.length).fill(0).map((item) => (
                <td></td>
              ))}
              <td className="table-row-data">{12223}</td>
              <td className="table-row-data">{'----'}</td>
              <td className="table-row-data">{'---'}</td>
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
                  onClick={(event) => handleClick(event, topHierarchyData)}
                />
              </td>
            </tr>
            {tableRows}
          </tbody>
        </table>

        <SoftBox className="pagination">
          <SoftTypography
            style={{
              marginRight: '1rem',
            }}
          >
            {`${pageNo + 1} of ${totalPage}   `}
          </SoftTypography>

          <SoftButton size="medium">
            <ChevronLeftIcon
              fontSize="large"
              disabled={pageNo + 1 == totalPage || pageNo == 0 ? true : false}
              style={{ marginLeft: '2rem' }}
              onClick={() => handlePageBack()}
            />
          </SoftButton>
          <SoftButton size="medium" disabled={pageNo + 1 == totalPage ? true : false}>
            <ChevronRightIcon fontSize="large" onClick={() => handlePageNext()} />
          </SoftButton>
        </SoftBox>
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
              // textTransform="capitalize"
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
          {barcodeImage == null ? null : (
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
      <Modal
        open={editRowModal}
        onClose={handleCloseEditRowModal}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
        className="dialog-base"
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
          className="modal-box-edit-row"
        >
          <Box className="entity-name">
            <SoftTypography className="header-text">Entity Name</SoftTypography>
            <SoftInput
              name="entityName"
              type="text"
              value={rowData?.entityName}
              onChange={(e) => hanldeEditRowData(e)}
            />
          </Box>
          <Box
            className="total-space"
            sx={{
              marginTop: '0.8rem',
            }}
          >
            <SoftTypography className="header-text">Total Space</SoftTypography>
            <SoftBox className="boom-box">
              <SoftBox className="boom-soft-box">
                <SoftSelect
                  className="boom-soft-select"
                  placeholder="Units"
                  options={[
                    { value: 'square feet', label: 'Sq. Feet' },
                    { value: 'square meter', label: 'Sq. Meter' },
                    { value: 'square yards', label: 'Sq. Yards' },
                    { value: 'Kgs', label: 'Kgs' },
                  ]}
                  menuPortalTarget={document.getElementsByClassName('dialog-base')[0]}
                  menuPosition="fixed"
                />
              </SoftBox>
              <SoftInput
                name="totalSpace"
                type="text"
                value={rowData?.totalSpace}
                onChange={(e) => hanldeEditRowData(e)}
              />
            </SoftBox>
          </Box>
          <Box className="cancel-save-btn-modal">
            <SoftButton
              className="form-button-i"
              sx={{ marginRight: '1rem', border: '1px solid rgb(28, 119, 255)' }}
              onClick={handleCloseEditRowModal}
            >
              Cancel
            </SoftButton>
            <SoftButton className="form-button-submit-i" onClick={handleSaveUpdateRow}>
              Save
            </SoftButton>
          </Box>
        </Box>
      </Modal>
      <Snackbar open={opensnack} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={timelinerror} sx={{ width: '100%' }}>
          {alertmessage}
        </Alert>
      </Snackbar>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};

export default Table1;
