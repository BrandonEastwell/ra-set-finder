async function scrapeArtistsFromDOM(tabId: number) {
  await chrome.scripting.executeScript({
    target: { tabId },
    files: ["./assets/scraper.js"]
  })
}

export {scrapeArtistsFromDOM}