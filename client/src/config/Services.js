import EnvConfig from 'config/EnvConfig';
import {
  gettRequest,
  postRequest,
  postFileRequest,
  patchRequest,
  deleteRequest,
  putRequest,
  postquoteRequests,
  patchMultipartRequest,
  pdfgetRequest,
  postDownloadPdfRequest,
  postPreAprrovedCoupons,
} from 'config/ServicesConfig';
import {
  getPdfRequest,
  loginPostRequest,
  postFileRequest2,
  postOrgRequest,
  postRTRequest,
  postSubUserRequest,
  postTallyRequest,
  postValidateLogOutRequest,
  postValidateRequest,
  postpdfRequest,
} from './ServicesConfig';
import { SessionDetailsPage } from './../layouts/ecommerce/apps-integration/Pos/components/End_day/components/sessionDetailsPage/sessionDetails';

const METHOD = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
};

/**purchase
 * The config for managing all services
 */
const envBaseUrl = EnvConfig().baseConfigUrl;
const envDomainUrl = EnvConfig().domainUrl;
const servicesList = {
  vendorVms: 'vms',
  userAuthService: 'user-service',
  productService: 'catalog',
  purchaseOrder: 'po',
  warehouseService: 'wms',
  retailService: 'retail',
  purchaseService: 'purchase',
  cartService: 'cart',
  inwardService: 'inbound',
  inventoryService: 'ims',
  userService: 'user-service',
  userAuth: 'auth',
  saleService: 'oms',
  layoutService: 'layout',
  commService: 'comms',
  serviceability: 'serviceability',
  loyaltyService: 'loyalty',
  notificationService: 'nms',
  couponService: 'coupon',
  businessService: 'business',
  posService: 'pos-service',
  paymentService: 'payments',
  logisticsService: 'logistics',
  tallyService: 'ts',
  thirdPartyService: 'tpl',
};

// get manufacturer list in all products page filter
export const getManufacturerList = () => {
  const url = envBaseUrl + servicesList.productService + '/manufactures';
  return gettRequest(url, METHOD.GET);
};

export const getManufacturerListV2 = (payload) => {
  const url = envBaseUrl + servicesList.productService + '/brand/manufacturer/filter';
  return postRequest(url, payload);
};
export const getDepartmentList = (payload) => {
  const url = envBaseUrl + servicesList.productService + '/department/filter';
  return postRequest(url, payload);
};
export const getSubDepartmentList = (payload) => {
  const url = envBaseUrl + servicesList.productService + '/department/sub/filter';
  return postRequest(url, payload);
};
export const getLobList = (payload) => {
  const url = envBaseUrl + servicesList.productService + '/lob/filter';
  return postRequest(url, payload);
};
export const getGlobalProducts = (payload) => {
  const url = envBaseUrl + servicesList.productService + '/product/v2/filter/product';
  return postRequest(url, payload);
};

export const getProductDetailsbyId = (productId, locId) => {
  const url = envBaseUrl + servicesList.productService + `/product/v2/get/${productId}/${locId}`;
  return gettRequest(url, METHOD.GET);
};
export const displayMainCategory = () => {
  const url = envBaseUrl + servicesList.commService + '/getMainCategory';
  return gettRequest(url, METHOD.GET);
};

export const getSubCategory = (categoryId) => {
  const url = envBaseUrl + servicesList.commService + `/fetch/all/categories/${categoryId}`;
  return gettRequest(url, METHOD.GET);
};

export const getAllCategories = () => {
  const url = envBaseUrl + servicesList.commService + '/categories';
  return gettRequest(url, METHOD.GET);
};
export const getCommAction = () => {
  const url = envBaseUrl + servicesList.commService + '/actions';
  return gettRequest(url, METHOD.GET);
};

export const getCommActionByCategory = (categoryId) => {
  const url = envBaseUrl + servicesList.commService + `/actions/${categoryId}`;
  return gettRequest(url, METHOD.GET);
};
export const postPreferenceData = (payload) => {
  const url = envBaseUrl + servicesList.commService + '/org/action/preference';
  // const url = 'https://communication-preference-service-dev-kxyaws5ixa-uc.a.run.app/comms/org/action/preference'
  return postRequest(url, payload);
};
export const getAllPreferedData = (orgId, actionName) => {
  const url = envBaseUrl + servicesList.commService + `/org/nms/preference/${orgId}/${actionName}`;
  return gettRequest(url, METHOD.GET);
};

export const postTemplateById = (payload, actionId) => {
  const url = envBaseUrl + servicesList.commService + `/template/file/${actionId}`;
  return postFileRequest(url, payload);
};

export const postEmailTemplate = (payload) => {
  const url = envBaseUrl + servicesList.notificationService + '/template/upload';
  return postFileRequest(url, payload);
};

export const postEmailTemplate2 = (payload) => {
  const url = envBaseUrl + servicesList.notificationService + '/v2/export/csv';
  return postFileRequest(url, payload);
};

export const sendEmailById = (payload) => {
  const url = envBaseUrl + servicesList.notificationService + '/send/emailById';
  return postFileRequest(url, payload);
};

export const postTemplateUpdate = (payload) => {
  const url = envBaseUrl + servicesList.notificationService + '/template/update/multipart';
  return postFileRequest(url, payload);
};

export const postSMSTemplateUpdate = (payload) => {
  const url = envBaseUrl + servicesList.notificationService + '/template/update/multipart';
  return postRequest(url, payload);
};

export const deletePreferenceData = (payload) => {
  const url = envBaseUrl + servicesList.commService + '/delete/preference';
  return postRequest(url, payload);
};

export const postSMSTemplateById = (payload, actionId) => {
  const url = envBaseUrl + servicesList.commService + `/template/${actionId}`;
  return postRequest(url, payload);
};

export const updateClientData = (payload) => {
  const url = envBaseUrl + servicesList.notificationService + '/update/client/data';
  return postRequest(url, payload);
};

export const postWhatsAppTemplateById = (payload, actionId) => {
  const url = envBaseUrl + servicesList.commService + `/social/template/${actionId}`;
  return postRequest(url, payload);
};

export const createCommsOrg = (payload) => {
  const url = envBaseUrl + servicesList.commService + '/org';
  return postRequest(url, payload);
};

export const addSubUser = (payload) => {
  const url = envBaseUrl + servicesList.notificationService + '/add-subuser';
  return postSubUserRequest(url, payload);
};

export const postEmailConnect = (payload) => {
  const url = envBaseUrl + servicesList.commService + '/add/sender/details';
  return postSubUserRequest(url, payload);
};

export const getEmailConnect = (clientId) => {
  const url = envBaseUrl + servicesList.commService + `/get/sender/details/${clientId}`;
  return gettRequest(url, METHOD.GET);
};

export const getSubUser = () => {
  const url = envBaseUrl + servicesList.notificationService + '/get-subuser';
  return gettRequest(url, METHOD.GET);
};

export const verifySubUser = (payload) => {
  const url = envBaseUrl + servicesList.notificationService + '/verified_senders';
  return postRequest(url, payload);
};

export const whatsAppConnect = (payload) => {
  const url = envBaseUrl + servicesList.notificationService + '/add/whatsApp/business/credentials';
  return postRequest(url, payload);
};

export const postWhatsappConnectV2 = (payload) => {
  const url = envBaseUrl + servicesList.notificationService + '/add/meta/credentials';
  return postRequest(url, payload);
};

export const getWhatsAppConnected = (clientId) => {
  const url = envBaseUrl + servicesList.notificationService + `/get/meta/credentials/${clientId}`;
  return gettRequest(url, METHOD.GET);
};

export const notificationsLimit = (clientName) => {
  const url = envBaseUrl + servicesList.notificationService + `/client/${clientName}`;
  return gettRequest(url, METHOD.GET);
};

export const createCommsMainCategory = (payload) => {
  const url = envBaseUrl + servicesList.commService + '/mainCategory';
  return postRequest(url, payload);
};

export const createCommsSubCategory = (payload) => {
  const url = envBaseUrl + servicesList.commService + '/subCategory';
  return postRequest(url, payload);
};

export const createCommsAction = (payload) => {
  const url = envBaseUrl + servicesList.commService + '/action';
  return postRequest(url, payload);
};

export const disableNotification = (payload) => {
  const url = envBaseUrl + servicesList.commService + '/disable/notification';
  return postRequest(url, payload);
};

export const abortBulkWhatsappCampaign = (jobId, jobType) => {
  const url = envBaseUrl + servicesList.notificationService + `/abort/${jobId}/${jobType}`;
  return postRequest(url);
};

export const getSingleWhatsappCampaignTemplate = (templateName) => {
  const url = envBaseUrl + servicesList.notificationService + `/get/marketing/template/${templateName}`;
  return gettRequest(url, METHOD.GET);
};

export const getAllWhatsAppCampaignTemplateList = () => {
  const url = envBaseUrl + servicesList.notificationService + '/getAll/marketing-template';
  return gettRequest(url, METHOD.GET);
};

export const getAllWhatsAppCampaignList = (clientId) => {
  const url = envBaseUrl + servicesList.notificationService + `/getAll/campaigns/${clientId}`;
  return gettRequest(url, METHOD.GET);
};

export const getWhatsAppCampaignByBulkJobId = (bulkJobID, clientId) => {
  const url = envBaseUrl + servicesList.notificationService + `/get/campaign/${clientId}/${bulkJobID}`;
  return gettRequest(url, METHOD.GET);
};

export const getAllSubcategories = () => {
  const url = envBaseUrl + servicesList.commService + '/categories';
  return gettRequest(url, METHOD.GET);
};

export const whatsappBusinessOnboardStore = (payload) => {
  const url = envBaseUrl + servicesList.thirdPartyService + '/Store/Onboarding';
  return postRequest(url, payload);
};

export const whatsappBusinessAddProducts = (payload) => {
  const url = envBaseUrl + servicesList.thirdPartyService + '/add/items';
  return postRequest(url, payload);
};

export const pushBulkTemplateCreation = (payload) => {
  const url = envBaseUrl + servicesList.notificationService + '/create/template';
  return postRequest(url, payload);
};

export const getAllBulkPushTemplates = () => {
  const url = envBaseUrl + servicesList.notificationService + '/template';
  return gettRequest(url, METHOD.GET);
};

export const createBulkPushCampaign = (payload) => {
  const url = envBaseUrl + servicesList.notificationService + '/schedule/push/notification';
  return postFileRequest(url, payload);
};

export const singlePushTemplate = (id) => {
  const url = envBaseUrl + servicesList.notificationService + `/template/${id}`;
  return gettRequest(url, METHOD.GET);
};

export const singlePushTemplateByName = (name) => {
  const url = envBaseUrl + servicesList.notificationService + `/template/search/${name}`;
  return gettRequest(url, METHOD.GET);
};

export const getAllPushScheduledCampaigns = (clientId) => {
  const url = envBaseUrl + servicesList.notificationService + `/get/scheduled/push/campaigns/${clientId}`;
  return gettRequest(url, METHOD.GET);
};

export const getAllWhatsappScheduledCampaigns = (clientId) => {
  const url = envBaseUrl + servicesList.notificationService + `/get/scheduled/whatsApp/campaigns/${clientId}`;
  return gettRequest(url, METHOD.GET);
};

export const whatsappBusinessGetProducts = (catalogId) => {
  const url = envBaseUrl + servicesList.thirdPartyService + `/get/allProductsBy/${catalogId}`;
  return gettRequest(url, METHOD.GET);
};

export const whatsappBusinessCreateAddress = (payload) => {
  const url = envBaseUrl + servicesList.thirdPartyService + '/address/action';
  return postRequest(url, payload);
};

export const whatsappBusinessCreateAddressUpdate = (payload) => {
  const url = envBaseUrl + servicesList.thirdPartyService + '/update/address/template/data';
  return postRequest(url, payload);
};

export const whatsappBusinessCreateCatalog = (payload) => {
  const url = envBaseUrl + servicesList.thirdPartyService + '/catalog/action';
  return postRequest(url, payload);
};

export const whatsappBusinessCreateTemplate = (payload) => {
  const url = envBaseUrl + servicesList.thirdPartyService + '/template/creation/action';
  return postRequest(url, payload);
};

export const whatsappBusinessCreateWelcome = (payload) => {
  const url = envBaseUrl + servicesList.thirdPartyService + '/welcome/message/action';
  return postRequest(url, payload);
};

export const whatsappBusinessWorkFlow = (payload) => {
  const url = envBaseUrl + servicesList.thirdPartyService + '/workflow';
  return postRequest(url, payload);
};

export const getwhatsappBusinessWorkFlow = (orgId, catalogId) => {
  const url = envBaseUrl + servicesList.thirdPartyService + `/getWorkflowDetailsBy/${orgId}/${catalogId}`;
  return gettRequest(url, METHOD.GET);
};

export const whatsappBusinessProcess = (locId, number, orgId, catalogId) => {
  const url =
    envBaseUrl +
    servicesList.thirdPartyService +
    `/process?loc_id=${locId}&org_id=${orgId}&catalog_id=${catalogId}&phoneNumber=${number}`;
  return gettRequest(url, METHOD.GET);
};

export const whatsappBusinessProcessBulk = (payload, orgId, locId, catalogId) => {
  const url =
    envBaseUrl +
    servicesList.thirdPartyService +
    `/v1/csv/send/bulk/whatsapp/catalog/template?loc_id=${locId}&org_id=${orgId}&catalog_id=${catalogId}`;
  return postFileRequest(url, payload);
};

export const checkWhatsappBusinessConnect = (orgId, locId) => {
  const url = envBaseUrl + servicesList.thirdPartyService + `/get/StoreDetailsBy/${orgId}/${locId}`;
  return gettRequest(url, METHOD.GET);
};

export const whatsappBusinessCatalogDetails = (orgId, catalogId, type) => {
  const url = envBaseUrl + servicesList.thirdPartyService + `/get/templateDetailsBy/${orgId}/${catalogId}/${type}`;
  return gettRequest(url, METHOD.GET);
};

export const whatsappBusinessAddressDetails = (orgId, locId) => {
  const url = envBaseUrl + servicesList.thirdPartyService + `/get/AddressDetailsBy/${orgId}/${locId}`;
  return gettRequest(url, METHOD.GET);
};

export const userAuthentication = (payload) => {
  const url = envBaseUrl + servicesList.userAuthService + '/login';
  return postRequest(url, payload);
};

export const validateProductCSV = (payload) => {
  const url = envBaseUrl + servicesList.productService + '/validate/product/csv';
  return postFileRequest(url, payload);
};

export const uploadBannerImage = (payload) => {
  const url = envBaseUrl + servicesList.productService + `/any/file/upload`;
  return postFileRequest(url, payload);
};

export const createBanner = (payload) => {
  const url = envBaseUrl + servicesList.productService + '/banner/create';
  return postRequest(url, payload);
};

export const categoryFilter = (payload) => {
  const url = envBaseUrl + servicesList.productService + '/category/view/filter';
  return postRequest(url, payload);
};

export const dashboardSalesByCategory = (payload) => {
  const url = envBaseUrl + servicesList.saleService + '/main/dashboard/category/data';
  return postRequest(url, payload);
};
export const dashboardProfitDetails = (payload) => {
  const url = envBaseUrl + servicesList.saleService + '/main/dashboard/profit/data';
  return postRequest(url, payload);
};
export const reportAvailabilityCheck = (payload) => {
  const url = envBaseUrl + servicesList.saleService + '/reports/fetch/reports';
  return postRequest(url, payload);
};

export const previewBanner = (payload) => {
  const url = envBaseUrl + servicesList.productService + '/banner/filter';
  return postRequest(url, payload);
};

export const editPrevBanner = (payload) => {
  const url = envBaseUrl + servicesList.productService + '/banner/edit';
  return postRequest(url, payload);
};

export const createBulkProductJob = (payload) => {
  const url = envBaseUrl + servicesList.productService + '/bulk/v1/job/create';
  return postFileRequest(url, payload);
};

export const getAllBulkUploadProducts = (payload) => {
  const url = envBaseUrl + servicesList.productService + '/bulk/v1/filter/bulk/job';
  return postRequest(url, payload);
};

export const getBulkProductById = (fileId) => {
  const url = envBaseUrl + servicesList.productService + `/bulk/v1/job/${fileId}`;
  return gettRequest(url, METHOD.GET);
};

export const whatsappCampaignTemplateCreation = (payload) => {
  const url = envBaseUrl + servicesList.notificationService + '/whatsApp/marketing/templates';
  return postFileRequest(url, payload);
};

export const whatsappCampaignCreation = (payload) => {
  const url = envBaseUrl + servicesList.notificationService + '/v2/csv/whatsapp/campaign';
  return postFileRequest(url, payload);
};

export const whatsappCampaignScheduler = (payload) => {
  const url = envBaseUrl + servicesList.notificationService + '/schedule/whatsApp/campaign';
  return postFileRequest(url, payload);
};

export const whatsappCampaignSegment = (payload) => {
  const url = envBaseUrl + servicesList.notificationService + '/v3/segment/whatsApp/campaign';
  return postRequest(url, payload);
};

// export const getCustomerList = (warehouseId) => {
//   const contextType = localStorage.getItem('contextType');

//   let partnerType = '';

//   if (contextType === 'RETAIL') {
//     partnerType = 'RETAIL';
//   } else if (contextType === 'WMS') {
//     partnerType = 'WAREHOUSE';
//   }

//   const url =
//     envBaseUrl + servicesList.retailService + `/retail/v1/get?partnerId=${warehouseId}&partnerType=${partnerType}`;
//   return gettRequest(url, METHOD.GET);
// };

export const getCustomerList = (payload) => {
  const url = envBaseUrl + servicesList.retailService + `/retail/v1/get/partner/retail`;
  return postRequest(url, payload);
};
export const getCustomerListV2 = (payload) => {
  const url = envBaseUrl + servicesList.retailService + `/retail/v2/get/partner/retail`;
  return postRequest(url, payload);
};
export const getAllCustomerList = (payload) => {
  const url = envBaseUrl + servicesList.retailService + `/retail/customer/v1/count`;
  return postRequest(url, payload);
};
export const getAppCustomers = (payload) => {
  const url = envBaseUrl + `b2c/customer/v2/get`;
  return postRequest(url, payload);
};

export const getPosCustomerList = (payload) => {
  const url = envBaseUrl + servicesList.retailService + `/retail/v1/customer/location`;
  return postRequest(url, payload);
};

export const getPosCustomerListV2 = (payload) => {
  const url = envBaseUrl + servicesList.retailService + `/retail/v2/customer/location`;
  return postRequest(url, payload);
};

export const getAllUserDetailsPos = (payload) => {
  const url = envBaseUrl + servicesList.userService + '/user/uidx/details';
  return postRequest(url, payload);
};

export const submitCustomerDetails = (payload) => {
  url = envBaseUrl + servicesList.vendorVms + '/create';
  return postRequest(url, payload);
};
export const createVendorDeliveryFreq = (payload) => {
  url = envBaseUrl + servicesList.vendorVms + '/vendor/v1/delivery';
  return postRequest(url, payload);
};
export const updateDeliveryFullfillment = (payload) => {
  const url = envBaseUrl + servicesList.vendorVms + `/vendor/v1/delivery`;
  return patchRequest(url, payload);
};
export const updateVendorBasicDetails = (payload) => {
  const url = envBaseUrl + servicesList.vendorVms + `/v2/vendor`;
  return patchRequest(url, payload);
};
export const updateVendorReturns = (payload) => {
  const url = envBaseUrl + servicesList.vendorVms + `/vendor/v1/return`;
  return patchRequest(url, payload);
};
export const updateVendorPromotions = (payload) => {
  const url = envBaseUrl + servicesList.vendorVms + `/vendor/v1/promotion`;
  return patchRequest(url, payload);
};

// export const addRetail = (payload) => {
//   const url = envBaseUrl + servicesList.retailService + '/retail/addRetail';
//   return postRequest(url, payload);
// };

export const addRetail = (payload) => {
  const url = envBaseUrl + servicesList.retailService + '/retail/v2/create';
  return postRequest(url, payload);
};

export const uploadRetailLogo = (formData) => {
  const url = envBaseUrl + servicesList.retailService + `/file/v1/upload/logo`;
  return postFileRequest(url, formData);
};

export const updateRetailLogo = (payload) => {
  const url = envBaseUrl + servicesList.retailService + `/retail/v1/logo/update`;
  return postRequest(url, payload);
};

export const preApprovedCouponCustomers = (pageNo, payload) => {
  const url = envBaseUrl + servicesList.couponService + `/api/v1/display/coupon?pageNo=${pageNo}&limit=50`;

  return postPreAprrovedCoupons(url, payload);
};

export const uploadVendorLogo = (vendorId, formData) => {
  const url = envBaseUrl + servicesList.vendorVms + `/vendor/${vendorId}/logo`;
  return patchMultipartRequest(url, formData);
};

export const getAllVendors = (payload, orgId) => {
  const url = envBaseUrl + servicesList.vendorVms + `/vendors/${orgId}`;
  return postRequest(url, payload);
};

export const getVendorDetailFromId = (vendorId) => {
  const url = envBaseUrl + servicesList.vendorVms + `/vendors/get/${vendorId}`;
  return gettRequest(url, METHOD.GET);
};

export const createCreditNoteTransfer = (payload) => {
  const url = envBaseUrl + servicesList.vendorVms + `/vendor/transfer-credit`;
  return postRequest(url, payload);
};

export const getCreditNoteTransferLogs = (payload) => {
  const url = envBaseUrl + servicesList.vendorVms + `/vendor/transfer-credit/log`;
  return postRequest(url, payload);
};

export const vendorSkuDetails = (payload) => {
  const url = envBaseUrl + servicesList.vendorVms + `/vendors/products`;
  return postRequest(url, payload);
};

export const filterVendorSkuDetails = (gtin) => {
  const url = envBaseUrl + servicesList.vendorVms + `/vendors/products?gtin=${gtin}`;
  return gettRequest(url, METHOD.GET);
};

export const addVendor = (payload) => {
  const url = envBaseUrl + servicesList.vendorVms + '/vendor/create';
  return postRequest(url, payload);
};

export const updateVendorBankDetails = (payload) => {
  const url = envBaseUrl + servicesList.vendorVms + `/bank`;
  return patchRequest(url, payload);
};

export const updateVendorDisplayName = (payload) => {
  const url = envBaseUrl + servicesList.vendorVms + `/vendor/display/name`;
  return patchRequest(url, payload);
};

export const getAllPurchaseIndent = (payload) => {
  const url = envBaseUrl + servicesList.purchaseOrder + '/api/purchase-indent/list';
  return postRequest(url, payload);
};

export const createPurchaseIndent = (payload) => {
  const url = envBaseUrl + servicesList.purchaseOrder + '/api/purchase-indent/create';
  return postRequest(url, payload);
};

export const editPurchaseIndent = (payload) => {
  const url = envBaseUrl + servicesList.purchaseOrder + '/api/purchase-indent/edit';
  return patchRequest(url, payload);
};

export const removePIItem = (payload) => {
  const url = envBaseUrl + servicesList.purchaseOrder + '/api/pi/item/delete';
  return postRequest(url, payload);
};

export const submitPurchaseIndent = (payload) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/purchase-indent/submit`;
  return postRequest(url, payload);
};

export const getPurchaseIndentDetails = (pid) => {
  const url = envBaseUrl + servicesList.purchaseOrder + '/api/purchase-indent/' + pid;
  return gettRequest(url, METHOD.GET);
};

export const createPurchaseOrder = (payload) => {
  const url = envBaseUrl + servicesList.purchaseOrder + '/api/add-purchase-order';
  return postRequest(url, payload);
};

export const getPurchaseTrend = (orgId, locId, gtin) => {
  const url =
    envBaseUrl + servicesList.purchaseOrder + `/api/v1/purchase/order/item/trend/${orgId}/${locId}/${gtin}/365`;
  return gettRequest(url, METHOD.GET);
};

export const getTotalQuantityOrderedForGtins = (payload) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/v1/po/item/total/quantity/ordered`;
  return postRequest(url, payload);
};

