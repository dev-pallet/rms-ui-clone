import { Card, Grid, InputLabel, IconButton, TextField, InputAdornment } from '@mui/material';
import React, { useState, useRef } from 'react';
import SoftBox from '../../../../../../components/SoftBox';
import SoftInput from '../../../../../../components/SoftInput';

function KycDocument({ adhaarNumber, setAdhaarNumber, panNumber, setPanNumber, uanNumber, setUanNumber }) {
  const [selectedFile, setSelectedFile] = useState({
    adhaar: null,
    pan: null,
    sign: null,
  });

  const fileInputRefs = {
    adhaar: useRef(null),
    pan: useRef(null),
    sign: useRef(null),
  };

  const inputLabelStyle = { fontWeight: 'bold', fontSize: '0.75rem', color: '#344767' };

  const handleFileChange = (event, name) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile((prevState) => ({
        ...prevState,
        [name]: file,
      }));
    } else {
      alert('Please upload a valid PDF file.');
    }
  };

  const handleClear = (name) => {
    setSelectedFile((prevState) => ({
      ...prevState,
      [name]: null,
    }));

    // Clear the input value
    if (fileInputRefs[name].current) {
      fileInputRefs[name].current.value = '';
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'adhaar':
        setAdhaarNumber(value);
        break;
      case 'pan':
        setPanNumber(value);
        break;
      case 'uan':
        setUanNumber(value);
        break;
      default:
        break;
    }
  };

  const formFields = [
    { id: 'adhaar', label: 'Adhaar Number', onChange: handleInputChange, value: adhaarNumber },
    { id: 'pan', label: 'Pan Card Number', onChange: handleInputChange, value: panNumber },
    { id: 'uan', label: 'UAN Number', onChange: handleInputChange, value: uanNumber },
  ];

  return (
    <Card sx={{ padding: '15px', overflow: 'visible' }}>
      <SoftBox sx={{ flexGrow: 1, marginLeft: '20px' }}>
        <InputLabel style={{ fontWeight: 'bold' }}>Identity Information</InputLabel>

        {/* <Grid container mt={1} spacing={2} direction="row" justifyContent="space-between" alignItems="center">
          {formFields.map((field, index) => (
            <Grid item xs={12} md={4} lg={4} key={index}>
              <SoftBox>
                <InputLabel sx={inputLabelStyle} required>
                  {field.label}
                </InputLabel>
                <TextField
                  size="small"
                  variant="outlined"
                  placeholder="Upload PDF"
                  value={selectedFile[field.name] ? selectedFile[field.name].name : ''}
                  style={{ position: 'relative', width: '100%' }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          color="primary"
                          aria-label="upload pdf"
                          component="label"
                          style={{ position: 'absolute', right: 30 }}
                        >
                          <UploadIcon />
                          <input
                            type="file"
                            accept="application/pdf"
                            onChange={field.onChange}
                            hidden
                            ref={fileInputRefs[field.name]} // Set the ref
                          />
                        </IconButton>
                        <IconButton
                          color="secondary"
                          aria-label="clear pdf"
                          style={{ position: 'absolute', right: 0 }}
                          onClick={() => handleClear(field.name)}
                        >
                          <ClearIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </SoftBox>
            </Grid>
          ))}
        </Grid> */}
        <Grid container mt={1} spacing={2} direction="row" justifyContent="space-between" alignItems="center">
          {formFields?.map((field, index) => (
            <Grid item xs={12} md={12} lg={12} key={index}>
              <SoftBox>
                <InputLabel sx={inputLabelStyle}>{field?.label}</InputLabel>
                <SoftInput
                  name={field?.id}
                  value={field?.value}
                  onChange={field?.onChange}
                  className="select-box-category"
                  size="small"
                />
              </SoftBox>
            </Grid>
          ))}
        </Grid>
      </SoftBox>
    </Card>
  );
}

export default KycDocument;
