import { Box, CircularProgress, Grid, InputLabel, Modal, Typography } from '@mui/material';
import moment from 'moment';
import React, { useState } from 'react';
import SoftButton from '../../../../components/SoftButton';
import DateRangeSelector from '../DateRangeSelector';

const CreateNewReportModal = ({
  open,
  handleClose,
  selectBoxArray = [],
  loader,
  setFromdate,
  setTodate,
  onExport,
  renderDateRange = true,
}) => {
  const [showDateRangeSelector, setShowDateRangeSelector] = useState(false);
  const [selectedDateRanges, setSelectedDateRanges] = useState({ startDate: '', endDate: '' });
  function formatDateWithMoment(dateString) {
    return moment(dateString).format('YYYY-MM-DD');
  }

  const handleDateSelect = (selectedDates) => {
    handleButtonClick();
    const startDate = formatDateWithMoment(selectedDates?.startDate);
    const endDate = formatDateWithMoment(selectedDates?.endDate);
    setSelectedDateRanges({ startDate: startDate, endDate: endDate });
    setFromdate(startDate || '');
    setTodate(endDate || '');
  };

  const handleButtonClick = () => {
    setShowDateRangeSelector(!showDateRangeSelector);
  };

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="modal-title" aria-describedby="modal-description">
      <Box sx={modalStyle}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 1.5,
            backgroundColor: 'ghostwhite',
            borderBottom: '1px solid lightgray',
          }}
        >
          <Typography
            id="modal-title"
            variant="h6"
            sx={{
              fontWeight: 'bold',
              fontSize: '1rem',
            }}
          >
            Generate Report
          </Typography>
          {renderDateRange && (
            <SoftButton size="small" variant="outlined" color="info" onClick={handleButtonClick}>
              Select Date Range
            </SoftButton>
          )}
        </Box>

        <Box id="modal-description" sx={{ mt: 2 }}>
          {selectedDateRanges?.startDate && selectedDateRanges?.endDate && (
            <div style={{ display: 'flex', gap: '10px', paddingInline: '15px' }}>
              <Typography variant="body1" fontSize="0.75rem" fontWeight="550" color="royalblue">
                <InputLabel style={{ fontWeight: 'bold', fontSize: '0.8rem', color: '#344767' }}>
                  Start Date:{' '}
                </InputLabel>
                {selectedDateRanges?.startDate}
              </Typography>
              <Typography variant="body1" fontSize="0.75rem" fontWeight="550" color="royalblue">
                <InputLabel style={{ fontWeight: 'bold', fontSize: '0.8rem', color: '#344767' }}>End Date: </InputLabel>
                {selectedDateRanges?.endDate}
              </Typography>
            </div>
          )}

          <Grid container spacing={2} alignItems="center" style={{ padding: '15px' }}>
            <Grid item xs={12}>
              {showDateRangeSelector && (
                <DateRangeSelector showDateRangeSelector={showDateRangeSelector} handleDateSelect={handleDateSelect} />
              )}
            </Grid>

            {selectBoxArray?.map((item) => (
              <Grid item xs={12} sm={6} md={4} lg={6}>
                {item}
              </Grid>
            ))}
          </Grid>
        </Box>
        <Box sx={{ mt: 2, borderTop: '1px solid lightgray', display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ margin: '5px' }}>
            {loader ? (
              <SoftButton color="info" size="small">
                <CircularProgress className="circular-progress-dashboard" />
              </SoftButton>
            ) : (
              <SoftButton
                size="small"
                color="info"
                onClick={onExport}
                sx={{
                  backgroundColor: '#1976d2',
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: '#1565c0',
                  },
                }}
              >
                Generate
              </SoftButton>
            )}
          </div>
        </Box>
      </Box>
    </Modal>
  );
};

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  minWidth: '60vw !important',
  maxWidth:'80vw !important',
  maxHeight: '95vh',
  bgcolor: 'background.paper',
  border: '1px solid lightgray',
  boxShadow: 24,
  borderRadius: 2,
  overflow: 'auto',
  scrollbarWidth: 'none',
  '-ms-overflow-style': 'none',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
};

export default CreateNewReportModal;
