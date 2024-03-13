export async function getProvinces() {
  const response = await fetch("https://vapi.vnappmob.com/api/province/");
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const provinces = await response.json();
  return provinces;
}

export async function getDistrict(provinceId) {
  const response = await fetch(
    `https://vapi.vnappmob.com/api/province/district/${provinceId}`
  );
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const districts = await response.json();
  return districts;
}
