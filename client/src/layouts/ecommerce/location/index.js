import './location.css';
import { Grid } from '@mui/material';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import PlaceIcon from '@mui/icons-material/Place';
import SoftBox from 'components/SoftBox';
import SoftTypography from 'components/SoftTypography';
import sideNavUpdate from '../../../components/Utility/sidenavupdate';
import { noDatagif } from '../Common/CommonFunction';

const LocationsOrg = (props) => {
  sideNavUpdate();
  const navigate = useNavigate();
  const permissions = JSON.parse(localStorage.getItem('permissions'));

  const goToNew = () => {
    navigate('/setting/locations/new');
  };

  useEffect(() => {}, [props]);

  const handleNavigate = (id) => {
    navigate(`/setting/locations/shop/${id}`);
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      {permissions?.RETAIL_Settings?.WRITE || permissions?.WMS_Settings?.WRITE || permissions?.VMS_Settings?.WRITE ? (
        <SoftBox className="location-box">
          <SoftBox className="location-float-box">
            <SoftTypography onClick={() => goToNew()} className="location-text-II">
              <AddIcon />
              Add location
            </SoftTypography>
          </SoftBox>
        </SoftBox>
      ) : null}

      <Grid container spacing={3}>
        <Grid item xs={12} md={12} xl={12}>
          <SoftBox className="location-details-box">
            <SoftTypography className="location-text-I">Locations</SoftTypography>
            <SoftTypography className="location-text-III">
              Manage the places you stock inventory, fulfill orders, and sell products. You’re using <b>1 of 4</b>{' '}
              locations available on your plan.
              <b className="compare-text">Compare plans</b>{' '}
            </SoftTypography>
          </SoftBox>
        </Grid>
        {props.stat ? (
          <Grid item xs={12} md={12} xl={12}>
            <SoftBox className="src-imgg-data">
              <img className="src-dummy-img" src={noDatagif} />
            </SoftBox>
            <SoftBox className="loc-not-found">
              <SoftTypography variant="h5">{props.msg}</SoftTypography>
            </SoftBox>
          </Grid>
        ) : (
          <Grid item xs={12} md={12} xl={12}>
            {props.location.map((e) => {
              return (
                <>
                  <SoftBox className="location-info-box" key={e.locationId}>
                    <SoftBox className="location-shop-box" onClick={() => handleNavigate(e.locationId)}>
                      <PlaceIcon className="place-icon" />
                      <SoftTypography className="shop-text">
                        {e.locationName} <br />
                      </SoftTypography>
                    </SoftBox>
                  </SoftBox>
                </>
              );
            })}
          </Grid>
        )}
      </Grid>
    </DashboardLayout>
  );
};
export default LocationsOrg;
