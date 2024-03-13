import { DEFAULT_API_URL } from "../utils/appConstants";

export async function getItemsInShop(coffeeShopId) {
  const url = `/coffeeShops/${coffeeShopId}/items`;

  const options = {
    method: "GET",
    headers: {},
    params: {},
  };

  const response = await fetch(DEFAULT_API_URL + url, options);
  const data = await response.json();
  return data;
}

export async function getAllItemTypes() {
  const url = `/itemTypes`;

  const options = {
    method: "GET",
    headers: {},
    params: {},
  };

  const response = await fetch(DEFAULT_API_URL + url, options);
  const data = await response.json();
  return data;
}

export async function searchItem([coffeeShopId, keyword, searchBy]) {
  const params = {};
  params[searchBy] = keyword;
  const url = `/items/search/coffeeShops/${coffeeShopId}?${new URLSearchParams(
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

export async function createItem([shopId, item]) {
  const url = `/coffeeShops/${shopId}/items`;
  const token = localStorage.getItem("Authorization");

  const options = {
    method: "POST",
    headers: { Authorization: token, "Content-Type": `application/json` },
    body: JSON.stringify(item),
  };

  const response = await fetch(DEFAULT_API_URL + url, options);
  const data = await response.json();
  return data;
}

export async function updateItem([item, itemId]) {
  const url = `/items/${itemId}`;
  const token = localStorage.getItem("Authorization");

  const options = {
    method: "PATCH",
    headers: { Authorization: token, "Content-Type": `application/json` },
    body: JSON.stringify(item),
  };

  const response = await fetch(DEFAULT_API_URL + url, options);
  const data = await response.json();
  return data;
}

export async function deleteItem([shopId, itemId]) {
  const url = `/coffeeShops/${shopId}/items/${itemId}`;
  const token = localStorage.getItem("Authorization");

  const options = {
    method: "DELETE",
    headers: { Authorization: token, "Content-Type": `application/json` },
  };

  const response = await fetch(DEFAULT_API_URL + url, options);
  const data = await response.json();
  return data;
}

export async function createInvoice(invoice) {
  const url = "/invoices";

  const options = {
    method: "POST",
    headers: {},
    params: {},
    body: JSON.stringify(invoice),
  };

  const response = await fetch(DEFAULT_API_URL + url, options);
  const data = await response.json();
  return data;
}
