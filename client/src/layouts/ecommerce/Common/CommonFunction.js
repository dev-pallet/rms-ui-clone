import { Tooltip, useMediaQuery } from '@mui/material';
import { useCopyToClipboard } from 'usehooks-ts';
import CloseRoundedIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SoftBox from '../../../components/SoftBox';
import moment from 'moment';
import { formatDistanceToNow, parse } from 'date-fns';
import { getProductIdByBarcode } from '../../../config/Services';
import { useState } from 'react';
import Cookies from 'js-cookie';

export const updatingPageNumber = (topLevelKeyname, nestedKeyname, value, pageNumberData) => {
  const updatedPageNumber = {
    ...pageNumberData,
  };

  // updating the the pageNumber of the given page, as topkeyname and nestedkeyname
  for (const pageNumber in updatedPageNumber) {
    if (typeof updatedPageNumber[pageNumber] !== 'object') {
      if (topLevelKeyname === pageNumber) {
        pageNumber = value;
      } else {
        continue;
      }
    } else {
      if (nestedKeyname in updatedPageNumber[pageNumber]) {
        updatedPageNumber[pageNumber][nestedKeyname] = 1;
      }
    }
  }

  // updating the rest values to 1
  for (const topKeyName in updatedPageNumber) {
    if (typeof updatedPageNumber[topKeyName] === 'object') {
      for (const nestedKey in updatedPageNumber[topKeyName]) {
        if (topKeyName !== topLevelKeyname) {
          updatedPageNumber[topKeyName][nestedKey] = 1;
        }
      }
    } else {
      if (topKeyName !== topLevelKeyname) {
        updatedPageNumber[topKeyName] = 1;
      }
    }
  }

  return updatedPageNumber;
};

// function to convert the word where the first letter is capitalized and the rest are in lowercase
export const textFormatter = (text) => {
  if (text === null) {
    return 'NA';
  }
  // if text contains _ then replace it by " "
  if (text?.includes('_')) {
    text = text?.replace(/_/g, ' ');
  }

  return text
    ?.split(' ')
    ?.map((word) => {
      if (word?.length > 1) {
        return word?.charAt(0)?.toUpperCase() + word?.slice(1)?.toLowerCase();
      } else {
        return word?.toUpperCase();
      }
    })
    ?.join(' ');
};

// pallet logo
export const palletLogo = 'https://storage.googleapis.com/twinleaves_stage_public/logo/pallet-logo-2.png';

// date formatter to convert date in text formate ex - 28/10/2023 to 28 October, 2023
export const dateFormatter = (date) => {
  // if (date) {
  //   const isDateTime = date.includes('T');
  //   const isoDateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{6}$/;
  //   const customDateFormat = /^\d{1,2} [a-zA-Z]+ \d{4}, \d{2}:\d{2} (AM|PM)$/;

  //   if (isoDateFormat.test(date)) {
  //     // If the date is already in the ISO format, return only the date part
  //     return moment.utc(date).format('DD MMM, YYYY');
  //   }

  //   if (customDateFormat.test(date)) {
  //     // If the date is in the custom format, return only the date part
  //     return moment(date, 'DD MMM YYYY, hh:mm A').format('DD MMM, YYYY');
  //   }

  //   const parsedDate = moment(date);

  //   if (parsedDate.isValid()) {
  //     const formatString = isDateTime ? 'DD MMM, YYYY hh:mm A' : 'DD MMM, YYYY';
  //     return parsedDate.format(formatString);
  //   }
  // }

  // return 'NA';

  if (date) {
    const isDateTime = date.includes('T');
    const isoDateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{6}$/;
    const customDateFormat = /^\d{1,2} [a-zA-Z]+ \d{4}, \d{2}:\d{2} (AM|PM)$/;

    if (isoDateFormat.test(date)) {
      // If the date is already in the ISO format, return only the date part
      return moment.utc(date).format('DD MMM, YYYY');
    }

    if (customDateFormat.test(date)) {
      // If the date is in the custom format, return only the date part
      return moment(date, 'DD MMM YYYY, hh:mm A', true).format('DD MMM, YYYY');
      //                                              ^^^^^
      // Explicitly specifying "true" to enable strict parsing mode.
    }

    const parsedDate = moment(date, undefined, true);

    if (parsedDate.isValid()) {
      const formatString = isDateTime ? 'DD MMM, YYYY hh:mm A' : 'DD MMM, YYYY';
      return parsedDate.format(formatString);
    }
  }

  return 'NA';
};

// export const isSmallScreen = () => useMediaQuery('(max-width:600px)');

export const isSmallScreen = () => {
  if (typeof window !== 'undefined') {
    return window.innerWidth <= 600;
  }
  return false;
};

