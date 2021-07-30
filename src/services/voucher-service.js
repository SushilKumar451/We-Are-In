import client from './client';
const baseUrl = '/voucher';

export async function getVoucherOverview() {
  return client.get(`${baseUrl}/overview`);
}

export async function getVouchers() {
  return client.get(`${baseUrl}/list`);
}

export async function getVoucher(id) {
  return client.get(`${baseUrl}/${id}`);
}

export async function putVoucher(data) {
  return client.put(`${baseUrl}`, data);
}

export async function postVoucher(data) {
  return client.post(`${baseUrl}`, data);
}

export async function getDetails() {
  return client.get(`/voucherdetails`);
}

export async function getVoucherCategories() {
  return client.get(`/vouchercategories`);
}

export async function getAmenities() {
  return client.get(`/amenities`);
}

export default {
  getVoucher,
  getVouchers,
  putVoucher,
  getDetails,
  postVoucher,
  getAmenities,
  getVoucherOverview,
  getVoucherCategories,
};
