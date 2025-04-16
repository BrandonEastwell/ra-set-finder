// Chrome API Action Listeners
chrome.runtime.onInstalled.addListener(() => setBadgeState("OFF"));
chrome.tabs.onActivated.addListener((activeInfo) => updateActiveTabStatus(activeInfo.tabId));
chrome.tabs.onUpdated.addListener((tabId, _changeInfo, tab) => tab.active ? updateActiveTabStatus(tabId) : null);

async function updateActiveTabStatus(tabId: number) {
  const tab = await chrome.tabs.get(tabId);
  if (tab.url && tab.url.startsWith("https://ra.co/events")) {
    await chrome.storage.local.set({ ActiveTab: { isValidTab: true, tabId: tabId } })
  } else {
    await chrome.storage.local.set({ ActiveTab: { isValidTab: false, tabId: tabId } })
  }
}

async function setBadgeState(state: 'OFF' | 'ON', tabId?: number | undefined ) {
  await chrome.action.setBadgeText({
    tabId,
    text: state
  })
}

export { setBadgeState, updateActiveTabStatus }
