import { Box, Typography, createTheme } from '@mui/material';
import { ThemeProvider } from '@emotion/react';
import { textFormatter } from './CommonFunction';
import { useEffect, useState } from 'react';
import CircleRoundedIcon from '@mui/icons-material/CircleRounded';

// prefix checker for po and pi
const checkPrefixForPO_PI = (inputString) => {
  const prefix = inputString.substring(0, 2).toLowerCase(); // Get the first two letters in lowercase
  if (prefix === 'po' || prefix === 'pi') {
    return true;
  } else {
    return false;
  }
};

//text format for po and pi
const po_pi_textFormatter = (inputString) => {
  let str = inputString.split('_');
  // make copy of first element and store in strCopy
  const strCopy = str[0].toUpperCase();
  str.shift();
  str = str.join(' ');
  str = textFormatter(str);
  str = strCopy + ' ' + str;

  return str;
};

//remove _ from status
const removeUnderscore = (inputString) => {
  // 'po_inward po inward';
  if (inputString.includes('_')) {
    return inputString.replace(/_/g, ' ');
  } else {
    return inputString;
  }
};

const dynamicTheme = (color) => {
  return createTheme({
    palette: {
      primary: {
        main: color || '#8392AB', // Use the provided color prop or fallback to default
      },
    },
  });
};

export default function Status({ label }) {
  const [color, setColor] = useState('');
  const [theme, setTheme] = useState(dynamicTheme(color));

  const colorSwitcher = (label) => {
    switch (label) {
      case 'ERROR':
        setColor('#f44336');
        break;
      case 'STOPPED':
        setColor('#f44336');
        break;
      case 'SUCCESS':
        setColor('#04AA6D');
        break;
      case 'WARNING':
        setColor('#f1c232');
        break;
      case 'STARTED':
        setColor('#04AA6D');
        break;
      case 'CLOSED':
        setColor('#f44336');
        break;
      case 'SOLD':
        setColor('#f44336');
        break;
      case 'PARTIALLY_RECEIVED':
        setColor('#f1c232');
        break;
      case 'OPEN':
        setColor('#c27ba0');
        break;
      case 'RECEIVED':
        setColor('#04AA6D');
        break;
      case 'ESTIMATED':
        setColor('#6c8ebf');
        break;

      case 'COMPLETED':
        setColor('#04AA6D');
        break;

      case 'PENDING_APPROVAL_1':
        setColor('#f1c232');
        break;
      case 'PENDING_APPROVAL_2':
        setColor('#f1c232');
        break;
      case 'SHIPPED':
        setColor('#ed7d31');
        break;

      case 'PAYMENT_PENDING':
        setColor('#f1c232');
        break;
      case 'PAYMENT_CANCELLED':
        setColor('#f44336');
        break;
      case 'PAYMENT COMPLETED':
        setColor('#04AA6D');
        break;
      case 'CREATED':
        setColor('#c27ba0');
        break;
      case 'DELIVERED':
        setColor('#04AA6D');
        break;
      case 'PENDING':
        setColor('#f1c232');
        break;
      case 'PACKAGED':
        setColor('#dd7e6b');
        break;
      case 'IN_TRANSIT':
        setColor('#6c8ebf');
        break;
      case 'CANCELLED':
        setColor('#f44336');
        break;
      case 'Cancelled':
        setColor('#f44336');
        break;

      case 'APPROVED':
        setColor('#04AA6D');
        break;
      case 'ASSIGNED':
        setColor('#6c8ebf');
        break;
      case 'REJECTED':
        setColor('#ed7d31');
        break;
      case 'DELETED':
        setColor('#f44336');
        break;
      case 'DELETE':
        setColor('#f44336');
        break;

      case 'ACCEPTED':
        setColor('#ed7d31');
        break;
      case 'INWARDED':
        setColor('#04AA6D');
        break;
      case 'PARTIALLY_INWARDED':
        setColor('#f1c232');
        break;

      case 'PO_CREATED':
        setColor('#c27ba0');
        break;
      case 'PO_PENDING_APPROVAL':
        setColor('#f1c232');
        break;
      case 'PO_CLOSED':
        setColor('#f44336');
        break;
      case 'PENDING_APPROVAL':
        setColor('#f1c232');
        break;
      case 'DRAFT':
        setColor('#f44336');
        break;
      case 'INWARD_SUCCESSFUL':
        setColor('#04AA6D');
        break;
      case 'CLOSE':
        setColor('#f44336');
        break;

      case 'PAID':
        setColor('#04AA6D');
        break;
      case 'PARTIALLY_PAID':
        setColor('#f1c232');
        break;

      case 'ACTIVE':
        setColor('#04AA6D');
        break;
      case 'INACTIVE':
        setColor('#ed7d31');
        break;

      case 'Closed':
        setColor('#f44336');
        break;
      case 'SETTLED':
        setColor('#04AA6D');
        break;
      case 'Activated':
        setColor('#04AA6D');
        break;
      case 'APPROVAL_PENDING':
        setColor('#f1c232');
        break;
      case 'INPROGRESS':
        setColor('#f1c232');
        break;
      case 'EXPIRED':
        setColor('#f44336');
        break;
      case 'CREATION_IN_PROGRESS':
        setColor('#f1c232');
        break;
      case 'STOPPED':
        setColor('#f44336');
        break;

      default:
        return;
    }
  };

  useEffect(() => {
    colorSwitcher(label);
    setTheme(dynamicTheme(color));
    // console.log(color, label);
  }, [label, color]); // Add color as a dependency

  return (
    <ThemeProvider theme={theme}>
      <Box display="flex" justifyContent="center" alignItems="center" gap="10px">
        <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
          <CircleRoundedIcon
            color="primary"
            sx={{ width: '10px !important', height: '10px !important', top: '-5px' }}
          />
        </Box>
        <Typography sx={{ fontSize: '12px !important', color: '#67748E' }}>
          {checkPrefixForPO_PI(label) ? po_pi_textFormatter(label) : textFormatter(removeUnderscore(label))}
        </Typography>
      </Box>
    </ThemeProvider>
  );
}
