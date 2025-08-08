import { Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import SoftBox from '../../../../../components/SoftBox';

const Messages = ({ selectedContacts }) => {
  const [selectedId, setSelectedId] = useState('');
  const individualMessages = [
    {
      id: 1,
      avatar: 'https://gravatar.com/avatar/627174e60d5be049d6fc17d707a3ef08?s=400&d=robohash&r=x',
      name: 'Louis Litt',
      date: '23 Nov, 2023',
      recievedMsg: [
        {
          id: 1,
          time: '10:20',
          type: 'customer',
          msg: 'Hey, I have orders related query',
        },
        {
          id: 2,
          time: '10:21',
          type: 'sales',
          msg: 'Hey, How can i help you',
        },
        {
          id: 3,
          time: '10:22',
          type: 'customer',
          msg: 'I have some missing items in my order',
        },
        {
          id: 4,
          time: '10:23',
          type: 'sales',
          msg: 'Yes sure, Can you help me with your Order id please.',
        },
        {
          id: 5,
          time: '10:24',
          type: 'customer',
          msg: 'ORD12340',
        },
        {
          id: 6,
          time: '10:25',
          type: 'sales',
          msg: 'Thank you! Please give us some time to check and get back to you.',
        },
        {
          id: 7,
          time: '10:26',
          type: 'sales',
          msg: 'I see there might be some problems with the store.',
        },
        {
          id: 7,
          time: '10:27',
          type: 'sales',
          msg: 'We are really sorry due to the inconvenience caused to you by us. Please allow us to rectify our mistake. Would you like us to give a refund of Rs 100 or send the items again within an hour.',
        },
        {
          id: 8,
          time: '10:28',
          type: 'customer',
          msg: 'I want a refund.',
        },
        {
          id: 9,
          time: '10:29',
          type: 'sales',
          msg: 'We have generated a refund which will be reflected in your account in next 12 hours.',
        },
        {
          id: 10,
          time: '10:30',
          type: 'sales',
          msg: 'Thank you for shopping with us and keep shopping again.',
        },
      ],
    },
    {
      id: 2,
      avatar: 'https://gravatar.com/avatar/fb5d72fe5e31d83d3d4cdd9f22e0e404?s=400&d=robohash&r=x',
      name: 'Harvey Specter',
      date: '24 Nov, 2023',
      recievedMsg: [
        {
          id: 1,
          time: '10:20',
          type: 'customer',
          msg: 'Hey, I have coupon related query',
        },
        {
          id: 2,
          time: '10:21',
          type: 'sales',
          msg: 'Hey, How can i help you?',
        },
        {
          id: 3,
          time: '10:22',
          type: 'customer',
          msg: 'I wish to add the coupon you provided me in the notification',
        },
        {
          id: 4,
          time: '10:23',
          type: 'sales',
          msg: 'May you please help me with the coupon code?',
        },
        {
          id: 5,
          time: '10:24',
          type: 'customer',
          msg: 'No',
        },
        {
          id: 6,
          time: '10:25',
          type: 'sales',
          msg: 'Sir This is completely safe and if i do not check the coupon I wont get the problem',
        },
        {
          id: 7,
          time: '10:26',
          type: 'customer',
          msg: 'Ok the code id QWE459IC',
        },
        {
          id: 7,
          time: '10:27',
          type: 'sales',
          msg: 'Thank you Sir, Ill just check and get back to you',
        },
        {
          id: 8,
          time: '10:28',
          type: 'customer',
          msg: 'Sure.',
        },
        {
          id: 9,
          time: '10:29',
          type: 'sales',
          msg: 'Sir, the coupon code provided by you is not valid at your location',
        },
        {
          id: 10,
          time: '10:30',
          type: 'customer',
          msg: 'Why?',
        },
        {
          id: 11,
          time: '10:30',
          type: 'sales',
          msg: 'Sir, Right now our coupons are only valid in location Tamil Nadu and you are ordering from Bangalore. Therefore you are not able to redeem the coupon',
        },
        {
          id: 12,
          time: '10:30',
          type: 'customer',
          msg: 'Ok, Thanks for the clarification',
        },
        {
          id: 13,
          time: '10:30',
          type: 'sales',
          msg: 'We are glad to help you sir.',
        },
        {
          id: 14,
          time: '10:30',
          type: 'sales',
          msg: 'Keep shopping from Twinleaves',
        },
      ],
    },
    {
      id: 3,
      avatar: 'https://gravatar.com/avatar/3095f878ef91fb3756ff0d8149f1c5a8?s=400&d=robohash&r=x',
      name: 'Ross Geller',
      date: '22 Nov, 2023',
      recievedMsg: [
        {
          id: 1,
          time: '10:20',
          type: 'customer',
          msg: 'Hey, I have coupon related query',
        },
        {
          id: 2,
          time: '10:21',
          type: 'sales',
          msg: 'Hey, How can i help you?',
        },
        {
          id: 3,
          time: '10:22',
          type: 'customer',
          msg: 'I wish to add the coupon you provided me in the notification',
        },
        {
          id: 4,
          time: '10:23',
          type: 'sales',
          msg: 'May you please help me with the coupon code?',
        },
        {
          id: 5,
          time: '10:24',
          type: 'customer',
          msg: 'No',
        },
        {
          id: 6,
          time: '10:25',
          type: 'sales',
          msg: 'Sir This is completely safe and if i do not check the coupon I wont get the problem',
        },
        {
          id: 7,
          time: '10:26',
          type: 'customer',
          msg: 'Ok the code id QWE459IC',
        },
        {
          id: 7,
          time: '10:27',
          type: 'sales',
          msg: 'Thank you Sir, Ill just check and get back to you',
        },
        {
          id: 8,
          time: '10:28',
          type: 'customer',
          msg: 'Sure.',
        },
        {
          id: 9,
          time: '10:29',
          type: 'sales',
          msg: 'Sir, the coupon code provided by you has been expired. Its validity was 3 hours from the time you recieved the notification',
        },
        {
          id: 10,
          time: '10:30',
          type: 'customer',
          msg: 'It was not mentioned there.',
        },
        {
          id: 11,
          time: '10:30',
          type: 'sales',
          msg: 'It was mentioned there.',
        },
        {
          id: 12,
          time: '10:30',
          type: 'customer',
          msg: 'Ok, Thanks for the clarification',
        },
        {
          id: 13,
          time: '10:30',
          type: 'sales',
          msg: 'We are glad to help you sir.',
        },
        {
          id: 14,
          time: '10:30',
          type: 'sales',
          msg: 'Keep shopping from Twinleaves',
        },
      ],
    },
  ];

  useEffect(() => {
    const selectedContactId = individualMessages.find((item) => item.name === selectedContacts.name)?.id;
    setSelectedId(selectedContactId);
  }, [selectedContacts]);

  return (
    <div>
      <SoftBox style={{ padding: '20px' }}>
        {individualMessages.map(
          (item) =>
            // Use parentheses instead of curly braces
            selectedId === item.id && (
              <div key={item.id}>
                {item.recievedMsg.map((msg) => (
                  <div key={msg.id}>
                    {/* Render the content of recievedMsg */}
                    {msg.type === 'customer' ? (
                      <div style={{ display: 'flex', gap: '5px', marginTop: '15px' }}>
                        <Typography
                          style={{
                            fontWeight: '200',
                            fontSize: '0.8rem',
                            lineHeight: '1.5',
                            color: '#9c9c9c',
                            textAlign: 'right',
                            marginTop: '5px',
                          }}
                        >
                          {msg.time}
                        </Typography>
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
                          {msg.msg}
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
                          {msg.msg}
                        </Typography>
                        <Typography
                          style={{
                            fontWeight: '200',
                            fontSize: '0.8rem',
                            lineHeight: '1.5',
                            color: '#9c9c9c',
                            textAlign: 'left',
                            marginTop: '5px',
                          }}
                        >
                          {msg.time}
                        </Typography>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ),
        )}
      </SoftBox>
    </div>
  );
};

export default Messages;
