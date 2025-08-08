import { FormControl, FormControlLabel, Grid, Radio, RadioGroup } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import React, { useEffect, useState } from 'react';
import SaveIcon from '@mui/icons-material/Save';
import SoftBox from '../../../../../../components/SoftBox';
import SoftInput from '../../../../../../components/SoftInput';
import SoftTypography from '../../../../../../components/SoftTypography';

const FranchiseTerms = ({ isDetailPage, setIsDetailsPage }) => {
  const [isEditing, setIsEditing] = useState(false);
  const editHandler = () => {
    setIsEditing(true);
  };

  useEffect(()=>{
    if(!isDetailPage){
      setIsEditing(true);
    }
  },[isDetailPage]);

  const saveHandler = () => {
    setIsEditing(false);
  };
  return (
    <SoftBox mt={3} pb={3}>
      <Grid container spacing={2}>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <SoftBox className="details-item-wrrapper">
            <SoftBox className="flex-div-ho" sx={{ marginBottom: '10px' }}>
              <SoftTypography className="information-heading-ho">Term Details</SoftTypography>
              {isDetailPage && (
                <SoftBox className="frn-det-info">
                  <SaveIcon
                    sx={{ color: 'red !important', marginRight: '10px !important', cursor: 'pointer' }}
                    onClick={saveHandler}
                  />
                  <EditIcon sx={{ color: 'green !important', cursor: 'pointer' }} onClick={editHandler} />
                </SoftBox>
              )}
            </SoftBox>
            <SoftBox className="flex-div-ho" mb={1}>
              <SoftTypography className="soft-input-heading-ho">Royalty</SoftTypography>
              {!isEditing ? (
                <SoftTypography className="frn-det-typo-secondary">8907</SoftTypography>
              ) : (
                <SoftInput sx={{ width: '300px !important' }} />
              )}
            </SoftBox>
            <SoftBox className="flex-div-ho" sx={{ gap: '30px' }} mb={1}>
              <SoftTypography className="soft-input-heading-ho" mr={2}>
                Royalty Tax
              </SoftTypography>
              {!isEditing   ? (
                <SoftTypography className="frn-det-typo-secondary">Yearly</SoftTypography>
              ) : (
                <FormControl>
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    name="radio-buttons-group"
                    className="flex-div-flexstart"
                    sx={{ width: '300px !important', flexDirection: 'row' }}
                  >
                    <FormControlLabel
                      value="transaction"
                      control={<Radio />}
                      label="Transaction"
                      className="form-control-label-terms"
                    />
                    <FormControlLabel
                      value="yearly"
                      control={<Radio />}
                      label="Yearly"
                      className="form-control-label-terms"
                    />
                  </RadioGroup>
                </FormControl>)}
            </SoftBox>
            <SoftBox className="flex-div-ho" mb={1}>
              <SoftTypography className="soft-input-heading-ho">Deposit</SoftTypography>
              {!isEditing ? (
                <SoftTypography className="frn-det-typo-secondary">42452</SoftTypography>
              ) : (
                <SoftInput sx={{ width: '300px !important' }} />
              )}
            </SoftBox>
            <SoftBox className="flex-div-ho" sx={{ gap: '30px' }} mb={1}>
              <SoftTypography className="soft-input-heading-ho" mr={2}>
                Deposit Type
              </SoftTypography>
              {!isEditing ? (
                <SoftTypography className="frn-det-typo-secondary">Refundable</SoftTypography>
              ) : <FormControl>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  name="radio-buttons-group"
                  className="flex-div-flexstart"
                  sx={{ width: '300px !important', flexDirection: 'row' }}
                >
                  <FormControlLabel
                    value="refundable"
                    control={<Radio />}
                    label="Refundable"
                    className="form-control-label-terms"
                  />
                  <FormControlLabel
                    value="non-refundable"
                    control={<Radio />}
                    label="Non-Refundable"
                    className="form-control-label-terms"
                  />
                </RadioGroup>
              </FormControl>}
            </SoftBox>
            <SoftBox className="flex-div-ho" mb={1}>
              <SoftTypography className="soft-input-heading-ho">Payable</SoftTypography>
              {!isEditing ? (
                <SoftTypography className="frn-det-typo-secondary">Weekly</SoftTypography>
              ) : <FormControl>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  name="radio-buttons-group"
                  className="flex-div-flexstart"
                  sx={{ width: '300px !important', flexDirection: 'row' }}
                >
                  <FormControlLabel
                    value="weekly"
                    control={<Radio />}
                    label="Weekly"
                    className="form-control-label-terms"
                  />
                  <FormControlLabel
                    value="monthly"
                    control={<Radio />}
                    label="Monthly"
                    className="form-control-label-terms"
                  />
                  <FormControlLabel
                    value="yearly"
                    control={<Radio />}
                    label="Yearly"
                    className="form-control-label-terms"
                  />
                </RadioGroup>
              </FormControl>}
            </SoftBox>
          </SoftBox>
        </Grid>
      </Grid>
    </SoftBox>
  );
};

export default FranchiseTerms;
