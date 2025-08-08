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

/** 
  All of the routes for the Soft UI Dashboard PRO React are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the Sidenav.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that contains other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/

// Soft UI Dashboard PRO React layouts
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import AppsIcon from '@mui/icons-material/Apps';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import CampaignIcon from '@mui/icons-material/Campaign';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import HouseIcon from '@mui/icons-material/House';
import InfoIcon from '@mui/icons-material/Info';
import InventoryIcon from '@mui/icons-material/Inventory';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MovingIcon from '@mui/icons-material/Moving';
import PaymentIcon from '@mui/icons-material/Payment';
import PaymentsIcon from '@mui/icons-material/Payments';
import PeopleIcon from '@mui/icons-material/People';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import SettingsIcon from '@mui/icons-material/Settings';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import SoapIcon from '@mui/icons-material/Soap';
import StoreIcon from '@mui/icons-material/Store';
import ViewCarouselIcon from '@mui/icons-material/ViewCarousel';
import Default from 'layouts/dashboards/default';
import Customer from 'layouts/ecommerce/customer';
import Diagnostics from 'layouts/ecommerce/diagnostics';
import { MarketPlace } from 'layouts/ecommerce/market-place/market-place';
import { AllProducts } from 'layouts/ecommerce/product/all-products/all-products';
import { Inventory } from 'layouts/ecommerce/product/inventory/inventory';
import Production from 'layouts/ecommerce/product/production';
import Purchasebills from 'layouts/ecommerce/purchase-bills';
import PurchaseIndent from 'layouts/ecommerce/purchase-indent';
import Purchasemain from 'layouts/ecommerce/purchase-main';
import { Reports } from 'layouts/ecommerce/reports/index';
import Userroles from 'layouts/ecommerce/users-roles';
import Vendor from 'layouts/ecommerce/vendor';
import SellerBrands from './Sellers/SellerBrands';
import HeadOfficeDefault from './layouts/dashboards/head-office';
import PalletPaySettings from './layouts/ecommerce/Pallet-pay/PalletPaySettings';
import PalletPaySettlement from './layouts/ecommerce/Pallet-pay/PalletPaySettlement';
import PalletPayDashboard from './layouts/ecommerce/Pallet-pay/PalletPaydashboard';
import TotalTransaction from './layouts/ecommerce/Pallet-pay/components/totalTransaction';
import Appslist from './layouts/ecommerce/apps-integration';
import InstalledApps from './layouts/ecommerce/apps-integration/InstalledApp';
import ReportsInstalledApps from './layouts/ecommerce/apps-integration/ReportsInstalledApps';
import SalesChannelApps from './layouts/ecommerce/apps-integration/SalesChannelApps';
import ManageSellers from './layouts/ecommerce/headoffice-sellers/Manage-sellers';
import SellerOverview from './layouts/ecommerce/headoffice-sellers/seller-overview';
import ManageStore from './layouts/ecommerce/headoffice-store/manage-store';
import StoreOverview from './layouts/ecommerce/headoffice-store/store-overview';
import { ABCAnalysis } from './layouts/ecommerce/inventory/abc-analysis';
import { ExpiryManagement } from './layouts/ecommerce/inventory/expiry-management';
import { StockAdjustment } from './layouts/ecommerce/inventory/stock-adjustment';
import { StockBalance } from './layouts/ecommerce/inventory/stock-balance';
import { StockCount } from './layouts/ecommerce/inventory/stock-count';
import { StockTransfer } from './layouts/ecommerce/inventory/stock-transfer';
import SettingHelpSupport from './layouts/ecommerce/knowledge-base';
import AllLayouts from './layouts/ecommerce/layout/components/all-layouts';
import MapperLocation from './layouts/ecommerce/location/mapperLocation';
import { PurchaseHistory } from './layouts/ecommerce/market-place/components/purchase-history';
import Migration from './layouts/ecommerce/migration';
import OfferAndPromoList from './layouts/ecommerce/offers-promo';
import DeliveryAgent from './layouts/ecommerce/pallet-hyperlocal/delivery-agent';
import EcommerceB2Cui from './layouts/ecommerce/pallet-hyperlocal/ecommerce';
import ServiceabilityHyperlocal from './layouts/ecommerce/pallet-hyperlocal/serviceability';
import ProductApproval from './layouts/ecommerce/product/bundleProduct/Approvals/ProductApproval';
import Inward from './layouts/ecommerce/product/inward';
import ProductLabel from './layouts/ecommerce/product/price-label';
import ProductsMainPage from './layouts/ecommerce/products-new-page';
import PurchaseExclusive from './layouts/ecommerce/purchase-exclusive';
import PurchaseReturns from './layouts/ecommerce/purchase-returns';
import AllSalesorders from './layouts/ecommerce/sales-order/new-sales';
import SalesPaymentComponent from './layouts/ecommerce/sales-order/payments';
import SalesOrderReturns from './layouts/ecommerce/sales-order/returns';
import Purchase from './layouts/ecommerce/sales/purchase';
import Returns from './layouts/ecommerce/sales/returns';
import MapperOrg from './layouts/ecommerce/setting/mapper';
import HrmsEmployee from './layouts/ecommerce/hrms/employee';

import DomainIcon from '@mui/icons-material/Domain';
import MapperOrganization from './layouts/ecommerce/setting/newRetail';
import { Test } from './layouts/test';
import SettingKnowledgeBase from './layouts/ecommerce/knowledge-base';
import GroupsIcon from '@mui/icons-material/Groups';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import EventNoteIcon from '@mui/icons-material/EventNote';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

import HrmsMaster from './layouts/ecommerce/hrms/master';
import HrmsHoliday from './layouts/ecommerce/hrms/holiday';

import Project from './layouts/ecommerce/Project/TicketListing';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import OverSold from './layouts/ecommerce/inventory/oversold';
import CreditNoteTransferListing from './layouts/ecommerce/credit-note-transfer';
import ProductListingRouter from './layouts/ecommerce/product/ProductListingRouter';
import CombosListing from './layouts/ecommerce/products-new-page/Combos/CombosListing';

const permissions = JSON.parse(localStorage.getItem('permissions'));
const contextType = localStorage.getItem('contextType');
const isProduction = process.env.NODE_ENV === 'production';
const isHeadOffice = localStorage.getItem('isHeadOffice');
const user_roles = localStorage.getItem('user_roles');
const isRestaurant = localStorage.getItem('retailType') === 'RESTAURANT'

const features = localStorage.getItem('featureSettings');
const featureSettings = features ? JSON.parse(features) : null;

const isEnterPrise = localStorage.getItem('isEnterprise');

const resultApp = localStorage.getItem('Apps');
const resultArray = resultApp?.split(',') || [];

const allRoutes = [
  {
    ...(permissions?.RETAIL_Dashboard?.READ ||
    permissions?.WMS_Dashboard?.READ ||
    permissions?.VMS_Dashboard?.READ ||
    permissions?.HO_Dashboard?.READ
      ? {
          type: 'collapse',
          name: 'Home',
          key: 'dashboards',
          route: `/dashboards/${contextType}`,
          icon: <HouseIcon />,
          noCollapse: true,
          component: isHeadOffice === 'true' ? <HeadOfficeDefault /> : <Default />,
          layout: 'dashboard',
          read:
            permissions?.RETAIL_Dashboard?.READ ||
            permissions?.WMS_Dashboard?.READ ||
            permissions?.VMS_Dashboard?.READ ||
            permissions?.HO_Dashboard?.READ,
        }
      : null),
  },

  {
    ...(permissions?.HO_Stores?.READ
      ? {
          type: 'collapse',
          name: 'Stores',
          key: 'stores',
          route: ``,
          icon: <StoreIcon />,
          // component: <Default />,
          layout: 'dashboard',
          collapse: [
            {
              name: 'Overview',
              key: 'store-overview',
              route: '/stores/store-overview',
              component: <StoreOverview />,
              layout: 'dashboard',
              read: permissions?.HO_Stores?.READ,
            },
            {
              // name: parse(`<img src=${crownIcon} style="height:1.5rem" /> Product Label`),
              name: 'Manage Store',
              key: 'manage-store',
              route: '/stores/manage-store',
              component: <ManageStore />,
              layout: 'dashboard',
              read: permissions?.HO_Stores?.READ,
            },
          ],
          read: permissions?.HO_Stores?.READ,
        }
      : null),
  },
  {
    ...(permissions?.HO_Sellers?.READ
      ? {
          type: 'collapse',
          name: 'Sellers',
          key: 'sellers',
          route: ``,
          icon: <AddBusinessIcon />,
          component: <Default />,
          layout: 'dashboard',
          collapse: [
            {
              name: 'Overview',
              key: 'sellers-overview',
              route: '/sellers/sellers-overview',
              component: <SellerOverview />,
              layout: 'dashboard',
              read: permissions?.HO_Sellers?.READ,
            },
            {
              // name: parse(`<img src=${crownIcon} style="height:1.5rem" /> Product Label`),
              name: 'Manage Sellers',
              key: 'manage-sellers',
              route: '/sellers/manage-sellers',
              component: <Vendor headOffice={true} />,
              layout: 'dashboard',
              read: permissions?.HO_Sellers?.READ,
            },
            {
              // name: parse(`<img src=${crownIcon} style="height:1.5rem" /> Product Label`),
              name: 'Brands',
              key: 'brands',
              route: '/sellers/brands',
              component: <SellerBrands />,
              layout: 'dashboard',
              read: permissions?.HO_Sellers?.READ,
            },
          ],
          read: permissions?.HO_Sellers?.READ,
        }
      : null),
  },
  {
    ...(permissions?.RETAIL_Products?.READ ||
    permissions?.WMS_Products?.READ ||
    permissions?.VMS_Products?.READ ||
    permissions?.HO_Products?.READ
      ? {
          type: 'collapse',
          name: 'Products',
          key: 'products',
          // route: '/products/product-master',
          // component: <ProductsMainPage />,
          icon: <LocalOfferIcon />,
          layout: 'dashboard',
          read:
            permissions?.RETAIL_Products?.READ ||
            permissions?.WMS_Products?.READ ||
            permissions?.VMS_Products?.READ ||
            permissions?.HO_Products?.READ,
          collapse: [
            {
              name: 'Brands',
              key: 'brands',
              route: '/sellers/brands',
              component: <ManageSellers />,
              layout: 'dashboard',
              read: permissions?.VMS_Products?.READ,
            },

            {
              name: 'All products',
              key: 'all-products',
              route: '/products/all-products',
              component: <ProductListingRouter />,
              layout: 'dashboard',
              read:
                permissions?.RETAIL_Products?.READ ||
                permissions?.WMS_Products?.READ ||
                permissions?.VMS_Products?.READ,
            },
            {
              name: isRestaurant ? 'Combos' : 'Bundles',
              key: isRestaurant ? 'all-combos' : 'all-bundle-products',
              route: isRestaurant ? '/products/all-combos' : '/products/all-bundle-products',
              component: isRestaurant ? <CombosListing /> : <AllProducts isBundle={true} />,
              // component: <ProductApproval />,
              layout: 'dashboard',
              read:
                permissions?.RETAIL_Products?.READ ||
                permissions?.WMS_Products?.READ ||
                permissions?.VMS_Products?.READ,
            },
            {
              name: 'Approvals',
              key: 'approvals',
              route: '/products/approvals',
              component: <ProductApproval />,
              layout: 'dashboard',
              read:
                permissions?.RETAIL_Products?.READ ||
                permissions?.WMS_Products?.READ ||
                permissions?.VMS_Products?.READ,
            },
            {
              name: 'Categories',
              key: 'categories',
              route: '/products/categories',
              component: null,
              layout: 'dashboard',
              read: permissions?.HO_Products?.READ,
            },
            {
              name: 'Products',
              key: 'products',
              route: '/products/products',
              component: null,
              layout: 'dashboard',
              read: permissions?.HO_Products?.READ,
            },
            {
              // name: parse(`<img src=${crownIcon} style="height:1.5rem" /> Product Label`),
              // key: 'product-label',
              name: 'Labels',
              key: 'product-label',
              route: '/products/product-label',
              component: <ProductLabel />,
              layout: 'dashboard',
              read: permissions?.RETAIL_Products?.READ || permissions?.WMS_Products?.READ,
            },
            // {
            //   name: 'Bulk Upload',
            //   key: 'bulk-products',
            //   route: '/products/bulk-products',
            //   component: <BulkProductHistory />,
            //   layout: 'dashboard',
            //   read: permissions?.RETAIL_Products?.READ || permissions?.WMS_Products?.READ,
            // },
            // {
            //   name: 'Pricing',
            //   key: 'pricing',
            //   route: '/products/pricing',
            //   component: <BulkPriceEdit />,
            //   layout: 'dashboard',
            //   read: permissions?.RETAIL_Products?.READ || permissions?.WMS_Products?.READ,
            // },
            {
              name: 'Masters',
              key: 'product-master',
              route: '/products/product-master',
              component: <ProductsMainPage />,
              layout: 'dashboard',
              read:
                permissions?.RETAIL_Products?.READ ||
                permissions?.WMS_Products?.READ ||
                permissions?.VMS_Products?.READ,
            },

            // {
            //   name: 'Stock Taking',
            //   key: 'stock-taking',
            //   route: '/products/stock-taking',
            //   component: <StockCountDetails />,
            //   layout: 'dashboard',
            //   read:
            //     permissions?.RETAIL_Products?.READ ||
            //     permissions?.WMS_Products?.READ ||
            //     permissions?.VMS_Products?.READ,
            // },
          ],
        }
      : null),
  },
  {
    ...(permissions?.RETAIL_Products?.READ ||
    permissions?.WMS_Products?.READ ||
    permissions?.VMS_Products?.READ ||
    permissions?.HO_Products?.READ
      ? {
          type: 'collapse',
          name: 'Inventory',
          key: 'inventory',
          // route: '/products/product-master',
          // component: <ProductsMainPage />,
          icon: <InventoryIcon />,
          layout: 'dashboard',
          read:
            permissions?.RETAIL_Products?.READ ||
            permissions?.WMS_Products?.READ ||
            permissions?.VMS_Products?.READ ||
            permissions?.HO_Products?.READ,
          collapse: [
            // {
            //   name: 'Inward',
            //   key: 'inward',
            //   route: '/inventory/inward',
            //   component: <Inward />,
            //   layout: 'dashboard',
            //   read: permissions?.RETAIL_Products?.READ || permissions?.WMS_Products?.READ,
            // },
            // {
            //   name: 'Inventory',
            //   key: 'inventory',
            //   route: '/inventory/inventory',
            //   component: <Inventory />,
            //   layout: 'dashboard',
            //   read:
            //     permissions?.RETAIL_Products?.READ ||
            //     permissions?.WMS_Products?.READ ||
            //     permissions?.VMS_Products?.READ ||
            //     permissions?.HO_Products?.READ,
            // },
            {
              name: 'Stock Count',
              key: 'stock-count',
              route: '/inventory/stock-count',
              component: <StockCount />,
              layout: 'dashboard',
              read:
                permissions?.RETAIL_Products?.READ ||
                permissions?.WMS_Products?.READ ||
                permissions?.VMS_Products?.READ,
            },
            {
              name: 'Stock Balance',
              key: 'stock-balance',
              route: '/inventory/stock-balance',
              component: <StockBalance />,
              layout: 'dashboard',
              read:
                permissions?.RETAIL_Products?.READ ||
                permissions?.WMS_Products?.READ ||
                permissions?.VMS_Products?.READ ||
                permissions?.HO_Products?.READ,
            },
            {
              name: 'Oversold',
              key: 'oversold',
              route: '/inventory/oversold',
              component: <OverSold />,
              layout: 'dashboard',
              read:
                permissions?.RETAIL_Products?.READ ||
                permissions?.WMS_Products?.READ ||
                permissions?.VMS_Products?.READ ||
                permissions?.HO_Products?.READ,
            },
            {
              name: 'Adjustments',
              key: 'stock-adjustment',
              route: '/inventory/stock-adjustment',
              component: <StockAdjustment />,
              layout: 'dashboard',
              read:
                permissions?.RETAIL_Products?.READ ||
                permissions?.WMS_Products?.READ ||
                permissions?.VMS_Products?.READ,
            },
            {
              name: 'Stock Transfer',
              key: 'stock-transfer',
              route: '/inventory/stock-transfer',
              component: <StockTransfer />,
              layout: 'dashboard',
              read: permissions?.RETAIL_Products?.READ || permissions?.WMS_Products?.READ,
            },
            {
              name: 'Expiry Management',
              key: 'expiry-management',
              route: '/inventory/expiry-management',
              component: <ExpiryManagement />,
              layout: 'dashboard',
              read: permissions?.RETAIL_Products?.READ || permissions?.WMS_Products?.READ,
            },
            {
              name: 'ABC Analysis',
              key: 'abc-analysis',
              route: '/inventory/abc-analysis',
              component: <ABCAnalysis />,
              layout: 'dashboard',
              read: permissions?.RETAIL_Products?.READ || permissions?.WMS_Products?.READ,
            },
            {
              name: 'Repacking',
              key: 'repacking',
              route: '/inventory/repacking',
              component: <Inward />,
              layout: 'dashboard',
              read: permissions?.RETAIL_Products?.READ || permissions?.WMS_Products?.READ,
            },
          ],
        }
      : null),
  },
  {
    ...(permissions?.RETAIL_Purchase?.READ || permissions?.WMS_Purchase?.READ || permissions?.HO_Purchase?.READ
      ? {
          type: 'collapse',
          name: 'Purchase',
          key: 'purchase',
          icon: <ShoppingBagIcon />,
          layout: 'dashboard',
          read: permissions?.RETAIL_Purchase?.READ || permissions?.WMS_Purchase?.READ || permissions?.HO_Purchase?.READ,
          collapse: [
            {
              name: 'Vendors',
              key: 'vendors',
              route: '/purchase/vendors',
              component: <Vendor />,
              layout: 'dashboard',
              read: permissions?.RETAIL_Purchase?.READ || permissions?.WMS_Purchase?.READ,
            },
            {
              name: 'Purchase indent',
              key: 'purchase-indent',
              route: '/purchase/purchase-indent',
              component: <PurchaseIndent />,
              layout: 'dashboard',
              read:
                permissions?.RETAIL_Purchase?.READ || permissions?.WMS_Purchase?.READ || permissions?.HO_Purchase?.READ,
            },
            {
              name: 'Purchase orders',
              key: 'purchase-orders',
              route: '/purchase/purchase-orders',
              component: <Purchasemain />,
              layout: 'dashboard',
              read:
                permissions?.RETAIL_Purchase?.READ || permissions?.WMS_Purchase?.READ || permissions?.HO_Purchase?.READ,
            },
            {
              name: 'Inward (GRN)',
              key: 'express-grn',
              route: '/purchase/express-grn',
              component: <PurchaseExclusive />,
              layout: 'dashboard',
              read: permissions?.RETAIL_Purchase?.READ || permissions?.WMS_Purchase?.READ,
            },
            {
              name: 'Bills',
              key: 'purchase-bills',
              route: '/purchase/purchase-bills',
              component: <Purchasebills />,
              layout: 'dashboard',
              read:
                permissions?.RETAIL_Purchase?.READ || permissions?.WMS_Purchase?.READ || permissions?.HO_Purchase?.READ,
            },
            // {
            //   name: 'Payments Made',
            //   key: 'payments-made',
            //   route: '/purchase/payments-made',
            //   component: <Purchasemade />,
            //   layout: 'dashboard',
            //   read:
            //     permissions?.RETAIL_Purchase?.READ || permissions?.WMS_Purchase?.READ || permissions?.HO_Purchase?.READ,
            // },
            {
              name: 'Returns',
              key: 'purchase-returns',
              route: '/purchase/purchase-returns',
              component: <PurchaseReturns />,
              layout: 'dashboard',
              read:
                permissions?.RETAIL_Purchase?.READ || permissions?.WMS_Purchase?.READ || permissions?.HO_Purchase?.READ,
            },
            {
              name: 'Credit Note Transfer',
              key: 'credit-note-transfer',
              route: '/purchase/credit-note-transfer',
              component: <CreditNoteTransferListing />,
              layout: 'dashboard',
              read:
                permissions?.RETAIL_Purchase?.READ || permissions?.WMS_Purchase?.READ || permissions?.HO_Purchase?.READ,
            },
            // {
            //   name: 'Refunds',
            //   // name: isHeadOffice === 'true' ? 'Returns' : 'Refunds',
            //   key: 'refunds',
            //   route: '/ecommerce/refunds',
            //   component: <Referral />,
            //   layout: 'dashboard',
            //   read:
            //     permissions?.RETAIL_Purchase?.READ || permissions?.WMS_Purchase?.READ || permissions?.HO_Purchase?.READ,
            // },
          ],
        }
      : null),
  },

  {
    ...(permissions?.RETAIL_Customers?.READ || permissions?.WMS_Customers?.READ
      ? {
          type: 'collapse',
          name: 'Customers',
          key: 'customer',
          icon: <PeopleAltIcon />,
          route: '/customer',
          component: <Customer />,
          noCollapse: true,
          layout: 'dashboard',
          read: permissions?.RETAIL_Customers?.READ || permissions?.WMS_Customers?.READ,
        }
      : null),
  },
  {
    ...(permissions?.RETAIL_SalesOrder?.READ ||
    permissions?.WMS_SalesOrder?.READ ||
    permissions?.VMS_SalesOrder?.READ ||
    permissions?.HO_SalesOrder?.READ
      ? {
          type: 'collapse',
          name: 'Sales Order',
          key: 'sales',
          icon: <SoapIcon />,
          layout: 'dashboard',
          read:
            permissions?.RETAIL_SalesOrder?.READ ||
            permissions?.WMS_SalesOrder?.READ ||
            permissions?.VMS_SalesOrder?.READ ||
            permissions?.HO_SalesOrder?.READ,
          collapse: [
            {
              name: 'All orders',
              key: 'all-orders',
              route: '/sales/all-orders',
              // component: <Allorders />,
              component: <AllSalesorders />,
              layout: 'dashboard',
              read:
                permissions?.RETAIL_SalesOrder?.READ ||
                permissions?.WMS_SalesOrder?.READ ||
                permissions?.VMS_SalesOrder?.READ ||
                permissions?.HO_SalesOrder?.READ,
            },
            {
              name: 'Payments',
              key: 'payments',
              route: '/sales/payments',
              component: <SalesPaymentComponent />,
              layout: 'dashboard',
              read:
                permissions?.RETAIL_SalesOrder?.READ ||
                permissions?.WMS_SalesOrder?.READ ||
                permissions?.VMS_SalesOrder?.READ ||
                permissions?.HO_SalesOrder?.READ,
            },
            // {
            //   name: 'Payments received',
            //   key: 'payments-recieved',
            //   route: '/sales/payments-recieved',
            //   component: <Paymentreceived />,
            //   layout: 'dashboard',
            //   read:
            //     permissions?.RETAIL_SalesOrder?.READ ||
            //     permissions?.WMS_SalesOrder?.READ ||
            //     permissions?.VMS_SalesOrder?.READ ||
            //     permissions?.HO_SalesOrder?.READ,
            // },
            {
              name: 'Returns',
              key: 'returns',
              route: '/sales/returns',
              component: <SalesOrderReturns />,
              layout: 'dashboard',
              read:
                permissions?.RETAIL_SalesOrder?.READ ||
                permissions?.WMS_SalesOrder?.READ ||
                permissions?.VMS_SalesOrder?.READ ||
                permissions?.HO_SalesOrder?.READ,
            },
            {
              name: 'Refund',
              key: 'refund',
              route: '/sales/refund',
              component: <Returns />,
              // component: <Test />,
              layout: 'dashboard',
              read: permissions?.HO_SalesOrder?.READ,
            },
          ],
        }
      : null),
  },
  // {
  //   ...(permissions?.RETAIL_Products?.READ ||
  //   permissions?.WMS_Products?.READ ||
  //   permissions?.VMS_Products?.READ ||
  //   permissions?.HO_Products?.READ
  //     ? {
  //         type: 'collapse',
  //         name: 'Inventory',
  //         key: 'inventory',
  //         icon: <InventoryIcon />,
  //         layout: 'dashboard',
  //         read:
  //           permissions?.RETAIL_Products?.READ ||
  //           permissions?.WMS_Products?.READ ||
  //           permissions?.VMS_Products?.READ ||
  //           permissions?.HO_Products?.READ,
  //         collapse: [
  //           {
  //             name: 'Stock Count',
  //             key: 'stock-count',
  //             route: '/inventory/stock-count',
  //             component: <StockCount />,
  //             layout: 'dashboard',
  //             read:
  //               permissions?.RETAIL_Products?.READ ||
  //               permissions?.WMS_Products?.READ ||
  //               permissions?.VMS_Products?.READ,
  //           },
  //           {
  //             name: 'Stock Balance',
  //             key: 'stock-balance',
  //             route: '/inventory/stock-balance',
  //             component: <StockBalance />,
  //             layout: 'dashboard',
  //             read:
  //               permissions?.RETAIL_Products?.READ ||
  //               permissions?.WMS_Products?.READ ||
  //               permissions?.VMS_Products?.READ ||
  //               permissions?.HO_Products?.READ,
  //           },
  //           {
  //             name: 'Adjustments',
  //             key: 'stock-adjustment',
  //             route: '/inventory/stock-adjustment',
  //             component: <StockAdjustment />,
  //             layout: 'dashboard',
  //             read:
  //               permissions?.RETAIL_Products?.READ ||
  //               permissions?.WMS_Products?.READ ||
  //               permissions?.VMS_Products?.READ,
  //           },
  //           {
  //             name: 'Stock Transfer',
  //             key: 'stock-transfer',
  //             route: '/inventory/stock-transfer',
  //             component: <StockTransfer />,
  //             layout: 'dashboard',
  //             read: permissions?.RETAIL_Products?.READ || permissions?.WMS_Products?.READ,
  //           },
  //           {
  //             name: 'Expiry Management',
  //             key: 'expiry-management',
  //             route: '/inventory/expiry-management',
  //             component: <ExpiryManagement />,
  //             layout: 'dashboard',
  //             read: permissions?.RETAIL_Products?.READ || permissions?.WMS_Products?.READ,
  //           },
  //           {
  //             name: 'ABC Analysis',
  //             key: 'abc-analysis',
  //             route: '/inventory/abc-analysis',
  //             component: <ABCAnalysis />,
  //             layout: 'dashboard',
  //             read: permissions?.RETAIL_Products?.READ || permissions?.WMS_Products?.READ,
  //           },
  //           {
  //             name: 'Repacking',
  //             key: 'repacking',
  //             route: '/inventory/repacking',
  //             component: <Inward />,
  //             layout: 'dashboard',
  //             read: permissions?.RETAIL_Products?.READ || permissions?.WMS_Products?.READ,
  //           },
  //         ],
  //       }
  //     : null),
  // },
  {
    ...(permissions?.RETAIL_Marketplace?.READ || permissions?.WMS_Marketplace?.READ
      ? {
          type: 'collapse',
          name: 'Marketplace',
          key: 'market-place',
          icon: <StoreIcon />,
          layout: 'dashboard',
          read:
            permissions?.RETAIL_Marketplace?.READ ||
            permissions?.WMS_Marketplace?.READ ||
            permissions?.HO_Marketplace?.READ,
          collapse: [
            {
              name: 'Products',
              key: 'products',
              route: '/market-place/products',
              component: <MarketPlace />,
              layout: 'dashboard',
              read:
                permissions?.RETAIL_Marketplace?.READ ||
                permissions?.WMS_Marketplace?.READ ||
                permissions?.HO_Marketplace?.READ,
            },
            // {
            //   name: 'Pallet hardware',
            //   key: 'pallet-hardware',
            //   route: '/market-place/pallet-hardware',
            //   component: <Test />,
            //   layout: 'dashboard',
            //   read:
            //     permissions?.RETAIL_Marketplace?.READ ||
            //     permissions?.WMS_Marketplace?.READ || permissions?.HO_Marketplace?.READ ,
            // },
            {
              name: 'Purchase history',
              key: 'purchase-history',
              route: '/market-place/purchase-history',
              component: <PurchaseHistory />,
              layout: 'dashboard',
              read:
                permissions?.RETAIL_Marketplace?.READ ||
                permissions?.WMS_Marketplace?.READ ||
                permissions?.HO_Marketplace?.READ,
            },
          ],
        }
      : null),
  },
  {
    ...(permissions?.RETAIL_Marketing?.READ ||
    permissions?.WMS_Marketing?.READ ||
    permissions?.VMS_Marketing?.READ ||
    permissions?.HO_Marketing?.READ
      ? {
          type: 'collapse',
          name: 'Marketing',
          key: 'marketing',
          icon: <CampaignIcon />,
          layout: 'dashboard',
          read:
            permissions?.RETAIL_Marketing?.READ ||
            permissions?.WMS_Marketing?.READ ||
            permissions?.VMS_Marketing?.READ ||
            permissions?.HO_Marketing?.READ,
          collapse:
            isHeadOffice === 'true'
              ? [
                  {
                    name: 'Transactional',
                    key: 'transactional',
                    route: '/marketting/transactional',
                    component: null,
                    layout: 'dashboard',
                    read: permissions?.HO_Purchase?.READ,
                  },
                  {
                    name: 'Campaigns',
                    key: 'campaigns',
                    route: '/marketting/campaigns',
                    component: null,
                    layout: 'dashboard',
                    read: permissions?.HO_Purchase?.READ,
                  },
                  {
                    name: 'Offers & Promotions',
                    key: 'offers-promotions',
                    route: '/marketting/offers-promotions',
                    component: <OfferAndPromoList />,
                    layout: 'dashboard',
                    read: permissions?.HO_Purchase?.READ,
                  },
                  {
                    name: 'Loyalty',
                    key: 'loyalty',
                    route: '/marketting/loyalty',
                    component: null,
                    layout: 'dashboard',
                    read: permissions?.HO_Purchase?.READ,
                  },
                  {
                    name: 'Contacts',
                    key: 'contacts',
                    route: '/marketting/contacts',
                    component: null,
                    layout: 'dashboard',
                    read: permissions?.HO_Purchase?.READ,
                  },
                  {
                    name: 'Settings',
                    key: 'settings',
                    route: '/marketting/settings',
                    component: null,
                    layout: 'dashboard',
                    read: permissions?.HO_Purchase?.READ,
                  },
                ]
              : InstalledApps,
        }
      : null),
  },
  {
    ...(permissions?.WMS_Dashboard
      ? {
          type: 'collapse',
          name: 'Production',
          key: 'production',
          icon: <InventoryIcon />,
          route: '/production',
          component: <Production />,
          layout: 'dashboard',
          noCollapse: true,
          read: permissions?.WMS_Dashboard?.READ,
        }
      : null),
  },
  {
    ...(!isProduction && (permissions?.RETAIL_Logistics?.READ || permissions?.WMS_Logistics?.READ)
      ? {
          type: 'collapse',
          name: 'Logistics',
          key: 'logistics',
          icon: <LocalShippingIcon />,
          layout: 'dashboard',
          read: permissions?.RETAIL_Logistics?.READ || permissions?.WMS_Logistics?.READ,
          collapse: [
            {
              name: 'Packages',
              key: 'packages',
              route: '/logistics/packages',
              component: <Purchase />,
              layout: 'dashboard',
              read: permissions?.RETAIL_Logistics?.READ || permissions?.WMS_Logistics?.READ,
            },
            {
              name: 'Eway bills',
              key: 'eway-bills',
              route: '/logistics/eway-bills',
              component: <Test />,
              layout: 'dashboard',
              read: permissions?.RETAIL_Logistics?.READ || permissions?.WMS_Logistics?.READ,
            },
            // {
            //   name: 'Fleet management',
            //   key: 'fleet-management',
            //   route: '/logistics/fleet-management',
            //   component: <Fleetmangment />,
            //   layout: 'dashboard',
            //   read:
            //     permissions?.RETAIL_Logistics?.READ ||
            //     permissions?.WMS_Logistics?.READ ,
            // },
            // {
            //   name: 'Delivery agents',
            //   key: 'delivery-agents',
            //   route: '/logistics/Delivery-agents',
            //   component: <DeliveryAgents />,
            //   layout: 'dashboard',
            //   read:
            //     permissions?.RETAIL_Logistics?.READ ||
            //     permissions?.WMS_Logistics?.READ ,
            // },
          ],
        }
      : null),
  },
  {
    ...(user_roles?.includes('SUPER_ADMIN')
      ? {
          type: 'collapse',
          name: 'HRMS',
          key: 'hrms-employee',
          route: `/hrms-employee`,
          icon: <PeopleIcon />,
          noCollapse: true,
          component: <HrmsEmployee />,
          layout: 'dashboard',
          read: true,
        }
      : null),
  },
  {
    type: 'collapse',
    name: 'Apps & Integration',
    key: 'apps_integration',
    icon: <AppsIcon />,
    route: '/apps_integration',
    component: <Appslist />,
    noCollapse: true,
    layout: 'dashboard',
    read:
      permissions?.RETAIL_AppsIntegration?.READ ||
      permissions?.WMS_AppsIntegration?.READ ||
      permissions?.VMS_AppsIntegration?.READ,
  },

  {
    type: 'collapse',
    name: 'Sales Channels',
    key: 'sales_channels',
    icon: <PaymentsIcon />,
    layout: 'dashboard',
    read:
      permissions?.RETAIL_SalesChannel?.READ ||
      permissions?.WMS_SalesChannel?.READ ||
      permissions?.HO_Sales_Channel?.READ,
    collapse: SalesChannelApps,
  },
  {
    ...((permissions?.RETAIL_Logistics?.READ &&
      isEnterPrise == 'true' &&
      featureSettings?.['PALLET_HYPERLOCAL'] == 'TRUE') ||
    (permissions?.WMS_Logistics?.READ && isEnterPrise == 'true' && featureSettings?.['PALLET_HYPERLOCAL'] == 'TRUE') ||
    (permissions?.HO_Hyperlocal?.READ && isEnterPrise == 'true' && featureSettings?.['PALLET_HYPERLOCAL'] == 'TRUE')
      ? {
          type: 'collapse',
          name: isHeadOffice === 'true' ? 'Hyperlocal' : 'Pallet Hyperlocal',
          key: isHeadOffice === 'true' ? 'hyperlocal' : 'pallet-hyperlocal',
          icon: <LocationOnIcon />,
          layout: 'dashboard',
          read:
            permissions?.RETAIL_Logistics?.READ || permissions?.WMS_Logistics?.READ || permissions?.HO_Hyperlocal?.READ,
          collapse: [
            // {
            //   name: 'Overview',
            //   key: 'overview',
            //   route: '/pallet-hyperlocal/overview',
            //   component: <Test />,
            //   layout: 'dashboard',
            //   read:
            //     permissions?.RETAIL_Logistics?.READ ||
            //     permissions?.WMS_Logistics?.READ ||
            //     permissions?.VMS_Logistics?.READ,
            // },
            {
              name: 'Serviceability',
              key: 'serviceability',
              route: '/pallet-hyperlocal/serviceability',
              component: <ServiceabilityHyperlocal />,
              layout: 'dashboard',
              read:
                permissions?.RETAIL_Logistics?.READ ||
                permissions?.WMS_Logistics?.READ ||
                permissions?.HO_Hyperlocal?.READ,
            },
            {
              name: 'Delivery Agent',
              key: 'delivery-agent',
              route: '/pallet-hyperlocal/delivery-agent',
              component: <DeliveryAgent />,
              layout: 'dashboard',
              read:
                permissions?.RETAIL_Logistics?.READ ||
                permissions?.WMS_Logistics?.READ ||
                permissions?.HO_Hyperlocal?.READ,
            },
            {
              name: 'App Layout',
              key: 'app-layout',
              route: '/pallet-hyperlocal/app-layout',
              component: <DeliveryAgent />,
              layout: 'dashboard',
              read: permissions?.HO_Hyperlocal?.READ,
            },
            {
              name: 'E-Commerce',
              key: 'e-commerce',
              route: '/pallet-hyperlocal/e-commerce',
              component: <EcommerceB2Cui />,
              layout: 'dashboard',
              read: permissions?.RETAIL_Logistics?.READ || permissions?.WMS_Logistics?.READ,
            },
            // {
            //   name: 'Settings',
            //   key: 'settings',
            //   route: '/pallet-hyperlocal/settings',
            //   component: <Test />,
            //   layout: 'dashboard',
            //   read:
            //     permissions?.RETAIL_Logistics?.READ ||
            //     permissions?.WMS_Logistics?.READ ||
            //     permissions?.VMS_Logistics?.READ,
            // },
          ],
        }
      : (permissions?.RETAIL_Logistics?.READ &&
          isEnterPrise == 'false' &&
          featureSettings?.['PALLET_HYPERLOCAL'] == 'TRUE') ||
        (permissions?.WMS_Logistics?.READ &&
          isEnterPrise == 'false' &&
          featureSettings?.['PALLET_HYPERLOCAL'] == 'TRUE') ||
        (permissions?.HO_Hyperlocal?.READ &&
          isEnterPrise == 'false' &&
          featureSettings?.['PALLET_HYPERLOCAL'] == 'TRUE')
      ? {
          type: 'collapse',
          name: isHeadOffice === 'true' ? 'Hyperlocal' : 'Pallet Hyperlocal',
          key: isHeadOffice === 'true' ? 'hyperlocal' : 'pallet-hyperlocal',
          icon: <LocationOnIcon />,
          layout: 'dashboard',
          read:
            permissions?.RETAIL_Logistics?.READ || permissions?.WMS_Logistics?.READ || permissions?.HO_Hyperlocal?.READ,
          collapse: [
            // {
            //   name: 'Overview',
            //   key: 'overview',
            //   route: '/pallet-hyperlocal/overview',
            //   component: <Test />,
            //   layout: 'dashboard',
            //   read:
            //     permissions?.RETAIL_Logistics?.READ ||
            //     permissions?.WMS_Logistics?.READ ||
            //     permissions?.VMS_Logistics?.READ,
            // },
            {
              name: 'Serviceability',
              key: 'serviceability',
              route: '/pallet-hyperlocal/serviceability',
              component: <ServiceabilityHyperlocal />,
              layout: 'dashboard',
              read:
                permissions?.RETAIL_Logistics?.READ ||
                permissions?.WMS_Logistics?.READ ||
                permissions?.HO_Hyperlocal?.READ,
            },
            {
              name: 'Delivery Agent',
              key: 'delivery-agent',
              route: '/pallet-hyperlocal/delivery-agent',
              component: <DeliveryAgent />,
              layout: 'dashboard',
              read:
                permissions?.RETAIL_Logistics?.READ ||
                permissions?.WMS_Logistics?.READ ||
                permissions?.HO_Hyperlocal?.READ,
            },
            {
              name: 'App Layout',
              key: 'app-layout',
              route: '/pallet-hyperlocal/app-layout',
              component: <DeliveryAgent />,
              layout: 'dashboard',
              read: permissions?.HO_Hyperlocal?.READ,
            },
            {
              name: 'E-Commerce',
              key: 'e-commerce',
              route: '/pallet-hyperlocal/e-commerce',
              component: <EcommerceB2Cui />,
              layout: 'dashboard',
              read: permissions?.RETAIL_Logistics?.READ || permissions?.WMS_Logistics?.READ,
            },
            // {
            //   name: 'Settings',
            //   key: 'settings',
            //   route: '/pallet-hyperlocal/settings',
            //   component: <Test />,
            //   layout: 'dashboard',
            //   read:
            //     permissions?.RETAIL_Logistics?.READ ||
            //     permissions?.WMS_Logistics?.READ ||
            //     permissions?.VMS_Logistics?.READ,
            // },
          ],
        }
      : null),
  },
  {
    ...((permissions?.RETAIL_Settings?.READ && isEnterPrise == 'true' && featureSettings?.['PALLET_PAY'] == 'TRUE') ||
    (permissions?.WMS_Settings?.READ && isEnterPrise == 'true' && featureSettings?.['PALLET_PAY'] == 'TRUE') ||
    (permissions?.HO_Payments?.READ && isEnterPrise == 'true' && featureSettings?.['PALLET_PAY'] == 'TRUE')
      ? {
          type: 'collapse',
          name: isHeadOffice === 'true' ? 'Payments' : 'Pallet pay',
          key: 'Pallet pay',
          icon: <PaymentIcon />,
          route: '/Pallet-pay',
          layout: 'dashboard',
          read: permissions?.RETAIL_Settings?.READ || permissions?.WMS_Settings?.READ || permissions?.HO_Payments?.READ,
          collapse: [
            {
              name: 'Overview',
              key: 'overview',
              route: '/pallet-pay/overview',
              component: <PalletPayDashboard />,
              layout: 'dashboard',
              read:
                permissions?.RETAIL_Settings?.READ || permissions?.WMS_Settings?.READ || permissions?.HO_Payments?.READ,
            },
            {
              name: 'Transaction',
              key: 'transaction',
              route: '/pallet-pay/transaction',
              component: <TotalTransaction />,
              layout: 'dashboard',
              read:
                permissions?.RETAIL_Settings?.READ || permissions?.WMS_Settings?.READ || permissions?.HO_Payments?.READ,
            },
            {
              name: 'Settlement',
              key: 'settlement',
              route: '/pallet-pay/settlement',
              component: <PalletPaySettlement />,
              layout: 'dashboard',
              read:
                permissions?.RETAIL_Settings?.READ || permissions?.WMS_Settings?.READ || permissions?.HO_Payments?.READ,
            },
            {
              name: 'Settings',
              key: 'settings',
              route: '/pallet-pay/settings',
              component: <PalletPaySettings />,
              layout: 'dashboard',
              read:
                permissions?.RETAIL_Settings?.READ || permissions?.WMS_Settings?.READ || permissions?.HO_Payments?.READ,
            },
          ],
        }
      : (permissions?.RETAIL_Settings?.READ && isEnterPrise == 'false' && featureSettings?.['PALLET_PAY'] == 'TRUE') ||
        (permissions?.WMS_Settings?.READ && isEnterPrise == 'false' && featureSettings?.['PALLET_PAY'] == 'TRUE') ||
        (permissions?.HO_Payments?.READ && isEnterPrise == 'false' && featureSettings?.['PALLET_PAY'] == 'TRUE')
      ? {
          type: 'collapse',
          name: isHeadOffice === 'true' ? 'Payments' : 'Pallet pay',
          key: 'Pallet pay',
          icon: <PaymentIcon />,
          route: '/Pallet-pay',
          layout: 'dashboard',
          read: permissions?.RETAIL_Settings?.READ || permissions?.WMS_Settings?.READ || permissions?.HO_Payments?.READ,
          collapse: [
            {
              name: 'Overview',
              key: 'overview',
              route: '/pallet-pay/overview',
              component: <PalletPayDashboard />,
              layout: 'dashboard',
              read:
                permissions?.RETAIL_Settings?.READ || permissions?.WMS_Settings?.READ || permissions?.HO_Payments?.READ,
            },
            {
              name: 'Transaction',
              key: 'transaction',
              route: '/pallet-pay/transaction',
              component: <TotalTransaction />,
              layout: 'dashboard',
              read:
                permissions?.RETAIL_Settings?.READ || permissions?.WMS_Settings?.READ || permissions?.HO_Payments?.READ,
            },
            {
              name: 'Settlement',
              key: 'settlement',
              route: '/pallet-pay/settlement',
              component: <PalletPaySettlement />,
              layout: 'dashboard',
              read:
                permissions?.RETAIL_Settings?.READ || permissions?.WMS_Settings?.READ || permissions?.HO_Payments?.READ,
            },
            {
              name: 'Settings',
              key: 'settings',
              route: '/pallet-pay/settings',
              component: <PalletPaySettings />,
              layout: 'dashboard',
              read:
                permissions?.RETAIL_Settings?.READ || permissions?.WMS_Settings?.READ || permissions?.HO_Payments?.READ,
            },
          ],
        }
      : null),
  },
  // {
  //   ...( (permissions?.RETAIL_Reports?.READ ||
  //   permissions?.WMS_Reports?.READ ||
  //   permissions?.VMS_Reports?.READ ||
  //   permissions?.HO_Reports?.READ ) && resultArray?.includes("PayTM")
  //     ? {
  //         type: 'collapse',
  //         name: 'PayTM',
  //         key: 'payTM',
  //         icon: <SiPaytm />,
  //         route: '/pallet-pay/paytm',
  //         component: <PaytmDashboard vendorId={'PAYTM'} />,
  //         noCollapse: true,
  //         layout: 'dashboard',
  //         read:
  //           permissions?.RETAIL_Reports?.READ ||
  //           permissions?.WMS_Reports?.READ ||
  //           permissions?.VMS_Reports?.READ ||
  //           permissions?.HO_Reports?.READ,
  //       }
  //     : null),
  // },
  // {
  //   ...( (permissions?.RETAIL_Reports?.READ ||
  //   permissions?.WMS_Reports?.READ ||
  //   permissions?.VMS_Reports?.READ ||
  //   permissions?.HO_Reports?.READ ) && resultArray?.includes("Pinelabs")
  //     ? {
  //         type: 'collapse',
  //         name: 'PineLabs',
  //         key: 'pineLabs',
  //         icon: <PiContactlessPayment />,
  //         route: '/pallet-pay/pinelabs',
  //         component:  <PaytmDashboard vendorId={"PINELABS"}/>
  //         ,
  //         // component: <ReportHeader />,
  //         noCollapse: true,
  //         layout: 'dashboard',
  //         read:
  //           permissions?.RETAIL_Reports?.READ ||
  //           permissions?.WMS_Reports?.READ ||
  //           permissions?.VMS_Reports?.READ ||
  //           permissions?.HO_Reports?.READ,
  //         // collapse: ReportsInstalledApps,
  //       }
  //     : null),
  // },
  {
    ...(permissions?.RETAIL_Reports?.READ ||
    permissions?.WMS_Reports?.READ ||
    permissions?.VMS_Reports?.READ ||
    permissions?.HO_Reports?.READ
      ? {
          type: 'collapse',
          name: 'Reports',
          key: 'reports',
          icon: <SignalCellularAltIcon />,
          route: '/reports',
          component: <Reports />,
          // component: <ReportHeader />,
          noCollapse: true,
          layout: 'dashboard',
          read:
            permissions?.RETAIL_Reports?.READ ||
            permissions?.WMS_Reports?.READ ||
            permissions?.VMS_Reports?.READ ||
            permissions?.HO_Reports?.READ,
          collapse: ReportsInstalledApps,
        }
      : null),
  },
  // {
  //   ...(permissions?.RETAIL_Reports?.READ ||
  //   permissions?.WMS_Reports?.READ ||
  //   permissions?.VMS_Reports?.READ ||
  //   permissions?.HO_Reports?.READ
  //     ? {
  //         type: 'collapse',
  //         name: 'Tally',
  //         key: 'tally',
  //         icon: <ImportExportIcon />,
  //         route: '/app/Tally',
  //         component: (
  //           <Appnamecard name={'Tally'} description={"Extend sales through SwiggyMart's online marketplace."} />
  //         ),
  //         noCollapse: true,
  //         layout: 'dashboard',
  //         read:
  //           permissions?.RETAIL_Reports?.READ ||
  //           permissions?.WMS_Reports?.READ ||
  //           permissions?.VMS_Reports?.READ ||
  //           permissions?.HO_Reports?.READ,
  //         // collapse: TallyInstalledApps,
  //       }
  //     : null),
  // },
  {
    ...(permissions?.HO_Supports?.READ
      ? {
          type: 'collapse',
          name: 'Reports',
          key: 'reports',
          icon: <SignalCellularAltIcon />,
          route: '/reports',
          component: <Reports />,
          noCollapse: true,
          layout: 'dashboard',
          read:
            permissions?.RETAIL_Reports?.READ ||
            permissions?.WMS_Reports?.READ ||
            permissions?.VMS_Reports?.READ ||
            permissions?.HO_Supports?.READ,
        }
      : null),
  },
  // {
  //   type: 'collapse',
  //   name: 'Project',
  //   key: 'project',
  //   icon: <AccountTreeIcon />,
  //   component: <Project />,
  //   route: '/project',
  //   noCollapse: true,
  //   layout: 'dashboard',
  //   read:
  //     permissions?.RETAIL_Reports?.READ ||
  //     permissions?.WMS_Reports?.READ ||
  //     permissions?.VMS_Reports?.READ ||
  //     permissions?.HO_Supports?.READ,
  // },
  {
    ...(permissions?.RETAIL_Settings?.READ ||
    permissions?.WMS_Settings?.READ ||
    permissions?.VMS_Settings?.READ ||
    permissions?.HO_Settings?.READ
      ? {
          type: 'collapse',
          name: 'Settings',
          key: 'setting-organisation',
          icon: <SettingsIcon />,
          route: '/setting-organisation',
          component: <MapperOrg />,
          noCollapse: isHeadOffice === 'true' ? false : true,
          layout: 'dashboard',
          read:
            permissions?.RETAIL_Settings?.READ ||
            permissions?.WMS_Settings?.READ ||
            permissions?.VMS_Settings?.READ ||
            permissions?.HO_Settings?.READ,
          collapse: [
            // permissions?.HO_Settings?.READ
            {
              name: 'Organisation',
              key: 'organisation',
              route: '/settings/organisation',
              component: null,
              layout: 'dashboard',
              read: permissions?.HO_Settings?.READ,
            },
            {
              name: 'Migration',
              key: 'migration',
              route: '/settings/migration',
              component: null,
              layout: 'dashboard',
              read: permissions?.HO_Settings?.READ,
            },
            {
              name: 'Users & Roles',
              key: 'users-roles',
              route: '/settings/users-roles',
              component: null,
              layout: 'dashboard',
              read: permissions?.HO_Settings?.READ,
            },
            {
              name: 'Workflow',
              key: 'workflow',
              route: '/settings/workflow',
              component: null,
              layout: 'dashboard',
              read: permissions?.HO_Settings?.READ,
            },
            {
              name: 'Apps & Integrations',
              key: 'apps-integration',
              route: '/settings/apps-integration',
              component: null,
              layout: 'dashboard',
              read: permissions?.HO_Settings?.READ,
            },
          ],
        }
      : null),
  },

  {
    type: 'collapse',
    name: 'Home',
    key: 'dashboards',
    route: `/dashboards/${contextType}`,
    icon: <HouseIcon />,
    noCollapse: true,
    component: <Default />,
    layout: 'settings',
    read: permissions?.RETAIL_Settings?.READ || permissions?.WMS_Settings?.READ || permissions?.VMS_Settings?.READ,
  },
  {
    type: 'collapse',
    name: 'Organization',
    key: 'setting-organisation',
    icon: <CorporateFareIcon />,
    route: '/setting-organisation',
    // component: <MapperOrg />,F
    component: <MapperOrganization />,
    noCollapse: true,
    layout: 'settings',
    read: permissions?.RETAIL_Settings?.READ || permissions?.WMS_Settings?.READ || permissions?.VMS_Settings?.READ,
  },
  {
    type: 'collapse',
    name: 'Migration',
    key: 'setting-migration',
    icon: <MovingIcon />,
    route: '/setting-migration',
    // component: <MapperOrg />,
    component: <Migration />,
    noCollapse: true,
    layout: 'settings',
    read: permissions?.RETAIL_Settings?.READ || permissions?.WMS_Settings?.READ || permissions?.VMS_Settings?.READ,
  },
  {
    type: 'collapse',
    name: 'Locations',
    key: 'setting-location',
    icon: <LocationOnIcon />,
    route: '/setting-location',
    component: <MapperLocation />,
    noCollapse: true,
    layout: 'settings',
    read: permissions?.RETAIL_Settings?.READ || permissions?.WMS_Settings?.READ,
  },
  {
    type: 'collapse',
    name: 'Users & roles',
    key: 'setting-users-roles',
    icon: <PeopleIcon />,
    route: '/setting-users-roles',
    component: <Userroles />,
    noCollapse: true,
    layout: 'settings',
    read: permissions?.RETAIL_Settings?.READ || permissions?.WMS_Settings?.READ || permissions?.VMS_Settings?.READ,
  },
  // {
  //   type: 'collapse',
  //   name: 'POS Rules',
  //   key: 'posRules',
  //   icon: <SettingsIcon/>,
  //   route: '/setting/pos-rules',
  //   component: <PosRules />,
  //   noCollapse: true,
  //   layout: 'settings',
  //   read: permissions?.RETAIL_Settings?.READ || permissions?.WMS_Settings?.READ || permissions?.VMS_Settings?.READ,
  // },
  {
    // ...(permissions?.RETAIL_Settings?.READ || permissions?.WMS_Settings?.READ || permissions?.VMS_Settings?.READ
    // ?
    // {

    type: 'collapse',
    name: 'Layout',
    key: 'setting-all-layouts',
    icon: <ViewCarouselIcon />,
    route: '/setting-all-layouts',
    // component: <Multiplelayout />,
    component: <AllLayouts />,
    noCollapse: true,
    layout: 'settings',
    read: permissions?.RETAIL_Settings?.READ || permissions?.WMS_Settings?.READ || permissions?.VMS_Settings?.READ,
    write: permissions?.RETAIL_Settings?.WRITE || permissions?.WMS_Settings?.WRITE || permissions?.VMS_Settings?.WRITE,

    //   collapse: [
    //     {
    //       name: 'Layouts',
    //       key: 'layouts',
    //       route: '/setting/multiple-layout',
    //       component: <Multiplelayout/>,
    //       layout: 'settings',
    //     }
    //   ],
    //  }
    //  :null)
  },
  // {
  //   type: 'collapse',
  //   name: 'Tax master',
  //   key: 'taxmaster',
  //   icon: <TimerIcon />,
  //   route: '/setting/taxes',
  //   component: <Taxmaster />,
  //   noCollapse: true,
  //   layout: 'settings',
  //   read: permissions?.RETAIL_Settings?.READ || permissions?.WMS_Settings?.READ || permissions?.VMS_Settings?.READ,
  // },
  {
    type: 'collapse',
    name: 'Help & Support ',
    key: 'setting-help-and-support',
    icon: <AutoStoriesIcon />,
    route: '/setting-help-and-support',
    component: <SettingHelpSupport />,
    noCollapse: true,
    layout: 'settings',
    read: permissions?.RETAIL_Settings?.READ || permissions?.WMS_Settings?.READ || permissions?.VMS_Settings?.READ,
  },
  {
    type: 'collapse',
    name: 'Diagnostics',
    key: 'setting-diagnostics',
    icon: <InfoIcon />,
    route: '/setting-diagnostics',
    component: <Diagnostics />,
    noCollapse: true,
    layout: 'settings',
    read:
      !isProduction &&
      (permissions?.RETAIL_Settings?.READ || permissions?.WMS_Settings?.READ || permissions?.VMS_Settings?.READ),
  },
  {
    type: 'collapse',
    name: 'Home',
    key: 'dashboards',
    route: `/dashboards/${contextType}`,
    icon: <HouseIcon />,
    noCollapse: true,
    component: <Default />,
    layout: 'hrms',
    read: true,
  },
  // {
  //   type: 'collapse',
  //   name: 'Overview',
  //   key: 'hrms-overview',
  //   icon: <PeopleIcon />,
  //   route: '/hrms-overview',
  //   component: < />,
  //   noCollapse: true,
  //   layout: 'hrms',
  //   read:true,
  // },
  {
    type: 'collapse',
    name: 'Employees',
    key: 'hrms-employee',
    icon: <PeopleIcon />,
    route: '/hrms-employee',
    component: <HrmsEmployee />,
    noCollapse: true,
    layout: 'hrms',
    read: true,
  },
  // {
  //   type: 'collapse',
  //   name: 'Attendance',
  //   key: 'hrms-attendance',
  //   icon: <GroupsIcon />,
  //   route: '/hrms-attendance',
  //   // component: <    />,
  //   noCollapse: true,
  //   layout: 'hrms',
  //   read:true,
  // },
  {
    type: 'collapse',
    name: 'Holiday',
    key: 'hrms-holiday',
    icon: <BeachAccessIcon />,
    route: '/hrms-holiday',
    component: <HrmsHoliday />,
    noCollapse: true,
    layout: 'hrms',
    read: true,
  },
  // {
  //   type: 'collapse',
  //   name: 'Performance',
  //   key: 'hrms-performance',
  //   icon: <EventNoteIcon />,
  //   route: '/hrms-performance',
  //   // component: </>,
  //   noCollapse: true,
  //   layout: 'hrms',
  //   read:true,
  // },
  // {
  //   type: 'collapse',
  //   name: 'Payroll',
  //   key: 'hrms-payrolls',
  //   icon: <PictureAsPdfIcon />,
  //   route: '/hrms-payrolls',
  //   // component: < />,
  //   noCollapse: true,
  //   layout: 'hrms',
  //   read:true,
  // },

  // {
  //   type: 'collapse',
  //   name: 'Reports',
  //   key: 'hrms-reports',
  //   icon: <PictureAsPdfIcon />,
  //   route: '/hrms-reports',
  //   // component: < />,
  //   noCollapse: true,
  //   layout: 'hrms',
  //   read:true,
  // },

  {
    type: 'collapse',
    name: 'Master',
    key: 'hrms-master',
    icon: <PictureAsPdfIcon />,
    route: '/hrms-master',
    component: <HrmsMaster />,
    noCollapse: true,
    layout: 'hrms',
    read: true,
  },
];

const routes = allRoutes?.filter((item) => !!Object?.keys(item)?.length);

export default routes;
