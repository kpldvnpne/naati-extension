chrome.contextMenus.onClicked.addListener(genericOnClick);

const menuItemId = 'download-with-ytdlp';

function writeToClipboard(text) {
  console.debug("Writing to clipboard");
  navigator.clipboard.writeText(text);
}

async function copyToClipboard(text, tab) {
  console.debug("Executing script");
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: writeToClipboard,
    args: [text],
  });
}

async function copyToCurrentTabClipboard(text) {
  console.debug("Writing to tab");
  const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
  console.debug('Tab id', tab.id);
  await copyToClipboard(text, tab);
  console.debug("URL Copied");
}

function genericOnClick(info) {
  switch (info.menuItemId) {
    case menuItemId:
      console.debug('What we needed: iframe clicked');
      if (info.frameUrl != undefined) {
        const frameUrl = info.frameUrl;
        console.debug(`Frame url exists: ${frameUrl}`);
        // TODO: Show the link
        const command = `yt-dlp --add-header "Referer: https://www.nepalinaati.com" "${frameUrl}"`
        copyToCurrentTabClipboard(command);
      }
      break;
    default:
      console.debug('Other clicked');
  }
}

chrome.runtime.onInstalled.addListener(function () {
  console.debug("Installed run");
  chrome.contextMenus.create({
    title: 'Download with yt-dlp',
    contexts: ['page'], // TODO: Show in nepalinaati.com only. And only show on iframes.
    id: menuItemId,
  }, function () {
    console.debug("Context menu added");
  });
});
