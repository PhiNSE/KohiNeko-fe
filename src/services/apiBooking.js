import { DEFAULT_API_URL } from "../utils/appConstants";
import { getRefreshToken } from "./apiLogin";

export async function booking(bookingData) {
  try {
    const url = "/bookings";
    const token = localStorage.getItem("Authorization");

    const options = {
      method: "POST",
      headers: { Authorization: token, "Content-Type": `application/json` },
      params: {},
      body: JSON.stringify(bookingData),
    };

    const response = await fetch(DEFAULT_API_URL + url, options);

    if (!response.ok) {
      if (response.status === 401) {
        const refreshToken = await getRefreshToken();
        if (refreshToken) {
          localStorage.setItem("Authorization", refreshToken);
          localStorage.setItem("refreshToken", refreshToken);
          return booking(bookingData);
        } else {
          console.log("Refresh token is expired");
          throw new Error(response.message);
        }
      }
    }

    const data = await response.json();
    return data;
  } catch (e) {
    console.log(e);
    throw e; // Re-throw the error so it can be caught and handled by the calling code
  }
}

export async function getAvailableTime(booking) {
  const url = "/bookings/available-time";
  const token = localStorage.getItem("Authorization");

  const options = {
    method: "POST",
    headers: { Authorization: token, "Content-Type": `application/json` },
    params: {},
    body: JSON.stringify(booking),
  };

  const response = await fetch(DEFAULT_API_URL + url, options);
  const data = await response.json();
  return data;
}

