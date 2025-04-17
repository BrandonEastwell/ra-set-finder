import { EventsCache, EventsCacheItem } from '../types/objects.ts';

async function getActiveTabFromLocalStorage() {
  const res = await chrome.storage.local.get(['activeTab']);
  return res.ActiveTab.isValidTab
    ? { isValidTab: res.ActiveTab.isValidTab, tabId: res.ActiveTab.tabId, eventId: res.ActiveTab.eventId }
    : { isValidTab: res.ActiveTab.isValidTab, tabId: res.ActiveTab.tabId, eventId: null };
}

async function getEventsCacheFromLocalStorage(eventId: number) {
  const res: EventsCache = await chrome.storage.local.get(['events']);
  if (res.events) {
    const cachedEventFound: EventsCacheItem | undefined = res.events.find(
      (item: EventsCacheItem) => item.eventId === eventId,
    );
    return cachedEventFound ? cachedEventFound : null;
  }
  return null;
}

export { getActiveTabFromLocalStorage, getEventsCacheFromLocalStorage };
