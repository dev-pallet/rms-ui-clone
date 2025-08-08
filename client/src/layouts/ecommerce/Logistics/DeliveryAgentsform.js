import { Button, Card } from '@mui/material';
import { Grid } from '@mui/material';
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../examples/Navbars/DashboardNavbar';
import FormField from '../../applications/wizard/components/FormField';
import React from 'react';
import SoftTypography from '../../../components/SoftTypography';
import deliverydata from './DeliveryaAgentsdata';

const DeliveryAgentsform = () => {
  const [formData, setFormData] = React.useState({
    s_no: 1,
    name: '',
    mobilenumber: '',
    drivinglicence: '',
    email: '',
    allotvehicle: '',
    location: '',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSubmit = (event) => {
    event.preventDefault();
  };
  const onAdd = () => {
    event.preventDefault();
    deliverydata.push({
      s_no: formData.s_no,
      name: formData.name,
      mobilenumber: formData.mobilenumber,
      drivinglicence: formData.drivinglicence,
      email: formData.email,
      allotvehicle: formData.allotvehicle,
      location: formData.location,
    });

    setFormData(formData.s_no + 1);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Card style={{ padding: '2rem' }}>
        <SoftTypography style={{ fontSize: '1rem' }}>Delivery Agents</SoftTypography>
        <form>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} xl={4}>
              <FormField
                type="text"
                label="Name"
                name="name"
                defaultValue=""
                onChange={handleInputChange}
                value={formData.name}
              />
            </Grid>
            <Grid item xs={12} sm={6} xl={4}>
              <FormField
                type="number"
                label="Mobie Number"
                name="mobilenumber"
                defaultValue=""
                onChange={handleInputChange}
                value={formData.number}
              />
            </Grid>
            <Grid item xs={12} sm={6} xl={4}>
              <FormField
                type="email"
                label="Email"
                name="email"
                defaultValue=""
                onChange={handleInputChange}
                value={formData.email}
              />
            </Grid>
            <Grid item xs={12} sm={6} xl={4}>
              <FormField
                type="text"
                label="Driving Licence"
                name="drivinglicence"
                defaultValue=""
                onChange={handleInputChange}
                value={formData.bankAccoun}
              />
            </Grid>
            <Grid item xs={12} sm={6} xl={4}>
              <FormField
                type="text"
                label="Allot Vehicle"
                defaultValue=""
                name="allotvehicle"
                onChange={handleInputChange}
                value={formData.gst}
              />
            </Grid>
            <Grid item xs={12} sm={6} xl={4}>
              <FormField
                type="text"
                label="Location"
                name="location"
                defaultValue=""
                onChange={handleInputChange}
                value={formData.pan}
              />
            </Grid>

            <Grid item xs={12} sm={12} xl={12}>
              <Button
                variant="contained"
                onClick={onAdd}
                style={{ float: 'right', backgroundColor: '#0562FB', color: 'white' }}
              >
                Add
              </Button>
            </Grid>
          </Grid>
        </form>
      </Card>
    </DashboardLayout>
  );
};

export default DeliveryAgentsform;
