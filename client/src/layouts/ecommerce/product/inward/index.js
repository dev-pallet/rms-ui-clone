import './inward.css';
import { Inwardtable } from 'layouts/ecommerce/product/inward/components/inwardtable/index';
import { Link } from 'react-router-dom';
import { Putawaytable } from 'layouts/ecommerce/product/inward/components/putawaytable/index';
import { Rejectiontable } from './components/rejectiontable';
import { isSmallScreen } from '../../Common/CommonFunction';
import { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import BottomNavbar from '../../../../examples/Navbars/BottomNavbarMob';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import MobileNavbar from '../../../../examples/Navbars/MobileNavbar/mobile-navbar-drawer';
import RepackingTable from './components/repacking/index.js';
import SoftBox from 'components/SoftBox';
import SoftButton from 'components/SoftButton';
import SoftTypography from 'components/SoftTypography';

const Inward = () => {
  const userRoles = JSON.parse(localStorage.getItem('user_roles'));
  // const superAdmin = userRoles?.find((item) => item == 'SUPER_ADMIN' || item == 'RETAIL_ADMIN');
  //mobile responsivenss

  const isMobileDevice = isSmallScreen();

  const permissions = JSON.parse(localStorage.getItem('permissions'));

  const [tab, setTab] = useState(
    JSON.parse(localStorage.getItem('tabControlForInwardPutaway')) || {
      tab1: false,
      tab2: false,
      tab3: false,
      tab4: true,
    },
  );
  //mobile tab
  const [value, setValue] = useState('inward');

  const changesTab = (a, b, c, d) => {
    setTab({
      tab1: a,
      tab2: b,
      tab3: c,
      tab4: d,
    });
  };

  useEffect(() => {
    if (localStorage.getItem('handleTabForPutAway')) {
      setTab({
        tab1: false,
        tab2: false,
        tab3: true,
        tab4: false,
      });
      localStorage.removeItem('handleTabForPutAway');
    }
    if (localStorage.getItem('handleTabOnCancelPutaway')) {
      setTab({
        tab1: false,
        tab2: false,
        tab3: true,
        tab4: false,
      });
      localStorage.removeItem('handleTabOnCancelPutaway');
    }
    if (localStorage.getItem('poNumber')) {
      localStorage.removeItem('poNumber');
    }
    if (localStorage.getItem('sessionId')) {
      localStorage.removeItem('sessionId');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tabControlForInwardPutaway', JSON.stringify(tab));
  }, [tab]);

  useEffect(() => {
    const tabPersist = JSON.parse(localStorage.getItem('tabControlForInwardPutaway'));

    // console.log('tabPersistOnMount', tabPersist);

    if (tabPersist !== null || tabPersist !== undefined) {
      setTab(tabPersist);
    } else {
      localStorage.setItem('tabControlForInwardPutaway', JSON.stringify(tab));
    }
  }, []);

  // TO clear the local storage key for tabPersist
  useEffect(() => {
    const tabPersist = JSON.parse(localStorage.getItem('tabControlForInwardPutaway'));

    if (tabPersist !== null || tabPersist !== undefined) {
      setTimeout(() => {
        localStorage.removeItem('tabControlForInwardPutaway');
      }, 50000);
    }
  }, []);

  return (
    <DashboardLayout>
      {!isMobileDevice && <DashboardNavbar />}
      <SoftBox
        className={`${
          isMobileDevice
            ? ''
            : // 'softbox-box-shadow'
              'search-bar-filter-and-table-container'
        }`}
        // style={{ padding: isMobileDevice ? '0px' : '15px' }}
      >
        {!isMobileDevice && (
          <SoftBox
            className={`${isMobileDevice ? '' : 'list-div-heading-inward search-bar-filter-container'}`}
            sx={{
              padding: isMobileDevice && '10px 15px 10px 15px',
              // bgcolor: 'var(--search-bar-filter-container-bg)',
              // borderTopLeftRadius: '10px',
              // borderTopRightRadius: '10px',
              flexWrap: 'wrap',
              marginBottom: isMobileDevice ? (tab.tab1 ? '40px' : '0px') : '0px',
            }}
          >
            {/* {isMobileDevice && (
            <MobileNavbar title={'Repacking'}/>
          )} */}
            <SoftBox className={'filter-div-inward'}>
              {!isMobileDevice ? (
                <>
                  <SoftTypography
                    className={
                      tab.tab4 ? (isMobileDevice ? 'filter-div-tag-mob' : 'filter-div-tag') : 'filter-div-paid'
                    }
                    varient="h6"
                    onClick={() => changesTab(false, false, false, true)}
                    sx={{
                      color: isMobileDevice ? 'white !important' : '#344767',
                    }}
                  >
                    Repacking
                  </SoftTypography>
                </>
              ) : (
                <>
                  {/* <SoftTypography
                  className={tab.tab4 ? (isMobileDevice ? 'filter-div-tag-mob' : 'filter-div-tag') : 'filter-div-paid'}
                  varient="h6"
                  onClick={() => changesTab(false, false, false, true)}
                  sx={{
                    color: isMobileDevice ? 'white !important' : '#344767',
                  }}
                >
                  Repacking
                </SoftTypography> */}
                </>
              )}
            </SoftBox>
            <SoftBox className="content-center">
              {!isMobileDevice && tab.tab4 ? (
                <SoftBox
                  className={`${isMobileDevice && 'new-btn-inward'}`}
                  sx={{
                    display:
                      permissions?.RETAIL_Products?.WRITE ||
                      permissions?.WMS_Products?.WRITE ||
                      permissions?.VMS_Products?.WRITE
                        ? 'block'
                        : 'none',
                  }}
                >
                  <Link to="/inventory/repacking/create">
                    <SoftButton
                      // variant="insideHeader"
                      variant="solidWhiteBackground"
                      className={`inward-new-text ${isMobileDevice ? 'preview-mob-btn inward-new-btn' : ''}`}
                    >
                      <AddIcon sx={{ fontSize: isMobileDevice && '1rem !important' }} /> {isMobileDevice ? '' : 'New'}
                    </SoftButton>
                  </Link>
                </SoftBox>
              ) : (
                ''
              )}

              {/* inward filter  */}
              {/* {!isMobileDevice && tab.tab1 && <InwardFilter />}  */}

              {/* rejection filter */}
              {/* {!isMobileDevice && tab.tab2 && <RejectionFilter/>} */}

              {/* putaway filter */}
              {/* {!isMobileDevice && tab.tab3 && <PutawayFilter/>} */}
            </SoftBox>
          </SoftBox>
        )}
        {/* {tab.tab1 ? <Inwardtable /> : null}
        {tab.tab2 ? <Rejectiontable /> : null}
        {tab.tab3 ? <Putawaytable /> : null} */}
        {tab.tab4 ? <RepackingTable /> : null}
      </SoftBox>
      {/* {isMobileDevice && <BottomNavbar />} */}
    </DashboardLayout>
  );
};
export default Inward;
