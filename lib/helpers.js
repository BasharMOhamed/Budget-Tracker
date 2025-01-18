import { Currencies } from "./currencies";

export function getFormatterForCurrency(currency) {
  const locale = Currencies.find((c) => c.value === currency)?.locale;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  });
}

export function currencyStringToNumber(currencyString) {
  // Remove the currency symbol and grouping separators
  const cleanedString = currencyString.replace(/[^0-9.]/g, "");

  // Convert the cleaned string to a number
  return Number(cleanedString);
}
