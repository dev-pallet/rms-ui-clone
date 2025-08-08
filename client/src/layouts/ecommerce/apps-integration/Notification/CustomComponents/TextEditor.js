import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import StrikethroughSIcon from '@mui/icons-material/StrikethroughS';
import { Typography } from '@mui/material';
import { useRef, useState } from 'react';
import './TextEditor.css';

const TextEditor = ({ chars, text, setText }) => {
  const [remainingChars, setRemainingChars] = useState(chars);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const textareaRef = useRef(null);

  const handleChange = (event) => {
    let inputText = event.target.value;
    inputText = inputText.replace(/\n/g, '\\n'); // Replace newline characters with '\n' for storage
    // setCursorPosition(event.target.selectionStart);
    const spaceCount = (inputText.match(/ /g) || []).length;
    const currentLength = inputText.length - spaceCount;
    const remaining = chars - currentLength;
    if (remaining >= 0) {
      setText(inputText);
      setRemainingChars(remaining);
    }
  };

  // const handleKeyDown = (event) => {
  //   if (event.key === 'Enter') {
  //     setText(text + '\n');
  //     event.preventDefault();
  //   }
  // };

  const handleBoldClick = () => {
    setText(text + '**');
  };

  const handleItalicClick = () => {
    setText(text + '__');
  };

  const handleStrikeThrough = () => {
    setText(text + '~~');
  };

  const handleEmojiSelect = (emoji) => {
    // const newText =
    //   text.slice(0, cursorPosition) +
    //   emoji.native +
    //   text.slice(cursorPosition);
    const newText = text + emoji.native;
    setText(newText);
    // setCursorPosition(cursorPosition + emoji.native.length);
    setShowEmojiPicker(false);
  };

  const displayedText = text.replace(/\\n/g, '\n');

  return (
    <div>
      <textarea
        className="text-editor-textarea"
        value={displayedText}
        onChange={handleChange}
        placeholder="Type your text here..."
      />
      <div className="text-editor-button-div">
        <Typography fontSize="13px" fontWeight={200}>
          {chars - remainingChars}/{chars}
        </Typography>
        <div className="text-editor-buttons-box">
          <EmojiEmotionsIcon onClick={() => setShowEmojiPicker(!showEmojiPicker)} />
          <FormatBoldIcon onClick={handleBoldClick} />
          <FormatItalicIcon onClick={handleItalicClick} />
          <StrikethroughSIcon onClick={handleStrikeThrough} />
        </div>
        {showEmojiPicker && <Picker data={data} onEmojiSelect={handleEmojiSelect} />}
      </div>
    </div>
  );
};

export default TextEditor;
