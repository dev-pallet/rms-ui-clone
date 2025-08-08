import { getLocationwarehouseData, getRetailUserLocationDetails } from '../../../config/Services';
import LocationsOrg from '.';
import LocationsRetail from './retail';
import React, { useEffect, useState } from 'react';

const MapperLocation = () => {
  const [location, setLocation] = useState([]);
  const [loader, setLoader] = useState(false);
  const [msg, setMsg] = useState('');
  const [stat, setStat] = useState(false);
  const contextType = localStorage.getItem('contextType');
  const orgId = localStorage.getItem('orgId');

  useEffect(() => {
    if(contextType === 'WMS'){
      getWMSDetails();
    }
    else if(contextType === 'RETAIL'){
      getRetailDetails();
    }
  },[]);
    
  const getWMSDetails = () => {
    getLocationwarehouseData(orgId).then((res) => {
      setLoader(true);
      if (res.data.data.locationDataList == null) {
        setStat(true);
        setMsg(res.data.data.message);
      } else {
        setStat(false);
        setLocation(res.data.data.locationDataList);
      }
    })
      .catch((err) =>{
        setLoader(false);
      });
  };
    
  const getRetailDetails = () => {
    getRetailUserLocationDetails(orgId).then((res) => {
      setLoader(true);
      if(res.data.data.message === 'Sorry! Something went wrong.'){
        setStat(true);
        setMsg(res.data.data.message);
      }
      else{
        setLocation(res.data.data.branches);
        setStat(false);
      }
    })
      .catch((err) =>{
        setLoader(false);
      });
  };

  return (
    <div>
      {loader
        ?   contextType == 'WMS'
          ?<LocationsOrg location={location} msg={msg} stat={stat} loader={loader}/>
          : contextType == 'RETAIL'
            ?<LocationsRetail  location={location} stat={stat} msg={msg} />
            :null
        :null
      }
            
    </div>
  );
};

export default MapperLocation;
