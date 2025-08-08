import { FormControl, FormControlLabel, Grid, Paper, Radio, RadioGroup, Typography } from '@mui/material';
import { VendorDetailsSave, VendorInputFields } from '../../../config/Services';
import { buttonStyles } from '../Common/buttonColor';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../examples/Navbars/DashboardNavbar';
import FormField from '../apps-integration/Pos/components/formfield';
import React, { useEffect, useState } from 'react';
import SoftBox from '../../../components/SoftBox';
import SoftButton from '../../../components/SoftButton';
import SoftTypography from '../../../components/SoftTypography';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };


const apiResponse = {
  'es': 0,
  'message': 'string',
  'statusCode': 0,
  'vendorDetails': [
    {
      'columnName': 'Company Name',
      'columnValue': '',
      'placeholderName': 'Enter company name'
    },
    {
      'columnName': 'Contact Person',
      'columnValue': '',
      'placeholderName': 'Enter contact person'
    },
    {
      'columnName': 'Email',
      'columnValue': '',
      'placeholderName': 'Enter email'
    },
    {
      'columnName': 'Phone Number',
      'columnValue': '',
      'placeholderName': 'Enter phone number'
    },
    {
      'columnName': 'Address',
      'columnValue': '',
      'placeholderName': 'Enter address'
    }
  ],
  'vendorName': 'string',
  'vendorId': 'string'
};
const VendorFormData = () => {
  const [vendorDetails, setVendorDetails] = useState();
  const handleInputChange = (index, value) => {
    setVendorDetails((prevDetails) => {
      const updatedDetails = [...prevDetails];
      updatedDetails[index].columnValue = value;
      return updatedDetails;
    });
  };
  let { vendorId } = useParams();
  vendorId = vendorId.toUpperCase();
  useEffect(() => {
    const payload = {
      'vendor': 'EZETAP',
      'actionName': 'COMMON_SETTING'
    };
 
    VendorInputFields(payload)
      .then((res) => {
        setVendorDetails(res?.data?.data?.data?.config);
      })
      .catch((err) => {
      });

  
  }, []);

  const   navigate = useNavigate();
  const handleCancel = () => {
    navigate('/pallet-pay/settings');
  };
  const onSave = () => {
    const orgId = localStorage.getItem('orgId');
    const locId = localStorage.getItem('locId');

    const data = {};
    vendorDetails.forEach((e) => {
      data[e.columnName] = e.columnValue;
    });
  
    const fullName = localStorage.getItem('user_name');
    const user_details = localStorage.getItem('user_details');
    const createdById = user_details && JSON.parse(user_details).uidx;
    const payload = {
    // "paymentVendorConfigurationId": "string",
      'orgId': orgId,
      'locId': locId,
      'vendor': 'EZETAP',
      'type': vendorId,
      'config': data,
      createdBy: createdById,
      createdByName: fullName,
    };
    VendorDetailsSave(payload)
      .then((res) => {
        localStorage.setItem('paymentVendorConfigId', res.data.data.data.paymentVendorConfigurationId);
        navigate('/pallet-pay/settings');

      })
      .catch((err) => {
      });
  };

  const [selectedValue, setSelectedValue] = React.useState(vendorId);
  // const handleChange = (event) => {
  //   setSelectedValue(event.target.value);
  // };
  const vendorData = [{ value: 'Cloud', label: 'Cloud' }];


  return (
    <DashboardLayout>
      <DashboardNavbar prevLink={true}/>
      <Paper >
        <SoftBox style={{display:'flex'}}> 
          <img style={{width:'130px' , height:'60px'}} src="https://i.ibb.co/9WNWcLP/images.png" alt="" /> <span><SoftTypography style={{fontSize:'1.2rem' , padding:'20px' , fontWeight:'bold'}} >
            {/* Settings */}
          </SoftTypography></span>
        </SoftBox>
      </Paper>


      <Paper style={{ marginTop: '20px', padding: '20px' , paddingBottom:'60px'}}>
        <Typography variant="h6" style={{ fontSize: '1.1rem' }}>Provider Details</Typography>
      
        <FormControl component="fieldset">
          <RadioGroup row value={selectedValue}  style={{ marginLeft: '30px', gap: '20px' }}>
            {/* Radio button with label "self" */}
            {selectedValue === 'SELF' &&   <FormControlLabel value="SELF" control={<Radio />} label="Self" />
            }
            {selectedValue === 'PALLET' &&  <FormControlLabel value="PALLET" control={<Radio />} label="Provided by Pallet" />

            }

            {/* Radio button with label "provided by pallet" */}
          </RadioGroup>
        </FormControl>

        <Grid container spacing={2}>
          {vendorDetails?.map((detail, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <FormField
                disabled={selectedValue!=='SELF'}
                label={detail.columnName}
                placeholder={detail.placeholderName}
                fullWidth
                value={detail.columnValue}
                onChange={(e) => handleInputChange(index, e.target.value)}
                margin="normal"
                variant="outlined"
              />
            </Grid>
          ))}
        </Grid>
        <Grid container spacing={3}>
          {/* <Grid item xs={12} sm={6}  style={{marginTop:"20px" }}>
        <SoftTypography style={{fontSize:"0.8rem" , margin:"6px"}}>Connectivity</SoftTypography>
        <SoftSelect
       
       autoFocus
       options={vendorData}
       label="Connectivity"
       placeholder="Select Connectivity"
       maxWidth="sm"
       fullWidth
       // menuPortalTarget={document.body}
     />
        </Grid> */}
    

    
        </Grid>
    
      

   
      </Paper>
      <SoftBox style={{float:'right' , marginBottom:'25px' , marginTop:'15px'}}>
        <SoftButton variant={buttonStyles.secondaryVariant} className="outlined-softbutton" onClick={handleCancel}>Cancel</SoftButton>
        <SoftButton variant={buttonStyles.primaryVariant} className="contained-softbutton" onClick={onSave} style={{marginLeft:'20px'}}>Save</SoftButton>
      </SoftBox>
    </DashboardLayout>
   
  );
};

export default VendorFormData;