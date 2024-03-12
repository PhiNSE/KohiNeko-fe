import { DEFAULT_API_URL } from "../utils/appConstants";

export async function login(body) {
  const url = "/auth/login";

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };

  const response = await fetch(DEFAULT_API_URL + url, options);
  const data = await response.json();
  return data;
}

export async function signup(body) {
  const url = "/users";

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };

  const response = await fetch(DEFAULT_API_URL + url, options);
  const data = await response.json();
  return data;
}

export async function logout() {
  const url = "/auth/logout";
  const token = localStorage.getItem("Authorization");

  const options = {
    method: "POST",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
  };

  const response = await fetch(DEFAULT_API_URL + url, options);
  const data = await response.json();
  return data;
}

export async function getRefreshToken() {
  const url = "/auth/refresh-token";
  const token = localStorage.getItem("Authorization");

  const options = {
    method: "POST",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
  };

  const response = await fetch(DEFAULT_API_URL + url, options);
  console.log(response);
  // if (!response.ok) {
  //   throw new Error(response);
  // }

  const data = await response.json();
  console.log(data);
  console.log(data.status);
  if (data.status === "fail") {
    throw new Error("Refresh token is expired");
  }
  // if (!response.ok) {
  //   throw new Error(response);
  // }
  console.log(data);
  return data.data.accessToken; // Replace 'newToken' with the actual property name of the new token in the response
}

export async function googleLogin() {
  const url = "/auth/google";

  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const response = await fetch(DEFAULT_API_URL + url, options);
  const data = await response.json();
  return data;
}

export async function googleLoginCallback(googleParams) {
  const url = `/auth/login/google/callback?${googleParams.toString()}`;

  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const response = await fetch(DEFAULT_API_URL + url, options);
  const data = await response.json();
  return data;
}