export async function getBooking(bookingId) {
  const url = `/bookings/${bookingId}`;
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

export async function createBooking(invoice) {
  const url = "/coffeeShops/65ace338f6b4b5eb20c734ae/bookings/payment";
  const token = localStorage.getItem("Authorization");

  const options = {
    method: "POST",
    headers: { Authorization: token, "Content-Type": `application/json` },
    params: {},
    body: JSON.stringify(invoice),
  };

  const response = await fetch(DEFAULT_API_URL + url, options);
  const data = await response.json();
  return data;
}

export async function redirectVnPay(bookingId) {
  const url = `/bookings/${bookingId}/vnPay`;
  const body = {
    bankCode: "",
    language: "vn",
  };

  const options = {
    method: "POST",
    headers: { "Content-Type": `application/json` },
    params: {},
    body: JSON.stringify(body),
  };
  const response = await fetch(DEFAULT_API_URL + url, options);
  const data = await response.json();
  return data;
}

export async function sendVnPayMessage(message) {
  const bookingId = localStorage.getItem("bookingId");
  if (bookingId === null) {
    return;
  }
  const url = `/bookings/${bookingId}/vnpay/return`;

  const options = {
    method: "POST",
    headers: { "Content-Type": `application/json` },
    params: {},
    body: JSON.stringify(message),
  };

  const response = await fetch(DEFAULT_API_URL + url, options);
  const data = await response.json();
  return data;
}

export async function getCustomerBookingHistory(
  page,
  perPage,
  bookingStatus,
  sort,
  key
) {
  const url = `/bookings/my?page=${page}&perPage=${perPage}&bookingStatus=${bookingStatus}&sort=${sort}&key=${key}`;
  const token = localStorage.getItem("Authorization");

  const options = {
    method: "GET",
    params: {},
    headers: { Authorization: token, "Content-Type": `application/json` },
  };
  const response = await fetch(DEFAULT_API_URL + url, options);
  if (!response.ok) {
    if (response.status === 401) {
      const refreshToken = await getRefreshToken();
      if (refreshToken) {
        localStorage.setItem("Authorization", refreshToken);
        localStorage.setItem("refreshToken", refreshToken);
        return getCustomerBookingHistory(page, perPage, bookingStatus);
      } else {
        console.log("Refresh token is expired");
        throw new Error(response.message);
      }
    }
  }
  console.log(response);
  const data = await response.json();
  return data;
}
export async function getRefundBooking(bookingId) {
  const url = `/bookings/refund/${bookingId}`;
  const token = localStorage.getItem("Authorization");

  const options = {
    method: "GET",
    params: {},
    headers: { Authorization: token, "Content-Type": `application/json` },
  };
  const response = await fetch(DEFAULT_API_URL + url, options);
  if (!response.ok) {
    if (response.status === 401) {
      const refreshToken = await getRefreshToken();
      if (refreshToken) {
        localStorage.setItem("Authorization", refreshToken);
        localStorage.setItem("refreshToken", refreshToken);
        return getRefundBooking(bookingId);
      } else {
        console.log("Refresh token is expired");
        throw new Error(response.message);
      }
    }
  }
  const data = await response.json();
  return data;
}

export async function cancelBooking(bookingId) {
  const url = `/bookings/refund/${bookingId}`;
  const token = localStorage.getItem("Authorization");

  const options = {
    method: "POST",
    params: {},
    headers: { Authorization: token, "Content-Type": `application/json` },
  };
  const response = await fetch(DEFAULT_API_URL + url, options);
  const data = await response.json();
  return data;
}

export async function purchaseBookingByWallet(bookingId) {
  const url = `/bookings/payment/${bookingId}`;
  const token = localStorage.getItem("Authorization");

  const options = {
    method: "POST",
    params: {},
    headers: { Authorization: token, "Content-Type": `application/json` },
  };
  const response = await fetch(DEFAULT_API_URL + url, options);
  const data = await response.json();
  return data;
}

export async function countTotalBookingByStatus(bookingStatus, key) {
  // console.log(bookingStatus, key, "bookingStatus");
  const url = `/bookings/my/total?status=${bookingStatus}&key=${key}`;
  const token = localStorage.getItem("Authorization");

  const options = {
    method: "GET",
    params: {},
    headers: { Authorization: token, "Content-Type": `application/json` },
  };
  const response = await fetch(DEFAULT_API_URL + url, options);
  if (!response.ok) {
    if (response.status === 401) {
      const refreshToken = await getRefreshToken();
      if (refreshToken) {
        localStorage.setItem("Authorization", refreshToken);
        localStorage.setItem("refreshToken", refreshToken);
        return countTotalBookingByStatus(bookingStatus);
      } else {
        console.log("Refresh token is expired");
        throw new Error(response.message);
      }
    }
  }
  const data = await response.json();
  return data;
}

export async function getCoffeeShopBookingHistory(
  page,
  perPage,
  bookingStatus,
  sort,
  key
) {
  const url = `/bookings/CoffeeShop/data?page=${page}&perPage=${perPage}&bookingStatus=${bookingStatus}&sort=${sort}&key=${key}`;
  const token = localStorage.getItem("Authorization");

  const options = {
    method: "GET",
    params: {},
    headers: { Authorization: token, "Content-Type": `application/json` },
  };
  const response = await fetch(DEFAULT_API_URL + url, options);
  if (!response.ok) {
    if (response.status === 401) {
      const refreshToken = await getRefreshToken();
      if (refreshToken) {
        localStorage.setItem("Authorization", refreshToken);
        localStorage.setItem("refreshToken", refreshToken);
        return getCustomerBookingHistory(page, perPage, bookingStatus);
      } else {
        console.log("Refresh token is expired");
        throw new Error(response.message);
      }
    }
  }
  console.log(response);
  const data = await response.json();
  console.log(data, "data");
  return data;
}

export async function getTotalCoffeeShopBookingHistory(
  bookingStatus,
  sort,
  key
) {
  console.log(bookingStatus, key, "bookingStatus");
  const url = `/bookings/CoffeeShop/data/count?bookingStatus=${bookingStatus}&sort=${sort}&key=${key}`;
  const token = localStorage.getItem("Authorization");

  const options = {
    method: "GET",
    params: {},
    headers: { Authorization: token, "Content-Type": `application/json` },
  };
  const response = await fetch(DEFAULT_API_URL + url, options);
  if (!response.ok) {
    if (response.status === 401) {
      const refreshToken = await getRefreshToken();
      if (refreshToken) {
        localStorage.setItem("Authorization", refreshToken);
        localStorage.setItem("refreshToken", refreshToken);
        return getCustomerBookingHistory(bookingStatus);
      } else {
        console.log("Refresh token is expired");
        throw new Error(response.message);
      }
    }
  }
  console.log(response);
  const data = await response.json();
  return data;
}

export async function getBookingByShop(page = 1, perPage = 5) {
  const url = `/bookings/coffeeShop/data?page=${page}&perPage=${perPage}`;
  const token = localStorage.getItem("Authorization");

  const options = {
    method: "GET",
    params: {},
    headers: { Authorization: token, "Content-Type": "application/json" },
  };

  const response = await fetch(DEFAULT_API_URL + url, options);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  return data;
}

export async function managerGetBookingHistory(
  page,
  perPage,
  bookingStatus,
  sort,
  key
) {
  const url = `/bookings/CoffeeShop/data?page=${page}&perPage=${perPage}&bookingStatus=${bookingStatus}&sort=${sort}&key=${key}`;
  const token = localStorage.getItem("Authorization");
  console.log(url, "url");
  const options = {
    method: "GET",
    params: {},
    headers: { Authorization: token, "Content-Type": `application/json` },
  };
  const response = await fetch(DEFAULT_API_URL + url, options);
  if (!response.ok) {
    if (response.status === 401) {
      const refreshToken = await getRefreshToken();
      if (refreshToken) {
        localStorage.setItem("Authorization", refreshToken);
        localStorage.setItem("refreshToken", refreshToken);
        return getCustomerBookingHistory(page, perPage, bookingStatus);
      } else {
        console.log("Refresh token is expired");
        throw new Error(response.message);
      }
    }
  }
  console.log(response);
  const data = await response.json();
  console.log(data, "data");
  return data;
}

export async function managerGetTotalCoffeeShopBookingHistory(
  bookingStatus,
  sort,
  key
) {
  console.log(bookingStatus, key, "bookingStatus");
  const url = `/bookings/CoffeeShop/data/count?bookingStatus=${bookingStatus}&sort=${sort}&key=${key}`;
  const token = localStorage.getItem("Authorization");

  const options = {
    method: "GET",
    params: {},
    headers: { Authorization: token, "Content-Type": `application/json` },
  };
  const response = await fetch(DEFAULT_API_URL + url, options);
  if (!response.ok) {
    if (response.status === 401) {
      const refreshToken = await getRefreshToken();
      if (refreshToken) {
        localStorage.setItem("Authorization", refreshToken);
        localStorage.setItem("refreshToken", refreshToken);
        return getCustomerBookingHistory(bookingStatus);
      } else {
        console.log("Refresh token is expired");
        throw new Error(response.message);
      }
    }
  }
  console.log(response);
  const data = await response.json();
  return data;
}
