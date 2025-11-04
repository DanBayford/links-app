document.addEventListener("DOMContentLoaded", () => {
  const copyToClipboardBtn = document.getElementById("copyUrlBtn");

  if (copyToClipboardBtn) {
    const copyToClipboardCallback = () => {
      const sharableUrl = window.location.href.replace("/preview", ""); // Remove trailing '/preview' if present
      navigator.clipboard.writeText(sharableUrl);
      copyToClipboardBtn.innerText = "Copied!";
      setTimeout(() => (copyToClipboardBtn.innerText = "Share Link"), 1500);
    };

    copyToClipboardBtn.addEventListener("click", copyToClipboardCallback);
  }
});
