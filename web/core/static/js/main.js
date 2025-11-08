document.addEventListener("DOMContentLoaded", () => {
  const copyrightElement = document.getElementById("footer-copyright");

  if (copyrightElement) {
    const currentYear = new Date().getFullYear();
    copyrightElement.innerText = currentYear;
  }

  const copyToClipboardBtn = document.getElementById("copyUrlBtn");

  if (copyToClipboardBtn) {
    const copyToClipboardCallback = () => {
      navigator.clipboard.writeText(window.location.href);
      copyToClipboardBtn.innerText = "Copied!";
      setTimeout(() => (copyToClipboardBtn.innerText = "Share Link"), 1500);
    };

    copyToClipboardBtn.addEventListener("click", copyToClipboardCallback);
  }
});