export const getCartDetails = (cartId) => {
  const url = envBaseUrl + servicesList.cartService + `/so/v1/${cartId}`;
  return gettRequest(url, METHOD.GET);
};

export const getCustomerDetails = (retailId) => {
  // const url = envBaseUrl + servicesList.retailService + '/retail/getRetail/' + retailId;
  const url = envBaseUrl + servicesList.retailService + `/retail/v1/get/details/?id=${retailId}`;
  return gettRequest(url, METHOD.GET);
};

export const postCustomerOtherDetails = (payload) => {
  const url = envBaseUrl + servicesList.retailService + `/retail/v1/update`;
  return postRequest(url, payload);
};

export const updateCustomerDisplayName = (payload) => {
  const url = envBaseUrl + servicesList.retailService + `/retail/v1/update`;
  return postRequest(url, payload);
};
export const getAllRetailLocations = (payload) => {
  const url = envBaseUrl + servicesList.retailService + `/retail/v1/retail/list`;
  return postRequest(url, payload);
};

export const getCustomerOrders = (payload) => {
  const url = envBaseUrl + servicesList.saleService + `/orders/v2/orders`;
  return postRequest(url, payload);
};
export const getDashboardSalesValues = (payload) => {
  const url = envBaseUrl + servicesList.saleService + `/main/dashboard/sales/data`;
  return postRequest(url, payload);
};
export const salesLeaderBoard = (payload) => {
  const url = envBaseUrl + servicesList.saleService + `/pos/dashboard/sales/leaderboard`;
  return postRequest(url, payload);
};
export const getProductWiseProfit = (payload) => {
  const url = envBaseUrl + servicesList.saleService + `/v1/order/item/filter`;
  return postRequest(url, payload);
};
export const getCustomerOrdersSummary = (payload, retailId) => {
  const url = envBaseUrl + servicesList.saleService + `/orders/customer-orders-summary/${retailId}`;
  return postRequest(url, payload);
};

export const getCustomerTopPurchasedOrderItem = (retailId) => {
  const url = envBaseUrl + servicesList.saleService + `/topItems/purchased/${retailId}`;
  return gettRequest(url, METHOD.GET);
};

export const updateCustomerBankDetails = (payload) => {
  const url = envBaseUrl + servicesList.retailService + `/kyc/document/v1/update/bank/detail`;
  return postRequest(url, payload);
};

export const getVendorDetails = (orgId, vendorId) => {
  const url = envBaseUrl + servicesList.vendorVms + `/vendor/${orgId}/${vendorId}`;
  return gettRequest(url, METHOD.GET);
};

export const getVendorPurchaseOrder = (tenantId) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/vendor-purchase-order/${tenantId}`;
  return gettRequest(url, METHOD.GET);
};
export const getVendorTopItems = (vendorId, pageNo = 0) => {
  const url =
    envBaseUrl +
    servicesList.purchaseOrder +
    `/api//v2/vendor/top/purchase?vendorId=${vendorId}&page=${pageNo}&size=10`;
  return gettRequest(url, METHOD.GET);
};

export const getVendorPurchaseOrderforOne = (tenantId) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/vendor-purchase-order/${tenantId}`;
  return gettRequest(url, METHOD.GET);
};

export const getVendorPurchaseOrders = (payload) => {
  const url = envBaseUrl + servicesList.purchaseOrder + '/api/v1/vendor/purchase/order/filter';
  return postRequest(url, payload);
};
export const getVendorPurchaseBills = (tenantId) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/vendor-purchase-order-bill/${tenantId}`;
  return gettRequest(url, METHOD.GET);
};
export const getVendorPurchasePaymentMade = (tenantId) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/vendor-payment-made/${tenantId}`;
  return gettRequest(url, METHOD.GET);
};
export const getVendorPurchaseRefund = (tenantId) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/vendor-refund/${tenantId}`;
  return gettRequest(url, METHOD.GET);
};
export const getVendorRanking = (orgId, locId, vendorId) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/vendor/ranking/${orgId}/${locId}/${vendorId}`;
  return gettRequest(url, METHOD.GET);
};
export const getVendorVendorCredit = (vendorId) => {
  const url = envBaseUrl + servicesList.vendorVms + `/vendor/credit/${vendorId}`;
  return gettRequest(url, METHOD.GET);
};

export const getAllProducts = (payload) => {
  const url = envBaseUrl + servicesList.productService + '/suggest/filter/product';
  return postRequest(url, payload);
};

export const getAllProductsV2 = (payload) => {
  const url = envBaseUrl + servicesList.productService + '/v2/filter/product';
  return postRequest(url, payload);
};

export const getProductDetails = (productId) => {
  const url = envBaseUrl + servicesList.productService + '/product/gtin/' + productId;
  return gettRequest(url, METHOD.GET);
};

export const getInventoryDetails = async (locationId, gtin) => {
  const url =
    envBaseUrl +
    servicesList.inventoryService +
    `/api/WPC/v1/fetch-with-multiple-batches/get?locationId=${locationId}&gtin=${gtin}`;
  return await gettRequest(url, METHOD.GET);
};

export const getLatestInwarded = (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + `/api/inventory/v1/latest/inwarded`;
  return postRequest(url, payload);
};
export const updateBatchdetails = (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + `/batch/v1/update`;
  return postRequest(url, payload);
};
export const exportAnalysisPdf = (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + `/api/WPC/v1/get/analysis/data/export`;
  return postDownloadPdfRequest(url, payload);
};

export const getInventoryBatchByGtin = (gtin, locId) => {
  const url =
    envBaseUrl + servicesList.inventoryService + `/api/inventory/v1/batch/list/get?GTIN=${gtin}&location_id=${locId}`;
  return gettRequest(url, METHOD.GET);
};
export const getInventoryBundleDetails = (locId, gtin) => {
  const url = envBaseUrl + servicesList.inventoryService + `/api/bundle/v1/${locId}/${gtin}`;
  return gettRequest(url, METHOD.GET);
};

export const getInventoryBatchByGtinWithMrp = (gtin, locId) => {
  const url =
    envBaseUrl + servicesList.inventoryService + `/api/inventory/v3/mrp-list/get?locationId=${locId}&gtin=${gtin}`;
  return gettRequest(url, METHOD.GET);
};
export const dashboardInventoryInfo = (locId, orgId) => {
  const url =
    envBaseUrl +
    servicesList.inventoryService +
    `/api/WPC/v1/inventoryAnalysis/report?locationId=${locId}&orgId=${orgId}`;
  return gettRequest(url, METHOD.GET);
};

export const getInventoryBatchByGtinWithMrpAndExpiryDate = (gtin, locId) => {
  const url =
    envBaseUrl + servicesList.inventoryService + `/api/inventory/v1/batch/list/get?GTIN=${gtin}&location_id=${locId}`;
  return gettRequest(url, METHOD.GET);
};

export const postAdjustInventoryBatch = (formData) => {
  const url = envBaseUrl + servicesList.inventoryService + `/api/adjust/inventory/v1/Batch`;
  return postFileRequest(url, formData);
};

export const exportInventoryAdjustmentData = (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + `/api/inventoryLogs/export`;
  return postDownloadPdfRequest(url, payload);
};

export const exportPurchaseData = (payload) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/v1/purchase/order/filtered/document`;
  return postDownloadPdfRequest(url, payload);
};
export const exportItemWisePurchaseData = (payload) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/v1/purchase/order/item/export/report`;
  return postDownloadPdfRequest(url, payload);
};

export const exportInventoryData = (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + `/api/inventory/export`;
  return postDownloadPdfRequest(url, payload);
};

export const exportInventoryDataV2 = (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + `/api/v1/inventory/data/export/rms`;
  return postDownloadPdfRequest(url, payload);
};

export const getStockValueData = (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + `/api/v1/inventory/data/get/stockValue`;
  return postRequest(url, payload);
};

export const exportStockValue = (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + `/api/v1/inventory/export/stock-value`;
  return postDownloadPdfRequest(url, payload);
};
export const getBulkPriceEdit = (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + `/api/BPE/v1/filter/get/`;
  return postRequest(url, payload);
};

export const getEditedBysBulkPriceEdit = (locId) => {
  const url = envBaseUrl + servicesList.inventoryService + `/api/BPE/v1/editedBys/get?location_id=${locId}`;
  return gettRequest(url, METHOD.GET);
};

export const getCategoriesBulkPriceEdit = (locId) => {
  const url = envBaseUrl + servicesList.inventoryService + `/api/inventory/v1/categories/get?location_id=${locId}`;
  return gettRequest(url, METHOD.GET);
};

export const getManufacturerBulkPriceEdit = (locId) => {
  const url = envBaseUrl + servicesList.inventoryService + `/api/inventory/v1/brands/get?location_id=${locId}`;
  return gettRequest(url, METHOD.GET);
};

export const postBulkPriceEdit = (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + `/api/inventory/v1/bulk-price/edit`;
  return postRequest(url, payload);
};

export const getPriceRevision = (locationId, gtin, filterObject) => {
  const url =
    envBaseUrl +
    servicesList.inventoryService +
    `/api/WPC/v2/price-revision/get?locationId=${locationId}&gtin=${gtin}&pageSize=${filterObject.pageSize}&pageNumber=${filterObject.pageNumber}`;
  return gettRequest(url, METHOD.GET);
};

export const addProductWithImages = (payload) => {
  const url = envBaseUrl + servicesList.productService + '/product/create';
  return postFileRequest(url, payload);
};

export const createCoupon = (payload) => {
  const url = envBaseUrl + servicesList.couponService + `/api/v1/add/coupon`;
  return postFileRequest(url, payload);
};

export const createCouponV2 = (payload) => {
  const url = envBaseUrl + servicesList.couponService + `/api/v2/add/coupon`;
  return postRequest(url, payload);
};

export const CouponDashboardApi = (payload) => {
  const url = envBaseUrl + servicesList.couponService + `/api/v1/coupon/dashboard`;
  return postRequest(url, payload);
};

export const viewCoupons = (payload) => {
  const url = envBaseUrl + servicesList.couponService + `/api/v1/coupon/filter?pageNo=1&limit=5`;
  return postRequest(url, payload);
};

export const dynamicCouponsList = (payload) => {
  const url = envBaseUrl + servicesList.couponService + '/api/v1/dynamic/coupon/filter';
  return postRequest(url, payload);
};

export const dynamicCouponSingle = (id) => {
  const url = envBaseUrl + servicesList.couponService + `/api/v1/get/dynamic/coupon/details/${id}`;
  return gettRequest(url, METHOD.GET);
};

export const staticCouponSingle = (id) => {
  const url = envBaseUrl + servicesList.couponService + `/api/v1/get/coupon/details/${id}`;
  return gettRequest(url, METHOD.GET);
};

export const createDynamicCoupon = (payload) => {
  const url = envBaseUrl + servicesList.couponService + '/api/v1/dynamic/coupon/create';
  return postRequest(url, payload);
};

export const updateCouponStatus = (payload) => {
  const url = envBaseUrl + servicesList.couponService + `/api/v1/update/coupon/status`;
  return postRequest(url, payload);
};

export const updateDynamicCouponStatus = (payload) => {
  const url = envBaseUrl + servicesList.couponService + `/api/v1/update/dynamic/coupon/status`;
  return postRequest(url, payload);
};

export const individualCoupon = (payload) => {
  const url = envBaseUrl + servicesList.couponService + `/api/v1/get/coupon/details/${payload}`;
  return gettRequest(url, payload);
};
export const addProduct = (payload) => {
  const url = envBaseUrl + servicesList.productService + '/product';
  return postRequest(url, payload);
};

export const deleteProduct = (gtin) => {
  const url = envBaseUrl + servicesList.productService + `/product/delete/${gtin}`;
  return postRequest(url, gtin);
};

export const deleteProductFromOrg = (gtin, locId, contextType) => {
  const url = envBaseUrl + servicesList.productService + `/product/delete/${gtin}/${locId}?deleteFrom=${contextType}`;
  return postRequest(url, gtin);
};
export const saveVendorAdderess = (vendorId, payload) => {
  const url = envBaseUrl + servicesList.vendorVms + '/vendor/address/' + vendorId;
  return postRequest(url, payload);
};

export const updateVendorAddress = (payload) => {
  const url = envBaseUrl + servicesList.vendorVms + '/address';
  return patchRequest(url, payload);
};

export const getAllPurchaseOrders = (payload) => {
  const url = envBaseUrl + servicesList.purchaseOrder + '/api/purchase-order-list';
  return postRequest(url, payload);
};

export const eligiblePOforBill = (orgId, sourceLocationId) => {
  const url =
    envBaseUrl + servicesList.purchaseOrder + `/api/get/eligible/purchase/orders/for/bill/${orgId}/${sourceLocationId}`;
  return gettRequest(url, METHOD.GET);
};

export const saveVendorPurchaseTerm = (vendorId, payload) => {
  const url = envBaseUrl + servicesList.vendorVms + '/vendor/purchase/terms/' + vendorId;
  return postRequest(url, payload);
};

// export const uploadRetailLogo = (retailId, payload) => {
//   const url = envBaseUrl + servicesList.retailService + '/retail/uploadLogo/' + retailId;
//   return postFileRequest(url, payload);
// };

export const getMainCategory = () => {
  const url = envBaseUrl + servicesList.productService + '/category/main';
  return gettRequest(url, METHOD.GET);
};

export const getProductGroupData = (locId, productGroupType) => {
  const url =
    envBaseUrl + servicesList.inventoryService + `/api/data/type?locationId=${locId}&type=${productGroupType}`;
  return gettRequest(url, METHOD.GET);
};

export const getItemsByType = (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + `/api/v2/data/type/items`;
  return postRequest(url, payload);
};

export const getCatLevel1 = (MainCategoryId) => {
  const url = envBaseUrl + servicesList.productService + '/category/level1/' + MainCategoryId;
  return gettRequest(url, METHOD.GET);
};

export const getCatLevel1ByName = (MainCategoryId) => {
  const url = envBaseUrl + servicesList.productService + '/category/level1/name/' + MainCategoryId;
  return gettRequest(url, METHOD.GET);
};

export const getCatLevel2 = (level1Id) => {
  const url = envBaseUrl + servicesList.productService + '/category/level2/' + level1Id;
  return gettRequest(url, METHOD.GET);
};

export const getCatLevel2ByName = (level1Name) => {
  const url = envBaseUrl + servicesList.productService + '/category/level2/name/' + level1Name;
  return gettRequest(url, METHOD.GET);
};
export const getWarehouseData = (orgId) => {
  const url = envBaseUrl + servicesList.warehouseService + '/api/organisations/detail?orgId=' + orgId;
  return gettRequest(url, METHOD.GET);
};

export const setWarehouseData = (orgId, formdata) => {
  const url = envBaseUrl + servicesList.warehouseService + '/api/organisations/update/details/' + orgId;
  return patchMultipartRequest(url, formdata);
};

export const postLocationData = (payload) => {
  const url = envBaseUrl + servicesList.warehouseService + `/api/locations/create-location`;
  return postRequest(url, payload);
};

export const getWarehouseLocations = async (payload) => {
  const url = envBaseUrl + servicesList.warehouseService + `/api/organisations/v1/locations/data`;
  return await postRequest(url, payload);
};

export const getLocationwarehouseData = (id) => {
  const url = envBaseUrl + servicesList.warehouseService + `/api/organisations/locations/data?orgId=${id}`;
  return gettRequest(url, METHOD.GET);
};

export const getProdPortfolioInfo = (searchText) => {
  const url = envBaseUrl + servicesList.productService + '/product/suggest/' + searchText;
  return gettRequest(url, METHOD.GET);
};

export const getSinglewarehouseData = (orgId, locationId) => {
  const url = envBaseUrl + servicesList.warehouseService + `/api/locations/find/${orgId}?locationId=${locationId}`;
  return gettRequest(url, METHOD.GET);
};

export const setLocationData = (orgId, locationId, payload) => {
  const url = envBaseUrl + servicesList.warehouseService + `/api/locations/update/${orgId}/${locationId}`;
  return patchRequest(url, payload);
};

export const getLayoutentities = () => {
  const url = envBaseUrl + servicesList.warehouseService + '/api/entities';
  return gettRequest(url, METHOD.GET);
};

export const getAllLayouts = () => {
  const locId = localStorage.getItem('locId');
  const url = envBaseUrl + servicesList.layoutService + `/api/v1/details/all/fetch/${locId}`;
  return gettRequest(url, METHOD.GET);
};

export const createNewLayout = (payload) => {
  const url = envBaseUrl + servicesList.layoutService + '/api/v1/create';
  return postRequest(url, payload);
};

export const updateLayout = (payload) => {
  const url = envBaseUrl + servicesList.layoutService + '/api/v1/update';
  return patchRequest(url, payload);
};

export const deleteLayout = (payload) => {
  const url = envBaseUrl + servicesList.layoutService + '/api/v1/delete';
  return deleteRequest(url, payload);
};

export const getAllSavedLayoutGlossaries = () => {
  const url = envBaseUrl + servicesList.layoutService + '/api/glossaries/v1/all/fetch';
  return gettRequest(url, METHOD.GET);
};

export const createLayoutComponents = (payload) => {
  const locId = localStorage.getItem('locId');
  const orgId = localStorage.getItem('orgId');
  const url = envBaseUrl + servicesList.layoutService + `/api/definitions/v1/create/${orgId}/${locId}`;
  return postRequest(url, payload);
};

export const fetchLayoutComponents = (orgId, locId, layoutId) => {
  const url = envBaseUrl + servicesList.layoutService + `/api/definitions/v1/fetch/${orgId}/${locId}/${layoutId}`;
  return gettRequest(url, METHOD.GET);
};

export const getCategoryForLayout = () => {
  const url = envBaseUrl + servicesList.productService + `/category/main`;
  return gettRequest(url, METHOD.GET);
};

export const getSubEntitiesForLayout = (defId, layoutId) => {
  const url =
    envBaseUrl + servicesList.layoutService + `/api/sub-entities/v1/all/fetch?defId=${defId}&layoutId=${layoutId}`;
  return gettRequest(url, METHOD.GET);
};

export const createSubEntitiesHierarchyForLayout = (payload) => {
  const url = envBaseUrl + servicesList.layoutService + `/api/sub-entities/v1/hierarchy/create`;
  return postRequest(url, payload);
};

export const fetchCreatedSubEntitiesForLayout = (layoutId, mapId) => {
  let url = '';
  if (mapId !== null) {
    url =
      envBaseUrl +
      servicesList.layoutService +
      `/api/sub-entities/v1/hierarchy/fetch?layoutId=${layoutId}&mapId=${mapId}`;
  } else {
    url = envBaseUrl + servicesList.layoutService + `/api/sub-entities/v1/hierarchy/fetch?layoutId=${layoutId}`;
  }

  return gettRequest(url, METHOD.GET);
};

export const fetchEntireHierarchy = (layoutId, payload) => {
  const url = envBaseUrl + servicesList.layoutService + `/api/sub-entities/v2/hierarchy/fetch?layoutId=${layoutId}`;
  return postRequest(url, payload);
};

export const fetchTopHierarchy = (layoutId) => {
  const url =
    envBaseUrl + servicesList.layoutService + `/api/sub-entities/v1/hierarchy/first-level/fetch?layoutId=${layoutId}`;
  return gettRequest(url);
};

export const fetchSecondLevelHierarchy = (mapId, payload) => {
  const url =
    envBaseUrl + servicesList.layoutService + `/api/sub-entities/v1/hierarchy/second-level/fetch?parenId=${mapId}`;
  return postRequest(url, payload);
};

export const generateBarcodeForLayoutComponents = (locId, layoutId, mapId, imgFormat) => {
  const url =
    envBaseUrl +
    servicesList.layoutService +
    `/api/sub-entities/v1/barcodes/generate/${locId}/${layoutId}/?mapId=${mapId}&imgFormat=${imgFormat}`;
  return gettRequest(url);
};

export const fetchSubEntitiesForLayout = (layoutId, defId, mapId, payload) => {
  let url = '';
  if (mapId !== null) {
    url =
      envBaseUrl +
      servicesList.layoutService +
      `/api/sub-entities/v1/definitions/fetch?layoutId=${layoutId}&definitionId=${defId}&targetElementMapId=${mapId}`;
  } else {
    url =
      envBaseUrl +
      servicesList.layoutService +
      `/api/sub-entities/v1/definitions/fetch?layoutId=${layoutId}&definitionId=${defId}`;
  }

  return postRequest(url, payload);
};

export const layoutSubEntitiesBulkUpdate = (payload) => {
  const url = envBaseUrl + servicesList.layoutService + `/api/sub-entities/v1/details/bulk/update`;
  return patchRequest(url, payload);
};

export const addVendorPortfolioInCMS = (payload) => {
  const url = envBaseUrl + servicesList.productService + '/product/add/vendor';
  return postRequest(url, payload);
};
export const createCmsProduct = (payload) => {
  const url = envBaseUrl + servicesList.productService + '/product/v2/create';
  return postRequest(url, payload);
};

export const createInventoryProducts = (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + '/api/v1/product/create';
  return postRequest(url, payload);
};

export const editCmsProduct = (payload) => {
  const url = envBaseUrl + servicesList.productService + '/product/v2/update';
  return postRequest(url, payload);
};
export const uploadImageBase64 = (payload) => {
  const url = envBaseUrl + servicesList.productService + '/product/v2/cloud/upload/images';
  return postRequest(url, payload);
};

export const uploadImageBase64Folder = (payload) => {
  const url = envBaseUrl + servicesList.productService + '/product/v2/cloud/upload/file';
  return postRequest(url, payload);
};

export const addVendorPortfolioInVMS = (payload, vendorId) => {
  const url = envBaseUrl + servicesList.vendorVms + '/vendor/product/' + vendorId;
  return postRequest(url, payload);
};

export const saveRetailNewAddress = (payload) => {
  const url = envBaseUrl + servicesList.retailService + '/retail/v1/address/add';
  return postRequest(url, payload);
};

export const updateRetailAddress = (payload) => {
  const url = envBaseUrl + servicesList.retailService + `/retail/v1/address/update`;
  return postRequest(url, payload);
};

export const updateRetailContactInfo = (payload) => {
  const url = envBaseUrl + servicesList.retailService + `/retail/v1/contact/update`;
  return postRequest(url, payload);
};

export const postLayoutentities = (payload) => {
  const url = envBaseUrl + servicesList.warehouseService + `api/location/definitions/entities?locationId=${locationId}`;
  return postRequest(url, payload);
};

export const getdefinitions = (locationId) => {
  const url =
    envBaseUrl + servicesList.warehouseService + `/api/location/definitions/entities?locationId=${locationId}`;
  return gettRequest(url, METHOD.GET);
};

export const postPrnFile = (payload) => {
  const url = `http://localhost:8442/v1/printer/print`;
  return postFileRequest(url, payload);
};

export const getBuildingData = (payload, definationId, mapId) => {
  const url =
    envBaseUrl + servicesList.warehouseService + `/api/entityMapping/subEntities/map/${definationId}?mapId=${mapId}`;
  return postRequest(url, payload);
};

export const postdefinationentity = (locationId, payload) => {
  const url =
    envBaseUrl + servicesList.warehouseService + `/api/location/definitions/entities/add?locationId=${locationId}`;
  return postRequest(url, payload);
};

