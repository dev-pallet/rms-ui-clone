import {
  CircularProgress,
  Typography,
} from '@mui/material';
import { getwhatsappBusinessWorkFlow, whatsappBusinessWorkFlow } from '../../../../../config/Services';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../../../../hooks/SnackbarProvider';
import React, { useEffect, useState } from 'react';
import SoftBox from '../../../../../components/SoftBox';
import SoftButton from '../../../../../components/SoftButton';

const Workflow = ({setSelectedTab}) => {
  const navigate = useNavigate();
  const [workflow, setWorkFlow] = useState(false);
  const [details, setDetails] = useState();

  const showSnackbar = useSnackbar();

  const orgId = localStorage.getItem('orgId');
  const locId = localStorage.getItem('locId');
  const contextType = localStorage.getItem('contextType');
  const [loader, setLoader] = useState(false);

  const [draggedItem, setDraggedItem] = useState(null);
  const [steps, setSteps] = useState([
    {
      id: 1,
      text: 'Send Catalog',
      img: 'https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_images/online-shop_313137.png',
    },
    {
      id: 2,
      text: 'Address',
      img: 'https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_images/map_854878.png',
    },
    // Add more steps as needed
  ]);
  const [itemsState, setItemsState] = useState();

  const handleDragStart = (e, index) => {
    setDraggedItem(steps[index]);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    const draggedOverItem = steps[index];

    if (draggedItem === draggedOverItem) {return;}

    const items = steps.filter((item) => item !== draggedItem);
    const updatedItems = [...items.slice(0, index), draggedItem, ...items.slice(index)];

    setSteps(updatedItems);
    setItemsState(updatedItems);
  };

  const handleDrop = () => {
    setDraggedItem(null);
  };

  const handleSetUp = () => {
    const user_details = localStorage.getItem('user_details');
    const uidx = JSON.parse(user_details).uidx;
    const catalogId = localStorage.getItem('catalogId');
    setLoader(true);
    const payload = {
      orgId: orgId,
      locId: locId,
      firstPreference: 'WELCOME',
      secondPreference: itemsState && itemsState[0]?.text === 'Address' ? 'ADDRESS' : 'CATALOG',
      thirdPreference: itemsState && itemsState[0]?.text === 'Address' ? 'CATALOG' : 'ADDRESS',
      forthPreference: 'PAYMENT',
      createdBy: uidx,
      catalogId: catalogId,
    };

    try {
      whatsappBusinessWorkFlow(payload)
        .then((res) => {
          if (res?.data?.status === 'SUCCESS' && res?.data?.data?.message) {
            setLoader(false);
            showSnackbar(res?.data?.data?.message, 'success');
          } else {
            setLoader(false);
            showSnackbar('Whatsapp Business Workflow setup completed', 'success');
          }
        })
        .catch((error) => {
          if (error?.response && error?.response?.data?.message) {
            setLoader(false);
            showSnackbar(error?.response?.data?.message, 'warning');
          }
        });
    } catch (error) {
      setLoader(false);
      showSnackbar(error?.response?.data?.message, 'error');
    }
  };

  useEffect(() => {
    const orgId = localStorage.getItem('orgId');
    const catalogId = localStorage.getItem('catalogId');

    try {
      getwhatsappBusinessWorkFlow(orgId, catalogId)
        .then((res) => {
          setDetails(res?.data?.data);
          setWorkFlow(true);
          showSnackbar(
            `Workflow for this organisation: ${orgId} and catalogId: ${catalogId} is already created`,
            'success',
          );
        })
        .catch((error) => {
          if (error?.response && error?.response?.data?.message) {
            showSnackbar(error?.response?.data?.message, 'warning');
          }
        });
    } catch (error) {
      showSnackbar(error?.response?.data?.message, 'error');
    }
  }, []);

  return (
    <div>
      <SoftBox className="add-catalog-products-box">
        <Typography className="whatsapp-bus-process-typo">Work Flow</Typography>
        <Typography
          style={{
            fontWeight: '200',
            fontSize: '0.8rem',
            lineHeight: '1.5',
            color: '#4b524d',
            textAlign: 'left',
            margin: '5px 0px',
          }}
        >
          You have added products to your catalog. Now its time to set a workflow for sending messages according to your
          preference.
        </Typography>
        <div>
          {!workflow && (
            <Typography
              style={{
                fontWeight: '600',
                fontSize: '0.9rem',
                lineHeight: '1.5',
                color: '#4b524d',
                textAlign: 'left',
                margin: '5px 0px',
              }}
            >
              Step 2 and Step 3 steps are interchangeable, Choose according to your choice.
            </Typography>
          )}
        </div>

        <SoftBox style={{ marginTop: '30px' }}>
          <SoftBox style={{ display: 'flex', justifyContent: 'space-around' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography
                style={{
                  fontWeight: '200',
                  fontSize: '0.8rem',
                  lineHeight: '1.5',
                  color: '#4b524d',
                  textAlign: 'center',
                  margin: '10px 0px',
                }}
              >
                Step 1
              </Typography>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <img
                  src="https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_images/welcome-back_5578628%20(1).png"
                  alt=""
                  style={{ width: '60px', height: '60px' }}
                />

                <Typography
                  style={{
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    lineHeight: '1.5',
                    color: '#4b524d',
                    textAlign: 'center',
                    margin: '10px 0px',
                  }}
                >
                  1. Welcome
                </Typography>
              </div>
            </div>
          </SoftBox>
        </SoftBox>

        <SoftBox style={{ marginTop: '30px' }}>
          {!workflow ? (
            <SoftBox style={{ display: 'flex', justifyContent: 'space-around' }}>
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={handleDrop}
                  style={{ cursor: 'pointer' }}
                >
                  <Typography
                    style={{
                      fontWeight: '200',
                      fontSize: '0.8rem',
                      lineHeight: '1.5',
                      color: '#4b524d',
                      textAlign: 'center',
                      margin: '10px 0px',
                    }}
                  >
                    Step {index + 2}
                  </Typography>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <img src={step.img} alt="" style={{ width: '60px', height: '60px' }} />
                    <Typography
                      style={{
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        lineHeight: '1.5',
                        color: '#4b524d',
                        textAlign: 'center',
                        margin: '10px 0px',
                      }}
                    >
                      {step.text}
                    </Typography>
                  </div>
                </div>
              ))}
            </SoftBox>
          ) : (
            <SoftBox style={{ display: 'flex', justifyContent: 'space-around' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography
                  style={{
                    fontWeight: '200',
                    fontSize: '0.8rem',
                    lineHeight: '1.5',
                    color: '#4b524d',
                    textAlign: 'center',
                    margin: '10px 0px',
                  }}
                >
                  Step 2
                </Typography>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <img
                    src={
                      details?.secondPreference === 'ADDRESS'
                        ? 'https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_images/map_854878.png'
                        : 'https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_images/online-shop_313137.png'
                    }
                    alt=""
                    style={{ width: '60px', height: '60px' }}
                  />

                  <Typography
                    style={{
                      fontWeight: '600',
                      fontSize: '0.9rem',
                      lineHeight: '1.5',
                      color: '#4b524d',
                      textAlign: 'center',
                      margin: '10px 0px',
                    }}
                  >
                    2. {details?.secondPreference}
                  </Typography>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography
                  style={{
                    fontWeight: '200',
                    fontSize: '0.8rem',
                    lineHeight: '1.5',
                    color: '#4b524d',
                    textAlign: 'center',
                    margin: '10px 0px',
                  }}
                >
                  Step 3
                </Typography>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <img
                    src={
                      details?.thirdPreference === 'ADDRESS'
                        ? 'https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_images/map_854878.png'
                        : 'https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_images/online-shop_313137.png'
                    }
                    alt=""
                    style={{ width: '60px', height: '60px' }}
                  />

                  <Typography
                    style={{
                      fontWeight: '600',
                      fontSize: '0.9rem',
                      lineHeight: '1.5',
                      color: '#4b524d',
                      textAlign: 'center',
                      margin: '10px 0px',
                    }}
                  >
                    3. {details?.thirdPreference}
                  </Typography>
                </div>
              </div>
            </SoftBox>
          )}
        </SoftBox>
        <SoftBox style={{ marginTop: '30px' }}>
          <SoftBox style={{ display: 'flex', justifyContent: 'space-around' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography
                style={{
                  fontWeight: '200',
                  fontSize: '0.8rem',
                  lineHeight: '1.5',
                  color: '#4b524d',
                  textAlign: 'center',
                  margin: '10px 0px',
                }}
              >
                Step 4
              </Typography>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <img
                  src="https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_images/payment_8072450.png"
                  alt=""
                  style={{ width: '60px', height: '60px' }}
                />

                <Typography
                  style={{
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    lineHeight: '1.5',
                    color: '#4b524d',
                    textAlign: 'center',
                    margin: '10px 0px',
                  }}
                >
                  4. Payment Status
                </Typography>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography
                style={{
                  fontWeight: '200',
                  fontSize: '0.8rem',
                  lineHeight: '1.5',
                  color: '#4b524d',
                  textAlign: 'center',
                  margin: '10px 0px',
                }}
              >
                Step 5
              </Typography>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <img
                  src="https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_images/online-shopping_3501758.png"
                  alt=""
                  style={{ width: '60px', height: '60px' }}
                />

                <Typography
                  style={{
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    lineHeight: '1.5',
                    color: '#4b524d',
                    textAlign: 'center',
                    margin: '10px 0px',
                  }}
                >
                  5. Order Confirmation
                </Typography>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography
                style={{
                  fontWeight: '200',
                  fontSize: '0.8rem',
                  lineHeight: '1.5',
                  color: '#4b524d',
                  textAlign: 'center',
                  margin: '10px 0px',
                }}
              >
                Step 6
              </Typography>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <img
                  src="https://storage.googleapis.com/twinleaves_bucket/FrontEnd/RMS_images/approved_2154353.png"
                  alt=""
                  style={{ width: '60px', height: '60px' }}
                />

                <Typography
                  style={{
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    lineHeight: '1.5',
                    color: '#4b524d',
                    textAlign: 'center',
                    margin: '10px 0px',
                  }}
                >
                  6. Delivery Status
                </Typography>
              </div>
            </div>
          </SoftBox>
        </SoftBox>

        <SoftBox className="whatsapp-bus-button-box">
          {/* <SoftButton className="vendor-second-btn" onClick={handlePreview}>
            Preview
          </SoftButton> */}
          {!workflow ? (
            <SoftButton className="vendor-add-btn" onClick={handleSetUp}>
              {loader ? (
                <CircularProgress
                  sx={{ color: 'white !important', height: '15px !important', width: '15px !important' }}
                />
              ) : (
                'Set Up'
              )}
            </SoftButton>
          ) : (
            <SoftButton className="vendor-add-btn" onClick={() => setSelectedTab('Templates')}>
              Next
            </SoftButton>
          )}
        </SoftBox>
      </SoftBox>
    </div>
  );
};

export default Workflow;
