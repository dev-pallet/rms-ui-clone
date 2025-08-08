import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import { Box, Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import SoftBox from '../../../../../components/SoftBox';
import SoftInput from '../../../../../components/SoftInput';
import DashboardLayout from '../../../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../../../examples/Navbars/DashboardNavbar';
import Messaging from './Messaging';

const Chats = () => {
  const [openChats, setOpenChats] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState('');
  const [filteredContacts, setFilteredContacts] = useState([]);

  const contacts = [
    {
      id: 1,
      avatar: 'https://gravatar.com/avatar/627174e60d5be049d6fc17d707a3ef08?s=400&d=robohash&r=x',
      name: 'Louis Litt',
      date: '23 Nov, 2023',
      message: 'Wrong Order',
    },
    {
      id: 2,
      avatar: 'https://gravatar.com/avatar/fb5d72fe5e31d83d3d4cdd9f22e0e404?s=400&d=robohash&r=x',
      name: 'Harvey Specter',
      date: '24 Nov, 2023',
      message: "I'd like to talk to an executive",
    },
    {
      id: 3,
      avatar: 'https://gravatar.com/avatar/3095f878ef91fb3756ff0d8149f1c5a8?s=400&d=robohash&r=x',
      name: 'Ross Geller',
      date: '22 Nov, 2023',
      message: 'We were on a break.......',
    },
    {
      id: 4,
      avatar: 'https://gravatar.com/avatar/9f73616c669f8cc817e4c07aa452fd6d?s=400&d=robohash&r=x',
      name: 'Rachel Greene',
      date: '25 Nov, 2023',
      message: "The order has not been delivered yet. It's been more than an hour.",
    },
    {
      id: 5,
      avatar: 'https://gravatar.com/avatar/b6377b48835d6ca3e92b3d4050dee1ea?s=400&d=robohash&r=x',
      name: 'Monica Geller',
      date: '1 Dec, 2023',
      message: 'Chandlerr.....',
    },
    {
      id: 6,
      avatar: 'https://gravatar.com/avatar/7195b74e2f1f31b4ff591933c0a24b79?s=400&d=robohash&r=x',
      name: 'Chandler Bing',
      date: '2 Nov, 2023',
      message: "Dont't ring the bell for 302 Reach 301, Geller/Green. If you did, no tip for you.",
    },
    {
      id: 7,
      avatar: 'https://gravatar.com/avatar/487dedb94cc040e3a5fc4e4f51aeb6fe?s=400&d=robohash&r=x',
      name: 'Joey Tribbiani',
      date: '28 Nov, 2023',
      message: "Joey doesn't share food",
    },
  ];

  const handleSearch = (searchTerm) => {
    const filtered = contacts.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    setFilteredContacts(filtered);
  };

  useEffect(() => {
    setSelectedContacts(contacts[0]);
  }, []);

  return (
    <div>
      <DashboardLayout>
        <DashboardNavbar />
        <Box
          className="table-css-fix-box-scroll-vend"
          style={{
            boxShadow: 'rgba(37, 37, 37, 0.126) 0px 5px 50px',
            position: 'relative',
            padding: '20px',
          }}
        >
          <div style={{ display: 'flex', gap: '10px' }}>
            <Typography>Chats</Typography>
          </div>
          <SoftBox
            py={0}
            px={0}
            sx={{
              marginTop: '1rem',
              borderTop: '1px solid #e3e3e3',
            }}
          >
            <Grid container spacing={4}>
              <Grid item lg={4} sm={12} md={6} xs={12} style={{ borderRight: '1px solid #e3e3e3' }}>
                <SoftBox onClick={() => setOpenChats(!openChats)} style={{ borderBottom: '1px solid #e3e3e3' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Typography
                      style={{
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        lineHeight: '1.5',
                        color: '#2954A5',
                        textAlign: 'left',
                        marginTop: '5px',
                      }}
                    >
                      {openChats === true ? (
                        <ExpandMoreIcon sx={{ size: '18px' }} />
                      ) : (
                        <ExpandLessIcon sx={{ size: '18px' }} />
                      )}{' '}
                    </Typography>
                    <Typography
                      style={{
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        lineHeight: '1.5',
                        color: '#2954A5',
                        textAlign: 'left',
                        padding: '10px',
                      }}
                    >
                      My Chats
                    </Typography>
                  </div>
                </SoftBox>
                {openChats && (
                  <div style={{ height: '60vh', overflowY: 'auto' }}>
                    <SoftBox style={{ borderBottom: '1px solid #e3e3e3' }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Typography
                          style={{
                            fontWeight: '600',
                            fontSize: '0.9rem',
                            lineHeight: '1.5',
                            color: '#2954A5',
                            textAlign: 'left',
                            marginTop: '5px',
                          }}
                        >
                          <SearchIcon sx={{ color: '#c4c4c4', size: '18px' }} />
                        </Typography>
                        <SoftInput
                          placeholder="Search Contacts.."
                          style={{ border: 'none' }}
                          onChange={(e) => handleSearch(e.target.value)}
                        />
                      </div>
                    </SoftBox>
                    {(filteredContacts.length > 0 ? filteredContacts : contacts).map((item) => {
                      return (
                        <SoftBox
                          style={{
                            borderBottom: '1px solid #e3e3e3',
                            display: 'flex',
                            gap: '6px',
                            marginTop: '10px',
                          }}
                          onClick={() => setSelectedContacts(item)}
                        >
                          <div style={{ width: '15%' }}>
                            <img
                              src={item.avatar}
                              alt={item.id}
                              style={{ width: '50px', height: '50px', borderRadius: '50%', marginBottom: '10px' }}
                            />
                          </div>
                          <div style={{ marginBottom: '10px', width: '80%' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography
                                style={{
                                  fontWeight: '600',
                                  fontSize: '0.9rem',
                                  lineHeight: '1.5',
                                  color: '#1a1f36',
                                  textAlign: 'left',
                                  marginTop: '5px',
                                }}
                              >
                                {item.name}
                              </Typography>
                              <Typography
                                style={{
                                  fontWeight: '600',
                                  fontSize: '0.8rem',
                                  lineHeight: '1.5',
                                  color: '#9c9c9c',
                                  textAlign: 'right',
                                  marginTop: '5px',
                                }}
                              >
                                {item.date}
                              </Typography>
                            </div>
                            <Typography
                              style={{
                                fontWeight: '400',
                                fontSize: '0.7rem',
                                lineHeight: '1.5',
                                color: '#9c9c9c',
                                textAlign: 'left',
                              }}
                            >
                              {item.message}
                            </Typography>
                          </div>
                        </SoftBox>
                      );
                    })}
                  </div>
                )}
              </Grid>
              <Grid item lg={8} sm={12} md={6} xs={12} style={{ paddingLeft: '0px' }}>
                <Messaging selectedContacts={selectedContacts} />
              </Grid>
            </Grid>
          </SoftBox>
        </Box>
      </DashboardLayout>
    </div>
  );
};

export default Chats;
