import client from './client';
const baseUrl = '/customer';

export async function getCustomerOverview() {
  return client.get(`${baseUrl}/overview`);
}

export async function getCustomers() {
  return client.get(`${baseUrl}/list`);
}

export async function getCustomer(id) {
  return client.get(`${baseUrl}/${id}`);
}

export async function putCustomer(data) {
  return client.put(`${baseUrl}`, data);
}

export async function postCustomer(data) {
  return client.post(`${baseUrl}`, data);
}

export async function getCustomerStatus() {
  return client.get(`/customerstatuses`);
}

export default {
  getCustomer,
  getCustomers,
  putCustomer,
  postCustomer,
  getCustomerStatus,
  getCustomerOverview,
};