export const formatDateDDMMYYYY = (inputDate) => {
  if (!inputDate) {
    return 'Invalid date';
  }

  const dateObject = new Date(inputDate);

  if (isNaN(dateObject.getTime())) {
    return 'Invalid date';
  }

  const day = String(dateObject.getDate()).padStart(2, '0');
  const month = String(dateObject.getMonth() + 1).padStart(2, '0');
  const year = dateObject.getFullYear();

  return `${day}-${month}-${year}`;
};

export const clearCookie = (cookieName) => {
  const pastDate = new Date(0); // Create a new Date object representing a date in the past
  document.cookie = `${cookieName}=; expires=${pastDate.toUTCString()}; path=/;`; // Set the cookie's expiration date to the past date
};

export const decimalPointFormatter = (value) => {
  if (!isNaN(value)) {
    const hasDecimal = String(value).includes('.');
    const roundedValue = hasDecimal ? parseFloat(value).toFixed(2) : value;
    return roundedValue;
  } else {
    return 0;
  }
};

export const expireDateChecker = (comparisonDate) => {
  const currentDate = moment(currentDate).format('DD-MM-YYYY');
  const modifiedComparisionDate = moment(comparisonDate).format('YYYY-MM-DD');
  const value = moment() > moment(modifiedComparisionDate);
  return value;
};

export const withinSevenDaysChecker = (expiryDate) => {
  const today = moment().startOf('day');
  const expiryMoment = moment(expiryDate, 'YYYY-MM-DD').startOf('day');
  const diffDays = expiryMoment.diff(today, 'days');
  return diffDays;
};

// clear input function for softInput
export const ClearSoftInput = ({ clearInput, marginTop }) => (
  <SoftBox
    sx={{
      position: 'absolute',
      top: marginTop ? marginTop : '3px',
      right: '10px',
      color: 'gray',
      cursor: 'pointer',
      zIndex: 10,
    }}
  >
    <CloseRoundedIcon onClick={clearInput} />
  </SoftBox>
);

//<--- copy to clipboard component for copying barcode
export const CopyToClipBoard = ({ params, className, customWidth, customHeight }) => {
  // const [isCopied, setIsCopied] = useState(false);
  const [copiedText, setCopy] = useCopyToClipboard();

  const handleCopy = (text) => {
    setCopy(text)
      .then(() => {
        // text gets copied to clipboard
        // setIsCopied(true);
      })
      .catch((error) => {
        // text won't be copied to clipboard
        console.error('Failed to copy!', error);
      });
  };

  return (
    <SoftBox sx={{ width: '100%', paddingRight: '10px' }} className={`content-space-between ${className || ''}`}>
      {params?.value}
      <SoftBox
        onClick={() => {
          handleCopy(params?.value);
        }}
        sx={{ cursor: 'pointer' }}
      >
        <Tooltip title={copiedText ? 'Copied' : 'Copy'} placement="top-start">
          <ContentCopyIcon
            sx={{ width: customWidth ? customWidth : '1.2em', height: customHeight ? customHeight : '1.2em' }}
          />
        </Tooltip>
      </SoftBox>
    </SoftBox>
  );
};
// --->

export const CopyToClipBoardValue = ({ params, paddingRight, width, height }) => {
  // const [isCopied, setIsCopied] = useState(false);
  const [copiedText, setCopy] = useCopyToClipboard();

  const handleCopy = (text) => {
    setCopy(text)
      .then(() => {
        // text gets copied to clipboard
        // setIsCopied(true);
      })
      .catch((error) => {
        // text won't be copied to clipboard
        console.error('Failed to copy!', error);
      });
  };

  return (
    <SoftBox sx={{ width: '100%', paddingRight: paddingRight || '' }} className="content-space-between">
      {/* {params} */}
      <SoftBox
        onClick={() => {
          handleCopy(params);
        }}
        sx={{ cursor: 'pointer' }}
      >
        <Tooltip title={copiedText ? 'Copied' : 'Copy'} placement="top-start">
          <ContentCopyIcon sx={{ width: width, height: height }} />
        </Tooltip>
      </SoftBox>
    </SoftBox>
  );
};

// function to truncate the label value which is to be displayed in the select box if length is > 20
export const truncateWord = (word) => {
  if (word.length > 23) {
    return word.slice(0, 23) + '...';
  }
  return word;
};

export const removeExtraSpaces = (str) => {
  return str?.replace(/\s+/g, ' ');
};

export const calculatePercentage = (value, total) => {
  if (value === undefined || total === undefined || total === 0) {
    return 'NA';
  } else {
    return ((value / total) * 100).toFixed(0) + '%';
  }
};