export const getdefinationEntity = (locationId) => {
  const url =
    envBaseUrl + servicesList.warehouseService + `/api/location/definitions/entities?locationId=${locationId}`;
  return gettRequest(url, METHOD.GET);
};

export const getVendorPurchaseOrderDetails = (destinationLocationId, sourceLocationId) => {
  const url = envBaseUrl + 'po/api/purchase-order-details/' + destinationLocationId + '/' + sourceLocationId;
  return gettRequest(url, METHOD.GET);
};

export const getVendorCapabilityUpdation = (orgId, locId) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/v1/purchase/order/vendor/summary/${orgId}/${locId}`;
  return gettRequest(url, METHOD.GET);
};

export const getPurchaceprice = (vendorId, gtin) => {
  const url = envBaseUrl + servicesList.vendorVms + `/primary/products/marketplace?mpVendorId=${vendorId}&gtin=${gtin}`;
  return gettRequest(url, METHOD.GET);
};

export const getVendorTopPurchaseOrderItem = (vendorId) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/top-purchase-order-item/${vendorId}`;
  return gettRequest(url, METHOD.GET);
};

export const editProduct = (gtin, payload) => {
  const url = envBaseUrl + servicesList.productService + `/product/edit/${gtin}`;
  return patchMultipartRequest(url, payload);
};

export const filterVendorSKUData = (payload) => {
  const url = envBaseUrl + servicesList.productService + `/filter/product`;
  return postRequest(url, payload);
};

export const getVendorProdPortfolioInfoSuggest = (payload) => {
  const url = envBaseUrl + servicesList.productService + `/suggest/filter/product`;
  return postRequest(url, payload);
};

export const categoryB2CCreation = (payload) => {
  const url = envBaseUrl + servicesList.productService + `/category/view/create`;
  return postRequest(url, payload);
};

export const categoryB2CEdit = (payload) => {
  const url = envBaseUrl + servicesList.productService + `/category/view/edit`;
  return postRequest(url, payload);
};
export const brandCreation = (payload) => {
  const url = envBaseUrl + servicesList.productService + `/brand/store/create/multiple`;
  return postRequest(url, payload);
};
export const activateBrand = (brandId) => {
  const url = envBaseUrl + servicesList.productService + `/brand/editStatus/${brandId}`;
  return postRequest(url);
};
export const activateSubBrand = (subBrandId) => {
  const url = envBaseUrl + servicesList.productService + `/brand/sub/brands/editStatus/${subBrandId}`;
  return postRequest(url);
};
export const activateManufacturer = (manufacturerId) => {
  const url = envBaseUrl + servicesList.productService + `/brand/manufacturer/editStatus/${manufacturerId}`;
  return postRequest(url);
};
export const masterBrandCreation = (payload) => {
  const url = envBaseUrl + servicesList.productService + `/brand/create/multiple`;
  return postRequest(url, payload);
};
export const masterSubBrandCreation = (payload) => {
  const url = envBaseUrl + servicesList.productService + `/brand/sub/create/multiple`;
  return postRequest(url, payload);
};
export const masterSubBrandEdit = (payload) => {
  const url = envBaseUrl + servicesList.productService + `/brand/sub/brands/edit`;
  return postRequest(url, payload);
};
export const subBrandEdit = (payload) => {
  const url = envBaseUrl + servicesList.productService + `/brand/sub/edit`;
  return postRequest(url, payload);
};

export const editBrand = (payload) => {
  const url = envBaseUrl + servicesList.productService + `/brand/edit`;
  return postRequest(url, payload);
};

export const singleBrandCreation = (payload) => {
  const url = envBaseUrl + servicesList.productService + `/brand/create`;
  return postRequest(url, payload);
};
export const createDetailedBrand = (payload) => {
  const url = envBaseUrl + servicesList.productService + `/brand/create/detailed/brands`;
  return postRequest(url, payload);
};

export const createManufactureNew = (payload) => {
  const url = envBaseUrl + servicesList.productService + '/brand/manufacturer/create';
  return postRequest(url, payload);
};

export const editManufacture = (payload) => {
  const url = envBaseUrl + servicesList.productService + '/brand/manufacturer/edit';
  return postRequest(url, payload);
};

export const editBrandStore = (payload) => {
  const url = envBaseUrl + servicesList.productService + `/brand/store/edit`;
  return postRequest(url, payload);
};
export const brandFilter = (payload) => {
  const url = envBaseUrl + servicesList.productService + `/brand/store/filter`;
  return postRequest(url, payload);
};

export const tagCreationProduct = (payload) => {
  const url = envBaseUrl + servicesList.productService + `/tag/create`;
  return postRequest(url, payload);
};

export const tagEdit = (payload) => {
  const url = envBaseUrl + servicesList.productService + `/tag/edit`;
  return postRequest(url, payload);
};

export const tagFilterdata = (payload) => {
  const url = envBaseUrl + servicesList.productService + `/tag/filter`;
  return postRequest(url, payload);
};
export const getVendorSKUData = (vendorId) => {
  const url = envBaseUrl + 'catalog/product/vendor/' + vendorId;
  return gettRequest(url, METHOD.GET);
};

export const getTotalStockValue = (orgId, locId) => {
  const url =
    envBaseUrl +
    servicesList.inventoryService +
    `/api/v1/inventory/get/overAll/stock-value?locationId=${locId}&orgId=${orgId}`;
  return gettRequest(url, METHOD.GET);
};

const currentDate = new Date();
const currentYear = currentDate.getFullYear();

export const getSlowMovingInventory = (orgId, locId, fromdate, todate, pageno) => {
  const url =
    envBaseUrl +
    servicesList.inventoryService +
    `/api/v1/inventory/slow-moving/get?locationId=${locId}&orgId=${orgId}&startDate=${
      fromdate || '2023-01-01'
    }&endDate=${todate || `${currentYear}-12-31`}&pageNumber=${pageno || 1}&pageSize=10`;
  return gettRequest(url, METHOD.GET);
};

export const getentityMapping = (locationId) => {
  const url = envBaseUrl + servicesList.warehouseService + `/api/entityMapping/subEntities/${locationId}`;
  return gettRequest(url, METHOD.GET);
};

export const getLayouttabledata = (locationId) => {
  const url =
    envBaseUrl + servicesList.warehouseService + `/api/location/definitions/subEntities?locationId=${locationId}`;
  return gettRequest(url, METHOD.GET);
};
export const addProductPricing = (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + '/api/Create/wh_products_caps';
  return postRequest(url, payload);
};
export const addProductInventory = (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + '/api/WPC/v2/create';
  return postRequest(url, payload);
};

export const getinventoryData = () => {
  const url =
    envBaseUrl +
    servicesList.inventoryService +
    '/api/inventory/cumulative/brand/1?pageSize=10&pageNumber=0&sortOrder=asc';
  return gettRequest(url, METHOD.GET);
};

export const getinventoryLocation = () => {
  const url = envBaseUrl + servicesList.inventoryService + `/api/inventory/Location/1/am001`;
  return gettRequest(url, METHOD.GET);
};

export const getinventorylocationdetails = (skuid) => {
  const url = envBaseUrl + servicesList.inventoryService + `/api/get-inventory-batches?SKU_id=${skuid}&location_id=1`;
  return gettRequest(url, METHOD.GET);
};
export const getProductExpiry = (locId, orgId, pageNo) => {
  const url =
    envBaseUrl +
    servicesList.inventoryService +
    `/api/v1/inventory/expiry/data/get?pageNumber=${pageNo}&pageSize=10&locationId=${locId}&orgId=${orgId}`;
  return gettRequest(url, METHOD.GET);
};
export const exportProductExpiry = (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + `/api/v2/inventory/expiry/data/export`;
  return postDownloadPdfRequest(url, payload);
};

export const getPiTimelineDetails = (pinumber) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/purchase-indent/timeline/${pinumber}`;
  return gettRequest(url, METHOD.GET);
};

export const getrelatedpodetails = (pinumber) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/related-purchase-order/${pinumber}`;
  return gettRequest(url, METHOD.GET);
};

export const postbillstabledetails = (payload) => {
  const url = envBaseUrl + servicesList.purchaseOrder + '/api/purchase-order-bill-list';
  return postRequest(url, payload);
};

export const sendOtp = (payload) => {
  const url = envBaseUrl + servicesList.userAuth + '/user/login';
  return postOrgRequest(url, payload);
};
export const getpiagedetails = (piNum) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/purchase-indent/piAge/${piNum}`;
  return gettRequest(url, METHOD.GET);
};

export const getItemstabledetails = (piNum) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/purchase-indent/items/specifications/${piNum}`;
  return gettRequest(url, METHOD.GET);
};

export const createOtp = (payload) => {
  const url = envBaseUrl + servicesList.userAuth + '/user/login';
  return postOrgRequest(url, payload);
};

export const verifyOtp = (payload) => {
  const url = envBaseUrl + servicesList.userAuth + '/otp/verify';
  return postValidateRequest(url, payload);
};

export const verifyOtpV2 = (payload) => {
  const url = envBaseUrl + servicesList.userAuth + '/otp/v2/verify';
  return postValidateRequest(url, payload);
};

export const postinventorytabledata = async (payload) => {
  const url = envBaseUrl + 'ims/api/fetch-inventory-list-by-filter';
  return await postRequest(url, payload);
};

export const productLabelTableData = async (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + '/api/inventory/v1/filter/modifiedOn';
  return await postRequest(url, payload);
};

export const postinventoryadjusmenttabledata = (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + '/api/fetch-adjustInventory-filter';
  return postRequest(url, payload);
};

export const getinventorygtindata = (gtin) => {
  const locId = localStorage.getItem('locId');
  const url =
    envBaseUrl + servicesList.inventoryService + `/api/get-inventory-Batch-by-Gtin?GTIN=${gtin}&location_id=${locId}`;
  return gettRequest(url, METHOD.GET);
};

export const postNewbills = (payload) => {
  const url = envBaseUrl + servicesList.purchaseOrder + '/api/purchase-order-bill';
  return postFileRequest(url, payload);
};

export const postPaymentBills = (payload) => {
  const url = envBaseUrl + servicesList.purchaseOrder + '/api/payment-made';
  return postFileRequest(url, payload);
};

export const postRefundBills = (payalod) => {
  const url = envBaseUrl + servicesList.purchaseOrder + '/api/refund';
  return postFileRequest(url, payalod);
};

export const productSuggestionSearch = (payload) => {
  const url = envBaseUrl + servicesList.productService + `/product/suggest/${payload}`;
  return gettRequest(url, payload);
};

export const manufacturerSearch = (payload) => {
  const url = envBaseUrl + servicesList.productService + `/manufacture/search/${payload}?page=0&pageSize=20`;
  return gettRequest(url, payload);
};

export const postpurchasemadetable = (payload) => {
  const url = envBaseUrl + servicesList.purchaseOrder + '/api/payment-made-list';
  return postRequest(url, payload);
};
export const exportPurchaseReportsBigQuery = (payload) => {
  const url = envBaseUrl + servicesList.purchaseOrder + '/report/api/v1/big/query/generic/purchase/report';
  return postRequest(url, payload);
};
export const purchaseAvailabilityReport = (payload) => {
  const url = envBaseUrl + servicesList.purchaseOrder + '/report/api/v1/report/request/filter';
  return postRequest(url, payload);
};

export const approvedpurchaserequest = (payload) => {
  const url = envBaseUrl + servicesList.purchaseOrder + '/api/purchase-indent/status';
  return postRequest(url, payload);
};

export const rejectpurchaserequest = (payload) => {
  const url = envBaseUrl + servicesList.purchaseOrder + '/api/purchase-indent/status';
  return postRequest(url, payload);
};

export const getpurchaseorderdetails = (poNum) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/purchase-order-details-page/${poNum}`;
  return gettRequest(url, METHOD.GET);
};

export const piToPOConversion = (payload) => {
  const url = envBaseUrl + servicesList.purchaseOrder + '/api/purchase-indent/convert/purchase-order';
  return postRequest(url, payload);
};

export const saveVendorForPI = (payload) => {
  const url = envBaseUrl + servicesList.purchaseOrder + '/api/purchase-indent/save/vendor/details';
  return postRequest(url, payload);
};

export const getVendorAddressForPI = (vendorId, piNum) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/purchase-indent/vendorId/${vendorId}/piNumber/${piNum}`;
  return postRequest(url);
};

export const postSendToVendor = (poNum) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/v1/purchase/vendor/notify/${poNum}`;
  return postRequest(url);
};

export const removeVendorfromPIItem = (piNum, itemCode) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/purchase-indents/items/${piNum}/${itemCode}`;
  return patchRequest(url);
};

export const getpurchaseorderdetailsvalue = (poNum) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/purchase-order-details-page/${poNum}`;
  return gettRequest(url, METHOD.GET);
};

export const panVerification = (payload) => {
  const url = envBaseUrl + 'vms/kyc/gst/pan';
  return postRequest(url, payload);
};

export const indPanVerification = (payload) => {
  const url = envBaseUrl + 'vms/kyc/verify/pan';
  return postRequest(url, payload);
};

export const vendorPanVerification = (payload) => {
  const url = envBaseUrl + servicesList.vendorVms + `/kyc/validate`;
  return postRequest(url, payload);
};

export const vendorGstVerification = (payload) => {
  const url = envBaseUrl + servicesList.vendorVms + `/kyc/validate`;
  return postRequest(url, payload);
};

export const getpurchaseordertimeline = (poNum) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/purchase-order/timeline/${poNum}`;
  return gettRequest(url, METHOD.GET);
};

export const postaddpurchaseorder = (payload) => {
  const url = envBaseUrl + servicesList.purchaseOrder + '/api/purchase-order';
  return postRequest(url, payload);
};
export const updatePurchaseorder = (payload) => {
  const url = envBaseUrl + servicesList.purchaseOrder + '/api/v1/purchase/order/update';
  return postRequest(url, payload);
};

export const updatestatuspurchaseorder = (payload) => {
  const url = envBaseUrl + servicesList.purchaseOrder + '/api/purchase-order-status';
  return postRequest(url, payload);
};

export const purchaseServicepreviewpage = (piNum) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/purchase-indent/pi-preview/${piNum}`;
  return gettRequest(url, METHOD.GET);
};

export const rejectpurchaseorder = (payload) => {
  const url = envBaseUrl + servicesList.purchaseOrder + '/api/purchase-order-status';
  return postRequest(url, payload);
};

export const verifyBank = (payload) => {
  const url = envBaseUrl + servicesList.vendorVms + '/kyc/bank';
  return postRequest(url, payload);
};

export const createVendorDelivery = (payload) => {
  const url = envBaseUrl + servicesList.vendorVms + '/vendor/v1/delivery';
  return postRequest(url, payload);
};
export const createVendorReturns = (payload) => {
  const url = envBaseUrl + servicesList.vendorVms + '/vendor/v1/return';
  return postRequest(url, payload);
};
export const createVendorPaymentTerms = (payload) => {
  const url = envBaseUrl + servicesList.vendorVms + '/vendor/v1/purchase';
  return postRequest(url, payload);
};
export const updateVendorPaymentTerms = (payload) => {
  const url = envBaseUrl + servicesList.vendorVms + '/vendor/v1/purchase';
  return patchRequest(url, payload);
};
export const createVendorPromotions = (payload) => {
  const url = envBaseUrl + servicesList.vendorVms + '/vendor/v1/promotion';
  return postRequest(url, payload);
};
export const autoSaveVendorDetails = (payload) => {
  const url = envBaseUrl + servicesList.vendorVms + '/vendor/v1/auto/save';
  return postRequest(url, payload);
};
export const getVendorDraftDetails = (code) => {
  const url = envBaseUrl + servicesList.vendorVms + `/vendor/v1/auto/save?code=${code}`;
  return gettRequest(url, METHOD.GET);
};

export const vendorDeliveryFullFillmentById = (vendorId) => {
  const url = envBaseUrl + servicesList.vendorVms + `/vendor/v1/delivery?vendorId=${vendorId}`;
  return gettRequest(url, METHOD.GET);
};
export const vendorPaymentTermstById = (vendorId) => {
  const url = envBaseUrl + servicesList.vendorVms + `/vendor/v1/purchase?vendorId=${vendorId}`;
  return gettRequest(url, METHOD.GET);
};
export const vendorReturnAndReplacementById = (vendorId) => {
  const url = envBaseUrl + servicesList.vendorVms + `/vendor/v1/return?vendorId=${vendorId}`;
  return gettRequest(url, METHOD.GET);
};
export const vendorPromotionsById = (vendorId) => {
  const url = envBaseUrl + servicesList.vendorVms + `/vendor/v1/promotion?vendorId=${vendorId}`;
  return gettRequest(url, METHOD.GET);
};
export const verifyOnlyGst = (payload) => {
  const url = envBaseUrl + servicesList.vendorVms + `/kyc/gst/${payload}`;
  return gettRequest(url, METHOD.GET);
};

export const userVerification = (payload) => {
  const url = envBaseUrl + servicesList.userAuth + '/erp/user/login';
  return postOrgRequest(url, payload);
};

export const userOtpVerification = (payload) => {
  const url = envBaseUrl + servicesList.userAuth + '/otp/verify';
  return postValidateRequest(url, payload);
};
export const userOtpVerificationV2 = (payload) => {
  const url = envBaseUrl + servicesList.userAuth + '/otp/v2/verify';
  return postValidateRequest(url, payload);
};

export const getUserDetails = () => {
  const url = envBaseUrl + servicesList.userService + '/user';
  return gettRequest(url, METHOD.GET);
};

export const converpurchasetoopen = (payload) => {
  const url = envBaseUrl + servicesList.purchaseOrder + '/api/purchase-order-status';
  return postRequest(url, payload);
};

export const getVendorAddress = (vendorId) => {
  const url = envBaseUrl + servicesList.vendorVms + `/vendor/address/${vendorId}`;
  return gettRequest(url, METHOD.GET);
};

export const billsDeatilspagedata = (billNo) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/purchase-order-bill-details-page/${billNo}`;
  return gettRequest(url, METHOD.GET);
};

export const purchaseorderwarehousedetails = (orgId) => {
  const url = envBaseUrl + `wms/api/organisations/locations/details?orgId=${orgId}`;
  return gettRequest(url, METHOD.GET);
};

export const customeraddressdetails = (cusId) => {
  const url = envBaseUrl + `retail-service/retail/getRetail/${cusId}`;
  return gettRequest(url, METHOD.GET);
};

export const billtimelinedetailsO = (billNo) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/purchase-order-bill/timeline/${billNo}`;
  return gettRequest(url, METHOD.GET);
};

export const approvebillpost = (payload) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/purchase-order-bill-status`;
  return postRequest(url, payload);
};

export const rejectbillpost = (payload) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/purchase-order-bill-status`;
  return postRequest(url, payload);
};

export const getrefundtabledata = (payload) => {
  const url = envBaseUrl + servicesList.purchaseOrder + '/api/refund-filter';
  return postRequest(url, payload);
};

export const getvendorName = (poNum) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/purchase-order/${poNum}`;
  return gettRequest(url, METHOD.GET);
};

export const getvendorNameBill = (billNo) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/purchase-order-bill/${billNo}`;
  return gettRequest(url, METHOD.GET);
};

export const purchaseindentlocationdetails = (orgId) => {
  const url = envBaseUrl + `wms/api/organisations/locations/data?orgId=${orgId}`;
  return gettRequest(url, METHOD.GET);
};

export const purchaseorderpdfdownload = (poNum) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/purchase-order/preview/pdf/${poNum}`;
  return gettRequest(url, METHOD.GET);
};

export const getAllRoles = (role) => {
  const url = envBaseUrl + servicesList.userService + `/roles?product=${role}`;
  return gettRequest(url, METHOD.GET);
};
export const previewwarehouseDetails = (orgId) => {
  const url = envBaseUrl + `wms/api/organisations/information?orgId=${orgId}`;
  return gettRequest(url, METHOD.GET);
};

export const postbillgeneratedDetails = (payload) => {
  const url = envBaseUrl + servicesList.purchaseOrder + '/api/purchase-order-bill-list';
  return postRequest(url, payload);
};

export const getPurchaseordernumber = (billNo) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/purchase-order-bill/${billNo}`;
  return gettRequest(url, METHOD.GET);
};

export const getCategoryList = () => {
  const url = envBaseUrl + servicesList.productService + '/category/main';
  return gettRequest(url, METHOD.GET);
};

export const getCategoryNameProduct = (catName, currentPage) => {
  const url = envBaseUrl + servicesList.productService + `/product/category/${catName}?page=${currentPage}`;
  return gettRequest(url, METHOD.GET);
};

export const createStaff = (payload) => {
  const url = envBaseUrl + servicesList.userService + '/user/new/context';
  return postOrgRequest(url, payload);
};

export const updateContext = (payload) => {
  const url = envBaseUrl + servicesList.userService + '/user/context';
  return postRequest(url, payload);
};

export const deletedUsers = (payload) => {
  const url = envBaseUrl + servicesList.userService + '/users/deleted/contextId/orgId';
  return postRequest(url, payload);
};

export const userStatusChange = (payload) => {
  const url = envBaseUrl + servicesList.userService + '/user/update/delete/status';
  return postRequest(url, payload);
};

export const getpurchaseorderbyBill = (billNo) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/purchase-order-bill/${billNo}`;
  return gettRequest(url, METHOD.GET);
};

export const downloadPurchaseIndentpdf = (piNum) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/purchase-indent/preview/pdf/${piNum}`;
  return gettRequest(url, METHOD.GET);
};

export const addaQuote = (payload) => {
  const url = envBaseUrl + servicesList.purchaseOrder + '/api/purchase-indent/document/upload';
  return postFileRequest(url, payload);
};

export const documnetIdBills = (docId) => {
  const url = envBaseUrl + `oms/api/purchase-order/document/download/${docId}`;
  return gettRequest(url, METHOD.GET);
};

export const postaddaQuote = (payload) => {
  const url = envBaseUrl + servicesList.purchaseOrder + '/api/purchase-indent-quote';
  return postRequest(url, payload);
};

export const vendorInfoEdit = (payload, vendorId) => {
  const url = envBaseUrl + `vms/vendor/info/edit/${vendorId}`;
  return patchRequest(url, payload);
};
export const vendorDeliveryFullFillmentEdit = (payload) => {
  const url = envBaseUrl + servicesList.vendorVms + `/vendor/v1/delivery`;
  return patchRequest(url, payload);
};

export const vendorOtherDetailsEdit = (payload, vendorId) => {
  const url = envBaseUrl + `vms/vendor/other/edit/${vendorId}`;
  return patchRequest(url, payload);
};

export const getAllUserOrgs = (payload) => {
  const url = envBaseUrl + servicesList.userService + '/user/orgIds';
  return postRequest(url, payload);
};

export const newpurchasePreview = (piNum) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/purchase-indent/pi-preview/${piNum}`;
  return gettRequest(url, METHOD.GET);
};

export const poInward = (payload) => {
  const url = envBaseUrl + servicesList.inwardService + `/api/inwards/v1/start`;
  return postRequest(url, payload);
};

export const getpoInwardDataTable = (locationId, payload) => {
  const url = envBaseUrl + servicesList.inwardService + `/api/inwards/v1/sessions/history/${locationId}`;
  return postRequest(url, payload);
};

export const postInwardData = (sessionId, payload) => {
  const url = envBaseUrl + servicesList.inwardService + `/api/inwards/v1/complete?sessionId=${sessionId}`;
  return postRequest(url, payload);
};

