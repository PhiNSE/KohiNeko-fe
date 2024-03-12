import { DEFAULT_API_URL } from "../utils/appConstants";

export async function getStaffsByShop(shopId) {
  const url = `/coffeeShops/${shopId}/staffs`;

  const options = {
    method: "GET",
    headers: {},
    params: {},
  };

  const response = await fetch(DEFAULT_API_URL + url, options);
  const data = await response.json();
  return data;
}

export async function addStaff([shopId, staff]) {
  const url = `/coffeeShops/${shopId}/staffs`;
  const token = localStorage.getItem("Authorization");

  const options = {
    method: "POST",
    headers: { Authorization: token, "Content-Type": `application/json` },
    body: JSON.stringify(staff),
  };

  const response = await fetch(DEFAULT_API_URL + url, options);
  const data = await response.json();
  return data;
}

export async function deleteStaff(staffId) {
  const url = `/users/${staffId}`;
  const token = localStorage.getItem("Authorization");

  const options = {
    method: "DELETE",
    headers: { Authorization: token, "Content-Type": `application/json` },
  };

  const response = await fetch(DEFAULT_API_URL + url, options);
  const data = await response.json();
  return data;
}

export async function assignStaffToArea([areaId, staffId, startTime, endTime]) {
  const url = "/areaStaffs";
  const token = localStorage.getItem("Authorization");

  const options = {
    method: "POST",
    headers: { Authorization: token, "Content-Type": `application/json` },
    params: "",
    body: JSON.stringify({ areaId, userId: staffId, startTime, endTime }),
  };

  const response = await fetch(DEFAULT_API_URL + url, options);
  const data = await response.json();
  return data;
}

export async function checkStaffMail(email) {
  if (!email) return;
  const url = `/users/isEmailExist`;
  const token = localStorage.getItem("Authorization");

  const options = {
    method: "POST",
    headers: { Authorization: token, "Content-Type": `application/json` },
    body: JSON.stringify({ email: email }),
  };

  const response = await fetch(DEFAULT_API_URL + url, options);
  const data = await response.json();
  return data;
}
