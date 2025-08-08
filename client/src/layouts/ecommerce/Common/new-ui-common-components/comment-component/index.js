import SendIcon from '@mui/icons-material/Send';
import { Avatar, CircularProgress } from '@mui/material';
import { useEffect, useRef } from 'react';
import './comment-component.css';

const CommentComponent = ({
  createdComment,
  commentData,
  addCommentFunction,
  handleSend,
  loader,
  getCommentsLoader,
}) => {
  const commentRef = useRef(null);
  const handleScrollToEnd = () => {
    if (commentRef.current) {
      commentRef.current.scrollTop = commentRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (commentData?.length > 0) {
      handleScrollToEnd();
    }
  }, [commentData]);

  return (
    <div className="component-bg-br-sh-p comment-main-component">
      <div className="comments-div-second width-100">
        <span className="purch-det-heading-title pinsights-title comments-title">Comments</span>
        <div className="comments-main-container" ref={commentRef}>
          {/* {getCommentsLoader && (
            <div className='commentLoader'>
              <CircularProgress size={20} sx={{ color: '#0562fb !important' }} />
            </div>
          )} */}
          {commentData?.length === 0 ? (
            <div className="no-comment-data" style={{ fontSize: '14px' }}>
              No comments available
            </div>
          ) : (
            <div className="comments-main-div">
              {commentData?.map((comment, index) => (
                <div className="comment-user-info">
                  <div className="comment-user-name">
                    <Avatar alt="Remy Sharp" src="" sx={{ width: '1.25rem', height: '1.25rem' }} />
                    <span className="comment-username">{comment?.commentedBy}</span>
                  </div>
                  <hr className="horizontal-line-app-ros" />
                  <div className="comment-info">
                    <span className="comment-date-desc">{comment?.comment}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="adding-comment">
          <div className="comment-user-add">
            <input
              type="text"
              placeholder="Add a comment"
              className="comment-input"
              value={createdComment}
              onChange={(e) => addCommentFunction(e.target.value)}
            />
            {loader ? (
              <CircularProgress size={20} sx={{ color: '#0562fb !important' }} />
            ) : (
              <SendIcon
                className="close-icon comment-send-icon"
                // style={{ width: 20, height: 20 }}
                onClick={handleSend}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentComponent;
