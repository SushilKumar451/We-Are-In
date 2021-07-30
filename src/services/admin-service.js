import client from './client';

// ****** Users
export async function getUsers() {
  return client.get('/users');
}

export async function createUser(data) {
  return client.post('/user', data);
}

export async function fetchUsers() {
  return client.get('/user');
}

export async function postNewSystemSettings(data) {
  return client.post('/system/settings', data);
}

export async function getSystemSettings() {
  return client.get('/system/settings');
}

export async function createPermissionGroup(data) {
  return client.post('/permissions', data);
}

export async function createEngineerPermissionGroup(data) {
  return client.post('/permissions/engineer', data);
}

export async function fetchPermissionGroups() {
  return client.get('/permissions');
}

export async function fetchEngrPermissionGroups() {
  return client.get('/permissions/engineer');
}

// ****** Groups and Categories Clients
export async function getClientCategories() {
  return client.get('/clientcategories');
}

export async function postClientCategory(data) {
  return client.post('/clientcategory', data);
}

export async function putClientCategory(data) {
  return client.put('/clientcategory', data);
}

export async function getClientCategory(id) {
  return client.get(`/clientcategory/${id}`);
}

// ****** Groups and Categories Brands
export async function getBrandCategories() {
  return client.get('/brandcategories');
}

export async function postBrandCategory(data) {
  return client.post('/brandcategory', data);
}

export async function putBrandCategory(data) {
  return client.put('/brandcategory', data);
}

export async function getBrandCategory(id) {
  return client.get(`/brandcategory/${id}`);
}

// ****** Groups and Categories Merchants
export async function getMerchantCategories() {
  return client.get('/merchantcategories');
}

export async function postMerchantCategory(data) {
  return client.post('/merchantcategory', data);
}

export async function putMerchantCategory(data) {
  return client.put('/merchantcategory', data);
}

export async function getMerchantCategory(id) {
  return client.get(`/merchantcategory/${id}`);
}

// ****** Groups and Categories Vouchers
export async function getVoucherCategories() {
  return client.get('/vouchercategories');
}

export async function postVoucherCategory(data) {
  return client.post('/vouchercategory', data);
}

export async function putVoucherCategory(data) {
  return client.put('/vouchercategory', data);
}

export async function getVoucherCategory(id) {
  return client.get(`/vouchercategory/${id}`);
}

// ****** Groups and Categories Subscription
export async function getSubscriptionTypes() {
  return client.get('/subscription_types');
}

export async function postSubscriptionType(data) {
  return client.post('/subscription_type', data);
}

export async function putSubscriptionType(data) {
  return client.put('/subscription_type', data);
}

export async function getSubscriptionType(id) {
  return client.get(`/subscription_type/${id}`);
}

// ****** Groups and Categories Loyalty
export async function getLoyaltyStatuses() {
  return client.get('/loyaltystatuses');
}

export async function postLoyaltyStatus(data) {
  return client.post('/loyaltystatus', data);
}

export async function putLoyaltyStatus(data) {
  return client.put('/loyaltystatus', data);
}

export async function getLoyaltyStatus(id) {
  return client.get(`/loyaltystatus/${id}`);
}

// ****** Offer Types
export async function getOfferTypes() {
  return client.get('/offertypes');
}

export async function postOfferType(data) {
  return client.post('/offertype', data);
}

export async function putOfferType(data) {
  return client.put('/offertype', data);
}

export async function getOfferType(id) {
  return client.get(`/offertype/${id}`);
}

// ****** Amenity
export async function getAmenities() {
  return client.get('/amenities');
}

export async function postAmenity(data) {
  return client.post('/amenity', data);
}

export async function putAmenity(data) {
  return client.put('/amenity', data);
}

export async function getAmenity(id) {
  return client.get(`/amenity/${id}`);
}

// ****** Voucher Details
export async function getVoucherDetails() {
  return client.get('/voucherdetails');
}

export async function postVoucherDetail(data) {
  return client.post('/voucherdetail', data);
}

export async function putVoucherDetail(data) {
  return client.put('/voucherdetail', data);
}

export async function getVoucherDetail(id) {
  return client.get(`/voucherdetail/${id}`);
}

// ****** Country Counties
export async function getCountries() {
  return client.get('/countries');
}

export async function getCounties(countryId) {
  return client.get(`/counties/${countryId}`);
}

export async function postCounty(data) {
  return client.post('/county', data);
}

export async function putCounty(data) {
  return client.put('/county', data);
}

export async function getCounty(id) {
  return client.get(`/county/${id}`);
}

// ****** Currency
export async function getCurrencies() {
  return client.get('/currencies');
}

export async function postCurrency(data) {
  return client.post('/currency', data);
}

export async function putCurrency(data) {
  return client.put('/currency', data);
}

export async function getCurrency(id) {
  return client.get(`/currency/${id}`);
}

// ****** Permission
export async function getPermissions() {
  return client.get('/permissions');
}

export async function postPermission(data) {
  return client.post('/permission', data);
}

export async function putPermission(data) {
  return client.put('/permission', data);
}

export async function getPermission(id) {
  return client.get(`/permission/${id}`);
}

// ****** Access Level
export async function getAccessLevels() {
  return client.get('/accesslevels');
}

// ****** Activity Logs
export async function getActivityLogs() {
  return client.get('/activity/logs');
}

// ****** System Settings
export async function postSystemSetting(data) {
  return client.post('/createvms', data);
}

export default {
  createUser,
  getUsers,
  postNewSystemSettings,
  getSystemSettings,
  fetchUsers,
  createPermissionGroup,
  createEngineerPermissionGroup,
  fetchPermissionGroups,
  fetchEngrPermissionGroups,

  getClientCategory,
  postClientCategory,
  putClientCategory,
  getClientCategories,

  getBrandCategory,
  postBrandCategory,
  putBrandCategory,
  getBrandCategories,

  getMerchantCategory,
  postMerchantCategory,
  putMerchantCategory,
  getMerchantCategories,

  getVoucherCategory,
  postVoucherCategory,
  putVoucherCategory,
  getVoucherCategories,

  getSubscriptionTypes,
  postSubscriptionType,
  putSubscriptionType,
  getSubscriptionType,

  getLoyaltyStatuses,
  postLoyaltyStatus,
  putLoyaltyStatus,
  getLoyaltyStatus,

  getOfferTypes,
  postOfferType,
  putOfferType,
  getOfferType,

  getAmenities,
  postAmenity,
  putAmenity,
  getAmenity,

  getVoucherDetails,
  postVoucherDetail,
  putVoucherDetail,
  getVoucherDetail,

  getCountries,
  getCounties,
  postCounty,
  putCounty,
  getCounty,

  getCurrencies,
  postCurrency,
  putCurrency,
  getCurrency,

  getPermissions,
  postPermission,
  putPermission,
  getPermission,

  getAccessLevels,
  getActivityLogs,
  postSystemSetting,
};
