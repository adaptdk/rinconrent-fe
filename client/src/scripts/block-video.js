// Lazy-load YouTube iframes — swap data-src to src on intersection
const iframes = document.querySelectorAll("[data-block-video] iframe[data-src]");

if (iframes.length > 0 && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const iframe = /** @type {HTMLIFrameElement} */ (entry.target);
          if (iframe.dataset.src) {
            iframe.src = iframe.dataset.src;
            delete iframe.dataset.src;
          }
          observer.unobserve(iframe);
        }
      });
    },
    { rootMargin: "200px" }
  );

  iframes.forEach((iframe) => observer.observe(iframe));
}
