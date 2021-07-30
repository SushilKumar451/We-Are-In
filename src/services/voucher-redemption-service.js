import client from './client';
const baseUrl = 'receipt';

export async function getReceiptOverview() {
  return client.get(`${baseUrl}/overview`);
}

export async function getReceipts() {
  return client.get(`/${baseUrl}s`);
}

export async function getReceipt(id) {
  return client.get(`/${baseUrl}/${id}`);
}

export default {
  getReceipt,
  getReceipts,
  getReceiptOverview,
};