export const inwardBatchAvailabilityCheck = (locId, gtin, batchNo) => {
  // items/v1/verify?locationId=RLC_15&gtin=8901012133064&batchNo=BT011
  const url =
    envBaseUrl + servicesList.inwardService + `/items/v1/verify?locationId=${locId}&gtin=${gtin}&batchNo=${batchNo}`;
  return gettRequest(url, METHOD.GET);
};

export const putAwayPonumber = (poNumber, orgId, locationId) => {
  const url =
    envBaseUrl + servicesList.inwardService + `/api/putaways/v1/sessions/ids/${poNumber}/${orgId}/${locationId}/PO`;
  return gettRequest(url, METHOD.GET);
};

export const productsRejection = (locId, payload) => {
  const url = envBaseUrl + servicesList.inwardService + `/api/rejections/v1/items/fetch?locId=${locId}`;
  return postRequest(url, payload);
};

// export const sessionRequest = (sessionId) => {
//   const url = envBaseUrl + servicesList.inwardService + `/api/putaways/v1/sessions/open-items/${sessionId}`;
//   return gettRequest(url, METHOD.GET);
// };

export const sessionRequest = (sessionId) => {
  const url = envBaseUrl + servicesList.inwardService + `/api/putaways/v2/sessions/open-items/${sessionId}`;
  return gettRequest(url, METHOD.GET);
};

export const putAwayLoactionData = (orgId, locationid) => {
  const url = envBaseUrl + servicesList.layoutService + `/api/sub-entities/v1/storage-suggest/${orgId}/${locationid}`;
  return gettRequest(url, METHOD.GET);
};

export const fetchStorageDetailsWithBarcodeId = (barcode) => {
  const url = envBaseUrl + servicesList.layoutService + `/api/sub-entities/v1/storage/details?barcodeId=${barcode}`;
  return gettRequest(url, METHOD.GET);
};

export const postputAwayData = (payload) => {
  const url = envBaseUrl + servicesList.inwardService + `/api/putaways/v1/complete/`;
  return postRequest(url, payload);
};

export const quoteApprovedpost = (payload) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/purchase-indent-quote-status`;
  return postquoteRequests(url, payload);
};

export const rejectQuoterequest = (payload) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/purchase-indent-quote-status`;
  return postquoteRequests(url, payload);
};

export const getItemsInfo = (searchText) => {
  const url = envBaseUrl + servicesList.productService + '/suggest/filter/product';
  return postRequest(url, searchText);
};
export const calculationPurchase = (payload) => {
  const url = envBaseUrl + servicesList.purchaseOrder + '/api/purchase-order/calculate-price';
  return postRequest(url, payload);
};

export const generateBarcode = (payload, at) => {
  const url = envBaseUrl + servicesList.productService + '/barcode/generate';
  return postRequest(url, payload, at);
};

export const generateWeighingScaleBarcode = (payload, at) => {
  const url = envBaseUrl + servicesList.productService + '/barcode/weighing-scale/generate';
  return postRequest(url, payload, at);
};

export const generateWeighingBarcode = (payload, at) => {
  const url = envBaseUrl + servicesList.productService + '/barcode/weighing-scale/generate';
  return postRequest(url, payload, at);
};

export const postNewCartService = (cartId) => {
  const url = envBaseUrl + servicesList.cartService + `/product/order/${cartId}?inventoryCheck=NO`;
  return postFileRequest(url);
};

export const CreateNewSalesCart = (payload) => {
  const url = envBaseUrl + servicesList.cartService + `/create`;
  return postRequest(url, payload);
};

export const addItemsToSalesCart = (cartId, gtinNo, locId) => {
  const url =
    envBaseUrl +
    servicesList.cartService +
    `/product/add/gtin/${cartId}/${gtinNo}?locationId=${locId}&inventoryCheck=NO`;
  return postRequest(url);
};

export const assignUser = (locId, orgId) => {
  const url = envBaseUrl + `user-service/user/WAREHOUSE_USER/location/${locId}/org/${orgId}`;
  return gettRequest(url, METHOD.GET);
};

export const profileUpdateContext = (payload, uidx) => {
  const url = envBaseUrl + servicesList.userService + `/user/${uidx}`;
  return putRequest(url, payload);
};

export const userAccessLoc = (payload) => {
  const url = envBaseUrl + servicesList.userService + '/user/contexts/id';
  return postRequest(url, payload);
};

export const getAllOrgUsers = (payload) => {
  const url = envBaseUrl + servicesList.userService + `/users/contextId/orgId`;
  return postRequest(url, payload);
};

export const getAllOrgUsersFiltered = (payload, userRoles) => {
  const url = envBaseUrl + servicesList.userService + `/users/v2/contextId/orgId?${userRoles}`;
  return postRequest(url, payload);
};

export const itemsShippedpost = (payload) => {
  const url = envBaseUrl + servicesList.purchaseOrder + '/api/purchase-order-item-status';
  return postRequest(url, payload);
};
export const setUserDetails = (payload) => {
  const url = envBaseUrl + servicesList.userService + '/user/' + payload.uidx;
  return putRequest(url, payload);
};
export const pidelete = (payload) => {
  const url = envBaseUrl + servicesList.purchaseOrder + '/api/purchase-indent/delete';
  return postRequest(url, payload);
};

export const podelete = (payload) => {
  const url = envBaseUrl + servicesList.purchaseOrder + '/api/purchase-order/delete';
  return postRequest(url, payload);
};
export const generateBarcodeWithNum = (num, at) => {
  const url = envBaseUrl + servicesList.productService + '/barcode/' + num;
  return gettRequest(url, num, at);
};

export const getAllOrderByDestinationId = (locId) => {
  const url = envBaseUrl + servicesList.saleService + `/orders/${locId}`;
  return gettRequest(url, METHOD.GET);
};

export const getAppVersion = () => {
  const url = envDomainUrl + 'gateway/app-version';
  return gettRequest(url, METHOD.GET);
};

export const getsalesorderdetailsvalue = (orderId) => {
  const url = envBaseUrl + servicesList.saleService + `/orders/order/${orderId}`;
  return gettRequest(url, METHOD.GET);
};

export const updateCartData = async (payload, cartId) => {
  const url = envBaseUrl + servicesList.cartService + `/update/${cartId}`;
  return await patchRequest(url, payload);
};

export const viewSalesPreviewpdf = (payload) => {
  const url = envBaseUrl + servicesList.saleService + '/orders/order/temp/preview/pdf';
  return postpdfRequest(url, payload);
};

export const exportTaxPdf = (payload) => {
  const url = envBaseUrl + servicesList.saleService + '/reports/download/taxReport';
  return postDownloadPdfRequest(url, payload);
};
export const exportGstConsolidatedReport = (payload) => {
  const url = envBaseUrl + servicesList.saleService + '/orders/gst-consolidate-report';
  return postDownloadPdfRequest(url, payload);
};
export const exportSalesOverTime = (payload) => {
  const url = envBaseUrl + servicesList.saleService + '/reports/v1/salesOverTime/report';
  return postRequest(url, payload);
};
export const exportTaxInvoice = (payload) => {
  const url = envBaseUrl + servicesList.saleService + '/reports/download/taxInvoice';
  return postDownloadPdfRequest(url, payload);
};

export const exportProfitReport = (payload) => {
  const url = envBaseUrl + servicesList.saleService + '/reports/download/profitReport';
  return postDownloadPdfRequest(url, payload);
};

export const exportProductProfitReport = (payload) => {
  const url = envBaseUrl + servicesList.saleService + '/reports/download/productWise/profitReport';
  return postDownloadPdfRequest(url, payload);
};
export const exportCouponUsage = (payload) => {
  const url = envBaseUrl + servicesList.saleService + '/reports/download/couponUsage/report';
  return postDownloadPdfRequest(url, payload);
};

export const exportEditOrders = (payload) => {
  const url = envBaseUrl + servicesList.saleService + '/reports/download/editOrders/report';
  return postDownloadPdfRequest(url, payload);
};
export const exportCouponReport = (payload, locId, startDate, endDate) => {
  const url =
    envBaseUrl +
    servicesList.saleService +
    `/orders/coupon-report?locationId=${locId}&startDate=${startDate}&endDate=${endDate}`;
  return postRequest(url, payload);
};
export const downloadIndentpdf = (piNum) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/purchase-indent/preview/pdf/${piNum}`;
  return pdfgetRequest(url, METHOD.GET);
};

export const downloadOrderspdf = (poNum) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/purchase-order/preview/pdf/${poNum}`;
  return pdfgetRequest(url, METHOD.GET);
};

export const vieworderspdf = (docId) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/purchase-order/document/download/${docId}`;
  return getPdfRequest(url, METHOD.GET);
};

export const viewPurchasequotepdf = (docId) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/purchase-indent/document/download/${docId}`;
  return pdfgetRequest(url, METHOD.GET);
};

export const deletepurchasequote = (payload) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/purchase-indent/quote/delete`;
  return postRequest(url, payload);
};

export const billdelete = (payload) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/purchase-order-bill/delete`;
  return postRequest(url, payload);
};

export const getAllManufacturer = () => {
  const url = envBaseUrl + servicesList.productService + `/manufactures`;
  return gettRequest(url, METHOD.GET);
};

export const getbillsvendordetails = (poNum) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/purchase-order/${poNum}`;
  return gettRequest(url, METHOD.GET);
};
export const getVendorDeadStock = (locId, vendorId) => {
  const url =
    envBaseUrl + servicesList.inventoryService + `/api/vendor/v2/deadStock?locationId=${locId}&vendorId=${vendorId}`;
  return gettRequest(url, METHOD.GET);
};

export const vendorStatement = (payload) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/v1/purchase/order/statement`;
  return postRequest(url, payload);
};

export const vendorDebitNoteFilter = (payload) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/v1/debit/note/filter`;
  return postRequest(url, payload);
};

export const vendorAvailableStockValue = (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + `/api/v1/inventory/vendors/stocks`;
  return postRequest(url, payload);
};

export const vendorStatementPdf = (payload) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/v1/purchase/order/statement/document`;
  return postpdfRequest(url, payload);
  // return postDownloadPdfRequest(url, payload);
};

export const previewpurchaseOrder = (payload) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/purchase-order/temp/preview/pdf`;
  return postpdfRequest(url, payload);
};

export const previewpurchaseIndent = (payload) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/purchase-indent/preview/pdf`;
  return postpdfRequest(url, payload);
};

export const closepurchaseIndent = (payload) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/purchase-indent-status`;
  return postRequest(url, payload);
};

export const getputAwaytable = (orgId, locId, payload) => {
  const url = envBaseUrl + servicesList.inwardService + `/api/putaways/v1/sessions/history/${locId}`;
  return postRequest(url, payload);
};

export const inwardDetailsData = (sessionId) => {
  const url = envBaseUrl + servicesList.inwardService + `/api/inwards/v1/sessions/items/${sessionId}`;
  return gettRequest(url, METHOD.GET);
};

export const getOrgNameLogo = (orgId) => {
  const url = envBaseUrl + servicesList.warehouseService + `/api/organisations/name-logo/${orgId}`;
  return gettRequest(url, METHOD.GET);
};

export const getUserLocations = (payload) => {
  const url = envBaseUrl + servicesList.userService + '/user/contexts/id';
  return postRequest(url, payload);
};

export const getUserLocationsDetails = (payload, orgId) => {
  const url = envBaseUrl + servicesList.warehouseService + `/api/locations/fetch/location-details/${orgId}`;
  return postRequest(url, payload);
};

export const getAllOrdersList = (payload) => {
  const url = envBaseUrl + servicesList.saleService + `/orders/v3/order-filter`;
  return postRequest(url, payload);
};
export const getAllOrdersListV2 = (payload) => {
  const url = envBaseUrl + servicesList.saleService + `/orders/v2/order-filter`;
  return postRequest(url, payload);
};

export const editCartQuantitySellingPrice = (payload) => {
  const url = envBaseUrl + servicesList.cartService + `/v2/sales-order/add/product/qty`;
  return postRequest(url, payload);
};
export const editCartQuantity = (payload, cartId, locId) => {
  const url =
    envBaseUrl + servicesList.cartService + `/product/add/b2b/${cartId}?locationId=${locId}&inventoryCheck=NO`;
  return postRequest(url, payload);
};

export const removeCartProduct = (cartId, gtin) => {
  const url = envBaseUrl + servicesList.cartService + `/pos/remove/${cartId}/${gtin}?inventoryCheck=NO`;
  return postRequest(url);
};

export const removeCartProductByID = (cartId, id) => {
  const url = envBaseUrl + servicesList.cartService + `/v2/sales-order/delete/product/${cartId}/${id}`;
  return postRequest(url);
};

export const createOrderwithPayment = (cartId, paymentMethod) => {
  const url =
    envBaseUrl + servicesList.cartService + `/order/${cartId}?inventoryCheck=NO&paymentMethod=${paymentMethod}`;
  return postRequest(url);
};

export const newSalesOrderCart = (payload) => {
  const url = envBaseUrl + servicesList.cartService + `/so/v1/cart/create`;
  return postRequest(url, payload);
};

export const getOrderTimeLine = (orderId) => {
  const url = envBaseUrl + servicesList.saleService + `/orders/trackFulfilmentStatus/${orderId}`;
  return gettRequest(url, METHOD.GET);
};
export const salesOrderInvoice = (orderId) => {
  const url = envBaseUrl + servicesList.saleService + `/orders/invoice/convertToInvoice?orderId=${orderId}`;
  return postRequest(url);
};

export const exportEndofDayReport = (payload) => {
  const url = envBaseUrl + servicesList.saleService + `/reports/download/dayClosingReport`;
  return postRequest(url, payload);
};
export const exportItemWiseReport = (payload) => {
  const url = envBaseUrl + servicesList.saleService + `/reports/download/itemWise/report`;
  return postRequest(url, payload);
};
export const exportSelectedItemWiseReport = (payload) => {
  const url = envBaseUrl + servicesList.saleService + `/reports/download/report/gtins-item-wise`;
  return postRequest(url, payload);
};
export const exportBigQuerySalesReports = (payload) => {
  const url = envBaseUrl + servicesList.saleService + `/reports/v1/bigQuery/sales/report`;
  return postRequest(url, payload);
};

export const previPurchasePrice = (gtin, orgId) => {
  const url =
    envBaseUrl + servicesList.purchaseOrder + `/api/purchase-order-item/previous/purchase/price/${gtin}/${orgId}`;
  return gettRequest(url, METHOD.GET);
};

export const getRetailUserLocationDetails = (orgId) => {
  const url = envBaseUrl + servicesList.retailService + `/branch/v1/get?retailId=${orgId}`;
  return gettRequest(url, METHOD.GET);
};

export const getRetailBranchDetails = (locId) => {
  const url = envBaseUrl + servicesList.retailService + `/branch/v1/get/details?branchId=${locId}`;
  return gettRequest(url, METHOD.GET);
};

export const getUserFromUidx = (uidx) => {
  const url = envBaseUrl + servicesList.userService + `/user/${uidx}`;
  return gettRequest(url, METHOD.GET);
};

export const getRetailDetailsByBranch = (locId) => {
  const url = envBaseUrl + servicesList.retailService + `/branch/v1/bill/details?branchId=${locId}`;
  return gettRequest(url, METHOD.GET);
};

export const allOrgNames = (payload) => {
  const url = envBaseUrl + servicesList.warehouseService + `/api/organisations/name-data`;
  return postRequest(url, payload);
};

export const allRetailNames = (payload) => {
  const url = envBaseUrl + servicesList.retailService + `/retail/v1/get/all`;
  return postRequest(url, payload);
};

export const getRetailnames_location = async (payload) => {
  const url = envBaseUrl + servicesList.retailService + `/retail/v1/retail/list`;
  return await postRequest(url, payload);
};

export const getBranchAllAdresses = (branchId) => {
  const url = envBaseUrl + servicesList.retailService + `/branch/v1/address/get?branchId=${branchId}`;
  return gettRequest(url, METHOD.GET);
};

export const createBranchRetail = (payload) => {
  const url = envBaseUrl + servicesList.retailService + `/branch/v2/create`;
  return postRequest(url, payload);
};

export const addBranchAddressRetail = (payload) => {
  const url = envBaseUrl + servicesList.retailService + `/branch/v1/address/add`;
  return postRequest(url, payload);
};

export const updateBranchRetail = (payload) => {
  const url = envBaseUrl + servicesList.retailService + `/branch/v1/update`;
  return postRequest(url, payload);
};
export const updateBranchAddressRetail = (payload) => {
  const url = envBaseUrl + servicesList.retailService + `/branch/v1/address/update`;
  return postRequest(url, payload);
};
export const addBranchContactRetail = (payload) => {
  const url = envBaseUrl + servicesList.retailService + `/branch/v1/contact/add`;
  return postRequest(url, payload);
};
export const updateBranchContactRetail = (payload) => {
  const url = envBaseUrl + servicesList.retailService + `/branch/v1/contact/update`;
  return postRequest(url, payload);
};

export const flushCartProd = (cartId) => {
  const url = envBaseUrl + servicesList.cartService + `/product/flush/${cartId}`;
  return postRequest(url);
};

export const deleteSalesOrderCartId = (cartId) => {
  const url = envBaseUrl + servicesList.cartService + `/so/v1/delete/single/${cartId}`;
  return postRequest(url);
};

export const updateOrderTimeline = (payload) => {
  const url = envBaseUrl + servicesList.saleService + `/orders/updateFulfilmentStatus/`;
  return postRequest(url, payload);
};

export const cancelB2COrder = ({ userId, orderId }) => {
  const url = envBaseUrl + servicesList.saleService + `/orders/cancel/order/B2C/${orderId}?user-id=${userId}`;
  return postRequest(url);
};

export const roleBasedPermission = (payload) => {
  const url = envBaseUrl + servicesList.userService + `/permissions`;
  return postRequest(url, payload);
};

export const createLoyaltyPoints = (payload) => {
  const url = envBaseUrl + servicesList.loyaltyService + `/api/configurations/v3/create`;
  return postRequest(url, payload);
};

export const dashboardLotaltyRedeem = (orgId, platfromType) => {
  const url =
    envBaseUrl +
    servicesList.loyaltyService +
    `/api/configurations/v2/expenditure/details?sourceOrgId=${orgId}&platformSupportType=${platfromType}`;
  return gettRequest(url, METHOD.GET);
};
export const poTimelineforPI = (piNum) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/v1/pi/purchase/order/timeline/${piNum}`;
  return gettRequest(url, METHOD.GET);
};

export const userLogOut = (payload) => {
  const url = envBaseUrl + servicesList.userService + `/user/logout`;
  return postValidateLogOutRequest(url, payload);
};
export const userLogOutV2 = (payload) => {
  const url = envBaseUrl + servicesList.userService + `/user/v2/logout`;
  return postValidateLogOutRequest(url, payload);
};
export const userRefreshToken = () => {
  const url = envBaseUrl + servicesList.userAuth + `/refresh/token`;
  return postRTRequest(url);
};

export const checkServiceability = (pinCode) => {
  const url = envBaseUrl + servicesList.serviceability + `/api/tats/v2/pinCodes/serviceable/check?pinCode=${pinCode}`;
  return gettRequest(url, METHOD.GET);
};

export const deleteBrandAddress = (payload) => {
  const url = envBaseUrl + servicesList.retailService + `/branch/v1/address/delete`;
  return postRequest(url, payload);
};
export const getAllBranchContact = (branchId) => {
  const url = envBaseUrl + servicesList.retailService + `/branch/v1/contact/get?branchId=${branchId}`;
  return gettRequest(url, METHOD.GET);
};

export const deleteBrandContact = (payload) => {
  const url = envBaseUrl + servicesList.retailService + `/branch/v1/contact/delete`;
  return postRequest(url, payload);
};
export const deleteBranch = (payload) => {
  const url = envBaseUrl + servicesList.retailService + `/branch/v1/delete`;
  return postRequest(url, payload);
};

export const posUserPinGeneration = (payload) => {
  const url = envBaseUrl + servicesList.userService + `/user/signup/pin`;
  return postOrgRequest(url, payload);
};

export const vendorOrgDetails = (orgId) => {
  const url = envBaseUrl + servicesList.vendorVms + `/primary/details/fetch?mpVendorId=${orgId}`;
  return gettRequest(url, METHOD.GET);
};

export const addNewRetailContact = (payload) => {
  const url = envBaseUrl + servicesList.retailService + `/retail/v1/contact/add`;
  return postRequest(url, payload);
};

export const getAllRetailContact = (orgId) => {
  const url = envBaseUrl + servicesList.retailService + `/retail/v1/contacts?retailId=${orgId}`;
  return gettRequest(url, METHOD.GET);
};

export const deleteRetailContact = (payload) => {
  const url = envBaseUrl + servicesList.retailService + `/retail/v1/contact/delete`;
  return postRequest(url, payload);
};

export const getAllRetailAddress = (orgId) => {
  const url = envBaseUrl + servicesList.retailService + `/retail/v1/address/all?retailId=${orgId}`;
  return gettRequest(url, METHOD.GET);
};

export const deleteRetailAddress = (payload) => {
  const url = envBaseUrl + servicesList.retailService + `/retail/v1/address/delete`;
  return postRequest(url, payload);
};

export const cancelMarketplaceOrder = (orderId, uidx) => {
  const url = envBaseUrl + servicesList.saleService + `/orders/cancel/order/marketPlace/${orderId}?user-id=${uidx}`;
  return postRequest(url);
};
export const marketplaceInvoice = (orderId) => {
  const url = envBaseUrl + servicesList.saleService + `/orders/invoice/${orderId}/download`;
  return gettRequest(url);
};

export const getSessionReports = (sessionId) => {
  const url = envBaseUrl + servicesList.saleService + `/reports/report/${sessionId}`;
  return gettRequest(url);
};
export const getDailyStockReports = (orgId, locId, exportedBy) => {
  const url =
    envBaseUrl +
    servicesList.inventoryService +
    `/api/v1/inventory/reports/stocks/daily?orgId=${orgId}&locId=${locId}&exportBy=${exportedBy}`;
  return gettRequest(url);
};
export const getStockByCategory = (orgId, locId) => {
  const url =
    envBaseUrl + servicesList.inventoryService + `/api/v1/inventory/categories/stocks?orgId=${orgId}&locId=${locId}`;
  return gettRequest(url);
};
export const getStockByBrand = (orgId, locId) => {
  const url =
    envBaseUrl + servicesList.inventoryService + `/api/v1/inventory/brands/stocks?orgId=${orgId}&locId=${locId}`;
  return gettRequest(url);
};

export const salesInvoice = (payload) => {
  const url = envBaseUrl + servicesList.saleService + `/orders/invoice/v1/invoice-filter`;
  return postRequest(url, payload);
};
export const salesPymentRecieved = (payload) => {
  const url = envBaseUrl + servicesList.saleService + `/payments/v1/payments-filter`;
  return postRequest(url, payload);
};

export const searchSalesPayment = (payload) => {
  const url = envBaseUrl + servicesList.saleService + `/payments/v3/payments-filter`;
  return postRequest(url, payload);
};

export const searchSalesReturns = (payload) => {
  const url = envBaseUrl + servicesList.saleService + `/returns/v2/return-filter`;
  return postRequest(url, payload);
};

export const addToSalesCartwithSellingPrice = (cartId, gtinNo, locId, sellingPrice) => {
  const url =
    envBaseUrl +
    servicesList.cartService +
    `/product/add/gtin/${cartId}/${gtinNo}?locationId=${locId}&inventoryCheck=NO&sellingPrice=${sellingPrice}`;
  return postRequest(url);
};

export const addProductToCart = (payload) => {
  const url = envBaseUrl + servicesList.cartService + `/v2/sales-order/product/add`;
  return postRequest(url, payload);
};

