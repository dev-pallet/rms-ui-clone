import { Grid, Popover, TextField, Tooltip } from '@mui/material';
import { buttonStyles } from '../../../../../Common/buttonColor';
import SoftBox from '../../../../../../../components/SoftBox';
import SoftTypography from '../../../../../../../components/SoftTypography';
import SoftButton from '../../../../../../../components/SoftButton';
import { useSoftUIController } from '../../../../../../../context';
import SoftInput from '../../../../../../../components/SoftInput';

export default function BatchesInfo({ anchorEl, openModalBatchData, handleCloseModalBatchData, allItemList }) {
  const [controller] = useSoftUIController();
  const { miniSidenav } = controller;

  return (
    <div>
      <Popover
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        open={openModalBatchData}
        onClose={handleCloseModalBatchData}
        className="stock-adjustment-more-info"
        PaperProps={{
          style: {
            backgroundColor: '#ffffff',
            boxShadow: '0px 8px 16px rgba(0,0,0,0.1)',
            border: '1px solid #B5B4B4',
            width: miniSidenav ? 'calc(100% - 150px)' : 'calc(100% - 390px)',
            marginTop: '12px',
            left: !miniSidenav ? '390px !important' : 'auto',
          },
        }}
      >
        <div
          style={{
            backgroundColor: 'white',
            padding: '10px',
          }}
        >
          <SoftBox className="batch-info-modal" mt={1} mb={1}>
            {allItemList?.length
              ? allItemList?.map((item, index) => (
                  <Grid container spacing={1} alignItems="center" mb={1}>
                    <Grid item xs={1.8} sm={1.8} md={1.8}>
                      <SoftBox display="flex" alignItems="center" gap="10px" sx={{ width: '100%' }}>
                        <TextField value={item?.itemNo || 'N/A'} readOnly fullWidth />
                      </SoftBox>
                    </Grid>

                    <Grid item xs={2} sm={2} md={2}>
                      <SoftBox display="flex" alignItems="center" gap="10px" sx={{ width: '100%' }}>
                        <TextField value={item?.itemName} readOnly fullWidth />
                      </SoftBox>
                    </Grid>

                    <Grid item xs={0.8} sm={0.8} md={0.8}>
                      <SoftInput type="number" name="quantity" disabled value={item?.sellingPrice} />
                    </Grid>

                    <Grid item xs={1.2} sm={1.2} md={1.2}>
                      <SoftInput type="number" name="quantity" disabled value={item?.quantityAvailable || 'N/A'} />
                    </Grid>

                    <Grid item xs={1.2} sm={1.2} md={1.3}>
                      <SoftInput type="number" name="quantity" disabled value={item?.quantityTransfer || 'N/A'} />
                    </Grid>

                    <Grid item xs={1.3} sm={1.3} md={1.3}>
                      <SoftInput type="number" name="quantity" disabled value={item?.purchasePrice || 'N/A'} />
                    </Grid>

                    <Grid item xs={1} sm={1} md={1}>
                      <Tooltip title={item?.taxableValue} placement="top-start">
                        <div>
                          <SoftInput type="number" name="quantity" disabled value={item?.finalPrice || 'N/A'} />
                        </div>
                      </Tooltip>
                    </Grid>

                    <Grid item xs={1.2} sm={1.2} md={1.2} className="content-left" sx={{ position: 'relative' }}>
                      <Tooltip title={item?.batchNumber} placement="top-start">
                        <div>
                          <SoftInput type="text" disabled value={item?.batchNumber} />
                        </div>
                      </Tooltip>
                    </Grid>
                  </Grid>
                ))
              : null}
          </SoftBox>

          <SoftBox sx={{ marginBottom: '10px !important' }}>
            <SoftBox className="header-submit-box-i">
              <SoftButton
                onClick={handleCloseModalBatchData}
                variant={buttonStyles.primaryVariant}
                className="vendor-add-btn contained-softbutton"
              >
                Close
              </SoftButton>
            </SoftBox>
          </SoftBox>
        </div>
      </Popover>
    </div>
  );
}
