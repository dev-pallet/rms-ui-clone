import { useState } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const handleNoPermission = (navigate) => {
  const isMobileDevice = window.innerWidth < 768;
  Swal.fire({
    icon: 'error',
    title: 'You do not have access to this page',
    showConfirmButton: isMobileDevice ? false : true,
    confirmButtonText: 'OK',
  }).then(() => {
    window.history.back();
  });
  return null;
};

const handleNoAT = (navigate) => {
  const isMobileDevice = window.innerWidth < 768;
  Swal.fire({
    icon: 'error',
    title: 'You do not have access to this page',
    showConfirmButton: isMobileDevice ? false : true,
    confirmButtonText: 'OK',
  }).then(() => {
    navigate('/');
  });
  return null;
};
const handleNoORGID = (navigate) => {
  const isMobileDevice = window.innerWidth < 768;
  Swal.fire({
    icon: 'error',
    title: 'You do not have access to this page, Select your organization',
    showConfirmButton: isMobileDevice ? false : true,
    confirmButtonText: 'OK',
  }).then(() => {
    if (!isMobileDevice) navigate('/AllOrg_loc');
  });
  return null;
};

const permissions = JSON.parse(localStorage.getItem('permissions'));

// NO AT
export const ProtectedNoAT = () => {
  const [manager, setmaneger] = useState(localStorage.getItem('access_token'));
  const navigate = useNavigate();

  return manager ? <Outlet /> : handleNoAT(navigate);
};

// NO OrgId
export const ProtectedNoORGID = () => {
  const [manager, setmaneger] = useState(localStorage.getItem('orgId'));
  const navigate = useNavigate();

  return manager ? <Outlet /> : handleNoORGID(navigate);
};
// CUSTOMERS
export const ProtectedCustomersRoute = () => {
  const [manager, setmaneger] = useState(
    permissions?.RETAIL_Customers?.READ
      ? true
      : null || permissions?.WMS_Customers?.READ
      ? true
      : null || permissions?.VMS_Customers?.READ
      ? true
      : null,
  );
  const navigate = useNavigate();

  return manager ? <Outlet /> : handleNoPermission(navigate);
};
export const ProtectedCustomersWrite = () => {
  const [manager, setmaneger] = useState(
    permissions?.RETAIL_Customers?.WRITE
      ? true
      : null || permissions?.WMS_Customers?.WRITE
      ? true
      : null || permissions?.VMS_Customers?.WRITE
      ? true
      : null,
  );
  const navigate = useNavigate();

  return manager ? <Outlet /> : handleNoPermission(navigate);
};

// DASHBOARD
export const ProtectedDashboardRoute = () => {
  const [manager, setmaneger] = useState(
    permissions?.RETAIL_Dashboard?.READ
      ? true
      : null || permissions?.WMS_Dashboard?.READ
      ? true
      : null || permissions?.VMS_Dashboard?.READ
      ? true
      : null,
  );
  const navigate = useNavigate();

  return manager ? <Outlet /> : handleNoPermission(navigate);
};

// MARKETPLACE
export const ProtectedMarketplaceRoute = () => {
  const [manager, setmaneger] = useState(
    permissions?.RETAIL_Marketplace?.READ
      ? true
      : null || permissions?.WMS_Marketplace?.READ
      ? true
      : null || permissions?.VMS_Marketplace?.READ
      ? true
      : null,
  );
  const navigate = useNavigate();

  return manager ? <Outlet /> : handleNoPermission(navigate);
};
export const ProtectedMarketplaceWriteRoute = () => {
  const [manager, setmaneger] = useState(
    permissions?.RETAIL_Marketplace?.WRITE
      ? true
      : null || permissions?.WMS_Marketplace?.WRITE
      ? true
      : null || permissions?.VMS_Marketplace?.WRITE
      ? true
      : null,
  );
  const navigate = useNavigate();

  return manager ? <Outlet /> : handleNoPermission(navigate);
};