export const getTotalPuchase = (payload) => {
  const url = envBaseUrl + servicesList.purchaseOrder + '/api/v1/purchase/order/dashboard';
  return postRequest(url, payload);
};

export const getTotalSales = (payload) => {
  const url = envBaseUrl + servicesList.saleService + '/orders/salesReport';
  return postRequest(url, payload);
};

export const getPopularProducts = (orgId, locId) => {
  let url = envBaseUrl + servicesList.saleService + `/popularProducts/sales?org-id=${orgId}`;
  if (locId) {
    url += `&loc-id=${locId}`;
  }

  return gettRequest(url);
};

export const getTotalVendors = (month, year, orgId) => {
  const url = envBaseUrl + servicesList.vendorVms + `/vendors/months?month=${month}&year=${year}&orgId=${orgId}`;
  return gettRequest(url);
};

export const updateProfilePicture = (payload) => {
  const url = envBaseUrl + servicesList.userService + `/user/profile/picture`;
  return postFileRequest(url, payload);
};

export const getTotalLocationCustomer = (payload) => {
  const url = envBaseUrl + servicesList.retailService + `/retail/v1/customer/location`;
  return postRequest(url, payload);
};

export const productsSalesTrend = (payload) => {
  const url = envBaseUrl + servicesList.saleService + `/orders/monthWise/salesReport`;
  return postRequest(url, payload);
};
export const orderItemTrend = (orgId, locId, gtin, days) => {
  const url = envBaseUrl + servicesList.saleService + `/v1/order/item/trend/${orgId}/${locId}/${gtin}/${days}`;
  return gettRequest(url);
};

export const productWiseTrend = (payload) => {
  const url = envBaseUrl + servicesList.saleService + `/v1/order/item/trend`;
  return postRequest(url, payload);
};
export const avgStockRatio = (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + `/api/inventory/v1/stocks-ratio`;
  return postRequest(url, payload);
};

export const salesOverview = (payload) => {
  const url = envBaseUrl + servicesList.saleService + `/orders/dayWise/salesReport`;
  return postRequest(url, payload);
};
export const purchaseReports = (payload) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/v1/purchase/order/get/report`;
  return postRequest(url, payload);
};
export const salesReports = (payload) => {
  const url = envBaseUrl + servicesList.saleService + `/orders/salesReport`;
  return postRequest(url, payload);
};

export const purchaseReportsChart = (payload) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/v1/purchase/order/report/chart`;
  return postRequest(url, payload);
};

export const PurchaseLineChart = (payload) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/purchase-order-list`;
  return postRequest(url, payload);
};

export const salesReportsChart = (payload) => {
  const url = envBaseUrl + servicesList.saleService + `/orders/monthWise/salesReport`;
  return postRequest(url, payload);
};

export const salesFilterApi = (payload) => {
  const url = envBaseUrl + servicesList.saleService + `/orders/v3/order-filter`;
  return postRequest(url, payload);
};

export const inventoryReportsChart = (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + `/api/inventory/v1/sales-inventory/report`;
  return postRequest(url, payload);
};
export const exportBigQueryReports = (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + `/api/inventory/v1/reports/bigquery`;
  return postRequest(url, payload);
};
export const exportSlowMovingRepot = (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + `/api/v1/inventory/slowMoving/report/export`;
  return postDownloadPdfRequest(url, payload);
};

export const inventoryPriceConditions = (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + `/api/v1/inventory/price/conditions`;
  return postRequest(url, payload);
};
export const exportpriceConditions = (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + `/api/v1/inventory/export/invalid/price/conditions`;
  return postDownloadPdfRequest(url, payload);
};

export const inventoryExport = async (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + `/api/inventory/v1/sales-inventory/export`;
  return await postDownloadPdfRequest(url, payload);
};

export const resetUserPin = (payload) => {
  const url = envBaseUrl + servicesList.userService + `/user/reset/pin`;
  return postOrgRequest(url, payload, true);
};

export const updateUserPin = (payload) => {
  const url = envBaseUrl + servicesList.userService + `/user/update/pin`;
  return postOrgRequest(url, payload, true);
};

export const paymentChannel = (payload) => {
  const url = envBaseUrl + servicesList.saleService + `/orders/payment-method/stats`;
  return postRequest(url, payload);
};

export const getProductProfit = (payload) => {
  const url = envBaseUrl + servicesList.saleService + `/orders/product-profit/report`;
  return postRequest(url, payload);
};
export const avgStockTurnover = (locId, gtin) => {
  const url =
    envBaseUrl +
    servicesList.inventoryService +
    `/api/inventory/v1/avg-stock-ratio/get?location_id=${locId}&gtin=${gtin}`;
  return gettRequest(url);
};

export const inventoryCount = (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + `/api/inventory/v1/count/get`;
  return postRequest(url, payload);
};

export const inventoryCostCount = (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + `/api/inventory/v1/cost/get`;
  return postRequest(url, payload);
};

export const markUpAffectingCount = (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + `/api/master-price-label/v1/mark-up/affecting-count`;
  return postRequest(url, payload);
};

export const markUpListAffectingCount = (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + `/api/master-price-label/v1/mark-up/list/affecting-count`;
  return postRequest(url, payload);
};

export const markUDownAffectingCount = (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + `/api/master-price-label/v1/mark-down/affecting-count`;
  return postRequest(url, payload);
};

export const markUDownListAffectingCount = (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + `/api/master-price-label/v1/mark-down/list/affecting-count`;
  return postRequest(url, payload);
};

export const createMarkUpPriceEdit = (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + `/api/master-price-label/v1/mark-up/list/create`;
  return postRequest(url, payload);
};
export const createMarkDownPriceEdit = (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + `/api/master-price-label/v1/mark-down/list/create`;
  return postRequest(url, payload);
};

export const createCustomPriceEdit = (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + `/api/master-price-label/v1/custom/create`;
  return postRequest(url, payload);
};
export const CustomAffectingCount = (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + `/api/master-price-label/v1/list/affecting-count`;
  return postRequest(url, payload);
};

export const getMarkDownAffectingCount = (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + `/api/master-price-label/v1/get/affectedCount`;
  return postRequest(url, payload);
};

export const customInventoryData = (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + `/api/inventory/v1/filter/modifiedOn`;
  return postRequest(url, payload);
};

export const getTotalTransactionsPalletPay = (payload) => {
  const url = envBaseUrl + servicesList.paymentService + `/ezetap/transactions/filter`;
  return postRequest(url, payload);
};

export const getSettlementDataForOrgPerDay = (payload) => {
  const url = envBaseUrl + servicesList.paymentService + `/settlement/organization/day`;
  return postRequest(url, payload);
};

export const getSettlementDetailsForOrgForDay = (payload) => {
  const url = envBaseUrl + servicesList.paymentService + `/settlement/organization/day/transaction`;
  return postRequest(url, payload);
};

export const getSettlementDetailsForId = (id) => {
  const url = envBaseUrl + servicesList.paymentService + `/settlement/organization/transaction/details/${id}`;
  return gettRequest(url);
};

export const getOverviewDataForPalletPay = (payload) => {
  const url = envBaseUrl + servicesList.paymentService + `/dashboard/get/details`;
  return postRequest(url, payload);
};

export const getTransactionDetailsWithTransactionId = (transactionId) => {
  const url = envBaseUrl + servicesList.paymentService + `/ezetap/transaction/${transactionId}`;
  return gettRequest(url);
};

export const getMdrRates = (orgId) => {
  const url = envBaseUrl + servicesList.businessService + `/api/mdr/v2/details?orgId=${orgId}`;
  return gettRequest(url);
};

export const mdrUpdates = (payload) => {
  const url = envBaseUrl + servicesList.businessService + `/api/mdr/merchant/rate/update`;
  return postRequest(url, payload);
};

export const getMachnineDetailsForTotalTransactions = (payload) => {
  const url = envBaseUrl + servicesList.businessService + `/api/machine/name/device/details`;
  return postRequest(url, payload);
};

export const filterAddonsApi = (payload) => {
  const url = envBaseUrl + servicesList.businessService + `/api/addon/details/filters?billingCycle=${payload}`;
  return postRequest(url, payload);
};
export const fetchAllMonthlyAndAnuallySubscriptionsAndFeatures = () => {
  const url = envBaseUrl + servicesList.businessService + `/api/subscription/feature/details`;
  return postRequest(url);
};

export const createSubscriptionForPricingPlans = (payload) => {
  const url = envBaseUrl + servicesList.businessService + `/api/account/subscription/mapping/create`;
  return postRequest(url, payload);
};

export const activateSubscriptionForPricingPlans = (payload) => {
  const url = envBaseUrl + servicesList.businessService + `/api/v2/account/subscription/activate/razor/pay/id`;
  return postRequest(url, payload);
};

export const subscriptionPlanDetailsForPricingPlans = (payload) => {
  const url = envBaseUrl + servicesList.businessService + `/api/v2/account/subscription/mapping/details/account/id`;
  return postRequest(url, payload);
};

export const getSubscriptionIdDetails = (payload) => {
  const url = envBaseUrl + servicesList.businessService + `/api/account/subscription/mapping/details/account/id`;
  return postRequest(url, payload);
};

export const getSubscriptionDetails = (payload) => {
  const url = envBaseUrl + servicesList.businessService + `/api/subscription/details`;
  return postRequest(url, payload);
};

export const subscriptionDetailsForOrg = (orgId) => {
  const url =
    envBaseUrl + servicesList.businessService + `/api/account/subscription/mapping/details/org/id?orgId=${orgId}`;
  return gettRequest(url);
};

export const cancelSubscriptionForPricingPlans = (payload) => {
  const url = envBaseUrl + servicesList.businessService + `/api/account/subscription/mapping/cancel`;
  return postRequest(url, payload);
};

export const getFeatureUsageDetails = (payload) => {
  const url = envBaseUrl + servicesList.businessService + `/api/feature/org/details`;
  return postRequest(url, payload);
};

export const createUpgradeSubscriptionPlan = (payload) => {
  const url = envBaseUrl + servicesList.businessService + `/api/v2/account/subscription/mapping/upgrade`;
  return postRequest(url, payload);
};

export const getFeatureSettings = (orgId) => {
  const url = envBaseUrl + servicesList.businessService + `/api/feature/org/settings`;
  return postRequest(url, orgId);
};

export const getFetaureSubscriptionAndAccountMappingDetails = (payload) => {
  const url = envBaseUrl + servicesList.businessService + `/api/account/subscription/mapping/details/account/id`;
  return postRequest(url, payload);
};

export const fetchPosAndMPosPriceDetailsForSubscription = (payload) => {
  const url = envBaseUrl + servicesList.businessService + `/api/account/addon/process/price/tax`;
  return patchRequest(url, payload);
};

export const installedAddons = (payload) => {
  const url = envBaseUrl + servicesList.businessService + `/api/addon/account/details/`;
  return postRequest(url, payload);
};

export const createAddon = (payload) => {
  const url = envBaseUrl + servicesList.businessService + `/api/account/addon/mapping/create`;
  return postRequest(url, payload);
};

export const activateAddons = (payload) => {
  const url = envBaseUrl + servicesList.businessService + `/api/account/addon/mapping/activate`;
  return postRequest(url, payload);
};

export const resumeSubscriptionForPricingPlans = (subscriptionId) => {
  const url = envBaseUrl + servicesList.paymentService + `/subscription/v1/cancel?subscriptionId=${subscriptionId}`;
  return postRequest(url);
};

export const contactSalesSupport = (payload) => {
  const url = envBaseUrl + servicesList.retailService + `/support/v1/create`;
  return postRequest(url, payload);
};
export const getlocationNameByLocId = (payload) => {
  const url = envBaseUrl + servicesList.retailService + `/branch/v1/get/all`;
  return postRequest(url, payload);
};
export const createTotHo = (payload) => {
  const url = envBaseUrl + servicesList.retailService + `/tot/v3/create`;
  return postRequest(url, payload);
};
export const updateTotDocument = (payload) => {
  const url = envBaseUrl + servicesList.retailService + `/tot/v1/document/update`;
  return postFileRequest(url, payload);
};
export const updateVendorTot = (payload) => {
  const url = envBaseUrl + servicesList.retailService + `/tot/v1/bulk/update`;
  return patchRequest(url, payload);
};
export const fetchVendorTot = (accountId, vendorId) => {
  const url = envBaseUrl + servicesList.retailService + `/tot/v1/filter?accountId=${accountId}&vendorId=${vendorId}`;
  return postRequest(url);
};
export const viewTotDocuments = (vendorId) => {
  const url = envBaseUrl + servicesList.retailService + `/tot/v1/document?id=${vendorId}&type=VENDOR`;
  return gettRequest(url);
};
export const createTotDocument = (payload) => {
  const url = envBaseUrl + servicesList.retailService + `/tot/v1/document/create`;
  return postFileRequest(url, payload);
};

export const deleteTotFile = (code) => {
  const url = envBaseUrl + servicesList.retailService + `/tot/v1/document/delete?code=${code}`;
  return postRequest(url);
};

export const markdownApplyLater = (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + `/api/master-price-label/v1/mark-down/list/save`;
  return postRequest(url, payload);
};

export const customProductFilter = (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + `/api/master-price-label/v1/price-edit/filter`;
  return postRequest(url, payload);
};
export const fetchGeneratedInventoryReports = (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + `/api/v2/inventory/fetch/reports`;
  return postRequest(url, payload);
};

export const markupApplyLater = (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + `/api/master-price-label/v1/mark-up/list/save`;
  return postRequest(url, payload);
};
export const getMasterPriceDetails = (locId, marginType, page = 1) => {
  const url =
    envBaseUrl +
    servicesList.inventoryService +
    `/api/master-price-label/v1/label/get?pageNumber=${page}&pageSize=10&locationId=${locId}&labelType=${marginType}`;
  return gettRequest(url);
};
export const deleteMarginpriceEditLabel = (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + `/api/master-price-label/v1/label/delete?mplId=${payload}`;
  return deleteRequest(url, payload);
};
export const apps_integerationData = () => {
  const url = envBaseUrl + servicesList.businessService + `/api/addons/details`;
  return postRequest(url);
};

export const AppsInstall = (payload) => {
  const url = envBaseUrl + servicesList.businessService + `/api/account/addon/mapping/create`;
  return postRequest(url, payload);
};

export const AccountController = (payload) => {
  const url = envBaseUrl + servicesList.businessService + `/api/account/create`;
  return postRequest(url, payload);
};

export const fetchAccoutidbyOrg = (payload) => {
  const url = envBaseUrl + servicesList.businessService + `/api/mapping/details/org/id`;
  return postRequest(url, payload);
};

export const AppsAccountIdcreation = (payload) => {
  const url = envBaseUrl + servicesList.businessService + `/api/mapping/details/org/id`;
  return postRequest(url, payload);
};

export const fetchInstalledApps = (payload) => {
  const url = envBaseUrl + servicesList.businessService + `/api/account/addon/mapping/details/account/id`;
  return postRequest(url, payload);
};

export const UninstallApps = (payload) => {
  const url = envBaseUrl + servicesList.businessService + `/api/account/addon/mapping/delete`;
  return postRequest(url, payload);
};

export const VendorInputFields = (payload) => {
  const url = envBaseUrl + servicesList.businessService + `/api/vendor/configuration/details/vendor/type`;
  return postRequest(url, payload);
};

export const VendorDetailsSave = (payload) => {
  const url = envBaseUrl + servicesList.businessService + `/api/payment/vendor/configuration/create`;
  return postRequest(url, payload);
};

export const paymentVendorConfigId = (payload) => {
  const url =
    envBaseUrl +
    servicesList.businessService +
    `/api/payment/vendor/configuration/details/organisation/location/vendor`;
  return postRequest(url, payload);
};
export const addPaymentMachine = (payload) => {
  const url = envBaseUrl + servicesList.businessService + `/api/machine/create`;
  return postRequest(url, payload);
};

export const UnlinkPaymentMachine = (payload) => {
  const url = envBaseUrl + servicesList.businessService + `//api/license/machine/delete/machine/id`;
  return postRequest(url, payload);
};

export const ActivatePaymentMachine = (payload) => {
  const url = envBaseUrl + servicesList.businessService + `/api/license/machine/create`;
  return postRequest(url, payload);
};
export const DeletePaymentMachine = (payload) => {
  const url = envBaseUrl + servicesList.businessService + `/api/machine/delete`;
  return postRequest(url, payload);
};

export const allPaymentMachines = async (payload) => {
  const url = envBaseUrl + servicesList.businessService + `/api/v2/machine/details/organisation/location`;
  return await postRequest(url, payload);
};

export const machineDetailsApi = async (payload) => {
  const url = envBaseUrl + servicesList.businessService + `/api/machine/details`;
  return await postRequest(url, payload);
};

export const updateMachineDetails = async (payload) => {
  const url = envBaseUrl + servicesList.businessService + `/api/machine/update`;
  return await postRequest(url, payload);
};

export const getLicenseDetails = (payload) => {
  const url = envBaseUrl + servicesList.businessService + `/api/license/machine/details/organisation/location`;
  return postRequest(url, payload);
};
export const getTotalOrganizationCustomer = (orgId) => {
  const url = envBaseUrl + servicesList.retailService + `/retail/v1/customer/get?retailId=${orgId}`;
  return gettRequest(url);
};

export const getAllPosTerminals = (payload) => {
  const url = envBaseUrl + servicesList.businessService + `/api/license/details/org/loc/feature`;
  return postRequest(url, payload);
};

export const getLicenseDetailsById = (payload) => {
  const url = envBaseUrl + servicesList.businessService + `/api/license/details`;
  return postRequest(url, payload);
};

export const updateCouterLisenceStatus = (payload) => {
  const url = envBaseUrl + servicesList.businessService + `/api/license/status/update`;
  return patchRequest(url, payload);
};

export const updateCounterDetails = (payload) => {
  const url = envBaseUrl + servicesList.businessService + `/api/license/update`;
  return patchRequest(url, payload);
};

export const createNewCounterLicense = (payload) => {
  const url = envBaseUrl + servicesList.businessService + `/api/licenses/create`;
  return postRequest(url, payload);
};

export const regenerateActivation = (payload) => {
  const url = envBaseUrl + servicesList.businessService + `/api/license/activation-code/regenerate`;
  return postRequest(url, payload);
};

export const updateLicense = (payload) => {
  const url = envBaseUrl + servicesList.businessService + `/api/license/update`;
  return patchRequest(url, payload);
};

export const StartDay = (payload) => {
  const url = envBaseUrl + servicesList.posService + '/day/v1/start';
  return postRequest(url, payload);
};

export const paymentMethodsData = (payload) => {
  const url = envBaseUrl + servicesList.saleService + '/reports/getReport';
  return postRequest(url, payload);
};

export const sendSessionReports = (payload) => {
  const url = envBaseUrl + servicesList.saleService + '/reports/send';
  return postRequest(url, payload);
};

export const getProfitDetails = (payload) => {
  const url = envBaseUrl + servicesList.saleService + '/reports/getMarginReport';
  return postRequest(url, payload);
};
export const vendorTradeDetails = (payload) => {
  const url = envBaseUrl + servicesList.saleService + '/orders/vendor/trade';
  return postRequest(url, payload);
};

export const getSessionDetails = (sessionId) => {
  const url = envBaseUrl + servicesList.posService + `/session/v2/get/detail?sessionId=${sessionId}`;
  return gettRequest(url, METHOD.GET);
};

export const getAllSessionTermianls = (orgId, locId) => {
  const url = envBaseUrl + servicesList.posService + `/license/v1/get?organizationId=${orgId}&locationId=${locId}`;
  return gettRequest(url, METHOD.GET);
};

export const getAllSessionServiceDetails = (locId) => {
  const url = envBaseUrl + servicesList.saleService + `/pos/dashboard/v1/${locId}`;
  return gettRequest(url, METHOD.GET);
};

export const dashBoardDetails = (locId, orgId) => {
  const url =
    envBaseUrl +
    servicesList.posService +
    `/session/v1/get/rms/dashboard/details?locationId=${locId}&organizationId=${orgId}`;
  return gettRequest(url, METHOD.GET);
};

export const getSessionDetailsForLocation = (locId) => {
  const url = envBaseUrl + servicesList.saleService + `/pos/dashboard/v1/${locId}`;
  return gettRequest(url, METHOD.GET);
};

export const getSessionDetailsForTerminal = (locId, licenseId) => {
  const url = envBaseUrl + servicesList.saleService + `/pos/dashboard/v1/terminal/${locId}/${licenseId}`;
  return gettRequest(url, METHOD.GET);
};

export const getSessionDetailsForSession = (locId, licenseId, sessionId) => {
  const url = envBaseUrl + servicesList.saleService + `/pos/dashboard/v1/session/${locId}/${licenseId}/${sessionId}`;
  return gettRequest(url, METHOD.GET);
};

export const getStoreActivity = (locId, orgId, sessionId, MPos) => {
  const url =
    envBaseUrl +
    servicesList.posService +
    `/session/v3/get/rms/dashboard/activity?locationId=${locId}&organizationId=${orgId}&daySessionId=${sessionId}&mPos=${MPos}`;
  return gettRequest(url, METHOD.GET);
};

export const getLicenseActivity = (locId, orgId, licenseId, sessionId) => {
  const url =
    envBaseUrl +
    servicesList.posService +
    `/session/v3/get/rms/license/activity?locationId=${locId}&organizationId=${orgId}&licenseId=${licenseId}&daySessionId=${sessionId}`;
  return gettRequest(url, METHOD.GET);
};

export const getLocationActivity = (locId, orgId, sessionId) => {
  const url =
    envBaseUrl +
    servicesList.posService +
    `/session/v2/get/rms/location/report?locationId=${locId}&organizationId=${orgId}&daySessionId=${sessionId}`;
  return gettRequest(url, METHOD.GET);
};

export const closeSession = (payload) => {
  const url = envBaseUrl + servicesList.posService + `/session/v2/close`;
  return postRequest(url, payload);
};

export const closeDay = (payload) => {
  const url = envBaseUrl + servicesList.posService + '/day/v2/stop';
  return postRequest(url, payload);
};

export const getSessionId = (payload) => {
  const url = envBaseUrl + servicesList.posService + '/session/v2/get/v1/filter/session';
  return postRequest(url, payload);
};

export const cashierDetails = (payload) => {
  const url = envBaseUrl + servicesList.posService + '/session/v2/get/v1/filter/cashier';
  return postRequest(url, payload);
};
// export const verifyBatch = (locId, gtin, batchNo)=>{
//   const url = envBaseUrl + servicesList.inventoryService + `/api/inventory/v1/batch/get?locationId=${locId}&gtin=${gtin}&batchNo=${batchNo}`;
//   return gettRequest(url,METHOD.GET);
// }
export const activeSessionDay = (locId) => {
  const url = envBaseUrl + servicesList.posService + `/day/v2/get/active?locationId=${locId}`;
  return gettRequest(url, METHOD.GET);
};

export const verifyBatch = (locId, gtin, batchNo) => {
  const url =
    envBaseUrl + servicesList.inwardService + `/items/v1/verify?locationId=${locId}&gtin=${gtin}&batchNo=${batchNo}`;
  return gettRequest(url, METHOD.GET);
};

// export const getLoyalityManufaturer = () => {
//   const url = envBaseUrl + servicesList.productService + `/manufactures`;
//   return gettRequest(url, METHOD.GET);
// };

export const getLoyaltyCategories = () => {
  const url = envBaseUrl + servicesList.productService + `/category/main`;
  return gettRequest(url, METHOD.GET);
};

