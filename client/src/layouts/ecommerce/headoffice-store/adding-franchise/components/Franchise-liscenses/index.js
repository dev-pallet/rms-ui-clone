import { Grid } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import React, { useEffect, useState } from 'react';
import SaveIcon from '@mui/icons-material/Save';
import SoftBox from '../../../../../../components/SoftBox';
import SoftTypography from '../../../../../../components/SoftTypography';

const FranchiseLiscense = ({ isDetailPage, setIsDetailsPage }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isEditing2,setIsEditing2] = useState(false);
  const editHandler = () => {
    setIsEditing(true);
  };

  const saveHandler = () => {
    setIsEditing(false);
  };
  const editHandler2 = () => {
    setIsEditing2(true);
  };

  const saveHandler2 = () => {
    setIsEditing2(false);
  };
  const [liscenseValue, setLiscenseValue] = useState({
    pos: 0,
    mpos: 0,
    stores: 0,
    warehouse: 0,
  });

  const liscenseIncreaseHandler = (e) => {
    const name = e.target.name;
    setLiscenseValue((prev) => ({
      ...prev,
      [name]: liscenseValue[name] + 1,
    }));
  };

  const liscenseReduceHandler = (e) => {
    const name = e.target.name;
    if (liscenseValue[name] !== 0) {
      setLiscenseValue((prev) => ({
        ...prev,
        [name]: liscenseValue[name] - 1,
      }));
    }
  };

  const inputChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    if (value >= 0) {
      setLiscenseValue((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  useEffect(()=>{
    if(!isDetailPage){
      setIsEditing(true);
      setIsEditing2(true);
    }
  },[isDetailPage]);
  return (
    <Grid container spacing={2}>
      <Grid item lg={6} md={6} sm={12} xs={12}>
        <SoftBox mt={3} className="details-item-wrrapper">
          <SoftBox className="flex-div-ho" sx={{ marginBottom: '10px' }}>
            <SoftTypography className="information-heading-ho">Liscenses</SoftTypography>
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
          <SoftBox className="flex-div-ho" sx={{ gap: '30px' }} mb={1}>
            <SoftTypography className="soft-input-heading-ho" mr={2}>
              POS
            </SoftTypography>
            {!isEditing ? (
              <SoftTypography className="frn-det-typo-secondary">4</SoftTypography>
            ) : (
              <SoftBox className="flex-div-ho">
                <button name="pos" className="liscense-button" onClick={(e) => liscenseIncreaseHandler(e)}>
                  +
                </button>
                <input
                  name="pos"
                  value={liscenseValue?.pos}
                  type="number"
                  className="liscense-input"
                  placeholder="0"
                  min={0}
                  onChange={inputChangeHandler}
                />
                <button name="pos" className="liscense-button" onClick={(e) => liscenseReduceHandler(e)}>
                  -
                </button>
              </SoftBox>
            )}
          </SoftBox>
          <SoftBox className="flex-div-ho" sx={{ gap: '30px' }} mb={1}>
            <SoftTypography className="soft-input-heading-ho" mr={2}>
              mPOS
            </SoftTypography>
            {!isEditing ? (
              <SoftTypography className="frn-det-typo-secondary">1</SoftTypography>
            ) : (
              <SoftBox className="flex-div-ho">
                <button name="mpos" className="liscense-button" onClick={(e) => liscenseIncreaseHandler(e)}>
                  +
                </button>
                <input
                  name="mpos"
                  value={liscenseValue?.mpos}
                  type="number"
                  className="liscense-input"
                  placeholder="0"
                  min="0"
                  onChange={inputChangeHandler}
                />
                <button name="mpos" className="liscense-button" onClick={(e) => liscenseReduceHandler(e)}>
                  -
                </button>
              </SoftBox>
            )}
          </SoftBox>
        </SoftBox>
      </Grid>
      <Grid item lg={6} md={6} sm={12} xs={12}>
        <SoftBox mt={3} className="details-item-wrrapper">
          <SoftBox className="flex-div-ho" sx={{ marginBottom: '10px' }}>
            <SoftTypography className="information-heading-ho">Locations</SoftTypography>
            {isDetailPage && (
              <SoftBox className="frn-det-info">
                <SaveIcon
                  sx={{ color: 'red !important', marginRight: '10px !important', cursor: 'pointer' }}
                  onClick={saveHandler2}
                />
                <EditIcon sx={{ color: 'green !important', cursor: 'pointer' }} onClick={editHandler2} />
              </SoftBox>
            )}
          </SoftBox>
          <SoftBox className="flex-div-ho" sx={{ gap: '30px' }} mb={1}>
            <SoftTypography className="soft-input-heading-ho" mr={2}>
              Stores
            </SoftTypography>
            {!isEditing2 ? (
              <SoftTypography className="frn-det-typo-secondary">2</SoftTypography>
            ) : (
              <SoftBox className="flex-div-ho">
                <button name="stores" className="liscense-button" onClick={(e) => liscenseIncreaseHandler(e)}>
                  +
                </button>
                <input
                  name="stores"
                  value={liscenseValue.stores}
                  type="number"
                  className="liscense-input"
                  placeholder="0"
                  min="0"
                  onChange={inputChangeHandler}
                />
                <button name="stores" className="liscense-button" onClick={(e) => liscenseReduceHandler(e)}>
                  -
                </button>
              </SoftBox>
            )}
          </SoftBox>
          <SoftBox className="flex-div-ho" sx={{ gap: '30px' }} mb={1}>
            <SoftTypography className="soft-input-heading-ho" mr={2}>
              Warehouse
            </SoftTypography>
            {!isEditing2 ? (
              <SoftTypography className="frn-det-typo-secondary">5</SoftTypography>
            ) : (
              <SoftBox className="flex-div-ho">
                <button name="warehouse" className="liscense-button" onClick={(e) => liscenseIncreaseHandler(e)}>
                  +
                </button>
                <input
                  name="warehouse"
                  value={liscenseValue.warehouse}
                  type="number"
                  className="liscense-input"
                  placeholder="0"
                  min="0"
                  onChange={inputChangeHandler}
                />
                <button name="warehouse" className="liscense-button" onClick={(e) => liscenseReduceHandler(e)}>
                  -
                </button>
              </SoftBox>
            )}
          </SoftBox>
        </SoftBox>
      </Grid>
    </Grid>
  );
};

export default FranchiseLiscense;
