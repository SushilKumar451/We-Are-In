import client from './client';
const baseUrl = 'client';

export async function getClients() {
  return client.get(`/${baseUrl}s`);
}

export async function getClient(id) {
  return client.get(`/${baseUrl}/${id}`);
}

export async function putClient(data) {
  return client.put(`/${baseUrl}`, data);
}

export async function postClient(data) {
  return client.post(`/${baseUrl}`, data);
}

export async function postContact(data) {
  return client.post(`/contacts/${baseUrl}`, data);
}

export async function getClientCategories() {
  return client.get(`/clientcategories`);
}

export default {
  getClient,
  getClients,
  putClient,
  postClient,
  postContact,
  getClientCategories,
};
