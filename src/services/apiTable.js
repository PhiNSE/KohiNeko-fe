import { DEFAULT_API_URL } from "../utils/appConstants";
export async function getTablesInArea([
  coffeeShopId,
  areaId,
  startTime,
  endTime,
  date,
]) {
  const url = `/coffeeShops/${coffeeShopId}/areas/${areaId}/tableTypes`;

  const params = new URLSearchParams({
    startTime,
    endTime,
    date,
  });

  const options = {
    method: "GET",
    headers: { "Content-Type": `application/json` },
  };

  const response = await fetch(
    `${DEFAULT_API_URL}${url}?${params.toString()}`,
    options
  );
  const data = await response.json();
  return data;
}

export async function getTableTypesInShop(coffeeShopId) {
  const url = `/tableTypes/coffeeShops/${coffeeShopId}`;
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

export async function getAllTablesInArea(areaId) {
  const url = `/tables/areas/${areaId}`;
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

export async function searchTable([coffeeShopId, keyword, searchBy]) {
  const params = {};
  params[searchBy] = keyword;
  const url = `/tableTypes/coffeeShops/${coffeeShopId}/search?${new URLSearchParams(
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

export async function addTable([areaId, tableTypeId, table]) {
  const url = `/tables/areas/${areaId}/tableType/${tableTypeId}`;
  const token = localStorage.getItem("Authorization");

  const options = {
    method: "POST",
    headers: { Authorization: token, "Content-Type": `application/json` },
    body: JSON.stringify(table),
  };

  const response = await fetch(DEFAULT_API_URL + url, options);
  const data = await response.json();
  return data;
}

export async function deleteTable(tableId) {
  const url = `/tables/${tableId}`;
  const token = localStorage.getItem("Authorization");

  const options = {
    method: "DELETE",
    headers: { Authorization: token, "Content-Type": `application/json` },
  };

  const response = await fetch(DEFAULT_API_URL + url, options);
  const data = await response.json();
  return data;
}

export async function addTableType(table) {
  const url = `/tableTypes`;
  const token = localStorage.getItem("Authorization");

  const options = {
    method: "POST",
    headers: { Authorization: token, "Content-Type": `application/json` },
    body: JSON.stringify(table),
  };

  const response = await fetch(DEFAULT_API_URL + url, options);
  const data = await response.json();
  return data;
}

export async function updateTableType(table) {
  const url = `/tableTypes/${table._id}`;
  const token = localStorage.getItem("Authorization");

  const options = {
    method: "PATCH",
    headers: { Authorization: token, "Content-Type": `application/json` },
    body: JSON.stringify(table),
  };

  const response = await fetch(DEFAULT_API_URL + url, options);
  const data = await response.json();
  return data;
}

export async function deleteTableType(tableId) {
  const url = `/tableTypes/${tableId}`;
  const token = localStorage.getItem("Authorization");

  const options = {
    method: "DELETE",
    headers: { Authorization: token, "Content-Type": `application/json` },
  };

  const response = await fetch(DEFAULT_API_URL + url, options);
  const data = await response.json();
  return data;
}
