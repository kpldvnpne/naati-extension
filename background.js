chrome.contextMenus.onClicked.addListener(genericOnClick);

// TODO: Create a new release on Github

const menuItemId = 'download-with-ytdlp';

function writeToClipboard(frameUrl) {
  // Create command
  let command = `yt-dlp --add-header "Referer: https://www.nepalinaati.com" "${frameUrl}"`

  // Get output file name
  let filename = prompt("Enter the file's name", undefined);

  // Replace / with -
  filename = filename.replaceAll('/', '-');

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

  // Show the document
  const link = 'https://docs.google.com/document/d/1sCb9rl4r_pz-Rf735vy_vBeY-zYi9hbexTMV1jEwlI8/edit?tab=t.0#heading=h.g4j6xv5ingx0';
  window.open(link, "_blank").focus();

  // Say that it has been copied to clipboard
  alert('The link has been copied to clipboard. Paste to terminal according to the document just opened.');
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
