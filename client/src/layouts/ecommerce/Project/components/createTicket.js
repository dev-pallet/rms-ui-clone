import React, { useEffect, useState } from 'react';
import SoftBox from '../../../../components/SoftBox';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import {
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputLabel,
  TextField,
  useMediaQuery,
} from '@mui/material';
import SoftInput from '../../../../components/SoftInput';
import SoftSelect from '../../../../components/SoftSelect';

import TaskIcon from '@mui/icons-material/Task';
import SoftTypography from '../../../../components/SoftTypography';
import { useNavigate, useParams } from 'react-router-dom';
import SoftButton from '../../../../components/SoftButton';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import SoftTypographyRoot from '../../../../components/SoftTypography/SoftTypographyRoot';
import { useMutation, useQueries, useQuery } from '@tanstack/react-query';
import { fetchFeatureData, fetchProjectData, fetchTicketById } from './apiCall';
import { createAttachments, createTicket, deleteAttachments, updateTask } from '../../../../config/Services';
import { useSnackbar } from '../../../../hooks/SnackbarProvider';
import MicIcon from '@mui/icons-material/Mic';

import { mt } from 'date-fns/locale';
import VoiceRecorder from './voiceRecord';
import { useSelector } from 'react-redux';
import {
  addAudioURL,
  clearAllUrls,
  getAudioURL,
  resetAudioState,
} from '../../../../datamanagement/Filters/voiceRecordSlice';
import { useDispatch } from 'react-redux';

const inputLabelStyle = { fontWeight: 'bold', fontSize: '0.75rem', color: '#344767', padding: 1 };

