interface EventsCacheItem {
  eventId: number;
  Artists: string[];
}
interface EventsCache {
  Events: EventsCacheItem[];
}

async function getActiveTabFromLocalStorage() {
  const res = await chrome.storage.local.get(['ActiveTab']);
  return res.ActiveTab.isValidTab
    ? { isValidTab: res.ActiveTab.isValidTab, tabId: res.ActiveTab.tabId, eventId: res.ActiveTab.eventId }
    : { isValidTab: res.ActiveTab.isValidTab, tabId: res.ActiveTab.tabId, eventId: null };
}

async function getEventsCacheFromLocalStorage(eventId: number) {
  const res: EventsCache = await chrome.storage.local.get(['Events']);
  if (res.Events) {
    const cachedEventFound: EventsCacheItem | undefined = res.Events.find(
      (item: EventsCacheItem) => item.eventId === eventId,
    );
    return cachedEventFound ? cachedEventFound : null;
  }
  return null;
}

export { getActiveTabFromLocalStorage, getEventsCacheFromLocalStorage };
