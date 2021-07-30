import client from './client';
const baseUrl = 'merchant';

export async function getMerchantOverview() {
  return client.get(`/${baseUrl}/overview`);
}

export async function getMerchants() {
  return client.get(`/${baseUrl}s`);
}

export async function getMerchant(id) {
  return client.get(`/${baseUrl}/${id}`);
}

export async function getMerchantsByBrandId(id) {
  return client.get(`/brand/${baseUrl}s/${id}`);
}

export async function putMerchant(data) {
  return client.put(`/${baseUrl}`, data);
}

export async function postMerchant(data) {
  return client.post(`/${baseUrl}`, data);
}

export async function postContact(data) {
  return client.post(`/contacts/${baseUrl}`, data);
}

export async function getMerchantCategories() {
  return client.get(`/merchantcategories`);
}

export default {
  getMerchant,
  getMerchants,
  putMerchant,
  postMerchant,
  postContact,
  getMerchantOverview,
  getMerchantCategories,
  getMerchantsByBrandId,
};
