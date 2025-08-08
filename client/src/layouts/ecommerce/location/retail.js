import './location.css';
import { Avatar, Box, Grid } from '@mui/material';
import { buttonStyles } from '../Common/buttonColor';
import { deleteBranch } from '../../../config/Services';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import DeleteIcon from '@mui/icons-material/Delete';
import PlaceIcon from '@mui/icons-material/Place';
import SoftBox from 'components/SoftBox';
import SoftButton from '../../../components/SoftButton';
import SoftTypography from 'components/SoftTypography';
import Swal from 'sweetalert2';
import sideNavUpdate from '../../../components/Utility/sidenavupdate';
import { noDatagif } from '../Common/CommonFunction';

const LocationsRetail = (props) => {
  sideNavUpdate();
  const navigate = useNavigate();
  const permissions = JSON.parse(localStorage.getItem('permissions'));
  const user_details = JSON.parse(localStorage.getItem('user_details'));
  const userRole = JSON.parse(localStorage.getItem('user_roles'));
  const [authorization, setAuthorization] = useState(false);
  const uidx = user_details.uidx;

  useEffect(() => {
    if (userRole.includes('SUPER_ADMIN')) {
      setAuthorization(true);
    } else {
      setAuthorization(false);
    }
  });

  const goToNew = () => {
    navigate('/setting/locations/new');
  };

  useEffect(() => {}, [props]);

  const branchDelete = (item) => {
    const newSwal = Swal.mixin({
      customClass: {
        confirmButton: 'button button-success',
        cancelButton: 'button button-error',
      },
      buttonsStyling: false,
    });

    newSwal
      .fire({
        title: 'Are you sure you want to delete this location ? ',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Delete',
      })
      .then((result) => {
        if (result.isConfirmed) {
          if (props.location.length > 1) {
            const payload = {
              branchId: item.branchId,
              updatedBy: uidx,
            };
            deleteBranch(payload).then((res) => {
              if (item.branchId === localStorage.getItem('locId')) {
                localStorage.removeItem('locId');
                const newSwal = Swal.mixin({
                  customClass: {
                    confirmButton: 'button button-success',
                    cancelButton: 'button button-error',
                  },
                  buttonsStyling: false,
                });
                newSwal
                  .fire({
                    title: 'Select Location',
                    icon: 'info',
                    confirmButtonText: 'OK',
                  })
                  .then((result) => {
                    navigate('/AllOrg_loc');
                  });
              } else {
                window.location.reload();
              }
            });
          } else if (props.location.length === 1) {
            const newSwal = Swal.mixin({
              customClass: {
                confirmButton: 'button button-success',
                cancelButton: 'button button-error',
              },
              buttonsStyling: false,
            });
            newSwal
              .fire({
                title: 'Add a new location to delete this location',
                icon: 'info',
                showCancelButton: true,
                confirmButtonText: 'Add Location',
              })
              .then((result) => {
                if (result.isConfirmed) {
                  navigate('/setting/locations/new');
                }
              });
          }
        }
      });
  };

  const handleNavigate = (id) => {
    navigate(`/setting/locations/shop/${id}`);
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      {permissions?.RETAIL_Settings?.WRITE || permissions?.WMS_Settings?.WRITE || permissions?.VMS_Settings?.WRITE ? (
        <SoftBox className="location-box">
          <SoftBox className="location-float-box">
            <SoftButton
              variant={buttonStyles.primaryVariant}
              onClick={() => goToNew()}
              // className="location-text-II"
              className="contained-softbutton"
            >
              <AddIcon />
              Add location
            </SoftButton>
          </SoftBox>
        </SoftBox>
      ) : null}
      <Grid container spacing={3}>
        <Grid item xs={12} md={12} xl={12}>
          <SoftBox className="location-details-box">
            <SoftTypography className="location-text-I">Locations</SoftTypography>
            <SoftTypography className="location-text-III">
              Manage the places you stock inventory, fulfill orders, and sell products.
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
                  <SoftBox className="location-info-box" key={e.branchId}>
                    <Box display="flex" alignContent="center" justifyContent="space-between">
                      <SoftBox className="location-shop-box">
                        {e.branchLogo !== '' ? (
                          <Avatar alt={e.branchId} src={e.branchLogo} sx={{ width: 56, height: 56 }} />
                        ) : (
                          <PlaceIcon className="place-icon" />
                        )}
                        <SoftTypography className="shop-text" onClick={() => handleNavigate(e.branchId)}>
                          {e.displayName} <br />
                        </SoftTypography>
                      </SoftBox>
                      {authorization && (
                        <Box padding={1} marginTop={1}>
                          <DeleteIcon cursor="pointer" fontSize="12px" onClick={() => branchDelete(e)} />
                        </Box>
                      )}
                    </Box>
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
export default LocationsRetail;
