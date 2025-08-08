import React, { useEffect, useRef, useState } from 'react';
import DashboardLayout from '../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../examples/Navbars/DashboardNavbar';
import { Box, Typography } from '@mui/material';
import SoftBox from '../../../../../components/SoftBox';
import SoftButton from '../../../../../components/SoftButton';
import { buttonStyles } from '../../../Common/buttonColor';
import DoneIcon from '@mui/icons-material/Done';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../../../../hooks/SnackbarProvider';
import SoftTypography from '../../../../../components/SoftTypography';
import Swal from 'sweetalert2';
import { createBulkPriceEditUpload } from '../../../../../config/Services';
import SoftProgress from '../../../../../components/SoftProgress';

const BulkPriceFileUpload = () => {
  const [upload, setUpload] = useState(true);
  const [process, setProcess] = useState(false);
  const [openComplete, setOpenComplete] = useState(false);
  const [step1Comp, setStep1Comp] = useState(false);
  const [step2Comp, setStep2Comp] = useState(false);
  const [productCSVFile, setProductCSVFile] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [duplicateData, setDuplicateData] = useState([]);
  const [loader1, setLoader1] = useState(false);
  const [errorStatement, setErrorStatement] = useState(false);
  const [fileId, setFileId] = useState('');
  const [fileUploadSuccess, setFileUploadeSuccess] = useState(false);
  const [totalItems, setTotalItems] = useState();
  const [processedItems, setProcessedItems] = useState();
  const [progress, setProgress] = useState(false);

  const showSnackbar = useSnackbar();
  const navigate = useNavigate();

  // local storage items
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const sourceType = localStorage.getItem('contextType');
  const user_details = localStorage.getItem('user_details');
  const uidx = user_details ? JSON.parse(user_details).uidx : null;
  const name = localStorage.getItem('user_name');

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
      const file = e.dataTransfer.files[0];
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        setProductCSVFile(file);
      } else {
        showSnackbar('Only CSV files are allowed.', 'error');
      }
    }
  };

  // triggers when file is selected with click
  const handleChange = function (e) {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        setProductCSVFile(file);
      } else {
        showSnackbar('Only CSV files are allowed.', 'error');
      }
    }
  };

  // triggers the input when the button is clicked
  const onButtonClick = () => {
    inputRef.current.click();
  };

  const downloadBulkProductsHistory = () => {
    const fileUrl =
      'https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_images/test_file_2%20-%20test_file_2.csv%20(1).csv';

    // Create an anchor element to trigger the download
    const a = document.createElement('a');
    a.href = fileUrl;
    a.download = 'sample_pallet_bulk_product_price_edit_upload_file(2023).csv'; // Set the desired filename
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const UploadAgain = () => {
    setUpload(true);
    setProcess(false);
    setDuplicateData([]);
    setLoader1(false);
    setProductCSVFile('');
    setErrorStatement(false);
  };

  const handleDownloadCSV = () => {
    const csvContent =
      Object.keys(duplicateData[0]) // Get the headers
        .map((header) => `"${header}"`) // Wrap headers in double quotes
        .join(',') +
      '\n' + // Join headers with a comma and add a newline
      duplicateData
        .map((row) =>
          Object.values(row)
            .map((value) => {
              const stringValue = String(value);
              return `"${stringValue.replace(/"/g, '""')}"`; // Escape double quotes
            })
            .join(','),
        )
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'data.csv');

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
  };

  const columns = [
    {
      field: 'Sr.No',
      headerName: 'Sr.No',
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 50,
      cellClassName: 'datagrid-rows',
      align: 'left',
      sortable: false,
    },
    {
      field: 'Product Name',
      headerName: 'Product Name',
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 50,
      cellClassName: 'datagrid-rows',
      align: 'left',
      sortable: false,
    },
    {
      field: 'Barcode',
      headerName: 'Barcode',
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 50,
      cellClassName: 'datagrid-rows',
      align: 'left',
      sortable: false,
    },
    {
      field: 'Mrp',
      headerName: 'Mrp',
      flex: 1,
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      minWidth: 50,
      cellClassName: 'datagrid-rows',
      align: 'left',
      sortable: false,
    },

    {
      field: 'Selling Price',
      headerName: 'Selling Price',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      flex: 1,
      minWidth: 50,
      cellClassName: 'datagrid-rows',
      align: 'left',
      sortable: false,
    },
    {
      field: 'Rejection Reason',
      headerName: 'Rejection Reason',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      flex: 1,
      minWidth: 50,
      cellClassName: 'datagrid-rows',
      align: 'left',
      sortable: false,
    },
  ];

  const handleContinueUpload = () => {
    const newSwal = Swal.mixin({
      buttonsStyling: false,
    });
    newSwal
      .fire({
        title: 'Are you sure you want continue to upload the correct data?',
        text: 'Only the correct data will get uploaded. You can download the incorrect file and make changes to upload again.',
        icon: 'warning',
        confirmButtonText: 'Confirm',
        showCancelButton: true,
        reverseButtons: true,
        customClass: {
          title: 'custom-swal-title',
          cancelButton: 'logout-cancel-btn',
          confirmButton: 'logout-success-btn', // Added custom class for title
        },
      })
      .then((result) => {
        if (result?.isConfirmed) {
        } else {
          navigate('/products/price-edit-upload');
        }
      });
  };

  const csvDataArray = [];

  const handleValidateCSV = (fileData) => {
    setProductCSVFile(fileData);
    setUpload(false);
    setProcess(true);
    setLoader1(true);
    setErrorStatement(false);
    setStep1Comp(true);

    const uniqueFileName = `file_${Date.now()}.csv`;
    const filePayload = new Blob([fileData], { type: 'text/csv' });
    const context = localStorage.getItem('contextType');

    const payload = {
      organizationId: orgId,
      locationId: locId,
      createdBy: uidx,
      createdByName: name,
      locationType: context,
    };

    const newFormData = new FormData();
    newFormData.append('file', filePayload);
    // newFormData.append(
    //   'request',
    //   new Blob([JSON.stringify(payload)], {
    //     type: 'application/json',
    //   }),
    // );
    newFormData.append('request', JSON.stringify(payload));

    createBulkPriceEditUpload(newFormData)
      .then((response) => {
        if (response?.data?.data?.es === 0) {
          setFileUploadeSuccess(true);
          setProcess(false);
          setErrorStatement(false);
          showSnackbar(response?.data?.data?.message, 'success');
          setProgress(true);
        } else if (response?.data) {
          setErrorStatement(false);
          setProcess(false);
          setLoader1(false);
          setStep2Comp(true);
        }
      })
      .catch((error) => {
        setErrorStatement(true);
        setLoader1(false);
        setProcess(false);
      });
  };

  useEffect(() => {
    if (progress) {
      const timeoutId1 = setTimeout(() => {
        setFileUploadeSuccess(false);
        setProcess(false);
        setOpenComplete(true);
        setStep2Comp(true);
        navigate('/products/price-edit-upload');
      }, 2000);

      return () => clearTimeout(timeoutId1);
    }
  }, [progress]);

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
          <SoftBox style={{ paddingBottom: '10px' }}>
            <div className="stepper-wrapper">
              <div
                className={
                  upload === true
                    ? 'stepper-item active'
                    : step1Comp === true
                    ? 'stepper-item completed'
                    : 'stepper-item'
                }
              >
                <div className="step-counter">{step1Comp ? <DoneIcon /> : '1'}</div>
                <div className="step-name">Step 1</div>
              </div>
              <div
                className={
                  process === true
                    ? 'stepper-item active'
                    : step2Comp === true
                    ? 'stepper-item completed'
                    : 'stepper-item'
                }
              >
                <div className="step-counter">{step2Comp ? <DoneIcon /> : '2'}</div>
                <div className="step-name">Finish</div>
              </div>
              {/* <div className={openComplete === true ? 'stepper-item completed' : 'stepper-item'}>
                <div className="step-counter">{openComplete ? <DoneIcon /> : '3'}</div>
                <div className="step-name">Finish</div>
              </div> */}
            </div>
          </SoftBox>
          <hr />
          {upload && (
            <>
              <SoftBox style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                <div>
                  <Typography style={{ fontSize: '1.2rem', fontWeight: '600' }}> Upload your file</Typography>
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
                    Select a file containing your products to import.
                  </Typography>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                  <SoftButton
                    variant={buttonStyles.primaryVariant}
                    className="contained-softbutton"
                    onClick={downloadBulkProductsHistory}
                  >
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

              {productCSVFile === '' ? (
                <SoftBox style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '40px' }}>
                  <form id="form-file-upload" onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()}>
                    <input ref={inputRef} type="file" id="input-file-upload" accept=".csv" onChange={handleChange} />
                    <label
                      id="label-file-upload"
                      htmlFor="input-file-upload"
                      className={dragActive ? 'drag-active' : ''}
                    >
                      <div>
                        <img
                          src="https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_images/cloud-computing.png"
                          style={{ width: '100px', height: '100px' }}
                        />
                        <p style={{ fontSize: '14px' }}>Drag and drop your .csv file here or</p>
                        <SoftButton
                          // className="upload-button"
                          variant={buttonStyles?.primaryVariant}
                          className="contained-softbutton"
                          onClick={onButtonClick}
                        >
                          Upload a file
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
              ) : (
                <SoftBox style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
                        {productCSVFile?.name}
                      </Typography>
                    </div>
                    <button
                      onClick={() => {
                        setProductCSVFile('');
                      }}
                      className="contact-upload-btn"
                    >
                      Cancel
                    </button>
                  </SoftBox>
                  <SoftBox></SoftBox>
                  <SoftBox mt={2} mb={1} lineHeight={0} display="inline-block">
                    <SoftButton onClick={() => handleValidateCSV(productCSVFile)} className="vendor-add-btn">
                      Upload
                    </SoftButton>
                    <SoftButton
                      onClick={() => navigate('/products/price-edit-upload')}
                      className="vendor-second-btn"
                      style={{ marginLeft: '10px' }}
                    >
                      Cancel
                    </SoftButton>
                  </SoftBox>
                </SoftBox>
              )}
            </>
          )}

          {process && (
            <>
              {loader1 && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
                  <img src="https://i.gifer.com/origin/a1/a1d81f564eeb1468aefbcfd54d1571b8_w200.gif" alt="" />
                </div>
              )}

              {duplicateData?.length !== 0 && (
                <SoftBox className="add-customer-file-box-I">
                  <SoftTypography style={{ margin: '10px', fontSize: '16px' }}>
                    Your file contains the following wrong data. There are {duplicateData.length} wrong rows. You can
                    also download to see those data.
                  </SoftTypography>
                  <div style={{ height: 400, width: '100%' }}>
                    <DataGrid rows={duplicateData} columns={columns} pageSize={10} pagination />
                  </div>
                  {/* <SoftBox mt={2} mb={1} ml={2} lineHeight={0} display="inline-block">
                    <SoftButton
                      onClick={handleDownloadCSV}
                      variant={buttonStyles.primaryVariant}
                      className="contained-softbutton"
                    >
                      Download
                    </SoftButton>
                    <SoftButton
                      onClick={handleContinueUpload}
                      className="vendor-second-btn"
                      style={{ marginLeft: '20px' }}
                    >
                      Continue Upload
                    </SoftButton>
                  </SoftBox> */}
                </SoftBox>
              )}
            </>
          )}

          {errorStatement && (
            <SoftBox className="add-customer-file-box-I">
              <SoftTypography style={{ margin: '10px', fontSize: '16px' }}>
                There was an error parsing your file. Please check and upload your file again.
              </SoftTypography>
              <SoftBox mt={2} mb={1} ml={2} lineHeight={0} display="inline-block">
                <SoftButton onClick={UploadAgain} className="vendor-add-btn">
                  Upload
                </SoftButton>
              </SoftBox>
            </SoftBox>
          )}

          {fileUploadSuccess && (
            <SoftBox className="add-customer-file-box-I">
              <SoftTypography style={{ margin: '10px', fontSize: '16px' }}>
                Your file has been uploaded successfully. It will take some time to process your file.
              </SoftTypography>
              <SoftBox>
                <Typography style={{ margin: '15px', fontSize: '14px', fontWeight: '600' }}>Uploading...</Typography>
                <div>
                  <SoftProgress variant="gradient" value={50} />
                </div>
                {/* <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography style={{ margin: '15px', fontSize: '13px', fontWeight: '200' }}>
                    {progress}/{totalItems} Items Processed
                  </Typography>
                  <Typography style={{ margin: '15px', fontSize: '13px', fontWeight: '200' }}>
                    {progress}% uploaded
                  </Typography>
                </div> */}
              </SoftBox>
              <SoftBox mt={2} mb={1} ml={2} lineHeight={0} display="inline-block">
                <SoftButton onClick={() => navigate('/products/price-edit-upload')} className="vendor-add-btn">
                  Continue
                </SoftButton>
                <SoftButton className="vendor-second-btn" style={{ marginLeft: '20px' }}>
                  Refresh
                </SoftButton>
              </SoftBox>
            </SoftBox>
          )}

          {openComplete && (
            <SoftBox className="add-customer-file-box-I">
              <SoftTypography style={{ margin: '10px', fontSize: '16px' }}>
                Congratulations! Your file has been processed successfully and all your products has been added. You can
                view your file on the bulk edit upload page.
              </SoftTypography>
              <SoftBox mt={2} mb={1} ml={2} lineHeight={0} display="inline-block">
                <SoftButton onClick={() => navigate('/products/price-edit-upload')} className="vendor-add-btn">
                  Continue
                </SoftButton>
              </SoftBox>
            </SoftBox>
          )}
        </Box>
      </DashboardLayout>
    </div>
  );
};

export default BulkPriceFileUpload;
