import './batch-details.css';
import { CircularProgress } from '@material-ui/core';
import { Grid, Typography } from '@mui/material';
import { expireDateChecker, withinSevenDaysChecker } from '../../../../Common/CommonFunction';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import SoftBox from '../../../../../../components/SoftBox';
import SoftInput from '../../../../../../components/SoftInput';
import moment from 'moment';

const BatchDetails = ({
  data,
  loader,
  isEditing,
  allInventoryData,
  setAllInventoryData,
  setIsChanged,
  editingFullBatchHandler,
  isBatchEditing,
}) => {
  const changeQuantityHandler = (e, batchId) => {
    const name = e.target.name;
    const value = e.target.value;
    const updatedInventoryData = allInventoryData?.multipleBatchCreations?.map((data) => {
      if (data?.batchId === batchId) {
        return {
          ...data,
          // [name]: name === 'expiryDate' ? value : Number(value),
          [name]: value,
        };
      }
      return data;
    });

    setIsChanged(true);
    setAllInventoryData((prev) => ({
      ...prev,
      multipleBatchCreations: updatedInventoryData,
    }));
  };

  const onClearHandler = (batchId) => {
    const updatedInventoryData = allInventoryData?.multipleBatchCreations?.map((data) => {
      if (data?.batchId === batchId) {
        return {
          ...data,
          availableUnits: 0,
        };
      }
      return data;
    });
    setIsChanged(true);
    setAllInventoryData((prev) => ({
      ...prev,
      multipleBatchCreations: updatedInventoryData,
    }));
  };

  const commonGridItemProps = isEditing
    ? {
      xs: 2.4,
      sm: 2.4,
      md: 2.4,
      lg: 2.4,
      xl: 2.4,
    }
    : {
      xs: 3,
      sm: 3,
      md: 3,
      lg: 3,
      xl: 3,
    };

  const mrpItemProps = isEditing
    ? {
      xs: 1.8,
      sm: 1.8,
      md: 1.8,
      lg: 1.8,
      xl: 1.8,
    }
    : {
      xs: 3,
      sm: 3,
      md: 3,
      lg: 3,
      xl: 3,
    };

  const expDateItemProps = isEditing
    ? {
      xs: 3.5,
      sm: 3.5,
      md: 3.5,
      lg: 3.5,
      xl: 3.5,
    }
    : {
      xs: 3,
      sm: 3,
      md: 3,
      lg: 3,
      xl: 3,
    };

  return (
    <div>
      {loader ? (
        <SoftBox className="loader-wrapper">
          <CircularProgress className="batch-details-loader" />
        </SoftBox>
      ) : (
        <>
          {allInventoryData?.multipleBatchCreations?.length ? (
            <>
              <SoftBox className="batch-details-header">
                <Grid container>
                  <Grid item {...commonGridItemProps}>
                    <Typography className="batch-details-header-typo">Batch ID</Typography>
                  </Grid>
                  {/* <Grid item {...commonGridItemProps}>
                    <Typography className="batch-details-header-typo">Qty</Typography>
                  </Grid> */}
                  <Grid item {...commonGridItemProps}>
                    <Typography className="batch-details-header-typo">Avble Qty</Typography>
                  </Grid>
                  <Grid item {...mrpItemProps}>
                    <Typography className="batch-details-header-typo">Mrp</Typography>
                  </Grid>
                  <Grid item {...expDateItemProps}>
                    <Typography
                      className="batch-details-header-typo"
                      sx={{ borderRight: !isEditing && '0px !important' }}
                    >
                      Expiry Date
                    </Typography>
                  </Grid>
                  {isEditing && (
                    <Grid item lg={1.9} md={1.9} sm={1.9} xs={1.9}>
                      <Typography className="batch-details-header-typo" sx={{ borderRight: '0px !important' }}>
                        Clear
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </SoftBox>
              <SoftBox className="batch-details-body">
                {allInventoryData?.multipleBatchCreations?.map((item, index) => {
                  const isExpired = expireDateChecker(item?.expiryDate);
                  const isAboutToExpired = withinSevenDaysChecker(item?.expiryDate);
                  return (
                    <SoftBox
                      className={'batch-body-data'}
                      sx={{
                        borderBottom:
                          index < allInventoryData?.multipleBatchCreations?.length - 1 && '1px solid lightgray',
                        cursor: 'pointer',
                      }}
                      key={index}
                      onClick={!isBatchEditing && (() => editingFullBatchHandler(item?.batchId))}
                    >
                      <Grid container>
                        <Grid item {...commonGridItemProps} className="latest-batch-div">
                          {index === 0 && <KeyboardDoubleArrowRightIcon className="latest-inward-icon" />}

                          <Typography className="batch-data-typo">{item?.batchId}</Typography>
                        </Grid>
                        <Grid item {...commonGridItemProps} className="batch-details-grid">
                          {isEditing ? (
                            <SoftInput
                              type="number"
                              value={item?.availableUnits}
                              className="batch-edit-input"
                              name="availableUnits"
                              onChange={(e) => changeQuantityHandler(e, item?.batchId)}
                              sx={{ fontSize: '12px !important', width: '70% !important' }}
                            />
                          ) : (
                            <Typography className="batch-data-typo">{item?.availableUnits}</Typography>
                          )}
                        </Grid>
                        <Grid item {...mrpItemProps} className="batch-details-grid">
                          {isEditing ? (
                            <SoftInput
                              type="number"
                              name="mrp"
                              className="batch-edit-input"
                              sx={{ fontSize: '12px !important', width: '70% !important' }}
                              value={item?.mrp}
                              onChange={(e) => changeQuantityHandler(e, item?.batchId)}
                            />
                          ) : (
                            <Typography className="batch-data-typo">{item?.mrp}</Typography>
                          )}
                        </Grid>
                        <Grid item {...expDateItemProps} className="batch-details-grid">
                          {isEditing ? (
                            <input
                              type="date"
                              name="expiryDate"
                              className="expirydate-batch-details"
                              value={moment(item?.expiryDate).format('YYYY-MM-DD')}
                              onChange={(e) => changeQuantityHandler(e, item?.batchId)}
                            />
                          ) : (
                            <Typography
                              className={`batch-data-typo ${
                                isAboutToExpired <= 0
                                  ? 'expired-typo'
                                  : isAboutToExpired > 0 && isAboutToExpired <= 7 && 'abouttobe-expired-typo'
                              }`}
                            >
                              {item?.expiryDate === null
                                ? 'NA'
                                : isAboutToExpired <= 0
                                  ? 'EXPIRED'
                                  : isAboutToExpired > 0 && isAboutToExpired <= 7
                                    ? `In ${isAboutToExpired} Days`
                                    : moment(item?.expiryDate).format('DD-MM-YYYY')}
                            </Typography>
                          )}
                        </Grid>
                        {isEditing && (
                          <Grid item lg={1.9} md={1.9} sm={1.9} xs={1.9} className="batch-details-grid">
                            <button
                              className="clearButton-batchdetails"
                              name="availableUnits"
                              onClick={() => onClearHandler(item?.batchId)}
                            >
                              Clear
                            </button>
                          </Grid>
                        )}
                      </Grid>
                    </SoftBox>
                  );
                })}
              </SoftBox>
            </>
          ) : (
            <SoftBox className="no-batches-found">
              <Typography fontSize="14px">No Batches Found</Typography>
            </SoftBox>
          )}
        </>
      )}
    </div>
  );
};

export default BatchDetails;
