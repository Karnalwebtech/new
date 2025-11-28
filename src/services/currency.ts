// currencyUtils.js
export const formatCurrency = (
  amount: number,
  currency: string = "INR",
  locale: string = "en-IN"
) => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(amount);
};

export const getCurrencySymbol = (
  currencyCode: string,
  locale: string = "en-IN"
) => {
  const formatted = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 0,
  }).format(1);

  return formatted.replace(/[0-9.,\s]/g, ""); // remove digits & punctuation
};

export const formatNumberAuto = (
  value: number,
  currencyCode: string,
  locale: string = "en-US"
): string => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode,
  })
    .format(value)
    .replace(/[^0-9.,]/g, ""); // remove symbol if needed
};

// Also optimize the utility function
export const formatNumberUniversal = (value: number, currencyCode: string) => {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: currencyCode,
  })
    .format(value)
    .replace(/[^0-9.,]/g, "");
};