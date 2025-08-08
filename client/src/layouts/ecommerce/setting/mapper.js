import { getCustomerDetails, getWarehouseData, vendorOrgDetails } from '../../../config/Services';
import { useSnackbar } from '../../../hooks/SnackbarProvider';
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../examples/Navbars/DashboardNavbar';
import React, { useEffect, useState } from 'react';
import SettingRetail from './retail/retail';
import SettingVendor from './vendor';
import SettingWMS from './index';
import sideNavUpdate from '../../../components/Utility/sidenavupdate';

const MapperOrg = () => {
  sideNavUpdate();
  const showSnackbar = useSnackbar();
  const [data, setData] = useState({});
  const [loader, setLoader] = useState(false);
  const contextType = localStorage.getItem('contextType');
  const orgId = localStorage.getItem('orgId');

  useEffect(() => {
    if(contextType === 'WMS'){
      getWMSDetails();
    }
    else if(contextType === 'RETAIL'){
      getRetailDetails();
    }
    else if(contextType === 'VMS'){
      getVendorDetails();
    }
        
  },[]);

  const getWMSDetails = () => {
    getWarehouseData(orgId).then((res) => {
      setData(res?.data?.data?.warehouseOrganisationResponse);
      setLoader(true);
      showSnackbar('Success','success');
    })
      .catch((err) =>{
        setLoader(false);
        showSnackbar(err?.response?.data?.message,'error');
      });
  };
    
  const getRetailDetails = () => {
    getCustomerDetails(orgId).then((res) => {
      setData(res?.data?.data?.retail);
      setLoader(true);
      showSnackbar('Success','success');
    })
      .catch((err) =>{
        setLoader(false);
        showSnackbar(err?.response?.data?.message,'error');
      });
  };
    
  const getVendorDetails = () => {
    vendorOrgDetails(orgId).then((res) => {
      if(res.data.data.status === true){
        setData(res?.data?.data?.object);
        showSnackbar('Success','success');
      }
      setLoader(true);
    }).catch((err) =>{
      setLoader(false);
      showSnackbar(err.response.data.message,'error');
    });
  };

  function mapObject(source, map) {
    const target = {};
    for (const key of Object.keys(map)) {
      const path = map[key];
      const value = getProperty(source, path);
      target[key] = value;
    }
    if (Array.isArray(target.contacts) && target.contacts.length > 0) {
      target.contacts = target.contacts.map(contactsObj => mapObject(contactsObj, {
        email: 'email',
        name: 'name',
        phoneNo: 'phoneNo',
        contactId: 'contactId',
        contactType:'contactType'
      }));
    }
    if (Array.isArray(target.addresses) && target.addresses.length > 0) {
      target.addresses = target.addresses.map(addressesObj => mapObject(addressesObj, {
        id: 'id',
        name: 'name',
        addressLine1: 'addressLine1',
        addressLine2: 'addressLine2',
        city: 'city',
        country: 'country',
        pincode: 'pincode',
        state: 'state',
        mobileNumber: 'mobileNumber',
        defaultBilling: 'defaultBilling',
        defaultShipping: 'defaultShipping'
      }));
    }
    if (Array.isArray(target.bankDetailMap) && target.bankDetailMap.length > 0) {
      target.bankDetailMap = target.bankDetailMap.map(bankDetailMapObj => mapObject(bankDetailMapObj, {
        id: 'bankDetail.id',
        bankName: 'bankDetail.bankName',
        accountHolderName: 'bankDetail.accountHolderName',
        accountType: 'bankDetail.accountType',
        bankAddress: 'bankDetail.bankAddress',
        bankVerificationStatus: 'bankDetail.bankVerificationStatus',
        id: 'bankDetail.id',
        ifscNumber: 'bankDetail.ifscNumber',
        tenantId: 'bankDetail.tenantId'
      }));
    }
    if (Array.isArray(target.addressMapping) && target.addressMapping.length > 0) {
      target.addressMapping = target.addressMapping.map(addressMappingObj => mapObject(addressMappingObj, {
        addressLine1: 'addressDto.addressLine1',
        addressLine2: 'addressDto.addressLine2',
        city: 'addressDto.city',
        country: 'addressDto.country',
        id: 'addressDto.id',
        pincode: 'addressDto.pincode',
        state: 'addressDto.state',
        addressType: 'addressDto.addressType'
      }));
    }
    if (Array.isArray(target.supportContactMap) && target.supportContactMap.length > 0) {
      target.supportContactMap = target.supportContactMap.map(supportContactMapObj => mapObject(supportContactMapObj, {
        contactName: 'contactDto.contactName',
        contactType: 'contactDto.contactType',
        email: 'contactDto.email',
        emailVerified: 'contactDto.emailVerified',
        id: 'contactDto.id',
        phoneNo: 'contactDto.phoneNo',
        phoneVerified: 'contactDto.phoneVerified'
      }));
    }
    if (Array.isArray(target.primaryContactDto) && target.primaryContactDto.length > 0) {
      target.primaryContactDto = target.primaryContactDto.map(primaryContactDtoObj => mapObject(primaryContactDtoObj, {
        contactName: 'contactName',
        contactType: 'contactType',
        email: 'email',
        emailVerified: 'emailVerified',
        id: 'id',
        phoneNo: 'phoneNo',
        phoneVerified: 'phoneVerified'
      }));
    }
    if (Array.isArray(target.primaryContact) && target.primaryContact.length > 0) {
      target.primaryContact = target.primaryContact.map(contactsObj => mapObject(contactsObj, {
        email: 'email',
        phoneNo: 'phoneNo',
        contactId: 'contactId',
        contactType:'type'
      }));
    }
    if (Array.isArray(target.addressList) && target.addressList.length > 0) {
      target.addressList = target.addressList.map(addressesObj => mapObject(addressesObj, {
        addressLine1: 'addressLine1',
        addressLine2: 'addressLine2',
        city: 'city',
        country: 'country',
        id: 'addressId',
        pincode: 'pinCode',
        state: 'state',
        addressType: 'addressType',
        type: 'type'
      }));
    }
    return target;
  }

  function getProperty(object, path) {
    return path.split('.').reduce((obj, prop) => obj && obj[prop], object);
  }


  const mapRetail = {
    businessName: 'customerName',
    displayName: 'displayName',
    businessType:'businessType',
    businessCategory: 'retailType',
    registrationDate:'created',
    branchLogo:'logoUrl',
    website:'website',
    contacts:'contacts',
    addresses:'addresses',
    kycs: 'kycs',
    retailId: 'retailId',
    pan:'panNumber',
    fssaiNumber: 'fssaiNumber'
  };

  const mapWms = {
    businessName: 'businessName',
    displayName: 'displayName',
    businessType:'businessType',
    businessCategory: 'businessCategory',
    accountId: 'accountId',
    registrationDate:'registrationDate',
    pan:'pan',
    website: 'website',
    bankDetailMap: 'bankDetailMap',
    addressMapping: 'addressMapping',
    supportContactMap: 'supportContactMap',
    primaryContactDto: 'primaryContactDto',
    logoUrl:'logoUrl',
    gtin: 'gtin',
    primaryContactId:'primaryContactId',
    tan:'tan'
  };
  const mapVMS = {
    businessName: 'businessName',
    displayName: 'displayName',
    businessType:'sellerType',
    website: 'website',
    logoUrl:'vendorLogo',
    primaryContact:'primaryContact',
    addressList:'addressList',
  };

  let target = {};

  if((data)){
    try {
      if(contextType == 'WMS'){
        target = mapObject(data, mapWms);
      }
      else if(contextType == 'RETAIL'){
        target = mapObject(data, mapRetail);
      }
      else if(contextType == 'VMS'){
        target = mapObject(data, mapVMS);
      }
    } catch (error) {
    }
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      {loader
        ?   contextType == 'WMS'
          ?<SettingWMS target={target} />
          : contextType == 'RETAIL'
            ?<SettingRetail target={target}/>
            : contextType == 'VMS'
              ? <SettingVendor target={target}/>
              :null
        :null
      }
            
    </DashboardLayout   >
  );
};

export default MapperOrg;
