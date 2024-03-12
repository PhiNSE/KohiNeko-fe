import { DEFAULT_API_URL } from "../utils/appConstants";

export async function createShopImage([shopId, images]) {
  const url = `/coffeeShops/${shopId}/images`;
  const token = localStorage.getItem("Authorization");

  const formData = new FormData();
  images.forEach((image, idx) => {
    console.log(image);
    formData.append("images", image);
  });

  const options = {
    method: "POST",
    headers: { Authorization: token },
    body: formData,
  };

  const response = await fetch(DEFAULT_API_URL + url, options);
  const data = await response.json();
  return data;
}

export async function deleteShopImage([shopId, images]) {
  const url = `/coffeeShops/${shopId}/images`;
  const token = localStorage.getItem("Authorization");
  const body = {images: images}

  const options = {
    method: "DELETE",
    headers: { Authorization: token, "Content-Type": `application/json`},
    body: JSON.stringify(body),
  };

  const response = await fetch(DEFAULT_API_URL + url, options);
  const data = await response.json();
  return data;
}

export async function createAreaImage([shopId, areaId, images]) {
  const url = `/coffeeShops/${shopId}/areas/${areaId}/image`;
  const token = localStorage.getItem("Authorization");

  const formData = new FormData();
  formData.append("image", images[0]);

  const options = {
    method: "POST",
    headers: { Authorization: token },
    body: formData,
  };

  const response = await fetch(DEFAULT_API_URL + url, options);
  const data = await response.json();
  return data;
}

export async function deleteAreaImage([shopId, areaId, imageId]) {
  const url = `/coffeeShops/${shopId}/areas/${areaId}/image/${imageId}`;
  const token = localStorage.getItem("Authorization");

  const options = {
    method: "DELETE",
    headers: { Authorization: token },
  };

  const response = await fetch(DEFAULT_API_URL + url, options);
  const data = await response.json();
  return data;
}

export async function createCatImage([shopId, catId, images]) {
  const url = `/coffeeShops/${shopId}/cats/${catId}/images`;
  const token = localStorage.getItem("Authorization");

  const formData = new FormData();
  images.forEach((image, idx) => {
    formData.append("images", image);
  });

  const options = {
    method: "POST",
    headers: { Authorization: token },
    body: formData,
  };

  const response = await fetch(DEFAULT_API_URL + url, options);
  const data = await response.json();
  return data;
}

export async function deleteCatImage([shopId, catId, imageId]) {
  const url = `/coffeeShops/${shopId}/cats/${catId}/images/${imageId}`;
  const token = localStorage.getItem("Authorization");

  const options = {
    method: "DELETE",
    headers: { Authorization: token },
  };

  const response = await fetch(DEFAULT_API_URL + url, options);
  const data = await response.json();
  return data;
}

export async function createItemImage([shopId, itemId, images]) {
  const url = `/coffeeShops/${shopId}/items/${itemId}/images`;
  const token = localStorage.getItem("Authorization");

  const formData = new FormData();
  images.forEach((image) => {
    formData.append("images", image);
  });

  const options = {
    method: "POST",
    headers: { Authorization: token },
    body: formData,
  };

  const response = await fetch(DEFAULT_API_URL + url, options);
  const data = await response.json();
  return data;
}

export async function deleteItemImage([itemId, imageId]) {
  const url = `/items/${itemId}/images/${imageId}`;
  const token = localStorage.getItem("Authorization");

  const options = {
    method: "DELETE",
    headers: { Authorization: token },
  };

  const response = await fetch(DEFAULT_API_URL + url, options);
  const data = await response.json();
  return data;
}
