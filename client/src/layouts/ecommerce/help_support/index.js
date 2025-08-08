import React, { useEffect, useRef, useState } from 'react';
import { CircularProgress, IconButton, Slide, Paper, Tooltip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Markdown from 'markdown-to-jsx';
import { useSnackbar } from '../../../hooks/SnackbarProvider';
import { useDebounce } from 'usehooks-ts';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import RefreshIcon from '@mui/icons-material/Refresh';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import StopCircleRoundedIcon from '@mui/icons-material/StopCircleRounded';
import PalletIQWhite from '../../../assets/images/PalletIQ-white.png';
import PalletIQ from '../../../assets/images/Pallet-IQ.png';
import PalletLogo from '../../../assets/images/PALLET icon.png';
import './palletIQ.css';
import { useLocation } from 'react-router-dom';

const ChatbotHelpSupport = () => {
  const showSnackbar = useSnackbar();
  const chatEndRef = useRef(null);
  const streamingIntervalRef = useRef(null);
  const inputRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [userMessage, setUserMessage] = useState('');
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState(null);
  const [selectedSuggestion, setSelectedSuggestion] = useState('');
  const debounceSuggestion = useDebounce(selectedSuggestion, 500);
  const [streamingText, setStreamingText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const location = useLocation();
  const [pageContext, setPageContext] = useState(location.pathname);
  const toggleChat = () => setOpen(!open);
  const [activeImage, setActiveImage] = useState(PalletIQWhite);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveImage((prev) => (prev === PalletIQWhite ? PalletLogo : PalletIQWhite));
    }, 3000); // switch every 3s

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      if (key === 'h' && e.shiftKey) {
        e.preventDefault();
        setOpen((prev) => !prev);
      } else if (key === 'escape') {
        setOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    setPageContext(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    if (chatEndRef?.current) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    fetchSuggestions();
  }, []);

  useEffect(() => {
    if (chatEndRef?.current) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [responses]);

  useEffect(() => {
    if (debounceSuggestion) {
      handleSubmit({ preventDefault: () => {} });
      setSelectedSuggestion(null);
    }
  }, [debounceSuggestion]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);
  useEffect(() => {
    if (!isStreaming && open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isStreaming, open]);

  const fetchSuggestions = async () => {
    if (loading) return;
    try {
      const res = await axios.post('http://localhost:3001/chat', { userMessage: '', pageContext });
      setSuggestions(res?.data || null);
      setResponses([]);
    } catch (error) {
      showSnackbar(error?.message || 'Error fetching suggestions.', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userMessage.trim()) return;

    const currDate = new Date();
    const userMsg = userMessage;
    setResponses((prev) => [...prev, { type: 'user', text: userMsg, timestamp: currDate }]);
    setUserMessage('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3001/chat', { userMessage: userMsg, pageContext });
      const fullText = response?.data?.answer || '';
      const suggestions = response?.data?.suggestions || [];

      setIsStreaming(true);
      setStreamingText('');

      let index = 0;
      const interval = setInterval(() => {
        setStreamingText((prev) => {
          const nextText = prev + fullText.charAt(index);
          index++;
          if (index >= fullText?.length) {
            clearInterval(interval);
            setResponses((prev) => [
              ...prev,
              {
                type: 'ai',
                text: fullText,
                timestamp: new Date(),
                suggestions,
              },
            ]);
            setStreamingText('');
            setIsStreaming(false);
          }
          return nextText;
        });
      }, 15); // adjust speed as needed
      streamingIntervalRef.current = interval;
    } catch (error) {
      showSnackbar(error?.message || 'Error sending message.', 'error');
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    if (userMessage) return;
    setUserMessage(suggestion);
    setSelectedSuggestion(uuidv4());
  };

  const handleStopStreaming = () => {
    if (streamingIntervalRef?.current) {
      clearInterval(streamingIntervalRef?.current);
      streamingIntervalRef.current = null;
      setIsStreaming(false);
      setResponses((prev) => [
        ...prev,
        {
          type: 'ai',
          text: streamingText,
          timestamp: new Date(),
        },
      ]);
      setStreamingText('');
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <Tooltip title="Chat with Pallet IQ">
        <img src={PalletIQ} alt="Pallet IQ Chat" onClick={toggleChat} className="palletiq-toggle-button" />
      </Tooltip>
      {/* Slide-in Chatbox */}
      <Slide direction="up" in={open} mountOnEnter unmountOnExit>
        <Paper
          className="custom-chat-paper"
          elevation={12}
          sx={{
            width: { xs: '90%', sm: 400 },
          }}
        >
          {/* Header */}
          <header className="custom-chat-header">
            <div className="chat-display-flex chat-flex-start">
              <span
                className="pallet-iq-glow-anim"
                style={{
                  backgroundImage: `url(${activeImage})`,
                }}
              ></span>
              &nbsp;
              <strong>Pallet IQ </strong>
            </div>
            <div>
              {responses?.length > 0 && !loading && (
                <Tooltip title="Refresh">
                  <span onClick={fetchSuggestions} className="chat-color-white" style={{ cursor: 'pointer' }}>
                    <RefreshIcon fontSize="small" />
                  </span>
                </Tooltip>
              )}
              &nbsp;
              <span onClick={toggleChat} className="chat-color-white" style={{ cursor: 'pointer' }}>
                <CloseIcon fontSize="small" />
              </span>
            </div>
          </header>

          {/* Chat Content */}
          <div className="custom-chat-content">
            {suggestions?.suggestions?.length > 0 && (
              <div className="chat-mb">
                <strong className="chat-color-blue" style={{ fontSize: '1rem' }}>
                  {suggestions?.answer}
                </strong>
                {suggestions?.suggestions?.map((s, i) => (
                  <div key={i} onClick={() => handleSuggestionClick(s?.text)} className="custom-chat-suggestions">
                    {s?.text}
                  </div>
                ))}
              </div>
            )}

            {responses?.map((resp, i) => (
              <div
                key={i}
                className={`chat-display-flex chat-mb ${resp?.type === 'user' ? 'chat-flex-end' : 'chat-flex-start'}`}
              >
                <div
                  className={`chat-response ${
                    resp?.type === 'user' ? 'chat-bgColor-blue chat-color-white' : 'chat-bgColor-white chat-color-blue'
                  }`}
                >
                  {resp?.type === 'ai' ? (
                    <Markdown
                      options={{
                        forceBlock: true,
                        overrides: {
                          a: {
                            props: {
                              target: '_blank',
                              rel: 'noopener noreferrer',
                              style: { color: '#1976d2', textDecoration: 'underline' },
                            },
                          },
                        },
                      }}
                    >
                      {resp?.text}
                    </Markdown>
                  ) : (
                    resp?.text
                  )}
                  <span
                    className={`chat-display-flex chat-flex-end chat-time-font ${
                      resp?.type === 'user' ? 'chat-color-off-white' : 'chat-color-blue'
                    }`}
                  >
                    {new Date(resp?.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            {isStreaming && (
              <div className="chat-display-flex chat-flex-start chat-mb">
                <div className="chat-streaming-box">
                  <Markdown>{streamingText}</Markdown>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>
          {/* Input Field */}
          <div component="form" onSubmit={handleSubmit} className="chat-input-form-box">
            <div className="chat-input-form-sub-box">
              {/* Left Icon (Static) */}
              <div className="chat-input-form-left-icon">
                <img src={PalletIQ} />
              </div>

              {/* Input Field */}
              <input
                type="text"
                ref={inputRef}
                placeholder="Ask me anything related to Pallet..."
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                disabled={loading || isStreaming}
                className="chat-input-box"
              />
              {/* Right Icons (Send/Stop/Loading) */}
              <div className="chat-input-form-right-icons">
                {isStreaming ? (
                  <Tooltip title="Stop Response">
                    <div onClick={handleStopStreaming} className="chat-stop-response">
                      <StopCircleRoundedIcon />
                    </div>
                  </Tooltip>
                ) : loading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <Tooltip title="Send">
                    <div type="submit" className="chat-start-response" onClick={handleSubmit}>
                      <SendRoundedIcon />
                    </div>
                  </Tooltip>
                )}
              </div>
            </div>
          </div>
        </Paper>
      </Slide>
    </>
  );
};

export default ChatbotHelpSupport;
