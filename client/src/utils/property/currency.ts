export function currencySymbol(code?: string | null): string {
  switch ((code ?? "USD").toUpperCase()) {
    case "EUR": return "€";
    case "GBP": return "£";
    case "USD":
    default: return "$";
  }
}
