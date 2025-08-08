import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import { Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import SoftBox from '../../../../../components/SoftBox';
import SoftInput from '../../../../../components/SoftInput';

const Chatbot = ({ chatBotOpen }) => {
  const [messages, setMessages] = useState([]);
  const [custMsg, setCustMsg] = useState('');

  const custDetails = JSON.parse(localStorage.getItem('user_details'));

  const handleFirstMsg = () => {
    if (chatBotOpen === true && messages.length === 0) {
      setMessages([
        {
          type: 'sales',
          msg: `Hi ${custDetails.firstName}, How can I help you?`,
          time: Date.now(),
        },
      ]);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      handleFirstMsg();
    }, 1000);
  }, []);

  useEffect(() => {
    console.log(messages);
  }, [messages]);

  const handleMessageSend = () => {
    setMessages([
      ...messages,
      {
        type: 'customer',
        msg: custMsg,
        time: Date.now(),
      },
    ]);
    setCustMsg('');
  };

  return (
    <div>
      <SoftBox
        style={{
          backgroundColor: '#0562FB',
          borderRadius: '10px 10px 0px 0px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            backgroundColor: '#fff',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '5px',
          }}
        >
          <img src="https://i.postimg.cc/SR51RqzJ/chatbot.png" alt="" style={{ height: '30px', width: '30px' }} />
        </div>
        <Typography
          style={{
            fontWeight: '600',
            fontSize: '1rem',
            lineHeight: '1.5',
            color: '#fff',
            textAlign: 'left',
            padding: '10px',
          }}
        >
          Chat
        </Typography>
        <div style={{ textAlign: 'right' }}>
          <CloseIcon sx={{ color: '#fff' }} />
        </div>
      </SoftBox>
      <SoftBox style={{ backgroundColor: '#fff', height: '313px', overflowY: 'auto', padding: '10px' }}>
        {/* <Messages selectedContacts={selectContacts} /> */}
        {messages.length !== 0 && (
          <div>
            {messages.map((item, i) => (
              <div key={i}>
                {item.type === 'sales' ? (
                  <div style={{ display: 'flex', gap: '5px', marginTop: '15px' }}>
                    <img
                      src="https://i.postimg.cc/SR51RqzJ/chatbot.png"
                      alt=""
                      style={{ height: '30px', width: '30px' }}
                    />
                    <Typography
                      style={{
                        fontWeight: '200',
                        fontSize: '0.8rem',
                        lineHeight: '1.5',
                        color: '#fff',
                        textAlign: 'right',
                        marginTop: '5px',
                        backgroundColor: '#0562FB',
                        padding: '10px',
                        borderRadius: '10px',
                      }}
                    >
                      {item.msg}
                    </Typography>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '5px', marginTop: '15px', justifyContent: 'flex-end' }}>
                    <Typography
                      style={{
                        fontWeight: '200',
                        fontSize: '0.8rem',
                        lineHeight: '1.5',
                        color: '#333333',
                        textAlign: 'left',
                        marginTop: '5px',
                        backgroundColor: '#f5f5f5',
                        padding: '10px',
                        borderRadius: '10px',
                      }}
                    >
                      {item.msg}
                    </Typography>
                    <img
                      src="https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png"
                      alt=""
                      style={{ height: '30px', width: '30px', borderRadius: '50%' }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </SoftBox>
      <SoftBox
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#fff',
          borderTop: '1px solid #e3e3e3',
          borderRadius: '0px 0px 10px 10px',
        }}
      >
        <SoftInput
          placeholder="Type a Message..."
          style={{ border: 'none' }}
          onChange={(e) => setCustMsg(e.target.value)}
        />
        <div style={{ padding: '10px', cursor: 'pointer' }}>
          <SendIcon fontSize="small" onClick={handleMessageSend} />
        </div>
      </SoftBox>
    </div>
  );
};

export default Chatbot;
