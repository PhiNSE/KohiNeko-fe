export const moneyFormat = (value) => {
  if (!value) {
    return null;
  }
  const formattedValue = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return formattedValue;
};
