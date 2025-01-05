export const Currencies = [
  {
    value: "USD",
    label: "$ Dollar",
    locale: "en-US",
  },
  {
    value: "EUR",
    label: "€ Euro",
    locale: "de-DE",
  },
  {
    value: "JPY",
    label: "¥ Yen",
    locale: "ja-JP",
  },
  {
    value: "GBP",
    label: "£ Pound",
    locale: "en-GB",
  },
];

export function getCurrency(value) {
  return Currencies.find((c) => c.value === value);
}
