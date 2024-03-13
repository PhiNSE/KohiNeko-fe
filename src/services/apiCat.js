import { DEFAULT_API_URL } from "../utils/appConstants";

export async function getCats() {
  const url = "/cats";

  const options = {
    method: "GET",
    headers: {},
    params: {},
  };

  const response = await fetch(DEFAULT_API_URL + url, options);
  const data = await response.json();
  return data;
}

export async function get1Cat([coffeeShopId, catId]) {
  const url = `/coffeeShops/${coffeeShopId}/cats/${catId}`;
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

export async function searchCat([coffeeShopId, keyword, searchBy]) {
  const params = {};
  params[searchBy] = keyword;
  const url = `/coffeeShops/${coffeeShopId}/cats/search?${new URLSearchParams(
    params
  ).toString()}`;
  // const url = `/coffeeShops/${coffeeShopId}/cats/search?keyword=${keyword}`
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

export async function getCatsInArea(areaId) {
  const url = `cat/?areaId=${areaId}`;

  const options = {
    method: "GET",
    headers: {},
    params: {},
  };

  const response = await fetch(DEFAULT_API_URL + url, options);
  const data = await response.json();
  return data;
}

export async function addCat([cat, shopId]) {
  const url = `/coffeeShops/${shopId}/cats`;
  const token = localStorage.getItem("Authorization");
  const body = {
    ...cat,
    coffeeShopId: shopId,
  };

  const options = {
    method: "POST",
    headers: { Authorization: token, "Content-Type": `application/json` },
    params: "",
    body: JSON.stringify(body),
  };

  const response = await fetch(DEFAULT_API_URL + url, options);
  const data = await response.json();
  return data;
}

export async function updateCat([cat, shopId, catId]) {
  const url = `/coffeeShops/${shopId}/cats/${catId}`;
  const token = localStorage.getItem("Authorization");

  const options = {
    method: "PATCH",
    headers: { Authorization: token, "Content-Type": `application/json` },
    params: "",
    body: JSON.stringify(cat),
  };

  const response = await fetch(DEFAULT_API_URL + url, options);
  const data = await response.json();
  return data;
}

export async function deleteCat([shopId, catId]) {
  const url = `/coffeeShops/${shopId}/cats/${catId}`;
  const token = localStorage.getItem("Authorization");

  const options = {
    method: "DELETE",
    headers: { Authorization: token, "Content-Type": `application/json` },
    params: "",
  };

  const response = await fetch(DEFAULT_API_URL + url, options);
  const data = await response.json();
  return data;
}

export async function assignCatToArea([areaId, catId, startTime, endTime]) {
  const url = "/areaCats";
  const token = localStorage.getItem("Authorization");

  const options = {
    method: "POST",
    headers: { Authorization: token, "Content-Type": `application/json` },
    params: "",
    body: JSON.stringify({ areaId, catId, startTime, endTime }),
  };

  const response = await fetch(DEFAULT_API_URL + url, options);
  const data = await response.json();
  return data;
}

export async function adminGetCat() {
  const url = `/areaCats`;
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

//* Get Cat By CF Shop
export async function getCatByShop(shopId) {
  const url = `/coffeeShops/${shopId}/cats`;

  const options = {
    method: "GET",
    headers: {},
    params: {},
  };

  const response = await fetch(DEFAULT_API_URL + url, options);
  const data = await response.json();
  return data;
}

//* Get Cat Details in a CFSHOP
export async function getCatDetails(shopId, catId) {
  const url = `/coffeeShops/${shopId}/cats/${catId}`;
  const options = {
    method: "GET",
    headers: {},
    params: {},
  };

  const response = await fetch(DEFAULT_API_URL + url, options);
  const data = await response.json();
  return data;
}
