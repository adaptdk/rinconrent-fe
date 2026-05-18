/**
 * Wire up the "Book on Guesty" form. Each form carries the booking base URL
 * in its `data-booking-base` attribute. On submit we open a new tab to that
 * URL with checkIn/checkOut/guests as query params; Guesty handles
 * availability and payment.
 */
export function initBookingForms(): void {
  for (const form of document.querySelectorAll<HTMLFormElement>("[data-booking-form]")) {
    const base = form.dataset.bookingBase ?? "";
    if (!base) continue;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const params = new URLSearchParams();
      for (const key of ["checkIn", "checkOut", "guests"] as const) {
        const value = data.get(key);
        if (value) params.set(key, String(value));
      }
      const qs = params.toString();
      const url = qs ? `${base}?${qs}` : base;
      window.open(url, "_blank", "noopener,noreferrer");
    });
  }
}