export const getLoyaltyManufacturers = (page, pageSize) => {
  const url = envBaseUrl + servicesList.productService + `/manufactures?page=${page}&pageSize=${pageSize}`;
  return gettRequest(url, METHOD.GET);
};

export const searchLoyaltyManufacturer = (searchValue, page, pageSize) => {
  const url =
    envBaseUrl + servicesList.productService + `/manufacture/search/${searchValue}?page=${page}&pageSize=${pageSize}`;
  return gettRequest(url, METHOD.GET);
};

export const getLoyaltyDetails = (orgID) => {
  const url = envBaseUrl + servicesList.loyaltyService + `/api/configurations/v1/fetch?sourceOrgId=${orgID}`;
  return gettRequest(url, METHOD.GET);
};

export const getTotalLoyaltyUsage = (orgId) => {
  const url =
    envBaseUrl + servicesList.loyaltyService + `/api/configurations/v1/expenditure/details?sourceOrgId=${orgId}`;
  return gettRequest(url, METHOD.GET);
};

export const getRecentLoyaltyTransactions = (payload) => {
  const url = envBaseUrl + servicesList.loyaltyService + `/generic/all/transactions`;
  return postRequest(url, payload);
};
export const fetchExpressPurchaseList = (payload) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/v1/express/purchase/order/list`;
  return postRequest(url, payload);
};

export const createExpressPurchase = (payload) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/v1/express/purchase/order/create`;
  return postRequest(url, payload);
};

export const createV2ExpressPurchase = (payload) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/v2/express/purchase/order/create`;
  return postRequest(url, payload);
};
export const startExpressPurchaseEvent = (payload) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/v2/express/purchase/order/start/event`;
  return postRequest(url, payload);
};

export const addItemExpressPurchase = (payload) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/v1/express/purchase/order/item/add`;
  return postRequest(url, payload);
};

export const deleteItemExpressPurchase = (payload) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/v1/express/purchase/order/item/remove`;
  return postRequest(url, payload);
};
export const deleteExpressPurchase = (payload) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/v1/express/purchase/order/delete`;
  return postRequest(url, payload);
};

export const updateItemExpressPurchase = (payload) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/v1/express/purchase/order/item/update`;
  return postRequest(url, payload);
};

export const itemDetailsExpressPurchase = (epoNum) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/v1/express/purchase/order/details/${epoNum}`;
  return gettRequest(url, METHOD.GET);
};

export const timelineExpressPurchase = (epoNum) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/v1/express/purchase/order/timeline/${epoNum}`;
  return gettRequest(url, METHOD.GET);
};

export const statusTimelineExpressPurchaseEvent = (epoNumber) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/v1/express/purchase/order/event/status/${epoNumber}`;
  return gettRequest(url, METHOD.GET);
};

export const approveExpressPurchaseEvent = (payload) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/v1/express/purchase/order/status`;
  return postRequest(url, payload);
};

export const spBasedONProductConfig = (locId, gtin, purchasePrice, mrp) => {
  const url =
    envBaseUrl +
    servicesList.inventoryService +
    `/api/inventory/v1/calculate/sellingPrice?locationId=${locId}&gtin=${gtin}&purchasePrice=${purchasePrice}&mrp=${mrp}`;
  return gettRequest(url, METHOD.GET);
};

export const spMarginValueConfig = (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + `/api/inventory/v1/sellingPrice/get`;
  return postRequest(url, payload);
};

export const getLatestPurchaseOrder = (retId, rlcId) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/v1/purchase/order/latest/${retId}/${rlcId}`;
  return gettRequest(url, METHOD.GET);
};

export const userTimeline = (payload) => {
  const url = envBaseUrl + servicesList.userService + `/users/login/timeline`;
  return postRequest(url, payload);
};

export const getLocDetailByLongAndLat = (latitude, longitude) => {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;
  return gettRequest(url, METHOD.GET);
};

export const getLookerStudioReport = () => {
  const url = `https://lookerstudio.google.com/reporting/create?7a24b3b4-64da-435b-af30-241ccd9d9a53&ds.ds0.connector=googleCloudStorage&ds.ds0.pathType=FILE&ds.ds0.path=twinleaves_dev_public/o/fileName.csv`;
  return gettRequest(url, METHOD.GET);
};

export const getBatchIdOfferDetails = (offerId) => {
  const url = envBaseUrl + servicesList.inventoryService + `/api/inventory/v1/offers/get?offerId=${offerId}`;
  return gettRequest(url, METHOD.GET);
};

export const slotsBookingUpdate = (payload) => {
  const url = envBaseUrl + servicesList.serviceability + `/slot/multiple/create`;
  return postRequest(url, payload);
};

export const getInventoryListMobile = (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + `/api/v1/inventory/data/get`;
  return postRequest(url, payload);
};

export const getInventoryListInitial = (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + `/api/v2/inventory/data/get`;
  return postRequest(url, payload);
};

export const createServiceSlotsByRegion = (payload) => {
  const url = envBaseUrl + servicesList.serviceability + `/region/create`;
  return postRequest(url, payload);
};

export const getServiceDataList = (payload) => {
  const url = envBaseUrl + servicesList.serviceability + `/region/filter?page=1&pageSize=100`;
  return postRequest(url, payload);
};

export const getServiceDataListDetails = (regionId) => {
  const url = envBaseUrl + servicesList.serviceability + `/region/get/${regionId}`;
  return postRequest(url);
};
// get storage name of inventory top level
export const getTopLevelStorageDataLists = (orgId, locId) => {
  const url =
    envBaseUrl + servicesList.layoutService + `/api/sub-entities/v1/hierarchy/topMost?orgId=${orgId}&locId=${locId}`;
  return gettRequest(url, METHOD.GET);
};

// get storage name of inventory next level
export const getStorageDataListNextLevel = (storageId) => {
  const url =
    envBaseUrl + servicesList.layoutService + `/api/sub-entities/v1/hierarchy/nextLevel?parentId=${storageId}`;
  return gettRequest(url, METHOD.GET);
};

// get all childrens storage name lists of inventory
export const getSubStorageDataLists = (storageId) => {
  const url = envBaseUrl + servicesList.layoutService + `/api/sub-entities/v1/children/details?mapId=${storageId}`;
  return gettRequest(url, METHOD.GET);
};

// get storage hierarchy
export const getStorageHierarchy = (barcodeId) => {
  const url = envBaseUrl + servicesList.layoutService + `/api/sub-entities/v1/barcodes/decode/${barcodeId}`;
  return gettRequest(url, METHOD.GET);
};

export const salesPaymentRequest = (payload) => {
  const url = envBaseUrl + servicesList.saleService + `/payments/v1/record`;
  return postRequest(url, payload);
};

export const salesOrderWithPayment = (payload) => {
  const url = envBaseUrl + servicesList.cartService + `/v2/sales-order/create/order`;
  return postRequest(url, payload);
};
export const createStockTransfer = (payload) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/v1/stock/transfer/create`;
  return postRequest(url, payload);
};
export const detailsStockTransfer = (stn) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/v1/stock/transfer/details/${stn}`;
  return gettRequest(url, METHOD.GET);
};
export const allStockTransfer = (payload) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/v1/stock/transfer/list`;
  return postRequest(url, payload);
};
export const changeStatusSTN = (payload) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/v1/stock/transfer/status`;
  return postRequest(url, payload);
};
export const stnTimeline = (stn) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/v1/stock/transfer/timeline/${stn}`;
  return gettRequest(url, METHOD.GET);
};
export const fetchLoyality = (payload) => {
  const url = envBaseUrl + servicesList.loyaltyService + `/api/loyaltyPoints/v3/redeemable/details`;
  return postRequest(url, payload);
};
export const applyCoupon = (payload) => {
  const url = envBaseUrl + servicesList.cartService + `/coupon/apply?inventoryCheck=NO`;
  return postRequest(url, payload);
};
export const removeCoupon = (cartId) => {
  const url = envBaseUrl + servicesList.cartService + `/coupon/remove/${cartId}?inventoryCheck=NO`;
  return postRequest(url);
};
export const redeemLoyality = (cartId, payload) => {
  const url = envBaseUrl + servicesList.cartService + `/loyalty/redeem/${cartId}?inventoryCheck=NO`;
  return postRequest(url, payload);
};
export const removeLoyality = (cartId) => {
  const url = envBaseUrl + servicesList.cartService + `/loyalty/remove/${cartId}?inventoryCheck=NO`;
  return postRequest(url);
};

export const getSlotData = (payload) => {
  const url = envBaseUrl + servicesList.serviceability + `/api/filter?page=0&pageSize=56`;
  return postRequest(url, payload);
};

export const couponDashboardDetails = (payload) => {
  const url = envBaseUrl + servicesList.saleService + `/main/dashboard/coupons/data`;
  return postRequest(url, payload);
};

export const previewSalesOrder = (payload) => {
  const url = envBaseUrl + servicesList.saleService + `/reports/preview/invoicePdf`;
  return postpdfRequest(url, payload);
};

export const editSalesOrder = (payload) => {
  const url = envBaseUrl + servicesList.cartService + `/v2/b2c/validated/place/order`;
  return postRequest(url, payload);
};

export const registerDeliveryAgent = (payload) => {
  const url = envBaseUrl + servicesList.logisticsService + `/api/agents/v1/register`;
  return postFileRequest(url, payload);
};

export const getAllDeliveryAgent = (orgId, locId) => {
  const url =
    envBaseUrl + servicesList.logisticsService + `/api/agents/v1/active/all/get?orgId=${orgId}&locId=${locId}`;
  return gettRequest(url, METHOD.GET);
};

export const getDetailsDeliveryAgent = (agentId) => {
  const url = envBaseUrl + servicesList.logisticsService + `/api/agents/v1/details/get?agentId=${agentId}`;
  return gettRequest(url, METHOD.GET);
};

export const addGlobalProduct = (payload) => {
  const url = envBaseUrl + servicesList.productService + `/product/add/store`;
  return postRequest(url, payload);
};
export const addGlobalProductV2 = (payload) => {
  const url = envBaseUrl + servicesList.productService + `/product/v2/transfer`;
  return postRequest(url, payload);
};

export const updateDeliveryAgent = (payload) => {
  const url = envBaseUrl + servicesList.logisticsService + `/api/agents/v1/details/update`;
  return postFileRequest(url, payload);
};

export const editServiceData = (payload) => {
  const url = envBaseUrl + servicesList.serviceability + `/region/edit`;
  return postRequest(url, payload);
};
export const userDetailsByMobile = (payload) => {
  const url = envBaseUrl + servicesList.userService + `/user/mobile`;
  return postRequest(url, payload);
};

export const fetchHeadOfficeHierarchy = (payload) => {
  const url = envBaseUrl + servicesList.businessService + `/api/mapping/details/account/organisation/location/id`;
  return postRequest(url, payload);
};

export const createOfferAndPromo = (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + `/api/inventory/v1/offers/save`;
  return postRequest(url, payload);
};
export const listAllOfferAndPromo = (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + `/api/inventory/v1/offers/filters/offer-page`;
  return postRequest(url, payload);
};
export const detailsAllOfferAndPromo = (offerId) => {
  const url = envBaseUrl + servicesList.inventoryService + `/api/inventory/v1/offers/get?offerId=${offerId}`;
  return gettRequest(url, METHOD.GET);
};

export const getLoyaltyConfiguration = (payload) => {
  const url = envBaseUrl + servicesList.loyaltyService + `/api/configurations/v1/fetch?sourceOrgId=${payload}`;
  return gettRequest(url, METHOD.GET);
};

export const disableLoyaltyProgram = (payload) => {
  const url = envBaseUrl + servicesList.loyaltyService + `/api/configurations/v3/disable`;
  return patchRequest(url, payload);
};

export const activateLoyaltyProgram = (payload) => {
  const url = envBaseUrl + servicesList.loyaltyService + `/api/configurations/v3/activate`;
  return patchRequest(url, payload);
};

export const editLoyaltyProgram = (payload) => {
  const url = envBaseUrl + servicesList.loyaltyService + `/api/configurations/v3/update`;
  return patchRequest(url, payload);
};

export const deleteLoyaltyProgram = (payload) => {
  const url = envBaseUrl + servicesList.loyaltyService + `/api/configurations/v4/delete`;
  return postRequest(url, payload);
};
export const fetchMonthlyLoyalityRedeem = (payload) => {
  const url = envBaseUrl + servicesList.loyaltyService + `/api/configurations/v2/redemption/details`;
  return postRequest(url, payload);
};

export const authenticateTally = (payload) => {
  const url = `http://localhost:8085/cs/api/v1/tally/authenticate`;
  return postRequest(url, payload);
};

export const fetchTallyConfig = (orgId, locId) => {
  const url = envBaseUrl + servicesList.thirdPartyService + `/api/v1/tally/config/details/${orgId}/${locId}`;
  return gettRequest(url, METHOD.GET);
};

export const createTallyConfig = (payload) => {
  const url = envBaseUrl + servicesList.thirdPartyService + '/api/v1/tally/config/create';
  return postRequest(url, payload);
};

export const updateTallyConfig = (payload) => {
  const url = envBaseUrl + servicesList.tallyService + `/api/v1/tally/config/update`;
  return postRequest(url, payload);
};

export const syncTallyData = (payload) => {
  const url = envBaseUrl + servicesList.thirdPartyService + `/api/v1/tally/sync/data`;
  return postRequest(url, payload);
};

export const createSyncLogData = (payload) => {
  const url = envBaseUrl + servicesList.thirdPartyService + `/api/v1/tally/sync/log/create`;
  return postRequest(url, payload);
};

export const importDataToTally = ({ ipAddress, port, data }) => {
  const url = `http://localhost:8085/cs/api/v1/tally/import/data?ip=${ipAddress}&port=${port}`;
  return postTallyRequest(url, data);
};

export const filterTallyConfiguredData = (payload) => {
  const url = envBaseUrl + servicesList.thirdPartyService + `/api/v1/tally/sync/history/filter`;
  return postRequest(url, payload);
};

export const repackingProduct = (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + `/api/inventory/v1/repacking`;
  return postRequest(url, payload);
};

export const getAllMainCategory = (payload) => {
  const url = envBaseUrl + servicesList.productService + `/category/main/filter`;
  return postRequest(url, payload);
};

export const getAllBulkProducts = (payload) => {
  const url = envBaseUrl + servicesList.productService + `/product/v2/bulk/creation`;
  return postRequest(url, payload);
};

export const getAllLevel1Category = (payload) => {
  const url = envBaseUrl + servicesList.productService + `/category/level1/filter`;
  return postRequest(url, payload);
};

export const getAllLevel1CategoryAndMain = (payload) => {
  const url = envBaseUrl + servicesList.productService + `/category/level1/filterV2`;
  return postRequest(url, payload);
};

export const editLevel1Category = (payload) => {
  const url = envBaseUrl + servicesList.productService + `/category/level1/edit`;
  return postRequest(url, payload);
};

export const editLevel2Category = (payload) => {
  const url = envBaseUrl + servicesList.productService + `/category/level2/edit`;
  return postRequest(url, payload);
};

export const getAllLevel2Category = (payload) => {
  const url = envBaseUrl + servicesList.productService + `/category/level2/filter`;
  return postRequest(url, payload);
};

export const getAllLevel2CategoryAndMain = (payload) => {
  const url = envBaseUrl + servicesList.productService + `/category/level2/filterV2`;
  return postRequest(url, payload);
};

export const getAllrepackingProduct = (locId, orgId, pageNo, pageSize) => {
  const url =
    envBaseUrl +
    servicesList.inventoryService +
    `/api/repacking/v1/get?locationId=${locId}&orgId=${orgId}&pageNumber=${pageNo}&pageSize=${pageSize}`;
  return gettRequest(url, METHOD.GET);
};

export const getAllBrands = (payload) => {
  const url = envBaseUrl + servicesList.productService + `/brand/filter`;
  return postRequest(url, payload);
};

export const createBrands = (payload) => {
  const url = envBaseUrl + servicesList.productService + `/brand/create`;
  return postRequest(url, payload);
};

export const getAllSubBrands = (payload) => {
  const url = envBaseUrl + servicesList.productService + `/brand/sub/filter`;
  return postRequest(url, payload);
};
export const getAllSubBrandsV2 = (payload) => {
  const url = envBaseUrl + servicesList.productService + `/brand/sub/filterV2`;
  return postRequest(url, payload);
};
export const createB2cContent = (payload) => {
  const url = envBaseUrl + servicesList.productService + `/content/create`;
  return postRequest(url, payload);
};
export const editB2cContent = (payload) => {
  const url = envBaseUrl + servicesList.productService + `/content/edit`;
  return postRequest(url, payload);
};
export const filterB2cContent = (payload) => {
  const url = envBaseUrl + servicesList.productService + `/content/filter`;
  return postRequest(url, payload);
};

export const getAllManufacturerV2 = (payload) => {
  const url = envBaseUrl + servicesList.productService + `/brand/manufacturer/filter`;
  return postRequest(url, payload);
};

export const deleteOffer = (offerId) => {
  const url = envBaseUrl + servicesList.inventoryService + `/api/inventory/v1/offer/delete?offerId=${offerId}`;
  return deleteRequest(url, offerId);
};

export const returnSalesOrder = (payload) => {
  const url = envBaseUrl + servicesList.saleService + `/orderItem/return`;
  return postRequest(url, payload);
};

export const getAllSalesReturn = (payload) => {
  const url = envBaseUrl + servicesList.saleService + `/returns/v1/return-filter`;
  return postRequest(url, payload);
};

export const filterCutoff = (payload) => {
  const url = envBaseUrl + servicesList.serviceability + `/api/cutoff/v2/filter`;
  return postRequest(url, payload);
};

export const validateCartProduct = (payload) => {
  const url = envBaseUrl + servicesList.cartService + `/v2/b2c/validate/cart`;
  return postRequest(url, payload);
};

export const validateCartProductWithBatch = (payload) => {
  const url = envBaseUrl + servicesList.cartService + `/v2/b2c/validate/update/cart`;
  return postRequest(url, payload);
};

export const createValidatedOrder = (payload) => {
  const url = envBaseUrl + servicesList.cartService + `/v2/b2c/validated/place/order`;
  return postRequest(url, payload);
};

export const assignPicker = (payload) => {
  const url = envBaseUrl + servicesList.saleService + `/orders/assign/picklist`;
  return postRequest(url, payload);
};

export const createShipment = (payload) => {
  const url = envBaseUrl + servicesList.logisticsService + `/api/shipments/v1/create`;
  return postRequest(url, payload);
};

export const cancelShipment = (payload) => {
  const url = envBaseUrl + servicesList.logisticsService + `/api/shipments/v1/cancel`;
  return postRequest(url, payload);
};

export const createTrip = (payload) => {
  const url = envBaseUrl + servicesList.logisticsService + `/api/trips/v1/create`;
  return postRequest(url, payload);
};

export const updateTrip = (payload) => {
  const url = envBaseUrl + servicesList.logisticsService + `/api/trips/v1/update`;
  return postRequest(url, payload);
};

export const getShipmentFromOrderId = (orderId) => {
  const url = envBaseUrl + servicesList.logisticsService + `/api/shipments/v1/${orderId}`;
  return gettRequest(url, METHOD.GET);
};

export const getTripList = (orgId, locId) => {
  const url =
    envBaseUrl +
    servicesList.logisticsService +
    `/api/agents/v1/tripDetails/overview?sourceOrgId=${orgId}&sourceLocId=${locId}`;
  return gettRequest(url, METHOD.GET);
};

export const getUsersByRole = (payload) => {
  const url = envBaseUrl + servicesList.userService + `/user/location/roles`;
  return postRequest(url, payload);
};

export const addItemThroughScanner = (payload) => {
  const url = envBaseUrl + servicesList.cartService + `/v2/product/add/pos`;
  return postRequest(url, payload);
};

export const decreaseItemThroughScanner = (payload) => {
  const url = envBaseUrl + servicesList.cartService + `/v2/pos/decrease`;
  return postRequest(url, payload);
};

export const increaseItemThroughScanner = (payload) => {
  const url =
    envBaseUrl +
    servicesList.cartService +
    `/product/increase/${payload.cartId}?gtin=${payload.gtin}&inventoryCheck=NO`;
  return postRequest(url, payload);
};

export const deleteItemThroughScanner = (payload) => {
  const url = envBaseUrl + servicesList.cartService + `/v2/pos/remove`;
  return postRequest(url, payload);
};

export const editCart = (payload) => {
  const url = envBaseUrl + servicesList.cartService + `/v2/add/product/qty/pos`;
  return postRequest(url, payload);
};

export const createStockSchedule = (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + `/api/st/v1/scheduler/create`;
  return postRequest(url, payload);
};

export const getAllSchedulers = (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + `/api/st/v1/scheduler/filter`;
  return postRequest(url, payload);
};

export const createReport = (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + `/api/st/v1/report/create`;
  return postRequest(url, payload);
};

export const getAllStockSessions = ({ pageNo, pageSize, orgId, locId, uidx }) => {
  const url =
    envBaseUrl +
    servicesList.inventoryService +
    `/api/st/v1/session/list/get?pageNumber=${pageNo}&pageSize=${pageSize}&sourceOrgId=${orgId}&sourceLocId=${locId}&assignedUidx=${uidx}`;
  return postRequest(url);
};

export const getAllStockSessionsById = ({ pageNo, pageSize, jobId }) => {
  const url =
    envBaseUrl +
    servicesList.inventoryService +
    `/api/st/v1/sessions/get/byJobId?pageNumber=${pageNo}&pageSize=${pageSize}&jobId=${jobId}`;
  return gettRequest(url);
};

export const getAllReports = ({ pageNo, pageSize, reportId, gtin }) => {
  const url =
    envBaseUrl +
    servicesList.inventoryService +
    `/api/st/v1/reports/filter?pageNumber=${pageNo}&pageSize=${pageSize}&reportId=${reportId}&gtin=${gtin}`;
  return postRequest(url);
};

export const getReportId = (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + `/api/st/v1/report/get/reportId`;
  return postRequest(url, payload);
};

export const getReportItem = ({ reportId, gtin }) => {
  const url =
    envBaseUrl + servicesList.inventoryService + `/api/st/v1/report/item/get?report_id=${reportId}&gtin=${gtin}`;
  return gettRequest(url);
};

export const updateReportItem = (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + `/api/st/v1/report/item/update`;
  return postRequest(url, payload);
};

export const changeReportStatus = ({ reportId, state }) => {
  const url =
    envBaseUrl + servicesList.inventoryService + `/api/st/v1/report/state?report-id=${reportId}&state=${state}`;
  return postRequest(url);
};

export const closeStockSession = ({ sessionId }) => {
  const url = envBaseUrl + servicesList.inventoryService + `/api/st/v1/session/close?session-id=${sessionId}`;
  return postRequest(url);
};

export const updateStockInventory = ({ reportId }) => {
  const url = envBaseUrl + servicesList.inventoryService + `/api/st/v1/stock/taking/inventory/update/${reportId}`;
  return postRequest(url);
};

export const getAllJobs = ({ pageNumber, pageSize, sourceOrgId, sourceLocId }) => {
  const url =
    envBaseUrl +
    servicesList.inventoryService +
    `/api/st/v1/jobs/get?pageNumber=${pageNumber}&pageSize=${pageSize}&sourceOrgId=${sourceOrgId}&sourceLocId=${sourceLocId}`;
  return gettRequest(url);
};
export const pinMobVerify = (payload) => {
  const url = envBaseUrl + servicesList.userAuth + '/user/rms/login/pin';
  return loginPostRequest(url, payload);
};

