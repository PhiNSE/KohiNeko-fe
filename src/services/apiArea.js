import { DEFAULT_API_URL } from "../utils/appConstants";

export async function getAreasInAShop(coffeeShopId) {
  const url = `/coffeeShops/${coffeeShopId}/areas`;

  const options = {
    method: "GET",
    headers: {},
    params: {},
  };

  const response = await fetch(DEFAULT_API_URL + url, options);
  const data = await response.json();
  return data;
}

export async function getAreaById([coffeeShopId, areaId]) {
  const url = `/coffeeShops/${coffeeShopId}/areas/${areaId}`;

  const options = {
    method: "GET",
    headers: {},
  };

  const response = await fetch(DEFAULT_API_URL + url, options);
  const data = await response.json();
  return data;
}

export async function getCatsInArea([coffeeShopId, areaId]) {
  // const url = `/coffeeShops/${coffeeShopId}/area/${areaId}/cats`;
  const url = `/coffeeShops/${coffeeShopId}/areas/${areaId}/cats`;

  const options = {
    method: "GET",
    headers: {},
    params: {},
  };

  const response = await fetch(DEFAULT_API_URL + url, options);
  const data = await response.json();
  return data;
}

export async function getStaffsInArea([coffeeShopId, areaId]) {
  const url = `/coffeeShops/${coffeeShopId}/area/${areaId}/staffs`;

  const options = {
    method: "GET",
    headers: {},
    params: {},
  };

  const response = await fetch(DEFAULT_API_URL + url, options);
  const data = await response.json();
  return data;
}

export async function createArea([coffeeShopId, area]) {
  const url = `/coffeeShops/${coffeeShopId}/areas`;
  const token = localStorage.getItem("Authorization");

  const options = {
    method: "POST",
    headers: {Authorization: token, "Content-Type": `application/json`},
    body: JSON.stringify(area),
  };

  const response = await fetch(DEFAULT_API_URL + url, options);
  const data = await response.json();
  return data;
}

export async function updateArea([area, coffeeShopId, areaId]) {
  const url = `/coffeeShops/${coffeeShopId}/areas/${areaId}`;
  const token = localStorage.getItem("Authorization");

  const options = {
    method: "PATCH",
    headers: {Authorization: token, "Content-Type": `application/json`},
    body: JSON.stringify(area),
  };

  const response = await fetch(DEFAULT_API_URL + url, options);
  const data = await response.json();
  return data;
}

export async function deleteArea([coffeeShopId, areaId]) {
  const url = `/coffeeShops/${coffeeShopId}/areas/${areaId}`;
  const token = localStorage.getItem("Authorization");

  const options = {
    method: "DELETE",
    headers: {Authorization: token, "Content-Type": `application/json`},
  };

  const response = await fetch(DEFAULT_API_URL + url, options);
  const data = await response.json();
  return data;
}
