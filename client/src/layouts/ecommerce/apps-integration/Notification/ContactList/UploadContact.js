import { Box, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../examples/Navbars/DashboardNavbar';
import React, { useRef, useState } from 'react';
import SoftBox from '../../../../../components/SoftBox';
import SoftButton from '../../../../../components/SoftButton';
import SoftInput from '../../../../../components/SoftInput';

const UploadContact = () => {
  const navigate = useNavigate();
  // drag state
  const [dragActive, setDragActive] = useState(false);
  const [contactFile, setContactFile] = useState('');
  const [csvData, setCsvData] = useState([]);
  const [showList, setShowList] = useState(false);

  const [columns, setColumns] = useState([]);
  // ref
  const inputRef = useRef(null);

  // handle drag events
  const handleDrag = function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // triggers when file is dropped
  const handleDrop = function (e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // handleFiles(e.dataTransfer.files);
      setContactFile(e.dataTransfer.files[0]);
    }
    const file = e.dataTransfer.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (event) => {
        const content = event.target.result;
        const rows = content.split('\n');

        if (rows.length > 1) {
          const headerRow = rows[0].split(',').map((header) => header.trim());

          const dynamicColumns = headerRow.map((header, index) => ({
            field: `column${index}`,
            headerName: header,
            width: 200,
          }));

          const dynamicData = rows
            .slice(1, 11) // Get the first 10 data rows
            .map((row, index) => {
              const columns = row.split(',').map((column) => column.trim());
              const rowData = { id: index + 1 };

              columns.forEach((column, columnIndex) => {
                rowData[`column${columnIndex}`] = column;
              });

              return rowData;
            });

          setColumns(dynamicColumns);
          setCsvData(dynamicData);
        }
      };

      reader.readAsText(file);
    }
  };

  // triggers when file is selected with click
  const handleChange = function (e) {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      // handleFiles(e.target.files);
      setContactFile(e.target.files[0]);
      console.log(e.target.files);
    }
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (event) => {
        const content = event.target.result;
        const rows = content.split('\n');

        if (rows.length > 1) {
          const headerRow = rows[0].split(',').map((header) => header.trim());

          const dynamicColumns = headerRow.map((header, index) => ({
            field: `column${index}`,
            headerName: header,
            flex: 1,
            headerClassName: 'datagrid-columns',
            headerAlign: 'left',
            minWidth: 100,
            cellClassName: 'datagrid-rows',
            align: 'left',
            sortable: false,
          }));

          const dynamicData = rows
            .slice(1, 11) // Get the first 10 data rows
            .map((row, index) => {
              const columns = row.split(',').map((column) => column.trim());
              const rowData = { id: index + 1 };

              columns.forEach((column, columnIndex) => {
                rowData[`column${columnIndex}`] = column;
              });

              return rowData;
            });

          setColumns(dynamicColumns);
          setCsvData(dynamicData);
        }
      };

      reader.readAsText(file);
    }
  };

  // triggers the input when the button is clicked
  const onButtonClick = () => {
    inputRef.current.click();
  };

  const handleExampleDownlaod = () => {
    const fileUrl = '';

    // Create an anchor element to trigger the download
    const a = document.createElement('a');
    a.href = fileUrl;
    a.download = 'sample_pallet_contact_list(2023).csv'; // Set the desired filename
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

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
          <SoftBox style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <Typography>File Import</Typography>
            <SoftButton className="vendor-add-btn" onClick={() => navigate('/marketing/contacts')}>
              Exit
            </SoftButton>
          </SoftBox>
          <hr />
          <SoftBox style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
            <div>
              <Typography> Upload your file</Typography>
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
                Select a file containing your contacts to import.
              </Typography>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
              <SoftButton className="vendor-second-btn" onClick={handleExampleDownlaod}>
                Download
              </SoftButton>
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
                Download an example .csv file
              </Typography>
            </div>
          </SoftBox>
          {contactFile === '' ? (
            <SoftBox style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '40px' }}>
              <form id="form-file-upload" onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()}>
                <input ref={inputRef} type="file" id="input-file-upload" accept=".csv" onChange={handleChange} />
                <label id="label-file-upload" htmlFor="input-file-upload" className={dragActive ? 'drag-active' : ''}>
                  <div>
                    <img src="https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_images/cloud-computing.png" style={{ width: '100px', height: '100px' }} />
                    <p>Drag and drop your .csv file here or</p>
                    <button className="upload-button" onClick={onButtonClick}>
                      Upload a file
                    </button>
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
          ) : (
            <>
              <SoftBox className="uploaded-file-box">
                <div>
                  <Typography
                    style={{
                      fontWeight: '400',
                      fontSize: '1rem',
                      lineHeight: '1.5',
                      textAlign: 'left',
                      margin: '10px 0px',
                    }}
                  >
                    Your file has been uploaded successfully!
                  </Typography>
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
                    {contactFile.name}
                  </Typography>
                </div>
                <button onClick={() => setContactFile('')} className="contact-upload-btn">
                  Cancel
                </button>
              </SoftBox>
              <SoftBox style={{ marginTop: '20px' }}>
                <Typography
                  style={{
                    fontWeight: '400',
                    fontSize: '1rem',
                    lineHeight: '1.5',
                    textAlign: 'left',
                    margin: '10px 0px',
                  }}
                >
                  Preview of your file
                </Typography>
                <div style={{ height: 400, width: '100%' }}>
                  <DataGrid rows={csvData} columns={columns} pageSize={10} rowsPerPageOptions={[10]} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                  <SoftButton className="vendor-add-btn" onClick={() => setShowList(true)}>
                    Confirm your File
                  </SoftButton>
                </div>
              </SoftBox>
            </>
          )}
          {showList ? (
            <SoftBox style={{ marginTop: '20px' }}>
              <Typography>Create a List</Typography>
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
                Give name to the contacts list
              </Typography>
              <SoftBox style={{ marginTop: '10px' }}>
                <Typography
                  style={{
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    lineHeight: '1.5',
                    color: '#0562FB',
                    textAlign: 'left',
                    margin: '10px 0px',
                  }}
                >
                  List Name
                </Typography>
                <SoftInput placeholder="List Name" style={{ width: '400px' }} />
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
                  List name Give your Logistics an internal name to help organize and locate it easily within your
                  account. For example: 'Course_offer'
                </Typography>
              </SoftBox>
              <SoftBox display="flex" justifyContent="flex-end" mt={4}>
                <SoftBox display="flex">
                  <SoftButton className="vendor-second-btn" onClick={() => navigate('/marketing/contacts')}>
                    Cancel
                  </SoftButton>
                  <SoftBox ml={2}>
                    <SoftButton
                      // variant="gradient"
                      color="info"
                      className="vendor-add-btn"
                    >
                      Create
                    </SoftButton>
                  </SoftBox>
                </SoftBox>
              </SoftBox>
            </SoftBox>
          ) : null}
        </Box>
      </DashboardLayout>
    </div>
  );
};

export default UploadContact;
