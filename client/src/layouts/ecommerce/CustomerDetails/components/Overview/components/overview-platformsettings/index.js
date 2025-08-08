/**
=========================================================
* Soft UI Dashboard PRO React - v4.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-pro-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Card from '@mui/material/Card';
import './index.css';

// Soft UI Dashboard PRO React components
import CancelIcon from '@mui/icons-material/Cancel';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import SaveIcon from '@mui/icons-material/Save';
import SoftBox from 'components/SoftBox';
import SoftInput from 'components/SoftInput/index';
import SoftSelect from 'components/SoftSelect';
import SoftTypography from 'components/SoftTypography';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { updateRetailContactInfo } from '../../../../../../../config/Services';
import { isSmallScreen } from '../../../../../Common/CommonFunction';

function PlatformSettings({ retailId, setUpdateDetails, updateDetails, isAppUser, isPosUser }) {
  const custData = useSelector((state) => state?.customerBaseDetails);
  //
  const custBaseData = custData?.customerBaseDetails[0];

  const contextType = localStorage.getItem('contextType');

  const contact = custBaseData?.contacts?.[0];
  const [editTog, setEditTog] = useState(false);
  const [contName, setContName] = useState('');
  const [phoneNum, setPhoneNum] = useState('');
  const [email, setEmail] = useState('');
  const [adrs, setAdrs] = useState('');
  const [countrySel, setCountrySel] = useState('');
  const [stateSel, setStateSel] = useState('');
  const [citySel, setCitySel] = useState('');
  const [contactId, setContactId] = useState('');
  const [contactType, setContactType] = useState('');
  const [addressId, setAddressId] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');

  const userRoles = JSON.parse(localStorage.getItem('user_roles'));
  const permissions = JSON.parse(localStorage.getItem('permissions'));
  const isMobileDevice = isSmallScreen();


  const superAdmin = userRoles?.find((item) => item == 'SUPER_ADMIN');

  useEffect(() => {
    if (custBaseData !== undefined) {
      setContName(custBaseData?.contacts?.[0]?.name);
      setPhoneNum(custBaseData?.contacts?.[0]?.phoneNo);
      setEmail(custBaseData?.contacts?.[0]?.email);
      setContactId(custBaseData?.contacts?.[0]?.contactId);
      setContactType({
        value: custBaseData?.contacts?.[0]?.contactType,
        label: custBaseData?.contacts?.[0]?.contactType,
      });
      // setCountrySel({ label: custBaseData?.addresses?.[0]?.country, value: custBaseData?.addresses?.[0]?.country });
      // setStateSel({ label: custBaseData?.addresses?.[0]?.state, value: custBaseData?.addresses?.[0]?.state });
      // setCitySel({ label: custBaseData?.addresses?.[0]?.city, value: custBaseData?.addresses?.[0]?.state });
      // if (custBaseData?.addresses?.[0]?.addressLine2 === null) {
      //   setAdrs(custBaseData?.addresses?.[0]?.addressLine1);
      // } else {
      //   setAdrs(custBaseData?.addresses?.[0]?.addressLine1 + ',' + custBaseData?.addresses?.[0]?.addressLine2);
      // }
      // setAddressLine1(custBaseData?.addresses?.[0]?.addressLine1);
      // if (custBaseData?.addresses?.[0]?.addressLine2 === null) {
      //   setAddressLine2('');
      // } else {
      //   setAddressLine2(custBaseData?.addresses?.[0]?.addressLine2);
      // }
      // setAddressId(custBaseData?.addresses?.[0]?.id);
      if(isAppUser){
        setContName(custBaseData?.name || 'N/A');
        setPhoneNum(custBaseData?.phoneNumber || 'N/A');
        setEmail(custBaseData?.emailId || 'N/A');
        setContactId(custBaseData?.contacts?.[0]?.contactId);
        setContactType({
          value: custBaseData?.contacts?.[0]?.contactType,
          label: custBaseData?.contacts?.[0]?.contactType,
        });
      }

      if(isPosUser){
        setContName((custBaseData?.firstName + " " + custBaseData?.secondName) || 'N/A');
        setPhoneNum(custBaseData?.mobileNumber || 'N/A');
        setEmail(custBaseData?.email || 'N/A');
        setContactId(custBaseData?.contacts?.[0]?.contactId);
        setContactType({
          value: custBaseData?.contacts?.[0]?.contactType,
          label: custBaseData?.contacts?.[0]?.contactType,
        });
      }
    }
  }, [custBaseData]);

  const cancelChanges = () => {
    setEditTog(false);
    setContName(custBaseData?.contacts?.[0]?.name);
    setPhoneNum(custBaseData?.contacts?.[0]?.phoneNo);
    setEmail(custBaseData?.contacts?.[0]?.email);
    // setCountrySel({ label: custBaseData?.addresses?.[0]?.country, value: custBaseData?.addresses?.[0]?.country });
    // setStateSel({ label: custBaseData?.addresses?.[0]?.state, value: custBaseData?.addresses?.[0]?.state });
    // setCitySel({ label: custBaseData?.addresses?.[0]?.city, value: custBaseData?.addresses?.[0]?.state });
    // if (custBaseData?.addresses?.[0]?.addressLine2 === null) {
    //   setAdrs(custBaseData?.addresses?.[0]?.addressLine1);
    // } else {
    //   setAdrs(custBaseData?.addresses?.[0]?.addressLine1 + ',' + custBaseData?.addresses?.[0]?.addressLine2);
    // }
  };

  const handleContactType = (option) => {
    setContactType(option);
  };

  const postCustomerInfo = () => {
    const user_details = localStorage.getItem('user_details');
    const uidx = JSON.parse(user_details).uidx;

    // const nameChanged =
    //   custBaseData?.contacts?.[0]?.name.length !== contName.length || custBaseData?.contacts?.[0]?.name !== contName;

    // const phoneNoChanged =
    //   custBaseData?.contacts?.[0]?.phoneNo.length !== phoneNum.length || custBaseData?.contacts?.[0]?.phoneNo !== phoneNum;

    // const emailChanged =
    //   custBaseData?.contacts?.[0]?.email.length !== email.length || custBaseData?.contacts?.[0]?.email !== email;

    // if (nameChanged || phoneNoChanged || emailChanged) {
    const payloadContact = {
      contactId: contactId,
      name: contName,
      phoneNo: phoneNum,
      email: email,
      contactType: contactType.value,
      priority: 'string',
      source: contextType,
      updatedBy: uidx,
    };

    updateRetailContactInfo(payloadContact)
      .then((response) => {
        setUpdateDetails(Boolean(!updateDetails));
      })
      .catch((error) => {});
    // }

    // if (custBaseData?.addresses.length !== 0) {
    //   const countryChanged =
    //     custBaseData?.addresses?.[0]?.country.length !== countrySel.label.length ||
    //     custBaseData?.addresses?.[0]?.country !== countrySel.label;

    //   const stateChanged =
    //     custBaseData?.addresses?.[0]?.state.length !== stateSel.label.length ||
    //     custBaseData?.addresses?.[0]?.state !== stateSel.label;

    //   const cityChanged =
    //     custBaseData?.addresses?.[0]?.city.length !== citySel.label.length ||
    //     custBaseData?.addresses?.[0]?.city !== citySel.label;

    //   const addressChanged =
    //     (custBaseData?.addresses?.[0]?.addressLine1 + ',' + custBaseData?.addresses?.[0]?.addressLine2).length !==
    //       (addressLine1 + ',' + addressLine2).length ||
    //     custBaseData?.addresses?.[0]?.addressLine1 + ',' + custBaseData?.addresses?.[0].addressLine2 !==
    //       addressLine1 + ',' + addressLine2;

    //   if (countryChanged || stateChanged || cityChanged || addressChanged) {
    //     const payloadAddress = {
    //       addressId: addressId,
    //       addressLine1: addressLine1,
    //       addressLine2: addressLine2,
    //       country: countrySel.label,
    //       state: stateSel.label,
    //       city: citySel.label,
    //       pincode: custBaseData?.addresses?.[0].pincode,
    //       addressType: custBaseData?.addresses?.[0].addressType,
    //       priority: custBaseData?.addresses?.[0].priority,
    //       defaultShipping: true,
    //       defaultBilling: true,
    //       updatedBy: uidx,
    //     };

    //
    //     updateRetailAddress(payloadAddress)
    //       .then((response) => {
    //         //
    //         setAdrs(addressLine1 + ',' + addressLine2);
    //         setUpdateDetails(Boolean(!updateDetails));
    //       })
    //       .catch((error) => {
    //
    //       });
    //   }
    // }
    setEditTog(false);
  };

  const handleEditTog = () => {
    setEditTog(true);
    // setAddressLine1(custBaseData?.addresses?.[0]?.addressLine1);
    // setAddressLine2(custBaseData?.addresses?.[0]?.addressLine2);
  };

  return (
    <>
      {isMobileDevice ? (
        <div>
          <SoftTypography variant="h6" fontWeight="bold">
            Customer information
          </SoftTypography>
          <div className="listing-card-main-bg">
            <div className='stock-count-details-card-title'>
              Contact Details
            </div>
            <hr className='horizontal-line-app-ros'/>
            <div className="stack-row-center-between width-100">
              <div className="flex-colum-align-start">
                <div className="bill-card-label">Contact Name</div>
                <div className="bill-card-value">{contName || 'N/A'}</div>
              </div>
              <div className="flex-colum-align-end">
                <div className="bill-card-label">Contact Number</div>
                <div className="bill-card-value">{phoneNum || 'N/A'}</div>
              </div>
            </div>

            <div className="stack-row-center-between width-100">
              <div className="flex-colum-align-start">
                <div className="bill-card-label">Email</div>
                <div className="bill-card-value">{email || 'N/A'}</div>
              </div>
              {!isPosUser && (
                <div className="flex-colum-align-end">
                  <div className="bill-card-label">Country</div>
                  <div className="bill-card-value">{custBaseData?.addresses?.[0]?.country}</div>
                </div>
              )}
            </div>

            {!isPosUser && (
              <>
                <div className="stack-row-center-between width-100">
                  <div className="flex-colum-align-start">
                    <div className="bill-card-label">State</div>
                    <div className="bill-card-value">{custBaseData?.addresses?.[0]?.state}</div>
                  </div>
                  <div className="flex-colum-align-end">
                    <div className="bill-card-label">City</div>
                    <div className="bill-card-value">{custBaseData?.addresses?.[0]?.city}</div>
                  </div>
                </div>

                <div className="stack-row-center-between width-100">
                  <div className="flex-colum-align-start">
                    <div className="bill-card-label">Address</div>
                    <div className="bill-card-value">{custBaseData?.addresses?.[0]?.addressLine1 + ', ' + custBaseData?.addresses?.[0]?.addressLine2}</div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <Card sx={{ overflow: 'visible' }}>
          <SoftBox pt={2} px={2} display="flex" justifyContent="space-between">
            <SoftTypography variant="h6" fontWeight="bold">
              Customer information
            </SoftTypography>
            {!isPosUser && !isAppUser && editTog ? (
              <SoftBox display="flex" justifyContent="space-between">
                <SoftBox ml={2}>
                  <SaveIcon color="success" onClick={() => postCustomerInfo()} style={{ cursor: 'pointer' }} />
                </SoftBox>
                <SoftBox>
                  <CancelIcon color="error" style={{ cursor: 'pointer' }} onClick={() => cancelChanges()} />
                </SoftBox>
              </SoftBox>
            ) : (
              <SoftBox>
                {!isPosUser && !isAppUser && <ModeEditIcon onClick={() => handleEditTog()} />}
              </SoftBox>
            )}
          </SoftBox>
          <SoftBox pt={1.5} pb={2} px={2} lineHeight={1.25}>
            {/* <SoftTypography variant="caption" fontWeight="bold" color="text" textTransform="uppercase">
          contact details
        </SoftTypography> */}
            <SoftBox>
              <SoftBox>
                <SoftTypography variant="button" fontWeight="bold" color="text">
                  Contact Name
                </SoftTypography>
              </SoftBox>
              {editTog ? (
                <SoftBox>
                  <SoftInput type="text" value={contName} onChange={(e) => setContName(e.target.value)} />
                </SoftBox>
              ) : (
                <SoftBox>
                  <SoftTypography variant="button" fontWeight="regular" color="text">
                    {contName}
                  </SoftTypography>
                </SoftBox>
              )}
            </SoftBox>
            <SoftBox>
              <SoftBox>
                <SoftTypography variant="button" fontWeight="bold" color="text">
                  Contact number
                </SoftTypography>
              </SoftBox>
              {editTog ? (
                <SoftBox>
                  <SoftInput type="text" value={phoneNum} onChange={(e) => setPhoneNum(e.target.value)} />
                </SoftBox>
              ) : (
                <SoftBox>
                  <SoftTypography variant="button" fontWeight="regular" color="text">
                    {phoneNum}
                  </SoftTypography>
                </SoftBox>
              )}
            </SoftBox>
            <SoftBox>
              <SoftBox>
                <SoftTypography variant="button" fontWeight="bold" color="text">
                  Email
                </SoftTypography>
              </SoftBox>
              {editTog ? (
                <SoftBox>
                  <SoftInput type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                </SoftBox>
              ) : (
                <SoftBox overflow="hidden">
                  <SoftTypography variant="button" fontWeight="regular" color="text">
                    {email}
                  </SoftTypography>
                </SoftBox>
              )}
            </SoftBox>
            {/* country  */}
            {!isPosUser && (
              <>
                <SoftBox>
                  <SoftBox>
                    <SoftTypography variant="button" fontWeight="bold" color="text">
                      Country
                    </SoftTypography>
                  </SoftBox>
                  <SoftBox overflow="hidden">
                    <SoftTypography variant="button" fontWeight="regular" color="text">
                      {custBaseData?.addresses?.[0]?.country}
                    </SoftTypography>
                  </SoftBox>
                </SoftBox>
                {/* state  */}
                <SoftBox>
                  <SoftBox>
                    <SoftTypography variant="button" fontWeight="bold" color="text">
                      State
                    </SoftTypography>
                  </SoftBox>
                  <SoftBox overflow="hidden">
                    <SoftTypography variant="button" fontWeight="regular" color="text">
                      {custBaseData?.addresses?.[0]?.state}
                    </SoftTypography>
                  </SoftBox>
                </SoftBox>
                {/* city  */}
                <SoftBox>
                  <SoftBox>
                    <SoftTypography variant="button" fontWeight="bold" color="text">
                      City
                    </SoftTypography>
                  </SoftBox>
                  <SoftBox overflow="hidden">
                    <SoftTypography variant="button" fontWeight="regular" color="text">
                      {custBaseData?.addresses?.[0]?.city}
                    </SoftTypography>
                  </SoftBox>
                </SoftBox>
                {/* address        */}
                <SoftBox>
                  <SoftBox>
                    <SoftTypography variant="button" fontWeight="bold" color="text">
                      Address
                    </SoftTypography>
                  </SoftBox>
                  <SoftBox overflow="hidden">
                    <SoftTypography variant="button" fontWeight="regular" color="text">
                      {custBaseData?.addresses?.[0]?.addressLine1 + ', ' + custBaseData?.addresses?.[0]?.addressLine2}
                    </SoftTypography>
                  </SoftBox>
                </SoftBox>
              </>
            )}
            {/* <SoftBox>
          <SoftBox>
            <SoftTypography variant="button" fontWeight="bold" color="text">
              Contact Type
            </SoftTypography>
          </SoftBox>
          {editTog ? (
            <SoftBox>
              <SoftSelect
                name="contactType"
                value={contactType}
                options={[
                  {
                    value: 'SUPPORT',
                    label: 'SUPPORT',
                  },
                  {
                    value: 'DEFAULT',
                    label: 'DEFAULT',
                  },
                  {
                    value: 'OTHER',
                    label: 'OTHER',
                  },
                ]}
                onChange={(option) => handleContactType(option)}
                menuPortalTarget={document.body}
              />
            </SoftBox>
          ) : (
            <SoftBox overflow="hidden">
              <SoftTypography variant="button" fontWeight="regular" color="text">
                {contactType.value}
              </SoftTypography>
            </SoftBox>
          )}
        </SoftBox> */}
            {!isPosUser && (
              <SoftTypography
                variant="button"
                className="link-text"
                onClick={() =>
                  window.open(
                    `https://maps.google.com/maps?q=${encodeURIComponent(
                      custBaseData?.addresses?.[0]?.addressLine1 || '',
                    )}`,
                    '_blank',
                  )
                }
              >
                View in Map
              </SoftTypography>
            )}
            {/* <SoftBox display="flex" py={1} mb={0.25}>
          <SoftBox width="50%">
            <SoftTypography variant="button" fontWeight="regular" color="text">
              Country
            </SoftTypography>
          </SoftBox>
          {editTog ? (
            <SoftBox width="50%">
              <SoftSelect value={countrySel} options={country} onChange={(option) => setCountrySel(option)} />
            </SoftBox>
          ) : (
            <SoftBox width="70%" ml={1.5}>
              <SoftTypography variant="button" fontWeight="regular" color="text">
                {countrySel.label}
              </SoftTypography>
            </SoftBox>
          )}
        </SoftBox> */}

            {/* <SoftBox display="flex" py={1} mb={0.25}>
          <SoftBox width="50%">
            <SoftTypography variant="button" fontWeight="regular" color="text">
              State
            </SoftTypography>
          </SoftBox>
          {editTog ? (
            <SoftBox width="50%">
              <SoftSelect value={stateSel} options={state} onChange={(option) => setStateSel(option)} />
            </SoftBox>
          ) : (
            <SoftBox width="70%" ml={1.5}>
              <SoftTypography variant="button" fontWeight="regular" color="text">
                {stateSel.label}
              </SoftTypography>
            </SoftBox>
          )}
        </SoftBox> */}
            {/*         
        <SoftBox display="flex" py={1} mb={0.25}>
          <SoftBox width="50%">
            <SoftTypography variant="button" fontWeight="regular" color="text">
              City
            </SoftTypography>
          </SoftBox>
          {editTog ? (
            <SoftBox width="50%">
              <SoftSelect value={citySel} onChange={(option) => setCitySel(option)} options={city} />
            </SoftBox>
          ) : (
            <SoftBox width="70%" ml={1.5}>
              <SoftTypography variant="button" fontWeight="regular" color="text">
                {citySel.label}
              </SoftTypography>
            </SoftBox>
          )}
        </SoftBox> */}

            {/* <SoftBox display="flex" py={1} mb={0.25}>
          <SoftBox width="50%">
            <SoftTypography variant="button" fontWeight="regular" color="text">
              Address
            </SoftTypography>
          </SoftBox>
          {editTog ? (
            <SoftBox width="50%">
              <SoftInput type="text" value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} />
              <SoftInput
                type="text"
                style={{ marginTop: '0.3rem' }}
                value={addressLine2}
                onChange={(e) => setAddressLine2(e.target.value)}
              />
            </SoftBox>
          ) : (
            <SoftBox width="70%" ml={1.5}>
              <SoftTypography variant="button" fontWeight="regular" color="text">
                {adrs}
              </SoftTypography>
            </SoftBox>
          )}
        </SoftBox> */}
          </SoftBox>
        </Card>
      )}
    </>
  );
}

export default PlatformSettings;
