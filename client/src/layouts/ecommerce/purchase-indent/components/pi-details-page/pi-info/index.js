import './pi-info.css';
import { Typography, useMediaQuery } from '@mui/material';
import SoftBox from '../../../../../../components/SoftBox';

const PiInfo = ({ piInfoArray }) => {
  const below376px = useMediaQuery('(max-width: 376px)');
  return (
    <SoftBox className="pi-info-main-container po-box-shadow">
      <Typography fontSize="1rem" fontWeight={500} className="pi-info-heading">
        Purchase Indent Info
      </Typography>
      {/* <Grid container spacing={below376px ? 0.5 : 2} mt={1}> */}
      <SoftBox className="pi-info-list" mt={1}>
        {piInfoArray.map((info, index) => (
          // <Grid item lg={6} md={6} sm={6} xs={6}>
          <SoftBox className={`info-card-main-div ${index % 2 === 1 && 'reverse-pinfo-main-div'}`}>
            <SoftBox
              className="pi-icon-div"
              // sx={{ marginLeft: index % 2 === 1 && '5px', marginRight: index % 2 === 0 && '5px' }}
            >
              {info.icon}
            </SoftBox>
            <SoftBox className={`pi-info-value-div ${index % 2 === 1 && 'reverse-pi-info-value-div'}`}>
              {/* <Typography className="pi-infoname" sx={{textAlign: index % 2 === 1 ? 'end' : 'start'}}>{info.infoName}</Typography> */}
              {/* <Typography className="pi-infovalue" sx={{textAlign: index % 2 === 1 ? 'end' : 'start'}}>{info.infoValue}</Typography> */}
              <Typography className="pi-infoname">{info.infoName}</Typography>
              <SoftBox className="pi-infovalue-container">
                <Typography className="pi-infovalue">{info.infoValue}</Typography>
              </SoftBox>
            </SoftBox>
          </SoftBox>
          // </Grid>
        ))}
        {/* </Grid> */}
      </SoftBox>
    </SoftBox>
  );
};

export default PiInfo;
