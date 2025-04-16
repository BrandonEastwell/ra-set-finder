interface EventsCacheItem { eventId: number, Artists: string[] }
interface EventsCache { Events: EventsCacheItem[] }

async function getActiveTabFromLocalStorage() {
  const res = await chrome.storage.local.get(["ActiveTab"])
  return res.ActiveTab.isValidTab ? { isValidTab: res.ActiveTab.isValidTab, tabId: res.ActiveTab.tabId } : null;
}

async function getEventCacheFromLocalStorage(eventId: number) {
  const res: EventsCache = await chrome.storage.local.get(["Events"])
  if (res.Events) {
    const cachedEventFound: EventsCacheItem | undefined = res.Events.find((item: { eventId: number; }) => item.eventId === eventId)
    return cachedEventFound ? cachedEventFound : null;
  }
  return null
}

export { getActiveTabFromLocalStorage, getEventCacheFromLocalStorage}