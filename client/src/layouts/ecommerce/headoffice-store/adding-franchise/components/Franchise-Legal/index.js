import { Typography } from '@mui/material';
import React, { useState } from 'react';
import SoftBox from '../../../../../../components/SoftBox';
import SoftButton from '../../../../../../components/SoftButton';
import SoftTypography from '../../../../../../components/SoftTypography';

const FranchiseLegal = ({isDetailPage}) => {
  const [selectedFile, setSelectedFile] = useState({
    gstin: null,
    incorporatia: null,
    pancard: null,
  });

  const handleChange = (event) => {
    const name = event.target.name;
    setSelectedFile((prev) => ({
      ...prev,
      [name]: event.target.files[0],
    }));
  };
  const handleClick = (e) => {
    document.getElementById(e.target.id).click();
  };

  // useEffect(()=>{
  //   if(!isDetailPage){
  //     setIsEditing(true)
  //   }
  // },[isDetailPage])

  return (
    <SoftBox>
      <Typography pl={1} mb={3} mt={3}>
        Doucment Verification Details
      </Typography>
      <SoftBox className="flex-div-ho document-main-div">
        <SoftBox className="document-title-div">
          <SoftTypography fontSize="16px">GSTIN</SoftTypography>
          {selectedFile && <SoftTypography fontSize="12px">{selectedFile?.gstin?.name}</SoftTypography>}
        </SoftBox>
        <label htmlFor="fileInput">
          <input name="gstin" type="file" id="fileInput1" onChange={handleChange} style={{ display: 'none' }} />
          <SoftButton name="gstin" id="fileInput1" variant="contained" color="info" onClick={handleClick}>
            Upload
          </SoftButton>
        </label>
      </SoftBox>
      <SoftBox className="flex-div-ho document-main-div">
        <SoftBox className="document-title-div">
          <SoftTypography fontSize="16px">Incorporation Certificate</SoftTypography>
          {selectedFile && <SoftTypography fontSize="12px">{selectedFile?.incorporatia?.name}</SoftTypography>}
        </SoftBox>
        <label htmlFor="fileInput">
          <input name="incorporatia" type="file" id="fileInput2" onChange={handleChange} style={{ display: 'none' }} />
          <SoftButton name="incorporatia" variant="contained" id="fileInput2" color="info" onClick={handleClick}>
            Upload
          </SoftButton>
        </label>
      </SoftBox>
      <SoftBox className="flex-div-ho document-main-div">
        <SoftBox className="document-title-div">
          <SoftTypography fontSize="16px">Pancard</SoftTypography>
          {selectedFile && <SoftTypography fontSize="12px">{selectedFile?.pancard?.name}</SoftTypography>}
        </SoftBox>
        <label htmlFor="fileInput">
          <input name="pancard" type="file" id="fileInput3" onChange={handleChange} style={{ display: 'none' }} />
          <SoftButton name="pancard" variant="contained" id="fileInput3" color="info" onClick={handleClick}>
            Upload
          </SoftButton>
        </label>
      </SoftBox>
    </SoftBox>
  );
};

export default FranchiseLegal;
