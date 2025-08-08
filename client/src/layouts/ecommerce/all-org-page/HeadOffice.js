import './HeadOffice.css';
import { CircularProgress, Stack, Typography } from '@mui/material';
import { getAllRoles, roleBasedPermission } from '../../../config/Services';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../../../hooks/SnackbarProvider';
import React, { useState } from 'react';
import SoftBox from '../../../components/SoftBox';

const HeadOffice = () => {
  const navigate = useNavigate();
  const showSnackBar = useSnackbar();
  const [loader, setLoader] = useState(false);
  // const contextType = localStorage.getItem('contextType');
  const contextType = 'RETAIL';
  const access_token = localStorage.getItem('access_token');
  const user_roles = localStorage.getItem('user_roles');

  const permissionFunction = async () => {
    setLoader(true);
    try{
      const res = await getAllRoles('RETAIL');
      // .then((res)=>{
      const allRoles = res?.data?.data;
      const commonNames = allRoles?.filter((obj) => user_roles?.includes(obj.name))?.map((obj) => obj.name);
      const payload = {
        roles: commonNames,
      };
      const roleRes = await roleBasedPermission(payload);
      const permissions = {};
      for (const key in roleRes?.data?.data) {
        if (key.includes('HO')) {
          permissions[key] = roleRes?.data?.data[key];
        }
      }
      localStorage.setItem('permissions', JSON.stringify(permissions));
    }catch(error){
      showSnackBar('Something went wrong while fetching permission','error');
    }
  };

  const headOfficeHandler = async () => {
    await permissionFunction();
    setLoader(false);
    localStorage.setItem('orgId', 'RET_55');
    localStorage.setItem('locId', 'RLC_56');
    localStorage.setItem('sourceApp', 'PALLET_RETAIL');
    localStorage.setItem('contextType', 'RETAIL');
    localStorage.setItem('locName', 'Nilgiris');
    localStorage.setItem('isHeadOffice', true);
    window.location.href = '/dashboards/head-office';
  };

  return (
    <SoftBox className="ho-main-div location-card-box-shadow" onClick={headOfficeHandler}>
      <SoftBox className="ho-info-div">
        <SoftBox className="ho-img-main-div">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5NVoNKSuXJBytwKCY0bmwxfgTGB38FqJaNDFoCLY&s"
            alt=""
            className="ho-image"
          />
        </SoftBox>
        <SoftBox>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography fontSize="18px" fontWeight="bold">
              Nilgiris
            </Typography>
            {loader && (
              <CircularProgress
                sx={{ height: '20px !important', width: '20px !important', color: '#0562FB !important' }}
              />
            )}
          </Stack>
          <Typography fontSize="14px" sx={{ color: 'lightgray' }}>
            A leading dairy company in India, producing a wide range of products including milk, butter, cheese, yogurt,
            and ice cream.
          </Typography>
        </SoftBox>
        {/* <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack>
                <Typography>20</Typography>
            </Stack>
          </Stack> */}
      </SoftBox>
    </SoftBox>
  );
};

export default HeadOffice;
