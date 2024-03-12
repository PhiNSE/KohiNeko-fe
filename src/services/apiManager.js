import { DEFAULT_API_URL } from "../utils/appConstants";

export async function getManagers() {
  const url = `/users?role=shopManager`;
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

export async function searchManagers([keyword, searchBy]) {
  const token = localStorage.getItem("Authorization");
  const params = {};
  params[searchBy] = keyword;

  const options = {
    method: "GET",
    headers: { Authorization: token },
  };

  const url = `/users?role=shopManager&${new URLSearchParams(
    params
  ).toString()}`;
  const response = await fetch(DEFAULT_API_URL + url, options);
  const data = await response.json();
  return data;
}

export async function addManager(manager) {
  const url = `/users`;
  const token = localStorage.getItem("Authorization");

  const options = {
    method: "POST",
    headers: { Authorization: token, "Content-Type": `application/json` },
    body: JSON.stringify(manager),
  };

  const response = await fetch(DEFAULT_API_URL + url, options);
  const data = await response.json();
  return data;
}

export async function deleteManager(managerId) {
  const url = `/users/${managerId}`;
  const token = localStorage.getItem("Authorization");

  const options = {
    method: "DELETE",
    headers: { Authorization: token, "Content-Type": `application/json` },
  };

  const response = await fetch(DEFAULT_API_URL + url, options);
  const data = await response.json();
  return data;
}
