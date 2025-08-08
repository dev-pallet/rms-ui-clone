import ImageIcon from '@mui/icons-material/Image';
import InfoIcon from '@mui/icons-material/Info';
import ListIcon from '@mui/icons-material/List';
import { Box, Grid, IconButton, Tooltip, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SoftBox from '../../../../../components/SoftBox';
import SoftButton from '../../../../../components/SoftButton';
import SoftInput from '../../../../../components/SoftInput';
import SoftSelect from '../../../../../components/SoftSelect';
import DashboardLayout from '../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../examples/Navbars/DashboardNavbar';
import { useSnackbar } from '../../../../../hooks/SnackbarProvider';

const CreateProductWhatsappCamp = () => {
  const [templateName, setTemplateName] = useState('');
  const [bodyText, setBodyText] = useState('');
  const [exampleBody, setExampleBody] = useState(false);
  const [count, setCount] = useState(0);
  const [examples, setExamples] = useState([]);
  const navigate = useNavigate();
  const [count1, setCount1] = useState(0);
  const [footerText, setFooterText] = useState('');
  const [count2, setCount2] = useState(0);
  const [currentTime, setCurrentTime] = useState('');
  const [headerText, setHeaderText] = useState('');
  const [count3, setCount3] = useState(0);

  const showSnackbar = useSnackbar();
  const [selectedFormat, setSelectedFormat] = useState('Catalogue');

  const handleFormatChange = (event) => {
    setSelectedFormat(event.target.value);
  };

  const handleFooterChange = (event) => {
    const inputValue = event.target.value;

    if (inputValue.length <= 60) {
      const wordCount = inputValue.length;

      // Update state
      setCount2(wordCount);
      setFooterText(inputValue);
    }
  };

  const handleHeaderChange = (event) => {
    const inputValue = event.target.value;

    if (inputValue.length <= 60) {
      const wordCount = inputValue.length;

      // Update state
      setCount3(wordCount);
      setHeaderText(inputValue);
    }
  };

  const StyledTextComponent = ({ bodyText }) => {
    const parts = bodyText.split('*');

    return (
      <div>
        {parts.map((part, index) => {
          // Render even-indexed parts as regular text
          if (index % 2 === 0) {
            return <span key={index}>{part}</span>;
          } else {
            // Render odd-indexed parts as bold text
            return <strong key={index}>{part}</strong>;
          }
        })}
      </div>
    );
  };

  const handleBodyChange = (event) => {
    const inputValue = event.target.value;
    if (inputValue.length <= 1024) {
      setBodyText(inputValue);

      // Check if the input value contains "{{"
      if (inputValue.includes('{{')) {
        setExampleBody(true);
      } else {
        setExampleBody(false);
      }

      // Word count logic
      const wordCount = inputValue.length;

      // Update state
      setCount1(wordCount);

      const occurrences = (inputValue.match(/{{/g) || []).length;
      setCount(occurrences);

      const inputExamples = [];
      for (let i = 0; i < occurrences; i++) {
        inputExamples.push(
          <div key={i} style={{ display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center' }}>
            <Typography
              style={{
                fontWeight: '200',
                fontSize: '0.8rem',
                lineHeight: '1.5',
                color: '#4b524d',
                textAlign: 'left',
                marginTop: '20px',
              }}
            >
              {i + 1}
            </Typography>
            <SoftInput
              key={i}
              type="text"
              placeholder={`Enter Content for {{${i + 1}}}`}
              style={{ width: '400px', marginTop: '20px' }}
              value={examples[i] ? examples[i].value : ''}
              onChange={(e) => handleExampleChange(e, i)}
            />
          </div>,
        );
      }
      setExamples(inputExamples);
    }
  };

  const handleExampleChange = (event, index) => {
    const newValue = event.target.value;

    // Update the examples array with the new value
    setExamples((prevExamples) =>
      prevExamples.map((example, i) => (i === index ? { ...example, value: newValue } : example)),
    );
  };

  useEffect(() => {
    // Function to update the current time every second

    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0'); // Get hours and pad with leading zero if necessary
      const minutes = now.getMinutes().toString().padStart(2, '0'); // Get minutes and pad with leading zero if necessary
      setCurrentTime(`${hours}:${minutes}`);
    };

    // Update the time immediately and then every second
    updateTime();
    const intervalId = setInterval(updateTime, 1000);

    // Clean up the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []);

  const catalogOptions = [
    {
      label: 'Catalogue 1',
      value: 'Catalogue 1',
    },
    {
      label: 'Catalogue 2',
      value: 'Catalogue 2',
    },
    {
      label: 'Catalogue 3',
      value: 'Catalogue 3',
    },
    {
      label: 'Catalogue 4',
      value: 'Catalogue 4',
    },
  ];

  return (
    <div>
      <DashboardLayout>
        <DashboardNavbar prevLink={true} />
        <Box
          className="table-css-fix-box-scroll-vend"
          style={{
            boxShadow: 'rgba(37, 37, 37, 0.126) 0px 5px 50px',
            position: 'relative',
            padding: '20px',
          }}
        >
          <div style={{ display: 'flex', gap: '10px' }}>
            <Typography>WhatsApp Campaign Template Set up</Typography>
          </div>
          <SoftBox
            py={0}
            px={0}
            sx={{
              marginTop: '1rem',
            }}
          >
            <Grid container spacing={4}>
              <Grid item lg={8} sm={12} md={6} xs={12}>
                <SoftBox style={{ marginTop: '20px' }}>
                  <Typography
                    style={{
                      fontWeight: '600',
                      fontSize: '0.9rem',
                      lineHeight: '1.5',
                      color: '#0562FB',
                      textAlign: 'left',
                      margin: '10px 0px',
                    }}
                  >
                    Name
                  </Typography>
                  <Typography
                    style={{
                      fontWeight: '200',
                      fontSize: '0.8rem',
                      lineHeight: '1.5',
                      color: '#4b524d',
                      textAlign: 'left',
                      margin: '10px 0px',
                    }}
                  >
                    Name your message template.
                  </Typography>
                  <SoftInput
                    placeholder="Enter Template Name"
                    style={{ width: '400px' }}
                    onChange={(e) => setTemplateName(e.target.value)}
                  />
                  <Typography
                    style={{
                      fontWeight: '200',
                      fontSize: '0.8rem',
                      lineHeight: '1.5',
                      color: '#4b524d',
                      textAlign: 'left',
                      margin: '10px 0px',
                    }}
                  >
                    Name should start with small letter and contains '_'
                  </Typography>
                </SoftBox>

                <SoftBox style={{ marginTop: '20px' }}>
                  <Typography
                    style={{
                      fontWeight: '600',
                      fontSize: '0.9rem',
                      lineHeight: '1.5',
                      color: '#0562FB',
                      textAlign: 'left',
                      margin: '10px 0px',
                    }}
                  >
                    Template format
                  </Typography>
                  <Typography
                    style={{
                      fontWeight: '200',
                      fontSize: '0.8rem',
                      lineHeight: '1.5',
                      color: '#4b524d',
                      textAlign: 'left',
                      margin: '10px 0px',
                    }}
                  >
                    Choose the message format that best fits your needs
                  </Typography>
                  <input
                    type="radio"
                    id="html"
                    name="fav_language"
                    value="Catalogue"
                    checked={selectedFormat === 'Catalogue'}
                    onChange={handleFormatChange}
                  />{' '}
                  <label
                    htmlFor="html"
                    style={{
                      fontWeight: '600',
                      fontSize: '0.9rem',
                      lineHeight: '1.5',
                      color: '#4b524d',
                      textAlign: 'left',
                    }}
                  >
                    Catalogue message
                  </label>
                  <Typography
                    style={{
                      fontWeight: '200',
                      fontSize: '0.7rem',
                      lineHeight: '1.5',
                      color: '#4b524d',
                      textAlign: 'left',
                      marginLeft: '25px',
                    }}
                  >
                    Include the entire catalogue to give your users a comprehensive view of all of your products.
                  </Typography>
                  <input
                    type="radio"
                    id="css"
                    name="fav_language"
                    value="MultiProduct"
                    checked={selectedFormat === 'MultiProduct'}
                    onChange={handleFormatChange}
                  />{' '}
                  <label
                    style={{
                      fontWeight: '600',
                      fontSize: '0.9rem',
                      lineHeight: '1.5',
                      color: '#4b524d',
                      textAlign: 'left',
                    }}
                    htmlFor="css"
                  >
                    Multi-product message
                  </label>
                  <Typography
                    style={{
                      fontWeight: '200',
                      fontSize: '0.7rem',
                      lineHeight: '1.5',
                      color: '#4b524d',
                      textAlign: 'left',
                      marginLeft: '25px',
                    }}
                  >
                    Include up to 30 products from the catalogue. Useful for showcasing new collection or a specific
                    product category.
                  </Typography>
                </SoftBox>

                <SoftBox style={{ marginTop: '20px' }}>
                  <Typography
                    style={{
                      fontWeight: '600',
                      fontSize: '0.9rem',
                      lineHeight: '1.5',
                      color: '#0562FB',
                      textAlign: 'left',
                      margin: '10px 0px',
                    }}
                  >
                    Catalogue
                  </Typography>
                  <Typography
                    style={{
                      fontWeight: '200',
                      fontSize: '0.8rem',
                      lineHeight: '1.5',
                      color: '#4b524d',
                      textAlign: 'left',
                      margin: '10px 0px',
                    }}
                  >
                    Choose a catalogue to send a list of items to your customers. This is connected with your WhatsApp
                    Business account. Up to 30 items can be sent.
                  </Typography>
                  <SoftSelect placeholder="Choose Catalogue" options={catalogOptions} />
                </SoftBox>

                {selectedFormat === 'MultiProduct' && (
                  <SoftBox style={{ marginTop: '20px' }}>
                    <Typography
                      style={{
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        lineHeight: '1.5',
                        color: '#0562FB',
                        textAlign: 'left',
                        margin: '10px 0px',
                      }}
                    >
                      Header
                    </Typography>
                    <Typography
                      style={{
                        fontWeight: '200',
                        fontSize: '0.8rem',
                        lineHeight: '1.5',
                        color: '#4b524d',
                        textAlign: 'left',
                        margin: '10px 0px',
                      }}
                    >
                      Add a title or choose which type of media you'll use for this header.
                    </Typography>
                    <SoftInput
                      placeholder="Enter Text in English (UK)"
                      style={{ width: '400px' }}
                      value={headerText}
                      onChange={handleHeaderChange}
                    />
                    <Typography
                      style={{
                        fontWeight: '600',
                        fontSize: '0.6rem',
                        lineHeight: '1.5',
                        color: '#0562FB',
                        textAlign: 'right',
                        margin: '10px 0px',
                      }}
                    >
                      {count3}/60
                    </Typography>
                  </SoftBox>
                )}

                <SoftBox style={{ marginTop: '5px' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Typography
                      style={{
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        lineHeight: '1.5',
                        color: '#0562FB',
                        textAlign: 'left',
                        margin: '10px 0px',
                      }}
                    >
                      Body
                    </Typography>
                    <Tooltip
                      title='To bold the text Please add the text between "*". To write the text in Italic Please add the text between "_". To strike-through the text Please add the text between "~"'
                      placement="top"
                    >
                      <IconButton>
                        <InfoIcon sx={{ fontSize: '15px' }} />
                      </IconButton>
                    </Tooltip>
                  </div>
                  <Typography
                    style={{
                      fontWeight: '200',
                      fontSize: '0.8rem',
                      lineHeight: '1.5',
                      color: '#4b524d',
                      textAlign: 'left',
                      margin: '10px 0px',
                    }}
                  >
                    Enter the text for your message.
                  </Typography>
                  <SoftInput
                    placeholder="Enter Text in English (UK)"
                    style={{ width: '400px' }}
                    value={bodyText}
                    onChange={handleBodyChange}
                  />
                  <Typography
                    style={{
                      fontWeight: '600',
                      fontSize: '0.6rem',
                      lineHeight: '1.5',
                      color: '#0562FB',
                      textAlign: 'right',
                      margin: '10px 0px',
                    }}
                  >
                    {count1}/1024
                  </Typography>
                  {/* <textarea id="w3review" name="w3review" rows="4" placeholder="Enter Text in English (UK)"></textarea> */}
                </SoftBox>
                {exampleBody && (
                  <SoftBox style={{ marginTop: '20px' }}>
                    <Typography
                      style={{
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        lineHeight: '1.5',
                        color: '#0562FB',
                        textAlign: 'left',
                        margin: '10px 0px',
                      }}
                    >
                      Samples for body content
                    </Typography>
                    <Typography
                      style={{
                        fontWeight: '200',
                        fontSize: '0.8rem',
                        lineHeight: '1.5',
                        color: '#4b524d',
                        textAlign: 'left',
                        margin: '10px 0px',
                      }}
                    >
                      To help us review your message template, please add an example for each variable in your body
                      text. Do not use real customer information. Cloud API hosted by Meta reviews templates and
                      variable parameters to protect the security and integrity of our services.
                    </Typography>
                    <Typography
                      style={{
                        fontWeight: '600',
                        fontSize: '0.8rem',
                        lineHeight: '1.5',
                        color: '#4b524d',
                        textAlign: 'left',
                        margin: '10px 0px',
                      }}
                    >
                      Body
                    </Typography>
                    {examples}
                  </SoftBox>
                )}

                <SoftBox style={{ marginTop: '20px' }}>
                  <Typography
                    style={{
                      fontWeight: '600',
                      fontSize: '0.9rem',
                      lineHeight: '1.5',
                      color: '#0562FB',
                      textAlign: 'left',
                      margin: '10px 0px',
                    }}
                  >
                    Footer <span style={{ fontSize: '0.8rem' }}>Optional</span>
                  </Typography>
                  <Typography
                    style={{
                      fontWeight: '200',
                      fontSize: '0.8rem',
                      lineHeight: '1.5',
                      color: '#4b524d',
                      textAlign: 'left',
                      margin: '10px 0px',
                    }}
                  >
                    Add a short line of text to the bottom of your message template. If you add the marketing opt-out
                    button, the associated footer will be shown here by default.
                  </Typography>
                  <SoftInput
                    placeholder="Enter Text in English (UK)"
                    style={{ width: '400px' }}
                    value={footerText}
                    onChange={handleFooterChange}
                  />
                  <Typography
                    style={{
                      fontWeight: '600',
                      fontSize: '0.6rem',
                      lineHeight: '1.5',
                      color: '#0562FB',
                      textAlign: 'right',
                      margin: '10px 0px',
                    }}
                  >
                    {count2}/60
                  </Typography>
                </SoftBox>
              </Grid>
              <Grid item lg={4} sm={12} md={6} xs={12} style={{ position: 'sticky', top: '0', zIndex: '1' }}>
                <Typography
                  style={{
                    fontWeight: '200',
                    fontSize: '1rem',
                    lineHeight: '1.5',
                    color: '#4b524d',
                    textAlign: 'left',
                    margin: '10px 0px',
                  }}
                >
                  Message Preview
                </Typography>
                <SoftBox className="message-preview-box">
                  <SoftBox className="message-preview-inner">
                    <div className="message-preview-top-box">
                      <div className="message-preview-top-img">
                        <ImageIcon sx={{ fontSize: '30px', color: '#fff' }} />
                      </div>
                      <div>
                        {selectedFormat === 'Catalogue' && (
                          <Typography
                            style={{
                              fontSize: '0.8rem',
                              lineHeight: '1.5',
                              textAlign: 'left',
                              marginTop: '10px',
                              fontWeight: '200',
                            }}
                          >
                            View (BIZ_NAME)'s Catalog on Whatsapp
                          </Typography>
                        )}
                        <Typography
                          style={{
                            fontSize: '0.6rem',
                            lineHeight: '1.5',
                            textAlign: 'left',
                            fontWeight: '200',
                          }}
                        >
                          {selectedFormat === 'Catalogue'
                            ? 'Browse pictures and details of their offerings'
                            : '# {{items}}'}
                        </Typography>
                      </div>
                    </div>
                    {headerText !== '' ? (
                      <Typography
                        style={{
                          fontWeight: '600',
                          fontSize: '0.9rem',
                          lineHeight: '1.5',
                          textAlign: 'left',
                          margin: '10px 0px',
                        }}
                      >
                        {headerText}
                      </Typography>
                    ) : null}
                    {bodyText !== '' ? (
                      <Typography
                        style={{
                          fontSize: '0.9rem',
                          lineHeight: '1.5',
                          textAlign: 'left',
                          margin: '10px 0px',
                          fontWeight: '200',
                        }}
                      >
                        <StyledTextComponent bodyText={bodyText} />
                      </Typography>
                    ) : null}
                    {footerText !== '' ? (
                      <Typography
                        style={{
                          fontWeight: '200',
                          fontSize: '0.8rem',
                          lineHeight: '1.5',
                          textAlign: 'left',
                          margin: '10px 0px',
                          color: '#8D949E',
                        }}
                      >
                        {footerText}
                      </Typography>
                    ) : null}
                    <p className="message-preview-time">{currentTime}</p>
                    <SoftBox>
                      <hr />
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginTop: '10px',
                          gap: '10px',
                        }}
                      >
                        <ListIcon sx={{ color: '#0562FB', size: '14px' }} />
                        <Typography
                          style={{
                            fontWeight: '200',
                            fontSize: '0.9rem',
                            lineHeight: '1.5',
                            textAlign: 'left',
                            margin: '10px 0px',
                            color: '#0562FB',
                          }}
                        >
                          {selectedFormat === 'Catalogue' ? 'View Catalog' : 'View Items'}
                        </Typography>
                      </div>
                    </SoftBox>
                  </SoftBox>
                </SoftBox>
              </Grid>
            </Grid>
            <SoftBox display="flex" justifyContent="flex-end" mt={4}>
              <SoftBox display="flex">
                <SoftButton className="vendor-second-btn" onClick={() => navigate('/campaigns/whatsapp')}>
                  Cancel
                </SoftButton>
                <SoftBox ml={2}>
                  <SoftButton
                    // variant="gradient"
                    color="info"
                    className="vendor-add-btn"
                  >
                    Submit
                  </SoftButton>
                </SoftBox>
              </SoftBox>
            </SoftBox>
          </SoftBox>
        </Box>
      </DashboardLayout>
    </div>
  );
};

export default CreateProductWhatsappCamp;
