import { EventsCache, EventsCacheItem } from '../types/objects.ts';

async function getActiveTabFromLocalStorage() {
  const res = await chrome.storage.local.get(['activeTab']);
  return res.activeTab.isValidTab
    ? { isValidTab: res.activeTab.isValidTab, tabId: res.activeTab.tabId, eventId: res.activeTab.eventId }
    : { isValidTab: res.activeTab.isValidTab, tabId: res.activeTab.tabId, eventId: null };
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
