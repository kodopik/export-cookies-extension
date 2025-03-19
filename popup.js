document.getElementById('exportBtn').addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: "exportCookies" });
});

