import './diagnostics.css';
import { Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import SoftBox from 'components/SoftBox';
import SoftTypography from 'components/SoftTypography';
// import Modal from "react-modal";
import { APP_VERSION, APP_VERSION_DATE } from '../../../version';
import { getAppVersion } from './../../../config/Services';
import Spinner from './../../../components/Spinner/index';
import sideNavUpdate from '../../../components/Utility/sidenavupdate';

const Userroles = () => {
  sideNavUpdate();
  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    setLoader(true);
    getAppVersion().then((response) => {
      const res = Object.entries(response?.data?.data).map(([name, obj]) => ({ name, ...obj }));

      setData(res);
      setLoader(false);
    });
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <SoftBox>
        <SoftBox className="users-box">
          <SoftTypography className="gift-text">App version-  {APP_VERSION} {APP_VERSION_DATE}</SoftTypography>
        </SoftBox>

        {loader ? (
          <Spinner />
        ) : (
          <Grid container>
            <Grid item xs={12} md={12} xl={12}>
              <SoftBox className="auto-div">
                <Grid container spacing={3}>
                  <Grid item className="title" xs={6} md={6} xl={6}>
                    <SoftTypography component="label" variant="h4" fontWeight="bold">
                      Service
                    </SoftTypography>
                  </Grid>
                  <Grid item className="title" xs={6} md={6} xl={6}>
                    <SoftTypography component="label" variant="h4" fontWeight="bold">
                      Version
                    </SoftTypography>
                  </Grid>

                  <Grid item className="title" xs={12} md={12} xl={12}></Grid>

                  {data?.map((e, i) => (
                    <SoftBox style={{ width: '100%' }} key={i}>
                      <Grid container style={{ marginLeft: '12px' }}>
                        <Grid item className="title" xs={6} md={6} xl={6}>
                          <SoftTypography>{e.name}</SoftTypography>
                        </Grid>
                        <Grid item className="title" xs={6} md={6} xl={6}>
                          <SoftTypography>
                            {e.status === 'SUCCESS' ? e.data : <>Failed to fetch version</>}
                          </SoftTypography>
                        </Grid>
                      </Grid>
                    </SoftBox>
                  ))}
                </Grid>
              </SoftBox>
            </Grid>
          </Grid>
        )}
      </SoftBox>
    </DashboardLayout>
  );
};

export default Userroles;
