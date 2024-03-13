import { DEFAULT_API_URL } from "../utils/appConstants";

export async function getAllShop() {
  const url = "/coffeeShops/total/active";
  const token = localStorage.getItem("Authorization");

  const options = {
    method: "GET",
    headers: { Authorization: token, "Content-Type": `application/json` },
    params: {},
  };

  const response = await fetch(DEFAULT_API_URL + url, options);
  const data = await response.json();
  return data;
}

export async function getShops(page, perPage, key, city, district) {
  // console.log("getShops", page, perPage, key, city, district);
  console.log("run");
  if (city === undefined) city = "";
  if (district === undefined) district = "";
  const response = await fetch(
    `${DEFAULT_API_URL}/coffeeShops?page=${page}&perPage=${perPage}&key=${key}&city=${encodeURIComponent(
      city
    )}&district=${encodeURIComponent(district)}`
  );
  const dataObj = await response.json();
  console.log(response, dataObj);
  const shops = dataObj.data;
  const responseTotal = await fetch(
    `${DEFAULT_API_URL}/coffeeShops/total/count?keyword=${key}&city=${encodeURIComponent(
      city
    )}&district=${encodeURIComponent(district)}`
  );
  const dataTotal = await responseTotal.json();
  const total = dataTotal.data;
  return { shops, total };
}
export async function getShopByAdmin() {
  const url = "/admin/coffeeShops";
  const token = localStorage.getItem("Authorization");

  const options = {
    method: "GET",
    headers: { Authorization: token, "Content-Type": `application/json` },
  };
  const response = await fetch(DEFAULT_API_URL + url, options);

  const data = await response.json();
  return data;
}

export async function approveShop([shopId, isApprove]) {
  const url = `/admin/coffeeShops/${shopId}`;
  const token = localStorage.getItem("Authorization");

  const options = {
    method: "PATCH",
    headers: { Authorization: token, "Content-Type": `application/json` },
    body: JSON.stringify({ approve: isApprove }),
  };
  const response = await fetch(DEFAULT_API_URL + url, options);

  const data = await response.json();
  return data;
}

export async function getShopById(id) {
  const response = await fetch(`${DEFAULT_API_URL}/coffeeShops/${id}`);
  const dataObj = await response.json();
  const data = dataObj.data;
  return data;
}

export async function getShopByUserId() {
  const url = "/coffeeShops/my";
  const token = localStorage.getItem("Authorization");

  const options = {
    method: "GET",
    headers: { Authorization: token, "Content-Type": `application/json` },
  };

  const response = await fetch(DEFAULT_API_URL + url, options);
  const data = await response.json();
  return data;
}

export async function createShop(shop) {
  const url = "/coffeeShops";
  const token = localStorage.getItem("Authorization");

  const options = {
    method: "POST",
    headers: { Authorization: token, "Content-Type": `application/json` },
    body: JSON.stringify(shop),
  };

  const response = await fetch(DEFAULT_API_URL + url, options);
  const data = await response.json();
  return data;
}

export async function updateShop([shop, shopId]) {
  const url = `/coffeeShops/${shopId}`;
  const token = localStorage.getItem("Authorization");

  const options = {
    method: "PATCH",
    headers: { Authorization: token, "Content-Type": `application/json` },
    body: JSON.stringify(shop),
  };

  const response = await fetch(DEFAULT_API_URL + url, options);
  const data = await response.json();
  return data;
}

export async function getOpenAndCloseTime(shopId, date) {
  const url = "/coffeeShops/" + shopId + "/openAndCloseTime";
  const token = localStorage.getItem("Authorization");

  const options = {
    method: "POST",
    headers: { Authorization: token, "Content-Type": `application/json` },
    body: JSON.stringify({ date: date }),
  };

  const response = await fetch(DEFAULT_API_URL + url, options);
  const data = await response.json();
  return data;
}
