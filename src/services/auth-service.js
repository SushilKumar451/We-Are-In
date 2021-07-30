import jwtDecode from 'jwt-decode';
import client from './client';

const tokenKey = 'vms-token';
const isAdminKey = 'voucher-admin';
//client.setJwt(getJwt());

export async function login(username, password) {
  return client.post('/user/login', {
    username,
    password,
  });
}

export function storeJwt(jwt) {
  localStorage.setItem(tokenKey, JSON.stringify(jwt));
  client.setJwt(jwt.token);
}

export function storeAdminRole(isAdmin) {
  localStorage.setItem(isAdminKey, JSON.stringify(isAdmin));
}

export function logOut() {
  client.setJwt(null);
  localStorage.clear();
}

export function getCurrentUser() {
  try {
    const { id, imageUrl, name, token, username } = getJwt();
    client.setJwt(token);
    return { token: jwtDecode(token), id, imageUrl, name, username };
  } catch (ex) {
    return null;
  }
}

export function getJwt() {
  return JSON.parse(localStorage.getItem(tokenKey));
}

export function getAdminRole() {
  return JSON.parse(localStorage.getItem(isAdminKey));
}

export default {
  login,
  storeJwt,
  logOut,
  getJwt,
  getAdminRole,
  getCurrentUser,
  storeAdminRole,
};
