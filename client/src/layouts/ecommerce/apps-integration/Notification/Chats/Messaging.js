import AttachFileIcon from '@mui/icons-material/AttachFile';
import { Typography } from '@mui/material';
import SoftBox from '../../../../../components/SoftBox';
import SoftButton from '../../../../../components/SoftButton';
import SoftInput from '../../../../../components/SoftInput';
import Messages from './Messages';

const Messaging = ({ selectedContacts }) => {
  // console.log(selectedContacts)
  return (
    <div>
      <SoftBox
        style={{
          background: '#f7fafc',
          display: 'flex',
          borderBottom: '1px solid #e3e3e3',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <img
          src={selectedContacts.avatar}
          alt={selectedContacts.id}
          style={{ width: '50px', height: '50px', borderRadius: '50%', marginBottom: '10px', marginLeft: '20px' }}
        />
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
          {selectedContacts.name}
        </Typography>
      </SoftBox>
      <SoftBox style={{ height: '50vh', overflowY: 'auto' }}>
        <Messages selectedContacts={selectedContacts} />
      </SoftBox>
      <SoftBox style={{ border: '1px solid #e3e3e3', borderRadius: '5px', padding: '5px', marginLeft: '20px' }}>
        <SoftInput placeholder="Write a message..." style={{ border: 'none', marginBottom: '5px' }} />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '5px', alignItems: 'center' }}>
          <AttachFileIcon />
          <SoftButton className="vendor-add-btn">Send</SoftButton>
        </div>
      </SoftBox>
    </div>
  );
};

export default Messaging;