const CreateTicket = () => {
  const isMobile = useMediaQuery(`(max-width: 567px)`);

  const [files, setFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [ticket, setTicket] = useState({
    title: '',
    project: '',
    feature: '',
    summary: '',
  });
  const [selectedProject, setSelectedProject] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const navigate = useNavigate();
  const showSnackbar = useSnackbar();
  const dispatch = useDispatch();
  const { taskId } = useParams();
  const audioUrls = useSelector(getAudioURL);
  const [localAudioUrls, setLocalAudioUrls] = useState([]);
  const [formattedAudio, setFormattedAudio] = useState([]);
  const [formattedImage, setFormattedImage] = useState([]);
  const [open, setOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  let summaryMaxLength = 1500;
  let titleMaxLength = 150;
  const [wordCount, setWordCount] = useState(summaryMaxLength);
  const [titleWordCount, setTitleWordCount] = useState(titleMaxLength);

  const handleChange = (name, value) => {
    setTicket((prev) => {
      const updatedTask = { ...prev, [name]: value };

      if (name === 'project') {
        updatedTask.feature = ''; // Resetting feature
      }
      return updatedTask;
    });

    // Handle word count for 'summary'
    if (name === 'title') {
      const words = value?.trim().split(/\s+/) || [];
      const wordCount = words.length;
      const remainingCharacters = titleMaxLength - wordCount;

      if (remainingCharacters === 0) {
        showSnackbar('You have reached the 150-word limit for the title.', 'warning');
      }
      setTitleWordCount(Math.max(0, remainingCharacters));
    }

    if (name === 'summary') {
      const words = value?.trim().split(/\s+/) || [];
      const wordCount = words.length;
      const remainingCharacters = summaryMaxLength - wordCount;

      if (remainingCharacters === 0) {
        showSnackbar('You have reached the 1500-words limit for the Summary.', 'warning');
      }
      setWordCount(Math.max(0, remainingCharacters));
    }

    if (name === 'project') {
      setSelectedProject(value?.value);
    }
  };

  const handleIconClick = () => {
    document.getElementById('file-input').click();
  };
  const MAX_FILE_SIZE = 150 * 1024 * 1024;
  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);

    const exceedingFile = selectedFiles?.find((file) => {
      let value = file.size > MAX_FILE_SIZE;
      return value;
    });

    if (exceedingFile) {
      showSnackbar('File exceeds the 150 MB size limit. Please select smaller files.', 'error');
      return;
    }

    const updatedFiles = selectedFiles?.map((file) => {
      let fileDetails = { file, preview: null, type: 'document', name: file.name };

      if (file.type.startsWith('image/')) {
        fileDetails = { file, preview: URL.createObjectURL(file), type: 'image', name: file.name };
      } else if (file.type.startsWith('video/')) {
        fileDetails = { file, preview: URL.createObjectURL(file), type: 'video', name: file.name };
      } else if (file.type === 'application/pdf') {
        fileDetails = { file, preview: URL.createObjectURL(file), type: 'pdf', name: file.name }; // Set preview for PDFs
      }

      return fileDetails;
    });
    setFiles((prevFiles) => [...prevFiles, ...updatedFiles]);

    // Convert files to base64 before uploading
    convertFilesToBase64(updatedFiles);

    // convertFilesToBase64(updatedFiles, audioUrls);
  };

  const handleAudioUpload = (audioUrls) => {
    const lastIndexOfAudio = audioUrls.length - 1;
    if (!audioUrls) {
      console.error('No audio URL provided');
      return;
    }

    const exceedingFile = audioUrls?.find((audioUrl) => {
      const fileSize = audioUrl?.size || 0;

      let value = fileSize > MAX_FILE_SIZE;

      return value;
    });

    if (exceedingFile) {
      showSnackbar('File exceeds the 150MB size limit. Please select smaller files.', 'error');
      return;
    }

    convertBlobUrlsToBase64([audioUrls?.[lastIndexOfAudio]])
      .then((res) => {
        const payload = res?.map((base64) => ({
          file: base64,
        }));

        createFile(payload, 'audio');
      })
      .catch((error) => {
        showSnackbar(error?.response?.data?.message || error?.message, 'error');
      });
  };

  async function convertBlobUrlsToBase64(blobUrls) {
    const base64Array = [];

    for (const blobUrl of blobUrls) {
      const response = await fetch(blobUrl);

      const blob = await response.blob();
      const base64 = await blobToBase64(blob);
      base64Array.push(base64);
    }

    return base64Array;
  }

  function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]); // Extract Base64 without the metadata prefix
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  const convertFilesToBase64 = (files) => {
    try {
      const base64Files = [];
      const promises = files.map((fileDetails) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64String = reader.result.split(',')[1];
            base64Files.push({
              file: fileDetails.file,
              base64: base64String,
            });
            resolve();
          };
          reader.onerror = reject;
          reader.readAsDataURL(fileDetails.file);
        });
      });

      Promise.all(promises)
        .then(() => {
          const payload = base64Files.map(({ base64 }) => ({
            file: base64,
          }));
          //   ...audioUrls.map((audioUrl) => ({
          //     audioUrl,
          //   })),
          // ];

          createFile(payload);
        })
        .catch((error) => {
          showSnackbar(error?.response?.data?.message || error?.message, 'error');
        });
    } catch (error) {
      showSnackbar(error?.response?.data?.message || error?.message, 'error');
    }
  };

  // Function to call the API with the payload
  const createFile = async (payload, fileType) => {
    try {
      setIsUploading(true);
      const response = await createAttachments(payload); // API call
      let val = response?.data?.data?.data?.[0]?.file;
      let imageValue = response?.data?.data?.data?.map((item) => ({ file: item?.file, type: item?.fileType }));

      if (fileType === 'audio') {
        // setFormattedAudio((prev) => [...prev, val]);
        setFormattedAudio((prev) => {
          if (!prev.some((audio) => audio === val)) {
            return [...prev, val];
          }
          return prev;
        });
      } else {
        setFormattedImage((prev) => [...prev, ...imageValue]);
      }
    } catch (error) {
      showSnackbar(error?.response?.data?.message || error?.message, 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteImage = async (index) => {
    const fileObject = files?.preview?.[index] || formattedImage?.[index];

    const fullFilePath = fileObject?.file;

    const relativeFilePath = fullFilePath.includes('twinleaves_dev_public/')
      ? fullFilePath.split('twinleaves_dev_public/')[1]
      : null;

    const payload = {
      attachmentId: '',
      filePath: relativeFilePath,
    };

    // const payload = {
    //   // filePath: formattedImage?.[index],
    //   filePath: files?.preview?.[index],
    // };

    const response = await deleteAttachments(payload);
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setFormattedImage((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeleteForEdit = (index) => {
    const fileObject = files[index]?.preview || formattedImage?.[index];

    const fullFilePath = fileObject || null;
    const relativeFilePath = fullFilePath.includes('twinleaves_dev_public/')
      ? fullFilePath.split('twinleaves_dev_public/')[1]
      : null;

    const attachmentId = files[index]?.id || null;

    const payload = {
      attachmentId: attachmentId || '',
      filePath: relativeFilePath || '',
    };

    deleteAttachments(payload).then((res) => {
      showSnackbar(res?.data?.data?.message, 'successfully deleted ');
    });
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setFormattedImage((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDeleteSelected = () => {
    setFiles((prevFiles) => prevFiles.filter((_, index) => !selectedFiles.includes(index)));
    setSelectedFiles([]);
  };

  const handleCheckboxChange = (index) => {
    setSelectedFiles((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]));
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedFiles(files.map((_, index) => index));
    } else {
      setSelectedFiles([]);
    }
  };

  const queries = useQueries({
    queries: [
      {
        queryKey: ['projectDropdown', currentPage, debouncedQuery],
        queryFn: () => fetchProjectData(currentPage, debouncedQuery),
        staleTime: 50000,
      },
      {
        queryKey: ['featureDropdown', selectedProject, currentPage, debouncedQuery],
        queryFn: () =>
          selectedProject ? fetchFeatureData(selectedProject, currentPage, debouncedQuery) : Promise.resolve([]),
        enabled: !!selectedProject, // Only fetch when a project is selected
      },
    ],
  });
  const [projectDropdown, featureDropdown] = queries?.map((q) => q.data);
  const isLoading = queries.some((q) => q.isLoading);
  const isError = queries.some((q) => q.isError);

  const isCreate = location.pathname === '/project/create';
  const { mutate: validateCreatetask, isLoading: isValidating } = useMutation({
    mutationKey: ['validateCreatetask'],
    mutationFn: async (payload) => {
      const response = isCreate ? await createTicket(payload) : await updateTask(payload);
      // await createTicket(payload)

      if (response?.data?.es > 0) {
        showSnackbar(response?.data?.message, 'error');
        return;
      }
      return response;
    },
    onSuccess: (res) => {
      const newTask = res?.data?.data?.tasks;
      showSnackbar(res?.data?.data?.message, 'success');
      navigate('/setting-help-and-support/raise-ticket/project', { state: { newTask } }); //not working
    },
    onError: (error) => {
      showSnackbar(error?.response?.data?.message || error?.message, 'error');
    },
  });

  const validateFields = () => {
    const requiredFields = [
      { field: ticket?.title, name: 'Ticket Title' },
      { field: ticket?.project, name: 'Project' },
      { field: ticket?.feature, name: 'Feature' },
    ];

    for (let { field, name } of requiredFields) {
      if (!field || (typeof field === 'object' && !field.label)) {
        showSnackbar(`Please fill out the required field: ${name}`, 'error');
        return false;
      }
    }
    return true;
  };

  //required information from local storage
  const createByval = localStorage.getItem('user_details');
  const userDetails = JSON.parse(createByval);
  const uidxVal = userDetails.uidx;
  const contactNumber = userDetails.mobileNumber;
  const storeName = localStorage.getItem('orgName');
  const source_location_Id = localStorage.getItem('locId'); //RLC_40
  const source_location_name = localStorage.getItem('locName');
  const org_Id = localStorage.getItem('orgId'); //RET_39
  const createByNameVal = localStorage.getItem('user_name');
  // const destination_loacation_Id = localStorage.getItem('sourceApp')

  useEffect(() => {
    return () => {
      dispatch(resetAudioState());
    };
  }, []);

  const handleSave = () => {
    if (isProcessing) return;
    if (!validateFields()) {
      return;
    }
    setIsProcessing(true);
    const attachments = [
      ...formattedAudio?.map((url) => ({
        path: url,
        fileType: 'audio',
      })),
      ...formattedImage?.map((file) => ({
        path: file.file,
        fileType: file.type || 'image',
      })),
    ];

    const payload = {
      taskName: ticket?.title,
      projectId: ticket?.project['value'],
      featureId: ticket?.feature['value'],
      summary: ticket?.summary?.replace(/<\/?[^>]+(>|$)/g, ''),
      issueRaisedBy: createByNameVal,
      organizationId: org_Id,
      organizationName: storeName,
      sourceLocationId: source_location_Id,
      destinationLocationId: 'PALLET', //confusion
      selectedStore: source_location_name,
      storeContact: contactNumber,
      attachments,
      createdBy: uidxVal,
      updatedBy: uidxVal,
      createdByName: createByNameVal,
      updatedByName: createByNameVal,
    };

    validateCreatetask(payload)
      .then(() => {
        setFormattedImage([]);
        setFormattedAudio([]);
        dispatch(addAudioURL([]));
        dispatch(clearAllUrls());
        setIsProcessing(false);
        // setLocalAudioUrls([]);
      })
      .catch(() => {
        setIsProcessing(false);
      });
  };

  const handleUpdate = () => {
    const attachments = [
      ...formattedAudio?.map((url) => ({
        path: url,
        fileType: 'audio',
      })),
      ...formattedImage?.map((file) => ({
        path: file.file,
        fileType: file.type || 'image',
      })),
    ];

    const payload = {
      taskId: taskId,
      taskName: ticket?.title,
      projectId: ticket?.project?.value,
      featureId: ticket?.feature?.value,
      summary: ticket?.summary.replace(/<\/?[^>]+(>|$)/g, ''),
      attachments,
      updatedBy: uidxVal,
      updatedByName: createByNameVal,
    };
    validateCreatetask(payload);
  };

  const handleFilledTicketData = (taskData) => {
    const newValues = {};

    const filteredImageValues = taskData?.attachments
      ?.filter((item) => item?.attachmentType !== 'audio') // Exclude audio files
      ?.map((item) => ({
        preview: item?.attachmentUrl,
        type: item?.attachmentType,
        id: item?.attachmentId,
      }));

    const filteredAudioValues = taskData?.attachments
      ?.filter((item) => item?.attachmentType === 'audio')
      ?.map((item) => ({
        id: item?.attachmentId,
        url: item?.attachmentUrl,
      }));

    newValues.title = taskData?.title;
    newValues.project = {
      label: taskData?.product,
      value: taskData?.product,
    };
    newValues.feature = {
      label: taskData?.feature,
      value: taskData?.feature,
    };
    newValues.summary = taskData?.summary;

    //newValues.files = taskData?.attachments?.map((item) => item.attachmentType === "image" ? attachmentUrl)
    newValues.selectedStore = taskData?.storeName;
    newValues.sourceLocationId = taskData?.sourceLocationId;
    newValues.destinationLocationId = taskData?.sourceDestinationId;
    newValues.updatedBy = taskData?.updatedBy;
    newValues.updatedByName = taskData.updatedByName;
    setTicket((prevData) => ({
      ...prevData,
      ...newValues,
    }));

    setFiles(filteredImageValues || []);
    dispatch(addAudioURL(filteredAudioValues || []));
  };
  useEffect(() => {
    if (taskId) {
      fetchTicketById(taskId)
        .then((res) => {
          handleFilledTicketData(res?.data?.data?.data);
        })
        .catch((error) => {
          showSnackbar(error?.response?.data?.message || error?.message, 'error');
        });
    }
  }, [taskId]);

  const isTaskFilled = () => {
    let taskData = Object.values(ticket).some((taskval) => taskval !== '');
    return taskData;
  };
  const handleCancel = () => {
    if (isTaskFilled()) {
      setOpen(true);
    } else {
      navigate('/setting-help-and-support/raise-ticket/project');
    }
  };

  const handleConfirmCancel = () => {
    setOpen(false);
    navigate('/setting-help-and-support/raise-ticket/project');
  };

  return (
    <DashboardLayout>
      <DashboardNavbar prevLink={true} />
      <Card sx={{ padding: 2, borderRadius: 24, boxShadow: '2px 0px 10px rgba(3,3)', mt: 2 }}>
        <SoftBox sx={{ display: 'flex', justifyContent: 'flex-center', alignItems: 'center', gap: 1 }}>
          <TaskIcon sx={{ color: '#007aff' }} />
          <SoftTypography sx={{ fontSize: 14 }}> New Ticket</SoftTypography>
        </SoftBox>
      </Card>
      <Card sx={{ padding: 3, mt: 3 }}>
        <SoftBox>
          <InputLabel sx={inputLabelStyle} required>
            Title
          </InputLabel>
          <TextField
            id="fullWidth"
            sx={{
              '& .MuiOutlinedInput-input': {
                width: '100% !important',
              },
            }}
            className="textfield"
            name="title"
            value={ticket?.title}
            onChange={(e) => handleChange(e.target.name, e.target.value)}
            inputProps={{
              maxLength: 1021,
            }}
            fullWidth
          />
          <div
            style={{
              textAlign: 'right',
              color: titleWordCount === 0 ? 'red' : 'gray',
              fontSize: '0.8rem',
              marginTop: '4px',
            }}
          >
            {titleWordCount}/{titleMaxLength} words
          </div>
        </SoftBox>

        <SoftBox sx={{ mt: 3, display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: 10 }}>
          <SoftBox>
            <InputLabel sx={inputLabelStyle} required>
              Products/ Project
            </InputLabel>
            <SoftSelect
              name="project"
              isLoading={isLoading}
              value={ticket?.project}
              options={projectDropdown}
              menuPortalTarget={document.body}
              onChange={(e) => {
                handleChange('project', e);
              }}
            />
          </SoftBox>

          <SoftBox>
            <InputLabel sx={inputLabelStyle} required>
              Modules/Feature
            </InputLabel>
            <SoftSelect
              name="feature"
              isLoading={isLoading}
              value={ticket?.feature}
              options={featureDropdown}
              menuPortalTarget={document.body}
              onChange={(e) => handleChange('feature', e)}
            />
          </SoftBox>
        </SoftBox>

        <SoftBox sx={{ mt: 3 }}>
          <InputLabel sx={inputLabelStyle}>Summary</InputLabel>
          <SoftInput
            multiline
            rows={5}
            name="summary"
            value={ticket?.summary || ''}
            onChange={(e) => handleChange(e.target.name, e.target.value)}
            inputProps={{
              maxLength: 10281,
            }}
            placeholder="Enter your summary here..."
            style={{ width: '100%' }}
          />
          <div
            style={{
              textAlign: 'right',
              color: wordCount === 0 ? 'red' : 'gray',
              fontSize: '0.8rem',
              marginTop: '4px',
            }}
          >
            {wordCount}/{summaryMaxLength} words
          </div>
        </SoftBox>

        {/* {isMobile ? (
          <SoftBox>
            <SoftTypography
              sx={{ color: '#030303', fontSize: '14px', fontWeight: 500, lineHeight: '18px', marginTop: '12px' }}
            >
              Record Voice
            </SoftTypography>

            <SoftBox sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '12px' }}>
              <textarea id="voice" />

              <MicIcon fontSize="large" />
            </SoftBox>
          </SoftBox>
        ) : (
          <SoftBox>
            <SoftTypography
              sx={{ color: '#030303', fontSize: '14px', fontWeight: 500, lineHeight: '18px', marginTop: '12px' }}
            >
              Record Voice
            </SoftTypography>

            <SoftBox sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '12px' }}>
              <textarea id="voice" />
              <SoftButton size="small" color="info" onClick={handleVoice}>
                Start
              </SoftButton>
            </SoftBox>
          </SoftBox>
        )} */}
        <VoiceRecorder
          handleAudioUpload={handleAudioUpload}
          formattedAudio={formattedAudio}
          setFormattedAudio={setFormattedAudio}
        />
        <span style={{ width: '14%' }}>
          <SoftBox
            style={{ display: 'flex', gap: '5px', alignItems: 'center', cursor: 'pointer', marginTop: '3px' }}
            onClick={handleIconClick}
          >
            <AttachFileIcon color="info" />
            <SoftTypography sx={{ color: '#030303', fontSize: '14px', fontWeight: 500, lineHeight: '18px' }}>
              Attachment{' '}
            </SoftTypography>

            <input
              id="file-input"
              type="file"
              accept=".jpg,.jpeg,.png,.gif,.pdf,.xls,.xlsx,.doc,.docx,.mp4,.mov,.avi,.mkv"
              style={{ display: 'none !important' }}
              onChange={handleFileChange}
              multiple
            />
          </SoftBox>
        </span>
        {/* {files?.length > 1 && (
          <SoftBox sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: 1 }}>
            <input type="checkbox" onChange={handleSelectAll} checked={selectedFiles?.length === files?.length} />
            <span style={{ fontSize: '14px' }}>Select All</span>
          </SoftBox>
        )} */}

        {/* <a href={fileObject?.preview} target="_blank" rel="noopener noreferrer" key={`image-${index}`}>
                  <PictureAsPdfIcon style={{ marginRight: '10px' }} />
                </a> */}
        <SoftBox sx={{ mt: 2 }}>
          {files?.map((fileObject, index) => {
            return (
              <SoftBox key={index} sx={{ marginBottom: '10px' }}>
                {fileObject?.type?.includes('image') ? (
                  <a href={fileObject?.preview} target="_blank" rel="noopener noreferrer" key={`image-${index}`}>
                    <img
                      src={fileObject?.preview}
                      alt="preview"
                      width="50"
                      height="50"
                      style={{ marginRight: '10px' }}
                    />
                  </a>
                ) : fileObject?.type?.includes('video') ? (
                  <>
                    <video width="60" height="60" controls style={{ marginRight: '10px' }}>
                      <source src={fileObject?.preview} type={fileObject?.file?.type} />
                      Your browser does not support the video tag.
                    </video>
                    <br />
                    <a
                      href={fileObject?.preview}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        textAlign: 'center',
                        marginTop: '5px',
                        textDecoration: 'none',
                        color: '#505050',
                        fontSize: '13px',
                        fontWeight: 600,
                      }}
                    >
                      Open Video
                    </a>
                  </>
                ) : fileObject?.name?.endsWith('.pdf') ? (
                  <a href={fileObject?.preview} target="_blank" rel="noopener noreferrer">
                    <PictureAsPdfIcon
                      style={{ marginRight: '10px', cursor: 'pointer', color: 'black' }}
                      fontSize="medium"
                    />
                  </a>
                ) : (
                  <a href={fileObject?.preview} target="_blank" rel="noopener noreferrer" key={`default-${index}`}>
                    <PictureAsPdfIcon style={{ marginRight: '10px', cursor: 'pointer' }} />
                  </a>
                )}

                <span style={{ fontSize: '14px', fontWeight: 500, lineHeight: '18px' }}>
                  {fileObject?.name}
                  <DeleteOutlineIcon
                    sx={{ cursor: 'pointer', color: '#007aff' }}
                    fontSize="medium"
                    onClick={() => (isCreate ? handleDeleteImage(index) : handleDeleteForEdit(index))}
                  />
                </span>
              </SoftBox>
            );
          })}
        </SoftBox>
        {selectedFiles?.length > 0 && (
          <SoftButton onClick={handleDeleteSelected} size="small" variant="outlined" color="info" sx={{ width: 20 }}>
            Delete
          </SoftButton>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
          <SoftButton size="small" variant="outlined" color="info" onClick={handleCancel}>
            Cancel
          </SoftButton>
          <SoftButton
            size="small"
            color="info"
            disabled={isUploading || isProcessing}
            onClick={() => (isCreate ? handleSave() : handleUpdate())}
          >
            {isCreate ? 'Create Ticket' : 'Edit Ticket'}
          </SoftButton>
        </div>
      </Card>
      <Dialog open={open}>
        <DialogTitle>Cancel</DialogTitle>
        <DialogContent>
          <DialogContentText>You have data. Are you sure you want to cancel?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            No
          </Button>
          <Button onClick={handleConfirmCancel} color="secondary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

export default CreateTicket;
