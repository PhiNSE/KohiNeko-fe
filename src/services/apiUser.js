import { DEFAULT_API_URL } from '../utils/appConstants';
import { getRefreshToken } from './apiLogin';

export async function updateUserProfile(userId, userData) {
  const url = `/users/${userId}`;
  const token = localStorage.getItem("Authorization");
  const options = {
    method: "PATCH",
    headers: { Authorization: token, "Content-Type": `application/json` },
    body: JSON.stringify(userData),
  };
  const response = await fetch(DEFAULT_API_URL + url, options);
  if (!response.ok) {
    if (response.status === 401) {
      const refreshToken = await getRefreshToken();
      if (refreshToken) {
        localStorage.setItem("Authorization", refreshToken);
        localStorage.setItem("refreshToken", refreshToken);
        return updateUserProfile(userId, userData);
      } else {
        console.log("Refresh token is expired");
        throw new Error(response.message);
      }
    }
  }

  const result = await response.json();
  console.log(result);
  return result;
}

export async function getUserWallet() {
  const url = '/users/wallet/get-wallet';
  const token = localStorage.getItem('Authorization');

  const options = {
    method: 'GET',
    headers: { Authorization: token, 'Content-Type': `application/json` },
    params: {},
  };

  const response = await fetch(DEFAULT_API_URL + url, options);

  if (!response.ok) {
    if (response.status === 401) {
      const refreshToken = await getRefreshToken();
      if (refreshToken) {
        localStorage.setItem('Authorization', refreshToken);
        localStorage.setItem('refreshToken', refreshToken);
        return getUserWallet();
      } else {
        console.log('Refresh token is expired');
        throw new Error(response.message);
      }
    }
  }

  const data = await response.json();

  return data;
}

export async function updateUser(user) {
  const url = `/users/${user._id}`;
  const token = localStorage.getItem("Authorization");

  const options = {
    method: "PATCH",
    headers: { Authorization: token, "Content-Type": `application/json` },
    params: {},
    body: JSON.stringify(user),
  };

  const response = await fetch(DEFAULT_API_URL + url, options);
  return response.json();
}
