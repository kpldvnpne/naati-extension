chrome.contextMenus.onClicked.addListener(genericOnClick);

const menuItemId = 'download-with-ytdlp';

function writeToClipboard(frameUrl) {
  // Create command
  let command = `yt-dlp --add-header "Referer: https://www.nepalinaati.com" "${frameUrl}"`

  // Get output file name
  let filename = prompt("Enter the file's name", undefined);

  // Use .mp4 ext by default
  if (!filename.endsWith('.mp4')) {
    filename += '.mp4';
  }

  // Update command if filename exists
  if (filename != undefined) {
    command += ` -o ${filename}`
  }

  // Write to clipboard
  console.debug("Writing to clipboard");
  navigator.clipboard.writeText(command);
}

async function copyToClipboard(frameUrl, tab) {
  console.debug("Executing script");
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: writeToClipboard,
    args: [frameUrl],
  });
}

async function copyToCurrentTabClipboard(frameUrl) {
  console.debug("Writing to tab");
  const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
  console.debug('Tab id', tab.id);
  await copyToClipboard(frameUrl, tab);
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
        // TODO: Say the file will be downloaded as <name> as popup
        copyToCurrentTabClipboard(frameUrl);
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
    contexts: ['frame'],
    id: menuItemId,
    // documentUrlPatterns: ['*://*.nepalinaati.com/*'] // Not possible in that website, possibly because they disable contextMenu
  }, function () {
    console.debug("Context menu added");
  });
});
