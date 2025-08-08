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
import Grid from '@mui/material/Grid';

// Soft UI Dashboard PRO React components
import SoftBox from 'components/SoftBox';

// Soft UI Dashboard PRO React example components
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import Footer from 'examples/Footer';
import SoftButton from 'components/SoftButton';
import TimelineItem from 'examples/Timeline/TimelineItem';
import TimelineList from 'examples/Timeline/TimelineList';

// Data
// import timelineData from "layouts/pages/projects/timeline/data/timelineData";
import {useState} from 'react';
import AnimatedStatisticsCard from 'examples/Cards/StatisticsCards/AnimatedStatisticsCard';
import Box from '@mui/material/Box';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import FormField from 'layouts/ecommerce/product/all-products/components/edit-product/components/FormField/index';
import MiniStatisticsCard from 'examples/Cards/StatisticsCards/MiniStatisticsCard';
import Modal from '@mui/material/Modal';
import SoftSelect from 'components/SoftSelect';
import SoftTypography from 'components/SoftTypography';
import timelineData from './data/timelineData';


const Timeline = () => {

  const [selectedImages, setSelectedImages] = useState([]);

  const onSelectFile = (event) => {
    const selectedFiles = event.target.files;
    const selectedFilesArray = Array.from(selectedFiles);

    const imagesArray = selectedFilesArray.map((file) => {
      return URL.createObjectURL(file);
    });
    setSelectedImages((previousImages) => previousImages.concat(imagesArray));
    // FOR BUG IN CHROME
    event.target.value = '';
  };
  function deleteHandler(image) {
    setSelectedImages(selectedImages.filter((e) => e !== image));
    URL.revokeObjectURL(image);
  }

  const [imgaediv,setImgdiv] = useState(true);

  const [openmodel,setOpenmodel]  = useState(false);

  const handleopen = () =>{
    setOpenmodel(true);
  };

  const handleClose = () =>{
    setOpenmodel(false);
  };


  const renderTimelineItems = timelineData.map(
    ({ color, icon, title, dateTime, description, badges, lastItem }) => (
      <TimelineItem
        key={title + color}
        color={color}
        icon={icon}
        title={title}
        dateTime={dateTime}
        description={description}
        badges={badges}
        lastItem={lastItem}
      />
    )
  );

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox my={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} xl={12}>
            <SoftButton onClick={handleopen} className="inventory-button" variant="gradient" color="info">Inventory adjustment</SoftButton>
          </Grid>
          <Modal
            open={openmodel}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box className="batch-box-inventory">
              <Grid container spacing={1} p={1}>
                <Grid item xs={12} sm={12}>
                  <FormField type="text" label="Quantity" defaultValue="200 kg"/>
                </Grid>

                <SoftBox mt={2} mb={1} ml={2} lineHeight={0} display="inline-block">
                  <SoftTypography component="label" variant="caption" fontWeight="bold" textTransform="capitalize">Reason</SoftTypography>
                </SoftBox>
                <Grid item xs={12} sm={12}>
                  <SoftSelect
                    defaultValue={{ value: 'rs', label: 'Item broken' }}
                    options={[
                      { value: 'rs1', label: 'Used products'},
                      { value: 'rs2', label: 'Item missing' },
                      { value: 'rs3', label: 'Item used' },
                      { value: 'rs4', label: 'Product size is large'},
                      { value: 'rs5', label: 'Product sizw is small' }
                    ]}
                  />
                </Grid>

                <SoftBox mt={2} mb={1} ml={2} lineHeight={0} display="inline-block">
                  <SoftTypography component="label" variant="caption" fontWeight="bold" textTransform="capitalize">Account</SoftTypography>
                </SoftBox>
                <Grid item xs={12} sm={12}>
                  <SoftSelect
                    defaultValue={{ value: 'Acc', label: 'Rent expense' }}
                    options={[
                      { value: 'acc1', label: 'Repairs'},
                      { value: 'acc2', label: 'Travel expense' },
                      { value: 'acc3', label: 'Discount' },
                      { value: 'acc4', label: 'General Income'},
                      { value: 'acc5', label: 'Interest Income' }
                    ]}
                  />
                </Grid>
                          
                <Grid item xs={12} sm={12}>
                          
                  {imgaediv? <section >
                    <SoftBox className="multiple-box">
                      <label variant="body2" className="body-label">
                        <br />
                        Browse Image


                        <input
                          type="file"
                          name="images"
                          onChange={onSelectFile}
                          multiple
                          accept="image/png , image/jpeg, image/webp"
                        />
                      </label></SoftBox>


                    <br/>

                    <input type="file" multiple />

                    {selectedImages.length > 0 &&
        (selectedImages.length > 10 ? (
          <p className="error">
            You can't upload more than 10 images! <br />
            <span>
              please delete <b> {selectedImages.length - 10} </b> of them{' '}
            </span>
          </p>
        ) : (''))}

                    <div className="images-box">
                      {selectedImages &&
          selectedImages.map((image, index) => {
            return (
              <div key={image} className="image">
                <img src={image} height="200" alt=""  className="uil"/>
                <button onClick={() => deleteHandler(image)} className="del-btn">
                  <DeleteOutlineIcon/>
                </button>
              </div>
            );
          })}
                    </div>
                  </section>:''}
                </Grid>
                <Grid item xs={12} sm={12}>
                  <SoftBox className="header-submit-box">
                    <SoftButton>cancel</SoftButton>
                    <SoftButton variant="gradient" color="info">submit</SoftButton>
                  </SoftBox>
                            
                </Grid>
              </Grid>             
            </Box>
          </Modal>
          <Grid item xs={12} lg={4}>
            <TimelineList title="Production timeline">{renderTimelineItems}</TimelineList>            
          </Grid>

          <Grid item xs={12} lg={8}>

            <Grid container spacing={3}>
              <Grid item xs={12} lg={4}>
                <SoftBox mb={3}>
                  <AnimatedStatisticsCard
                    title="Production efficeincy"
                    count="97%"
                    percentage={{
                      color: 'dark',
                      label: '2.5% to earned next level',
                    }}
                    action={{
                      type: 'internal',
                      route: '/pages/projects/general',
                      label: 'In Progress',
                    }} 
                  />
                </SoftBox>
              </Grid>

              <Grid item xs={12} md={6} lg={4}>
                <SoftBox mb={3}>
                  <MiniStatisticsCard
                    title={{color: 'info', fontWeight: 'medium', text: 'Approved quantity' }}
                    count="900 kgs"
                    icon={{ color: 'dark', component: 'local_atm' }}
                    direction="left"
                  />
                </SoftBox>

                <MiniStatisticsCard
                  title={{color: 'info', fontWeight: 'medium', text: 'Packaged output' }}
                  count="870 kgs"
                  icon={{ color: 'dark', component: 'emoji_events' }}
                  direction="left"
                />
              </Grid>

              <Grid item xs={12} md={6} lg={4}>
                <SoftBox mb={3}>
                  <MiniStatisticsCard
                    title={{color: 'info', fontWeight: 'medium', text: 'Wastage' }}
                    count="30 kgs"
                    icon={{ color: 'dark', component: 'public' }}
                    direction="left"
                  />
                </SoftBox>
                <MiniStatisticsCard
                  title={{color: 'info', fontWeight: 'medium', text: 'Production' }}
                  count="0.8% (↑0.3 %)"
                  icon={{ color: 'dark', component: 'storefront' }}
                  direction="left"
                />
              </Grid>
                   
            </Grid>

         

          </Grid>
        </Grid>
      </SoftBox>
      <Footer />
    </DashboardLayout>
  );
};

export default Timeline;
