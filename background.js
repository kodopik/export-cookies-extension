chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "exportCookies") {
    chrome.cookies.getAll({}, cookies => {
      let output = "# Netscape HTTP Cookie File\n" +
                   "# https://curl.se/docs/http-cookies.html\n\n";
      
      cookies.forEach(cookie => {
        let includeSubdomains = cookie.hostOnly ? "FALSE" : "TRUE";
        let domain = cookie.domain;
        if (!cookie.hostOnly && domain.charAt(0) !== ".") {
          domain = "." + domain;
        }
        let path = cookie.path;
        let secure = cookie.secure ? "TRUE" : "FALSE";
        let expiration = cookie.expirationDate ? Math.floor(cookie.expirationDate) : 0;
        output += `${domain}\t${includeSubdomains}\t${path}\t${secure}\t${expiration}\t${cookie.name}\t${cookie.value}\n`;
      });
      
      const dataUrl = "data:text/plain;charset=utf-8," + encodeURIComponent(output);
      
      chrome.downloads.download({
        url: dataUrl,
        filename: "cookies.txt",
        saveAs: true
      }, function(downloadId) {
         if (downloadId) {
            console.log("Download started, ID:", downloadId);
         } else {
            console.error("Download initiation error.");
         }
      });
    });
  }
});

