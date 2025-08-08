import { Box, Slide, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { buttonStyles } from '../../../../../Common/buttonColor';
import { createBulkProductJob, getBulkProductById, stopBulkJobProducts } from '../../../../../../../config/Services';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../../../../../../hooks/SnackbarProvider';
import DashboardLayout from '../../../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../../../examples/Navbars/DashboardNavbar';
import React, { useEffect, useRef, useState } from 'react';
import SoftBox from '../../../../../../../components/SoftBox';
import SoftButton from '../../../../../../../components/SoftButton';
import SoftProgress from '../../../../../../../components/SoftProgress';
import SoftTypography from '../../../../../../../components/SoftTypography';
import Swal from 'sweetalert2';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const BulkUpload = () => {
  const [upload, setUpload] = useState(true);
  const [process, setProcess] = useState(false);
  const [productCSVFile, setProductCSVFile] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [inventoryCheck, setInventoryCheck] = useState(false);
  const [inventoryOtherOptions, setInventoryOtherOptions] = useState(false);
  const [invoverwrite, setInvOverwrite] = useState(false);
  const [invNewbatch, setInvNewbatch] = useState(false);
  const [invoverDisable, setInvoverDisable] = useState(false);
  const [invNewDisbale, setInvNewDisable] = useState(false);
  const [duplicateData, setDuplicateData] = useState([]);
  const [loader1, setLoader1] = useState(false);
  const [errorStatement, setErrorStatement] = useState(false);
  const [fileId, setFileId] = useState('');
  const [fileUploadSuccess, setFileUploadeSuccess] = useState(false);
  const [totalItems, setTotalItems] = useState('');
  const [CMSProcessed, setCMSProcessed] = useState(0);
  const [invProcessed, setInvProcessed] = useState(0);
  const [CMSProgress, setCMSProgress] = useState(0);
  const [INVProgress, setINVProgress] = useState(0);
  const [data, setData] = useState([]);
  const [openComplete, setOpenComplete] = useState(false);
  const [step1Comp, setStep1Comp] = useState(false);
  const [step2Comp, setStep2Comp] = useState(false);
  const [overRideCMS, setOverRideCMS] = useState(false);
  const isRestaurant = localStorage.getItem('retailType') === 'RESTAURANT';

  const navigate = useNavigate();
  const showSnackbar = useSnackbar();

  // local storage items
  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const sourceType = localStorage.getItem('contextType');

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
      setProductCSVFile(e.dataTransfer.files[0]);
    }
  };

  // triggers when file is selected with click
  const handleChange = function (e) {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setProductCSVFile(e.target.files[0]);
    }
  };

  // triggers the input when the button is clicked
  const onButtonClick = () => {
    inputRef.current.click();
  };

  const handleInventoryCheckboxChange = (event) => {
    setInventoryCheck(event.target.checked);
    setInventoryOtherOptions(event.target.checked);
    setInvNewbatch(false);
    setInvOverwrite(false);
  };

  const handleinvOverwrite = (event) => {
    setInvOverwrite(event.target.checked);
    setInvNewbatch(false);
    setInvNewDisable(event.target.checked);
  };

  const handleinvNewbatch = (event) => {
    setInvNewbatch(event.target.checked);
    setInvOverwrite(false);
    setInvoverDisable(event.target.checked);
  };

  const downloadBulkProductsHistory = () => {
    const fileUrl = isRestaurant
      ? 'https://storage.googleapis.com/twinleaves_bucket/front-end/Copy%20of%20Upload%20Menu%20Item%20From%20This%20Sheet%20-%20Less%20Data%20-%20Finished%20Items%20Master%20(6).csv'
      : 'https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_images/Bulk-Product-Upload-Sample%20-%20Sheet1%20(1).csv';

    // Create an anchor element to trigger the download
    const a = document.createElement('a');
    a.href = fileUrl;
    a.download = 'sample_pallet_bulk_product_upload_file(2025).csv'; // Set the desired filename
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const csvDataArray = [];

  const handleValidateCSV = (fileData) => {
    setProductCSVFile(fileData);
    setUpload(false);
    setProcess(true);
    setLoader1(true);
    setErrorStatement(false);
    setStep1Comp(true);
    // const uniqueFileName = `file_${Date.now()}.txt`;
    // const filePayload = new Blob([fileData], uniqueFileName, { type: 'multipart/form-data' });
    const uniqueFileName = `file_${Date.now()}.csv`;
    const filePayload = new Blob([fileData], { type: 'multipart/form-data' });

    // Create an object to store the Blob and its associated filename
    const fileObject = {
      blob: filePayload,
      filename: uniqueFileName,
    };

    const user_details = localStorage.getItem('user_details');
    const uidx = user_details ? JSON.parse(user_details).uidx : null;
    const name = localStorage.getItem('user_name');

    const payload = {
      creatorType: 'VENDOR',
      sourceId: orgId,
      sourceLocationId: locId,
      sourceType: sourceType,
      inventoryUpload: inventoryCheck,
      inventoryOverrideIfAvailable: invoverwrite,
      batchCreationIfAvailable: invNewbatch,
      overwriteIfAvailable: overRideCMS,
      createdBy: uidx,
      createdByName: name,
    };
    const newFormData = new FormData();
    // newFormData.append('file', filePayload);
    newFormData.append('file', fileObject.blob, fileObject.filename);
    newFormData.append(
      'inputFile',
      new Blob([JSON.stringify(payload)], {
        type: 'application/json',
      }),
    );

    createBulkProductJob(newFormData)
      .then((response) => {
        //
        if (response.data.status === 'SUCCESS') {
          setFileUploadeSuccess(true);
          setFileId(response.data.data.id);
          setErrorStatement(false);
          setLoader1(false);
        } else if (response.data) {
          setErrorStatement(false);
          setLoader1(false);
          setStep2Comp(true);
          const rows = response.data.split('\n');

          // Iterate over the rows to extract and format the data
          for (let i = 1; i < rows.length; i++) {
            const row = rows[i].trim();
            if (row) {
              // Split each row into columns using a comma as a delimiter
              const columns = row.split(',');

              // Create an object to store the data
              const rowData = {
                id: i,
                'Sr.No': columns[0].trim(),
                'Product Name': columns[1].trim(),
                Barcode: columns[2].trim(),
                Mrp: columns[3].trim(),
                'Purchase Price': columns[4].trim(),
                'Selling Price': columns[5].trim(),
                'Rejection Reason': columns[6].trim(),
              };

              // Push the rowData object into the csvDataArray
              csvDataArray.push(rowData);
            }
          }
          setDuplicateData(csvDataArray);
          //
        }
      })
      .catch((error) => {
        setErrorStatement(true);
        setLoader1(false);
      });
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
      field: 'Purchase Price',
      headerName: 'Purchase Price',
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

  function calculatePercentage(number, total) {
    const percentage = (number / total) * 100;
    return Math.round(percentage);
  }

  const getProductStatus = () => {
    try {
      getBulkProductById(fileId).then((res) => {
        setData(res.data.data);
        setTotalItems(res.data.data.noOfRows);
        setCMSProcessed(res.data.data.noOfRowsProcessed);
        setInvProcessed(res.data.data.noOfRowsProcessedInventory);
        const CMS = calculatePercentage(res.data.data.noOfRowsProcessed, res.data.data.noOfRows);
        const INV = calculatePercentage(res.data.data.noOfRowsProcessedInventory, res.data.data.noOfRows);
        setCMSProgress(CMS);
        setINVProgress(INV);
      });
    } catch (error) {
      showSnackbar('Error: Not able to fetch data', 'error');
    }
  };

  useEffect(() => {
    getProductStatus();
  }, [fileId, invProcessed, CMSProcessed]);

  useEffect(() => {
    if (inventoryCheck && INVProgress > 98) {
      const timeoutId1 = setTimeout(() => {
        setFileUploadeSuccess(false);
        setProcess(false);
        setOpenComplete(true);
        setStep2Comp(true);
      }, 1000);

      return () => clearTimeout(timeoutId1);
    }
  }, [invProcessed, INVProgress]);

  useEffect(() => {
    if (!inventoryCheck && CMSProgress > 98) {
      const timeoutId2 = setTimeout(() => {
        setFileUploadeSuccess(false);
        setProcess(false);
        setOpenComplete(true);
        setStep2Comp(true);
      }, 1000);

      return () => clearTimeout(timeoutId2);
    }
  }, [CMSProcessed, CMSProgress]);

  const handleRefresh = () => {
    getProductStatus();
  };

  const UploadAgain = () => {
    setUpload(true);
    setProcess(false);
    setDuplicateData([]);
    setLoader1(false);
    setProductCSVFile('');
    setInventoryCheck(false);
    setInventoryOtherOptions(false);
    setInvOverwrite(false);
    setInvNewbatch(false);
    setInvoverDisable(false);
    setInvNewDisable(false);
    setErrorStatement(false);
  };

  const handleForceStop = () => {
    const payload = {
      forceStop: true,
    };

    const newSwal = Swal.mixin({
      buttonsStyling: false,
    });

    newSwal
      .fire({
        title: `Are you sure you want to stop this bulk job?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Stop',
        reverseButtons: true,
        customClass: {
          title: 'custom-swal-title',
          cancelButton: 'logout-cancel-btn',
          confirmButton: 'logout-success-btn',
        },
      })
      .then((result) => {
        if (result.isConfirmed) {
          stopBulkJobProducts(payload, fileId)
            .then((res) => {
              if (res?.data?.data?.es === 1) {
                showSnackbar(res?.data?.data?.message, 'error');
              } else {
                showSnackbar('This bulk upload has been stopped', 'success');
                navigate('/products/bulk-products');
              }
            })
            .catch((err) => {
              showSnackbar('Error while stopping the bulk upload', 'error');
            });
        }
      });
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
          {/* {upload && <SoftBox>
            <BiArrowBack onClick={() => navigate("/products/bulk-products")} style={{cursor: "pointer"}} />
          </SoftBox>} */}
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
                <div className="step-counter">1</div>
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
                <div className="step-counter">2</div>
                <div className="step-name">Step 2</div>
              </div>
              <div className={openComplete === true ? 'stepper-item completed' : 'stepper-item'}>
                <div className="step-counter">3</div>
                <div className="step-name">Finish</div>
              </div>
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
                    <input
                      ref={inputRef}
                      type="file"
                      id="input-file-upload"
                      accept=".csv, application/vnd.ms-excel"
                      onChange={handleChange}
                    />
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
                          variant={buttonStyles.primaryVariant}
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
                        {productCSVFile.name}
                      </Typography>
                    </div>
                    <button
                      onClick={() => {
                        setProductCSVFile('');
                        setInventoryCheck(false);
                        setInventoryOtherOptions(false);
                        setInvOverwrite(false);
                        setInvNewbatch(false);
                        setInvoverDisable(false);
                        setInvNewDisable(false);
                      }}
                      className="contact-upload-btn"
                    >
                      Cancel
                    </button>
                  </SoftBox>
                  <SoftBox>
                    <SoftBox>
                      <input
                        type="checkbox"
                        id="upload"
                        name="upload"
                        value="Inventory Upload"
                        style={{ marginTop: '10px' }}
                        checked={overRideCMS}
                        onChange={() => setOverRideCMS(!overRideCMS)}
                      />
                      <SoftTypography component="label" variant="caption" style={{ marginLeft: '10px' }}>
                        Do you want to overwrite the data if already available?
                      </SoftTypography>
                      <br />
                      <input
                        type="checkbox"
                        id="upload"
                        name="upload"
                        value="Inventory Upload"
                        style={{ marginTop: '10px' }}
                        checked={inventoryCheck}
                        onChange={handleInventoryCheckboxChange}
                      />
                      <SoftTypography component="label" variant="caption" style={{ marginLeft: '10px' }}>
                        Do you want to Upload to Inventory?
                      </SoftTypography>
                      <br />

                      {inventoryOtherOptions && (
                        <div style={{ marginLeft: '10px' }}>
                          <SoftBox>
                            <input
                              type="checkbox"
                              id="upload1"
                              name="upload1"
                              value="Inventory Upload1"
                              style={{ marginTop: '10px' }}
                              checked={invoverwrite}
                              onChange={handleinvOverwrite}
                              disabled={invoverDisable}
                            />
                            <SoftTypography component="label" variant="caption" style={{ marginLeft: '10px' }}>
                              Overwrite Batch (If same batch Available)
                            </SoftTypography>
                          </SoftBox>
                          <SoftBox>
                            <input
                              type="checkbox"
                              id="upload2"
                              name="upload2"
                              value="Inventory Upload2"
                              style={{ marginTop: '10px' }}
                              checked={invNewbatch}
                              disabled={invNewDisbale}
                              onChange={handleinvNewbatch}
                            />
                            <SoftTypography component="label" variant="caption" style={{ marginLeft: '10px' }}>
                              Create a new Batch (If same batch Available)
                            </SoftTypography>
                          </SoftBox>
                        </div>
                      )}
                    </SoftBox>
                  </SoftBox>
                  <SoftBox mt={2} mb={1} lineHeight={0} display="inline-block">
                    <SoftButton onClick={() => handleValidateCSV(productCSVFile)} className="vendor-add-btn">
                      Upload
                    </SoftButton>
                    <SoftButton
                      onClick={() => navigate('/products/bulk-products')}
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

              {duplicateData.length !== 0 && (
                <SoftBox className="add-customer-file-box-I">
                  <SoftTypography style={{ margin: '10px', fontSize: '16px' }}>
                    Your file contains the following duplicate data. There are {duplicateData.length} duplicate rows.
                    You can also download to see duplicate data.
                  </SoftTypography>
                  <div style={{ height: 400, width: '100%' }}>
                    <DataGrid rows={duplicateData} columns={columns} pageSize={10} pagination />
                  </div>
                  <SoftBox mt={2} mb={1} ml={2} lineHeight={0} display="inline-block">
                    <SoftButton
                      onClick={handleDownloadCSV}
                      variant={buttonStyles.primaryVariant}
                      className="contained-softbutton"
                    >
                      Download
                    </SoftButton>
                    <SoftButton
                      onClick={() => navigate('/products/bulk-products')}
                      className="vendor-second-btn"
                      style={{ marginLeft: '20px' }}
                    >
                      Cancel
                    </SoftButton>
                  </SoftBox>
                </SoftBox>
              )}
            </>
          )}

          {errorStatement && (
            <SoftBox className="add-customer-file-box-I">
              <SoftTypography style={{ margin: '10px', fontSize: '16px' }}>
                There was an error parsing your file. Please check and try again. Please Upload your File again
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
                <Typography style={{ margin: '15px', fontSize: '14px', fontWeight: '600' }}>
                  Uploading to CMS
                </Typography>
                <div>
                  <SoftProgress variant="gradient" value={CMSProgress} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography style={{ margin: '15px', fontSize: '13px', fontWeight: '200' }}>
                    {CMSProcessed}/{totalItems} Items Processed
                  </Typography>
                  <Typography style={{ margin: '15px', fontSize: '13px', fontWeight: '200' }}>
                    {CMSProgress}% uploaded
                  </Typography>
                </div>
              </SoftBox>
              {inventoryCheck && (
                <SoftBox>
                  <Typography style={{ margin: '15px', fontSize: '14px', fontWeight: '600' }}>
                    Uploading to Inventory
                  </Typography>
                  <div>
                    <SoftProgress variant="gradient" value={INVProgress} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography style={{ margin: '15px', fontSize: '13px', fontWeight: '200' }}>
                      {invProcessed}/{totalItems} Items Processed
                    </Typography>
                    <Typography style={{ margin: '15px', fontSize: '13px', fontWeight: '200' }}>
                      {INVProgress}% uploaded
                    </Typography>
                  </div>
                </SoftBox>
              )}
              <SoftBox mt={2} mb={1} ml={2} lineHeight={0} display="inline-block">
                <SoftButton onClick={() => navigate('/products/bulk-products')} className="vendor-add-btn">
                  Continue
                </SoftButton>
                <SoftButton onClick={handleRefresh} className="vendor-second-btn" style={{ marginLeft: '20px' }}>
                  Refresh
                </SoftButton>
                <SoftButton onClick={handleForceStop} className="vendor-add-btn" style={{ marginLeft: '20px' }}>
                  Stop Execution
                </SoftButton>
              </SoftBox>
            </SoftBox>
          )}

          {openComplete && (
            <SoftBox className="add-customer-file-box-I">
              <SoftTypography style={{ margin: '10px', fontSize: '16px' }}>
                Congratulations! Your file has been processed successfully and all your products has been added to CMS
                and Inventory. You can view your file on the Products page.
              </SoftTypography>
              <SoftBox mt={2} mb={1} ml={2} lineHeight={0} display="inline-block">
                <SoftButton onClick={() => navigate('/products/bulk-products')} className="vendor-add-btn">
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

export default BulkUpload;