export const pinMobVerifyWithCaptch = (payload) => {
  const url = envBaseUrl + servicesList.userAuth + '/user/rms/login/pinlock/captcha';
  return loginPostRequest(url, payload);
};

export const getDetailsByDocumentAI = (payload ,uidx) => { 
  const url = envBaseUrl + servicesList.purchaseOrder + '/api/v1/documentJob/upload/document/to/documentAI';
  return postFileRequest(url, payload , {uidx});
}

export const documentAISuggestion = (payload)=>{
  const url = envBaseUrl + servicesList.purchaseOrder + '/api/v1/documentJob/document/item/select-suggestions';
  return postRequest(url ,payload)
}

export const getDocumentDetailsByJobID  = (jobId) =>{
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/v1/documentJob/get/document/job/${jobId}`;
  return gettRequest(url, METHOD.GET)
}

export const fetchOrganisations = () => {
  const url = envBaseUrl + servicesList.userService + '/user/orgs/uidx';
  return gettRequest(url, METHOD.GET);
};

//data analysis api for - inventory, sales and sales profit
export const getDataAnalysis = (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + '/api/WPC/v1/get/analysis/data';
  return postRequest(url, payload);
};

export const getDataAnalysisV2 = (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + '/api/WPC/v2/get/analysis/data';
  return postRequest(url, payload);
};

// analysis summary
export const getABCAnalysisSummaryData = (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + `/api/WPC/v1/get/analysis/stockValue`;
  return postRequest(url, payload);
};

export const getMainCatById = (cat1) => {
  const url = envBaseUrl + servicesList.productService + `/category/main/ids?ids=${cat1}`;
  return postRequest(url, cat1);
};

export const getCatLevel1ById = (cat1) => {
  const url = envBaseUrl + servicesList.productService + `/category/level1/ids?ids=${cat1}`;
  return postRequest(url, cat1);
};

export const getCatLevel2ById = (cat1) => {
  const url = envBaseUrl + servicesList.productService + `/category/level2/ids?ids=${cat1}`;
  return postRequest(url, cat1);
};
export const fetchAssortmentMappingProducts = (payload) => {
  const url = envBaseUrl + servicesList.productService + `/product/v2/assortment/mapping/filter`;
  return postRequest(url, payload);
};

export const getAvailableStock = (locId, gtin) => {
  const url =
    envBaseUrl +
    servicesList.inventoryService +
    `/api/inventory/v2/availability/check/get?LocationId=${locId}&GTIN=${gtin}`;
  return gettRequest(url, METHOD.GET);
};

export const getVendorProducts = (payload) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/v2/purchase-order-item-list`;
  return postRequest(url, payload);
};

export const getOperatorEffectiveReportByEventType = (payload) => {
  const url = envBaseUrl + servicesList.posService + '/event/v1/filter';
  return postRequest(url, payload);
};

export const getAllOperatorsByOrgId = (orgId) => {
  const url = envBaseUrl + servicesList.userService + `/user/org/${orgId}`;
  return gettRequest(url, METHOD.GET);
};

export const purchaseRecommendation = (payload) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/v1/express/purchase/item/forecast`;
  return postRequest(url, payload);
};

export const getAllIntrusionsData = (payload) => {
  const url = envBaseUrl + servicesList.posService + '/event/v1/eventTypeCount/filter';
  return postRequest(url, payload);
};

export const getOrderMetricsOperatorEffective = (payload) => {
  const url = envBaseUrl + servicesList.posService + '/metrics/v1/order/metrics';
  return postRequest(url, payload);
};

export const downloadLocationOperatorReport = (payload) => {
  const url = envBaseUrl + servicesList.posService + '/download/v1/location/export';
  return postDownloadPdfRequest(url, payload);
};

export const downloadCashierOperatorReport = (payload) => {
  const url = envBaseUrl + servicesList.posService + '/download/v1/cashier/export';
  return postDownloadPdfRequest(url, payload);
};

// export const inventoryReturnJobFilter = (payload) => {
//   const url = envBaseUrl + servicesList.purchaseOrder + `/api/v1/return/job/filter`;
//   return postRequest(url, payload);
// };

export const inventoryReturnJobFilter = (payload) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/v1/return/job/combined/return/filter`;
  return postRequest(url, payload);
};

export const inventoryReturnFilter = (payload) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/v1/return/filter`;
  return postRequest(url, payload);
};

export const getAllInventoryReturnsJob = (returnJobId) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/v1/return/job/${returnJobId}`;
  return gettRequest(url, METHOD.GET);
};

export const getAllInventoryReturns = (returnId) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/v1/return/${returnId}`;
  return gettRequest(url, METHOD.GET);
};

export const updateInventoryReturnJob = (payload) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/v1/return/job/update`;
  return postRequest(url, payload);
};

export const updateInventoryReturn = (payload) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/v1/return/update`;
  return postRequest(url, payload);
};

export const createInventoryReturn = (payload) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/v1/return/job/create`;
  return postRequest(url, payload);
};

export const removeInventoryReturnItem = (payload) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/v1/return/job/item/remove`;
  return postRequest(url, payload);
};

export const submitInventoryReturn = (payload) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/v1/return/job/submit`;
  return postRequest(url, payload);
};

export const inventoryReturnTimeline = (returnJobId) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/v1/return/timeline/${returnJobId}`;
  return gettRequest(url, METHOD.GET);
};

export const inventoryReturnStateChangeJob = (payload) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/v1/return/job/state`;
  return postRequest(url, payload);
};

export const downloadDebitNotePDF = (returnId) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/debit/note/doc/download/${returnId}`;
  return getPdfRequest(url, METHOD.GET);
};

export const exportBillWiseReport = (payload) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/v1/purchase/order/bill/export/report`;
  return postDownloadPdfRequest(url, payload);
};

export const inventoryReturnStateChange = (payload) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/v1/return/state`;
  return postRequest(url, payload);
};

export const returnsDebitNoteStateChange = (payload) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/v1/debit/note/state`;
  return postRequest(url, payload);
};

export const returnMaterialStatusUpdate = (payload) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/v1/return/material/state`;
  return postRequest(url, payload);
};
export const vendorOverviewDetails = (payload) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/v1/vendor/purchase/order/details`;
  return postRequest(url, payload);
};

export const getReturnsDebitNoteId = (returnId) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/v1/debit/note/return/${returnId}`;
  return gettRequest(url, METHOD.GET);
};

export const debitNoteStatusChange = (payload) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/v2/debit/note/state`;
  return postFileRequest(url, payload);
};

export const downloadManualOperatorReport = (payload) => {
  const url = envBaseUrl + servicesList.posService + '/download/v1/export/manual';
  return postDownloadPdfRequest(url, payload);
};

export const downloadScanOperatorReport = (payload) => {
  const url = envBaseUrl + servicesList.posService + '/download/v1/export/punch/';
  return postDownloadPdfRequest(url, payload);
};

export const downloadBillingOperatorReport = (payload) => {
  const url = envBaseUrl + servicesList.posService + '/download/v1/export/billingSpeed';
  return postDownloadPdfRequest(url, payload);
};

export const expressGrnCreateMetric = (payload) => {
  const url = envBaseUrl + servicesList.posService + '/metrics/v1/epo/create';
  return postRequest(url, payload);
};

export const expressGrnMetricData = (payload) => {
  const url = envBaseUrl + servicesList.posService + '/metrics/v1/epo/metrics';
  return postRequest(url, payload);
};

export const expressGrnMetricDataDownload = (payload) => {
  const url = envBaseUrl + servicesList.posService + '/download/v1/export/epo/metrics';
  return postDownloadPdfRequest(url, payload);
};

export const additionalInfoPiDetails = (vendorId) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/vendor/purchase/return/details/${vendorId}`;
  return gettRequest(url, METHOD.GET);
};

export const getAllVendorSegrgation = (piNum) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/purchase-indent/segregate/Items/ByVendor/${piNum}`;
  return postRequest(url, piNum);
};

export const getAllVendorDetails = (payload) => {
  const url = envBaseUrl + servicesList.vendorVms + `/vendor/details`;
  return postRequest(url, payload);
};
export const updateVendorStatus = (payload) => {
  const url = envBaseUrl + servicesList.vendorVms + `/vendor`;
  return patchRequest(url, payload);
};

export const getInwardedItems = (purchaseId) => {
  const url = envBaseUrl + servicesList.inwardService + `/v1/items/detail/${purchaseId}`;
  return gettRequest(url, METHOD.GET);
};

export const getInwardedItemsV2 = (purchaseId) => {
  const url = envBaseUrl + servicesList.inwardService + `/v2/items/detail/${purchaseId}`;
  return gettRequest(url, METHOD.GET);
};

export const fetchPurchaseOrderDetails = (purchaseId) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/v2/purchase/order/details/page/${purchaseId}`;
  return gettRequest(url, METHOD.GET);
};

export const downloadCartDeleteHoldReport = (payload) => {
  const url = envBaseUrl + servicesList.posService + '/download/v1/export/cart/delete';
  return postRequest(url, payload);
};

export const createComment = (payload) => {
  const url = envBaseUrl + servicesList.purchaseOrder + '/api/v1/purchase/comment/create';
  return postRequest(url, payload);
};

export const getComments = (refId) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/v1/purchase/comment/${refId}`;
  return gettRequest(url, METHOD.GET);
};
export const getBlacklistedCustomers = (id) => {
  const url = envBaseUrl + servicesList.loyaltyService + `/api/configurations/v2/blacklist/fetch?sourceOrgId=${id}`;
  return gettRequest(url, METHOD.GET);
};

export const removeBlacklistedCustomer = (orgId, uidx) => {
  const url =
    envBaseUrl +
    servicesList.loyaltyService +
    `/api/configurations/v2/blacklist/remove?sourceOrgId=${orgId}&customerId=${uidx}`;
  return deleteRequest(url, METHOD.DELETE);
};

export const getLoyaltyHistory = (payload) => {
  const url = envBaseUrl + servicesList.loyaltyService + `/api/transactions/loyaltyPoints/v1/history`;
  return postRequest(url, payload);
};

export const getCustomerLoyaltyLogs = (uidx, orgId) => {
  const url =
    envBaseUrl +
    servicesList.loyaltyService +
    `/api/customers/accounts/v1/end-customers/fetch?customerUidx=${uidx}&sourceOrgId=${orgId}&platformSupportType=b2c`;
  return gettRequest(url, METHOD.GET);
};

export const getBlackListTimeline = (uidx) => {
  const url = envBaseUrl + servicesList.loyaltyService + `/api/configurations/v2/blacklist/timeline?customerId=${uidx}`;
  return gettRequest(url, METHOD.GET);
};

export const getPosConfigurations = (orgId) => {
  const url = envBaseUrl + servicesList.retailService + `/configuration/v1/organization/${orgId}`;
  return gettRequest(url, METHOD.GET);
};

export const updatePosConfiguration = (payload) => {
  const url = envBaseUrl + servicesList.retailService + '/configuration/v1/update';
  return postRequest(url, payload);
};

export const uploadGRNInvoiceBill = (epoNumber, payload) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/v1/express/po/file/upload/${epoNumber}`;
  return postFileRequest(url, payload);
};

export const removeGRNInvoiceBill = (epoNumber, payload) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/v1/express/po/file/remove/${epoNumber}`;
  return postRequest(url, payload);
};

// stock count
export const createNewStockCountJob = (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + `/stock/taking/job/v2/create`;
  return postRequest(url, payload);
};

export const stockCountFileUpload = (locId, payload) => {
  const url = envBaseUrl + servicesList.inventoryService + `/stock/taking/job/v1/upload/file?locationId=${locId}`;
  return postFileRequest(url, payload);
};

export const validateGtinsFromUploadedFile = (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + `/stock/taking/job/v1/validate/gtin`;
  return postRequest(url, payload);
};

export const getStockCountJobLists = (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + '/stock/taking/job/v2/list';
  return postRequest(url, payload);
};

export const getStockCountJobDetails = (jobId, date, sessionId) => {
  const url =
    envBaseUrl +
    servicesList.inventoryService +
    `/stock/taking/job/v2/details?jobId=${jobId}&date=${date}&sessionId=${sessionId}`;
  return gettRequest(url, METHOD.GET);
};

export const stockAdjustment = (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + `/stock/taking/job/session/v2/adjust`;
  return postRequest(url, payload);
};

export const getSessionAndItemRelatedData = (sessionId) => {
  const url = envBaseUrl + servicesList.inventoryService + `/stock/taking/product/v2/details/${sessionId}`;
  return gettRequest(url, METHOD.GET);
};

export const updatejobSession = (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + `/stock/taking/job/session/v2/update`;
  return postRequest(url, payload);
};

// stock count - rms mobile
// session list without pagination
export const getSessionList = (locationId, counterUidx) => {
  const url =
    envBaseUrl + servicesList.inventoryService + `/stock/taking/job/session/v2/active/${locationId}/${counterUidx}`;
  return gettRequest(url, METHOD.GET);
};

// session list api with pagination
export const getSessionListV3 = (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + `/stock/taking/job/session/v3/active`;
  return postRequest(url, payload);
};

// items list for session
export const getSessionItemsList = (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + `/stock/taking/session/item/v2/get`;
  return postRequest(url, payload);
};

// start session
export const startStockCountSession = (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + `/stock/taking/job/session/v2/start`;
  return postRequest(url, payload);
};

// close session
export const closeStockCountSession = (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + `/stock/taking/job/session/v2/close`;
  return postRequest(url, payload);
};

export const removePIAssignedTo = (payload) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/purchase-indent/delete/assignee`;
  return postRequest(url, payload);
};

export const getAllVendorSpecificProducts = (payload) => {
  const url = envBaseUrl + servicesList.vendorVms + `/vendor/product/search`;
  return postRequest(url, payload);
};

export const searchProductsVendorSpecific = (payload) => {
  const url = envBaseUrl + servicesList.vendorVms + `/vendor/product/gtin/search`;
  return postRequest(url, payload);
};

// Get Batches for Items linked to the sessions
export const getBatchesItemsLinkedWithSessions = (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + `/stock/taking/session/item/batch/v2/get`;
  return postRequest(url, payload);
};

// batch session details
export const getBatchSessionDetails = (batchSessionId) => {
  const url = envBaseUrl + servicesList.inventoryService + `/stock/taking/batch/v2/details/${batchSessionId}`;
  return gettRequest(url, METHOD.GET);
};

// batch session update
export const updateBatchSession = (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + `/stock/taking/batch/v2/update`;
  return postRequest(url, payload);
};

export const billPaymentSummary = (orgId, locId) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/v1/purchase/order/bill/summary/${orgId}/${locId}`;
  return gettRequest(url, METHOD.GET);
};

export const cumulativeGRNDetails = (epoNumber) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/v1/express/purchase/order/details/page/${epoNumber}`;
  return gettRequest(url, METHOD.GET);
};

export const exportStockSessionReport = (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + `/stock/taking/v1/session/report/export`;
  return postDownloadPdfRequest(url, payload);
};

export const downloadStockReports = (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + `/stock/taking/v1/session/report/download`;
  return postRequest(url, payload);
};

export const cumulativePurchaseReturnDetails = (returnId) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/return/cumulative/details/${returnId}`;
  return gettRequest(url, METHOD.GET);
};

export const purchaseReturnSummary = (orgId, locId) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/return/summary//details/${orgId}/${locId}`;
  return gettRequest(url, METHOD.GET);
};

export const startInward = (payload) => {
  const url = envBaseUrl + servicesList.purchaseOrder + '/api/v1/return/inward';
  return postRequest(url, payload);
};

export const fetchReturnSummary = (orgId, locId) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/return/summary/details/${orgId}/${locId}`;
  return gettRequest(url, METHOD.GET);
};

export const fetchBillDetails = (billId) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/v1/purchase/order/bill/details/page/${billId}`;
  return gettRequest(url, METHOD.GET);
};

export const createHODepartment = (payload) => {
  const url = envBaseUrl + servicesList.productService + '/department/create/multiple';
  return postRequest(url, payload);
};

export const getHoDepartment = (payload) => {
  const url = envBaseUrl + servicesList.productService + '/department/filter';
  return postRequest(url, payload);
};

export const createHOSubDepartment = (payload) => {
  const url = envBaseUrl + servicesList.productService + '/department/sub/create/multiple';
  return postRequest(url, payload);
};

export const createHOCategory = (payload) => {
  const url = envBaseUrl + servicesList.productService + '/category/main/multiple/create';
  return postRequest(url, payload);
};

export const editHOCategory = (payload) => {
  const url = envBaseUrl + servicesList.productService + '/category/main/edit';
  return postRequest(url, payload);
};

export const createLineOfBusiness = (payload) => {
  const url = envBaseUrl + servicesList.productService + '/lob/create/multiple';
  return postRequest(url, payload);
};

export const createLevel1Category = (payload) => {
  const url = envBaseUrl + servicesList.productService + `/category/level1/multiple/create`;
  return postRequest(url, payload);
};

export const createLevel2Categories = (payload) => {
  const url = envBaseUrl + servicesList.productService + `/category/level2/multiple/create`;
  return postRequest(url, payload);
};

export const getProductDetailsNew = (productId, locId) => {
  const url = envBaseUrl + servicesList.productService + `/product/v2/get/${productId}${locId ? `/${locId}` : ''} `;
  return gettRequest(url, METHOD.GET);
};

export const getProductDetailsRestaurant = (productId) => {
  const url = envBaseUrl + servicesList.productService + `/restaurant/product/getById/${productId}`;
  return postRequest(url, null);
};

export const createPrepStation = (payload) => {
  const url = envBaseUrl + servicesList.productService + `/prep-station/create`;
  return postRequest(url, payload);
};

export const updatePrepStation = (payload) => {
  const url = envBaseUrl + servicesList.productService + `/prep-station/update`;
  return postRequest(url, payload);
};

export const getAllPrepStations = (payload) => {
  const url = envBaseUrl + servicesList.productService + `/prep-station/filter`;
  return postRequest(url, payload);
};

export const getPrepStationById = (id) => {
  const url = envBaseUrl + servicesList.productService + `/prep-station/get/${id}`;
  return gettRequest(url, METHOD.GET);
};

export const getRecipeDetailsRestaurant = (payload) => {
  const url = envBaseUrl + servicesList.productService + `/restaurant/filter/recipe`;
  return postRequest(url, payload);
};

export const updateProductDetailsNew = (payload) => {
  const url = envBaseUrl + servicesList.productService + '/restaurant/product/update';
  return postRequest(url, payload);
};

export const getAllProductsV2New = (payload) => {
  const url = envBaseUrl + servicesList.productService + '/product/v2/filter/product';
  return postRequest(url, payload);
};
export const mergeProductsapi = (payload) => {
  const url = envBaseUrl + servicesList.productService + '/product/v2/variants/merge';
  return postRequest(url, payload);
};
export const unMergeProductsapi = (payload) => {
  const url = envBaseUrl + servicesList.productService + '/product/v2/variants/unmerge';
  return postRequest(url, payload);
};
export const saveAssortmentMapping = (payload) => {
  const url = envBaseUrl + servicesList.productService + '/product/v2/copy/existing/data';
  return postRequest(url, payload);
};

export const filterLineOfBusiness = (payload) => {
  const url = envBaseUrl + servicesList.productService + '/lob/filter';
  return postRequest(url, payload);
};

export const filterDepartments = (payload) => {
  const url = envBaseUrl + servicesList.productService + '/department/filter';
  return postRequest(url, payload);
};

export const createImageUrl = (payload) => {
  const url = envBaseUrl + servicesList.productService + '/product/v2/cloud/upload/images';
  return postRequest(url, payload);
};

export const editLineOfBusiness = (payload) => {
  const url = envBaseUrl + servicesList.productService + '/lob/edit';
  return postRequest(url, payload);
};

export const editDepartment = (payload) => {
  const url = envBaseUrl + servicesList.productService + '/department/edit';
  return postRequest(url, payload);
};

export const getHOSubDepartment = (payload) => {
  const url = envBaseUrl + servicesList.productService + '/department/sub/filter';
  return postRequest(url, payload);
};

export const getHOSubDepartmentByDep = (payload) => {
  const url = envBaseUrl + servicesList.productService + '/department/sub/filterV2';
  return postRequest(url, payload);
};

export const editSubDepartment = (payload) => {
  const url = envBaseUrl + servicesList.productService + '/department/sub/edit';
  return postRequest(url, payload);
};
// expiry management
export const adjustCartByOrderId = (cartId, orderId) => {
  const url = envBaseUrl + servicesList.cartService + `/so/v1/adjust/${cartId}?order-id=${orderId}&inventoryCheck=NO`;
  return postRequest(url);
};

export const getProductsExpirySummary = (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + `/api/v1/get/expiry/summary`;
  return postRequest(url, payload);
};

export const getProductsExpiryData = (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + `/api/v1/get/expiry/data`;
  return postRequest(url, payload);
};

export const getProductExpiryByBatch = (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + `/api/v1/get/expiry/products/batch`;
  return postRequest(url, payload);
};
export const consumeInventoryBatchData = (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + `/api/bundle/v2/create`;
  return postRequest(url, payload);
};

export const getBundleDetailsIms = (locId, gtin) => {
  const url = envBaseUrl + servicesList.inventoryService + `/api/bundle/v1/${locId}/${gtin}`;
  return gettRequest(url, METHOD.GET);
};

export const getAllMarketingFilters = () => {
  const url = envBaseUrl + servicesList.commService + '/segments/main-filter/getAll';
  return gettRequest(url, METHOD.GET);
};

export const getFirstLevelMarketingFilters = (filterName) => {
  const url = envBaseUrl + servicesList.commService + `/segments/first-filter/getAllBy/${filterName}`;
  return gettRequest(url, METHOD.GET);
};

export const createMarketingSegment = (payload) => {
  const url = envBaseUrl + servicesList.commService + '/v1/build/queries';
  return postRequest(url, payload);
};

export const getAllMarketingSegmentsList = (orgId) => {
  const url = envBaseUrl + servicesList.commService + `/segments/getByOrgId/${orgId}`;
  return gettRequest(url, METHOD.GET);
};

export const deleteSegmentById = (segmentId) => {
  const url = envBaseUrl + servicesList.commService + `/segments/deleteById/${segmentId}`;
  return gettRequest(url, METHOD.GET);
};

export const getSingleSegmentById = (payload) => {
  const url = envBaseUrl + servicesList.commService + '/segments/get/csvFile/from/reporting-service';
  return postRequest(url, payload);
};

export const sendEmailSegement = (payload) => {
  const url = envBaseUrl + servicesList.notificationService + '/export/csv';
  return postRequest(url, payload);
};

export const deleteStockTransfer = (payload) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/v1/stock/transfer/delete`;
  return postRequest(url, payload);
};

export const uploadEwayBill = (stnNumber, payload) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/v1/stock/transfer/file/upload/${stnNumber}`;
  return postFileRequest2(url, payload);
};

export const getStockTransferAdditionalDetails = (stnNumber) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/v1/stock/transfer/details/page/${stnNumber}`;
  return gettRequest(url, METHOD.GET);
};

export const getStockTransferSummaryData = (locId) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/v1/stock/transfer/summary/${locId}`;
  return gettRequest(url, METHOD.GET);
};

export const handleRecountStock = (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + '/stock/taking/product/v2/recount';
  return postRequest(url, payload);
};

export const getAllManufacturers = (page, pageSize, search) => {
  const url =
    envBaseUrl + servicesList.productService + `/manufacturer/search/${search}/?page=${page}&pageSize=${pageSize}`;
  return gettRequest(url, METHOD.GET);
};

export const createManufacturer = (payload) => {
  const url = envBaseUrl + servicesList.productService + '/manufacturer';
  return postRequest(url, payload);
};

