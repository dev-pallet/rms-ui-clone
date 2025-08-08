import React, { useRef, useState } from 'react';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import SoftBox from '../../../../components/SoftBox';
import SoftButton from '../../../../components/SoftButton';
import { Box, CircularProgress, Tooltip, Typography } from '@mui/material';
import { uploadImageBase64, uploadImageBase64Folder } from '../../../../config/Services';
import { DataGrid } from '@mui/x-data-grid';
import { dataGridStyles } from '../../Common/NewDataGridStyle';
import { CopyToClipBoard } from '../../Common/CommonFunction';
import { useSnackbar } from '../../../../hooks/SnackbarProvider';

const UrlGeneratorPage = () => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);
  const [loader, setLoader] = useState(false);
  const [allImages, setAllImages] = useState([]);
  const showSnackbar = useSnackbar();

  const handleDrag = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.type === 'dragenter' || event.type === 'dragover') {
      setDragActive(true);
    } else if (event.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);

    const files = Array.from(event.dataTransfer.files);
    onSelectFile({ target: { files } });
  };

  const handleChange = (event) => {
    const files = Array.from(event.target.files);
    onSelectFile({ target: { files } });
  };

  const onSelectFile = (event) => {
    const selectedFiles = event.target.files;
    const selectedFilesArray = Array.from(selectedFiles);
    const base64Array = [];
    const fileNamesArray = selectedFilesArray.map((file) => file.name);
    setLoader(true);

    selectedFilesArray.forEach((file, index) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        base64Array.push(reader.result);

        if (base64Array.length === selectedFilesArray.length) {
          const imagePayload = {
            uploadType: 'image/jpeg',
            files: {},
          };

          base64Array.forEach((base64String, i) => {
            const fileNameWithoutExtension = fileNamesArray[i].replace(/\.[^/.]+$/, '');
            imagePayload.files[fileNameWithoutExtension] = removeDataURLPrefix(base64String);
          });

          uploadImageBase64Folder(imagePayload)
            .then((res) => {
              setLoader(false);
              const data = res?.data?.data?.data;
              if (data) {
                const imageObject = data;
                const rows = Object.entries(imageObject).map(([name, url], index) => ({
                  id: index + 1,
                  name,
                  url,
                }));
                setAllImages(rows);
              } else {
                setLoader(false);
                showSnackbar('No data found in response', 'error');
              }
            })
            .catch((err) => {
              setLoader(false);
              showSnackbar('Error uploading images', 'error');
            });
        }
      };
      reader.onerror = (error) => {
        setLoader(false);
        showSnackbar('Error converting file to base64:', 'error');
      };
      reader.readAsDataURL(file);
    });
  };

  const removeDataURLPrefix = (base64String) => {
    return base64String.replace(/^data:image\/[a-z]+;base64,/, '');
  };

  const onButtonClick = () => {
    inputRef.current.click();
  };

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      minWidth: 30,
      maxWidth: 50,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      flex: 1,
    },
    {
      field: 'name',
      headerName: 'Name',
      minWidth: 50,
      maxWidth: 70,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      flex: 1,
    },
    {
      field: 'url',
      headerName: 'URL',
      minWidth: 900,
      // maxWidth: 850,
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      cellClassName: 'datagrid-rows',
      renderCell: (params) => {
        const url = params.value;
        return (
          <Tooltip title={url} arrow>
            <div
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <CopyToClipBoard params={params} />
            </div>
          </Tooltip>
        );
      },
    },
  ];

  return (
    <div>
      <DashboardLayout>
        <DashboardNavbar prevLink={true} />
        <Box
          className="table-css-fix-box-scroll-vend"
          style={{
            boxShadow: 'rgba(37, 37, 37, 0.126) 0px 5px 50px',
            position: 'relative',
            padding: '20px',
          }}
        >
          {allImages.length === 0 && (
            <>
              <Typography style={{ fontSize: '1.2rem', fontWeight: '600' }}> Upload your folder</Typography>
              <Typography
                style={{
                  fontWeight: '200',
                  fontSize: '0.8rem',
                  lineHeight: '1.5',
                  color: '#4b524d',
                  textAlign: 'left',
                  margin: '10px 0px',
                }}
              >
                Generate URL for your product images. Just upload the folder containing images and get URL for the
                images.
              </Typography>
              <SoftBox style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '40px' }}>
                <form id="form-file-upload" onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()}>
                  <input
                    ref={inputRef}
                    type="file"
                    id="input-file-upload"
                    webkitdirectory="true"
                    multiple
                    accept="image/*"
                    onChange={handleChange}
                    style={{ display: 'none' }}
                  />
                  <label id="label-file-upload" htmlFor="input-file-upload" className={dragActive ? 'drag-active' : ''}>
                    <div>
                      <img
                        src="https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_images/cloud-computing.png"
                        style={{ width: '100px', height: '100px' }}
                      />
                      <p style={{ fontSize: '14px' }}>Drag and drop your folder containing images here or</p>
                      <SoftButton variant="contained" className="contained-softbutton" onClick={onButtonClick}>
                        {loader ? (
                          <CircularProgress
                            size={18}
                            sx={{
                              color: '#fff',
                            }}
                          />
                        ) : (
                          <>Upload a folder</>
                        )}
                      </SoftButton>
                    </div>
                  </label>
                  {dragActive && (
                    <div
                      id="drag-file-element"
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    ></div>
                  )}
                </form>
              </SoftBox>
            </>
          )}
          {allImages.length !== 0 && (
            <SoftBox className="search-bar-filter-and-table-container" style={{ marginTop: '20px' }}>
              <SoftBox className="search-bar-filter-container">
                <SoftBox>
                  <Box className="all-products-filter-product" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <SoftButton variant="solidWhiteBackground" onClick={() => setAllImages([])}>
                      Upload
                    </SoftButton>
                  </Box>
                </SoftBox>
              </SoftBox>
              <Box style={{ height: 525, width: '100%' }} className="dat-grid-table-box">
                <DataGrid
                  rows={allImages || []}
                  columns={columns}
                  pageSize={10}
                  pagination
                  disableSelectionOnClick
                  getRowId={(row) => row.id}
                  className="data-grid-table-boxo"
                />
              </Box>
            </SoftBox>
          )}
        </Box>
      </DashboardLayout>
    </div>
  );
};

export default UrlGeneratorPage;
