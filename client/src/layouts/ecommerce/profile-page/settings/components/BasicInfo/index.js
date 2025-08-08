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

import { useState } from 'react';

// @mui core components
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';

// Soft UI Dashboard PRO React components
import SoftBox from 'components/SoftBox';
import SoftTypography from 'components/SoftTypography';

// Settings page components
import FormField from 'layouts/pages/account/components/FormField';
// Data
import './basicinfo.css';
import { Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { getAllRoles } from '../../../../../../config/Services';
import { getUserDetails, setUserDetails } from 'config/Services';
import { isSmallScreen } from '../../../../Common/CommonFunction';
import { useEffect } from 'react';
import Spinner from 'components/Spinner/index';

function BasicInfo() {
  const [basicdata, setBasicdata] = useState({
    uidx: '',
    mobileNumber: '',
    email: '',
    firstName: '',
    secondName: '',
    profilePicture: '',
    tennatId: '',
    roles: [],
  });
  const [allUserRoles, setAllUserRoles] = useState([]);
  const [basicLoader, setBasicLoader] = useState(false);

  const [tempbasicdata, setTempBasicdata] = useState({
    uidx: '',
    mobileNumber: '',
    email: '',
    firstName: '',
    secondName: '',
    profilePicture: '',
    tennatId: '',
    roles: [],
  });

  const [loading, setLoading] = useState(false);
  const isMobilDevice = isSmallScreen();

  useEffect(() => {
    if (!loading) {
      setLoading(true);
      getUserDetails().then((response) => {
        setLoading(false);
        setBasicdata({
          uidx: response.data.data.uidx,
          mobileNumber: response.data.data.mobileNumber,
          email: response.data.data.email,
          firstName: response.data.data.firstName,
          secondName: response.data.data.secondName,
          profilePicture: '',
          tennatId: response.data.data.tennatId,
          roles: response.data.data.roles,
        });
        setBasicLoader(true);
      });
    }
  }, []);

  let allRoles = [];
  useEffect(() => {
    if (basicLoader) {
      getAllRoles(localStorage.getItem('contextType'))
        .then((res) => {
          allRoles = res.data.data;
          const commonNames = allRoles.filter((obj) => basicdata.roles.includes(obj.name)).map((obj) => obj.name);
          const modifiedArray = commonNames.map((item) => {
            const words = item.split('_');
            const capitalizedWords = words.map((word) => {
              const lowercaseWord = word.toLowerCase();
              return lowercaseWord.charAt(0).toUpperCase() + lowercaseWord.slice(1);
            });
            return capitalizedWords.join(' ');
          });
          setAllUserRoles(modifiedArray);
        })
        .catch((err) => {});
    }
  }, [basicLoader]);

  const [edit, setEdit] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBasicdata({ ...basicdata, [name]: value });
  };

  const handleEdit = () => {
    setEdit(true);
    setTempBasicdata({ ...basicdata });
  };

  const handlecancel = () => {
    setBasicdata({ ...tempbasicdata });
    setEdit(false);
  };

  const handleSave = () => {
    setLoading(true);

    const payload = {
      uidx: basicdata.uidx,
      mobileNumber: basicdata.mobileNumber,
      email: basicdata.email,
      firstName: basicdata.firstName,
      secondName: basicdata.secondName,
      profilePicture: basicdata.profilePicture,
      tennatId: basicdata.tennatId,
    };

    setUserDetails(payload)
      .then((res) => {
        localStorage.setItem('user_details', JSON.stringify(res.data.data));
        localStorage.setItem('user_name', res.data.data.firstName + ' ' + res.data.data.secondName);
        setEdit(false);
        setLoading(false);
      })
      .catch((err) => {
        setEdit(false);
        setLoading(false);
      });
  };

  const columns = [
    {
      field: 'FirstName',
      headerName: 'First Name',
      flex: 1,
      minWidth: 40,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'LastName',
      headerName: 'Last Name',
      flex: 1,
      minWidth: 40,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'Email',
      headerName: 'E-mail',
      flex: 1,
      minWidth: 50,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'Phone',
      headerName: 'Phone',
      flex: 1,
      minWidth: 20,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'Roles',
      headerName: 'Roles',
      flex: 1,
      minWidth: 80,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      align: 'left',
    },
    {
      field: 'Language',
      headerName: 'Language',
      flex: 1,
      minWidth: 40,
      cellClassName: 'datagrid-rows',
      headerClassName: 'datagrid-columns',
      headerAlign: 'left',
      align: 'left',
    },
  ];
  const rows = [
    {
      id: 1,
      FirstName: basicdata?.firstName,
      LastName: basicdata?.secondName,
      Email: basicdata?.email,
      Phone: basicdata?.mobileNumber,
      Roles: allUserRoles?.join(', '),
      Language: 'English',
    },
  ];

  return (
    <Card id="basic-info" sx={{ overflow: 'visible' }} className={`${isMobilDevice && 'po-box-shadow'}`}>
      <SoftBox p={3} className="basic-info-box">
        <SoftTypography variant="h5">Basic Info</SoftTypography>
        {edit ? (
          <SoftBox className="coco-div">
            {loading ? (
              <SoftBox margin="auto">
                <Spinner />
              </SoftBox>
            ) : (
              <SoftBox className="coco-div">
                <Button className="basic-font1" onClick={() => handleSave()}>
                  Save
                </Button>
                <Button className="basic-font1" onClick={() => handlecancel()}>
                  Cancel
                </Button>
              </SoftBox>
            )}
          </SoftBox>
        ) : (
          <Button onClick={() => handleEdit()} className="basic-font1">
            Edit
          </Button>
        )}
      </SoftBox>

      {edit ? (
        <SoftBox component="form" pb={3} px={3} className="form-info-boxx">
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormField
                type="text"
                onChange={handleChange}
                value={basicdata['firstName']}
                name="firstName"
                label="first name"
                placeholder="Alec"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormField
                type="text"
                onChange={handleChange}
                value={basicdata['secondName']}
                name="secondName"
                label="last name"
                placeholder="Thompson"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormField
                label="email"
                placeholder="example@email.com"
                inputProps={{ type: 'email' }}
                type="email"
                onChange={handleChange}
                value={basicdata['email']}
                name="email"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormField
                label="phone number"
                placeholder="+40 735 631 620"
                inputProps={{ type: 'number' }}
                onChange={handleChange}
                value={basicdata.mobileNumber}
                name="mobileNumber"
              />
            </Grid>
          </Grid>
        </SoftBox>
      ) : (
        <Grid container spacing={3} p={3} className="flex-jodo">
          {loading ? (
            <SoftBox margin="auto">
              <Spinner />
            </SoftBox>
          ) : (
            <>
              {/* <Grid item xs={12} md={12} xl={12} className="solid-box">
                <div className="details-container">
                  <SoftTypography className="front-title">First Name</SoftTypography>
                  <SoftTypography className="back-input">{basicdata.firstName}</SoftTypography>
                </div>
                <div className="details-container">
                  <SoftTypography className="front-title">Last Name</SoftTypography>
                  <SoftTypography className="back-input">{basicdata.secondName}</SoftTypography>
                </div>
                <div className="details-container">
                  <SoftTypography className="front-title">E-mail</SoftTypography>
                  <SoftTypography className="back-input">{basicdata.email}</SoftTypography>
                </div>
                <div className="details-container">
                  <SoftTypography className="front-title">Phone</SoftTypography>
                  <SoftTypography className="back-input">{basicdata.mobileNumber}</SoftTypography>
                </div>
                <div className="details-container">
                  <SoftTypography className="front-title">Roles</SoftTypography>
                  <SoftTypography className="back-input">{allUserRoles.join(', ')}</SoftTypography>
                </div>
                <div className="details-container">
                  <SoftTypography className="front-title">Language</SoftTypography>
                  <SoftTypography className="back-input">English</SoftTypography>
                </div>
              </Grid> */}
              <div style={{ height: 200, width: '100%' }}>
                <DataGrid
                  rows={rows || []}
                  columns={columns}
                  pageSize={5}
                  disableSelectionOnClick
                  hideFooterPagination
                />
              </div>
            </>
          )}
        </Grid>
      )}
    </Card>
  );
}

export default BasicInfo;
