import { IconButton } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import React, { memo, useEffect, useState } from 'react';
import SaveIcon from '@mui/icons-material/Save';
import SoftBox from '../../../../../../components/SoftBox';
import SoftButton from '../../../../../../components/SoftButton';
import SoftInput from '../../../../../../components/SoftInput';
import SoftTypography from '../../../../../../components/SoftTypography';

const FranchiseContactInformation = memo(
  ({ contactInformation, setContactInformation, isDetailPage, setIsDetailPage }) => {
    const [radioSelectedIndex, setRadioSelectedIndex] = useState();
    const [isEditing, setIsEditing] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);

    useEffect(() => {
      if (isDetailPage) {
        setIsDisabled(true);
      }
    }, [isDetailPage]);

    const editHandler = () => {
      setIsEditing(true);
      setIsDisabled(false);
    };

    const saveHandler = () => {
      setIsEditing(false);
      setIsDisabled(true);
    };
    //checking single radio button
    const selectRadioButton = (index) => {
      setRadioSelectedIndex(index);
      const contactArray = contactInformation.map((contact) => {
        //setting the conact as primary if key is shame
        if (index === contact.key) {
          contact.isPrimary = true;
        } else {
          contact.isPrimary = false;
        }
        return contact;
      });
      setContactInformation(contactArray);
    };

    //adding and removing more contact rows
    const addingMoreContactsHandler = () => {
      if (contactInformation.length === 0) {
        setContactInformation([
          {
            isPrimary: false,
            firstName: '',
            lastName: '',
            mobileNumber: '',
            email: '',
            key: 0,
          },
        ]);
      } else {
        setContactInformation((prev) => [
          ...prev,
          {
            isPrimary: false,
            firstName: '',
            lastName: '',
            mobileNumber: '',
            email: '',
            key: contactInformation[contactInformation.length - 1].key + 1,
          },
        ]);
      }
    };

    const removingContactRowHandler = (key) => {
      const updatedContactObjectArray = contactInformation.filter((contact) => contact.key !== key);
      let x = 0;
      const updatedKeyContactObject = updatedContactObjectArray.map((contact) => {
        contact.key = x++;
        return contact;
      });
      setContactInformation(updatedKeyContactObject);
    };

    return (
      <SoftBox mt={2} className="details-item-wrrapper ">
        <SoftBox className="flex-div-ho">
          <SoftTypography className="information-heading-ho">Contact Information</SoftTypography>
          {isDetailPage && (
            <SoftBox className="frn-det-info">
              <SaveIcon
                sx={{ color: 'red !important', marginRight: '10px !important', cursor: 'pointer' }}
                onClick={saveHandler}
              />
              <EditIcon sx={{ color: 'green !important', cursor: 'pointer' }} onClick={editHandler} />
            </SoftBox>
          )}
        </SoftBox>
        <SoftBox sx={{ width: '100%', overflowX: 'scroll' }}>
          <SoftBox className="contact-main-div-ho frn-cntc-info-div">
            {contactInformation.map((item, index) => (
              <SoftBox sx={{ width: '100%' }} key={index} className="flex-div-ho">
                <SoftBox className="cntc-inputs-ho" sx={{ maxWidth: '60px !important' }}>
                  <SoftTypography
                    className="soft-input-heading-ho"
                    sx={{ marginBottom: '15px !important', display: index === 0 ? 'block' : 'none' }}
                  >
                    Primary
                  </SoftTypography>
                  <input
                    disabled={isDisabled}
                    type="radio"
                    style={{ width: '50px' }}
                    checked={index === radioSelectedIndex}
                    onChange={() => selectRadioButton(index)}
                  />
                </SoftBox>
                <SoftBox className="cntc-inputs-ho">
                  <SoftTypography className="soft-input-heading-ho" sx={{ display: index === 0 ? 'block' : 'none' }}>
                    FirstName
                  </SoftTypography>
                  <SoftInput
                    disabled={isDisabled}
                    placeholder="First Name..."
                    onChange={(e) => {
                      const updatedContactInformation = [...contactInformation];
                      updatedContactInformation[index].firstName = e.target.value;
                      setContactInformation(updatedContactInformation);
                    }}
                  />
                </SoftBox>
                <SoftBox className="cntc-inputs-ho">
                  <SoftTypography className="soft-input-heading-ho" sx={{ display: index === 0 ? 'block' : 'none' }}>
                    LastName
                  </SoftTypography>
                  <SoftInput disabled={isDisabled} placeholder="Last Name..." />
                </SoftBox>
                <SoftBox className="cntc-inputs-ho">
                  <SoftTypography className="soft-input-heading-ho" sx={{ display: index === 0 ? 'block' : 'none' }}>
                    Mobile Number
                  </SoftTypography>
                  <SoftInput disabled={isDisabled} placeholder="Mobile Number..." />
                </SoftBox>
                <SoftBox className="cntc-inputs-ho">
                  <SoftTypography className="soft-input-heading-ho" sx={{ display: index === 0 ? 'block' : 'none' }}>
                    Email
                  </SoftTypography>
                  <SoftInput disabled={isDisabled} placeholder="Email..." />
                </SoftBox>
                <IconButton onClick={() => removingContactRowHandler(index)}>
                  <CancelIcon sx={{ color: 'red !important', mt: index === 0 ? '30px' : '0px' }} />
                </IconButton>
              </SoftBox>
            ))}
          </SoftBox>
        </SoftBox>
        <SoftButton variant="text" color="info" sx={{ marginTop: '10px' }} onClick={addingMoreContactsHandler}>
          + ADD MORE
        </SoftButton>
      </SoftBox>
    );
  },
);

export default FranchiseContactInformation;
