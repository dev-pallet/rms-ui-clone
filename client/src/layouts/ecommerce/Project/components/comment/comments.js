import React, { useRef, useState, useEffect, useMemo } from 'react';
import SendIcon from '@mui/icons-material/Send';
// import './comment-component.css';
import PlaneIcon from '../../../../../../src/assets/svg/Icon-paper-plane.svg';
import './comment.css';
import { MentionsInput, Mention } from 'react-mentions';
import { Avatar, Menu, MenuItem, Pagination, TablePagination } from '@mui/material';
import SoftBox from '../../../../../components/SoftBox';
import { fetchAssignee } from '../apiCall';
import CloseIcon from '@mui/icons-material/Close';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
  createAttachments,
  createTaskComment,
  deleteAttachments,
  deleteComment,
  getTaskComment,
} from '../../../../../config/Services';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useSnackbar } from '../../../../../hooks/SnackbarProvider';
import CircularProgress from '@mui/material/CircularProgress';
import CommentEdit from './editComment';
import SoftTypography from '../../../../../components/SoftTypography';
import MicIcon from '@mui/icons-material/Mic';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { franc } from 'franc';
import {
  addAudioURL,
  clearAllUrls,
  getAudioURL,
  removeAudioUrl,
  setAudioURL,
} from '../../../../../datamanagement/Filters/voiceRecordSlice';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useDebounce } from '../../../../../hooks/useDebounce';
import SoftButton from '../../../../../components/SoftButton';

