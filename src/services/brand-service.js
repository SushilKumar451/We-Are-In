import client from './client';
const baseUrl = 'brand';

export async function getBrands() {
  return client.get(`/${baseUrl}s`);
}

export async function getBrand(id) {
  return client.get(`/${baseUrl}/${id}`);
}

export async function getBrandsByClientId(id) {
  return client.get(`/client/${baseUrl}s/${id}`);
}

export async function putBrand(data) {
  return client.put(`/${baseUrl}`, data);
}

export async function postBrand(data) {
  return client.post(`/${baseUrl}`, data);
}

export async function postContact(data) {
  return client.post(`/contacts/${baseUrl}`, data);
}

export async function getBrandCategories() {
  return client.get(`/brandcategories`);
}

export default {
  getBrand,
  getBrands,
  putBrand,
  postBrand,
  postContact,
  getBrandCategories,
  getBrandsByClientId,
};