export const capitalizeFirstLetterOfWords = (text) => {
  return text
    .toLowerCase() // Convert the whole string to lowercase
    .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize the first letter of each word
};

export const roundToTwoDecimalPlaces = (number) => {
  return Number(number?.toFixed(2));
};

// Pi Estimated Cost Calculator
export const calculateMultiplicationAndAddition = (arr1, arr2, arr3) => {
  const maxLength = Math.max(arr1.length, arr2.length);
  const minLength = Math.min(arr1.length, arr2.length);

  let multiplicationSum = 0;

  for (let i = 0; i < maxLength; i++) {
    if (i < minLength) {
      // Multiply corresponding elements and add to the multiplication sum
      if (arr2[i] === 0) {
        multiplicationSum += arr1[i] * arr3[i];
      } else {
        multiplicationSum += arr1[i] * arr2[i];
      }
    }
  }

  return multiplicationSum;
};

export const convertUTC = (utcTime) => {
  // Calculate the UTC time zone offset in minutes
  const utcOffsetMinutes = moment(utcTime).utcOffset();

  return moment(utcTime).add(utcOffsetMinutes, 'minutes');
};

export const getNextDateWithFlagTrue = (daysData) => {
  const todayDate = new Date();
  const currentDay = todayDate.getDay();

  // Determine the next true day
  let nextTrueDayIndex = -1;
  for (let i = 1; i <= 7; i++) {
    const dayIndex = (currentDay + i) % 7;
    if (daysData[dayIndex]?.flag) {
      nextTrueDayIndex = dayIndex;
      break;
    }
  }

  if (nextTrueDayIndex !== -1) {
    // Calculate the next date
    const nextDate = new Date(todayDate);
    nextDate.setDate(todayDate.getDate() + 1); // Move to the next day
    while (nextDate.getDay() !== nextTrueDayIndex) {
      nextDate.setDate(nextDate.getDate() + 1); // Move to the next day until we find the correct day
    }
    return nextDate.toISOString().slice(0, 10); // Format as yyyy-mm-dd
  }

  return null;
};

export const epochToIST = (epoch) => {
  // Convert the epoch time to a moment object in UTC
  let date = moment.utc(epoch * 1000);

  // Convert the time to IST (Indian Standard Time)
  let ISTDate = date.tz('Asia/Kolkata');

  // Format the date as per IST without time
  return ISTDate.format('D MMMM, YYYY');
};

// export const formatNumber = (num) => {
//   if (num === '' || num === null || num === undefined) {
//     return 'NA';
//   }

//   // Ensure num is a number and handle cases where it's a string or other type
//   const number = parseFloat(num);

//   // Check if conversion was successful
//   if (isNaN(number)) {
//     return 'NA';
//   }

//   // Return formatted number based on whether it has decimals
//   return number % 1 === 0 ? number.toString() : number.toFixed(2);
// };

// export const formatNumber = (num) => {
//   if (num === '' || num === null || num === undefined) {
//     return 'NA';
//   }

//   // Ensure num is a number and handle cases where it's a string or other type
//   const number = parseFloat(num);

//   // Check if conversion was successful
//   if (isNaN(number)) {
//     return 'NA';
//   }

//   // Return formatted number based on whether it has decimals
//   return number % 1 === 0 ? number.toString() : number.toFixed(2);
// };

