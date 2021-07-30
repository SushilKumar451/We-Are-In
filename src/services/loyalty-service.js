import client from './client';
const baseUrl = 'loyalty';

export async function getLoyalties() {
  return client.get(`/${baseUrl}/list`);
}

export async function getLoyalty(id) {
  return client.get(`/${baseUrl}/${id}`);
}

export async function putLoyalty(data) {
  return client.put(`/${baseUrl}`, data);
}

export async function postLoyalty(data) {
  return client.post(`/${baseUrl}`, data);
}

export async function postContact(data) {
  return client.post(`/contacts/${baseUrl}`, data);
}

export async function getLoyaltyOverview() {
  return client.get(`/${baseUrl}/overview`);
}

export async function getLoyaltyStatus() {
  return client.get(`/loyaltystatuses`);
}

export default {
  getLoyalty,
  getLoyalties,
  putLoyalty,
  postLoyalty,
  postContact,
  getLoyaltyStatus,
  getLoyaltyOverview,
};
