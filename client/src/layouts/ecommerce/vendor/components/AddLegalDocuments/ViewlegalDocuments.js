import DescriptionIcon from '@mui/icons-material/Description';
import { Card, Grid, InputLabel } from '@mui/material';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SoftButton from '../../../../../components/SoftButton';
import SoftTypography from '../../../../../components/SoftTypography';
import Spinner from '../../../../../components/Spinner';
import { viewTotDocuments } from '../../../../../config/Services';

const btnStyle = {
  padding: '10px 20px',
  backgroundColor: '#0064fe',
  color: 'white',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '0.85rem',
  fontWeight: '500',
};
const ViewlegalDocuments = () => {
  const documents = ['GST', 'Pan Card', 'Incorporation Certificate', 'Personal ID', 'Aggrement'];
  const [apiResponse, setApiResponse] = useState([]);

  const { vendorId } = useParams();
  const user_details = localStorage.getItem('user_details');
  const createdById = user_details && JSON.parse(user_details).uidx;
  const [loader, setLoader] = useState(false);
  const inputRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    setLoader(true);
    viewTotDocuments(vendorId)
      .then((res) => {
        const data = res?.data?.data?.data;
        setApiResponse(data);
        setLoader(false);
      })
      .catch(() => {
        setLoader(false);
      });
  }, []);

  return (
    <div style={{ paddingInline: '15px' }}>
      {loader ? (
        <>
          {' '}
          <Spinner size={'1.3rem'} />
        </>
      ) : (
        <div>
          {apiResponse?.length > 0 ? (
            <Card className="addbrand-Box">
              <div style={{ padding: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {apiResponse?.map((item, index) => (
                  <>
                    <Grid container alignItems="center">
                      <Grid item xs={1} style={{ cursor: 'pointer' }}>
                        <DescriptionIcon
                          sx={{ color: '#ff3b30', fontSize: '30px' }}
                          onClick={() => window.open(item?.documentUrl, '_blank')}
                        />
                      </Grid>
                      <Grid item xs={4}>
                        <div>
                          {index === 0 && (
                            <InputLabel
                              sx={{
                                fontWeight: 'bold',
                                fontSize: '0.75rem',
                                color: '#344767',
                              }}
                            >
                              Document title
                            </InputLabel>
                          )}
                          <SoftTypography variant="button" fontWeight="regular" color="text">
                            {item?.documentName || 'NA'}
                          </SoftTypography>{' '}
                        </div>
                      </Grid>
                      <Grid item xs={2.5}>
                        <div>
                          {index === 0 && (
                            <InputLabel
                              sx={{
                                fontWeight: 'bold',
                                fontSize: '0.75rem',
                                color: '#344767',
                              }}
                            >
                              Valid from
                            </InputLabel>
                          )}
                          <SoftTypography variant="button" fontWeight="regular" color="text">
                            {item?.validFrom || 'NA'}
                          </SoftTypography>{' '}
                        </div>
                      </Grid>
                      <Grid item xs={2.5}>
                        <div>
                          {index === 0 && (
                            <InputLabel
                              sx={{
                                fontWeight: 'bold',
                                fontSize: '0.75rem',
                                color: '#344767',
                              }}
                            >
                              Expires on
                            </InputLabel>
                          )}
                          <SoftTypography variant="button" fontWeight="regular" color="text">
                            {item?.validTo || 'NA'}
                          </SoftTypography>{' '}
                        </div>
                      </Grid>
                      <Grid item xs={2}>
                        <div>
                          {index === 0 && (
                            <InputLabel
                              sx={{
                                fontWeight: 'bold',
                                fontSize: '0.75rem',
                                color: '#344767',
                              }}
                            >
                              Due in
                            </InputLabel>
                          )}
                          <SoftTypography variant="button" fontWeight="regular" color="text">
                            {item?.validFrom && item?.validTo
                              ? `${moment(item?.validTo).diff(moment(item?.validFrom), 'days')} days`
                              : 'NA'}{' '}
                          </SoftTypography>{' '}
                        </div>
                      </Grid>
                    </Grid>
                  </>
                ))}
              </div>
            </Card>
          ) : (
            <div>
              <Card className="vendorCardShadow" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
                  <div>
                    <DescriptionIcon sx={{ color: '#0562FB', fontSize: '30px' }} />
                  </div>
                  <SoftTypography fontSize="14px" fontWeight="bold" variant="caption">
                    Sorry , no documents found for this vendor
                  </SoftTypography>
                  <SoftButton color="info" onClick={() => navigate(`/purchase/edit-vendor/${vendorId}`)}>
                    + Add
                  </SoftButton>
                </div>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ViewlegalDocuments;