export const convertUTCtoIST = (utcTimestamp) => {
  if (!utcTimestamp) {
    return 'NA';
  }
  // Create a Date object from the UTC timestamp
  const utcDate = new Date(utcTimestamp);

  // IST offset is UTC + 5:30
  const istOffset = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds

  // Convert to IST
  const istDate = new Date(utcDate?.getTime() + istOffset);

  // Format the date to "26th July, 2024"
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  const dateString = istDate?.toLocaleDateString('en-GB', options);

  // Add suffix to day
  const day = istDate?.getDate();
  const suffix = (day) => {
    if (day > 3 && day < 21) {
      return 'th';
    } // 4-20 use "th"
    switch (day % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  };

  // Format the time to "HH:MM:SS"
  const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
  const timeString = istDate?.toLocaleTimeString('en-GB', timeOptions);

  return `${day}${suffix(day)} ${dateString?.split(' ')[1]}, ${istDate?.getFullYear()}, ${timeString}`;
};

export const formatNumber = (num) => {
  if (num === '' || num === null || num === undefined) {
    return 'NA';
  }

  // Ensure num is a number and handle cases where it's a string or other type
  const number = parseFloat(num);

  // Check if conversion was successful
  if (isNaN(number)) {
    return 'NA';
  }

  // Determine if the number has decimals
  const hasDecimals = number % 1 !== 0;

  // Format the number with commas and ensure two decimal places if needed
  return number.toLocaleString('en-IN', {
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: 2,
  });
};

export const formatWithUnderscores = (str) => {
  return str
    .replace(/([A-Z])/g, '_$1')
    .replace(/^_/, '')
    .toUpperCase();
};

export const noDatagif =
  'https://2.bp.blogspot.com/-SXNnmaKWILg/XoNVoMTrxgI/AAAAAAAAxnM/7TFptA1OMC8uk67JsG5PcwO_8fAuQTzkQCLcBGAsYHQ/s1600/giphy.gif';
export const noImage =
  'https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg';

export const isRmsMobileApp = () => {
  const isDeviceType = localStorage.getItem('deviceType');
  return isDeviceType === 'mobile';
};

export function getTimeAgo(dateString) {
  const date = parse(dateString, 'dd MMM yyyy, hh:mm a', new Date());

  return formatDistanceToNow(date, { addSuffix: true });
}

export const dateFormatterTwo = (date) => {
  const newDate = new Date(date);
  const day = newDate.getDate();
  const month = newDate.toLocaleString('default', { month: 'long' }); // Get full month name
  const year = newDate.getFullYear();

  // Function to add suffix (st, nd, rd, th)
  function getDayWithSuffix(day) {
    if (day > 3 && day < 21) return day + 'th'; // Special case for 11th - 20th
    switch (day % 10) {
      case 1:
        return day + 'st';
      case 2:
        return day + 'nd';
      case 3:
        return day + 'rd';
      default:
        return day + 'th';
    }
  }

  // Format the date as DD Month YYYY
  const formattedDate = `${getDayWithSuffix(day)} ${month} ${year}`;
  return formattedDate;
};
export const productIdByBarcode = async (barcode) => {
  const locId = localStorage.getItem('locId');
  const lowerCaseLocId = locId.toLowerCase();

  try {
    const res = await getProductIdByBarcode(barcode, locId);
    const productId = res?.data?.data?.data?.id;
    return productId;
  } catch (err) {
    return null;
  }
};

export const RequiredAsterisk = () => <span style={{ color: 'red', marginLeft: '5px', fontSize: '17px' }}> *</span>;

export const categoryColourValue = (data) => {
  switch (data) {
    case 'GREEN':
      return 'green';
    case 'ORANGE':
      return 'orange';
    case 'RED':
      return 'red';
    case 'GREY':
      return 'grey';
    case 'A':
      return '#E8FFD8';
    case 'B':
      return '##D9F2FF';
    case 'C':
      return '#FFE9E9';
    default:
      return 'black';
  }
};

export const getTagDescriptionValue = (type, result) => {
  if (type === 'INVENTORY') {
    switch (result) {
      case 'A':
        return 'Highest Consumption';
      case 'B':
        return 'Average Consumption';
      case 'C':
        return 'Lowest Consumption';
      case 'D':
        return 'Dead Stock';
      default:
        return 'NA';
    }
  } else if (type === 'SALES') {
    switch (result) {
      case 'A':
        return 'Fast Movement';
      case 'B':
        return 'Average Movement';
      case 'C':
        return 'Low Movement';
      default:
        return 'NA';
    }
  } else if (type === 'PROFIT') {
    switch (result) {
      case 'A':
        return 'Highest Value';
      case 'B':
        return 'Average Value';
      case 'C':
        return 'Lowest Value';
      default:
        return 'NA';
    }
  }
};

export const preventArrowKeyChange = (event) => {
  if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
    event.preventDefault();
  }
};

export const addNotificationToCookie = (id) => {
  // Get the existing `readNotifications` cookie
  const existingNotifications = JSON.parse(Cookies.get('readNotifications') || '[]');

  // Add the new ID only if it doesn't already exist
  if (!existingNotifications.includes(id)) {
    existingNotifications.push(id);
  }

  // Save the updated array back to the cookie
  Cookies.set('readNotifications', JSON.stringify(existingNotifications), { expires: 3 }); // Expires in 3 days
};

export const getReadNotifications = () => {
  const readNotifications = JSON.parse(Cookies.get('readNotifications') || '[]');
  return readNotifications;
};
export const displayNameFirstLetter = (displayName) => {
  if (!displayName) return 'NA';

  const trimmedName = displayName?.trim();
  const parts = trimmedName?.split(' ');

  if (parts?.length > 1) {
    // If there's a space, take the first letter from both parts
    return parts[0][0].toUpperCase() + parts[1][0].toUpperCase();
  } else {
    // If no space, take the first letter
    return trimmedName[0].toUpperCase();
  }
};