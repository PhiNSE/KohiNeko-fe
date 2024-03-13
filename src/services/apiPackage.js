import { DEFAULT_API_URL } from "../utils/appConstants";

export async function getAllPackages() {
  const url = `/packages`;

  const options = {
    method: "GET",
    headers: {},
    params: {},
  };

  const response = await fetch(DEFAULT_API_URL + url, options);
  const data = await response.json();
  return data;
}

export async function getPackageByShop() {
  const url = `/packageSubscriptions/coffeeShop/current`;
  const token = localStorage.getItem("Authorization");

  const options = {
    method: "GET",
    headers: { Authorization: token },
    params: {},
  };

  const response = await fetch(DEFAULT_API_URL + url, options);
  const data = await response.json();
  return data;
}
export async function subscribePackage(pkc) {
  const url = `/packageSubscriptions`;

  const options = {
    method: "POST",
    headers: {},
    body: JSON.stringify(pkc),
  };

  const response = await fetch(DEFAULT_API_URL + url, options);
  const data = await response.json();
  return data;
}

export async function redirectVnPay(packageId) {
  const url = `/packages/${packageId}/vnPay`;
  const token = localStorage.getItem("Authorization");
  const body = {
    bankCode: "",
    language: "vn",
  };

  const options = {
    method: "POST",
    headers: { Authorization: token, "Content-Type": `application/json` },
    params: {},
    body: JSON.stringify(body),
  };
  const response = await fetch(DEFAULT_API_URL + url, options);
  const data = await response.json();
  return data;
}

export async function sendVnPayMessage(message) {
  const packageId = localStorage.getItem("packageId");
  if (!packageId) {
    return;
  }
  const url = `/packages/${packageId}/vnpay/return`;
  const token = localStorage.getItem("Authorization");

  const options = {
    method: "POST",
    headers: { Authorization: token, "Content-Type": `application/json` },
    body: JSON.stringify(message),
  };

  const response = await fetch(DEFAULT_API_URL + url, options);
  const data = await response.json();
  return data;
}
