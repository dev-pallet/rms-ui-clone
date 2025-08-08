import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloseIcon from '@mui/icons-material/Close';
import TaskIcon from '@mui/icons-material/Task';
import { Box, Button, Card, Checkbox, Grid, InputLabel, Modal, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SoftBox from '../../../../../components/SoftBox';
import SoftButton from '../../../../../components/SoftButton';
import SoftInput from '../../../../../components/SoftInput';
import SoftTypography from '../../../../../components/SoftTypography';
import { createTotDocument, deleteTotFile, updateTotDocument, viewTotDocuments } from '../../../../../config/Services';
import AddvendorApiCall from '../addvendor/AddvendorApiCall';

const btnStyle = {
  padding: '10px 20px',
  backgroundColor: '#0064fe',
  color: 'white',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '0.85rem',
  fontWeight: '500',
};
const AddLegalDocuments = ({ handleTab }) => {
  const navigate = useNavigate();
  const vendorId = localStorage.getItem('vendorId');
  const { editVendorId } = useParams();
  const [dataRefresh, setDataRefresh] = useState(false);
  const user_details = localStorage.getItem('user_details');
  const createdById = user_details && JSON.parse(user_details).uidx;
  const [documentNames, setDocumentNames] = useState({
    fileName: [],
    fileUrl: [],
    fileCode: [],
    validFrom: [],
    validUpto: [],
  });
  const [fileData, setFileData] = useState({});
  const [documentRowCount, setDocumentRowCount] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [totfile, setTotFile] = useState(null);
  const [totDocumentData, setTotDocumentData] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const handleCheckboxChange = (event) => {
    if (event.target.checked) {
      setIsModalOpen(true);
      setIsChecked(true);
    } else {
      setIsChecked(false);
    }
  };

  const onFileChange = (event, fileName, index) => {
    setTotFile(event.target.files[0]);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = () => {
    // Handle file submission logic here
    const vendorIdData = editVendorId ? editVendorId : vendorId;
    const payload = {
      documentName: 'TOT',
      validFrom: '',
      validTo: '',
      entityId: vendorIdData || '',
      entityType: 'VENDOR',
      createdBy: createdById,
      updatedBy: createdById,
    };
    if (totDocumentData?.[0]?.code) {
      payload.code = totDocumentData?.[0]?.code;
    }

    const formData = new FormData();
    formData.append('file', totfile);
    formData.append(
      'request',
      new Blob([JSON.stringify(payload)], {
        type: 'application/json',
      }),
    );

    const functionText = totDocumentData?.[0]?.code ? updateTotDocument : createTotDocument;
    functionText(formData)
      .then((res) => {
        let name;
        let value;
        let fileUrl;

        if (code) {
          name = res?.data?.data?.data?.documentName || '';
          value = res?.data?.data?.data?.code || '';
          fileUrl = res?.data?.data?.data?.documentUrl || '';
        } else {
          name = res?.data?.data?.data[0]?.documentName || '';
          value = res?.data?.data?.data[0]?.code || '';
          fileUrl = res?.data?.data?.data[0]?.documentUrl || '';
        }
        setDocumentNames((prevState) => ({
          ...prevState,
          fileName: [...prevState.fileName.slice(0, index), name, ...prevState.fileName.slice(index + 1)],
          fileCode: [...prevState.fileCode.slice(0, index), value, ...prevState.fileCode.slice(index + 1)],
          fileUrl: [...prevState.fileUrl.slice(0, index), fileUrl, ...prevState.fileUrl.slice(index + 1)],
        }));
      })
      .catch(() => {});
    setIsModalOpen(false);
  };

  const inputRef = useRef();

  useEffect(() => {
    viewTotDocuments(editVendorId)
      .then((res) => {
        const docData = res?.data?.data?.data;
        const filteredDocData = docData?.filter((item) => item?.documentName !== 'TOT');
        const totDocData = docData?.filter((item) => item?.documentName === 'TOT');
        if (totDocData?.length > 0) {
          setIsChecked(true);
          setTotFile(totDocData);
        }
        setTotDocumentData(totDocData);
        const filenames = filteredDocData?.map((item) => item?.documentName);
        const fileCodes = filteredDocData?.map((item) => item?.code);
        const fileUrl = filteredDocData?.map((item) => item?.documentUrl);
        const validFrom = filteredDocData?.map((item) => item?.validFrom);
        const validUpto = filteredDocData?.map((item) => item?.validTo);
        setDocumentNames((prevState) => ({
          ...prevState,
          fileName: filenames || [],
          fileCode: fileCodes || [],
          fileUrl: fileUrl || [],
          validFrom: validFrom || [],
          validUpto: validUpto || [],
        }));
        setDocumentRowCount(filteredDocData?.length || 1);
      })
      .catch(() => {});
  }, [dataRefresh]);

  const handleFileChange = (e, documentName, index, code) => {
    const file = e.target.files[0];
    handleUploadTotDocumnets(file, documentName, index, code);
  };

  const handleUploadTotDocumnets = (file, documentName, index, code) => {
    setFileData((prevFileData) => {
      return {
        ...prevFileData,
        [index]: file,
      };
    });
    const vendorIdData = editVendorId ? editVendorId : vendorId;

    const payload = {
      // "id": 0,
      // "code": "string",
      documentName: documentName || '',
      // "documentUrl": "string",
      // "documentMultipart": "string",
      validFrom: documentNames?.validFrom[index],
      validTo: documentNames?.validUpto[index],
      entityId: vendorIdData || '',
      entityType: 'VENDOR',
      createdBy: createdById,
      updatedBy: createdById,
    };
    if (code) {
      payload.code = code;
    }
    const formData = new FormData();
    formData.append('file', file);
    formData.append(
      'request',
      new Blob([JSON.stringify(payload)], {
        type: 'application/json',
      }),
    );
    const funtionText = code ? updateTotDocument : createTotDocument;
    funtionText(formData)
      .then((res) => {
        let name;
        let value;
        let fileUrl;

        if (code) {
          name = res?.data?.data?.data?.documentName || '';
          value = res?.data?.data?.data?.code || '';
          fileUrl = res?.data?.data?.data?.documentUrl || '';
        } else {
          name = res?.data?.data?.data[0]?.documentName || '';
          value = res?.data?.data?.data[0]?.code || '';
          fileUrl = res?.data?.data?.data[0]?.documentUrl || '';
        }
        setDocumentNames((prevState) => ({
          ...prevState,
          fileName: [...prevState.fileName.slice(0, index), name, ...prevState.fileName.slice(index + 1)],
          fileCode: [...prevState.fileCode.slice(0, index), value, ...prevState.fileCode.slice(index + 1)],
          fileUrl: [...prevState.fileUrl.slice(0, index), fileUrl, ...prevState.fileUrl.slice(index + 1)],
        }));
      })
      .catch(() => {});
  };

  const handleDeleteTotFile = () => {
    deleteTotFile(totDocumentData?.[0]?.code)
      .then((res) => {
        setDataRefresh(!dataRefresh);
        setIsChecked(false);
        setTotFile(null);
      })
      .catch(() => {});
  };

  const handleDeleteTotDocuments = (documentCode, index) => {
    deleteTotFile(documentCode)
      .then((res) => {
        setDataRefresh(!dataRefresh);
      })
      .catch(() => {});
  };
  const documents = ['GST', 'Pan Card', 'Incorporation Certificate', 'Personal ID', 'Aggrement'];
  return (
    <>
      <Card className="addbrand-Box">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <SoftBox display="flex" gap="10px" alignItems="center" mb={1}>
            <Checkbox onChange={handleCheckboxChange} checked={isChecked} />
            <Modal
              open={isModalOpen}
              onClose={handleCloseModal}
              aria-labelledby="upload-file-modal"
              aria-describedby="modal-for-uploading-file"
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 400,
                  bgcolor: 'background.paper',
                  boxShadow: 24,
                  borderRadius: '8px',
                  p: 4,
                }}
              >
                <Typography fontSize="1rem" fontWeight="bold" variant="caption">
                  Upload file
                </Typography>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    {totfile ? (
                      <label
                        style={{
                          marginTop: '25px',
                          display: 'flex',
                          gap: '5px',
                          alignItems: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        <div style={{ marginTop: '-5px' }}>
                          <TaskIcon sx={{ color: '#367df3' }} />
                        </div>
                        <div style={{ marginTop: '5px' }}>
                          <p style={{ fontSize: '0.75rem', marginTop: '5px', color: '#ff9500' }}>Replace file</p>
                        </div>
                        <input type="file" style={{ display: 'none' }} onChange={(e) => onFileChange(e, 'TOT', 0)} />
                      </label>
                    ) : (
                      <label
                        style={{
                          marginTop: '25px',
                          display: 'flex',
                          gap: '5px',
                          alignItems: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        <div style={{ marginTop: '-5px' }}>
                          <AttachFileIcon sx={{ color: '#367df3' }} />
                        </div>
                        <div style={{ marginTop: '5px' }}>
                          <p style={{ fontSize: '0.75rem', marginTop: '5px' }}>Choose a file</p>
                        </div>
                        <input type="file" style={{ display: 'none' }} onChange={(e) => onFileChange(e, 'TOT', 0)} />
                      </label>
                    )}
                  </div>
                  {totfile && (
                    <div style={{ marginTop: '30px' }}>
                      <CloseIcon onClick={handleDeleteTotFile} />
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '10px', float: 'right' }}>
                  <SoftButton
                    size="small"
                    onClick={handleCloseModal}
                    variant="outlined"
                    color="secondary"
                    sx={{ mt: 2 }}
                  >
                    Close
                  </SoftButton>
                  <SoftButton size="small" onClick={handleSubmit} variant="contained" color="info" sx={{ mt: 2 }}>
                    Upload
                  </SoftButton>
                </div>
              </Box>
            </Modal>
            <SoftTypography fontSize="0.8rem" fontWeight="bold" variant="caption">
              Is vendor terms of trade (TOT) agreement executed
            </SoftTypography>
          </SoftBox>
        </div>
        <SoftTypography fontSize="0.8rem" fontWeight="bold" variant="caption" mt={1}>
          Other documents
        </SoftTypography>
        <Grid container spacing={2} mt={-0.5}>
          {Array.from({ length: documentRowCount }).map((_, index) => (
            <>
              <Grid item xs={12} md={6}>
                {index === 0 && (
                  <InputLabel
                    required
                    sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767', margin: '5px' }}
                  >
                    Document name
                  </InputLabel>
                )}

                <SoftInput
                  size="small"
                  placeholder="enter document name"
                  value={documentNames?.fileName[index] || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    setDocumentNames((prevState) => ({
                      ...prevState,
                      fileName: [...prevState.fileName.slice(0, index), value, ...prevState.fileName.slice(index + 1)],
                    }));
                  }}
                ></SoftInput>
              </Grid>
              <Grid item xs={12} md={1.5}>
                {index === 0 && (
                  <InputLabel
                    required
                    sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767', margin: '5px' }}
                  >
                    Valid from
                  </InputLabel>
                )}
                <SoftInput
                  size="small"
                  type="date"
                  value={documentNames.validFrom[index] || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    setDocumentNames((prevState) => ({
                      ...prevState,
                      validFrom: [
                        ...prevState.validFrom.slice(0, index),
                        value,
                        ...prevState.validFrom.slice(index + 1),
                      ],
                    }));
                  }}
                />{' '}
              </Grid>
              <Grid item xs={12} md={1.5}>
                {index === 0 && (
                  <InputLabel
                    required
                    sx={{ fontWeight: 'bold', fontSize: '0.75rem', color: '#344767', margin: '5px' }}
                  >
                    expiry
                  </InputLabel>
                )}

                <SoftInput
                  size="small"
                  type="date"
                  value={documentNames.validUpto[index] || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    setDocumentNames((prevState) => ({
                      ...prevState,
                      validUpto: [
                        ...prevState.validUpto.slice(0, index),
                        value,
                        ...prevState.validUpto.slice(index + 1),
                      ],
                    }));
                  }}
                />
              </Grid>
              {fileData?.[index] || documentNames?.fileUrl[index] ? (
                <Grid item xs={12} md={1.5}>
                  <label
                    style={{
                      marginTop: index === 0 && '25px',
                      display: 'flex',
                      gap: '5px',
                      alignItems: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ marginTop: '-5px' }}>
                      <TaskIcon sx={{ color: '#367df3' }} />
                    </div>
                    <div style={{ marginTop: '5px' }}>
                      <p style={{ fontSize: '0.75rem', marginTop: '5px', color: '#ff9500' }}>Replace file</p>
                    </div>
                    <input
                      type="file"
                      style={{ display: 'none' }}
                      onChange={(e) =>
                        handleFileChange(e, documentNames?.fileName[index], index, documentNames?.fileCode[index])
                      }
                    />
                  </label>
                </Grid>
              ) : (
                <Grid item xs={12} md={1.5}>
                  <label
                    style={{
                      marginTop: index === 0 && '25px',
                      display: 'flex',
                      gap: '5px',
                      alignItems: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <div>
                      <AttachFileIcon sx={{ color: '#367df3' }} />
                    </div>
                    <div style={{ marginTop: '5px' }}>
                      <p style={{ fontSize: '0.75rem', marginTop: '5px' }}>Choose a file</p>
                    </div>
                    <input
                      type="file"
                      style={{ display: 'none' }}
                      onChange={(e) => handleFileChange(e, documentNames?.fileName[index], index)}
                    />
                  </label>
                </Grid>
              )}
              <Grid item xs={12} md={1.5}>
                <div style={{ marginTop: index === 0 && '30px' }}>
                  <CloseIcon onClick={() => handleDeleteTotDocuments(documentNames?.fileCode[index], index)} />
                </div>
              </Grid>
            </>
          ))}

          <Grid item xs={12}>
            <Button onClick={() => setDocumentRowCount(documentRowCount + 1)}>+ Add more</Button>
          </Grid>
        </Grid>
      </Card>

      <AddvendorApiCall />
      {/* <SoftBox className="form-button-customer-vendor">
        <SoftButton className="vendor-second-btn">Cancel</SoftButton>
        <SoftButton className="vendor-add-btn" onClick={() => navigate('/purchase/vendors')}>
          Next
        </SoftButton>
      </SoftBox> */}
      <br />
    </>
  );
};

export default AddLegalDocuments;
