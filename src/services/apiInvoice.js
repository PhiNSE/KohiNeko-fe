import { DEFAULT_API_URL } from "../utils/appConstants";
import { getRefreshToken } from "./apiLogin";

export async function redirectVnPay(bookingId, invoiceItems) {
  const url = `/vnpay/${bookingId.bookingId}/invoice_offline`;
  console.log(bookingId, "bookingId");
  const body = {
    bankCode: "",
    language: "vn",
    invoiceItems: invoiceItems,
  };
  console.log(body, "body");
  const options = {
    method: "POST",
    headers: {
      "Content-Type": `application/json`,
      Authorization: localStorage.getItem("Authorization"),
    },
    params: {},
    body: JSON.stringify(body),
  };
  const response = await fetch(DEFAULT_API_URL + url, options);
  if (!response.ok) {
    if (response.status === 401) {
      const refreshToken = await getRefreshToken();
      if (refreshToken) {
        localStorage.setItem("Authorization", refreshToken);
        localStorage.setItem("refreshToken", refreshToken);
        return redirectVnPay(bookingId, invoiceItems);
      } else {
        console.log("Refresh token is expired");
        throw new Error(response.message);
      }
    }
  }
  const data = await response.json();
  return data;
}

export async function sendVnPayMessage(message, bookingId) {
  if (bookingId === null) {
    return;
  }
  const url = `/vnPay/${bookingId}/invoice_offline/return`;

  const options = {
    method: "POST",
    headers: {
      "Content-Type": `application/json`,
      Authorization: localStorage.getItem("Authorization"),
    },
    params: {},
    body: JSON.stringify(message),
  };

  const response = await fetch(DEFAULT_API_URL + url, options);
  if (!response.ok) {
    if (response.status === 401) {
      const refreshToken = await getRefreshToken();
      if (refreshToken) {
        localStorage.setItem("Authorization", refreshToken);
        localStorage.setItem("refreshToken", refreshToken);
        return sendVnPayMessage(message);
      } else {
        console.log("Refresh token is expired");
        throw new Error(response.message);
      }
    }
  }
  const data = await response.json();
  return data;
}

export async function createInvoice(bookingId, invoice) {
  const url = `/invoices/bookings/${bookingId.bookingId}`;
  console.log(bookingId, "bookingId");
  console.log(url);
  const body = {
    invoiceItems: invoice,
  };
  const options = {
    method: "POST",
    headers: {
      "Content-Type": `application/json`,
      Authorization: localStorage.getItem("Authorization"),
    },
    params: {},
    body: JSON.stringify(body),
  };

  const response = await fetch(DEFAULT_API_URL + url, options);
  if (!response.ok) {
    if (response.status === 401) {
      const refreshToken = await getRefreshToken();
      if (refreshToken) {
        localStorage.setItem("Authorization", refreshToken);
        localStorage.setItem("refreshToken", refreshToken);
        return createInvoice(bookingId, invoice);
      } else {
        console.log("Refresh token is expired");
        throw new Error(response.message);
      }
    }
  }
  const data = await response.json();
  return data;
}
