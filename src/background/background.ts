import Tab = chrome.tabs.Tab;
chrome.runtime.onInstalled.addListener(() => setBadgeState("OFF"))
chrome.action.onClicked.addListener(clickHandler);

async function clickHandler(tab: Tab) {
  const url = "https://ra.co/events"
  if (tab.id && tab.url?.startsWith(url)) {
    const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
    const newState = prevState === "ON" ? "OFF" : "ON";

    await setBadgeState(newState, tab.id);
    await executeContentScript(newState, tab.id);
  }
}

async function setBadgeState(state: 'OFF' | 'ON', tabId?: number | undefined ) {
  await chrome.action.setBadgeText({
    tabId,
    text: state
  })
}

async function executeContentScript(nextState: 'OFF' | 'ON', tabId: number) {
  if (nextState === "ON") {
    await chrome.scripting.executeScript({
      target: { tabId },
      files: ["scraper.js"]
    })
  }
}

export {setBadgeState, executeContentScript, clickHandler}
