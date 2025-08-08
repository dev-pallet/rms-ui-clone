import { Button, Card, Divider } from '@mui/material';
import { Grid } from '@mui/material';
import DashboardLayout from '../../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../../examples/Navbars/DashboardNavbar';
import FormField from '../../applications/wizard/components/FormField';
import React from 'react';
import SoftBox from '../../../components/SoftBox';
import SoftSelect from '../../../components/SoftSelect';
import SoftTypography from '../../../components/SoftTypography';
import rowdata from './Fleetmanagmentdata';

const Fleetmanagmentform = () => {
  const [formData, setFormData] = React.useState({
    s_no: 0,
    vehicle: '',
    capacity: '',
    make: '',
    bodytype: '',
    company: '',
    name: '',
    number: '',
    email: '',
    bankAccount: '',
    gst: '',
    pan: '',
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
    rowdata.push({
      s_no: formData.s_no,
      vehicle: formData.vehicle,
      capacity: formData.capacity,
      email: formData.email,
      make: formData.make,
      bodytype: formData.bodytype,
      company: formData.company,
    });

    setFormData(formData.s_no + 1);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Card style={{ padding: '2rem' }}>
        <SoftTypography style={{ fontSize: '1rem', fontWeight: 'bold' }}>Fleet Managment </SoftTypography>

        <form onSubmit={onAdd}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} xl={4}>
              <FormField
                type="text"
                label="Vehicle"
                name="vehicle"
                value={formData.vehicle}
                defaultValue=""
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12} sm={6} xl={4}>
              <SoftBox mb={1} ml={0.5}>
                <SoftTypography
                  component="label"
                  variant="caption"
                  fontWeight="bold"
                  textTransform="capitalize"
                  style={{ minWidth: '130px' }}
                >
                  Capacity
                </SoftTypography>
                <SoftBox style={{ display: 'flex', marginTop: '5px' }}>
                  <FormField
                    type="number"
                    name="capacity"
                    defaultValue=""
                    onChange={handleInputChange}
                    value={formData.capacity}
                  />
                  <SoftBox style={{ width: '50px' }}>
                    <SoftSelect style={{ width: '10px' }} placeholder="KG" />
                  </SoftBox>
                </SoftBox>
              </SoftBox>
            </Grid>

            <Grid item xs={12} sm={6} xl={4}>
              <FormField
                type="text"
                label="Make"
                name="make"
                defaultValue=""
                onChange={handleInputChange}
                value={formData.make}
              />
            </Grid>
            <Grid item xs={12} sm={6} xl={4}>
              <SoftBox mb={1} ml={0.5}>
                <SoftTypography
                  component="label"
                  variant="caption"
                  fontWeight="bold"
                  textTransform="capitalize"
                  style={{ minWidth: '130px' }}
                >
                  Body Type
                </SoftTypography>
                <SoftBox style={{ display: 'flex', marginTop: '5px' }}>
                  <SoftBox style={{ width: '100%' }}>
                    <SoftSelect placeholder="Cold Storage" />
                  </SoftBox>
                </SoftBox>
              </SoftBox>
            </Grid>
            <Grid item xs={12} sm={6} xl={4}>
              <FormField
                type="text"
                label="Company"
                name="company"
                defaultValue=""
                onChange={handleInputChange}
                value={formData.company}
              />
            </Grid>
            <Grid item xs={12} sm={12} xl={12}>
              <Divider sx={{ margin: 0, marginTop: '10px' }} />
            </Grid>
            <Grid item xs={12} sm={12} xl={12}>
              <SoftTypography style={{ fontSize: '1rem', fontWeight: 'bold' }}>Contact Details</SoftTypography>
            </Grid>
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
                label="Number"
                name="number"
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
                label="Bank Account"
                name="bankAccount"
                defaultValue=""
                onChange={handleInputChange}
                value={formData.bankAccoun}
              />
            </Grid>
            <Grid item xs={12} sm={6} xl={4}>
              <FormField
                type="text"
                label="GST"
                defaultValue=""
                name="gst"
                onChange={handleInputChange}
                value={formData.gst}
              />
            </Grid>
            <Grid item xs={12} sm={6} xl={4}>
              <FormField
                type="text"
                label="PAN"
                name="pan"
                defaultValue=""
                onChange={handleInputChange}
                value={formData.pan}
              />
            </Grid>
            <Grid item xs={12} sm={6} xl={4}>
              <FormField
                type="text"
                label="Location"
                name="location"
                defaultValue=""
                onChange={handleInputChange}
                value={formData.location}
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

export default Fleetmanagmentform;
