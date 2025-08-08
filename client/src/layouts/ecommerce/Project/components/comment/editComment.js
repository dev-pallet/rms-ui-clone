import { Button, Modal, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';

import { useMutation } from '@tanstack/react-query';
import { editComment } from '../../../../../config/Services';
import { useSnackbar } from '../../../../../hooks/SnackbarProvider';
import SoftButton from '../../../../../components/SoftButton';

const CommentEdit = ({ editModalOpen, handleCloseEditModal, selectedComment, fetchCommentList, taskId }) => {
  const showSnackbar = useSnackbar();
  const [editData, setEditData] = useState({
    commentText: '',
    attachments: [],
  });

  useEffect(() => {
    if (selectedComment) {
      setEditData({
        commentText: selectedComment.comment,
        attachments: selectedComment.attachments || [],
      });
    }
  }, [selectedComment]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const { mutate: editCommentData, isLoading: isLoadingComment } = useMutation({
    mutationKey: ['editCommentData'],
    mutationFn: async (payload) => {
      const response = await editComment(payload);
      // if (response?.data?.es > 0) {
      //   showSnackbar(response?.data?.message, 'error');
      //   return;
      // }
      return response;
    },
    onSuccess: (res) => {
      showSnackbar(res?.data?.data?.message, 'success');
      fetchCommentList(taskId, 0);
    },
    onError: (error) => {
      showSnackbar(error?.response?.data?.message || error?.message, 'error');
    },
  });
  const createByval = localStorage.getItem('user_details');
  const userDetails = JSON.parse(createByval);
  const uidxVal = userDetails?.uidx;
  const createByNameVal = localStorage.getItem('user_name');
  const locationPath = window.location.href;

  const handleEditSubmit = () => {
    // const attachments = [
    //   ...formattedAudio?.map((url) => ({
    //     path: url,
    //     fileType: 'audio',
    //   })),
    //   ...formattedImage?.map((file) => ({
    //     path: file.file,
    //     fileType: file.type || 'image',
    //   })),
    // ];
    const payload = {
      commentId: selectedComment?.commentId,
      commentText: editData?.commentText,
      attachments: editData?.attachments?.map((item) => item.attachmentUrl) || [],
      taggedUsers: [],
      taskDetailPageUrl: locationPath,
      updatedBy: uidxVal,
      updatedByName: createByNameVal,
    };
    editCommentData(payload);
    handleCloseEditModal();
  };

  return (
    <Modal
      open={editModalOpen}
      onClose={handleCloseEditModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div style={{ padding: '20px', backgroundColor: 'white', margin: '50px auto', width: '50%' }}>
        <h5>Edit Comment</h5>
        <TextField name="commentText" value={editData.commentText} onChange={handleChange} fullWidth multiline />

        <div
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', marginTop: '5px' }}
        >
          <SoftButton size="small" variant="outlined" color="info" onClick={handleCloseEditModal}>
            Cancel
          </SoftButton>
          <SoftButton size="small" color="info" onClick={handleEditSubmit}>
            Save
          </SoftButton>
        </div>
      </div>
    </Modal>
  );
};

export default React.memo(CommentEdit);