export const createReturnSalesOrder = (payload) => {
  const url = envBaseUrl + servicesList.saleService + `/returns/create/return/customer`;
  return postRequest(url, payload);
};

export const getPIExisting = (gtin, orgId, locId) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/purchase-indent/item/check/${gtin}/${orgId}/${locId}`;
  return gettRequest(url, METHOD.GET);
};

export const salesPaymentDetails = (paymentID, orderId) => {
  const url = envBaseUrl + servicesList.saleService + `/payments/payment?payment-id=${paymentID}&order-id=${orderId}`;
  return gettRequest(url, METHOD.GET);
};

export const getSessionItemsListV2 = (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + `/stock/taking/session/item/v3/get`;
  return postRequest(url, payload);
};

export const addProductToSession = (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + `/stock/taking/product/v1/add`;
  return postRequest(url, payload);
};

export const deleteProductFromSession = (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + `/stock/taking/product/v2/delete`;
  return postRequest(url, payload);
};

export const salesOrderReturnDetails = (returnId, orderId) => {
  const url = envBaseUrl + servicesList.saleService + `/returns/return?return-id=${returnId}&order-id=${orderId}`;
  return gettRequest(url, METHOD.GET);
};

export const salesOrderPaymentSummary = (payload) => {
  const url = envBaseUrl + servicesList.saleService + `/payments/payment/summary`;
  return postRequest(url, payload);
};

export const salesOrderReturnTimeline = (orderId) => {
  const url = envBaseUrl + servicesList.saleService + `/orders/v1/trackReturnStatus/${orderId}`;
  return gettRequest(url, METHOD.GET);
};

export const salesOrderRetunBilling = (payload) => {
  const url = envBaseUrl + servicesList.saleService + `/returns/v1/create/item/return`;
  return postRequest(url, payload);
};

export const salesOrderUpdateCart = (payload, cartId) => {
  const url = envBaseUrl + servicesList.cartService + `/so/v1/update/${cartId}`;
  return patchRequest(url, payload);
};
export const getStockBalanceLists = (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + '/api/v1/get/stock_balance/data';
  return postRequest(url, payload);
};

export const getStockBalanceSummaryData = (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + '/api/v1/get/stock_balance/summary';
  return postRequest(url, payload);
};

export const getOverSoldProductsLists = (payload) => {
  //inventory - oversold product list api
  const url = envBaseUrl + servicesList.inventoryService + '/api/v1/inventory/get-negative-inventory';
  return postRequest(url, payload);
};

export const getOversoldSummary = (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + '/api/v1/inventory/get-negative-inventory-stocks';
  return postRequest(url, payload);
};

export const returnProductLookup = (custId, locId) => {
  const url = envBaseUrl + servicesList.saleService + `/returns/return/items?customerId=${custId}&locationId=${locId}`;
  return gettRequest(url, METHOD.GET);
};

export const salesCustomerProduct = (custId, locId, gtin) => {
  const url =
    envBaseUrl +
    servicesList.saleService +
    `/returns/return/items?customerId=${custId}&locationId=${locId}&gtin=${gtin}`;
  return gettRequest(url, METHOD.GET);
};

export const salesOrderCreatePurchase = (payload) => {
  const url = envBaseUrl + servicesList.cartService + `/so/v1/po-info/create`;
  return postRequest(url, payload);
};

export const salesOrderUpdatePurchase = (payload) => {
  const url = envBaseUrl + servicesList.cartService + `/so/v1/po-info/update`;
  return patchRequest(url, payload);
};

export const addSupplementaryProducts = (payload) => {
  const url = envBaseUrl + servicesList.cartService + `/so/v1/supplementary/product/add`;
  return postRequest(url, payload);
};

export const updateSupplementaryProducts = (payload) => {
  const url = envBaseUrl + servicesList.cartService + `/so/v1/supplementary/product/update`;
  return patchRequest(url, payload);
};

export const removeSupplementaryProducts = (cartId, suppId) => {
  const url = envBaseUrl + servicesList.cartService + `/so/v1/supplementary/product/remove/${cartId}/${suppId}`;
  return postRequest(url);
};

export const getAvailableCreditCust = (locId, custId) => {
  const url = envBaseUrl + servicesList.saleService + `/credit/${locId}/${custId}`;
  return gettRequest(url, METHOD.GET);
};

export const applySOCreditCust = (payload) => {
  const url = envBaseUrl + servicesList.cartService + `/so/v1/apply/credit/balance`;
  return postRequest(url, payload);
};

export const removeSOCreditCust = (cartId) => {
  const url = envBaseUrl + servicesList.cartService + `/so/v1/remove/credit/balance/${cartId}`;
  return postRequest(url);
};

export const soCreateComment = (payload) => {
  const url = envBaseUrl + servicesList.saleService + `/comments/create`;
  return postRequest(url, payload);
};

export const sogetAllComment = (orderId) => {
  const url = envBaseUrl + servicesList.saleService + `/comments/comments/${orderId}`;
  return gettRequest(url, METHOD.GET);
};

export const salesPartialPayment = (payload) => {
  const url = envBaseUrl + servicesList.saleService + `/orders/v2/payOrder`;
  return postRequest(url, payload);
};
// stock adjustment new
export const getStockAdjustmentData = (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + '/api/v1/get/stock_adjustment/data';
  return postRequest(url, payload);
};

export const getStockAdjustmentSummary = (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + '/api/v1/get/stock_adjustment/summary';
  return postRequest(url, payload);
};

export const getStockAdjustmentDetails = (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + '/api/v1/get/stock_adjustment/details/display';
  return postRequest(url, payload);
};

// get all products list
export const getAllProductsList = (payload) => {
  const url = envBaseUrl + servicesList.productService + '/product/v2/filter/product';
  return postRequest(url, payload);
};

export const getProductLogs = (payload) => {
  const url = envBaseUrl + servicesList.productService + '/product/logs/filter';
  return postRequest(url, payload);
};

export const getProductDetailsFromLogs = (logId, payload) => {
  const url = envBaseUrl + servicesList.productService + `/product/logs/get/${logId}`;
  return postRequest(url, payload);
};

export const getPurchaseMarginAccToVendor = (payload) => {
  const url = envBaseUrl + servicesList.vendorVms + '/vendors/products';
  return postRequest(url, payload);
};

export const getLocationDetailsByGtin = (payload, gtin, orgId) => {
  const url = envBaseUrl + servicesList.inventoryService + `/api/v1/get/product/data?gtin=${gtin}&orgId=${orgId}`;
  return postRequest(url, payload);
};

export const getTemplateIdByName = (templateName) => {
  const url = envBaseUrl + servicesList.notificationService + `/template/search/${templateName}`;
  return gettRequest(url, METHOD.GET);
};

export const sendEmailVerifySend = (payload) => {
  const url = envBaseUrl + servicesList.commService + '/send-email';
  return postRequest(url, payload);
};

export const verifySenderEmailOtp = (payload, email, code, clientId) => {
  const url =
    envBaseUrl +
    servicesList.commService +
    `/verify-code?sender-Email=${email}&verification-code=${code}&client-id=${clientId}`;
  return postRequest(url, payload);
};

export const getEmailConnectedStatus = (clientId) => {
  const url = envBaseUrl + servicesList.commService + `/get/connection/status?clientId=${clientId}`;
  return gettRequest(url, METHOD.GET);
};

export const spMultipleProductConfig = (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + `/api/inventory/v2/calculate/sellingPrice`;
  return postRequest(url, payload);
};

export const deleteImagefromCloud = (payload) => {
  const url = envBaseUrl + servicesList.productService + `/product/v2/cloud/delete/file/{filePath}`;
  return postRequest(url, payload);
};

export const getProductIdByBarcode = (barcode, locId) => {
  const url = envBaseUrl + servicesList.productService + `/product/v2/get/by/both/${barcode}/${locId}`;
  return gettRequest(url, METHOD.GET);
};

export const getPoProducts = (payload) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/purchase-order-item-list`;
  return postRequest(url, payload);
};

export const purchaseTodaySummary = (locId) => {
  const url = envBaseUrl + servicesList.purchaseOrder + `/api/v1/purchase/order/today/${locId}`;
  return gettRequest(url, METHOD.GET);
};

export const createTaxMaster = (payload) => {
  const url = envBaseUrl + servicesList.retailService + '/tax/create';
  return postRequest(url, payload);
};

export const editTaxMaster = (payload) => {
  const url = envBaseUrl + servicesList.retailService + '/tax/edit';
  return postRequest(url, payload);
};

export const filterTaxMaster = (payload) => {
  const url = envBaseUrl + servicesList.retailService + '/tax/filter';
  return postRequest(url, payload);
};

export const deleteTaxMaster = (id) => {
  const url = envBaseUrl + servicesList.retailService + `/tax/delete/${id}`;
  return postRequest(url);
};

export const filterTaxSlabs = (payload) => {
  const url = envBaseUrl + servicesList.productService + '/tax/filter/slab';
  return postRequest(url, payload);
};

export const filterTaxMapping = (payload) => {
  const url = envBaseUrl + servicesList.productService + '/tax/filter';
  return postRequest(url, payload);
};

export const createTaxMapping = (payload) => {
  const url = envBaseUrl + servicesList.productService + '/tax/create';
  return postRequest(url, payload);
};

export const createTaxSlab = (payload) => {
  const url = envBaseUrl + servicesList.productService + '/tax/create/slab';
  return postRequest(url, payload);
};

export const editTaxSlab = (payload) => {
  const url = envBaseUrl + servicesList.productService + '/tax/edit/slab';
  return postRequest(url, payload);
};

export const deleteTaxSlab = (slabId) => {
  const url = envBaseUrl + servicesList.productService + `/tax/delete/slab/${slabId}`;
  return postRequest(url);
};

export const editTaxMapping = (payload) => {
  const url = envBaseUrl + servicesList.productService + '/tax/edit';
  return postRequest(url, payload);
};

export const deleteTaxMapping = (mapId) => {
  const url = envBaseUrl + servicesList.productService + `/tax/delete/${mapId}`;
  return postRequest(url);
};

export const getTaxDetailsByLevel3Id = (level3Id) => {
  const url = envBaseUrl + servicesList.productService + `/tax/fetch/${level3Id}`;
  return postRequest(url);
};
export const filterBlog = (payload) => {
  const url = envBaseUrl + servicesList.productService + `/blog/filter`;
  return postRequest(url, payload);
};

// get products list for session for open job
export const getOpenJobSessionItemList = (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + '/stock/taking/open/session/item/get';
  return postRequest(url, payload);
};

// check whether the suggestion product is added in different session or not
export const checkProductExistInDifferentSession = (gtin, sessionId) => {
  const url =
    envBaseUrl +
    servicesList.inventoryService +
    `/stock/taking/open/session/check/item?gtin=${gtin}&sessionId=${sessionId}`;
  return gettRequest(url, METHOD.GET);
};

export const getAllProductsListFilter = (payload) => {
  const url = envBaseUrl + servicesList.productService + '/filter/product';
  return postRequest(url, payload);
};

export const getExpiryProductsList = (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + `/api/v1/get/expiry/products`;
  return postRequest(url, payload);
};

export const closeSessionForOpenJob = (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + `/stock/taking/open/session/complete`;
  return postRequest(url, payload);
};

export const getBlogs = (payload) => {
  const url = envBaseUrl + servicesList.productService + `/blog/get/${payload}`;
  return gettRequest(url, payload);
};

export const uploadPhoto = (payload) => {
  const url = envBaseUrl + servicesList.productService + `/product/v2/cloud/upload/file`;
  return postRequest(url, payload);
};

export const hrmsCreateEmployees = (payload) => {
  const url = envBaseUrl + servicesList.retailService + `/employees/create/employee`;
  return postRequest(url, payload);
};

export const hrmsGetEmployees = (payload) => {
  const url = envBaseUrl + servicesList.retailService + `/employees/search/employees`;
  return postRequest(url, payload);
};

export const hrmsGetEmployee = (id) => {
  const url = envBaseUrl + servicesList.retailService + `/employees/get/employee/${id}`;
  return gettRequest(url);
};

export const hrmsUpdateEmployees = (payload, id) => {
  const url = envBaseUrl + servicesList.retailService + `/employees/update/employee/${id}`;
  return postRequest(url, payload);
};

export const hrmsDeleteEmployees = (payload, id) => {
  const url = envBaseUrl + servicesList.retailService + `/employees/delete/employee/${id}`;
  return postRequest(url, payload);
};

export const hrmsGetDepartments = (payload) => {
  const url = envBaseUrl + servicesList.retailService + `/departments/search/department`;
  return postRequest(url, payload);
};

export const hrmsGetDepartment = (id) => {
  const url = envBaseUrl + servicesList.retailService + `/departments/get/departments/${id}`;
  return gettRequest(url);
};

export const hrmsCreateDepartment = (payload) => {
  const url = envBaseUrl + servicesList.retailService + `/departments/create/department`;
  return postRequest(url, payload);
};

export const hrmsUpdateDepartment = (payload, id) => {
  const url = envBaseUrl + servicesList.retailService + `/departments/update/${id}`;
  return postRequest(url, payload);
};

export const hrmsDeleteDepartment = (payload, id) => {
  const url = envBaseUrl + servicesList.retailService + `/departments/delete/department/${id}`;
  return postRequest(url, payload);
};

export const hrmsGetDesignations = (payload) => {
  const url = envBaseUrl + servicesList.retailService + `/designations/search/designations`;
  return postRequest(url, payload);
};

export const hrmsGetDesignation = (id) => {
  const url = envBaseUrl + servicesList.retailService + `/designations/get/designations/${id}`;
  return gettRequest(url);
};

export const hrmsCreateDesignations = (payload) => {
  const url = envBaseUrl + servicesList.retailService + `/designations/create/designation`;
  return postRequest(url, payload);
};

export const hrmsDeleteDesignations = (payload, id) => {
  const url = envBaseUrl + servicesList.retailService + `/designations/delete/designation/${id}`;
  return postRequest(url, payload);
};

export const hrmsUpdateDesignation = (payload, id) => {
  const url = envBaseUrl + servicesList.retailService + `/designations/update/designation/${id}`;
  return postRequest(url, payload);
};

export const hrmsCreateHoliday = (payload) => {
  const url = envBaseUrl + servicesList.retailService + `/holidays/create/holiday`;
  return postRequest(url, payload);
};

export const hrmsGetHoliday = (payload) => {
  const url = envBaseUrl + servicesList.retailService + `/holidays/get/filter/holidays`;
  return postRequest(url, payload);
};

export const hrmsDeleteHoliday = (payload, id) => {
  const url = envBaseUrl + servicesList.retailService + `/holidays/delete/holiday/${id}`;
  return postRequest(url, payload);
};

export const hrmsGetHolidayDetail = (id) => {
  const url = envBaseUrl + servicesList.retailService + `/holidays/get/holiday/${id}`;
  return gettRequest(url);
};

export const hrmsUpdateHoliday = (payload, id) => {
  const url = envBaseUrl + servicesList.retailService + `/holidays/update/holiday/${id}`;
  return postRequest(url, payload);
};

export const deleteCMSProduct = (payload) => {
  const url = envBaseUrl + servicesList.productService + '/product/v2/delete';
  return postRequest(url, payload);
};

export const activateCMSProduct = (payload) => {
  const url = envBaseUrl + servicesList.productService + '/product/v2/activate/deactivate';
  return postRequest(url, payload);
};

export const removeSOCoupon = (cartId) => {
  const url = envBaseUrl + servicesList.cartService + `/so/v1/remove/coupon/${cartId}`;
  return postRequest(url);
};

export const copyPalletOnlineCategories = (payload) => {
  const url = envBaseUrl + servicesList.productService + `/category/update/Categories/`;
  return postRequest(url, payload);
};

export const copyPalletManufacturers = (payload) => {
  const url = envBaseUrl + servicesList.productService + `/category/update/ManufacturerLocations/`;
  return postRequest(url, payload);
};

export const getAllProductSuggestionV2 = (payload) => {
  // const url = envBaseUrl + servicesList.productService + '/product/v2/suggest/product';  // Changes requested as per Abu on 07-07-25s
  const url = envBaseUrl + servicesList.productService + '/product/v2/filter/product';

  return postRequest(url, payload);
};

export const addDeliveryAddress = (payload) => {
  const url = envBaseUrl + servicesList.retailService + '/branch/v1/address/add';
  return postRequest(url, payload);
};

export const updateDeliveryAddress = (payload) => {
  const url = envBaseUrl + servicesList.retailService + '/branch/v1/address/update';
  return postRequest(url, payload);
};

export const getAlldeliveryAddress = (payload) => {
  const url = envBaseUrl + servicesList.retailService + `/branch/v1/address/get/address/${payload}`;
  return gettRequest(url, payload);
};

export const deleteDeliveryAddress = (payload) => {
  const url = envBaseUrl + servicesList.retailService + `/branch/v1/address/delete`;
  return postRequest(url, payload);
};

export const getVendorDetailsByGtin = (payload) => {
  const url = envBaseUrl + servicesList.vendorVms + '/vendor/margin/details';
  return postRequest(url, payload);
};

export const getBulkPriceEditList = (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + '/bulk/job/edit/price/list';
  return postRequest(url, payload);
};

export const createBulkPriceEditUpload = (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + '/bulk/job/edit/price/create';
  return postFileRequest(url, payload);
};

export const getBulkJobBulkPriceStatus = (id) => {
  const url = envBaseUrl + servicesList.inventoryService + `/bulk/job/edit/price/${id}`;
  return gettRequest(url, METHOD.GET);
};

export const getAllProductsBulkPriceUpload = (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + '/bulk/job/edit/price/products/paginated';
  return postRequest(url, payload);
};

export const getAllLicenses = (payload) => {
  const url = envBaseUrl + servicesList.businessService + '/api/license/details/location';
  return postRequest(url, payload);
};

export const createStoreConfig = (payload) => {
  const url = envBaseUrl + servicesList.retailService + '/store-config/v1/create';
  return postRequest(url, payload);
};

export const updateStoreConfig = (payload) => {
  const url = envBaseUrl + servicesList.retailService + '/store-config/v1/update';
  return postRequest(url, payload);
};

export const getStoreConfig = (locId) => {
  const url = envBaseUrl + servicesList.retailService + `/store-config/v1/get?locId=${locId}`;
  return gettRequest(url, METHOD.GET);
};

// ------Tickets Api----
export const getAllProjects = (payload) => {
  const url = envBaseUrl + servicesList.retailService + `/project/get/projects`;
  return postRequest(url, payload);
};

export const getFeature = (projectId, payload) => {
  const url = envBaseUrl + servicesList.retailService + `/feature/${projectId}/features?projectId=${projectId}`;
  return postRequest(url, payload);
};

export const createTicket = (payload) => {
  const url = envBaseUrl + servicesList.retailService + `/task/create`;
  return postRequest(url, payload);
};

export const getTicketList = (srcId, orgId, payload) => {
  const url = envBaseUrl + servicesList.retailService + `/task/get/tickets?srcId=${srcId}&orgId=${orgId}`;
  return postRequest(url, payload);
};

export const getTicketById = (taskId) => {
  const url = envBaseUrl + servicesList.retailService + `/task/get/ticket/details?ticketId=${taskId}`;
  return gettRequest(url, METHOD.GET);
};

export const updateTask = (payload) => {
  const url = envBaseUrl + servicesList.retailService + `/task/update/task`;
  return patchRequest(url, payload);
};

export const deleteTask = (taskId, payload) => {
  const url = envBaseUrl + servicesList.retailService + `/task/delete/${taskId}`;
  return postRequest(url, payload);
};

export const getProductOwner = (payload) => {
  const url = envBaseUrl + servicesList.userService + `/users/contextId/orgId`;
  return postRequest(url, payload);
};
export const createTaskComment = (taskId, payload) => {
  const url = envBaseUrl + servicesList.retailService + `/comment/task/${taskId}`;
  return postRequest(url, payload);
};

export const getTaskComment = (taskId, payload) => {
  const url = envBaseUrl + servicesList.retailService + `/comment/get/${taskId}`;
  return postRequest(url, payload);
};

export const editComment = (payload) => {
  const url = envBaseUrl + servicesList.retailService + `/comment/edit`;
  return patchRequest(url, payload);
};
export const deleteComment = (payload) => {
  const url = envBaseUrl + servicesList.retailService + `/comment/delete`;
  return patchRequest(url, payload);
};

export const createAttachments = (payload) => {
  const url = envBaseUrl + servicesList.retailService + `/attachment/upload`;
  return postRequest(url, payload);
};

export const deleteAttachments = (payload) => {
  const url = envBaseUrl + servicesList.retailService + `/attachment/cloud/delete/file`;
  return postRequest(url, payload);
};

export const ticketFilter = (locId, orgId, payload) => {
  const url = envBaseUrl + servicesList.retailService + `/task/filter/ticket/${locId}/${orgId}`;
  return postRequest(url, payload);
};

export const ticketSummary = (payload) => {
  const url = envBaseUrl + servicesList.retailService + `/task/get/ticket/summary`;
  return postRequest(url, payload);
};

export const stopBulkJobProducts = (payload, id) => {
  const url = envBaseUrl + servicesList.productService + `/bulk/v1/update/${id}`;
  return postRequest(url, payload);
};

// customer details
export const getCustomerOrderSummaryV2 = (payload) => {
  const url = envBaseUrl + servicesList.saleService + `/customer/customer-orders`;
  return postRequest(url, payload);
};

export const getCustomerDetailsByPhone = (phoneNumber) => {
  const url = envBaseUrl + `b2c/customer/v1/get/phone?phoneNumber=${phoneNumber}`;
  return gettRequest(url, METHOD.GET);
};

export const getCustomerLoyaltyPointsList = (payload) => {
  const url = envBaseUrl + servicesList.saleService + `/customer/customer-orders/loyalty`;
  return postRequest(url, payload);
};

export const getCustomerCouponList = (payload) => {
  const url = envBaseUrl + servicesList.couponService + `/api/v1/get/coupon/details/mobile-number`;
  return postRequest(url, payload);
};

export const getCustomerWalletDetails = (customerId) => {
  const url = envBaseUrl + `b2c/wallet/v1/customer/details/${customerId}`;
  return gettRequest(url, METHOD.GET);
};

// promo wallet
export const getCustomerWalletAmount = (customerId) => {
  const url = envBaseUrl + `b2c/wallet/v1/balances/${customerId}`;
  return gettRequest(url, METHOD.GET);
};

export const getPosCustomerDetails = (uidx, orgId) => {
  const url = envBaseUrl + `retail-service/retail/customer/v1/${uidx}?orgId=${orgId}`;
  return gettRequest(url, METHOD.GET);
};

// loyalty summary
export const getCustomerLoyaltySummary = (payload) => {
  const url = envBaseUrl + servicesList.loyaltyService + `/api/loyaltyPoints/customer/loyalty/details`;
  return postRequest(url, payload);
};

export const validateAppAndPosUser = (payload) => {
  const url = envBaseUrl + `retail-service/retail/customer/v1/exists`;
  return postRequest(url, payload);
};

export const createRepacking = (payload) => {
  const url = envBaseUrl + servicesList.inventoryService + `/api/inventory/v2/repacking`;
  return postRequest(url, payload);
};

export const createRestaurantProduct = (payload) => {
  const url = envBaseUrl + servicesList.productService + `/restaurant/product/create`;
  return postRequest(url, payload);
};

export const productCreationCalculation = (payload) => {
  const url = envBaseUrl + servicesList.productService + `/restaurant/calculate/margin/profit`;
  return postRequest(url, payload);
};

export default getCustomerList;
