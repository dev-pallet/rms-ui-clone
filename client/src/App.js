/**
=========================================================
* Soft UI Dashboard PRO React - v4.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/soft-ui-dashboard-pro-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com
marketplace
 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useEffect, useMemo, useState } from 'react';
// react-router components
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

// @mui material components
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Soft UI Dashboard PRO React example components
import Configurator from 'examples/Configurator';
import Sidenav from 'examples/Sidenav';

// Soft UI Dashboard PRO React themes
import theme from 'assets/theme';
import themeRTL from 'assets/theme/theme-rtl';

// RTL plugins
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import rtlPlugin from 'stylis-plugin-rtl';

// Soft UI Dashboard PRO React routes
// import routes from 'routes';

// Soft UI Dashboard PRO React contexts
import { setMiniSidenav, setOpenConfigurator, useSoftUIController } from 'context';

// Images
import ContactSales from './layouts/pages/pricing-page/components/ContactSales';
import PricingPage from './layouts/pages/pricing-page';

//Components
import 'layouts/ecommerce/Common/Common Css Files/datagridcommon.css';
import 'layouts/ecommerce/Common/Common Css Files/add-grn.css';
import 'layouts/ecommerce/Common/Common Css Files/add-po-list-card.css';
import 'layouts/ecommerce/Common/Common Css Files/add-po.css';
import 'layouts/ecommerce/Common/Common Css Files/po-details-page.css';
import { AddCustomer } from 'layouts/ecommerce/customer/components/addcustomer/AddCustomer';
import { AddProducts } from 'layouts/ecommerce/product/all-products/components/add-product/index';
import { AddVendor } from 'layouts/ecommerce/vendor/components/addvendor';
import { BarcodeDetailsPage } from 'layouts/ecommerce/product/barcode/components/barcode-detailspage';
import { CustomerDetails } from 'layouts/ecommerce/CustomerDetails/CustomerDetailsV2';
import { ForgotPassword } from 'layouts/authentication/sign-in/basic/forgot-password';
import { InventoryDetailsPage } from 'layouts/ecommerce/product/inventory/components/inventory-detailpage';
import { PaymentRecievedDetailsPage } from 'layouts/ecommerce/sales/payment-received/components/payments-recieved-details/payments-recieved-details-page';
import { ProductDetails } from 'layouts/ecommerce/product/all-products/components/product-details/product-detailspage';
import { PurchaseDetailsPage } from 'layouts/ecommerce/sales/purchase/components/purchase-details/purchase-details';
import { VendorDetailsPage } from 'layouts/ecommerce/vendor/components/vendor-details-page/vendor-details-page';
import AddHierarchy from './layouts/ecommerce/layout/components/add-hierarchy';
import Addstaff from 'layouts/ecommerce/add-staff/index';
import AllLayouts from './layouts/ecommerce/layout/components/all-layouts';
import CartPage from 'layouts/ecommerce/cart-page/index';
import Createbills from 'layouts/ecommerce/create-bills/index';
import Default from 'layouts/dashboards/default';
import Diagnostics from 'layouts/ecommerce/diagnostics';
import EditLayoutComponents from './layouts/ecommerce/layout/components/all-layouts/components/edit-layout-components';
import EditLayouts from './layouts/ecommerce/layout/components/all-layouts/components/edit-layouts';
import EditProduct from 'layouts/ecommerce/product/all-products/components/edit-product/index';
import Gift from 'layouts/ecommerce/gift-card/index';
import Illustration from 'layouts/authentication/sign-in/illustration';
import Integration from 'layouts/ecommerce/integration';
import Inward from 'layouts/ecommerce/product/inward/index';
import InwardQr from './layouts/ecommerce/product/inward/components/inwardQr';
import Layout from 'layouts/ecommerce/layout/index';
import LayoutTable from './layouts/ecommerce/layout/components/layout-table';
import Multiplelayout from 'layouts/ecommerce/layout/components/multiple layout/index';
import OtpVerify from './layouts/authentication/otp-verify-illustration';
import Plan from 'layouts/ecommerce/plan';
import Production from 'layouts/ecommerce/product/production/index';
import ProductionMapping from './layouts/ecommerce/product/production/components/productionMapping';
import ProductionSettings from './layouts/ecommerce/product/production/components/productionSettings';
import Productiondetails from 'layouts/ecommerce/product/production/components/productionform/index';
import Profilepage from 'layouts/ecommerce/profile-page/index';
import Putaway from 'layouts/ecommerce/product/inward/components/putawayform';
import Qualitychecking from 'layouts/ecommerce/product/inward/components/qualityform';
import Saleschannel from 'layouts/ecommerce/sales-channels';
import Taxmaster from 'layouts/ecommerce/tax-master/index';
import Userroles from 'layouts/ecommerce/users-roles/index';
import VerifyOtpBasic from './layouts/authentication/sign-in/otp';
// import testComp from "./layouts/ecommerce/test/softtable";
import Testcomp from './layouts/ecommerce/test/softtable';
import './App.css';
import { AllOrgPage } from './layouts/ecommerce/all-org-page/all-org';
import { AllProducts } from './layouts/ecommerce/product/all-products/all-products';
import { E404Page } from './layouts/ecommerce/errorpage/index';
import { EndDayDetailsPage } from './layouts/ecommerce/apps-integration/Pos/components/End_day/components/end/dayEnding';
import { Inventory } from './layouts/ecommerce/product/inventory/inventory';
import { MarketProdDetails } from './layouts/ecommerce/market-place/components/product-details';
import { MarketplaceDetails } from './layouts/ecommerce/market-place/components/sales-details/sales-details';
import { NewTransfer } from './layouts/ecommerce/product/transfers/components/newTransfer';
import { OrderPlaced } from './layouts/ecommerce/cart-page/components/order-placed';
import {
  ProtectedAppsIntegrationRoute,
  ProtectedCustomersRoute,
  ProtectedCustomersWrite,
  ProtectedMarketplaceRoute,
  ProtectedMarketplaceWriteRoute,
  ProtectedNoAT,
  ProtectedNoORGID,
  ProtectedProductRoute,
  ProtectedProductWrite,
  ProtectedPurchaseRoute,
  ProtectedPurchaseWrite,
  ProtectedSalesOrderRoute,
  ProtectedSalesOrderWrite,
  ProtectedSettingsRoute,
} from './protectedRoutes.';
import { SessionDetailsPage } from './layouts/ecommerce/apps-integration/Pos/components/End_day/components/sessionDetailsPage/sessionDetails';
import { Transfers } from './layouts/ecommerce/product/transfers/transfers';
import {
  apps_integerationData,
  fetchAccoutidbyOrg,
  fetchInstalledApps,
  getCustomerDetails,
  getOrgNameLogo,
  getSubscriptionDetails,
  getSubscriptionIdDetails,
  userRefreshToken,
} from './config/Services';
import { createContext } from 'react';
import { setAllProductsFilter, setPIItemList } from './context';
import { useCookies } from 'react-cookie';
import { CircularProgress, useMediaQuery } from '@mui/material';
import AddCategory from './layouts/ecommerce/apps-integration/Notification/AddCategory';
import AddContacts from './layouts/ecommerce/apps-integration/Notification/ContactList/AddContacts';
import AddPosmachines from './layouts/ecommerce/apps-integration/Pos/components/AddPosmachines';
import AddstaffPos from './layouts/ecommerce/apps-integration/Pos/components/AddStaffPos';
import AllOrg_loc from './layouts/ecommerce/all-org-page/AllOrg_loc';
import AllWhatsappTemplates from './layouts/ecommerce/apps-integration/Notification/WhatsappCampaigns/AllWhatsappTemplates';
import Allapps from './layouts/ecommerce/apps-integration/Allapps';
import Allnotificationpage from './layouts/ecommerce/apps-integration/Notification/Allnotificationpage';
import Appnamecard from './layouts/ecommerce/apps-integration/Appnamecard';
import BannerEditPreview from './layouts/ecommerce/pallet-hyperlocal/ecommerce/BannerEditPreview';
import BannerSelection from './layouts/ecommerce/pallet-hyperlocal/ecommerce/BannerSelection';
import BillingPage from './layouts/ecommerce/all-org-page/BillingInformation/BIllingPage';
import Billinginfo from './layouts/ecommerce/all-org-page/BillingInformation/Billinginfo';
import BrandEditPreview from './layouts/ecommerce/pallet-hyperlocal/ecommerce/BrandEditPreview';
import BrandStore from './layouts/ecommerce/pallet-hyperlocal/ecommerce/BrandStore';
import BulkPriceEdit from './layouts/ecommerce/product/bulk-price-edit/bulk-price-edit';
import BulkProductHistory from './layouts/ecommerce/product/all-products/components/bulk-product-history/bulk-product-historyPage';
import BulkUpload from './layouts/ecommerce/product/all-products/components/bulk-product-history/bulk-product/bulk-upload';
import BulkVendorUploadHistory from './layouts/ecommerce/vendor/components/Bulk-vendor-upload';
import CampaignPage from './layouts/ecommerce/apps-integration/Notification/CampaignPage';
import Cancelsubscription from './layouts/ecommerce/all-org-page/BillingInformation/Cancelsubscription';
import CartCoupon from './layouts/ecommerce/apps-integration/CouponSettings/CartCoupon';
import CategoriesSelect from './layouts/ecommerce/pallet-hyperlocal/ecommerce/CategoriesSelect';
import CategoryEditPreview from './layouts/ecommerce/pallet-hyperlocal/ecommerce/CategoryEditPreview';
import ComponentCreation from './layouts/ecommerce/pallet-hyperlocal/ecommerce/ComponentCreation';
import ContactPage from './layouts/ecommerce/apps-integration/Notification/ContactList/ContactPage';
import CopyPasteContacts from './layouts/ecommerce/apps-integration/Notification/ContactList/CopyPasteContacts';
import CouponActivateDeactivate from './layouts/ecommerce/apps-integration/CouponSettings/ActiveInactiveDelete.js';
import CouponDashboard from './layouts/ecommerce/apps-integration/CouponSettings/couponDashboard';
import CouponNewDashboard from './layouts/ecommerce/apps-integration/CouponSettings/CouponNewDashboard';
import CreateWhatsAppCampaign from './layouts/ecommerce/apps-integration/Notification/WhatsappCampaigns/CreateWhatsAppCampaign';
import Createcoupon from './layouts/ecommerce/apps-integration/CouponSettings/Createcoupon';
import Customer from './layouts/ecommerce/customer';
import DeliveryAgentsform from './layouts/ecommerce/Logistics/DeliveryAgentsform';
import DynamicCoupon from './layouts/ecommerce/apps-integration/CouponSettings/DynamicCoupon';
import Fleetmanagmentform from './layouts/ecommerce/Logistics/Fleetmanagmentform';
import FreebieCoupon from './layouts/ecommerce/apps-integration/CouponSettings/FreebieCoupon.js';
import Generalreports from './layouts/ecommerce/reports/components/Generalreports';
import GstReportChart from './layouts/ecommerce/reports/components/GstReportChart';
import Gstreports from './layouts/ecommerce/reports/components/FullPagereports/Gstreports';
import InventoryReportchart from './layouts/ecommerce/reports/components/InventoryReportChart';
import Inventoryreport from './layouts/ecommerce/reports/components/FullPagereports/Inventoryreport';
import InwardDetails from './layouts/ecommerce/product/inward/components/inwarddetails';
import LoyalityPointsform from './layouts/ecommerce/apps-integration/LoyalitySettings/Loyalitypointsform';
import Loyalitysettings from './layouts/ecommerce/apps-integration/LoyalitySettings/Loyalitysettingspage';
import MDRdetails from './layouts/ecommerce/Pallet-pay/MDRdetails';
import MapperLocDetail from './layouts/ecommerce/shop-location/mapper';
import MapperNewLoc from './layouts/ecommerce/new-location/mapperNewLoc';
import MapperOrg from './layouts/ecommerce/setting/mapper';
import NewPage from './layouts/ecommerce/apps-integration/LoyalitySettings/Previewloyaltypoints';
import NewSalesPurchase from './layouts/ecommerce/sales/purchase/components/CreatePurchase';
import NotificationCategory from './layouts/ecommerce/apps-integration/Notification/NotificationCategory';
import Notificationconnect from './layouts/ecommerce/apps-integration/Notification/Notificationconnect';
import Notificationsettings from './layouts/ecommerce/apps-integration/Notification/Notificationsettings';
import OrderProcessing from './layouts/ecommerce/cart-page/components/OrderProcessing';
import PaymentMode from './layouts/ecommerce/Pallet-pay/PaymentMode';
import Paymentmachine from './layouts/ecommerce/Pallet-pay/Paymentmachines';
import PincodeServiceableArea from './layouts/ecommerce/pallet-hyperlocal/serviceability/components/pincode';
import PosNewDashboard from './layouts/ecommerce/apps-integration/Pos/PosNewDashboard';
import PosReportchart from './layouts/ecommerce/reports/components/PosReportChart';
import PreapprovedCoupon from './layouts/ecommerce/apps-integration/CouponSettings/PreapprovedCoupon';
import ProductCoupon from './layouts/ecommerce/apps-integration/CouponSettings/ProductCoupon';
import ProtectedIllustration from './examples/ProtectRoutes';
import PurchaseExclusive from './layouts/ecommerce/purchase-exclusive';
import PurchaseIndent from './layouts/ecommerce/purchase-indent';
import Purchasebills from './layouts/ecommerce/purchase-bills';
import Purchasemade from './layouts/ecommerce/purchase-made';
import Purchasemain from './layouts/ecommerce/purchase-main';
import Purchasereport from './layouts/ecommerce/reports/components/FullPagereports/Purchasereport';
import Referral from './layouts/ecommerce/referral';
import RegisterToMeta from './layouts/ecommerce/apps-integration/Notification/RegisterToMeta';
import RejectionForm from './layouts/ecommerce/product/inward/components/rejectionform';
import RequestDetails from './layouts/ecommerce/Pallet-pay/RequestDetails';
import SalesReportchart from './layouts/ecommerce/reports/components/SalesReportchart';
import Salesreport from './layouts/ecommerce/reports/components/FullPagereports/Salesreport';
import ServiceDetails from './layouts/ecommerce/pallet-hyperlocal/serviceability/components/serviceDetails';
import Settingspage from './layouts/ecommerce/apps-integration/Settingpages';
import Showinstalledapp from './layouts/ecommerce/apps-integration/Showinstalledapp';
import SingleProductMarket from './layouts/ecommerce/market-place/components/productspage';
import TagFilter from './layouts/ecommerce/pallet-hyperlocal/ecommerce/tagFilter';
import TagsSelect from './layouts/ecommerce/pallet-hyperlocal/ecommerce/TagsSelect';
import TallyDetails from './layouts/ecommerce/apps-integration/tallySettings/tallyDetails';
import TallySettings from './layouts/ecommerce/apps-integration/tallySettings';
import Tallyform from './layouts/ecommerce/apps-integration/tallySettings/tallyForm';
import UploadContact from './layouts/ecommerce/apps-integration/Notification/ContactList/UploadContact';
import Vendor from './layouts/ecommerce/vendor';
import VendorFormData from './layouts/ecommerce/Pallet-pay/VendorFormData';
import WhatsappCampaign from './layouts/ecommerce/apps-integration/Notification/WhatsappCampaigns/WhatsappCampaign';
import WhatsappCampaignStats from './layouts/ecommerce/apps-integration/Notification/WhatsappCampaigns/WhatsappCampaignStats';
import WhatsappTemplateCreations from './layouts/ecommerce/apps-integration/Notification/WhatsappCampaigns/WhatsappTemplateCreations';
// import TestComponent from './layouts/ecommerce/reports/components/TestComponent';
import { AllreadyInstalledApps } from './layouts/ecommerce/apps-integration/AllreadyInstalledApps';
import { BonusPoints } from './layouts/ecommerce/apps-integration/LoyalitySettings/bonusPoints';
import { Closing } from './layouts/ecommerce/apps-integration/Pos/components/End_day/components/completeEndDay/completeEndDay';
import { EndDay } from './layouts/ecommerce/apps-integration/Pos/components/End_day/end_day';
import { LoyaltyChannels } from './layouts/ecommerce/apps-integration/LoyalitySettings/loyaltyChannels';
import { LoyaltyProgramTypeSelection } from './layouts/ecommerce/apps-integration/LoyalitySettings/loyaltyProgramTypeSelection';
import { LoyaltyReminder } from './layouts/ecommerce/apps-integration/LoyalitySettings/loyaltyReminder';
import { LoyaltyReview } from './layouts/ecommerce/apps-integration/LoyalitySettings/loyaltyPreview';
import { MultipleOrderAlert } from './layouts/ecommerce/apps-integration/LoyalitySettings/multipleOrderAlerts';
import { NewLoyaltyConfig } from './layouts/ecommerce/apps-integration/LoyalitySettings/newLoyaltyConfig';
import { StockTaking } from './layouts/ecommerce/product/stock-taking/components/create-schedule';
import { clearCookie, isSmallScreen } from './layouts/ecommerce/Common/CommonFunction';
import {
  getAllProductsFiltersCount,
  getAllProductsPage,
  setAllProductsFilterStateData,
  setAllProductsFilters,
  setAllProductsFiltersAppliedCount,
  setAllProductsPage,
} from './datamanagement/Filters/allProductsSlice';
import { setInstalledApps } from './datamanagement/recommendedAppSlice';
import { useDispatch, useSelector } from 'react-redux';
import AddDeliveryAgent from './layouts/ecommerce/pallet-hyperlocal/delivery-agent/components/add-agent';
import AddHierarchyNew from './layouts/ecommerce/layout/components/add-hierarchy/add-hierarchy-new';
import AddingFranchise from './layouts/ecommerce/headoffice-store/adding-franchise';
import AllPushCampaigns from './layouts/ecommerce/apps-integration/Notification/PushCampaigns/AllPushCampaigns';
import AllPushTemplates from './layouts/ecommerce/apps-integration/Notification/PushCampaigns/AllPushTemplates';
import AllcontactsPage from './layouts/ecommerce/apps-integration/Notification/ContactList/AllContactsPage';
import AutomatedCampaignSingle from './layouts/ecommerce/apps-integration/Notification/AutomatedCamaigns/AutomatedCampaignSingle';
import AutomatedPage from './layouts/ecommerce/apps-integration/Notification/AutomatedCamaigns/AutomatedPage';
import BusinessFlow from './layouts/ecommerce/apps-integration/WhatsappBusiness/BusinessFlow';
import CampaignTypePage from './layouts/ecommerce/apps-integration/Notification/CampaignTypePage';
import CartValueCreateOffer from './layouts/ecommerce/offers-promo/components/create-new/cart-value';
import CategoryCreateOffer from './layouts/ecommerce/offers-promo/components/create-new/category';
import CreateAutomatedForm from './layouts/ecommerce/apps-integration/Notification/AutomatedCamaigns/CreateAutomatedForm';
import CreateCouponMainPage from './layouts/ecommerce/apps-integration/CouponSettings/CreateCouponMainPage';
import CreateCustomAudience from './layouts/ecommerce/apps-integration/Notification/ContactList/CreateCustomAudience';
import CreateDynamicCouponForm from './layouts/ecommerce/apps-integration/CouponSettings/CreateDynamicCouponForm';
import CreateProductWhatsappCamp from './layouts/ecommerce/apps-integration/Notification/WhatsappCampaigns/CreateProductWhatsappCamp';
import CreatePushCampaign from './layouts/ecommerce/apps-integration/Notification/PushCampaigns/CreatePushCampaign';
import CreateStaticCouponForm from './layouts/ecommerce/apps-integration/CouponSettings/CreateStaticCouponForm';
import DeliverAgentDetails from './layouts/ecommerce/pallet-hyperlocal/delivery-agent/components/delivery-details';
import DynamicCouponDetails from './layouts/ecommerce/apps-integration/CouponSettings/DynamicCouponDetails';
import EnvConfig from './config/EnvConfig';
import FranchiseDetailsPage from './layouts/ecommerce/headoffice-store/franchise-detail-page';
import HeadOfficeDefault from './layouts/dashboards/head-office';
import ItemCreateOffer from './layouts/ecommerce/offers-promo/components/create-new/item';
import KnowledgeArticle from './layouts/ecommerce/knowledge-base/components/article';
import KnowledgeCategory from './layouts/ecommerce/knowledge-base/components/pallet-category';
import KnowledgeProducts from './layouts/ecommerce/knowledge-base/components/pallet-products';
import ManualSync from './layouts/ecommerce/apps-integration/Tally/components/ManualSync';
import NotificationPage from './layouts/ecommerce/apps-integration/Notification/NotificationPage';
import OfferAndPromoDetails from './layouts/ecommerce/offers-promo/components/offerDetails';
import PaytmDashboard from './layouts/ecommerce/Pallet-pay/PaytmDashboard';
import PaytmPaymentSettings from './layouts/ecommerce/Pallet-pay/PaytmPaymentSettings';
import PineLabsPaymentSettings from './layouts/ecommerce/Pallet-pay/PineLabsPaymentSettings';
import PushCampaignCreations from './layouts/ecommerce/apps-integration/Notification/PushCampaigns/pushCampaignCreations';
import SettingKnowledgeBase from './layouts/ecommerce/knowledge-base';
import SettlementDetails from './layouts/ecommerce/Pallet-pay/SettlementDetails';
import SingleDynamicDetails from './layouts/ecommerce/apps-integration/CouponSettings/SingleDynamicDetails';
import SingleStaticDetails from './layouts/ecommerce/apps-integration/CouponSettings/SingleStaticDetails';
import StaticCouponDetails from './layouts/ecommerce/apps-integration/CouponSettings/StaticCouponDetails';
import StepsCatalogCreation from './layouts/ecommerce/apps-integration/WhatsappBusiness/components/StepsCatalogCreation';
import Swal from 'sweetalert2';
import WhatsappCatalogDetails from './layouts/ecommerce/apps-integration/WhatsappBusiness/CatalogDetails';
import WidgetSelection from './layouts/ecommerce/all-org-page/BillingInformation/widgetSelection';
import WorkFlowPreview from './layouts/ecommerce/apps-integration/WhatsappBusiness/components/WorkFlowPreview';
import useAllRoutes from './hooks/useAllRoutes';
// import { ProductStockDetails } from './layouts/ecommerce/product/stock-taking/components/product-details';
import { Scheduler } from './layouts/ecommerce/product/stock-taking/components/scheduler';
import { StockDashBoard } from './layouts/ecommerce/product/stock-taking/components/stock-dashboard';
import { StockSessionMonitor } from './layouts/ecommerce/product/stock-taking/components/session-monitor';
import AllIntrusionsReport from './layouts/ecommerce/reports/components/OperatorEffectiveness/AllIntrusionsReport';
import Allorders from './layouts/ecommerce/sales/all-orders';
import BussinessReport from './layouts/ecommerce/reports/components/FullPagereports/MarketingReport';
import ConvertToPOPage from './layouts/ecommerce/purchase-indent/components/pi-details-page/convertToPO';
import CreateExpressGRN from './layouts/ecommerce/purchase-exclusive/components/create-grn';
import ExpressGRNReports from './layouts/ecommerce/reports/components/OperatorEffectiveness/EpressGRNReports/ExpressGRNReports';
import NewPurchaseIndent from './layouts/ecommerce/purchase-indent/components/new-purchase-indent';
import NewPurchaseReturn from './layouts/ecommerce/purchase-returns/components/new-purchase-return';
import OrderDisplaySystem from './layouts/ecommerce/sales-channels/ods';
import PurchaseReturns from './layouts/ecommerce/purchase-returns';
import SingleOperatorReport from './layouts/ecommerce/reports/components/OperatorEffectiveness/SingleOperatorReport';
import TransferDetails from './layouts/ecommerce/product/transfers/components/transfer-details';
import WalletPage from './layouts/ecommerce/wallet/WalletPage';
import { CreateNewJob } from './layouts/ecommerce/inventory/stock-count/pages/stock-count-create-new-job';
import { ProductStockDetails } from './layouts/ecommerce/inventory/stock-count/components/product-details';
import { StockCountDetails } from './layouts/ecommerce/inventory/stock-count/pages/stock-count-details';
import { emit, useNativeMessage } from 'react-native-react-bridge/lib/web';
import NewPurchaseReturnDetailsPage from './layouts/ecommerce/purchase-returns/components/new-purchase-return-details';
import GRNNewDetailsPage from './layouts/ecommerce/purchase-exclusive/components/grn-new-details';
import AssortmentMapping from './layouts/ecommerce/product/assortment-mapping/AssortmentMapping';
import AddBundleProduct from './layouts/ecommerce/product/bundleProduct/AddBundeProduct';
import NewCreateProduct from './layouts/ecommerce/product/new-product-screen/components/create-product';
import NewPurchaseBillDetailsPage from './layouts/ecommerce/purchase-bills/components/new-purchase-bills-details';
import SingleContactPage from './layouts/ecommerce/apps-integration/Notification/ContactList/SingleContactPage';
import { NewTransfer2 } from './layouts/ecommerce/inventory/stock-transfer/pages/newTransfer';
import ProductDepartment from './layouts/ecommerce/products-new-page/components/Department';
import ProductTaxCreation from './layouts/ecommerce/products-new-page/Tax';
import ProductDetailsPage from './layouts/ecommerce/products-new-page/Products-detail-page';
import OnlineProductCategory from './layouts/ecommerce/products-new-page/Online-product-category-page';
import ProductsMainPage from './layouts/ecommerce/products-new-page';
import BrandCreation from './layouts/ecommerce/products-new-page/Brand';
import AllRecipePage from './layouts/ecommerce/products-new-page/Recipe';
import RecipeCreation from './layouts/ecommerce/products-new-page/Recipe/RecipeCreation';
import CartRelatedReports from './layouts/ecommerce/reports/components/OperatorEffectiveness/CartRelatedReports';
import CreateNewSalesOrder from './layouts/ecommerce/sales-order/new-sales/components/create-sales';
import CreatePurchaseOrder from './layouts/ecommerce/purchase-main/components/create-po';
import NewCommonPurchaseDetailsPage from './layouts/ecommerce/purchase/common-purchase-details-page';
import SalesOrderCreateReturn from './layouts/ecommerce/sales-order/returns/components/create-new';
import SalesOrderDetailsPage from './layouts/ecommerce/sales-order/new-sales/components/sales-details';
import SalesPaymentDetails from './layouts/ecommerce/sales-order/payments/components/payment-details';
import { StockTransferDetails } from './layouts/ecommerce/inventory/stock-transfer/pages/stockTransferDetails';
import SalesReturnDetails from './layouts/ecommerce/sales-order/returns/components/return-details';
import MarketingReportChart from './layouts/ecommerce/reports/components/MarketingReportChart';
import BillsAndPaymentReport from './layouts/ecommerce/reports/components/FullPagereports/BillsAndPaymentReport';
import BrandDeatilsComponent from './layouts/ecommerce/products-new-page/Brand/BrandDeatilsComponent';
import './layouts/ecommerce/purchase-indent/components/pi-details-page/pi.css';
import './layouts/ecommerce/vendor/components/vendor-details/vendor-details.css';
import './layouts/ecommerce/sales/all-orders/components/sales-details/sales-details.css';
import './layouts/ecommerce/purchase-indent/components/pi-details-page/pi-det-card.css';
import UrlGeneratorPage from './layouts/ecommerce/products-new-page/UrlGeneratorPage';
import RosAppPurchasePage from './layouts/ecommerce/purchase/ros-app-purchase';
import UpcomingFeatures from './layouts/ecommerce/Common/mobile-new-ui-components/upcoming-features';
import RosAppProducts from './layouts/ecommerce/product/ros-app-products';
import TaxMasterListing from './layouts/ecommerce/products-new-page/Tax/TaxMasterListing';
import ProductTaxSlab from './layouts/ecommerce/products-new-page/Tax/components/Tax-slabs';
import CategoryTaxMapping from './layouts/ecommerce/products-new-page/Tax/components/Category-tax-mapping';
import AllListingPage from './layouts/ecommerce/products-new-page/components/Department/AllListingPage';
import ProductLineOfBusiness from './layouts/ecommerce/products-new-page/components/LineOfBusiness';
import CreateSubDep from './layouts/ecommerce/products-new-page/components/Department/CreateSubDep';
import ProductCategory from './layouts/ecommerce/products-new-page/components/Category';
import CreateClass from './layouts/ecommerce/products-new-page/components/Category/CreateClass';
import CreateSubclass from './layouts/ecommerce/products-new-page/components/Category/CreateSubclass';
import OnlineCategoryListing from './layouts/ecommerce/products-new-page/Online-product-category-page/OnlineCategoryListing';
import CreateLevel2Category from './layouts/ecommerce/products-new-page/Online-product-category-page/CreateLevel2Category';
import CreateLevel3Category from './layouts/ecommerce/products-new-page/Online-product-category-page/CreateLevel3Category';
import Migration from './layouts/ecommerce/migration';
import KnowledgeSubCategory from './layouts/ecommerce/knowledge-base/components/knowledge-subCategory';
import SettingHelpSupport from './layouts/ecommerce/knowledge-base';
import RosAppSalesOrder from './layouts/ecommerce/sales-order/ros-app-sales-order';
import ManufactureCreate from './layouts/ecommerce/products-new-page/Brand/ManufactureCreate';
import NoAccess from './layouts/ecommerce/Common/noAccessMobile';
import AddEmployee from './layouts/ecommerce/hrms/employee/add-employee';
import HrmsEmployee from './layouts/ecommerce/hrms/employee';
import HrmsDepartment from './layouts/ecommerce/hrms/department';
import AddDepartmemnt from './layouts/ecommerce/hrms/department/add-department';
import HrmsDesignation from './layouts/ecommerce/hrms/designation';
import HrmsAddDesignation from './layouts/ecommerce/hrms/designation/add-designation';
import HrmsUpdateEmployeeDetails from './layouts/ecommerce/hrms/employee/edit-employee-details';
import HrmsUpdateDepartmentDetails from './layouts/ecommerce/hrms/department/edit-employee-details';
import HrmsUpdateDesignationDetails from './layouts/ecommerce/hrms/designation/update-designation-details';
import HrmsMaster from './layouts/ecommerce/hrms/master';
import HrmsEmployeeDetailsPage from './layouts/ecommerce/hrms/employee/employee-details-page';
// import HrmsLeave from './layouts/ecommerce/hrms/leave';
// import HrmsAddLeave from './layouts/ecommerce/hrms/leave/add-leave';
import HrmsHoliday from './layouts/ecommerce/hrms/holiday';
import HrmsAddHoliday from './layouts/ecommerce/hrms/holiday/add-holiday';
import HrmsUpdateHoliday from './layouts/ecommerce/hrms/holiday/edit-holiday';
import SubBrandCreate from './layouts/ecommerce/products-new-page/Brand/subBrandCreate';
import BundleDetailsPage from './layouts/ecommerce/product/bundleProduct/bundleDetailsPage';
import RosAppInventory from './layouts/ecommerce/inventory/ros-app-inventory';
import TerminalDetailsPage from './layouts/ecommerce/apps-integration/Pos/components/End_day/components/terminalDetails/terminalDetails';
import TerminalListing from './layouts/ecommerce/apps-integration/Pos/components/End_day/TerminalListing';
import { WrappedDeliveryAddress } from './layouts/ecommerce/market-place/address';
import LocalStorageData from './localStorageData';
import BulkPriceEditUploadListing from './layouts/ecommerce/products-new-page/PriceEditByUpload';
import BulkPriceFileUpload from './layouts/ecommerce/products-new-page/PriceEditByUpload/BulkPriceUpload';
import BulkPriceUploadDetails from './layouts/ecommerce/products-new-page/PriceEditByUpload/BulkPriceUploadDetails';
import PosSettings from './layouts/ecommerce/apps-integration/Pos/PosSettings';
import Project from './layouts/ecommerce/Project/components/ticket';
import CreateTicket from './layouts/ecommerce/Project/components/createTicket';
import TicketDetails from './layouts/ecommerce/Project/components/ticketsDetails';
import PushCampaignDetails from './layouts/ecommerce/apps-integration/Notification/PushCampaigns/PushCampaignDetails';
import ScheduledCampaigns from './layouts/ecommerce/apps-integration/Notification/PushCampaigns/ScheduledCampaigns';
import InventoryNewRepacking from './layouts/ecommerce/product/inward/components/qualityform/components/newRepackingFeature';
import ChatbotHelpSupport from './layouts/ecommerce/help_support';
// import CreateProductRestaurant from './layouts/ecommerce/product/new-product-screen/components/restaurant-create-product';
import RestauarantProductCreation from './layouts/ecommerce/products-new-page/RestaurantProductCreation';
import ProductListingRouter from './layouts/ecommerce/product/ProductListingRouter';
import ProductDetailsRouter from './layouts/ecommerce/product/ProductDetailsRouter';
import PrepStationListing from './layouts/ecommerce/products-new-page/PrepStation/PrepStationListing';
import PrepStationCreation from './layouts/ecommerce/products-new-page/PrepStation/PrepStationCreation';
import CombosCreation from './layouts/ecommerce/products-new-page/Combos/CombosCreation';
import CombosDetailsPage from './layouts/ecommerce/products-new-page/Combos/CombosDetails';
import PalletAIMessenger from './PalletAIMessenger/Messenger';

export const Appstore = createContext();
export default function App() {
  const dispatchEvent = useDispatch();
  const { allRoutes } = useAllRoutes();
  const [controller, dispatch] = useSoftUIController();
  const { miniSidenav, direction, layout, openConfigurator, sidenavColor } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [rtlCache, setRtlCache] = useState(null);
  const { pathname } = useLocation();
  const [cookies, setCookie] = useCookies(['user']);
  const [data, setData] = useState({});
  const [newLogo, setNewLogo] = useState(null);
  const [datState, setDatState] = useState(false);
  const orgId = localStorage.getItem('orgId');
  const contextType = localStorage.getItem('contextType');
  const access_token = localStorage.getItem('access_token');
  const userDetails = localStorage.getItem('user_details');
  const userInfo = userDetails ? JSON.parse(userDetails) : null;
  const navigate = useNavigate();
  const vendorImage = 'https://apps.odoo.com/web/image/loempia.module/78015/icon_image?unique=080eafa';
  const [rmsDeviceType, setRmsDeviceType] = useState(localStorage.getItem('deviceType'));
  // const [webpageLoading, setWebpageLoading] = useState(true);

  const routesNav = allRoutes?.filter((element, index) => {
    return element.layout == layout;
  });
  const [reloadInstalledApps, setReloadInstalledApps] = useState(null);
  const [currPathname, setCurrPathname] = useState('');
  const location = useLocation();
  const isMobileDevice = isSmallScreen();

  const envSigninUrl = EnvConfig().signupUrl;
  let accId = '';

  useNativeMessage((message) => {
    switch (message?.type) {
      case 'storeData': {
        const data = JSON.parse(message?.data);
        Object.entries(data).map(([key, value]) => {
          localStorage.setItem(key, value);
        });
        // emit({ type: 'localStorageUpdate', data: true });
        // setWebpageLoading(false);
        break;
      }
      case 'deviceType': {
        const data = JSON.parse(message?.data);
        // deviceType = 'mobile
        setRmsDeviceType(data?.deviceType);
        localStorage.setItem('deviceType', data?.deviceType);
        // emit({ type: 'userData', data: JSON.stringify({ userData: { ...userInfo, at: access_token } }) });
        break;
      }
      default:
        break;
    }
  });

  useEffect(() => {
    if (orgId !== null && reloadInstalledApps == null) {
      fetchAccoutidbyOrg(orgId)
        .then((res) => {
          // setReloadInstalledApps(Booleanlled(!reloadInstalledApps));
          accId = res?.data?.data?.data?.accountId;
          localStorage.setItem('AppAccountId', accId);

          apps_integerationData(orgId)
            .then((res) => {
              const addonData = res?.data?.data?.data;
              fetchInstalledApps(accId)
                .then((res) => {
                  // console.log('res');
                  // console.log('reload', reloadInstalledApps);
                  const installedAppData = res?.data?.data?.data;
                  if (installedAppData.addonId === null) {
                    localStorage.removeItem('Apps');
                  } else {
                    const installedPackageNames = installedAppData
                      .map((installed) => addonData.find((addon) => addon.addonId === installed.addonId))
                      .filter((matchingAddon) => matchingAddon !== undefined)
                      .map((matchingAddon) => matchingAddon.packageName);

                    localStorage.setItem('Apps', installedPackageNames);
                    dispatchEvent(setInstalledApps(installedPackageNames));
                    AllreadyInstalledApps(installedPackageNames, reloadInstalledApps, setReloadInstalledApps);
                  }
                })
                .catch((err) => {});
            })
            .catch((err) => {});
        })
        .catch((err) => {});
    }
    if (orgId !== null && reloadInstalledApps !== null) {
      fetchAccoutidbyOrg(orgId)
        .then((res) => {
          accId = res?.data?.data?.data?.accountId;
          localStorage.setItem('AppAccountId', accId);
          // appdata
          apps_integerationData(orgId)
            .then((res) => {
              const addonData = res?.data?.data?.data;
              // installedappsdata
              fetchInstalledApps(accId)
                .then((res) => {
                  // console.log('reload', reloadInstalledApps);
                  const installedAppData = res?.data?.data?.data;
                  if (installedAppData.addonId === null) {
                    localStorage.removeItem('Apps');
                  } else {
                    const installedPackageNames = installedAppData
                      .map((installed) => addonData.find((addon) => addon.addonId === installed.addonId))
                      .filter((matchingAddon) => matchingAddon !== undefined)
                      .map((matchingAddon) => matchingAddon.packageName);
                    // console.log('loyalty', installedPackageNames);
                    localStorage.setItem('Apps', installedPackageNames);
                    AllreadyInstalledApps(installedPackageNames);
                    // setInstalledPackageNames(installedPackageNames);
                  }
                })
                .catch((err) => {});
            })
            .catch((err) => {});
        })
        .catch((err) => {});
    }
  }, [reloadInstalledApps]);

  useEffect(() => {
    const intervalDuration = 30 * 60 * 1000; // 30 min
    // const intervalDuration = 30 * 1000; // 3 in milliseconds
    const interval = setInterval(refreshToken, intervalDuration);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleUnauthorized = () => {
    localStorage.clear();
    navigate('/');
    clearCookie('access_token');
    clearCookie('refresh_token');
  };

  useEffect(() => {
    if ((pathname === '/dashboards/RETAIL' || pathname === '/dashboards/VMS') && !access_token) {
      Swal.fire({
        icon: 'error',
        title: 'You do not have access to this page',
        showConfirmButton: true,
        confirmButtonText: 'OK',
      }).then(() => {
        navigate('/');
      });
    }
    if (
      !contextType &&
      (pathname === '/dashboards/RETAIL' || pathname === '/dashboards/VMS') &&
      pathname !== '/AllOrg_loc'
    ) {
      Swal.fire({
        icon: 'error',
        title: 'You do not have access to this page, Select your organization',
        showConfirmButton: true,
        confirmButtonText: 'OK',
      }).then(() => {
        navigate('/AllOrg_loc');
      });
    }
  }, [pathname]);

  const refreshToken = () => {
    const refresh_token = localStorage.getItem('refresh_token');
    if (refresh_token) {
      userRefreshToken()
        .then((res) => {
          if (res?.data?.status === 'ERROR') {
            handleUnauthorized();
            return;
          }
          const accessToken = res?.data?.data?.at;
          const refreshToken = res?.data?.data?.rt;
          localStorage.setItem('access_token', accessToken);
          localStorage.setItem('refresh_token', refreshToken);
          setCookie('access_token', accessToken, { path: '/' });
          setCookie('refresh_token', refreshToken, { path: '/' });
          sessionStorage.setItem('access_token', accessToken);
        })
        .catch((err) => {
          // if (err?.response?.data?.message == 'UNAUTHORIZED RT') {
          handleUnauthorized();
          // }
        });
    } else {
      // handleUnauthorized();
    }
  };

  const generateLogo = (brandName) => {
    const firstLetter = brandName ? brandName.charAt(0).toUpperCase() : '';

    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');

    // Make the canvas transparent
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Change the font family and size here
    const fontFamily = 'Arial'; // Replace with your desired font family
    const fontSize = 86;
    const font = `bold ${fontSize}px ${fontFamily}, sans-serif`;

    ctx.font = font;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Set the color of the text
    ctx.fillStyle = '#ffffff'; // Replace with your desired text color

    // Calculate the coordinates to center the text in the canvas
    const x = canvas.width / 2;
    const y = canvas.height / 2;

    // Draw the first letter at the center of the canvas
    ctx.fillText(firstLetter, x, y);

    // Convert canvas content to an image URL (data URI)
    const logoDataURL = canvas.toDataURL();
    return logoDataURL;
  };

  useEffect(() => {
    if (contextType === 'WMS') {
      getOrgNameLogo(orgId).then((response) => {
        setData(response?.data?.data);
        // localStorage.setItem('data', JSON.stringify(response?.data?.data));
        if (response?.data?.data?.logoUrl === null) {
          const generatedLogo = generateLogo(response?.data?.data?.organisationName);
          setNewLogo(generatedLogo);
        }
        setDatState(true);
      });
    } else if (contextType === 'RETAIL') {
      getCustomerDetails(orgId).then((response) => {
        setData(response?.data?.data?.retail);
        localStorage.setItem('data', JSON.stringify(response?.data?.data?.retail));
        if (response?.data?.data?.retail?.logo === null) {
          const generatedLogo = generateLogo(response?.data?.data?.retail?.displayName);
          setNewLogo(generatedLogo);
        }
      });
    }
  }, [datState]);

  useMemo(() => {
    const cacheRtl = createCache({
      key: 'rtl',
      stylisPlugins: [rtlPlugin],
    });

    setRtlCache(cacheRtl);
  }, []);

  useEffect(() => {
    const cookieData = document.cookie.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.split('=');
      if (value) {
        acc[key.trim()] = value.trim();
        return acc;
      }
    }, {});
    if (cookieData && cookieData?.access_token) {
      const receivedAT = cookieData?.access_token;
      if (receivedAT !== 'undefined') {
        localStorage.setItem('access_token', receivedAT);
        setCookie('access_token', receivedAT, { path: '/' });
        sessionStorage.setItem('access_token', receivedAT);
      }
    }
  }, []);

  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  // Change the openConfigurator state
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

  // Setting the dir attribute for the body element
  useEffect(() => {
    document.body.setAttribute('dir', direction);
  }, [direction]);

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route?.layout == layout) {
        if (route.collapse) {
          return getRoutes(route.collapse);
        }

        if (route.route) {
          return <Route exact path={route.route} element={route.component} key={route.key} />;
        }
      }
      return null;
    });

  //redux updating function calls, (**DO NOT TOUCH**) ============

  const { allProductsFilter } = controller;
  const allProductsPage = useSelector(getAllProductsPage);
  const allProductsAppliedFilterCount = useSelector(getAllProductsFiltersCount);
  useEffect(() => {
    let isMounted = true; // Add a flag to track if the component is mounted
    // if (location.pathname !== '/products/new-transfers') {
    //   localStorage.removeItem('stnNumber');
    // }
    if (location.pathname !== '/purchase/express-grn/create-express-grn') {
      localStorage.removeItem('poNumber');
    }
    if (location.pathname !== '/purchase/purchase-indent/create-purchase-indent') {
      localStorage.removeItem('vendorProdPage');
      localStorage.removeItem('vendorProdTotalPage');
    }
    if (!location.pathname.includes('all-products') && isMounted) {
      if (Object.keys(allProductsFilter).length > 0) {
        setAllProductsFilter(dispatch, {});
      }
    }
    if (
      !location.pathname.includes('all-products') &&
      !location.pathname.includes('edit-product') &&
      !location.pathname.includes('/product/details/') &&
      isMounted
    ) {
      if (allProductsAppliedFilterCount !== 0 || allProductsPage !== 1) {
        dispatchEvent(setAllProductsFilters(null));
        dispatchEvent(setAllProductsFilterStateData(null));
        dispatchEvent(setAllProductsFiltersAppliedCount(0));
        dispatchEvent(setAllProductsPage(1));
      }
    }
    if (
      !location.pathname.includes('purchase-indent') &&
      !location.pathname.includes('all-products') &&
      !location.pathname.includes('edit-product') &&
      isMounted
    ) {
      const resetPiData = {
        purchaseIndentDetails: {
          warehouseName: {},
          assignedTo: [],
          approvedTo: {},
          shippingMethod: {},
          shippingTerm: {},
          startDate: '',
          endDate: '',
          noteTxt: '',
        },
        imputListIndexArray: [],
        data: [
          {
            prodOptions: [],
            itemCode: '',
            itemName: '',
            spec: '',
            quantityOrdered: '',
            finalPrice: '',
            unit: '',
            previousPurchasePrice: '',
            preferredVendor: '',
            barcodeLabel: 'Barcode',
            itemlabel: 'Item Name',
            speclabel: 'Specification',
            quantilabel: 'Quantity',
            pricelabel: 'Previous Price',
            vendorlabel: 'Preferred Vendor',
            key: null,
          },
        ],
      };
      setPIItemList(dispatch, resetPiData);
    }
    return () => {
      isMounted = false; // Set the flag to false when the component is unmounted
    };
  }, [location.pathname, allProductsFilter]);

  useEffect(() => {
    if (process.env.MY_ENV === 'production' && isMobileDevice && rmsDeviceType === null) {
      navigate('/noaccess-mobile');
      return;
    }
  }, [rmsDeviceType]);

  //======================================================================================================

  // if (webpageLoading && rmsDeviceType === 'mobile') {
  //   return (
  //     <div className="app-circular-progress">
  //       <CircularProgress
  //         sx={{
  //           color: '#0562fb !important',
  //         }}
  //       />
  //     </div>
  //   );
  // }
  return direction === 'rtl' ? (
    <CacheProvider value={rtlCache}>
      <ThemeProvider theme={themeRTL}>
        <CssBaseline />
        {layout === 'dashboard' && !isMobileDevice && (
          <>
            {contextType === 'WMS' ? (
              <Sidenav
                color={sidenavColor}
                brand={data?.logoUrl === null ? newLogo : data?.logoUrl}
                brandName={data?.organisationName}
                routes={allRoutes}
                onMouseEnter={handleOnMouseEnter}
                onMouseLeave={handleOnMouseLeave}
              />
            ) : contextType === 'RETAIL' ? (
              <Sidenav
                color={sidenavColor}
                brand={data?.logo === null ? newLogo : data?.logo}
                brandName={data?.displayName ? data?.displayName : ' '}
                routes={allRoutes}
                onMouseEnter={handleOnMouseEnter}
                onMouseLeave={handleOnMouseLeave}
              />
            ) : contextType === 'VMS' ? (
              <Sidenav
                color={sidenavColor}
                // brand={data?.logo}
                brand={vendorImage}
                // brandName={data?.displayName}
                brandName={localStorage.getItem('orgId')}
                routes={allRoutes}
                onMouseEnter={handleOnMouseEnter}
                onMouseLeave={handleOnMouseLeave}
              />
            ) : null}

            <Configurator />
          </>
        )}
        {layout === 'vr' && <Configurator />}
        <Routes>
          {getRoutes(allRoutes)}
          <Route path="*" element={<Illustration />} />
        </Routes>
      </ThemeProvider>
    </CacheProvider>
  ) : (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {layout === 'dashboard' && !isMobileDevice && (
        <>
          {contextType === 'WMS' ? (
            <Sidenav
              color={sidenavColor}
              brand={data?.logoUrl === null ? newLogo : data?.logoUrl}
              brandName={data?.organisationName}
              routes={routesNav}
              onMouseEnter={handleOnMouseEnter}
              onMouseLeave={handleOnMouseLeave}
              width="3.5rem"
              height="3.5rem"
              fontSize="19"
            />
          ) : contextType === 'RETAIL' ? (
            <Sidenav
              color={sidenavColor}
              brand={data?.logo === null ? newLogo : data?.logo}
              brandName={data?.displayName ? data?.displayName : ' '}
              routes={routesNav}
              onMouseEnter={handleOnMouseEnter}
              onMouseLeave={handleOnMouseLeave}
              width="3.5rem"
              height="3.5rem"
              fontSize="19"
            />
          ) : contextType === 'VMS' ? (
            <Sidenav
              color={sidenavColor}
              // brand={data?.logoUrl}
              brand={vendorImage}
              // brandName={data?.organisationName}
              brandName={localStorage.getItem('orgId')}
              routes={routesNav}
              onMouseEnter={handleOnMouseEnter}
              onMouseLeave={handleOnMouseLeave}
              width="3.5rem"
              height="3.5rem"
              fontSize="19"
            />
          ) : null}
        </>
      )}
      {layout === 'settings' && !isMobileDevice && (
        <>
          {contextType === 'WMS' ? (
            <Sidenav
              color={sidenavColor}
              brand={data?.logoUrl === null ? newLogo : data?.logoUrl}
              brandName={data?.organisationName}
              routes={routesNav}
              onMouseEnter={handleOnMouseEnter}
              onMouseLeave={handleOnMouseLeave}
              width="3.5rem"
              height="3.5rem"
              fontSize="19"
            />
          ) : contextType === 'RETAIL' ? (
            <Sidenav
              color={sidenavColor}
              brand={data?.logo === null ? newLogo : data?.logo}
              brandName={data?.displayName ? data?.displayName : ' '}
              routes={routesNav}
              onMouseEnter={handleOnMouseEnter}
              onMouseLeave={handleOnMouseLeave}
              width="3.5rem"
              height="3.5rem"
              fontSize="19"
            />
          ) : contextType === 'VMS' ? (
            <Sidenav
              color={sidenavColor}
              // brand={data?.logo}
              brand={vendorImage}
              // brandName={data.displayName}
              brandName={localStorage.getItem('orgId')}
              routes={routesNav}
              onMouseEnter={handleOnMouseEnter}
              onMouseLeave={handleOnMouseLeave}
              width="3.5rem"
              height="3.5rem"
              fontSize="19"
            />
          ) : null}
        </>
      )}
      {layout === 'hrms' && (
        <>
          {contextType === 'WMS' ? (
            <Sidenav
              color={sidenavColor}
              brand={data?.logoUrl === null ? newLogo : data?.logoUrl}
              brandName={data?.organisationName}
              routes={routesNav}
              onMouseEnter={handleOnMouseEnter}
              onMouseLeave={handleOnMouseLeave}
              width="3.5rem"
              height="3.5rem"
              fontSize="19"
            />
          ) : contextType === 'RETAIL' ? (
            <Sidenav
              color={sidenavColor}
              brand={data?.logo === null ? newLogo : data?.logo}
              brandName={data?.displayName ? data?.displayName : ' '}
              routes={routesNav}
              onMouseEnter={handleOnMouseEnter}
              onMouseLeave={handleOnMouseLeave}
              width="3.5rem"
              height="3.5rem"
              fontSize="19"
            />
          ) : contextType === 'VMS' ? (
            <Sidenav
              color={sidenavColor}
              // brand={data?.logo}
              brand={vendorImage}
              // brandName={data.displayName}
              brandName={localStorage.getItem('orgId')}
              routes={routesNav}
              onMouseEnter={handleOnMouseEnter}
              onMouseLeave={handleOnMouseLeave}
              width="3.5rem"
              height="3.5rem"
              fontSize="19"
            />
          ) : null}
        </>
      )}

      {layout === 'vr' && <Configurator />}

      <Routes>
        {getRoutes(allRoutes)}
        <Route path="*" element={<E404Page />} />
        <Route path="/" element={<Illustration />} />
        <Route path="/protected" element={<ProtectedIllustration />} />
        <Route path="/verify-otp" element={<VerifyOtpBasic />} />
        <Route path="/AllOrg_loc" element={<AllOrg_loc />} />
        <Route path="/noaccess-mobile" element={<NoAccess />} />
        <Route path="/localstorage-data" element={<LocalStorageData />} />

        <Route exact path="/" element={<ProtectedNoAT />}>
          <Route path="/upcoming-feature" element={<UpcomingFeatures />} />
          <Route path="/sign-in/otp/:mobile" element={<OtpVerify />} />
          <Route exact path="/" element={<ProtectedNoORGID />}>
            <Route path={`/dashboards/${contextType}`} element={<Default />} />
            <Route path={'/dashboards/head-office'} element={<HeadOfficeDefault />} />
            <Route path="/hrms-employee" element={<HrmsEmployee />} />
            <Route path="/hrms/add-employee" element={<AddEmployee />} />
            <Route path="/hrms/updateEmployeeDetails/:id" element={<HrmsUpdateEmployeeDetails />} />
            <Route path="/hrms/employeeDetailsPage/:id" element={<HrmsEmployeeDetailsPage />} />
            <Route path="/hrms-department" element={<HrmsDepartment />} />
            <Route path="/hrms/add-department" element={<AddDepartmemnt />} />
            <Route path="/hrms/updateDepartmentDetails/:id" element={<HrmsUpdateDepartmentDetails />} />
            <Route path="/hrms-designation" element={<HrmsDesignation />} />
            <Route path="/hrms/updateDesignationDetails/:id" element={<HrmsUpdateDesignationDetails />} />
            <Route path="/hrms/add-designation" element={<HrmsAddDesignation />} />
            {/* <Route path="/hrms-leave" element={<HrmsLeave />} />
            <Route path="/hrms/add-leave" element={<HrmsAddLeave />} /> */}
            <Route path="/hrms-holiday" element={<HrmsHoliday />} />
            <Route path="/hrms/add-holiday" element={<HrmsAddHoliday />} />
            <Route path="/hrms/updateHoliday/:id" element={<HrmsUpdateHoliday />} />
            <Route path="/hrms-master" element={<HrmsMaster />} />

            <Route exact path="/" element={<ProtectedProductWrite />}>
              <Route path="/products/all-products/add-products" element={<NewCreateProduct />} />
              <Route path="/products/all-products/restaurant/add-products" element={<RestauarantProductCreation />} />
              <Route
                path="/products/all-products/restaurant/add-products/:id"
                element={<RestauarantProductCreation />}
              />
              {/* <Route path="/products/all-products/restaurant/details/:id" element={<RestaurantDetailsPage />} /> */}
              {/* <Route path="/products/all-products/add-products/restaurant" element={<CreateProductRestaurant />} /> */}
              <Route path="/purchase/vendors/products/add-products" element={<AddProducts />} />
              {/* <Route path="/products/all-products/add-products/:bundle" element={<AddProducts />} /> */}
              <Route path="/products/all-bundle-products/add-products/:bundle" element={<AddBundleProduct />} />
              <Route path="/products/edit-bundle/:bundleId" element={<AddBundleProduct />} />
              <Route path="/inventory/repacking/create" element={<InventoryNewRepacking />} />
              <Route path="/products/edit-product/:id" element={<NewCreateProduct />} />
            </Route>
            <Route exact path="/" element={<ProtectedProductRoute />}>
              <Route path="/products/all-products/details/:id" element={<ProductDetails />} />
              <Route path="/products/barcode/details" element={<BarcodeDetailsPage />} />
              <Route path="/products/inventory/details" element={<InventoryDetailsPage />} />
              {/* <Route path="/products/new-transfers" element={<Test />} /> */}
              <Route path="/products/new-transfers" element={<NewTransfer />} />
              <Route path="/products/new-transfers/:stn" element={<NewTransfer />} />
              <Route path="/inventory/transfers/:stn" element={<TransferDetails />} />
              <Route path="/inventory/inward" element={<Inward />} />
              {/* <Route path="/inventory/repacking/create" element={<InventoryNewRepacking />} /> */}
              <Route path="/products/quality-checking/:po" element={<InwardQr />} />
              <Route path="/products/rejection" element={<RejectionForm />} />
              <Route path="/products/putaway" element={<Putaway />} />
              <Route path="/products/inwarddetails/:id" element={<InwardDetails />} />

              <Route path="/product/production" element={<Production />} />
              <Route path="/product/production/details" element={<Productiondetails />} />
              <Route path="/product/production/settings" element={<ProductionSettings />} />
              <Route path="/product/production-mapping" element={<ProductionMapping />} />
              <Route path="/products/inwarddetails/:id" element={<InwardDetails />} />
              <Route path="/products/all-products" element={<ProductListingRouter />} />
              <Route path="/products/pricing" element={<BulkPriceEdit />} />
              {/* <Route path="/inventory/inventory" element={<Inventory />} /> */}
              <Route path="/reports/inventory-analaysis" element={<Inventory showExport={true} />} />
              <Route path="/inventory/transfers" element={<Transfers />} />
              <Route path="/products/bulk-products" element={<BulkProductHistory />} />
              <Route path="/products/ros-app-products" element={<RosAppProducts />} />
              <Route path="/products/bulk-upload" element={<BulkUpload />} />
              {/* new  */}
              <Route path="/inventory/new-transfers" element={<NewTransfer2 />} />
              <Route path="/inventory/new-transfers/:stn" element={<NewTransfer2 />} />
              <Route path="/inventory/stock-transfer-details/:stn" element={<StockTransferDetails />} />
              <Route path="/inventory/repacking" element={<Inward />} />
              <Route path="/inventory/ros-app-inventory" element={<RosAppInventory />} />
            </Route>
            <Route exact path="/" element={<ProtectedMarketplaceWriteRoute />}>
              <Route path="/cart" element={<CartPage />} />
            </Route>
            <Route exact path="/" element={<ProtectedMarketplaceRoute />}>
              <Route path="/market-place/products/details/:gtin" element={<MarketProdDetails />} />
              <Route path="/market-place/:id" element={<SingleProductMarket />} />
              <Route path="/order-placed/:orderId" element={<OrderPlaced />} />
            </Route>
            <Route exact path="/" element={<ProtectedCustomersWrite />}>
              <Route path="/customer/addcustomer" element={<AddCustomer />} />
            </Route>
            <Route exact path="/" element={<ProtectedCustomersRoute />}>
              <Route path="/customer/details" element={<CustomerDetails />} />
              <Route path="/customer" element={<Customer />} />
            </Route>
            <Route exact path="/" element={<ProtectedPurchaseWrite />}>
              <Route path="/purchase/add-vendor" element={<AddVendor />} />
              <Route path="/purchase/edit-vendor/:editVendorId" element={<AddVendor />} />
              <Route path="/purchase/new-bills" element={<Createbills />} />
              <Route path="/purchase/purchase-indent/create-purchase-indent" element={<NewPurchaseIndent />} />
              <Route
                path="/purchase/purchase-indent/create-purchase-indent/:piNumber"
                element={<NewPurchaseIndent />}
              />
              <Route path="/purchase/purchase-indent/convert-to-po/:piNum" element={<ConvertToPOPage />} />
              <Route
                path="/purchase/purchase-orders/create-purchase-order/:piNum/:vendorId"
                element={<CreatePurchaseOrder />}
              />
              <Route path="/purchase/purchase-orders/create-purchase-order/:piNum" element={<CreatePurchaseOrder />} />
              <Route path="/purchase/create-bills/:poNumber" element={<Createbills />} />
              <Route path="/purchase/express-grn/create-express-grn" element={<CreateExpressGRN />} />
              <Route path="/purchase/purchase-returns/new-return" element={<NewPurchaseReturn />} />
              <Route path="/purchase/purchase-returns/new-return/:id" element={<NewPurchaseReturn />} />
              <Route path="/purchase/express-grn/create-express-grn/:id" element={<CreateExpressGRN />} />
              <Route path="/purchase/ros-app-purchase" element={<RosAppPurchasePage />} />
            </Route>
            <Route exact path="/" element={<ProtectedPurchaseRoute />}>
              <Route path="/purchase/vendors/details/:vendorId" element={<VendorDetailsPage />} />
              <Route path="/purchase/express-grn/details/:epoNumber" element={<GRNNewDetailsPage />} />
              <Route path="/purchase/purchase-indent/details/:purchaseId" element={<NewCommonPurchaseDetailsPage />} />
              <Route path="/purchase/purchase-orders/details/:purchaseId" element={<NewCommonPurchaseDetailsPage />} />
              <Route path="/purchase/purchase-bills/details/:billId" element={<NewPurchaseBillDetailsPage />} />
              <Route
                path="/purchase/purchase-returns/details/:purchaseReturnId"
                element={<NewPurchaseReturnDetailsPage />}
              />
              <Route path="/purchase/vendors" element={<Vendor />} />
              <Route path="/purchase/purchase-indent" element={<PurchaseIndent />} />
              <Route path="/purchase/purchase-orders" element={<Purchasemain />} />
              <Route path="/purchase/express-grn" element={<PurchaseExclusive />} />
              <Route path="/purchase/purchase-returns" element={<PurchaseReturns />} />
              <Route path="/purchase/purchase-bills" element={<Purchasebills />} />
              <Route path="/purchase/payments-made" element={<Purchasemade />} />
              <Route path="/ecommerce/refunds" element={<Referral />} />
              <Route path="/purchase/vendors/bulk-upload/history" element={<BulkVendorUploadHistory />} />
            </Route>
            <Route exact path="/" element={<ProtectedSalesOrderWrite />}>
              {/* <Route path="/sales/all-orders/new" element={<NewSalesForm />} /> */}
              <Route path="/sales/all-orders/new" element={<CreateNewSalesOrder />} />
            </Route>
            <Route exact path="/" element={<ProtectedSalesOrderRoute />}>
              <Route path="/sales/package/new" element={<NewSalesPurchase />} />
              <Route path="/sales/package/details" element={<PurchaseDetailsPage />} />
              <Route path="/sales/payments-recieved/details" element={<PaymentRecievedDetailsPage />} />
              <Route path="/sales/returns/:orderId/:returnId" element={<SalesReturnDetails />} />
              <Route path="/sales/returns/add" element={<SalesOrderCreateReturn />} />
              <Route path="/sales/returns/add/:id" element={<SalesOrderCreateReturn />} />
              {/* <Route path="/order/details/:orderId" element={<SalesDetails />} /> */}
              <Route path="/order/details/:orderId" element={<SalesOrderDetailsPage />} />
              <Route path="/marketplace-order/details/:orderId" element={<MarketplaceDetails />} />
              <Route path="/sales/payments/:paymentId/:orderId" element={<SalesPaymentDetails />} />
              <Route path="/sales/ros-app-sales-order" element={<RosAppSalesOrder />} />
            </Route>
            <Route exact path="/" element={<ProtectedSettingsRoute />}>
              <Route path="/setting/locations/new" element={<MapperNewLoc />} />
              <Route path="/setting/locations/shop/:locationId" element={<MapperLocDetail />} />
              <Route path="/setting/gift" element={<Gift />} />
              <Route path="/setting-users-roles" element={<Userroles />} />
              <Route path="/setting/account/new" element={<Addstaff />} />
              <Route path="/setting-organisation" element={<MapperOrg />} />
              <Route path="/setting-migration" element={<Migration />} />
              <Route path="/setting/gift-card" element={<Gift />} />
              <Route path="/setting/sales" element={<Saleschannel />} />
              <Route path="/setting/plan" element={<Plan />} />
              <Route path="/setting/integration" element={<Integration />} />
              <Route path="/setting-diagnostics" element={<Diagnostics />} />
              <Route path="/setting/taxes" element={<Taxmaster />} />
              <Route path="/setting-all-layouts" element={<AllLayouts />} />
              <Route path="/setting/multiple-layout/" element={<Multiplelayout />} />
              <Route path="/setting/layout-table/" element={<LayoutTable />} />
              <Route path="/setting/layout-edit-component" element={<EditLayoutComponents />} />
              <Route path="/setting/layout/hierarchy" element={<Layout />} />
              <Route path="/setting/layout/add-hierarchy" element={<AddHierarchy />} />
              <Route path="/setting/layout/add-hierarchy-components" element={<AddHierarchyNew />} />

              <Route path="/setting-help-and-support" element={<SettingHelpSupport />} />
              <Route path="/setting-help-and-support/:title" element={<KnowledgeProducts />} />
              <Route path="/setting-help-and-support/:title/:category" element={<KnowledgeCategory />} />
              <Route
                path="/setting-help-and-support/:title/:category/:subCategory"
                element={<KnowledgeSubCategory />}
              />
              <Route
                path="/setting-help-and-support/:title/:category/:subCategory/:articleId"
                element={<KnowledgeArticle />}
              />
              <Route path="/setting-help-and-support/raise-ticket/project" element={<Project />} />
              <Route path="/project/create" element={<CreateTicket />} />
              <Route path="/project/edit-ticket/:taskId" element={<CreateTicket />} />
              <Route path="/project/details/:taskId" element={<TicketDetails />} />
            </Route>

            {/* <Route exact path="/" element={<ProtectedDashboardRoute />}> */}
            <Route path="/profile" element={<Profilepage />} />
            <Route path="/sellers/add-vendor/:vendorType" element={<AddVendor headOffice={true} />} />
            <Route path="/sellers/vendors/details/:vendorId" element={<VendorDetailsPage />} />
            {/* <Route path="/organization/locations" element={<AllLocPage />} /> */}
            <Route path="/organization/organizations" element={<AllOrgPage />} />
            {/* </Route> */}
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/multiple-layout/:id" element={<Multiplelayout />} />
            <Route path="/setting/edit-layouts/" element={<EditLayouts />} />
            <Route path="/ecommerce/table" element={<Testcomp />} />
            <Route path="/pricingPage" element={<PricingPage />} />
            <Route path="/contact-sales" element={<ContactSales />} />

            {/* Apps Integration */}
            <Route exact path="/" element={<ProtectedAppsIntegrationRoute />}>
              <Route path="/tally/manual-sync" element={<ManualSync />} />
              <Route
                path="/app/Pallet_push"
                element={
                  <Appnamecard
                    name={'Pallet push'}
                    description={'Streamline and optimize marketing campaigns.'}
                    reloadInstalledApps={reloadInstalledApps}
                    setReloadInstalledApps={setReloadInstalledApps}
                  />
                }
              />
              <Route
                path="/app/Coupons"
                element={
                  <Appnamecard
                    name={'Coupons'}
                    description={'Generate and distribute digital coupons for promotions'}
                    reloadInstalledApps={reloadInstalledApps}
                    setReloadInstalledApps={setReloadInstalledApps}
                  />
                }
              />
              <Route
                path="/app/Loyalty_program"
                element={
                  <Appnamecard
                    name={'Loyalty program'}
                    description={' Create and manage customer loyalty programs.'}
                    reloadInstalledApps={reloadInstalledApps}
                    setReloadInstalledApps={setReloadInstalledApps}
                  />
                }
              />
              <Route
                path="/app/Gift_cards"
                element={
                  <Appnamecard
                    name={'Gift cards'}
                    description={' Offer digital gift cards for easy gifting and customer rewards.'}
                  />
                }
              />
              <Route
                path="/app/Order_fulfillment"
                element={
                  <Appnamecard
                    name={'Order fulfillment'}
                    description={
                      ' Integrate with third party logistics providers for first, middle and last mile deliveries. A comprehensive order fulfillment system that streamlines the process from receiving an order to delivering it to the customer. It includes features such as order management, inventory tracking, and shipping integration.'
                    }
                  />
                }
              />
              <Route
                path="/app/Sales_channels"
                element={
                  <Appnamecard
                    name={'Sales channels'}
                    description={'Expand sales reach across multiple platforms and channels.'}
                  />
                }
              />
              <Route
                path="/app/Accounting_and_Finance"
                element={
                  <Appnamecard
                    name={'Accounting and Finance'}
                    description={
                      "Tally, Zoho Books, Quickbooks, ICICI etc. An accounting and finance software that simplifies financial management tasks such as bookkeeping, invoicing, expense tracking, and financial reporting. It provides insights into your business's financial health and helps ensure compliance."
                    }
                  />
                }
              />
              <Route
                path="/app/PayTM"
                element={
                  <Appnamecard
                    name={'PayTM'}
                    description={'Offer Paytm as a payment option for seamless transactions.'}
                    reloadInstalledApps={reloadInstalledApps}
                    setReloadInstalledApps={setReloadInstalledApps}
                  />
                }
              />
              <Route
                path="app/Pallet_POS"
                element={
                  <Appnamecard
                    name={'Pallet POS'}
                    description={'Efficiently manage billing and transactions with Pallet POS.'}
                    reloadInstalledApps={reloadInstalledApps}
                    setReloadInstalledApps={setReloadInstalledApps}
                  />
                }
              />
              <Route
                path="/app/Mobile%20App"
                element={
                  <Appnamecard
                    name={'Mobile App'}
                    description={''}
                    reloadInstalledApps={reloadInstalledApps}
                    setReloadInstalledApps={setReloadInstalledApps}
                  />
                }
              />
              <Route
                path="app/Pallet_Self_Ordering_Kiosk"
                element={
                  <Appnamecard
                    name={'Pallet Self Ordering Kiosk'}
                    description={'Enable self-service ordering and payment kiosks.'}
                  />
                }
              />
              <Route
                path="app/Pallet_Handheld_POS"
                element={
                  <Appnamecard
                    name={'Pallet Handheld POS'}
                    description={'Streamline mobile billing with Pallet Handheld POS.'}
                  />
                }
              />
              <Route
                path="app/Pallet_Hyperlocal"
                element={
                  <Appnamecard
                    name={'Pallet Hyperlocal'}
                    description={
                      ' Discover local businesses, stores, and deals in your area through this location-based app, supporting the local economy and fostering community engagement.'
                    }
                  />
                }
              />
              <Route
                path="app/Amazon"
                element={
                  <Appnamecard name={'Amazon'} description={'Enhance sales by listing products on Amazon Pantry.'} />
                }
              />
              <Route
                path="app/Flipkart"
                element={
                  <Appnamecard
                    name={'Flipkart'}
                    description={'Boost sales by selling products on the Flipkart platform.'}
                  />
                }
              />
              <Route
                path="app/Zomato"
                element={
                  <Appnamecard name={'Zomato'} description={"Tap into Zomato's customer base for increased sales."} />
                }
              />
              <Route
                path="app/Dunzo"
                element={
                  <Appnamecard
                    name={'Dunzo'}
                    description={'Tap into the delivery services of Dunzo for seamless sales.'}
                  />
                }
              />
              <Route
                path="app/Swiggy"
                element={
                  <Appnamecard name={'Swiggy'} description={"Extend sales through SwiggyMart's online marketplace."} />
                }
              />
              <Route
                path="app/Zoho_Books"
                element={
                  <Appnamecard
                    name={'Zoho Books'}
                    description={'Manage accounting and financial processes with Zohobooks.'}
                  />
                }
              />
              <Route
                path="app/Tally"
                element={
                  <Appnamecard
                    name={'Tally'}
                    description={'Utilize Tally for efficient and accurate accounting tasks.'}
                    reloadInstalledApps={reloadInstalledApps}
                    setReloadInstalledApps={setReloadInstalledApps}
                  />
                }
              />
              <Route path="app/Quickbooks" element={<Appnamecard name={'Quickbooks'} description={''} />} />
              <Route
                path="app/Pinelabs"
                element={
                  <Appnamecard
                    name={'Pinelabs'}
                    description={'Utilize Pinelabs for secure and reliable payment processing.'}
                    reloadInstalledApps={reloadInstalledApps}
                    setReloadInstalledApps={setReloadInstalledApps}
                  />
                }
              />
              <Route
                path="app/ICICI_Easypay"
                element={
                  <Appnamecard name={'ICICI Easypay'} description={'Enable ICICI Easy Pay for hassle-free payments.'} />
                }
              />
              <Route
                path="app/Porter"
                element={
                  <Appnamecard
                    name={'Porter'}
                    description={"Optimize last-mile delivery with Porter's logistics services."}
                  />
                }
              />
              <Route path="app/Delhivery" element={<Appnamecard name={'Delhivery'} description={''} />} />
              <Route
                path="app/Pallet_Delhivery"
                element={
                  <Appnamecard
                    name={'Pallet Delhivery'}
                    description={"Simplify logistics operations with Pallet's solutions."}
                  />
                }
              />
              <Route
                path="app/BlinkIt"
                element={
                  <Appnamecard
                    name={'BlinkIt'}
                    description={'Utilize BlinkIt to boost sales and reach new customers.'}
                  />
                }
              />
              <Route path="app/MPOS" element={<Appnamecard name={'MPOS'} description={''} />} />
              <Route path="app/WPOS" element={<Appnamecard name={'WPOS'} description={''} />} />
              <Route path="app/:AddonId" element={<Appnamecard description={''} />} />
              {/* wallet page  */}
              <Route path="/wallet" element={<WalletPage />} />
              {/* Notificationsettings */}
              <Route path="/notifications" element={<NotificationPage />} />
              <Route path="/Notificationsettings" element={<Notificationsettings />} />
              <Route path="/notificationconnect" element={<Notificationconnect />} />
              <Route path="/allnotificationpage/:id" element={<Allnotificationpage />} />
              <Route path="/notification-category" element={<NotificationCategory />} />
              <Route path="/notification/register" element={<RegisterToMeta />} />
              <Route path="/marketing/Coupons" element={<CouponNewDashboard />} />
              <Route path="/tally/settings" element={<TallySettings />} />
              <Route path="/tally/form" element={<Tallyform />} />
              <Route path="/tally/details-page" element={<TallyDetails />} />
              <Route path="/coupons/create" element={<Createcoupon />} />
              <Route path="/coupons/create/cart-value" element={<CartCoupon />} />
              <Route path="/coupons/create/product" element={<ProductCoupon />} />
              <Route path="/coupons/create/preapproved" element={<PreapprovedCoupon />} />
              <Route path="/coupons/create/freebie" element={<FreebieCoupon />} />
              <Route path="/coupons/create/dynamic" element={<DynamicCoupon />} />
              <Route path="/marketing/loyaltysettings" element={<Loyalitysettings />} />
              <Route path="/addLoyalityPoints" element={<LoyalityPointsform />} />
              <Route path="/marketing/Coupons/types" element={<CreateCouponMainPage />} />
              <Route path="/marketing/Coupons/static/create" element={<CreateStaticCouponForm />} />
              <Route path="/marketing/Coupons/dynamic/create" element={<CreateDynamicCouponForm />} />
              <Route path="/marketing/Coupons/types/dynamic/details" element={<DynamicCouponDetails />} />
              <Route path="/marketing/Coupons/static/details/:id" element={<StaticCouponDetails />} />
              <Route path="/marketing/Coupons/dynamic/:id" element={<SingleDynamicDetails />} />
              <Route path="/marketing/Coupons/static/:id" element={<SingleStaticDetails />} />
              {/* <Route path="/loyality/loyalitypoints" element={<LoyalityPointsGrid />} /> */}
              <Route path="/campaigns" element={<CampaignPage />} />
              <Route path="/campaigns/whatsapp" element={<WhatsappCampaign />} />
              <Route path="/campaigns/whatsapp/create" element={<CreateWhatsAppCampaign />} />
              <Route path="/campaigns/whatsapp/create/template" element={<WhatsappTemplateCreations />} />
              <Route path="/marketing/contacts" element={<ContactPage />} />
              <Route path="/marketing/contacts/import" element={<AddContacts />} />
              <Route path="/marketing/contacts/import/upload" element={<UploadContact />} />
              <Route path="/marketing/contacts/import/copy-paste" element={<CopyPasteContacts />} />
              <Route path="/marketing/contacts/:segmentId" element={<SingleContactPage />} />
              <Route path="/campaigns/whatsapp/:id" element={<WhatsappCampaignStats />} />
              <Route path="/campaigns/push/:id" element={<PushCampaignDetails />} />
              <Route path="/campaigns/whatsapp/templates" element={<AllWhatsappTemplates />} />
              <Route path="/notification/add/category" element={<AddCategory />} />
              <Route path="/campaigns/push" element={<AllPushCampaigns />} />
              <Route path="/campaigns/push/template/create" element={<CreatePushCampaign />} />
              <Route path="/campaigns/templates/list/push" element={<AllPushTemplates />} />
              <Route path="/campaigns/push/create" element={<PushCampaignCreations />} />
              <Route path="/marketing/campaigns/automated" element={<AutomatedPage />} />
              <Route path="/marketing/campaigns/automated/:journeyId" element={<AutomatedCampaignSingle />} />
              <Route path="/marketing/campaigns/automated/create" element={<CreateAutomatedForm />} />
              <Route path="/marketing/campaigns/type" element={<CampaignTypePage />} />
              <Route path="/marketing/whatsapp-commerce/catalog" element={<BusinessFlow />} />
              <Route path="/campaigns/whatsapp/create/template/product" element={<CreateProductWhatsappCamp />} />
              <Route path="/marketing/whatsapp-business/steps" element={<StepsCatalogCreation />} />
              <Route path="/marketing/whatsapp-business/workflow/preview" element={<WorkFlowPreview />} />
              <Route path="/marketing/contacts/all-contacts" element={<AllcontactsPage />} />
              <Route path="/marketing/contacts/create" element={<CreateCustomAudience />} />
              <Route path="/marketing/whatsapp-commerce/catalog/details" element={<WhatsappCatalogDetails />} />
              <Route path="/marketing/campaign/scheduled/:id" element={<ScheduledCampaigns />} />
            </Route>
            <Route path="/marketing/pallet-push" element={<Settingspage />} />
            <Route path="/new-page" element={<NewPage />} />
            <Route path="/Showinstalledapp" element={<Showinstalledapp />} />
            <Route path="/Billinginfo" element={<Billinginfo />} />
            <Route path="/Billinginfo/cancelplan" element={<Cancelsubscription />} />
            <Route path="/BillingPage" element={<BillingPage />} />
            <Route path="/addfleetmanagment" element={<Fleetmanagmentform />} />
            <Route path="/adddeliveryAgent" element={<DeliveryAgentsform />} />
            <Route path="/Allapps" element={<Allapps />} />
            <Route path="/pos/settings" element={<PosSettings />} />
            <Route path="/reports/Generalreports" element={<Generalreports />} />
            <Route path="/reports/Generalreports/:reportId" element={<Generalreports />} />
            <Route path="/sales_channels/pos" element={<PosNewDashboard />} />
            {/* <Route path="/pallet_pay/settings" element={<PalletPaySettings />} /> */}
            <Route path="/reports/purchasereport" element={<Purchasereport />} />
            <Route path="/reports/inventoryreport" element={<Inventoryreport />} />
            <Route path="/reports/Salesreport" element={<Salesreport />} />
            <Route path="/reports/bills&paymentreport" element={<BillsAndPaymentReport />} />
            <Route path="/reports/Gstreports" element={<Gstreports />} />
            <Route path="/reports/bussiness-report" element={<BussinessReport />} />
            <Route path="/order/online_payment" element={<OrderProcessing />} />
            <Route path="/pallet-pay/paymentmachine" element={<Paymentmachine />} />
            <Route path="/pallet-pay/MDRdetails" element={<MDRdetails />} />
            <Route path="/pallet-pay/settlement-details/:date" element={<SettlementDetails />} />
            <Route path="/pallet-pay/payment-mode" element={<PaymentMode />} />
            <Route path="/pos/addposmachines/:licenseType" element={<AddPosmachines />} />
            <Route path="/pos/Addstaffpos" element={<AddstaffPos />} />
            <Route path="/reports/Saleschart" element={<SalesReportchart />} />
            <Route path="/reports/Saleschart/:reportId" element={<SalesReportchart />} />
            <Route path="/reports/gstchart" element={<GstReportChart />} />
            <Route path="/reports/gstchart/:reportId" element={<GstReportChart />} />
            <Route path="/reports/InventoryChart" element={<InventoryReportchart />} />
            <Route path="/reports/InventoryChart/:reportId" element={<InventoryReportchart />} />
            <Route path="/sales_channels/pos/end_day" element={<EndDay />} />
            <Route path="/sales_channels/pos/terminal/details" element={<EndDay terminalDetails={true} />} />
            <Route path="/sales_channels/pos/terminals" element={<TerminalListing />} />
            <Route path="/reports/operator-effectiveness/:id" element={<SingleOperatorReport />} />
            <Route path="/reports/operator-effectiveness" element={<AllIntrusionsReport />} />
            <Route path="/reports/expressGRN" element={<ExpressGRNReports />} />
            <Route path="/reports/marketing/:reportId" element={<MarketingReportChart />} />
            <Route path="reports/cart-delete" element={<CartRelatedReports />} />
            {/* <Route
              path="/sales_channels/pos/terminal_details/:licenseId/:licenseName/:status"
              element={<SessionDetailsPage />}
            /> */}
            <Route path="/sales_channels/pos/terminal_details/:licenseId" element={<TerminalDetailsPage />} />
            <Route path="/sales_channels/pos/end_day_details" element={<EndDayDetailsPage />} />
            <Route path="/sales_channels/pos/closeSession/:sessionId/:licenseId" element={<Closing />} />
            <Route path="/palletpay/vendor/settings" element={<VendorFormData />} />
            {/* <Route path="/palletpay/request/machines" element={<RequestedMachine />} />  */}
            <Route path="/palletpay/request/Details" element={<RequestDetails />} />
            <Route path="/palletpay/vendor/settings/:vendorId" element={<VendorFormData />} />
            <Route path="/coupondetails/:CouponId" element={<CouponActivateDeactivate />} />
            <Route path="/coupondashboard/:CouponId" element={<CouponDashboard />} />
            <Route path="/reports/pos/:reportId" element={<PosReportchart />} />
            <Route path="/pallet-hyperlocal/add-delivery-agent" element={<AddDeliveryAgent />} />
            <Route path="/pallet-hyperlocal/delivery-agent/details/:id" element={<DeliverAgentDetails />} />
            <Route path="/pallet-hyperlocal/serviceability/pincode" element={<PincodeServiceableArea />} />
            <Route path="/pallet-hyperlocal/serviceability/pincode/:id" element={<ServiceDetails />} />
            <Route path="/pallet-hyperlocal/customize" element={<ComponentCreation />} />
            <Route path="/pallet-hyperlocal/customize/banner" element={<BannerSelection />} />
            <Route path="/pallet-hyperlocal/customize/banner/:bannerId" element={<BannerSelection />} />
            <Route path="/pallet-hyperlocal/customize/banner/available" element={<BannerEditPreview />} />
            <Route path="/pallet-hyperlocal/customize/tags" element={<TagsSelect />} />
            <Route path="/pallet-hyperlocal/customize/tags/:tagId" element={<TagsSelect />} />
            <Route path="/products/assortment-mapping" element={<AssortmentMapping />} />
            <Route path="/pallet-hyperlocal/customize/brand" element={<BrandStore />} />
            <Route path="/pallet-hyperlocal/customize/brand/:brandId" element={<BrandStore />} />
            <Route path="/pallet-hyperlocal/customize/brand/preview" element={<BrandEditPreview />} />
            <Route path="/pallet-hyperlocal/customize/categories" element={<CategoriesSelect />} />
            <Route path="/pallet-hyperlocal/customize/categories/:categoryId" element={<CategoriesSelect />} />
            <Route path="/pallet-hyperlocal/customize/categories/preview" element={<CategoryEditPreview />} />
            <Route path="/pallet-hyperlocal/customize/tag/filter" element={<TagFilter />} />
            <Route path="/sales_channels/ods" element={<OrderDisplaySystem />} />
            {/* <Route path="/test-export" element={<TestComponent />} /> */}
            <Route path="/new-loyalty-config/configuration/:category/:type" element={<NewLoyaltyConfig />} />
            <Route path="/new-loyalty-config/type-selection" element={<LoyaltyProgramTypeSelection />} />
            <Route path="/new-loyalty-config/bonus-points" element={<BonusPoints />} />
            <Route path="/new-loyalty-config/reminder" element={<LoyaltyReminder />} />
            <Route path="/new-loyalty-config/channels" element={<LoyaltyChannels />} />
            <Route path="/new-loyalty-config/mutiple-order-alert" element={<MultipleOrderAlert />} />
            <Route path="/new-loyalty-config/edit/review" element={<LoyaltyReview />} />
            {/* Headooffice routes */}
            <Route path="/stores/manage-store/add-new-store" element={<AddingFranchise />} />
            <Route path="/store/manage-store/franchise-details" element={<FranchiseDetailsPage />} />
            {/* <Route path="/test-export" element={<TestComponent />} /> */}
            <Route path="/widgets" element={<WidgetSelection />} />
            <Route path="/marketting/offers-promotions/create/by-item" element={<ItemCreateOffer />} />
            <Route path="/marketting/offers-promotions/create/by-category" element={<CategoryCreateOffer />} />
            <Route path="/marketting/offers-promotions/create/by-cart-value" element={<CartValueCreateOffer />} />
            <Route path="/marketting/offers-promotions/:id" element={<OfferAndPromoDetails />} />
            {/* <Route path="/stock-taking/stock-items-list/:sessionId" element={<ProductStockDetails />} /> */}
            <Route path="/stock-taking/stock-session-monitor/:id" element={<StockSessionMonitor />} />
            <Route path="/stock-taking/create-stock-schedule" element={<StockTaking />} />
            <Route path="/stock-taking/scheduler-settings" element={<Scheduler />} />
            <Route path="/stock-taking/session-monitor/dashboard/:sessionId" element={<StockDashBoard />} />
            {/* stock count  */}
            <Route path="/inventory/stock-count/create-new-job" element={<CreateNewJob />} />
            <Route
              path="/inventory/stock-count/stock-count-details/:jobId/:sessionId"
              element={<StockCountDetails />}
            />
            <Route path="/inventory/stock-count/stock-items-list/:sessionId" element={<ProductStockDetails />} />
            <Route path="/pallet-pay/paytm/settings" element={<PaytmPaymentSettings />} />
            <Route path="/pallet-pay/pinelabs/settings" element={<PineLabsPaymentSettings />} />
            <Route path="/pallet-pay/paytm" element={<PaytmDashboard />} />
            <Route path="/pallet-pay/pinelabs" element={<PaytmDashboard />} />
            <Route path="/sales_channels/mobile_app" element={<Allorders mobileApp={true} />} />

            {/* new routes */}
            {/* <Route path="/products/department" element={<ProductDepartment />} /> */}
            <Route path="/products/department" element={<AllListingPage />} />
            <Route path="/products/line-of-business/create" element={<ProductLineOfBusiness />} />
            <Route path="/products/department/create" element={<ProductDepartment />} />
            <Route path="/products/sub-department/create" element={<CreateSubDep />} />
            <Route path="/products/category/create" element={<ProductCategory />} />
            <Route path="/products/class/create" element={<CreateClass />} />
            <Route path="/products/sub-class/create" element={<CreateSubclass />} />
            <Route path="/products/tax" element={<TaxMasterListing />} />
            <Route path="/products/tax-master/create" element={<ProductTaxCreation />} />
            <Route path="/products/tax-master/edit" element={<ProductTaxCreation />} />
            <Route path="/products/tax-slab/create" element={<ProductTaxSlab />} />
            <Route path="/products/tax-slab/edit" element={<ProductTaxSlab />} />
            <Route path="/products/tax-mapping/create" element={<CategoryTaxMapping />} />
            <Route path="/products/tax-mapping/edit" element={<CategoryTaxMapping />} />
            <Route path="/products/product/details/:id" element={<ProductDetailsRouter />} />
            <Route path="/products/product/details/global/:id" element={<ProductDetailsRouter />} />
            <Route path="/products/online-category" element={<OnlineCategoryListing />} />
            <Route path="/products/online-category/level1/create" element={<OnlineProductCategory />} />
            <Route path="/products/online-category/level2/create" element={<CreateLevel2Category />} />
            <Route path="/products/online-category/level3/create" element={<CreateLevel3Category />} />
            <Route path="/products/product-master" element={<ProductsMainPage />} />
            <Route path="/products/brand" element={<BrandDeatilsComponent />} />
            <Route path="/products/brand/create" element={<BrandCreation />} />
            <Route path="/products/sub-brand/create" element={<SubBrandCreate />} />
            <Route path="/products/sub-brand/edit" element={<SubBrandCreate />} />
            <Route path="/products/brand/edit" element={<BrandCreation />} />
            <Route path="/products/manufacture/create" element={<ManufactureCreate />} />
            <Route path="/products/manufacture/edit" element={<ManufactureCreate />} />
            <Route path="/products/recipe" element={<AllRecipePage />} />
            <Route path="/products/recipe/create" element={<RecipeCreation />} />
            <Route path="/products/bulk-price-edit" element={<BulkPriceEdit />} />
            <Route path="/products/url-generator" element={<UrlGeneratorPage />} />
            <Route path="/products/bundle-product/details/:id" element={<BundleDetailsPage />} />
            <Route path="/market-place/products/add/address" element={<WrappedDeliveryAddress />} />
            <Route path="/market-place/products/edit/address" element={<WrappedDeliveryAddress />} />
            <Route path="/products/price-edit-upload" element={<BulkPriceEditUploadListing />} />
            <Route path="/products/price-edit-upload/upload" element={<BulkPriceFileUpload />} />
            <Route path="/products/price-edit-upload/details/:id" element={<BulkPriceUploadDetails />} />
            <Route path="/products/prep-station" element={<PrepStationListing />} />
            <Route path="/products/prep-station/create" element={<PrepStationCreation />} />
            <Route path="/products/prep-station/edit/:id" element={<PrepStationCreation />} />
            <Route path="/products/all-combos/create" element={<CombosCreation />} />
            <Route path='/products/all-combos/details/:id' element={<CombosDetailsPage />} />
            <Route path="/products/all-combos/edit/:id" element={<CombosCreation />} />
          </Route>
          {/* <Route path="/help-support" element={<ChatbotHelpSupport />} /> */}
        </Route>
      </Routes>
      {/* <ChatbotHelpSupport /> */}
      <PalletAIMessenger />
    </ThemeProvider>
  );
}
