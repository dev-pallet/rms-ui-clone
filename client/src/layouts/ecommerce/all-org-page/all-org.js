import './all-org.css';
import  {Box, Button, Card}  from '@mui/material';
import { allOrgNames, allRetailNames, getAllRoles, roleBasedPermission } from '../../../config/Services';
import { getAllUserOrgs } from '../../../config/Services';
import { useEffect,useState } from 'react';
import { useNavigate } from 'react-router-dom';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import PageLayout from 'examples/LayoutContainers/PageLayout';
import  SoftBox  from 'components/SoftBox';
import SoftTypography from '../../../components/SoftTypography';
import Spinner from 'components/Spinner/index';

export const AllOrgPage = () =>{

  const navigate = useNavigate();
  const [loading,setLoading] = useState(false);
  const [retail,setRetail] = useState([]);
  const [wms,setWMS] = useState([]);
  const [vms,setVMS] = useState([]);
  const [responses, setResponses] = useState({});
  const [counter, setCounter] = useState(0);
  const MAX_CALLS = 3;
  const userRole = JSON.parse(localStorage.getItem('user_roles'));


    
  useEffect(()=>{
    const val = localStorage.getItem('user_details');
    const object = JSON.parse(val);
    setLoading(true);
    const payload = {
      'uidx':object.uidx,
    };
    getAllUserOrgs(payload).then((response)=>{
      setVMS(response.data.data.VMS);
      allOrgNames(response.data.data.WMS).then((res) => {
        setLoading(false);
        setWMS(res.data.data.validOrganisationData);
      })
        .catch((err) => {
          setLoading(false);
        });
      const payload = {
        retailIds: response.data.data.RETAIL
      };
      allRetailNames(payload).then((res) => {
        setLoading(false);
        setRetail(res.data.data.retail);
      })
        .catch((err) => {
          setLoading(false);
        });
    });
  },[]);

  // useEffect(() => {
  //   appVersionApi();
  // }, []);
  
  // const appVersionApi = async() => {
  //   getAppVersion()
  //     .then((res) => {
  //       const newResponses = { ...responses, [res.data.data.key]: res.data.data };
  //       setResponses(newResponses.undefined);
  //     })
  //     .catch((err) =>{} );
  // }
  
  // useEffect(() => {
  //   const allSuccess = Object.values(responses).every(
  //     (response) => response.status === "SUCCESS"
  //   );
  //   if (!allSuccess && counter < MAX_CALLS) {
  //     setCounter((prevCounter) => prevCounter + 1);
  //     setTimeout(appVersionApi, 1000);
  //   }
  // }, [responses]);

  let allRoles = [];
  const handleLocation = (e) =>{
    localStorage.removeItem('locId');
    localStorage.removeItem('email_connected');
    localStorage.removeItem('cartId-SO');
    localStorage.removeItem('cartId-MP');
    localStorage.removeItem('Transfer_Type');
    localStorage.removeItem('piNum');
    if(e.hasOwnProperty('organisationId')){
      localStorage.setItem('contextType', 'WMS');
      localStorage.setItem('sourceApp', 'PALLET_WMS');
      localStorage.setItem('orgId',e.organisationId);
      localStorage.setItem('orgName', e.organisationName);
    }
    else if(e.hasOwnProperty('retailId')){
      localStorage.setItem('contextType', 'RETAIL');
      localStorage.setItem('sourceApp', 'PALLET_RETAIL');
      localStorage.setItem('orgId',e.retailId);
      localStorage.setItem('orgName', e.displayName);
    }
    else{
      localStorage.setItem('contextType', 'VMS');
      // localStorage.setItem('sourceApp', "PALLET_RETAIL")
      localStorage.setItem('orgId',e);
      localStorage.setItem('locId',e);
      // localStorage.setItem('orgName', e.displayName)
    }
    getAllRoles(localStorage.getItem('contextType'))
      .then((res) => {
        allRoles = res.data.data;
        const commonNames = allRoles
          .filter(obj => userRole.includes(obj.name))
          .map(obj => obj.name);
        const payload = {
          roles: commonNames
        };
        roleBasedPermission(payload).then((res) => {
          const permissions = {};
          for (const key in res.data.data) {
            if (key.includes(localStorage.getItem('contextType'))) {
              permissions[key] = res.data.data[key];
            }
          }
          localStorage.setItem('permissions', JSON.stringify(permissions));
          if(localStorage.getItem('contextType') === 'VMS'){
            window.location.href = '/';
          }
          else{
            navigate('/organization/locations');
          }
        });
      });
  };
  
  const goBack = () => {
    navigate(-1);
  };

  return(
    <PageLayout>
      {loading?<SoftBox className="main-box-loc" p={10}><Spinner/></SoftBox>:
        <SoftBox className="main-box-loc" p={10}>
          <SoftBox className="main-box-loc-heading">
            <Button onClick={goBack} variant="contained" sx={{backgroundColor:'#0564fe', color:'#fff'}} startIcon={<KeyboardBackspaceIcon />}> Back</Button>
            <SoftTypography variant="h4">Available Organisations</SoftTypography>
          </SoftBox>
          <SoftBox className="child-box-loc">
            <SoftTypography fontSize="13px" variant="p" className="selection-class">Please select a oraginisation.</SoftTypography>
            <br />
            <Box display="flex" alignItems="center" justifyContent="space-between" flexDirection="column">
              {retail?.length > 0 &&
                <Box width="80%" >
                  <SoftTypography>RETAIL</SoftTypography> 
                  {retail?.length === 1 
                    ?<Box width="80%" margin="auto">
                      {retail.map((e)=>{
                        return(
                          e.primaryFlag
                            ?<Box onClick={()=>handleLocation(e)} key={e.retailId} minWidth="85%" >
                              <Card className='all-loc-box'>
                                <SoftTypography className="text-clr-loc">{e.displayName}</SoftTypography>  
                              </Card>
                            </Box> 
                            :null
                              
                        );
                      })}
                    </Box>
                    :<Box display='flex' flexWrap= 'wrap' rowGap='10px' columnGap='2em' >
                      {retail.map((e)=>{
                        return(
                          e.primaryFlag
                            ?<Box onClick={()=>handleLocation(e)} key={e.retailId} flex='1'>
                              <Card className='all-loc-box'>
                                <SoftTypography className="text-clr-loc">{e.displayName}</SoftTypography>  
                              </Card>
                            </Box> 
                            : null
                        );
                      })}
                    </Box>
                  }
                    
                </Box>
              }
              <br />
              {wms?.length > 0 &&
                <Box width="80%" >
                  <SoftTypography>WAREHOUSE</SoftTypography> 
                  {wms?.length === 1
                    ?<Box width="80%" margin="auto">
                      {wms.map((e)=>{
                        return(
                          <Box onClick={()=>handleLocation(e)} key={e.organisationId} minWidth="85%">
                            <Card className='all-loc-box'>
                              <SoftTypography className="text-clr-loc">{e.organisationName}</SoftTypography>  
                            </Card>
                          </Box> 
                        );
                      })}
                    </Box>
                    :<Box display='flex' flexWrap= 'wrap' rowGap='10px' columnGap='2em' >
                      {wms.map((e)=>{
                        return(
                          <Box onClick={()=>handleLocation(e)} key={e.organisationId}  flex='1' maxHeight='52.5px'>
                            <Card className='all-loc-box'>
                              <SoftTypography className="text-clr-loc">{e.organisationName}</SoftTypography>  
                            </Card>
                          </Box> 
                        );
                      })}
                    </Box>
                  }
                  
                </Box>
              }
              {vms?.length > 0 &&
                <Box width="80%" >
                  <SoftTypography>Vendor </SoftTypography> 
                  {vms?.length === 1
                    ?<Box width="80%" margin="auto">
                      {vms.map((e)=>{
                            
                        return(
                          <Box onClick={()=>handleLocation(e)} key={e} minWidth="85%">
                            <Card className='all-loc-box'>
                              <SoftTypography className="text-clr-loc">{e}</SoftTypography>  
                            </Card>
                          </Box> 
                        );
                      })}
                    </Box>
                    :<Box display='flex' flexWrap= 'wrap' rowGap='10px' columnGap='2em' >
                      {vms.map((e)=>{
                        return(
                          <Box onClick={()=>handleLocation(e)} key={e}  flex='1' maxHeight='52.5px'>
                            <Card className='all-loc-box'>
                              <SoftTypography className="text-clr-loc">{e}</SoftTypography>  
                            </Card>
                          </Box> 
                        );
                      })}
                    </Box>
                  }
                  
                </Box>
              }
            </Box>
            <br/>
          </SoftBox>
        </SoftBox>}
    </PageLayout>
  );
};