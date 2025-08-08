import './individualSessionDetails.css';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SoftButton from './../../../../../../../../components/SoftButton/index';
import SoftTypography from '../../../../../../../../components/SoftTypography';
import Typography from '@mui/material/Typography';
import moment from 'moment';

export const IndividualSessionDetails = ({ data, id, type }) => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const convertUTCDateToLocalDate = (dat) => {
    const date = moment.utc(dat).format('YYYY-MM-DD HH:mm:ss');
    const stillUtc = moment.utc(date).toDate();
    return moment(stillUtc).local().format('L, LT');
  };

  const handleCloseSession = (sessionId, id) => {
    navigate(`/sales_channels/pos/closeSession/${sessionId}/${id}`);
  };

  return (
    <Box>
      {data?.map((e) => {
        return (
          <Accordion
            expanded={expanded === (type == 'session' ? e?.sessionId : e?.licenseId)}
            onChange={handleChange(type == 'session' ? e?.sessionId : e?.licenseId)}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1bh-content" id="panel1bh-header">
              {type == 'session' ? (
                <Typography sx={{ width: '33%', flexShrink: 0, padding: 2, fontSize: '18px', fontWeight: 'bold' }}>
                  Session Id : {e?.sessionId}
                </Typography>
              ) : (
                <Typography sx={{ width: '100%', flexShrink: 0, padding: 2, fontSize: '18px', fontWeight: 'bold' }}>
                  License Id : {e?.licenseId}
                </Typography>
              )}
              {type == 'session' ? (
                <Typography sx={{ color: 'text.secondary', padding: 2, fontSize: '18px', fontWeight: 'bold' }}>
                  {convertUTCDateToLocalDate(e?.startTime)} -{' '}
                  {convertUTCDateToLocalDate(e?.endTime) == 'Invalid date'
                    ? 'Ongoing'
                    : convertUTCDateToLocalDate(e?.endTime)}
                </Typography>
              ) : null}
            </AccordionSummary>
            <AccordionDetails>
              {type == 'session' ? (
                <>
                  <Box className="ind-session-details-map" p={2}>
                    <Box>
                      <SoftTypography fontSize="17px" variant="h3">
                        POS user name{' '}
                      </SoftTypography>
                      <SoftTypography fontSize="17px" variant="h3">
                        Status
                      </SoftTypography>
                      <SoftTypography fontSize="17px" variant="h3">
                        Start date & time{' '}
                      </SoftTypography>
                      <SoftTypography fontSize="17px" variant="h3">
                        End date & time{' '}
                      </SoftTypography>
                      <SoftTypography fontSize="17px" variant="h3">
                        Total order processed{' '}
                      </SoftTypography>
                      <SoftTypography fontSize="17px" variant="h3">
                        Opening cash amount
                      </SoftTypography>
                      <SoftTypography fontSize="17px" variant="h3">
                        Total amount collected via cash{' '}
                      </SoftTypography>
                      <SoftTypography fontSize="17px" variant="h3">
                        Total amount collected via UPI{' '}
                      </SoftTypography>
                      <SoftTypography fontSize="17px" variant="h3">
                        Total amount collected via card{' '}
                      </SoftTypography>
                      <SoftTypography fontSize="17px" variant="h3">
                        Total order process time{' '}
                      </SoftTypography>
                      <SoftTypography fontSize="17px" variant="h3">
                        Adjusted orders
                      </SoftTypography>
                      <SoftTypography fontSize="17px" variant="h3">
                        Reconcillation Amount
                      </SoftTypography>
                      <SoftTypography fontSize="17px" variant="h3">
                        Ending cash amount
                      </SoftTypography>
                      <SoftTypography fontSize="17px" variant="h3">
                        Discrepancy
                      </SoftTypography>
                    </Box>
                    <Box>
                      <SoftTypography fontSize="17px" variant="h3">
                        --
                      </SoftTypography>
                      <SoftTypography fontSize="17px" variant="h3">
                        {e?.status || 0}
                      </SoftTypography>
                      <SoftTypography fontSize="17px" variant="h3">
                        {convertUTCDateToLocalDate(e?.startTime)}
                      </SoftTypography>
                      <SoftTypography fontSize="17px" variant="h3">
                        {convertUTCDateToLocalDate(e?.endTime)}
                      </SoftTypography>
                      <SoftTypography fontSize="17px" variant="h3">
                        {e?.salesData?.totalOrders || 0}
                      </SoftTypography>
                      <SoftTypography fontSize="17px" variant="h3">
                        ---
                      </SoftTypography>
                      <SoftTypography fontSize="17px" variant="h3">
                        {e?.salesData?.cashOrdersValue || 0}
                      </SoftTypography>
                      <SoftTypography fontSize="17px" variant="h3">
                        {e?.salesData?.upiOrdersValue || 0}
                      </SoftTypography>
                      <SoftTypography fontSize="17px" variant="h3">
                        {e?.salesData?.cardOrdersValuex || 0}
                      </SoftTypography>
                      <SoftTypography fontSize="17px" variant="h3">
                        ---
                      </SoftTypography>
                      <SoftTypography fontSize="17px" variant="h3">
                        {e?.salesData?.adjustedOrders || 0}
                      </SoftTypography>
                      <SoftTypography fontSize="17px" variant="h3">
                        ---
                      </SoftTypography>
                      <SoftTypography fontSize="17px" variant="h3">
                        ---
                      </SoftTypography>
                      <SoftTypography fontSize="17px" variant="h3">
                        ---
                      </SoftTypography>
                    </Box>
                  </Box>
                  <Box p={2} className="close-btn-box">
                    {e?.status == 'ACTIVE' ? (
                      <SoftButton
                        variant="gradient"
                        color="info"
                        onClick={() => handleCloseSession(e?.sessionId, id)}
                        style={{ marginLeft: '40px', height: '20px !important', padding: '0px !important' }}
                      >
                        Close Session
                      </SoftButton>
                    ) : null}
                  </Box>
                </>
              ) : (
                <>
                  <Box className="ind-session-details-map" p={2}>
                    <Box>
                      <SoftTypography fontSize="17px" variant="h3">
                        License name
                      </SoftTypography>
                      <SoftTypography fontSize="17px" variant="h3">
                        Total Orders
                      </SoftTypography>
                      <SoftTypography fontSize="17px" variant="h3">
                        Total Orders Value
                      </SoftTypography>
                      <SoftTypography fontSize="17px" variant="h3">
                        Opening cash amount
                      </SoftTypography>
                      <SoftTypography fontSize="17px" variant="h3">
                        Total Cash Orders
                      </SoftTypography>
                      <SoftTypography fontSize="17px" variant="h3">
                        Total amount collected via cash{' '}
                      </SoftTypography>
                      <SoftTypography fontSize="17px" variant="h3">
                        Total UPI Orders
                      </SoftTypography>
                      <SoftTypography fontSize="17px" variant="h3">
                        Total amount collected via UPI{' '}
                      </SoftTypography>
                      <SoftTypography fontSize="17px" variant="h3">
                        Total Card Orders
                      </SoftTypography>
                      <SoftTypography fontSize="17px" variant="h3">
                        Total amount collected via card{' '}
                      </SoftTypography>
                      <SoftTypography fontSize="17px" variant="h3">
                        Adjusted Orders
                      </SoftTypography>
                      <SoftTypography fontSize="17px" variant="h3">
                        Adjusted Orders Value
                      </SoftTypography>
                      <SoftTypography fontSize="17px" variant="h3">
                        Average Order Value
                      </SoftTypography>
                      <SoftTypography fontSize="17px" variant="h3">
                        Ending cash amount
                      </SoftTypography>
                      <SoftTypography fontSize="17px" variant="h3">
                        Returns
                      </SoftTypography>
                    </Box>
                    <Box>
                      <SoftTypography fontSize="17px" variant="h3">
                        {e?.licenseName || 0}
                      </SoftTypography>
                      <SoftTypography fontSize="17px" variant="h3">
                        {e?.salesData?.totalOrders || 0}
                      </SoftTypography>
                      <SoftTypography fontSize="17px" variant="h3">
                        {e?.salesData?.totalOrdersValue || 0}
                      </SoftTypography>
                      <SoftTypography fontSize="17px" variant="h3">
                        {e?.salesData?.startingAmount || 0}
                      </SoftTypography>
                      <SoftTypography fontSize="17px" variant="h3">
                        {e?.salesData?.cashOrders || 0}
                      </SoftTypography>
                      <SoftTypography fontSize="17px" variant="h3">
                        {e?.salesData?.cashOrdersValue || 0}
                      </SoftTypography>
                      <SoftTypography fontSize="17px" variant="h3">
                        {e?.salesData?.upiOrders || 0}
                      </SoftTypography>
                      <SoftTypography fontSize="17px" variant="h3">
                        {e?.salesData?.upiOrdersValue || 0}
                      </SoftTypography>
                      <SoftTypography fontSize="17px" variant="h3">
                        {e?.salesData?.cardOrders || 0}
                      </SoftTypography>
                      <SoftTypography fontSize="17px" variant="h3">
                        {e?.salesData?.cardOrdersValue || 0}
                      </SoftTypography>
                      <SoftTypography fontSize="17px" variant="h3">
                        {e?.salesData?.adjustedOrders || 0}
                      </SoftTypography>
                      <SoftTypography fontSize="17px" variant="h3">
                        {e?.salesData?.adjustedOrdersValue || 0}
                      </SoftTypography>
                      <SoftTypography fontSize="17px" variant="h3">
                        {e?.salesData?.avgOrderValue || 0}
                      </SoftTypography>
                      <SoftTypography fontSize="17px" variant="h3">
                        {e?.salesData?.expectedAmount || 0}
                      </SoftTypography>
                      <SoftTypography fontSize="17px" variant="h3">
                        {e?.salesData?.returns || 0}
                      </SoftTypography>
                    </Box>
                  </Box>
                </>
              )}
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Box>
  );
};
