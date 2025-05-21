chrome.contextMenus.onClicked.addListener(genericOnClick);

const menuItemId = 'download-with-ytdlp';

function genericOnClick(info) {
  switch (info.menuItemId) {
    case menuItemId:
      console.debug('What we needed: iframe clicked');
      if (info.frameUrl != undefined) {
        console.debug(`Frame url exists: ${info.frameUrl}`);
        // TODO: Show the link and copy it to the clipboard.
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
