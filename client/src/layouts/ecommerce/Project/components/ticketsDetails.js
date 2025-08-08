import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../../../examples/LayoutContainers/DashboardLayout';
import { Card, CardContent, Grid } from '@mui/material';
import SoftTypography from '../../../../components/SoftTypography';
import DashboardNavbar from '../../../../examples/Navbars/DashboardNavbar';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useSnackbar } from '../../../../hooks/SnackbarProvider';
import SoftBox from '../../../../components/SoftBox';
import './style.css';
import Comments from './comment/comments';
import { useParams } from 'react-router-dom';
import { fetchTicketById } from './apiCall';
import { BorderColor } from '@mui/icons-material';

const TicketDetails = () => {
  const showSnackbar = useSnackbar();
  const { taskId } = useParams();
  const [allData, setAllData] = useState();

  useEffect(() => {
    getTicketDetails();
  }, []);

  const getTicketDetails = () => {
    fetchTicketById(taskId)
      .then((res) => {
        const response = res?.data?.data?.data;
        showSnackbar(res?.data?.data?.message, 'success');
        setAllData(response);
      })
      .catch((error) => {
        showSnackbar(error?.response?.data?.message || error?.message, 'error');
      });
  };

  const handleTickeIdCopy = () => {
    navigator.clipboard.writeText(ticketId);
    showSnackbar('Copied', 'success');
  };

  const optionStatusArrays = {
    OPEN: { color: '#0052CC', borderColor: '#0052CC' },
    ASSIGNED: { color: '#2684FF', borderColor: '#2684FF' },
    CLOSED: { color: '#403294', borderColor: '#403294' },
    IN_PROGRESS: { color: '#FFAB00', borderColor: '#FFAB00' },
    COMPLETED: { color: '#00875A', borderColor: '#00875A' },
    FIXED: { color: '#36B37E', borderColor: '#36B37E' },
    STARTED: { color: '#FF5630', borderColor: '#FF5630' },
    ENDED: { color: '#6554C0', borderColor: '#6554C0' },
  };

  const audioAttachments = allData?.attachments?.filter((attachment) => attachment?.attachmentType?.includes('audio'));
  const imageAttachments = allData?.attachments?.filter((attachment) => attachment?.attachmentType?.includes('image'));
  const pdfAttachments = allData?.attachments?.filter((attachment) => attachment?.attachmentType?.includes('pdf'));
  const videoAttachments = allData?.attachments?.filter((attachment) => attachment?.attachmentType?.includes('video'));

  return (
    <DashboardLayout>
      <DashboardNavbar prevLink={true} />
      <Card sx={{ padding: 1 }}>
        <SoftBox sx={{ padding: 1 }}>
          <SoftBox sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="taskdetails-heading">{allData?.title}</div>
            <button
              style={{
                color: optionStatusArrays[allData?.status]?.color,
                backgroundColor: '#fff',
                padding: '8px 8px',
                fontSize: '12px',
                border: `1px solid ${optionStatusArrays[allData?.status]?.borderColor}`,
                borderRadius: '4px',
              }}
              className={`taskedetails-status-btn-${taskId}`}
            >
              {' '}
              {allData?.status}
            </button>
          </SoftBox>
          <div className="taskdetails-created-name">Created by: {allData?.createdByName}</div>
          <div className="taskdetails-ticket-name">
            Ticket -
            {/* <a
              href={`/ticket/${allData?.ticketId}`}
              className="taskdetails-ticket-link"
              style={{ textDecoration: 'underline', color: '#1976d2', cursor: 'pointer' }}
            > */}
            <span style={{ paddingLeft: '3px' }}>{allData?.ticketId}</span>
            {/* </a> */}
            <ContentCopyIcon
              className="copy-icon"
              sx={{ cursor: 'pointer', marginTop: '2px' }}
              onClick={handleTickeIdCopy}
            />
          </div>
          <SoftBox sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: 4 }}>
            <div className="taskdetails-product">
              Product
              <div className="taskdetails-subtitle">{allData?.product}</div>
            </div>

            <div className="taskdetails-product">
              Feature
              <div className="taskdetails-subtitle">{allData?.feature}</div>
            </div>
          </SoftBox>
        </SoftBox>
      </Card>

      <Card sx={{ padding: 3, mt: 2 }}>
        <p className="taskdetails-header">Summary</p>
        <p className="taskdetails-summary">{allData?.summary}</p>
        <hr style={{ opacity: '0.3 !important', color: 'grey' }} />
        <p className="taskdetails-header">Attachments</p>

        <Grid container spacing={2}>
          {/* Render audio attachments */}
          {audioAttachments?.map((attachment, index) => (
            <Grid item xs={12} key={`audio-${index}`}>
              <div className="audio-attachment">
                <audio controls>
                  <source src={attachment?.attachmentUrl} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            </Grid>
          ))}

          {/* Render image attachments in a single row */}
          {imageAttachments?.length > 0 && (
            <Grid item xs={12}>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {imageAttachments?.map((attachment, index) => (
                  <a href={attachment?.attachmentUrl} target="_blank" rel="noopener noreferrer" key={`image-${index}`}>
                    <img
                      width={50}
                      height={50}
                      src={attachment?.attachmentUrl}
                      alt="attachment"
                      style={{
                        border: '3px solid rgb(230 226 226)',
                        borderRadius: '5px',
                      }}
                    />
                  </a>
                ))}
              </div>
            </Grid>
          )}

          {pdfAttachments?.length > 0 && (
            <Grid item xs={12}>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {pdfAttachments?.map((attachment, index) => (
                  <a
                    href={attachment?.attachmentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    key={`pdf-${index}`}
                    style={{
                      display: 'inline-block',
                      textAlign: 'center',
                      textDecoration: 'none',
                    }}
                  >
                    <div
                      style={{
                        width: '50px',
                        height: '50px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        border: '3px solid rgb(230 226 226)',
                        borderRadius: '5px',
                        background: '#f0f0f0',
                      }}
                    >
                      📄
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#555' }}>View PDF</span>
                  </a>
                ))}
              </div>
            </Grid>
          )}
          {videoAttachments?.length > 0 && (
            <Grid item xs={12}>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {videoAttachments?.map((attachment, index) => (
                  <div key={`video-${index}`}>
                    <video
                      controls
                      width="100"
                      height="100"
                      style={{
                        border: '3px solid rgb(230 226 226)',
                        borderRadius: '5px',
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <source src={attachment?.attachmentUrl} type="video/mp4" />
                      <source src={attachment?.attachmentUrl} type="video/webm" />
                      <source src={attachment?.attachmentUrl} type="video/ogg" />
                      Your browser does not support the video tag.
                    </video>
                    <a
                      href={attachment?.attachmentUrl}
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
                ))}
              </div>
            </Grid>
          )}
        </Grid>
      </Card>

      <Comments taskId={taskId} />
    </DashboardLayout>
  );
};

export default TicketDetails;
