import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import InventoryIcon from '@mui/icons-material/Inventory';
import QrCodeScannerRoundedIcon from '@mui/icons-material/QrCodeScannerRounded';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import StoreRoundedIcon from '@mui/icons-material/StoreRounded';
import { Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SoftBox from '../../../components/SoftBox';
import { useSnackbar } from '../../../hooks/SnackbarProvider';
import './bottom-navbar.css';
// import BarcodeScannerComponent from 'react-qr-barcode-scanner';
import { emit, useNativeMessage } from 'react-native-react-bridge/lib/web';
import { setAllProductsFilter, useSoftUIController } from '../../../context';

const BottomNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const showSnackbar = useSnackbar();
  const { pathname } = location;
  const contextType = localStorage.getItem('contextType');
  const [scanning, setScanning] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(window.scrollY);
  const [controller, dispatch] = useSoftUIController();
  // const { allProductsFilter } = controller;

  const onNavTabClickHandler = (navTabValue, navRoute) => {
    if (contextType !== null) {
      navigate(navRoute);
    } else {
      showSnackbar('Please Select a Location First', 'error');
    }
  };

  const handleBarcodeScan = () => {
    emit({ type: 'scanner' });
    // if (result) {
    //   setScanning(false);
    //   const contextData = {
    //     barcodeNumber: [result?.text],
    //   };
    //   setAllProductsFilter(dispatch, contextData);
    //   navigate('/products/all-products', {
    //     state: {
    //       gtin: result?.text,
    //       scanned: true,
    //     },
    //   });
    // }
  };

  useNativeMessage((message) => {
    const data = JSON.parse(message?.data);
    if (message?.type === 'gtin') {
      setScanning(false);
      const contextData = {
        barcodeNumber: [data?.gtin],
      };
      setAllProductsFilter(dispatch, contextData);
      navigate('/products/all-products', {
        state: {
          gtin: data?.gtin,
          scanned: true,
        },
      });
    }
  });

  const handleScroll = () => {
    const currentScrollPos = window.scrollY;
    const isScrollingUp = prevScrollPos > currentScrollPos;

    setIsVisible(isScrollingUp || currentScrollPos < 400); // Showing navbar when at the top or scrolling up
    setPrevScrollPos(currentScrollPos);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [prevScrollPos]);

  const bottomNavArray = [
    { navName: 'Home', navRoute: '/dashboards/RETAIL', navIcon: <HomeRoundedIcon className="bottom-nav-icon" /> },
    { navName: 'Stores', navRoute: '/AllOrg_loc', navIcon: <StoreRoundedIcon className="bottom-nav-icon" /> },
    { navName: 'Scanner', navRoute: '', navIcon: <></> },
    { navName: 'Products', navRoute: '/products/all-products', navIcon: <InventoryIcon className="bottom-nav-icon" /> },
    { navName: 'PI', navRoute: '/purchase/purchase-indent', navIcon: <ShoppingBagIcon className="bottom-nav-icon" /> },
  ];
  return (
    <SoftBox className={`bottom-navbar-main-div ${isVisible && 'scrollingBottomNavbar'}`}>
      {bottomNavArray.map((nav) => {
        return (
          <>
            {nav?.navName === 'Scanner' ? (
              <SoftBox className={`scanner-div`} onClick={handleBarcodeScan}>
                <QrCodeScannerRoundedIcon className="scanner-icon" />
              </SoftBox>
            ) : (
              <SoftBox
                className={`nav-maindiv ${nav?.navRoute === pathname && 'nav-active'}`}
                sx={{
                  borderRadius:
                    pathname === '/purchase/purchase-indent'
                      ? '0px 32px 0 0'
                      : pathname === '/dashboards/RETAIL' && '32px 0 0 0',
                }}
                onClick={() => onNavTabClickHandler(nav?.navName, nav?.navRoute)}
              >
                {nav?.navIcon}
                <Typography className="navTabName">{nav?.navName}</Typography>
              </SoftBox>
            )}
          </>
        );
      })}
      {/* <Drawer
        anchor="left"
        open={scanning}
        onClose={() => setScanning(false)}
        PaperProps={{
          sx: {
            height: '100%',
            width: '100%',
          },
        }}
      >
        <BarcodeScannerComponent
          width="100%"
          height="100%"
          // onUpdate={(err, result) => handleBarcodeScan(err, result)}
        />
      </Drawer> */}
    </SoftBox>
  );
};

export default BottomNavbar;
