import client from './client';
const baseUrl = 'subscription';

export async function getRevenueOverview() {
  return client.get(`${baseUrl}/overview`);
}

export async function getRevenues() {
  return client.get(`/${baseUrl}s`);
}

export async function getRevenue(id) {
  return client.get(`/${baseUrl}/${id}`);
}

export default {
  getRevenue,
  getRevenues,
  getRevenueOverview,
};
