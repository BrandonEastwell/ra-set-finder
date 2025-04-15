// Chrome API Action Listeners
chrome.runtime.onInstalled.addListener(() => setBadgeState("OFF"))

async function setBadgeState(state: 'OFF' | 'ON', tabId?: number | undefined ) {
  await chrome.action.setBadgeText({
    tabId,
    text: state
  })
}

export {setBadgeState}
