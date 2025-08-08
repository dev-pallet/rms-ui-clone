import React, { useState, useEffect, useRef } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { franc } from 'franc';
import axios from 'axios';
import SoftBox from '../../../../components/SoftBox';
import SoftButton from '../../../../components/SoftButton';
import SoftTypography from '../../../../components/SoftTypography';
import './style.css';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import CircularProgress from '@mui/material/CircularProgress';
import GraphicEqOutlinedIcon from '@mui/icons-material/GraphicEqOutlined';
import {
  addAudioURL,
  clearAllUrls,
  getAudioURL,
  removeAudioUrl,
  setAudioURL,
} from '../../../../datamanagement/Filters/voiceRecordSlice';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import { deleteAttachments } from '../../../../config/Services';
import { set } from 'lodash';
import { useParams } from 'react-router-dom';

const VoiceRecorder = ({ handleAudioUpload, formattedAudio, setFormattedAudio }) => {
  const [isRecording, setIsRecording] = useState(false);
  //   const [audioUrl, setAudioUrl] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [language, setLanguage] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  const dispatch = useDispatch();
  const audioURL = useSelector(getAudioURL); //for single audio

  const storingAudio = useSelector(getAudioURL);
  const [audioUrls, setAudioUrls] = useState(storingAudio);

  const [open, setOpen] = useState(false);
  const [stream, setStream] = useState(null);
  const [audioLoader, setAudioLoader] = useState(false);
  const [shouldUpload, setShouldUpload] = useState(false);
  const isDeletingRef = useRef(false);
  const isCreate = location.pathname === '/project/create';
  const ticketId = useParams();

  useEffect(() => {
    if (shouldUpload && audioUrls?.length > 0) handleAudioUpload(audioUrls);
    setShouldUpload(false);
  }, [audioUrls, shouldUpload]);

  useEffect(() => {
    if (!isDeletingRef.current && storingAudio) {
      if (location.pathname === '/project/create') {
        setAudioUrls(storingAudio);
      } else {
        setAudioUrls(storingAudio);
        // setAudioUrls(storingAudio?.[0] || []);
      }
    }
  }, [storingAudio]);

  const startRecording = async () => {
    try {
      setAudioLoader(true);
      resetTranscript();
      setLanguage('');
      setTranslatedText('');

      SpeechRecognition.startListening({ continuous: true });
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setStream(stream);
      const recorder = new MediaRecorder(stream);
      const chunks = [];
      recorder.ondataavailable = (e) => chunks.push(e.data);

      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/mpeg' });
        const url = URL.createObjectURL(audioBlob);
        // setAudioUrl(url);
        dispatch(addAudioURL(url));
        setAudioChunks([]);
        setShouldUpload(true);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setAudioChunks(chunks);
      setIsRecording(true);
    } catch (error) {
      setAudioLoader(false);
      showSnackbar(error?.response?.data?.message || error?.message, 'error');
    }
  };

  const translateText = async (text) => {
    try {
      const response = await axios.post('https://translate.googleapis.com/translate_a/single', null, {
        params: {
          client: 'gtx',
          sl: 'auto',
          tl: 'en',
          dt: 't',
          q: text,
        },
      });
      const translated = response?.data?.[0]?.[0]?.[0];
      setTranslatedText(translated);
    } catch (error) {
      setTranslatedText('Translation failed');
    }
  };

  const stopRecording = async () => {
    // await SpeechRecognition.stopListening({ continuous: false });

    try {
      SpeechRecognition.abortListening();
      await SpeechRecognition.stopListening();

      if (mediaRecorder) {
        mediaRecorder.stop();
      }

      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }

      if (transcript) {
        const detectedLanguage = detectLanguage(transcript);
        setLanguage(detectedLanguage);
        translateText(transcript);
      }

      setAudioLoader(false);
      setIsRecording(false);
    } catch (error) {
      showSnackbar(error?.response?.data?.message || error?.message, 'error');
    }
  };

  const alreadyInPageClearRecording = async (id) => {
    try {
      isDeletingRef.current = true;

      const newAudios = [...audioUrls];

      // const filePath = audioUrls?.[0]?.[index] || formattedAudio[index];

      const filePath =
        newAudios?.[0]?.find((audio) => audio.id === id) || formattedAudio.find((audio) => audio.id === id);

      const fullFilePath = filePath?.url || null;
      const relativeFilePath = fullFilePath.includes('twinleaves_dev_public/')
        ? fullFilePath.split('twinleaves_dev_public/')[1]
        : null;

      const attachmentId = filePath?.id || null;

      const updatedAudios = audioUrls?.[0]?.filter((item) => item?.id !== id) || [];

      const payload = {
        attachmentId: attachmentId,
        filePath: relativeFilePath,
      };

      const response = await deleteAttachments(payload);

      setAudioUrls([updatedAudios.length ? updatedAudios : []]);
      // setFormattedAudio((prevFormattedAudio) => prevFormattedAudio.filter((_, i) => i !== index));
      dispatch(removeAudioUrl(id));
      setShouldUpload(false);
      setAudioChunks([]);
      setLanguage('');
      setTranslatedText('');
      resetTranscript();
      setIsRecording(false);
    } catch (error) {
      showSnackbar(error?.response?.data?.message || error?.message, 'error');
    } finally {
      isDeletingRef.current = false;
    }
  };

  const clearRecording = async (index) => {
    const filePath = formattedAudio[index];
    const relativeFilePath = filePath.includes('twinleaves_dev_public/')
      ? filePath.split('twinleaves_dev_public/')[1]
      : null;

    const payload = {
      attachmentId: '',
      filePath: relativeFilePath,
    };

    const response = await deleteAttachments(payload);
    if (response?.status === 200) {
      dispatch(removeAudioUrl(index));

      setAudioUrls((prevAudioUrls) => prevAudioUrls.filter((_, i) => i !== index));
      setFormattedAudio((prevFormattedAudio) => prevFormattedAudio.filter((_, i) => i !== index));
      setShouldUpload(false);

      setAudioChunks([]);
      setLanguage('');
      setTranslatedText('');
      resetTranscript();
      setIsRecording(false);
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
  const handleAllDelete = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleConfirmCancel = () => {
    dispatch(clearAllUrls());
    setOpen(false);
  };

  return (
    <>
      <SoftBox>
        <SoftBox className="voice-container">
          <SoftTypography>Record Voice: </SoftTypography>
          <SoftBox className="voice-btn-wrapper">
            {audioLoader ? (
              <GraphicEqOutlinedIcon
                sx={{ fontSize: '2rem', color: '#0562FB', animation: 'waveAnimation 1s infinite' }}
              />
            ) : (
              <SoftButton size="small" color="info" onClick={startRecording} disabled={isRecording}>
                Start
              </SoftButton>
            )}
            <SoftButton size="small" variant="outlined" color="info" onClick={stopRecording} disabled={!isRecording}>
              Stop
            </SoftButton>
          </SoftBox>
        </SoftBox>
        {/* audioUrl //use state */}
        {/* {audioURL} */}
        {/* {audioUrls?.length > 1 && (
          <div style={{ marginTop: '2px' }}>
            <SoftButton size="small" variant="outlined" color="info" onClick={handleAllDelete}>
              Delete All
            </SoftButton>
          
          </div>
        )} */}

        {!isCreate && (
          <div>
            {audioUrls?.length > 0 && (
              <div>
                <h6>Existing Audios</h6>
                {Array.isArray(audioUrls?.[0]) ? (
                  audioUrls?.[0]?.map((audio, index) => {
                    return (
                      <div
                        key={index}
                        style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}
                      >
                        <audio src={audio.url} controls />
                        <DeleteOutlineIcon
                          style={{ cursor: 'pointer' }}
                          onClick={() => alreadyInPageClearRecording(audio.id)}
                        />
                      </div>
                    );
                  })
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <audio src={audioUrls?.[0]?.url || audioUrls?.[0]} controls />
                      <DeleteOutlineIcon style={{ cursor: 'pointer' }} onClick={() => alreadyInPageClearRecording(0)} />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div>
          {formattedAudio?.length > 0 && (
            <div>
              <h6>Newly Created Audios</h6>
              {Array.isArray(formattedAudio) ? (
                formattedAudio.map((audio, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <audio src={audio} controls />
                    <DeleteOutlineIcon onClick={() => clearRecording(index)} style={{ cursor: 'pointer' }} />
                  </div>
                ))
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <audio src={audioUrls} controls />
                  <DeleteOutlineIcon onClick={() => clearRecording(0)} style={{ cursor: 'pointer' }} />
                </div>
              )}
            </div>
          )}
        </div>

        <SoftBox className="voice-record-display"></SoftBox>
      </SoftBox>
      <Dialog open={open} onClose={handleCloseDialog}>
        <DialogTitle>Cancel</DialogTitle>
        <DialogContent>
          <DialogContentText>You have data. Are you sure you want to cancel?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            No
          </Button>
          <Button onClick={handleConfirmCancel} color="secondary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default VoiceRecorder;