// PRODUCT
export const ProtectedProductRoute = () => {
  const [manager, setmaneger] = useState(
    permissions?.RETAIL_Products?.READ
      ? true
      : null || permissions?.WMS_Products?.READ
      ? true
      : null || permissions?.VMS_Products?.READ
      ? true
      : null,
  );
  const navigate = useNavigate();

  return manager ? <Outlet /> : handleNoPermission(navigate);
};
export const ProtectedProductWrite = () => {
  const [manager, setmaneger] = useState(
    permissions?.RETAIL_Products?.WRITE
      ? true
      : null || permissions?.WMS_Products?.WRITE
      ? true
      : null || permissions?.VMS_Products?.WRITE
      ? true
      : null,
  );
  const navigate = useNavigate();

  return manager ? <Outlet /> : handleNoPermission(navigate);
};

// PURCHASE
export const ProtectedPurchaseRoute = () => {
  const [manager, setmaneger] = useState(
    permissions?.RETAIL_Purchase?.READ
      ? true
      : null || permissions?.WMS_Purchase?.READ
      ? true
      : null || permissions?.VMS_Purchase?.READ
      ? true
      : null,
  );
  const navigate = useNavigate();

  return manager ? <Outlet /> : handleNoPermission(navigate);
};
export const ProtectedPurchaseWrite = () => {
  const [manager, setmaneger] = useState(
    permissions?.RETAIL_Purchase?.WRITE
      ? true
      : null || permissions?.WMS_Purchase?.WRITE
      ? true
      : null || permissions?.VMS_Purchase?.WRITE
      ? true
      : null,
  );
  const navigate = useNavigate();

  return manager ? <Outlet /> : handleNoPermission(navigate);
};

// SALES ORDER
export const ProtectedSalesOrderRoute = () => {
  const [manager, setmaneger] = useState(
    permissions?.RETAIL_SalesOrder?.READ
      ? true
      : null || permissions?.WMS_SalesOrder?.READ
      ? true
      : null || permissions?.VMS_SalesOrder?.READ
      ? true
      : null,
  );
  const navigate = useNavigate();

  return manager ? <Outlet /> : handleNoPermission(navigate);
};
export const ProtectedSalesOrderWrite = () => {
  const [manager, setmaneger] = useState(
    permissions?.RETAIL_SalesOrder?.WRITE
      ? true
      : null || permissions?.WMS_SalesOrder?.WRITE
      ? true
      : null || permissions?.VMS_SalesOrder?.WRITE
      ? true
      : null,
  );
  const navigate = useNavigate();

  return manager ? <Outlet /> : handleNoPermission(navigate);
};

// AppsIntegration
export const ProtectedAppsIntegrationRoute = () => {
  const [manager, setmaneger] = useState(
    permissions?.RETAIL_AppsIntegration?.READ
      ? true
      : null || permissions?.WMS_AppsIntegration?.READ
      ? true
      : null || permissions?.VMS_AppsIntegration?.READ
      ? true
      : null || permissions?.RETAIL_AppsIntegration?.WRITE
      ? true
      : null || permissions?.WMS_AppsIntegration?.WRITE
      ? true
      : null || permissions?.VMS_SalesOrder?.WRITE
      ? true
      : null,
  );
  const navigate = useNavigate();

  return manager ? <Outlet /> : handleNoPermission(navigate);
};
export const ProtectedAppsIntegrationWrite = () => {
  const [manager, setmaneger] = useState(
    permissions?.RETAIL_AppsIntegration?.WRITE
      ? true
      : null || permissions?.WMS_AppsIntegration?.WRITE
      ? true
      : null || permissions?.VMS_SalesOrder?.WRITE
      ? true
      : null,
  );
  const navigate = useNavigate();

  return manager ? <Outlet /> : handleNoPermission(navigate);
};

// SETTINGS
export const ProtectedSettingsRoute = () => {
  const [manager, setmaneger] = useState(
    permissions?.RETAIL_Settings?.READ
      ? true
      : null || permissions?.WMS_Settings?.READ
      ? true
      : null || permissions?.VMS_Settings?.READ
      ? true
      : null,
  );
  const navigate = useNavigate();

  return manager ? <Outlet /> : handleNoPermission(navigate);
};

// PRODUCTION
export const ProtectedProductionRoute = () => {
  const [manager, setmaneger] = useState(
    permissions?.RETAIL_Production?.READ
      ? true
      : null || permissions?.WMS_Production?.READ
      ? true
      : null || permissions?.VMS_Production?.READ
      ? true
      : null,
  );
  const navigate = useNavigate();

  return manager ? <Outlet /> : handleNoPermission(navigate);
};

//PROTECTED HEADOFFICE ROUTES
