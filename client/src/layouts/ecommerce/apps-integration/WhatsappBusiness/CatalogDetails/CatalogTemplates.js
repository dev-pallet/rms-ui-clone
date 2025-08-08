import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import { Stack, Typography } from '@mui/material';
import SoftBox from '../../../../../components/SoftBox';

const CatalogTemplates = () => {
  return (
    <div>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Stack alignItems="center">
          <Typography fontSize="16px" fontWeight={700}>
            Catalog
          </Typography>
          <SoftBox className="message-preview-inner" style={{ marginTop: '10px' }}>
            <div className="message-preview-top-box">
              <div className="message-preview-top-img">
                <InsertPhotoIcon sx={{ fontSize: '30px', color: '#fff' }} />
              </div>
              <div>
                <Typography className="template-header-typo">View (BIZ_NAME)'s Catalog on Whatsapp</Typography>

                <Typography className="template-header-typo2">
                  Browse pictures and details of their offerings
                </Typography>
              </div>
            </div>

            <Typography className="template-header-text">Welcome</Typography>

            <Typography className="template-body-text">Welcome to our store</Typography>

            <Typography className="template-footer-text">Powered By twinleaves</Typography>
            <p className="message-preview-time">12:08</p>
            <SoftBox>
              <hr />
              <div className="template-button-body">
                <FormatListBulletedIcon sx={{ color: '#0562FB', fontSize: '14px' }} />
                <Typography className="template-button-text">View Catalog</Typography>
              </div>
            </SoftBox>
          </SoftBox>
        </Stack>
        <Stack alignItems="center">
          <Typography fontSize="16px" fontWeight={700}>
            Address
          </Typography>
          <SoftBox className="message-preview-inner" style={{ marginTop: '10px' }}>
            <Typography className="template-body-text">Please provide your Address</Typography>
            <p className="message-preview-time">12:08</p>
          </SoftBox>
        </Stack>
        <Stack alignItems="center">
          <Typography fontSize="16px" fontWeight={700}>
            Payment
          </Typography>
          <SoftBox className="message-preview-inner" style={{ marginTop: '10px' }}>
            <Typography className="template-body-text">Please provide your payment details</Typography>
            <p className="message-preview-time">12:08</p>
          </SoftBox>
        </Stack>
      </Stack>
    </div>
  );
};

export default CatalogTemplates;