const Comments = ({ taskId }) => {
  const commentRef = useRef(null);
  const createByval = localStorage.getItem('user_details');
  const userDetails = JSON.parse(createByval);
  const uidxVal = userDetails?.uidx;
  const createByNameVal = localStorage.getItem('user_name');

  const [commentFiles, setCommentFiles] = useState([]);
  const [searchComment, setSearchComment] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPage] = useState();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedComment, setSelectedComment] = useState(null);
  const [currentCommentId, setCurrentCommentId] = useState(null);
  const [commentList, setCommentList] = useState([]);
  const [loader, setLoader] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMenu = Boolean(anchorEl);
  const debounceTimer = useRef(null);
  const [comment, setComment] = useState({
    commonText: '',
    taggedUsers: [],
    taskPageUrl: '',
    taskDetailPageUrl: '',
  });
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  const dispatch = useDispatch();
  const audioUrls = useSelector(getAudioURL);
  const [start, setStart] = useState(false);
  const showSnackbar = useSnackbar();
  const [language, setLanguage] = useState('');
  const [formattedAudio, setFormattedAudio] = useState([]);
  const [formattedImage, setFormattedImage] = useState([]);

  const handleSearchFilter = (query) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchComment(value);
    handleSearchFilter(value);
  };

  //Used in mention input
  const { data: userList, isLoading: loadingUserList } = useQuery({
    refetchOnWindowFocus: false,
    queryKey: ['userList'],
    queryFn: () => {
      const response = fetchAssignee();

      return response;
    },
    onError: (error) => {
      showSnackbar(error?.response?.data?.message || error?.message, 'error');
    },
  });

  //for handling attachments of image, videos and pdf
  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);

    const updatedFiles = selectedFiles.map((file) => {
      let fileDetails = { file, preview: null, type: 'document', name: file.name };

      if (file.type.startsWith('image/')) {
        fileDetails = { file, preview: URL.createObjectURL(file), type: 'image', name: file.name };
      } else if (file.type.startsWith('video/')) {
        fileDetails = { file, preview: URL.createObjectURL(file), type: 'video', name: file.name };
      } else if (file.type === 'application/pdf') {
        fileDetails = { file, preview: URL.createObjectURL(file), type: 'pdf', name: file.name };
      }

      return fileDetails;
    });
    setCommentFiles((prevFiles) => [...prevFiles, ...updatedFiles]);
    convertFilesToBase64(updatedFiles);
  };

  //for handling audio
  const handleAudioUpload = (audioUrls) => {
    const lastIndexOfAudio = audioUrls.length - 1;
    if (!audioUrls) {
      console.error('No audio URL provided');
      return;
    }

    convertBlobUrlsToBase64([audioUrls?.[lastIndexOfAudio]])
      .then((res) => {
        const payload = res.map((base64) => ({
          file: base64,
        }));
        createFile(payload, 'audio');
      })
      .catch((error) => {
        console.error('Error converting audio to base64:', error);
      });
  };

  //function to convert into base64 audio
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

  //function to convert for images
  const convertFilesToBase64 = (files) => {
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
        createFile(payload);
      })
      .catch((error) => {
        showSnackbar(error?.response?.data?.message || error?.message, 'error');
      });
  };

  //attachments api function
  const createFile = async (payload, fileType) => {
    try {
      setIsUploading(true);
      const response = await createAttachments(payload); // API call
      let val = response?.data?.data?.data?.map((item) => item?.file);
      let imageValue = response?.data?.data?.data?.map((item) => ({ file: item?.file, type: item?.fileType }));
      if (fileType === 'audio') {
        setFormattedAudio((prev) => [...prev, val]);
      } else {
        setFormattedImage((prev) => [...prev, ...imageValue]);
      }
    } catch (error) {
      showSnackbar(error?.response?.data?.message || error?.message, 'error');
    } finally {
      setIsUploading(false);
    }
  };

  //handle comments input
  const handleComment = (event) => {
    const { name, value, files, type } = event.target;
    setComment((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //Comment save/create api
  const { mutate: createComment, isLoading: isLoadingComment } = useMutation({
    mutationKey: ['createComment'],
    mutationFn: async ({ taskId, payload }) => {
      const response = await createTaskComment(taskId, payload);
      if (response?.data?.es > 0) {
        showSnackbar(response?.data?.message, 'error');
        return;
      }

      return response;
    },
    onSuccess: (res) => {
      showSnackbar(res?.data?.data?.message, 'success');
      fetchCommentList(taskId, currentPage - 1);
    },
    onError: (error) => {
      showSnackbar(error?.response?.data?.message || error?.message, 'error');
    },
  });
  const validateFields = () => {
    const requiredFields = [{ field: comment?.commonText, name: 'Comment Text' }];

    for (let { field, name } of requiredFields) {
      if (!field) {
        showSnackbar(`Please fill out the required field: ${name}`, 'error');
        return false;
      }
    }
    return true;
  };
  //save comment function
  const handleSend = () => {
    if (!comment?.commonText?.trim() && !commentFiles?.length) {
      showSnackbar('Please add a comment or file', 'error');
      return;
    }
    if (!validateFields()) {
      return;
    }
    const plainCommentText = comment?.commonText?.replace(/@\[(.+?)\]\(.+?\)/g, '').trim();
    const locationPath = window.location.href;

    const attachments = [
      ...formattedAudio?.map((audio) => ({
        // path: Array.isArray(audio.path) ? audio.path[0] : audio.path || audio.file || audio,
        path: audio?.[0], // Ensure the path is a string
        fileType: 'audio',
      })),
      ...formattedImage?.map((image) => ({
        path: image.file,
        fileType: image?.type || 'image',
      })),
    ];

    //url on the basis of environment

    let domain = window.location.origin;
    const payload = {
      commentText: plainCommentText,
      taggedUsers: comment?.taggedUsers?.map((user) => user?.display),
      taskDetailPageUrl: locationPath,
      sourceWebsiteUrl: domain,
      createdBy: uidxVal,
      createdByName: createByNameVal,
      attachments,
    };
    createComment({ taskId, payload });
    setComment({ commonText: '', taggedUsers: [], taskPageUrl: '' });
    setCommentFiles([]);
    setFormattedImage([]);
    setFormattedAudio([]);
    setAudioChunks([]);
    dispatch(addAudioURL([]));
    dispatch(clearAllUrls());
  };
  const mentionData = useMemo(() => {
    return userList?.map((user) => ({
      id: user.value,
      display: user.label,
    }));
  }, [userList]);
  const handleIconClick = () => {
    document.getElementById('file-input').click();
  };

  // useEffect(() => {
  //   if (taskId) {
  //     fetchCommentList(taskId, currentPage - 1);
  //   }
  // }, [taskId, currentPage, debouncedQuery]);

  useEffect(() => {
    if (taskId) {
      fetchCommentList(taskId, currentPage - 1);
    }
  }, [taskId, currentPage, debouncedQuery]);

  const refreshComment = () => {
    fetchCommentList(taskId, currentPage - 1);
  };

  //get comment lists
  const fetchCommentList = async (taskId, pageNumber = currentPage - 1) => {
    const payload = {
      pageNumber,
      pageSize: 5,
      sortOrder: 'DESCENDING',
      sortBy: 'created',
      search: debouncedQuery,
    };
    try {
      setLoader(true);
      const response = await getTaskComment(taskId, payload);

      if (response?.data?.data?.es > 0) {
        showSnackbar(response?.data?.data?.message, 'error');
        return;
      }

      const newComments =
        response?.data?.data?.comments?.sort((a, b) => new Date(a.created) - new Date(b.created)) || [];
      let totalResult = response?.data?.data?.count;
      // setCommentList((prevComments) => [...prevComments, ...newComments]);

      // setCommentList(response?.data?.data?.comments);
      setCommentList(newComments);

      setTotalPage(totalResult);
      showSnackbar(response?.data?.data?.message, 'success');
    } catch (error) {
      setLoader(false);
      showSnackbar(`${error?.response?.data?.message} for comment box` || 'Something went wrong ', 'error');
    } finally {
      setLoader(false);
    }
  };

  const handleKeypress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
      e.preventDefault();
    }
  };
  const handleClick = (event, commentId) => {
    setAnchorEl(event.currentTarget);
    setCurrentCommentId(commentId);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const parseMentions = (text) => {
    return text.split(/(@\w+)/).map((part, index) =>
      part.startsWith('@') ? (
        <span key={index} style={{ color: '#007bff', fontWeight: 'bold' }}>
          {part}
        </span>
      ) : (
        part
      ),
    );
  };

  //edit comments
  const handleEdit = () => {
    if (currentCommentId) {
      const commentEdit = commentList?.find((comment) => comment.commentId === currentCommentId);
      setSelectedComment(commentEdit);
      setEditModalOpen(true);
    }
  };
  const handleCloseEditModal = () => {
    setEditModalOpen(false);
  };
  const handleDelete = async () => {
    const payload = {
      commentId: currentCommentId,
      updatedBy: uidxVal,
      updatedByName: createByNameVal,
    };
    try {
      const res = await deleteComment(payload);
      const updatedList = commentList?.filter((item) => item.commentId !== currentCommentId);
      setCommentList(updatedList);
      showSnackbar(`${res?.data?.data?.message}fully Deleted`, 'success');
    } catch (error) {
      showSnackbar(error?.response?.data?.message || error?.message, 'error');
    }
  };

  //audio function
  const startRecording = async (e) => {
    e.stopPropagation();
    setStart(true);
    try {
      resetTranscript();
      setLanguage('');
      SpeechRecognition.startListening({ continuous: true });
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];
      recorder.ondataavailable = (e) => chunks.push(e.data);

      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/mpeg' });
        const url = URL.createObjectURL(audioBlob);

        dispatch(addAudioURL(url));
        setAudioChunks([]); // Reset chunks
      };
      recorder.start();
      setMediaRecorder(recorder);
      setAudioChunks(chunks);
      setIsRecording(true);
    } catch (error) {
      showSnackbar(error?.response?.data?.message || error?.message, 'error');
    }
  };
  const langMap = {
    eng: 'English',
    hin: 'Hindi',
    mal: 'Malayalam',
    tel: 'Telugu',
    kan: 'Kannada',
    tam: 'Tamil',
    tul: 'Tulu',
    kon: 'Konkani',
    mar: 'Marathi',
    pun: 'Punjabi',
  };

  const detectLanguage = (text) => {
    const langCode = franc(text);
    return langMap[langCode] || 'Unknown';
  };

  useEffect(() => {
    if (audioUrls.length > 0) handleAudioUpload(audioUrls);
  }, [audioUrls]);

  const stopRecording = (e) => {
    e.stopPropagation();
    setStart(false);
    SpeechRecognition.stopListening();

    if (mediaRecorder) {
      mediaRecorder.stop();
      const detectedLanguage = detectLanguage(transcript);
      setLanguage(detectedLanguage);
      // translateText(transcript);
    }
    setIsRecording(false);
  };

  const clearRecording = async (index) => {
    // const filePath = formattedAudio?.[index];
    const filePath = Array.isArray(formattedAudio?.[index]) ? formattedAudio?.[index][0] : formattedAudio?.[index];
    if (typeof filePath !== 'string') {
      console.error('filePath is not a string:', filePath);
      return;
    }
    const payload = {
      filePath,
    };

    const response = await deleteAttachments(payload);
    dispatch(removeAudioUrl(index));
    setAudioChunks([]);
    resetTranscript();
    setIsRecording(false);
  };

  const clearFiles = async (filePath) => {
    const payload = {
      filePath: filePath,
    };
    const response = await deleteAttachments(payload);
    setFormattedImage((prevFiles) =>
      prevFiles.filter((item) => {
        return item.file !== filePath;
      }),
    );
  };
  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="component-bg-br-sh-p comment-main-component" style={{ marginBottom: '10px' }}>
      <div className="comments-div-second width-100" style={{ padding: 2 }}>
        <div className="comment-header-wrapper">
          <span className="purch-det-heading-title pinsights-title comments-title comment-heading">Comments</span>
          <SoftBox className="refresh-btn-wrapper">
            {Boolean(commentList?.length) && (
              <Pagination
                count={Math.ceil(totalPages / 5)}
                page={currentPage}
                onChange={handleChangePage}
                color="primary"
                size="small"
              />
            )}
            <SoftButton size="small" onClick={refreshComment}>
              <RefreshIcon />
              Refresh
            </SoftButton>
          </SoftBox>

          {/* <SoftBox
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: 1,
            }}
          >
            <input
              placeholder="Search for comment"
              className="ticket-searchbar"
              name="search"
              value={searchComment}
              onChange={handleSearchChange}
            />
          </SoftBox> */}
        </div>

        <div className="comments-main-containers" ref={commentRef}>
          {loader ? (
            <div className="loader-container" style={{ textAlign: 'center', marginTop: '10px' }}>
              <CircularProgress size={24} />
            </div>
          ) : commentList?.length === 0 ? (
            <div className="no-comment-data" style={{ fontSize: '14px' }}>
              No comments available
            </div>
          ) : (
            <div className="comments-main-div">
              {commentList?.map((comment, index) => {
                const isLoggedInUser = comment?.createdByName === createByNameVal;

                return (
                  <div
                    // className="comment-user-info"
                    key={index}
                    className={`comment-user-info project-comments ${
                      isLoggedInUser ? 'comment-right' : 'comment-left'
                    } `}
                  >
                    <div className="comment-user-names">
                      <div className="icon-container">
                        <Avatar alt="Remy Sharp" src="" sx={{ width: '1.25rem', height: '1.25rem' }} />
                        <span className="comment-username project-comment-username">{comment?.createdByName}</span>
                      </div>
                      <>
                        {isLoggedInUser && (
                          <span>
                            <SoftBox className="menu-icon-div">
                              <MoreVertIcon
                                fontSize="medium"
                                color="black"
                                className="copy-icon menu-icon"
                                onClick={(event) => handleClick(event, comment.commentId)}
                              />
                            </SoftBox>
                          </span>
                        )}
                      </>
                      <Menu
                        anchorEl={anchorEl}
                        id="account-menu"
                        open={openMenu}
                        onClose={handleCloseMenu}
                        onClick={handleCloseMenu}
                        slotProps={{
                          paper: {
                            elevation: 0,
                            sx: {
                              overflow: 'visible',
                              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                              mt: 1.5,
                              '& .MuiAvatar-root': {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                              },
                              '&::before': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: 'background.paper',
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                              },
                            },
                          },
                        }}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                      >
                        <MenuItem
                          sx={{
                            '&.MuiMenuItem-root': {
                              padding: '4px !important',
                              marginTop: '2px !important',
                              margin: '3px',
                              left: '3px',
                            },
                          }}
                          onClick={handleEdit}
                        >
                          Edit
                        </MenuItem>
                        <MenuItem
                          sx={{
                            '&.MuiMenuItem-root': {
                              padding: '4px !important',
                              marginTop: '2px !important',
                              margin: '3px',
                              left: '3px',
                            },
                          }}
                          onClick={handleDelete}
                        >
                          Delete
                        </MenuItem>
                      </Menu>
                    </div>

                    <div className="comment-info project-comment-info">
                      <span className="comment-date-desc project-data-desc">{parseMentions(comment?.comment)}</span>
                      <span>
                        {comment?.attachments?.map((item, index) => (
                          <div key={index} className="attachment" style={{ display: 'flex', alignItems: 'center' }}>
                            {item?.attachmentType.includes('image/') && (
                              <img
                                width={50}
                                height={50}
                                src={item?.attachmentUrl}
                                alt="attachment"
                                className="image-attachment"
                              />
                            )}

                            {item?.attachmentType.includes('audio') && (
                              <div className="audio-attachment">
                                <audio controls>
                                  <source src={item?.attachmentUrl} type="audio/mpeg" />
                                  Your browser does not support the audio element.
                                </audio>
                              </div>
                            )}

                            {item?.attachmentType.includes('video/') && (
                              <div className="video-attachment">
                                <video controls className="video-player" width={50} height={50}>
                                  <source width={40} height={40} src={item?.attachmentUrl} type="video/mp4" />
                                  Your browser does not support the video element.
                                </video>

                                <a
                                  href={item?.attachmentUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    display: 'block',
                                    textAlign: 'center',
                                    marginTop: '5px',
                                    textDecoration: 'none',
                                    color: '#505050',
                                    fontSize: '13px',
                                  }}
                                >
                                  Open Video
                                </a>
                              </div>
                            )}

                            {item?.attachmentType.includes('application/pdf') && (
                              <div className="pdf-attachment">
                                <a href={item?.attachmentUrl} target="_blank" rel="noopener noreferrer">
                                  View PDF
                                </a>
                              </div>
                            )}
                          </div>
                        ))}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="">
          <div className="comment-user-add">
            <Avatar alt="Remy Sharp" src="" sx={{ width: '1.25rem', height: '1.25rem' }} />
            <SoftBox className="comment-input-container">
              <MentionsInput
                value={comment?.commonText}
                onChange={(e) => handleComment({ target: { name: 'commonText', value: e.target.value } })}
                className="comment-input project-comment-input"
                placeholder="Add a comment"
                onKeyDown={handleKeypress}
              >
                <Mention
                  trigger="@"
                  data={mentionData}
                  className="mention"
                  markup="@__display__"
                  // renderSuggestion={(user) => {
                  //   return (
                  //     <div>
                  //       {user.display}
                  //       {user.id}
                  //     </div>
                  //   );
                  // }}
                  onAdd={(id, display) =>
                    setComment((prev) => ({
                      ...prev,
                      taggedUsers: [...prev?.taggedUsers, { display }],
                    }))
                  }
                />
              </MentionsInput>
              {/* --- */}

              <SoftBox className="project-image-container" onClick={handleIconClick}>
                <AttachFileIcon color="info" />

                <input
                  id="file-input"
                  type="file"
                  accept=".jpg,.jpeg,.png,.gif,.pdf,.xls,.xlsx,.doc,.docx,.mp4,.mov,.avi,.mkv"
                  className="project-image-input"
                  onChange={handleFileChange}
                  multiple
                />
                <SoftBox className={`mic-container ${start ? 'recording' : ''}`}>
                  <MicIcon
                    fontSize="small"
                    onClick={start ? stopRecording : startRecording}
                    // className='comment-mic-icon'
                    className={`mic-icon ${start ? 'active' : ''}`}
                    disabled={!isRecording}
                  />
                  <SoftTypography className="recording-status" fontSize={13}>
                    {start ? 'Recording...' : ''}
                  </SoftTypography>
                </SoftBox>
              </SoftBox>
              <SoftBox className="project-recording-icon" onClick={handleIconClick}></SoftBox>
            </SoftBox>
            <div
              style={{
                transform: 'rotate(-29deg) scale(1.3);',
                color: isUploading ? 'grey' : '#4cd964',
                cursor: isUploading ? 'not-allowed' : 'pointer',
              }}
              disabled={isUploading}
              // className="close-icon comment-send-icon"

              onClick={handleSend}
            >
              <img
                src={PlaneIcon}
                alt="Send Icon"
                className={`close-icon comment-send-icon ${isUploading ? 'disabled' : ''}`}
              />
            </div>
          </div>
          <SoftBox>
            <div className="project-audio-wrapper">
              {Boolean(audioUrls?.length) &&
                audioUrls?.map((item, index) => (
                  <div className="audio-mapping-data" key={index}>
                    <audio controls src={item}></audio>
                    <DeleteOutlineIcon className="delete-btn" onClick={() => clearRecording(index)} />
                  </div>
                ))}
            </div>
            <div className="project-audio-wrapper">
              {Boolean(formattedImage?.length) && <SoftTypography className="attachment">Attachment:</SoftTypography>}
              {formattedImage?.map((fileBlob, index) => {
                const fileType = fileBlob?.type || '';
                const fileUrl = fileBlob.file || fileBlob; // Ensure consistent access to the file path

                return (
                  <div key={index} className="attachment-item">
                    {fileType.includes('image/') && (
                      <img
                        width={40}
                        height={40}
                        src={fileUrl}
                        alt="Image preview"
                        style={{ border: '3px solid rgb(230 226 226)', borderRadius: '5px' }}
                      />
                    )}

                    {fileType.includes('video/') && (
                      <video width={40} height={40} controls>
                        <source src={fileUrl} type={fileType} />
                        Your browser does not support the video tag.
                      </video>
                    )}

                    {fileType.includes('application/pdf') && <PictureAsPdfIcon style={{ marginRight: '10px' }} />}

                    <DeleteOutlineIcon className="delete-btn" onClick={() => clearFiles(fileUrl)} />
                  </div>
                );
              })}
            </div>
          </SoftBox>
        </div>
        {editModalOpen && (
          <CommentEdit
            editModalOpen={editModalOpen}
            handleCloseEditModal={handleCloseEditModal}
            selectedComment={selectedComment}
            fetchCommentList={fetchCommentList}
            taskId={taskId}
          />
        )}
      </div>
    </div>
  );
};

export default Comments;
